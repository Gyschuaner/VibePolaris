"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { LibraryAnimation } from "@/lib/library-animations";
import styles from "./Library.module.css";

export function AnimationPreview({ item, decorative, active, css: initialCss, replay = 0, paused = false, speed = 1, manual = false }: { item: LibraryAnimation; decorative: boolean; active: boolean; css?: string; replay?: number; paused?: boolean; speed?: number; manual?: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false), [entered, setEntered] = useState(false);
  const [hidden, setHidden] = useState(false), [reduced, setReduced] = useState(true);
  const [css, setCss] = useState(initialCss || ""), [error, setError] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setEntered(true); }, { threshold: .1 });
    if (frame.current) observer.observe(frame.current);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setHidden(document.hidden); setReduced(preference.matches); };
    update(); document.addEventListener("visibilitychange", update); preference.addEventListener("change", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); preference.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (!entered || initialCss !== undefined) return;
    const controller = new AbortController();
    fetch(`/library/animations/${item.slug}.css`, { signal: controller.signal }).then(response => { if (!response.ok) throw new Error("preview"); return response.text(); }).then(setCss).catch(error => { if (error.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, [entered, initialCss, item.slug]);
  const enabled = active && (!reduced || manual);
  return <div ref={frame} className={`${styles.sample} ${styles.motionSample}`} aria-hidden={decorative || undefined} data-animation={item.slug}>
    {css && <style>{css}</style>}
    <div className={styles.motionFrame}>
      <div key={replay} className={`vp-motion-${item.slug} ${styles.motionObject} ${item.kind === "element" ? styles.elementMotion : ""}`} data-active={enabled && !!css} data-running={visible && !hidden && !paused} data-motion-opt-in={manual} style={{ "--motion-scale": 1 / speed, "--color-1": item.group === "骨架屏" ? "var(--surface)" : "var(--ink)", "--color-2": "var(--accent)" } as CSSProperties}>{item.kind === "element" ? "Motion" : null}</div>
    </div>
    {!css && <span className={styles.motionStatus}>{error ? "预览暂时不可用，可进入详情查看" : "加载预览…"}</span>}
    {decorative && css && <span className={styles.motionHint}>移入查看动效</span>}
  </div>;
}
