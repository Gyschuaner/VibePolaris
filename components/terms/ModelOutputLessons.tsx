'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Check, Function, Pause, Play, Stop, X } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { useScene } from './HarnessStoryScenes';
import { streamEvents, receiveEvents, outputCandidates, constrainedCandidate, attemptOutput, functionRequest, executeFunction, type StreamKind, type OutputMode, type OutputEnd } from '@/lib/model-output-teaching';
import base from './EventConcepts.module.css';
import s from './ModelOutputConcepts.module.css';

export function StreamingOutputLesson() {
  const [kind, setKind] = useState<StreamKind>('normal'), [events, setEvents] = useState(streamEvents('normal'));
  const [open, setOpen] = useState(false), [cancelled, setCancelled] = useState(false), [run, setRun] = useState(0);
  const scene = useScene(events.length + 1), report = receiveEvents(events, scene.step, cancelled);
  const invalidate = () => { scene.seek(scene.step); setOpen(false); };
  const start = () => { setEvents(streamEvents(kind)); setCancelled(false); setRun(n => n + 1); scene.seek(1); setOpen(true); };
  return <div ref={scene.ref} className={`${base.lab} ${s.lab} ${s.receiptLab}`} role="region" aria-label="实验：接收增量与完成事件">
    <div className={s.controls}><label>响应情境<select value={kind} onChange={e => { setKind(e.target.value as StreamKind); invalidate(); }}><option value="normal">完整回答</option><option value="error">收到两段后中断</option><option value="empty">正常结束但没有文本</option></select></label><button type="button" disabled={open} onClick={start}>建立本次响应<ArrowRight size={18}/></button></div>
    <Reveal open={open}><div key={run} className={s.receiptDesk}><div className={s.eventList}><h3>事件卷轴</h3>{events.map((event, i) => <Reveal key={i} open={i < scene.step}><div className={s.event}><span>{String(i + 1).padStart(2, '0')}</span><code>{event.type}</code><p>{event.text}</p></div></Reveal>)}</div><div className={s.receiptReceiver}><div className={s.receiptSheet}><span className={s.receiptSheetHead}>配送通知 · A102</span>{events.filter(e => e.type === 'delta').map((event, i) => <span key={i} className={s.receiptLine} data-delivered={i + 1 < scene.step}>{event.text}</span>)}<span className={s.receiptEnd} data-visible={report.complete || report.terminal}>{report.complete ? '完成章' : report.terminal ? '断流，未完成' : '等待结束'}</span></div><States index={cancelled ? 3 : report.complete ? 2 : report.terminal ? 4 : events[scene.step - 1]?.type === 'text-done' ? 1 : 0}>{[<p key="receiving">纸带还在来</p>,<p key="textdone">文字结束，仍等待完成事件</p>,<p key="complete">响应已完成{report.text === '' && '，没有文本'}</p>,<p key="cancel">已取消，保留部分文字</p>,<p key="error">已中断，回答未完成</p>]}</States><div role="status" className={s.evidence}>收到 {report.received.length} 个事件 · {report.complete ? '完整响应' : '尚非完整响应'}</div></div></div>
      <div className={s.actions}><button type="button" disabled={!open || report.terminal} onClick={() => scene.seek(Math.min(events.length, scene.step + 1))}>接收下一事件<ArrowRight size={18}/></button><button type="button" disabled={!open || report.terminal} aria-label={scene.playing ? '暂停自动接收' : '自动接收事件'} onClick={scene.toggle}>{scene.playing ? <Pause size={18}/> : <Play size={18}/>}</button><button type="button" disabled={!open || report.terminal} onClick={() => { scene.seek(scene.step); setCancelled(true); }}><Stop size={17}/>取消接收</button></div>
    </Reveal>
    <button type="button" className={base.reset} onClick={() => { setKind('normal'); invalidate(); }}><ArrowCounterClockwise size={17}/>重置响应</button>
  </div>;
}

