"use client";

import { Archive, ArrowsClockwise, CheckCircle, FileText, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./DeadLetterQueueConcept.module.css";

const steps = [
  { label: "投递", title: "消息先进入主队列", detail: "消费者拿到一条待处理的任务。", Icon: FileText },
  { label: "重试", title: "暂时失败可以再试", detail: "每次失败都要留下次数和原因。", Icon: ArrowsClockwise },
  { label: "隔离", title: "超过上限就移出主路径", detail: "坏消息不再阻塞后面的正常消息。", Icon: Archive },
  { label: "处理", title: "查明原因后再决定重放", detail: "死信是待调查的工作，不是自动成功。", Icon: MagnifyingGlass },
];

export function DeadLetterQueueHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const attempts = [1, 2, 3, 3][scene.step];
  const mainQueue = scene.step >= 2 ? "继续前进" : "等待处理";

  return <figure ref={scene.ref} className={styles.deadLetterHero} data-step={scene.step} aria-label="失败消息如何经过重试后进入死信队列并等待人工处理">
    <div className={styles.deadLetterHeroHeader}><span>一条坏消息怎样离开主队列</span><strong>deliver → retry → quarantine → redrive</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.deadLetterHeroBoard}>
      <div className={styles.deadLetterHeroPanel} data-active={scene.step === 0}>
        <div className={styles.deadLetterHeroLabel}><FileText size={17} aria-hidden="true" /><span>主队列 · source</span></div>
        <h3>{scene.step >= 2 ? "后面的消息继续走" : "消息 bad-json"}</h3>
        <div className={styles.deadLetterHeroMessage} data-danger={scene.step < 2}><strong>{scene.step < 2 ? "bad-json" : "next-order"}</strong><small>{scene.step < 2 ? "格式不完整" : "正常消息不被拖住"}</small></div>
        <small>{mainQueue}</small>
      </div>
      <div className={styles.deadLetterHeroArrow} aria-hidden="true"><span /><ArrowsClockwise size={21} /></div>
      <div className={styles.deadLetterHeroPanel + " " + styles.deadLetterHeroRetry} data-active={scene.step === 1} data-danger={scene.step === 1}>
        <div className={styles.deadLetterHeroLabel}><ArrowsClockwise size={17} aria-hidden="true" /><span>投递尝试</span></div>
        <h3>{attempts} / 3 次</h3>
        <div className={styles.deadLetterHeroAttempts}>{[1, 2, 3].map(attempt => <span key={attempt} data-done={attempt <= attempts} data-failed={attempt <= attempts && scene.step >= 1}>第 {attempt} 次</span>)}</div>
        <small>{scene.step === 1 ? "这次仍然失败，暂不确认" : "达到策略上限才隔离"}</small>
      </div>
      <div className={styles.deadLetterHeroArrow} aria-hidden="true"><span /><ArrowsClockwise size={21} /></div>
      <div className={styles.deadLetterHeroPanel + " " + styles.deadLetterHeroDlq} data-active={scene.step >= 2} data-danger={scene.step === 2}>
        <div className={styles.deadLetterHeroLabel}><Archive size={17} aria-hidden="true" /><span>死信 · DLQ</span></div>
        <h3>{scene.step >= 2 ? "已隔离" : "空"}</h3>
        <div className={styles.deadLetterHeroDlqBox}>{scene.step >= 2 ? <><WarningCircle size={16} aria-hidden="true" /><span>malformed payload</span></> : <span>等待不可处理消息</span>}</div>
        <small>{scene.step >= 3 ? "交给调查者" : "不会自动算成功"}</small>
      </div>
    </div>
    <div className={styles.deadLetterHeroOperator} data-active={scene.step === 3}><MagnifyingGlass size={17} aria-hidden="true" /><span>{scene.step === 3 ? "查看原因、修复后再决定 redrive" : "隔离后留下原因、次数和消息本体"}</span></div>
    <div className={styles.deadLetterHeroMetrics}>
      <div><span>投递次数</span><strong>{attempts} / 3</strong></div>
      <div><span>主队列</span><strong>{scene.step >= 2 ? "不再阻塞" : "等待"}</strong></div>
      <div><span>最终动作</span><strong>{scene.step === 3 ? "人工决定" : "未决定"}</strong></div>
    </div>
    <div className={styles.deadLetterHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>死信队列给“暂时失败”和“反复失败”划出一条边界。它保存的是待调查的原消息与失败证据，只有经过修复、授权和幂等检查，才适合重新投递。</figcaption>
  </figure>;
}
