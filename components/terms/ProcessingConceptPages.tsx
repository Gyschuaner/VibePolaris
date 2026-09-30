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
  return <ConceptArticle slug="stream-processing" title="流处理" sources={streamSources} sections={[["flow", "持续到来的借阅记录"], ["time", "发生时间与收到时间"], ["windows", "窗口何时可以给出结果"], ["late", "晚到记录的处理"]]}
    intro={<>借阅记录不断到来，看板可以持续更新。麻烦的是，较早发生的记录也可能较晚才收到。流处理除了计算，还要决定记录属于哪一段时间、何时输出结果，以及输出以后收到旧记录该怎么办。</>}
    hero={<ConceptHero slug="stream-processing" label="t2、t12、t4乱序到达，按事件时间进入两个窗口，得到2次和1次借阅"><div className={s.streamHero}><div className={s.heroArrivals}>{[2,12,4].map(t=><code key={t}>t{t}</code>)}</div><div className={s.heroWindows}><div><span>[0, 10)</span><strong>2 次</strong></div><div><span>[10, 20)</span><strong>1 次</strong></div></div></div></ConceptHero>}>
    <ArticleSection id="flow" title="持续到来的借阅记录"><Legacy slug="stream-processing" names={["question", "definition"]}/>
      <p id="stream-flow" className="vp-citation-target"><strong>流处理在记录持续到来的过程中进行计算，而不用等整份数据全部收齐。</strong>Kafka Streams 将流描述为不断更新的记录序列，处理拓扑连接数据来源、处理节点与输出。过滤可以逐条做，借阅次数汇总则需要跨记录保留信息。<Cite id="stream-flow"/></p>
      <p>持续计算不意味着每条记录立刻得到最终结果。涉及一段时间的计数、不同来源的关联或乱序数据时，需要明确等待与输出规则。数据到达得快，也不等于业务结果已经足够完整。</p>
    </ArticleSection>
    <ArticleSection id="time" title="发生时间与收到时间"><Legacy slug="stream-processing" names={["quiz-heading"]}/>
      <p id="stream-time" className="vp-citation-target">Flink 区分事件时间与处理时间：前者通常来自事件携带的时间戳，后者取决于运行处理节点的时钟。<strong>按发生时间统计，不能用到达顺序代替时间归属。</strong>一条 t4 的借阅可能在 t12 之后才到达，但仍属于 [0, 10) 的范围。<Cite id="stream-time"/></p>
      <div className={base.contrast}><div><h3>事件时间</h3><p>“这条借阅是在什么时候发生的？”决定它归哪个时间窗口，需要可信且口径一致的时间戳。</p></div><div><h3>处理时间</h3><p>“处理节点此刻的时钟是多少？”受传输、排队和处理进度影响，重放时也可能不同。</p></div></div>
    </ArticleSection>
    <ArticleSection id="windows" title="窗口何时可以给出结果"><Legacy slug="stream-processing" names={["scene-heading"]}/>
      <p id="stream-window" className="vp-citation-target">窗口划分记录归属，触发规则决定何时输出。Beam 用水位表达对事件时间进度的估计，并允许配置迟到与触发方式。<strong>一段时间内的数据归在一起，仍需要规则决定何时认为它足够完整。</strong><Cite id="stream-window"/></p>
      <p>先接收 t2、t12，再把水位推进到 10，最后接收 t4。也可重置后先收齐三条，再推进水位，比较第一个窗口的计数。本例用逻辑时间、两个固定窗口和手动水位；策略是关闭后不修改原输出，将晚到记录保留在旁路，不模拟真实时钟。</p>
      <StreamLesson/>
      <p id="stream-watermark" className="vp-citation-target">Flink 的水位声明事件时间已经推进到某个位置；乱序与传输延迟可能让旧事件后来才出现。<strong>水位不是“以后绝不会再来旧数据”的事实证明。</strong>推进得早能减少等待，却需要接受或处理更晚的记录；多输入情况下，进度还受较慢输入影响。<Cite id="stream-watermark"/></p>
    </ArticleSection>
    <ArticleSection id="late" title="晚到记录的处理" className={base.offset}><Legacy slug="stream-processing" names={["prompt-heading"]}/>
      <p id="stream-late" className="vp-citation-target">Flink 的默认迟到容忍为 0；超过窗口处理期限的数据会被丢弃，晚到旁路需要显式配置。增加容忍时间可以保留窗口状态，让晚到事件参与后续结果；再次输出也需要下游处理更新或重复结果。<strong>本文的旁路是特意选择的策略，不是所有引擎默认都会替你保存晚到记录。</strong><Cite id="stream-late"/></p>
      <p>旁路里的 t4 仍是一条有效借阅，只是没有进入已经发布的这次计数。业务可以复核、补算或更新结果，但必须约定谁负责修正，以及看板怎样识别更新后的版本。</p>
      <ArticleAside title="计数状态需要保留与恢复"><p id="stream-state" className="vp-citation-target">Kafka Streams 的聚合与关联等有状态操作，需要状态存储；它支持持久或内存存储，并提供相应恢复机制。窗口里的计数也占用状态。记录保留多久、进程重启怎样恢复，都是持续计算的一部分。本例重置会清空浏览器内存，没有实际状态恢复。<Cite id="stream-state"/></p></ArticleAside>
      <p>流处理方案需要写明时间戳来源、窗口、水位与触发规则、迟到容忍、结果更新和恢复要求。先明确结果何时可用、晚到记录如何修正，再比较延迟与资源开销。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function EventDrivenTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={eventDrivenSources}/>;
  return <ConceptArticle slug="event-driven-architecture" title="事件驱动架构" sources={eventDrivenSources} sections={[["fact", "把已发生的借阅发布出来"], ["subscribers", "不同订阅者各自响应"], ["envelope", "事件需要的字段"], ["failures", "重试与重复交付"]]}
    intro={<>一次借阅记录成功后，书架需要更新状态，统计需要累加次数。借阅服务可以发布“书已被借出”的事件，让不同订阅者响应。同一件事可以引发多项工作，各项工作的进度与失败也需要分别观察。</>}
    hero={<ConceptHero slug="event-driven-architecture" label="一条借阅事件复制给书架与统计两个独立订阅者"><div className={s.edaHero}><div className={s.heroFact}><EnvelopeSimple size={23}/><strong>借阅已发生</strong></div><div className={s.heroCopies}><div><code>loan-001</code><Books size={26}/><span>更新书架</span></div><div><code>loan-001</code><ChartBar size={26}/><span>更新统计</span></div></div></div></ConceptHero>}>
    <ArticleSection id="fact" title="把已发生的借阅发布出来"><Legacy slug="event-driven-architecture" names={["question", "definition"]}/>
      <p id="eda-fact" className="vp-citation-target"><strong>事件驱动架构让组件通过发布和响应事件来协作。</strong>AWS 的介绍将事件用于表达状态变化或更新：生产者发布，路由机制将事件交给相关消费者。事件可以携带数据，也可以只带标识，让消费者另外读取需要的内容。<Cite id="eda-fact"/></p>
      <p>“借阅已发生”表达一个事实；“请批准这次借阅”表达一个待执行的要求。收到事实以后，消费者可以决定怎样响应，却不能把尚未批准的请求写成已经成功的事件。本文的借阅先记录，再发布。</p>
    </ArticleSection>
    <ArticleSection id="subscribers" title="不同订阅者各自响应"><Legacy slug="event-driven-architecture" names={["scene-heading"]}/>
      <p>记录一次 #42 的借阅，发布固定事件 loan-001，再分别交付到书架与统计。让统计目标拒绝交付，观察书架已经更新的结果；单独重试统计，然后重复交付同一事件。本例没有真实消息代理，防重记录仅保存在浏览器内存。</p>
      <EventDrivenLesson/>
      <p id="eda-fanout" className="vp-citation-target">RabbitMQ 的 fanout 交换器将消息复制给各个已绑定队列；不同订阅者各用一个队列，才能分别收到副本。<strong>两项工作都需要这件事，与两个工作进程争取同一项任务，是不同的交付关系。</strong>共享一个工作队列通常是在分担任务，而不是保证每个工作进程都收到。<Cite id="eda-fanout"/></p>
      <p id="eda-independent" className="vp-citation-target">事件发布者不必逐个知道所有消费者，独立消费者可以分别处理自己的工作。AWS 将这种解耦用于说明事件架构的适用场景。<strong>统计暂时失败，不应把书架已完成的变化自动抹掉。</strong>但共享的路由服务、存储或资源仍可能形成共同故障点，架构名称不会消除这些依赖。<Cite id="eda-independent"/></p>
    </ArticleSection>
    <ArticleSection id="envelope" title="事件需要的字段"><Legacy slug="event-driven-architecture" names={["quiz-heading"]}/>
      <p id="eda-envelope" className="vp-citation-target">CloudEvents 定义了通用事件封装，必填属性包括 id、source、specversion 和 type。<strong>消费者需要知道是什么事件、来自哪里，以及怎样识别这一次发生。</strong>下面展示 JSON 封装；规范 v1.0.2 的 specversion 值仍是 "1.0"，不是文档补丁版本号。<Cite id="eda-envelope"/></p>
      <pre className={base.code}>{'{\n  "specversion": "1.0",\n  "id": "loan-001",\n  "source": "/library",\n  "type": "com.example.book.borrowed",\n  "datacontenttype": "application/json",\n  "data": { "book_id": 42 }\n}'}</pre>
      <p>事件字段怎样演进、消费者能否理解旧版本，也要形成约定。某个服务只需要书目编号，另一个可能还需要借阅时间；缺少业务必需的信息，采用统一封装也不能让它正确计算。</p>
    </ArticleSection>
    <ArticleSection id="failures" title="重试与重复交付" className={base.offset}><Legacy slug="event-driven-architecture" names={["prompt-heading"]}/>
      <p id="eda-retry" className="vp-citation-target">EventBridge 会按配置，对目标交付中的可重试错误再次尝试；时间或次数耗尽后可能丢弃事件，死信队列需要配置。<strong>发布过一次，不能直接推导出所有目标都已处理成功。</strong>需要分别观察交付、失败与后续去向。这也不表示任何消费者的业务错误都会自动得到相同重试。<Cite id="eda-retry"/></p>
      <p id="eda-duplicate" className="vp-citation-target">CloudEvents 要求 source 与 id 的组合标识一次事件；同一事件重发可以沿用这个组合，消费者可以据此识别重复。本例让两个订阅者各自记住已处理的 loan-001，重复交付不再次累计。<strong>封装提供标识，防重仍要由消费处理实现。</strong>真实系统还要处理持久化、并发以及业务写入与防重记录的一致性。<Cite id="eda-duplicate"/></p>
      <ArticleAside title="借阅已记录，事件还没发布"><p>演示故意将记录与发布分成两个按钮：在两步之间，借阅已经存在，订阅者却不知道。如果进程在这里停止，需要能发现并补发遗漏；反过来，也要避免对未完成的借阅发布成功事件。实际方案应明确数据与事件怎样保持一致，不能靠两次操作通常都成功来保证。</p></ArticleAside>
      <p>事件方案应列明生产者、订阅关系、字段、确认与重试规则、失败去向和防重记录。事实写入、事件交付与消费者业务完成要分别观察，并各自保留验证证据。</p>
    </ArticleSection>
  </ConceptArticle>;
}
