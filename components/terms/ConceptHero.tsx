"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowCounterClockwise, ArrowDownLeft, ArrowUpRight, Brain, Check, FileText, Terminal, Wrench } from "@phosphor-icons/react";
import styles from "./ConceptHero.module.css";

// The three introductions share only playback, not a diagram template.
export function ConceptHero({ slug, label, children }: { slug: string; label?: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const update = () => { element.dataset.playing = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  return <figure ref={ref} className={styles.hero} data-kind={slug} aria-label={label ?? (slug === "tools" ? "请求交给工具，实际结果返回模型" : slug === "context" ? "任务、日志和要求组合成本轮输入" : "从语法错误到检查通过的三次修正")}>
    <div key={replay} className={styles.art} aria-hidden="true">
      {children ?? (slug === "tools" ? <div className={styles.dispatch}>
        <div className={styles.sender}><Brain size={30} weight="light" /><span>模型</span></div>
        <div className={styles.receiver}><FileText size={30} weight="light" /><span>文件工具</span></div>
        <div className={styles.request}><ArrowUpRight size={17} /><code>read_file</code><span>server.log</span></div>
        <div className={styles.receipt}><ArrowDownLeft size={17} /><code>SyntaxError</code><span>app.py : 1</span></div>
      </div> : slug === "context" ? <div className={styles.collage}>
        <div className={styles.input}><Brain size={22} weight="light" /><span>本轮输入</span></div>
        <div className={styles.paper}><span>任务</span><strong>修好这个服务</strong></div>
        <div className={styles.paper}><span>日志</span><code>SyntaxError</code></div>
        <div className={styles.paper}><span>要求</span><strong>检查 /health</strong></div>
      </div> : <div className={styles.revisions}>
        <div><Terminal size={20} /><span>读日志</span><code>SyntaxError</code></div>
        <div><Wrench size={20} /><span>补冒号</span><code>500</code></div>
        <div><Check size={20} /><span>改返回值</span><code>200 OK</code></div>
      </div>)}
    </div>
    <button type="button" className={styles.replay} onClick={() => setReplay(value => value + 1)} aria-label="重播概念首图"><ArrowCounterClockwise size={16} /></button>
  </figure>;
}
