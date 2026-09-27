'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Check, FileText, MagnifyingGlass, X } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { groundingMaterials, composeGroundedAnswer, hallClaims, hallPolicies, auditClaim, scoreEvaluation, type Channel, type EvalScope } from '@/lib/quality-teaching';
import base from './EventConcepts.module.css';
import s from './QualityConcepts.module.css';

export function GroundingLesson() {
  const [channel, setChannel] = useState<Channel>('online'), [selected, setSelected] = useState(['A', 'B']);
  const [open, setOpen] = useState(false), [report, setReport] = useState(composeGroundedAnswer('online', ['A', 'B']));
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：按资料范围组织回答">
    <div className={s.controls}><label>退款渠道<select value={channel} onChange={e => { setChannel(e.target.value as Channel); setOpen(false); }}><option value="online">线上</option><option value="store">门店</option></select></label><h3>多久能到账，有服务费吗？</h3></div>
    <div className={s.materials}>{groundingMaterials.map(row => <button key={row.id} aria-pressed={selected.includes(row.id)} onClick={() => { setSelected(ids => ids.includes(row.id) ? ids.filter(id => id !== row.id) : [...ids, row.id]); setOpen(false); }}><span><FileText size={20}/>{row.id} · {row.title}<Check size={17} className={s.selectedMark}/></span><p>{row.text}</p></button>)}</div>
    <button disabled={open} onClick={() => { setReport(composeGroundedAnswer(channel, selected)); setOpen(true); }}>按资料组织回答<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.assembly} role="status"><h3>{report.scope}退款 · 回答</h3>{report.parts.map(part => <div key={part.label}><span>{part.label}</span><p>{part.text}</p><strong>{part.source ? `依据 ${part.source}` : '资料不足'}</strong></div>)}</div></Reveal>
    <button className={base.reset} onClick={() => { setChannel('online'); setSelected(['A', 'B']); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置渠道与资料</button>
  </div>;
}

export function HallucinationLesson() {
  const [claim, setClaim] = useState(0), [version, setVersion] = useState(1);
  const [sourceOpen, setSourceOpen] = useState(false), [factOpen, setFactOpen] = useState(false), [report, setReport] = useState(auditClaim(0, 1)), [factReport, setFactReport] = useState(auditClaim(0, 1));
  const clear = () => { setSourceOpen(false); setFactOpen(false); };
  const sourceLabels = { consistent: '与提供原文一致', conflict: '与提供原文冲突', unknown: '提供原文无法核实' };
  const factLabels = { correct: '符合本例当前规则', wrong: '不符合本例当前规则', unknown: '当前资料仍无法核实' };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：来源与当前事实两次核对">
    <div className={s.controls}><label>待核对回答<select value={claim} onChange={e => { setClaim(Number(e.target.value)); clear(); }}><option value={0}>通常三个工作日</option><option value={1}>通常七个工作日</option><option value={2}>退款完全免费</option></select></label><label>提供的来源版本<select value={version} onChange={e => { setVersion(Number(e.target.value)); clear(); }}><option value={1}>v1 · 三个工作日</option><option value={2}>v2 · 七个工作日</option></select></label></div>
    <div className={s.claimDesk}><div><h3>回答</h3><States index={claim}>{hallClaims.map(text => <p key={text}>{text}</p>)}</States></div><div><h3>提供的原文</h3><States index={version - 1}>{hallPolicies.map((text, i) => <p key={text}>v{i + 1} · {text}</p>)}</States></div></div>
    <div className={s.actions}><button disabled={sourceOpen} onClick={() => { setReport(auditClaim(claim, version)); setSourceOpen(true); }}>核对提供的材料<MagnifyingGlass size={18}/></button><button disabled={!sourceOpen || factOpen} onClick={() => { setFactReport(report); setFactOpen(true); }}>核对当前版本<ArrowRight size={18}/></button></div>
    <Reveal open={sourceOpen}><div className={s.sourceCheck} role="status"><strong>{sourceLabels[report.source as keyof typeof sourceLabels]}</strong><p>这一步只比较回答与提供的 v{report.providedVersion} 原文。</p></div></Reveal>
    <Reveal open={factOpen}><div className={s.factCheck} role="status"><h3>本例当前规则 · v2</h3><p>{factReport.current}</p><strong>{factLabels[factReport.fact as keyof typeof factLabels]}</strong><div className={s.matrix} aria-label="来源一致性与当前事实矩阵">{[['consistent', 'correct', '来源一致 · 当前正确'], ['conflict', 'correct', '来源冲突 · 当前正确'], ['consistent', 'wrong', '来源一致 · 当前错误'], ['conflict', 'wrong', '来源冲突 · 当前错误']].map(([source, fact, label]) => <div key={label} data-active={factReport.source === source && factReport.fact === fact}><span>{label}</span><Check size={23}/></div>)}</div><p>{factReport.fact === 'unknown' ? '两份规则都没提供费用信息。未知不能直接判为错误，也不能当成已证实。' : factReport.source === 'consistent' && factReport.fact === 'wrong' ? '回答忠于旧原文，但原文已过时。还要检查来源本身的版本。' : factReport.source === 'conflict' && factReport.fact === 'correct' ? '回答碰巧符合当前规则，但无法据此声称它是依据提供的 v1 写出的。' : '来源是否支持回答、来源是否适用于现在，需要分别判断。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setClaim(0); setVersion(1); clear(); }}><ArrowCounterClockwise size={17}/>重置两次核对</button>
  </div>;
}

export function EvaluationLesson() {
  const [candidate, setCandidate] = useState<'B' | 'C'>('B'), [scope, setScope] = useState<EvalScope>('all');
  const [open, setOpen] = useState(false), [details, setDetails] = useState(false), [report, setReport] = useState(scoreEvaluation('B', 'all')), [detailReport, setDetailReport] = useState(scoreEvaluation('B', 'all'));
  const clear = () => { setOpen(false); setDetails(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：固定案例比较两个版本">
    <div className={s.controls}><label>比较版本<select value={candidate} onChange={e => { setCandidate(e.target.value as 'B' | 'C'); clear(); }}><option value="B">A → B</option><option value="C">A → C</option></select></label><label>案例范围<select value={scope} onChange={e => { setScope(e.target.value as EvalScope); clear(); }}><option value="all">全部六例</option><option value="ordinary">仅普通三例</option><option value="none">不选择案例</option></select></label></div>
    <States index={scope === 'all' ? 0 : scope === 'ordinary' ? 1 : 2}>{[<p key="all">普通 3 例 · 边界 2 例 · 关键 1 例</p>, <p key="ordinary">普通 3 例 · 尚未检查边界与关键案例</p>, <p key="none">没有案例。先选择范围，再评分。</p>]}</States>
    <button disabled={open || scope === 'none'} onClick={() => { setReport(scoreEvaluation(candidate, scope)); setOpen(true); }}>评分这一组<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.scores} aria-label="版本分数"><div><h3>基线 A</h3><strong>{report.baselinePercent?.toFixed(1)}<small>%</small></strong><span>{report.baselinePassed} / {report.rows.length} 通过</span></div><div><h3>候选 {report.candidate}</h3><strong>{report.percent?.toFixed(1)}<small>%</small></strong><span>{report.passed} / {report.rows.length} 通过</span></div></div><div className={s.decision} role="status"><h3>{report.decision}</h3><p>关键失败 {report.criticalFailures} 个 · {report.covered ? '三个分组均已覆盖' : '分组覆盖不完整'}</p><p>{report.rows.some(row => row.baselinePass && !row.candidatePass) ? '申请入口案例从通过变为未通过。整体分数没有说明这一处回退。' : '分数只代表这一组记录和本例判据。'}</p></div><button className={s.detailToggle} onClick={() => { if (!details) setDetailReport(report); setDetails(value => !value); }} aria-expanded={details} aria-controls="eval-case-records">{details ? '收起逐例记录' : '查看逐例记录'}</button><Reveal open={details}><div id="eval-case-records" className={s.caseRecords}>{detailReport.rows.map(row => <div key={row.id}><header><span>{row.group}</span><h3>{row.question}</h3></header><p className={s.criterion}>判据：{row.criterion}</p><div><p>{row.baselinePass ? <Check size={18}/> : <X size={18}/>}<span>A · {row.baseline}</span></p><p>{row.candidatePass ? <Check size={18}/> : <X size={18}/>}<span>{detailReport.candidate} · {row.candidate}</span></p></div></div>)}</div></Reveal></Reveal>
    <button className={base.reset} onClick={() => { setCandidate('B'); setScope('all'); clear(); }}><ArrowCounterClockwise size={17}/>重置版本与案例</button>
  </div>;
}
