import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { remoteSources } from "@/lib/git-concept-sources/remote";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["remote-meaning", "remote 保存的是地址与取回规则"],
  ["remote-exchange", "fetch、push 和当前分支各走一条线"],
  ["remote-boundary", "origin 不是中央服务器"],
];

export function RemoteTermPage() {
  return <GitArticle
    slug="remote"
    title="远程仓库"
    subtitle="Remote · 本地保存的远程地址与引用规则"
    sources={remoteSources}
    sections={sections}
    hero={<GitHero trigger="我配置了两个远程，fetch 到底会移动什么？" change="远程名称/URL → remote-tracking 引用 → 当前分支保持原位" proof="fetch 更新匹配的远程跟踪引用；本地 main 和工作区不会因此自动改变" />}
    intro={<>Git remote 不是一个神秘的“中央仓库对象”，而是本地仓库里一组有名字的地址和引用规则。常见的 <code>origin</code> 只是一个名字；真正发生交换时，fetch、push 和 pull 分别改变不同的引用或历史。</>}
  >
    <ArticleSection id="remote-meaning" title="remote 保存的是地址与取回规则">
      <p>在本地仓库里，<code>origin</code> 或 <code>upstream</code> 是远程配置的名字，后面关联一个 URL 和 refspec。名字让命令不用每次重复整条地址；refspec 则说明远端哪些引用可以映射到本地的 remote-tracking 引用。</p>
      <p id="remote-config" className="vp-citation-target"><code>git remote -v</code> 可以查看远程名称和读写 URL，<code>git remote get-url</code> 可以核对某个名称实际指向哪里。配置存在本地，不代表此刻已经连接或已经读取远端。<Cite id="remote-config" sources={remoteSources} /></p>
      <p id="remote-tracking" className="vp-citation-target">像 <code>origin/main</code> 这样的 remote-tracking 引用，是本地上一次获取到的远程状态记录。它不是实时指针，也不是你当前正在编辑的 <code>main</code> 分支；两者可以暂时落在不同提交。<Cite id="remote-tracking" sources={remoteSources} /></p>
      <GitWorkflowLesson slug="remote" />
    </ArticleSection>

    <ArticleSection id="remote-exchange" title="fetch、push 和当前分支各走一条线">
      <p id="remote-fetch" className="vp-citation-target"><code>git fetch upstream</code> 会从 upstream 取回匹配的对象和引用，并更新本地的 <code>upstream/*</code> 记录。它不会把这些提交自动合并进当前 <code>main</code>，所以 fetch 完成后，工作区仍可以保持原样。<Cite id="remote-fetch" sources={remoteSources} /></p>
      <p id="remote-push" className="vp-citation-target"><code>git push origin feature</code> 反方向更新远端的引用：本地先有可推送的提交，远端接收后它的分支才会前进。push 的目标由远程名称和 refspec 决定，写错名称可能把代码发到错误仓库。<Cite id="remote-push" sources={remoteSources} /></p>
      <p>演示里 fetch upstream 只让 <code>upstream/main</code> 从 A 记录到 B；本地 <code>main</code> 仍指向 A，文件也没有因为“看到新提交”就自动变化。要让当前分支采用 B，还需要明确比较、合并或变基。</p>
    </ArticleSection>

    <ArticleSection id="remote-boundary" title="origin 不是中央服务器">
      <p id="remote-pull" className="vp-citation-target"><code>git pull</code> 通常先 fetch，再按配置用 merge 或 rebase 把远程更新整合进当前分支。它比 fetch 多了一步会改变本地历史的整合动作；只想先查看远程变化时，应从 fetch 开始。<Cite id="remote-pull" sources={remoteSources} /></p>
      <p>一个仓库可以同时有 <code>origin</code>、<code>upstream</code> 或其他命名远程，也可以只配置一个。团队约定可能把 origin 当作个人 fork、把 upstream 当作主仓库，但 Git 本身并不赋予这些名字特殊等级。</p>
      <p><strong>读者判断：</strong>看到“已经同步”时，先问同步的是哪个远程、哪个 remote-tracking 引用，以及当前分支是否真的整合了它。地址配置、引用记录、当前文件和远端分支是四个可分别检查的对象。</p>
    </ArticleSection>
  </GitArticle>;
}
