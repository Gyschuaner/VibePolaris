"use client";

import { ArrowRight, CheckCircle, ClipboardText, FileText, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function ScopeLesson() {
  const scene = useScene(3);
  const boundaryReady = scene.step >= 1;
  const changeReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从版本目标推进到包含排除以及依赖变更的范围演示">
    <Caption
      scene={scene}
      labels={["版本目标", "包含与排除", "依赖与变更"]}
      titles={["先固定要解决的任务", "把本期与后续分开", "新增想法先看影响"]}
      copy={[
        "“导出当前筛选结果为 CSV”说清用户任务与交付结果；它比“做报表平台”更能指导本期判断。",
        "本期：CSV、沿用当前筛选、手动下载；后续：图表和定时报表。被排除的想法仍保留为候选，不等于没价值。",
        "导出接口和字段权限是依赖；若加入图表会超出容量，就评估移出另一项或调整目标、验收和时间，而不是默默扩大范围。",
      ]}
    />
    <div className={styles.scopeBoard} aria-live="polite">
      <div className={styles.scopeCard} data-active={!boundaryReady} data-muted={boundaryReady}>
        {boundaryReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>版本目标</strong>
        <code>导出当前筛选结果为 CSV</code>
        <span>{boundaryReady ? "目标已固定" : "先确定一个可复述任务"}</span>
      </div>
      <ArrowRight className={styles.scopeArrow} size={19} aria-hidden="true" />
      <div className={styles.scopeCard} data-active={boundaryReady} data-muted={!boundaryReady}>
        <ClipboardText size={23} aria-hidden="true" />
        <strong>{boundaryReady ? "包含与排除" : "需要补齐"}</strong>
        <code>{boundaryReady ? "本期 CSV · 后续图表/定时报表" : "本期做什么 · 不做什么"}</code>
        <span>{boundaryReady ? "候选被记录但不阻塞本期" : "价值不同不等于本期都做"}</span>
      </div>
      <ArrowRight className={styles.scopeArrow} size={19} aria-hidden="true" />
      <div className={styles.scopeCard} data-active={changeReady} data-muted={!changeReady}>
        {changeReady ? <CheckCircle size={23} aria-hidden="true" /> : <FileText size={23} aria-hidden="true" />}
        <strong>{changeReady ? "依赖与变更" : "变更判断"}</strong>
        <code>{changeReady ? "接口/权限 · 图表移出本期" : "依赖、容量、验收"}</code>
        <span>{changeReady ? "验收和排期同步更新" : "新增前先看影响"}</span>
      </div>
      <div className={styles.scopeProof} data-ready={changeReady}>
        <CheckCircle size={21} aria-hidden="true" />
        <p><strong>{changeReady ? "范围可被解释" : "范围还没站稳"}</strong>{changeReady ? " 每个新增想法都有取舍，边界、依赖和验收彼此对得上。" : " 先把目标、包含项和排除项说清楚，再讨论更多功能。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进范围演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>补齐包含与排除</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={changeReady}>评估新增影响</button>
    </div>
  </div>;
}
