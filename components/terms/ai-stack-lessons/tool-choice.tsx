"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, LockSimple, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ToolChoiceLesson() {
  const scene = useScene(4);
  const [strategy, setStrategy] = useState<"auto" | "required" | "none">("auto");
  useResetOnSceneStart(scene, () => setStrategy("auto"));
  const selected = strategy === "none" ? "不调用工具" : "calendar_update";
  const selectionText = scene.step < 2 ? "候选：calendar_read · calendar_update · web_search" : strategy === "none" ? "策略禁止调用" : strategy === "required" ? "强制指定写工具" : "自动选择写工具";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工具选择演示">
    <Caption scene={scene} labels={["请求进入", "比较候选", "应用策略", "停在执行前"]} titles={["先决定是否需要工具", "三个候选各有职责", "策略会改变可提出的选择", "选中不是执行"]} copy={["把会议改到周五，应用先给出候选工具。", "读取、更新和搜索都出现，但相关性只是路由线索。", "auto、required 和 none 是选择策略，不是权限。", "写操作还要经过参数、权限和审批，尚未改变日历。"]} />
    <div className={styles.choices} role="group" aria-label="选择工具策略">{(["auto", "required", "none"] as const).map((key) => <button key={key} type="button" aria-pressed={strategy === key} onClick={() => { setStrategy(key); scene.seek(2); }}>{key}</button>)}</div>
    <div className={styles.contract}><div><FileText size={25} /><h3>请求</h3><p>把会议改到周五</p></div><ArrowRight size={20} /><div><CheckCircle size={25} /><h3>{scene.step < 2 ? "候选工具" : selected}</h3><p>{selectionText}</p></div><ArrowRight size={20} /><div>{strategy === "none" || scene.step < 3 ? <LockSimple size={25} /> : <Warning size={25} />}<h3>{strategy === "none" ? "不执行" : "待校验"}</h3><p>{strategy === "none" ? "没有工具副作用" : "仍需参数、权限和审批"}</p></div></div>
    <p className={styles.inputExample}><strong>可观察证据</strong>选择策略只改变“提出哪个调用”，不会让模型获得工具背后的全部权限。</p>
  </div>;
}
