"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, CheckCircle, FileCode, FolderOpen, GitBranch, Package, ShieldCheck, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type BuildCase = "success" | "failure";
type Status = "waiting" | "active" | "done" | "blocked" | "failed";

const cases: Record<BuildCase, { label: string }> = { success: { label: "检查通过" }, failure: { label: "检查失败" } };
const statusText: Record<Status, string> = { waiting: "待执行", active: "执行中", done: "完成", blocked: "被阻塞", failed: "失败" };
const labels: Record<BuildCase, string[]> = {
  success: ["建立任务图", "检查通过", "代码和资源完成", "产物汇总"],
  failure: ["建立任务图", "检查失败", "资源分支收束"],
};

function statusClass(status: Status, stylesMap: typeof styles) {
  return { waiting: stylesMap.buildNodeWaiting, active: stylesMap.buildNodeActive, done: stylesMap.buildNodeDone, blocked: stylesMap.buildNodeBlocked, failed: stylesMap.buildNodeFailed }[status];
}

export function BuildToolLesson() {
  const [scenario, setScenario] = useState<BuildCase>("success");
  const scene = useScene(labels[scenario].length);
  const step = scene.step;
  const failure = scenario === "failure";
  const states: Record<string, Status> = failure
    ? {
        source: step === 0 ? "active" : "done",
        typecheck: step === 0 ? "waiting" : "failed",
        transpile: step === 0 ? "waiting" : "blocked",
        assets: step === 0 ? "waiting" : step === 1 ? "active" : "done",
        dist: step < 2 ? "waiting" : "failed",
      }
    : {
        source: step === 0 ? "active" : "done",
        typecheck: step === 0 ? "waiting" : "done",
        transpile: step < 1 ? "waiting" : step === 1 ? "active" : "done",
        assets: step < 1 ? "waiting" : step === 1 ? "active" : "done",
        dist: step < 2 ? "waiting" : step === 2 ? "active" : "done",
      };

  function selectScenario(next: BuildCase) {
    setScenario(next);
    scene.seek(0);
  }

  function node(id: keyof typeof states, icon: ReactNode, label: string, detail: string) {
    const status = states[id];
    return <div className={`${styles.buildNode} ${statusClass(status, styles)}`}><div className={styles.buildNodeTop}>{icon}<span>{label}</span></div><strong>{detail}</strong><small>{statusText[status]}</small></div>;
  }

  const result = failure
    ? step >= 2 ? <><Warning size={18} aria-hidden="true" /><span>类型检查失败，转译被阻塞；资源分支完成了，但没有新的 dist 版本。</span></>
      : step === 1 ? <><Warning size={18} aria-hidden="true" /><span>类型检查在入口处失败，转译还没有开始；资源复制仍可沿独立分支运行。</span></>
        : null
    : step >= 3 ? <><CheckCircle size={18} aria-hidden="true" /><span>任务汇合完成，产物还在本机，部署尚未发生。</span></> : null;

  return <div className={styles.buildStory} ref={scene.ref} role="region" aria-label="构建工具任务图演示">
    <div className={styles.buildChoices} role="group" aria-label="选择构建场景">
      {(Object.keys(cases) as BuildCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => selectScenario(key)}>{cases[key].label}</button>)}
    </div>
    <div className={`${styles.buildGraph} ${styles.buildStoryGraph}`}>
      <div className={styles.buildSource}>{node("source", <FileCode size={19} aria-hidden="true" />, "源码与资源", "3 模块 + 1 图片")}</div>
      <div className={styles.buildBranch}><ArrowRight className={styles.buildArrow} size={17} aria-hidden="true" />{node("typecheck", <ShieldCheck size={19} aria-hidden="true" />, "类型检查", failure && step > 0 ? "TypeError · 1:8" : "输入规则")}{node("transpile", <GitBranch size={19} aria-hidden="true" />, "转译", failure ? "检查失败，未运行" : step >= 2 ? "3 个模块" : "等待检查")}</div>
      <div className={styles.buildBranch}><ArrowRight className={styles.buildArrow} size={17} aria-hidden="true" />{node("assets", <Package size={19} aria-hidden="true" />, "复制资源", step >= 2 ? "1 张图片" : "1 张图片待复制")}</div>
      <div className={styles.buildDist}><ArrowRight className={styles.buildArrow} size={17} aria-hidden="true" />{node("dist", <FolderOpen size={19} aria-hidden="true" />, "dist 目录", failure ? (step >= 2 ? "没有新产物" : "等待汇合") : step >= 3 ? "JS · CSS · 图片 · 清单" : "等待汇合")}</div>
    </div>
    <div className={styles.buildLegend}><span><ArrowDown size={15} aria-hidden="true" />必须等待：检查 → 转译</span><span><ArrowRight size={15} aria-hidden="true" />可并行：资源复制</span></div>
    <div className={`${styles.buildResult} ${failure ? styles.buildResultFail : ""}`} role="status" aria-live="polite">{result ?? <><ArrowRight size={18} aria-hidden="true" /><span>{step === 0 ? "构建工具正在读取源码与资源，还没有放行任何任务分支。" : step === 1 ? "检查通过，转译和资源复制同时开始；dist 还在等两个分支。" : "代码和资源都已完成，dist 正在等待最后一次汇合。"}</span></>}</div>
    <div className={styles.buildSceneControls}><SceneControls scene={scene} labels={labels[scenario]} /></div>
    <p className={styles.buildBoundary}><strong>构建完成的边界。</strong>构建工具编排任务并汇总产物；编译、转译、打包、开发服务和部署分别由其他环节负责。</p>
  </div>;
}
