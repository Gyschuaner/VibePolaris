import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { checkoutSwitchSources } from "@/lib/git-concept-sources/checkout-switch";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["checkout-switch-meaning", "switch 真的改变了什么"],
  ["checkout-switch-safety", "未提交修改为什么会挡住切换"],
  ["checkout-switch-boundary", "checkout 不是一个万能的恢复键"],
];

export function CheckoutSwitchTermPage() {
  return <GitArticle
    slug="checkout-switch"
    title="切换分支"
    subtitle="Checkout / Switch · 让 HEAD 与工作区转到另一条线"
    sources={checkoutSwitchSources}
    sections={sections}
    hero={<GitHero trigger="我想查看另一条分支，当前文件又有没提交的修改，怎样避免把它覆盖？" change="确认状态 → 尝试切换 → 遇到覆盖风险先停下" proof="switch 会移动 HEAD 并更新 index/工作区；可能覆盖的本地修改会让切换停在闸门前" />}
    intro={<>分支切换是把当前观察位置从一条提交线换到另一条线。<code>git switch</code> 主要负责这件事；旧的 <code>git checkout</code> 同时承担切换分支和恢复路径，所以读命令时要先分清它要改变的是分支指针，还是文件内容。</>}
  >
    <ArticleSection id="checkout-switch-meaning" title="switch 真的改变了什么">
      <p>假设你在 <code>feature</code> 上工作，HEAD 指向提交 F。运行 <code>git switch dev</code> 后，HEAD 改为跟随 <code>dev</code>；Git 也会尝试把 index 和工作区更新为 dev 所指向的文件版本。它改变的是当前检出的历史线，不是复制一个新项目目录。</p>
      <p id="checkout-switch" className="vp-citation-target"><code>git switch</code> 用于切换分支，也可以在切换时创建新分支。成功后当前分支名和 HEAD 一起指向目标线，工作区应该反映该分支的提交内容。<Cite id="checkout-switch" sources={checkoutSwitchSources} /></p>
      <p id="checkout-status" className="vp-citation-target"><code>git status</code> 会把当前分支、已暂存变化、未暂存变化和未跟踪文件放在同一个状态视图里。切换前先看它，才能知道工作区是否已经有需要保护的内容。<Cite id="checkout-status" sources={checkoutSwitchSources} /></p>
      <GitWorkflowLesson slug="checkout-switch" />
    </ArticleSection>

    <ArticleSection id="checkout-switch-safety" title="未提交修改为什么会挡住切换">
      <p id="checkout-legacy" className="vp-citation-target">旧式 <code>git checkout dev</code> 也能切换分支，但它还可以把某个路径恢复到指定来源。无论使用哪个入口，Git 都会先判断目标提交写入工作区后是否会覆盖本地修改；有风险时，安全的默认行为是停止，而不是替你猜这份修改是否可以丢掉。<Cite id="checkout-legacy" sources={checkoutSwitchSources} /></p>
      <p>演示里的 <code>theme.css</code> 只改在工作区，feature 的未提交颜色与 dev 的版本发生冲突。此时继续切换会让你失去尚未记录的内容，所以闸门显示“不能直接切换”。这不是分支坏了，而是 Git 在保护当前文件系统里的证据。</p>
      <p id="checkout-stash" className="vp-citation-target">如果这份修改暂时不能提交，可以用 <code>git stash</code> 把工作区和 index 的改动临时保存起来，再切换分支；回到合适的上下文后，还要检查并应用这份保存的改动。stash 是本地临时记录，不等于提交历史或远程备份。<Cite id="checkout-stash" sources={checkoutSwitchSources} /></p>
      <p>另一个选择是先创建一个表达清楚的提交，再切换。提交和 stash 都要先确认修改属于哪个任务；如果它本来就是当前 feature 的一部分，留在原分支继续完成通常比强行搬运更容易审查。</p>
    </ArticleSection>

    <ArticleSection id="checkout-switch-boundary" title="checkout 不是一个万能的恢复键">
      <p id="checkout-restore" className="vp-citation-target"><code>git restore</code> 把恢复文件内容的意图单独表达出来，可以指定从 index 或某个提交恢复工作区，也可以用 <code>--staged</code> 改变 index。它不会替你判断哪些本地修改值得保留，执行前仍要核对来源和目标层。<Cite id="checkout-restore" sources={checkoutSwitchSources} /></p>
      <p>不要把 <code>switch --discard-changes</code> 或类似强制选项当作普通的“解决冲突”按钮。它可能直接丢掉未提交内容；即使命令成功，成功也只说明文件被更新，不说明你想保留的工作还在。</p>
      <p><strong>读者判断：</strong>切换前先回答三个问题：当前 HEAD 在哪条分支？<code>git status</code> 列出了哪些未提交内容？这些内容应该提交、临时保存，还是继续留在当前分支？能回答清楚，再让 switch 改变工作区。</p>
    </ArticleSection>
  </GitArticle>;
}
