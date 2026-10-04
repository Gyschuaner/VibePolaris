"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, FileCode, Globe, HardDrive, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

const labels = ["页面运行", "保存 button.css", "开发服务发 reload", "整页重建"];

export function HotReloadLesson() {
  const scene = useScene(labels.length);
  const step = scene.step;
  const reloaded = step >= 3;
  const saved = step >= 1;
  const notified = step >= 2;

  return <div className={styles.hotReloadStory} ref={scene.ref} role="region" aria-label="热重载让保存后的页面整页重建演示">
    <div className={styles.hotReloadAction}>
      <button type="button" onClick={() => scene.seek(1)}><FileCode size={17} aria-hidden="true" />保存 button.css</button>
      <span>{reloaded ? "页面已重建，内存状态从头开始" : notified ? "通知已经发出，等待浏览器重建页面" : saved ? "文件已保存，等待开发服务通知" : "页面内存里还记着一次点击"}</span>
    </div>
    <div className={styles.hotReloadFlow}>
      <div className={`${styles.hotReloadNode} ${saved ? styles.hotReloadNodeDone : styles.hotReloadNodeActive}`}><FileCode size={21} aria-hidden="true" /><span>源码文件</span><code>button.css</code><small>{saved ? "已保存" : "未保存"}</small></div>
      <ArrowRight className={styles.hotReloadArrow} size={18} aria-hidden="true" />
      <div className={`${styles.hotReloadNode} ${reloaded ? styles.hotReloadNodeDone : notified ? styles.hotReloadNodeActive : styles.hotReloadNodeWaiting}`}><HardDrive size={21} aria-hidden="true" /><span>开发服务</span><code>{notified ? "reload()" : "监听保存"}</code><small>{reloaded ? "整页通知已完成" : notified ? "发出整页通知" : "等待变化"}</small></div>
      <ArrowRight className={styles.hotReloadArrow} size={18} aria-hidden="true" />
      <div className={`${styles.hotReloadBrowser} ${reloaded ? styles.hotReloadBrowserReloaded : ""}`}>
        <div className={styles.hotReloadBrowserBar}><Globe size={17} aria-hidden="true" /><span>localhost:5173</span><ArrowCounterClockwise size={15} aria-hidden="true" /></div>
        <div className={styles.hotReloadPage}><button className={reloaded ? styles.hotReloadButtonGreen : styles.hotReloadButtonBlue} type="button">保存样式</button><div className={styles.hotReloadCounter}><strong>{reloaded ? 0 : 7}</strong><span>页面内存计数</span></div></div>
      </div>
    </div>
    <div className={`${styles.hotReloadStatus} ${reloaded ? styles.hotReloadStatusWarn : ""}`} role="status" aria-live="polite">
      {reloaded ? <><Warning size={19} aria-hidden="true" /><p><strong>整页 reload 已完成。</strong>新 CSS 生效了，但页面运行时也重新初始化，计数从 7 回到 0。</p></> : step === 2 ? <><ArrowCounterClockwise size={19} aria-hidden="true" /><p><strong>通知已经抵达。</strong>浏览器接下来会重新请求并重建整页，暂时还没有执行新页面。</p></> : step === 1 ? <><ArrowRight size={19} aria-hidden="true" /><p><strong>保存事件被捕获。</strong>开发服务知道文件变了，但页面内存里的 7 还没有被清空。</p></> : <><CheckCircle size={19} aria-hidden="true" /><p><strong>页面正在运行。</strong>计数 7 属于当前浏览器内存，蓝色按钮样式来自 button.css。</p></>}
    </div>
    <div className={styles.hotReloadControls}><SceneControls scene={scene} labels={labels} /></div>
    <p className={styles.hotReloadBoundary}><strong>整页重载的边界。</strong>它和 HMR 的局部替换不同；登录信息、数据库记录等已经持久化到页面之外的状态，不会因为这次页面重建自动消失。</p>
  </div>;
}
