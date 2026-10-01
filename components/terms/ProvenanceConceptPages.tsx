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
    intro={<>“九月借阅数据”听起来明确，但还少了几个边界：哪几天、哪些记录、哪个版本。一组数据可以不断更新；某次报表实际用过的那一份，要能被准确找回。</>}
    hero={<ConceptHero slug="dataset-data" label="来源新增D后，旧快照v1仍保留ABC，新快照v2包含ABCD"><div className={s.datasetHero}><div className={s.heroVersion}><strong>v1 · 3 条</strong><code>A　B　C</code><span>旧范围与来源</span></div><span className={s.heroArrival}>来源新增 D</span><div className={s.heroVersion}><strong>v2 · 4 条</strong><code>A　B　C　D</code><span>扩大范围后保存</span></div></div></ConceptHero>}>
    <ArticleSection id="collection" title="一组有范围的数据"><Legacy slug="dataset-data" names={["question", "definition"]}/>
      <p id="dataset-definition" className="vp-citation-target"><strong>数据集是被组织在一起、可以作为一组来描述和使用的数据。</strong>它可以是借阅记录、图片、文本或声音，不限于机器学习样本。W3C 的 DCAT 把数据集本身和可获取的具体表示分开：同一份数据可以提供 CSV 和 JSON 两种分发形式；两种下载文件确实不同，它们却不一定是两套不同内容。分发形式回答“怎样拿到”，数据集还要说明“包含什么、范围到哪里”。<Cite id="dataset-definition"/></p>
      <p>“一行代表一次借阅”“只包含九月前两天”“保留稳定事件 ID”，这些约定决定这组记录的含义，也划出了数据集的边界。文件名写成 loans.csv，本身说明不了它收录了什么。一个文件也可能只是数据集的一种分发形式，或其中一部分。</p>
      <div className={base.contrast}><div><h3>数据集</h3><p>关心数据集合的身份、范围与使用约定，可以跨多个文件或接口分发。</p></div><div><h3>DataFrame</h3><p>可以把 DataFrame 想成程序里的一张表格，能在里面直接筛选、计算数据。它可以装载数据集的一部分，但不会自动带上来源、版本和范围说明，也不是一个数据文件。</p></div></div>
    </ArticleSection>
    <ArticleSection id="snapshot" title="来源更新，旧版本仍要可查"><Legacy slug="dataset-data" names={["scene-heading"]}/>
      <p>第一次读取的是来源 s1：有 A、B、C 和八月的 E。把范围限定为九月 1—2 日后，快照只包含 A、B、C；保存它就是 v1。来源后来新增九月 3 日的 D，页面用新的来源 s2 表示当前可读取的版本，s1 仍然是 v1 当时的来源。演示再把范围延长到 9 月 3 日并保存，下一版才包含 A、B、C、D。E 仍在范围外，v1 也仍然是原来的三条。来源和范围都改变时，要把新快照与旧快照分开。</p>
      <DatasetLesson/>
      <p>演示里 A、B、C、D 是每条借阅事件的稳定 ID，行末的 #42 或 #78 是书目编号；同一本书可以出现在不同事件里。来源新增 D 后，即使范围暂时不变，直接保存也会得到一份新快照：来源记为 s2，仍包含三条记录。本例继续扩大范围后保存，才把 D 一起纳入 v2。</p>
      <p>这里复制固定记录来模拟快照，只保存在浏览器内存；重置会重新开始。快照至少要能对应当时的来源、范围和记录集合。<strong>版本标识需要对应可重新取得的数据，不能只留下“v1”这个名字。</strong>真实存储还要明确快照保存、保留期限与访问方式。</p>
      <p id="dataset-version" className="vp-citation-target">DCAT 3 可以描述版本标识、前一版本与当前版本等关系。这些版本关系帮助识别版本，但不会替你保存数据。一个持续更新的数据集与其中某个时刻的版本，可以分别有自己的身份；引用报表结果时，应说明实际使用了哪一份，以及它的范围和分发形式。<Cite id="dataset-version"/></p>
      <p id="dataset-identity" className="vp-citation-target">DVC 的 .dvc 文件记录被跟踪文件或目录的路径、内容校验值及大小等信息，也能记录云存储的版本 ID。<strong>路径回答在哪里，内容标识帮助判断拿到的是不是那一份。</strong>这是 DVC 的具体机制；本页没有计算内容校验值，也没有运行 DVC。<Cite id="dataset-identity"/></p>
    </ArticleSection>
    <ArticleSection id="description" title="数据之外，还需要说明"><Legacy slug="dataset-data" names={["quiz-heading"]}/>
      <p id="dataset-scope" className="vp-citation-target">Gebru 等人的《Datasheets for Datasets》面向机器学习数据，提出记录创建目的、组成、收集过程、处理、用途、分发与维护。作者也说明这些问题要按场景取舍，写文档不是一项照着填表就能完成的任务。<strong>借鉴到借阅报表，先说清收录范围、每条记录代表什么，以及哪些数据没有被收录。</strong><Cite id="dataset-scope"/></p>
      <div className={s.documentFields}><div><h3>这份数据是什么</h3><p>一次借阅一条记录；来自来源 s1；9 月 1—2 日；字段为事件 ID、借阅日期与书目编号。八月的 E 被范围排除。</p></div><div><h3>使用前还要知道什么</h3><p>是否覆盖全部来源、有哪些缺失与修正、由谁维护、何时更新，以及允许怎样使用。没有答案的项，应明确标注为未知。</p></div></div>
      <p id="dataset-card" className="vp-citation-target">Hugging Face 的 Dataset Card 相当于数据集页面上的说明文档（README），用来描述数据内容、使用背景和限制；元数据，也就是描述数据的数据，可以标记许可证、语言和规模。它说明怎样理解和使用数据，不等于数据文件本身，也不能代替对内容的检查。<strong>字段列表、样例和限制应与当前版本一起更新。</strong><Cite id="dataset-card"/></p>
    </ArticleSection>
    <ArticleSection id="use" title="先判断是否适合这次用途" className={base.offset}><Legacy slug="dataset-data" names={["prompt-heading"]}/>
      <p>九月前两天的三条记录，可以解释本例快照，却不能当成全月借阅量。样本多、文件大，也不能直接证明覆盖完整或符合实际分布。<strong>先匹配任务所需范围，再检查质量与使用约定。</strong>这些判断连接到 <ConceptTerm slug="data-quality">数据质量</ConceptTerm>；适用范围、数据版本和质量证据要一起看。</p>
      <ArticleAside title="说明书也有它的边界"><p id="dataset-limits" className="vp-citation-target">《Datasheets for Datasets》明确指出，文档不能完整解决偏差和风险，也无法覆盖所有潜在用途；即使数据很少变化，出了新版本也应配上更新后的说明。<strong>文档提供判断依据，不替使用者做完判断。</strong>缺少收集过程或适用范围时，文件名不足以支持使用结论。<Cite id="dataset-limits"/></p></ArticleAside>
      <p>使用一份数据集前，先确定用途、字段含义、范围和具体版本。处理过程应交代读取了哪些记录、是否保留原始值，以及输出怎样追到输入。发布前核对记录身份与数量，并保存实际使用的版本。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function QualityTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={qualitySources}/>;
  return <ConceptArticle slug="data-quality" title="数据质量" sources={qualitySources} sections={[["purpose", "质量要放到用途里判断"], ["measure", "同一批数据，换一种要求"], ["dimensions", "把不同问题分别量出来"], ["evidence", "规则通过，还要看事实"]]}
    intro={<>图书馆保存了一份三小时前的借阅记录。用它回看本月情况，和用它判断一本书此刻能否借出，对数据的要求不同。数据质量描述数据适合某种用途的程度，判断时要说清具体用途、怎么测、接受什么结果。</>}
    hero={<ConceptHero slug="data-quality" label="同一份三小时前快照在月报24小时门槛下通过，在实时库存30秒门槛下未通过"><div className={s.qualityHero}><div className={s.heroAge}><Clock size={24}/><span>同一快照</span><strong>3 小时</strong></div><div className={s.heroPolicy}><strong>月报参考</strong><span>≤ 24 小时</span><span>时效通过 ✓</span></div><div className={s.heroPolicy}><strong>实时库存</strong><span>≤ 30 秒</span><span>时效未通过</span></div></div></ConceptHero>}>
    <ArticleSection id="purpose" title="质量要放到用途里判断"><Legacy slug="data-quality" names={["question", "definition"]}/>
      <p id="quality-purpose" className="vp-citation-target"><strong>先明确谁要用这份数据、做什么，以及不能接受哪些问题。</strong>W3C 的 Data Quality Vocabulary（简称 DQV）是一份描述数据质量信息的工作组说明文档，没有规定统一的“高质量”定义。它区分质量维度、指标、测量值与政策：完整性是维度，也就是大家关注的方面；“书目编号非空的记录占多少”是指标；9/10 是测量值，也就是实际测出来的数；“本次用途至少接受 90%”是政策，即这次用途接受数据的门槛。把它们分开记录，别人才能知道“通过”是怎样得出的。<Cite id="quality-purpose"/></p>
      <p>实时库存关心刚发生的借阅是否已经反映出来；月报参考对分钟级延迟可能不敏感，却需要覆盖正确的月份。两种用途都可能在意缺失与重复，但接受门槛要由使用数据的人根据错误或延迟会造成的后果来约定。<strong>用途变化，合格结论可以变化，原始数据不必跟着改变。</strong>判断时先固定数据版本和观察时刻，也就是本次拿来比较的时间点，再说明按哪组门槛得出结论。</p>
    </ArticleSection>
    <ArticleSection id="measure" title="同一批数据，换一种要求"><Legacy slug="data-quality" names={["scene-heading"]}/>
      <p>下面的演示固定使用十条教学记录，每条代表一次借阅事件。e1、e2 等 ID 是事件编号，不是读者编号；两次不同借阅应有不同的 ID。#42、#78 是书目编号。九条记录有书目编号，十个事件 ID 中有九个不同值，e9 出现了两次。两个用途都暂定这两项至少 90%；月报允许快照距观察时刻不超过 24 小时，实时库存只允许 30 秒。<strong>这些阈值专为演示设定，不是行业标准或真实库存上线条件。</strong>演示先用三小时前的快照，再换成 12 秒前的快照，还可以去掉一条书目编号。</p>
      <QualityLesson/>
      <p>本例的完整性只算书目字段，按“书目编号非空的记录数 ÷ 十条记录”计算；不同 ID 占比按“不同 ID 数 ÷ 十条记录”计算。默认月报看到 9/10、9/10 和 3 小时，三项都达到门槛；切到实时库存后，只有时效这一项未通过，因为 3 小时超过了 30 秒。换成 12 秒前的快照后，三项都达到实时库存的门槛，但缺失的书目编号没有补齐；再缺一条会把完整性降到 8/10，整体又不通过。点击“恢复用途与数据”，演示会回到默认状态：月报用途、3 小时快照、九条有书目编号。</p>
      <p><strong>达到 90% 的不同 ID 门槛，不等于每个事件 ID 都唯一。</strong>如果实际业务要求一次事件只有一条记录，e9 重复就必须处理。两条 e9 的书目编号还不同，现有数据不能告诉我们是事件编号填错了，还是书目编号填错了，不能只删掉其中一条。这个比例也没有检查内容是否冲突，更不能证明所有应有的借阅都已收录。本例的时效只是拿固定的观察时刻和快照时间做比较，页面背后没有真实的时钟，也没有连接任何真实系统。</p>
      <p id="quality-record" className="vp-citation-target">DQV 可以把质量测量关联到被测数据、指标和测量值，并记录所遵循的质量政策。<strong>一份质量报告要能回答：测了哪份数据，用什么计算口径，按哪组门槛判断。</strong>这样才能区分“旧快照按月报要求通过”和“新快照按库存要求通过”。只保存“通过”两个字，难以说明后来为什么出现不同结论；换了数据版本、观察时刻或要求，应重新核对，不能直接沿用旧结论。<Cite id="quality-record"/></p>
    </ArticleSection>
    <ArticleSection id="dimensions" title="把不同问题分别量出来"><Legacy slug="data-quality" names={["quiz-heading"]}/>
      <p id="quality-dimensions" className="vp-citation-target">英国政府数据质量框架列出完整性、唯一性、一致性、时效性、有效性和准确性，并提醒这些维度不是每个组织必须照搬的固定清单。完整性问记录和重要字段是否齐全，唯一性问是否重复，有效性问格式或范围是否符合约定，准确性问值是否符合现实。<strong>字段齐全、格式合法和符合现实，分别回答不同问题。</strong>需要哪些指标，仍由本次用途决定。<Cite id="quality-dimensions"/></p>
      <div className={s.dimensions}><div><h3>完整与唯一</h3><p>需要的记录和字段是否齐全？同一事件是否被记了不止一次？两项要分开算。</p></div><div><h3>时效与一致</h3><p>数据是否来得及支持决策？不同表里同一本书的状态是否相互矛盾？</p></div><div><h3>有效与准确</h3><p>书目编号符合约定格式，不代表它真的对应读者借走的那本书。</p></div></div>
      <p id="quality-automation" className="vp-citation-target">十条记录可以逐条看，成千上万条就需要程序反复检查。Deequ 是基于 Apache Spark 的程序库；Spark 用来处理大批数据，Deequ 把“某字段不能缺失”“ID 必须唯一”等要求写成可以自动运行的检查，称为“数据单元测试”。运行后，它计算指标，再判断是否满足写好的要求。<strong>检查结果需要回到具体规则；未写进规则的问题，不能靠自动化发现。</strong>失败时还要结合原始记录定位原因。本页只在浏览器里计算十条教学记录，没有运行 Spark 或 Deequ。<Cite id="quality-automation"/></p>
    </ArticleSection>
    <ArticleSection id="evidence" title="规则通过，还要看事实" className={base.offset}><Legacy slug="data-quality" names={["prompt-heading"]}/>
      <p id="quality-fact" className="vp-citation-target">英国政府框架区分完整性与准确性：所有字段都有值，仍然可能是错误值。<strong>按规则检查数据，与核对它是否反映真实业务，需要不同的证据。</strong>例如，记录里的 #42 格式正确、也确有这本书，却可能是工作人员选错了书目；还要核对对应的借阅凭据或经过确认的事件来源，才能判断是否记对。仅凭这十条记录，我们不知道 e9 应对应哪本书。关掉一项检查，也不会消除原来的问题。<Cite id="quality-fact"/></p>
      <p><ConceptTerm slug="data-validation">数据验证</ConceptTerm>按已写好的规则检查输入，是质量评估可用的一种手段。质量评估还要决定哪些问题会影响本次用途、采用什么指标、能接受多大的误差，以及缺少哪些现实证据。格式检查全部通过，只能说明满足这些格式规则，不能独自证明整份数据适合这次任务。</p>
      <ArticleAside title="总分遮住的质量差异"><p id="quality-score" className="vp-citation-target">AWS Glue Data Quality 的分数，是用“通过的规则数 ÷ 本次评估的规则总数”算出的百分比。例如，十条规则有九条通过，分数就是 90%，并不表示 90% 的记录真实或准确；规则怎样定义，决定这个数字能回答什么。<strong>还要看未通过的是哪一条，是否影响这次用途。</strong>本例要求三项全部达到门槛，不把时效失败藏进一个平均分。<Cite id="quality-score"/></p></ArticleAside>
      <p>质量报告应写明用途、数据版本、观察时刻，以及各项指标的计算方法、测得的值和门槛。比例指标还要保留分子、分母；本例时效则保留快照时间与比较时间。发现问题后定位记录，说明怎样处理；没有检查的项目也要标明。需要判断是否符合现实时，再补充相应证据。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function LineageTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={lineageSources}/>;
  return <ConceptArticle slug="data-lineage" title="数据血缘" sources={lineageSources} sections={[["relations", "从结果找到来源与过程"], ["trace", "同一份输入，两个报表值"], ["impact", "字段变化影响的下游输出"], ["history", "当前关系与历史记录要分开"]]}
    intro={<>报表的合计从 2000 分变成 1800 分，先别急着认定哪一版算错了：可能是输入变了，也可能是计算规则变了。数据血缘把这个结果、使用过的输入和处理过程关联起来，帮我们顺着这些关联查清变化来自哪里。</>}
    hero={<ConceptHero slug="data-lineage" label="1800分输出关联run43、减去优惠的规则和amount与discount两个输入字段"><div className={s.lineageHero}><div className={s.heroOutput}><strong>1800 分</strong><span>daily.total · v2</span></div><div className={s.heroRun}><code>run-43 · 规则 v2</code><code>sum(amount − discount)</code></div><div className={s.heroInputs}><code>amount</code><code>discount</code></div></div></ConceptHero>}>
    <ArticleSection id="relations" title="从结果找到来源与过程"><Legacy slug="data-lineage" names={["question", "definition"]}/>
      <p id="lineage-relations" className="vp-citation-target"><strong>数据血缘记录数据与处理之间的依赖，帮助追查一个结果怎样产生、哪些后续结果依赖它。</strong>W3C PROV 是通用的来源记录模型：实体是要追查的东西，例如一份输入快照或输出报表；活动是发生过的处理，例如某次汇总；参与者是承担责任的人、组织或程序。模型可以表达活动使用了什么、生成了什么，以及一个结果由哪些输入派生而来。在本例中，费用来源 s1 和 daily.total 都是实体，求和规则是活动，run-42 就是这次活动的记录；这样读者看到的不只是两张表相连，还能知道中间做了什么。<Cite id="lineage-relations"/></p>
      <p>向上看，是“这个合计来自哪些输入”；向下看，是“这份输入改变后，哪些输出可能需要复查”。没有血缘记录，也能逐份打开文件、检查计算规则或询问维护者，但要自己拼出这条路径。血缘把已知关系记下来，方便沿途调查；<strong>它不自动证明数据正确，也不自动执行修复。</strong>处理数据的任务负责计算，血缘记录负责说明这些处理怎样关联输入与结果。</p>
    </ArticleSection>
    <ArticleSection id="trace" title="同一份输入，两个报表值"><Legacy slug="data-lineage" names={["scene-heading"]}/>
      <p>费用来源 s1 是固定的输入快照：把某一时刻、某个范围内的输入保存下来，后面复查时仍能拿到同一份。它只有 A、B 两条记录。amount 是金额，discount 是优惠，单位都是分；A 的 amount 是 1200、discount 是 200；B 的 amount 是 800、discount 是 0。旧规则只加金额，1200＋800＝2000；新规则先分别减去优惠，再相加，（1200−200）＋（800−0）＝1800。两次使用相同输入，改变的是规则。演示里的 sum 表示求和，daily.total 是日合计的名称；本例还登记了 monthly.total（月合计）使用 daily.total，所以日合计变化后，月合计是需要复查的下游输出。</p>
      <LineageLesson/>
      <p>先展开“生成记录”，能看到输出 v1 对应 run-42 和规则 v1；再展开“输入字段”，能看到来源 s1 的 A、B；这时只有 amount 参与合计。切到输出 v2 后，生成记录变为 run-43 和规则 v2，amount 与 discount 都参与。本例展示预先登记的两次教学运行，没有执行 SQL、抓取日志或自动解析血缘。<strong>“从字段查看下游影响”会把 amount 和 discount 都列出来供选择；列在这里表示有一条已登记的字段关系，不表示它们都参与当前规则。</strong>源字段保留原值，高亮只表示本次规则是否使用它。</p>
      <p id="lineage-run" className="vp-citation-target">OpenLineage 区分 Job、Run 和 Dataset：Job 是读取或生成数据的工作，Run 是这项工作的某次执行，Dataset 是其中涉及的数据集。运行事件可以记录开始、完成等状态，以及输入和输出。任务真正运行前还有一种设计期事件，用来声明“计划会使用哪些输入”；它不属于某一次 Run。<strong>“计划怎样处理”与“这一次实际怎样处理”需要分开。</strong>追查昨日结果，应找到昨日运行使用的输入与规则，今天的代码未必与当时相同。<Cite id="lineage-run"/></p>
      <div className={s.lineageComparison}><div><strong>2000 分</strong><code>run-42 · 规则 v1<br/>sum(amount)</code><p>只使用金额字段。优惠存在于输入中，却没有参与这次合计。</p></div><div><strong>1800 分</strong><code>run-43 · 规则 v2<br/>sum(amount − discount)</code><p>金额与优惠共同参与。结果变化来自规则变化，不是新增记录。</p></div></div>
    </ArticleSection>
    <ArticleSection id="impact" title="字段变化影响的下游输出"><Legacy slug="data-lineage" names={["quiz-heading"]}/>
      <p id="lineage-columns" className="vp-citation-target">表里的字段就是一列数据，例如 amount 和 discount。OpenLineage 的列级血缘可以描述输出列使用了哪些输入列及其转换方式。表级关系告诉你“这份报表依赖费用表”；<strong>字段级关系进一步区分金额与优惠是否参与合计。</strong>本例规则 v1 不读取 discount，v2 则读取它，因此同一个字段在两版规则下的影响范围不同。<Cite id="lineage-columns"/></p>
      <p>沿着前面登记的关系，monthly.total（月合计）使用 daily.total（日合计）。展开下游影响，选 discount：规则 v1 下两个合计都没有使用它，列表为 0 个；规则 v2 下，它先影响日合计，再沿这条关系影响月合计，列表为 2 个。这里列出的是需要复查的输出，字段数值没有被修改，报表也没有在后台重新计算。</p>
      <p id="lineage-impact" className="vp-citation-target">DataHub 可以查看上游输入、下游输出，也可以把视图聚焦到一个字段。血缘可以从支持自动提取的系统采集，通过接口登记，或由人维护。图中的连线表示已记录的依赖，覆盖范围取决于实际接入。<strong>看不到一条连线，不足以证明现实中没有依赖。</strong>先检查采集范围、更新时间和手工维护情况，再决定调查是否完整。<Cite id="lineage-impact"/></p>
    </ArticleSection>
    <ArticleSection id="history" title="当前关系与历史记录要分开" className={base.offset}><Legacy slug="data-lineage" names={["prompt-heading"]}/>
      <p id="lineage-history" className="vp-citation-target">DataHub 的这份文档说明，默认界面显示最新血缘；血缘图里的每条连线也有自己的最后更新时间，时间选择器只是把更新时间不在范围内的连线从这张最新图中过滤掉，不会把整张图还原成某一天的样子。于是，选了昨天的日期，也不能据此认定看到的就是 run-42 的实际依赖。<strong>“过滤当前关系”与“查到旧运行记录”是两种能力。</strong>具体系统支持哪一种，需要核对文档和实际保存的记录。<Cite id="lineage-history"/></p>
      <ArticleAside title="有路径，还需要可重现的输入"><p>即使 run-42 有完整的来源路径，如果输入文件已经被覆盖，仍不能仅凭路径复算昨日的 2000 分。血缘说明关系，<ConceptTerm slug="dataset-data">数据集</ConceptTerm> 版本保留相应输入，规则版本说明当时做了什么。它们要能对应起来，调查才不止于一张图。</p></ArticleAside>
      <p>追查异常结果时，先把要调查的输出版本、运行记录、输入快照和规则版本分别确定下来，后续核对都对着这一组记录。对照实际记录，逐段核对数据变化，标出尚属推测的依赖，再列出需要重新计算、验证或人工确认的下游输出。</p>
    </ArticleSection>
  </ConceptArticle>;
}
