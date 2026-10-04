"use client";

import { useState } from "react";
import { CheckCircle, Clock, Code, Flask, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./UnitTestConcept.module.css";

const labels = ["挑输入", "控依赖", "跑单元", "看契约"];
const cases = {
  "-1": { output: "RangeError", expected: "拒绝负金额", kind: "error" },
  "0": { output: "0", expected: "0", kind: "value" },
  "100": { output: "90", expected: "90", kind: "value" },
  "101": { output: "90.9", expected: "90.9", kind: "value" },
} as const;
type CaseKey = keyof typeof cases;
type ClockMode = "fixed" | "live";
type AssertionMode = "behavior" | "private";

export function UnitTestLesson() {
  const scene = useScene(labels.length);
  const [input, setInput] = useState<CaseKey>("100");
  const [clockMode, setClockMode] = useState<ClockMode>("fixed");
  const [assertionMode, setAssertionMode] = useState<AssertionMode>("behavior");
  const current = cases[input];
  const live = clockMode === "live";
  const brittle = assertionMode === "private";
  const final = scene.step === labels.length - 1;
  const passed = final && !live && !brittle;
  const reset = (next: () => void) => { next(); scene.seek(0); };

  return <div ref={scene.ref} className={styles.unitLab} role="region" aria-label="单元测试输入、依赖与断言工作台">
    <div className={styles.unitLabHeader}><span>只改一个输入或依赖，观察测试为什么变得可靠或脆弱</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.unitLabControls} role="group" aria-label="选择单元测试条件">
      <div className={styles.unitLabControlGroup}><span>输入</span>{Object.keys(cases).map(value => <button key={value} type="button" className={styles.unitLabButton} aria-pressed={input === value} onClick={() => reset(() => setInput(value as CaseKey))}>{value}</button>)}</div>
      <div className={styles.unitLabControlGroup}><span>时钟</span><button type="button" className={styles.unitLabButton} aria-pressed={!live} onClick={() => reset(() => setClockMode("fixed"))}>固定日期</button><button type="button" className={styles.unitLabButton} aria-pressed={live} onClick={() => reset(() => setClockMode("live"))}>系统时间</button></div>
      <div className={styles.unitLabControlGroup}><span>断言</span><button type="button" className={styles.unitLabButton} aria-pressed={!brittle} onClick={() => reset(() => setAssertionMode("behavior"))}>行为结果</button><button type="button" className={styles.unitLabButton} aria-pressed={brittle} onClick={() => reset(() => setAssertionMode("private"))}>私有变量</button></div>
    </div>
    <div className={styles.unitLabGrid}>
      <div className={styles.unitLabPanel} data-active={scene.step === 0}>
        <div className={styles.unitLabLabel}><Flask size={16} aria-hidden="true" /><span>Arrange · 准备</span></div>
        <h3>输入 {input}</h3>
        <div className={styles.unitLabInput}><span>expected</span><strong>{current.expected}</strong></div>
        <small>{input === "-1" ? "异常也是契约的一部分" : "只放验证当前行为所需的数据"}</small>
      </div>
      <div className={styles.unitLabPanel + " " + styles.unitLabDependency} data-active={scene.step === 1} data-danger={live}>
        <div className={styles.unitLabLabel}><Clock size={16} aria-hidden="true" /><span>依赖 · dependency</span></div>
        <h3>{live ? "system today" : "2026-08-31"}</h3>
        <div className={styles.unitLabInput}><span>结果稳定性</span><strong>{live ? "漂移" : "稳定"}</strong></div>
        <small>{live ? "同一用例可能在不同日期得到不同结果" : "时间从接口注入，测试可以重复"}</small>
      </div>
      <div className={styles.unitLabPanel + " " + styles.unitLabCode} data-active={scene.step === 2}>
        <div className={styles.unitLabLabel}><Code size={16} aria-hidden="true" /><span>Act · 调用</span></div>
        <h3>priceAfterDiscount()</h3>
        <code>{input === "-1" ? "throw RangeError" : `${input} → ${current.output}`}</code>
        <small>{scene.step < 2 ? "尚未调用" : "只运行被测单元，不启动数据库"}</small>
      </div>
      <div className={styles.unitLabPanel + " " + styles.unitLabAssertion} data-active={scene.step === 3} data-danger={final && (live || brittle)}>
        <div className={styles.unitLabLabel}>{final && (live || brittle) ? <WarningCircle size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span>Assert · 判断</span></div>
        <h3>{!final ? "等待断言" : passed ? "PASS" : live ? "环境依赖" : "实现细节失败"}</h3>
        <div className={styles.unitLabInput}><span>{brittle ? "couponRate" : "返回值 / 错误"}</span><strong>{final ? (brittle ? "changed" : live ? "unknown" : "match") : "—"}</strong></div>
        <small>{brittle ? "内部变量换名或改表就会误报" : live ? "先控制依赖，再相信结果" : "只检查读者看得见的行为"}</small>
      </div>
    </div>
    <div className={styles.unitLabMetrics}>
      <div><span>当前用例</span><strong>{input} → {current.output}</strong></div>
      <div><span>执行范围</span><strong>1 unit</strong></div>
      <div><span>测试结论</span><strong>{!final ? "未运行" : passed ? "可重复通过" : "需要修正边界"}</strong></div>
    </div>
    <p className={styles.unitLabNote} data-danger={final && (live || brittle)} role="status">
      {!final ? <><LockSimple size={17} aria-hidden="true" /><span>先安排一个输入，再调用这段规则；测试的速度来自范围小，可信度来自依赖和预期都被写清。</span></> : live ? <><WarningCircle size={17} aria-hidden="true" /><span>系统时间没有被固定。这个测试可能今天通过、下个月失败；把时间作为依赖注入，才有稳定的实验条件。</span></> : brittle ? <><WarningCircle size={17} aria-hidden="true" /><span>断言私有变量把测试绑在实现细节上。把 if 改成规则表时，外部行为没变，测试却不该跟着报错。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>输入、时钟和外部结果都可控，断言只盯住行为；这就是单元测试适合快速反馈的原因。</span></>}
    </p>
  </div>;
}
