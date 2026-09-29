"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUp, Plus, Square, X } from "@phosphor-icons/react";
import type { AgentEvent } from "@/lib/xiaobei/model";

type ChatMessage = { role: "user" | "assistant"; text: string; page?: string };
function Star() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 5" /><path d="M24 3 29 19 45 24 29 29 24 45 19 29 3 24 19 19Z" fill="currentColor" /><path d="m24 15 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="var(--surface)" /><circle cx="38" cy="9" r="2" fill="currentColor" /></svg>;
}

// Render a small, safe Markdown subset; model HTML and external URLs stay plain text.
function Answer({ text, close }: { text: string; close: () => void }) {
  const inline = (value: string): ReactNode[] => value.split(/(\[[^\]\n]+\]\([^\s)]+\)|\*\*[^*\n]+\*\*|`[^`\n]+`)/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\((\/[^\s)]+)\)$/);
    if (link && /^\/(?:terms\/[a-z0-9-]+|guides\/(?:html|css|javascript)|about)?$/.test(link[2])) return <Link key={i} href={link[2]} onClick={close}>{link[1]}</Link>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
  return <div className="xb-answer">{text.split(/(```[\s\S]*?(?:```|$))/g).map((part, i) => part.startsWith("```")
    ? <pre key={i}><code>{part.replace(/^```[^\n]*\n?/, "").replace(/```$/, "")}</code></pre>
    : <span key={i}>{inline(part.replace(/^#{1,6} /gm, ""))}</span>)}</div>;
}

export function Xiaobei() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [credits, setCredits] = useState(100);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [contextTokens, setContextTokens] = useState(0);
  const [pageTitle, setPageTitle] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const request = useRef<AbortController | null>(null);
  const conversation = useRef<string>("");
  const continuing = useRef(false);
  const shouldScroll = useRef(true);

  async function refreshSession() {
    try {
      const response = await fetch("/api/xiaobei/session", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json(); setActive(data.active);
      if (data.active) setCredits(data.credits);
    } catch { /* Public reading is unaffected if the assistant is unavailable. */ }
  }
  useEffect(() => {
    void refreshSession();
    const refresh = () => { void refreshSession(); };
    window.addEventListener("xiaobei-activated", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("xiaobei-activated", refresh); window.removeEventListener("focus", refresh); request.current?.abort(); };
  }, []);
  useEffect(() => {
    if (open) { dialog.current?.showModal(); input.current?.focus(); void refreshSession(); }
    else dialog.current?.close();
  }, [open]);
  useEffect(() => {
    setPageTitle(document.querySelector("h1")?.textContent || (pathname === "/" ? "概念星图" : "当前页面"));
  }, [pathname]);
  useEffect(() => { if (shouldScroll.current && log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, status]);

  async function send() {
    const text = draft.trim();
    if (!text || busy || !active) return;
    if (!conversation.current) conversation.current = crypto.randomUUID();
    const currentPage = `${window.location.pathname}${window.location.search}`;
    const currentTitle = document.querySelector("h1")?.textContent || pageTitle;
    setMessages(prev => [...prev, { role: "user", text, page: currentTitle }, { role: "assistant", text: "" }]);
    setDraft(""); setError(""); setBusy(true); setStatus("正在理解问题"); shouldScroll.current = true;
    const controller = new AbortController(); request.current = controller;
    let done = false;
    try {
      const response = await fetch("/api/xiaobei/chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ requestId: crypto.randomUUID(), conversationId: conversation.current, continuing: continuing.current, message: text, page: currentPage }),
      });
      if (!response.ok) { const data = await response.json(); if (response.status === 401) setActive(false); throw new Error(data.error || "小北暂时不可用。"); }
      continuing.current = true;
      if (!response.body) throw new Error("连接未能建立，请重试。");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });
          let newline: number;
          while ((newline = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1); if (!line) continue;
            const event = JSON.parse(line) as AgentEvent;
            if (event.type === "delta" && event.text) { setStatus(""); setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, text: m.text + event.text } : m)); }
            if (event.type === "status") setStatus(event.text || "");
            if (event.type === "context") setContextTokens(event.tokens || 0);
            if (event.type === "balance") setCredits(event.credits ?? 0);
            if (event.type === "error") { setError(event.text || "回答中断，请重试。"); if (event.status === 401) setActive(false); }
            if (event.type === "done") done = true;
          }
        }
      } finally { await reader.cancel().catch(() => {}); }
      if (!done) throw new Error("连接已中断，已收到的内容已保留。");
    } catch (failure) { setError(controller.signal.aborted ? "已停止生成，已收到的内容已保留。" : failure instanceof Error ? failure.message : "连接中断，请重试。"); }
    finally { request.current = null; setBusy(false); setStatus(""); void refreshSession(); input.current?.focus(); }
  }
  function newConversation() {
    if (busy) return;
    conversation.current = crypto.randomUUID(); continuing.current = false;
    setMessages([]); setContextTokens(0); setError(""); setStatus(""); setDraft(""); input.current?.focus();
  }

  return <>
    {active && <button className="xb-trigger" onClick={() => setOpen(true)} aria-label="问问小北" title="问问小北" aria-haspopup="dialog"><Star /><span>问问小北</span></button>}
    <dialog ref={dialog} className="xb-dialog" aria-labelledby="xb-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="xb-panel">
        <header className="xb-header"><div className="xb-identity"><Star /><div><h2 id="xb-title">小北</h2><p>把概念聊明白</p></div></div><div className="xb-actions"><button type="button" disabled={busy} title="新对话" aria-label="新对话" onClick={newConversation}><Plus size={19} /></button><button type="button" title="关闭小北" aria-label="关闭小北" onClick={() => setOpen(false)}><X size={20} /></button></div></header>
        <div className="xb-meta"><span title={pageTitle}>正在阅读 · {pageTitle}</span><span title="每码每日 100 积分，北京时间零点恢复">{credits.toFixed(3)} 积分</span></div>
        <div className="xb-log" ref={log} aria-label="对话记录" onScroll={() => { const el = log.current; if (el) shouldScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}>
          {!messages.length && <div className="xb-welcome"><Star /><h3>哪一个概念，<br />还差一点就懂了？</h3><p>从当前词条开始聊，也可以把两个概念放在一起比较。</p><div className="xb-suggestions">{["用一个例子解释当前词条", "Agent 和 Harness 有什么区别？"].map(text => <button key={text} onClick={() => { setDraft(text); input.current?.focus(); }}>{text}<ArrowUp size={15} /></button>)}</div></div>}
          {messages.map((message, index) => <article className={`xb-message xb-${message.role}`} key={index}>{message.role === "user" ? <><span className="xb-message-page">{message.page}</span><p>{message.text}</p></> : message.text && <><span className="xb-speaker">小北</span><Answer text={message.text} close={() => setOpen(false)} /></>}</article>)}
          <div role="status" aria-live="polite" className="xb-status">{busy && status && <><i />{status}</>}</div>
          {error && <p className="xb-error" role="alert">{error}</p>}
          {!active && open && <p className="xb-error">授权已失效，请联系邀请人重新激活。</p>}
        </div>
        <footer className="xb-compose">
          {contextTokens >= 175_000 && <p className="xb-warning">当前会话上下文已达到 175K，默认窗口为 256K，继续对话可能接近容量上限。</p>}
          <form onSubmit={event => { event.preventDefault(); void send(); }}>
            <textarea ref={input} value={draft} rows={2} placeholder="问问这个词，或说说哪里没懂…" aria-label="给小北的问题" disabled={!active} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }} />
            {busy ? <button type="button" className="xb-send" aria-label="停止生成" title="停止生成" onClick={() => request.current?.abort()}><Square size={16} weight="fill" /></button> : <button type="submit" className="xb-send" disabled={!draft.trim() || !active} aria-label="发送问题" title="发送问题"><ArrowUp size={20} weight="bold" /></button>}
          </form>
          <div className="xb-footnote"><span>仅限平台使用与相关技术知识</span>{contextTokens > 0 && <span>上下文约 {(contextTokens / 1000).toFixed(1)}K / 256K</span>}</div>
        </footer>
      </div>
    </dialog>
  </>;
}
