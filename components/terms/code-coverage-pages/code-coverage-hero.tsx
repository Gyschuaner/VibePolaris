"use client";

import { Bug, ChartLine, CheckCircle, Code, GridFour, ShieldWarning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CodeCoverageConcept.module.css";

const steps = [
  { label: "展开条件", title: "一行代码里藏着四种输入", detail: "先把两个布尔条件拆开，覆盖率才有可观察的对象。" },
  { label: "跑通 TT", title: "成功用例点亮整行", detail: "20 岁且已验证走完了这行，但它只证明了一条路。" },
  { label: "看见空白", title: "100% 行覆盖仍有三格问号", detail: "报告指出代码被执行过，却没有替你检查每种组合。" },
  { label: "补上 TF", title: "未验证成人让缺陷露头", detail: "20 岁但未验证本应拒绝；这次输入把隐藏错误推到灯下。" },
  { label: "四格都测", title: "覆盖率完成，行为仍要看断言", detail: "四条路径都跑过了，只有明确的期望才能判断结果对不对。" },
];

const vectors = [
  { key: "TT", age: "20", verified: "true", result: "allow" },
  { key: "TF", age: "20", verified: "false", result: "deny" },
  { key: "FT", age: "17", verified: "true", result: "deny" },
  { key: "FF", age: "17", verified: "false", result: "deny" },
] as const;

function seenKeys(step: number) {
  return vectors.filter((_, index) => step >= [1, 3, 4, 4][index]).map(vector => vector.key);
}

function metricValue(step: number) {
  if (step === 0) return { line: 0, branch: 0, condition: 0 };
  if (step <= 2) return { line: 100, branch: 50, condition: 25 };
  if (step === 3) return { line: 100, branch: 50, condition: 50 };
  return { line: 100, branch: 100, condition: 100 };
}

function percent(value: number) { return value + "%"; }

export function CodeCoverageHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const seen = seenKeys(scene.step);
  const metrics = metricValue(scene.step);
  const hasBug = scene.step === 3;
  const complete = scene.step === steps.length - 1;

  return <figure ref={scene.ref} className={styles.coverageHero} data-step={scene.step} aria-label="代码覆盖率如何从执行路径和四格条件中发现测试空白">
    <div className={styles.coverageHeader}><span>把一行复合条件拆开，看百分比漏掉了什么</span><strong>run → count → question</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.coverageCanvas}>
      <div className={styles.coverageCode} data-active={scene.step === 0 || scene.step === 1}>
        <div className={styles.coverageEyebrow}><Code size={17} aria-hidden="true" /><span>被测代码 · access.ts</span></div>
        <h3>同一行，两个开关</h3>
        <pre aria-label="被测条件代码"><span data-lit={scene.step >= 1}>01  function canEnter(age, verified) {'{'}</span><span data-lit={scene.step >= 1}>02    return <mark>age &gt;= 18 &amp;&amp; verified</mark>;</span><span data-lit={scene.step >= 1}>03  {'}'}</span></pre>
        <small>{scene.step < 1 ? "先把看似一行的判断拆成可追踪的输入组合。" : "行计数器已经亮起；它还不知道哪一种组合没来过。"}</small>
      </div>
      <div className={styles.coverageMatrix} data-active={scene.step === 0 || scene.step === 2 || scene.step === 3}>
        <div className={styles.coverageMatrixHeader}><div className={styles.coverageEyebrow}><GridFour size={17} aria-hidden="true" /><span>路径地图 · 2 × 2</span></div><strong>{seen.length} / 4<br />组合已执行</strong></div>
        <div className={styles.coverageAxes}><span>已验证</span><span>未验证</span></div><div className={styles.coverageGrid}>{vectors.map(vector => <div key={vector.key} className={styles.coverageCell} data-seen={seen.includes(vector.key)} data-bug={vector.key === "TF" && hasBug}><strong>{vector.key}</strong><span>{vector.age} 岁 · {vector.verified}</span><span>{seen.includes(vector.key) ? vector.key === "TF" && hasBug ? "got allow" : vector.result : "未跑"}</span></div>)}</div>
        <div className={styles.coverageMatrixNote}>{hasBug ? <Bug size={17} aria-hidden="true" /> : <ShieldWarning size={17} aria-hidden="true" />}<span>{hasBug ? "TF 本应 deny，却得到 allow；覆盖率只把这条路带到你面前，断言才把它判红。" : scene.step < 2 ? "每一格代表一个可能到达的条件组合。" : "空白格不是失败结果，而是尚未取得证据。"}</span></div>
      </div>
      <div className={styles.coverageMeters} data-active={scene.step === 1 || scene.step === 4 || complete} data-danger={hasBug}>
        <div className={styles.coverageEyebrow}><ChartLine size={17} aria-hidden="true" /><span>报告 · 三种镜头</span></div>
        <div className={styles.coverageMeter}><div className={styles.coverageMeterHeader}><span>行 / 语句</span><strong>{percent(metrics.line)}</strong></div><div className={styles.coverageBar}>{Array.from({ length: 4 }, (_, index) => <i key={index} data-on={metrics.line >= (index + 1) * 25} />)}</div></div>
        <div className={styles.coverageMeter}><div className={styles.coverageMeterHeader}><span>分支</span><strong>{percent(metrics.branch)}</strong></div><div className={styles.coverageBar}>{Array.from({ length: 4 }, (_, index) => <i key={index} data-on={metrics.branch >= (index + 1) * 25} />)}</div></div>
        <div className={styles.coverageMeter}><div className={styles.coverageMeterHeader}><span>条件组合</span><strong>{seen.length} / 4</strong></div><div className={styles.coverageBar}>{vectors.map(vector => <i key={vector.key} data-on={seen.includes(vector.key)} data-alert={vector.key === "TF" && hasBug} />)}</div></div>
        <small>{complete ? "三种指标都满格；下一步仍是读断言和业务风险。" : scene.step < 2 ? "同一组执行记录，会在不同指标下留下不同读数。" : "数字告诉你哪里没跑，不能替你判定结果正确。"}</small>
      </div>
    </div>
    <div className={styles.coverageRunBar}><span>本轮输入</span><strong>{scene.step === 0 ? "还没有执行测试" : seen.map(key => key + " = " + (key === "TF" && hasBug ? "allow" : vectors.find(vector => vector.key === key)?.result)).join("  ·  ")}</strong></div>
    <div className={styles.coverageHeroMetrics}><div><span>行覆盖</span><strong>{percent(metrics.line)}</strong></div><div><span>分支覆盖</span><strong>{percent(metrics.branch)}</strong></div><div><span>条件格</span><strong>{seen.length} / 4</strong></div></div>
    <div className={styles.coverageStatus} data-danger={hasBug} role="status">{hasBug ? <Bug size={19} aria-hidden="true" /> : <CheckCircle size={19} aria-hidden="true" />}<span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>覆盖率是测试执行留下的地图：它能标出没有走过的地方，却不能把“走过”自动翻译成“行为正确”。</figcaption>
  </figure>;
}
