import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import {
  costEvaluationRedesignSources,
  evaluationRunRedesignSources,
  humanGraderRedesignSources,
  latencyEvaluationRedesignSources,
  passFailRedesignSources,
  permissionBoundarySources,
  rubricRedesignSources,
  safetyEvaluationRedesignSources,
  skillRedesignSources,
  xssRedesignSources,
} from "@/lib/boundary-evaluation-redesign-sources";
import { BoundaryLesson, BoundaryHero } from "./PermissionBoundaryAnimation";
import { XssHero, XssLesson } from "./XssAnimation";
import { SkillHero, SkillLesson } from "./SkillAnimation";
import { EvaluationRunHero, EvaluationRunLesson } from "./EvaluationRunAnimation";
import { SafetyEvaluationHero, SafetyEvaluationLesson } from "./SafetyEvaluationAnimation";
import { CostEvaluationHero, CostEvaluationLesson } from "./CostEvaluationAnimation";
import { LatencyEvaluationHero, LatencyEvaluationLesson } from "./LatencyEvaluationAnimation";
import { PassFailHero, PassFailLesson } from "./PassFailAnimation";
import { RubricHero, RubricLesson } from "./RubricAnimation";
import { HumanGraderHero, HumanGraderLesson } from "./HumanGraderAnimation";

function PermissionCite({ id }: { id: string }) { return <Cite id={id} sources={permissionBoundarySources}/>; }
function XssCite({ id }: { id: string }) { return <Cite id={id} sources={xssRedesignSources}/>; }
function SkillCite({ id }: { id: string }) { return <Cite id={id} sources={skillRedesignSources}/>; }
function RunCite({ id }: { id: string }) { return <Cite id={id} sources={evaluationRunRedesignSources}/>; }
function SafetyCite({ id }: { id: string }) { return <Cite id={id} sources={safetyEvaluationRedesignSources}/>; }
function CostCite({ id }: { id: string }) { return <Cite id={id} sources={costEvaluationRedesignSources}/>; }
function LatencyCite({ id }: { id: string }) { return <Cite id={id} sources={latencyEvaluationRedesignSources}/>; }
function PassFailCite({ id }: { id: string }) { return <Cite id={id} sources={passFailRedesignSources}/>; }
function RubricCite({ id }: { id: string }) { return <Cite id={id} sources={rubricRedesignSources}/>; }
function HumanCite({ id }: { id: string }) { return <Cite id={id} sources={humanGraderRedesignSources}/>; }

