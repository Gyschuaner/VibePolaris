"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, CheckCircle, FileCode, Globe, HardDrive, Network, Warning, Wrench } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type DevCase = "update" | "error";
type DevNode = "file" | "watcher" | "server" | "socket" | "browser";
type DevStatus = "waiting" | "active" | "done" | "muted" | "failed";

const cases: Record<DevCase, string> = { update: "样式更新", error: "源码报错" };
const labels = ["打开本地页", "保存文件", "服务器处理", "反馈回到浏览器"];

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
  const scene = useScene(labels.length);
  const stage = scene.step;
  const isError = scenario === "error";

  const setCase = (next: DevCase) => { setScenario(next); scene.seek(0); };

  function status(id: DevNode): DevStatus {
    if (id === "file") return stage === 0 ? "active" : "done";
    if (id === "watcher") return stage === 0 ? "waiting" : stage === 1 ? "active" : "done";
    if (id === "server") {
      if (isError && stage >= 2) return "failed";
      return stage < 2 ? (stage === 0 ? "active" : "muted") : stage === 2 ? "active" : "done";
    }
    if (id === "socket") {
      if (stage === 0) return "active";
      if (stage < 2) return "muted";
      return stage === 2 ? "active" : "done";
    }
    if (isError && stage >= 2) return stage === 2 ? "active" : "done";
    return stage === 0 ? "active" : stage < 3 ? "muted" : "active";
  }

  function detail(id: DevNode) {
    if (id === "file") return stage === 0 ? "button.css · 未保存" : "button.css · 已保存";
    if (id === "watcher") return stage === 0 ? "等待下一次保存" : stage === 1 ? "change 1" : "已捕获 change 1";
    if (id === "server") {
      if (stage === 0) return "localhost:5173 · ready";
      if (stage === 1) return "收到文件变化";
      if (isError) return stage === 2 ? "SyntaxError · 1:8" : "旧模块保留";
      return stage === 2 ? "处理 button.css" : "模块可交付";
    }
    if (id === "socket") {
      if (stage === 0) return "WebSocket · connected";
      if (stage < 2) return "WebSocket · 等待消息";
      return isError ? "error overlay · 1:8" : "update:button.css";
    }
    if (stage === 0) return "旧页面已打开";
    if (stage === 1) return "旧页面仍在显示";
    if (isError) return stage === 2 ? "旧页面 + 错误覆盖层" : "旧页面保留";
    return stage === 2 ? "等待更新" : "样式已更新";
  }

  function stateLabel(id: DevNode) {
    const current = status(id);
    if (id === "file" && stage === 0) return "等待保存";
    if (id === "server" && stage === 0) return "已就绪";
    if (id === "socket" && stage === 0) return "已连接";
    if (id === "browser" && stage === 0) return "已打开";
    if (id === "browser" && !isError && stage === 3) return "已更新";
    if (id === "browser" && isError && stage >= 2) return stage === 2 ? "显示诊断" : "保留旧页";
    if (id === "socket" && isError && stage >= 2) return stage === 2 ? "回传诊断" : "已回传诊断";
    if (current === "failed") return "处理失败";
    if (current === "active") return "正在处理";
    if (current === "done") return "已完成";
    if (current === "muted") return "尚未参与";
    return "等待";
  }

  const node = (id: DevNode, icon: ReactNode, label: string) => <div className={`${styles.devServerNode} ${statusClass(status(id))}`}>
    <div className={styles.devServerNodeTop}>{icon}<span>{label}</span></div>
    <strong>{detail(id)}</strong>
    <small>{stateLabel(id)}</small>
  </div>;

  return <div className={styles.devServerStory} ref={scene.ref} role="region" aria-label="开发服务器把本地文件变化送回浏览器的演示">
    <div className={styles.devServerChoices} role="group" aria-label="选择开发服务器结果">
      {(Object.keys(cases) as DevCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setCase(key)}>{cases[key]}</button>)}
    </div>
    <div className={styles.devServerPipeline} style={{ "--dev-step": stage } as CSSProperties}>
      <div className={styles.devServerPulse} aria-hidden="true"><span /></div>
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
    <div className={styles.devServerLegend}><span><Network size={15} aria-hidden="true" />WebSocket：保持更新通道</span><span><Globe size={15} aria-hidden="true" />错误时保留旧页面</span></div>
    <div className={styles.devServerStatus} aria-live="polite">
      {isError && stage >= 2 ? <><Warning size={19} aria-hidden="true" /><p><strong>错误覆盖层回来了。</strong> `button.css:1:8` 被送回页面显示，旧模块没有被执行。</p></> : stage === 3 ? <><CheckCircle size={19} aria-hidden="true" /><p><strong>样式更新抵达浏览器。</strong> 这是开发反馈，不代表生产构建已经完成。</p></> : <><Network size={19} aria-hidden="true" /><p>{stage === 0 ? "本地页已打开，更新通道正在等下一次保存。" : stage === 1 ? "监听器捕获了保存事件，浏览器还没有收到新模块。" : "服务器正在处理受影响的文件，结果还在路上。"}</p></>}
    </div>
    <div className={styles.devServerControls}><SceneControls scene={scene} labels={labels} /></div>
    <p className={styles.devServerBoundary}><strong>本地反馈有自己的边界。</strong>开发服务器负责按请求提供资源、监听变化和传回诊断；构建产物、缓存、鉴权和公网容量还要由生产链路负责。</p>
  </div>;
}
