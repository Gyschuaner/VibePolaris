"use client";

import { ArrowCounterClockwise, CheckCircle, GitBranch, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./RenderingConcept.module.css";

type Path = "known" | "private" | "unknown";

export function RoutingLesson() {
  const [path, setPath] = useState<Path>("known");
  const result = path === "known" ? { title: "商品 42 · 库存", detail: "匹配 /products/:id，读取 id=42 和 tab=stock。", ok: true } : path === "private" ? { title: "先登录", detail: "保存 returnTo=/products/42?tab=stock，登录后再回来。", ok: false } : { title: "404", detail: "没有规则匹配 /unknown/42，提供返回入口。", ok: false };
  return <div className={styles.lab} data-alert={path !== "known"} role="region" aria-label="路由匹配和访问分支演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>修改地址，看匹配、鉴权和回退</strong></div><button type="button" onClick={() => setPath("known")} aria-label="重置路由演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choiceRow} role="group" aria-label="选择访问路径"><button type="button" aria-pressed={path === "known"} onClick={() => setPath("known")}>已登录商品</button><button type="button" aria-pressed={path === "private"} onClick={() => setPath("private")}>未登录商品</button><button type="button" aria-pressed={path === "unknown"} onClick={() => setPath("unknown")}>未知路径</button></div>
    <div className={styles.labBoard}>
      <div className={styles.ledger}><div className={styles.ledgerRow}><span>地址栏</span><code>{path === "unknown" ? "/unknown/42" : "/products/42?tab=stock"}</code><small>用户输入</small></div><div className={styles.ledgerRow}><span>路由规则</span><code>{path === "unknown" ? "no match" : "/products/:id"}</code><small>{path === "unknown" ? "没有命中" : "已匹配"}</small></div><div className={styles.ledgerRow}><span>最终结果</span><code>{result.title}</code><strong>{result.ok ? "open" : "branch"}</strong></div></div>
      <div className={styles.readout} role="status">{result.ok ? <><CheckCircle size={19} aria-hidden="true" /><strong>{result.title}</strong><p>{result.detail}</p></> : path === "private" ? <><ShieldCheck size={19} aria-hidden="true" /><strong>{result.title}</strong><p>{result.detail}</p></> : <><WarningCircle size={19} aria-hidden="true" /><strong>{result.title}</strong><p>{result.detail}</p></>}</div>
    </div>
    <button className={styles.actionButton} type="button" onClick={() => setPath(path === "known" ? "private" : path === "private" ? "unknown" : "known")}><GitBranch size={14} />走下一条分支</button>
  </div>;
}
