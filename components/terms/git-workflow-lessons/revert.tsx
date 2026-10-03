"use client";

import { ArrowCounterClockwise, ArrowRight, Check, GitCommit, GitDiff } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function RevertLesson() {
  const scene = useScene(3);
  const computed = scene.step >= 1;
  const committed = scene.step === 2;

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git revert 反向补丁与新提交演示">
    <Caption
      scene={scene}
      labels={["定位要撤销的提交", "应用反向补丁", "记录新提交"]}
      titles={["先查看 B 的实际变化", "抵消 B 的补丁，工作树接近 A", "C 记录撤销，B 仍在历史"]}
      copy={[
        "公共历史是 A → B；先确认 B 改了哪些文件，工作区保持干净。",
        "revert 计算 B 相对父提交的反向补丁；文件结果可以回到 A 的形状，但还没有新提交。",
        "新的 C 把撤销写进历史；远程 origin/main 仍要等 push，数据库或外部副作用不会自动回退。",
      ]}
    />
    <div className={styles.revertBoard} aria-live="polite">
      <div data-active={!computed || committed}>
        <GitCommit size={23} aria-hidden="true" />
        <strong>{committed ? "公共历史" : "目标提交"}</strong>
        <code>{committed ? "A → B → C" : "A → B"}</code>
        <span>{committed ? "B 保留，C 是新提交" : "先确认 B 的变化"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={computed}>
        <ArrowCounterClockwise size={23} aria-hidden="true" />
        <strong>反向补丁</strong>
        <code>{computed ? "− (B 相对 A 的变化)" : "等待选择 B"}</code>
        <span>{computed ? "工作树回到 A 的内容" : "先用 git show B 检查"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={committed}>
        {committed ? <Check size={23} aria-hidden="true" /> : <GitDiff size={23} aria-hidden="true" />}
        <strong>{committed ? "新提交 C" : "结果"}</strong>
        <code>{committed ? "A → B → C" : "等待创建提交"}</code>
        <span>{committed ? "代码变化被抵消 · push 仍未发生" : "还没有写入历史"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进 revert 流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>计算反向补丁</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={committed}>创建 revert C</button>
    </div>
  </div>;
}
