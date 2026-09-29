import { ArrowRight, User } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { QueryParameterLesson, QueryEncodingLesson, PathParameterLesson, RequestBodyLesson } from "./RequestInputLessons";
import { queryParameterSources, pathParameterSources, requestBodySources } from "@/lib/request-input-sources";
import { queryBooks } from "@/lib/request-input-teaching";
import base from "./EventConcepts.module.css";
import s from "./RequestInputs.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />);
}

export function QueryParameterTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={queryParameterSources} />;
  return <ConceptArticle slug="query-parameter" title="查询参数" sources={queryParameterSources}
    intro={<>你在书店网页上选择“科学”，AI 写的程序把地址改成了 /books?tag=science。问号后面这段是在做什么？它把这次筛选条件留在地址里，让读取地址的程序知道你想看哪些书。</>}
    sections={[["conditions", "地址中的条件"], ["selection", "用查询条件筛选集合"], ["encoding", "特殊字符的编码"], ["contract", "共享地址与接口约定"]]}
    hero={<ConceptHero slug="query-parameter" label="本例中，路径 /books 不变；应用读取 ?tag=science 后，六本书仍在原位，科学类别的《星空手记》《潮汐与月亮》突出显示，其他类别变淡但未删除"><div className={s.queryHero}>
      <div className={s.queryAddress}><code>/books</code><code>?tag=science</code></div>
      <div className={s.queryCatalog}><span>本例 tag 对照分类</span><div className={s.queryCards}>{queryBooks.map(book => <div key={book.id} data-match={book.tag === "science"}><strong>{book.title}</strong><code>{book.tag}</code></div>)}</div></div>
    </div></ConceptHero>}>
    <ArticleSection id="conditions" title="地址中的条件">
      <Legacy slug="query-parameter" names={["question", "definition"]} />
      <p>URL 就是网页或其他资源的地址。这里省略了网站域名，只看 <code>/books?tag=science</code>：/books 是路径，指向书目列表；问号后面的 tag=science 是本次附带的输入。</p>
      <p id="query-component" className="vp-citation-target"><strong>查询参数是在地址的查询部分中，用名称和值表达的输入。</strong>通常写成 <code>键=值</code>：“键”就是参数名，例如 tag；science 是它的值。路径之后用 <code>?</code> 引出查询部分，多项用 <code>&amp;</code> 连接；若后面出现 <code>#</code>，查询部分就到这里结束。# 引出的部分叫片段，常用于定位页面内的位置。地址规范定义了这些部分的位置，却不规定 tag 要筛选什么。<Cite id="query-component" /></p>
      <div className={s.urlExample}><code>/books</code><span>?</span><code><mark>tag=science</mark></code></div>
      <p>本页约定 tag 指定分类：science 是科学，art 是艺术，nature 是自然。写 <code>tag=science</code>，程序就从六本书里选出两本科学书。可以由服务器读这个条件后返回结果，也可以由网页程序读取后筛选已有数据；本页演示采用后一种做法。</p>
      <p>不用查询参数也能筛书：页面可以只在内部记住你选了“科学”。但如果没有把条件写进地址，也没有另外保存，复制链接给别人时，对方未必能看到同样的筛选条件。把条件留在地址里，通常更方便收藏和分享。</p>
    </ArticleSection>
    <ArticleSection id="selection" title="用查询条件筛选集合">
      <Legacy slug="query-parameter" names={["scene-heading"]} />
      <p>默认已经填好科学分类，但还没有筛选。点击“应用查询”会突出两本命中的书，其他书留在原位并变淡，方便对照；它们没有从书店数据中被删除。点击“科学或艺术”等示例只是填写条件，还要再点“应用查询”。编辑输入会撤下旧结果，点“重置筛选”则恢复科学条件，等待重新应用。</p>
      <p id="query-input" className="vp-citation-target">输入框只接收问号后、片段之前的查询字符串，例如 <code>tag=science</code>；不要粘贴完整地址、/books 路径或 # 片段。这里用浏览器自带的 <code>URLSearchParams</code> 读取参数，它负责解析这种键和值的写法，并不负责拆分完整 URL，也不决定怎样筛书。演示不会修改浏览器地址或向服务器发送请求。<Cite id="query-input" /></p>
      <QueryParameterLesson />
      <p id="query-reading" className="vp-citation-target">“科学或艺术”填入的是 <code>tag=science&amp;tag=art</code>，同一个参数名出现了两次。演示里的 <code>get("tag")</code> 表示取第一个 tag 值，得到 science；<code>getAll("tag")</code> 取全部同名值，得到 <code>["science","art"]</code>，方括号表示这是一组值。<strong>逗号不会自动把一个值拆成两个值。</strong><code>tag=science,art</code> 读出来只有一个值 science,art。<Cite id="query-reading" /></p>
      <p>接下来才轮到书店的筛选规则。本例使用全部 tag 值，约定命中任意一个分类就保留，所以科学或艺术共选出四本。逗号写法只是在找名字叫“science,art”的分类，这里没有，结果是 0 本；六本书的原始数据仍然保留。别的接口也可以约定逗号分隔，但要由它的程序另外处理。</p>
      <div className={s.compare}><div><h3>缺失</h3><p><code>/books</code><br />没有 tag。本例不限制分类，六本都命中；点击“全部”后再应用，就能看到这个结果。</p></div><div><h3>空值</h3><p id="query-empty" className="vp-citation-target"><code>/books?tag=</code><br />有 tag，但等号后没有文字，这个值叫空字符串，显示为 <code>""</code>。本例没有空名称的分类，所以命中 0 本。URLSearchParams 也把单独的 <code>tag</code> 读成空字符串；完全没有这个键时，get 返回 <code>null</code>，表示没找到这个值。<Cite id="query-empty" /></p></div></div>
      <p>本例还识别 q，意思是书名里要包含的文字。<code>q=星空</code> 只命中《星空手记》；<code>tag=science&amp;q=星空</code> 则要求既是科学书，书名又包含“星空”。q 不填或留空时，不按书名筛选。参数是否必填、重复后取几个值、几个条件怎样组合，都需要看接收它的程序约定。</p>
    </ArticleSection>
    <ArticleSection id="encoding" title="特殊字符的编码">
      <p>假如搜索词本身是 <code>A+B &amp; C</code>，直接拼成 <code>q=A+B &amp; C</code> 就有歧义：&amp; 会被读成下一项参数的分隔符，+ 也可能不再代表加号。需要把一个值里的特殊字符编码，避免它们被误读成查询串的结构。</p>
      <p id="query-encoding" className="vp-citation-target">下面默认填入“星空 + 艺术 &amp; 自然”。程序把原始文字作为 q 的<strong>单个值</strong>交给 URLSearchParams，再生成查询串，这一步也叫序列化。它按自己的编码规则把空格写成 <code>+</code>，字面加号写成 <code>%2B</code>，&amp; 写成 <code>%26</code>；解析后能还原出原值。不是所有 URL 编码方式都把空格写成 +，你也可能见到 <code>%20</code>。<Cite id="query-encoding" /></p>
      <QueryEncodingLesson />
      <p>把上面的原始搜索词改成 <code>A+B &amp; C</code>，查询串会是 <code>q=A%2BB+%26+C</code>，“解析得到 q”一行仍是原来的文字。这里输入的是一个值；前一个筛选实验输入的却是已经组织好的查询串，两者不同。</p>
      <p id="query-raw" className="vp-citation-target">例如，解析查询串 <code>q=A+B</code> 会得到“A B”，因为其中的 + 被当作空格；要保留加号，查询串应写 <code>q=A%2BB</code>。但在“原始搜索词”框里，应直接填 A+B，不要先改成 A%2BB：这个框会把百分号也作为原文编码：% 变成 %25，所以结果变成 A%252BB。需要搜索字面 # 时同理，应让生成查询串的工具将它编码为 <code>%23</code>，不要把它混同于完整地址里的片段开头。<Cite id="query-raw" /></p>
      <p>看最后解析回来的 q 是否与原值一致。编码解决的是字符边界，不是保密；%26 可以还原为 &amp;，不能因为地址看起来难读就把它当成加密。</p>
    </ArticleSection>
    <ArticleSection id="contract" title="共享地址与接口约定" className={base.offset}>
      <Legacy slug="query-parameter" names={["quiz-heading", "prompt-heading"]} />
      <p>查询参数常用来表达搜索、排序和<ConceptTerm slug="pagination">分页</ConceptTerm>。参数的默认值、取值范围等，都应由接口约定。字符串 <code>page=2</code> 也需要程序转换和校验，不能只因为写了数字就相信它有效。</p>
      <p>分享的是条件，不一定是当时那份结果的副本。后来书店新增了科学书，同一个 tag=science 链接就可能查出更多书。程序还必须真的读取并使用参数；如果接口没有约定 price 的含义，在地址里加上 price=10 也不会自动出现价格筛选。</p>
      <p id="query-secrets" className="vp-citation-target"><strong>不要把密码或长期凭据放进查询参数。</strong>完整地址可能进入历史记录、服务日志或被复制分享；使用 HTTPS 也不会自动清除这些记录。<Cite id="query-secrets" /></p>
      <ArticleAside title="查询条件与路径定位"><p><code>/books/42</code> 常用于定位一本书，<code>/books?tag=science</code> 常用于查找一组书。它们是常见接口设计方式，并非 HTTP 规定“查询只能筛选”。判断输入放在哪里时，先确定资源、操作和接口契约。</p></ArticleAside>
      <p>换成活动列表：<code>/events?city=杭州&amp;page=2</code> 可以按这个网站的约定表示“杭州活动的第二页”。改 city 是换筛选输入，不等于修改某场活动的举办城市。让 AI 接入这样的列表时，应说明参数名、可用值、没填时怎么处理，以及页面怎样把选项写进地址；只说“支持查询参数”，还不足以确定行为。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PathParameterTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={pathParameterSources} />;
  return <ConceptArticle slug="path-parameter" title="路径参数" sources={pathParameterSources}
    intro={<>AI 帮你做读者资料页，给出的地址里有 /readers/42。把 42 换成 43，就改成请求另一位读者的资料。这一段数字怎样交给程序？为什么改对了数字，仍可能看不到资料？路径参数从这里开始起作用。</>}
    sections={[["template", "模板里的可替换位置"], ["matching", "请求落在哪条路由"], ["checks", "匹配之后还有检查"], ["framework", "路由决定路径规则"]]}
    hero={<ConceptHero slug="path-parameter" label="固定路径 /readers/ 后有可替换的 id 槽位；42 和 43 先后占据槽位，最终只捕获到 id 等于 43，尚未读取读者资料"><div className={s.pathHero}>
      <div className={s.pathFrame}>
        <div className={s.pathFixed}><span>固定部分</span><code>/readers/</code></div>
        <div className={s.pathSlot}><span>槽位 {"{id}"}</span><div className={s.pathWindow}><div className={s.pathRoll}><code>42</code><code>43</code></div></div></div>
      </div>
      <div className={s.pathCaptured}><span>匹配后捕获</span><code>id = 43</code></div>
    </div></ConceptHero>}>
    <ArticleSection id="template" title="模板里的可替换位置">
      <Legacy slug="path-parameter" names={["question", "definition"]} />
      <p>URL 就是网页或服务的地址。比如 <code>https://example.com/readers/42</code> 中，<code>/readers/42</code> 是路径。程序用一组规则决定“这种请求交给哪段代码处理”，这组规则叫路由；检查路径是否符合某条规则，就是匹配。</p>
      <p id="path-template" className="vp-citation-target">路由规则可以约定路径里有一个可变的位置。<strong>路径参数，就是这个位置在实际请求里填入、由程序提取的值。</strong>OpenAPI 是描述接口的文档规范，里面用 <code>{"/readers/{id}"}</code> 这样的模板标出可变位置，也就是演示里的“槽位”。<code>/readers/</code> 保持不变，花括号里的 id 是参数名；实际请求写成 <code>/readers/42</code>，程序就能取到这次的值 42。花括号和 id 不用原样发出去。<Cite id="path-template" /></p>
      <div className={s.urlExample}><code>{"/readers/{id}"}</code><ArrowRight size={22} aria-hidden="true" /><code>/readers/<mark>42</mark></code></div>
      <p>这个模板让不同编号共用一条处理规则，不必为 42、43 和以后每位读者分别写一个入口。编号也可以约定放在 <ConceptTerm slug="query-parameter">查询参数</ConceptTerm>里，例如 <code>/readers?id=42</code>；两种写法都能设计成按编号读取，但各要有对应的程序支持，光改地址不会让另一种写法自动生效。</p>
      <p>数字出现在地址里，还不够证明它是路径参数：程序得先定义相应的路由。请求还带有 GET 这样的“方法名”，告诉服务想做什么；它不是地址中的一段文字。本例固定用 GET 请求读取资料。如果程序发出的是提交或删除请求，就要看对应方法的处理规则。完整的 <ConceptTerm slug="endpoint">端点</ConceptTerm>还要结合服务地址和请求方法来判断。</p>
    </ArticleSection>
    <ArticleSection id="matching" title="请求落在哪条路由">
      <Legacy slug="path-parameter" names={["scene-heading"]} />
      <p>下面假定你以 42 号读者林舟的身份登录，资料库另有 43 号读者许青。<code>/readers/me</code> 是专门读取当前登录者的固定路径；<code>{"/readers/{id}"}</code> 按传入的编号读取。匹配时，程序从列表顶部往下逐条检查规则。你可以先选 42 并点击“匹配路径”，再试 me 和交换顺序。数据与权限开关都是本地模拟，不会访问真实读者资料。</p>
      <PathParameterLesson />
      <p><code>/readers/42</code> 不符合固定的 me 路径，却符合带 id 的模板，于是取到 42，再完成后续检查，显示林舟的资料。换成 <code>/readers/me</code> 时，固定路由在前就直接按当前登录者读取，仍得到林舟；这次没有从路径里取出数字编号。</p>
      <p>交换顺序后，带 id 的模板先接住了 me，得到 <code>id = "me"</code>。接下来的规则却要求 id 是正整数，me 不符合，于是显示 422，表示本例的编号校验失败。程序已经选中了这条路由，不会因为校验失败，再退回去尝试下面的固定路由。</p>
      <p id="path-runtime" className="vp-citation-target">这个顺序实验参考 FastAPI——一种编写服务程序的框架——的处理方式。它的官方例子要求先声明固定的 <code>/users/me</code>，再声明 <code>{"/users/{user_id}"}</code>，否则后者也会把 me 当成参数值。本页换成 readers 来演示同样的顺序问题，并另加了编号和权限检查。<Cite id="path-runtime" /></p>
    </ArticleSection>
    <ArticleSection id="checks" title="匹配之后还有检查">
      <div className={s.compare}><div><h3>值是否合法</h3><p id="path-types" className="vp-citation-target">地址是一串文字，取出来的 42 最初也是两个字符。程序要按整数使用它，得先做转换；碰到 abc，就转不成整数。FastAPI 能依据接口声明的类型要求完成转换或拒绝输入。哪些值有效，要看具体接口，不是所有路径参数都必须填数字。<Cite id="path-types" /></p><p>本例要求正整数，而且不能在前面补 0。因此 42 可以继续，abc、042 或落入 id 槽位的 me 都会停在校验这一步。特别长的数字还可能超出程序能精确表示的范围，本例也会拒绝，避免把编号读错；这些都是本例的编号约定。</p></div><div><h3>调用者能否读取</h3><p id="path-access" className="vp-citation-target">编号格式正确，也不代表发起请求的人能查看对应资料。权限检查应针对每次请求和具体对象执行；不能只因为地址里写了 43，就交出 43 号读者的信息。你请求谁的资料，与系统确认你是谁，是两回事。<Cite id="path-access" /></p></div></div>
      <p>默认情况下，请求 43 会显示 403，因为当前身份没有读取其他读者的权限。勾选“允许读取其他读者”后重新匹配，才会显示许青；改成 99 并匹配，即使允许访问，也只得到 404，因为资料库没有这位读者。开关只改变演示中的权限条件，不会修改真实账号的权限。</p>
      <p>这些数字是本例用来区分结果的状态码：422 是编号校验失败，403 是权限不足，404 是没有匹配路径或查询不到资料。实际服务可能为了不暴露对象是否存在，选择不同的错误返回方式。应分别看程序选中了哪条路由、输入是否合规、权限是否允许、资料是否存在，不能凭“地址匹配上了”就认定全部通过。</p>
    </ArticleSection>
    <ArticleSection id="framework" title="路由决定路径规则">
      <Legacy slug="path-parameter" names={["quiz-heading", "prompt-heading"]} />
      <p id="path-spec" className="vp-citation-target">OpenAPI 3.1.1 对接口文档的匹配约定是具体路径先于模板路径。这是在规定怎样理解文档，不会替 FastAPI 调整程序里的声明顺序。同一层级的 <code>{"/readers/{id}"}</code> 和 <code>{"/readers/{name}"}</code> 被视为相同的模板，不能靠变量改名把它们变成不同入口。<Cite id="path-spec" /></p>
      <p><strong>文档的模板约定，需要与实际框架的行为一致。</strong>不同路由系统可能采用声明顺序、路径优先级或显式匹配规则。设计固定路径与动态路径时，要检查当前实现，而不是假定所有框架都会自动避免冲突。</p>
      <ArticleAside title="一个参数里能不能含有斜杠"><p id="path-slash" className="vp-citation-target">普通单段参数与跨多段路径是不同需求。FastAPI 提供专门的 path 转换器来捕获余下路径；并不是任意 id 都能随意包含斜杠。涉及编码斜杠时，还应核对代理、服务器和路由器怎样解码。本页只演示单段正整数，不模拟代理、服务器各层的解码差异。<Cite id="path-slash" /></p></ArticleAside>
      <ArticleAside title="输入编码有误时"><p id="path-decoding" className="vp-citation-target">地址中的一些字符会写成带百分号的编码，读取时再还原。本例使用 decodeURIComponent 解码；单独的 % 缺少后续字符，%FF 则不是它能还原的有效 UTF-8 字符编码，两者都会被拒绝，显示 400“路径编码无效”。此时停在解码这一步，还没开始检查编号是不是正整数。<Cite id="path-decoding" /></p></ArticleAside>
      <p>换成订单页 <code>/orders/87</code>，同样可以用 <code>{"/orders/{orderId}"}</code> 取出订单编号。把 87 改成 88，改变的是想读取的订单，不会把订单改号，也不会让当前账号自动获得查看权限。让 AI 实现这样的页面时，除路径模板外，还要说清编号规则、谁能访问，以及订单不存在时怎么处理。</p>
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
