"use client";

import { ArrowCounterClockwise, CheckCircle, Pause, Play, Star, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { optimisticUpdateSources } from "@/lib/optimistic-update-sources";
import styles from "./OptimisticUpdateConceptPage.module.css";

type Outcome = "success" | "failure";
type HeroPhase = "base" | "pending" | Outcome;

const phases: Array<{ label: string; phase: HeroPhase }> = [
  { label: "规范状态", phase: "base" },
  { label: "先给反馈", phase: "pending" },
  { label: "服务器确认", phase: "success" },
  { label: "失败回滚", phase: "failure" },
];

function OptimisticHero() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const reducedMotion = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotion.current = media.matches; if (media.matches) setPlaying(false); };
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
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
    const timer = window.setInterval(() => setPhaseIndex((current) => {
      if (current >= phases.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 1200);
    return () => window.clearInterval(timer);
  }, [documentVisible, inViewport, playing]);

  const phase = phases[phaseIndex].phase;
  const confirmed = phase === "success";
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="乐观更新先展示临时状态，服务器确认后合并或失败后回滚">
    <div className={styles.heroTop}><span>CANONICAL + TEMPORARY LAYER</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.stage}><div className={`${styles.layer} ${styles.base}`}><Star size={22} weight={confirmed ? "fill" : "regular"} aria-hidden="true" /><div><small>规范状态</small><strong>{confirmed ? "★ 已收藏" : "☆ 未收藏"}</strong></div><em>server</em></div><div className={`${styles.layer} ${styles.overlay}`}><Star size={22} weight="fill" aria-hidden="true" /><div><small>临时贴片</small><strong>★ 已收藏</strong></div><em>pending</em></div><span className={styles.stamp}>{phase === "success" ? "合并到事实" : phase === "failure" ? "撤回贴片" : ""}</span></div>
    <div className={styles.controls} role="group" aria-label="乐观更新首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>上层的星星只是暂时意见；它要么和服务器事实合并，要么在失败时被撤回。</figcaption>
  </figure>;
}

