"use client";

import { useState } from "react";
import { CheckCircle, Eye, Funnel, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./AttentionConcept.module.css";

const labels = ["递出查询", "比较键", "取回值", "换一组头"];
const rows = [
  { key: "无糖", value: "美式 · ¥18", rank: "1" },
  { key: "含奶", value: "拿铁 · ¥22", rank: "2" },
  { key: "含糖", value: "果茶 · ¥20", rank: "3" },
];

export function AttentionLesson() {
  const scene = useScene(labels.length);
  const [query, setQuery] = useState<"无糖" | "价格">("无糖");
  const [maskedKey, setMaskedKey] = useState(false);
  const queryText = query === "无糖" ? "查：无糖饮品" : "查：最低价格";
  const hitIndex = query === "无糖" ? 0 : 1;
  const hasEvidence = !maskedKey || hitIndex !== 0;

  return <div ref={scene.ref} className={styles.attentionLab} role="region" aria-label="注意力查询键值工作台">
    <div className={styles.attentionLabHeader}><span>把一条查询放进键值货架</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.attentionLabQuery}><span>当前 Query</span><strong>{queryText}</strong></div>
    <div className={styles.attentionLabGrid}>
      <div className={styles.attentionLabShelf}>
        <h3>Keys → Values</h3>
        <p>Key 是比较用的表示，Value 是匹配后要取回的内容；两者可以来自同一组输入，也可以来自另一组序列。</p>
        <div className={styles.attentionLabRows}>
          {rows.map((row, index) => <div key={row.key} className={styles.attentionLabRow} data-visible={scene.step >= 1} data-hit={scene.step >= 1 && !maskedKey && index === hitIndex} data-rank={row.rank}>
            <span>{row.key}</span><div className={styles.attentionLabWeight}><i /></div><small>{scene.step >= 1 && !maskedKey ? (index === hitIndex ? "高" : index === 1 ? "中" : "低") : "—"}</small>
            <span>{row.value}</span><span>{index === 0 && maskedKey ? "遮罩" : "可取回"}</span><small>{scene.step >= 2 && !maskedKey ? "混合" : "—"}</small>
          </div>)}
        </div>
      </div>
      <div className={styles.attentionLabHeads}>
        <h3>两组头，两个角度</h3>
        <p>多头不是把同一个答案复制两遍，而是让不同的投影子空间并行计算，再把结果拼接。</p>
        <div className={styles.attentionLabHeadList}>
          <div className={styles.attentionLabHead} data-active={scene.step >= 3}><strong><span>口味头</span><span>{query === "无糖" ? "命中" : "弱"}</span></strong><small>寻找“无糖 / 含糖”这类条件。</small></div>
          <div className={styles.attentionLabHead} data-active={scene.step >= 3}><strong><span>价格头</span><span>{query === "价格" ? "命中" : "弱"}</span></strong><small>寻找价格线索；它的权重不是口味头的解释。</small></div>
        </div>
        <div className={styles.attentionLabMix}><span><b>拼接后表示</b><b>{scene.step >= 3 ? "2 个头" : "等待"}</b></span><i /></div>
      </div>
    </div>
    <div className={styles.attentionLabActions} role="group" aria-label="改变注意力输入">
      <button type="button" className={styles.attentionLabButton} aria-pressed={query === "无糖"} onClick={() => setQuery("无糖")}>查询：无糖</button>
      <button type="button" className={styles.attentionLabButton} aria-pressed={query === "价格"} onClick={() => setQuery("价格")}>查询：价格</button>
      <button type="button" className={styles.attentionLabButton} aria-pressed={maskedKey} onClick={() => setMaskedKey(value => !value)}>遮掉“无糖”键</button>
    </div>
    <p className={styles.attentionLabNote} data-danger={maskedKey && !hasEvidence} role="status">
      {maskedKey && !hasEvidence ? <><WarningCircle size={17} aria-hidden="true" /><span>关键 key 被遮掉后，权重表没有可取回的“无糖”证据；注意力不会自动补一张真实卡。</span></> : scene.step < 1 ? <><Eye size={17} aria-hidden="true" /><span>先把 Query 说清楚；此时还没有计算权重，也不能把“最像的词”当成结果。</span></> : scene.step < 3 ? <><Funnel size={17} aria-hidden="true" /><span>权重只决定怎样混合 Value。它告诉你一次计算如何取数，不是对模型意图的完整解释。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>多头把不同子空间的结果拼起来；读图时要保留输入、mask 和任务头这些条件。</span></>}
    </p>
  </div>;
}
