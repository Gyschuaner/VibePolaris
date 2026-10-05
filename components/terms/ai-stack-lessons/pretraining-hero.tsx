"use client";

import { ArrowRight, ArrowsClockwise, Brain, CheckCircle, FileText, Target, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./PretrainingConcept.module.css";

const heroSteps = [
  { label: "切开语料", title: "先把一行话切成练习格", detail: "每个 token 都有位置，目标还没有揭晓。", Icon: FileText },
  { label: "摆上目标", title: "给这一次猜测一个可对照的目标", detail: "自回归目标是下一个 token，掩码目标是被遮住的 token。", Icon: Target },
  { label: "算出损失", title: "把猜测和目标之间的差距量出来", detail: "loss 是这道练习题的误差，不是事实评分。", Icon: Brain },
  { label: "拨动参数", title: "沿着梯度只改一小格", detail: "一次 batch 结束，参数才有机会朝新方向移动。", Icon: ArrowsClockwise },
];

const tokens = ["退款", "需", "在", "七日内", "申请"];
const guesses = [
  { label: "三日内", value: "18%" },
  { label: "七日内", value: "62%" },
  { label: "十五日内", value: "20%" },
];

export function PretrainingHero() {
  const scene = useScene(heroSteps.length);
  const current = heroSteps[scene.step];

  return <figure ref={scene.ref} className={styles.pretrainingHero} data-step={scene.step} aria-label="预训练如何从语料生成目标、计算损失并更新参数">
    <div className={styles.pretrainingHeroHeader}><span>一张语料卡怎样变成一次参数更新</span><strong>token → target → loss → weight</strong></div>
    <SceneControls scene={scene} labels={heroSteps.map((step) => step.label)} />
    <div className={styles.pretrainingHeroWorkbench}>
      <div className={styles.pretrainingHeroPaper} data-active={scene.step === 0 || scene.step === 1}>
        <div className={styles.pretrainingHeroLabel}><FileText size={17} aria-hidden="true" /><span>语料 · 一行练习题</span></div>
        <h3>退款需在七日内申请</h3>
        <div className={styles.pretrainingHeroTokens}>
          {tokens.map((token, index) => <span key={token} className={styles.pretrainingHeroToken} data-target={index === 3 && scene.step >= 1} data-visible={scene.step >= 0}>{token}</span>)}
        </div>
        <small>{scene.step >= 1 ? "目标格：七日内" : "先保留顺序，再决定要猜哪一格"}</small>
      </div>
      <ArrowRight className={styles.pretrainingHeroArrow} size={24} aria-hidden="true" />
      <div className={styles.pretrainingHeroGuess} data-active={scene.step === 2}>
        <div className={styles.pretrainingHeroLabel}><Brain size={17} aria-hidden="true" /><span>模型 · 当前猜测</span></div>
        <h3>{scene.step >= 1 ? "下一格最像哪一个？" : "等待目标"}</h3>
        <div className={styles.pretrainingHeroGuessList}>
          {guesses.map((guess) => <div key={guess.label} className={styles.pretrainingHeroGuessRow} data-revealed={scene.step >= 2} data-hit={guess.label === "七日内" && scene.step >= 2}>
            <span>{guess.label}</span><i><b style={{ width: guess.value }} /></i><small>{scene.step >= 2 ? guess.value : "—"}</small>
          </div>)}
        </div>
        <div className={styles.pretrainingHeroLoss} data-visible={scene.step >= 2}><span>loss</span><strong>{scene.step >= 2 ? (scene.step === 3 ? "0.48" : "0.92") : "待计算"}</strong></div>
      </div>
      <ArrowRight className={styles.pretrainingHeroArrow} size={24} aria-hidden="true" />
      <div className={styles.pretrainingHeroWeights} data-active={scene.step === 3}>
        <div className={styles.pretrainingHeroLabel}><ArrowsClockwise size={17} aria-hidden="true" /><span>参数 · 可学习的刻度</span></div>
        <h3>{scene.step === 3 ? "向‘七日内’挪一小步" : "还没有写回参数"}</h3>
        <div className={styles.pretrainingHeroDial}><span data-shifted={scene.step === 3} /><b>W</b></div>
        <div className={styles.pretrainingHeroWeightNote}><strong>{scene.step === 3 ? "更新 1 次" : "更新 0 次"}</strong><small>训练时才会变化；下一张卡还会继续检验它。</small></div>
      </div>
    </div>
    <div className={styles.pretrainingHeroMetrics}>
      <div><span>目标</span><strong>{scene.step >= 1 ? "1 个" : "待生成"}</strong></div>
      <div><span>损失</span><strong>{scene.step >= 2 ? (scene.step === 3 ? "0.48" : "0.92") : "待计算"}</strong></div>
      <div><span>参数</span><strong>{scene.step === 3 ? "已移动" : "保持"}</strong></div>
    </div>
    <div className={styles.pretrainingHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>预训练把大量文本变成可重复的练习：目标由数据本身提供，损失把差距变成信号，参数再按这个信号小步更新；它没有替你核验目标是否真实。</figcaption>
  </figure>;
}

type Objective = "causal" | "masked";
type Corpus = "careful" | "stale";

const lessonLabels = ["切 token", "生成目标", "比较损失", "更新参数"];
const objectiveCopy: Record<Objective, { label: string; context: string[]; target: string; note: string }> = {
  causal: { label: "下一个 token", context: ["退款", "需", "在"], target: "七日内", note: "只用目标左边已经出现的 token 来猜下一格。" },
  masked: { label: "被遮住的 token", context: ["退款", "需", "在", "[MASK]", "申请"], target: "七日内", note: "把一格遮住，让模型利用两侧可见内容复原它。" },
};

export function PretrainingLesson() {
  const scene = useScene(lessonLabels.length);
  const [objective, setObjective] = useState<Objective>("causal");
  const [targetPresent, setTargetPresent] = useState(true);
  const [corpus, setCorpus] = useState<Corpus>("careful");
  const copy = objectiveCopy[objective];
  const blocked = !targetPresent;
  const stale = corpus === "stale";
  const final = scene.step === lessonLabels.length - 1;
  const setObjectiveAndReset = (next: Objective) => { setObjective(next); scene.seek(0); };
  const setCorpusAndReset = (next: Corpus) => { setCorpus(next); scene.seek(0); };

  return <div ref={scene.ref} className={styles.pretrainingLab} role="region" aria-label="预训练目标、损失与参数更新工作台">
    <div className={styles.pretrainingLabHeader}><span>换一个训练目标，观察参数更新何时成立</span><strong>{scene.step + 1} / {lessonLabels.length}</strong></div>
    <SceneControls scene={scene} labels={lessonLabels} />
    <div className={styles.pretrainingLabControls} role="group" aria-label="改变预训练设置">
      <button type="button" className={styles.pretrainingLabButton} aria-pressed={objective === "causal"} onClick={() => setObjectiveAndReset("causal")}>猜下一个 token</button>
      <button type="button" className={styles.pretrainingLabButton} aria-pressed={objective === "masked"} onClick={() => setObjectiveAndReset("masked")}>猜被遮住的 token</button>
      <button type="button" className={styles.pretrainingLabButton} aria-pressed={!targetPresent} onClick={() => { setTargetPresent((value) => !value); scene.seek(2); }}>{targetPresent ? "拿走目标标签" : "补回目标标签"}</button>
      <button type="button" className={styles.pretrainingLabButton} aria-pressed={stale} onClick={() => setCorpusAndReset(stale ? "careful" : "stale")}>{stale ? "换回当前规则" : "混入过时规则"}</button>
    </div>
    <div className={styles.pretrainingLabGrid}>
      <div className={styles.pretrainingLabPanel} data-active={scene.step === 0 || scene.step === 1}>
        <div className={styles.pretrainingLabLabel}><FileText size={16} aria-hidden="true" /><span>语料切片</span></div>
        <h3>{stale ? "旧规则样本" : "当前规则样本"}</h3>
        <p>{stale ? "退款需在三日内申请" : "退款需在七日内申请"}</p>
        <div className={styles.pretrainingLabTokens}>{(stale ? ["退款", "需", "在", objective === "masked" ? "[MASK]" : "三日内", "申请"] : (objective === "masked" ? copy.context : ["退款", "需", "在", "七日内"])).map((token, index) => <span key={`${token}-${index}`} data-target={token.includes("日") || token === "[MASK]"} data-visible={scene.step >= 0}>{token}</span>)}</div>
        <small>{copy.note}</small>
      </div>
      <div className={styles.pretrainingLabPanel + " " + styles.pretrainingLabScore} data-active={scene.step === 2}>
        <div className={styles.pretrainingLabLabel}><Brain size={16} aria-hidden="true" /><span>预测与损失</span></div>
        <h3>{copy.label}</h3>
        <div className={styles.pretrainingLabPrediction}>
          <span>模型猜“{stale ? "三日内" : "七日内"}”</span><strong data-danger={blocked}>{blocked ? "无目标可比" : scene.step >= 2 ? (stale ? "目标=三日内" : "目标=七日内") : "等待目标"}</strong>
        </div>
        <div className={styles.pretrainingLabLossBar}><i data-visible={scene.step >= 2 && !blocked} data-stale={stale} /></div>
        <div className={styles.pretrainingLabLossValue}><span>cross-entropy loss</span><strong>{blocked ? "—" : scene.step >= 2 ? (stale ? "0.21" : "0.48") : "待计算"}</strong></div>
      </div>
      <div className={styles.pretrainingLabPanel + " " + styles.pretrainingLabUpdate} data-active={scene.step === 3}>
        <div className={styles.pretrainingLabLabel}><ArrowsClockwise size={16} aria-hidden="true" /><span>参数刻度</span></div>
        <h3>{blocked ? "没有更新信号" : final ? "收到一次小步更新" : "等待损失"}</h3>
        <div className={styles.pretrainingLabWeightRail}><span data-shifted={final && !blocked} /><b>W</b></div>
        <div className={styles.pretrainingLabUpdateText}><strong>{blocked ? "更新 0 次" : final ? "更新 1 次" : "更新 0 次"}</strong><small>{stale ? "参数可能学会旧规则；低损失只说明贴合这张卡。" : "参数朝降低这次损失的方向移动，不等于记下了一条经过核验的事实。"}</small></div>
      </div>
    </div>
    <div className={styles.pretrainingLabMetrics}>
      <div><span>目标来源</span><strong>{blocked ? "缺失" : "数据自带"}</strong></div>
      <div><span>当前损失</span><strong>{blocked ? "不可定义" : scene.step >= 2 ? (stale ? "0.21" : "0.48") : "等待"}</strong></div>
      <div><span>权重变化</span><strong>{blocked ? "0" : final ? "1 次" : "0"}</strong></div>
    </div>
    <p className={styles.pretrainingLabNote} data-danger={blocked || stale} role="status">
      {blocked ? <><WarningCircle size={17} aria-hidden="true" /><span>拿走目标标签后，训练样本仍然存在，但没有可比较的答案，loss 无法定义，参数也不会凭空更新。自监督学习的“标签”通常正是从输入里构造出来的。</span></> : stale ? <><WarningCircle size={17} aria-hidden="true" /><span>这张旧规则卡可能让 loss 很低，因为模型猜中了它；低 loss 只能说明贴合训练目标，不能替代对规则时效和事实的核验。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>一次更新只改变参数的一小步。还要继续看更多样本、独立评估和数据是否代表你要面对的世界。</span></> : <><Target size={17} aria-hidden="true" /><span>{objective === "causal" ? "先由下一个 token 生成目标，再把预测分布和目标比较。" : "先把一个 token 藏起来，再用可见上下文定义要预测的目标。"}</span></>}
    </p>
  </div>;
}
