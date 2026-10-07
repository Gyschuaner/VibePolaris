"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowCounterClockwise, ArrowDownLeft, ArrowRight, ArrowUpRight, Brain, Check, FileText, GitBranch, GitCommit, Key, LockKey, MagnifyingGlass, Pause, Play, Scales, ShieldCheck, Sparkle, Stack, Terminal, Wrench } from "@phosphor-icons/react";
import styles from "./ConceptHero.module.css";

// The three introductions share only playback, not a diagram template.
export function ConceptHero({ slug, label, children }: { slug: string; label?: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [replay, setReplay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const visibleRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => { element.dataset.playing = String(visibleRef.current && !document.hidden && isPlaying); };
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [isPlaying]);

  function advance() {
    const animations = ref.current?.getAnimations({ subtree: true }) ?? [];
    for (const animation of animations) {
      const timing = animation.effect?.getComputedTiming();
      const duration = typeof timing?.duration === "number" ? timing.duration : Number.POSITIVE_INFINITY;
      const current = typeof animation.currentTime === "number" ? animation.currentTime : 0;
      animation.currentTime = Math.min(current + 650, duration);
      animation.pause();
    }
    setIsPlaying(false);
  }

  function restart() {
    setIsPlaying(true);
    setReplay(value => value + 1);
  }

  return <figure ref={ref} className={styles.hero} data-kind={slug} aria-label={label ?? (slug === "tools" ? "请求交给工具，实际结果返回模型" : slug === "context" ? "任务、日志和要求组合成本轮输入" : "读取日志、修正代码与检查结果")}>
    <div key={replay} className={styles.art} aria-hidden="true">
      {children ?? (slug === "tools" ? <div className={styles.dispatch}>
        <div className={styles.sender}><Brain size={30} weight="light" /><span>模型</span></div>
        <div className={styles.receiver}><FileText size={30} weight="light" /><span>文件工具</span></div>
        <div className={styles.request}><ArrowUpRight size={17} /><code>read_file</code><span>server.log</span></div>
        <div className={styles.receipt}><ArrowDownLeft size={17} /><code>SyntaxError</code><span>app.py : 1</span></div>
      </div> : slug === "context" ? <div className={styles.collage}>
        <div className={styles.input}><Brain size={22} weight="light" /><span>本轮输入</span></div>
        <div className={styles.paper}><span>任务</span><strong>修好这个服务</strong></div>
        <div className={styles.paper}><span>日志</span><code>SyntaxError</code></div>
        <div className={styles.paper}><span>要求</span><strong>检查 /health</strong></div>
      </div> : <div className={styles.revisions}>
        <div><Terminal size={20} /><span>读日志</span><code>SyntaxError</code></div>
        <div><Wrench size={20} /><span>补冒号</span><code>500</code></div>
        <div><Check size={20} /><span>改返回值</span><code>200 OK</code></div>
      </div>)}
    </div>
    <div className={styles.controls} role="group" aria-label="概念首图动画控制">
      <button type="button" className={styles.control} onClick={() => setIsPlaying(value => !value)} aria-label={isPlaying ? "暂停概念首图动画" : "继续概念首图动画"}>{isPlaying ? <Pause size={13} /> : <Play size={13} />}</button>
      <button type="button" className={styles.control} onClick={advance} aria-label="推进概念首图动画一段"><ArrowRight size={13} /></button>
      <button type="button" className={styles.control} onClick={restart} aria-label="重播概念首图动画"><ArrowCounterClockwise size={13} /></button>
    </div>
  </figure>;
}

export type MechanismHeroVariant = "sequence" | "layers" | "compare" | "field" | "ledger" | "split" | "shelf" | "boundary" | "lens" | "gate";

type MechanismHeroProps = {
  trigger: string;
  change: string;
  proof: string;
  kind?: "general" | "git" | "mobile";
  variant?: MechanismHeroVariant;
  contextLabel?: string;
  contextTitle?: string;
  gateLabel?: string;
  gateTitle?: string;
};

function MechanismCard({ icon: Icon, label, title, value, className = "" }: { icon: typeof FileText; label: string; title: string; value?: string; className?: string }) {
  return <div className={`${styles.mechanismCard} ${className}`}>
    <Icon size={23} weight="light" />
    <span>{label}</span>
    <strong>{title}</strong>
    {value ? <code>{value}</code> : null}
  </div>;
}

function MechanismBoard({ trigger, change, proof, kind, variant, contextLabel, contextTitle, gateLabel, gateTitle }: Required<Pick<MechanismHeroProps, "trigger" | "change" | "proof">> & Pick<MechanismHeroProps, "kind" | "variant" | "contextLabel" | "contextTitle" | "gateLabel" | "gateTitle">) {
  const actualKind = kind ?? "general";
  const actualVariant = variant ?? "sequence";
  const firstTitle = contextTitle ?? (actualKind === "git" ? "当前分支与远程" : actualKind === "mobile" ? "当前屏幕与任务" : "问题与必要条件");
  const firstLabel = contextLabel ?? "先放回场景";
  const cards = [
    { icon: actualKind === "git" ? GitBranch : FileText, label: firstLabel, title: firstTitle, value: trigger },
    { icon: actualKind === "git" ? GitCommit : Wrench, label: "关键条件", title: "只改变一个变量", value: change },
    { icon: Check, label: "可观察证据", title: "结果留下痕迹", value: proof },
  ] as const;

  if (actualVariant === "sequence" || actualVariant === "gate") {
    return <div className={styles.mechanismHero} data-kind={actualKind} data-variant={actualVariant}>
      <MechanismCard icon={cards[0].icon} label={cards[0].label} title={cards[0].title} value={cards[0].value} />
      <ArrowRight className={styles.mechanismArrow} size={22} aria-hidden="true" />
      <MechanismCard icon={actualVariant === "gate" ? LockKey : cards[1].icon} label={actualVariant === "gate" ? gateLabel ?? "先停在闸门" : cards[1].label} title={actualVariant === "gate" ? gateTitle ?? "授权后才继续" : cards[1].title} value={cards[1].value} className={actualVariant === "gate" ? styles.mechanismGate : ""} />
      <ArrowRight className={styles.mechanismArrow} size={22} aria-hidden="true" />
      <MechanismCard icon={cards[2].icon} label={cards[2].label} title={cards[2].title} value={cards[2].value} className={styles.mechanismResult} />
    </div>;
  }

  if (actualVariant === "layers") return <div className={styles.mechanismLayers} data-variant="layers">
    {cards.map((card, index) => <MechanismCard key={card.label} icon={index === 0 ? Stack : index === 1 ? Key : ShieldCheck} label={card.label} title={card.title} value={card.value} className={styles[`mechanismLayer${index + 1}`]} />)}
  </div>;

  if (actualVariant === "compare") return <div className={styles.mechanismCompare} data-variant="compare">
    <MechanismCard icon={FileText} label="同一问题" title={cards[0].title} value={cards[0].value} />
    <div className={styles.mechanismScale}><Scales size={25} /><span>比较轴</span><code>{change}</code></div>
    <MechanismCard icon={Check} label="另一种读法" title={cards[2].title} value={cards[2].value} className={styles.mechanismResult} />
  </div>;

  if (actualVariant === "field") return <div className={styles.mechanismField} data-variant="field">
    <div className={styles.mechanismFieldQuestion}><MagnifyingGlass size={22} /><span>{firstLabel}</span><strong>{trigger}</strong></div>
    <div className={styles.mechanismFieldMarks}><span /><span /><span /><b>{change}</b></div>
    <div className={styles.mechanismFieldResult}><Sparkle size={22} /><span>读数</span><strong>{proof}</strong></div>
  </div>;

  if (actualVariant === "ledger") return <div className={styles.mechanismLedger} data-variant="ledger">
    <div className={styles.mechanismLedgerHead}><span>条件账本</span><strong>{firstTitle}</strong></div>
    {cards.map((card, index) => <div className={styles.mechanismLedgerRow} key={card.label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{card.label}</strong><code>{card.value}</code><i>{index === 2 ? "可核对" : "已落账"}</i></div>)}
  </div>;

  if (actualVariant === "split") return <div className={styles.mechanismSplit} data-variant="split">
    <MechanismCard icon={FileText} label={firstLabel} title={firstTitle} value={trigger} />
    <div className={styles.mechanismSplitTokens}><span>切开</span><b>{change}</b><i /><b>{proof}</b></div>
  </div>;

  if (actualVariant === "shelf") return <div className={styles.mechanismShelf} data-variant="shelf">
    <div className={styles.mechanismShelfLabel}><Stack size={21} /><span>证据架</span><strong>{firstTitle}</strong></div>
    <div className={styles.mechanismShelfCards}><MechanismCard icon={FileText} label={firstLabel} title="输入" value={trigger} /><MechanismCard icon={MagnifyingGlass} label="筛选" title="关键条件" value={change} /><MechanismCard icon={Check} label="留下" title="证据" value={proof} className={styles.mechanismResult} /></div>
  </div>;

  if (actualVariant === "boundary") return <div className={styles.mechanismBoundary} data-variant="boundary">
    <div className={styles.mechanismBoundaryCard}><ShieldCheck size={21} /><span>边界外</span><strong>{trigger}</strong></div>
    <div className={styles.mechanismBoundaryRing}><div><LockKey size={21} /><strong>{change}</strong></div></div>
    <div className={`${styles.mechanismBoundaryCard} ${styles.mechanismResult}`}><Check size={21} /><span>边界内</span><strong>{proof}</strong></div>
  </div>;

  return <div className={styles.mechanismLens} data-variant="lens">
    <div className={styles.mechanismLensCore}><MagnifyingGlass size={28} /><strong>{change}</strong><span>观察这一处</span></div>
    <div className={styles.mechanismLensOrbit}><span>{trigger}</span><span>{proof}</span></div>
  </div>;
}

export function MechanismHero({ trigger, change, proof, kind = "general", variant = "sequence", contextLabel, contextTitle, gateLabel, gateTitle }: MechanismHeroProps) {
  return <ConceptHero slug="mechanism" label={`${trigger}：${change}；可观察结果：${proof}`}>
    <div className={styles.mechanismWrap}>
      <div className={styles.mechanismQuestion}><span>读者遇到的任务</span><strong>{trigger}</strong></div>
      <MechanismBoard trigger={trigger} change={change} proof={proof} kind={kind} variant={variant} contextLabel={contextLabel} contextTitle={contextTitle} gateLabel={gateLabel} gateTitle={gateTitle} />
    </div>
  </ConceptHero>;
}
