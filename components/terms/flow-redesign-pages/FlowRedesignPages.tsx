import { Article, Cite } from "../AiStackConceptPageShared";
import { Envelope, Star } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import {
  a11ySources,
  clientServerSources,
  deploySources,
  iaSources,
  loadingStateSources,
  microinteractionSources,
  prototypeSources,
  reducedMotionSources,
  userFlowSources,
  wireframeSources,
} from "@/lib/process-redesign-sources";
import {
  A11yLesson,
  ClientServerLesson,
  DeployLesson,
  IaLesson,
  LoadingStateLesson,
  MicrointeractionLesson,
  PrototypeLesson,
  ReducedMotionLesson,
  UserFlowLesson,
  WireframeLesson,
} from "./FlowRedesignLessons";
import { SignatureHeroRuntime } from "./SignatureHeroRuntime";
import { A11ySignatureHero, IaSignatureHero, PrototypeSignatureHero, UserFlowSignatureHero, WireframeSignatureHero } from "../ProductCoreSignatureHeroes";
import { LoadingStateMechanismHero, MicrointeractionMechanismHero, ReducedMotionMechanismHero } from "../vbp095-mechanism-heroes";
import styles from "./FlowRedesignConcepts.module.css";

type HeroKind = "loading" | "micro" | "motion" | "client" | "deploy" | "flow" | "wireframe" | "prototype" | "ia" | "a11y";

function HeroShell({ kind, label, children }: { kind: HeroKind; label: string; children: ReactNode }) {
  return <SignatureHeroRuntime kind={kind} label={label}>{children}</SignatureHeroRuntime>;
}

function LoadingHero() {
  return <HeroShell kind="loading" label="等待刻度从短到长，列表骨架变成进度并在超时停下"><div className={styles.heroTimeScale}><span>100ms</span><span>2s</span><span>8s</span><span>timeout</span><i className={styles.heroTimeDot} aria-hidden="true" /><b className={styles.heroTimeThreshold}>!</b></div><div className={styles.heroSkeleton}><i /><i /><i /></div><div className={styles.heroProgress}><span>60%</span><i /></div><div className={styles.heroTimeoutLabel}>重试</div></HeroShell>;
}

function MicroHero() {
  return <HeroShell kind="micro" label="收藏按钮按下、回弹、填充并在失败时撤回"><div className={styles.heroFavorite}><Star size={28} weight="fill" aria-hidden="true" /><small>收藏</small></div><div className={styles.heroRecoil} aria-hidden="true" /><div className={styles.heroCounter}><small>计数</small><strong>24 → 25</strong></div><div className={styles.heroFailBadge}>失败 ↩</div></HeroShell>;
}

function MotionHero() {
  return <HeroShell kind="motion" label="完整动效沿轨迹移动，减少动态在原位淡入"><div className={styles.heroMotionColumns}><div><small>完整</small><i className={styles.heroMotionOrb} /><b>曲线 + 缩放</b></div><div><small>减少动态</small><i className={styles.heroMotionOrb} /><b>原位淡入</b></div></div><div className={styles.heroMotionResult}>标题 · URL · 焦点一致</div></HeroShell>;
}

function ClientHero() {
  return <HeroShell kind="client" label="请求信封从客户端出发，经过服务器拆封，再带状态返回"><div className={styles.heroClientDesk}><div className={styles.heroClientCard}><small>CLIENT</small><strong>GET /7</strong></div><div className={styles.heroEnvelope}><Envelope size={22} aria-hidden="true" /><small>200 / 404 / 500</small></div><div className={styles.heroClientCard}><small>SERVER</small><strong>处理</strong></div></div><div className={styles.heroClientStamp}>响应信封 · JSON</div></HeroShell>;
}

function DeployHero() {
  return <HeroShell kind="deploy" label="固定制品从提交车道进入金丝雀，流量拨盘逐步换手"><div className={styles.heroDeployLanes}><div><small>提交</small><i /></div><div><small>金丝雀</small><i /></div><div><small>生产</small><i /></div></div><div className={styles.heroTrafficDial}><span>5%</span><i /><span>100%</span></div><div className={styles.heroRollback}>上一版可回拨</div></HeroShell>;
}

