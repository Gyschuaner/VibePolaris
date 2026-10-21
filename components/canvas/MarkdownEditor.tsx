import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { MarkdownDocument } from "./MarkdownDocument";
import { CompletingTextarea } from "./CompletingTextarea";
import styles from "./CanvasWorkspace.module.css";

export function MarkdownEditor({ markdown, title, onChange, onSave }: { markdown: string; title: string; onChange: (value: string) => void; onSave: () => void }) {
  const container = useRef<HTMLElement>(null), dragging = useRef<number | null>(null);
  const [split, setSplit] = useState(50), [stacked, setStacked] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px)");
    const resize = () => setStacked(query.matches);
    resize(); query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, []);
  function resize(event: PointerEvent) {
    if (dragging.current !== event.pointerId || !container.current) return;
    const rect = container.current.getBoundingClientRect();
    const extent = (stacked ? rect.height : rect.width) - 13;
    const offset = stacked ? event.clientY - rect.top : event.clientX - rect.left;
    setSplit(Math.max(25, Math.min(75, (offset - 6.5) / extent * 100)));
  }
  return <main ref={container} className={styles.editorPage} data-canvas-content style={{ "--editor-split": split, "--preview-split": 100 - split } as CSSProperties}>
    <section id="markdown-source" className={styles.sourcePane} aria-label="Markdown 编辑" data-pointer-native>
      <div className={styles.paneLabel}>Markdown</div>
      <CompletingTextarea markdown={markdown} title={title} onChange={onChange} onSave={onSave} />
    </section>
    <div className={styles.splitter} data-pointer-native role="separator" tabIndex={0} aria-label="调整编辑与预览比例" aria-orientation={stacked ? "horizontal" : "vertical"} aria-controls="markdown-source markdown-preview" aria-valuemin={25} aria-valuemax={75} aria-valuenow={Math.round(split)} aria-valuetext={`Markdown ${Math.round(split)}%，预览 ${Math.round(100 - split)}%`}
      onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); dragging.current = event.pointerId; }}
      onPointerMove={resize} onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }} onLostPointerCapture={() => { dragging.current = null; }}
      onDoubleClick={() => setSplit(50)} onKeyDown={event => {
        const less = stacked ? "ArrowUp" : "ArrowLeft", more = stacked ? "ArrowDown" : "ArrowRight";
        if (![less, more, "Home", "End"].includes(event.key)) return;
        event.preventDefault(); setSplit(value => event.key === "Home" ? 25 : event.key === "End" ? 75 : Math.max(25, Math.min(75, value + (event.key === more ? 5 : -5))));
      }}><span /></div>
    <section id="markdown-preview" className={styles.previewPane} aria-label="Markdown 实时预览">
      <div className={styles.paneLabel}>预览</div>
      <div className={styles.previewScroll}><article className={styles.markdown}>{markdown.trim() ? <MarkdownDocument markdown={markdown} /> : <p className={styles.blankNote}>写下内容后，会在这里显示。</p>}</article></div>
    </section>
  </main>;
}
