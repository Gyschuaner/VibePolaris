"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./PassFailAnimation.module.css";

type Result = "pass" | "fail" | "unscored";
const states: Record<Result, { label: string; evidence: string; detail: string; action: string }> = {
  pass: { label: "PASS", evidence: "answer.json · amount=120", detail: "两条条件都可检查", action: "允许进入门槛" },
  fail: { label: "FAIL", evidence: "answer.json · amount=90", detail: "字段与判据不符", action: "进入修复" },
  unscored: { label: "UNSCORED", evidence: "环境不可读", detail: "没有证据可判定", action: "暂停并重跑" },
};

export function PassFailHero() {
  return <ControlRedesignRuntime kind="passFail" label="证据单被送进判定印章机，文件和金额都正确时盖下 PASS；字段错误盖 FAIL；环境不可读则停在 UNSCORED">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.evidenceSheet}><span>证据单</span><strong>answer.json</strong><div><i>file ✓</i><i>amount ✓</i><i className={styles.unknownMark}>env ?</i></div></div>
      <div className={styles.stampPress}><div className={styles.pressTop}><span>判定盘</span><b>检查证据</b></div><div className={styles.stampWheel}><i>PASS</i><i>FAIL</i><i>?</i></div><div className={styles.pressPlunger} /></div>
      <div className={styles.outputCard}><span>结果</span><strong>PASS</strong><small>进入门槛</small></div>
    </div>
  </ControlRedesignRuntime>;
}

export function PassFailLesson() {
  const [result, setResult] = useState<Result>("pass");
  const current = states[result];
  return <section className={styles.lesson} aria-label="通过失败判定印章机演示">
    <div className={styles.lessonHeader}><strong>换一张证据单再盖章</strong><span>缺证据不等于失败</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={result === "pass"} onClick={() => setResult("pass")}>证据正确</button>
      <button type="button" aria-pressed={result === "fail"} onClick={() => setResult("fail")}>字段错误</button>
      <button type="button" aria-pressed={result === "unscored"} onClick={() => setResult("unscored")}>环境不可读</button>
      <button type="button" onClick={() => setResult("pass")}>重置</button>
    </div>
    <div className={styles.stampDesk} data-result={result}>
      <div className={styles.lessonSheet} key={result}><span>检查对象</span><strong>{current.evidence}</strong><div><i data-ok={result === "pass"}>文件</i><i data-ok={result === "pass"}>金额</i><i data-unknown={result === "unscored"}>环境</i></div></div>
      <div className={styles.lessonPress}><div className={styles.pressHandle}><i /><i /></div><div className={styles.inkPad}><span>判定</span><strong>{current.label}</strong></div></div>
      <div className={styles.lessonAction}><span>下一步</span><strong>{current.action}</strong><small>{current.detail}</small></div>
    </div>
    <div className={styles.result} role="status"><strong>{current.label} · {current.action}</strong><span>{result === "unscored" ? "环境不可读时保留未评分，补证据或重跑。" : "评分器只对写下的成功条件负责。"}</span></div>
  </section>;
}
