"use client";

import { ArrowDown, ArrowRight, ArrowsClockwise, CheckCircle, Ruler, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./FlexboxConcept.module.css";

const frames = [
  { label: "先放入基准尺寸", axis: "row", container: "480px 主轴", sizes: [120, 120, 120], free: "+120px", ratio: "还没分配", wrap: false, note: "三个项目先按自己的 flex-basis 排队，剩下的空间还没有被项目拿走。", stage: "BASE" },
  { label: "打开 grow 比例", axis: "row", container: "480px 主轴", sizes: [120, 120, 120], free: "+120px", ratio: "1 : 2 : 1", wrap: false, note: "grow 只说谁能分到剩余空间，先把比例写在桌面上。", stage: "RATIO" },
  { label: "把余量分给项目", axis: "row", container: "480px 主轴", sizes: [150, 180, 150], free: "+120px → 0", ratio: "A 30 · B 60 · C 30", wrap: false, note: "自由空间被切成四份，B 的 grow 是 2，所以拿到两份。", stage: "GROW" },
  { label: "空间变成负数", axis: "row", container: "300px 主轴", sizes: [100, 100, 100], free: "−60px → 0", ratio: "shrink = 1", wrap: false, note: "基准尺寸总和超过容器，shrink 把负空间按规则收回，避免无故溢出。", stage: "SHRINK" },
  { label: "允许换行", axis: "row", container: "300px 主轴", sizes: [112, 112, 112], free: "两条 flex line", ratio: "wrap = on", wrap: true, note: "换行不会让第二行和第一行组成网格；每一行仍是自己的主轴分配。", stage: "WRAP" },
  { label: "主轴转到纵向", axis: "column", container: "480px 高度", sizes: [54, 54, 54], free: "+318px", ratio: "column", wrap: false, note: "justify-content 的方向跟着主轴走；换成 column 后，它不再等于“水平对齐”。", stage: "AXIS" },
] as const;

function itemFlex(step: number, axis: string, wrap: boolean, index: number, size: number) {
  if (axis === "column" || wrap) return `0 0 ${size}px`;
  if (step === 2) return `${index === 1 ? 2 : 1} 1 120px`;
  return "0 1 120px";
}

export function FlexboxHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const negative = scene.step === 3;
  const wrap = current.wrap;
  const ColumnIcon = current.axis === "column" ? ArrowDown : ArrowRight;
  const ResultIcon = negative ? WarningCircle : scene.step === frames.length - 1 ? CheckCircle : Ruler;

  return <figure ref={scene.ref} className={styles.flexHero} data-step={scene.step} aria-label="Flexbox 怎样沿主轴计算并分配项目空间">
    <div className={styles.flexHeader}><span>三个项目，一条主轴，一次空间结算</span><strong>{current.stage} · {current.container}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.flexBoard}>
      <div className={styles.flexPanel} data-active={scene.step <= 1}>
        <div className={styles.flexLabel}><Ruler size={17} aria-hidden="true" /><span>容器先问一个问题</span></div>
        <h3>{current.container}</h3>
        <div className={styles.flexBars}>
          <div className={styles.flexBar} data-negative={negative}><span>base</span><i style={{ width: `${Math.min(100, current.sizes[0] / 2)}%` }} /><b>{current.sizes[0]}px</b></div>
          <div className={styles.flexBar} data-negative={negative}><span>free</span><i style={{ width: `${negative ? 38 : scene.step === 2 ? 0 : 46}%` }} /><b>{current.free}</b></div>
        </div>
        <small>先算项目的自然尺寸，再判断主轴还有多少正空间或负空间。</small>
      </div>
      <div className={styles.flexAxis} aria-hidden="true"><ColumnIcon size={20} /><span>{current.axis === "column" ? "主轴 ↓" : "主轴 →"}</span></div>
      <div className={styles.flexPanel} data-active={scene.step >= 2}>
        <div className={styles.flexLabel}><ArrowsClockwise size={17} aria-hidden="true" /><span>项目怎样接住结果</span></div>
        <h3>{scene.step === 0 ? "flex: 0 1 120px" : scene.step === 1 ? "grow 计划 1:2:1 · basis 120px" : scene.step === 2 ? "grow 1:2:1 · basis 120px" : scene.step === 3 ? "flex: 0 1 120px" : wrap ? "flex: 0 0 112px" : "flex: 0 0 54px · column"}</h3>
        <div className={styles.flexItems} data-column={current.axis === "column"} data-wrap={wrap}>
          {current.sizes.map((size, index) => <div key={index} className={styles.flexItem} data-item={index === 0 ? "a" : index === 1 ? "b" : "c"} data-wrap={wrap} style={{ flex: itemFlex(scene.step, current.axis, wrap, index, size) }}><strong>{String.fromCharCode(65 + index)}</strong><code>{size}px</code></div>)}
        </div>
        <small>{wrap ? "A、B 在第一行，C 落到下一条 flex line。" : current.axis === "column" ? "同一套规则沿垂直主轴结算。" : "项目的宽度随着空间结算移动，而不是靠手写每个 left。"}</small>
      </div>
    </div>
    <div className={styles.flexNote} role="status">{negative ? <WarningCircle size={17} aria-hidden="true" /> : scene.step === frames.length - 1 ? <CheckCircle size={17} aria-hidden="true" /> : <Ruler size={17} aria-hidden="true" />}<span>{current.note}</span></div>
    <div className={styles.flexMetrics}><div><span>空间账本</span><strong>{current.free}</strong></div><div><span>分配规则</span><strong>{current.ratio}</strong></div><div><span>项目关系</span><strong>{wrap ? "两条 flex line" : current.axis === "column" ? "一列" : "一行"}</strong></div></div>
    <div className={styles.flexResult}><ResultIcon size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>Flexbox 不是“把东西排成一行”的魔法。浏览器先确定主轴、基准尺寸和自由空间，再按 grow、shrink、对齐和换行规则把结果交给项目。</figcaption>
  </figure>;
}
