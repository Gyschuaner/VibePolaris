"use client";

import { useState } from "react";
import { ArrowRight, Check, CheckCircle, FileText, LockSimple, SealCheck, X } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

type Decision = "pending" | "approve" | "modify" | "reject";
const steps = ["请求进入", "暂停等待", "人做决定", "执行结果"];

export function HumanInTheLoopLesson() {
  const scene = useScene(steps.length);
  const [decision, setDecision] = useState<Decision>("pending");
  const decided = scene.step >= 2 && decision !== "pending";
  const approved = decided && (decision === "approve" || decision === "modify");
  const executed = scene.step === 3 && approved;
  const amount = decision === "modify" ? "¥500" : "¥1,200";
  return <div ref={scene.ref} className={`${styles.lab} ${styles.approvalLab}`} role="region" aria-label="人在回路演示">
    <SceneControls scene={scene} labels={steps}/>
    <div className={styles.approvalWorkbench}><div className={styles.approvalRequest}><div className={styles.approvalRequestHead}><FileText size={21}/><strong>待审阅退款单</strong><span>{scene.step < 1 ? "未进入" : executed ? "已执行" : "暂停"}</span></div><div className={styles.approvalAmount}><small>申请金额</small><strong>{amount}</strong></div><dl><div><dt>自动上限</dt><dd>¥500</dd></div><div><dt>影响</dt><dd>退款副作用</dd></div><div><dt>来源</dt><dd>订单 A102</dd></div></dl></div><div className={styles.approvalDecision}><h3>审阅者决定</h3><div className={styles.approvalChoices}>{(["approve", "modify", "reject"] as const).map((key) => <button key={key} type="button" aria-pressed={decision === key} onClick={() => { setDecision(key); scene.seek(2); }}>{key === "approve" ? "批准 ¥1,200" : key === "modify" ? "改为 ¥500" : "拒绝"}</button>)}</div><div className={styles.approvalStamp} data-state={decision}>{decision === "pending" ? <><LockSimple size={22}/><strong>暂停</strong><small>动作尚未发生</small></> : decision === "reject" ? <><X size={22}/><strong>拒绝</strong><small>不产生退款</small></> : <><SealCheck size={22}/><strong>{decision === "modify" ? "改额" : "批准"}</strong><small>记录后可执行</small></>}</div>{approved && !executed && <button className={styles.approvalExecute} type="button" onClick={() => scene.seek(3)}>执行已批准退款<ArrowRight size={18}/></button>}</div></div>
    <div className={styles.approvalAudit} role="status">{executed ? <><CheckCircle size={17}/> 决定与待处理项一一对应，按 {amount} 执行</> : decision === "reject" && scene.step >= 2 ? <><X size={17}/> 拒绝被记录，退款执行次数为 0</> : approved ? <><Check size={17}/> 决定已记录，执行仍需要单独一步</> : "先看见金额、上限和影响，再决定是否盖章"}</div>
  </div>;
}
