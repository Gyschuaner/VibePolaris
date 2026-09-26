'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, FileText } from '@phosphor-icons/react';
import { Reveal } from './ExtendedConceptLessons';
import { embeddingTexts, embeddingVector, compareEmbedding, semanticQueries, searchDocuments, semanticSearch, relevantIds, ragCases, ragDocuments, ragPacket, ragAnswer, type Triple } from '@/lib/semantic-teaching';
import base from './EventConcepts.module.css';
import s from './SemanticConcepts.module.css';

function Components({ vector }: { vector: Triple }) {
  return <div className={s.components}>{vector.map((value, i) => <div key={i}><code>{i + 1}</code><div className={s.componentScale}><i style={{ width: `${Math.abs(value) * 50}%`, left: value < 0 ? `${50 + value * 50}%` : '50%' }}/></div><code>{value.toFixed(2)}</code></div>)}</div>;
}
export function EmbeddingLesson() {
  const [text, setText] = useState(1), [space, setSpace] = useState(0);
  const [encoded, setEncoded] = useState(false), [compared, setCompared] = useState(false);
  const [snapshot, setSnapshot] = useState({ text: 1, space: 0 });
  const clear = () => { setEncoded(false); setCompared(false); };
  const score = compareEmbedding(snapshot.text, snapshot.space);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：嵌入表示与兼容性">
    <label className={s.control}>输入文本<select value={text} onChange={e => { setText(Number(e.target.value)); clear(); }}>{embeddingTexts.map((t, i) => <option key={t} value={i}>{t}</option>)}</select></label>
    <label className={s.control}>表示空间<select value={space} onChange={e => { setSpace(Number(e.target.value)); clear(); }}><option value={0}>编码器 A</option><option value={1}>编码器 B · 未与 A 对齐</option></select></label>
    <div className={s.actions}><button disabled={encoded} onClick={() => { setSnapshot({ text, space }); setEncoded(true); }}>生成预设表示<ArrowRight size={17}/></button><button disabled={!encoded} onClick={() => setCompared(true)}>与参照句比较</button></div>
    <div className={s.embeddingDesk}><div><h3>参照 · 编码器 A</h3><p>{embeddingTexts[0]}</p><Components vector={embeddingVector(0, 0)}/></div><div className={s.vectorSheet}><Reveal open={encoded}><div><h3>当前表示 · 编码器 {snapshot.space === 0 ? 'A' : 'B'}</h3><p>{embeddingTexts[snapshot.text]}</p><Components vector={embeddingVector(snapshot.text, snapshot.space)}/><code>[{embeddingVector(snapshot.text, snapshot.space).join(', ')}]</code></div></Reveal></div></div>
    <Reveal open={compared}><div className={s.comparison} role="status"><strong>{score === null ? '不同表示空间，停止比较' : `余弦相似度 ${score.toFixed(2)}`}</strong><p>{score === null ? '维度都是 3，也不能据此把 B 的分量与 A 直接配对。' : '点积 ÷ 两个向量长度的乘积；这个数不是事实正确率。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setText(1); setSpace(0); clear(); }}><ArrowCounterClockwise size={17}/>重置文本与表示</button>
  </div>;
}

export function SemanticLesson() {
  const [query, setQuery] = useState(0), [current, setCurrent] = useState(false), [k, setK] = useState(2), [threshold, setThreshold] = useState(.2);
  const [report, setReport] = useState(() => semanticSearch(0, false, 2, .2));
  const [searched, setSearched] = useState(false), [evaluated, setEvaluated] = useState(false);
  const clear = () => { setSearched(false); setEvaluated(false); };
  const ordering = searched ? [...report.ranked.map(d => d.id), ...searchDocuments.filter(d => !report.ranked.some(r => r.id === d.id)).map(d => d.id)] : searchDocuments.map(d => d.id);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：语义候选排序与评估">
    <label className={s.control}>预设查询<select value={query} onChange={e => { setQuery(Number(e.target.value)); clear(); }}>{semanticQueries.map((q, i) => <option value={i} key={q}>{q}</option>)}</select></label>
    <div className={s.searchControls}><label><input type="checkbox" checked={current} onChange={e => { setCurrent(e.target.checked); clear(); }}/>仅现行版本</label><label>返回数量<select value={k} onChange={e => { setK(Number(e.target.value)); clear(); }}>{[1, 2, 3].map(n => <option key={n}>{n}</option>)}</select></label><label>最低分数<select value={threshold} onChange={e => { setThreshold(Number(e.target.value)); clear(); }}><option value={.2}>0.20</option><option value={.95}>0.95</option></select></label></div>
    <div className={s.actions}><button onClick={() => { setReport(semanticSearch(query, current, k, threshold)); setSearched(true); setEvaluated(false); }}>检索候选</button><button disabled={!searched} onClick={() => setEvaluated(true)}>对照人工标注</button></div>
    <div key={searched ? `${query}-${current}-${k}-${threshold}` : 'initial'} className={s.rankTrack} data-sorted={searched} aria-label="四篇文档的排序">{searchDocuments.map((doc, original) => {
      const ranked = report.ranked.find(d => d.id === doc.id), hit = searched && report.hits.some(d => d.id === doc.id);
      return <div key={doc.id} className={s.rankedDoc} style={{ transform: `translateY(${ordering.indexOf(doc.id) * 100}px)` }} data-hit={hit} data-excluded={searched && !ranked}><span>{searched ? ordering.indexOf(doc.id) + 1 : original + 1}</span><div><strong>{doc.id} · {doc.title}</strong><code>{doc.version} · [{doc.vector.join(', ')}]</code><i className={s.scoreBar} style={{ width: `${searched && ranked ? Math.max(0, ranked.score) * 100 : 0}%` }}/></div><code>{searched && ranked ? ranked.score.toFixed(3) : '—'}</code></div>;
    })}</div>
    <Reveal open={searched}><div className={s.searchResult} role="status"><strong>{report.hits.length ? `返回 ${report.hits.map(d => d.id).join('、')}` : '没有满足条件的候选'}</strong><p>候选 {report.ranked.length} 条 · k = {report.k} · 分数 ≥ {report.threshold.toFixed(2)}</p></div></Reveal>
    <Reveal open={evaluated}><div className={s.metrics} aria-label="人工标注评估"><p>当前查询的相关文档：{relevantIds[report.query].join('、') || '无'}。命中相关文档 {report.correct} 条。</p><div><span>精确率<strong>{report.precision === null ? '未定义 · 返回 0 条' : `${report.correct} / ${report.hits.length}`}</strong></span><span>召回率<strong>{report.recall === null ? '未定义 · 无相关标注' : `${report.correct} / ${relevantIds[report.query].length}`}</strong></span></div></div></Reveal>
    <button className={base.reset} onClick={() => { setQuery(0); setCurrent(false); setK(2); setThreshold(.2); clear(); }}><ArrowCounterClockwise size={17}/>重置检索与评估</button>
  </div>;
}

export function RagLesson() {
  const [scenario, setScenario] = useState(0), [retrieved, setRetrieved] = useState(false), [answered, setAnswered] = useState(false);
  const [packet, setPacket] = useState(['A', 'B']), [active, setActive] = useState<string[]>([]);
  const answer = ragAnswer(packet);
  const clear = () => { setRetrieved(false); setAnswered(false); setActive([]); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：RAG材料与回答依据">
    <p className={s.question}>这本书能续借吗？能延长几天？</p>
    <div className={s.actions}>{ragCases.map((name, i) => <button key={name} aria-pressed={scenario === i} onClick={() => { setScenario(i); clear(); }}>{name}</button>)}</div>
    <div className={s.actions}><button disabled={retrieved} onClick={() => { setPacket(ragPacket(scenario)); setRetrieved(true); }}>取回预设资料<FileText size={17}/></button><button disabled={!retrieved} onClick={() => { setAnswered(true); setActive([]); }}>按资料组织答复</button></div>
    <div className={s.ragDesk}><div><h3>本轮资料</h3><Reveal open={retrieved}><div className={s.evidence}>{ragDocuments.filter(doc => packet.includes(doc.id)).map(doc => <div key={doc.id} data-active={active.includes(doc.id)}><strong>{doc.id} · {doc.title}</strong><p>{doc.text}</p></div>)}</div></Reveal></div>
      <div className={s.answerSheet}><h3>答复与依据</h3><Reveal open={answered}><div>{answer.claims.map(claim => <button key={claim.text} className={s.claim} onClick={() => setActive(claim.sources)} aria-pressed={claim.sources.join() === active.join()}>{claim.text}<span>{claim.sources.map(id => `[${id}]`).join(' ')}</span></button>)}<p className={s.conclusion} role="status">{answer.conclusion}</p></div></Reveal></div></div>
    <button className={base.reset} onClick={() => { setScenario(0); clear(); }}><ArrowCounterClockwise size={17}/>重置资料与答复</button>
  </div>;
}
