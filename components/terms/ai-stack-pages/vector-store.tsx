import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { vectorStoreSources } from "@/lib/ai-stack-concept-sources/vector-store";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function VectorStoreTermPage() {
  const sections: [string, string][] = [["vector-store-write", "存什么才找得回来"], ["vector-store-filter-chapter", "近邻检索还要过过滤器"], ["vector-store-update", "原文变了，索引也要更新"]];
  return <Article slug="vector-store" title="向量存储" subtitle="Vector Store · 保存向量、来源和检索条件的索引容器" sources={vectorStoreSources} sections={sections} hero={<Hero trigger="把资料变成向量后，应用怎样找回对应原文？" change="向量 + 原文标识 + 元数据 + 近邻索引" proof="返回候选和来源位置，应用再检查版本与权限" />} intro={<>向量存储把向量与原文标识、版本、权限等元数据放在可查询的索引中。它可以由专门的向量数据库、普通数据库扩展或进程内结构实现；存储器负责组织和查找，不会自动更新事实或替你决定能不能引用。</>}>
    <ArticleSection id="vector-store-write" title="存什么才找得回来"><p>一条可用记录至少要能回答三件事：这个向量来自哪段原文、原文当前是什么版本、返回时是否允许当前用户看到。只保存一串浮点数，命中后就无法回到可读材料，也无法检查版本和权限。</p><p id="vector-store-definition" className="vp-citation-target">OpenAI Retrieval 将 vector store 描述为承载文件、分块、嵌入和索引的容器；检索结果仍然关联文件和属性。<Cite id="vector-store-definition" sources={vectorStoreSources} /></p><ContextRetrievalLesson mode="vector-store" /></ArticleSection>
    <ArticleSection id="vector-store-filter-chapter" title="近邻检索还要过过滤器"><p id="vector-store-index" className="vp-citation-target">FAISS 等近似近邻索引通过缩小需要比较的范围来换取速度；近邻算法的索引结构和精度、内存、延迟之间存在取舍。<Cite id="vector-store-index" sources={vectorStoreSources} /></p><p id="vector-store-filter" className="vp-citation-target">属性过滤会把语义相似度放进业务条件里，例如只看租户、版本或文档类型；过滤后的候选为空，不应静默改成全库搜索。<Cite id="vector-store-filter" sources={vectorStoreSources} /></p></ArticleSection>
    <ArticleSection id="vector-store-update" title="原文变了，索引也要更新"><p id="vector-store-ann" className="vp-citation-target">近似近邻检索的速度来自索引结构，而不是“数据库自动理解一切”。改变向量模型、维度或距离函数时，旧索引可能需要重建。<Cite id="vector-store-ann" sources={vectorStoreSources} /></p><p id="vector-store-metadata" className="vp-citation-target">Qdrant 将 payload 与向量放在集合中，并支持对 payload 建索引；元数据并不代替原文和权限设计。<Cite id="vector-store-metadata" sources={vectorStoreSources} /></p><p id="vector-store-lifecycle" className="vp-citation-target">向量数据库的生命周期包含写入、更新、删除和容量管理；Pinecone 的说明也强调向量和文档数据要按应用需要共同维护。<Cite id="vector-store-lifecycle" sources={vectorStoreSources} /></p></ArticleSection>
  </Article>;
}
