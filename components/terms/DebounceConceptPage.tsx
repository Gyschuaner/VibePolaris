"use client";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { debounceSources } from "@/lib/debounce-sources";
import styles from "./DebounceConceptPage.module.css";

const steps = [
  { label: "第一笔事件", value: "你", deadline: "300ms" },
  { label: "窗口被重置", value: "你想", deadline: "420ms" },
  { label: "最后一笔事件", value: "你想搜", deadline: "540ms" },
  { label: "安静窗口结束", value: "你想搜", deadline: "提交" },
];

function DebounceHero() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) setPlaying(false);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => { reducedMotion.current = media.matches; if (media.matches) setPlaying(false); };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion.current || !inViewport || !documentVisible) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= steps.length - 1) { setPlaying(false); return current; }
        return current + 1;
      });
    }, 1050);
    return () => window.clearInterval(timer);
  }, [documentVisible, inViewport, playing]);

  const deadlineLeft = `${18 + Math.min(step, 3) * 23}%`;
  return <figure ref={heroRef} className={styles.hero} aria-label="防抖把连续到达的输入留在安静窗口里，只提交最后一个值">
    <div className={styles.heroTop}><span>QUIET WINDOW / 300 ms</span><strong>{steps[step].deadline}</strong></div>
    <div className={styles.plot}>
      <div className={styles.events}>{steps.slice(0, 3).map((item, index) => <div className={styles.event} data-received={step >= index} data-last={step === index || (step === 3 && index === 2)} key={item.value}><small>{item.label}</small><strong>{item.value}</strong></div>)}</div>
      <div className={styles.track} style={{ "--deadline-left": deadlineLeft } as CSSProperties}><span className={styles.quietWindow} data-ready={step === 3} /><i className={styles.deadline} data-ready={step === 3} aria-hidden="true" /></div>
      <div className={styles.trackLabels}><span>事件到达</span><span>新事件会把截止时间推后</span><span>安静后才执行</span></div>
      <div className={styles.result} data-ready={step === 3}><span>搜索副作用</span><strong>{step === 3 ? `query=${steps[step].value} · 1 次` : "尚未提交"}</strong></div>
    </div>
    <div className={styles.controls} role="group" aria-label="防抖首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{steps.map((item, index) => <button type="button" key={item.label} onClick={() => { setStep(index); setPlaying(false); }} aria-pressed={step === index}>{index + 1}</button>)}<button type="button" onClick={() => { setStep(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>每次输入都会把同一条截止线向后推；只有最后一笔留下来，才会变成一次搜索。</figcaption>
  </figure>;
}

function DebounceLab() {
  const [value, setValue] = useState("");
  const [published, setPublished] = useState("还没有提交");
  const [status, setStatus] = useState("输入后等待 300ms；继续输入会重新计时。");
  const [events, setEvents] = useState(0);
  const timer = useRef<number | null>(null);
  const sampleTimers = useRef<number[]>([]);

  function clearTimers() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    sampleTimers.current.forEach((id) => window.clearTimeout(id));
    sampleTimers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  function applyValue(next: string) {
    setValue(next);
    setEvents((count) => count + 1);
    setPublished("等待安静窗口");
    setStatus(next ? `收到“${next}”，截止时间从现在起再等 300ms。` : "输入已清空，暂时没有要提交的值。");
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (!next) return;
    timer.current = window.setTimeout(() => {
      setPublished(next);
      setStatus(`300ms 内没有新输入，提交最后一个值“${next}”。`);
      timer.current = null;
    }, 300);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    sampleTimers.current.forEach((id) => window.clearTimeout(id));
    sampleTimers.current = [];
    applyValue(event.target.value);
  }

  function reset() {
    clearTimers();
    setValue(""); setPublished("还没有提交"); setStatus("输入后等待 300ms；继续输入会重新计时。"); setEvents(0);
  }

  function playExample() {
    clearTimers();
    ["你", "你想", "你想搜"].forEach((sample, index) => {
      const id = window.setTimeout(() => applyValue(sample), index * 110);
      sampleTimers.current.push(id);
    });
  }

  return <div className={styles.lab} aria-label="防抖输入实验"><div className={styles.labHeader}><span>TRY IT / LOCAL TIMER</span><strong>搜索框的安静窗口</strong></div><input value={value} onChange={handleChange} placeholder="试着连续输入三个字" aria-label="防抖实验输入" /><div className={styles.labMeta}><b>输入事件 {events} 次</b><b>实际提交：{published}</b></div><div className={styles.labStatus} role="status" aria-live="polite"><strong>{status}</strong><span>这里没有发网络请求，只把“什么时候允许触发回调”呈现出来。</span></div><div className={styles.labButtons}><button type="button" onClick={playExample}>播放示例输入</button><button type="button" onClick={reset}>清空</button></div></div>;
}

