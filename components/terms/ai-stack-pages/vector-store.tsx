import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { vectorStoreSources } from "@/lib/ai-stack-concept-sources/vector-store";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";
import { VectorStoreLedgerHero } from "../ai-stack-lessons/signature-heroes";

export function VectorStoreTermPage() {
  const sections: [string, string][] = [
    ["vector-store-write", "存什么才找得回来"],
    ["vector-store-filter-chapter", "近邻检索还要过过滤器"],
    ["vector-store-lifecycle-chapter", "原文变了，索引也要更新"],
    ["vector-store-boundary", "它是索引容器，不是真相仓库"],
  ];
  return <Article slug="vector-store" title="向量存储" subtitle="Vector Store · 保存向量、来源和检索条件的索引容器" sources={vectorStoreSources} sections={sections} hero={<VectorStoreLedgerHero />} intro={<>向量存储把向量与原文标识、版本、权限等元数据放在可查询的索引中。它可以由专门的向量数据库、普通数据库扩展或进程内结构实现；存储器负责组织和查找，不会自动更新事实，也不替你决定能不能引用。</>}>
    <ArticleSection id="vector-store-write" title="存什么才找得回来">
      <p>一条可用记录至少要能回答三件事：这个向量来自哪段原文、原文当前是什么版本、返回时是否允许当前用户看到。只保存一串浮点数，命中后就无法回到可读材料，也无法检查版本和权限。实际记录通常还要带租户、文档类型、语言和更新时间，方便后面的过滤与回查。</p>
      <p id="vector-store-definition" className="vp-citation-target">OpenAI Retrieval 将 vector store 描述为承载文件、分块、嵌入和索引的容器；检索结果仍然关联文件和属性。<Cite id="vector-store-definition" sources={vectorStoreSources} />向量是找回入口，原文 ID 才是能让用户读懂和核对的出口。</p>
      <ContextRetrievalLesson mode="vector-store" />
    </ArticleSection>

    <ArticleSection id="vector-store-filter-chapter" title="近邻检索还要过过滤器">
      <p id="vector-store-index" className="vp-citation-target">FAISS 等近似近邻索引通过缩小需要比较的范围来换取速度；近邻算法的索引结构和精度、内存、延迟之间存在取舍。<Cite id="vector-store-index" sources={vectorStoreSources} />“近似”意味着返回结果可能不是全量精确排序，因此应把延迟和召回损失放进同一组评估。</p>
      <p id="vector-store-filter" className="vp-citation-target">属性过滤会把语义相似度放进业务条件里，例如只看租户、版本或文档类型；过滤后的候选为空，不应静默改成全库搜索。<Cite id="vector-store-filter" sources={vectorStoreSources} />否则用户看到的不是“没有权限或没有当前版本”，而是一条越过边界的旧答案。</p>
      <p>过滤可以在近邻搜索前缩小范围，也可以在返回后再次校验。前者影响速度和召回，后者负责最后一道权限保险；页面把“20 条近邻变成 7 条”画出来，是为了让这个范围变化可见。</p>
    </ArticleSection>

    <ArticleSection id="vector-store-lifecycle-chapter" title="原文变了，索引也要更新">
      <p id="vector-store-ann" className="vp-citation-target">近似近邻检索的速度来自索引结构，而不是“数据库自动理解一切”。改变向量模型、维度或距离函数时，旧索引可能需要重建。<Cite id="vector-store-ann" sources={vectorStoreSources} />换了嵌入模型却继续混用旧向量，会让分数失去可比性。</p>
      <p id="vector-store-metadata" className="vp-citation-target">Qdrant 将 payload 与向量放在集合中，并支持对 payload 建索引；元数据并不代替原文和权限设计。<Cite id="vector-store-metadata" sources={vectorStoreSources} />更新文档时，应让新版本和旧版本的生效关系清楚可查，而不是只覆盖一列文本。</p>
      <p id="vector-store-lifecycle" className="vp-citation-target">向量数据库的生命周期包含写入、更新、删除和容量管理；Pinecone 的说明也强调向量和文档数据要按应用需要共同维护。<Cite id="vector-store-lifecycle" sources={vectorStoreSources} />删除原文却留下可召回的向量，会产生看似有证据、实际无法打开的幽灵记录。</p>
    </ArticleSection>

    <ArticleSection id="vector-store-boundary" title="它是索引容器，不是真相仓库">
      <p>向量存储知道哪几条记录在表示空间里相近，不知道哪条事实已经被业务批准，也不知道当前用户是否有权阅读。它可以返回“相似度 0.86、来源 doc-17”，但不能把 0.86 翻译成“答案正确”。</p>
      <p>应用层仍要检查来源是否存在、版本是否生效、权限是否匹配、引用是否覆盖问题。检索为空时也要保留这个结果，让上层进入补充资料或人工复核，而不是自动扩大范围来凑一个答案。</p>
      <p><strong>判断方法</strong>：把向量、原文、元数据和索引分别问一遍“坏了会发生什么”。向量坏了影响相似度，原文缺失影响可读性，元数据错误影响权限和版本，索引陈旧影响召回；四种故障的修复路径不同。</p>
    </ArticleSection>
  </Article>;
}
