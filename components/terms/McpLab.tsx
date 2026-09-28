"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowCounterClockwise, BookOpen, ChatCircleText, Check, FileText, MagnifyingGlass, Pause, PencilLine, Play, PlugsConnected, Wrench } from "@phosphor-icons/react";
import { ConceptHero } from "./ConceptHero";
import styles from "./McpMotion.module.css";

function ToolCard() {
  return <><span className={styles.cardLabel}>工具说明</span><strong><Wrench size={17} />搜索指南</strong><dl><div><dt>用途</dt><dd>查借阅规则</dd></div><div><dt>输入</dt><dd>文字关键词</dd></div></dl></>;
}

export function McpHero() {
  return <ConceptHero slug="mcp-r2" label="同一份工具说明，经 MCP 分别交给聊天助手和写作助手">
    <div className={styles.heroArt}>
      <svg className={styles.heroLines} viewBox="0 0 400 230" preserveAspectRatio="none"><path d="M 285 115 C 205 115 210 55 95 55" /><path d="M 285 115 C 205 115 210 175 95 175" /></svg>
      <div className={styles.heroApp}><ChatCircleText size={21} /><b>聊天助手</b><span><Check size={12} />搜索指南</span></div>
      <div className={`${styles.heroApp} ${styles.heroWriter}`}><PencilLine size={21} /><b>写作助手</b><span><Check size={12} />搜索指南</span></div>
      <div className={styles.heroServer}><BookOpen size={28} weight="light" /><strong>图书馆资料服务</strong><div><Wrench size={13} />搜索指南</div></div>
      <span className={styles.heroProtocol}>MCP</span>
    </div>
  </ConceptHero>;
}

const apps = ["聊天助手", "写作助手"];
const phases = ["接入前", "连接后，询问有哪些工具", "服务送来工具说明", "模型选好工具，应用发出查询", "服务在指南中查找", "服务送回找到的内容", "模型根据结果回答"];

