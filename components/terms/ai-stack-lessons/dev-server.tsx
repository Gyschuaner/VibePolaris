"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle, FileCode, Globe, HardDrive, Network, Warning, Wrench } from "@phosphor-icons/react";
import styles from "../ToolchainConcepts.module.css";

type DevCase = "update" | "error";
type DevStage = 0 | 1 | 2 | 3;
type DevStatus = "waiting" | "active" | "done" | "muted" | "failed";

const cases: Record<DevCase, string> = { update: "文件更新", error: "源码报错" };

function statusClass(status: DevStatus) {
  return {
    waiting: styles.devServerNodeWaiting,
    active: styles.devServerNodeActive,
    done: styles.devServerNodeDone,
    muted: styles.devServerNodeMuted,
    failed: styles.devServerNodeFailed,
  }[status];
}

export function DevServerLesson() {
  const [scenario, setScenario] = useState<DevCase>("update");
  const [stage, setStage] = useState<DevStage>(0);
  const setCase = (next: DevCase) => { setScenario(next); setStage(0); };
  const reset = () => { setScenario("update"); setStage(0); };
  const advance = () => setStage(value => Math.min(value + 1, 3) as DevStage);
  const status = (id: "file" | "watcher" | "server" | "socket" | "browser"): DevStatus => {
    if (id === "file") return stage === 0 ? "waiting" : "done";
    if (id === "watcher") return stage === 0 ? "muted" : stage === 1 ? "active" : "done";
    if (id === "server") return scenario === "error" && stage >= 3 ? "failed" : stage === 0 ? "active" : stage === 1 ? "done" : stage === 2 ? "active" : "done";
    if (id === "socket") return scenario === "error" && stage >= 3 ? "failed" : stage === 0 ? "active" : stage === 1 ? "muted" : stage === 2 ? "active" : "done";
    if (scenario === "error" && stage >= 3) return "failed";
    return stage === 0 ? "active" : stage < 3 ? "muted" : "active";
  };
  const detail = (id: "file" | "watcher" | "server" | "socket" | "browser") => {
    if (id === "file") return stage === 0 ? "button.css" : "已保存";
    if (id === "watcher") return stage === 0 ? "等待变化" : "change 1";
    if (id === "server") return stage < 2 ? "localhost:5173" : scenario === "error" && stage >= 3 ? "诊断已记录" : "处理 button.css";
    if (id === "socket") return stage < 2 ? "WebSocket" : scenario === "error" && stage >= 3 ? "update 被拒绝" : "update:button.css";
    return scenario === "error" && stage >= 3 ? "SyntaxError · 1:8" : stage < 3 ? "已打开 localhost" : "updated";
  };
  const stateLabel = (id: "file" | "watcher" | "server" | "socket" | "browser") => { const current = status(id); if (current === "failed") return "失败"; if (stage === 0 && (id === "server" || id === "socket" || id === "browser")) return "就绪"; if (stage === 3 && id === "browser" && scenario === "update") return "完成"; return current === "active" ? "处理中" : current === "done" ? "完成" : current === "muted" ? "未参与" : "等待"; };
  const node = (id: "file" | "watcher" | "server" | "socket" | "browser", icon: React.ReactNode, label: string) => <div className={`${styles.devServerNode} ${statusClass(status(id))}`}><div className={styles.devServerNodeTop}>{icon}<span>{label}</span></div><strong>{detail(id)}</strong><small>{stateLabel(id)}</small></div>;

  return <div className={styles.devServerLab} data-kind="dev-server" role="region" aria-label="开发服务器本地反馈管线演示">
    <div className={styles.labToolbar} role="group" aria-label="选择开发服务器场景">
      {(Object.keys(cases) as DevCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setCase(key)}>{cases[key]}</button>)}
      <button type="button" className={styles.resetButton} onClick={reset}><ArrowCounterClockwise size={16} aria-hidden="true" />重置</button>
    </div>
    <div className={styles.devServerPipeline}>
      {node("file", <FileCode size={19} aria-hidden="true" />, "源码文件")}
      <ArrowRight className={styles.devServerArrow} size={17} aria-hidden="true" />
      {node("watcher", <Wrench size={19} aria-hidden="true" />, "文件监听")}
      <ArrowRight className={styles.devServerArrow} size={17} aria-hidden="true" />
      {node("server", <HardDrive size={19} aria-hidden="true" />, "开发服务器")}
      <ArrowRight className={styles.devServerArrow} size={17} aria-hidden="true" />
      {node("socket", <Network size={19} aria-hidden="true" />, "更新连接")}
      <ArrowRight className={styles.devServerArrow} size={17} aria-hidden="true" />
      {node("browser", <Globe size={19} aria-hidden="true" />, "浏览器")}
    </div>
    <div className={styles.devServerLegend}><span><Network size={15} aria-hidden="true" />只发送受影响文件</span><span><Globe size={15} aria-hidden="true" />本地页面收到反馈</span></div>
    <button type="button" className={styles.primaryAction} onClick={advance}>{stage === 0 ? "保存 button.css" : stage === 1 ? "处理变更" : stage === 2 ? "发送更新" : "已到达浏览器"}</button>
    {scenario === "error" && stage >= 3 ? <div className={styles.devServerResultFail}><Warning size={18} aria-hidden="true" /><span>源码处理失败，终端和页面显示 `button.css:1:8`；开发服务器没有把坏模块当成成功更新。</span></div> : stage >= 3 ? <div className={styles.devServerResult}><CheckCircle size={18} aria-hidden="true" /><span>浏览器收到本地更新；这只是开发反馈，不代表生产构建已经完成。</span></div> : null}
    <p className={styles.labResult} role="status">{stage === 0 ? "浏览器已打开 localhost，文件监听还在等待下一次保存。" : stage === 1 ? "保存只产生一个文件变化事件，浏览器此刻还没有收到更新。" : stage === 2 ? "开发服务器处理受影响的文件，再通过更新连接发送结果。" : scenario === "error" ? "错误停在开发反馈链路；修复源码后才会产生下一次有效更新。" : "更新抵达浏览器；生产部署、缓存和公网安全仍在这条管线之外。"}</p>
    <p className={styles.labBoundary}><strong>边界</strong>：开发服务器提供本机反馈和代理入口；它不是生产托管，也不替代完整构建和部署配置。</p>
  </div>;
}
