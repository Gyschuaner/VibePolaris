"use client";

import { ArrowsClockwise, CheckCircle, Cloud, Database, Gear, GitBranch, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./InfrastructureAsCodeConcept.module.css";

const labels = ["写配置", "查看 plan", "执行 apply", "读取 state", "检查漂移"];

export function InfrastructureAsCodeLesson() {
  const scene = useScene(labels.length);
  const isConfig = scene.step === 0;
  const isPlan = scene.step === 1;
  const isApply = scene.step === 2;
  const isState = scene.step === 3;
  const isDrift = scene.step === 4;
  const StatusIcon = isDrift ? WarningCircle : isApply ? CheckCircle : isState ? Database : isPlan ? GitBranch : Gear;
  const status = isConfig ? "先写目标状态；文件保存本身不会碰到云端资源。" : isPlan ? "plan 把变更列出来，先确认是否真的想新增、修改或删除。" : isApply ? "批准计划后才执行；apply 的日志和失败结果要留在可审计记录里。" : isState ? "state 连接配置地址与真实 ID，也因此需要锁定、备份和访问控制。" : "漂移是现实与声明的差异；先解释差异，再决定是否纠正。";
  return <div ref={scene.ref} className={styles.infrastructureAsCodeLab} role="region" aria-label="Infrastructure as Code plan、apply、state 和漂移工作台">
    <div className={styles.infrastructureAsCodeLabHeader}><span>同一份配置，分别看声明、计划和现实</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.infrastructureAsCodeControls} role="group" aria-label="选择基础设施代码阶段">
      <button type="button" className={styles.infrastructureAsCodeControl} aria-pressed={isConfig} onClick={() => scene.seek(0)}>写配置</button>
      <button type="button" className={styles.infrastructureAsCodeControl} aria-pressed={isPlan} onClick={() => scene.seek(1)}>看 plan</button>
      <button type="button" className={styles.infrastructureAsCodeControl} aria-pressed={isApply} onClick={() => scene.seek(2)}>执行 apply</button>
      <button type="button" className={styles.infrastructureAsCodeControl} aria-pressed={isDrift} onClick={() => scene.seek(4)}>检查漂移</button>
    </div>
    <div className={styles.infrastructureAsCodeLabGrid}>
      <div className={styles.infrastructureAsCodeLabPanel} data-active={isConfig || isPlan || isDrift}>
        <div className={styles.infrastructureAsCodeLabel}><CodeIcon state={scene.step} /><span>声明与比较</span></div>
        <h3>{isDrift ? "控制台把副本数改成 2" : isPlan ? "将创建 1 个、修改 1 个" : "replicas = 3"}</h3>
        <div className={styles.infrastructureAsCodeLabRows}><div className={styles.infrastructureAsCodeLabRow} data-active={isConfig}><code>desired</code><strong>web.app = 3</strong></div><div className={styles.infrastructureAsCodeLabRow} data-active={isPlan || isDrift}><code>diff</code><strong>{isDrift ? "drift · 3 ≠ 2" : isPlan ? "+1 / ~1" : "—"}</strong></div><div className={styles.infrastructureAsCodeLabRow} data-active={isPlan}><code>approval</code><strong>{isPlan ? "待审查" : "—"}</strong></div></div>
        <small>计划是一个可阅读的边界：它把改变什么和不改变什么先摆在操作人面前。</small>
      </div>
      <div className={styles.infrastructureAsCodeLabArrow} aria-hidden="true"><ArrowsClockwise size={22} /></div>
      <div className={styles.infrastructureAsCodeLabPanel} data-active={isApply || isState || isDrift}>
        <div className={styles.infrastructureAsCodeLabel}><Cloud size={16} aria-hidden="true" /><span>真实资源与记录</span></div>
        <h3>{isState ? "state · srv-42" : isApply ? "云端资源已更新" : isDrift ? "现实与 state 不同" : "等待执行"}</h3>
        <div className={styles.infrastructureAsCodeLabRows}><div className={styles.infrastructureAsCodeLabRow} data-active={isApply}><code>provider</code><strong>{isApply ? "created" : "—"}</strong></div><div className={styles.infrastructureAsCodeLabRow} data-active={isState}><code>mapping</code><strong>{isState ? "web.app → srv-42" : "未记录"}</strong></div><div className={styles.infrastructureAsCodeLabRow} data-active={isDrift}><code>next</code><strong>{isDrift ? "review before apply" : "—"}</strong></div></div>
        <small>远端资源、state 和配置各有职责；不要把一次 apply 的成功当成永远没有漂移。</small>
      </div>
    </div>
    <div className={styles.infrastructureAsCodeLabMetrics}><div><span>声明</span><strong>{isDrift ? "3 replicas" : "web.app"}</strong></div><div><span>计划</span><strong>{isPlan || isDrift ? "有差异" : "未生成"}</strong></div><div><span>操作边界</span><strong>{isApply ? "已执行" : isDrift ? "待审查" : "未改变"}</strong></div></div>
    <p className={styles.infrastructureAsCodeLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}

function CodeIcon({ state }: { state: number }) {
  return state >= 2 ? <Database size={16} aria-hidden="true" /> : <GitBranch size={16} aria-hidden="true" />;
}
