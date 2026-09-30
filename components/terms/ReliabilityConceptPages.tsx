import { ArrowRight, CalendarBlank, Check, Clock, Copy } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleAside, ArticleCitation, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { TimeoutLesson, RetryLesson, IdempotencyLesson } from "./ReliabilityConceptLessons";
import { timeoutSources, retrySources, idempotencySources } from "@/lib/reliability-sources";
import s from "./ReliabilityConcepts.module.css";
import base from "./EventConcepts.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>;
}

export function TimeoutTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={timeoutSources} />;
  return <ConceptArticle slug="timeout" title="超时" sources={timeoutSources}
    sections={[["waiting", "等待有一个上限"], ["clocks", "客户端与服务端的时间"], ["deadline", "给等待分配时间"]]}
    intro={<>在预约页面提交请求，两秒后却显示“超时”。你只知道这次等待没有拿到确认；预约可能已经建立，不能直接再创建一条。</>}
    hero={<ConceptHero slug="timeout" label="同一笔预约：客户端第2秒超时，服务端第3秒建立42号预约，第4秒准备好回信"><div className={s.timeoutHero}><div className={s.timeoutHeroAxis}><span>0</span><span>2 s</span><span>3 s</span><span>4 s</span></div><div className={s.timeoutHeroLane}><span><Clock size={18} />等待</span><div className={s.timeoutHeroTrack}><i className={s.timeoutHeroClient} /><b className={s.timeoutHeroClientEvent}>超时</b></div></div><div className={s.timeoutHeroLane}><span><CalendarBlank size={18} />预约</span><div className={s.timeoutHeroTrack}><i className={s.timeoutHeroServer} /><b className={s.timeoutHeroServerEvent}>#42</b><b className={s.timeoutHeroResponse}>回信</b></div></div></div></ConceptHero>}>
    <ArticleSection id="waiting" title="等待有一个上限">
      <Legacy slug="timeout" names={["question", "definition"]} />
      <p id="timeout-wait" className="vp-citation-target"><strong>超时是给一次等待设上限。</strong>到期还没有拿到所需结果，等待的一方就结束这次等待，按超时处理。在这个例子里，预约页面是等待的一方；若没有上限，它可能一直占着连接等回信。超时让页面及时停下，却不能替服务端撤销已做的事。<Cite id="timeout-wait" /></p>
      <p id="timeout-unknown" className="vp-citation-target">要分开看两件事：服务端有没有建立预约，页面有没有收到确认。两端之间还有网络。请求可能没送到；也可能预约已经建立，只是回信延迟或丢失。两种情况在页面上都可能显示超时。AWS 对网络超时后的资源创建给过同样的例子。<Cite id="timeout-unknown" /></p>
    </ArticleSection>
    <ArticleSection id="clocks" title="客户端与服务端的时间">
      <Legacy slug="timeout" names={["scene-heading"]} />
      <p>这个本地样例中，页面提交前先保存申请号 R7。服务端在第 3 秒建立 #42 预约，并把它与 R7 对应；如果页面还在等，第 4 秒可以收到确认。先选页面最多等多久，再推进时间。实验同时画出两端，是为了看清先后；真实页面不会直接看见服务端内部进度。</p>
      <TimeoutLesson />
      <p>上限为 2 秒时，页面先结束原请求；服务端随后仍建立 #42。第 4 秒即使准备好回信，也赶不上这次已结束的等待。上限改成 5 秒，同一过程就能在第 4 秒收到原确认。改变的是页面等待的时长，并没有提前或推迟服务端建立预约。</p>
      <div className={s.pullQuote}><strong>页面结束了等待，<br />预约仍可能继续。</strong></div>
      <p id="timeout-followup" className="vp-citation-target">两秒那一轮要先记作“结果待确认”。本例服务支持按申请号查询，所以页面能用自己保存的 R7 发起<strong>新查询</strong>，找到服务端生成的 #42；原请求仍是超时。真实服务未必提供这种查询。如果查不到，也没有明确的去重重试约定，就应保留待确认状态，联系服务方核对，不能把再次点击“创建”当成安全操作。<ConceptTerm slug="idempotency">幂等性</ConceptTerm>是指服务按同一次申请的标识避免重复效果；是否支持、标识是什么，需看具体接口。<Cite id="timeout-followup" /></p>
    </ArticleSection>
    <ArticleSection id="deadline" title="给等待分配时间" className={base.offset}>
      <Legacy slug="timeout" names={["quiz-heading", "prompt-heading"]} />
      <p id="timeout-budget" className="vp-citation-target">配置之前，先看它从哪里开始计时：找到并连上服务器时才算，还是从发起请求起覆盖整个过程。有些选项不包括查找网站地址对应服务器的时间（DNS），或建立加密连接的时间（TLS）。设得过短，会把正常的慢请求当成失败；设得过长，又会让页面和连接白等。要结合实际耗时和这件事最多能等多久来定。<Cite id="timeout-budget" /></p>
      <div className={s.budget}><div><strong>一次尝试</strong><p>给每个请求留多少等待时间。</p></div><div><strong>整个任务</strong><p>把多次尝试、间隔和处理时间一起算进去。</p></div></div>
      <p>例如整个查询只允许等待 5 秒，就不能让三次尝试各等 5 秒，再额外加上间隔。每次请求还要受剩余时间约束；时间不够，就停止继续尝试。这里的秒数只为看清时序，不是所有请求都该使用的配置。</p>
      <p id="timeout-cancel" className="vp-citation-target">页面自己到期，不会替服务端的每一步按下停止键。服务端若要让数据库停止尚未完成的工作，得把取消信号传过去，数据库操作也要配合。Go 编程语言的 <code>Context</code> 是一种传递办法，官方示例演示了怎样把取消信号送到数据库。已经写入的预约不会因为后来停止等待而自动消失。<Cite id="timeout-cancel" /></p>
      <ArticleAside title="浏览器端中止等待">
        <p id="timeout-browser" className="vp-citation-target"><ConceptTerm slug="fetch-api">Fetch API</ConceptTerm> 可以接收 <code>AbortSignal.timeout(2000)</code>。时间到后，信号会中止请求，这次 <code>fetch</code> 会因 TimeoutError 报错。这里的两秒按页面活跃的时间算；若浏览器暂存了页面、稍后再恢复，暂停期间不计入这两秒。<Cite id="timeout-browser" /></p>
        <pre className={base.code}>{'await fetch("/reservations/42", {\n  signal: AbortSignal.timeout(2000)\n});'}</pre>
        <p>这段代码控制浏览器端的请求等待；它本身没有替服务端撤销预约。这里访问的是已知编号的预约查询，和上面的创建请求不是同一次操作。</p>
      </ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function RetryTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={retrySources} />;
  return <ConceptArticle slug="retry" title="重试" sources={retrySources}
    sections={[["decision", "先看失败的是哪件事"], ["attempts", "同一查询再试一次"], ["spacing", "等一等，也要错开"], ["stop", "什么时候停"]]}
    intro={<>你已经有 #42 号预约，点开详情却看到“服务暂时不可用”。服务回信里的数字编号是 503，页面不一定把这个编号直接显示出来。再点一次查看也许有用，但一直点不会让服务更快恢复。重试要先看做的是什么、失败能否恢复，再决定等多久、试几次。</>}
    hero={<ConceptHero slug="retry" label="查询42号预约：第一次在0秒收到503；等1秒第二次仍是503；再等2秒，第三次在3秒收到200并停止"><div className={s.retryHero}><div className={s.retryHeroQuery}>查询同一笔预约 <strong>#42</strong></div><div className={s.retryHeroRun}><span><small>第1次</small><strong>503</strong><small>0 s</small></span><i><small>等 1 s</small></i><span><small>第2次</small><strong>503</strong><small>1 s</small></span><i><small>等 2 s</small></i><span><small>第3次</small><strong><Check size={17} />200</strong><small>3 s</small></span></div><div className={s.retryHeroEnd}>收到结果，停止</div></div></ConceptHero>}>
    <ArticleSection id="decision" title="先看失败的是哪件事">
      <Legacy slug="retry" names={["question", "definition"]} />
      <p><strong>重试是一次尝试没有得到所需结果后，按条件再做同一操作。</strong>它只增加获得结果的机会，不能修好故障。再次发送前，先看故障会不会过一会儿消失，还要看重复执行会不会多做一件事。</p>
      <p id="retry-decision" className="vp-citation-target">页面发出一次读取请求，服务用<strong>状态码</strong>回答，也就是用数字说明这次处理的结果：<code>200</code> 表示查询拿到了结果；<code>503</code> 表示服务眼下无法处理，过一会儿可能恢复。另一种情况是 <code>400</code>：本例模拟页面把本该是数字的预约号写成了 <code>abc</code>，服务认为请求有误。你并不需要亲手输入这个错误的预约号；照原样再发仍会错。具体服务可重试哪些错误，要看它的约定；Google Cloud Storage 的重试文档也要求同时判断收到的响应和操作能否安全重复。<Cite id="retry-decision" /></p>
      <p id="retry-safe" className="vp-citation-target">查 #42 不会要求服务再建一条预约，所以本例可以在可恢复的故障后重复查询。换成<strong>创建预约</strong>就不同：如果只是等不到回信，原申请可能已经生效。同一创建请求再做一次，可能再生成一条预约；这种重复后业务结果可能变成两条的操作，HTTP 规范称为“非幂等”，不建议客户端盲目自动重试，除非能确认服务会把重复申请认作同一次，或原请求根本没生效。此时应先凭已保存的申请号查结果，或按服务明确提供的去重规则处理。<Cite id="retry-safe" /></p>
    </ArticleSection>
    <ArticleSection id="attempts" title="同一查询再试一次">
      <Legacy slug="retry" names={["scene-heading"]} />
      <p>“短暂故障”和“持续故障”都查询同一个 <code>GET /reservations/42</code>；“请求有误”场景则把末尾预约号改成 <code>abc</code>。<code>GET</code> 在这里表示读取，而非创建。最多发 3 次，<strong>第一次也算在内</strong>。第一次 503 后先等 1 秒；第二次仍是 503，就再等 2 秒。这里由你手动推进时间，等待结束之前不能发送下一次。</p>
      <RetryLesson />
      <p>选“短暂故障”，三次回信依次是 503、503、200，最后才显示 #42，随后停止。改选“持续故障”，同样的等待并没有换来恢复：三次都是 503，到上限就停。“请求有误”第一次得到 400，继续发送相同查询也不会修正地址，所以立即停。状态码、恢复时刻和秒数都是教学设定；真实客户端不能把所有 4xx 或 5xx 机械地归为同一类。</p>
    </ArticleSection>
    <ArticleSection id="spacing" title="等一等，也要错开" className={base.offset}>
      <p id="retry-backoff" className="vp-citation-target">服务正在忙时，所有页面立刻再发会加重它的负担。退避就是在下一次尝试前留出间隔；本例把两次等待设为 1 秒、2 秒，让你看清间隔在变长。实际实现还要限制等待上限、总尝试次数和整个任务可用的时间。等待不会修好服务，却能避免页面毫无节制地给它加压。<Cite id="retry-backoff" /></p>
      <p id="retry-after" className="vp-citation-target">本例的 503 没带服务建议的等待时间。如果真实服务在 503 回信里给出 <code>Retry-After</code>，它告诉发出请求的页面要等多久才能重发，不能照搬本例的 1 秒。若整个任务剩下的时间不够等，就停止本轮重试，再把未取到结果如实显示出来。<Cite id="retry-after" /></p>
      <p id="retry-jitter" className="vp-citation-target">如果大家等的时间完全一样，仍可能撞在一起：许多页面同时失败，又在相同时间重发。抖动是在等待里加入随机变化，让它们分散。下图的 A、B、C 是三个同时遇到故障的页面；点表示它们<strong>下一次</strong>发出查询的时刻。右边只画出其中一次随机排开的结果，每次的位置都可能不同。<Cite id="retry-jitter" /></p>
      <div className={s.jitterComparison} role="img" aria-label="三个调用方在相同间隔后一起重试；加入抖动后，A、B、C在不同时间重试"><div><h3>相同间隔</h3>{["A", "B", "C"].map(name => <div className={s.jitterLane} key={name}><span>{name}</span><i style={{ left: "65%" }} /></div>)}</div><div><h3>加入抖动</h3>{[30, 72, 47].map((left, i) => <div className={s.jitterLane} key={left}><span>{["A", "B", "C"][i]}</span><i style={{ left: `${left}%` }} /></div>)}</div></div>
    </ArticleSection>
    <ArticleSection id="stop" title="什么时候停">
      <Legacy slug="retry" names={["quiz-heading", "prompt-heading"]} />
      <p><strong>拿到结果、遇到不能照原样再试的错误、用完次数或时间，都该停。</strong>三次 503 后，页面只能说“还没查到 #42 的状态”，不能把它写成“预约不存在”，更不能写成“查询成功”。手动再点也是新请求，不能靠重置按钮绕过线上服务的次数或时间限制。什么时候值得再查，要看服务提示和这件事还能等多久，没有通用的间隔。若失败的是创建预约，没收到回信仍属于结果待确认，应先查明是否已创建。</p>
      <p id="retry-load" className="vp-citation-target">页面发请求时可能借助客户端库。假设页面自己试 3 次，这层库收到页面的每次调用后也各试 3 次，服务最多可能收到 9 次请求。层层重试会把负载相乘，故障时尤其容易拖慢恢复。AWS 这篇文章建议为调用链选择重试位置，而不是每层都加一套。<Cite id="retry-load" /></p>
      <p id="retry-sdk" className="vp-citation-target">现成的客户端库有时作为 SDK（软件开发工具包）的一部分提供。使用前先看它是否已自动重试、会重试哪些错误、上限是多少，再决定页面是否还要加重试。以 Google Cloud Storage 为例，不同客户端库各有自己的重试策略和配置，并不存在所有 SDK 共用的一组默认值。<Cite id="retry-sdk" /></p>
      <ArticleAside title="超时、重试与限流的分工"><p><ConceptTerm slug="timeout">超时</ConceptTerm>限制一段等待；重试判断能否、何时再发；<ConceptTerm slug="rate-limiting">限流</ConceptTerm>控制一段时间里接受多少请求。一次查询可以允许重试，但仍要受等待和次数上限约束。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function IdempotencyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={idempotencySources} />;
  return <ConceptArticle slug="idempotency" title="幂等性" sources={idempotencySources}
    sections={[["effect", "重复后，业务结果会变吗"], ["ledger", "给同一次申请留个编号"], ["scope", "键在哪儿、能用多久"], ["concurrency", "两份请求同时到达时"]]}
    intro={<>预约页面提交了创建申请，却没有收到确认。预约可能已经建立，也可能根本没送到。要不要再提交一次？如果服务能认出这是同一份申请，重发才不会多建一条。</>}
    hero={<ConceptHero slug="idempotency" label="第一次以A键申请14点预约，服务端账本记下A对应42号预约；首次回信丢失，再用同键同内容提交，仍得到42号，账本只有一条预约"><div className={s.idemHero}><div className={s.idemRequests}><span className={s.idemFirst}><Copy size={16} />A · 14:00<ArrowRight size={15} /></span><small className={s.idemLost}>第一次回信丢失</small><span className={s.idemSecond}><Copy size={16} />A · 14:00<ArrowRight size={15} /></span><small className={s.idemReturned}>收到 #42</small></div><div className={s.idemLedger}><span>服务端账本</span><div className={s.idemEntry}><CalendarBlank size={21} weight="light" /><code>A · 14:00</code><strong>#42</strong></div><small>预约 1 条</small></div></div></ConceptHero>}>
    <ArticleSection id="effect" title="重复后，业务结果会变吗">
      <Legacy slug="idempotency" names={["question", "definition"]} />
      <p id="idempotency-effect" className="vp-citation-target"><strong>幂等性看的是预期的业务效果：同一操作做两次或更多次，效果仍和做一次一样。</strong>它不表示请求只发出一次。提供预约功能的服务可以分别记录每次到来的请求；只要服务按这项预约接口的规则只建一条，额外日志不改变这里讨论的业务结果。HTTP 规范也用“预期效果”界定幂等，而不要求每次回信完全一样。<Cite id="idempotency-effect" /></p>
      <p>先不谈网络。假设一份预约当前是 0 人：“把人数<strong>设为</strong> 2”和“让人数<strong>增加</strong> 2”第一次做都得到 2，第二次的结果却不同。</p>
      <div className={s.effectPair}><div><code>把人数设为 2</code><strong>0 → 2 → 2</strong><p>第二次仍设成 2。</p></div><div><code>人数增加 2</code><strong>0 → 2 → 4</strong><p>第二次又增加 2。</p></div></div>
      <p>创建预约通常像后一种：每做一次，就可能多一条。页面暂时禁用提交按钮能减少误点，却挡不住连接中断后的自动重发，或者用户重新打开页面再提交。服务要识别“还是刚才那一份申请”，才有办法只创建一次。</p>
      <ArticleAside title="HTTP 方法里的幂等语义"><p id="idempotency-methods" className="vp-citation-target">HTTP 规范把读取用的安全方法，以及 <code>PUT</code>、<code>DELETE</code> 列为幂等方法。这里说的是规范对这些方法的约定；某个接口是否真的照做，还要看它实际怎样处理请求。创建预约常用的 <code>POST</code> 不能仅凭方法名就当成可安全重发。<Cite id="idempotency-methods" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="ledger" title="给同一次申请留个编号">
      <Legacy slug="idempotency" names={["scene-heading"]} />
      <p id="idempotency-key" className="vp-citation-target">一种办法是<strong>幂等键</strong>：发请求的页面或应用在首次提交前给这份申请生成一个独有编号，并保存下来；如果没收到确认，重发时继续带着<strong>同一键和同一内容</strong>。服务把键与处理结果对应起来。Stripe 的接口会核对重发的参数，也就是时段等提交内容；同键却改了参数，它会报错，避免把另一份申请误认成原申请。<Cite id="idempotency-key" /></p>
      <p>下面把键简写成 A，时段定为 14:00。第一次提交后，服务建立 #42 并记下“A、14:00 对应 #42”，但这次回信在途中丢了。页面不知道结果，于是再用 A 和 14:00 提交。服务查到已保存的对应关系，交回 #42，预约仍只有一条。现实中键通常由应用管理，用户不用亲手抄写；本地实验才把 A 和 B 做成可选项，让你看到换键的后果。右侧账本代表服务内部保存的记录，真实预约页面不一定看得到它。</p>
      <IdempotencyLesson />
      <p>在本地实验里，保持键 A、只把时段改成 16:00，服务不会悄悄沿用 #42，也不会再建一条：它拒绝这份参数不一致的请求。这不是替原预约改时段。改用 B、仍选 14:00，本例会建 #43，因为 B 表示另一份申请。<strong>同一时段能否订两次是另一条业务规则。</strong>本地实验允许两个相同时段，只为看清幂等键的作用；真实预约系统可能另行拒绝。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="键在哪儿、能用多久" className={base.offset}>
      <p id="idempotency-unique" className="vp-citation-target">服务不一定永久保存每一枚键。应用得为另一份申请生成新键，又得在同一申请需要重发时找回原键。这里的 A、B 只是为了让实验容易看懂；实际使用时得选足够独特的键，不能让每位用户都提交字母 A。还要看服务在哪些请求中承认这枚键，以及保存多久。<Cite id="idempotency-unique" /></p>
      <p id="idempotency-scope" className="vp-citation-target">范围由接口决定。AWS EC2 的某些创建操作用一枚“客户端令牌”识别重发；同一令牌在不同部署地区，或同一地区的不同可用区，可能分别生效。可用区是 EC2 在同一地区内划分部署位置的方式。一枚键只在服务承诺的范围内防重，不能假设它走到哪里都有效。<Cite id="idempotency-scope" /></p>
      <p id="idempotency-retention" className="vp-citation-target">保存期限也由服务决定。Stripe 的键记录至少满 24 小时后可以清理；清理后再用旧键会被当作新请求。Stripe 会把首次开始处理后的结果再次返回，连表示服务出错的 <code>500</code> 回信也可能重复。<strong>同键可防止重复创建，却不保证这次回信成功。</strong>这些都是 Stripe 的具体规则，不是所有服务共有的期限或错误处理。<Cite id="idempotency-retention" /></p>
      <p id="idempotency-response" className="vp-citation-target">幂等也不要求每次回信一字不差。HTTP 规范允许重复调用返回不同响应；判断重点仍是预期效果有没有重复累积。<Cite id="idempotency-response" /></p>
      <p id="idempotency-current" className="vp-citation-target">不同服务会作不同选择：Stripe 保存首次请求的状态码和响应体；PayPal 的示例会返回之前那次请求的<strong>当前状态</strong>；AWS EC2 的重复创建回信也可能带上更新后的资源状态。读到“幂等”时，要看接口具体承诺了什么，不能把本页的“再得 #42”理解为所有回信都要完全一样。<Cite id="idempotency-current" /></p>
    </ArticleSection>
    <ArticleSection id="concurrency" title="两份请求同时到达时">
      <Legacy slug="idempotency" names={["quiz-heading", "prompt-heading"]} />
      <p id="idempotency-atomic" className="vp-citation-target">本地实验按顺序处理，真实服务可能同时收到两份带键 A 的请求。倘若两份请求都先看到“还没有 A 的记录”，接着各建一条，幂等键就失效了。服务必须把占住这枚键、创建预约、保存结果这几步协调好：不能已经建了 #42 却漏记 A，也不能记了 A 却没完成对应的创建。AWS 这篇文章的作者把这种协调列为服务端实现幂等的必要条件。<Cite id="idempotency-atomic" /></p>
      <p id="idempotency-concurrent" className="vp-citation-target">所以，同键同时到达也不保证两边马上都拿到 #42。PayPal 把这枚键称为请求 ID；它的接口说明中，先来的请求会被处理，另一份同时到达的同 ID 请求<strong>可能失败</strong>，而且并非所有 PayPal API 都支持这个请求 ID。遇到这种情况要按具体接口约定查询或重试，不能仅凭键相同就宣称两份都成功。<Cite id="idempotency-concurrent" /></p>
      <ArticleAside title="幂等与事务的分工"><p><ConceptTerm slug="transaction">事务</ConceptTerm>帮助一组数据库操作一起提交或回滚；幂等性管的是重复调用会不会重复产生业务效果。如果操作还跨越外部服务，一次本地数据库事务包不住所有效果，还得为每一段另外约定：怎么认出同一笔操作、失败后怎么恢复、去哪里查结果。本例没有模拟并发、崩溃或跨服务事务；实验里按顺序去重的做法不能直接当成生产实现。</p></ArticleAside>
      <p>回到开头的预约：在服务承诺的范围和期限内，保持同一个键和同一份内容，同一创建申请才不会重复产生业务效果；但幂等仍不保证请求一定成功。若服务没给这种保证，应先查预约记录或联系服务方核对。想改时段也不等于重发原申请：先确认原预约是否存在，再用服务提供的修改或取消办法。换成付款后没收到回信，也不能为了“再试一次”生成一枚新键。<ConceptTerm slug="retry">重试</ConceptTerm>决定是否再发；幂等性约束再发后的业务效果。</p>
    </ArticleSection>
  </ConceptArticle>;
}
