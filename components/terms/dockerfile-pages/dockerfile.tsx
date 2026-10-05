"use client";

import { CheckCircle, Cube, FileCode, Gear, Package, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./DockerfileConcept.module.css";

const labels = ["开始构建", "命中依赖缓存", "源码变了", "留下 runtime", "过滤 context"];

export function DockerfileLesson() {
  const scene = useScene(labels.length);
  const isStart = scene.step === 0;
  const isCache = scene.step === 1;
  const isSource = scene.step === 2;
  const isRuntime = scene.step === 3;
  const isContext = scene.step === 4;
  const StatusIcon = isContext || isRuntime ? CheckCircle : isSource ? WarningCircle : Gear;
  const status = isStart ? "先建立一条有顺序的构建轨迹，再问哪一层会变。" : isCache ? "依赖清单没变，安装层可以命中缓存；源码还没有进场。" : isSource ? "源码变化只让后面的层重跑，前面的依赖层继续复用。" : isRuntime ? "build 和 runtime 分开，运行镜像只带 dist 和必要文件。" : "context 先过滤，构建器少收一批无关输入，构建更快也更容易审查。";
  return <div ref={scene.ref} className={styles.dockerfileLab} role="region" aria-label="Dockerfile 指令顺序、缓存和多阶段构建工作台">
    <div className={styles.dockerfileHeader}><span>改一个输入，看哪一层需要重建</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.dockerfileControls} role="group" aria-label="选择 Dockerfile 构建阶段">
      <button type="button" className={styles.dockerfileControl} aria-pressed={isStart} onClick={() => scene.seek(0)}>基础构建</button>
      <button type="button" className={styles.dockerfileControl} aria-pressed={isCache} onClick={() => scene.seek(1)}>依赖缓存</button>
      <button type="button" className={styles.dockerfileControl} aria-pressed={isRuntime} onClick={() => scene.seek(3)}>runtime 阶段</button>
      <button type="button" className={styles.dockerfileControl} aria-pressed={isContext} onClick={() => scene.seek(4)}>过滤 context</button>
    </div>
    <div className={styles.dockerfileLabGrid}>
      <div className={styles.dockerfileLabPanel} data-active={isStart || isCache || isSource}>
        <div className={styles.dockerfileLabel}><FileCode size={16} aria-hidden="true" /><span>输入变化</span></div>
        <h3>{isSource ? "src/App.tsx 改了" : isContext ? ".dockerignore 生效" : "package-lock.json 未变"}</h3>
        <div className={styles.dockerfileLabRows}><div className={styles.dockerfileLabRow} data-active={isStart || isCache}><code>deps layer</code><strong>{isSource || isRuntime || isContext ? "cache hit" : "write"}</strong></div><div className={styles.dockerfileLabRow} data-active={isSource}><code>source layer</code><strong>{isSource ? "rebuild" : "wait"}</strong></div><div className={styles.dockerfileLabRow} data-active={isContext}><code>build context</code><strong>{isContext ? "filtered" : "全部"}</strong></div></div>
        <small>缓存看的是指令及其输入；不是“上次成功过”就永远有效。</small>
      </div>
      <div className={styles.dockerfileLabArrow} aria-hidden="true"><Package size={22} /></div>
      <div className={styles.dockerfileLabPanel} data-active={isRuntime || isContext}>
        <div className={styles.dockerfileLabel}><Cube size={16} aria-hidden="true" /><span>运行结果</span></div>
        <h3>{isRuntime ? "runtime · 只带产物" : isContext ? "更小的输入" : "等待构建"}</h3>
        <div className={styles.dockerfileLabRows}><div className={styles.dockerfileLabRow} data-active={isRuntime}><code>runtime image</code><strong>{isRuntime ? "dist only" : "—"}</strong></div><div className={styles.dockerfileLabRow} data-active={isContext}><code>context size</code><strong>{isContext ? "smaller" : "full"}</strong></div><div className={styles.dockerfileLabRow} data-active={isRuntime}><code>toolchain</code><strong>{isRuntime ? "discarded" : "included"}</strong></div></div>
        <small>多阶段和 context 过滤改变的是最终要带走的东西；镜像越小不代表构建步骤可以省略。</small>
      </div>
    </div>
    <div className={styles.dockerfileLabMetrics}><div><span>依赖层</span><strong>{isSource || isRuntime || isContext ? "命中" : "写入"}</strong></div><div><span>源码层</span><strong>{isSource ? "重建" : "等待"}</strong></div><div><span>运行镜像</span><strong>{isRuntime ? "精简" : "未完成"}</strong></div></div>
    <p className={styles.dockerfileLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