function FlowHero() {
  return <HeroShell kind="flow" label="用户从邮件入口进入，遇到过期分支后沿回退弧线回到原任务"><div className={styles.heroFlowMap}><span>邮件</span><span>校验</span><span>完成</span><i className={styles.heroFlowBranch} /><b className={styles.heroFlowRecovery}>重新发送</b></div><div className={styles.heroFlowReadout}>原任务仍在</div></HeroShell>;
}

function WireframeHero() {
  return <HeroShell kind="wireframe" label="低保真纸层依次揭开内容、分组和操作位置"><div className={styles.heroPaperStack}><div><small>内容</small><strong>标题 · 金额</strong></div><div><small>分组</small><strong>明细 · 条件</strong></div><div><small>操作</small><strong>保存 · 返回</strong></div></div><div className={styles.heroPaperPeel}>结构先于外观</div></HeroShell>;
}

function PrototypeHero() {
  return <HeroShell kind="prototype" label="原型把假设翻成任务，任务留下观察证据"><div className={styles.heroHypothesis}><small>假设</small><strong>邀请码找得到吗？</strong></div><div className={styles.heroTestCard}><small>真实任务</small><strong>加入朋友空间</strong></div><div className={styles.heroEvidence}><small>观察</small><strong>3/3 停顿</strong></div><i className={styles.heroFlipMark} aria-hidden="true" /></HeroShell>;
}

function IaHero() {
  return <HeroShell kind="ia" label="内容卡从孤立位置吸附到领域区，再被任务入口找到"><div className={styles.heroIaZones}><div><small>账户安全</small></div><div><small>开发工具</small></div><div><small>用户任务</small></div><b className={styles.heroIaCard}>API 密钥</b></div><div className={styles.heroIaTrail}>一个正文 · 多个入口</div></HeroShell>;
}

function A11yHero() {
  return <HeroShell kind="a11y" label="焦点环沿键盘顺序移动，错误后回到邮箱字段"><div className={styles.heroFocusForm}><span>跳过</span><span className={styles.heroFocusField}>邮箱</span><span>密码</span><span>登录</span><i className={styles.heroFocusRing} aria-hidden="true" /></div><div className={styles.heroFocusError}>邮箱需要修正 ↩</div></HeroShell>;
}

function SignatureHero({ kind }: { kind: HeroKind }) {
  switch (kind) {
    case "loading": return <LoadingHero />;
    case "micro": return <MicroHero />;
    case "motion": return <MotionHero />;
    case "client": return <ClientHero />;
    case "deploy": return <DeployHero />;
    case "flow": return <FlowHero />;
    case "wireframe": return <WireframeHero />;
    case "prototype": return <PrototypeHero />;
    case "ia": return <IaHero />;
    case "a11y": return <A11yHero />;
  }
}


