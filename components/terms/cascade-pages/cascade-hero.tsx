"use client";

import { ArrowRight, Check, FileText, Flag, Scales, ShieldCheck, Stack } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CascadeConcept.module.css";

const frames = [
  { label: "来源先分组", winner: "浏览器默认", color: "black", detail: "UA normal", active: ["ua"], note: "默认声明先提供一个值，但作者样式还没有进场。" },
  { label: "作者层进入", winner: "base 层", color: "seagreen", detail: "author · @layer base", active: ["base"], note: "作者普通声明胜过浏览器默认，来源先于选择器比较。" },
  { label: "主题层胜出", winner: "theme 层", color: "olive", detail: "author · @layer theme", active: ["theme"], note: "theme 是后来创建的层，哪怕选择器更简单，也先淘汰 base。" },
  { label: "未分层进入", winner: "普通样式", color: "tomato", detail: "author · implicit final layer", active: ["plain"], note: "未分层的普通声明落在隐式最终层，胜过命名层。" },
  { label: "行内值落定", winner: "行内样式", color: "plum", detail: "author · inline", active: ["inline"], note: "行内普通样式在作者样式表之后，最终颜色变为 plum。" },
] as const;

export function CascadeHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const rows = [
    { id: "ua", icon: Flag, label: "浏览器默认", code: "button { color: black }" },
    { id: "base", icon: Stack, label: "base 层", code: "@layer base · .button" },
    { id: "theme", icon: Stack, label: "theme 层", code: "@layer theme · #app .button" },
    { id: "plain", icon: FileText, label: "未分层", code: ".button { color: tomato }" },
    { id: "inline", icon: Scales, label: "行内样式", code: "style=\"color: plum\"" },
  ];
  const currentRow = rows.find(row => row.id === current.active[0]) ?? rows[0];
  const CurrentIcon = currentRow.icon;
  return <figure ref={scene.ref} className={styles.hero} data-step={scene.step} aria-label="层叠如何从多个 CSS 声明筛出最终颜色">
    <div className={styles.heroTop}><span>同一个按钮，五张颜色便签</span><strong>CASCADE · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.declaration} data-active="true">
        <CurrentIcon size={19} aria-hidden="true" /><div><span>当前进入比较的声明</span><strong>{currentRow.label}</strong><code>{currentRow.code}</code></div>
      </div>
      <div className={styles.heroArrow} aria-hidden="true"><ArrowRight size={23} /><span>一关一关筛</span></div>
      <div className={styles.winner} style={{ "--winner-color": current.color } as React.CSSProperties}>
        <div className={styles.winnerSwatch} /><span>最终 color</span><strong>{current.winner}</strong><code>{current.detail}</code><Check size={19} aria-hidden="true" />
      </div>
    </div>
    <div className={styles.heroNote} role="status"><ShieldCheck size={17} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>颜色不是被“最具体”的选择器抢走的；声明要先过来源、层和重要性，留下来的候选才会继续比优先级与顺序。</figcaption>
  </figure>;
}
