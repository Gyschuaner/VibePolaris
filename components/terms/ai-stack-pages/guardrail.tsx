import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { guardrailSources } from "@/lib/ai-stack-concept-sources/guardrail";
import { GuardrailLesson } from "../ai-stack-lessons/guardrail";

export function GuardrailTermPage() {
  const sections: [string, string][] = [["guardrail-question", "规则检查放在哪里"], ["guardrail-result", "命中后要有处置"], ["guardrail-boundary", "护栏不是所有安全措施"]];
  return <Article slug="guardrail" title="护栏" subtitle="Guardrail · 在输入、输出或动作前后检查规则" sources={guardrailSources} sections={sections} hero={<Hero trigger="导出客户表时命中 12 个手机号字段，护栏怎样处理？" change="数据进入 → 规则检查 → 脱敏/阻断 → 交付" proof="敏感字段变成后四位，完整号码没有进入输出" />} intro={<>护栏是在流程某个边界执行的规则检查。它可以检查输入、模型输出或工具动作，然后放行、改写、拦截或转人工。它只负责声明的检查范围，不能替代权限、内容分类和业务校验。</>}>
    <ArticleSection id="guardrail-question" title="规则检查放在哪里"><p>导出客户表前，应用可以检查输出中的敏感字段；写入外部系统前，也可以检查工具参数。位置不同，阻断的对象就不同：输入护栏阻止危险请求进入，输出护栏改写或拒绝结果，工具护栏限制动作。</p><p id="guardrail-check" className="vp-citation-target">OpenAI Agents SDK 把输入、输出和工具级 guardrail 分成不同阶段，阶段决定检查何时发生以及是否能阻止下一步。<Cite id="guardrail-check" sources={guardrailSources} /></p><GuardrailLesson /></ArticleSection>
    <ArticleSection id="guardrail-result" title="命中后要有处置"><p id="guardrail-stage" className="vp-citation-target">命中规则后，系统要明确是放行、脱敏、拒绝还是转人工；“发现问题”本身不是处理结果。检查器不可用时也应有失败状态，不能默认放行。<Cite id="guardrail-stage" sources={guardrailSources} /></p><p id="guardrail-review" className="vp-citation-target">需要人工判断时，护栏可以把动作暂停交给审阅者，但批准仍要受具体调用和权限约束。<Cite id="guardrail-review" sources={guardrailSources} /></p></ArticleSection>
    <ArticleSection id="guardrail-boundary" title="护栏不是所有安全措施"><p id="guardrail-risk" className="vp-citation-target">NIST 的生成式 AI 风险资料强调，风险管理要覆盖数据、输出、滥用和系统环境；一个字段规则不能保证模型或产品整体安全。<Cite id="guardrail-risk" sources={guardrailSources} /></p><p id="guardrail-govern" className="vp-citation-target">护栏应放进更大的识别、测量和管理流程中，和监控、测试、权限及事件响应一起工作。<Cite id="guardrail-govern" sources={guardrailSources} /></p><p id="guardrail-safety" className="vp-citation-target">OpenAI 的安全建议把验证输入、限制输出和监测滥用视为不同措施；权限决定“能不能访问”，护栏决定“这一处是否符合规则”。<Cite id="guardrail-safety" sources={guardrailSources} /></p></ArticleSection>
  </Article>;
}
