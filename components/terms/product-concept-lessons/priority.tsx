"use client";

import { ArrowRight, CheckCircle, ClipboardText, FileText, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function PriorityLesson() {
  const scene = useScene(3);
  const factorsReady = scene.step >= 1;
  const rankReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从当前目标比较影响、时限和依赖并形成优先顺序的演示">
    <Caption
      scene={scene}
      labels={["当前目标", "比较依据", "重新排序"]}
      titles={["先确认这次要保护什么", "用多个因素比较工作", "新证据出现就重看顺序"]}
      copy={[
        "当前目标是降低首次配置失败率；没有共同目标，“都很重要”就无法说明哪项工作应该先做。",
        "把核心流程故障、合规截止项和界面微调放在同一张比较板上，观察用户影响、时限、依赖、风险和工作量。",
        "当合规截止日期提前或故障影响扩大，顺序就会变化。优先级保留判断依据，不能只留下一个永久 P0/P1 标签。",
      ]}
    />
    <div className={styles.priorityBoard} aria-live="polite">
      <div className={styles.priorityCard} data-active={!factorsReady} data-muted={factorsReady}>
        {factorsReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>当前目标</strong>
        <code>降低首次配置失败率</code>
        <span>{factorsReady ? "排序有共同参照" : "先确认保护哪个结果"}</span>
      </div>
      <ArrowRight className={styles.priorityArrow} size={19} aria-hidden="true" />
      <div className={styles.priorityCard} data-active={factorsReady} data-muted={!factorsReady}>
        <ClipboardText size={23} aria-hidden="true" />
        <strong>{factorsReady ? "比较依据" : "需要补齐"}</strong>
        <code>{factorsReady ? "影响 · 时限 · 依赖 · 风险 · 工作量" : "不能只看声音大小"}</code>
        <span>{factorsReady ? "同一目标下比较取舍" : "把判断理由留下"}</span>
      </div>
      <ArrowRight className={styles.priorityArrow} size={19} aria-hidden="true" />
      <div className={styles.priorityCard} data-active={rankReady} data-muted={!rankReady}>
        {rankReady ? <CheckCircle size={23} aria-hidden="true" /> : <FileText size={23} aria-hidden="true" />}
        <strong>{rankReady ? "当前顺序" : "重新排序"}</strong>
        <code>{rankReady ? "故障 → 合规 → 微调" : "证据变化后再判断"}</code>
        <span>{rankReady ? "依据可以复核" : "不是永久标签"}</span>
      </div>
      <div className={styles.priorityProof} data-ready={rankReady}>
        <CheckCircle size={21} aria-hidden="true" />
        <p><strong>{rankReady ? "排序可以解释" : "排序还没站稳"}</strong>{rankReady ? " 每项先后都有目标、证据和约束，输入变化时可以重排。" : " 先确定共同目标，再比较影响、时限、风险和成本。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进优先级演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>补齐比较依据</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={rankReady}>根据变化重排</button>
    </div>
  </div>;
}
