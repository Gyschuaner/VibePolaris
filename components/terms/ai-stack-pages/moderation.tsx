import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ModerationConveyorHero } from "../ai-stack-lessons/ai-interaction-heroes";
import { moderationSources } from "@/lib/ai-stack-concept-sources/moderation";
import { ModerationLesson } from "../ai-stack-lessons/moderation";

export function ModerationTermPage() {
  const sections: [string, string][] = [
    ["moderation-question", "先把内容变成风险信号"],
    ["moderation-policy", "阈值是产品决定，不是模型真理"],
    ["moderation-review", "误报和漏报要能回到人"],
    ["moderation-boundary", "审核只覆盖它声明的范围"],
  ];

  return <Article slug="moderation" title="内容审核" subtitle="Moderation · 按风险类别决定内容去向" sources={moderationSources} sections={sections} hero={<ModerationConveyorHero />} intro={<>内容审核先把文本、图片或其他输入转换成<strong>可解释的风险信号</strong>，再由产品规则决定展示、拦截、降权还是人工复核。模型报出的类别和分数是判断材料，不是法律裁决，也不是一枚可以替代权限、事实核对和申诉流程的“安全章”。</>}>
    <ArticleSection id="moderation-question" title="先把内容变成风险信号">
      <p>假设社区收到三条评论：一条只是讨论退款政策，一条包含可能冒犯人的词，另一条明确威胁他人。审核模型可以为不同风险类别给出标签和分数，但它先回答的是“这段内容像不像某类风险”，不是“这条内容在所有地方都应该被删除”。</p>
      <p id="moderation-score" className="vp-citation-target">OpenAI 的 Moderation API 返回类别及其概率式信号，调用者仍要把信号放回自己的语言、用户群和产品规则里解释。分数越高通常表示模型越倾向于某类判断，却没有自动告诉你应该采用哪个处置阈值。<Cite id="moderation-score" sources={moderationSources} /></p>
      <p>因此演示中的 0.03、0.61 和 0.94 是为了看清相对变化的教学数字，不是任何产品的通用门槛。把它们直接写成“0.94 就违法”，会把分类器的输出误当成最终事实。</p>
      <ModerationLesson />
    </ArticleSection>

    <ArticleSection id="moderation-policy" title="阈值是产品决定，不是模型真理">
      <p id="moderation-label" className="vp-citation-target">分类标签、模型分数和产品阈值是三层不同的东西：模型给出“可能属于哪类”的信号，产品定义多少风险需要隐藏、多少风险进入复核，界面再把决定呈现给用户。相同的模型输出，在儿童社区、公开论坛和内部工单里可能有不同的处置。<Cite id="moderation-label" sources={moderationSources} /></p>
      <p>一条实际规则可以写成三段：低于低阈值先放行，中间区间进入人工队列，高于高阈值暂时隐藏并告诉发布者如何申诉。每段都要说明输入版本、使用的类别、决定时限和回退动作，否则“进入审核”只是一个无法追踪的状态名。</p>
      <p id="moderation-stage" className="vp-citation-target">审核可以放在发布前、发布后或工具动作前，但位置会改变风险和用户体验。它可以是护栏的一道检查，却不会自动完成权限校验、事实核对、账号处罚或人工申诉；这些决定仍属于产品和业务流程。<Cite id="moderation-stage" sources={moderationSources} /></p>
    </ArticleSection>

    <ArticleSection id="moderation-review" title="误报和漏报要能回到人">
      <p>把一个高分直接删除，会误伤引用敏感词讨论疾病、历史或新闻的正常内容；把一个低分直接放过，也可能漏掉换写法的攻击。真实系统要保留原文、模型版本、类别、阈值、决定时间和最终处置，之后才能知道是模型判断错了、规则设得不合适，还是人工看到了额外上下文。</p>
      <p id="moderation-risk" className="vp-citation-target">NIST 的风险资料要求把模型输出放进具体使用场景和影响评估中，持续观察不同群体的误报、漏报和处置后果；一个静态阈值不能代表所有语言和场景。<Cite id="moderation-risk" sources={moderationSources} /></p>
      <p id="moderation-govern" className="vp-citation-target">申诉入口、人工容量、抽样复核和版本回放让产品可以修正规则，而不是把一次模型结果永久写成事实。治理记录还要说明谁能改变决定、改变后怎样通知用户，以及模型升级后如何重新评估旧样本。<Cite id="moderation-govern" sources={moderationSources} /></p>
    </ArticleSection>

    <ArticleSection id="moderation-boundary" title="审核只覆盖它声明的范围">
      <p id="moderation-safety" className="vp-citation-target">安全建议把输入验证、输出限制、权限控制、滥用监测和事件响应分开设计。内容审核只能回答“这个输入落入哪些风险类别”，不能证明模型说的事实是真的，也不能证明请求者有权访问或修改资源。<Cite id="moderation-safety" sources={moderationSources} /></p>
      <p>看到“已通过审核”时，继续追问四件事：审核看的是输入还是输出？使用了哪个模型和版本？阈值和人工回退是什么？决定是否允许申诉和撤销？如果答案只有一个分数，说明证据还没覆盖真实的产品责任。</p>
      <p><strong>读者判断</strong>：把阈值从 0.80 调到 0.60 后，变化的是产品会把多少内容送进复核，不是模型突然变得更懂“什么是违规”。要验证新阈值，必须用带有人工结论的样本重新看误报、漏报和处理成本。</p>
    </ArticleSection>
  </Article>;
}
