"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Code, Database, Gear, Handshake, ListMagnifyingGlass, Robot, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./MockConcept.module.css";

const steps = [
  { label: "隔离支付", title: "先把真实支付平台请出单测", detail: "结账只看 PaymentGateway；网络、手续费和真实扣款留在更大范围的测试。", Icon: Handshake },
  { label: "控制回执", title: "替身给出一条可复现的结果", detail: "Mock 返回 declined，代码可以稳定走到拒绝分支，不必真的刷卡。", Icon: Robot },
  { label: "留下调用", title: "它还记得被怎样调用", detail: "调用日志记录 charge(amount, key)；这能检查交互，也会带来耦合。", Icon: ListMagnifyingGlass },
  { label: "发生重构", title: "支付实现拆成两步", detail: "authorize → capture，订单对外仍然是 paid。", Icon: Gear },
  { label: "看清边界", title: "业务通过，不代表旧 Mock 仍该通过", detail: "如果断言锁的是 charge 一次，红色失败报告的是旧调用名，不一定是业务缺陷。", Icon: ShieldWarning },
];

type Oracle = "behavior" | "interaction";
type DoubleKind = "mock" | "fake";

export function MockHero() {
  const scene = useScene(steps.length);
  const [oracle, setOracle] = useState<Oracle>("behavior");
  const [doubleKind, setDoubleKind] = useState<DoubleKind>("mock");
  const current = steps[scene.step];
  const final = scene.step === steps.length - 1;
  const stale = final && oracle === "interaction" && doubleKind === "mock";
  const unsupported = final && oracle === "interaction" && doubleKind === "fake";
  const highFidelity = doubleKind === "fake";
  const setMode = (next: () => void) => { next(); scene.seek(0); };
  const resultTitle = !final ? "等待结论" : stale ? "旧交互失配" : unsupported ? "没有交互证据" : "行为仍成立";
  const resultCode = !final ? "—" : stale ? "FAIL · charge ×0" : unsupported ? "N/A · no call log" : "PASS · order=paid";

  return <figure ref={scene.ref} className={styles.mockHero} data-step={scene.step} data-stale={stale} data-double={doubleKind} aria-label="模拟对象如何隔离支付依赖并区分业务行为与调用细节">
    <div className={styles.mockHeroHeader}><span>同一次支付重构，两种测试为什么给出不同信号</span><strong>isolate → observe → refactor</strong></div>
    <div className={styles.mockHeroControls} role="group" aria-label="选择测试观察方式和替身类型"><div><span>测试看什么</span><button type="button" className={styles.mockChoice} aria-pressed={oracle === "behavior"} onClick={() => setMode(() => setOracle("behavior"))}>最终业务结果</button><button type="button" className={styles.mockChoice} aria-pressed={oracle === "interaction"} onClick={() => setMode(() => setOracle("interaction"))}>调用细节</button></div><div><span>依赖替身</span><button type="button" className={styles.mockChoice} aria-pressed={doubleKind === "mock"} onClick={() => setMode(() => setDoubleKind("mock"))}>Mock · 记调用</button><button type="button" className={styles.mockChoice} aria-pressed={doubleKind === "fake"} onClick={() => setMode(() => setDoubleKind("fake"))}>Fake · 跑契约</button></div></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.mockHeroRail} aria-label="模拟对象演示步骤">{steps.map((step, index) => <div key={step.label} className={styles.mockHeroStop} data-active={scene.step === index} data-done={scene.step > index}><span><step.Icon aria-hidden="true" /></span><strong>{step.label}</strong></div>)}</div>
    <div className={styles.mockHeroBoard}>
      <div className={styles.mockHeroCard} data-active={scene.step <= 1} data-done={scene.step > 1}>
        <div className={styles.mockHeroLabel}><Code size={17} aria-hidden="true" /><span>被测对象</span></div>
        <h3>Checkout</h3>
        <code>pay(order, card)</code>
        <p>{scene.step < 1 ? "真实支付还在系统边界外。" : scene.step < 4 ? "只关心支付结果怎样改变订单。" : "重构后仍要输出同一个业务结果。"}</p>
      </div>
      <div className={styles.mockHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.mockHeroCard} data-active={scene.step >= 0 && scene.step <= 2} data-done={scene.step > 2}>
        <div className={styles.mockHeroLabel}><Robot size={17} aria-hidden="true" /><span>{doubleKind === "mock" ? "Mock" : "Fake"} · 替身</span></div>
        <h3>{doubleKind === "mock" ? "Payment Mock" : "Payment Fake"}</h3>
        <div className={styles.mockHeroFacts}><span>回执 <strong>{scene.step >= 1 ? "declined / paid" : "waiting"}</strong></span><span>{doubleKind === "mock" ? "调用" : "契约"} <strong>{scene.step >= 2 ? (doubleKind === "mock" ? "已记录" : "已执行") : "—"}</strong></span></div>
        <p>{doubleKind === "mock" ? "控制返回值，也留下调用日志。" : "用轻量实现走过支付协议的关键行为。"}</p>
      </div>
      <div className={styles.mockHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.mockHeroCard} data-active={scene.step === 2 || scene.step === 3} data-done={scene.step > 3}>
        <div className={styles.mockHeroLabel}><Gear size={17} aria-hidden="true" /><span>内部实现</span></div>
        <h3>{scene.step >= 3 ? "authorize → capture" : "charge()"}</h3>
        <code>{scene.step >= 3 ? "2 calls · same outcome" : "1 call · old shape"}</code>
        <p>{scene.step < 3 ? "旧测试把调用形状写进了期待。" : "实现拆开了，外部订单结果没有变。"}</p>
      </div>
      <div className={styles.mockHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.mockHeroCard} data-active={scene.step >= 4} data-danger={stale} data-incomplete={unsupported}>
        <div className={styles.mockHeroLabel}>{stale || unsupported ? <WarningCircle size={17} aria-hidden="true" /> : final ? <CheckCircle size={17} aria-hidden="true" /> : <Database size={17} aria-hidden="true" />}<span>测试信号</span></div>
        <h3>{resultTitle}</h3>
        <div className={styles.mockHeroResult}><span>{oracle === "behavior" ? "order" : "expect"}</span><strong>{resultCode}</strong></div>
        <p>{stale ? "Mock 报告 charge 没有发生；先确认它是不是业务契约。" : unsupported ? "Fake 走的是支付契约，不会留下 Mock 的调用期待；要验 charge×1，请换 Mock。" : final ? (highFidelity ? "Fake 走过更接近真实的支付契约。" : "受控依赖让分支快而稳定。") : "等待重构后的判定。"}</p>
      </div>
    </div>
    <div className={styles.mockHeroMetrics}><div><span>网络请求</span><strong>{doubleKind === "mock" ? "0 次" : "本地 fake"}</strong></div><div><span>锁定对象</span><strong>{unsupported ? "无交互回执" : oracle === "behavior" ? "业务结果" : "调用形状"}</strong></div><div><span>结论</span><strong>{resultCode}</strong></div></div>
    <div className={styles.mockHeroStatus} data-danger={stale} data-incomplete={unsupported} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {stale ? "实现变了，旧交互断言先红；它没有直接证明订单行为坏了。" : unsupported ? "Fake 已完成支付契约，但没有可供 charge×1 对照的 Mock 调用记录。" : current.detail}</span></div>
    <figcaption>Mock 是一块可编程的替身：它能让慢、贵或难以触发的依赖变得可控，也会让测试更容易把实现细节误当成行为契约。</figcaption>
  </figure>;
}
