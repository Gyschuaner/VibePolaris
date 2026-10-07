"use client";

import { useState, type CSSProperties } from "react";
import { Brain, CheckCircle, Compass, FileText, Gauge, WarningCircle, XCircle } from "@phosphor-icons/react";

import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import { getRoutingDialState, routingTaskLabels, routingThresholds, type RoutingCandidate, type RoutingTask, type RoutingThreshold } from "@/lib/model-routing-demo";
import styles from "../ai-stack-pages/model-routing.module.css";

const labels = ["接单", "拨门槛", "拣轻量模型", "拨到复杂任务", "遇到图片", "门槛拦下"];
const heroTasks: RoutingTask[] = ["extract", "extract", "extract", "analysis", "image", "extract"];
const heroThresholds: RoutingThreshold[] = [90, 90, 90, 90, 90, 98];

function CandidateCard({ candidate, compact = false }: { candidate: RoutingCandidate; compact?: boolean }) {
  const ModelIcon = candidate.id === "A" ? Gauge : Brain;
  const stateLabel = candidate.state === "picked" ? "已钉住" : candidate.state === "eligible" ? "可候选" : candidate.state === "unavailable" ? "不可用" : candidate.state === "blocked" ? "排除" : "待比较";
  return <article className={styles.candidate} data-state={candidate.state}>
    <div className={styles.candidateHead}><span className={styles.modelMark}><ModelIcon size={compact ? 14 : 18} aria-hidden="true" /></span><strong>{candidate.id}</strong><span>{stateLabel}</span></div>
    <div className={styles.candidateScore}><span>{candidate.score === null ? "图片能力" : "离线分数"}</span><b>{candidate.score ?? "无"}</b></div>
    <div className={styles.candidateFoot}><small>{candidate.reason}</small><code>{candidate.cost} 单位</code></div>
    {candidate.state === "picked" ? <CheckCircle className={styles.candidateSeal} size={compact ? 16 : 19} aria-label="已选择" /> : candidate.state === "blocked" || candidate.state === "unavailable" ? <XCircle className={styles.candidateSeal} size={compact ? 15 : 18} aria-label="已排除" /> : null}
  </article>;
}

function TriageDial({ state, compact = false }: { state: ReturnType<typeof getRoutingDialState>; compact?: boolean }) {
  return <div className={`${styles.dialDesk} ${compact ? styles.heroDesk : styles.lessonDesk}`} data-status={state.status} data-step={state.step}>
    <div className={styles.deskHeader}><span><Compass size={compact ? 14 : 17} aria-hidden="true" />分诊转盘 · BEFORE CALL</span><code>{state.availableB ? "B READY" : "B OFFLINE"}</code></div>
    <div className={styles.ticket} data-open={state.step > 0}>
      <FileText size={compact ? 17 : 21} aria-hidden="true" />
      <div><span>新工单</span><strong>{state.ticketLabel}</strong><small>{state.ticketDetail}</small></div>
      <code>待调用</code>
    </div>
    <div className={styles.dialRow}>
      <div className={styles.dialWrap}>
        <div className={styles.dial} style={{ "--pointer-angle": `${state.pointer}deg` } as CSSProperties} aria-label={`选择盘：${state.dialLabel}`}>
          <span className={styles.dialTick} data-tick="quality">质量</span><span className={styles.dialTick} data-tick="cost">成本</span><span className={styles.dialTick} data-tick="ability">能力</span>
          <i className={styles.dialNeedle} aria-hidden="true" /><span className={styles.dialHub}><Compass size={compact ? 15 : 19} aria-hidden="true" /></span>
        </div>
        <strong className={styles.dialLabel}>{state.dialLabel}</strong>
      </div>
      <div className={styles.candidates} aria-label="候选模型"><CandidateCard candidate={state.candidates[0]} compact={compact} /><CandidateCard candidate={state.candidates[1]} compact={compact} /></div>
    </div>
    <div className={styles.verdict} data-status={state.status} role="status" aria-live="polite">
      {state.status === "chosen" ? <CheckCircle size={compact ? 16 : 19} aria-hidden="true" /> : state.status === "blocked" ? <WarningCircle size={compact ? 16 : 19} aria-hidden="true" /> : <Gauge size={compact ? 16 : 19} aria-hidden="true" />}
      <div><strong>{state.statusLabel}</strong><span>{state.statusDetail}</span></div>
    </div>
  </div>;
}

