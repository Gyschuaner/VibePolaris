"use client";

import { useState } from "react";
import { ConceptHero } from "../ConceptHero";
import styles from "./RerankingRack.module.css";

const candidates = [
  { id: "A", title: "取消会员的操作", text: "在设置里关闭自动续费；这项操作不办理退款。", recall: .87, rerank: .31 },
  { id: "C", title: "余额退回方式", text: "站内余额退回账户余额，不经过银行卡。", recall: .81, rerank: .18 },
  { id: "B", title: "退款到账时间", text: "退款审核通过后，原路退回银行卡，通常需要 3 至 5 个工作日。", recall: .75, rerank: .94 },
];

export function RerankingHero() {
  return <ConceptHero slug="reranking" label="已召回的 A、C、B 三份资料重新排列，直接回答到账时间的 B 从第三位移到第一位">
    <div className={styles.miniRack}><span className={styles.miniQuestion}>退款多久到银行卡？</span>{candidates.map(doc => <div key={doc.id} className={styles.miniPaper} data-id={doc.id}><b>{doc.id}</b><span>{doc.title}</span><i /></div>)}</div>
  </ConceptHero>;
}

export function RerankingRackLab() {
  const [mode, setMode] = useState<"recall" | "rerank" | "failed">("recall");
  const [missedAnswer, setMissedAnswer] = useState(false);
  const [topN, setTopN] = useState(2);
  const [selectedId, setSelectedId] = useState("A");
  const pool = candidates.filter(doc => !missedAnswer || doc.id !== "B");
  const scoreKey = mode === "rerank" ? "rerank" : "recall";
  const ranked = [...pool].sort((a, b) => b[scoreKey] - a[scoreKey]);
  const kept = ranked.slice(0, topN);
  const selected = pool.find(doc => doc.id === selectedId)!;
  return <figure className={styles.lab} aria-label="已有候选资料的重排序实验">
    <p className={styles.question}>会员取消后，退款多久到银行卡？</p>
    <div className={styles.actions} role="group" aria-label="选择排序方式"><button type="button" aria-pressed={mode === "recall"} onClick={() => setMode("recall")}>初次召回顺序</button><button type="button" aria-pressed={mode === "rerank"} onClick={() => setMode("rerank")}>按问题重排</button><button type="button" aria-pressed={mode === "failed"} onClick={() => setMode("failed")}>模拟重排失败</button></div>
    <div className={styles.scopeControls}><label><input type="checkbox" checked={missedAnswer} onChange={event => { setMissedAnswer(event.target.checked); if (event.target.checked && selectedId === "B") setSelectedId("A"); }} />初次检索漏掉 B</label><label>最多取 <select value={topN} onChange={event => setTopN(Number(event.target.value))}><option value={1}>1 段</option><option value={2}>2 段</option><option value={3}>3 段</option></select></label></div>
    <div className={styles.status} role="status" data-failed={mode === "failed"}>{mode === "failed" ? "重排失败：本例沿用召回顺序" : mode === "rerank" ? "重排分 · 只比较已有候选" : "召回分 · 原先的排列"}</div>
    <div className={styles.rack} style={{ height: `${ranked.length * 83}px` }}>{ranked.map((doc, index) => <button type="button" key={doc.id} className={styles.paper} style={{ top: `${index * 83}px` }} data-kept={index < topN} aria-pressed={selectedId === doc.id} aria-label={`查看候选 ${doc.id}：${doc.title}，当前第 ${index + 1} 位`} onClick={() => setSelectedId(doc.id)}><b>{doc.id}</b><span>{doc.title}<i>{doc.text}</i></span><div className={styles.score}><code>{doc[scoreKey].toFixed(2)}</code><span style={{ width: `${doc[scoreKey] * 100}%` }} /></div></button>)}<div className={styles.cutoff} style={{ top: `${Math.min(topN, ranked.length) * 83 - 5}px` }}>取到这里</div></div>
    <div className={styles.excluded}><b>D · 银行延迟说明</b><span>未进入候选，没有重排分</span></div>
    <div className={styles.selectedText} aria-live="polite"><span>{selected.id} · 正文</span><p>{selected.text}</p></div>
    <output className={styles.returned} aria-live="polite">返回 {kept.map(doc => doc.id).join("、")}{missedAnswer ? "；其中没有退款到账时间的 B" : ""}</output>
    <figcaption>资料与分数均为教学示例，未调用重排模型。分数用于当前排序，不代表答案正确概率；D 不会因为重排而进入候选。</figcaption>
  </figure>;
}
