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
    intro={<>提交阅览室预约后，页面等待两秒便显示超时。此时只能确定客户端没有及时收到结果，预约是否已经建立还要另行核对。</>}
    hero={<ConceptHero slug="timeout" label="客户端在2秒停止等待，服务端在3秒完成预约"><div className={s.timeoutHero}><Clock size={28} weight="light" /><div><span>等待</span><i /><b>2 s</b></div><div><span>执行</span><i /><b>3 s</b></div></div></ConceptHero>}>
    <ArticleSection id="waiting" title="等待有一个上限">
      <Legacy slug="timeout" names={["question", "definition"]} />
      <p id="timeout-wait" className="vp-citation-target"><strong>超时为一段等待设置上限。</strong>到达上限还没得到所需结果，调用方就停止这次等待，转入失败处理。它能限制等待占用的资源，但不能证明远端没有产生业务效果。AWS 的工程文章专门提醒了这个边界。<Cite id="timeout-wait" /></p>
      <p>这里至少有两件事：服务端有没有建立预约，客户端有没有收到确认。它们之间隔着网络。确认可能晚到，也可能丢失；服务端完成操作的时刻，并不等于客户端知道结果的时刻。</p>
    </ArticleSection>
    <ArticleSection id="clocks" title="客户端与服务端的时间">
      <Legacy slug="timeout" names={["scene-heading"]} />
      <p>在这个本地样例中，服务第 3 秒建立预约，响应第 4 秒到达。选择等待上限，再推进时间，看看哪一侧先停下来。图里展示了两端的状态；实际客户端看不到服务端内部进度。</p>
      <TimeoutLesson />
      <p>上限为 2 秒时，客户端先超时，服务端随后仍建立 #42 预约。第 4 秒到达的原响应，不会把已经结束的那次等待改成成功。需要另一次状态查询，客户端才能确认结果。上限改成 5 秒，则在第 4 秒正常收到确认。</p>
      <div className={s.pullQuote}><strong>“没有等到”是确定的。<br />“没有完成”还需要证据。</strong></div>
      <p>所以写操作超时后，界面可以先显示“结果待确认”，再用业务编号查询，或按接口约定使用同一个幂等键重试。直接当作失败再创建一次，可能得到两条预约。<ConceptTerm slug="idempotency">幂等性</ConceptTerm>处理的就是重复到达时的业务效果。</p>
    </ArticleSection>
    <ArticleSection id="deadline" title="给等待分配时间" className={base.offset}>
      <Legacy slug="timeout" names={["quiz-heading", "prompt-heading"]} />
      <p id="timeout-budget" className="vp-citation-target">配置之前，先确认计时覆盖哪里：建立连接、等待读取，还是整个调用。DNS、TLS 等步骤未必都包含在某个超时选项里。设置过短会把正常的慢请求误判为失败，过长又会拖住资源；应结合实际延迟和调用方可等待的时间来定。<Cite id="timeout-budget" /></p>
      <div className={s.budget}><div><strong>一次尝试</strong><p>给每个请求留多少等待时间。</p></div><div><strong>整个任务</strong><p>把多次尝试、间隔和处理时间一起算进去。</p></div></div>
      <p>例如整个查询只允许等待 5 秒，不能让三次尝试各等 5 秒，再额外加上退避。剩余预算不够时，应停止继续尝试。具体数值需要业务决定，这里的秒数只是为了看清时序。</p>
      <ArticleAside title="浏览器端中止等待">
        <p id="timeout-browser" className="vp-citation-target"><ConceptTerm slug="fetch-api">Fetch API</ConceptTerm> 可以接收 <code>AbortSignal.timeout(2000)</code>。信号到期后以 TimeoutError 中止；这里按活跃时间计时，文档进入往返缓存等情况下会暂停，不能直接当作始终前进的墙上时钟。<Cite id="timeout-browser" /></p>
        <pre className={base.code}>{'await fetch("/reservations/42", {\n  signal: AbortSignal.timeout(2000)\n});'}</pre>
        <p>这段代码控制浏览器端的请求等待。服务端若需要停止工作，还得有相应的取消协议和检查点；已经提交的业务操作不会因为浏览器中止就自动撤销。</p>
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
