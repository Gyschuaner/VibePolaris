"use client";

import { Calculator, CheckCircle, FileText } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./AiAlignmentSignatureHeroes.module.css";

export function ChainOfThoughtSignatureHero() {
  const scene = useScene(4);
  const removedDiscount = scene.step >= 3;
  const total = removedDiscount ? 120 - 12 : 120 - 12 - 20;
  const labels = ["放入条件", "展开算式", "检查中间值", "删掉一项再看"];
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="思维链把退款计算的条件和中间值摊开" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.chainBoard}>
        <div className={styles.chainInputs}>
          <span>输入条件</span>
          <div className={styles.chainToken}><FileText size={16} />商品价 <b>¥120</b></div>
          <div className={styles.chainToken}><FileText size={16} />运费 <b>−¥12</b></div>
          <div className={styles.chainToken} data-removed={removedDiscount}><FileText size={16} />已用优惠 <b>−¥20</b></div>
        </div>
        <div className={styles.chainLedger}>
          <span>可审阅的中间账本</span>
          <div className={styles.chainFormula}><Calculator size={18} className={styles.icon} /><span>{scene.step === 0 ? "条件还没有展开" : removedDiscount ? "120 − 12 = 108" : "120 − 12 − 20 = 88"}</span><i>{scene.step < 2 ? "等待拆开每一项" : removedDiscount ? "优惠条件被拿掉" : "每一步都有输入"}</i></div>
          <div className={styles.chainResult}><span>退款结论</span><strong>{scene.step === 0 ? "?" : `¥${total}`}</strong>{scene.step >= 2 ? <CheckCircle size={19} className={styles.icon} /> : null}</div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "先把条件摆到同一张账本上，再谈最后的数字。" : removedDiscount ? "删掉一项后结果立刻变化；步骤让差异有地方可追。" : "中间算式变得可检查，但前提和外部证据仍要另行核对。"}</p></figcaption>
  </figure>;
}
