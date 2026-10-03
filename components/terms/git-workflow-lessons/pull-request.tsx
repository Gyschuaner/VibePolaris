"use client";

import { ArrowRight, CheckCircle, ChatCircle, GitDiff, GitPullRequest, LockSimple } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function PullRequestLesson() {
  const scene = useScene(3);
  const opened = scene.step >= 1;
  const merged = scene.step === 2;

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Pull request 源分支、评审与合并门禁演示">
    <Caption
      scene={scene}
      labels={["选择源分支与目标分支", "评审差异并跑检查", "满足条件后合并"]}
      titles={["先说明 feature 要进入 main", "同一 PR 汇总评论、diff 和 checks", "门禁通过才改变目标分支"]}
      copy={[
        "feature 有两个提交，main 仍在旧基线；创建 PR 只是提出比较，不会直接修改 main。",
        "PR #18 展示当前 diff、评论和 CI 状态；新提交推到 feature 后，检查和比较结果会重新更新。",
        "只有评审、必需检查和分支保护都通过，才把结果写入 main；合并后仍要单独处理部署。",
      ]}
    />
    <div className={styles.pullRequestBoard} aria-live="polite">
      <div data-active={!opened || merged}>
        <GitPullRequest size={23} aria-hidden="true" />
        <strong>{merged ? "目标分支 main" : "源分支 feature"}</strong>
        <code>{merged ? "main ← PR #18" : "feature · F1 → F2"}</code>
        <span>{merged ? "目标分支已接收结果" : "提交尚未进入 main"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div className={styles.prReviewStack} data-active={opened}>
        <div>
          <GitDiff size={23} aria-hidden="true" />
          <strong>{opened ? "PR #18" : "待创建 PR"}</strong>
          <code>{opened ? "feature → main" : "source / base 未选择"}</code>
          <span>{opened ? "Files changed · comments · checks" : "先确定两个分支"}</span>
        </div>
        <div className={styles.prReviewMeta}>
          <ChatCircle size={19} aria-hidden="true" />
          <span>{opened ? merged ? "approve · checks passed" : "评论中 · CI running" : "等待评审"}</span>
        </div>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={merged} data-blocked={!merged}>
        {merged ? <CheckCircle size={23} aria-hidden="true" /> : <LockSimple size={23} aria-hidden="true" />}
        <strong>{merged ? "合并完成" : "合并闸门"}</strong>
        <code>{merged ? "feature → main" : "draft / review / checks"}</code>
        <span>{merged ? "代码进入 main · 部署另行验证" : "条件未齐，不能改变 main"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进 pull request 流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>创建 PR #18</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={merged}>满足条件后合并</button>
    </div>
  </div>;
}
