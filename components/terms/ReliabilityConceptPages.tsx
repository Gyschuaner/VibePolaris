import { CalendarBlank, Check, Clock, Copy } from "@phosphor-icons/react/dist/ssr";
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
    sections={[["decision", "先判断能不能再试"], ["attempts", "一次失败之后"], ["spacing", "把重试错开"], ["stop", "停止也是结果"]]}
    intro={<>查询预约时碰到短暂故障，再试一次可能就成功了。但服务忙不过来时，每个客户端都立刻重发，只会让队伍更长。重试需要条件，也需要节奏。</>}
    hero={<ConceptHero slug="retry" label="三次尝试之间，等待从1秒增加到2秒"><div className={s.retryHero}><span>503</span><i /><span>503</span><i /><span><Check size={23} />200</span><small>1 s</small><small>2 s</small></div></ConceptHero>}>
    <ArticleSection id="decision" title="先判断能不能再试">
      <Legacy slug="retry" names={["question", "definition"]} />
      <p><strong>重试是在一次尝试失败后，按条件再次执行同一操作。</strong>它适合有机会恢复的故障。参数写错了，原封不动再发一次通常没有帮助；服务临时不可用，等待之后则可能恢复。</p>
      <p id="retry-safe" className="vp-citation-target">还要判断重复执行会不会多做一次业务操作。HTTP 规范要求：对于非幂等方法，客户端不应盲目自动重试，除非能确认该操作实际是幂等的，或原请求未被应用。收到错误或没有收到响应，都不能省略这个判断。<Cite id="retry-safe" /></p>
    </ArticleSection>
    <ArticleSection id="attempts" title="一次失败之后">
      <Legacy slug="retry" names={["scene-heading"]} />
      <p>下面只做只读的预约查询，最多尝试 3 次，包含首次。失败后分别等待 1 秒和 2 秒，再发下一次；时间由你手动推进。换一个故障条件，观察它在哪里停下。</p>
      <RetryLesson />
      <p>“短暂故障”在第三次返回 200；“持续故障”用完三次机会后仍是 503；“参数错误”第一次就返回 400，直接停止。这里的状态码和恢复时刻是教学设定，真实客户端应使用服务约定的可重试错误分类，不能机械地把所有 4xx 或 5xx 归为一类。</p>
    </ArticleSection>
    <ArticleSection id="spacing" title="把重试错开" className={base.offset}>
      <p id="retry-backoff" className="vp-citation-target">退避让后续尝试之间留出间隔。指数退避逐次增加等待，通常还需要上限和次数预算，防止一直重试。它不会修好服务，只是改变调用方施加负载的方式。<Cite id="retry-backoff" /></p>
      <p id="retry-jitter" className="vp-citation-target">如果许多调用方一起失败，又等待完全相同的时间，它们可能再次一起到达。抖动为等待加入随机变化，把请求分散开。下图是三个调用方一次重试的固定采样示意，点的位置表示发出时刻。<Cite id="retry-jitter" /></p>
      <div className={s.jitterComparison}><div><h3>相同间隔</h3>{["A", "B", "C"].map(name => <div className={s.jitterLane} key={name}><span>{name}</span><i style={{ left: "65%" }} /></div>)}</div><div><h3>加入抖动</h3>{[30, 72, 47].map((left, i) => <div className={s.jitterLane} key={left}><span>{["A", "B", "C"][i]}</span><i style={{ left: `${left}%` }} /></div>)}</div></div>
    </ArticleSection>
    <ArticleSection id="stop" title="停止也是结果">
      <Legacy slug="retry" names={["quiz-heading", "prompt-heading"]} />
      <p><strong>达到尝试上限，表示放弃继续尝试，不能显示“操作成功”。</strong>应保存已有错误和业务标识，再按业务选择查询状态、稍后恢复或交给人工处理。明确拒绝的结果与尚未确认的写入结果，也要分别处理。</p>
      <p id="retry-load" className="vp-citation-target">多个调用层各自重试，次数会层层相乘。AWS 建议留意这种负载放大，并为具体调用链选择合适的重试位置。配置 SDK 前，先查它已经做了哪些重试。<Cite id="retry-load" /></p>
      <ArticleAside title="超时、重试与限流的分工"><p><ConceptTerm slug="timeout">超时</ConceptTerm>限制等待；重试决定是否再发；<ConceptTerm slug="rate-limiting">限流</ConceptTerm>决定接受多少请求。即使操作可安全重复，也不代表可以无限发送。总耗时要包含每次等待和退避，服务明确提供等待提示时还要遵守对应约定。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function IdempotencyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={idempotencySources} />;
  return <ConceptArticle slug="idempotency" title="幂等性" sources={idempotencySources}
    sections={[["effect", "重复操作的效果"], ["ledger", "给同一次意图一个编号"], ["scope", "键的范围与期限"], ["concurrency", "请求同时到达时"]]}
    intro={<>一次预约已经建立，确认消息却丢了。用户再次提交时，系统需要认出这是上次那件事，才能把原预约交回来，而不是又建立一条。</>}
    hero={<ConceptHero slug="idempotency" label="两次带A键的请求对应同一张42号预约"><div className={s.idemHero}><div><span><Copy size={18} />key A</span><span><Copy size={18} />key A</span></div><div className={s.heroTicket}><CalendarBlank size={30} weight="light" /><strong>#42</strong><span>一条预约</span></div></div></ConceptHero>}>
    <ArticleSection id="effect" title="重复操作的效果">
      <Legacy slug="idempotency" names={["question", "definition"]} />
      <p id="idempotency-effect" className="vp-citation-target"><strong>幂等性关心：相同请求重复执行，预期的服务端效果是否与一次相同。</strong>HTTP 中的 PUT、DELETE 和安全方法具有幂等语义。服务仍可以记录每次请求的日志，这些附带记录不意味着业务操作不幂等。<Cite id="idempotency-effect" /></p>
      <div className={s.effectPair}><div><code>把人数设为 2</code><strong>2 → 2 → 2</strong><p>重复设置，目标值不变。</p></div><div><code>人数增加 2</code><strong>0 → 2 → 4</strong><p>重复增加，效果累积。</p></div></div>
      <p>创建预约默认更接近第二种：每调用一次就可能新建一条。要安全处理重试，需要给“同一次创建意图”稳定的身份，并让服务按这个身份协调处理。前端暂时禁用提交按钮，只能减少误点，不能处理网络重发。</p>
    </ArticleSection>
    <ArticleSection id="ledger" title="给同一次意图一个编号">
      <Legacy slug="idempotency" names={["scene-heading"]} />
      <p id="idempotency-key" className="vp-citation-target">一种做法是幂等键：客户端为这次操作生成键，重发时继续使用它。以 Stripe 为例，服务会保存首次开始执行后的状态码和响应体，同键请求复用结果；同键却传不同参数，会被判为错误。<Cite id="idempotency-key" /></p>
      <p>这个本地实验把预约与键保存在右侧账本。第一次创建后故意丢失响应。继续用 A 提交、把时间换掉，或改用新键 B，看看预约数量和回执怎样变化。</p>
      <IdempotencyLesson />
      <p>同键同参数返回 #42，不新增预约。换成 B 表示另一份创建意图，即使时段一样，也会得到 #43。<strong>幂等去重与“同一时段能不能订两次”是两条业务规则。</strong>本例允许重复时段，用来单独观察幂等键的作用。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="键的范围与期限" className={base.offset}>
      <p>键要跟随业务意图保存，不能每次重发都重新生成，也不能让不同意图共用同一个键。设计接口时还要写清：在哪个调用方和操作范围内识别这个键，重启后记录是否仍在，多久之后不再保证去重。</p>
      <p id="idempotency-retention" className="vp-citation-target">Stripe 的记录在至少 24 小时后可以清理；清理后再用旧键会产生新请求。它还可能复用失败结果，包括 500。<strong>“继续用同一个键”不保证这次会成功。</strong>这些是 Stripe 的具体约定，不是所有服务共有的固定期限或错误策略。<Cite id="idempotency-retention" /></p>
      <p id="idempotency-response" className="vp-citation-target">幂等也不要求每次响应字节完全相同。例如重复删除同一个资源，只要没有重复增加预期业务效果，后一次响应可以和前一次不同。不能只比较响应文本来判定是否幂等。<Cite id="idempotency-response" /></p>
    </ArticleSection>
    <ArticleSection id="concurrency" title="请求同时到达时">
      <Legacy slug="idempotency" names={["quiz-heading", "prompt-heading"]} />
      <p>实验按顺序处理请求，真实服务可能同时收到两份 A。如果它们都先查到“没有记录”，再分别创建预约，就仍会重复。记录占位、业务写入与结果保存需要协调，不能只在成功之后补一行键。</p>
      <ArticleAside title="幂等与事务的分工"><p><ConceptTerm slug="transaction">事务</ConceptTerm>可以帮助一组数据库操作一起提交或回滚；幂等性回答的是重复调用的业务效果。如果操作还跨越外部服务，一次本地数据库事务不能包住所有效果，需要再约定各段的身份、失败恢复与查询方式。本例没有模拟并发、崩溃或跨服务事务，不把顺序去重当作生产实现。</p></ArticleAside>
      <p>回到最初的超时：有稳定的键和明确的服务约定，调用方才知道怎样重发；有可查询的业务状态，调用方才有办法核实未收到的结果。<ConceptTerm slug="retry">重试</ConceptTerm>负责再次尝试，幂等性使重复尝试不额外累积约定的业务效果。</p>
    </ArticleSection>
  </ConceptArticle>;
}
