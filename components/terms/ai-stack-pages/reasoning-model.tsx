import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { reasoningModelSources } from "@/lib/ai-stack-concept-sources/reasoning-model";
import { ReasoningModelLesson } from "../ai-stack-lessons/reasoning-model";

const sections: [string, string][] = [["reasoning-definition", "它多做了哪一步"], ["reasoning-steps", "检查过程怎样改变答案"], ["reasoning-boundary", "按实际结果验证推理质量"]];

export function ReasoningModelTermPage() {
  return <Article slug="reasoning-model" title="推理模型" subtitle="Reasoning Model · 为复杂任务分配额外检查过程" sources={reasoningModelSources} sections={sections} intro={<>推理模型把一部分生成预算用于拆分条件、比较候选路径或检查中间结果。它改善的是解决复杂任务时的过程安排。</>}>
    <ArticleSection id="reasoning-definition" title="它多做了哪一步"><p>直接回答像是从问题跳到结论；推理模型会先保留一些中间步骤，再决定对外返回什么。这里的推理 token 是用于这些中间检查的一小段文字或符号。中间步骤可以帮助它处理多条件问题，但应用仍要决定哪些过程可见、怎样记录和怎样验证。</p><p id="reasoning-definition-evidence" className="vp-citation-target">OpenAI 将 reasoning models 描述为会使用额外推理 token 来处理复杂任务的模型，并提醒开发者为推理和最终输出共同留出预算。<Cite id="reasoning-definition-evidence" sources={reasoningModelSources} /></p><p id="reasoning-budget" className="vp-citation-target">推理预算是请求资源的一部分；预算过小可能提前结束，预算增加也会带来延迟和成本。<Cite id="reasoning-budget" sources={reasoningModelSources} /></p><ReasoningModelLesson /></ArticleSection>
    <ArticleSection id="reasoning-steps" title="检查过程怎样改变答案"><p id="reasoning-prompt" className="vp-citation-target">Chain-of-thought（思维链）研究展示了把问题拆成中间步骤可以帮助模型处理算术和常识任务，它研究的是提示和任务表现。<Cite id="reasoning-prompt" sources={reasoningModelSources} /></p><p id="reasoning-search" className="vp-citation-target">Tree of Thoughts 保留并评估多个候选思路，通过路径搜索推进推理。<Cite id="reasoning-search" sources={reasoningModelSources} /></p><p id="reasoning-steps-evidence" className="vp-citation-target">演示里“充足预算”完成了退款条件的逐项比较；“紧张预算”停在中间状态。停止时机本身就是结果的一部分。<Cite id="reasoning-steps-evidence" sources={reasoningModelSources} /></p></ArticleSection>
    <ArticleSection id="reasoning-boundary" title="按实际结果验证推理质量"><p id="reasoning-training" className="vp-citation-target">DeepSeek-R1 论文讨论了通过强化学习等方法训练推理能力，这是训练路线的研究结果。<Cite id="reasoning-training" sources={reasoningModelSources} /></p><p id="reasoning-boundary-evidence" className="vp-citation-target">NIST 的生成式 AI 风险画像强调需要评估准确性、可靠性与安全风险。<Cite id="reasoning-boundary-evidence" sources={reasoningModelSources} /></p><p><strong>读者判断</strong>：看到“已推理”时，继续问它用了哪些输入、是否完成预算、结论是否需要外部证据。推理过程是能力组件。</p></ArticleSection>
  </Article>;
}
