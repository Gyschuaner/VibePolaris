import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { inputValidationSources } from "@/lib/input-validation-sources";
import { InputValidationSignatureHero as InputValidationHero } from "../TestSecuritySignatureHeroes";
import { InputValidationLesson } from "./input-validation";

const sections: [string, string][] = [
  ["input-validation-shape-section", "先把外部数据读成可判断的形状"],
  ["input-validation-meaning-section", "格式正确，事情仍可能不成立"],
  ["input-validation-query-section", "允许列表要落到真正的执行入口"],
  ["input-validation-boundary-section", "校验之后，还有一扇授权的门"],
];

export function InputValidationTermPage() {
  return <Article slug="input-validation" title="输入校验" subtitle="Input Validation · 先把外部数据读懂，再让它靠近业务" sources={inputValidationSources} sections={sections} hero={<InputValidationHero />} intro={<>你在账单页面选了日期和排序，输入框都已经变绿。请求送到服务器后，真正的问题变成了：日期顺序有没有意义？排序字段是不是系统允许的那一个？这个账号是不是当前人能看的？<strong>输入校验把外部数据先变成可以判断的值，再在业务动作发生前挡住不符合规则的请求。</strong></>}> 
    <ArticleSection id="input-validation-shape-section" title="先把外部数据读成可判断的形状">
      <p id="iv-definition" className="vp-citation-target">输入校验是在应用使用数据之前，检查它是否满足当前应用的要求。账单请求从网络进来时，服务器要先确认它能被安全解析、字段类型和结构说得通，再把它交给查询或业务逻辑；校验的对象是外部数据，不是页面上的红边。OWASP 把它和后面的参数化查询、输出编码、授权分别列为不同防线。<Cite id="iv-definition" sources={inputValidationSources} /></p>
      <p id="iv-client-server" className="vp-citation-target">浏览器校验适合及时告诉人“日期少了一位”或“数值超出范围”，却不能承担安全边界。请求可以从脚本、移动端、旧客户端或代理直接发到接口，绕过页面的 JavaScript；因此服务端必须重新执行同一组规则。<Cite id="iv-client-server" sources={inputValidationSources} /></p>
      <p id="iv-syntax-semantics" className="vp-citation-target">第一层问的是<strong>语法</strong>：这是日期、整数、UUID，还是一个字段根本不存在？第二层问的是<strong>语义</strong>：结束日期是否晚于开始日期，数量是否落在业务允许的范围？OWASP 用预约日期作例子：两个日期都能解析，不代表它们的先后关系成立。<Cite id="iv-syntax-semantics" sources={inputValidationSources} /></p>
      <p id="iv-schema" className="vp-citation-target">结构化请求可以用 schema 把规则写下来：哪些字段必填，字段是什么类型，数组有多少项，未知字段是否拒绝。JSON Schema 的结构校验只对它声明的约束作出断言；字段列表写在 schema 里，并不自动意味着它们必填，也不自动拒绝额外属性，后端需要明确配置这些边界。<Cite id="iv-schema" sources={inputValidationSources} /></p>
      <p id="iv-parse-limits" className="vp-citation-target">顺序也很重要。请求体太大、JSON 嵌套太深时，应用不能等解析器把资源吃完才开始校验；应先设大小和解析限制，使用维护中的解析器，解析失败就停下。把文本转成整数只说明它是整数，不说明它是可接受的数量。<Cite id="iv-parse-limits" sources={inputValidationSources} /></p>
      <p>所以首图里的第一扇门不是“输入框有没有通过”，而是“服务器有没有得到一份边界清楚、可以继续判断的值”。没有这一步，后面的日期比较、排序映射和权限检查都可能建立在半成品上。</p>
    </ArticleSection>

    <ArticleSection id="input-validation-meaning-section" title="格式正确，事情仍可能不成立">
      <p id="iv-format" className="vp-citation-target">schema 里的 <code>format</code> 也要看清它的实现语义。在 JSON Schema 2020-12 中，format 默认可以只是给实现和应用的注释；把它当成强制断言需要启用对应的词汇，而且不同实现的支持程度可能不同。邮件像邮件、日期像日期，仍不能替代应用对业务含义的检查。<Cite id="iv-format" sources={inputValidationSources} /></p>
      <p id="iv-status" className="vp-citation-target">这就是为什么工作台把失败分成不同结果。格式破损或请求语法无法处理时，可以用 <code>400 Bad Request</code> 表达客户端请求有问题；服务器读懂了内容，但里面的指令在业务上无法处理时，RFC 9110 定义了 <code>422 Unprocessable Content</code> 这一语义。具体接口应遵守自己的错误契约，状态码不是装饰。<Cite id="iv-status" sources={inputValidationSources} /></p>
      <p id="iv-400-422" className="vp-citation-target">例如 <code>endAt: "昨天"</code> 可能在结构层就失败；<code>startAt: "2026-10-05"</code>、<code>endAt: "2026-10-04"</code> 则两项都是合法日期，但这段时间没有可用的先后关系。前者还没形成可用请求，后者已经被读懂，却不能继续查账单。首图停在 <code>422</code>，并不是说所有框架都必须这样选，而是把“语法”和“语义”两道判断分开给你看。<Cite id="iv-400-422" sources={inputValidationSources} /></p>
      <InputValidationLesson />
      <p>修正结束日期后，请求才来到下一层。此时校验已经帮业务代码排除了一个明显错误，但它没有替业务决定“阿青有没有权查看这个账号”；把问题留给正确的那一层，错误信息和审计记录才不会互相混淆。</p>
    </ArticleSection>

    <ArticleSection id="input-validation-query-section" title="允许列表要落到真正的执行入口">
      <p id="iv-allowlist" className="vp-citation-target">面对排序字段、导出格式和固定选项，最稳的做法是写出允许列表：只接受已知的 <code>createdAt</code>、<code>amount</code> 等值，其余值在入口处被拒绝。不要试图列出所有“看起来像攻击”的字符串；OWASP 特别提醒，单纯拦截撇号会误伤合法姓名，也不会让数据库查询自动安全。<Cite id="iv-allowlist" sources={inputValidationSources} /></p>
      <p id="iv-parameterized" className="vp-citation-target">用户输入要作为值传给参数化接口，而不是拼进解释器要执行的代码。准备好的查询会把 <code>tom' or '1'='1</code> 当成一个完整的用户名字符串，不能让它改变查询意图；输入校验是额外的字段规则，不能替代参数化查询。<Cite id="iv-parameterized" sources={inputValidationSources} /></p>
      <p id="iv-query-allowlist" className="vp-citation-target">排序列名不能像普通值那样绑定时，可以把公开的字段名映射成代码里固定的列名：<code>createdAt → created_at</code>，映射表之外的值没有 SQL 入口。工作台中的“固定映射”因此不是把字符串洗干净，而是让用户的值只能选择一条已经写好的路。<Cite id="iv-query-allowlist" sources={inputValidationSources} /></p>
      <p>允许列表也不意味着所有字段都只能由英文字母和数字组成。账单备注、姓名和地址可能需要正常的标点或 Unicode 文字；对它们应该限制长度、编码和上下文输出方式，保留合法内容，再在 HTML、SQL 或命令行的实际语境使用对应的安全接口。</p>
    </ArticleSection>

    <ArticleSection id="input-validation-boundary-section" title="校验之后，还有一扇授权的门">
      <p id="iv-authorization" className="vp-citation-target"><code>accountId=acct-lee</code> 是一个格式合法的账号编号，这只说明服务器知道它指向哪个对象。授权还要问：当前主体阿青是否被允许对这个对象执行读取？OWASP 明确区分认证和授权，并要求在每次请求的正确位置检查资源与主体的关系；合法 ID 不能跳过对象级授权。<Cite id="iv-authorization" sources={inputValidationSources} /></p>
      <p id="iv-boundary" className="vp-citation-target">因此输入校验、查询安全和授权各自有停止点。日期不成立时返回校验错误，不查数据库；排序值不在允许列表时不生成查询；账号归属不匹配时由授权层拒绝，常见结果是 <code>403</code>，有些产品会用 <code>404</code> 隐藏资源存在性。不要为了让错误看起来统一，把授权失败伪装成“UUID 格式错误”。<Cite id="iv-boundary" sources={inputValidationSources} /></p>
      <p>回到一开始的账单页面，可以按四个问题收口：服务器收到的值能否安全解析；字段结构和业务关系是否成立；值是否只能进入预先设计的查询或输出接口；这个主体是否有权触碰目标对象。<strong>输入校验负责把数据变得可判断，授权负责决定这个人能不能做这件事。</strong></p>
    </ArticleSection>
  </Article>;
}
