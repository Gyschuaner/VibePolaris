"use client";

import { useState } from "react";
import { ArrowRight, Brain, CheckCircle, Circuitry, FileText, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./AgentWorkflowConcept.module.css";

const labels = ["接单", "分诊", "执行", "验收"];
type RouteMode = "code" | "model";
type CheckMode = "pass" | "blocked";

export function AgentWorkflowLesson() {
  const scene = useScene(labels.length);
  const [routeMode, setRouteMode] = useState<RouteMode>("code");
  const [checkMode, setCheckMode] = useState<CheckMode>("pass");
  const blocked = checkMode === "blocked";
  const final = scene.step === labels.length - 1;
  const routeText = routeMode === "code" ? "金额 > 1000 → 人工复核" : "分诊模型选择：账单专家";
  const setRoute = (next: RouteMode) => { setRouteMode(next); scene.seek(1); };
  const setCheck = (next: CheckMode) => { setCheckMode(next); scene.seek(3); };

  return <div ref={scene.ref} className={styles.agentWorkflowLab} role="region" aria-label="智能体工作流路由与校验工作台">
    <div className={styles.agentWorkflowLabHeader}><span>只换一个控制条件，节点图仍然要有出口</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.agentWorkflowLabControls} role="group" aria-label="改变工作流控制方式">
      <button type="button" className={styles.agentWorkflowLabButton} aria-pressed={routeMode === "code"} onClick={() => setRoute("code")}>按规则路由</button>
      <button type="button" className={styles.agentWorkflowLabButton} aria-pressed={routeMode === "model"} onClick={() => setRoute("model")}>让模型选专家</button>
      <button type="button" className={styles.agentWorkflowLabButton} aria-pressed={checkMode === "pass"} onClick={() => setCheck("pass")}>校验通过</button>
      <button type="button" className={styles.agentWorkflowLabButton} aria-pressed={blocked} onClick={() => setCheck("blocked")}>校验失败</button>
    </div>
    <div className={styles.agentWorkflowLabGrid}>
      <div className={styles.agentWorkflowLabPanel} data-active={scene.step === 0}>
        <div className={styles.agentWorkflowLabLabel}><FileText size={16} aria-hidden="true" /><span>请求状态</span></div>
        <h3>退款申请 A17</h3>
        <p>金额 ¥1,280 · 订单已登录</p>
        <div className={styles.agentWorkflowLabState}><span>{scene.step === 0 ? "received" : "validated"}</span><small>{scene.step === 0 ? "等待分诊" : "字段已记录"}</small></div>
      </div>
      <div className={styles.agentWorkflowLabPanel + " " + styles.agentWorkflowLabRoute} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.agentWorkflowLabLabel}><Circuitry size={16} aria-hidden="true" /><span>路由节点</span></div>
        <h3>{routeMode === "code" ? "代码决定下一步" : "模型提出下一步"}</h3>
        <div className={styles.agentWorkflowLabRouteCard}><strong>{routeText}</strong><small>{routeMode === "code" ? "同一输入走同一条规则" : "模型可以灵活选择，但仍受工作流闸门约束"}</small></div>
        <div className={styles.agentWorkflowLabRoutePath}><span>triage</span><ArrowRight size={14} aria-hidden="true" /><span>{scene.step >= 2 ? "billing" : "等待"}</span></div>
      </div>
      <div className={styles.agentWorkflowLabPanel + " " + styles.agentWorkflowLabReview} data-active={scene.step === 3}>
        <div className={styles.agentWorkflowLabLabel}><LockSimple size={16} aria-hidden="true" /><span>输出闸门</span></div>
        <h3>{blocked ? "拒绝写入" : final ? "可以交付" : "等待验收"}</h3>
        <div className={styles.agentWorkflowLabReviewBox} data-danger={blocked && final}><span>退款结论</span><strong>{blocked ? "缺少人工凭证" : final ? "已核验" : "未检查"}</strong></div>
        <small>{blocked ? "校验失败时停在边界，不能把模型草稿当成最终结果。" : "只有通过检查，状态才会进入 done。"}</small>
      </div>
    </div>
    <div className={styles.agentWorkflowLabMetrics}>
      <div><span>当前状态</span><strong>{blocked && final ? "blocked" : final ? "done" : labels[scene.step]}</strong></div>
      <div><span>路由拥有者</span><strong>{routeMode === "code" ? "代码" : "模型"}</strong></div>
      <div><span>副作用</span><strong>{blocked && final ? "未执行" : final ? "允许" : "等待"}</strong></div>
    </div>
    <p className={styles.agentWorkflowLabNote} data-danger={blocked} role="status">
      {blocked ? <><WarningCircle size={17} aria-hidden="true" /><span>工作流允许模型提出草稿，却不允许未通过校验的结论写入系统。停在 blocked 是一个可追踪结果，不是“模型失败后悄悄重试”。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>{routeMode === "code" ? "代码路由让转移可预期；" : "模型路由提供灵活性；"} 两种方式都要把验收条件和终态记录下来。</span></> : <><Brain size={17} aria-hidden="true" /><span>工作流规定节点和出口，节点里的智能体才有空间做局部判断；外层状态不会因为换了路由方式就消失。</span></>}
    </p>
  </div>;
}