const loadingSections: [string, string][] = [["loading-definition-section", "先量等待，再选提示"], ["loading-feedback-section", "进度、占位和错误各自负责什么"], ["loading-boundary-section", "停止等待也是结果"]];
export function LoadingStateTermPage() {
  return <Article slug="loading-state" title="加载状态" subtitle="Loading State · 给等待一个可理解的形状" sources={loadingStateSources} sections={loadingSections} hero={<LoadingStateMechanismHero />} intro={<>接口没有立刻回答时，用户会盯着刚才按下的地方猜：是没有点到，还是系统正在工作？<strong>加载状态把等待长度、可估计程度和失败出口翻译成界面证据</strong>，所以短请求不必闪过 spinner，长任务也不能无限转圈。</>}>
    <ArticleSection id="loading-definition-section" title="先量等待，再选提示"><p id="loading-definition" className="vp-citation-target">100 毫秒左右的局部操作通常可以直接完成；当等待变得明显，才需要让用户看到结构仍在、任务仍在进行。<Cite id="loading-definition" sources={loadingStateSources} />这不是一张固定的组件清单，而是把提示和任务的时间、范围、可预测性对应起来。</p><p id="loading-timing" className="vp-citation-target">内容结构已知时，骨架能守住列表行和标题的位置；知道总量或完成比例时，进度条才有意义。<Cite id="loading-timing" sources={loadingStateSources} />下面把同一个请求从 100ms 拉到超时，读者只改一个条件，就能看见表现为什么换挡。</p><LoadingStateLesson /></ArticleSection>
    <ArticleSection id="loading-feedback-section" title="进度、占位和错误各自负责什么"><p id="loading-progress" className="vp-citation-target">占位是在说“内容会在这里出现”，进度是在说“任务已经走到这里”；两者都不能替结果本身。<Cite id="loading-progress" sources={loadingStateSources} />如果用户能取消长任务，取消应该和进度同处一个上下文，而不是藏在页面另一角。</p><p id="loading-failure" className="vp-citation-target">请求结束后必须落到内容、空结果或失败。<Cite id="loading-failure" sources={loadingStateSources} />失败时停止指示、保留可重试入口，远比让一个旋转图标替系统撒谎可靠。</p></ArticleSection>
    <ArticleSection id="loading-boundary-section" title="停止等待也是结果"><ArticleAside title="检查一次等待边界"><p>把网络调慢，分别观察按钮、局部内容和整页任务：哪一个状态在多少时间后出现？超过上限后，用户能否看见错误、保留输入并重新开始？如果答案只能从开发者工具里找，页面还没有完成等待设计。</p></ArticleAside></ArticleSection>
  </Article>;
}

const microSections: [string, string][] = [["micro-definition-section", "微交互不是一段装饰动画"], ["micro-states-section", "按下、请求中、成功和失败"], ["micro-feedback-section", "反馈留在动作旁边"]];
export function MicrointeractionTermPage() {
  return <Article slug="microinteraction" title="微交互" subtitle="Microinteraction · 让一个小动作有来有回" sources={microinteractionSources} sections={microSections} hero={<MicrointeractionMechanismHero />} intro={<>收藏、复制、开关这些动作很小，用户的疑问却很具体：刚才那一下有没有生效？<strong>微交互把触发、规则、局部反馈和持续状态绑在一起</strong>，让结果留在动作附近，不用靠一条突然出现的全局提示来猜。</>}>
    <ArticleSection id="micro-definition-section" title="微交互不是一段装饰动画"><p id="micro-definition" className="vp-citation-target">微交互围绕一个明确任务：用户触发某件事，系统按规则改变状态，并把反馈放回原位置。<Cite id="micro-definition" sources={microinteractionSources} />如果去掉运动后只剩一个无意义的闪烁，它本来就没有解释作用。</p><p id="micro-states" className="vp-citation-target">收藏按钮的按下、请求中、已收藏和失败撤回不是四个视觉皮肤，而是四个不同的事实。<Cite id="micro-states" sources={microinteractionSources} />演示里把失败拨回去，能看见“看起来成功”和“服务端确认”之间的距离。</p><MicrointeractionLesson /></ArticleSection>
    <ArticleSection id="micro-feedback-section" title="反馈留在动作旁边"><p id="micro-feedback" className="vp-citation-target">成功可以短暂强调图标并更新计数，失败则要回到可信数据并告诉用户怎样重试。<Cite id="micro-feedback" sources={microinteractionSources} />触觉、声音或动效都是附加通道，不能独自承担状态消息。</p><p id="micro-boundary" className="vp-citation-target">当动画被关闭或用户使用辅助技术时，按钮名称、计数和状态消息仍应完整。<Cite id="micro-boundary" sources={microinteractionSources} />“有动效”不是完成标准，“用户知道发生了什么”才是。</p><ArticleAside title="先写状态表，再决定动效"><p>先列出空闲、按下、处理中、成功、失败和撤销；每格写清可操作性、文案和可访问名称，最后才决定是否需要回弹、填充或轻微缩放。</p></ArticleAside></ArticleSection>
  </Article>;
}

