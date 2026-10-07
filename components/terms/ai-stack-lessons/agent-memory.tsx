"use client";

import { useState } from "react";
import { Archive, Brain, CheckCircle, Eraser, Funnel, MagnifyingGlass, PencilSimple, WarningCircle } from "@phosphor-icons/react";

import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import { getMemoryDrawerState, type MemoryCardValue } from "@/lib/agent-memory-demo";
import styles from "../ai-stack-pages/agent-memory.module.css";

const labels = ["等候同意", "放入抽屉", "抽出相关卡", "压进本轮", "改成 Python", "删除记录"];

function MemoryDrawerDesk({ state, compact = false }: { state: ReturnType<typeof getMemoryDrawerState>; compact?: boolean }) {
  return <div className={`${styles.desk} ${compact ? styles.heroDesk : styles.lessonDesk}`} data-status={state.status} data-step={state.step}>
    <div className={styles.deskHeader}><span><Archive size={compact ? 14 : 17} aria-hidden="true" />记忆卡抽屉 · MEMORY</span><code>CODE SCOPE</code></div>
    <div className={styles.drawerStage}>
      <div className={styles.preferenceSlip} data-state={state.cardState}>
        <span>会话 A · 用户偏好</span>
        <strong>代码示例优先用 {state.value}</strong>
        <small>{state.cardDetail}</small>
      </div>
      <div className={styles.drawer} data-open={state.step > 0}>
        <div className={styles.drawerHeader}><span>应用的抽屉</span><strong>{state.drawerLabel}</strong></div>
        <div className={styles.cards}>
          <div className={styles.otherCard}><span>食谱偏好</span><code>少放盐</code></div>
          <div className={styles.memoryCard} data-state={state.cardState}>
            {state.cardState === "deleted" ? <Eraser size={compact ? 14 : 17} aria-hidden="true" /> : state.cardState === "corrected" ? <PencilSimple size={compact ? 14 : 17} aria-hidden="true" /> : state.cardState === "outside" ? <WarningCircle size={compact ? 14 : 17} aria-hidden="true" /> : <CheckCircle size={compact ? 14 : 17} aria-hidden="true" />}
            <div><strong>{state.cardLabel}</strong><small>{state.cardDetail}</small></div>
          </div>
        </div>
        <div className={styles.drawerSlot} data-filled={state.step >= 2 && state.cardState !== "deleted"}><Funnel size={compact ? 13 : 16} aria-hidden="true" /><span>{state.step >= 2 && state.cardState !== "deleted" ? "代码范围 · 命中 1 条" : "按任务取回，不搬空抽屉"}</span></div>
      </div>
    </div>
    <div className={styles.taskWindow}>
      <div className={styles.taskHeader}><span><Brain size={compact ? 14 : 17} aria-hidden="true" />会话 B · 当前任务</span><code>登录接口示例</code></div>
      <div className={styles.promptSlot} data-filled={state.step >= 3 && state.cardState !== "deleted"}><span>本轮输入</span><strong>{state.promptLabel}</strong></div>
      <div className={styles.outputSlot} data-stale={state.step >= 4 && state.cardState !== "deleted"}><span>{state.cardState === "deleted" ? "下一次回答" : "回答留下的痕迹"}</span><strong>{state.outputLabel}</strong></div>
    </div>
    <div className={styles.status} data-status={state.status} role="status" aria-live="polite">
      {state.status === "deleted" ? <WarningCircle size={compact ? 15 : 18} aria-hidden="true" /> : state.status === "inserted" || state.status === "corrected" ? <CheckCircle size={compact ? 15 : 18} aria-hidden="true" /> : <MagnifyingGlass size={compact ? 15 : 18} aria-hidden="true" />}
      <div><strong>{state.statusLabel}</strong><span>{state.statusDetail}</span></div>
    </div>
  </div>;
}

const heroNotes = [
  "偏好卡先留在抽屉外；当前回答能参考，长期保存还要问清楚。",
  "同意后只写下一张带来源和范围的卡，食谱卡继续留在抽屉里。",
  "新任务只抽出代码范围那一张；取回不等于模型已经看见。",
  "卡片被压进本轮输入，模型才会按 TypeScript 生成这一次的回答。",
  "把卡片翻面改成 Python；旧的 TypeScript 输出仍保留在历史里。",
  "按删除键后抽屉只剩食谱卡，下一次要重新说明语言偏好。",
];

export function AgentMemoryHero() {
  const scene = useScene(labels.length);
  const state = getMemoryDrawerState(scene.step);
  return <figure ref={scene.ref} className={styles.hero} data-step={scene.step} aria-label="记忆卡抽屉展示用户偏好如何被同意、取回、纠正和删除">
    <div className={styles.heroTop}><span>记忆卡抽屉 · AGENT MEMORY</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <MemoryDrawerDesk state={state} compact />
    <figcaption role="status" aria-live="polite">{heroNotes[scene.step]}</figcaption>
  </figure>;
}

export function AgentMemoryLesson() {
  const scene = useScene(labels.length);
  const [value, setValue] = useState<MemoryCardValue>("TypeScript");
  const [deleted, setDeleted] = useState(false);
  useResetOnSceneStart(scene, () => { setValue("TypeScript"); setDeleted(false); });
  const state = getMemoryDrawerState(scene.step, value, deleted);
  const canCorrect = scene.step >= 3 && scene.step < 5 && !deleted;
  const canDelete = scene.step >= 4 && !deleted;

  function correct() { setValue("Python"); setDeleted(false); scene.seek(4); }
  function toggleDelete() { setDeleted(!deleted); scene.seek(deleted ? 4 : 5); }

  return <div className={styles.lab} ref={scene.ref} data-step={scene.step} role="region" aria-label="智能体记忆卡抽屉演示">
    <div className={styles.labTop}><span>MEMORY CARD DRAWER / FUTURE RETRIEVAL</span><strong>只把相关卡放进本轮</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.controls} role="group" aria-label="纠正或删除记忆记录">
      <button type="button" aria-pressed={value === "Python"} disabled={!canCorrect} onClick={correct}><PencilSimple size={15} aria-hidden="true" />改成 Python</button>
      <button type="button" aria-pressed={deleted} disabled={!canDelete} onClick={toggleDelete}><Eraser size={15} aria-hidden="true" />{deleted ? "恢复记录" : "删除记录"}</button>
      <button type="button" className={styles.reset} onClick={() => { setValue("TypeScript"); setDeleted(false); scene.seek(0); }}>重置</button>
    </div>
    <MemoryDrawerDesk state={state} />
    <p className={styles.lessonNote} data-status={state.status} role="status" aria-live="polite">{state.statusDetail}</p>
  </div>;
}
