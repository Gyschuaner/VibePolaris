'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, Archive, CheckCircle, EnvelopeSimple, FileText, Database, ShieldCheck, ChartBar } from '@phosphor-icons/react';
import { States, Reveal } from './ExtendedConceptLessons';
import { initialPipeline, runPipeline, pipelineRows, initialWebhook, deliverWebhook, verifyWebhook, acceptWebhook, processWebhook, initialDistributed, runDistributed, type LossMode } from '@/lib/coordination-teaching';
import base from './EventConcepts.module.css';
import s from './CoordinationConcepts.module.css';

export function PipelineLesson() {
  const [state, setState] = useState(initialPipeline);
  const act = (action: Parameters<typeof runPipeline>[1]) => setState(current => runPipeline(current, action));
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：有依赖的数据管道">
    <div className={s.raw}><h3><FileText size={23}/>输入快照 s1</h3><div className={s.records}>{pipelineRows.map(row => <div key={row.id}><code>{row.id}</code><span>{row.book === null ? '书目编号缺失' : `书目 #${row.book}`}</span></div>)}</div><button disabled={state.read} onClick={() => act('read')}>读取固定输入</button></div>
    <div className={s.forks}>
      <div className={s.quality}><h3><ShieldCheck size={23}/>校验与汇总</h3><div role="status"><States index={state.quality === 'passed' ? 2 : state.quality === 'failed' ? 1 : 0}>{[<p key="wait">等待校验</p>, <p key="fail">q1 · r2 缺失书目编号，校验失败</p>, <p key="pass">q2 · 3 条有效，1 条保留在隔离区</p>]}</States></div><div className={s.actions}><button disabled={!state.read || state.quality !== 'waiting'} onClick={() => act('validate')}>校验本批记录</button><button disabled={state.quality !== 'failed'} onClick={() => act('isolate')}>隔离缺失编号并重验</button><button disabled={state.quality !== 'passed' || state.aggregated} onClick={() => act('aggregate')}>汇总有效借阅</button></div><Reveal open={state.aggregated}><div className={s.aggregate}><ChartBar size={20}/><span>#42 · 2 次</span><span>#78 · 1 次</span></div></Reveal></div>
      <div className={s.archive} data-done={state.archived}><Archive size={33}/><h3>独立归档</h3><States index={state.archived ? 1 : 0}>{[<p key="wait">等待原始输入</p>, <p key="saved">s1 的 4 条原始记录已保留</p>]}</States><button disabled={!state.read || state.archived} onClick={() => act('archive')}>归档原始输入</button></div>
    </div>
    <div className={s.report}><div><h3>可使用的报表</h3><States index={state.published ? 1 : 0}>{[<div key="old"><code>v0</code><p>#42 · 1 次　#78 · 1 次</p></div>, <div key="new"><code>run-42 · s1 / q2</code><p>#42 · 2 次　#78 · 1 次</p></div>]}</States></div><div><p>汇总{state.aggregated ? '已完成' : '未完成'} · 归档{state.archived ? '已完成' : '未完成'}</p><button disabled={!state.aggregated || !state.archived || state.published} onClick={() => act('publish')}>发布核对后报表</button></div></div>
    <button className={base.reset} onClick={() => setState(initialPipeline())}><ArrowCounterClockwise size={17}/>重置本次运行</button>
  </div>;
}
export function WebhookLesson() {
  const [state, setState] = useState(initialWebhook);
  const [loseResponse, setLoseResponse] = useState(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：Webhook 受理与后台处理">
    <div className={s.actions}><button onClick={() => setState(deliverWebhook(state, 'valid'))}>投递有效通知</button><button onClick={() => setState(deliverWebhook(state, 'tampered'))}>投递被改写的通知</button></div>
    <div className={s.webhook}><div className={s.delivery}><h3><EnvelopeSimple size={23}/>HTTP 通知</h3><code>evt-42 · order.paid</code><States index={state.delivery === 'none' ? 0 : state.delivery === 'tampered' ? 2 : 1}>{[<p key="none">尚未投递</p>, <p key="valid">本次载荷与签名匹配</p>, <p key="tampered">本次载荷已被改写</p>]}</States><button disabled={state.delivery === 'none' || state.verified || state.receipt !== 'waiting'} onClick={() => setState(verifyWebhook(state))}>验证本次签名</button><div role="status"><States index={state.receipt === 'rejected' ? 2 : state.verified ? 1 : 0}>{[<p key="pending">未验证</p>, <p key="valid">验证通过 · 可以受理</p>, <p key="invalid">验证失败 · 返回 400，拒绝受理</p>]}</States></div><label className={s.checkbox}><input type="checkbox" checked={loseResponse} onChange={event => setLoseResponse(event.target.checked)}/>让本次响应丢失</label><button disabled={!state.verified || state.receipt !== 'waiting'} onClick={() => setState(acceptWebhook(state, loseResponse))}>受理并返回 2xx</button></div>
      <div className={s.backOffice}><h3><Database size={23}/>受理记录</h3><div className={s.receiptCount}><strong>{state.stored ? 1 : 0}</strong><code>evt-42</code></div><div role="status"><States index={state.processed ? 3 : state.receipt === 'duplicate' ? 2 : state.stored ? 1 : 0}>{[<p key="none">尚无受理记录</p>, <p key="new">通知已受理，等待后台处理</p>, <p key="duplicate">同一事件已有记录 · 不重复创建工作</p>, <p key="done">通知已受理，后台处理已完成</p>]}</States></div><div className={s.order}><span>订单 order-42</span><States index={state.processed ? 1 : 0}>{[<strong key="pending">业务未处理</strong>, <strong key="done">付款状态已更新一次</strong>]}</States></div><button disabled={!state.stored || state.processed} onClick={() => setState(processWebhook(state))}>后台处理订单</button></div>
    </div>
    <div className={s.sender} role="status"><span>发送方看到的结果</span><States index={['none', 'rejected', 'sent', 'lost'].indexOf(state.response)}>{[<p key="none">等待本次确认</p>, <p key="rejected">400 · 通知未受理</p>, <p key="sent">2xx · 接收方已确认，不代表业务已完成</p>, <p key="lost">确认未收到 · 本次结果未知</p>]}</States></div>
    <button className={base.reset} onClick={() => { setState(initialWebhook()); setLoseResponse(false); }}><ArrowCounterClockwise size={17}/>清空通知与受理记录</button>
  </div>;
}
export function DistributedLesson() {
  const [state, setState] = useState(initialDistributed);
  const act = (action: Parameters<typeof runDistributed>[1]) => setState(current => runDistributed(current, action));
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：两端观察与超时">
    <label className={s.scenario}>本次故障<select value={state.mode} onChange={event => setState(initialDistributed(event.target.value as LossMode))}><option value="response-lost">处理后的响应丢失</option><option value="request-lost">请求在途中丢失</option></select></label>
    <div className={s.nodes}><div className={s.caller}><h3>A · 借阅服务</h3><code>reserve-42 · 书目42 / 数量1</code><ol><li>{state.sent ? '已发出请求' : '尚未发送'}</li><li><States index={['idle', 'waiting', 'unknown', 'confirmed', 'not-found'].indexOf(state.caller)}>{[<p key="idle">等待操作</p>, <p key="waiting">等待远端响应</p>, <p key="unknown"><strong>超时 · 执行结果未知</strong></p>, <p key="confirmed">已核对 · reserve-42 执行成功</p>, <p key="not-found">已查询 B · 本例没有执行记录</p>]}</States></li></ol><div className={s.actions}><button disabled={state.sent} onClick={() => act('send')}>A 发出库存请求</button><button disabled={state.caller !== 'waiting' || (state.mode === 'response-lost' && !state.remoteDone)} onClick={() => act('timeout')}>A 等待超时</button></div></div>
      <div className={s.remote}><h3>B · 库存服务</h3><div className={s.stock}><span>书目 #42 库存</span><States index={state.remoteDone ? 1 : 0}>{[<strong key="five">5</strong>, <strong key="four">4</strong>]}</States></div><div role="status"><States index={state.remoteDone ? 2 : state.sent && state.mode === 'response-lost' ? 1 : 0}>{[<p key="none">未收到请求 · 没有执行记录</p>, <p key="received">已收到请求 · 尚未扣减</p>, <p key="done"><CheckCircle size={19}/>reserve-42 已记账 · 只扣 1 本</p>]}</States></div><button disabled={!state.sent || state.mode !== 'response-lost' || state.remoteDone} onClick={() => act('process')}>B 执行并发回响应</button></div></div>
    <Reveal open={state.sent}><div className={s.network}><EnvelopeSimple size={20}/><States index={state.mode === 'request-lost' ? 0 : state.remoteDone ? 2 : 1}>{[<span key="request">原请求在途中丢失</span>, <span key="sent">原请求已送到 B</span>, <span key="response">原响应在返回途中丢失</span>]}</States></div></Reveal>
    <div className={s.actions}><button disabled={state.caller !== 'unknown'} onClick={() => act('query')}>按操作 ID 查询 B</button><button disabled={['idle', 'waiting'].includes(state.caller)} onClick={() => act('retry')}>恢复网络并按同一 ID 重试</button></div><Reveal open={state.retried}><p>本次重试得到确认，reserve-42 只有一份执行记录，库存仍为 4。</p></Reveal>
    <button className={base.reset} onClick={() => setState(initialDistributed(state.mode))}><ArrowCounterClockwise size={17}/>重置两端记录</button>
  </div>;
}
