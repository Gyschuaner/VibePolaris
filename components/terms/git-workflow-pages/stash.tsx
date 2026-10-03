import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { stashSources } from "@/lib/git-concept-sources/stash";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["stash-meaning", "stash 保存工作树与 index 的现场"],
  ["stash-recover", "apply 和 pop 是两种恢复选择"],
  ["stash-boundary", "临时记录不等于长期备份"],
];

export function StashTermPage() {
  return <GitArticle
    slug="stash"
    title="暂存改动"
    subtitle="Stash · 把未完成的现场收起，稍后在合适的分支恢复"
    sources={stashSources}
    sections={sections}
    hero={<GitHero trigger="本地修改还不能提交，却必须先切到另一个分支，怎样安全收起再恢复？" change="工作树 + index → stash@{0} → apply / pop" proof="工作区回到 HEAD；未跟踪文件需明确 -u，恢复冲突时记录仍保留" />}
    intro={<>Git stash 把当前工作树和 index 的状态保存成一个本地临时记录，再把工作区还原到 HEAD。它适合中断手上的现场去处理别的任务，但不是提交到当前分支，也不是远程备份；恢复前必须确认这份改动属于哪个上下文。</>}
  >
    <ArticleSection id="stash-meaning" title="stash 保存工作树与 index 的现场">
      <p>假设 <code>feature</code> 上已经改了 <code>theme.css</code>，另一个修复还在 index 里，但这组改动还没有形成可审查的提交。<code>git stash push -m &quot;theme draft&quot;</code> 会把工作树和 index 的状态收进一条 stash 记录，然后把工作区恢复到 HEAD。</p>
      <p id="stash-save" className="vp-citation-target"><code>stash push</code> 保存的是当前本地修改，记录通常显示为 <code>stash@{`{0}`}</code>；它的用途是暂时离开脏工作区，而不是移动当前分支的 HEAD。<Cite id="stash-save" sources={stashSources} /></p>
      <p id="stash-untracked" className="vp-citation-target">默认情况下，未跟踪的 <code>mock.json</code> 不会自动进入 stash。确实需要一起收起时要明确使用 <code>git stash push -u</code>，忽略文件则要用更宽的选项；不先看状态，就容易误以为所有文件都已经被保护。<Cite id="stash-untracked" sources={stashSources} /></p>
      <GitWorkflowLesson slug="stash" />
    </ArticleSection>

    <ArticleSection id="stash-recover" title="apply 和 pop 是两种恢复选择">
      <p id="stash-stack" className="vp-citation-target"><code>git stash list</code> 可以列出多条临时记录，<code>git stash show</code> 可以检查某一条记录保存了哪些差异。先看栈和差异，再决定要把哪一条应用到当前分支。<Cite id="stash-stack" sources={stashSources} /></p>
      <p id="stash-switch" className="vp-citation-target">收起后可以切到 <code>fix</code> 处理紧急修复；切换分支只改变当前上下文，stash 仍然留在本地记录里，回到正确分支后才应用它。<Cite id="stash-switch" sources={stashSources} /></p>
      <p id="stash-apply" className="vp-citation-target"><code>git stash apply</code> 会把差异合入当前工作树但保留 stash；适合先验证恢复结果。<code>git stash pop</code> 在应用成功后才移除记录，应用产生冲突时不会自动删除，解决后可以继续检查或手动 drop。<Cite id="stash-apply" sources={stashSources} /></p>
      <p id="stash-pop" className="vp-citation-target">恢复的目标分支如果已经改过同一片区域，应用可能产生冲突。冲突不是“stash 消失”，而是工作树需要人工组合；在确认结果可测试前，先保留那条 stash 记录更安全。<Cite id="stash-pop" sources={stashSources} /></p>
    </ArticleSection>

    <ArticleSection id="stash-boundary" title="临时记录不等于长期备份">
      <p id="stash-clean" className="vp-citation-target">收起后应再次用 <code>git status</code> 确认工作树和 index 的状态，再切换或运行其他命令；“看起来没有文件变化”不能代替状态检查。<Cite id="stash-clean" sources={stashSources} /></p>
      <p id="stash-conflict" className="vp-citation-target">stash 记录保存在本地 <code>refs/stash</code>，不是团队共享历史。重要工作应该形成有说明的提交并推送；stash 只负责短暂搬运现场，不能替代评审、备份或发布证据。<Cite id="stash-conflict" sources={stashSources} /></p>
      <p id="stash-workflow" className="vp-citation-target">如果原分支已经前进很多，直接 apply 反复冲突，可以用 <code>git stash branch</code> 从原来创建 stash 的起点开出新分支再恢复。无论选择 apply、pop 还是 branch，都要先检查差异、运行相关测试，确认现场确实回到了正确的任务上。<Cite id="stash-workflow" sources={stashSources} /></p>
      <p><strong>读者判断：</strong>改动很小、马上要切换上下文时可以 stash；如果改动已经形成完整意图或需要多人接手，就创建清楚的提交。恢复成功后再决定是否 drop，避免把唯一的未提交现场过早删除。</p>
    </ArticleSection>
  </GitArticle>;
}
