"use client";

import { useState } from "react";
import { Archive, CheckCircle, FileText, Gauge, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../AiStackCoreConcepts.module.css";

const sceneLength = 4;

export function ContextWindowLesson() {
  const scene = useScene(sceneLength);
  const [history, setHistory] = useState<"short" | "long">("short");
  useResetOnSceneStart(scene, () => setHistory("short"));
  const long = history === "long";
  const historyK = long ? 10 : 6;
  const toolsK = 3;
  const outputK = 2;
  const rawTotalK = 2 + historyK + toolsK + outputK;
  const trimmed = long && scene.step >= 3;
  const visibleHistoryK = trimmed ? 7 : historyK;
  const inputK = 2 + visibleHistoryK + toolsK;
  const totalK = 2 + visibleHistoryK + toolsK + outputK;
  const overflow = rawTotalK > 16 && !trimmed;
  const goLong = () => setHistory("long");
  const goShort = () => setHistory("short");
  const labels = ["锁定任务与回答位", "加入历史和工具", long ? "看见预算溢出" : "检查短历史余量", long ? "裁剪后再继续" : "保持当前输入"];
  const segments = [
    { label: "系统与任务", value: "2k", kind: "rules" },
    { label: trimmed ? "裁剪后的历史" : long ? "长历史" : "短历史", value: `${visibleHistoryK}k`, kind: "history" },
    { label: "工具结果", value: `${toolsK}k`, kind: "tool" },
    { label: "回答预留", value: `${outputK}k`, kind: "output" },
  ];

  return <div className={styles.windowLab} ref={scene.ref} role="region" aria-label="上下文窗口预算工作台">
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.windowBoard}>
      <div className={styles.windowShelf}>
        <div className={styles.windowShelfHeader}><span>本次请求的工作台</span><strong>上限 16k</strong></div>
        <div className={styles.windowStack} aria-label={`当前请求使用 ${totalK}k，共有 16k 容量`}>
          {segments.map((segment) => <div key={segment.kind} className={styles.windowSlice} data-kind={segment.kind} data-hidden={segment.kind === "history" && scene.step === 2 && overflow}>
            <span>{segment.label}</span><span>{segment.value}</span>
          </div>)}
        </div>
        <div className={styles.windowRuler}><span>0k</span><span>输入 {inputK}k</span><span>16k</span></div>
      </div>
      <div className={styles.windowLedger}>
        <div className={styles.windowLedgerHeader}><span>这一步发生了什么</span><Gauge size={22} aria-hidden="true" /></div>
        <dl>
          <div><dt>历史版本</dt><dd>{trimmed ? "10k → 7k" : long ? "10k" : "6k"}</dd></div>
          <div><dt>输入占用</dt><dd>{inputK}k</dd></div>
          <div><dt>回答预留</dt><dd>{outputK}k</dd></div>
        </dl>
        <p className={styles.windowVerdict} data-danger={overflow && scene.step === 2} role="status">
          {scene.step === 0 ? <><FileText size={17} aria-hidden="true" /> 先锁定系统规则和回答位；它们要从同一份预算里预留。</> : scene.step === 1 ? <><CheckCircle size={17} aria-hidden="true" /> {long ? "长历史已经加入，下一步会检查它是否挤占回答位。" : `短历史加工具结果后共 ${totalK}k，仍在 16k 内。`}</> : overflow ? <><Warning size={17} aria-hidden="true" /> 原始需求 {rawTotalK}k 超过 16k；先裁剪或摘要，不能假装整段历史都在输入里。</> : trimmed ? <><CheckCircle size={17} aria-hidden="true" /> 裁剪后实际输入与回答预留共 {totalK}k，可以继续生成。</> : <><CheckCircle size={17} aria-hidden="true" /> 短历史与回答预留共 {totalK}k，仍可继续生成。</>}
        </p>
      </div>
    </div>
    <div className={styles.memoryActions} role="group" aria-label="改变历史长度">
      <button type="button" aria-pressed={!long} onClick={goShort}>保留短历史 · 6k</button>
      <button type="button" aria-pressed={long} onClick={goLong}>带入长历史 · 10k</button>
    </div>
    <p className={styles.windowVerdict} role="status"><Archive size={17} aria-hidden="true" /> {trimmed ? "把最早一段移出窗口后，旧记录仍可留在外部存储；窗口里的实际输入已经改变。" : "窗口是这一轮输入和输出共同争用的容量；把历史存起来，不代表它自动进入下一轮。"}</p>
  </div>;
}
