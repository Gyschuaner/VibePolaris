"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Brain, Circuitry, FileText, TerminalWindow } from "@phosphor-icons/react";
import styles from "./HarnessHeroOverview.module.css";

const nodes = [
  { id: "model", label: "模型", Icon: Brain, x: 12, y: 33, href: "#need", description: "根据已有信息，提出下一步。" },
  { id: "harness", label: "调度", Icon: Circuitry, x: 49, y: 53, href: "#need", description: "检查请求、调用工具、保存结果。" },
  { id: "file", label: "文件", Icon: FileText, x: 83, y: 18, href: "#service", description: "读取日志，把内容交回 Harness。" },
  { id: "terminal", label: "终端", Icon: TerminalWindow, x: 85, y: 80, href: "#quality", description: "运行命令，用执行结果检查修改。" },
] as const;
type NodeId = typeof nodes[number]["id"];
const paths = {
  model: "M 70 83 C 120 83 120 133 173 133",
  file: "M 219 125 C 269 125 270 45 310 45",
  terminal: "M 219 142 C 267 142 276 200 317 200",
};
const stages = [
  { path: "model", reverse: false, caption: "模型请求读日志" },
  { path: "file", reverse: false, caption: "工具读取 server.log" },
  { path: "file", reverse: true, caption: "日志返回 Harness" },
  { path: "model", reverse: true, caption: "结果进入下一次输入" },
] as const;

export function HarnessHeroOverview() {
  const ref = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [focused, setFocused] = useState<NodeId | null>(null);
  const stop = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStep(null);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { stop(); return; }
      if (started || document.hidden) return;
      started = true;
      if (motion.matches) return;
      setStep(0);
      timers.current = [1, 2, 3, 4].map(index => window.setTimeout(() => setStep(index === 4 ? null : index), index * 900));
    }, { threshold: .4 });
    observer.observe(ref.current!);
    const pause = () => { if (document.hidden || motion.matches) stop(); };
    document.addEventListener("visibilitychange", pause);
    motion.addEventListener("change", pause);
    return () => {
      observer.disconnect();
      timers.current.forEach(window.clearTimeout);
      document.removeEventListener("visibilitychange", pause);
      motion.removeEventListener("change", pause);
    };
  }, [stop]);

  const active = hovered ?? focused;
  const stage = step === null ? null : stages[step];
  const route = active === "harness" ? null : active ?? stage?.path;
  const caption = active ? nodes.find(node => node.id === active)!.description : stage?.caption;

  return <figure ref={ref} className={styles.overview} aria-label="Harness 运行概览" data-step={step ?? "idle"}>
    <div className={styles.diagram}>
      <svg className={styles.connections} viewBox="0 0 400 250" aria-hidden="true">
        {Object.entries(paths).map(([id, path]) => <path key={id} d={path} className={styles.path} data-active={active === "harness" || route === id} />)}
        {route && <circle key={`${active}-${step}`} r="3" className={styles.packet} style={{ offsetPath: `path('${paths[route]}')`, animationDirection: !active && stage?.reverse ? "reverse" : "normal" } as CSSProperties} />}
      </svg>
      {nodes.map(({ id, label, Icon, x, y, href, description }) => <a key={id} href={href} className={styles.node} data-node={id} data-active={active === id || (!active && stage && (id === "harness" || route === id))}
        style={{ left: `${x}%`, top: `${y}%` }} aria-label={`${label}：${description}点击阅读相关正文。`}
        onPointerEnter={() => { stop(); setHovered(id); }} onPointerLeave={() => setHovered(null)}
        onFocus={() => { stop(); setFocused(id); }} onBlur={() => setFocused(null)}>
        <span className={styles.icon}><Icon weight="light" aria-hidden="true" /></span><span>{label}</span>
      </a>)}
    </div>
    <figcaption className={styles.caption}>{caption && <span key={caption}>{caption}</span>}</figcaption>
  </figure>;
}
