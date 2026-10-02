"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, LockSimple, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function FineTuningLesson() {
  const scene = useScene(3);
  const [epoch, setEpoch] = useState(1);
  useResetOnSceneStart(scene, () => setEpoch(1));
  const train = [0.84, 0.58, 0.39, 0.30][epoch - 1];
  const validation = [0.71, 0.78, 0.83, 0.80][epoch - 1];
  const overfit = epoch === 4;
  const best = epoch === 3;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="微调训练与验证演示">
    <Caption scene={scene} labels={["验证基线", "更新参数", "检查泛化"]} titles={["先保留未参与训练的数据", "训练损失下降不是全部证据", overfit ? "验证回落提示过拟合" : best ? "验证达到当前最佳" : "验证结果还要继续比较"]} copy={["200 条工单用于训练，另一份验证集先测得 71%。", `第 ${epoch} 轮训练损失为 ${train.toFixed(2)}；训练损失只描述训练样本。`, overfit ? "训练损失继续下降而验证准确率从 83% 回落到 80%，应停止追加训练。" : best ? "验证准确率达到 83%，还要保留独立测试和成本记录。" : `验证准确率为 ${(validation * 100).toFixed(0)}%，暂不能只凭训练数字宣布成功。`]} />
    <label className={styles.inputExample}>训练轮数 {epoch}<input type="range" min="1" max="4" step="1" value={epoch} onChange={(event) => { setEpoch(Number(event.target.value)); scene.seek(2); }} /></label>
    <div className={styles.contract}><div><h3>训练损失</h3><p>{scene.step === 0 ? "未训练" : train.toFixed(2)}</p></div><ArrowRight size={20} /><div><h3>验证准确率</h3><p>{(validation * 100).toFixed(0)}%</p></div><ArrowRight size={20} /><div>{scene.step === 0 ? <LockSimple size={25} /> : overfit ? <Warning size={25} /> : <CheckCircle size={25} />}<h3>{scene.step === 0 ? "基线" : overfit ? "过拟合信号" : best ? "当前最佳" : "继续评估"}</h3><p>{scene.step === 0 ? "先测独立验证集" : overfit ? "停止追加训练" : "还不是上线证明"}</p></div></div>
    <p className={styles.inputExample}><strong>零基础提示</strong>训练损失表示模型在训练样本上的错误程度；验证准确率表示它在未参与训练的数据上答对多少，两个数字要一起看。</p>
    <p className={styles.inputExample}><strong>范围</strong>微调改变训练阶段的参数行为，不会自动带来实时知识；提示词和检索解决的是不同问题。</p>
  </div>;
}
