"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ChatCircleText, CheckCircle, FileText, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { checkEvidence, type HallucinationQuestion } from "@/lib/hallucination-demo";
import { hallucinationConceptSources } from "@/lib/hallucination-sources";
import styles from "./HallucinationConceptPage.module.css";

type HeroStage = "empty" | "ghost" | "blocked" | "evidence" | "grounded";
type HeroFrame = { label: string; note: string; stage: HeroStage };

const heroFrames: HeroFrame[] = [
  { label: "问题伸出资料表", note: "问题问利润，但眼前的表只填了收入；空白本身也是证据。", stage: "empty" },
  { label: "顺口的数字飘进来", note: "语言可以很流畅，候选数字却还没有可绑定的字段。", stage: "ghost" },
  { label: "证据闸门关上", note: "找不到支持利润的原文，候选被挡在回答外，系统保留“资料不足”。", stage: "blocked" },
  { label: "补入缺失字段", note: "财报补上一行“利润 48 万”，候选数字终于有了落点。", stage: "evidence" },
  { label: "带着落点回答", note: "回答把数字和证据行绑在一起；引用让别人能回到原文检查。", stage: "grounded" },
];

function EvidenceLedger({ stage }: { stage: HeroStage }) {
  const profitKnown = stage === "evidence" || stage === "grounded";
  return <div className={styles.ledger} aria-label="教学资料：Q3 财报">
    <div className={styles.ledgerHead}><FileText size={16} aria-hidden="true" /><span>Q3 财报</span></div>
    <div className={styles.ledgerRow}><span>收入</span><strong>120 万</strong></div>
    <div className={styles.ledgerRow} data-missing={!profitKnown} data-new={stage === "evidence"}>
      <span>利润</span><strong>{profitKnown ? "48 万" : "空白"}</strong>
    </div>
    <div className={styles.paperLines} aria-hidden="true" />
    <small className={styles.sourceLine}>{profitKnown ? "第 3 行：利润 48 万" : "利润字段未提供"}</small>
  </div>;
}

function ClaimShelf({ stage }: { stage: HeroStage }) {
  const visible = stage !== "empty";
  const rejected = stage === "blocked";
  const locked = stage === "evidence" || stage === "grounded";
  return <div className={styles.claimTicket} aria-hidden={!visible} data-visible={visible} data-rejected={rejected} data-locked={locked}>
    <span>候选答案</span><strong>利润 48 万{locked ? "" : "？"}</strong>
    <span>{locked ? "已对上第 3 行" : "从哪里来的？"}</span>
  </div>;
}

function AnswerDrawer({ stage }: { stage: HeroStage }) {
  const ready = stage === "grounded";
  const waiting = stage === "ghost" || stage === "evidence";
  return <div className={styles.answerDrawer} data-ready={ready}>
    {ready ? <CheckCircle size={17} aria-hidden="true" /> : <WarningCircle size={17} aria-hidden="true" />}
    <strong>{ready ? "利润 48 万 · 第 3 行" : waiting ? "核验中" : "资料不足"}</strong>
  </div>;
}

function HallucinationHero() {
  const scene = useScene(heroFrames.length);
  const frame = heroFrames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} aria-label="证据缺口如何阻断幻觉答案的演示">
    <div className={styles.heroTop}><span>证据验票台</span><strong>{scene.step + 1} / {heroFrames.length}</strong></div>
    <SceneControls scene={scene} labels={heroFrames.map((item) => item.label)} compact />
    <div className={styles.proofDesk} data-stage={frame.stage}>
      <div className={styles.questionTicket}><ChatCircleText size={15} aria-hidden="true" /><strong>利润是多少？</strong></div>
      <EvidenceLedger stage={frame.stage} />
      <ClaimShelf stage={frame.stage} />
      <div className={styles.checkSeal} data-visible={frame.stage === "blocked" || frame.stage === "grounded"} data-success={frame.stage === "grounded"} aria-hidden="true">{frame.stage === "grounded" ? <CheckCircle size={22} /> : <XCircle size={22} />}<span>{frame.stage === "grounded" ? "有依据" : "缺证据"}</span></div>
      <AnswerDrawer stage={frame.stage} />
    </div>
    <figcaption role="status" aria-live="polite">{frame.label}</figcaption>
  </figure>;
}

