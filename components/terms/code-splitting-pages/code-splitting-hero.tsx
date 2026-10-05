"use client";

import { Archive, ArrowRight, CheckCircle, CloudArrowDown, Code, Gear, Package, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CodeSplittingConcept.module.css";

const frames = [
  { label: "整包先到", stage: "MONOLITH", home: "116 KB", editor: "420 KB", editorState: "首屏一起下载", requests: "1 个大包", activeEditor: true, activeRequest: true, note: "首页只是读一段文字，却先背上编辑器的重量；代码分割还没有发生。" },
  { label: "画出路由边界", stage: "BOUNDARY", home: "82 KB", editor: "未请求", editorState: "等待入口", requests: "1 个首包", activeEditor: false, activeRequest: false, note: "把编辑器放到动态入口后，首页只取自己要执行的代码。" },
  { label: "点击才发请求", stage: "REQUEST", home: "82 KB", editor: "420 KB", editorState: "loading", requests: "2 个请求", activeEditor: true, activeRequest: true, note: "用户真的打开编辑器，动态 import 才把对应 chunk 放进网络瀑布。" },
  { label: "模块执行完成", stage: "READY", home: "82 KB", editor: "420 KB", editorState: "ready", requests: "2 个请求", activeEditor: true, activeRequest: true, note: "chunk 到达并执行后，编辑器挂上页面；等待状态也属于交互的一部分。" },
  { label: "拆得太碎", stage: "FRAGMENT", home: "70 KB", editor: "20 × 24 KB", editorState: "等待许多小包", requests: "20 个请求", activeEditor: true, activeRequest: true, note: "首包变轻不等于体验必然变快；过细的边界会把等待换成更多请求和调度。" },
  { label: "再次打开命中缓存", stage: "CACHE", home: "82 KB", editor: "缓存命中", editorState: "无需重下", requests: "0 个网络请求", activeEditor: true, activeRequest: false, note: "合适的 chunk 边界还能复用缓存；用户第二次打开时，编辑器不必重新穿过网络。" },
] as const;

export function CodeSplittingHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = scene.step === 4 ? WarningCircle : scene.step === 5 ? CheckCircle : scene.step >= 2 ? CloudArrowDown : Gear;
  const style = { "--home-progress": current.activeRequest ? "76%" : "44%", "--editor-progress": current.activeEditor ? "68%" : "0%" } as CSSProperties;
  return <figure ref={scene.ref} className={styles.codeSplittingHero} data-step={scene.step} aria-label="代码分割如何把代码推迟到真正的功能边界">
    <div className={styles.codeSplittingHeader}><span>把下载时机推到功能边界</span><strong>{current.stage} · {current.requests}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.codeSplittingBoard}>
      <div className={styles.codeSplittingPanel} data-active={scene.step !== 4}>
        <div className={styles.codeSplittingLabel}><Archive size={17} aria-hidden="true" /><span>入口与边界</span></div>
        <h3>首页先拿什么</h3>
        <div className={styles.codeSplittingChunks}>
          <div className={styles.codeSplittingChunk} data-active="true"><i /><code>home.js</code><span>{current.home}</span></div>
          <div className={styles.codeSplittingChunk} data-active={current.activeEditor}><i /><code>editor.js</code><span>{current.editor}</span></div>
        </div>
        <small>入口边界决定哪个 chunk 现在需要，哪个 chunk 等到用户真正走到那里。</small>
      </div>
      <div className={styles.codeSplittingArrow} aria-hidden="true"><ArrowRight size={21} /><span>请求</span></div>
      <div className={styles.codeSplittingPanel} data-active={current.activeRequest || scene.step === 5}>
        <div className={styles.codeSplittingLabel}><Package size={17} aria-hidden="true" /><span>网络与执行</span></div>
        <h3>{current.editorState}</h3>
        <div className={styles.codeSplittingWaterfall} style={style}>
          <div className={styles.codeSplittingRequest} data-active="true"><span>home.js</span><b style={{ transform: `scaleX(var(--home-progress))` }} /><strong>done</strong></div>
          <div className={styles.codeSplittingRequest} data-active={current.activeRequest}><span>editor.js</span><b style={{ transform: `scaleX(var(--editor-progress))` }} /><strong>{current.editorState}</strong></div>
          <div className={styles.codeSplittingRequest} data-active={scene.step === 4}><span>tiny ×20</span><b style={{ transform: scene.step === 4 ? "scaleX(.94)" : "scaleX(0)" }} /><strong>{scene.step === 4 ? "overhead" : "—"}</strong></div>
        </div>
        <small>下载和执行不是同一件事：动态入口还需要 loading、失败和缓存命中的可见结果。</small>
      </div>
    </div>
    <div className={styles.codeSplittingNote} role="status"><ResultIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.codeSplittingMetrics}><div><span>首包</span><strong>{current.home}</strong></div><div><span>编辑器</span><strong>{current.editorState}</strong></div><div><span>请求</span><strong>{current.requests}</strong></div></div>
    <div className={styles.codeSplittingResult}><Code size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>代码分割改变的是“什么时候下载和执行”，不是“代码是否存在”：边界落在真实功能上，用户才会在需要时得到恰到好处的一包。</figcaption>
  </figure>;
}
