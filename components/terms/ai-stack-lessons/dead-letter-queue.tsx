"use client";

import { useState } from "react";
import { Archive, ArrowsClockwise, CheckCircle, FileText, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./DeadLetterQueueConcept.module.css";

const labels = ["尝试投递", "记录失败", "进入死信", "调查出口"];
type MessageKind = "valid" | "poison";
type Resolution = "inspect" | "repair";

export function DeadLetterQueueLesson() {
  const scene = useScene(labels.length);
  const [message, setMessage] = useState<MessageKind>("poison");
  const [resolution, setResolution] = useState<Resolution>("inspect");
  const poison = message === "poison";
  const repaired = resolution === "repair";
  const final = scene.step === labels.length - 1;
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const status = final ? (poison ? repaired ? "fixed → redrive" : "quarantined" : "acked") : scene.step >= 2 && poison ? "in DLQ" : "processing";
  const reason = poison ? "malformed payload · attempt 3" : "handler accepted · ack";

  return <div ref={scene.ref} className={styles.deadLetterLab} role="region" aria-label="死信队列重试、隔离与重放工作台">
    <div className={styles.deadLetterLabHeader}><span>换一条消息，再决定谁能离开死信队列</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.deadLetterLabControls} role="group" aria-label="改变死信处理条件">
      <button type="button" className={styles.deadLetterLabButton} aria-pressed={poison} onClick={() => reset(() => setMessage("poison"))}>坏消息</button>
      <button type="button" className={styles.deadLetterLabButton} aria-pressed={!poison} onClick={() => reset(() => setMessage("valid"))}>正常消息</button>
      <button type="button" className={styles.deadLetterLabButton} aria-pressed={!repaired} onClick={() => reset(() => setResolution("inspect"))}>只调查</button>
      <button type="button" className={styles.deadLetterLabButton} aria-pressed={repaired} onClick={() => reset(() => setResolution("repair"))}>修复后重放</button>
    </div>
    <div className={styles.deadLetterLabGrid}>
      <div className={styles.deadLetterLabPanel} data-active={scene.step === 0}>
        <div className={styles.deadLetterLabLabel}><FileText size={16} aria-hidden="true" /><span>消息本体</span></div>
        <h3>{poison ? "bad-json" : "order-184"}</h3>
        <div className={styles.deadLetterLabPayload} data-danger={poison}><span>{poison ? "{ amount: ? }" : "{ amount: 1280 }"}</span><small>{poison ? "缺少 currency" : "字段完整"}</small></div>
        <small>{poison ? "同一个输入会反复触发同一个错误。" : "消费者可以确认并移除它。"}</small>
      </div>
      <div className={styles.deadLetterLabPanel + " " + styles.deadLetterLabRetry} data-active={scene.step === 1} data-danger={poison && scene.step >= 1}>
        <div className={styles.deadLetterLabLabel}><ArrowsClockwise size={16} aria-hidden="true" /><span>重试策略</span></div>
        <h3>{poison ? "3 次后停止" : "第 1 次成功"}</h3>
        <div className={styles.deadLetterLabRetryRail}><i data-done={scene.step >= 0} /><i data-done={scene.step >= 1 && poison} /><i data-done={scene.step >= 2 && poison} /></div>
        <small>{poison ? "maxReceiveCount = 3；失败原因跟着消息走。" : "成功确认后，不需要进入 DLQ。"}</small>
      </div>
      <div className={styles.deadLetterLabPanel + " " + styles.deadLetterLabDlq} data-active={scene.step >= 2 && poison} data-danger={poison && final && !repaired}>
        <div className={styles.deadLetterLabLabel}><Archive size={16} aria-hidden="true" /><span>隔离区</span></div>
        <h3>{poison ? (final && repaired ? "准备重放" : "DLQ 保留") : "没有死信"}</h3>
        <div className={styles.deadLetterLabReason}><span>{reason}</span><strong>{poison ? (final && repaired ? "fixed" : "inspect") : "ack"}</strong></div>
        <small>{poison ? "保留消息、原因、次数和时间；不会自动清理。" : "正常确认不会经过这条支路。"}</small>
      </div>
    </div>
    <div className={styles.deadLetterLabMetrics}>
      <div><span>当前状态</span><strong>{status}</strong></div>
      <div><span>失败证据</span><strong>{poison ? "已记录" : "无"}</strong></div>
      <div><span>主队列影响</span><strong>{poison ? "已隔离" : "已前进"}</strong></div>
    </div>
    <p className={styles.deadLetterLabNote} data-danger={poison && final && !repaired} role="status">
      {poison && final && !repaired ? <><WarningCircle size={17} aria-hidden="true" /><span>只调查不会让消息自动成功。先修复 payload、确认权限和幂等，再决定是否 redrive；死信区不是垃圾桶，也不是答案。</span></> : poison && final && repaired ? <><CheckCircle size={17} aria-hidden="true" /><span>修复后重放只是再次进入主流程，仍要重新处理和确认；如果根因没修好，消息还会回到这里。</span></> : !poison && final ? <><CheckCircle size={17} aria-hidden="true" /><span>正常消息在消费者确认后离开主队列，不需要被“为了保险”送进死信区。</span></> : <><MagnifyingGlass size={17} aria-hidden="true" /><span>先记录消息本体、投递次数和失败理由，再把“重试、隔离、重放”分成三个动作。</span></>}
    </p>
  </div>;
}
