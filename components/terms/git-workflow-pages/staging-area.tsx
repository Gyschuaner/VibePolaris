import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { stagingAreaSources } from "@/lib/git-concept-sources/staging-area";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["staging-area-meaning", "暂存区保存的是候选内容"],
  ["staging-area-process", "同一文件也能拆成两次提交"],
  ["staging-area-boundary", "暂存不是备份和上传"],
];

export function StagingAreaTermPage() {
  return <GitArticle
    slug="staging-area"
    title="暂存区"
    subtitle="Staging Area · 下一次提交的内容候选"
    sources={stagingAreaSources}
    sections={sections}
    hero={<GitHero trigger="同一个文件有修复和格式调整，我只想先提交修复怎么办？" change="工作区 hunk → index 候选 → 提交快照" proof="index 只保存被选中的内容；未选 hunk 仍留在工作区" />}
    intro={<>暂存区（index）是下一次提交要读取的内容快照。它不是一个“已上传”标记，而是你从工作区里挑出的候选版本；同一个文件的不同 hunk 可以分别处理。</>}
  >
    <ArticleSection id="staging-area-meaning" title="暂存区保存的是候选内容">
      <p>Git 让工作区、index 和当前提交各自保留一份内容。你编辑文件时，变化先出现在工作区；运行 <code>git add</code> 后，选中的文件内容或 hunk 才被写进 index。提交会读取 index，而不是把编辑器里所有未确认的变化一股脑带走。</p>
      <p id="staging-index" className="vp-citation-target">Git 术语表把 index（也叫 staging area）定义为保存下一次提交候选内容的区域。它保存的是一棵可提交的内容树，不是只记录“这个文件被勾选过”的状态。<Cite id="staging-index" sources={stagingAreaSources} /></p>
      <p id="staging-add" className="vp-citation-target"><code>git add</code> 把工作区当前内容写进 index；因此同一个文件再次编辑后，可以同时存在已暂存和未暂存两段差异。交互式 <code>git add -p</code> 让你进一步按 hunk 选择。<Cite id="staging-add" sources={stagingAreaSources} /></p>
      <GitWorkflowLesson slug="staging-area" />
    </ArticleSection>

    <ArticleSection id="staging-area-process" title="同一文件也能拆成两次提交">
      <p id="staging-diff" className="vp-citation-target"><code>git diff</code> 查看工作区相对 index 的未暂存变化；<code>git diff --staged</code> 则查看 index 相对 HEAD 的提交候选。两个端点不同，看到的 hunk 也不同。<Cite id="staging-diff" sources={stagingAreaSources} /></p>
      <p id="staging-recording" className="vp-citation-target">Pro Git 的记录流程把“挑选要记录的修改”和“创建提交”分开，正是为了让一次提交只表达一组完整、可解释的变化。格式调整可以暂时留在工作区，下一次再处理。<Cite id="staging-recording" sources={stagingAreaSources} /></p>
      <p>演示中的 <code>login.ts</code> 同时有空值修复和缩进调整。先只暂存空值修复，staged diff 就只展示这一块；提交后，修复进入历史，格式调整仍显示为未暂存。未暂存内容没有消失，它只是没有成为这次提交的输入。</p>
      <p><strong>提交前检查：</strong>先看 <code>git diff --staged</code> 是否能独立说明这次意图，再看 <code>git diff</code> 是否留下了有意延后的变化。若两份 diff 都符合预期，提交边界才清楚。</p>
    </ArticleSection>

    <ArticleSection id="staging-area-boundary" title="暂存不是备份和上传">
      <p id="staging-reset" className="vp-citation-target"><code>git reset</code> 的不同用法会改变 HEAD、index 或工作区的关系；例如把文件从 index 移出，可以保留工作区内容但取消暂存。命令可能有不同破坏范围，执行前应明确要改变哪一层。<Cite id="staging-reset" sources={stagingAreaSources} /></p>
      <p>暂存区在本地仓库里，断电、误删或清理仓库都不能把它当成可靠备份；它也不会让远程分支变化。提交完成后，仍需按团队流程推送，推送前还要做测试和审查。</p>
      <p><strong>读者判断：</strong>如果你说“这个文件已经暂存”，应该能指出 index 里的具体版本和 <code>git diff --staged</code> 的 hunk。只看到文件名或勾选状态，还不足以证明下一次提交内容正确。</p>
    </ArticleSection>
  </GitArticle>;
}
