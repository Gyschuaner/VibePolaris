import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { planAndExecuteSources } from "@/lib/ai-stack-concept-sources/plan-and-execute";
import { PlanAndExecuteLesson } from "../ai-stack-lessons/plan-and-execute";
import { PlanDependencyHero } from "../ai-stack-lessons/signature-heroes";

export function PlanAndExecuteTermPage() {
  const sections: [string, string][] = [
    ["plan-question", "计划先把依赖写出来"],
    ["plan-evidence", "每一步都要有完成证据"],
    ["plan-adaptation", "计划要能吸收新结果"],
    ["plan-boundary", "失败会改写剩余步骤"],
  ];
  return <Article slug="plan-and-execute" title="规划与执行" subtitle="Plan and Execute · 先排步骤，再按结果推进" sources={planAndExecuteSources} sections={sections} hero={<PlanDependencyHero />} intro={<>规划与执行把一个目标拆成有前后关系、能检查的步骤，再逐项执行。计划只是对下一步的安排；真正的进展来自每一步返回的证据，以及系统是否根据失败结果改变后面的安排。依赖节点可以被修改，但每次修改都应留下原因和新的检查点。</>}>
    <ArticleSection id="plan-question" title="计划先把依赖写出来">
      <p>“发布一个页面”可以拆成构建、测试、部署。部署依赖测试通过，测试又依赖构建产物。把顺序、输入和阻塞条件写出来，读者能看见为什么部署还在等待，而不是把三个动词排成一行就当成完成。</p>
      <p id="plan-orchestration" className="vp-citation-target">智能体编排资料把计划看作决定哪些代理或步骤运行、以什么顺序运行，以及下一步根据什么结果决定；这不是单纯列待办事项。<Cite id="plan-orchestration" sources={planAndExecuteSources} />一份有用的计划还要说明谁负责产出、什么状态算完成、失败后允许走哪条分支。</p>
      <PlanAndExecuteLesson />
    </ArticleSection>

    <ArticleSection id="plan-evidence" title="每一步都要有完成证据">
      <p id="plan-loop" className="vp-citation-target">运行器会在模型输出、工具调用、工具结果和下一轮判断之间循环；只有得到最终输出或停止条件，循环才结束；运行器也要设置轮次上限，避免把重试误当成进展。<Cite id="plan-loop" sources={planAndExecuteSources} /><Cite id="plan-limit" sources={planAndExecuteSources} />“调用成功”只是工具有响应，不一定意味着目标已经完成。</p>
      <p id="plan-react" className="vp-citation-target">ReAct 研究把推理与行动交替起来，行动返回的观察会影响后续步骤；它不是“先想一个永远正确的计划”。<Cite id="plan-react" sources={planAndExecuteSources} />如果测试告诉我们按钮仍然不可用，下一步就应当是修复或重新规划，而不是继续执行部署。</p>
      <p>因此“构建通过”只能解锁测试，“测试通过”才可能解锁部署。每个节点的状态、输入、输出和时间都应留在可核对的记录里，尤其要区分“尚未运行”“运行失败”“运行成功但未满足验收”。</p>
    </ArticleSection>

    <ArticleSection id="plan-adaptation" title="计划要能吸收新结果">
      <p id="plan-update" className="vp-citation-target">计划式系统通常把可调整的步骤和直接执行的固定流程结合起来；失败时可以暂停、重排或加入修复，而不是把旧计划继续跑完。<Cite id="plan-update" sources={planAndExecuteSources} />页面里的修复卡插入原蓝图，是为了表示“计划变了”，而不是把失败从记录里擦掉。</p>
      <p>执行结果可能改变目标本身：缺少一个 API 权限时，计划应先补权限或改用只读路径；资料过期时，计划应加入重新检索，而不是拿旧证据继续往下写。调整后的步骤需要继承已有结果，避免从头重复所有工作。</p>
      <p>每次重排都应写明触发原因、保留哪些产物、丢弃哪些假设和新的停止条件。否则“动态计划”会变成无法复盘的模型自由发挥，成功和失败都说不清是哪个决定造成的。</p>
    </ArticleSection>

    <ArticleSection id="plan-boundary" title="失败会改写剩余步骤">
      <p id="plan-workflow" className="vp-citation-target">Anthropic 对工作流和智能体的区分也强调：预先确定的路径更可预测，开放式循环更灵活但需要更多状态管理。<Cite id="plan-workflow" sources={planAndExecuteSources} />任务越开放，越要把预算、工具权限和人工检查点写进计划，而不是只写一句“直到完成”。</p>
      <p>失败不等于整条任务失败，也不等于可以忽略。可以重试一次、换资料源、插入人工审批或直接停止；选择哪种动作取决于失败是否可恢复、重试是否幂等、继续执行是否会产生外部副作用。</p>
      <p><strong>不能套用的情况</strong>：简单的一步操作不需要为“计划”增加复杂层；计划也不会替代权限检查、真实测试或上线后的健康检查。先判断依赖和不确定性是否真的存在，再决定要不要建立规划器。</p>
    </ArticleSection>
  </Article>;
}
