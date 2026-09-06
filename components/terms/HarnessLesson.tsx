"use client";

import { ArrowLeft, ArrowRight, ArrowCounterClockwise, Brain, FileText, MagnifyingGlass, NotePencil, User, Wrench, CheckSquare, Square } from "@phosphor-icons/react";
import { useEffect, useReducer, useSyncExternalStore } from "react";
import { initialLesson, isSettled, lessonReducer, lessonSteps, lessonTask, lessonView, todoItems } from "@/lib/harness-lesson";
import styles from "./HarnessLesson.module.css";

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function motionSnapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function serverMotionSnapshot() { return false; }

function Caption({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={styles.caption + " " + className}>{children}</p>;
}
function TodoRows({ highlight = false }: { highlight?: boolean }) {
  return <ul className={styles.todoRows}>{todoItems.map(item => <li key={item.text} data-highlight={highlight && !item.done}>
    {item.done ? <CheckSquare size={20} aria-label="已完成" /> : <Square size={20} aria-label="未完成" />}
    <span>{item.text}</span>
  </li>)}</ul>;
}
function Flow({ side, direction, label, active = true, lower = false }: { side: "model" | "tool"; direction: "left" | "right"; label: string; active?: boolean; lower?: boolean }) {
  return <div className={[styles.flow, styles[side + "Flow"], lower ? styles.lowerFlow : "", active ? styles.activeFlow : ""].join(" ")} data-direction={direction} aria-label={label}>
    <span>{label}</span>
    {direction === "left" ? <ArrowLeft weight="regular" size={116} preserveAspectRatio="none" /> : <ArrowRight weight="regular" size={116} preserveAspectRatio="none" />}
  </div>;
}

export function HarnessLesson() {
  const [state, dispatch] = useReducer(lessonReducer, initialLesson);
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotionSnapshot);
  const { step, beat, revision } = state;
  const view = lessonView(state);
  const settled = isSettled(state);
  const current = lessonSteps[step];
  useEffect(() => {
    if (settled) return;
    const timer = setTimeout(() => dispatch(reduced ? { type: "settle" } : { type: "tick", revision }), reduced ? 0 : current.beats[beat]);
    return () => clearTimeout(timer);
  }, [beat, current, reduced, revision, settled]);
  const next = () => dispatch({ type: "next", reduced });

  return <section id="harness-demo" className={styles.lesson} data-step={step + 1} data-beat={beat} data-settled={settled}
    aria-labelledby="lesson-title" onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); dispatch({ type: "previous" }); }
    }}>
    <div className={styles.heading}><span className={styles.number}>{String(step + 1).padStart(2, "0")}</span><h1 id="lesson-title">{current.title}</h1></div>
    <p className={styles.task}>{lessonTask}</p>

    <div className={styles.scene} key={revision} data-step={step + 1} data-beat={beat}>
      <div className={styles.model}>
        <h2>模型</h2>
        <div className={styles.characterWrap}>
          <div className={styles.modelIcon + (step === 3 ? " " + styles.quiet : "")}><Brain size={78} weight="thin" aria-hidden="true" /></div>
        </div>
        {step === 0 && <Caption>尚未读取文件</Caption>}
      </div>

      <div className={styles.runtime}>
        <h2>Harness</h2>
        <div className={styles.runtimeBox}>
          {step === 0 && <div className={styles.slip + " " + styles.userSlip}><User size={22} /><p>{lessonTask}</p></div>}
          {step === 1 && <div className={styles.inputGroup}>
            <div className={styles.slip}><NotePencil size={22} /><p>任务：找出 todo.txt 中的未完成事项</p></div>
            <div className={styles.slip}><Wrench size={22} /><p>工具：<code>read_file(path)</code><small>读取指定文件</small></p></div>
          </div>}
          {step === 2 && <div className={styles.requestGroup} data-visible={beat >= 1}>
            <div className={styles.slip}><Wrench size={24} /><div><strong>工具请求</strong><code>{'read_file(path="todo.txt")'}</code></div></div>
          </div>}
          {step === 3 && <>
            <div className={styles.slip}><Wrench size={23} /><div><strong>工具请求</strong><code>{'read_file("todo.txt")'}</code></div></div>
            <p className={styles.permission}>读取已允许</p>
            {view.toolReturned && <div className={styles.slip + " " + styles.resultSlip}><div><strong><FileText size={20} />工具结果</strong><TodoRows /></div></div>}
          </>}
          {step === 4 && <>
            <div className={styles.history}><NotePencil size={19} /><span>任务 + 工具说明</span></div>
            <div className={styles.history}><Wrench size={19} /><span>刚才的读取请求</span></div>
            <div className={styles.resultGroup}>
              <div className={styles.slip + " " + styles.resultSlip}><div><strong><FileText size={20} />新增：工具结果</strong><TodoRows /></div></div>
            </div>
          </>}
          {step === 5 && view.answered && <div className={styles.answerGroup}>
            <div className={styles.slip + " " + styles.answer}><div><strong><FileText size={21} />还有两件事：</strong><ul>{todoItems.filter(item => !item.done).map(item => <li key={item.text}>{item.text}</li>)}</ul></div></div>
          </div>}
        </div>
        {view.notes && step > 0 && <Caption className={styles.runtimeNote}>{current.note}</Caption>}
      </div>

      <div className={styles.fileTool}>
        <h2>文件工具</h2>
        <div className={styles.fileWrap}>
          {view.fileRead ? <div className={styles.openFile}><FileText size={26} weight="light" /><TodoRows highlight={view.answered} /></div> : <FileText className={styles.closedFile} size={132} weight="thin" />}
          <MagnifyingGlass className={styles.magnifier} size={38} weight="light" aria-hidden="true" />
          <span className={styles.filename}>todo.txt</span>
        </div>
        {view.notes && current.fileNote && <Caption>{current.fileNote}</Caption>}
        {view.answered && <span className={styles.finished}>本轮结束</span>}
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
        <button type="button" disabled={step === 0} onClick={() => dispatch({ type: "previous" })}><ArrowLeft size={20} />上一步</button>
        {step === 5 ? <button className={styles.primary} type="button" onClick={() => dispatch({ type: "replay" })}>重播<ArrowCounterClockwise size={20} /></button>
          : <button className={styles.primary} type="button" disabled={!settled} onClick={next}>下一步<ArrowRight size={20} /></button>}
      </div>
    </div>
    <details className={styles.explanation}><summary>这六步里的 Harness 做了什么？</summary>
      <p>它准备上下文、调用模型、调度工具，再把工具结果交给下一次模型调用。模型选择动作，文件工具执行读取。</p>
      <p>这里用固定待办演示，不会读取你的文件。按钮控制讲解节奏；真实运行由程序连续推进。权限、长任务恢复和验收是后续能力，结束回答不等于通过验收。</p>
    </details>
  </section>;
}
