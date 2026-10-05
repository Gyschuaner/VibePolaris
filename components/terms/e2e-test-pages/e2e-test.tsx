"use client";

import { useState } from "react";
import { Browser, CheckCircle, Database, EnvelopeSimple, Eye, Globe, LockSimple, Timer, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./E2eTestConcept.module.css";

const labels = ["隔离数据", "完成操作", "等待落地", "做出判定"];
type AssertionMode = "journey" | "page";
type WaitMode = "web" | "sleep";
type MailMode = "delivered" | "missing";

export function E2eTestLesson() {
  const scene = useScene(labels.length);
  const [assertionMode, setAssertionMode] = useState<AssertionMode>("journey");
  const [waitMode, setWaitMode] = useState<WaitMode>("web");
  const [mailMode, setMailMode] = useState<MailMode>("delivered");
  const final = scene.step === labels.length - 1;
  const pageLooksGood = final;
  const missingMail = mailMode === "missing";
  const pageOnly = assertionMode === "page";
  const fixedWait = waitMode === "web";
  const passed = final && !missingMail && !pageOnly && fixedWait;
  const reset = (next: () => void) => { next(); scene.seek(0); };

  return <div ref={scene.ref} className={styles.e2eLab} role="region" aria-label="端到端测试的隔离、操作、等待和跨层判定工作台">
    <div className={styles.e2eLabHeader}><span>换一个等待方式或最终证据，看看“页面成功”会不会骗人</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.e2eLabControls} role="group" aria-label="选择端到端测试条件">
      <div className={styles.e2eLabControl}><span>最终断言</span><div className={styles.e2eLabChoices}><button type="button" className={styles.e2eLabButton} aria-pressed={!pageOnly} onClick={() => reset(() => setAssertionMode("journey"))}>跨层不变量</button><button type="button" className={styles.e2eLabButton} aria-pressed={pageOnly} onClick={() => reset(() => setAssertionMode("page"))}>只看页面</button></div></div>
      <div className={styles.e2eLabControl}><span>等待方式</span><div className={styles.e2eLabChoices}><button type="button" className={styles.e2eLabButton} aria-pressed={fixedWait} onClick={() => reset(() => setWaitMode("web"))}>等待可见状态</button><button type="button" className={styles.e2eLabButton} aria-pressed={!fixedWait} onClick={() => reset(() => setWaitMode("sleep"))}>固定 sleep</button></div></div>
      <div className={styles.e2eLabControl}><span>邮件回执</span><div className={styles.e2eLabChoices}><button type="button" className={styles.e2eLabButton} aria-pressed={!missingMail} onClick={() => reset(() => setMailMode("delivered"))}>收到 1 封</button><button type="button" className={styles.e2eLabButton} aria-pressed={missingMail} onClick={() => reset(() => setMailMode("missing"))}>邮件丢失</button></div></div>
    </div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.e2eLabGrid}>
      <div className={styles.e2eLabPanel} data-active={scene.step === 0} data-soft="true">
        <div className={styles.e2eHeroLabel}><Browser size={16} aria-hidden="true" /><span>Arrange · 隔离</span></div>
        <h3>u-42 的新旅程</h3>
        <div className={styles.e2eLabValue}><span>数据库</span><strong>orders = 0</strong></div>
        <small>独立会话、独立数据和已知起点，避免上一个测试的 Cookie 或订单串进来。</small>
      </div>
      <div className={styles.e2eLabPanel} data-active={scene.step === 1}>
        <div className={styles.e2eHeroLabel}><Eye size={16} aria-hidden="true" /><span>Act · 用户操作</span></div>
        <h3>确认订单</h3>
        <div className={styles.e2eLabValue}><span>定位</span><strong>role=button</strong></div>
        <small>{scene.step < 1 ? "尚未点击" : "点击可见按钮，前端发出 POST /orders"}</small>
      </div>
      <div className={styles.e2eLabPanel} data-active={scene.step === 2} data-danger={scene.step === 2 && !fixedWait}>
        <div className={styles.e2eHeroLabel}>{fixedWait ? <Database size={16} aria-hidden="true" /> : <Timer size={16} aria-hidden="true" />}<span>Observe · 等待系统</span></div>
        <h3>{fixedWait ? "等到状态真的出现" : "只睡 1000ms"}</h3>
        <div className={styles.e2eLabValue}><span>UI / DB</span><strong>{scene.step < 2 ? "— / —" : "paid / paid"}</strong></div>
        <small>{fixedWait ? "web-first assertion 会等可见状态，回调慢一点也不会抢跑。" : "回调晚于 1 秒时，测试会在事实到达前下结论。"}</small>
      </div>
      <div className={styles.e2eLabPanel} data-active={scene.step === 3} data-danger={final && !passed} data-green={passed}>
        <div className={styles.e2eHeroLabel}>{passed ? <CheckCircle size={16} aria-hidden="true" /> : final ? <WarningCircle size={16} aria-hidden="true" /> : <LockSimple size={16} aria-hidden="true" />}<span>Assert · 跨层判定</span></div>
        <h3>{!final ? "等待最终事实" : passed ? "PASS · 旅程完整" : pageOnly ? "假通过 · 只看页面" : missingMail ? "FAIL · 邮件缺失" : "FLAKY · 等待过早"}</h3>
        <div className={styles.e2eLabValue}><span>{pageOnly ? "页面" : "UI / DB / mail"}</span><strong>{!final ? "—" : pageOnly ? "paid" : passed ? "paid / paid / 1" : missingMail ? "paid / paid / 0" : "paid / ? / ?"}</strong></div>
        <small>{!final ? "先走完用户旅程，再把结果放在同一张验收单上。" : passed ? "关键不变量都成立，可以交付这条旅程。" : pageOnly ? "截图亮了，但数据库或邮件仍可能没有发生。" : missingMail ? "页面和数据库都对，邮件这个用户结果没有对上。" : "固定等待不是事实；应等待可观察状态。"}</small>
      </div>
    </div>
    <div className={styles.e2eLabMetrics}><div><span>当前路径</span><strong>{scene.step < 2 ? "浏览器 → API" : "浏览器 → API → DB"}</strong></div><div><span>可见结果</span><strong>{pageLooksGood ? "paid" : "pending"}</strong></div><div><span>测试结论</span><strong>{!final ? "未完成" : passed ? "可交付" : "需定位"}</strong></div></div>
    <p className={styles.e2eLabNote} data-danger={final && !passed} role="status">{!final ? <><Globe size={17} aria-hidden="true" /><span>端到端测试把真实用户动作当作起点，把跨层状态当作终点；每一步都要留下能被下一步读取的事实。</span></> : passed ? <><CheckCircle size={17} aria-hidden="true" /><span>浏览器、服务端、数据库和邮件都对上了。少量关键旅程值得承担这层成本，因为它回答的是“用户真的能完成吗”。</span></> : pageOnly ? <><WarningCircle size={17} aria-hidden="true" /><span>页面上的 paid 只是一个观察点。把断言扩成跨层不变量，才能抓住 UI 与系统事实脱节的失败。</span></> : missingMail ? <><EnvelopeSimple size={17} aria-hidden="true" /><span>订单已经 paid，但确认邮件没有出现；E2E 应停在第一个被破坏的不变量，而不是继续截图。</span></> : <><Timer size={17} aria-hidden="true" /><span>固定 sleep 只是在猜时间。使用自动等待和用户可见状态，让测试等待事实而不是等待运气。</span></>}</p>
  </div>;
}
