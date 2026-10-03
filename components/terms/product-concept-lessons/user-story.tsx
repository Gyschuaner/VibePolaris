"use client";

import { ArrowRight, CheckCircle, ClipboardText, FileText, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function UserStoryLesson() {
  const scene = useScene(3);
  const storyReady = scene.step >= 1;
  const acceptanceReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从功能名补齐用户故事和验收结果演示">
    <Caption
      scene={scene}
      labels={["只有功能名", "写成用户故事", "展开验收结果"]}
      titles={["先发现缺少谁和为什么", "让角色、任务和目标连起来", "把结果写成可以检查的证据"]}
      copy={[
        "“增加导出按钮”只描述了一个方案动作；没有用户角色和目标，团队无法判断它要解决什么问题。",
        "把经过研究的需要写成一句话：作为财务人员，我想按月下载账单，以便在结算前核对金额。",
        "验收结果把目标变成检查清单：选定月份能下载 CSV；没有账单时显示空状态。故事完成不等于设计稿完成。",
      ]}
    />
    <div className={styles.userStoryBoard} aria-live="polite">
      <div className={styles.userStoryCard} data-active={!storyReady} data-muted={storyReady}>
        {storyReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>功能便签</strong>
        <code>增加导出按钮</code>
        <span>{storyReady ? "保留为方案线索" : "角色和目标缺失"}</span>
      </div>
      <ArrowRight className={styles.userStoryArrow} size={19} aria-hidden="true" />
      <div className={styles.userStoryCard} data-active={storyReady} data-muted={!storyReady}>
        <UserCircle size={23} aria-hidden="true" />
        <strong>{storyReady ? "用户故事" : "需要补齐"}</strong>
        <code>{storyReady ? "财务人员 · 按月下载账单" : "谁 · 做什么 · 为什么"}</code>
        <span>{storyReady ? "以便结算前核对金额" : "不能只套 As a 模板"}</span>
      </div>
      <ArrowRight className={styles.userStoryArrow} size={19} aria-hidden="true" />
      <div className={styles.userStoryCard} data-active={acceptanceReady} data-muted={!acceptanceReady}>
        {acceptanceReady ? <CheckCircle size={23} aria-hidden="true" /> : <ClipboardText size={23} aria-hidden="true" />}
        <strong>{acceptanceReady ? "验收结果" : "完成边界"}</strong>
        <code>{acceptanceReady ? "CSV 下载 · 空状态" : "可观察的结果"}</code>
        <span>{acceptanceReady ? "测试可以逐项确认" : "还不能宣布完成"}</span>
      </div>
      <div className={styles.userStoryProof} data-ready={acceptanceReady}>
        <ClipboardText size={21} aria-hidden="true" />
        <p><strong>{acceptanceReady ? "故事已可交付" : "故事尚未完整"}</strong>{acceptanceReady ? " 角色、目标和结果都能被团队复述；视觉方案与异常规则另行讨论。" : " 先找到真实需要，再决定故事要写到哪里。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进用户故事演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>补全用户故事</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={acceptanceReady}>展开验收结果</button>
    </div>
  </div>;
}
