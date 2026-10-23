import { useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { completionContext } from "@/lib/canvas-completion";
import { formatMarkdown, markdownShortcut, type MarkdownEdit, type MarkdownFormat } from "@/lib/markdown-editing";
import { insertMarkdownImages, markdownImageRanges, MARKDOWN_IMAGE_ACCEPT, readMarkdownImages } from "@/lib/markdown-images";
import { Check, Code, CodeBlock, FlowArrow, Highlighter, ImageSquare, LinkSimple, Palette, Sparkle, Table, TextBolderIcon, TextItalic, TextStrikethrough, X } from "@phosphor-icons/react";
import { MarkdownSource, type MarkdownField } from "./MarkdownSource";
import styles from "./CompletingTextarea.module.css";
import { ownerHeaders, useAccount } from "@/components/account/AccountProvider";

type Props = { markdown: string; title: string; editorRef?: RefObject<MarkdownField | null>; onChange: (value: string) => void; onSave: () => void };

export function CompletingTextarea({ markdown, title, editorRef, onChange, onSave }: Props) {
  const { account, openAccount, aiPreferences } = useAccount();
  const helpId = useId();
  const field = useRef<MarkdownField>(null), floating = useRef<HTMLDivElement>(null);
  useImperativeHandle(editorRef, () => field.current!, []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), request = useRef<AbortController | null>(null), composing = useRef(false);
  const selection = useRef({ start: 0, end: 0 });
  const tabMovesFocus = useRef(false);
  const imageInput = useRef<HTMLInputElement>(null), readingImages = useRef(false);
  const [imageBusy, setImageBusy] = useState(false), [imageError, setImageError] = useState(""), [draggingImage, setDraggingImage] = useState(false);
  const [cursor, setCursor] = useState(0), [hint, setHint] = useState(false), [busy, setBusy] = useState(false), [suggestion, setSuggestion] = useState("");
  const [hasSelection, setHasSelection] = useState(false);
  const [error, setError] = useState(""), [unauthorized, setUnauthorized] = useState(false), [disclosure, setDisclosure] = useState<boolean | null>(null);
  const [shortcut, setShortcut] = useState("Ctrl Enter");

  const position = useCallback(() => {
    const el = field.current, popup = floating.current;
    if (!el) return false;
    const rect = el.scrollDOM.getBoundingClientRect(), caret = el.caretRect();
    if (!caret) return false;
    const visible = caret.top >= rect.top && caret.bottom <= rect.bottom && caret.left >= rect.left && caret.left < rect.right - 16;
    if (popup) {
      popup.style.left = `${Math.max(12, Math.min(caret.left - rect.left, rect.width - popup.offsetWidth - 12))}px`;
      const top = caret.bottom - rect.top + 4;
      popup.style.top = `${Math.max(4, Math.min(top, rect.height - popup.offsetHeight - 8))}px`;
      popup.style.visibility = visible ? "visible" : "hidden";
    }
    return visible;
  }, []);

  function clear() {
    clearTimeout(timer.current); request.current?.abort(); request.current = null;
    setHint(false); setBusy(false); setSuggestion(""); setError(""); setUnauthorized(false); setDisclosure(null);
  }
  function arm() {
    clearTimeout(timer.current);
    if (!aiPreferences.completion || readingImages.current) return;
    timer.current = setTimeout(() => {
      const el = field.current;
      if (el && document.activeElement === el.element && !composing.current && el.selectionStart === el.selectionEnd && el.value.slice(0, el.selectionStart).trim() && !request.current && position()) setHint(true);
    }, 3000);
  }
  function select(el = field.current) {
    if (!el) return;
    if (el.selectionStart !== selection.current.start || el.selectionEnd !== selection.current.end) {
      selection.current = { start: el.selectionStart, end: el.selectionEnd }; setCursor(el.selectionStart); setHasSelection(el.selectionStart !== el.selectionEnd); clear(); arm();
    }
  }

  useEffect(() => {
    // Platform label only; stopping to type never initiates a network request.
    const id = requestAnimationFrame(() => setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ Enter" : "Ctrl Enter"));
    const el = field.current!, observer = new ResizeObserver(() => { position(); }); observer.observe(el.scrollDOM);
    const hide = () => { if (document.hidden) clear(); };
    document.addEventListener("visibilitychange", hide);
    return () => { cancelAnimationFrame(id); observer.disconnect(); document.removeEventListener("visibilitychange", hide); clearTimeout(timer.current); request.current?.abort(); };
  }, [field, position]);
  useLayoutEffect(() => { position(); });

  async function generate(confirmedMode?: boolean) {
    const el = field.current;
    if (!aiPreferences.completion || !el || readingImages.current || composing.current || request.current || el.selectionStart !== el.selectionEnd || !el.value.slice(0, el.selectionStart).trim()) return;
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
      if (request.current === controller && el.value === original && el.selectionStart === at && el.selectionEnd === at && document.activeElement === el.element) {
        if (typeof data.text !== "string" || !data.text.trim()) throw new Error("没有收到补全，请再试一次。");
        setSuggestion(data.text);
      }
    } catch (failure) {
      if (!controller.signal.aborted && request.current === controller) setError(failure instanceof Error ? failure.message : "连接失败，请稍后再试。");
    } finally { if (request.current === controller) { request.current = null; setBusy(false); } }
  }

  function applyEdit(edit: MarkdownEdit) {
    const el = field.current;
    if (!el || composing.current || readingImages.current) return;
    clear(); el.focus(); el.replace(edit);
    selection.current = { start: edit.start, end: edit.end }; setCursor(edit.start);
    requestAnimationFrame(() => { el.setSelectionRange(edit.start, edit.end); position(); arm(); });
  }
  async function insertImages(files: File[]) {
    const el = field.current;
    if (!files.length || !el || readingImages.current || composing.current) return;
    const original = el.value, start = el.selectionStart, at = el.selectionEnd;
    const replacing = markdownImageRanges(original).some(image => image.from === start && image.to === at);
    clear(); setImageError(""); readingImages.current = true; setImageBusy(true);
    try {
      const images = await readMarkdownImages(files);
      if (field.current !== el) return;
      if (el.value !== original) throw new Error("正文已更新，请在需要的位置重新插入图片。");
      const edit = insertMarkdownImages(replacing ? original.slice(0, start) + original.slice(at) : original, replacing ? start : at, images);
      if (replacing) edit.to = at;
      readingImages.current = false;
      applyEdit(edit);
    } catch (failure) {
      if (field.current === el) setImageError(failure instanceof Error ? failure.message : "图片读取失败，原内容已保留。");
    } finally { readingImages.current = false; setImageBusy(false); }
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
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
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
  }

  useEffect(() => { if (!aiPreferences.completion) { request.current?.abort(); queueMicrotask(clear); } }, [aiPreferences.completion]);

  const canComplete = !!markdown.slice(0, cursor).trim() && !hasSelection;
  const popup = disclosure !== null ? <div role="dialog" aria-label="使用小北补全"><p>补全会将这份笔记的标题和相关前文发送给小北。</p>{disclosure && <p>按小北现有 Token 单价扣分，放弃建议也按实际生成用量结算。</p>}<div className={styles.actions}><button type="button" onClick={() => void generate(disclosure)}>继续补全</button><button type="button" onClick={clear}>取消</button></div></div>
    : error ? <div role="alert"><p>{error}</p><div className={styles.actions}>{unauthorized ? account ? <button type="button" onClick={openAccount}>绑定小北</button> : <a href="/xiaobei/activate" target="_blank" rel="noopener noreferrer">激活小北 ↗</a> : <button type="button" onClick={() => void generate()}>重试</button>}<button type="button" onClick={clear}>关闭</button></div></div>
    : busy ? <span role="status">小北正在补全…</span> : null;
  const ghost = popup ? undefined : suggestion ? { text: suggestion, label: "Tab 接受", onClick: accept } : hint ? { text: "", label: `按 ${shortcut} 补全`, onClick: () => void generate() } : undefined;

  const tools = [
    ["bold", TextBolderIcon, "加粗", "B"], ["italic", TextItalic, "斜体", "I"], ["highlight", Highlighter, "高亮", "Shift H"],
    ["strike", TextStrikethrough, "删除线", "Shift X"], ["link", LinkSimple, "插入链接", "K"], ["code", Code, "行内代码", "`"],
    ["codeblock", CodeBlock, "代码块", "Shift `"], ["table", Table, "插入表格", ""], ["mermaid", FlowArrow, "Mermaid 图表", ""],
  ] as const;
  return <div className={styles.completingEditor} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) clear(); }}
    onDragOverCapture={event => { if (event.dataTransfer.types.includes("Files")) { event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = "copy"; setDraggingImage(true); } }}
    onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDraggingImage(false); }}
    onDropCapture={event => { setDraggingImage(false); if (event.dataTransfer.files.length) { event.preventDefault(); event.stopPropagation(); void insertImages(Array.from(event.dataTransfer.files)); } }}>
    <div className={styles.toolbar} role="toolbar" aria-label="Markdown 格式">
    <button type="button" className={styles.imageButton} aria-label="插入图片" title="插入本地图片，也可粘贴截图或拖入图片" disabled={imageBusy} onPointerDown={event => event.preventDefault()} onClick={() => imageInput.current?.click()}><ImageSquare size={18} /></button>
    <input ref={imageInput} hidden type="file" accept={MARKDOWN_IMAGE_ACCEPT} multiple aria-label="选择正文图片" onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void insertImages(files); }} />
    <div className={styles.formatTools}>
    {tools.map(([kind, Icon, label, hotkey]) => <button key={kind} type="button" aria-label={label} title={`${label}${hotkey ? `（⌘ / Ctrl ${hotkey}）` : ""}`} onPointerDown={event => event.preventDefault()} onClick={() => format(kind)}><Icon size={18} /></button>)}
    <label className={styles.color} title="文字颜色"><Palette size={18} /><select aria-label="文字颜色" value="" onChange={event => { if (event.target.value) format("color", event.target.value); }}>
      <option value="" disabled>文字颜色</option><option value="#a33a32">红色</option><option value="#996719">橙色</option><option value="#457045">绿色</option><option value="#356da1">蓝色</option><option value="#8053a3">紫色</option><option value="#777777">灰色</option><option value="inherit">默认颜色</option>
    </select></label>
    </div>
    {aiPreferences.completion && <div className={styles.touchCompletion} role="group" aria-label="小北补全" onPointerDown={event => event.preventDefault()}>
      {suggestion ? <button type="button" onClick={accept} aria-label="接受小北补全"><Check size={17} />接受</button>
        : <button type="button" onClick={() => void generate()} disabled={imageBusy || busy || disclosure !== null || !canComplete} aria-busy={busy}><Sparkle size={17} />{busy ? "补全中…" : "小北补全"}</button>}
      {(suggestion || busy) && <button type="button" onClick={clear} aria-label={busy ? "取消补全" : "放弃补全"} title={busy ? "取消补全" : "放弃补全"}><X size={17} /></button>}
    </div>}
  </div>
    {(imageBusy || imageError) && <div className={styles.imageMessage} role={imageError ? "alert" : "status"}><span>{imageError || "正在读取图片…"}</span>{imageError && <button type="button" aria-label="关闭图片提示" onClick={() => setImageError("")}><X size={15} /></button>}</div>}
    <div className={styles.body} onKeyDownCapture={keyDown}
      onPasteCapture={event => { const files = Array.from(event.clipboardData.files); if (files.length) { event.preventDefault(); event.stopPropagation(); void insertImages(files); } }}>
    <MarkdownSource ref={field} markdown={markdown} readOnly={imageBusy} helpId={helpId} ghost={ghost}
      onChange={value => { onChange(value); clear(); arm(); }} onSelect={() => select()} onFocus={() => { select(); arm(); }} onBlur={onSave}
      onScroll={() => { clear(); requestAnimationFrame(position); arm(); }} onComposition={active => { composing.current = active; if (active) clear(); else arm(); }} onReplaceImage={() => imageInput.current?.click()} />
    {draggingImage && <div className={styles.imageDrop} aria-hidden="true">松开插入图片</div>}
    {popup && <div ref={floating} className={styles.floating} onPointerDown={event => event.preventDefault()}>{popup}</div>}
    <span id={helpId} className={styles.srOnly}>Command 或 Control 加 B 加粗，I 斜体，K 链接，Shift H 高亮，Shift X 删除线，反引号行内代码，Shift 加反引号代码块。Tab 缩进，Shift Tab 取消缩进；Escape 后按 Tab 可离开编辑区。停顿后可按 Command 或 Control 加 Enter 请求小北补全，有建议时 Tab 接受，Escape 放弃。</span>
    <span className={styles.srOnly} role="status" aria-live="polite">{suggestion ? `小北建议：${suggestion}。Tab 接受，Escape 放弃。` : hint ? `可按 ${shortcut} 请求小北补全` : ""}</span>
  </div></div>;
}
