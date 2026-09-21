"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowRight, BookOpen, Check, FileText, PaperPlaneTilt, Plus, WarningCircle } from "@phosphor-icons/react";
import { applyNoteMethod, exportStatus, negotiateBook, type Note, type NoteMethod } from "@/lib/http-teaching";
import { Reveal, States } from "./ExtendedConceptLessons";
import base from "./EventConcepts.module.css";
import s from "./HttpConcepts.module.css";

export function RequestLesson() {
  const [method, setMethod] = useState("GET");
  const [name, setName] = useState("海边的书店");
  const [body, setBody] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "ready" | "error">("idle");
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; }, []);
  const clear = () => { generation.current++; setPhase("idle"); };
  const build = async () => {
    const id = ++generation.current;
    try {
      const url = new URL("https://example.com/books");
      if (method === "GET") url.searchParams.set("q", name);
      const request = new Request(url, { method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify({ title: name }) : undefined });
      const text = await request.text();
      if (id !== generation.current) return;
      setResult([request.method, request.url, request.headers.get("content-type") ?? "未设置", text || "无请求体"]);
      setPhase("ready");
    } catch (cause) {
      if (id !== generation.current) return;
      setError(cause instanceof Error ? `${cause.name}: ${cause.message}` : "无法构造请求");
      setPhase("error");
    }
  };
  return <div className={`${base.lab} ${s.requestLab}`} aria-label="请求组装实验">
    <div className={s.requestForm}>
      <label>方法<select value={method} onChange={e => { clear(); setMethod(e.target.value); setBody(e.target.value === "POST"); }}><option>GET</option><option>POST</option></select></label>
      <label>书名<input value={name} maxLength={60} onChange={e => { clear(); setName(e.target.value); }} /></label>
      <label className={base.option}><input type="checkbox" checked={body} onChange={e => { clear(); setBody(e.target.checked); }} />附加 JSON 请求体</label>
      <button onClick={build}><Plus size={18} />构造 Request</button>
      <button className={base.reset} onClick={() => { clear(); setMethod("GET"); setName("海边的书店"); setBody(false); }}><ArrowCounterClockwise size={17} />重置</button>
    </div>
    <div className={s.requestSheet} aria-live="polite"><States index={phase === "ready" ? 1 : phase === "error" ? 2 : 0}>{[
      <div key="empty" className={s.blank}><PaperPlaneTilt size={42} weight="light" /><span>组合方法、地址和内容</span></div>,
      <dl key="request" className={s.parts}>{["method", "url", "content-type", "body"].map((label, i) => <div key={label}><dt>{label}</dt><dd><code>{result[i]}</code></dd></div>)}</dl>,
      <div key="error" className={s.blank}><WarningCircle size={38} weight="light" /><strong>未能构造请求</strong><code>{error}</code></div>,
    ]}</States></div>
  </div>;
}

const responseExamples = [
  { status: 201, name: "创建书签", reason: "Created", body: '{"id":42,"title":"海边的书店"}', headers: { "Content-Type": "application/json", Location: "/bookmarks/42" } as Record<string, string> },
  { status: 204, name: "移除书签", reason: "No Content", body: null, headers: {} as Record<string, string> },
  { status: 422, name: "缺少书名", reason: "Unprocessable Content", body: '{"error":"请填写书名"}', headers: { "Content-Type": "application/json" } as Record<string, string> },
];
export function ResponseLesson() {
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState(0);
  const [message, setMessage] = useState("");
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; }, []);
  const example = responseExamples[selected];
  const reset = () => { generation.current++; setView(0); };
  const apply = async () => {
    const id = ++generation.current;
    const response = new Response(example.body, { status: example.status, headers: example.headers });
    if (response.status === 204) { setView(2); return; }
    try {
      const data = await response.json();
      if (id !== generation.current) return;
      setMessage(response.ok ? data.title : data.error);
      setView(response.ok ? 1 : 3);
    } catch { if (id === generation.current) { setMessage("内容无法解析"); setView(3); } }
  };
  return <div className={base.lab} aria-label="响应与界面实验">
    <div className={s.choices}>{responseExamples.map((item, i) => <button key={item.status} aria-pressed={selected === i} onClick={() => { reset(); setSelected(i); }}>{item.name}</button>)}</div>
    <div className={s.responseDesk}>
      <div className={s.receipt}><States index={selected}>{responseExamples.map(item => <div key={item.status}><div className={s.statusLine}><strong>{item.status}</strong><span>{item.reason}</span></div><pre>{Object.entries(item.headers).map(([key, value]) => `${key}: ${value}`).join("\n") || "—"}</pre><pre>{item.body ?? "无响应体"}</pre></div>)}</States></div>
      <div className={s.application}><span className={s.browserDots} aria-hidden="true">● ● ●</span><div aria-live="polite"><States index={view}>{[
        <div className={s.blank} key="draft"><BookOpen size={35} weight="light" /><span>页面尚未处理这份响应</span></div>,
        <div className={s.bookmark} key="created"><BookOpen size={34} /><strong>{message}</strong><code>/bookmarks/42</code><span>已加入书签</span></div>,
        <div className={s.blank} key="deleted"><Check size={36} /><strong>书签已移除</strong></div>,
        <div className={s.blank} key="invalid"><WarningCircle size={36} /><strong>{message}</strong><span>书签未创建</span></div>,
      ]}</States></div></div>
    </div>
    <div className={s.controls}><button onClick={apply}>应用到页面<ArrowRight size={18} /></button><button className={base.reset} onClick={reset}><ArrowCounterClockwise size={17} />重置界面</button></div>
  </div>;
}

