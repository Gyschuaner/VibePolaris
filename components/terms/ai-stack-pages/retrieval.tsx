import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { retrievalSources } from "@/lib/ai-stack-concept-sources/retrieval";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function RetrievalTermPage() {
  const sections: [string, string][] = [["retrieval-candidate", "检索先返回候选"], ["retrieval-method", "词项、向量和组合"], ["retrieval-boundary", "候选不是答案"]];
  return <Article slug="retrieval" title="检索" subtitle="Retrieval · 从资料集合中找出值得继续检查的候选" sources={retrievalSources} sections={sections} hero={<Hero trigger="资料库很大时，模型怎样先找到可能相关的几段？" change="查询 → 召回候选 → 排序或核对" proof="流程停在带来源的候选材料，不把命中直接写成结论" />} intro={<>检索根据查询从已有资料中返回候选内容。它可以使用关键词、向量或混合方法，通常还带回分数、文档 ID 和版本；检索本身不负责生成回答，也不能保证候选完整、正确或有权使用。</>}>
    <ArticleSection id="retrieval-candidate" title="检索先返回候选"><p>“退款多久到账”进入 200 段政策材料后，系统先缩小到几条候选，再让应用读取、重排或交给生成模型。候选数量、过滤条件和来源位置都应该可见，否则读者无法判断回答依据了什么。</p><p id="retrieval-semantic" className="vp-citation-target">OpenAI Retrieval 说明 semantic search 可以在词面不完全相同的情况下找到相关结果，并由 vector store 承载分块、嵌入和索引。<Cite id="retrieval-semantic" sources={retrievalSources} /></p><ContextRetrievalLesson mode="retrieval" /></ArticleSection>
    <ArticleSection id="retrieval-method" title="词项、向量和组合"><p id="retrieval-dense" className="vp-citation-target">Dense Passage Retrieval 用查询和段落的向量表示来召回候选；它适合语义相近但词面不同的情况，也受训练数据和领域差异影响。<Cite id="retrieval-dense" sources={retrievalSources} /></p><p id="retrieval-bm25" className="vp-citation-target">关键词检索保留精确词项、编号和专名等信号。混合检索把稀疏匹配和语义匹配结合，权重和过滤策略应通过业务数据验证。<Cite id="retrieval-bm25" sources={retrievalSources} /></p></ArticleSection>
    <ArticleSection id="retrieval-boundary" title="候选不是答案"><p id="retrieval-rag-boundary" className="vp-citation-target">RAG 将检索到的材料交给生成模型来合成回答；因此“找到了相关段落”和“回答被这些段落支持”是两个可分开检查的结果。<Cite id="retrieval-rag-boundary" sources={retrievalSources} /></p><p id="retrieval-candidates" className="vp-citation-target">检索返回的 top-k 只说明当前策略选择了这些候选；漏掉的材料无法在后续重排序阶段恢复，低分也不自动等于错误。<Cite id="retrieval-candidates" sources={retrievalSources} /></p><p id="retrieval-topk" className="vp-citation-target">两阶段检索常先用快速召回缩小范围，再对 top-k 做更精细排序；这是一种工程组合，不是检索一词的唯一实现。<Cite id="retrieval-topk" sources={retrievalSources} /></p></ArticleSection>
  </Article>;
}
