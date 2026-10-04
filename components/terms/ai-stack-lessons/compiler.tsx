"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle, FileCode, Warning } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type CompilerCase = "valid" | "syntax" | "runtime";

const cases: Record<CompilerCase, { label: string; source: string; failureAt?: number; failure: string }> = {
  valid: { label: "正常编译", source: "add(2, 3)", failure: "运行时得到 5，说明这条固定示例完成了执行。" },
  syntax: { label: "解析失败", source: "add(2, )", failureAt: 1, failure: "解析阶段发现参数不完整，后面的中间表示和目标代码都不会生成。" },
  runtime: { label: "运行时失败", source: "add(2, missing)", failureAt: 4, failure: "编译可以生成目标代码，但运行时找不到 missing；编译成功不等于执行成功。" },
};

const stages = [
  { label: "源代码", value: "add(2, 3)" },
  { label: "语法树", value: "Call(add, 2, 3)" },
  { label: "中间表示", value: "call add(2, 3)" },
  { label: "目标代码", value: "add_2_3" },
  { label: "运行时", value: "output = 5" },
];

export function CompilerLesson() {
  const [selected, setSelected] = useState<CompilerCase>("valid");
  const [step, setStep] = useState(0);
  const current = cases[selected];
  const reset = () => { setStep(0); setSelected("valid"); };
  const isFailure = current.failureAt !== undefined && step >= current.failureAt;
  const visibleCount = isFailure ? current.failureAt! + 1 : Math.min(step + 1, stages.length);

  return <div className={styles.toolchainLab} data-kind="compiler" role="region" aria-label="编译器把源代码转换为目标代码的演示">
    <div className={styles.labToolbar} role="group" aria-label="选择编译输入">
      {(Object.keys(cases) as CompilerCase[]).map(key => <button key={key} type="button" aria-pressed={selected === key} onClick={() => { setSelected(key); setStep(0); }}>{cases[key].label}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.compilerPipeline}>
      {stages.map((stage, index) => <span key={stage.label} className={styles.compilerStep}>
        {index > 0 && <ArrowRight className={styles.pipelineArrow} size={18} aria-hidden="true" />}
        <span className={`${styles.compilerNode} ${index < visibleCount ? styles.stageDone : ""} ${isFailure && index === current.failureAt ? styles.compilerFailure : ""}`}>
          {isFailure && index === current.failureAt ? <Warning size={23} /> : index < visibleCount ? <CheckCircle size={23} /> : <FileCode size={23} />}
          <span>{stage.label}</span><code>{isFailure && index === current.failureAt ? (selected === "syntax" ? "解析失败" : "运行错误") : index === 0 ? current.source : index < visibleCount ? stage.value : "等待上一步"}</code>
        </span>
      </span>)}
    </div>
    <button type="button" className={styles.primaryAction} onClick={() => setStep(value => Math.min(value + 1, current.failureAt ?? stages.length - 1))}>{step === 0 ? "开始编译" : "推进一层"}</button>
    <p className={styles.labResult} role="status">{step === 0 ? "先从源代码开始，逐层观察编译和执行分别发生了什么。" : isFailure ? current.failure : selected === "valid" && step >= stages.length - 1 ? current.failure : "这一层已经完成，下一步才会生成后面的表示。"}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：语法错误会挡在解析阶段；运行时错误则可能等到目标代码真正执行才出现。</p>
  </div>;
}
