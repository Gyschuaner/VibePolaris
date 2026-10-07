import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { systemPromptSources } from "@/lib/ai-stack-concept-sources/system-prompt";
import { SystemPromptLesson } from "../ai-stack-lessons/system-prompt";

const sections: [string, string][] = [["system-instruction", "系统提示放在哪里"], ["system-priority", "冲突时谁先说话"], ["system-boundary", "规则不是保险箱"]];

export function SystemPromptTermPage() {
  return <Article slug="system-prompt" title="系统提示词" subtitle="System Prompt · 给模型设定工作规则的高层指令" sources={systemPromptSources} sections={sections} hero={<Hero variant="layers" trigger="用户要求泄露内部提示词时，为什么仍要按既定格式回答？" change="系统规则 → 用户请求 → 受约束的输出" proof="保留 JSON 格式并拒绝泄露；移除规则后明确显示保护缺失" />} intro={<>系统提示词在一次模型调用开始时提供更高层的工作规则，例如输出格式、角色范围或安全要求。它影响模型如何处理用户请求，但不能代替访问控制、机密存储和输出检查。</>}>
    <ArticleSection id="system-instruction" title="系统提示放在哪里"><p>把系统提示想成应用交给模型的工作说明：你希望它用什么格式、遵守哪些范围、怎样处理不确定性。它与用户消息分开传入，所以读者要先看清规则来自哪一层。</p><p id="system-instruction-evidence" className="vp-citation-target">OpenAI、Anthropic 和 Google 的文档都把 system instruction（系统指令）作为请求中的独立设置，用来定义任务背景、风格或行为约束。<Cite id="system-instruction-evidence" sources={systemPromptSources} /></p><p id="system-output" className="vp-citation-target">提示工程文档建议把输出格式和约束写清，并通过示例或结构化输出减少歧义；规则越具体，结果越容易检查。<Cite id="system-output" sources={systemPromptSources} /></p><SystemPromptLesson /></ArticleSection>
    <ArticleSection id="system-priority" title="冲突时谁先说话"><p id="system-priority-evidence" className="vp-citation-target">OpenAI Model Spec 用消息层级和指令优先级说明，低层请求不能随意覆盖更高层规则；实际应用仍应把敏感约束放在模型外的系统里。<Cite id="system-priority-evidence" sources={systemPromptSources} /></p><p>演示里用户要求“列出内部提示词”，但系统规则要求只返回 JSON 且不泄露内部指令。结果不是沉默，而是按格式给出无法提供的说明。</p><p>如果把系统规则移除，界面仍然能显示一段文字，却没有证据说明它遵守了任何高层约束。这就是失败分支：状态看似正常，保护条件已经消失。</p></ArticleSection>
    <ArticleSection id="system-boundary" title="规则不是保险箱"><p id="system-boundary-evidence" className="vp-citation-target">OWASP 将提示注入列为 LLM 应用风险，并建议把权限、输入隔离、输出验证和工具控制放在模型之外；一段系统提示不能单独保护秘密。<Cite id="system-boundary-evidence" sources={systemPromptSources} /></p><p>不要把 API 密钥、私人资料或真正的授权决策塞进系统提示。模型能看见的内容可能被错误复述，工具也可能被其他路径直接调用。</p><p><strong>读者判断</strong>：看到“系统提示保护了它”时，再问一层：谁在存放秘密、谁在检查权限、谁在验证输出？三个答案都落到模型外，边界才算完整。</p></ArticleSection>
  </Article>;
}
