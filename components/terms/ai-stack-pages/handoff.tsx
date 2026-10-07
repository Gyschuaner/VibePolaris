import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { handoffSources } from "@/lib/ai-stack-concept-sources/handoff";
import { HandoffLesson } from "../ai-stack-lessons/handoff";
import { HandoffBadgeHero } from "../ai-stack-lessons/ai-interaction-heroes";

export function HandoffTermPage() {
  const sections: [string, string][] = [
    ["handoff-question", "交接包先回答接手者要做什么"],
    ["handoff-ownership", "回复权也会移动"],
    ["handoff-history", "历史不是越多越安全"],
    ["handoff-boundary", "交接失败要能退回"],
  ];
  return <Article slug="handoff" title="交接" subtitle="Handoff · 把任务和回复权交给下一个智能体" sources={handoffSources} sections={sections} hero={<HandoffBadgeHero />} intro={<>交接把继续任务所需的事实状态和下一步交给接手者，同时把后续回复权转过去。它解决的是“谁接着负责”，不是“动作已经完成”；交接包里没有足够证据时，接手者仍应停下，而不是替空白补一个答案。</>}>
    <ArticleSection id="handoff-question" title="交接包先回答接手者要做什么">
      <p>客服已经知道订单号 A102、用户要退款，但退款智能体不需要看到所有闲聊。一个可用的交接包至少要说清目标、已核对事实、尚未完成的动作、允许使用的工具和失败时的回退。把“请继续处理”单独传过去，接手者既不知道金额从哪来，也不知道哪一步已经做过。</p>
      <p id="handoff-definition" className="vp-citation-target">OpenAI Agents SDK 的 handoff 会把当前运行交给另一个智能体，并允许用输入类型、回调和过滤器定制交接。它把“选择谁接手”和“给接手者哪些材料”分成两个问题。<Cite id="handoff-definition" sources={handoffSources} /></p>
      <p id="handoff-package" className="vp-citation-target">例如交接包可以写成：<code>{"{ orderId: \"A102\", intent: \"refund\", verified: [\"paid\"], next: \"check_window\" }"}</code>。这里的字段是为了让接手者继续工作，不是把模型的内部思路全部转交；敏感字段仍应按权限和最小必要原则筛选。<Cite id="handoff-package" sources={handoffSources} /></p>
      <HandoffLesson />
    </ArticleSection>

    <ArticleSection id="handoff-ownership" title="回复权也会移动">
      <p id="handoff-context" className="vp-citation-target">接手不是只发送一条消息：路由后的智能体成为当前活动角色，后续工具和回答由它继续处理。原来的智能体可以保留运行记录，但不能同时把两个角色的回答都当成当前结论。<Cite id="handoff-context" sources={handoffSources} /></p>
      <p id="handoff-route" className="vp-citation-target">编排资料把“专门智能体直接面向用户回答”和“专家只作为工具回传”区分开。前者把回复权移走，后者让主线拿到一项可核对的结果后继续组织回答；选错机制会让用户不知道谁负责下一句。<Cite id="handoff-route" sources={handoffSources} /></p>
      <p>演示中，回复权标记从客服移到退款智能体；这只表示责任归属改变，并不表示退款动作已经执行。真正执行仍要经过工具参数、身份和业务规则检查。</p>
    </ArticleSection>

    <ArticleSection id="handoff-history" title="历史不是越多越安全">
      <p>完整聊天记录可能包含重复确认、无关闲聊和不应暴露给接手者的个人信息。过滤历史时要留下能改变下一步的事实，并明确哪些内容被省略；否则接手者可能把缺失误解成“没有发生过”。</p>
      <p id="handoff-filter" className="vp-citation-target">OpenAI SDK 的输入过滤器可以决定接手者看到哪些历史项目；过滤器改变的是接收上下文，不会自动撤销已经发生的工具副作用。因此要在交接前完成敏感信息处理，并把过滤结果留在可追溯记录里。<Cite id="handoff-filter" sources={handoffSources} /></p>
      <p id="handoff-history" className="vp-citation-target">多智能体研究把消息、角色和状态作为协作材料；应用仍需定义历史版本、重复消息和冲突字段如何处理。接手者看到的“最新状态”必须有来源和时间，不能只靠一段自然语言摘要。<Cite id="handoff-history" sources={handoffSources} /></p>
    </ArticleSection>

    <ArticleSection id="handoff-boundary" title="交接失败要能退回">
      <p id="handoff-specialist" className="vp-citation-target">专门角色可以让指令更聚焦，但系统仍要处理缺信息、超时、拒绝和重复交接。Anthropic 的工程建议也提醒，固定流程、单智能体和多智能体之间要按任务复杂度取舍；增加角色不等于增加可靠性。<Cite id="handoff-specialist" sources={handoffSources} /></p>
      <p id="handoff-conversation" className="vp-citation-target">多智能体对话研究把消息和状态作为协作材料；实际应用仍要定义谁能结束、谁能转回以及怎样避免循环。交接失败时，回到原智能体或转人工都要保留明确原因。<Cite id="handoff-conversation" sources={handoffSources} /><Cite id="handoff-loop" sources={handoffSources} /></p>
      <p><strong>停止条件</strong>：接手者确认已有足够事实，或明确退回补充；在此之前不能用“已转交”冒充“已完成”。如果接手前后任务参数发生变化，旧交接也应失效并重新检查。</p>
    </ArticleSection>
  </Article>;
}
