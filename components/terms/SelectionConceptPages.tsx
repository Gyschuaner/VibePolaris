import { FileText, Funnel, Scissors, ListChecks } from '@phosphor-icons/react/dist/ssr';
import type { CSSProperties } from 'react';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { RetrievalLesson, ChunkingLesson, RerankingLesson } from './SelectionConceptLessons';
import { retrievalSources, chunkingSources, rerankingSources } from '@/lib/selection-sources';
import base from './EventConcepts.module.css';
import s from './SelectionConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span id={`${slug}-${name}`} key={name} className={base.anchor} aria-hidden="true"/>)}</>; }

export function RetrievalTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={retrievalSources}/>;
  return <ConceptArticle slug="retrieval" title="检索" sources={retrievalSources} sections={[["collection", "从资料集合里找到候选"], ["selection", "查询、范围与返回数量"], ["reading", "找到资料，再读原文"], ["relevance", "相关性要按任务判断"]]}
    intro={<>问“退款多久到账”，资料库里可能有申请入口、到账规则和内部记录。检索负责从这些材料中找出候选；哪些候选可用、是否足够回答，还要继续检查。</>}
    hero={<ConceptHero slug="retrieval" label="退款查询从四篇文档中选出A和B，候选仍然是资料"><div className={s.retrievalHero}><span><Funnel size={20}/> 查询：退款</span><div>{['A', 'B', 'C', 'D'].map(id => <div key={id} data-selected={id === 'A' || id === 'B'}><FileText size={26}/><strong>{id}</strong></div>)}</div><p>候选 A、B</p></div></ConceptHero>}>
    <ArticleSection id="collection" title="从资料集合里找到候选"><Legacy slug="retrieval" names={["question", "definition"]}/>
      <p id="retrieval-definition" className="vp-citation-target"><strong>检索是从一组材料中，找出满足信息需求的内容。</strong>《Introduction to Information Retrieval》用文档集合、查询与信息需求解释这个问题。它可以用于网站搜索、图书查找或 AI 应用；不一定伴随生成回答，也不限于向量搜索。查询是用户的表达，真正想解决的事可能比几个词更具体。<Cite id="retrieval-definition"/></p>
      <p>“退款”可能同时匹配申请入口与到账规则。两篇都提到同一主题，却只各自覆盖问题的一部分。<strong>找到同主题的文档，是继续阅读的起点。</strong>如果想知道审核通过后的线上退款时效，就要检查渠道、条件与具体时间。</p>
      <p id="retrieval-stages" className="vp-citation-target">Elastic 的 retriever 接口把查询封装成取得候选的步骤，也能组合多个检索器、融合结果或接入重排。<strong>检索方法与整个搜索流程要分开理解。</strong>词项匹配、向量比较和多路融合都是可选方案，索引怎样组织资料、候选怎样排序则需要相应实现。这里的演示只使用明确词项。<Cite id="retrieval-stages"/></p>
    </ArticleSection>
    <ArticleSection id="selection" title="查询、范围与返回数量"><Legacy slug="retrieval" names={["scene-heading"]}/>
      <p>下面四篇资料都是虚构的。查询按卡片上列出的词项匹配，先按身份限定范围，再按 A、B、C、D 的原始顺序取前几条。点击检索后，进入候选的文档会突出；再点击读取，才展示这些候选的原文。</p>
      <RetrievalLesson/>
      <p>读者查退款得到 A、B；运营身份最多取三条时，还能选中 D。查打印得到 C，查赛事则为空。<strong>没有结果时，应确认表达或资料范围，而不是编造一篇文档。</strong>本例没有调用搜索服务，身份控制也只是界面演示；真实系统必须在服务端执行访问限制。</p>
    </ArticleSection>
    <ArticleSection id="reading" title="找到资料，再读原文"><Legacy slug="retrieval" names={["quiz-heading"]}/>
      <p id="retrieval-output" className="vp-citation-target">DPR 论文把过程分为检索器与阅读器：前者从大集合选出较小的段落集合，后者读取这些段落并提取答案。<strong>检索的输出是候选材料，不是答案本身。</strong>DPR 使用配对训练的查询与段落编码器；这个具体方案说明两阶段的分工，不代表所有检索都使用同样的模型或度量。<Cite id="retrieval-output"/></p>
      <div className={s.readingPair}><div><h3>候选入口</h3><p>编号、标题、内容版本和分数，帮助决定先读哪篇。只看标题，无法知道完整条件。</p></div><div><h3>可读材料</h3><p>回到原文，核对退款渠道、审核状态和时效。需要生成回答时，再交给 <ConceptTerm slug="rag">RAG</ConceptTerm> 的后续过程。</p></div></div>
      <p>检索不到关键规则，后续阅读或生成就缺少依据。扩大候选数量可能找回遗漏，也可能加入干扰；修改查询、补充索引中的资料或改变检索方法，也都需要用真实样例检查。</p>
    </ArticleSection>
    <ArticleSection id="relevance" title="相关性要按任务判断" className={base.offset}><Legacy slug="retrieval" names={["prompt-heading"]}/>
      <p id="retrieval-relevance" className="vp-citation-target">PostgreSQL 的全文排序可以考虑词项出现频率、距离和文档中的位置，并明确指出相关性与应用有关。<strong>分数要配合排序方法和使用目的解释。</strong>把它归一到 0–1，并不会变成正确率百分比；一篇词项密集的说明，也可能没有用户需要的条件或适用版本。<Cite id="retrieval-relevance"/></p>
      <ArticleAside title="先看该找到的资料是否在候选里"><p>准备几条实际问题，标出能够解决问题的文档。观察是否漏掉关键材料、前排是否被无关内容占据，再调整查询、范围与候选数量。只有进入候选的文档，才能参与后面的 <ConceptTerm slug="reranking">重排序</ConceptTerm>。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function ChunkingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={chunkingSources}/>;
  return <ConceptArticle slug="chunking" title="分块" sources={chunkingSources} sections={[["units", "让一篇长文变成可用片段"], ["cuts", "看见切口与重叠"], ["structure", "按结构保留完整意思"], ["evaluation", "块长没有统一答案"]]}
    intro={<>退款规则里，“审核通过后”和“三个工作日内到账”属于同一个条件句。分块让长文能分段处理，也会改变哪些内容一起被检索、一起进入模型。切口放在哪里，会影响后续理解。</>}
    hero={<ConceptHero slug="chunking" label="一页退款说明沿段落分成三个片段，到账条件留在同一个片段"><div className={s.chunkHero}><Scissors size={24}/>{['退款申请', '审核通过 → 三个工作日', '打印服务'].map((text, i) => <div key={text} style={{ '--piece': i } as CSSProperties}><FileText size={18}/><strong>{text}</strong></div>)}</div></ConceptHero>}>
    <ArticleSection id="units" title="让一篇长文变成可用片段"><Legacy slug="chunking" names={["question", "definition"]}/>
      <p><strong>分块是把较长内容切成能独立处理的小片段。</strong>每块可以单独编码、存入索引、参与检索，再按需要取回。它改变的是资料的处理单位，原始文档仍应保存，块也需要能回到原文的位置。</p>
      <p id="chunk-purpose" className="vp-citation-target">Azure AI Search 的文档说明，分块既能适应模型输入长度，也能避免用一个表示概括一篇包含多种主题的长文。<strong>能塞进模型，并不代表整篇作为一块就适合检索。</strong>块长需要结合资料结构、问题类型和表示方法决定，不能只用输入上限反推。<Cite id="chunk-purpose"/></p>
      <p>退款说明还介绍打印服务。整篇一起检索，可能把无关段落带入；切得很细，又可能只取回“通常三个工作日”，丢失“线上退款审核通过后”。这两种问题需要一起考虑。</p>
    </ArticleSection>
    <ArticleSection id="cuts" title="看见切口与重叠"><Legacy slug="chunking" names={["scene-heading"]}/>
      <p>先保留原文，再按字符或段落切分。点击一个块，它在原文中的区间会被标出。字符模式使用 Unicode 码点计数，包含换行；重叠让相邻块共享一段内容。这里的“字符”不是模型使用的 <ConceptTerm slug="token">Token</ConceptTerm>。</p>
      <ChunkingLesson/>
      <p>24 字符、重叠 8 字符时，完整到账条件句没有落在任何一个块里。改成按段落，条件句保留在到账段落中。<strong>重叠能缓解边缘信息丢失，也会重复取回内容。</strong>重复字符数量只是本例的覆盖统计，不能当成检索质量分数。</p>
      <p id="chunk-size" className="vp-citation-target">LangChain 的递归切分器按一组分隔符逐级拆分，尽量保留较完整的文本结构，再约束块长和目标重叠。<strong>长度单位与切分方法必须一起说明。</strong>本页的固定字符切分是更简单的教学方法，没有执行它的递归算法；按段落模式也没有额外限制段落长度。<Cite id="chunk-size"/></p>
    </ArticleSection>
    <ArticleSection id="structure" title="按结构保留完整意思"><Legacy slug="chunking" names={["quiz-heading"]}/>
      <p id="chunk-structure" className="vp-citation-target">Unstructured 先根据文档格式识别标题、正文和表格等元素，再组合成块；过长元素仍可能进一步拆分。它的 by_title 策略还会利用章节边界。<strong>结构可以帮助选择切口，不能保证每块都有完整语义。</strong>跨段落的指代、条件和表格说明，仍要检查是否被分开。<Cite id="chunk-structure"/></p>
      <p id="chunk-language" className="vp-citation-target">LangChain 的文档特别讨论了没有空格分词的语言，可以补充中文标点等分隔符，减少不合适的切口。<strong>同一套分隔符不能直接假定适合所有语言。</strong>处理中文、代码或表格时，应使用对应样例验证，而不是只看块的平均长度。<Cite id="chunk-language"/></p>
      <p id="chunk-provenance" className="vp-citation-target">Unstructured 的块可以保留原始元素信息，让下游追溯到分块前的材料。<strong>片段需要带着出处一起走。</strong>本例使用原文字符区间；实际系统还应保留文档编号、版本和章节位置，便于展示上下文、更新索引或撤回过期内容。<Cite id="chunk-provenance"/></p>
    </ArticleSection>
    <ArticleSection id="evaluation" title="块长没有统一答案" className={s.chunkClosing}><Legacy slug="chunking" names={["prompt-heading"]}/>
      <p id="chunk-evaluation" className="vp-citation-target">Chroma 的分块研究按相关文本片段衡量检索覆盖，并考虑带入的无关或重复内容。它使用有限的语料和生成的查询、相关片段，不能证明某个块长普遍最优。<strong>应拿自己的资料和问题比较切分方案。</strong>既看关键依据能否被找到，也看是否取回大量干扰，以及后续回答是否保留了条件。<Cite id="chunk-evaluation"/></p>
      <ArticleAside title="长度、完整性与出处一起验收"><p>先选几条跨句条件、表格说明和跨段落指代。比较不同切口与重叠，检查需要的材料是否仍在同一块或能一起取回，再接入 <ConceptTerm slug="retrieval">检索</ConceptTerm>。有结构的段落也可能过长，需要继续拆分与补充上下文。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function RerankingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={rerankingSources}/>;
  return <ConceptArticle slug="reranking" title="重排序" sources={rerankingSources} sections={[["second-pass", "对已有候选再排一次"], ["pairs", "带着查询逐篇核对"], ["models", "规则与模型给出的新顺序"], ["window", "候选以外的资料不会出现"]]}
    intro={<>三篇候选都谈退款，用户却问“线上退款审核通过后，多久到账”。重新读取查询与候选，可以让真正覆盖这些条件的资料排到前面；没有进入候选的资料，无法靠重排找回来。</>}
    hero={<ConceptHero slug="reranking" label="查询条件逐项核对线上退款文档，三个条件一起决定优先阅读"><div className={s.rerankHero}><ListChecks size={27}/><strong>线上退款时效</strong><div>{['线上', '审核通过', '到账时间'].map((text, i) => <span key={text} style={{ '--check': i } as CSSProperties}>✓ {text}</span>)}</div><p>优先读取 B</p></div></ConceptHero>}>
    <ArticleSection id="second-pass" title="对已有候选再排一次"><Legacy slug="reranking" names={["question", "definition"]}/>
      <p><strong>重排序是在已取回的候选里，按新的判断重新安排顺序。</strong>第一阶段通常先从大集合找出一批内容，后续可以使用更细的规则或模型比较。它改变阅读的优先级，原文内容和已有候选范围并不会因此自动改变。</p>
      <p id="rerank-pairs" className="vp-citation-target">Sentence Transformers 的 Retrieve &amp; Re-Rank 先检索候选，再让 Cross-Encoder 联合读取查询与每篇候选，给出用于排序的分数。<strong>逐对读取能检查更具体的关系，也增加计算量。</strong>这是重排的一种实现；不必把“使用 Cross-Encoder”当成重排序的定义。<Cite id="rerank-pairs"/></p>
      <p>申请入口只说明“怎么申请”，柜台时效不适用于线上退款。标题和词项都很接近，但它们覆盖的条件不同。排序需要比较问题真正要求的内容，也要保留文档的适用范围。</p>
    </ArticleSection>
    <ArticleSection id="pairs" title="带着查询逐篇核对"><Legacy slug="reranking" names={["scene-heading"]}/>
      <p>候选初始顺序固定为 A、C、B，不来自真实搜索。先取前两篇，带着查询逐篇核对原文中的条件，再生成新顺序。这里按预先标注的事实数数：满足多少条查询条件，就优先多少；同数保持原来的顺序。</p>
      <RerankingLesson/>
      <p>只取 A、C 时，重排得到 C、A；C 覆盖审核与时效，却不适用于线上。扩大到三篇，B 才进入候选并排到首位。改问申请入口，A 又优先。<strong>这些是明确的手工标注与计数，没有运行重排模型。</strong>缺失的条件不会因为排到第一就自动得到补齐。</p>
    </ArticleSection>
    <ArticleSection id="models" title="规则与模型给出的新顺序"><Legacy slug="reranking" names={["quiz-heading"]}/>
      <p id="rerank-learning" className="vp-citation-target">Nogueira 与 Cho 的 BERT 重排论文，把查询和段落作为成对输入，用标注过的查询—段落训练相关性判断，再对初始检索结果重新排序。<strong>模型分数来自训练任务和数据。</strong>论文在特定检索数据集上的结果，不能直接替代对自己的退款资料、语言与查询分布的评估。<Cite id="rerank-learning"/></p>
      <p id="rerank-index" className="vp-citation-target">Cohere 的 Rerank 接口接收查询和一组文档，返回原始文档列表中的索引及相关性分数。<strong>新顺序需要对应回原文。</strong>调用方仍需按索引读取正确内容、保存出处；不能把分数当成事实正确率，也不能把新列表的位置误认为原文的编号。<Cite id="rerank-index"/></p>
      <div className={s.ruleNote}><h3>相关，不等于可靠</h3><p>过期规则、错误陈述也可能非常贴题。可以另设版本、权限或出处条件，筛掉不可用材料；排序承担的是先看哪篇，不是替文档证明真假。</p></div>
    </ArticleSection>
    <ArticleSection id="window" title="候选以外的资料不会出现" className={base.offset}><Legacy slug="reranking" names={["prompt-heading"]}/>
      <p id="rerank-window" className="vp-citation-target">Elasticsearch 的 rescore 在各分片先选定结果窗口，再做额外的查询、脚本或学习排序，以控制计算开销。<strong>处理窗口限制了能重排的候选。</strong>本页只有一个小列表，不模拟分片流程；共同的边界是：资料不在处理范围内，就不会因这个阶段出现。<Cite id="rerank-window"/></p>
      <ArticleAside title="区分漏召回与排错顺序"><p>正确资料没进入候选，先检查 <ConceptTerm slug="retrieval">检索</ConceptTerm> 和候选数量；已经进入却排得靠后，再检查重排依据。增加窗口可能改善覆盖，也会增加工作量，需要同时观察质量与延迟。</p></ArticleAside>
      <p>接入 <ConceptTerm slug="rag">RAG</ConceptTerm> 后，排在前面的资料只是更早进入阅读。回答仍要核对条件、冲突和引用；遇到本例的 C，也应该说明渠道不符，而不是直接回答七个工作日。</p>
    </ArticleSection>
  </ConceptArticle>;
}
