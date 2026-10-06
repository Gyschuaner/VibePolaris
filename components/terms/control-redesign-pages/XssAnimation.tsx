"use client";

import { useRef, useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./XssAnimation.module.css";

type Sink = "innerHTML" | "textContent";
type Result = "executed" | "literal" | "blocked";
type Run = { id: number; sink: Sink; trusted: boolean; result: Result | null };

function Payload({ className = "" }: { className?: string }) {
  return <code className={`${styles.payload} ${className}`}>&lt;img onerror&gt;</code>;
}

function BrowserFrame({ sink, result }: { sink: Sink; result?: Result }) {
  const executed = sink === "innerHTML" && result === "executed";
  const blocked = sink === "innerHTML" && result === "blocked";
  return <div className={styles.browserFrame} data-sink={sink} data-result={result ?? "idle"}>
    <div className={styles.frameBar}><span /><span /><span /></div>
    <div className={styles.frameBody}>
      {sink === "innerHTML" ? <div className={styles.nodeResult}><b>&lt;img&gt;</b><span className={styles.eventPin}>onerror</span><small>{executed ? "事件入口已出现" : blocked ? "危险 sink 被拦截" : "等待解析"}</small></div> : <div className={styles.textResult}><Payload /><small>{result === "literal" ? "字符仍是字符" : "等待写入"}</small></div>}
    </div>
  </div>;
}

export function XssHero() {
  return <ControlRedesignRuntime kind="xss" label="同一段不可信字符串进入两个浏览器写入接口：innerHTML 压成带事件入口的节点，textContent 保留为字面文字">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.heroPayload}><span>同一张纸条</span><Payload /></div>
      <div className={`${styles.heroChamber} ${styles.heroUnsafe}`}>
        <div className={styles.chamberHeader}><strong>innerHTML</strong><span>HTML 模具</span></div>
        <div className={styles.mold}><span className={styles.moldClamp}>解析</span><div className={styles.nodeResult}><b>&lt;img&gt;</b><span className={styles.eventPin}>onerror</span><small>节点 + 事件</small></div></div>
      </div>
      <div className={`${styles.heroChamber} ${styles.heroSafe}`}>
        <div className={styles.chamberHeader}><strong>textContent</strong><span>文字盒</span></div>
        <div className={styles.textSleeve}><Payload /><small>可见文字</small></div>
      </div>
    </div>
  </ControlRedesignRuntime>;
}

export function XssLesson() {
  const [sink, setSink] = useState<Sink>("innerHTML");
  const [trusted, setTrusted] = useState(false);
  const [run, setRun] = useState<Run | null>(null);
  const [history, setHistory] = useState<Run[]>([]);
  const sequence = useRef(0);
  const finishedRun = useRef<number | null>(null);
  const running = run !== null && run.result === null;

  function submit() {
    const id = ++sequence.current;
    finishedRun.current = null;
    setRun({ id, sink, trusted, result: null });
  }
  function finish(id: number) {
    if (!run || run.id !== id || run.result !== null || finishedRun.current === id) return;
    finishedRun.current = id;
    const result: Result = run.sink === "textContent" ? "literal" : run.trusted ? "blocked" : "executed";
    const finished = { ...run, result };
    setRun(finished);
    setHistory(entries => [...entries, finished]);
  }
  function reset() { sequence.current += 1; finishedRun.current = null; setRun(null); setHistory([]); setSink("innerHTML"); setTrusted(false); }
  const currentResult = run?.result;

  return <section className={styles.lesson} aria-label="字符串进入 DOM 的演示">
    <div className={styles.lessonHeader}><strong>把同一张纸条送进浏览器</strong><span>{trusted ? "Trusted Types 已开启" : "未加策略"}</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={sink === "innerHTML"} disabled={running} onClick={() => { setSink("innerHTML"); setRun(null); }}>用 innerHTML</button>
      <button type="button" aria-pressed={sink === "textContent"} disabled={running} onClick={() => { setSink("textContent"); setRun(null); }}>用 textContent</button>
      <label><input type="checkbox" checked={trusted} disabled={running} onChange={event => { setTrusted(event.target.checked); setRun(null); }} />启用 Trusted Types</label>
      <button type="button" className={styles.sendButton} disabled={running} onClick={submit}>写入 DOM</button>
      <button type="button" onClick={reset}>重置</button>
    </div>
    <div className={styles.lessonScene} data-sink={sink} data-result={currentResult ?? "idle"}>
      <div className={styles.lessonInput}><span>输入</span><Payload /></div>
      <div className={styles.lessonShelf}>
        <BrowserFrame sink={"innerHTML"} result={sink === "innerHTML" ? currentResult ?? undefined : undefined} />
        <BrowserFrame sink={"textContent"} result={sink === "textContent" ? currentResult ?? undefined : undefined} />
      </div>
      {run && !currentResult && <span className={styles.movingPayload} onAnimationEnd={() => finish(run.id)}><Payload /></span>}
    </div>
    <div className={styles.result} role="status" data-danger={currentResult === "executed"}>
      {running ? "浏览器正在处理这串字符……" : currentResult === "executed" ? "innerHTML 已创建节点，onerror 事件入口也随之存在。" : currentResult === "literal" ? "textContent 只写入文字；尖括号没有变成标签。" : currentResult === "blocked" ? "Trusted Types 在危险 sink 前拦截了这次写入，页面没有新增节点。" : "先选一个写入接口，再把纸条送进浏览器。"}
    </div>
    {history.length > 0 && <ol className={styles.audit} aria-label="最近写入记录">{history.map(entry => <li key={entry.id}><span>#{entry.id} · {entry.sink}</span><code>{entry.trusted ? "trusted" : "untrusted"}</code><strong data-danger={entry.result === "executed"}>{entry.result === "executed" ? "节点 + 事件" : entry.result === "literal" ? "纯文字" : "阻断"}</strong></li>)}</ol>}
  </section>;
}
