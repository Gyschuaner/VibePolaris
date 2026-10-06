"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./EvaluationRunAnimation.module.css";

const traceStates = ["pass", "pass", "pass", "pass", "pass", "pass", "pass", "pass", "pass", "pass", "review", "review"] as const;

export function EvaluationRunHero() {
  return <ControlRedesignRuntime kind="evalrun" label="一张运行证据夹把题集、被测版本、评分器和逐项轨迹夹在同一个 run-18 编号下，十项完成、两项待复核">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.runTicket}>
        <span className={styles.ticketKicker}>EVALUATION RUN</span>
        <strong>18</strong>
        <div className={styles.ticketRows}><span>题集 <code>support-v1</code></span><span>版本 <code>agent-C</code></span><span>评分 <code>rubric-v2</code></span></div>
      </div>
      <div className={styles.evidenceFolio}>
        <div className={styles.folioClip}><i /><i /></div>
        <div className={styles.folioHeader}><span>证据夹</span><b>12 条轨迹</b></div>
        <div className={styles.traceSlots}>{traceStates.map((state, index) => <span key={index} className={styles.traceSlot} data-state={state}>{String(index + 1).padStart(2, "0")}</span>)}</div>
        <div className={styles.folioFooter}><span>staging</span><strong>2 待复核</strong></div>
      </div>
      <div className={styles.runSeal}><b>run-18</b><span>10 / 12</span></div>
    </div>
  </ControlRedesignRuntime>;
}

type RunState = { sameSet: boolean; traceComplete: boolean };

function RunCard({ name, state, muted = false }: { name: string; state: RunState; muted?: boolean }) {
  return <article className={styles.runCard} data-muted={muted}>
    <header><span>{name}</span><strong>10 / 12</strong></header>
    <div className={styles.cardLine}><span>题集</span><code>{state.sameSet ? "support-v1" : "support-v2"}</code></div>
    <div className={styles.cardLine}><span>评分器</span><code>rubric-v2</code></div>
    <div className={styles.cardLine}><span>轨迹</span><code>{state.traceComplete ? "12 / 12" : "10 / 12"}</code></div>
    <div className={styles.cardDots}>{Array.from({ length: 12 }, (_, index) => <i key={index} data-missing={!state.traceComplete && index > 9} />)}</div>
  </article>;
}

export function EvaluationRunLesson() {
  const [state, setState] = useState<RunState>({ sameSet: true, traceComplete: false });
  const comparable = state.sameSet && state.traceComplete;

  return <section className={styles.lesson} aria-label="评测运行证据夹演示">
    <div className={styles.lessonHeader}><strong>把两次运行夹在一起比较</strong><span>总分相同也要先对齐证据</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={state.traceComplete} onClick={() => setState(value => ({ ...value, traceComplete: !value.traceComplete }))}>{state.traceComplete ? "抽走两条轨迹" : "补回两条轨迹"}</button>
      <button type="button" aria-pressed={state.sameSet} onClick={() => setState(value => ({ ...value, sameSet: !value.sameSet }))}>{state.sameSet ? "换一版题集" : "恢复 support-v1"}</button>
      <button type="button" onClick={() => setState({ sameSet: true, traceComplete: false })}>重置</button>
    </div>
    <div className={styles.compareDesk} data-comparable={comparable}>
      <RunCard name="run-17" state={{ sameSet: true, traceComplete: true }} muted />
      <div className={styles.compareClamp}><span /><b>{comparable ? "可比较" : "先补证据"}</b></div>
      <RunCard name="run-18" state={state} />
    </div>
    <div className={styles.result} role="status"><strong>{comparable ? "夹子合上：条件一致，可以比较" : "夹子未合上：这两个 10 / 12 还不能直接比较"}</strong><span>{state.sameSet ? (state.traceComplete ? "题集、评分器和逐项轨迹都在记录里" : "run-18 还缺两条逐项轨迹") : "题集版本不同，先恢复共同条件"}</span></div>
  </section>;
}
