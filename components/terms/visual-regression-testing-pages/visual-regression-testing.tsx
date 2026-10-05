"use client";

import { ArrowsClockwise, Camera, CheckCircle, Code, Gear, GitBranch, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./VisualRegressionTestingConcept.module.css";

const labels = ["准备环境", "拍 baseline", "算 diff", "审查变化", "再跑矩阵"];

export function VisualRegressionTestingLesson() {
  const scene = useScene(labels.length);
  const isSetup = scene.step === 0;
  const isBaseline = scene.step === 1;
  const isDiff = scene.step === 2;
  const isReview = scene.step === 3;
  const isMatrix = scene.step === 4;
  const StatusIcon = isReview ? WarningCircle : isDiff ? ArrowsClockwise : isMatrix || isBaseline ? CheckCircle : Gear;
  const status = isSetup ? "先锁定视口、字体、数据和动画状态，减少“同一页面每次都不一样”。" : isBaseline ? "baseline 是被确认的参照；它要和提交、浏览器及渲染环境一起保存。" : isDiff ? "候选截图与参照对齐后才计算差异；阈值不能替代对差异原因的理解。" : isReview ? "未知差异先阻断，确认是有意变化且功能、可访问性一起通过后再更新参照。" : "把窄屏、DPR 和 reduced motion 纳入矩阵，才能发现桌面截图看不见的回归。";
  return <div ref={scene.ref} className={styles.visualRegressionTestingLab} role="region" aria-label="视觉回归测试 baseline、diff、审查和矩阵工作台">
    <div className={styles.visualRegressionTestingLabHeader}><span>一张截图怎样变成一次可审查的测试</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.visualRegressionTestingControls} role="group" aria-label="选择视觉回归测试阶段">
      <button type="button" className={styles.visualRegressionTestingControl} aria-pressed={isSetup} onClick={() => scene.seek(0)}>准备环境</button>
      <button type="button" className={styles.visualRegressionTestingControl} aria-pressed={isBaseline} onClick={() => scene.seek(1)}>拍 baseline</button>
      <button type="button" className={styles.visualRegressionTestingControl} aria-pressed={isDiff} onClick={() => scene.seek(2)}>算 diff</button>
      <button type="button" className={styles.visualRegressionTestingControl} aria-pressed={isMatrix} onClick={() => scene.seek(4)}>再跑矩阵</button>
    </div>
    <div className={styles.visualRegressionTestingLabGrid}>
      <div className={styles.visualRegressionTestingLabPanel} data-active={isSetup || isBaseline || isReview}>
        <div className={styles.visualRegressionTestingLabel}><Code size={16} aria-hidden="true" /><span>参照与候选</span></div>
        <h3>{isReview ? "按钮颜色变了" : isBaseline ? "baseline · a1b2c3" : "同一路径渲染"}</h3>
        <div className={styles.visualRegressionTestingLabRows}><div className={styles.visualRegressionTestingLabRow} data-active={isSetup}><code>viewport</code><strong>1280 × 800</strong></div><div className={styles.visualRegressionTestingLabRow} data-active={isBaseline || isDiff}><code>baseline</code><strong>{isBaseline || isDiff ? "saved" : "ready"}</strong></div><div className={styles.visualRegressionTestingLabRow} data-active={isReview}><code>intent</code><strong>{isReview ? "unknown" : "—"}</strong></div></div>
        <small>测试先建立同样的输入；不同字体、DPR、时间或随机数据会把环境噪声伪装成回归。</small>
      </div>
      <div className={styles.visualRegressionTestingLabArrow} aria-hidden="true"><ArrowsClockwise size={22} /></div>
      <div className={styles.visualRegressionTestingLabPanel} data-active={isDiff || isReview || isMatrix}>
        <div className={styles.visualRegressionTestingLabel}><Camera size={16} aria-hidden="true" /><span>差异与决定</span></div>
        <h3>{isDiff ? "18 pixels changed" : isReview ? "先修复，再更新" : isMatrix ? "mobile + motion off" : "等待比较"}</h3>
        <div className={styles.visualRegressionTestingLabRows}><div className={styles.visualRegressionTestingLabRow} data-active={isDiff}><code>pixel diff</code><strong>{isDiff ? "18" : "—"}</strong></div><div className={styles.visualRegressionTestingLabRow} data-active={isReview}><code>decision</code><strong>{isReview ? "block" : "—"}</strong></div><div className={styles.visualRegressionTestingLabRow} data-active={isMatrix}><code>matrix</code><strong>{isMatrix ? "pass" : "desktop"}</strong></div></div>
        <small>diff 是线索，不是结论；确认变化意图后才更新 baseline，未知差异要留在 review 阶段。</small>
      </div>
    </div>
    <div className={styles.visualRegressionTestingLabMetrics}><div><span>基线</span><strong>{isBaseline || isDiff ? "存在" : "准备"}</strong></div><div><span>差异</span><strong>{isDiff || isReview ? "18 px" : "未算"}</strong></div><div><span>门禁</span><strong>{isReview ? "阻断" : isMatrix ? "通过" : "观察"}</strong></div></div>
    <p className={styles.visualRegressionTestingLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
