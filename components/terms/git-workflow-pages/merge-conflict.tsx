import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { mergeConflictSources } from "@/lib/git-concept-sources/merge-conflict";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["merge-conflict-meaning", "冲突在三方比较中出现"],
  ["merge-conflict-resolve", "先理解，再编辑最终版本"],
  ["merge-conflict-boundary", "继续、跳过或中止都要验证"],
];

export function MergeConflictTermPage() {
  return <GitArticle
    slug="merge-conflict"
    title="合并冲突"
    subtitle="Merge Conflict · Git 无法替你决定哪种改动应保留"
    sources={mergeConflictSources}
    sections={sections}
    hero={<GitHero trigger="两个分支都改了同一段代码，怎样判断应该组合什么？" change="对照共同祖先 → 看见冲突标记 → 编辑、暂存、验证" proof="冲突只是 Git 暂停等待判断；最终文件要符合两边意图，继续前还要检查测试" />}
    intro={<>Git 合并冲突不是“选 ours 还是 theirs”的格式题，而是三方变化无法自动组合时留下的决策现场。共同祖先、当前分支和被合并分支的差异会被保留在工作区，等你理解意图、编辑结果并明确告诉 Git 已经处理。</>}
  >
    <ArticleSection id="merge-conflict-meaning" title="冲突在三方比较中出现">
      <p>假设共同祖先是 A，当前分支 ours 从 A 把校验改成 403，被合并分支 theirs 又从 A 改了返回结构。两边碰到了同一片代码，Git 没有足够依据猜出哪种组合符合需求，于是把合并停在中间状态。</p>
      <p id="conflict-three-way" className="vp-citation-target">三方合并不是按时间覆盖文件，而是比较共同祖先、当前分支和目标分支。只改了一边的区域通常可以自动带入；双方都改了同一区域，Git 才需要把决定交还给人。<Cite id="conflict-three-way" sources={mergeConflictSources} /></p>
      <p id="conflict-stage" className="vp-citation-target">冲突发生时，HEAD 保持在当前提交，MERGE_HEAD 记录另一边；冲突路径的索引可以同时保留共同祖先、ours 和 theirs 三个阶段，工作区则出现冲突标记。<Cite id="conflict-stage" sources={mergeConflictSources} /></p>
      <GitWorkflowLesson slug="merge-conflict" />
    </ArticleSection>

    <ArticleSection id="merge-conflict-resolve" title="先理解，再编辑最终版本">
      <p id="conflict-markers" className="vp-citation-target">工作区里的 <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt; ours</code>、<code>=======</code> 和 <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; theirs</code> 只是边界标记，不是最终代码。ours 和 theirs 表示合并方向中的两边，不代表其中一边天然正确。<Cite id="conflict-markers" sources={mergeConflictSources} /></p>
      <p id="conflict-context" className="vp-citation-target">先看共同祖先和两边的改动意图，再决定保留、组合或重写结果。必要时用 diff3 把 base 一起显示，也可以查看三方差异；直接按下某一边会很快，却可能把另一边的需求一起丢掉。<Cite id="conflict-context" sources={mergeConflictSources} /></p>
      <p id="conflict-stage-result" className="vp-citation-target">编辑完成后，删除所有冲突标记并检查最终语义，再用 <code>git add</code> 把文件标记为已解决。暂存表示“这个路径的冲突处理完了”，不表示业务行为已经正确，相关测试仍要单独运行。<Cite id="conflict-stage-result" sources={mergeConflictSources} /></p>
    </ArticleSection>

    <ArticleSection id="merge-conflict-boundary" title="继续、跳过或中止都要验证">
      <p id="conflict-merge-flow" className="vp-citation-target">merge 冲突解决并暂存后，可以用 <code>git merge --continue</code> 完成合并；如果决定不合并，用 <code>git merge --abort</code> 尝试回到合并前。开始前若有未提交改动，abort 不保证能完美重建原状。<Cite id="conflict-merge-flow" sources={mergeConflictSources} /></p>
      <p id="conflict-rebase" className="vp-citation-target">同一个冲突现场也可能来自 rebase：解决并暂存后用 <code>git rebase --continue</code>，想放弃用 <code>--abort</code>，确认当前提交不该保留才用 <code>--skip</code>。跳过是丢掉这一补丁，不是把冲突标记藏起来。<Cite id="conflict-rebase" sources={mergeConflictSources} /></p>
      <p id="conflict-cherry-pick" className="vp-citation-target">cherry-pick 的序列也有 continue、skip、abort；这些命令只推进或取消 Git 的操作状态。无论最后生成 merge commit、rebase 后的新提交还是 cherry-pick 提交，都要检查 diff、工作区状态和相关测试。<Cite id="conflict-cherry-pick" sources={mergeConflictSources} /></p>
      <p><strong>读者判断：</strong>先写清两边各自想解决什么，再编辑出同时满足需求的版本；确认没有标记后暂存，最后验证行为。冲突解决成功的信号是“Git 可以继续且测试支持结果”，不是“页面变绿”或“标记被删掉”。</p>
    </ArticleSection>
  </GitArticle>;
}
