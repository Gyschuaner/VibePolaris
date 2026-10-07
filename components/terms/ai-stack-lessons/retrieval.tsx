"use client";

import { useState, type CSSProperties } from "react";
import { Archive, CheckCircle, Funnel, MagnifyingGlass, ShieldWarning, Tag, X } from "@phosphor-icons/react";

import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import { getRetrievalDemoState, retrievalModeLabel, type RetrievalMode, type RetrievalScope, type RetrievalTopK, type RetrievalDemoState } from "@/lib/retrieval-demo";
import styles from "../ai-stack-pages/retrieval.module.css";

const labels = ["写下查询", "拉开抽屉", "语义轨滑到前面", "扩大 top-k", "抽走无来源卡", "关上引用闸"];

const railValues: Record<RetrievalMode, { keyword: number; semantic: number }> = {
  keyword: { keyword: 0.96, semantic: 0.48 },
  semantic: { keyword: 0.42, semantic: 0.94 },
  hybrid: { keyword: 0.82, semantic: 0.84 },
};

function Rail({ label, value, active, marker }: { label: string; value: number; active: boolean; marker: number }) {
  return <div className={styles.rail} data-active={active}>
    <div className={styles.railHeader}><span>{label}</span><strong>{value.toFixed(2)}</strong></div>
    <div className={styles.railTrack} style={{ "--rail-fill": `${value * 100}%`, "--rail-marker": `${Math.min(94, Math.max(3, marker * 100))}%` } as CSSProperties}><b /><i /></div>
  </div>;
}

function RetrievalDesk({ state, compact = false }: { state: RetrievalDemoState; compact?: boolean }) {
  const selectedIds = new Set(state.visible.map((candidate) => candidate.id));
  const values = railValues[state.mode];
  return <div className={`${styles.desk} ${compact ? styles.heroDesk : styles.lessonDesk}`} data-status={state.status}>
    <div className={styles.deskHeader}><span><Archive size={compact ? 14 : 17} aria-hidden="true" />{retrievalModeLabel(state.mode)}检索</span><code>top-{state.topK}</code></div>
    <div className={styles.queryMagnet} data-active={state.drawerOpen}>
      <MagnifyingGlass size={compact ? 16 : 19} aria-hidden="true" />
      <div><strong>退款多久到账？</strong></div>
      <code>200 段</code>
    </div>
    <div className={styles.deskBody}>
      <div className={styles.drawer} data-open={state.drawerOpen}>
        <div className={styles.drawerHeader}><span>资料抽屉</span><code>{state.scope === "policy" ? "政策范围" : state.scope === "revoked" ? "已撤销范围" : "全库"}</code></div>
        <div className={styles.cards} aria-hidden={!state.drawerOpen}>
          {state.drawerOpen && state.candidates.map((candidate, rank) => {
            const muted = !selectedIds.has(candidate.id) || (state.scope === "policy" && candidate.id !== "policy") || (state.unsupportedRemoved && candidate.source === null);
            const removed = state.unsupportedRemoved && candidate.source === null;
            return <div key={candidate.id} className={styles.candidate} data-selected={state.selected?.id === candidate.id} data-supported={Boolean(candidate.source)} data-muted={muted} data-removed={removed} style={{ "--card-slot": rank } as CSSProperties}>
              {candidate.source ? <Tag size={compact ? 13 : 15} aria-hidden="true" /> : <ShieldWarning size={compact ? 13 : 15} aria-hidden="true" />}
              <div><strong>{candidate.title}</strong><small>{candidate.source ?? "来源缺失"}</small></div>
              <code>{candidate.score.toFixed(2)}</code>
            </div>;
          })}
        </div>
      </div>
      <div className={styles.rails} aria-label="相关性滑轨">
        <Rail label="词项" value={values.keyword} active={state.mode === "keyword" || state.mode === "hybrid"} marker={state.candidates.find((candidate) => candidate.id === "policy")?.score ?? 0} />
        <Rail label="语义" value={values.semantic} active={state.mode === "semantic" || state.mode === "hybrid"} marker={state.candidates.find((candidate) => candidate.id === "faq")?.score ?? 0} />
        <span className={styles.railHint}>{state.railStep === 0 ? "待比较" : "相关分 ≠ 正确率"}</span>
      </div>
    </div>
    <div className={styles.citation} data-status={state.status} role="status" aria-live="polite">
      {state.status === "missing" ? <X size={compact ? 15 : 18} aria-hidden="true" /> : state.status === "citable" ? <CheckCircle size={compact ? 15 : 18} aria-hidden="true" /> : <Funnel size={compact ? 15 : 18} aria-hidden="true" />}
      <div><span>引用闸门</span><strong>{state.statusLabel}</strong></div>
    </div>
  </div>;
}

