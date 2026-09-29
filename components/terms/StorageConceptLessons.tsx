"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowDown, ArrowRight, BookOpen, Check, Database, FloppyDisk, MagnifyingGlass } from "@phosphor-icons/react";
import { books, queryBooks, saveBook, searchBooks, initialLoan, advanceLoan, type Book } from "@/lib/storage-teaching";
import { Reveal, States } from "./ExtendedConceptLessons";
import s from "./StorageConcepts.module.css";
import base from "./EventConcepts.module.css";

export function DatabaseLesson() {
  const [records, setRecords] = useState(books.slice(0, 4));
  const [draft, setDraft] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [result, setResult] = useState<Book[]>([]);
  const [resultDetails, setResultDetails] = useState(books.slice(0, 4));
  const [queried, setQueried] = useState(false);
  const [version, setVersion] = useState(0);
  const [queriedVersion, setQueriedVersion] = useState(0);
  const reset = () => { setRecords(books.slice(0, 4)); setDraft(true); setAvailableOnly(true); setQueried(false); setVersion(0); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="数据库保存与查询演示">
    <div className={s.catalogueDesk}>
      <div className={s.editor}><BookOpen size={30} weight="light" /><h3>山间来信 <code>#42</code></h3><label className={base.option}><input type="checkbox" checked={draft} onChange={e => setDraft(e.target.checked)} />草稿：可借</label>
        <button disabled={draft === records[0].available} onClick={() => { setRecords(saveBook(records, 42, draft)); setVersion(v => v + 1); }}><FloppyDisk size={18} />保存修改</button>
        <button className={s.quiet} onClick={() => setDraft(records[0].available)}>重开编辑界面<ArrowCounterClockwise size={17} /></button>
      </div>
      <div className={s.catalogue}><h3><Database size={21} />已保存书目</h3><div className={s.savedRows}>{records.map(book => <div key={book.id}><code>{book.id}</code><span>{book.title}</span><States index={book.available ? 0 : 1}>{[<span key="yes">可借</span>, <span key="no">已借出</span>]}</States></div>)}</div></div>
    </div>
    <div className={s.queryBar}><label className={base.option}><input type="checkbox" checked={availableOnly} onChange={e => { setAvailableOnly(e.target.checked); setQueried(false); }} />只查可借书目</label><button onClick={() => { const next = queryBooks(records, availableOnly); setResult(next); setResultDetails(previous => previous.map(book => next.find(row => row.id === book.id) ?? book)); setQueriedVersion(version); setQueried(true); }}><MagnifyingGlass size={18} />查询书目</button></div>
    <Reveal open={queried}><div className={s.queryResult} role="status"><h3>上次查询结果 <span>{queriedVersion < version ? "保存后尚未重查" : `${result.length} 条`}</span></h3><div className={s.resultBooks}>{resultDetails.map(book => <Reveal key={book.id} open={result.some(row => row.id === book.id)}><div className={s.resultBook}><BookOpen size={23} weight="light" /><strong>{book.title}</strong><span>#{book.id} · {book.available ? "可借" : "已借出"}</span></div></Reveal>)}</div></div></Reveal>
    <button className={base.reset} onClick={reset}><ArrowCounterClockwise size={18} />重置数据演示</button>
  </div>;
}

export function IndexLesson() {
  const [indexed, setIndexed] = useState(true);
  const [target, setTarget] = useState(64);
  const [step, setStep] = useState(0);
  const [receipt, setReceipt] = useState<Book | null>(null);
  const [readCount, setReadCount] = useState(0);
  const [read, setRead] = useState(false);
  const trace = searchBooks(target, indexed);
  const current = trace.steps[step - 1];
  const ended = step === trace.steps.length;
  const found = !!current?.found;
  const clear = () => { setStep(0); setRead(false); };
  const next = () => {
    if (ended) return;
    const candidate = trace.steps[step];
    setStep(step + 1);
    if (!indexed && candidate.found) { setReceipt(books.find(book => book.id === candidate.id)!); setRead(true); }
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="索引查找演示">
    <div className={s.searchControls}><div className={s.modes}><button aria-pressed={!indexed} onClick={() => { setIndexed(false); clear(); }}>顺序扫描</button><button aria-pressed={indexed} onClick={() => { setIndexed(true); clear(); }}>有序目录</button></div><label>查找编号 <select value={target} onChange={e => { setTarget(Number(e.target.value)); clear(); }}>{[64, 42, 65].map(id => <option key={id} value={id}>#{id}{id === 65 ? "（不存在）" : ""}</option>)}</select></label></div>
    <div className={s.searchBand} role="group" aria-label={indexed ? "有序目录候选" : "顺序扫描候选"}>
      {trace.entries.map((entry, i) => <div key={entry.id} data-active={i === current?.position} data-excluded={!!current && (ended && !found || i < current.low || i > current.high)} data-found={current?.found && i === current.position}><strong>{entry.id}</strong><span>{indexed ? `位置 ${books.findIndex(book => book.id === entry.id) + 1}` : entry.title}</span></div>)}
    </div>
    <div className={s.searchReadout} aria-live="polite"><States index={read && indexed ? trace.steps.length + 1 : step}>{[<p key="start">目标 <strong>#{target}</strong> · 等待第一次比较</p>, ...trace.steps.map((frame, i) => <p key={i}>第 {i + 1} 次比较 · <strong>#{frame.id}</strong>{frame.found ? indexed ? " 命中目录，等待读取记录" : " 匹配，已读取记录" : i === trace.steps.length - 1 ? " 不匹配，范围耗尽：未找到" : indexed ? frame.id < target ? " 小于目标，继续右侧" : " 大于目标，继续左侧" : " 不匹配，继续下一条"}</p>), <p key="read">目录比较 {readCount} 次 · 已读取 <strong>#{receipt?.id}</strong> 的记录</p>]}</States></div>
    <div className={s.actions}><button disabled={ended} onClick={next}>比较下一项<ArrowRight size={18} /></button><button disabled={!indexed || !found || read} onClick={() => { setReceipt(books.find(book => book.id === current.id)!); setReadCount(step); setRead(true); }}><BookOpen size={18} />读取记录</button><button aria-label="重置查找" onClick={clear}><ArrowCounterClockwise size={18} /></button></div>
    <div className={s.recordLocations}><h3>原记录位置</h3><div>{books.map((book, i) => <span key={book.id} data-selected={read && receipt?.id === book.id}><small>{i + 1}</small><code>#{book.id}</code></span>)}</div></div>
    <Reveal open={read}><div className={s.searchReceipt} role="status"><BookOpen size={26} /><div><strong>{receipt?.title}</strong><span>#{receipt?.id} · {receipt?.available ? "可借" : "已借出"}</span></div></div></Reveal>
  </div>;
}

export function TransactionLesson() {
  const [grouped, setGrouped] = useState(true);
  const [fail, setFail] = useState(false);
  const [state, setState] = useState(initialLoan);
  const done = ["failed", "committed", "rolledback"].includes(state.phase);
  const nextLabel = state.phase === "idle" ? "开始借书" : state.phase === "started" ? "减少可借数量" : state.phase === "reserved" ? "写入借阅记录" : "提交事务";
  const phases = ["idle", "started", "reserved", "ready", "failed", "committed", "rolledback"];
  const statuses = ["尚未开始", grouped ? "事务已开始" : "两步将分别提交", grouped ? "数量已改，尚未提交" : "数量修改已提交", "两项已改，等待提交", grouped ? "借阅写入失败，等待回滚" : "借阅写入失败，数量修改已经生效", "借书完成", "已回滚，本次修改未生效"];
  return <div className={`${base.lab} ${s.lab}`} aria-label="借书事务演示">
    <div className={base.options}><label className={base.option}><input type="checkbox" checked={grouped} onChange={e => { setGrouped(e.target.checked); setState(initialLoan()); }} />两步放在同一事务</label><label className={base.option}><input type="checkbox" checked={fail} onChange={e => { setFail(e.target.checked); setState(initialLoan()); }} />借阅记录写入失败</label></div>
    <div className={s.transactionWork} data-grouped={grouped} data-finished={state.phase === "committed"}>
      <h3>{grouped ? "本次事务内" : "本次操作"}</h3>
      <div className={s.loanObjects}><div><span>可借数量</span><div className={s.bookTokens}><BookOpen size={43} weight="light" /><BookOpen size={43} weight="light" data-removed={state.working.available === 1} /></div><States index={state.working.available === 2 ? 0 : 1}>{[<strong key="two">2 本</strong>,<strong key="one">1 本</strong>]}</States></div><div><span>新增借阅</span><div className={s.loanSlip} data-filled={state.working.loans === 1} aria-hidden={state.working.loans === 0}><Check size={20} /><strong>#42 · 林舟</strong></div><States index={state.working.loans}>{[<strong key="zero">0 条</strong>,<strong key="one">1 条</strong>]}</States></div></div>
    </div>
    <div className={s.commitBridge} data-committed={state.phase === "committed"}><ArrowDown size={25} /><span>{grouped ? "提交后对外生效" : "每一步各自生效"}</span></div>
    <div className={s.committedValues} aria-label="新查询可见的已提交数据"><span>新查询可见</span><div><span>可借</span><States index={state.committed.available === 2 ? 0 : 1}>{[<strong key="two">2 本</strong>,<strong key="one">1 本</strong>]}</States></div><div><span>借阅</span><States index={state.committed.loans}>{[<strong key="zero">0 条</strong>,<strong key="one">1 条</strong>]}</States></div></div>
    <div className={s.actions}><button disabled={done} onClick={() => setState(advanceLoan(state, "next", grouped, fail))}>{done ? "本次已结束" : nextLabel}<ArrowRight size={18} /></button><button disabled={!grouped || ["idle", "committed", "rolledback"].includes(state.phase)} onClick={() => setState(advanceLoan(state, "rollback", grouped, fail))}>回滚</button><button onClick={() => setState(initialLoan())}><ArrowCounterClockwise size={18} />重新实验</button></div>
    <div className={s.transactionStatus} aria-live="polite"><States index={phases.indexOf(state.phase)}>{statuses.map((text, i) => <p key={i}>{text}</p>)}</States></div>
  </div>;
}
