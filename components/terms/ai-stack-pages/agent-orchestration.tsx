import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { agentOrchestrationSources } from "@/lib/ai-stack-concept-sources/agent-orchestration";
import { AgentOrchestrationHero, AgentOrchestrationLesson } from "../ai-stack-lessons/agent-orchestration";

export function AgentOrchestrationTermPage() {
  const sections: [string, string][] = [["orchestration-question", "编排管理的是关系"], ["orchestration-mode", "并行和串行各有代价"], ["orchestration-boundary", "合并需要规则"]];
  return <Article slug="agent-orchestration" title="智能体编排" subtitle="Agent Orchestration · 安排多个角色如何协作" sources={agentOrchestrationSources} sections={sections} hero={<AgentOrchestrationHero />} intro={<>智能体编排管理多个智能体、程序或工具的流程：谁先运行，谁可以并行，谁必须等待，结果如何合并，出错时如何停止。多个模型同时运行只是数量变化，不能单独说明存在编排。</>}>
    <ArticleSection id="orchestration-question" title="编排管理的是关系"><p>报告任务可以拆成检索、核对和撰写。编排器把任务交给相应角色，记录依赖和状态，再把核对结果交给撰写。读者关注的不是角色名称，而是每条输入从哪里来、谁有权推进下一步。</p><p id="orchestration-definition" className="vp-citation-target">OpenAI Agents SDK 将编排定义为决定哪些智能体以什么顺序运行，以及下一步怎样决定；可以由模型判断，也可以由代码安排。<Cite id="orchestration-definition" sources={agentOrchestrationSources} /></p><AgentOrchestrationLesson /></ArticleSection>
    <ArticleSection id="orchestration-mode" title="并行和串行各有代价"><p id="orchestration-parallel" className="vp-citation-target">没有相互依赖的任务可以并行以节省时间；有依赖的任务必须等待前置结果。代码编排通常更可预测，模型编排更灵活，但需要监控和停止条件。<Cite id="orchestration-parallel" sources={agentOrchestrationSources} /><Cite id="orchestration-pattern" sources={agentOrchestrationSources} /></p><p id="orchestration-loop" className="vp-citation-target">运行器会在工具调用、交接和最终输出之间循环；编排器必须决定哪些状态继续、哪些状态退出。<Cite id="orchestration-loop" sources={agentOrchestrationSources} /></p></ArticleSection>
    <ArticleSection id="orchestration-boundary" title="合并需要规则"><p id="orchestration-multi" className="vp-citation-target">多智能体研究展示了通过消息交换协作的可能性，但协作协议仍要规定上下文、角色、终止和冲突处理。<Cite id="orchestration-multi" sources={agentOrchestrationSources} /></p><p id="orchestration-handoff" className="vp-citation-target">交接是把当前回复权转给专门智能体的一种编排方式；如果只是让专家回传一项小结果，保持主智能体的最终回复权会更容易验收。<Cite id="orchestration-handoff" sources={agentOrchestrationSources} /></p><p><strong>边界</strong>：没有任务边界、状态记录和合并规则时，更多智能体只会带来更多调用、等待和不一致结果。</p></ArticleSection>
  </Article>;
}
