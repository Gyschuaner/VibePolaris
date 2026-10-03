import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { codeReviewSources } from "@/lib/git-concept-sources/code-review";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["review-purpose", "先确认目标，再读每个文件的差异"],
  ["review-action", "把意见写成可以复现和处理的动作"],
  ["review-boundary", "评审结论不代替运行验证"],
];

export function CodeReviewTermPage() {
  return <GitArticle
    slug="code-review"
    title="代码评审"
    subtitle="Code Review · 用目标、上下文和证据判断一组改动是否可靠"
    sources={codeReviewSources}
    sections={sections}
    hero={<GitHero trigger="看到一处代码改动，怎样判断这是可接受的行为还是需要作者修复的缺陷？" change="确认目标 → 读上下文 + diff → 复现 / 验证 → 留下可行动意见" proof="意见指向场景和影响；approve / request changes 不代替测试" />}
    intro={<>代码评审不是给代码风格打分，而是把需求、差异、调用上下文和验证证据连起来。评审者要说明“在什么输入下会发生什么影响”，让作者能复现、修复并重新验证。</>}
  >
    <ArticleSection id="review-purpose" title="先确认目标，再读每个文件的差异">
      <p>一份 PR 可能同时改接口、状态处理和测试。先读它要解决的问题、验收条件和风险，再逐个文件查看变化；如果只从一行代码的个人偏好出发，容易把正确的设计当成缺陷。</p>
      <p id="review-context" className="vp-citation-target">GitHub 的评审流程建议先理解 PR 的动机与关联上下文，再逐个文件检查改动。目标决定评审应该关注哪些输入、状态和失败路径。<Cite id="review-context" sources={codeReviewSources} /></p>
      <p id="review-files" className="vp-citation-target">在 Files changed 中逐个查看文件、标记已读并跟踪进度，可以避免只看最显眼的文件而漏掉配置、迁移或测试变化。<Cite id="review-files" sources={codeReviewSources} /></p>
      <p id="review-diff" className="vp-citation-target"><code>git diff</code> 告诉你两个端点之间的文本变化，但它不会替你判断业务意图。把 diff 放回调用者、数据形状和错误处理的上下文，才知道变化是否完整。<Cite id="review-diff" sources={codeReviewSources} /></p>
      <GitWorkflowLesson slug="code-review" />
    </ArticleSection>

    <ArticleSection id="review-action" title="把意见写成可以复现和处理的动作">
      <p id="review-comment" className="vp-citation-target">“这里不好”只表达了感觉，作者不知道要改什么。更有用的评论会指出文件或行、触发输入、实际结果、预期结果和影响，例如“传入空数组时读取 <code>items[0]</code>，接口返回 500；这里应返回空结果，并补一个回归测试”。<Cite id="review-comment" sources={codeReviewSources} /></p>
      <p id="review-line-comment" className="vp-citation-target">把意见贴在具体行或连续代码范围上，让讨论留在变化发生的位置；如果已经有明确替代写法，可以用 suggestion 提供可直接应用的修改，但仍要说明行为原因。<Cite id="review-line-comment" sources={codeReviewSources} /></p>
      <p id="review-suggestion" className="vp-citation-target">多个意见可以先作为待提交的 review comments，最后一次提交 summary 和决策，避免作者收到一串互相脱节的通知。<Cite id="review-suggestion" sources={codeReviewSources} /></p>
      <p id="review-decision" className="vp-citation-target">提交评审时可以选择 comment、approve 或 request changes。request changes 表示在合并前需要处理反馈；approve 表示评审者认为当前改动可以进入合并判断，但不等于所有自动检查都已通过。<Cite id="review-decision" sources={codeReviewSources} /></p>
    </ArticleSection>

    <ArticleSection id="review-boundary" title="评审结论不代替运行验证">
      <p id="review-approval" className="vp-citation-target">即使出现 approve，也要确认对应的测试、构建、权限和失败路径确实执行过。评审是对证据的判断，不是对未运行场景的保证；作者推送修复后，旧结论还需要重新检查。<Cite id="review-approval" sources={codeReviewSources} /></p>
      <p id="review-conversation" className="vp-citation-target">讨论解决后要保留决策上下文，未解决或过时的 conversation 不能被“看过”替代。修复超出当前 PR 范围时，应记录后续问题，而不是为了让页面变绿而忽略它。<Cite id="review-conversation" sources={codeReviewSources} /></p>
      <p><strong>读者判断：</strong>先问这段代码要保护什么行为，再用最小输入复现风险，最后给出作者能执行的修复和验证方式。纯格式或个人偏好可以作为建议，但不要把它们写成阻断合并的缺陷。</p>
    </ArticleSection>
  </GitArticle>;
}
