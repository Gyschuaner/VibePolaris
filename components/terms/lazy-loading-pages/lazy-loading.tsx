"use client";

import { CheckCircle, CloudArrowDown, Eye, ImageSquare, SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./LazyLoadingConcept.module.css";

const labels = ["还在视口外", "接近边缘", "进入范围", "资源就绪", "请求失败"];

export function LazyLoadingLesson() {
  const scene = useScene(labels.length);
  const isFar = scene.step === 0;
  const isNear = scene.step === 1;
  const isLoading = scene.step === 2;
  const isReady = scene.step === 3;
  const isError = scene.step === 4;
  const StatusIcon = isError ? WarningCircle : isReady ? CheckCircle : isLoading ? CloudArrowDown : Eye;
  const status = isFar ? "元素还在视口外，先保留盒子，不抢网络。" : isNear ? "距离变近只是准备信号；阈值应留出真实的下载和解码时间。" : isLoading ? "请求已经发出，图片还没有 ready；占位和布局尺寸继续留着。" : isReady ? "资源就绪，替换占位但不移动后面的内容。" : "失败状态也要可理解、可重试，不能让一个空白洞留在页面里。";
  return <div ref={scene.ref} className={styles.lazyLoadingLab} role="region" aria-label="懒加载可见性、资源状态与布局稳定工作台">
    <div className={styles.lazyLoadingHeader}><span>改可见性阶段，看资源何时进入网络</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.lazyLoadingControls} role="group" aria-label="选择懒加载阶段">
      <button type="button" className={styles.lazyLoadingControl} aria-pressed={isFar} onClick={() => scene.seek(0)}>视口外</button>
      <button type="button" className={styles.lazyLoadingControl} aria-pressed={isLoading} onClick={() => scene.seek(2)}>进入并请求</button>
      <button type="button" className={styles.lazyLoadingControl} aria-pressed={isReady} onClick={() => scene.seek(3)}>加载完成</button>
      <button type="button" className={styles.lazyLoadingControl} aria-pressed={isError} onClick={() => scene.seek(4)}>模拟失败</button>
    </div>
    <div className={styles.lazyLoadingLabGrid}>
      <div className={styles.lazyLoadingLabPanel} data-active={isFar || isNear}>
        <div className={styles.lazyLoadingLabel}><Eye size={16} aria-hidden="true" /><span>观察条件</span></div>
        <h3>{isFar ? "1200px 外" : isNear ? "300px 内" : "已相交"}</h3>
        <div className={styles.lazyLoadingLabRows}><div className={styles.lazyLoadingLabRow} data-active={!isLoading && !isReady && !isError}><code>intersection</code><strong>{isFar ? "false" : isNear ? "near" : "true"}</strong></div><div className={styles.lazyLoadingLabRow} data-active={isNear}><code>rootMargin</code><strong>{isNear ? "准备" : "—"}</strong></div><div className={styles.lazyLoadingLabRow} data-active={isLoading || isReady || isError}><code>trigger</code><strong>{isLoading || isReady || isError ? "load" : "wait"}</strong></div></div>
        <small>观察器负责发现“靠近或相交”，并不替你完成图片请求后的状态处理。</small>
      </div>
      <div className={styles.lazyLoadingLabArrow} aria-hidden="true"><SpinnerGap size={22} /></div>
      <div className={styles.lazyLoadingLabPanel} data-active={isLoading || isReady || isError}>
        <div className={styles.lazyLoadingLabel}><ImageSquare size={16} aria-hidden="true" /><span>资源结果</span></div>
        <h3>{isFar || isNear ? "占位保留" : isLoading ? "loading" : isReady ? "ready" : "error · retry"}</h3>
        <div className={styles.lazyLoadingLabRows}><div className={styles.lazyLoadingLabRow} data-active={isLoading || isError}><code>network</code><strong>{isError ? "失败" : isLoading ? "请求中" : isFar || isNear ? "未请求" : "完成"}</strong></div><div className={styles.lazyLoadingLabRow} data-active={isReady}><code>decode</code><strong>{isReady ? "完成" : "等待"}</strong></div><div className={styles.lazyLoadingLabRow} data-active={isError}><code>fallback</code><strong>{isError ? "可重试" : "—"}</strong></div></div>
        <small>资源换入原位置，失败回到明确的替代路径；页面不应该因为延迟而丢掉语义。</small>
      </div>
    </div>
    <div className={styles.lazyLoadingLabMetrics}><div><span>请求时机</span><strong>{isFar || isNear ? "延后" : "已触发"}</strong></div><div><span>资源状态</span><strong>{isReady ? "ready" : isError ? "error" : isLoading ? "loading" : "deferred"}</strong></div><div><span>布局</span><strong>尺寸预留</strong></div></div>
    <p className={styles.lazyLoadingLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