const sections: [string, string][] = [["debounce-definition-section", "先把连续事件和一次动作分开"], ["debounce-window-section", "截止时间为什么总在后移"], ["debounce-edge-section", "最后一次不是唯一一种选择"], ["debounce-boundary-section", "防抖没有替你处理网络结果"]];

export function DebounceTermPage() {
  return <Article slug="debounce" title="防抖" subtitle="Debounce · 等输入安静下来再动手" sources={debounceSources} sections={sections} hero={<DebounceHero />} intro={<>搜索框里每敲一个字，都可以立刻发请求；但用户还没说完时，那些请求只是在追赶一个不断变化的目标。<strong>防抖把连续到达的事件留在一个安静窗口里，窗口每次被新事件打断就重新计时，最后只把稳定下来的值交给回调。</strong></>}>
    <ArticleSection id="debounce-definition-section" title="先把连续事件和一次动作分开"><p id="debounce-definition" className="vp-citation-target"><strong>防抖不是“慢一点执行”，而是把多次触发压成一次时机判断。</strong>MDN 将一串快速调用看作一个批次：每次调用都会继续等待，直到最后一次调用之后的静默时间结束。<Cite id="debounce-definition" sources={debounceSources} />因此，输入事件可以有三次，搜索副作用却只有一次。</p><p id="debounce-stream" className="vp-citation-target">在响应式流里，RxJS 的 `debounceTime` 也表达同一件事：源流的新值先等待指定时间，等待期间又有值到来，就把原来的等待替换掉。<Cite id="debounce-stream" sources={debounceSources} />它改变的是值何时被发出，并没有替你决定请求失败后怎么办。</p></ArticleSection>
    <ArticleSection id="debounce-window-section" title="截止时间为什么总在后移"><p id="debounce-window" className="vp-citation-target">把“你”“你想”“你想搜”看成三个事件：第一个事件的截止点在 300ms 后，第二个事件到来后，计时从第二个事件重新开始，第三个事件又把截止点推到更后面。Lodash 文档把这个规则写成“距离上一次调用经过等待时间后才执行”，并把最后一次传入的参数交给回调。<Cite id="debounce-window" sources={debounceSources} />动画中的圆点移动的是截止点，不是输入文字本身。</p><DebounceLab /><p>这个实验里的“搜索”只是一个本地回调。你可以快速连续输入，看到事件次数增加，而提交值保持等待；停手约 300ms 后，只有最后的输入被写进“实际提交”。这就是防抖真正省下来的部分：没有为尚未稳定的中间状态触发副作用。</p></ArticleSection>
    <ArticleSection id="debounce-edge-section" title="最后一次不是唯一一种选择"><p id="debounce-leading" className="vp-citation-target">“安静后执行”叫 trailing edge；Lodash 和 Underscore 都允许把动作放到等待窗口的 leading edge，也就是第一笔事件先执行，窗口内的后续事件不再立即执行。<Cite id="debounce-leading" sources={debounceSources} />按钮防连点有时需要 leading，搜索建议通常更适合 trailing，选择取决于用户希望先得到什么反馈。</p><p>一些实现还提供取消或立即刷新待处理调用的能力。取消适合离开页面、清空输入或不再需要这次动作；刷新则是明确告诉实现“现在就交出最后一个值”。这些选项不会把防抖变成节流：节流限制一段时间内最多执行几次，防抖等待的是“之后没有新事件”。</p></ArticleSection>
    <ArticleSection id="debounce-boundary-section" title="防抖没有替你处理网络结果"><p id="debounce-boundary" className="vp-citation-target">防抖只决定回调何时开始，已经发出的请求仍可能超时、失败或乱序返回。Lodash 提供 `cancel` 和 `flush`，Underscore 也明确区分延迟执行与立即触发；这些 API 解决的是待处理回调的生命周期，不是服务端响应的并发控制。<Cite id="debounce-boundary" sources={debounceSources} />如果搜索请求本身会重叠，还要另行取消旧请求、给请求编号，或只接受最新结果。</p><p>等待窗口也不是越长越好。窗口过短，用户还没停手就发出多次请求；窗口过长，用户会觉得输入没有回应。真实产品要按输入频率、查询成本和可接受延迟选择数值，并在失败、清空和组件卸载时清理待处理计时器。</p><ArticleAside title="防抖与节流怎么选"><p>如果问题是“用户停下来后再算一次”，考虑防抖；如果问题是“滚动或拖动很密集，但每隔一段时间必须持续更新”，考虑节流。两者都只是触发策略，不会自动修复请求内容、权限和响应顺序。</p></ArticleAside></ArticleSection>
  </Article>;
}