function OptimisticLab() {
  const [outcome, setOutcome] = useState<Outcome>("success");
  const [baseLiked, setBaseLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("还没有发起保存；当前规范状态是未收藏。");
  const timer = useRef<number | null>(null);
  const previousBase = useRef(false);

  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  function save() {
    if (pending) return;
    if (timer.current !== null) window.clearTimeout(timer.current);
    previousBase.current = baseLiked;
    setPending(true);
    setStatus("界面先显示已收藏，服务器还没有确认。");
    timer.current = window.setTimeout(() => {
      setPending(false);
      if (outcome === "success") { setBaseLiked(true); setStatus("服务器确认成功；临时状态和规范状态现在相同。"); }
      else { setBaseLiked(previousBase.current); setStatus(`服务器拒绝了保存；临时状态已撤回，规范状态仍是${previousBase.current ? "已收藏" : "未收藏"}。`); }
      timer.current = null;
    }, 520);
  }
  function reset() { if (timer.current !== null) window.clearTimeout(timer.current); timer.current = null; previousBase.current = false; setBaseLiked(false); setPending(false); setStatus("还没有发起保存；当前规范状态是未收藏。"); }
  const shownLiked = pending || baseLiked;
  return <div className={styles.lab} aria-label="乐观更新收藏实验"><div className={styles.labHeader}><span>TRY IT / TEMPORARY STATE</span><strong>收藏按钮的两层事实</strong></div><div className={styles.choice} role="group" aria-label="服务器结果"><button type="button" onClick={() => setOutcome("success")} aria-pressed={outcome === "success"} disabled={pending}><CheckCircle size={13} />服务器成功</button><button type="button" onClick={() => setOutcome("failure")} aria-pressed={outcome === "failure"} disabled={pending}><WarningCircle size={13} />服务器失败</button></div><div className={styles.record}><div className={styles.recordRow} data-pending={pending} data-failed={!pending && outcome === "failure" && status.includes("拒绝")}><span>界面看到</span><strong>{shownLiked ? "★ 已收藏" : "☆ 未收藏"}</strong><em>{pending ? "pending" : "canonical"}</em></div><div className={styles.recordRow}><span>规范状态</span><strong>{baseLiked ? "★ 已收藏" : "☆ 未收藏"}</strong><em>server fact</em></div></div><div className={styles.labStatus} role="status" aria-live="polite"><strong>{status}</strong><span>这里用 520ms 模拟服务器响应，没有写入真实账户。</span></div><div className={styles.labActions}><button className={styles.action} type="button" onClick={save} disabled={pending}>{pending ? "保存中…" : "先显示收藏"}</button><button className={styles.action} type="button" onClick={reset}>清空状态</button></div></div>;
}

const sections: [string, string][] = [["optimistic-definition-section", "先让界面跟上动作"], ["optimistic-rollback-section", "临时状态怎样回到事实"], ["optimistic-layer-section", "为什么要把两层缓存分开"], ["optimistic-boundary-section", "乐观不是猜什么都能成功"]];

export function OptimisticUpdateTermPage() {
  return <Article slug="optimistic-update" title="乐观更新" subtitle="Optimistic Update · 先给反馈，再等事实" sources={optimisticUpdateSources} sections={sections} hero={<OptimisticHero />} intro={<>收藏、点赞或改名时，用户不想盯着按钮等网络往返。<strong>乐观更新先把“预计会成功”的结果放进界面，让动作立刻有反馈；服务器确认后，它才成为规范状态，失败则必须撤回或解释冲突。</strong></>}>
    <ArticleSection id="optimistic-definition-section" title="先让界面跟上动作"><p id="optimistic-definition" className="vp-citation-target"><strong>乐观状态是一个正在进行的动作的临时投影，不是服务器已经确认的事实。</strong>React 的 `useOptimistic` 在 Action 进行时显示临时值，Action 结束后重新使用传入的真实值；因此“星星先亮”与“保存成功”是两个时间点。<Cite id="optimistic-definition" sources={optimisticUpdateSources} />只有把这两个状态分开，界面才不会把猜测说成结果。</p><p id="optimistic-commit" className="vp-citation-target">当服务器返回新的规范值，临时值和真实值在同一次更新里收敛。React 文档把这描述为 Action 完成后的最终提交；Apollo 也会在响应到达后移除临时对象、写入服务器返回的规范对象。<Cite id="optimistic-commit" sources={optimisticUpdateSources} />这不是再播放一次“成功动画”，而是换掉事实来源。</p></ArticleSection>
    <ArticleSection id="optimistic-rollback-section" title="临时状态怎样回到事实"><p id="optimistic-rollback" className="vp-citation-target">失败时，最小的安全动作是回到操作前的快照，或者重新读取服务器状态。TanStack Query 的示例在更新前保存旧数据，失败时用它回滚；Redux Toolkit 的 `patchResult.undo()` 也把这条撤回路径写成显式操作。<Cite id="optimistic-rollback" sources={optimisticUpdateSources} />动画里的贴片因此会撕回原来的星星，而不是停在“看起来已收藏”。</p><OptimisticLab /><p>实验把服务器结果固定成成功或失败，方便只改变一个条件。成功时界面和规范状态一起变成“已收藏”；失败时界面先亮一下，再回到“未收藏”，并留下失败原因。这个反馈不是在模拟真实网络成功率，而是在显示回滚为什么必须可见。</p></ArticleSection>
    <ArticleSection id="optimistic-layer-section" title="为什么要把两层缓存分开"><p id="optimistic-layer" className="vp-citation-target">Apollo Client 会把乐观响应放在独立的临时层里，而不直接覆盖同一个规范缓存对象；服务器响应到达后，临时层被移除，规范对象才更新。<Cite id="optimistic-layer" sources={optimisticUpdateSources} />分层让系统在预测错时还有原值可退，也让同一份数据的多个查询能同时看到临时变化。</p><p id="optimistic-identity" className="vp-citation-target">新增对象还没有服务器 ID 时，Apollo 示例使用临时 ID 让它先进入正确的缓存形状，收到真实 ID 后再换成规范对象。<Cite id="optimistic-identity" sources={optimisticUpdateSources} />临时身份必须能被替换，否则列表会出现重复项或旧贴片残留。</p></ArticleSection>
    <ArticleSection id="optimistic-boundary-section" title="乐观不是猜什么都能成功"><p id="optimistic-concurrency" className="vp-citation-target">多个动作同时进行时，不能假设它们只有一条时间线。TanStack Query 提醒并发 mutation 需要区分各自变量和提交时间；同一条记录被连续修改时，旧响应可能晚于新响应到达。<Cite id="optimistic-concurrency" sources={optimisticUpdateSources} />这时要用版本、请求编号或重新取数决定谁能覆盖谁。</p><p id="optimistic-failure" className="vp-citation-target">乐观更新适合结果可预测、失败可恢复的局部状态。付款、权限、库存这类动作不能只凭按钮变色就向用户承诺成功；服务端拒绝、校验失败和冲突都应保留真实错误，并让用户知道下一步。React 文档也明确说明 Action 抛错时真实值没有改变，界面应回到原状态。<Cite id="optimistic-failure" sources={optimisticUpdateSources} /></p><ArticleAside title="先问一句：失败能不能恢复"><p>如果失败只意味着把一个局部开关拨回去，乐观反馈通常容易解释；如果失败会产生不可逆的外部副作用，就先等确认，或者把“请求已提交”和“业务已完成”分成两种状态。</p></ArticleAside></ArticleSection>
  </Article>;
}
