"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, BookmarkSimple, BookOpen, Coffee, Lightbulb, Minus, Plus, Power, Ticket } from "@phosphor-icons/react";
import { Reveal } from "./ExtendedConceptLessons";
import styles from "./EventConcepts.module.css";

export function EventLesson() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [connected, setConnected] = useState(true);
  const [lit, setLit] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const button = trigger.current!;
    const observe = () => setClicks(n => n + 1);
    button.addEventListener("click", observe);
    return () => button.removeEventListener("click", observe);
  }, []);
  useEffect(() => {
    const button = trigger.current!;
    if (!connected) return;
    const toggleLight = () => setLit(value => !value);
    button.addEventListener("click", toggleLight);
    return () => button.removeEventListener("click", toggleLight);
  }, [connected]);

  return <section className={`${styles.lab} ${styles.eventLab}`} aria-label="事件与监听器演示">
    <div className={styles.readingLight} data-lit={lit}>
      <div className={styles.lightCone} aria-hidden="true" />
      <Lightbulb className={styles.bulb} size={58} weight="light" aria-hidden="true" />
      <BookOpen className={styles.book} size={118} weight="light" aria-hidden="true" />
      <span className={styles.lampState} role="status">阅读灯{lit ? "亮着" : "关着"}</span>
      <button ref={trigger} type="button" className={styles.power} aria-label="按下灯的开关"><Power size={24} aria-hidden="true" /></button>
    </div>
    <div className={styles.listenerDesk}>
      <label className={styles.option}><input type="checkbox" checked={connected} onChange={e => setConnected(e.target.checked)} />连接开灯监听器</label>
      <pre className={styles.code}>{connected ? 'button.addEventListener(\n  "click", toggleLight\n);' : 'button.removeEventListener(\n  "click", toggleLight\n);'}</pre>
      <dl className={styles.eventReadout}><dt>click 事件</dt><dd><output>{clicks}</output> 次</dd><dt>target</dt><dd>button</dd></dl>
      <button className={styles.reset} onClick={() => { setConnected(true); setLit(false); setClicks(0); }}><ArrowCounterClockwise size={18} />重置阅读灯</button>
    </div>
  </section>;
}

