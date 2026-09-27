'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Check, FileText, MagnifyingGlass, X } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { compareBenchmark, gradeRecord, gradeRecords, splitEvalSamples, evalSamples, type BenchSuite, type BenchRun, type GradeMode, type SplitMode } from '@/lib/assessment-teaching';
import base from './EventConcepts.module.css';
import s from './AssessmentConcepts.module.css';

export function BenchmarkLesson() {
  const [suite, setSuite] = useState<BenchSuite>('general'), [run, setRun] = useState<BenchRun>('same');
  const [open, setOpen] = useState(false), [report, setReport] = useState(compareBenchmark('general', 'same'));
  const current = compareBenchmark(suite, run);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：对齐条件再比较基准成绩">
    <div className={s.controls}><label>任务集合<select value={suite} onChange={e => { setSuite(e.target.value as BenchSuite); setOpen(false); }}><option value="general">一般任务</option><option value="business">业务任务</option></select></label><label>B 的运行记录<select value={run} onChange={e => { setRun(e.target.value as BenchRun); setOpen(false); }}><option value="same">与 A 同条件</option><option value="changed">换了题集版本</option><option value="none">没有运行记录</option></select></label></div>
    <div className={s.protocol} aria-label="运行记录的比较条件"><div><span>比较条件</span><strong>A</strong><strong>B</strong></div>{(['dataset', 'version', 'total', 'metric', 'tools'] as const).map((key, i) => <div key={key} data-mismatch={!!current.candidate && current.baseline[key] !== current.candidate[key]}><span>{['题集', '版本', '题数', '判据', '工具'][i]}</span><span>{current.baseline[key]}</span><div><States index={run === 'none' ? 2 : run === 'changed' ? 1 : 0}>{['same', 'changed', 'none'].map(value => <span key={value}>{compareBenchmark(suite, value as BenchRun).candidate?.[key] ?? '无记录'}</span>)}</States></div></div>)}</div>
    <button disabled={open} onClick={() => { setReport(current); setOpen(true); }}>核对并比较<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.benchmarkResult} role="status"><h3>{report.comparable ? `${report.baseline.dataset} · ${report.winner} 通过题数更多` : report.candidate ? '条件不同，暂不排名' : '缺少 B 的记录，无法比较'}</h3>{report.comparable && report.candidate ? <div className={s.lanes}>{[report.baseline, report.candidate].map(record => <div key={record.name}><strong>{record.name}</strong><div className={s.marks}>{Array.from({ length: record.total }, (_, i) => <span key={i} data-pass={i < record.passed}>{i < record.passed ? <Check size={17}/> : <X size={17}/>}</span>)}</div><span>{record.passed}/{record.total}</span><p>记录中的延迟中位数 {record.medianMs / 1000} 秒</p></div>)}</div> : <p>{report.candidate ? 'A 是 v1、10 题；B 是 v2、12 题。不能把这两次通过题数的变化单独归因于模型。' : '先取得 B 在相应条件下的运行记录；没有记录不等于零分。'}</p>}{report.comparable && <p>只按本例通过题数，{report.winner} 领先；A 的延迟更短。先确定业务看重哪些指标。</p>}</div></Reveal>
    <button className={base.reset} onClick={() => { setSuite('general'); setRun('same'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置比较条件</button>
  </div>;
}

export function GraderLesson() {
  const [index, setIndex] = useState(0), [mode, setMode] = useState<GradeMode>('keyword');
  const [open, setOpen] = useState(false), [report, setReport] = useState(gradeRecord(0, 'keyword'));
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：判据检查回复还是结果">
    <h3>任务：写入 answer.json，amount 应为 120</h3>
    <div className={s.controls}><label>尝试记录<select value={index} onChange={e => { setIndex(Number(e.target.value)); setOpen(false); }}>{gradeRecords.map((record, i) => <option key={record.title} value={i}>{record.title}</option>)}</select></label><label>评分判据<select value={mode} onChange={e => { setMode(e.target.value as GradeMode); setOpen(false); }}><option value="keyword">回复包含“完成”</option><option value="outcome">检查实际文件结果</option></select></label></div>
    <div className={s.inspector}><div className={s.reply}><span>助手回复</span><States index={index}>{gradeRecords.map(record => <p key={record.title}>{record.reply}</p>)}</States></div><div className={s.artifact}><FileText size={25}/><h3>虚拟文件结果</h3><States index={index}>{gradeRecords.map(record => <div key={record.title}>{!record.available ? <p>检查环境不可读</p> : !record.exists ? <p>answer.json 不存在</p> : <><code>answer.json</code><pre>{`{ "amount": ${record.amount} }`}</pre></>}</div>)}</States></div></div>
    <button disabled={open} onClick={() => { setReport(gradeRecord(index, mode)); setOpen(true); }}>按所选判据评分<MagnifyingGlass size={18}/></button>
    <Reveal open={open}><div className={s.gradeResult} role="status"><h3>{report.label}</h3><ul>{report.checks.map(check => <li key={check.label}>{check.pass ? <Check size={23}/> : <X size={23}/>}<span>{check.label}</span><strong>{check.pass ? '满足' : '不满足'}</strong></li>)}</ul><p>{report.mode === 'keyword' ? '这次只检查了措辞，没有检查任务是否完成。' : report.pass === null ? '没有可用的环境证据。本例保留未评分，不把检查失败计成任务成功或任务失败。' : report.pass ? '文件存在，且内容满足本例金额判据。' : '任务要求的文件结果没有满足全部判据。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setIndex(0); setMode('keyword'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置记录与判据</button>
  </div>;
}

export function EvalDatasetLesson() {
  const [tickets, setTickets] = useState(['A', 'B', 'C']), [mode, setMode] = useState<SplitMode>('rows');
  const [open, setOpen] = useState(false), [report, setReport] = useState(splitEvalSamples(['A', 'B', 'C'], 'rows'));
  const count = evalSamples.filter(row => tickets.includes(row.ticket)).length;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：按关联工单拆分评测样本">
    <div className={s.controls}><label>拆分方法<select value={mode} onChange={e => { setMode(e.target.value as SplitMode); setOpen(false); }}><option value="rows">逐行交替分配</option><option value="groups">按工单分组</option></select></label><h3>每个工单包含两条不同问题</h3></div>
    <div className={s.tickets}>{['A', 'B', 'C'].map(ticket => <button key={ticket} aria-pressed={tickets.includes(ticket)} onClick={() => { setTickets(ids => ids.includes(ticket) ? ids.filter(id => id !== ticket) : [...ids, ticket]); setOpen(false); }}><span>工单 {ticket}<Check size={18}/></span>{evalSamples.filter(row => row.ticket === ticket).map(row => <p key={row.id}><strong>{row.id}</strong>{row.question}</p>)}</button>)}</div>
    <States index={count === 0 ? 0 : tickets.length === 1 ? 1 : 2}>{[<p key="empty">没有样本，先选择工单。</p>, <p key="one">只有一个工单，不能检验对新工单的推广。</p>, <p key="many">按组时，本例把最后一个工单留出，其余用于开发。</p>]}</States>
    <button disabled={open || count === 0} onClick={() => { setReport(splitEvalSamples(tickets, mode)); setOpen(true); }}>拆分并检查<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.baskets} aria-label="开发与留出样本">{[[report.development, '开发与调试'], [report.heldout, '留出评测']] .map(([rows, title]) => <div key={title as string}><h3>{title as string}</h3>{(rows as typeof evalSamples).map(row => <div key={row.id} className={s.sample} data-overlap={report.overlap.includes(row.ticket)}><span>{row.id} · {row.category}</span><p>{row.question}</p><small>{row.context}</small></div>)}{(rows as typeof evalSamples).length === 0 && <p>这一组没有样本</p>}</div>)}</div><div className={s.splitResult} role="status"><h3>{report.groups.length < 2 ? '工单不足，不能形成独立留出检验' : report.overlap.length ? `关联工单出现在两边：${report.overlap.join('、')}` : '工单没有重叠，覆盖仍需检查'}</h3><p>{report.groups.length < 2 ? '只有一个工单，这些记录不足以测试对未见工单的推广。' : report.overlap.length ? '开发时见过同一工单的背景和相关问题。不同文字不等于独立样本。' : '按组隔开，减少这类背景信息从开发集进入留出评测的机会。'}</p><p>{report.missing.length ? `留出组未覆盖：${report.missing.join('、')}。` : '留出组包含本例三类；有样本不等于数量和多样性充分。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setTickets(['A', 'B', 'C']); setMode('rows'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置工单与拆分</button>
  </div>;
}
