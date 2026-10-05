"use client";

import { ArrowRight, Browser, CheckCircle, Database, FloppyDisk, Globe, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RenderingConcept.module.css";

const frames = [
  { label: "按 origin 分盒", tone: "origin", rows: [["标签页 A", "shop.example"], ["localStorage", "同一 origin"], ["标签页 B", "shop.example"]], result: "共享盒", note: "同源文档访问同一份 localStorage 区域。" },
  { label: "A 写入 theme", tone: "write", rows: [["标签页 A", "setItem theme"], ["localStorage", "theme=dark"], ["标签页 B", "收到变化"]], result: "同步", note: "A 的修改会让另一个同源文档收到 storage 事件。" },
  { label: "换到另一来源", tone: "isolate", rows: [["标签页 A", "shop.example"], ["localStorage", "盒子 1"], ["另一来源", "news.example"]], result: "隔离", note: "origin 变了，读取到的是另一份盒子，不会自动互通。" },
  { label: "值先变字符串", tone: "string", rows: [["写入对象", "[object Object]"], ["localStorage", "只存 string"], ["读取", "JSON.parse"]], result: "需序列化", note: "对象要先 JSON.stringify，读回来再解析成结构。" },
  { label: "下次仍能恢复", tone: "ready", rows: [["标签页 A", "重新打开"], ["localStorage", "theme=dark"], ["页面", "恢复主题"]], result: "保留", note: "数据跨会话保留，但它仍受 origin、容量和浏览器策略约束。" },
];

export function LocalStorageHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.tone === "isolate" || current.tone === "string" ? WarningCircle : CheckCircle;
  return <figure ref={scene.ref} className={styles.hero} data-scene={current.tone} aria-label="localStorage 按 origin 保存字符串并通知同源页面">
    <div className={styles.heroTop}><span>两个标签页，哪一个能看到变化</span><strong>LOCAL STORAGE · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.renderStage}><div className={styles.renderStageHeader}><span>origin storage</span><span>sync · string</span></div><div className={styles.renderRows}>{current.rows.map(([label, value], index) => { const Icon = label.includes("标签页") || label === "页面" || label === "另一来源" ? (label === "另一来源" ? Globe : Browser) : label === "写入对象" || label === "读取" ? FloppyDisk : Database; return <div className={styles.renderRow} data-active={index <= scene.step ? "true" : "false"} key={label}><Icon size={13} aria-hidden="true" /><span>{label}</span><small>{value}</small></div>; })}</div></div>
      <div className={styles.renderArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.heroResult}><ResultIcon size={17} aria-hidden="true" /><span>当前结果</span><strong>{current.result}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Database size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>localStorage 是按 origin 隔离的同步字符串盒；它能记住偏好，却不是数据库、消息总线或安全保险箱。</figcaption>
  </figure>;
}
