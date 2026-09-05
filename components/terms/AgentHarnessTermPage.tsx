"use client";

import { ArrowCounterClockwise, ArrowRight, ArrowUpRight, Brain, Check, Copy, Pause, Play, SkipForward, Circle, CheckCircle, GitFork } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import type { BespokeTermPageProps } from "./BespokeTermScaffold";
import { harnessSteps, harnessSources, harnessPrompt, harnessMarkdown } from "@/lib/harness-content";
import { copyHarnessText, harnessPlayer, initialHarnessPlayer } from "@/lib/harness-player";
import styles from "./AgentHarnessTermPage.module.css";

function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    const result = await copyHarnessText(text, navigator.clipboard);
    setStatus(result);
    if (result === "copied") timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  return <div className={styles.copyAction}>
    <button type="button" className={primary ? styles.primary : styles.copy} onClick={copy}>
      {status === "copied" ? <Check size={16} /> : <Copy size={16} />}{status === "copied" ? "已复制" : label}
    </button>
    <span role="status" className={status === "failed" ? styles.copyError : styles.srOnly}>{status === "failed" ? "复制失败，请手动选中文字复制，或重试。" : status === "copied" ? "内容已复制到剪贴板" : ""}</span>
  </div>;
}

export function AgentHarnessTermPage({ term, related }: BespokeTermPageProps) {
  const [{ mode, step, playing }, dispatch] = useReducer(harnessPlayer, initialHarnessPlayer);
  const lastStep = mode === "with" ? harnessSteps.length : 1;
  const complete = step === lastStep;

  useEffect(() => {
    if (!playing) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const advance = () => {
      dispatch({ type: "tick", reduced: motion.matches });
    };
    const timer = setTimeout(advance, motion.matches ? 0 : 1900);
    const onMotionChange = () => { if (motion.matches) { clearTimeout(timer); advance(); } };
    motion.addEventListener("change", onMotionChange);
    return () => { clearTimeout(timer); motion.removeEventListener("change", onMotionChange); };
  }, [playing, step, lastStep]);

  function changeMode(next: "with" | "without") { dispatch({ type: "mode", mode: next }); }
  function play() {
    dispatch({ type: "play", reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
  }
  const current = mode === "without"
    ? { title: complete ? "只能给建议" : "只给模型", summary: complete ? "模型给出了整理思路，但没有读取文件或生成可核对的产物。" : "任务相同：汇总反馈。此时没有接入文件读取工具，也没有提供反馈正文。", evidence: complete ? "建议：先读取反馈，再按主题归类并统计。" : "输入：请汇总 /data/feedback.md 中的产品反馈。", note: "这里比较的是运行环境。若直接提供完整资料，模型也可以完成文本归纳。" }
    : step === 0
      ? { title: "准备开始", summary: "同一个模型，同一份任务。观察 Harness 怎样把一次回答组织成可检查的执行过程。", evidence: "任务：读取反馈 → 归类总结 → 保留来源", note: "点击播放或单步，逐步展开四个环节。这是本地教学示例。" }
      : harnessSteps[step - 1];

  return <main className={styles.page} id="main-content">
    <header className={styles.header}>
      <div className={styles.breadcrumbRow}>
        <nav className={styles.breadcrumb} aria-label="面包屑"><Link href="/terms">术语词典</Link><span>/</span><Link href="/terms?cat=AI%C2%B7Agent">AI · Agent</Link><span>/</span><span>Agent Harness</span></nav>
        <CopyButton text={harnessMarkdown} label="复制全文 Markdown" />
      </div>
      <div className={styles.titleRow}><i className="brand-star-only" aria-hidden="true" /><div><h1>Agent Harness</h1><p className={styles.subtitle}>智能体运行框架</p></div></div>
      <p className={styles.definition}>{term.definition.split("。").filter(Boolean).map(sentence => <span key={sentence}>{sentence}。</span>)}</p>
      <p className={styles.scope}>上下文 <span>/</span> 工具与权限 <span>/</span> 循环与预算 <span>/</span> 轨迹与验收</p>
    </header>

    <section className={styles.prompt} aria-labelledby="harness-prompt-title"><div><h2 id="harness-prompt-title">可以这样向 AI 表达</h2><p>{harnessPrompt}</p></div><CopyButton primary text={harnessPrompt} label="复制这段说法" /></section>

    <section className={styles.demo} aria-labelledby="harness-demo-title">
      <h2 id="harness-demo-title">同一个模型，接入 Harness 后改变什么？</h2>
      <p className={styles.task}>同一任务：汇总产品反馈要点 <span>本地示例</span></p>
      <div className={styles.comparison} aria-label="同模型同任务的双轨对照">
        <div className={styles.model}><Brain size={36} weight="light" /><strong>同一模型</strong><small>同一任务</small></div>
        <GitFork className={styles.fork} size={28} weight="light" aria-hidden="true" />
        <div className={`${styles.lane} ${styles.modelLane} ${mode === "without" ? styles.selectedLane : ""}`}>
          <strong>只给模型</strong><div className={styles.simpleTrack}><Circle size={15} /><span /><Circle size={15} /></div><span className={styles.outcome}>只能给建议</span>
        </div>
        <div className={`${styles.lane} ${styles.harnessLane} ${mode === "without" ? styles.mutedLane : ""}`}>
          <strong>接入 <span>Harness</span></strong>
          <ol className={styles.steps} aria-label="Harness 四个环节">{harnessSteps.map((item, index) => <li key={item.title} className={mode === "with" && step >= index + 1 ? styles.reached : ""}>
            <button type="button" aria-label={`查看步骤 ${index + 1}：${item.title}`} aria-pressed={mode === "with" && step === index + 1} onClick={() => dispatch({ type: "select", step: index + 1 })}>
              {mode === "with" && step > index + 1 ? <CheckCircle size={20} weight="fill" /> : <Circle size={20} weight={mode === "with" && step === index + 1 ? "duotone" : "regular"} />}
              <span>{item.title}</span>
            </button>
          </li>)}</ol>
          <span className={`${styles.outcome} ${mode === "with" && complete ? styles.finished : ""}`}>{mode === "with" && complete ? <Check size={16} /> : null}完成并可核对</span>
        </div>
      </div>
      <div className={styles.detail} aria-live="polite" aria-atomic="true">
        <div className={styles.detailHeading}><strong>{step === 0 ? "开始之前" : `当前步骤 · ${current.title}`}</strong><span>{String(step).padStart(2, "0")} / {String(lastStep).padStart(2, "0")}</span></div>
        <p>{current.summary}</p><code>{current.evidence}</code><small>{current.note}</small>
      </div>
      <div className={styles.controls}>
        <div className={styles.segment} aria-label="选择运行环境">{([['without', '无 Harness'], ['with', '有 Harness']] as const).map(([value, label]) => <button type="button" aria-pressed={mode === value} key={value} onClick={() => changeMode(value)}>{label}</button>)}</div>
        <div className={styles.playback} aria-label="演示控制">
          <button type="button" onClick={play} aria-pressed={playing}>{playing ? <Pause size={17} weight="fill" /> : <Play size={17} weight="fill" />}{playing ? "暂停" : complete ? "再播放" : "播放"}</button>
          <button type="button" disabled={complete} onClick={() => dispatch({ type: "next" })}><SkipForward size={18} />单步</button>
          <button type="button" onClick={() => dispatch({ type: "reset" })}><ArrowCounterClockwise size={18} />重来</button>
        </div>
        <small>点击后播放，不自动循环</small>
      </div>
    </section>

    <section className={styles.reading} aria-label="使用场景与概念边界">
      <div><h2>什么时候需要它</h2><p>任务涉及多次工具调用、长时间执行或失败重试。需要记录过程，并按明确标准检查交付。</p></div>
      <div><h2>它的边界</h2><p>{term.boundary}</p></div>
    </section>
    <nav className={styles.related} aria-label="继续理解"><h2>继续理解</h2>{related.map(item => <Link href={`/terms/${item.slug}`} key={item.slug}>{item.zh}<ArrowRight size={15} /></Link>)}<Link className={styles.back} href="/">返回星图<ArrowUpRight size={15} /></Link></nav>
    <section className={styles.sources} aria-label="参考来源"><span>参考来源</span>{harnessSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={13} /></a>)}</section>
  </main>;
}
