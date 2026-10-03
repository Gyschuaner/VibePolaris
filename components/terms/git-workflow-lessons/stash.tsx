"use client";

import { ArrowRight, Check, FileText, GitBranch, Stack, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function StashLesson() {
  const scene = useScene(3);
  const saved = scene.step >= 1;
  const restored = scene.step === 2;

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git stash 保存、切换与恢复演示">
    <Caption
      scene={scene}
      labels={["工作区有未完成修改", "创建本地 stash", "换分支后恢复现场"]}
      titles={["先分清工作树、index 和未跟踪文件", "保存后回到 HEAD，记录留在本地栈", "apply 先验证，pop 成功后才移除"]}
      copy={[
        "feature 上有已跟踪的 theme.css 修改和一项已暂存修复；mock.json 未跟踪，默认不会一起进入 stash。",
        "git stash push 把工作树与 index 保存成 stash@{0}，工作区回到 HEAD；需要未跟踪文件时要明确加 -u。",
        "临时切到 fix 处理完紧急修复后，先回到 feature 再 apply/pop；如果目标分支改过同一区域，先处理冲突，记录仍然保留。",
      ]}
    />
    <div className={styles.stashBoard} aria-live="polite">
      <div data-active={!saved}>
        <GitBranch size={23} aria-hidden="true" />
        <strong>{restored ? "回到分支 feature" : "当前分支 feature"}</strong>
        <code>{restored ? "theme.css + 修复已恢复" : saved ? "HEAD · 工作区干净" : "theme.css 改动 · index 有修复"}</code>
        <span>{restored ? "在正确上下文重新合入现场" : saved ? "可以临时切到 fix" : "mock.json 未跟踪"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div className={styles.stashStack} data-active={saved}>
        <div>
          <Stack size={23} aria-hidden="true" />
          <strong>{saved ? "stash@{0}" : "stash 栈"}</strong>
          <code>{saved ? "工作树 + index" : "等待 git stash push"}</code>
          <span>{saved ? "-u 才包含 mock.json" : "本地临时记录，不是远程提交"}</span>
        </div>
        <div className={styles.stashNote}>
          <FileText size={19} aria-hidden="true" />
          <span>{saved ? "stash show 可检查差异" : "先确认保存范围"}</span>
        </div>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={restored} data-state={restored ? "restored" : "waiting"}>
        {restored ? <Check size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>{restored ? "apply / pop" : "目标分支 fix"}</strong>
        <code>{restored ? "应用差异 · 冲突时记录仍在" : saved ? "等待切换并恢复" : "还没有可恢复记录"}</code>
        <span>{restored ? "apply 保留 · pop 成功后移除" : "先完成 stash"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进 stash 流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>创建 stash</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={restored}>切换后恢复</button>
    </div>
  </div>;
}
