"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowDown, BookmarkSimple, BookOpen, Check, EnvelopeOpen, Hourglass, Image as ImageIcon, Receipt, X } from "@phosphor-icons/react";
import { Reveal, States } from "./ExtendedConceptLessons";
import base from "./EventConcepts.module.css";
import styles from "./AsyncConcepts.module.css";

const resources = [
  { label: "正常书目", file: "books.json" },
  { label: "找不到文件 · 404", file: "missing.json" },
  { label: "内容不是 JSON", file: "invalid.txt" },
  { label: "JSON 字段不符合约定", file: "wrong-shape.json" },
];

export function FetchLesson() {
  const [choice, setChoice] = useState(0);
  const [phase, setPhase] = useState<"idle" | "requesting" | "headers" | "reading" | "done" | "error">("idle");
  const [header, setHeader] = useState({ status: 0, ok: false, type: "" });
  const [books, setBooks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const request = useRef<{ id: number; controller?: AbortController; response?: Response }>({ id: 0 });
  useEffect(() => () => { request.current.id++; request.current.controller?.abort(); }, []);
  const reset = () => {
    request.current.id++;
    request.current.controller?.abort();
    request.current.response = undefined;
    setPhase("idle");
  };
  const getResponse = async () => {
    reset();
    const id = request.current.id;
    const controller = new AbortController();
    request.current.controller = controller;
    setPhase("requesting");
    try {
      const response = await fetch(`/concept-fixtures/fetch/${resources[choice].file}`, { signal: controller.signal, cache: "no-store" });
      if (id !== request.current.id) return;
      request.current.response = response;
      setHeader({ status: response.status, ok: response.ok, type: response.headers.get("content-type") ?? "未提供" });
      setPhase("headers");
    } catch (cause) {
      if (id !== request.current.id) return;
      setError(cause instanceof Error ? `未取得响应：${cause.message}` : "未取得响应");
      setPhase("error");
    }
  };
  const readBody = async () => {
    const response = request.current.response;
    if (!response || phase !== "headers") return;
    const id = request.current.id;
    setPhase("reading");
    try {
      if (!response.ok) throw new Error(`HTTP ${response.status}：已收到响应，停止读取书目。`);
      let data: unknown;
      try { data = await response.json(); }
      catch { throw new Error("JSON 解析失败：响应内容不符合 JSON 语法。"); }
      if (!data || typeof data !== "object" || !("books" in data) || !Array.isArray(data.books) || !data.books.every(book => typeof book === "string")) {
        throw new Error("数据结构不符：books 应是书名字符串组成的数组。");
      }
      if (id !== request.current.id) return;
      setBooks(data.books);
      setPhase("done");
    } catch (cause) {
      if (id !== request.current.id) return;
      setError(cause instanceof Error ? cause.message : "读取失败");
      setPhase("error");
    }
  };
  const hasResponse = phase !== "idle" && phase !== "requesting" && !!request.current.response;
  return <div className={`${base.lab} ${styles.fetchLab}`} aria-label="Fetch 响应拆封实验">
    <div className={styles.controls}><label>请求资源 <select value={choice} onChange={e => { reset(); setChoice(Number(e.target.value)); }}>{resources.map((item, i) => <option key={item.file} value={i}>{item.label}</option>)}</select></label><button onClick={getResponse} disabled={phase === "requesting" || phase === "reading"}>获取响应</button></div>
    <div className={styles.envelope} data-open={hasResponse}>
      <div className={styles.envelopeFlap} aria-hidden="true"><EnvelopeOpen size={32} weight="light" /></div>
      <div className={styles.responseHead} aria-live="polite"><States index={hasResponse ? 2 : phase === "requesting" ? 1 : 0}>{[
        <div key="idle"><span>GET</span><strong>{resources[choice].file}</strong><p>尚未请求</p></div>,
        <div key="wait"><Hourglass size={25} /><p>等待响应</p></div>,
        <div key="head"><strong className={styles.httpCode}>{header.status}</strong><code>ok: {String(header.ok)}</code><span>{header.type}</span></div>,
      ]}</States></div>
      <div className={styles.bodyTray}><States index={phase === "done" ? 2 : phase === "error" ? 3 : phase === "reading" ? 1 : 0}>{[
        <p key="closed">内容尚未读取</p>,<p key="reading">正在读取并解析…</p>,
        <div key="books" className={styles.books}>{books.map(book => <div key={book}><BookOpen size={23} /><strong>{book}</strong></div>)}</div>,
        <p key="error" className={styles.failure}>{error}</p>,
      ]}</States></div>
    </div>
    <div className={styles.controls}><button onClick={readBody} disabled={phase !== "headers"}><ArrowDown size={17} />检查状态并读取 JSON</button><button className={base.reset} onClick={reset}><ArrowCounterClockwise size={17} />重置请求</button></div>
    <span className="sr-only" role="status">{phase === "done" ? `已取得 ${books.length} 本书` : phase === "error" ? error : ""}</span>
  </div>;
}

type Settlement = { resolve: (value: string) => void; reject: (error: Error) => void };
export function PromiseLesson() {
  const [phase, setPhase] = useState<"idle" | "pending" | "fulfilled" | "rejected">("idle");
  const [log, setLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);
  const order = useRef<Settlement | null>(null);
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; order.current?.reject(new Error("离开演示")); }, []);
  const addLog = (line: string) => setLog(lines => [...lines, line].slice(-12));
  const start = () => {
    const id = ++generation.current;
    order.current?.reject(new Error("新订单取代旧订单"));
    setLog(["创建 Promise，登记两个处理函数"]);
    setPhase("pending");
    const promise = new Promise<string>((resolve, reject) => { order.current = { resolve, reject }; });
    promise.then(value => {
      if (id !== generation.current) return;
      setPhase("fulfilled"); addLog(`then 成功回调：${value}`);
    }, cause => {
      if (id !== generation.current) return;
      setPhase("rejected"); addLog(`then 拒绝回调：${cause.message}`);
    });
  };
  const settle = (success: boolean) => {
    if (!order.current) return;
    addLog(success ? '调用 resolve("A17")' : '调用 reject(Error("今日售罄"))');
    if (success) order.current.resolve("A17");
    else order.current.reject(new Error("今日售罄"));
    addLog("同步代码结束");
  };
  return <div className={`${base.lab} ${styles.promiseLab}`} aria-label="Promise 订单落定实验">
    <div className={styles.ticket} data-state={phase}>
      <Receipt size={29} weight="light" /><span>一份订单的结果</span>
      <div aria-live="polite"><States index={["idle", "pending", "fulfilled", "rejected"].indexOf(phase)}>{[
        <div key="idle" className={styles.ticketResult}><strong>—</strong><span>尚未下单</span></div>,
        <div key="pending" className={styles.ticketResult}><strong>···</strong><span>pending · 等待结果</span></div>,
        <div key="fulfilled" className={styles.ticketResult}><strong>A17</strong><span>fulfilled · 取餐号</span></div>,
        <div key="rejected" className={styles.ticketResult}><X size={50} weight="light" /><strong className={styles.soldOut}>今日售罄</strong><span>rejected · 拒绝原因</span></div>,
      ]}</States></div>
      <div className={styles.stamp} data-visible={phase === "fulfilled" || phase === "rejected"} aria-hidden="true">已落定</div>
    </div>
    <div className={styles.orderActions}><button onClick={start}><Receipt size={18} />新建一单</button><button disabled={phase === "idle"} onClick={() => settle(true)}>交付取餐号 <Check size={18} /></button><button disabled={phase === "idle"} onClick={() => settle(false)}>报告售罄 <X size={18} /></button></div>
    <button className={base.reset} aria-expanded={showLog} aria-controls="promise-log" onClick={() => setShowLog(!showLog)}>实际执行记录 <ArrowDown size={16} className={styles.disclosure} data-open={showLog} /></button>
    <div id="promise-log"><Reveal open={showLog}><ol className={styles.executionLog}>{log.map((line, i) => <li key={`${i}-${line}`}>{line}</li>)}</ol></Reveal></div>
  </div>;
}

