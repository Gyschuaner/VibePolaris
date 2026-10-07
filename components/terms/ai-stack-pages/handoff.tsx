import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { handoffSources } from "@/lib/ai-stack-concept-sources/handoff";
import { HandoffLesson } from "../ai-stack-lessons/handoff";
import { HandoffBadgeHero } from "../ai-stack-lessons/ai-interaction-heroes";

export function HandoffTermPage() {
  const sections: [string, string][] = [["handoff-question", "接手者需要什么"], ["handoff-ownership", "回复权也会移动"], ["handoff-boundary", "交接失败要能退回"]];
  return <Article slug="handoff" title="交接" subtitle="Handoff · 把任务和回复权交给下一个智能体" sources={handoffSources} sections={sections} hero={<HandoffBadgeHero />} intro={<>交接把继续任务所需的事实状态和下一步交给接手者，同时把后续回复权转过去。它不要求把整段聊天原样搬运，也不等于两个智能体并行协作。</>}>
    <ArticleSection id="handoff-question" title="接手者需要什么"><p>客服已经知道订单号 A102、用户要退款，但退款智能体不需要看到所有闲聊。交接包应包含接手所需的事实、已确认的步骤和待完成的动作；缺少关键事实时，接手者应该停下请求补充。</p><p id="handoff-definition" className="vp-citation-target">OpenAI Agents SDK 的 handoff 会把当前运行交给另一个智能体，并允许筛选或整理传入上下文；这说明交接关注“接手后能继续什么”。<Cite id="handoff-definition" sources={handoffSources} /></p><HandoffLesson /></ArticleSection>
    <ArticleSection id="handoff-ownership" title="回复权也会移动"><p id="handoff-context" className="vp-citation-target">接手不是只发送一条消息：路由后的智能体成为当前活动角色，后续工具和回答由它继续处理。<Cite id="handoff-context" sources={handoffSources} /></p><p id="handoff-route" className="vp-citation-target">编排资料把“专门智能体直接面向用户回答”和“专家只作为工具回传”区分开；两者的回复权归属不同。<Cite id="handoff-route" sources={handoffSources} /></p><p>演示中，回复权标记从客服移到退款智能体；这表示谁负责下一句，并不表示退款动作已经执行。</p></ArticleSection>
    <ArticleSection id="handoff-boundary" title="交接失败要能退回"><p id="handoff-specialist" className="vp-citation-target">专门角色可以让指令更聚焦，但系统仍要处理缺信息、超时、拒绝和重复交接。<Cite id="handoff-specialist" sources={handoffSources} /></p><p id="handoff-conversation" className="vp-citation-target">多智能体对话研究把消息和状态作为协作材料；实际应用仍要定义谁能结束、谁能转回以及怎样避免循环。<Cite id="handoff-conversation" sources={handoffSources} /><Cite id="handoff-loop" sources={handoffSources} /></p><p><strong>停止条件</strong>：接手者确认已有足够事实，或明确退回补充；在此之前不能用“已转交”冒充“已完成”。</p></ArticleSection>
  </Article>;
}
