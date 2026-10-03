import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { UserStoryLesson } from "../product-concept-lessons/user-story";
import { userStorySources } from "@/lib/product-concept-sources/user-story";

const sections: [string, string][] = [
  ["user-story-need", "从有证据的用户需要开始"],
  ["user-story-shape", "角色、任务和目标要写全"],
  ["user-story-acceptance", "用结果划定完成边界"],
];

export function UserStoryTermPage() {
  return <GitArticle
    slug="user-story"
    title="用户故事"
    subtitle="User Story · 把用户目标切成可验证的工作项"
    sources={userStorySources}
    sections={sections}
    hero={<GitHero contextLabel="先从需要开始" contextTitle="财务人员 · 月度账单" trigger="“增加导出按钮”到底服务谁，又解决什么任务？" change="角色 → 目标 → 验收结果" proof="每个结果都能检查；方案细节留给后续讨论" />}
    intro={<>用户故事用使用者的语言描述一项可交付的需求：谁要完成什么，以及这样做要得到什么结果。它把研究得到的需要连接到实现和测试，但不把一张格式化句子当成证据，也不代替完整的设计和业务规则。</>}
  >
    <ArticleSection id="user-story-need" title="从有证据的用户需要开始">
      <p id="user-story-evidence" className="vp-citation-target">“增加导出按钮”先停在方案层：它没有说明谁遇到什么任务，也没有证据证明按钮能改善结果。用户需要应来自访谈、观察、搜索日志或已有数据；没有来自用户的意见只能先当作待验证的假设。<Cite id="user-story-evidence" sources={userStorySources} /></p>
      <p id="user-story-need-detail" className="vp-citation-target">好的需要通常用用户能认出的词来写，先描述要完成的事情和原因，再决定是否需要补充角色、触发条件或限制。这样写出的目标能跨越一个具体界面，避免把“需要提醒”过早缩成“需要邮件”。<Cite id="user-story-need-detail" sources={userStorySources} /></p>
      <p id="user-story-traceability" className="vp-citation-target">用户需要通常更宽、更稳定；用户故事则把其中一段具体工作切成团队能交付的大小，并保留它对应的需要。沿着这条关系回看，团队才知道一个故事完成后到底帮助了哪个用户结果。<Cite id="user-story-traceability" sources={userStorySources} /></p>
      <UserStoryLesson />
    </ArticleSection>

    <ArticleSection id="user-story-shape" title="角色、任务和目标要写全">
      <p id="user-story-shape-copy" className="vp-citation-target">常见写法是“作为……，我想要……，以便……”：第一段指出使用者，第二段说明要做的事，第三段说明原因或目标。格式可以调整，但这三个信息不能因为句子变短就消失。<Cite id="user-story-shape-copy" sources={userStorySources} /></p>
      <p id="user-story-goal-detail" className="vp-citation-target">目标是故事里最能帮助团队做判断的一段：它让大家检查是不是在解决对的问题，也帮助判断什么时候已经满足了用户需要。若只能写出“增加按钮”却写不出用户要得到什么，应先回到问题和研究，而不是继续堆功能名。<Cite id="user-story-goal" sources={userStorySources} /></p>
      <p>用户故事是协作材料，不是完整设计稿。页面布局、权限规则、异常流程和技术拆分可以在讨论中补充，但不能用这些细节掩盖角色、任务和目标没有说清。</p>
    </ArticleSection>

    <ArticleSection id="user-story-acceptance" title="用结果划定完成边界">
      <p id="user-story-acceptance-detail" className="vp-citation-target">验收标准应写成结果清单，例如“完成时，用户能选择月份并下载账单；没有账单时，用户能知道下一步怎么做”。它们是确认服务是否完成工作的检查点，还应链接到支持这项判断的证据，而不是把实现步骤或组件名称列成清单。<Cite id="user-story-acceptance" sources={userStorySources} /></p>
      <p id="user-story-scrum-boundary" className="vp-citation-target">“用户故事”是常见的需求写法，不是 Scrum 唯一承认的句式。Scrum Guide 讨论的是 Product Backlog item（产品待办项）和 Definition of Done（完成的正式质量定义）：故事可以用来描述待办项，验收标准也可以作为团队检查结果的清单，但二者不能替代产品级的完成定义。<Cite id="user-story-scrum-boundary" sources={userStorySources} /></p>
      <p id="user-story-epic-detail" className="vp-citation-target">如果一个故事要花几周才能开发和测试，它可能已经是一个 epic。拆成更小的故事时，仍要让每一条产生可感知的用户价值；只按前端、后端、数据库切片，会失去原来的用户结果。<Cite id="user-story-epic" sources={userStorySources} /></p>
      <p id="user-story-card-detail" className="vp-citation-target">把故事记录在团队共同能访问的卡片或 backlog 中，开始实施前再补充讨论结果。卡片的作用是让团队围绕同一个用户目标排序、提问和复述，不是把所有设计决策提前写死。<Cite id="user-story-card" sources={userStorySources} /></p>
      <p><strong>读者判断：</strong>看到一条用户故事时，先问“我能指出真实用户、要完成的任务和原因吗？完成时能观察到什么结果？这条结果能追溯到哪份证据？”如果答不上来，先补研究或澄清目标，再进入设计。</p>
    </ArticleSection>
  </GitArticle>;
}
