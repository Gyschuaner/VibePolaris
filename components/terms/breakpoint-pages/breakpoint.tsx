"use client";

import { useState } from "react";
import { CheckCircle, Gauge, Ruler, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./BreakpointConcept.module.css";

const labels = ["放宽观察", "感到压力", "记录失效", "提前切换", "小屏收束"];
type WidthChoice = 1024 | 840 | 680 | 640 | 360;

function position(width: number) {
  return `${Math.max(0, Math.min(100, ((width - 360) / (1024 - 360)) * 100))}%`;
}

export function BreakpointLesson() {
  const scene = useScene(labels.length);
  const [chosenWidth, setChosenWidth] = useState<WidthChoice>(1024);
  const stepWidths: Record<number, WidthChoice> = { 1: 840, 2: 640, 3: 680, 4: 360 };
  const width = scene.step === 0 ? chosenWidth : stepWidths[scene.step];
  const failed = width < 680;
  const switched = scene.step >= 3;
  const layout = switched ? width <= 360 ? "stack" : "compact" : failed ? "collision" : "fluid";
  const style = { "--width-position": position(width), "--failure-position": position(680) } as CSSProperties;
  const status = scene.step === 0 ? (failed ? "这个宽度已经让内容开始挤压；先记录证据，再决定是否要切换规则。" : "先观察同一组件在不同宽度下的内容表现，不要先拿设备名当答案。") : scene.step === 1 ? "间距正在消失，但还没有坏；压力是寻找断点的线索，不是断点本身。" : scene.step === 2 ? "搜索和导航首次互相抢位置，这个失效点就是候选断点。" : scene.step === 3 ? "在第一次失效前切换，内容恢复可读；断点是规则改变的时刻。" : "小屏只保留必要动作；如果流体布局已经足够，就不要继续增加断点。";
  const StatusIcon = layout === "collision" ? WarningCircle : switched ? CheckCircle : Ruler;

  return <div ref={scene.ref} className={styles.breakpointLab} role="region" aria-label="断点内容压力与布局切换工作台">
    <div className={styles.breakpointHeader}><span>拖过内容压力线，再决定规则何时改变</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.breakpointControls} role="group" aria-label="选择观察宽度">
      <button type="button" className={styles.breakpointControl} aria-pressed={chosenWidth === 1024 && scene.step === 0} onClick={() => { setChosenWidth(1024); scene.seek(0); }}>1024px</button>
      <button type="button" className={styles.breakpointControl} aria-pressed={chosenWidth === 840 && scene.step === 0} onClick={() => { setChosenWidth(840); scene.seek(0); }}>840px</button>
      <button type="button" className={styles.breakpointControl} aria-pressed={chosenWidth === 640 && scene.step === 0} onClick={() => { setChosenWidth(640); scene.seek(0); }}>640px</button>
      <button type="button" className={styles.breakpointControl} aria-pressed={chosenWidth === 360 && scene.step === 0} onClick={() => { setChosenWidth(360); scene.seek(0); }}>360px</button>
    </div>
    <div className={styles.breakpointLabGrid}>
      <div className={styles.breakpointLabPanel} data-active={scene.step <= 2}>
        <div className={styles.breakpointLabel}><Gauge size={16} aria-hidden="true" /><span>输入条件</span></div>
        <h3>{width}px 可用宽度</h3>
        <div className={styles.breakpointLabGauge} style={style}><div className={styles.breakpointLabDot} data-failed={layout === "collision"} /></div>
        <div className={styles.breakpointLabTicks}><span>360</span><span>680 · 候选线</span><span>1024</span></div>
        <small>把同一组内容从宽到窄观察，记录它第一次变得难读或难操作的位置。</small>
      </div>
      <div className={styles.breakpointLabArrow} aria-hidden="true"><Gauge size={22} /></div>
      <div className={styles.breakpointLabPanel} data-active={scene.step >= 3}>
        <div className={styles.breakpointLabel}><Ruler size={16} aria-hidden="true" /><span>规则结果</span></div>
        <h3>{layout === "fluid" ? "保持流体" : layout === "collision" ? "内容开始冲突" : layout === "compact" ? "切换紧凑导航" : "切换单列操作"}</h3>
        <div className={styles.breakpointLabPreview}>
          <div><span>导航</span><strong>{layout === "fluid" ? "横向" : layout === "collision" ? "挤压" : "菜单"}</strong></div>
          <div><span>搜索</span><strong>{layout === "collision" ? "无位置" : layout === "stack" ? "下一行" : "保留"}</strong></div>
          <div><span>断点</span><strong>{switched ? "680px 前切换" : "尚未设置"}</strong></div>
        </div>
        <small>同一份 HTML，只有 CSS 规则在断点处改变；组件不会因为屏幕名字不同就复制两套内容。</small>
      </div>
    </div>
    <div className={styles.breakpointLabMetrics}><div><span>当前宽度</span><strong>{width}px</strong></div><div><span>内容状态</span><strong>{layout === "collision" ? "首次失效" : layout === "fluid" ? "还能流动" : "已恢复"}</strong></div><div><span>行动</span><strong>{switched ? "改变规则" : "继续观察"}</strong></div></div>
    <p className={styles.breakpointLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