function HallucinationLab() {
  const [question, setQuestion] = useState<HallucinationQuestion>("profit");
  const [profitKnown, setProfitKnown] = useState(false);
  const check = checkEvidence(question, profitKnown);
  return <div className={styles.lab} role="region" aria-label="本地证据核验实验">
    <div className={styles.labTop}><span>LOCAL CLAIM CHECK / NO MODEL CALL</span><strong>只改变本地资料字段</strong></div>
    <div className={styles.labControls}>
      <div className={styles.controlGroup} role="group" aria-label="选择问题"><button type="button" aria-pressed={question === "profit"} onClick={() => setQuestion("profit")}>问利润</button><button type="button" aria-pressed={question === "margin"} onClick={() => setQuestion("margin")}>问利润率</button></div>
      <div className={styles.controlGroup} role="group" aria-label="编辑资料字段"><button type="button" aria-pressed={profitKnown} onClick={() => setProfitKnown((value) => !value)}>{profitKnown ? "移除利润证据" : "补入利润 48 万"}</button><button type="button" onClick={() => { setQuestion("profit"); setProfitKnown(false); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    </div>
    <div className={styles.labBoard} data-supported={check.supported}>
      <div className={styles.labEvidence}><div className={styles.labCardHead}><FileText size={15} aria-hidden="true" /><span>资料表 · Q3 财报</span></div><div className={styles.labField}><span>收入</span><strong>120 万</strong><small>已提供</small></div><div className={styles.labField} data-missing={!profitKnown}><span>利润</span><strong>{profitKnown ? "48 万" : "缺失"}</strong><small>{profitKnown ? "第 3 行" : "没有字段"}</small></div></div>
      <div className={styles.labClaim} data-rejected={!check.supported}><div className={styles.labCardHead}><ChatCircleText size={15} aria-hidden="true" /><span>候选答案</span></div><strong>{check.candidate}</strong><small>{check.supported ? "已找到支持字段" : `找不到：${check.missing}`}</small>{check.supported ? <CheckCircle size={19} aria-hidden="true" /> : <XCircle size={19} aria-hidden="true" />}</div>
      <div className={styles.labAnswer} data-ready={check.supported}><div className={styles.labCardHead}><ShieldCheck size={15} aria-hidden="true" /><span>输出</span></div><strong>{check.answer}</strong><small>{check.supported ? question === "margin" ? "48 ÷ 120 × 100% · 两数来自资料表" : "Q3 财报第 3 行" : "不把候选数字写成结论"}</small></div>
    </div>
    <div className={styles.labStatus} data-success={check.supported} role="status" aria-live="polite">{check.supported ? <CheckCircle size={16} aria-hidden="true" /> : <WarningCircle size={16} aria-hidden="true" />}<span>{check.supported ? "字段已补齐，回答带着证据落点。" : "候选很像答案，但证据表没有对应字段。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["hallucination-definition", "说得像真的，为什么仍可能是错"], ["hallucination-evidence", "先问证据表有没有这一格"], ["hallucination-boundary", "缺证据、算错和引错不是一回事"], ["hallucination-practice", "怎样让回答留下可检查的落点"]];

export function HallucinationConceptTermPage() {
  return <Article slug="hallucination" title="幻觉" subtitle="Hallucination · 说得像真的，资料里却找不到" sources={hallucinationConceptSources} sections={sections} hero={<HallucinationHero />} intro={<>资料只写“季度收入 120 万”，你问利润，模型却回答“48 万”。这句话读起来很正常，可数字是从哪里来的？<strong>模型生成了错误、无事实依据或与输入冲突的内容，就可能发生了幻觉。它甚至会连解释和引用一起补出来。</strong></>}>
    <ArticleSection id="hallucination-definition" title="说得像真的，为什么仍可能是错">
      <p id="hallucination-definition-claim" className="vp-citation-target">NIST 把这类现象称为 confabulation，并说明它也就是常说的 hallucination 或 fabrication：系统可能自信地生成错误内容，偏离提示或输入，甚至和同一上下文里先前说过的话冲突。<Cite id="hallucination-definition-claim" sources={hallucinationConceptSources} /></p>
      <p id="hallucination-confidence" className="vp-citation-target">它危险的地方不在于句子一定荒谬，反而在于句子很顺、数字很整齐、语气很确定。NIST 还提醒，模型可能连解释步骤和引用一起编出来，让人误以为“有理由”就等于“有证据”。<Cite id="hallucination-confidence" sources={hallucinationConceptSources} /></p>
      <p id="hallucination-survey" className="vp-citation-target">模型生成下一段文字时，会根据已有内容选择可能的接续。这种能力能让它写出通顺的句子，却没有顺带完成“财报里到底有没有这个数字”的核对。研究综述将看似合理却不符合事实的内容归入幻觉，讨论了它的成因、检测和缓解方法。<Cite id="hallucination-survey" sources={hallucinationConceptSources} /></p>
    </ArticleSection>
    <ArticleSection id="hallucination-evidence" title="先问证据表有没有这一格">
      <p id="hallucination-grounding" className="vp-citation-target">收入是卖出东西收到的金额，利润还要扣掉相应成本和费用。只知道收入，不能凭空得出利润。你可以直接把财报交给模型，也可以让系统搜索相关资料；这种让回答依托指定材料的做法叫 grounding（基于证据回答）。Microsoft 的设计指南要求围绕实际问题准备和检索资料，检查数据是否相关、是否过时。<Cite id="hallucination-grounding" sources={hallucinationConceptSources} /></p>
      <HallucinationLab />
      <p id="hallucination-quote" className="vp-citation-target">工作台里的红色候选“利润 48 万？”没有落在资料表上，所以答案停在“资料不足”。Anthropic 建议先抽取与问题相关的原文，再只根据这些原文分析；找不到支持句时，应撤回这条主张。<Cite id="hallucination-quote" sources={hallucinationConceptSources} /></p>
      <p id="hallucination-citation" className="vp-citation-target">补入“利润 48 万”后，答案旁边出现“Q3 财报第 3 行”。这不是给数字加一个装饰链接，而是让引用指向支持该主张的具体文档位置；引用越具体，别人越容易复核它是否真的支持这句话。<Cite id="hallucination-citation" sources={hallucinationConceptSources} /></p>
      <p>再切到“问利润率”。这里按“利润 ÷ 收入”计算：48 ÷ 120 = 40%。财报不用先写好 40%，系统也能得出它，前提是两项输入都在、公式可以复核。移除利润字段后，计算又停住了。证据检查既要找原文，也要检查从原文到答案的计算。</p>
    </ArticleSection>
    <ArticleSection id="hallucination-boundary" title="缺证据、算错和引错不是一回事">
      <p id="hallucination-boundary-claim" className="vp-citation-target">资料没有利润字段时，模型补一个利润数字，属于证据缺口下的无依据生成；资料写了利润 48 万但模型读成 84 万，是读取或计算错误；引用链接存在却指向只写收入的段落，是引用与主张不匹配。三者都需要修，但修法不同。<Cite id="hallucination-boundary-claim" sources={hallucinationConceptSources} /></p>
      <p id="hallucination-retrieval" className="vp-citation-target">检索也不是保险单：Microsoft 的 grounding 设计把查询预期、数据新鲜度、索引、清洗和迭代都列为设计问题；旧文档、重复片段或错误索引会把不合适的材料送进上下文。<Cite id="hallucination-retrieval" sources={hallucinationConceptSources} /></p>
      <ArticleAside title="为什么“每句都带链接”仍不够"><p>链接只能说明“这里有一个地址”。你还要问：地址里的哪一段支持哪一个数字？它是否对应当前版本？回答有没有把来源没有说的因果关系顺手补上？把主张拆成可核对的小句，比堆一串链接更可靠。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="hallucination-practice" title="怎样让回答留下可检查的落点">
      <p id="hallucination-abstain" className="vp-citation-target">当资料缺字段时，允许系统说“我不知道”或“资料不足”，比强迫它补齐句子更安全。Anthropic 的建议还包括明确告诉模型：如果找不到支持信息，就承认不确定。<Cite id="hallucination-abstain" sources={hallucinationConceptSources} /></p>
      <p id="hallucination-verify" className="vp-citation-target">生成之后再逐条核对数字、名称和因果判断：每条主张都找一段原文，找不到就删除、降级为不确定或回到检索。这个“先写、再验”的步骤仍可能漏错，所以关键业务需要额外的规则、测试或人工复核。<Cite id="hallucination-verify" sources={hallucinationConceptSources} /></p>
      <p id="hallucination-limit" className="vp-citation-target">这些做法能降低风险，却不能把模型变成事实数据库。Anthropic 也明确提醒，允许不确定、直接引用和逐条验证都不能消除幻觉；NIST 则建议在高影响场景持续监测其后果。<Cite id="hallucination-limit" sources={hallucinationConceptSources} /></p>
      <p>实际工作里，先把回答拆成“资料明确写了什么”“需要计算什么”“当前缺什么”。明确写出的内容可以引用；需要计算的内容交给可复核的公式或程序；缺失的内容就停在缺口旁边。这样，读者能看见答案为什么成立，也能看见它在哪一步还不能成立。</p>
      <p>沿着 <ConceptTerm slug="grounding">基于证据回答</ConceptTerm> 继续读，你会看到证据如何进入回答；再看 <ConceptTerm slug="citation">引用</ConceptTerm>，可以练习把一句结论对应到具体原文。</p>
    </ArticleSection>
  </Article>;
}
