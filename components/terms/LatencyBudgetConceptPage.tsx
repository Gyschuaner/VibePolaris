"use client";

import { ArrowCounterClockwise, CheckCircle, Gauge, Pause, Play, Timer, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { latencyBudgetSources } from "@/lib/latency-budget-sources";
import styles from "./LatencyBudgetConceptPage.module.css";

type BudgetPhase = "planned" | "measured" | "overflow" | "tradeoff";
type Segment = { label: string; ms: number; kind: "network" | "queue" | "model" | "render" };

const phases: Array<{ label: string; phase: BudgetPhase }> = [
  { label: "先写下 800ms 总账", phase: "planned" },
  { label: "分段测到 570ms", phase: "measured" },
  { label: "模型变慢 · 超出 50ms", phase: "overflow" },
  { label: "决定优化还是改体验", phase: "tradeoff" },
];

const normalSegments: Segment[] = [
  { label: "DNS", ms: 80, kind: "network" },
  { label: "TLS", ms: 120, kind: "network" },
  { label: "排队", ms: 90, kind: "queue" },
  { label: "模型", ms: 280, kind: "model" },
];

function LatencyBudgetHero() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const reducedMotion = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotion.current = media.matches; if (media.matches) setPlaying(false); };
    updateMotion(); media.addEventListener("change", updateMotion); return () => media.removeEventListener("change", updateMotion);
  }, []);
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility(); document.addEventListener("visibilitychange", updateVisibility); return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);
  useEffect(() => {
    if (!playing || reducedMotion.current || !inViewport || !documentVisible) return;
    const timer = window.setInterval(() => setPhaseIndex((current) => {
      if (current >= phases.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 1350);
    return () => window.clearInterval(timer);
  }, [documentVisible, inViewport, playing]);

  const phase = phases[phaseIndex].phase;
  const segments = phase === "overflow" || phase === "tradeoff" ? normalSegments.map((segment) => segment.kind === "model" ? { ...segment, ms: 560 } : segment) : normalSegments;
  const total = segments.reduce((sum, segment) => sum + segment.ms, 0);
  const over = total > 800;
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="延迟预算把请求各段时间放进固定的 800 毫秒总账，模型变慢后出现超支并需要做取舍">
    <div className={styles.heroTop}><span>END-TO-END LEDGER / P95 TARGET</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.ledger}>
      <div className={styles.ledgerHead}><div><Timer size={15} aria-hidden="true" /><span>一次完整结果</span></div><strong>目标 <b>800ms</b></strong></div>
      <div className={styles.meterWrap}><div className={styles.budgetMark}><span>800ms</span></div><div className={styles.meter} data-over={over} aria-label={`当前总计 ${total} 毫秒`}>
        {segments.map((segment) => <div key={segment.label} className={styles.segment} data-kind={segment.kind} style={{ "--segment-size": `${(segment.ms / 800) * 100}%` } as CSSProperties}><strong>{segment.label}</strong><small>{segment.ms}ms</small></div>)}
      </div><div className={styles.slack} data-over={over}>{over ? `+${total - 800}ms 超支` : `${800 - total}ms 可用余量`}</div></div>
      <div className={styles.ledgerReadout} data-over={over}><span>当前总计</span><strong>{total}ms</strong><em>{over ? "OVER BUDGET" : "WITHIN BUDGET"}</em></div>
    </div>
    <div className={styles.choiceSlip} data-visible={phase === "tradeoff"}><Gauge size={14} aria-hidden="true" /><span>{phase === "tradeoff" ? "两种取舍：缩短模型，或先交付首字；完整结果的总账仍要如实记录。" : "总账先固定，慢在哪里再有名字。"}</span></div>
    <div className={styles.controls} role="group" aria-label="延迟预算首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>预算是一张共同的时间账：它把“慢”变成可以定位、比较和取舍的超支。</figcaption>
  </figure>;
}

type ModelMode = "fast" | "slow";
type ExperienceMode = "complete" | "first-token";
type Verdict = "idle" | "within" | "over" | "perception";

function LatencyBudgetLab() {
  const [modelMode, setModelMode] = useState<ModelMode>("slow");
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("complete");
  const [verdict, setVerdict] = useState<Verdict>("idle");
  const modelMs = modelMode === "fast" ? 280 : 560;
  const total = 80 + 120 + 90 + modelMs;
  function settle() { setVerdict(total <= 800 ? "within" : experienceMode === "first-token" ? "perception" : "over"); }
  function chooseModel(next: ModelMode) { setModelMode(next); setVerdict("idle"); }
  function chooseExperience(next: ExperienceMode) { setExperienceMode(next); setVerdict("idle"); }
  function reset() { setModelMode("slow"); setExperienceMode("complete"); setVerdict("idle"); }
  return <div className={styles.lab} aria-label="延迟预算结算实验">
    <div className={styles.labHeader}><span>TRY IT / TIME LEDGER</span><strong>只改变一个慢段，再看用户目标是否还成立</strong></div>
    <div className={styles.labChoices}><div className={styles.choiceGroup} role="group" aria-label="选择模型耗时"><span>模型阶段</span><button type="button" onClick={() => chooseModel("fast")} aria-pressed={modelMode === "fast"}>280ms · 快</button><button type="button" onClick={() => chooseModel("slow")} aria-pressed={modelMode === "slow"}>560ms · 慢</button></div><div className={styles.choiceGroup} role="group" aria-label="选择用户目标"><span>交付目标</span><button type="button" onClick={() => chooseExperience("complete")} aria-pressed={experienceMode === "complete"}>完整结果</button><button type="button" onClick={() => chooseExperience("first-token")} aria-pressed={experienceMode === "first-token"}>先给首字</button></div></div>
    <div className={styles.labLedger}><div className={styles.labRow}><span>固定段</span><code>DNS 80 + TLS 120 + 排队 90</code><strong>290ms</strong></div><div className={styles.labRow} data-slow={modelMode === "slow"}><span>模型</span><code>{modelMode === "slow" ? "560ms · slow" : "280ms · fast"}</code><strong>{modelMs}ms</strong></div><div className={styles.labTotal} data-over={total > 800}><span>{experienceMode === "complete" ? "完整结果总计" : "完整结果仍需"}</span><strong>{total}ms / 800ms</strong><em>{total > 800 ? `+${total - 800}ms` : `${800 - total}ms 余量`}</em></div></div>
    <div className={styles.labActions}><button type="button" onClick={settle}><Timer size={13} />结算这次请求</button><button type="button" onClick={reset}><ArrowCounterClockwise size={13} />重置</button></div>
    <div className={styles.labStatus} data-error={verdict === "over"} data-warning={verdict === "perception"} data-success={verdict === "within"} role="status" aria-live="polite"><strong>{verdict === "within" ? <><CheckCircle size={14} aria-hidden="true" />PASS · 570ms 在完整结果预算内。</> : verdict === "over" ? <><WarningCircle size={14} aria-hidden="true" />OVER · 850ms 超出 800ms，不能只把等待藏进动画。</> : verdict === "perception" ? <><Gauge size={14} aria-hidden="true" />改了感知目标 · 首字可先到，但完整结果仍是 850ms。</> : "还没有结算：选择模型和交付目标，再把时间账算一遍。"}</strong><span>{verdict === "idle" ? "固定段合计 290ms；这里只模拟本地数字，不请求模型。" : "预算结论只对这组采样目标成立，还要用真实分布和尾延迟验证。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["latency-budget-definition-section", "先给完整结果一个共同目标"], ["latency-budget-breakdown-section", "把总账拆成能测的段"], ["latency-budget-tail-section", "平均值遮住了慢用户"], ["latency-budget-retry-section", "重试会把超时写成更多账"], ["latency-budget-tradeoff-section", "超预算时要选择牺牲什么"]];

export function LatencyBudgetTermPage() {
  return <Article slug="latency-budget" title="延迟预算" subtitle="Latency Budget · 给一次请求记一张时间账" sources={latencyBudgetSources} sections={sections} hero={<LatencyBudgetHero />} intro={<>用户说“页面好慢”时，团队很容易只盯着某个接口的平均耗时。<strong>延迟预算先给用户要等到的完整结果设一个总目标，再把时间分给每个阶段；哪一段超支、要优化什么、是否改交付方式，都必须在同一张账上说清楚。</strong>就算最后选择“先给首字”，完整结果的时间也不能被藏起来。</> }>
    <ArticleSection id="latency-budget-definition-section" title="先给完整结果一个共同目标"><p id="latency-budget-definition" className="vp-citation-target"><strong>延迟预算是一条端到端的目标，不是某个服务“尽量快”的口号。</strong>Google SRE 把用户请求看成会经过多个资源边界的整体；过载时，排队和等待会让本来还能工作的系统继续变慢。<Cite id="latency-budget-definition" sources={latencyBudgetSources} />Google Cloud 的性能优化建议也要求从业务目标和用户体验出发选择可观察的性能指标。<Cite id="latency-budget-definition" sources={latencyBudgetSources} /></p><p>比如“点击发送后 800ms 内看到完整答案”是一个可以共同讨论的目标。它不替团队决定用什么模型，也不保证每次都精确停在 800ms；它先把产品承诺和工程测量放到同一张纸上。</p></ArticleSection>
    <ArticleSection id="latency-budget-breakdown-section" title="把总账拆成能测的段"><p id="latency-budget-breakdown" className="vp-citation-target"><strong>总数只有在能追到来源时才有用。</strong>DNS、TLS、排队、模型计算和渲染各自占掉一段时间；OpenTelemetry 的 HTTP 语义约定把客户端和服务端请求时长、状态等测量字段标准化，让一次请求可以被分段观察。<Cite id="latency-budget-breakdown" sources={latencyBudgetSources} />首图里的 290ms 固定段和 280ms 模型段是教学账本，真实项目还要按自己的边界定义开始和结束。</p><LatencyBudgetLab /><p>实验先把固定段锁住，只拨动模型从 280ms 变成 560ms。总账从 570ms 变成 850ms，超出的 50ms 有了名字：它来自模型段，而不是“网络很慢”这句笼统判断。</p></ArticleSection>
    <ArticleSection id="latency-budget-tail-section" title="平均值遮住了慢用户"><p id="latency-budget-tail" className="vp-citation-target"><strong>一次 570ms 的成功请求，不能证明所有人都能在 570ms 内拿到答案。</strong>SRE 的过载资料说明，排队和资源争用会让尾部请求受到更大影响；OpenTelemetry 的直方图与时长测量可以把不同请求的分布保留下来。<Cite id="latency-budget-tail" sources={latencyBudgetSources} />所以预算应该写清采样范围、百分位或其他分布指标，不能只报一个平均值。</p><p>如果 p50 很漂亮而 p95 已经越过目标，用户仍会遇到“偶尔卡住”。预算的作用正是让这部分慢请求进入讨论：是队列在涨、重试在叠加，还是模型在某类输入上变长。</p></ArticleSection>
    <ArticleSection id="latency-budget-retry-section" title="重试会把超时写成更多账"><p id="latency-budget-retry" className="vp-citation-target"><strong>超时之后再试一次，不会把第一次花掉的时间擦掉。</strong>AWS Builders’ Library 说明，分层设置超时和重试会把一次用户请求放大成多次下游工作；没有退避和抖动，许多调用方还可能在同一时刻一起重试，进一步增加负载。<Cite id="latency-budget-retry" sources={latencyBudgetSources} />因此预算要记录重试次数、每层等待和它对尾延迟的影响。</p><p>这也是为什么“把超时调大”不等于系统变快：它可能只是让更多连接继续占着资源。更可靠的取舍是先说明哪些错误值得重试、最多几次、重试后给用户什么反馈，再把这些时间写回总账。</p></ArticleSection>
    <ArticleSection id="latency-budget-tradeoff-section" title="超预算时要选择牺牲什么"><p id="latency-budget-tradeoff" className="vp-citation-target"><strong>超预算不是一个需要遮住的红色数字，而是一份产品和工程都要签字的取舍。</strong>可以缩短模型、并行没有依赖关系的阶段、减少不必要的工作，或者先交付可用的首字再等待完整答案；Google Cloud 的性能优化框架把这类目标、测量和优化循环放在一起。<Cite id="latency-budget-tradeoff" sources={latencyBudgetSources} />但“先给首字”改变的是用户感知目标，不会让完整结果从 850ms 变成 800ms。</p><ArticleAside title="发布前把四个数字写下来"><p>完整结果目标是多少？固定段和可变段分别占多少？要保护的是平均请求还是某个尾部百分位？超预算时保留哪种体验、牺牲哪项成本或质量？数字和取舍都写出来，下一次慢才有证据可对照。</p></ArticleAside><p id="latency-budget-boundary" className="vp-citation-target">预算也不是 SLA 的替身，更不是加载动画的时长。AWS 的超时与重试建议、Google Cloud 的性能目标都提醒，系统还要结合错误处理、容量、依赖状态和用户场景设计保护边界。<Cite id="latency-budget-boundary" sources={latencyBudgetSources} /></p></ArticleSection>
  </Article>;
}
