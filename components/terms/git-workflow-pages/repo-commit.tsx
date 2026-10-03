import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { repoCommitSources } from "@/lib/git-concept-sources/repo-commit";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["repo-commit-meaning", "提交到底记录了什么"],
  ["repo-commit-process", "从文件改动到本地历史"],
  ["repo-commit-boundary", "提交、推送和撤回各自负责什么"],
];

export function RepoCommitTermPage() {
  return <GitArticle
    slug="repo-commit"
    title="提交"
    subtitle="Repository Commit · 把选中的修改写入本地历史"
    sources={repoCommitSources}
    sections={sections}
    hero={<GitHero trigger="我已经改好文件，怎样留下一个可检查的版本？" change="工作区 → 暂存区 → 本地提交" proof="新提交只包含暂存内容；远程分支仍保持原样" />}
    intro={<>Git 提交（commit）是仓库历史中的一个新快照。你先从正在编辑的文件里挑出这次要记录的修改，再由提交把这份候选内容写进本地对象库和当前分支；保存文件、提交和推送是三个不同动作。</>}
  >
    <ArticleSection id="repo-commit-meaning" title="提交到底记录了什么">
      <p>把一个文件保存到磁盘，只会改变工作区。提交时 Git 读取暂存区里的候选版本，为这次快照写入作者、时间、提交说明以及与父提交的关系。当前分支的名字随后指向这个新提交，所以你可以沿着历史回看它。</p>
      <p id="repo-commit-steps" className="vp-citation-target">Pro Git 把记录修改拆成检查工作区、暂存想保留的变化、再提交三个步骤；这个顺序让“我改过什么”和“我准备记录什么”保持可见。<Cite id="repo-commit-steps" sources={repoCommitSources} /></p>
      <p id="repo-commit-diff" className="vp-citation-target"><code>git diff</code> 默认比较工作区与暂存区，因此适合先查还没有被选进下一次提交的变化。要看提交候选本身，则要把暂存区和当前提交进行比较。<Cite id="repo-commit-diff" sources={repoCommitSources} /></p>
      <GitWorkflowLesson slug="repo-commit" />
    </ArticleSection>

    <ArticleSection id="repo-commit-process" title="从文件改动到本地历史">
      <p id="repo-commit-add" className="vp-citation-target"><code>git add</code> 把工作区当前内容复制到索引（也叫暂存区）；它可以接收一个文件，也可以在交互模式下只接收某个 hunk。工作区之后继续编辑，索引里的候选不会自动跟着变。<Cite id="repo-commit-add" sources={repoCommitSources} /></p>
      <p id="repo-commit-write" className="vp-citation-target"><code>git commit</code> 创建一个新的提交对象，并让当前分支记录这次历史变化。提交说明应该说清这组修改解决了什么问题，因为之后的排查、评审和撤回都要靠它区分不同意图。<Cite id="repo-commit-write" sources={repoCommitSources} /></p>
      <p>实际操作可以是：先运行 <code>git diff</code>，确认没有混入无关改动；再用 <code>git add -p</code> 或按文件暂存；最后运行 <code>git diff --staged</code>，确认候选内容后再提交。暂存区不是上传队列，它只是下一次本地提交的输入。</p>
      <p><strong>读者检查：</strong>如果暂存区只包含按钮修复，那么提交后格式调整仍会留在工作区；这正是把一个大改动拆成多个可审查提交的依据。</p>
    </ArticleSection>

    <ArticleSection id="repo-commit-boundary" title="提交、推送和撤回各自负责什么">
      <p id="repo-commit-push" className="vp-citation-target">本地提交不会自动出现在团队仓库。<code>git push</code> 才会把本地对象和引用请求发送到远程，并受远程分支保护、权限和历史关系检查；推送成功前，同事看到的仍是远程原有提交。<Cite id="repo-commit-push" sources={repoCommitSources} /></p>
      <p>所以“提交成功”回答的是“我有没有在本地留下这组版本”，而不是“团队已经采用了它”。想撤掉尚未提交的工作区改动，可以根据目标使用 <code>git restore</code> 或重新编辑；想撤销已经发布的历史，则需要更谨慎地创建反向提交或按团队流程处理。</p>
      <p>一次提交也不等于测试通过。它只是一个可定位的版本边界；提交之后仍要运行与改动相关的检查，再决定是否推送、开合并请求或回滚。把提交说明、差异和验证结果放在一起，别人才能判断这次历史变化是否完整。</p>
    </ArticleSection>
  </GitArticle>;
}
