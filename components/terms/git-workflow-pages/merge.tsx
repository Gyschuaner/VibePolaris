import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { mergeSources } from "@/lib/git-concept-sources/merge";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["merge-meaning", "merge 先找共同祖先"],
  ["merge-result", "快进和合并提交是两种结果"],
  ["merge-boundary", "结果可写入不等于没有风险"],
];

export function MergeTermPage() {
  return <GitArticle
    slug="merge"
    title="合并"
    subtitle="Merge · 把两条 Git 历史汇成一个结果"
    sources={mergeSources}
    sections={sections}
    hero={<GitHero trigger="功能分支完成后，Git 怎样决定能否直接前进？" change="共同祖先 → ours / theirs 三方比较 → 当前分支结果" proof="merge 读取两条分支各自相对共同祖先的变化；当前分支是目标分支祖先时可快进，否则写入新的合并结果" />}
    intro={<>Git merge 不是按提交时间把两份文件互相覆盖，而是先确定两条历史从哪里分开，再比较共同祖先、当前分支和被合并分支的变化。结果可能只移动一个分支指针，也可能新增一个有两个父提交的合并提交。</>}
  >
    <ArticleSection id="merge-meaning" title="merge 先找共同祖先">
      <p>假设 <code>dev</code> 和 <code>feature</code> 都从提交 A 开始，后来 <code>dev</code> 到了 D，<code>feature</code> 到了 F。合并时当前分支是 ours，被合并的分支是 theirs；Git 先找 A 这个共同祖先，再分别查看 D 和 F 相对 A 改了什么。</p>
      <p id="merge-base" className="vp-citation-target"><code>git merge-base</code> 用来寻找两个提交之间的共同祖先。这个基线让合并比较“从同一个起点各自增加了什么”，而不是只比较两个最终文件。<Cite id="merge-base" sources={mergeSources} /></p>
      <p id="merge-three-way" className="vp-citation-target">三方合并把共同祖先、当前分支和目标分支作为三个输入；某一边没有改动而另一边有改动时，Git 通常可以自动带入，双方修改重叠时才需要停下来确认。<Cite id="merge-three-way" sources={mergeSources} /></p>
      <GitWorkflowLesson slug="merge" />
    </ArticleSection>

    <ArticleSection id="merge-result" title="快进和合并提交是两种结果">
      <p id="merge-fast-forward" className="vp-citation-target">在快进示例里，当前分支 <code>dev</code> 停在 A，目标分支 <code>feature</code> 已经从 A 前进到 F；因为 A 是 F 的祖先，dev 可以直接从 A 移到 F。这个 fast-forward 只移动分支指针，不创建额外的合并提交；历史仍然是一条线。<Cite id="merge-fast-forward" sources={mergeSources} /></p>
      <p id="merge-commit" className="vp-citation-target">如果两边都在共同祖先之后前进，Git 需要把两套变化组合，并可创建一个新的合并提交 M。M 的两个父提交保留了两条历史来源，之后查看提交图时仍能知道它们在哪里汇合。<Cite id="merge-commit" sources={mergeSources} /></p>
      <p id="merge-history" className="vp-citation-target">合并保留分支各自已有的提交，并把合并结果写入当前分支；它不是把 feature 的提交“搬走”，也不等于把任何未提交的工作区修改自动加入历史。<Cite id="merge-history" sources={mergeSources} /></p>
      <p>演示的第二步固定显示 A、D、F 的分叉输入；第三步可以切到另一个满足祖先关系的 A、F 输入观察快进，也可以保留 D、F 分叉创建合并提交。选择不同结果不是美化历史的按钮，而是在提交图上做一个可检查的协作决策。</p>
    </ArticleSection>

    <ArticleSection id="merge-boundary" title="结果可写入不等于没有风险">
      <p id="merge-process" className="vp-citation-target">merge 可能在开始前因未提交工作区而停止，也可能在合并过程中发现无法自动组合的冲突；此时 Git 会保留合并状态，要求解决、继续或中止，而不是猜一个最终版本。<Cite id="merge-process" sources={mergeSources} /></p>
      <p id="merge-conflict" className="vp-citation-target">冲突区域需要结合两边的需求编辑最终文件，再暂存并继续合并。删除冲突标记只能让文件恢复可解析，不能证明行为满足验收条件；相关测试仍要独立运行。<Cite id="merge-conflict" sources={mergeSources} /></p>
      <p><strong>读者判断：</strong>先确认当前分支、目标分支和共同祖先，再决定是接受快进还是保留合并节点。合并完成后检查提交图、工作区状态、冲突处理和测试结果；“产生了 M”只说明历史写入成功，不说明业务逻辑自动正确。</p>
    </ArticleSection>
  </GitArticle>;
}
