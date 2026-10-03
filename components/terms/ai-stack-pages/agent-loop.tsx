import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { agentLoopSources } from "@/lib/ai-stack-concept-sources/agent-loop";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function AgentLoopTermPage() {
  const sections: [string, string][] = [["loop-turn", "一轮循环真正发生了什么"], ["loop-state-chapter", "结果要回到状态"], ["loop-stop", "停止条件和失败出口"]];
  return <Article slug="agent-loop" title="智能体循环" subtitle="Agent Loop · 读取、行动、观察，再决定下一步" sources={agentLoopSources} sections={sections} hero={<Hero trigger="为什么智能体修一次代码后还要再跑测试？" change="当前状态 → 动作 → 工具结果 → 下一轮判断" proof="每轮结果改变状态，满足完成或限制条件后才停止" />} intro={<>智能体循环不是一次函数调用的别名。它把当前任务状态交给模型，执行一个受控动作，把结果写回，再判断是否继续；循环必须有完成、失败、取消或预算耗尽等出口。</>}>
    <ArticleSection id="loop-turn" title="一轮循环真正发生了什么"><p>修复按钮的任务可能先读代码、再运行测试、再决定是否修改。每轮只产生一个可核对的结果：测试是否失败、文件是否改变、还有哪些清单项。下一轮应该看到这个结果，而不是重新假装从零开始。</p><p id="loop-runner" className="vp-citation-target">OpenAI Agents SDK 的 Runner 会在模型输出最终结果、请求 handoff 或产生工具调用之间分流；工具结果回到运行器后，才可能再次调用模型。<Cite id="loop-runner" sources={agentLoopSources} /></p><ContextRetrievalLesson mode="agent-loop" /></ArticleSection>
    <ArticleSection id="loop-state-chapter" title="结果要回到状态"><p id="loop-reason-act" className="vp-citation-target">ReAct 将推理线索与行动、观察交替起来；对读者有用的重点不是模仿一段隐藏思维，而是让动作有明确输入，观察结果能影响下一步。<Cite id="loop-reason-act" sources={agentLoopSources} /></p><p id="loop-workflow" className="vp-citation-target">Anthropic 将 agentic workflow 与更自主的 agent 区分开：循环越开放，越需要让环境结果、检查器和人工边界成为可见的控制点。<Cite id="loop-workflow" sources={agentLoopSources} /></p></ArticleSection>
    <ArticleSection id="loop-stop" title="停止条件和失败出口"><p id="loop-limit" className="vp-citation-target">Agents SDK 用 max_turns 限制循环轮数；达到上限会报告 MaxTurnsExceeded，而不是把未完成任务伪装成成功。<Cite id="loop-limit" sources={agentLoopSources} /></p><p id="loop-orchestration" className="vp-citation-target">编排可以由模型选择下一步，也可以由代码固定流程；两者都需要定义超时、权限、重试和最终判据。<Cite id="loop-orchestration" sources={agentLoopSources} /></p><p id="loop-state" className="vp-citation-target">有状态图或检查点的实现可以保存当前节点与输入，但保存进度不等于业务动作已经成功，恢复后仍要重新验证外部结果。<Cite id="loop-state" sources={agentLoopSources} /></p></ArticleSection>
  </Article>;
}
