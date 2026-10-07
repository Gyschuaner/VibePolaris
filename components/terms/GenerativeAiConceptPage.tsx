"use client";

import { ArrowCounterClockwise, CheckCircle, MagicWand, Sparkle, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { generativeAiConceptSources } from "@/lib/generative-ai-sources";
import styles from "./GenerativeAiConceptPage.module.css";

const candidates = [
  { text: "记得带伞", score: "46%" },
  { text: "留意积水", score: "31%" },
  { text: "穿防水鞋", score: "12%" },
];

const frames = [
  { label: "种子固定", phase: "SEED", prompt: "为雨天写一句提醒", candidates: false, outputs: false, picked: -1, note: "同一条提示先成为这次生成的条件。", danger: false },
  { label: "候选长出来", phase: "CANDIDATES", prompt: "为雨天写一句提醒", candidates: true, outputs: false, picked: -1, note: "模型为下一步形成候选分布，不是从三张网页抄一句。", danger: false },
  { label: "抽到一条路径", phase: "SAMPLE", prompt: "为雨天写一句提醒", candidates: true, outputs: true, picked: 0, note: "一次采样选中候选，选中的片段会接回序列继续生成。", danger: false },
  { label: "三次各自长完", phase: "VARIANTS", prompt: "为雨天写一句提醒", candidates: true, outputs: true, picked: 1, note: "同一任务可以长出不同措辞；变化本身不是事实证据。", danger: false },
  { label: "没有种子就停下", phase: "MISSING", prompt: "", candidates: false, outputs: false, picked: -1, note: "清空条件后，系统应该承认缺少任务，而不是补出一个看似完整的答案。", danger: true },
] as const;

function GenerativeAiHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} aria-label="同一提示如何长出不同句子的生成式 AI 演示">
    <div className={styles.heroTop}><span>SEED GARDEN / TOKEN SAMPLING</span><strong>{current.phase} · {scene.step + 1}/5</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.garden} data-phase={current.phase}>
      <div className={styles.seedCard} data-empty={current.danger === true}><span className={styles.seedDot} aria-hidden="true" /><span className={styles.seedEyebrow}>这次请求的种子</span><strong>{current.prompt || "没有任务条件"}</strong><code>{current.danger ? "prompt = ∅" : "prompt = fixed"}</code></div>
      <div className={styles.outputField}>
        <span className={styles.outputEyebrow}>下一步要接什么？</span>
        {current.danger ? <div className={styles.emptyResult}><WarningCircle size={14} aria-hidden="true" /> 没有条件，不能判断要生成哪种提醒。</div> : <><div className={styles.candidateRow}>{candidates.map((item, index) => <span className={styles.candidate} data-visible={current.candidates} data-picked={current.picked === index} key={item.text}>{item.text} · {item.score}</span>)}<small className={styles.candidateRemainder} data-visible={current.candidates}>其他 11% · 未展开</small></div><div className={styles.sentenceStack}>{["记得带伞，路上慢一点。", "留意积水，给鞋子留点余地。", "今天下雨，出门前看一眼天气。"].map((text, index) => <div className={styles.sentence} data-visible={current.outputs} data-picked={current.picked === index} key={text}><Sparkle size={13} aria-hidden="true" /><span>路径 {String.fromCharCode(65 + index)}</span><strong>{text}</strong><code>{current.outputs ? "done" : "waiting"}</code></div>)}</div></>}
      </div>
    </div>
    <div className={styles.heroNote} data-danger={current.danger === true} role="status" aria-live="polite">{current.danger ? <XCircle size={16} aria-hidden="true" /> : <MagicWand size={16} aria-hidden="true" />}<span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>生成式 AI 像从一粒提示种子继续长句子：候选、采样和完成结果可见，但它们不会自动变成事实证明。</figcaption>
  </figure>;
}