const permissionSections: [string, string][] = [["permission-definition-section", "提示词不是权限边界"], ["permission-policy-section", "一次请求怎样被挡住"], ["permission-boundary-section", "边界扩大后要重新授权"]];
export function BoundaryPermissionTermPage() {
  return <Article slug="permission-boundary" title="权限边界" subtitle="Permission Boundary · 在资源访问处强制校验" sources={permissionBoundarySources} sections={permissionSections} hero={<BoundaryHero/>} intro={<>报表工具可以被允许读取销售数据，却不应该因为提示词写得更长就顺手读到工资表。<strong>权限边界把主体、动作和资源的组合交给模型外的授权层判定</strong>，越界请求在碰到真实资源前就停下。</>}> 
    <ArticleSection id="permission-definition-section" title="提示词不是权限边界"><p id="permission-definition" className="vp-citation-target"><strong>最小权限意味着只给主体完成当前任务所需的资源和动作。</strong>NIST 将 least privilege 定义为把访问限制在任务需要的最小范围；所以 token 里没有 <code>read:salary</code>，模型说“我只是查一眼”也不会凭空得到它。<PermissionCite id="permission-definition"/></p><p id="permission-scope" className="vp-citation-target">角色可以帮助整理权限，但角色名不是最终判定。RBAC 把用户与角色、角色与权限关联，真正的请求仍要落到具体资源和动作。<PermissionCite id="permission-scope"/></p><BoundaryLesson/></ArticleSection>
    <ArticleSection id="permission-policy-section" title="一次请求怎样被挡住"><p id="permission-enforce" className="vp-citation-target">OWASP 建议在每次请求中核对主体、对象和动作，而不是只在页面上隐藏一个按钮。<PermissionCite id="permission-enforce"/>演示中的 salary 请求因此会在资源访问处留下拒绝事件。</p><p id="permission-protocol" className="vp-citation-target">如果工具通过授权协议工作，资源服务器还要检查令牌、受众和 scope；MCP 的授权规范把这些验证放在资源服务器一侧。<PermissionCite id="permission-protocol"/>模型提出调用不等于调用已经获准。</p></ArticleSection>
    <ArticleSection id="permission-boundary-section" title="边界扩大后要重新授权"><p id="permission-boundary" className="vp-citation-target">ABAC 可以把主体、资源属性和环境条件组合成策略；权限边界也因此可能随资源敏感度、时间或环境改变。<PermissionCite id="permission-boundary"/>勾选扩大 scope 只是改变教学状态，真实系统仍需重新授权、审计和最小化。</p><ArticleAside title="边界检查的最后一问"><p>如果攻击者绕过了聊天界面，直接拿着同一个令牌调用接口，服务器还会不会拒绝？如果答案是否定的，所谓边界只是文案。</p></ArticleAside></ArticleSection>
  </Article>;
}

const xssSections: [string, string][] = [["xss-context-section", "字符串在哪个上下文落地"], ["xss-dom-section", "危险 sink 与安全 API"], ["xss-boundary-section", "输入校验不能代替输出防护"]];
export function BoundaryXssTermPage() {
  return <Article slug="xss" title="跨站脚本" subtitle="Cross-Site Scripting · 让不可信字符串停在文字层" sources={xssRedesignSources} sections={xssSections} hero={<XssHero/>} intro={<>XSS 不是“评论里出现了尖括号”这么简单，而是浏览器把不可信数据当成标签、属性或脚本解释。<strong>同一个字符串落进不同 DOM API，结果可能从可见文字变成可执行节点</strong>。</>}> 
    <ArticleSection id="xss-context-section" title="字符串在哪个上下文落地"><p id="xss-context" className="vp-citation-target"><strong>防护要跟着输出上下文走：HTML、属性、URL 和脚本字符串不是同一种语言。</strong>OWASP 的防护清单把上下文相关编码放在核心位置；只做一次通用替换，可能仍然漏掉另一种解释方式。<XssCite id="xss-context"/></p><p id="xss-attack" className="vp-citation-target">攻击者的目标不是让页面“看起来奇怪”，而是让浏览器在受害者的身份下执行动作、读取数据或发送请求。<XssCite id="xss-attack"/>因此要观察节点和事件是否真的进入 DOM。</p><XssLesson/></ArticleSection>
    <ArticleSection id="xss-dom-section" title="危险 sink 与安全 API"><p id="xss-inner" className="vp-citation-target"><code>innerHTML</code> 会把字符串解析成 HTML；MDN 明确提醒，给它写入不可信内容会带来注入风险。<XssCite id="xss-inner"/>图中的红色节点就是解析已经发生的地方。</p><p id="xss-text" className="vp-citation-target"><code>textContent</code> 把内容当作节点里的文字，不会把同样的字符变成标签。<XssCite id="xss-text"/>它保留了用户想看的字面内容，却不替字符串打开执行入口。</p></ArticleSection>
    <ArticleSection id="xss-boundary-section" title="输入校验不能代替输出防护"><p id="xss-trusted" className="vp-citation-target">Trusted Types 可以要求危险 sink 接收经过策略创建的可信对象，把遗漏的写入点变成可观察的策略错误。<XssCite id="xss-trusted"/>它是额外的约束，不是让任意 HTML 自动安全。</p><p id="xss-limit" className="vp-citation-target">OWASP 也把内容安全策略、框架安全 API 和上下文编码视作互补手段；输入长度限制只能减少一部分形态，不能证明没有脚本。<XssCite id="xss-limit"/></p><ArticleAside title="看一段渲染代码时先找什么"><p>先找不可信数据从哪里来，再找它落进哪个 sink，最后问有没有按该上下文完成编码或策略校验。不要先看按钮颜色或输入框长度。</p></ArticleAside></ArticleSection>
  </Article>;
}

