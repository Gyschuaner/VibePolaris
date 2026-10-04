"use client";

import { ArrowRight, Browser, CalendarBlank, CheckCircle, Code, Database, Funnel, Key, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./InputValidationConcept.module.css";

const steps = [
  { label: "表单先放行", title: "浏览器的绿灯只是提醒", detail: "请求可以绕过页面，真正的输入边界在服务器。" },
  { label: "解析结构", title: "先把字节读成可检查的字段", detail: "请求大小和 JSON 结构先过关，未知字段不会悄悄混进业务对象。" },
  { label: "检查语义", title: "日期格式对了，顺序仍然可能错", detail: "结束日早于开始日，查询还没执行就停在 422。" },
  { label: "固定入口", title: "排序字段只能从允许列表挑", detail: "createdAt 映射成代码里的 created_at，用户值不会变成 SQL 片段。" },
  { label: "检查归属", title: "合法账号也不代表你能看", detail: "acct-lee 的格式没有问题，但阿青没有它的访问关系。" },
  { label: "交付结果", title: "自己的账号才拿到账单", detail: "通过校验和授权后，查询才返回 12 行可排序的账单。" },
];

function requestState(step: number) {
  if (step === 0) return { end: "2026-10-04", owner: "acct-lee", sort: "createdAt" };
  if (step === 1) return { end: "2026-10-04", owner: "acct-lee", sort: "createdAt" };
  if (step === 2) return { end: "早于 startAt", owner: "acct-lee", sort: "createdAt" };
  if (step === 3) return { end: "2026-10-06", owner: "acct-lee", sort: "createdAt" };
  if (step === 4) return { end: "2026-10-06", owner: "acct-lee", sort: "createdAt" };
  return { end: "2026-10-06", owner: "acct-ash", sort: "createdAt" };
}

function resultState(step: number) {
  if (step === 0) return { code: "WAITING", value: "尚未到服务端", tone: "" };
  if (step === 1) return { code: "SCHEMA ✓", value: "字段可解释", tone: "good" };
  if (step === 2) return { code: "422", value: "日期关系不成立", tone: "danger" };
  if (step === 3) return { code: "QUERY SAFE", value: "created_at · 参数化值", tone: "good" };
  if (step === 4) return { code: "403", value: "owner mismatch", tone: "danger" };
  return { code: "200", value: "12 rows · query ran", tone: "good" };
}

export function InputValidationHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const request = requestState(scene.step);
  const result = resultState(scene.step);
  const complete = scene.step === steps.length - 1;
  const blocked = scene.step === 2 || scene.step === 4;

  return <figure ref={scene.ref} className={styles.ivHero} data-step={scene.step} aria-label="输入校验怎样把账单请求依次送过结构、语义、查询和授权边界">
    <div className={styles.ivHeroHeader}><span>一份账单请求的四道门</span><strong>parse → meaning → query → owner</strong></div>
    <SceneControls scene={scene} labels={steps.map((step) => step.label)} />
    <div className={styles.ivHeroCanvas}>
      <section className={`${styles.ivRequest} ${scene.step <= 1 ? styles.ivActive : ""}`}>
        <div className={styles.ivEyebrow}><Browser size={17} aria-hidden="true" /><span>外部请求 · GET /billing</span></div>
        <h3>阿青要看一段账单</h3>
        <div className={styles.ivRequestRows}><span>startAt</span><b>2026-10-05</b><span>endAt</span><b className={scene.step === 2 ? styles.ivDangerText : ""}>{request.end}</b><span>accountId</span><b>{request.owner}</b><span>sort</span><b>{request.sort}</b></div>
        <div className={styles.ivBrowserHint}><CheckCircle size={15} aria-hidden="true" /><span>{scene.step === 0 ? "前端提示：格式看起来没问题" : "直接发请求也能到这里"}</span></div>
        <small>输入来自网络，页面上的限制不是信任边界。</small>
      </section>

      <div className={styles.ivHeroFlow} aria-hidden="true"><ArrowRight size={22} /><span>server</span></div>

      <section className={styles.ivGates}>
        <div className={`${styles.ivGate} ${scene.step >= 1 ? styles.ivDone : ""} ${scene.step === 1 ? styles.ivActive : ""}`}><span className={styles.ivGateNumber}>01</span><div><strong><Code size={15} aria-hidden="true" />结构</strong><small>类型、必填、大小</small></div><b>{scene.step >= 1 ? "pass" : "wait"}</b></div>
        <div className={`${styles.ivGate} ${scene.step >= 3 ? styles.ivDone : ""} ${scene.step === 2 ? styles.ivBlocked : scene.step === 3 ? styles.ivActive : ""}`}><span className={styles.ivGateNumber}>02</span><div><strong><CalendarBlank size={15} aria-hidden="true" />语义</strong><small>endAt ≥ startAt</small></div><b>{scene.step === 2 ? "stop" : scene.step >= 3 ? "pass" : "wait"}</b></div>
        <div className={`${styles.ivGate} ${scene.step >= 3 ? styles.ivDone : ""} ${scene.step === 3 ? styles.ivActive : ""}`}><span className={styles.ivGateNumber}>03</span><div><strong><Funnel size={15} aria-hidden="true" />允许列表</strong><small>createdAt → created_at</small></div><b>{scene.step >= 3 ? "map" : "wait"}</b></div>
        <div className={`${styles.ivGate} ${scene.step >= 5 ? styles.ivDone : ""} ${scene.step === 4 ? styles.ivBlocked : scene.step === 5 ? styles.ivActive : ""}`}><span className={styles.ivGateNumber}>04</span><div><strong><Key size={15} aria-hidden="true" />归属</strong><small>subject owns object</small></div><b>{scene.step === 4 ? "stop" : scene.step >= 5 ? "pass" : "wait"}</b></div>
      </section>

      <div className={styles.ivHeroFlow} aria-hidden="true"><ArrowRight size={22} /><span>evidence</span></div>

      <section className={`${styles.ivResult} ${result.tone === "danger" ? styles.ivResultDanger : result.tone === "good" ? styles.ivResultGood : ""}`}>
        <div className={styles.ivEyebrow}>{blocked ? <WarningCircle size={17} aria-hidden="true" /> : complete ? <CheckCircle size={17} aria-hidden="true" /> : <Database size={17} aria-hidden="true" />}<span>服务端结论</span></div>
        <strong>{result.code}</strong>
        <code>{result.value}</code>
        <div className={styles.ivResultRows}><span>查询</span><b>{scene.step === 2 || scene.step === 4 ? "0 次" : scene.step >= 3 ? "1 次" : "未开始"}</b><span>明文 SQL</span><b>{scene.step >= 3 ? "没有" : "—"}</b></div>
        <small>{blocked ? "失败在业务动作前留下清楚的原因。" : complete ? "校验和授权都通过，结果才进入调用方。" : "结果要等前面的门真的通过。"}</small>
      </section>
    </div>
    <div className={styles.ivHeroMetrics}><div><span>结构</span><strong>{scene.step >= 1 ? "可解释" : "待解析"}</strong></div><div><span>语义</span><strong>{scene.step === 2 ? "不成立" : scene.step >= 3 ? "成立" : "待检查"}</strong></div><div><span>查询入口</span><strong>{scene.step >= 3 ? "固定映射" : "未开放"}</strong></div><div><span>资源归属</span><strong>{scene.step === 4 ? "拒绝" : scene.step >= 5 ? "允许" : "待核对"}</strong></div></div>
    <div className={`${styles.ivHeroStatus} ${result.tone === "danger" ? styles.ivStatusDanger : result.tone === "good" ? styles.ivStatusGood : ""}`} role="status"><span>{blocked ? <WarningCircle size={19} aria-hidden="true" /> : complete ? <ShieldCheck size={19} aria-hidden="true" /> : <Database size={19} aria-hidden="true" />}</span><strong>{current.title}</strong><span>· {current.detail}</span></div>
    <figcaption>校验先回答“这份数据能不能被安全解释”，授权再回答“这个人能不能看这份数据”。</figcaption>
  </figure>;
}
