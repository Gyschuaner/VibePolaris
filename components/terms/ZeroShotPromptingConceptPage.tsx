"use client";

import { CheckCircle, Compass, FileText, MagicWand, MapPin, SlidersHorizontal, Sparkle, Target, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { zeroShotPromptingConceptSources } from "@/lib/zero-shot-prompting-sources";
import styles from "./ZeroShotPromptingConceptPage.module.css";

const frames = [
  { label: "空白样本盒", phase: "EMPTY", instruction: false, constraint: false, ticket: false, pointer: "none", result: "没有任务说明", note: "零样本先把示例数量归零；空的样本盒不等于空提示。" },
  { label: "任务牌亮起", phase: "TASK", instruction: true, constraint: false, ticket: false, pointer: "none", result: "等待输入", note: "一张自然语言任务牌告诉模型要做什么，但还没有给出任何示例。" },
  { label: "约束转盘", phase: "CONSTRAINT", instruction: true, constraint: true, ticket: false, pointer: "none", result: "前端 / 后端 / 网络", note: "补上允许标签、拒答条件和输出格式，选择的边界才有地方落脚。" },
  { label: "针落一格", phase: "MATCH", instruction: true, constraint: true, ticket: true, pointer: "front", result: "前端", note: "“支付按钮无响应”足够具体时，指针落到前端；这是一轮直接推断，不是示例匹配。" },
  { label: "信息不足", phase: "AMBIGUOUS", instruction: true, constraint: true, ticket: true, pointer: "uncertain", result: "拒绝并补信息", note: "一句“突然不工作了”没有给出可判定线索，零样本应该停下提问。" },
] as const;

function InstructionCard({ frame }: { frame: typeof frames[number] }) {
  return <div className={styles.instructionCard} data-visible={frame.instruction}>
    <div className={styles.cardTop}><FileText size={15} aria-hidden="true" /><span>任务牌</span><code>{frame.instruction ? "1 instruction" : "empty"}</code></div>
    <strong>把故障归到最先失败的组件</strong>
    <div className={styles.cardRule}><span>允许</span><b>前端 · 后端 · 网络</b></div>
    <div className={styles.cardRule}><span>不确定</span><b>先补信息</b></div>
  </div>;
}

function CompassFace({ frame }: { frame: typeof frames[number] }) {
  return <div className={styles.compassWrap} data-pointer={frame.pointer}>
    <div className={styles.compassLabel}><span>直接推断</span><code>examples = 0</code></div>
    <div className={styles.compass} aria-label={frame.pointer === "uncertain" ? "指针无法落位" : frame.pointer === "front" ? "指针指向前端" : "指针等待任务条件"}>
      <span className={`${styles.sector} ${styles.north}`}>前端</span><span className={`${styles.sector} ${styles.east}`}>网络</span><span className={`${styles.sector} ${styles.south}`}>后端</span>
      <span className={styles.compassRing} aria-hidden="true" /><span className={styles.needle} aria-hidden="true" /><span className={styles.compassCenter}><Compass size={18} aria-hidden="true" /></span>
    </div>
    <div className={styles.compassHint}>{frame.pointer === "front" ? "指向一个允许标签" : frame.pointer === "uncertain" ? "无法可靠落位" : frame.constraint ? "约束已装入" : "等任务牌"}</div>
  </div>;
}

function ZeroShotHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} aria-label="零样本提示如何在没有示例时依靠任务说明和约束完成判断的演示">
    <div className={styles.heroTop}><span>EMPTY SAMPLE BOX / ZERO-SHOT</span><strong>{current.phase} · {scene.step + 1}/5</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.compassBoard} data-phase={current.phase}>
      <div className={styles.sampleBox}><div className={styles.boxTop}><span>示例盒</span><code>0</code></div><div className={styles.boxHollow}><span className={styles.hollowMark}>∅</span><span>没有输入—输出示例</span></div><div className={styles.boxFoot}><span className={styles.boxDot} aria-hidden="true" />只靠本次说明</div></div>
      <div className={styles.instructionColumn}><InstructionCard frame={current} />{current.constraint && <div className={styles.constraintStrip}><SlidersHorizontal size={15} aria-hidden="true" /><span>边界：不确定时先补信息</span><code>format = 1 label</code></div>}{current.ticket && <div className={styles.ticket} data-uncertain={current.pointer === "uncertain"}><MapPin size={14} aria-hidden="true" /><span>当前输入</span><strong>{current.pointer === "uncertain" ? "突然不工作了" : "支付按钮无响应"}</strong></div>}</div>
      <div className={styles.compassColumn}><CompassFace frame={current} /><div className={styles.resultCard} data-danger={current.pointer === "uncertain"} data-ready={current.pointer === "front"}><span>输出</span><strong>{current.result}</strong><code>{current.pointer === "uncertain" ? "need more signal" : current.pointer === "front" ? "single label" : "not decided"}</code></div></div>
    </div>
    <div className={styles.heroNote} data-danger={current.pointer === "uncertain"} role="status" aria-live="polite">{current.pointer === "uncertain" ? <XCircle size={16} aria-hidden="true" /> : <MagicWand size={16} aria-hidden="true" />}<span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>零样本像一只没有校样的指南针：示例盒始终是 0，任务牌、约束和输入质量决定指针能不能落在一个可交付的标签上。</figcaption>
  </figure>;
}

