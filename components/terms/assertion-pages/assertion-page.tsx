import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { assertionSources } from "@/lib/assertion-sources";
import { AssertionSignatureHero as AssertionHero } from "../TestSecuritySignatureHeroes";
import { AssertionLesson } from "./assertion";

const sections: [string, string][] = [
  ["assertion-definition-section", "断言先回答：什么才算发生了"],
  ["assertion-wait-section", "等待不是猜时间"],
  ["assertion-contract-section", "把断言贴在真正的观察点上"],
  ["assertion-failure-section", "失败时，它应该帮你找到下一步"],
];

export function AssertionTermPage() {
  return <Article slug="assertion" title="断言" subtitle="Assertion · 给测试一条能站住的证据" sources={assertionSources} sections={sections} hero={<AssertionHero />} intro={<>测试代码跑完没有报错，只能说明它没有撞上写出来的失败条件。<strong>断言把“什么算完成、允许等多久、失败时要看什么”写成一条可以比较的证据。</strong></>}>
    <ArticleSection id="assertion-definition-section" title="断言先回答：什么才算发生了">
      <p id="assertion-definition" className="vp-citation-target">Jest 把 <code>expect(value)</code> 和 matcher 组合成一次判断：前者是代码产生的实际值，后者写出你认可的条件。<code>toBe</code>、<code>toEqual</code>、<code>toHaveProperty</code> 不是装饰词，它们决定比较的是身份、结构还是某个字段。<Cite id="assertion-definition" sources={assertionSources} /></p>
      <p id="assertion-matcher" className="vp-citation-target">因此“保存成功”不能只写成“没有抛异常”。在这个例子里，测试真正要保护的是保存完成后按钮变成可见、响应带回记录编号，或数据库出现那条记录；每个观察点都应该有清楚的实际值和期望值。<Cite id="assertion-matcher" sources={assertionSources} /></p>
      <p id="assertion-target" className="vp-citation-target">同一个动作可以有不同层次的断言：接口测试看 <code>201</code> 和 <code>id</code>，页面测试看按钮和提示，单元测试看函数返回对象。它们都叫断言，差别在于<strong>你把证据放在哪里</strong>，而不是 matcher 名字听起来多专业。<Cite id="assertion-target" sources={assertionSources} /></p>
    </ArticleSection>
    <ArticleSection id="assertion-wait-section" title="等待不是猜时间">
      <p id="assertion-web-first" className="vp-citation-target">Playwright 的 web-first assertion 会重新取得目标并检查，直到条件成立或超时。<code>toBeVisible</code> 等的不是“页面大概该更新了”，而是定位到的元素真的满足可见条件。<Cite id="assertion-web-first" sources={assertionSources} /></p>
      <AssertionLesson />
      <p id="assertion-findby" className="vp-citation-target">Testing Library 把 <code>findBy</code> 定义成查询加 <code>waitFor</code>：当元素会在用户动作之后才出现，测试可以等待它出现，而不是先取一个还不存在的节点。这个等待仍然有期限，超过期限就应该失败。<Cite id="assertion-findby" sources={assertionSources} /></p>
      <p id="assertion-waitfor" className="vp-citation-target"><code>waitFor</code> 的重试也有一个容易漏掉的细节：回调必须抛出错误才会继续重试，返回 <code>false</code> 不足以表达“还没好”。这就是为什么断言库要接住 matcher 的失败，而不是让测试作者自己写一串不透明的循环。<Cite id="assertion-waitfor" sources={assertionSources} /></p>
      <p id="assertion-disappearance" className="vp-citation-target">等待消失同样要有观察对象。Testing Library 的 <code>waitForElementToBeRemoved</code> 要求元素先存在，再等待它被移除；如果一开始就没有节点，测试描述的就不是“它消失了”。<Cite id="assertion-disappearance" sources={assertionSources} /></p>
    </ArticleSection>
    <ArticleSection id="assertion-contract-section" title="把断言贴在真正的观察点上">
      <p id="assertion-async" className="vp-citation-target">异步值必须把异步本身交给测试框架。Jest 的 <code>resolves</code> 和 <code>rejects</code> 会先拆开 Promise，再接上 matcher；测试还要 <code>return</code> 或 <code>await</code> 这条断言，否则测试函数可能在 Promise 结论回来前已经结束。<Cite id="assertion-async" sources={assertionSources} /></p>
      <p id="assertion-precise" className="vp-citation-target">matcher 要和问题贴合：金额允许微小浮点误差时用 <code>toBeCloseTo</code>，要验证对象里的字段时用 <code>toHaveProperty</code>，要确认回调真的被调用才用 <code>toHaveBeenCalled</code>。写得越精确，失败信息越接近真正的差异。<Cite id="assertion-precise" sources={assertionSources} /></p>
      <p>这也解释了为什么“内部变量已经是 true”常常不是好断言。它可能证明某个实现分支走过了，却没有证明用户看到完成状态、接口返回正确数据或副作用已经落地。先问读者会凭什么判断任务完成，再选择观察点。</p>
      <p id="assertion-retry" className="vp-citation-target">Cypress 把查询和断言连接起来重试，直到断言通过或超时；动作命令通常只执行一次，因为重复点击可能改变系统状态。断言的重试边界因此很重要：重读资料可以重试，发出一次付款却不能靠重试掩盖重复副作用。<Cite id="assertion-retry" sources={assertionSources} /></p>
    </ArticleSection>
    <ArticleSection id="assertion-failure-section" title="失败时，它应该帮你找到下一步">
      <p id="assertion-diff" className="vp-citation-target">Jest 说明 matcher 失败时应给出足够的差异；<code>Expected</code> 和 <code>Received</code> 的位置越清楚，排查越不靠猜。断言的工作不是把红灯变少，而是让红灯能指向一个可行动的事实。<Cite id="assertion-diff" sources={assertionSources} /></p>
      <p id="assertion-boundary" className="vp-citation-target">Cypress 的链式重试也提醒我们在断言处切开边界：把会改变状态的动作放在前面，动作完成后重新查询，再开始断言。这样失败时，读者知道是动作没发生、目标没出现，还是比较条件写错了。<Cite id="assertion-boundary" sources={assertionSources} /></p>
      <p id="assertion-chain" className="vp-citation-target">多个断言不是越多越好。把一个测试塞进十几个互不相关的期待，第一盏红灯可能遮住后面的事实；更好的做法是让每个失败尽量指向一个风险，并把真正独立的行为拆开。<Cite id="assertion-chain" sources={assertionSources} /></p>
      <p id="assertion-timeout" className="vp-citation-target">Playwright 把 expect timeout 单独计算，默认 5 秒，与整个测试的 30 秒上限不是一回事。超时是测试对系统速度的明确边界，应该结合实际协议设定，而不是用无限等待把失败藏起来。<Cite id="assertion-timeout" sources={assertionSources} /></p>
      <p id="assertion-failure" className="vp-citation-target">最后检查一句：如果断言失败，执行者能否从错误里知道“期望什么、实际是什么、等了多久、下一步看哪层”？能回答这四件事，它才是在保护行为；否则只是把一个模糊的猜测固定了下来。<Cite id="assertion-failure" sources={assertionSources} /></p>
    </ArticleSection>
  </Article>;
}
