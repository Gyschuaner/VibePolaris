"use client";

import { ArrowCounterClockwise, CheckCircle, Cloud, FileCode, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./RenderingConcept.module.css";

type Stage = "edited" | "built" | "published";

export function SsgLesson() {
  const [stage, setStage] = useState<Stage>("edited");
  return <div className={styles.lab} role="region" aria-label="静态生成构建和发布演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>改源文件，再决定何时重新构建</strong></div><button type="button" onClick={() => setStage("edited")} aria-label="重置静态生成演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choiceRow} role="group" aria-label="推进静态生成流程"><button type="button" aria-pressed={stage === "edited"} onClick={() => setStage("edited")}>改内容</button><button type="button" aria-pressed={stage === "built"} onClick={() => setStage("built")}>重新构建</button><button type="button" aria-pressed={stage === "published"} onClick={() => setStage("published")}>发布 CDN</button></div>
    <div className={styles.labBoard}>
      <div className={styles.ledger}><div className={styles.ledgerRow}><span>文档源文件</span><code>article.md · v2</code><small>编辑已完成</small></div><div className={styles.ledgerRow}><span>静态 HTML</span><code>{stage === "edited" ? "v1" : "v2 · build-84"}</code><small>{stage === "edited" ? "尚未重建" : "构建产物"}</small></div><div className={styles.ledgerRow}><span>访问结果</span><code>{stage === "published" ? "页面 v2" : "页面 v1"}</code><strong>{stage === "published" ? "updated" : "stale"}</strong></div></div>
      <div className={styles.readout} role="status">{stage === "published" ? <><CheckCircle size={19} aria-hidden="true" /><strong>下一次请求看到 v2</strong><p>构建产物已发布到 CDN；访问时直接返回这份文件。</p></> : stage === "built" ? <><WarningCircle size={19} aria-hidden="true" /><strong>还差发布</strong><p>构建已经生成 v2，但 CDN 仍在提供旧文件。</p></> : <><FileCode size={19} aria-hidden="true" /><strong>源文件和网页分开</strong><p>源文件改成 v2 不会让已经发布的 HTML 自动变化。</p></>}</div>
    </div>
    <button className={styles.actionButton} type="button" onClick={() => setStage(value => value === "edited" ? "built" : "published")} disabled={stage === "published"}><Cloud size={14} />推进构建与发布</button>
  </div>;
}
