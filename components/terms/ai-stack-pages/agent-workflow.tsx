import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { agentWorkflowSources } from "@/lib/ai-stack-concept-sources/agent-workflow";
import { AgentWorkflowSignatureHero } from "../AiStackSignatureHeroes";
import { AgentWorkflowLesson } from "../ai-stack-lessons/agent-workflow";

const sections: [string, string][] = [
  ["agent-workflow-map", "先把工作流画成一张状态图"],
  ["agent-workflow-route", "路由可以写死，也可以交给模型"],
  ["agent-workflow-guard", "闸门要挡住副作用"],
  ["agent-workflow-boundary", "工作流的确定性到哪里为止"],
];

export function AgentWorkflowTermPage() {
  return <Article slug="agent-workflow" title="智能体工作流" subtitle="Agent Workflow · 用显式节点和状态把智能体任务推进到可验收出口" sources={agentWorkflowSources} sections={sections} hero={<AgentWorkflowSignatureHero />} intro={<>“工作流”不是把几个智能体连成一排就结束了。它是一张能追踪的状态图：请求从哪里进来，经过哪道检查，交给哪个节点，失败时停在哪里，什么证据才允许进入 done。节点里的模型可以灵活，外层的出口必须说得清。</>}>
    <ArticleSection id="agent-workflow-map" title="先把工作流画成一张状态图">
      <p>以退款申请为例，系统可以先接收订单和金额，再做字段、权限与风险检查，然后交给账单专家生成建议，最后经过人工或规则验收。每一步都应该能回答“现在在哪个节点、带着什么输入、下一步由谁决定”。这份状态不是给模型看的漂亮图，而是应用在失败、恢复和审计时要依赖的记录。</p>
      <p id="workflow-distinction" className="vp-citation-target">Anthropic 把 workflow 与 agent 分开：workflow 通过预先定义的代码路径编排模型和工具，agent 则让模型动态决定过程与工具使用。工作流的价值是对已知任务提供可预测的路径；它不要求每个节点都变成一个完全自主的智能体。<Cite id="workflow-distinction" sources={agentWorkflowSources} /></p>
      <AgentWorkflowLesson />
      <p id="workflow-predictability" className="vp-citation-target">当任务边界清晰时，显式节点能让团队提前画出权限、重试和验收位置。Anthropic 也提醒，agentic 系统常用更高的延迟和成本换灵活性；如果一个固定流程已经够用，先把状态图写清楚往往比增加自主决策更容易调试。<Cite id="workflow-predictability" sources={agentWorkflowSources} /></p>
    </ArticleSection>
    <ArticleSection id="agent-workflow-route" title="路由可以写死，也可以交给模型">
      <p id="workflow-routing" className="vp-citation-target">OpenAI Agents SDK 把编排分成两类：由代码决定流程，或让模型决定下一步；两者也可以混合。按钮“按规则路由”代表应用先定义金额和权限分支，“让模型选专家”代表分诊节点提出选择，但后面的状态、工具权限和验收仍由工作流承接。<Cite id="workflow-routing" sources={agentWorkflowSources} /></p>
      <p id="workflow-agents-tools" className="vp-citation-target">OpenAI 文档还区分 agents as tools 与 handoffs：前者让主智能体保留最终控制权，把专家当作一个有边界的子任务；后者把当前回复权转给选中的专家。这个选择会改变谁拥有对话和最终输出，不应只用“多智能体”三个字带过。<Cite id="workflow-agents-tools" sources={agentWorkflowSources} /></p>
      <p id="workflow-runner" className="vp-citation-target">Agents SDK 的 Runner 负责执行 agent、工具调用和 handoff，并提供 trace 观察运行过程。把运行器想成工作流的执行面更准确：它能推进节点和记录事件，却不会替应用定义“退款何时算完成”这条业务验收规则。<Cite id="workflow-runner" sources={agentWorkflowSources} /></p>
    </ArticleSection>
    <ArticleSection id="agent-workflow-guard" title="闸门要挡住副作用">
      <p id="workflow-guardrails" className="vp-citation-target">Guardrail 是工作流里的闸门，不是装饰性提示语。OpenAI 的文档区分输入、输出和工具 guardrail：输入检查可以在首个 agent 前阻止执行，输出检查可以在最终结果处拦截，工具检查则更适合围绕每个副作用动作。不同位置的检查不能互相冒充。<Cite id="workflow-guardrails" sources={agentWorkflowSources} /></p>
      <p id="workflow-boundaries" className="vp-citation-target">当校验失败时，正确的状态是 blocked、needs-human 或 retry，而不是把未通过的草稿写入订单。尤其要注意 guardrail 的覆盖边界：SDK 的输入/输出 guardrail 并不会自动在每个 handoff 节点运行，工具和转交要分别确认保护点。<Cite id="workflow-boundaries" sources={agentWorkflowSources} /></p>
      <p>动画里的“校验失败”故意停在输出闸门。它没有把模型的文字擦掉，也没有偷偷重跑；应用可以把失败原因、节点输入和是否产生副作用记录下来，再由人工或明确的重试策略决定下一步。</p>
    </ArticleSection>
    <ArticleSection id="agent-workflow-boundary" title="工作流的确定性到哪里为止">
      <p id="workflow-handoff" className="vp-citation-target">handoff 的意义是把控制权转交给指定专家。OpenAI 的 quickstart 用分诊 agent 把问题交给历史或数学专家，Runner 再报告最后由哪个 agent 回答；这让“谁接手”成为可观察事件，而不是上下文里一句模糊的“请另一个模型帮忙”。<Cite id="workflow-handoff" sources={agentWorkflowSources} /></p>
      <p id="workflow-transfer" className="vp-citation-target">Handoffs 文档说明，转交可以携带少量模型生成的 metadata，也可以用 input filter 改变接收方看到的历史；它不会自动替你选择目标或替换应用已有状态。工作流设计要明确哪些数据可以流过去、哪些必须删掉或重新授权。<Cite id="workflow-transfer" sources={agentWorkflowSources} /></p>
      <p id="workflow-filter" className="vp-citation-target">因此“显式工作流”不等于每个输出都确定：模型节点仍可能选错工具、写出不完整草稿或触发失败分支。确定的是状态转移、权限闸门和终态定义；不确定的部分要留在节点内部，并用 trace、回执和独立评估把它暴露出来。<Cite id="workflow-filter" sources={agentWorkflowSources} /></p>
      <p><strong>带走一个检查顺序：</strong>先画节点和状态，再决定某个转移由代码还是模型负责；随后给每个会产生副作用的节点加验证、权限和回执；最后把 done、blocked、retry、needs-human 分开记录。工作流不是把不确定性消灭，而是把它放到可以负责的格子里。</p>
    </ArticleSection>
  </Article>;
}
