"use client";

import { ArrowLeft, ArrowRight, ArrowCounterClockwise, FileText, MagnifyingGlass, Pause, Play, Wrench, CheckSquare, Square } from "@phosphor-icons/react";
import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import { initialLesson, isSettled, lessonReducer, lessonSteps, lessonView, todoItems } from "@/lib/harness-lesson";
import intro from "@/content/zh/terms/agent-harness/lesson-intro.json";
import { HarnessUserMessage } from "./HarnessUserMessage";
import { HarnessChat } from "./HarnessChat";
import styles from "./HarnessLesson.module.css";

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function motionSnapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function serverMotionSnapshot() { return false; }

function TodoRows({ highlight = false }: { highlight?: boolean }) {
  return <ul className={styles.todoRows}>{todoItems.map(item => <li key={item.text} data-highlight={highlight && !item.done}>
    {item.done ? <CheckSquare size={20} aria-label="已完成" /> : <Square size={20} aria-label="未完成" />}
    <span>{item.text}</span>
  </li>)}</ul>;
}
function Flow({ side, direction, label, active = true, lower = false }: { side: "model" | "tool"; direction: "left" | "right"; label: string; active?: boolean; lower?: boolean }) {
  return <div className={[styles.flow, styles[side + "Flow"], lower ? styles.lowerFlow : "", active ? styles.activeFlow : ""].join(" ")} data-direction={direction} aria-label={label}>
    {direction === "left" ? <ArrowLeft weight="regular" size={116} preserveAspectRatio="none" /> : <ArrowRight weight="regular" size={116} preserveAspectRatio="none" />}
  </div>;
}

