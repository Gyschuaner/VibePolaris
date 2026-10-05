"use client";

import { useState } from "react";
import { ArrowCounterClockwise, CalendarBlank, CheckCircle, Code, Database, Funnel, Key, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./InputValidationConcept.module.css";

const labels = ["收到请求", "解析结构", "检查语义", "固定入口", "核对归属", "交付结果"];
type Standard = "shape" | "complete";

const stages = [
  { request: "JSON · 4 fields", structure: "待解析", meaning: "待检查", route: "未开放", owner: "未检查", result: "WAITING" },
  { request: "object · known fields", structure: "type ✓ · required ✓", meaning: "待检查", route: "未开放", owner: "未检查", result: "SCHEMA PASS" },
  { request: "endAt < startAt", structure: "已通过", meaning: "不成立", route: "未开放", owner: "未检查", result: "422 · 0 query" },
  { request: "sort = createdAt", structure: "已通过", meaning: "已通过", route: "createdAt → created_at", owner: "待检查", result: "QUERY READY" },
  { request: "accountId = acct-lee", structure: "UUID ✓", meaning: "已通过", route: "固定映射", owner: "owner ≠ subject", result: "403 · 0 query" },
  { request: "accountId = acct-ash", structure: "UUID ✓", meaning: "已通过", route: "固定映射", owner: "owner = subject", result: "200 · 12 rows" },
] as const;

export function InputValidationLesson() {
  const scene = useScene(labels.length);
  const [standard, setStandard] = useState<Standard>("shape");
  const current = stages[scene.step];
  const final = scene.step === labels.length - 1;
  const pass = final && standard === "complete";
  const weak = final && standard === "shape";
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const displayedResult = weak ? "200 · 未查归属" : current.result;

  return <div ref={scene.ref} className={styles.ivLab} role="region" aria-label="输入校验工作台：切换只看格式或完整边界，查看请求是否真的能到达数据">
    <div className={styles.ivLabHeader}><span>把“合法”拆成几道不同的问题</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.ivLabControls}><span>完成标准</span><button type="button" aria-pressed={standard === "shape"} onClick={() => reset(() => setStandard("shape"))}>只看格式</button><button type="button" aria-pressed={standard === "complete"} onClick={() => reset(() => setStandard("complete"))}>完整边界</button></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.ivLabGrid}>
      <section className={`${styles.ivLabPanel} ${scene.step >= 0 ? styles.ivPanelActive : ""}`}>
        <div className={styles.ivLabEyebrow}><Code size={16} aria-hidden="true" /><span>请求里的值</span></div>
        <h3>{current.request}</h3>
        <div className={styles.ivLabRows}><div><span>结构</span><b>{current.structure}</b></div><div><span>含义</span><b className={scene.step === 2 ? styles.ivBad : ""}>{current.meaning}</b></div><div><span>查询入口</span><b>{current.route}</b></div></div>
        <small>把字符串读成数字或日期，只解决“是什么类型”，还没有回答“能不能这样用”。</small>
      </section>
      <section className={`${styles.ivLabPanel} ${scene.step >= 1 ? styles.ivPanelActive : ""}`}>
        <div className={styles.ivLabEyebrow}><Funnel size={16} aria-hidden="true" /><span>服务端规则</span></div>
        <h3>{scene.step < 2 ? "schema → semantic" : scene.step < 4 ? "semantic → allowlist" : "allowlist → authorization"}</h3>
        <div className={styles.ivLabRows}><div><span>日期关系</span><b className={scene.step === 2 ? styles.ivBad : ""}>{scene.step === 2 ? "end < start" : scene.step >= 3 ? "end ≥ start" : "待查"}</b></div><div><span>排序字段</span><b>{scene.step >= 3 ? "映射后使用" : "不接受原文"}</b></div><div><span>账号归属</span><b className={scene.step === 4 ? styles.ivBad : ""}>{current.owner}</b></div></div>
        <small>规则逐项留下结果，失败时不把半成品交给下一层，也不把权限问题伪装成格式问题。</small>
      </section>
      <section className={`${styles.ivLabPanel} ${scene.step >= 4 ? styles.ivPanelActive : ""} ${weak ? styles.ivPanelDanger : pass ? styles.ivPanelGood : ""}`}>
        <div className={styles.ivLabEyebrow}>{weak || scene.step === 2 || scene.step === 4 ? <WarningCircle size={16} aria-hidden="true" /> : pass ? <CheckCircle size={16} aria-hidden="true" /> : <Database size={16} aria-hidden="true" />}<span>副作用与结论</span></div>
        <h3>{displayedResult}</h3>
        <div className={styles.ivLabRows}><div><span>数据库查询</span><b>{scene.step === 2 || scene.step === 4 ? "0 次" : scene.step >= 5 ? "1 次" : "未到"}</b></div><div><span>授权门</span><b>{weak ? "未查" : scene.step === 4 ? "403" : scene.step >= 5 ? "allow" : "待查"}</b></div><div><span>完成判断</span><b>{!final ? "等待" : weak ? "不充分" : "通过"}</b></div></div>
        <div className={styles.ivLabVerdict}>{!final ? "等待判断" : weak ? "WEAK · 只看格式" : "PASS · 完整边界"}</div>
        <small>{!final ? "先让请求经过每一道真正会改变结果的门。" : weak ? "这一次恰好是自己的账号，但完成标准没有检查归属；换一个账号时，结论仍然没有证据。" : "语法、语义、查询入口和对象归属都留下了证据。"}</small>
      </section>
    </div>
    <div className={styles.ivLabRail}><div data-on={scene.step >= 0}><Code size={15} aria-hidden="true" /><span>收请求</span></div><div data-on={scene.step >= 1}><Funnel size={15} aria-hidden="true" /><span>验结构</span></div><div data-on={scene.step >= 2} data-danger={scene.step === 2}><CalendarBlank size={15} aria-hidden="true" /><span>查语义</span></div><div data-on={scene.step >= 3}><Database size={15} aria-hidden="true" /><span>锁入口</span></div><div data-on={scene.step >= 4} data-danger={scene.step === 4}><Key size={15} aria-hidden="true" /><span>查归属</span></div><div data-on={scene.step >= 5} data-danger={weak}><ShieldWarning size={15} aria-hidden="true" /><span>定结论</span></div></div>
    <p className={`${styles.ivLabNote} ${weak || scene.step === 2 || scene.step === 4 ? styles.ivPanelDanger : ""}`} role="status">{!final ? <><ArrowCounterClockwise size={17} aria-hidden="true" /><span>校验不是一把万能刷子：每一层只回答自己负责的那一个问题。</span></> : weak ? <><WarningCircle size={17} aria-hidden="true" /><span>这次请求碰巧拿到自己的账单，但只看格式没有证明换一个账号时授权会拒绝。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>输入被安全解释、查询入口被固定、对象归属被核对，数据库才收到请求。</span></>}</p>
  </div>;
}
