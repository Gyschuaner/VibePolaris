'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, FileText, Check, Minus } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { retrieve, retrievalQueries, retrievalDocuments, chunkDocument, splitCharacters, splitParagraphs, chunkSummary, rerankCandidates, rerankDocuments, rerankQueries, assessCandidate, rerank, type TextChunk } from '@/lib/selection-teaching';
import base from './EventConcepts.module.css';
import s from './SelectionConcepts.module.css';

export function RetrievalLesson() {
  const [query, setQuery] = useState(0), [staff, setStaff] = useState(false), [limit, setLimit] = useState(2);
  const [retrieved, setRetrieved] = useState(false), [read, setRead] = useState(false);
  const [packet, setPacket] = useState(retrieve(0, false, 2));
  const [readPacket, setReadPacket] = useState(packet);
  const clear = () => { setRetrieved(false); setRead(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：检索候选与原文">
    <div className={s.controls}>
      <label>查询<select value={query} onChange={e => { setQuery(Number(e.target.value)); clear(); }}>{retrievalQueries.map((q, i) => <option key={q} value={i}>{q}</option>)}</select></label>
      <label>身份<select value={staff ? 'staff' : 'reader'} onChange={e => { setStaff(e.target.value === 'staff'); clear(); }}><option value="reader">读者</option><option value="staff">运营（演示）</option></select></label>
      <label>最多返回<select value={limit} onChange={e => { setLimit(Number(e.target.value)); clear(); }}><option value={2}>2 条</option><option value={3}>3 条</option></select></label>
    </div>
    <div className={s.catalog} aria-label="文档集合">{retrievalDocuments.map(doc => <div key={doc.id} data-hit={retrieved && packet.some(hit => hit.id === doc.id)} data-excluded={!staff && doc.access === '运营'}><FileText size={23}/><strong>{doc.id} · {doc.title}</strong><span>{doc.access} · 词项：{doc.keywords.join('、')}</span></div>)}</div>
    <div className={s.actions}><button disabled={retrieved} onClick={() => { setPacket(retrieve(query, staff, limit)); setRetrieved(true); }}>检索候选<ArrowRight size={18}/></button><button disabled={!retrieved || !packet.length || read} onClick={() => { setReadPacket(packet); setRead(true); }}>读取候选原文</button></div>
    <Reveal open={retrieved}><p className={s.result} role="status">{packet.length ? `候选 ${packet.map(doc => doc.id).join('、')} · ${packet.length} 条` : '没有匹配的候选。这里没有可读取的结果。'}</p></Reveal>
    <Reveal open={read}><div className={s.originals} aria-label="选中候选的原文">{readPacket.map(doc => <div key={doc.id}><h3>{doc.id} · {doc.title}</h3><p>{doc.text}</p></div>)}</div></Reveal>
    <button className={base.reset} onClick={() => { setQuery(0); setStaff(false); setLimit(2); clear(); }}><ArrowCounterClockwise size={17}/>重置候选与原文</button>
  </div>;
}

export function ChunkingLesson() {
  const [method, setMethod] = useState('characters'), [size, setSize] = useState(24), [overlap, setOverlap] = useState(8);
  const [open, setOpen] = useState(false), [checked, setChecked] = useState(false), [active, setActive] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<TextChunk[]>([]);
  const clear = () => { setOpen(false); setChecked(false); setActive(null); };
  const selected = open ? blocks.find(block => block.id === active) : undefined;
  const chars = Array.from(chunkDocument), summary = chunkSummary(blocks);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：原文切分与条件句">
    <div className={s.sourceSheet}><h3>退款说明 · 原文</h3><p>{selected ? <>{chars.slice(0, selected.start).join('')}<mark>{selected.text}</mark>{chars.slice(selected.end).join('')}</> : chunkDocument}</p></div>
    <div className={s.controls}>
      <label>切分方式<select value={method} onChange={e => { setMethod(e.target.value); clear(); }}><option value="characters">按字符</option><option value="paragraphs">按段落</option></select></label>
      <label>块长<select disabled={method === 'paragraphs'} value={size} onChange={e => { setSize(Number(e.target.value)); clear(); }}><option value={24}>24 字符</option><option value={48}>48 字符</option></select></label>
      <label>重叠<select disabled={method === 'paragraphs'} value={overlap} onChange={e => { setOverlap(Number(e.target.value)); clear(); }}><option value={0}>0 字符</option><option value={8}>8 字符</option></select></label>
    </div>
    <div className={s.actions}><button disabled={open} onClick={() => { setBlocks(method === 'paragraphs' ? splitParagraphs(chunkDocument) : splitCharacters(chunkDocument, size, overlap)); setActive(null); setOpen(true); }}>切分原文<ArrowRight size={18}/></button><button disabled={!open || checked} onClick={() => setChecked(true)}>检查条件句</button></div>
    <Reveal open={open}><div className={s.chunks} aria-label="切分后的块">{blocks.map(block => <button key={block.id} aria-pressed={active === block.id} onClick={() => setActive(block.id)}><span>块 {block.id} · 字符 {block.start + 1}–{block.end}</span><p>{block.text}</p></button>)}</div><p className={s.result}>{blocks.length} 块 · 重复覆盖 {summary.duplicated} 个字符</p></Reveal>
    <Reveal open={checked}><p className={s.checkResult} role="status">{summary.completeCondition ? `${summary.completeCondition} 块保留了完整的“审核通过后，三个工作日内到账”条件句。` : '没有一个块保留完整到账条件句。试试按段落切分，再检查一次。'}</p></Reveal>
    <button className={base.reset} onClick={() => { setMethod('characters'); setSize(24); setOverlap(8); clear(); }}><ArrowCounterClockwise size={17}/>重置切分与标记</button>
  </div>;
}

export function RerankingLesson() {
  const [query, setQuery] = useState(0), [window, setWindow] = useState(2), [cursor, setCursor] = useState(0), [sorted, setSorted] = useState(false);
  const [report, setReport] = useState(rerank(2, 0));
  const [records, setRecords] = useState<ReturnType<typeof assessCandidate>[]>([]);
  const candidates = rerankCandidates(window), current = candidates[cursor];
  const clear = () => { setCursor(0); setSorted(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：逐对核对与重排序">
    <div className={s.controls}>
      <label>查询<select value={query} onChange={e => { setQuery(Number(e.target.value)); clear(); }}>{rerankQueries.map((q, i) => <option key={q.text} value={i}>{q.text}</option>)}</select></label>
      <label>已取回候选<select value={window} onChange={e => { setWindow(Number(e.target.value)); clear(); }}><option value={2}>A、C · 2 条</option><option value={3}>A、C、B · 3 条</option><option value={0}>无候选</option></select></label>
    </div>
    <div className={s.pairDesk}><div className={s.querySheet}><h3>查询条件</h3>{rerankQueries[query].needs.map(need => <span key={need}>{need}</span>)}</div><div className={s.candidateSheet}><States index={current ? cursor : 3}>{[...rerankDocuments.map(doc => <div key={doc.id}><h3>{doc.id} · {doc.title}</h3><p>{doc.text}</p></div>), <p key="end">{candidates.length ? '所有候选已核对，可以重新排序。' : '没有候选，无法开始逐对核对。'}</p>]}</States></div></div>
    <div className={s.actions}><button disabled={!current} onClick={() => { setRecords(candidates.slice(0, cursor + 1).map(doc => assessCandidate(doc, query))); setCursor(n => n + 1); }}>核对这篇原文<Check size={18}/></button><button disabled={!candidates.length || cursor !== candidates.length || sorted} onClick={() => { setReport(rerank(window, query)); setSorted(true); }}>排成新顺序<ArrowRight size={18}/></button></div>
    <Reveal open={cursor > 0}><div className={s.assessments} aria-label="已核对的候选">{records.map(doc => <div key={doc.id}><strong>{doc.id}</strong><span>{doc.matched} / {doc.checks.length} 条条件</span>{doc.checks.map(check => <span key={check.need} data-matches={check.matches}>{check.matches ? <Check size={15}/> : <Minus size={15}/>} {check.need}</span>)}</div>)}</div></Reveal>
    <Reveal open={sorted}><div className={s.sortedList} aria-label="重新排序的候选">{report.map((doc, i) => <div key={doc.id}><span>{i + 1}</span><div><h3>{doc.id} · {doc.title}</h3><p>{doc.text}</p></div><strong>{doc.matched} / {doc.checks.length}</strong></div>)}</div><p className={s.checkResult} role="status">{report.some(doc => doc.matched === doc.checks.length) ? '首条满足本例的全部手工条件。原文仍需核对，排序没有修改内容。' : '候选中没有满足全部条件的文档。重排无法找回未进入候选的 B。'}</p></Reveal>
    <button className={base.reset} onClick={() => { setQuery(0); setWindow(2); clear(); }}><ArrowCounterClockwise size={17}/>重置候选与核对</button>
  </div>;
}
