"use client";

import { ArrowRight, GitBranch, GitCommit, Pencil, Stack } from "@phosphor-icons/react";
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

function BranchLesson() {
  const scene = useScene(3);
  const labels = ["共同起点", "创建指针", "两条线各自前进"];
  const split = scene.step >= 1;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git 分支指针演示">
    <Caption scene={scene} labels={labels} titles={["main 先指向共同提交", "创建分支只增加一个指针", "提交让当前分支移动"]} copy={["当前只有 main 指向 A；还没有创建 feature，也没有复制第二套文件。", "feature 指向同一个 A；切到 feature 后 HEAD 才会在它上面提交。", "feature 前进到 B，main 仍在 A；主线后来前进到 C，合并前要比较两条历史。"]} />
    <div className={styles.gitGraph} aria-label="分支提交图"><div className={styles.gitGraphRow}><span className={styles.gitNode}>A</span><span>main</span>{split && <><span className={styles.gitLine} /><span className={styles.gitNode} data-active="true">{scene.step === 2 ? "B" : "A"}</span><span>feature</span></>}</div><div className={styles.gitGraphRow}><GitBranch size={20} /><span>{split ? `HEAD → feature；两个分支共享 A${scene.step === 2 ? "，feature 已前进到 B" : "，还没有分叉"}` : "HEAD → main；当前只有一条分支"}</span></div></div>
    <div className={styles.choices} role="group" aria-label="推进分支流程"><button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>创建 feature</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={scene.step === 2}>在 feature 提交</button></div>
  </div>;
}

export function GitWorkflowLesson({ slug }: { slug: string }) {
  if (slug === "repo-commit") return <RepoCommitLesson />;
  if (slug === "branch") return <BranchLesson />;
  return null;
}
