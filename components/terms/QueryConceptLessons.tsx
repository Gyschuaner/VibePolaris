"use client";
import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, BracketsCurly, Database, FileCode, Play } from "@phosphor-icons/react";
import { initialBooks, statement, runStatement, applyMigration, initialOrm, changeObject, type SqlCommand, type BookRow, type MigrationState } from "@/lib/query-teaching";
import { Reveal, States } from "./ExtendedConceptLessons";
import base from "./EventConcepts.module.css";
import s from "./QueryConcepts.module.css";

const commands: [SqlCommand,string][] = [["select","读 SELECT"],["insert","增 INSERT"],["update","改 UPDATE"],["delete","删 DELETE"]];
const fixture = [...initialBooks(), { id: 65, title: "河岸笔记", available: true }];
function Books({ rows, result = false }: { rows: BookRow[]; result?: boolean }) {
  return <div className={s.books}>{fixture.map(book => <Reveal key={book.id} open={rows.some(row => row.id === book.id)}><div className={s.book}><code>#{book.id}</code><strong>{book.title}</strong>{!result && <States index={rows.find(row => row.id === book.id)?.available === false ? 1 : 0}>{[<code key="true">true</code>,<code key="false">false</code>]}</States>}</div></Reveal>)}<Reveal open={rows.length === 0}><p>0 行</p></Reveal></div>;
}
const messages = ["SELECT · 原表没有改动", "INSERT 0 1 · 新增一行", "主键冲突 · #65 已存在，未新增", ...(["UPDATE","DELETE"] as const).flatMap(command => [0,1,2,3].map(count => `${command} ${count} · ${command === "DELETE" ? "删除" : "更新"} ${count} 行`))];
export function SqlLesson() {
  const [rows,setRows] = useState(initialBooks);
  const [command,setCommand] = useState<SqlCommand>("select");
  const [filtered,setFiltered] = useState(true);
  const [result,setResult] = useState<BookRow[]>([]);
  const [message,setMessage] = useState(-1);
  const [read,setRead] = useState(false);
  const execute = () => { const next=runStatement(rows,command,filtered);setRows(next.rows);setResult(next.result);setMessage(messages.indexOf(next.message));setRead(command === "select"); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="SQL 读写指令演示">
    <div className={s.commands} role="group" aria-label="SQL 指令">{commands.map(([value,label]) => <button key={value} aria-pressed={command === value} onClick={() => {setCommand(value);setMessage(-1);setRead(false);}}>{label}</button>)}</div>
    <div className={s.sqlDesk}><div><pre className={s.statement}>{statement(command,filtered)}</pre><Reveal open={command === "update" || command === "delete"}><label className={base.option}><input type="checkbox" checked={filtered} onChange={event => {setFiltered(event.target.checked);setMessage(-1);setRead(false);}} />保留 WHERE book_id = 42</label></Reveal><button onClick={execute}><Play size={17} />执行这条语句</button></div><div className={s.stored}><h3><Database size={21} />books · {rows.length} 行</h3><div className={s.columnNames}><span>book_id</span><span>title</span><span>available</span></div><Books rows={rows} /></div></div>
    <div className={s.response} aria-live="polite"><Reveal open={message >= 0}><States index={message}>{messages.map(text => <p key={text}>{text}</p>)}</States></Reveal><Reveal open={read}><div><h3>本次 SELECT 的返回</h3><Books rows={result} result /></div></Reveal></div>
    <button className={base.reset} onClick={() => {setRows(initialBooks());setCommand("select");setFiltered(true);setMessage(-1);setRead(false);}}><ArrowCounterClockwise size={17} />恢复两条书目</button>
  </div>;
}
const revisions = [2,3,4] as const;
const labels = ["新增 name 列", "复制 title 到 name", "移除 title 列"];
const migrationMessages = ["选择一份迁移，先看它依赖什么。", "缺少前置迁移，结构与执行历史均未改变", "发布检查未通过：旧程序还在读取 title，暂不执行 004", ...revisions.map(n=>`${String(n).padStart(3,"0")} 执行成功，更新数据库与迁移记录`), ...revisions.map(n=>`${String(n).padStart(3,"0")} 已执行，跳过`)];
export function MigrationLesson() {
  const [state,setState] = useState<MigrationState>({revision:1,oldApp:true});
  const [selected,setSelected] = useState<2|3|4>(2);
  const [message,setMessage] = useState(0);
  const execute = () => {const next=applyMigration(state,selected);setState(next.state);setMessage(migrationMessages.indexOf(next.message));};
  return <div className={`${base.lab} ${s.lab}`} aria-label="迁移执行历史与兼容检查演示">
    <div className={s.migrationDesk}><div className={s.files}><h3><FileCode size={22} />共享迁移文件</h3>{revisions.map((revision,i) => <button key={revision} aria-pressed={selected === revision} onClick={() => {setSelected(revision);setMessage(0);}}><code>00{revision}</code><span>{labels[i]}<small>依赖 00{revision-1}</small></span><ArrowRight size={16} /></button>)}<div className={s.localRevision}>开发库已执行至 003</div></div><div className={s.server}><h3><Database size={22} />目标库 · 00{state.revision}</h3><div className={s.migrationRecord}><code>book_id: 42</code><Reveal open={state.revision < 4}><code>title: 山间来信</code></Reveal><Reveal open={state.revision >= 2}><States index={state.revision >= 3 ? 1 : 0}>{[<code key="null">name: NULL</code>,<code key="name">name: 山间来信</code>]}</States></Reveal></div><h3>已执行记录</h3><div className={s.history}>{[1,...revisions].map(revision => <span key={revision} data-applied={state.revision >= revision}>00{revision}</span>)}</div><div className={s.appReads}><span data-retired={!state.oldApp}>旧程序 · 读 title</span><span data-ready={state.revision >= 3}>新程序 · 读 name{state.revision < 2 ? "：缺列" : state.revision === 2 ? "：NULL" : "：山间来信"}</span></div></div></div>
    <div className={s.actions}><button onClick={execute}>执行 00{selected}</button><label className={base.option}><input type="checkbox" checked={state.oldApp} disabled={state.revision === 4} onChange={event => {setState({...state,oldApp:event.target.checked});setMessage(0);}} />旧程序仍在运行</label></div>
    <div className={s.response} role="status"><States index={message}>{migrationMessages.map(text => <p key={text}>{text}</p>)}</States></div>
    <button className={base.reset} onClick={() => {setState({revision:1,oldApp:true});setSelected(2);setMessage(0);}}><ArrowCounterClockwise size={17} />恢复目标库 001</button>
  </div>;
}
const ormStart = initialOrm();
const ormEdited = changeObject(ormStart,"edit"),ormFlushed = changeObject(ormEdited,"flush");
const ormCommitted = changeObject(ormEdited,"commit"),ormRolled = changeObject(ormFlushed,"rollback");
const ormSnapshots = [ormStart,ormEdited,ormFlushed,ormCommitted,ormRolled,changeObject(ormCommitted,"reload"),changeObject(ormRolled,"reload")];
const ormMessages = ["已读取 #42，对象与已提交记录一致。", "只改了对象，还没有 UPDATE。", "UPDATE 已发出，本事务内是新值，尚未提交。", "提交完成；默认 Session 让对象属性过期。", "已回滚；对象属性过期，等待重新读取。", "重新读取后，得到已提交的修订版。", "重新读取后，仍是回滚前的原书名。"];
export function OrmLesson() {
  const [phase,setPhase] = useState(0);
  const state = ormSnapshots[phase];
  return <div className={`${base.lab} ${s.lab}`} aria-label="ORM 对象与事务演示">
    <div className={s.ormDesk}><div className={s.object}><h3><BracketsCurly size={23} />Book 对象</h3><code>book.id = 42</code><States index={state.object === null ? 2 : state.object === ormStart.object ? 0 : 1}>{[<strong key="old">山间来信</strong>,<strong key="edited">山间来信 · 修订版</strong>,<strong key="expired">属性已过期</strong>]}</States><button disabled={phase !== 0} onClick={()=>setPhase(1)}>修改 book.title</button></div><div className={s.transaction}><h3><Database size={23} />books · #42</h3><div><span>本事务已发出的值</span><States index={state.flushed === ormStart.flushed ? 0 : 1}>{[<strong key="old">山间来信</strong>,<strong key="new">山间来信 · 修订版</strong>]}</States></div><div><span>已提交的值</span><States index={state.committed === ormStart.committed ? 0 : 1}>{[<strong key="old">山间来信</strong>,<strong key="new">山间来信 · 修订版</strong>]}</States></div></div></div>
    <div className={s.actions}><button disabled={phase !== 1} onClick={()=>setPhase(2)}>session.flush()</button><button disabled={phase !== 1 && phase !== 2} onClick={()=>setPhase(3)}>session.commit()</button><button disabled={phase !== 2} onClick={()=>setPhase(4)}>session.rollback()</button><button disabled={phase !== 3 && phase !== 4} onClick={()=>setPhase(phase === 3 ? 5 : 6)}>重新读取 book.title</button></div>
    <div className={s.response} role="status"><States index={phase}>{ormMessages.map(text=><p key={text}>{text}</p>)}</States></div>
    <div className={s.trace} aria-label="ORM 发出的 SQL 记录"><h3>SQL 与事务记录</h3>{ormSnapshots.map((snapshot,i) => <Reveal key={i} open={phase === i}><pre>{snapshot.trace.join('\n')}</pre></Reveal>)}</div>
    <button className={base.reset} onClick={()=>setPhase(0)}><ArrowCounterClockwise size={17} />重新比较提交与回滚</button>
  </div>;
}
