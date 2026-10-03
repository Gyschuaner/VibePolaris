import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { zeroShotPromptingSources } from "@/lib/ai-stack-concept-sources/zero-shot-prompting";
import { ZeroShotPromptingLesson } from "../ai-stack-lessons/zero-shot-prompting";

const sections: [string, string][] = [["zero-shot-definition", "零样本少了什么"], ["zero-shot-instruction", "没有示例，任务说明仍要具体"], ["zero-shot-limit", "一次判断不是通用能力"]];

export function ZeroShotPromptingTermPage() {
  return <Article slug="zero-shot-prompting" title="零样本提示" subtitle="Zero-Shot Prompting · 不给示例，直接说明任务" sources={zeroShotPromptingSources} sections={sections} hero={<Hero trigger="没有给分类例子，模型凭什么能先做一次判断？" change="任务说明 → 直接推断 → 约束决定边界" proof="补上分类约束后结果更可复核，但仍没有示例" />} intro={<>零样本提示不提供任务示例，只用自然语言说明要做什么、输出什么格式以及哪些条件必须满足。它省掉了示例，不等于省掉了任务定义。</>}>
    <ArticleSection id="zero-shot-definition" title="零样本少了什么"><p>“零样本”描述的是当前提示里没有给输入—输出示例。模型仍然可能在预训练中见过类似任务，也仍然需要读取你的任务说明。空提示和零样本是两回事。</p><p id="zero-shot-definition-evidence" className="vp-citation-target">GPT-3 论文将 zero-shot 与 few-shot 区分为是否在上下文提供示例；zero-shot 仍依靠自然语言任务描述和模型已有能力。<Cite id="zero-shot-definition-evidence" sources={zeroShotPromptingSources} /></p><p id="zero-shot-instruction-evidence" className="vp-citation-target">提示工程文档建议明确任务、上下文、约束和输出格式；没有示例时，这些文字承担了更多的边界说明责任。<Cite id="zero-shot-instruction-evidence" sources={zeroShotPromptingSources} /></p><ZeroShotPromptingLesson /></ArticleSection>
    <ArticleSection id="zero-shot-instruction" title="没有示例，任务说明仍要具体"><p id="zero-shot-format" className="vp-citation-target">给出“前端、后端或网络”三个标签，只能说明候选集合；再加上“按最先失败的组件归类”，才让新输入有一个可检查的选择规则。<Cite id="zero-shot-format" sources={zeroShotPromptingSources} /></p><p id="zero-shot-reasoning" className="vp-citation-target">Zero-shot reasoning 研究显示，一句简短的推理提示可能改变复杂任务的表现；它仍然是提示条件，不是每个任务都有效的保证。<Cite id="zero-shot-reasoning" sources={zeroShotPromptingSources} /></p><p>演示补充的是约束词，不是示例。读者可以看到结果变得更容易复核，却没有看到任何“正确分类”的参照答案。</p></ArticleSection>
    <ArticleSection id="zero-shot-limit" title="一次判断不是通用能力"><p id="zero-shot-limit-evidence" className="vp-citation-target">零样本能力依赖模型、任务、语言和提示质量；研究论文的结果不能直接当成你当前模型、数据和接口的上线保证。<Cite id="zero-shot-limit-evidence" sources={zeroShotPromptingSources} /></p><p>当分类后果很大时，用标注集做独立评估，再考虑少样本、检索、规则或人工复核。不能因为某个新例子答对，就推断模型已经掌握全部边界。</p><p><strong>读者判断</strong>：删掉一个约束词后结果是否改变？如果改变，说明约束是任务定义的一部分，不能把它藏在“模型自己会懂”里。</p></ArticleSection>
  </Article>;
}
