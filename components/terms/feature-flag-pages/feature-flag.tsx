"use client";

import { useState } from "react";
import { ChartLine, CheckCircle, Code, Flag, GitBranch, ShieldCheck, User, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./FeatureFlagConcept.module.css";

const labels = ["部署", "评估", "分批", "观测", "回退"];
type Audience = "internal" | "percent" | "all";

export function FeatureFlagLesson() {
  const scene = useScene(labels.length);
  const [audience, setAudience] = useState<Audience>("internal");
  const [regression, setRegression] = useState(false);
  const [kill, setKill] = useState(false);
  const final = scene.step === labels.length - 1;
  const exposed = !kill && scene.step >= 2;
  const newPath = exposed && !regression;
  const audienceText = audience === "internal" ? "内部用户" : audience === "percent" ? "10% cohort" : "全量用户";
  const reset = (next: () => void) => { next(); setKill(false); scene.seek(0); };
  const status = kill || final ? "old path" : newPath ? "new path" : "old path";

  return <div ref={scene.ref} className={styles.featureFlagLab} role="region" aria-label="功能开关的分批发布、指标观察和紧急回退工作台">
    <div className={styles.featureFlagLabHeader}><span>只改暴露规则和指标，代码版本保持 v42</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.featureFlagLabControls} role="group" aria-label="改变功能开关条件">
      <button type="button" className={styles.featureFlagLabButton} aria-pressed={audience === "internal"} onClick={() => reset(() => setAudience("internal"))}>内部用户</button>
      <button type="button" className={styles.featureFlagLabButton} aria-pressed={audience === "percent"} onClick={() => reset(() => setAudience("percent"))}>10% 分批</button>
      <button type="button" className={styles.featureFlagLabButton} aria-pressed={audience === "all"} onClick={() => reset(() => setAudience("all"))}>全量发布</button>
      <button type="button" className={styles.featureFlagLabButton} aria-pressed={regression} onClick={() => reset(() => setRegression(value => !value))}>{regression ? "恢复正常指标" : "模拟回归"}</button>
      <button type="button" className={styles.featureFlagLabButton} aria-pressed={kill} onClick={() => { setKill(true); scene.seek(labels.length - 1); }}>立即关闭开关</button>
    </div>
    <div className={styles.featureFlagLabGrid}>
      <div className={styles.featureFlagLabPanel} data-active={scene.step === 0}>
        <div className={styles.featureFlagLabLabel}><Code size={16} aria-hidden="true" /><span>同一构建</span></div>
        <h3>v42 · checkout</h3>
        <div className={styles.featureFlagLabBuild}><span>old path</span><span>new path</span></div>
        <small>部署完成后，代码已经在生产；用户是否看见由开关决定。</small>
      </div>
      <div className={styles.featureFlagLabPanel} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.featureFlagLabLabel}><Flag size={16} aria-hidden="true" /><span>评估上下文</span></div>
        <h3>checkout.new</h3>
        <div className={styles.featureFlagLabContext}><span>targetingKey</span><strong>user-li</strong></div>
        <small>{audienceText} · {scene.step === 0 ? "尚未评估" : "返回一个稳定变体"}</small>
      </div>
      <div className={styles.featureFlagLabPanel} data-active={scene.step === 2 || scene.step === 4} data-danger={kill || (regression && final)}>
        <div className={styles.featureFlagLabLabel}>{kill || (regression && final) ? <WarningCircle size={16} aria-hidden="true" /> : <GitBranch size={16} aria-hidden="true" />}<span>代码路径</span></div>
        <h3>{kill ? "kill switch → OFF" : scene.step < 2 ? "等待开关" : `${audienceText} → ${status}`}</h3>
        <div className={styles.featureFlagLabDecision}><span>{kill ? "旧结算页" : newPath ? "新结算页" : "旧结算页"}</span><strong>{kill ? "fallback" : newPath ? "enabled" : "disabled"}</strong></div>
        <small>{kill ? "只切换暴露，v42 没有重新部署" : regression ? "错误率上升，先不要继续扩大" : "变体结果应与指标一起记录"}</small>
      </div>
      <div className={styles.featureFlagLabPanel} data-active={scene.step === 3}>
        <div className={styles.featureFlagLabLabel}><ChartLine size={16} aria-hidden="true" /><span>观测</span></div>
        <h3>{regression ? "错误率 4.8%" : scene.step >= 3 ? "错误率 0.4%" : "等待指标"}</h3>
        <div className={styles.featureFlagLabMetric}><span>变体</span><strong>{regression ? "回归" : scene.step >= 3 ? "稳定" : "未采集"}</strong></div>
        <small>没有指标就没有“可以全量”的依据。</small>
      </div>
    </div>
    <div className={styles.featureFlagLabMetrics}>
      <div><span>版本</span><strong>v42</strong></div>
      <div><span>新路径</span><strong>{kill ? "0%" : exposed ? (audience === "all" ? "100%" : "10%") : "0%"}</strong></div>
      <div><span>操作结果</span><strong>{kill ? "已回退" : regression && final ? "需止损" : scene.step >= 3 ? "继续观察" : "等待"}</strong></div>
    </div>
    <p className={styles.featureFlagLabNote} data-danger={kill || (regression && final)} role="status">
      {kill ? <><ShieldCheck size={17} aria-hidden="true" /><span>开关关闭后，所有请求回到旧路径；这是暴露控制，不是把新代码从构建里抹掉。</span></> : regression && final ? <><WarningCircle size={17} aria-hidden="true" /><span>观察到回归时，先把暴露降回 0%，再调查原因。把 flag 当成权限校验或数据回滚，会让边界变得危险。</span></> : scene.step >= 3 ? <><CheckCircle size={17} aria-hidden="true" /><span>分批发布要和错误率、延迟、转化等指标一起读；比例变大本身不是成功证据。</span></> : <><User size={17} aria-hidden="true" /><span>同一版本里同时存在两条路径，评估器用请求上下文选择其中一条，并返回可追踪的变体。</span></>}
    </p>
  </div>;
}
