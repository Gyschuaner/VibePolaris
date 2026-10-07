"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, CheckCircle, Code, FileText, Hash, WarningCircle } from "@phosphor-icons/react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { teachingSample, teachingSampleLabel, teachingTexts, type TeachingToken, type TokenizationMode } from "@/lib/tokenization-demo";
import { tokenizationConceptSources } from "@/lib/tokenization-sources";
import styles from "./TokenizationConceptPage.module.css";

type HeroToken = TeachingToken & { merge?: boolean };
type HeroFrame = {
  label: string;
  note: string;
  kind: "raw" | "split" | "merge" | "ids" | "compare";
  tokens?: HeroToken[];
};

const heroFrames: HeroFrame[] = [
  {
    label: "原句落台",
    note: "模型还没有看到“字”或“词”，这里只是一串原始字符。",
    kind: "raw",
  },
  {
    label: "先切出边界",
    note: "编码器先按自己的规则找边界，空格也可能成为一个片段。",
    kind: "split",
    tokens: [
      { text: "CSS", id: 804, kind: "word" },
      { text: " ", id: 220, kind: "space" },
      { text: "很", id: 4281, kind: "subword" },
      { text: "好", id: 1773, kind: "subword" },
      { text: "用", id: 3912, kind: "subword" },
    ],
  },
  {
    label: "合并常见片段",
    note: "像 BPE 这样的方法会把常见的相邻片段合成更大的子词；合并依据来自词表。",
    kind: "merge",
    tokens: [
      { text: "CSS", id: 804, kind: "word", merge: true },
      { text: " ", id: 220, kind: "space" },
      { text: "很好", id: 17732, kind: "subword", merge: true },
      { text: "用", id: 3912, kind: "subword" },
    ],
  },
  {
    label: "贴上编号",
    note: "每个片段查到对应编号后，才成为模型接收的 token 序列；下面的数字只是本站教学示意。",
    kind: "ids",
    tokens: [
      { text: "CSS", id: 804, kind: "word", merge: true },
      { text: " ", id: 220, kind: "space" },
      { text: "很好", id: 17732, kind: "subword", merge: true },
      { text: "用", id: 3912, kind: "subword" },
    ],
  },
  {
    label: "换一把尺",
    note: "换编码器，同一串文字可能得到另一组边界；编号和数量都不能跨编码器硬套。",
    kind: "compare",
  },
];

function tokenText(token: TeachingToken) {
  return token.text === " " ? "␠" : token.text;
}

function TokenChip({ token, showId, index }: { token: HeroToken; showId: boolean; index: number }) {
  return <span className={styles.tokenChip} data-kind={token.kind} data-merge={token.merge === true} style={{ "--token-index": index } as CSSProperties}>
    <b>{tokenText(token)}</b>
    {showId && <code>{token.id}</code>}
  </span>;
}

function RawString() {
  return <div className={styles.rawString} aria-label="CSS 空格 很好用"><span>CSS</span><i>␠</i><span>很好用</span></div>;
}

function TokenTray({ tokens, showId, className = "" }: { tokens: HeroToken[]; showId: boolean; className?: string }) {
  return <div className={`${styles.tokenTray} ${className}`} aria-label={`${tokens.length} 个教学 token`}>
    {tokens.map((token, index) => <TokenChip key={`${token.text}-${index}`} token={token} showId={showId} index={index} />)}
  </div>;
}

function TokenizationHero() {
  const scene = useScene(heroFrames.length);
  const frame = heroFrames[scene.step];
  const bpeTokens = teachingSample("CSS 很好用", "bpe");
  const wordTokens = teachingSample("CSS 很好用", "word");
  return <figure ref={scene.ref} className={styles.hero} aria-label="字符串经过切分、合并和编号的 token 化演示">
    <div className={styles.heroTop}><span>STRING PRESS / TOKEN BENCH</span><strong>{scene.step + 1} / {heroFrames.length}</strong></div>
    <SceneControls scene={scene} labels={heroFrames.map((item) => item.label)} compact />
    <div className={styles.press} data-kind={frame.kind}>
      <div className={styles.pressHead}><span><FileText size={15} aria-hidden="true" />原始字符串</span><code>CSS 很好用</code></div>
      <div className={styles.pressSlot}>
        {frame.kind === "raw" && <RawString />}
        {frame.kind !== "raw" && frame.kind !== "compare" && frame.tokens && <TokenTray tokens={frame.tokens} showId={frame.kind === "ids"} />}
        {frame.kind === "compare" && <div className={styles.compareTrays}>
          <div><span className={styles.trayLabel}>BPE 示意 · {bpeTokens.length} 个</span><TokenTray tokens={bpeTokens} showId={false} /></div>
          <div><span className={styles.trayLabel}>按词示意 · {wordTokens.length} 个</span><TokenTray tokens={wordTokens} showId={false} /></div>
        </div>}
      </div>
      <div className={styles.pressFoot}><span>{frame.kind === "raw" ? "字符带着原来的顺序" : frame.kind === "compare" ? "边界不同，序列也不同" : frame.kind === "ids" ? "片段 → token ID" : "片段正在重新排队"}</span><b>{frame.kind === "ids" ? <><Hash size={13} aria-hidden="true" />示意编号</> : <><Code size={13} aria-hidden="true" />编码器规则</>}</b></div>
    </div>
    <div className={styles.heroNote} role="status" aria-live="polite"><strong>{frame.label}</strong><span>{frame.note}</span></div>
    <figcaption>演示用固定片段展示“文本 → token → 编号”的关系；它不调用模型，也不冒充任何具体模型的真实 tokenizer。</figcaption>
  </figure>;
}

