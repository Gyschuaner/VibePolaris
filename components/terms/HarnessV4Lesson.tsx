"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Wrench,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useReducer, useRef, useSyncExternalStore } from "react";

import {
  createHarnessState,
  harnessFrame,
  harnessReducer,
  harnessScenarios,
  type HarnessMode,
} from "@/lib/harness-v4";
import { HarnessModelChat } from "@/components/terms/HarnessChatLesson";
import { HarnessRunChat } from "./HarnessRunChat";

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function motionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function serverMotionSnapshot() {
  return false;
}

export function HarnessV4Lesson() {
  const [state, dispatch] = useReducer(harnessReducer, undefined, () => createHarnessState());
  const region = useRef<HTMLElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotionSnapshot);
  const frame = harnessFrame(state);
  const max = frame.total - 1;
  const awaitingReply = frame.edge === "mh" && !state.replyComplete;
  const onReplyComplete = useCallback((step: number) => dispatch({ type: "reply-complete", step }), []);

  useEffect(() => {
    if (!state.playing || state.mode === "model" || awaitingReply) return;
    const timer = window.setTimeout(() => dispatch({ type: "tick" }), 2600 / state.speed);
    return () => window.clearTimeout(timer);
  }, [state.playing, state.mode, state.speed, state.step, awaitingReply]);

  useEffect(() => {
    const element = region.current;
    if (!element) return;
    const pause = () => { if (document.hidden) dispatch({ type: "pause" }); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) dispatch({ type: "pause" }); }, { rootMargin: "-110px 0px -40px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", pause);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); };
  }, []);

  const move = (action: "next" | "previous") => dispatch({ type: action });
  const togglePlay = () => dispatch({ type: "play", reduced });
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight") { event.preventDefault(); move("next"); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move("previous"); }
    if (event.key === " ") { event.preventDefault(); togglePlay(); }
  };

  return (
    <>
      <section ref={region} aria-labelledby="harness-lab-title" className="vp-lab" id="harness-demo" tabIndex={-1} onKeyDown={onKeyDown}>
        <div className="vp-lab-header">
          <div className="vp-lab-heading"><Wrench size={18} aria-hidden="true" /><h3 id="harness-lab-title">服务修复演示</h3></div>
          <div aria-label="比较运行方式" className="vp-segment vp-mode-segment" role="group">
            {(["model", "harness"] as HarnessMode[]).map((mode) => <button key={mode} type="button" aria-pressed={state.mode === mode} onClick={() => dispatch({ type: "mode", value: mode })}>{mode === "model" ? "只用模型" : "+ Harness"}</button>)}
          </div>
          <label className="vp-scenario"><span>场景</span><select aria-label="试验条件" value={state.scenario} onChange={(event) => dispatch({ type: "scenario", value: event.target.value })}>{Object.entries(harnessScenarios).map(([value, scenario]) => <option key={value} value={value}>{scenario.label}</option>)}</select></label>
        </div>
        {state.mode !== "model" ? (
          <div className="vp-lab-controls">
            <div className="vp-step-count"><strong>{String(state.step + 1).padStart(2, "0")}</strong><span>/ {String(frame.total).padStart(2, "0")}</span></div>
            <div className="vp-lab-buttons">
              <button className="vp-button vp-play" type="button" aria-pressed={state.playing} onClick={togglePlay}>{state.playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}<span>{state.playing ? "暂停播放" : state.step === 0 ? "开始修复" : "自动播放"}</span></button>
              <button className="vp-speed" type="button" onClick={() => dispatch({ type: "speed" })} aria-label={`播放速度，当前 ${state.speed} 倍`}>{state.speed}×</button>
              <button className="vp-icon-btn" type="button" onClick={() => dispatch({ type: "reset" })} aria-label="重置演示" title="重置"><ArrowCounterClockwise size={17} /></button>
              <button className="vp-button" type="button" disabled={state.step === 0} onClick={() => move("previous")}><ArrowLeft size={16} />上一步</button>
              <button className="vp-button vp-button-primary" type="button" disabled={awaitingReply} onClick={() => state.step === max ? dispatch({ type: "reset" }) : move("next")}>{state.step === max ? "重新开始" : "下一步"}{state.step === max ? <ArrowCounterClockwise size={16} /> : <ArrowRight size={16} />}</button>
            </div>
          </div>
        ) : null}
        <div className="vp-lab-content" data-mode={state.mode}>
          <div className="vp-lab-main">
            {state.mode === "model" ? <HarnessModelChat key={state.scenario} reduced={reduced} /> : <HarnessRunChat key={state.scenario} state={state} reduced={reduced} onReplyComplete={onReplyComplete} />}
          </div>
        </div>
        <div aria-live="polite" className="vp-sr">{state.mode === "model" ? "只用模型：给出排错建议，但没有执行操作。" : `第 ${state.step + 1} 步，${frame.title}。${frame.insight}`}</div>
      </section>
    </>
  );
}
