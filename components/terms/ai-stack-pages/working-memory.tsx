import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { workingMemorySources } from "@/lib/ai-stack-concept-sources/working-memory";
import { WorkingMemoryLesson } from "../ai-stack-lessons/working-memory";
import { WorkingMemoryDeskHero } from "../ai-stack-lessons/ai-interaction-heroes";

export function WorkingMemoryTermPage() {
  const sections: [string, string][] = [["working-snapshot", "先留下这次任务真正会用的几件事"], ["working-unknown", "工具没回，状态就停在未知"], ["working-handoff", "每次回执都要改写下一步"], ["working-cleanup", "交付物和临时草稿各走各的生命周期"]];
  return <Article slug="working-memory" title="工作记忆" subtitle="Working Memory · 当前任务继续推进所需的临时状态" sources={workingMemorySources} sections={sections} hero={<WorkingMemoryDeskHero />} intro={<>周五晚上，你让智能体从五副耳机里挑出两副“预算内、现在有货”的。它需要记住预算、候选和查库存的回执，却不需要把昨晚的闲聊整段搬进来。工作记忆就是这张会被回执改写、任务结束后可以收起的临时桌面。</>}>
    <ArticleSection id="working-snapshot" title="先留下这次任务真正会用的几件事"><p>任务刚开始时，桌面上只有三件要紧的东西：预算不超过 500 元、必须现货、最后交付两项。五个候选和“下一步查库存”也写进去；用户上次说过喜欢哪种编程语言，与这次比价没有关系，就留在别处。</p><p id="working-state" className="vp-citation-target">OpenAI Agents SDK 的运行器会沿着输入、工具调用和结果推进一次运行；session 或输入列表可以成为下一轮的状态来源，至于哪些历史进入模型，要由承载它的应用决定。<Cite id="working-state" sources={workingMemorySources} /></p><WorkingMemoryLesson /></ArticleSection>
    <ArticleSection id="working-unknown" title="工具没回，状态就停在未知"><p id="working-short-term" className="vp-citation-target">LangChain 把短期记忆放在线程状态里：同一条任务线能继续看到目标和工具结果，也可以在内容变长时做摘要。摘要会丢细节，所以任务真正依赖的约束要以可检查的状态留下。<Cite id="working-short-term" sources={workingMemorySources} /></p><p id="working-context" className="vp-citation-target">Anthropic 的上下文工程把当前动作需要的内容放在一起，并持续取舍相关性。库存接口还没回时，A、C、E 只能标成“待查”；把“没消息”涂成“有货”，下一步就会拿着假证据交付。<Cite id="working-context" sources={workingMemorySources} /></p></ArticleSection>
    <ArticleSection id="working-handoff" title="每次回执都要改写下一步"><p id="working-observation" className="vp-citation-target">ReAct 把行动和观察交替起来：先发出查询，再把环境返回的内容带回下一轮。库存回执说 E 无货后，清单才从 A、C、E 收敛为 A、C；这条观察是本轮的工作证据，不会因为被看见就自动变成长期档案。<Cite id="working-observation" sources={workingMemorySources} /></p><p>真正的交付也要有自己的边界：A、C 已经可以给用户比较，下一步不该继续盲目查库存。任务板上的候选数、调用次数和待办动作一起更新，读者才能看见“为什么现在可以停”。</p></ArticleSection>
    <ArticleSection id="working-cleanup" title="交付物和临时草稿各走各的生命周期"><p id="working-hierarchy" className="vp-citation-target">MemGPT 用分层记忆处理有限的上下文和更持久的外部存储。放回这个例子，临时候选、长期偏好和已经交付的比较结果就不该共用一条生命周期：清掉候选，不代表抹掉刚交付给用户的 A、C。<Cite id="working-hierarchy" sources={workingMemorySources} /></p><p id="working-session" className="vp-citation-target">运行器的 session 或线程状态也有自己的边界；任务结束后是否保留结果、审计记录或用户偏好，要由应用另行规定，而不是靠模型“记住”。<Cite id="working-session" sources={workingMemorySources} /></p><p><strong>停止条件</strong>：库存没有回执，就停在“待查”并保留临时清单；库存确认、结果交付后，才清理候选和调用计数。交付结果是否另存，交给另一条明确的存储规则。</p></ArticleSection>
  </Article>;
}
