import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { fetchSources } from "@/lib/git-concept-sources/fetch";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["fetch-meaning", "fetch 先更新哪一个指针"],
  ["fetch-compare", "获取之后怎样看差异"],
  ["fetch-boundary", "已获取不等于已采用"],
];

export function FetchTermPage() {
  return <GitArticle
    slug="fetch"
    title="获取"
    subtitle="Fetch · 把远程对象和引用带回本地"
    sources={fetchSources}
    sections={sections}
    hero={<GitHero trigger="我想先看看团队分支更新了什么，再决定要不要合并，应该做哪一步？" change="远程对象 → remote-tracking 引用 → 比较后再集成" proof="fetch 让本地知道远程的新提交，但不移动当前分支，也不检出工作区" />}
    intro={<>Git fetch 是一次只更新“我知道的远程状态”的动作。它从远程取得本地缺少的对象，并把对应的 remote-tracking 引用推进到新位置；当前 <code>main</code> 和工作区不会因此自动换成远程版本。</>}
  >
    <ArticleSection id="fetch-meaning" title="fetch 先更新哪一个指针">
      <p>假设本地 <code>main</code> 和 <code>origin/main</code> 都在 A，而远程已经有 B1、B2。执行 <code>git fetch origin</code> 后，这些对象进入本地对象库，<code>origin/main</code> 记录到 B2；当前 <code>main</code> 仍在 A，打开的文件也仍是 A 的工作区。</p>
      <p id="fetch-command" className="vp-citation-target"><code>git fetch</code> 从一个或多个远程取得对象和引用，并更新相应的 remote-tracking 分支。它不会像 pull 那样自动把更新整合进当前分支。<Cite id="fetch-command" sources={fetchSources} /></p>
      <p id="fetch-remote" className="vp-citation-target">远程名称和 refspec 决定 fetch 去哪里、哪些引用会被映射。<code>origin</code> 只是配置名；可以指定另一个 remote，也可以用参数限制要取回的分支。<Cite id="fetch-remote" sources={fetchSources} /></p>
      <GitWorkflowLesson slug="fetch" />
    </ArticleSection>

    <ArticleSection id="fetch-compare" title="获取之后怎样看差异">
      <p id="fetch-log" className="vp-citation-target"><code>git log main..origin/main</code> 可以列出远程跟踪引用独有的提交；反向范围则能找出本地独有的提交。先看提交图，才能知道两条线是快进、分叉还是已经各自前进。<Cite id="fetch-log" sources={fetchSources} /></p>
      <p id="fetch-diff" className="vp-citation-target"><code>git diff main..origin/main</code> 比较两个端点的文件差异。它回答“内容哪里不同”，不会替你决定应当 merge、rebase、继续观察还是放弃某个更新。<Cite id="fetch-diff" sources={fetchSources} /></p>
      <p>演示第三步把 <code>main..origin/main</code> 的 B1、B2 标成“远程独有”。这一步仍然没有改工作区；它只是把决策需要的证据摆出来，下一步才可能由 pull、merge 或 rebase 继续。</p>
    </ArticleSection>

    <ArticleSection id="fetch-boundary" title="已获取不等于已采用">
      <p id="fetch-remotes" className="vp-citation-target">Pro Git 将 fetch 与后续整合分开：先把远程数据保存为本地可检查的引用，再选择怎样把它合并到自己的工作。这样可以在改变当前分支前检查提交说明、差异和团队约定。<Cite id="fetch-remotes" sources={fetchSources} /></p>
      <p>fetch 也不是备份的万能替代品。它会把远程可达对象带回当前仓库，但本地仓库的清理、权限、网络失败和远程删除策略仍然影响你能保留多久；关键成果仍应按团队规则提交和推送。</p>
      <p><strong>读者判断：</strong>看到“fetch 成功”，只说明本地的远程跟踪状态更新了。继续问当前分支是否落后、哪些提交独有、工作区是否有本地修改，再决定是否集成；不要把“已经获取”写成“已经上线”。</p>
    </ArticleSection>
  </GitArticle>;
}
