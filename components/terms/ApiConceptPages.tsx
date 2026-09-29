import { BookBookmark, Check, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { ApiContractLesson, EndpointLesson, RestLesson, PaginationLesson, RateLimitLesson } from "./ApiConceptLessons";
import { apiSources, endpointSources, restSources, paginationSources, rateSources } from "@/lib/api-concept-sources";
import base from "./EventConcepts.module.css";
import s from "./ApiConcepts.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />);
}

export function ApiTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={apiSources} />;
  return <ConceptArticle slug="api" title="API" sources={apiSources} sections={[["contract", "程序之间的约定"], ["mapping", "内部变化，对外约定不变"], ["compatibility", "调用方的依赖"]]}
    intro={<>你让 AI 给读书会做一张书签，书名要从图书服务取得。AI 说需要接 API：页面该向谁要书、怎样提问、收到什么，得先与提供图书的程序约好。</>}
    hero={<ConceptHero slug="api" label="左侧调用方的书签与中间对外约定保持不变；右侧服务内部从 id、title 翻转为 book_id、display_name，表示内部变化仍可按原约定输出"><div className={s.apiHero}>
      <div className={s.apiCaller}><BookBookmark size={27} weight="light" /><strong>星空手记</strong><span>调用方</span></div>
      <div className={s.apiPort}><span>对外约定</span><code>id<br />title</code></div>
      <div className={s.apiService}><span>服务内部</span><div className={s.apiInternal}>
        <div className={s.apiLayerA}><code>id</code><code>title</code></div>
        <div className={s.apiLayerB}><code>book_id</code><code>display_name</code></div>
      </div></div>
    </div></ConceptHero>}>
    <ArticleSection id="contract" title="程序之间的约定">
      <Legacy slug="api" names={["question", "definition"]} />
      <p>这里有两个程序：读书会网页是调用方，图书服务是提供方。网页向服务发出“给我编号 42 的书”这样的请求，服务查找后把书的信息交回来，网页再用书名画出书签。若把书名预先写死在网页里，也能显示这张书签；书库里的书名后来变了，网页却不会从服务取得新值。</p>
      <p id="api-scope" className="vp-citation-target"><strong>API 是软件向其他代码开放功能时，供调用方使用的操作和规则。</strong>它告诉调用方可以做什么、怎样给出信息，以及会得到什么；提供方负责在内部完成工作。代码库提供的函数、浏览器内置的操作、网络服务的请求方式，都可以是 API 的一部分。本页先看图书服务的 HTTP API，API 本身不是某个网址。<Cite id="api-scope" /></p>
      <p>在本例的约定中，网页用 <code>GET /books/42</code> 读取这本书。GET 是这次的读取操作，<code>/books/42</code> 是图书服务中的位置；服务返回 <code>{'{"id":42,"title":"星空手记"}'}</code>。这里 <code>id</code> 是数字编号，<code>title</code> 是书名文字；这种带字段名的文本写法叫 <ConceptTerm slug="json">JSON</ConceptTerm>。网页用 <code>title</code> 显示书名，用 <code>id</code> 标明是哪本书，再画出书签；它无须知道服务内部把书名放在哪张表、哪个字段里。</p>
      <p id="api-contract" className="vp-citation-target">真正对接时，还要约定输入有哪些限制、书不存在或无权读取时会返回什么，以及调用前是否需要登录或凭证。OpenAPI 可以把 HTTP 操作、输入、响应和安全要求写成可供工具读取的描述；<strong>文档说明了预期，服务仍要实际实现这些行为。</strong><Cite id="api-contract" /></p>
      <p id="api-browser" className="vp-citation-target">浏览器提供的音频处理能力也有 API。例如网页代码调用浏览器开放的音频操作，调整一段声音的音量；这里调用的是浏览器自带的功能，不需要图书服务的网址。它与前面的 HTTP API 形式不同，共同点是调用方按提供方开放的操作和规则使用能力。<Cite id="api-browser" /></p>
    </ArticleSection>
    <ArticleSection id="mapping" title="内部变化，对外约定不变">
      <Legacy slug="api" names={["scene-heading"]} />
      <p>下面只检查这份约定中的输出字段。网页要求整数 <code>id</code> 和非空文字 <code>title</code>。服务内部先用结构 A 保存 <code>id</code> 和 <code>title</code>；切到结构 B 后，内部字段改成 <code>book_id</code> 和 <code>display_name</code>，书仍是编号 42 的《星空手记》。</p>
      <ApiContractLesson />
      <p id="api-mapping" className="vp-citation-target">勾着“按约定映射”时，服务把 B 的 <code>book_id</code>、<code>display_name</code> 分别整理成对外的 <code>id</code>、<code>title</code>。网页仍收到编号 42 和“星空手记”，可以生成同一张书签。关闭映射再交给调用方，B 的内部字段直接出现在外部数据里，网页找不到约定的 <code>id</code>、<code>title</code>，书签就不能生成。A 的字段原本与对外约定相同，关闭映射仍能通过本例检查；这不代表所有内部结构都能直接公开。Microsoft 的 Web API 设计建议也强调不要让外部数据直接照搬内部存储。<Cite id="api-mapping" /></p>
      <p>实验只在浏览器内转换教学数据，没有访问真实书库或发送网络请求。它检查的是字段约定：即使内容能写成格式正确的 JSON，也不能单凭这一点断定网页会读到需要的字段。</p>
    </ArticleSection>
    <ArticleSection id="compatibility" title="调用方的依赖" className={base.offset}>
      <Legacy slug="api" names={["quiz-heading", "prompt-heading"]} />
      <div className={s.compatibility}><div><code>对外 title → display_name</code><p>服务如果把对外的 title 改成别的名字，仍然读取 title 的旧调用方就会出错。</p></div><div><code>对外 title + subtitle</code><p>如果旧调用方忽略未知字段，新增字段通常能共存。</p></div></div>
      <p id="api-compatibility" className="vp-citation-target"><strong>兼容性要看已有调用方依赖的行为。</strong>删除字段、改变类型或含义，都可能让已有调用方出错。如果旧页面只接受 <code>id</code> 和 <code>title</code> 两个字段，新加 <code>subtitle</code> 也会使它拒绝整份数据；允许未知字段的页面则可以继续读。对外约定每次变化，都应有明确的兼容或版本策略，不能只检查新页面能否运行。<Cite id="api-compatibility" /></p>
      <p>再换个例子：天气网页向服务取温度。如果服务内部把温度的存储字段改了，却仍按约定向网页返回原来的温度字段，旧页面可以继续读；如果对外字段也改名，旧页面仍按原名取值，就需要同步修改页面或保留旧接口。是否兼容，要从调用方实际读取的内容判断。</p>
      <ArticleAside title="失败情况也要写入约定"><p>图书不存在、调用方无权读取、输入格式错误，后续处理各不相同。约定失败状态和错误结构，调用方才能决定显示空态、请求登录还是修正输入。想看一个操作怎样对应到具体入口，可以接着读<ConceptTerm slug="endpoint">端点</ConceptTerm>。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function EndpointTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={endpointSources} />;
  return <ConceptArticle slug="endpoint" title="端点" sources={endpointSources} sections={[["address", "地址与方法"], ["routing", "找到对应的入口"], ["boundary", "匹配之后还有检查"]]}
    intro={<>GET /books 读取书目，POST /books 提交新书。同一条路径可以承接不同操作。调用一个接口时，地址和方法需要一起核对。</>}
    hero={<ConceptHero slug="endpoint" label="路径和方法交叉定位到 getBook 操作"><div className={s.endpointHero}><code>/books/42</code><div>{["GET", "POST", "DELETE"].map((verb, index) => <span key={verb} data-active={index === 0}>{verb}{index === 0 && <Check size={18} />}</span>)}</div><strong>getBook</strong></div></ConceptHero>}>
    <ArticleSection id="address" title="地址与方法">
      <Legacy slug="endpoint" names={["question", "definition"]} />
      <p id="endpoint-address" className="vp-citation-target">在 HTTP API 中，端点指可访问的接口位置。一次具体调用还需要确定 <ConceptTerm slug="http-method">HTTP 方法</ConceptTerm>。例如服务基址为 <code>https://api.example.com</code>，路径为 <code>/books</code>，组合后才得到完整地址。OpenAPI 用 Server Object 描述基址，用 Paths 描述接口路径。<Cite id="endpoint-address" /></p>
      <p id="endpoint-operation" className="vp-citation-target">不同文档对 endpoint 的叫法粒度并不完全相同，有的指位置，有的连同方法称一个端点。OpenAPI 将一个路径下的 GET、POST 分别称为 <strong>operation（操作）</strong>。对接时，明确方法、完整地址、输入和预期结果，比只数“有几个端点”更有用。<Cite id="endpoint-operation" /></p>
    </ArticleSection>
    <ArticleSection id="routing" title="找到对应的入口">
      <Legacy slug="endpoint" names={["scene-heading"]} />
      <p>这份路由表只声明三个操作。选择一个组合，查看它会匹配到哪里；还可以换一个服务基址，观察同样的方法和路径怎样指向另一套环境。实验仅在本地匹配，不发送网络请求。</p>
      <EndpointLesson />
      <p>GET /books 命中 listBooks，POST /books 命中 createBook。<strong>找到 createBook，并不表示已经创建了一本书。</strong>处理入口之后还要验证输入、身份与权限，最后才是实际业务操作。</p>
    </ArticleSection>
    <ArticleSection id="boundary" title="匹配之后还有检查" className={base.offset}>
      <Legacy slug="endpoint" names={["quiz-heading", "prompt-heading"]} />
      <p id="endpoint-method" className="vp-citation-target">路径没有入口，与目标不接受该方法，是两类问题。HTTP 的 405 表示服务认识这个方法，但目标不允许使用它；响应必须提供 <code>Allow</code> 列出允许的方法。404 则可能表示未找到目标，也可能用于不愿披露其存在的情况，不能仅凭状态码推断服务内部原因。<Cite id="endpoint-method" /></p>
      <div className={s.boundaryNote}><strong>位置 → 操作 → 输入与权限 → 业务结果</strong><p>排查失败时，沿请求真正到达的位置往后看。</p></div>
      <ArticleAside title="端点与整个 API 的范围"><p>端点帮助定位一个调用位置；<ConceptTerm slug="api">API</ConceptTerm> 还包括一组操作共享的数据结构、认证方式和错误约定。可用的地址不一定公开，公开的地址也不一定允许匿名调用。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function RestTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={restSources} />;
  return <ConceptArticle slug="rest" title="REST" sources={restSources} sections={[["resource", "资源与表示"], ["actions", "表示带来的后续选择"], ["stateless", "无状态与持久数据"], ["constraints", "一组共同工作的约束"]]}
    intro={<>预约仍然是那一个预约，状态却会从待确认变成已确认。REST 讨论的是：客户端怎样识别资源、交换它的表示，并据此继续操作。</>}
    hero={<ConceptHero slug="rest" label="预约标识保持不变，返回的表示变为已确认"><div className={s.restHero}><CalendarBlank size={30} weight="light" /><code>/reservations/42</code><div><span>待确认</span><strong><Check size={22} />已确认</strong></div><p>表示随状态变化</p></div></ConceptHero>}>
    <ArticleSection id="resource" title="资源与表示">
      <Legacy slug="rest" names={["question", "definition"]} />
      <p id="rest-resource" className="vp-citation-target"><strong>REST 是一套组织网络应用交互的架构风格。</strong>在本例中，<code>/reservations/42</code> 标识一个预约；返回的 JSON 描述它某一刻的状态，是资源的“表示”。资源不等于这一段 JSON，也不要求等于某张数据库表的一行。<Cite id="rest-resource" /></p>
      <p>客户端拿到表示后，知道预约现在处于什么状态。服务端随后仍可能改变资源，因此“我刚看到待确认”和“现在能确认成功”是两件事。</p>
    </ArticleSection>
    <ArticleSection id="actions" title="表示带来的后续选择">
      <Legacy slug="rest" names={["scene-heading"]} />
      <p id="rest-controls" className="vp-citation-target">REST 的统一接口包含用超媒体驱动后续交互：客户端理解媒体类型和关系含义，再使用表示提供的操作目标继续。<strong>下一步的可选操作可以随资源状态变化。</strong>这不同于客户端事先硬编码整个业务流程的所有路径。<Cite id="rest-controls" /></p>
      <p>先获取预约表示，再确认或取消。也可以先让服务端的预约过期，再点击客户端手里的旧选择，观察实际结果。下面的 actions、rel 是本例约定的表示格式；演示只覆盖这部分机制，不代表完整实现了 REST。</p>
      <RestLesson />
      <p>过期操作只改变服务端资源，客户端保留旧表示。旧确认到达时，服务按当前状态拒绝，返回本例选择的 409 和已过期表示；客户端收到结果才撤下旧操作。确认成功后，同样以返回的新表示为准。</p>
      <ArticleAside title="按返回链接继续操作"><p id="rest-links-example" className="vp-citation-target">GitHub API 的使用建议要求直接使用响应里提供的 URL，不手动拆解或猜测未来地址；分页也通过 Link 中的关系继续。这是一个具体平台的使用约定，能帮助理解“沿返回链接前进”，不意味着仅做到这一点就满足全部 REST 约束。<Cite id="rest-links-example" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="stateless" title="无状态与持久数据" className={base.offset}>
      <Legacy slug="rest" names={["quiz-heading"]} />
      <p id="rest-stateless" className="vp-citation-target"><strong>无状态不等于服务没有数据库。</strong>预约可以持久保存。这里限制的是：服务处理一次请求，不应依赖它为这个客户端暗中记住的前几轮会话步骤；请求需要带上解释这次交互所需的信息。当前资源状态仍由服务负责检查。<Cite id="rest-stateless" /></p>
      <p id="rest-safe" className="vp-citation-target">如果使用 HTTP，方法语义也要遵守。GET 请求读取预约，不应把“打开详情”变成取消预约的命令。但记录访问日志等调用方未要求的附带行为，不自动违反安全方法语义。安全不能解释成“服务内部任何数据都不允许改变”。<Cite id="rest-safe" /></p>
    </ArticleSection>
    <ArticleSection id="constraints" title="一组共同工作的约束">
      <Legacy slug="rest" names={["prompt-heading"]} />
      <div id="rest-constraints" className="vp-citation-target"><p>Fielding 的 REST 定义还包括以下约束。<strong>URL 使用名词、返回 JSON、采用几个 HTTP 方法，都不足以单独证明符合 REST。</strong><Cite id="rest-constraints" /></p>
        <dl className={s.constraints}><div><dt>客户端与服务端分离</dt><dd>界面与数据服务分别演进。</dd></div><div><dt>无状态</dt><dd>请求提供解释本次交互所需的信息。</dd></div><div><dt>缓存</dt><dd>明确哪些响应可以复用。</dd></div><div><dt>统一接口</dt><dd>资源标识、表示操作、自描述消息、超媒体驱动。</dd></div><div><dt>分层系统</dt><dd>组件通过相邻层的接口协作。</dd></div><div><dt>按需代码 · 可选</dt><dd>允许下载代码扩展客户端能力。</dd></div></dl>
      </div>
      <p>工程中的“REST API”常宽泛指资源型 HTTP API。阅读设计文档时，继续核对采用了哪些约束，哪些没有采用，以及对应的取舍。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PaginationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={paginationSources} />;
  return <ConceptArticle slug="pagination" title="分页" sources={paginationSources} sections={[["order", "先确定顺序"], ["pages", "位置与边界"], ["continuation", "读到哪里，何时停止"]]}
    intro={<>一份不断增长的书目，每次只读三条。困难不在于切成几段，而在于读下一段时，数据可能已经变了。</>}
    hero={<ConceptHero slug="pagination" label="有序记录的读取窗口向下一批移动"><div className={s.paginationHero}><div>{[9, 8, 7, 6, 5, 4].map(id => <span key={id}>{id}</span>)}<i /></div><code>每次读取 3 条</code></div></ConceptHero>}>
    <ArticleSection id="order" title="先确定顺序">
      <Legacy slug="pagination" names={["question", "definition"]} />
      <p><strong>分页把一个结果集分批返回，并约定怎样继续读取。</strong>它限制单次传输与展示的数据量。页码按钮只是界面的一种表现，后面的 API 也可能使用偏移量、游标或返回的下一页链接。</p>
      <p id="pagination-order" className="vp-citation-target">在 PostgreSQL 中，使用 LIMIT 取一部分数据时，需要 ORDER BY 给出确定的顺序。只按可能重复的时间排序还不够，可以增加唯一编号作补充；否则“第三条之后”本身就不稳定。<Cite id="pagination-order" /></p>
    </ArticleSection>
    <ArticleSection id="pages" title="位置与边界">
      <Legacy slug="pagination" names={["scene-heading"]} />
      <p>本例按不可变编号倒序排列，每批三条。先读第一批，再在队首插入 #10，最后读下一批。两个读取器会从各自记录的位置继续，结果由当前列表实际计算。</p>
      <PaginationLesson />
      <div className={s.comparison}><div><h3>Offset：跳过几条</h3><p id="pagination-offset" className="vp-citation-target">LIMIT 3 OFFSET 3 跳过当前结果的前三条，再取三条。队首增加记录后，原来的 #7 被挤到第四位，所以下一批会再次读到它。前半句是 SQL 的规则，后半句是这个样例的推演。<Cite id="pagination-offset" /></p></div><div><h3>Cursor：从哪里继续</h3><p id="pagination-cursor" className="vp-citation-target">本例记录旧边界 #7，下次读取编号小于 7 的前三条。真实接口的游标格式取决于约定，例如 Stripe v1 列表使用对象 ID 作为 starting_after，返回列表中位于该对象之后的数据。<Cite id="pagination-cursor" /></p></div></div>
    </ArticleSection>
    <ArticleSection id="continuation" title="读到哪里，何时停止" className={base.offset}>
      <Legacy slug="pagination" names={["quiz-heading", "prompt-heading"]} />
      <p><strong>游标不等于整份列表的快照。</strong>本例中新插入的 #10 位于已读边界之前，继续向后不会读到它；重新开始才会看到。若排序键本身会改变，记录还可能跨越边界。需要一致快照的业务，必须另外约定快照或版本策略。</p>
      <p id="pagination-end" className="vp-citation-target">继续与停止也要看接口约定。Stripe v1 返回 has_more 指明后面是否还有记录，starting_after 与 ending_before 不能同时使用。不要把某个厂商的字段名当成所有分页接口的固定格式。<Cite id="pagination-end" /></p>
      <ArticleAside title="一次少返回，不代表查询一定便宜"><p id="pagination-cost" className="vp-citation-target">PostgreSQL 仍需计算 OFFSET 跳过的行，因此很大的偏移量可能低效。游标查询也需要合适的排序键、过滤条件和 <ConceptTerm slug="index">索引</ConceptTerm>；仅把参数从 page 改成 cursor，并不会自动让查询变快。<Cite id="pagination-cost" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function RateLimitingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={rateSources} />;
  return <ConceptArticle slug="rate-limiting" title="限流" sources={rateSources} sections={[["budget", "流量需要一个预算"], ["buckets", "额度共享的范围"], ["rejection", "被拒绝之后"]]}
    intro={<>两位调用方使用同一个接口，其中一位突然发出大量请求。另一位能否继续访问，取决于限额如何分配，以及它们是否共用额度。</>}
    hero={<ConceptHero slug="rate-limiting" label="五枚令牌进入桶中，三个请求消耗三枚，剩余两枚"><div className={s.rateHero}><div>{[0, 1, 2, 3, 4].map(id => <i key={id} />)}</div><strong>2 / 5</strong><code>补充速率 1 枚 / 秒</code></div></ConceptHero>}>
    <ArticleSection id="budget" title="流量需要一个预算">
      <Legacy slug="rate-limiting" names={["question", "definition"]} />
      <p><strong>限流按照选定的规则，限制一段时间内接受的请求量。</strong>它可以保护容量、控制成本，也可以减少一位调用方占用过多资源。超额后是拒绝还是延后处理，取决于系统设计；下面选择直接拒绝。</p>
      <p id="rate-bucket" className="vp-citation-target">令牌桶是一种实现：桶有最大容量，令牌按速率补充，每次请求需要消耗令牌。积存的令牌允许短时突发，补充速率决定持续流量。AWS API Gateway 使用这类算法，并分别配置持续速率和突发容量。<Cite id="rate-bucket" /></p>
    </ArticleSection>
    <ArticleSection id="buckets" title="额度共享的范围">
      <Legacy slug="rate-limiting" names={["scene-heading"]} />
      <p>桶最多容纳 5 枚令牌，每个请求消耗 1 枚，每秒补充 1 枚。先让 A 连发 7 次，再让 B 请求一次；换成独立桶再比较。这里的时间由“推进 1 秒”控制，不会在阅读时偷偷消耗额度。</p>
      <RateLimitLesson />
      <p>共享桶里，A 用掉 5 枚后，A 的剩余 2 次与 B 的请求都会被拒绝。独立桶里，A 用完自己的额度，B 仍有 5 枚。切换策略会重开实验；回执保留的是标注时刻那一批请求的结果。</p>
      <p id="rate-scope" className="vp-citation-target">真实系统可以同时设置客户端、方法、账户等多层限制。独立额度解决调用方之间的争抢，整体容量仍需要总量约束。AWS 的客户端限制也受更高层账户与区域限制影响。<Cite id="rate-scope" /></p>
    </ArticleSection>
    <ArticleSection id="rejection" title="被拒绝之后" className={base.offset}>
      <Legacy slug="rate-limiting" names={["quiz-heading", "prompt-heading"]} />
      <p id="rate-response" className="vp-citation-target">HTTP 的 429 表示一段时间内请求过多，响应可以带 Retry-After 提示等待多久；这个头不是必有字段，规范也不强制某一种计数算法。实验选择等待 1 秒，是因为空桶到下一枚令牌需要这么久；不保证下一批所有请求都能通过。<Cite id="rate-response" /></p>
      <p><strong>通过限流检查，不等于业务执行成功。</strong>请求之后仍可能因为无权访问、输入错误或服务故障失败。收到限流响应也不应无限立即重发，客户端需要控制重试节奏，并先判断操作能否安全重复。</p>
      <ArticleAside title="令牌桶的保证边界"><p id="rate-limits" className="vp-citation-target">这个本地实验使用一个确定的计数器。真实网关可能跨多个节点协调；AWS 明确将其节流与配额视为尽力而为的目标，而非绝对请求上限。限流还不能代替权限检查、整体容量规划或完整的反滥用防护。<Cite id="rate-limits" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
