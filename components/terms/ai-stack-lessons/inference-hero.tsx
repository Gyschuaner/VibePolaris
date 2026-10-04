"use client";

import { useState } from "react";
import { ArrowRight, Brain, CheckCircle, Circuitry, FileText, LockSimple, Timer, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./InferenceConcept.module.css";

const steps = [
  { label: "收到请求", title: "先把整段问题读完", detail: "6 个输入 token 进入同一次计算", Icon: FileText },
  { label: "Prefill", title: "一次读过前缀", detail: "把上下文变成可继续生成的状态", Icon: Circuitry },
  { label: "Decode", title: "一个 token 一个 token 地写", detail: "首 token 之后按步交付", Icon: Brain },
  { label: "停止", title: "遇到条件才结束", detail: "结束标记 / 长度上限 / 取消", Icon: CheckCircle },
];

const promptTokens = ["请", "把", "退款", "条件", "说", "清楚"];
const outputTokens = ["先", "看", "订单", "条件"];

export function InferenceHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  return <figure ref={scene.ref} className={styles.inferenceHero} data-step={scene.step} aria-label="一次模型推理如何从整段输入进入 prefill，再逐 token decode 并停止">
    <div className={styles.inferenceHeroHeader}><span>一次回答在模型里怎样走完</span><strong>prefill → decode</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.inferenceHeroBoard}>
      <div className={styles.inferenceHeroPanel} data-active={scene.step === 0 || scene.step === 1}>
        <div className={styles.inferenceHeroLabel}><FileText size={17} aria-hidden="true" /><span>输入 · request</span></div>
        <h3>一整段问题</h3>
        <p>推理先把已经给出的内容送进模型，输入不会在中途变成训练样本。</p>
        <div className={styles.inferenceHeroTokens}>{promptTokens.map((token, index) => <span key={token} className={styles.inferenceHeroToken} data-visible={scene.step >= 0 && (scene.step === 0 || scene.step >= 1)} data-key={index === 2}>{token}</span>)}</div>
        <div className={styles.inferenceHeroNote}><strong>6 tokens</strong><br />“读完整段”与“开始输出”是两个节奏。</div>
      </div>
      <ArrowRight className={styles.inferenceHeroArrow} size={26} aria-hidden="true" />
      <div className={styles.inferenceHeroCore}>
        <div className={styles.inferenceHeroStage} data-active={scene.step === 1}><strong><Circuitry size={17} aria-hidden="true" />Prefill</strong><small>整段前缀一起经过模型，准备下一步生成所需的中间状态。</small><em>{scene.step >= 1 ? "已读 6 / 6" : "等待输入"}</em></div>
        <div className={styles.inferenceHeroStage} data-active={scene.step === 2 || scene.step === 3}><strong><Brain size={17} aria-hidden="true" />Decode</strong><small>每一步根据已有上下文只追加一个新 token，再决定要不要继续。</small><em>{scene.step >= 2 ? `${scene.step === 3 ? outputTokens.length : scene.step - 1} token` : "等待 prefill"}</em></div>
        <div className={styles.inferenceHeroLock}><LockSimple size={15} aria-hidden="true" />权重更新 0 次</div>
      </div>
      <ArrowRight className={styles.inferenceHeroArrow} size={26} aria-hidden="true" />
      <div className={`${styles.inferenceHeroPanel} ${styles.inferenceHeroOutput}`} data-active={scene.step >= 2}>
        <div className={styles.inferenceHeroLabel}><Timer size={17} aria-hidden="true" /><span>输出 · stream</span></div>
        <h3>边生成，边交付</h3>
        <p>首个 token 出现后，后续 token 可以陆续到达；速度快不代表内容已被核验。</p>
        <div className={styles.inferenceHeroTokens}>{outputTokens.map((token, index) => <span key={token} className={`${styles.inferenceHeroToken} ${styles.inferenceHeroTokenOutput}`} data-visible={scene.step >= 2 && index < (scene.step === 3 ? outputTokens.length : Math.max(1, scene.step - 1))} data-output="true">{token}</span>)}</div>
        <div className={styles.inferenceHeroNote}><strong>{scene.step === 3 ? "stop" : "streaming"}</strong><br />停止条件尚未满足时，半句答案不能冒充完成。</div>
      </div>
    </div>
    <div className={styles.inferenceHeroMetrics}>
      <div className={styles.inferenceHeroMetric}><span>首 token 等待</span><strong>{scene.step >= 2 ? "已越过" : "准备中"}</strong></div>
      <div className={styles.inferenceHeroMetric}><span>后续节奏</span><strong>{scene.step >= 2 ? "逐 token" : "未开始"}</strong></div>
      <div className={styles.inferenceHeroMetric}><span>权重变化</span><strong>0 次</strong></div>
    </div>
    <div className={styles.inferenceHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>推理是用已经学到的参数处理一次输入。把整段输入读完、逐 token 生成、满足停止条件，分别是可观察的阶段。</figcaption>
  </figure>;
}

type InputVariant = "complete" | "missing";

const lessonLabels = ["放入请求", "整段 prefill", "逐 token decode", "判断停止"];
const completeInput = ["订单 A17", "购买日期", "退款原因", "请给条件"];
const missingInput = ["购买日期", "退款原因", "请给条件"];
const completeOutput = ["先", "核对", "订单", "条件"];
const missingOutput = ["无法", "核对", "订单"];

