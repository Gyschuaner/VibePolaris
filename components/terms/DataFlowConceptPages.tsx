import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { IngestionLesson, TransformationLesson, ValidationLesson } from './DataFlowConceptLessons';
import { ingestionSources, transformationSources, validationSources } from '@/lib/dataflow-sources';
import base from './EventConcepts.module.css';
import s from './DataFlowConcepts.module.css';
import { DataIngestionSignatureHero, DataTransformationSignatureHero, DataValidationSignatureHero } from './DataTestSignatureHeroes';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function IngestionTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={ingestionSources}/>;
  return <ConceptArticle slug="data-ingestion" title="数据接入" sources={ingestionSources} sections={[["entry", "把来源数据接进来"], ["position", "读到哪里，保存到哪里"], ["restart", "重启后可能再次读取"], ["reconcile", "接进来以后，还要核对"]]}
    intro={<>图书馆的借阅记录不断增加，报表系统要把新增记录接进原始层。原始层是接入后先保存来源记录和原始值的地方。接入要回答两个问题：哪些记录已经写入，下一次从哪里继续。读到一条记录，与确认它已经可靠保存，是不同的进度；接入完成也不等于后面的验证、转换和汇总都已完成。</>}
    hero={<DataIngestionSignatureHero />}>
    <ArticleSection id="entry" title="把来源数据接进来"><Legacy slug="data-ingestion" names={["question", "definition"]}/>
      <p id="ingestion-entry" className="vp-citation-target"><strong>数据接入把数据库、文件、API 或事件流中的数据收集到目标系统，供后续存储与处理。</strong>AWS 将它描述为数据进入处理流程的入口，也区分批量、流式与微批方式。有的接入系统会附带基础检查或预处理；本文只讲来源读取与目标保存这两步，清洗、汇总、发布属于数据管道里的其他环节，这里不展开。这里把原始层当作数据接入后的第一个去处：先保留来源记录和原始值，后面的转换、验证与汇总再从这里读取。<Cite id="ingestion-entry"/></p>
      <div className={base.contrast}><div><h3>数据接入</h3><p>从借阅来源拿到记录，保存事件身份（用来认出同一条记录的标识）与原始值，并记录读取位置。</p></div><div><h3>数据管道</h3><p>把接入、验证、转换、统计和发布连接成完整流程。接入做完，只代表整个流程里的一步结束。</p></div></div>
      <p id="ingestion-modes" className="vp-citation-target">一次导入当天文件是批量接入，读完这批就结束；持续消费借阅事件是流式接入，一直跟着来源读。微批介于两者之间：先把一小段时间内到达的记录攒起来，再一次性处理这一小批，所以会比纯流式多一点等待，换来更小、更容易控制的处理单元。<strong>先弄清楚来源多久更新一次、数据需要新到什么程度，以及如何标记记录，再选接入方式。</strong>例如日报只需每天汇总一次，可以选择批量；需要尽快看到新借阅时，才考虑流式或微批。“实时”这个词本身不能说明延迟、可靠性或处理结果。<Cite id="ingestion-modes"/></p>
    </ArticleSection>
    <ArticleSection id="position" title="读到哪里，保存到哪里"><Legacy slug="data-ingestion" names={["scene-heading"]}/>
      <p id="ingestion-position" className="vp-citation-target">增量接入——每次只接上次之后新增或变化的记录——需要一个继续读取的依据。连接器就是负责从某个来源读取记录、把记录交给目标系统的程序或服务。这里先把三个容易混用的词分开：本页演示的“确认位置”是教学里表示“已经可靠写入”的进度；连接器保存的“偏移量”是来源中的读取位置；数据同步工具 Airbyte 的“游标字段”是记录中用来判断增量的字段，游标值则是它在某次同步中的具体值。这三个概念在按顺序读取事件时可能恰好都显示为同一个数字（本例中是 2），但含义不同，不能直接互换。本例把确认位置和事件日志位置用同一个数字显示，是为了让进度变化可见；它不等于真实连接器的内部偏移量，也不等于 Airbyte 的游标。前面讲的是按顺序读事件日志；换成表格增量读取时，游标值可能来自 `updated_at`，而不是第几条记录；`updated_at` 是记录上表示“最后更新时间”的字段。某条记录改了内容却没有更新这个字段，按它做增量查询就可能漏掉这次修改。<strong>增量依据要跟着来源约定选，不能随便挑一个看起来相关的时间字段。</strong><Cite id="ingestion-position"/></p>
      <p>演示的事件日志固定有位置 1、2、3：先读取只会把记录放进进程内暂存，写入才会放进原始层，保存确认位置才表示这批已经可以从来源跳过。先读取前两条，让写入失败：确认位置不会前移。成功写入后，暂时不要保存位置，直接重启；重启后点击“读取下一批”，会再次看到 loan-1 和 loan-2，说明进程从上次保存的位置重新读取。本例的原始层和确认位置是浏览器里的模拟状态，重启后仍然保留；这里没有真实磁盘，也没有连接器。真实系统不能靠进程内存保留它们，而要把原始层和位置记录写到重启后仍能读回的持久存储里，并保证两者对得上：数据写到了哪，位置才能动到哪。</p>
      <IngestionLesson/>
      <p>演示按事件 ID 计数，所以重读 loan-1、loan-2 后重新写入，原始层仍是这两条，不会因为重复送达变成四条。只有把确认位置保存为 2，才能继续读取第 3 条；事件身份用来识别重复，不等于确认位置已经前移。</p>
      <p><strong>确认位置的含义是：这批输入已经写入并保存好。</strong>在本例中，重读不会让原始层多出记录，因为它按事件 ID 去重。本例把写入与确认分成两个可观察动作。若先把确认位置推进、数据却还没可靠写入，进程崩溃后可能跳过这批数据；若先写入但没保存确认位置，重启会再次读取，所以还需要按事件 ID 去重。事务会把一组写入绑在一起：要么全部成功，要么全部失败。若原始层和确认位置在同一个数据库事务范围内，可以一起原子提交；跨系统或不同存储时通常不能直接这样做，就要依靠稳定 ID 去重、失败记录和来源/目标核对。本例里，把成功处理过的进度正式保存下来，就叫“提交”；真出故障时会怎样，仍要看连接器和目标存储各自的实现。</p>
    </ArticleSection>
    <ArticleSection id="restart" title="重启后可能再次读取"><Legacy slug="data-ingestion" names={["quiz-heading"]}/>
      <p id="ingestion-restart" className="vp-citation-target">Debezium 的 PostgreSQL 连接器在进程异常退出后，会从先前保存的 WAL 偏移量继续读取。WAL（写前日志）可以理解为数据库先把每笔改动记成流水账；刚处理过、尚未保存偏移量的事件，可能再次产生。<strong>收到重复事件可以是恢复流程的正常结果，并不一定意味着来源新增了一条业务记录，下游要用稳定身份保证重放不会重复产生副作用（比如同一笔借阅不会被记两次）。</strong><Cite id="ingestion-restart"/></p>
      <p id="ingestion-duplicates" className="vp-citation-target">本例用来源提供的 loan-1 这类稳定事件 ID 保留一份原始记录；如果来源没有稳定 ID，就要先约定主键（能唯一确定一条记录的字段）或组合主键，不能临时按内容相似去重。至于怎么识别“同一个实体”，Airbyte 有自己的规则：Append + Deduped 模式里，主键是识别同一个实体的字段；历史表保留每次同步看到的版本，方便追溯变化，最终表则按游标只保留每个主键最新的一行，方便下游读取当前状态。比如同一笔借阅的归还状态后来变了，这是同一个实体的新版本，不是同一事件被重复送达。<strong>“同一个事件重复送达”与“同一个实体产生新版本”，需要不同的身份和处理规则。</strong>不能只因为两条记录内容看起来一样，就删掉其中一条。<Cite id="ingestion-duplicates"/></p>
      <ArticleAside title="变更数据捕获也要有起点"><p id="ingestion-cdc" className="vp-citation-target">变更数据捕获（CDC）是持续捕获数据库中插入、更新和删除的行级变化，再把变化送到另一个系统的接入方式。Debezium 的 PostgreSQL 连接器在默认的 `initial` 模式下，会先做一次一致性快照，得到一个完整的起点，其中不会混入事务进行到一半的状态；之后从对应的事务日志位置继续捕获已经提交的行级变化。这里的“已提交”指事务已经正式完成。来源删除是否让目标删除，取决于目标系统对删除事件的处理规则；原始层也可以保留这类删除事件，交给下游决定。这是该连接器的机制，不是所有接入都必须使用数据库日志。快照结束后从哪个日志位置接上、日志要保留多久，这些都要衔接好，不能认为“连接建立了”就已经拿到了完整历史。<Cite id="ingestion-cdc"/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="reconcile" title="接进来以后，还要核对" className={base.offset}><Legacy slug="data-ingestion" names={["prompt-heading"]}/>
      <p id="ingestion-reconcile" className="vp-citation-target">来源和目标都显示三条，仍可能有一条保存了错误值，例如字段映射错位、读取时来源刚好更新，或目标写入时发生了截断。在借阅例子里，loan-1 这样的事件身份就是把来源与目标记录对上的依据；实际的数据表通常使用主键或组合主键。AWS DMS 的数据验证会用记录身份找到对应的目标行，逐行比较内容并报告差异，而不只检查总行数；没有主键或唯一键时，逐行核对可能无法进行。这样的查询会额外占用来源库、目标库和网络资源。<strong>数量一致只是证据的一部分。</strong>核对还得说清楚：比的是哪个范围、按什么身份把记录对上、比哪些内容。如果来源本身的业务值就是错的，来源与目标一致也不能证明它合理，那属于后续规则检查要回答的问题。<Cite id="ingestion-reconcile"/></p>
      <p>接入结果应附上来源、事件身份、读取位置和接入批次信息；失败的记录要能定位回具体的来源和批次。格式正确与业务合理是后续 <ConceptTerm slug="data-validation">数据验证</ConceptTerm> 的职责；原始层保留记录，不代表每个字段都已经可信。</p>
      <p>接入程序要明确来源格式、增量依据、记录身份和目标写入规则。验收时分别检查写入失败、写入成功但确认位置没保存、来源更新或删除、重复交付这几种情况，并用来源与目标的记录核对结果。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function TransformationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={transformationSources}/>;
  return <ConceptArticle slug="data-transformation" title="数据转换" sources={transformationSources} sections={[["rules", "让字段遵循同一套规则"], ["units", "数字之外，还要知道单位"], ["precision", "精度与舍入要先约定"], ["grain", "汇总会改变一行的含义"]]}
    intro={<>本例有四条借阅费用：A 写成 ¥12.30、B 写成 CNY 12.30，输入约定它们都是 CNY 元；C 写成 1230 分，输入约定它是 CNY 分；D 只写 1230，单位还没有确认。报表不能把这四种输入直接相加：如果把符号和单位都丢掉，A、B、C 会被当成 12.30、12.30、1230，直接加成 1254.60；但按已知约定，它们应合成 3690 分，D 还不能进入合计。数据转换用明确的规则统一表示，同时保留原始值，避免把不确定的信息悄悄变成一个确定数字。</>}
    hero={<DataTransformationSignatureHero />}>
    <ArticleSection id="rules" title="让字段遵循同一套规则"><Legacy slug="data-transformation" names={["question", "definition"]}/>
      <p id="transform-definition" className="vp-citation-target"><strong>数据转换按照明确规则，改变数据的表示、字段结构、值或统计粒度，让它适合后续使用。</strong>这里说的“表示”变化，是现实中对应的金额没有变，只是写法或单位换了，例如把 12.30 元写成 1230 分；“字段结构”是字段怎样拆分、合并或改名；“值”变化，是业务规则让现实含义也变了，例如按税率从不含税金额算出含税金额；“统计粒度”是一行数据代表一条记录，还是一组记录的合计。<Cite id="transform-definition"/></p>
      <p>例如拆出日期、统一金额单位，或者按书目汇总借阅次数。dbt 是一个数据建模工具：它把写在 SQL（查询数据的语言）文件里的 SELECT 当作 model，运行时可以按配置把结果建立成视图或表；它只是实现转换的一种工具，转换本身不限定使用 dbt。<Cite id="transform-definition"/></p>
      <div className={s.ruleList}><div><h3>输入约定</h3><p>字段来自哪里？值的单位、币种和精度是什么（例如小数有几位）？缺失或不认识的值怎样保留？</p></div><div><h3>输出约定</h3><p>统一为 CNY 的整数分，保留来源行 ID。超出约定、缺失或不认识的输入进入“待处理”状态，保留原值和原因，不擅自补一个金额。“待处理”不是删除，也不是数据库里的 `NULL`；本例只把它排除在当前合计外，同时保留待处理数量和原因，后续修正、隔离或删除要另写规则。</p></div></div>
      <p>“转成数字”只解决表示问题。<strong>先说清数字代表什么，再写类型转换和计算。</strong>本页把职责分开：转换按输入约定产生新表示；转换器会先检查能否无损转换（单位未确认、小数超过两位时就无法转换）。没通过这个检查，只是转换的前置条件，不是在证明业务事实正确；<ConceptTerm slug="data-validation">数据验证</ConceptTerm>再对输入或中间结果执行独立的“符合还是不符合”规则，并处理不符合的记录。判断转换结果是否合规属于数据验证，不属于转换。本演示里的转换器不会把异常改成正确值，而是把无法按约定转换、缺失或不认识的输入标为“待处理”；输入格式、映射规则、无法转换的输入如何处理和输出口径都应该能被复查。</p>
    </ArticleSection>
    <ArticleSection id="units" title="数字之外，还要知道单位"><Legacy slug="data-transformation" names={["scene-heading"]}/>
      <p>A、B、C 三条的输入约定已经写明，可以各统一为 1230 分。本例按 1 元 = 100 分计算；“分”是金额单位，CNY 是币种，二者都要按输入约定确认。D 只有“1230”：如果它代表 CNY 分，结果是 1230 分；如果代表 CNY 元，结果是 123000 分。D 的单位属于输入约定的一部分，补充这个约定后要重新转换受影响的行。转换器不能靠数字长得像就猜出单位；如果结果不能无损地写成整数分，本页选择保留待处理，不自动四舍五入，这是本页的输出约定，不是所有系统的通用规则。下面的“已确认”选项代表你根据输入约定确认了单位，不代表程序自动识别。演示里的“让 A 超出两位小数”只是把预置输入改成一条测试样例，不会修改真实来源或已经保存的原始数据。</p>
      <TransformationLesson/>
      <p>这是浏览器里对固定示例数据做的字段计算，不会处理真实费用。D 未确认时保留原值与原因，不进入合计；真实报表应同时带上已转换合计、待处理数量和待处理记录，不能只看一个总数。重置会把输入和确认（包括 D）恢复到初始状态；修改单位或输入后，必须重新执行，旧输出不能继续当作新输入下的结果。</p>
      <p id="transform-type" className="vp-citation-target">PostgreSQL 区分整数、精确 numeric 和近似浮点数；给 numeric 列声明总位数和小数位数（例如 `numeric(10,2)`，10 是总位数，2 是小数位数），就限定了能存入的值和舍入行为。Python 的 decimal 模块提供 Decimal 类型，PostgreSQL 提供 numeric 类型；两者都能表示十进制数，但都不携带业务单位，也不会替你选好舍入策略。这里的输入/输出小数位约定，与计算过程使用的运算精度不是一回事。<strong>amount_cents（整数分的输出列名）、currency 和输入约定的单位，需要数据设计者补充。</strong>本例选择整数分；其他场景可以采用适当的十进制类型与明确精度。<Cite id="transform-type"/></p>
    </ArticleSection>
    <ArticleSection id="precision" title="精度与舍入要先约定"><Legacy slug="data-transformation" names={["quiz-heading"]}/>
      <p id="transform-precision" className="vp-citation-target">计算机常用二进制浮点保存小数，而 0.1 这样的十进制小数无法在二进制中精确写出。Python 的 decimal 文档说明，十进制运算可以准确表示十进制输入，但精度和舍入仍由当前计算设置控制；这里的“计算设置”就是运算时采用的精度、舍入方式和遇到不精确结果时的处理规则。如果输入已经先被当成 float，`Decimal.from_float(0.1)` 会把那次近似结果精确展开成一长串小数；从十进制字符串构造，才能保住原始十进制值。<strong>选了一个精确类型，不等于已经选好舍入规则。</strong><Cite id="transform-precision"/></p>
      <pre className={base.code}>{'from decimal import Decimal\nDecimal("12.30") * 100\n# Decimal("1230.00")'}</pre>
      <p>这段代码只是固定示例，不是适用于任意输入的完整处理程序。它表示 12.30 元与 1230 分是同一笔金额；Decimal 形式保留的尾部两个 0 只是小数位信息，按输出约定转成整数后是 1230 分。因为 1 分 = 0.01 元，本页规则只接受最多两位小数，12.345 元无法精确表示成整数分，所以标为“待处理”并保留原值，不擅自舍入。其他系统可以选择明确的舍入策略，但应说明发生了舍入、结果变成了什么；PostgreSQL 把值存入声明了小数位数的 numeric 列时也可能舍入，这和本页“不舍入、标为待处理”的做法是两种不同约定。<Cite id="transform-type"/></p>
      <ArticleAside title="转换结果要能回到原始值"><p>输出 1230 分，还应能找到 A 的原始字符串 ¥12.30、输入约定和所用规则版本。覆盖原始值以后，发现单位错误就很难重新计算。规则发生变化，应重新转换受影响记录，再检查后续汇总；不能只改报表标签。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="grain" title="汇总会改变一行的含义" className={base.offset}><Legacy slug="data-transformation" names={["prompt-heading"]}/>
      <p id="transform-grain" className="vp-citation-target">这里的“粒度”可以先理解为一行数据覆盖的范围：逐条转换后，一行仍代表一条费用记录；按书目汇总后，一行变成某本书的合计，这里的“书目”就是目录中的一本书。本演示的合计是全表合计，没有展示书目列；真实按书目汇总时，每本书会各有一行。PostgreSQL 的 `sum` 只对非 `NULL` 输入求和；`NULL` 是数据库表示缺失值的一种方式，没有输入行时 `sum` 返回 `NULL`，而不是自动返回零。本页的待处理行是另外标记并排除的记录，不等于数据库里的 `NULL`。<strong>一个合计不能单独说明原始记录是否齐全。</strong>本例显式保留待处理数量，并把总数标为“仅已转换记录合计”。不同场景还要写清先转换再汇总，还是先按原始字段分组再转换；顺序不同，结果可能不同。<Cite id="transform-grain"/></p>
      <div className={base.contrast}><div><h3>3690 分</h3><p>D 的单位未确认时，A、B、C 三条的部分合计；它没有包含 D，不能标成四条记录的全部费用。</p></div><div><h3>4920 分</h3><p>这是“D 代表 CNY 分”假设下的推算；四条符合精度规则的记录合计为 4920 分。当前演示选择“D=元”时会显示 126690 分，切换单位后要重新执行。改变规则后重新计算，原始数据仍保留。</p></div></div>
      <p>A 超出两位小数且 D 仍未确认时，只有 B、C 进入合计，结果是 2460 分。转换规则应附原始样例，写清单位、类型、小数位数、无法转换的输入（待处理）如何处理，以及输出粒度（每行代表什么、合计覆盖的范围）。每次运行要记下字段如何变化、排除了哪些记录以及待处理数量，下游要靠这些判断结果是否完整。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function ValidationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={validationSources}/>;
  return <ConceptArticle slug="data-validation" title="数据验证" sources={validationSources} sections={[["contract", "把要求写成可检查的规则"], ["check", "逐条解释验证结果"], ["report", "报告要指向具体字段"], ["boundary", "通过规则，不代表全部真实"]]}
    intro={<>一份导入资料里，年龄是 −2、城市写成 ??，或者年龄看起来是 24，却以字符串保存。数据验证按约定逐项检查，把符合要求的记录与需要处理的记录分开，也让失败有一个能追查的理由。</>}
    hero={<DataValidationSignatureHero />}>
    <ArticleSection id="contract" title="把要求写成可检查的规则"><Legacy slug="data-validation" names={["question", "definition"]}/>
      <p id="validation-contract" className="vp-citation-target"><strong>数据验证按约定检查输入，给出通过或失败的结果与原因。</strong>这里的“输入”可以是一条记录，也可以是一批记录。规则可以约束类型、必填、范围、格式及字段关系。JSON Schema 是一种把规则写成配置的格式：`properties` 列出字段及各自的检查方式，`required` 列出必须出现的字段；配置里写了一个字段，不等于它一定要出现。例如 `nickname` 可以列在 `properties` 里但不列入 `required`，没有 nickname 时不一定失败；`required` 里的字段缺失，才按这条规则失败。字段缺失是输入里没有这个字段，`null` 则是字段存在但没有值，二者要按业务约定分别处理。本页的 `??` 是实际写入的字符串值，不是缺失字段或 `null`；固定演示没有放入缺失或 `null` 记录。要求必须明确，验证器才能检查。<Cite id="validation-contract"/></p>
      <p id="validation-levels" className="vp-citation-target">OWASP 把验证分成语法和语义两层：语法层检查单个字段是否符合可接受的格式，语义层检查它在业务关系中是否合理，例如开始日期是否早于结束日期。<strong>数字写得合法、字段关系合理，是两种检查。</strong>它们都依赖业务要求；正则表达式最多检查一段文字的形状，不能代替范围或字段关系判断。<Cite id="validation-levels"/></p>
      <div className={base.contrast}><div><h3>验证</h3><p>年龄是字符串 &quot;24&quot;，与约定整数不符。保留原值，给出类型失败原因。</p></div><div><h3>转换</h3><p>如果来源约定允许数字字符串，可以先按单独的<strong>数据转换</strong>规则变成整数，再验证；转换后的字段另存为新表示，原始值和所用规则要一起保留。来源就是提供这条输入的系统或文件。</p></div></div>
    </ArticleSection>
    <ArticleSection id="check" title="逐条解释验证结果"><Legacy slug="data-validation" names={["scene-heading"]}/>
      <p>本页把“校验”按钮当作一次验证运行。类型要求始终启用，年龄范围与城市名单可以开关。<strong>一条记录只有所有已启用的规则都通过，才会计入“通过当前规则”；未启用或“不适用”既不算通过，也不算失败。关闭规则只改变这次检查的范围，不会把原值改得更合理。</strong>SH / BJ 只是本站示例允许的两个代码，不是完整城市标准。默认只有 A 通过；关闭范围规则后，B 的 −2 并没有变成合理年龄，只是这次不再检查它。</p>
      <p>教学演示固定使用一组示例数据（快照 s1），检查全在浏览器里完成，不会连接验证服务：A 的 age 是数字 24、city 是 "SH"；B 的 age 是 −2、city 是 "SH"；C 的 age 是 37、city 是 "??"；D 的 age 是字符串 "24"、city 是 "BJ"。age 必须为整数；年龄范围限定 0–120，城市代码只允许 SH / BJ；范围和城市这两条规则可以分别开关。运行前只显示这四条输入，运行后才显示按当前规则算出的报告。字符串 "24" 是文本值，机器看到的不是数字 24；范围规则只能比较数字，类型检查失败后，范围检查显示“不适用”，因为没有可比较的数字。本例没有字段缺失或 `null`，所以不会显示这两类情况的结果。</p>
      <p><strong>失败不一定意味着删除整条记录。</strong>可以拒绝本次输入、隔离并修复，或按明确规则允许部分处理。本页统一把失败记录称作“待处理”；实验结果区域用“隔离”标记这批待处理记录，表示暂不进入后续使用，原值和失败原因仍保留，不代表删除或自动修复。如果后续只使用通过的记录，应同时报告待处理的数量和原因。</p>
      <ValidationLesson/>
      <p>演示按固定快照 s1 重新计算，不运行 JSON Schema、SHACL 或远端验证服务。修改规则会收起旧报告，重新运行才得到对应结果。点击“恢复默认校验”会把两个开关重新打开，并收起旧报告；它重置的是本轮演示状态，不会修改输入快照。</p>
    </ArticleSection>
    <ArticleSection id="report" title="报告要指向具体字段"><Legacy slug="data-validation" names={["quiz-heading"]}/>
      <p id="validation-report" className="vp-citation-target">W3C 的 SHACL 是针对 RDF 图的规则语言，RDF 图用节点和属性关系表示数据；它的验证报告可以记录相关节点、属性路径、值与失败约束。这里借鉴的是“报告要能定位”的结构，并没有把 SHACL 当作 JSON 验证器。<strong>说“有三条错误”，只告诉你数量；写明记录、字段、原值和规则，才能处理。</strong><Cite id="validation-report"/></p>
      <div className={s.reportFields}><div><h3>定位问题</h3><code>D → age → &quot;24&quot;</code><p>哪条记录、哪个字段、收到的原始值是什么？保留字符串与数字的区别。</p></div><div><h3>解释判断</h3><code>要求整数 → 类型失败</code><p>哪条规则生效，为什么没有通过？没有启用的规则不能显示成检查通过。</p></div></div>
      <p>每条报告同时列出整数、范围和城市三项检查；同一条记录如果违反多条已启用规则，原因会按字段并列保留，而不是只留一个总数。</p>
      <p id="validation-run" className="vp-citation-target">Great Expectations 是一个数据验证工具。它用 Validation Definition（预先配置的一组验证规则）来检查一批数据；每条 Expectation 是对数据的一个具体要求，运行结果包含每条要求的通过情况与解释信息，报告也可以保存下来。页面上的两个开关只是本例用来改变规则集合的演示控件，不是一个完整的 Validation Definition。<strong>报告属于一份输入与一组规则的这次运行。</strong>重新选择数据或规则，应生成对应结果，不能拿旧报告代替新一轮验证。<Cite id="validation-run"/></p>
    </ArticleSection>
    <ArticleSection id="boundary" title="通过规则，不代表全部真实" className={base.offset}><Legacy slug="data-validation" names={["prompt-heading"]}/>
      <p>年龄 24 在规定范围内，也可能与本人实际年龄不符。验证不会自动知道未提供的事实，没写进规则的要求它也管不到。<ConceptTerm slug="data-quality">数据质量</ConceptTerm>的判断范围更广，还要考虑来源真实性、遗漏、重复和时效；所有记录都通过当前规则，不代表这些方面也没有问题。</p>
      <ArticleAside title="浏览器里的提示不能代替服务端检查"><p id="validation-boundary" className="vp-citation-target">OWASP 指出客户端检查可以被绕过，服务端必须在处理输入前执行相应验证；两边检查服务于不同目的。这里的“接口”可以理解为服务端接收数据的入口；用户可以不点网页按钮，直接向这个入口发送 `age: &quot;24&quot;`，服务端仍要按自己的规则拒绝或隔离它。浏览器提示帮助用户及时修正，服务端检查守住实际入口；服务端也只能判断已经写进规则的条件，不能凭空证明真实年龄。<strong>本页能让你观察规则的结果，不构成真实系统的数据保护。</strong><Cite id="validation-boundary"/></p></ArticleAside>
      <p>验证规则需要覆盖必填字段、类型、范围和字段关系，并约定失败后的处理。报告区分未检查（本次未启用或不适用）、检查失败和检查通过，附上输入范围与规则版本。格式和关系通过以后，现实事实仍需另行核对。</p>
    </ArticleSection>
  </ConceptArticle>;
}
