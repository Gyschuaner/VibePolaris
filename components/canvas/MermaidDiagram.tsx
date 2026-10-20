"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./CanvasWorkspace.module.css";

let engine: Promise<typeof import("mermaid")["default"]> | undefined;
// Markdown block keys can change when a paragraph is inserted before a chart.
// Keep a small browser-memory cache so that remount does not redraw identical source.
const rendered = new Map<string, string>();
type Result = { source: string; svg?: string; error?: string };
function loadMermaid() {
  return engine ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({ startOnLoad: false, securityLevel: "strict", suppressErrorRendering: true, maxTextSize: 50_000, maxEdges: 300, htmlLabels: false, theme: "neutral",
      secure: ["securityLevel", "startOnLoad", "suppressErrorRendering", "maxTextSize", "maxEdges", "htmlLabels", "themeCSS", "themeVariables", "fontFamily", "dompurifyConfig", "secure"] });
    return mermaid;
  }).catch(error => { engine = undefined; throw error; });
}

export function MermaidDiagram({ source }: { source: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const container = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<Result | null>(() => rendered.has(source) ? { source, svg: rendered.get(source) } : null);
  useEffect(() => {
    let cancelled = false;
    const cached = rendered.get(source);
    if (cached) {
      queueMicrotask(() => { if (!cancelled) setResult(previous => previous?.source === source && previous.svg === cached ? previous : { source, svg: cached }); });
      return () => { cancelled = true; };
    }
    // Wait for a typing pause, and keep Mermaid's temporary SVGs inside this instance.
    const timer = setTimeout(async () => {
      const target = container.current;
      if (!target) return;
      const scratch = document.createElement("div");
      target.appendChild(scratch);
      try {
        const mermaid = await loadMermaid();
        if (cancelled) return;
        const { svg } = await mermaid.render(`mermaid-${id}-${crypto.randomUUID()}`, source, scratch);
        if (!cancelled) {
          rendered.delete(source); rendered.set(source, svg);
          if (rendered.size > 16) rendered.delete(rendered.keys().next().value!);
          setResult({ source, svg });
        }
      } catch {
        if (!cancelled) setResult({ source, error: "图表暂未完成，请检查 Mermaid 语法。" });
      } finally { scratch.remove(); }
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [source, id]);
  const current: Result | null = result?.source === source ? result : rendered.has(source) ? { source, svg: rendered.get(source) } : null;
  // Keep the previous successful image visible while a changed chart is being drawn.
  const svg = current?.svg || (current?.error ? undefined : result?.svg);
  return <div className={styles.diagram}>
    {svg ? <div role="img" aria-label="Mermaid 图表"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt="" /></div> : <>
      <p className={styles.diagramStatus} role="status">{current?.error || "正在绘制图表…"}</p>
      <pre><code>{source}</code></pre>
    </>}
    <div ref={container} className={styles.diagramScratch} aria-hidden="true" />
  </div>;
}
