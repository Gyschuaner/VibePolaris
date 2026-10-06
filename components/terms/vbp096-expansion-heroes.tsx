"use client";

import { ArrowCounterClockwise, ArrowRight, Check, CheckCircle, Circuitry, Clock, Database, Keyboard, Lightning, Timer, WarningCircle } from "@phosphor-icons/react";
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


export function OptimisticUpdateSignatureHero() {
  const scene = useScene(4);
  const [outcome, setOutcome] = useState<"pass" | "fail">("pass");
  const failed = outcome === "fail";
  return <figure ref={scene.ref} className={styles.frame} data-kind="optimistic" data-step={scene.step} aria-label="乐观更新先改变本地界面，再等待服务器确认或回滚">
    <Header eyebrow="先让手感跟上，再等服务器回话" meta={failed ? "rollback path" : "confirmed path"} />
    <SceneControls scene={scene} labels={["点击操作", "本地先变", "请求在路上", "确认或回滚"]} />
    <div className={styles.controls} role="group" aria-label="切换服务器结果"><button type="button" aria-pressed={!failed} onClick={() => { setOutcome("pass"); scene.seek(0); }}><CheckCircle size={15} />服务器成功</button><button type="button" aria-pressed={failed} onClick={() => { setOutcome("fail"); scene.seek(0); }}><WarningCircle size={15} />服务器失败</button></div>
    <div className={styles.optimisticBoard}><div className={styles.localCard} data-active={scene.step >= 1}><span>本地界面</span><strong>{scene.step >= 1 ? "★ 已收藏" : "☆ 收藏"}</strong><small>{scene.step >= 1 ? "先更新，用户立刻看到" : "等待点击"}</small></div><ArrowRight size={20} className={styles.boardArrow} /><div className={styles.serverCard} data-active={scene.step >= 2} data-danger={failed && scene.step === 3}><span>服务器</span><strong>{scene.step < 2 ? "未确认" : scene.step === 3 && failed ? "拒绝" : "保存中"}</strong><small>{scene.step === 3 ? failed ? "权限不足" : "200 OK" : "POST /favorite"}</small></div><div className={styles.optimisticOutcome} data-danger={failed && scene.step === 3}>{failed && scene.step === 3 ? <ArrowCounterClockwise size={19} /> : <Check size={19} />}<span>{scene.step === 3 ? failed ? "恢复 ☆，并解释原因" : "保持 ★，状态已确认" : "等待最终结果"}</span></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "动作还没有发生" : scene.step === 1 ? "局部状态先变" : scene.step === 2 ? "网络请求不能被假装完成" : failed ? "回滚是显式的失败路径" : "确认后才成为服务端事实"}</strong><span>{failed ? "乐观更新必须保存旧值和失败后的恢复动作。" : "速度变快不等于服务器已接受，更不等于没有冲突。"}</span></div>
    <figcaption>乐观更新把“用户先看到什么”和“服务器最终确认什么”分成两条时间线，失败时要能回到可解释的旧状态。</figcaption>
  </figure>;
}

export function CircuitBreakerSignatureHero() {
  const scene = useScene(4);
  const [failure, setFailure] = useState<"healthy" | "down">("down");
  const down = failure === "down";
  const state = !down ? "CLOSED" : scene.step < 1 ? "CLOSED" : scene.step < 3 ? "OPEN" : "HALF-OPEN";
  return <figure ref={scene.ref} className={styles.frame} data-kind="breaker" data-step={scene.step} aria-label="熔断器在连续失败后打开，冷却后用探针恢复">
    <Header eyebrow="失败太密时，先别把请求继续砸过去" meta={state} />
    <SceneControls scene={scene} labels={["正常通过", "连续失败", "打开冷却", "探针恢复"]} />
    <div className={styles.controls} role="group" aria-label="切换下游服务状态"><button type="button" aria-pressed={!down} onClick={() => { setFailure("healthy"); scene.seek(0); }}><CheckCircle size={15} />下游正常</button><button type="button" aria-pressed={down} onClick={() => { setFailure("down"); scene.seek(0); }}><WarningCircle size={15} />下游故障</button></div>
    <div className={styles.breakerBoard}><div className={styles.breakerRequests}><span>请求</span>{["A", "B", "C", "D"].map((item, index) => <b key={item} data-muted={down && scene.step >= 2} data-active={scene.step === 0 || scene.step === 3 && index === 0}>{item}<small>{down && scene.step >= 1 ? index < 2 ? "失败" : "拒绝" : "通过"}</small></b>)}</div><div className={styles.breakerSwitch} data-state={state}><Circuitry size={24} /><strong>{state}</strong><small>{state === "CLOSED" ? "请求可以到达下游" : state === "OPEN" ? "快速失败，保护下游" : "只放一个探针"}</small></div><div className={styles.downstream} data-danger={down}><Database size={21} /><span>支付服务</span><strong>{down ? "503" : "200"}</strong><small>{down ? "连接失败" : "可响应"}</small></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "正常路径" : scene.step === 1 ? "失败计数开始累积" : scene.step === 2 ? "熔断器把失败变成快速拒绝" : down ? "探针成功才允许半开回收" : "服务健康，保持闭合"}</strong><span>{down ? "熔断器保护的是依赖和调用方的恢复空间，不会修好下游。" : "恢复后仍需用探针确认，而不是靠时间猜测。"}</span></div>
    <figcaption>熔断器把反复失败后的等待、拒绝和探测分开，避免每个调用方各自重试把故障放大。</figcaption>
  </figure>;
}
