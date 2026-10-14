import { ArticleSection, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { rerankingSources as sources } from "@/lib/ai-stack-concept-sources/reranking";
import { RerankingHero, RerankingRackLab } from "../ai-stack-lessons/reranking-rack";

export function RerankingTermPage() {
  return <Article slug="reranking" title="重排序" subtitle="Reranking · 找到一批资料后，再看谁更能回答问题" sources={sources} hero={<RerankingHero />} sections={[
    ["rerank-start", "排在第一的，怎么答非所问？"],
    ["rerank-pairs", "把问题与每段正文放在一起看"],
    ["rerank-missing", "桌上没有的资料，换位置也变不出来"],
    ["rerank-output", "只取前两段，不等于只检查两段"],
    ["rerank-boundary", "分数更高，还要看什么"],
  ]} intro={<>你问“退款多久到银行卡”，搜出的第一条却只教你关掉自动续费。它提到了“取消会员”，但没有回答到账时间。<strong>重排序会重新比较已经找来的候选，让更符合问题的材料靠前。</strong></>}>
    <ArticleSection id="rerank-start" title="排在第一的，怎么答非所问？">
      <p>搜索面对成千上万段资料，先要把可能相关的一批找出来，这叫召回。关键词匹配和向量相似度都能做这件事；它们找到的候选可能谈论同一话题，却没有回答你真正问的那一部分。</p>
      <p id="rerank-definition" className="vp-citation-target"><strong>重排序（reranking）接收一个问题和已有候选，再按新的相关性判断调整候选的次序。</strong>它不要求先使用嵌入检索，关键词检索得到的材料也可以送来重排。常见安排是先快速召回，再对较小的候选集合做更细的比较。<Cite id="rerank-definition" sources={sources} /></p>
      <p>下面的 A 教你取消会员，C 讲余额退回，B 才说银行卡到账时间。先看召回顺序，再点击“按问题重排”：资料没有改写，B 从后面挪到了前面。每张纸上的字母保持不变，方便你追踪同一份材料。</p>
      <RerankingRackLab />
    </ArticleSection>
    <ArticleSection id="rerank-pairs" title="把问题与每段正文放在一起看">
      <p>这个问题里的“银行卡”和“多久”很关键。A 的取消操作、C 的站内余额，都不能直接回答它。只看共同话题容易把它们排得很靠前；读到正文里的具体条件，才能发现 B 更合适。</p>
      <p id="rerank-crossencoder" className="vp-citation-target">一种常见实现叫<strong>交叉编码器</strong>（cross-encoder）：将“问题 + 一段候选正文”共同交给模型，得到这对输入的相关性分数。它能在同一次比较中处理两边的内容，而不是只比较提前各自算好的句子向量。重排序也可以采用其他模型或规则，交叉编码器不是唯一实现。<Cite id="rerank-crossencoder" sources={sources} /></p>
      <p id="rerank-budget" className="vp-citation-target">更细的比较通常也更费计算。若全库有百万段资料，每次都逐对评估问题与全文，成本和等待会很大；先召回一批，再只对这批重排，能把更昂贵的判断集中在较小范围。候选越多可能覆盖得更好，也可能增加延迟，需要用真实问题验证取舍。<Cite id="rerank-budget" sources={sources} /></p>
    </ArticleSection>
    <ArticleSection id="rerank-missing" title="桌上没有的资料，换位置也变不出来">
      <p>打开“初次检索漏掉 B”，再重排一次。A、C 仍会有顺序，但唯一明确写出到账时间的 B 不在桌上。重排器再认真，也没法只靠调整 A、C 的位置把 B 找回来。</p>
      <p id="rerank-limit" className="vp-citation-target">这就是候选范围的限制：重排只给传进来的资料评分。BERT 重排研究先从召回结果中评估各段正文，也记录了相关材料可能在初次召回时被漏掉。改善漏召回问题，需要先调整检索策略或候选范围，不能只换一个重排模型。<Cite id="rerank-limit" sources={sources} /></p>
      <p>D 也始终留在候选框外，没有重排分。它是资料库里另一段说明，但本例没有把它召回；“库里有”和“本次交给重排器”不能混为一谈。</p>
    </ArticleSection>
    <ArticleSection id="rerank-output" title="只取前两段，不等于只检查两段">
      <p id="rerank-topn" className="vp-citation-target">重排后的列表可以只返回前几段。这个数量限制的是输出，不一定限制评分范围：例如 Google Cloud 的 Ranking API 即使设置返回前 N 条，也会对传入的全部候选排名。实验里的“最多取”同样是在排列之后划一道取用边界。<Cite id="rerank-topn" sources={sources} /></p>
      <p>把数量从两段改成一段，靠后的资料变淡，返回字母随之减少。原文还在候选中，只是没有进入这次输出。如果准备把资料交给回答模型，取多少还要考虑重复内容、信息是否完整，以及能放进多少上下文。</p>
      <p>再试“模拟重排失败”。本例选择保留召回顺序，并明确标出重排没有成功。真实应用可以采用这样的降级方式，也可以暂停回答或重试；不能把一次失败标成“已优化”，让读者误以为顺序已经核对过。</p>
    </ArticleSection>
    <ArticleSection id="rerank-boundary" title="分数更高，还要看什么">
      <p id="rerank-scores" className="vp-citation-target">重排分表达模型对相关性的判断。不同服务和模型的分数含义、尺度可能不同；实验中的数字只是教学示例，不能当成“答案有多大概率正确”，也不要把召回分与重排分直接相减来计算质量提升。<Cite id="rerank-scores" sources={sources} /></p>
      <p id="rerank-truncation" className="vp-citation-target">模型一次能读的文本也有长度边界。例如 BERT 重排研究会截短问题和正文；如果决定性的限制条件没有进入这次输入，再细的比较也看不见它。应用需要确认实际送入了哪些文本，而不只检查文档标题是否正确。<Cite id="rerank-truncation" sources={sources} /></p>
      <p>B 排到第一，也还要核对原文版本、适用条件和使用权限。相关性排名不会自动保证材料是真的；后续用 <ConceptTerm slug="rag">RAG</ConceptTerm> 辅助回答时，仍应按原文说清依据和限制。</p>
      <p>给 AI 的任务可以写成：“保留召回候选的 ID 和原文；重排后显示新顺序；同时记录漏召回和服务失败。用直接回答、只谈同一话题、缺失关键材料三种情况核对结果。”这样你能看到资料是否被更合理地使用，而不是只看到一个新的分数。</p>
    </ArticleSection>
  </Article>;
}