const skillSections: [string, string][] = [["skill-structure-section", "技能目录装的是什么"], ["skill-disclosure-section", "为什么不是一开始全读"], ["skill-security-section", "技能不会凭空增加权限"]];
export function BoundarySkillTermPage() {
  return <Article slug="skill" title="技能" subtitle="Skill · 把一类任务的做法按需装进上下文" sources={skillRedesignSources} sections={skillSections} hero={<SkillHero/>} intro={<>技能像一只按需打开的工具箱：启动时先让智能体知道“这里有一套处理 PDF 表单的做法”，真正匹配到任务后，才把 <code>SKILL.md</code> 和脚本材料拿出来。<strong>它改变的是可复用的工作说明，不是模型突然多了一种能力。</strong></>}> 
    <ArticleSection id="skill-structure-section" title="技能目录装的是什么"><p id="skill-structure" className="vp-citation-target">Agent Skills 规范把技能组织成带元数据和 <code>SKILL.md</code> 的目录，说明文件还可以指向脚本和参考资料。<SkillCite id="skill-structure"/>元数据负责让宿主发现技能，正文负责告诉智能体如何做事。</p><p id="skill-purpose" className="vp-citation-target">Anthropic 把技能描述为可组合的任务知识和程序材料：把团队反复说的步骤写成文件，智能体可以在需要时复用。<SkillCite id="skill-purpose"/>技能仍依赖宿主能读取目录、运行允许的程序。</p><SkillLesson/></ArticleSection>
    <ArticleSection id="skill-disclosure-section" title="为什么不是一开始全读"><p id="skill-trigger" className="vp-citation-target">技能的 <code>name</code> 与 <code>description</code> 先作为轻量线索参与匹配，当前任务合适时才进一步读取正文。<SkillCite id="skill-trigger"/>这让许多技能可以并存，又不把全部细节塞进每一轮上下文。</p><p id="skill-disclosure" className="vp-citation-target">Anthropic 与 OpenAI 的技能文档都把渐进式披露作为关键机制：先暴露描述，再暴露说明，必要时才读资源或脚本输出。<SkillCite id="skill-disclosure"/>首图里的三层抽屉不是三次模型调用，而是信息进入上下文的三个门槛。</p><p id="skill-resources" className="vp-citation-target">脚本和参考文件是可选资源，运行后应只把对当前任务有用的结果带回来。<SkillCite id="skill-resources"/>把整个仓库一股脑塞进上下文，会让技能失去它本来要解决的负担。</p></ArticleSection>
    <ArticleSection id="skill-security-section" title="技能不会凭空增加权限"><p id="skill-security" className="vp-citation-target">技能说明可以建议使用工具，却不会自动授予文件、网络或账户权限；宿主仍要按自己的执行边界和审批机制放行。<SkillCite id="skill-security"/>安装不可信技能等于把不可信代码和指令带进工作区，应先审查来源、脚本和数据流。</p><ArticleAside title="技能和工具的分界"><p>技能告诉智能体“如何组织一次任务”，工具才提供真正的读写、联网或执行入口。把两者混为一谈，会以为写进 SKILL.md 就能绕过权限。</p></ArticleAside></ArticleSection>
  </Article>;
}

