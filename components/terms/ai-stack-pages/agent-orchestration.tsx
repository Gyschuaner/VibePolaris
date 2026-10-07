import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { agentOrchestrationSources } from "@/lib/ai-stack-concept-sources/agent-orchestration";
import { AgentOrchestrationHero, AgentOrchestrationLesson } from "../ai-stack-lessons/agent-orchestration";

export function AgentOrchestrationTermPage() {
  const sections: [string, string][] = [
    ["orchestration-question", "编排管理的是关系"],
    ["orchestration-mode", "并行和串行各有代价"],
    ["orchestration-state", "每个结果都要有归属"],
    ["orchestration-boundary", "合并需要规则"],
  ];
  return <Article slug="agent-orchestration" title="智能体编排" subtitle="Agent Orchestration · 安排多个角色如何协作" sources={agentOrchestrationSources} sections={sections} hero={<AgentOrchestrationHero />} intro={<>智能体编排管理多个智能体、程序或工具的关系：谁先运行，谁可以并行，谁必须等待，结果如何合并，出错时如何停止。角色多不等于系统会协作；真正要讲清的是任务依赖、状态归属和交付条件。</>}>
    <ArticleSection id="orchestration-question" title="编排管理的是关系">
      <p>把一份供应商报告交给三个模型并不自动成为“多智能体系统”。只有当任务被拆成有输入、有产出、有依赖的工作，编排器才有东西可管理：检索拿到资料，核对判断资料是否冲突，撰写只读取通过核对的材料。</p>
      <p id="orchestration-definition" className="vp-citation-target">OpenAI Agents SDK 把编排描述为决定哪些智能体以什么顺序运行，以及下一步怎样决定；这个决定可以由代码明确写出，也可以交给模型。<Cite id="orchestration-definition" sources={agentOrchestrationSources} />关键不是把任务切得越细，而是让每个交接点都能回答“我拿到的是什么、我交出的是什么”。</p>
      <AgentOrchestrationLesson />
    </ArticleSection>

    <ArticleSection id="orchestration-mode" title="并行和串行各有代价">
      <p id="orchestration-parallel" className="vp-citation-target">没有相互依赖的任务可以并行，以缩短等待时间；有依赖的任务必须等前置结果，否则核对员只能凭空判断，撰写员也可能把未经确认的材料写进去。<Cite id="orchestration-parallel" sources={agentOrchestrationSources} /></p>
      <p id="orchestration-pattern" className="vp-citation-target">Anthropic 将常见编排模式区分为预先安排的工作流和由模型决定下一步的智能体循环：前者更容易预测和调试，后者可以应对开放任务，但要付出更高的延迟、成本和失控风险。<Cite id="orchestration-pattern" sources={agentOrchestrationSources} />“并行”只回答何时开工，不回答结果如何判断。</p>
      <p id="orchestration-loop" className="vp-citation-target">运行器会在工具调用、交接和最终输出之间循环；编排器必须记录当前状态、允许的下一步和停止条件。没有最大轮数或预算上限，一个失败的工具调用就可能把所有角色拖进重复尝试。<Cite id="orchestration-loop" sources={agentOrchestrationSources} /></p>
    </ArticleSection>

    <ArticleSection id="orchestration-state" title="每个结果都要有归属">
      <p id="orchestration-handoff" className="vp-citation-target">交接可以把当前回复权转给专门智能体，也可以只让专家回传一项小结果。前一种适合让客服角色接管整段对话，后一种适合让价格核对员只返回“币种、数值、证据位置”。<Cite id="orchestration-handoff" sources={agentOrchestrationSources} />选错会让主智能体失去全局上下文，或者让专家越权替主系统做最终承诺。</p>
      <p>结果还应带着来源、版本和状态。一个“已完成”的卡片可能只是模型写完了文字，并不代表资料已核对、工具已成功或用户已经批准；把这些状态混成一个布尔值，后面就无法解释为什么报告被放行。</p>
      <p>这也是编排和简单并发调用的区别：并发调用只收集几个返回值，编排还要知道哪个返回值可以解锁下一步，哪个需要重试、人工复核或直接丢弃。</p>
    </ArticleSection>

    <ArticleSection id="orchestration-boundary" title="合并需要规则">
      <p id="orchestration-multi" className="vp-citation-target">多智能体研究展示了通过消息交换协作的可能性，但协作协议仍要规定上下文、角色、终止和冲突处理。<Cite id="orchestration-multi" sources={agentOrchestrationSources} />如果两个角色对同一价格给出不同数字，合并器不能靠“最后一个返回”决定真相。</p>
      <p>合并前至少要说明三件事：冲突以什么证据优先，缺字段是拒绝交付还是标成未知，重复结果如何去重。报告拼图桌里，冲突磁片被单独夹住，撰写夹子因此保持锁住；这个停顿本身就是可观察的产品行为。</p>
      <p><strong>边界</strong>：没有任务边界、状态记录、预算和合并规则时，增加角色只会增加调用、等待和不一致结果。先问“哪个依赖没有被表达”，再决定是否需要再加一个智能体。</p>
    </ArticleSection>
  </Article>;
}
