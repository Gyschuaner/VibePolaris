"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, LockSimple, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

const steps = ["保留基线", "更新参数", "看验证曲线"];
const metrics = [
  { train: 0.84, validation: 0.71 },
  { train: 0.58, validation: 0.78 },
  { train: 0.39, validation: 0.83 },
  { train: 0.30, validation: 0.80 },
] as const;

export function FineTuningLesson() {
  const scene = useScene(steps.length);
  const [epoch, setEpoch] = useState(1);
  const current = metrics[epoch - 1];
  const evaluating = scene.step === 2;
  const best = evaluating && epoch === 3;
  const overfit = evaluating && epoch === 4;

  return <div className={`${styles.lab} ${styles.tuningLab}`} ref={scene.ref} role="region" aria-label="微调训练与验证演示">
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.tuningWorkbench}>
      <div className={styles.tuningBoard}><div className={styles.tuningPanelHead}><span>CHECKPOINT WALL</span><strong>{overfit ? "STOP" : best ? "KEEP · E03" : "TRAINING"}</strong></div><div className={styles.tuningEpochs}>{metrics.map((metric, index) => { const number = index + 1; const selected = epoch === number; const isBest = evaluating && number === 3; const isOverfit = evaluating && number === 4; return <button key={number} type="button" className={styles.tuningEpoch} data-selected={selected} data-best={isBest} data-overfit={isOverfit} onClick={() => { setEpoch(number); scene.seek(2); }}><span>E0{number}</span><strong>{(metric.validation * 100).toFixed(0)}%</strong><small>train {metric.train.toFixed(2)}</small>{isBest ? <CheckCircle size={16} aria-label="最佳检查点" /> : isOverfit ? <Warning size={16} aria-label="过拟合信号" /> : null}</button>; })}</div><div className={styles.tuningBoardFoot}><span>训练集：200 条工单</span><span>验证集：50 条未见样本</span></div></div>
      <div className={styles.tuningReadout}><div><small>训练损失 ↓</small><strong>{scene.step === 0 ? "—" : current.train.toFixed(2)}</strong></div><ArrowRight size={20} aria-hidden="true" /><div><small>验证准确率</small><strong>{scene.step === 0 ? "71%" : `${(current.validation * 100).toFixed(0)}%`}</strong></div><div className={styles.tuningReadoutState}>{scene.step === 0 ? <LockSimple size={21} aria-hidden="true" /> : overfit ? <Warning size={21} aria-hidden="true" /> : <CheckCircle size={21} aria-hidden="true" />}<span>{scene.step === 0 ? "先留基线" : overfit ? "停止追加训练" : best ? "保存 E03" : "继续比较"}</span></div></div>
    </div>
    <div className={styles.tuningEpochChoices} role="group" aria-label="选择训练轮数">{metrics.map((_, index) => <button key={index + 1} type="button" aria-pressed={epoch === index + 1} onClick={() => { setEpoch(index + 1); scene.seek(2); }}>第 {index + 1} 轮</button>)}</div>
    <div className={styles.tuningStatus} role="status">{overfit ? <><Warning size={17} aria-hidden="true" /><strong>验证回落</strong><span>训练损失还在下降，但泛化已经变差，应保留 E03。</span></> : best ? <><CheckCircle size={17} aria-hidden="true" /><strong>当前最佳检查点 E03</strong><span>这是验证集上的最好结果，仍需独立测试确认。</span></> : evaluating ? <><ArrowRight size={17} aria-hidden="true" /><strong>验证集读数</strong><span>训练数字和未见数据要放在一起看。</span></> : <><LockSimple size={17} aria-hidden="true" /><strong>先建立基线</strong><span>验证集没有参与参数更新，不能拿训练损失代替它。</span></>}</div>
  </div>;
}
