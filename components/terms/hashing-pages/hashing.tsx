"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, CheckCircle, Clock, Code, Database, FileCode, Key, LockKey, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./HashingConcept.module.css";

const labels = ["放入输入", "选函数", "加随机盐", "调成本", "保存记录", "重新计算"];
type Mode = "safe" | "shortcut";

const safeStages = [
  { input: "password", recipe: "准备密码", salt: "—", cost: "—", record: "不保存原文", verdict: "待设计" },
  { input: "password", recipe: "Argon2id", salt: "待生成", cost: "memory-hard", record: "不保存原文", verdict: "可调" },
  { input: "password", recipe: "Argon2id", salt: "salt A · 随机", cost: "memory-hard", record: "salt + hash", verdict: "已分开" },
  { input: "password", recipe: "Argon2id", salt: "salt A · 随机", cost: "m / t / p", record: "salt + hash + params", verdict: "按服务调" },
  { input: "password", recipe: "Argon2id", salt: "salt A · 随机", cost: "m / t / p", record: "salt + hash + params", verdict: "可验证" },
  { input: "candidate", recipe: "取参数重算", salt: "salt A", cost: "同一配置", record: "match / reject", verdict: "PASS" },
] as const;

const shortcutStages = [
  { input: "password", recipe: "准备密码", salt: "—", cost: "—", record: "不保存原文", verdict: "待设计" },
  { input: "password", recipe: "SHA-256", salt: "不加盐", cost: "fixed-fast", record: "digest", verdict: "太快" },
  { input: "password", recipe: "SHA-256", salt: "不加盐", cost: "fixed-fast", record: "same password → same digest", verdict: "可关联" },
  { input: "password", recipe: "SHA-256", salt: "不加盐", cost: "fixed-fast", record: "digest", verdict: "易批量猜" },
  { input: "password", recipe: "SHA-256", salt: "不加盐", cost: "fixed-fast", record: "digest only", verdict: "WEAK" },
  { input: "candidate", recipe: "重新算 SHA-256", salt: "无", cost: "仍然很快", record: "match / reject", verdict: "WEAK" },
] as const;

export function HashingLesson() {
  const scene = useScene(labels.length);
  const [mode, setMode] = useState<Mode>("safe");
  const safe = mode === "safe";
  const current = (safe ? safeStages : shortcutStages)[scene.step];
  const final = scene.step === labels.length - 1;
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const progress = [scene.step >= 1, scene.step >= 2, scene.step >= 3].map(value => value ? 100 : 0);

  return <div ref={scene.ref} className={styles.hashLab} role="region" aria-label="密码哈希工作台：切换安全方案和直接使用快速哈希，观察盐、成本与验证记录">
    <div className={styles.hashLabHeader}><span>同样是“算一串摘要”，存密码的路线不一样</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.hashMode}><span>选择一条保存路线</span><button type="button" aria-pressed={safe} onClick={() => reset(() => setMode("safe"))}>salt + KDF</button><button type="button" aria-pressed={!safe} onClick={() => reset(() => setMode("shortcut"))}>直接 SHA-256</button></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.hashLabGrid}>
      <section className={`${styles.hashLabPanel} ${scene.step >= 0 ? styles.hashActive : ""}`}>
        <div className={styles.hashEyebrow}><FileCode size={16} aria-hidden="true" /><span>输入</span></div>
        <h3>{current.input}</h3>
        <div className={styles.hashLabMeter}><span>进入函数</span><i style={{ "--meter": `${progress[0]}%` } as CSSProperties} /><b>{scene.step >= 1 ? "已进入" : "待处理"}</b></div>
        <small>原文只在计算入口出现，数据库记录不该把它带走。</small>
      </section>
      <section className={`${styles.hashLabPanel} ${scene.step >= 1 ? styles.hashActive : ""}`}>
        <div className={styles.hashEyebrow}><Key size={16} aria-hidden="true" /><span>函数与参数</span></div>
        <h3>{current.recipe}</h3>
        <div className={styles.hashLabMeter}><span>盐</span><i style={{ "--meter": `${progress[1]}%` } as CSSProperties} /><b>{current.salt}</b></div>
        <div className={styles.hashLabMeter}><span>成本</span><i style={{ "--meter": `${progress[2]}%` } as CSSProperties} /><b>{current.cost}</b></div>
        <small>{safe ? "盐和成本写入版本化参数，下一次验证照着重算。" : "快速函数让攻击者也能用同样的速度批量试候选。"}</small>
      </section>
      <section className={`${styles.hashLabPanel} ${scene.step >= 4 ? styles.hashActive : ""} ${final && safe ? styles.hashGoodPanel : ""} ${final && !safe ? styles.hashDangerPanel : ""}`}>
        <div className={styles.hashEyebrow}><Database size={16} aria-hidden="true" /><span>保存与验证</span></div>
        <h3>{current.record}</h3>
        <div className={styles.hashVerifyRows}><div><span>保存原文</span><b>never</b></div><div><span>重新计算</span><b>{scene.step >= 5 ? "done" : "待做"}</b></div><div><span>结论</span><b>{current.verdict}</b></div></div>
        <div className={styles.hashLabVerdict}>{!final ? "等待下一步" : safe ? "PASS · 可验证" : "WEAK · 易批量猜"}</div>
        <small>{!final ? "先把算法、盐和成本放进同一张记录。" : safe ? "服务能验证密码，却不必拿回密码原文。" : "能验证不代表保存方案抗离线猜测。"}</small>
      </section>
    </div>
    <div className={styles.hashLabRail}><div data-on={scene.step >= 0}><FileCode size={15} aria-hidden="true" /><span>输入</span></div><div data-on={scene.step >= 1}><Code size={15} aria-hidden="true" /><span>选函数</span></div><div data-on={scene.step >= 2}><LockKey size={15} aria-hidden="true" /><span>加盐</span></div><div data-on={scene.step >= 3}><Clock size={15} aria-hidden="true" /><span>调成本</span></div><div data-on={scene.step >= 4} data-danger={final && !safe}><Database size={15} aria-hidden="true" /><span>留记录</span></div><div data-on={scene.step >= 5} data-danger={final && !safe}><CheckCircle size={15} aria-hidden="true" /><span>重算</span></div></div>
    <p className={`${styles.hashLabNote} ${final && !safe ? styles.hashLabDanger : ""}`} role="status">{!final ? <><ArrowCounterClockwise size={17} aria-hidden="true" /><span>哈希不是把秘密“锁起来”，而是留下可重新计算的结果；密码场景还要控制每次猜测的成本。</span></> : safe ? <><CheckCircle size={17} aria-hidden="true" /><span>盐让保存值分开，成本让离线猜测变贵，验证只比较重算结果。</span></> : <><WarningCircle size={17} aria-hidden="true" /><span>直接 SHA-256 可以算对，但太快、无盐、可批量猜，不能当密码存储方案。</span></>}</p>
  </div>;
}
