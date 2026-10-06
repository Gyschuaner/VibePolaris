"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./RubricAnimation.module.css";

type Sample = "complete" | "missing" | "overclaim";
const states: Record<Sample, { answer: string; fact: string; condition: string; risk: string; score: string; note: string }> = {
  complete: { answer: "审核后，三个工作日到账", fact: "✓", condition: "✓", risk: "✓", score: "3 / 3", note: "三项证据都能回查" },
  missing: { answer: "三个工作日到账", fact: "✓", condition: "×", risk: "✓", score: "2 / 3", note: "回到缺失的条件" },
  overclaim: { answer: "马上到账且一定免费", fact: "?", condition: "×", risk: "×", score: "0 / 3", note: "承诺超过支持证据" },
};

export function RubricHero() {
  return <ControlRedesignRuntime kind="rubric" label="回答卡放进三把透明量规下，事实和风险落下通过刻度，条件刻度悬空，右侧分数盘停在 2/3">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.answerSlip}><span>回答卡</span><strong>审核后，三个工作日到账</strong><small>逐项测量，不凭整体印象</small></div>
      <div className={styles.rulerStack}><div className={styles.ruler}><span>事实</span><i /><b>✓</b></div><div className={`${styles.ruler} ${styles.rulerMissing}`}><span>条件</span><i /><b>?</b></div><div className={styles.ruler}><span>风险</span><i /><b>✓</b></div></div>
      <div className={styles.scoreDial}><span>量表分数</span><strong>2 / 3</strong><i /><small>条件缺口</small></div>
    </div>
  </ControlRedesignRuntime>;
}

export function RubricLesson() {
  const [sample, setSample] = useState<Sample>("complete");
  const current = states[sample];
  return <section className={styles.lesson} aria-label="评分量规演示">
    <div className={styles.lessonHeader}><strong>把一句话放到三把量规下</strong><span>每个维度都要有证据</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={sample === "complete"} onClick={() => setSample("complete")}>保留条件</button>
      <button type="button" aria-pressed={sample === "missing"} onClick={() => setSample("missing")}>漏掉条件</button>
      <button type="button" aria-pressed={sample === "overclaim"} onClick={() => setSample("overclaim")}>越界承诺</button>
      <button type="button" onClick={() => setSample("complete")}>重置</button>
    </div>
    <div className={styles.measureDesk} data-sample={sample}>
      <div className={styles.measureAnswer} key={sample}><span>回答</span><strong>{current.answer}</strong><small>同一题</small></div>
      <div className={styles.measureRulers}><div><span>事实</span><b data-mark={current.fact === "✓"}>{current.fact}</b><i /></div><div data-missing={current.condition !== "✓"}><span>条件</span><b data-mark={current.condition === "✓"}>{current.condition}</b><i /></div><div data-missing={current.risk !== "✓"}><span>风险</span><b data-mark={current.risk === "✓"}>{current.risk}</b><i /></div></div>
      <div className={styles.measureScore}><span>量表分数</span><strong>{current.score}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.result} role="status"><strong>{current.score} · {current.note}</strong><span>评分量表把整体印象拆成可回查的维度，不让一项通过遮住另一项缺口。</span></div>
  </section>;
}
