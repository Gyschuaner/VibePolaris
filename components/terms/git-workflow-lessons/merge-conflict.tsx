"use client";

import { ArrowRight, GitBranch, GitCommit, GitMerge, GitPullRequest } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

const baseCode = "if (!user) return 401;\nreturn { data: ok };";
const oursCode = "if (!user) return 403;\nreturn { data: ok };";
const theirsCode = "if (!user) return 401;\nreturn { error: ok };";
const conflictCode = "<<<<<<< ours\nreturn 403;\n=======\nreturn { error: ok };\n>>>>>>> theirs";
const resolvedCode = "if (!user) return 403;\nreturn { error: ok };";

export function MergeConflictLesson() {
  const scene = useScene(3);
  const compared = scene.step >= 1;
  const resolved = scene.step === 2;
  const resultCode = resolved ? resolvedCode : compared ? conflictCode : "等待三方比较";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git 合并冲突三方比较、编辑与验证演示">
    <Caption scene={scene} labels={["共同祖先与两边改动", "冲突标记暂停合并", "组合后暂存并验证"]} titles={["先把 base、ours、theirs 放在一起", "重叠修改不能靠猜，工作区留下标记", "保留两边意图后暂存，让 Git 继续"]} copy={["base A 的校验和返回结构都还未分叉；ours 只改校验，theirs 只改返回结构。", "同一片区域出现两边修改，Git 保持 HEAD 不动并写入冲突标记；ours/theirs 只是方向标签。", "编辑出同时满足需求的结果，删除所有标记并执行 git add；继续前仍要运行相关测试。"]} />
    <div className={styles.conflictBoard} aria-live="polite">
      <div className={styles.conflictInputs} aria-label="冲突的三方输入">
        <div data-active={!compared}><GitCommit size={21} aria-hidden="true" /><strong>共同祖先 · base A</strong><code>{baseCode}</code><span>两边从这里开始</span></div>
        <div data-active={compared}><GitBranch size={21} aria-hidden="true" /><strong>ours · 当前分支</strong><code>{oursCode}</code><span>改了校验状态</span></div>
        <div data-active={compared}><GitPullRequest size={21} aria-hidden="true" /><strong>theirs · 目标分支</strong><code>{theirsCode}</code><span>改了返回结构</span></div>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div className={styles.conflictResult} data-state={resolved ? "resolved" : compared ? "conflict" : "waiting"}>
        {resolved ? <GitMerge size={23} aria-hidden="true" /> : <GitPullRequest size={23} aria-hidden="true" />}
        <strong>{resolved ? "组合后的结果" : compared ? "冲突标记" : "等待比较"}</strong>
        <code>{resultCode}</code>
        <span>{resolved ? "已暂存 · 可以继续 · 测试仍要运行" : compared ? "先理解两边意图，不要直接删标记" : "点击查看同一片区域的两种改动"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进冲突处理流程"><button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>查看冲突</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={resolved}>组合后暂存</button></div>
  </div>;
}
