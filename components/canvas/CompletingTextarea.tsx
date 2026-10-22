import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { completionContext } from "@/lib/canvas-completion";
import { formatMarkdown, markdownShortcut, type MarkdownEdit, type MarkdownFormat } from "@/lib/markdown-editing";
import { Check, Code, CodeBlock, FlowArrow, Highlighter, LinkSimple, Palette, Sparkle, Table, TextBolderIcon, TextItalic, TextStrikethrough, X } from "@phosphor-icons/react";
import canvas from "./CanvasWorkspace.module.css";
import styles from "./CompletingTextarea.module.css";
import { ownerHeaders, useAccount } from "@/components/account/AccountProvider";

type Props = { markdown: string; title: string; onChange: (value: string) => void; onSave: () => void };
type Undo = { before: string; after: string; cursor: number; end: number };

export function CompletingTextarea({ markdown, title, onChange, onSave }: Props) {
  const { account, openAccount, aiPreferences } = useAccount();
  const helpId = useId();
  const field = useRef<HTMLTextAreaElement>(null), mirror = useRef<HTMLDivElement>(null), marker = useRef<HTMLSpanElement>(null), floating = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), request = useRef<AbortController | null>(null), composing = useRef(false);
  const selection = useRef({ start: 0, end: 0 }), undo = useRef<Undo | null>(null);
  const tabMovesFocus = useRef(false);
  const [cursor, setCursor] = useState(0), [hint, setHint] = useState(false), [busy, setBusy] = useState(false), [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState(""), [unauthorized, setUnauthorized] = useState(false), [disclosure, setDisclosure] = useState<boolean | null>(null);
  const [shortcut, setShortcut] = useState("Ctrl Enter");
  const [nearBottom, setNearBottom] = useState(false);

  function position() {
    const el = field.current, copy = mirror.current, anchor = marker.current, popup = floating.current;
    if (!el || !copy || !anchor) return false;
    copy.style.width = `${el.clientWidth}px`; copy.scrollTop = el.scrollTop; copy.scrollLeft = el.scrollLeft;
    const rect = el.getBoundingClientRect(), caret = anchor.getBoundingClientRect();
    const visible = caret.top >= rect.top && caret.bottom <= rect.bottom && caret.left >= rect.left && caret.left < rect.right - 16;
    if (popup) {
      popup.style.left = `${Math.max(12, Math.min(caret.left - rect.left, el.clientWidth - popup.offsetWidth - 12))}px`;
      const top = caret.bottom - rect.top + 4;
      popup.style.top = `${Math.max(4, Math.min(top, el.clientHeight - popup.offsetHeight - 8))}px`;
      popup.style.visibility = visible ? "visible" : "hidden";
    }
    return visible;
  }

  function clear() {
    clearTimeout(timer.current); request.current?.abort(); request.current = null;
    setHint(false); setBusy(false); setSuggestion(""); setError(""); setUnauthorized(false); setDisclosure(null);
  }
  function arm() {
    clearTimeout(timer.current);
    if (!aiPreferences.completion) return;
    timer.current = setTimeout(() => {
      const el = field.current;
      if (el && document.activeElement === el && !composing.current && el.selectionStart === el.selectionEnd && el.value.slice(0, el.selectionStart).trim() && !request.current && position()) setHint(true);
    }, 3000);
  }
  function select(el = field.current) {
    if (!el) return;
    if (el.selectionStart !== selection.current.start || el.selectionEnd !== selection.current.end) {
      selection.current = { start: el.selectionStart, end: el.selectionEnd }; setCursor(el.selectionStart); clear(); arm();
    }
  }

  useEffect(() => {
    // Platform label only; stopping to type never initiates a network request.
    const id = requestAnimationFrame(() => setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ Enter" : "Ctrl Enter"));
    const el = field.current!, observer = new ResizeObserver(() => { position(); }); observer.observe(el);
    const hide = () => { if (document.hidden) clear(); };
    document.addEventListener("visibilitychange", hide);
    return () => { cancelAnimationFrame(id); observer.disconnect(); document.removeEventListener("visibilitychange", hide); clearTimeout(timer.current); request.current?.abort(); };
  }, []);
  useLayoutEffect(() => {
    position();
    const id = requestAnimationFrame(() => {
      const el = field.current, anchor = marker.current;
      if (el && anchor) setNearBottom(el.getBoundingClientRect().bottom - anchor.getBoundingClientRect().bottom < parseFloat(getComputedStyle(el).lineHeight) * 6);
    });
    return () => cancelAnimationFrame(id);
  });

  async function generate(confirmedMode?: boolean) {
    const el = field.current;
    if (!aiPreferences.completion || !el || composing.current || request.current || el.selectionStart !== el.selectionEnd || !el.value.slice(0, el.selectionStart).trim()) return;
    el.focus();
    const original = el.value, at = el.selectionStart, controller = new AbortController();
    clear(); request.current = controller; setBusy(true); setCursor(at);
    try {
      const policyResponse = await fetch("/api/xiaobei/completion", { signal: controller.signal, cache: "no-store", headers: ownerHeaders(account?.id) });
      const policy = await policyResponse.json();
      controller.signal.throwIfAborted();
      if (!policyResponse.ok) throw new Error(policy.error || "小北暂时不可用，请稍后再试。");
      if (!policy.active) { setUnauthorized(true); throw new Error("请先激活小北，再回来补全。"); }
      const mode = policy.charging === true, consentKey = `vp-canvas-completion-${mode ? "charged" : "free"}-disclosure`;
      let acknowledged = confirmedMode === mode;
      try { acknowledged ||= localStorage.getItem(consentKey) === "1"; } catch { /* A disabled store still allows this explicit confirmation. */ }
      if (!acknowledged) { setDisclosure(mode); return; }
      try { localStorage.setItem(consentKey, "1"); } catch { /* Repeat the disclosure next time if browser storage is disabled. */ }
      const response = await fetch("/api/xiaobei/completion", { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json", ...ownerHeaders(account?.id) },
        body: JSON.stringify({ requestId: crypto.randomUUID(), ...completionContext(original, at, title), acceptCharging: mode }) });
      const data = await response.json();
      controller.signal.throwIfAborted();
      if (!response.ok) { if (response.status === 401) setUnauthorized(true); throw new Error(data.error || "补全失败，请稍后再试。"); }
      if (request.current === controller && el.value === original && el.selectionStart === at && el.selectionEnd === at && document.activeElement === el) {
        if (typeof data.text !== "string" || !data.text.trim()) throw new Error("没有收到补全，请再试一次。");
        setSuggestion(data.text);
      }
    } catch (failure) {
      if (!controller.signal.aborted && request.current === controller) setError(failure instanceof Error ? failure.message : "连接失败，请稍后再试。");
    } finally { if (request.current === controller) { request.current = null; setBusy(false); } }
  }

  function restore(value: string, at: number) {
    onChange(value);
    selection.current = { start: at, end: at }; setCursor(at);
    requestAnimationFrame(() => { field.current?.focus(); field.current?.setSelectionRange(at, at); });
  }
  function applyEdit(edit: MarkdownEdit) {
    const el = field.current;
    if (!el || composing.current) return;
    const before = el.value, after = before.slice(0, edit.from) + edit.text + before.slice(edit.to), at = el.selectionStart;
    clear(); el.focus(); el.setSelectionRange(edit.from, edit.to);
    // insertText keeps formatting and completions in the browser's native undo history.
    document.execCommand("insertText", false, edit.text);
    if (el.value !== after) undo.current = { before, after, cursor: at, end: edit.end };
    onChange(after); selection.current = { start: edit.start, end: edit.end }; setCursor(edit.start);
    requestAnimationFrame(() => { el.setSelectionRange(edit.start, edit.end); position(); arm(); });
  }
  function format(kind: MarkdownFormat, color?: string) {
    const el = field.current;
    if (el) applyEdit(formatMarkdown(el.value, el.selectionStart, el.selectionEnd, kind, color));
  }
  function accept() {
    const el = field.current!;
    if (!suggestion || el.selectionStart !== cursor || el.selectionEnd !== cursor) return;
    const end = cursor + suggestion.length;
    applyEdit({ from: cursor, to: cursor, text: suggestion, start: end, end });
  }
  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing || composing.current || event.keyCode === 229) return;
    if (event.key === "Tab" && tabMovesFocus.current) { tabMovesFocus.current = false; return; }
    tabMovesFocus.current = event.key === "Escape";
    const command = event.metaKey || event.ctrlKey, key = event.key.toLowerCase();
    if (command && key === "s") { event.preventDefault(); onSave(); return; }
    if (command && event.key === "Enter") { event.preventDefault(); if (!event.repeat) void generate(disclosure === null ? undefined : disclosure); return; }
    if (event.key === "Escape" && (hint || suggestion || busy || error || disclosure !== null)) { event.preventDefault(); event.stopPropagation(); clear(); return; }
    if (event.key === "Tab" && !event.shiftKey && suggestion) { event.preventDefault(); accept(); return; }
    const action = command && !event.altKey ? markdownShortcut(key, event.shiftKey) : null;
    if (action) { event.preventDefault(); if (!event.repeat) format(action); return; }
    if (event.key === "Tab" && !command && !event.altKey) { event.preventDefault(); format(event.shiftKey ? "outdent" : "indent"); return; }
    // Keep a fallback undo/redo for browsers without insertText support.
    const entry = undo.current;
    if (entry && command && (key === "z" || key === "y")) {
      const redo = event.shiftKey || key === "y";
      if ((!redo && markdown === entry.after) || (redo && markdown === entry.before)) { event.preventDefault(); clear(); restore(redo ? entry.after : entry.before, redo ? entry.end : entry.cursor); }
    }
  }

  useEffect(() => { if (!aiPreferences.completion) { request.current?.abort(); queueMicrotask(clear); } }, [aiPreferences.completion]);

  const inline = cursor === markdown.length && !nearBottom;
  const canComplete = !!markdown.slice(0, cursor).trim() && selection.current.start === selection.current.end;
  const control = suggestion ? <><span className={styles.ghost} aria-hidden="true">{suggestion}</span><button type="button" tabIndex={-1} className={styles.hint} onPointerDown={event => event.preventDefault()} onClick={accept} aria-label="接受小北补全">Tab 接受</button></>
    : hint ? <button type="button" tabIndex={-1} className={styles.hint} onPointerDown={event => event.preventDefault()} onClick={() => void generate()}>按 {shortcut} 补全</button> : null;
  const popup = disclosure !== null ? <div role="dialog" aria-label="使用小北补全"><p>补全会将这份笔记的标题和相关前文发送给小北。</p>{disclosure && <p>按小北现有 Token 单价扣分，放弃建议也按实际生成用量结算。</p>}<div className={styles.actions}><button type="button" onClick={() => void generate(disclosure)}>继续补全</button><button type="button" onClick={clear}>取消</button></div></div>
    : error ? <div role="alert"><p>{error}</p><div className={styles.actions}>{unauthorized ? account ? <button type="button" onClick={openAccount}>绑定小北</button> : <a href="/xiaobei/activate" target="_blank" rel="noopener noreferrer">激活小北 ↗</a> : <button type="button" onClick={() => void generate()}>重试</button>}<button type="button" onClick={clear}>关闭</button></div></div>
    : busy ? <span role="status">小北正在补全…</span> : !inline ? control : null;

  const tools = [
    ["bold", TextBolderIcon, "加粗", "B"], ["italic", TextItalic, "斜体", "I"], ["highlight", Highlighter, "高亮", "Shift H"],
    ["strike", TextStrikethrough, "删除线", "Shift X"], ["link", LinkSimple, "插入链接", "K"], ["code", Code, "行内代码", "`"],
    ["codeblock", CodeBlock, "代码块", "Shift `"], ["table", Table, "插入表格", ""], ["mermaid", FlowArrow, "Mermaid 图表", ""],
  ] as const;
  return <><div className={styles.toolbar} role="toolbar" aria-label="Markdown 格式">
    <div className={styles.formatTools}>
    {tools.map(([kind, Icon, label, hotkey]) => <button key={kind} type="button" aria-label={label} title={`${label}${hotkey ? `（⌘ / Ctrl ${hotkey}）` : ""}`} onPointerDown={event => event.preventDefault()} onClick={() => format(kind)}><Icon size={18} /></button>)}
    <label className={styles.color} title="文字颜色"><Palette size={18} /><select aria-label="文字颜色" value="" onChange={event => { if (event.target.value) format("color", event.target.value); }}>
      <option value="" disabled>文字颜色</option><option value="#a33a32">红色</option><option value="#996719">橙色</option><option value="#457045">绿色</option><option value="#356da1">蓝色</option><option value="#8053a3">紫色</option><option value="#777777">灰色</option><option value="inherit">默认颜色</option>
    </select></label>
    </div>
    {aiPreferences.completion && <div className={styles.touchCompletion} role="group" aria-label="小北补全" onPointerDown={event => event.preventDefault()}>
      {suggestion ? <button type="button" onClick={accept} aria-label="接受小北补全"><Check size={17} />接受</button>
        : <button type="button" onClick={() => void generate()} disabled={busy || disclosure !== null || !canComplete} aria-busy={busy}><Sparkle size={17} />{busy ? "补全中…" : "小北补全"}</button>}
      {(suggestion || busy) && <button type="button" onClick={clear} aria-label={busy ? "取消补全" : "放弃补全"} title={busy ? "取消补全" : "放弃补全"}><X size={17} /></button>}
    </div>}
  </div><div className={styles.body} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) clear(); }}>
    <textarea ref={field} className={`${canvas.editor} ${styles.textarea}`} autoFocus aria-label="Markdown 正文" aria-describedby={helpId} aria-keyshortcuts="Meta+B Control+B Meta+I Control+I Meta+K Control+K Meta+Enter Control+Enter" placeholder="直接写下想法，支持 Markdown…" spellCheck={false} value={markdown}
      onChange={event => { undo.current = null; onChange(event.target.value); selection.current = { start: event.target.selectionStart, end: event.target.selectionEnd }; setCursor(event.target.selectionStart); clear(); arm(); }}
      onSelect={event => select(event.currentTarget)} onFocus={event => { select(event.currentTarget); arm(); }} onBlur={onSave} onScroll={() => { clear(); position(); arm(); }} onKeyDown={keyDown}
      onCompositionStart={() => { composing.current = true; clear(); }} onCompositionEnd={() => { composing.current = false; arm(); }} />
    <div ref={mirror} className={`${canvas.editor} ${styles.mirror}`}><span aria-hidden="true">{markdown.slice(0, cursor)}</span><span ref={marker} aria-hidden="true">{"\u200b"}</span>{inline && control}<span aria-hidden="true">{markdown.slice(cursor)}</span></div>
    {popup && <div ref={floating} className={`${styles.floating} ${!inline && !error && disclosure === null && !busy ? styles.candidate : ""}`} onPointerDown={event => event.preventDefault()}>{popup}</div>}
    <span id={helpId} className={styles.srOnly}>Command 或 Control 加 B 加粗，I 斜体，K 链接，Shift H 高亮，Shift X 删除线，反引号行内代码，Shift 加反引号代码块。Tab 缩进，Shift Tab 取消缩进；Escape 后按 Tab 可离开编辑区。停顿后可按 Command 或 Control 加 Enter 请求小北补全，有建议时 Tab 接受，Escape 放弃。</span>
    <span className={styles.srOnly} role="status" aria-live="polite">{suggestion ? `小北建议：${suggestion}。Tab 接受，Escape 放弃。` : hint ? `可按 ${shortcut} 请求小北补全` : ""}</span>
  </div></>;
}
