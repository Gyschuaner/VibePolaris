"use client";

import { useState } from "react";
import { ArrowCounterClockwise, Blueprint, Check, EnvelopeSimple, Plus, X } from "@phosphor-icons/react";
import { changeSchema, initialSchema, joinBooks, joinLoans, pairRows, joinSql, writeRegistration, type JoinMode, type Registration } from "@/lib/structure-teaching";
import { Reveal, States } from "./ExtendedConceptLessons";
import s from "./StructureConcepts.module.css";
import base from "./EventConcepts.module.css";

export function SchemaLesson() {
  const [state, setState] = useState(initialSchema);
  const [feedback, setFeedback] = useState(0);
  const act = (action: Parameters<typeof changeSchema>[1]) => {
    const next = changeSchema(state, action);
    setState(next.state);
    setFeedback(next.result === "added" ? 1 : next.result === "filled" ? 2 : next.result === "null-remains" ? 3 : next.result === "required" ? 4 : 0);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="书目结构变更演示">
    <div className={s.schemaDesk}>
      <div className={s.blueprint}><h3><Blueprint size={23} />books 的定义</h3><dl><dt>book_id</dt><dd>integer · PRIMARY KEY</dd><dt>title</dt><dd>text · NOT NULL</dd></dl><Reveal open={state.added}><dl><dt>available</dt><dd>boolean<States index={state.required ? 1 : 0}>{[<span key="nullable">允许 NULL</span>, <strong key="required">NOT NULL</strong>]}</States></dd></dl></Reveal></div>
      <div className={s.schemaRecords}><h3>已有书目</h3>{[42,78].map((id,i) => <div key={id}><strong>#{id}</strong><span>{i === 0 ? "山间来信" : "夜空地图"}</span><Reveal open={state.added}><States index={state.values[i] === null ? 0 : 1}>{[<code key="null">available: NULL</code>,<code key="filled">available: {i === 0 ? "true" : "false"}</code>]}</States></Reveal></div>)}</div>
    </div>
    <div className={s.schemaActions}><button disabled={state.added} onClick={() => act("add")}><Plus size={17} />增加可空列</button><button disabled={!state.added || state.values[0] !== null} onClick={() => act("fill42")}>#42 填 true</button><button disabled={!state.added || state.values[1] !== null} onClick={() => act("fill78")}>#78 填 false</button><button disabled={!state.added || state.required} onClick={() => act("require")}>设为 NOT NULL</button></div>
    <div className={s.feedback} role="status"><States index={feedback}>{[<p key="0">先增加 available 列。</p>,<p key="1">列已增加；两条旧记录的值先是 NULL。</p>,<p key="2">已更新这条书目的值，列仍允许 NULL。</p>,<p key="3"><X size={18} />仍有 NULL，拒绝设为非空；当前定义没有改变。</p>,<p key="4"><Check size={18} />旧记录已补齐；available 现在是必填列。</p>]}</States></div>
    <button className={base.reset} onClick={() => { setState(initialSchema()); setFeedback(0); }}><ArrowCounterClockwise size={17} />恢复初始结构</button>
  </div>;
}

const modes: [JoinMode,string][] = [["inner","INNER"],["books-left","书目 LEFT"],["loans-left","借阅 LEFT"],["cross","CROSS"]];
export function JoinLesson() {
  const [index, setIndex] = useState(0);
  return <div className={`${base.lab} ${s.lab}`} aria-label="书目与借阅连接演示">
    <div className={s.matrix} role="table" aria-label="两条书目与三条借阅的候选配对">
      <div role="row"><span role="columnheader">书目 / 借阅</span>{joinLoans.map(loan => <span role="columnheader" key={loan.id}><strong>借阅 {loan.id}</strong><span>#{loan.bookId} · {loan.reader}</span></span>)}</div>
      {joinBooks.map(book => <div role="row" key={book.id}><span role="rowheader"><strong>#{book.id}</strong><span>{book.title}</span></span>{joinLoans.map(loan => <span role="cell" key={loan.id} data-active={index > 0 && (index === 4 || book.id === loan.bookId)}>{book.id === loan.bookId ? <Check size={21} /> : <X size={19} />}<span>{book.id === loan.bookId ? "编号相同" : "编号不同"}</span></span>)}</div>)}
    </div>
    <div className={s.joinControls} role="group" aria-label="选择连接方式">{modes.map(([mode,label],i) => <button key={mode} aria-pressed={index === i+1} onClick={() => setIndex(i+1)}>{label}</button>)}</div>
    <div className={s.joinOutput} aria-live="polite"><Reveal open={index === 0}><div><h3>选择连接方式</h3><p>看哪些配对会进入查询结果。</p></div></Reveal>{modes.map(([mode,label],modeIndex) => <Reveal key={mode} open={index === modeIndex+1}><div><h3>{label} · {pairRows(mode).length} 行结果</h3><pre>{joinSql(mode)}</pre><div className={s.joinRows}>{pairRows(mode).map((row,i) => <div className={s.joinRow} key={i}><div><strong>{row.book ? `#${row.book.id} · ${row.book.title}` : "book_id: NULL · title: NULL"}</strong></div><div>{row.loan ? <><strong>借阅 {row.loan.id} · {row.loan.reader}</strong><code>loan_book_id: {row.loan.bookId}</code></> : <><strong>loan_id: NULL</strong><code>loan_book_id: NULL · reader: NULL</code></>}</div></div>)}</div></div></Reveal>)}</div>
    <button className={base.reset} onClick={() => setIndex(0)}><ArrowCounterClockwise size={17} />清空查询结果</button>
  </div>;
}

const emailText = (email: string | null) => email === null ? "NULL" : email;
export function UniqueLesson() {
  const [unique, setUnique] = useState(true);
  const [nullInput, setNullInput] = useState(false);
  const [nullsEqual, setNullsEqual] = useState(false);
  const [checked, setChecked] = useState(false);
  const [rows, setRows] = useState<Registration[]>([]);
  const [results, setResults] = useState<[number,number]>([0,0]);
  const email = nullInput ? null : "lin@example.com";
  const reset = () => { setChecked(false); setRows([]); setResults([0,0]); };
  const write = (request: "A" | "B") => {
    const next = writeRegistration(rows, request, email, unique, nullsEqual);
    setRows(next.rows);
    setResults(old => { const copy: [number,number] = [...old]; copy[request === "A" ? 0 : 1] = next.result === "rejected" ? 3 : 2; return copy; });
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="两个注册请求的唯一性演示">
    <div className={s.uniqueOptions}><label className={base.option}><input type="checkbox" checked={unique} onChange={event => { reset(); setUnique(event.target.checked); }} />启用 UNIQUE</label><label>输入<select value={nullInput ? "null" : "email"} onChange={event => { reset(); setNullInput(event.target.value === "null"); }}><option value="email">相同邮箱</option><option value="null">两个 NULL</option></select></label><label className={base.option}><input type="checkbox" checked={nullsEqual} disabled={!nullInput || !unique} onChange={event => { reset(); setNullsEqual(event.target.checked); }} />NULLS NOT DISTINCT</label></div>
    <div className={s.requests}>{(["A","B"] as const).map((request,i) => <div key={request}><h3><EnvelopeSimple size={22} />请求 {request} · #{i === 0 ? 101 : 102}</h3><code>{emailText(email)}</code><div className={s.requestStatus} role="status"><States index={results[i]}>{[<span key="0">还没有预查</span>,<span key="1">预查：未占用</span>,<span key="2"><Check size={17} />写入成功</span>,<span key="3"><X size={17} />写入冲突，未新增</span>]}</States></div><button disabled={!checked || results[i] > 1} onClick={() => write(request)}>写入 {request}</button></div>)}</div>
    <button className={s.precheck} disabled={checked} onClick={() => { setChecked(true); setResults([1,1]); }}>让两份请求分别预查</button>
    <div className={s.ledger}><h3>registrations · {rows.length} 行</h3><States index={rows.length === 0 ? 0 : rows.length === 1 ? rows[0].request === "A" ? 1 : 2 : rows[0].request === "A" ? 3 : 4}>{[<p key="empty">尚无注册记录</p>, ...([['A'],['B'],['A','B'],['B','A']] as const).map((requests,i) => <div key={i}>{requests.map(request => <div className={s.registered} key={request}><strong>#{request === "A" ? 101 : 102}</strong><States index={nullInput ? 1 : 0}>{[<code key="email">lin@example.com</code>,<code key="null">NULL</code>]}</States></div>)}</div>)]}</States></div>
    <button className={base.reset} onClick={reset}><ArrowCounterClockwise size={17} />重新比较</button>
  </div>;
}
