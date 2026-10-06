"use client";

import { Archive, ArrowCounterClockwise, CheckCircle, Database, Gauge, Package, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["发现故障", "选稳定制品", "切回流量", "保留副作用"];
const captions = [
  "v42 的错误率升到 8.7%；先确认影响范围和当前运行版本。",
  "从部署历史挑出已知可用的 v41，不在事故现场重新构建旧源码。",
  "流量指针切到现成的 v41，健康检查和核心流程转绿后才算恢复。",
  "v42 留作调查；数据库写入、消息和外部调用已经发生，另行补偿。",
];

export function RollbackHero() {
  const scene = useScene(labels.length);
  const [rolledBack, setRolledBack] = useState(false);
  const step = scene.step;
  const liveV41 = rolledBack || step >= 2;
  const healthy = rolledBack || step >= 2;
  return <MechanismFrame scene={scene} title="流量转盘怎样切回已知可用制品" labels={labels} caption={captions[step]}>
    <div className={styles.rollbackScene}>
      <div className={styles.rollbackTraffic}>
        <div className={styles.rollbackHead}><Gauge size={15} />TRAFFIC POINTER</div>
        <div className={styles.rollbackPointer}><div className={styles.rollbackVersion} data-live={!liveV41}><Package size={15} /><strong>v42</strong><small>{liveV41 ? "保留调查" : "error rate 8.7%"}</small></div><div className={styles.rollbackVersion} data-live={liveV41}><Package size={15} /><strong>v41</strong><small>{liveV41 ? "existing artifact · live" : "stable · retained"}</small></div></div>
        <div className={styles.rollbackMeter} data-healthy={healthy}><span>核心流程健康</span><i /><small>{healthy ? "200 · green" : "500 · red"}</small></div>
      </div>
      <div className={styles.rollbackEvidence}><div className={styles.rollbackHead}><Archive size={15} />EVIDENCE TABLE</div><div className={styles.rollbackTicket}><WarningCircle size={15} /><span>v42 · 错误版本仍保留</span></div><div className={styles.rollbackTicket}><Database size={15} /><span>数据写入 / 外部调用不会倒流</span></div><button type="button" onClick={() => { setRolledBack(true); scene.seek(2); }}><ArrowCounterClockwise size={14} />切回 v41</button></div>
      <div className={styles.rollbackProof} role="status">{healthy ? <CheckCircle size={16} /> : <WarningCircle size={16} />}<strong>{healthy ? "流量回到稳定制品" : "先确认回滚目标"}</strong><span>{step === 3 ? "服务恢复，副作用进入补偿清单" : "回滚切换运行版本，不改写 Git 历史"}</span></div>
    </div>
  </MechanismFrame>;
}
