import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { GuardrailGateHero } from "../ai-stack-lessons/ai-interaction-heroes";
import { guardrailSources } from "@/lib/ai-stack-concept-sources/guardrail";
import { GuardrailLesson } from "../ai-stack-lessons/guardrail";

export function GuardrailTermPage() {
  const sections: [string, string][] = [
    ["guardrail-question", "规则检查放在哪里"],
    ["guardrail-result", "命中后要有处置"],
    ["guardrail-failure-state", "检查器出错时也要停在可见状态"],
    ["guardrail-boundary", "护栏不是所有安全措施"],
  ];
  return <Article slug="guardrail" title="护栏" subtitle="Guardrail · 在输入、输出或动作前后检查规则" sources={guardrailSources} sections={sections} hero={<GuardrailGateHero />} intro={<>护栏是在流程某个边界执行的规则检查。它可以检查输入、模型输出或工具动作，然后放行、改写、拦截或转人工。它回答的是“这一处是否符合这条规则”，不能替代权限、内容分类、事实核对和业务校验。</>}>
    <ArticleSection id="guardrail-question" title="规则检查放在哪里">
      <p>导出客户表前，应用可以检查输出中的敏感字段；写入外部系统前，也可以检查工具参数。位置不同，阻断的对象就不同：输入护栏阻止危险请求进入，输出护栏改写或拒绝结果，工具护栏限制动作。先说清检查发生在哪个边界，读者才知道它能挡住什么、挡不住什么。</p>
      <p id="guardrail-check" className="vp-citation-target">OpenAI Agents SDK 把输入、输出和工具级 guardrail 分成不同阶段，阶段决定检查何时发生以及是否能阻止下一步。一个只检查最终文字的护栏，已经看不到模型之前提出过的工具参数。<Cite id="guardrail-check" sources={guardrailSources} /></p>
      <p id="guardrail-position" className="vp-citation-target">同一条规则也可以有不同落点：输入阶段拒绝带有危险目标的请求，工具阶段检查“是否准备把完整手机号导出”，输出阶段再确认最终回复没有泄露字段。重复检查不是为了让界面更复杂，而是因为每一层看到的对象不同。<Cite id="guardrail-position" sources={guardrailSources} /></p>
      <GuardrailLesson />
    </ArticleSection>

    <ArticleSection id="guardrail-result" title="命中后要有处置">
      <p id="guardrail-stage" className="vp-citation-target">命中规则后，系统要明确是放行、脱敏、拒绝还是转人工；“发现问题”本身不是处理结果。比如命中手机号可以把中间数字替换成星号，也可以完全关闭出口，两者都会改变后续数据，必须在审计记录中区分。<Cite id="guardrail-stage" sources={guardrailSources} /></p>
      <p id="guardrail-review" className="vp-citation-target">需要人工判断时，护栏可以把动作暂停交给审阅者，但批准仍要受具体调用和权限约束。人工批准了脱敏后的导出，不代表同一个用户可以随后下载原始表。<Cite id="guardrail-review" sources={guardrailSources} /><Cite id="guardrail-escalate" sources={guardrailSources} /></p>
      <p>处置还要带着原因返回：命中的字段、使用的规则版本、决定时间和是否经过人工。只显示“安全策略拒绝”会让用户无法修正请求，也让维护者不知道哪条规则误伤了正常内容。</p>
    </ArticleSection>

    <ArticleSection id="guardrail-failure-state" title="检查器出错时也要停在可见状态">
      <p id="guardrail-failure" className="vp-citation-target">如果检查服务超时、规则版本加载失败或返回无法解析的结果，系统不能把“没检查到”当成“检查通过”。对高影响动作，产品策略通常会选择暂停或拒绝；对低风险内容，也可以进入重试队列，但要明确告知当前没有完成检查。<Cite id="guardrail-failure" sources={guardrailSources} /></p>
      <p>演示里把脱敏和阻断都画成命中后的分支，是为了强调护栏不只会亮红灯。真正的实现还要处理重试和幂等：同一条导出请求不能因为检查器重试就写出两份文件，也不能把旧检查结果套到新输入上。</p>
    </ArticleSection>

    <ArticleSection id="guardrail-boundary" title="护栏不是所有安全措施">
      <p id="guardrail-risk" className="vp-citation-target">NIST 的生成式 AI 风险资料强调，风险管理要覆盖数据、输出、滥用和系统环境；一个字段规则不能保证模型或产品整体安全。护栏应说明自己的覆盖范围和失效条件，而不是把“通过”写成“安全”。<Cite id="guardrail-risk" sources={guardrailSources} /><Cite id="guardrail-scope" sources={guardrailSources} /></p>
      <p id="guardrail-govern" className="vp-citation-target">护栏应放进更大的识别、测量和管理流程中，和监控、测试、权限及事件响应一起工作。规则命中率、误报和绕过方式都需要持续回放，才能知道它是否真的减少了目标风险。<Cite id="guardrail-govern" sources={guardrailSources} /></p>
      <p id="guardrail-safety" className="vp-citation-target">安全建议把验证输入、限制输出和监测滥用分开考虑；权限决定“能不能访问”，内容审核回答“属于哪类风险”，护栏决定“这一处是否按规则继续”。<Cite id="guardrail-safety" sources={guardrailSources} /></p>
      <p><strong>判断方法</strong>：拿掉护栏后，哪一个具体动作会重新变得可能？如果说不出对象、触发条件和处置结果，护栏就还只是一个模糊的安全标签。</p>
    </ArticleSection>
  </Article>;
}
