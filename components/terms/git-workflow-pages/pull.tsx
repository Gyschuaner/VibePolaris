import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { pullSources } from "@/lib/git-concept-sources/pull";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["pull-meaning", "pull 不是只下载"],
  ["pull-strategy", "fetch 之后要决定怎样集成"],
  ["pull-boundary", "策略、冲突和历史都要看清"],
];

export function PullTermPage() {
  return <GitArticle
    slug="pull"
    title="拉取"
    subtitle="Pull · 获取远程更新并集成到当前分支"
    sources={pullSources}
    sections={sections}
    hero={<GitHero trigger="执行 pull 后为什么会出现合并提交或冲突？" change="fetch 远程更新 → 选择 merge/rebase → 改变当前历史" proof="pull 先刷新远程跟踪引用，再按策略把它集成到当前分支；它不是只读下载" />}
    intro={<>Git pull 是一个组合动作：先从远程获取更新，再把更新集成到当前分支。默认或配置可能选择 merge、rebase 或仅允许快进；所以同一条命令在不同仓库里可能留下不同的提交图。</>}
  >
    <ArticleSection id="pull-meaning" title="pull 不是只下载">
      <p>假设本地 <code>main</code> 有提交 C，远程跟踪引用在 B，远端又多了提交 D。执行 pull 时，Git 先把远端对象取回并更新 <code>origin/main</code>，然后继续处理当前分支；如果只想观察 D，应该停在 fetch，而不是直接 pull。</p>
      <p id="pull-command" className="vp-citation-target"><code>git pull</code> 会先运行 fetch，再把远程分支集成到当前分支。目标远程和分支通常来自当前分支的 upstream 配置，也可以在命令行显式指定。<Cite id="pull-command" sources={pullSources} /></p>
      <p id="pull-fetch" className="vp-citation-target"><code>git fetch</code> 只更新远程跟踪引用和本地对象，不移动当前分支，也不把远程提交写入工作区。pull 的第一阶段完成后，当前分支仍然等待下一步集成。<Cite id="pull-fetch" sources={pullSources} /></p>
      <GitWorkflowLesson slug="pull" />
    </ArticleSection>

    <ArticleSection id="pull-strategy" title="fetch 之后要决定怎样集成">
      <p id="pull-merge" className="vp-citation-target"><code>merge</code> 把两个历史的共同结果写进当前分支；如果本地和远程都前进，可能产生一个新的合并提交，冲突则需要人工处理。合并成功不等于功能已经通过测试。<Cite id="pull-merge" sources={pullSources} /></p>
      <p id="pull-rebase" className="vp-citation-target"><code>rebase</code> 把当前分支的本地提交重新应用到更新后的远程基线之上，通常会形成新的提交对象。历史看起来更直，但已经共享的提交会因为哈希变化而需要谨慎处理。<Cite id="pull-rebase" sources={pullSources} /></p>
      <p>演示把同一份“远程先到 D、本地另有 C”的输入保留在两个结果里：选择 merge 看到合并节点 M，选择 rebase 看到重放后的 C′。这两个结果都不是“下载完成”的同义词，而是不同的历史决策。</p>
    </ArticleSection>

    <ArticleSection id="pull-boundary" title="策略、冲突和历史都要看清">
      <p id="pull-config" className="vp-citation-target">仓库可以通过 <code>pull.rebase</code>、<code>branch.&lt;name&gt;.rebase</code> 和快进相关配置影响 pull 的集成方式。执行前先查看配置和当前分支跟踪关系，不要假设所有项目都采用同一种默认策略。<Cite id="pull-config" sources={pullSources} /></p>
      <p>如果工作区有未提交修改，pull 可能在集成前就停止；如果历史无法直接整合，Git 会留下冲突状态，要求解决后继续或中止。此时“命令没有报错”与“代码已经正确”是两回事。</p>
      <p><strong>读者判断：</strong>想只看远程变化就用 fetch；想改变当前分支才用 pull，并先说清要 merge 还是 rebase。完成后检查提交图、冲突处理、工作区状态和测试结果，再把“已拉取”写成“已完成”。</p>
    </ArticleSection>
  </GitArticle>;
}