const motionSections: [string, string][] = [["motion-definition-section", "减少的是不必要的运动"], ["motion-preference-section", "同一任务，两套运动预算"], ["motion-boundary-section", "状态和焦点不能一起消失"]];
export function ReducedMotionTermPage() {
  return <Article slug="reduced-motion" title="减少动态效果" subtitle="Reduced Motion · 换一种方式表达变化" sources={reducedMotionSources} sections={motionSections} hero={<ReducedMotionMechanismHero />} intro={<>页面可以用星点、缩放和视差制造空间感，但不是每个人都能舒适地承受这段运动。<strong>减少动态效果把用户偏好变成另一套表现预算</strong>：状态、焦点和完成反馈留下，大幅移动和不必要的连续运动退场。</>}>
    <ArticleSection id="motion-definition-section" title="减少的是不必要的运动"><p id="motion-definition" className="vp-citation-target">`prefers-reduced-motion` 让页面读取操作系统偏好；它表达的是“减少非必要运动”，不是“所有像素都不许变化”。<Cite id="motion-definition" sources={reducedMotionSources} />焦点移动、错误出现和完成状态仍要被看见，只是可以用原位淡入或稳定的颜色变化表达。</p><p id="motion-preference" className="vp-citation-target">同一页面切换在完整模式和减少动态模式下，最终标题、URL 和焦点应一致。<Cite id="motion-preference" sources={reducedMotionSources} />真正改变的是从起点到终点的路径：一条短轨迹变成原位出现。</p><ReducedMotionLesson /></ArticleSection>
    <ArticleSection id="motion-boundary-section" title="状态和焦点不能一起消失"><p id="motion-code" className="vp-citation-target">媒体查询可以关闭大幅位移、缩放、视差和循环，同时把过渡缩短或改成淡入。<Cite id="motion-code" sources={reducedMotionSources} />这应当落在组件的表现规则里，而不是只在说明文档里承诺。</p><p id="motion-boundary" className="vp-citation-target">如果“减少动态”让用户不知道页面是否切换成功，设计就删错了东西。<Cite id="motion-boundary" sources={reducedMotionSources} />稳定的文字、焦点和结果仍然是必要反馈。</p><ArticleAside title="用两种偏好走同一条任务"><p>关闭动画后重新完成一次页面切换、保存和错误恢复；检查标题、URL、焦点和状态文字是否仍按同样顺序出现。只要需要凭运动才能判断结果，就要补静态证据。</p></ArticleAside></ArticleSection>
  </Article>;
}

const clientSections: [string, string][] = [["client-definition-section", "客户端和服务器是一次交互里的角色"], ["client-envelope-section", "先看信封里的消息"], ["client-response-section", "响应可以成功，也可以带错误"]];
export function ClientServerTermPage() {
  return <Article slug="client-server" title="客户端—服务器" subtitle="Client–Server · 一次请求里的两种职责" sources={clientServerSources} sections={clientSections} hero={<SignatureHero kind="client" />} intro={<>浏览器打开商品页时，页面不是凭空出现的：一方把问题封进请求，另一方根据资源和规则处理，再把结果带回来。<strong>客户端和服务器是这轮交互的两种职责</strong>，不是永远贴在两台机器上的标签。</>}>
    <ArticleSection id="client-definition-section" title="客户端和服务器是一次交互里的角色"><p id="client-definition" className="vp-citation-target">客户端发起请求，服务器提供资源或执行操作；下一次连接里，同一个程序也可能承担相反角色。<Cite id="client-definition" sources={clientServerSources} />把它理解成“谁在问、谁在答”，比把浏览器和机房画成两台固定机器更准确。</p><p id="client-envelope" className="vp-citation-target">请求信封至少要带方法、目标路径和必要的头或正文，服务器拆开后才知道这趟交互要做什么。<Cite id="client-envelope" sources={clientServerSources} />下面的中心对象不是一根箭头，而是一只会换面的消息信封。</p><ClientServerLesson /></ArticleSection>
    <ArticleSection id="client-response-section" title="响应可以成功，也可以带错误"><p id="client-response" className="vp-citation-target">响应的状态码、头和正文一起告诉客户端发生了什么；200、404 和 500 不是服务器“有没有回话”的三种语气，而是不同结果。<Cite id="client-response" sources={clientServerSources} />客户端必须把这些结果翻译成内容、空状态或错误提示。</p><p id="client-roundtrip" className="vp-citation-target">Fetch 等浏览器接口把请求发送和响应读取分成两个阶段，网络往返、服务器处理和页面呈现不能压成一个瞬间。<Cite id="client-roundtrip" sources={clientServerSources} />看清阶段，才能知道问题卡在谁手里。</p><ArticleAside title="换一个角色再判断"><p>同一台服务器请求数据库时，它是客户端；浏览器请求它时，它是服务器。先写清当前谁发请求、谁提供资源，再讨论部署在哪台机器。</p></ArticleAside></ArticleSection>
  </Article>;
}

