import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { e2eTestSources } from "@/lib/e2e-test-sources";
import { E2eTestSignatureHero } from "../DataTestSignatureHeroes";
import { E2eTestLesson } from "./e2e-test";

const sections: [string, string][] = [
  ["e2e-journey", "它测的是一段旅程，不是一张截图"],
  ["e2e-reliable", "让真实旅程每次从同一站出发"],
  ["e2e-cost", "大网要看，网眼要少"],
  ["e2e-failure", "失败也要留下准确的位置"],
];

export function E2eTestTermPage() {
  return <Article slug="e2e-test" title="端到端测试" subtitle="End-to-End Test · 让一条关键旅程穿过真实系统" sources={e2eTestSources} sections={sections} hero={<E2eTestSignatureHero />} intro={<>如果浏览器亮出“支付成功”，你就敢给用户发货吗？真正的端到端测试会让一个新用户从真实入口走完旅程，再把页面、服务端状态、回调和邮件放在同一张验收单上；任何一层没跟上，测试停在那一层。</>}>
    <ArticleSection id="e2e-journey" title="它测的是一段旅程，不是一张截图">
      <p id="e2e-definition" className="vp-citation-target">Martin Fowler 把端到端测试放在最宽的一层：通过用户界面测试已经部署的应用，让整个集成系统完成一次真实使用。它的价值不是“点了很多按钮”，而是回答一个外部问题——用户能不能完成这件事，系统有没有留下应该留下的结果。<Cite id="e2e-definition" sources={e2eTestSources} /></p>
      <p id="e2e-user-visible" className="vp-citation-target">Playwright 的测试建议把视线放在用户能看见或操作的结果上，少依赖函数名、数组形状或 CSS class。首图里的定位写成 `getByRole("button", &#123; name: "确认订单" &#125;)`，因为按钮的语义是产品契约；`.buy-btn-17` 只是今天的实现细节。<Cite id="e2e-user-visible" sources={e2eTestSources} /></p>
      <p>一笔订单的“通过”要有一串相互咬合的事实：浏览器发出请求，服务端创建 `order-42`，数据库先是 `pending`，有效的 `payment.paid` 回调把它推进到 `paid`，页面刷新后显示已支付，邮件沙箱还要收到一封确认信。页面先亮绿灯，却没有邮件，这条旅程仍然没有走到终点。</p>
      <p id="e2e-browser" className="vp-citation-target">Playwright 把浏览器自动化、断言和测试运行器放在同一套工具里，适合从真实页面动作开始，再观察跨页面或跨请求的结果。浏览器只是入口，E2E 的“端”还包括旅程末端的系统事实。<Cite id="e2e-browser" sources={e2eTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="e2e-reliable" title="让真实旅程每次从同一站出发">
      <p id="e2e-isolation" className="vp-citation-target">Playwright 建议每个测试拥有自己的 local storage、session storage、数据和 cookies，并且可以独立运行。端到端范围已经够大了，如果上一个测试留下的订单或登录态也混进来，失败就很难还原。<Cite id="e2e-isolation" sources={e2eTestSources} /></p>
      <p id="e2e-locator" className="vp-citation-target">用户语义定位还能让旅程经得起界面重排：按钮从卡片移到抽屉，`getByRole` 仍然指向同一个动作；依赖 DOM 层级和样式类的定位则会把无关的视觉改动放大成测试故障。<Cite id="e2e-locator" sources={e2eTestSources} /></p>
      <E2eTestLesson />
      <p id="e2e-wait" className="vp-citation-target">自动等待不是把时间拉长。Playwright 的 web-first assertion 会持续等待目标状态出现；工作台里它等的是订单真正变成 `paid`，而不是盲睡 1000 毫秒后猜“应该差不多了”。<Cite id="e2e-wait" sources={e2eTestSources} /></p>
      <p id="e2e-actionability" className="vp-citation-target">点击本身也有前提：元素要唯一、可见、稳定、能接收事件并且已启用。Playwright 把这些 actionability checks 放在动作前，能减少动画还没结束或遮罩仍在时的假失败；它不能替你判断业务结果是否正确。<Cite id="e2e-actionability" sources={e2eTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="e2e-cost" title="大网要看，网眼要少">
      <p id="e2e-cost-evidence" className="vp-citation-target">Fowler 形容 UI 驱动的端到端测试时，反复提到它们慢、昂贵、容易脆弱，失败还可能来自浏览器、动画、弹窗或环境，而不是产品逻辑。它们因此适合守住少数最高价值的用户旅程，不适合把每一种折扣组合都搬进浏览器。<Cite id="e2e-cost-evidence" sources={e2eTestSources} /></p>
      <p id="e2e-balance" className="vp-citation-target">Google Testing Blog 也把端到端测试放在测试金字塔的顶部：需要一小组端到端检查系统整体，再把更多组合下沉到更快、更聚焦的单元和集成测试。比例不是教条，关键是别让整座回归套件都变成一条长而脆的浏览器队列。<Cite id="e2e-balance" sources={e2eTestSources} /></p>
      <p>所以“少量”不是偷懒，而是为真正重要的旅程留出可靠预算：注册后登录、付款后看到订单、管理员完成一次关键发布。每条旅程都应该有明确的入口、数据清理、等待条件和终点；低层的排列组合交给更快的测试层。</p>
    </ArticleSection>
    <ArticleSection id="e2e-failure" title="失败也要留下准确的位置">
      <p id="e2e-failure-evidence" className="vp-citation-target">Google 对端到端失败的提醒很尖锐：它能告诉你用户路径出了问题，却常常不能马上告诉你是哪一层坏了；排查成本会随着链路长度一起上升。因此失败时要保存请求、截图、trace 和关键状态，并停在第一个被破坏的不变量。<Cite id="e2e-failure-evidence" sources={e2eTestSources} /></p>
      <p>工作台的“邮件丢失”分支故意让页面和数据库都显示 paid，只有最终回执是 0。正确结论是“确认邮件不成立”，不是“页面看起来没问题”；这份差异就是 E2E 给产品留下的可行动证据。</p>
      <p><strong>写完一条端到端测试，问四句：</strong>用户从哪里进入；每一层的成功事实是什么；测试怎样从干净状态开始；失败后我能指出第一处不一致吗？四句都能回答，测试才是在守护旅程，而不是在录制鼠标轨迹。</p>
    </ArticleSection>
  </Article>;
}
