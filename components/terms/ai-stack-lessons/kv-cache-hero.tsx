"use client";

import { ArrowRight, ArrowsClockwise, Brain, CheckCircle, Circuitry, FileText, LockSimple } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./KvCacheConcept.module.css";

const steps = [
  { label: "读过前缀", title: "先把已经说过的话读一遍", detail: "注意力为每个旧 token 算出可复用的 K / V。", Icon: FileText },
  { label: "放进抽屉", title: "把中间状态贴上位置书签", detail: "抽屉里放的是 K / V，不是答案，也不是模型权重。", Icon: Circuitry },
  { label: "只带新 Q", title: "下一个 token 只带来新的查询", detail: "旧的 K / V 直接取回，避免重复做同一段前缀计算。", Icon: Brain },
  { label: "检查命中", title: "相同前缀才能拿回同一格积木", detail: "改一个字、换模型或缓存被挤出，命中就会消失。", Icon: CheckCircle },
];

const prefixTokens = ["系统", "：", "你是客服", "。", "用户", "："];
const cacheBlocks = ["系统：你是客服。", "用户："];

export function KvCacheHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];

  return <figure ref={scene.ref} className={styles.kvCacheHero} data-step={scene.step} aria-label="KV cache 如何保存注意力中间状态并在生成时复用">
    <div className={styles.kvCacheHeroHeader}><span>一段前缀怎样变成可复用的书签</span><strong>K / V = reuse · Q = fresh</strong></div>
    <SceneControls scene={scene} labels={steps.map((step) => step.label)} />
    <div className={styles.kvCacheHeroBoard}>
      <div className={styles.kvCacheHeroPrompt} data-active={scene.step === 0}>
        <div className={styles.kvCacheHeroLabel}><FileText size={17} aria-hidden="true" /><span>前缀 · prompt</span></div>
        <h3>一段已经说过的话</h3>
        <div className={styles.kvCacheHeroTokens}>{prefixTokens.map((token, index) => <span key={`${token}-${index}`} data-visible={scene.step >= 0}>{token}</span>)}</div>
        <small>{scene.step === 0 ? "先算一次，不能凭空跳过" : "位置顺序被保留在缓存书签里"}</small>
      </div>
      <ArrowRight className={styles.kvCacheHeroArrow} size={24} aria-hidden="true" />
      <div className={styles.kvCacheHeroDrawers} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.kvCacheHeroLabel}><Circuitry size={17} aria-hidden="true" /><span>缓存 · K / V 抽屉</span></div>
        <h3>{scene.step >= 1 ? "已经算过的中间状态" : "空抽屉"}</h3>
        <div className={styles.kvCacheHeroBlockList}>
          {cacheBlocks.map((block, index) => <div key={block} className={styles.kvCacheHeroBlock} data-visible={scene.step >= 1} data-hit={scene.step === 2 && index === 0}><span>{block}</span><b>K</b><b>V</b></div>)}
        </div>
        <div className={styles.kvCacheHeroDrawerNote}><strong>{scene.step >= 1 ? "2 个 block" : "0 个 block"}</strong><small>按位置保存 K / V；不是把完整回答存进去。</small></div>
      </div>
      <ArrowRight className={styles.kvCacheHeroArrow} size={24} aria-hidden="true" />
      <div className={styles.kvCacheHeroQuery} data-active={scene.step === 2 || scene.step === 3}>
        <div className={styles.kvCacheHeroLabel}><Brain size={17} aria-hidden="true" /><span>本轮 · new Q</span></div>
        <h3>{scene.step >= 2 ? "只带新的查询" : "等待下一 token"}</h3>
        <div className={styles.kvCacheHeroQueryChip} data-visible={scene.step >= 2}>“请问”<small>Q</small></div>
        <div className={styles.kvCacheHeroReuse} data-hit={scene.step === 2} data-miss={scene.step === 3}><LockSimple size={15} aria-hidden="true" /><span>{scene.step === 2 ? "取回旧 K / V" : scene.step === 3 ? "前缀变化 → 重新计算" : "尚未读取"}</span></div>
      </div>
    </div>
    <div className={styles.kvCacheHeroMetrics}>
      <div><span>前缀计算</span><strong>{scene.step >= 1 ? "1 次" : "待算"}</strong></div>
      <div><span>旧 K / V</span><strong>{scene.step === 2 ? "命中" : scene.step === 3 ? "失效" : "待存"}</strong></div>
      <div><span>权重变化</span><strong>0 次</strong></div>
    </div>
    <div className={styles.kvCacheHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>KV cache 记住的是注意力已经算过的中间状态。它能省掉重复计算，却不会替模型补充新事实；缓存命中还依赖前缀、位置和运行条件保持一致。</figcaption>
  </figure>;
}
