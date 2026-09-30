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
    intro={<>图书馆每天收到一批借阅记录，先把这批输入固定成快照 s1，后面重跑时仍读取这份快照；读入后分成校验和原始归档两路，再汇总借阅次数，最后更新报表。从读入到发布的这一轮处理，称作一次运行。数据管道把这些步骤连接起来，让每一步拿到约定的输入，也让结果能够追溯到这次运行。</>}
    hero={<ConceptHero slug="data-pipeline" label="输入分成校验与原始归档两路，两项前置成功后发布报表"><div className={s.pipeHero}><div className={s.pipeInput}><FileText size={25}/><span>借阅快照 s1</span></div><div className={s.pipeBranch}><div><ShieldCheck size={29}/><span>校验 → 汇总</span></div><div><Archive size={29}/><span>原始归档</span></div></div><div className={s.pipeOutput}>两路完成 → 发布报表</div></div></ConceptHero>}>
    <ArticleSection id="work" title="把数据处理组织起来"><Legacy slug="data-pipeline" names={["question", "definition"]}/>
      <p id="pipeline-workflow" className="vp-citation-target"><strong>数据管道把读取、处理与输出连接成一套可运行的数据流程。</strong>它既要描述各步怎样交接，也要记录这一轮真正执行到了哪里。实际系统会用编排工具把这些约定变成可运行的任务，例如 AWS Glue 或 Airflow；数据管道不依赖某一个产品。以 AWS Glue 为例，它把处理任务、数据发现任务和触发条件放进一个 workflow，运行视图里能看到每个任务的状态与错误。设计好的流程是计划，已经成功的一次运行是实际结果，两者需要分开看。<Cite id="pipeline-workflow"/></p>
      <p>管道可以处理固定范围的一批数据，也可以持续接收记录；本页只用固定批次的每日借阅报表解释依赖。读取与业务校验是不同职责，归档原始输入只保证原始材料还在，不能说明统计已经正确。<strong>先约定每一步的输入、输出和成功条件，再连接任务。</strong></p>
    </ArticleSection>
    <ArticleSection id="depends" title="前置成功，后续才能开始"><Legacy slug="data-pipeline" names={["scene-heading"]}/>
      <p id="pipeline-dependencies" className="vp-citation-target">Airflow 的 Dag（把任务和先后关系写成的一张图）描述任务及其依赖；任务内部做什么，仍由各自的代码负责。默认启动规则，也就是判断后续任务能否启动的条件，要求后续任务的所有直接前置任务都成功。工具还可以配置其他启动规则，但本例不采用这些例外。<strong>依赖不是一条装饰性的箭头，它决定什么时候允许启动后续工作。</strong><Cite id="pipeline-dependencies"/></p>
      <p>本例的校验和归档都只需要读取数据，互不依赖，因此校验失败不妨碍归档；归档能推进来自独立的依赖关系，不是因为放宽了启动规则。汇总必须等校验通过，否则不完整记录被算进统计，出来的数字就说不清代表了什么。发布必须等汇总和归档都完成：汇总说明数字算完了，归档保证本次使用的原始材料还在，结果可以追溯。快照 s1 有四条记录，其中 r2 缺少书目编号。本例先用严格的校验规则 q1：一条不合格就让整批校验失败；再切换到 q2，把问题记录标记为隔离，重新校验通过后再进入汇总。q1 和 q2 是本例的两套规则标识。隔离区不是另一份数据，只是给原始记录打上“暂不参与统计”的标记；归档仍保留 s1 的四条原始记录。本实验只把归档分支标记为完成，不实际写入磁盘；真实系统的归档才会把原始材料保存到持久存储。</p>
      <PipelineLesson/>
      <p>隔离改变的是本次处理规则，从严格的 q1 改为允许隔离的 q2，<strong>没有编造缺失的编号</strong>。这次运行的结果要说明有三条参与汇总、一条被隔离；报表更新前，报表使用者看到的仍是上一版 v0。这里的 v0 是页面预置的上一版基线，只用于对照发布前后，不代表本页定义了历史累计的统计口径。</p>
      <pre className={base.code}>{'# 假定下面五个 Airflow 任务已定义\nread >> [validate, archive]\nvalidate >> aggregate\n[aggregate, archive] >> publish'}</pre>
      <p>这段代码只是用符号声明任务的先后顺序：<code>read &gt;&gt; [validate, archive]</code> 表示读取完成后，校验和归档可以分别开始；<code>[aggregate, archive] &gt;&gt; publish</code> 表示发布要等汇总和归档都完成。<code>read</code>、<code>validate</code>、<code>archive</code>、<code>aggregate</code>、<code>publish</code> 分别对应读取、校验、归档、汇总和发布。它不是本页要运行的程序；校验失败怎样处理、隔离数据怎样复核、输出何时可用，都要由任务自己的代码和运行规则来决定。</p>
      <p>这个实验把报表当作本次运行的产物：发布后用新结果替换页面预置的 v0，方便看出本次汇总发生了什么；真实系统要不要把新结果累加到历史报表，取决于产品如何定义统计范围，不能从这个演示的固定做法直接推出。发布结果中的 <code>run-42 · s1 / q2</code> 把本次运行、输入快照和校验规则放在一起，后面的来源关系会继续解释它们。</p>
      <p>实验里的“隔离缺失编号并重验”只展示在当前页面把 q1 切换到 q2；因为 q1 还没有发布结果，这仍是同一次未发布运行内的重验。“重置本次运行”只清除浏览器里的演示状态。真实系统如果旧规则已经产出并发布过结果，再按 q2 全量重算，就要保留原始快照、重新执行受影响的步骤，并把这次重算记为一次新的运行。</p>
    </ArticleSection>
    <ArticleSection id="replay" title="重跑同一份输入"><Legacy slug="data-pipeline" names={["quiz-heading"]}/>
      <p id="pipeline-interval" className="vp-citation-target">Airflow 里每次运行（DagRun）都有自己的数据区间。数据区间就是这次要处理的范围，例如某一天的借阅记录；逻辑日期代表这个数据区间的起点，不一定是作业实际开始的时刻。即使任务晚些启动，读取的仍是同一个数据区间，不会因为启动晚就改读最新的一天。<strong>“今天重跑”必须说清是在补哪一天的数据，而不能默认读取此刻最新的数据。</strong><Cite id="pipeline-interval"/></p>
      <p id="pipeline-replay" className="vp-citation-target">Airflow 官方文档中的最佳实践建议：任务失败时不要留下不完整的输出，多次重试也要得到同样的结果；读取与写入都绑定固定分区（例如某一天的数据块），这样更容易复现同一次计算；如果每次都取当前最新数据，就不容易做到。写入端也要考虑重复执行：用能识别同一条记录的稳定键（例如记录自己的编号）更新原记录，而不是再次追加一行；例如同一条借阅记录重算时，稳定键让系统更新这条记录，不会再追加一条。<strong>框架替你重新启动任务，不会自动替业务消除重复数据。</strong><Cite id="pipeline-replay"/></p>
      <ArticleAside title="失败以后，不必每一步都从头来"><p>原始快照 s1 没变，已完成的归档可以保留。校验规则改为 q2 后，应重新校验；汇总依赖校验结果，所以也要跟着重算；再把这次完整重算记为一次新的运行，发布时使用它自己的运行标识。演示里的 run-42 是一个写死的固定标识；现实系统要让新旧两次运行的记录分开。还要核对已保存的中间输出是否完整、版本是否匹配；例如真实系统里某份按旧规则生成的历史汇总即使显示成功，换成 q2 后规则版本已经对不上，也不能直接拿来用。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="trace" title="留下结果的来路" className={base.offset}><Legacy slug="data-pipeline" names={["prompt-heading"]}/>
      <p id="pipeline-provenance" className="vp-citation-target">W3C 的 PROV-DM 用实体、活动与参与者（负责活动的人或系统）描述来源关系，例如活动使用了哪份实体，哪份输出由该活动产生。借阅快照、校验活动与报表版本可以沿这样的关系记录。<strong>来源模型帮助说明结果怎样产生，本身不执行任务，也不能证明数据一定正确。</strong><Cite id="pipeline-provenance"/></p>
      <div className={base.contrast}><div><h3>执行记录</h3><p>run-42 哪一步成功、哪一步失败？发布的两个前置任务是否完成？用于判断这次运行是否结束。记录会保留 q1 的失败和 q2 的重验，最终发布使用通过的 q2。</p></div><div><h3>来源关系</h3><p>报表使用快照 s1 和规则 q2，三条有效、一条隔离。用于解释这个结果来自哪里，以及重算应读取什么。</p></div></div>
      <p>一条管道的设计要交代输入版本、校验规则、任务依赖、报表何时可以替换旧版本和失败恢复方式。恢复时据此判断哪些任务可以继续、哪些必须重算，并识别同一批数据的重复写入。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function WebhookTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={webhookSources}/>;
  return <ConceptArticle slug="webhook" title="Webhook" subtitle="事件通知" sources={webhookSources} sections={[["notification", "让事件主动通知你的服务"], ["verify", "先判断通知是否可信"], ["accept", "确认受理与后台处理"], ["recover", "重复、乱序与重新交付"]]}
    intro={<>外部平台完成了一笔支付，可以主动向你的服务发送 HTTP 通知。你的服务不必不停询问支付结果，却要判断通知是否可信、怎样确认受理，以及重复或失败的通知如何处理。</>}
    hero={<ConceptHero slug="webhook" label="通知通过验证后先确认受理，订单更新在后台稍后完成"><div className={s.webHero}><div className={s.heroLetter}><EnvelopeSimple size={26}/><code>evt-42</code><ShieldCheck size={24}/></div><div className={s.heroAck}>← 2xx · 已受理</div><div className={s.heroOrder}><span>后台工作</span><strong>更新订单状态</strong></div></div></ConceptHero>}>
    <ArticleSection id="notification" title="让事件主动通知你的服务"><Legacy slug="webhook" names={["question", "definition"]}/>
      <p id="webhook-notify" className="vp-citation-target"><strong>Webhook 是事件发生后，由平台向预先登记的接收地址发送 HTTP 请求的通知方式。</strong>Stripe 用它通知支付确认、订阅变更等异步事件。平台是这次请求的发送者，你的服务是接收者；它与浏览器直接向你的服务提交操作是不同的调用路径。<Cite id="webhook-notify"/></p>
      <div className={base.contrast}><div><h3>主动查询</h3><p>你的服务请求平台：“这笔订单现在是什么状态？”请求频率和补查由你安排。</p></div><div><h3>Webhook 通知</h3><p>平台向你登记的地址发送事件。接收服务要处理来源验证、投递失败和业务更新。</p></div></div>
      <p>收到 HTTP 请求只说明有一份数据到了入口。是否能信任它、是否已经可靠接收、是否已经更新订单，都需要各自的证据。</p>
    </ArticleSection>
    <ArticleSection id="verify" title="先判断通知是否可信"><Legacy slug="webhook" names={["quiz-heading"]}/>
      <p id="webhook-signature" className="vp-citation-target">Stripe 的验签需要原始请求体、签名头和对应端点的密钥。解析后重新序列化 JSON，改变空格或字段顺序，也可能破坏验证。<strong>载荷里写了“支付成功”，不能代替验证发送来源与内容完整性。</strong>生产实现应使用平台提供的验签方法，并按其要求检查时间戳等条件。<Cite id="webhook-signature"/></p>
      <p>下面把“有效”和“被改写”的验证结果预先设定，以便观察后续流程。evt-42、order.paid 和 order-42 都是本站固定教学数据，不是真实平台事件，也没有实际密码学验签、网络请求或持久队列。</p>
    </ArticleSection>
    <ArticleSection id="accept" title="确认受理与后台处理"><Legacy slug="webhook" names={["scene-heading"]}/>
      <p id="webhook-accept" className="vp-citation-target">GitHub 建议接收端尽快返回 2xx，把耗时工作放入队列异步处理；同时检查事件类型与动作。<strong>快速确认是通知交付的反馈，不能当作业务已经全部完成。</strong>实际设计还要保证：可信的通知已经可靠进入后续处理流程，再宣告受理，避免回复成功后工作却丢失。<Cite id="webhook-accept"/></p>
      <WebhookLesson/>
      <p>先验证被改写的通知，它被拒绝，受理记录与订单都不改变。再投递有效通知，验证并受理：发送方可以看到 2xx，而订单仍未处理。让这次响应丢失后重复投递，同一个 evt-42 只保留一份受理记录，后台也只更新一次。</p>
      <p id="webhook-duplicate" className="vp-citation-target">Stripe 提醒同一事件可能重复交付，建议记录事件 ID；有时不同事件对象也描述同一业务变化，还需要结合对象 ID 与事件类型。重试的签名与时间戳可以改变，因此不能用“签名相同”代替事件去重。<strong>通知身份、接收记录和业务操作的重复保护要分别设计。</strong><Cite id="webhook-duplicate"/></p>
    </ArticleSection>
    <ArticleSection id="recover" title="重复、乱序与重新交付" className={base.offset}><Legacy slug="webhook" names={["prompt-heading"]}/>
      <p id="webhook-redelivery" className="vp-citation-target">GitHub 不会自动重新交付失败通知，可以从投递记录手动重投，或用脚本安排补交。Stripe 则为失败通知提供自动重试，并允许手动重发。<strong>Webhook 本身不承诺一套统一的重试策略，要核对所用平台的规则。</strong><Cite id="webhook-redelivery"/></p>
      <p id="webhook-order" className="vp-citation-target">Stripe 也不保证事件按生成顺序交付。不能因为“已取消”的通知先到，就认定后来收到的“已创建”应覆盖当前状态。必要时查询平台对象的最新状态，或按业务版本规则处理更新；事件中的时间戳不能单独解决所有顺序问题。<Cite id="webhook-order"/></p>
      <ArticleAside title="投递成功以后，后台仍可能失败"><p>接收端已经返回 2xx，随后后台任务更新订单失败，发送平台未必知道。受理记录需要保留处理状态，后台失败要有重试与告警。入口确认丢失导致的重新投递，与已受理工作的失败恢复，是两条不同路径。</p></ArticleAside>
      <p>接入 Webhook 先核对平台文档、订阅事件、原始请求体验签要求、确认时限与补交规则。验签失败、重复或乱序事件、后台失败和确认丢失都要有明确处理；收到 JSON 只是入口，不能直接认定订单状态已改变。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function DistributedTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={distributedSources}/>;
  return <ConceptArticle slug="distributed-system" title="分布式系统" sources={distributedSources} sections={[["nodes", "多处执行，通过消息协作"], ["observe", "同一次请求，两端所见不同"], ["timeout", "超时以后，执行结果仍需核对"], ["ordering", "顺序与重试需要共同约定"]]}
    intro={<>借阅服务让库存服务扣掉一本书。库存已经扣了，返回消息却可能丢失，借阅服务只看到超时。分布式系统让不同进程协作，也使延迟、局部故障和信息不完整成为日常设计问题。</>}
    hero={<ConceptHero slug="distributed-system" label="B 已扣减一本库存，确认未送达，A 看到的仍是执行结果未知"><div className={s.distributedHero}><div><span>A · 借阅服务</span><EnvelopeSimple size={27}/><strong>未知</strong><code>确认未到达</code></div><div><span>B · 库存服务</span><Database size={27}/><strong className={s.heroStock}>5 → 4</strong><code>已执行 reserve-42</code></div></div></ConceptHero>}>
    <ArticleSection id="nodes" title="多处执行，通过消息协作"><Legacy slug="distributed-system" names={["question", "definition"]}/>
      <p id="distributed-definition" className="vp-citation-target"><strong>分布式系统由多个进程或节点协作完成任务，它们通过网络消息交换信息。</strong>Lamport 的经典论文把分布式进程中的事件顺序建立在进程内顺序和消息发送、接收关系上。消息需要传输，各进程不能瞬间知道其他进程刚发生了什么。<Cite id="distributed-definition"/></p>
      <p>借阅服务处理读者请求，库存服务保管可借数量。职责分开后可以独立运行，但 A 对 B 的了解来自已经收到的消息。<strong>“有多台机器”还不是设计的全部，关键是它们如何协作，以及失去联系时怎样判断和恢复。</strong></p>
    </ArticleSection>
    <ArticleSection id="observe" title="同一次请求，两端所见不同"><Legacy slug="distributed-system" names={["scene-heading"]}/>
      <p id="distributed-failure" className="vp-citation-target">AWS Builders’ Library 将请求、传输、服务端修改状态、响应和客户端更新分成不同阶段，这些阶段可能各自失败。请求没到与响应丢失，都可以表现为调用端超时。<strong>调用端此时知道的是“没有在期限内收到确认”，执行结果仍然未知。</strong><Cite id="distributed-failure"/></p>
      <p>先看 B 执行后响应丢失，再切到请求在途中丢失。两次 A 都超时，B 的库存却分别为 4 与 5。本例手动推进两个固定故障，恢复后按同一个操作 ID 核对与重试；没有真实网络、共识协议或跨服务事务。</p>
      <DistributedLesson/>
      <p>左右两列展示各端实际记录，读者能同时看到，A 却不能凭空读取右边的状态。查询或重新得到确认以后，A 才能更新判断。这种局部信息差，正是演示要保留下来的部分。</p>
    </ArticleSection>
    <ArticleSection id="timeout" title="超时以后，执行结果仍需核对"><Legacy slug="distributed-system" names={["quiz-heading"]}/>
      <p id="distributed-timeout" className="vp-citation-target">超时限制调用方等待与占用资源的时间；AWS 的重试讨论特别指出，失败或超时不代表副作用没有发生。<strong>A 停止等待，不会自动撤销 B 已经执行的库存扣减。</strong>取消执行需要单独的协议与处理，不能由一个本地计时器推断出来。<Cite id="distributed-timeout"/></p>
      <p id="distributed-reconcile" className="vp-citation-target">AWS 的幂等 API 设计使用调用方提供的请求标识，识别重试并返回已有操作结果。标识记录与业务修改必须一起可靠提交；同一标识换了参数，也需要拒绝或明确处理。<strong>核对 reserve-42，或带原标识重试，可以恢复对同一次操作的判断，而不是重新扣一本书。</strong><Cite id="distributed-reconcile"/></p>
      <div className={base.contrast}><div><h3>查询原操作</h3><p>查 reserve-42 的记录。本例直接查 B 的确定记录；实际系统要核对查询一致性与仍在执行的工作，不能把一次“未查到”普遍当作永远不会执行。</p></div><div><h3>重试原操作</h3><p>保留操作 ID 与参数。B 识别已有记录后返回结果。换一个 ID 或缺少可靠去重，可能使相同意图被执行两次。</p></div></div>
    </ArticleSection>
    <ArticleSection id="ordering" title="顺序与重试需要共同约定" className={base.offset}><Legacy slug="distributed-system" names={["prompt-heading"]}/>
      <p id="distributed-order" className="vp-citation-target">Lamport 用“先发生”关系描述因果：同一进程内的先后、发送在接收之前，以及这些关系的传递。没有这种关系的事件可以并发。<strong>仅比较两台机器上的时间戳，不能单独证明业务的因果关系。</strong>逻辑时钟也不能自行代替库存事务或幂等保护。<Cite id="distributed-order"/></p>
      <ArticleAside title="恢复通信，也要限制重试规模"><p id="distributed-budget" className="vp-citation-target">AWS 提醒重试可能加重过载，多层同时重试会放大请求量；退避、次数限制和抖动用于减少集中的重复请求。它们控制尝试节奏，却不替代副作用的幂等设计。先明确可以重试什么，再决定重试多少次与等待多久。<Cite id="distributed-budget"/></p></ArticleAside>
      <p>拆分服务前，先确定谁保管权威状态、消息内容、操作 ID 和超时后的核对方法。区分“未收到确认”“远端未执行”与“确认已执行”，再讨论 <ConceptTerm slug="microservices">微服务</ConceptTerm> 或其他部署方式。</p>
    </ArticleSection>
  </ConceptArticle>;
}
