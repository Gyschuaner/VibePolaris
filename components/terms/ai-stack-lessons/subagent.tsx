"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function SubagentLesson() {
  const scene = useScene(4);
  const [valid, setValid] = useState(true);
  useResetOnSceneStart(scene, () => setValid(true));
  const returned = scene.step >= 2;
  const accepted = returned && scene.step >= 3 && valid;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="子智能体演示">
    <Caption scene={scene} labels={["主任务", "分出支线", "支线返回", "主线验收"]} titles={["主智能体保留最终报告", "只分派一个可验收的小任务", "结果带状态回到主线", "主智能体决定是否采用"]} copy={["报告要比较 3 个方案，价格核对可以独立进行。", "子智能体只拿到 3 个指定 URL 和价格字段。", valid ? "返回 2 个有效价格、1 个缺失标记。" : "返回了没有来源的价格，不能直接合并。", accepted ? "主智能体合并有效结果并保留缺口。" : valid ? "主智能体还要验收结果，缺口不能被抹掉。" : "主智能体拒绝无证据结果，报告保留待核实。"]} />
    <button type="button" className={styles.next} onClick={() => { setValid((value) => !value); scene.seek(2); }} aria-pressed={!valid}>{valid ? "返回无来源价格" : "返回带来源结果"}</button>
    <div className={styles.contract}><div><h3>主报告</h3><p>保留最终回复权</p></div><ArrowRight size={20} /><div><h3>价格支线</h3><p>{scene.step < 1 ? "未分派" : scene.step < 2 ? "核对中" : valid ? "2 有效 · 1 缺失" : "3 个无来源"}</p></div><ArrowRight size={20} /><div>{accepted ? <CheckCircle size={25} /> : <Warning size={25} />}<h3>合并</h3><p>{!returned ? "等待支线" : scene.step < 3 ? "等待主线验收" : valid ? "保留缺口后写入" : "拒绝并标记待核实"}</p></div></div>
  </div>;
}
