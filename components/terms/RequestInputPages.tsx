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
    intro={<>你让 AI 做一个读书会报名页，填好书名和名额，却被告知“请求体格式不对”。网页程序需要把填好的字段组织成接口约定的格式，再随请求提交。请求体就是携带这些内容的部分。</>}
    sections={[["payload", "消息里携带的内容"], ["workshop", "从字段到接收结果"], ["formats", "选择内容的表示方式"], ["validation", "能解析与能使用"]]}
    hero={<ConceptHero slug="request-body" label="POST /bookings 的地址与 Content-Type 类型说明保持在上方；请求体区域沿折线展开，显示已经编码好的书名和名额 JSON 示例，不表示发送或保存成功"><div className={s.bodyHero}>
      <div className={s.bodyMessage}>
        <code className={s.bodyAddress}>POST /bookings</code>
        <div className={s.bodyContentType}><span>Content-Type</span><code>application/json</code></div>
        <div className={s.bodyFold}><div className={s.bodyContents}><span>请求体 · JSON 示例</span><code>{'{'}<br />　&quot;title&quot;: &quot;星空手记&quot;,<br />　&quot;seats&quot;: 2<br />{'}'}</code></div></div>
      </div>
    </div></ConceptHero>}>
    <ArticleSection id="payload" title="消息里携带的内容">
      <Legacy slug="request-body" names={["question", "definition"]} />
      <p>网页程序发出请求，服务器接收并处理它。这里向 <code>/bookings</code> 这个报名入口提交内容，POST 表示请求方法，也就是这次要执行哪类操作。书名和名额放在请求体里，不是拼在这个地址后面。</p>
      <p id="body-content" className="vp-citation-target"><strong>请求体是请求中承载具体内容的部分，例如提交的报名信息或上传的文件。</strong>英文是 Request Body，代码里常写成 body。浏览器的 Fetch API 是网页程序发请求的一种工具：可以给它文本，也可以给它用于组织表单、文件等内容的对象。请求体没有规定所有内容都必须写成 JSON。<Cite id="body-content" /></p>
      <p>以 JSON 为例，网页程序先整理出书名，把输入框里的名额转成数字，再把这组数据写成 <code>{'{"title":"星空手记","seats":2}'}</code> 这样的文本。其中 title 是书名字段，seats 是名额字段。把程序里的数据转换成可发送的表示，叫编码或序列化；接收端按同一套规则从文本读回数据，叫解析。JSON 是其中一种写法，更多语法见 <ConceptTerm slug="json">JSON</ConceptTerm>。</p>
      <p id="body-type" className="vp-citation-target"><ConceptTerm slug="http-header">Content-Type</ConceptTerm> 是请求头中的类型说明，告诉接收端请求体采用什么格式，这种格式名称也叫媒体类型。例如 <code>application/json</code> 表示 JSON。写上这个名称不会替你生成 JSON，也不会补上缺失的花括号。接收端是否支持这个格式、内容是否真的符合格式，都要另外判断。<Cite id="body-type" /></p>
      <p>少量字段也可以按接口约定放在地址的查询参数里；请求体不是提交信息的唯一位置。把信息放进请求体，就能让地址与提交的内容分开，适合携带报名数据、较复杂的结构或文件。采用哪种位置、哪些字段必填，发送方和接收方必须事先约定；把字段换个位置，并不会让已有接口自动读到。</p>
    </ArticleSection>
    <ArticleSection id="workshop" title="从字段到接收结果">
      <Legacy slug="request-body" names={["scene-heading"]} />
      <p>默认书名是《星空手记》，名额是 2。先点“编码内容”，查看要提交的文本和 Content-Type；再点“交给接收端”，由接收逻辑读取并检查。这里只在浏览器里运行教学用的编码和解析，不发送网络请求，也不会真的占用读书会名额。</p>
      <RequestBodyLesson />
      <p>默认选择 JSON，编码后的文本包含 title 和 seats 两个字段。接收端按 JSON 规则读出书名和数字 2，再检查书名是否非空、名额是否为 1 到 5 之间的整数。通过后显示 200“解析与校验通过”，以及“星空手记 · 2 个名额”。这个结果只说明教学检查通过，没有保存报名记录。</p>
      <p>把“内容编码”换成“URL 编码表单”，重新编码后，正文变成 <code>title=…&amp;seats=2</code> 这样的键值文本；中文书名会写成带百分号的编码。Content-Type 同时换成 <code>application/x-www-form-urlencoded</code>。接收端按表单规则读出字段，再把名额文字转成数字，仍可得到相同的报名信息。这里的“URL 编码”是格式名称：这些字符仍放在请求体里，没有跑到地址栏。</p>
      <p>修改字段、格式或错误开关，会撤下旧的编码和结果，“交给接收端”暂时不可用。需要重新编码才能继续。点击“重置内容”则恢复默认字段和 JSON 格式，等待你再次编码。</p>
    </ArticleSection>
    <ArticleSection id="formats" title="选择内容的表示方式">
      <dl className={s.dictionary}><div><dt>JSON</dt><dd>适合表达一组命名字段、列表和不同类型的值。示例里 <code>"seats":2</code> 表示数字；写成 <code>"seats":"2"</code>，引号里的 2 就是文字。本例的 JSON 接收逻辑要求数字，不会因为看起来一样就接受后者。</dd></div><div><dt>表单编码</dt><dd>适合把字段写成名称和值的组合，解析出来的值是文本。本例知道 seats 应是数字，才另外转换并检查范围。它和 JSON 能表达相同的报名信息，但原始文本与解析方法不同。</dd></div><div><dt>Multipart</dt><dd id="body-multipart" className="vp-citation-target">需要一起提交文件和字段时，可以使用 FormData。它是浏览器提供的收集工具，网页程序把字段和文件加入其中，浏览器再把它们组织成一个分成多部分的请求体。浏览器会生成一串分隔标记，叫 boundary：正文里用它分开各部分，Content-Type 里也写上它，接收端据此知道在哪里分开读取。使用 FormData 发送时，应让浏览器生成这份类型说明；自己只写 <code>multipart/form-data</code> 会缺少 boundary 信息，手动写了不一致的标记也无法正确对应正文。<Cite id="body-multipart" /></dd></div></dl>
      <p id="body-method" className="vp-citation-target">本例用 POST 提交内容，但并非所有请求都需要请求体。浏览器 Fetch API 不允许 GET 请求携带 body，读取时的筛选条件常放在查询参数中。其他方法是否需要什么内容，要同时看请求方法和接口约定，不能因为有了 body 选项就随意添加。<Cite id="body-method" /></p>
      <ArticleAside title="在代码里提供请求体"><p id="body-object" className="vp-citation-target">使用 Fetch 发送 JSON 时，直接给 body 传入普通 JavaScript 对象，不会自动按 JSON 发送；需要先用 JSON.stringify 把它转成 JSON 文本。URLSearchParams 可以帮助组织表单编码，FormData 可以组织多部分内容，Blob 可以提供一块文件或其他二进制数据。工具不同，但最后都要与接收端的要求相符。<Cite id="body-object" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="validation" title="能解析与能使用" className={base.offset}>
      <Legacy slug="request-body" names={["quiz-heading", "prompt-heading"]} />
      <p id="body-media-error" className="vp-citation-target">保持书名和名额不变，勾选“把类型错标为 text/plain”后重新编码、接收。本例只接受 JSON 和 URL 编码表单这两种声明类型，因此会得到 415“接收端不支持这种内容类型”。415 表示请求内容的格式不受支持；实际服务也可能在检查正文时发现格式不受支持，不能只凭这个状态码断定是类型名称写错。<Cite id="body-media-error" /></p>
      <p>取消错标，选择 JSON，再勾选“去掉 JSON 末尾花括号”。重新编码后，即使类型说明是 application/json，文本也因缺少闭合的花括号而无法按 JSON 解析；接收端显示 400“JSON 语法错误，尚未校验字段”。此时还没轮到检查名额。</p>
      <p id="body-validation" className="vp-citation-target">再取消破坏 JSON 的选项，把名额改成 0。语法完整的 <code>{'{"title":"星空手记","seats":0}'}</code> 能读出字段，却不符合本例的名额范围，所以显示 422。<strong>解析成功只说明读出了数据，不说明数据能用于业务。</strong>服务端仍需检查必填项、字段类型与业务范围；网页输入框的限制不能代替它，因为请求可能由别的程序直接发来。<Cite id="body-validation" /></p>
      <p>这里先检查声明类型，再解析，最后校验字段。因此同时勾选错标类型和破坏 JSON 时，会先看到 415。400、415、422 是本例用来区分失败环节的返回结果，其他接口可能采用不同规则。定位问题时，先核对实际提交的文本和类型，再看能否解析，最后检查字段。</p>
      <p>编码也不是加密：内容放在请求体里，不代表变成了秘密；请求体仍可由处理请求的程序读取。</p>
      <ArticleAside title="请求内容不是可以反复读取的普通变量"><p id="body-stream" className="vp-citation-target">Fetch 的请求体由流提供，读取后会被消耗。如果需要保留副本，应在消费前克隆请求。演示把内容存成字符串，便于反复检查同一份教学输入；真实 Request 的生命周期不能直接照搬这个行为。<Cite id="body-stream" /></p></ArticleAside>
      <p>换成一个提交头像和昵称的资料页：地址可以指向资料更新入口，请求体携带实际文件和昵称。如果接口约定使用 FormData，程序就要把文件和昵称一起加入其中，而不是只把图片文件名塞进 JSON 并声称上传完成。让 AI 接入接口时，应明确字段名称、所需格式和校验要求；“把表单发过去”还不足以说明这些约定。</p>
    </ArticleSection>
  </ConceptArticle>;
}
