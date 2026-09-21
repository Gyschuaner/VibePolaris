"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, BookOpen, BracketsCurly, Check, User, Funnel, PaperPlaneTilt } from "@phosphor-icons/react";
import { States, Reveal } from "./ExtendedConceptLessons";
import { queryBooks, readBookQuery, matchReader, encodeBooking, receiveBooking, type BodyFormat } from "@/lib/request-input-teaching";
import base from "./EventConcepts.module.css";
import s from "./RequestInputs.module.css";

const querySamples = [
  ["科学", "tag=science"], ["科学或艺术", "tag=science&tag=art"],
  ["逗号写法", "tag=science,art"], ["空值", "tag="], ["全部", ""],
];

export function QueryParameterLesson() {
  const [raw, setRaw] = useState("tag=science");
  const [result, setResult] = useState<ReturnType<typeof readBookQuery> | null>(null);
  const [applied, setApplied] = useState(false);
  const edit = (value: string) => { setRaw(value); setApplied(false); };
  const apply = () => { setResult(readBookQuery(raw)); setApplied(true); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="查询参数筛选实验">
    <div className={s.choices} role="group" aria-label="查询示例">{querySamples.map(([label, value]) => <button key={label} aria-pressed={raw === value} onClick={() => edit(value)}>{label}</button>)}</div>
    <form className={s.queryInput} onSubmit={e => { e.preventDefault(); apply(); }}>
      <label><span>/books?</span><input aria-label="查询字符串" value={raw} maxLength={200} spellCheck={false} onChange={e => edit(e.target.value)} /></label>
      <button type="submit"><Funnel size={18} />应用查询</button>
    </form>
    <div className={s.queryEvidence} aria-live="polite"><States index={applied ? 1 : 0}>{[
      <p key="idle">{result ? "条件已改变，重新应用查询" : "选择条件，观察哪些书被选中"}</p>,
      <div key="parsed"><dl><div><dt>get("tag")</dt><dd>{JSON.stringify(result?.firstTag)}</dd></div><div><dt>getAll("tag")</dt><dd>{JSON.stringify(result?.tags)}</dd></div></dl><strong>命中 {result?.ids.length} 本</strong></div>,
    ]}</States></div>
    <div className={s.bookGrid}>{queryBooks.map(book => <div key={book.id} className={s.book} data-match={!applied ? "idle" : result?.ids.includes(book.id) ? "yes" : "no"}>
      <BookOpen size={28} weight="light" aria-hidden="true" /><strong>{book.title}</strong><span>{book.label}</span><Check className={s.chosen} size={18} aria-hidden="true" />
    </div>)}</div>
    <button className={base.reset} onClick={() => edit("tag=science")}><ArrowCounterClockwise size={17} />重置筛选</button>
  </div>;
}

export function QueryEncodingLesson() {
  const [value, setValue] = useState("星空 + 艺术 & 自然");
  const encoded = new URLSearchParams({ q: value }).toString();
  return <div className={`${base.lab} ${s.lab} ${s.encoding}`} aria-label="查询值编码实验">
    <label>原始搜索词<input value={value} maxLength={60} onChange={e => setValue(e.target.value)} /></label>
    <dl><div><dt>编码后的查询串</dt><dd><code>{encoded}</code></dd></div><div><dt>解析得到 q</dt><dd>{new URLSearchParams(encoded).get("q") || "（空字符串）"}</dd></div></dl>
  </div>;
}

export function PathParameterLesson() {
  const [path, setPath] = useState("/readers/42");
  const [staticFirst, setStaticFirst] = useState(true);
  const [allowOther, setAllowOther] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof matchReader> | null>(null);
  const [shown, setShown] = useState(false);
  const invalidate = () => setShown(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="路径匹配实验">
    <div className={s.choices} role="group" aria-label="路径示例">{["42", "me", "abc", "43", "99"].map(value => <button key={value} aria-pressed={path === `/readers/${value}`} onClick={() => { setPath(`/readers/${value}`); invalidate(); }}>{value}</button>)}</div>
    <form className={s.pathInput} onSubmit={e => { e.preventDefault(); setResult(matchReader(path, staticFirst, allowOther)); setShown(true); }}>
      <label>GET<input aria-label="请求路径" value={path} maxLength={150} spellCheck={false} onChange={e => { setPath(e.target.value); invalidate(); }} /></label><button type="submit">匹配路径<ArrowRight size={18} /></button>
    </form>
    <div className={s.routeStage}>
      <div className={s.routeList} aria-label={`路由检查顺序：${staticFirst ? "固定路径优先" : "动态路径优先"}`} data-static-first={staticFirst}>
        {["static", "dynamic"].map(kind => <div key={kind} className={s.route} data-kind={kind} data-active={shown && result?.route === kind}>
          <code>/readers/{kind === "static" ? "me" : <em>{"{id}"}</em>}</code><span>{kind === "static" ? "当前读者" : "按编号"}</span>
        </div>)}
        <button className={s.swap} onClick={() => { setStaticFirst(value => !value); invalidate(); }}>交换路由顺序</button>
      </div>
      <div className={s.readerDesk} aria-live="polite"><States index={!shown ? 0 : result?.reader ? 2 : 1}>{[
        <div key="idle" className={s.readerIdle}><BracketsCurly size={36} weight="light" /><p>等待路径匹配</p></div>,
        <div key="error"><strong className={s.status}>{result?.status}</strong><p>{result?.message}</p></div>,
        <div key="reader" className={s.reader}><User size={40} weight="light" /><strong>{result?.reader?.name}</strong><code>id: {result?.reader?.id} · 200 OK</code></div>,
      ]}</States></div>
    </div>
    <Reveal open={shown}><div className={s.capture}><span>{result?.route === "static" ? "固定路径" : result?.route === "dynamic" ? "捕获的 id" : "未捕获参数"}</span><code>{result?.value || "—"}</code></div></Reveal>
    <label className={base.option}><input type="checkbox" checked={allowOther} onChange={e => { setAllowOther(e.target.checked); invalidate(); }} />允许读取其他读者</label>
    <button className={base.reset} onClick={() => { setPath("/readers/42"); setStaticFirst(true); setAllowOther(false); invalidate(); }}><ArrowCounterClockwise size={17} />重置路由</button>
  </div>;
}

export function RequestBodyLesson() {
  const [title, setTitle] = useState("星空手记");
  const [seats, setSeats] = useState("2");
  const [format, setFormat] = useState<BodyFormat>("json");
  const [wrongType, setWrongType] = useState(false);
  const [broken, setBroken] = useState(false);
  const [wire, setWire] = useState({ text: "", type: "", bytes: 0 });
  const [encoded, setEncoded] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof receiveBooking> | null>(null);
  const [received, setReceived] = useState(false);
  const invalidate = () => { setEncoded(false); setReceived(false); };
  const encode = () => {
    const value = encodeBooking(title, seats, format);
    const text = broken && format === "json" ? value.text.slice(0, -1) : value.text;
    setWire({ text, type: wrongType ? "text/plain" : value.type, bytes: new TextEncoder().encode(text).length });
    setEncoded(true); setReceived(false);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="请求体编码与接收实验">
    <div className={s.bodyDesk}>
      <form className={s.bodyForm} onSubmit={e => { e.preventDefault(); encode(); }}>
        <h3>读书会报名</h3>
        <label>书名<input value={title} maxLength={60} onChange={e => { setTitle(e.target.value); invalidate(); }} /></label>
        <label>名额<input type="number" step="any" value={seats} onChange={e => { setSeats(e.target.value); invalidate(); }} /></label>
        <label>内容编码<select value={format} onChange={e => { setFormat(e.target.value as BodyFormat); setBroken(false); invalidate(); }}><option value="json">JSON</option><option value="form">URL 编码表单</option></select></label>
        <button type="submit">编码内容<ArrowRight size={18} /></button>
      </form>
      <div className={s.bodyWire} aria-live="polite"><code>POST /bookings</code><States index={encoded ? 1 : 0}>{[
        <div key="idle" className={s.wireIdle}><PaperPlaneTilt size={38} weight="light" /><p>等待内容编码</p></div>,
        <div key="wire"><span>Content-Type</span><code>{wire.type}</code><pre>{wire.text}</pre><span>{wire.bytes} 字节 · UTF-8</span></div>,
      ]}</States></div>
    </div>
    <div className={s.faults}><label className={base.option}><input type="checkbox" checked={wrongType} onChange={e => { setWrongType(e.target.checked); invalidate(); }} />把类型错标为 text/plain</label><Reveal open={format === "json"}><label className={base.option}><input type="checkbox" checked={broken} onChange={e => { setBroken(e.target.checked); invalidate(); }} />去掉 JSON 末尾花括号</label></Reveal></div>
    <button disabled={!encoded} onClick={() => { setResult(receiveBooking(wire.text, wire.type)); setReceived(true); }}>交给接收端<ArrowRight size={18} /></button>
    <Reveal open={received}><div className={s.bodyReceipt} aria-live="polite"><strong className={s.status}>{result?.status}</strong><div><h3>{result?.message}</h3>{result?.booking && <p>{result.booking.title} · {result.booking.seats} 个名额</p>}</div></div></Reveal>
    <button className={base.reset} onClick={() => { setTitle("星空手记"); setSeats("2"); setFormat("json"); setWrongType(false); setBroken(false); invalidate(); }}><ArrowCounterClockwise size={17} />重置内容</button>
  </div>;
}
