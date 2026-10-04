import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { integrationTestSources } from "@/lib/integration-test-sources";
import { IntegrationTestHero } from "./integration-test-hero";
import { IntegrationTestLesson } from "./integration-test";

const sections: [string, string][] = [
  ["integration-boundary", "让真实边界一起上场"],
  ["integration-sequence", "请求、事务和状态要连成一条证据链"],
  ["integration-fixture", "环境可以缩小，协作不能凭空假设"],
  ["integration-size", "范围要比端到端小，问题要比单元具体"],
];

export function IntegrationTestTermPage() {
  return <Article slug="integration-test" title="集成测试" subtitle="Integration Test · 让组件在真实边界上互相见面" sources={integrationTestSources} sections={sections} hero={<IntegrationTestHero />} intro={<>订单接口的每个函数都通过了，连上数据库却在事务边界上摔倒了。集成测试把组件接回一小段真实现场，让请求、配置、数据格式和副作用一起接受检查，同时把不值得拉进来的外部故障留在可控范围内。</>}>
    <ArticleSection id="integration-boundary" title="让真实边界一起上场">
      <p id="integration-definition" className="vp-citation-target">Martin Fowler 把集成测试的核心说得很直接：检查独立开发的单元连接后能不能按预期工作。它不必天然等于“启动整个宇宙”；可以只挑订单服务和数据库这一小段边界，也可以根据风险把范围扩大。<Cite id="integration-definition" sources={integrationTestSources} /></p>
      <p id="integration-boundary-evidence" className="vp-citation-target">Microsoft 的示例把数据库、文件系统、网络和请求响应管线都视为可能参与的基础设施，并强调集成测试使用生产中真正的组件，因此比单元测试更慢、更需要数据准备。这个差异正是它的价值：让真实配置和真实协议暴露彼此的假设。<Cite id="integration-boundary-evidence" sources={integrationTestSources} /></p>
      <p id="integration-narrow" className="vp-citation-target">Fowler 还区分 narrow 和 broad 两种集成测试。narrow 只运行当前服务与外部服务交互的那一段，可以用忠实的 test double；broad 则需要多个真实服务和网络环境。把这两种范围都叫“集成测试”并没有错，但写方案时必须说清楚自己让哪些边界真的上场。<Cite id="integration-narrow" sources={integrationTestSources} /></p>
      <p>首图选择的是一条窄而真实的路径：订单服务和 PostgreSQL 不替换，支付故障由测试主动注入。这样读者能同时看到真实 SQL 的结果和外部错误的影响，而不用把完整前端、邮件、支付生产环境都搬进来。</p>
    </ArticleSection>
    <ArticleSection id="integration-sequence" title="请求、事务和状态要连成一条证据链">
      <p id="integration-sequence-evidence" className="vp-citation-target">ASP.NET Core 的集成测试示例把流程拆成配置测试宿主、创建客户端、准备请求、发送请求、检查响应五步。这个顺序很重要：如果只直接调用服务类，就跳过了路由、序列化、认证和中间件这些可能出错的接缝。<Cite id="integration-sequence-evidence" sources={integrationTestSources} /></p>
      <p id="integration-request" className="vp-citation-target">Playwright 的 API testing 让测试通过请求客户端调用真实 HTTP API，而不是把调用压缩成一个内部函数。请求方法、路径、payload 和返回状态都成为可观察证据；之后还要把持久化状态一起读出来。<Cite id="integration-request" sources={integrationTestSources} /></p>
      <IntegrationTestLesson />
      <p id="integration-response" className="vp-citation-target">Playwright 的 APIResponseAssertions 提供 `toBeOK()` 这类针对响应的断言，但一个 502 只是接口层的一半故事。工作台里还查 `orders` 和 `outbox`：支付失败时，响应错误与真实数据库 0 行必须同时出现，回滚才是被证明的行为。<Cite id="integration-response" sources={integrationTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="integration-fixture" title="环境可以缩小，协作不能凭空假设">
      <p id="integration-fixture-evidence" className="vp-citation-target">测试宿主可以使用专用配置、独立数据库或内存测试服务器。Microsoft 的 `WebApplicationFactory` 示例会替换测试用数据库并准备种子数据，让测试从已知状态开始，再用客户端提交请求。<Cite id="integration-fixture-evidence" sources={integrationTestSources} /></p>
      <p id="integration-double" className="vp-citation-target">外部支付可以用替身制造稳定的 500，但订单服务和数据库仍然应该保持真实；替身越接近真实服务，集成结论越可信，必要时还要用契约测试验证替身没有过期。若把数据库也 Mock 掉，测试会很快，却失去了 schema、事务和迁移的证据。<Cite id="integration-double" sources={integrationTestSources} /></p>
      <p>准备数据也属于测试的一部分。明确谁创建订单、库存从多少开始、测试结束怎样清理，比在共享数据库里碰运气更可靠。每个场景最好拥有自己的数据边界，失败后能从日志和状态表还原发生过什么。</p>
    </ArticleSection>
    <ArticleSection id="integration-size" title="范围要比端到端小，问题要比单元具体">
      <p id="integration-size-evidence" className="vp-citation-target">Google Testing Blog 把集成测试描述成一小组组件一起工作的检查：依赖比完整端到端少，通常更快、更稳定。它不应该被端到端测试吞掉，也不应该被单元测试的数量替代。<Cite id="integration-size-evidence" sources={integrationTestSources} /></p>
      <p>单元测试问“这段逻辑对不对”，集成测试问“这两个边界接上后还对不对”，端到端测试问“用户走完整条旅程能不能完成”。订单回滚属于中间那个问题：要让真实数据库参与，又不必打开浏览器、登录、发邮件和接入生产支付。</p>
      <p><strong>写完一条集成测试，留下三份证据：</strong>真实参与了哪些组件；请求经过了哪些协议和配置；失败或成功后状态留下了什么。若只能回答“接口返回 200”，那更像是一次请求检查，还没有把组件之间的协作说完整。</p>
    </ArticleSection>
  </Article>;
}
