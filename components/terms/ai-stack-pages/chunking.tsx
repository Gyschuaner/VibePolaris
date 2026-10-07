import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { chunkingSources } from "@/lib/ai-stack-concept-sources/chunking";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function ChunkingTermPage() {
  const sections: [string, string][] = [
    ["chunking-unit", "先决定检索单元"],
    ["chunking-rule", "长度、重叠和结构"],
    ["chunking-reconstruction", "切开以后还要拼得回来"],
    ["chunking-boundary", "命中片段仍要回查"],
  ];
  return <Article slug="chunking" title="分块" subtitle="Chunking · 把长文拆成可索引、可回查的小段" sources={chunkingSources} sections={sections} hero={<Hero trigger="为什么同一份政策，切法不同会得到不同的引用？" change="长文档 → 带结构和位置的检索单元" proof="块边界改变可命中的上下文，需保留标题、页码和相邻条件" />} intro={<>分块把长文档切成可以单独索引和返回的小段。它不是把文章平均切成几段，而是在“这一小段单独拿出来，读者还能不能做出正确判断”这个问题上做取舍。大小、重叠、标题层级和页码都会影响检索命中与引用范围，没有一个适合所有文档和查询的固定长度。</>}>
    <ArticleSection id="chunking-unit" title="先决定检索单元">
      <p>政策文档的“退款时效”可能依赖上一段的适用对象和下一段的例外条件。如果只按字符截断，命中的一句话可能失去标题或限制。好的分块先确定读者需要回看的最小完整单元，再选择实现方法：FAQ 可以以问答为单位，合同更适合保留条款和子条款，日志则可能按一次事件或一个请求切开。</p>
      <p id="chunking-service" className="vp-citation-target">OpenAI Retrieval 会在文件进入 vector store 时自动分块、嵌入和建立索引；自动流程仍然有分块和引用边界，不能把它当成没有设计。<Cite id="chunking-service" sources={chunkingSources} />即使把切分交给服务，也要验证它返回的文本能否带回适用范围、例外和原文位置。</p>
      <ContextRetrievalLesson mode="chunking" />
    </ArticleSection>

    <ArticleSection id="chunking-rule" title="长度、重叠和结构">
      <p id="chunking-context" className="vp-citation-target">上下文工程要在相关性、完整性和预算之间做取舍；块太大增加噪声和 token 成本，块太小则可能失去条件、指代和否定词。<Cite id="chunking-context" sources={chunkingSources} />“更大”或“更小”都不是质量标准，能否支持当前查询才是。</p>
      <p id="chunking-rag" className="vp-citation-target">RAG 论文把外部非参数记忆作为检索来源，但检索器拿到什么取决于文档如何被切分和表示；分块不是生成阶段的修辞步骤。<Cite id="chunking-rag" sources={chunkingSources} />如果“仅限企业版”被切到下一块，模型即使找到了“支持导出”，也可能给出错误结论。</p>
      <p id="chunking-rules" className="vp-citation-target">文本分割器通常支持固定长度、递归结构和重叠等策略；应按语言、文档结构和查询任务测试，而不是照抄一个数字。<Cite id="chunking-rules" sources={chunkingSources} />重叠能减少边界丢失，却会增加重复索引和重复召回，必须和预算一起评估。</p>
    </ArticleSection>

    <ArticleSection id="chunking-reconstruction" title="切开以后还要拼得回来">
      <p id="chunking-structure" className="vp-citation-target">LlamaIndex 的 node parser 把文档节点、元数据和文本切分作为加载阶段的组成部分；保留父标题、页码或文档 ID，才能把候选追溯到原文。<Cite id="chunking-structure" sources={chunkingSources} />这些字段不是装饰：它们告诉阅读者这句话属于哪一章、哪一版、哪一页。</p>
      <p>检索返回时可以只给一小块以节省上下文，但展示引用时应能沿着父标题、相邻块和原文链接向外展开。切分是索引时的动作，回查是理解时的动作；两者之间少了位置关系，命中就变成无法复核的孤岛。</p>
      <p>更新文档时也要保留版本和块标识。重新切分后，同一个块号不一定还是同一段内容；如果缓存只按块号复用旧结果，读者看到的引用可能已经和当前正文错位。</p>
    </ArticleSection>

    <ArticleSection id="chunking-boundary" title="命中片段仍要回查">
      <p>分块优化的是“把可能相关的材料带回来”，不是替阅读者确认答案。看到一块命中时，先回到原文检查前后条件、适用对象、时间范围和例外；如果一条限制被切走，宁可扩大引用范围，也不要用孤立句子替整段政策下结论。</p>
      <p><strong>判断方法</strong>：拿三类问题做回放——直接问定义、追问例外、跨段引用。若第一类命中而后两类经常丢条件，问题通常在块边界或元数据，而不只是嵌入模型。</p>
      <p>最终验收应同时看召回率、重复量、引用可追溯性和上下文成本。一个“命中很多”的切法，如果让答案带入错误版本或大量重复段落，仍然不是好分块。</p>
    </ArticleSection>
  </Article>;
}
