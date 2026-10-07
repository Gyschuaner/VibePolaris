"use client";

import { CheckCircle, FileText, Gauge } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function AgentLoopSignatureHero() {
  const scene = useScene(4);
  const labels = ["记下当前状态", "钉入外部证据", "改写任务账本", "达到停止条件"];
  const done = scene.step === 3;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="智能体循环用任务账本和停止刻度记录结果，不用无限旋转的箭头" caption={done ? "停止条件被证据满足，账本封存；没有新的外部结果，就不应该凭空再转一圈。" : scene.step === 2 ? "工具结果写回账本后，下一步决策有了依据；循环的关键是结果，而不是重复调用。" : "把状态、证据和下一步放在同一张账本上，读者能看见循环何时获得新信息。"}>
    <div className={styles.loopBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="TASK LEDGER / STOP GAUGE" title="查清支付失败原因" status={done ? "SEALED" : "OPEN"} />
      <div className={styles.loopDesk}>
        <div className={styles.ledgerCard}><div className={styles.ledgerTitle}><FileText size={18} /><span>任务账本</span><code>run_07</code></div><div className={styles.ledgerRow}><span>当前状态</span><b>{scene.step === 0 ? "待查" : scene.step < 3 ? "已获证据" : "可结束"}</b></div><div className={styles.ledgerRow}><span>下一步</span><b>{scene.step < 2 ? "查询支付日志" : scene.step === 2 ? "重试一次" : "停止"}</b></div><div className={styles.ledgerStamp} data-visible={scene.step >= 2}><CheckCircle size={15} />结果已写回</div></div>
        <div className={styles.evidenceCard} data-visible={scene.step >= 1}><span>外部证据</span><strong>{scene.step >= 1 ? "payment.log" : "等待工具结果"}</strong><code>{scene.step >= 1 ? "gateway_timeout · 14:02:08" : "—"}</code><small>{scene.step >= 2 ? "与当前问题相符" : "读取后才可判断"}</small></div>
        <div className={styles.stopGauge} data-done={done}><Gauge size={24} /><span>停止刻度</span><strong>{done ? "3 / 3" : `${scene.step} / 3`}</strong><div className={styles.gaugeBar}><i style={{ width: `${Math.min(scene.step, 3) * 33.333}%` }} /></div><small>{done ? "已满足：原因明确且重试上限未超" : "没有新证据就不增加一轮"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
