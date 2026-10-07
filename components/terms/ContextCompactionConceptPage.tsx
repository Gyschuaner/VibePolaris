"use client";

import { ArrowCounterClockwise, Check, Circle, FileText, MapPin, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { contextCompactionSources } from "@/lib/context-compaction-sources";
import styles from "./ContextCompactionConceptPage.module.css";

type CompactionPhase = "spacious" | "crowded" | "keep" | "compacted";
const phases: Array<{ label: string; phase: CompactionPhase }> = [
  { label: "工作台 · 还有空间", phase: "spacious" },
  { label: "容量见顶 · 不能硬塞", phase: "crowded" },
  { label: "先钉住继续条件", phase: "keep" },
  { label: "摘要成形 · 原文可回查", phase: "compacted" },
];

function ContextCompactionHero() {
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
  const retained = phase === "keep" || phase === "compacted";
  const hidden = phase === "compacted";
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="上下文接近容量后，把旧对话折成摘要，同时钉住目标、证据和未完成动作">
    <div className={styles.heroTop}><span>WORKING MEMORY / COMPACTION</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.desk}>
      <div className={styles.tray} data-phase={phase}><span>上下文工作台 · {hidden ? "11k / 24k" : phase === "crowded" ? "26k / 24k" : "8k / 24k"}</span><div className={styles.ribbons}><div className={styles.ribbon} data-hidden={hidden}><code>旧对话</code><span>{hidden ? "折成摘要" : "14k tokens"}</span></div><div className={styles.ribbon} data-kept={retained}><code>工具回执</code><span>{hidden ? "保留结果" : "订单 A17"}</span></div><div className={styles.ribbon} data-hidden={hidden}><code>闲聊片段</code><span>{hidden ? "移出窗口" : "可暂放"}</span></div></div><div className={styles.summaryCapsule} aria-hidden={!hidden}><strong>摘要 · 可继续</strong><small>目标 / 证据 / 下一步 / 原文索引</small></div></div>
      <div className={styles.pinned} data-phase={phase}><span>不能丢的继续条件</span><div className={styles.pins}><div className={styles.pin}><MapPin size={13} aria-hidden="true" /><div><strong>目标</strong><small>在周五前完成退款</small></div></div><div className={styles.pin}><FileText size={13} aria-hidden="true" /><div><strong>关键证据</strong><small>订单 A17 · 已付款</small></div></div><div className={styles.pin}><Circle size={13} aria-hidden="true" /><div><strong>未完成动作</strong><small>等待发送退款请求</small></div></div></div></div>
    </div>
    <div className={styles.controls} role="group" aria-label="上下文压缩首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>压缩释放的是窗口空间；目标、证据和下一步必须留下，细节需要能回查原文。</figcaption>
  </figure>;
}

