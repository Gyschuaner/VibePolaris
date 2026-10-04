import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { transformerSources } from "@/lib/ai-stack-concept-sources/transformer";
import { TransformerHero } from "../ai-stack-lessons/transformer-hero";
import { TransformerLesson } from "../ai-stack-lessons/transformer";

const sections: [string, string][] = [
  ["transformer-story", "先看一排 token 怎样互相照见"],
  ["transformer-block-section", "一层里发生两次改写"],
  ["transformer-stack-section", "为什么要叠很多层"],
  ["transformer-boundary", "它能表示关系，不等于知道事实"],
];

export function TransformerTermPage() {
  return <Article slug="transformer" title="Transformer" subtitle="Transformer · 让一排 token 在层层计算里交换信息" sources={transformerSources} sections={sections} hero={<TransformerHero />} intro={<>读到“Transformer”时，先不要把它想成一台会自动理解世界的机器。它更像一摞反复工作的处理台：每一层先让各个位置交换相关信息，再让每个位置把收到的内容重新整理，下一层接着处理。</>}>
    <ArticleSection id="transformer-story" title="先看一排 token 怎样互相照见">
      <p>句子“<strong>小猫坐在窗边，它看见雨</strong>”摆到模型面前时，里面的词不会各自关在小格子里。模型先把 token 和位置信息编码，再让每个位置去询问同一排里的其他位置：我现在需要谁的线索？“它”可能需要回看“小猫”，“看见”则和“雨”一起构成一段动作与场景。</p>
      <p id="transformer-origin" className="vp-citation-target">Transformer 最初被提出为只依赖注意力机制的序列架构，去掉了循环和卷积；它的关键变化不是让模型跳过输入，而是让序列中的位置能够在同一轮计算里建立关系。<Cite id="transformer-origin" sources={transformerSources} /></p>
      <TransformerLesson />
      <p id="transformer-input" className="vp-citation-target">位置仍然重要。Transformer 的输入会把 token 表示和位置编码一起送入编码器或解码器；否则“猫追狗”和“狗追猫”会少掉一个决定关系的线索。演示里的位置编号是为了让读者看到顺序，真实模型使用的编码方式取决于具体架构。<Cite id="transformer-input" sources={transformerSources} /></p>
    </ArticleSection>
    <ArticleSection id="transformer-block-section" title="一层里发生两次改写">
      <p id="transformer-block" className="vp-citation-target">一个典型的 Transformer 编码器层可以拆成两个相邻的子层：多头自注意力先把别的位置的信息汇到当前位置，位置前馈网络再对每个位置各自做相同形状的非线性变换。两次变换外面还有残差连接和层归一化，让原表示保留一条能继续向前的路径。<Cite id="transformer-block" sources={transformerSources} /></p>
      <p id="transformer-attention" className="vp-citation-target">“注意力”这个词不是一个会读心的聚光灯。每个位置用自己的查询去和其他位置的键比较，再按权重取回值；多头意味着在不同的表示子空间里并行做这件事。页面里的两条绿色连线只展示一种关系示意，不能被当成模型唯一、可解释的因果证据。<Cite id="transformer-attention" sources={transformerSources} /></p>
      <p id="transformer-feedforward" className="vp-citation-target">前馈网络的“逐位置”是一个容易漏掉的细节：它对所有位置复用同一套多层感知器，但不会把位置顺序抹掉，也不会把所有 token 合并成一张标签。每个位置拿着更新后的向量继续前进，之后的层还可以再次交换信息。<Cite id="transformer-feedforward" sources={transformerSources} /></p>
    </ArticleSection>
    <ArticleSection id="transformer-stack-section" title="为什么要叠很多层">
      <p id="transformer-stack" className="vp-citation-target">一层只能做一次有限的混合。工程实现里的 TransformerEncoder 是 N 个编码器层的堆叠，输入会依次通过这些层；每一层都把上一层的表示当作下一轮关系计算的起点。可以把它想成同一张便签被连续交给几位编辑：第一位标出指代，第二位补上动作，后面再把线索组合得更细。<Cite id="transformer-stack" sources={transformerSources} /></p>
      <p id="transformer-ecosystem" className="vp-citation-target">今天说“用 Transformer”，还要追问是哪一种模型。Hugging Face 的文档把模型定义、预处理、推理和训练放在同一套生态里；同一个家族可以有不同的层数、头数、词表和任务头。架构名称告诉你计算骨架，不能单独告诉你模型会什么、能看多长或输出是否可靠。<Cite id="transformer-ecosystem" sources={transformerSources} /></p>
      <p id="transformer-blueprint" className="vp-citation-target">一个模型仓库通常把“蓝图”和“学到的参数”分开保存：配置记录隐藏层数量、词表大小、注意力头等架构信息，权重文件记录训练后的数值。换一份权重，甚至换一个预处理器，都可能改变实际行为；看到“Transformer”三个字不能跳过这些具体配置。<Cite id="transformer-blueprint" sources={transformerSources} /></p>
    </ArticleSection>
    <ArticleSection id="transformer-boundary" title="它能表示关系，不等于知道事实">
      <p id="transformer-decoder" className="vp-citation-target">如果是生成文本的 decoder，注意力还要带上因果遮罩：生成到当前位置时，只能看已经生成的部分，不能偷看未来 token。编码器、解码器和只取其中一边的模型都叫 Transformer 家族，但可见范围、训练目标和输出头并不一样。<Cite id="transformer-decoder" sources={transformerSources} /></p>
      <p>所以读模型输出时，至少分开三件事：它有没有把输入编码进表示，训练目标有没有让它学到当前任务的模式，答案里的外部事实有没有经过检索或其他独立证据核对。Transformer 负责把表示一层层变换得更有用；它不会因为层数更多，就自动变成事实数据库。</p>
      <p><strong>带走一个判断：</strong>看到“Transformer 很强”时，先问它用的是 encoder、decoder 还是两者，输入如何编码，层和头有多少，任务头怎样读出结果，以及失败时谁来核验。</p>
    </ArticleSection>
  </Article>;
}
