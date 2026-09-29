"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Plus, Square, X } from "@phosphor-icons/react";
import { applyEvent, finishActivities, CONTEXT_WARNING, type AgentEvent, type ChatBlock } from "@/lib/xiaobei/events";
import { Transcript, ContextMeter } from "./Transcript";

type ChatMessage = { role: "user" | "assistant"; text: string; page?: string; blocks: ChatBlock[] };
function Star() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 5" /><path d="M24 3 29 19 45 24 29 29 24 45 19 29 3 24 19 19Z" fill="currentColor" /><path d="m24 15 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="var(--surface)" /><circle cx="38" cy="9" r="2" fill="currentColor" /></svg>;
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
  const [context, setContext] = useState<{ tokens: number; inputTokens?: number } | null>(null);
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
    setMessages(prev => [...prev, { role: "user", text, page: currentTitle, blocks: [] }, { role: "assistant", text: "", blocks: [] }]);
    setDraft(""); setError(""); setBusy(true); setStatus("正在理解问题"); shouldScroll.current = true;
    const controller = new AbortController(); request.current = controller;
    let done = false;
    let failed = false;
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
            if (["delta", "text_end", "think", "tool"].includes(event.type)) {
              setStatus(""); setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, blocks: applyEvent(m.blocks, event) } : m));
            }
            if (event.type === "status") setStatus(event.text || "");
            if (event.type === "context") setContext({ tokens: event.tokens, inputTokens: event.inputTokens });
            if (event.type === "balance") setCredits(event.credits ?? 0);
            if (event.type === "error") { failed = true; setError(event.text || "回答中断，请重试。"); if (event.status === 401) setActive(false); }
            if (event.type === "done") done = true;
          }
        }
      } finally { await reader.cancel().catch(() => {}); }
      if (!done) throw new Error("连接已中断，已收到的内容已保留。");
    } catch (failure) { setError(controller.signal.aborted ? "已停止生成，已收到的内容已保留。" : failure instanceof Error ? failure.message : "连接中断，请重试。"); }
    finally {
      if (!done || failed) setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, blocks: finishActivities(m.blocks, controller.signal.aborted ? "stopped" : "error") } : m));
      request.current = null; setBusy(false); setStatus(""); void refreshSession(); input.current?.focus();
    }
  }
  function newConversation() {
    if (busy) return;
    conversation.current = crypto.randomUUID(); continuing.current = false;
    setMessages([]); setContext(null); setError(""); setStatus(""); setDraft(""); input.current?.focus();
  }

  return <>
    {active && <button className="xb-trigger" onClick={() => setOpen(true)} aria-label="问问小北" title="问问小北" aria-haspopup="dialog"><Star /><span>问问小北</span></button>}
    <dialog ref={dialog} className="xb-dialog" aria-labelledby="xb-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="xb-panel">
        <header className="xb-header"><div className="xb-identity"><Star /><div><h2 id="xb-title">小北</h2><p>把概念聊明白</p></div></div><div className="xb-actions"><button type="button" disabled={busy} title="新对话" aria-label="新对话" onClick={newConversation}><Plus size={19} /></button><button type="button" title="关闭小北" aria-label="关闭小北" onClick={() => setOpen(false)}><X size={20} /></button></div></header>
        <div className="xb-log" ref={log} aria-label="对话记录" onScroll={() => { const el = log.current; if (el) shouldScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}>
          {!messages.length && <div className="xb-welcome"><Star /><h3>哪一个概念，<br />还差一点就懂了？</h3><p>从当前词条开始聊，也可以把两个概念放在一起比较。</p><div className="xb-suggestions">{["用一个例子解释当前词条", "Agent 和 Harness 有什么区别？"].map(text => <button key={text} onClick={() => { setDraft(text); input.current?.focus(); }}>{text}<ArrowUp size={15} /></button>)}</div></div>}
          {messages.map((message, index) => <article className={`xb-message xb-${message.role}`} key={index}>{message.role === "user" ? <><span className="xb-message-page">{message.page}</span><p>{message.text}</p></> : message.blocks.length > 0 && <><span className="xb-speaker">小北</span><Transcript blocks={message.blocks} close={() => setOpen(false)} /></>}</article>)}
          <div role="status" aria-live="polite" className="xb-status">{busy && status && <><i />{status}</>}</div>
          {error && <p className="xb-error" role="alert">{error}</p>}
          {!active && open && <p className="xb-error">授权已失效，请联系邀请人重新激活。</p>}
        </div>
        <footer className="xb-compose">
          {context && context.tokens >= CONTEXT_WARNING && <p className="xb-warning">上下文已达 175K，可继续对话；接近 256K 时建议开启新对话。</p>}
          <form onSubmit={event => { event.preventDefault(); void send(); }}>
            <textarea ref={input} value={draft} rows={2} placeholder="问问这个词，或说说哪里没懂…" aria-label="给小北的问题" disabled={!active} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }} />
            {busy ? <button type="button" className="xb-send" aria-label="停止生成" title="停止生成" onClick={() => request.current?.abort()}><Square size={16} weight="fill" /></button> : <button type="submit" className="xb-send" disabled={!draft.trim() || !active} aria-label="发送问题" title="发送问题"><ArrowUp size={20} weight="bold" /></button>}
          </form>
          <div className="xb-footnote"><span title="每码每日 100 积分，北京时间零点恢复">今日剩余 {credits.toFixed(3)} 积分</span><ContextMeter value={context} /></div>
        </footer>
      </div>
    </dialog>
  </>;
}
