"use client";

import { useState } from "react";
import { ArrowCounterClockwise, CheckCircle, Code, Database, Gear, ListChecks, Robot, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./MockConcept.module.css";

const labels = ["隔离边界", "设定回执", "观察调用", "重构内部", "审查信号"];
type CheckMode = "behavior" | "interaction";
type DoubleMode = "mock" | "fake";

export function MockLesson() {
  const scene = useScene(labels.length);
  const [checkMode, setCheckMode] = useState<CheckMode>("behavior");
  const [doubleMode, setDoubleMode] = useState<DoubleMode>("mock");
  const final = scene.step === labels.length - 1;
  const stale = final && checkMode === "interaction" && doubleMode === "mock";
  const unsupported = final && checkMode === "interaction" && doubleMode === "fake";
  const complete = final && !stale && !unsupported;
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const verdict = !final ? "未判定" : stale ? "FAIL · 旧调用" : unsupported ? "N/A · 无交互证据" : "PASS · paid";

  return <div ref={scene.ref} className={styles.mockLab} role="region" aria-label="模拟对象的隔离、控制、调用记录与重构审查工作台">
    <div className={styles.mockLabHeader}><span>换一条断言，看看测试到底在保护什么</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.mockLabControls} role="group" aria-label="选择测试断言与替身"><div><span>判定依据</span><button type="button" className={styles.mockLabButton} aria-pressed={checkMode === "behavior"} onClick={() => reset(() => setCheckMode("behavior"))}>order=paid</button><button type="button" className={styles.mockLabButton} aria-pressed={checkMode === "interaction"} onClick={() => reset(() => setCheckMode("interaction"))}>charge ×1</button></div><div><span>替身选择</span><button type="button" className={styles.mockLabButton} aria-pressed={doubleMode === "mock"} onClick={() => reset(() => setDoubleMode("mock"))}>Mock</button><button type="button" className={styles.mockLabButton} aria-pressed={doubleMode === "fake"} onClick={() => reset(() => setDoubleMode("fake"))}>Fake</button></div></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.mockLabGrid}>
      <div className={styles.mockLabPanel} data-active={scene.step === 0} data-soft="true">
        <div className={styles.mockLabLabel}><Code size={16} aria-hidden="true" /><span>边界 · SUT</span></div>
        <h3>Checkout</h3>
        <code>pay(order, card)</code>
        <div className={styles.mockLabValue}><span>真实支付</span><strong>{scene.step === 0 ? "不接触" : "隔离"}</strong></div>
        <small>单元测试要看结账如何处理回执，不需要每次真的扣款。</small>
      </div>
      <div className={styles.mockLabPanel} data-active={scene.step === 1}>
        <div className={styles.mockLabLabel}><Robot size={16} aria-hidden="true" /><span>控制 · Double</span></div>
        <h3>{doubleMode === "mock" ? "Payment Mock" : "Payment Fake"}</h3>
        <div className={styles.mockLabValue}><span>返回</span><strong>{scene.step >= 1 ? "paid" : "—"}</strong></div>
        <small>{doubleMode === "mock" ? "返回值由测试设定，调用也会留下记录。" : "用轻量实现执行支付协议，保留更多真实行为。"}</small>
      </div>
      <div className={styles.mockLabPanel} data-active={scene.step === 2}>
        <div className={styles.mockLabLabel}><ListChecks size={16} aria-hidden="true" /><span>记录 · Trace</span></div>
        <h3>支付调用日志</h3>
        <div className={styles.mockLabCalls}><span>旧：<code>charge(amount)</code></span><span>新：<code>authorize → capture</code></span></div>
        <small>{scene.step < 2 ? "调用还没有发生。" : "日志能回答‘怎么调用’，不自动等于‘业务对不对’。"}</small>
      </div>
      <div className={styles.mockLabPanel} data-active={scene.step === 3} data-danger={stale} data-incomplete={unsupported} data-green={complete}>
        <div className={styles.mockLabLabel}>{stale || unsupported ? <WarningCircle size={16} aria-hidden="true" /> : complete ? <CheckCircle size={16} aria-hidden="true" /> : <Gear size={16} aria-hidden="true" />}<span>判定 · Oracle</span></div>
        <h3>{!final ? "等待重构" : stale ? "旧交互失配" : unsupported ? "无法验证调用" : "业务契约仍在"}</h3>
        <div className={styles.mockLabBig}>{verdict}</div>
        <small>{!final ? "先让实现变化，再观察哪条断言会动。" : stale ? "订单仍 paid，红色来自 charge ×1 这个旧期待。" : unsupported ? "Fake 通过的是支付契约，不提供 Mock 的调用期待；要验交互，请换 Mock。" : doubleMode === "fake" ? "Fake 的回执更接近真实依赖，适合补高保真证据。" : "Mock 控制了支付回执，行为断言仍然清楚。"}</small>
      </div>
    </div>
    <div className={styles.mockLabTimeline}><div data-on={scene.step >= 0}><ArrowCounterClockwise size={16} aria-hidden="true" /><span>隔离外部支付</span></div><div data-on={scene.step >= 1}><Robot size={16} aria-hidden="true" /><span>控制返回值</span></div><div data-on={scene.step >= 2}><ListChecks size={16} aria-hidden="true" /><span>记录调用</span></div><div data-on={scene.step >= 3}><Gear size={16} aria-hidden="true" /><span>拆分实现</span></div><div data-on={scene.step >= 4} data-danger={stale} data-incomplete={unsupported}><ShieldWarning size={16} aria-hidden="true" /><span>审查信号</span></div></div>
    <div className={styles.mockLabMetrics}><div><span>替身</span><strong>{doubleMode === "mock" ? "受控 + 记录" : "轻量实现"}</strong></div><div><span>断言</span><strong>{unsupported ? "无交互证据" : checkMode === "behavior" ? "最终状态" : "交互形状"}</strong></div><div><span>结论</span><strong>{verdict}</strong></div></div>
    <p className={styles.mockLabNote} data-danger={stale} data-incomplete={unsupported} role="status">{!final ? <><Database size={17} aria-hidden="true" /><span>先把难以触发的依赖换成可控回执，再决定要验证结果还是交互；替身不是自动生成的真实世界。</span></> : stale ? <><WarningCircle size={17} aria-hidden="true" /><span>Mock 的红灯值得看，但先问它保护的是业务契约还是旧实现。若只是后者，重构不应被它挡住。</span></> : unsupported ? <><WarningCircle size={17} aria-hidden="true" /><span>Fake 通过的是支付契约，不提供 charge×1 的交互记录；要验证调用细节，请换 Mock 或改写你真正要保护的契约。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>把 Mock 留给昂贵、慢或难以触发的分支；关键支付协议再用 Fake、契约测试或集成测试补回真实度。</span></>}</p>
  </div>;
}
