"use client";

import { useState, type CSSProperties } from "react";
import { ArrowsLeftRight, CheckCircle, Code, MapPin, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type TranspileCase = "normal" | "type-error";
type Mapping = "type" | "assignment";

const programs: Record<TranspileCase, { label: string; target: string; diagnostic?: string }> = {
  normal: { label: "正常转译", target: "3" },
  "type-error": { label: "类型不匹配", target: '"three"', diagnostic: "类型检查：字符串不能赋给 number" },
};

const stages = ["读取源码", "识别结构", "移除类型节点", "生成 source map"];

export function TranspilerLesson() {
  const [scenario, setScenario] = useState<TranspileCase>("normal");
  const [focus, setFocus] = useState<Mapping>("type");
  const scene = useScene(stages.length);
  const stage = scene.step;
  const program = programs[scenario];
  const outputVisible = stage >= 2;
  const sourceMapVisible = stage >= 3;

  function selectScenario(next: TranspileCase) {
    setScenario(next);
    setFocus("type");
    scene.seek(0);
  }

  return <div className={styles.transpilerStory} ref={scene.ref} role="region" aria-label="转译器源码映射演示">
    <div className={styles.transpilerChoices} role="group" aria-label="选择转译场景">
      {(Object.keys(programs) as TranspileCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => selectScenario(key)}>{programs[key].label}</button>)}
    </div>
    <div className={styles.transpilerBoard} style={{ "--transpiler-step": stage } as CSSProperties}>
      <div className={styles.transpilerTransfer} aria-hidden="true"><span /></div>
      <div className={styles.transpilerPane}>
        <div className={styles.transpilerPaneHeader}><Code size={17} aria-hidden="true" /><span>输入 · TypeScript</span></div>
        <code className={styles.transpilerCodeBlock}>
          <span>const n</span>
          <button type="button" aria-pressed={focus === "type"} aria-label="聚焦类型标注" className={focus === "type" ? styles.transpilerTokenActive : styles.transpilerToken} onClick={() => setFocus("type")} onMouseEnter={() => setFocus("type")} >: number</button>
          <span> = </span>
          <button type="button" aria-pressed={focus === "assignment"} aria-label="聚焦赋值" className={focus === "assignment" ? styles.transpilerTokenActive : styles.transpilerToken} onClick={() => setFocus("assignment")} onMouseEnter={() => setFocus("assignment")} >{program.target}</button>
          <span>;</span>
        </code>
        {stage >= 1 && <div className={styles.transpilerStructure}><span>语法结构</span><strong>赋值</strong><em>类型标注</em></div>}
      </div>
      <div className={styles.transpilerMiddle} aria-hidden="true"><ArrowsLeftRight size={23} /></div>
      <div className={`${styles.transpilerPane} ${outputVisible ? styles.transpilerOutputPane : ""}`}>
        <div className={styles.transpilerPaneHeader}><Code size={17} aria-hidden="true" /><span>输出 · JavaScript</span></div>
        <code className={styles.transpilerCodeBlock}>{outputVisible ? <><span>const n</span><span className={focus === "type" ? styles.transpilerTokenRemoved : styles.transpilerToken}> = </span><span className={focus === "assignment" ? styles.transpilerTokenActive : styles.transpilerToken}>{program.target}</span><span>;</span></> : <span className={styles.transpilerPlaceholder}>等待转译</span>}</code>
        {sourceMapVisible && <div className={styles.transpilerSourceMap}><MapPin size={16} aria-hidden="true" /><span>source map · TS 第 1 行 ↔ JS 第 1 行</span></div>}
      </div>
    </div>
    <div className={styles.transpilerMapping} role="group" aria-label="查看节点映射">
      <button type="button" aria-pressed={focus === "type"} className={focus === "type" ? styles.transpilerMappingActive : ""} onClick={() => setFocus("type")} onMouseEnter={() => setFocus("type")}><span className={styles.transpilerLegendRemoved}>移除</span><code>: number</code><small>只在开发检查阶段有用</small></button>
      <button type="button" aria-pressed={focus === "assignment"} className={focus === "assignment" ? styles.transpilerMappingActive : ""} onClick={() => setFocus("assignment")} onMouseEnter={() => setFocus("assignment")}><span className={styles.transpilerLegendKept}>保留</span><code>const n = 值</code><small>赋值结构继续存在</small></button>
    </div>
    <div className={styles.transpilerProgress} aria-label="转译阶段">{stages.map((label, index) => <span key={label} className={index <= stage ? styles.transpilerProgressDone : ""}>{index + 1}. {label}</span>)}</div>
    {scenario === "type-error" && stage >= 1 && <div className={styles.transpilerDiagnostic} role="status" aria-live="polite"><Warning size={18} aria-hidden="true" /><span>{stage >= 3 ? `输出已生成，但诊断仍未解决：${program.diagnostic}。转译器只擦除类型节点，是否允许带错误输出取决于配置（例如 noEmitOnError）。` : `${program.diagnostic}；转译器仍只移除类型节点，不会替你修正值。`}</span></div>}
    {scenario === "normal" && stage >= 3 && <div className={styles.transpilerResult} role="status" aria-live="polite"><CheckCircle size={18} aria-hidden="true" /><span>输出仍是可阅读的 JavaScript 源码，后面还要进入构建或运行流程。</span></div>}
    <div className={styles.transpilerSceneControls}><SceneControls scene={scene} labels={stages} /></div>
    <p className={styles.transpilerBoundary}><strong>源代码改写到这里结束。</strong>打包、依赖解析、运行时 API 和最终执行仍由后续环节负责。</p>
  </div>;
}
