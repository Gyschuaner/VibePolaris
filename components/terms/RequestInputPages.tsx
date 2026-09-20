import { ArrowRight, User } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { QueryParameterLesson, QueryEncodingLesson, PathParameterLesson, RequestBodyLesson } from "./RequestInputLessons";
import { queryParameterSources, pathParameterSources, requestBodySources } from "@/lib/request-input-sources";
import base from "./EventConcepts.module.css";
import s from "./RequestInputs.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />);
}

export function QueryParameterTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={queryParameterSources} />;
  return <ConceptArticle slug="query-parameter" title="查询参数" sources={queryParameterSources}
    intro={<>书店还是那家书店，列表可以只看科学书，也可以同时看艺术书。地址里的查询参数把这些条件带给程序，让它知道这次要返回哪一组结果。</>}
    sections={[["conditions", "地址中的条件"], ["selection", "一条查询怎样改变集合"], ["encoding", "特殊字符怎样保留"], ["contract", "共享地址与接口约定"]]}
    hero={<ConceptHero slug="query-parameter" label="同一组书目按条件筛选后只保留两本"><div className={s.queryHero}><code>/books?tag=science</code><div className={s.heroBooks}>{["A", "B", "C", "D", "E", "F"].map(letter => <span key={letter}>{letter}</span>)}</div></div></ConceptHero>}>
    <ArticleSection id="conditions" title="地址中的条件">
      <Legacy slug="query-parameter" names={["question", "definition"]} />
      <p id="query-component" className="vp-citation-target"><strong>查询参数是应用放在 URL 查询部分中的命名输入。</strong>查询部分从第一个 <code>?</code> 开始，到 <code>#</code> 或地址末尾结束。常见写法是 <code>键=值</code>，多项用 <code>&amp;</code> 连接；URI 规范定义这个位置，却不规定 <code>tag</code> 要筛选什么。<Cite id="query-component" /></p>
      <div className={s.urlExample}><code>/books</code><span>?</span><code><mark>tag=science</mark></code></div>
      <p>本页约定：tag 指定图书分类，多次出现表示“任一分类都可以”；q 按书名包含的文字筛选。不提供 tag 就不过滤分类，提供一个不存在的分类就得到空集合。这些是这家示例书店的规则，换一个接口需要重新看它的说明。</p>
    </ArticleSection>
    <ArticleSection id="selection" title="一条查询怎样改变集合">
      <Legacy slug="query-parameter" names={["scene-heading"]} />
      <p>先应用“科学”，再试“科学或艺术”和“逗号写法”。这里会实际解析输入并筛选下方六本示例书；淡下去的是未命中的书，不是被删除的数据。也可以直接编辑查询串，例如 <code>q=星空</code>。演示不向服务器发送请求。</p>
      <QueryParameterLesson />
      <p id="query-reading" className="vp-citation-target"><code>URLSearchParams.get("tag")</code> 只读取第一个值，<code>getAll("tag")</code> 读取全部同名值。<strong>逗号不会自动把一个值拆成两个值。</strong>所以本例中 <code>tag=science,art</code> 找不到分类；服务若希望支持这种写法，必须另外约定并解析。<Cite id="query-reading" /></p>
      <div className={s.compare}><div><h3>缺失</h3><p><code>/books</code><br />没有 tag，本例展示所有分类。</p></div><div><h3>空值</h3><p id="query-empty" className="vp-citation-target"><code>/books?tag=</code><br />存在 tag，值是空字符串。URLSearchParams 也把单独的 <code>tag</code> 解析为空字符串；没有这个键时，get 返回 null。<Cite id="query-empty" /></p></div></div>
    </ArticleSection>
    <ArticleSection id="encoding" title="特殊字符怎样保留">
      <p id="query-encoding" className="vp-citation-target">搜索词里也可能有加号、空格和 &amp;。把原值交给 URLSearchParams，它会在序列化时编码：空格变成 <code>+</code>，原本的加号变成 <code>%2B</code>。不要先手工编码一次再传入，否则百分号还会被再次编码。<Cite id="query-encoding" /></p>
      <QueryEncodingLesson />
      <p>看最后解析回来的 q 是否与原值一致。编码解决的是字符边界，不是保密；<code>%26</code> 可以还原为 &amp;，不能因为地址看起来难读就把它当成加密。</p>
    </ArticleSection>
    <ArticleSection id="contract" title="共享地址与接口约定" className={base.offset}>
      <Legacy slug="query-parameter" names={["quiz-heading", "prompt-heading"]} />
      <p>查询参数常用来表达搜索、排序和<ConceptTerm slug="pagination">分页</ConceptTerm>，方便保存或分享同一组条件。参数名称、默认值、数字范围、重复键的处理方式，都应由接口约定。字符串 <code>page=2</code> 也需要程序转换和校验，不能只因为写了数字就相信它有效。</p>
      <p id="query-secrets" className="vp-citation-target"><strong>不要把密码或长期凭据放进查询参数。</strong>完整地址可能进入历史记录、服务日志或被复制分享；使用 HTTPS 也不会自动清除这些记录。<Cite id="query-secrets" /></p>
      <ArticleAside title="查询条件与路径定位"><p><code>/books/42</code> 常用于定位一本书，<code>/books?tag=science</code> 常用于查找一组书。它们是常见接口设计方式，并非 HTTP 规定“查询只能筛选”。判断输入放在哪里时，先确定资源、操作和接口契约。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function PathParameterTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={pathParameterSources} />;
  return <ConceptArticle slug="path-parameter" title="路径参数" sources={pathParameterSources}
    intro={<>打开 42 号读者的资料，地址是 /readers/42；换成 43，就请求另一位读者。同一条路径模板接收不同的值，程序再据此寻找对象。</>}
    sections={[["template", "模板里的可替换位置"], ["matching", "请求落在哪条路由"], ["checks", "匹配之后还有检查"], ["framework", "路径规则属于谁"]]}
    hero={<ConceptHero slug="path-parameter" label="42进入路径槽位，定位42号读者"><div className={s.pathHero}><code>/readers/<em>42</em></code><div><User size={35} weight="light" /><strong>42</strong></div><span>一段路径 · 一个定位值</span></div></ConceptHero>}>
    <ArticleSection id="template" title="模板里的可替换位置">
      <Legacy slug="path-parameter" names={["question", "definition"]} />
      <p id="path-template" className="vp-citation-target"><strong>路径参数是路由从 URL 路径的可变位置提取出的值。</strong>在 OpenAPI 文档中，<code>{"/readers/{id}"}</code> 用花括号标出模板槽位；实际请求把它替换为 <code>42</code>。id 是参数名，42 是本次的值，花括号不用随请求发送。<Cite id="path-template" /></p>
      <div className={s.urlExample}><code>{"/readers/{id}"}</code><ArrowRight size={22} aria-hidden="true" /><code>/readers/<mark>42</mark></code></div>
      <p>它不是请求中额外增加的一段消息，而是应用对路径的解释。同样的路径字符串，在没有声明相应路由的服务里，可能完全找不到入口。<ConceptTerm slug="endpoint">端点</ConceptTerm>还要结合 HTTP 方法和服务地址来理解。</p>
    </ArticleSection>
    <ArticleSection id="matching" title="请求落在哪条路由">
      <Legacy slug="path-parameter" names={["scene-heading"]} />
      <p>下面模拟按从上到下顺序检查的两条路由。当前读者是 42，资料库只有 42 和 43。先匹配 42，再试 me；交换路由顺序后，观察 me 是否落入了 id 槽位。所有资料和权限开关都是本地教学数据。</p>
      <PathParameterLesson />
      <p id="path-runtime" className="vp-citation-target">这个顺序实验对应 FastAPI 文档描述的处理方式：固定路径 <code>/users/me</code> 需要先于 <code>{"/users/{user_id}"}</code> 声明，否则 me 可能被当作变量值。演示改用了 readers，但仍保留“先匹配到哪条，就交给哪条处理”的关键差异。<Cite id="path-runtime" /></p>
    </ArticleSection>
    <ArticleSection id="checks" title="匹配之后还有检查">
      <div className={s.compare}><div><h3>值是否合法</h3><p id="path-types" className="vp-citation-target">匹配到一个位置，只得到输入值。路由可以进一步要求它是整数；FastAPI 能依据类型声明转换或拒绝输入。本例限制为正整数，所以 abc、me 或解码后包含斜杠的值不会成为读者编号。<Cite id="path-types" /></p></div><div><h3>调用者能否读取</h3><p id="path-access" className="vp-citation-target">编号格式正确，也不代表调用者能查看对应资料。权限检查应针对每次请求和具体对象执行；不能只因为地址里写了 43，就交出 43 号读者的信息。<Cite id="path-access" /></p></div></div>
      <blockquote className={s.quote}>路径提供定位线索，<br />不提供访问许可。</blockquote>
      <p>本例把无权限显示为 403，允许访问后再查不到对象显示为 404，编号格式不符显示为 422。实际服务可以为避免暴露对象存在性而采取不同的错误策略。这里要区分的是匹配、校验、授权和查询四个判断，不能把一次匹配当作全部通过。</p>
    </ArticleSection>
    <ArticleSection id="framework" title="路径规则属于谁">
      <Legacy slug="path-parameter" names={["quiz-heading", "prompt-heading"]} />
      <p id="path-spec" className="vp-citation-target">OpenAPI 3.1.1 对接口文档的匹配约定是具体路径先于模板路径。同一层级的 <code>{"/readers/{id}"}</code> 和 <code>{"/readers/{name}"}</code> 被视为相同的模板，不能靠变量改名把它们变成不同入口。<Cite id="path-spec" /></p>
      <p><strong>文档的模板约定，需要与实际框架的行为一致。</strong>不同路由系统可能采用声明顺序、路径优先级或显式匹配规则。设计固定路径与动态路径时，要检查当前实现，而不是假定所有框架都会自动避免冲突。</p>
      <ArticleAside title="一个参数里能不能含有斜杠"><p id="path-slash" className="vp-citation-target">普通单段参数与跨多段路径是不同需求。FastAPI 提供专门的 path 转换器来捕获余下路径；并不是任意 id 都能随意包含斜杠。涉及编码斜杠时，还应核对代理、服务器和路由器怎样解码。本页只演示单段正整数，不模拟跨层路径。<Cite id="path-slash" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function RequestBodyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={requestBodySources} />;
  return <ConceptArticle slug="request-body" title="请求体" sources={requestBodySources}
    intro={<>报名读书会时，页面要提交书名和名额。地址说明往哪里提交，请求体装下具体内容；接收端再按约定把内容读出来。</>}
    sections={[["payload", "消息里携带的内容"], ["workshop", "从字段到接收结果"], ["formats", "选择内容的表示方式"], ["validation", "能解析与能使用"]]}
    hero={<ConceptHero slug="request-body" label="书名和名额字段编码为JSON请求内容"><div className={s.bodyHero}><div className={s.heroFields}><span>书名　星空手记</span><span>名额　2</span></div><code className={s.heroPayload}>{'{'}<br />　&quot;title&quot;: &quot;星空手记&quot;,<br />　&quot;seats&quot;: 2<br />{'}'}</code></div></ConceptHero>}>
    <ArticleSection id="payload" title="消息里携带的内容">
      <Legacy slug="request-body" names={["question", "definition"]} />
      <p id="body-content" className="vp-citation-target"><strong>请求体是请求携带的内容，不等于 JavaScript 对象，也不只接受 JSON。</strong>在 Fetch API 中，字符串、URLSearchParams、FormData、Blob 等都可以提供 body。发送普通对象前，通常需要按接口约定把它转成合适的表示。<Cite id="body-content" /></p>
      <p id="body-type" className="vp-citation-target"><ConceptTerm slug="http-header">Content-Type</ConceptTerm> 告诉接收端提交的是什么媒体类型。它与内容必须对应：设置 <code>application/json</code> 不会自动把任意文本改写成合法 JSON；给一段 JSON 标上表单类型，也不保证接收端会猜中。<Cite id="body-type" /></p>
    </ArticleSection>
    <ArticleSection id="workshop" title="从字段到接收结果">
      <Legacy slug="request-body" names={["scene-heading"]} />
      <p>输入书名和 1 到 5 个名额，先编码，再交给接收端。JSON 与表单编码承载同一组字段，但文本不同。这里使用真实的序列化和解析操作，接收逻辑在本地模拟；“校验通过”不会真的创建报名。</p>
      <RequestBodyLesson />
      <p>试着把名额改成 0、错标内容类型，或去掉 JSON 最后的花括号。错误发生的位置不同，处理办法也不同。修改输入后，旧的编码和结果会失效；需要重新编码后，才能再次交给接收端。</p>
    </ArticleSection>
    <ArticleSection id="formats" title="选择内容的表示方式">
      <dl className={s.dictionary}><div><dt>JSON</dt><dd>适合表达对象、数组和有类型的值。示例名额是数字 2；实际接口若要求数字，字符串 &quot;2&quot; 不应只靠外观被当作同一类型。更多语法细节见 <ConceptTerm slug="json">JSON</ConceptTerm>。</dd></div><div><dt>表单编码</dt><dd>把字段写成 title=…&amp;seats=2。解析出的字段值是文本，本例接收端还会转换名额并检查范围。使用这种格式应是双方的约定，不是换个 Content-Type 就算转换完成。</dd></div><div><dt>Multipart</dt><dd id="body-multipart" className="vp-citation-target">需要一起提交文件和字段时，可以使用 FormData。交给浏览器构造 multipart 请求时，不要自行固定 Content-Type；浏览器需要生成与内容一致的 boundary，用来分隔各部分。<Cite id="body-multipart" /></dd></div></dl>
      <p id="body-method" className="vp-citation-target">本例采用 POST。浏览器 Fetch API 不允许 GET 请求携带 body；读取条件常放在查询参数中。其他方法是否接受什么内容，需要同时看方法语义与接口定义，不能推断所有请求都要有请求体。<Cite id="body-method" /></p>
    </ArticleSection>
    <ArticleSection id="validation" title="能解析与能使用" className={base.offset}>
      <Legacy slug="request-body" names={["quiz-heading", "prompt-heading"]} />
      <p id="body-media-error" className="vp-citation-target">本例接收端只接受两种声明类型，text/plain 得到 415；这个状态表示服务拒绝不支持的内容格式。接受 JSON 类型之后，语法错误和字段不合要求仍需另外处理。<Cite id="body-media-error" /></p>
      <p id="body-validation" className="vp-citation-target"><strong>解析成功只说明读出了数据，不说明数据能用于业务。</strong>语法正确的 <code>{'{"title":"星空手记","seats":0}'}</code> 仍然不符合本例名额范围。服务端需要检查字段类型、必填项与业务范围；浏览器上的输入限制不能代替服务端校验。<Cite id="body-validation" /></p>
      <p>定位问题时，先核对实际提交的文本和类型，再看解析结果，最后看校验错误。字段缺失不一定是用户没填，也可能是内容采用了接收端没有启用的格式。</p>
      <ArticleAside title="请求内容不是可以反复读取的普通变量"><p id="body-stream" className="vp-citation-target">Fetch 的请求体由流提供，读取后会被消耗。如果需要保留副本，应在消费前克隆请求。演示把内容存成字符串，便于反复检查同一份教学输入；真实 Request 的生命周期不能直接照搬这个行为。<Cite id="body-stream" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
