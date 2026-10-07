"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, MagnifyingGlass, Wrench, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ModelOutputConcepts.module.css";

const steps = ["生成计划", "构建完成", "测试返回", "阻塞部署", "插入修复"];

export function PlanAndExecuteLesson() {
  const scene = useScene(steps.length);
  const [failed, setFailed] = useState(false);
  const [repaired, setRepaired] = useState(false);
  useResetOnSceneStart(scene, () => { setFailed(false); setRepaired(false); });
  const blocked = failed && !repaired;
  const testLabel = scene.step < 2 ? "等待测试" : blocked ? "11/12 · 失败" : "12/12 · 通过";
  const tiles = [
    { label: "构建", icon: FileText, state: scene.step < 1 ? "pending" : "done", note: scene.step < 1 ? "待执行" : "产物已留" },
    { label: repaired ? "复测" : "测试", icon: MagnifyingGlass, state: scene.step < 2 ? "pending" : blocked ? "failed" : "done", note: testLabel },
    { label: "部署", icon: LockSimple, state: blocked || scene.step < 3 ? "locked" : "ready", note: blocked ? "后继锁定" : scene.step < 3 ? "等测试" : "可执行" },
  ];
  if (repaired) tiles.splice(2, 0, { label: "修复", icon: Wrench, state: "done", note: "变更已留痕" });
  return <div ref={scene.ref} className={`${styles.lab} ${styles.blueprintLab}`} role="region" aria-label="规划与执行蓝图演示">
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.blueprintDesk}><div className={styles.blueprintHeader}><span>发布蓝图 · 每一步都要有回执</span><strong>{blocked ? "计划已改写" : repaired ? "修复后复测" : "原计划"}</strong></div><div className={styles.blueprintTiles}>{tiles.map(({ label, icon: Icon, state, note }, index) => <div key={`${label}-${index}`} className={styles.blueprintLessonTile} data-state={state}><Icon size={20}/><strong>{label}</strong><small>{note}</small></div>)}</div><div className={styles.blueprintLedger}><span>{blocked ? <WarningCircle size={17}/> : repaired ? <CheckCircle size={17}/> : <ArrowRight size={17}/>} {blocked ? "测试失败，部署没有执行资格" : repaired ? "复测通过，部署重新排队" : "完成证据沿依赖向后解锁"}</span><code>{blocked ? "insert → fix → retest" : repaired ? "retest: 12/12" : "build → test → deploy"}</code></div></div>
    <div className={styles.blueprintActions}><button type="button" onClick={() => { setFailed(true); setRepaired(false); scene.seek(2); }} disabled={scene.step < 1 || blocked}>模拟测试失败</button>{blocked && <button type="button" onClick={() => { setRepaired(true); scene.seek(4); }}>插入修复并重测</button>}</div>
    <p className={styles.blueprintStatus} role="status">{blocked ? "失败结果返回计划器，后继步骤锁住；修复必须成为新的可检查步骤。" : repaired ? "修复和复测都有自己的证据，部署才重新获得入口。" : "构建通过只解锁测试，计划上的部署仍然等待测试回执。"}</p>
  </div>;
}
