"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUp, ChatCircle, ClockCounterClockwise, Plus, Square, X } from "@phosphor-icons/react";
import { applyEvent, finishActivities, CONTEXT_WARNING, type AgentEvent } from "@/lib/xiaobei/events";
import type { ChatMessage, ContextUsage, ConversationDetail, ConversationSummary } from "@/lib/xiaobei/history";
import { Transcript, ContextMeter } from "./Transcript";
import { XiaobeiStar } from "./XiaobeiStar";

const HISTORY_REQUEST_TIMEOUT = 12_000;
async function readHistory<T>(query = ""): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HISTORY_REQUEST_TIMEOUT);
  try {
    const response = await fetch(`/api/xiaobei/conversations${query}`, { cache: "no-store", signal: controller.signal });
    const data = await response.json();
    if (!response.ok) throw Object.assign(new Error(data.error || "暂时无法加载对话。"), { status: response.status });
    return data;
  } catch (error) {
    if (controller.signal.aborted) throw new Error("历史对话加载超时，请重试。");
    throw error;
  } finally { clearTimeout(timeout); }
}
function historyTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toDateString() === new Date().toDateString()
    ? date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export function Xiaobei({ termNames, newsNames }: { termNames: Record<string, string>; newsNames: Record<string, string> }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [credits, setCredits] = useState(100);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [context, setContext] = useState<ContextUsage | null>(null);
  const [scope, setScope] = useState("");
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ConversationSummary[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [remoteRunning, setRemoteRunning] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const request = useRef<AbortController | null>(null);
  const conversation = useRef<string>("");
  const continuing = useRef(false);
  const shouldScroll = useRef(true);
  const scopeRef = useRef("");
  const loadedScope = useRef("");
  const viewSequence = useRef(0);
  const historySequence = useRef(0);
  const drafts = useRef(new Map<string, string>());
  const locked = busy || remoteRunning || loading;

  function remember(id: string) {
    try { localStorage.setItem(`vp-xiaobei-current:${scopeRef.current}`, id); } catch { /* History is still saved on the server. */ }
  }
  async function loadHistory(offset = 0) {
    const sequence = ++historySequence.current, owner = scopeRef.current;
    setHistoryLoading(true);
    try {
      const data = await readHistory<{ items: ConversationSummary[]; nextOffset: number | null }>(`?offset=${offset}`);
      if (sequence === historySequence.current && owner === scopeRef.current) {
        setHistory(items => offset ? [...items, ...data.items.filter(item => !items.some(old => old.id === item.id))] : data.items);
        setNextOffset(data.nextOffset);
      }
      return data.items;
    } catch (error) {
      if ((error as { status?: number }).status === 401 && owner === scopeRef.current) await refreshSession();
      throw error;
    } finally { if (sequence === historySequence.current) setHistoryLoading(false); }
  }
  async function loadConversation(id: string, switchView = true) {
    const sequence = ++viewSequence.current, owner = scopeRef.current;
    if (switchView) setLoading(true);
    try {
      const data = await readHistory<ConversationDetail>(`?id=${encodeURIComponent(id)}`);
      if (sequence !== viewSequence.current || owner !== scopeRef.current) return;
      conversation.current = id; continuing.current = true;
      setSelected(id); setTitle(data.title); setMessages(data.messages); setContext(data.context); setRemoteRunning(data.running); setError("");
      if (switchView) { setDraft(drafts.current.get(id) || ""); setHistoryOpen(false); shouldScroll.current = true; }
      remember(id);
    } catch (error) {
      if ((error as { status?: number }).status === 401 && owner === scopeRef.current) await refreshSession();
      throw error;
    } finally { if (sequence === viewSequence.current && switchView) setLoading(false); }
  }
  async function restoreHistory() {
    const owner = scopeRef.current;
    if (!owner || loadedScope.current === owner) return;
    loadedScope.current = owner; setLoading(true);
    try {
      let saved: string | null = null;
      try { saved = localStorage.getItem(`vp-xiaobei-current:${owner}`); } catch { /* Use the most recent conversation. */ }
      // The selected conversation and the list are independent requests. Start
      // both together so reopening an existing chat does not pay two network
      // round trips before showing its content.
      let selectedError: unknown = null;
      const selectedRequest = saved
        ? loadConversation(saved).catch(error => { selectedError = error; })
        : null;
      const items = await loadHistory();
      if (scopeRef.current !== owner) return;
      if (selectedRequest) await selectedRequest;
      if (selectedError) {
        if ((selectedError as { status?: number }).status !== 404) throw selectedError;
        if (items[0]) await loadConversation(items[0].id);
        else remember("");
      } else if (!saved && items[0]) {
        await loadConversation(items[0].id);
      }
    } catch (error) {
      if (scopeRef.current === owner) { loadedScope.current = ""; setError(error instanceof Error ? error.message : "暂时无法加载历史对话。"); }
    } finally { if (scopeRef.current === owner) setLoading(false); }
  }

  async function refreshSession() {
    try {
      const response = await fetch("/api/xiaobei/session", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json(); setActive(data.active);
      const nextScope = data.active ? data.historyScope || "" : "";
      if (nextScope !== scopeRef.current) {
        request.current?.abort(); viewSequence.current++; historySequence.current++;
        scopeRef.current = nextScope; loadedScope.current = ""; setScope(nextScope);
        conversation.current = ""; continuing.current = false; drafts.current.clear();
        setSelected(""); setTitle(""); setMessages([]); setContext(null); setHistory([]); setDraft(""); setError("");
        setBusy(false); setRemoteRunning(false); setLoading(false); setHistoryLoading(false);
      }
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
  useEffect(() => { if (open && active && scope) void restoreHistory(); }, [open, active, scope]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (open && !historyOpen) input.current?.focus(); }, [open, historyOpen]);
  useEffect(() => {
    if (!open || !remoteRunning || !selected || busy) return;
    let pending = false, disposed = false;
    const timer = setInterval(async () => {
      if (pending) return;
      pending = true;
      try { await loadConversation(selected, false); }
      catch (error) { if (!disposed) setError(error instanceof Error ? error.message : "暂时无法恢复回答。"); }
      finally { pending = false; }
    }, 1500);
    return () => { disposed = true; clearInterval(timer); };
  }, [open, remoteRunning, selected, busy]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPageTitle(document.querySelector("h1")?.textContent || (pathname === "/" ? "概念星图" : "当前页面"));
  }, [pathname]);
  useEffect(() => { if (shouldScroll.current && log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, status]);

  async function send() {
    const text = draft.trim();
    if (!text || locked || request.current || !active) return;
    if (!conversation.current) conversation.current = crypto.randomUUID();
    const id = conversation.current, owner = scopeRef.current, wasContinuing = continuing.current, run = crypto.randomUUID();
    const isCurrent = () => scopeRef.current === owner && conversation.current === id;
    const currentPage = `${window.location.pathname}${window.location.search}`;
    const currentTitle = document.querySelector("h1")?.textContent || pageTitle;
    setSelected(id); setTitle(old => old || Array.from(text).slice(0, 40).join(""));
    setMessages(prev => [...prev, { id: `${run}-user`, role: "user", text, page: currentTitle, blocks: [] }, { id: `${run}-assistant`, role: "assistant", text: "", blocks: [] }]);
    setDraft(""); setError(""); setBusy(true); setStatus("正在理解问题"); shouldScroll.current = true;
    const controller = new AbortController(); request.current = controller;
    let done = false;
    let failed = false;
    let accepted = false;
    try {
      const response = await fetch("/api/xiaobei/chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ requestId: run, conversationId: id, continuing: wasContinuing, message: text, page: currentPage }),
      });
      if (!response.ok) { const data = await response.json(); if (response.status === 401) setActive(false); throw new Error(data.error || "小北暂时不可用。"); }
      accepted = true;
      if (isCurrent()) { continuing.current = true; remember(id); drafts.current.delete(id); }
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
            if (!isCurrent()) continue;
            if (["delta", "text_end", "think", "tool"].includes(event.type)) {
              setStatus(""); setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, blocks: applyEvent(m.blocks, event) } : m));
            }
            if (event.type === "status") setStatus(event.text || "");
            if (event.type === "context") setContext({ tokens: event.tokens, inputTokens: event.inputTokens });
            if (event.type === "balance") setCredits(event.credits ?? 0);
            if (event.type === "error") { failed = true; setMessages(prev => prev.map(m => m.id === `${run}-assistant` ? { ...m, error: event.text } : m)); if (event.status === 401) void refreshSession(); }
            if (event.type === "done") done = true;
          }
        }
      } finally { await reader.cancel().catch(() => {}); }
      if (!done) throw new Error("连接已中断，已收到的内容已保留。");
    } catch (failure) {
      if (isCurrent()) {
        setError(controller.signal.aborted ? "已停止生成，已收到的内容已保留。" : failure instanceof Error ? failure.message : "连接中断，请重试。");
        if (!accepted) {
          setMessages(prev => prev.filter(m => m.id !== `${run}-user` && m.id !== `${run}-assistant`)); setDraft(text);
          if (!wasContinuing) { conversation.current = ""; setSelected(""); setTitle(""); }
        }
      }
    }
    finally {
      if (isCurrent()) {
        if (!done || failed) setMessages(prev => prev.map(m => m.id === `${run}-assistant` ? { ...m, blocks: finishActivities(m.blocks, controller.signal.aborted ? "stopped" : "error") } : m));
        if (accepted) { try { await loadConversation(id, false); } catch { /* Keep already received text when offline. */ } }
      }
      if (scopeRef.current === owner) { setBusy(false); setStatus(""); void loadHistory().catch(() => {}); void refreshSession(); input.current?.focus(); }
      if (request.current === controller) request.current = null;
    }
  }
  function newConversation() {
    if (locked) return;
    drafts.current.set(conversation.current, draft); viewSequence.current++;
    conversation.current = ""; continuing.current = false; remember("");
    setSelected(""); setTitle(""); setHistoryOpen(false); setMessages([]); setContext(null); setError(""); setStatus(""); setDraft(drafts.current.get("") || ""); input.current?.focus();
  }
  function selectConversation(id: string) {
    if (locked) return;
    drafts.current.set(conversation.current, draft);
    void loadConversation(id).catch(error => setError(error instanceof Error ? error.message : "暂时无法打开对话。"));
  }
  function showHistory() {
    setHistoryOpen(true);
    void loadHistory().catch(error => setError(error instanceof Error ? error.message : "暂时无法加载历史对话。"));
  }

  return <>
    {active && <button className="xb-trigger" onClick={() => setOpen(true)} aria-label="问问小北" title="问问小北" aria-haspopup="dialog"><XiaobeiStar /><span>问问小北</span></button>}
    <dialog ref={dialog} className="xb-dialog" aria-labelledby="xb-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="xb-panel">
        <header className="xb-header"><div className="xb-identity"><XiaobeiStar /><div><h2 id="xb-title">小北</h2><p title={title}>{title || "把概念聊明白"}</p></div></div><div className="xb-actions"><button type="button" title="历史对话" aria-label="历史对话" aria-pressed={historyOpen} onClick={showHistory}><ClockCounterClockwise size={19} /></button><button type="button" disabled={locked} title="新对话" aria-label="新对话" onClick={newConversation}><Plus size={19} /></button><button type="button" title="关闭小北" aria-label="关闭小北" onClick={() => setOpen(false)}><X size={20} /></button></div></header>
        {historyOpen ? <section className="xb-history" aria-label="历史对话列表">
          <div className="xb-history-heading"><button type="button" aria-label="返回当前对话" onClick={() => setHistoryOpen(false)}><ArrowLeft size={18} /></button><h3>历史对话</h3><span>{historyLoading ? "加载中…" : ""}</span></div>
          <button className="xb-history-new" type="button" disabled={locked} onClick={newConversation}><Plus size={17} />开启新对话</button>
          {!history.length && !historyLoading && <p className="xb-history-empty">还没有对话。<br />聊过的内容会保留在这里。</p>}
          <div className="xb-history-items">{history.map(item => <button type="button" key={item.id} disabled={locked} aria-current={item.id === selected ? "true" : undefined} onClick={() => selectConversation(item.id)}><ChatCircle size={18} /><span><strong>{item.title}</strong><small>{item.running ? "正在回答" : item.id === selected ? "当前对话" : "继续聊聊"}</small></span><time dateTime={new Date(item.updatedAt).toISOString()}>{historyTime(item.updatedAt)}</time></button>)}</div>
          {nextOffset !== null && <button className="xb-history-more" disabled={historyLoading} onClick={() => void loadHistory(nextOffset).catch(error => setError(error instanceof Error ? error.message : "加载失败"))}>查看更多</button>}
          {locked && <p className="xb-history-hint">{loading ? "正在恢复对话…" : "回答结束后可以切换，也可以返回当前对话停止生成。"}</p>}
          {error && <p className="xb-error" role="alert">{error}</p>}
        </section> : <>
        <div className="xb-log" ref={log} aria-label="对话记录" onScroll={() => { const el = log.current; if (el) shouldScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}>
          {!messages.length && !loading && <div className="xb-welcome"><XiaobeiStar /><h3>哪一个概念，<br />还差一点就懂了？</h3><p>从当前词条开始聊，也可以把两个概念放在一起比较。</p><div className="xb-suggestions">{["用一个例子解释当前词条", "Agent 和 Harness 有什么区别？"].map(text => <button key={text} onClick={() => { setDraft(text); input.current?.focus(); }}>{text}<ArrowUp size={15} /></button>)}</div></div>}
          {messages.map(message => <article className={`xb-message xb-${message.role}`} key={message.id}>{message.role === "user" ? <><span className="xb-message-page">{message.page}</span><p>{message.text}</p></> : <>{(message.blocks.length > 0 || message.error) && <span className="xb-speaker">小北</span>}<Transcript blocks={message.blocks} termNames={termNames} newsNames={newsNames} close={() => setOpen(false)} />{message.error && <p className="xb-error">{message.error}</p>}</>}</article>)}
          <div role="status" aria-live="polite" className="xb-status">{loading ? "正在恢复对话…" : remoteRunning && !busy ? "这段对话仍在回答，正在同步已保存内容…" : busy && status ? <><i />{status}</> : null}</div>
          {error && <p className="xb-error" role="alert">{error}</p>}
          {!active && open && <p className="xb-error">授权已失效，请联系邀请人重新激活。</p>}
        </div>
        <footer className="xb-compose">
          {context && context.tokens >= CONTEXT_WARNING && <p className="xb-warning">上下文已达 175K，可继续对话；接近 256K 时建议开启新对话。</p>}
          <form onSubmit={event => { event.preventDefault(); void send(); }}>
            <textarea ref={input} value={draft} rows={2} placeholder="问问这个词，或说说哪里没懂…" aria-label="给小北的问题" disabled={!active} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }} />
            {busy ? <button type="button" className="xb-send" aria-label="停止生成" title="停止生成" onClick={() => request.current?.abort()}><Square size={16} weight="fill" /></button> : <button type="submit" className="xb-send" disabled={!draft.trim() || !active || locked} aria-label="发送问题" title="发送问题"><ArrowUp size={20} weight="bold" /></button>}
          </form>
          <div className="xb-footnote"><span title="每码每日 100 积分，北京时间零点恢复">今日剩余 {credits.toFixed(3)} 积分</span><ContextMeter value={context} /></div>
        </footer>
        </>}
      </div>
    </dialog>
  </>;
}
