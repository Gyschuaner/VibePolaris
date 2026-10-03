import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { ScopeLesson } from "../product-concept-lessons/scope";
import { scopeSources } from "@/lib/product-concept-sources/scope";

const sections: [string, string][] = [
  ["scope-goal", "先从用户任务和版本目标开始"],
  ["scope-boundary", "把包含、排除和依赖分开"],
  ["scope-change", "新增想法先评估影响"],
];

export function ScopeTermPage() {
  return <GitArticle
    slug="scope"
    title="范围"
    subtitle="Scope · 把本期目标、包含项和排除项说清楚"
    sources={scopeSources}
    sections={sections}
    hero={<GitHero contextLabel="先固定本期目标" contextTitle="导出当前筛选结果" trigger="需求讨论为什么总会从一个导出按钮扩展到完整报表平台？" change="目标 → 包含/排除 → 依赖与变更" proof="新增想法先判断影响，再决定是否改范围" />}
    intro={<>范围说明一次交付要解决的用户任务、包含哪些工作、明确不包含什么，以及依赖和约束在哪里。它让团队在新增想法出现时有共同的判断边界：先看是否仍服务当前目标，再决定记录为后续、替换现有工作，还是重新确认本期承诺。</>}
  >
    <ArticleSection id="scope-goal" title="先从用户任务和版本目标开始">
      <p id="scope-goal-detail" className="vp-citation-target">范围应从一个可以复述的用户任务和清楚的目标开始，而不是从一串功能名开始。比如“导出当前筛选结果为 CSV”说明谁要完成什么结果；“做一个报表平台”既没有限定任务，也无法判断本期做到哪里。<Cite id="scope-goal-detail" sources={scopeSources} /></p>
      <p id="scope-journey-detail" className="vp-citation-target">这个任务仍要放回更大的用户旅程里检查：用户怎样得到筛选条件，导出的文件接下来要在哪里使用，是否还有人工或其他服务参与。范围既不能窄到只做一个按钮，也不能宽到把整条报表旅程未经评估地都装进来。<Cite id="scope-journey-detail" sources={scopeSources} /></p>
      <p id="scope-validation-detail" className="vp-citation-target">目标还要有验证方式，例如确认用户能下载包含当前筛选结果的 CSV，并观察失败率或完成率。发现阶段的目标是减少对问题、约束和可行性的未知；如果证据改变，范围也应允许重新判断，而不是为了守住旧清单忽略结果。<Cite id="scope-validation-detail" sources={scopeSources} /></p>
      <ScopeLesson />
    </ArticleSection>

    <ArticleSection id="scope-boundary" title="把包含、排除和依赖分开">
      <p id="scope-include-detail" className="vp-citation-target">包含项应该直接服务当前任务：沿用已有筛选、生成 CSV、让用户手动下载，都是导出结果所需的工作。每一项都要能回答“没有它，用户还能完成这个目标吗”，否则它可能只是相邻想法或实现偏好。<Cite id="scope-include-detail" sources={scopeSources} /></p>
      <p id="scope-exclude-detail" className="vp-citation-target">排除项要明确写下，而不是留在会议记忆里。自定义图表和定时报表可能很有价值，但它们解决的是不同任务，可以作为后续候选保留；排除本期不等于否定价值，而是保护当前交付的边界。<Cite id="scope-exclude-detail" sources={scopeSources} /></p>
      <p id="scope-dependency-detail" className="vp-citation-target">依赖和约束也属于范围判断：字段权限是否允许导出，接口能否提供当前筛选结果，团队是否有足够时间验证大文件。把这些条件写出来，才能知道一个看似小的新增会不会改变可行性、责任归属或完成时间。<Cite id="scope-dependency-detail" sources={scopeSources} /></p>
    </ArticleSection>

    <ArticleSection id="scope-change" title="新增想法先评估影响">
      <p id="scope-change-detail" className="vp-citation-target">范围可以变化，但变化要经过一次明确的取舍：新增图表是否仍服务导出任务，会移出哪项工作，依赖和验收要怎样改，完成时间是否仍可接受。跨团队协作时还要确认整条用户问题没有被切成无人负责的碎片。<Cite id="scope-change-detail" sources={scopeSources} /></p>
      <p id="scope-capacity-detail" className="vp-citation-target">资源有限时，优先级帮助团队决定哪些结果先进入范围，哪些留到之后；这不是把每项工作贴上永久标签，而是根据用户影响、风险、时限、依赖和工作量反复重看。没有容量支撑的“顺便做一下”，仍然是范围变更。<Cite id="scope-capacity-detail" sources={scopeSources} /></p>
      <p id="scope-neighbor-detail" className="vp-citation-target">把几个相邻词分开：范围是本期要交付和明确排除的边界；优先级是在资源有限时决定先后的顺序；路线图把多个阶段的目标、价值和调整方向放在时间或顺序框架里；MVP 则是足够小、能验证关键假设或价值的可交付切片。一个想法可以在路线图或候选池里，却还没有进入本期范围。<Cite id="scope-neighbor-detail" sources={scopeSources} /></p>
      <p><strong>读者判断：</strong>听到“再加一个报表功能”时，先问四件事：它服务当前哪个用户任务？本期哪一项要让位？新增了什么依赖和验收条件？目标、时间或责任边界要不要重新确认？如果这些问题没有答案，就先记录候选，不要默默扩大承诺。</p>
    </ArticleSection>
  </GitArticle>;
}
