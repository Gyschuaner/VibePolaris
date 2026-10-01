import { FileText, ShieldCheck, Archive, EnvelopeSimple, Database } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { PipelineLesson, WebhookLesson, DistributedLesson } from './CoordinationConceptLessons';
import { pipelineSources, webhookSources, distributedSources } from '@/lib/coordination-sources';
import base from './EventConcepts.module.css';
import s from './CoordinationConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function PipelineTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={pipelineSources}/>;
  return <ConceptArticle slug="data-pipeline" title="数据管道" sources={pipelineSources} sections={[["work", "把数据处理组织起来"], ["depends", "前置成功，后续才能开始"], ["replay", "重跑同一份输入"], ["trace", "留下结果的来路"]]}
    intro={<>图书馆每天收到一批借阅记录，先把这批输入固定成快照 s1，后面重跑时仍读取这份快照；读入后分成校验和原始归档两路，再汇总借阅次数，最后更新报表。按计划触发的一整轮处理称作一次运行；调度时间、数据范围和实际开始时间可以不同。数据管道把这些步骤连接起来，让每一步拿到约定的输入，也让结果能够追溯到这次运行。</>}
    hero={<ConceptHero slug="data-pipeline" label="输入分成校验与原始归档两路，两项前置成功后发布报表"><div className={s.pipeHero}><div className={s.pipeInput}><FileText size={25}/><span>借阅快照 s1</span></div><div className={s.pipeBranch}><div><ShieldCheck size={29}/><span>校验 → 汇总</span></div><div><Archive size={29}/><span>原始归档</span></div></div><div className={s.pipeOutput}>两路完成 → 发布报表</div></div></ConceptHero>}>
    <ArticleSection id="work" title="把数据处理组织起来"><Legacy slug="data-pipeline" names={["question", "definition"]}/>
      <p id="pipeline-workflow" className="vp-citation-target"><strong>数据管道把读取、处理与输出连接成一套可运行的数据流程。</strong>它既要描述各步怎样交接，也要记录这一轮真正执行到了哪里。实际系统会用编排工具把这些约定变成可运行的任务，例如 AWS Glue 或 Airflow；数据管道不依赖某一个产品。以 AWS Glue 为例，一个 workflow 可以组合 jobs、crawlers 和 triggers，触发方式可以是计划、手动或事件；静态视图表示设计，动态视图表示某次运行的状态与错误。设计好的流程是计划，已经成功的一次运行是实际结果，两者需要分开看。<Cite id="pipeline-workflow"/></p>
      <p>管道可以处理固定范围的一批数据，也可以持续接收记录；本页只用固定批次的每日借阅报表解释依赖。读取与业务校验是不同职责，归档原始输入只保证原始材料还在，不能说明统计已经正确。<strong>先约定每一步的输入、输出和成功条件，再连接任务。</strong></p>
    </ArticleSection>
    <ArticleSection id="depends" title="前置成功，后续才能开始"><Legacy slug="data-pipeline" names={["scene-heading"]}/>
      <p id="pipeline-dependencies" className="vp-citation-target">Airflow 的 Dag 可以理解为一份工作流计划：它声明任务、调度、依赖和重试等运行信息，任务内部做什么仍由各自代码负责。默认的 `all_success` 启动规则要求后续任务的所有直接前置任务都成功；Airflow 也支持其他 trigger rule，本例不采用这些例外。<strong>依赖不是一条装饰性的箭头，它决定什么时候允许启动后续工作。</strong><Cite id="pipeline-dependencies"/></p>
      <p>本例的校验和归档都只需要读取数据，互不依赖，因此校验失败不妨碍归档；归档能推进来自独立的依赖关系，不是因为放宽了启动规则。汇总必须等校验通过，否则不完整记录被算进统计，出来的数字就说不清代表了什么。发布必须等汇总和归档都完成：汇总说明数字算完了，归档保证本次使用的原始材料还在，结果可以追溯。快照 s1 有四条记录，其中 r2 缺少书目编号。本例先用严格的校验规则 q1：一条不合格就让整批校验失败；再切换到 q2，把问题记录标记为隔离，重新校验通过后再进入汇总。q1 和 q2 是本例的两套规则标识。隔离区不是另一份数据，只是给原始记录打上“暂不参与统计”的标记；归档仍保留 s1 的四条原始记录。本实验只把归档分支标记为完成，不实际写入磁盘；真实系统的归档才会把原始材料保存到持久存储。</p>
      <PipelineLesson/>
      <p>隔离改变的是本次处理规则，从严格的 q1 改为允许隔离的 q2，<strong>没有编造缺失的编号</strong>。这次运行的结果要说明有三条参与汇总、一条被隔离；报表更新前，报表使用者看到的仍是上一版 v0。这里的 v0 是页面预置的上一版基线，只用于对照发布前后，不代表本页定义了历史累计的统计口径。</p>
      <pre className={base.code}>{'# 假定下面五个 Airflow 任务已定义\nread >> [validate, archive]\nvalidate >> aggregate\n[aggregate, archive] >> publish'}</pre>
      <p>这段代码只是用符号声明任务的先后顺序：<code>read &gt;&gt; [validate, archive]</code> 表示读取完成后，校验和归档可以分别开始；<code>[aggregate, archive] &gt;&gt; publish</code> 表示发布要等汇总和归档都完成。<code>read</code>、<code>validate</code>、<code>archive</code>、<code>aggregate</code>、<code>publish</code> 分别对应读取、校验、归档、汇总和发布。它不是本页要运行的程序；校验失败怎样处理、隔离数据怎样复核、输出何时可用，都要由任务自己的代码和运行规则来决定。</p>
      <p>这个实验把报表当作本次运行的产物：发布后用新结果替换页面预置的 v0，方便看出本次汇总发生了什么；真实系统要不要把新结果累加到历史报表，取决于产品如何定义统计范围，不能从这个演示的固定做法直接推出。发布结果中的 <code>run-42 · s1 / q2</code> 把本次运行、输入快照和校验规则放在一起，后面的来源关系会继续解释它们。</p>
      <p>实验里的“隔离缺失编号并重验”只展示在当前页面把 q1 切换到 q2；因为 q1 还没有发布结果，这仍是同一次未发布运行内的重验。“重置本次运行”只清除浏览器里的演示状态。真实系统如果旧规则已经产出并发布过结果，再按 q2 全量重算，就要保留原始快照、重新执行受影响的步骤，并把这次重算记为一次新的运行。</p>
    </ArticleSection>
    <ArticleSection id="replay" title="重跑同一份输入"><Legacy slug="data-pipeline" names={["quiz-heading"]}/>
      <p id="pipeline-interval" className="vp-citation-target">Airflow 里每次运行（DagRun）都有自己的数据区间。数据区间就是这次要处理的范围，例如某一天的借阅记录；逻辑日期通常标记这个区间的起点，和作业实际开始的时刻不是一回事。即使任务晚些启动，按固定分区读取的仍是同一个数据区间，不会因为启动晚就改读最新的一天。<strong>“今天重跑”必须说清是在补哪一天的数据，而不能默认读取此刻最新的数据。</strong><Cite id="pipeline-interval"/></p>
      <p id="pipeline-replay" className="vp-citation-target">Airflow 官方文档把任务当作数据库事务来提醒：任务结束时不要留下不完整输出，重试后应得到相同结果。读取与写入都绑定固定分区（例如某一天的数据块），不要在任务里每次读取“最新可用”数据；写入端还要考虑重复执行，文档以 UPSERT 代替 INSERT 说明怎样避免重试追加重复行。本例用记录编号作为稳定键来表达同一条借阅记录，现实系统还要由存储层定义更新语义。<strong>框架替你重新启动任务，不会自动替业务消除重复数据。</strong><Cite id="pipeline-replay"/></p>
      <ArticleAside title="失败以后，不必每一步都从头来"><p>原始快照 s1 没变，已完成的归档可以保留。校验规则改为 q2 后，应重新校验；汇总依赖校验结果，所以也要跟着重算；再把这次完整重算记为一次新的运行，发布时使用它自己的运行标识。演示里的 run-42 是一个写死的固定标识；现实系统要让新旧两次运行的记录分开。还要核对已保存的中间输出是否完整、版本是否匹配；例如真实系统里某份按旧规则生成的历史汇总即使显示成功，换成 q2 后规则版本已经对不上，也不能直接拿来用。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="trace" title="留下结果的来路" className={base.offset}><Legacy slug="data-pipeline" names={["prompt-heading"]}/>
      <p id="pipeline-provenance" className="vp-citation-target">W3C 的 PROV-DM 用实体、活动与参与者（负责活动的人或系统）描述来源关系，例如活动使用了哪份实体、哪份输出由该活动产生。借阅快照、校验活动、隔离结果与报表版本可以沿这样的关系记录；它补充“这次运行使用了什么、生成了什么”的来源说明。<strong>来源模型帮助说明结果怎样产生，本身不执行任务，也不能证明数据一定正确。</strong><Cite id="pipeline-provenance"/></p>
      <div className={base.contrast}><div><h3>执行记录</h3><p>run-42 哪一步成功、哪一步失败？发布的两个前置任务是否完成？用于判断这次运行是否结束。记录会保留 q1 的失败和 q2 的重验，最终发布使用通过的 q2。</p></div><div><h3>来源关系</h3><p>报表使用快照 s1 和规则 q2，三条有效、一条隔离。用于解释这个结果来自哪里，以及重算应读取什么。</p></div></div>
      <p>一条管道的设计要交代输入版本、校验规则、任务依赖、报表何时可以替换旧版本和失败恢复方式。恢复时据此判断哪些任务可以继续、哪些必须重算，并识别同一批数据的重复写入。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function WebhookTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={webhookSources}/>;
  return <ConceptArticle slug="webhook" title="Webhook" subtitle="事件通知" sources={webhookSources} sections={[["notification", "让事件主动通知你的服务"], ["verify", "先判断通知是否可信"], ["accept", "确认受理与后台处理"], ["recover", "重复、乱序与重新交付"]]}
    intro={<>外部平台完成了一笔支付，可以向你登记的接收地址发送 HTTP 通知。这样你的服务就不必不停询问支付结果。但这个接收地址通常公开可访问，任何人都可能向它发请求，所以你的服务要判断通知是否可信、怎样确认受理，以及重复或失败的通知如何处理。</>}
    hero={<ConceptHero slug="webhook" label="通知通过验证后先确认受理，后台继续处理订单"><div className={s.webHero}><div className={s.heroLetter}><EnvelopeSimple size={26}/><code>evt-42</code><ShieldCheck size={24}/></div><div className={s.heroAck}>← 2xx · 已受理</div><div className={s.heroOrder}><span>后台工作</span><strong>更新订单状态</strong></div></div></ConceptHero>}>
    <ArticleSection id="notification" title="让事件主动通知你的服务"><Legacy slug="webhook" names={["question", "definition"]}/>
      <p id="webhook-notify" className="vp-citation-target"><strong>Webhook 是事件发生后，由平台向预先登记的接收地址发送 HTTP 请求的通知方式。</strong>这里的“事件”是对已发生事情的一条带类型和标识的通知记录；平台每发送一次这样的通知，就形成一次投递。Stripe 用它通知支付确认、订阅变更等异步事件，也允许端点只订阅需要的事件类型；“异步”就是先通知，不等你的服务当场完成后续工作。平台是这次请求的发送者，你的服务是接收者；这份请求由平台服务器发出，与用户是否打开过你的页面无关。接收地址通常公开可访问，正式服务一般使用 HTTPS；HTTPS 负责保护传输，不能替代事件验签，也不能阻止知道地址的人自己发请求。<Cite id="webhook-notify"/></p>
      <div className={base.contrast}><div><h3>主动查询</h3><p>你的服务带自己的凭证请求平台：“这笔订单现在是什么状态？”请求频率和补查由你安排。</p></div><div><h3>Webhook 通知</h3><p>平台向你登记的地址发送事件。接收服务要处理来源验证、投递失败和业务更新。</p></div></div>
      <p>收到 HTTP 请求只说明有一份数据到了入口；接收地址本身不是信任凭证。是否能信任它、是否已经可靠接收、是否已经更新订单，都需要各自的证据。</p>
    </ArticleSection>
    <ArticleSection id="verify" title="先判断通知是否可信"><Legacy slug="webhook" names={["quiz-heading"]}/>
      <p id="webhook-signature" className="vp-citation-target">一份 HTTP 请求有请求头和请求体：请求头携带签名等附加信息，请求体承载事件内容。“验签”就是用收到的内容重新计算并核对签名。Stripe 的验签需要原始请求体、签名头和对应端点（平台后台登记接收地址时生成的一条记录）的密钥。签名是平台用请求体、时间戳和双方共享的密钥算出的值，时间戳和签名一起放在签名头里，接收方用同一密钥对收到的原始请求体和时间戳重新计算出签名，再与签名头里的签名比对；没有密钥的人难以伪造正确签名，改动请求体或时间戳也会让结果对不上。这把密钥在你登记端点时由平台生成，你需要把它安全地放进服务配置；如果用 Stripe CLI 转发本地事件，CLI 输出的 `whsec_` 密钥与后台端点的密钥不是同一把，不能混用。多数 Web 框架会先自动解析请求体，等你重新序列化 JSON 时，空格、字段顺序或编码可能已经改变，所以验签要使用平台发来的原始请求体。时间戳还用于限制有效期，降低请求被截获后长期重新提交的风险。下面用 Stripe 的做法说明验签；其他平台可能使用不同的认证机制，生产实现应使用平台提供的方法，并按其要求检查有效期等条件。<strong>请求体里写了“支付成功”，不能代替验证发送来源与内容完整性。</strong><Cite id="webhook-signature"/></p>
      <p>下面把“有效”和“被改写”的验证结果预先设好，以便观察后续流程。evt-42、order.paid 和 order-42 都是本站固定教学数据，不是真实平台事件，也没有实际密码学验签、网络请求或队列；文字与按钮只模拟这些结果。</p>
    </ArticleSection>
    <ArticleSection id="accept" title="确认受理与后台处理"><Legacy slug="webhook" names={["scene-heading"]}/>
      <p id="webhook-accept" className="vp-citation-target">GitHub 建议接收端在 10 秒内返回 2xx；这是 GitHub 的规则，其他平台的时限可能不同。2xx 是表示请求成功的一类 HTTP 状态码；在 Webhook 场景里，发送方把它当作本次投递成功的依据。订单和数据库操作可能更慢，所以应把耗时工作放入队列（先保存、等待后台取走的待处理项）异步处理。收到通知还要检查事件的种类和具体操作，只处理自己关心的部分。<strong>快速确认是通知投递的反馈，不能当作业务已经全部完成。</strong>实际设计应先把可信通知可靠写入受理记录（例如队列中的一项），再快速返回 2xx；Stripe 也要求在复杂业务逻辑可能超时前先返回成功状态。若先返回 2xx、再写受理记录，进程在两步之间崩溃时，发送方已经看到成功，通知却可能丢失。按“先写入、后返回 2xx”的顺序，最坏只是确认响应丢失；以 Stripe 为例，后续重试仍带着同一个事件 ID，接收方可以据此识别同一事件，其他平台应按自己的事件或投递标识处理。<Cite id="webhook-accept"/></p>
      <WebhookLesson/>
      <p>演示先投递被改写的通知：它因为签名对不上而被拒绝，受理记录与订单都不改变。重置后再走有效通知路径，依次投递、验证、受理、后台处理，发送方看到 2xx，订单更新一次。再次重置并勾选“让本次响应丢失”后受理：第一次已经写入受理记录，只是受理确认（也就是那条 2xx 响应）没有送达；发送方可能按平台的重试或重新交付规则再次发来，同一个 evt-42 仍只保留一份受理记录，不重复受理。这里的按钮分别演示投递、验签、受理、后台处理和重复投递；乱序与后台处理失败只在正文说明，不做演示。清空通知与受理记录只重置浏览器里的演示状态，不代表真实订单回滚。</p>
    </ArticleSection>
    <ArticleSection id="recover" title="重复、乱序与重新交付" className={base.offset}><Legacy slug="webhook" names={["prompt-heading"]}/>
      <p id="webhook-duplicate" className="vp-citation-target">Stripe 提醒同一事件可能重复投递，建议记录事件 ID：它标识一个事件，用于把同一事件的重复投递识别出来；Stripe 也提醒，有时会生成两个不同的事件对象，需要结合对象 ID（事件所描述的业务对象编号）与事件类型识别这类重复。比如两条事件 ID 不同，但都在报告同一笔支付成功；此时要再核对支付编号和事件类型，而不能仅凭事件 ID 就处理两遍。重试时签名和时间戳是否改变由平台规则决定；如果平台没有提供事件 ID，不要把“签名相同”当作判断“同一个事件”的通用依据。<strong>要分别保护同一个事件不重复受理、受理记录不重复写入和业务操作不重复执行。</strong><Cite id="webhook-duplicate"/></p>
      <p id="webhook-redelivery" className="vp-citation-target">GitHub 对已判定失败的投递不会自动重新交付，可以从投递记录手动重新交付，或用脚本安排重新交付；服务器恢复后漏掉的投递，也要由接收方查询 GitHub 侧的投递记录，再按 GitHub 提供的入口触发补交。这里的“补交”也是人工或脚本触发的重新交付。Stripe 会在有限时间内自动重试失败通知，也允许手动重发。这里的“重试”指平台自动再发，“重新交付”或“重发”指人工或脚本触发；正文说的“一次投递”指一次发送动作，平台记录是否新增条目仍以自己的文档为准。<strong>Webhook 本身不承诺一套统一的重试策略，要核对所用平台的时限、次数和重新交付规则。</strong><Cite id="webhook-redelivery"/></p>
      <p id="webhook-order" className="vp-citation-target">先到的未必是先发生的。比如“已取消”的通知先到、“已创建”的通知后到；如果只按收到的先后覆盖状态，订单可能停在错误状态。必要时查询平台对象的最新状态，或按业务版本规则处理更新；事件中的时间戳不能单独解决所有顺序问题。对 GitHub 而言，<code>X-GitHub-Delivery</code> 用来定位一次投递及其重投，重投时这个 ID 保持不变；接收方可以识别这是原通知的再次投递，但它不能直接代替订单或支付的编号来识别业务对象。<Cite id="webhook-order"/></p>
      <ArticleAside title="投递成功以后，后台仍可能失败"><p>接收端已经返回 2xx，随后后台任务更新订单失败，发送平台未必知道。受理记录需要保留处理状态，后台失败要有自己的补救机制并告警。发送方没收到确认而重新投递，是一条路；受理之后的后台任务失败、自己恢复，是另一条路，两者不能混在一起处理。</p></ArticleAside>
      <p>接入 Webhook 先核对平台文档、订阅事件、原始请求体验签要求、2xx 响应时限与重新交付规则。验签失败、重复或乱序事件、后台失败和确认丢失都要有明确处理；收到 JSON 只是请求到达，不能直接认定订单状态已改变。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function DistributedTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={distributedSources}/>;
  return <ConceptArticle slug="distributed-system" title="分布式系统" sources={distributedSources} sections={[["nodes", "多处执行，通过消息协作"], ["observe", "同一次请求，两端所见不同"], ["timeout", "超时以后，执行结果仍需核对"], ["ordering", "顺序与重试需要共同约定"]]}
    intro={<>读者在借阅服务点击借书。借阅服务把带有操作 ID <code>reserve-42</code> 的请求发给库存服务，请它扣掉一本书。两处服务通过网络传消息；库存服务可能已经扣减，确认却没回来，借阅服务只看到超时。分布式系统让不同进程协作，也使延迟、局部故障和信息不完整成为日常设计问题。</>}
    hero={<ConceptHero slug="distributed-system" label="B 已扣减一本库存，确认未送达，A 看到的仍是执行结果未知"><div className={s.distributedHero}><div><span>A · 借阅服务</span><EnvelopeSimple size={27}/><strong>未知</strong><code>确认未到达</code></div><div><span>B · 库存服务</span><Database size={27}/><strong className={s.heroStock}>5 → 4</strong><code>已执行 reserve-42</code></div></div></ConceptHero>}>
    <ArticleSection id="nodes" title="多处执行，通过消息协作"><Legacy slug="distributed-system" names={["question", "definition"]}/>
      <p id="distributed-definition" className="vp-citation-target"><strong>分布式系统把任务交给多个独立运行的程序或服务，它们通过网络消息协作；这里把每一方叫作一个节点。</strong>Lamport 的经典论文把分布式进程中的事件顺序建立在进程内顺序和消息发送、接收关系上。消息需要传输，各节点不能瞬间知道其他节点刚发生了什么；即使多个进程在同一台机器上，只要它们独立运行并靠消息协作，也会遇到类似的信息延迟。<Cite id="distributed-definition"/></p>
      <p>借阅服务处理读者请求，库存服务保管可借数量。职责分开后可以独立运行，但 A 对 B 的了解来自已经收到的消息。<strong>“有多台机器”还不是设计的全部，关键是它们如何协作，以及失去联系时怎样判断和恢复。</strong></p>
    </ArticleSection>
    <ArticleSection id="observe" title="同一次请求，两端所见不同"><Legacy slug="distributed-system" names={["scene-heading"]}/>
      <p id="distributed-failure" className="vp-citation-target">一次跨网络请求至少要经过八个动作：A 把请求交给网络，网络送到 B，B 校验请求并修改自己的状态，B 把响应交给网络，网络把响应送回 A，A 再校验响应并更新自己的记录。AWS Builders’ Library 将这些阶段分开讨论，因为客户端、服务器和网络可以独立失败。请求没到与响应丢失，都可以表现为调用端超时。<strong>调用端此时知道的是“没有在期限内收到确认”，执行结果仍然未知。</strong><Cite id="distributed-failure"/></p>
      <p>先看 B 执行后响应丢失，再切到请求在途中丢失。两次 A 都超时，B 的库存却分别为 4 与 5。本例手动推进两个固定故障，恢复后按已经说明的操作 ID 核对与重试；没有真实网络、共识协议或跨服务事务。</p>
      <DistributedLesson/>
      <p>左右两列展示各端实际记录，读者能同时看到，A 却不能凭空读取右边的状态。查询或重新得到确认以后，A 才能更新判断。这种局部信息差，正是演示要保留下来的部分。</p>
    </ArticleSection>
    <ArticleSection id="timeout" title="超时以后，执行结果仍需核对"><Legacy slug="distributed-system" names={["quiz-heading"]}/>
      <p id="distributed-timeout" className="vp-citation-target">超时限制调用方等待与占用资源的时间；AWS 的重试讨论特别指出，失败或超时不代表副作用没有发生。<strong>A 停止等待，不会自动撤销 B 已经执行的库存扣减。</strong>取消执行需要单独的协议与处理，不能由一个本地计时器推断出来。<Cite id="distributed-timeout"/></p>
      <p id="distributed-reconcile" className="vp-citation-target">这种“同一个操作重复请求，结果不新增副作用”的约定常称为幂等。AWS 的幂等 API 设计使用调用方提供的请求标识，识别重试并返回已有操作结果。标识记录与业务修改必须一起可靠提交；同一标识换了参数，也需要拒绝或明确处理。<strong>核对 <code>reserve-42</code>，或带原标识重试，可以恢复对同一次操作的判断，而不是重新扣一本书。</strong><Cite id="distributed-reconcile"/></p>
      <div className={base.contrast}><div><h3>查询原操作</h3><p>查 reserve-42 的记录。本例直接查 B 的确定记录；实际系统要核对查询一致性与仍在执行的工作，不能把一次“未查到”普遍当作永远不会执行。</p></div><div><h3>重试原操作</h3><p>保留操作 ID 与参数。B 识别已有记录后返回结果。换一个 ID 或缺少可靠去重，可能使相同意图被执行两次。</p></div></div>
    </ArticleSection>
    <ArticleSection id="ordering" title="顺序与重试需要共同约定" className={base.offset}><Legacy slug="distributed-system" names={["prompt-heading"]}/>
      <p id="distributed-order" className="vp-citation-target">Lamport 用“先发生”关系描述因果：同一进程内的先后、发送在接收之前，以及这些关系的传递。没有这种关系的事件可以并发。<strong>仅比较两台机器上的时间戳，不能单独证明业务的因果关系。</strong>逻辑时钟是节点内部递增的计数，用来保持这类先后关系；它不是共享的墙上时间，也不能自行代替库存事务或幂等保护。<Cite id="distributed-order"/></p>
      <ArticleAside title="恢复通信，也要限制重试规模"><p id="distributed-budget" className="vp-citation-target">AWS 提醒重试可能加重过载，多层同时重试会放大请求量；退避、次数限制和抖动用于减少集中的重复请求。它们控制尝试节奏，却不替代副作用的幂等设计。先明确可以重试什么，再决定重试多少次与等待多久。<Cite id="distributed-budget"/></p></ArticleAside>
      <p>拆分服务前，先确定谁保管权威状态、请求和响应里的业务数据、操作 ID，以及超时后的核对方法。区分“未收到确认”“远端未执行”与“确认已执行”，再讨论 <ConceptTerm slug="microservices">微服务</ConceptTerm> 或其他部署方式。</p>
    </ArticleSection>
  </ConceptArticle>;
}
