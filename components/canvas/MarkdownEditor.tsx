import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { MarkdownDocument } from "./MarkdownDocument";
import { CompletingTextarea } from "./CompletingTextarea";
import type { MarkdownField } from "./MarkdownSource";
import styles from "./CanvasWorkspace.module.css";

export function MarkdownEditor({ markdown, title, fallbackTitle, onChange, onSave }: { markdown: string; title: string; fallbackTitle?: string; onChange: (value: string) => void; onSave: () => void }) {
  const container = useRef<HTMLElement>(null), dragging = useRef<number | null>(null);
  const [split, setSplit] = useState(50), [minimum, setMinimum] = useState(25);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const editor = useRef<MarkdownField>(null);
  const selection = useRef({ start: 0, end: 0, scroll: 0 });
  function switchView(next: "edit" | "preview") {
    const field = editor.current;
    if (view === "edit" && field) selection.current = { start: field.selectionStart, end: field.selectionEnd, scroll: field.scrollDOM.scrollTop };
    setView(next);
    if (next === "edit") requestAnimationFrame(() => {
      field?.focus(); field?.setSelectionRange(selection.current.start, selection.current.end);
      if (field) field.scrollDOM.scrollTop = selection.current.scroll;
    });
  }
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const viewport = window.visualViewport;
    const fitHeight = () => {
      if (viewport) element.style.maxHeight = `${Math.max(0, viewport.height - Math.max(0, element.getBoundingClientRect().top - viewport.offsetTop))}px`;
    };
    const observer = new ResizeObserver(() => {
      fitHeight();
      const min = Math.min(50, Math.max(25, Math.ceil(360 / Math.max(1, element.clientWidth - 13) * 100)));
      setMinimum(min); setSplit(value => Math.max(min, Math.min(100 - min, value)));
    });
    observer.observe(element);
    fitHeight(); viewport?.addEventListener("resize", fitHeight); viewport?.addEventListener("scroll", fitHeight);
    return () => { observer.disconnect(); viewport?.removeEventListener("resize", fitHeight); viewport?.removeEventListener("scroll", fitHeight); };
  }, []);
  function resize(event: PointerEvent) {
    if (dragging.current !== event.pointerId || !container.current) return;
    const rect = container.current.getBoundingClientRect();
    const extent = rect.width - 13;
    const offset = event.clientX - rect.left;
    setSplit(Math.max(minimum, Math.min(100 - minimum, (offset - 6.5) / extent * 100)));
  }
  return <main ref={container} className={styles.editorPage} data-canvas-content data-editor-view={view} style={{ "--editor-split": split, "--preview-split": 100 - split } as CSSProperties}>
    <div className={styles.editorTabs} role="group" aria-label="编辑器视图">
      <button type="button" aria-pressed={view === "edit"} aria-controls="markdown-source" onClick={() => switchView("edit")}>编辑</button>
      <button type="button" aria-pressed={view === "preview"} aria-controls="markdown-preview" onClick={() => switchView("preview")}>预览</button>
    </div>
    <div className={styles.editorPanes}>
    <section id="markdown-source" className={styles.sourcePane} aria-label="Markdown 编辑" data-pointer-native>
      <div className={styles.paneLabel}>Markdown</div>
      <CompletingTextarea editorRef={editor} markdown={markdown} title={title} onChange={onChange} onSave={onSave} />
    </section>
    <div className={styles.splitter} data-pointer-native role="separator" tabIndex={0} aria-label="调整编辑与预览比例" aria-orientation="vertical" aria-controls="markdown-source markdown-preview" aria-valuemin={minimum} aria-valuemax={100 - minimum} aria-valuenow={Math.round(split)} aria-valuetext={`Markdown ${Math.round(split)}%，预览 ${Math.round(100 - split)}%`}
      onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); dragging.current = event.pointerId; }}
      onPointerMove={resize} onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }} onLostPointerCapture={() => { dragging.current = null; }}
      onDoubleClick={() => setSplit(50)} onKeyDown={event => {
        const less = "ArrowLeft", more = "ArrowRight";
        if (![less, more, "Home", "End"].includes(event.key)) return;
        event.preventDefault(); setSplit(value => event.key === "Home" ? minimum : event.key === "End" ? 100 - minimum : Math.max(minimum, Math.min(100 - minimum, value + (event.key === more ? 5 : -5))));
      }}><span /></div>
    <section id="markdown-preview" className={styles.previewPane} aria-label="Markdown 实时预览">
      <div className={styles.paneLabel}>预览</div>
      <div className={styles.previewScroll}><article className={styles.markdown}>{markdown.trim() ? <MarkdownDocument markdown={markdown} fallbackTitle={fallbackTitle} /> : <>{fallbackTitle && <h1>{fallbackTitle}</h1>}<p className={styles.blankNote}>写下内容后，会在这里显示。</p></>}</article></div>
    </section>
    </div>
  </main>;
}
