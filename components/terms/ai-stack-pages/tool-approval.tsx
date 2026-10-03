import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { toolApprovalSources } from "@/lib/ai-stack-concept-sources/tool-approval";
import { ToolApprovalLesson } from "../ai-stack-lessons/tool-approval";

const sections: [string, string][] = [["approval-pause", "先停在执行之前"], ["approval-card", "审批卡要让范围可见"], ["approval-decision", "一次决定只覆盖一次调用"]];

export function ToolApprovalTermPage() {
  return <Article slug="tool-approval" title="工具审批" subtitle="Tool Approval · 在高影响动作前暂停" sources={toolApprovalSources} sections={sections} hero={<Hero trigger="AI 要删除三个文件，我能只批准其中两个吗？" change="拟调用 → 暂停 → 逐项决定 → 执行" proof="批准 2 项、拒绝 1 项，拒绝项没有副作用" />} intro={<>工具审批把高影响工具调用停在真正执行之前，让授权人看到工具、参数和影响范围，再决定这一次是否继续。它不是一句含糊的“是否继续”，也不会自动扩大成永久权限。</>}>
    <ArticleSection id="approval-pause" title="先停在执行之前"><p>模型输出 <code>delete_file</code> 时，执行器还没有碰磁盘。系统先把调用记为待处理，再把它交给人或策略决定。把“提出调用”和“执行动作”分开，是审批存在的理由。</p><p id="approval-pause" className="vp-citation-target">OpenAI Agents SDK 的 human-in-the-loop 流程会把需要批准的工具调用变成 interruption，运行暂停，批准或拒绝后才恢复。<Cite id="approval-pause" sources={toolApprovalSources} /></p><p id="approval-tool" className="vp-citation-target">工具可以声明哪些调用需要审批，应用也可以依据参数和风险决定；解析参数失败时应继续暂停，而不是把缺失信息当成授权。<Cite id="approval-tool" sources={toolApprovalSources} /></p><ToolApprovalLesson /></ArticleSection>
    <ArticleSection id="approval-card" title="审批卡要让范围可见"><p id="approval-mcp" className="vp-citation-target">MCP 工具规范要求客户端在敏感操作前让用户确认，并展示工具输入、验证结果等信息；审批者需要看到具体参数，而不是只看到一个工具名。<Cite id="approval-mcp" sources={toolApprovalSources} /></p><p>演示把 A、B 标成可恢复，把 C 标成不可恢复，并显示完整路径。这样“批准 A、B”才有确定范围，过期或参数被改动时旧决定应失效。</p><p id="approval-authorization" className="vp-citation-target">授权规范把令牌验证和访问范围放在资源服务器一侧；审批卡可以帮助人做决定，却不能替服务器验证身份和权限。<Cite id="approval-authorization" sources={toolApprovalSources} /></p></ArticleSection>
    <ArticleSection id="approval-decision" title="一次决定只覆盖一次调用"><p id="approval-decide" className="vp-citation-target">Agents SDK 把决定和具体工具调用关联，允许同一批待处理项部分解决；未批准项仍然保持暂停。<Cite id="approval-decide" sources={toolApprovalSources} /></p><p id="approval-server" className="vp-citation-target">MCP 集成仍需要服务器或执行器校验输入、身份和资源权限，不能只信客户端展示的审批状态。<Cite id="approval-server" sources={toolApprovalSources} /></p><p><strong>停止条件</strong>：授权人能说出批准了哪些项；拒绝、超时和参数变化都没有副作用；审计记录能把决定与实际执行一一对应。</p></ArticleSection>
  </Article>;
}