const deploySections: [string, string][] = [["deploy-artifact-section", "部署先固定一份可追踪制品"], ["deploy-gate-section", "车道上的每道闸门都有证据"], ["deploy-traffic-section", "流量切换要能回拨"]];
export function DeployTermPage() {
  return <Article slug="deploy" title="部署" subtitle="Deploy · 让一份版本安全接住流量" sources={deploySources} sections={deploySections} hero={<SignatureHero kind="deploy" />} intro={<>部署不是敲下命令后看到绿色勾就结束。<strong>它把可追踪提交变成一份固定制品，送进环境、接受真实检查，再逐步接住流量</strong>，同时让上一版仍然在回滚车道上。</>}>
    <ArticleSection id="deploy-artifact-section" title="部署先固定一份可追踪制品"><p id="deploy-artifact" className="vp-citation-target">构建阶段把提交、依赖和检查锁在一起，产出可被后续环境复用的制品。<Cite id="deploy-artifact" sources={deploySources} />staging 和 production 应该验证同一份东西，而不是每到一个环境就重新打包。</p><p id="deploy-immutability" className="vp-citation-target">如果制品在车道上被悄悄改过，前面的检查就失去了意义。<Cite id="deploy-immutability" sources={deploySources} />演示中的小方块代表版本身份，只有它沿车道移动，读者才会看到“部署的是谁”。</p><DeployLesson /></ArticleSection>
    <ArticleSection id="deploy-gate-section" title="车道上的每道闸门都有证据"><p id="deploy-gate" className="vp-citation-target">环境保护规则可以要求审批、健康检查或其他门禁；这些是流量切换的条件，不是部署完成的装饰。<Cite id="deploy-gate" sources={deploySources} />命令成功只说明某个动作执行了，不说明用户已经能用。</p><p id="deploy-traffic" className="vp-citation-target">金丝雀发布把少量流量先交给新版本，观察错误率和关键指标后再扩大范围。<Cite id="deploy-traffic" sources={deploySources} />流量拨盘改变的是风险暴露面，不是制品内容。</p></ArticleSection>
    <ArticleSection id="deploy-traffic-section" title="流量切换要能回拨"><p id="deploy-rollback" className="vp-citation-target">回滚需要上一份已验证制品、清楚的版本记录和可执行的切换路径。<Cite id="deploy-rollback" sources={deploySources} />只保存“上一次代码”而没有旧制品，往往还要重新构建，无法保证回到原来的状态。</p><ArticleAside title="发布前问三个问题"><p>现在生产流量指向哪份制品？健康检查通过后谁批准扩大流量？指标变差时能否直接指回上一份已验证制品？三问有证据，部署才从命令变成可控动作。</p></ArticleAside></ArticleSection>
  </Article>;
}

