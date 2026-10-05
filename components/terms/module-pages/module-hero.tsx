"use client";

import { ArrowRight, CheckCircle, Clock, Code, GitBranch, Lightning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./ModuleConcept.module.css";

const frames = [
  { label: "画出依赖", title: "entry.js", detail: "import { format } from './format.js'", note: "静态 import 先把模块连接成一张依赖图。", tone: "graph" },
  { label: "各自求值", title: "format.js", detail: "export function format()", note: "依赖模块先完成初始化；同一个模块不会因为被多处导入而重复求值。", tone: "evaluate" },
  { label: "接上绑定", title: "settings.js", detail: "export let locale = 'zh'", note: "导入拿到的是导出绑定，模块内部更新后，读取者看到新的值。", tone: "live" },
  { label: "结果回来", title: "entry.js", detail: "format(locale) → '你好'", note: "模块边界把职责接起来，调用方不用复制内部变量。", tone: "result" },
  { label: "回路先停下", title: "a.js ↔ b.js", detail: "读取未初始化 binding", note: "循环依赖本身不是句号；在初始化完成前读取绑定，才会落入 TDZ。", tone: "cycle" },
];

export function ModuleHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.tone === "cycle" ? WarningCircle : current.tone === "graph" || current.tone === "evaluate" ? Clock : CheckCircle;
  return <figure ref={scene.ref} className={styles.hero} data-tone={current.tone} aria-label="JavaScript 模块从依赖图到 live binding 的工作过程">
    <div className={styles.heroTop}><span>模块文件，谁先运行、谁拿到什么</span><strong>MODULE · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.moduleGraph}><div className={styles.moduleNode}><Code size={15} aria-hidden="true" /><strong>{current.title}</strong><small>{current.detail}</small></div><ArrowRight className={styles.graphArrow} size={17} aria-hidden="true" /><div className={styles.moduleNode} data-active={current.tone !== "graph"}><GitBranch size={15} aria-hidden="true" /><strong>{current.tone === "live" ? "绑定" : current.tone === "evaluate" ? "初始化" : "依赖"}</strong><small>{current.tone === "live" ? "locale → 最新值" : current.tone === "cycle" ? "初始化未完成" : "只求值一次"}</small></div></div>
      <div className={styles.heroResult}><ResultIcon size={17} aria-hidden="true" /><span>当前结果</span><strong>{current.tone === "live" ? "live" : current.tone === "result" ? "可调用" : current.tone === "cycle" ? "TDZ" : "等待"}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Lightning size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>模块把文件边界、依赖顺序和导出绑定写成可分析的关系；import 不是把另一份源码粘贴进来。</figcaption>
  </figure>;
}
