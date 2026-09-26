"use client";
import { useState } from 'react';
import { Archive, ArrowCounterClockwise, Database, EnvelopeSimple, ImageSquare, ArrowRight } from '@phosphor-icons/react';
import { catalog, snapshot, initialBackup, saveBackup, restoreBackup, queryShards, rangeOwner, initialQueue, queueAction, type Shard } from '@/lib/distribution-teaching';
import { Reveal, States } from './ExtendedConceptLessons';
import base from './EventConcepts.module.css';
import s from './DistributionConcepts.module.css';
function Rows({ revision }: { revision: number }) {
  return <States index={revision}>{[0, 1, 2].map(n => <div key={n} className={s.rows}>{snapshot(n).map(row => <div key={row.id}><code>#{row.id}</code><strong>{row.title}</strong></div>)}{n === 2 && <p>0 行 · 书目已删除</p>}</div>)}</States>;
}
export function BackupLesson() {
  const [state, setState] = useState(initialBackup), [rejected, setRejected] = useState(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="备份恢复点与独立库演示">
    <div className={s.restoreDesk}><div><h3><Database size={23}/>当前库</h3><span className={s.version}>v{state.current}</span><Rows revision={state.current}/><div className={s.actions}><button disabled={state.current !== 0} onClick={() => setState({ ...state, current: 1 })}>修改 #42 书名</button><button disabled={state.current === 2} onClick={() => setState({ ...state, current: 2 })}>误删全部书目</button></div></div><div className={s.restoreTarget}><h3><Database size={23}/>独立恢复库</h3><States index={state.restored === null ? 0 : state.restored + 1}>{[<p key="none">尚未导入备份</p>, ...[0, 1, 2].map(n => <div key={n}><span className={s.version}>来自备份 v{n} · 核对 {snapshot(n).length} 行</span><Rows revision={n}/></div>)]}</States></div></div>
    <div className={s.archive}><h3><Archive size={23}/>保留下来的恢复点</h3><Reveal open={state.saved.length === 0}><p>还没有保存备份</p></Reveal><div className={s.restorePoints}>{[0, 1, 2].map(n => <Reveal key={n} open={state.saved.includes(n)}><button aria-pressed={state.selected === n} onClick={() => { setState({ ...state, selected: n }); setRejected(false); }}><code>v{n}</code><span>{n === 0 ? '原书名 · 2 行' : n === 1 ? '修订版 · 2 行' : '空书目 · 0 行'}</span></button></Reveal>)}</div></div>
    <div className={s.actions}><button disabled={state.saved.includes(state.current)} onClick={() => { setState(saveBackup(state)); setRejected(false); }}>保存当前备份</button><button onClick={() => { setRejected(state.selected === null); setState(restoreBackup(state)); }}>恢复所选备份到独立库<ArrowRight size={17}/></button></div>
    <Reveal open={rejected}><p className={s.notice} role="status">没有可用的恢复点，独立库保持未导入。</p></Reveal>
    <button className={base.reset} onClick={() => { setState(initialBackup()); setRejected(false); }}><ArrowCounterClockwise size={17}/>清空备份，恢复原书目</button>
  </div>;
}
const queryKeys = [42, 78, 99, null];
const moveLabels = ['复制 50–100 范围到 A', '更新范围归属为 A', '清理 B 的旧副本', '范围迁移已结束'];
export function ShardingLesson() {
  const [stage, setStage] = useState(0), [key, setKey] = useState(42 as number | null), [result, setResult] = useState(0), [shown, setShown] = useState(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="分片范围归属与路由演示">
    <div className={s.rangeMap}><div><code>[0, 50)</code><strong>归属 A</strong></div><div data-moved={stage >= 2}><code>[50, 100)</code><States index={stage >= 2 ? 1 : 0}>{[<strong key="b">归属 B</strong>, <strong key="a">归属 A</strong>]}</States></div></div>
    <div className={s.shards}>{(['A', 'B'] as Shard[]).map(shard => <div key={shard}><h3><Database size={24}/>片 {shard}</h3>{catalog.map(row => { const owner = rangeOwner(stage, row.id); const exists = row.id === 42 ? shard === 'A' : shard === 'A' ? stage >= 1 : stage < 3; return <Reveal key={row.id} open={exists}><div className={s.shardRow} data-owned={owner === shard}><code>#{row.id}</code><strong>{row.title}</strong><States index={owner === shard ? 0 : stage < 2 ? 1 : 2}>{[<span key="owner">归属数据</span>, <span key="copy">迁移副本 · 未归属</span>, <span key="old">旧副本 · 待清理</span>]}</States></div></Reveal>; })}<Reveal open={shard === 'B' && stage === 3}><p>旧副本已清理</p></Reveal></div>)}</div>
    <div className={s.actions}><label>查询条件<select aria-label="分片查询条件" value={key === null ? 'all' : key} onChange={e => { setKey(e.target.value === 'all' ? null : Number(e.target.value)); setShown(false); }}><option value="42">编号 42</option><option value="78">编号 78</option><option value="99">编号 99</option><option value="all">不含分片键 · 全部书目</option></select></label><button onClick={() => { setResult(stage * 4 + queryKeys.indexOf(key)); setShown(true); }}>执行本次查询</button></div>
    <Reveal open={shown}><div className={s.queryResult} role="status"><States index={result}>{Array.from({ length: 16 }, (_, i) => { const q = queryShards(Math.floor(i / 4), queryKeys[i % 4]); return <div key={i}><span>请求片 {q.targets.join(' + ')} · 返回 {q.rows.length} 行</span>{q.rows.map(row => <p key={row.id}>#{row.id}　{row.title}</p>)}</div>; })}</States></div></Reveal>
    <div className={s.actions}><button disabled={stage === 3} onClick={() => { setStage(stage + 1); setShown(false); }}>{moveLabels[stage]}</button></div>
    <button className={base.reset} onClick={() => { setStage(0); setKey(42); setShown(false); }}><ArrowCounterClockwise size={17}/>恢复两个片的初始归属</button>
  </div>;
}
export function QueueLesson() {
  const [state, setState] = useState(initialQueue), [returned, setReturned] = useState(false);
  const act = (action: Parameters<typeof queueAction>[1]) => { setState(queueAction(state, action)); setReturned(action === 'disconnect'); };
  const flightIndex = state.flight ? (state.flight.id === 42 ? 1 : 4) + (state.flight.processed ? state.flight.reused ? 2 : 1 : 0) : 0;
  return <div className={`${base.lab} ${s.lab}`} aria-label="队列领取确认与重投演示">
    <div className={s.queueDesk}><div className={s.ready}><h3><EnvelopeSimple size={24}/>待领取 · {state.ready.length}</h3>{[42, 78].map(id => <Reveal key={id} open={state.ready.includes(id)}><div className={s.ticket}><EnvelopeSimple size={20}/><code>m{id}</code><span>生成 #{id} 的缩略图</span></div></Reveal>)}<Reveal open={!state.ready.length}><p>当前没有待领取消息</p></Reveal></div><div className={s.worker}><h3>工作进程 · 未确认 {state.flight ? 1 : 0}</h3><States index={flightIndex}>{[<p key="none">没有正在处理的消息</p>, ...[42, 78].flatMap(id => [0, 1, 2].map(n => <div key={`${id}-${n}`} className={s.inflight}><code>m{id}</code><strong>{n === 0 ? '已领取 · 尚未处理' : n === 1 ? '缩略图已生成 · 等待确认' : '已有缩略图 · 跳过重复创建'}</strong><span>任务键 book:{id}:thumb:v1</span></div>))]}</States><div className={s.actions}><button disabled={!state.flight || state.flight.processed} onClick={() => act('process')}>生成缩略图</button><button disabled={!state.flight?.processed} onClick={() => act('ack')}>确认已完成 · ack</button></div></div></div>
    <div className={s.actions}><button disabled={state.published} onClick={() => act('publish')}>发布两条任务消息</button><button disabled={!!state.flight || !state.ready.length} onClick={() => act('receive')}>领取下一条消息</button><button disabled={!state.flight} onClick={() => act('disconnect')}>模拟连接断开并重投</button></div>
    <Reveal open={returned}><p className={s.notice} role="status">未确认的消息回到队列；已经生成的缩略图仍保留。</p></Reveal>
    <div className={s.covers}><h3><ImageSquare size={23}/>业务结果 · {state.covers.length} 张缩略图</h3><div>{catalog.map(row => <Reveal key={row.id} open={state.covers.includes(row.id)}><div className={s.cover}><span>#{row.id}</span><strong>{row.title}</strong></div></Reveal>)}</div><p>已确认消息：{state.acked.length ? state.acked.map(id => `m${id}`).join('、') : '无'}</p></div>
    <button className={base.reset} onClick={() => { setState(initialQueue()); setReturned(false); }}><ArrowCounterClockwise size={17}/>清空消息与缩略图</button>
  </div>;
}
