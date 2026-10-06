import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { attentionSources } from "@/lib/ai-stack-concept-sources/attention";
import { AttentionSignatureHero } from "../AiStackSignatureHeroes";
import { AttentionLesson } from "../ai-stack-lessons/attention";

const sections: [string, string][] = [
  ["attention-question", "先把查询、键和值摆上桌"],
  ["attention-score-section", "分数不是答案"],
  ["attention-heads-section", "为什么要多头"],
  ["attention-boundary", "遮罩、缺证据与误读"],
];

export function AttentionTermPage() {
  return <Article slug="attention" title="注意力机制" subtitle="Attention · 按查询从键值里取回一份加权表示" sources={attentionSources} sections={sections} hero={<AttentionSignatureHero />} intro={<>注意力不是模型里一盏会自己解释原因的聚光灯。它是一种取数动作：当前位置带着查询，和一组 key 比较，再按得到的权重把 value 混合回来。读懂它，要盯住三件事：谁在问、拿什么匹配、最后取回什么。</>}>
    <ArticleSection id="attention-question" title="先把查询、键和值摆上桌">
      <p>想象你在点单：问题是“我想找无糖饮品”。菜单上每一行都有可匹配的标签和实际内容。注意力把这三件事分开：<strong>Query</strong> 是当前要找什么，<strong>Key</strong> 是拿来比较的线索，<strong>Value</strong> 是匹配后真正带回去的内容。</p>
      <p id="attention-qkv" className="vp-citation-target">在注意力的抽象里，查询和 key 先经过兼容性函数得到权重，再对 value 做加权求和；同一条查询换一组 key-value，得到的结果也会变化。这个结构像一次可微的检索动作，但它不是把数据库原文直接复制到答案里。<Cite id="attention-qkv" sources={attentionSources} /></p>
      <AttentionLesson />
    </ArticleSection>
    <ArticleSection id="attention-score-section" title="分数不是答案">
      <p id="attention-weights" className="vp-citation-target">权重通常经过 softmax 归一化，非负且总和为 1；它们告诉计算应该把多少 value 混进当前位置。权重高可以帮助观察“这一次取数偏向哪里”，但它只是这一步的数值结果，不能直接等同于模型的完整理由。<Cite id="attention-weights" sources={attentionSources} /></p>
      <p id="attention-original" className="vp-citation-target">原始 Transformer 论文使用缩放点积注意力：查询和 key 的点积先除以维度相关的缩放项，再做 softmax。缩放的作用是让数值范围更适合训练，不是给每个词赋一个人类能读懂的“重要性分数”。<Cite id="attention-original" sources={attentionSources} /></p>
      <p id="attention-scale" className="vp-citation-target">页面里的“高 / 中 / 低”是为了让取数过程看得见。真实实现还会受投影矩阵、mask、输入长度、精度和训练状态影响；把一张热力图截图单独拿出来，无法证明模型只因为那一格才作出结论。<Cite id="attention-scale" sources={attentionSources} /></p>
    </ArticleSection>
    <ArticleSection id="attention-heads-section" title="为什么要多头">
      <p id="attention-multihead" className="vp-citation-target">多头注意力先用不同的可学习投影把 Q、K、V 送进多个子空间，各个 head 并行计算，最后把多个输出拼起来再做一次线性变换。不同 head 可能捕捉不同范围或关系；“口味头”和“价格头”是便于理解的任务场景，不是给每个模型 head 贴上的固定人类标签。<Cite id="attention-multihead" sources={attentionSources} /></p>
      <p id="attention-concat" className="vp-citation-target">D2L 的实现把每个 head 的输出 concat 后交给输出投影；这一步很重要，因为最终交出去的是合并后的表示，而不是一排互不相干的小结论。多头增加的是并行的表示子空间，并不保证信息量无限增加。<Cite id="attention-concat" sources={attentionSources} /></p>
      <p id="attention-pytorch" className="vp-citation-target">PyTorch 的 <code>MultiheadAttention</code> 是原始架构的参考实现，接口明确接收 query、key、value，并支持 padding mask、attention mask 和因果模式。工程里看到“注意力层”时，要继续确认这些输入是否相同，以及 mask 到底让哪些位置可见。<Cite id="attention-pytorch" sources={attentionSources} /></p>
    </ArticleSection>
    <ArticleSection id="attention-boundary" title="遮罩、缺证据与误读">
      <p id="attention-mask" className="vp-citation-target">mask 会改变可参与比较的 key-value 范围：padding 可以被排除，生成式 decoder 还会遮掉未来位置。遮住“无糖”那一行后，系统仍能算出一组权重，但它只能在剩下的卡片里混合，不能把缺失的值凭空找回来。<Cite id="attention-mask" sources={attentionSources} /></p>
      <p id="attention-self" className="vp-citation-target">当 query、key、value 来自同一序列时，TensorFlow 把它称为 self-attention；如果来自不同序列，就是另一种交叉使用方式。名字相近，信息流却不同，不能只看“attention”这个词判断系统正在做什么。<Cite id="attention-self" sources={attentionSources} /></p>
      <p id="attention-output" className="vp-citation-target">注意力输出通常是固定宽度的向量，后面还要交给 Transformer 的其他层或任务头读取。它可以帮模型组织已有表示，却不负责查证菜单是否今天仍有效，也不负责替应用决定用户是否有权限看到价格。<Cite id="attention-output" sources={attentionSources} /></p>
      <p><strong>带走一个检查顺序：</strong>先找 Query、Key、Value 分别是什么，再看权重是否被 mask 改过，最后确认输出去了哪一层。看见一条亮线时，最多说明一次取数偏向；要下事实结论，还需要输入证据和独立校验。</p>
    </ArticleSection>
  </Article>;
}
