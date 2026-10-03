"use client";

import { ArrowRight, GitCommit, Pencil, Stack } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

function RepoCommitLesson() {
  const scene = useScene(3);
  const labels = ["看见差异", "挑进暂存区", "写入本地历史"];
  const staged = scene.step >= 1;
  const committed = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工作区到提交历史演示">
    <Caption scene={scene} labels={labels} titles={["先确认要提交什么", "只把修复放进候选", "提交写入本地历史"]} copy={["工作区有一个修复和一行格式调整；远程还看不到它们。", "暂存区只接收修复 hunk，格式调整留在工作区。", "HEAD 指向新的提交快照；远程分支仍停在旧提交，推送是另一件事。"]} />
    <div className={styles.gitBoard}><div className={styles.contract}><div><Pencil size={25} /><h3>工作区</h3><p>{committed ? "修复已提交；格式调整仍未暂存" : "修复 + 格式调整"}</p></div><div><Stack size={25} /><h3>暂存区</h3><p>{staged ? "只含修复 hunk" : "尚未选择"}</p></div><div><GitCommit size={25} /><h3>HEAD</h3><p>{committed ? "c2 · 修复按钮" : "c1 · 旧快照"}</p></div></div><div className={styles.resultFlow}><ArrowRight size={18} />{committed ? "本地提交已创建，origin/main 未改变" : staged ? "git commit 将只读取暂存内容" : "先用 diff 确认范围"}</div></div>
    <div className={styles.choices} role="group" aria-label="推进提交流程"><button type="button" onClick={() => scene.seek(1)} aria-pressed={staged}>暂存修复</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={committed}>创建提交</button></div>
  </div>;
}

export function GitWorkflowLesson({ slug }: { slug: string }) {
  return slug === "repo-commit" ? <RepoCommitLesson /> : null;
}
