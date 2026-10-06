"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./LatencyEvaluationAnimation.module.css";

type LatencyState = "normal" | "tail" | "timeout";
const values: Record<LatencyState, { first: string; tool: string; done: string; tail: string; note: string }> = {
  normal: { first: "420ms", tool: "1.8s", done: "3.4s", tail: "p95 3.8s", note: "一次正常完成" },
  tail: { first: "420ms", tool: "1.8s", done: "3.4s", tail: "p95 4.8s", note: "长尾被单独看见" },
  timeout: { first: "420ms", tool: "5.0s 超时", done: "未完成", tail: "不纳入完成分布", note: "停在工具等待" },
};

export function LatencyEvaluationHero() {
  return <ControlRedesignRuntime kind="latencyEval" label="一次任务的秒表先亮首字圈，再停在工具等待圈，最后盖下完成圈；更慢的 p95 样本留在旁边的尾部托盘">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.stopwatch}><span>REQUEST</span><strong>3.4s</strong><i className={styles.stopwatchHand} /><b>完成</b></div>
      <div className={styles.lapPaper}><div className={styles.lapHeader}><span>圈速记录</span><b>同一任务</b></div><div className={styles.lapRow}><span>首字</span><strong>420ms</strong><i /></div><div className={styles.lapRow}><span>工具</span><strong>1.8s</strong><i /></div><div className={styles.lapRow}><span>完成</span><strong>3.4s</strong><i /></div></div>
      <div className={styles.tailTray}><span>p95 尾部</span><div><i /><i /><i /><i className={styles.tailHot} /></div><strong>4.8s</strong></div>
    </div>
  </ControlRedesignRuntime>;
}

export function LatencyEvaluationLesson() {
  const [state, setState] = useState<LatencyState>("normal");
  const current = values[state];
  return <section className={styles.lesson} aria-label="延迟秒表演示">
    <div className={styles.lessonHeader}><strong>按圈速读一次等待</strong><span>首字、工具、完成分别记</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={state === "normal"} onClick={() => setState("normal")}>正常完成</button>
      <button type="button" aria-pressed={state === "tail"} onClick={() => setState("tail")}>放大长尾</button>
      <button type="button" aria-pressed={state === "timeout"} onClick={() => setState("timeout")}>工具超时</button>
      <button type="button" onClick={() => setState("normal")}>重置</button>
    </div>
    <div className={styles.timerDesk} data-state={state}>
      <div className={styles.timerFace} key={state}><span>当前记录</span><strong>{current.done}</strong><i className={styles.timerNeedle} /><small>{current.note}</small></div>
      <div className={styles.lapCards}>
        <div className={styles.lapCard}><span>首字</span><strong>{current.first}</strong><small>开始反馈</small></div>
        <div className={styles.lapCard} data-warn={state === "timeout"}><span>工具</span><strong>{current.tool}</strong><small>{state === "timeout" ? "等待失败" : "返回"}</small></div>
        <div className={styles.lapCard} data-muted={state === "timeout"}><span>完成</span><strong>{current.done}</strong><small>{state === "timeout" ? "不纳入分布" : "任务结束"}</small></div>
      </div>
      <div className={styles.tailReadout} data-hot={state === "tail"}><span>p95</span><strong>{current.tail}</strong><small>{state === "timeout" ? "超时样本另记" : state === "tail" ? "长尾托盘" : "典型请求"}</small></div>
    </div>
    <div className={styles.result} role="status"><strong>{current.note}</strong><span>{state === "timeout" ? "工具没有返回，就不能把未完成请求塞进完成分布。" : "p50 看典型体验，p95 把一部分用户的慢请求留下来。"}</span></div>
  </section>;
}
