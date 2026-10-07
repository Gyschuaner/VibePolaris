"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CalendarBlank, CheckCircle, FileText, Gear, MagnifyingGlass, Pause, Play, WarningCircle, XCircle } from "@phosphor-icons/react";

import { useScene } from "../HarnessStoryScenes";
import { getToolChoiceDemoState, type ToolChoiceStrategy } from "@/lib/tool-choice-demo";
import styles from "../ai-stack-pages/tool-choice.module.css";

const labels = ["放上任务票", "打开工具转盘", "转动选择针", "停在审批台"];
const heroLabels = ["任务票放上桌", "三枚筹码露出", "选择针落下", "写操作停在审批台"];

const chips = [
  { id: "calendar_read", label: "calendar_read", short: "READ", note: "查空档", icon: CalendarBlank },
  { id: "calendar_update", label: "calendar_update", short: "UPDATE", note: "改时间", icon: Gear },
  { id: "web_search", label: "web_search", short: "SEARCH", note: "找资料", icon: MagnifyingGlass },
] as const;

function ChoiceControls({ scene, hero = false }: { scene: ReturnType<typeof useScene>; hero?: boolean }) {
  const labelsForControls = hero ? heroLabels : labels;
  const next = () => scene.step === labelsForControls.length - 1 ? scene.seek(0) : scene.seek(scene.step + 1);
  return <div className={hero ? styles.heroControls : styles.lessonControls} aria-label={hero ? "首图控制" : "工具选择演示控制"}>
    <button type="button" onClick={scene.toggle} aria-label={scene.playing ? hero ? "暂停首图" : "暂停演示" : hero ? "播放首图" : "播放演示"}>
      {scene.playing ? <Pause size={hero ? 13 : 14} /> : <Play size={hero ? 13 : 14} />}
      {scene.playing ? "停下" : scene.step === labelsForControls.length - 1 ? "再看一次" : "看它运转"}
    </button>
    <div className={hero ? styles.heroChapters : styles.lessonSteps}>
      {labelsForControls.map((label, index) => <button type="button" key={label} aria-label={label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small></button>)}
    </div>
    <button type="button" onClick={next} aria-label={hero ? "首图下一步" : "演示下一步"}><ArrowRight size={hero ? 15 : 16} /></button>
  </div>;
}

function ToolChips({ selected, visible, lesson = false }: { selected: string | null; visible: boolean; lesson?: boolean }) {
  const classFor = (id: string) => lesson
    ? id === "calendar_read" ? styles.labRead : id === "calendar_update" ? styles.labUpdate : styles.labSearch
    : id === "calendar_read" ? styles.chipRead : id === "calendar_update" ? styles.chipUpdate : styles.chipSearch;
  return <>{chips.map(({ id, label, short, note, icon: Icon }) => <div key={id} className={`${lesson ? styles.labChip : styles.toolChip} ${classFor(id)}`} data-visible={visible} data-selected={selected === id} aria-label={label}>
    <Icon size={lesson ? 15 : 13} aria-hidden="true" /><span>{short}</span><small>{note}</small>
  </div>)}</>;
}

export function ToolChoiceHero() {
  const scene = useScene(heroLabels.length);
  const state = getToolChoiceDemoState(scene.step, "auto");
  const notes = [
    "任务票只说要改会议时间，桌上还没有任何调用。",
    "转盘打开，读取、更新和搜索各自是候选，不是已经发生的动作。",
    "选择针落在 calendar_update，先生成一张待检查的写操作票。",
    "票据停在审批台；选择完成了，日历仍然没有改变。",
  ];
  return <figure ref={scene.ref} className={styles.hero} aria-label="工具选择把候选工具和实际执行分开的演示">
    <div className={styles.heroTop}><span>黄铜工具转盘 · AUTO</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <ChoiceControls scene={scene} hero />
    <div className={styles.desk} data-stage={scene.step}>
      <div className={styles.taskSlip}><FileText size={15} aria-hidden="true" /><span>任务票</span><strong>把会议改到周五</strong></div>
      <div className={styles.turntable} data-open={state.candidatesVisible}>
        <div className={styles.dialMark} aria-hidden="true" />
        <ToolChips selected={state.selected} visible={state.candidatesVisible} />
      </div>
      <div className={styles.approvalTicket} data-proposed={state.proposed} data-waiting={state.approvalWaiting}>
        <span>写操作票</span><strong>{state.proposed ? "calendar_update" : "还没选中"}</strong><small>{state.approvalWaiting ? "等待审批 · 日历不动" : state.proposed ? "PROPOSED · 未执行" : "选择针还没落下"}</small>
        {state.approvalWaiting && <em className={styles.approvalStamp}>NEEDS APPROVAL</em>}
      </div>
    </div>
    <figcaption role="status" aria-live="polite">{notes[scene.step]}</figcaption>
  </figure>;
}

export function ToolChoiceLesson() {
  const scene = useScene(labels.length);
  const [strategy, setStrategy] = useState<ToolChoiceStrategy>("auto");
  const state = getToolChoiceDemoState(scene.step, strategy);

  function selectStrategy(next: ToolChoiceStrategy) {
    setStrategy(next);
    scene.seek(2);
  }

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工具选择与审批边界演示">
    <div className={styles.labTop}><span>TOOL CHOICE / APPROVAL TICKET</span><strong>只演示选择，不真实改动日历</strong></div>
    <ChoiceControls scene={scene} />
    <div className={styles.labControls} role="group" aria-label="选择工具调用策略">
      <div className={styles.controlGroup}>
        {(["auto", "required", "none"] as const).map((key) => <button key={key} type="button" aria-pressed={strategy === key} onClick={() => selectStrategy(key)}>{key}</button>)}
      </div>
      <div className={styles.controlGroup}><button type="button" onClick={() => { setStrategy("auto"); scene.seek(0); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    </div>
    <div className={styles.labBoard} data-strategy={strategy}>
      <div className={styles.labRequest}><span>任务票</span><strong>把会议改到周五</strong><small>先看候选，后看权限</small></div>
      <div className={styles.labTable} data-open={state.candidatesVisible}>
        <div className={styles.labNeedle} data-selected={state.selected === "calendar_update"} aria-hidden="true" />
        <ToolChips selected={state.selected} visible={state.candidatesVisible} lesson />
      </div>
      <div className={styles.labTicket} data-proposed={state.proposed} data-waiting={state.approvalWaiting}>
        <span>写操作票</span><strong>{state.selected ?? "没有调用"}</strong><small>{strategy === "none" ? "none · 仅保留文本回答" : state.approvalWaiting ? "审批未通过前，副作用为 0" : state.proposed ? `${strategy} · 等待参数与权限检查` : "选择针等待策略"}</small>
        {state.approvalWaiting && <em>PAUSED</em>}
      </div>
    </div>
    <div className={styles.labStatus} data-safe={strategy === "none"} role="status" aria-live="polite">
      {strategy === "none" ? <CheckCircle size={16} aria-hidden="true" /> : state.approvalWaiting ? <WarningCircle size={16} aria-hidden="true" /> : state.proposed ? <XCircle size={16} aria-hidden="true" /> : <WarningCircle size={16} aria-hidden="true" />}
      <span>{state.status}</span>
    </div>
  </div>;
}
