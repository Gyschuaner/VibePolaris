'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, MagnifyingGlass } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { frameRows, frameSelection, postings, textDocuments, textSearch, queryVectors, vectorPoints, vectorSearch, type TextMode, type VectorScope } from '@/lib/retrieval-teaching';
import base from './EventConcepts.module.css';
import s from './RetrievalConcepts.module.css';

const frameCases = [0, 1, 10].flatMap(min => [true, false].map(book => frameSelection(min, book)));
export function FrameLesson() {
  const [min, setMin] = useState(0);
  const [book, setBook] = useState(true);
  const index = frameCases.findIndex(item => item.minDays === min && item.includeBook === book);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：筛选行与选择列">
    <div className={s.actions}>{[0, 1, 10].map(value => <button key={value} aria-pressed={min === value} onClick={() => setMin(value)}>{value === 0 ? '全部记录' : value === 1 ? '逾期 ≥ 1 天' : '逾期 ≥ 10 天'}</button>)}</div>
    <label className={s.checkbox}><input type="checkbox" checked={book} onChange={e => setBook(e.target.checked)}/>保留书目列</label>
    <div className={s.frameDesk}><div><h3>原始数据 · 4 × 3</h3><div className={s.frameSource} role="table" aria-label="原始四行数据"><div role="row"><span role="columnheader">标签</span><span role="columnheader">书目</span><span role="columnheader">逾期天数</span><span role="columnheader">馆</span></div>{frameRows.map(row => <div key={row.label} role="row" data-kept={row.days >= min}><strong role="rowheader">{row.label}</strong><span role="cell" data-selected={book}>#{row.book}</span><span role="cell">{row.days}</span><span role="cell">{row.branch}</span></div>)}</div></div>
      <div className={s.frameOutput} role="status"><States index={index}>{frameCases.map((item, i) => <div key={i}><h3>结果 · {item.shape.join(' × ')}</h3><code>days ≥ {item.minDays}<br/>[{item.columns.join(', ')}]</code><div className={s.frameResult} role="table" aria-label="筛选结果" style={{ gridTemplateColumns: `28px repeat(${item.columns.length}, minmax(0,1fr))` }}><div className={s.resultRow} role="row"><span role="columnheader">标签</span>{item.columns.map(c => <span role="columnheader" key={c}>{c === 'book' ? '书目' : c === 'days' ? '天数' : '馆'}</span>)}</div>{item.rows.map(row => <div className={s.resultRow} role="row" key={row.label}><strong role="rowheader">{row.label}</strong>{row.values.map((v, n) => <span role="cell" key={n}>{v}</span>)}</div>)}</div>{!item.rows.length && <p>没有满足条件的行。列定义仍保留。</p>}</div>)}</States></div>
    </div><button className={base.reset} onClick={() => { setMin(0); setBook(true); }}><ArrowCounterClockwise size={17}/>重置筛选与列</button>
  </div>;
}

const modeNames = { and: '全部词项 AND', or: '任一词项 OR', phrase: '相邻短语' };
export function TextLesson() {
  const [query, setQuery] = useState('借阅 续借');
  const [mode, setMode] = useState<TextMode>('and');
  const [report, setReport] = useState(() => textSearch('借阅 续借', 'and'));
  const [shown, setShown] = useState(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：倒排索引与词项匹配">
    <form className={s.searchForm} onSubmit={e => { e.preventDefault(); setReport(textSearch(query, mode)); setShown(true); }}><label htmlFor="text-query">查询词项，用空格分开</label><div><input id="text-query" value={query} onChange={e => { setQuery(e.target.value); setShown(false); }}/><button type="submit"><MagnifyingGlass size={18}/>检索</button></div></form>
    <div className={s.actions}>{(['and', 'or', 'phrase'] as const).map(value => <button key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setShown(false); }}>{modeNames[value]}</button>)}</div>
    <div className={s.textDesk}><div><h3>词项 → 文档与位置</h3><div className={s.postings}>{postings.map(item => <div key={item.term} data-active={shown && report.terms.includes(item.term)}><strong>{item.term}</strong><code>{item.entries.map(e => `${e.id}:${e.position}`).join('　')}</code></div>)}</div></div><div><h3>五篇文档</h3>{textDocuments.map(doc => <div key={doc.id} className={s.doc} data-match={shown && report.ids.includes(doc.id)}><strong>{doc.id}</strong><div>{doc.terms.map((term, i) => <span key={i} data-hit={shown && report.ids.includes(doc.id) && report.terms.includes(term)}>{term}<i>{i + 1}</i></span>)}</div></div>)}</div></div>
    <Reveal open={shown}><div className={s.textReport} role="status"><strong>{!report.terms.length ? '请输入至少一个词项' : report.ids.length ? `${modeNames[report.mode]} · 命中 ${report.ids.join('、')}` : '没有匹配的文档'}</strong><p>{report.terms.length ? report.terms.map((term, i) => `${term} → ${report.lists[i].map(e => e.id).join('、') || '空集合'}`).join('；') : '空查询没有执行匹配。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setQuery('借阅 续借'); setMode('and'); setShown(false); }}><ArrowCounterClockwise size={17}/>重置查询</button>
  </div>;
}

export function VectorLesson() {
  const [query, setQuery] = useState<0 | 1>(0);
  const [scope, setScope] = useState<VectorScope>('all');
  const [updated, setUpdated] = useState(false);
  const [report, setReport] = useState(() => vectorSearch(0, 'all', false));
  const [shown, setShown] = useState(false);
  const points = vectorPoints(updated); const q = queryVectors[query];
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：向量候选与距离排序">
    <div className={s.actions}>{queryVectors.map((value, i) => <button key={i} aria-pressed={query === i} onClick={() => { setQuery(i as 0 | 1); setShown(false); }}>查询 [{value.join(', ')}]</button>)}</div>
    <label className={s.scope}>候选范围<select value={scope} onChange={e => { setScope(e.target.value as VectorScope); setShown(false); }}><option value="all">全部记录</option><option value="public">仅公开记录</option><option value="archived">仅归档记录</option></select></label>
    <div className={s.vectorDesk}><svg className={s.plot} viewBox="0 0 300 300" role="img" aria-label={`二维坐标：查询${q.join(',')}；A位于${updated ? '9,8' : '3,2'}，B为内部记录，其他点见右侧记录`}><path d="M30 18V270H282" className={s.axis}/>{[0, 5, 10].map(n => <g key={n}><text x={30 + n * 24} y="289" textAnchor="middle">{n}</text><text x="20" y={274 - n * 24} textAnchor="end">{n}</text></g>)}<text x="283" y="265">x</text><text x="35" y="18">y</text>
      {points.map(point => <g key={point.id} className={s.point} style={{ transform: `translate(${30 + point.x * 24}px,${270 - point.y * 24}px)` }} data-excluded={scope !== 'all' && point.scope !== scope} data-hit={shown && report.hits.some(hit => hit.id === point.id)}><circle r="7"/><text x="10" y="-8">{point.id}</text></g>)}<g className={s.queryPoint} style={{ transform: `translate(${30 + q[0] * 24}px,${270 - q[1] * 24}px)` }}><circle r="14"/><path d="M-5 0H5M0-5V5"/><text x="-16" y="28">q</text></g></svg>
      <div className={s.vectorRecords}><h3>记录 · 坐标 / 范围</h3>{points.map(point => <div key={point.id} data-excluded={scope !== 'all' && point.scope !== scope}><strong>{point.id}</strong><span>{point.title}<code>[{point.x}, {point.y}] · {point.scope === 'public' ? '公开' : '内部'}</code></span></div>)}</div></div>
    <div className={s.actions}><button onClick={() => { setReport(vectorSearch(query, scope, updated)); setShown(true); }}>计算最近 2 条</button><button disabled={updated} onClick={() => { setUpdated(true); setShown(false); }}>更新 A 的向量到 [9, 8]</button></div>
    <Reveal open={shown}><div className={s.vectorReport} role="status"><h3>候选 {report.candidates.length} 条 · 返回 {report.hits.length} 条</h3>{report.hits.map((hit, i) => <div key={hit.id}><span>{i + 1}</span><strong>{hit.id} · {hit.title}</strong><code>距离 {hit.distance.toFixed(2)}</code></div>)}{!report.hits.length && <p>没有符合范围的记录，不返回其他范围来凑数。</p>}<p>先限定候选，再按欧氏距离排序。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setQuery(0); setScope('all'); setUpdated(false); setShown(false); }}><ArrowCounterClockwise size={17}/>重置向量与查询</button>
  </div>;
}