type InstructionMode = "clear" | "vague";
type TicketMode = "clear" | "vague";

function ZeroShotLab() {
  const scene = useScene(3);
  const [instructionMode, setInstructionMode] = useState<InstructionMode>("clear");
  const [ticketMode, setTicketMode] = useState<TicketMode>("clear");
  const clear = instructionMode === "clear" && ticketMode === "clear";
  const ready = scene.step === 2;
  const result = !ready ? "等待直接判断" : clear ? "前端" : "需要补充信息";
  return <div ref={scene.ref} className={styles.lab} role="region" aria-label="零样本提示指南针实验">
    <div className={styles.labTop}><span>LOCAL COMPASS / NO MODEL CALL</span><strong>示例数量始终为 0</strong></div>
    <SceneControls scene={scene} labels={["放下任务牌", "放入当前输入", "让指针落位"]} onReplay={() => { setInstructionMode("clear"); setTicketMode("clear"); }} />
    <div className={styles.labControls} role="group" aria-label="改变零样本提示条件"><button type="button" aria-pressed={instructionMode === "clear"} onClick={() => { setInstructionMode("clear"); scene.seek(0); }}>清楚的任务牌</button><button type="button" aria-pressed={instructionMode === "vague"} onClick={() => { setInstructionMode("vague"); scene.seek(0); }}>模糊的任务牌</button><button type="button" aria-pressed={ticketMode === "clear"} onClick={() => { setTicketMode("clear"); scene.seek(0); }}>具体故障</button><button type="button" aria-pressed={ticketMode === "vague"} onClick={() => { setTicketMode("vague"); scene.seek(0); }}>模糊故障</button></div>
    <div className={styles.labBoard} data-danger={ready && !clear}>
      <div className={styles.labCard}><span>任务牌</span><strong>{instructionMode === "clear" ? "按最先失败组件归类" : "帮我看一下"}</strong><code>examples = 0</code></div>
      <div className={styles.labNeedle}><Target size={20} aria-hidden="true" /><span>当前输入</span><strong>{ticketMode === "clear" ? "支付按钮无响应" : "突然不工作了"}</strong></div>
      <div className={styles.labResult}><span>输出</span><strong>{result}</strong><small>{ready && !clear ? "零样本不是猜测许可" : ready ? "直接指令 · 单标签" : "还没有结果"}</small></div>
    </div>
    <div className={styles.labStatus} data-danger={ready && !clear} role="status" aria-live="polite">{ready && !clear ? <WarningCircle size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span><strong>{ready && !clear ? "指针先停下" : ready ? "指针落在允许标签" : "准备直接判断"}</strong> · {ready && !clear ? "任务或输入有一处太模糊时，应该请求更多信息，而不是用零样本替空白补答案。" : "实验只切换本地写好的任务牌和故障句子，没有调用模型，也没有偷偷添加示例。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["zeroshot-definition", "零样本少了什么"], ["zeroshot-instruction", "任务牌怎样承担边界"], ["zeroshot-limit", "一次判断不是通用能力"]];

export function ZeroShotPromptingConceptTermPage() {
  return <Article slug="zero-shot-prompting" title="零样本提示" subtitle="Zero-Shot Prompting · 没有校样，也要把任务说清" sources={zeroShotPromptingConceptSources} sections={sections} hero={<ZeroShotHero />} intro={<>“零样本”只删掉了输入—输出示例，没有删掉目标、约束、输入和输出格式。<strong>模型要靠这张任务牌直接判断；任务说不清或输入证据不足时，正确动作可以是停下提问。</strong></>}> 
    <ArticleSection id="zeroshot-definition" title="零样本少了什么"><p id="zeroshot-definition-evidence" className="vp-citation-target">零样本提示（zero-shot prompting）是在当前请求里不提供任何输入—输出示例，只给自然语言任务说明，让模型直接完成一次推断。GPT-3 论文把它和 one-shot、few-shot 分开：区别在于有没有 demonstration，并不意味着请求里没有任务描述。<Cite id="zeroshot-definition-evidence" sources={zeroShotPromptingConceptSources} /></p><p>因此，“没有示例”和“没有提示”是两件事。你仍然可以写目标、输入字段、允许的标签、拒答条件和输出格式；只是没有拿一张已经做好的小票给模型照着抄。</p><ZeroShotLab /></ArticleSection>
    <ArticleSection id="zeroshot-instruction" title="任务牌怎样承担边界"><p id="zeroshot-instruction-evidence" className="vp-citation-target">没有示例时，任务说明承担更多边界工作：OpenAI 建议把提示写得简单直接、明确目标和约束；Google 的提示指南也把约束、响应格式和零样本与少样本的区别拆开说明。标签集合、拒答条件和“只输出一个标签”这类文字，都是任务定义，不是示例。<Cite id="zeroshot-instruction-evidence" sources={zeroShotPromptingConceptSources} /></p><p id="zeroshot-constraint-evidence" className="vp-citation-target">“把故障分成前端、后端或网络”只给了候选集合；再加上“按最先失败的组件归类，无法判断就补信息”，才让新输入有一个可检查的落点。约束能收窄输出空间，却不能凭空制造缺失的日志、订单或事实。<Cite id="zeroshot-constraint-evidence" sources={zeroShotPromptingConceptSources} /></p><p id="zeroshot-reasoning" className="vp-citation-target">在需要多步判断的场景里，零样本推理研究观察到一句简短的思路提示可能改变表现；这仍然只是提示条件，效果依赖模型和任务，不能把一次答对当成通用证明。<Cite id="zeroshot-reasoning" sources={zeroShotPromptingConceptSources} /></p></ArticleSection>
    <ArticleSection id="zeroshot-limit" title="一次判断不是通用能力"><p id="zeroshot-limit-evidence" className="vp-citation-target">零样本省去了准备示例的成本，也省去了示例能提供的版式和边界线索。GPT-3 论文把 zero-shot 称为方便但更有挑战的设置；后续 instruction tuning 研究也说明，零样本表现取决于模型是否被训练成能读懂指令。<Cite id="zeroshot-limit-evidence" sources={zeroShotPromptingConceptSources} /></p><p>上线前要拿没有写进提示的样本做独立评估，检查语言变化、歧义输入和模型升级后的结果。如果任务需要稳定的格式或细致的边界，可以比较少样本、结构化输出、检索、规则和人工复核，而不是不断把“模型应该懂”写得更响。</p><p><strong>读者判断</strong>：删掉一条约束词后结果是否改变？如果改变，它就是任务定义的一部分；换一句含糊输入后能否说明为什么停下？如果不能，说明还缺少信息或评测。</p><ArticleAside title="和少样本提示怎样分工"><p>零样本适合先用清楚的直接指令验证一个简单任务；少样本再用几张输入—输出校样补足格式、标签空间或边界。两者都在当前上下文里工作，都不能替代独立评测和事实来源；差别是有没有把示例一起放进请求。</p></ArticleAside></ArticleSection>
  </Article>;
}
