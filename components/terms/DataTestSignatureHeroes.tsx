"use client";

import { useState } from "react";
import { Archive, ArrowDown, ArrowRight, ArrowsClockwise, CheckCircle, FileText, GitBranch, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./DataTestSignatureHeroes.module.css";

type Scene = ReturnType<typeof useScene>;
type Icon = typeof CheckCircle;

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

function Result({ icon: IconComponent, title, detail, danger = false }: { icon: Icon; title: string; detail: string; danger?: boolean }) {
  return <div className={styles.result} data-danger={danger} role="status"><IconComponent size={19} aria-hidden="true" /><span><strong>{title}</strong> · {detail}</span></div>;
}

function Frame({ label, eyebrow, meta, scene, steps, children, result, caption, controls }: { label: string; eyebrow: string; meta: string; scene: Scene; steps: string[]; children: React.ReactNode; result: { icon: Icon; title: string; detail: string; danger?: boolean }; caption: string; controls?: React.ReactNode }) {
  return <figure ref={scene.ref} className={styles.frame} data-step={scene.step} aria-label={label}>
    <Header eyebrow={eyebrow} meta={meta} />
    {controls}
    <SceneControls scene={scene} labels={steps} />
    {children}
    <Result {...result} />
    <figcaption>{caption}</figcaption>
  </figure>;
}

const ingestionSteps = ["读到来源", "放进暂存", "写入原始层", "确认位置"];

export function DataIngestionSignatureHero() {
  const scene = useScene(ingestionSteps.length);
  const [replayed, setReplayed] = useState(false);
  const step = replayed ? 3 : scene.step;
  const result = replayed
    ? { icon: ArrowsClockwise, title: "从旧位置重读", detail: "loan-1 / loan-2 已去重，坏记录仍在隔离区", danger: false }
    : [
      { icon: FileText, title: "来源还没被确认", detail: "读到记录不等于它已经可靠写入" },
      { icon: ArrowDown, title: "先放进暂存篮", detail: "写入失败时 checkpoint 不前移" },
      { icon: Archive, title: "原始层留下记录", detail: "确认位置仍等待保存" },
      { icon: CheckCircle, title: "确认后才可跳过", detail: "checkpoint=2，下一次从第 3 条继续" },
    ][scene.step];
  return <Frame label="数据接入先写入原始层，再保存确认位置；重启会从旧位置重读并去重" eyebrow="先保存事实，再移动读取位置" meta="source → raw → checkpoint" scene={scene} steps={ingestionSteps} result={result} caption="数据接入的进度有两根线：记录是否已可靠落地，来源位置是否已经确认。把确认位置提前会漏数据，落地后暂不确认则会重放，所以稳定 ID 和去重是恢复的一部分。" controls={<div className={styles.inlineControls} role="group" aria-label="数据接入恢复操作"><button type="button" aria-pressed={replayed} onClick={() => { setReplayed(value => !value); scene.seek(3); }}><ArrowsClockwise size={15} />{replayed ? "回到首次接入" : "断开并恢复"}</button></div>}>
    <div className={styles.ingestionBoard} data-replayed={replayed}>
      <div className={styles.ingestionSource}><span>来源日志</span>{["loan-1", "loan-2", "loan-3"].map((item, index) => <div key={item} data-active={step === 0 && index < 2 || step >= 1 && index < (replayed ? 2 : step >= 3 ? 2 : 2)} data-duplicate={replayed && index < 2}><FileText size={16} /><code>{item}</code><small>{replayed && index < 2 ? "重读" : `pos ${index + 1}`}</small></div>)}</div>
      <div className={styles.ingestionArrow} aria-hidden="true"><span /><ArrowDown size={21} /></div>
      <div className={styles.ingestionRaw}><span>原始层</span><div className={styles.rawRows}><b data-visible={step >= 2}>loan-1</b><b data-visible={step >= 2}>loan-2</b><b data-visible={step >= 3}>loan-3</b></div><small>{replayed ? "重复 ID 被挡住" : step >= 2 ? "原值保留" : "等待写入"}</small></div>
      <div className={styles.ingestionCheckpoint}><div><GitBranch size={18} /><span>checkpoint</span></div><strong>{replayed ? "2 · 重放" : step >= 3 ? "2 · 已确认" : step >= 2 ? "0 · 未保存" : "—"}</strong><small>{replayed ? "从位置 2 继续读" : step >= 3 ? "下一批从 3 开始" : "写入还没获得确认"}</small></div>
    </div>
  </Frame>;
}
