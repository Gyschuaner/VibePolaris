import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { branchSources } from "@/lib/git-concept-sources/branch";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["branch-meaning", "分支只是会移动的名字"],
  ["branch-process", "从共同起点走出两条线"],
  ["branch-boundary", "分支隔离历史，不替你合并风险"],
];

export function BranchTermPage() {
  return <GitArticle
    slug="branch"
    title="分支"
    subtitle="Branch · 指向提交的可移动名称"
    sources={branchSources}
    sections={sections}
    hero={<GitHero trigger="我想试做功能，又不想让未完成代码混进主线，应该隔离什么？" change="共同提交 → 新指针 → 各自前进" proof="创建分支只增加一个引用；提交后当前分支移动，主线仍停在原提交" />}
    intro={<>Git 分支是指向某个提交的名字。它让你从共同起点分出一条提交线，先在自己的上下文里记录工作；分支不是复制一份项目，也不是自动提供权限隔离。</>}
  >
    <ArticleSection id="branch-meaning" title="分支只是会移动的名字">
      <p>把提交看成一串快照，分支就是贴在其中一个快照上的可移动标签。<code>main</code> 和新建的 <code>feature</code> 可以先同时指向提交 A；此时没有第二套完整文件，只有两个名字共享同一个历史位置。</p>
      <p id="branch-pointer" className="vp-citation-target">Pro Git 将分支解释为指向提交的轻量可移动指针。创建或删除分支主要是在更新引用名称，真正改变文件内容的是随后产生的提交。<Cite id="branch-pointer" sources={branchSources} /></p>
      <p id="branch-create" className="vp-citation-target"><code>git branch feature</code> 可以创建一个指向当前提交的分支；它不会自动切换当前工作分支。是否切换，要由 <code>git switch</code> 或团队约定的其他命令明确完成。<Cite id="branch-create" sources={branchSources} /></p>
      <GitWorkflowLesson slug="branch" />
    </ArticleSection>

    <ArticleSection id="branch-process" title="从共同起点走出两条线">
      <p id="branch-switch" className="vp-citation-target"><code>git switch feature</code> 会把 HEAD 移到目标分支，并尝试让索引和工作区与该分支的提交一致。切换动作改变的是当前观察哪条历史线，不会把未提交工作自动写进提交。<Cite id="branch-switch" sources={branchSources} /></p>
      <p>在 <code>feature</code> 上提交后，feature 指向 B，而 <code>main</code> 仍指向 A；主线之后也可以继续前进到 C。读者要比较的是两个分支各自从共同祖先以来的变化，而不是把分支想成两份完全独立的代码目录。</p>
      <p>一个简单的工作节奏是：从最新主线创建 feature；每次提交只表达一个可审查的意图；提交前检查差异和测试；准备合并时再确认主线的新提交和冲突范围。分支名字可以换，提交历史才是变化的证据。</p>
    </ArticleSection>

    <ArticleSection id="branch-boundary" title="分支隔离历史，不替你合并风险">
      <p id="branch-merge" className="vp-citation-target"><code>git merge feature</code> 把目标分支的历史整合到当前分支；如果两边修改了同一处内容，Git 可能暂停并要求人工解决冲突。合并的结果仍需要检查和测试，不能只看命令返回成功。<Cite id="branch-merge" sources={branchSources} /></p>
      <p id="branch-rebase" className="vp-citation-target"><code>git rebase main</code> 会把当前分支的提交重新放到新的基线之后，形成新的提交对象。它可以让历史更线性，但已经共享给别人的提交会因为哈希变化而需要更谨慎地处理。<Cite id="branch-rebase" sources={branchSources} /></p>
      <p><strong>读者判断：</strong>分支解决的是“这组提交暂时沿哪条线记录”，不解决权限、审查或发布资格。保护主线要靠仓库规则和评审流程；合并或变基之前，仍要确认工作区、冲突、测试和协作者是否都能接受。</p>
    </ArticleSection>
  </GitArticle>;
}
