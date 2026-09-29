"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Brain, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { CONTEXT_WARNING, CONTEXT_WINDOW, type ActivityBlock } from "@/lib/xiaobei/events";

export function Answer({ text, close }: { text: string; close: () => void }) {
  return <div className="xb-answer"><Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
    a: ({ href, children }) => href && /^\/(?:terms\/[a-z0-9-]+|guides\/(?:html|css|javascript)|about)?$/.test(href)
      ? <Link href={href} onClick={close}>{children}</Link> : <>{children}</>,
    img: () => null,
    table: ({ children }) => <div className="xb-table"><table>{children}</table></div>,
  }}>{text}</Markdown></div>;
}

function Elapsed({ block }: { block: ActivityBlock }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (block.state !== "running") return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [block.state]);
  return <span className="xb-elapsed">{(Math.max(0, (block.finishedAt ?? now) - block.startedAt) / 1000).toFixed(1)}s</span>;
}

export function Activity({ block }: { block: ActivityBlock }) {
  const think = block.kind === "think";
  const label = think ? "Think" : block.name === "search_terms" ? "搜索词条" : block.name === "read_term" ? "读取词条" : "工具";
  const preview = think ? (block.state === "running" ? block.text.trim().split("\n").at(-1) : block.text.split("\n")[0]) : block.summary;
  const stateLabel = { running: "进行中", complete: "已完成", error: "未完成", stopped: "已停止" }[block.state];
  const Icon = think ? Brain : block.name === "search_terms" ? MagnifyingGlass : BookOpen;
  return <details className="xb-activity" data-state={block.state}>
    <summary aria-label={`${label} · ${stateLabel} · ${preview || ""}`}>
      <Icon size={15} /><span className="xb-activity-label">{label}</span><Elapsed block={block} />
      <span className="xb-activity-preview">{block.state === "error" || block.state === "stopped" ? stateLabel : preview}</span><CaretRight size={12} className="xb-chevron" />
    </summary>
    <div className="xb-activity-body">{think ? <p>{block.text}</p> : <>
      <span className="xb-tool-name">{block.name}</span><h4>参数</h4><pre>{block.input}</pre>
      {block.output && <><h4>结果</h4><pre>{block.output}</pre></>}
    </>}</div>
  </details>;
}

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
