import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { workingMemorySources } from "@/lib/ai-stack-concept-sources/working-memory";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function WorkingMemoryTermPage() {
  const sections: [string, string][] = [["working-state-chapter", "当前任务要留下什么"], ["working-update", "工具结果改变下一步"], ["working-cleanup", "交付后清理哪一层"]];
  return <Article slug="working-memory" title="工作记忆" subtitle="Working Memory · 当前任务继续推进所需的临时状态" sources={workingMemorySources} sections={sections} hero={<Hero trigger="智能体查价后，下一轮怎么知道还剩哪些候选？" change="目标 + 候选 + 工具结果 + 下一步" proof="当前任务状态被更新和清理，不能自动当成跨会话偏好" />} intro={<>工作记忆是当前任务的临时状态：目标、候选清单、已经查到的结果、调用次数和下一步计划都可以放在这里。它让下一轮有可用的工作面，但不等于模型天然拥有一块永不丢失的记忆。</>}>
    <ArticleSection id="working-state-chapter" title="当前任务要留下什么"><p>比价任务需要同时记住预算、是否有货、五个候选和已经调用的工具。把这些状态写在任务记录里，下一轮才能解释为什么某个候选被淘汰；只把原始聊天全文重新贴上去，会让关键状态难以定位。</p><p id="working-state" className="vp-citation-target">Agents SDK 的运行器可以把 session 或输入列表作为下一轮状态来源；应用决定哪些历史进入模型，而不是由模型自动获得宿主程序的全部内存。<Cite id="working-state" sources={workingMemorySources} /></p><ContextRetrievalLesson mode="working-memory" /></ArticleSection>
    <ArticleSection id="working-update" title="工具结果改变下一步"><p id="working-short-term" className="vp-citation-target">LangChain 把短期记忆描述为线程级状态，并提供在 token 超过限制时摘要消息的方式；摘要也是一种有损的状态变换，需要保留任务真正依赖的事实。<Cite id="working-short-term" sources={workingMemorySources} /></p><p id="working-context" className="vp-citation-target">Anthropic 的上下文工程强调为当前动作准备足够、相关和隔离的上下文；工作记忆不是把所有中间过程永久放在提示里。<Cite id="working-context" sources={workingMemorySources} /></p></ArticleSection>
    <ArticleSection id="working-cleanup" title="交付后清理哪一层"><p id="working-hierarchy" className="vp-citation-target">MemGPT 通过层级记忆管理有限上下文与外部存储；这提醒我们把临时候选、长期偏好和最终交付物分成不同生命周期。<Cite id="working-hierarchy" sources={workingMemorySources} /></p><p id="working-observation" className="vp-citation-target">ReAct 的每轮观察是当前行动的输入，不是自动写入长期档案的事实。<Cite id="working-observation" sources={workingMemorySources} /></p><p id="working-session" className="vp-citation-target">会话或线程状态通常有明确的生命周期；任务结束后的清理和跨会话保存要由应用单独决定。<Cite id="working-session" sources={workingMemorySources} /></p><p><strong>停止条件</strong>：任务结束时可以清掉候选列表和调用计数；是否保留交付结果、审计记录或用户偏好，必须由另一条存储规则决定。</p></ArticleSection>
  </Article>;
}