const flowSections: [string, string][] = [["flow-definition-section", "流程描述的是目标，不是页面清单"], ["flow-entry-section", "入口、反馈和分支要在同一张地图上"], ["flow-recovery-section", "失败之后仍然要回到任务"]];
export function UserFlowTermPage() {
  return <Article slug="user-flow" title="用户流程" subtitle="User Flow · 给任务画出可回来的路" sources={userFlowSources} sections={flowSections} hero={<UserFlowSignatureHero />} intro={<>用户要完成的是“找回账号”或“退回商品”，不是参观一串页面。<strong>用户流程把入口、动作、系统反馈、分支、恢复和结束状态接成一条可走、可回来的路</strong>，所以失败路径和成功路径一样值得画。</>}>
    <ArticleSection id="flow-definition-section" title="流程描述的是目标，不是页面清单"><p id="flow-definition" className="vp-citation-target">一张用户流程图应先写用户要完成的事情，再写每一步需要做什么、系统回应什么。<Cite id="flow-definition" sources={userFlowSources} />把“首页 → 列表 → 详情”当成流程，通常只记录了页面位置，没有记录任务是否真的完成。</p><p id="flow-entry" className="vp-citation-target">入口可能来自邮件、搜索结果或通知；同一个目标不必强迫所有人从首页开始。<Cite id="flow-entry" sources={userFlowSources} />演示从过期邮件进入，故意让地图出现回退，读者会看见入口和恢复怎样改变路径。</p><UserFlowLesson /></ArticleSection>
    <ArticleSection id="flow-recovery-section" title="失败之后仍然要回到任务"><p id="flow-recovery" className="vp-citation-target">过期、取消、输入不一致和缺少权限都应有明确的下一步，恢复动作要带着用户继续原来的目标。<Cite id="flow-recovery" sources={userFlowSources} />把失败藏起来只会让地图看起来漂亮，却让真实任务在半路消失。</p><p id="flow-context" className="vp-citation-target">经验地图和服务设计资料都强调把用户在系统外的前后情境一起看，而不只画某个页面里的点击。<Cite id="flow-context" sources={userFlowSources} />这也是为什么一个“重新发送链接”按钮可能比新增一页说明更有价值。</p><ArticleAside title="走一次最容易失败的路线"><p>挑一条真实任务，先从用户最可能出现的入口进入，再故意触发过期、返回和取消。每个分支都写下系统反馈和回到主目标的方式，不能只留下“请重试”。</p></ArticleAside></ArticleSection>
  </Article>;
}

const wireSections: [string, string][] = [["wireframe-structure-section", "线框先把结构从视觉里剥出来"], ["wireframe-content-section", "内容、分组和操作要一起占位"], ["wireframe-boundary-section", "低保真不替真实验证负责"]];
export function WireframeTermPage() {
  return <Article slug="wireframe" title="线框图" subtitle="Wireframe · 先让页面站得住" sources={wireframeSources} sections={wireSections} hero={<WireframeSignatureHero />} intro={<>线框图不是一张没上色的成品截图。<strong>它把内容、分组、层级和主要操作留在低细节的骨架里</strong>，让团队在字体和颜色还没抢走注意力之前，先讨论页面到底怎样组织。</>}>
    <ArticleSection id="wireframe-structure-section" title="线框先把结构从视觉里剥出来"><p id="wireframe-structure" className="vp-citation-target">框、文字和位置足以讨论信息关系：标题是否先出现，金额和条件是否被分到同一任务里，主要操作是否靠近判断完成的位置。<Cite id="wireframe-structure" sources={wireframeSources} />线框的价值正是把这些决定暴露出来，而不是提前用视觉效果掩盖。</p><p id="wireframe-content" className="vp-citation-target">内容不是最后才填的假文字；字段名称、最长标题和真实状态会改变结构。<Cite id="wireframe-content" sources={wireframeSources} />演示把内容、分组、层级和操作当成可以揭开的四层，帮助读者知道当前稿子能证明什么。</p><WireframeLesson /></ArticleSection>
    <ArticleSection id="wireframe-boundary-section" title="低保真不替真实验证负责"><p id="wireframe-boundary" className="vp-citation-target">线框无法单独证明真实文案长度、数据密度、响应式变化、动效和技术可行性。<Cite id="wireframe-boundary" sources={wireframeSources} />当这些问题成为本轮风险，就要把结构交给原型、代码或真实内容继续验证。</p><ArticleAside title="评审线框时先问结构问题"><p>遮住颜色和图片，只问三件事：用户先看到什么？相关内容是否在同一组？完成任务的操作在哪里？如果讨论很快滑向“这个颜色好不好看”，说明视觉稿来得太早。</p></ArticleAside></ArticleSection>
  </Article>;
}

