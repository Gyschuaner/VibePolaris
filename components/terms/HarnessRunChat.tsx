"use client";

import { Check, CircleNotch, Clock, WarningCircle, Wrench } from "@phosphor-icons/react";
import { Fragment, useEffect, useRef } from "react";

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

export function HarnessRunChat({ state }: { state: HarnessState }) {
  const threadRef = useRef<HTMLDivElement>(null);
  const frames = harnessStory[state.scenario].slice(0, state.step + 1);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [state.scenario, state.step]);

  return (
    <div className="vp-model-chat vp-harness-chat" aria-label="Harness 对话演示">
      <div className="vp-model-chat-thread" ref={threadRef} role="log" aria-label="Harness 对话消息" aria-live="polite">
        <article className="vp-model-message is-user" aria-label="你的任务">
          <div className="vp-model-message-content"><div className="vp-model-bubble">{harnessTask}</div></div>
        </article>
        {frames.map((request, index) => {
          if (request.edge !== "mh") return null;
          const action = frames[index + 1];
          const result = frames[index + 2];
          const denied = Boolean(action?.denied);
          const failed = Boolean(result?.latest.includes("HTTP 500"));
          const status = denied ? "已拒绝" : result ? failed ? "检查失败" : "已返回" : action ? "执行中" : "等待执行";
          const StatusIcon = denied || failed ? WarningCircle : result ? Check : action ? CircleNotch : Clock;
          const call = request.context.at(-1)?.text ?? "";
          return (
            <Fragment key={index}>
              <article className="vp-model-message is-model" aria-label="模型回复">
                <div className="vp-model-avatar is-model" aria-hidden="true"><GptMark /></div>
                <div className="vp-model-message-content"><span className="vp-model-message-label">模型</span><div className="vp-model-bubble">{request.final ? request.outcome : replies[request.title] ?? request.modelText}</div></div>
              </article>
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
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
