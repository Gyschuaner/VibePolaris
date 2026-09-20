"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, Broadcast, CloudSun, MusicNote, Ruler } from "@phosphor-icons/react";
import { Reveal } from "./ExtendedConceptLessons";
import shared from "./EventConcepts.module.css";
import styles from "./BrowserConcepts.module.css";

type Channel = "音乐" | "天气";
type Log = { id: number; action: string; channel: Channel };

function SubscriptionDesk() {
  const [bus] = useState(() => new EventTarget());
  const [channel, setChannel] = useState<Channel>("音乐");
  const [enabled, setEnabled] = useState(true);
  const [receipt, setReceipt] = useState<{ channel: Channel; text: string } | null>(null);
  const [fresh, setFresh] = useState(false);
  const [received, setReceived] = useState(0);
  const [history, setHistory] = useState<Log[]>([]);
  const sequence = useRef(0);
  const append = useCallback((action: string, current: Channel) => {
    const entry = { id: ++sequence.current, action, channel: current };
    setHistory(previous => [...previous.slice(-5), entry]);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const receive = (event: Event) => {
      setReceipt({ channel, text: (event as CustomEvent<string>).detail });
      setFresh(true);
      setReceived(n => n + 1);
    };
    bus.addEventListener(channel, receive);
    append("订阅", channel);
    return () => {
      bus.removeEventListener(channel, receive);
      append("取消", channel);
    };
  }, [bus, channel, enabled, append]);

  const hasMessage = enabled && fresh && receipt?.channel === channel;
  return <>
    <div className={styles.broadcasts}>
      <button onClick={() => bus.dispatchEvent(new CustomEvent("音乐", { detail: "下一首：雨后的钢琴" }))}><MusicNote size={22} />播报音乐</button>
      <button onClick={() => bus.dispatchEvent(new CustomEvent("天气", { detail: "明天晴，适合出门" }))}><CloudSun size={22} />播报天气</button>
    </div>
    <div className={styles.receiver} data-enabled={enabled}>
      <div className={styles.tuner}><span>音乐</span><span>天气</span><i data-channel={channel} aria-hidden="true" /></div>
      <div className={styles.receiverBody}><Broadcast size={44} weight="light" aria-hidden="true" /><div><h3>{enabled ? `正在听${channel}` : "接收已关闭"}</h3><p aria-live="polite">收到 <output>{received}</output> 条消息</p></div></div>
      <div className={styles.messageArea}><p className={styles.waiting} data-hidden={Boolean(hasMessage)} aria-hidden={Boolean(hasMessage)}>{enabled ? "等待这个频道的新消息" : "开启后重新订阅"}</p><Reveal open={Boolean(hasMessage)}><p className={styles.message} key={received}>{receipt?.text}</p></Reveal></div>
      <div className={styles.receiverControls}><label>收听频道<select aria-label="收听频道" value={channel} onChange={e => { setChannel(e.target.value as Channel); setFresh(false); }}><option>音乐</option><option>天气</option></select></label><label className={shared.option}><input type="checkbox" checked={enabled} onChange={e => { setEnabled(e.target.checked); setFresh(false); }} />接收消息</label></div>
    </div>
    <details className={styles.connectionHistory}><summary>查看实际订阅记录</summary><div><ol aria-label="订阅与清理记录">{history.map(entry => <li key={entry.id}>{entry.action}<strong>{entry.channel}</strong></li>)}</ol></div></details>
  </>;
}

export function EffectLesson() {
  const [version, setVersion] = useState(0);
  return <section className={shared.lab} aria-label="Effect频道订阅演示"><SubscriptionDesk key={version} /><button className={shared.reset} onClick={() => setVersion(n => n + 1)}><ArrowCounterClockwise size={18} />重置订阅演示</button></section>;
}

export function BrowserApiLesson() {
  const element = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(65);
  const [observing, setObserving] = useState(true);
  const [measured, setMeasured] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!("ResizeObserver" in window)) { setSupported(false); return; }
    if (!observing) return;
    const observer = new ResizeObserver(([entry]) => setMeasured(Math.round(entry.contentRect.width)));
    observer.observe(element.current!);
    return () => observer.disconnect();
  }, [observing]);

  return <section className={shared.lab} aria-label="浏览器尺寸测量演示">
    <div className={styles.measureHeader}><Ruler size={25} weight="light" /><label className={shared.option}><input type="checkbox" checked={observing} disabled={!supported} onChange={e => setObserving(e.target.checked)} />观察尺寸</label></div>
    <div className={styles.measureStage}><div ref={element} className={styles.measuredObject} style={{ width: `${width}%` }}><span aria-hidden="true" /><strong>一块页面区域</strong></div><div className={styles.ruler} aria-hidden="true" /></div>
    <label className={styles.widthControl}>区域宽度<input aria-label="区域宽度" type="range" min="45" max="100" value={width} onChange={e => setWidth(Number(e.target.value))} /><output>{width}%</output></label>
    <div className={styles.measureResult} data-paused={!observing}><div><span>{!supported ? "当前浏览器不支持" : observing ? "浏览器测得" : "最后一次测量"}</span><output aria-label="测得的内容宽度">{measured ?? "—"}<small>px</small></output></div><code>{!supported ? '"ResizeObserver" in window\n// false' : observing ? "entry.contentRect.width" : "observer.disconnect()"}</code></div>
    <button className={shared.reset} onClick={() => { setWidth(65); setObserving(true); }}><ArrowCounterClockwise size={18} />重置测量</button>
  </section>;
}
