"use client";

import { useState } from "react";

import { CheckCircle, ClipboardText, FileText, MagnifyingGlass, Stack, WarningCircle, Wrench } from "@phosphor-icons/react";

import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import { getAgentOrchestrationDemoState, type OrchestrationMode, type OrchestrationDemoState } from "@/lib/agent-orchestration-demo";
import styles from "../ai-stack-pages/agent-orchestration.module.css";

const labels = ["拆开任务", "翻开证据", "看见冲突", "卡住撰写", "清掉冲突", "扣上报告"];

function TileState({ state }: { state: OrchestrationDemoState["research"] | OrchestrationDemoState["verify"] | OrchestrationDemoState["write"] | OrchestrationDemoState["report"] }) {
  if (state === "running" || state === "writing") return <span className={styles.tileStatus}>进行中</span>;
  if (state === "ready") return <CheckCircle size={15} aria-label="已完成" />;
  if (state === "conflict") return <WarningCircle size={15} aria-label="有冲突" />;
  if (state === "locked") return <span className={styles.tileStatus}>锁住</span>;
  return <span className={styles.tileStatus}>等待</span>;
}

function OrchestrationDesk({ state, mode, compact = false }: { state: OrchestrationDemoState; mode: OrchestrationMode; compact?: boolean }) {
  return <div className={compact ? styles.heroDesk : styles.desk} data-conflict={state.conflictVisible} data-ready={state.report === "ready"}>
    <div className={styles.deskHeader}><span><ClipboardText size={compact ? 14 : 17} aria-hidden="true" />报告拼图桌</span><code>{mode === "parallel" ? "PARALLEL" : "SERIAL"}</code></div>
    <div className={styles.dependencyStrip}><span>编排台</span><i /> <span>检索</span><i /> <span>核对</span><i /> <span>撰写</span><i /> <span>合并</span></div>
    <div className={styles.tiles}>
      <div className={`${styles.tile} ${styles.research}`} data-state={state.research}><MagnifyingGlass size={compact ? 17 : 21} aria-hidden="true" /><div><span>检索</span><strong>{state.research === "ready" ? "8 条证据" : state.research === "running" ? "翻找中" : "等开工"}</strong></div><TileState state={state.research} /></div>
      <div className={`${styles.tile} ${styles.verify}`} data-state={state.verify}><Stack size={compact ? 17 : 21} aria-hidden="true" /><div><span>核对</span><strong>{state.verify === "conflict" ? "冲突 1" : state.verify === "ready" ? "一致" : state.verify === "running" ? "逐条看" : "等证据"}</strong></div><TileState state={state.verify} /></div>
      <div className={`${styles.tile} ${styles.write}`} data-state={state.write}><Wrench size={compact ? 17 : 21} aria-hidden="true" /><div><span>撰写</span><strong>{state.write === "locked" ? "夹子锁住" : state.write === "writing" ? "拼接中" : state.write === "ready" ? `${state.evidenceCount} 条入稿` : "等核对"}</strong></div><TileState state={state.write} /></div>
    </div>
    <div className={styles.reportSlip} data-ready={state.report === "ready"}>
      {state.report === "ready" ? <CheckCircle size={compact ? 18 : 22} aria-hidden="true" /> : <FileText size={compact ? 18 : 22} aria-hidden="true" />}<div><span>报告合页</span><strong>{state.report === "ready" ? `已合并 · ${state.evidenceCount} 条` : "未扣上"}</strong></div><small>{state.conflictVisible ? "冲突证据不进报告" : state.report === "ready" ? "可以交付" : "等待可核对材料"}</small>
    </div>
  </div>;
}

const heroNotes = [
  "编排台先把检索、核对、撰写和合并的依赖钉在一张报告桌上。",
  "并行只让检索与核对同时开工；撰写仍被核对结果的夹子锁着。",
  "核对翻出冲突磁片，编排台不让矛盾材料直接滑进报告。",
  "撰写夹子保持锁住，停住是为了等规则处理冲突，不是卡死。",
  "排除冲突证据后，撰写只接收 7 条一致材料。",
  "合页扣上时，报告才有可核对的合并结果；角色数量本身没有证明力。",
];

export function AgentOrchestrationHero() {
  const scene = useScene(labels.length);
  const conflict = scene.step >= 2;
  const resolved = scene.step >= 4;
  const state = getAgentOrchestrationDemoState(scene.step, "parallel", conflict, resolved);
  return <figure ref={scene.ref} className={styles.hero} aria-label="报告拼图桌展示智能体编排怎样安排依赖并处理冲突">
    <div className={styles.heroTop}><span>报告拼图桌 · ORCHESTRATION</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <OrchestrationDesk state={state} mode="parallel" compact />
    <figcaption role="status" aria-live="polite">{heroNotes[scene.step]}</figcaption>
  </figure>;
}

export function AgentOrchestrationLesson() {
  const scene = useScene(labels.length);
  const [mode, setMode] = useState<OrchestrationMode>("parallel");
  const [conflict, setConflict] = useState(false);
  const [resolved, setResolved] = useState(false);
  useResetOnSceneStart(scene, () => { setMode("parallel"); setConflict(false); setResolved(false); });
  const state = getAgentOrchestrationDemoState(scene.step, mode, conflict, resolved);

  function chooseMode(next: OrchestrationMode) {
    setMode(next);
    setConflict(false);
    setResolved(false);
    scene.seek(1);
  }

  function toggleConflict() {
    if (conflict && !resolved) {
      setResolved(true);
      scene.seek(4);
      return;
    }
    setConflict(true);
    setResolved(false);
    scene.seek(2);
  }

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="智能体编排报告拼图桌">
    <div className={styles.labTop}><span>DEPENDENCY DESK / MERGE RULE</span><strong>先核对，再合并</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.controls} role="group" aria-label="切换编排方式和冲突证据">
      <button type="button" aria-pressed={mode === "parallel"} onClick={() => chooseMode("parallel")}>并行翻牌</button>
      <button type="button" aria-pressed={mode === "serial"} onClick={() => chooseMode("serial")}>串行翻牌</button>
      <button type="button" aria-pressed={conflict} onClick={toggleConflict}>{conflict && !resolved ? "排除冲突" : resolved ? "恢复冲突" : "制造冲突"}</button>
    </div>
    <OrchestrationDesk state={state} mode={mode} />
    <p className={styles.status} data-ready={state.report === "ready"} role="status" aria-live="polite">{state.status}</p>
  </div>;
}
