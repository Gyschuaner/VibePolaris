"use client";

import { useState, type CSSProperties } from "react";
import { ConceptHero } from "../ConceptHero";
import styles from "./BundleAssembly.module.css";

type ModuleId = "app" | "nav" | "utils" | "chart";
const modules: Record<ModuleId, { label: string; size: number; imports: ModuleId[] }> = {
  app: { label: "app.js", size: 1, imports: ["nav"] },
  nav: { label: "Nav.js", size: 2, imports: ["utils"] },
  utils: { label: "utils.js", size: 1, imports: [] },
  chart: { label: "chart.js", size: 12, imports: ["utils"] },
};
function collect(start: ModuleId[], found = new Set<ModuleId>()) {
  for (const id of start) {
    if (found.has(id)) continue;
    found.add(id); collect(modules[id].imports, found);
  }
  return found;
}

export function BundlerHero() {
  return <ConceptHero slug="bundler" label="源码模块聚合进主包，图表模块独立留在按需包内，模块身份在运动中保持不变">
    <svg className={styles.mini} viewBox="0 0 360 210" aria-hidden="true">
      <g className={styles.miniPackages}><rect x="23" y="70" width="209" height="107" rx="10" /><text x="38" y="90">main.js</text><rect x="250" y="93" width="88" height="84" rx="10" /><text x="259" y="111">chart.js</text></g>
      {[{ id: "app", x: 35, y: 106, dx: -14, dy: -59 }, { id: "nav", x: 98, y: 106, dx: 13, dy: -72 }, { id: "utils", x: 161, y: 106, dx: 29, dy: -58 }, { id: "chart", x: 262, y: 128, dx: -2, dy: -92 }].map(item => <g key={item.id} className={styles.miniModule} style={{ "--dx": `${item.dx}px`, "--dy": `${item.dy}px` } as CSSProperties}><rect x={item.x} y={item.y} width="58" height="37" rx="3" /><text x={item.x + 29} y={item.y + 23} textAnchor="middle">{item.id === "nav" ? "Nav" : item.id}</text></g>)}
    </svg>
  </ConceptHero>;
}

export function BundlerLesson() {
  const [splitChart, setSplitChart] = useState(true);
  const [packed, setPacked] = useState(false);
  const [missingChunk, setMissingChunk] = useState(false);
  const [chartStatus, setChartStatus] = useState<"closed" | "failed" | "loaded">("closed");
  const [clicks, setClicks] = useState(0);
  const main = collect(splitChart ? ["app"] : ["app", "chart"]);
  const lazy = [...collect(["chart"])].filter(id => !main.has(id));
  const mainSize = [...main].reduce((sum, id) => sum + modules[id].size, 0);
  const lazySize = lazy.reduce((sum, id) => sum + modules[id].size, 0);
  const loadedSize = mainSize + 1 + (splitChart && chartStatus === "loaded" ? lazySize : 0);
  const loosePositions: Record<ModuleId, [number, number]> = { app: [20, 42], nav: [130, 22], utils: [232, 39], chart: [85, 148] };
  const packedPositions: Record<ModuleId, [number, number]> = { app: [33, 91], nav: [104, 91], utils: [175, 91], chart: splitChart ? [285, 116] : [33, 157] };
  function build() { setPacked(true); setChartStatus("closed"); setClicks(0); }
  function openChart() {
    if (chartStatus === "loaded") return;
    setChartStatus(splitChart && missingChunk ? "failed" : "loaded");
  }
  return <figure className={styles.lab} aria-label="打包器模块聚合与按需加载实验">
    <div className={styles.settings}><label><input type="checkbox" checked={splitChart} onChange={e => { setSplitChart(e.target.checked); setPacked(false); setChartStatus("closed"); setMissingChunk(false); setClicks(0); }} />图表按需拆包</label><button type="button" onClick={build}>{packed ? "重新构建并打开页面" : "打包本例并打开页面"}</button></div>
    <pre className={styles.importCode}><code>{'import { renderNav } from "./Nav.js";\nimport "./theme.css";\n' + (splitChart ? 'const openChart = () => import("./chart.js");' : 'import { renderChart } from "./chart.js";')}</code></pre>
    <svg className={styles.assembly} viewBox="0 0 400 260" role="img" aria-label={packed ? `主包包含 ${[...main].map(id => modules[id].label).join("、")}；${splitChart ? "图表独立成包" : "图表也在主包内"}；样式独立输出` : "app、导航、工具函数、图表的源码模块尚未聚合"}>
      <g className={styles.package} data-packed={packed}><rect x="21" y="61" width="233" height="161" rx="13" /><text x="32" y="79">main.js · {mainSize} KB</text>{splitChart && <><rect x="272" y="88" width="106" height="108" rx="13" data-failed={chartStatus === "failed"} /><text x="282" y="107">chart.js</text><text x="286" y="188">{lazySize} KB · 按需</text></>}<rect x="272" y="211" width="106" height="35" rx="5" /><text x="284" y="233">theme.css</text></g>
      {(Object.keys(modules) as ModuleId[]).map(id => { const [x, y] = packed ? packedPositions[id] : loosePositions[id]; return <g key={id} className={styles.module} data-chart={id === "chart"} style={{ transform: `translate(${x}px, ${y}px)` }}><rect width="64" height="49" rx="4" /><text x="32" y="20" textAnchor="middle">{modules[id].label}</text><text x="32" y="37" textAnchor="middle">{modules[id].size} KB</text></g>; })}
    </svg>
    <output className={styles.bundleResult} aria-live="polite">{packed ? `产物：${splitChart ? "2 个 JS 文件" : "1 个 JS 文件"} + theme.css；本例首屏载入 ${mainSize + 1} KB` : "源码关系已设定，点击打包观察模块聚合。"}</output>
    <div className={styles.preview}>
      <div className={styles.previewHead}><span>浏览器预览</span><span>{packed ? `已载入 ${loadedSize} KB` : "尚未打开"}</span></div>
      <div className={styles.previewActions}><button type="button" disabled={!packed} onClick={() => setClicks(value => value + 1)}>主页面按钮 · {clicks}</button><button type="button" disabled={!packed} onClick={openChart}>{chartStatus === "failed" ? "重试打开图表" : "打开图表"}</button></div>
      <label className={styles.failureChoice}><input type="checkbox" disabled={!packed || !splitChart} checked={missingChunk} onChange={e => setMissingChunk(e.target.checked)} />模拟图表包 404（下一次请求）</label>
      <div className={styles.chartArea} data-failed={chartStatus === "failed"} role="status">{chartStatus === "loaded" ? <><div className={styles.bars} aria-hidden="true">{[45, 75, 55].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div><span>{splitChart ? "图表包已载入；重复打开会复用已加载的模块。" : "图表代码随主包到达，无需请求独立图表包。"}</span></> : chartStatus === "failed" ? "chart.js 请求返回 404；图表没有载入，主页面按钮仍可操作。" : packed ? (splitChart ? "主页面已打开，图表包尚未请求。" : "图表代码已经随主包到达，点击后显示图表。") : "打包后再观察加载时机。"}</div>
    </div>
    <figcaption>本例遍历固定模块依赖并计算归属，未调用真实打包器或发起网络请求。KB 为教学设定，未计运行时代码、压缩、协议及缓存；样式设为单独的 1 KB 文件，共用的 utils.js 留在主包。</figcaption>
  </figure>;
}
