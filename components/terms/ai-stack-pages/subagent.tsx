import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { subagentSources } from "@/lib/ai-stack-concept-sources/subagent";
import { SubagentLesson } from "../ai-stack-lessons/subagent";
import { SubagentContractHero } from "../ai-stack-lessons/signature-heroes";

export function SubagentTermPage() {
  const sections: [string, string][] = [
    ["subagent-question", "只分出可验收的工作"],
    ["subagent-contract", "先把支线的输入写清楚"],
    ["subagent-return", "结果回到主线"],
    ["subagent-boundary", "和交接、编排分开"],
  ];
  return <Article slug="subagent" title="子智能体" subtitle="Subagent · 在主任务旁完成一块可验收的工作" sources={subagentSources} sections={sections} hero={<SubagentContractHero />} intro={<>子智能体是主智能体分派出来、边界清楚且能独立验收的一块工作。完成后它把结果回传主线，由主智能体检查、合并或拒绝；最终回复权通常仍在主智能体。它不是“再开一个聊天窗口”，而是一份有输入契约和交付状态的临时支线。</>}>
    <ArticleSection id="subagent-question" title="只分出可验收的工作">
      <p>主报告要比较三个方案，其中“核对价格”可以单独交给子智能体。主智能体给它三个指定 URL、要找的价格字段和返回格式；子智能体不需要接管整段对话，也不应该自己修改最终报告。这样拆分的好处是让主线继续处理结构和取舍，支线只负责一件能被复核的事。</p>
      <p id="subagent-definition" className="vp-citation-target">OpenAI 的编排模式把“专家作为工具”与“交接给专家”区分开：前者让管理者保留对话控制，适合边界清楚的子任务。<Cite id="subagent-definition" sources={subagentSources} />如果主线仍要比较所有方案，就不应把最终回复权一起交出去。</p>
      <SubagentLesson />
    </ArticleSection>

    <ArticleSection id="subagent-contract" title="先把支线的输入写清楚">
      <p>一个可验收的分派至少说明目标对象、允许使用的资料、要返回的字段、截止条件和不能做的事。“查价格”太宽，“只看这三个官网的月费，返回币种、含税说明、页面标题和链接，找不到就写缺失”才足够具体。</p>
      <p>输入范围也决定风险范围。给支线整段用户历史，它可能把不相关的私人信息带进返回结果；只给必要的 URL 和字段，主线更容易解释它看了什么、没有看什么。</p>
      <p>输出契约最好是结构化的：每个数值附来源和抓取时间，每个缺口有原因，每个失败有状态。自由文本可以作为补充说明，却不应成为主线判断“能不能合并”的唯一依据。</p>
    </ArticleSection>

    <ArticleSection id="subagent-return" title="结果回到主线">
      <p id="subagent-merge" className="vp-citation-target">子任务结果应该带着状态、来源和缺口返回；主智能体收到后还要决定是否满足报告的验收条件。<Cite id="subagent-merge" sources={subagentSources} />“返回了文字”不等于“通过验收”，主线仍要检查字段是否齐全、来源是否可打开、时间是否有效。</p>
      <p id="subagent-tool" className="vp-citation-target">把智能体作为工具调用时，主线可以把它当成一个有输入和输出的步骤，而不是把内部过程当成已验证事实。<Cite id="subagent-tool" sources={subagentSources} />主线只接收约定的结果接口，必要时要求支线补证据或重新查询。</p>
      <p id="subagent-run" className="vp-citation-target">演示里返回“2 个有效价格、1 个缺失”，主智能体会把缺口保留下来；这比补一个看似完整但没有来源的数字更可靠。运行器仍要记录子任务的完成、失败和停止状态，不能只看最后一段文字。<Cite id="subagent-run" sources={subagentSources} /></p>
      <p>如果支线超时，主线应把它当成未完成的依赖，决定重试、换资料或交付缺口。把超时当成空字符串，会让后面的摘要看起来完整，实际却掩盖了未完成的核对。</p>
    </ArticleSection>

    <ArticleSection id="subagent-boundary" title="和交接、编排分开">
      <p id="subagent-specialist" className="vp-citation-target">专门智能体能把任务边界变窄，但不能自动消除协调成本；Anthropic 建议先判断固定工作流、单一智能体和多智能体哪一种足够。<Cite id="subagent-specialist" sources={subagentSources} />一个确定的价格换算，普通函数往往比再开一个模型更可预测。</p>
      <p id="subagent-conversation" className="vp-citation-target">多智能体系统通过消息协作，但“子智能体”强调主线分派、回收和验收；交接强调回复权移动，编排强调多个步骤之间的依赖。<Cite id="subagent-conversation" sources={subagentSources} />三者都可以同时出现，却不能用同一个词掩盖责任归属。</p>
      <p><strong>不该分派的情况</strong>：任务边界无法写清、结果没有验收条件，或一个固定函数就能安全完成时，增加子智能体只会让责任更模糊。先把验收表写出来，再判断是否值得承担一次额外模型调用。</p>
    </ArticleSection>
  </Article>;
}
