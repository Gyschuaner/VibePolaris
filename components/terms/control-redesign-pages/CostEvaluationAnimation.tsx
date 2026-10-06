"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./CostEvaluationAnimation.module.css";

type Variant = "a" | "cold" | "cache";
const values: Record<Variant, { label: string; quality: string; cost: string; note: string; coins: number; over: boolean }> = {
  a: { label: "方案 A · 一次工具调用", quality: "17 / 20", cost: "¥0.42", note: "预算内", coins: 3, over: false },
  cold: { label: "方案 B · 冷缓存含重试", quality: "18 / 20", cost: "¥1.16", note: "超预算", coins: 5, over: true },
  cache: { label: "方案 B · 命中缓存", quality: "18 / 20", cost: "¥0.82", note: "条件不同", coins: 4, over: false },
};

export function CostEvaluationHero() {
  return <ControlRedesignRuntime kind="costEval" label="固定题集先盖质量章，任务收银台把令牌和重试压进同一张小票，方案 B 的小票超过一元预算但质量章仍单独保留">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.taskTicket}><span>固定题集</span><strong>20 题</strong><b>质量章</b><i>17 / 20</i></div>
      <div className={styles.cashRegister}><div className={styles.registerTop}><span>任务收银台</span><b>per task</b></div><div className={styles.coinTray}><i /><i /><i /><i className={styles.retryCoin} /></div><div className={styles.receipt}><span>运行小票</span><strong>A ¥0.42　B ¥1.16</strong><small>令牌 · 工具 · 重试</small></div></div>
      <div className={styles.budgetDial}><span>预算</span><b>¥1.00</b><i /><strong>B 超出</strong></div>
    </div>
  </ControlRedesignRuntime>;
}

export function CostEvaluationLesson() {
  const [variant, setVariant] = useState<Variant>("a");
  const current = values[variant];
  return <section className={styles.lesson} aria-label="成本与质量小票演示">
    <div className={styles.lessonHeader}><strong>看一张完整任务小票</strong><span>质量和消耗分开记</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={variant === "a"} onClick={() => setVariant("a")}>方案 A</button>
      <button type="button" aria-pressed={variant === "cold"} onClick={() => setVariant("cold")}>方案 B · 冷缓存</button>
      <button type="button" aria-pressed={variant === "cache"} onClick={() => setVariant("cache")}>方案 B · 命中缓存</button>
      <button type="button" onClick={() => setVariant("a")}>重置</button>
    </div>
    <div className={styles.receiptDesk} data-over={current.over} data-variant={variant}>
      <div className={styles.qualityStamp}><span>固定题集</span><strong>{current.quality}</strong><small>质量章</small></div>
      <div className={styles.receiptPaper} key={variant}><header><span>{current.label}</span><b>运行小票</b></header><div className={styles.receiptLine}><span>令牌 / 工具 / 重试</span><div className={styles.receiptCoins}>{Array.from({ length: current.coins }, (_, index) => <i key={index} />)}</div></div><div className={styles.receiptAmount}><span>单任务成本</span><strong>{current.cost}</strong></div></div>
      <div className={styles.budgetMeter}><span>预算 ¥1.00</span><i><b style={{ width: current.over ? "100%" : variant === "cache" ? "82%" : "42%" }} /></i><strong>{current.note}</strong></div>
    </div>
    <div className={styles.result} role="status"><strong>{current.note}：{current.cost}，质量 {current.quality}</strong><span>{variant === "cache" ? "缓存条件改变了执行成本，不能和冷请求混成一条曲线。" : "先看完整任务花费，再决定质量和成本的取舍。"}</span></div>
  </section>;
}
