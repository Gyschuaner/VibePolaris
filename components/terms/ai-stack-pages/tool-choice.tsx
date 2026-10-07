import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { toolChoiceSources } from "@/lib/ai-stack-concept-sources/tool-choice";
import { ToolChoiceLesson } from "../ai-stack-lessons/tool-choice";
import { ToolChoiceSignatureHero } from "../ToolChoiceSignatureHero";

export function ToolChoiceTermPage() {
  const sections: [string, string][] = [["choice-question", "先决定要不要调用"], ["choice-policy", "选择策略改变候选"], ["choice-boundary", "选择不等于执行"]];
  return <Article slug="tool-choice" title="工具选择" subtitle="Tool Choice · 决定要不要调用哪个工具" sources={toolChoiceSources} sections={sections} hero={<ToolChoiceSignatureHero />} intro={<>工具选择回答的是“这一轮让模型提出什么调用”。应用先把可用工具和选择策略放在桌面上，模型再选择、被指定，或被禁止调用；真正执行还要经过参数、权限和副作用检查。</>}>
    <ArticleSection id="choice-question" title="先决定要不要调用">
      <p>用户说“把会议改到周五”，应用不能把“改”两个字直接当成已经发生的日历写入。它先判断这句话需要读取日历、更新日历，还是可以直接回答。候选工具是可能的下一步，不是结果。</p>
      <p id="choice-call" className="vp-citation-target">函数调用接口把工具定义、参数 schema 和本轮请求分开；模型返回调用建议后，宿主程序才决定是否执行。<Cite id="choice-call" sources={toolChoiceSources} /></p>
      <ToolChoiceLesson />
    </ArticleSection>
    <ArticleSection id="choice-policy" title="选择策略改变候选">
      <p id="choice-policy-text" className="vp-citation-target">OpenAI 的工具配置可以让模型自动选择、必须选择工具、指定某个工具或不调用工具。这里的策略先收窄“可以提出什么”，并不替应用完成权限检查。<Cite id="choice-policy-text" sources={toolChoiceSources} /></p>
      <p id="choice-input" className="vp-citation-target">MCP 把工具名、说明和输入 schema 作为可发现的能力交给客户端；客户端仍要决定哪些工具在本轮可见，以及调用参数是否符合自己的边界。<Cite id="choice-input" sources={toolChoiceSources} /></p>
      <p id="choice-provider" className="vp-citation-target">Anthropic 的 tool use 也把模型提出的 <code>tool_use</code> 区块、应用执行和回传的 <code>tool_result</code> 分开。模型可以提出选择，却不会凭空替宿主程序执行。<Cite id="choice-provider" sources={toolChoiceSources} /></p>
      <p>把策略切到 <code>none</code>，候选仍能被展示，但本轮不会提出调用；切到 <code>required</code>，也不代表参数已经合规。演示里的选择针只说明路由结果，不是模型接口必然返回的真实概率。</p>
    </ArticleSection>
    <ArticleSection id="choice-boundary" title="选择不等于执行">
      <p id="choice-definition" className="vp-citation-target">工具定义描述“可以做什么”，不会自动授予应用访问资源的权限。它应当和 allowlist、用户身份、参数校验以及副作用控制一起工作。<Cite id="choice-definition" sources={toolChoiceSources} /></p>
      <p id="choice-agent" className="vp-citation-target">OpenAI Agents SDK 把工具封装成可被运行器调用的能力；运行器收到模型提出的调用后，才会进入实际执行阶段，随后再把结果带回流程。<Cite id="choice-agent" sources={toolChoiceSources} /></p>
      <p id="choice-approval" className="vp-citation-target">涉及写入或其他高影响动作时，执行器还可以把调用送入审批暂停；审批规则在参数无法安全检查时应默认停下。<Cite id="choice-approval" sources={toolChoiceSources} /></p>
      <p><strong>判断方法</strong>：看到工具名只能说明“模型提出了一个可能的下一步”；只有执行器返回可核对的结果，才能说动作发生过。</p>
    </ArticleSection>
  </Article>;
}
