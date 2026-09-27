'use client';
import { useState, type CSSProperties } from 'react';
import { ArrowCounterClockwise, ArrowRight, Database, FileText, LinkSimple, Check } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { fuseRanks, hybridDocuments, hybridLanes, refundRecord, printingRecord, upsertRecord, queryStore, citationClaims, citationPassages, checkCitation, type StoreRecord } from '@/lib/evidence-teaching';
import base from './EventConcepts.module.css';
import s from './EvidenceConcepts.module.css';

export function HybridLesson() {
  const [lexical, setLexical] = useState(true), [semantic, setSemantic] = useState(true), [window, setWindow] = useState(3);
  const [open, setOpen] = useState(false), [report, setReport] = useState<ReturnType<typeof fuseRanks>>([]);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：两路候选融合">
    <h3>MX-42 经常断开连接</h3>
    <div className={s.controls}><label className={s.toggle}><input type="checkbox" checked={lexical} onChange={e => { setLexical(e.target.checked); setOpen(false); }}/>关键词路线</label><label className={s.toggle}><input type="checkbox" checked={semantic} onChange={e => { setSemantic(e.target.checked); setOpen(false); }}/>语义路线</label><label>每路候选窗口<select value={window} onChange={e => { setWindow(Number(e.target.value)); setOpen(false); }}><option value={3}>3 条</option><option value={1}>1 条</option></select></label></div>
    <div className={s.lanes}>{hybridLanes.map((lane, route) => <div key={route} data-disabled={!(route === 0 ? lexical : semantic)}><h3>{route === 0 ? '关键词排名' : '语义排名'}</h3>{lane.map((id, rank) => <div key={id} data-outside={rank >= window}><span>{rank + 1}</span><FileText size={20}/><strong>{id} · {hybridDocuments.find(doc => doc.id === id)?.title}</strong></div>)}</div>)}</div>
    <button disabled={open} onClick={() => { setReport(fuseRanks(lexical, semantic, window)); setOpen(true); }}>按 RRF 融合<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.fusion} aria-label="融合后的排名">{report.slice(0, 3).map((row, index) => <div key={row.id}><span>{index + 1}</span><div><h3>{row.id} · {row.title}</h3><div className={s.bars}>{row.parts.map((part, route) => <span key={route} style={{ '--part': part * 1600 } as CSSProperties} data-route={route}/>)}</div><p>{row.ranks.map((rank, route) => `${route === 0 ? '关键词' : '语义'}：${rank ? `第 ${rank} 名 → 1/${60 + rank}` : '未进入候选 → 0'}`).join('；')}</p></div><strong>{row.score.toFixed(5)}</strong></div>)}</div><p className={s.result} role="status">{report.length ? `${report.length} 个不同文档，最终显示前 ${Math.min(3, report.length)} 条。分数是排名贡献之和。` : '两条路线都已关闭，没有候选可以融合。'}</p></Reveal>
    <button className={base.reset} onClick={() => { setLexical(true); setSemantic(true); setWindow(3); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置路线与融合</button>
  </div>;
}

export function VectorStoreLesson() {
  const [version, setVersion] = useState(1), [onlyCurrent, setOnlyCurrent] = useState(false), [records, setRecords] = useState<StoreRecord[]>([]);
  const [open, setOpen] = useState(false), [report, setReport] = useState<ReturnType<typeof queryStore>>([]);
  const a = records.find(row => row.id === 'A');
  const [savedVersion, setSavedVersion] = useState(1);
  const mutate = (next: StoreRecord[]) => { setRecords(next); setOpen(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：向量记录与版本同步">
    <div className={s.storeDesk}><div className={s.sourcePaper}><FileText size={23}/><h3>原文 A · 退款规则</h3><label>原文版本<select value={version} onChange={e => { setVersion(Number(e.target.value)); setOpen(false); }}><option value={1}>v1 · 三个工作日</option><option value={2}>v2 · 七个工作日</option></select></label><States index={version - 1}>{[1, 2].map(v => <p key={v}>{refundRecord(v).text}</p>)}</States><p>原文 B · 打印服务 · v1</p></div>
      <div className={s.stored}><Database size={23}/><h3>已存记录 · {records.length} 条</h3><Reveal open={!!a}><div className={s.record}><States index={savedVersion - 1}>{[1, 2].map(v => <div key={v}><strong>ID A · v{v}</strong><code>[{refundRecord(v).vector.join(', ')}]</code><p>{refundRecord(v).text}</p></div>)}</States></div></Reveal><Reveal open={records.some(row => row.id === 'B')}><div className={s.record}><strong>ID B · v1</strong><code>[0, 1]</code><p>{printingRecord.text}</p></div></Reveal><Reveal open={!records.length}><p>还没有记录。先写入，再查询。</p></Reveal></div></div>
    <div className={s.actions}><button disabled={records.length > 0} onClick={() => { setSavedVersion(version); mutate([refundRecord(version), printingRecord]); }}>写入 A、B</button><button disabled={a?.version === version || !records.length} onClick={() => { setSavedVersion(version); mutate(upsertRecord(records, refundRecord(version))); }}>同步退款规则</button><button disabled={!a} onClick={() => mutate(records.filter(row => row.id !== 'A'))}>删除记录 A</button></div>
    <div className={s.controls}><label className={s.toggle}><input type="checkbox" checked={onlyCurrent} onChange={e => { setOnlyCurrent(e.target.checked); setOpen(false); }}/>只看当前原文版本</label><button disabled={open} onClick={() => { setReport(queryStore(records, version, onlyCurrent)); setOpen(true); }}>查询退款<ArrowRight size={18}/></button></div>
    <Reveal open={open}><div className={s.receipt} role="status">{report.length ? <><h3>返回 {report[0].id} · v{report[0].version} · 余弦 {report[0].score.toFixed(2)}</h3><p>{report[0].text}</p><strong>{report[0].stale ? '这是旧版本记录，不能据此说明当前退款规则。' : '记录与本例当前原文版本一致。'}</strong></> : <p>没有记录同时满足版本条件与余弦大于 0.2。没有可用依据。</p>}</div></Reveal>
    <button className={base.reset} onClick={() => { setVersion(1); setOnlyCurrent(false); mutate([]); }}><ArrowCounterClockwise size={17}/>重置原文与记录</button>
  </div>;
}

export function CitationLesson() {
  const [claim, setClaim] = useState(0), [passage, setPassage] = useState(0), [attached, setAttached] = useState(false), [located, setLocated] = useState(false), [checked, setChecked] = useState(false);
  const [report, setReport] = useState(checkCitation(0, 0));
  const clear = () => { setAttached(false); setLocated(false); setChecked(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：句子与引用依据">
    <div className={s.controls}><label>待写句子<select value={claim} onChange={e => { setClaim(Number(e.target.value)); clear(); }}><option value={0}>有限定条件的时效</option><option value={1}>所有退款都保证到账</option><option value={2}>退款完全免费</option></select></label><label>选择出处<select value={passage} onChange={e => { setPassage(Number(e.target.value)); clear(); }}>{citationPassages.map((p, i) => <option key={p.title} value={i}>{p.title}</option>)}</select></label></div>
    <div className={s.citationDesk}><div className={s.draft}><h3>草稿</h3><States index={claim}>{citationClaims.map(text => <p key={text}>{text}</p>)}</States><button className={s.marker} data-visible={attached} disabled={!attached} aria-hidden={!attached} aria-label="定位演示引用 1" onClick={() => setLocated(true)}>[1]<LinkSimple size={15}/></button></div><div className={s.passages} aria-label="可核对的原文">{citationPassages.map((p, i) => <div key={p.title} data-located={located && passage === i}><h3>{p.title}</h3><p>{p.text}</p></div>)}</div></div>
    <div className={s.actions}><button disabled={attached} onClick={() => setAttached(true)}>标记出处<LinkSimple size={18}/></button><button disabled={!attached || checked} onClick={() => { setReport(checkCitation(claim, passage)); setChecked(true); }}>核对这条引用<Check size={18}/></button></div>
    <Reveal open={checked}><div className={s.receipt} role="status"><h3>{report.kind === 'full' ? '原文支持' : report.kind === 'partial' ? '只有部分支持' : '缺少对应依据'}</h3><p>{report.text}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setClaim(0); setPassage(0); clear(); }}><ArrowCounterClockwise size={17}/>重置句子与引用</button>
  </div>;
}
