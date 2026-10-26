"use client";

import { useEffect, useRef, useState } from "react";
import { CONTEXT_WARNING, CONTEXT_WINDOW } from "@/lib/xiaobei/events";

const tokens = (value: number) => `${(value / 1000).toFixed(1)}K`;
export function ContextMeter({ value }: { value: { tokens: number; inputTokens?: number } | null }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const percent = value ? Math.min(100, value.tokens / CONTEXT_WINDOW * 100) : 0;
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return <div className="xb-context" ref={root} onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button type="button" className="xb-context-trigger" aria-label={value ? `上下文约用 ${percent.toFixed(1)}%，查看详情` : "查看上下文容量"} aria-expanded={open} aria-controls="xb-context-detail" onClick={() => setOpen(!open)} data-warning={!!value && value.tokens >= CONTEXT_WARNING}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" className="xb-ring-track" /><circle cx="10" cy="10" r="7" pathLength="100" strokeDasharray={`${percent} 100`} transform="rotate(-90 10 10)" /></svg>
      <span>{value ? `约 ${percent.toFixed(1)}%` : "上下文"}</span>
    </button>
    {open && <div className="xb-context-detail" id="xb-context-detail">
      <strong>上下文用量</strong><dl>
        <div><dt>当前会话估算</dt><dd>{value ? `约 ${tokens(value.tokens)}` : "尚未开始"}</dd></div>
        <div><dt>最近模型输入</dt><dd>{value?.inputTokens !== undefined ? tokens(value.inputTokens) : "尚未回传"}</dd></div>
        <div><dt>上下文窗口</dt><dd>256K</dd></div>
        <div><dt>提醒阈值</dt><dd>175K</dd></div>
      </dl><p>按最近一次模型用量校准估算，包含新增消息与工具结果。达到 175K 时提醒，不自动压缩。</p>
    </div>}
  </div>;
}
