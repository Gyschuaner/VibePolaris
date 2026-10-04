"use client";

import { ArrowsClockwise, Broadcast, CheckCircle, Circuitry, Gauge, Pause, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./BackpressureConcept.module.css";

const steps = [
  { label: "生产数据", title: "上游先把数据推过来", detail: "生产者的速度暂时高于下游处理速度。", Icon: Broadcast },
  { label: "缓冲变满", title: "缓冲区不是无限仓库", detail: "槽位到顶后，继续塞只会把风险往后推。", Icon: Gauge },
  { label: "压力回传", title: "让上游慢下来或暂停", detail: "下游用容量信号收回节奏控制权。", Icon: Pause },
  { label: "重新平衡", title: "下游接住后再继续", detail: "队列保持有界，流量恢复才不会再冲垮它。", Icon: CheckCircle },
];

const packets = ["A", "B", "C", "D", "E", "F"];

export function BackpressureHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const buffered = [2, 4, 4, 1][scene.step];
  const producing = scene.step < 2;

  return <figure ref={scene.ref} className={styles.backpressureHero} data-step={scene.step} aria-label="背压如何在生产者、有限缓冲区和消费者之间传回处理能力">
    <div className={styles.backpressureHeroHeader}><span>一条数据流怎样学会踩刹车</span><strong>produce → buffer → consume</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.backpressureHeroBoard}>
      <div className={styles.backpressureHeroPanel} data-active={scene.step === 0 || scene.step === 2}>
        <div className={styles.backpressureHeroLabel}><Broadcast size={17} aria-hidden="true" /><span>上游 · producer</span></div>
        <h3>{producing ? "还在推送" : "收到暂停信号"}</h3>
        <div className={styles.backpressureHeroPackets}>{packets.map((packet, index) => <span key={packet + "-" + index} data-visible={index < (scene.step === 0 ? 4 : scene.step === 1 ? 6 : scene.step === 2 ? 3 : 2)} data-held={scene.step >= 2 && index === 3}>{packet}</span>)}</div>
        <small>{scene.step < 2 ? "每秒 6 个 chunk" : scene.step === 2 ? "只保留已获准的 3 个" : "按下游容量恢复"}</small>
      </div>
      <div className={styles.backpressureHeroArrow} aria-hidden="true"><span /><ArrowsClockwise size={20} /></div>
      <div className={styles.backpressureHeroBuffer} data-active={scene.step === 1 || scene.step === 2} data-danger={scene.step === 1}>
        <div className={styles.backpressureHeroLabel}><Circuitry size={17} aria-hidden="true" /><span>有界缓冲 · buffer</span></div>
        <h3>{scene.step === 1 ? "4 / 4 · 满" : buffered + " / 4 · 可观测"}</h3>
        <div className={styles.backpressureHeroSlots}>{[0, 1, 2, 3].map(index => <span key={index} data-filled={index < buffered} data-warning={scene.step === 1 && index === 3}>{index < buffered ? packets[index] : "·"}</span>)}</div>
        <div className={styles.backpressureHeroBufferNote}>{scene.step === 1 ? <><WarningCircle size={15} aria-hidden="true" />没有更多空槽</> : scene.step === 2 ? <><Pause size={15} aria-hidden="true" />压力向上游传</> : "只保留能被接住的工作"}</div>
      </div>
      <div className={styles.backpressureHeroArrow} aria-hidden="true"><span /><ArrowsClockwise size={20} /></div>
      <div className={styles.backpressureHeroPanel} data-active={scene.step === 3}>
        <div className={styles.backpressureHeroLabel}><Gauge size={17} aria-hidden="true" /><span>下游 · consumer</span></div>
        <h3>{scene.step === 3 ? "正在排空" : "处理较慢"}</h3>
        <div className={styles.backpressureHeroConsumer}><strong>{scene.step === 3 ? "B" : "A"}</strong><span>{scene.step === 3 ? "结果已交付" : "处理 1 个 / 秒"}</span></div>
        <small>{scene.step < 2 ? "消费速度只有 2 个 / 秒" : scene.step === 2 ? "先告诉上游容量" : "消费追上生产"}</small>
      </div>
    </div>
    <div className={styles.backpressureHeroSignal} data-active={scene.step === 2} data-danger={scene.step === 1}><ArrowsClockwise size={17} aria-hidden="true" /><span>{scene.step === 1 ? "缓冲已满：再提交会造成堆积" : scene.step === 2 ? "capacity = 0 · 暂停继续提交" : "需求信号沿着数据流返回"}</span></div>
    <div className={styles.backpressureHeroMetrics}>
      <div><span>缓冲峰值</span><strong>{scene.step === 1 ? "4 / 4" : "有上限"}</strong></div>
      <div><span>生产状态</span><strong>{scene.step >= 2 ? "受控" : "自由"}</strong></div>
      <div><span>下游结果</span><strong>{scene.step === 3 ? "继续交付" : "等待"}</strong></div>
    </div>
    <div className={styles.backpressureHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>背压把“谁能继续生产”的决定交给真正知道容量的下游。它不是无穷加大队列，也不是默认丢弃数据，而是一条能让压力沿流反向传播的控制信号。</figcaption>
  </figure>;
}
