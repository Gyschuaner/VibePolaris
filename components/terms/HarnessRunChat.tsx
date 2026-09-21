"use client";

import { Check, CircleNotch, Clock, WarningCircle, Wrench } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { harnessStory, harnessTask, type HarnessState } from "@/lib/harness-v4";
import { GptMark } from "./HarnessChatLesson";

const replies: Record<string, string> = {
  "请求读取日志": "我先读一下 server.log，看看服务为什么没启动。",
  "请求查看源码": "日志提示第一行有语法错误。我再打开 app.py，确认具体代码。",
  "请求补上冒号": "函数定义后少了一个冒号，我来补上。",
  "请求运行检查": "修改已写入。接着启动服务，检查 /health 是否正常。",
  "请求修改返回值": "语法检查通过了，但接口仍返回 500。返回值写错了，我继续修正。",
  "请求复测": "返回值已修正，再运行一次检查。",
};

function HarnessReply({ text, reduced, speed, active, step, onComplete, children }: {
  text: string;
  reduced: boolean;
  speed: number;
  active: boolean;
  step: number;
  onComplete: (step: number) => void;
  children?: ReactNode;
}) {
  const [length, setLength] = useState(active ? 0 : text.length);
  const complete = reduced || length >= text.length;

  useEffect(() => {
    if (complete) return;
    const timer = window.setTimeout(() => setLength((current) => current + 1), 32 / speed);
    return () => window.clearTimeout(timer);
  }, [complete, length, speed]);

  useEffect(() => {
    if (complete && active) onComplete(step);
  }, [complete, active, step, onComplete]);

  return (
    <>
    <article className="vp-model-message is-model" aria-label="模型回复" aria-busy={!complete}>
      <div className="vp-model-avatar is-model" aria-hidden="true"><GptMark /></div>
      <div className="vp-model-message-content"><span className="vp-model-message-label">模型</span><div className="vp-model-bubble">{complete ? text : text.slice(0, length)}{!complete && <span className="vp-model-caret" aria-hidden="true" />}</div></div>
    </article>
    {complete && children}
    </>
  );
}

export function HarnessRunChat({ state, reduced, onReplyComplete }: { state: HarnessState; reduced: boolean; onReplyComplete: (step: number) => void }) {
  const threadRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const frames = harnessStory[state.scenario].slice(0, state.step + 1);

  const latestRequest = frames.findLastIndex(frame => frame.edge === "mh");

  useEffect(() => {
    const thread = threadRef.current;
    const messages = messagesRef.current;
    if (!thread || !messages) return;
    const observer = new ResizeObserver(() => { thread.scrollTop = thread.scrollHeight; });
    observer.observe(messages);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [state.scenario, state.step]);

  return (
    <div className="vp-model-chat vp-harness-chat" aria-label="Harness 对话演示">
      {latestRequest > 1 && <button className="vp-history-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "收起记录，只看当前一轮" : "展开完整对话记录"}</button>}
      <div className="vp-model-chat-thread" ref={threadRef} role="log" aria-label="Harness 对话消息" aria-live="polite">
        <div ref={messagesRef}>
        <article className="vp-model-message is-user" aria-label="你的任务">
          <div className="vp-model-message-content"><div className="vp-model-bubble">{harnessTask}</div></div>
        </article>
        {frames.map((request, index) => {
          if (request.edge !== "mh") return null;
          const visible = expanded || index === latestRequest;
          const action = frames[index + 1];
          const result = frames[index + 2];
          const denied = Boolean(action?.denied);
          const failed = Boolean(result?.latest.includes("HTTP 500"));
          const status = denied ? "已拒绝" : result ? failed ? "检查失败" : "已返回" : action ? "执行中" : "等待执行";
          const StatusIcon = denied || failed ? WarningCircle : result ? Check : action ? CircleNotch : Clock;
          const call = request.context.at(-1)?.text ?? "";
          return (
            <div key={index} className="vp-harness-turn" data-open={visible} inert={!visible} aria-hidden={!visible}><div className="vp-harness-turn-clip">
            <HarnessReply text={request.final ? request.outcome ?? request.modelText : replies[request.title] ?? request.modelText} reduced={reduced} speed={state.speed} active={index === state.step} step={index} onComplete={onReplyComplete}>
              {!request.final && (
                <article className="vp-harness-tool" aria-label={`Harness 工具调用：${call}`} data-status={denied || failed ? "blocked" : result ? "returned" : action ? "running" : "pending"}>
                  <div className="vp-harness-tool-header">
                    <span><Wrench size={14} aria-hidden="true" />Harness</span>
                    <span className="vp-harness-tool-status"><StatusIcon size={14} aria-hidden="true" />{status}</span>
                  </div>
                  <code className="vp-harness-tool-call">{call}</code>
                  {result && <pre className="vp-harness-tool-result">{result.latest}</pre>}
                </article>
              )}
            </HarnessReply>
            </div></div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
