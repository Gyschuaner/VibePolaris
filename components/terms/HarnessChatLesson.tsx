"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import type { HarnessState } from "@/lib/harness-v4";

const modelQuestion = "帮我看看这个项目为什么运行失败。";
const modelAnswer = "可能是端口冲突，你可以运行 lsof -i :8000 看一下。";

type ModelChatPhase = "question" | "thinking" | "answer";

function useStreamText(text: string, active: boolean, reduced: boolean) {
  const [length, setLength] = useState(active && !reduced ? 0 : text.length);

  useEffect(() => {
    if (!active || reduced) {
      setLength(text.length);
      return;
    }
    setLength(0);
    const timer = window.setInterval(() => {
      setLength((current) => {
        if (current >= text.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 32);
    return () => window.clearInterval(timer);
  }, [active, reduced, text]);

  return text.slice(0, length);
}

function GptMark({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

export function HarnessModelChat({ state, reduced }: { state: HarnessState; reduced: boolean }) {
  const [phase, setPhase] = useState<ModelChatPhase>(reduced ? "answer" : "question");
  const streamedAnswer = useStreamText(modelAnswer, phase === "answer", reduced);

  useEffect(() => {
    if (reduced) {
      setPhase("answer");
      return;
    }
    setPhase("question");
    const thinkingTimer = window.setTimeout(() => setPhase("thinking"), 900);
    const answerTimer = window.setTimeout(() => setPhase("answer"), 1750);
    return () => {
      window.clearTimeout(thinkingTimer);
      window.clearTimeout(answerTimer);
    };
  }, [reduced, state.scenario]);

  return (
    <div className="vp-model-chat" aria-label="只用模型的对话演示">
      <div className="vp-model-chat-thread" aria-live="polite">
        <div className="vp-model-chat-date">新建对话 · 没有工具连接</div>
        <article className="vp-model-message is-user">
          <div className="vp-model-message-content"><div className="vp-model-bubble">{modelQuestion}</div></div>
        </article>
        {phase === "thinking" ? (
          <div className="vp-model-thinking"><div className="vp-model-avatar" aria-hidden="true"><GptMark size={17} /></div><div className="vp-model-thinking-bubble"><span /><span /><span />模型正在生成回答</div></div>
        ) : (
          <article className="vp-model-message is-model">
            <div className="vp-model-avatar is-model" aria-hidden="true"><GptMark size={17} /></div>
            <div className="vp-model-message-content"><span className="vp-model-message-label">模型</span><div className="vp-model-bubble">{streamedAnswer}{phase === "answer" && streamedAnswer.length < modelAnswer.length ? <span className="vp-model-caret" aria-hidden="true" /> : null}</div></div>
          </article>
        )}
      </div>
      <div className="vp-model-composer" aria-label="继续提问">
        <span>继续问模型……</span>
        <button type="button" disabled aria-label="发送消息"><ArrowUp size={18} weight="bold" /></button>
      </div>
    </div>
  );
}
