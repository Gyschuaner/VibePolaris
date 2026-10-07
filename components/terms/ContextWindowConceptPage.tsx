"use client";

import { useState } from "react";
import { Archive, ArrowCounterClockwise, ArrowRight, ChatCircleText, CheckCircle, Clock, FileText, MapPin, Stack, WarningCircle, Wrench, XCircle } from "@phosphor-icons/react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { contextWindowConceptSources } from "@/lib/context-window-sources";
import styles from "./ContextWindowConceptPage.module.css";

type CardId = "deadline" | "address" | "weather" | "tools" | "summary";
type ContextFrame = {
  label: string;
  phase: string;
  used: string;
  fill: number;
  visible: CardId[];
  kept: CardId[];
  overflow?: boolean;
  note: string;
};

const cards: Record<CardId, { label: string; detail: string; size: string; Icon: typeof Clock }> = {
  deadline: { label: "返程约束", detail: "周日 17:00 前到家", size: "2k", Icon: Clock },
  address: { label: "民宿地址", detail: "出发点与落脚点", size: "1k", Icon: MapPin },
  weather: { label: "旧天气闲聊", detail: "可以压缩的历史", size: "10k", Icon: ChatCircleText },
  tools: { label: "工具结果", detail: "刚查到的路况", size: "4k", Icon: Wrench },
  summary: { label: "摘要折页", detail: "返程 · 地址 · 未完成动作", size: "2k", Icon: Archive },
};

const frames: ContextFrame[] = [
  { label: "先锁住返程", phase: "LOCK", used: "2 / 16k", fill: 12.5, visible: ["deadline"], kept: ["deadline"], note: "会改变行程的时间先留下；它和回答预留共用这一只窗口。" },
  { label: "聊天进箱", phase: "PACK", used: "13 / 16k", fill: 81.25, visible: ["deadline", "address", "weather"], kept: ["deadline", "address"], note: "旧天气闲聊也进来了，窗口还没满，但重要约束开始被长段历史包围。" },
  { label: "窗口被顶开", phase: "OVER", used: "17 / 16k", fill: 100, visible: ["deadline", "address", "weather", "tools"], kept: [], overflow: true, note: "再塞入工具结果就超出 1k；直接截短可能把最早的返程约束一起切掉。" },
  { label: "折成摘要", phase: "FOLD", used: "14 / 16k", fill: 87.5, visible: ["deadline", "address", "summary"], kept: ["deadline", "address", "summary"], note: "把天气闲聊折成摘要，只留下会改变下一步的事实，窗口重新有了余地。" },
  { label: "重点回到可见处", phase: "PIN", used: "14 / 16k", fill: 87.5, visible: ["deadline", "summary", "address"], kept: ["deadline", "summary", "address"], note: "窗口变大不代表每个位置一样好找；关键约束要放在本轮真正会用到的位置。" },
];

function WindowMeter({ frame }: { frame: ContextFrame }) {
  return <div className={styles.meter} aria-label={`已使用 ${frame.used} token`}><div className={styles.meterRail}><i style={{ width: `${frame.fill}%` }} data-overflow={frame.overflow === true} /></div><code>{frame.used}</code></div>;
}

function ContextCards({ frame }: { frame: ContextFrame }) {
  return <div className={styles.cardStack} aria-label="本轮上下文内容">{frame.visible.map((id) => { const card = cards[id]; const Icon = card.Icon; return <div className={styles.memoryCard} data-kept={frame.kept.includes(id)} data-overflow={frame.overflow === true && id === "tools"} key={id}><Icon size={16} aria-hidden="true" /><div><strong>{card.label}</strong><span>{card.detail}</span></div><code>{card.size}</code></div>; })}</div>;
}

function ContextWindowHero() {
  const scene = useScene(frames.length);
  const frame = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} aria-label="上下文窗口如何装入、超出并整理历史的演示">
    <div className={styles.heroTop}><span>CONTEXT PACKING / WORKING MEMORY</span><strong>{frame.phase} · {scene.step + 1}/5</strong></div>
    <SceneControls scene={scene} labels={frames.map((item) => item.label)} />
    <div className={styles.suitcase} data-overflow={frame.overflow === true} data-phase={frame.phase}>
      <div className={styles.suitcaseLid}><span><Stack size={14} aria-hidden="true" /> 一次请求的窗口</span><strong>{frame.used}</strong></div>
      <WindowMeter frame={frame} />
      <ContextCards frame={frame} />
      <div className={styles.suitcaseFoot}><span>{frame.phase === "OVER" ? "输入 + 输出 + 工具结果" : "本轮可见内容"}</span>{frame.overflow ? <b className={styles.overflowTag}><WarningCircle size={13} aria-hidden="true" />超出 1k</b> : <b><CheckCircle size={13} aria-hidden="true" />仍在窗口内</b>}</div>
      {frame.overflow && <div className={styles.overflowStamp}><XCircle size={16} aria-hidden="true" /><span>17k / 16k</span></div>}
    </div>
    <div className={styles.heroNote} data-danger={frame.overflow === true} role="status" aria-live="polite"><span><strong>{frame.label}</strong> · {frame.note}</span></div>
    <figcaption>把上下文想成一只随身旅行箱：能装下，不等于每件东西都容易找到；超出时要整理，而不是假装它还在里面。</figcaption>
  </figure>;
}

