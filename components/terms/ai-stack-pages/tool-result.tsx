import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { toolResultSources } from "@/lib/ai-stack-concept-sources/tool-result";
import { ToolResultHero, ToolResultLesson } from "../ai-stack-lessons/tool-result";

export function ToolResultTermPage() {
  const sections: [string, string][] = [["result-question", "结果不是最终回答"], ["result-shape", "先保存原始返回"], ["result-boundary", "传输成功不等于业务成功"]];
  return <Article slug="tool-result" title="工具结果" subtitle="Tool Result · 把执行返回交给下一步判断" sources={toolResultSources} sections={sections} hero={<ToolResultHero />} intro={<>工具结果是工具执行后带回应用的数据、错误和元信息。它会改变下一轮判断，但它本身还不是模型的最终回答；应用需要把结果和那次具体调用对应起来，再检查业务含义。</>}>
    <ArticleSection id="result-question" title="结果不是最终回答"><p>查库存时，模型先提出“查 K7”。工具返回后，模型才知道当前库存；在这之前显示“有货”只是猜测。结果进入上下文后，应用还要决定下一步是回答、重试、请求补充信息，还是说明无法确认。</p><p id="result-call" className="vp-citation-target">OpenAI 的函数调用流程要求宿主执行函数，再把工具消息带着关联 ID 返回给模型；MCP 工具也规定调用与结果之间的结构关系。<Cite id="result-call" sources={toolResultSources} /></p><ToolResultLesson /></ArticleSection>
    <ArticleSection id="result-shape" title="先保存原始返回"><p id="result-structure" className="vp-citation-target">工具结果不只有一个自然语言句子：结构化字段、错误、状态码和元信息都可能影响下一步。保留原始 JSON，能让应用区分“接口返回了什么”和“模型怎样解释它”；MCP 的结果结构、Anthropic 的 tool_use/tool_result 配对，以及 OpenAI Agents SDK 的工具输出都把这份中间状态留在流程里。<Cite id="result-structure" sources={toolResultSources} /><Cite id="result-provider" sources={toolResultSources} /><Cite id="result-agent" sources={toolResultSources} /></p><p id="result-return" className="vp-citation-target">如果返回中的 <code>call_id</code> 对不上当前请求，应用不能把这份数据塞进当前回答；工具调用和工具结果必须属于同一条可追溯的链。<Cite id="result-return" sources={toolResultSources} /></p></ArticleSection>
    <ArticleSection id="result-boundary" title="传输成功不等于业务成功"><p id="result-error" className="vp-citation-target">HTTP 200 只说明这一层返回了成功响应，不保证库存字段存在、来源仍新鲜或业务操作成功。超时、空结果、权限错误和部分完成都应该成为可见状态。<Cite id="result-error" sources={toolResultSources} /></p><p id="result-loop" className="vp-citation-target">运行器把工具输出带回当前流程后，才会重新调用模型或结束本轮；如果结果是错误，下一步应保留“不确定”，而不是用预期值填空。<Cite id="result-loop" sources={toolResultSources} /></p><p><strong>读者可以这样核对</strong>：先问“这条数据来自哪个 call_id、什么时间、哪个字段”，再问“业务规则允许我根据它做什么”。</p></ArticleSection>
  </Article>;
}
