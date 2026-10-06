import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite } from "../GitConceptPageShared";
import { ProblemStatementHero } from "./problem-statement-hero";
import { problemStatementSources } from "@/lib/product-concept-sources/problem-statement";

const sections: [string, string][] = [
  ["problem-statement-evidence", "从用户事实开始，不从功能名开始"],
  ["problem-statement-structure", "把场景、阻碍和影响连起来"],
  ["problem-statement-boundary", "固定问题边界，保留方案选择"],
];

export function ProblemStatementTermPage() {
  return <GitArticle
    slug="problem-statement"
    title="问题陈述"
    subtitle="Problem Statement · 把事实与影响写成可解决的问题"
    sources={problemStatementSources}
    sections={sections}
    hero={<ProblemStatementHero />}
    intro={<>问题陈述把一个真实的人在真实场景里遇到的阻碍写清楚，并说明它造成了什么影响。它让团队先对要解决的事情形成共识，再比较不同方案；问题本身不是功能规格，也不是把“痛点”换一种说法。</>}
  >
    <ArticleSection id="problem-statement-evidence" title="从用户事实开始，不从功能名开始">
      <p id="problem-statement-evidence-detail" className="vp-citation-target">问题陈述要从用户正在努力完成的事情开始。客服查历史订单时要完成的是“尽快确认订单状态”，不是“使用智能搜索”；访谈、观察、搜索日志和服务数据可以帮助确认实际行为，单句“大家很痛苦”只能先当作待验证的判断。<Cite id="problem-statement-evidence" sources={problemStatementSources} /></p>
      <p id="problem-statement-solution-detail" className="vp-citation-target">发现阶段经常有人直接带来一个预设方案，例如“做一个互动地图”或“做一个 AI 搜索”。先把这句话改写成要解决的问题，拆开其中的假设，再去研究用户和环境，才能避免在没有证据时把答案当成目标。<Cite id="problem-statement-solution" sources={problemStatementSources} /></p>
      <p id="problem-statement-context-detail" className="vp-citation-target">不要只截取用户点按钮的几秒：还要看他之前怎样找到入口、之后要把结果交给谁、有没有其他渠道或限制。问题陈述里的“场景”不是背景故事，而是决定阻碍是否真实、影响是否重要的上下文。<Cite id="problem-statement-context" sources={problemStatementSources} /></p>
    </ArticleSection>

    <ArticleSection id="problem-statement-structure" title="把场景、阻碍和影响连起来">
      <p id="problem-statement-structure-detail" className="vp-citation-target">一条可讨论的问题至少要能回答四件事：谁在什么场景中，想完成什么，在哪一步被什么阻碍，结果付出了什么成本。Design Council 的 Double Diamond 把“理解问题”和“定义挑战”分成前半段；这提醒我们先收集和归纳洞察，再决定问题怎么命名。<Cite id="problem-statement-structure" sources={problemStatementSources} /></p>
      <p id="problem-statement-whole-detail" className="vp-citation-target">问题范围不能窄到只修一个按钮，也不能宽到“改善所有客服体验”。要把它放回完整旅程，看看相邻团队、线下渠道和已有服务怎样共同影响结果；有时更好的答案是调整流程、内容或协作方式，而不是新增一个功能。<Cite id="problem-statement-whole" sources={problemStatementSources} /></p>
      <p>把“用户说了什么”“团队推断了什么”“待验证的影响”分开记录。事实可以被复核，解释可以被讨论，假设则需要下一轮研究或原型验证；三者混成一句口号，后续方案会失去判断依据。</p>
    </ArticleSection>

    <ArticleSection id="problem-statement-boundary" title="固定问题边界，保留方案选择">
      <p id="problem-statement-options-detail" className="vp-citation-target">问题写清后，团队才有理由比较多个答案。Double Diamond 的“开发”阶段鼓励针对已定义的问题提出不同方案，并用小规模测试淘汰不工作的想法；问题陈述不应该把“采用 AI”或“增加筛选器”写成既定结论。<Cite id="problem-statement-options" sources={problemStatementSources} /></p>
      <p id="problem-statement-boundary-detail" className="vp-citation-target">边界还要说明本次不处理什么，以及它和其他服务怎样衔接。GOV.UK 建议按用户思考和要做的事控制范围，既不要只解决旅程的一小段，也不要把所有相关问题打包进一个项目。<Cite id="problem-statement-boundary" sources={problemStatementSources} /></p>
      <p id="problem-statement-measure-detail" className="vp-citation-target">最后写出如何知道问题真的变小了，例如查单完成时间、转人工比例、漏答率或用户能否一次找到正确订单。指标不是为了给问题包装数字，而是让“改善”变成下一轮研究可以检查的结果。<Cite id="problem-statement-measure" sources={problemStatementSources} /></p>
      <p><strong>读者判断：</strong>看到“我们需要做某功能”时，先追问“谁在什么场景里做什么，哪里卡住了，有什么证据，影响怎样被观察？”如果这四项还答不出来，先补研究和问题边界，不要急着给方案排期。</p>
    </ArticleSection>
  </GitArticle>;
}
