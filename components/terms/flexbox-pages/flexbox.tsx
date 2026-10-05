"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowsClockwise, CheckCircle, Ruler, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./FlexboxConcept.module.css";

const labels = ["放入基准尺寸", "计算自由空间", "分配 grow", "处理负空间", "允许换行"];
type WidthMode = "wide" | "narrow";

function lessonItemFlex(step: number, wrapped: boolean, index: number) {
  if (wrapped) return "0 0 112px";
  if (step === 2) return `${index === 1 ? 2 : 1} 1 120px`;
  return "0 1 120px";
}

export function FlexboxLesson() {
  const scene = useScene(labels.length);
  const [width, setWidth] = useState<WidthMode>("wide");
  const [wrap, setWrap] = useState(false);
  const forcedWidth = scene.step === 2 ? "wide" : scene.step === 3 || (scene.step === 4 && wrap) ? "narrow" : width;
  const activeWidth = forcedWidth;
  useEffect(() => {
    if ((scene.step === 2 && width !== "wide") || ((scene.step === 3 || (scene.step === 4 && wrap)) && width !== "narrow")) setWidth(forcedWidth);
  }, [forcedWidth, scene.step, width, wrap]);
  const widthPx = activeWidth === "wide" ? 480 : 300;
  const sizes = useMemo(() => {
    if (scene.step === 2) return activeWidth === "wide" ? [150, 180, 150] : [100, 100, 100];
    if (scene.step === 3) return [100, 100, 100];
    if (scene.step === 4 && wrap) return [112, 112, 112];
    return [120, 120, 120];
  }, [activeWidth, scene.step, wrap]);
  const free = scene.step === 3 ? "−60px → 0" : scene.step === 2 && activeWidth === "wide" ? "+120px → 0" : `${widthPx - 360 >= 0 ? "+" : "−"}${Math.abs(widthPx - 360)}px`;
  const wrapped = scene.step === 4 && wrap;
  const status = scene.step === 0 ? "项目刚排入主轴，还没有分配余量。" : scene.step === 1 ? "先把正空间或负空间算清楚，才能解释项目为什么变宽或变窄。" : scene.step === 2 ? "grow 是比例，不是固定像素；B 拿两份，所以它比 A、C 多一份。" : scene.step === 3 ? "负空间被 shrink 收回；如果禁止缩小或遇到 min-content，仍可能溢出。" : wrapped ? "wrap 开启后，项目进入不同 flex line；每一行各自结算，不会自动对齐成网格。" : "先打开允许换行，才能把空间不足变成多行，而不是继续挤压或溢出。";
  const StatusIcon = scene.step === 3 ? WarningCircle : scene.step === 4 && wrapped ? CheckCircle : Ruler;

  return <div ref={scene.ref} className={styles.flexLab} role="region" aria-label="Flexbox 自由空间、grow、shrink 和换行工作台">
    <div className={styles.flexHeader}><span>改一个条件，看项目怎样重新结算</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.flexControls} role="group" aria-label="调整 Flexbox 条件">
      <button type="button" className={styles.flexControl} aria-pressed={activeWidth === "wide"} onClick={() => { setWidth("wide"); scene.seek(0); }}>容器 480px</button>
      <button type="button" className={styles.flexControl} aria-pressed={activeWidth === "narrow"} onClick={() => { setWidth("narrow"); scene.seek(0); }}>容器 300px</button>
      <button type="button" className={styles.flexControl} aria-pressed={wrap} onClick={() => { setWrap(value => !value); scene.seek(0); }}>{wrap ? "关闭换行" : "允许换行"}</button>
    </div>
    <div className={styles.flexLabGrid}>
      <div className={styles.flexLabPanel} data-active={scene.step <= 1}>
        <div className={styles.flexLabel}><Ruler size={16} aria-hidden="true" /><span>输入条件</span></div>
        <h3>{widthPx}px 的主轴</h3>
        <div className={styles.flexLabSizing}>
          <div><span>base</span><i style={{ width: "54%" }} /><b>120×3</b></div>
          <div data-negative={activeWidth === "narrow"}><span>free</span><i style={{ width: `${Math.min(100, Math.abs(widthPx - 360) / 2)}%` }} /><b>{free}</b></div>
        </div>
        <small>Flexbox 先看项目的基准尺寸和容器的可用主轴空间。</small>
      </div>
      <div className={styles.flexLabArrow} aria-hidden="true"><ArrowsClockwise size={22} /></div>
      <div className={styles.flexLabPanel} data-active={scene.step >= 2}>
        <div className={styles.flexLabel}><ArrowsClockwise size={16} aria-hidden="true" /><span>结算后的项目</span></div>
        <h3>{wrapped ? "两条 flex line" : `flex-direction: row · ${scene.step === 4 ? "仍未换行" : "一条 line"}`}</h3>
        <div className={styles.flexItems} data-wrap={wrapped}>
          {sizes.map((size, index) => <div key={index} className={styles.flexItem} data-item={index === 0 ? "a" : index === 1 ? "b" : "c"} data-wrap={wrapped} style={{ flex: lessonItemFlex(scene.step, wrapped, index) }}><strong>{String.fromCharCode(65 + index)}</strong><code>{size}px</code></div>)}
        </div>
        <small>{wrapped ? "A、B 先占第一行，C 进入第二行；第二行不会跟第一行共享列轨道。" : "项目宽度变化来自主轴空间结算，不是浏览器随机挤压。"}</small>
      </div>
    </div>
    <div className={styles.flexLabMetrics}><div><span>本步自由空间</span><strong>{free}</strong></div><div><span>当前策略</span><strong>{wrapped ? "flex-wrap: wrap" : scene.step === 2 ? "grow = 1:2:1" : scene.step === 3 ? "shrink = 1" : "flex: initial"}</strong></div><div><span>结果</span><strong>{wrapped ? "分成两行" : scene.step === 3 ? "收回负空间" : scene.step >= 2 ? "尺寸已重算" : "等待推进"}</strong></div></div>
    <p className={styles.flexLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
