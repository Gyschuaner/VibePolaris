"use client";

import { ArrowRight, Eye, Funnel, MagnifyingGlass, Sparkle, Target } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./AttentionConcept.module.css";

const steps = [
  { label: "递出查询", title: "先说我在找什么", detail: "查：无糖饮品", Icon: Target },
  { label: "比较键", title: "逐个比较匹配程度", detail: "无糖 / 低糖 / 含糖", Icon: MagnifyingGlass },
  { label: "取回值", title: "按权重混合内容", detail: "可选规格 + 价格", Icon: Funnel },
  { label: "并行多头", title: "不同角度一起看", detail: "口味头 · 价格头", Icon: Sparkle },
];

const keys = [
  { label: "美式", detail: "无糖 · ¥18", rank: "1" },
  { label: "拿铁", detail: "含奶 · ¥22", rank: "2" },
  { label: "果茶", detail: "含糖 · ¥20", rank: "3" },
];

export function AttentionHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  return <figure ref={scene.ref} className={styles.attentionHero} data-step={scene.step} aria-label="注意力如何用查询、键和值挑出相关信息并生成加权结果">
    <div className={styles.attentionHeroHeader}><span>一张点单怎样找到相关字段</span><strong>Q · K · V · 4 帧</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.attentionHeroBoard}>
      <div className={styles.attentionHeroQuery} data-active={scene.step === 0}>
        <div className={styles.attentionHeroLabel}><Target size={17} aria-hidden="true" /><span>Query · 查询</span></div>
        <strong>我想找：<br />无糖饮品</strong>
        <p>查询是当前位置带来的问题，用来和其他位置的 key 比较。</p>
        <div className={styles.attentionHeroStamp}>一条查询</div>
      </div>
      <ArrowRight className={styles.attentionHeroArrow} size={25} aria-hidden="true" />
      <div className={styles.attentionHeroKeys} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.attentionHeroLabel}><MagnifyingGlass size={17} aria-hidden="true" /><span>Keys · 可匹配的标签</span></div>
        <h3>把每张卡拿来比较</h3>
        <p>分数只是本轮计算的权重信号，不是“这张卡就是答案”的盖章。</p>
        <div className={styles.attentionHeroKeyList}>
          {keys.map((key, index) => <div key={key.label} className={styles.attentionHeroKey} data-visible={scene.step >= 1} data-hit={scene.step >= 1 && index === 0} data-rank={key.rank}><span><strong>{key.label}</strong> · {key.detail}</span><div className={styles.attentionHeroMeter}><i /></div></div>)}
        </div>
      </div>
      <div className={styles.attentionHeroAnswer} data-active={scene.step >= 2}>
        <div className={styles.attentionHeroLabel}><Eye size={17} aria-hidden="true" /><span>Values · 取回内容</span></div>
        <h3>把相关内容带回来</h3>
        <p>输出不是一张原封不动的卡，而是按权重组合后的定宽向量。</p>
        <div className={styles.attentionHeroAnswerRows}>
          <div className={styles.attentionHeroAnswerRow} data-visible={scene.step >= 2}><span>可选规格</span><small>无糖</small></div>
          <div className={styles.attentionHeroAnswerRow} data-visible={scene.step >= 2}><span>价格线索</span><small>¥18</small></div>
        </div>
        <div className={styles.attentionHeroAnswerNote}>多头时，另一组头可以从价格或位置角度重新计算。</div>
      </div>
    </div>
    <div className={styles.attentionHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>注意力把“谁在问、拿什么匹配、取回什么”分成 Q、K、V；高权重适合做观察线索，不能单独当作模型的解释或事实证据。</figcaption>
  </figure>;
}
