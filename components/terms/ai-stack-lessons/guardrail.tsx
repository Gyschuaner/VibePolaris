"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, LockSimple, MagnifyingGlass, ShieldCheck, Warning, X } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ModelOutputConcepts.module.css";

type GuardrailMode = "mask" | "block";
const steps = ["送入闸口", "扫字段", "套规则", "放行或阻断"];
const records = ["13800139021", "13911223344", "13699887766"];

export function GuardrailLesson() {
  const scene = useScene(steps.length);
  const [mode, setMode] = useState<GuardrailMode>("mask");
  useResetOnSceneStart(scene, () => setMode("mask"));
  const scanned = scene.step >= 1;
  const policyReady = scene.step >= 2;
  const handled = scene.step === 3;
  const output = mode === "mask" ? "138****9021" : "出口关闭";

  return <div className={`${styles.lab} ${styles.guardrailLab}`} ref={scene.ref} role="region" aria-label="护栏演示">
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.guardrailWorkbench}>
      <div className={styles.guardrailSource}>
        <div className={styles.guardrailPanelHead}><FileText size={20} aria-hidden="true" /><strong>客户表 · 12 条记录</strong><span>{scene.step === 0 ? "待检查" : "原始数据"}</span></div>
        <div className={styles.guardrailRows}>{records.map((record, index) => <div key={record} className={styles.guardrailRow} data-hit={scanned}><span>0{index + 1}</span><code>{record}</code><small>{scanned ? "手机号 · 命中" : "手机号字段"}</small></div>)}</div>
      </div>
      <div className={styles.guardrailGate} data-open={handled && mode === "mask"} data-closed={handled && mode === "block"}>
        <div className={styles.guardrailBeam} data-active={scanned}><MagnifyingGlass size={20} aria-hidden="true" /><strong>{scanned ? "PII 规则命中" : "扫描闸门"}</strong><small>{scanned ? "12 个手机号字段" : "等待卡片进入"}</small></div>
        <ArrowRight size={22} aria-hidden="true" />
        <div className={styles.guardrailRule}><ShieldCheck size={18} aria-hidden="true" /><span>{policyReady ? (mode === "mask" ? "改写后四位" : "禁止交付") : "选择处置"}</span></div>
      </div>
      <div className={styles.guardrailOutput} data-blocked={handled && mode === "block"} data-ready={handled && mode === "mask"}>
        {handled && mode === "block" ? <X size={23} aria-hidden="true" /> : handled && mode === "mask" ? <CheckCircle size={23} aria-hidden="true" /> : <LockSimple size={23} aria-hidden="true" />}
        <strong>{handled ? output : "规则出口"}</strong>
        <small>{handled ? (mode === "mask" ? "脱敏后放行" : "完整号码未交付") : "等待处置结果"}</small>
      </div>
    </div>
    <div className={styles.guardrailChoices} role="group" aria-label="选择护栏处置">
      <button type="button" aria-pressed={mode === "mask"} onClick={() => { setMode("mask"); scene.seek(2); }}><ShieldCheck size={16} aria-hidden="true" />脱敏放行</button>
      <button type="button" aria-pressed={mode === "block"} onClick={() => { setMode("block"); scene.seek(2); }}><X size={16} aria-hidden="true" />命中即阻断</button>
    </div>
    <div className={styles.guardrailStatus} role="status">
      {handled && mode === "mask" ? <><CheckCircle size={17} aria-hidden="true" /><strong>12 条记录可以交付</strong><span>只改写这次输出，访问权限仍由另一层校验。</span></> : handled && mode === "block" ? <><Warning size={17} aria-hidden="true" /><strong>导出停止</strong><span>护栏给出阻断结果，没有把敏感字段送出。</span></> : policyReady ? <><ShieldCheck size={17} aria-hidden="true" /><strong>处置已选</strong><span>再推进一步，才会产生放行或阻断结果。</span></> : <><MagnifyingGlass size={17} aria-hidden="true" /><strong>规则边界</strong><span>检查器只回答这一处输出是否符合规则。</span></>}
    </div>
  </div>;
}
