import { Archive, FileText, CurrencyCircleDollar, Funnel } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { IngestionLesson, TransformationLesson, ValidationLesson } from './DataFlowConceptLessons';
import { ingestionSources, transformationSources, validationSources } from '@/lib/dataflow-sources';
import base from './EventConcepts.module.css';
import s from './DataFlowConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function IngestionTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={ingestionSources}/>;
  return <ConceptArticle slug="data-ingestion" title="数据接入" sources={ingestionSources} sections={[["entry", "把来源数据接进来"], ["position", "读到哪里，保存到哪里"], ["restart", "重启后可能再次读取"], ["reconcile", "接进来以后，还要核对"]]}
    intro={<>图书馆的借阅记录不断增加，报表系统要把新增记录接进原始层。接入要回答两个问题：哪些数据已经保存，下一次从哪里继续。读到一条记录，与可靠地保存了它，是不同的进度。</>}
    hero={<ConceptHero slug="data-ingestion" label="来源记录被接入原始层，确认位置在写入后保存"><div className={s.ingestionHero}><div className={s.heroLog}><FileText size={25}/><code>1 · loan-1</code><code>2 · loan-2</code></div><div className={s.heroDestination}><Archive size={25}/><strong>原始层</strong><span>2 个不同事件</span></div><div className={s.heroCursor}>写入完成 → 确认位置 2</div></div></ConceptHero>}>
    <ArticleSection id="entry" title="把来源数据接进来"><Legacy slug="data-ingestion" names={["question", "definition"]}/>
      <p id="ingestion-entry" className="vp-citation-target"><strong>数据接入把数据库、文件、API 或事件流中的数据收集到目标系统，供后续存储与处理。</strong>AWS 将它描述为数据进入处理流程的入口，也区分批量、流式与微批方式。一套接入系统可能附带基础检查或预处理；本文只讲来源读取与目标保存这两步，清洗、汇总与发布不在这里展开。这里把原始层当作接入后的第一落点：先保留来源记录和原始值，后面的转换、验证与汇总再读取它。<Cite id="ingestion-entry"/></p>
      <div className={base.contrast}><div><h3>数据接入</h3><p>从借阅来源拿到记录，保存事件身份与原始值，并记录读取位置。</p></div><div><h3>数据管道</h3><p>把接入、验证、转换、统计和发布连接成完整流程。接入做完，只代表整个流程里的一步结束。</p></div></div>
      <p id="ingestion-modes" className="vp-citation-target">一次导入当天文件是批量接入，读完这批就结束；持续消费借阅事件是流式接入，一直跟着来源读。微批介于两者之间：先把一小段时间内到达的记录攒起来，再一次性处理这一小批，所以会比纯流式多一点等待，换来更小、更容易控制的处理单元。<strong>先弄清楚来源多久更新一次、数据需要新到什么程度，以及如何标记记录，再选接入方式。</strong>例如日报只需每天汇总一次，可以选择批量；需要尽快看到新借阅时，才考虑流式或微批。“实时”这个词本身不能说明延迟、可靠性或处理结果。<Cite id="ingestion-modes"/></p>
    </ArticleSection>
    <ArticleSection id="position" title="读到哪里，保存到哪里"><Legacy slug="data-ingestion" names={["scene-heading"]}/>
      <p id="ingestion-position" className="vp-citation-target">增量接入需要一个继续读取的依据。这里先把三个容易混用的词分开：本页演示的“确认位置”是已经可靠写入后的进度；连接器保存的“偏移量”是来源中的位置记录；Airbyte 所说的“游标”是用来判断哪些记录算新数据的字段或字段值。按顺序读取事件时，三者可能指向同一个位置；按表格增量读取时，游标可能是 `updated_at` 这样的时间值，而不是第几条记录。`updated_at` 就是记录上表示“最后更新时间”的字段。数据改变却没有更新这个字段时，增量查询可能漏掉变化。<strong>读取位置依赖来源约定，不能随便挑一个时间字段。</strong><Cite id="ingestion-position"/></p>
      <p>演示的事件日志固定有位置 1、2、3，用它来区分暂存、原始层和已保存的位置。先读取前两条，让写入失败：确认位置不会前移。成功写入后，暂时不要保存位置，直接重启；你会看到原始层仍有数据，接入进程却需要重新读取。本例的原始层和确认位置是浏览器里的模拟状态，重启后仍然保留；这里没有真实磁盘，也没有连接器。真实系统要把它们写入可靠存储，才能在进程重启后恢复。</p>
      <IngestionLesson/>
      <p>演示按事件 ID 计数，所以重读 loan-1、loan-2 后重新写入，原始层仍是这两条，不会因为重复送达变成四条。只有把确认位置保存为 2，才能继续读取第 3 条；事件身份用来识别重复，不等于确认位置已经前移。</p>
      <p><strong>确认位置表示这段输入已经被可靠处理，不只是代码碰巧读到了这里。</strong>本例把写入与确认分成两个可观察动作；真实产品可能用事务把数据写入和进度提交绑在一起，也可能先写入再单独提交消费进度。事务会把一组写入绑在一起：要么全部成功，要么全部失败。这里说的“提交”，就是把这次成功处理过的进度正式保存下来；但真正出故障时会怎么样，仍要看连接器和目标存储的实现。</p>
    </ArticleSection>
    <ArticleSection id="restart" title="重启后可能再次读取"><Legacy slug="data-ingestion" names={["quiz-heading"]}/>
      <p id="ingestion-restart" className="vp-citation-target">Debezium 的 PostgreSQL 连接器在进程异常退出后，从先前保存的偏移量恢复。刚处理过、尚未保存偏移量的事件，可能再次产生。<strong>收到重复事件可以是恢复流程的正常结果，并不一定意味着来源新增了一条业务记录。</strong><Cite id="ingestion-restart"/></p>
      <p id="ingestion-duplicates" className="vp-citation-target">本例用来源提供的 loan-1 这类稳定事件 ID 保留一份原始记录；如果来源没有稳定 ID，就要先约定主键或组合主键，不能临时按内容相似去重。Airbyte 的 Append + Deduped 模式里，主键是识别同一个实体的字段；历史表可以留下每次同步看到的版本，最终表则按游标只保留每个主键最新的一行。比如同一笔借阅的归还状态后来变了，这是同一个实体的新版本，不是同一事件被重复送达。<strong>“同一个事件重复送达”与“同一个实体产生新版本”，需要不同的身份和处理规则。</strong>不能只因为两条记录内容看起来一样，就删掉其中一条。<Cite id="ingestion-duplicates"/></p>
      <ArticleAside title="变更数据捕获也要有起点"><p id="ingestion-cdc" className="vp-citation-target">变更数据捕获（CDC）是只接收数据库变化的接入方式，用来把插入、更新和删除持续送到另一个系统。Debezium 的 PostgreSQL 连接器通常先做一致性快照，再从事务日志捕获已经提交的行级变化；这里的“已提交”指事务已经正式完成，连接器不会把尚未完成的中间状态当成最终变化。快照可以理解为某个时点的完整起点，事务日志则记录起点之后的变化。来源删除是否让目标删除，取决于目标系统对删除事件的处理规则；原始层也可以保留这条删除事件，交给下游决定。这是该连接器的机制，不是所有接入都必须使用数据库日志。快照结束后从哪个日志位置接上、日志要保留多久，这些都要衔接好，不能认为“连接建立了”就已经拿到了完整历史。<Cite id="ingestion-cdc"/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="reconcile" title="接进来以后，还要核对" className={base.offset}><Legacy slug="data-ingestion" names={["prompt-heading"]}/>
      <p id="ingestion-reconcile" className="vp-citation-target">来源和目标都显示三条，仍可能有一条保存了错误值。在借阅例子里，loan-1 这样的事件身份就是把来源与目标记录对上的依据；实际的数据表通常使用主键或组合主键。AWS DMS 的数据验证会用记录身份找到对应的目标行，逐行比较内容并报告差异，而不只检查总行数；这样的查询会额外占用来源、目标和网络资源。<strong>数量一致只是证据的一部分。</strong>核对还得说清楚：比的是哪个范围、按什么身份把记录对上、比哪些内容。如果来源本身的业务值就是错的，来源与目标一致也不能证明它合理，那属于后续规则检查要回答的问题。<Cite id="ingestion-reconcile"/></p>
      <p>接入结果应保留来源、事件身份、读取位置和接入批次，失败记录要能够重新定位。格式正确与业务合理是后续 <ConceptTerm slug="data-validation">数据验证</ConceptTerm> 的职责；原始层保留记录，不代表每个字段都已经可信。</p>
      <p>接入程序要明确来源格式、增量依据、记录身份和目标写入规则。验收时分别检查写入失败、写入成功但确认位置没保存、来源更新或删除、重复交付这几种情况，并用来源与目标的记录核对结果。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function TransformationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={transformationSources}/>;
  return <ConceptArticle slug="data-transformation" title="数据转换" sources={transformationSources} sections={[["rules", "让字段遵循同一套规则"], ["units", "数字之外，还要知道单位"], ["precision", "精度与舍入要先约定"], ["grain", "汇总会改变一行的含义"]]}
    intro={<>三份借阅费用分别写成 ¥12.30、CNY 12.30 和 1230 分。报表不能直接把这些字符串相加。数据转换用明确的规则统一表示，同时保留原始值，避免把不确定的信息悄悄变成一个确定数字。</>}
    hero={<ConceptHero slug="data-transformation" label="三种已声明的金额表示转换成CNY的1230整数分"><div className={s.transformHero}><div className={s.heroOriginal}><CurrencyCircleDollar size={25}/><code>¥12.30</code><code>CNY 12.30</code><code>1230 分</code></div><div className={s.heroStamp}><span>已声明单位</span><strong>1230</strong><span>整数分 · CNY</span></div></div></ConceptHero>}>
    <ArticleSection id="rules" title="让字段遵循同一套规则"><Legacy slug="data-transformation" names={["question", "definition"]}/>
      <p id="transform-definition" className="vp-citation-target"><strong>数据转换按照明确规则，改变数据的表示、字段结构、值或统计粒度，让它适合后续使用。</strong>例如拆出日期、统一金额单位，或者按书目汇总借阅次数。dbt 的 SQL model 用 SELECT 描述结果，运行时由 dbt 按配置物化为视图或表；SQL 是一种实现方式，转换并不限定使用 dbt。<Cite id="transform-definition"/></p>
      <div className={s.ruleList}><div><h3>输入约定</h3><p>字段来自哪里？值的单位、币种和精度是什么？缺失或不认识的值怎样保留？</p></div><div><h3>输出约定</h3><p>统一为 CNY 的整数分，保留来源行 ID。超出约定的输入进入待处理结果，不擅自补一个金额。</p></div></div>
      <p>“转成数字”只解决表示问题。<strong>先说清数字代表什么，再写类型转换和计算。</strong>输入格式、映射规则、异常处理和输出口径都应该能被复查。</p>
    </ArticleSection>
    <ArticleSection id="units" title="数字之外，还要知道单位"><Legacy slug="data-transformation" names={["scene-heading"]}/>
      <p>A、B、C 三条的单位已知，可以统一为 1230 分。D 只有“1230”：如果它代表分，结果是 1230；如果代表元，结果是 123000。转换器不能凭相似的数字猜出处。下面的“已确认”选项代表你从来源说明中取得了单位，不代表程序自动识别。</p>
      <TransformationLesson/>
      <p>这是固定教学记录和浏览器中的字段计算，不会处理真实费用。D 未确认时保留原值与原因，不进入合计。修改单位或输入后，必须重新执行；旧输出不再作为当前规则的结果。</p>
      <p id="transform-type" className="vp-citation-target">PostgreSQL 区分整数、精确 numeric 和近似浮点数；声明 numeric 的精度与小数位数，会影响可保存的值和舍入行为。但这些数值类型并不会自动声明业务单位。<strong>amount_cents、currency 和来源单位的约定，需要数据设计者补充。</strong>本例选择整数分；其他场景可以采用适当的十进制类型与明确精度。<Cite id="transform-type"/></p>
    </ArticleSection>
    <ArticleSection id="precision" title="精度与舍入要先约定"><Legacy slug="data-transformation" names={["quiz-heading"]}/>
      <p id="transform-precision" className="vp-citation-target">Python 的 decimal 文档说明，十进制运算可以准确表示十进制输入，但精度、舍入和异常仍由上下文控制。把一个浮点数交给 Decimal，会精确转换那个已经近似的浮点值；从十进制字符串构造才能保留相应输入。<strong>选了一个精确类型，不等于已经选好舍入规则。</strong><Cite id="transform-precision"/></p>
      <pre className={base.code}>{'from decimal import Decimal\nDecimal("12.30") * 100\n# Decimal("1230.00")'}</pre>
      <p>这个固定例子说明按元换算为分，不能把它当作任意输入的完整处理程序。本页规则只接受最多两位小数，所以 12.345 元会被保留待处理；其他系统可以选择明确的舍入策略，但应说明发生了什么。PostgreSQL 的声明精度可触发舍入，也与本页主动拒绝的教学策略不同。</p>
      <ArticleAside title="转换结果要能回到原始值"><p>输出 1230 分，还应能找到 A 的原始字符串 ¥12.30、所用规则和来源。覆盖原始值以后，发现单位错误就很难重新计算。规则发生变化，应重新转换受影响记录，再检查后续汇总；不能只改报表标签。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="grain" title="汇总会改变一行的含义" className={base.offset}><Legacy slug="data-transformation" names={["prompt-heading"]}/>
      <p id="transform-grain" className="vp-citation-target">逐条转换后，一行仍代表一条费用记录；按书目汇总后，一行变成某本书的合计。PostgreSQL 的 sum 只对非 NULL 输入求和，没有输入行时返回 NULL，而不是自动返回零。<strong>一个合计不能单独说明原始记录是否齐全。</strong>本例显式保留待处理数量，并把总数标为“仅已转换记录合计”。<Cite id="transform-grain"/></p>
      <div className={base.contrast}><div><h3>3690 分</h3><p>单位未知时，A、B、C 的部分合计。它没有包含 D，不能标成四条记录的全部费用。</p></div><div><h3>4920 分</h3><p>D 被确认是分以后，四条正常精度记录的合计。改变规则后重新计算，原始数据仍保留。</p></div></div>
      <p>转换规则应附原始样例，写清单位、类型、输出粒度、精度和非法值处理。每次运行记录字段如何变化、排除了哪些记录，以及下游判断结果是否完整所需的数量。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function ValidationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={validationSources}/>;
  return <ConceptArticle slug="data-validation" title="数据验证" sources={validationSources} sections={[["contract", "把要求写成可检查的规则"], ["check", "逐条解释验证结果"], ["report", "报告要指向具体字段"], ["boundary", "通过规则，不代表全部真实"]]}
    intro={<>读者资料里，年龄是 −2、城市写成 ??，或者年龄看起来是 24，却以字符串保存。数据验证逐项检查约定，把符合要求的记录与需要处理的记录分开，也让失败有一个能追查的理由。</>}
    hero={<ConceptHero slug="data-validation" label="整数年龄与字符串年龄被区别检查，失败字段留下可读原因"><div className={s.validationHero}><div className={s.heroGrid}><div><code>age: 24</code><span>整数 ✓</span></div><div><code>age: −2</code><span>范围 ×</span></div><div><code>city: ??</code><span>城市 ×</span></div><div><code>age: &quot;24&quot;</code><span>类型 ×</span></div></div><div className={s.heroBeam}/><div className={s.heroReport}><Funnel size={16}/> 1 条通过 · 3 条待处理</div></div></ConceptHero>}>
    <ArticleSection id="contract" title="把要求写成可检查的规则"><Legacy slug="data-validation" names={["question", "definition"]}/>
      <p id="validation-contract" className="vp-citation-target"><strong>数据验证按约定检查输入，给出通过或失败的结果与原因。</strong>规则可以约束类型、必填、范围、格式及字段关系。JSON Schema 区分 properties 与 required：描述了属性怎样检查，不等于它必须出现；属性缺失也不同于属性值为 null。要求必须明确，验证器才能检查。<Cite id="validation-contract"/></p>
      <p id="validation-levels" className="vp-citation-target">OWASP 区分语法与语义层的验证：格式满足要求以后，还要检查是否符合业务关系，例如开始日期是否早于结束日期。<strong>数字写得合法、字段关系合理，是两种检查。</strong>它们都依赖业务要求，不能仅用一个正则表达式代替全部判断。<Cite id="validation-levels"/></p>
      <div className={base.contrast}><div><h3>验证</h3><p>年龄是字符串 &quot;24&quot;，与约定整数不符。保留原值，给出类型失败原因。</p></div><div><h3>转换</h3><p>若来源明确允许数字字符串，可以按单独规则转换为整数，再验证。规则不同，要留下记录。</p></div></div>
    </ArticleSection>
    <ArticleSection id="check" title="逐条解释验证结果"><Legacy slug="data-validation" names={["scene-heading"]}/>
      <p>这里的类型要求始终启用，年龄范围与城市名单可以开关。SH / BJ 只是本站示例允许的两个代码，不是完整城市标准。默认只有 A 通过；关闭范围规则后，B 的 −2 并没有变成合理年龄，只是这次不再检查它。</p>
      <ValidationLesson/>
      <p>演示按固定快照 s1 重新计算，不运行 JSON Schema、SHACL 或远端校验服务。字符串年龄不会自动转型；类型失败后，范围检查标为不适用。修改规则会收起旧报告，重新运行才得到对应结果。</p>
      <p><strong>失败不一定意味着删除整条记录。</strong>可以拒绝本次输入、隔离并修复，或按明确规则允许部分处理。本页选择保留原始记录并隔离；如果后续只使用通过的记录，应同时报告未处理的数量和原因。</p>
    </ArticleSection>
    <ArticleSection id="report" title="报告要指向具体字段"><Legacy slug="data-validation" names={["quiz-heading"]}/>
      <p id="validation-report" className="vp-citation-target">W3C 的 SHACL 规范针对 RDF 图，验证结果可以记录相关节点、属性路径、值与失败约束。这里借鉴的是可定位的报告结构，没有把它当作 JSON 验证器。<strong>“有三条错误”只能告诉你规模；记录、字段、原值与规则才能帮助处理。</strong><Cite id="validation-report"/></p>
      <div className={s.reportFields}><div><h3>定位问题</h3><code>D → age → &quot;24&quot;</code><p>哪条记录、哪个字段、收到的原始值是什么？保留字符串与数字的区别。</p></div><div><h3>解释判断</h3><code>要求整数 → 类型失败</code><p>哪条规则生效，为什么没有通过？没有启用的规则不能显示成检查通过。</p></div></div>
      <p id="validation-run" className="vp-citation-target">Great Expectations 将一批数据交给 Validation Definition 执行，结果包含所用 Expectation 的通过情况与解释信息，运行后还可以保存报告。<strong>报告属于一份输入与一组规则的这次运行。</strong>重新选择数据或规则，应生成对应结果，不能拿旧报告代替新一轮验证。<Cite id="validation-run"/></p>
    </ArticleSection>
    <ArticleSection id="boundary" title="通过规则，不代表全部真实" className={base.offset}><Legacy slug="data-validation" names={["prompt-heading"]}/>
      <p>年龄 24 在规定范围内，也可能与本人实际年龄不符。验证不会自动知道未提供的事实，也检查不到没有写出的规则。所有记录都通过，仍要考虑来源真实性、遗漏、重复和时效等 <ConceptTerm slug="data-quality">数据质量</ConceptTerm> 问题。</p>
      <ArticleAside title="浏览器里的提示不能代替服务端检查"><p id="validation-boundary" className="vp-citation-target">OWASP 指出客户端检查可以被绕过，服务端必须在处理输入前执行相应验证；两边检查服务于不同目的。浏览器提示帮助用户及时修正，服务端检查守住实际入口。<strong>本页能让你观察规则的结果，不构成真实系统的数据保护。</strong><Cite id="validation-boundary"/></p></ArticleAside>
      <p>验证规则需要覆盖必填字段、类型、范围和字段关系，并约定失败后的处理。报告区分未检查、检查失败和检查通过，附上输入范围与规则版本。格式和关系通过以后，现实事实仍需另行核对。</p>
    </ArticleSection>
  </ConceptArticle>;
}
