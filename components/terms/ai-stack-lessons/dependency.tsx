"use client";

import { ArrowRight, CheckCircle, FileText, LinkSimple, LockKey, Package, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

const labels = ["只看根节点", "加入 A", "展开 B", "删除 A"];

type NodeKey = "app" | "a" | "b";
type NodeState = "active" | "done" | "muted";

export function DependencyLesson() {
  const scene = useScene(labels.length);
  const step = scene.step;
  const removed = step === 3;
  const states: Record<NodeKey, NodeState> = {
    app: step === 2 ? "done" : "active",
    a: step === 0 || removed ? "muted" : "active",
    b: step < 2 || removed ? "muted" : "active",
  };
  const report = step === 0 ? "0" : step === 1 ? "直接 1" : step === 2 ? "直接 1 · 传递 1" : "2 → 0";
  const lock = step === 0 ? "空" : step === 1 ? "A@1.4" : step === 2 ? "A@1.4 · B@2.1" : "重新解析";

  function node(key: NodeKey, icon: React.ReactNode, label: string, detail: string) {
    return <div className={`${styles.dependencyNode} ${styles[`dependencyNode${states[key][0].toUpperCase()}${states[key].slice(1)}`]}`}>
      <div className={styles.dependencyNodeTop}>{icon}<span>{label}</span></div>
      <strong>{detail}</strong>
      <small>{key === "a" ? (step >= 1 && !removed ? "直接依赖" : "等待应用声明") : key === "b" ? (step >= 2 && !removed ? "传递依赖" : "等待 A 的声明") : "根节点 · 应用清单"}</small>
    </div>;
  }

  const message = step === 0
    ? <><LinkSimple size={18} aria-hidden="true" /><span>先从应用清单出发；没有一条外部边，报告里只有 0 个可达包。</span></>
    : step === 1
      ? <><Package size={18} aria-hidden="true" /><span>应用声明 A，安装工具先得到一个直接依赖，并按约束记录 A@1.4。</span></>
      : step === 2
        ? <><CheckCircle size={18} aria-hidden="true" /><span>A 自己还声明了 B，所以 B 沿第二条边进入安装树；它是传递依赖。</span></>
        : <><Warning size={18} aria-hidden="true" /><span>应用到 A 的边被删掉了。没有别的路径时，B 对应用不再可达；磁盘里的旧目录是否马上清掉，还要看工具的清理动作。</span></>;

  return <div className={styles.dependencyStory} ref={scene.ref} role="region" aria-label="依赖图从直接依赖展开到传递依赖的演示">
    <div className={styles.dependencyGraph}>
      <div className={styles.dependencyPath}>
        {node("app", <Package size={20} aria-hidden="true" />, "应用", "package.json")}
        <div className={`${styles.dependencyEdge} ${step >= 1 && !removed ? styles.dependencyEdgeActive : removed ? styles.dependencyEdgeRemoved : ""}`}><ArrowRight size={18} aria-hidden="true" /><small>直接依赖</small></div>
        {node("a", <Package size={20} aria-hidden="true" />, "包 A", "A@1.4")}
        <div className={`${styles.dependencyEdge} ${step >= 2 && !removed ? styles.dependencyEdgeActive : removed ? styles.dependencyEdgeRemoved : ""}`}><ArrowRight size={18} aria-hidden="true" /><small>传递依赖</small></div>
        {node("b", <Package size={20} aria-hidden="true" />, "包 B", "B@2.1")}
      </div>
      <div className={styles.dependencyOutputs}>
        <div className={`${styles.dependencyOutput} ${styles.dependencyOutputActive}`}><FileText size={19} aria-hidden="true" /><div><span>依赖报告</span><strong>{report}</strong><small>统计从应用可达的包</small></div><div className={styles.dependencyOutputLink}><ArrowRight size={15} aria-hidden="true" />应用 → 报告</div></div>
        <div className={`${styles.dependencyOutput} ${styles.dependencyOutputActive}`}><LockKey size={19} aria-hidden="true" /><div><span>锁文件</span><strong>{lock}</strong><small>{removed ? "等待下一次安装写回" : "这次解析的具体版本"}</small></div><div className={styles.dependencyOutputLink}><ArrowRight size={15} aria-hidden="true" />应用 → 记录</div></div>
      </div>
    </div>
    <div className={`${styles.dependencyStatus} ${removed ? styles.dependencyStatusWarn : ""}`} role="status" aria-live="polite">{message}</div>
    <div className={styles.dependencyControls}><SceneControls scene={scene} labels={labels} /></div>
    <p className={styles.dependencyBoundary}><strong>可达不等于一定会被运行时使用。</strong>开发、可选、运行依赖的用途不同；删掉一条边后，是否真的消失要看图上有没有别的路径，以及包管理器如何重算和清理。</p>
  </div>;
}
