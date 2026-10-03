import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { PriorityLesson } from "../product-concept-lessons/priority";
import { prioritySources } from "@/lib/product-concept-sources/priority";

const sections: [string, string][] = [
  ["priority-goal", "先把当前目标说清楚"],
  ["priority-factors", "用多个因素比较取舍"],
  ["priority-review", "证据变化后重新排序"],
];

export function PriorityTermPage() {
  return <GitArticle
    slug="priority"
    title="优先级"
    subtitle="Priority · 资源有限时决定先做什么"
    sources={prioritySources}
    sections={sections}
    hero={<GitHero contextLabel="先保护当前目标" contextTitle="降低首次配置失败率" trigger="三个需求都说“很重要”，团队该怎样决定先后？" change="共同目标 → 多维比较 → 证据驱动重排" proof="每项先后都能说出依据" />}
    intro={<>优先级是在资源有限时，根据当前目标、用户影响、时限、风险、依赖和工作量形成的工作顺序。它让团队说清楚为什么先做一项、另一项暂缓，以及哪些新信息会让顺序改变；它不是谁声音大谁先做，也不是贴上标签后永远不变。</>}
  >
    <ArticleSection id="priority-goal" title="先把当前目标说清楚">
      <p id="priority-goal-detail" className="vp-citation-target">优先级必须依附一个共同目标。假设本期要降低首次配置失败率，那么诊断故障、修复登录阻塞和界面微调的先后，就应围绕用户能否完成配置来判断；离开目标谈“最重要”，没有可比较的参照。<Cite id="priority-goal-detail" sources={prioritySources} /></p>
      <p id="priority-problem-detail" className="vp-citation-target">先确认正在解决的问题和受影响的人，再比较候选工作。发现阶段的研究和问题证据能说明影响是否真实、频率有多高，以及某项工作是否只是提出者的偏好；优先级不是把未经验证的想法直接排进队列。<Cite id="priority-problem-detail" sources={prioritySources} /></p>
      <PriorityLesson />
    </ArticleSection>

    <ArticleSection id="priority-factors" title="用多个因素比较取舍">
      <p id="priority-method-detail" className="vp-citation-target">比较时至少看用户影响、紧迫性、风险、依赖和实施代价。核心流程故障可能立即阻塞用户，合规截止项可能有固定日期，界面微调也许收益较小；把它们放在同一张表上，团队才能看见取舍，而不是被单一分数掩盖。<Cite id="priority-method-detail" sources={prioritySources} /></p>
      <p id="priority-capacity-detail" className="vp-citation-target">资源包括时间、人员、技能和可用材料。优先级方法可以帮助团队达成共识，例如把必须做、应该做、可以做和当前不做分开，但方法本身不是答案；要说明它怎样服务当前目标，以及容量是否真的允许。<Cite id="priority-capacity-detail" sources={prioritySources} /></p>
      <p id="priority-dependency-detail" className="vp-citation-target">依赖会改变“先做什么”的含义：一个收益很高的功能，如果必须等待权限、接口或另一团队，可能要先安排解除依赖的工作。把依赖写出来，既能解释顺序，也能避免把等待误认为执行缓慢。<Cite id="priority-dependency-detail" sources={prioritySources} /></p>
    </ArticleSection>

    <ArticleSection id="priority-review" title="证据变化后重新排序">
      <p id="priority-evidence-detail" className="vp-citation-target">优先级不是永久的 P0/P1。新的用户研究、性能数据、故障范围、截止时间或团队容量出现时，应重新检查判断；重要的是保留“为什么现在排在这里”的依据，方便团队挑战、复盘和交接。<Cite id="priority-evidence-detail" sources={prioritySources} /></p>
      <p id="priority-roadmap-detail" className="vp-citation-target">优先级和路线图有关但粒度不同：优先级给当前候选工作排序，路线图说明多个阶段怎样通向产品目标；范围决定本期包含和排除什么。迭代（iteration）是在已定范围内交付并验证一轮增量，优先级决定先做哪一轮或哪项工作，不等于迭代本身的周期。把这些概念混成一张功能清单，会让暂缓、后续和当前承诺失去区别。<Cite id="priority-roadmap-detail" sources={prioritySources} /></p>
      <p id="priority-review-detail" className="vp-citation-target">排序应定期复核，而不是只在计划会开一次。若高影响问题已经解决、风险降低或新依赖出现，顺序就可以调整；改变顺序时同步说明受到影响的范围、阶段和验收，团队才不会只看到“卡片移动”却不理解原因。<Cite id="priority-review-detail" sources={prioritySources} /></p>
      <p><strong>读者判断：</strong>有人说“这个需求最重要”时，先追问：它服务哪个目标？影响谁、影响多大、何时必须处理？有哪些依赖、风险和成本？如果这些输入变化，什么证据会让我们改排？</p>
    </ArticleSection>
  </GitArticle>;
}
