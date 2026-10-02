import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { moderationSources } from "@/lib/ai-stack-concept-sources/moderation";
import { ModerationLesson } from "../ai-stack-lessons/moderation";

export function ModerationTermPage() {
  const sections: [string, string][] = [["moderation-question", "审核先产生分类信号"], ["moderation-policy", "产品阈值决定处置"], ["moderation-boundary", "分数不是法律结论"]];
  return <Article slug="moderation" title="内容审核" subtitle="Moderation · 按风险类别决定内容去向" sources={moderationSources} sections={sections} hero={<Hero trigger="三条评论的风险分不同，系统怎样决定它们去哪？" change="内容 → 风险类别 → 阈值分流 → 展示/复核/隐藏" proof="拖动阈值后，复核和隐藏队列随规则变化" />} intro={<>内容审核把文本或图像分类为风险信号，应用再依据产品阈值决定展示、人工复核或隐藏。审核模型提供的是分类结果，不是法律裁决，也不是所有安全措施的总称。</>}>
    <ArticleSection id="moderation-question" title="审核先产生分类信号"><p>三条评论得到 0.03、0.61 和 0.94 的教学分数。读者先看到“模型给了什么信号”，再看到产品怎样使用它；分数不是评论已经违法或一定有害的证明。</p><p id="moderation-score" className="vp-citation-target">OpenAI 的 Moderation API 返回类别和概率式信号，应用仍需结合自己的产品场景决定后续动作。<Cite id="moderation-score" sources={moderationSources} /></p><ModerationLesson /></ArticleSection>
    <ArticleSection id="moderation-policy" title="产品阈值决定处置"><p id="moderation-label" className="vp-citation-target">分类标签、置信度和产品阈值是不同东西：模型输出标签，应用决定哪些标签进入复核、哪些直接隐藏。<Cite id="moderation-label" sources={moderationSources} /></p><p id="moderation-stage" className="vp-citation-target">审核可以作为护栏前后的一道检查，但它不会自动完成权限校验、事实核对或人工申诉。<Cite id="moderation-stage" sources={moderationSources} /></p></ArticleSection>
    <ArticleSection id="moderation-boundary" title="分数不是法律结论"><p id="moderation-risk" className="vp-citation-target">NIST 风险资料要求把模型信号放在具体使用场景和影响评估中解释，不能把一个阈值写成所有产品都适用的规则。<Cite id="moderation-risk" sources={moderationSources} /></p><p id="moderation-govern" className="vp-citation-target">审核处置还需要误报、漏报、申诉、人工容量和监控等治理环节；这些不是模型分数本身。<Cite id="moderation-govern" sources={moderationSources} /></p><p id="moderation-safety" className="vp-citation-target">安全建议把输入验证、输出限制和持续监测分开考虑；内容审核只回答“内容属于哪类风险信号”。<Cite id="moderation-safety" sources={moderationSources} /></p></ArticleSection>
  </Article>;
}
