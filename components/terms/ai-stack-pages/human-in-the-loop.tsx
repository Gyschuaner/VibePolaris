import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { humanInTheLoopSources } from "@/lib/ai-stack-concept-sources/human-in-the-loop";
import { HumanInTheLoopLesson } from "../ai-stack-lessons/human-in-the-loop";

export function HumanInTheLoopTermPage() {
  const sections: [string, string][] = [["hitl-question", "人在执行前改变结果"], ["hitl-surface", "审阅者要看到什么"], ["hitl-boundary", "批准也有范围"]];
  return <Article slug="human-in-the-loop" title="人在回路" subtitle="Human in the Loop · 在高风险动作前让人决定" sources={humanInTheLoopSources} sections={sections} hero={<Hero trigger="退款超过自动上限时，人工怎样在退款前改变结果？" change="风险触发 → 暂停 → 批准/修改/拒绝 → 执行或停止" proof="拒绝和超时没有退款副作用，决定可追溯" />} intro={<>人在回路把人放在动作真正发生之前，让审阅者查看输入、建议动作和影响，再批准、修改或拒绝。事后通知或抽样复查不能把已经发生的动作变成“人在回路”。</>}>
    <ArticleSection id="hitl-question" title="人在执行前改变结果"><p>自动退款上限是 500 元，用户申请 1200 元。系统先生成退款预览并暂停，而不是先退款再发一条通知。人工决定可以批准 1200、改成 500，或拒绝；三个结果会改变后端是否执行。</p><p id="hitl-pause" className="vp-citation-target">OpenAI Agents SDK 的 HITL 流程会在需要审批的工具调用处暂停，把待处理项放入 interruption，再由人决定后恢复运行。<Cite id="hitl-pause" sources={humanInTheLoopSources} /></p><HumanInTheLoopLesson /></ArticleSection>
    <ArticleSection id="hitl-surface" title="审阅者要看到什么"><p id="hitl-decision" className="vp-citation-target">审批项应绑定具体调用、参数和影响范围；决定保存后只对相应的调用生效，不能用一个模糊的“允许”覆盖所有后续动作。工具调用本身也应保留待处理状态和恢复点。<Cite id="hitl-decision" sources={humanInTheLoopSources} /><Cite id="hitl-tool" sources={humanInTheLoopSources} /></p><p id="hitl-risk" className="vp-citation-target">护栏和风险管理资料把人工复核视为处置链中的一个控制点：它要有触发条件、可理解的材料和可记录的决定。<Cite id="hitl-risk" sources={humanInTheLoopSources} /></p></ArticleSection>
    <ArticleSection id="hitl-boundary" title="批准也有范围"><p id="hitl-govern" className="vp-citation-target">NIST AI RMF 将治理、测量和管理看作持续过程；一次人工决定不能替代系统的权限、监控、数据保护和事后复核。<Cite id="hitl-govern" sources={humanInTheLoopSources} /></p><p id="hitl-framework" className="vp-citation-target">风险框架要求根据应用场景管理风险，而不是把某个审批按钮当成通用安全保证。<Cite id="hitl-framework" sources={humanInTheLoopSources} /></p><p><strong>停止条件</strong>：审阅者身份已验证，看到的是服务器保存的原始请求，决定与待处理项一一对应；参数改变、过期或重复提交时，旧批准失效。</p></ArticleSection>
  </Article>;
}
