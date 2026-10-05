"use client";

import { useState } from "react";
import { ArrowsClockwise, CheckCircle, Database, Eye, GitBranch, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./EventualConsistencyConcept.module.css";

const labels = ["写入提交", "立即读取", "选择一致性", "等待收敛"];
type ReadMode = "eventual" | "strong";
type WriteMode = "single" | "conflict";

export function EventualConsistencyLesson() {
  const scene = useScene(labels.length);
  const [readMode, setReadMode] = useState<ReadMode>("eventual");
  const [writeMode, setWriteMode] = useState<WriteMode>("single");
  const eventual = readMode === "eventual";
  const conflict = writeMode === "conflict";
  const final = scene.step === labels.length - 1;
  const stale = eventual && scene.step >= 1 && !final;
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const result = final ? (conflict ? "reconciled" : "converged") : stale ? "可能旧读" : scene.step >= 1 ? "最新" : "已写入";

  return <div ref={scene.ref} className={styles.eventualLab} role="region" aria-label="最终一致性旧读、强读与并发冲突工作台">
    <div className={styles.eventualLabHeader}><span>只换读取方式和写入者数量</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.eventualLabControls} role="group" aria-label="改变一致性条件">
      <button type="button" className={styles.eventualLabButton} aria-pressed={eventual} onClick={() => reset(() => setReadMode("eventual"))}>读任一副本</button>
      <button type="button" className={styles.eventualLabButton} aria-pressed={!eventual} onClick={() => reset(() => setReadMode("strong"))}>同区强读</button>
      <button type="button" className={styles.eventualLabButton} aria-pressed={!conflict} onClick={() => reset(() => setWriteMode("single"))}>单地写入</button>
      <button type="button" className={styles.eventualLabButton} aria-pressed={conflict} onClick={() => reset(() => setWriteMode("conflict"))}>两地同时写</button>
    </div>
    <div className={styles.eventualLabGrid}>
      <div className={styles.eventualLabPanel} data-active={scene.step === 0}>
        <div className={styles.eventualLabLabel}><Database size={16} aria-hidden="true" /><span>写入</span></div>
        <h3>{conflict ? "A: paid / B: cancelled" : "A: paid"}</h3>
        <div className={styles.eventualLabWrite}><span>订单 A17</span><strong>{scene.step >= 0 ? "200 OK" : "—"}</strong></div>
        <small>{conflict ? "两个地区都接受了写入，顺序需要裁决。" : "写入副本先返回成功。"}</small>
      </div>
      <div className={styles.eventualLabPanel + " " + styles.eventualLabRead} data-active={scene.step === 1 || scene.step === 2} data-danger={stale}>
        <div className={styles.eventualLabLabel}><Eye size={16} aria-hidden="true" /><span>读取</span></div>
        <h3>{eventual ? "任一副本" : "同区强读"}</h3>
        <div className={styles.eventualLabReadBox}><strong>{stale ? "pending" : scene.step >= 1 ? "paid" : "等待"}</strong><small>{stale ? "复制尚未到达" : eventual ? "副本已追上" : "读取最新已提交值"}</small></div>
        <small>{eventual ? "便宜、低延迟，但允许窗口内旧读。" : "只在支持的同区路径使用，不等于跨区都强。"}</small>
      </div>
      <div className={styles.eventualLabPanel + " " + styles.eventualLabResolve} data-active={scene.step === 3} data-danger={conflict && final}>
        <div className={styles.eventualLabLabel}><GitBranch size={16} aria-hidden="true" /><span>收敛规则</span></div>
        <h3>{conflict ? (final ? "last writer wins" : "冲突待裁决") : final ? "副本对齐" : "等待复制"}</h3>
        <div className={styles.eventualLabResolveBox}><span>{conflict ? "paid ↔ cancelled" : "paid → paid"}</span><strong>{conflict ? (final ? "reconciled" : "conflict") : final ? "same" : "replicating"}</strong></div>
        <small>{conflict ? "这是示例规则；业务优先级可能需要应用层解决。" : "没有新写入后，状态最终一致。"}</small>
      </div>
    </div>
    <div className={styles.eventualLabMetrics}>
      <div><span>当前读值</span><strong>{result}</strong></div>
      <div><span>读取成本</span><strong>{eventual ? "较低" : "较高"}</strong></div>
      <div><span>并发冲突</span><strong>{conflict ? "需要规则" : "无"}</strong></div>
    </div>
    <p className={styles.eventualLabNote} data-danger={stale || (conflict && final)} role="status">
      {stale ? <><WarningCircle size={17} aria-hidden="true" /><span>写入已经返回成功，但任一副本可能还没追上。不要把一次旧读直接解释成“写入失败”，也不要把它当作永远会在某个固定秒数内完成。</span></> : conflict && final ? <><GitBranch size={17} aria-hidden="true" /><span>副本可以最终对齐，但 last writer wins 只是一种裁决规则；如果业务不能接受覆盖，就要把冲突带回应用层。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>等到没有新写入后，副本收敛到同一个值；产品仍要说明用户在收敛窗口里能看到什么。</span></> : <><ArrowsClockwise size={17} aria-hidden="true" /><span>先分开“写入成功”“读到什么”和“副本何时对齐”，再选择能承受的读取一致性。</span></>}
    </p>
  </div>;
}