export function InferenceLesson() {
  const scene = useScene(lessonLabels.length);
  const [variant, setVariant] = useState<InputVariant>("complete");
  const [evalReady, setEvalReady] = useState(true);
  const input = variant === "complete" ? completeInput : missingInput;
  const output = variant === "complete" ? completeOutput : missingOutput;
  const final = scene.step === lessonLabels.length - 1;
  const danger = variant === "missing" || !evalReady;
  const resetVariant = (next: InputVariant) => { setVariant(next); scene.seek(0); };

  return <div ref={scene.ref} className={styles.inferenceLab} role="region" aria-label="推理阶段与停止条件工作台">
    <div className={styles.inferenceLabHeader}><span>把同一个请求换一项条件</span><strong>{scene.step + 1} / {lessonLabels.length}</strong></div>
    <SceneControls scene={scene} labels={lessonLabels} />
    <div className={styles.inferenceLabControls} role="group" aria-label="改变推理输入与模型状态">
      <button type="button" className={styles.inferenceLabButton} aria-pressed={variant === "complete"} onClick={() => resetVariant("complete")}>带订单号</button>
      <button type="button" className={styles.inferenceLabButton} aria-pressed={variant === "missing"} onClick={() => resetVariant("missing")}>拿掉订单号</button>
      <button type="button" className={styles.inferenceLabButton} aria-pressed={!evalReady} onClick={() => setEvalReady(value => !value)}>{evalReady ? "忘记 eval()" : "恢复 eval()"}</button>
    </div>
    <div className={styles.inferenceLabGrid}>
      <div className={styles.inferenceLabPanel}>
        <h3>请求里的证据</h3>
        <p>推理只处理当前收到的输入；拿掉订单号，后面的答案就少了一块凭证。</p>
        <div className={styles.inferenceLabTokenList}>{input.map((token, index) => <span key={token} className={styles.inferenceLabToken} data-visible={scene.step >= 0} data-key={index === 0 && variant === "complete"}>{token}</span>)}</div>
      </div>
      <div className={styles.inferenceLabPanel}>
        <h3>同一套权重，两段节奏</h3>
        <p>先把前缀整体读入，再按输出的先后逐步追加；这不是两次训练。</p>
        <div className={styles.inferenceLabRail}>
          <div className={styles.inferenceLabStage} data-active={scene.step === 1}><Circuitry size={16} aria-hidden="true" /><strong>Prefill</strong><small>{scene.step >= 1 ? `${input.length} 个输入 token` : "等待请求"}</small></div>
          <div className={styles.inferenceLabStage} data-active={scene.step >= 2}><Brain size={16} aria-hidden="true" /><strong>Decode</strong><small>{scene.step >= 2 ? `${scene.step === 3 ? output.length : scene.step - 1} 个输出 token` : "等待 prefill"}</small></div>
        </div>
        <div className={styles.inferenceLabLock}><LockSimple size={15} aria-hidden="true" />权重更新 0 次 · 当前 {evalReady ? "eval()" : "未调用 eval()"}</div>
      </div>
      <div className={styles.inferenceLabPanel + " " + styles.inferenceLabOutput}>
        <h3>逐 token 交付</h3>
        <p>输出到达得快，只能说明计算或调度快；是否可靠要看输入和核验。</p>
        <div className={styles.inferenceLabOutputBox}>
          <div className={styles.inferenceLabOutputTokens}>{output.map((token, index) => <span key={`${token}-${index}`} className={styles.inferenceLabOutputToken} data-visible={scene.step >= 2 && index < (scene.step === 3 ? output.length : Math.max(1, scene.step - 1))}>{token}</span>)}</div>
          <span className={styles.inferenceLabOutputStatus} data-danger={danger}>{final ? (variant === "complete" ? "停止：已得到可继续核对的回答。" : "停止：缺少凭证，不能把猜测写成退款结论。") : scene.step >= 2 ? "输出仍在流动……" : "尚无输出"}</span>
        </div>
      </div>
    </div>
    <div className={styles.inferenceLabMetrics}>
      <div className={styles.inferenceLabMetric}><span>首 token</span><strong>{scene.step >= 2 ? "已返回" : "等待"}</strong></div>
      <div className={styles.inferenceLabMetric}><span>停止条件</span><strong>{final ? (variant === "complete" ? "满足" : "缺证据") : "未到"}</strong></div>
      <div className={styles.inferenceLabMetric}><span>运行状态</span><strong>{evalReady ? "评估模式" : "有风险"}</strong></div>
    </div>
    <p className={styles.inferenceLabNote} data-danger={danger} role="status">
      {variant === "missing" ? <><WarningCircle size={17} aria-hidden="true" /><span>订单号被拿掉了。模型仍然能继续生成文字，但它没有凭证确认“这笔订单”到底是哪一笔。</span></> : !evalReady ? <><WarningCircle size={17} aria-hidden="true" /><span>PyTorch 的 inference_mode 不会自动调用 eval()；dropout 或运行统计的行为仍可能不符合评估预期。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>推理阶段结束了，但“能输出”与“事实正确”仍要分开检查。</span></> : <><Timer size={17} aria-hidden="true" /><span>先看整段输入，再看输出节奏；不要把半句流式文本当作最终结果。</span></>}
    </p>
  </div>;
}
