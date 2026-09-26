'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, Archive, FileText, Clock, GitBranch, CaretDown, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { datasetRows, datasetDraft, datasetSnapshot, qualityCases, qualityRecords, lineageRuns, feeRows, lineageImpact, type QualityUse } from '@/lib/provenance-teaching';
import base from './EventConcepts.module.css';
import s from './ProvenanceConcepts.module.css';

export function DatasetLesson() {
  const [arrived, setArrived] = useState(false);
  const [extended, setExtended] = useState(false);
  const [snapshots, setSnapshots] = useState<ReturnType<typeof datasetSnapshot>[]>([]);
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(false);
  const draft = datasetDraft(arrived, extended);
  const last = shown ? snapshots.at(-1) : undefined;
  const unchanged = last?.source === draft.source && last?.end === draft.end;
  const save = () => {
    const previous = shown ? snapshots : [];
    setSnapshots([...previous, datasetSnapshot(arrived, extended, previous.length + 1)]);
    setSelected(previous.length); setShown(true);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：数据范围与快照版本">
    <div className={s.datasetDesk}><div><h3><FileText size={23}/>当前来源 {draft.source}</h3><div className={s.sourceRows}>{datasetRows.map((row, index) => <Reveal key={row.id} open={index < 4 || arrived}><div data-included={draft.rows.some(item => item.id === row.id)}><strong>{row.id}</strong><code>{row.date.slice(5)}</code><span>书目 #{row.book}</span><span>{row.id === 'E' ? '范围外' : row.id === 'D' && !extended ? '范围外' : '范围内'}</span></div></Reveal>)}</div></div>
      <div className={s.scopeCard}><h3>下一版的范围</h3><States index={extended ? 1 : 0}>{[<p key="two">9 月 1 日 — 9 月 2 日</p>, <p key="three">9 月 1 日 — 9 月 3 日</p>]}</States><label className={s.checkbox}><input type="checkbox" checked={extended} onChange={event => setExtended(event.target.checked)}/>把范围延长到 9 月 3 日</label><p>当前范围内 <strong>{draft.rows.length}</strong> 条</p><div className={s.actions}><button disabled={arrived} onClick={() => setArrived(true)}>来源新增 D</button><button disabled={unchanged} onClick={save}><Archive size={17}/>保存快照新版本</button></div></div></div>
    <Reveal open={shown}><div className={s.archive}><h3><Archive size={23}/>已保存的版本</h3><div className={s.actions}>{snapshots.map((item, index) => <button key={item.version} aria-pressed={selected === index} onClick={() => setSelected(index)}>v{item.version}</button>)}</div><div role="status"><States index={selected}>{snapshots.map(item => <div key={item.version} className={s.snapshot}><div><strong>v{item.version}</strong><span>来源 {item.source}<br/>{item.start.slice(5)} — {item.end.slice(5)}</span><b>{item.rows.length} 条</b></div><div className={s.snapshotRows}>{item.rows.map(row => <code key={row.id}>{row.id} · #{row.book}</code>)}</div></div>)}</States></div></div></Reveal>
    <button className={base.reset} onClick={() => { setArrived(false); setExtended(false); setShown(false); }}><ArrowCounterClockwise size={17}/>重置来源与快照</button>
  </div>;
}

function QualityResult({ report }: { report: typeof qualityCases[number] }) {
  return <div className={s.qualityReport}><div className={s.metrics}><div><span>书目编号完整</span><strong>{report.filled}/10</strong><div className={s.measure}><i style={{ width: `${report.filled * 10}%` }}/><b style={{ left: '90%' }}/></div><span>要求 ≥ 90% · {report.checks[0] ? '通过' : '未通过'}</span></div><div><span>不同事件 ID 占比</span><strong>{report.distinct}/10</strong><div className={s.measure}><i style={{ width: '90%' }}/><b style={{ left: '90%' }}/></div><span>要求 ≥ 90% · 通过</span></div><div><span><Clock size={18}/>快照距观察时刻</span><strong>{report.fresh ? '12 秒' : '3 小时'}</strong><span>要求 ≤ {report.use === 'monthly' ? '24 小时' : '30 秒'}<br/>{report.checks[2] ? '通过' : '未通过'}</span></div></div><p className={s.qualityVerdict}>{report.passed ? <CheckCircle size={24}/> : <WarningCircle size={24}/>}<strong>{report.passed ? '符合本例用途门槛' : '未达到本例用途门槛'}</strong></p></div>;
}
export function QualityLesson() {
  const [use, setUse] = useState<QualityUse>('monthly');
  const [fresh, setFresh] = useState(false);
  const [extraMissing, setExtraMissing] = useState(false);
  const index = qualityCases.findIndex(item => item.use === use && item.fresh === fresh && item.extraMissing === extraMissing);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：同一批数据与不同用途门槛">
    <div className={s.qualityHeader}><h3>10 条借阅记录</h3><div className={s.actions}><button aria-pressed={use === 'monthly'} onClick={() => setUse('monthly')}>月报参考</button><button aria-pressed={use === 'live'} onClick={() => setUse('live')}>实时库存</button></div></div>
    <div className={s.eventCards}>{qualityRecords(extraMissing).map((row, i) => <div key={i} data-missing={row.book === null} data-duplicate={i === 9}><code>{row.id}{i === 9 ? ' · 重复' : ''}</code><span>{row.book === null ? '书目缺失' : `#${row.book}`}</span></div>)}</div>
    <div role="status"><States index={index}>{qualityCases.map((report, i) => <QualityResult key={i} report={report}/>)}</States></div>
    <div className={s.actions}><button disabled={fresh} onClick={() => setFresh(true)}>换成 12 秒前的快照</button><label className={s.checkbox}><input type="checkbox" checked={extraMissing} onChange={event => setExtraMissing(event.target.checked)}/>再缺一条书目编号</label></div>
    <button className={base.reset} onClick={() => { setUse('monthly'); setFresh(false); setExtraMissing(false); }}><ArrowCounterClockwise size={17}/>恢复用途与数据</button>
  </div>;
}

function TraceRecord({ run, stage, onStage }: { run: typeof lineageRuns[number]; stage: number; onStage: (stage: number) => void }) {
  return <div><div className={s.outputRecord}><span>daily.total · 输出 v{run.version}</span><strong>{run.total}<em>分</em></strong><button aria-expanded={stage > 0} onClick={() => onStage(stage > 0 ? 0 : 1)}>生成记录<CaretDown size={18}/></button></div>
    <Reveal open={stage > 0}><div className={s.runRecord}><h3><GitBranch size={23}/>{run.run} · 已完成</h3><p>来源 s1 · 规则 v{run.version}</p><code>{run.expression}</code><button aria-expanded={stage > 1} onClick={() => onStage(stage > 1 ? 1 : 2)}>输入字段<CaretDown size={18}/></button>
      <Reveal open={stage > 1}><div className={s.fieldRecord}><h4>费用来源 s1 · 单位：分</h4><div className={s.fieldHead}><span>记录</span><code>amount</code><code>discount</code></div>{feeRows.map(row => <div className={s.fieldRow} key={row.id}><strong>{row.id}</strong><code data-used="true">{row.amount}</code><code data-used={run.fields.includes('discount')}>{row.discount}</code></div>)}<p>参与合计的字段：{run.fields.join('、')}</p></div></Reveal>
    </div></Reveal>
  </div>;
}
export function LineageLesson() {
  const [version, setVersion] = useState<1 | 2>(1);
  const [stages, setStages] = useState([0, 0]);
  const [impactOpen, setImpactOpen] = useState(false);
  const [field, setField] = useState<'amount' | 'discount'>('amount');
  const updateStage = (i: number, stage: number) => setStages(values => values.map((value, index) => index === i ? stage : value));
  const variants = ([1, 2] as const).flatMap(v => (['amount', 'discount'] as const).map(f => ({ v, f, outputs: lineageImpact(v, f) })));
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：追溯输出与字段依赖">
    <div className={s.actions}>{([1, 2] as const).map(v => <button key={v} aria-pressed={version === v} onClick={() => setVersion(v)}>输出 v{v}</button>)}</div>
    {lineageRuns.map((run, i) => <Reveal key={run.version} open={version === run.version}><TraceRecord run={run} stage={stages[i]} onStage={stage => updateStage(i, stage)}/></Reveal>)}
    <div className={s.impact}><button aria-expanded={impactOpen} onClick={() => setImpactOpen(!impactOpen)}>从字段查看下游影响<CaretDown size={18}/></button><Reveal open={impactOpen}><div><h3>规则 v{version} 的已登记依赖</h3><div className={s.actions}>{(['amount', 'discount'] as const).map(f => <button key={f} aria-pressed={field === f} onClick={() => setField(f)}>{f}</button>)}</div><div role="status"><States index={variants.findIndex(item => item.v === version && item.f === field)}>{variants.map(item => <div key={`${item.v}-${item.f}`} className={s.impactMap}><code>{item.f}</code><div>{item.outputs.length ? item.outputs.map(output => <p key={output}><GitBranch size={19}/><code>{output}</code></p>) : <p>这两个合计没有使用 discount</p>}</div><strong>{item.outputs.length} 个潜在受影响输出</strong></div>)}</States></div></div></Reveal></div>
    <button className={base.reset} onClick={() => { setVersion(1); setStages([0, 0]); setImpactOpen(false); setField('amount'); }}><ArrowCounterClockwise size={17}/>收起并回到旧输出</button>
  </div>;
}
