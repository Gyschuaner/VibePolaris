"use client";

import { ArrowRight, CheckCircle, FileText, MagicWand, Sparkle, Tag, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { fewShotPromptingConceptSources } from "@/lib/few-shot-prompting-sources";
import styles from "./FewShotPromptingConceptPage.module.css";

const sampleCards = [
  { input: "登录页空白", label: "前端", tone: "green" },
  { input: "付款一直转圈", label: "网络", tone: "blue" },
] as const;

const labels = ["前端", "后端", "网络"] as const;

const frames = [
  { label: "留白校样", phase: "BLANK", samples: false, labelSpace: false, target: true, result: "还没对齐", conflict: false, note: "新工单已经摆上桌，但没有示例告诉它标签该长什么样。" },
  { label: "示例贴上", phase: "PAIRS", samples: true, labelSpace: false, target: true, result: "等待套用", conflict: false, note: "两张输入—输出小票进入这次请求；它们只是上下文里的校样，不会改模型参数。" },
  { label: "标签显影", phase: "SHAPE", samples: true, labelSpace: true, target: true, result: "前端 / 网络 / 后端", conflict: false, note: "示例先显出标签空间和固定格式，模型看到的是一个局部版式。" },
  { label: "新票落位", phase: "MATCH", samples: true, labelSpace: true, target: true, result: "前端", conflict: false, note: "“导出按钮没反应”沿用同一行的标签写法；它是本次请求的推断结果。" },
  { label: "反例打滑", phase: "CONFLICT", samples: true, labelSpace: true, target: true, result: "先修示例", conflict: true, note: "再贴一张相反标签，校样彼此打架；不稳定是示例问题，不是模型已经学会了新规则。" },
] as const;

function SampleCard({ item, visible, conflict = false }: { item: { input: string; label: string; tone: string }; visible: boolean; conflict?: boolean }) {
  return <div className={styles.sampleCard} data-visible={visible} data-conflict={conflict}>
    <span className={styles.samplePin} aria-hidden="true" />
    <span className={styles.sampleInput}>{item.input}</span>
    <span className={`${styles.sampleLabel} ${styles[item.tone]}`}><Tag size={12} weight="fill" aria-hidden="true" />{item.label}</span>
  </div>;
}

function PatternPlate({ frame }: { frame: typeof frames[number] }) {
  return <div className={styles.plate} data-visible={frame.labelSpace} data-conflict={frame.conflict}>
    <div className={styles.plateTop}><span>局部标签盘</span><code>{frame.labelSpace ? "3 labels" : "waiting"}</code></div>
    <div className={styles.labelSlots}>{labels.map((label, index) => <span key={label} data-active={frame.labelSpace && (frame.conflict || index === 0 || index === 2)}>{label}</span>)}</div>
    <div className={styles.formatStrip}><span>输出格式</span><code>{frame.labelSpace ? "一行 · 单标签" : "未显影"}</code></div>
  </div>;
}

function FewShotHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} aria-label="少样本提示如何用示例校准新工单标签的演示">
    <div className={styles.heroTop}><span>PATTERN PRESS / FEW-SHOT</span><strong>{current.phase} · {scene.step + 1}/5</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.pressBoard} data-phase={current.phase}>
      <div className={styles.sampleRail}>
        <div className={styles.railTitle}><FileText size={15} aria-hidden="true" /><span>这次请求里的校样</span><code>{current.samples ? "2 + 1" : "0"}</code></div>
        <SampleCard item={sampleCards[0]} visible={current.samples} />
        <SampleCard item={sampleCards[1]} visible={current.samples} />
        <SampleCard item={{ input: "导出按钮没反应", label: "网络", tone: "red" }} visible={current.conflict} conflict />
        <div className={styles.parameterBadge}><span className={styles.parameterDot} aria-hidden="true" /><span>模型参数</span><strong>unchanged</strong></div>
      </div>
      <div className={styles.pressDesk}>
        <div className={styles.deskHeader}><span>校样台</span><code>{current.samples ? "context only" : "no examples"}</code></div>
        <PatternPlate frame={current} />
        <div className={styles.targetTicket} data-visible={current.target} data-conflict={current.conflict}>
          <span className={styles.ticketEyebrow}>新工单</span>
          <strong>导出按钮没反应</strong>
          <code>{current.result}</code>
        </div>
        <div className={styles.pressStamp} data-visible={current.result === "前端"} data-conflict={current.conflict}>
          {current.conflict ? <WarningCircle size={16} aria-hidden="true" /> : current.result === "前端" ? <CheckCircle size={16} aria-hidden="true" /> : <Sparkle size={16} aria-hidden="true" />}
          <span>{current.result}</span>
        </div>
        <div className={styles.pressMeta}><span>{current.conflict ? "映射冲突" : current.labelSpace ? "模式已显影" : "等待校样"}</span><ArrowRight size={14} aria-hidden="true" /><span>{current.conflict ? "先修示例" : "当前上下文"}</span></div>
      </div>
    </div>
    <div className={styles.heroNote} data-danger={current.conflict} role="status" aria-live="polite">{current.conflict ? <XCircle size={16} aria-hidden="true" /> : <MagicWand size={16} aria-hidden="true" />}<span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>把少样本提示画成一张校样台：示例显出标签、输入分布和格式，新工单只在这次上下文里套用；校样不会偷偷改写模型。</figcaption>
  </figure>;
}