type LabStage = "base" | "overflow" | "compacted";
type Focus = "start" | "middle" | "end";

function ContextWindowLab() {
  const [stage, setStage] = useState<LabStage>("base");
  const [focus, setFocus] = useState<Focus>("start");
  const overflow = stage === "overflow";
  const compacted = stage === "compacted";
  const used = overflow ? "17 / 16k" : compacted ? "14 / 16k" : "13 / 16k";
  const retrieval = focus === "middle" ? "中间位置：先找一遍" : focus === "start" ? "开头位置：更容易定位" : "结尾位置：更容易定位";
  const order: CardId[] = focus === "start"
    ? ["deadline", "weather", ...(overflow ? ["tools" as CardId] : [])]
    : focus === "middle"
      ? ["weather", "deadline", ...(overflow ? ["tools" as CardId] : [])]
      : ["weather", ...(overflow ? ["tools" as CardId] : []), "deadline"];
  return <div className={styles.lab} role="region" aria-label="上下文窗口整理实验">
    <div className={styles.labTop}><span>LOCAL CONTEXT PACKER / NO MODEL CALL</span><strong>只改变本地卡片状态</strong></div>
    <div className={styles.labButtons} role="group" aria-label="整理上下文"><button type="button" aria-pressed={stage === "base"} onClick={() => setStage("base")}>装入聊天</button><button type="button" aria-pressed={stage === "overflow"} onClick={() => setStage("overflow")}>塞入工具结果</button><button type="button" aria-pressed={stage === "compacted"} onClick={() => setStage("compacted")}>折成摘要</button><button type="button" onClick={() => { setStage("base"); setFocus("start"); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    <div className={styles.labBoard} data-overflow={overflow} data-compacted={compacted}>
      <div className={styles.labWindow}><div className={styles.labWindowHead}><span>本轮上下文</span><strong>{used}</strong></div><div className={styles.labRail}><i style={{ width: `${overflow ? 100 : compacted ? 87.5 : 81.25}%` }} data-overflow={overflow} /></div><div className={styles.labCards}>{order.map((id) => { const card = cards[id]; const Icon = card.Icon; const isSummary = id === "weather" && compacted; return <div className={styles.labCard} data-kept={id === "deadline"} data-danger={id === "tools"} key={id}><Icon size={15} aria-hidden="true" /><span>{isSummary ? "天气摘要" : card.label}</span><code>{id === "deadline" ? "必须保留" : isSummary ? "2k" : id === "tools" ? "+4k" : card.size}</code></div>; })}</div></div>
      <div className={styles.labReadout}><span>同一条返程约束放在哪里？</span><div className={styles.focusButtons} role="group" aria-label="改变重要信息位置">{(["start", "middle", "end"] as Focus[]).map((value) => <button type="button" key={value} aria-pressed={focus === value} onClick={() => setFocus(value)}>{value === "start" ? "开头" : value === "middle" ? "中间" : "结尾"}</button>)}</div><strong>{retrieval}</strong><small>{overflow ? "先处理超出，再谈取回；窗口没有凭空增加。" : compacted ? "摘要保留了会改变答案的事实，但它已经不是原始聊天。" : "把必须回答的问题放到本轮真的能看到的位置。"}</small></div>
    </div>
    <div className={styles.labStatus} data-danger={overflow} role="status" aria-live="polite">{overflow ? <WarningCircle size={16} aria-hidden="true" /> : compacted ? <Archive size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span><strong>{overflow ? "先别继续塞" : compacted ? "整理后重新计算" : "窗口还没满"}</strong> · {overflow ? "压缩、裁剪或改用检索；不要把超限内容当成本轮输入。" : compacted ? "摘要是新的上下文版本，需要重新核对它是否保住关键约束。" : "容量和可用性是两件事，继续留意重要信息的位置。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["context-definition", "窗口到底装的是什么"], ["context-packing", "超出之后怎样整理"], ["context-retrieval", "装进去就一定找得到吗"], ["context-boundary", "窗口边界不是记忆边界"]];

export function ContextWindowConceptTermPage() {
  return <Article slug="context-window" title="上下文窗口" subtitle="Context Window · 一次请求能带进多少工作记忆" sources={contextWindowConceptSources} sections={sections} hero={<ContextWindowHero />} intro={<>你把整段聊天贴给模型，窗口里确实多了内容，但它仍可能漏掉那句“周日五点前到家”。<strong>上下文窗口限制的是一次请求能带进多少 token；装得下、找得到、记得久，是三件不同的事。</strong></>}>
    <ArticleSection id="context-definition" title="窗口到底装的是什么">
      <p id="context-window-limit" className="vp-citation-target">上下文窗口是一次请求可使用的 token 总量上限，输入、输出，以及某些模型的推理 token 都算在里面。OpenAI 也提醒，内容太大可能让输出被截断；它不是模型训练语料的大小，更不是跨会话的永久记忆。<Cite id="context-window-limit" sources={contextWindowConceptSources} /></p>
      <p id="context-window-token-count" className="vp-citation-target">模型不是按“字数”直接计费或分配空间。Google 的 Gemini 文档把文字、图片、音频等输入都纳入 token 计数，并提供发送前的计数方法；不同模型的输入、输出上限要看具体模型资料。<Cite id="context-window-token-count" sources={contextWindowConceptSources} /></p>
      <p id="context-window-components" className="vp-citation-target">窗口里还会放进系统提示、历史消息、工具结果、图片和文档。Claude 的文档把输出和思考 token 也算进去，所以一份“刚查到的长日志”会和回答预留争同一块空间。<Cite id="context-window-components" sources={contextWindowConceptSources} /></p>
    </ArticleSection>
    <ArticleSection id="context-packing" title="超出之后怎样整理">
      <p id="context-window-history" className="vp-citation-target">对话状态可以由应用自己保存，也可以交给服务端的 conversation/session 机制。OpenAI Agents SDK 列出手动历史、session、conversation id 和 previous response id 等策略，并提醒混用客户端历史与服务端状态可能把同一段上下文重复塞进去。<Cite id="context-window-history" sources={contextWindowConceptSources} /></p>
      <ContextWindowLab />
      <p id="context-window-engineering" className="vp-citation-target">长任务的做法不是把所有材料永久留在提示里，而是让上下文保持“够用且紧”。Anthropic 建议按需检索、渐进披露，并在接近上限时做高保真摘要或压缩；摘要后的窗口已经是一个新版本，仍要复查关键约束有没有留下。<Cite id="context-window-engineering" sources={contextWindowConceptSources} /></p>
      <p>如果只是要查一条地址，可以留一个可定位的记录，再在需要时取回原文；如果要做本轮路线判断，就把会改变答案的时间、地点和未完成动作放回窗口。把所有旧聊天搬进来，既占空间，也会把问题埋起来。</p>
    </ArticleSection>
    <ArticleSection id="context-retrieval" title="装进去就一定找得到吗">
      <p id="context-window-attention" className="vp-citation-target">Transformer 用注意力让序列中不同位置交换信息，这解释了模型为什么能参考前面的内容；它不等于每个位置都会得到同样的关注。这里的工作台只展示可见输入，不把隐藏的注意力权重画成“模型已经理解”。<Cite id="context-window-attention" sources={contextWindowConceptSources} /></p>
      <p id="context-window-middle" className="vp-citation-target">“Lost in the Middle” 的实验把同一条答案材料挪到开头、中间和结尾，发现中间位置的取回表现常常下降。它不是所有模型、所有任务的固定定律，但足以提醒你：窗口变大，不代表把关键条件丢在中间就安全。<Cite id="context-window-middle" sources={contextWindowConceptSources} /></p>
      <p>因此，整理上下文时要给重要信息一个稳定的位置：可以放在任务附近、摘要的开头或回答前的明确区块，再用一个小问题检查它是否仍能被取回。这个检查比“我已经把全文贴上了”更接近实际可用性。</p>
    </ArticleSection>
    <ArticleSection id="context-boundary" title="窗口边界不是记忆边界">
      <p id="context-window-rot" className="vp-citation-target">更大的窗口可以承载更长的提示，却不会自动让模型更可靠。Anthropic 把 token 变多后的准确度和召回下降称为 context rot；OpenAI 也把超出上限后的截断列为需要管理的风险。<Cite id="context-window-rot" sources={contextWindowConceptSources} /><Cite id="context-window-overflow" sources={contextWindowConceptSources} /></p>
      <p>遇到窗口不足，先问三个问题：这轮必须保留什么？哪些内容可以从原文或工具重新取回？摘要后谁来复核？答案可以是裁剪、压缩、检索、拆成多轮，或换一个支持更大窗口的模型；它们都是上下文管理，不是把模型变成长期记忆。</p>
      <ArticleAside title="给读者的一张小清单"><p>把任务、会改变答案的约束、需要引用的证据和回答预留分开列出来。窗口快满时，先保住前两项，再决定哪些历史只留下索引。摘要完成后重新读一遍关键事实；如果找不到它，就不要把整理结果当成完整上下文。</p></ArticleAside>
    </ArticleSection>
  </Article>;
}
