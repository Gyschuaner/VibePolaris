"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, Hand, User, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ModelOutputConcepts.module.css";

const steps = ["客服接收", "整理交接包", "转移回复权", "接手或退回"];

export function HandoffLesson() {
  const scene = useScene(steps.length);
  const [complete, setComplete] = useState(true);
  const received = scene.step >= 1;
  const handed = scene.step >= 2;
  const returned = scene.step === 3 && !complete;
  return <div ref={scene.ref} className={`${styles.lab} ${styles.handoffLab}`} role="region" aria-label="智能体交接演示">
    <SceneControls scene={scene} labels={steps}/>
    <div className={styles.handoffDesk}><div className={styles.handoffContext}><div className={styles.handoffContextTop}><User size={19}/><strong>客服当前记录</strong></div><span>订单 A102</span><span>申请退款</span><small>闲聊留在原处</small></div><div className={styles.handoffPackage} data-filled={received} data-returned={returned}><div className={styles.handoffPackageFlap}><FileText size={20}/><strong>交接包</strong></div><div className={styles.handoffFacts}>{complete ? <><code>A102</code><code>退款 · 待确认</code><code>下一步 · 核对金额</code></> : <><code>退款 · 待确认</code><code>订单号缺失</code></>}</div><ArrowRight size={21} className={styles.handoffPackageArrow}/></div><div className={styles.handoffReceiver} data-active={handed && !returned}><Hand size={20}/><strong>退款智能体</strong><small>{returned ? "退回补充" : handed ? "当前回复者" : "等待接手"}</small></div></div>
    <div className={styles.handoffActions}><button type="button" aria-pressed={complete} onClick={() => { setComplete((value) => !value); scene.seek(1); }}>{complete ? "移除订单号" : "补回订单号"}</button><span>{returned ? <><WarningCircle size={16}/> 退回客服补齐事实</> : handed ? <><CheckCircle size={16}/> 回复权已移动，退款还未执行</> : "交接包还没离开客服"}</span></div>
    <p className={styles.handoffStatus} role="status">{returned ? "接手者没有足够事实，退回并不等于退款失败后重试。" : complete && handed ? "接手者拿到目标、事实和下一步，可以从确认金额继续。" : "缺少关键事实时，不能用‘已转交’冒充‘已完成’。"}</p>
  </div>;
}