type LabVariant = "clean" | "conflict";
type LabTicket = "export" | "payment";

function FewShotLab() {
  const scene = useScene(3);
  const [variant, setVariant] = useState<LabVariant>("clean");
  const [ticket, setTicket] = useState<LabTicket>("export");
  const conflict = variant === "conflict";
  const currentExamples = conflict ? [...sampleCards, { input: "导出按钮没反应", label: "网络", tone: "red" }] : sampleCards;
  const target = ticket === "export" ? "导出按钮没反应" : "付款一直转圈";
  const output = scene.step < 2 ? "等待校样" : conflict ? "不稳定 · 先修示例" : ticket === "export" ? "前端" : "网络";
  return <div ref={scene.ref} className={styles.lab} role="region" aria-label="少样本提示校样台实验">
    <div className={styles.labTop}><span>LOCAL PROOF DESK / NO MODEL CALL</span><strong>只在本地轮换校样</strong></div>
    <SceneControls scene={scene} labels={["放下新工单", "贴入两个示例", "盖上标签"]} />
    <div className={styles.labControls} role="group" aria-label="改变少样本提示条件"><button type="button" aria-pressed={variant === "clean"} onClick={() => { setVariant("clean"); scene.seek(0); }}>一致校样</button><button type="button" aria-pressed={variant === "conflict"} onClick={() => { setVariant("conflict"); scene.seek(0); }}>加入反例</button><button type="button" aria-pressed={ticket === "export"} onClick={() => { setTicket("export"); scene.seek(0); }}>换成导出工单</button><button type="button" aria-pressed={ticket === "payment"} onClick={() => { setTicket("payment"); scene.seek(0); }}>换成付款工单</button></div>
    <div className={styles.labDesk} data-conflict={conflict}>
      <div className={styles.labSamples}><div className={styles.labHeading}><FileText size={17} aria-hidden="true" /><span>已放入的校样</span><code>{scene.step === 0 ? 0 : currentExamples.length} 张</code></div>{currentExamples.map((item, index) => <div className={styles.labSample} data-visible={scene.step > 0} data-conflict={index === 2 && conflict} key={`${item.input}-${index}`}><span>{item.input}</span><b>{item.label}</b></div>)}</div>
      <div className={styles.labTarget}><span>待套用的新工单</span><strong>{scene.step === 0 ? "把问题放在这里" : target}</strong><code>{scene.step === 2 ? "已输出一个标签" : "等待匹配"}</code></div>
      <div className={styles.labOutput} data-conflict={conflict && scene.step === 2}><span>这次输出</span><strong>{output}</strong><small>{conflict ? "示例互相矛盾" : "没有更新模型参数"}</small></div>
    </div>
    <div className={styles.labStatus} data-danger={conflict && scene.step === 2} role="status" aria-live="polite">{conflict && scene.step === 2 ? <WarningCircle size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span><strong>{conflict && scene.step === 2 ? "校样需要返工" : scene.step === 2 ? "标签已从当前上下文套出" : "还在准备示例"}</strong> · {conflict && scene.step === 2 ? "不要用一张相反小票掩盖边界；先改示例，再重新评估新工单。" : "实验只轮换预先写好的小票，方便观察示例如何提供标签空间和格式。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["fewshot-definition", "示例到底改变了什么"], ["fewshot-pattern", "几张小票怎样显出模式"], ["fewshot-limit", "少量示例的边界"]];

export function FewShotPromptingConceptTermPage() {
  return <Article slug="few-shot-prompting" title="少样本提示" subtitle="Few-Shot Prompting · 用几张校样让任务有形状" sources={fewShotPromptingConceptSources} sections={sections} hero={<FewShotHero />} intro={<>你不必先训练一个新模型，才可以让它学会一次临时任务的写法。<strong>把少量输入—输出示例放进当前请求，模型会在这段上下文里参照它们的标签、输入样子和排版；这份“学会”不会写回模型参数。</strong></>}> 
    <ArticleSection id="fewshot-definition" title="示例到底改变了什么"><p id="fewshot-definition-evidence" className="vp-citation-target">少样本提示（few-shot prompting）是在请求里放几组输入—输出示例，然后把一个新输入接在后面。模型不是先收到一份训练更新，而是在这一次前向计算里读取这些文字，把它们当作任务的临时说明。GPT-3 论文把 zero-shot、one-shot 和 few-shot 都放在测试时的上下文里比较，明确区分了这种做法和微调。<Cite id="fewshot-definition-evidence" sources={fewShotPromptingConceptSources} /></p><p id="fewshot-no-update" className="vp-citation-target">所以，示例用完就走：换一条请求、换一个模型版本或换一套示例，结果都可能变化。页面里的“模型参数 unchanged”不是装饰，它提醒读者：你是在摆一张临时校样，不是在把新规则刻进模型。<Cite id="fewshot-no-update" sources={fewShotPromptingConceptSources} /></p><FewShotLab /></ArticleSection>
    <ArticleSection id="fewshot-pattern" title="几张小票怎样显出模式"><p id="fewshot-pattern-evidence" className="vp-citation-target">示例通常同时提供三样东西：允许使用的标签空间、输入大概长什么样、输出按什么格式出现。Min 等人的研究发现，示例的格式、输入分布和标签空间本身就能带来很大影响；不能把一次正确的配对简单理解成模型已经学会了背后的因果规则。<Cite id="fewshot-pattern-evidence" sources={fewShotPromptingConceptSources} /></p><p id="fewshot-examples" className="vp-citation-target">这也是为什么示例要像一组校样，而不是随手堆几段漂亮答案。OpenAI 和 Google 的提示文档都建议用清楚、一致、能覆盖不同情况的输入—输出对；标签名、分隔符和输出长度保持一致，读者和模型才知道“要照着哪里排”。<Cite id="fewshot-examples" sources={fewShotPromptingConceptSources} /></p><p>拿工单归类来说，“登录页空白 → 前端”和“付款一直转圈 → 网络”让新工单看到两个标签和两种输入形状。它不能证明所有白屏都是前端，也不能保证一张新票一定落在正确类别；它只把本次任务的版式和候选范围摆到了桌面上。</p></ArticleSection>
    <ArticleSection id="fewshot-limit" title="少量示例的边界"><p id="fewshot-limit-evidence" className="vp-citation-target">示例越多不一定越好。它们要占上下文空间，彼此冲突或只覆盖一种情况时，会把错误边界一起带进请求；Google 文档也提醒需要试验示例数量，太多可能让输出过度贴着示例。少样本里的“少”不是一个跨模型通用的数字。<Cite id="fewshot-limit-evidence" sources={fewShotPromptingConceptSources} /></p><p id="fewshot-evaluation" className="vp-citation-target">真正要上线的分类或格式任务，还应拿独立样本做评测，检查删掉某张示例、换一种输入或升级模型后结果是否仍然稳定。Anthropic 把成功标准和经验性测试放在提示工程之前；示例可以引导一次请求，却不能替代评测集、权限规则和事实来源。<Cite id="fewshot-evaluation" sources={fewShotPromptingConceptSources} /></p><p><strong>读者判断</strong>：先看示例是否覆盖了你要处理的输入，再看标签和格式有没有打架，最后用没有出现在示例里的新样本试一遍。若结果只在“见过的句子”上漂亮，就把它当校样效果，不要叫它泛化。</p><ArticleAside title="和零样本提示、微调怎样分工"><p>零样本提示直接写任务说明，不放输入—输出对；少样本提示把几个对放进当前上下文；微调则用数据改变模型参数或适配层。三者都可能改善任务表现，但成本、持久性和验证方式不同。少样本适合先快速试出格式与边界，稳定性要求高时仍需评测，必要时再考虑更持久的方案。</p></ArticleAside></ArticleSection>
  </Article>;
}
