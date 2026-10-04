"use client";

import { useState, type CSSProperties } from "react";
import { BracketsCurly, Check, Code, Cpu, FileCode, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type CompilerCase = "valid" | "syntax" | "target" | "runtime";

type CompilerStage = {
  label: string;
  icon: typeof FileCode;
};

const stages: CompilerStage[] = [
  { label: "读入源码", icon: FileCode },
  { label: "组成语法树", icon: BracketsCurly },
  { label: "变成中间表示", icon: Code },
  { label: "生成目标代码", icon: Cpu },
  { label: "交给运行时", icon: Check },
];

const cases: Record<CompilerCase, {
  label: string;
  source: string;
  values: string[];
  stopAt: number;
  failure?: string;
  failureShort?: string;
}> = {
  valid: {
    label: "正常执行",
    source: "add(2, 3)",
    values: ["add(2, 3)", "Call(add, 2, 3)", "call add · 2 · 3", "add(2, 3)", "output = 5"],
    stopAt: 4,
  },
  syntax: {
    label: "语法没写完",
    source: "add(2, )",
    values: ["add(2, )", "参数列表不完整"],
    stopAt: 1,
    failureShort: "解析停下",
    failure: "第二个参数还没出现，编译器无法组成完整的调用树；后面的中间表示、目标代码和运行时都还没有发生。",
  },
  target: {
    label: "目标环境太旧",
    source: "legacy?.value",
    values: ["legacy?.value", "OptionalMember(legacy, value)", "optional-member legacy · value", "目标不支持 ?."],
    stopAt: 3,
    failureShort: "目标不匹配",
    failure: "源代码结构是完整的，但当前目标环境不接受可选链；生成可交付目标代码时停下，需要改目标或改写语法。",
  },
  runtime: {
    label: "运行时缺名字",
    source: "add(2, missing)",
    values: ["add(2, missing)", "Call(add, 2, missing)", "call add · 2 · missing", "add(2, missing)", "ReferenceError: missing"],
    stopAt: 4,
    failureShort: "运行时出错",
    failure: "这段代码的结构和目标代码都能生成，真正执行时才发现 missing 没有值；编译器的绿灯没有替运行时完成这次检查。",
  },
};

const labels = stages.map(stage => stage.label);

export function CompilerLesson() {
  const [selected, setSelected] = useState<CompilerCase>("valid");
  const current = cases[selected];
  const scene = useScene(current.stopAt + 1);
  const step = Math.min(scene.step, current.stopAt);
  const currentStage = stages[step];
  const CurrentIcon = currentStage.icon;

  function selectCase(next: CompilerCase) {
    setSelected(next);
    scene.seek(0);
  }

  return <div className={styles.compilerStory} ref={scene.ref} role="region" aria-label="编译器从源代码到运行时的专属演示">
    <div className={styles.compilerChoices} role="group" aria-label="选择一段要观察的代码">
      {(Object.keys(cases) as CompilerCase[]).map(key => <button key={key} type="button" aria-pressed={selected === key} onClick={() => selectCase(key)}>{cases[key].label}</button>)}
    </div>

    <div className={styles.compilerJourney} style={{ "--compiler-step": step } as CSSProperties}>
      <div className={styles.compilerPacket} aria-hidden="true"><span /></div>
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const reached = index <= step;
        const isFailure = Boolean(current.failure) && step === current.stopAt && index === current.stopAt;
        const value = reached ? current.values[index] : "还没到这里";
        return <div key={stage.label} className={`${styles.compilerStation} ${reached ? styles.compilerStationReached : ""} ${index === step ? styles.compilerStationCurrent : ""} ${isFailure ? styles.compilerStationFailure : ""}`}>
          <div className={styles.compilerStationHead}><Icon size={19} aria-hidden="true" /><span>{stage.label}</span><small>{index + 1}</small></div>
          <code>{value}</code>
          {isFailure && <span className={styles.compilerStop}><Warning size={15} aria-hidden="true" />{current.failureShort}</span>}
          {reached && !isFailure && index < step && <span className={styles.compilerReached}><Check size={14} aria-hidden="true" />已通过这一层</span>}
          {reached && !isFailure && index === step && <span className={styles.compilerCurrentHint}>{selected === "valid" && step === current.stopAt ? "执行完成" : "当前正在查看"}</span>}
        </div>;
      })}
    </div>

    <div className={styles.compilerReadout} aria-live="polite">
      <div className={styles.compilerReadoutIcon}><CurrentIcon size={23} aria-hidden="true" /></div>
      <div><strong>{currentStage.label}</strong><p>{current.failure && step === current.stopAt ? current.failure : step === 0 ? `先把 ${current.source} 当成一张还没验收的纸条。编译器会从这一层开始读取。` : step === current.stopAt && selected === "valid" ? "目标代码已经交给运行时，固定输入得到 5。" : `这一层拿到的是 ${current.values[step]}，下一层只会在它通过后出现。`}</p></div>
    </div>

    <div className={styles.compilerSceneControls}><SceneControls scene={scene} labels={labels.slice(0, current.stopAt + 1)} /></div>
    <p className={styles.compilerBoundary}><strong>停在哪里，答案就在哪里。</strong>{current.failure ? ` ${current.failureShort} 之后的层不会被假装成已经完成。` : " 编译完成只代表目标代码已经生成；运行时和业务结果仍要单独检查。"}</p>
  </div>;
}
