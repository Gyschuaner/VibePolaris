"use client";

import { useState } from "react";
import { CaretRight, CheckCircle, Terminal, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type InterpreterCase = "normal" | "error";

const programs: Record<InterpreterCase, { label: string; lines: string[] }> = {
  normal: { label: "正常执行", lines: ["x = 1", "x = x + 2", "print(x)"] },
  error: { label: "执行到错误", lines: ["x = 1", "x = missing + 2", "print(x)"] },
};

const labels: Record<InterpreterCase, string[]> = {
  normal: ["准备执行", "写入 x = 1", "更新 x = 3", "打印输出"],
  error: ["准备执行", "写入 x = 1", "执行缺失变量"],
};

export function InterpreterLesson() {
  const [scenario, setScenario] = useState<InterpreterCase>("normal");
  const scene = useScene(labels[scenario].length);
  const step = scene.step;
  const program = programs[scenario];
  const error = scenario === "error" && step >= 2;
  const pointer = error ? 1 : Math.min(step, program.lines.length - 1);
  const variable = step === 0 ? "未赋值" : error ? "1（保留）" : step === 1 ? "1" : "3";
  const output = scenario === "normal" && step >= 3 ? "3" : "等待";

  function selectScenario(next: InterpreterCase) {
    setScenario(next);
    scene.seek(0);
  }

  return <div className={styles.interpreterStory} ref={scene.ref} role="region" aria-label="解释器单步执行与变量状态演示">
    <div className={styles.interpreterChoices} role="group" aria-label="选择解释执行场景">
      {(Object.keys(programs) as InterpreterCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => selectScenario(key)}>{programs[key].label}</button>)}
    </div>
    <div className={styles.interpreterBoard}>
      <div className={styles.codePanel}><span className={styles.panelLabel}>指令序列</span>{program.lines.map((line, index) => <div key={line} className={`${styles.codeLine} ${pointer === index ? styles.codeLineActive : ""} ${error && index === 1 ? styles.codeLineError : ""}`}><span>{index + 1}</span><span aria-hidden="true">{pointer === index && <CaretRight size={15} />}</span><code>{line}</code></div>)}</div>
      <div className={styles.statePanel}><span className={styles.panelLabel}>变量表</span><div className={styles.variableRow}><code>x</code><strong>{variable}</strong></div><span className={styles.panelLabel}>控制台</span><div className={`${styles.consoleBox} ${error ? styles.consoleError : ""}`}>{error ? <><Warning size={18} aria-hidden="true" />NameError: missing</> : <><Terminal size={18} aria-hidden="true" />{output}</>}</div></div>
    </div>
    <div className={`${styles.interpreterStatus} ${error ? styles.interpreterStatusError : ""}`} role="status" aria-live="polite">
      {error ? <><Warning size={19} aria-hidden="true" /><p><strong>错误发生在第二条指令。</strong> 第一条已经写入的 x = 1 留在变量表里，解释器不会自动撤销它。</p></> : step >= 3 ? <><CheckCircle size={19} aria-hidden="true" /><p><strong>当前值已经打印。</strong> 解释器读到 x 的值 3，再把它交给控制台。</p></> : <><CaretRight size={19} aria-hidden="true" /><p>{step === 0 ? "指针还没执行任何指令，x 也还没有值。" : `指针移到第 ${pointer + 1} 条，变量表现在是 x = ${variable}。`}</p></>}
    </div>
    <div className={styles.interpreterSceneControls}><SceneControls scene={scene} labels={labels[scenario]} /></div>
    <p className={styles.interpreterBoundary}><strong>这里的“逐步”发生在运行时。</strong>它按指令推进，不是把源文件文字逐行翻译；运行时仍可能先准备字节码或使用即时编译。</p>
  </div>;
}
