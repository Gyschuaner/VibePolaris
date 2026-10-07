"use client";

import { Calculator, ChartLine, CheckCircle, FileText, GitBranch, WarningCircle } from "@phosphor-icons/react";
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


export function SelfConsistencySignatureHero() {
  const scene = useScene(4);
  const labels = ["摆出同一道题", "采样三条路径", "只取最后答案", "加入共同误读"];
  const noisy = scene.step === 3;
  const counts = noisy ? { fortyTwo: 3, fortyThree: 0 } : { fortyTwo: scene.step < 2 ? 0 : 2, fortyThree: scene.step < 2 ? 0 : 1 };
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="自洽性采样把多条推理路径归并成答案票数" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.consistencyBoard}>
        <div className={styles.pathStack}>
          <span>同一个问题</span>
          {["路径 A · 42", "路径 B · 43", "路径 C · 42"].map((path, index) => <div className={styles.pathCard} key={path} data-visible={scene.step >= 1} data-noisy={noisy && index === 1}><GitBranch size={15} /><strong>{noisy && index === 1 ? "路径 B · 42" : path}</strong><small>{scene.step < 1 ? "等待采样" : index === 1 && noisy ? "共同读错单位" : "各自推理，最后交答案"}</small></div>)}
        </div>
        <div className={styles.voteBoard}>
          <span>答案归并，不比较文风</span>
          <div className={styles.voteBars}><div><b style={{ height: `${Math.max(8, counts.fortyTwo * 25)}%` }} /><strong>42 · {counts.fortyTwo} 票</strong></div><div><b style={{ height: `${Math.max(8, counts.fortyThree * 25)}%` }} /><strong>43 · {counts.fortyThree} 票</strong></div></div>
          <div className={styles.voteResult} data-warn={noisy}><ChartLine size={18} /><span>{scene.step < 2 ? "还没有答案" : noisy ? "多数也可能共享错误" : "路径共识：42"}</span>{noisy ? <WarningCircle size={18} /> : scene.step >= 2 ? <CheckCircle size={18} /> : null}</div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "先让路径各自走，不要把第一条写得更长就当成共识。" : noisy ? "票数只能说明路径一致；共同的错误前提仍要用外部检查拆开。" : "归并最后答案可以减少单一路径的偶然性，但要记录采样条件。"}</p></figcaption>
  </figure>;
}
