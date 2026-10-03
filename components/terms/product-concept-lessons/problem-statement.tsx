"use client";

import { ArrowRight, ChartLineUp, CheckCircle, FileText, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function ProblemStatementLesson() {
  const scene = useScene(3);
  const evidenceReady = scene.step >= 1;
  const problemReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从方案句补充证据并形成问题陈述演示">
    <Caption
      scene={scene}
      labels={["预设方案", "补充观察事实", "形成问题"]}
      titles={["先识别已经选好的答案", "把用户行为和成本放到桌面上", "固定问题边界，让方案保持开放"]}
      copy={[
        "“做一个智能搜索”看起来像需求，其实已经替团队选了一个答案；它没有说明谁遇到什么困难。",
        "观察到客服查历史订单要翻五页筛选，平均耗时 2 分 40 秒。现在有了用户、行为和成本这三类可以复核的事实。",
        "把事实收敛成“高频查单被分页和筛选拖慢”，再分别评估快捷筛选、批量导出和搜索。问题陈述不替方案投票。",
      ]}
    />
    <div className={styles.problemStatementBoard} aria-live="polite">
      <div className={styles.problemStatementCard} data-active={!evidenceReady} data-muted={evidenceReady}>
        {evidenceReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>{evidenceReady ? "方案便签" : "预设方案"}</strong>
        <code>做一个智能搜索</code>
        <span>{evidenceReady ? "先保留，不当作问题" : "答案先于事实"}</span>
      </div>
      <ArrowRight className={styles.problemStatementArrow} size={19} aria-hidden="true" />
      <div className={styles.problemStatementCard} data-active={evidenceReady} data-muted={!evidenceReady}>
        <ChartLineUp size={23} aria-hidden="true" />
        <strong>{evidenceReady ? "观察事实" : "证据"}</strong>
        <code>{evidenceReady ? "客服 · 5 页筛选 · 2m40s" : "谁 · 做了什么 · 花多久"}</code>
        <span>{evidenceReady ? "行为和成本可复核" : "不能只写“很痛苦”"}</span>
      </div>
      <ArrowRight className={styles.problemStatementArrow} size={19} aria-hidden="true" />
      <div className={styles.problemStatementCard} data-active={problemReady} data-muted={!problemReady}>
        {problemReady ? <CheckCircle size={23} aria-hidden="true" /> : <FileText size={23} aria-hidden="true" />}
        <strong>{problemReady ? "问题陈述" : "问题边界"}</strong>
        <code>{problemReady ? "高频查单被分页和筛选拖慢" : "场景 · 阻碍 · 影响"}</code>
        <span>{problemReady ? "快捷筛选 · 批量导出 · 搜索" : "方案仍可比较"}</span>
      </div>
      <div className={styles.problemStatementProof} data-ready={problemReady}>
        <FileText size={21} aria-hidden="true" />
        <p><strong>{problemReady ? "问题可被比较" : "问题还没站稳"}</strong>{problemReady ? " 事实和影响已固定；下一步是验证哪种方案真正改善用户结果。" : " 先把观察、解释和方案分开，避免拿功能名代替问题。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进问题陈述演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>补充证据</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={problemReady}>形成问题</button>
    </div>
  </div>;
}
