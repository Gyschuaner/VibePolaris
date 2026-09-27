import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { EmbeddingLesson, SemanticLesson, RagLesson } from './SemanticConceptLessons';
import { embeddingSources, semanticSources, ragSources } from '@/lib/semantic-sources';
import base from './EventConcepts.module.css';
import s from './SemanticConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span id={`${slug}-${name}`} key={name} className={base.anchor} aria-hidden="true"/>)}</>; }

export function EmbeddingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={embeddingSources}/>;
  return <ConceptArticle slug="embedding" title="嵌入" sources={embeddingSources} sections={[["representation", "把内容表示成一组数"], ["comparison", "比较表示，保留原文"], ["configuration", "表示空间与输入配置"], ["length", "长文本与信息损失"]]}
    intro={<>“想晚几天还书”与“延长借书期限”用词不同，却在说相近的事。嵌入把内容映射到数值空间，为比较、检索和分类提供表示；这些数能表达什么，取决于表示方法与训练任务。</>}
    hero={<ConceptHero slug="embedding" label="两种续借表达变为三维数值条，分量相近但并不相同"><div className={s.embeddingHero}><div><span>晚几天还书</span><code>0.8　0.6　0.0</code><div>{[80, 60, 0].map((n, i) => <i key={i} style={{ width: `${n}%` }}/>)}</div></div><div><span>延长借书期限</span><code>0.6　0.8　0.0</code><div>{[60, 80, 0].map((n, i) => <i key={i} style={{ width: `${n}%` }}/>)}</div></div></div></ConceptHero>}>
    <ArticleSection id="representation" title="把内容表示成一组数"><Legacy slug="embedding" names={["question", "definition"]}/>
      <p><strong>嵌入是把对象映射到数值空间的表示。</strong>对象可以是词、句子，也可以是图像等内容。检索里常使用学习得到的向量，让适合当前任务的对象关系能通过数值比较体现出来；不只是把文字换成编号。</p>
      <p id="embedding-learning" className="vp-citation-target">Mikolov 等人的词向量研究从大量文本学习连续表示，并用词语关系检验结果。<strong>向量中的关系来自表示方法与训练数据。</strong>词向量是其中一种方案，不能把“每个词一条向量”直接当成整篇文档的表示，也不能期待任意模型都保留同一种关系。<Cite id="embedding-learning"/></p>
      <p id="embedding-sentences" className="vp-citation-target">Sentence-BERT 在句子层面构造可独立计算的表示，并用余弦等度量比较。论文也比较了直接取 BERT 输出的做法，说明<strong>拿到一组模型数值，不代表它已经适合相似性检索。</strong>需要按任务训练或选择合适的表示，再检查实际效果。<Cite id="embedding-sentences"/></p>
    </ArticleSection>
    <ArticleSection id="comparison" title="比较表示，保留原文"><Legacy slug="embedding" names={["scene-heading"]}/>
      <p>下面为三句文本手工指定三维向量。选择一句，生成预设表示，再与“想晚几天还书”比较。三个分量用数值条显示；它们没有预先命名成“续借程度”或“打印程度”，只是让数值变化可见。</p>
      <EmbeddingLesson/>
      <p>两种续借表达得到余弦 0.96，打印句约为 0.12。换成未对齐的编码器 B，会停止比较。<strong>这里真实计算数值，没有运行嵌入模型。</strong>手工向量只用于解释表示和度量，不能证明某个真实模型理解了这三句话。</p>
      <p id="embedding-output" className="vp-citation-target">Hugging Face 的特征提取页面展示从文本得到数值特征、再用于分类或检索的过程。<strong>表示的输出与生成回答的输出不同。</strong>向量通常需要连同原文入口保存，检索找到编号后仍要读取具体内容；它不是无损压缩文件，也不是一份可直接引用的文字答案。<Cite id="embedding-output"/></p>
    </ArticleSection>
    <ArticleSection id="configuration" title="表示空间与输入配置"><Legacy slug="embedding" names={["quiz-heading"]}/>
      <p id="embedding-config" className="vp-citation-target">Sentence Transformers 文档说明，部分模型要求查询和文档使用不同前缀。<strong>查询与文档必须遵守同一套兼容的表示约定。</strong>不一定使用完全相同的编码器，但模型配对、版本、预处理和比较方法要一起确认。仅看向量维度相同，无法证明可以混用。<Cite id="embedding-config"/></p>
      <div className={s.columns}><div><h3>生成表示</h3><p>决定文本怎样进入模型、得到什么维度与数值。模型升级后，已有文档可能需要重新编码。</p></div><div><h3>检索表示</h3><p>按选定度量比较查询与文档，寻找候选。<ConceptTerm slug="vector-database">向量数据库</ConceptTerm> 管理这些记录与索引。</p></div></div>
      <p>余弦比较方向，点积还受长度影响，欧氏距离比较坐标差异。选用哪一种，要配合模型的训练与使用约定。<strong>相似分数不是“有多少概率是真的”。</strong>否定句、相同主题下的相反结论和过期内容，都需要回到原文检查。</p>
    </ArticleSection>
    <ArticleSection id="length" title="长文本与信息损失" className={base.offset}><Legacy slug="embedding" names={["prompt-heading"]}/>
      <p id="embedding-length" className="vp-citation-target">Sentence Transformers 的计算指南说明，超出模型最大输入长度的文本会被截断，训练于短文本的表示也未必适合长文本。<strong>给模型一整篇文章，不保证每一句都进入表示。</strong>先核对输入限制与切分方式，再用重要信息位于不同位置的样例检验。<Cite id="embedding-length"/></p>
      <ArticleAside title="维度多，不等于信息完整"><p>维度是表示结构的一个参数，不能单独证明检索质量。应检查任务、语言、原文长度、模型版本和相关样例；也要保存内容版本与文档编号，避免新旧表示混在一起。</p></ArticleAside>
      <p>做文档检索前，准备几组相关表达和容易混淆的反例。看它们的排序是否符合使用目的，再决定如何接入 <ConceptTerm slug="semantic-search">语义搜索</ConceptTerm>。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function SemanticSearchTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={semanticSources}/>;
  return <ConceptArticle slug="semantic-search" title="语义搜索" sources={semanticSources} sections={[["meaning", "不同措辞，寻找相关内容"], ["candidates", "分数、范围与返回数量"], ["reranking", "候选之后的重新排序"], ["evaluation", "用相关标注检查结果"]]}
    intro={<>读者问“想晚几天还书”，需要找到续借规则，即使标题没有同样的词。语义搜索尝试按表达的含义寻找相关内容；检索结果仍然是一组候选，版本和适用范围还需核对。</>}
    hero={<ConceptHero slug="semantic-search" label="按相似分数排列旧版说明与现行规则，最相近的旧版并不自动可用"><div className={s.searchHero}><span>想晚几天还书</span><div><strong>B · 延长借阅期限</strong><code>0.9998</code><em>旧版</em></div><div><strong>A · 续借规则</strong><code>0.9939</code><em>现行</em></div><p>最相近的候选，仍要看版本。</p></div></ConceptHero>}>
    <ArticleSection id="meaning" title="不同措辞，寻找相关内容"><Legacy slug="semantic-search" names={["question", "definition"]}/>
      <p><strong>语义搜索尝试按含义关系找到与查询相关的内容。</strong>一种常见方法是把查询与文档编码成兼容的向量，再比较相似性。文字不必完全相同，也可能进入候选；具体能跨越哪些措辞差异，要由模型和数据验证。</p>
      <p id="semantic-encoding" className="vp-citation-target">DPR 的研究用配对训练的查询编码器与段落编码器，预先保存文档表示，查询时用点积选出候选段落。<strong>编码、候选检索与读取答案是不同环节。</strong>这是稠密检索的一种具体实现，不能把 DPR 的训练方式或点积度量当成所有语义搜索的统一规范。<Cite id="semantic-encoding"/></p>
      <p>关键词搜索适合核对明确词项、编号和固定表达；语言分析也能补充同义词。语义方法可以补充不同措辞的匹配，两者并非只能二选一。产品需要的首先是“哪些文档能解决这个问题”，再选择检索方法。</p>
    </ArticleSection>
    <ArticleSection id="candidates" title="分数、范围与返回数量"><Legacy slug="semantic-search" names={["scene-heading"]}/>
      <p>四篇文档已指定三维向量，三个查询也使用固定表示。点击检索，文档按余弦分数移动到对应位置，符合版本、最低分数和返回数量的候选会被突出。B 的分数最高，但它是旧版；这正是相似性与可用性之间的区别。</p>
      <SemanticLesson/>
      <p>默认返回 B、A。只保留现行版本并取一条，就返回 A；问打印时，C 优先。健身房查询与这里的文档分数都为零，在当前阈值下不返回。<strong>top-k 是最多取多少条，不能替代相关性或业务条件。</strong>最低分数也只是本例的筛选参数，不是通用的正确率门槛。</p>
      <p>这里使用手工向量和精确计算，没有运行语言模型、ANN 索引或真实搜索服务。人工标注把续借查询的现行规则 A、打印查询的 C 视为相关，维护说明和旧规则不算直接满足需求。得分可以复算，相关性判断则来自这个明确的任务。</p>
    </ArticleSection>
    <ArticleSection id="reranking" title="候选之后的重新排序"><Legacy slug="semantic-search" names={["quiz-heading"]}/>
      <p id="semantic-rerank" className="vp-citation-target">Sentence Transformers 的 Retrieve &amp; Re-Rank 先取回一批候选，再用 Cross-Encoder 联合读取查询与每个候选、重新排序。<strong>重排能更细地比较已取回的内容，代价是逐对计算。</strong>候选阶段漏掉的文档，不会仅靠重新排序出现。本页没有模拟重排模型或编造模型评分。<Cite id="semantic-rerank"/></p>
      <p id="semantic-generalization" className="vp-citation-target">BEIR 对不同领域和任务的检索方法做了对照，发现稠密方法的表现会随领域变化，BM25 仍是有力基线。<strong>在一个测试集里领先，不保证在自己的资料库里更好。</strong>选择方法时同时检查质量、延迟与成本，而不是只看“语义”这个名称。<Cite id="semantic-generalization"/></p>
      <ArticleAside title="精确字段仍然需要明确条件"><p>书目 #42、某个错误代码和有效日期，不应仅依靠意思相近来判断。可以先用业务字段限定范围，也可以结合词项检索与向量检索；怎样融合和排序，需要单独定义与评估。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="evaluation" title="用相关标注检查结果" className={base.offset}><Legacy slug="semantic-search" names={["prompt-heading"]}/>
      <p id="semantic-evaluation" className="vp-citation-target">《Introduction to Information Retrieval》把精确率定义为返回结果中相关文档的比例，把召回率定义为全部相关文档中已返回的比例。<strong>评估依赖查询与文档的相关标注，而不只是分数。</strong>本例 B、A 两条里只有 A 相关，因此精确率 1/2，召回率 1/1。零条返回时精确率分母为零，本页显示未定义。<Cite id="semantic-evaluation"/></p>
      <div className={s.evaluationNote}><strong>多取几条，可以找回遗漏，也可能加入干扰。</strong><p>对同一批真实查询分别看相关文档是否被找到、前排是否有干扰，再调整 k、范围、表示或重排。不能用三个教学查询代表整个系统质量。</p></div>
      <p>需要生成回答时，候选还要变成可读取、可核对的资料，再交给 <ConceptTerm slug="rag">RAG</ConceptTerm> 的后续环节。搜索分数本身不能成为事实依据。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function RagConceptTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={ragSources}/>;
  return <ConceptArticle slug="rag" title="RAG" subtitle="检索增强生成" sources={ragSources} sections={[["retrieval", "回答前，先取回资料"], ["evidence", "检索资料进入本轮回答"], ["context", "选择与更新可用内容"], ["checking", "核对回答，也核对资料"]]}
    intro={<>“这本书能续借吗？”需要本馆规则和当前预约状态。RAG 在生成回答时加入检索得到的资料，让模型能利用参数之外的信息；这些资料是否充分、有效，仍然要检查。</>}
    hero={<ConceptHero slug="rag" label="续借规则A与预约状态B一起支持不能续借的回答"><div className={s.ragHero}><div><code>A · 规则</code><strong>未被预约才可续借</strong></div><div><code>B · 状态</code><strong>已有预约</strong></div><p>当前不能续借。<span>[A] [B]</span></p></div></ConceptHero>}>
    <ArticleSection id="retrieval" title="回答前，先取回资料"><Legacy slug="rag" names={["question", "definition"]}/>
      <p id="rag-definition" className="vp-citation-target"><strong>RAG 把检索得到的外部资料与生成过程结合起来。</strong>Lewis 等人的原始研究把生成模型的参数记忆与文档索引中的外部记忆组合，用问题检索段落，再让生成依赖问题和取回内容。外部资料可以更新和查看，不必把每次知识变化都写进模型参数。<Cite id="rag-definition"/></p>
      <p>常见应用把过程分成准备资料、检索候选、组织本轮输入、生成回答。资料先有来源与版本，检索找到相关片段，本轮输入保留回答所需的内容，模型再组织文字。<strong>上传文件、找到片段与正确回答，是三个不同的结果。</strong></p>
      <p id="rag-original" className="vp-citation-target">原始论文研究了 RAG-Sequence 与 RAG-Token，并对检索器与生成器进行联合微调。今天使用现成检索服务和模型拼接输入的应用，不必复现这套训练架构。<strong>名字相同，仍要核对具体实现怎样取资料、怎样使用资料。</strong><Cite id="rag-original"/></p>
    </ArticleSection>
    <ArticleSection id="evidence" title="检索资料进入本轮回答"><Legacy slug="rag" names={["scene-heading"]}/>
      <p>A 规定只有未被预约的书才可续借，每次延长 14 天；B 说书目 #42 已有预约。先取回资料，再按资料组织预设答复。点击某一句，会突出它依赖的资料；把场景改成缺规则或规则冲突，旧答复会收起。</p>
      <RagLesson/>
      <p>完整资料下，不能续借的结论同时依赖 A 的条件和 B 的状态。只取到 B，只能说明已有预约，不能凭空补出续借政策。取到互相矛盾的 A、C，则先确认有效规则。<strong>缺资料或资料冲突时，回答应明确缺口，而不是挑一个数字继续说。</strong></p>
      <p>这是固定资料包与规则生成的教学答复，没有调用语言模型或访问真实书目。点击依据只展示我们在例子中声明的支持关系；真实模型是否正确使用了材料，仍需独立核对。</p>
    </ArticleSection>
    <ArticleSection id="context" title="选择与更新可用内容"><Legacy slug="rag" names={["quiz-heading"]}/>
      <p id="rag-index" className="vp-citation-target">Hugging Face 的 RAG 文档说明，推理时取回段落并据此生成，外部知识可以通过改变索引更新。<strong>内容更新后，要让检索实际能读到新版本。</strong>若应用使用嵌入与缓存，还需按自己的数据流维护对应表示和缓存；只修改原始文件，不足以证明回答已经使用新资料。<Cite id="rag-index"/></p>
      <p id="rag-context" className="vp-citation-target">Lost in the Middle 在多文档问答等实验中发现，相关信息的位置会影响模型使用长输入的表现。<strong>取回更多内容，不保证关键资料被更好地利用。</strong>这是一组特定模型与任务的实验结论，不能把其效果大小照搬到所有模型；它提醒我们检查输入选择、顺序与干扰内容。<Cite id="rag-context"/></p>
      <div className={s.columns}><div><h3>检索范围</h3><p>限定资料库、用户可见内容、版本和任务范围。相似但无权访问的内容，不能进入本轮输入。</p></div><div><h3>本轮输入</h3><p>保留问题、必要片段和可追溯标识。<ConceptTerm slug="context-window">窗口容量</ConceptTerm> 是约束，不是资料质量标准。</p></div></div>
      <ArticleAside title="资料内容不等于操作授权"><p>取回的文章中可能夹杂错误、过期内容或诱导指令。应把它作为待使用的数据，并保留指令与数据的边界。若回答还要执行工具操作，权限由可信系统另外检查，不能由资料中的一句话决定。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="checking" title="核对回答，也核对资料" className={base.offset}><Legacy slug="rag" names={["prompt-heading"]}/>
      <p id="rag-evaluation" className="vp-citation-target">RAGAS 区分回答是否忠于上下文、是否回应问题，以及取回内容是否相关，并研究自动估计这些维度。<strong>回答忠于资料，不等于资料本身正确。</strong>系统可能准确复述了一份错误规则；自动评估也有误差，需要与实际任务和人工检查对照。本页没有运行 RAGAS 或宣称自动核验通过。<Cite id="rag-evaluation"/></p>
      <div className={s.checking}><div><strong>先看资料</strong><p>有没有取到必要规则？来源、版本、范围和冲突是否可判断？</p></div><div><strong>再看答句</strong><p>每个结论能否由资料支持？条件是否遗漏？有没有直接回答问题？</p></div></div>
      <p>上线前保存有代表性的“问题—资料—回答”样例，把错误分到检索、输入组织或生成使用的环节。引用能帮助读者追查，但仅仅显示角标，不能证明那句话受来源支持。</p>
    </ArticleSection>
  </ConceptArticle>;
}