function TokenizationLab() {
  const [text, setText] = useState(teachingTexts[0]);
  const [mode, setMode] = useState<TokenizationMode>("bpe");
  const [showIds, setShowIds] = useState(true);
  const tokens = teachingSample(text, mode);
  return <div className={styles.lab} role="region" aria-label="本地 token 切分实验">
    <div className={styles.labTop}><span>LOCAL TOKEN BENCH / NO MODEL CALL</span><strong>只改变本地示意片段</strong></div>
    <div className={styles.labControls}>
      <div className={styles.controlGroup} role="group" aria-label="选择示例字符串">{teachingTexts.map((value) => <button type="button" key={value} aria-pressed={text === value} onClick={() => setText(value)}>{value}</button>)}</div>
      <div className={styles.controlGroup} role="group" aria-label="选择示意编码器"><button type="button" aria-pressed={mode === "bpe"} onClick={() => setMode("bpe")}>BPE 示意</button><button type="button" aria-pressed={mode === "word"} onClick={() => setMode("word")}>按词示意</button><button type="button" aria-pressed={showIds} onClick={() => setShowIds((value) => !value)}>{showIds ? "隐藏编号" : "显示编号"}</button><button type="button" onClick={() => { setText(teachingTexts[0]); setMode("bpe"); setShowIds(true); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    </div>
    <div className={styles.labBoard} data-mode={mode}>
      <div className={styles.labInput}><FileText size={17} aria-hidden="true" /><span>输入</span><code>{teachingSampleLabel(text)}</code></div>
      <div className={styles.labPress} aria-live="polite"><div className={styles.labPressHead}><span>{mode === "bpe" ? "BPE 示意" : "按词示意"}</span><strong>{tokens.length} 个 token</strong></div><TokenTray tokens={tokens} showId={showIds} className={styles.labTokenTray} /><div className={styles.labStamp}>{showIds ? <><Hash size={15} aria-hidden="true" />编号只对这把编码器有意义</> : <><CheckCircle size={15} aria-hidden="true" />先看边界，再看数字</>}</div></div>
      <div className={styles.labAnswer}><Hash size={18} aria-hidden="true" /><span>模型收到的序列</span><code>[{tokens.map((token) => token.id).join(", ")}]</code></div>
    </div>
    <div className={styles.labStatus} role="status" aria-live="polite"><WarningCircle size={16} aria-hidden="true" /><span>换一个空格、语言或 tokenizer，片段和数量都可能改变；要做预算，请对目标模型实际编码。</span></div>
  </div>;
}

const sections: [string, string][] = [["tokenization-definition", "模型先看到的不是字和词"], ["tokenization-boundary", "边界由哪一把编码器尺决定"], ["tokenization-count", "token 数为什么会影响预算"], ["tokenization-practice", "把示意换成实际检查"]];

export function TokenizationConceptTermPage() {
  return <Article slug="tokenization" title="分词" subtitle="Tokenization · 把字符串压成模型能读的片段" sources={tokenizationConceptSources} sections={sections} hero={<TokenizationHero />} intro={<>你只删掉一句话里的空格，模型收到的编号就可能整组换掉。<strong>分词是把原始字符串按某个 tokenizer 的词表和规则切成 token 片段，再为每个片段贴上编号；它不是“一个字换一个编号”。</strong>下面先看这把尺怎样把同一句话压成不同形状。</>}>
    <ArticleSection id="tokenization-definition" title="模型先看到的不是字和词">
      <p id="tokenization-definition-claim" className="vp-citation-target">人眼看到的是“CSS 很好用”，模型接口通常接收的是一串数字。OpenAI 的 tiktoken 把 BPE tokenizer 描述为把文本变成 token 序列，并提供按模型选择编码器、编码和解码的接口。网页里的 token 可以是一整词，也可以是子词、空格或符号片段。<Cite id="tokenization-definition-claim" sources={tokenizationConceptSources} /></p>
      <p id="tokenization-subword" className="vp-citation-target">所以“token 等于词”会在第一步就把人带偏。Hugging Face 将 BPE、Unigram 和 WordPiece 都归为子词算法：常见词可能保留成一块，少见词会拆成已知的片段；Sennrich 等人的研究正是用子词单元处理罕见词。<Cite id="tokenization-subword" sources={tokenizationConceptSources} /></p>
      <p>本站首图先把字符串放到压板上，再把片段拼成 token，最后才贴编号。压板上的数字只是为了让眼睛能跟住变化；它们不是某个线上模型的词表快照。</p>
    </ArticleSection>
    <ArticleSection id="tokenization-boundary" title="边界由哪一把编码器尺决定">
      <p id="tokenization-bpe-steps" className="vp-citation-target">以 BPE 为例，预分词器会先按空格等规则切出候选，算法从基础字符或字节开始，反复合并更常见的相邻片段，直到得到目标词表。合并规则写进词表，所以同一串字符换一套编码器，边界就可能换位置。<Cite id="tokenization-bpe-steps" sources={tokenizationConceptSources} /></p>
      <TokenizationLab />
      <p id="tokenization-boundary-claim" className="vp-citation-target">试着先选“CSS 很好用”，再删掉空格，或换成“雨天 CSS”。工作台只改了输入字符串或示意编码器，片段的数量和边界便跟着变。Hugging Face 的文档也提醒，子词算法处在“词”和“字符”之间；它们不是一把跨模型通用的尺。<Cite id="tokenization-boundary-claim" sources={tokenizationConceptSources} /></p>
      <p id="tokenization-language" className="vp-citation-target">SentencePiece 这类方法把空格也纳入可学习的边界，并以语言无关的方式处理子词。对中文、英文、代码和 emoji 来说，不能凭字数猜出另一种语言或另一套词表会怎样切。<Cite id="tokenization-language" sources={tokenizationConceptSources} /></p>
    </ArticleSection>
    <ArticleSection id="tokenization-count" title="token 数为什么会影响预算">
      <p id="tokenization-count-claim" className="vp-citation-target">请求长度、上下文窗口和计费通常都要按 token 统计。OpenAI 的 token 计数示例把文本交给对应的 tiktoken 编码器，再读取编码后的数量；它没有把“字符数除以某个常数”当成精确答案。<Cite id="tokenization-count-claim" sources={tokenizationConceptSources} /></p>
      <p id="tokenization-roundtrip" className="vp-citation-target">编码和解码是一对操作：tiktoken 的 BPE 设计强调可以把 token 还原回原始文本，但这依赖同一套编码器和合法的 token 序列。编号本身没有“语义排名”，804 在另一套词表里可能指向完全不同的片段。<Cite id="tokenization-roundtrip" sources={tokenizationConceptSources} /></p>
      <ArticleAside title="为什么不同语言的数量看起来不公平"><p>一段英文可能包含反复出现的常见子词，一段中文则可能按另一种字节或字符边界编码；代码还会把缩进、标点、括号和换行带进来。数量差异先说明编码器看到了不同的片段组合，不能直接推出哪种语言“更贵”或哪种表达“更聪明”。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="tokenization-practice" title="把示意换成实际检查">
      <p>先确认目标模型、接口和版本，再用它对应的 tokenizer 统计系统提示、用户消息、工具结果和预留输出。文本改了一个空格、换了一段 JSON 或加入一张图片，都应重新计数；不要把首图里的 3 个或 5 个 token 当成产品指标。</p>
      <p>如果你要缩短提示，先标出真正改变答案的条件，再比较压缩前后的 token 数和回答质量。删掉格式空白也许省下一点空间，却可能让代码或结构化数据更难读；保留一份可还原的原文，再用目标编码器验证，才知道省下了什么。</p>
      <p>读完这页，你应该能回答：token 是谁的单位？<strong>是具体 tokenizer 的单位。</strong>最可靠的下一步不是猜换算比例，而是对目标模型实际编码，并把模型、编码器和版本一起记下来。<ConceptTerm slug="context-window">上下文窗口</ConceptTerm>只负责装这些 token，不能替你决定它们怎样切。</p>
    </ArticleSection>
  </Article>;
}