type LabMode = "prompt" | "empty";
function GenerativeAiLab() {
  const [mode, setMode] = useState<LabMode>("prompt");
  const [run, setRun] = useState(0);
  const empty = mode === "empty";
  const output = ["记得带伞，路上慢一点。", "留意积水，给鞋子留点余地。", "今天下雨，出门前看一眼天气。"][run % 3];
  return <div className={styles.lab} aria-label="生成式 AI 本地采样实验">
    <div className={styles.labTop}><span>LOCAL SAMPLER / NO MODEL CALL</span><strong>只模拟可观察状态</strong></div>
    <div className={styles.labButtons} role="group" aria-label="选择提示条件"><button type="button" aria-pressed={mode === "prompt"} onClick={() => setMode("prompt")}>保留提示种子</button><button type="button" aria-pressed={mode === "empty"} onClick={() => setMode("empty")}>清空提示</button><button type="button" onClick={() => { setMode("prompt"); setRun((value) => value + 1); }}><Sparkle size={13} aria-hidden="true" />再抽一条</button></div>
    <div className={styles.labBoard}><div className={styles.labPrompt}><span>输入条件</span><strong>{empty ? "没有任务" : "为雨天写一句提醒"}</strong><code>{empty ? "prompt = ∅" : `sample = ${run + 1}`}</code></div><div className={styles.labReceipt} data-danger={empty}><span>{empty ? "结果" : "这次抽到的路径"}</span><strong>{empty ? "无法保证与任务相关" : output}</strong><code>{empty ? "no condition · stop" : "new text · needs fact check"}</code></div></div>
    <div className={styles.labMeta}><b>候选 3 类</b><b>已生成 {empty ? 0 : 1} 条</b><b>{empty ? "缺少条件" : "不是检索证据"}</b></div>
    <div className={styles.labStatus} data-danger={empty} role="status" aria-live="polite">{empty ? <WarningCircle size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span><strong>{empty ? "先补任务条件" : "这次输出只是一个候选"}</strong> · {empty ? "没有提示就没有可复算的生成目标；不要用完整句子掩盖缺少材料。" : "再抽一次会换一条措辞，但不会因此获得日期、金额或政策事实。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["generative-definition", "先分清生成和查找"], ["generative-process", "一粒提示怎样长成一句话"], ["generative-risk", "新内容不等于新事实"]];

export function GenerativeAiConceptTermPage() {
  return <Article slug="generative-ai" title="生成式 AI" subtitle="Generative AI · 从提示种子长出新内容" sources={generativeAiConceptSources} sections={sections} hero={<GenerativeAiHero />} intro={<>你给模型一句要求，它没有从一个固定答案柜里取出整句话，而是沿着输入条件逐步选择后续片段。<strong>生成式 AI 的关键变化发生在“候选如何出现、哪一个被采样、结果怎样被核验”这三个位置。</strong></>}>
    <ArticleSection id="generative-definition" title="先分清生成和查找"><p id="gen-definition" className="vp-citation-target"><strong>生成式 AI 产生一份新的合成内容。</strong>NIST 将它描述为能够生成文本、图像、音频或其他内容的模型类别；“新”指这次输出是依据输入与模型参数组织出来的结果，不代表内容自动真实，也不等于它没有参考训练材料中的模式。<Cite id="gen-definition" sources={generativeAiConceptSources} /></p><p id="gen-prompt" className="vp-citation-target">一次生成至少有三个条件：任务提示、使用的模型和生成设置。提示决定要解决什么，模型决定它能用什么能力表达，采样设置影响候选如何被选；少写一个条件，读者就很难解释为什么两次结果不同。<Cite id="gen-prompt" sources={generativeAiConceptSources} /></p><p>查找是从指定资料或索引里取回已有内容；生成可以和查找组合，但它们交付的东西不同。先取回一段订单政策，再让模型改写成给用户看的提醒，前半段提供材料，后半段负责组织语言。</p></ArticleSection>
    <ArticleSection id="generative-process" title="一粒提示怎样长成一句话"><p id="gen-output" className="vp-citation-target">文本生成通常为下一个 token 形成一组候选，再选出一个接回序列，继续预测下一步，直到达到停止条件。OpenAI 与 Google 的文本生成文档都把提示、模型和生成配置作为请求的一部分；“一句话”是许多小步连接出来的结果。<Cite id="gen-output" sources={generativeAiConceptSources} /></p><p id="gen-sequence" className="vp-citation-target">Transformer 论文解释了注意力如何让序列中不同位置交换信息；这说明模型如何利用前文条件继续处理序列，却没有为输出加上一层现实世界核验。动画里飞出的句子是可观察的结果，不是模型私有思维过程的展示。<Cite id="gen-sequence" sources={generativeAiConceptSources} /></p><GenerativeAiLab /><p>点击“再抽一条”只是在本地轮换三个预先写好的候选，方便观察“同一提示、不同措辞”。它没有调用模型，也不会模拟真实概率；教学要让输入、候选和结果各自有名字。</p></ArticleSection>
    <ArticleSection id="generative-risk" title="新内容不等于新事实"><p id="gen-generalization" className="vp-citation-target">GPT-3 论文展示了模型可以仅凭文字说明和示例，在没有为每个任务单独更新参数的情况下完成多种任务。这说明提示能改变任务表现，不代表模型拥有实时资料或知道这次问题的真实答案。<Cite id="gen-generalization" sources={generativeAiConceptSources} /></p><p id="gen-risk" className="vp-citation-target">遇到日期、金额、政策、医疗或个人信息时，应另外安排检索原文、工具调用或人工确认。NIST 将不可靠输出、隐私和安全风险放在生成式系统的治理范围内；一句顺滑的话不能替代证据。<Cite id="gen-risk" sources={generativeAiConceptSources} /></p><p><strong>读者判断</strong>：把提示、材料和生成结果分成三张卡。如果结果卡上找不到它依据的原文，先把它当作候选草稿，再决定是否需要核验。</p><ArticleAside title="和温度、检索怎样分工"><p>温度等采样设置影响候选被选中的分布；检索负责把已有材料带回来；生成负责把条件和材料组织成输出。改变温度不会补齐缺少的事实，加入检索也不会自动保证模型正确引用。</p></ArticleAside></ArticleSection>
  </Article>;
}
