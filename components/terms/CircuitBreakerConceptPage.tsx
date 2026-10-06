"use client";

import { ArrowCounterClockwise, Pause, Play, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { circuitBreakerSources } from "@/lib/circuit-breaker-sources";
import styles from "./CircuitBreakerConceptPage.module.css";

type BreakerMode = "closed" | "trip" | "open" | "half" | "recovered";
const phases: Array<{ label: string; mode: BreakerMode; failures: number }> = [
  { label: "CLOSED · 正常放行", mode: "closed", failures: 0 },
  { label: "第三次失败 · 即将打开", mode: "trip", failures: 3 },
  { label: "OPEN · 立即短路", mode: "open", failures: 3 },
  { label: "HALF-OPEN · 只试一笔", mode: "half", failures: 3 },
  { label: "CLOSED · 恢复放行", mode: "recovered", failures: 0 },
];

function CircuitBreakerHero() {
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
    }), 1250);
    return () => window.clearInterval(timer);
  }, [documentVisible, inViewport, playing]);
  const phase = phases[phaseIndex];
  return <figure ref={heroRef} className={styles.hero} data-mode={phase.mode} aria-label="熔断器统计失败，在阈值后打开闸门，冷却后用有限探针检查恢复">
    <div className={styles.heroTop}><span>FAILURE WINDOW / 3 OF 3</span><strong>{phase.label}</strong></div>
    <div className={styles.stage}><div className={styles.requestField}><span>调用方</span><div className={styles.requestDots}>{[0, 1, 2, 3].map((item) => <i key={item} data-blocked={phase.mode === "open"} data-probe={phase.mode === "half" && item === 0}>{item + 1}</i>)}</div><small>{phase.mode === "open" ? "后续请求不再触碰依赖" : phase.mode === "half" ? "只允许一笔探测" : phase.mode === "trip" ? "阈值已到 · 下一次将短路" : "请求先经过闸门"}</small></div><div className={styles.gate} data-mode={phase.mode}><div><ShieldCheck size={20} aria-hidden="true" /><strong>{phase.mode === "open" ? "OPEN" : phase.mode === "half" ? "HALF" : phase.mode === "trip" ? "TRIP" : "CLOSED"}</strong><small>{phase.mode === "open" ? "fail fast" : phase.mode === "half" ? "probe" : phase.mode === "trip" ? "next: open" : "allow"}</small></div></div><div className={styles.dependency}><span>下游服务</span><strong>{phase.mode === "open" ? "不稳定" : phase.mode === "trip" ? "阈值已到" : phase.mode === "half" ? "等待探测" : "可用"}</strong><small>{phase.mode === "open" ? "给调用方快速失败" : phase.mode === "trip" ? "下一次调用将被拒绝" : phase.mode === "half" ? "成功才重新放行" : "接收有限流量"}</small><div className={styles.counter}>{[0, 1, 2].map((item) => <i key={item} data-hit={item < phase.failures} />)}</div></div><span className={styles.cooldown}>{phase.mode === "open" ? "冷却计时中 · 不重试" : phase.mode === "half" ? "冷却结束 · 观察探针" : ""}</span></div>
    <div className={styles.controls} role="group" aria-label="熔断器首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.mode} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>闸门的价值不是让故障消失，而是停止把更多请求送进一个正在失败的依赖。</figcaption>
  </figure>;
}

function CircuitBreakerLab() {
  const [mode, setMode] = useState<"closed" | "open" | "half">("closed");
  const [healthy, setHealthy] = useState(false);
  const [failures, setFailures] = useState(0);
  const [events, setEvents] = useState<string[]>([]);
  const [status, setStatus] = useState("先让下游保持故障，连续失败三次会打开闸门。");
  function send() {
    if (mode === "open") { setEvents((current) => [...current.slice(-3), "拒绝 · short-circuit"]); setStatus("闸门已打开：这次调用在本地立即失败，没有触碰下游。"); return; }
    if (mode === "half") {
      if (healthy) { setMode("closed"); setFailures(0); setEvents((current) => [...current.slice(-3), "探针成功 · closed"]); setStatus("探针成功，才重新回到 CLOSED；失败计数清零。"); }
      else { setMode("open"); setEvents((current) => [...current.slice(-3), "探针失败 · open"]); setStatus("探针仍失败，重新 OPEN，继续给下游恢复时间。"); }
      return;
    }
    if (healthy) { setFailures(0); setEvents((current) => [...current.slice(-3), "成功 · 计数归零"]); setStatus("下游可用，成功调用把失败计数归零。"); return; }
    const next = failures + 1;
    setFailures(next); setEvents((current) => [...current.slice(-3), `失败 ${next}/3`]);
    if (next >= 3) { setMode("open"); setStatus("达到 3 次失败：打开闸门，后续调用直接短路。"); }
    else setStatus(`下游仍故障，记录第 ${next} 次失败；还没有打开闸门。`);
  }
  function coolDown() { if (mode === "open") { setMode("half"); setStatus("冷却结束：只允许下一次调用作为探针。"); } }
  function reset() { setMode("closed"); setHealthy(false); setFailures(0); setEvents([]); setStatus("先让下游保持故障，连续失败三次会打开闸门。"); }
  return <div className={styles.lab} aria-label="熔断器状态实验"><div className={styles.labHeader}><span>TRY IT / FAILURE ISOLATION</span><strong>一次只改变一个条件</strong></div><div className={styles.labControls} role="group" aria-label="熔断器实验控制"><button type="button" onClick={() => setHealthy((value) => !value)} aria-pressed={healthy}>{healthy ? "下游已恢复" : "下游仍故障"}</button><button type="button" onClick={send}><WarningCircle size={13} />发送一次调用</button><button type="button" onClick={coolDown} disabled={mode !== "open"}>等待冷却 / 半开</button><button type="button" onClick={reset}><ArrowCounterClockwise size={13} />重置</button></div><div className={styles.labReadout} data-open={mode === "open"} data-half={mode === "half"}><span>当前状态 · 失败计数 {failures}/3</span><strong>{mode === "closed" ? "CLOSED" : mode === "open" ? "OPEN" : "HALF-OPEN"}</strong></div><div className={styles.eventLog} aria-label="熔断器事件记录">{events.length ? events.map((event, index) => <i key={`${event}-${index}`}>{event}</i>) : <i>还没有调用</i>}</div><div className={styles.labStatus} role="status" aria-live="polite"><strong>{status}</strong><span>演示只改变本地状态，不请求真实服务；真实系统还要决定哪些异常算失败。</span></div></div>;
}

