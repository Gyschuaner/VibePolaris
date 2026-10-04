"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, ChartLine, CheckCircle, Code, GridFour, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CodeCoverageConcept.module.css";

const labels = ["运行测试", "打开报告", "换一面镜头", "追到空白格", "补行为证据"];
type Lens = "line" | "branch" | "condition";
type Standard = "percent" | "behavior";

const lensCopy: Record<Lens, { label: string; value: string; question: string }> = {
  line: { label: "行覆盖", value: "100%", question: "哪些语句被执行过？" },
  branch: { label: "分支覆盖", value: "100%", question: "if 的两侧都走过吗？" },
  condition: { label: "组合矩阵", value: "4 / 4", question: "每种输入组合都跑过吗？" },
};

function reportValue(lens: Lens, step: number) {
  if (step < 1) return lens === "condition" ? "0 / 4" : "0%";
  if (lens === "line") return "100%";
  if (lens === "branch") return step >= 4 ? "100%" : "50%";
  return step >= 4 ? "4 / 4" : step >= 3 ? "2 / 4" : "1 / 4";
}

const cells = [
  { key: "TT", text: "20 · true", outcome: "allow" },
  { key: "TF", text: "20 · false", outcome: "deny" },
  { key: "FT", text: "17 · true", outcome: "deny" },
  { key: "FF", text: "17 · false", outcome: "deny" },
] as const;

