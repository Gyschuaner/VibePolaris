import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { permissionBoundarySources } from "@/lib/ai-stack-concept-sources/permission-boundary";
import styles from "../ConceptArticle.module.css";
import { PermissionBoundaryLesson } from "../ai-stack-lessons/permission-boundary";

const permissionSections: [string, string][] = [["permission-need", "提示词不是权限边界"], ["permission-policy", "策略怎样形成有效权限"], ["permission-deny", "越界请求在资源前被挡住"], ["permission-boundary", "最小权限与审计"]];
export function PermissionBoundaryTermPage() {
  const sources = permissionBoundarySources;
  const Lesson = PermissionBoundaryLesson;
  return <Article slug="permission-boundary" title="权限边界" subtitle="Permission Boundary · 在资源访问处强制校验" sources={sources} sections={permissionSections} hero={<Hero trigger="只有 read:sales，为什么 read:salary 必须返回 0 行？" change="主体 + 动作 + 资源 → 策略强制判定" proof="越界请求被拒绝并审计，明确授权后才放行" />} intro={<>权限边界规定身份、进程或工具最多能访问哪些资源、执行哪些动作，并在实际资源访问处强制检查。提示词、按钮文案和审批界面可以辅助决策，却不能单独保护工资表这样的敏感资源。</>}>
    <ArticleSection id="permission-need" title="提示词不是权限边界"><p>你给报表工具写了“不要读取工资数据”，但它拿到的令牌仍然包含对工资表的访问能力。只要执行层没有检查，换一个提示词或模型输出就可能越过这句话。</p><p id="permission-least" className="vp-citation-target">NIST 对最小权限的定义是，只给用户或进程完成任务所需的最小资源和授权；权限必须在真实访问处强制检查。<Cite id="permission-least" sources={sources} /></p><p id="permission-role" className="vp-citation-target">RBAC 把用户分配给角色，再由角色关联权限；这说明角色、令牌 scope（令牌携带的权限范围）和资源策略是不同层次，不能把名称当成最终允许结果。<Cite id="permission-role" sources={sources} /></p><Lesson /></ArticleSection>
    <ArticleSection id="permission-policy" title="策略怎样形成有效权限" className={styles.splitSection}><p id="permission-enforce" className="vp-citation-target">OWASP 的授权建议在设计阶段枚举主体、资源和操作组合，并在每次请求上验证具体对象，而不是只验证“用户属于某个大类”。<Cite id="permission-enforce" sources={sources} /></p><p id="permission-policy-definition" className="vp-citation-target">属性策略可以把角色、资源属性和环境条件组合起来；有效权限通常是授予策略、边界限制和显式拒绝共同计算的结果。<Cite id="permission-policy-definition" sources={sources} /></p><p>演示中最小令牌只有 <code>read:sales</code>，策略匹配成功后才返回销售数据。勾选 <code>read:salary</code> 不是隐藏一个按钮，而是改变了模型外的授权状态。</p></ArticleSection>
    <ArticleSection id="permission-deny" title="越界请求在资源前被挡住"><p id="permission-protocol" className="vp-citation-target">MCP 的授权规范要求资源服务器验证令牌、受众和 scope；缺少凭据与权限不足分别产生不同的授权失败结果。<Cite id="permission-protocol" sources={sources} /></p><p>当工具请求 <code>read:salary</code> 时，策略层返回 deny，工资表没有被读取，审计事件记录了主体、资源和请求动作。这个“0 行”比界面显示“无结果”更能证明边界已经生效。</p><p>如果权限检查只在 UI 做，直接调用 API 就会绕过它；如果只在模型提示里做，提示注入或模型错误就会把约束带走。边界必须靠执行层和资源层共同守住。</p></ArticleSection>
    <ArticleSection id="permission-boundary" title="最小权限与审计"><p>授权增加后也要有范围、期限和审计。长期拥有工资读取能力会产生权限蔓延；短期 token、受众绑定和定期复核能让边界更接近真实任务。</p><p>工具审批可以决定某一次读工资是否继续，但它不应成为永久授权；同样，权限边界拒绝调用也不代表需要再弹一个没有解释的确认框。</p><p><strong>停止条件</strong>：你能指出身份声明、策略匹配和实际资源读取各发生在哪里，并能解释拒绝时返回什么证据、授权后怎样留下记录。</p></ArticleSection>
  </Article>;
}
