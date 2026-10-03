import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { PreviewDeploymentLesson } from "../git-workflow-lessons/preview-deployment";
import { previewDeploymentSources } from "@/lib/git-concept-sources/preview-deployment";

const sections: [string, string][] = [
  ["preview-trigger", "先把一个提交放进临时环境"],
  ["preview-url", "评审者怎样确认自己看到的版本"],
  ["preview-lifecycle", "预览环境的边界与回收"],
];

export function PreviewDeploymentTermPage() {
  return <GitArticle
    slug="preview-deployment"
    title="预览部署"
    subtitle="Preview Deployment · 合并前先让真实提交在临时环境里可访问"
    sources={previewDeploymentSources}
    sections={sections}
    hero={<GitHero contextLabel="先锁定提交" contextTitle="PR #18 · F4" trigger="代码还没合并，设计和产品怎样先看到当前页面？" change="PR → build F4 → preview URL" proof="F4 预览；M9 生产不变" />}
    intro={<>预览部署把一个已经推送的分支或拉取请求提交，构建到一个独立的临时地址。评审者可以直接打开页面、跑一遍关键交互，再把意见和检查结果留在同一个 PR 里；合并前的体验因此有了和提交对应的运行证据。</>}
  >
    <ArticleSection id="preview-trigger" title="先把一个提交放进临时环境">
      <p id="preview-trigger-event" className="vp-citation-target">常见的预览部署由非生产分支的 push、拉取请求或手动命令触发。平台读取这次事件指向的提交，创建一次非生产构建；事件只是让构建排队，构建尚未完成时不能把它说成“预览已通过”。<Cite id="preview-trigger-event" sources={previewDeploymentSources} /></p>
      <p id="preview-isolation" className="vp-citation-target">临时环境应有自己的环境变量、测试数据和第三方连接。预览需要验证页面和交互时，可以连接沙箱服务；把支付、邮件或生产数据库凭据原样带进来，会让“合并前检查”变成一次未经授权的真实操作。<Cite id="preview-isolation" sources={previewDeploymentSources} /></p>
      <PreviewDeploymentLesson />
    </ArticleSection>

    <ArticleSection id="preview-url" title="评审者怎样确认自己看到的版本">
      <p id="preview-url-output" className="vp-citation-target">部署完成后，平台通常会生成带分支或提交信息的 URL，并把它写回 PR 评论或部署检查。分支地址会随着后续 push 指向最新提交；需要复现旧画面时，应保存提交固定链接，而不是只复制会变化的分支地址。<Cite id="preview-url-output" sources={previewDeploymentSources} /></p>
      <p id="preview-pr-status" className="vp-citation-target">PR 状态把“构建是否完成”和“评审者是否能打开”放在同一处。状态通过只说明这次部署的约定检查完成，仍要看页面实际行为、数据是否为沙箱，以及当前链接对应的是哪个提交。<Cite id="preview-pr-status" sources={previewDeploymentSources} /></p>
      <p id="preview-fork-security" className="vp-citation-target">来自 fork 的 PR 还要单独判断授权：平台可能阻止它读取项目密钥或 OIDC 凭据，直到维护者批准。这个限制保护的是仓库秘密，不是把陌生代码自动变成可信代码；预览脚本本身仍需按不可信输入审查。<Cite id="preview-fork-security" sources={previewDeploymentSources} /></p>
    </ArticleSection>

    <ArticleSection id="preview-lifecycle" title="预览环境的边界与回收">
      <p id="preview-cleanup" className="vp-citation-target">预览环境通常会在 PR 关闭后自动删除，也可以由平台或维护者手动清理。回收释放的是临时计算资源和访问地址，不会撤销已经写入外部系统的副作用；因此测试数据和第三方调用仍应设计成可重复、可清理的沙箱行为。<Cite id="preview-cleanup" sources={previewDeploymentSources} /></p>
      <p id="preview-access" className="vp-citation-target">如果页面包含未公开信息，预览地址可以要求登录、密码或其他部署保护。访问控制要同时覆盖评审者和自动化检查：把 URL 贴进 PR 不等于任何拿到链接的人都应该看到内容。<Cite id="preview-access" sources={previewDeploymentSources} /></p>
      <p id="preview-production-boundary" className="vp-citation-target">预览通过只能回答“这次提交在临时条件下能运行并可供检查”。生产域名、生产配置、真实流量和上线后的健康检查仍属于另一个部署边界；合并或发布时要重新确认环境变量、数据库兼容和核心流程。<Cite id="preview-production-boundary" sources={previewDeploymentSources} /></p>
      <p><strong>读者判断：</strong>看到一个预览链接时，先核对它对应的提交、使用的数据和访问保护，再决定它能支持哪一种结论。关闭 PR 后链接失效是生命周期的一部分，不是提交内容被撤销。</p>
    </ArticleSection>
  </GitArticle>;
}
