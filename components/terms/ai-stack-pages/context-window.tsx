import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { contextWindowSources } from "@/lib/ai-stack-concept-sources/context-window";
import { ContextWindowLesson } from "../ai-stack-lessons/context-window";

export function ContextWindowTermPage() {
  const sections: [string, string][] = [["window-budget", "一轮请求怎样分预算"], ["window-prune", "超出后先处理输入"], ["window-boundary", "可见不等于会用"]];
  return <Article slug="context-window" title="上下文窗口" subtitle="Context Window · 一次请求能容纳的总 token 预算" sources={contextWindowSources} sections={sections} hero={<Hero trigger="为什么把整段聊天贴进去，模型还是漏掉前面的条件？" change="输入 + 输出 + 推理共用一次请求预算" proof="超出上限时，裁剪或压缩会改变模型实际看到的内容" />} intro={<>上下文窗口是一次模型请求能够处理的 token 总量。历史消息、系统指令、工具结果、准备生成的答案，以及部分模型的推理 token，都在争用这份预算；它不是“记忆容量”，也不是把窗口填满就能平均利用。</>}>
    <ArticleSection id="window-budget" title="一轮请求怎样分预算"><p>把上下文想成一张有限的工作台。系统指令先占一部分，用户材料和工具结果再放上去，应用还要为回答预留空间。输入越长，留给输出的空间越小；不同模型的上限和计费方式也可能不同。</p><p id="context-budget" className="vp-citation-target">OpenAI 将 context window 定义为单次请求的最大 token 数，并明确输入、输出以及某些模型的推理 token都会占用总量。<Cite id="context-budget" sources={contextWindowSources} /></p><ContextWindowLesson /></ArticleSection>
    <ArticleSection id="window-prune" title="超出后先处理输入"><p id="context-state" className="vp-citation-target">多轮对话可以由应用手动拼接历史，也可以使用会话、conversation_id 或 previous_response_id 继续；这些状态管理方式仍然要面对每次请求的上下文上限。<Cite id="context-state" sources={contextWindowSources} /></p><p id="context-session" className="vp-citation-target">Agents SDK 的 session 会在下一轮取回历史，但“取回”不等于无限保留。应用仍要决定何时摘要、裁剪、检索旧资料，或把不再需要的工具结果移出当前请求。<Cite id="context-session" sources={contextWindowSources} /></p></ArticleSection>
    <ArticleSection id="window-boundary" title="可见不等于会用"><p id="context-attention" className="vp-citation-target">Transformer 用注意力在输入位置之间建立关系，但这不表示每个位置都得到同样可靠的利用；模型结构仍要通过训练和推理来处理长输入。<Cite id="context-attention" sources={contextWindowSources} /></p><p id="context-utilization" className="vp-citation-target">Lost in the Middle 的实验显示，信息放在长上下文中间可能比放在开头或结尾更难被有效利用；窗口变大不能替代相关性筛选和位置安排。<Cite id="context-utilization" sources={contextWindowSources} /></p><p id="context-selection" className="vp-citation-target">上下文工程还要按当前任务选择、压缩和隔离材料；把所有旧内容都塞进窗口，会增加噪声和管理成本。<Cite id="context-selection" sources={contextWindowSources} /></p><p><strong>判断方法</strong>：先列出本轮必须保留的事实、工具结果和输出预算，再选择裁剪、摘要或检索；不要只看模型支持的最大数字。</p></ArticleSection>
  </Article>;
}
