"use client";

import { Brain, Eye, GitBranch, Sparkle, Stack, Target } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./TransformerConcept.module.css";

const steps = [
  { label: "摆好 token", title: "先保留位置", detail: "小猫 · 坐在 · 窗边 · 它 · 看见 · 雨", Icon: Stack },
  { label: "交换信息", title: "让关系浮出来", detail: "它 ↔ 小猫 · 看见 ↔ 雨", Icon: Eye },
  { label: "各自改写", title: "同一层里的第二次处理", detail: "角色 · 动作 · 地点", Icon: Brain },
  { label: "叠加结果", title: "带着表示继续前进", detail: "下一层仍保留原位置", Icon: Stack },
];

const tokens = ["小猫", "坐在", "窗边", "它", "看见", "雨"];

export function TransformerHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  return <figure ref={scene.ref} className={styles.transformerHero} data-step={scene.step} aria-label="Transformer 如何让一排 token 在多层计算中互相交换信息">
    <div className={styles.transformerHeroHeader}><span>一句话的内部接力</span><strong>6 个 token · 4 个观察帧</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.transformerHeroTokens} aria-label="输入 token">
      {tokens.map((token, index) => <div key={token} className={styles.transformerHeroToken} data-active={scene.step >= 1 && (index === 0 || index === 3 || index === 4 || index === 5)}>
        <strong>{token}</strong><small>位置 {index + 1}</small>
      </div>)}
    </div>
    <div className={styles.transformerHeroPipe}>
      <div className={styles.transformerHeroStage} data-active={scene.step === 0}>
        <div className={styles.transformerHeroStageLabel}><Target size={17} aria-hidden="true" /><span>输入表示</span></div>
        <h3>每张卡先站在自己的位置</h3>
        <p>位置和 token 一起进入网络，不能只看成一串没有顺序的词。</p>
      </div>
      <div className={styles.transformerHeroStage} data-active={scene.step === 1}>
        <div className={styles.transformerHeroStageLabel}><GitBranch size={17} aria-hidden="true" /><span>自注意力</span></div>
        <h3>相关的卡互相传话</h3>
        <div className={styles.transformerHeroRelations}>
          <div className={styles.transformerHeroRelation} data-visible={scene.step >= 1}><span>它</span><span>↔ 小猫</span></div>
          <div className={styles.transformerHeroRelation} data-visible={scene.step >= 1}><span>看见</span><span>↔ 雨</span></div>
        </div>
      </div>
      <div className={styles.transformerHeroStage} data-active={scene.step >= 2}>
        <div className={styles.transformerHeroStageLabel}><Sparkle size={17} aria-hidden="true" /><span>表示更新</span></div>
        <h3>每个位置再做一次自己的改写</h3>
        <div className={styles.transformerHeroVector} aria-label="每个位置的表示强度示意">
          <span>角色 <i /></span><span>动作 <i /></span><span>场景 <i /></span>
        </div>
      </div>
    </div>
    <div className={styles.transformerHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>这里画的是可观察的计算路径：注意力让位置交换信息，前馈层在各位置上继续变换表示；它不是模型“读懂事实”的证明。</figcaption>
  </figure>;
}
