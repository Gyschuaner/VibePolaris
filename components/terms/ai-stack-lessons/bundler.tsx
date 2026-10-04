"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, CheckCircle, Code, DownloadSimple, Package, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type BundleCase = "dynamic" | "failure";
type BundleStatus = "waiting" | "active" | "done" | "muted" | "failed";

const cases: Record<BundleCase, string> = { dynamic: "动态导入", failure: "按需块 404" };
const labels: Record<BundleCase, string[]> = {
  dynamic: ["沿入口建图", "生成主包与按需块", "请求按需块", "改成静态导入"],
  failure: ["沿入口建图", "生成主包与按需块", "请求按需块", "看清失败边界"],
};

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
  const scene = useScene(labels[scenario].length);
  const stage = scene.step;
  const isStatic = scenario === "dynamic" && stage >= 3;
  const isFailure = scenario === "failure" && stage >= 3;

  function outputState(kind: "main" | "lazy"): { status: BundleStatus; detail: string } {
    if (scenario === "failure") {
      if (kind === "main") return stage === 0 ? { status: "waiting", detail: "等待入口" } : { status: "done", detail: "入口 + 5 · 可用" };
      if (stage < 2) return { status: "waiting", detail: "等待按需请求" };
      if (stage === 2) return { status: "active", detail: "请求中" };
      return { status: "failed", detail: "lazy.js · 404" };
    }
    if (kind === "main") {
      if (isStatic) return { status: "done", detail: "入口 + 6" };
      return stage === 0 ? { status: "waiting", detail: "等待静态依赖" } : { status: "done", detail: "入口 + 5" };
    }
    if (isStatic) return { status: "muted", detail: "0 · 已并入主包" };
    if (stage === 0) return { status: "waiting", detail: "等待生成" };
    if (stage === 1) return { status: "done", detail: "已生成 · 1 个按需模块" };
    return { status: "done", detail: "lazy.js · 已加载" };
  }

  function inputState(kind: "entry" | "static" | "dynamic"): BundleStatus {
    if (kind === "entry") return stage === 0 ? "active" : "done";
    if (kind === "static") return stage === 0 ? "active" : "done";
    if (isStatic) return "done";
    if (scenario === "failure" && stage === 2) return "active";
    return stage === 0 ? "muted" : "done";
  }

  function setCase(next: BundleCase) { setScenario(next); scene.seek(0); }

  const node = (status: BundleStatus, icon: ReactNode, label: string, detail: string) => <div className={`${styles.bundlerNode} ${statusClass(status)}`}>
    <div className={styles.bundlerNodeTop}>{icon}<span>{label}</span></div>
    <strong>{detail}</strong>
  </div>;

  const main = outputState("main");
  const lazy = outputState("lazy");
  const statusText = isFailure
    ? "主包已经生成，运行时请求 lazy.js 返回 404；要查的是部署路径或服务器路由。"
    : scenario === "failure" && stage === 2
      ? "浏览器刚发出 lazy.js 请求，响应还没有回来；下一步才会显示它落在哪里。"
    : isStatic
      ? "动态导入改成静态导入，1 个模块已经并入主包，按需块不再单独请求。"
      : stage === 0
        ? "先从 src/main.js 出发，确认哪些边是静态导入，哪些边要留到运行时。"
        : stage === 1
        ? "入口和 5 个静态依赖进入主包，按需块也已生成，但它还没有随首屏加载。"
          : "用户打开按需功能，浏览器此时请求并加载 lazy.js。";

  return <div className={styles.bundlerStory} ref={scene.ref} role="region" aria-label="打包器依赖图和代码分割演示">
    <div className={styles.bundlerChoices} role="group" aria-label="选择打包场景">
      {(Object.keys(cases) as BundleCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setCase(key)}>{cases[key]}</button>)}
    </div>
    <div className={styles.bundlerDiagram} style={{ "--bundler-step": stage } as CSSProperties}>
      <div className={styles.bundlerPacket} aria-hidden="true"><span /></div>
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
        <div className={styles.bundlerInnerArrow}><ArrowRight size={16} aria-hidden="true" /><span>{isFailure ? "主包仍可用" : scenario === "failure" && stage === 2 ? "等待响应" : "按需拆分"}</span></div>
        {node(lazy.status, isFailure ? <Warning size={19} aria-hidden="true" /> : <DownloadSimple size={19} aria-hidden="true" />, "按需块", `dist/lazy.js · ${lazy.detail}`)}
      </div>
    </div>
    <div className={styles.bundlerLegend}><span><ArrowRight size={15} aria-hidden="true" />入口沿依赖边建图</span><span><DownloadSimple size={15} aria-hidden="true" />动态导入决定加载边界</span></div>
    <div className={`${styles.bundlerStatus} ${isFailure ? styles.bundlerStatusFail : ""}`} aria-live="polite">
      {isFailure ? <Warning size={19} aria-hidden="true" /> : isStatic ? <CheckCircle size={19} aria-hidden="true" /> : <DownloadSimple size={19} aria-hidden="true" />}<p>{statusText}</p>
    </div>
    <div className={styles.bundlerControls}><SceneControls scene={scene} labels={labels[scenario]} /></div>
    <p className={styles.bundlerBoundary}><strong>文件生成和文件可达是两件事。</strong>打包器整理模块图并划分代码边界；转译、类型检查和浏览器能否拿到按需块，仍由其他环节负责。</p>
  </div>;
}
