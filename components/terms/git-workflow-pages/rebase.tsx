import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { rebaseSources } from "@/lib/git-concept-sources/rebase";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["rebase-meaning", "rebase 先换基线"],
  ["rebase-replay", "自己的提交会被逐个重放"],
  ["rebase-boundary", "线性历史有协作代价"],
];

export function RebaseTermPage() {
  return <GitArticle
    slug="rebase"
    title="变基"
    subtitle="Rebase · 把一组提交重放到新的起点"
    sources={rebaseSources}
    sections={sections}
    hero={<GitHero trigger="功能分支落后主线，怎样接上最新起点又看清历史变化？" change="找出独有提交 → 移到新基线 → 依次重放" proof="原提交的父关系改变，会生成新的提交对象；工作结果要重新检查，已共享历史不能随意改写" />}
    intro={<>Git rebase 会把当前分支相对目标基线的独有提交暂时取下，先把分支放到新的起点，再按顺序把这些改动重放上去。文件结果可能相近，但提交父关系和哈希会改变；这正是它能整理线性历史、也可能扰乱协作的原因。</>}
  >
    <ArticleSection id="rebase-meaning" title="rebase 先换基线">
      <p>假设 <code>feature</code> 从旧的主线 A 分出并提交了 F1、F2，主线后来前进到 B。执行 <code>git rebase main</code> 时，Git 不把 F1、F2 的对象原地搬家，而是先确定 feature 相对 main 的独有提交，再把当前分支的起点换到 B。</p>
      <p id="rebase-upstream" className="vp-citation-target">rebase 需要一个 upstream（目标基线）来判断哪些提交属于当前分支、哪些已经在目标历史里。共同祖先和提交范围决定了“要重放的队列”，不能只看两个目录最后长得像不像。<Cite id="rebase-upstream" sources={rebaseSources} /></p>
      <p id="rebase-process" className="vp-citation-target">Git 的 rebase 文档把过程描述为：找到分叉后的提交，把当前分支重置到目标分支，再逐个应用这些提交。目标分支的提交因此先出现在当前历史中，旧的 F1、F2 不再是当前分支的父链。<Cite id="rebase-process" sources={rebaseSources} /></p>
      <GitWorkflowLesson slug="rebase" />
    </ArticleSection>

    <ArticleSection id="rebase-replay" title="自己的提交会被逐个重放">
      <p id="rebase-replay-definition" className="vp-citation-target">重放不是复制一份文件快照，而是把每个提交相对父提交的补丁按顺序重新应用到新基线上。F1 在 B 上重放成为 F1′，F2 再基于 F1′ 成为 F2′；内容可能相同，提交身份不会相同。<Cite id="rebase-replay-definition" sources={rebaseSources} /></p>
      <p id="rebase-patch" className="vp-citation-target">rebase 使用与逐个应用提交相近的补丁逻辑，所以同一改动在新基线附近可能无法自动套用。出现冲突时，Git 会停在当前提交，让你解决后继续、跳过当前提交或中止整个 rebase。<Cite id="rebase-patch" sources={rebaseSources} /></p>
      <p id="rebase-conflict" className="vp-citation-target">解决冲突后要先暂存最终文件，再执行继续操作；如果发现选错了基线或不想改写这条线，可以 abort 回到 rebase 前的状态。删掉冲突标记只是语法层面的清理，仍要跑相关测试。<Cite id="rebase-conflict" sources={rebaseSources} /></p>
      <p>演示第三步把旧 F1、F2 和新 F1′、F2′同时标出来：淡出的旧节点说明对象身份改变，保留下来的新节点说明重放已经完成。它不是“提交被移动”的动画。</p>
    </ArticleSection>

    <ArticleSection id="rebase-boundary" title="线性历史有协作代价">
      <p id="rebase-history" className="vp-citation-target">变基可以把个人分支整理成一条更直的历史，但它会改写被重放提交的父关系和哈希。已经推送、被同事基于其继续工作的提交不应随意 rebase；否则同一改动可能以旧、新两套身份同时出现。<Cite id="rebase-history" sources={rebaseSources} /></p>
      <p id="rebase-push" className="vp-citation-target">如果个人分支已经推送，重放后的提交通常无法用普通快进 push 覆盖远程旧线。需要按团队约定确认目标，并优先使用带租约的安全强推方式；保护分支或评审流程仍可能拒绝它。<Cite id="rebase-push" sources={rebaseSources} /></p>
      <p><strong>读者判断：</strong>先确认目标基线、分支是否已共享和工作区是否干净，再决定 rebase 还是 merge。完成后比较提交图、检查新哈希、处理冲突并重新测试；“历史更直”不等于“改动已经被验证”。</p>
    </ArticleSection>
  </GitArticle>;
}