export function CodeCoverageLesson() {
  const scene = useScene(labels.length);
  const [lens, setLens] = useState<Lens>("line");
  const [standard, setStandard] = useState<Standard>("percent");
  const final = scene.step === labels.length - 1;
  const meaningful = final && standard === "behavior";
  const weak = final && standard === "percent";
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const report = { ...lensCopy[lens], value: reportValue(lens, scene.step) };
  const checked = scene.step >= 4 ? cells.map(cell => cell.key) : scene.step >= 3 ? ["TT", "TF"] : scene.step >= 1 ? ["TT"] : [];
  const verdict = !final ? "未判定" : meaningful ? "PASS · 有行为证据" : "WEAK · 只追百分比";

  return <div ref={scene.ref} className={styles.coverageLab} role="region" aria-label="测试覆盖率报告工作台：切换覆盖维度和完成标准，查看指标与行为证据的区别">
    <div className={styles.coverageLabHeader}><span>把报告里的数字翻译成下一条有用测试</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.coverageLabControls} role="group" aria-label="选择覆盖率镜头与完成标准"><div><span>报告看哪一面</span>{(Object.keys(lensCopy) as Lens[]).map(key => <button key={key} type="button" className={styles.coverageLabButton} aria-pressed={lens === key} onClick={() => reset(() => setLens(key))}>{lensCopy[key].label}</button>)}</div><div><span>什么才算完成</span><button type="button" className={styles.coverageLabButton} aria-pressed={standard === "percent"} onClick={() => reset(() => setStandard("percent"))}>百分比到线</button><button type="button" className={styles.coverageLabButton} aria-pressed={standard === "behavior"} onClick={() => reset(() => setStandard("behavior"))}>路径 + 断言</button></div></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.coverageLabGrid}>
      <div className={styles.coverageLabPanel} data-active={scene.step === 0 || scene.step === 1}>
        <div className={styles.coverageLabLabel}><Code size={16} aria-hidden="true" /><span>报告 · 当前镜头</span></div>
        <h3>{report.label} · {report.value}</h3>
        <code>{report.question}</code>
        <div className={styles.coverageLabMeters}><div className={styles.coverageLabMeter}><span>行</span><i style={{ "--meter": `${scene.step >= 1 ? 100 : 0}%` } as CSSProperties} /><strong>{scene.step >= 1 ? "100%" : "0%"}</strong></div><div className={styles.coverageLabMeter}><span>分支</span><i style={{ "--meter": `${scene.step >= 4 ? 100 : scene.step >= 1 ? 50 : 0}%` } as CSSProperties} /><strong>{scene.step >= 4 ? "100%" : scene.step >= 1 ? "50%" : "0%"}</strong></div><div className={styles.coverageLabMeter}><span>条件</span><i style={{ "--meter": `${scene.step >= 4 ? 100 : scene.step >= 3 ? 50 : scene.step >= 1 ? 25 : 0}%` } as CSSProperties} /><strong>{scene.step >= 4 ? "4/4" : scene.step >= 3 ? "2/4" : scene.step >= 1 ? "1/4" : "0/4"}</strong></div></div>
        <small>{scene.step < 2 ? "先让测试执行产生计数，再问这组数字覆盖了什么。" : "切换镜头不会增加证据；它只改变你正在追踪的空白。"}</small>
      </div>
      <div className={styles.coverageLabPanel} data-active={scene.step === 2 || scene.step === 3}>
        <div className={styles.coverageLabLabel}><GridFour size={16} aria-hidden="true" /><span>空白 · 条件矩阵</span></div>
        <h3>{checked.length} / 4 组合已跑</h3>
        <div className={styles.coverageLabMatrix}>{cells.map(cell => <span key={cell.key} data-seen={checked.includes(cell.key)} data-bug={cell.key === "TF" && scene.step === 3}>{cell.key}<small>{checked.includes(cell.key) ? cell.key === "TF" && scene.step === 3 ? "allow ≠ deny" : cell.outcome : "未跑"}</small></span>)}</div>
        <small>{scene.step === 3 ? "TF 暴露实现和期待的差异；现在需要一条行为断言，而不是再刷一遍同一行。" : "把复合条件展开，才看得见行覆盖背后的未执行组合。"}</small>
      </div>
      <div className={styles.coverageLabPanel} data-active={scene.step === 4} data-danger={weak} data-good={meaningful}>
        <div className={styles.coverageLabLabel}>{weak ? <WarningCircle size={16} aria-hidden="true" /> : meaningful ? <CheckCircle size={16} aria-hidden="true" /> : <ShieldWarning size={16} aria-hidden="true" />}<span>结论 · {standard === "percent" ? "数字" : "证据"}</span></div>
        <h3>{!final ? "等待判断" : standard === "percent" ? "四格跑完了" : "每格都有期待"}</h3>
        <div className={styles.coverageVerdict}>{verdict}</div>
        <small>{!final ? "覆盖率先指出缺口；完成标准还没有落地。" : weak ? "100% 只说明计数器见过这些结构，不能说明输入输出符合需求。" : "每条路径都带着明确的 allow/deny 期待，覆盖率变成了选测试的地图。"}</small>
      </div>
    </div>
    <div className={styles.coverageLabRail}><div data-on={scene.step >= 0}><Code size={15} aria-hidden="true" /><span>写条件</span></div><div data-on={scene.step >= 1}><ChartLine size={15} aria-hidden="true" /><span>数执行</span></div><div data-on={scene.step >= 2}><GridFour size={15} aria-hidden="true" /><span>找空白</span></div><div data-on={scene.step >= 3}><ShieldWarning size={15} aria-hidden="true" /><span>看风险</span></div><div data-on={scene.step >= 4} data-danger={weak}><CheckCircle size={15} aria-hidden="true" /><span>定行为</span></div></div>
    <div className={styles.coverageLabMetrics}><div><span>当前镜头</span><strong>{report.label}</strong></div><div><span>已跑组合</span><strong>{checked.length} / 4</strong></div><div><span>完成标准</span><strong>{standard === "percent" ? "数字到线" : "路径 + 断言"}</strong></div></div>
    <p className={styles.coverageLabNote} data-danger={weak} role="status">{!final ? <><ArrowCounterClockwise size={17} aria-hidden="true" /><span>报告是地图，不是成绩单。先找没走过的路径，再决定哪一条风险值得写成测试。</span></> : weak ? <><WarningCircle size={17} aria-hidden="true" /><span>覆盖率已经满格，但结论仍然虚：把百分比换成每个路径的可观察期待。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>覆盖率告诉你测试走过哪里，断言告诉你那条路的结果是否值得信。</span></>}</p>
  </div>;
}
