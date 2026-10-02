import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { toolChoiceSources } from "@/lib/ai-stack-concept-sources/tool-choice";
import { ToolChoiceLesson } from "../ai-stack-lessons/tool-choice";

export function ToolChoiceTermPage() {
  const sections: [string, string][] = [["choice-question", "先决定要不要调用"], ["choice-policy", "选择策略改变候选"], ["choice-boundary", "选择不等于执行"]];
  return <Article slug="tool-choice" title="工具选择" subtitle="Tool Choice · 决定要不要调用哪个工具" sources={toolChoiceSources} sections={sections} hero={<Hero trigger="改会议时间时，为什么选中了日历工具却还没有改动？" change="请求 → 候选 → 选择策略 → 待校验" proof="选中的工具停在执行前，日历仍未改变" />} intro={<>工具选择回答的是“这一轮让模型提出什么调用”。应用先把可用工具和选择策略放在桌面上，模型再选择、被指定，或被禁止调用；真正执行还要经过参数、权限和副作用检查。</>}>
    <ArticleSection id="choice-question" title="先决定要不要调用"><p>用户说“把会议改到周五”，应用不能把“改”两个字直接当成已经发生的日历写入。它先判断这句话需要读取日历、更新日历，还是可以直接回答。候选工具是可能的下一步，不是结果。</p><p id="choice-call" className="vp-citation-target">函数调用接口把工具定义、参数 schema 和本轮请求分开；模型返回调用建议后，宿主程序才决定是否执行。<Cite id="choice-call" sources={toolChoiceSources} /></p><ToolChoiceLesson /></ArticleSection>
    <ArticleSection id="choice-policy" title="选择策略改变候选"><p id="choice-policy-text" className="vp-citation-target">OpenAI 的工具配置可以让模型自动选择、必须选择工具、指定某个工具或不调用工具；MCP 则把工具名、说明和输入 schema 作为可发现的能力交给客户端；Anthropic 的 tool use 也把模型提出调用与宿主执行分开。<Cite id="choice-policy-text" sources={toolChoiceSources} /><Cite id="choice-input" sources={toolChoiceSources} /><Cite id="choice-provider" sources={toolChoiceSources} /></p><p>演示里的相关性分数只是路由器的教学信号，不是所有模型接口都会返回的概率。把策略切到 <code>none</code>，候选仍能被展示，但本轮不会提出调用；切到 <code>required</code>，也不代表参数已经合规。</p></ArticleSection>
    <ArticleSection id="choice-boundary" title="选择不等于执行"><p id="choice-definition" className="vp-citation-target">工具定义描述“可以做什么”，不会自动授予应用访问资源的权限。Anthropic 的工具流程同样把工具调用请求、应用执行和执行结果区分开；OpenAI Agents SDK 也把工具封装成可被运行器调用的能力。<Cite id="choice-definition" sources={toolChoiceSources} /><Cite id="choice-agent" sources={toolChoiceSources} /></p><p id="choice-approval" className="vp-citation-target">涉及写入或其他高影响动作时，执行器还可以把调用送入审批暂停；OpenAI Agents SDK 的审批规则会在参数无法安全检查时默认停下。<Cite id="choice-approval" sources={toolChoiceSources} /></p><p><strong>判断方法</strong>：看到工具名只能说明“模型提出了一个可能的下一步”；只有执行器返回可核对的结果，才能说动作发生过。</p></ArticleSection>
  </Article>;
}
