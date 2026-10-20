"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./CanvasWorkspace.module.css";

let engine: Promise<typeof import("mermaid")["default"]> | undefined;
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
  const [result, setResult] = useState<{ source: string; svg?: string; error?: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
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
        if (!cancelled) setResult({ source, svg });
      } catch {
        if (!cancelled) setResult({ source, error: "图表暂未完成，请检查 Mermaid 语法。" });
      } finally { scratch.remove(); }
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [source, id]);
  const current = result?.source === source ? result : null;
  return <div className={styles.diagram}>
    {current?.svg ? <div role="img" aria-label="Mermaid 图表"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(current.svg)}`} alt="" /></div> : <>
      <p className={styles.diagramStatus} role="status">{current?.error || "正在绘制图表…"}</p>
      <pre><code>{source}</code></pre>
    </>}
    <div ref={container} className={styles.diagramScratch} aria-hidden="true" />
  </div>;
}