export function MethodLesson() {
  const [method, setMethod] = useState<NoteMethod>("PUT");
  const [notes, setNotes] = useState<Note[]>([{ id: 42, title: "草稿" }]);
  const [nextId, setNextId] = useState(43);
  const [result, setResult] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [runs, setRuns] = useState(0);
  const run = () => {
    const outcome = applyNoteMethod(notes, nextId, method);
    setNotes(outcome.notes); setNextId(outcome.nextId); setRuns(runs + 1);
    setResult(`${outcome.status}\n${outcome.body === null ? "无响应体" : JSON.stringify(outcome.body)}`); setHasResult(true);
  };
  return <div className={base.lab} aria-label="HTTP 方法资源实验">
    <div className={s.choices}>{(["GET", "PUT", "POST", "DELETE"] as const).map(item => <button key={item} aria-pressed={method === item} onClick={() => { setMethod(item); setRuns(0); setHasResult(false); }}>{item}</button>)}</div>
    <div className={s.methodCommand}><code>{method} {method === "POST" ? "/notes" : "/notes/42"}{["POST", "PUT"].includes(method) ? '\n{"title":"已校对"}' : ""}</code><button onClick={run} disabled={method === "POST" && nextId > 48}>执行同一条请求<ArrowRight size={17} /></button></div>
    <div className={s.shelfTitle}><span>资源集合</span><output>{notes.length} 条</output></div>
    <div className={s.shelf}>{Array.from({ length: 7 }, (_, i) => i + 42).map(id => {
      const note = notes.find(item => item.id === id);
      return <div className={s.noteSlot} key={id} data-present={Boolean(note)} aria-hidden={!note}><div className={s.note}><FileText size={26} weight="light" /><code>/{id}</code><strong>{note?.title ?? "已校对"}</strong></div></div>;
    })}<span className={s.emptyShelf} data-visible={!notes.length} aria-hidden={notes.length > 0}>资源已移除</span></div>
    <div className={s.methodResult} aria-live="polite"><States index={hasResult ? 1 : 0}>{[<p key="waiting">等待执行</p>,<div key="result"><span>当前方法执行 {runs} 次</span><pre>{result}</pre></div>]}</States></div>
    <button className={base.reset} onClick={() => { setNotes([{ id: 42, title: "草稿" }]); setNextId(43); setRuns(0); setHasResult(false); }}><ArrowCounterClockwise size={17} />恢复初始资源</button>
  </div>;
}

