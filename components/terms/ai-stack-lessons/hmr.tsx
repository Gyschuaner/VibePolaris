"use client";

import { useState } from "react";
import { ArrowRight, Broadcast, CheckCircle, Code, Cube, Gauge, UserCircle, Warning } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type HmrCase = "accepted" | "fallback";
const cases: Record<HmrCase, string> = { accepted: "边界接受", fallback: "边界拒绝" };
const labels: Record<HmrCase, string[]> = {
  accepted: ["改动前", "变更消息到达", "dispose → accept", "状态继续保留"],
  fallback: ["改动前", "变更消息到达", "边界没有接受", "退回整页重载"],
};

export function HmrLesson() {
  const [scenario, setScenario] = useState<HmrCase>("accepted");
  const scene = useScene(labels[scenario].length);
  const step = scene.step;
  const fallback = scenario === "fallback";
  const delivered = step >= 1;
  const applied = step >= 2;
  const finished = step >= 3;
  const preserved = !fallback && finished;

  function selectScenario(next: HmrCase) {
    setScenario(next);
    scene.seek(0);
  }

  return <div className={styles.hmrStory} ref={scene.ref} role="region" aria-label="热模块替换的消息与更新边界演示">
    <div className={styles.hmrChoices} role="group" aria-label="选择 HMR 更新结果">
      {(Object.keys(cases) as HmrCase[]).map(key => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => selectScenario(key)}>{cases[key]}</button>)}
    </div>
    <div className={styles.hmrFlow}>
      <div className={`${styles.hmrNode} ${delivered ? styles.hmrNodeDone : styles.hmrNodeActive}`}><Code size={21} aria-hidden="true" /><span>Button 模块</span><code>{delivered ? "Button.tsx · changed" : "Button.tsx"}</code><small>{delivered ? "只改 1 / 20 个模块" : "准备修改"}</small></div>
      <ArrowRight className={styles.hmrArrow} size={18} aria-hidden="true" />
      <div className={`${styles.hmrNode} ${delivered && !applied ? styles.hmrNodeActive : delivered ? styles.hmrNodeDone : styles.hmrNodeWaiting}`}><Broadcast size={21} aria-hidden="true" /><span>开发服务器</span><code>{delivered ? "update: Button" : "等待文件变化"}</code><small>{delivered ? "发送一个模块" : "消息通道空闲"}</small></div>
      <ArrowRight className={styles.hmrArrow} size={18} aria-hidden="true" />
      <div className={`${styles.hmrNode} ${applied && !finished ? styles.hmrNodeActive : applied ? styles.hmrNodeDone : styles.hmrNodeWaiting}`}><Gauge size={21} aria-hidden="true" /><span>浏览器运行时</span><code>{applied ? (fallback ? "boundary · reject" : "dispose → accept") : "等待更新"}</code><small>{applied ? (fallback ? "没有可接受边界" : "清理旧模块并接收") : "尚未处理"}</small></div>
      <ArrowRight className={styles.hmrArrow} size={18} aria-hidden="true" />
      <div className={`${styles.hmrState} ${finished ? (preserved ? styles.hmrStateKept : styles.hmrStateReset) : styles.hmrStateWaiting}`}><UserCircle size={21} aria-hidden="true" /><span>页面状态</span><div><strong>{preserved ? "7" : fallback && finished ? "0" : "7"}</strong><small>次点击 · {fallback && finished ? "未填写" : "小林"}</small></div><small>{finished ? (preserved ? "继续运行" : "整页重载后初始化") : "计数仍在内存"}</small></div>
    </div>
    <div className={`${styles.hmrStatus} ${fallback && finished ? styles.hmrStatusWarn : ""}`} role="status" aria-live="polite">
      {fallback && finished ? <><Warning size={19} aria-hidden="true" /><p><strong>更新边界拒绝了这次替换。</strong>浏览器退回整页重载，内存里的计数 7 和姓名“小林”一起回到初始值；这是 HMR 的回退路径。</p></> : preserved ? <><CheckCircle size={19} aria-hidden="true" /><p><strong>局部更新完成。</strong>Button 变了，表单姓名和计数仍由未替换的应用状态继续持有。</p></> : applied ? <><Gauge size={19} aria-hidden="true" /><p><strong>{fallback ? "运行时正在判断更新边界。" : "运行时正在执行更新边界。"}</strong>{fallback ? "因为没有 accept，下一步会走整页重载。" : "先 dispose 旧模块，再让 accept 处理新模块。"}</p></> : delivered ? <><Broadcast size={19} aria-hidden="true" /><p><strong>只送来一个模块。</strong>开发服务器把 Button 的变更消息交给浏览器，其他 19 个模块没有重新下载。</p></> : <><Cube size={19} aria-hidden="true" /><p><strong>页面正在运行。</strong>计数 7 和姓名“小林”属于当前应用状态，Button 还没有变化。</p></>}
    </div>
    <div className={styles.hmrControls}><SceneControls scene={scene} labels={labels[scenario]} /></div>
    <p className={styles.hmrBoundary}><strong>局部替换的边界。</strong>HMR 只在开发阶段工作，是否保留状态取决于模块和框架有没有可接受的更新边界；它不是“永不刷新”的保证。</p>
  </div>;
}
