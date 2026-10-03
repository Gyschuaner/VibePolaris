import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { cdSources } from "@/lib/git-concept-sources/cd";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["cd-artifact", "先把可发布版本固定下来"],
  ["cd-environment", "同一制品怎样经过环境"],
  ["cd-approval", "生产闸门控制什么风险"],
];

export function CdTermPage() {
  return <GitArticle
    slug="cd"
    title="持续交付"
    subtitle="Continuous Delivery · 让通过验证的版本随时处于可发布状态"
    sources={cdSources}
    sections={sections}
    hero={<GitHero contextLabel="先锁定版本" contextTitle="artifact #42" trigger="测试通过后，怎样确保 staging 验证的就是将要发布到生产的版本？" change="构建一次 → 提升同一制品 → 环境门禁 / 审批" proof="生产使用已验证的 artifact #42；重新构建会得到另一份待验证版本" />}
    intro={<>持续交付（CD）把构建、测试、制品保存和环境提升连成可重复的路径，让团队在需要时可以发布。它通常保留生产环境的审批或显式触发；持续部署则把这一步也自动化，二者的差别在于生产发布是否仍有控制闸门。</>}
  >
    <ArticleSection id="cd-artifact" title="先把可发布版本固定下来">
      <p id="cd-artifact-output" className="vp-citation-target">工作流产出的 artifact 是一次运行生成的文件或文件集合，可以在 job 完成后保存，并被同一工作流的其他 job 下载使用。把构建输出作为制品交给后续环境，测试和发布就能指向同一份文件，而不是每到一个环境再临时打包。<Cite id="cd-artifact-output" sources={cdSources} /></p>
      <p id="cd-share" className="vp-citation-target">制品适合保存构建结果、测试输出和可部署文件；依赖缓存解决的是复用不变的中间文件，两者不能互相替代。教学中的 <code>artifact #42</code> 和摘要只是这一次构建的身份标签，真正系统应保留能追溯到提交、工作流运行和制品的记录。<Cite id="cd-share" sources={cdSources} /></p>
      <GitWorkflowLesson slug="cd" />
    </ArticleSection>

    <ArticleSection id="cd-environment" title="同一制品怎样经过环境">
      <p id="cd-environments" className="vp-citation-target">GitHub Actions 用 environment 表示 development、staging 或 production 等部署目标。引用 environment 的 job 必须先通过该环境配置的保护规则，才能运行并读取环境 secrets；因此“进入 staging”既是一次部署动作，也是一次权限和条件检查。<Cite id="cd-environments" sources={cdSources} /></p>
      <p id="cd-protection" className="vp-citation-target">保护规则可以限制允许部署的分支、等待一段时间或要求外部规则通过。它们控制的是这个 job 什么时候能继续，不会把一个未经构建的文件自动变成已经验证的制品。<Cite id="cd-protection" sources={cdSources} /></p>
      <p id="cd-history" className="vp-citation-target">部署到 environment 后，仓库会留下环境和部署历史，便于把“哪个版本、何时、由哪次工作流推到哪里”连起来。若 staging 通过后重新 build，生产得到的是另一份制品，原来的验证证据不能直接沿用。<Cite id="cd-history" sources={cdSources} /></p>
    </ArticleSection>

    <ArticleSection id="cd-approval" title="生产闸门控制什么风险">
      <p id="cd-approval-gate" className="vp-citation-target">配置 required reviewers 的 production job 会停在 Waiting，直到允许的评审者批准或拒绝。批准只让已绑定的部署 job 继续，并不替代 CI、冒烟检查、数据迁移评估或回滚准备。<Cite id="cd-approval-gate" sources={cdSources} /></p>
      <p>所以持续交付的结果是“版本随时可发布、发布步骤可重复、生产动作有记录和控制”，而不是“任何绿灯都自动上线”。是否把最后闸门也自动打开，要根据环境风险、组织规则和故障处置能力单独决定。</p>
      <p><strong>读者判断：</strong>检查发布流程时，先追问制品在哪里生成、每个环境是否使用同一份、生产前谁或什么规则能阻止它继续，以及失败后怎样找到对应版本。</p>
    </ArticleSection>
  </GitArticle>;
}
