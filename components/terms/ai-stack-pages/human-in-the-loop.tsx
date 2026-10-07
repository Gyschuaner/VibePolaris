import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { humanInTheLoopSources } from "@/lib/ai-stack-concept-sources/human-in-the-loop";
import { HumanInTheLoopLesson } from "../ai-stack-lessons/human-in-the-loop";
import { ApprovalSealHero } from "../ai-stack-lessons/ai-interaction-heroes";

export function HumanInTheLoopTermPage() {
  const sections: [string, string][] = [
    ["hitl-question", "人在执行前改变结果"],
    ["hitl-surface", "审阅者要看到什么"],
    ["hitl-execution", "批准、修改和拒绝怎样落地"],
    ["hitl-boundary", "批准也有范围"],
  ];
  return <Article slug="human-in-the-loop" title="人在回路" subtitle="Human in the Loop · 在高风险动作前让人决定" sources={humanInTheLoopSources} sections={sections} hero={<ApprovalSealHero />} intro={<>人在回路把人放在动作真正发生之前，让审阅者查看输入、建议动作和影响，再批准、修改或拒绝。它不是给结果加一个“已看过”标签，而是让人的决定真的能改变下一步；事后通知或抽样复查不能把已经发生的动作变成“人在回路”。</>}>
    <ArticleSection id="hitl-question" title="人在执行前改变结果">
      <p>自动退款上限是 500 元，用户申请 1200 元。系统先生成退款预览并暂停，而不是先退款再发一条通知。人工决定可以批准 1200、改成 500，或拒绝；三个结果会改变后端是否执行，审阅人也要知道自己正在决定哪一笔退款。</p>
      <p id="hitl-pause" className="vp-citation-target">OpenAI Agents SDK 的 HITL 流程会在需要审批的工具调用处暂停，把待处理项放入 interruption，再由人决定后恢复运行。暂停点必须发生在工具产生外部副作用之前。<Cite id="hitl-pause" sources={humanInTheLoopSources} /></p>
      <p>演示里的“待决定”不是失败，也不是成功。它是一种需要被保存的中间状态：请求、建议参数和触发原因都在，退款执行仍为 0 次，直到人提交明确决定。</p>
      <HumanInTheLoopLesson />
    </ArticleSection>

    <ArticleSection id="hitl-surface" title="审阅者要看到什么">
      <p id="hitl-decision" className="vp-citation-target">审批项应绑定具体调用、参数和影响范围：订单号、金额、受影响的账户、工具名和即将写入的字段都要能核对。决定保存后只对相应的调用生效，不能用一个模糊的“允许”覆盖所有后续动作。<Cite id="hitl-decision" sources={humanInTheLoopSources} /></p>
      <p id="hitl-preview" className="vp-citation-target">审阅界面应同时给出原始请求和系统建议，明确哪些字段来自用户、哪些字段由模型或规则推导，哪些信息还没有核实。只显示一句“系统建议退款”会把影响范围藏起来，审阅者无法发现账户或金额被换过。<Cite id="hitl-preview" sources={humanInTheLoopSources} /></p>
      <p id="hitl-risk" className="vp-citation-target">护栏和风险管理资料把人工复核视为处置链中的一个控制点：它要有触发条件、可理解的材料和可记录的决定。工具调用本身还应保留待处理状态和恢复点。<Cite id="hitl-risk" sources={humanInTheLoopSources} /><Cite id="hitl-tool" sources={humanInTheLoopSources} /></p>
    </ArticleSection>

    <ArticleSection id="hitl-execution" title="批准、修改和拒绝怎样落地">
      <p>批准表示当前这一次调用的参数可以继续，修改表示人先改变参数再继续，拒绝表示动作不应发生。三者都应留下决定人、时间、理由和原始建议；“关闭弹窗”不能被默认解释成批准。</p>
      <p id="hitl-resume" className="vp-citation-target">恢复运行时，系统应重新读取保存的待处理项并检查它仍然有效，而不是把浏览器里的一枚旧按钮直接当成授权。参数、身份、版本或权限改变后，应该重新暂停。<Cite id="hitl-resume" sources={humanInTheLoopSources} /></p>
      <p id="hitl-timeout" className="vp-citation-target">超时不是批准。没有人在期限内决定时，安全的默认通常是保持未执行、退回人工队列或请求用户重新提交；具体选择由业务风险决定，但必须在规则里写清。<Cite id="hitl-timeout" sources={humanInTheLoopSources} /></p>
    </ArticleSection>

    <ArticleSection id="hitl-boundary" title="批准也有范围">
      <p id="hitl-govern" className="vp-citation-target">NIST AI RMF 将治理、测量和管理看作持续过程；一次人工决定不能替代系统的权限、监控、数据保护和事后复核。<Cite id="hitl-govern" sources={humanInTheLoopSources} /></p>
      <p id="hitl-framework" className="vp-citation-target">风险框架要求根据应用场景管理风险，而不是把某个审批按钮当成通用安全保证。低风险动作可以自动完成，高风险动作才需要更强的审阅材料和双人复核。<Cite id="hitl-framework" sources={humanInTheLoopSources} /></p>
      <p><strong>停止条件</strong>：审阅者身份已验证，看到的是服务器保存的原始请求，决定与待处理项一一对应；参数改变、过期或重复提交时，旧批准失效。读者可以反问：如果批准记录被复制到另一笔订单，系统能否拒绝它？如果不能，人在回路只是界面上的装饰。</p>
    </ArticleSection>
  </Article>;
}
