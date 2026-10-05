import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { leastPrivilegeSources } from "@/lib/least-privilege-sources";
import { LeastPrivilegeHero } from "./least-privilege-hero";
import { LeastPrivilegeLesson } from "./least-privilege";

const sections: [string, string][] = [
  ["least-privilege-definition-section", "先写任务，再列权限"],
  ["least-privilege-scope-section", "权限不是开关，是范围"],
  ["least-privilege-default-section", "拒绝默认，逐次检查"],
  ["least-privilege-review-section", "权限会长胖，要定期收回"],
];

export function LeastPrivilegeTermPage() {
  return <Article slug="least-privilege" title="最小权限" subtitle="Least Privilege · 只给完成这件事所需的那把钥匙" sources={leastPrivilegeSources} sections={sections} hero={<LeastPrivilegeHero />} intro={<>发布机器人只需要读代码、写一个版本，为什么要顺手拿组织管理员？<strong>最小权限把授权从“这个人是什么角色”拉回“这次任务需要什么动作、作用在哪个资源、能用多久”。</strong></>}>
    <ArticleSection id="least-privilege-definition-section" title="先写任务，再列权限">
      <p id="least-definition" className="vp-citation-target">最小权限是给主体完成当前任务所需的最低权限。OWASP 把它分成两个方向看：同一层级的不同主体可能要访问不同资源，层级更高的主体也不必自动拿到所有操作；权限要跟任务和资源一起写。<Cite id="least-definition" sources={leastPrivilegeSources} /></p>
      <p id="least-design" className="vp-citation-target">设计授权时，先列主体、资源和动作，再问每个组合是否真的需要。比如发布机器人需要读取构建输入、写入目标仓库的 release；“管理整个组织”只是一个方便的角色名，不能替代这张清单。OWASP 还建议把这些权限写成测试，确认设计上的允许和拒绝真的被执行。<Cite id="least-design" sources={leastPrivilegeSources} /></p>
      <p>这里的“最小”不是把权限削到任务无法完成。读不到构建产物，发布当然会失败；真正要删掉的是任务根本不需要的路。先保证任务能完整走通，再逐项问“这把钥匙能不能再短一点”。</p>
    </ArticleSection>
    <ArticleSection id="least-privilege-scope-section" title="权限不是开关，是范围">
      <p id="least-actions" className="vp-citation-target">一条授权至少要说清动作和资源。AWS 把最小权限写成“在特定资源和条件下只允许完成任务所需的动作”；同样是 <code>write</code>，写一个 release 分支和写整个组织，风险完全不同。<Cite id="least-actions" sources={leastPrivilegeSources} /></p>
      <p id="least-scope" className="vp-citation-target">资源范围还可以继续缩小。Google Cloud 建议把角色授予最小需要的范围，并把不同服务拆成不同的 service account；Kubernetes 的 Role 绑定在命名空间里，ClusterRole 才可能跨命名空间。把“哪里”写进授权，才不会让一个小任务顺手看见整片环境。<Cite id="least-scope" sources={leastPrivilegeSources} /></p>
      <p id="least-conditions" className="vp-citation-target">条件和时限也属于权限边界。AWS 文档给出用条件限制请求来源或调用方式的做法；首图把发布钥匙锁到 <code>repo/Vibe</code>，再加 30 分钟租约，展示的是同一动作在不同边界下的差别。<Cite id="least-conditions" sources={leastPrivilegeSources} /></p>
      <LeastPrivilegeLesson />
      <p id="least-boundary" className="vp-citation-target">边界还要留一层护栏。AWS 的 permissions boundary 可以限制被委派角色最多能得到什么，但它本身不会自动授予权限；上限、实际授权和资源策略仍要分开检查。<Cite id="least-boundary" sources={leastPrivilegeSources} /></p>
    </ArticleSection>
    <ArticleSection id="least-privilege-default-section" title="拒绝默认，逐次检查">
      <p id="least-deny" className="vp-citation-target">没有匹配规则时，系统仍然要做决定。OWASP 建议默认拒绝，让每一项允许都有理由；否则新增一个资源或漏写一条规则，就可能把“没想到”误当成“可以访问”。<Cite id="least-deny" sources={leastPrivilegeSources} /></p>
      <p id="least-verify" className="vp-citation-target">零信任架构把访问请求放回每次交易来判断：不能因为主体已经进过网络，后面的请求就自动获得信任。授权检查要在真正保护资源的一侧执行，前端按钮隐藏只能改善界面，不能作为安全边界。<Cite id="least-verify" sources={leastPrivilegeSources} /></p>
      <p>所以工作台把“删 production”留作越界尝试。机器人已经能完成发布，并不等于它有权删除生产数据；拒绝这一步，才证明授权边界真的在生效。</p>
    </ArticleSection>
    <ArticleSection id="least-privilege-review-section" title="权限会长胖，要定期收回">
      <p id="least-review" className="vp-citation-target">权限会随着临时排障、项目扩张和人员变动慢慢变宽。OWASP 把这种超过设计范围的累积叫 privilege creep，建议部署后定期复核；AWS 也建议根据 last accessed 信息清理不再使用的主体、权限和凭证。<Cite id="least-review" sources={leastPrivilegeSources} /></p>
      <p id="least-revoke" className="vp-citation-target">短期任务可以使用临时凭证或有期限的授权，但“到期”必须是系统状态，不是日历上的提醒。首图最后一帧把租约变成 expired，后续任务要重新申请，而不是继续借用上一轮钥匙。<Cite id="least-revoke" sources={leastPrivilegeSources} /></p>
      <p id="least-additive" className="vp-citation-target">还要留意权限模型本身的规则。Kubernetes RBAC 的规则是纯加法，没有 deny 规则；范围太大的 RoleBinding 一旦加上，就要从绑定关系或资源范围上收窄，不能期待另一条 deny 规则替你抵消它。<Cite id="least-additive" sources={leastPrivilegeSources} /></p>
      <p><strong>审查一把钥匙，可以按四个问题收口：</strong>它为了哪个任务存在；能对哪些资源做什么动作；哪些条件和时间会限制它；任务结束后谁会把它收回？答不出来的权限，通常已经脱离了原来的工作。</p>
    </ArticleSection>
  </Article>;
}
