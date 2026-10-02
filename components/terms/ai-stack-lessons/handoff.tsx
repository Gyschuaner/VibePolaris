"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function HandoffLesson() {
  const scene = useScene(4);
  const [complete, setComplete] = useState(true);
  useResetOnSceneStart(scene, () => setComplete(true));
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="智能体交接演示">
    <Caption scene={scene} labels={["客服接收", "整理交接包", "转移回复权", "接手或退回"]} titles={["当前回复权在客服", "只保留继续任务需要的事实", "接手者成为当前回复者", "缺信息时不能假装完成"]} copy={["订单 A102 的退款请求进入客服智能体。", complete ? "交接包含订单号、申请类型和已确认金额。" : "交接包缺少订单号，接手者无法定位订单。", "回复权和必要状态一起交给退款智能体。", complete ? "从确认金额步骤继续；客服不再重复回答。" : "退回客服补齐订单号，退款尚未发生。"]} />
    <button type="button" className={styles.next} onClick={() => { setComplete((value) => !value); scene.seek(1); }} aria-pressed={complete}>{complete ? "移除订单号" : "补回订单号"}</button>
    <div className={styles.contract}><div><FileText size={25} /><h3>交接包</h3><p>{complete ? "A102 · 申请退款" : "申请退款 · 缺订单号"}</p></div><ArrowRight size={20} /><div><h3>退款智能体</h3><p>{scene.step < 2 ? "等待接手" : complete ? "从确认金额继续" : "退回补充"}</p></div><ArrowRight size={20} /><div>{complete && scene.step === 3 ? <CheckCircle size={25} /> : <Warning size={25} />}<h3>回复权</h3><p>{complete && scene.step >= 2 ? "已转移" : "仍在客服"}</p></div></div>
  </div>;
}
