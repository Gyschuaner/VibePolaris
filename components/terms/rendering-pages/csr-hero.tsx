"use client";

import { ArrowRight, Browser, CheckCircle, Clock, Code, Database, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RenderingConcept.module.css";

const frames = [
  { label: "先收到空壳", tone: "shell", rows: [["HTML 壳", "<div id=app>"], ["JavaScript", "等待下载"], ["数据接口", "未请求"]], result: "空白区", note: "服务器先返回容器和脚本链接，主要内容还没有生成。" },
  { label: "下载并执行", tone: "bundle", rows: [["HTML 壳", "已到达"], ["JavaScript", "parse → run"], ["数据接口", "等待请求"]], result: "执行中", note: "浏览器要先下载、解析并执行应用代码。" },
  { label: "脚本再取数", tone: "api", rows: [["HTML 壳", "已到达"], ["JavaScript", "运行中"], ["数据接口", "pending"]], result: "等数据", note: "主要内容要等脚本发出接口请求并拿到结果。" },
  { label: "内容填入 DOM", tone: "dom", rows: [["HTML 壳", "容器"], ["JavaScript", "已执行"], ["数据接口", "200 OK"]], result: "可见", note: "数据回到浏览器后，应用才把内容写进页面。" },
  { label: "内容可交互", tone: "ready", rows: [["HTML 壳", "首屏"], ["JavaScript", "handlers"], ["数据接口", "ready"]], result: "可操作", note: "CSR 的首屏可见和可交互都落在浏览器这条请求链之后。" },
];

export function CsrHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.tone === "ready" || current.tone === "dom" ? CheckCircle : current.tone === "api" ? WarningCircle : Clock;
  return <figure ref={scene.ref} className={styles.hero} data-scene={current.tone} aria-label="客户端渲染的首屏请求链">
    <div className={styles.heroTop}><span>页面内容要等浏览器走完一条链</span><strong>CSR · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.renderStage}><div className={styles.renderStageHeader}><span>浏览器瀑布</span><span>shell → app</span></div><div className={styles.renderRows}>{current.rows.map(([label, value], index) => { const Icon = label === "HTML 壳" ? Browser : label === "JavaScript" ? Code : Database; return <div className={styles.renderRow} data-active={index <= scene.step ? "true" : "false"} key={label}><Icon size={13} aria-hidden="true" /><span>{label}</span><small>{value}</small></div>; })}</div></div>
      <div className={styles.renderArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.heroResult}><ResultIcon size={17} aria-hidden="true" /><span>首屏结果</span><strong>{current.result}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Clock size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>CSR 不是没有服务器，而是把主要渲染工作推到浏览器；要看完整体验，得把下载、执行、取数和 DOM 更新排在一起。</figcaption>
  </figure>;
}
