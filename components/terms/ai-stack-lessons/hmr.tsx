"use client";

import { useState } from "react";
import { ConceptHero } from "../ConceptHero";
import styles from "./HmrWorkbench.module.css";

export function HmrHero() {
  return <ConceptHero slug="hmr" label="正在填写的页面不动，旧按钮滑出槽位，新按钮进入同一位置；姓名与计数保持原样">
    <svg className={styles.hero} viewBox="0 0 360 210" aria-hidden="true">
      <rect className={styles.window} x="26" y="22" width="270" height="158" rx="9" />
      <path className={styles.line} d="M26 46H296" /><circle className={styles.dot} cx="41" cy="34" r="3" />
      <text x="44" y="70">姓名</text><rect className={styles.field} x="44" y="80" width="123" height="30" rx="4" /><text x="55" y="99">小林</text>
      <text x="207" y="71">计数</text><text className={styles.number} x="220" y="108">3</text>
      <g className={styles.oldModule}><rect x="65" y="129" width="173" height="33" rx="4" /><text x="151" y="150" textAnchor="middle">Button v1</text></g>
      <g className={styles.newModule}><rect x="65" y="129" width="173" height="33" rx="4" /><text x="151" y="150" textAnchor="middle">Button v2</text></g>
    </svg>
  </ConceptHero>;
}

function RunningPage({ version }: { version: number }) {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  return <div className={styles.page}>
    <div className={styles.chrome}>正在运行的示例页面</div>
    <div className={styles.state}>
      <label>姓名<input value={name} placeholder="先填一个名字" onChange={e => setName(e.target.value)} /></label>
      <div className={styles.counter}>页面计数<output aria-live="polite">{count}</output></div>
    </div>
    <div className={styles.slot}>
      <span>可替换的 Button 模块</span>
      <button key={version} className={styles.liveButton} data-updated={version > 1} type="button" onClick={() => setCount(value => value + 1)}>点击加 1 · v{version}</button>
    </div>
  </div>;
}

export function HmrLesson() {
  const [accepts, setAccepts] = useState(true);
  const [version, setVersion] = useState(1);
  const [pageGeneration, setPageGeneration] = useState(0);
  const [outcome, setOutcome] = useState<"initial" | "replaced" | "reloaded">("initial");
  function save() {
    setVersion(value => value + 1);
    if (!accepts) setPageGeneration(value => value + 1);
    setOutcome(accepts ? "replaced" : "reloaded");
  }
  return <figure className={styles.lab} aria-label="保留真实表单状态的模块替换实验">
    <RunningPage key={pageGeneration} version={version} />
    <div className={styles.settings}>
      <label><input type="checkbox" checked={accepts} onChange={e => setAccepts(e.target.checked)} />有能接受本次变化的更新边界</label>
      <button type="button" onClick={save}>保存按钮模块的新版本</button>
      <button type="button" onClick={() => { setAccepts(true); setVersion(1); setPageGeneration(value => value + 1); setOutcome("initial"); }}>重置本例</button>
    </div>
    <p className={styles.result} role="status">{outcome === "initial" ? "先填写姓名、点击加 1，再保存模块，看状态是否留下。" : outcome === "replaced" ? `Button v${version} 已替换；页面实例没有重建，姓名和计数继续留在原处。` : `本例无法局部接受更新，改为重新初始化示例页面；Button v${version} 生效，姓名和计数回到初始值。`}</p>
    <figcaption>这是页面内的状态模型：接受时只替换按钮节点；回退时实际重新挂载示例页面。未修改源码或请求开发服务器，也不会刷新整篇词条。切换边界只影响下一次保存。</figcaption>
  </figure>;
}

export function HmrSubscriptions() {
  const [cleanup, setCleanup] = useState(true);
  const [generation, setGeneration] = useState(1);
  const [listeners, setListeners] = useState([1]);
  const [handled, setHandled] = useState(0);
  function replace() {
    const next = generation + 1;
    setGeneration(next);
    setListeners(old => [...(cleanup ? old.filter(id => id !== generation) : old), next]);
  }
  function emit() { for (const _id of listeners) setHandled(value => value + 1); }
  return <figure className={styles.subscription} aria-label="模块更新后的重复监听实验">
    <div className={styles.settings}><label><input type="checkbox" checked={cleanup} onChange={e => setCleanup(e.target.checked)} />更新前清理旧监听</label><button type="button" onClick={replace}>替换监听模块</button></div>
    <div className={styles.listeners} aria-label={`当前保留 ${listeners.length} 个监听`}>
      {listeners.map(id => <span key={id}>监听 v{id}</span>)}
    </div>
    <div className={styles.settings}><button type="button" onClick={emit}>发出一次消息</button><output aria-live="polite">累计处理 {handled} 次</output><button type="button" onClick={() => { setGeneration(1); setListeners([1]); setHandled(0); }}>清空并重试</button></div>
    <figcaption>本例每个保留的监听处理一次消息。取消清理后连续替换，会看到旧监听留下，一次消息被处理多次；重新启用清理后，只移除当前被替换模块的监听；更早漏掉的监听仍在，已经发生的处理次数也不撤销。清空并重试可以重新观察没有历史泄漏的情况。</figcaption>
  </figure>;
}
