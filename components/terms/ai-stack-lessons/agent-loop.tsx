"use client";

import { useState } from "react";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, ClipboardText, Pause, Play, WarningCircle, Wrench, XCircle } from "@phosphor-icons/react";

import { useScene } from "../HarnessStoryScenes";
import { getAgentLoopDemoState, type AgentLoopLimit, type AgentLoopDemoState } from "@/lib/agent-loop-demo";
import styles from "../ai-stack-pages/agent-loop.module.css";

const labels = ["接住失败票", "拉开检修抽屉", "读回工具回执", "把问题写回", "写入配置", "重新复查", "打开完成闸门"];

function LoopControls({ scene, hero = false }: { scene: ReturnType<typeof useScene>; hero?: boolean }) {
  const next = () => scene.step === labels.length - 1 ? scene.seek(0) : scene.seek(scene.step + 1);
  return <div className={hero ? styles.heroControls : styles.lessonControls} aria-label={hero ? "首图控制" : "智能体循环演示控制"}>
    <button type="button" onClick={scene.toggle} aria-label={scene.playing ? hero ? "暂停首图" : "暂停演示" : hero ? "播放首图" : "播放演示"}>
      {scene.playing ? <Pause size={hero ? 13 : 14} /> : <Play size={hero ? 13 : 14} />}
      {scene.playing ? "停下" : scene.step === labels.length - 1 ? "再看一次" : "看它运转"}
    </button>
    <div className={hero ? styles.heroChapters : styles.lessonSteps}>{labels.map((label, index) => <button type="button" key={label} aria-label={label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small></button>)}</div>
    <button type="button" onClick={next} aria-label={hero ? "首图下一步" : "演示下一步"}><ArrowRight size={hero ? 15 : 16} /></button>
  </div>;
}

export function RepairBench({ state, lesson = false }: { state: AgentLoopDemoState; lesson?: boolean }) {
  const receipt = state.receiptCurrent ? "本轮工具回执" : "上一轮工具回执";
  const actionNote = state.receiptCurrent ? "新的回执已回" : state.limited ? "轮数已用完，动作不会发生" : state.actionVisible ? "动作还要等回执" : "状态还没送入工具";
  const stateNote = state.receiptCurrent ? "复查通过后允许停止" : state.stateWritten ? "下一轮知道要修哪里" : "不能盲目重试";
  const gateIcon = state.limited ? <XCircle size={lesson ? 17 : 15} aria-hidden="true" /> : state.finished ? <CheckCircle size={lesson ? 17 : 15} aria-hidden="true" /> : <WarningCircle size={lesson ? 17 : 15} aria-hidden="true" />;
  return <div className={lesson ? styles.workbench : styles.bench} data-limited={state.limited} data-finished={state.finished} data-verified={state.receiptCurrent}>
    <div className={lesson ? styles.taskTicket : styles.benchTicket}><ClipboardText size={lesson ? 16 : 14} aria-hidden="true" /><span>发布任务单</span><strong>把服务修到可发布</strong><code>{state.taskStatus}</code></div>
    <div className={lesson ? styles.repairDrawer : styles.benchDrawer} data-open={state.actionVisible}><Wrench size={lesson ? 22 : 18} aria-hidden="true" /><span>检修抽屉</span><strong>{state.actionLabel}</strong><small>{actionNote}</small></div>
    {state.receiptVisible && <div className={lesson ? styles.receipt : styles.benchReceipt} data-current={state.receiptCurrent}><span>{receipt}</span><strong>{state.receiptCode}</strong><code>{state.receiptDetail}</code><small>{state.receiptCurrent ? "新的检查证据" : "保留给下一轮判断"}</small></div>}
    <div className={lesson ? styles.stateCard : styles.benchState} data-visible={state.stateWritten}><span>写回任务单</span><strong>{state.stateLabel}</strong><small>{stateNote}</small></div>
    {state.verificationVisible && <div className={lesson ? styles.verification : styles.benchVerification} data-done={state.receiptCurrent}><span>复查灯</span><strong>{state.receiptCurrent ? "200 OK" : "等待回执"}</strong></div>}
    <div className={lesson ? styles.gate : styles.benchGate} data-open={state.finished} data-limited={state.limited}>{gateIcon}<span>{state.gateLabel}</span></div>
  </div>;
}

const heroNotes = [
  "任务单先把 500 和缺失配置钉在桌面上，循环从可检查的失败状态开始。",
  "检修抽屉只拉出一个动作；动作发出不等于服务已经变好。",
  "工具回执带回具体缺失项，下一轮终于有了可以处理的证据。",
  "把 issue = config 写回任务单，循环不再对未知问题盲目重试。",
  "配置写入只是改变了状态，还不能拿它冒充健康检查通过。",
  "第三轮重新跑健康检查；回执返回前，完成闸门仍然关闭。",
  "新的 200 OK 证明复查通过，循环才在这里停下。",
];

export function AgentLoopHero() {
  const scene = useScene(labels.length);
  const state = getAgentLoopDemoState(scene.step, 3);
  return <figure ref={scene.ref} className={styles.hero} aria-label="维修工作台展示智能体循环怎样写回状态并停下">
    <div className={styles.heroTop}><span>维修工作台 · AGENT LOOP</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <LoopControls scene={scene} hero />
    <RepairBench state={state} />
    <figcaption role="status" aria-live="polite">{heroNotes[scene.step]}</figcaption>
  </figure>;
}

export function AgentLoopLesson() {
  const scene = useScene(labels.length);
  const [limit, setLimit] = useState<AgentLoopLimit>(3);
  const state = getAgentLoopDemoState(scene.step, limit);

  function chooseLimit(next: AgentLoopLimit) {
    setLimit(next);
    scene.seek(4);
  }

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="智能体循环维修工作台">
    <div className={styles.labTop}><span>STATE WRITE-BACK / STOP GATE</span><strong>每轮结果必须改变任务单</strong></div>
    <LoopControls scene={scene} />
    <div className={styles.labControls} role="group" aria-label="选择循环轮数上限">
      <div className={styles.controlGroup}>
        <button type="button" aria-pressed={limit === 3} onClick={() => chooseLimit(3)}>允许 3 轮</button>
        <button type="button" aria-pressed={limit === 2} onClick={() => chooseLimit(2)}>只允许 2 轮</button>
      </div>
      <div className={styles.controlGroup}><button type="button" onClick={() => { setLimit(3); scene.seek(0); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    </div>
    <RepairBench state={state} lesson />
    <div className={styles.labStatus} data-safe={state.finished && !state.limited} role="status" aria-live="polite"><span>{state.status}</span></div>
  </div>;
}
