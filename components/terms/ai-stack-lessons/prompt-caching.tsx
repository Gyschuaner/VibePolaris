"use client";

import { ArrowCounterClockwise, CheckCircle, Note, Stack, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState, type CSSProperties } from "react";

import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import { getPromptCachingDemoState, promptCachingEditLabels, type PromptCachingDemoState, type PromptCachingEdit } from "@/lib/prompt-caching-demo";
import styles from "../ai-stack-pages/prompt-caching.module.css";

const labels = ["铺开底片", "首轮叠印", "换问题便签", "碰到底片", "切换模型", "缓存章褪色"];
const heroEdits: PromptCachingEdit[] = ["question", "question", "question", "tools", "system", "question"];

function StatusIcon({ state, compact = false }: { state: PromptCachingDemoState; compact?: boolean }) {
  const size = compact ? 14 : 17;
  if (state.status === "hit" || state.status === "partial") return <CheckCircle size={size} aria-hidden="true" />;
  if (state.status === "miss") return <XCircle size={size} aria-hidden="true" />;
  if (state.status === "saved") return <Stack size={size} aria-hidden="true" />;
  return <WarningCircle size={size} aria-hidden="true" />;
}

function FilmDesk({ state, compact = false }: { state: PromptCachingDemoState; compact?: boolean }) {
  const editedSegment = state.segments.find((segment) => segment.id === state.edit);
  return <div className={`${styles.filmDesk} ${compact ? styles.heroDesk : styles.lessonDesk}`} data-status={state.status}>
    <div className={styles.deskHeader}><span><Stack size={compact ? 14 : 17} aria-hidden="true" />透明胶片叠印台</span><code>{state.sameModel ? "MODEL SAME" : "MODEL CHANGED"}</code></div>
    <div className={styles.filmStage}>
      <div className={styles.baseFilm} data-status={state.status}>
        <div className={styles.filmHeader}><span>稳定前缀 · 透明底片</span><strong>{state.cacheStamp}</strong></div>
        <div className={styles.segments}>
          {state.segments.map((segment, index) => <div className={styles.segment} data-state={segment.state} key={segment.id} style={{ "--segment-index": index } as CSSProperties}>
            <Stack size={compact ? 12 : 15} aria-hidden="true" />
            <div><strong>{segment.label}</strong><small>{segment.detail}</small></div>
            <code>{segment.state === "reused" ? "复用" : segment.state === "changed" ? "改动" : segment.state === "recompute" ? "重算" : "待处理"}</code>
          </div>)}
        </div>
      </div>
      <div className={styles.stickyNote} data-edit={state.edit}>
        <Note size={compact ? 16 : 20} aria-hidden="true" />
        <span>{promptCachingEditLabels[state.edit]}</span>
        <strong>{editedSegment?.detail}</strong>
        <code>{state.edit === "question" ? "tail / new" : "prefix / changed"}</code>
      </div>
    </div>
    <div className={styles.stamp} data-status={state.status}><StatusIcon state={state} compact={compact} /><span>{state.statusLabel}</span></div>
    <div className={styles.answerTray}><span>本次回答</span><strong>{state.response}</strong></div>
  </div>;
}

const heroNotes = [
  "先把稳定规则、工具和格式铺成一张透明底片，问题便签还没有贴上去。",
  "第一轮把底片读过一遍并盖章；留下的是中间计算，不是旧答案。",
  "只换最后的问题便签，前三层仍然对齐，缓存章可以直接盖在那一段。",
  "手指碰到第二层工具说明，后面的格式也失去连续前缀，只剩第一层可复用。",
  "换了模型，旧底片不能跨模型叠印；相同文字也不等于相同缓存。",
  "缓存章褪色后，曾经读过的底片要重新处理；回答仍按本次输入生成。",
];

export function PromptCachingHero() {
  const scene = useScene(labels.length);
  const step = scene.step;
  const state = getPromptCachingDemoState(step, heroEdits[step], step !== 4, step !== 5);
  return <figure ref={scene.ref} className={styles.hero} data-step={step} aria-label="透明胶片叠印台展示提示缓存怎样复用前缀计算">
    <div className={styles.heroTop}><span>透明胶片叠印台 · PROMPT CACHE</span><strong>{String(step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <FilmDesk state={state} compact />
    <figcaption role="status" aria-live="polite">{heroNotes[step]}</figcaption>
  </figure>;
}

export function PromptCachingLesson() {
  const scene = useScene(labels.length);
  const [editOverride, setEditOverride] = useState<PromptCachingEdit | null>(null);
  const [sameModelOverride, setSameModelOverride] = useState<boolean | null>(null);
  const [cacheFreshOverride, setCacheFreshOverride] = useState<boolean | null>(null);
  useResetOnSceneStart(scene, () => {
    setEditOverride(null);
    setSameModelOverride(null);
    setCacheFreshOverride(null);
  });
  const edit = editOverride ?? heroEdits[scene.step];
  const sameModel = sameModelOverride ?? scene.step !== 4;
  const cacheFresh = cacheFreshOverride ?? scene.step !== 5;
  const state = getPromptCachingDemoState(scene.step, edit, sameModel, cacheFresh);

  function chooseEdit(next: PromptCachingEdit) {
    setEditOverride(next);
    setSameModelOverride(null);
    setCacheFreshOverride(null);
    scene.seek(next === "question" ? 2 : next === "tools" ? 3 : 4);
  }

  function reset() {
    setEditOverride(null);
    setSameModelOverride(null);
    setCacheFreshOverride(null);
    scene.seek(0);
  }

  return <div className={styles.lab} ref={scene.ref} data-step={scene.step} role="region" aria-label="提示缓存透明胶片叠印台演示">
    <div className={styles.labTop}><span>OVERLAY FILM / PREFIX HIT</span><strong>只复用开头连续相同的计算</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.labControls} role="group" aria-label="改变缓存命中条件">
      <div className={styles.controlGroup} aria-label="选择改动位置">
        {(Object.entries(promptCachingEditLabels) as Array<[PromptCachingEdit, string]>).map(([value, label]) => <button type="button" aria-pressed={edit === value} onClick={() => chooseEdit(value)} key={value}>{label}</button>)}
      </div>
      <div className={styles.controlGroup}>
        <button type="button" aria-pressed={sameModel} onClick={() => { setSameModelOverride(!sameModel); setCacheFreshOverride(null); scene.seek(4); }}>同一模型</button>
        <button type="button" aria-pressed={!cacheFresh} onClick={() => { setCacheFreshOverride(!cacheFresh); setSameModelOverride(null); scene.seek(5); }}>{cacheFresh ? "让缓存失效" : "恢复缓存"}</button>
        <button type="button" onClick={reset}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button>
      </div>
    </div>
    <FilmDesk state={state} />
    <p className={styles.status} data-status={state.status} role="status" aria-live="polite">{state.statusDetail}</p>
  </div>;
}