type TraceEntry = { node: string; phase: string };
export function BubblingLesson() {
  const list = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [stop, setStop] = useState(false);
  const [capture, setCapture] = useState(false);
  const [saved, setSaved] = useState(false);
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [visible, setVisible] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const outer = list.current!, inner = card.current!, target = button.current!;
    let entries: TraceEntry[] = [];
    const subscriptions: (() => void)[] = [];
    const listen = (node: HTMLElement, listener: EventListener, capturing = false) => {
      node.addEventListener("click", listener, capturing);
      subscriptions.push(() => node.removeEventListener("click", listener, capturing));
    };
    listen(outer, e => {
      if (e.target !== target) return;
      entries = [];
      setRun(n => n + 1);
      setVisible(true);
    }, true);
    const record = (name: string, phase: string): EventListener => e => {
      if (e.target !== target) return;
      entries.push({ node: name, phase });
      setTrace([...entries]);
    };
    if (capture) {
      listen(outer, record("列表", "捕获"), true);
      listen(inner, record("卡片", "捕获"), true);
    }
    listen(target, e => {
      record("按钮", "目标")(e);
      setSaved(value => !value);
      if (stop) e.stopPropagation();
    });
    listen(inner, record("卡片", "冒泡"));
    listen(outer, record("列表", "冒泡"));
    return () => subscriptions.forEach(remove => remove());
  }, [capture, stop]);

  return <section className={styles.lab} aria-label="事件传播演示">
    <div className={styles.options}>
      <label className={styles.option}><input type="checkbox" checked={stop} onChange={e => { setStop(e.target.checked); setVisible(false); }} />在按钮处停止传播</label>
      <label className={styles.option}><input type="checkbox" checked={capture} onChange={e => { setCapture(e.target.checked); setVisible(false); }} />记录捕获阶段</label>
    </div>
    <div className={styles.bubbleLayout}>
      <div ref={list} className={styles.listNode}><span className={styles.nodeName}>列表 <code>div</code></span>
        {visible && trace.some(entry => entry.node === "列表") && <span key={run} className={styles.propagationPulse} aria-hidden="true" style={{ "--order": trace.findIndex(entry => entry.node === "列表") } as CSSProperties} />}
        <article ref={card} className={styles.cardNode}><span className={styles.nodeName}>卡片 <code>article</code></span><h3>周末阅读</h3><p>一篇还想再读的文章。</p>
          {visible && trace.some(entry => entry.node === "卡片") && <span key={run} className={styles.propagationPulse} aria-hidden="true" style={{ "--order": trace.findIndex(entry => entry.node === "卡片") } as CSSProperties} />}
          <button ref={button} type="button" className={styles.bookmark} aria-label="收藏这篇文章" aria-pressed={saved}><BookmarkSimple size={22} weight={saved ? "fill" : "regular"} aria-hidden="true" />{saved ? "已收藏" : "收藏"}</button>
        </article>
      </div>
      <div className={styles.traceDesk}><h3>本次经过</h3><p className={styles.traceHint} data-hidden={visible} aria-hidden={visible}>点击卡片里的收藏按钮。</p>
        <Reveal open={visible}><div className={styles.traceRecord} key={run}><code>target = button</code><ol aria-label="监听器执行顺序">{trace.map((entry, i) => <li key={i} style={{ "--order": i } as CSSProperties}><span>{entry.phase}</span><strong>{entry.node}</strong></li>)}</ol></div></Reveal>
      </div>
    </div>
    <button className={styles.reset} onClick={() => { setStop(false); setCapture(false); setSaved(false); setVisible(false); }}><ArrowCounterClockwise size={18} />重置传播演示</button>
  </section>;
}

function useCounter(initial: number, step: number) {
  const [count, setCount] = useState(initial);
  return {
    count,
    add: () => setCount(n => n + step),
    subtract: () => setCount(n => Math.max(0, n - step)),
    reset: () => setCount(initial),
  };
}

function Counter({ name, initial, step, kind }: { name: string; initial: number; step: number; kind: "coffee" | "ticket" }) {
  const { count, add, subtract, reset } = useCounter(initial, step);
  const Icon = kind === "coffee" ? Coffee : Ticket;
  return <section className={styles.counter} aria-label={`${name}计数器`}>
    <div className={styles.counterTitle}><Icon size={25} weight="light" /><h3>{name}</h3></div>
    <code>useCounter({initial}, {step})</code>
    <output className={styles.digits} aria-label={`${name}数量`}><span key={count}>{count}</span></output>
    <div className={styles.counterControls}><button onClick={subtract} disabled={count === 0} aria-label={`减少${name}`}><Minus size={20} /></button><button onClick={add} aria-label={`增加${name}`}><Plus size={20} /></button><button className={styles.counterReset} onClick={reset} aria-label={`重置${name}`}><ArrowCounterClockwise size={18} /></button></div>
  </section>;
}

export function HookLesson() {
  const [step, setStep] = useState(1);
  const [version, setVersion] = useState(0);
  return <section className={styles.lab} aria-label="自定义Hook独立状态演示">
    <div className={styles.hookDefinition}><code>useCounter(initial, step)</code><label>每次增减 <select value={step} onChange={e => setStep(Number(e.target.value))} aria-label="计数步长"><option value={1}>1</option><option value={2}>2</option><option value={5}>5</option></select></label></div>
    <div className={styles.counters} key={version}><Counter name="咖啡" initial={2} step={step} kind="coffee" /><Counter name="门票" initial={0} step={step} kind="ticket" /></div>
    <button className={styles.reset} onClick={() => { setStep(1); setVersion(n => n + 1); }}><ArrowCounterClockwise size={18} />重置两个计数器</button>
  </section>;
}
