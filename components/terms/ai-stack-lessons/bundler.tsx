"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle, Code, DownloadSimple, Package, Warning } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type BundleCase = "dynamic" | "failure";
type BundleStage = 0 | 1 | 2 | 3;
type BundleStatus = "waiting" | "active" | "done" | "muted" | "failed";

const cases: Record<BundleCase, string> = { dynamic: "动态导入", failure: "按需块请求失败" };

function statusClass(status: BundleStatus) {
  return {
    waiting: styles.bundlerNodeWaiting,
    active: styles.bundlerNodeActive,
    done: styles.bundlerNodeDone,
    muted: styles.bundlerNodeMuted,
    failed: styles.bundlerNodeFailed,
  }[status];
}

export function BundlerLesson() {
  const [scenario, setScenario] = useState<BundleCase>("dynamic");
  const [stage, setStage] = useState<BundleStage>(0);
  const isStatic = scenario === "dynamic" && stage >= 3;
  const outputState = (kind: "main" | "lazy"): { status: BundleStatus; detail: string } => {
    if (scenario === "failure") {
      if (kind === "main") return stage === 0 ? { status: "waiting", detail: "等待入口" } : { status: "done", detail: "入口 + 5" };
      return stage < 2 ? { status: "waiting", detail: "等待按需请求" } : { status: "failed", detail: "请求失败" };
    }
    if (kind === "main") {
      if (isStatic) return { status: "done", detail: "入口 + 6" };
      return stage === 0 ? { status: "waiting", detail: "等待静态依赖" } : { status: "done", detail: "入口 + 5" };
    }
    if (isStatic) return { status: "muted", detail: "0 · 已并入主包" };
    return stage < 2 ? { status: "waiting", detail: "等待用户动作" } : { status: "done", detail: "1 个按需模块" };
  };
  const inputState = (kind: "entry" | "static" | "dynamic"): BundleStatus => {
    if (kind === "entry") return stage === 0 ? "active" : "done";
    if (kind === "static") return stage === 0 ? "active" : "done";
    if (isStatic) return "done";
    return stage < 2 ? "muted" : "done";
  };
  const setCase = (next: BundleCase) => { setScenario(next); setStage(0); };
  const reset = () => { setScenario("dynamic"); setStage(0); };
  const advance = () => setStage(value => Math.min(value + 1, 3) as BundleStage);
  const node = (status: BundleStatus, icon: React.ReactNode, label: string, detail: string) => <div className={`${styles.bundlerNode} ${statusClass(status)}`}><div className={styles.bundlerNodeTop}>{icon}<span>{label}</span></div><strong>{detail}</strong></div>;
  const main = outputState("main");
  const lazy = outputState("lazy");

  return <div className={styles.bundlerLab} data-kind="bundler" role="region" aria-label="打包器依赖图和代码分割演示">
    <div className={styles.labToolbar} role="group" aria-label="选择打包场景">
      {(Object.keys(cases) as BundleCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setCase(key)}>{cases[key]}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.bundlerDiagram}>
      <div className={styles.bundlerColumn}>
        {node(inputState("entry"), <Code size={19} aria-hidden="true" />, "入口", "src/main.js")}
        <div className={styles.bundlerInnerArrow}><ArrowRight size={16} aria-hidden="true" /><span>静态导入</span></div>
        {node(inputState("static"), <Package size={19} aria-hidden="true" />, "静态依赖", "5 个模块")}
        <div className={styles.bundlerInnerArrow}><ArrowRight size={16} aria-hidden="true" /><span>{isStatic ? "改为静态导入" : "动态导入"}</span></div>
        {node(inputState("dynamic"), <DownloadSimple size={19} aria-hidden="true" />, "按需依赖", "1 个模块")}
      </div>
      <div className={styles.bundlerFlow} aria-hidden="true"><ArrowRight size={25} /></div>
      <div className={styles.bundlerColumn}>
        {node(main.status, <Package size={19} aria-hidden="true" />, "主包", `dist/main.js · ${main.detail}`)}
        <div className={styles.bundlerInnerArrow}><ArrowRight size={16} aria-hidden="true" /><span>{scenario === "failure" && stage >= 2 ? "主包仍可用" : "按需拆分"}</span></div>
        {node(lazy.status, scenario === "failure" && stage >= 2 ? <Warning size={19} aria-hidden="true" /> : <DownloadSimple size={19} aria-hidden="true" />, "按需块", `dist/lazy.js · ${lazy.detail}`)}
      </div>
    </div>
    <div className={styles.bundlerLegend}><span><ArrowRight size={15} aria-hidden="true" />入口沿依赖边建图</span><span><DownloadSimple size={15} aria-hidden="true" />动态导入决定加载边界</span></div>
    <button type="button" className={styles.primaryAction} onClick={advance}>{scenario === "failure" ? (stage === 0 ? "建立依赖图" : stage === 1 ? "请求按需块" : "已显示失败") : stage === 0 ? "生成主包" : stage === 1 ? "请求按需块" : stage === 2 ? "改成静态导入" : "已合并"}</button>
    {scenario === "failure" && stage >= 2 ? <div className={styles.bundlerResultFail}><Warning size={18} aria-hidden="true" /><span>按需块请求失败，主包仍然是已生成的文件；这是运行时加载边界，不等于整个打包失败。</span></div> : isStatic ? <div className={styles.bundlerResult}><CheckCircle size={18} aria-hidden="true" /><span>动态依赖改成静态导入后，按需模块并入主包，lazy.js 不再单独请求。</span></div> : null}
    <p className={styles.labResult} role="status">{stage === 0 ? "先从入口沿静态和动态导入建立依赖图。" : scenario === "failure" ? "主包和按需块是两个边界；一个请求失败，不会抹掉已经生成的主包。" : stage === 1 ? "入口和 5 个静态依赖先进入主包，动态模块还没有随首屏加载。" : stage === 2 ? "用户打开按需功能时，浏览器才请求 lazy.js。" : "把动态导入改成静态导入，主包从入口 + 5 变成入口 + 6。"}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：打包器整理模块图并做代码分割；转译、类型检查、压缩和运行时请求是否成功仍由其他环节负责。</p>
  </div>;
}
