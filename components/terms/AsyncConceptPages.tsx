import { BookOpen, Check, EnvelopeOpen, FileText, Image as ImageIcon, Receipt } from "@phosphor-icons/react/dist/ssr";
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { AwaitLesson, FetchLesson, PromiseLesson } from "./AsyncConceptLessons";
import { awaitSources, fetchSources, promiseSources } from "@/lib/async-concept-sources";
import base from "./EventConcepts.module.css";
import styles from "./AsyncConcepts.module.css";

export function AsyncLegacyAnchors({ slug, names }: { slug: string; names: string[] }) {
  return names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />);
}

export function FetchTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={fetchSources} />;
  return <ConceptArticle slug="fetch-api" title="Fetch API" subtitle="发出请求，接住响应" sources={fetchSources}
    intro={<>页面要显示一份书单，数据却在另一个地址。Fetch API 负责发出请求，把收到的响应交给程序；这份响应能不能成为书单，还要接着检查。</>}
    sections={[["response", "从地址到响应"], ["inspect", "拆开一份书目响应"], ["checks", "三种不同的失败"], ["cancel", "请求过期以后"]]}
    hero={<ConceptHero slug="fetch-api" label="响应信封展开，先出现200状态，再露出书目内容"><div className={styles.fetchHero}><div className={styles.heroEnvelope}><div><EnvelopeOpen size={28} weight="light" /><strong>200</strong></div><span>application/json</span><code>{'{ "books": […] }'}</code></div></div></ConceptHero>}
    relatedIntro={<>请求过程用 <ConceptTerm slug="promise">Promise</ConceptTerm> 表示；<ConceptTerm slug="async-await">await</ConceptTerm> 让程序等到这一轮结果，再继续处理。</>}>
    <ArticleSection id="response" title="从地址到响应">
      <AsyncLegacyAnchors slug="fetch-api" names={["question", "definition"]} />
      <p id="fetch-response" className="vp-citation-target"><code>fetch(url)</code> 发起一次请求，返回一个 Promise。它履行时，程序拿到的是 <strong>Response 响应对象</strong>，可以查看状态码和响应头；响应体可能还没读完，更没有自动变成页面需要的数据。<Cite id="fetch-response" /></p>
      <p>可以把 Response 看作刚收到的信封。信封上写着处理状态和内容类型，里面可能是 JSON、图片，也可能是一页错误说明。应用要根据这份回应决定下一步，不能只凭“信封到了”就显示“书目加载成功”。</p>
      <pre className={base.code}>{'const response = await fetch("/books.json");\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst data = await response.json();'}</pre>
    </ArticleSection>
    <ArticleSection id="inspect" title="拆开一份书目响应">
      <AsyncLegacyAnchors slug="fetch-api" names={["scene-heading"]} />
      <p>先取回响应，观察状态码；再按按钮读取内容。这里会真实请求本站的几份教学文件，书目约定为 <code>books</code> 数组，每一项是书名。试着换成不存在的文件，或者格式不对的内容。</p>
      <FetchLesson />
      <p>正常文件经过两次操作才出现书名：一次拿到 Response，一次读取并解释响应体。分开按钮是为了看清两件事；实际页面可以在同一个异步函数里连续完成它们，不需要读者手动拆封。</p>
    </ArticleSection>
    <ArticleSection id="checks" title="三种不同的失败">
      <p id="fetch-http" className="vp-citation-target"><strong>404 仍然是一份 HTTP 响应。</strong>fetch 通常不会因为 404 或 500 自动拒绝 Promise；网络错误、无效地址等才可能让请求在取得 Response 前失败。因而只写 catch，并不能接住所有“不应该显示书目”的情况。<Cite id="fetch-http" /></p>
      <div className={styles.comparison}><div><h3>服务器怎样回应</h3><p id="fetch-ok" className="vp-citation-target"><code>response.ok</code> 在状态码为 200–299 时为 true。它帮助应用先检查 HTTP 层是否成功；它没有检查这份内容里是不是书单。<Cite id="fetch-ok" /></p></div><div><h3>内容能否被读取</h3><p id="fetch-json" className="vp-citation-target"><code>response.json()</code> 读取响应体并解析 JSON，返回的也是 Promise。内容不符合 JSON 语法时会报错；同一份响应体通常不能重复消费。<Cite id="fetch-json" /></p></div></div>
      <p>还有第三层：内容能解析，却把 books 写成了一段字符串。JSON 解析器接受这份合法文本，但我们的页面要的是数组。字段检查属于应用的数据约定，复杂时可以交给 <ConceptTerm slug="json-schema">JSON Schema</ConceptTerm> 等验证规则处理。</p>
    </ArticleSection>
    <ArticleSection id="cancel" title="请求过期以后" className={base.offset}>
      <AsyncLegacyAnchors slug="fetch-api" names={["quiz-heading", "prompt-heading"]} />
      <p>搜索框里先输入“灯”，又改成“海”，旧请求可能比新请求更晚返回。即便两次都是 200，也不应该用旧书单覆盖新书单。页面需要识别当前请求，丢弃已经过期的结果。</p>
      <p id="fetch-cancel" className="vp-citation-target">AbortController 可以通过 signal 关联请求，再调用 abort 取消它。取消也可能发生在收到响应之后、读取响应体之前。本页切换资源和重置时会取消旧请求，并检查结果仍属于当前一轮。<Cite id="fetch-cancel" /></p>
      <p>取消浏览器等待，不代表撤销服务器已经完成的业务操作。创建订单、付款这类请求需要另行处理幂等、状态查询与撤销；不能把“用户离开页面”当成服务器什么也没做。</p>
      <ArticleAside title="内容类型不替你检查字段"><p>Content-Type 是服务器声明的内容类型。声明 application/json 并不保证实际响应能解析，更不保证 books 存在。需要的是分层处理：收到响应、确认状态、读取内容、检查应用需要的结构。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function PromiseTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={promiseSources} />;
  return <ConceptArticle slug="promise" title="Promise" subtitle="记录一次异步操作的结果" sources={promiseSources}
    intro={<>请求发出后，结果未必马上回来。Promise 先代表这份尚未取得的结果；拿到值或遇到错误以后，登记好的处理函数再接着工作。</>}
    sections={[["result", "一份结果，三种状态"], ["order", "让一份订单落定"], ["timing", "回调什么时候执行"], ["chain", "把结果交给下一步"]]}
    hero={<ConceptHero slug="promise" label="取餐凭条从等待变成A17，盖上已落定印章"><div className={styles.promiseHero}><div className={styles.miniTicket}><Receipt size={24} weight="light" /><span>取餐凭条</span><strong>A17</strong><b><Check size={20} /></b><span>fulfilled</span></div></div></ConceptHero>}>
    <ArticleSection id="result" title="一份结果，三种状态">
      <AsyncLegacyAnchors slug="promise" names={["question", "definition"]} />
      <p>拿到取餐凭条时，食物还没有做好，但你已经知道到哪里取结果。程序也可以先拿到一个 Promise，把成功后要做的事、失败时怎么办登记进去，再让当前代码继续执行。</p>
      <p id="promise-states" className="vp-citation-target">Promise 有 pending（等待）、fulfilled（履行）和 rejected（拒绝）三种状态。等待中的 Promise 最终可以带着一个值履行，或者带着一个原因拒绝。<strong>进入任一终态后，就不能再变成另一个终态。</strong>这也叫 settled，已经落定。<Cite id="promise-states" /></p>
      <blockquote className={styles.leadQuote}>拿到 Promise，<br />还不等于拿到里面的值。</blockquote>
    </ArticleSection>
    <ArticleSection id="order" title="让一份订单落定">
      <AsyncLegacyAnchors slug="promise" names={["scene-heading"]} />
      <p>新建一单，再由你决定是交付取餐号还是报告售罄。落定后继续按另一个按钮，观察结果是否改变。这份演示使用原生 Promise；按钮只控制结果何时交付。</p>
      <PromiseLesson />
      <p>先交付 A17，随后报告售罄，凭条仍然是 A17。反过来先报告售罄，也不能再把同一份 Promise 改成成功。业务确实需要重试时，应发起新的操作、取得新的 Promise；“再试一次”不是改写上一次的结果。</p>
    </ArticleSection>
    <ArticleSection id="timing" title="回调什么时候执行" className={base.offset}>
      <p id="promise-timing" className="vp-citation-target">then 登记的处理函数不会插进当前同步代码中途执行。即使 Promise 已经落定，处理函数也会在当前执行结束后的微任务阶段运行。晚一点登记处理函数，仍然能收到已有结果。<Cite id="promise-timing" /></p>
      <p>打开上面的执行记录。按下“交付取餐号”后，记录先出现调用 resolve、同步代码结束，随后才出现成功回调。状态落定与读取结果的回调执行，是两个需要分清的时刻。</p>
      <pre className={base.code}>{'Promise.resolve("A17").then(value => {\n  console.log(value);\n});\nconsole.log("先执行这里");\n\n// 先执行这里\n// A17'}</pre>
      <p>异步回调让执行顺序可安排，但不会把回调里的计算自动搬到后台线程。处理函数里若做很久的同步计算，页面仍然可能卡住。</p>
    </ArticleSection>
    <ArticleSection id="chain" title="把结果交给下一步">
      <AsyncLegacyAnchors slug="promise" names={["quiz-heading", "prompt-heading"]} />
      <p id="promise-chain" className="vp-citation-target">then 会返回一个<strong>新的 Promise</strong>：处理函数返回普通值，后面的步骤就收到该值；返回另一个 Promise，后面会等它落定；抛出错误，则沿拒绝分支继续。忘记 return，下一步拿到的可能就是 undefined。<Cite id="promise-chain" /></p>
      <pre className={base.code}>{'fetch("/books.json")\n  .then(response => {\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    return response.json();\n  })\n  .then(data => showBooks(data))\n  .catch(error => showError(error));'}</pre>
      <p>这里先检查 HTTP 状态，再把解析内容的 Promise 返回给链条。下一步等到解析结束才得到 data。把同一段顺序写成 <ConceptTerm slug="async-await">async/await</ConceptTerm>，改变的是代码组织方式，仍然要处理成功值与失败原因。</p>
      <p id="promise-cancel" className="vp-citation-target">Promise 本身没有通用的“取消”方法。是否能停止底层工作，要看那项操作提供什么能力，例如 fetch 接受 AbortSignal。停止显示结果、拒绝 Promise 和取消实际请求，不能混为一件事。<Cite id="promise-cancel" /></p>
      <ArticleAside title="resolve 也可能接住另一份 Promise"><p id="promise-resolved" className="vp-citation-target">本例 resolve 的是字符串，所以会履行。如果传给 resolve 的是另一份仍在等待的 Promise，外层会跟随它的最终结果，这时还不能说已经 fulfilled。因此，resolved 与 fulfilled 并非在所有情况下都同义。<Cite id="promise-resolved" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function AwaitTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={awaitSources} />;
  return <ConceptArticle slug="async-await" title="async / await" subtitle="等到结果，再接着执行" sources={awaitSources}
    intro={<>文章卡片需要标题和封面。await 让一段代码在结果回来以后继续，写起来像按行往下走；任务什么时候开始，仍由函数调用的位置决定。</>}
    sections={[["function", "暂停的是当前函数"], ["assemble", "等两份材料到齐"], ["start", "先开始，再谈等待"], ["failure", "失败后还剩什么"]]}
    hero={<ConceptHero slug="async-await" label="标题和封面分别移动，汇合后成为文章卡片"><div className={styles.awaitHero}><div className={styles.heroTrack}><FileText size={24} /><span>小岛上的灯塔</span></div><div className={styles.heroTrack}><ImageIcon size={30} /><span>封面</span></div><BookOpen className={styles.heroJoined} size={35} weight="light" /></div></ConceptHero>}>
    <ArticleSection id="function" title="暂停的是当前函数">
      <AsyncLegacyAnchors slug="async-await" names={["question", "definition"]} />
      <p id="await-function" className="vp-citation-target">async 声明异步函数。每次调用它都会得到一个 Promise，用来表示这次函数执行的结果；函数返回的值成为履行值，没有处理的异常成为拒绝原因。<Cite id="await-function" /></p>
      <p id="await-resume" className="vp-citation-target">在异步函数里，await 等待一个值或 Promise。遇到未落定的 Promise，<strong>当前函数后面的代码暂停</strong>；履行后再取出值，安排继续执行。等待期间，浏览器仍可以处理其他事件。即使等待的已经是履行值，后续代码也不会在当前同步步骤中立刻接上。<Cite id="await-resume" /></p>
      <p>所以“这里要等”不等于“整个页面不能动”。下面加载文章时，试着收藏文章：那是独立的点击操作，不必等封面回来。</p>
    </ArticleSection>
    <ArticleSection id="assemble" title="等两份材料到齐">
      <AsyncLegacyAnchors slug="async-await" names={["scene-heading"]} />
      <p>标题和封面地址已经知道，两项任务互不依赖。选择发起方式，再手动让它们返回；只有两份材料都成功，才能拼成阅读卡片。按钮代替了网络返回时机，便于观察先后关系，不是在测量请求速度。</p>
      <AwaitLesson />
    </ArticleSection>
    <ArticleSection id="start" title="先开始，再谈等待">
      <div className={styles.comparison}><div><h3>依次发起</h3><p>调用 loadTitle 后等待。它完成，程序才走到 loadCover。封面任务这时才开始，因此前面那段等待无法被封面的工作利用。</p></div><div><h3>一起发起</h3><p>先调用两项任务，再等待它们共同完成。封面可以先回来，但卡片仍要等标题；谁先返回，不改变标题和封面的用途。</p></div></div>
      <p id="await-all" className="vp-citation-target">Promise.all 把多个结果合在一起：所有输入都履行，它才履行，结果数组与输入顺序一致。这适合“缺一份就不能完成”的汇合任务。<Cite id="await-all" /></p>
      <p><strong>连续写两个 await，不足以判断任务是不是串行开始。</strong>如果此前已经调用两个函数并保存了 Promise，它们可能早就在并发进行。检查的关键是调用位置，而不只是 await 的数量。</p>
      <p>实际任务也不一定适合一起开始。例如先查用户资料，再根据其中的头像地址加载图片，第二步确实依赖第一步。为了看起来更快而强行并发，可能连请求参数都还没拿到。</p>
    </ArticleSection>
    <ArticleSection id="failure" title="失败后还剩什么" className={base.offset}>
      <AsyncLegacyAnchors slug="async-await" names={["quiz-heading", "prompt-heading"]} />
      <p id="await-error" className="vp-citation-target">等待的 Promise 被拒绝时，await 会在所在位置抛出拒绝原因。可以用 try/catch 显示错误或选择后续处理；若不处理，就让调用这段异步函数的代码接住失败。<Cite id="await-error" /></p>
      <p id="await-reject" className="vp-citation-target">一起发起时，让封面先失败。Promise.all 会拒绝，但<strong>不会自动取消还在运行的标题任务</strong>。你仍然可以让标题返回；只不过这一次汇合已经失败，不能再凭一份标题宣称卡片完整。<Cite id="await-reject" /></p>
      <pre className={base.code}>{'try {\n  const [title, cover] = await Promise.all([\n    loadTitle(), loadCover(),\n  ]);\n  showArticle(title, cover);\n} catch (error) {\n  showError(error);\n}'}</pre>
      <p id="await-cpu" className="vp-citation-target">async 函数在第一个 await 之前，仍按普通同步代码执行。把耗时循环放进 async 函数，不会自动获得另一条线程；长计算需要单独考虑拆分或 Worker。<Cite id="await-cpu" /></p>
    </ArticleSection>
  </ConceptArticle>;
}
