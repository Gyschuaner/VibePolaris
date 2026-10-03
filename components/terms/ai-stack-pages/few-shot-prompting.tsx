import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { fewShotPromptingSources } from "@/lib/ai-stack-concept-sources/few-shot-prompting";
import { FewShotPromptingLesson } from "../ai-stack-lessons/few-shot-prompting";

const sections: [string, string][] = [["few-shot-definition", "示例到底提供了什么"], ["few-shot-format", "新输入怎样套用示例"], ["few-shot-generalization", "示例少，边界也会少"]];

export function FewShotPromptingTermPage() {
  return <Article slug="few-shot-prompting" title="少样本提示" subtitle="Few-Shot Prompting · 先给几个例子再让模型照着完成" sources={fewShotPromptingSources} sections={sections} hero={<Hero trigger="我没有训练模型，只给两条工单示例，为什么格式会变？" change="示例输入/输出 → 推断任务规律 → 新输入" proof="一致示例给出稳定标签；加入冲突示例后显示不稳定" />} intro={<>少样本提示把几个“输入—期望输出”例子放进提示里，让模型从上下文推断任务的格式或边界。它改变的是本次请求的条件，不会更新模型参数。</>}>
    <ArticleSection id="few-shot-definition" title="示例到底提供了什么"><p>如果任务是给工单归类，示例可以写成“登录失败 → 前端”。模型看到的不是一条可查的数据库记录，而是一个关于标签写法和判断方式的局部样本。</p><p id="few-shot-definition-evidence" className="vp-citation-target">GPT-3 论文把 few-shot 定义为只在上下文中提供少量示例，不为每个任务更新参数；任务表现来自当前上下文和模型已有能力的组合。<Cite id="few-shot-definition-evidence" sources={fewShotPromptingSources} /></p><p id="few-shot-examples" className="vp-citation-target">提示工程指南建议示例格式保持一致，并选择能代表任务边界的案例；示例不是越多越好，噪声也会进入上下文。<Cite id="few-shot-examples" sources={fewShotPromptingSources} /></p><FewShotPromptingLesson /></ArticleSection>
    <ArticleSection id="few-shot-format" title="新输入怎样套用示例"><p id="few-shot-format-evidence" className="vp-citation-target">OpenAI 和 Anthropic 的提示文档都把示例作为说明输出格式、语气和任务步骤的办法；示例中的分隔符、标签名和顺序会影响模型怎样读下一条输入。<Cite id="few-shot-format-evidence" sources={fewShotPromptingSources} /></p><p>演示中一致示例把“支付按钮无响应”归到前端，并使用同样的标签写法。换成冲突示例后，模型面对同一类新工单没有稳定的映射。</p><p>如果例子只覆盖“登录失败”这一类，读者不能据此推断模型已经学会所有故障分类。它只在当前提示里看到了一个局部规则。</p></ArticleSection>
    <ArticleSection id="few-shot-generalization" title="示例少，边界也会少"><p id="few-shot-generalization-evidence" className="vp-citation-target">Min 等人的研究提醒，示例的标签和格式可能与任务语义一样影响结果；少量演示不能替代独立评估。<Cite id="few-shot-generalization-evidence" sources={fewShotPromptingSources} /></p><p>面对新类型输入，先补一个能说明边界的例子，再检查提示长度和输出格式。若需要系统性改变行为，应考虑数据集、微调或规则，而不是不断堆例子。</p><p><strong>读者判断</strong>：删掉一个示例后结果是否改变？如果改变，先定位它提供的是格式、标签还是特例，避免把偶然示例当成普遍规则。</p></ArticleSection>
  </Article>;
}
