"use client";

import { ArrowRight, ArrowsClockwise, CheckCircle, Cloud, Code, Database, Gear, GitBranch, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./InfrastructureAsCodeConcept.module.css";

const frames = [
  { label: "写下目标状态", stage: "DESIRED", code: ["resource \"web\" \"app\" {", "  replicas = 3", "}"], changes: [{ label: "web.app", value: "声明 3 个实例", kind: "add" }], result: "还没有云端变化", note: "配置描述想要的结果；保存文件不会直接创建任何资源。" },
  { label: "先看 plan", stage: "PLAN", code: ["resource \"web\" \"app\" {", "  replicas = 3", "}"], changes: [{ label: "+ web.app", value: "create", kind: "add" }, { label: "~ api.rule", value: "update", kind: "same" }], result: "变更清单", note: "plan 把配置与当前状态比较，先把将要新增、修改或删除的东西摊开。" },
  { label: "展开依赖", stage: "GRAPH", code: ["web.app → network.main", "web.app → image.api", "web.app → policy.runtime"], changes: [{ label: "network.main", value: "先满足", kind: "same" }, { label: "image.api", value: "再引用", kind: "add" }], result: "依赖顺序", note: "资源之间的引用形成图；工具按依赖关系安排顺序，而不是按文件从上到下盲目执行。" },
  { label: "批准后 apply", stage: "APPLY", code: ["apply plan.tfplan", "web.app: creating...", "web.app: complete"], changes: [{ label: "web.app", value: "created", kind: "add" }, { label: "network.main", value: "unchanged", kind: "same" }], result: "真实资源改变", note: "apply 才把计划交给提供商执行；计划和真正的云端变化是两个时间点。" },
  { label: "状态记录映射", stage: "STATE", code: ["web.app.id = \"srv-42\"", "web.app.replicas = 3", "network.main.id = \"net-7\""], changes: [{ label: "配置地址", value: "映射到真实 ID", kind: "same" }, { label: "秘密字段", value: "另行保护", kind: "remove" }], result: "下次 plan 有依据", note: "state 记录配置地址与真实资源的映射；它需要锁定、备份和访问控制，不能把它当成普通日志。" },
  { label: "发现漂移", stage: "DRIFT", code: ["remote replicas = 2", "config replicas = 3", "plan: ~ web.app"], changes: [{ label: "web.app", value: "drift detected", kind: "remove" }, { label: "下一步", value: "先审查再 apply", kind: "same" }], result: "现实与声明分开", note: "有人在控制台把实例改成 2 个，下一次 plan 会把现实差异说出来；是否纠正，要先看原因和风险。" },
] as const;

export function InfrastructureAsCodeHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const statusIcon = scene.step === 5 ? WarningCircle : scene.step === 3 ? CheckCircle : scene.step === 2 ? GitBranch : Gear;
  const StatusIcon = statusIcon;
  const style = { "--iac-progress": `${18 + scene.step * 15}%` } as CSSProperties;
  return <figure ref={scene.ref} className={styles.infrastructureAsCodeHero} data-step={scene.step} aria-label="Infrastructure as Code 从声明到 plan、apply 和漂移检查">
    <div className={styles.infrastructureAsCodeHeader}><span>先比较，再改变真实基础设施</span><strong>{current.stage} · step {scene.step + 1}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.infrastructureAsCodeBoard}>
      <div className={styles.infrastructureAsCodePanel} data-active={scene.step <= 2 || scene.step === 5}>
        <div className={styles.infrastructureAsCodeLabel}><Code size={17} aria-hidden="true" /><span>配置与输入</span></div>
        <h3>{scene.step === 2 ? "依赖图" : current.label}</h3>
        <pre className={styles.infrastructureAsCodeCode}>{current.code.map((line, index) => <span key={line}><i>{String(index + 1).padStart(2, "0")}</i><b>{line}</b><em>{scene.step >= 1 ? "read" : "write"}</em></span>)}</pre>
      </div>
      <div className={styles.infrastructureAsCodeArrow} aria-hidden="true"><ArrowRight size={21} /><span>比较 / 执行</span></div>
      <div className={styles.infrastructureAsCodePanel} data-active={scene.step >= 1}>
        <div className={styles.infrastructureAsCodeLabel}><Cloud size={17} aria-hidden="true" /><span>计划与现实</span></div>
        <h3>{current.result}</h3>
        <div className={styles.infrastructureAsCodePlan} style={style}>{current.changes.map(change => <div className={styles.infrastructureAsCodeChange} data-kind={change.kind} key={change.label}><code>{change.label}</code><strong>{change.value}</strong></div>)}</div>
      </div>
    </div>
    <div className={styles.infrastructureAsCodeNote} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.infrastructureAsCodeMetrics}><div><span>当前阶段</span><strong>{current.stage}</strong></div><div><span>变化来源</span><strong>{scene.step === 5 ? "远端漂移" : scene.step >= 3 ? "apply 结果" : "声明配置"}</strong></div><div><span>下一步</span><strong>{scene.step === 3 ? "记录 state" : scene.step === 5 ? "审查 plan" : "继续比较"}</strong></div></div>
    <figcaption>IaC 把“想要什么”写成可比较的配置，把“要改变什么”交给 plan 审查，再把执行结果记录回 state。</figcaption>
  </figure>;
}
