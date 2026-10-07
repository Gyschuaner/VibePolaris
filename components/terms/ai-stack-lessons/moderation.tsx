"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Eye, Funnel, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

type Queue = "展示" | "复核" | "隐藏";
const steps = ["取得分数", "分到队列", "改变阈值"];
const scores = [0.03, 0.61, 0.94];

function route(score: number, threshold: number): Queue {
  if (score >= threshold) return "隐藏";
  if (score >= threshold - 0.15) return "复核";
  return "展示";
}

export function ModerationLesson() {
  const scene = useScene(steps.length);
  const [threshold, setThreshold] = useState(0.8);
  const routed = scene.step >= 1;
  const changed = scene.step === 2;
  const queue = (score: number) => routed ? route(score, threshold) : "等待";
  const counts = (["展示", "复核", "隐藏"] as Queue[]).map((name) => scores.filter((score) => queue(score) === name).length);

  return <div className={`${styles.lab} ${styles.moderationLab}`} ref={scene.ref} role="region" aria-label="内容审核演示">
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.moderationWorkbench}>
      <div className={styles.moderationInput}><div className={styles.moderationPanelHead}><Funnel size={20} aria-hidden="true" /><strong>评论传送带</strong><span>{routed ? "已分流" : "待打分"}</span></div><div className={styles.moderationSlips}>{scores.map((score, index) => <div key={score} className={styles.moderationSlipBody} data-queue={queue(score)}><span>{String.fromCharCode(65 + index)}</span><strong>{score.toFixed(2)}</strong><small>{queue(score)}</small></div>)}</div><p>模型只给风险信号；这一步还没有作法律判断。</p></div>
      <div className={styles.moderationPolicy}><div className={styles.moderationThreshold}><small>隐藏阈值</small><strong>{threshold.toFixed(2)}</strong><span>{changed ? "重新计算去向" : "产品策略"}</span></div><ArrowRight size={23} aria-hidden="true" /><div className={styles.moderationPolicyLine}><span>分数</span><span>阈值</span><span>队列</span></div></div>
      <div className={styles.moderationBins}>{(["展示", "复核", "隐藏"] as Queue[]).map((name, index) => <div key={name} className={styles.moderationBin} data-kind={name}><div><strong>{name}</strong><span>{counts[index]}</span></div><small>{name === "展示" ? "继续显示" : name === "复核" ? "交人工判断" : "暂不展示"}</small><div className={styles.moderationBinDots}>{scores.map((score) => queue(score) === name ? <i key={score}>{score.toFixed(2)}</i> : null)}</div></div>)}</div>
    </div>
    <div className={styles.moderationChoices} role="group" aria-label="选择产品阈值"><button type="button" aria-pressed={threshold === 0.8} onClick={() => { setThreshold(0.8); scene.seek(2); }}>阈值 0.80</button><button type="button" aria-pressed={threshold === 0.7} onClick={() => { setThreshold(0.7); scene.seek(2); }}>阈值 0.70</button></div>
    <div className={styles.moderationStatus} role="status">{changed ? <><Funnel size={17} aria-hidden="true" /><strong>阈值 0.70 重新分流</strong><span>0.61 从展示进入复核，分数本身没有改变。</span></> : routed ? <><CheckCircle size={17} aria-hidden="true" /><strong>队列已生成</strong><span>展示、复核和隐藏是产品动作，不是模型的法律结论。</span></> : <><Warning size={17} aria-hidden="true" /><strong>先取得信号</strong><span>三条评论正在等待分类分数。</span></>}</div>
  </div>;
}
