"use client";

import { ArrowRight, CheckCircle, Clock, Cloud, FileCode, Gear, Package, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RenderingConcept.module.css";

const frames = [
  { label: "内容改成 v2", tone: "edit", rows: [["源文件", "v2"], ["构建产物", "v1"], ["CDN 文件", "v1"]], result: "仍是 v1", note: "源文件已经变化，但静态产物还没有重新生成。" },
  { label: "刷新仍拿旧文件", tone: "stale", rows: [["源文件", "v2"], ["构建产物", "v1"], ["CDN 文件", "v1"]], result: "看到 v1", note: "访问静态页面只会拿现有文件，不会为这次请求临时渲染。" },
  { label: "重新构建", tone: "build", rows: [["源文件", "v2"], ["构建产物", "build-84"], ["CDN 文件", "v1"]], result: "产物更新", note: "构建阶段重新读取内容，生成带新版本的 HTML。" },
  { label: "发布到 CDN", tone: "publish", rows: [["源文件", "v2"], ["构建产物", "build-84"], ["CDN 文件", "等待切换"]], result: "准备发布", note: "新文件还要被部署到服务器或 CDN，访问端才会拿到它。" },
  { label: "下一次看到 v2", tone: "ready", rows: [["源文件", "v2"], ["构建产物", "build-84"], ["CDN 文件", "v2"]], result: "看到 v2", note: "发布完成后，下一次请求才返回新的静态页面。" },
];

export function SsgHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.tone === "stale" || current.tone === "edit" ? WarningCircle : current.tone === "publish" ? Clock : CheckCircle;
  return <figure ref={scene.ref} className={styles.hero} data-scene={current.tone} aria-label="静态生成从内容变更到发布的过程">
    <div className={styles.heroTop}><span>文件改了，网页何时跟上</span><strong>SSG · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.renderStage}><div className={styles.renderStageHeader}><span>构建与分发</span><span>source → CDN</span></div><div className={styles.renderRows}>{current.rows.map(([label, value], index) => { const Icon = label === "源文件" ? FileCode : label === "构建产物" ? Gear : Cloud; return <div className={styles.renderRow} data-active={index <= scene.step ? "true" : "false"} key={label}><Icon size={13} aria-hidden="true" /><span>{label}</span><small>{value}</small></div>; })}</div></div>
      <div className={styles.renderArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.heroResult}><ResultIcon size={17} aria-hidden="true" /><span>访问结果</span><strong>{current.result}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Package size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>SSG 把生成动作提前到构建阶段；访问时拿的是已经存在的文件，内容新鲜度取决于下一次构建和发布。</figcaption>
  </figure>;
}
