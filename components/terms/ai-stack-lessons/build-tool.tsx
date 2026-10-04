"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowDown, ArrowRight, CheckCircle, FileCode, FolderOpen, GitBranch, Package, ShieldCheck, Warning } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type BuildCase = "success" | "failure";
type BuildStep = 0 | 1 | 2 | 3;
type Status = "waiting" | "active" | "done" | "blocked" | "failed";

const cases: Record<BuildCase, { label: string }> = { success: { label: "检查通过" }, failure: { label: "检查失败" } };
const statusText: Record<Status, string> = { waiting: "待执行", active: "执行中", done: "完成", blocked: "被阻塞", failed: "失败" };

function statusClass(status: Status, stylesMap: typeof styles) {
  return { waiting: stylesMap.buildNodeWaiting, active: stylesMap.buildNodeActive, done: stylesMap.buildNodeDone, blocked: stylesMap.buildNodeBlocked, failed: stylesMap.buildNodeFailed }[status];
}

export function BuildToolLesson() {
  const [scenario, setScenario] = useState<BuildCase>("success");
  const [step, setStep] = useState<BuildStep>(0);
  const states = scenario === "failure"
    ? { source: "done" as Status, typecheck: step === 0 ? "waiting" as Status : "failed" as Status, transpile: step === 0 ? "waiting" as Status : "blocked" as Status, assets: step >= 2 ? "done" as Status : step === 1 ? "active" as Status : "waiting" as Status, dist: step === 0 ? "waiting" as Status : "failed" as Status }
    : { source: "done" as Status, typecheck: step === 0 ? "waiting" as Status : "done" as Status, transpile: step < 1 ? "waiting" as Status : step === 1 ? "active" as Status : "done" as Status, assets: step < 1 ? "waiting" as Status : step === 1 ? "active" as Status : "done" as Status, dist: step < 3 ? "waiting" as Status : "done" as Status };
  const setCase = (next: BuildCase) => { setScenario(next); setStep(0); };
  const reset = () => { setScenario("success"); setStep(0); };
  const advance = () => setStep(value => Math.min(value + 1, scenario === "failure" ? 2 : 3) as BuildStep);
  const node = (id: keyof typeof states, icon: React.ReactNode, label: string, detail: string) => <div className={`${styles.buildNode} ${statusClass(states[id], styles)}`}><div className={styles.buildNodeTop}>{icon}<span>{label}</span></div><strong>{detail}</strong><small>{statusText[states[id]]}</small></div>;

  return <div className={styles.buildToolLab} data-kind="build-tool" role="region" aria-label="构建工具任务图演示">
    <div className={styles.labToolbar} role="group" aria-label="选择构建场景">
      {(Object.keys(cases) as BuildCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setCase(key)}>{cases[key].label}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.buildGraph}>
      <div className={styles.buildSource}>{node("source", <FileCode size={19} aria-hidden="true" />, "源码与资源", "3 模块 + 1 图片")}</div>
      <div className={styles.buildBranch}><ArrowRight className={styles.buildArrow} size={17} aria-hidden="true" />{node("typecheck", <ShieldCheck size={19} aria-hidden="true" />, "类型检查", "输入规则")}{node("transpile", <GitBranch size={19} aria-hidden="true" />, "转译", scenario === "failure" ? "未运行" : step === 1 ? "可运行" : "3 个模块")}</div>
      <div className={styles.buildBranch}><ArrowRight className={styles.buildArrow} size={17} aria-hidden="true" />{node("assets", <Package size={19} aria-hidden="true" />, "复制资源", "1 张图片")}</div>
      <div className={styles.buildDist}><ArrowRight className={styles.buildArrow} size={17} aria-hidden="true" />{node("dist", <FolderOpen size={19} aria-hidden="true" />, "dist 目录", scenario === "failure" ? (step === 0 ? "等待汇合" : "没有新产物") : step >= 3 ? "JS · CSS · 图片 · 清单" : "等待汇合")}</div>
    </div>
    <div className={styles.buildLegend}><span><ArrowDown size={15} aria-hidden="true" />必须等待：检查 → 转译</span><span><ArrowRight size={15} aria-hidden="true" />可并行：资源复制</span></div>
    <button type="button" className={styles.primaryAction} onClick={advance}>{scenario === "failure" ? (step === 0 ? "开始构建" : "继续观察") : step === 0 ? "开始构建" : step >= 3 ? "已汇总" : "执行下一阶段"}</button>
    {scenario === "failure" && step >= 1 ? <div className={styles.buildResultFail}><Warning size={18} aria-hidden="true" /><span>类型检查失败，转译被阻塞；资源分支可以完成，但没有新的 dist 版本。</span></div> : scenario === "success" && step >= 3 ? <div className={styles.buildResult}><CheckCircle size={18} aria-hidden="true" /><span>任务汇合完成，产物还在本机，部署尚未发生。</span></div> : null}
    <p className={styles.labResult} role="status">{step === 0 ? "构建工具先读配置，建立任务之间的等待和并行关系。" : scenario === "failure" ? "失败发生在检查节点；下游不会把未验证的半成品当成新版本。" : step === 1 ? "检查通过，转译已解锁；资源复制沿独立分支运行。" : step === 2 ? "代码和资源分别完成，dist 还要等两个分支汇合。" : "JS、CSS、图片和清单已汇总到本机 dist。"}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：构建工具编排任务并汇总产物；编译、转译、打包、开发服务和部署分别由其他环节负责。</p>
  </div>;
}
