import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { regressionTestSources } from "@/lib/regression-test-sources";
import { RegressionTestSignatureHero as RegressionTestHero } from "../TestSecuritySignatureHeroes";
import { RegressionTestLesson } from "./regression-test";

const sections: [string, string][] = [
  ["regression-definition", "它要找回哪些“原来能工作”的行为"],
  ["regression-scope", "范围从改动出发，再被风险补全"],
  ["regression-execution", "入选以后，测试结果才有意义"],
  ["regression-boundary", "通过一组，不等于永远没有回归"],
];

export function RegressionTestTermPage() {
  return <Article slug="regression-test" title="回归测试" subtitle="Regression Test · 改完以后，旧功能还站得住吗" sources={regressionTestSources} sections={sections} hero={<RegressionTestHero />} intro={<>只改了认证中间件，为什么订单和后台权限也要重测？回归测试不是把所有旧用例机械地再按一遍，而是从这次变更出发，找出那些<strong>原本应该继续成立、却可能被这次改动碰到的行为</strong>，再用实际结果把倒退钉在现场。</>}>
    <ArticleSection id="regression-definition" title="它要找回哪些“原来能工作”的行为">
      <p id="reg-definition" className="vp-citation-target">Microsoft 把回归测试定义为：在解决方案发生代码、配置或数据变化后，重新检查原来的行为是否仍按预期工作。它可以手工做，也可以自动做；关键不在“重复”这个动作，而在验证变化没有悄悄带来新的问题。<Cite id="reg-definition" sources={regressionTestSources} /></p>
      <p id="reg-change-trigger" className="vp-citation-target">所以回归测试的起点不是“今天有哪些页面”，而是“这次动了什么”。例子里，改动落在 `auth middleware`：它把请求交给权限规则判断。登录、会话、订单和后台列表虽然不是同一个文件，却都可能依赖这个判断；只重跑登录的单元测试，无法证明这些旧行为还在。<Cite id="reg-change-trigger" sources={regressionTestSources} /></p>
      <p>首图把一条提交差异画成一根拉绳。拉动中间的鉴权规则，几条旧路径会跟着晃：普通用户可以登录，订单服务仍要识别会话，编辑器请求后台列表时还必须得到 `403`。回归测试要找的是这些外部能观察到的结果，而不是某个内部变量有没有保持原名。</p>
      <p id="reg-sensor" className="vp-citation-target">Fowler 把测试套件称为回归传感器：它记录系统想保持的行为，改动后如果旧测试失败，就提醒团队问一句——这是无意的倒退，还是需求真的改了？这一步很重要，因为“测试失败”本身不自动等于“代码一定错”，还需要和新的产品约定对照。<Cite id="reg-sensor" sources={regressionTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="regression-scope" title="范围从改动出发，再被风险补全">
      <p id="reg-impact" className="vp-citation-target">Microsoft 的 Test Impact Analysis 会根据提交与测试之间的依赖关系自动选出相关测试，目的在于让大套件先跑最有关系的部分，尽快得到反馈。这个思路适合做第一层筛选：调用图能告诉我们哪些测试“可能受到影响”，但它不是风险的完整清单。<Cite id="reg-impact" sources={regressionTestSources} /></p>
      <RegressionTestLesson />
      <p id="reg-scope" className="vp-citation-target">Microsoft 也把三种策略放在一起比较：可以接近全量地测，可以优先测业务影响最大的流程，也可以只测变更影响区域。实际回归范围常常是它们的组合：先沿依赖收窄，再把关键业务和历史缺陷补进去。只沿调用图选出 11 个用例，数字看起来很省，却可能把后台越权这个已知风险留在门外。<Cite id="reg-scope" sources={regressionTestSources} /></p>
      <p id="reg-risk" className="vp-citation-target">Azure Well-Architected Framework 建议按业务影响和风险选择测试，并把生产事故、关键缺陷和高风险改动沉淀成新的回归资产。换句话说，历史失败不是“旧新闻”：它告诉我们哪一扇门以前关不严，下一次碰到相关规则时要再推一次。<Cite id="reg-risk" sources={regressionTestSources} /></p>
      <p id="reg-fast" className="vp-citation-target">GitLab 的测试策略把这个过程说得很直白：先跑最相关的测试，失败就尽快修；通过后逐步扩大范围。回归测试的“快”来自有理由地选集，而不是把检查删到只剩一个绿色数字。<Cite id="reg-fast" sources={regressionTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="regression-execution" title="入选以后，测试结果才有意义">
      <p id="reg-validate" className="vp-citation-target">影响分析也可能看不懂一类改动。Azure 的方案在无法判断提交影响时会安全地退回全量测试，并建议把“选中的测试”和“全量测试”顺序运行，对比两者是否抓到同一批失败。自动筛选是加速器，不是替人承担边界判断的黑盒。<Cite id="reg-validate" sources={regressionTestSources} /></p>
      <p id="reg-fallback" className="vp-citation-target">这就是为什么工作台提供“全量校准”：平时用影响集和风险集获得快速反馈，定期再让 32 个测试全部跑一遍，检查选择规则有没有长期漏项。一次全量通过不能替代每次变更的分析，但它能校准“我们以为相关”的地图。<Cite id="reg-fallback" sources={regressionTestSources} /></p>
      <p id="reg-failure" className="vp-citation-target">例子里的失败很具体：`admin-list-as-editor` 期待 `403`，实际得到 `200`。这不是“有个测试红了”就结束；它告诉我们权限边界被放宽了，应该查看提交差异、确认新需求，再修复实现或更新明确改变过的预期。<Cite id="reg-failure" sources={regressionTestSources} /></p>
      <p id="reg-ownership" className="vp-citation-target">GitLab 还要求每套测试有明确 owner，并把能可靠阻塞合并、部署或发布的检查保持为 blocking。回归报告至少要带上构建版本、选集依据、失败用例和负责处理的人；否则一组好测试也会慢慢变成无人维护的旧脚本。<Cite id="reg-ownership" sources={regressionTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="regression-boundary" title="通过一组，不等于永远没有回归">
      <p id="reg-coverage-boundary" className="vp-citation-target">Fowler 提醒，覆盖率只能说明代码被执行到哪里，不能单独说明行为有没有被有效验证。回归集的 14/32 也不是质量分数：它代表本次按影响和风险挑出的范围，剩下的测试仍然回答其他问题。<Cite id="reg-coverage-boundary" sources={regressionTestSources} /></p>
      <p id="reg-suite" className="vp-citation-target">Azure 建议让回归套件从少量稳定、价值高的测试逐步增长，并把快速 smoke 放在每次提交、更宽的回归放在夜间或发布前。GitLab 也提醒要定期查看重复覆盖、脆弱测试和套件健康度；旧用例应该随业务规则一起维护，而不是因为“以前写过”就永远正确。<Cite id="reg-suite" sources={regressionTestSources} /></p>
      <p id="reg-history" className="vp-citation-target">因此，回归测试既不是“只测这次修复点”，也不是“全量永远跑完就安全”。它是一份会随风险历史生长的清单：事故补一个能重现问题的用例，高风险改动补一条关键路径，需求明确改变时才更新原来的预期。<Cite id="reg-history" sources={regressionTestSources} /></p>
      <p><strong>写完一轮回归，问四句：</strong>这次变更会碰到哪些旧行为；范围是否包含业务风险和历史缺陷；无法判断时怎样做全量校准；失败后谁能根据证据修复？四句都能回答，回归测试才是在守护系统记得住的承诺。</p>
    </ArticleSection>
  </Article>;
}
