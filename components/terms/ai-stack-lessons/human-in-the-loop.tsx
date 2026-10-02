"use client";

import { useState } from "react";
import { ArrowRight, Check, CheckCircle, FileText, LockSimple, X } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function HumanInTheLoopLesson() {
  const scene = useScene(4);
  const [decision, setDecision] = useState<"pending" | "approve" | "modify" | "reject">("pending");
  useResetOnSceneStart(scene, () => setDecision("pending"));
  const approved = decision === "approve" || decision === "modify";
  const executed = scene.step === 3 && approved;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="人在回路演示">
    <Caption scene={scene} labels={["请求进入", "暂停等待", "人做决定", "执行结果"]} titles={["金额超过自动上限", "动作还没有发生", "决定能改变结果", "执行或保持未执行"]} copy={["退款申请为 1200 元，自动上限为 500 元。", "系统展示订单、金额和建议动作，暂停在执行前。", "批准、修改和拒绝都是不同的决定，不是点一下确认。", executed ? "人工决定被记录，批准路径才产生退款。" : approved ? "决定已记录，下一步才会执行退款。" : "拒绝或未决定不会产生退款。"]} />
    <div className={styles.choices} role="group" aria-label="选择人工决定">{(["approve", "modify", "reject"] as const).map((key) => <button key={key} type="button" aria-pressed={decision === key} onClick={() => { setDecision(key); scene.seek(2); }}>{key === "approve" ? "批准" : key === "modify" ? "改为 500" : "拒绝"}</button>)}</div>
    <div className={styles.contract}><div><FileText size={25} /><h3>预览</h3><p>退款 1200 元</p></div><ArrowRight size={20} /><div>{decision === "pending" ? <LockSimple size={25} /> : <Check size={25} />}<h3>审阅人</h3><p>{decision === "pending" ? "等待决定" : decision === "modify" ? "改为 500 元" : decision === "approve" ? "批准" : "拒绝"}</p></div><ArrowRight size={20} /><div>{executed ? <CheckCircle size={25} /> : <X size={25} />}<h3>退款</h3><p>{executed ? decision === "modify" ? "按 500 元执行" : "按 1200 元执行" : approved ? "等待执行" : "未执行"}</p></div></div>
  </div>;
}
