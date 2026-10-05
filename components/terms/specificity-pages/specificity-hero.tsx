"use client";

import { ArrowRight, CheckCircle, Code, Hash, TextAa, TextT } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./SpecificityConcept.module.css";

const frames = [
  { label: "先看三列", selector: ".card", score: "0-1-0", winner: "class", note: "同一来源、同一层里，先比较 ID，再比较类，最后才看元素。", tone: "class" },
  { label: "ID 先胜", selector: "#settings .card", score: "1-1-0", winner: "ID", note: "左边的 ID 列已经不同，后面的类和元素列暂时不用比较。", tone: "id" },
  { label: ":where() 归零", selector: ":where(#settings) .card", score: "0-1-0", winner: "class", note: ":where() 里的选择器不贡献优先级，外面的 class 又回到一列。", tone: "where" },
  { label: ":is() 取最高", selector: ":is(#settings, .panel) .card", score: "1-1-0", winner: "ID", note: ":is() 取参数里最具体的一项；它不是把每个参数相加。", tone: "is" },
];

export function SpecificityHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} data-tone={current.tone} aria-label="CSS 选择器优先级按三列比较">
    <div className={styles.heroTop}><span>同一层里的两条颜色规则</span><strong>SPECIFICITY · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.selectorCard}><Code size={18} aria-hidden="true" /><span>当前选择器</span><code>{current.selector}</code><div className={styles.score}>{current.score.split("-").map((value, index) => <span key={`${value}-${index}`}><b>{value}</b><small>{["ID", "类", "元素"][index]}</small></span>)}</div></div>
      <div className={styles.heroArrow} aria-hidden="true"><ArrowRight size={18} /><span>左到右</span></div>
      <div className={styles.heroResult}><CheckCircle size={17} aria-hidden="true" /><span>先比较</span><strong>{current.winner} 列</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Hash size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>优先级是一串三列数字，不是把选择器的字符数相加；前一列分出胜负，后一列就不再出场。</figcaption>
  </figure>;
}
