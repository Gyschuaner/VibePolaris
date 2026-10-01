import { Clock } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { DatasetLesson, QualityLesson, LineageLesson } from './ProvenanceConceptLessons';
import { datasetSources, qualitySources, lineageSources } from '@/lib/provenance-sources';
import base from './EventConcepts.module.css';
import s from './ProvenanceConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function DatasetTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={datasetSources}/>;
  return <ConceptArticle slug="dataset-data" title="数据集" sources={datasetSources} sections={[["collection", "一组有范围的数据"], ["snapshot", "来源更新，旧版本仍要可查"], ["description", "数据之外，还需要说明"], ["use", "先判断是否适合这次用途"]]}
    intro={<>“九月借阅数据”听起来明确，但还少了几个边界：哪几天、哪些记录、哪个版本。一组数据可以不断更新；某次报表实际用过的那一份，需要能够被准确找回。</>}
    hero={<ConceptHero slug="dataset-data" label="来源新增D后，旧快照v1仍保留ABC，新快照v2包含ABCD"><div className={s.datasetHero}><div className={s.heroVersion}><strong>v1 · 3 条</strong><code>A　B　C</code><span>旧范围与来源</span></div><span className={s.heroArrival}>来源新增 D</span><div className={s.heroVersion}><strong>v2 · 4 条</strong><code>A　B　C　D</code><span>扩大范围后保存</span></div></div></ConceptHero>}>
    <ArticleSection id="collection" title="一组有范围的数据"><Legacy slug="dataset-data" names={["question", "definition"]}/>
      <p id="dataset-definition" className="vp-citation-target"><strong>数据集是被组织在一起、可以作为一组来描述和使用的数据。</strong>它可以是借阅记录、图片、文本或声音，不限于机器学习样本。W3C 的 DCAT 把数据集本身和可获取的具体表示分开：同一份数据可以提供 CSV 和 JSON 两种分发形式，下载文件不同，不一定是两套不同内容。分发形式回答“怎样拿到”，数据集还要说明“包含什么、范围到哪里”。<Cite id="dataset-definition"/></p>
      <p>“一行代表一次借阅”“只包含九月前两天”“保留稳定事件 ID”，这些约定决定这组记录的含义，也划出了数据集的边界。文件名写成 loans.csv，不能独自说明它收录了什么；一个文件也可能只是一份数据集的某个分发或切片。</p>
      <div className={base.contrast}><div><h3>数据集</h3><p>关心数据集合的身份、范围与使用约定，可以跨多个文件或接口分发。</p></div><div><h3>DataFrame</h3><p>程序里组织、选择和计算表格数据的结构。它可以装载数据集的一部分，不自动补齐来源、版本和范围说明。</p></div></div>
    </ArticleSection>
    <ArticleSection id="snapshot" title="来源更新，旧版本仍要可查"><Legacy slug="dataset-data" names={["scene-heading"]}/>
      <p>第一次读取的是来源 s1：有 A、B、C 和八月的 E。把范围限定为九月 1—2 日后，快照只包含 A、B、C；保存它就是 v1。来源后来新增九月 3 日的 D，演示把来源切到 s2，再把范围延长到 9 月 3 日并保存，下一版才包含 A、B、C、D。E 仍在范围外，v1 也仍然是原来的三条。来源和范围都改变时，要把新快照与旧快照分开。</p>
      <DatasetLesson/>
      <p>这里复制固定记录来模拟快照，只保存在浏览器内存；重置会重新开始。快照至少要能对应当时的来源、范围和记录集合。<strong>版本标识需要对应可重新取得的数据，不能只留下“v1”这个名字。</strong>真实存储还要明确快照保存、保留期限与访问方式。</p>
      <p id="dataset-version" className="vp-citation-target">DCAT 3 可以描述版本标识、前一版本与当前版本等关系。这些元数据帮助识别版本，但不会替你保存数据。一个持续更新的数据集与其中某个时刻的版本，可以分别有自己的身份；引用报表结果时，应说明实际使用了哪一份，以及它的范围和分发形式。<Cite id="dataset-version"/></p>
      <p id="dataset-identity" className="vp-citation-target">DVC 的 .dvc 文件记录被跟踪文件或目录的路径、内容校验值及大小等信息，也能记录云存储的版本 ID。<strong>路径回答在哪里，内容标识帮助判断拿到的是不是那一份。</strong>这是 DVC 的具体机制；本页没有计算内容哈希，也没有运行 DVC。<Cite id="dataset-identity"/></p>
    </ArticleSection>
    <ArticleSection id="description" title="数据之外，还需要说明"><Legacy slug="dataset-data" names={["quiz-heading"]}/>
      <p id="dataset-scope" className="vp-citation-target">Gebru 等人的《Datasheets for Datasets》面向机器学习数据，提出记录创建目的、组成、收集过程、处理、用途、分发与维护。作者也说明问题要按场景取舍，文档不是自动填表就能完成的检查。<strong>借鉴到借阅报表，先说清收录范围、每条记录代表什么，以及哪些数据没有被收录。</strong><Cite id="dataset-scope"/></p>
      <div className={s.documentFields}><div><h3>这份数据是什么</h3><p>一次借阅一条记录；来自教学来源 s1；9 月 1—2 日；字段为事件 ID、借阅日期与书目编号。八月的 E 被范围排除。</p></div><div><h3>使用前还要知道什么</h3><p>是否覆盖全部来源、有哪些缺失与修正、由谁维护、何时更新，以及允许怎样使用。未知信息应明确留下。</p></div></div>
      <p id="dataset-card" className="vp-citation-target">Hugging Face 的 Dataset Card 是数据仓库里的 README，用来描述数据内容、使用背景和限制；元数据可以标记许可证、语言和规模。它说明怎样理解和使用数据，不等于数据文件本身，也不能代替对内容的检查。<strong>字段列表、样例和限制应与当前版本一起更新。</strong><Cite id="dataset-card"/></p>
    </ArticleSection>
    <ArticleSection id="use" title="先判断是否适合这次用途" className={base.offset}><Legacy slug="dataset-data" names={["prompt-heading"]}/>
      <p>九月前两天的三条记录，可以解释本例快照，却不能当成全月借阅量。样本多、文件大，也不能直接证明覆盖完整或符合实际分布。<strong>先匹配任务所需范围，再检查质量与使用约定。</strong>这些判断连接到 <ConceptTerm slug="data-quality">数据质量</ConceptTerm>；适用范围、数据版本和质量证据要一起看。</p>
      <ArticleAside title="说明书也有它的边界"><p id="dataset-limits" className="vp-citation-target">《Datasheets for Datasets》明确指出，文档不能完整解决偏差、风险或所有潜在用途；数据更新较少时，更新版本也应有更新的说明。<strong>文档提供判断依据，不替使用者做完判断。</strong>缺少收集过程或适用范围时，文件名不足以支持使用结论。<Cite id="dataset-limits"/></p></ArticleAside>
      <p>使用一份数据集前，先确定用途、字段含义、范围和具体版本。处理过程应交代读取了哪些记录、是否保留原始值，以及输出怎样追到输入。发布前核对记录身份与数量，并保存实际使用的版本。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function QualityTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={qualitySources}/>;
  return <ConceptArticle slug="data-quality" title="数据质量" sources={qualitySources} sections={[["purpose", "质量要放到用途里判断"], ["measure", "同一批数据，换一种要求"], ["dimensions", "把不同问题分别量出来"], ["evidence", "规则通过，还要看事实"]]}
    intro={<>一份三小时前的借阅快照，可能够用来整理月报，却赶不上实时库存。数据质量不是一张脱离用途的总分，而是数据在特定任务、指标和门槛下是否够用。</>}
    hero={<ConceptHero slug="data-quality" label="同一份三小时前快照在月报24小时门槛下通过，在实时库存30秒门槛下未通过"><div className={s.qualityHero}><div className={s.heroAge}><Clock size={24}/><span>同一快照</span><strong>3 小时</strong></div><div className={s.heroPolicy}><strong>月报参考</strong><span>≤ 24 小时</span><span>时效通过 ✓</span></div><div className={s.heroPolicy}><strong>实时库存</strong><span>≤ 30 秒</span><span>时效未通过</span></div></div></ConceptHero>}>
    <ArticleSection id="purpose" title="质量要放到用途里判断"><Legacy slug="data-quality" names={["question", "definition"]}/>
      <p id="quality-purpose" className="vp-citation-target"><strong>数据质量描述一份数据适合某种用途的程度。</strong>W3C 的 Data Quality Vocabulary 是工作组说明文档，用来表达质量维度、指标、测量值与政策；质量测量要指向被测数据，说明用什么指标算出什么值。它强调质量与使用者需求有关，并没有规定一份放之四海皆准的“高质量”定义。判断前，先明确谁要用、做什么，以及不能接受哪些问题。<Cite id="quality-purpose"/></p>
      <p>实时库存关心刚发生的借阅是否已经反映出来；月报参考对分钟级延迟可能不敏感，却需要覆盖正确的月份。两种用途都可能在意缺失与重复，但接受门槛要由业务约定。<strong>用途变化，合格结论可以变化，原始数据不必跟着改变。</strong>先固定数据版本和观察时刻，再说明本次结论按哪组门槛得出。</p>
    </ArticleSection>
    <ArticleSection id="measure" title="同一批数据，换一种要求"><Legacy slug="data-quality" names={["scene-heading"]}/>
      <p>固定的十条教学记录中，九条有书目编号，十个 ID 中有九个不同值。两个用途都暂定这两项至少 90%；月报允许快照距观察时刻不超过 24 小时，实时库存只允许 30 秒。<strong>这些阈值专为演示设定，不是行业标准或真实库存上线条件。</strong>演示先用三小时前的快照，再换成 12 秒前的快照，另外可以再缺一条书目编号。</p>
      <QualityLesson/>
      <p>完整性按“书目非空记录数 ÷ 十条记录”计算；不同 ID 占比按“不同 ID 数 ÷ 十条记录”计算。默认月报看到 9/10、9/10 和 3 小时，三项都过门槛；切到实时库存后，只有 30 秒时效这一项失败。换成 12 秒前的快照可以让实时库存通过，但不能补齐缺失字段；再缺一条书目编号会把完整性降到 8/10。不同 ID 占比能暴露重复，但不是所有系统对唯一性的统计口径；两条 e9 的书目不同，这个比例也没有检查内容冲突。时效是固定观察时刻与快照时间的差，没有后台时钟或实际连接。</p>
      <p id="quality-record" className="vp-citation-target">DQV 把质量测量关联到被测数据、指标和测量值，也可以说明所遵循的政策。<strong>一份质量报告要能回答：测了哪份数据，用什么计算口径，按哪组门槛判断。</strong>只保存“通过”两个字，难以说明后来为什么出现不同结论；换了数据版本、观察时刻或政策，旧结论也不能直接沿用。<Cite id="quality-record"/></p>
    </ArticleSection>
    <ArticleSection id="dimensions" title="把不同问题分别量出来"><Legacy slug="data-quality" names={["quiz-heading"]}/>
      <p id="quality-dimensions" className="vp-citation-target">英国政府数据质量框架列出完整性、唯一性、一致性、时效性、有效性和准确性，并提醒这些维度不是每个组织必须照搬的固定清单。完整性问记录和重要字段是否齐全，唯一性问是否重复，有效性问格式或范围是否符合约定，准确性问值是否符合现实。<strong>字段齐全、格式合法和符合现实，分别回答不同问题。</strong>需要哪些指标，仍由本次用途决定。<Cite id="quality-dimensions"/></p>
      <div className={s.dimensions}><div><h3>完整与唯一</h3><p>需要的记录和字段是否齐全？同一事件是否重复进入？两项要分开算。</p></div><div><h3>时效与一致</h3><p>数据是否来得及支持决策？不同表里同一本书的状态是否相互矛盾？</p></div><div><h3>有效与准确</h3><p>书目编号符合约定格式，不代表它真的对应读者借走的那本书。</p></div></div>
      <p id="quality-automation" className="vp-citation-target">Deequ 是构建在 Apache Spark 上的库，可以把完整性、唯一性和行数等要求写成“数据单元测试”，在大数据集上计算指标并判断约束。自动化能持续执行明确规则，发现缺失、重复或范围问题；没有写出的要求仍然不会凭空出现。<strong>检查结果需要回到具体规则和失败记录。</strong>本页使用少量浏览器记录计算，没有运行 Spark 或 Deequ。<Cite id="quality-automation"/></p>
    </ArticleSection>
    <ArticleSection id="evidence" title="规则通过，还要看事实" className={base.offset}><Legacy slug="data-quality" names={["prompt-heading"]}/>
      <p id="quality-fact" className="vp-citation-target">政府框架区分完整性与准确性：所有字段都有值，仍然可能是错误值。<strong>检测值是否符合规则，与核对它是否反映真实业务，是不同的证据。</strong>借阅系统可能要与实际事件或权威来源核对；关掉一项检查，也不能让原来的问题自动消失。<Cite id="quality-fact"/></p>
      <ArticleAside title="总分遮住的质量差异"><p id="quality-score" className="vp-citation-target">AWS Glue Data Quality 把质量分数定义为规则判断为真的比例。因此，90 分表示规则通过比例，不直接表示 90% 的记录真实或准确；规则本身怎样定义，决定这个数字能回答什么。<strong>先看分子的规则是什么，再看关键规则有没有失败。</strong>本例逐项展示门槛，不把时效失败藏进一个平均分。<Cite id="quality-score"/></p></ArticleAside>
      <p>质量报告应写明用途、数据版本、观察时刻，以及每项指标的分子、分母和门槛。失败记录需要定位位置与处理方式；缺失、未检查和检查失败分别统计。对现实情况的判断仍要补充外部证据。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function LineageTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={lineageSources}/>;
  return <ConceptArticle slug="data-lineage" title="数据血缘" sources={lineageSources} sections={[["relations", "从结果找到来源与过程"], ["trace", "同一份输入，两个报表值"], ["impact", "字段变化影响的下游输出"], ["history", "当前关系与历史记录要分开"]]}
    intro={<>报表的合计从 2000 分变成 1800 分，需要查明是输入变化还是规则变化。数据血缘把来源、处理过程和结果关联起来，让一个数字有可以向上追查的路径。</>}
    hero={<ConceptHero slug="data-lineage" label="1800分输出关联run43、减去优惠的规则和amount与discount两个输入字段"><div className={s.lineageHero}><div className={s.heroOutput}><strong>1800 分</strong><span>daily.total · v2</span></div><div className={s.heroRun}><code>run-43 · 规则 v2</code><code>sum(amount − discount)</code></div><div className={s.heroInputs}><code>amount</code><code>discount</code></div></div></ConceptHero>}>
    <ArticleSection id="relations" title="从结果找到来源与过程"><Legacy slug="data-lineage" names={["question", "definition"]}/>
      <p id="lineage-relations" className="vp-citation-target"><strong>数据血缘记录数据与处理之间的依赖，帮助追查一个结果怎样产生、哪些后续结果依赖它。</strong>W3C PROV 的通用来源模型区分实体、活动和参与者，也描述使用、生成与派生关系。借到数据场景，输入表、处理任务与输出表各有不同身份；知道两个表相关，还需要知道中间实际做了什么。<Cite id="lineage-relations"/></p>
      <p>向上看，是“这个合计来自哪些输入”；向下看，是“这份输入改变后，哪些输出可能需要复查”。<strong>依赖关系给出调查范围，不自动证明数据正确，也不自动执行修复。</strong></p>
    </ArticleSection>
    <ArticleSection id="trace" title="同一份输入，两个报表值"><Legacy slug="data-lineage" names={["scene-heading"]}/>
      <p>费用来源 s1 只有 A、B 两条，金额分别为 1200、800 分，优惠为 200、0 分。旧规则合计 amount 得到 2000；新规则先减去 discount，再合计得到 1800。两次使用相同输入，规则与运行记录不同。</p>
      <LineageLesson/>
      <p>这个演示展示预先登记的两次教学运行，没有执行 SQL、抓取日志或自动解析血缘。月度合计已登记依赖日合计，所以下游列表能沿这条边继续查找。<strong>源字段保留原值，高亮只表示本次规则是否使用它。</strong></p>
      <p id="lineage-run" className="vp-citation-target">OpenLineage 把 Job 看作定义好的工作，把 Run 看作它某次实际发生的执行；运行事件可携带输入、输出与变化状态，也有不关联 Run 的设计期元数据事件。<strong>任务定义与某次运行记录不能混成一件事。</strong>追查昨日结果，应找到昨日实际使用的输入与规则，而不是只打开今天的代码。<Cite id="lineage-run"/></p>
      <div className={s.lineageComparison}><div><strong>2000 分</strong><code>run-42 · 规则 v1<br/>sum(amount)</code><p>只使用金额字段。优惠存在于输入中，却没有参与这次合计。</p></div><div><strong>1800 分</strong><code>run-43 · 规则 v2<br/>sum(amount − discount)</code><p>金额与优惠共同参与。结果变化来自规则变化，不是新增记录。</p></div></div>
    </ArticleSection>
    <ArticleSection id="impact" title="字段变化影响的下游输出"><Legacy slug="data-lineage" names={["quiz-heading"]}/>
      <p id="lineage-columns" className="vp-citation-target">OpenLineage 的列级血缘可以描述输出列使用了哪些输入列及其转换方式。表级关系只能告诉你“这份报表依赖费用表”；<strong>字段级关系进一步区分金额与优惠是否参与合计。</strong>本例 v1 不读取 discount，v2 则读取它，因此同一个字段在两版规则下的影响范围不同。<Cite id="lineage-columns"/></p>
      <p>展开下游影响，选 discount：旧版的两个合计没有使用它，新版的日合计及依赖日合计的月合计可能受影响。这个列表表示应复查的输出；字段数值还没有被修改，报表也没有在后台重新计算。</p>
      <p id="lineage-impact" className="vp-citation-target">DataHub 可以查看上下游资产，也可以把视图聚焦到一个字段。血缘来自支持采集的来源、接口登记或人工维护，覆盖能力取决于实际接入。<strong>看不到一条边，不足以证明现实中没有依赖。</strong>先检查采集范围、更新时间和手工维护情况，再决定调查是否完整。<Cite id="lineage-impact"/></p>
    </ArticleSection>
    <ArticleSection id="history" title="当前关系与历史记录要分开" className={base.offset}><Legacy slug="data-lineage" names={["prompt-heading"]}/>
      <p id="lineage-history" className="vp-citation-target">DataHub 的这份文档说明，默认 UI 显示最新血缘；时间选择器过滤最新图中关系的更新时间，不会因此还原历史图。<strong>“查看旧日期”与“拿到旧运行的真实依赖”并不总是一回事。</strong>具体系统支持哪种历史能力，需要核对文档和实际保存的记录。<Cite id="lineage-history"/></p>
      <ArticleAside title="有路径，还需要可重现的输入"><p>run-42 指向一个已经被覆盖的文件，仍不能复算昨日的 2000 分。血缘说明关系，<ConceptTerm slug="dataset-data">数据集</ConceptTerm> 版本保留相应输入，规则版本说明当时做了什么。它们要能对应起来，调查才不止于一张图。</p></ArticleAside>
      <p>追查异常结果时，先固定输出版本、运行记录、输入快照和规则版本。沿实际记录逐段核对数据变化，标出尚属推测的依赖，再列出需要重新计算、验证或人工确认的下游输出。</p>
    </ArticleSection>
  </ConceptArticle>;
}
