import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { RoadmapLesson } from "../product-concept-lessons/roadmap";
import { roadmapSources } from "@/lib/product-concept-sources/roadmap";

const sections: [string, string][] = [
  ["roadmap-vision", "先把用户价值放在前面"],
  ["roadmap-stage", "把方向拆成阶段结果"],
  ["roadmap-change", "让证据、依赖和不确定性可见"],
];

export function RoadmapTermPage() {
  return <GitArticle
    slug="roadmap"
    title="路线图"
    subtitle="Roadmap · 按目标和阶段说明产品接下来解决什么"
    sources={roadmapSources}
    sections={sections}
    hero={<GitHero contextLabel="先看产品要改变什么" contextTitle="降低首次配置失败率" trigger="路线图应该是一张固定功能日期表，还是会随证据调整的计划？" change="用户价值 → 阶段结果 → 依赖与复盘" proof="远期保留假设，近期明确下一步" />}
    intro={<>路线图把产品或服务接下来要为用户带来的价值、阶段性目标和主要依赖放在一个可沟通的方向框架里。它帮助团队理解现在的工作怎样通向更远的目标，也让不确定的远期判断保持可调整；它不是把每个任务排成精确日期的 backlog。</>}
  >
    <ArticleSection id="roadmap-vision" title="先把用户价值放在前面">
      <p id="roadmap-vision-detail" className="vp-citation-target">路线图先回答“我们要为用户改变什么”，再说明会经过哪些阶段。比如“降低首次配置失败率”是一个可以观察的方向；只写“Q3 做诊断页、Q4 做引导页”会让功能日期遮住真正要解决的问题。<Cite id="roadmap-vision-detail" sources={roadmapSources} /></p>
      <p id="roadmap-level-detail" className="vp-citation-target">计划的详细程度要跟时间距离匹配：近期工作可以写到下一步结果和依赖，远期只保留目标、假设和大致阶段。这样团队能协调投入，又不会把还没有证据的方案误读成承诺。<Cite id="roadmap-level-detail" sources={roadmapSources} /></p>
      <RoadmapLesson />
    </ArticleSection>

    <ArticleSection id="roadmap-stage" title="把方向拆成阶段结果">
      <p id="roadmap-stage-detail" className="vp-citation-target">每个阶段都应有自己的目标、预期价值和衡量方式。先补诊断，是为了知道失败发生在哪一步；再优化引导，是在证据支持后减少用户卡住的次数。阶段不是把一长串功能平均切开，而是让每一轮都能交付并学习。<Cite id="roadmap-stage-detail" sources={roadmapSources} /></p>
      <p id="roadmap-priority-detail" className="vp-citation-target">路线图可以表达当前先做什么，但这个顺序应和优先级判断一致，并能说明用户影响、风险、依赖或时限。优先级是此刻的排序依据，路线图则把多个阶段如何连向目标讲出来；二者都应随着信息变化定期重看。<Cite id="roadmap-priority-detail" sources={roadmapSources} /></p>
      <p id="roadmap-dependency-detail" className="vp-citation-target">阶段之间可能有技术、合规、团队或外部服务依赖。把依赖放在阶段旁边，团队才能发现“先做后面的功能”其实会等待前置条件，也能让相关团队看到自己何时需要参与。<Cite id="roadmap-dependency-detail" sources={roadmapSources} /></p>
    </ArticleSection>

    <ArticleSection id="roadmap-change" title="让证据、依赖和不确定性可见">
      <p id="roadmap-change-detail" className="vp-citation-target">路线图记录的是意图，不是锁死的解决方案。越远的阶段越不确定；研究、性能数据和利益相关者反馈出现后，可以加入、删除或重排项目。把远期日期写得很精确，反而会让团队忘记它仍是一个待验证的判断。<Cite id="roadmap-change-detail" sources={roadmapSources} /></p>
      <p id="roadmap-evidence-detail" className="vp-citation-target">复盘时要问阶段是否真的带来预期价值，而不是只问卡片有没有变成完成。根据结果保留、调整或停止下一阶段，路线图才会成为学习工具；它也应该记录维护人、更新频率和读者怎样理解它。<Cite id="roadmap-evidence-detail" sources={roadmapSources} /></p>
      <p id="roadmap-not-backlog-detail" className="vp-citation-target">路线图和 backlog 的粒度不同：路线图帮助团队和协作方理解目标、阶段和取舍，backlog 管理较短周期内的功能与任务。把所有任务都塞进路线图，会让方向图变成难以阅读的排期表。<Cite id="roadmap-not-backlog-detail" sources={roadmapSources} /></p>
      <p><strong>读者判断：</strong>看到“下季度完成 12 个功能”时，先问：这些功能共同要改善哪项用户结果？每个阶段怎样证明带来了价值？有哪些依赖或假设尚未确认？如果证据改变，哪些部分能重排而不把旧日期当成承诺？</p>
    </ArticleSection>
  </GitArticle>;
}
