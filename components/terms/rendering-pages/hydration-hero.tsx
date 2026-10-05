"use client";

import { ArrowRight, CheckCircle, Code, Lightning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RenderingConcept.module.css";

const frames = [
  { label: "HTML 先可见", tone: "html", rows: [["服务器 HTML", "按钮已经画出"], ["DOM 节点", "等待匹配"], ["事件处理", "未连接"]], result: "可见", note: "页面先有形状，点击还没有进入客户端代码。" },
  { label: "客户端匹配", tone: "match", rows: [["服务器 HTML", "首屏快照"], ["DOM 节点", "结构一致"], ["事件处理", "等待连接"]], result: "对上", note: "框架把组件输出和现有 DOM 对上，通常复用这些节点。" },
  { label: "事件接通", tone: "ready", rows: [["服务器 HTML", "已复用"], ["DOM 节点", "已关联"], ["事件处理", "connected"]], result: "可交互", note: "客户端代码接上事件后，按钮才真正能响应。" },
  { label: "首屏不一致", tone: "mismatch", rows: [["服务器 HTML", "时间 09:00"], ["DOM 节点", "客户端 09:01"], ["事件处理", "暂停检查"]], result: "mismatch", note: "首轮输出不同，水合会报告不一致；可见不等于安全接管。" },
  { label: "输入稳定", tone: "stable", rows: [["服务器 HTML", "稳定数据"], ["DOM 节点", "结构一致"], ["事件处理", "connected"]], result: "可交互", note: "把首轮数据变成可重复的输入，再连接事件，水合路径才稳定。" },
];

export function HydrationHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const StatusIcon = current.tone === "mismatch" ? WarningCircle : CheckCircle;
  return <figure ref={scene.ref} className={styles.hero} data-scene={current.tone} aria-label="水合把服务器 HTML 接成可交互页面">
    <div className={styles.heroTop}><span>页面先出现，事件后来</span><strong>HYDRATION · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.renderStage}><div className={styles.renderStageHeader}><span>首屏接管</span><span>server → client</span></div><div className={styles.renderRows}>{current.rows.map(([label, value], index) => <div className={styles.renderRow} data-active={index <= scene.step % 3 ? "true" : "false"} key={label}><Code size={13} aria-hidden="true" /><span>{label}</span><small>{value}</small></div>)}</div></div>
      <div className={styles.renderArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.heroResult}><StatusIcon size={17} aria-hidden="true" /><span>当前状态</span><strong>{current.result}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Lightning size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>水合是把现有 HTML 和客户端组件接上关系；它不是“页面出现了”这一刻，也不是无条件重画一遍。</figcaption>
  </figure>;
}
