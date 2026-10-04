"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Database, Eraser, LockSimple, MagnifyingGlass, PencilSimple } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../AiStackCoreConcepts.module.css";

const labels = ["请求同意", "写入一条记录", "新会话取回", "纠正并删除"];

export function AgentMemoryLesson() {
  const scene = useScene(labels.length);
  const [saved, setSaved] = useState(false);
  const [retrieved, setRetrieved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  useResetOnSceneStart(scene, () => { setSaved(false); setRetrieved(false); setDeleted(false); });
  const canRetrieve = saved && !deleted;
  const canDelete = saved && !deleted;
  const save = () => { setSaved(true); setDeleted(false); setRetrieved(false); scene.seek(1); };
  const retrieve = () => { if (!canRetrieve) return; setRetrieved(true); scene.seek(2); };
  const remove = () => { if (!canDelete) return; setDeleted(true); setRetrieved(false); scene.seek(3); };
  const recordLabel = deleted ? "已删除" : saved ? "TypeScript · 用户同意 · 2026-10" : "空记录";
  const notice = deleted ? "记录已从这个教学存储中删除；之前已经生成的回答不会被倒写。" : retrieved ? "这条记录被明确取回，才进入新会话的本轮输入。" : saved ? "记录存在，但还没有自动出现在任何新会话里。" : "应用先请求同意；当前聊天里的话不会悄悄变成长期记录。";

  return <div className={styles.memoryLab} ref={scene.ref} role="region" aria-label="智能体记忆生命周期演示">
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.memoryLane}>
      <div className={styles.memoryCard} data-active={scene.step === 0}><LockSimple size={24} aria-hidden="true" /><h3>用户决定</h3><p>“以后代码示例优先用 TypeScript。”</p><code>{saved ? "已同意保存" : "等待明确同意"}</code></div>
      <div className={styles.memoryArrow}><ArrowRight size={22} aria-hidden="true" /></div>
      <div className={styles.memoryCard} data-active={scene.step === 1}><Database size={24} aria-hidden="true" /><h3>持久记录</h3><p>{recordLabel}</p><code>{saved && !deleted ? "source=user · scope=code" : "store: empty"}</code></div>
      <div className={styles.memoryArrow}><ArrowRight size={22} aria-hidden="true" /></div>
      <div className={styles.memoryCard} data-active={scene.step >= 2}><MagnifyingGlass size={24} aria-hidden="true" /><h3>本轮输入</h3><p>{retrieved ? "偏好已带入代码任务" : "尚未取回"}</p><code>{retrieved ? "context += memory[0]" : "context unchanged"}</code></div>
    </div>
    <div className={styles.memoryActions} role="group" aria-label="执行记忆操作">
      <button type="button" onClick={save} aria-pressed={saved && !deleted}><PencilSimple size={16} aria-hidden="true" />同意并保存</button>
      <button type="button" onClick={retrieve} disabled={!canRetrieve} aria-pressed={retrieved}><MagnifyingGlass size={16} aria-hidden="true" />新会话取回</button>
      <button type="button" onClick={remove} disabled={!canDelete} aria-pressed={deleted}><Eraser size={16} aria-hidden="true" />纠正并删除</button>
    </div>
    <p className={styles.memoryNotice} data-danger={!saved && scene.step === 3} role="status"><CheckCircle size={17} aria-hidden="true" /> {notice}</p>
  </div>;
}
