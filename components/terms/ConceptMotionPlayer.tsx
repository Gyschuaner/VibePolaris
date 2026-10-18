"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import styles from "./ConceptMotion.module.css";

export function ConceptMotionPlayer({ label, kind, children }: { label: string; kind: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const update = () => { element.dataset.running = String(visible && !document.hidden && !paused && !finished); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .2 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [paused, finished, replay]);

  function restart() {
    setFinished(false);
    setPaused(false);
    setReplay(value => value + 1);
  }

  return <figure className={styles.motion} ref={ref} data-motion={kind} data-running="false" aria-label={label}>
    <div key={replay} className={styles.drawing}>
      {children}
      <span className={styles.timer} onAnimationEnd={() => setFinished(true)} aria-hidden="true" />
    </div>
    <div className={styles.controls}>
      <button type="button" onClick={finished ? restart : () => setPaused(value => !value)} aria-label={finished ? "重播概念动画" : paused ? "播放概念动画" : "暂停概念动画"}>{finished ? <ArrowCounterClockwise size={13} /> : paused ? <Play size={13} /> : <Pause size={13} />}</button>
      {!finished && <button type="button" onClick={restart} aria-label="重播概念动画"><ArrowCounterClockwise size={13} /></button>}
    </div>
  </figure>;
}