type ResourceName = "title" | "cover";
type ResourceState = "idle" | "pending" | "done" | "failed";
const resourceLabels = { title: "文章标题", cover: "封面" };
export function AwaitLesson() {
  const [parallel, setParallel] = useState(false);
  const [phase, setPhase] = useState<"idle" | "waiting" | "done" | "failed">("idle");
  const [states, setStates] = useState<Record<ResourceName, ResourceState>>({ title: "idle", cover: "idle" });
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");
  const pending = useRef<Partial<Record<ResourceName, Settlement>>>({});
  const generation = useRef(0);
  const cancel = () => { generation.current++; Object.values(pending.current).forEach(item => item.reject(new Error("取消"))); pending.current = {}; };
  useEffect(() => () => { generation.current++; Object.values(pending.current).forEach(item => item.reject(new Error("离开演示"))); }, []);
  const reset = () => { cancel(); setPhase("idle"); setStates({ title: "idle", cover: "idle" }); };
  const start = async () => {
    reset();
    const id = generation.current;
    setPhase("waiting");
    const load = (name: ResourceName) => {
      setStates(current => ({ ...current, [name]: "pending" }));
      return new Promise<string>((resolve, reject) => { pending.current[name] = { resolve, reject }; }).then(value => {
        if (id === generation.current) {
          if (name === "title") setTitle(value);
          setStates(current => ({ ...current, [name]: "done" }));
          delete pending.current[name];
        }
        return value;
      }, cause => {
        if (id === generation.current) { setStates(current => ({ ...current, [name]: "failed" })); delete pending.current[name]; }
        throw cause;
      });
    };
    try {
      if (parallel) await Promise.all([load("title"), load("cover")]);
      else {
        await load("title");
        if (id !== generation.current) return;
        await load("cover");
      }
      if (id === generation.current) setPhase("done");
    } catch { if (id === generation.current) setPhase("failed"); }
  };
  return <div className={`${base.lab} ${styles.awaitLab}`} aria-label="异步等待与任务装配实验">
    <div className={styles.controls}><div className={styles.mode} role="group" aria-label="任务发起方式"><button aria-pressed={!parallel} onClick={() => { reset(); setParallel(false); }}>依次发起</button><button aria-pressed={parallel} onClick={() => { reset(); setParallel(true); }}>一起发起</button></div><button aria-pressed={saved} onClick={() => setSaved(!saved)}><BookmarkSimple size={18} weight={saved ? "fill" : "regular"} />{saved ? "已收藏" : "收藏文章"}</button></div>
    <div className={styles.assembly}>
      <div className={styles.lanes}>{(["title", "cover"] as ResourceName[]).map(name => <div key={name} className={styles.lane} data-state={states[name]}>
        <div className={styles.laneHeading}>{name === "title" ? <BookOpen size={24} /> : <ImageIcon size={24} />}<h3>{resourceLabels[name]}</h3><span>{({ idle: "未发起", pending: "等待返回", done: "已取得", failed: "失败" })[states[name]]}</span></div>
        <div className={styles.packetTrack} aria-hidden="true"><div className={styles.packet}>{name === "title" ? <States index={states.title === "done" ? 1 : 0}>{[<span key="pending">等待标题</span>, <span key="value">{title}</span>]}</States> : <ImageIcon size={30} />}</div><Check size={18} /></div>
        <div className={styles.controls}><button disabled={states[name] !== "pending"} onClick={() => pending.current[name]?.resolve(name === "title" ? "小岛上的灯塔" : "cover")}>返回{name === "title" ? "标题" : "封面"}</button>{name === "cover" && <button disabled={states.cover !== "pending"} onClick={() => pending.current.cover?.reject(new Error("封面加载失败"))}>封面加载失败</button>}</div>
      </div>)}</div>
      <div className={styles.readingCard} data-ready={phase === "done"} aria-live="polite"><States index={phase === "done" ? 2 : phase === "failed" ? 3 : phase === "waiting" ? 1 : 0}>{[
        <div key="idle" className={styles.cardPlaceholder}><BookOpen size={35} weight="light" /><p>阅读卡片</p></div>,
        <div key="wait" className={styles.cardPlaceholder}><Hourglass size={35} weight="light" /><p>等待两份材料</p></div>,
        <div key="ready" className={styles.completedCard}><div className={styles.coverArt} aria-hidden="true"><i /><b /></div><h3>{title}</h3><p>标题与封面已就位</p></div>,
        <div key="error" className={styles.cardPlaceholder}><X size={35} /><p>封面加载失败<br />本次未能组装</p></div>,
      ]}</States></div>
    </div>
    <div className={styles.controls}><button onClick={start} disabled={phase !== "idle"}>开始加载</button><button className={base.reset} onClick={reset}><ArrowCounterClockwise size={17} />重置任务</button></div>
    <pre className={base.code}>{parallel ? 'const [title, cover] = await Promise.all([\n  loadTitle(),\n  loadCover(),\n]);\nshowArticle(title, cover);' : 'const title = await loadTitle();\nconst cover = await loadCover();\nshowArticle(title, cover);'}</pre>
  </div>;
}