const evalRunSections: [string, string][] = [["evalrun-definition-section", "一次运行不是一个平均分"], ["evalrun-record-section", "把条件和轨迹写进账本"], ["evalrun-boundary-section", "缺证据时停止比较"]];
export function BoundaryEvaluationRunTermPage() {
  return <Article slug="evaluation-run" title="评测运行" subtitle="Evaluation Run · 把一次试跑的条件、轨迹和结果绑在一起" sources={evaluationRunRedesignSources} sections={evalRunSections} hero={<EvaluationRunHero/>} intro={<>两次运行都写着“10/12”，不代表它们可以直接比较。一次评测运行要把题集、被测版本、评分规则、环境和逐项轨迹锁在同一个编号下，才能回头问：差异到底从哪里来？</>}> 
    <ArticleSection id="evalrun-definition-section" title="一次运行不是一个平均分"><p id="evalrun-definition" className="vp-citation-target"><strong>评测运行是一次有编号、可复查的执行记录。</strong>OpenAI 的 evals 文档把数据集、运行和结果区分开；运行还要关联被测对象与评分器。<RunCite id="evalrun-definition"/>所以 run-18 不是“10/12”这四个字符，而是那次执行的整套条件。</p><p id="evalrun-compare" className="vp-citation-target">Anthropic 也把任务、成功标准、评分器和轨迹放进同一评测链路。<RunCite id="evalrun-compare"/>只有题集、版本和评分口径一致，前后结果才有可解释的差异。</p><EvaluationRunLesson/></ArticleSection>
    <ArticleSection id="evalrun-record-section" title="把条件和轨迹写进账本"><p id="evalrun-record" className="vp-citation-target">运行记录至少应保留运行编号、题集版本、被测版本、评分器版本、环境、逐项输入输出和最终汇总。<RunCite id="evalrun-record"/>只保存平均分，无法发现某一条轨迹丢失或某个工具结果为空。</p><p id="evalrun-trace" className="vp-citation-target">评分器可以保存每一题的分数、理由和未评分状态，之后再回到原始轨迹。<RunCite id="evalrun-trace"/>日志不是装饰，而是让汇总结论能被复核的证据链。</p></ArticleSection>
    <ArticleSection id="evalrun-boundary-section" title="缺证据时停止比较"><p id="evalrun-boundary" className="vp-citation-target">NIST AI RMF 把测量、记录和持续评估放进风险管理循环；缺少关键记录时，应把运行标成不可比较，而不是补一个看似合理的数字。<RunCite id="evalrun-boundary"/></p><ArticleAside title="运行标记为不可比较的三个信号"><p>题集换了版本、评分器换了规则、逐项轨迹缺了记录。它们都不一定表示被测系统变差，却足以让两次总分失去共同条件。</p></ArticleAside></ArticleSection>
  </Article>;
}

