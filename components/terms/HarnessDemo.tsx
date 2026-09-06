"use client";

import { ArrowCounterClockwise, ArrowRight, ArrowsClockwise, Brain, Check, CheckCircle, FileText, LockSimple, Pause, Play, SkipForward, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useReducer } from "react";
import { feedback, frames, initialSimulation, makeSummary, simulation, validateSummary } from "@/lib/harness-simulation";
import styles from "./HarnessDemo.module.css";

export function HarnessDemo() {
  const [state, dispatch] = useReducer(simulation, initialSimulation);
  const { mode, frame, playing } = state;
  const connected = mode === "with";
  const complete = frame === (connected ? frames.length - 1 : 1);
  const groups = makeSummary(frame >= 6);
  const validation = validateSummary(groups);
  const phase = connected ? frames[frame].phase : frame ? "blocked" : "ready";
  const status = connected ? frames[frame].label : frame ? "没有文件内容或读取工具，模型只能请你提供资料。" : "同一任务，只提供文件路径。";

  useEffect(() => {
    if (!playing) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const advance = () => dispatch({ type: "tick", reduced: media.matches });
    const timer = setTimeout(advance, media.matches ? 0 : connected ? frames[frame].duration : 1400);
    const changed = () => { if (media.matches) advance(); };
    media.addEventListener("change", changed);
    return () => { clearTimeout(timer); media.removeEventListener("change", changed); };
  }, [playing, frame, connected]);

  return <section id="harness-demo" className={styles.demo} data-phase={phase} data-playing={playing} aria-labelledby="harness-demo-title">
    <div className={styles.heading}>
      <h2 id="harness-demo-title">让模型把事情做完。</h2>
      <div className={styles.modes} aria-label="运行环境">
        <button aria-pressed={!connected} onClick={() => dispatch({ type: "mode", mode: "without" })}>只有模型</button>
        <button aria-pressed={connected} onClick={() => dispatch({ type: "mode", mode: "with" })}>接入 Harness</button>
      </div>
    </div>

    <div className={styles.workspace}>
      <div className={`${styles.file} ${connected && frame === 2 ? styles.reading : ""}`}>
        <div className={styles.fileTitle}><FileText size={18} /><span>feedback.md</span><LockSimple size={14} aria-label="只读" /></div>
        <ol className={styles.feedback}>{feedback.map(item => <li key={item.id} id={`feedback-${item.id}`} tabIndex={-1} className={connected && frame >= 4 && frame <= 5 && item.id === "06" ? styles.missing : ""}>
          <span>{item.id}</span><p>{item.text}</p>
        </li>)}</ol>
      </div>

      <div className={styles.runtime}>
        <div className={`${styles.model} ${connected && [1, 3, 5, 6].includes(frame) ? styles.thinking : ""}`}>
          <Brain size={38} weight="light" /><span>模型</span>
        </div>
        <div className={`${styles.harness} ${!connected ? styles.disconnected : ""}`}>
          <span className={styles.harnessLabel}>Harness</span>
          <div className={styles.capabilities}>
            <span data-active={connected && frame >= 1 && frame <= 2}><LockSimple size={17} />工具</span>
            <span data-active={connected && frame === 5}><ArrowsClockwise size={17} />循环</span>
            <span data-active={connected && frame >= 4 && frame !== 5}><CheckCircle size={17} />验收</span>
          </div>
        </div>
        <div className={styles.round}>{connected && frame >= 3 ? `第 ${frame >= 5 ? "2" : "1"} 轮 / 最多 3 轮` : ""}</div>
      </div>

      <div className={styles.output}>
        <div className={styles.fileTitle}><FileText size={18} /><span>summary.md</span>{connected && frame === 7 ? <Check size={17} /> : null}</div>
        {connected && frame >= 3 ? <div className={styles.groups}>{groups.map((group, index) => <div key={group.title} className={`${styles.group} ${frame === 3 ? styles.newGroup : ""} ${index === 2 && frame === 6 ? styles.repaired : ""}`} style={{ animationDelay: `${index * 280}ms` }}>
          <div><strong>{group.title}</strong><span>{group.ids.map(id => <a key={id} href={`#feedback-${id}`} className={id === "06" && frame >= 6 ? styles.added : ""} onClick={event => { event.preventDefault(); const row = document.getElementById(`feedback-${id}`); row?.focus({ preventScroll: true }); }} aria-label={`查看反馈 ${id}`}>#{id}</a>)}</span></div>
          <p>{group.text}</p>
        </div>)}</div> : <div className={styles.empty}>{!connected && frame > 0 ? <><Brain size={24} weight="light" /><p>请提供 feedback.md 的内容，<br />我可以帮你归类。</p></> : <><FileText size={28} weight="thin" /><p>等待生成</p></>}</div>}
        {connected && frame >= 4 ? <div className={`${styles.verdict} ${validation.passed ? styles.passed : styles.failed}`} key={validation.passed ? "pass" : "fail"}>
          {validation.passed ? <CheckCircle size={17} /> : <WarningCircle size={17} />}<span>{validation.covered} / {feedback.length} 覆盖</span><strong>{validation.passed ? "检查通过" : `缺少 #${validation.missing.join("、#")}`}</strong>
        </div> : null}
      </div>

      {connected && frame > 0 && frame < 7 ? <div key={frame} className={`${styles.transfer} ${styles[phase]}`} aria-hidden="true">
        {frame === 4 || frame === 5 ? <WarningCircle size={18} /> : frame === 1 ? <LockSimple size={18} /> : <FileText size={18} />}
        <span>{["", "read_file", "6 条反馈", "生成总结", "检查来源", "缺少 #06", "更新总结"][frame]}</span><ArrowRight size={14} />
      </div> : null}
    </div>

    <div className={styles.footer}>
      <p role="status" aria-live="polite">{status}</p>
      <div className={styles.controls}>
        <button className={styles.play} onClick={() => dispatch({ type: "play", reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches })} aria-pressed={playing}>
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}{playing ? "暂停" : complete ? "再播放" : "播放演示"}
        </button>
        <button title="单步" aria-label="单步" disabled={complete} onClick={() => dispatch({ type: "next" })}><SkipForward size={18} /></button>
        <button title="重来" aria-label="重来" onClick={() => dispatch({ type: "reset" })}><ArrowCounterClockwise size={18} /></button>
      </div>
    </div>
    <details className={styles.trace}><summary>执行记录 · 本地模拟</summary><ol>{connected ? frames.slice(1, frame + 1).map((item, index) => <li key={item.phase}><code>{String(index + 1).padStart(2, "0")}</code>{item.label}</li>) : <li>{frame ? "未配置读取工具，未生成文件。" : "尚未运行。"}</li>}</ol><p>固定样例演示；验收检查来源覆盖，不代表对总结语义的完整验证。</p></details>
  </section>;
}
