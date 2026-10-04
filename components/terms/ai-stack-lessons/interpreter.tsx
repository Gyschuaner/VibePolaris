"use client";

import { useState } from "react";
import { ArrowCounterClockwise, CaretRight, CheckCircle, Terminal, Warning } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type InterpreterCase = "normal" | "error";

const programs: Record<InterpreterCase, { label: string; lines: string[] }> = {
  normal: { label: "正常执行", lines: ["x = 1", "x = x + 2", "print(x)"] },
  error: { label: "执行到错误", lines: ["x = 1", "x = missing + 2", "print(x)"] },
};

export function InterpreterLesson() {
  const [scenario, setScenario] = useState<InterpreterCase>("normal");
  const [step, setStep] = useState(0);
  const program = programs[scenario];
  const error = scenario === "error" && step >= 2;
  const pointer = error ? 1 : Math.min(step, program.lines.length - 1);
  const variable = step === 0 ? "未赋值" : error ? "1（保留）" : step === 1 ? "1" : "3";
  const output = scenario === "normal" && step >= 3 ? "3" : "等待";
  const maxStep = scenario === "error" ? 2 : 3;

  const reset = () => { setScenario("normal"); setStep(0); };

  return <div className={styles.interpreterLab} data-kind="interpreter" role="region" aria-label="解释器单步执行与变量状态演示">
    <div className={styles.labToolbar} role="group" aria-label="选择解释执行场景">
      {(Object.keys(programs) as InterpreterCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key); setStep(0); }}>{programs[key].label}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.interpreterBoard}>
      <div className={styles.codePanel}><span className={styles.panelLabel}>指令序列</span>{program.lines.map((line, index) => <div key={line} className={`${styles.codeLine} ${pointer === index ? styles.codeLineActive : ""} ${error && index === 1 ? styles.codeLineError : ""}`}><span>{index + 1}</span>{pointer === index && <CaretRight size={15} aria-hidden="true"/>}<code>{line}</code></div>)}</div>
      <div className={styles.statePanel}><span className={styles.panelLabel}>变量表</span><div className={styles.variableRow}><code>x</code><strong>{variable}</strong></div><span className={styles.panelLabel}>控制台</span><div className={`${styles.consoleBox} ${error ? styles.consoleError : ""}`}>{error ? <><Warning size={18} />NameError: missing</> : <><Terminal size={18} />{output}</>}</div></div>
    </div>
    <button type="button" className={styles.primaryAction} onClick={() => setStep(value => Math.min(value + 1, maxStep))}>{step === 0 ? "开始执行" : "单步执行"}</button>
    <p className={styles.labResult} role="status">{step === 0 ? "指针还没有执行任何指令，x 也还没有值。" : error ? "错误发生在第二条指令；第一条已经写入的 x = 1 不会自动撤销。" : step >= 3 ? "解释器读取当前变量，把 3 写到控制台。" : `指针移到第 ${pointer + 1} 条，变量表更新为 x = ${variable}。`}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：这里的“逐步”指运行时按指令推进，不是把源文件文字逐行翻译；运行时仍可能先准备字节码或使用即时编译。</p>
  </div>;
}