const safetySections: [string, string][] = [["safety-definition-section", "安全评测看的是结果链"], ["safety-case-section", "把危险请求放进真实边界"], ["safety-gate-section", "一个副作用不能被平均数冲掉"]];
export function BoundarySafetyEvaluationTermPage() {
  return <Article slug="safety-evaluation" title="安全评测" subtitle="Safety Evaluation · 检查危险请求有没有变成真实副作用" sources={safetyEvaluationRedesignSources} sections={safetySections} hero={<SafetyEvaluationHero/>} intro={<>系统拒绝了几个危险问题，仍然可能在工具层读出字段、改变资源或泄露秘密。安全评测要同时看模型回答、权限判断、工具日志和最后的环境状态，避免把“说得像拒绝”当成安全完成。</>}> 
    <ArticleSection id="safety-definition-section" title="安全评测看的是结果链"><p id="safety-definition" className="vp-citation-target"><strong>安全评测用代表性的风险任务检查系统在真实边界内是否产生了不该发生的结果。</strong>OpenAI 的安全实践把限制、验证和人工介入放到应用层，而不是只依靠模型语气。<SafetyCite id="safety-definition"/></p><p id="safety-tool" className="vp-citation-target">一个请求即便返回“我不能帮你”，也要核对敏感工具是否真的没有执行。<SafetyCite id="safety-tool"/>首图把回答和副作用拆成两列，绿色不代表模型说对了，必须看工具状态。</p><SafetyEvaluationLesson/></ArticleSection>
    <ArticleSection id="safety-case-section" title="把危险请求放进真实边界"><p id="safety-coverage" className="vp-citation-target">Anthropic 的评测实践强调真实任务、攻击变体和成功标准；安全题集要覆盖正常、越权、注入、泄露和恢复路径。<SafetyCite id="safety-coverage"/>只测一种固定的“请输出秘密”很容易错过变体。</p><p>允许行为也要保留：如果系统把所有请求都拒绝，表面风险下降，产品却已经失去用途。安全评测要同时记录安全完成和安全拒绝。</p></ArticleSection>
    <ArticleSection id="safety-gate-section" title="一个副作用不能被平均数冲掉"><p id="safety-gate" className="vp-citation-target">NIST AI RMF Playbook 把风险测量连接到治理动作；高风险副作用应触发阻断、复核或回滚，而不是被总体通过率稀释。<SafetyCite id="safety-gate"/></p><p id="safety-boundary" className="vp-citation-target">HELM 的多维评测提醒我们，安全只是多个维度之一，分数也不能穷尽部署环境的风险。<SafetyCite id="safety-boundary"/>应用权限、数据来源和人工处置仍要单独验证。</p><ArticleAside title="安全结果要能回到哪里"><p>回到题目、输入变体、模型回答、工具参数、执行日志和最终资源状态。缺一环，就把结果标成证据不足，而不是替它补一个通过。</p></ArticleAside></ArticleSection>
  </Article>;
}

const costSections: [string, string][] = [["cost-definition-section", "价格不是任务成本"], ["cost-measure-section", "把消耗和质量放在同一张表"], ["cost-boundary-section", "条件变了就别硬比"]];
export function BoundaryCostEvaluationTermPage() {
  return <Article slug="cost-evaluation" title="成本评测" subtitle="Cost Evaluation · 比较一次任务的真实消耗是否值得" sources={costEvaluationRedesignSources} sections={costSections} hero={<CostEvaluationHero/>} intro={<>更便宜的模型如果多重试两次、再多叫一个工具，单价就不再是单任务成本。成本评测把消耗放回固定题集和质量门槛里，看每一次成功到底花了什么。</>}> 
    <ArticleSection id="cost-definition-section" title="价格不是任务成本"><p id="cost-definition" className="vp-citation-target"><strong>成本评测统计完成一次任务所需的令牌、调用、工具、重试和实际费用，再与质量目标一起判断取舍。</strong>OpenAI 的成本优化指南把减少令牌、选择模型和控制请求数量视为一组工程决策。<CostCite id="cost-definition"/></p><p id="cost-measure" className="vp-citation-target">评测运行提供任务结果，成本记录补上输入输出令牌、调用次数和失败重试。<CostCite id="cost-measure"/>图中 A 的 17/20 与 B 的 18/20 不能脱离费用单独排名。</p><CostEvaluationLesson/></ArticleSection>
    <ArticleSection id="cost-measure-section" title="把消耗和质量放在同一张表"><p id="cost-budget" className="vp-citation-target">Anthropic 的智能体评测说明把任务成功和运行成本一起观察；预算是约束，不是把质量直接换成钱。<CostCite id="cost-budget"/>低成本但大量失败的方案，可能让用户和人工补救承担更高成本。</p><p>比较时同时列出通过数、平均和长尾延迟、工具调用、重试与单任务费用。把这些字段拆开，才知道是模型贵、提示词长，还是失败重试在烧钱。</p></ArticleSection>
    <ArticleSection id="cost-boundary-section" title="条件变了就别硬比"><p id="cost-conditions" className="vp-citation-target">Batch API 改变的是执行方式、等待时间和计费条件；命中缓存、批量运行与冷请求不能混成一条曲线。<CostCite id="cost-conditions"/>先统一条件，或按条件分组报告。</p><p id="cost-limit" className="vp-citation-target">HELM 的整体评测提醒我们，任何单一指标都有覆盖边界；成本数字仍要结合任务质量、用户等待和风险后果。<CostCite id="cost-limit"/></p><ArticleAside title="看到成本下降时先问三句"><p>通过率是否保持？重试和人工补救是否上升？缓存和批量条件是否与旧方案一致？三句答不清，就先保留“条件不同”。</p></ArticleAside></ArticleSection>
  </Article>;
}

