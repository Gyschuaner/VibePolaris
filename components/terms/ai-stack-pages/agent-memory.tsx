import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { agentMemorySources } from "@/lib/ai-stack-concept-sources/agent-memory";
import { AgentMemoryLesson } from "../ai-stack-lessons/agent-memory";

export function AgentMemoryTermPage() {
  const sections: [string, string][] = [["memory-save", "记忆先是一项保存决定"], ["memory-retrieve", "只取回与当前任务有关的记录"], ["memory-lifecycle", "纠正、失效和删除"]];
  return <Article slug="agent-memory" title="智能体记忆" subtitle="Agent Memory · 为后续任务保存并取回的信息" sources={agentMemorySources} sections={sections} hero={<Hero trigger="下一次聊天怎样知道用户明确保存过的偏好？" change="同意 → 记录 → 取回 → 纠正或删除" proof="应用管理持久记录，模型只在记录被放入本轮输入时看到它" />} intro={<>智能体记忆是应用为后续任务保存、检索和管理的信息。它可以是用户偏好、已确认的事实或任务经验，但不会因为聊天结束就自动变成长期记录；保存范围、来源、期限和删除方式都需要产品决定。</>}>
    <ArticleSection id="memory-save" title="记忆先是一项保存决定"><p>用户说“以后代码示例优先用 TypeScript”，应用可以先询问是否保存。得到同意后，记录还应带上来源、时间和适用范围。没有同意时，当前回答可以使用这句话，但不能悄悄把它写进下一次会话的资料库。</p><p id="memory-definition" className="vp-citation-target">LangChain 将短期记忆与长期记忆分开：前者跟随线程或当前对话，后者通过 store 等持久层供不同会话取回。<Cite id="memory-definition" sources={agentMemorySources} /></p><AgentMemoryLesson /></ArticleSection>
    <ArticleSection id="memory-retrieve" title="只取回与当前任务有关的记录"><p id="memory-selection" className="vp-citation-target">上下文工程的核心是选择对当前任务真正有用的材料，而不是把所有旧记录塞回提示。记忆取回后还要检查适用范围和更新时间，避免把旧偏好当成当前指令。<Cite id="memory-selection" sources={agentMemorySources} /></p><p id="memory-scope" className="vp-citation-target">长期记录也应带有任务、用户或租户范围；取回前先应用范围和权限过滤，避免把一个场景的偏好带进另一个场景。<Cite id="memory-scope" sources={agentMemorySources} /></p><p id="memory-session" className="vp-citation-target">Agents SDK 的 session 可以保存对话历史并在下一轮取回，但 session 本身不是事实核验器；持久化之后仍要由应用控制隔离、授权和删除。<Cite id="memory-session" sources={agentMemorySources} /></p></ArticleSection>
    <ArticleSection id="memory-lifecycle" title="纠正、失效和删除"><p id="memory-reflection" className="vp-citation-target">Generative Agents 研究用记忆、检索、反思和计划构造长期行为；它展示的是一种研究系统，不代表所有智能体都会自动反思或永久记忆。<Cite id="memory-reflection" sources={agentMemorySources} /></p><p id="memory-virtual" className="vp-citation-target">MemGPT 把有限上下文与外部记忆分层，通过管理器在两者之间移动信息；这说明“记忆”仍需要容量和取回策略。<Cite id="memory-virtual" sources={agentMemorySources} /></p><p><strong>边界</strong>：删除记录不会改写已经生成的答案；它只影响之后哪些记录可以被取回。隐私内容还需要保留期限、访问权限和审计规则。</p></ArticleSection>
  </Article>;
}
