import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { testCaseSources } from "@/lib/test-case-sources";
import { TestCaseHero } from "./test-case-hero";
import { TestCaseLesson } from "./test-case";

const sections: [string, string][] = [
  ["case-definition-section", "标题不等于用例，起点要能被复原"],
  ["case-fields-section", "把一次动作写成别人能照着做的路径"],
  ["case-evidence-section", "预期要落在系统真的会留下的证据上"],
  ["case-repeat-section", "重跑仍能判定，才算把风险关进笼子"],
];

export function TestCaseTermPage() {
  return <Article slug="test-case" title="测试用例" subtitle="Test Case · 把“测一下”写成一次能复现的判断" sources={testCaseSources} sections={sections} hero={<TestCaseHero />} intro={<>产品说“密码重置失败时要拦住”，开发写了一个测试标题，测试同学却问：用什么账号、拿什么令牌、发哪一个请求，看到什么才算失败？<strong>测试用例把这段口头约定压成一条可执行、可观察、可重复的短路径。</strong></>}>
    <ArticleSection id="case-definition-section" title="标题不等于用例，起点要能被复原">
      <p id="case-definition" className="vp-citation-target">Microsoft 把测试用例写成一组供执行和验证的指令：它至少要交代过程或需求、前置条件和数据、复现步骤，以及预期或退出标准。标题只能指出风险，不能告诉下一个人从哪个世界状态开始。<Cite id="case-definition" sources={testCaseSources} /></p>
      <p>比如“密码重置应该失败”只像一张贴在门上的便签。是过期令牌失败，还是不存在的账号失败？是返回 `410`，还是页面显示错误？如果这些都没写，A 测到接口，B 测到页面，C 甚至拿着刚生成的有效令牌，三个人都能说自己做完了。</p>
      <p id="case-fields" className="vp-citation-target">因此首图先把 `user=u-42` 和 `token=expired` 放回桌面，再把操作写成 `POST /password/reset`。Azure Test Plans 也把测试步骤与预期结果作为可维护的基本单元，并支持把用例连到用户故事、功能或缺陷；用例不是一段散文，而是一张能追到需求的执行单。<Cite id="case-fields" sources={testCaseSources} /></p>
      <p>这里的“前置”不是背景介绍，而是测试的起跑线：账号是否激活、令牌什么时候过期、数据库里有没有旧会话，都决定了后面的结果。起点没有固定，失败就无法归因——你不知道是代码变了，还是测试现场本来就不一样。</p>
    </ArticleSection>
    <ArticleSection id="case-fields-section" title="把一次动作写成别人能照着做的路径">
      <p id="case-steps" className="vp-citation-target">一个可执行步骤应该让执行者知道做什么、对什么对象做、做完看哪里。Azure 的测试用例界面把步骤和预期结果分开记录，正是为了让“动作”和“判断”不要混成一句“然后应该正常”。<Cite id="case-steps" sources={testCaseSources} /></p>
      <TestCaseLesson />
      <p id="case-fixture" className="vp-citation-target">GitLab 的测试实践强调干净的测试环境、明确的 setup 和 cleanup；测试不能依赖上一个用例留下的 ID、顺序或脏数据。工作台里“固定过期令牌”不是形式，它让第二次运行仍然遇到同一个边界。<Cite id="case-fixture" sources={testCaseSources} /></p>
      <p id="case-negative" className="vp-citation-target">Microsoft 还建议同时准备正常和负面场景。过期令牌的拒绝路径是一条负面用例，但它仍然要有正面的结构：确切输入、确切动作、确切预期。把“失败”写清楚，才不会把任何异常都误报成通过。<Cite id="case-negative" sources={testCaseSources} /></p>
    </ArticleSection>
    <ArticleSection id="case-evidence-section" title="预期要落在系统真的会留下的证据上">
      <p id="case-token" className="vp-citation-target">OWASP 的密码找回建议把令牌和用户绑定，使用后失效，并通过安全的链接和传输方式交付。对这条用例来说，`HTTP 410` 只是门口的回执；令牌没有被消费、没有发出新的邮件，才是服务端状态也守住了同一条规则。<Cite id="case-token" sources={testCaseSources} /></p>
      <p id="case-side-effect" className="vp-citation-target">副作用也要写进预期，因为“接口返回正确”不等于系统没有偷偷做错事。过期令牌请求若仍然改变密码或发送一封误导邮件，单看状态码的用例会亮绿灯，用户却已经被带进了另一条错误路径。<Cite id="case-side-effect" sources={testCaseSources} /></p>
      <p id="case-assertion" className="vp-citation-target">GitLab 建议让断言区分目标场景和相邻场景：这里要证明的是“过期令牌被拒绝且不产生副作用”，不是检查某个内部函数恰好调用了几次。观察点应该贴近行为契约，这样实现换了，风险仍然能被测到。<Cite id="case-assertion" sources={testCaseSources} /></p>
      <p id="case-async" className="vp-citation-target">异步界面还要留意等待方式。Playwright 提醒非重试断言很容易在页面尚未稳定时误失败，应优先等待可观察条件或使用自动重试。测试用例写“邮件最终为 0 封”时，也要写清等待邮件沙箱稳定的条件，不能用一秒钟的猜测代替事实。<Cite id="case-async" sources={testCaseSources} /></p>
    </ArticleSection>
    <ArticleSection id="case-repeat-section" title="重跑仍能判定，才算把风险关进笼子">
      <p id="case-result" className="vp-citation-target">测试用例的结果要记录环境、版本、步骤和实际观察，这样失败才有回放入口。Microsoft 的测试计划指南把这些信息列为结果报告的一部分；只留一个红点，无法判断是代码回归、环境故障还是前置条件漏写。<Cite id="case-result" sources={testCaseSources} /></p>
      <p id="case-traceability" className="vp-citation-target">用例还应能回到它保护的需求或缺陷。Azure Test Plans 支持把测试用例关联到用户故事、功能和 Bug；密码重置用例可以指向“过期令牌不能修改密码”这条安全约定，未来规则变化时，团队知道哪些预期需要一起审查。<Cite id="case-traceability" sources={testCaseSources} /></p>
      <p>工作台最后要求清理并重跑。第一次 `3/3` 只能说明这一轮对上了，第二次仍然 `3/3` 才说明用例的起点、动作和观察点互相咬合。若只写“应该失败”，第二次没有可比的预期；若令牌随手生成，失败也没有可追的原因。</p>
      <p><strong>写完一条测试用例，逐项问：</strong>执行者能否复原同一个起点；动作是否精确到对象和次数；预期是否落在可观察事实；清理后重跑是否仍能做出同一个判断？四个答案都明确，测试用例才不是一张漂亮的待办事项。</p>
    </ArticleSection>
  </Article>;
}
