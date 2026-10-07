import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { permissionBoundarySources } from "@/lib/ai-stack-concept-sources/permission-boundary";
import { PermissionBoundaryLesson } from "../ai-stack-lessons/permission-boundary";

const sections: [string, string][] = [["permission-need", "提示词不是权限边界"], ["permission-policy", "策略怎样形成有效权限"], ["permission-deny", "越界请求在资源前被挡住"]];

export function PermissionBoundaryTermPage() {
  return <Article slug="permission-boundary" title="权限边界" subtitle="Permission Boundary · 在资源访问处强制校验" sources={permissionBoundarySources} sections={sections} hero={<Hero variant="gate" trigger="只有 read:sales，为什么 read:salary 必须返回 0 行？" change="主体 + 动作 + 资源 → 策略强制判定" proof="越界请求被拒绝并审计，明确授权后才放行" />} intro={<>权限边界规定某个身份、进程或工具最多能访问哪些资源、执行哪些动作，并在真实资源访问处强制检查。提示词和审批界面可以辅助决策，却不能单独保护工资表这样的敏感资源。</>}>
    <ArticleSection id="permission-need" title="提示词不是权限边界"><p>你可以在报表工具的提示里写“不要读取工资数据”，但如果令牌仍然拥有工资表权限，换一个提示词或直接调用 API 就可能越过这句话。边界必须存在于模型外。</p><p id="permission-least" className="vp-citation-target">NIST 对最小权限的定义是，只给用户或进程完成任务所需的最小资源和授权；多出来的权限会扩大错误和滥用的影响范围。<Cite id="permission-least" sources={permissionBoundarySources} /></p><p id="permission-role" className="vp-citation-target">RBAC 把用户分配给角色，再由角色关联权限；角色名称、令牌 scope 和资源策略是不同层次，不能把名称当成最终允许结果。<Cite id="permission-role" sources={permissionBoundarySources} /></p><PermissionBoundaryLesson /></ArticleSection>
    <ArticleSection id="permission-policy" title="策略怎样形成有效权限"><p id="permission-enforce" className="vp-citation-target">OWASP 的授权建议枚举主体、资源和操作组合，并在每次请求验证具体对象，而不是只验证“用户属于某个大类”。<Cite id="permission-enforce" sources={permissionBoundarySources} /></p><p id="permission-policy-definition" className="vp-citation-target">属性策略可以把主体、资源属性和环境条件组合起来；有效权限通常由授予、边界限制和显式拒绝共同计算。<Cite id="permission-policy-definition" sources={permissionBoundarySources} /></p><p>演示中的最小令牌只有 <code>read:sales</code>。勾选 <code>read:salary</code> 改变的是模型外的授权状态，不是把一个按钮从隐藏改成显示。</p></ArticleSection>
    <ArticleSection id="permission-deny" title="越界请求在资源前被挡住"><p id="permission-protocol" className="vp-citation-target">MCP 授权规范要求资源服务器验证令牌、受众和 scope；缺少凭据与权限不足需要留下可区分的失败结果。<Cite id="permission-protocol" sources={permissionBoundarySources} /></p><p>当工具请求 <code>read:salary</code> 时，策略返回 deny，工资表没有被读取，审计事件记录主体、资源和动作。显示“0 行”只是结果的一部分，拒绝原因和审计记录才说明边界真的生效。</p><p>授权增加后仍要有范围、期限和复核。工具审批可以决定这一次是否继续，但不能变成永久授权；同样，权限拒绝也不能靠再弹一个含糊确认框解决。</p><p><strong>读者判断</strong>：你能指出身份声明、策略匹配、资源读取和审计分别发生在哪里吗？如果只能指出提示词，边界还没有落到执行层。</p></ArticleSection>
  </Article>;
}
