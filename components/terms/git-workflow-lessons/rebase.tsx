"use client";

import { ArrowRight, GitBranch, GitCommit, GitMerge, Stack } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function RebaseLesson() {
  const scene = useScene(3);
  const moved = scene.step >= 1;
  const replayed = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git rebase 移动基线与重放提交演示">
    <Caption scene={scene} labels={["旧基线与独有提交", "移动到新基线", "逐个重放"]} titles={["先分清哪些提交属于 feature", "目标 main 已前进，旧提交暂不改名", "新父关系生成 F1′、F2′"]} copy={["main 停在 A；feature 在 A 后有 F1、F2，主线后来出现 B。", "rebase 把 feature 的起点换到 B；F1、F2 先进入待重放队列，旧对象仍能在 reflog 等历史里找到。", "按顺序把补丁应用到 B：F1 变成 F1′，F2 再基于 F1′ 变成 F2′；哈希变化，内容仍需测试。"]} />
    <div className={styles.rebaseBoard} aria-live="polite">
      <div data-active={!moved}><GitBranch size={22} aria-hidden="true" /><strong>{replayed ? "变基后提交图" : "分叉提交图"}</strong><code>{replayed ? "main A→B | feature B→F1′→F2′" : moved ? "main A→B | feature A→F1→F2" : "main A | feature A→F1→F2"}</code><span>{replayed ? "旧 F1/F2 已被新对象替代" : moved ? "main 已前进到 B" : "feature 从 A 分出"}</span></div>
      <ArrowRight size={18} aria-hidden="true" />
      <div className={styles.rebaseQueue} data-active={moved}><div><Stack size={22} aria-hidden="true" /><strong>重放队列</strong><code>{replayed ? "F1′ → F2′" : moved ? "F1 → F2" : "等待取下"}</code><span>{replayed ? "每个补丁重新套用" : moved ? "按顺序等待应用" : "先找独有提交"}</span></div><div className={styles.rebaseBase}><GitCommit size={20} aria-hidden="true" /><span>{moved ? "新基线 B" : "旧基线 A"}</span></div></div>
      <ArrowRight size={18} aria-hidden="true" />
      <div data-active={replayed}><GitMerge size={22} aria-hidden="true" /><strong>当前 feature</strong><code>{replayed ? "B → F1′ → F2′" : moved ? "B · 待重放" : "A → F1 → F2"}</code><span>{replayed ? "新父关系 · 新哈希" : moved ? "还没有完成 rebase" : "共享旧历史"}</span></div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进 rebase 流程"><button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>移动到 main</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={replayed}>逐个重放</button></div>
  </div>;
}
