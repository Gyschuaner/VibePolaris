"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ControlRedesignConcepts.module.css";

export type ControlHeroKind =
  | "branch"
  | "loop"
  | "object"
  | "array"
  | "client"
  | "monolith"
  | "microservices"
  | "distributed"
  | "events"
  | "serverless";

export function ControlRedesignRuntime({ kind, label, children }: { kind: ControlHeroKind; label: string; children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const motionState = inViewport && documentVisible && playing ? "playing" : "paused";
  return (
    <figure ref={heroRef} className={styles.signatureHero} aria-label={label} data-motion={motionState}>
      <div key={replayKey} className={`${styles.heroCanvas} ${styles.heroSpecial}`} data-kind={kind}>{children}</div>
      <div className={styles.heroControls} role="group" aria-label="首图动效控制">
        <button type="button" aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "暂停" : "播放"}</button>
        <button type="button" onClick={() => { setReplayKey(value => value + 1); setPlaying(true); }}>重播</button>
      </div>
    </figure>
  );
}
