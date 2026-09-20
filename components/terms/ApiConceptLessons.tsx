"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, BookBookmark, Check, Clock, Database, PaperPlaneTilt } from "@phosphor-icons/react";
import { States, Reveal } from "./ExtendedConceptLessons";
import { bookContract, matchOperation, operations, reservationRepresentation, applyReservation, initialEntries, readPages, spendTokens, refillTokens, type ReservationStatus, type ReservationAction } from "@/lib/api-teaching";
import base from "./EventConcepts.module.css";
import s from "./ApiConcepts.module.css";

export function ApiContractLesson() {
  const [storage, setStorage] = useState<"A" | "B">("A");
  const [mapping, setMapping] = useState(true);
  const [result, setResult] = useState(bookContract("A", true));
  const [shown, setShown] = useState(false);
  const current = bookContract(storage, mapping);
  return <div className={`${base.lab} ${s.lab}`} aria-label="接口契约实验">
    <div className={s.choices} role="group" aria-label="内部存储结构">{(["A", "B"] as const).map(value => <button key={value} aria-pressed={storage === value} onClick={() => { setStorage(value); setShown(false); }}>内部结构 {value}</button>)}</div>
    <div className={s.contractDesk}>
      <div><h3><Database size={21} />服务内部</h3><States index={storage === "A" ? 0 : 1}>{["A", "B"].map(value => <pre key={value}>{JSON.stringify(bookContract(value as "A" | "B", true).internal, null, 2)}</pre>)}</States></div>
      <div className={s.contractBoundary}><label className={base.option}><input type="checkbox" checked={mapping} onChange={e => { setMapping(e.target.checked); setShown(false); }} />按约定映射</label><ArrowRight size={26} aria-hidden="true" /><code>id · title</code></div>
      <div><h3>外部数据</h3><pre>{JSON.stringify(current.output, null, 2)}</pre></div>
    </div>
    <button onClick={() => { setResult(current); setShown(true); }}>交给调用方<ArrowRight size={18} /></button>
    <div className={s.bookReceiver} aria-live="polite"><States index={!shown ? 0 : result.valid ? 1 : 2}>{[
      <p key="idle">调用方需要整数 id 和非空字符串 title。</p>,
      <div key="book" className={s.bookmark}><BookBookmark size={36} weight="light" /><div><strong>{result.valid ? String(result.output.title) : "星空手记"}</strong><span>图书 #{result.valid ? String(result.output.id) : "42"}</span></div><Check size={22} /></div>,
      <div key="error" className={s.failure}><strong>无法生成书签</strong><p>收到合法 JSON，但缺少约定的 id、title 字段。</p></div>,
    ]}</States></div>
    <button className={base.reset} onClick={() => { setStorage("A"); setMapping(true); setShown(false); }}><ArrowCounterClockwise size={17} />重置契约</button>
  </div>;
}

export function EndpointLesson() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/books");
  const [host, setHost] = useState("https://api.example.com");
  const [result, setResult] = useState(matchOperation("GET", "/books"));
  const [shown, setShown] = useState(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="端点匹配实验">
    <label className={s.host}>服务基址<select value={host} onChange={e => { setHost(e.target.value); setShown(false); }}><option>https://api.example.com</option><option>https://test.example.com</option></select></label>
    <div className={s.matrix}>{["/books", "/books/42", "/authors"].map(location => <div key={location} className={s.pathColumn}><code>{location}</code>{["GET", "POST", "DELETE"].map(verb => <button key={verb} aria-label={`${verb} ${location}`} aria-pressed={path === location && method === verb} data-declared={operations.some(op => op.path === location && op.method === verb)} onClick={() => { setPath(location); setMethod(verb); setShown(false); }}><strong>{verb}</strong><span>{operations.find(op => op.path === location && op.method === verb)?.name ?? "未声明"}</span></button>)}</div>)}</div>
    <div className={s.address}><strong>{method}</strong><code>{host}{path}</code></div>
    <button onClick={() => { setResult(matchOperation(method, path)); setShown(true); }}>匹配入口<ArrowRight size={18} /></button>
    <div className={s.matchResult} aria-live="polite"><States index={!shown ? 0 : result.kind === "matched" ? 1 : result.kind === "method" ? 2 : 3}>{[
      <p key="idle">选择方法和路径，查看对应的处理入口。</p>,
      <div key="match"><span>入口已找到</span><strong>{result.name ?? "listBooks"}</strong><p>尚未执行该操作。</p></div>,
      <div key="method"><strong>该路径未声明此方法</strong><p>已声明：{result.allowed.join("、")}</p></div>,
      <div key="path"><strong>路径不存在</strong><p>这份路由表没有声明这个位置。</p></div>,
    ]}</States></div>
    <button className={base.reset} onClick={() => { setMethod("GET"); setPath("/books"); setHost("https://api.example.com"); setShown(false); }}><ArrowCounterClockwise size={17} />重置入口</button>
  </div>;
}

