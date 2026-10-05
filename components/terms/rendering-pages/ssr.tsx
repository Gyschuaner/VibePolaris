"use client";

import { ArrowCounterClockwise, CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./RenderingConcept.module.css";

type Delay = "normal" | "slow";

export function SsrLesson() {
  const [delay, setDelay] = useState<Delay>("normal");
  const [streaming, setStreaming] = useState(false);
  const [step, setStep] = useState(0);
  const slow = delay === "slow";
  return <div className={styles.lab} role="region" aria-label="服务端渲染数据延迟演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>增加数据延迟，再打开流式边界</strong></div><button type="button" onClick={() => { setDelay("normal"); setStreaming(false); setStep(0); }} aria-label="重置服务端渲染演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choiceRow} role="group" aria-label="选择服务端条件"><button type="button" aria-pressed={delay === "normal"} onClick={() => setDelay("normal")}>正常数据</button><button type="button" aria-pressed={delay === "slow"} onClick={() => setDelay("slow")}>慢数据 1200ms</button><button type="button" aria-pressed={streaming} onClick={() => setStreaming(value => !value)}>打开流式边界</button></div>
    <div className={styles.labBoard}>
      <div className={styles.ledger}><div className={styles.ledgerRow}><span>服务端数据</span><code>{slow ? "pending · 1200 ms" : "ready · 180 ms"}</code><small>页面依赖</small></div><div className={styles.ledgerRow}><span>HTML 流</span><code>{streaming && slow ? "shell → slow content" : step >= 1 ? "完整 HTML" : "等待 render"}</code><small>{streaming && slow ? "外壳先出" : "整段等待"}</small></div><div className={styles.ledgerRow}><span>客户端接管</span><code>{step >= 2 ? "hydrate → interactive" : "等脚本"}</code><strong>{step >= 2 ? "ready" : "pending"}</strong></div></div>
      <div className={styles.readout} role="status">{streaming && slow ? <><CheckCircle size={19} aria-hidden="true" /><strong>外壳先到，内容后补</strong><p>流式边界把可用部分先发出，但慢数据仍决定那一段何时完成。</p></> : slow ? <><WarningCircle size={19} aria-hidden="true" /><strong>首字节被慢数据拖住</strong><p>SSR 仍要在服务器取数；它不会把慢依赖凭空消掉。</p></> : <><Clock size={19} aria-hidden="true" /><strong>推进服务端时间线</strong><p>先让服务器生成 HTML，再让客户端完成水合，两个阶段有不同完成点。</p></>}</div>
    </div>
    <button className={styles.actionButton} type="button" onClick={() => setStep(value => Math.min(2, value + 1))} disabled={step === 2}><CheckCircle size={14} />推进一次</button>
  </div>;
}
