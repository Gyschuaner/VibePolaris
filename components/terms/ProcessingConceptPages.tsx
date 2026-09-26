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
  return <ConceptArticle slug="batch-processing" title="批处理" sources={batchSources} sections={[["bounded", "先确定这一批包含什么"], ["chunks", "分块执行，完成后再汇总"], ["compute", "描述计算与触发执行"], ["schedule", "安排作业，也核对结果"]]}
    intro={<>图书馆要统计一份已经截取好的借阅记录，可以把这组记录交给一个作业处理，再得到每本书的借阅次数。批处理面对的是有明确范围的一组输入。新借阅还在发生，并不妨碍这一次只处理已经确定的记录。</>}
    hero={<ConceptHero slug="batch-processing" label="四条借阅记录汇总为书目42三次、书目78一次"><div className={s.batchHero}><div className={s.heroRows}>{[42,42,78,42].map((id,i)=><code key={i}>#{id}</code>)}</div><div className={s.heroBars}><div><span/><code>#42 · 3</code></div><div><span/><code>#78 · 1</code></div></div></div></ConceptHero>}>
    <ArticleSection id="bounded" title="先确定这一批包含什么"><Legacy slug="batch-processing" names={["question", "definition"]}/>
      <p id="batch-bounded" className="vp-citation-target"><strong>批处理把一个有界的数据集合交给作业，按规则计算结果。</strong>Apache Beam 将有界集合描述为大小固定、不会继续增长的输入；无界集合则会持续接收新记录。区别在这次计算的输入范围，不在机器数量，也不在是否恰好凌晨执行。框架可以在同一种编程模型中支持两类输入。<Cite id="batch-bounded"/></p>
      <p>“昨天的借阅”需要说明采用哪个时间字段、截止点和数据版本。事后补录一条昨天发生的借阅，是否进入下一次补算，也是输入约定的一部分。<strong>先给这一批划清范围，才能判断结果缺了什么、重跑应当读什么。</strong></p>
    </ArticleSection>
    <ArticleSection id="chunks" title="分块执行，完成后再汇总"><Legacy slug="batch-processing" names={["scene-heading"]}/>
      <p>选 4 条或 6 条固定借阅记录，每两条为一块。固定输入后逐块处理，也可以让下一块失败一次，再重试。已经成功的块继续保留，所有块都完成后才能发布汇总。改变记录数量会重新开始。本例只用浏览器内存，没有集群、真实调度或性能测量。</p>
      <BatchLesson/>
      <p id="batch-retry" className="vp-citation-target">Hadoop MapReduce 把输入分为可独立处理的块，调度任务并重新执行失败任务；输出提交机制也要处理失败任务留下的临时数据。<strong>重新执行一块，不应把它之前的贡献重复加进最终结果。</strong>本例只将成功的块计入一次，并在全部完成后发布。这是教学用的提交规则，不是对所有批处理引擎的事务承诺。<Cite id="batch-retry"/></p>
      <p>上面的中间计数可能已经非零，但仍有块没处理。看到某一部分输出，不能把整批作业当作成功。输出范围、失败块与提交状态要一起看。</p>
    </ArticleSection>
    <ArticleSection id="compute" title="描述计算与触发执行"><Legacy slug="batch-processing" names={["quiz-heading"]}/>
      <p id="batch-execute" className="vp-citation-target">在 Spark RDD 中，map 这类变换先描述如何产生新的集合，通常不会在声明时立即执行；action 才触发计算。分区让数据能够分开处理，reduceByKey 可以按键聚合。<strong>写好了计算规则，与作业已经执行并产生结果，是两个阶段。</strong><Cite id="batch-execute"/></p>
      <pre className={base.code}>{'book_ids = sc.parallelize([42, 42, 78, 42])\npairs = book_ids.map(lambda book: (book, 1))\ncounts = pairs.reduceByKey(lambda a, b: a + b)\nresult = sorted(counts.collect())\n# [(42, 3), (78, 1)]'}</pre>
      <p>这段示例假定 SparkContext sc 已准备好；collect 将结果取回驱动端，sorted 明确了显示顺序。这里只收集两个计数，不能据此把大规模结果都拉到一台机器的内存。</p>
    </ArticleSection>
    <ArticleSection id="schedule" title="安排作业，也核对结果" className={base.offset}><Legacy slug="batch-processing" names={["prompt-heading"]}/>
      <p id="batch-schedule" className="vp-citation-target">批作业可以按时间、条件或前置任务完成情况启动；有依赖的工作需要安排执行次序。AWS 的批处理介绍同时强调监控成功与失败、日志和历史记录。<strong>定时器按时触发，并不能证明输入完整或结果正确。</strong>还要核对本次实际读取的数据范围、完成块、输出数量和失败原因。<Cite id="batch-schedule"/></p>
      <ArticleAside title="批处理与流处理可以一起使用"><p>连续借阅可以先用于实时看板，再用有明确范围的批作业核对日汇总。两条路径要约定时间口径、晚到数据与结果覆盖方式。换一种执行方式，不会自动消除口径差异。</p></ArticleAside>
      <p>请 AI 帮忙设计作业时，提供输入范围与版本、计算规则、任务依赖、失败重跑方式以及输出提交条件。要求它说清“哪些输入已经处理，哪些结果可以使用”，再考虑并行度与运行时长。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function StreamTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={streamSources}/>;
  return <ConceptArticle slug="stream-processing" title="流处理" sources={streamSources} sections={[["flow", "持续到来的借阅记录"], ["time", "发生时间与收到时间"], ["windows", "窗口何时可以给出结果"], ["late", "晚到以后怎样处理"]]}
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
    <ArticleSection id="late" title="晚到以后怎样处理" className={base.offset}><Legacy slug="stream-processing" names={["prompt-heading"]}/>
      <p id="stream-late" className="vp-citation-target">Flink 的默认迟到容忍为 0；超过窗口处理期限的数据会被丢弃，晚到旁路需要显式配置。增加容忍时间可以保留窗口状态，让晚到事件参与后续结果；再次输出也需要下游处理更新或重复结果。<strong>本文的旁路是特意选择的策略，不是所有引擎默认都会替你保存晚到记录。</strong><Cite id="stream-late"/></p>
      <p>旁路里的 t4 仍是一条有效借阅，只是没有进入已经发布的这次计数。业务可以复核、补算或更新结果，但必须约定谁负责修正，以及看板怎样识别更新后的版本。</p>
      <ArticleAside title="计数状态需要保留与恢复"><p id="stream-state" className="vp-citation-target">Kafka Streams 的聚合与关联等有状态操作，需要状态存储；它支持持久或内存存储，并提供相应恢复机制。窗口里的计数也占用状态。记录保留多久、进程重启怎样恢复，都是持续计算的一部分。本例重置会清空浏览器内存，没有实际状态恢复。<Cite id="stream-state"/></p></ArticleAside>
      <p>请 AI 设计流处理时，提供时间戳来源、窗口范围、水位与触发规则、迟到容忍、结果更新方式以及恢复要求。先确认“结果何时可用、后来如何修正”，再比较延迟与资源开销。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function EventDrivenTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={eventDrivenSources}/>;
  return <ConceptArticle slug="event-driven-architecture" title="事件驱动架构" sources={eventDrivenSources} sections={[["fact", "把已发生的借阅发布出来"], ["subscribers", "不同订阅者各自响应"], ["envelope", "事件里需要哪些信息"], ["failures", "重试与重复交付"]]}
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
    <ArticleSection id="envelope" title="事件里需要哪些信息"><Legacy slug="event-driven-architecture" names={["quiz-heading"]}/>
      <p id="eda-envelope" className="vp-citation-target">CloudEvents 定义了通用事件封装，必填属性包括 id、source、specversion 和 type。<strong>消费者需要知道是什么事件、来自哪里，以及怎样识别这一次发生。</strong>下面展示 JSON 封装；规范 v1.0.2 的 specversion 值仍是 "1.0"，不是文档补丁版本号。<Cite id="eda-envelope"/></p>
      <pre className={base.code}>{'{\n  "specversion": "1.0",\n  "id": "loan-001",\n  "source": "/library",\n  "type": "com.example.book.borrowed",\n  "datacontenttype": "application/json",\n  "data": { "book_id": 42 }\n}'}</pre>
      <p>事件字段怎样演进、消费者能否理解旧版本，也要形成约定。某个服务只需要书目编号，另一个可能还需要借阅时间；缺少业务必需的信息，采用统一封装也不能让它正确计算。</p>
    </ArticleSection>
    <ArticleSection id="failures" title="重试与重复交付" className={base.offset}><Legacy slug="event-driven-architecture" names={["prompt-heading"]}/>
      <p id="eda-retry" className="vp-citation-target">EventBridge 会按配置，对目标交付中的可重试错误再次尝试；时间或次数耗尽后可能丢弃事件，死信队列需要配置。<strong>发布过一次，不能直接推导出所有目标都已处理成功。</strong>需要分别观察交付、失败与后续去向。这也不表示任何消费者的业务错误都会自动得到相同重试。<Cite id="eda-retry"/></p>
      <p id="eda-duplicate" className="vp-citation-target">CloudEvents 要求 source 与 id 的组合标识一次事件；同一事件重发可以沿用这个组合，消费者可以据此识别重复。本例让两个订阅者各自记住已处理的 loan-001，重复交付不再次累计。<strong>封装提供标识，防重仍要由消费处理实现。</strong>真实系统还要处理持久化、并发以及业务写入与防重记录的一致性。<Cite id="eda-duplicate"/></p>
      <ArticleAside title="借阅已记录，事件还没发布"><p>演示故意将记录与发布分成两个按钮：在两步之间，借阅已经存在，订阅者却不知道。如果进程在这里停止，需要能发现并补发遗漏；反过来，也要避免对未完成的借阅发布成功事件。实际方案应明确数据与事件怎样保持一致，不能靠两次操作通常都成功来保证。</p></ArticleAside>
      <p>请 AI 评估事件方案时，提供生产者、订阅关系、事件字段、确认与重试规则、失败去向以及防重记录。要求它区分“事实已记录”“事件已交付”和“消费者业务已完成”，并说明每一项怎样验证。</p>
    </ArticleSection>
  </ConceptArticle>;
}
