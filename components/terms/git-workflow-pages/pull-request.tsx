import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { pullRequestSources } from "@/lib/git-concept-sources/pull-request";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["pr-meaning", "PR 把源分支的改动变成可讨论的提案"],
  ["pr-review", "差异、讨论和检查围绕同一对象更新"],
  ["pr-merge", "满足门禁后才把结果写入目标分支"],
];

export function PullRequestTermPage() {
  return <GitArticle
    slug="pull-request"
    title="拉取请求"
    subtitle="Pull Request · 让一组分支改动进入可评审、可合并的协作流程"
    sources={pullRequestSources}
    sections={sections}
    hero={<GitHero trigger="功能分支写完，怎样让别人看到差异、检查证据，并决定能否并入 main？" change="source feature → compare main → review + checks → merge" proof="PR 收集讨论与状态；main 只有在满足条件后才变化" />}
    intro={<>Pull request 是托管平台上的协作对象：它把源分支和目标分支的比较、提交、评论、审批与自动检查放到同一条记录里。创建 PR 只是提出合并请求，目标分支不会因为这一步自动改变。</>}
  >
    <ArticleSection id="pr-meaning" title="PR 把源分支的改动变成可讨论的提案">
      <p>假设 <code>feature</code> 已经有两个提交，<code>main</code> 仍在旧基线。打开 PR 时要明确 source/head 是 <code>feature</code>，base 是 <code>main</code>；平台根据这两个分支计算要讨论的差异，而不是把 feature 直接复制进 main。</p>
      <p id="pr-proposal" className="vp-citation-target">Pull request 的作用是提出、讨论和评审一组代码变化，再决定是否合并。它是托管平台的协作记录，不是一个本地 Git 提交，也不等于已经完成部署。<Cite id="pr-proposal" sources={pullRequestSources} /></p>
      <p id="pr-branches" className="vp-citation-target">创建 PR 时必须选择两个不同的分支：要合并到哪里的 base，以及包含改动的 compare/head。先写清背景、范围和验证证据，评审者才能把问题和这次改动对应起来。<Cite id="pr-branches" sources={pullRequestSources} /></p>
      <GitWorkflowLesson slug="pull-request" />
    </ArticleSection>

    <ArticleSection id="pr-review" title="差异、讨论和检查围绕同一对象更新">
      <p id="pr-tabs" className="vp-citation-target">一个 PR 通常同时提供 Conversation、Commits、Files changed 和 Checks 等视图：评论记录上下文，提交显示演进，差异显示具体文件，检查反馈构建、测试和扫描结果。评审不是只看一张 diff 图片。<Cite id="pr-tabs" sources={pullRequestSources} /></p>
      <p id="pr-updates" className="vp-citation-target">作者继续向同一个 head 分支推送新提交后，PR 的比较结果、讨论上下文和检查状态会随之更新；这也是为什么评审要确认当前看到的是最新提交，而不是旧截图。<Cite id="pr-updates" sources={pullRequestSources} /></p>
      <p id="pr-review-decision" className="vp-citation-target">评审者可以留下 comment、approve 或 request changes。可执行的意见应指出位置、影响和验证方式；approve 只是评审决策的一种状态，不能替代必需检查或分支保护规则。<Cite id="pr-review-decision" sources={pullRequestSources} /></p>
      <p id="pr-draft" className="vp-citation-target">Draft PR 适合先共享未完成工作，但草稿状态不能合并；准备好请求正式评审后，再把它标记为 ready for review。<Cite id="pr-draft" sources={pullRequestSources} /></p>
    </ArticleSection>

    <ArticleSection id="pr-merge" title="满足门禁后才把结果写入目标分支">
      <p id="pr-merge-gate" className="vp-citation-target">合并区域会汇总缺少的审批、失败的检查和其他阻塞条件。目标分支的保护规则可以要求特定评审、状态检查或线性历史；PR 页面显示“可以合并”之前，先处理这些门禁。<Cite id="pr-merge-gate" sources={pullRequestSources} /></p>
      <p id="pr-protection" className="vp-citation-target">保护分支的意义是把团队约定变成可执行的条件，例如要求通过状态检查、必需审批或限制谁能直接推送。规则通过后，合并动作才有资格改变 base 分支。<Cite id="pr-protection" sources={pullRequestSources} /></p>
      <p id="pr-push" className="vp-citation-target">如果检查发现问题，先向 head 分支推送修复提交，等待 PR 更新和检查重跑。<code>git push</code> 只把提交发送到远程分支，不会绕过评审或自动把 main 变成生产版本。<Cite id="pr-push" sources={pullRequestSources} /></p>
      <p><strong>读者判断：</strong>先确认 source/base、PR 当前提交和检查范围，再决定是否请求评审；看到 approve 也要检查必需状态和发布条件。合并完成只说明目标分支接收了代码，部署、迁移和线上冒烟仍是后续流程。</p>
    </ArticleSection>
  </GitArticle>;
}
