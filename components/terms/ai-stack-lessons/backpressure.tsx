"use client";

import { useState } from "react";
import { ArrowsClockwise, Broadcast, CheckCircle, Circuitry, Gauge, Pause, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./BackpressureConcept.module.css";

const labels = ["送入流", "缓冲见顶", "选择策略", "恢复处理"];
type ConsumerMode = "slow" | "ready";
type Policy = "backpressure" | "shed";

export function BackpressureLesson() {
  const scene = useScene(labels.length);
  const [consumer, setConsumer] = useState<ConsumerMode>("slow");
  const [policy, setPolicy] = useState<Policy>("backpressure");
  const slow = consumer === "slow";
  const shedding = policy === "shed";
  const final = scene.step === labels.length - 1;
  const pressured = slow && scene.step >= 1;
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const bufferText = slow ? (scene.step >= 1 ? "3 / 3" : "1 / 3") : "1 / 3";
  const outcome = final ? (shedding && slow ? "shed 2 条" : slow ? "paused" : "继续") : scene.step >= 1 && slow ? "等待策略" : "流动中";

  return <div ref={scene.ref} className={styles.backpressureLab} role="region" aria-label="背压、限流和丢弃策略工作台">
    <div className={styles.backpressureLabHeader}><span>只改变下游速度和满载策略</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.backpressureLabControls} role="group" aria-label="改变背压条件">
      <button type="button" className={styles.backpressureLabButton} aria-pressed={slow} onClick={() => reset(() => setConsumer("slow"))}>下游变慢</button>
      <button type="button" className={styles.backpressureLabButton} aria-pressed={!slow} onClick={() => reset(() => setConsumer("ready"))}>下游恢复</button>
      <button type="button" className={styles.backpressureLabButton} aria-pressed={!shedding} onClick={() => reset(() => setPolicy("backpressure"))}>传回压力</button>
      <button type="button" className={styles.backpressureLabButton} aria-pressed={shedding} onClick={() => reset(() => setPolicy("shed"))}>丢弃超额</button>
    </div>
    <div className={styles.backpressureLabGrid}>
      <div className={styles.backpressureLabPanel} data-active={scene.step === 0 || scene.step === 2}>
        <div className={styles.backpressureLabLabel}><Broadcast size={16} aria-hidden="true" /><span>生产者</span></div>
        <h3>{pressured && !shedding ? "等待容量" : pressured && shedding ? "继续推送" : "逐个发送"}</h3>
        <div className={styles.backpressureLabStream}><span>A</span><span>B</span><span>C</span><span data-muted={pressured && !shedding}>D</span><span data-muted={pressured && !shedding}>E</span></div>
        <small>{pressured && !shedding ? "credit = 0，暂停提交新任务" : pressured && shedding ? "缓冲满时由策略丢掉多余项" : "把工作送到有界缓冲"}</small>
      </div>
      <div className={styles.backpressureLabPanel + " " + styles.backpressureLabMiddle} data-active={scene.step === 1 || scene.step === 2} data-danger={shedding && final}>
        <div className={styles.backpressureLabLabel}><Circuitry size={16} aria-hidden="true" /><span>缓冲与信号</span></div>
        <h3>{bufferText}</h3>
        <div className={styles.backpressureLabCapacity}><i data-filled="true" /><i data-filled="true" /><i data-filled={slow} /></div>
        <div className={styles.backpressureLabSignal}><ArrowsClockwise size={15} aria-hidden="true" /><span>{shedding ? "没有回传，改为丢弃" : pressured ? "capacity → producer" : "capacity 可用"}</span></div>
        <small>{shedding ? "这是 load shedding，数据不会自动回来。" : "背压改变的是生产节奏，不是结果内容。"}</small>
      </div>
      <div className={styles.backpressureLabPanel} data-active={scene.step === 3}>
        <div className={styles.backpressureLabLabel}><Gauge size={16} aria-hidden="true" /><span>消费者</span></div>
        <h3>{slow ? (final ? "开始排空" : "处理较慢") : "恢复处理"}</h3>
        <div className={styles.backpressureLabConsumer}><strong>{slow ? "1 / 秒" : "4 / 秒"}</strong><span>{final ? "下游已接住" : "处理能力"}</span></div>
        <small>{slow ? "慢不是错误，关键是让上游知道容量。" : "容量恢复后，暂停的工作可以继续。"}</small>
      </div>
    </div>
    <div className={styles.backpressureLabMetrics}>
      <div><span>当前状态</span><strong>{outcome}</strong></div>
      <div><span>队列上限</span><strong>3 条</strong></div>
      <div><span>数据是否回来</span><strong>{shedding && final ? "不会" : "会继续"}</strong></div>
    </div>
    <p className={styles.backpressureLabNote} data-danger={shedding && final} role="status">
      {shedding && final ? <><WarningCircle size={17} aria-hidden="true" /><span>丢弃超额是 load shedding：它保护了下游，却让被丢掉的工作消失，必须把这条代价显式记录。</span></> : !shedding && pressured ? <><Pause size={17} aria-hidden="true" /><span>背压让生产者停在“尚未获准”的位置；它保留了数据，但吞吐会跟着最慢的环节走。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>容量恢复后，受控的生产可以继续；队列一直有上限，系统才有机会从突发流量里恢复。</span></> : <><ArrowsClockwise size={17} aria-hidden="true" /><span>先找到真正的瓶颈，再决定是回传容量、限速，还是明确丢弃；这三个动作不能混成“把队列加大”。</span></>}
    </p>
  </div>;
}
