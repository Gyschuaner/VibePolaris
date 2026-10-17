"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { NewsMotionDesign } from "@/lib/news-motion-types";
import { AuthoredScene } from "@/components/news-motion/AuthoredScenes";
import { MaterialScene } from "@/components/news-motion/MaterialScenes";
import { SignalScene } from "@/components/news-motion/SignalScenes";

/** One continuous mechanism, with one clock and native keyboard controls. */
export function NewsMotionExplainer({ design }: { design: Omit<NewsMotionDesign, "rationale"> }) {
  const id = useId().replace(/:/g, "");
  const stage = useRef<HTMLDivElement>(null);
  const position = useRef(design.preview);
  const started = useRef(false);
  const [progress, setProgress] = useState(design.preview);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [width, setWidth] = useState(720);
  const height = width < 640 ? 560 : 420;

  function seek(value: number) {
    position.current = value;
    setProgress(value);
  }

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const resize = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(Math.round(entry.contentRect.width));
    });
    resize.observe(node);
    const intersection = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    intersection.observe(node);
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    return () => { resize.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", hide); };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) { setPlaying(false); position.current = 1; setProgress(1); }
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const from = position.current;
    const start = performance.now();
    let frame = 0;
    function tick(now: number) {
      const value = Math.min(1, from + (now - start) / (design.duration * 1000));
      position.current = value;
      setProgress(value);
      if (value < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced, design.duration, replay]);

  const props = { design: { ...design, rationale: "" }, progress, width, height, id };
  return (
    <div className={`news-motion news-motion-${design.mood}`} data-motion-scene={design.scene}>
      <header className="news-motion-heading"><p>动手看机制</p><h2>{design.title}</h2></header>
      <div className="news-motion-stage" ref={stage}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
          <title id={`${id}-title`}>{design.title}</title>
          <desc id={`${id}-desc`}>{`${design.source}：${design.items.join("、")}。${design.actor}，${design.action}；目标是${design.target}。${design.result}${design.boundary ?? ""}`}</desc>
          <AuthoredScene {...props} /><MaterialScene {...props} /><SignalScene {...props} />
        </svg>
      </div>
      <div className="news-motion-result" aria-label="演示结果"><p>{design.result}</p></div>
      <div className="news-motion-controls">
        <button type="button" disabled={reduced} aria-pressed={playing} onClick={() => {
          if (playing) { setPlaying(false); return; }
          if (!started.current || position.current >= 1) seek(0);
          started.current = true;
          setPlaying(true);
        }}>{playing ? "暂停" : progress >= 1 && started.current ? "再看一次" : started.current ? "继续" : "播放演示"}</button>
        <button type="button" disabled={reduced} onClick={() => { seek(0); started.current = true; setReplay(value => value + 1); setPlaying(true); }}>重播</button>
        <label htmlFor={`${id}-position`} className="sr-only">动画位置</label>
        <input id={`${id}-position`} type="range" min={0} max={1000} step={1} value={Math.round(progress * 1000)} aria-valuetext={`${Math.round(progress * 100)}%`} onChange={event => {
          setPlaying(false); started.current = true; seek(Number(event.target.value) / 1000);
        }} />
      </div>
      {design.boundary && <p className="news-motion-boundary">{design.boundary}</p>}
    </div>
  );
}
