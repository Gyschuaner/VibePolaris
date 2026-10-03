"use client";

import { ArrowRight, ChatCircleText, CheckCircle, FileText, GitDiff, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function CodeReviewLesson() {
  const scene = useScene(3);
  const inspected = scene.step >= 1;
  const actionable = scene.step === 2;

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="代码评审从目标、差异到可行动意见演示">
    <Caption
      scene={scene}
      labels={["确认目标与场景", "读 diff 与上下文", "提交可行动结论"]}
      titles={["先知道要保护什么行为", "同一处改动要连着输入和影响看", "意见指向复现和测试，而不是偏好"]}
      copy={[
        "验收目标是空数组返回空结果；当前改动涉及结果解析，先不要从格式偏好开始。",
        "Files changed 显示读取 items[0] 的变化；“这里不好”没有触发条件，“空数组触发 500”可以复现。",
        "提交 request changes：说明输入、实际影响、预期结果，并要求补回归测试；修复后还要重新验证。",
      ]}
    />
    <div className={styles.reviewBoard} aria-live="polite">
      <div data-active={!inspected || actionable}>
        <FileText size={23} aria-hidden="true" />
        <strong>{actionable ? "验收目标" : "问题目标"}</strong>
        <code>items = []</code>
        <span>{actionable ? "应返回空结果" : "先确认输入与预期"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div className={styles.reviewDiff} data-active={inspected}>
        <div>
          <GitDiff size={23} aria-hidden="true" />
          <strong>Files changed</strong>
          <code>{inspected ? "items[0] → 结果解析" : "等待打开 diff"}</code>
          <span>{inspected ? "上下文：空数组没有第一个元素" : "先定位变化"}</span>
        </div>
        <div className={styles.reviewComment}>
          <ChatCircleText size={19} aria-hidden="true" />
          <span>{inspected ? "“这里不好” vs “空数组触发 500”" : "等待评论"}</span>
        </div>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={actionable} data-blocked={!actionable}>
        {actionable ? <CheckCircle size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>{actionable ? "Request changes" : "评审结论"}</strong>
        <code>{actionable ? "空数组 → 500 · 加回归测试" : "等待可复现证据"}</code>
        <span>{actionable ? "输入、影响、预期和验证方式齐全" : "不能把个人偏好写成缺陷"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进代码评审流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>打开 diff</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={actionable}>提交可行动意见</button>
    </div>
  </div>;
}
