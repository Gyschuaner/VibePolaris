'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, Books, ChartBar, EnvelopeSimple, Files } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { borrowRows, initialBatch, batchChunk, batchCounts, publishBatch, initialStream, streamEvents, receiveStream, advanceWatermark, windowEvents, initialEvent, deliverEvent, type Target } from '@/lib/processing-teaching';
import base from './EventConcepts.module.css';
import s from './ProcessingConcepts.module.css';
export function BatchLesson() {
  const [state, setState] = useState(initialBatch), [failNext, setFailNext] = useState(false);
  const counts = batchCounts(state), complete = state.done.length === state.size / 2;
  return <div className={`${base.lab} ${s.lab}`} aria-label="批处理固定输入与分块演示">
    <div className={s.actions}><label>本批记录<select aria-label="本批记录数量" value={state.size} onChange={e => { setState(initialBatch(Number(e.target.value))); setFailNext(false); }}><option value="4">4 条借阅</option><option value="6">6 条借阅</option></select></label><button disabled={state.sealed} onClick={() => setState({ ...state, sealed: true })}>固定本批输入</button></div>
    <div className={s.batchScope} data-sealed={state.sealed}><h3><Files size={23}/>本批输入 · {state.size} 条</h3><div className={s.chunks}>{[0, 1, 2].map(i => <Reveal key={i} open={i < state.size / 2}><div className={s.chunk} data-done={state.done.includes(i)}><span>块 {i + 1}</span><div>{borrowRows.slice(i * 2, i * 2 + 2).map((id, j) => <code key={j}>#{id}</code>)}</div><States index={state.done.includes(i) ? 2 : state.failed === i ? 1 : 0}>{[<span key="pending">等待处理</span>, <span key="fail">本次失败 · 未计入</span>, <span key="done">已完成</span>]}</States></div></Reveal>)}</div></div>
    <div className={s.actions}><label className={s.checkbox}><input type="checkbox" checked={failNext} disabled={!state.sealed || complete} onChange={e => setFailNext(e.target.checked)}/>让下一块失败一次</label><button disabled={!state.sealed || complete} onClick={() => { setState(batchChunk(state, failNext)); setFailNext(false); }}>{state.failed !== null ? '重试失败块' : '处理下一块'}</button><button disabled={!complete || state.published} onClick={() => setState(publishBatch(state))}>发布本批汇总</button></div>
    <div className={s.totals} role="status"><States index={state.published ? 1 : 0}>{[<h3 key="partial">中间计数 · 只算成功块，尚未发布</h3>, <h3 key="final">本批汇总已发布</h3>]}</States>{[42, 78].map((id, i) => <div key={id}><code>#{id}</code><div className={s.bar}><span style={{ width: `${counts[i] / 3 * 100}%` }}/></div><strong>{counts[i]} 次</strong></div>)}</div>
    <button className={base.reset} onClick={() => { setState(initialBatch()); setFailNext(false); }}><ArrowCounterClockwise size={17}/>重置本批输入与进度</button>
  </div>;
}
export function StreamLesson() {
  const [state, setState] = useState(initialStream);
  return <div className={`${base.lab} ${s.lab}`} aria-label="流处理事件时间窗口演示">
    <div className={s.actions}><p>e1、e2、e3 是事件编号，t 是记录发生的时刻；点击接收按钮代表记录到达。</p>{streamEvents.map(e => <button key={e.id} disabled={state.received.includes(e.id)} onClick={() => setState(receiveStream(state, e.id))}>接收 {e.id} · t{e.time}</button>)}</div>
    <div className={s.watermark}><span>水位 W = {state.watermark}</span><div><span style={{ width: `${state.watermark / 20 * 100}%` }}/></div></div>
    <div className={s.windows}>{[0, 10].map(start => { const closed = state.watermark >= start + 10, events = windowEvents(state, start); return <div key={start} className={s.window} data-closed={closed}><h3>事件时间 [{start}, {start + 10})</h3><States index={closed ? 1 : 0}>{[<span key="open">窗口还开着，等待更多记录</span>, <span key="closed">窗口已关闭</span>]}</States><div className={s.timeDots}>{streamEvents.filter(e => e.time >= start && e.time < start + 10).map(e => <Reveal key={e.id} open={state.accepted.includes(e.id)}><span className={s.eventDot}><code>{e.id}</code><strong>t{e.time}</strong></span></Reveal>)}</div><div role="status"><States index={closed ? events.length ? events.length + 1 : 1 : 0}>{[<p key="pending">尚未输出</p>, <p key="empty">无可输出记录</p>, <p key="one">已输出：1 次借阅</p>, <p key="two">已输出：2 次借阅</p>]}</States></div></div>; })}</div>
    <div className={s.actions}>{[10, 20].map(w => <button key={w} disabled={state.watermark >= w} onClick={() => setState(advanceWatermark(state, w))}>推进水位到 {w}</button>)}</div>
    <div className={s.late}><h3>晚到旁路</h3><Reveal open={!state.late.length}><p>尚无晚到事件</p></Reveal>{streamEvents.map(e => <Reveal key={e.id} open={state.late.includes(e.id)}><p><code>{e.id} · t{e.time}</code>　保留待核对，已输出计数不变</p></Reveal>)}</div>
    <button className={base.reset} onClick={() => setState(initialStream())}><ArrowCounterClockwise size={17}/>清空事件与水位</button>
  </div>;
}
const deliveryLabels = ['pending', 'failed', 'done', 'duplicate'];
export function EventDrivenLesson() {
  const [state, setState] = useState(initialEvent);
  return <div className={`${base.lab} ${s.lab}`} aria-label="事件独立订阅与重复投递演示">
    <div className={s.source}><Books size={29}/><div><h3>借阅服务 · 书目 #42</h3><States index={state.recorded ? 1 : 0}>{[<p key="none">尚未记录借阅</p>, <p key="recorded">借阅已记录</p>]}</States></div></div>
    <div className={s.actions}><button disabled={state.recorded} onClick={() => setState({ ...state, recorded: true })}>记录这次借阅</button><button disabled={!state.recorded || state.published} onClick={() => setState({ ...state, published: true })}>发布借阅事件</button></div>
    <Reveal open={state.published}><div className={s.envelope}><EnvelopeSimple size={23}/><code>loan-001</code><strong>book.borrowed</strong><span>书目 #42</span></div></Reveal>
    <div className={s.subscribers}>{(['shelf', 'stats'] as Target[]).map(target => { const done = state.processed.includes(target); return <div key={target} className={target === 'shelf' ? s.shelf : s.stats}><h3>{target === 'shelf' ? <Books size={23}/> : <ChartBar size={23}/>} {target === 'shelf' ? '书架订阅' : '统计订阅'}</h3><States index={done ? 1 : 0}>{target === 'shelf' ? [<div className={s.book} key="available"><code>#42</code><strong>可借阅</strong></div>, <div className={s.book} key="borrowed"><code>#42</code><strong>已借出</strong></div>] : [<div key="zero" className={s.count}><strong>0</strong><span>次借阅</span></div>, <div key="one" className={s.count}><strong>1</strong><span>次借阅</span></div>]}</States><div role="status"><States index={deliveryLabels.indexOf(state.deliveries[target])}>{[<p key="pending">等待投递</p>, <p key="failed">目标拒绝投递 · 可重试</p>, <p key="done">已处理 loan-001</p>, <p key="duplicate">同一事件已处理 · 跳过重复写入</p>]}</States></div><button disabled={!state.published} onClick={() => setState(deliverEvent(state, target))}>{target === 'stats' && state.deliveries.stats === 'failed' ? '重试投递到统计目标' : (state.deliveries[target] === 'done' || state.deliveries[target] === 'duplicate') ? `重复投递到${target === 'shelf' ? '书架' : '统计'}目标` : `投递到${target === 'shelf' ? '书架' : '统计'}目标`}</button></div>; })}</div>
    <div className={s.actions}><button disabled={!state.published || state.deliveries.stats !== 'pending'} onClick={() => setState(deliverEvent(state, 'stats', true))}>投递到统计（模拟拒绝）</button></div>
    <button className={base.reset} onClick={() => setState(initialEvent())}><ArrowCounterClockwise size={17}/>清空借阅与订阅结果</button>
  </div>;
}
