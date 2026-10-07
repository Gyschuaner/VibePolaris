"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, CheckCircle, FileText, Lightning, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";

import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import { getFallbackRelayState, relayBackupLabels, relayPrimaryLabels, type RelayBackup, type RelayPrimary } from "@/lib/model-fallback-demo";
import styles from "../ai-stack-pages/model-fallback.module.css";

const labels = ["主调用", "看回执", "开策略扣", "交给备用", "核对字段", "留痕停步"];

function RelayBand({ state, compact = false }: { state: ReturnType<typeof getFallbackRelayState>; compact?: boolean }) {
  const shortLabels = ["主", "闸", "备", "验", "记"];
  return <div className={styles.bandTrack} data-status={state.status} style={{ "--token-pos": `${state.tokenPosition}%` } as CSSProperties} aria-label="接力腕带状态">
    <div className={styles.bandRail} aria-hidden="true" />
    {state.segments.map((segment, index) => <div className={styles.bandSegment} data-state={segment.state} key={segment.id}>
      <span>{compact ? shortLabels[index] : segment.label}</span><small>{compact ? segment.state === "active" ? "当前" : segment.state === "done" ? "已过" : segment.state === "blocked" ? "停" : "锁" : segment.detail}</small>
    </div>)}
    <span className={styles.relayToken} aria-hidden="true"><Lightning size={compact ? 13 : 16} weight="fill" /></span>
  </div>;
}

function Receipt({ title, value, detail, state, compact = false }: { title: string; value: string; detail: string; state: string; compact?: boolean }) {
  const isGood = state === "verified";
  const isBad = state === "stopped";
  return <article className={styles.receipt} data-state={state}>
    <div className={styles.receiptHead}><span>{title}</span>{isGood ? <CheckCircle size={compact ? 14 : 17} aria-label="通过" /> : isBad ? <XCircle size={compact ? 14 : 17} aria-label="停止" /> : <FileText size={compact ? 14 : 17} aria-hidden="true" />}</div>
    <strong>{value}</strong><small>{detail}</small>
  </article>;
}

function RelayDesk({ state, compact = false }: { state: ReturnType<typeof getFallbackRelayState>; compact?: boolean }) {
  return <div className={`${styles.desk} ${compact ? styles.heroDesk : styles.lessonDesk}`} data-status={state.status} data-step={state.step}>
    <div className={styles.deskHeader}><span><ShieldCheck size={compact ? 14 : 17} aria-hidden="true" />接力腕带 · BOUNDED FALLBACK</span><code>MAX {state.limit} CALLS</code></div>
    <RelayBand state={state} compact={compact} />
    <div className={styles.receipts}>
      <Receipt title="主回执" value={state.primaryReceipt} detail={relayPrimaryLabels[state.primary]} state={state.step >= 1 ? state.status : "idle"} compact={compact} />
      <Receipt title="备用回执" value={state.step >= 3 && state.policyAllowed ? state.backupReceipt : "未到达"} detail={state.step >= 3 && state.policyAllowed ? relayBackupLabels[state.backup] : state.policyLabel} state={state.status} compact={compact} />
    </div>
    <div className={styles.relayStatus} data-status={state.status} role="status" aria-live="polite">
      {state.status === "verified" ? <CheckCircle size={compact ? 15 : 18} aria-hidden="true" /> : state.status === "stopped" ? <WarningCircle size={compact ? 15 : 18} aria-hidden="true" /> : <Lightning size={compact ? 15 : 18} aria-hidden="true" />}
      <div><strong>{state.statusLabel}</strong><span>{state.statusDetail}</span></div>
    </div>
  </div>;
}

const heroNotes = [
  "主调用先扣上腕带；备用还没有拿到请求。",
  "429 是回执，不是自动换模型的命令；先把真实错误留下。",
  "策略扣检查错误类型、能力和总尝试上限，决定是否能交接。",
  "条件允许时，备用腕带接住同一任务；这仍算第二次调用。",
  "备用回了 JSON 还不够，amount 字段要单独核对。",
  "最后把 fallback=429 和两次尝试扣进记录，结果才可追踪。",
];

export function ModelFallbackHero() {
  const scene = useScene(labels.length);
  const state = getFallbackRelayState(scene.step, "rate", "valid", 2);
  return <figure ref={scene.ref} className={styles.hero} data-step={scene.step} aria-label="接力腕带展示备用模型如何在错误和策略允许时接管">
    <div className={styles.heroTop}><span>接力腕带 · MODEL FALLBACK</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <RelayDesk state={state} compact />
    <figcaption role="status" aria-live="polite">{heroNotes[scene.step]}</figcaption>
  </figure>;
}

export function ModelFallbackLesson() {
  const scene = useScene(labels.length);
  const [primary, setPrimary] = useState<RelayPrimary>("rate");
  const [backup, setBackup] = useState<RelayBackup>("valid");
  const [limit, setLimit] = useState<1 | 2>(2);
  useResetOnSceneStart(scene, () => { setPrimary("rate"); setBackup("valid"); setLimit(2); });
  const state = getFallbackRelayState(scene.step, primary, backup, limit);

  function choosePrimary(next: RelayPrimary) { setPrimary(next); scene.seek(1); }
  function chooseBackup(next: RelayBackup) { setBackup(next); scene.seek(2); }
  function chooseLimit(next: 1 | 2) { setLimit(next); scene.seek(next === 1 ? 2 : 3); }

  return <div className={styles.lab} ref={scene.ref} data-step={scene.step} role="region" aria-label="备用模型接力腕带演示">
    <div className={styles.labTop}><span>RELAY BAND / BOUNDED HANDOFF</span><strong>先核对，再交接</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.controls} role="group" aria-label="改变备用策略条件">
      <div className={styles.controlGroup} aria-label="主调用情境">{(Object.entries(relayPrimaryLabels) as Array<[RelayPrimary, string]>).map(([value, label]) => <button type="button" aria-pressed={primary === value} onClick={() => choosePrimary(value)} key={value}>{label}</button>)}</div>
      <div className={styles.controlGroup} aria-label="备用能力">{(Object.entries(relayBackupLabels) as Array<[RelayBackup, string]>).map(([value, label]) => <button type="button" aria-pressed={backup === value} onClick={() => chooseBackup(value)} key={value}>{label}</button>)}</div>
      <div className={styles.controlGroup} aria-label="总尝试上限"><button type="button" aria-pressed={limit === 1} onClick={() => chooseLimit(1)}>只允许 1 次</button><button type="button" aria-pressed={limit === 2} onClick={() => chooseLimit(2)}>允许 2 次</button></div>
      <button type="button" className={styles.reset} onClick={() => { setPrimary("rate"); setBackup("valid"); setLimit(2); scene.seek(0); }}><ArrowCounterClockwise size={15} aria-hidden="true" />重置</button>
    </div>
    <RelayDesk state={state} />
    <p className={styles.status} data-status={state.status} role="status" aria-live="polite">{state.statusDetail}</p>
  </div>;
}
