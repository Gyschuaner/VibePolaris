import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { planAndExecuteSources } from "@/lib/ai-stack-concept-sources/plan-and-execute";
import { PlanAndExecuteLesson } from "../ai-stack-lessons/plan-and-execute";

export function PlanAndExecuteTermPage() {
  const sections: [string, string][] = [["plan-question", "计划先把依赖写出来"], ["plan-evidence", "每一步都要有完成证据"], ["plan-boundary", "失败会改写剩余步骤"]];
  return <Article slug="plan-and-execute" title="规划与执行" subtitle="Plan and Execute · 先排步骤，再按结果推进" sources={planAndExecuteSources} sections={sections} hero={<Hero trigger="测试有一项没过，为什么不能直接部署？" change="计划 → 执行 → 检查 → 停止或重排" proof="失败节点锁住后继步骤，修复被插入计划" />} intro={<>规划与执行把一个目标拆成有前后关系、能检查的步骤，再逐项执行。计划只是对下一步的安排；真正的进展来自每一步返回的证据，以及系统是否根据失败结果改变后面的安排。</>}>
    <ArticleSection id="plan-question" title="计划先把依赖写出来"><p>“发布一个页面”可以拆成构建、测试、部署。部署依赖测试通过，测试又依赖构建产物。把顺序写出来，读者能看见为什么部署还在等待，而不是把三个动词排成一行就当成完成。</p><p id="plan-orchestration" className="vp-citation-target">智能体编排资料把计划看作决定哪些代理或步骤运行、以什么顺序运行，以及下一步根据什么结果决定；这不是单纯列待办事项。<Cite id="plan-orchestration" sources={planAndExecuteSources} /></p><PlanAndExecuteLesson /></ArticleSection>
    <ArticleSection id="plan-evidence" title="每一步都要有完成证据"><p id="plan-loop" className="vp-citation-target">运行器会在模型输出、工具调用、工具结果和下一轮判断之间循环；只有得到最终输出或停止条件，循环才结束；运行器也要设置轮次上限，避免把重试误当成进展。<Cite id="plan-loop" sources={planAndExecuteSources} /><Cite id="plan-limit" sources={planAndExecuteSources} /></p><p id="plan-react" className="vp-citation-target">ReAct 研究把推理与行动交替起来，行动返回的观察会影响后续步骤；它不是“先想一个永远正确的计划”。<Cite id="plan-react" sources={planAndExecuteSources} /></p><p>因此“构建通过”只能解锁测试，“测试通过”才可能解锁部署。每个节点的状态、输入和输出都应留在可核对的记录里。</p></ArticleSection>
    <ArticleSection id="plan-boundary" title="失败会改写剩余步骤"><p id="plan-update" className="vp-citation-target">计划式系统通常把可调整的步骤和直接执行的固定流程结合起来；失败时可以暂停、重排或加入修复，而不是把旧计划继续跑完。<Cite id="plan-update" sources={planAndExecuteSources} /></p><p id="plan-workflow" className="vp-citation-target">Anthropic 对工作流和智能体的区分也强调：预先确定的路径更可预测，开放式循环更灵活但需要更多状态管理。<Cite id="plan-workflow" sources={planAndExecuteSources} /></p><p><strong>不能套用的情况</strong>：简单的一步操作不需要为“计划”增加复杂层；计划也不会替代权限检查、真实测试或上线后的健康检查。</p></ArticleSection>
  </Article>;
}
