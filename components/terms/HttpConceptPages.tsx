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
    intro={<>你在网上书店把一本书加入账号里的书签，方便以后再找。点完“保存”，怎样知道书店服务有没有存好？它会通过响应告诉浏览器处理结果，页面再据此显示新书签或错误提示。</>}
    sections={[["receipt", "读懂一份返回结果"], ["project", "把响应用到页面"], ["empty", "没有内容也有结果"], ["handling", "错误留在哪一层"]]}
    hero={<ConceptHero slug="response" label="左侧响应保留状态 201 和正文里的书名；客户端处理后，右侧页面新增写着同一书名的书签，响应本身没有变成界面"><div className={s.responseHero}>
      <div className={s.responseMessage}><span>响应</span><div className={s.responseStatus}><strong>201</strong><small>Created</small></div><div className={s.responsePayload}><small>body</small><code>id: 42</code><code>title: <b>海边的书店</b></code></div></div>
      <div className={s.responseBridge}><span>客户端</span><i /><small>处理</small></div>
      <div className={s.responseApp}><span>页面</span><div className={s.responseBookmark}><BookOpen size={23} /><strong>海边的书店</strong></div></div>
    </div></ConceptHero>}>
    <ArticleSection id="receipt" title="读懂一份返回结果">
      <Legacy slug="response" names={["question", "definition"]} />
      <p id="response-parts" className="vp-citation-target"><strong>响应是服务器针对请求返回的消息，响应体只是其中的内容。</strong>在本例里，浏览器发送保存书签的请求，书店服务接收并处理，再返回响应。浏览器是客户端；其中运行的页面程序负责读取响应、更新屏幕上的书签。服务返回了消息，不等于页面已经显示好了。<Cite id="response-parts" /></p>
      <p>一份响应通常要结合几部分来看。<ConceptTerm slug="status-code">状态码</ConceptTerm>是 201、204、422 这样的数字，概括处理结果；响应头补充怎么理解这份消息，例如 Content-Type 说明正文格式。响应体再携带具体数据或错误说明。本例用 JSON 这种文本格式写编号和书名，其他响应也可以返回网页、图片等内容。</p>
      <p id="response-created" className="vp-citation-target">以创建书签为例：201 表示新书签已经创建。服务为它分配编号 42，响应体里的 <code>id</code> 是编号，<code>title</code> 是书名；响应头 <code>Location: /bookmarks/42</code> 指出这条新书签的地址。页面可以用服务返回的编号识别书签，不必假定自己提交的草稿就是最终记录。201 不要求每次都返回这组字段；有没有正文、正文叫什么，要看这个服务的接口说明。<Cite id="response-created" /></p>
      <p>因此，向 AI 描述“保存失败”时，如果只贴 <code>{'{"id":42,"title":"海边的书店"}'}</code> 这段正文，就漏掉了状态码和响应头。它们能帮助判断：服务报告了什么结果，正文应该按什么格式读取，以及新记录在哪里。</p>
    </ArticleSection>
    <ArticleSection id="project" title="把响应用到页面">
      <Legacy slug="response" names={["scene-heading"]} />
      <p id="response-native" className="vp-citation-target">下面的消息区摆着一份教学响应，页面区还没有处理它。选择“创建书签”“移除书签”或“缺少书名”，再点“应用到页面”，观察程序怎样使用这份响应。演示用浏览器自带的 Response 对象在本地构造预设消息，不会访问真实书店服务，也不会修改账号里的书签。<Cite id="response-native" /></p>
      <ResponseLesson />
      <p>201 这份消息里有书名，程序读出后把它显示在书签上；204 表示本例的移除操作已完成，程序显示“书签已移除”；422 的正文说明缺少书名，程序把“请填写书名”留在页面上。响应仍然留在消息区，页面显示什么由处理它的代码决定。</p>
      <p>每个选项是一份独立的预设响应。切换选项时，页面区先回到“尚未处理”，等你再次点“应用到页面”；“重置界面”也只恢复这个待处理画面，保留当前选项。这里的切换和重置不代表撤销服务器已经完成的操作。</p>
      <p id="response-read" className="vp-citation-target">在真实网页里，<code>fetch</code> 是浏览器发起请求的函数。代码等到 <code>await fetch(...)</code> 返回 Response 时，通常已经拿到状态码和响应头，但正文可能还没收完。接着用 <code>await response.json()</code> 读取并解析 JSON，才得到程序能使用的编号、书名等值。最后还要由页面代码把它们显示出来。<strong>拿到响应、读懂正文、更新页面，是不同的步骤。</strong><Cite id="response-read" /></p>
    </ArticleSection>
    <ArticleSection id="empty" title="没有内容也有结果" className={base.offset}>
      <p id="response-empty" className="vp-citation-target">204 表示请求已成功处理，而且没有响应内容。删除完成或保存后不需要回传数据时，服务可以采用它。204 仍然有状态码，也可以带响应头；缺少的是正文。程序应按成功结果更新页面，不要再调用 <code>response.json()</code>：空正文不是合法 JSON，强行解析会报错。<Cite id="response-empty" /></p>
      <blockquote className={s.quote}>204 没有响应体，<br />不等于没有收到响应。</blockquote>
      <p id="response-format" className="vp-citation-target">反过来，有一大段正文也不代表成功。服务可能返回 HTML 写成的错误网页，也可能用 JSON 指出哪个字段没填对。先看状态，再看 Content-Type 和接口说明，才能选合适的读取方式；写着 <code>application/json</code> 时可以尝试按 JSON 读取，但格式声明不能保证正文一定写对了，程序仍要处理解析错误。<Cite id="response-format" /></p>
    </ArticleSection>
    <ArticleSection id="handling" title="错误留在哪一层">
      <Legacy slug="response" names={["quiz-heading", "prompt-heading"]} />
      <p id="response-error" className="vp-citation-target">422 表示服务器能理解请求的内容类型和写法，但无法按这些内容完成要求。本例约定创建书签必须有书名，服务发现缺少它，就用 422 和错误正文说明问题。原样再提交一次，通常还会得到同样的错误；应先补好书名。这个例子没有提供输入表单，只展示收到错误后页面怎样提示。<Cite id="response-error" /></p>
      <p id="response-status" className="vp-citation-target">422 也是一份响应。浏览器的 fetch 不会因为 HTTP 状态是 422 或 404 就自动报网络失败，程序还要检查状态。代码里的 <code>response.ok</code> 只看状态码是否在 200–299；它不检查正文是否能解析，也不保证页面已经更新。<Cite id="response-status" /></p>
      <p id="response-parse" className="vp-citation-target">如果收到 201，却在读取 JSON 时出错，应分别看待：服务已经报告“创建成功”，而页面没能读懂返回内容。后一个错误不能改写前一个结果，不能因此断言“书签没有创建”。同样，上传头像返回 204 后若页面解析空正文报错，需要修正的是这次读取方式，不能把“没有正文”当作“没有收到响应”。<Cite id="response-parse" /></p>
      <p>实际排查时，可以在浏览器开发者工具的 Network（网络）面板中找到这次请求，查看状态码、响应头和正文，再对照接口说明约定的字段。若程序拿到的内容正确，而页面还没变，再检查显示代码。先辨认卡在哪一步，比把网络、数据读取和页面显示的问题都叫作“接口坏了”更有用。</p>
      <ArticleAside title="收到旧请求的响应"><p>先搜索“海边”，紧接着搜索“山间”，较早的请求可能更晚返回。如果页面无条件采用最后到达的响应，就会显示旧搜索结果。客户端可以取消旧请求，或检查响应是否仍属于当前搜索；每份响应都需要与发起它的操作对应。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function HttpMethodTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={methodSources} />;
  return <ConceptArticle slug="http-method" title="HTTP 方法" sources={methodSources}
    intro={<>让 AI 给便笺网页加一个“保存”按钮，它却开始讨论用 PUT 还是 POST。按钮都叫保存，为什么还要选？因为网页要告诉服务器：这次是设置指定便笺的内容，还是另建一条便笺。</>}
    sections={[["resource", "方法与目标一起读"], ["repeat", "让同一条请求再执行一次"], ["properties", "安全与幂等"], ["others", "其他方法与实现边界"]]}
    hero={<ConceptHero slug="http-method" label="本例中，同一条 PUT /notes/42 执行两次仍只修改 42 号便笺；同一条 POST /notes 执行两次，在同一个资源集合新增 43 和 44 号便笺"><div className={s.methodHero}>
      <code className={s.methodPut}>PUT /notes/42 <b>× 2</b></code>
      <div className={s.methodLens}><code>/42</code><span className={s.methodDraft}>草稿</span><strong className={s.methodEdited}>已校对</strong></div>
      <code className={s.methodPost}>POST /notes <b>× 2</b></code>
      <div className={s.methodHeroShelf}><div><FileText size={21} /><code>42</code></div><div><FileText size={21} /><code>43</code></div><div><FileText size={21} /><code>44</code></div></div>
    </div></ConceptHero>}>
    <ArticleSection id="resource" title="方法与目标一起读">
      <Legacy slug="http-method" names={["question", "definition"]} />
      <p>假设便笺保存在网站的服务器上。你在网页里点击保存，网页程序负责发出请求，服务器处理后发回响应。这里发请求的一方叫客户端；HTTP 是双方交换请求和响应时遵守的协议。</p>
      <p id="method-purpose" className="vp-citation-target"><strong>HTTP 方法是请求里表示操作目的的名称，例如 GET、PUT、POST、DELETE。</strong>地址告诉服务器要找什么，方法说明希望对它做什么。GET 请求读取目标的数据，PUT 请求用提交的内容建立或替换指定目标，DELETE 请求移除目标；POST 则把内容交给目标按约定处理，常用于创建，也可以提交一次导出任务。<Cite id="method-purpose" /></p>
      <p>在这个便笺接口中，<code>/notes</code> 是便笺集合的地址路径，<code>/notes/42</code> 指向编号为 42 的那条便笺。示例省略了网站域名。这样能通过地址指定的对象叫“资源”。服务器传回的是描述便笺的数据，例如它的编号和标题；HTTP 文档把这种可传送的数据形式称为资源的“表示”。</p>
      <p>这个接口约定：<code>POST /notes</code> 新建便笺，由服务器分配编号；<code>PUT /notes/42</code> 则把 42 号便笺设成提交的内容，如果还没有这条便笺，就按提交的内容新建它。下面提交的 <code>title</code> 是标题，值为“已校对”。这份简化便笺只有标题可设置；真实接口里 PUT 要提交哪些完整内容，应查它的约定。</p>
      <p>也可以把新增和修改都交给一个 POST 入口，再在请求内容里注明这次要新增还是修改。这仍然可以工作，只是调用方需要了解额外约定。按 HTTP 方法的含义设计接口，可以让不同客户端依据共同规则区分读取、替换等操作，尤其是判断一条请求能否重试。</p>
    </ArticleSection>
    <ArticleSection id="repeat" title="让同一条请求再执行一次">
      <Legacy slug="http-method" names={["scene-heading"]} />
      <p>下面用本地便笺模拟服务器上的资源，没有向真实服务器发送请求。先选 PUT，连续点击两次“执行同一条请求”，再切到 POST 连点两次。请求下方的便笺和条数显示操作后的资源状态，再往下显示最近一次响应：三位数字是状态码，后面的内容是响应体。</p>
      <p>切换方法会清掉上次响应和计数，已经改变的便笺会保留。“恢复初始资源”才把集合恢复为一条标题是“草稿”的 42 号便笺，同时清掉结果，选中的方法不变。演示提供六次 POST 新增机会，用完后可恢复初始资源重新试；这只是演示的容量限制。</p>
      <MethodLesson />
      <p>连续两次 PUT 都把同一条 42 号便笺设为“已校对”，所以仍是一条；本例连续两次 POST 则分别新建 43、44 号便笺，加上原有的 42，一共三条。本例用 200 表示已有便笺更新成功，用 201 表示新便笺创建成功。标题相同，并不代表它们是同一条便笺。换成 GET，只会读取 42，不会再添一条。</p>
      <p id="method-delete" className="vp-citation-target">再试两次 DELETE：第一次移除 42，示例返回 204，表示成功且没有响应体；第二次返回 404，表示找不到它。第一次执行后 42 就不存在，第二次执行后仍然如此；前面新建的 43、44 不受影响。<strong>幂等比较的是重复请求对目标的预期效果，不要求每次返回相同的状态码或内容。</strong><Cite id="method-delete" /></p>
    </ArticleSection>
    <ArticleSection id="properties" title="安全与幂等">
      <div className={s.paired}><div><h3>是否要求改动数据</h3><p id="method-safe" className="vp-citation-target">HTTP 中的“安全方法”指约定用途是只读：客户端发出这类请求时，并不要求修改服务器上的数据。GET 属于这一类，服务器顺带记录访问日志不改变这个分类。这里的“安全”不保证数据保密或人人有权访问。GET 不应执行删除，否则浏览器预先读取链接、搜索程序访问链接时，都可能误删数据。<Cite id="method-safe" /></p></div><div><h3>重复是否叠加效果</h3><p id="method-repeat" className="vp-citation-target">“幂等”是说：多次发送相同请求，与只发送一次，对服务器产生的预期效果相同。PUT、DELETE 和安全方法按约定都满足这一点。PUT 会写数据，所以幂等不等于只读，也不表示服务器只执行了一次。POST 和 PATCH 不保证幂等，要看具体操作。<Cite id="method-repeat" /></p></div></div>
      <p id="method-retry" className="vp-citation-target">假如保存时连接断了，网页没有收到响应，服务器可能已经保存成功。原样重试 PUT，仍是把指定便笺设成同样的内容；重试本例的 POST，却可能多建一条。因此，客户端在没有读到响应时可以依据幂等约定判断能否重试；对不保证幂等的操作，不能仅凭“没收到”就自动再发，除非接口有明确的重复请求去重约定，或能确认第一次没有执行。<Cite id="method-retry" /></p>
      <p id="method-identical" className="vp-citation-target">判断时还要确认是同一个目标、相同的请求内容。把提交的标题从“草稿”改为“已校对”，请求内容就不再相同；幂等并不要求两种标题产生相同结果。GET 两次返回的标题也可能不同，因为别人可能在中途修改了便笺。<Cite id="method-identical" /></p>
    </ArticleSection>
    <ArticleSection id="others" title="其他方法与实现边界">
      <Legacy slug="http-method" names={["quiz-heading", "prompt-heading"]} />
      <div id="method-others" className="vp-citation-target"><dl className={s.definitions}><dt>PATCH</dt><dd>提交对资源的局部修改，修改指令的写法由接口约定。例如“把标题设为某个值”，原样重复效果不变；“在末尾追加一段文字”，每重复一次就多一段。</dd><dt>HEAD</dt><dd>读取类似 GET 响应中的状态码和响应头，但不返回响应体。响应头是数据类型、长度等附带信息；具体返回哪些字段要看服务器。</dd><dt>OPTIONS</dt><dd>询问目标支持哪些通信选项，例如哪些方法可用。</dd></dl><Cite id="method-others" /></div>
      <p id="method-implementation" className="vp-citation-target">这些约定需要服务器正确实现。把一个每次加一的操作命名为 PUT，并不能自动获得幂等性；接口的实际行为仍要检查。方法也不能代替身份、权限和输入校验。<Cite id="method-implementation" /></p>
      <p>换成灯光设置也一样：反复把同一盏灯的目标亮度设为 50%，预期仍是 50%；每次“再增加 10%”，效果就会累积。让 AI 设计接口时，可以让它写清楚目标地址、提交内容、第一次结果和原样重复后的结果，再判断所选方法是否符合这些行为。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function StatusCodeTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={statusSources} />;
  return <ConceptArticle slug="status-code" title="状态码" sources={statusSources}
    intro={<>你让 AI 给书目网页做一个导出按钮。提交后，服务器返回 202，页面就显示“下载完成”，却没有文件可下载。要找出哪里判断错了，得先看这个数字究竟说明了哪一步。</>}
    sections={[["classes", "先读类别，再读具体含义"], ["export", "提交之后，还要查询结果"], ["errors", "错误之后的动作"], ["business", "HTTP 状态与业务状态"]]}
    hero={<ConceptHero slug="status-code" label="提交导出请求得到 202 已受理；另一层导出任务的结果仍未确定，202 不表示文件已生成"><div className={s.statusHero}>
      <div className={s.statusTask}><span>导出任务</span><div className={s.statusOutcome}><strong>?</strong><span>结果待确认</span></div></div>
      <div className={s.statusReceipt}><code>POST /exports</code><div><strong>202</strong><span>已受理</span></div></div>
    </div></ConceptHero>}>
    <ArticleSection id="classes" title="先读类别，再读具体含义">
      <Legacy slug="status-code" names={["question", "definition"]} />
      <p>网页要从服务器导出书目，会先发出一条请求。服务器发回的回复叫响应，状态码就是响应的一部分。发请求的网页程序在这里叫客户端；HTTP 是双方交换这些消息所遵守的协议。在这个例子中，数字由服务器给出，页面程序再根据它和响应正文里的数据决定显示什么。</p>
      <p id="status-classes" className="vp-citation-target"><strong>HTTP 状态码是响应里的三位数字，表达这条请求的处理情况。</strong>例如 200 通常表示请求成功，404 表示没有找到目标。第一位先把情况分成大类，后两位再区分具体含义。下面的 <code>xx</code> 是另外两位数字的占位写法，例如 2xx 包括 200、201、202。<Cite id="status-classes" /></p>
      <div className={s.matrix}>{[["1xx","信息性响应"],["2xx","成功"],["3xx","重定向类"],["4xx","客户端错误"],["5xx","服务端错误"]].map(([code,label]) => <div key={code}><strong>{code}</strong><span>{label}</span></div>)}</div>
      <p id="status-categories" className="vp-citation-target">1xx 是处理过程中的临时信息，还不是最终响应；2xx 表示当前请求处理成功；3xx 属于重定向类，需要进一步动作，例如转向另一个地址，也包括让客户端继续使用已缓存内容的 304。4xx 指向请求方面的问题，5xx 指向服务器无法完成请求的情况。类别帮助缩小范围，并不能单凭它断定是哪位用户或开发者做错了。<Cite id="status-categories" /></p>
      <p>也可以只在响应正文里写“成功”“失败”等提示，但每个程序都要读懂这些自定义文字。状态码提供共同的数字约定，浏览器和监控程序能据此判断请求的处理情况，正文再解释具体原因。监控程序会收集这些结果，帮助维护网站的人发现服务异常。</p>
      <p>即使同属 2xx，也要看具体代码。201 表示已经创建新资源；204 表示请求成功，但响应没有正文，例如删除成功后不再附带其他内容；202 表示已经接受处理请求。它们都不能一概翻译成“文件已经下载到你的电脑”。</p>
    </ArticleSection>
    <ArticleSection id="export" title="提交之后，还要查询结果">
      <Legacy slug="status-code" names={["scene-heading"]} />
      <p id="status-accepted" className="vp-citation-target">202 表示请求已被接受，处理可能尚未开始，也可能在后面失败；这个状态码本身不给出完成比例。若服务返回任务地址，客户端可以再查询进展。第一次提交的响应已经结束，后续查询是另一条请求。<Cite id="status-accepted" /></p>
      <p>在下面的书目示例中，<code>POST /exports</code> 是“提交一次导出”，<code>GET /exports/7</code> 是“读取 7 号导出任务现在怎么样了”。POST 和 GET 是请求的方法，斜杠后面是地址路径。提交响应中的 <code>task</code> 字段给出查询地址 <code>/exports/7</code>，它是这个接口约定的数据，不是 202 这个数字自带的内容。</p>
      <p>实验初始数量为 2，“服务可用”已经勾选。这时点击“提交导出”，再点击“GET /exports/7”。随后点击“让后台完成生成”，观察旧查询结果，最后再查一次。按这个顺序，你会模拟一次提交和两次查询。所有状态都在本页本地演算，没有向服务器发送导出请求；后台完成由按钮控制，不代表真实等待时间。</p>
      <p>数量用于练习输入检查，允许 1 到 5 的整数，不会改变下载样例里的书目条数。修改数量或切换服务开关，会清掉提交响应和查询结果；再次提交会显示新的提交响应，重新开始这一轮任务演示。“重置实验”还会把数量设回 2、恢复服务可用。这只是重置教学场景，不表示真实系统中改一下输入就会撤销后台任务。</p>
      <StatusLesson />
      <p>第一次查询得到 <code>200 OK</code> 和 <code>state: pending</code>：200 表示这次查询成功，<code>state</code> 是响应正文里的任务状态字段，<code>pending</code> 在本例表示尚未完成。后台生成文件后，已显示的查询结果仍然是旧的；再查一次才得到 <code>state: done</code>，表示本例任务已完成，并出现“下载示例文件”。</p>
      <p><code>pending</code>、<code>done</code> 是这个接口自己约定的任务状态，不是 HTTP 状态码。提交响应的 202 也没有变成 200；页面上保留的是不同请求各自得到的响应。文件就绪后还要点击下载入口，本例下载的是固定的一条书目 CSV 文件，也就是能用表格软件打开的文本数据。</p>
    </ArticleSection>
    <ArticleSection id="errors" title="错误之后的动作">
      <div className={s.paired}><div><h3>先修改输入</h3><p id="status-correct" className="vp-citation-target">保持服务可用，把数量设为 0 后提交，示例返回 422。服务器理解内容类型，写法也能解析，但内容中的要求无法处理；本例是数量超出了允许范围。应先改成 1 到 5 的整数；数量仍是 0 就再次提交，还会得到 422。<Cite id="status-correct" /></p></div><div><h3>先处理不可用</h3><p id="status-unavailable" className="vp-citation-target">取消勾选“服务可用”后提交，示例返回 503，表示服务暂时无法处理请求，可能是维护或负载太高。这里改数量不能恢复服务，要先等待服务恢复，再判断能否重试。并不是每个服务故障都会返回 503。<Cite id="status-unavailable" /></p></div></div>
      <p id="status-retry" className="vp-citation-target">示例的 <code>Retry-After: 60</code> 是响应头，也就是响应中附带的说明字段，建议收到响应后等待 60 秒再发后续请求。它不保证 60 秒后一定恢复，也不会自动替页面重试。本地演示没有倒计时，恢复由“服务可用”开关控制；真实应用是否重试，还要判断再次提交是否会重复创建任务。<Cite id="status-retry" /></p>
      <div id="status-other" className="vp-citation-target"><p>其他错误也需要不同的处理：</p><dl className={s.definitions}><dt>401</dt><dd>这次请求缺少有效的身份凭据，应检查登录状态或请求携带的凭据。</dd><dt>403</dt><dd>服务器理解请求，但拒绝执行。应检查权限或拒绝原因，重新登录未必能解决。</dd><dt>404</dt><dd>没有找到目标，也可能是不愿透露目标是否存在，例如不向无权访问的人确认一份私有文件存在。先核对地址和所用账号能访问的范围。</dd><dt>409</dt><dd>请求与当前资源状态冲突，应根据返回说明处理冲突，再决定是否重新提交。</dd></dl><Cite id="status-other" /></div>
    </ArticleSection>
    <ArticleSection id="business" title="HTTP 状态与业务状态" className={base.offset}>
      <Legacy slug="status-code" names={["quiz-heading", "prompt-heading"]} />
      <blockquote className={s.quote}>先明确：<br />成功的是哪一条请求？</blockquote>
      <p>如果真实导出任务生成失败，查询它仍可能返回 200，同时在响应正文写 <code>state: failed</code>。200 表示成功取到了任务记录，<code>failed</code> 才说明记录中的导出任务失败。如果这次查询得到 503，只能知道查询暂时无法完成，不能据此判断导出任务成功还是失败。上面的简化演示只提供 pending 和 done，没有模拟任务失败或查询暂不可用的分支。</p>
      <p>反过来，如果提交请求因输入不合法而被拒绝，却总返回 200，只在正文里写自定义错误码，只看 HTTP 状态的调用方和监控就无法分辨这次拒绝。业务码是某个项目在响应数据里自定义的标记，与 HTTP 状态码属于不同约定。接入已有接口要遵守它的文档；设计新接口时，应让 HTTP 状态表达当前请求的情况，再用正文补充具体原因。</p>
      <p>换成视频转码：提交视频得到 202，之后查询得到 200 和“转换失败”，就应显示转换失败，而不是可播放。让 AI 排查这类页面时，把是哪一次请求、返回的状态码、任务状态和页面提示一起提供，比只说“明明返回成功了”更容易找到错误判断。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function HttpHeaderTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={headerSources} />;
  return <ConceptArticle slug="http-header" title="请求头" sources={headerSources}
    intro={<>AI 让你在请求头里加上 Accept: application/json。它是在指定要查哪本书，还是让服务器把书名写成另一种格式？请求头传达的是这次请求的补充信息；服务器如何使用，还要看双方的约定。</>}
    sections={[["fields", "内容之外的信息"], ["negotiate", "同一本书，两种表示"], ["directions", "Accept 与 Content-Type"], ["limits", "字段的控制者"]]}
    hero={<ConceptHero slug="http-header" label="同一资源 /books/42 有 JSON 和纯文本两种可提供的表示；请求头 Accept: application/json 表达偏好后，本例选择 JSON 表示，书名和资源地址不变"><div className={s.headerHero}>
      <div className={s.headerSource}><BookOpen size={22} /><code>/books/42</code><strong>海边的书店</strong></div>
      <div className={s.headerPreference}><span>请求头</span><code>Accept: application/json</code></div>
      <div className={s.headerVariants}><span>本例可提供</span><div><span>JSON</span><code>{'{"title":"海边的书店"}'}</code></div><div><span>TXT</span><strong>海边的书店</strong></div></div>
    </div></ConceptHero>}>
    <ArticleSection id="fields" title="内容之外的信息">
      <Legacy slug="http-header" names={["question", "definition"]} />
      <p>网页向服务器要一条书目信息时，发出去的消息叫请求，服务器发回的消息叫响应。发起请求的一方是客户端，处理请求的一方是服务器。HTTP 约定了这类消息的结构和含义；请求头就是其中一部分。</p>
      <p id="header-fields" className="vp-citation-target"><strong>请求头由字段名和值组成，随请求补充说明发送的内容、客户端的偏好或处理条件。</strong>例如 <code>Accept: application/json</code>，按这里的写法，冒号前的 Accept 是字段名，后面的 application/json 是值。响应也有自己的头字段，称为响应头。<Cite id="header-fields" /></p>
      <p>先看这条请求：<code>GET /books/42</code> 表示读取编号 42 的书目。地址指出要查哪条书目，Accept 则表达希望收到的内容格式。服务器可以参考这个偏好，从自己能提供的格式中选择；书名“海边的书店”放在返回的正文里。</p>
      <p>双方也可以约定这个地址永远只返回 JSON，不让客户端选择格式；或者为不同格式提供不同地址。使用 Accept 的好处是，同一地址可以按约定返回 JSON 或纯文本，供不同客户端读取。它不是每个接口都必须支持的格式切换功能。</p>
    </ArticleSection>
    <ArticleSection id="negotiate" title="同一本书，两种表示">
      <Legacy slug="http-header" names={["scene-heading"]} />
      <p>这里的“表示”，指同一条书目以什么样的数据交给客户端。JSON 把书名放在 title 这个名称下面，像 <code>{'{"title":"海边的书店"}'}</code>，方便程序按名称取值；纯文本只返回“海边的书店”。两种写法都在说这本书，并没有改动保存的书名。</p>
      <p id="header-negotiation" className="vp-citation-target">服务器参考请求中的偏好来选择表示，这个过程叫<strong>内容协商</strong>。下面的本地演示只提供 JSON 和纯文本，并约定无法满足偏好时返回 406，表示没有可接受的表示。真实服务也可能采用自己的回退策略；发出 Accept 并不保证服务器一定照选项返回。<Cite id="header-negotiation" /></p>
      <p>下拉框默认是 application/json，也就是 JSON 的媒体类型名称；text/plain 表示纯文本。媒体类型用约定的名字说明内容格式。点击“协商格式”后，选中的表示会突出显示，下面出现本次响应。这里没有向外部服务器发送请求。</p>
      <HeaderLesson />
      <p>选择 JSON 或纯文本，都得到表示请求成功的 200，但响应正文和 Content-Type 不同。纯文本类型后面的 <code>charset=utf-8</code> 还说明文字采用 UTF-8 编码，帮助接收方正确读取字符。切换选项会收起旧响应，需再次点击才得到新结果；点“重置协商”会恢复 JSON 选项并清除结果。</p>
      <p>XML 是另一种数据格式。本例不提供它，所以选 application/xml 后得到 406，意思是没有可接受的表示，两张卡都不会被选中。把类型名字写进请求头，不会让服务器自动具备生成那种格式的能力。</p>
    </ArticleSection>
    <ArticleSection id="directions" title="Accept 与 Content-Type">
      <div className={s.paired}><div><h3>希望收到什么</h3><p id="header-accept" className="vp-citation-target">请求中的 <code>Accept</code> 列出客户端能够理解的媒体类型。可以列出多个候选，用权重表达更偏好哪一种；本例只比较一个精确类型，没有实现多候选和权重的计算。<Cite id="header-accept" /></p></div><div><h3>这份内容是什么</h3><p id="header-content" className="vp-citation-target"><code>Content-Type</code> 说明当前消息携带的正文是什么类型。请求里的它描述发给服务器的内容，响应里的它描述服务器发回的内容。它不会把普通文本自动变成 JSON，正文也要按所声明的格式组织。<Cite id="header-content" /></p></div></div>
      <p>例如，新增书目时，请求正文用 JSON 写入书名，就可以带 <code>Content-Type: application/json</code>；同时带 <code>Accept: text/plain</code>，表达希望服务器用纯文本回复。一个说“我发的是 JSON”，另一个说“我希望收纯文本”，两者并不冲突。是否支持这种组合，仍由接口约定。</p>
      <p id="header-vary" className="vp-citation-target">缓存会保存以前的响应；如果这次请求可以复用旧响应，就不用再向服务器索取一次。当同一地址按 Accept 返回不同表示，服务器发出的响应头 <code>Vary: Accept</code> 提醒缓存：判断旧响应能不能用于新请求，还要比较 Accept。否则，想读 JSON 的客户端可能拿到先前保存的纯文本。Vary 参与复用判断，不是开启缓存或转换格式的开关；本演示只展示这个响应字段，没有模拟缓存。<Cite id="header-vary" /></p>
    </ArticleSection>
    <ArticleSection id="limits" title="字段的控制者" className={base.offset}>
      <Legacy slug="http-header" names={["quiz-heading", "prompt-heading"]} />
      <p id="header-auto" className="vp-citation-target">请求头不一定要由你逐个填写。浏览器加载网页、图片等内容时，会根据请求场景设置 Accept；用脚本发请求时，也可以按接口约定指定它。<Cite id="header-auto" /></p>
      <p>字段名不区分大小写，Accept 和 accept 指同一个字段；字段值怎样解释，则要看各自的定义，不能把所有值都转成小写。字段名拼对，也不意味着它一定能从网页脚本中发出去。</p>
      <p id="header-browser" className="vp-citation-target">浏览器会保留部分请求头的控制权。例如 Host、Content-Length 和 Cookie，不能像普通自定义字段一样任意用脚本设置。fetch 是网页脚本发请求的常用方法，但它仍受浏览器限制；不要把命令行工具里能指定的所有字段直接照搬过来。<Cite id="header-browser" /></p>
      <p>请求头还可能包含身份凭证。排查时记录字段是否存在、格式是否正确，往往已经足够；共享截图或日志前，应移除真实令牌。把凭证从请求体移进请求头，也不代表请求已经获得权限。</p>
      <ArticleAside title="看见字段，不代表业务使用了它"><p>在请求头里添加自定义字段 X-Book-Mode，只是把它的名字和值发出去。如果服务端、代理和缓存都没有处理它，它就不会自动改变业务逻辑。先确认谁读取字段、按什么规则执行，再判断这个字段是否必要。</p></ArticleAside>
      <p>换成读取天气：某个服务约定同一地址可返回 JSON 数据或一段文字播报，Accept 就能表达你要哪种表示。如果你希望加一个“只返回明天”的条件，则应先看服务对筛选条件的约定，不能凭空写一个头字段就期待它生效。让 AI 帮你接接口时，要一起确认字段放在哪条消息里、表达什么、接收方是否处理它。</p>
    </ArticleSection>
  </ConceptArticle>;
}
