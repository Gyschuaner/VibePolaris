import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { temperatureSources } from "@/lib/ai-stack-concept-sources/temperature";
import { TemperatureLesson } from "../ai-stack-lessons/temperature";

const sections: [string, string][] = [["temperature-sampling", "温度改变的是哪一步"], ["temperature-decode", "为什么输出会更分散"], ["temperature-boundary", "高温不是准确度开关"]];

export function TemperatureTermPage() {
  return <Article slug="temperature" title="温度" subtitle="Temperature · 调整生成时的候选分布" sources={temperatureSources} sections={sections} hero={<Hero variant="field" trigger="同一句提示，为什么调一个数字就更容易换词？" change="候选概率 → 温度拉伸 → 采样结果" proof="滑块改变集中度；事实可靠性没有随温度自动变好" />} intro={<>温度是生成阶段的一个采样设置。它通常把候选 token 的相对概率拉得更集中或更平，让模型更偏向高概率候选，或给低概率候选更多机会。它不是创造力、准确度或事实核验的单一刻度。</>}>
    <ArticleSection id="temperature-sampling" title="温度改变的是哪一步"><p>模型先产生下一步候选小片段（token）及其相对概率，温度在采样阶段介入。它不会重写提示，也不会更新模型参数；同一个输入可以因为采样设置不同而走出不同文本路径。</p><p id="temperature-api" className="vp-citation-target">OpenAI 的生成接口把 temperature 作为生成参数，并说明它影响输出的随机性；具体可用范围和兼容性由模型接口决定。<Cite id="temperature-api" sources={temperatureSources} /></p><p id="temperature-sampling-evidence" className="vp-citation-target">生成策略文档把 temperature 与采样、top-k 或 top-p 等解码设置放在一起讨论；它们作用于候选选择，不是事实检索。<Cite id="temperature-sampling-evidence" sources={temperatureSources} /></p><TemperatureLesson /></ArticleSection>
    <ArticleSection id="temperature-decode" title="为什么输出会更分散"><p id="temperature-decode-evidence" className="vp-citation-target">解码研究把神经文本生成看作从概率分布选择后续 token 的过程；温度拉伸分布后，高概率和低概率候选的差距会改变。<Cite id="temperature-decode-evidence" sources={temperatureSources} /></p><p>演示里的数字只是帮助读者观察趋势：低温时“简洁”更占优势，高温时“清楚”和“灵动”获得更多机会。真实模型的范围、默认值和效果应以接口文档为准。</p><p>如果你需要结果稳定，除了温度还要固定随机种子（若接口支持）、模型版本和输入。只调温度不能解释所有差异。</p></ArticleSection>
    <ArticleSection id="temperature-boundary" title="高温不是准确度开关"><p id="temperature-boundary-evidence" className="vp-citation-target">OpenAI 和 Hugging Face 的文档都把 temperature 作为生成或解码设置，而不是事实验证设置；采样参数不能替你检查来源。<Cite id="temperature-boundary-evidence" sources={temperatureSources} /></p><p>低温可能让一个错误答案更稳定，高温可能让措辞更丰富，也可能让错误更明显。日期、价格、政策这类内容仍需要检索、工具或人工复核。</p><p><strong>读者判断</strong>：问“这次变化来自候选选择，还是来自输入材料变了？”如果材料没变，只能说明采样路径改变，不能把新措辞当成新证据。</p></ArticleSection>
  </Article>;
}