const heroNotes = [
  "先把问题写成一张查询磁贴；抽屉还没有打开，不能假装已经找到答案。",
  "资料抽屉只负责把候选摆出来，每张卡都保留相关性和来源位置。",
  "语义轨把没有共同词面的问答摘录推到前面，相似度高不代表它有出处。",
  "扩大 top-k 会带回更多卡片，却不会让候选自动变成结论。",
  "抽掉最高分但无来源的卡，答案区留下的是缺口，而不是编一个答案。",
  "有来源的候选可以交给下一步核对；检索仍停在原文位置。",
];

export function RetrievalHero() {
  const scene = useScene(labels.length);
  const state = getRetrievalDemoState(scene.step, "semantic", scene.step >= 3 ? 3 : 1, "all", scene.step >= 4);
  return <figure ref={scene.ref} className={styles.hero} aria-label="磁贴抽屉展示检索怎样返回候选并经过来源闸门">
    <div className={styles.heroTop}><span>磁贴抽屉 · RETRIEVAL</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <RetrievalDesk state={state} compact />
    <figcaption role="status" aria-live="polite">{heroNotes[scene.step]}</figcaption>
  </figure>;
}

export function RetrievalLesson() {
  const scene = useScene(labels.length);
  const [mode, setMode] = useState<RetrievalMode>("semantic");
  const [topKOverride, setTopKOverride] = useState<RetrievalTopK | null>(null);
  const [scope, setScope] = useState<RetrievalScope>("all");
  const [removedOverride, setRemovedOverride] = useState<boolean | null>(null);
  useResetOnSceneStart(scene, () => {
    setMode("semantic");
    setTopKOverride(null);
    setScope("all");
    setRemovedOverride(null);
  });
  const topK = topKOverride ?? (scene.step >= 3 ? 3 : 1);
  const unsupportedRemoved = removedOverride ?? scene.step >= 4;
  const state = getRetrievalDemoState(scene.step, mode, topK, scope, unsupportedRemoved);

  function chooseMode(next: RetrievalMode) {
    setMode(next);
    setTopKOverride(null);
    setRemovedOverride(null);
    scene.seek(2);
  }

  function chooseTopK(next: RetrievalTopK) {
    setTopKOverride(next);
    scene.seek(3);
  }

  function toggleUnsupported() {
    setRemovedOverride(!unsupportedRemoved);
    scene.seek(4);
  }

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="检索磁贴抽屉与相关性滑轨演示">
    <div className={styles.labTop}><span>MAGNET DRAWER / EVIDENCE GATE</span><strong>候选先过来源闸门</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.controls} role="group" aria-label="改变检索方式、范围与返回数量">
      <div className={styles.controlGroup} aria-label="检索方式"><button type="button" aria-pressed={mode === "keyword"} onClick={() => chooseMode("keyword")}>词项</button><button type="button" aria-pressed={mode === "semantic"} onClick={() => chooseMode("semantic")}>语义</button><button type="button" aria-pressed={mode === "hybrid"} onClick={() => chooseMode("hybrid")}>混合</button></div>
      <div className={styles.controlGroup} aria-label="返回数量"><button type="button" aria-pressed={topK === 1} onClick={() => chooseTopK(1)}>top-1</button><button type="button" aria-pressed={topK === 3} onClick={() => chooseTopK(3)}>top-3</button></div>
      <div className={styles.controlGroup} aria-label="资料范围"><button type="button" aria-pressed={scope === "all"} onClick={() => { setScope("all"); scene.seek(2); }}>全库</button><button type="button" aria-pressed={scope === "policy"} onClick={() => { setScope("policy"); scene.seek(2); }}>只看正式政策</button><button type="button" aria-pressed={scope === "revoked"} onClick={() => { setScope("revoked"); scene.seek(2); }}>只看已撤销</button></div>
      <button type="button" aria-pressed={unsupportedRemoved} onClick={toggleUnsupported}>{unsupportedRemoved ? "放回无来源卡" : "抽走无来源卡"}</button>
    </div>
    <RetrievalDesk state={state} />
    <p className={styles.status} data-status={state.status} role="status" aria-live="polite">{state.statusDetail}</p>
  </div>;
}
