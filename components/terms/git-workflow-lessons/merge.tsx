"use client";

import { ArrowRight, GitBranch, GitCommit, GitMerge, GitPullRequest } from "@phosphor-icons/react";
import { useState } from "react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function MergeLesson() {
  const scene = useScene(3);
  const [outcome, setOutcome] = useState<"pending" | "fast-forward" | "merge-commit">("pending");
  const compared = scene.step >= 1;
  const fastForward = scene.step === 2 && outcome === "fast-forward";
  const mergeCommit = scene.step === 2 && outcome === "merge-commit";
  const ours = fastForward || scene.step === 0 ? "A" : "D";
  const theirs = scene.step === 0 ? "A" : "F";
  const oursNote = scene.step === 0 ? "共同起点" : fastForward ? "当前分支是目标分支祖先" : "当前分支已在 A 之后前进";
  const theirsNote = scene.step === 0 ? "共同起点" : "目标分支";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git merge 三方比较与结果演示">
    <Caption scene={scene} labels={["共同祖先", "三方比较", "写入合并结果"]} titles={["先确定两条历史从哪里分开", "先看清分叉，再选择输入拓扑", fastForward ? "切到可快进前提" : mergeCommit ? "保留分叉并创建合并提交" : "选择结果"]} copy={["dev 和 feature 都从 A 开始；先把共同祖先固定下来。", "当前分叉示例是 dev=D、feature=F；两边都在 A 之后前进，所以不能把它直接说成快进。", fastForward ? "把输入换成 dev=A、feature=F 后，dev 可以直接移动到 F，不会增加 M。" : mergeCommit ? "保留 dev=D、feature=F 的分叉，新增 M 连接两条来源；两边的提交仍可追踪。" : "选择一个与提交图一致的结果：切换到可快进前提，或保留分叉创建合并提交。"]} />
    <div className={styles.mergeBoard} aria-live="polite">
      <div data-active={compared}><GitCommit size={22} aria-hidden="true" /><strong>共同祖先 · base</strong><code>A</code><span>两条分支都从这里开始</span></div>
      <div className={styles.mergeFork} aria-label="ours 与 theirs 两条分支"><div data-active={compared}><GitBranch size={22} aria-hidden="true" /><strong>ours · dev</strong><code>{ours}</code><span>{oursNote}</span></div><div data-active={compared}><GitPullRequest size={22} aria-hidden="true" /><strong>theirs · feature</strong><code>{theirs}</code><span>{theirsNote}</span></div></div>
      <ArrowRight size={18} aria-hidden="true" />
      <div data-active={fastForward || mergeCommit}><>{mergeCommit ? <GitMerge size={22} aria-hidden="true" /> : <GitCommit size={22} aria-hidden="true" />}</><strong>{fastForward ? "dev → F" : mergeCommit ? "dev → M" : "合并结果"}</strong><code>{fastForward ? "A → F" : mergeCommit ? "D + F → M" : "等待选择"}</code><span>{fastForward ? "fast-forward · 只移动指针" : mergeCommit ? "两个父提交 · 历史汇合" : "先比较三方"}</span></div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进 merge 流程"><button type="button" onClick={() => { setOutcome("pending"); scene.seek(1); }} aria-pressed={scene.step === 1}>比较分叉</button><button type="button" onClick={() => { setOutcome("fast-forward"); scene.seek(2); }} aria-pressed={fastForward}>切到可快进例</button><button type="button" onClick={() => { setOutcome("merge-commit"); scene.seek(2); }} aria-pressed={mergeCommit}>保留分叉并合并</button></div>
  </div>;
}
