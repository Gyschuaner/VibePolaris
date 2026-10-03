import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { revertSources } from "@/lib/git-concept-sources/revert";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["revert-meaning", "revert 读取旧提交的反向补丁"],
  ["revert-history", "公共历史继续向前"],
  ["revert-boundary", "代码回到原样不等于系统副作用回滚"],
];

export function RevertTermPage() {
  return <GitArticle
    slug="revert"
    title="反向提交"
    subtitle="Revert · 用新提交抵消旧提交的代码变化"
    sources={revertSources}
    sections={sections}
    hero={<GitHero trigger="错误提交已经发布，怎样撤销而不改写团队看到的历史？" change="查看 B → 计算反向补丁 → 新提交 C" proof="B 仍留在历史，C 抵消代码变化；数据库和外部副作用要单独补偿" />}
    intro={<>Git revert 不把时间线剪回过去，而是读取目标提交带来的变化，生成它的反向补丁，再记录一个新的提交。这样团队已经看到的 B 仍然存在，新的 C 说明“这次撤销发生过”，也给后续审计和协作留下上下文。</>}
  >
    <ArticleSection id="revert-meaning" title="revert 读取旧提交的反向补丁">
      <p>假设公共分支是 A → B，B 把按钮状态改成了错误行为。先用 <code>git show B</code> 看清 B 相对父提交改了什么，再让 revert 计算相反方向的变化；它处理的是提交补丁，不是把工作区任意覆盖成某个旧快照。</p>
      <p id="revert-patch" className="vp-citation-target"><code>git show</code> 可以检查目标提交及其差异，帮助确认要抵消的是哪一组变化。目标提交可能包含多个文件，不能只凭提交标题猜测撤销范围。<Cite id="revert-patch" sources={revertSources} /></p>
      <p id="revert-new-commit" className="vp-citation-target"><code>git revert</code> 会把目标提交引入的补丁反向应用，并记录新的提交；原来的 B 不会从历史中消失。工作区需要先保持干净，撤销操作本身仍可能产生冲突。<Cite id="revert-new-commit" sources={revertSources} /></p>
      <GitWorkflowLesson slug="revert" />
    </ArticleSection>

    <ArticleSection id="revert-history" title="公共历史继续向前">
      <p id="revert-reset" className="vp-citation-target">revert 和 reset 解决的是不同问题：revert 在当前历史上追加一个抵消提交；reset 会移动 HEAD，并按模式改变 index 或工作树，可能让本地提交从当前分支上消失。已经共享的分支通常要优先考虑前者。<Cite id="revert-reset" sources={revertSources} /></p>
      <p id="revert-clean" className="vp-citation-target">revert 要求工作树相对 HEAD 没有未提交修改；如果撤销过程中发生冲突，可以继续、跳过当前序列或中止。先保护本地改动，再开始公共分支上的撤销更容易恢复。<Cite id="revert-clean" sources={revertSources} /></p>
      <p id="revert-merge" className="vp-citation-target">撤销一个合并提交时，Git 不知道要把哪一侧当作主线，需要用 <code>--mainline</code> 指定父提交。这个选择会影响后续再次合并是否还会带回被撤销的变化，不能把它当成普通单父提交处理。<Cite id="revert-merge" sources={revertSources} /></p>
      <p>演示第三步把 A、B、C 放在同一条时间线上：文件效果可以接近 A，但 B 仍然是事实，C 才是这次撤销的记录。历史向前走，代码结果向后抵消，这是 revert 最重要的区别。</p>
    </ArticleSection>

    <ArticleSection id="revert-boundary" title="代码回到原样不等于系统副作用回滚">
      <p id="revert-verify" className="vp-citation-target">撤销后应比较 B 与 C 的差异，检查工作区和索引状态，再运行相关测试。<code>git diff</code> 只能告诉你文本端点如何变化，不能证明数据库、队列或外部服务已经恢复。<Cite id="revert-verify" sources={revertSources} /></p>
      <p id="revert-push" className="vp-citation-target">C 是一个新的本地提交，远程分支要等一次正常的 <code>git push</code> 才会看到它。保护分支、评审和持续集成仍可能要求先检查；不要因为“文件看起来恢复”就跳过发布流程。<Cite id="revert-push" sources={revertSources} /></p>
      <p><strong>读者判断：</strong>如果目标提交已经被别人拉取，优先用 revert 保留可追踪的撤销记录；如果只是本地未提交改动或个人分支整理，再考虑 reset、restore 或其他方式。代码抵消完成后，仍要为迁移、消息和外部写入安排单独的补偿或回退动作。</p>
    </ArticleSection>
  </GitArticle>;
}