export function StatusLesson() {
  const [count, setCount] = useState("2");
  const [available, setAvailable] = useState(true);
  const [status, setStatus] = useState<0 | 202 | 422 | 503>(0);
  const [finished, setFinished] = useState(false);
  const [query, setQuery] = useState<"none" | "pending" | "done">("none");
  const reset = () => { setStatus(0); setFinished(false); setQuery("none"); };
  const submit = () => { reset(); setStatus(exportStatus(Number(count), available)); };
  return <div className={base.lab} aria-label="状态码与导出任务实验">
    <div className={s.exportInput}><label>导出数量<input type="number" value={count} onChange={e => { reset(); setCount(e.target.value); }} /></label><label className={base.option}><input type="checkbox" checked={available} onChange={e => { reset(); setAvailable(e.target.checked); }} />服务可用</label><button onClick={submit}><PaperPlaneTilt size={18} />提交导出</button></div>
    <div className={s.verdict} aria-live="polite"><code>POST /exports · 提交响应</code><States index={[0, 202, 422, 503].indexOf(status)}>{[
      <div key="idle"><strong>—</strong><p>等待请求</p></div>,
      <div key="accepted"><strong>202</strong><p>已接受 · 仅确认任务受理</p><code>{'{"task":"/exports/7"}'}</code></div>,
      <div key="invalid"><strong>422</strong><p>数量需要是 1 到 5 的整数</p><code>请修改输入后再提交</code></div>,
      <div key="unavailable"><strong>503</strong><p>服务暂时不可用</p><code>Retry-After: 60</code></div>,
    ]}</States></div>
    <Reveal open={status === 202}><div className={s.taskDesk}>
      <div><h3>模拟后台任务</h3><button disabled={finished} onClick={() => setFinished(true)}>{finished ? "后台已生成文件" : "让后台完成生成"}<Check size={17} /></button></div>
      <div><h3>客户端重新查询</h3><button onClick={() => setQuery(finished ? "done" : "pending")}>GET /exports/7<ArrowRight size={17} /></button></div>
    </div><div className={s.queryResult} aria-live="polite"><States index={["none", "pending", "done"].indexOf(query)}>{[
      <p key="none">还没有查询任务结果</p>,
      <div key="pending"><code>{'200 OK · {"state":"pending"}'}</code><p>查询成功，导出仍未完成</p></div>,
      <div key="done"><code>{'200 OK · {"state":"done"}'}</code><p>文件已就绪</p><a href={'data:text/csv;charset=utf-8,' + encodeURIComponent('title\n海边的书店\n')} download="书目示例.csv">下载示例文件<ArrowRight size={16} /></a></div>,
    ]}</States></div></Reveal>
    <button className={base.reset} onClick={() => { reset(); setCount("2"); setAvailable(true); }}><ArrowCounterClockwise size={17} />重置实验</button>
  </div>;
}

export function HeaderLesson() {
  const [accept, setAccept] = useState("application/json");
  const [result, setResult] = useState<ReturnType<typeof negotiateBook> | null>(null);
  const [shown, setShown] = useState(false);
  const negotiate = () => { const headers = new Headers({ Accept: accept }); setResult(negotiateBook(headers.get("accept")!)); setShown(true); };
  return <div className={base.lab} aria-label="请求头内容协商实验">
    <div className={s.negotiationInput}><code>GET /books/42</code><label>Accept<select value={accept} onChange={e => { setShown(false); setAccept(e.target.value); }}><option value="application/json">application/json</option><option value="text/plain">text/plain</option><option value="application/xml">application/xml</option></select></label><button onClick={negotiate}>协商格式<ArrowRight size={17} /></button></div>
    <div className={s.formats}>{["application/json", "text/plain"].map((type, i) => <div key={type} data-picked={shown && result?.status === 200 && accept === type}><span>{i ? "TXT" : "JSON"}</span><code>{type}</code><pre>{i ? "海边的书店" : '{"title":"海边的书店"}'}</pre></div>)}</div>
    <div className={s.negotiationResult} aria-live="polite"><States index={!shown ? 0 : result?.status === 406 ? 2 : 1}>{[
      <p key="idle">服务器提供两种表示</p>,
      <div key="success"><strong>200 OK</strong><code>Content-Type: {result?.type}</code><code>Vary: Accept</code><pre>{result?.body}</pre></div>,
      <div key="failure"><strong>406 Not Acceptable</strong><p>本例没有 XML 表示</p></div>,
    ]}</States></div>
    <button className={base.reset} onClick={() => { setShown(false); setAccept("application/json"); }}><ArrowCounterClockwise size={17} />重置协商</button>
  </div>;
}