const statusLabels: Record<ReservationStatus, string> = { pending: "待确认", confirmed: "已确认", cancelled: "已取消", expired: "已过期" };
const statuses = Object.keys(statusLabels) as ReservationStatus[];
function ReservationState({ status }: { status: ReservationStatus }) {
  return <States index={statuses.indexOf(status)}>{statuses.map(value => <strong key={value} className={s.reservationState} data-status={value}>{statusLabels[value]}</strong>)}</States>;
}
export function RestLesson() {
  const [server, setServer] = useState<ReservationStatus>("pending");
  const [snapshot, setSnapshot] = useState(reservationRepresentation("pending"));
  const [loaded, setLoaded] = useState(false);
  const [receipt, setReceipt] = useState({ code: 200, request: "GET /reservations/42" });
  const read = () => { setSnapshot(reservationRepresentation(server)); setReceipt({ code: 200, request: "GET /reservations/42" }); setLoaded(true); };
  const act = (action: ReservationAction) => {
    const result = applyReservation(server, action);
    setServer(result.resource); setSnapshot(result.representation);
    setReceipt({ code: result.code, request: `${action.method} ${action.href}\n${JSON.stringify(action.body)}` });
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="资源与表示实验">
    <div className={s.reservationDesk}>
      <div className={s.resource}><span>服务端资源</span><code>/reservations/42</code><ReservationState status={server} /><button disabled={server !== "pending"} onClick={() => setServer("expired")}><Clock size={17} />使预约过期</button></div>
      <div className={s.representation}><h3>客户端收到的表示</h3><button onClick={read}>获取最新表示<ArrowRight size={17} /></button>
        <Reveal open={loaded}><div className={s.snapshot} aria-live="polite"><ReservationState status={snapshot.status} /><code>{receipt.code} · {receipt.code === 409 ? "旧动作已失效" : "返回最新表示"}</code><pre>{receipt.request}</pre></div></Reveal>
        <Reveal open={loaded && snapshot.actions.length > 0}><div className={s.choices} aria-label="表示提供的动作">{(["confirm", "cancel"] as const).map(rel => <button key={rel} disabled={!loaded || !snapshot.actions.some(action => action.rel === rel)} onClick={() => { const action = snapshot.actions.find(candidate => candidate.rel === rel); if (action) act(action); }}>{rel === "confirm" ? "确认预约" : "取消预约"}</button>)}</div></Reveal>
      </div>
    </div>
    <Reveal open={loaded}><details className={s.payload}><summary>查看收到的动作定义</summary><pre>{JSON.stringify(snapshot.actions, null, 2)}</pre></details></Reveal>
    <button className={base.reset} onClick={() => { setServer("pending"); setLoaded(false); }}><ArrowCounterClockwise size={17} />重置预约</button>
  </div>;
}

export function PaginationLesson() {
  const [entries, setEntries] = useState(initialEntries);
  const [page, setPage] = useState<ReturnType<typeof readPages> | null>(null);
  const [seenOffset, setSeenOffset] = useState<number[]>([]);
  const [seenCursor, setSeenCursor] = useState<number[]>([]);
  const next = () => {
    const result = readPages(entries, page?.offset ?? 0, page?.after ?? null);
    setSeenOffset(values => [...values, ...result.offsetPage]); setSeenCursor(values => [...values, ...result.cursorPage]); setPage(result);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="两种分页实验">
    <div className={s.paginationActions}><button onClick={next} disabled={page !== null && !page.offsetMore && !page.cursorMore}>{page ? "读取下一批" : "读取第一批"}<ArrowRight size={18} /></button><button disabled={!page || entries[0] === 10} onClick={() => setEntries([10, ...initialEntries])}>在队首插入 #10</button></div>
    <div className={s.collection} aria-label="服务端按编号倒序排列">{[10, ...initialEntries].map(id => <span key={id} data-present={entries.includes(id)} aria-hidden={!entries.includes(id)}>{id}</span>)}</div>
    <div className={s.readers}>{(["offset", "cursor"] as const).map(kind => {
      const selected = (kind === "offset" ? page?.offsetPage : page?.cursorPage) ?? [];
      const seen = kind === "offset" ? seenOffset : seenCursor;
      const more = kind === "offset" ? page?.offsetMore : page?.cursorMore;
      return <div key={kind} className={s.pageReader}><h3>{kind === "offset" ? "按位置跳过" : "从边界继续"}</h3><code>{kind === "offset" ? `下次 offset = ${page?.offset ?? 0}` : `下次 after = ${page?.after ?? "起点"}`}</code>
        <div className={s.pageWindow} aria-label={`${kind} 本批结果`}>{initialEntries.map(id => <span key={id} data-selected={selected.includes(id)} data-repeated={seen.filter(value => value === id).length > 1} aria-hidden={!selected.includes(id)}>{id}</span>)}</div>
        <p aria-live="polite">{page ? `${selected.length ? selected.join("、") : "没有更多记录"}${more === false ? " · 已到末尾" : ""}` : "每批读取 3 条"}</p>
        <Reveal open={seen.some((id, i) => seen.indexOf(id) !== i)}><p className={s.repeat}>记录重复：{Array.from(new Set(seen.filter((id, i) => seen.indexOf(id) !== i))).join("、")}</p></Reveal>
      </div>;
    })}</div>
    <button className={base.reset} onClick={() => { setEntries(initialEntries); setPage(null); setSeenOffset([]); setSeenCursor([]); }}><ArrowCounterClockwise size={17} />重置列表</button>
  </div>;
}

export function RateLimitLesson() {
  const [separate, setSeparate] = useState(false);
  const [buckets, setBuckets] = useState({ shared: 5, A: 5, B: 5 });
  const [time, setTime] = useState(0);
  const [receipt, setReceipt] = useState({ who: "A", allowed: 0, rejected: 0, time: 0 });
  const [shown, setShown] = useState(false);
  const reset = (split = separate) => { setSeparate(split); setBuckets({ shared: 5, A: 5, B: 5 }); setTime(0); setShown(false); };
  const send = (who: "A" | "B", count: number) => {
    const key = separate ? who : "shared";
    const result = spendTokens(buckets[key], count);
    setBuckets({ ...buckets, [key]: result.tokens }); setReceipt({ who, allowed: result.allowed, rejected: result.rejected, time }); setShown(true);
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="令牌桶实验">
    <div className={s.choices} role="group" aria-label="额度分配">{[false, true].map(split => <button key={String(split)} aria-pressed={separate === split} onClick={() => reset(split)}>{split ? "每位调用方独立" : "两位调用方共享"}</button>)}</div>
    <div className={s.bucketStage} data-separate={separate}>
      <div className={s.caller}><strong>A</strong><button onClick={() => send("A", 7)}><PaperPlaneTilt size={19} />A 发送 7 次</button></div>
      <div className={s.bucketRows}>{(["shared", "A", "B"] as const).map(key => <div key={key} className={s.bucketRow} data-visible={key === "shared" ? !separate : separate} inert={key === "shared" ? separate : !separate} aria-hidden={key === "shared" ? separate : !separate}><span>{key === "shared" ? "共享桶" : `${key} 的桶`}</span><div className={s.tokens}>{[0, 1, 2, 3, 4].map(index => <i key={index} data-full={index < buckets[key]} />)}</div><output>{buckets[key]} / 5</output></div>)}</div>
      <div className={s.caller}><strong>B</strong><button onClick={() => send("B", 1)}><PaperPlaneTilt size={19} />B 发送 1 次</button></div>
    </div>
    <div className={s.simClock}><span>模拟时间 <strong>{time}s</strong></span><button onClick={() => { setTime(value => value + 1); setBuckets(value => ({ shared: refillTokens(value.shared, 1), A: refillTokens(value.A, 1), B: refillTokens(value.B, 1) })); }}><Clock size={18} />推进 1 秒</button></div>
    <Reveal open={shown}><div className={s.rateReceipt} aria-live="polite"><span>{receipt.time}s · {receipt.who} 的这批请求</span><strong>放行 {receipt.allowed}</strong><strong>拒绝 {receipt.rejected}</strong><code>{receipt.rejected ? "429 · Retry-After: 1" : "已通过限流检查"}</code></div></Reveal>
    <button className={base.reset} onClick={() => reset()}><ArrowCounterClockwise size={17} />重置令牌桶</button>
  </div>;
}
