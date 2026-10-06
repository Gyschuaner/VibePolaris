"use client";

import { Browser, CheckCircle, Clock, Printer, WarningCircle } from "@phosphor-icons/react";
import { useState, type CSSProperties } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["接到请求", "等慢数据", "先吐出外壳", "补齐内容", "接通交互"];
const captions = [
  "服务器收到当前请求，才开始把这一位用户的数据写成 HTML。",
  "整页依赖慢数据时，打印头停住，浏览器还没收到页面。",
  "流式边界让已准备好的外壳先离开打印头；慢内容继续等。",
  "数据到达，剩下的 HTML 补进同一页。内容现在已经可读。",
  "客户端脚本接通事件，按钮才有行为；可读和可交互是两个时刻。",
];

export function SsrHero() {
  const scene = useScene(labels.length);
  const [streaming, setStreaming] = useState(true);
  const step = scene.step;
  const shellReady = step >= 3 || (streaming && step >= 2);
  const dataReady = step >= 3;
  const interactive = step === 4;
  return <MechanismFrame scene={scene} title="服务器怎样把页面逐段印出来" labels={labels} caption={captions[step]} onReplay={() => setStreaming(true)}>
    <div className={styles.ssrScene}>
      <div className={styles.ssrPrinter}>
        <div className={styles.ssrPrinterHead}><Printer size={16} /><span>SERVER · 请求时生成</span></div>
        <div className={styles.ssrPaper} style={{ "--print": step === 0 ? "12%" : dataReady ? "100%" : shellReady ? "45%" : "12%" } as CSSProperties}>
          <strong>账户摘要</strong><span /><span /><small>{dataReady ? "HTML 已生成" : step === 1 || step === 2 ? "订单数据仍在等待" : "当前用户的请求"}</small>
        </div>
      </div>
      <div className={styles.ssrBrowser}>
        <div className={styles.ssrBrowserHead}><Browser size={16} /><span>BROWSER · 收到才显示</span></div>
        {shellReady ? <div className={styles.ssrBrowserBody}><div className={styles.ssrShell}><span />账户</div><div className={styles.ssrData} data-ready={dataReady}><strong>{dataReady ? "本月订单：3 笔" : "订单摘要加载中"}</strong><i /><i /></div><button type="button" disabled={!interactive}>{interactive ? "查看订单 · 已接通" : "查看订单 · 等脚本"}</button></div> : <div className={styles.ssrNoPaper}><Clock size={20} /><span>还没有 HTML</span></div>}
      </div>
      <div className={styles.ssrReadout} role="status">
        {interactive ? <CheckCircle size={16} /> : shellReady ? <Browser size={16} /> : <WarningCircle size={16} />}
        <strong>{interactive ? "可见 + 可交互" : shellReady ? dataReady ? "内容可见，交互待接通" : "外壳先可见" : "整页仍在等"}</strong>
        <button type="button" aria-pressed={streaming} onClick={() => { setStreaming(value => !value); scene.seek(2); }}>{streaming ? "关闭流式" : "打开流式"}</button>
      </div>
    </div>
  </MechanismFrame>;
}