const prototypeSections: [string, string][] = [["prototype-definition-section", "原型先限定要验证的假设"], ["prototype-task-section", "把真实任务交给可操作的假版本"], ["prototype-evidence-section", "观察改变下一轮，而不是宣布上线"]];
export function PrototypeTermPage() {
  return <Article slug="prototype" title="原型" subtitle="Prototype · 把猜测换成一次可观察的操作" sources={prototypeSources} sections={prototypeSections} hero={<PrototypeSignatureHero />} intro={<>原型不是“先做一个像成品的东西”。<strong>它只实现本轮要验证的行为，把一个假设交给真实任务，再把观察结果带回下一轮</strong>，从而用较小的成本发现理解断点。</>}>
    <ArticleSection id="prototype-definition-section" title="原型先限定要验证的假设"><p id="prototype-definition" className="vp-citation-target">可以用纸、页面、对话脚本或代码做原型，媒介取决于要观察的行为。<Cite id="prototype-definition" sources={prototypeSources} />先写“用户是否能找到邀请码”这类可观察的判断，再决定需要哪些页面和状态。</p><p id="prototype-task" className="vp-citation-target">原型只需覆盖完成目标所必需的入口、输入、错误和结果；账号验证、邮件发送和真实支付可以明确标成模拟。<Cite id="prototype-task" sources={prototypeSources} />下面每次推进一格，实验板上的对象会从假设变成证据，而不是从低保真换成高保真。</p><PrototypeLesson /></ArticleSection>
    <ArticleSection id="prototype-evidence-section" title="观察改变下一轮，而不是宣布上线"><p id="prototype-evidence" className="vp-citation-target">让参与者带着真实任务走，不要在任务里提示按钮名称；停顿、回看和错误路径都是本轮证据。<Cite id="prototype-evidence" sources={prototypeSources} />原型好不好看不等于任务是否被理解。</p><p id="prototype-decision" className="vp-citation-target">观察结果应该形成下一轮修改或停止的决定。<Cite id="prototype-decision" sources={prototypeSources} />即使三个人完成了任务，也不能据此证明性能、安全、数据一致性和完整技术方案。</p><ArticleAside title="给原型写一张边界卡"><p>卡片上写清：本轮假设、参与者任务、要观察的行为、哪些部分是假数据，以及什么证据会让你保留、修改或放弃这个方向。</p></ArticleAside></ArticleSection>
  </Article>;
}

