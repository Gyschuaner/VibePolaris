"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle, FileText, MagnifyingGlass, Pause, Play, WarningCircle, XCircle } from "@phosphor-icons/react";

import { useScene } from "../HarnessStoryScenes";
import { getToolResultDemoState, type ToolResultVariant } from "@/lib/tool-result-demo";
import styles from "../ai-stack-pages/tool-result.module.css";

const labels = ["夹入查询票", "翻开原始页", "抽出业务字段", "贴上回答"];
const heroLabels = ["查询票入页", "原始 JSON 翻开", "stock 标签露出", "回答贴上去"];

function ResultControls({ scene, hero = false }: { scene: ReturnType<typeof useScene>; hero?: boolean }) {
  const chapterLabels = hero ? heroLabels : labels;
  const next = () => scene.step === chapterLabels.length - 1 ? scene.seek(0) : scene.seek(scene.step + 1);
  return <div className={hero ? styles.heroControls : styles.lessonControls} aria-label={hero ? "首图控制" : "工具结果演示控制"}>
    <button type="button" onClick={scene.toggle} aria-label={scene.playing ? hero ? "暂停首图" : "暂停演示" : hero ? "播放首图" : "播放演示"}>
      {scene.playing ? <Pause size={hero ? 13 : 14} /> : <Play size={hero ? 13 : 14} />}
      {scene.playing ? "停下" : scene.step === chapterLabels.length - 1 ? "再看一次" : "看它运转"}
    </button>
    <div className={hero ? styles.heroChapters : styles.lessonSteps}>{chapterLabels.map((label, index) => <button type="button" key={label} aria-label={label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small></button>)}</div>
    <button type="button" onClick={next} aria-label={hero ? "首图下一步" : "演示下一步"}><ArrowRight size={hero ? 15 : 16} /></button>
  </div>;
}

function ResultBook({ state, lesson = false }: { state: ReturnType<typeof getToolResultDemoState>; lesson?: boolean }) {
  return <div className={lesson ? styles.labBoard : styles.flipDesk} data-variant={state.variant}>
    <div className={lesson ? styles.labQuery : styles.querySlip}><FileText size={lesson ? 15 : 14} aria-hidden="true" /><span>库存查询票</span><strong>sku=K7</strong><small>call_id=inv-7</small></div>
    <div className={lesson ? styles.labBook : styles.flipbook} data-open={state.resultVisible}>
      <div className={styles.bookSpine} aria-hidden="true" />
      <div className={styles.bookPage}>
        <span>TOOL RESULT / RAW PAGE</span>
        <code>{state.resultVisible ? state.rawText : "等待工具返回…"}</code>
        <div className={styles.fieldLine} data-visible={state.validated} data-error={state.variant === "timeout"} aria-hidden={!state.validated}>
          <MagnifyingGlass size={13} aria-hidden="true" /><strong>{state.validated ? state.fieldValue : "等待字段校验"}</strong>
        </div>
        <small>{state.resultVisible ? "原始返回已保存" : "结果页还没有翻开"}</small>
      </div>
    </div>
    <div className={styles.fieldTab} data-visible={state.validated} data-error={state.variant === "timeout"}><span>{state.variant === "timeout" ? "错误结果/状态" : "业务字段"}</span><strong>{state.validated ? state.fieldValue : "等校验"}</strong></div>
    <div className={styles.answerSticker} data-ready={state.answerVisible} data-error={state.variant === "timeout"}><span>回答贴纸</span><strong>{state.answerVisible ? state.answer : "尚未生成"}</strong><small>{state.answerVisible ? state.variant === "timeout" ? "错误状态保留，无法改写为业务结论" : "由业务字段改写" : "不能把状态码直接当结论"}</small>{state.answerVisible && <em>{state.variant === "timeout" ? "UNKNOWN" : "READY"}</em>}</div>
  </div>;
}

export function ToolResultHero() {
  const scene = useScene(heroLabels.length);
  const state = getToolResultDemoState(scene.step, "stock0");
  const notes = [
    "查询票先夹入翻页簿，模型还没有库存结论。",
    "原始页翻开：HTTP 200 和 stock: 0 一起被保留下来。",
    "放大镜抽出业务字段，200 只说明响应到了，不代表有货。",
    "回答贴上“暂时缺货”，结论来自 stock 字段，不是状态码。",
  ];
  return <figure ref={scene.ref} className={styles.hero} aria-label="工具结果如何从原始 JSON 翻成库存回答的演示">
    <div className={styles.heroTop}><span>库存翻页簿 · INV-7</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <ResultControls scene={scene} hero />
    <ResultBook state={state} />
    <figcaption role="status" aria-live="polite">{notes[scene.step]}</figcaption>
  </figure>;
}

export function ToolResultLesson() {
  const scene = useScene(labels.length);
  const [variant, setVariant] = useState<ToolResultVariant>("stock0");
  const state = getToolResultDemoState(scene.step, variant);

  function selectVariant(next: ToolResultVariant) {
    setVariant(next);
    scene.seek(1);
  }

  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工具结果翻页簿演示">
    <div className={styles.labTop}><span>RAW RESULT / BUSINESS FIELD</span><strong>修改返回值，观察回答贴纸</strong></div>
    <ResultControls scene={scene} />
    <div className={styles.labControls} role="group" aria-label="选择工具原始返回">
      <div className={styles.controlGroup}>
        <button type="button" aria-pressed={variant === "stock0"} onClick={() => selectVariant("stock0")}>stock=0</button>
        <button type="button" aria-pressed={variant === "stock8"} onClick={() => selectVariant("stock8")}>stock=8</button>
        <button type="button" aria-pressed={variant === "timeout"} onClick={() => selectVariant("timeout")}>timeout</button>
      </div>
      <div className={styles.controlGroup}><button type="button" onClick={() => { setVariant("stock0"); scene.seek(0); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    </div>
    <ResultBook state={state} lesson />
    <div className={styles.labStatus} data-safe={variant !== "timeout" && state.answerVisible} role="status" aria-live="polite">
      {variant === "timeout" ? <XCircle size={16} aria-hidden="true" /> : state.answerVisible ? <CheckCircle size={16} aria-hidden="true" /> : <WarningCircle size={16} aria-hidden="true" />}
      <span>{state.status}</span>
    </div>
  </div>;
}
