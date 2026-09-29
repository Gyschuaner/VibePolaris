import { BookOpen, FileText } from "@phosphor-icons/react/dist/ssr";
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
    intro={<>你在网上书店点了“搜索”，页面却没有显示想找的书。AI 让你“检查发出去的请求”。它要看的，是浏览器向书店服务发送的那条消息：想做什么、去哪个地址、带了什么内容。</>}
    sections={[["message", "从按钮到一条消息"], ["compose", "组装一次请求"], ["positions", "参数放在哪里"], ["boundary", "构造、发送与完成"]]}
    hero={<ConceptHero slug="request" label="一条 HTTP/1.1 请求的结构示意：首行写 POST 和 /books，请求头写 Content-Type，空行后是书名 JSON 正文；尚未显示发送或处理结果"><div className={s.requestHero}><div className={s.requestPaper}>
      <span>HTTP/1.1 · 结构示意</span>
      <div className={s.requestStart}><code><strong>POST</strong> /books HTTP/1.1</code></div>
      <div className={s.requestHeader}><code>Content-Type: application/json</code></div>
      <div className={s.requestGap} />
      <div className={s.requestBody}><code>{'{"title":"海边的书店"}'}</code></div>
    </div></div></ConceptHero>}>
    <ArticleSection id="message" title="从按钮到一条消息">
      <Legacy slug="request" names={["question", "definition"]} />
      <p id="request-message" className="vp-citation-target"><strong>HTTP 请求是客户端发给服务器的消息。</strong>在这个例子里，浏览器是发消息的客户端；接收消息、查询或保存书目的程序是服务器。HTTP 是双方收发这类消息时遵守的一套规则。网站开发者提前写好程序，把你在页面上的操作转换成请求，你不用自己填写每一行。<Cite id="request-message" /></p>
      <p id="request-method" className="vp-citation-target">一条请求先要说明去哪里、做什么。目标地址（URL）指向要访问的内容，例如书目列表；<ConceptTerm slug="http-method">方法</ConceptTerm>说明操作的种类。GET 用于读取，POST 把内容交给目标服务处理。本例约定用 GET 搜索书目、用 POST 新增书目，但 POST 也可以用于提交表单等操作，不是看到 POST 就一定在新增。<Cite id="request-method" /></p>
      <p id="request-format" className="vp-citation-target">消息还可以带上<ConceptTerm slug="http-header">请求头</ConceptTerm>和请求体。请求头补充处理所需的信息，比如 <code>Content-Type: application/json</code> 告诉接收方正文采用 JSON 格式；请求体则放具体内容，例如 <code>{'{"title":"海边的书店"}'}</code>，其中 title 是这个接口约定的书名字段。地址、方法、头和体一起说明这次请求，URL 只是其中一部分。<Cite id="request-format" /></p>
      <p>服务器看不到你点的按钮，只能按消息和接口约定处理。“接口约定”就是服务说明自己接受什么方法、从哪里读取哪些参数。因此排查搜索问题时，要看程序实际发了什么：按钮即使写着“搜索”，程序也可能漏掉书名，或把它放在服务不会读取的位置。</p>
    </ArticleSection>
    <ArticleSection id="compose" title="组装一次请求">
      <Legacy slug="request" names={["scene-heading"]} />
      <p>下面用浏览器自带的 Request 对象组装消息。先保留 GET，输入书名并点“构造 Request”；再切到 POST，对比同一个书名出现在什么位置。example.com 只是示例地址，这个实验不会发出网络请求。</p>
      <RequestLesson />
      <p>GET 结果中，书名跟在地址的 <code>?q=</code> 后面；中文会自动编码成带 % 的字符，这仍然表示输入的书名。切到 POST 时，演示会帮你勾上“附加 JSON 请求体”，于是地址不再带 q，书名出现在 body 一行。这是本例的配置方式：你可以取消勾选，POST 仍然是 POST，只是不再携带书名。</p>
      <p id="request-object" className="vp-citation-target">代码里的 <code>new Request(url, options)</code> 把地址和选项组装成请求对象，供程序检查 method（方法）、url（地址）等信息。程序之后调用 <code>fetch(request)</code>，才进入发送和取得响应的过程。也可以直接写 <code>fetch(url, options)</code>，不单独创建 Request 对象；这仍然会发起请求。<Cite id="request-object" /></p>
      <ArticleAside title="先看正文，再发送"><p id="request-inspect" className="vp-citation-target">读取方法、地址和请求头不会读走正文，但 <code>request.text()</code> 会消耗这份正文，读完后不能再把同一份正文直接交给 fetch 使用。因此本演示先复制请求，再用 <code>request.clone().text()</code> 读取副本里的短 JSON 文本，原请求的正文仍可用于后续发送。复制要在读取之前做；这一步也没有把请求发出去。<Cite id="request-inspect" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="positions" title="参数放在哪里">
      <div className={s.paired}><div><h3>地址里的条件</h3><p id="request-target" className="vp-citation-target"><code>/books?q=海边</code> 中，路径 <code>/books</code> 指向书目，问号后面的 <code>q=海边</code> 是查询参数，表示用“海边”筛选。q 这个名字由书店接口约定；换一个服务，搜索词可能就要叫 keyword。<Cite id="request-target" /></p></div><div><h3>消息里的内容</h3><p id="request-body-rule" className="vp-citation-target">请求体可以携带 JSON 文本、表单或文件。本例先用 <code>JSON.stringify</code> 把书名数据写成 JSON 文本，再放进 body。浏览器的 Fetch API 不允许 GET、HEAD 携带 body：在上面的 GET 模式勾上请求体再构造，会抛出 TypeError，页面显示“未能构造请求”，不会悄悄改成 POST。<Cite id="request-body-rule" /></p></div></div>
      <p><strong>把同一个值换个位置，不一定还是同一个请求。</strong>如果接口只从 JSON 的 title 读取书名，把 title 改放在 URL 里，服务器未必会去找。以接口文档和实际接收代码为准，不依赖“后端应该能猜到”。</p>
    </ArticleSection>
    <ArticleSection id="boundary" title="构造、发送与完成" className={base.offset}>
      <Legacy slug="request" names={["quiz-heading", "prompt-heading"]} />
      <blockquote className={s.quote}>请求说明想做什么。<br />结果要从响应里找证据。</blockquote>
      <p>对象构造成功，只说明浏览器能按这些选项创建请求对象。服务是否收到了消息、是否接受书名、是否真的保存了书目，还没有答案。收到 <ConceptTerm slug="response">响应</ConceptTerm> 后，要看表示处理结果的状态码，以及返回的书目或错误说明，再决定页面显示什么。</p>
      <p>换成查天气也是一样。服务要求 <code>GET /weather?city=上海</code>，就应按约定把城市放在地址里；构造出这条请求，并不会让你得到上海今天的气温。气温要从服务返回的结果里读取，不能拿自己刚填的请求当答案。</p>
      <p>也不是每次点“搜索”都需要新请求。如果完整书目已经在页面里，程序可以直接在本地筛选；需要从书店服务取得新的信息时，才需要向它发消息。判断有没有请求，要看程序实际做了什么。</p>
      <ArticleAside title="开发者工具里看到的请求"><p id="request-wire" className="vp-citation-target">浏览器开发者工具中的 Network（网络）面板会把请求整理成易读字段。首图用 HTTP/1.1 的文本行解释结构；HTTP/2 等版本传输消息的格式不同，方法、目标地址、请求头和内容这些含义仍然保留。这里省略了其他字段，没有展示完整的网络传输数据。<Cite id="request-wire" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function ResponseTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={responseSources} />;
  return <ConceptArticle slug="response" title="响应" sources={responseSources}
    intro={<>保存书签后，服务器可能返回新书签，也可能指出书名缺失。响应带回这次请求的结果；页面再根据结果决定显示什么。</>}
    sections={[["receipt", "读懂一份返回结果"], ["project", "把响应用到页面"], ["empty", "没有内容也有结果"], ["handling", "错误留在哪一层"]]}
    hero={<ConceptHero slug="response" label="左侧响应保留状态 201 和正文里的书名；客户端处理后，右侧页面新增写着同一书名的书签，响应本身没有变成界面"><div className={s.responseHero}>
      <div className={s.responseMessage}><span>响应</span><div className={s.responseStatus}><strong>201</strong><small>Created</small></div><div className={s.responsePayload}><small>body</small><code>id: 42</code><code>title: <b>海边的书店</b></code></div></div>
      <div className={s.responseBridge}><span>客户端</span><i /><small>处理</small></div>
      <div className={s.responseApp}><span>页面</span><div className={s.responseBookmark}><BookOpen size={23} /><strong>海边的书店</strong></div></div>
    </div></ConceptHero>}>
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
    hero={<ConceptHero slug="http-method" label="本例中，同一份 PUT /notes/42 执行两次仍只修改 42 号便笺；同一份 POST /notes 执行两次，在同一个资源集合新增 43 和 44 号便笺"><div className={s.methodHero}>
      <code className={s.methodPut}>PUT /notes/42 <b>× 2</b></code>
      <div className={s.methodLens}><code>/42</code><span className={s.methodDraft}>草稿</span><strong className={s.methodEdited}>已校对</strong></div>
      <code className={s.methodPost}>POST /notes <b>× 2</b></code>
      <div className={s.methodHeroShelf}><div><FileText size={21} /><code>42</code></div><div><FileText size={21} /><code>43</code></div><div><FileText size={21} /><code>44</code></div></div>
    </div></ConceptHero>}>
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
    hero={<ConceptHero slug="status-code" label="提交导出请求得到 202 已受理；另一层导出任务的结果仍未确定，202 不表示文件已生成"><div className={s.statusHero}>
      <div className={s.statusTask}><span>导出任务</span><div className={s.statusOutcome}><strong>?</strong><span>结果待确认</span></div></div>
      <div className={s.statusReceipt}><code>POST /exports</code><div><strong>202</strong><span>已受理</span></div></div>
    </div></ConceptHero>}>
    <ArticleSection id="classes" title="先读类别，再读具体含义">
      <Legacy slug="status-code" names={["question", "definition"]} />
      <p id="status-classes" className="vp-citation-target"><strong>HTTP 状态码是响应里的三位数字，表达这次请求的处理结果。</strong>第一位给出类别，具体代码再细分含义。它让浏览器、代理和应用有共同的判断依据，不必从错误文案猜测成功或失败。<Cite id="status-classes" /></p>
      <div className={s.matrix}>{[["1xx","信息性响应"],["2xx","成功"],["3xx","重定向类"],["4xx","客户端错误"],["5xx","服务端错误"]].map(([code,label]) => <div key={code}><strong>{code}</strong><span>{label}</span></div>)}</div>
      <p>分类只是入口。201 是已创建，204 是成功且没有内容，202 则是接受了处理请求。不能只看“2 开头”就把三个分支都显示成同一个完成页。</p>
    </ArticleSection>
    <ArticleSection id="export" title="一次导出，两次请求">
      <Legacy slug="status-code" names={["scene-heading"]} />
      <p id="status-accepted" className="vp-citation-target">202 表示请求已被接受，处理可能尚未开始，也可能在后面失败；这个状态码本身不给出完成比例。若服务返回任务地址，客户端可以再查询进展。第一次提交的响应已经结束，后续查询是另一条请求。<Cite id="status-accepted" /></p>
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
    sections={[["fields", "内容之外的信息"], ["negotiate", "同一本书，两种表示"], ["directions", "Accept 与 Content-Type"], ["limits", "字段的控制者"]]}
    hero={<ConceptHero slug="http-header" label="同一资源 /books/42 有 JSON 和纯文本两种可提供的表示；请求头 Accept: application/json 表达偏好后，本例选择 JSON 表示，书名和资源地址不变"><div className={s.headerHero}>
      <div className={s.headerSource}><BookOpen size={22} /><code>/books/42</code><strong>海边的书店</strong></div>
      <div className={s.headerPreference}><span>请求头</span><code>Accept: application/json</code></div>
      <div className={s.headerVariants}><span>本例可提供</span><div><span>JSON</span><code>{'{"title":"海边的书店"}'}</code></div><div><span>TXT</span><strong>海边的书店</strong></div></div>
    </div></ConceptHero>}>
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
    <ArticleSection id="limits" title="字段的控制者" className={base.offset}>
      <Legacy slug="http-header" names={["quiz-heading", "prompt-heading"]} />
      <p id="header-browser" className="vp-citation-target">浏览器会保留部分请求头的控制权。例如 Host、Content-Length 和 Cookie，不能像普通自定义字段一样任意用脚本设置。不要把命令行工具里能够指定的所有字段，直接照搬到浏览器 fetch。<Cite id="header-browser" /></p>
      <p>请求头还可能包含身份凭证。排查时记录字段是否存在、格式是否正确，往往已经足够；共享截图或日志前，应移除真实令牌。把凭证从请求体移进请求头，也不代表请求已经获得权限。</p>
      <ArticleAside title="看见字段，不代表业务使用了它"><p>自定义一个 X-Book-Mode 字段，只是发送了名字和值。如果服务端、代理和缓存都没有处理它，它就不会自动改变业务逻辑。先确认谁读取字段、按什么规则执行，再判断这个字段是否必要。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
