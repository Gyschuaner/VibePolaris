"use client";

import { ArrowRight, ChartLine, CheckCircle, Code, Flag, GitBranch, ShieldCheck, User, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./FeatureFlagConcept.module.css";

const steps = [
  { label: "同一版本", title: "先把两条路径一起部署", detail: "新功能已经在构建里，但还没有向用户打开。", Icon: Code },
  { label: "读取开关", title: "请求带着上下文来", detail: "评估器根据 flag 和用户条件决定走哪条路径。", Icon: Flag },
  { label: "小范围", title: "先让一小群人看到", detail: "10% 内测让风险留在可观察的范围里。", Icon: User },
  { label: "观察", title: "用指标决定是否继续", detail: "暴露比例变化前，先确认错误率和体验没有变坏。", Icon: ChartLine },
  { label: "止损", title: "出问题时关掉新路径", detail: "kill switch 让旧路径接回请求，不必重新部署。", Icon: ShieldCheck },
];

export function FeatureFlagHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const smallRollout = scene.step === 2 || scene.step === 3;
  const kill = scene.step === 4;
  const path = kill ? "old" : smallRollout ? "new · 10%" : scene.step === 1 ? "old · default" : "等待评估";

  return <figure ref={scene.ref} className={styles.featureFlagHero} data-step={scene.step} aria-label="功能开关怎样把部署、分批发布、观察和回退拆开">
    <div className={styles.featureFlagHeroHeader}><span>同一次部署，谁先看到新路径？</span><strong>deploy → evaluate → observe → reverse</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.featureFlagHeroBoard}>
      <div className={styles.featureFlagHeroBuild} data-active={scene.step === 0}>
        <div className={styles.featureFlagHeroLabel}><Code size={17} aria-hidden="true" /><span>生产构建 · v42</span></div>
        <h3>结算页</h3>
        <div className={styles.featureFlagHeroCode}><span>旧路径</span><span>新路径</span></div>
        <small>两条实现都在同一个版本里。</small>
      </div>
      <div className={styles.featureFlagHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.featureFlagHeroFlag} data-active={scene.step === 1 || scene.step === 4} data-danger={kill}>
        <div className={styles.featureFlagHeroLabel}><Flag size={17} aria-hidden="true" /><span>flag evaluator</span></div>
        <h3>checkout.new</h3>
        <div className={styles.featureFlagHeroDecision}><strong>{kill ? "OFF" : scene.step === 0 ? "未读取" : "ON / 规则"}</strong><small>{kill ? "kill switch" : "按上下文计算"}</small></div>
        <small>{kill ? "紧急关闭新路径，旧路径接回" : "开关决定暴露，不改变已经部署的代码"}</small>
      </div>
      <div className={styles.featureFlagHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.featureFlagHeroAudience} data-active={smallRollout} data-danger={kill}>
        <div className={styles.featureFlagHeroLabel}><User size={17} aria-hidden="true" /><span>请求与结果</span></div>
        <h3>{kill ? "所有人" : scene.step === 2 || scene.step === 3 ? "内测 cohort" : "默认用户"}</h3>
        <div className={styles.featureFlagHeroPath}><span>当前路径</span><strong>{path}</strong></div>
        <small>{kill ? "旧结算页恢复服务" : smallRollout ? "10% · 稳定分组" : scene.step === 1 ? "默认走旧路径" : "等待一次评估"}</small>
      </div>
    </div>
    <div className={styles.featureFlagHeroSignal} data-active={scene.step === 3} data-danger={kill}>{kill ? <WarningCircle size={17} aria-hidden="true" /> : scene.step === 3 ? <CheckCircle size={17} aria-hidden="true" /> : <GitBranch size={17} aria-hidden="true" />}<span>{kill ? "错误率上升 · 关闭开关即可止损" : scene.step === 3 ? "指标稳定 · 可以继续扩大暴露" : "开关把代码部署和功能发布拆成两个决定"}</span></div>
    <div className={styles.featureFlagHeroMetrics}>
      <div><span>已部署</span><strong>v42</strong></div>
      <div><span>新路径暴露</span><strong>{kill ? "0%" : smallRollout ? "10%" : "0%"}</strong></div>
      <div><span>当前状态</span><strong>{kill ? "回退旧路径" : scene.step >= 2 ? "观察中" : "等待发布"}</strong></div>
    </div>
    <div className={styles.featureFlagHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>功能开关的价值不在“多一个 if”，而在于把部署、暴露、观察和止损拆开：同一份代码先进入生产，再由运行时决定谁看到什么。</figcaption>
  </figure>;
}
