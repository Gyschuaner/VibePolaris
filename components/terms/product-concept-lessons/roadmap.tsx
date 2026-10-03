"use client";

import { ArrowRight, CheckCircle, ClipboardText, FileText, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function RoadmapLesson() {
  const scene = useScene(3);
  const stageReady = scene.step >= 1;
  const reviewReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从产品目标推进到阶段价值、依赖与复盘的路线图演示">
    <Caption
      scene={scene}
      labels={["产品目标", "阶段价值", "依赖与复盘"]}
      titles={["先说要为用户改变什么", "把目标拆成可验证阶段", "证据和依赖让路线图可调整"]}
      copy={[
        "“降低首次配置失败率”是要为用户带来的改变；它比按季度堆一串功能日期更能说明路线图往哪里走。",
        "先补诊断，再优化引导：每个阶段都有自己的结果和衡量方式，团队能知道下一步为何接着做。",
        "插入合规依赖后，远期从精确日期改成区间，并根据结果保留、调整或停止。路线图记录意图，不假装远期已经确定。",
      ]}
    />
    <div className={styles.roadmapBoard} aria-live="polite">
      <div className={styles.roadmapCard} data-active={!stageReady} data-muted={stageReady}>
        {stageReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>产品目标</strong>
        <code>降低首次配置失败率</code>
        <span>{stageReady ? "方向已固定" : "先说要改变什么"}</span>
      </div>
      <ArrowRight className={styles.roadmapArrow} size={19} aria-hidden="true" />
      <div className={styles.roadmapCard} data-active={stageReady} data-muted={!stageReady}>
        <ClipboardText size={23} aria-hidden="true" />
        <strong>{stageReady ? "阶段价值" : "需要拆解"}</strong>
        <code>{stageReady ? "先补诊断 · 再优化引导" : "目标 · 阶段 · 衡量"}</code>
        <span>{stageReady ? "每段都有可验证结果" : "不要直接排功能日期"}</span>
      </div>
      <ArrowRight className={styles.roadmapArrow} size={19} aria-hidden="true" />
      <div className={styles.roadmapCard} data-active={reviewReady} data-muted={!reviewReady}>
        {reviewReady ? <CheckCircle size={23} aria-hidden="true" /> : <FileText size={23} aria-hidden="true" />}
        <strong>{reviewReady ? "依赖与复盘" : "保留调整"}</strong>
        <code>{reviewReady ? "合规依赖 · 远期改区间" : "证据、依赖、下一步"}</code>
        <span>{reviewReady ? "路线图随判断更新" : "远期不要假装确定"}</span>
      </div>
      <div className={styles.roadmapProof} data-ready={reviewReady}>
        <CheckCircle size={21} aria-hidden="true" />
        <p><strong>{reviewReady ? "路线图可调整" : "路线图还没站稳"}</strong>{reviewReady ? " 每一段都有目标、价值和依据，未来的取舍仍然可见。" : " 先从用户价值和阶段目标组织方向，再放进时间框架。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进路线图演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>安排阶段结果</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={reviewReady}>加入依赖并复盘</button>
    </div>
  </div>;
}
