"use client";

import { useState } from "react";
import { ConceptHero } from "../ConceptHero";
import styles from "./DependencyGarden.module.css";

type PackageId = "calendar" | "exporter" | "date" | "locale";
const packages: Record<PackageId, { label: string; filename: string; needs: PackageId[] }> = {
  calendar: { label: "日历", filename: "calendar@1.0.0", needs: ["date"] },
  exporter: { label: "导出", filename: "exporter@1.0.0", needs: ["date"] },
  date: { label: "日期工具", filename: "date-format@2.1.0", needs: ["locale"] },
  locale: { label: "语言数据", filename: "locale-data@1.0.0", needs: [] },
};
const ids = Object.keys(packages) as PackageId[];
function expand(roots: PackageId[], seen = new Set<PackageId>()) {
  for (const id of roots) { if (seen.has(id)) continue; seen.add(id); expand(packages[id].needs, seen); }
  return seen;
}
export function DependencyHero() {
  return <ConceptHero slug="dependency" label="日历和导出共同依赖日期工具；日历的需要关系淡出后，导出与日期工具仍连接着">
    <svg className={styles.hero} viewBox="0 0 360 210" aria-hidden="true">
      <g className={styles.heroLeft}><path d="M180 46Q95 48 95 95M95 120Q95 170 180 170" /><rect x="58" y="87" width="74" height="35" rx="5" /><text x="95" y="109" textAnchor="middle">日历</text></g>
      <g className={styles.heroRight}><path d="M180 46Q265 48 265 95M265 120Q265 170 180 170" /><rect x="228" y="87" width="74" height="35" rx="5" /><text x="265" y="109" textAnchor="middle">导出</text></g>
      <rect x="139" y="24" width="82" height="35" rx="5" /><text x="180" y="47" textAnchor="middle">我的应用</text>
      <rect className={styles.shared} x="127" y="151" width="106" height="36" rx="5" /><text x="180" y="174" textAnchor="middle">日期工具</text>
    </svg>
  </ConceptHero>;
}
export function DependencyLesson() {
  const [calendar, setCalendar] = useState(true);
  const [exporter, setExporter] = useState(true);
  const [installed, setInstalled] = useState<PackageId[]>(ids);
  const [loseDate, setLoseDate] = useState(false);
  const [trace, setTrace] = useState(false);
  const direct: PackageId[] = [...(calendar ? ["calendar" as const] : []), ...(exporter ? ["exporter" as const] : [])];
  const required = expand(direct);
  const missing = [...required].filter(id => !installed.includes(id));
  const extra = installed.filter(id => !required.has(id));
  const branches = [{ id: "calendar" as const, x: 95, enabled: calendar }, { id: "exporter" as const, x: 325, enabled: exporter }];
  return <figure className={styles.lab} aria-label="共享传递依赖与安装目录实验">
    <div className={styles.choices}><label><input type="checkbox" checked={calendar} onChange={e => setCalendar(e.target.checked)} />应用声明日历</label><label><input type="checkbox" checked={exporter} onChange={e => setExporter(e.target.checked)} />应用声明导出</label><button type="button" aria-pressed={trace} onClick={() => setTrace(value => !value)}>追溯日期工具的来处</button></div>
    <svg className={styles.graph} viewBox="0 0 420 340" role="img" aria-label={`清单可达 ${required.size} 个包，直接 ${direct.length} 个，传递 ${required.size - direct.length} 个；日期工具${required.has("date") ? "仍被需要" : "已经没有来自应用的路径"}`}>
      {branches.map(({ id, x, enabled }) => <g key={id} className={styles.branch} data-active={enabled} data-trace={trace && enabled}>
        <path d={`M210 54Q${x} 63 ${x} 114M${x} 151Q${x} 216 210 216`} />
        <rect x={x - 53} y="114" width="106" height="37" rx="7" /><text x={x} y="138" textAnchor="middle">{packages[id].label}</text>
      </g>)}
      <path className={styles.lowerBranch} data-active={required.has("date")} d="M210 250V290" />
      <rect className={styles.root} x="146" y="18" width="128" height="38" rx="7" /><text x="210" y="43" textAnchor="middle">我的应用</text>
      <g className={styles.packageNode} data-active={required.has("date")} data-missing={missing.includes("date")}><rect x="147" y="214" width="126" height="38" rx="7" /><text x="210" y="239" textAnchor="middle">日期工具</text></g>
      <g className={styles.packageNode} data-active={required.has("locale")}><rect x="155" y="288" width="110" height="37" rx="7" /><text x="210" y="312" textAnchor="middle">语言数据</text></g>
    </svg>
    <output className={styles.counts} aria-live="polite">清单可达 {required.size} 个包 · 直接 {direct.length} · 传递 {required.size - direct.length}</output>
    {trace && <p className={styles.trace} role="status">{direct.length ? `日期工具由${direct.map(id => packages[id].label).join("和")}带进来；它继续需要语言数据。` : "应用没有声明日历或导出，日期工具已没有来自应用的路径。"}</p>}
    <div className={styles.disk}><strong>示例安装目录</strong><div className={styles.folders}>{installed.length ? installed.map(id => <span key={id} data-extra={extra.includes(id)}>{packages[id].filename}{extra.includes(id) && <small>旧记录</small>}</span>) : <span className={styles.empty}>空目录</span>}</div></div>
    <div className={styles.choices}><label><input type="checkbox" checked={loseDate} disabled={!required.has("date")} onChange={e => setLoseDate(e.target.checked)} />模拟下一次同步缺少日期工具</label><button type="button" onClick={() => setInstalled([...required].filter(id => !(loseDate && id === "date")))}>按当前清单同步示例目录</button><button type="button" onClick={() => { setCalendar(true); setExporter(true); setInstalled(ids); setLoseDate(false); setTrace(false); }}>重置本例</button></div>
    <p className={styles.directoryReport} role="status">{missing.length ? `缺少：${missing.map(id => packages[id].filename).join("、")}。图中的需要关系仍然存在，目录却没有对应包。` : extra.length ? `目录里还有 ${extra.length} 个不再由当前应用需要的旧包；修改清单并没有自动改动这份示例目录。` : "清单的需要关系与示例目录一致。"}</p>
    <figcaption>固定虚构包的关系模型，遍历并去重计算可达包；下方目录是独立的页面状态，同步才更新。没有运行 npm 或读写本机文件；这里只画需要关系，不画下载或执行先后，同步按钮也不模拟完整安装过程。</figcaption>
  </figure>;
}
