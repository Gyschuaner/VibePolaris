import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { embeddingSources as sources } from "@/lib/ai-stack-concept-sources/embedding";
import { EmbeddingGeometryLab } from "../ai-stack-lessons/embedding-geometry";

export function EmbeddingTermPage() {
  return <Article slug="embedding" title="嵌入" subtitle="Embedding · 给内容一个可比较的数值位置" sources={sources} sections={[
    ["embedding-map", "搜“忘记密码”，为什么能找到“重置登录”？"],
    ["embedding-vector", "一串数字，怎么成为一个位置"],
    ["embedding-comparison", "换个问题，相近的材料跟着换"],
    ["embedding-training", "谁决定哪些句子靠得近"],
    ["embedding-limit", "最相近的那条，也可能已经过期"],
  ]} intro={<>你搜“忘记密码”，资料里写的是“重置登录凭据”。没有完全相同的关键词，搜索仍可能找到它。<strong>嵌入把内容变成向量，让系统能比较它们在模型表示中有多相近。</strong></>}>
    <ArticleSection id="embedding-map" title="搜“忘记密码”，为什么能找到“重置登录”？">
      <p>按关键词搜索，往往先看问题和资料有没有相同的字词。但读者问“进不去账号了”，文档可能写“账号恢复”；只按字面匹配，相关材料容易漏掉。</p>
      <p id="embedding-definition" className="vp-citation-target"><strong>嵌入（embedding）是模型把输入映射成数值向量的表示方法。</strong>用于句子相似度的嵌入模型，会让它认为语义相近的输入在表示空间中更接近。查询和资料都获得可以比较的表示，应用便能据此寻找候选。<Cite id="embedding-definition" sources={sources} /></p>
      <p>这和“让模型回答怎么找回密码”是两件事。嵌入得到的是一串数字；你看到的资料标题、原文和最终答案，要由搜索系统或其他应用步骤提供。</p>
    </ArticleSection>
    <ArticleSection id="embedding-vector" title="一串数字，怎么成为一个位置">
      <p>把向量先想成一份按顺序排列的数字列表，例如 <code>[0.64, 0.77]</code>。在二维图中，第一个数给出横向位置，第二个数给出纵向位置。每条文档有自己的位置，查询也有一个位置，于是它们之间的关系能被计算。</p>
      <p id="embedding-representation" className="vp-citation-target">真实句子嵌入通常有更多维度。模型处理输入后得到固定长度的表示，这些维度不必各自对应一个人能命名的主题。Sentence-BERT 的做法就是从模型输出中汇集出句子向量，再用训练调整句子之间的关系。<Cite id="embedding-representation" sources={sources} /></p>
      <p>下方只用二维教学向量，方便你看见位置。没有在浏览器里调用模型。</p>
    </ArticleSection>
    <ArticleSection id="embedding-comparison" title="换个问题，相近的材料跟着换">
      <p>先选“忘记密码”，再换成“修改头像”。文档点没有动，代表新问题的查询点换了位置。右侧排名跟着变化：比较的是新查询与每一条文档的关系。</p>
      <EmbeddingGeometryLab />
      <p id="embedding-distance" className="vp-citation-target">这个实验把向量长度都设为 1，按<strong>余弦相似度</strong>排序：方向越接近，分数越接近 1。图里从原点伸出的两条线帮你看方向差；单位圆上相近的方向，点也靠得更近。余弦相似度一般比较的是方向，不能直接把任意向量之间的直线距离当成它。<Cite id="embedding-distance" sources={sources} /></p>
      <p id="embedding-metric" className="vp-citation-target">应用还可以选点积、欧氏距离等指标，它们对向量长度和方向的处理不同。使用哪一种，要与模型及任务相配。这里的 <code>0.99</code> 只是两条教学向量的相似度，不能读成“答案有 99% 的概率正确”。<Cite id="embedding-metric" sources={sources} /></p>
      <p id="embedding-search" className="vp-citation-target">实际检索可以提前编码资料，把查询编码到兼容的表示空间后，再找最相近的若干项。有些模型对短查询与长文档使用不同提示或编码入口，但两边必须按该模型的约定配套使用，只让数字列表长度相同。<Cite id="embedding-search" sources={sources} /></p>
    </ArticleSection>
    <ArticleSection id="embedding-training" title="谁决定哪些句子靠得近">
      <p id="embedding-model" className="vp-citation-target">模型从训练目标和样本中学到表示；训练数据、语言覆盖和任务类型，会影响它把哪些输入放近。Sentence-BERT 的研究也专门比较了句子表示的训练方式，并指出简单汇集未经相应训练的模型输出，不一定能得到好用的相似度表示。<Cite id="embedding-model" sources={sources} /></p>
      <p>更换嵌入模型后，需要重新检查向量与检索配置。旧文档向量和新查询向量不能因为“看起来都是一串数字”就混用；检索结果和阈值也要重新核对。</p>
      <ArticleAside title="把向量降成二维，能直接信图上的远近吗？"><p>降维图是另一种表示，会丢掉一些原空间信息。图上两个点挤在一起，不一定保留真实向量的原始相似度。展示真实数据时，应以原向量上的检索分数为准，并说明二维投影的方法。本页采用已知的二维单位向量，图与显示分数使用同一组数。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="embedding-limit" title="最相近的那条，也可能已经过期">
      <p>实验默认查询“忘记密码”时，D 的分数最高。点开原文却会发现：它是 2020 年的旧说明，里面的客服号已经停用。“讲的事情很像”没有替你检查“现在还能不能照着做”。</p>
      <p>版本、权限、来源可信度和文档里的限制条件，都需要另外核对。两段材料甚至可以讨论同一件事，却给出相反说法；表示相近不负责裁决谁是真的。</p>
      <p>在这条语义检索示例中，<ConceptTerm slug="reranking">重排序</ConceptTerm> 可以继续处理已召回的候选，<ConceptTerm slug="rag">RAG</ConceptTerm> 再使用取回的原文辅助回答。它们也可以接收关键词检索结果。无论采用哪种方式，都不能只凭一个相似度分数宣布任务完成。</p>
      <p>给 AI 的任务可以写成：“为查询和文档使用配套的嵌入方式；返回原文、文档版本和相似度；旧版或无权限的材料按规则排除。用同义改写、否定表达和旧文档各试一遍。”这样同时核对向量生成与可用材料的检索效果。</p>
    </ArticleSection>
  </Article>;
}
