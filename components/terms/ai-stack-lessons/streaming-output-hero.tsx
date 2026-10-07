"use client";

import { Check, FileText, Stop } from "@phosphor-icons/react";
import { useEffect } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

const steps = ["收到第一片", "纸带继续吐出", "文字已结束", "完成章或断口"];
const fragments = ["订单 A102", "已发货", "预计明天送达。"];

export function StreamingReceiptHero() {
  const scene = useScene(steps.length);
  const terminal = scene.step === 3;
  useEffect(() => { scene.toggle(); }, []);
  return <div ref={scene.ref} className={styles.receiptHero} data-step={scene.step} role="img" aria-label="配送收据逐段打印，响应完成后才盖章，中断时留下断口">
    <div className={styles.receiptTop}><span>RESPONSE RECEIPT</span><strong>{terminal ? "TERMINAL" : "OPEN"}</strong></div>
    <SceneControls scene={scene} labels={steps} compact />
    <div className={styles.receiptRoll}>
      <FileText size={19} aria-hidden="true" />
      <div className={styles.receiptPaper}>
        <span className={styles.receiptRule}>配送通知 · A102</span>
        {fragments.map((fragment, index) => <span key={fragment} className={styles.receiptFragment} data-visible={scene.step > index}>{fragment}</span>)}
        <span className={styles.receiptCursor} data-visible={scene.step > 0 && scene.step < 2} aria-hidden="true" />
        <span className={styles.receiptTear} data-visible={terminal} aria-hidden="true" />
        <span className={styles.receiptStamp} data-visible={terminal}>{scene.step === 3 ? <><Check size={14} /> 完成章</> : <><Stop size={14} /> 未完成</>}</span>
      </div>
    </div>
    <p className={styles.receiptNote}>{scene.step === 0 ? "第一片纸带到了，整张收据还没有结束。" : scene.step === 1 ? "新字继续落在同一张收据上。" : scene.step === 2 ? "文字停了，仍在等整次响应的结束事件。" : "终态留下明确证据：完成章，或断流的纸边。"}</p>
  </div>;
}
