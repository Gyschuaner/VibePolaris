"use client";

import { ArrowRight, Browser, CheckCircle, Clock, Database, Gear, Package, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RenderingConcept.module.css";

const frames = [
  { label: "请求带上下文", tone: "request", rows: [["浏览器请求", "路径 + 会话"], ["服务端数据", "等待"], ["HTML 流", "尚未发送"]], result: "收到请求", note: "服务器知道当前路径、用户和请求上下文，开始准备页面。" },
  { label: "慢数据拖住", tone: "data", rows: [["浏览器请求", "已到达"], ["服务端数据", "1200 ms"], ["HTML 流", "等待"]], result: "未出首字节", note: "完整页面依赖慢数据时，服务端要先等它，响应也会后移。" },
  { label: "外壳先流出", tone: "stream", rows: [["浏览器请求", "已到达"], ["服务端数据", "慢内容"], ["HTML 流", "外壳已可见"]], result: "先看外壳", note: "流式边界可以先送出可用外壳，再把慢内容补进来。" },
  { label: "客户端接管", tone: "hydrate", rows: [["浏览器请求", "已完成"], ["服务端数据", "已填充"], ["HTML 流", "节点可复用"]], result: "可交互", note: "HTML 已经可见，客户端代码随后完成水合和事件连接。" },
  { label: "两条时间线", tone: "ready", rows: [["内容可见", "HTML 到达"], ["服务端数据", "按依赖计时"], ["可交互", "hydrate 完成"]], result: "分开测量", note: "SSR 让内容和交互可以在不同时间点到达，不能只看一个总时长。" },
];

export function SsrHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.tone === "data" ? WarningCircle : current.tone === "ready" || current.tone === "hydrate" ? CheckCircle : Clock;
  return <figure ref={scene.ref} className={styles.hero} data-scene={current.tone} aria-label="服务端渲染从请求到水合的时间线">
    <div className={styles.heroTop}><span>服务端先做一段，浏览器再接手</span><strong>SSR · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.renderStage}><div className={styles.renderStageHeader}><span>一次页面请求</span><span>server → browser</span></div><div className={styles.renderRows}>{current.rows.map(([label, value], index) => { const Icon = label === "浏览器请求" ? Browser : label === "服务端数据" ? Database : Package; return <div className={styles.renderRow} data-active={index <= scene.step ? "true" : "false"} key={label}><Icon size={13} aria-hidden="true" /><span>{label}</span><small>{value}</small></div>; })}</div></div>
      <div className={styles.renderArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.heroResult}><ResultIcon size={17} aria-hidden="true" /><span>当前结果</span><strong>{current.result}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Gear size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>SSR 把数据和 HTML 的主要工作放在服务器请求阶段；它改善的是到达路径，不是自动删除客户端代码。</figcaption>
  </figure>;
}
