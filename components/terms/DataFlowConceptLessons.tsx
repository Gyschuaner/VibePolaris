'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, Archive, CursorText, FileText, Funnel, CheckCircle } from '@phosphor-icons/react';
import { States, Reveal } from './ExtendedConceptLessons';
import { ingestionEvents, initialIngestion, runIngestion, conversionCases, transformRows, validationRecords, validationCases, type MoneyUnit } from '@/lib/dataflow-teaching';
import base from './EventConcepts.module.css';
import s from './DataFlowConcepts.module.css';

const ingestionNotices = ['等待读取来源', '本批已读取，尚未写入', '本次写入失败，确认位置未前移', '本批写入完成，确认位置尚未保存', '已保存确认位置，可以读取后续记录', '进程已重启：暂存清空，原始层与确认位置保留'];
export function IngestionLesson() {
  const [state, setState] = useState(initialIngestion);
  const act = (action: Parameters<typeof runIngestion>[1]) => setState(current => runIngestion(current, action));
  const batchIndex = !state.batch.length ? 0 : state.batch[0] === 1 ? 1 : 2;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：接入与确认读取位置">
    <div className={s.ingestionDesk}><div className={s.sourceLog}><h3><FileText size={23}/>来源事件日志</h3><ol>{ingestionEvents.map(event => <li key={event.id} data-confirmed={event.offset <= state.cursor}><span>{event.offset}</span><code>{event.id}</code><span>书目 #{event.book}</span></li>)}</ol><div className={s.position}><CursorText size={21}/><span>已确认读取到</span><strong>{state.cursor}</strong></div></div>
      <div className={s.receiver}><h3><Archive size={23}/>原始层</h3><States index={state.saved.length === 3 ? 2 : state.saved.length === 2 ? 1 : 0}>{[
        <p key="empty">尚未保存事件</p>,
        <div key="two" className={s.receipts}>{ingestionEvents.slice(0, 2).map(event => <code key={event.id}>{event.id} · #{event.book}</code>)}</div>,
        <div key="three" className={s.receipts}>{ingestionEvents.map(event => <code key={event.id}>{event.id} · #{event.book}</code>)}</div>,
      ]}</States><p className={s.savedCount}><strong>{state.saved.length}</strong> 个不同事件</p></div></div>
    <div className={s.buffer}><span>进程内暂存</span><States index={batchIndex}>{[<code key="none">空</code>, <code key="first">1 · loan-1　　2 · loan-2</code>, <code key="last">3 · loan-3</code>]}</States></div>
    <div className={s.actions}><button disabled={state.batch.length > 0 || state.cursor === 3} onClick={() => act('read')}>读取下一批</button><button disabled={!state.batch.length || state.written} onClick={() => act('write')}>写入原始层</button><button disabled={!state.batch.length || state.written} onClick={() => act('fail')}>让本次写入失败</button><button disabled={!state.written} onClick={() => act('commit')}>保存读取位置</button></div>
    <div role="status"><States index={['idle', 'read', 'failed', 'written', 'committed', 'restarted'].indexOf(state.notice)}>{ingestionNotices.map(text => <p key={text}>{text}</p>)}</States></div>
    <div className={s.actions}><button onClick={() => act('restart')}>重启接入进程</button><button className={base.reset} onClick={() => setState(initialIngestion())}><ArrowCounterClockwise size={17}/>清空接入结果</button></div>
  </div>;
}
function ConversionReport({ rows }: { rows: ReturnType<typeof transformRows> }) {
  const accepted = rows.filter(row => row.result.cents !== null);
  return <div className={s.conversionReport}><h3><Funnel size={22}/>转换后的字段</h3><div className={s.converted}>{rows.map(row => <div key={row.id} data-rejected={row.result.cents === null}><code>{row.id}</code><div>{row.result.cents === null ? <><strong>保留待处理</strong><span>{row.result.reason}</span></> : <><strong>{row.result.cents} 分</strong><code>amount_cents · CNY</code></>}</div></div>)}</div><p>{accepted.length} 条已转换 · {rows.length - accepted.length} 条待处理</p><p>仅已转换记录合计：<strong>{accepted.reduce((total, row) => total + (row.result.cents ?? 0), 0)} 分</strong></p></div>;
}
export function TransformationLesson() {
  const [unit, setUnit] = useState<MoneyUnit>('unknown');
  const [excess, setExcess] = useState(false);
  const [report, setReport] = useState(0);
  const [shown, setShown] = useState(false);
  const run = () => { setReport(conversionCases.findIndex(item => item.unit === unit && item.excess === excess)); setShown(true); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：按声明的单位转换金额">
    <div className={s.transformDesk}><div className={s.original}><h3>原始金额</h3>{transformRows(unit, excess).map(row => <div key={row.id}><code>{row.id}</code><strong>{row.raw}</strong></div>)}</div><div className={s.ruleCard}><h3>字段规则</h3><p>输出：CNY 的整数分<br/>元最多两位小数</p><label className={s.selectLabel}>D 的来源单位<select value={unit} onChange={event => { setUnit(event.target.value as MoneyUnit); setShown(false); }}><option value="unknown">尚未确认</option><option value="fen">已确认：分</option><option value="yuan">已确认：元</option></select></label><label className={s.checkbox}><input type="checkbox" checked={excess} onChange={event => { setExcess(event.target.checked); setShown(false); }}/>让 A 超出两位小数</label><button disabled={shown} onClick={run}>执行字段转换</button></div></div>
    <div className={s.result} role="status"><Reveal open={!shown}><p>等待执行当前规则</p></Reveal><Reveal open={shown}><States index={report}>{conversionCases.map((item, index) => <ConversionReport key={index} rows={item.rows}/>)}</States></Reveal></div>
    <button className={base.reset} onClick={() => { setUnit('unknown'); setExcess(false); setShown(false); }}><ArrowCounterClockwise size={17}/>重置金额与规则</button>
  </div>;
}
function ValidationReport({ item }: { item: typeof validationCases[number] }) {
  const accepted = item.rows.filter(row => row.valid);
  return <div className={s.validationReport}><div className={s.reportHeading}><strong>{accepted.length} 条通过当前规则</strong><span>{4 - accepted.length} 条隔离</span></div><div className={s.matrix}>{item.rows.map(row => <div key={row.id} className={s.matrixRow} data-valid={row.valid}><div className={s.rawRecord}><strong>{row.id}</strong><code>age: {JSON.stringify(row.age)}<br/>city: {JSON.stringify(row.city)}</code></div><div className={s.checks}><span>整数 {row.integer ? '通过' : '失败'}</span><span>范围 {row.range}</span><span>城市 {row.cityCheck}</span></div><div className={s.verdict}>{row.valid ? <><CheckCircle size={22}/><span>通过</span></> : <><Funnel size={22}/><span>{row.errors.join('；')}</span></>}</div></div>)}</div><p>报告 s1 / 范围{item.rules.range ? '开启' : '关闭'} / 城市{item.rules.city ? '开启' : '关闭'}</p></div>;
}
export function ValidationLesson() {
  const [range, setRange] = useState(true);
  const [city, setCity] = useState(true);
  const [report, setReport] = useState(0);
  const [shown, setShown] = useState(false);
  const run = () => { setReport(validationCases.findIndex(item => item.rules.range === range && item.rules.city === city)); setShown(true); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：规则范围与校验报告">
    <div className={s.rules}><h3>本轮校验规则</h3><p>age 必须为整数，不自动把字符串转成数字。</p><label className={s.checkbox}><input type="checkbox" checked={range} onChange={event => { setRange(event.target.checked); setShown(false); }}/>年龄范围 0–120</label><label className={s.checkbox}><input type="checkbox" checked={city} onChange={event => { setCity(event.target.checked); setShown(false); }}/>城市代码只允许 SH / BJ</label><button disabled={shown} onClick={run}>运行当前校验</button></div>
    <div role="status"><Reveal open={!shown}><div><h3>等待校验 · 输入快照 s1</h3><div className={s.waitingRecords}>{validationRecords.map(row => <div key={row.id}><strong>{row.id}</strong><code>age: {JSON.stringify(row.age)}<br/>city: {JSON.stringify(row.city)}</code></div>)}</div></div></Reveal><Reveal open={shown}><States index={report}>{validationCases.map((item, index) => <ValidationReport key={index} item={item}/>)}</States></Reveal></div>
    <button className={base.reset} onClick={() => { setRange(true); setCity(true); setShown(false); }}><ArrowCounterClockwise size={17}/>恢复默认校验</button>
  </div>;
}
