"use client";

import { ArrowCounterClockwise, CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./RenderingConcept.module.css";

type Pace = "normal" | "slow";

export function CsrLesson() {
  const [pace, setPace] = useState<Pace>("normal");
  const [step, setStep] = useState(0);
  const slow = pace === "slow";
  const stages = ["HTML 壳", "JS 解析", "API 数据", "内容 DOM"];
  return <div className={styles.lab} role="region" aria-label="客户端渲染请求链演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>拖慢 CPU，看首屏空白变长</strong></div><button type="button" onClick={() => { setPace("normal"); setStep(0); }} aria-label="重置客户端渲染演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choiceRow} role="group" aria-label="选择设备速度"><button type="button" aria-pressed={pace === "normal"} onClick={() => setPace("normal")}>正常 CPU</button><button type="button" aria-pressed={pace === "slow"} onClick={() => setPace("slow")}>CPU slowdown</button></div>
    <div className={styles.labBoard}>
      <div className={styles.ledger}>{stages.map((stage, index) => <div className={styles.ledgerRow} key={stage}><span>{stage}</span><code>{index <= step ? index === 0 ? "received" : index === 1 ? (slow ? "parsing 1800 ms" : "parsing 300 ms") : index === 2 ? "200 OK" : "content + handlers" : "waiting"}</code><small>{index <= step ? "已通过" : "尚未到达"}</small></div>)}</div>
      <div className={styles.readout} role="status">{step === 3 ? <><CheckCircle size={19} aria-hidden="true" /><strong>主要内容已出现</strong><p>{slow ? "内容出现得更晚，空白段被 CPU 解析时间拉长。" : "这只是浏览器端链条完成；服务器仍提供壳、脚本和接口。"}</p></> : <><WarningCircle size={19} aria-hidden="true" /><strong>还在等待第 {step + 1} 步</strong><p>点击推进观察下载、解析、取数和 DOM 更新的先后。</p></>}</div>
    </div>
    <button className={styles.actionButton} type="button" onClick={() => setStep(value => Math.min(3, value + 1))} disabled={step === 3}><Clock size={14} />推进一段</button>
  </div>;
}
