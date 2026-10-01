import { Database, FileText } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { HybridLesson, VectorStoreLesson, CitationLesson } from './EvidenceConceptLessons';
import { hybridSources, storeSources, citationSources } from '@/lib/evidence-sources';
import base from './EventConcepts.module.css';
import s from './EvidenceConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span id={`${slug}-${name}`} key={name} className={base.anchor} aria-hidden="true"/>)}</>; }

export function HybridSearchTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={hybridSources}/>;
  return <ConceptArticle slug="hybrid-search" title="混合搜索" sources={hybridSources} sections={[["routes", "一次查询，两种检索信号"], ["fusion", "把两路排名合成一份"], ["scores", "两路分数不能直接相加"], ["limits", "候选范围决定融合结果"]]}
    intro={<>查“MX-42 经常断开连接”，型号适合按字面匹配，“断开连接”又可能在文档里写成“掉线”或“重连”。混合搜索组合不同的检索信号，再把候选汇成一份结果。</>}
    hero={<ConceptHero slug="hybrid-search" label="关键词与语义两路排名，共同出现的B只保留一条并合计排名贡献"><div className={s.fusionHero}><div><span>关键词 A → B → C</span></div><div><span>语义 B → D → A</span></div><strong>B · 两路贡献相加</strong></div></ConceptHero>}>
    <ArticleSection id="routes" title="一次查询，两种检索信号"><Legacy slug="hybrid-search" names={["question", "definition"]}/>
      <p id="hybrid-definition" className="vp-citation-target"><strong>混合搜索把不同检索方法的结果组合起来。</strong>Azure AI Search 的实现并行执行全文与向量查询，再用 RRF 合并排名。词项匹配（关键词路线）可以利用型号、代码等具体表达；向量查询（语义路线）则把文字编码成数字，按表示空间中的相近程度寻找候选。<strong>两种信号互补，也都可能找到无关资料。</strong>这只是混合搜索的一种实现，后续还可以重排。<Cite id="hybrid-definition"/></p>
      <p>产品型号与故障描述承担不同作用。“MX-42”确定了对象，“经常断开连接”表达了问题；如果资料只写“掉线重连”，单纯词项匹配可能漏掉它。反过来，另一型号的重连指南即使意思接近，也未必适用。</p>
      <p>硬性条件应单独限定。例如只允许返回 MX-42 的资料，就要明确过滤型号；给型号匹配加一点分，只会提高它的排名，另一型号里“断开连接”写得更详细的资料仍可能压过它。过滤是直接把不合格资料排除出候选。<ConceptTerm slug="semantic-search">语义搜索</ConceptTerm> 帮助找相近表达，不能替代适用范围检查。</p>
    </ArticleSection>
    <ArticleSection id="fusion" title="把两路排名合成一份"><Legacy slug="hybrid-search" names={["scene-heading"]}/>
      <p id="hybrid-calculation" className="vp-citation-target">RRF 按名次分配贡献：<strong>每路出现一次，就加上 1 / (k + 名次)</strong>；没有进入这路候选，贡献为 0。同一文档按 ID 合并。Elastic 的实现以第一名为 1，并通过候选窗口限制参与融合的结果。它使用排名，避免直接比较两种原始分数。<Cite id="hybrid-calculation"/></p>
      <p>下面是四篇虚构资料和两份预设排名：关键词路是 A①、B②、C③，语义路是 B①、D②、A③；名次从 1 开始，没有执行真实检索。本例取 k = 60，每路最多三条，融合后只显示前三条。k 是缓和名次差距的常数，不是取 60 条；条形的深浅分别对应两路贡献，改动路线或窗口，再融合一次。</p>
      <HybridLesson/>
      <p>默认 B 得到 1/62 + 1/61，A 得到 1/61 + 1/63，所以 B 略高。D 只在语义路线排第二，仍能进入合并结果。<strong>同一文档被两路找到，会合计贡献，但不会复制成两条。</strong>同分时本例按 ID 排序，这只是确定展示顺序的约定。</p>
    </ArticleSection>
    <ArticleSection id="scores" title="两路分数不能直接相加"><Legacy slug="hybrid-search" names={["quiz-heading"]}/>
      <p id="hybrid-scales" className="vp-citation-target">全文分数与向量相似度可能使用不同尺度。Weaviate 文档对比基于排名的融合与先归一化再加权的融合：前者主要保留顺序，后者还保留分数间的相对差距。<strong>融合规则决定保留哪种信息。</strong>归一化加权要先把每路分数缩到可比较的区间，再按权重相加；RRF 则不要求把原始分数先变成同一种单位。<Cite id="hybrid-scales"/></p>
      <div className={s.pair}><div><h3>按排名融合</h3><p>第一与第二差一点还是差很多，都只通过名次体现。参数 k 改变名次差异的影响，本页固定为 60。</p></div><div><h3>按归一分数融合</h3><p>先处理每路分数尺度，再按权重相加。归一方式、异常高分与权重会影响结果，需要用实际问题评估。</p></div></div>
      <p>融合分数表达这套规则下的排序贡献，<strong>不是答案正确率，也不是资料真实度。</strong>无论怎样融合，仍要读取原文，核对型号、版本、条件和问题是否对应。</p>
    </ArticleSection>
    <ArticleSection id="limits" title="候选范围决定融合结果" className={base.offset}><Legacy slug="hybrid-search" names={["prompt-heading"]}/>
      <p id="hybrid-window" className="vp-citation-target">每路候选窗口就是这一路最多取前几名；候选窗口与最终显示数量是两个步骤。Elastic 先取各路窗口中的结果参与融合，再截取最终数量。<strong>不在任何一路窗口里的资料，不会凭空进入合并结果。</strong>把本例窗口改成 1，只剩 A、B；D 即使有用，也没有参与这次计算。<Cite id="hybrid-window"/></p>
      <p id="hybrid-evaluation" className="vp-citation-target">RRF 原始论文用多个 TREC 与 LETOR 实验考察排名融合，并在研究中选择 k = 60。结果支持它在这些实验中的效果，<strong>不能由此推断所有资料库都必然改善。</strong>自己的问题集仍需检查关键资料是否进入前排、型号不符的内容是否被误选，以及增加路线的成本。<Cite id="hybrid-evaluation"/></p>
      <ArticleAside title="融合后的核对"><p>需要更细地比较查询与候选时，可以继续做 <ConceptTerm slug="reranking">重排序</ConceptTerm>。它处理已经选出的候选；融合扩大了可比较的范围，但两者都无法代替资料本身的质量。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function VectorStoreTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={storeSources}/>;
  return <ConceptArticle slug="vector-store" title="向量存储" sources={storeSources} sections={[["records", "向量要和原文一起找到"], ["versions", "原文更新，记录仍可能是旧的"], ["sync", "用同一ID更新一条记录"], ["lifetime", "保存多久，由实现决定"]]}
    intro={<>退款规则从三个工作日改成七个工作日，查询却仍返回旧说明。问题可能出在资料已经改了，存储中的记录还没有同步。向量存储需要管理向量，也需要管理它代表哪份内容。</>}
    hero={<ConceptHero slug="vector-store" label="记录ID A不变，向量、版本和对应原文一起更新"><div className={s.storeHero}><Database size={26}/><div><strong>ID A</strong><code>vector + text + version</code><p>v2 · 七个工作日</p></div></div></ConceptHero>}>
    <ArticleSection id="records" title="向量要和原文一起找到"><Legacy slug="vector-store" names={["question", "definition"]}/>
      <p id="store-definition" className="vp-citation-target"><strong>向量存储是一类保存向量化资料、支持相似查询的存储能力或接口。</strong>LangChain 的通用接口包含添加文档、按 ID 删除与相似搜索，并提供内存实现。它可以由数据库、独立服务或进程内对象实现；不一定是单独运行的数据库，也不一定建立近似索引。<Cite id="store-definition"/></p>
      <p id="store-record" className="vp-citation-target">Qdrant 用 point 组织 ID、向量与 payload。向量参与比较，ID 标识记录，附加数据保存文档信息并可支持过滤。<strong>找到了向量，还要能找回它代表的内容。</strong>应用可以把来源、版本和原文位置放在元数据里；这些字段并不会自动证明内容是当前或正确的。<Cite id="store-record"/></p>
      <p>文档经过 <ConceptTerm slug="embedding">嵌入</ConceptTerm> 得到数值表示，再和原文或原文入口一起保存。不同模型、维度和处理方式的向量不能随意混用。实际查询还需要选择相似度、候选数量及适用条件。</p>
    </ArticleSection>
    <ArticleSection id="versions" title="原文更新，记录仍可能是旧的"><Legacy slug="vector-store" names={["scene-heading"]}/>
      <p>下面只在浏览器内存里保存两条虚构记录。A 是退款规则，B 是打印说明。二维向量是手工指定的单位向量，查询退款固定使用 [1, 0]，按余弦取大于 0.2 的第一条；没有调用嵌入模型或数据库。</p>
      <VectorStoreLesson/>
      <p>先写入 v1，再把原文改成 v2，查询仍会返回 A 的“三个工作日”。<strong>修改源文件，不等于修改存储记录。</strong>启用当前版本过滤后，旧 A 被排除；B 的余弦为 0，也过不了本例阈值，所以没有可用结果。同步 A 后，再查询才会返回“七个工作日”。</p>
      <p>“当前版本”来自本例的原文版本选择器。真实应用需要自己的版本记录、更新触发和同步检查；只给记录加一个 version 字段，没有比较对象和过滤流程，仍会读到旧内容。</p>
    </ArticleSection>
    <ArticleSection id="sync" title="用同一ID更新一条记录"><Legacy slug="vector-store" names={["quiz-heading"]}/>
      <p id="store-upsert" className="vp-citation-target">Pinecone 的 upsert 文档说明，同一个记录 ID 再次写入会覆盖整条记录；部分更新则使用相应更新操作。<strong>稳定 ID 可以把更新对应到已有对象。</strong>本例同步 A 时替换 A 的向量、原文与版本，记录数量仍是两条；若每次生成新 ID，旧记录就可能留在集合里。<Cite id="store-upsert"/></p>
      <p id="store-sync" className="vp-citation-target">Chroma 更新文档时，如果没有同时提供向量，会使用集合的嵌入函数重新计算；提供向量则还要满足维度要求。<strong>原文和向量应对应同一个内容版本。</strong>不同产品可以负责不同部分的编码与更新，应用要确认实际行为，不能只改显示文字而保留旧表示。<Cite id="store-sync"/></p>
      <p>删除 A，只删除本例存储中的记录；原文仍在左侧。之后查询退款没有结果，说明删除已经影响候选。原文是否也需要删除、哪些副本仍然存在、历史版本是否保留，要由应用另外处理。</p>
    </ArticleSection>
    <ArticleSection id="lifetime" title="保存多久，由实现决定" className={base.offset}><Legacy slug="vector-store" names={["prompt-heading"]}/>
      <p id="store-lifetime" className="vp-citation-target">LangChain 把不同实现放在向量存储接口下，进程内存与持久服务的保存方式不同。<strong>接口相似，不代表生命周期、访问限制或运维能力相同。</strong>本页刷新后数据消失；需要长期保存时，应选择相应存储，并检查持久化、备份、更新和删除流程。<Cite id="store-lifetime"/></p>
      <ArticleAside title="向量存储与向量数据库"><p><ConceptTerm slug="vector-database">向量数据库</ConceptTerm> 是提供向量管理与查询能力的一种数据库实现。向量存储是更宽的能力名称，也可能只是一个内存接口。本项目保留“向量数据库”作为该词常见叫法，阅读具体文档时仍要确认它说的是接口还是产品。</p><p>在 <ConceptTerm slug="rag">RAG</ConceptTerm> 中，它负责保存和返回候选资料；后续如何读取、组织输入和生成回答，是另一部分工作。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function CitationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={citationSources}/>;
  return <ConceptArticle slug="citation" title="引用" sources={citationSources} sections={[["location", "让读者找得到具体出处"], ["support", "出处是否支持这句话"], ["selector", "从文章入口到具体段落"], ["identifiers", "链接、版本与检查时间"]]}
    intro={<>“退款三个工作日到账”后面放了一个链接，读者仍不知道它是否适用于线上退款、是否要求审核通过、是不是保证时效。引用要把结论和对应材料连起来，让这些条件能够被核对。</>}
    hero={<ConceptHero slug="citation" label="草稿句子后的引用1，定位到原文中包含审核条件和通常时效的一段"><div className={s.citationHero}><p>审核通过后，通常三个工作日。<sup>[1]</sup></p><div><span>[1] 退款规则 · 第 2 段</span>线上退款审核通过后，通常三个工作日内原路退回。</div></div></ConceptHero>}>
    <ArticleSection id="location" title="让读者找得到具体出处"><Legacy slug="citation" names={["question", "definition"]}/>
      <p><strong>引用标明一句话或一项论断的来源，让读者能回到材料核对。</strong>它可以是脚注、角标或作者与年份标记；形式应配合阅读场景。参考资料列表列出材料，正文中的标记则说明哪一处使用了哪份材料。</p>
      <p id="citation-location" className="vp-citation-target">Chicago 的注释与书目示例区分具体引用位置和整份材料的信息：注释可以指定页码，电子资料没有固定页码时也可使用章节等定位方式。<strong>材料入口与具体位置承担不同作用。</strong>只列文章标题，读者还要自行找出哪一段支持结论。本页用角标对应参考资料，并提供正文回跳。<Cite id="citation-location"/></p>
      <p>引用也不要求把整段原文搬过来。概括别人的研究时，用自己的话准确保留范围和条件；直接引文要明确区分原话与自己的解释。对机制的演绎和演示约定，也要说清哪些来自资料，哪些是本页设计。</p>
    </ArticleSection>
    <ArticleSection id="support" title="出处是否支持这句话"><Legacy slug="citation" names={["scene-heading"]}/>
      <p id="citation-support" className="vp-citation-target">ALCE 研究分别考察生成内容与引用质量，引用评估关注材料是否支持相关陈述，以及引用是否必要。<strong>写了引用标记，并不等于这条引用支持结论。</strong>它可能只提到相同主题，或只支持句子中的一部分。具体判断还要逐项对照条件。<Cite id="citation-support"/></p>
      <p>下面三段规则都是虚构的。选择一句草稿和一个出处，先标记，再点击角标定位，最后核对支持范围。判断使用本页明确编写的对照表，没有运行自动事实核查模型。</p>
      <CitationLesson/>
      <p>线上规则支持“线上、审核通过后、通常、三个工作日、原路退回”。改写成“所有退款都保证到账”，范围就扩大了，确定程度也变了。<strong>保留原文限定，往往比增加引用数量更有用。</strong>申请入口段落无法证明到账时间，更无法证明免费。</p>
    </ArticleSection>
    <ArticleSection id="selector" title="从文章入口到具体段落"><Legacy slug="citation" names={["quiz-heading"]}/>
      <p id="citation-selector" className="vp-citation-target">W3C 的 Web Annotation Data Model 提供文本引用选择器，可以用匹配文本及前后文定位；也提供起止位置选择器，并提醒内容编辑后位置容易失效。<strong>实现定位时，要考虑原文会变化。</strong>这是一套技术标注模型，不是所有文章必须遵循的引文样式；它提示我们记录具体范围与版本，比只保存页面入口更便于回查。<Cite id="citation-selector"/></p>
      <div className={s.pair}><div><h3>找到材料</h3><p>标题、作者或机构、网址或标识符。读者能判断是哪份文档，并打开材料。</p></div><div><h3>找到依据</h3><p>页码、章节、段落或原文片段。读者能把这项结论与具体内容对应起来。</p></div></div>
      <p id="citation-limits" className="vp-citation-target">ALCE 也讨论自动判断的限制：部分支持等情况并不总能准确识别。<strong>自动评估结果仍要配合人工阅读。</strong>即使材料支持这句话，材料本身也可能过时、缺少适用条件或存在错误；引用使核查有入口，并不会替代核查。<Cite id="citation-limits"/></p>
    </ArticleSection>
    <ArticleSection id="identifiers" title="链接、版本与检查时间" className={base.offset}><Legacy slug="citation" names={["prompt-heading"]}/>
      <p id="citation-identifiers" className="vp-citation-target">Crossref 建议把它的 DOI 显示为完整的 https://doi.org/ 地址；出版方维护目标网址后，标识符能继续导向材料的新位置。<strong>稳定入口解决的是去哪找，不是内容是否正确。</strong>本页参考资料保留完整网址与机构，研究论文注明年份；会变化的技术文档还需要结合实际版本阅读。<Cite id="citation-identifiers"/></p>
      <ArticleAside title="沿引用核对结论"><p>先看原文是否真的存在，再看渠道、对象、时间和结论是否对应。如果系统只 <ConceptTerm slug="retrieval">检索</ConceptTerm> 到一个标题，还没有读到支持段落，就不能据此声称这句话已有依据。材料缺失时，可以缩小结论或继续查找。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
