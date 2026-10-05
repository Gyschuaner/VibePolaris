import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { unitTestSources } from "@/lib/unit-test-sources";
import { UnitTestHero } from "./unit-test-hero";
import { UnitTestLesson } from "./unit-test";

const sections: [string, string][] = [
  ["unit-scope", "先把大系统缩成一张小桌子"],
  ["unit-control", "把会漂移的依赖按住"],
  ["unit-assert", "断言行为，不要审问私有变量"],
  ["unit-limits", "快反馈不等于全覆盖"],
];

export function UnitTestTermPage() {
  return <Article slug="unit-test" title="单元测试" subtitle="Unit Test · 把一小段代码放进可重复的实验室" sources={unitTestSources} sections={sections} hero={<UnitTestHero />} intro={<>折扣函数只有十几行，为什么还要专门测试 -1、0、100 和 101？因为单元测试不是给代码贴一张“已检查”标签，而是把一个小单元的输入、依赖和可观察结果摆在同一张桌子上，让失败尽快指向真正的边界。</>}>
    <ArticleSection id="unit-scope" title="先把大系统缩成一张小桌子">
      <p id="unit-definition" className="vp-citation-target">Martin Fowler 说，unit test 这个词本身没有唯一尺寸：面向对象的团队可能把一个类当作单元，函数式代码可能把一个函数当作单元。共同点是范围小、由程序员用熟悉的工具编写，而且应该比更大范围的测试快得多。<Cite id="unit-definition" sources={unitTestSources} /></p>
      <p id="unit-isolation" className="vp-citation-target">所以“单元”不是把产品硬切成一个文件，而是选一块能单独说明行为的边界。我们把折扣规则、四组输入和一个时钟接口放在桌上；数据库、网络和整条结算流程先留在桌外。若这条规则失败，报告应该直接说出哪组输入出了问题。<Cite id="unit-isolation" sources={unitTestSources} /></p>
      <p id="unit-jest-example" className="vp-citation-target">Jest 的入门例子也是同样的动作：导入一个很小的 `sum` 函数，调用它，再用 `expect(...).toBe(...)` 比较结果。测试框架负责把这次调用变成可重复、可报告的检查，不会替你补上没有写出的边界。<Cite id="unit-jest-example" sources={unitTestSources} /></p>
      <p>首图里，四个输入像四张小票：-1 不该悄悄变成折扣金额，0 要保持 0，100 正好踩到门槛，101 则验证门槛之外的计算。它们都指向同一个被测单元，失败时不会把读者带进数据库、浏览器和支付服务的迷宫。</p>
    </ArticleSection>
    <ArticleSection id="unit-control" title="把会漂移的依赖按住">
      <p id="unit-quality" className="vp-citation-target">Microsoft 的单元测试建议把“快、隔离、可重复、自检查”当作质量特征，并提醒文件系统、数据库等基础设施会让测试变慢、变脆。隔离不是为了制造一个假的世界，而是为了让这次检查只回答一个问题。<Cite id="unit-quality" sources={unitTestSources} /></p>
      <p id="unit-double" className="vp-citation-target">如果被测代码要读外部服务，可以注入一个受控替身。Jest 的 mock function 能记录调用、预先返回指定值；它把不确定的网络搬出实验室，却不应该把被测逻辑也塞进替身里。<Cite id="unit-double" sources={unitTestSources} /></p>
      <UnitTestLesson />
      <p id="unit-async" className="vp-citation-target">异步也属于依赖边界。Jest 要求测试返回或等待 Promise，否则测试可能在结果回来前就结束；这不是“多加一个 await”的格式问题，而是要让测试运行器知道何时才有资格作出判断。<Cite id="unit-async" sources={unitTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="unit-assert" title="断言行为，不要审问私有变量">
      <p id="unit-aaa" className="vp-citation-target">Arrange、Act、Assert 把测试拆成准备、调用和判断三段：先摆出必要输入，再调用被测对象，最后比较一个清楚的结果。这个顺序让读者看见依赖从哪里来、代码被怎样调用，以及什么才算通过。<Cite id="unit-aaa" sources={unitTestSources} /></p>
      <p id="unit-assertion" className="vp-citation-target">Jest 的 `expect` 接收代码产生的值，再交给 matcher 比较；它能检查精确值、对象结构和 Promise 结果。断言应贴近用户能观察到的行为，例如“101 返回 90.9”，而不是“内部变量 couponRate 恰好等于 0.1”。<Cite id="unit-assertion" sources={unitTestSources} /></p>
      <p>工作台把两种写法并排放着：行为断言在内部从 `if` 换成规则表后仍然通过；私有变量断言会因为一次无害的重构而变红。红色并不总是产品 bug，有时只是测试把自己绑在了不该承诺的实现细节上。</p>
    </ArticleSection>
    <ArticleSection id="unit-limits" title="快反馈不等于全覆盖">
      <p id="unit-coverage" className="vp-citation-target">单元测试适合高频运行，能在改动刚发生时给出短反馈；它不能证明真实数据库、网络协议或浏览器流程已经协作正常。Microsoft 也提醒，高覆盖率只说明代码被执行过，并不能单独代表测试质量。<Cite id="unit-coverage" sources={unitTestSources} /></p>
      <p>一张小桌子越清楚，越容易发现它的边界：集成测试要把真实组件接上，端到端测试要走完整业务路径，回归测试要根据改动风险选择旧行为。单元测试负责把最小的规则看牢，不负责替整座房子签字。</p>
      <p><strong>写完一个单元测试，问四句：</strong>我正在验证哪块行为；输入和错误是否具体；时间、随机数、网络是否被控制；断言是不是面向结果。四句都能回答，测试就更像一张可复用的实验记录，而不是一段让 CI 变绿的仪式。</p>
    </ArticleSection>
  </Article>;
}