export function StructuredOutputLesson() {
  const [mode, setMode] = useState<OutputMode>('schema'), [candidate, setCandidate] = useState(0), [end, setEnd] = useState<OutputEnd>('normal');
  const [open, setOpen] = useState(false), [report, setReport] = useState(attemptOutput('schema', 0, 'normal'));
  return <div className={`${base.lab} ${s.lab} ${s.moldLab}`} role="region" aria-label="实验：约束候选与核对金额">
    <div className={s.controls}><label>输出方式<select value={mode} onChange={e => { setMode(e.target.value as OutputMode); setOpen(false); }}><option value="schema">按本例 schema 约束</option><option value="json">只要求 JSON</option><option value="instruction">只有自然语言指令</option></select></label><label>结束情境<select value={end} onChange={e => { setEnd(e.target.value as OutputEnd); setOpen(false); }}><option value="normal">正常生成</option><option value="truncated">输出被截断</option><option value="refused">请求被拒绝</option><option value="empty">没有输出</option></select></label></div>
    <div className={s.moldDesk}><div className={s.moldSchema}><span>原始资料 · 金额 120</span><div className={s.moldDieLarge}><strong>amount</strong><code>integer</code><small>required · no extra fields</small></div></div><div className={s.moldCandidateArea}><h3>把一张候选票放上压台</h3><div className={s.moldCandidates}>{outputCandidates.map((text,i) => <button type="button" key={text} aria-pressed={candidate === i} onClick={() => { setCandidate(i); setOpen(false); }} data-allowed={constrainedCandidate(mode,i)}><code>{text}</code>{constrainedCandidate(mode,i) ? <Check size={19}/> : <X size={19}/>}<span>{constrainedCandidate(mode,i) ? '可压印' : '校验拒绝'}</span></button>)}</div></div></div>
    <button type="button" disabled={open} onClick={() => { setReport(attemptOutput(mode,candidate,end)); setOpen(true); }}>尝试生成并检查<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.moldResult} role="status"><div className={s.moldTicketLarge}><h3>{report.status}</h3><pre>{report.text || '没有正常输出'}</pre></div><div className={s.checks}>{[['JSON 可解析',report.parsed],['字段符合要求',report.shape],['金额符合资料',report.fact]].map(([name,passed]) => <div key={String(name)} data-pass={passed}>{passed ? <Check size={20}/> : <X size={20}/>}<span>{name}：{passed ? '通过' : '未通过'}</span></div>)}</div></div></Reveal>
    <button type="button" className={base.reset} onClick={() => { setMode('schema'); setCandidate(0); setEnd('normal'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置约束与候选</button>
  </div>;
}

export function FunctionCallingLesson() {
  const [name, setName] = useState('get_order'), [args, setArgs] = useState('{"order_id":"A102"}'), [allowed, setAllowed] = useState(true);
  const [open, setOpen] = useState(false), [executed, setExecuted] = useState(false), [run, setRun] = useState(0);
  const [request, setRequest] = useState(functionRequest(name,args,allowed)), [result, setResult] = useState(executeFunction(request));
  const invalidate = () => { setOpen(false); setExecuted(false); };
  return <div className={`${base.lab} ${s.lab} ${s.counterLab}`} role="region" aria-label="实验：接到函数请求后再执行">
    <div className={s.controls}><label>请求函数<select value={name} onChange={e => { setName(e.target.value); invalidate(); }}><option value="get_order">get_order（已注册）</option><option value="unknown_function">unknown_function（未注册）</option></select></label><label className={s.check}><input type="checkbox" checked={allowed} onChange={e => { setAllowed(e.target.checked); invalidate(); }}/>本次可查询订单</label></div>
    <label className={s.arguments}>请求参数<textarea value={args} onChange={e => { setArgs(e.target.value); invalidate(); }} spellCheck={false}/></label>
    <button type="button" disabled={open} onClick={() => { setRequest(functionRequest(name,args,allowed)); setRun(n => n + 1); setExecuted(false); setOpen(true); }}>收到这份函数请求<ArrowRight size={18}/></button>
    <Reveal open={open}><div key={run} className={s.counterDesk}><div className={s.counterRequest}><span>模型递来的取号牌</span><strong>{request.name}</strong><code>编号 · {request.call_id}</code><pre>{request.arguments}</pre><p>牌子到了，订单柜还没有打开。</p></div><div className={s.counterExecutor}><h3>应用的柜台</h3><div className={s.counterRegister}><Function size={19}/><code>get_order(order_id)</code><span>注册名 · 参数 · 访问权</span></div><button type="button" disabled={!open || executed} onClick={() => { setResult(executeFunction(request)); setExecuted(true); }}>检查并开柜<ArrowRight size={18}/></button></div><Reveal open={executed}><div className={s.counterResult} role="status"><h3>{result.reason}</h3><p>函数执行 {result.executions} 次</p><pre>{result.response || '没有业务结果'}</pre><code>对应取号牌：{result.call_id}</code></div></Reveal></div></Reveal>
    <button type="button" className={base.reset} onClick={() => { setName('get_order'); setArgs('{"order_id":"A102"}'); setAllowed(true); invalidate(); }}><ArrowCounterClockwise size={17}/>重置函数请求</button>
  </div>;
}
