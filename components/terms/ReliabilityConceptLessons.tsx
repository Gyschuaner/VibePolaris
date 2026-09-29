"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CalendarBlank, Check, Clock, Hourglass, PaperPlaneTilt } from "@phosphor-icons/react";
import { Reveal, States } from "./ExtendedConceptLessons";
import { timeoutState, retryAttempt, reserveOnce, type ReservationEntry, type RetryScenario } from "@/lib/reliability-teaching";
import s from "./ReliabilityConcepts.module.css";
import base from "./EventConcepts.module.css";

export function TimeoutLesson() {
  const [limit, setLimit] = useState(2);
  const [time, setTime] = useState(-1);
  const [queried, setQueried] = useState(false);
  const current = timeoutState(Math.max(time, 0), limit);
  const clientIndex = time < 0 ? 0 : current.client === "received" ? 3 : current.client === "timeout" ? 2 : 1;
  return <div className={`${base.lab} ${s.lab}`} aria-label="超时双时间线实验">
    <div className={s.toolbar}><span>等待上限</span>{[2, 5].map(value => <button key={value} aria-pressed={limit === value} onClick={() => { setLimit(value); setTime(-1); setQueried(false); }}>{value} 秒</button>)}<output>{Math.max(time, 0)} s</output></div>
    <div className={s.timeline}>
      <div className={s.timeLane}><h3><Clock size={22} />客户端</h3><div className={s.track}><i style={{ transform: `scaleX(${current.clientTime / 5})` }} /><span className={s.deadline} style={{ left: `${limit / 5 * 100}%` }}>{limit}s</span></div><div className={s.laneState}><States index={clientIndex}>{[<p key="idle">尚未发送</p>, <p key="wait">等待确认</p>, <p key="timeout">原请求已超时</p>, <p key="ok"><Check size={17} />收到原确认 · 预约 #42</p>]}</States></div></div>
      <div className={s.timeLane}><h3><CalendarBlank size={22} />服务端</h3><div className={s.track}><i style={{ transform: `scaleX(${current.serverTime / 5})` }} /><span className={s.commitMark}>3s</span></div><div className={s.laneState}><States index={time < 0 ? 0 : current.committed ? 2 : 1}>{[<p key="idle">尚无预约</p>, <p key="work">正在处理</p>, <p key="committed"><Check size={17} />已建立预约 #42</p>]}</States></div></div>
    </div>
    <div className={s.toolbar}><button disabled={time >= 4} onClick={() => setTime(value => value + 1)}>{time < 0 ? "发送申请 R7" : "推进 1 秒"}<ArrowRight size={17} /></button><button disabled={time < 4 || limit !== 2 || queried} onClick={() => setQueried(true)}>查询申请 R7</button><button className={s.iconButton} aria-label="重置超时实验" onClick={() => { setTime(-1); setQueried(false); }}><ArrowCounterClockwise size={19} /></button></div>
    <div className={s.result} role="status"><States index={queried ? 3 : time < 4 ? 0 : limit === 5 ? 1 : 2}>{[<p key="hint">第 3 秒建立预约；仍在等待时，第 4 秒可收到确认。</p>, <p key="success">确认在上限前到达，原请求成功。</p>, <p key="late">第 4 秒回信才准备好，原请求已在第 2 秒结束。</p>, <p key="query">新查询按 R7 找到 #42；原请求仍是超时，没有重新创建预约。</p>]}</States></div>
  </div>;
}

const retryScenarios: [RetryScenario, string][] = [["temporary", "短暂故障"], ["persistent", "持续故障"], ["invalid", "请求有误"]];
export function RetryLesson() {
  const [scenario, setScenario] = useState<RetryScenario>("temporary");
  const [attempts, setAttempts] = useState<{ time: number; status: number }[]>([]);
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(0);
  const [run, setRun] = useState(0);
  const last = attempts.length ? retryAttempt(scenario, attempts.length) : null;
  const reset = () => { setAttempts([]); setTime(0); setReady(false); setRun(value => value + 1); };
  const send = () => {
    if (last?.stop || (last && !ready)) return;
    const result = retryAttempt(scenario, attempts.length + 1);
    setAttempts([...attempts, { time, status: result.status }]);
    setReady(false);
  };
  const statusIndex = !last ? 0 : last.stop === "success" ? 3 : last.stop === "invalid" ? 4 : last.stop === "exhausted" ? 5 : ready ? 2 : 1;
  return <div className={`${base.lab} ${s.lab}`} aria-label="有上限的重试实验">
    <div className={s.toolbar}>{retryScenarios.map(([value, label]) => <button key={value} aria-pressed={scenario === value} onClick={() => { setScenario(value); reset(); }}>{label}</button>)}</div>
    <div className={s.attemptStage}><div className={s.attemptBudget}><strong>{attempts.length}<span> / 3</span></strong><span>总尝试次数</span><code>t = {time} s</code></div><div className={s.attemptTrail}>{[0, 1, 2].map(i => <div key={i} className={s.attempt} data-filled={i < attempts.length} data-success={attempts[i]?.status === 200} style={{ marginLeft: `${i * 18}px` }}><span>0{i + 1}</span><strong>{attempts[i]?.status ?? "—"}</strong><code>{attempts[i] ? `${attempts[i].time} s` : "未发送"}</code></div>)}</div></div>
    <div className={s.retryStatus} role="status"><States key={run} index={statusIndex}>{[<p key="0">GET /reservations/{scenario === "invalid" ? "abc" : "42"}</p>, <p key="1"><Hourglass size={19} />等待 {last?.wait || 1} 秒后，才允许下一次尝试。</p>, <p key="2">等待已结束，可以再次发送。</p>, <p key="3"><Check size={19} />收到预约 #42，停止重试。</p>, <p key="4">预约号格式不对，停止重发相同请求。</p>, <p key="5">三次尝试都失败，停止重试。</p>]}</States></div>
    <div className={s.toolbar}><button disabled={Boolean(last?.stop) || Boolean(last && !ready)} onClick={send}><PaperPlaneTilt size={18} />{attempts.length === 0 ? "发送首次查询" : "再次查询"}</button><button disabled={!last || Boolean(last.stop) || ready} onClick={() => { setTime(time + (last?.wait ?? 0)); setReady(true); }}>推进 {last?.wait || 1} 秒</button><button className={s.iconButton} aria-label="重置重试实验" onClick={reset}><ArrowCounterClockwise size={19} /></button></div>
  </div>;
}

export function IdempotencyLesson() {
  const [entries, setEntries] = useState<ReservationEntry[]>([]);
  const [requestKey, setRequestKey] = useState("A");
  const [slot, setSlot] = useState("14:00");
  const [resultIndex, setResultIndex] = useState(0);
  const [receipts, setReceipts] = useState(["", "", "", ""]);
  const [show, setShow] = useState(false);
  const send = () => {
    const next = reserveOnce(entries, requestKey, slot);
    setEntries(next.entries);
    const index = entries.length === 0 ? 0 : next.kind === "replayed" ? 1 : next.kind === "conflict" ? 2 : 3;
    const text = ["响应丢失 · 页面还没有拿到预约号。", `返回原预约 #${next.entry.id} · 没有新增。`, `拒绝 · 键 ${next.entry.key} 已用于 ${next.entry.slot}，参数不一致。`, `新建预约 #${next.entry.id} · 使用了另一枚键。`][index];
    // Keep the outgoing receipt intact until its fade finishes.
    setReceipts(values => values.map((value, i) => i === index ? text : value));
    setResultIndex(index);
    setShow(true);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="预约幂等账本实验">
    <div className={s.idemDesk}><div className={s.requestForm}><h3><PaperPlaneTilt size={23} />创建预约</h3><label>幂等键<select value={requestKey} onChange={e => { setRequestKey(e.target.value); setShow(false); }}><option value="A">A · 同一次意图</option><option value="B">B · 另一份意图</option></select></label><label>时段<select value={slot} onChange={e => { setSlot(e.target.value); setShow(false); }}><option>14:00</option><option>16:00</option></select></label><button onClick={send}>提交请求<ArrowRight size={17} /></button></div>
      <div className={s.ledger}><header><CalendarBlank size={24} /><strong>{entries.length}</strong><span>条预约</span></header><div className={s.ledgerRows}>{["A", "B"].map(key => { const entry = entries.find(item => item.key === key); return <div key={key} className={s.ledgerSlot}><span className={s.emptySlot} data-filled={Boolean(entry)} aria-hidden={Boolean(entry)}>键 {key} · 尚无记录</span><div className={s.ledgerEntry} data-filled={Boolean(entry)} aria-hidden={!entry}><code>key {key}</code><strong>#{entry?.id ?? "—"}</strong><span>{entry?.slot ?? "—"}</span></div></div>; })}</div></div></div>
    <Reveal open={show}><div className={s.receipt} role="status"><States index={resultIndex}>{receipts.map((text, i) => <p key={i}>{text}</p>)}</States></div></Reveal>
    <button className={base.reset} onClick={() => { setEntries([]); setRequestKey("A"); setSlot("14:00"); setShow(false); }}><ArrowCounterClockwise size={18} />重置账本</button>
  </div>;
}
