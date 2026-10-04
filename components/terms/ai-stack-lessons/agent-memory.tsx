"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Database, Eraser, LockSimple, MagnifyingGlass, PencilSimple, WarningCircle, Wrench } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../AiStackCoreConcepts.module.css";

const labels = ["请求同意", "写入一条记录", "新会话取回", "本轮使用", "纠正偏好", "删除记录"];

export function AgentMemoryLesson() {
  const scene = useScene(labels.length);
  const [saved, setSaved] = useState(false);
  const [retrieved, setRetrieved] = useState(false);
  const [used, setUsed] = useState(false);
  const [corrected, setCorrected] = useState(false);
  const [deleted, setDeleted] = useState(false);
  useResetOnSceneStart(scene, () => {
    setSaved(false);
    setRetrieved(false);
    setUsed(false);
    setCorrected(false);
    setDeleted(false);
  });
  const visibleSaved = saved && scene.step >= 1;
  const visibleRetrieved = retrieved && scene.step >= 2;
  const visibleUsed = used && scene.step >= 3;
  const visibleCorrected = corrected && scene.step >= 4;
  const visibleDeleted = deleted && scene.step >= 5;
  const canRetrieve = scene.step === 1 && visibleSaved && !visibleDeleted;
  const canUse = scene.step === 2 && visibleRetrieved && !visibleDeleted;
  const canCorrect = scene.step === 3 && visibleUsed && !visibleDeleted;
  const canDelete = scene.step === 4 && visibleCorrected && !visibleDeleted;
  const save = () => { setSaved(true); setRetrieved(false); setUsed(false); setCorrected(false); setDeleted(false); scene.seek(1); };
  const retrieve = () => { if (!canRetrieve) return; setRetrieved(true); scene.seek(2); };
  const use = () => { if (!canUse) return; setUsed(true); scene.seek(3); };
  const correct = () => { if (!canCorrect) return; setCorrected(true); scene.seek(4); };
  const remove = () => { if (!canDelete) return; setDeleted(true); scene.seek(5); };
  const preference = visibleCorrected ? "Python" : "TypeScript";
  const recordLabel = visibleDeleted ? "已删除" : visibleSaved ? `${preference} · 用户同意 · 2026-10` : "空记录";
  const prerequisiteWarning = !visibleSaved && scene.step > 0
    ? "前置未满足：先点击“同意并保存”，再进入后续阶段。"
    : scene.step >= 2 && !visibleRetrieved
      ? "前置未满足：先在记忆库写入一条记录，再取回它。"
      : scene.step >= 3 && !visibleUsed
        ? "前置未满足：记录已取回，但还没有带入本轮输入。"
        : scene.step >= 4 && !visibleCorrected
          ? "前置未满足：先让取回的偏好进入本轮，再纠正它。"
          : "";
  const awaitingDelete = scene.step === 5 && visibleCorrected && !visibleDeleted;
  const notice = prerequisiteWarning || (awaitingDelete
    ? "记录已经纠正；点击“删除记录”完成最后一步，当前记录仍然存在。"
    : visibleDeleted
    ? "记录已从这个教学存储中删除；之前已经生成的回答不会被倒写。"
    : visibleCorrected
      ? "用户把偏好改成 Python；已经生成的 TypeScript 回复保持原样。"
      : visibleUsed
        ? "取回的偏好已经进入本轮输入，输出才会按它生成。"
        : visibleRetrieved
          ? "记录已经取回，但还没有使用；取回不等于模型自动看见。"
          : visibleSaved
            ? "记录存在，但还没有出现在任何新会话里。"
            : "应用先请求明确同意；当前聊天里的话不会悄悄变成长期记录。");

  return <div className={styles.memoryLab} ref={scene.ref} role="region" aria-label="智能体记忆生命周期演示">
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.memoryLane}>
      <div className={styles.memoryCard} data-active={scene.step === 0}><LockSimple size={24} aria-hidden="true" /><h3>用户决定</h3><p>“以后代码示例优先用 TypeScript。”</p><code>{visibleSaved ? "已同意保存" : "等待明确同意"}</code></div>
      <div className={styles.memoryArrow}><ArrowRight size={22} aria-hidden="true" /></div>
      <div className={styles.memoryCard} data-active={scene.step === 1 || scene.step >= 4}><Database size={24} aria-hidden="true" /><h3>持久记录</h3><p>{recordLabel}</p><code>{visibleSaved && !visibleDeleted ? "source=user · scope=code" : "store: empty"}</code></div>
      <div className={styles.memoryArrow}><ArrowRight size={22} aria-hidden="true" /></div>
      <div className={styles.memoryCard} data-active={scene.step === 2 || scene.step === 3}><MagnifyingGlass size={24} aria-hidden="true" /><h3>新会话取回</h3><p>{visibleUsed ? "偏好已带入代码任务" : visibleRetrieved ? "偏好已取回，等待带入" : "尚未取回"}</p><code>{visibleUsed ? "context += memory[0]" : visibleRetrieved ? "memory[0] ready" : "context unchanged"}</code></div>
      <div className={styles.memoryArrow}><ArrowRight size={22} aria-hidden="true" /></div>
      <div className={styles.memoryCard} data-active={scene.step === 3 || scene.step >= 4}><Wrench size={24} aria-hidden="true" /><h3>本次输出</h3><p>{visibleUsed ? "TypeScript 示例" : "等待偏好进入输入"}</p><code>{visibleUsed ? "answer.language = TypeScript" : "answer: pending"}</code></div>
    </div>
    <div className={styles.memoryActions} role="group" aria-label="执行记忆生命周期操作">
      <button type="button" onClick={save} disabled={visibleSaved && !visibleDeleted} aria-pressed={visibleSaved && !visibleDeleted}><PencilSimple size={16} aria-hidden="true" />同意并保存</button>
      <button type="button" onClick={retrieve} disabled={!canRetrieve} aria-pressed={visibleRetrieved}><MagnifyingGlass size={16} aria-hidden="true" />新会话取回</button>
      <button type="button" onClick={use} disabled={!canUse} aria-pressed={visibleUsed}><CheckCircle size={16} aria-hidden="true" />带入本轮</button>
      <button type="button" onClick={correct} disabled={!canCorrect} aria-pressed={visibleCorrected}><Wrench size={16} aria-hidden="true" />纠正偏好</button>
      <button type="button" onClick={remove} disabled={!canDelete} aria-pressed={visibleDeleted}><Eraser size={16} aria-hidden="true" />删除记录</button>
    </div>
    <p className={styles.memoryNotice} data-danger={Boolean(prerequisiteWarning)} role="status">{prerequisiteWarning ? <WarningCircle size={17} aria-hidden="true" /> : <CheckCircle size={17} aria-hidden="true" />} {notice}</p>
  </div>;
}