const latencySections: [string, string][] = [["latency-definition-section", "首字和完成是两件事"], ["latency-measure-section", "把等待拆成可解释的段"], ["latency-boundary-section", "长尾和超时不能藏进平均数"]];
export function BoundaryLatencyEvaluationTermPage() {
  return <Article slug="latency-evaluation" title="延迟评测" subtitle="Latency Evaluation · 把用户等待拆成可解释的时间点" sources={latencyEvaluationRedesignSources} sections={latencySections} hero={<LatencyEvaluationHero/>} intro={<>用户在 420ms 看到首字，却可能还要等 3.4 秒才拿到结果；另一部分用户可能卡在工具等待的长尾里。延迟评测把一次请求拆成时间点和分位数，避免“平均很快”掩盖真实等待。</>}> 
    <ArticleSection id="latency-definition-section" title="首字和完成是两件事"><p id="latency-definition" className="vp-citation-target"><strong>延迟评测记录请求从开始到反馈、工具返回和任务完成的时间，并按 p50、p95 等分位数描述分布。</strong>OpenAI 的延迟指南区分首字时间与完整响应，优化时要先知道用户卡在哪一段。<LatencyCite id="latency-definition"/></p><p id="latency-timeline" className="vp-citation-target">评测运行把同一任务的时间点与输出绑定起来，才能比较版本改变的是首字、工具还是完成阶段。<LatencyCite id="latency-timeline"/></p><LatencyEvaluationLesson/></ArticleSection>
    <ArticleSection id="latency-measure-section" title="把等待拆成可解释的段"><p id="latency-tail" className="vp-citation-target">Anthropic 的评测实践强调用真实任务观察端到端轨迹；p50 可以代表典型体验，p95 则把一部分用户的慢请求亮出来。<LatencyCite id="latency-tail"/>两者不能互相替代。</p><p id="latency-timeout" className="vp-citation-target">工具超时不是普通的“完成得很慢”，而是运行在某一阶段没有得到结果。<LatencyCite id="latency-timeout"/>应保留阶段、超时时间和重试策略，不能把未完成样本悄悄塞进完成分布。</p></ArticleSection>
    <ArticleSection id="latency-boundary-section" title="长尾和超时不能藏进平均数"><p id="latency-boundary" className="vp-citation-target">MLPerf Inference 用统一条件报告延迟和吞吐，说明基准结果只有在请求、硬件和负载条件明确时才可比较。<LatencyCite id="latency-boundary"/>把不同输出长度、并发和网络条件混在一起，会制造假差异。</p><ArticleAside title="一个延迟记录至少写下什么"><p>请求类型、并发、首字、各工具跨度、完成或超时、p50/p95、客户端与服务端时间戳。先让等待有位置，再讨论怎样变快。</p></ArticleAside></ArticleSection>
  </Article>;
}

