import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { subagentSources } from "@/lib/ai-stack-concept-sources/subagent";
import { SubagentLesson } from "../ai-stack-lessons/subagent";

export function SubagentTermPage() {
  const sections: [string, string][] = [["subagent-question", "只分出可验收的工作"], ["subagent-return", "结果回到主线"], ["subagent-boundary", "和交接、编排分开"]];
  return <Article slug="subagent" title="子智能体" subtitle="Subagent · 在主任务旁完成一块可验收的工作" sources={subagentSources} sections={sections} hero={<Hero trigger="主报告只缺价格核对，为什么不把整段对话交出去？" change="主任务 → 独立支线 → 带状态返回 → 主线验收" proof="主智能体保留最终回复，缺来源的价格留在缺口里" />} intro={<>子智能体是主智能体分派出来、边界清楚且能独立验收的一块工作。完成后它把结果回传主线，由主智能体检查、合并或拒绝；最终回复权通常仍在主智能体。</>}>
    <ArticleSection id="subagent-question" title="只分出可验收的工作"><p>主报告要比较三个方案，其中“核对价格”可以单独交给子智能体。主智能体给它三个指定 URL、要找的价格字段和返回格式；子智能体不需要接管整段对话，也不应该自己修改最终报告。</p><p id="subagent-definition" className="vp-citation-target">OpenAI 的编排模式把“专家作为工具”与“交接给专家”区分开：前者让管理者保留对话控制，适合边界清楚的子任务。<Cite id="subagent-definition" sources={subagentSources} /></p><SubagentLesson /></ArticleSection>
    <ArticleSection id="subagent-return" title="结果回到主线"><p id="subagent-merge" className="vp-citation-target">子任务结果应该带着状态、来源和缺口返回；主智能体收到后还要决定是否满足报告的验收条件。<Cite id="subagent-merge" sources={subagentSources} /></p><p id="subagent-tool" className="vp-citation-target">把智能体作为工具调用时，主线可以把它当成一个有输入和输出的步骤，而不是把内部过程当成已验证事实。<Cite id="subagent-tool" sources={subagentSources} /></p><p>演示里返回“2 个有效价格、1 个缺失”，主智能体会把缺口保留下来；这比补一个看似完整但没有来源的数字更可靠。运行器仍要记录子任务的完成、失败和停止状态，不能只看最后一段文字。<Cite id="subagent-run" sources={subagentSources} /></p></ArticleSection>
    <ArticleSection id="subagent-boundary" title="和交接、编排分开"><p id="subagent-specialist" className="vp-citation-target">专门智能体能把任务边界变窄，但不能自动消除协调成本；Anthropic 建议先判断固定工作流、单一智能体和多智能体哪一种足够。<Cite id="subagent-specialist" sources={subagentSources} /></p><p id="subagent-conversation" className="vp-citation-target">多智能体系统通过消息协作，但“子智能体”强调主线分派、回收和验收；交接强调回复权移动，编排强调多个步骤之间的依赖。<Cite id="subagent-conversation" sources={subagentSources} /></p><p><strong>不该分派的情况</strong>：任务边界无法写清、结果没有验收条件，或一个固定函数就能安全完成时，增加子智能体只会让责任更模糊。</p></ArticleSection>
  </Article>;
}
