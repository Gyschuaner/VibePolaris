"use client";

import { useState, type CSSProperties } from "react";
import { CheckCircle, CursorText, Eye, FloppyDisk, Pulse, Timer } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./AssertionConcept.module.css";

const steps = [
  { label: "点下保存", title: "动作已经发生，结果还没到", detail: "用户点击保存；测试现在只能知道请求发出了。", Icon: CursorText },
  { label: "响应在路上", title: "屏幕暂时没有新状态", detail: "按钮要等后端回执，先出现的空白不等于失败。", Icon: Pulse },
  { label: "固定时刻取样", title: "sleep 到点就要做决定", detail: "固定等待只看一个时间点；响应晚一点，它会先报错。", Icon: Timer },
  { label: "条件继续看", title: "断言跟着目标状态走", detail: "条件断言在期限内重读目标，状态一出现就结束等待。", Icon: Eye },
  { label: "比较并报告", title: "差异告诉你该查哪里", detail: "同一个 visible 结果，等待方式不同，证据质量也不同。", Icon: CheckCircle },
];

const delayPresets = [
  { value: 200, label: "快 · 200 ms" },
  { value: 1500, label: "慢 · 1.5 s" },
  { value: 4000, label: "更慢 · 4 s" },
] as const;

function delayLabel(value: number) { return value < 1000 ? value + " ms" : (value / 1000).toFixed(1) + " s"; }
function delayPosition(value: number) { return Math.min(96, Math.max(7, (value / 4000) * 90 + 5)) + "%"; }

export function AssertionHero() {
  const scene = useScene(steps.length);
  const [delay, setDelay] = useState(1500);
  const current = steps[scene.step];
  const final = scene.step === steps.length - 1;
  const fixedPass = delay <= 1000;
  const conditionPass = delay <= 5000;
  const fixedResult = scene.step < 2 ? "尚未取样" : fixedPass ? "PASS @1s" : "FAIL @1s";
  const conditionResult = scene.step < 3 ? "继续观察" : conditionPass ? "PASS @" + delayLabel(delay) : "TIMEOUT @5s";
  const fixedDanger = final && !fixedPass;
  const setDelayAndReset = (next: number) => { setDelay(next); scene.seek(0); };
  const arrivalStyle = { "--assert-arrival": delayPosition(delay) } as CSSProperties;

  return <figure ref={scene.ref} className={styles.assertHero} data-step={scene.step} data-delay={delay} aria-label="断言如何等待异步保存状态并比较固定等待与条件等待">
    <div className={styles.assertHeader}><span>同一个保存结果，为什么两个观察者会给出不同结论</span><strong>act → wait → compare</strong></div>
    <div className={styles.assertControls} role="group" aria-label="调整响应延迟"><div><span>把响应放在不同时间到达</span>{delayPresets.map(preset => <button key={preset.value} type="button" className={styles.assertChoice} aria-pressed={delay === preset.value} onClick={() => setDelayAndReset(preset.value)}>{preset.label}</button>)}</div><div><span>拖动时间，观察断言何时取样</span><label className={styles.assertRange}><Timer size={15} aria-hidden="true" /><input aria-label="响应延迟" type="range" min="200" max="4000" step="100" value={delay} onChange={event => setDelayAndReset(Number(event.target.value))} /><output>{delayLabel(delay)}</output></label></div></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.assertCanvas}>
      <div className={styles.assertAction} data-active={scene.step === 0}>
        <span className={styles.assertIcon}><FloppyDisk size={23} aria-hidden="true" /></span>
        <div><h3>保存按钮</h3><code>click()</code></div>
        <p>{scene.step === 0 ? "用户动作只发出一次。" : "动作完成，等待状态改变。"}</p>
      </div>
      <div className={styles.assertClock} style={arrivalStyle}>
        <div className={styles.assertClockHeader}><span>响应时间线</span><strong>{delayLabel(delay)} 到达</strong></div>
        <div className={styles.assertScale} aria-label={"响应将在 " + delayLabel(delay) + " 到达"}>
          <span className={styles.assertTick}>0</span><span className={styles.assertTick}>1 s</span><span className={styles.assertTick}>2 s</span><span className={styles.assertTick}>4 s</span>
          <span className={styles.assertArrival} data-visible={scene.step >= 1} data-late={delay > 1000} />
        </div>
        <div className={styles.assertClockFoot}><span>目标状态</span><strong>{scene.step >= 3 ? "visible" : "hidden"}</strong></div>
      </div>
      <div className={styles.assertWatch} data-danger={fixedDanger} data-muted={scene.step < 2}>
        <div className={styles.assertWatchHeader}><Timer size={17} aria-hidden="true" /><span>固定时刻 · sleep(1000)</span></div>
        <div className={styles.assertLane}><span className={styles.assertCursor} data-late={!fixedPass} style={{ left: "22%" }} /></div>
        <strong>{fixedResult}</strong>
        <small>{scene.step < 2 ? "还没到读取时间。" : fixedPass ? "1 秒时按钮已经出现，快环境把问题藏住了。" : "1 秒时按钮还没出现，测试先结束。"}</small>
      </div>
      <div className={styles.assertWatch} data-danger={final && !conditionPass} data-muted={scene.step < 3}>
        <div className={styles.assertWatchHeader}><Eye size={17} aria-hidden="true" /><span>条件断言 · toBeVisible</span></div>
        <div className={styles.assertLane}><span className={styles.assertCursor} data-late={false} style={{ left: Math.min(94, Math.max(12, (delay / 5000) * 100)) + "%" }} /></div>
        <strong>{conditionResult}</strong>
        <small>{scene.step < 3 ? "在期限内继续读取目标。" : "状态一出现就比较，不把等待写死成某一秒。"}</small>
      </div>
    </div>
    <div className={styles.assertHeroMetrics}><div><span>实际状态</span><strong>{scene.step >= 3 ? "visible" : "hidden"}</strong></div><div><span>固定等待</span><strong>{fixedResult}</strong></div><div><span>条件等待</span><strong>{conditionResult}</strong></div></div>
    <div className={styles.assertStatus} data-danger={fixedDanger} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {fixedDanger ? "红灯只说明 1 秒取样太早；先读差异，再判断业务是否坏了。" : current.detail}</span></div>
    <figcaption>断言不是把一个布尔值涂成绿色，而是把“什么算完成、允许等多久、失败时看到什么差异”写成可判定条件。</figcaption>
  </figure>;
}
