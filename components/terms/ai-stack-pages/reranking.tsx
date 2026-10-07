import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { rerankingSources } from "@/lib/ai-stack-concept-sources/reranking";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function RerankingTermPage() {
  const sections: [string, string][] = [["rerank-input", "重排从已有候选开始"], ["rerank-score", "重新评分会改变顺序"], ["rerank-boundary", "漏掉的内容回不来"]];
  return <Article slug="reranking" title="重排序" subtitle="Reranking · 用更精细的比较重新安排候选顺序" sources={rerankingSources} sections={sections} hero={<Hero variant="compare" trigger="初次搜索把退款政策排第二，怎样把真正相关的段落提到第一？" change="初次候选 → 查询与正文联合评分 → 新顺序" proof="重排只处理已经召回的候选，不能补回完全漏掉的内容" />} intro={<>重排序接收检索阶段的一小组候选，用更精细的模型或规则重新比较它们，再把最相关的内容放在前面。它通常比全库精排便宜，但结果上限受初次召回范围限制。</>}>
    <ArticleSection id="rerank-input" title="重排从已有候选开始"><p>快速向量召回先得到 A、B、C 三条。重排器不会重新扫描整座资料库，也不会凭空发现 D；它只对这三条重新判断。页面把两次排序都显示出来，避免读者以为第二个分数来自同一套计算。</p><p id="rerank-definition" className="vp-citation-target">Cohere 将 rerank 描述为给定 query 和文档列表后，按语义相关性把文档重新排序；每个文档与查询一起进入模型上下文限制。<Cite id="rerank-definition" sources={rerankingSources} /></p><ContextRetrievalLesson mode="reranking" /></ArticleSection>
    <ArticleSection id="rerank-score" title="重新评分会改变顺序"><p id="rerank-pipeline" className="vp-citation-target">Sentence Transformers 的 retrieve-and-rerank 示例先用双编码器高效召回，再用 Cross-Encoder 对 query 和候选段落联合评分；两阶段的分数不能直接当成同一种尺度。<Cite id="rerank-pipeline" sources={rerankingSources} /></p><p id="rerank-crossencoder" className="vp-citation-target">Passage Re-ranking with BERT 展示了把查询和段落一起输入模型进行精细判断的路径；它提高的是候选排序，而不是全库召回范围。<Cite id="rerank-crossencoder" sources={rerankingSources} /></p><p id="rerank-late-interaction" className="vp-citation-target">ColBERT 用 late interaction 在效率和精细匹配之间取舍；具体模型选择要按语言、延迟、成本和验证数据决定。<Cite id="rerank-late-interaction" sources={rerankingSources} /></p></ArticleSection>
    <ArticleSection id="rerank-boundary" title="漏掉的内容回不来"><p id="rerank-limit" className="vp-citation-target">每条送入 rerank 的文档都会消耗该模型的上下文预算，过长文档还可能被切分处理；所以输入候选的长度和数量也是质量、成本和延迟的一部分。<Cite id="rerank-limit" sources={rerankingSources} /></p><p id="rerank-candidates" className="vp-citation-target">检索系统的 vector store 和候选过滤先决定“谁有资格进入这一轮”；重排只能在这个集合内排序。<Cite id="rerank-candidates" sources={rerankingSources} /></p><p><strong>判断方法</strong>：把初次召回、重排分数和最终截取分开记录；如果正确段落从未进入候选，先修召回或过滤，而不是继续调重排模型。</p></ArticleSection>
  </Article>;
}
