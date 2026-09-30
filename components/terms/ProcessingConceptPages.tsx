import { Books, ChartBar, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { BatchLesson, StreamLesson, EventDrivenLesson } from './ProcessingConceptLessons';
import { batchSources, streamSources, eventDrivenSources } from '@/lib/processing-sources';
import base from './EventConcepts.module.css';
import s from './ProcessingConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }
export function BatchTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={batchSources}/>;
  return <ConceptArticle slug="batch-processing" title="批处理" sources={batchSources} sections={[["bounded", "确定本批输入范围"], ["chunks", "分块执行，完成后再汇总"], ["compute", "描述计算与触发执行"], ["schedule", "安排作业，也核对结果"]]}
    intro={<>图书馆想在每天收工后统计一批已经截取的借阅记录。这里的“作业”是一次从读入这批记录到写出结果的处理任务：它读入一个固定集合，按规则计算，最后写出汇总结果。批处理关心的是本次输入有没有边界；新借阅还在不断进来，只要没被算进这一批固定输入，就不会改变这一次的计算。</>}
    hero={<ConceptHero slug="batch-processing" label="四条借阅记录汇总为书目42三次、书目78一次"><div className={s.batchHero}><div className={s.heroRows}>{[42,42,78,42].map((id,i)=><code key={i}>#{id}</code>)}</div><div className={s.heroBars}><div><span/><code>#42 · 3</code></div><div><span/><code>#78 · 1</code></div></div></div></ConceptHero>}>
    <ArticleSection id="bounded" title="确定本批输入范围"><Legacy slug="batch-processing" names={["question", "definition"]}/>
      <p id="batch-bounded" className="vp-citation-target"><strong>批处理把一个有界的数据集合交给作业，按规则计算结果。</strong>Apache Beam 是用来定义数据处理流水线的框架；它把有界集合描述为大小固定、不会继续增长的输入，把无界集合描述为持续接收新记录的输入。这里的“有界”说的是这次计算读哪些数据，不是机器数量，也不是必须在凌晨运行。<Cite id="batch-bounded"/></p>
      <p>例如“昨天的借阅”要先约定按借阅发生时间还是入库时间、截止到哪个时刻，以及读取哪个数据版本。这里的数据版本，可以理解为某个时点保存下来的那份数据状态。昨天发生但今天才补录的记录，是否进入下一次重算，也属于输入约定。<strong>先把这一批的范围划清，才知道结果缺了什么，重跑时应该读什么。</strong></p>
    </ArticleSection>
    <ArticleSection id="chunks" title="分块执行，完成后再汇总"><Legacy slug="batch-processing" names={["scene-heading"]}/>
      <p>页面默认把 4 条固定借阅记录分成每两条一块，也可以切换成 6 条。本例里的 #42 和 #78 是书目编号。页面上的中间计数，只统计已经成功完成的块：每个编号在这些块里出现了几次。输入固定之后逐块处理；你也可以试着把下一块标成失败，再重试。标成失败的块暂不计入。成功块的结果会一直留着，直到所有块完成，“发布本批汇总”才可以点击。发布，就是把这次完整的计数变成页面上的最终结果，对应批处理系统里提交输出的那一步。在 4 条和 6 条之间切换会清空演示进度，这是页面为了换一批输入而做的重置，不是批处理系统的通用行为。本例只用浏览器内存，没有集群、真实调度或性能测量。</p>
      <BatchLesson/>
      <p id="batch-retry" className="vp-citation-target">Hadoop MapReduce 会把输入拆成可以分别处理的逻辑块，调度任务并重新执行失败任务；任务失败时留下的临时输出也要在提交前清理。<strong>在本页的规则里，失败块没有贡献，重试成功后，最终汇总会和从未失败时相同。</strong>真实引擎可能重新计算已完成的任务，也可能使用自己的中间结果管理方式；本例只演示“成功的块计一次、全部完成后再发布”，不能由此认为所有批处理引擎都有这种事务保证。<Cite id="batch-retry"/></p>
      <p>中间计数可能已经非零，但仍有块没处理，所以它只是阶段性结果。看到一部分输出，不能把整批作业当作成功；要一起看输入范围、完成块、失败原因和提交状态。</p>
    </ArticleSection>
    <ArticleSection id="compute" title="描述计算与触发执行"><Legacy slug="batch-processing" names={["quiz-heading"]}/>
      <p id="batch-execute" className="vp-citation-target">在 Spark RDD 中，map 和 reduceByKey 都是变换：它们先描述怎样得到新的集合，通常不会在写下这一行时立刻计算。collect 是 action，会触发前面的计算，并把结果取回负责提交作业的驱动程序。RDD 会把数据拆成几份，每一份叫一个分区，可以分开处理。<strong>写出计算规则是一个阶段，作业真正执行并产出结果是另一个阶段。</strong>这样 Spark 可以等到真正需要结果时再运行这条计算链。<Cite id="batch-execute"/></p>
      <pre className={base.code}>{'book_ids = sc.parallelize([42, 42, 78, 42])\npairs = book_ids.map(lambda book: (book, 1))\ncounts = pairs.reduceByKey(lambda a, b: a + b)\nresult = sorted(counts.collect())\n# [(42, 3), (78, 1)]'}</pre>
      <p><code>sc.parallelize</code> 把四个编号交给 Spark，形成一个可以分区处理的 RDD；`map` 把每条记录变成一对值：书目编号，和数字 1；`reduceByKey` 再把相同编号的 1 加起来。下面的四个编号就是首图里的四条记录。示例假定 SparkContext `sc` 已准备好；`collect` 把两个计数取回到驱动程序，`sorted` 只负责让显示顺序稳定。这里收集的结果很小，不代表可以把大规模数据都拉到一台机器的内存里。</p>
    </ArticleSection>
    <ArticleSection id="schedule" title="安排作业，也核对结果" className={base.offset}><Legacy slug="batch-processing" names={["prompt-heading"]}/>
      <p id="batch-schedule" className="vp-citation-target">批作业可以按时间、条件或前置任务完成情况启动；有依赖的工作需要安排执行次序。AWS 的批处理介绍还把成功/失败告警、日志和历史记录列为运行后的检查。<strong>定时器按时触发，只说明作业被触发、尝试运行了一次。</strong>例如截止点从凌晨改到早上，读到的数据范围可能已经不同；还要像前面那样核对实际读到的范围、完成的块、输出数量和失败原因。<Cite id="batch-schedule"/></p>
      <ArticleAside title="批处理与流处理可以一起使用"><p>连续借阅可以先用于实时看板，再用有明确范围的批作业核对日汇总。两条路径要约定时间口径、晚到数据与结果覆盖方式。换一种执行方式，不会自动消除口径差异。</p></ArticleAside>
      <p>做一个批处理作业，要先定下输入的范围和版本、怎么计算、任务之间谁先谁后、失败了怎么重跑，以及什么条件下提交结果。只有清楚这批作业读到了什么、跑出了哪些结果，才谈得上调整并行度（同时处理多少块）和运行时长。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function StreamTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={streamSources}/>;
  return <ConceptArticle slug="stream-processing" title="流处理" sources={streamSources} sections={[["flow", "持续到来的借阅记录"], ["time", "发生时间、到达与处理时间"], ["windows", "窗口何时可以给出结果"], ["late", "晚到记录的处理"]]}
    intro={<>借阅记录不断到来，看板可以随着窗口陆续完成而更新。麻烦的是，较早发生的记录也可能较晚才收到。流处理除了计算，还要决定记录属于哪个时间窗口、何时输出结果，以及输出以后收到旧记录该怎么办。</>}
    hero={<ConceptHero slug="stream-processing" label="t2、t12、t4（数字是发生时刻）乱序到达；t4赶在第一窗口关闭前到达时得到2次和1次借阅"><div className={s.streamHero}><div className={s.heroArrivals}>{[2,12,4].map(t=><code key={t}>t{t}</code>)}</div><div className={s.heroWindows}><div><span>[0, 10)</span><strong>2 次</strong></div><div><span>[10, 20)</span><strong>1 次</strong></div></div></div></ConceptHero>}>
    <ArticleSection id="flow" title="持续到来的借阅记录"><Legacy slug="stream-processing" names={["question", "definition"]}/>
      <p id="stream-flow" className="vp-citation-target"><strong>流处理在记录持续到来的过程中进行计算，而不用等数据全部收齐。</strong>Kafka Streams、Flink 和 Beam 是三种不同的流处理工具；下面的讲解参照它们的文档，说的是同一套机制，但各家的默认值和配置名称并不完全一样。Kafka Streams 将流描述为不断更新的记录序列，处理流程把数据来源、处理节点与输出连接起来。过滤可以逐条做，借阅次数汇总则需要跨记录保留信息；这份要跨记录保留的信息，各引擎通常叫作状态。<Cite id="stream-flow"/></p>
      <p>持续计算不意味着每条记录立刻得到最终结果。当计算要覆盖一段时间内的计数、要关联不同来源的数据，或要应对乱序到达时，就需要先确定等待与输出规则。数据到达得快，也不等于结果已经足够完整。</p>
    </ArticleSection>
    <ArticleSection id="time" title="发生时间、到达与处理时间"><Legacy slug="stream-processing" names={["quiz-heading"]}/>
      <p id="stream-time" className="vp-citation-target">Flink 区分事件时间与处理时间：前者通常来自事件携带的时间戳，后者取决于处理节点所在机器的时钟。在下面的演示里，t 是记录发生的时间，也就是事件时间；点击按钮的顺序代表记录到达的顺序。<strong>按发生时间统计时，记录归入哪个窗口要看 t，不能按到达顺序来定。</strong>一条 t4 的借阅可能在 t12 之后才到达，但仍应归入 [0, 10) 这个窗口。<Cite id="stream-time"/></p>
      <div className={base.contrast}><div><h3>事件时间</h3><p>“这条借阅是在什么时候发生的？”决定它归哪个时间窗口，需要可信且口径一致的时间戳。</p></div><div><h3>处理时间</h3><p>“处理节点此刻的时钟是多少？”受传输、排队和处理进度影响，重放（把历史记录重新跑一遍处理）时，取到的时间也可能和第一次不同。</p></div></div>
    </ArticleSection>
    <ArticleSection id="windows" title="窗口何时可以给出结果"><Legacy slug="stream-processing" names={["scene-heading"]}/>
      <p>演示记号约定：t2、t12、t4 中的数字是记录发生的时刻；演示里的 e1、e2、e3 分别携带 t2、t12、t4，点击按钮的顺序代表记录到达的顺序。窗口标签 [0, 10) 表示包含 0、但不包含 10；[10, 20) 同理包含 10、不包含 20。</p>
      <p id="stream-window" className="vp-citation-target">窗口决定记录归属，触发规则决定何时输出。Beam 用水位表示它估计事件时间已经推进到了哪里，并允许设置迟到容忍和触发方式。水位回答“等到什么时候”，触发规则还可以决定是否提前或重复输出。本例不配置额外触发，只用手动推进水位作为输出条件。<strong>一段时间内的数据归在一起，仍需要规则决定何时认为它足够完整。</strong><Cite id="stream-window"/></p>
      <p>先接收 t2、t12，再把水位推进到 10；[0, 10) 输出 1 次。水位和 t 使用同一把事件时间的尺子，推进水位不等于拨快机器时钟。最后接收 t4，水位推进到 10 表示发生时间不超过 10 的记录按本例应已到达；t4 这时才出现，按本例就算晚到，进入晚到旁路（本例特意配置的去处）：它不再放回已经关闭的窗口，而是单独留给事后核对；如果没有配置旁路，晚到记录可能直接被丢弃。再推进水位到 20，第二个窗口才输出 1 次。也可点击“清空事件与水位”后先收齐三条，再推进水位到 20；因为这时水位还没推进到 10，t4 还不算晚到，得到开头那张图展示的 2 次和 1 次。本例用事件时间、两个固定窗口和手动推进的水位；水位到达窗口末端时，本例就关闭该窗口并输出一次，关闭后不再修改已输出的结果。手动推进水位只是演示手段，不是真实系统中水位的产生方式。</p>
      <StreamLesson/>
      <p id="stream-watermark" className="vp-citation-target">Flink 的水位表示事件时间已经推进到某个位置；乱序与传输延迟可能让旧事件后来才出现。水位到达窗口末端时，处理节点就可以认为这个窗口按时到达的记录已经收齐，可以输出并关闭窗口。<strong>水位并不能保证以后绝不会再有更旧的数据到达。</strong>水位推得早，结果出得快，代价是窗口关闭后才到达的记录变多，必须事先决定怎么对待它们。同一个汇总计算可能同时接收多路记录，比如两个分馆各自上报；这时整体水位取各路中最小的那个，较慢那一路会拖住合并后的进度。<Cite id="stream-watermark"/></p>
    </ArticleSection>
    <ArticleSection id="late" title="晚到记录的处理" className={base.offset}><Legacy slug="stream-processing" names={["prompt-heading"]}/>
      <p id="stream-late" className="vp-citation-target">Flink 的默认迟到容忍为 0；处理期限（按事件时间，这个窗口最晚可以处理到哪里）就是窗口末端加上迟到容忍；迟到容忍默认为 0 时，处理期限正好落在窗口末端。超过这个期限的数据会被丢弃，晚到旁路需要显式配置。增加容忍时间可以保留窗口状态，让晚到事件参与后续结果。这是另一种策略，不同于本例把晚到记录送进旁路；比如 [0, 10) 先发布 1 次，允许 t4 参与后可能再发布 2 次，窗口若再次输出，看板这类接收结果的系统还得约定认最新一条，还是把重复结果去重。<strong>本例的旁路是特意选择的策略，并不是每个引擎都默认保存迟到的记录。</strong><Cite id="stream-late"/></p>
      <p>旁路里的 t4 仍是一条有效借阅，只是没有进入已经发布的这次计数。业务可以复核、补算或更新结果，但必须约定谁负责修正，以及看板怎样识别更新后的版本。</p>
      <ArticleAside title="计数状态需要保留与恢复"><p id="stream-state" className="vp-citation-target">Kafka Streams 的聚合与关联等有状态操作，需要状态存储；它支持持久或内存存储，并提供相应恢复机制。真实系统可能从可重放的输入记录或保存的检查点（处理中间状态的保存点）恢复状态。窗口里的计数也占用状态。记录保留多久、进程重启怎样恢复，都是持续计算的一部分。本例重置会清空浏览器内存，没有实际状态恢复。<Cite id="stream-state"/></p></ArticleAside>
      <p>流处理方案需要写明时间戳来源、窗口、水位与触发规则、迟到容忍、结果更新和恢复要求。先明确结果何时可用、晚到记录如何修正，再比较延迟与资源开销。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function EventDrivenTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={eventDrivenSources}/>;
  return <ConceptArticle slug="event-driven-architecture" title="事件驱动架构" sources={eventDrivenSources} sections={[["fact", "把已发生的借阅发布出来"], ["subscribers", "不同订阅者各自响应"], ["envelope", "事件需要的字段"], ["failures", "重试与重复投递"]]}
    intro={<>一次借阅登记成功后，书架（维护图书可借状态的订阅方）需要更新状态，统计需要累加次数。借阅服务可以发布“借阅已发生”的事件，让不同订阅者响应。书架更新没更新、统计加没加上，要分别核实。</>}
    hero={<ConceptHero slug="event-driven-architecture" label="画面中，“借阅已发生”事件（id：loan-001）被复制成两份，分别送往“更新书架”和“更新统计”两个订阅者"><div className={s.edaHero}><div className={s.heroFact}><EnvelopeSimple size={23}/><strong>借阅已发生</strong></div><div className={s.heroCopies}><div><code>loan-001</code><Books size={26}/><span>更新书架</span></div><div><code>loan-001</code><ChartBar size={26}/><span>更新统计</span></div></div></div></ConceptHero>}>
    <ArticleSection id="fact" title="把已发生的借阅发布出来"><Legacy slug="event-driven-architecture" names={["question", "definition"]}/>
      <p id="eda-fact" className="vp-citation-target"><strong>事件驱动架构让组件通过发布和响应事件来协作。</strong>按 AWS 的说明，事件用来表达状态变化或更新：生产者把事件发布出去，消息代理（负责接收和转发事件的中间服务）把它交给相关消费者。事件可以携带数据，也可以只带标识，让消费者另外读取需要的内容。这里的生产者就是借阅服务；接收事件的一方通常叫消费者，本文里就是书架和统计两个订阅者。订阅者就是登记接收某类事件的消费者，本例中的两个订阅者相当于已经登记好了。<Cite id="eda-fact"/></p>
      <p>如果借阅服务直接依次调用书架和统计，任何一个服务挂了，整笔借阅都会被拖住甚至失败；以后每加一个订阅方，还要改借阅服务。事件驱动换一种做法：借阅服务只管把已发生的事宣布出去。</p>
      <p>“借阅已发生”说的是已经发生的事实；“请批准这次借阅”提出的是一项还没执行的要求。事件记录已发生的事，请求提出待办的事。收到请求的一方可以决定怎么做，但“有人请求借书”不等于“书已经借出去了”，不能拿请求当事实记账。演示会把借阅拆成“记录”和“发布”两个按钮。</p>
    </ArticleSection>
    <ArticleSection id="subscribers" title="不同订阅者各自响应"><Legacy slug="event-driven-architecture" names={["scene-heading"]}/>
      <p>实际系统里，RabbitMQ 是一种接收事件并负责转发的消息代理。记录一次 42 号书的借阅，发布一条 id 为 loan-001 的事件（用这次借阅的编号充当事件 id），再分别投递给书架和统计两个订阅者。点击“投递到统计”时模拟一次拒绝（相当于统计服务临时故障），再把事件投递给书架：书架照常更新，不受统计失败影响。然后重试投递统计目标，最后再把同一个事件重复投递一次，看统计会不会多加一次。本例没有接入真实消息代理，页面上的投递按钮是在模拟消息代理的转发行为。</p>
      <EventDrivenLesson/>
      <p id="eda-fanout" className="vp-citation-target">fanout 是 RabbitMQ 的一种分发方式：消息先进一个入口（RabbitMQ 称之为交换器），再按绑定（交换器和队列之间的转发约定）复制进每个订阅者自己的收件队列。不同订阅者各用一个队列，才能分别收到副本。消息分发有两种常见关系：一种是一条事件同时交给每个订阅者，各拿一份副本，fanout 就是这样；另一种是多个消费者实例（工作进程）共用一个队列领任务，一条消息只会被其中一个领走。共用一个工作队列的目的是分担处理压力，不是保证每个工作进程都收到。实际中还有按主题过滤等其他方式，这里只对比这两种。<Cite id="eda-fanout"/></p>
      <p id="eda-independent" className="vp-citation-target">事件发布者不必逐个知道所有消费者，独立消费者可以分别处理自己的工作。AWS 将这种解耦用于说明事件架构的适用场景。<strong>统计目标拒绝处理，只影响统计自己这一份；书架已经完成的更新不会被连累回滚——这正是第一节“直接依次调用”做不到的。</strong>但共享的消息代理、存储或资源仍可能形成单点故障；比如消息代理停机，两个订阅者就都收不到事件。架构名称不会消除这些依赖。<Cite id="eda-independent"/></p>
    </ArticleSection>
    <ArticleSection id="envelope" title="事件需要的字段"><Legacy slug="event-driven-architecture" names={["quiz-heading"]}/>
      <p id="eda-envelope" className="vp-citation-target">不同生产者的事件格式可能各不相同，CloudEvents 提供了一套统一的事件格式，好比给事件套上标准信封；必填属性包括 id、source、specversion 和 type。<strong>消费者要能判断：这是什么事件、从哪里来、是哪一次发生。</strong>type 回答“这是什么事件”，source 回答“从哪里来”，id 回答“是哪一次发生”。下面展示 JSON 封装；data 是业务数据本身，datacontenttype 说明它的格式；specversion 填的是规范版本，不带补丁号：规范即使出到 v1.0.2，这个值仍写“1.0”。<Cite id="eda-envelope"/></p>
      <pre className={base.code}>{'{\n  "specversion": "1.0",\n  "id": "loan-001",\n  "source": "/library",\n  "type": "com.example.book.borrowed",\n  "datacontenttype": "application/json",\n  "data": { "book_id": 42 }\n}'}</pre>
      <p>日后 data 新增字段时，按旧格式解析的订阅者有的会忽略新字段继续跑，有的会直接解析报错；能否安全加字段，要按各订阅者的解析方式事先约定。某个服务只需要书目编号，另一个可能还需要借阅时间；反过来，如果 data 里缺了业务必需的信息，封装再统一，订阅者也算不出正确结果。</p>
    </ArticleSection>
    <ArticleSection id="failures" title="重试与重复投递" className={base.offset}><Legacy slug="event-driven-architecture" names={["prompt-heading"]}/>
      <p id="eda-retry" className="vp-citation-target">RabbitMQ 和 EventBridge 都扮演居中接收、转发事件的中间层角色，只是 EventBridge 更偏按规则做事件路由（按事先配置的规则决定每条事件送去哪些目标）。EventBridge 是 AWS 的托管事件服务。异步向目标投递失败时，如果失败原因属于可重试的错误，EventBridge 会自动重试。重试到时限仍未成功，EventBridge 会停止投递该事件；只有事先配置了死信队列（专门留存最终投递失败事件的队列），这些事件才会被留存，否则直接丢弃。<strong>但“发布过一次”不等于“每个订阅者都处理成功了”。</strong>每个订阅者的投递结果、有没有失败、事件后来去了哪，要分别观察。而且，自动重试只针对投递环节的错；消费者处理业务时出的错，不在自动重试范围内，要不要重来由消费者自己决定。<Cite id="eda-retry"/></p>
      <p id="eda-duplicate" className="vp-citation-target">重试意味着同一事件可能被投递两次：哪怕消费者已经处理成功，只要消息代理没收到确认，就还会再投递一次。CloudEvents 规定：source 加 id 合起来，唯一标识一次事件。重发同一事件时沿用这组值，消费者就能认出重复。本例让统计订阅者记住已处理的 loan-001，重复投递时不再重复累计；书架订阅者也应采用同样的防重规则。<strong>封装只负责给出标识，防重复仍要消费者自己实现。</strong>本例的防重记录只保存在浏览器内存，刷新页面就没了。真实系统还要处理持久化、并发以及业务写入与防重记录的一致性。<Cite id="eda-duplicate"/></p>
      <ArticleAside title="借阅已记录，事件还没发布"><p>演示故意将记录与发布分成两个按钮：在两步之间，借阅已经存在、订阅者却不知道，系统要能发现漏发的事件并补发。常见做法是给借阅记录打上“待发布”标记，由后台补发；那是另一篇文章的事。反过来，如果先发布事件、后记录借阅，就可能出现事件宣称借阅成功、借阅记录却没写上的情况。两种风险只能靠明确的一致性方案（比如先写记录、确认后发布，并记录发布状态）来防，不能靠两次操作通常都成功。</p></ArticleAside>
      <p>事件方案应列明生产者、订阅关系、字段、确认与重试规则、失败去向和防重记录。事实写入、事件投递与消费者业务完成要分别观察，并各自保留验证证据。</p>
    </ArticleSection>
  </ConceptArticle>;
}
