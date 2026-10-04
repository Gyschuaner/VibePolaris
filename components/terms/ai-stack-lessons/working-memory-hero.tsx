"use client";

import { useState } from "react";
import { Check, CheckCircle, ClipboardText, Clock, Funnel, Trash, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../AiStackCoreConcepts.module.css";

const steps = ["锁定目标", "预算先筛", "库存回执", "交付并清理"];
const candidates = [
  { id: "A", price: "¥420", availability: "有货" },
  { id: "B", price: "¥580", availability: "超预算" },
  { id: "C", price: "¥399", availability: "有货" },
  { id: "D", price: "¥520", availability: "超预算" },
  { id: "E", price: "¥450", availability: "无货" },
] as const;

export function WorkingMemoryHero() {
  const scene = useScene(steps.length);
  const [inventoryReturned, setInventoryReturned] = useState(false);
  useResetOnSceneStart(scene, () => setInventoryReturned(false));
  const budgetFiltered = scene.step >= 1;
  const stockChecked = scene.step >= 2 && inventoryReturned;
  const delivered = scene.step === 3 && stockChecked;
  const candidateCount = scene.step === 0 ? 5 : stockChecked ? 2 : 3;
  const ResultIcon = scene.step === 1 ? Clock : scene.step >= 2 && !stockChecked ? WarningCircle : scene.step >= 2 ? CheckCircle : ClipboardText;

  return <figure ref={scene.ref} className={styles.workingHero} data-step={scene.step} aria-label="一张耳机比价任务板怎样从五个候选收敛到两个并在交付后清理临时状态">
    <div className={styles.workingHeroHeader}><span>耳机比价 · 当前任务</span><strong>预算 ≤ ¥500 · 要求现货</strong></div>
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.workingHeroGrid}>
      <div className={styles.workingHeroBrief}>
        <div className={styles.workingHeroLabel}><ClipboardText size={18} aria-hidden="true" />任务便签</div>
        <strong>找两副预算内、现在有货的耳机</strong>
        <div className={styles.workingHeroTags}><span>5 个候选</span><span>给出 2 个</span></div>
        <div className={styles.workingHeroNext}><span>下一笔动作</span><code>{delivered ? "clear_scratch()" : scene.step === 0 ? "filter_by_budget()" : scene.step === 1 ? "get_inventory()" : scene.step === 2 && stockChecked ? "hand_off(A, C)" : "wait_for_inventory()"}</code></div>
        <div className={styles.workingHeroSeal} data-done={delivered}>{delivered ? <><Check size={14} /> 已交付</> : "临时任务进行中"}</div>
      </div>
      <div className={styles.workingHeroBoard}>
        <div className={styles.workingHeroBoardHeader}><span><Funnel size={16} aria-hidden="true" />临时候选</span><strong>{delivered ? "已清空" : `${candidateCount} 项`}</strong></div>
        <div className={styles.workingHeroCandidates} aria-label="五个耳机候选">
          {candidates.map(({ id, price, availability }, index) => {
            const overBudget = index === 1 || index === 3;
            const outOfStock = index === 4;
            const removed = budgetFiltered && overBudget || stockChecked && outOfStock;
            const kept = stockChecked && !overBudget && !outOfStock;
            const state = delivered ? (kept ? "delivered" : "cleared") : removed ? "removed" : kept ? "kept" : budgetFiltered ? "waiting" : "pending";
            const detail = delivered ? (kept ? "已交付" : overBudget ? "超预算" : "无货") : removed ? (overBudget ? "超预算" : "无货") : kept ? "现货" : budgetFiltered ? "待查库存" : availability;
            return <div key={id} className={styles.workingHeroCandidate} data-state={state}>
              <span className={styles.workingHeroCandidateId}>{id}</span>
              <span className={styles.workingHeroCandidateName}>耳机 {id}<small>{price}</small></span>
              <span className={styles.workingHeroCandidateState}>{detail}</span>
            </div>;
          })}
        </div>
        <div className={styles.workingHeroLedger}>
          <span><Clock size={15} aria-hidden="true" />{stockChecked ? "库存回执已到" : "库存回执"}</span>
          <code>{scene.step < 1 ? "尚未查询" : stockChecked ? "A、C 有货 · E 无货" : "inventory.lookup() …"}</code>
        </div>
      </div>
      <span className={styles.workingHeroPacket} data-running={scene.playing && scene.step > 0 && scene.step < 3} aria-hidden="true" />
    </div>
    <div className={styles.workingHeroActions} role="group" aria-label="切换库存回执" data-enabled={scene.step >= 2}>
      <button type="button" onClick={() => setInventoryReturned(true)} disabled={scene.step < 2} aria-pressed={scene.step >= 2 && inventoryReturned}>库存已返回</button>
      <button type="button" onClick={() => setInventoryReturned(false)} disabled={scene.step < 2} aria-pressed={scene.step >= 2 && !inventoryReturned}>库存未返回</button>
    </div>
    <div className={styles.workingHeroResult} role="status" aria-live="polite">
      <ResultIcon size={20} aria-hidden="true" />
      <span>{scene.step === 0 && "先把目标、预算和候选写进本轮状态。"}{scene.step === 1 && "B、D 因超预算移出；库存没回来，A、C、E 只能停在待查。"}{scene.step === 2 && !stockChecked && "库存回执还没回来，A、C、E 保持待查，不能提前交付。"}{scene.step === 2 && stockChecked && "回执说 E 无货，A、C 才成为可以交付的两项。"}{scene.step === 3 && !stockChecked && "库存还没回来，交付被挡住；A、C、E 和临时清单继续保留。"}{scene.step === 3 && delivered && <><strong>交付完成。</strong> A、C 留给用户比较，临时清单和调用计数随后清掉。</>}</span>
      {scene.step === 1 && <WarningCircle className={styles.workingHeroResultMark} size={17} aria-hidden="true" />}
      {delivered && <Trash className={styles.workingHeroResultMark} size={17} aria-hidden="true" />}
    </div>
    <figcaption>工作记忆像桌面上的任务板：回执回来才改写候选，交付物留下，临时草稿在任务结束时退场。</figcaption>
  </figure>;
}