const passFailSections: [string, string][] = [["passfail-definition-section", "二值结果从哪条证据来"], ["passfail-evidence-section", "检查结果，不听口头完成"], ["passfail-boundary-section", "无法检查不等于失败"]];
export function BoundaryPassFailGraderTermPage() {
  return <Article slug="pass-fail-grader" title="通过失败评分器" subtitle="Pass/Fail Grader · 先把成功证据写清，再决定是否通过" sources={passFailRedesignSources} sections={passFailSections} hero={<PassFailHero/>} intro={<>二值评分器适合判断“文件是否存在”“字段是否正确”这类清晰条件，但一次运行还可能遇到环境不可读。把 <code>unscored</code> 留在结果里，才不会把设施故障伪装成系统失败。</>}> 
    <ArticleSection id="passfail-definition-section" title="二值结果从哪条证据来"><p id="passfail-definition" className="vp-citation-target"><strong>通过失败评分器把写好的成功条件变成可执行检查，再输出 pass 或 fail。</strong>OpenAI 的 graders 文档把代码、模型和人工都列为评分器方式；对文件、字段或明确副作用，判据可以直接指向结果证据。<PassFailCite id="passfail-definition"/></p><PassFailLesson/></ArticleSection>
    <ArticleSection id="passfail-evidence-section" title="检查结果，不听口头完成"><p id="passfail-evidence" className="vp-citation-target">Anthropic 的评测实践把任务输出和运行轨迹放在一起检查；“已完成”这句回复不能代替文件、数据库或工具副作用证据。<PassFailCite id="passfail-evidence"/>评分器要能回到具体字段。</p><p>例如 <code>answer.json</code> 存在但金额错误，第一条条件通过也不能掩盖第二条失败。把逐项检查展示出来，发布门槛才知道该阻断哪一步。</p></ArticleSection>
    <ArticleSection id="passfail-boundary-section" title="无法检查不等于失败"><p id="passfail-unscored" className="vp-citation-target">安全实践要求高影响动作前有检查和限制；如果环境不可读，评分器没有证据判成通过或失败，应返回未评分并说明缺口。<PassFailCite id="passfail-unscored"/></p><p id="passfail-gate" className="vp-citation-target">NIST AI RMF Playbook 把测量结果连接到后续治理动作：通过进入下一步，失败修复，未评分补证据或重跑。<PassFailCite id="passfail-gate"/></p><p id="passfail-limit" className="vp-citation-target">Inspect 的评分文档也把评分过程和结果状态分开，提醒评分器只对写下的判据负责。<PassFailCite id="passfail-limit"/></p></ArticleSection>
  </Article>;
}

const rubricSections: [string, string][] = [["rubric-definition-section", "规则不是一句整体印象"], ["rubric-dimensions-section", "把回答拆成维度和证据"], ["rubric-calibration-section", "反例让不同人站在同一把尺上"]];
export function BoundaryGradingRubricTermPage() {
  return <Article slug="grading-rubric" title="评分规则" subtitle="Grading Rubric · 把“好不好”拆成可核对的要求" sources={rubricRedesignSources} sections={rubricSections} hero={<RubricHero/>} intro={<>“回答得不错”对一个人来说是称赞，对另一个人来说可能漏了关键条件。评分规则把目标拆成维度、等级、证据和反例，让分数能解释为什么得到，而不是只留下一个印象。</>}> 
    <ArticleSection id="rubric-definition-section" title="规则不是一句整体印象"><p id="rubric-definition" className="vp-citation-target"><strong>评分规则定义要检查的维度、每个等级需要的证据、聚合方式和无法判断时的处理。</strong>OpenAI 的 graders 文档把评分标准和评分器分开，规则先说清“什么算好”，执行者再照着检查。<RubricCite id="rubric-definition"/></p><RubricLesson/></ArticleSection>
    <ArticleSection id="rubric-dimensions-section" title="把回答拆成维度和证据"><p id="rubric-dimensions" className="vp-citation-target">G-Eval 的研究把自然语言评价拆成标准和步骤，说明结构化维度能帮助模型评分与人工判断对齐。<RubricCite id="rubric-dimensions"/>本例把退款回答拆成事实、条件和越界承诺三格。</p><p>维度要尽量互相区分：条件缺失不应同时被藏在“整体质量”里，权重也要在规则中固定。否则改一项描述，就可能悄悄改变总分含义。</p></ArticleSection>
    <ArticleSection id="rubric-calibration-section" title="反例让不同人站在同一把尺上"><p id="rubric-calibration" className="vp-citation-target">Anthropic 的评测实践把成功标准、示例和评分器一起设计；正例与反例比一句形容词更能帮助评审者校准。<RubricCite id="rubric-calibration"/></p><p id="rubric-boundary" className="vp-citation-target">Inspect 的评分模型允许保留证据和未评分状态；资料不足时应停在未评分，而不是强迫某一档。<RubricCite id="rubric-boundary"/></p><p id="rubric-examples" className="vp-citation-target">MT-Bench 研究显示模型裁判会受位置、长度和偏好影响；代表性的边界样例能让这些偏差更早暴露。<RubricCite id="rubric-examples"/></p><ArticleAside title="写规则时把这四样放在一起"><p>维度、分档、正反例、无法判断的处理。四样少一样，执行者就会把缺口补成自己的感觉。</p></ArticleAside></ArticleSection>
  </Article>;
}

