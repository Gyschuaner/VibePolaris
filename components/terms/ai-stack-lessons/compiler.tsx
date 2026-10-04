"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle, Cpu, FileCode, Warning } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type CompilerCase = "valid" | "syntax" | "target";

const cases: Record<CompilerCase, { label: string; source: string; target: string; result: string; note: string }> = {
  valid: { label: "目标兼容", source: "const total: number = 3", target: "JavaScript", result: "app.js", note: "类型标记被移除，产物可以交给 JavaScript 运行时。" },
  syntax: { label: "语法错误", source: "const total: number =", target: "JavaScript", result: "没有产物", note: "输入没有形成完整程序，编译在生成目标代码前停止。" },
  target: { label: "目标不匹配", source: "import.meta.env.MODE", target: "旧浏览器", result: "需要改写", note: "即使语法正确，目标环境不认识的能力仍需配置或改写。" },
};

export function CompilerLesson() {
  const [selected, setSelected] = useState<CompilerCase>("valid");
  const [compiled, setCompiled] = useState(false);
  const current = cases[selected];
  const success = selected === "valid";

  const reset = () => { setCompiled(false); setSelected("valid"); };

  return <div className={styles.toolchainLab} data-kind="compiler" role="region" aria-label="编译器把源代码转换为目标代码的演示">
    <div className={styles.labToolbar} role="group" aria-label="选择编译输入">
      {(Object.keys(cases) as CompilerCase[]).map(key => <button key={key} type="button" aria-pressed={selected === key} onClick={() => { setSelected(key); setCompiled(false); }}>{cases[key].label}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.compilerPipeline}>
      <div className={styles.compilerNode}><FileCode size={24} /><span>源代码</span><code>{current.source}</code></div>
      <ArrowRight className={styles.pipelineArrow} size={20} aria-hidden="true" />
      <div className={styles.compilerNode}><Cpu size={24} /><span>编译器</span><strong>{compiled ? "检查并转换" : "等待输入"}</strong></div>
      <ArrowRight className={styles.pipelineArrow} size={20} aria-hidden="true" />
      <div className={`${styles.compilerNode} ${compiled && !success ? styles.compilerFailure : ""}`}>
        {compiled && success ? <CheckCircle size={24} /> : compiled ? <Warning size={24} /> : <FileCode size={24} />}
        <span>目标产物</span><code>{compiled ? current.result : "尚未生成"}</code>
      </div>
    </div>
    <button type="button" className={styles.primaryAction} onClick={() => setCompiled(true)}>运行编译</button>
    <p className={styles.labResult} role="status">{compiled ? current.note : `目标：${current.target}。先运行一次，才能知道是否生成了目标代码。`}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：编译成功只说明转换和检查完成，不代表程序的业务结果已经正确。</p>
  </div>;
}
