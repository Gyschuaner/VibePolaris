'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, FileText } from '@phosphor-icons/react';
import { Reveal } from './ExtendedConceptLessons';
import { fallbackPolicy, callBackup, primaryLabels, type PrimaryOutcome, type BackupOutcome } from '@/lib/model-delivery-teaching';
import base from './EventConcepts.module.css';
import s from './ModelDeliveryConcepts.module.css';

export function ModelFallbackLesson() {
  const [primary, setPrimary] = useState<PrimaryOutcome>('rate'), [backup, setBackup] = useState<BackupOutcome>('valid'), [limit, setLimit] = useState(2);
  const [open, setOpen] = useState(false), [backupOpen, setBackupOpen] = useState(false);
  const [report, setReport] = useState(fallbackPolicy('rate', 'valid', 2)), [run, setRun] = useState(0);
  const [second, setSecond] = useState(callBackup(fallbackPolicy('rate', 'valid', 2)));
  const invalidate = () => { setOpen(false); setBackupOpen(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：主调用之后切换备用">
    <div className={s.controls}><label>主调用情境<select value={primary} onChange={e => { setPrimary(e.target.value as PrimaryOutcome); invalidate(); }}>{Object.entries(primaryLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>备用模型<select value={backup} onChange={e => { setBackup(e.target.value as BackupOutcome); invalidate(); }}><option value="valid">支持结构化 JSON · 返回 amount</option><option value="invalid">支持结构化 JSON · 返回错误字段</option><option value="unsupported">不支持所需结构化输出</option><option value="none">没有可用备用模型</option></select></label><label>总尝试上限<select value={limit} onChange={e => { setLimit(Number(e.target.value)); invalidate(); }}><option value="2">2 次（包括主调用）</option><option value="1">1 次（包括主调用）</option></select></label></div>
    <div className={s.request}><FileText size={23}/><div><strong>提取金额 120</strong><code>要求：结构化 JSON 中 amount = 120</code></div></div>
    <button disabled={open} onClick={() => { setReport(fallbackPolicy(primary, backup, limit)); setRun(n => n + 1); setOpen(true); setBackupOpen(false); }}>执行主调用<ArrowRight size={18}/></button>
    <Reveal open={open}><div key={run} className={s.callHistory}><div className={s.receipt}><span>01 · 主调用</span><h3>{primaryLabels[report.primary]}</h3>{report.primary === 'success' && <pre>{'{"amount":120}'}</pre>}<p>{report.primary === 'timeout' ? '没有收到响应，主调用在远端是否完成仍未知。' : report.primary === 'success' ? '本例字段检查通过，任务完成。' : '已观察到这个错误响应。'}</p></div><div className={s.policy} role="status"><h3>{report.reason}</h3><p>已尝试 1 次，上限 {report.limit} 次。</p></div><button disabled={!open || !report.eligible || backupOpen} onClick={() => { setSecond(callBackup(report)); setBackupOpen(true); }}>调用备用模型<ArrowRight size={18}/></button>
      <Reveal open={backupOpen}><div className={`${s.receipt} ${s.backupReceipt}`} role="status"><span>02 · 备用调用</span><pre>{second.response}</pre><h3>{second.label}</h3><p>共尝试 {second.attempts} 次。{second.pass ? '金额字段满足要求。' : '本例停止，不把收到回复计为任务成功。'}</p></div></Reveal>
    </div></Reveal>
    <button className={base.reset} onClick={() => { setPrimary('rate'); setBackup('valid'); setLimit(2); invalidate(); }}><ArrowCounterClockwise size={17}/>重置调用与预算</button>
  </div>;
}
