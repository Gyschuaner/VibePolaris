"use client";

import { useState } from "react";
import { CheckCircle, ClipboardText, Eye, Flag, PlayCircle, Wrench, XCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../AiStackCoreConcepts.module.css";

const labels = ["读状态", "跑一次检查", "把结果写回", "停止或到达上限"];

export function AgentLoopLesson() {
  const scene = useScene(labels.length);
  const [limit, setLimit] = useState<2 | 3>(3);
  const limited = limit === 2 && scene.step === 3;
  const passed = limit === 3 && scene.step === 3;
  const nodes = [
    { title: "当前状态", text: scene.step === 0 ? "还有 1 项检查" : "清单与上轮结果", Icon: ClipboardText },
    { title: "动作", text: scene.step < 1 ? "等待工具" : "run_checks()", Icon: Wrench },
    { title: "观察", text: scene.step < 2 ? "尚未返回" : scene.step === 2 ? "disabled 仍然错误" : "测试通过", Icon: Eye },
    { title: "闸门", text: scene.step === 3 ? (limited ? "上限 2 轮" : "完成条件") : "继续判断", Icon: scene.step === 3 && !limited ? CheckCircle : scene.step === 3 ? XCircle : Flag },
  ];

  return <div className={styles.loopLab} ref={scene.ref} role="region" aria-label="智能体循环追踪台">
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.loopTrace}>
      <div className={styles.loopRail} role="group" aria-label="循环轮次上限">
        <button type="button" aria-pressed={limit === 3} onClick={() => { setLimit(3); scene.seek(3); }}>允许 3 轮<small>修复后还能复查</small></button>
        <button type="button" aria-pressed={limit === 2} onClick={() => { setLimit(2); scene.seek(3); }}>只允许 2 轮<small>到点也要停</small></button>
      </div>
      <div className={styles.loopWorkspace}>
        <div className={styles.loopNodes}>
          {nodes.map(({ title, text, Icon }, index) => <div key={title} className={styles.loopNode} data-active={scene.step === index}>
            <Icon size={22} aria-hidden="true" /><strong>{title}</strong><span>{text}</span><code>{index === 0 ? "state" : index === 1 ? "act" : index === 2 ? "observe" : "stop?"}</code>
          </div>)}
        </div>
        <p className={styles.loopResult} data-danger={limited} role="status">
          {scene.step === 0 && "任务从一份已有状态开始，不能把上一轮的结果藏掉。"}
          {scene.step === 1 && "动作已经发出，结果还没回来；此刻不能把测试写成通过。"}
          {scene.step === 2 && "观察到具体失败：disabled 状态仍错误，下一轮只围绕这个证据改动。"}
          {scene.step === 3 && (limited ? "两轮用完仍没有通过。循环停止，但任务保持未完成，不能把停止当成成功。" : "检查通过，完成条件成立，循环在这里停下。")}
        </p>
      </div>
    </div>
    <p className={styles.windowVerdict} role="status"><PlayCircle size={17} aria-hidden="true" /> 每一轮只推进一个可核对的状态；工具结果回来之前，下一轮还没有开始。</p>
  </div>;
}
