import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { pretrainingSources } from "@/lib/ai-stack-concept-sources/pretraining";
import { PretrainingHero } from "../ai-stack-lessons/pretraining-hero";
import { PretrainingLesson } from "../ai-stack-lessons/pretraining-hero";

const sections: [string, string][] = [
  ["pretraining-practice", "先给模型一沓练习题"],
  ["pretraining-loss-section", "猜错一次，损失把差距量出来"],
  ["pretraining-objective-section", "目标不同，学到的路径不同"],
  ["pretraining-boundary", "语料把边界一起带进来"],
];

export function PretrainingTermPage() {
  return <Article slug="pretraining" title="预训练" subtitle="Pretraining · 用大量数据反复练习并更新模型参数" sources={pretrainingSources} sections={sections} hero={<PretrainingHero />} intro={<>预训练不是把整本互联网塞进模型的“背诵按钮”。它更像一间很大的校对室：文本先被切成一格一格的 token，数据从自身构造出要猜的目标，模型交卷，损失把猜测和目标的差距量出来，参数再沿着这个信号挪一小步。真正要小心的是，模型学到的是训练目标和语料里的规律，不是自动盖章过的事实。</>}>
    <ArticleSection id="pretraining-practice" title="先给模型一沓练习题">
      <p>想象一张没有标准答案册的练习卡：“退款需在七日内申请”。系统可以把它切成 token，让前面的片段去猜下一个 token；“七日内”就同时是输入序列里的下一格，也是这道题的目标。这样，海量文本不需要人工给每一行另写标签，文本本身就能提供练习目标。</p>
      <p id="pretraining-causal" className="vp-citation-target">Hugging Face 将这种训练目标称为 causal language modeling：模型只看目标左边已经出现的 token，预测下一个 token；训练时把输入复制成 labels，再由数据整理器完成错位。所谓“自监督”不是没有目标，而是目标从原始文本的结构里构造出来。<Cite id="pretraining-causal" sources={pretrainingSources} /></p>
      <PretrainingLesson />
      <p>这也解释了为什么“让模型读很多文本”仍然是一件具体的工程工作：文本要切块、转成 token id、组成 batch，目标位置和可见范围要和训练目标一致。一张卡的先后顺序或遮罩位置错了，模型练的就不是你以为的那道题。</p>
    </ArticleSection>
    <ArticleSection id="pretraining-loss-section" title="猜错一次，损失把差距量出来">
      <p id="pretraining-loss" className="vp-citation-target">模型交出的不是一个只写着“对 / 错”的答案，而是一组 logits 或概率分布。PyTorch 的 <code>CrossEntropyLoss</code> 接收未归一化的 logits 和目标类别，计算这次预测与目标之间的交叉熵；目标越不符合模型当前的分布，损失通常越大。<Cite id="pretraining-loss" sources={pretrainingSources} /></p>
      <p id="pretraining-gradient" className="vp-citation-target">损失还要能沿计算图传回去，才会成为更新参数的信号。训练循环会根据梯度和优化器规则调整权重，然后拿下一批样本再测一遍。一次 loss 下降只能说明当前目标上的误差变小了，它没有把“七日内”变成现实世界的法律结论。<Cite id="pretraining-gradient" sources={pretrainingSources} /></p>
      <p>所以动画里那只参数刻度只移动一小格：它不是把一条事实写进数据库，而是让下一次相似预测有机会改变。真正的预训练要重复许多 batch，并用独立数据观察模型是否学到了能迁移的模式。</p>
    </ArticleSection>
    <ArticleSection id="pretraining-objective-section" title="目标不同，学到的路径不同">
      <p id="pretraining-masked" className="vp-citation-target">并不是所有预训练都只猜下一个 token。BERT 的 masked language model 会随机遮住输入中的一部分，让模型利用左右两侧的上下文预测被遮住的原词；论文还把 next sentence prediction 作为另一项预训练任务。它与自回归的左到右目标不同，能训练出不同的可见范围和表示。<Cite id="pretraining-masked" sources={pretrainingSources} /></p>
      <p id="pretraining-bert" className="vp-citation-target">这类目标选择会影响模型在之后任务里的起点。BERT README 说明，预训练先在大语料上获得通用的上下文表示，之后才把模型用于下游任务；预训练和微调是两个阶段，不能把“预训练过”理解成“已经针对你的业务验证过”。<Cite id="pretraining-bert" sources={pretrainingSources} /></p>
      <p>同一段话换一种目标，练习卡上的“可见部分”和“要交的答案”就换了。阅读一个模型时，除了问“它有多少参数”，还要问它预训练时究竟在猜什么、哪些位置被允许看见、最后又由哪个任务头读取表示。</p>
    </ArticleSection>
    <ArticleSection id="pretraining-boundary" title="语料把边界一起带进来">
      <p id="pretraining-corpus" className="vp-citation-target">预训练语料不是透明的“世界本身”。Google 的 BERT 说明把 Wikipedia 和 BookCorpus 作为训练来源，并把预训练描述为一次昂贵、随后可以复用的阶段；来源范围、清洗方式、重复内容和时间点都会影响模型更容易学到什么。<Cite id="pretraining-corpus" sources={pretrainingSources} /></p>
      <p id="pretraining-cost" className="vp-citation-target">预训练通常要付出很大的计算成本，之后下游使用会便宜得多，但成本差异不等于质量保证。训练步数、批大小、词表、硬件和优化器共同决定一次训练怎样走；页面上的“一次更新”只是这条长链中的一个可观察切片。<Cite id="pretraining-cost" sources={pretrainingSources} /></p>
      <p id="pretraining-data" className="vp-citation-target">OpenAI 对 GPT-3 的介绍也把边界写在结果旁边：模型先在大规模语料上预训练，使用时可以通过 few-shot 示例完成任务，但大型网络语料带来的方法和数据问题仍然存在。模型能顺着语料中的旧规则给出流畅答案，不代表它知道规则今天是否仍有效。<Cite id="pretraining-data" sources={pretrainingSources} /></p>
      <p id="pretraining-finetune" className="vp-citation-target">因此要把三件事分开：预训练让参数获得广泛的语言和模式起点，微调或指令训练改变特定任务上的行为，推理只是用当前参数处理一次输入。上线前仍要用独立评估、检索或业务规则核验关键事实，不能把较低的训练损失直接当作可靠性证明。<Cite id="pretraining-finetune" sources={pretrainingSources} /></p>
      <p><strong>带走一个问题：</strong>当你听到“这个模型在海量数据上训练过”，先追问它的目标是什么、数据从哪里来、参数是否真的经过更新，以及你现在要的事实有没有独立证据。预训练给模型一个起点，不替产品完成验收。</p>
    </ArticleSection>
  </Article>;
}