const sections: [string, string][] = [["breaker-definition-section", "先挡住正在扩大的故障"], ["breaker-states-section", "三种状态各自允许什么"], ["breaker-window-section", "阈值不是拍脑袋的数字"], ["breaker-boundary-section", "熔断器不等于重试和并发限制"]];

export function CircuitBreakerTermPage() {
  return <Article slug="circuit-breaker" title="熔断器" subtitle="Circuit Breaker · 让故障停在边界内" sources={circuitBreakerSources} sections={sections} hero={<CircuitBreakerHero />} intro={<>远程服务卡住时，最危险的不是一次失败，而是所有调用方都继续等待、重试，把线程、连接和下游一起拖垮。<strong>熔断器在失败达到条件后暂时切断调用，给依赖恢复时间；恢复后只放行少量探针，确认可用才重新打开闸门。</strong></>}>
    <ArticleSection id="breaker-definition-section" title="先挡住正在扩大的故障"><p id="breaker-definition" className="vp-citation-target"><strong>熔断器是包在远程调用外的一层判断：根据近期失败决定这次调用是否值得继续。</strong>Microsoft 把它和重试区分开：重试期待下一次会成功，熔断器则在失败很可能持续时直接停止调用。<Cite id="breaker-definition" sources={circuitBreakerSources} />它保护的是调用方和依赖之间的资源边界，不会修好依赖本身。</p><p>例如库存服务持续超时，调用方若让每个请求都等完整超时时间，等待中的连接和线程会越积越多。打开闸门后，调用方可以快速返回降级结果或明确错误，让故障不继续扩散。</p></ArticleSection>
    <ArticleSection id="breaker-states-section" title="三种状态各自允许什么"><p id="breaker-states" className="vp-citation-target">CLOSED 允许调用并记录失败；达到阈值后进入 OPEN，后续调用立即被拒绝；等待窗口结束进入 HALF-OPEN，只让有限探针通过。Azure 和 Resilience4j 都把探针成功回到 CLOSED、失败回到 OPEN 写成状态转换，而不是一条永远向前的流程。<Cite id="breaker-states" sources={circuitBreakerSources} />下面的状态实验可以把下游恢复这个条件单独拨出来。</p><CircuitBreakerLab /><p id="breaker-half-open" className="vp-citation-target">HALF-OPEN 的“少量”很重要：服务刚恢复时还不一定能承受全部流量，Polly 的 BreakDuration 与最小吞吐配置、Fowler 的试探调用都说明，冷却结束不等于立即恢复满载。<Cite id="breaker-half-open" sources={circuitBreakerSources} />探针是一个有边界的询问，不是把刚才积压的请求全部重放。</p></ArticleSection>
    <ArticleSection id="breaker-window-section" title="阈值不是拍脑袋的数字"><p id="breaker-window" className="vp-citation-target">Resilience4j 用按调用次数或按时间的滑动窗口统计失败率，也要求达到最少调用数后才计算阈值；Polly 把 SamplingDuration、MinimumThroughput 和 FailureRatio 分开配置。<Cite id="breaker-window" sources={circuitBreakerSources} />因此“3 次失败就断”只是这段演示的教学参数，真实阈值要结合错误类型、流量和恢复时间。</p><p>失败计数还要说明哪些异常算失败。权限拒绝、参数校验错误和下游暂时不可用，可能需要不同的处理；把所有错误都塞进一个计数器，既可能过早切断，也可能放过真正的故障。</p></ArticleSection>
    <ArticleSection id="breaker-boundary-section" title="熔断器不等于重试和并发限制"><p id="breaker-boundary" className="vp-citation-target">熔断器可以和重试组合，但重试必须识别“闸门已开”的信号，否则会在边界外继续制造请求。Microsoft 也提醒，熔断器不替代异常处理；应用仍要决定返回缓存、降级结果还是提示用户稍后再试。<Cite id="breaker-boundary" sources={circuitBreakerSources} /></p><p id="breaker-concurrency" className="vp-citation-target">Resilience4j 明确说明滑动窗口记录多少调用，不等于限制同时运行多少调用；需要并发上限时应使用 Bulkhead 等另一种机制。<Cite id="breaker-concurrency" sources={circuitBreakerSources} />熔断器关注“是否继续碰这项依赖”，并发控制关注“同时允许多少工作”。</p><ArticleAside title="把恢复条件写进运维记录"><p>至少记录当前状态、进入 OPEN 的原因、冷却时间、探针结果与降级出口。没有这些证据，看到一次“恢复”只能说明请求成功过，不能说明保护策略适合下一次故障。</p></ArticleAside></ArticleSection>
  </Article>;
}
