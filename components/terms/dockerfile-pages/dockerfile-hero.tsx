"use client";

import { Archive, ArrowRight, CheckCircle, Cube, FileCode, Gear, Package, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./DockerfileConcept.module.css";

const frames = [
  { label: "从基础镜像开始", stage: "FROM", command: "FROM node:22", active: 0, layers: ["base · 120 MB"], result: "运行时基座", note: "Dockerfile 是一串有顺序的构建指令；第一行先确定后面的命令站在哪个基座上。" },
  { label: "先放依赖清单", stage: "CACHE", command: "COPY package*.json ./", active: 1, layers: ["base · 120 MB", "manifest · 4 KB"], result: "可复用依赖层", note: "把变化慢的清单放在安装前，源码变动时这层仍有机会命中缓存。" },
  { label: "安装层被缓存", stage: "RUN", command: "RUN npm ci", active: 2, layers: ["base · 120 MB", "manifest · 4 KB", "deps · 180 MB"], result: "依赖已安装", note: "昂贵的安装步骤形成自己的层；只要它的输入没变，就不必每次重做。" },
  { label: "源码变化只重建后面", stage: "COPY", command: "COPY . .", active: 3, layers: ["base · 120 MB", "manifest · 4 KB", "deps · cache hit", "source · changed"], result: "构建层重跑", note: "源码进入更后面的指令，改一个组件不会把前面的依赖层一起推倒。" },
  { label: "多阶段留下产物", stage: "STAGE", command: "COPY --from=build /app/dist /srv", active: 4, layers: ["build · discarded", "runtime · dist only"], result: "更小的运行时", note: "多阶段构建把编译工具留在 build 阶段，运行时只复制真正要带走的产物。" },
  { label: "上下文也有边界", stage: "CONTEXT", command: ".dockerignore", active: 5, layers: ["source · filtered", "context · smaller"], result: "少传无用文件", note: "发送给构建器的 context 也会影响速度和风险；node_modules、日志等不该随手打包进去。" },
] as const;

export function DockerfileHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = scene.step === 4 ? CheckCircle : scene.step === 5 ? Cube : scene.step === 3 ? WarningCircle : Gear;
  const style = { "--layer-progress": `${Math.min(94, 25 + current.active * 14)}%` } as CSSProperties;
  return <figure ref={scene.ref} className={styles.dockerfileHero} data-step={scene.step} aria-label="Dockerfile 指令如何形成可缓存的镜像层">
    <div className={styles.dockerfileHeader}><span>每一行指令，都会留下构建痕迹</span><strong>{current.stage} · step {scene.step + 1}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.dockerfileBoard}>
      <div className={styles.dockerfilePanel} data-active={scene.step <= 3 || scene.step === 5}>
        <div className={styles.dockerfileLabel}><FileCode size={17} aria-hidden="true" /><span>Dockerfile 指令</span></div>
        <h3>{current.command}</h3>
        <div className={styles.dockerfileLines}><div className={styles.dockerfileLine} data-active={scene.step >= 0}><span>01</span><code>FROM node:22</code><strong>{scene.step >= 0 ? "base" : "—"}</strong></div><div className={styles.dockerfileLine} data-active={scene.step >= 1}><span>02</span><code>COPY package*.json ./</code><strong>{scene.step >= 1 ? "manifest" : "—"}</strong></div><div className={styles.dockerfileLine} data-active={scene.step >= 2}><span>03</span><code>RUN npm ci</code><strong>{scene.step >= 2 ? "deps" : "—"}</strong></div><div className={styles.dockerfileLine} data-active={scene.step >= 3}><span>04</span><code>COPY . .</code><strong>{scene.step >= 3 ? "source" : "—"}</strong></div></div>
        <small>顺序不只是可读性：每个指令的输入会影响它和后续层能否复用。</small>
      </div>
      <div className={styles.dockerfileArrow} aria-hidden="true"><ArrowRight size={21} /><span>构建</span></div>
      <div className={styles.dockerfilePanel} data-active={scene.step >= 1}>
        <div className={styles.dockerfileLabel}><Package size={17} aria-hidden="true" /><span>镜像层与产物</span></div>
        <h3>{current.result}</h3>
        <div className={styles.dockerfileLayers} style={style}>{current.layers.map((layer, index) => <div key={layer} className={styles.dockerfileLayer} data-active={index <= current.active}><i /><code>{layer}</code><span>{index < current.active ? "cache" : index === current.active ? "write" : "wait"}</span></div>)}</div>
        <small>{scene.step === 4 ? "build 阶段的工具不必进入 runtime；复制产物后可以丢掉前面的重量。" : scene.step === 5 ? "context 先过滤，构建器才收到更少的文件和更小的输入。" : "下一层会继承前面状态；命中缓存时可以直接复用，而不是重新执行。"}</small>
      </div>
    </div>
    <div className={styles.dockerfileNote} role="status"><ResultIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.dockerfileMetrics}><div><span>当前指令</span><strong>{current.stage}</strong></div><div><span>层策略</span><strong>{scene.step === 3 ? "后层重建" : scene.step === 4 ? "runtime 精简" : scene.step === 5 ? "context 过滤" : "逐层缓存"}</strong></div><div><span>结果</span><strong>{current.result}</strong></div></div>
    <div className={styles.dockerfileResult}><Cube size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>Dockerfile 不是一张“启动命令清单”：它把输入、顺序、缓存和运行时边界写成一条可复用的构建轨迹。</figcaption>
  </figure>;
}
