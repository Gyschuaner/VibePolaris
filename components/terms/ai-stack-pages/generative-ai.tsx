import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { generativeAiSources } from "@/lib/ai-stack-concept-sources/generative-ai";
import { GenerativeAiLesson } from "../ai-stack-lessons/generative-ai";

const sections: [string, string][] = [["generative-definition", "先分清生成和查找"], ["generative-process", "一次输出怎样出现"], ["generative-risk", "有新内容，不等于有新事实"]];

export function GenerativeAiTermPage() {
  return <Article slug="generative-ai" title="生成式 AI" subtitle="Generative AI · 根据条件产生新内容" sources={generativeAiSources} sections={sections} hero={<Hero trigger="我给 AI 一句话，它为什么能写出没见过的句子？" change="条件 → 候选分布 → 逐步生成" proof="改变提示或随机起点，输出会变化；空输入时也没有任务保证" />} intro={<>生成式 AI 的工作结果是新内容：文字、图片、音频或代码。它会根据输入条件逐步选择后续内容，读者看到的是一次生成结果，不是从数据库复制的一条固定记录。</>}>
    <ArticleSection id="generative-definition" title="先分清生成和查找"><p>查找系统从已有资料中返回一条记录；生成式模型则把输入转换成一串可以继续生成的候选。模型可能学过相似的表达，但当前这句话通常是在本次请求里重新组合出来的。</p><p id="generative-definition-evidence" className="vp-citation-target">NIST 把生成式 AI 描述为能够生成合成内容的模型类别，并提醒输出的来源、可靠性和风险需要单独评估。<Cite id="generative-definition-evidence" sources={generativeAiSources} /></p><p id="generative-prompt" className="vp-citation-target">文本生成接口把提示、模型和生成参数作为一次请求的条件；提示越明确，结果越容易围绕任务组织。<Cite id="generative-prompt" sources={generativeAiSources} /></p><GenerativeAiLesson /></ArticleSection>
    <ArticleSection id="generative-process" title="一次输出怎样出现"><p id="generative-output" className="vp-citation-target">文本模型通常先为下一个 token 形成候选分布，再选出一个 token，把它接回输入，继续下一步。这个过程重复到停止条件满足，所以改动一个词可能影响后面的整段输出。<Cite id="generative-output" sources={generativeAiSources} /></p><p id="generative-sequence" className="vp-citation-target">Transformer 论文描述了用注意力处理序列中不同位置关系的架构；它解释了模型怎样处理序列条件，但不等于模型会自动验证现实世界的事实。<Cite id="generative-sequence" sources={generativeAiSources} /></p><p>演示里两个采样都完成了“写一句提醒”，但措辞不同。这个差异证明的是生成路径发生了变化，不是其中任何一句更真实。</p></ArticleSection>
    <ArticleSection id="generative-risk" title="有新内容，不等于有新事实"><p id="generative-generalization" className="vp-citation-target">GPT-3 论文展示了模型在没有为每个任务单独更新参数时，也能通过文字说明和示例完成多种任务；这说明提示可以改变任务表现，不代表模型拥有实时资料。<Cite id="generative-generalization" sources={generativeAiSources} /></p><p id="generative-risk-evidence" className="vp-citation-target">遇到日期、金额、政策或个人信息时，先判断是否需要检索原文、工具调用或人工确认。生成结果可以帮助组织语言，但不能凭“说得顺”证明事实。<Cite id="generative-risk-evidence" sources={generativeAiSources} /></p><p><strong>读者判断</strong>：如果删掉提示后答案仍看起来完整，问自己“它依据的材料在哪里”；如果找不到材料，就把结果当作候选文本，而不是证据。</p></ArticleSection>
  </Article>;
}
