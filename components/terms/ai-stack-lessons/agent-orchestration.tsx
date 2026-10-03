"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function AgentOrchestrationLesson() {
  const scene = useScene(4);
  const [parallel, setParallel] = useState(true);
  const [conflict, setConflict] = useState(false);
  const [hadConflict, setHadConflict] = useState(false);
  useResetOnSceneStart(scene, () => { setParallel(true); setConflict(false); setHadConflict(false); });
  const writing = scene.step >= 3 && !conflict;
  const mergedEvidence = hadConflict ? 7 : 8;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="智能体编排演示">
    <Caption scene={scene} labels={["拆分任务", "并行运行", "等待冲突", "合并结果"]} titles={["编排器先安排依赖", "无依赖的任务可以同时开始", "冲突证据暂停下游", "规则决定哪些结果能合并"]} copy={["报告拆为检索、核对和撰写。", parallel ? "检索与核对同时运行，撰写等待输入。" : "串行模式让核对等检索完成。", scene.step < 2 ? "等待核对结果。" : conflict ? "核对发现一处冲突，撰写不能假装拿到完整证据。" : hadConflict ? "冲突已清除，等待编排器合并。" : "核对结果一致，可以进入合并。", writing ? `合并 ${mergedEvidence} 条一致证据。` : conflict ? "仍有冲突，结果不能合并。" : scene.step >= 2 ? "结果状态已明确，准备合并。" : "合并前先确认所有结果状态。"]} />
    <div className={styles.choices}><button type="button" aria-pressed={parallel} onClick={() => { setParallel(true); setConflict(false); setHadConflict(false); scene.seek(1); }}>并行</button><button type="button" aria-pressed={!parallel} onClick={() => { setParallel(false); setConflict(false); setHadConflict(false); scene.seek(1); }}>串行</button><button type="button" aria-pressed={conflict} onClick={() => { if (!conflict) setHadConflict(true); setConflict((value) => !value); scene.seek(2); }}>{conflict ? "清除冲突" : "制造冲突"}</button></div>
    <div className={styles.contract}><div><h3>检索</h3><p>{scene.step === 0 ? "未开始" : scene.step === 1 ? parallel ? "并行运行" : "先完成" : "返回 8 条"}</p></div><ArrowRight size={20} /><div><h3>核对</h3><p>{scene.step === 0 ? "等待开始" : scene.step === 1 ? "核对中" : conflict ? "发现 1 处冲突" : "证据一致"}</p></div><ArrowRight size={20} /><div>{writing ? <CheckCircle size={25} /> : <Warning size={25} />}<h3>撰写</h3><p>{scene.step < 2 ? "等待核对" : conflict ? "等待合并" : writing ? `收到 ${mergedEvidence} 条证据` : "准备合并"}</p></div></div>
    <p className={styles.inputExample}><strong>编排的证据</strong>不是智能体数量，而是调度者记录依赖、等待、冲突和合并规则。</p>
  </div>;
}
