import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HarnessV4Toc, type TocItem } from "@/components/terms/HarnessV4Toc";
import { ReadingNotes } from "@/components/notes/ReadingNotes";
import type { NoteSource } from "@/lib/reading-notes";
import { MarkdownDocument } from "./MarkdownDocument";
import styles from "./CanvasWorkspace.module.css";

export function MarkdownReader({ markdown, fallbackTitle, empty, onScroll, source }: { markdown: string; fallbackTitle?: string; empty: ReactNode; onScroll?: (top: number) => void; source?: NoteSource }) {
  const content = useRef<HTMLDivElement>(null);
  const prefix = useId();
  const [items, setItems] = useState<TocItem[]>([]);

  useLayoutEffect(() => {
    // Read the rendered headings so raw HTML, inline formatting and code fences agree with the document.
    const headings = Array.from(content.current?.querySelectorAll<HTMLElement>("article h1, article h2, article h3, article h4, article h5, article h6") ?? []);
    const minimum = Math.min(...headings.map(heading => Number(heading.tagName[1])));
    const used = new Set<string>();
    const next: TocItem[] = headings.map((heading, index) => {
      if (!heading.id || heading.id.startsWith(prefix) || used.has(heading.id)) heading.id = `${prefix}-heading-${index}`;
      used.add(heading.id);
      heading.tabIndex = -1;
      return [heading.id, heading.textContent?.trim() || "无标题", Number(heading.tagName[1]) - minimum];
    });
    const frame = requestAnimationFrame(() => setItems(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next));
    return () => cancelAnimationFrame(frame);
  }, [markdown, fallbackTitle, prefix, source?.path]);

  const body = <article className={styles.markdown}>{markdown.trim() ? <MarkdownDocument markdown={markdown} fallbackTitle={fallbackTitle} /> : <>{fallbackTitle && <h1>{fallbackTitle}</h1>}{empty}</>}</article>;
  if (source) return <div className={styles.reader} data-canvas-content>
    <div ref={content} className={styles.readingContent} onScroll={event => onScroll?.(event.currentTarget.scrollTop)}>
      <ReadingNotes path={source.path} title={source.title} layout="canvas" scrollRoot={content}>
        <HarnessV4Toc items={items} scrollRoot={content} className={styles.readingToc} />
        <main>{body}</main>
      </ReadingNotes>
    </div>
  </div>;
  return <main className={styles.reader} data-canvas-content>
    {items.length > 0 && <aside className={styles.readingDirectory} aria-label="正文目录">
      <span className={styles.directoryLabel}>目录</span>
      <HarnessV4Toc items={items} scrollRoot={content} className={styles.readingToc} />
    </aside>}
    <div ref={content} className={styles.readingContent} onScroll={event => onScroll?.(event.currentTarget.scrollTop)}>
      {body}
    </div>
  </main>;
}