export function HarnessLesson() {
  const [mode, setMode] = useState<"chat" | "harness">("harness");
  const [autoPlay, setAutoPlay] = useState(false);
  const [state, dispatch] = useReducer(lessonReducer, initialLesson);
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotionSnapshot);
  const { step, beat, revision } = state;
  const view = lessonView(state);
  const settled = isSettled(state);
  const current = lessonSteps[step];
  useEffect(() => {
    if (settled || mode === "chat") return;
    const timer = setTimeout(() => dispatch(reduced ? { type: "settle" } : { type: "tick", revision }), reduced ? 0 : current.beats[beat]);
    return () => clearTimeout(timer);
  }, [beat, current, reduced, revision, settled, mode]);
  useEffect(() => {
    if (!autoPlay || mode === "chat" || !settled) return;
    const complete = step === lessonSteps.length - 1;
    const timer = setTimeout(() => {
      if (complete) setAutoPlay(false);
      else dispatch({ type: "next", reduced });
    }, reduced ? 900 : 1100);
    return () => clearTimeout(timer);
  }, [autoPlay, mode, reduced, settled, step]);
  const next = () => {
    setAutoPlay(false);
    dispatch({ type: "next", reduced });
  };
  const previous = () => {
    setAutoPlay(false);
    dispatch({ type: "previous" });
  };
  const replay = () => {
    setAutoPlay(false);
    dispatch({ type: "replay" });
  };
  const changeMode = (nextMode: "chat" | "harness") => {
    setAutoPlay(false);
    setMode(nextMode);
  };
  const toggleAutoPlay = () => {
    if (autoPlay) {
      setAutoPlay(false);
      return;
    }
    if (step === lessonSteps.length - 1) dispatch({ type: "replay" });
    setAutoPlay(true);
  };

  return <section id="harness-demo" className={styles.lesson} data-mode={mode} data-step={step + 1} data-beat={beat} data-settled={settled}
    aria-labelledby="lesson-title" onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey || mode === "chat") return;
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    }}>
    <div className={styles.heading}>
      {mode === "harness" && <span className={styles.number}>{String(step + 1).padStart(2, "0")}</span>}
      <h2 id="lesson-title">{mode === "chat" ? intro.chatTitle : current.title}</h2>
      <div className={styles.modeSwitch} role="group" aria-label={intro.modesLabel} onKeyDown={event => event.stopPropagation()}>
        <button type="button" aria-pressed={mode === "chat"} onClick={() => changeMode("chat")}>Chat</button>
        <button type="button" aria-pressed={mode === "harness"} onClick={() => changeMode("harness")}>Harness</button>
      </div>
    </div>

    {mode === "chat" ? <HarnessChat reduced={reduced} /> : <>

    <div className={styles.scene} key={revision} data-step={step + 1} data-beat={beat}>
      <div className={styles.model}>
        <h3>模型</h3>
        <div className={styles.characterWrap}>
          <div className={styles.modelIcon + (step === 3 ? " " + styles.quiet : "")}><span className={styles.claudeIcon} role="img" aria-label={intro.model} /></div>
        </div>
      </div>

      <div className={styles.runtime}>
        <h3>Harness</h3>
        <div className={styles.runtimeBox}>
          {step === 0 && <HarnessUserMessage />}
          {step === 1 && <div className={styles.inputGroup}>
            <HarnessUserMessage />
            <div className={styles.slip}><Wrench size={22} /><p>工具：<code>read_file(path)</code></p></div>
          </div>}
          {step === 2 && <div className={styles.requestGroup} data-visible={beat >= 1}>
            <div className={styles.slip}><Wrench size={24} /><div><strong>工具请求</strong><code>{'read_file(path="todo.txt")'}</code></div></div>
          </div>}
          {step === 3 && <>
            <div className={styles.slip}><Wrench size={23} /><div><strong>工具请求</strong><code>{'read_file("todo.txt")'}</code></div></div>
            {view.toolReturned && <div className={styles.slip + " " + styles.resultSlip}><div><strong><FileText size={20} />工具结果</strong><TodoRows /></div></div>}
          </>}
          {step === 4 && <>
            <div className={styles.resultGroup}>
              <div className={styles.slip + " " + styles.resultSlip}><div><strong><FileText size={20} />新增：工具结果</strong><TodoRows /></div></div>
            </div>
          </>}
          {step === 5 && view.answered && <div className={styles.answerGroup}>
            <div className={styles.slip + " " + styles.answer}><div><strong><FileText size={21} />还有两件事：</strong><ul>{todoItems.filter(item => !item.done).map(item => <li key={item.text}>{item.text}</li>)}</ul></div></div>
          </div>}
        </div>
      </div>

      <div className={styles.fileTool}>
        <h3>文件工具</h3>
        <div className={styles.fileWrap}>
          {view.fileRead ? <div className={styles.openFile}><FileText size={26} weight="light" /><TodoRows highlight={view.answered} /></div> : <FileText className={styles.closedFile} size={132} weight="thin" />}
          <MagnifyingGlass className={styles.magnifier} size={38} weight="light" aria-hidden="true" />
          <span className={styles.filename}>todo.txt</span>
        </div>
      </div>

      {step === 1 && <Flow side="model" direction="left" label="第一次调用" active={!settled} />}
      {step === 2 && <Flow side="model" direction="right" label="工具请求" active={!settled} />}
      {step === 3 && <><Flow side="tool" direction="right" label="执行读取" active={beat === 0} />{beat >= 2 && <Flow side="tool" direction="left" label="工具结果" lower active={beat === 2} />}</>}
      {step === 4 && beat >= 1 && <Flow side="model" direction="left" label="第二次调用" active={!settled} />}
      {step === 5 && <Flow side="model" direction="right" label="回答" active={!settled} />}
    </div>

    <div className={styles.controls}>
      <span className={styles.progress} aria-live="polite">{step + 1}<span> / 6</span></span>
      <span role="status" className={styles.srOnly}>{current.title}{settled ? "。可以继续。" : "。正在演示。"}</span>
      <div className={styles.buttons}>
        <button className={styles.autoPlay} type="button" aria-pressed={autoPlay} onClick={toggleAutoPlay}>
          {autoPlay ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}{autoPlay ? "暂停" : "自动播放"}
        </button>
        <button type="button" disabled={step === 0} onClick={previous}><ArrowLeft size={20} />上一步</button>
        {step === 5 ? <button className={styles.primary} type="button" onClick={replay}>重播<ArrowCounterClockwise size={20} /></button>
          : <button className={styles.primary} type="button" disabled={!settled} onClick={next}>下一步<ArrowRight size={20} /></button>}
      </div>
    </div>
    </>}
  </section>;
}
