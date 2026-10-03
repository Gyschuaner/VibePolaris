import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { AcceptanceCriteriaLesson } from "../product-concept-lessons/acceptance-criteria";
import { acceptanceCriteriaSources } from "@/lib/product-concept-sources/acceptance-criteria";

const sections: [string, string][] = [
  ["acceptance-purpose", "从用户结果定义完成"],
  ["acceptance-shape", "给定条件、动作和结果"],
  ["acceptance-boundary", "把失败、权限与回归写进边界"],
];

export function AcceptanceCriteriaTermPage() {
  return <GitArticle
    slug="acceptance-criteria"
    title="验收标准"
    subtitle="Acceptance Criteria · 把需求变成可检查的完成结果"
    sources={acceptanceCriteriaSources}
    sections={sections}
    hero={<GitHero contextLabel="先检查登录结果" contextTitle="未登录用户 · 设置页" trigger="“登录功能已经做好”应由哪些具体结果判断？" change="模糊评价 → Given/When/Then → 可观察边界" proof="正常、错误与权限结果都能检查" />}
    intro={<>验收标准把一项需求的完成边界写成可以执行和观察的结果：在什么条件下，谁做了什么，系统应让用户或外部系统看到什么。它连接用户故事、实现和测试，不是内部步骤清单，也不是“体验良好”这样的主观评价。</>}
  >
    <ArticleSection id="acceptance-purpose" title="从用户结果定义完成">
      <p id="acceptance-purpose-detail" className="vp-citation-target">先从用户故事里的目标写结果，再问“完成时用户能知道什么、做成什么”。验收标准是一份检查清单，用来确认服务是否完成工作并满足用户需要；它应能追溯到故事和支持这项判断的证据。<Cite id="acceptance-purpose-detail" sources={acceptanceCriteriaSources} /></p>
      <p id="acceptance-boundary-detail" className="vp-citation-target">验收标准描述产品应表现出的行为和结果，不规定一定要用哪个组件、接口或数据库实现。实现可以变化，只要用户目标和约定结果仍然成立；如果目标本身改变，应回到需求重新讨论，而不是悄悄改验收句子。<Cite id="acceptance-boundary-detail" sources={acceptanceCriteriaSources} /></p>
      <AcceptanceCriteriaLesson />
    </ArticleSection>

    <ArticleSection id="acceptance-shape" title="给定条件、动作和结果">
      <p id="acceptance-shape-detail" className="vp-citation-target">用 Given、When、Then 或同等语言把场景拆成三件事：系统已处于什么已知状态，参与者或外部事件做了什么，以及应该出现什么结果。条件、动作和结果分开写，团队更容易复述同一个场景，也更容易补出缺失的边界。<Cite id="acceptance-shape-detail" sources={acceptanceCriteriaSources} /></p>
      <p id="acceptance-observable-detail" className="vp-citation-target">Then 应断言用户或外部系统能观察到的输出，例如跳转到设置页、看到错误说明或收到通知。不要把“数据库里某字段变成 1”直接当作用户验收结果；内部状态可以是实现证据，但还需要对应的可见行为。<Cite id="acceptance-observable-detail" sources={acceptanceCriteriaSources} /></p>
      <p id="acceptance-normal-detail" className="vp-citation-target">正常路径要能说明谁完成什么任务：未登录用户访问 /settings，提交正确凭据后回到原目标并看到账户内容。写出目标结果后，设计和测试仍可自由选择合适的页面结构与实现方式。<Cite id="acceptance-normal-detail" sources={acceptanceCriteriaSources} /></p>
    </ArticleSection>

    <ArticleSection id="acceptance-boundary" title="把失败、权限与回归写进边界">
      <p id="acceptance-error-detail" className="vp-citation-target">错误条件要写出系统怎样让用户恢复：密码错误时不跳转，保留可复用的账号输入并显示原因；网络超时则告诉用户可以重试。只写“报错”无法判断信息是否足够，也无法保证原状态没有被误改。<Cite id="acceptance-error-detail" sources={acceptanceCriteriaSources} /></p>
      <p id="acceptance-permission-detail" className="vp-citation-target">权限分支也需要独立结果：未登录访问管理页应先进入登录，已登录但没有管理权限则显示明确的拒绝结果，不泄露页面内容。把角色和限制写进条件，才能避免只用一个“成功登录”覆盖所有人。<Cite id="acceptance-permission-detail" sources={acceptanceCriteriaSources} /></p>
      <p id="acceptance-metric-detail" className="vp-citation-target">关键结果还要连接成功指标，例如登录后目标页到达率、错误恢复率或权限误判率。指标用于观察服务是否真的解决问题，不是把任意数字塞进验收标准；随着研究和数据变化，指标也可以修正。<Cite id="acceptance-metric-detail" sources={acceptanceCriteriaSources} /></p>
      <p id="acceptance-regression-detail" className="vp-citation-target">最后保留关键回归：新增登录校验后，原本有权限的用户仍能进入设置页，原目标仍被保留，错误状态不会污染下一次尝试。把这些结果放进清单，团队才能知道这次改动的影响边界。<Cite id="acceptance-regression-detail" sources={acceptanceCriteriaSources} /></p>
      <p><strong>读者判断：</strong>看到“功能做好了”时，先追问“给定什么条件，谁做什么，用户或外部系统能观察到什么？错误、权限和原有流程怎样处理？”如果句子里只有实现动作或主观形容词，先补结果，再讨论代码。</p>
    </ArticleSection>
  </GitArticle>;
}
