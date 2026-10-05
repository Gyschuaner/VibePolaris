"use client";

import { ArrowCounterClockwise, CheckCircle, Code, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./RenderingConcept.module.css";

type InputMode = "stable" | "mismatch";

export function HydrationLesson() {
  const [input, setInput] = useState<InputMode>("stable");
  const [connected, setConnected] = useState(false);
  const bad = input === "mismatch";
  return <div className={styles.lab} data-alert={bad && connected} role="region" aria-label="水合匹配和事件接管演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>先让首屏稳定，再把事件接上</strong></div><button type="button" onClick={() => { setInput("stable"); setConnected(false); }} aria-label="重置水合演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choiceRow} role="group" aria-label="选择首屏输入"><button type="button" aria-pressed={input === "stable"} onClick={() => { setInput("stable"); setConnected(false); }}>稳定首屏</button><button type="button" aria-pressed={input === "mismatch"} onClick={() => { setInput("mismatch"); setConnected(false); }}>制造 mismatch</button></div>
    <div className={styles.labBoard}>
      <div className={styles.ledger}><div className={styles.ledgerRow}><span>服务器 HTML</span><code>{bad ? "时间：09:00" : "按钮：保存"}</code><small>先到浏览器</small></div><div className={styles.ledgerRow}><span>客户端首轮</span><code>{bad ? "时间：09:01" : "按钮：保存"}</code><small>{bad ? "结构不同" : "可匹配"}</small></div><div className={styles.ledgerRow}><span>事件处理</span><code>{connected && !bad ? "onClick → count + 1" : "等待连接"}</code><strong>{connected && !bad ? "connected" : "灰色"}</strong></div></div>
      <div className={styles.readout} role="status">{bad && connected ? <><WarningCircle size={19} aria-hidden="true" /><strong>先修首轮输出</strong><p>服务器与客户端第一次渲染不一致，先让输入稳定，再谈事件接管。</p></> : connected ? <><CheckCircle size={19} aria-hidden="true" /><strong>按钮现在可用</strong><p>已有 DOM 被匹配并接上处理函数，水合完成不等于重新生成整页。</p></> : <><Code size={19} aria-hidden="true" /><strong>事件还没接上</strong><p>页面看得见，但客户端代码尚未完成匹配和监听器注册。</p></>}</div>
    </div>
    <button className={styles.actionButton} type="button" onClick={() => setConnected(true)}><CheckCircle size={14} />连接事件</button>
  </div>;
}
