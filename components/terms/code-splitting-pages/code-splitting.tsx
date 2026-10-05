"use client";

import { Archive, CheckCircle, CloudArrowDown, Code, Gear, Package, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CodeSplittingConcept.module.css";

const labels = ["先看首页", "打开边界", "等待 chunk", "模块就绪", "对照过碎"];

export function CodeSplittingLesson() {
  const scene = useScene(labels.length);
  const current = scene.step;
  const isHome = current === 0;
  const isBoundary = current === 1;
  const isLoading = current === 2;
  const isReady = current === 3;
  const isFragmented = current === 4;
  const StatusIcon = isFragmented ? WarningCircle : isReady ? CheckCircle : isLoading ? CloudArrowDown : Gear;
  const status = isHome ? "首页先可用，编辑器 chunk 还没有理由进入网络瀑布。" : isBoundary ? "边界已经画出：动态 import 是一扇门，不是把首页内容拆成空壳。" : isLoading ? "进入编辑器后才请求 chunk；此刻要给用户一个真实的加载状态。" : isReady ? "chunk 到达并执行，编辑器挂上原来的入口；下一次可以从缓存开始。" : "过多小 chunk 会增加请求和调度；首包数字变小，不代表点击后的等待消失。";
  return <div ref={scene.ref} className={styles.codeSplittingLab} role="region" aria-label="代码分割入口、chunk 请求与缓存工作台">
    <div className={styles.codeSplittingHeader}><span>改一个加载边界，看网络什么时候动</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.codeSplittingControls} role="group" aria-label="选择代码分割状态">
      <button type="button" className={styles.codeSplittingControl} aria-pressed={isHome} onClick={() => scene.seek(0)}>首页入口</button>
      <button type="button" className={styles.codeSplittingControl} aria-pressed={isBoundary} onClick={() => scene.seek(1)}>动态边界</button>
      <button type="button" className={styles.codeSplittingControl} aria-pressed={isReady} onClick={() => scene.seek(3)}>编辑器已就绪</button>
    </div>
    <div className={styles.codeSplittingLabGrid}>
      <div className={styles.codeSplittingLabPanel} data-active={isHome || isBoundary}>
        <div className={styles.codeSplittingLabel}><Archive size={16} aria-hidden="true" /><span>当前入口</span></div>
        <h3>{isHome ? "首页" : isFragmented ? "碎片化编辑器" : "编辑器边界"}</h3>
        <div className={styles.codeSplittingLabRows}>
          <div className={styles.codeSplittingLabRow} data-active="true"><code>home.js</code><strong>{isFragmented ? "70 KB" : "82 KB"}</strong></div>
          <div className={styles.codeSplittingLabRow} data-active={!isHome}><code>editor.js</code><strong>{isHome || isBoundary ? "未请求" : isFragmented ? "20 × 24 KB" : "420 KB"}</strong></div>
        </div>
        <small>先画真实功能边界，再看 chunk 的大小和缓存是否值得。</small>
      </div>
      <div className={styles.codeSplittingLabArrow} aria-hidden="true"><Package size={22} /></div>
      <div className={styles.codeSplittingLabPanel} data-active={!isHome}>
        <div className={styles.codeSplittingLabel}><CloudArrowDown size={16} aria-hidden="true" /><span>请求结果</span></div>
        <h3>{isHome ? "没有额外请求" : isBoundary ? "等待用户动作" : isLoading ? "loading · 420 KB" : isReady ? "ready · 已执行" : "20 个小请求"}</h3>
        <div className={styles.codeSplittingLabRows}>
          <div className={styles.codeSplittingLabRow} data-active={!isHome && !isBoundary}><code>网络瀑布</code><strong>{isHome || isBoundary ? "1 个" : isFragmented ? "20 个" : "2 个"}</strong></div>
          <div className={styles.codeSplittingLabRow} data-active={isReady}><code>可交互</code><strong>{isReady ? "编辑器" : "等待"}</strong></div>
          <div className={styles.codeSplittingLabRow} data-active={isReady}><code>缓存</code><strong>{isReady ? "下次复用" : "尚未命中"}</strong></div>
        </div>
        <small>加载、执行和缓存是三个可观察状态；不要把“请求发出”当成“功能已经可用”。</small>
      </div>
    </div>
    <div className={styles.codeSplittingLabMetrics}><div><span>首包</span><strong>{isFragmented ? "70 KB" : "82 KB"}</strong></div><div><span>额外请求</span><strong>{isHome || isBoundary ? "0" : isFragmented ? "20" : "1"}</strong></div><div><span>编辑器状态</span><strong>{isReady ? "ready" : isLoading ? "loading" : "deferred"}</strong></div></div>
    <p className={styles.codeSplittingLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
