"use client";

import { useState } from "react";
import { ArrowRight, Browser, CheckCircle, Database, EnvelopeSimple, Eye, Globe, Package, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./E2eTestConcept.module.css";

const steps = [
  { label: "隔离旅程", title: "从一张干净的订单桌开始", detail: "新用户 u-42、空数据库和独立会话，先把上一次测试留下的东西关在门外。", Icon: Browser },
  { label: "真实点击", title: "让用户入口发出第一步", detail: "用可见的‘确认订单’按钮发起真实请求，不直接跳进内部函数。", Icon: Eye },
  { label: "留下 pending", title: "服务端先记住这笔订单", detail: "POST /orders 返回 201，数据库保存 id=42 · pending。", Icon: Database },
  { label: "付款回调", title: "外部事件把状态往前推", detail: "带有效签名的 payment.paid 到达 API，订单转成 paid。", Icon: Globe },
  { label: "用户看到结果", title: "页面、数据库和邮件同时落地", detail: "UI 显示 paid，数据库是 paid，邮件沙箱收到 1 封确认信。", Icon: EnvelopeSimple },
  { label: "跨层验收", title: "第一个不变量破坏就停下", detail: "页面亮绿灯不够；少了邮件或数据库状态不对，旅程必须判失败。", Icon: CheckCircle },
];

type Outcome = "complete" | "mail-lost";

export function E2eTestHero() {
  const scene = useScene(steps.length);
  const [outcome, setOutcome] = useState<Outcome>("complete");
  const current = steps[scene.step];
  const mailDelivered = outcome === "complete" && scene.step >= 4;
  const final = scene.step === steps.length - 1;
  const failed = final && outcome === "mail-lost";
  const currentDetail = scene.step === 4 && outcome === "mail-lost" ? "页面已经 paid，但邮件沙箱仍是 0 封；验收要停在这个不变量。" : current.detail;

  return <figure ref={scene.ref} className={styles.e2eHero} data-step={scene.step} aria-label="端到端测试如何从浏览器入口走过订单、数据库、付款回调和邮件结果">
    <div className={styles.e2eHeroHeader}><span>一条订单旅程怎样留下跨层验收证据</span><strong>browser → system → invariant</strong></div>
    <div className={styles.e2eHeroControls} role="group" aria-label="选择端到端结果"><button type="button" className={styles.e2eLabButton} aria-pressed={outcome === "complete"} onClick={() => { setOutcome("complete"); scene.seek(0); }}>完整旅程</button><button type="button" className={styles.e2eLabButton} aria-pressed={outcome === "mail-lost"} onClick={() => { setOutcome("mail-lost"); scene.seek(0); }}>丢失邮件</button></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.e2eHeroRail} aria-label="订单旅程节点">{steps.map((step, index) => <div key={step.label} className={styles.e2eHeroStop} data-active={scene.step === index} data-done={scene.step > index}><span><step.Icon aria-hidden="true" /></span><strong>{step.label}</strong></div>)}</div>
    <div className={styles.e2eHeroScene}>
      <div className={styles.e2eHeroCard} data-active={scene.step <= 1} data-done={scene.step > 1}>
        <div className={styles.e2eHeroLabel}><Browser size={17} aria-hidden="true" /><span>用户入口 · 浏览器</span></div>
        <h3>订单页</h3>
        <code>getByRole("button", &#123; name: "确认订单" &#125;)</code>
        <p>{scene.step === 0 ? "storageState: fresh · user: u-42" : scene.step === 1 ? "click → POST /orders" : "输入和点击已经发生"}</p>
        <div className={styles.e2eHeroMeta}><span>页面状态</span><strong>{scene.step >= 4 ? "paid" : scene.step >= 1 ? "pending" : "ready"}</strong></div>
      </div>
      <div className={styles.e2eHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.e2eHeroCard} data-active={scene.step >= 2 && scene.step <= 3} data-done={scene.step > 3}>
        <div className={styles.e2eHeroLabel}><Package size={17} aria-hidden="true" /><span>系统现场 · API + 数据库</span></div>
        <h3>订单 #42</h3>
        <code>{scene.step < 2 ? "等待请求" : scene.step < 3 ? "201 · pending" : "201 · paid"}</code>
        <p>{scene.step < 2 ? "还没有跨过应用边界" : scene.step === 2 ? "DB: status=pending" : "payment.paid → DB: status=paid"}</p>
        <div className={styles.e2eHeroMeta}><span>外部回调</span><strong>{scene.step >= 3 ? "签名有效" : "waiting"}</strong></div>
      </div>
      <div className={styles.e2eHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.e2eHeroCard} data-active={scene.step >= 4} data-danger={failed}>
        <div className={styles.e2eHeroLabel}>{failed ? <WarningCircle size={17} aria-hidden="true" /> : <CheckCircle size={17} aria-hidden="true" />}<span>验收证据</span></div>
        <h3>{failed ? "首个不变量被破坏" : final ? "完整旅程通过" : "等待最终观察"}</h3>
        <div className={styles.e2eHeroMeta}><span>UI / DB</span><strong>{scene.step >= 4 ? "paid / paid" : "— / —"}</strong></div>
        <div className={styles.e2eHeroMeta}><span>邮件沙箱</span><strong>{scene.step >= 4 ? `${mailDelivered ? "1" : "0"} 封` : "—"}</strong></div>
        <p>{failed ? "页面显示 paid，但确认邮件没有出现，不能把截图当成通过。" : final ? "用户看到的结果和系统留下的事实相互印证。" : "E2E 要等到关键旅程的跨层结果都能观察。"}</p>
      </div>
    </div>
    <div className={styles.e2eHeroEvidence} data-danger={failed} aria-live="polite">
      <div><Eye size={16} aria-hidden="true" /><span><strong>用户可见</strong><code>{scene.step >= 4 ? "订单已支付" : "等待结果"}</code></span></div>
      <div>{failed ? <WarningCircle size={16} aria-hidden="true" /> : <Database size={16} aria-hidden="true" />}<span><strong>{failed ? "失败位置" : "系统事实"}</strong><code>{failed ? "mail=0 · stop" : scene.step >= 4 ? `DB=paid · mail=${mailDelivered ? "1" : "0"}` : "尚未核对"}</code></span></div>
    </div>
    <div className={styles.e2eHeroMetrics}><div><span>测试入口</span><strong>真实浏览器</strong></div><div><span>隔离数据</span><strong>u-42 · order 42</strong></div><div><span>结论</span><strong>{failed ? "FAIL · mail" : final ? "PASS · 3 layers" : "进行中"}</strong></div></div>
    <div className={styles.e2eHeroStatus} data-danger={failed || (scene.step === 4 && outcome === "mail-lost")} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {currentDetail}</span></div>
    <figcaption>端到端测试不是替页面拍一张“成功”截图，而是让一条最重要的用户旅程穿过真实系统，再把用户看见的结果和系统留下的事实放在一起验收。</figcaption>
  </figure>;
}
