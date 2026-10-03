import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { chunkingSources } from "@/lib/ai-stack-concept-sources/chunking";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function ChunkingTermPage() {
  const sections: [string, string][] = [["chunking-unit", "先决定检索单元"], ["chunking-rule", "长度、重叠和结构"], ["chunking-boundary", "命中片段仍要回查"]];
  return <Article slug="chunking" title="分块" subtitle="Chunking · 把长文拆成可索引、可回查的小段" sources={chunkingSources} sections={sections} hero={<Hero trigger="为什么同一份政策，切法不同会得到不同的引用？" change="长文档 → 带结构和位置的检索单元" proof="块边界改变可命中的上下文，需保留标题、页码和相邻条件" />} intro={<>分块把长文档切成可以单独索引和返回的小段。分块大小、重叠、标题层级和页码会影响检索命中与引用范围；没有一个适合所有文档和查询的固定长度。</>}>
    <ArticleSection id="chunking-unit" title="先决定检索单元"><p>政策文档的“退款时效”可能依赖上一段的适用对象和下一段的例外条件。如果只按字符截断，命中的一句话可能失去标题或限制。好的分块先确定读者需要回看的最小完整单元，再选择实现方法。</p><p id="chunking-service" className="vp-citation-target">OpenAI Retrieval 会在文件进入 vector store 时自动分块、嵌入和建立索引；自动流程仍然有分块和引用边界，不能把它当成没有设计。<Cite id="chunking-service" sources={chunkingSources} /></p><ContextRetrievalLesson mode="chunking" /></ArticleSection>
    <ArticleSection id="chunking-rule" title="长度、重叠和结构"><p id="chunking-context" className="vp-citation-target">上下文工程要在相关性、完整性和预算之间做取舍；块太大增加噪声，块太小则可能失去条件和指代。<Cite id="chunking-context" sources={chunkingSources} /></p><p id="chunking-rag" className="vp-citation-target">RAG 论文把外部非参数记忆作为检索来源，但检索器拿到什么取决于文档如何被切分和表示；分块不是生成阶段的修辞步骤。<Cite id="chunking-rag" sources={chunkingSources} /></p><p id="chunking-rules" className="vp-citation-target">文本分割器通常支持固定长度、递归结构和重叠等策略；应按语言、文档结构和查询任务测试，而不是照抄一个数字。<Cite id="chunking-rules" sources={chunkingSources} /></p></ArticleSection>
    <ArticleSection id="chunking-boundary" title="命中片段仍要回查"><p id="chunking-structure" className="vp-citation-target">LlamaIndex 的 node parser 把文档节点、元数据和文本切分作为加载阶段的组成部分；保留父标题、页码或文档 ID，才能把候选追溯到原文。<Cite id="chunking-structure" sources={chunkingSources} /></p><p><strong>判断方法</strong>：看到一块命中时，先回到原文检查前后条件；如果一条限制被切走，宁可扩大引用范围，也不要用孤立句子替整段政策下结论。</p></ArticleSection>
  </Article>;
}
