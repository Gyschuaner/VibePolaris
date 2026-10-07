"use client";

import { CheckCircle, FileText, Gauge } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function AgentLoopSignatureHero() {
  const scene = useScene(7);
  const labels = ["失败票钉上桌", "拉开检修抽屉", "回执滑回来", "贴回状态卡", "写入配置", "重新健康检查", "打开停止闸门"];
  const done = scene.step === labels.length - 1;
  const ledgerState = scene.step === 0 ? "500 · 未解释" : scene.step < 4 ? "已有证据" : scene.step < 6 ? "配置已修" : "可结束";
  const nextAction = scene.step === 0 ? "inspect_config()" : scene.step === 1 ? "读取 config.env" : scene.step === 2 ? "记录 issue=config" : scene.step === 3 ? "set API_BASE_URL" : scene.step === 4 ? "GET /health" : scene.step === 5 ? "等待新回执" : "停止";
  const evidenceTitle = scene.step === 0 ? "等待工具回执" : scene.step === 1 ? "config.env" : "payment.log";
  const evidenceCode = scene.step === 0 ? "—" : scene.step === 1 ? "API_BASE_URL = (missing)" : scene.step < 4 ? "gateway_timeout · 14:02:08" : scene.step === 4 ? "API_BASE_URL = https://api.example" : scene.step === 5 ? "GET /health · checking" : "200 OK · verified";
  const evidenceNote = scene.step < 2 ? "先读取配置，不能凭 500 猜原因" : scene.step < 4 ? "回执把问题指向配置" : scene.step === 4 ? "修复写回账本，但还未证明健康" : scene.step === 5 ? "只有新回执才能打开停止闸门" : "完成条件满足，循环封存";
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="智能体循环用任务账本和停止刻度记录失败、证据、修复与停止条件" caption={done ? "新的 200 OK 回执满足停止条件，账本封存；如果只有旧的 500，就不能假装任务已经完成。" : scene.step >= 4 ? "配置写回只是中间状态；循环要再拿一份新的外部回执，才能决定继续还是停止。" : "每一轮都留下状态、证据和下一步，循环不是把同一个请求无限重放。"}>
    <div className={styles.loopBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="TASK LEDGER / STOP GAUGE" title="查清支付失败原因" status={done ? "SEALED" : "OPEN"} />
      <div className={styles.loopDesk}>
        <div className={styles.ledgerCard}><div className={styles.ledgerTitle}><FileText size={18} /><span>任务账本</span><code>run_07</code></div><div className={styles.ledgerRow}><span>当前状态</span><b>{ledgerState}</b></div><div className={styles.ledgerRow}><span>下一步</span><b>{nextAction}</b></div><div className={styles.ledgerStamp} data-visible={scene.step >= 2}><CheckCircle size={15} />{scene.step >= 6 ? "200 OK 已写回" : scene.step >= 4 ? "修复已写回" : "证据已写回"}</div></div>
        <div className={styles.evidenceCard} data-visible={scene.step >= 1}><span>外部证据</span><strong>{evidenceTitle}</strong><code>{evidenceCode}</code><small>{evidenceNote}</small></div>
        <div className={styles.stopGauge} data-done={done}><Gauge size={24} /><span>停止刻度</span><strong>{done ? "6 / 6" : `${scene.step} / 6`}</strong><div className={styles.gaugeBar}><i style={{ width: `${Math.min(scene.step, 6) * 16.666}%` }} /></div><small>{done ? "已满足：新回执 200 OK 且没有超出上限" : "没有新证据就不增加一轮"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
