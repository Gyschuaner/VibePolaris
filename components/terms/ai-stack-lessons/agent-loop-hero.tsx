"use client";

import { CheckCircle, ClipboardText, Eye, Flag, Gear, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../AiStackCoreConcepts.module.css";

const steps = [
  { label: "接住当前状态", title: "还有一项检查失败", detail: "GET /health → 500", Icon: ClipboardText },
  { label: "发出一个动作", title: "先跑一次检查", detail: "run_checks()", Icon: Gear },
  { label: "读回原始结果", title: "结果带着证据回来", detail: "missing API_BASE_URL", Icon: Eye },
  { label: "把结果写回", title: "状态变成待修复", detail: "issue = config", Icon: WarningCircle },
  { label: "检查停止条件", title: "修复后返回 200", detail: "done = true", Icon: CheckCircle },
];

export function AgentLoopHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  return <figure ref={scene.ref} className={styles.loopHero} data-step={scene.step} aria-label="一次健康检查怎样在智能体循环里从失败回到完成">
    <div className={styles.loopHeroHeader}><span>周五发布前 · 一条检查链</span><strong>完成条件：200 OK</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.loopHeroBoard}>
      <div className={styles.loopHeroTicket}>
        <span>当前任务</span>
        <strong>把服务修到可发布</strong>
        <code>state.issues = [&quot;API_BASE_URL&quot;]</code>
        <div className={styles.loopHeroTicketSeal} data-done={scene.step === steps.length - 1}>{scene.step === steps.length - 1 ? "已验收" : "进行中"}</div>
      </div>
      <div className={styles.loopHeroTrack}>
        <span className={styles.loopHeroTrackLine} aria-hidden="true" />
        {steps.map(({ title, detail, Icon }, index) => <div key={title} className={styles.loopHeroNode} data-active={scene.step === index} data-done={scene.step > index}>
          <Icon size={20} aria-hidden="true" />
          <strong>{title}</strong>
          <code>{detail}</code>
          {index === 0 && <Flag className={styles.loopHeroNodeFlag} size={14} aria-hidden="true" />}
        </div>)}
        <span className={styles.loopHeroPacket} data-running={scene.step > 0 && scene.step < steps.length - 1} aria-hidden="true" />
      </div>
    </div>
    <div className={styles.loopHeroResult} data-danger={scene.step === 2} role="status">
      <current.Icon size={19} aria-hidden="true" />
      <span><strong>{current.label}</strong>{scene.step === 0 ? "" : ` · ${current.detail}`}</span>
    </div>
    <figcaption>循环的证据在右侧：失败结果回到状态，下一步才知道该改什么；停止只在完成条件成立或达到明确上限时发生。</figcaption>
  </figure>;
}
