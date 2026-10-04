"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowsLeftRight, CheckCircle, Code, MapPin, Warning } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type TranspileCase = "normal" | "type-error";
type TranspileStage = 0 | 1 | 2 | 3;
type Mapping = "type" | "assignment";

const programs: Record<TranspileCase, { label: string; source: string; target: string; diagnostic?: string }> = {
  normal: { label: "正常转译", source: "const n: number = 3;", target: "const n = 3;" },
  "type-error": { label: "类型不匹配", source: 'const n: number = "three";', target: 'const n = "three";', diagnostic: "类型检查：字符串不能赋给 number" },
};

const stages = ["读取源码", "识别结构", "应用规则", "输出源码"];

export function TranspilerLesson() {
  const [scenario, setScenario] = useState<TranspileCase>("normal");
  const [stage, setStage] = useState<TranspileStage>(0);
  const [focus, setFocus] = useState<Mapping>("type");
  const program = programs[scenario];
  const outputVisible = stage >= 2;
  const sourceMapVisible = stage >= 3;

  const selectScenario = (next: TranspileCase) => { setScenario(next); setStage(0); setFocus("type"); };
  const reset = () => { setScenario("normal"); setStage(0); setFocus("type"); };

  return <div className={styles.transpilerLab} data-kind="transpiler" role="region" aria-label="转译器源码映射演示">
    <div className={styles.labToolbar} role="group" aria-label="选择转译场景">
      {(Object.keys(programs) as TranspileCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => selectScenario(key)}>{programs[key].label}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.transpilerBoard}>
      <div className={styles.transpilerPane}>
        <div className={styles.transpilerPaneHeader}><Code size={17} aria-hidden="true" /><span>输入 · TypeScript</span></div>
        <code className={styles.transpilerCodeBlock}><span>const n</span><span className={focus === "type" ? styles.transpilerTokenActive : styles.transpilerToken} onMouseEnter={() => setFocus("type")} onFocus={() => setFocus("type")} tabIndex={0}>: number</span><span> = </span><span className={focus === "assignment" ? styles.transpilerTokenActive : styles.transpilerToken} onMouseEnter={() => setFocus("assignment")} onFocus={() => setFocus("assignment")} tabIndex={0}>{scenario === "normal" ? "3" : '"three"'}</span><span>;</span></code>
        {stage >= 1 && <div className={styles.transpilerStructure}><span>语法结构</span><strong>赋值</strong><em>类型标注</em></div>}
      </div>
      <div className={styles.transpilerMiddle} aria-hidden="true"><ArrowsLeftRight size={23} /></div>
      <div className={`${styles.transpilerPane} ${outputVisible ? styles.transpilerOutputPane : ""}`}>
        <div className={styles.transpilerPaneHeader}><Code size={17} aria-hidden="true" /><span>输出 · JavaScript</span></div>
        <code className={styles.transpilerCodeBlock}>{outputVisible ? <><span>const n</span><span className={focus === "type" ? styles.transpilerTokenRemoved : styles.transpilerToken}> = </span><span className={focus === "assignment" ? styles.transpilerTokenActive : styles.transpilerToken}>{scenario === "normal" ? "3" : '"three"'}</span><span>;</span></> : <span className={styles.transpilerPlaceholder}>等待转译</span>}</code>
        {sourceMapVisible && <div className={styles.transpilerSourceMap}><MapPin size={16} aria-hidden="true" /><span>source map · TS 1:9 ↔ JS 1:9</span></div>}
      </div>
    </div>
    <div className={styles.transpilerMapping} role="group" aria-label="查看节点映射">
      <button type="button" className={focus === "type" ? styles.transpilerMappingActive : ""} onClick={() => setFocus("type")} onMouseEnter={() => setFocus("type")}><span className={styles.transpilerLegendRemoved}>移除</span><code>: number</code><small>只在开发检查阶段有用</small></button>
      <button type="button" className={focus === "assignment" ? styles.transpilerMappingActive : ""} onClick={() => setFocus("assignment")} onMouseEnter={() => setFocus("assignment")}><span className={styles.transpilerLegendKept}>保留</span><code>const n = 值</code><small>赋值结构继续存在</small></button>
    </div>
    <div className={styles.transpilerProgress} aria-label="转译阶段">{stages.map((label, index) => <span key={label} className={index <= stage ? styles.transpilerProgressDone : ""}>{index + 1}. {label}</span>)}</div>
    {scenario === "type-error" && stage >= 1 && <div className={styles.transpilerDiagnostic}><Warning size={18} aria-hidden="true" /><span>{program.diagnostic}；转译器仍只移除类型节点，不会替你修正值。</span></div>}
    {stage >= 3 && <div className={styles.transpilerResult}><CheckCircle size={18} aria-hidden="true" /><span>输出仍是可阅读的 JavaScript 源码，后面还要进入构建或运行流程。</span></div>}
    <button type="button" className={styles.primaryAction} onClick={() => setStage(value => Math.min((value + 1) as TranspileStage, 3) as TranspileStage)}>{stage === 0 ? "开始转译" : stage >= 3 ? "已输出" : "推进下一阶段"}</button>
    <p className={styles.labResult} role="status">{stage === 0 ? "先选择要观察的节点，再推进一次转译。" : focus === "type" ? "当前聚焦 : number：它被移除，赋值结构仍会保留。" : "当前聚焦赋值结构：它从 TypeScript 进入 JavaScript。"}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：转译完成源码改写；打包、依赖解析、运行时 API 和最终执行仍由后续环节负责。</p>
  </div>;
}