const humanSections: [string, string][] = [["human-definition-section", "人工评分不是凭感觉打分"], ["human-process-section", "先独立评分，再比较理由"], ["human-calibration-section", "分歧是校准入口"]];
export function BoundaryHumanGraderTermPage() {
  return <Article slug="human-grader" title="人工评分器" subtitle="Human Grader · 用可解释的人类判断校准规则和自动评分" sources={humanGraderRedesignSources} sections={humanSections} hero={<HumanGraderHero/>} intro={<>模型评分能批量处理样本，却可能稳定地偏爱某种长度或语气。人工评分器让评审者按同一量表独立查看证据，保留分数、理由和分歧，用来校准规则与自动评分。</>}> 
    <ArticleSection id="human-definition-section" title="人工评分不是凭感觉打分"><p id="human-definition" className="vp-citation-target"><strong>人工评分器是评审者按事先写好的评分规则检查输出，并保留分数、理由和证据的过程。</strong>OpenAI 将人、程序和模型都视为可以执行评分的评分器；人工的价值在于把难例和理由留下来。<HumanCite id="human-definition"/></p><HumanGraderLesson/></ArticleSection>
    <ArticleSection id="human-process-section" title="先独立评分，再比较理由"><p id="human-process" className="vp-citation-target">Anthropic 的评测实践强调先定义成功标准，再用真实任务和轨迹验证结果。<HumanCite id="human-process"/>两位评审应先遮住彼此分数，独立写出维度和证据，再把同一条样本放在一起讨论。</p><p>盲评不能消除所有偏差，却能减少知道模型名字、回答顺序和上一位分数带来的暗示。双人复核的目的也不是强迫永远一致，而是把不一致变成可检查的信号。</p></ArticleSection>
    <ArticleSection id="human-calibration-section" title="分歧是校准入口"><p id="human-calibration" className="vp-citation-target">G-Eval 研究比较模型评价与人工判断，说明人工参考样本可以帮助发现自动评分偏离目标的地方。<HumanCite id="human-calibration"/>人工之间的分歧也要回到规则和证据，而不是简单平均。</p><p id="human-boundary" className="vp-citation-target">MT-Bench 与 Chatbot Arena 的研究讨论模型裁判的位置、长度和自我偏好等偏差；人工判断同样需要样例和复核。<HumanCite id="human-boundary"/>看不到支付状态、工具日志或其他决定性证据时，评审者应返回未评分。</p><p id="human-blind" className="vp-citation-target">Inspect 的评分实践强调评分记录、证据和状态要能回查；盲评、双人复核和校准记录让人工结果不再是一次性意见。<HumanCite id="human-blind"/></p></ArticleSection>
  </Article>;
}
