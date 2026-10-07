"use client";

import { Check, FileText, X } from "@phosphor-icons/react";
import { useEffect } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

const steps = ["放入资料", "压出整数", "拒绝字符串", "核对事实"];

export function StructuredMoldHero() {
  const scene = useScene(steps.length);
  useEffect(() => { scene.toggle(); }, []);
  const pressed = scene.step >= 1;
  const factOk = scene.step === 3;
  return <div ref={scene.ref} className={styles.moldHero} data-step={scene.step} role="img" aria-label="amount 整数字段经过模具约束，再与原始金额核对">
    <div className={styles.moldHeroTop}><span>SCHEMA PRESS / AMOUNT</span><strong>{factOk ? "FACT CHECKED" : "SHAPE ONLY"}</strong></div>
    <SceneControls scene={scene} labels={steps} compact />
    <div className={styles.moldHeroBench}>
      <div className={styles.moldSource}><FileText size={17} aria-hidden="true" /><span>原始资料</span><strong>金额 120</strong></div>
      <div className={styles.moldDie}><span>amount</span><code>integer</code><i aria-hidden="true" /></div>
      <div className={styles.moldTicket} data-pressed={pressed} data-fact={factOk}><span>{pressed ? "amount" : "候选"}</span><strong>{pressed ? "120" : "?"}</strong>{factOk ? <Check size={16} /> : <X size={16} />}</div>
    </div>
    <p className={styles.moldHeroNote}>{scene.step === 0 ? "先看资料，不急着把数字塞进对象。" : scene.step === 1 ? "整数形状通过，事实还没核对。" : scene.step === 2 ? "字符串没有通过本例的字段约束。" : "格式与资料都对上，才得到可交付的结果。"}</p>
  </div>;
}
