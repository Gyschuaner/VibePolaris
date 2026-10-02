import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { toolApprovalSources } from "@/lib/ai-stack-concept-sources/tool-approval";
import styles from "../ConceptArticle.module.css";
import { ToolApprovalLesson } from "../ai-stack-lessons/tool-approval";

const approvalSections: [string, string][] = [["approval-need", "模型提出调用，不等于已经执行"], ["approval-card", "审批卡要显示完整范围"], ["approval-decision", "逐项批准、拒绝和暂停"], ["approval-boundary", "审批与权限不是同一层"]];
export function ToolApprovalTermPage() {
  const sources = toolApprovalSources;
  const Lesson = ToolApprovalLesson;
  return <Article slug="tool-approval" title="工具审批" subtitle="Tool Approval · 在高影响动作前暂停" sources={sources} sections={approvalSections} hero={<Hero trigger="AI 要删除三个文件，我能只批准其中两个吗？" change="拟调用 → 暂停 → 逐项决定 → 执行" proof="批准 2 项、拒绝 1 项，拒绝项没有副作用" />} intro={<>工具审批把高影响工具调用停在真正执行之前，把工具名、完整参数、影响范围和授权人交给审查者决定。它不是一句“是否继续”的弹窗，也不是把一次批准泛化成所有后续动作的通行证。</>}>
    <ArticleSection id="approval-need" title="模型提出调用，不等于已经执行"><p>模型输出 <code>delete_file</code> 调用时，文件还没有被删除。执行器先把调用变成待审批项，只有批准后才继续。把“模型说了什么”和“系统做了什么”分开，是理解审批的第一步。</p><p id="approval-pause" className="vp-citation-target">OpenAI Agents SDK 的 human-in-the-loop 流程会把需要审批的工具调用变成 interruption，运行暂停，审查者 approve 或 reject 后再恢复。<Cite id="approval-pause" sources={sources} /></p><p id="approval-tool" className="vp-citation-target">工具可以声明哪些调用需要审批，应用也可以根据参数决定；解析参数失败时应默认停下，而不是猜测授权范围。<Cite id="approval-tool" sources={sources} /></p><Lesson /></ArticleSection>
    <ArticleSection id="approval-card" title="审批卡要显示完整范围" className={styles.splitSection}><p id="approval-mcp" className="vp-citation-target">MCP 工具规范建议客户端（调用工具的应用）让用户能拒绝调用、在敏感操作前确认，并展示工具输入、验证结果和审计信息。<Cite id="approval-mcp" sources={sources} /></p><p>本页每个文件都显示完整路径和可恢复性：A、B 可以恢复，C 不可恢复。只有看到这些参数，审查者才知道批准会影响什么。</p><p>审批卡还要绑定调用者、调用 ID 和参数摘要。审批等待期间不能显示“完成”，过期或参数被改动时，旧决定应失效。</p></ArticleSection>
    <ArticleSection id="approval-decision" title="逐项批准、拒绝和暂停"><p id="approval-decide" className="vp-citation-target">OpenAI 的运行状态把批准决定与具体工具调用关联，允许同一批待处理项部分解决；未解决的项目继续保持暂停。<Cite id="approval-decide" sources={sources} /></p><p id="approval-server" className="vp-citation-target">对于 MCP 服务器，审批配置可以按工具或服务器设定，但应用仍要在服务端校验参数和授权，不能只信客户端展示。<Cite id="approval-server" sources={sources} /></p><p>演示中勾选 A、B 后执行计数为 2，C 保持未改变。这个结果是审批范围的证据；“用户点过确认”本身不是执行证据。</p></ArticleSection>
    <ArticleSection id="approval-boundary" title="审批与权限不是同一层"><p id="approval-control" className="vp-citation-target">MCP 把工具视为模型可控制的执行函数；安全的客户端和服务器都要考虑用户控制、输入校验、访问控制与限流。<Cite id="approval-control" sources={sources} /></p><p>审批回答“这一次是否允许继续”，权限边界回答“这个主体最多能访问什么”，身份认证回答“批准的人是谁”。三者必须组合，不能用一个弹窗替代全部安全控制。</p><p><strong>停止条件</strong>：审查者看到完整参数后做出明确决定；拒绝或超时没有副作用；执行记录能说明批准了哪些项、实际执行了哪些项。</p></ArticleSection>
  </Article>;
}
