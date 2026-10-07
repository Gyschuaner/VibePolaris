import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { embeddingSources } from "@/lib/ai-stack-concept-sources/embedding";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function EmbeddingTermPage() {
  const sections: [string, string][] = [["embedding-map", "先把输入表示成向量"], ["embedding-comparison", "距离怎样帮助找候选"], ["embedding-limit", "相似不等于事实"]];
  return <Article slug="embedding" title="嵌入" subtitle="Embedding · 把输入映射到可比较的数值表示" sources={embeddingSources} sections={sections} hero={<Hero variant="field" trigger="为什么两句没有相同关键词，也可能被搜索到一起？" change="文字 → 向量表示 → 距离比较" proof="相近向量提供检索线索，原文和事实仍需另行核对" />} intro={<>嵌入模型把文字、代码或其他输入映射成固定维度的数值向量。相似度函数可以比较这些表示，用于搜索、聚类或推荐；向量不是原文压缩包，也不会自己生成答案。</>}>
    <ArticleSection id="embedding-map" title="先把输入表示成向量"><p>“忘记密码”和“如何重置登录”词面不同，但任务可能相近。嵌入模型把两句话变成同一空间里的向量，向量维度和模型由实现决定；页面里的二维点只是帮助初学者看懂关系的投影。</p><p id="embedding-definition" className="vp-citation-target">OpenAI 将 embedding 描述为浮点数向量，并把它用于搜索、聚类、推荐和分类；距离较小通常表示相关性更高，但不是事实判断。<Cite id="embedding-definition" sources={embeddingSources} /></p><ContextRetrievalLesson mode="embedding" /></ArticleSection>
    <ArticleSection id="embedding-comparison" title="距离怎样帮助找候选"><p id="embedding-distance" className="vp-citation-target">嵌入接口提供的是输入的数值表示，应用可以用 cosine similarity 等距离函数排列候选；距离函数和阈值属于检索设计，不是向量本身携带的答案。<Cite id="embedding-distance" sources={embeddingSources} /></p><p id="embedding-search" className="vp-citation-target">OpenAI 的 Embeddings 指南说明了把查询和文档编码，再用相似度进行语义搜索的路径。<Cite id="embedding-search" sources={embeddingSources} /></p></ArticleSection>
    <ArticleSection id="embedding-limit" title="相似不等于事实"><p id="embedding-model" className="vp-citation-target">Sentence-BERT 通过句子级向量让相似度计算更高效；不同模型、语言和训练数据会改变空间里“接近”的含义。<Cite id="embedding-model" sources={embeddingSources} /></p><p id="embedding-biencoder" className="vp-citation-target">Sentence Transformers 常把双编码器作为第一阶段召回，再用更精细的重排器检查候选；向量相近不是最终排名的唯一依据。<Cite id="embedding-biencoder" sources={embeddingSources} /></p><p id="embedding-representation" className="vp-citation-target">句子级嵌入空间由训练目标和数据分布塑造，不是脱离模型的通用坐标系；换模型后应重新评估相似度和阈值。<Cite id="embedding-representation" sources={embeddingSources} /></p><p id="embedding-attention" className="vp-citation-target">Transformer 的注意力机制提供了在输入位置之间建立关系的基础，但它不替应用定义相似度指标或事实边界。<Cite id="embedding-attention" sources={embeddingSources} /></p><p><strong>判断方法</strong>：看到相似度时同时查看原文、版本和权限；它说明“值得看”，不能单独证明“是真的”。</p></ArticleSection>
  </Article>;
}
