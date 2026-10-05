"use client";

import { ArrowRight, CheckCircle, Gauge, Ruler, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./BreakpointConcept.module.css";

const frames = [
  { label: "先让内容舒展开", stage: "COMFORT", width: 1024, layout: "full", note: "导航、搜索和操作项都有自己的呼吸空间；现在没有理由先猜一个设备型号。" },
  { label: "间距开始变紧", stage: "PRESSURE", width: 840, layout: "full", note: "内容还没坏，但间距正在变成设计问题；继续缩窄，直到真正需要改变规则。" },
  { label: "找到第一次失效", stage: "FAILURE", width: 640, layout: "collision", note: "搜索框和导航开始互相挤压，这个内容失效点比“平板宽度”更值得记录。" },
  { label: "在失效前切换", stage: "SWITCH", width: 680, layout: "compact", note: "把断点放在 680px 左右，让布局先切换成紧凑导航，再进入难以阅读的状态。" },
  { label: "窄屏保住操作", stage: "COMPACT", width: 520, layout: "compact", note: "断点改变的是规则：导航收进菜单，内容顺序仍然是同一份 HTML。" },
  { label: "小屏只留必要动作", stage: "SMALL", width: 360, layout: "stack", note: "再窄时只保留最重要的操作；如果只是流体尺寸就能解决，就不必继续增加断点。" },
] as const;

function percent(width: number) {
  return `${Math.max(0, Math.min(100, ((width - 360) / (1024 - 360)) * 100))}%`;
}

export function BreakpointHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.layout === "collision" ? WarningCircle : current.layout === "stack" ? CheckCircle : Ruler;
  const style = { "--width-position": percent(current.width), "--failure-position": percent(680) } as CSSProperties;

  return <figure ref={scene.ref} className={styles.breakpointHero} data-step={scene.step} aria-label="断点如何从内容第一次失效的位置找到">
    <div className={styles.breakpointHeader}><span>不要猜设备，观察内容什么时候先坏</span><strong>{current.stage} · {current.width}px</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.breakpointBoard}>
      <div className={styles.breakpointPanel} data-active={scene.step <= 2}>
        <div className={styles.breakpointLabel}><Gauge size={17} aria-hidden="true" /><span>内容压力尺</span></div>
        <h3>{current.width}px 可用宽度</h3>
        <div className={styles.breakpointGauge} style={style}>
          <div className={styles.breakpointGaugeLine} />
          <div className={styles.breakpointGaugeMarker} data-failed={current.layout === "collision"} />
          <div className={styles.breakpointGaugeLabels}><span>360</span><span>680 · 失效线</span><span>1024</span></div>
        </div>
        <div className={styles.breakpointGaugeReadout}><span>{current.layout === "collision" ? "内容状态" : current.layout === "compact" || current.layout === "stack" ? "规则状态" : "观察状态"}</span><strong>{current.layout === "collision" ? "挤在一起" : current.layout === "compact" || current.layout === "stack" ? "已切换" : "还能呼吸"}</strong><code>{current.layout === "collision" ? "content-fails" : current.width === 680 ? "switch-here" : current.layout === "full" ? "keep-fluid" : "rule-active"}</code></div>
        <small>黑色刻度是建议的切换点，不是某个品牌设备的固定宽度。真正的证据来自内容是否仍能读、点和操作。</small>
      </div>
      <div className={styles.breakpointArrow} aria-hidden="true"><ArrowRight size={20} /><span>规则</span></div>
      <div className={styles.breakpointPanel} data-active={scene.step >= 3}>
        <div className={styles.breakpointLabel}><Ruler size={17} aria-hidden="true" /><span>布局回应</span></div>
        <h3>{current.layout === "full" ? "保持流体布局" : current.layout === "collision" ? "还没有回应" : current.layout === "compact" ? "@media · 紧凑导航" : "@media · 单列操作"}</h3>
        <div className={styles.breakpointPreview} data-failed={current.layout === "collision"} data-switched={current.layout === "compact" || current.layout === "stack"}>
          <div className={styles.breakpointPreviewTop}><span>一个真实组件</span><strong>{current.layout === "full" ? "fluid" : current.layout === "collision" ? "overlap" : current.layout === "compact" ? "compact" : "stack"}</strong></div>
          <div className={styles.breakpointPreviewNav}><span /><span /><span /><span /><span /></div>
        </div>
        <small>{current.layout === "collision" ? "搜索框没有自己的位置，继续缩窄只会把问题藏到更小的屏幕里。" : current.layout === "full" ? "先保持内容流动，让布局自己吸收宽度变化。" : "断点只切换布局规则，不复制一份“移动端页面”，也不改变 HTML 阅读顺序。"}</small>
      </div>
    </div>
    <div className={styles.breakpointNote} role="status"><ResultIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.breakpointMetrics}><div><span>当前宽度</span><strong>{current.width}px</strong></div><div><span>内容证据</span><strong>{current.layout === "collision" ? "首次失效" : current.layout === "compact" || current.layout === "stack" ? "规则已切换" : "尚可阅读"}</strong></div><div><span>断点思路</span><strong>{current.width === 680 ? "content-first" : current.width < 680 ? "响应已发生" : "继续观察"}</strong></div></div>
    <div className={styles.breakpointResult}><Gauge size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>断点是一条由内容压力画出来的线：先把界面缩到它第一次难读、难点按或难操作的位置，再在那之前切换规则。</figcaption>
  </figure>;
}
