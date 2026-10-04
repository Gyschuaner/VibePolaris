"use client";

import { useState } from "react";
import { CheckCircle, ClipboardText, Funnel, Trash } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../AiStackCoreConcepts.module.css";

const labels = ["写入任务快照", "排除无货候选", "留下两项", "交付并清理"];
const candidates = [
  ["A · ¥420", "有货"],
  ["B · ¥480", "无货"],
  ["C · ¥399", "有货"],
  ["D · ¥520", "超预算"],
  ["E · ¥450", "无货"],
] as const;

export function WorkingMemoryLesson() {
  const scene = useScene(labels.length);
  const [inventoryReturned, setInventoryReturned] = useState(true);
  const kept = scene.step >= 2 && inventoryReturned ? [0, 2] : [];
  const removed = scene.step >= 1 ? [1, 3, 4] : [];
  const count = scene.step === 0 ? 5 : scene.step === 1 ? 3 : inventoryReturned ? 2 : 3;
  const delivered = scene.step === 3 && inventoryReturned;
  const scratch = delivered ? "临时清单已清空" : `候选 ${count} · 已查库存 ${scene.step > 0 && inventoryReturned ? "是" : "否"}`;

  return <div className={styles.workingLab} ref={scene.ref} role="region" aria-label="工作记忆任务状态演示">
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.workingBoard}>
      <div className={styles.workingBrief}>
        <h3><ClipboardText size={21} aria-hidden="true" /> 当前任务快照</h3>
        <dl><div><dt>目标</dt><dd>找出预算内且有货的耳机</dd></div><div><dt>预算</dt><dd>≤ ¥500</dd></div><div><dt>下一步</dt><dd>{scene.step < 1 ? "查库存" : scene.step < 3 ? "核对候选" : "交付结果"}</dd></div></dl>
      </div>
      <div className={styles.workingScratch}>
        <h3>可变的工作清单</h3>
        <div className={styles.candidateRows} aria-label="候选商品清单">
          {candidates.map(([name, status], index) => {
            const waitingForInventory = !inventoryReturned && scene.step >= 1 && kept.length === 0 && (index === 0 || index === 2);
            return <div key={name} className={styles.candidateRow} data-removed={removed.includes(index) || delivered} data-kept={kept.includes(index)}>
            <span>{index + 1}</span><span>{name}<small>{waitingForInventory ? "待查库存" : status}</small></span><span>{kept.includes(index) ? "留下" : removed.includes(index) || delivered ? "移出" : "待查"}</span>
          </div>})}
        </div>
        <div className={styles.workingFooter}><span><Funnel size={16} aria-hidden="true" /> 状态：<strong>{scratch}</strong></span><span>{delivered ? <><Trash size={16} aria-hidden="true" /> 已清理</> : "尚未交付"}</span></div>
      </div>
    </div>
    <div className={styles.memoryActions} role="group" aria-label="切换库存结果">
      <button type="button" onClick={() => setInventoryReturned(true)} aria-pressed={inventoryReturned}>库存已返回</button>
      <button type="button" onClick={() => setInventoryReturned(false)} aria-pressed={!inventoryReturned}>库存未返回</button>
    </div>
    <p className={styles.windowVerdict} role="status"><CheckCircle size={17} aria-hidden="true" /> {scene.step === 0 ? "工作记忆先保存目标和候选，下一步才有依据。" : scene.step === 1 ? "预算筛掉两项后还剩 3 个；库存结果还没回来，不能先写成现货。" : scene.step === 2 && !inventoryReturned ? "库存未返回，仍保留 3 个候选，不进入 2 个，也不把未知写成有货。" : scene.step === 2 ? "A 和 C 留下，工作状态已经收敛；它仍只服务当前任务。" : !inventoryReturned ? "交付被挡住：库存没有返回，临时清单继续保留，不能清理成一个假结果。" : "交付后清理临时清单；是否把 A、C 保存为长期偏好，是另一项决定。"}</p>
  </div>;
}
