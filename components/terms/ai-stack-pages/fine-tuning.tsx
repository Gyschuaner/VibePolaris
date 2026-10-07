import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { FineTuningCurveHero } from "../ai-stack-lessons/ai-interaction-heroes";
import { fineTuningSources } from "@/lib/ai-stack-concept-sources/fine-tuning";
import { FineTuningLesson } from "../ai-stack-lessons/fine-tuning";

export function FineTuningTermPage() {
  const sections: [string, string][] = [["tuning-question", "参数在训练阶段改变"], ["tuning-eval", "验证集要独立"], ["tuning-boundary", "微调不等于实时知识"]];
  return <Article slug="fine-tuning" title="微调" subtitle="Fine-Tuning · 用样本让特定任务更稳定" sources={fineTuningSources} sections={sections} hero={<FineTuningCurveHero />} intro={<>微调在训练阶段更新已有模型的参数，让特定格式、语气或任务行为更稳定。判断它是否有用，要看没有参与参数更新的验证数据，而不是只看训练集越来越熟。</>}>
    <ArticleSection id="tuning-question" title="参数在训练阶段改变"><p>工单分类可以准备训练样本、验证样本和测试样本。训练阶段用前者更新参数；验证阶段用另一份数据比较配置；测试集最后再用来估计迁移效果。微调不是把一条新事实写进模型的记事本。</p><p id="tuning-cycle" className="vp-citation-target">OpenAI 的模型优化流程把数据准备、训练、评估和迭代连成闭环；优化目标要由独立评估结果决定。<Cite id="tuning-cycle" sources={fineTuningSources} /></p><FineTuningLesson /></ArticleSection>
    <ArticleSection id="tuning-eval" title="验证集要独立"><p id="tuning-data" className="vp-citation-target">监督微调文档要求准备符合目标格式的训练数据，并检查重复、质量和数据划分；验证数据不能被当成训练样本反复记住。训练损失表示模型在训练样本上的错误程度，验证准确率表示它在未参与训练的数据上答对多少，两者要一起看。<Cite id="tuning-data" sources={fineTuningSources} /><Cite id="tuning-eval" sources={fineTuningSources} /></p><p id="tuning-validation" className="vp-citation-target">当训练损失下降、验证准确率先升后降时，后者提示泛化变差；此时应停止或调整，而不是用训练数字宣布成功。<Cite id="tuning-validation" sources={fineTuningSources} /></p></ArticleSection>
    <ArticleSection id="tuning-boundary" title="微调不等于实时知识"><p id="tuning-training" className="vp-citation-target">Hugging Face 的训练流程把数据、优化器、批次和评估作为训练系统的组成部分；参数更新仍发生在离线训练阶段。<Cite id="tuning-training" sources={fineTuningSources} /></p><p id="tuning-parameters" className="vp-citation-target">PEFT 和 LoRA 等方法可以只更新或注入较少的参数，降低训练成本，但不改变“需要验证泛化”的判断。<Cite id="tuning-parameters" sources={fineTuningSources} /></p><p id="tuning-lora" className="vp-citation-target">LoRA 论文展示了低秩适配的参数高效路径；它是具体训练方法，不是微调一词的唯一实现。<Cite id="tuning-lora" sources={fineTuningSources} /></p><p><strong>选择方法</strong>：任务说明变化先试提示词；需要外部最新资料先考虑检索；只有稳定的任务行为、格式或语气值得用高质量样本训练时，再评估微调。</p></ArticleSection>
  </Article>;
}
