import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite } from "../GitConceptPageShared";
import { TargetUserHero } from "./target-user-hero";
import { targetUserSources } from "@/lib/product-concept-sources/target-user";

const sections: [string, string][] = [
  ["target-user-evidence", "从任务和证据开始"],
  ["target-user-context", "把频率、能力和环境写出来"],
  ["target-user-scope", "选择当前服务范围"],
];

export function TargetUserTermPage() {
  return <GitArticle
    slug="target-user"
    title="目标用户"
    subtitle="Target User · 把服务对象按任务和限制说清楚"
    sources={targetUserSources}
    sections={sections}
    hero={<TargetUserHero />}
    intro={<>目标用户是当前版本优先服务的人：由共同任务、频率、权限和使用环境划出可解释的范围。它帮助团队判断先研究谁、先解决什么，以及哪些需求要明确留到后续，而不是凭人口标签虚构一个完整人物。</>}
  >
    <ArticleSection id="target-user-evidence" title="从任务和证据开始">
      <p id="target-user-evidence-detail" className="vp-citation-target">先问用户正在努力完成什么、现在通过什么渠道完成、哪里遇到阻碍，再决定本期要服务谁。访谈、观察、分析数据和已有反馈可以互相印证；只有团队自己的猜测时，应把它标成待验证假设。<Cite id="target-user-evidence-detail" sources={targetUserSources} /></p>
      <p id="target-user-profile-detail" className="vp-citation-target">用户画像或用户档案的作用，是把行为和需要相近的人归成一组，方便团队讨论共同约束。它不是为每个人补写姓名、性格和生活故事，也不能用一个好听的群组名称掩盖任务没有说清。<Cite id="target-user-profile-detail" sources={targetUserSources} /></p>
      <p id="target-user-research-detail" className="vp-citation-target">研究对象要覆盖真实或可能使用服务的人，并根据任务、问题情境、访问方式和经验设定招募条件。这样得到的目标组才有证据来源，而不是只挑最容易联系的一小撮人。<Cite id="target-user-research-detail" sources={targetUserSources} /></p>
    </ArticleSection>

    <ArticleSection id="target-user-context" title="把频率、能力和环境写出来">
      <p id="target-user-context-detail" className="vp-citation-target">“财务专员”还不够具体：要补上每月批量导出、需要核对字段、拥有哪些权限、在哪种设备和网络中操作等条件。频率和成功标准会改变性能、默认值、入口与支持方式，才是真正能指导设计的差异。<Cite id="target-user-context-detail" sources={targetUserSources} /></p>
      <p id="target-user-access-detail" className="vp-citation-target">访问方式、辅助技术、数字技能和障碍也属于使用条件。把这些条件纳入目标组，不是给人贴标签，而是避免把服务只按“典型用户”的路径设计，遗漏真实用户完成任务所需的支持。<Cite id="target-user-access-detail" sources={targetUserSources} /></p>
      <p>“所有人都能用”可以作为包容性的方向，却不能替团队排出本期工作。先写出当前重点组和它的任务边界，再记录其他用户要完成什么、为何暂不覆盖以及何时重新研究。</p>
    </ArticleSection>

    <ArticleSection id="target-user-scope" title="选择当前服务范围">
      <p id="target-user-scope-detail" className="vp-citation-target">目标用户是当前服务范围中的优先判断主体，不是永远排除其他人。团队应把用户目标和整个服务上下文放在一起，明确本版先让哪组人完成哪项任务，同时把未覆盖的组和相邻服务写进下一步。<Cite id="target-user-scope-detail" sources={targetUserSources} /></p>
      <p id="target-user-validation-detail" className="vp-citation-target">范围确定后仍要持续验证：在发现、原型和上线后的数据中，检查目标组是否真的完成了任务，新的证据是否改变了优先级。目标用户是一个可修正的研究结论，不是项目开始时一次性填完的字段。<Cite id="target-user-validation-detail" sources={targetUserSources} /></p>
      <p><strong>读者判断：</strong>当需求写着“面向所有用户”时，先追问“谁在什么环境里完成什么任务，频率和权限怎样，成功结果如何被观察？”如果这些信息还不存在，先补研究条件与范围边界，再讨论功能优先级。</p>
    </ArticleSection>
  </GitArticle>;
}
