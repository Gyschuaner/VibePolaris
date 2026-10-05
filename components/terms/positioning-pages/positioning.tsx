"use client";

import { ArrowCounterClockwise, CheckCircle, Compass, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./PositioningConcept.module.css";

const modes = {
  static: { label: "static", ref: "普通流", detail: "元素按文档顺序排队，top/left 不参与移动。", color: "#668b56" },
  relative: { label: "relative", ref: "自己的原位置", detail: "元素偏移，但原来的占位仍保留给后面的卡片。", color: "#a77a22" },
  absolute: { label: "absolute", ref: "最近定位祖先", detail: "元素脱离普通流；stage 容器是它的 containing block。", color: "#a43f34" },
  fixed: { label: "fixed", ref: "视口", detail: "元素相对视口定位；它不会跟随普通文档滚动。", color: "#486b8a" },
  sticky: { label: "sticky", ref: "滚动容器边界", detail: "元素先在普通流中，再到阈值时贴住滚动容器。", color: "#78547c" },
} as const;
type Mode = keyof typeof modes;

export function PositioningLesson() {
  const [mode, setMode] = useState<Mode>("static");
  const [scrolled, setScrolled] = useState(false);
  const current = modes[mode];
  function choose(next: Mode) { setMode(next); setScrolled(false); }
  return <div className={styles.lab} role="region" aria-label="CSS 定位参照系演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>换定位方式，找出卡片现在相对谁</strong></div><button type="button" onClick={() => { setMode("static"); setScrolled(false); }} aria-label="重置定位演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.modeChoices} role="group" aria-label="选择定位方式">{(Object.keys(modes) as Mode[]).map(key => <button key={key} type="button" aria-pressed={mode === key} onClick={() => choose(key)}>{modes[key].label}</button>)}</div>
    <div className={styles.labBoard} data-mode={mode} data-scrolled={scrolled}>
      <div className={styles.labStage}><span className={styles.stageLabel}>scroll container</span><div className={styles.labLine}>导航</div><div className={styles.labLine}>正文</div><div className={styles.labCard} style={{ "--card-color": current.color } as React.CSSProperties}><Compass size={16} aria-hidden="true" /><strong>{current.label}</strong><small>{current.ref}</small></div><div className={styles.labLine}>下一段</div></div>
      <div className={styles.labReadout}><span>参照系</span><strong>{current.ref}</strong><p>{current.detail}</p>{mode === "sticky" && <button type="button" onClick={() => setScrolled(value => !value)} aria-pressed={scrolled}>{scrolled ? "回到阈值前" : "向下滚动到阈值"}</button>}</div>
    </div>
    <div className={styles.labStatus} role="status">{mode === "absolute" ? <><WarningCircle size={17} aria-hidden="true" /><span><strong>占位消失。</strong>如果 stage 没有定位，卡片会继续向外寻找包含块，常见结果是跑到页面边缘。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span><strong>{current.label} · {current.ref}。</strong>{current.detail}</span></>}</div>
  </div>;
}
