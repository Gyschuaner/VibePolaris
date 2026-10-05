"use client";

import { useState } from "react";
import { Brain, CheckCircle, Circuitry, FileText, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./KvCacheConcept.module.css";

const labels = ["先算前缀", "切成 blocks", "复用命中", "处理边界"];
type RequestVariant = "same" | "changed";
type Capacity = "room" | "full";

const requestTokens: Record<RequestVariant, string[]> = {
  same: ["系统", "：", "你是客服", "。", "用户", "：", "请问"],
  changed: ["系统", "：", "你是销售", "。", "用户", "：", "请问"],
};

export function KvCacheLesson() {
  const scene = useScene(labels.length);
  const [variant, setVariant] = useState<RequestVariant>("same");
  const [capacity, setCapacity] = useState<Capacity>("room");
  const changed = variant === "changed";
  const full = capacity === "full";
  const hit = !changed && !full && scene.step >= 2;
  const miss = changed || full;
  const final = scene.step === labels.length - 1;
  const reset = (next: () => void) => { next(); scene.seek(0); };

  return <div ref={scene.ref} className={styles.kvCacheLab} role="region" aria-label="KV cache 前缀命中、分块与淘汰工作台">
    <div className={styles.kvCacheLabHeader}><span>换一个请求条件，看看缓存还能不能复用</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.kvCacheLabControls} role="group" aria-label="改变缓存条件">
      <button type="button" className={styles.kvCacheLabButton} aria-pressed={!changed} onClick={() => reset(() => setVariant("same"))}>相同前缀</button>
      <button type="button" className={styles.kvCacheLabButton} aria-pressed={changed} onClick={() => reset(() => setVariant("changed"))}>改动一个词</button>
      <button type="button" className={styles.kvCacheLabButton} aria-pressed={full} onClick={() => reset(() => setCapacity(full ? "room" : "full"))}>{full ? "腾出缓存空间" : "缓存塞满"}</button>
    </div>
    <div className={styles.kvCacheLabGrid}>
      <div className={styles.kvCacheLabPanel} data-active={scene.step === 0}>
        <div className={styles.kvCacheLabLabel}><FileText size={16} aria-hidden="true" /><span>请求前缀</span></div>
        <h3>{changed ? "有一处不同" : "共享前缀"}</h3>
        <div className={styles.kvCacheLabTokens}>{requestTokens[variant].map((token, index) => <span key={`${token}-${index}`} data-changed={changed && index === 2} data-visible={scene.step >= 0}>{token}</span>)}</div>
        <small>{changed ? "“你是销售”不能拿“你是客服”的 K / V 直接冒充。" : "前六格保持一致，最后的请求可以另算。"}</small>
      </div>
      <div className={styles.kvCacheLabPanel + " " + styles.kvCacheLabBlocks} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.kvCacheLabLabel}><Circuitry size={16} aria-hidden="true" /><span>按 block 管理</span></div>
        <h3>{full ? "GPU 抽屉已满" : "GPU 抽屉"}</h3>
        <div className={styles.kvCacheLabBlockRows}>
          {["系统：你是客服。", "用户："].map((block, index) => <div key={block} data-visible={scene.step >= 1} data-reused={hit && index === 0} data-evicted={full && index === 0}><span>{block}</span><b>{full && index === 0 ? "淘汰" : hit && index === 0 ? "命中" : scene.step >= 1 ? "已存" : "空"}</b></div>)}
        </div>
        <div className={styles.kvCacheLabTier}><span>GPU</span><i /><span>{full ? "100%" : "2 / 4 blocks"}</span></div>
      </div>
      <div className={styles.kvCacheLabPanel + " " + styles.kvCacheLabOutput} data-active={scene.step === 2 || scene.step === 3}>
        <div className={styles.kvCacheLabLabel}><Brain size={16} aria-hidden="true" /><span>本轮 decode</span></div>
        <h3>{hit ? "拿回旧状态" : miss && final ? "重新算前缀" : "等待缓存"}</h3>
        <div className={styles.kvCacheLabQuery}><strong>新 Q</strong><span>“请问”</span><small>{hit ? "读取 K / V" : changed ? "无匹配 block" : full ? "先腾空间" : "尚未发送"}</small></div>
        <div className={styles.kvCacheLabOutcome} data-danger={miss && final}><span>{hit ? "前缀计算跳过" : miss && final ? "前缀重新计算" : "等待判断"}</span><strong>{hit ? "TTFT ↓" : miss && final ? "重复工作" : "—"}</strong></div>
      </div>
    </div>
    <div className={styles.kvCacheLabMetrics}>
      <div><span>命中状态</span><strong>{hit ? "命中" : miss ? "未命中" : "等待"}</strong></div>
      <div><span>缓存位置</span><strong>{full ? "需要淘汰" : "GPU"}</strong></div>
      <div><span>权重变化</span><strong>0 次</strong></div>
    </div>
    <p className={styles.kvCacheLabNote} data-danger={miss} role="status">
      {changed ? <><WarningCircle size={17} aria-hidden="true" /><span>只改了“客服”这一格，前缀就不再相同；KV cache 不能把另一份上下文的中间状态当作这次请求的证据。</span></> : full ? <><WarningCircle size={17} aria-hidden="true" /><span>缓存是有限的工作内存。空间满时要淘汰或搬到更慢的层级，命中率和延迟会随容量策略变化。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>命中表示少做了一段重复计算，不表示答案更正确；缓存里没有模型权重，也没有事实核验。</span></> : <><LockSimple size={17} aria-hidden="true" /><span>先把 K / V 放进按 token 分块的抽屉，再判断后续请求能不能复用相同前缀。</span></>}
    </p>
  </div>;
}
