import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { cloneSources } from "@/lib/git-concept-sources/clone";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["clone-meaning", "clone 一次建立了哪些东西"],
  ["clone-history", "完整历史和浅历史差在哪里"],
  ["clone-boundary", "仓库到手不等于项目能运行"],
];

export function CloneTermPage() {
  return <GitArticle
    slug="clone"
    title="克隆"
    subtitle="Clone · 从远程得到可继续工作的本地仓库"
    sources={cloneSources}
    sections={sections}
    hero={<GitHero trigger="第一次参与项目，我怎样得到能提交、切分支和查看历史的本地仓库？" change="远程对象 → .git 与 origin → 默认分支工作区" proof="clone 同时取得 Git 对象和引用、配置远程并检出起点；依赖安装仍是项目自己的步骤" />}
    intro={<>克隆（<code>git clone</code>）不是把网页文件下载到一个文件夹。它会创建本地 Git 仓库、从远程取得对象和引用、记录远程地址，并通常检出一个默认分支，让你可以继续提交和切换。下载 ZIP 只有文件，浅克隆则有意减少历史范围。</>}
  >
    <ArticleSection id="clone-meaning" title="clone 一次建立了哪些东西">
      <p>假设远程仓库地址是 <code>https://example.test/app.git</code>。运行 <code>git clone</code> 后，本地目录里不只出现当前文件，还会有 <code>.git</code> 对象库、引用、默认分支和一个名为 <code>origin</code> 的远程配置。文件因此有来源，提交也有可追溯的历史。</p>
      <p id="clone-command" className="vp-citation-target"><code>git clone</code> 会创建目标目录，获取远程仓库需要的对象和引用，建立远程跟踪配置，并检出初始分支。参数可以改变目录、分支、深度或过滤范围，但不改变“取得仓库能力”这个核心动作。<Cite id="clone-command" sources={cloneSources} /></p>
      <p id="clone-remote" className="vp-citation-target">克隆通常会把远程地址写成 <code>origin</code>。之后可用 <code>git remote -v</code> 检查读写地址；remote 是本地配置，改名或增加其他远程不会自动下载新内容。<Cite id="clone-remote" sources={cloneSources} /></p>
      <GitWorkflowLesson slug="clone" />
    </ArticleSection>

    <ArticleSection id="clone-history" title="完整历史和浅历史差在哪里">
      <p id="clone-fetch" className="vp-citation-target">克隆过程需要从远程获取对象和引用；之后的 <code>git fetch</code> 仍可以把新的对象和远程跟踪引用带回本地。对象是否完整，决定你能否在本地直接查看更早提交、比较更长的历史或继续补齐历史。<Cite id="clone-fetch" sources={cloneSources} /></p>
      <p>用 <code>--depth 1</code> 的浅克隆，当前文件可能和完整克隆看起来一样，但本地只保留有限的提交历史。它适合某些构建或临时检查场景，却会让依赖祖先提交的操作需要先加深或转换历史。</p>
      <p>下载 ZIP 更简单：它可以给你一份工作文件，却没有 <code>.git</code>、提交对象和远程跟踪关系。以后想提交时，必须另行初始化并建立历史，这与从一开始 clone 得到的仓库不是同一个状态。</p>
    </ArticleSection>

    <ArticleSection id="clone-boundary" title="仓库到手不等于项目能运行">
      <p id="clone-init" className="vp-citation-target"><code>git init</code> 只是在已有目录创建新的空 Git 仓库；它不会替代 clone 去取得远程历史，也不会替你推断应当连接哪个团队仓库。两者都是建立仓库的入口，但输入和结果不同。<Cite id="clone-init" sources={cloneSources} /></p>
      <p id="clone-getting" className="vp-citation-target">Pro Git 把 clone 作为取得现有仓库的方式，并把首次取得代码与后续配置、构建和运行区分开。克隆完成后仍要按 README 安装依赖、准备环境变量和启动服务；这些步骤不是 Git 自动完成的。<Cite id="clone-getting" sources={cloneSources} /></p>
      <p><strong>读者判断：</strong>看到“仓库已经 clone 好了”，先确认三件事：<code>.git</code> 是否存在、<code>origin</code> 是否指向正确地址、默认分支是否已检出。再按项目说明准备运行环境，不要把文件出现误认为应用已经能启动。</p>
    </ArticleSection>
  </GitArticle>;
}
