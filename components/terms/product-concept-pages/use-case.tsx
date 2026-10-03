import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { UseCaseLesson } from "../product-concept-lessons/use-case";
import { useCaseSources } from "@/lib/product-concept-sources/use-case";

const sections: [string, string][] = [
  ["use-case-goal", "从参与者目标开始"],
  ["use-case-structure", "把条件、步骤和状态写全"],
  ["use-case-boundary", "用替代路径守住边界"],
];

export function UseCaseTermPage() {
  return <GitArticle
    slug="use-case"
    title="使用场景"
    subtitle="Use Case · 把参与者目标和系统结果连成一条路径"
    sources={useCaseSources}
    sections={sections}
    hero={<GitHero contextLabel="先看一次退款" contextTitle="订单 · 退款申请" trigger="“用户可以退款”需要覆盖哪些正常和异常情况？" change="参与者 → 条件 → 路径结果" proof="每条分支都能说明状态是否改变" />}
    intro={<>使用场景（Use Case）围绕一个参与者目标，说明他在什么条件下触发系统、系统如何推进主流程，以及替代或失败路径如何结束。它帮助团队讨论系统行为和结果，不是逐像素画面，也不等于一整段跨服务的用户旅程。</>}
  >
    <ArticleSection id="use-case-goal" title="从参与者目标开始">
      <p id="use-case-goal-detail" className="vp-citation-target">先写参与者要完成的目标，再决定哪些系统行为属于这个用例。退款用例的目标是让购买者处理一笔符合条件的订单，不是“点击退款按钮”或“调用某个 API”；这样才能检验界面、服务和外部支付方是否共同完成了用户结果。<Cite id="use-case-goal-detail" sources={useCaseSources} /></p>
      <p id="use-case-actor-detail" className="vp-citation-target">参与者可以是人，也可以是与系统交互的外部角色或服务。要写清谁触发、谁提供信息、谁接收结果，避免把“页面”“数据库”等内部部件误当成用户角色。<Cite id="use-case-actor-detail" sources={useCaseSources} /></p>
      <p id="use-case-journey-detail" className="vp-citation-target">一个 Use Case 只展开一段可讨论的交互；它仍要放回更大的用户旅程，确认前后步骤、其他团队和线下渠道怎样衔接。完整旅程里可能还有查订单、联系支持和到账确认，不能因为这一段有结果就假设整个问题已解决。<Cite id="use-case-journey-detail" sources={useCaseSources} /></p>
      <UseCaseLesson />
    </ArticleSection>

    <ArticleSection id="use-case-structure" title="把条件、步骤和状态写全">
      <p id="use-case-structure-detail" className="vp-citation-target">一条可执行的用例至少要有前置条件、触发动作、主成功场景和完成后状态。退款示例里，订单已支付且当前示例距支付 36 小时，仍在 48 小时退款期限内；购买者提交申请是触发；支付方受理后进入 refund_pending 是主结果。<Cite id="use-case-structure-detail" sources={useCaseSources} /></p>
      <p id="use-case-flow-detail" className="vp-citation-target">主流程按参与者和系统轮流做什么来写，每一步都要让下一步有依据。不要只列页面名称；把校验、外部调用、返回值和状态变化写出来，团队才能检查遗漏的权限、数据和责任边界。<Cite id="use-case-flow-detail" sources={useCaseSources} /></p>
      <p id="use-case-state-detail" className="vp-citation-target">完成状态要说明系统留下了什么可观察结果，以及哪些数据没有改变。成功受理会改变订单状态；资格不符或支付方超时则应保留原状态，并告诉参与者下一步能做什么。<Cite id="use-case-state-detail" sources={useCaseSources} /></p>
    </ArticleSection>

    <ArticleSection id="use-case-boundary" title="用替代路径守住边界">
      <p id="use-case-alternative-detail" className="vp-citation-target">替代路径不是把主流程重复一遍，而是说明条件变化后系统如何分叉：期限过了就提前拒绝，外部服务失败就进入可重试状态。每条分支都要写用户看到的结果、是否改变数据，以及它从哪一步结束。<Cite id="use-case-alternative-detail" sources={useCaseSources} /></p>
      <p id="use-case-context-detail" className="vp-citation-target">用例还要交代它和周围系统的边界：所需证据从哪里来，后台谁处理，用户是否会转到另一个渠道。把这些上下文画出来，才能发现重复输入、死路或跨团队依赖，而不是把异常藏在一句“系统处理失败”里。<Cite id="use-case-context-detail" sources={useCaseSources} /></p>
      <p><strong>读者判断：</strong>看到“用户可以退款”时，先追问“谁触发？满足什么前置条件？主流程怎样结束？过期、无权限和外部失败各留下什么结果？”如果这些问题答不出来，先补用例边界，再画页面。</p>
    </ArticleSection>
  </GitArticle>;
}
