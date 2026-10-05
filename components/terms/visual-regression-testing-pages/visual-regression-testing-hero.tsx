"use client";

import { ArrowRight, ArrowsClockwise, Browser, Camera, CheckCircle, Code, GitBranch, Gear, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./VisualRegressionTestingConcept.module.css";

const frames = [
  { label: "锁定渲染环境", stage: "SETUP", view: "viewport 1280×800 · DPR 1", rows: [{ label: "font", value: "loaded", kind: "pass" }, { label: "motion", value: "paused", kind: "pass" }], result: "可重复的输入", note: "视觉比较先固定视口、设备像素比、字体、数据和动画状态；否则差异可能只是环境噪声。" },
  { label: "保存 baseline", stage: "BASELINE", view: "home.chromium.png", rows: [{ label: "baseline", value: "saved", kind: "pass" }, { label: "commit", value: "a1b2c3", kind: "wait" }], result: "参照画面", note: "baseline 是一次被确认的参照，不是“任何截图都能当标准”；它要跟代码和环境一起追踪。" },
  { label: "生成 candidate", stage: "CANDIDATE", view: "home.chromium.png · PR 42", rows: [{ label: "candidate", value: "captured", kind: "pass" }, { label: "selector", value: "page", kind: "wait" }], result: "待比较画面", note: "候选画面来自同一条可复现路径；测试做的是渲染结果比较，不是替代功能测试。" },
  { label: "计算 diff", stage: "DIFF", view: "18 pixels changed", rows: [{ label: "button", value: "changed", kind: "change" }, { label: "header", value: "same", kind: "pass" }], result: "差异遮罩", note: "像素差异需要结合阈值和区域解释；一处颜色变化和整块错位的风险不同。" },
  { label: "审查意图", stage: "REVIEW", view: "intentional? · fix?", rows: [{ label: "button color", value: "review", kind: "change" }, { label: "layout shift", value: "block", kind: "change" }], result: "修复或更新基线", note: "只有确认变化是有意设计且功能与可访问性一起通过，才应该更新 baseline；未知差异先阻断。" },
  { label: "窄屏与偏好再跑", stage: "MATRIX", view: "390px · reduced motion", rows: [{ label: "mobile", value: "pass", kind: "pass" }, { label: "motion off", value: "pass", kind: "pass" }], result: "覆盖真实边界", note: "一张桌面截图不代表响应式和减少动态效果都安全；关键矩阵要有自己的参照和判断。" },
] as const;

export function VisualRegressionTestingHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const StatusIcon = scene.step === 4 ? WarningCircle : scene.step === 3 ? ArrowsClockwise : scene.step === 1 || scene.step === 5 ? CheckCircle : Gear;
  const style = { "--vrt-progress": `${18 + scene.step * 15}%` } as CSSProperties;
  return <figure ref={scene.ref} className={styles.visualRegressionTestingHero} data-step={scene.step} aria-label="视觉回归测试从稳定环境到截图差异审查">
    <div className={styles.visualRegressionTestingHeader}><span>先让画面可重复，再判断差异是否有意</span><strong>{current.stage} · step {scene.step + 1}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.visualRegressionTestingBoard}>
      <div className={styles.visualRegressionTestingPanel} data-active={scene.step <= 2 || scene.step === 5}>
        <div className={styles.visualRegressionTestingLabel}><Browser size={17} aria-hidden="true" /><span>渲染输入</span></div>
        <h3>{current.label}</h3>
        <div className={styles.visualRegressionTestingScreen} data-diff={scene.step >= 3}><code>{current.view}</code></div>
      </div>
      <div className={styles.visualRegressionTestingArrow} aria-hidden="true"><ArrowRight size={21} /><span>截图 / 比较</span></div>
      <div className={styles.visualRegressionTestingPanel} data-active={scene.step >= 1}>
        <div className={styles.visualRegressionTestingLabel}><Camera size={17} aria-hidden="true" /><span>结果判断</span></div>
        <h3>{current.result}</h3>
        <div className={styles.visualRegressionTestingDiff} style={style}>{current.rows.map(row => <div className={styles.visualRegressionTestingDiffRow} data-kind={row.kind} key={row.label}><code>{row.label}</code><strong>{row.value}</strong></div>)}</div>
      </div>
    </div>
    <div className={styles.visualRegressionTestingNote} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.visualRegressionTestingMetrics}><div><span>当前阶段</span><strong>{current.stage}</strong></div><div><span>比较对象</span><strong>{scene.step >= 2 ? "candidate" : "环境"}</strong></div><div><span>处理结果</span><strong>{scene.step === 4 ? "待审查" : scene.step >= 3 ? "有 diff" : "准备"}</strong></div></div>
    <figcaption>视觉回归测试把“画面变了”变成可复现、可定位、可决定的差异，而不是让截图自己替团队做设计判断。</figcaption>
  </figure>;
}
