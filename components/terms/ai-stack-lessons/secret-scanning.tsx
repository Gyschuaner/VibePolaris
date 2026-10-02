"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Key } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function SecretScanningLesson() {
  const scene = useScene(4);
  const [scope, setScope] = useState<"current" | "history">("current");
  const [revoked, setRevoked] = useState(false);
  useEffect(() => {
    if (scene.step === 0) { setScope("current"); setRevoked(false); }
    if (scene.step === 1 || scene.step === 2) { setScope("history"); setRevoked(false); }
    if (scene.step === 3) { setScope("history"); setRevoked(true); }
  }, [scene.step]);
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="密钥扫描历史与处置演示">
    <Caption scene={scene} labels={["扫描当前提交", "查看提交历史", "阻断推送", "撤销并轮换"]} titles={["当前树命中 1 处", "历史仍有 3 处", "密钥不能进入仓库", "旧值失效，新值可审计"]} copy={["示例值只显示为掩码；扫描器依据格式、模式和供应商规则标记疑似凭据。", "删除最新文件不会改写旧提交，完整历史仍有 3 个位置。", "push protection 在提交到达远端前暂停，开发者需要移除或说明误报。", revoked ? "状态 active → revoked；新密钥进入秘密存储，保留轮换记录。" : "先撤销旧值，再分发新值；仅改变量名不能解除已经泄露的权限。"]} />
    <div className={styles.choices} role="group" aria-label="扫描范围与处置"><button type="button" onClick={() => { setScope("current"); scene.seek(0); }} aria-pressed={scope === "current"}>当前树（1）</button><button type="button" onClick={() => { setScope("history"); scene.seek(1); }} aria-pressed={scope === "history"}>全历史（3）</button><button type="button" onClick={() => { setRevoked(true); scene.seek(3); }} aria-pressed={revoked}><Key size={16} />撤销旧值</button></div>
    <div className={styles.timeline}><span>C1 · <code>sk_live_••••</code></span><ArrowRight size={18} /><span>C2 · <code>sk_live_••••</code></span><ArrowRight size={18} /><span>C3 · {scene.step >= 2 ? "push blocked" : "current"}</span></div>
    <p className={styles.inputExample}><strong>扫描证据</strong>当前范围 {scope === "current" ? "1" : "3"} 处命中；凭据状态：{revoked ? "revoked，已生成 rotation-18" : "active（需要立即撤销）"}。</p>
  </div>;
}
