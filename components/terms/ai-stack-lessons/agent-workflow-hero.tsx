"use client";

import { Brain, CheckCircle, Circuitry, FileText, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./AgentWorkflowConcept.module.css";

const steps = [
  { label: "接收任务", title: "先把任务放进一张可追踪的单据", detail: "输入、状态和下一节点都要有名字。", Icon: FileText },
  { label: "经过闸门", title: "先做检查，再允许流程继续", detail: "不满足条件时，工作流停在边界，不偷偷写入结果。", Icon: LockSimple },
  { label: "执行节点", title: "节点里的智能体只负责这一段工作", detail: "它可以调用工具或交给专家，但外层状态仍然可见。", Icon: Brain },
  { label: "验收结束", title: "有明确出口，才叫完成", detail: "通过、拒绝、重试和人工接管是不同的终态。", Icon: CheckCircle },
];

const stages = ["请求", "校验", "专家", "验收"];

export function AgentWorkflowHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];

  return <figure ref={scene.ref} className={styles.agentWorkflowHero} data-step={scene.step} aria-label="智能体工作流如何用显式节点、闸门和终态推进任务">
    <div className={styles.agentWorkflowHeroHeader}><span>一张任务单怎样沿着工作流推进</span><strong>state → route → check → done</strong></div>
    <SceneControls scene={scene} labels={steps.map((step) => step.label)} />
    <div className={styles.agentWorkflowHeroBoard}>
      <div className={styles.agentWorkflowHeroRail} aria-label="固定的工作流节点">
        {stages.map((stage, index) => <div key={stage} className={styles.agentWorkflowHeroNode} data-active={scene.step === index} data-done={scene.step > index}>
          <span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong><small>{index === 0 ? "用户请求" : index === 1 ? "规则 / guardrail" : index === 2 ? "工具或专家" : "通过 / 停止"}</small>
        </div>)}
      </div>
      <div className={styles.agentWorkflowHeroFlow}>
        <div className={styles.agentWorkflowHeroFlowHeader}><Circuitry size={17} aria-hidden="true" /><span>工作流控制面</span><b>{scene.step < 2 ? "路由准备中" : scene.step === 2 ? "执行中" : "已验收"}</b></div>
        <div className={styles.agentWorkflowHeroTracks}>
          <div className={styles.agentWorkflowHeroTrack} data-active={scene.step === 1}><span className={styles.agentWorkflowHeroDot} /><div><strong>检查输入</strong><small>{scene.step >= 1 ? "金额、权限、字段" : "等待请求"}</small></div></div>
          <div className={styles.agentWorkflowHeroTrack} data-active={scene.step === 2}><span className={styles.agentWorkflowHeroDot} /><div><strong>交给专家节点</strong><small>{scene.step >= 2 ? "工具调用 / handoff" : "等待闸门"}</small></div></div>
          <div className={styles.agentWorkflowHeroTrack} data-active={scene.step === 3}><span className={styles.agentWorkflowHeroDot} /><div><strong>验收输出</strong><small>{scene.step === 3 ? "通过或保留未完成" : "尚未到达"}</small></div></div>
        </div>
        <div className={styles.agentWorkflowHeroBranch} data-danger={scene.step === 1}><WarningCircle size={16} aria-hidden="true" /><span>{scene.step === 1 ? "不通过 → 停在闸门，避免副作用" : "每个节点都有可记录的状态"}</span></div>
      </div>
    </div>
    <div className={styles.agentWorkflowHeroMetrics}>
      <div><span>当前节点</span><strong>{stages[scene.step]}</strong></div>
      <div><span>路由控制</span><strong>{scene.step >= 2 ? "节点内可委派" : "显式状态图"}</strong></div>
      <div><span>最终出口</span><strong>{scene.step === 3 ? "可验收" : "未到达"}</strong></div>
    </div>
    <div className={styles.agentWorkflowHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>工作流把节点、转移和终态写在控制面上；节点里的模型可以灵活，但“何时继续、何时停下、谁负责验收”不能只靠一段自然语言猜出来。</figcaption>
  </figure>;
}
