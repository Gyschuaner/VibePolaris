"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowDown, BookOpen, Check, Key, MagnifyingGlass, Plus, Trash, X } from "@phosphor-icons/react";
import { tableBooks, readTable, keyBooks, insertKeyBook, renameKeyBook, initialRelation, addLoan, deleteReferencedBook, type TableFilter } from "@/lib/relational-teaching";
import { Reveal, States } from "./ExtendedConceptLessons";
import s from "./RelationalConcepts.module.css";
import base from "./EventConcepts.module.css";

const fields = ["编号", "书名", "可借状态"];
export function TableLesson() {
  const [selected, setSelected] = useState([true, true, true]);
  const [filter, setFilter] = useState<TableFilter>('all');
  const [ordered, setOrdered] = useState(false);
  const [result, setResult] = useState({ fields: selected, rows: readTable('all', false), sql: 'SELECT book_id, title, available FROM books;' });
  const [queried, setQueried] = useState(false);
  const run = () => {
    const names = ['book_id', 'title', 'available'].filter((_, i) => selected[i]);
    setResult({ fields: [...selected], rows: readTable(filter, ordered), sql: `SELECT ${names.join(', ')}\nFROM books${filter === 'available' ? '\nWHERE available = true' : filter === 'missing' ? '\nWHERE book_id = 65' : ''}${ordered ? '\nORDER BY book_id' : ''};` });
    setQueried(true);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="表的行列查询演示">
    <div className={s.source}><h3>原始书目</h3><table><thead><tr>{fields.map(field => <th key={field} scope="col">{field}</th>)}</tr></thead><tbody>{tableBooks.map(book => <tr key={book.id}><td>{book.id}</td><td>{book.title}</td><td>{book.available ? "可借" : "已借出"}</td></tr>)}</tbody></table></div>
    <div className={s.queryControls}><fieldset><legend>返回哪些列</legend>{fields.map((field,i) => <label key={field} className={base.option}><input type="checkbox" checked={selected[i]} onChange={e => { setSelected(selected.map((value,j) => j === i ? e.target.checked : value)); setQueried(false); }} />{field}</label>)}</fieldset><div><label className={s.selectLabel}>返回哪些行<select value={filter} onChange={e => { setFilter(e.target.value as TableFilter); setQueried(false); }}><option value="all">全部书目</option><option value="available">仅可借</option><option value="missing">编号 #65（不存在）</option></select></label><label className={base.option}><input type="checkbox" checked={ordered} onChange={e => { setOrdered(e.target.checked); setQueried(false); }} />按编号升序</label></div></div>
    <div className={s.actions}><button disabled={!selected.some(Boolean)} onClick={run}><MagnifyingGlass size={18} />查询</button><button onClick={() => { setSelected([true,true,true]); setFilter('all'); setOrdered(false); setQueried(false); }}><ArrowCounterClockwise size={18} />重置查询</button></div>
    <Reveal open={!selected.some(Boolean)}><p>至少选一列，再执行查询。</p></Reveal>
    <Reveal open={queried}><div className={s.tableOutput} role="status"><pre>{result.sql}</pre><h3>查询结果 · {result.rows.length} 行</h3><div className={s.resultHead} style={{ gridTemplateColumns: `${result.fields[0] ? '48px' : '0px'} ${result.fields[1] ? '1fr' : '0fr'} ${result.fields[2] ? '80px' : '0px'}` }}>{fields.map((field,i) => <span key={field} data-visible={result.fields[i]} aria-hidden={!result.fields[i]}>{field}</span>)}</div>
      <div className={s.resultRows} style={{ height: result.rows.length * 54 }}>{[...result.rows, ...tableBooks.filter(book => !result.rows.some(row => row.id === book.id))].map(book => { const position = result.rows.findIndex(row => row.id === book.id); return <div key={book.id} className={s.resultRow} data-visible={position >= 0} aria-hidden={position < 0} style={{ transform: `translateY(${Math.max(position,0) * 54}px)`, gridTemplateColumns: `${result.fields[0] ? '48px' : '0px'} ${result.fields[1] ? '1fr' : '0fr'} ${result.fields[2] ? '80px' : '0px'}` }}><span data-visible={result.fields[0]} aria-hidden={!result.fields[0]}>{book.id}</span><span data-visible={result.fields[1]} aria-hidden={!result.fields[1]}>{book.title}</span><span data-visible={result.fields[2]} aria-hidden={!result.fields[2]}>{book.available ? "可借" : "已借出"}</span></div>; })}</div>
      <Reveal open={!result.rows.length}><p>没有符合条件的记录。</p></Reveal>
    </div></Reveal>
  </div>;
}

export function PrimaryKeyLesson() {
  const [rows, setRows] = useState(keyBooks);
  const [candidate, setCandidate] = useState('42');
  const [feedback, setFeedback] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const renamed = rows[0].title !== keyBooks[0].title;
  const insert = () => { const response = insertKeyBook(rows, candidate === 'null' ? null : Number(candidate)); setRows(response.rows); setFeedback(response.result === 'empty' ? 1 : response.result === 'duplicate' ? 2 : 3); setShowFeedback(true); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="主键身份与写入演示">
    <div className={s.identityDesk}><div className={s.newBook}><Plus size={27} /><h3>新增一册</h3><p>山间来信</p><label className={s.selectLabel}>提交的编号<select value={candidate} onChange={e => { setCandidate(e.target.value); setShowFeedback(false); }}><option value="42">#42（已有）</option><option value="null">NULL（未提供）</option><option value="65">#65（新编号）</option></select></label><button onClick={insert}>尝试写入<ArrowDown size={18} /></button></div>
      <div className={s.identityShelf}><h3>已有记录</h3>{[42,78,65].map(id => { const book = rows.find(row => row.id === id); return <Reveal key={id} open={!!book}><div className={s.identityBook}><Key size={22} /><code>#{id}</code><States index={id === 42 && renamed ? 1 : 0}>{[<span key="initial">山间来信</span>,<span key="renamed">山间来信 · 修订版</span>]}</States></div></Reveal>; })}</div>
    </div>
    <Reveal open={showFeedback}><div className={s.feedback} role="status"><States index={feedback}>{[<p key="idle">等待写入</p>,<p key="empty"><X size={20} />拒绝：主键不可为空，未新增记录。</p>,<p key="duplicate"><X size={20} />拒绝：编号已经存在，未新增记录。</p>,<p key="accepted"><Check size={20} />已新增 #65，相同书名可以保留。</p>]}</States></div></Reveal>
    <div className={s.actions}><button disabled={renamed} onClick={() => setRows(renameKeyBook(rows))}>给 #42 改名</button><button onClick={() => { setRows(keyBooks); setCandidate('42'); setShowFeedback(false); }}><ArrowCounterClockwise size={18} />重置主键演示</button></div>
  </div>;
}

export function ForeignKeyLesson() {
  const [state, setState] = useState(initialRelation);
  const [cascade, setCascade] = useState(false);
  const [candidate, setCandidate] = useState(65);
  const [feedback, setFeedback] = useState(0);
  const [shown, setShown] = useState(false);
  const reset = () => { setState(initialRelation()); setShown(false); };
  const applyLoan = () => { const response = addLoan(state, candidate); setState(response.state); setFeedback(response.result === 'missing' ? candidate === 65 ? 1 : 7 : response.result === 'added' ? 2 : 3); setShown(true); };
  const applyDelete = () => { const response = deleteReferencedBook(state,cascade); setState(response.state); setFeedback(response.result === 'restricted' ? 4 : response.result === 'deleted' ? 5 : 6); setShown(true); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="外键引用与删除演示">
    <label className={s.policyLabel}>删除策略<select value={cascade ? 'cascade' : 'restrict'} onChange={e => { setCascade(e.target.value === 'cascade'); reset(); }}><option value="restrict">RESTRICT · 阻止被引用的删除</option><option value="cascade">CASCADE · 一并删除引用行</option></select></label>
    <div className={s.relationDesk}><div className={s.parents}><h3>书目 · books</h3>{[42,78].map(id => <Reveal key={id} open={state.books.includes(id)}><div className={s.parentBook}><BookOpen size={27} /><code>#{id}</code><strong>{id === 42 ? "山间来信" : "夜空地图"}</strong></div></Reveal>)}</div>
      <div className={s.references} aria-hidden="true"><svg viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M 0 42 C 60 42 40 42 100 42" data-visible={state.loans.some(loan => loan.id === 1)} /><path d="M 0 42 C 60 42 40 130 100 130" data-visible={state.loans.some(loan => loan.id === 2)} /></svg></div>
      <div className={s.children}><h3>借阅 · loans</h3>{[1,2].map(id => <Reveal key={id} open={state.loans.some(loan => loan.id === id)}><div className={s.loan}><span>借阅 {id} · {id === 1 ? "林舟" : "陈禾"}</span><code>book_id = 42</code></div></Reveal>)}</div>
    </div>
    <div className={s.relationActions}><div><label className={s.selectLabel}>新借阅引用<select value={candidate} onChange={e => { setCandidate(Number(e.target.value)); setShown(false); }}><option value="65">#65（不存在）</option><option value="42">#42</option></select></label><button disabled={state.loans.some(loan => loan.id === 2)} onClick={applyLoan}><Plus size={18} />写入借阅</button></div><button disabled={!state.books.includes(42)} onClick={applyDelete}><Trash size={18} />删除书目 #42</button></div>
    <Reveal open={shown}><div className={s.feedback} role="status"><States index={feedback}>{[<p key="idle">等待操作</p>,<p key="missing"><X size={20} />拒绝：书目中没有 #65，未新增借阅。</p>,<p key="added"><Check size={20} />#42 存在，新增借阅 2。</p>,<p key="already">样例的新增借阅已经写入。</p>,<p key="restricted"><X size={20} />拒绝删除：#42 仍被借阅引用，数据保留。</p>,<p key="deleted"><Check size={20} />已删除 #42 和引用它的借阅，#78 保留。</p>,<p key="gone">#42 已不存在，未发生新删除。</p>,<p key="missing42"><X size={20} />拒绝：书目中没有 #42，未新增借阅。</p>]}</States></div></Reveal>
    <button className={base.reset} onClick={() => { setCascade(false); setCandidate(65); reset(); }}><ArrowCounterClockwise size={18} />重置外键演示</button>
  </div>;
}
