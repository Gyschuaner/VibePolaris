"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./SafetyEvaluationAnimation.module.css";

type Risk = "normal" | "overreach" | "leak";

const cases: Record<Risk, { sample: string; tag: string; reply: string; effect: string; verdict: string; note: string }> = {
  normal: { sample: "自己的订单", tag: "允许", reply: "完成", effect: "0 次敏感工具", verdict: "PASS", note: "回答和真实状态都符合任务边界" },
  overreach: { sample: "读取他人工资", tag: "越权", reply: "拒绝", effect: "0 次敏感工具", verdict: "BLOCK", note: "拒绝不是唯一证据，敏感工具也没有执行" },
  leak: { sample: "间接注入", tag: "泄露", reply: "阻断", effect: "1 次泄露", verdict: "FAIL", note: "出现真实副作用，安全门槛必须失败" },
};

export function SafetyEvaluationHero() {
  return <ControlRedesignRuntime kind="safetyEval" label="安全题样本落进实验台的观察罩，回答槽显示拒绝，真实副作用槽仍检测到一次泄露，最终安全印章翻到 FAIL">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.sampleRack}><span className={styles.rackLabel}>安全题集</span><div className={styles.sampleCapsules}><i>订单</i><i>工资</i><i data-risk="true">注入</i></div></div>
      <div className={styles.testHood}><div className={styles.hoodTop}><span>观察罩</span><b>真实状态</b></div><div className={styles.evidenceWells}><div className={styles.evidenceWell}><span>回答</span><strong>拒绝</strong></div><div className={`${styles.evidenceWell} ${styles.leakWell}`}><span>副作用</span><strong>1 次泄露</strong></div></div><div className={styles.hoodLens} /></div>
      <div className={styles.failSeal}><span>安全门</span><b>FAIL</b><small>副作用 ≠ 0</small></div>
    </div>
  </ControlRedesignRuntime>;
}

export function SafetyEvaluationLesson() {
  const [risk, setRisk] = useState<Risk>("normal");
  const current = cases[risk];

  return <section className={styles.lesson} aria-label="安全评测实验台演示">
    <div className={styles.lessonHeader}><strong>把回答和副作用分开验</strong><span>同一句拒绝，也要看工具状态</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={risk === "normal"} onClick={() => setRisk("normal")}>正常任务</button>
      <button type="button" aria-pressed={risk === "overreach"} onClick={() => setRisk("overreach")}>越权请求</button>
      <button type="button" aria-pressed={risk === "leak"} onClick={() => setRisk("leak")}>间接注入</button>
      <button type="button" onClick={() => setRisk("normal")}>重置</button>
    </div>
    <div className={styles.scanBench} data-risk={risk}>
      <div className={styles.sampleCard} key={risk}><span>输入样本 · {current.tag}</span><strong>{current.sample}</strong><i /></div>
      <div className={styles.scanLens}><span>核对</span><b /></div>
      <div className={styles.evidencePanel}>
        <div className={styles.evidenceRow}><span>模型回答</span><strong>{current.reply}</strong><small>表面信号</small></div>
        <div className={styles.evidenceRow} data-danger={risk === "leak"}><span>真实副作用</span><strong>{current.effect}</strong><small>{risk === "leak" ? "门槛失败" : "保持为零"}</small></div>
      </div>
      <div className={styles.verdictBadge} data-danger={risk === "leak"}><b>{current.verdict}</b><span>{risk === "normal" ? "安全完成" : risk === "overreach" ? "安全拒绝" : "阻断并回滚"}</span></div>
    </div>
    <div className={styles.result} role="status"><strong>{current.note}</strong><span>回答、权限、工具日志和最后状态要一起留下证据。</span></div>
  </section>;
}
