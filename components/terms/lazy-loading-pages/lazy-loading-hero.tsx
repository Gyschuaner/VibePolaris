"use client";

import { ArrowRight, CheckCircle, CloudArrowDown, Eye, ImageSquare, SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./LazyLoadingConcept.module.css";

const frames = [
  { label: "先留一个盒子", stage: "FAR", distance: "1200px", state: "placeholder", request: "未请求", note: "内容还在视口下面，先保留尺寸，浏览器不必为看不见的图片付网络成本。" },
  { label: "接近视口边缘", stage: "NEAR", distance: "300px", state: "placeholder", request: "等待阈值", note: "元素接近观察范围，IntersectionObserver 可以开始准备；距离是策略，不是用户动作本身。" },
  { label: "进入观察范围", stage: "INTERSECT", distance: "0px", state: "loading", request: "GET image", note: "元素与观察区域相交，加载条件成立，浏览器才把图片请求放进瀑布。" },
  { label: "资源解码完成", stage: "READY", distance: "0px", state: "ready", request: "200 · decoded", note: "图片到达并解码后替换占位；盒子的尺寸先前已经保住，页面不会突然跳动。" },
  { label: "请求失败也要有路", stage: "ERROR", distance: "0px", state: "error", request: "retry / fallback", note: "延迟加载不是延迟处理错误；失败、重试和替代内容必须仍然占住同一个位置。" },
  { label: "下一张继续等待", stage: "NEXT", distance: "860px", state: "placeholder", request: "未请求", note: "一张资源就绪不代表整页全部加载；其他内容仍可沿自己的可见性边界前进。" },
] as const;

export function LazyLoadingHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.state === "error" ? WarningCircle : current.state === "ready" ? CheckCircle : current.state === "loading" ? CloudArrowDown : Eye;
  const style = { "--distance-progress": current.distance === "0px" ? "96%" : current.distance === "300px" ? "62%" : "18%" } as CSSProperties;
  return <figure ref={scene.ref} className={styles.lazyLoadingHero} data-step={scene.step} aria-label="懒加载如何从可见性触发资源请求并处理结果">
    <div className={styles.lazyLoadingHeader}><span>先保住位置，再等资源靠近</span><strong>{current.stage} · {current.request}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.lazyLoadingBoard}>
      <div className={styles.lazyLoadingPanel} data-active={current.state !== "ready" || scene.step === 5}>
        <div className={styles.lazyLoadingLabel}><Eye size={17} aria-hidden="true" /><span>可见性条件</span></div>
        <h3>{current.distance} 到视口</h3>
        <div className={styles.lazyLoadingViewport} style={style}>
          <div className={styles.lazyLoadingViewportLine}><span>距离</span><b style={{ width: "var(--distance-progress)" }} /></div>
          <div className={styles.lazyLoadingViewportLine} data-active={current.distance === "0px"}><span>相交</span><b style={{ width: current.distance === "0px" ? "96%" : "0%" }} /></div>
        </div>
        <div className={styles.lazyLoadingCard} data-state={current.state}><div className={styles.lazyLoadingCardVisual} /><div><strong>{current.state === "placeholder" ? "保留占位" : current.state === "loading" ? "正在加载" : current.state === "ready" ? "图片已到达" : "显示替代内容"}</strong><span>{current.state === "error" ? "可重试" : "盒子尺寸不变"}</span></div></div>
        <small>先把宽高和阅读位置留住，再让可见性决定何时取资源。</small>
      </div>
      <div className={styles.lazyLoadingArrow} aria-hidden="true"><ArrowRight size={21} /><span>触发</span></div>
      <div className={styles.lazyLoadingPanel} data-active={current.state === "loading" || current.state === "ready" || current.state === "error"}>
        <div className={styles.lazyLoadingLabel}><ImageSquare size={17} aria-hidden="true" /><span>资源生命周期</span></div>
        <h3>{current.state === "placeholder" ? "还没请求" : current.state === "loading" ? "请求与解码" : current.state === "ready" ? "替换占位" : "失败分支"}</h3>
        <div className={styles.lazyLoadingLabRows}><div className={styles.lazyLoadingLabRow} data-active={current.state !== "placeholder"}><code>network</code><strong>{current.request}</strong></div><div className={styles.lazyLoadingLabRow} data-active={current.state === "ready"}><code>layout</code><strong>{current.state === "ready" ? "稳定" : "预留"}</strong></div><div className={styles.lazyLoadingLabRow} data-active={current.state === "error"}><code>failure</code><strong>{current.state === "error" ? "retry" : "—"}</strong></div></div>
        <small>请求、解码、替换和失败是不同状态；“进入视口”只是把第一扇门打开。</small>
      </div>
    </div>
    <div className={styles.lazyLoadingNote} role="status"><ResultIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.lazyLoadingMetrics}><div><span>距视口</span><strong>{current.distance}</strong></div><div><span>请求</span><strong>{current.request}</strong></div><div><span>布局</span><strong>{current.state === "ready" ? "稳定" : "预留"}</strong></div></div>
    <div className={styles.lazyLoadingResult}><SpinnerGap size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>懒加载把“什么时候值得取”交给可见性或使用时机；占位、尺寸、失败和重试让这段等待仍然是完整的界面。</figcaption>
  </figure>;
}
