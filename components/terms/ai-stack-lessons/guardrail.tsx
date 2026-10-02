"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, LockSimple, Warning, X } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function GuardrailLesson() {
  const scene = useScene(4);
  const [mode, setMode] = useState<"mask" | "block">("mask");
  useResetOnSceneStart(scene, () => setMode("mask"));
  const result = mode === "mask" ? "138****9021" : "已拦截：包含敏感字段";
  const scanned = scene.step >= 1;
  const handled = scene.step >= 3;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="护栏演示">
    <Caption scene={scene} labels={["数据进入", "扫描字段", "执行规则", "产生结果"]} titles={["护栏只检查指定位置", "识别 12 个手机号字段", "规则决定放行、改写或拦截", "结果不能越过权限边界"]} copy={["导出表有 12 条记录，每条含一个手机号。", scanned ? "输出检查找到敏感字段，尚未改变原始数据。" : "扫描尚未开始。", mode === "mask" ? "脱敏规则把完整号码改成后四位。" : "禁止规则直接阻断导出。", handled ? `${mode === "mask" ? "12 条脱敏记录放行" : "导出停止"}；权限仍由另一层校验。` : "处置结果将在规则执行后出现。"]} />
    <div className={styles.choices}><button type="button" aria-pressed={mode === "mask"} onClick={() => { setMode("mask"); scene.seek(2); }}>脱敏放行</button><button type="button" aria-pressed={mode === "block"} onClick={() => { setMode("block"); scene.seek(2); }}>命中即阻断</button></div>
    <div className={styles.contract}><div><FileText size={25} /><h3>12 条记录</h3><p>手机号字段</p></div><ArrowRight size={20} /><div><Warning size={25} /><h3>规则检查</h3><p>{!scanned ? "尚未扫描" : scene.step === 1 ? "扫描中" : "命中 12 个"}</p></div><ArrowRight size={20} /><div>{handled ? mode === "mask" ? <CheckCircle size={25} /> : <X size={25} /> : <LockSimple size={25} />}<h3>{handled ? mode === "mask" ? "脱敏结果" : "输出阻断" : "等待处置"}</h3><p>{handled ? result : "规则尚未给出结果"}</p></div></div>
  </div>;
}
