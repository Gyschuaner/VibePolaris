import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { retrievalSources } from "@/lib/ai-stack-concept-sources/retrieval";
import { RetrievalEvidenceHero } from "../ai-stack-lessons/signature-heroes";
import { RetrievalLesson } from "../ai-stack-lessons/retrieval";

export function RetrievalTermPage() {
  const sections: [string, string][] = [
    ["retrieval-candidate", "检索先返回候选"],
    ["retrieval-method", "词项、向量和组合"],
    ["retrieval-scope", "范围和 top-k 会改变你看见的材料"],
    ["retrieval-boundary", "候选不是答案"],
  ];
  return <Article slug="retrieval" title="检索" subtitle="Retrieval · 从资料集合中找出值得继续检查的候选" sources={retrievalSources} sections={sections} hero={<RetrievalEvidenceHero />} intro={<>检索根据查询从已有资料中返回候选内容。它可以使用关键词、向量或混合方法，通常还带回分数、文档 ID 和版本。检索解决的是“先把哪些材料摆到桌面上”，不负责生成回答，也不能保证候选完整、正确或有权使用。</>}>
    <ArticleSection id="retrieval-candidate" title="检索先返回候选">
      <p>“退款多久到账”进入 200 段政策材料后，系统先缩小到几条候选，再让应用读取、重排或交给生成模型。候选数量、过滤条件、相关性分数和来源位置都应该可见，否则读者无法判断回答依据了什么，也无法解释为什么一段材料没有出现。</p>
      <p id="retrieval-semantic" className="vp-citation-target">OpenAI Retrieval 说明 semantic search 可以在词面不完全相同的情况下找到相关结果，并由 vector store 承载分块、嵌入和索引。<Cite id="retrieval-semantic" sources={retrievalSources} />例如用户问“钱什么时候退回”，结果可以命中写着“退款将在五个工作日内到账”的段落；相似不是事实证明，仍要回看原文。</p>
      <RetrievalLesson />
    </ArticleSection>

    <ArticleSection id="retrieval-method" title="词项、向量和组合">
      <p id="retrieval-dense" className="vp-citation-target">Dense Passage Retrieval 用查询和段落的向量表示来召回候选；它适合语义相近但词面不同的情况，也受训练数据、领域术语和语言差异影响。<Cite id="retrieval-dense" sources={retrievalSources} />向量能把“退钱”和“退款”放得较近，却可能把共享“账户”一词的无关段落也带回来。</p>
      <p id="retrieval-bm25" className="vp-citation-target">关键词检索保留精确词项、编号、产品名和法规条款等信号，BM25 这类方法会根据词项在文档中的稀有程度和出现频率评分。<Cite id="retrieval-bm25" sources={retrievalSources} />混合检索把稀疏匹配和语义匹配结合，权重和过滤策略应通过真实问题集验证，而不是凭感觉挑一套。</p>
      <p>页面里的词项、语义和混合滑轨不是三个“答案引擎”，而是三种候选偏好。选择方法时先看查询的证据形态：专名和编号需要精确匹配，口语改写需要语义召回，两者同时存在时再考虑混合。</p>
    </ArticleSection>

    <ArticleSection id="retrieval-scope" title="范围和 top-k 会改变你看见的材料">
      <p id="retrieval-candidates" className="vp-citation-target">检索返回的 top-k 只说明当前策略选择了这些候选；漏掉的材料无法在后续重排序阶段恢复，低分也不自动等于错误。<Cite id="retrieval-candidates" sources={retrievalSources} />top-1 适合需要一个最可能入口的场景，top-10 更适合先收集证据再做筛选，两者都必须配合来源检查。</p>
      <p>过滤器会在排序之前改变可搜索范围。“只看 2026 版政策”可以排除旧规则，却也可能隐藏仍然有效的补充条款；“只看正式政策”能减少博客噪声，却可能错过解释迁移步骤的操作文档。范围是业务决定，不是一个无害的 UI 开关。</p>
      <p id="retrieval-topk" className="vp-citation-target">两阶段检索常先用快速召回缩小范围，再对 top-k 做更精细排序；这是一种工程组合，不是检索一词的唯一实现。<Cite id="retrieval-topk" sources={retrievalSources} />因此调优时要分别测“有没有召回”和“排在前面的是否值得读”，不要只看一个总分。</p>
    </ArticleSection>

    <ArticleSection id="retrieval-boundary" title="候选不是答案">
      <p id="retrieval-rag-boundary" className="vp-citation-target">RAG 将检索到的材料交给生成模型来合成回答；因此“找到了相关段落”和“回答被这些段落支持”是两个可分开检查的结果。<Cite id="retrieval-rag-boundary" sources={retrievalSources} />检索页停在原文卡片，是为了让读者看见这个边界，而不是把相似度分数伪装成结论。</p>
      <p>一个候选可能过期、缺少权限、只有标题没有正文，或者只回答了问题的一半。系统应保留这些失败状态：无来源卡被抽走后，正确的界面是显示证据缺口，而不是为了凑满 top-k 编造一张卡。</p>
      <p><strong>判断方法</strong>：分别问“目标段落有没有回来”“它是否属于正确版本”“最终句子是否能逐句指回它”。第一问失败查召回和分块，第二问查过滤和元数据，第三问查重排、上下文和生成约束。</p>
    </ArticleSection>
  </Article>;
}
