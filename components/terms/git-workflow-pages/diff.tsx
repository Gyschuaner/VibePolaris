import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { diffSources } from "@/lib/git-concept-sources/diff";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["diff-meaning", "Diff 先回答两份内容哪里不同"],
  ["diff-endpoints", "换端点，看到的范围就会变"],
  ["diff-boundary", "差异不是意图和测试结果"],
];

export function DiffTermPage() {
  return <GitArticle
    slug="diff"
    title="差异"
    subtitle="Diff · 比较两个内容端点"
    sources={diffSources}
    sections={sections}
    hero={<GitHero trigger="提交前怎样确认没有顺手改到无关内容？" change="选择两个端点 → 行级 hunk → 标出新增与删除" proof="工作树/index/HEAD/分支的端点不同，diff 的范围也不同" />}
    intro={<>Diff 是两个 Git 内容端点之间的比较结果。它把新增、删除和上下文按行组织成 hunk，帮助你确认改了什么；它不会替你判断为什么改、改得对不对。</>}
  >
    <ArticleSection id="diff-meaning" title="Diff 先回答两份内容哪里不同">
      <p>同一个文件可以同时有工作区版本、index 版本和 HEAD 版本。Diff 先选定两份内容，再计算它们的差异。减号表示左侧端点有而右侧没有的行，加号表示右侧新增的行，周围的上下文帮助你理解位置。</p>
      <p id="diff-default" className="vp-citation-target"><code>git diff</code> 的默认比较是工作树相对 index 的未暂存变化；加上 <code>--staged</code> 或 <code>--cached</code> 时，则比较 index 相对 HEAD 的下一次提交候选。命令名称相同，端点不同，回答的问题就不同。<Cite id="diff-default" sources={diffSources} /></p>
      <GitWorkflowLesson slug="diff" />
    </ArticleSection>

    <ArticleSection id="diff-endpoints" title="换端点，看到的范围就会变">
      <p id="diff-files" className="vp-citation-target"><code>git diff-files</code> 关注工作树与索引之间的差异，适合查看还没有加入暂存区的文件内容。它不会告诉你远程分支当前有什么新提交。<Cite id="diff-files" sources={diffSources} /></p>
      <p id="diff-index" className="vp-citation-target"><code>git diff-index</code> 可以把工作树或指定树对象与索引比较；它把“当前文件系统”和 Git 已记录的候选内容放在两个端点上。<Cite id="diff-index" sources={diffSources} /></p>
      <p id="diff-tree" className="vp-citation-target"><code>git diff-tree</code> 用提交或树对象作为比较对象，也可以沿提交关系查看树的变化。比较分支时，先确定要比较的两个引用和共同基线，避免把错误的端点当成目标范围。<Cite id="diff-tree" sources={diffSources} /></p>
      <p>演示把同一份示例改动放在三种端点之间：工作树对 index、index 对 HEAD、feature 对 main。切换端点后，行级 hunk 随之变化；这说明 diff 是端点函数，不是在页面里固定的一张“改动清单”。</p>
    </ArticleSection>

    <ArticleSection id="diff-boundary" title="差异不是意图和测试结果">
      <p id="diff-recording" className="vp-citation-target">Pro Git 建议在暂存和提交前检查具体差异，再把相关修改记录为一个可解释的提交。Diff 提供证据让你核对范围，但提交意图仍要靠说明、上下文和审查补足。<Cite id="diff-recording" sources={diffSources} /></p>
      <p>一段绿色新增代码只能说明两个端点不同，不能证明它修复了问题；一段红色删除也不等于可以安全移除。还要结合需求、运行结果、测试覆盖和边界输入，判断变化是否完成了目标。</p>
      <p><strong>读者判断：</strong>看 diff 时先问“比较的是哪两个端点？”再问“每个 hunk 属于哪条意图？”最后问“哪项检查能证明它没有破坏行为？”如果只能回答第一问，审查还没有完成。</p>
    </ArticleSection>
  </GitArticle>;
}
