import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { FrameLesson, TextLesson, VectorLesson } from './RetrievalConceptLessons';
import { frameSources, textSources, vectorSources } from '@/lib/retrieval-sources';
import base from './EventConcepts.module.css';
import s from './RetrievalConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function FrameTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={frameSources}/>;
  return <ConceptArticle slug="dataframe" title="数据帧" sources={frameSources} sections={[["shape", "行与列有各自的含义"], ["selection", "筛选记录与选择字段"], ["operations", "计算会改变结果的形状"], ["execution", "表格接口与执行方式"]]}
    intro={<>把四条借阅记录读进程序后，先筛出逾期的两条，再只保留需要的字段。DataFrame 把这些记录放进一张有列名的二维表，程序就能按列选择、按行筛选和计算。</>}
    hero={<ConceptHero slug="dataframe" label="原始四行三列筛出B与D，输出仍是有列定义的二维表"><div className={s.frameHero}><div className={s.heroSheet}><strong>4 × 3</strong><code>A　42　0　北</code><code>B　78　3　南</code><code>C　42　0　南</code><code>D　91　7　北</code></div><div className={s.heroSheet}><strong>2 × 3</strong><code>逾期 ≥ 1 天</code><code>B　78　3　南</code><code>D　91　7　北</code></div></div></ConceptHero>}>
    <ArticleSection id="shape" title="行与列有各自的含义"><Legacy slug="dataframe" names={["question", "definition"]}/>
      <p><strong>DataFrame 是用命名的列组织二维数据的结构。</strong>一行代表一条记录，一列代表一个字段。在本例里，每行代表一次借阅；借阅记录有书目编号、逾期天数和馆名这三列。换一个业务，每行可能代表一个读者或一本书，仍要先说明它代表什么。</p>
      <p id="frame-selection" className="vp-citation-target">pandas 的教程区分两种选择：只取一个列名时，单独得到那一列，pandas 把它叫一维 Series；把要保留的几个列名一起写出来，得到二维 DataFrame。<strong>结果有多少行、多少列，是理解一次操作的基本证据。</strong>本例选择列时传的始终是列名列表，所以结果仍是二维表。<Cite id="frame-selection"/></p>
      <div className={s.columns}><div><h3>数据集</h3><p>关心数据的收录范围、版本与使用说明。它可以由多份文件构成。</p></div><div><h3>数据帧</h3><p>关心程序怎样组织与计算这些记录。把数据集的一部分读入程序，不代表已经覆盖整份数据集。</p></div></div>
    </ArticleSection>
    <ArticleSection id="selection" title="筛选记录与选择字段"><Legacy slug="dataframe" names={["scene-heading"]}/>
      <p>原始表有四行、三列。A、C 没有逾期，B 逾期三天，D 七天。筛选天数至少为 1 的记录，得到 B、D 两行；再去掉书目编号这一列，变成两行、两列。<strong>筛选行与选择列分别控制结果的两个方向。</strong></p>
      <FrameLesson/>
      <p>这里用页面里预先做好的小模拟计算结果，没有运行 pandas；它只演示筛选和选列的关系，真实库还要按自己的版本和接口核对。标签 A—D 单独显示，不计入三列字段。筛选行和只保留部分列都没有改写原始表；把条件收紧到至少 10 天时，结果是零行，但仍知道选择了哪些列。零行不等于读取失败。</p>
      <p id="frame-labels" className="vp-citation-target">pandas 的 loc 按行标签、列名或条件选择，iloc 按当前位置选择。标签是行自带的名字，比如 B；位置是它当前排第几行。<strong>行标签与第几行需要分清。</strong>筛选后 B、D 可以保留原标签，并不因为现在只有两行，就自动变成原始表中的第一、第二条。本例保留标签方便追查，不能据此假定所有 DataFrame 实现都有 pandas 式行索引。<Cite id="frame-labels"/></p>
    </ArticleSection>
    <ArticleSection id="operations" title="计算会改变结果的形状"><Legacy slug="dataframe" names={["quiz-heading"]}/>
      <p id="frame-operations" className="vp-citation-target">以 Polars 为例，select 选择结果列，with_columns 保留原列并增加计算列，filter 筛选记录，group_by 按某列的值把行分组，汇总由随后的聚合计算完成。<strong>过滤通常改变记录数量，增加列改变字段数量，聚合就是把多行并成一行，还会改变一行代表什么。</strong>具体行为应按查询写法和实现核对。<Cite id="frame-operations"/></p>
      <div className={s.note}><p>原始四条借阅按馆名分组后，北馆、南馆各两条。输出只有两行，每行代表一个馆；此时的“2 行”不能再解释为只发生了两次借阅。页面的交互只演示筛选和选列，分组结果用这个文字例子说明。</p></div>
      <p>做计算前，还要核对字段类型与缺失值。逾期天数是数字 3，与字符串“3天”并不等价；未知天数也不能直接补成 0，后者表示确定没有逾期。要怎样转换、缺失怎样处理、哪些结果算错，应先写清再运行。</p>
      <p id="frame-storage" className="vp-citation-target">Apache Arrow 定义一种编程语言无关的列式内存格式（Python、Java 等都能使用）。列式表示会把同一列的值连续放在一起，并记录类型、长度和空值；数据本身存放在一段段连续的内存区域里，也就是缓冲区。这样按列读取方便，但修改可能需要重排或重新分配一段连续区域，所以代价可能更高。<strong>DataFrame 是操作数据的接口概念，Arrow 是一种具体的数据表示约定。</strong>不能把所有数据帧都说成必然使用 Arrow，也不能只凭“列式”就断定不同程序能共享同一份内存而不用拷贝，或者一定更快。<Cite id="frame-storage"/></p>
    </ArticleSection>
    <ArticleSection id="execution" title="表格接口与执行方式" className={base.offset}><Legacy slug="dataframe" names={["prompt-heading"]}/>
      <p id="frame-execution" className="vp-citation-target">Spark 把 DataFrame 描述为按命名列组织的 Dataset；这里的 Dataset 是 Spark 的类型名，不是前文讲的那份有收录范围和版本说明的数据集。Spark 在背后用分布式执行引擎：把计算拆开，交给多台机器一起运行，并做优化；不同语言和接口可以表达同一个计算。<strong>叫 DataFrame，不说明它一定完整装在一台机器的内存里。</strong>同样的筛选条件，在本地库（例如 pandas）与分布式引擎中，执行成本、类型和支持的操作可能不同。<Cite id="frame-execution"/></p>
      <ArticleAside title="与数据库表怎么配合"><p>数据库表负责持久保存和约束；数据帧可装载查询结果进行分析，也可以从外部文件或数据库读取数据。这里的筛选结果不会写回数据库。需要持久化时，说明写到哪里、覆盖还是追加、失败如何处理，再核对相应接口。</p></ArticleAside>
      <p>核对一次 DataFrame 计算，先明确库与版本、每行含义、字段类型和预期结果。用少量样例检查标签、维度与空结果，再在完整数据上执行；表格外观不能证明计算正确。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function FullTextTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={textSources}/>;
  return <ConceptArticle slug="full-text-search" title="全文搜索" sources={textSources} sections={[["terms", "把文档整理成可查的词项"], ["postings", "从词项找到文档"], ["analysis", "匹配规则与语言处理"], ["ranking", "命中以后，还要决定顺序"]]}
    intro={<>读者输入“借阅 续借”，系统要找到相关说明。先按解析规则把文档处理成可检索的词项；系统常把处理结果保存为索引来加速重复查询，但“全文搜索”不等于某一种索引实现。有了索引，查询时就不必每次从头读完全部正文，再按词项找到文档并判断哪些满足条件。</>}
    hero={<ConceptHero slug="full-text-search" label="借阅对应ABE，续借对应ACE，两份文档集合求交得到AE"><div className={s.textHero}><div className={s.heroPosting}><strong>借阅</strong><code>A　B　E</code></div><div className={s.heroPosting}><strong>续借</strong><code>A　C　E</code></div><div className={s.heroMatch}><span>同时包含两词</span><strong>A　E</strong></div></div></ConceptHero>}>
    <ArticleSection id="terms" title="把文档整理成可查的词项"><Legacy slug="full-text-search" names={["question", "definition"]}/>
      <p id="text-definition" className="vp-citation-target"><strong>全文搜索根据文本查询找到匹配文档，并可按相关性排序。</strong>PostgreSQL 的介绍说明，索引前可以把正文拆成 token（切出来的词或片段），再由词典把它们归一成适合检索的词项，例如英文 <code>books</code> 可能按配置归一为 <code>book</code>。原始文字、处理后的词项与查询条件，各有自己的作用；索引里存的不是原文，而是处理后的词项和位置。<Cite id="text-definition"/></p>
      <p>普通字符串匹配关心一串字符是否出现；全文搜索比较处理后的词项和查询规则，所以字面写法相同不是唯一条件。比如启用词形归一后，搜 <code>book</code> 可能命中 <code>books</code>，而字面匹配未必会。<strong>能否找到不同写法，不只由输入框决定，还由索引与查询的处理配置决定。</strong></p>
    </ArticleSection>
    <ArticleSection id="postings" title="从词项找到文档"><Legacy slug="full-text-search" names={["scene-heading"]}/>
      <p>五篇教学文档编号 A 到 E，已预先分好词。索引左侧记录“词项 → 文档编号:位置”，如借阅出现在 A 的位置 1、B 的位置 1 和 E 的位置 2。记录位置，是为了之后判断两个词是否按顺序相邻。查“借阅 续借”时，AND 求共同文档，OR 求至少包含一个词的文档；相邻短语还要检查顺序与位置。</p>
      <TextLesson/>
      <p>AND 得到 A、E；OR 得到 A、B、C、E；相邻短语要求两个词按输入顺序紧挨着出现，所以只得到 A。E 虽包含两词，顺序却相反，不算短语命中。输入“预约”后检索，不会命中任何文档；输入框里没有词项时，删除操作会先收到提示。<strong>无结果是当前词项和规则下的结论，不等于现实中没有相关信息。</strong></p>
      <p id="text-positions" className="vp-citation-target">SQLite FTS5 支持词项组成的短语以及 AND、OR 等布尔条件，并用词项位置表达相邻关系。<strong>“都出现了”与“按顺序相邻”是不同条件。</strong>本例由五份固定词项数组生成倒排记录，仅支持空格分词与三种模式，没有运行 SQLite，也没有模拟完整查询语法。<Cite id="text-positions"/></p>
    </ArticleSection>
    <ArticleSection id="analysis" title="匹配规则与语言处理"><Legacy slug="full-text-search" names={["quiz-heading"]}/>
      <p id="text-analysis" className="vp-citation-target">PostgreSQL 的文本搜索配置把解析器与词典组合起来：解析器负责从文字找出 token，词典再决定哪些词归一、忽略或扩展；像“的”“是”这类停用词可能被忽略。<strong>哪些词进入索引，取决于文本语言和解析设置，需要按领域检验。</strong>本页的中文词项是人工切分的，不代表完整的中文分词；它只用于看清集合与位置。<Cite id="text-analysis"/></p>
      <p id="text-configuration" className="vp-citation-target">Elasticsearch 对普通 <code>text</code> 字段的 <code>match</code> 查询会分析输入；文档规定 <code>operator</code> 默认是 OR，也可设 AND。<strong>相同输入放到不同默认规则里，可能返回不同集合。</strong>因此本例把模式直接显示出来。若字段是配置了推理端点的语义字段，同名 <code>match</code> 才会走对应的语义处理；接口同名不代表底层仍是词项匹配。<Cite id="text-configuration"/></p>
      <div className={s.columns}><div><h3>关键词与编号</h3><p>书名、作者、错误代码与固定词项，常需要明确匹配、字段限制和可核对的高亮。</p></div><div><h3>意思相近的表达</h3><p>“借书到期怎么办”未必出现“续借”。同义词配置或语义检索可以补充，但要验证实际效果。</p></div></div>
    </ArticleSection>
    <ArticleSection id="ranking" title="命中以后，还要决定顺序" className={base.offset}><Legacy slug="full-text-search" names={["prompt-heading"]}/>
      <p id="text-ranking" className="vp-citation-target">PostgreSQL 的排序函数可考虑词频、词项接近程度及来源字段权重；文档也指出，相关性依赖应用，可能还要结合修改时间等因素。实际系统常用名为 BM25 的算法综合部分词频和文档长度因素，但具体公式与参数仍按实现核对。<strong>匹配决定哪些文档进入结果，排序决定先展示哪一篇。</strong>本页按固定文档编号展示集合，没有计算 BM25 或模拟搜索引擎分数。<Cite id="text-ranking"/></p>
      <ArticleAside title="更新正文，也要维护可搜索内容"><p>倒排记录来自正文。删除 A 中的“续借”却继续使用旧记录，会让搜索与最新内容不一致。真实系统需要明确索引更新方式、可见时机和重建流程；查到文档后，还要回到正文核对来源与有效版本。</p></ArticleAside>
      <p>设计站内搜索时，先准备真实查询样例，说明字段、语言配置、匹配模式和排序目标。把“应该找到什么”和“应该排除什么”放到一起核对，再决定是否补充 <ConceptTerm slug="vector-database">向量检索</ConceptTerm>。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function VectorDatabaseTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={vectorSources}/>;
  return <ConceptArticle slug="vector-database" title="向量数据库" sources={vectorSources} sections={[["records", "向量与记录一起保存"], ["neighbours", "限定候选，再比较距离"], ["indexing", "数据增长时的检索开销"], ["limits", "相似结果仍要核对内容"]]}
    intro={<>查询和文档都可以用向量表示。向量数据库保存这些向量及对应记录，帮助找出相近的候选；标题、原文、范围与版本仍然要和它们一起管理。</>}
    hero={<ConceptHero slug="vector-database" label="二维查询q连接距离较近的B与A，其他候选保持在各自坐标"><div className={s.vectorHero}><svg viewBox="0 0 290 210" aria-hidden="true"><path className={s.heroLink} d="M65 145L88 132M65 145L132 150"/><circle className={s.heroQuery} cx="65" cy="145" r="14"/><text x="40" y="180">q</text><g className={s.heroNear}><circle cx="88" cy="132" r="6"/><text x="95" y="125">B</text><circle cx="132" cy="150" r="6"/><text x="140" y="175">A</text></g><g className={s.heroFar}><circle cx="170" cy="74" r="5"/><text x="179" y="68">C</text><circle cx="245" cy="45" r="5"/><text x="252" y="40">E</text><circle cx="228" cy="160" r="5"/><text x="238" y="176">D</text></g></svg></div></ConceptHero>}>
    <ArticleSection id="records" title="向量与记录一起保存"><Legacy slug="vector-database" names={["question", "definition"]}/>
      <p id="vector-records" className="vp-citation-target"><strong>向量数据库围绕向量相似性组织存储、索引和查询，并把向量关联到可识别的记录。</strong>Qdrant 的 Point 包含向量和可选 payload，记录也有 ID。向量用来比较，ID 用来找到对象，附带字段可记录类别、来源或原文入口；它们不能相互替代。<Cite id="vector-records"/></p>
      <p>文档检索里，通常先用选定的表示方法把文档和查询变成兼容的向量，再按约定的距离或相似度比较。<strong>生成表示与检索表示，是不同环节。</strong>不能把随便两组数字放到一起，就断言它们在比较文本含义。</p>
    </ArticleSection>
    <ArticleSection id="neighbours" title="限定候选，再比较距离"><Legacy slug="vector-database" names={["scene-heading"]}/>
      <p>下面为六条记录手工指定二维坐标，便于直接看清距离。查询 [2, 2] 附近，B 比 A 更近；限制为公开记录时，内部的 B 不再是候选，返回 A、C。坐标为教学输入，不来自真实文本模型，图上的轴也没有业务含义。</p>
      <VectorLesson/>
      <p>本例先按范围筛选，再计算每条候选的欧氏距离，取最近两条。更新 A 到 [9, 8] 后，旧结果收起；重新计算公开范围，结果变成 C、D。“归档”范围没有记录，返回零条。<strong>改向量会改变相对位置，改范围会改变参与比较的对象。</strong>这里只保存在浏览器内存，没有实际写入数据库。</p>
      <p id="vector-distance" className="vp-citation-target">Faiss 的入门例子用 IndexFlatL2 对全部候选做精确 L2 检索，返回近邻 ID 及距离平方。本页为阅读方便展示欧氏距离本身，排序相同，数值口径不同。<strong>比较分数前，要知道距离定义、排序方向和实际返回值。</strong>Faiss 是相似性检索库，完整数据库还需管理数据和服务生命周期。<Cite id="vector-distance"/></p>
      <p id="vector-filter" className="vp-citation-target">Qdrant 可以按 payload 或 ID 限定搜索与读取条件，用来表达库存、价格范围等不能仅靠向量表示的要求。<strong>距离近，不会自动满足业务条件。</strong>本例“公开”只是教学字段；真实访问权限还必须由可信服务端强制执行，不能依赖前端下拉框。<Cite id="vector-filter"/></p>
    </ArticleSection>
    <ArticleSection id="indexing" title="数据增长时的检索开销"><Legacy slug="vector-database" names={["quiz-heading"]}/>
      <p>六条记录可以逐条比较；百万条高维向量，每次都计算全部距离就有明显成本。检索索引会组织候选，尝试减少需要查看的对象。精确与近似方案有不同代价，不能把“使用索引”直接等同于一定返回全局最近邻。</p>
      <p id="vector-index" className="vp-citation-target">Malkov 与 Yashunin 提出的 HNSW 建立多层邻近图，从上层逐步进入下层，再扩展候选。它是近似近邻方法；搜索参数 ef 控制候选探索，论文比较了召回率与时间等代价。<strong>更快的候选搜索，需要用真实样例检查漏掉了哪些近邻。</strong>本页没有实现 HNSW，二维全量计算只提供可核对的精确基线。<Cite id="vector-index"/></p>
      <div className={s.columns}><div><h3>精确基线</h3><p>按同一距离定义、同一候选范围取最近 k 条，用来核对近似结果。</p></div><div><h3>近似检索</h3><p>用索引与搜索预算减少探索，衡量延迟、内存和召回，再选适合任务的配置。</p></div></div>
    </ArticleSection>
    <ArticleSection id="limits" title="相似结果仍要核对内容" className={base.offset}><Legacy slug="vector-database" names={["prompt-heading"]}/>
      <p><strong>近邻是按当前表示和距离得到的候选，不是事实核验结论。</strong>一篇过期说明可能很近，一篇关键规则可能被切分后漏掉。文档检索需要回到原文，检查内容、时间、范围与引用，再判断能否用于回答。这一步与 <ConceptTerm slug="rag">RAG</ConceptTerm> 的证据使用相连。</p>
      <ArticleAside title="同一个名字，不代表同一种检索"><p>全文搜索中的词项表示也可能叫 vector，例如 PostgreSQL 的 tsvector，但不能因此把它当成这里的二维或高维稠密坐标。还要区分精确关键词、稀疏表示、稠密表示和混合检索，按实际类型与查询接口核对。</p></ArticleAside>
      <p>设计向量检索需要确定表示模型、距离定义、文档版本、候选过滤和 k 值。内容更新后，同步维护向量与索引，再用标注样例核对结果。借阅和付款等业务仍需关系数据的约束与事务。</p>
    </ArticleSection>
  </ConceptArticle>;
}