function ContextCompactionLab() {
  const [checked, setChecked] = useState({ goal: false, evidence: false, action: false });
  const [status, setStatus] = useState<"idle" | "ready" | "warning">("idle");
  const allKept = checked.goal && checked.evidence && checked.action;
  function compact() { setStatus(allKept ? "ready" : "warning"); }
  function reset() { setChecked({ goal: false, evidence: false, action: false }); setStatus("idle"); }
  return <div className={styles.lab} aria-label="上下文压缩保留清单实验">
    <div className={styles.labHeader}><span>TRY IT / RETENTION CHECK</span><strong>压缩前先点出必须带到下一轮的内容</strong></div>
    <div className={styles.checklist} role="group" aria-label="必须保留的信息"><label className={styles.check} data-required="true"><input type="checkbox" checked={checked.goal} onChange={(event) => { setChecked((value) => ({ ...value, goal: event.target.checked })); setStatus("idle"); }} /><strong>当前目标</strong><small>周五前完成退款</small></label><label className={styles.check} data-required="true"><input type="checkbox" checked={checked.evidence} onChange={(event) => { setChecked((value) => ({ ...value, evidence: event.target.checked })); setStatus("idle"); }} /><strong>关键证据</strong><small>订单 A17 · 已付款</small></label><label className={styles.check} data-required="true"><input type="checkbox" checked={checked.action} onChange={(event) => { setChecked((value) => ({ ...value, action: event.target.checked })); setStatus("idle"); }} /><strong>未完成动作</strong><small>等待发送退款请求</small></label></div>
    <div className={styles.labActions}><button type="button" onClick={compact}><Check size={13} />生成可继续摘要</button><button type="button" onClick={reset}><ArrowCounterClockwise size={13} />清空</button></div>
    <div className={styles.labStatus} data-warning={status === "warning"} role="status" aria-live="polite"><strong>{status === "ready" ? "摘要可以交给下一轮：目标、证据和动作都还在。" : status === "warning" ? "先停一下：有继续条件没被标记，直接压缩会让下一轮靠猜。" : "还没有生成摘要：勾出三项继续条件，再检查。"}</strong><span>{status === "ready" ? "旧消息可以移出工作窗口，但原文索引和可回查位置要一起保存。" : "演示只改变本地勾选状态，不调用模型，也不删除真实对话。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["context-compaction-window-section", "窗口是工作台，不是档案库"], ["context-compaction-selection-section", "压缩前先钉住继续条件"], ["context-compaction-tools-section", "工具回执也有自己的位置"], ["context-compaction-recovery-section", "摘要有损，所以要能回查"], ["context-compaction-boundary-section", "压缩和长期记忆不是一回事"]];

export function ContextCompactionTermPage() {
  return <Article slug="context-compaction" title="上下文压缩" subtitle="Context Compaction · 把旧材料折成可继续的状态" sources={contextCompactionSources} sections={sections} hero={<ContextCompactionHero />} intro={<>长对话不是把所有旧消息都继续塞进去就行。<strong>上下文压缩把工作窗口里暂时用不到的材料折成更短表示，同时保留会改变下一步的目标、证据和未完成动作。</strong></>}>
    <ArticleSection id="context-compaction-window-section" title="窗口是工作台，不是档案库"><p id="context-window" className="vp-citation-target"><strong>上下文窗口是模型这一轮能参考的工作台，里面不只有用户消息。</strong>Claude 文档把系统提示、消息、工具结果、图片、文档、工具定义和本轮输出都算进窗口；当请求接近上限时，继续硬塞可能直接超限。<Cite id="context-window" sources={contextCompactionSources} />LangChain 也提醒，长历史会让模型被旧内容分散注意力，并带来更慢响应和更高成本。</p><p id="context-overflow" className="vp-citation-target">所以“把最早的一半删掉”不是压缩策略。最早的那句话可能正好是退款截止时间，最新的一条消息也可能只是闲聊；时间顺序不等于重要性。<Cite id="context-overflow" sources={contextCompactionSources} />压缩要先回答任务下一步需要什么，再决定哪些内容可以折叠。</p></ArticleSection>
    <ArticleSection id="context-compaction-selection-section" title="压缩前先钉住继续条件"><p id="context-selection" className="vp-citation-target"><strong>先选高信号状态，再整理旧材料。</strong>Anthropic 把 context engineering 说成在有限 attention budget 里挑出最小的高信号 token 集合；它不是越短越好，而是要足够支持期望的下一步。<Cite id="context-selection" sources={contextCompactionSources} />在一次退款任务里，目标、已核对的订单证据、尚未发送的请求，比十轮重复确认更值得留下。</p><ContextCompactionLab /><p id="context-compaction" className="vp-citation-target">Anthropic 的 compaction 会把早期对话自动总结后继续会话，但这仍然是摘要，不是原文的无损替身。<Cite id="context-compaction" sources={contextCompactionSources} />实验故意要求先勾三项，是为了让“摘要应该留下什么”变成可检查的清单，而不是交给模型凭感觉决定。</p></ArticleSection>
    <ArticleSection id="context-compaction-tools-section" title="工具回执也有自己的位置"><p id="context-tools" className="vp-citation-target">对话历史里，工具调用和工具结果不是普通闲聊。Semantic Kernel 的 `ChatHistory` 把 system、user、assistant、tool 消息按角色保存；模拟工具结果时还必须带回对应函数调用的 id，模型才能把结果接回正确的上下文。<Cite id="context-tools" sources={contextCompactionSources} />压缩工具记录时，至少要留下“调用了什么、得到什么、哪一步还没完成”。</p><p id="context-state" className="vp-citation-target">LangChain 把短期记忆放进 agent state，用 checkpointer 按 thread 持久化，并在每次调用或工具步骤完成后更新。<Cite id="context-state" sources={contextCompactionSources} />这说明窗口里的摘要和外部可恢复状态是两件配合的事：摘要负责当前一轮好读，状态负责下一次还能找回。</p></ArticleSection>
    <ArticleSection id="context-compaction-recovery-section" title="摘要有损，所以要能回查"><p id="context-recovery" className="vp-citation-target">压缩后的内容必须能解释“这条结论从哪来”。Claude 文档建议跨会话设计能快速恢复的 state artifacts；Semantic Kernel 还允许检查完整 chat history 里的函数调用和结果。<Cite id="context-recovery" sources={contextCompactionSources} />因此摘要可以写“订单 A17 已付款”，但旁边要留原始工具回执或消息位置，而不是只留下一个无法验证的结论。</p><p>一旦发现摘要漏了否定条件、时间限制或失败原因，就应该回到原文重建状态，再继续任务。压缩后的窗口是工作副本，不是审计档案。</p></ArticleSection>
    <ArticleSection id="context-compaction-boundary-section" title="压缩和长期记忆不是一回事"><p id="context-boundary" className="vp-citation-target">短期记忆服务单个 thread，长期记忆服务跨会话保存的用户或应用信息；LangChain 明确把两者分开。<Cite id="context-boundary" sources={contextCompactionSources} />上下文压缩只是管理当前窗口的办法，不会自动把所有旧对话变成可靠的长期事实，也不能替代权限、保留期限和删除策略。</p><ArticleAside title="压缩完成后再问三句"><p>目标还在吗？关键证据能回到原文吗？未完成动作的下一步和责任人清楚吗？任何一项答不上来，就先别把摘要当成新的事实来源。</p></ArticleAside></ArticleSection>
  </Article>;
}
