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
  return <ConceptArticle slug="endpoint" title="端点" sources={endpointSources} sections={[["address", "地址与方法"], ["routing", "找到对应的处理程序"], ["boundary", "匹配之后还有检查"]]}
    intro={<>读书会网页要从图书服务取一本书。AI 给了 <code>/books/42</code>，还特意标着 GET。这个 GET 为什么不能省？</>}
    hero={<ConceptHero slug="endpoint" label="路径和方法交叉定位到 getBook 操作"><div className={s.endpointHero}><code>/books/42</code><div>{["GET", "POST", "DELETE"].map((verb, index) => <span key={verb} data-active={index === 0}>{verb}{index === 0 && <Check size={18} />}</span>)}</div><strong>getBook</strong></div></ConceptHero>}>
    <ArticleSection id="address" title="地址与方法">
      <Legacy slug="endpoint" names={["question", "definition"]} />
      <p>读书会网页是发起调用的一方，图书服务是提供书目的一方。若把书目预先写在网页里，也能显示列表；要读到以后新上架的书，网页就得知道到哪里、用什么方式提出请求。</p>
      <p id="endpoint-address" className="vp-citation-target"><strong>在 HTTP API 中，端点先帮调用方找到服务开放的位置。</strong>本例的服务基址是 <code>https://api.example.com</code>，可以理解为提供图书服务的网址；路径 <code>/books</code> 指向书目，拼起来是 <code>https://api.example.com/books</code>。首图里的 <code>/books/42</code> 则指向本例编号为 42 的书。路径只是完整地址的一部分。OpenAPI 是描述 HTTP API 的一种规范，它也把服务网址和路径分开写。<Cite id="endpoint-address" /></p>
      <p id="endpoint-verb" className="vp-citation-target">同一个地址还要配上 <ConceptTerm slug="http-method">HTTP 方法</ConceptTerm>，告诉服务这次想做哪类操作。本例里，<code>GET /books</code> 读取书目，<code>POST /books</code> 向同一位置提交新书的信息；GET 通常用于读取，POST 用于提交内容，也可能改变服务端保存的信息。服务是否真的接受某个组合，仍要看它开放了什么。<Cite id="endpoint-verb" /></p>
      <p id="endpoint-operation" className="vp-citation-target">“端点”有时指这条可访问的路径，有时指方法加路径的组合。OpenAPI 在同一路径下分别写 GET、POST，并把其中每个方法的定义称为 <strong>operation（操作）</strong>。所以只说“调用 <code>/books</code> 端点”还不够：调用方还得知道完整地址、方法、要给什么信息，以及预期会收到什么。端点说的是服务开放的调用位置；整个 API 还包含输入、返回和失败等约定。<Cite id="endpoint-operation" /></p>
    </ArticleSection>
    <ArticleSection id="routing" title="找到对应的处理程序">
      <Legacy slug="endpoint" names={["scene-heading"]} />
      <p id="endpoint-router" className="vp-citation-target">服务端需要把收到的方法和路径对应到处理程序，也就是负责这类请求的一段代码。以 FastAPI 这个编写服务的框架为例，开发者可以指定哪段代码处理某条路径的 GET 请求。本页用一张只有三行的教学路由表表示这种对应关系：<code>GET /books</code> 对应 <code>listBooks</code>，<code>POST /books</code> 对应 <code>createBook</code>，<code>GET /books/42</code> 对应 <code>getBook</code>。这些英文名字只是本例处理程序的标签，不是 HTTP 内置命令。<Cite id="endpoint-router" /></p>
      <p>选一个方法和路径，再点“查找处理程序”，看这份表是否列出了对应的处理程序。你也能换服务基址，看完整地址怎样变化。实验只在浏览器内查这张表，不向示例地址发送网络请求。</p>
      <EndpointLesson />
      <p id="endpoint-environment" className="vp-citation-target">把基址从 <code>https://api.example.com</code> 换成 <code>https://test.example.com</code>，同一条 <code>/books</code> 路径就组成另一个完整地址。OpenAPI 可以为开发、测试和正式环境分别描述服务网址；本实验仍使用同一张教学路由表，所以匹配到的处理程序名称不会随基址变化。真实环境不一定有相同的数据、路由或权限，不能只凭这次本地匹配推断远端可用。<Cite id="endpoint-environment" /></p>
      <p><strong>找到 <code>createBook</code>，并不表示已经创建了一本书。</strong>这次匹配只说明所选方法和路径对应哪个处理程序。服务还需要按自身规则核对输入、身份和权限，业务操作成功后才会有“新书已加入”的结果；本页没有执行这些步骤。</p>
    </ArticleSection>
    <ArticleSection id="boundary" title="匹配之后还有检查" className={base.offset}>
      <Legacy slug="endpoint" names={["quiz-heading", "prompt-heading"]} />
      <p id="endpoint-method" className="vp-citation-target">在这张表里，<code>/authors</code> 完全没有声明；<code>/books</code> 已声明，却没有 <code>DELETE</code> 操作。演示分别提示“路径不存在”和“该路径未声明此方法”，并未生成真实 HTTP 响应。真实 HTTP 的 405 表示服务认识这次用的方法，但所请求的目标不支持它；响应还必须用 <code>Allow</code> 列出当前支持的方法。404 表示这次没找到可访问的目标，也可能是服务不愿透露它存在。例如无权查看某本书时，服务可以选择用 404 隐藏它。不能仅凭 404 推断服务内部一定没有那本书。<Cite id="endpoint-method" /></p>
      <div className={s.boundaryNote}><strong>位置与方法 → 输入、身份和权限 → 业务结果</strong><p>排查失败时，按这条链逐步看请求停在哪一步。</p></div>
      <p>换到笔记服务也能这样判断：<code>GET /notes</code> 可以表示读笔记列表，<code>POST /notes</code> 可以表示提交新笔记；即使路径一样，也要分别确认两种方法是否开放。把网址改到测试环境，只是换了请求目标，不能证明测试环境已有同一批笔记。</p>
      <ArticleAside title="可访问不等于有权限"><p>端点是调用位置，不是通行证。可用的地址不一定公开，公开的地址也不一定允许匿名调用；是否需要登录、能否读取或新增，仍要看 <ConceptTerm slug="api">API</ConceptTerm> 的权限约定和服务的实际检查。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function RestTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={restSources} />;
  return <ConceptArticle slug="rest" title="REST" sources={restSources} sections={[["resource", "资源与表示"], ["actions", "表示带来的后续选择"], ["stateless", "无状态与持久数据"], ["constraints", "一组共同工作的约束"]]}
    intro={<>预约网页刚读到“待确认”，也拿到了“确认”这个选择。服务端后来把预约判为过期，网页手里的旧信息却不会自己改。这时再点确认，为什么可能被拒绝？</>}
    hero={<ConceptHero slug="rest" label="服务端预约已过期，网页上次收到的表示仍写着待确认与确认选项"><div className={s.restHero}><code>/reservations/42</code><div className={s.restHeroPair}><div className={s.restHeroResource}><span><CalendarBlank size={17} weight="light" />服务端预约</span><div><strong className={s.restHeroPending}>待确认</strong><strong className={s.restHeroExpired}>已过期</strong></div></div><div className={s.restHeroSnapshot}><span>网页上次收到</span><strong>待确认</strong><div><i>确认</i><i>取消</i></div></div></div></div></ConceptHero>}>
    <ArticleSection id="resource" title="资源与表示">
      <Legacy slug="rest" names={["question", "definition"]} />
      <p>先分清两处：预约服务保存着 42 号预约，网页只拿到上次读取的内容。首图左边是服务端当前状态，右边是网页收到的那一份。左边变为“已过期”时，右边不会凭空同步。</p>
      <p id="rest-resource" className="vp-citation-target"><strong>REST 是一套架构风格，讲的是网络应用中客户端（比如这个网页）和服务端怎样交互。</strong>在本例中，<code>/reservations/42</code> 是预约的标识，预约是<strong>资源</strong>；服务返回的 JSON（一种常见的数据格式）可以描述它当时的状态，这份返回内容是资源的<strong>表示</strong>。同一个资源后来仍可用原标识找到，但新读到的表示可能不同。资源不等于某一份 JSON，也不要求等于数据库里的一行。<Cite id="rest-resource" /></p>
      <p>开发者也可以事先把“确认”按钮和请求地址写在网页里，预约照样能用；只是网页得提前知道后面每一步的地址，服务改动流程时网页也得跟着改。本例采用另一种做法：网页先读取预约，从收到的内容取得当前可用的选择。无论哪种做法，旧页面上的按钮都不能保证服务现在会接受确认。</p>
    </ArticleSection>
    <ArticleSection id="actions" title="表示带来的后续选择">
      <Legacy slug="rest" names={["scene-heading"]} />
      <p id="rest-controls" className="vp-citation-target">表示除了描述状态，还可以提供通往下一步的链接或操作。客户端先知道怎样读这种表示、每个动作是什么意思（比如哪个是确认、哪个是取消），再沿服务给出的目标继续，而不是猜后续地址。REST 把这种由返回内容引导下一步的方式称为<strong>超媒体驱动</strong>。待确认时收到的那份表示给出“确认”和“取消”；过期后的新表示不再给这两个选择。网页显示出按钮，是因为收到的表示给了它相应的操作目标；按钮本身不保证操作成功。<Cite id="rest-controls" /></p>
      <p>先点“获取最新表示”，看网页收到什么、能选什么。也可以先让服务端预约过期，再试网页手里的旧“确认”。演示中的 <code>actions</code> 是动作列表，<code>rel</code> 说明动作含义；确认动作的 <code>method</code> 是 <code>PATCH</code>，<code>body</code> 写着希望改成“已确认”。这些字段和方法都是本例的约定，不是 REST 规定所有预约服务都要这样写。这里仅演示资源、表示和后续选择的一部分机制。</p>
      <RestLesson />
      <p id="rest-conflict" className="vp-citation-target">过期操作先只改变服务端预约，网页保留旧表示，所以“确认”按钮还在。旧确认送到服务后，服务按当前状态拒绝。画面里的 200 和 409 是 HTTP 响应状态码，说的是这次请求的结果，不是预约的状态：本例用 200 标出成功，用 409 表示旧确认与当前预约状态冲突。拒绝时服务返回“已过期”的新表示，网页收到后才撤下旧选择。409 是本例对这种冲突的处理，不是 REST 对过期预约规定的唯一响应。确认或取消成功时，网页也以新返回的表示更新自己。<Cite id="rest-conflict" /></p>
      <ArticleAside title="按返回链接继续操作"><p id="rest-links-example" className="vp-citation-target">GitHub API 的使用建议要求直接使用响应里提供的 URL，不手动拆解或猜测未来地址；分页也通过 Link 中的关系继续。这是一个具体平台的使用约定，能帮助理解“沿返回链接前进”，不意味着仅做到这一点就满足全部 REST 约束。<Cite id="rest-links-example" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="stateless" title="无状态与持久数据" className={base.offset}>
      <Legacy slug="rest" names={["quiz-heading"]} />
      <p id="rest-stateless" className="vp-citation-target"><strong>无状态不等于服务不保存预约。</strong>服务可以持久保存预约的当前状态。无状态限制的是请求之间的会话依赖：处理这一次请求所需的信息要随请求给出，不能要求服务暗中记得这个网页前几步点过什么。比如本例的确认动作带着目标（<code>href</code>）、方法（<code>method</code>）和要改成的状态（<code>body</code>）；服务仍会查看预约现在是否还允许确认。登录也不例外：每次请求需带上身份凭据，服务可据此查询账号资料。<Cite id="rest-stateless" /></p>
      <p id="rest-safe" className="vp-citation-target">如果用 HTTP，方法本身的含义也要遵守。GET 用来读预约；比如网页上有个“打开详情”按钮，点它不应该把预约取消掉。这里说的<strong>安全方法</strong>，是客户端没有请求改变目标资源，并不保证服务内部一个字节都不变；写入访问日志这类附带行为可以发生。<Cite id="rest-safe" /></p>
    </ArticleSection>
    <ArticleSection id="constraints" title="一组共同工作的约束">
      <Legacy slug="rest" names={["prompt-heading"]} />
      <div id="rest-constraints" className="vp-citation-target"><p>上面的预约实验只展示了资源标识、表示引导下一步和请求独立性。Fielding 提出的 REST 还要求几项约束共同工作。<strong>把 URL 写成名词、返回 JSON、使用几个 HTTP 方法，都不能单独证明一个服务符合 REST。</strong><Cite id="rest-constraints" /></p>
        <dl className={s.constraints}><div><dt>客户端与服务端分离</dt><dd>界面与数据服务分别演进。</dd></div><div><dt>无状态</dt><dd>请求提供解释本次交互所需的信息。</dd></div><div><dt>缓存</dt><dd>明确哪些响应可以复用。</dd></div><div><dt>统一接口</dt><dd>用标识找到资源，通过表示操作它；消息附有理解和处理它所需的信息，返回内容引导下一步。</dd></div><div><dt>分层系统</dt><dd>组件通过相邻层的接口协作。</dd></div><div><dt>按需代码 · 可选</dt><dd>允许下载代码扩展客户端能力。</dd></div></dl>
      </div>
      <p>换成借书续借也是同一个判断：网页上次读到“可续借”和续借目标，不能保证书在点击时仍可续。网页用收到的续借目标发起请求；服务按当前状态作答，网页再按答复更新。工程文档常把资源型 HTTP API 也叫“REST API”。看到这个名称时，还要看它实际采用了哪些约束。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PaginationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={paginationSources} />;
  return <ConceptArticle slug="pagination" title="分页" sources={paginationSources} sections={[["order", "先确定顺序"], ["pages", "位置与边界"], ["continuation", "读到哪里，何时停止"]]}
    intro={<>书目第一次返回 9、8、7；点击“加载更多”，7 却又出现了。两次读取之间，有人往列表最前面加了一本书。</>}
    hero={<ConceptHero slug="pagination" label="上次已读9、8、7；队首插入10后，按当前列表跳过三条，下一批再次出现7"><div className={s.paginationHero}>
      <div className={s.paginationRead}><small>上次已读</small>{[9, 8, 7].map(id => <span key={id} data-repeat={id === 7}>{id}</span>)}</div>
      <div className={s.paginationCurrent}><small>现在</small>{[10, 9, 8, 7, 6, 5].map(id => <span key={id} data-new={id === 10}>{id === 10 ? "+10" : id}</span>)}</div>
      <div className={s.paginationNext}><small>跳过 3 条</small>{[7, 6, 5].map(id => <span key={id} data-repeat={id === 7}>{id}</span>)}</div>
    </div></ConceptHero>}>
    <ArticleSection id="order" title="先确定顺序">
      <Legacy slug="pagination" names={["question", "definition"]} />
      <p><strong>分页把较长的结果分批返回，并约定怎样取下一批。</strong>网页只需接收和展示眼前这批，不必一开始就拿完整书目。界面上的页码和“加载更多”都是入口；服务端实际可能按位置跳过、从某个边界继续，或直接给下一页的链接。如果书目只有十来条，一次返回也可以。</p>
      <p id="pagination-order" className="vp-citation-target">要说“下一批”，先得说清按什么排序。本例的书按不会改变的编号从大到小排，9、8、7 后面才是 6。若两本书在同一秒上架，只按上架时间排，就没说清哪本在前；分批读取时，同一位置可能落到不同的书。再按唯一编号排一次，顺序才确定。PostgreSQL 是一种数据库，它把排序写作 <code>ORDER BY</code>，把“最多取几条”写作 <code>LIMIT</code>；它的文档提醒：取部分记录时，需要先确定唯一顺序。<Cite id="pagination-order" /></p>
    </ArticleSection>
    <ArticleSection id="pages" title="位置与边界">
      <Legacy slug="pagination" names={["scene-heading"]} />
      <p>开始时服务端有 9 到 1 号书，每次给三条。网页先拿到 9、8、7；接着服务端在队首插入 10，当前顺序变成 10、9、8、7、6……网页已经收到的第一批仍是 9、8、7。下一次请求面对的是<strong>已经变化的列表</strong>，而不是事先切好、永远不变的第二页。下面用同一份当前列表，分别试两种继续方式。</p>
      <PaginationLesson />
      <div className={s.comparison}><div><h3>Offset：跳过几条</h3><p id="pagination-offset" className="vp-citation-target">网页记着“已经取了三条”，于是下次让服务端跳过<strong>当前列表</strong>的前三条，再取三条。现在前三条是 10、9、8；第四条是旧批的 7，结果便是 7、6、5，7 重复了。PostgreSQL 里写成 <code>LIMIT 3 OFFSET 3</code> 时，<code>OFFSET</code> 就是先跳过三条。<Cite id="pagination-offset" /></p></div><div><h3>Cursor：从哪里继续</h3><p id="pagination-cursor" className="vp-citation-target">另一边记住上批末尾的 7，下次从“7 之后”继续。本例编号倒序且不变，所以取编号小于 7 的前三条，得到 6、5、4；队首插入 10 不会改变这个边界。<strong>游标是继续位置的标记</strong>，不一定直接写成编号：Stripe v1 用现有对象 ID 作 <code>starting_after</code>，GitHub GraphQL 则返回 <code>endCursor</code>，下次请求时把它放进 <code>after</code> 参数。调用方按各自接口约定传回即可，不必猜测标记内部怎样编码。<Cite id="pagination-cursor" /></p></div></div>
    </ArticleSection>
    <ArticleSection id="continuation" title="读到哪里，何时停止" className={base.offset}>
      <Legacy slug="pagination" names={["quiz-heading", "prompt-heading"]} />
      <p><strong>不重复旧记录，不等于看到了整份最新列表。</strong>新书 10 在边界 7 前面，沿着 7 往后读不会遇到它；重新从第一批读才会看到。若改按“最近修改时间”排序，一本书被修改后可能移到队首，旧边界不再代表同一位置；前面靠“编号不变”得出的结论，到这里不能直接套用。要得到某一时刻完整而一致的结果，得由服务端固定那一时刻的列表，或让后续请求都读取同一版本；光是换成游标做不到。</p>
      <p id="pagination-end" className="vp-citation-target">何时停，也要看具体接口的约定。假如一共六条、每批三条，第二批刚好装满，却已经是最后一批；不能靠“装满”判断还有下一页。Stripe v1 的 <code>has_more</code> 为 <code>false</code> 表示已到末尾；GitHub GraphQL 的 <code>hasNextPage</code> 为 <code>false</code> 也表示不再向后取。字段名不一样，含义要各自查文档确认。<Cite id="pagination-end" /></p>
      <p id="pagination-next-link" className="vp-citation-target">还有接口直接告诉你下一页去哪里：GitHub REST 的响应可以带 <code>Link</code>，其中 <code>rel="next"</code> 对应下一页 URL；没有下一页时，响应里就不会出现这条链接。客户端沿返回的链接继续，不用自己拼地址。它是 GitHub REST 的做法，不是每个分页接口都必须有的字段。<Cite id="pagination-next-link" /></p>
      <p>换成按新到旧排列的聊天消息也是一样：先读 9、8、7，再来一条 10，按当前列表跳过三条会重见 7；从旧消息 7 往后读不会重见 7，也不会碰到刚来的 10。想看新消息就刷新列表开头；想核对某一时刻的完整消息，则先看服务端是否支持后续请求都读取同一版本。</p>
      <ArticleAside title="一次少返回，不代表查询一定便宜"><p id="pagination-cost" className="vp-citation-target">PostgreSQL 仍需在服务端找到 <code>OFFSET</code> 跳过的记录，才能知道从哪里开始返回；跳过很多条时，这一步可能变慢。分页限制了单次返回的数量，却不能单凭“每页三条”判断查询代价；具体还要看排序、过滤和 <ConceptTerm slug="index">索引</ConceptTerm>。<Cite id="pagination-cost" /></p></ArticleAside>
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