const heroNotes = [
  "工单只带着任务特征进来；转盘还没有调用任何模型。",
  "同一把质量门槛先筛候选，再谈费用；分数是离线筛选证据。",
  "提取金额时 A、B 都合格，转盘把更省的 A 钉住。",
  "复杂条款让 A 掉出门槛，转盘把 B 留在承接位。",
  "图片输入不是更贵就一定更好：A 没有这项能力，B 才是候选。",
  "门槛拨到 98 后没有候选；路由应停在调用前，不能偷偷放宽条件。",
];

export function ModelRoutingHero() {
  const scene = useScene(labels.length);
  const state = getRoutingDialState(scene.step, heroTasks[scene.step], heroThresholds[scene.step], scene.step !== 5);
  return <figure ref={scene.ref} className={styles.hero} data-step={scene.step} aria-label="分诊转盘展示模型路由如何在调用前按任务条件选择模型">
    <div className={styles.heroTop}><span>分诊转盘 · MODEL ROUTING</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <TriageDial state={state} compact />
    <figcaption role="status" aria-live="polite">{heroNotes[scene.step]}</figcaption>
  </figure>;
}

export function ModelRoutingLesson() {
  const scene = useScene(labels.length);
  const [task, setTask] = useState<RoutingTask>("extract");
  const [threshold, setThreshold] = useState<RoutingThreshold>(90);
  const [availableB, setAvailableB] = useState(true);
  useResetOnSceneStart(scene, () => { setTask("extract"); setThreshold(90); setAvailableB(true); });
  const state = getRoutingDialState(scene.step, task, threshold, availableB);

  function chooseTask(next: RoutingTask) {
    setTask(next);
    setThreshold(90);
    setAvailableB(true);
    scene.seek(next === "extract" ? 2 : next === "analysis" ? 3 : 4);
  }
  function chooseThreshold(next: RoutingThreshold) {
    setThreshold(next);
    scene.seek(next === 98 ? 5 : 1);
  }
  function toggleAvailability() {
    const next = !availableB;
    setAvailableB(next);
    scene.seek(next ? (task === "extract" ? 2 : task === "analysis" ? 3 : 4) : 5);
  }

  return <div className={styles.lab} ref={scene.ref} data-step={scene.step} role="region" aria-label="模型路由分诊转盘演示">
    <div className={styles.labTop}><span>TRIAGE DIAL / BEFORE CALL</span><strong>先选目标，再生成回答</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.controls} role="group" aria-label="改变路由任务与筛选条件">
      <div className={styles.controlGroup} aria-label="当前任务">{(Object.entries(routingTaskLabels) as Array<[RoutingTask, string]>).map(([value, label]) => <button type="button" aria-pressed={task === value} onClick={() => chooseTask(value)} key={value}>{label}</button>)}</div>
      <div className={styles.controlGroup} aria-label="离线分数门槛">{routingThresholds.map((value) => <button type="button" aria-pressed={threshold === value} onClick={() => chooseThreshold(value)} key={value}>门槛 {value}</button>)}</div>
      <button type="button" aria-pressed={!availableB} onClick={toggleAvailability}>{availableB ? "让 B 暂不可用" : "恢复 B 可用"}</button>
      <button type="button" className={styles.reset} onClick={() => { setTask("extract"); setThreshold(90); setAvailableB(true); scene.seek(0); }}>重置</button>
    </div>
    <TriageDial state={state} />
    <p className={styles.status} data-status={state.status} role="status" aria-live="polite">{state.statusDetail}</p>
  </div>;
}
