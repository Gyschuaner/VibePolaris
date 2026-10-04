import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { apiTestingSources } from "@/lib/api-testing-sources";
import { ApiTestingHero } from "./api-testing-hero";
import { ApiTestingLesson } from "./api-testing";

const sections: [string, string][] = [
  ["api-testing-definition-section", "先看协议，别只看绿色"],
  ["api-testing-ledger-section", "把一条创建接口拆成两本账"],
  ["api-testing-retry-section", "重试会把隐藏的副作用放大"],
  ["api-testing-authorization-section", "换一个身份，才知道门有没有锁"],
];

export function ApiTestingTermPage() {
  return <Article slug="api-testing" title="API 测试" subtitle="API Testing · 让响应和服务端状态一起过关" sources={apiTestingSources} sections={sections} hero={<ApiTestingHero />} intro={<>创建订单接口返回 201，看起来很顺。可网络断开后重试会不会多写一行？用户 B 拿着订单编号能不能读到用户 A 的数据？<strong>API 测试把请求、协议回执和服务端留下的状态放到同一条证据链里。</strong></>}>
    <ArticleSection id="api-testing-definition-section" title="先看协议，别只看绿色">
      <p id="api-direct-request" className="vp-citation-target">API 测试直接向服务发送 HTTP 请求，不必先打开浏览器、点击表单。Playwright 的 <code>APIRequestContext</code> 就是这样一条独立的请求通道：它可以创建资源，也可以在操作后查询服务端状态。<Cite id="api-direct-request" sources={apiTestingSources} /></p>
      <p id="api-auth-state" className="vp-citation-target">请求上下文还可以承接认证状态。Playwright 允许 API 请求上下文和浏览器上下文共享存储状态，这样测试既能用接口准备登录后的数据，也能在页面操作后用接口核对后置条件；是否共享要按测试隔离边界决定。<Cite id="api-auth-state" sources={apiTestingSources} /></p>
      <p id="api-http-status" className="vp-citation-target">HTTP 状态码是协议回执，不是质量分数。RFC 9110 把 <code>201 Created</code> 定义为请求产生了新资源；在这个例子里，订单创建后还要核对响应里的 <code>orderId</code> 和服务端是否真的留下对应订单。<Cite id="api-http-status" sources={apiTestingSources} /></p>
      <p id="api-response-contract" className="vp-citation-target">OpenAPI 的 Responses Object 把一次操作可能返回的状态码映射到预期响应，也要求文档至少覆盖成功情况和已知错误。测试可以从这张契约得到检查清单，但契约写错时，自动通过也只是把错误复读一遍。<Cite id="api-response-contract" sources={apiTestingSources} /></p>
      <p>因此“返回 200”只回答了一个很窄的问题：服务器给了一个成功类别的回执。它还没有回答字段是否满足约定、这次请求是否改变了正确的资源、没有权限的人是否被挡住。</p>
    </ArticleSection>
    <ArticleSection id="api-testing-ledger-section" title="把一条创建接口拆成两本账">
      <p id="api-schema" className="vp-citation-target">OpenAPI 的 Schema Object 可以描述输入和输出的数据类型。首图里的 <code>orderId:string</code> 不是装饰，它让测试有机会发现“状态码对了，但字段缺失或类型错了”的接口。<Cite id="api-schema" sources={apiTestingSources} /></p>
      <p id="api-postcondition" className="vp-citation-target">Playwright 的 API 测试示例会创建资源，再查询列表验证服务端状态；这就是后置条件。创建订单时，第一本账检查 <code>201 + orderId</code>，第二本账检查 <code>orders</code> 表增加且只增加一行。<Cite id="api-postcondition" sources={apiTestingSources} /></p>
      <ApiTestingLesson />
      <p>两本账不是一定要直接查数据库。可以查公开的 GET、事件记录、库存数量或其他能证明状态的接口；重点是观察点要贴近业务结果。若测试只盯着响应体，它很容易错过“回执说成功，状态却没写进去”这类失败。</p>
      <p><strong>把响应和状态分开写，再把它们合成一次结论。</strong>这样实现换成队列、事务或异步落库时，测试仍然在检查订单是否出现，而不是绑死某个内部函数名。</p>
    </ArticleSection>
    <ArticleSection id="api-testing-retry-section" title="重试会把隐藏的副作用放大">
      <p id="api-idempotency" className="vp-citation-target">RFC 9110 说明，幂等方法重复发送时，服务器预期效果应与发送一次相同；客户端因此可以在没读到响应时安全重试这类请求。规范也提醒，POST 默认不能因为网络失败就随意自动重发。<Cite id="api-idempotency" sources={apiTestingSources} /></p>
      <p id="api-retry-key" className="vp-citation-target">创建订单常用额外的幂等键来表达“这是同一次意图”。Stripe 的文档说明，同一个键的后续请求会返回第一次请求保存的结果，从而避免连接错误后重复创建对象；这是该服务的具体约定，不能自动推广成所有 API 都有同样行为。<Cite id="api-retry-key" sources={apiTestingSources} /></p>
      <p id="api-retry-boundary" className="vp-citation-target">幂等键也有边界：键过期后可能被清理，复用同一个键却改变参数会被拒绝；参数校验还没开始执行时，服务可能没有保存任何结果。测试要把“第一次创建”“同键重试”“同键换参数”分成不同场景，别用一次绿色响应替代它们。<Cite id="api-retry-boundary" sources={apiTestingSources} /></p>
      <p>工作台里第二次请求拿到 200，不是因为“200 永远比 201 好”，而是因为这个接口把重复意图映射回原订单。真正要断言的是：返回的订单身份一致，订单数量仍为 1；只要多出第二行，接口就算回了一个漂亮的状态码，测试也应该失败。</p>
    </ArticleSection>
    <ArticleSection id="api-testing-authorization-section" title="换一个身份，才知道门有没有锁">
      <p id="api-object-authorization" className="vp-citation-target">OWASP 把对象级授权列为 API 的常见风险：只要端点使用用户提供的对象编号访问数据，每一个这样的函数都要检查调用者是否能访问这个对象。订单编号格式合法，和用户 B 有权读取它，是两件事。<Cite id="api-object-authorization" sources={apiTestingSources} /></p>
      <p id="api-security-scope" className="vp-citation-target">越权测试要换身份，保持对象和动作不变，再观察拒绝结果与状态是否没有被改写。示例把 B 的读取定为 <code>403</code>，具体产品也可能用 <code>404</code> 隐藏资源存在性；测试应跟随自己的安全契约，不能只接受“不是 500”。<Cite id="api-security-scope" sources={apiTestingSources} /></p>
      <p>这也是 API 测试和浏览器冒烟的分界：浏览器可以证明一个用户点击后看见了什么，API 测试则能用不同令牌、不同 body 和重复请求迅速撞向服务边界。两者可以互相准备状态，也不能互相冒充。</p>
      <p><strong>写 API 测试时，按这条线收口：</strong>先写方法、路径、身份和 body，再写状态码与响应 schema；随后补一个能证明业务状态的观察点；最后用同一个对象换身份、用同一个意图重试。通过的不是“接口回了绿”，而是每个场景的响应和状态都说同一件事。</p>
    </ArticleSection>
  </Article>;
}
