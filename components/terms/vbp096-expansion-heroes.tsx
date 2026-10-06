"use client";

import { CheckCircle, Clock, Keyboard, Lightning, Timer } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./Vbp096ExpansionHeroes.module.css";

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

export function DebounceSignatureHero() {
  const scene = useScene(4);
  const [delay, setDelay] = useState<"short" | "long">("long");
  const events = delay === "long" ? ["你", "你想", "你想搜"] : ["你", "你想", "你想搜"];
  const sent = scene.step >= 3 ? 1 : scene.step >= 2 ? 0 : scene.step;
  return <figure ref={scene.ref} className={styles.frame} data-kind="debounce" data-step={scene.step} aria-label="防抖把连续输入合并成一次动作">
    <Header eyebrow="连续按键，不等于连续请求" meta={delay === "long" ? "300 ms quiet" : "50 ms quiet"} />
    <SceneControls scene={scene} labels={["收到输入", "重新计时", "等安静窗口", "只发一次"]} />
    <div className={styles.controls} role="group" aria-label="切换防抖等待窗口"><button type="button" aria-pressed={delay === "long"} onClick={() => { setDelay("long"); scene.seek(0); }}><Clock size={15} />等 300ms</button><button type="button" aria-pressed={delay === "short"} onClick={() => { setDelay("short"); scene.seek(0); }}><Lightning size={15} />等 50ms</button></div>
    <div className={styles.debounceBoard}><div className={styles.eventRail}><span>输入事件</span>{events.map((event, index) => <b key={event} data-active={scene.step >= index}>{event}<small>{index + 1}</small></b>)}</div><div className={styles.timerDial} data-active={scene.step >= 1}><Timer size={22} /><strong>{scene.step === 3 ? "0 ms" : scene.step >= 2 ? "300 ms" : "计时中"}</strong><small>{scene.step >= 2 ? "窗口没有被新输入打断" : "新输入会重置计时"}</small></div><div className={styles.debounceResult} data-good={scene.step === 3}><Keyboard size={18} /><span>发送给搜索</span><strong>{sent} 次</strong><small>{scene.step === 3 ? "只带着最后一个值" : "等待稳定"}</small></div></div>
    <div className={styles.status} role="status"><strong>{scene.step < 2 ? "每次输入都在重置窗口" : scene.step === 2 ? "安静窗口开始" : "一次请求代表最终输入"}</strong><span>{delay === "long" ? "适合搜索框这类连续输入。" : "窗口更短，响应更快，也更容易多发请求。"}</span></div>
    <figcaption>防抖不是节流：它等一段没有新事件的时间，只把最后一次变化交给后续动作。</figcaption>
  </figure>;
}