export function McpLab() {
  const ref = useRef<HTMLElement>(null);
  const [app, setApp] = useState(0);
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [complete, setComplete] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [previous, setPrevious] = useState<string | null>(null);
  const discovered = phase > 2 || (phase === 2 && complete);
  const returned = phase > 5 || (phase === 5 && complete);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const pause = () => { setRunning(false); setAutoplay(false); };
    const visibility = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); }, { threshold: 0.15 });
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => {
      setReduced(motion.matches);
      if (motion.matches) { pause(); setComplete(true); }
    };
    preference();
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", preference); };
  }, []);

  function reset(nextApp = app, clear = false) {
    setApp(nextApp); setPhase(0); setRunning(false); setAutoplay(false); setComplete(true);
    if (clear) setPrevious(null);
    else if (returned) setPrevious(apps[app]);
  }
  function start(next: number, auto: boolean) {
    setPhase(next); setComplete(reduced); setRunning(!reduced); setAutoplay(auto && !reduced);
    if (reduced && next === 5) setPrevious(apps[app]);
  }
  function finish() {
    if (phase === 5) setPrevious(apps[app]);
    if (autoplay && phase < 6) start(phase + 1, true);
    else { setComplete(true); setRunning(false); setAutoplay(false); }
  }
  function play() {
    if (running) { setRunning(false); setAutoplay(false); }
    else if (!complete) { setRunning(true); setAutoplay(true); }
    else start(phase >= 6 ? 1 : phase + 1, true);
  }

  return <figure ref={ref} className={styles.lab} aria-label="MCP 图书馆查询演示" data-phase={phase} data-running={running} data-complete={complete}>
    <div className={styles.labTop}>
      <div className={styles.appTabs} aria-label="选择 AI 应用">{apps.map((name, index) => <button type="button" key={name} aria-pressed={app === index} onClick={() => reset(index)}>{index === 0 ? <ChatCircleText size={18} /> : <PencilLine size={18} />}{name}</button>)}</div>
      <button type="button" className={styles.reset} aria-label="重置整个演示" onClick={() => reset(0, true)}><ArrowCounterClockwise size={17} /><span>重置</span></button>
    </div>
    <div className={styles.question}>青禾图书馆的书能借多久？</div>
    <div className={styles.progress} aria-hidden="true">{phases.slice(1).map((name, index) => <i key={name} data-active={phase > index} />)}</div>
    <div className={styles.controls}>
      <span role="status">{phases[phase]}</span>
      <div>
        <button type="button" className={styles.play} onClick={play}>{running ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}{reduced ? phase === 6 ? "重播" : "下一步" : running ? "暂停" : phase === 6 && complete ? "重播" : phase === 0 ? "播放过程" : "继续播放"}</button>
        {!reduced && <button type="button" aria-label="下一步" disabled={!complete || phase >= 6} onClick={() => start(phase + 1, false)}><ArrowRight size={19} /></button>}
        {phase === 6 ? <button type="button" className={styles.switchApp} onClick={() => reset(1 - app)}>换成{apps[1 - app]}<ArrowRight size={15} /></button> : <button type="button" className={styles.disconnect} disabled={phase === 0} onClick={() => reset()}>断开连接</button>}
      </div>
    </div>
    <div className={styles.stage}>
      <div className={styles.application}>
        <div className={styles.nodeTitle}>{app === 0 ? <ChatCircleText size={23} /> : <PencilLine size={23} />}<h3>{apps[app]}<span>AI 应用</span></h3></div>
        <div className={styles.client}><PlugsConnected size={15} />MCP 客户端<i data-connected={phase > 0} /></div>
        <div className={styles.toolSlot} data-filled={discovered}>
          {discovered ? <ToolCard /> : <span className={styles.slotHint}>等待工具说明</span>}
        </div>
        <div className={styles.resultSlot} data-visible={returned} aria-hidden={!returned}><FileText size={16} /><span>已取得资料<strong>普通图书借期 30 天</strong></span></div>
      </div>
      <div className={styles.route} aria-hidden="true"><span>MCP</span><div /><b>共同的消息格式</b></div>
      <div className={styles.service}>
        <div className={styles.nodeTitle}><BookOpen size={25} weight="light" /><h3>图书馆资料服务<span>MCP 服务端</span></h3></div>
        <div className={styles.sourceTool}><ToolCard /></div>
        <div className={styles.guide} data-searching={phase === 4} data-found={phase > 4 || (phase === 4 && complete)}>
          <div className={styles.bookSpine} /><h4><FileText size={15} />借阅指南</h4>
          <span>凭借书证办理借阅</span><mark>普通图书借期 <b>30 天</b></mark><span>到期前可申请续借</span>
          {phase === 4 && <div key={`${app}-search`} className={styles.scan} onAnimationEnd={finish}><MagnifyingGlass size={22} /></div>}
        </div>
      </div>
      {[1, 2, 3, 5].includes(phase) && <div key={`${app}-${phase}`} className={styles.flight} data-kind={phase} onAnimationEnd={finish}>
        {phase === 1 && <><span className={styles.cardLabel}>发现工具</span><strong>有哪些工具？<ArrowRight size={18} /></strong></>}
        {phase === 2 && <ToolCard />}
        {phase === 3 && <><span className={styles.cardLabel}>调用工具</span><strong><Wrench size={17} />搜索指南</strong><div className={styles.keyword}><span>关键词</span>借书期限</div></>}
        {phase === 5 && <><span className={styles.cardLabel}>查询结果</span><strong>普通图书借期 <b>30 天</b></strong><small>来源：图书馆借阅指南</small></>}
      </div>}
    </div>
    <div className={styles.answerSpace}>
      {phase === 6 ? <div key={`${app}-answer`} className={styles.answer} onAnimationEnd={finish}><span>{apps[app]}的回答</span><p>{app === 0 ? <>根据借阅指南，普通图书可借 <strong>30 天</strong>。</> : <>借书提醒：普通图书借期为 <strong>30 天</strong>，请留意到期日期。</>}</p></div> : <p className={styles.waiting}>{previous ? `上次取得 · ${previous}：普通图书借期 30 天` : "查到资料后，模型才有依据回答。"}</p>}
    </div>

  </figure>;
}
