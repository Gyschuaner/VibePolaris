"use client";

import { ArrowCounterClockwise, BracketsCurly, CheckCircle, Database, Globe, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./RenderingConcept.module.css";

type Mode = "string" | "object" | "other";

export function LocalStorageLesson() {
  const [mode, setMode] = useState<Mode>("string");
  const [written, setWritten] = useState(false);
  const other = mode === "other";
  return <div className={styles.lab} data-alert={other} role="region" aria-label="localStorage origin 和字符串值演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>在同源和另一来源之间写入一个主题</strong></div><button type="button" onClick={() => { setMode("string"); setWritten(false); }} aria-label="重置 localStorage 演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choiceRow} role="group" aria-label="选择存储场景"><button type="button" aria-pressed={mode === "string"} onClick={() => { setMode("string"); setWritten(false); }}>同源字符串</button><button type="button" aria-pressed={mode === "object"} onClick={() => { setMode("object"); setWritten(false); }}>直接写对象</button><button type="button" aria-pressed={mode === "other"} onClick={() => { setMode("other"); setWritten(false); }}>另一 origin</button></div>
    <div className={styles.labBoard}>
      <div className={styles.ledger}><div className={styles.ledgerRow}><span>标签页 A</span><code>{mode === "other" ? "shop.example" : "shop.example"}</code><small>setItem('theme', value)</small></div><div className={styles.ledgerRow}><span>存储值</span><code>{!written ? "等待写入" : mode === "object" ? "[object Object]" : mode === "other" ? "theme=dark（另盒）" : '{"theme":"dark"}'}</code><small>{mode === "object" ? "对象被转成字符串" : "按 origin 保存"}</small></div><div className={styles.ledgerRow}><span>标签页 B</span><code>{other ? "读取不到 A 的盒子" : written ? "storage event → dark" : "等待事件"}</code><strong>{other ? "isolated" : written ? "updated" : "idle"}</strong></div></div>
      <div className={styles.readout} role="status">{other ? <><WarningCircle size={19} aria-hidden="true" /><strong>两个盒子互不相通</strong><p>origin 改变后，B 不能读取 A 的 localStorage，也不会收到它的 storage 事件。</p></> : mode === "object" && written ? <><WarningCircle size={19} aria-hidden="true" /><strong>先序列化对象</strong><p>localStorage 只保存字符串；想保留结构，要先 JSON.stringify，读取后再 JSON.parse。</p></> : written ? <><CheckCircle size={19} aria-hidden="true" /><strong>B 收到 storage 事件</strong><p>同源文档能看到变化，但写入动作本身仍是同步的，不能当成跨页面消息队列。</p></> : <><Database size={19} aria-hidden="true" /><strong>盒子还空着</strong><p>点击写入，观察值、来源和另一标签页分别发生什么。</p></>}</div>
    </div>
    <button className={styles.actionButton} type="button" onClick={() => setWritten(true)} disabled={written}><BracketsCurly size={14} />写入 theme</button>
  </div>;
}
