import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { multimodalSources } from "@/lib/ai-stack-concept-sources/multimodal";
import { MultimodalLesson } from "../ai-stack-lessons/multimodal";

const sections: [string, string][] = [["multimodal-input", "先确认输入通道"], ["multimodal-fusion", "不同模态怎样合在一次请求里"], ["multimodal-missing", "缺少证据时要收窄回答"]];

export function MultimodalTermPage() {
  return <Article slug="multimodal" title="多模态" subtitle="Multimodal · 在同一任务里处理多种输入" sources={multimodalSources} sections={sections} hero={<Hero variant="layers" trigger="我问图片里的日期，为什么只发文字时它不该猜？" change="文字 + 图片 → 共同理解" proof="加入图片后能读票面；移除图片后明确缺少证据" />} intro={<>多模态描述的是输入或输出包含不止一种信息形式。文字问题和图片、音频一起进入模型时，模型可以把它们放到同一个任务里理解；本页用图片演示，少掉其中一份材料时，能回答的范围也跟着变。</>}>
    <ArticleSection id="multimodal-input" title="先确认输入通道"><p>“多模态”不是一句“模型很聪明”。你需要先数清这次请求实际带了什么：一张图片、几段文字，还是一段音频。文字里的“看一下这张票”不等于票面已经上传。</p><p id="multimodal-input-evidence" className="vp-citation-target">OpenAI 的视觉输入文档把图片作为请求的一部分，并说明图片可以用 URL、文件或数据传入；因此图片是否进入请求是一个可检查的输入条件。<Cite id="multimodal-input-evidence" sources={multimodalSources} /></p><p id="multimodal-vision" className="vp-citation-target">视觉模型可以对图片内容回答问题，但具体支持的格式、尺寸和细节取决于所用模型与接口。<Cite id="multimodal-vision" sources={multimodalSources} /></p><MultimodalLesson /></ArticleSection>
    <ArticleSection id="multimodal-fusion" title="不同模态怎样合在一次请求里"><p id="multimodal-alignment" className="vp-citation-target">CLIP 论文展示了把图像和文字映射到可比较的表示空间，让两种信息能用于匹配；这种对齐不等于每个模型都能完成任意视觉推理。<Cite id="multimodal-alignment" sources={multimodalSources} /></p><p id="multimodal-fusion-evidence" className="vp-citation-target">Flamingo 论文把视觉特征插入语言模型处理序列，说明多模态系统需要一层把视觉信息接到语言生成过程中的机制。<Cite id="multimodal-fusion-evidence" sources={multimodalSources} /></p><p>演示的核心变化只有一个：票面图片从“缺少”变成“已进入请求”。日期可以回到票面核对，而不是只凭文字问题猜测。</p></ArticleSection>
    <ArticleSection id="multimodal-missing" title="缺少证据时要收窄回答"><p id="multimodal-missing-evidence" className="vp-citation-target">Google 的视觉指南把图片和文本一起作为输入，并提醒开发者处理图片细节、分辨率与安全限制；如果图片没有传入，就不能把视觉结论当作已观察到的事实。<Cite id="multimodal-missing-evidence" sources={multimodalSources} /></p><p id="multimodal-risk" className="vp-citation-target">NIST 将生成式系统的错误、隐私和安全风险列为需要治理的对象；多模态输入会带来新的隐私与内容处理边界。<Cite id="multimodal-risk" sources={multimodalSources} /></p><p><strong>读者判断</strong>：回答“图片中有什么”前，先确认图片真的在请求里、模型支持这种图片，并保留原图或定位信息供复核。</p></ArticleSection>
  </Article>;
}
