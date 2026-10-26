"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { animationPoster, animationStylesheet, type LibraryAnimation } from "@/lib/library-animations";
import styles from "./Library.module.css";

const loadedStyles = new Map<string, string>();

export function AnimationPreview({ item, decorative, active, loop = false, css: initialCss, replay = 0, paused = false, speed = 1, manual = false }: { item: LibraryAnimation; decorative: boolean; active: boolean; loop?: boolean; css?: string; replay?: number; paused?: boolean; speed?: number; manual?: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false), [reduced, setReduced] = useState(true);
  const [css, setCss] = useState(initialCss || ""), [error, setError] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    if (frame.current) observer.observe(frame.current);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setHidden(document.hidden); setReduced(preference.matches); };
    update(); document.addEventListener("visibilitychange", update); preference.addEventListener("change", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); preference.removeEventListener("change", update); };
  }, []);
  const enabled = active && visible && !hidden && (!reduced || manual);
  const href = animationStylesheet(item);
  useEffect(() => {
    if (!enabled || css) return;
    const cached = loadedStyles.get(href);
    if (cached) { setCss(cached); return; }
    const controller = new AbortController();
    setError(false);
    fetch(href, { signal: controller.signal, cache: "force-cache" })
      .then(response => { if (!response.ok) throw new Error("preview"); return response.text(); })
      .then(value => { if (!controller.signal.aborted) { loadedStyles.set(href, value); setCss(value); } })
      .catch(reason => { if (reason.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, [enabled, css, href]);
  const live = enabled && !!css;
  return <div ref={frame} className={`${styles.sample} ${styles.motionSample}`} aria-hidden={decorative || undefined} data-animation={item.slug} data-decorative={decorative} data-preview={live ? "live" : "poster"}>
    {live ? <><style>{css}</style><div className={styles.motionFrame}>
      <div key={replay} className={`vp-motion-${item.slug} ${styles.motionObject} ${item.kind === "element" ? styles.elementMotion : ""}`} data-running={!paused} data-motion-opt-in={manual} style={{ "--motion-scale": 1 / speed, "--color-1": item.group === "骨架屏" ? "var(--surface)" : "var(--ink)", "--color-2": "var(--accent)", animationIterationCount: loop && item.kind === "element" ? "infinite" : undefined } as CSSProperties}>{item.label || null}</div>
    </div></> : <img className={styles.motionPoster} src={animationPoster(item)} alt="" width={280} height={180} loading="lazy" decoding="async" />}
    {decorative && active && error && <span className={styles.motionHint}>暂时无法播放，点击查看详情</span>}
  </div>;
}
