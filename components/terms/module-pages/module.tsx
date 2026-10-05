"use client";

import { ArrowCounterClockwise, CheckCircle, Copy, GitBranch, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./ModuleConcept.module.css";

type BindingMode = "live" | "copy";

export function ModuleLesson() {
  const [mode, setMode] = useState<BindingMode>("live");
  const [updated, setUpdated] = useState(false);
  const [cycle, setCycle] = useState(false);
  const shown = updated && mode === "live" ? "zh-CN" : "en-US";
  return <div className={styles.lab} role="region" aria-label="模块依赖图和 live binding 演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>修改 settings.js，再看调用方拿到什么</strong></div><button type="button" onClick={() => { setMode("live"); setUpdated(false); setCycle(false); }} aria-label="重置模块演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.labChoices} role="group" aria-label="选择导入关系"><button type="button" aria-pressed={mode === "live"} onClick={() => { setMode("live"); setUpdated(false); setCycle(false); }}><GitBranch size={14} />live binding</button><button type="button" aria-pressed={mode === "copy"} onClick={() => { setMode("copy"); setUpdated(false); setCycle(false); }}><Copy size={14} />复制快照</button><button type="button" aria-pressed={cycle} onClick={() => setCycle(value => !value)}><WarningCircle size={14} />模拟循环依赖</button></div>
    <div className={styles.labBoard} data-cycle={cycle}>
      <div className={styles.fileColumn}><div className={styles.fileCard}><span>settings.js</span><code>export let locale = 'en-US'</code><small>{updated ? "locale = 'zh-CN'" : "等待修改"}</small></div><div className={styles.fileCard}><span>greeting.js</span><code>import &#123; locale &#125;</code><small>{mode === "live" ? "读取当前绑定" : "保存导入时快照"}</small></div><div className={styles.fileCard}><span>entry.js</span><code>format(locale)</code><strong>{cycle ? "ReferenceError · TDZ" : updated ? `输出：${shown}` : "输出：en-US"}</strong></div></div>
      <div className={styles.labReadout} role="status">{cycle ? <><WarningCircle size={19} aria-hidden="true" /><strong>循环依赖先读到了未初始化的绑定</strong><p>循环不是“模块互相 import 就一定错”，但在初始化顺序尚未完成时读取变量，会遇到 temporal dead zone。</p></> : updated ? <><CheckCircle size={19} aria-hidden="true" /><strong>{mode === "live" ? "调用方跟着导出更新" : "调用方仍拿着旧快照"}</strong><p>{mode === "live" ? "导入连接到导出绑定，settings.js 改成 zh-CN 后，entry.js 读到同一个新值。" : "把值复制成普通变量后，后续导出更新不会回写这份副本。"}</p></> : <><GitBranch size={19} aria-hidden="true" /><strong>先修改 settings.js</strong><p>按钮只改变这个演示里的模块状态，不会真的写入文件。</p></>}</div>
    </div>
    <button className={styles.runButton} type="button" onClick={() => { setUpdated(true); setCycle(false); }} disabled={cycle}>修改导出值</button>
  </div>;
}
