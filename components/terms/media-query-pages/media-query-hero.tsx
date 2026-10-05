"use client";

import { CheckCircle, Cursor, DeviceMobile, Gear, Monitor, SpeakerHigh, SpeakerSimpleSlash, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./MediaQueryConcept.module.css";

const frames = [
  { label: "先用基础规则接住页面", stage: "BASE", width: "860px", widthActive: false, hover: true, motion: false, columns: "3 列", tip: "可悬停提示", animation: "轻微位移", note: "先让普通 CSS 负责默认状态，媒体条件还没有改变页面。" },
  { label: "宽度条件变真", stage: "WIDTH", width: "560px", widthActive: true, hover: true, motion: false, columns: "1 列", tip: "可悬停提示", animation: "轻微位移", note: "同一份内容遇到窄空间，width 条件成立，只替换列数这条规则。" },
  { label: "悬停能力缺席", stage: "HOVER", width: "860px", widthActive: false, hover: false, motion: false, columns: "3 列", tip: "提示常驻", animation: "轻微位移", note: "hover 查询的是当前输入能力；没有鼠标时，不能把关键信息藏在悬停后。" },
  { label: "用户要求少动一点", stage: "MOTION", width: "860px", widthActive: false, hover: true, motion: true, columns: "3 列", tip: "可悬停提示", animation: "静止反馈", note: "prefers-reduced-motion 只收住动效，不会顺手把页面改成另一种布局。" },
  { label: "三个条件同时成立", stage: "COMBINE", width: "560px", widthActive: true, hover: false, motion: true, columns: "1 列", tip: "提示常驻", animation: "静止反馈", note: "width、hover 和 reduced-motion 各自判断；组合成立时，三条规则一起参与。" },
  { label: "条件变化，内容不换", stage: "RESET", width: "860px", widthActive: false, hover: false, motion: false, columns: "3 列", tip: "提示常驻", animation: "轻微位移", note: "媒体查询只是换一组 CSS 声明，DOM 和阅读顺序始终留在原地。" },
] as const;

export function MediaQueryHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.widthActive && current.motion ? CheckCircle : current.widthActive || !current.hover ? WarningCircle : Gear;
  const style = { "--column-progress": current.widthActive ? "34%" : "78%" } as CSSProperties;
  const inputRows = [
    { label: "视口宽度", value: current.width, active: current.widthActive, icon: <DeviceMobile size={15} aria-hidden="true" /> },
    { label: "hover 能力", value: current.hover ? "hover: hover" : "hover: none", active: !current.hover, icon: <Cursor size={15} aria-hidden="true" /> },
    { label: "动效偏好", value: current.motion ? "reduce" : "no-preference", active: current.motion, icon: current.motion ? <SpeakerSimpleSlash size={15} aria-hidden="true" /> : <SpeakerHigh size={15} aria-hidden="true" /> },
  ];
  return <figure ref={scene.ref} className={styles.mediaQueryHero} data-step={scene.step} aria-label="媒体查询怎样根据多个媒体特征改变 CSS 规则">
    <div className={styles.mediaQueryHeader}><span>条件会变，内容不用搬家</span><strong>{current.stage} · {current.width}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.mediaQueryBoard}>
      <div className={styles.mediaQueryPanel} data-active={current.widthActive || !current.hover || current.motion}>
        <div className={styles.mediaQueryLabel}><Monitor size={17} aria-hidden="true" /><span>媒体环境</span></div>
        <h3>浏览器正在测什么</h3>
        <div className={styles.mediaQueryInputs}>{inputRows.map(row => <div key={row.label} className={styles.mediaQueryInput} data-active={row.active}><span>{row.icon}</span><span>{row.label}</span><code>{row.value}</code></div>)}</div>
        <small>每个 media feature 都是一个输入；它们不是设备型号的别名，也不会自己生成布局。</small>
      </div>
      <div className={styles.mediaQueryArrow} aria-hidden="true"><Gear size={21} /><span>匹配</span></div>
      <div className={styles.mediaQueryPanel} data-active={current.widthActive || !current.hover || current.motion}>
        <div className={styles.mediaQueryLabel}><Gear size={17} aria-hidden="true" /><span>@media 规则</span></div>
        <h3>{current.columns} · {current.tip}</h3>
        <div className={styles.mediaQueryRules} style={style}>
          <div className={styles.mediaQueryRule} data-active={current.widthActive}><i /><code>(width &lt; 640px)</code><span>{current.columns}</span></div>
          <div className={styles.mediaQueryRule} data-active={!current.hover}><i /><code>(hover: none)</code><span>{current.tip}</span></div>
          <div className={styles.mediaQueryRule} data-active={current.motion}><i /><code>(prefers-reduced-motion: reduce)</code><span>{current.animation}</span></div>
        </div>
        <small>条件成立时只应用对应声明；基础规则仍在，未命中的条件不会把页面清空。</small>
      </div>
    </div>
    <div className={styles.mediaQueryNote} role="status"><ResultIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.mediaQueryMetrics}><div><span>width</span><strong>{current.widthActive ? "matched" : "base"}</strong></div><div><span>输入能力</span><strong>{current.hover ? "hover" : "none"}</strong></div><div><span>动效</span><strong>{current.motion ? "reduced" : "default"}</strong></div></div>
    <div className={styles.mediaQueryResult}><Monitor size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>媒体查询像一排独立的开关：它们只决定哪些 CSS 声明加入计算，真正的列、提示和动效仍由那些声明自己完成。</figcaption>
  </figure>;
}
