import { BookOpen, FileText, Hash, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { RequestLesson, ResponseLesson, MethodLesson, StatusLesson, HeaderLesson } from "./HttpConceptLessons";
import { requestSources, responseSources, methodSources, statusSources, headerSources } from "@/lib/http-concept-sources";
import base from "./EventConcepts.module.css";
import s from "./HttpConcepts.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />);
}

export function RequestTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={requestSources} />;
  return <ConceptArticle slug="request" title="请求" sources={requestSources}
    intro={<>在书店里搜索一本书和新增一本书，都可能访问 /books。服务器需要知道你想做什么、找哪一项、带了哪些内容。请求把这些信息组合成一条可以处理的消息。</>}
    sections={[["message", "从按钮到一条消息"], ["compose", "组装一次请求"], ["positions", "参数放在哪里"], ["boundary", "构造、发送与完成"]]}
    hero={<ConceptHero slug="request" label="方法、目标和内容组合成一条请求"><div className={s.requestHero}><div><PaperPlaneTilt size={20} /><strong>POST /books</strong></div><div><Hash size={20} /><code>application/json</code></div><div><FileText size={20} /><code>{'{"title":"海边的书店"}'}</code></div></div></ConceptHero>}>
    <ArticleSection id="message" title="从按钮到一条消息">
      <Legacy slug="request" names={["question", "definition"]} />
      <p id="request-message" className="vp-citation-target"><strong>HTTP 请求是客户端发给服务器的消息。</strong><ConceptTerm slug="http-method">方法</ConceptTerm>表达操作语义，目标地址确定资源，<ConceptTerm slug="http-header">请求头</ConceptTerm>补充处理信息，必要时再用请求体携带数据。它们共同说明一次操作，URL 只是其中一部分。<Cite id="request-message" /></p>
      <p>用户点击“搜索”，页面把书名放进地址；点击“新增”，页面把书名写进提交内容。服务器并不知道按钮长什么样，只能按收到的消息和接口约定处理。定位问题时，应检查页面最后生成了什么，而不只看按钮文案。</p>
    </ArticleSection>
    <ArticleSection id="compose" title="组装一次请求">
      <Legacy slug="request" names={["scene-heading"]} />
      <p>先用 GET 搜索书名，再切到 POST 提交书名。这里用浏览器原生对象检查组装结果，example.com 只是示例地址，不会发出网络请求。试试让 GET 也附加请求体，看看浏览器会接受什么。</p>
      <RequestLesson />
      <p>GET 的书名进入 q 参数，空格和中文由 URL 工具编码；POST 的书名放进 JSON 文本。勾选请求体只是改变消息的一部分，不会自动修改方法，也不会替服务器保存一本书。</p>
      <p id="request-object" className="vp-citation-target"><code>new Request(url, options)</code> 构造的是请求对象。程序之后还可以将它交给 fetch。把这两步分开，可以先检查 method、url、headers 和内容，再决定是否发送。<Cite id="request-object" /></p>
    </ArticleSection>
    <ArticleSection id="positions" title="参数放在哪里">
      <div className={s.paired}><div><h3>地址里的条件</h3><p id="request-target" className="vp-citation-target"><code>/books?q=海边</code> 用查询参数携带筛选条件。路径标识资源，查询部分进一步限定目标；具体参数叫什么，由这个接口约定。<Cite id="request-target" /></p></div><div><h3>消息里的内容</h3><p id="request-body-rule" className="vp-citation-target">请求体可以装 JSON、表单或文件，并不只接受对象。在 Fetch API 中，GET、HEAD 不允许携带 body；传入 JSON 时，需要先把对象序列化成文本。<Cite id="request-body-rule" /></p></div></div>
      <p><strong>把同一个值换个位置，不一定还是同一个请求。</strong>如果接口只从 JSON 的 title 读取书名，把 title 改放在 URL 里，服务器未必会去找。以接口文档和实际接收代码为准，不依赖“后端应该能猜到”。</p>
    </ArticleSection>
    <ArticleSection id="boundary" title="构造、发送与完成" className={base.offset}>
      <Legacy slug="request" names={["quiz-heading", "prompt-heading"]} />
      <blockquote className={s.quote}>请求说明想做什么。<br />结果要从响应里找证据。</blockquote>
      <p>对象构造成功，只证明浏览器接受了这份配置。网络是否连通、服务是否接受参数、写入是否成功，都发生在后续。收到 <ConceptTerm slug="response">响应</ConceptTerm> 后，还要检查状态与内容，最后才更新页面。</p>
      <ArticleAside title="开发者工具里看到的请求"><p id="request-wire" className="vp-citation-target">Network 面板把请求整理成易读字段。HTTP/1.1 的文本行适合解释结构；HTTP/2 等版本在线路上的表示不同，但方法、目标、字段和内容的语义仍然适用。页面里的字段列表不是完整网络抓包。<Cite id="request-wire" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function ResponseTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={responseSources} />;
  return <ConceptArticle slug="response" title="响应" sources={responseSources}
    intro={<>保存书签后，服务器可能返回新书签，也可能指出书名缺失。响应带回这次请求的结果；页面再根据结果决定显示什么。</>}
    sections={[["receipt", "读懂一份返回结果"], ["project", "把响应用到页面"], ["empty", "没有内容也有结果"], ["handling", "错误留在哪一层"]]}
    hero={<ConceptHero slug="response" label="201响应提供新资源，页面将它显示为书签"><div className={s.responseHero}><div className={s.heroMessage}><strong>201</strong><code>/bookmarks/42</code></div><div className={s.heroView}><BookOpen size={27} /><span>海边的书店</span></div></div></ConceptHero>}>
    <ArticleSection id="receipt" title="读懂一份返回结果">
      <Legacy slug="response" names={["question", "definition"]} />
      <p id="response-parts" className="vp-citation-target"><strong>响应是服务器针对请求返回的消息，响应体只是其中的内容。</strong><ConceptTerm slug="status-code">状态码</ConceptTerm>概括处理结果，响应头补充类型和位置等信息，响应体再提供资源数据或错误说明。只复制一段 JSON，可能漏掉决定处理方式的部分。<Cite id="response-parts" /></p>
      <p id="response-created" className="vp-citation-target">例如创建书签成功，201 表示资源已经创建；Location 可以指出新资源的地址，响应体可以带回编号和书名。客户端不必从自己提交的草稿猜编号，而可以使用服务器返回的结果。<Cite id="response-created" /></p>
    </ArticleSection>
    <ArticleSection id="project" title="把响应用到页面">
      <Legacy slug="response" names={["scene-heading"]} />
      <p id="response-native" className="vp-citation-target">左边是一份教学响应，右边是尚未处理它的页面。选择一次操作，再把响应应用到界面。演示在本地构造原生 Response，并按状态和内容处理；不会访问真实书签服务。<Cite id="response-native" /></p>
      <ResponseLesson />
      <p>消息不会自己变成界面。创建时把新资源显示出来，删除时移除书签，输入有误时留下纠正入口，都是客户端程序作出的决定。<strong>收到响应与正确处理响应，是两件需要分别完成的事。</strong></p>
    </ArticleSection>
    <ArticleSection id="empty" title="没有内容也有结果" className={base.offset}>
      <p id="response-empty" className="vp-citation-target">204 表示请求已成功处理，而且没有响应内容。删除完成或保存后不需要回传数据时，服务可以采用它。此时客户端应直接处理成功状态，而不是继续把空内容当 JSON 解析。<Cite id="response-empty" /></p>
      <blockquote className={s.quote}>204 没有响应体，<br />不等于没有收到响应。</blockquote>
      <p>反过来，一大段返回内容也不必然代表成功。代理可能返回 HTML 错误页，业务接口可能返回字段校验信息。先确认状态和 Content-Type，再决定怎样读取，会比一律调用 JSON.parse 更可靠。</p>
    </ArticleSection>
    <ArticleSection id="handling" title="错误留在哪一层">
      <Legacy slug="response" names={["quiz-heading", "prompt-heading"]} />
      <p id="response-error" className="vp-citation-target">422 表示内容类型和语法能够理解，但其中的指令无法处理。示例里缺少书名，因此页面保留错误，不加入书签。原样再提交一次，通常仍会遇到同一个问题；应先修改对应输入。<Cite id="response-error" /></p>
      <p>排查时先看有没有拿到响应，再看 HTTP 状态，再看内容是否符合约定，最后看页面是否正确更新。这能区分网络失败、服务拒绝、解析失败和渲染错误，避免所有问题最后都变成一句“接口坏了”。</p>
      <ArticleAside title="收到旧请求的响应"><p>先搜索“海边”，紧接着搜索“山间”，较早的请求可能更晚返回。如果页面无条件采用最后到达的响应，就会显示旧搜索结果。客户端可以取消旧请求，或检查响应是否仍属于当前搜索；每份响应都需要与发起它的操作对应。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function HttpMethodTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={methodSources} />;
  return <ConceptArticle slug="http-method" title="HTTP 方法" sources={methodSources}
    intro={<>同样是 /notes/42，GET 是读取，PUT 是用提交的内容建立或替换，DELETE 是移除。地址确定对象，方法表达这次请求对它做什么。</>}
    sections={[["resource", "方法与目标一起读"], ["repeat", "让同一条请求再执行一次"], ["properties", "安全与幂等"], ["others", "其他方法与实现边界"]]}
    hero={<ConceptHero slug="http-method" label="POST重复创建产生不同编号的资源"><div className={s.methodHero}><code>POST /notes</code>{[42,43,44].map(id => <div key={id}><FileText size={26} /><span>{id}</span></div>)}<span>重复创建 · 不同资源</span></div></ConceptHero>}>
    <ArticleSection id="resource" title="方法与目标一起读">
      <Legacy slug="http-method" names={["question", "definition"]} />
      <p id="method-purpose" className="vp-citation-target"><strong>方法声明请求的语义，不是给 URL 加一个随意的标签。</strong>GET 取得资源的表示，PUT 以请求内容建立或替换目标资源，POST 把内容交给目标处理，DELETE 请求移除目标。POST 常被用来创建，但也可以提交一次处理任务。<Cite id="method-purpose" /></p>
      <p>便笺接口可以用 POST /notes 创建新便笺，让服务分配编号；用 PUT /notes/42 设置指定便笺的内容。两者都可能“保存成功”，但目标和重复调用后的效果不同。</p>
    </ArticleSection>
    <ArticleSection id="repeat" title="让同一条请求再执行一次">
      <Legacy slug="http-method" names={["scene-heading"]} />
      <p>这是一组可重置的本地便笺。先连续执行两次 PUT，再试两次 POST。切换方法时保留资源，方便继续读取或删除；“恢复初始资源”才把集合恢复到一条草稿。这里的 POST 约定为每次新增，最多保留七条用于观察。</p>
      <MethodLesson />
      <p id="method-delete" className="vp-citation-target">删除 42 后再删除一次，示例第二次返回 404，集合里依然没有 42。<strong>幂等比较的是预期的资源效果，不要求每次返回相同的状态码或内容。</strong><Cite id="method-delete" /></p>
    </ArticleSection>
    <ArticleSection id="properties" title="安全与幂等">
      <div className={s.paired}><div><h3>是否请求改变状态</h3><p id="method-safe" className="vp-citation-target">安全方法的语义是只读，客户端没有请求改变服务端状态。GET 属于这一类；服务器记录访问日志，并不会让 GET 因此变成不安全方法。不能用 GET 链接来执行删除。<Cite id="method-safe" /></p></div><div><h3>重复是否叠加效果</h3><p id="method-repeat" className="vp-citation-target">幂等意味着多次相同请求与一次请求的预期效果相同。PUT、DELETE 及安全方法具有这一语义；POST 和 PATCH 不保证幂等。PUT 会写数据，所以幂等不等于只读。<Cite id="method-repeat" /></p></div></div>
      <p id="method-retry" className="vp-citation-target">当连接中断、没有读到响应时，客户端不一定知道第一次是否执行过。幂等语义帮助判断能否重复请求；对非幂等操作，不应未经判断自动重试。是否有去重机制、是否能确认未执行，要结合接口约定。<Cite id="method-retry" /></p>
    </ArticleSection>
    <ArticleSection id="others" title="其他方法与实现边界">
      <Legacy slug="http-method" names={["quiz-heading", "prompt-heading"]} />
      <div id="method-others" className="vp-citation-target"><dl className={s.definitions}><dt>PATCH</dt><dd>应用局部修改；补丁内容由具体接口约定。</dd><dt>HEAD</dt><dd>取得类似 GET 的响应元信息，但不返回响应体。</dd><dt>OPTIONS</dt><dd>了解目标支持的通信选项。</dd></dl><Cite id="method-others" /></div>
      <p id="method-implementation" className="vp-citation-target">这些语义需要服务器正确实现。把一个每次加一的操作命名为 PUT，并不能自动获得幂等性；接口的实际行为仍要检查。方法也不能代替身份、权限和输入校验。<Cite id="method-implementation" /></p>
      <p>下一次设计接口时，把目标资源、请求内容、第一次结果和原样重复后的结果一起写下来。比只列一排 GET、POST、DELETE，更容易发现调用方可能误用的地方。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function StatusCodeTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={statusSources} />;
  return <ConceptArticle slug="status-code" title="状态码" sources={statusSources}
    intro={<>导出任务返回 202，界面却立刻显示“下载完成”，用户找不到文件。数字本身没错，问题出在把“已接受”理解成了“所有工作都结束”。</>}
    sections={[["classes", "先读类别，再读具体含义"], ["export", "一次导出，两次请求"], ["errors", "错误之后的动作"], ["business", "HTTP 状态与业务状态"]]}
    hero={<ConceptHero slug="status-code" label="202表示已接受，进度停在未完成状态"><div className={s.statusHero}><strong>202</strong><span>Accepted · 等待处理</span><i aria-hidden="true" /></div></ConceptHero>}>
    <ArticleSection id="classes" title="先读类别，再读具体含义">
      <Legacy slug="status-code" names={["question", "definition"]} />
      <p id="status-classes" className="vp-citation-target"><strong>HTTP 状态码是响应里的三位数字，表达这次请求的处理结果。</strong>第一位给出类别，具体代码再细分含义。它让浏览器、代理和应用有共同的判断依据，不必从错误文案猜测成功或失败。<Cite id="status-classes" /></p>
      <div className={s.matrix}>{[["1xx","信息性响应"],["2xx","成功"],["3xx","重定向类"],["4xx","客户端错误"],["5xx","服务端错误"]].map(([code,label]) => <div key={code}><strong>{code}</strong><span>{label}</span></div>)}</div>
      <p>分类只是入口。201 是已创建，204 是成功且没有内容，202 则是接受了处理请求。不能只看“2 开头”就把三个分支都显示成同一个完成页。</p>
    </ArticleSection>
    <ArticleSection id="export" title="一次导出，两次请求">
      <Legacy slug="status-code" names={["scene-heading"]} />
      <p id="status-accepted" className="vp-citation-target">202 表示请求已被接受，处理可能尚未开始，也可能在后面失败。若服务返回任务地址，客户端可以再查询进展。第一次提交的响应已经结束，后续查询是另一条请求。<Cite id="status-accepted" /></p>
      <p>本地示例接受 1 到 5 的整数。提交后先查询一次，再手动让模拟后台完成，最后重新查询。完成按钮控制教学任务，不代表真实耗时；下载的是一份固定书目示例。</p>
      <StatusLesson />
      <p>第一次查询得到 200 和 pending，说明“查询任务”成功了，导出却仍未完成。后台生成文件后，页面也不会自动知道；它要通过下一次查询拿到 done，才展示文件入口。</p>
    </ArticleSection>
    <ArticleSection id="errors" title="错误之后的动作">
      <div className={s.paired}><div><h3>先修改输入</h3><p id="status-correct" className="vp-citation-target">把数量设为 0，示例返回 422：输入的语法可以解析，内容却不能被处理。此时需要改数量，原样重复提交没有解决原因。<Cite id="status-correct" /></p></div><div><h3>先处理不可用</h3><p id="status-unavailable" className="vp-citation-target">关闭“服务可用”，示例返回 503。它表示服务暂时无法处理请求，可能是维护或过载；Retry-After 可提示建议等待时间，但不保证届时一定恢复。是否重试还要看操作本身。<Cite id="status-unavailable" /></p></div></div>
      <p id="status-other" className="vp-citation-target">其他错误也不能一概重试：401 涉及认证，403 表示拒绝执行，404 表示未找到目标资源，409 指向与当前资源状态的冲突。状态码把排查范围缩小，具体问题仍要结合响应内容。<Cite id="status-other" /></p>
    </ArticleSection>
    <ArticleSection id="business" title="HTTP 状态与业务状态" className={base.offset}>
      <Legacy slug="status-code" names={["quiz-heading", "prompt-heading"]} />
      <blockquote className={s.quote}>先明确：<br />成功的是哪一条请求？</blockquote>
      <p>查询一个失败的导出任务，可以成功返回 200 和 failed，因为任务查询本身正常完成。如果提交接口明明拒绝了输入，却一直返回 200，只在 JSON 里写自定义错误码，调用方和通用监控就更难区分结果。</p>
      <p>项目可能有既定的业务码约定，客户端需要遵守；设计新接口时，则应让 HTTP 状态表达对应请求的结果，再让响应体补充字段位置、业务原因和恢复办法。不要用一个层面的“成功”覆盖另一个层面的失败。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function HttpHeaderTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={headerSources} />;
  return <ConceptArticle slug="http-header" title="请求头" sources={headerSources}
    intro={<>同样请求 /books/42，有的客户端想要 JSON，有的只需要纯文本。请求头可以把这些偏好告诉服务器，地址和书的内容都不必因此改变。</>}
    sections={[["fields", "内容之外的信息"], ["negotiate", "同一本书，两种表示"], ["directions", "Accept 与 Content-Type"], ["limits", "字段由谁控制"]]}
    hero={<ConceptHero slug="http-header" label="Accept选择JSON表示，纯文本表示退后"><div className={s.headerHero}><code>Accept: application/json</code><div><FileText size={31} /><strong>JSON</strong></div><div><FileText size={31} /><strong>TXT</strong></div></div></ConceptHero>}>
    <ArticleSection id="fields" title="内容之外的信息">
      <Legacy slug="http-header" names={["question", "definition"]} />
      <p id="header-fields" className="vp-citation-target"><strong>请求头是随请求发送的字段，用来补充内容、客户端和处理条件等信息。</strong>HTTP 头也可以出现在响应中。字段名不区分大小写，但字段值如何解释，要看每个字段的定义；不能把所有值都转成小写。<Cite id="header-fields" /></p>
      <p>“书名是海边的书店”属于业务内容；“希望收到 JSON”则描述客户端能接收什么。把两者分开，服务器才能先决定处理规则，再读取或生成对应内容。</p>
    </ArticleSection>
    <ArticleSection id="negotiate" title="同一本书，两种表示">
      <Legacy slug="http-header" names={["scene-heading"]} />
      <p id="header-negotiation" className="vp-citation-target">内容协商允许服务器参考请求头选择资源的表示。这里模拟的服务器只提供 JSON 和纯文本，并约定在无法满足偏好时返回 406；它不是完整协商算法，真实服务的选择与回退策略需看实现。<Cite id="header-negotiation" /></p>
      <HeaderLesson />
      <p>两种表示说的是同一本书，但接收方要用不同方式读取。选 XML 时，服务器不会因为看见一个类型名字就自动转换数据；本例没有这种表示，因此明确拒绝。</p>
    </ArticleSection>
    <ArticleSection id="directions" title="Accept 与 Content-Type">
      <div className={s.paired}><div><h3>希望收到什么</h3><p id="header-accept" className="vp-citation-target">请求中的 <code>Accept</code> 列出客户端能够理解的媒体类型。它可以包含多种候选及权重，不要求只填一种。本例为了看清选择过程，只使用一个精确类型。<Cite id="header-accept" /></p></div><div><h3>这份内容是什么</h3><p id="header-content" className="vp-citation-target"><code>Content-Type</code> 描述随消息携带的内容类型。请求体是 JSON 时可声明 application/json；响应也用它说明实际返回的类型。这个字段不会把一段普通文本自动变成 JSON。<Cite id="header-content" /></p></div></div>
      <p id="header-vary" className="vp-citation-target">当服务器按 Accept 选择表示，响应可以用 <code>Vary: Accept</code> 告诉缓存：判断能否复用这份响应，还要考虑原请求的 Accept。否则，相同 URL 的纯文本和 JSON 可能被误当成可以互换的结果。<Cite id="header-vary" /></p>
    </ArticleSection>
    <ArticleSection id="limits" title="字段由谁控制" className={base.offset}>
      <Legacy slug="http-header" names={["quiz-heading", "prompt-heading"]} />
      <p id="header-browser" className="vp-citation-target">浏览器会保留部分请求头的控制权。例如 Host、Content-Length 和 Cookie，不能像普通自定义字段一样任意用脚本设置。不要把命令行工具里能够指定的所有字段，直接照搬到浏览器 fetch。<Cite id="header-browser" /></p>
      <p>请求头还可能包含身份凭证。排查时记录字段是否存在、格式是否正确，往往已经足够；共享截图或日志前，应移除真实令牌。把凭证从请求体移进请求头，也不代表请求已经获得权限。</p>
      <ArticleAside title="看见字段，不代表业务使用了它"><p>自定义一个 X-Book-Mode 字段，只是发送了名字和值。如果服务端、代理和缓存都没有处理它，它就不会自动改变业务逻辑。先确认谁读取字段、按什么规则执行，再判断这个字段是否必要。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
