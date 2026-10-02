"use client";

import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ModerationLesson() {
  const scene = useScene(3);
  const [threshold, setThreshold] = useState(0.8);
  useResetOnSceneStart(scene, () => setThreshold(0.8));
  const scores = [0.03, 0.61, 0.94];
  const bucket = (score: number) => score >= threshold ? "隐藏" : score >= threshold - 0.3 ? "复核" : "展示";
  const routed = scene.step >= 1;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="内容审核演示">
    <Caption scene={scene} labels={["取得风险分", "按阈值分流", "改变阈值"]} titles={["分数只是分类信号", "产品规则决定去向", "阈值变化会改变队列"]} copy={["三条评论得到 0.03、0.61、0.94 的教学分数。", "当前阈值按展示、复核和隐藏三条路径分流。", "拖动阈值只改变产品处置，不把分数变成法律结论。"]} />
    <label className={styles.inputExample}>隐藏阈值 {threshold.toFixed(2)}<input type="range" min="0.6" max="0.9" step="0.1" value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); scene.seek(2); }} /></label>
    <div className={styles.contract}>{scores.map((score, index) => <div key={score}><h3>评论 {String.fromCharCode(65 + index)}</h3><p>{score.toFixed(2)}</p><strong>{routed ? bucket(score) : "等待分流"}</strong></div>)}</div>
    <p className={styles.inputExample}><strong>审核边界</strong>模型给出分类信号，应用负责阈值、展示、复核和隐藏；分数不替代人工判断或法律结论。</p>
  </div>;
}