const iaSections: [string, string][] = [["ia-zones-section", "信息架构是给任务分区"], ["ia-labels-section", "名称和搜索词是入口的一部分"], ["ia-boundary-section", "多入口不等于复制多份正文"]];
export function IaTermPage() {
  return <Article slug="ia" title="信息架构" subtitle="Information Architecture · 让内容有可预测的去处" sources={iaSources} sections={iaSections} hero={<IaSignatureHero />} intro={<>当用户说“我要换 API 密钥”时，他不一定知道团队把文章放在哪个菜单。<strong>信息架构用分类、命名、标签、搜索和交叉入口，帮人预测下一步去哪里找</strong>，而不是把组织结构原样搬进导航。</>}>
    <ArticleSection id="ia-zones-section" title="信息架构是给任务分区"><p id="ia-zones" className="vp-citation-target">整理内容前先盘点用户真实任务，再决定哪些内容属于同一片空间。<Cite id="ia-zones" sources={iaSources} />演示中的“API 密钥”先作为孤立卡片出现，随后进入领域区，再补出用户用任务语言进入的入口。</p><p id="ia-labels" className="vp-citation-target">菜单、目录、搜索、站点地图和页面标题共同告诉用户内容怎样被组织。<Cite id="ia-labels" sources={iaSources} />分类只解决“放在哪里”，命名还要解决“我会用什么词找它”。</p><IaLesson /></ArticleSection>
    <ArticleSection id="ia-boundary-section" title="多入口不等于复制多份正文"><p id="ia-search" className="vp-citation-target">同一篇文章可以从“账户安全”“连接服务”和搜索词进入，只维护一份正文，避免不同入口逐渐说出不同结论。<Cite id="ia-search" sources={iaSources} />交叉链接是关系的表达，不是重复内容的借口。</p><p id="ia-boundary" className="vp-citation-target">内部团队、技术栈和文件夹只是维护视角，不能替用户任务做唯一导航。<Cite id="ia-boundary" sources={iaSources} />如果一个页面长期孤零零地漂着，先问它服务哪个任务，再决定归属或删除。</p><ArticleAside title="用五个真实查找任务验收"><p>从客服记录、搜索日志或访谈里拿五个用户说法，逐个检查他们会先去哪里、会不会被标签拦住、是否能在不复制正文的情况下找到同一内容。</p></ArticleAside></ArticleSection>
  </Article>;
}

const a11ySections: [string, string][] = [["a11y-focus-section", "焦点是一条可见的路"], ["a11y-order-section", "键盘顺序和错误恢复要接得上"], ["a11y-boundary-section", "ARIA 不是自动补丁"]];
export function A11yTermPage() {
  return <Article slug="a11y" title="无障碍" subtitle="Accessibility · 让每个人都能走完任务" sources={a11ySources} sections={a11ySections} hero={<A11ySignatureHero />} intro={<>不用鼠标、看不到颜色或需要读屏时，用户仍然要能完成登录、发现错误并继续。<strong>无障碍把结构、键盘、焦点、标签、对比度和反馈串成可感知、可操作、可恢复的路径</strong>，不是发布前临时加几条 ARIA。</>}>
    <ArticleSection id="a11y-focus-section" title="焦点是一条可见的路"><p id="a11y-focus" className="vp-citation-target">键盘用户需要知道当前控件在哪里、下一步会到哪里；可见焦点和合理的 Tab 顺序把这条路画出来。<Cite id="a11y-focus" sources={a11ySources} />演示里的焦点环不是装饰，它随着任务从跳过链接走到字段和按钮。</p><p id="a11y-order" className="vp-citation-target">表单标签、必填状态和输入类型要让辅助技术拿到与视觉用户同样的关系。<Cite id="a11y-order" sources={a11ySources} />出现错误后，路径不能把人丢回页面开头，而应把焦点和提示带回问题处。</p><A11yLesson /></ArticleSection>
    <ArticleSection id="a11y-boundary-section" title="ARIA 不是自动补丁"><p id="a11y-error" className="vp-citation-target">错误需要指出字段并用文字说明修复方式，颜色可以补充但不能独自承担含义。<Cite id="a11y-error" sources={a11ySources} />成功、失败和状态变化也要通过可读的消息让辅助技术获得。</p><p id="a11y-button" className="vp-citation-target">给 div 加上 `role=button` 只做出语义承诺，不会自动提供焦点、Enter/Space 行为、按下状态和焦点去向。<Cite id="a11y-button" sources={a11ySources} />能用原生 button，就不要把浏览器已经做好的行为重新造一遍。</p><ArticleAside title="用键盘完成一次真实任务"><p>从进入页面开始只用 Tab、Shift+Tab、Enter 和 Space；记录无法到达、无法理解或无法恢复的节点，再用读屏视角核对名称、状态和错误。</p></ArticleAside></ArticleSection>
  </Article>;
}
