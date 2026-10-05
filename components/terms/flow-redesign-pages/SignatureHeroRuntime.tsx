"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./FlowRedesignConcepts.module.css";

type HeroKind = "loading" | "micro" | "motion" | "client" | "deploy" | "flow" | "wireframe" | "prototype" | "ia" | "a11y" | "lockfile" | "monorepo" | "environment-variable" | "source-map" | "linter" | "formatter" | "expression" | "function" | "parameter" | "return-value";

export function SignatureHeroRuntime({ kind, label, children }: { kind: HeroKind; label: string; children: ReactNode }) {
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
    const handleVisibility = () => setDocumentVisible(!document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const motionState = inViewport && documentVisible && playing ? "playing" : "paused";
  function replay() {
    setReplayKey(value => value + 1);
    setPlaying(true);
  }

  return <figure ref={heroRef} className={styles.signatureHero} aria-label={label} data-motion={motionState}><div key={replayKey} className={`${styles.heroCanvas} ${styles.heroSpecial}`} data-kind={kind}>{children}</div><div className={styles.heroControls} role="group" aria-label="首图动效控制"><button type="button" aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "暂停" : "播放"}</button><button type="button" onClick={replay}>重播</button></div></figure>;
}
