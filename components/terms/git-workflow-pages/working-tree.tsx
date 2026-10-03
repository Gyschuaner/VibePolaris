import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { workingTreeSources } from "@/lib/git-concept-sources/working-tree";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["working-tree-meaning", "文件现在属于哪一层"],
  ["working-tree-process", "保存、暂存和提交怎样错开"],
  ["working-tree-boundary", "工作树不是备份或远程副本"],
];

export function WorkingTreeTermPage() {
  return <GitArticle
    slug="working-tree"
    title="工作区"
    subtitle="Working Tree · 当前检出的文件快照"
    sources={workingTreeSources}
    sections={sections}
    hero={<GitHero trigger="文件已经保存，为什么 Git 仍然说它还没有进入提交？" change="HEAD / index / 工作树三层快照" proof="编辑只让工作树变动；git add 才更新 index，commit 才更新 HEAD" />}
    intro={<>Git 工作区（working tree）是当前提交被检出到文件系统后的那份可编辑内容。你在编辑器里保存，首先改变的是工作树；它和暂存区、提交历史分别保存不同的快照。</>}
  >
    <ArticleSection id="working-tree-meaning" title="文件现在属于哪一层">
      <p>把同一个文件想成三张快照：<code>HEAD</code> 是当前提交里记录的版本，<code>index</code> 是下一次提交的候选，工作区是你正在打开和修改的文件。刚检出一个干净提交时，三者内容一致；之后编辑文件，差异先出现在工作区。</p>
      <p id="working-tree-definition" className="vp-citation-target">Git 术语表把 working tree 定义为实际检出的文件树，通常包含由 HEAD 指定的版本以及尚未写入索引或下一次提交的本地修改。它是文件系统中的工作副本，不是一个自动同步的远程目录。<Cite id="working-tree-definition" sources={workingTreeSources} /></p>
      <p id="working-tree-status" className="vp-citation-target"><code>git status</code> 会根据工作树、索引和当前提交之间的差异，列出已暂存、未暂存和未跟踪文件。它告诉你状态落在哪一层，但不会替你选择下一次提交的范围。<Cite id="working-tree-status" sources={workingTreeSources} /></p>
      <GitWorkflowLesson slug="working-tree" />
    </ArticleSection>

    <ArticleSection id="working-tree-process" title="保存、暂存和提交怎样错开">
      <p id="working-tree-add" className="vp-citation-target">运行 <code>git add settings.ts</code> 时，Git 把工作区此刻的内容写进索引；之后你再改同一个文件，工作区和 index 又可能产生差异。保存文件本身不会隐式执行 add。<Cite id="working-tree-add" sources={workingTreeSources} /></p>
      <p id="working-tree-recording" className="vp-citation-target">Pro Git 的记录流程先检查工作区，再选择要暂存的修改，最后创建提交；这也是为什么提交候选可以和当前编辑内容暂时不同。<Cite id="working-tree-recording" sources={workingTreeSources} /></p>
      <p>例如你把超时时间从 10 改为 30，先看到的是工作树变化。点击 <code>git add</code> 后，index 也记录 30，但 HEAD 仍是旧提交。只有 <code>git commit</code> 成功，历史才出现包含 30 的新快照；工作区里其他未暂存改动不会被顺手吸收。</p>
    </ArticleSection>

    <ArticleSection id="working-tree-boundary" title="工作树不是备份或远程副本">
      <p id="working-tree-restore" className="vp-citation-target"><code>git restore</code> 可以从指定来源恢复工作区或索引内容，但恢复前要确认你要丢弃的是哪一层差异。它是有目标的状态操作，不是“把所有东西恢复到服务器最新版本”。<Cite id="working-tree-restore" sources={workingTreeSources} /></p>
      <p>如果文件只改在工作区，其他人不会因为你保存就看到它；远程仓库也不会因为本地编辑自动更新。要让改动进入团队历史，至少还要经过暂存、提交以及按流程推送。每一步都应留有可检查的边界。</p>
      <p><strong>读者判断：</strong>看到“文件已保存”时，继续问“它现在和谁不同？”若答案是工作树与 index 不同，就先看 <code>git diff</code>；若答案是 index 与 HEAD 不同，就看 <code>git diff --staged</code>。把层次说清，才不会误删或误提交。</p>
    </ArticleSection>
  </GitArticle>;
}
