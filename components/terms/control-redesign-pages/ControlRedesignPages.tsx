import type { ReactNode } from "react";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import {
  arraySources,
  clientServerSources,
  conditionalBranchSources,
  distributedSystemSources,
  eventDrivenSources,
  loopSources,
  microservicesSources,
  monolithSources,
  objectSources,
  serverlessSources,
} from "@/lib/control-redesign-sources";
import {
  ArrayLesson,
  BranchLesson,
  ClientServerLesson,
  DistributedLesson,
  EventDrivenLesson,
  LoopLesson,
  MicroservicesLesson,
  MonolithLesson,
  ObjectLesson,
  ServerlessLesson,
} from "./ControlRedesignLessons";
import { ControlRedesignRuntime, type ControlHeroKind } from "./ControlRedesignRuntime";
import styles from "./ControlRedesignConcepts.module.css";

function HeroShell({ kind, label, children }: { kind: ControlHeroKind; label: string; children: ReactNode }) {
  return <ControlRedesignRuntime kind={kind} label={label}>{children}</ControlRedesignRuntime>;
}

function BranchHero() {
  return <HeroShell kind="branch" label="分数令牌先经过 score 大于等于 60 的阈值闸门，再只进入通过或未通过的一条路径"><div className={styles.branchHero}><div className={styles.branchInput}><span>输入</span><strong>score 60</strong></div><div className={styles.branchGate}><small>判断</small><b>&gt;= 60</b></div><div className={styles.branchPaths}><div className={styles.branchPath} data-active="true"><small>true</small><span>放行</span></div><div className={styles.branchPath}><small>false</small><span>留在门外</span></div><i className={styles.branchToken} aria-hidden="true" /></div><div className={styles.branchOutcome}><span>一次求值</span><strong>只走一条</strong></div></div></HeroShell>;
}

function LoopHero() {
  return <HeroShell kind="loop" label="索引沿着 2、4、6 的传送带推进，累计值更新，抵达长度后停止"><div className={styles.loopHero}><div className={styles.loopBelt}>{[2, 4, 6].map((value, index) => <span className={styles.loopCell} data-current={index === 1} key={value}>{value}</span>)}<i className={styles.loopCursor} aria-hidden="true" /></div><div className={styles.loopReadout}><span>index 1 / 3</span><strong>sum 6 · next</strong></div></div></HeroShell>;
}

function ObjectHero() {
  return <HeroShell kind="object" label="对象的键和值在抽屉里成对出现，修改 age 只点亮这一项"><div className={styles.objectHero}><div className={styles.objectCard}><small>record</small><code>{`{ name: "林",\n  age: 20 }`}</code></div><div className={styles.objectDrawer}><div className={styles.objectRow}><span>name</span><b>林</b></div><div className={styles.objectRow} data-hot="true"><span>age</span><b>21</b></div><div className={styles.objectPulse}>一个键 · 一个当前值</div></div></div></HeroShell>;
}

function ArrayHero() {
  return <HeroShell kind="array" label="X 插入索引 1 后，原来的 B 和 C 向右移动，索引随位置重写"><div className={styles.arrayHero}><div className={styles.arrayRail}>{["A", "X", "B", "C"].map((item, index) => <span className={styles.arrayCell} data-insert={item === "X"} key={item}>{item}<small>{index}</small></span>)}<i className={styles.arrayArrow} aria-hidden="true">→</i></div><div className={styles.arrayResult}><span>insert(1, X)</span><strong>B: 1 → 2</strong></div></div></HeroShell>;
}

function ClientHero() {
  return <HeroShell kind="client" label="客户端把 GET 请求装进信封，服务器拆开处理，再带着 200 状态封回响应"><div className={styles.clientHero}><div className={styles.clientRole}><small>发起</small><strong>CLIENT</strong><span>GET /profile</span></div><div className={styles.clientEnvelope}><span aria-hidden="true">↔</span><small>请求 / 响应</small></div><div className={styles.clientStatus}><small>返回</small><strong>200 OK</strong><span className={styles.clientSeal}>SERVER · body</span></div></div></HeroShell>;
}

function MonolithHero() {
  return <HeroShell kind="monolith" label="单体里的用户、订单、支付可以分模块，但支付改动仍要和整座应用一起发布"><div className={styles.monolithHero}><div><div className={styles.monolithBuilding}>{["用户", "订单", "支付"].map(item => <span className={styles.module} data-hot={item === "支付"} key={item}>{item}</span>)}</div><div className={styles.monolithBeam} /></div><div className={styles.monolithSeal}><strong>v2</strong><span>整包通过<br />一起换上</span></div></div></HeroShell>;
}

function MicroservicesHero() {
  return <HeroShell kind="microservices" label="订单、库存、支付各自运行；库存变慢时，订单停在处理中而不是拖垮整座应用"><div className={styles.microHero}>{[["订单", true], ["库存", false], ["支付", false]].map(([name, hot]) => <div className={styles.microPod} data-hot={hot} key={String(name)}><small>service</small><strong>{name}</strong>{name === "订单" && <span className={styles.microWire} aria-hidden="true" />}{name === "库存" && <span className={styles.microWait}>wait 2s</span>}</div>)}<div className={styles.microState}>库存超时 · 订单保留 processing</div></div></HeroShell>;
}

function DistributedHero() {
  return <HeroShell kind="distributed" label="A 与 B 从同一版本分叉，各自的时钟和写入先后不同，消息延迟让冲突暂时可见"><div className={styles.distributedHero}><div className={styles.distributedLane}><div className={styles.distributedClock}><span>A</span><strong>10:02.1</strong></div><small>v2a · 库存 7</small></div><div className={styles.distributedLane}><div className={styles.distributedClock}><span>B</span><strong>10:02.6</strong></div><small>v2b · 库存 6</small></div><div className={styles.distributedMsg}>500ms →</div><div className={styles.distributedConflict}><span>同一前身</span><strong>需要显式合并规则</strong></div></div></HeroShell>;
}

function EventHero() {
  return <HeroShell kind="events" label="OrderCreated E7 作为一份事实扇出给库存和邮件，重放时由幂等记录挡住重复副作用"><div className={styles.eventHero}><div className={styles.eventCore}><span>事件</span><strong>E7</strong></div><div className={styles.eventBranches}><div className={styles.eventConsumer}><span>库存 · 扣减</span><strong>1 次</strong></div><div className={styles.eventConsumer}><span>邮件 · 发送</span><strong>1 次</strong></div><div className={styles.eventStamp}>replay <strong>dedupe</strong></div></div></div></HeroShell>;
}

function ServerlessHero() {
  return <HeroShell kind="serverless" label="请求速率升高时，平台准备更多函数实例；第一份实例先付出冷启动时间"><div className={styles.serverlessHero}><div className={styles.serverlessTraffic}><small>traffic</small><strong>120/min</strong></div><div className={styles.serverlessTrack}>{["f1", "f2", "f3", "f4"].map(item => <span className={styles.serverlessInstance} key={item}>{item}</span>)}<span className={styles.serverlessCold}>cold<br />420ms</span></div><div className={styles.serverlessResult}><span>平台管运行环境</span><strong>按峰谷扩缩</strong></div></div></HeroShell>;
}

const branchSections: [string, string][] = [["branch-definition-section", "先求值，再让令牌选路"], ["branch-path-section", "一条路径被选中，另一条不会偷偷执行"], ["branch-boundary-section", "分支不是业务校验的替身"]];
export function ConditionalBranchTermPage() {
  return <Article slug="conditional-branch" title="条件分支" subtitle="Conditional Branch · 让程序在岔路口做一次判断" sources={conditionalBranchSources} sections={branchSections} hero={<BranchHero />} intro={<>程序遇到不同输入时，不必把所有动作都做一遍。<strong>条件分支先计算一个真假结果，再把执行令牌送进匹配的路径</strong>；阈值、比较和边界值决定它在哪条路上继续。</>}>
    <ArticleSection id="branch-definition-section" title="先求值，再让令牌选路"><p id="branch-definition" className="vp-citation-target">`if` 会先求条件表达式；结果为真时执行关联代码，否则转向 `else` 或继续后面的语句。<Cite id="branch-definition" sources={conditionalBranchSources} />判断本身和被选择的动作是两个阶段，首图把令牌停在闸门前。</p><p id="branch-evaluate" className="vp-citation-target">`score &gt;= 60` 的 `=` 让 60 也通过，改成 `&gt; 60` 就会把边界值留在另一侧。<Cite id="branch-evaluate" sources={conditionalBranchSources} />读分支时，先问条件怎样算，再问哪个块会执行。</p><BranchLesson /></ArticleSection>
    <ArticleSection id="branch-path-section" title="一条路径被选中，另一条不会偷偷执行"><p id="branch-path" className="vp-citation-target">互斥的 `if...else` 结构在一次到达中只选择一条分支；多个独立的 `if` 则可能连续命中。<Cite id="branch-path" sources={conditionalBranchSources} />这就是为什么“有两个条件为真”不必然等于“只做一次动作”。</p><ArticleAside title="拿一个边界值试走"><p>把输入从 59 拨到 60，再拨到 61，逐次记录条件结果和实际动作。不要只看按钮颜色，要确认另一条路径没有修改状态。</p></ArticleAside></ArticleSection>
    <ArticleSection id="branch-boundary-section" title="分支不是业务校验的替身"><p id="branch-boundary" className="vp-citation-target">条件分支只决定当前代码走哪条路；身份认证、权限判断和输入校验仍要在可信边界上独立完成。<Cite id="branch-boundary" sources={conditionalBranchSources} />把“显示通过”当成“服务器接受”会留下安全漏洞。</p></ArticleSection>
  </Article>;
}

const loopSections: [string, string][] = [["loop-definition-section", "循环是重复执行，不是无限播放"], ["loop-progress-section", "每一轮都要改变状态"], ["loop-boundary-section", "停止条件和处理次数要分开"]];
export function LoopTermPage() {
  return <Article slug="loop" title="循环" subtitle="Loop · 把同一动作交给一串输入" sources={loopSources} sections={loopSections} hero={<LoopHero />} intro={<>循环把“对每个元素做同一件事”写成一段可重复的执行。<strong>它需要当前状态、下一步推进和明确的停止条件</strong>；没有出口的循环不是更努力，而是把程序困在传送带上。</>}>
    <ArticleSection id="loop-definition-section" title="循环是重复执行，不是无限播放"><p id="loop-definition" className="vp-citation-target">`for`、`while` 等迭代语句会反复执行主体，直到遍历完输入或条件不再成立。<Cite id="loop-definition" sources={loopSources} />首图里的索引、累计值和出口同时出现，是为了让“重复”有可观察的进度。</p><p id="loop-progress" className="vp-citation-target">数组有三项时，索引从 0 走到 3，累计值依次经过 2、6、12；下一轮必须读到新的位置。<Cite id="loop-progress" sources={loopSources} />把索引冻结，读者会看到循环为什么不能只靠一句“再来一次”。</p><LoopLesson /></ArticleSection>
    <ArticleSection id="loop-progress-section" title="每一轮都要改变状态"><p id="loop-step" className="vp-citation-target">`while` 的条件会在每轮前重新判断；主体如果没有改变条件依赖的状态，就可能永远满足。<Cite id="loop-step" sources={loopSources} />重试、轮询和分页也要把等待或游标推进写进状态。</p><ArticleAside title="找循环的出口"><p>标出进入条件、每轮改变的变量、输入耗尽或超时的位置；再问如果网络一直不回，谁来让它停下。</p></ArticleAside></ArticleSection>
    <ArticleSection id="loop-boundary-section" title="停止条件和处理次数要分开"><p id="loop-boundary" className="vp-citation-target">停止条件控制执行何时结束，不能保证主体每次都成功，也不能替代超时、取消和错误处理。<Cite id="loop-boundary" sources={loopSources} />循环跑完只说明出口成立，不等于业务结果全部正确。</p></ArticleSection>
  </Article>;
}

const objectSections: [string, string][] = [["object-definition-section", "对象用键把值收在一起"], ["object-mutate-section", "改的是某个属性的当前值"], ["object-boundary-section", "对象不是 JSON 字符串"]];
export function ObjectTermPage() {
  return <Article slug="object" title="对象" subtitle="Object · 用名字找到一组相关状态" sources={objectSources} sections={objectSections} hero={<ObjectHero />} intro={<>当一条记录同时有姓名、年龄和城市时，位置不够表达意义。<strong>对象把键和值放进同一个可寻址的状态集合</strong>，读者可以按 `age` 找到当前值，也可以只替换这一格。</>}>
    <ArticleSection id="object-definition-section" title="对象用键把值收在一起"><p id="object-definition" className="vp-citation-target">对象是属性集合，属性名把程序带到对应的值；值可以是数字、文本、数组，甚至另一个对象。<Cite id="object-definition" sources={objectSources} />抽屉里的键是入口，值是此刻存放的内容。</p><p id="object-mutate" className="vp-citation-target">给 `record.age` 赋新值会改变这个属性当前指向的状态；新增和删除属性也会改变集合的形状。<Cite id="object-mutate" sources={objectSources} />这和把整段对象序列化成文本是两件事。</p><ObjectLesson /></ArticleSection>
    <ArticleSection id="object-mutate-section" title="改的是某个属性的当前值"><p id="object-read" className="vp-citation-target">读取不存在的键、继承属性和可变引用的结果取决于语言规则；写代码时要明确是否允许缺省值和原地修改。<Cite id="object-read" sources={objectSources} />首图只点亮 age，提醒读者改动有归属。</p><ArticleAside title="沿着一条键查状态"><p>从对象名开始写出 `record.age`，再记录这个值被谁读、谁改、何时失效；如果多个地方共享同一对象，先画出引用关系。</p></ArticleAside></ArticleSection>
    <ArticleSection id="object-boundary-section" title="对象不是 JSON 字符串"><p id="object-boundary" className="vp-citation-target">JSON 规定了对象和数组的文本表示，但不包含函数、原型、引用身份等运行时语义。<Cite id="object-boundary" sources={objectSources} />能被 `JSON.stringify` 写出，不代表还原后仍是同一个对象。</p></ArticleSection>
  </Article>;
}

const arraySections: [string, string][] = [["array-definition-section", "数组把顺序变成可访问的索引"], ["array-insert-section", "插入会让后面的格子换编号"], ["array-boundary-section", "索引顺序不是业务身份"]];
export function ArrayTermPage() {
  return <Article slug="array" title="数组" subtitle="Array · 按顺序收纳一串值" sources={arraySources} sections={arraySections} hero={<ArrayHero />} intro={<>数组适合装一串有顺序的数据：购物车、步骤、搜索结果都可以从索引开始读。<strong>它的核心变化不是卡片变多，而是插入、删除后位置和索引一起重新排列</strong>。</>}>
    <ArticleSection id="array-definition-section" title="数组把顺序变成可访问的索引"><p id="array-definition" className="vp-citation-target">数组是带索引的有序集合，程序可以用位置访问元素，也可以遍历它的长度。<Cite id="array-definition" sources={arraySources} />首图把 A、B、C 放在一条轨道上，索引写在每个格子脚下。</p><p id="array-insert" className="vp-citation-target">在索引 1 插入 X 后，原来的 B、C 必须向右移动；它们的值没变，位置变了。<Cite id="array-insert" sources={arraySources} />`insert` 是一次结构变化，不是把 X 覆盖到旧格子上。</p><ArrayLesson /></ArticleSection>
    <ArticleSection id="array-insert-section" title="插入会让后面的格子换编号"><p id="array-shift" className="vp-citation-target">不同语言的插入成本和可变性不同，但“后续元素的位置可能变化”是使用索引时必须面对的事实。<Cite id="array-shift" sources={arraySources} />如果另一个系统把索引当订单身份，插入就会造成错误关联。</p><ArticleAside title="换一种数据结构再判断"><p>如果你经常按名字查找、删除中间项或保持唯一性，先问对象、集合或数据库表是否更合适。数组只承诺顺序和位置访问。</p></ArticleAside></ArticleSection>
    <ArticleSection id="array-boundary-section" title="索引顺序不是业务身份"><p id="array-boundary" className="vp-citation-target">JSON 数组只表达有序值，不提供稳定的业务键；传输和重排时需要额外字段保留身份。<Cite id="array-boundary" sources={arraySources} />看到第 2 格时，先问它代表谁，再问它现在排第几。</p></ArticleSection>
  </Article>;
}

const clientSections: [string, string][] = [["client-definition-section", "客户端和服务器是一次交互里的角色"], ["client-envelope-section", "请求信封里装着方法和目标"], ["client-response-section", "状态码把结果带回来"]];
export function ControlClientServerTermPage() {
  return <Article slug="client-server" title="客户端—服务器" subtitle="Client–Server · 一次请求里的两种职责" sources={clientServerSources} sections={clientSections} hero={<ClientHero />} intro={<>浏览器打开个人页时，页面不是凭空出现的：一方把问题封进请求，另一方按资源和规则处理，再把结果带回来。<strong>客户端和服务器是这轮交互里的职责</strong>，不必永远绑定成两台固定机器。</>}>
    <ArticleSection id="client-definition-section" title="客户端和服务器是一次交互里的角色"><p id="client-definition" className="vp-citation-target">客户端发起请求，服务器提供资源或执行操作；同一个程序在下一轮连接里也可能承担相反角色。<Cite id="client-definition" sources={clientServerSources} />先问谁在发消息、谁在当前交互里负责回应。</p><p id="client-envelope" className="vp-citation-target">HTTP 消息由起始行、头字段和可选内容组成，服务器拆开后才知道目标、方法和上下文。<Cite id="client-envelope" sources={clientServerSources} />首图中的信封是会换面的消息，不是一根永远向右的箭头。</p><ClientServerLesson /></ArticleSection>
    <ArticleSection id="client-response-section" title="状态码把结果带回来"><p id="client-status" className="vp-citation-target">响应的状态码、头和内容共同说明发生了什么；200、404、500 分别指向成功、资源不存在和服务器错误等不同处理。<Cite id="client-status" sources={clientServerSources} />客户端必须把状态翻译成页面结果。</p><p id="client-roundtrip" className="vp-citation-target">Fetch 把发送请求和读取响应分成阶段，网络往返、服务器处理和呈现并不是同一个瞬间。<Cite id="client-roundtrip" sources={clientServerSources} />看清阶段，才能定位问题卡在谁手里。</p><ArticleAside title="换一个角色再判断"><p>服务器请求数据库时，它在这轮是客户端；浏览器请求它时，它是服务器。把当前交互画出来，比背固定设备名称更准确。</p></ArticleAside></ArticleSection>
  </Article>;
}

const monolithSections: [string, string][] = [["monolith-definition-section", "模块可以分开，运行单元仍是一整包"], ["monolith-release-section", "局部改动会穿过整包发布闸门"], ["monolith-boundary-section", "单体不等于没有内部边界"]];
export function MonolithTermPage() {
  return <Article slug="monolith" title="单体架构" subtitle="Monolith · 一起运行、一起发布的一座应用" sources={monolithSources} sections={monolithSections} hero={<MonolithHero />} intro={<>“单体”说的是运行和部署边界，不是代码必须挤成一团。<strong>用户、订单、支付可以在内部分模块，但它们通常作为一个应用进程或制品一起交付</strong>，所以一处变更会经过整包闸门。</>}>
    <ArticleSection id="monolith-definition-section" title="模块可以分开，运行单元仍是一整包"><p id="monolith-definition" className="vp-citation-target">单体应用把多个业务能力放在一个可部署单元里；内部仍可以有清楚的模块、接口和数据边界。<Cite id="monolith-definition" sources={monolithSources} />不要用“文件夹很多”直接推断架构边界。</p><p id="monolith-release" className="vp-citation-target">支付模块改动后，构建、测试和发布通常仍针对包含用户、订单和支付的整包制品。<Cite id="monolith-release" sources={monolithSources} />首图让支付变亮，再让整座楼盖上 v2 封印。</p><MonolithLesson /></ArticleSection>
    <ArticleSection id="monolith-release-section" title="局部改动会穿过整包发布闸门"><p id="monolith-tradeoff" className="vp-citation-target">单体减少了跨服务网络调用和分布式协作成本，但规模变大后构建、发布和故障影响面也可能变重。<Cite id="monolith-tradeoff" sources={monolithSources} />这是取舍，不是“单体一定落后”。</p><ArticleAside title="先画部署边界"><p>把代码模块、进程、容器和发布制品分别列出来；如果四条线重合，才有证据说它是一次整包交付。</p></ArticleAside></ArticleSection>
    <ArticleSection id="monolith-boundary-section" title="单体不等于没有内部边界"><p>模块化单体可以先把依赖、事务和所有权理清，再决定是否拆成服务。为了追逐架构名词提前拆分，常常只是把函数调用换成网络故障。</p></ArticleSection>
  </Article>;
}

const microSections: [string, string][] = [["micro-definition-section", "服务舱各自拥有交付边界"], ["micro-failure-section", "网络把调用变成等待和失败"], ["micro-tradeoff-section", "独立伸缩换来协作成本"]];
export function MicroservicesTermPage() {
  return <Article slug="microservices" title="微服务" subtitle="Microservices · 让服务按能力独立交付" sources={microservicesSources} sections={microSections} hero={<MicroservicesHero />} intro={<>微服务不是把单体切成几张卡片。<strong>它让相对独立的业务能力拥有自己的进程、交付和故障边界</strong>，服务之间因此要通过网络协作，也必须承受延迟、超时和版本差异。</>}>
    <ArticleSection id="micro-definition-section" title="服务舱各自拥有交付边界"><p id="micro-definition" className="vp-citation-target">微服务架构把应用拆成围绕业务能力的小型服务，服务通常可以独立开发、部署和扩缩。<Cite id="micro-definition" sources={microservicesSources} />首图里的订单、库存、支付都有自己的舱门。</p><p id="micro-failure" className="vp-citation-target">订单调用库存时，连接失败或响应变慢会让订单进入等待；它不能假设远端函数像同一进程里的函数一样可靠。<Cite id="micro-failure" sources={microservicesSources} />动画停在 processing，提醒读者故障边界会沿调用链传递。</p><MicroservicesLesson /></ArticleSection>
    <ArticleSection id="micro-failure-section" title="网络把调用变成等待和失败"><p id="micro-tradeoff" className="vp-citation-target">服务拆分带来独立发布和局部伸缩，也引入发现、认证、观测、数据一致性和故障恢复成本。<Cite id="micro-tradeoff" sources={microservicesSources} />服务数量不是架构成熟度的计数器。</p><ArticleAside title="给一次远程调用补上边界"><p>写清超时、重试、幂等、降级和最终用户看到的状态；如果只有“调用失败”，运维和读者都不知道下一步。</p></ArticleAside></ArticleSection>
    <ArticleSection id="micro-tradeoff-section" title="独立伸缩换来协作成本"><p>当订单和支付的流量形状不同，独立伸缩很有价值；当它们必须强事务地一起改变，拆分可能把简单约束变成分布式协议。先看业务边界，再看服务边界。</p></ArticleSection>
  </Article>;
}

const distributedSections: [string, string][] = [["distributed-definition-section", "多台机器没有一只共同的钟"], ["distributed-delay-section", "延迟让先后顺序变成问题"], ["distributed-boundary-section", "一致性需要写出规则"]];
export function DistributedSystemTermPage() {
  return <Article slug="distributed-system" title="分布式系统" subtitle="Distributed System · 在多台机器之间共同完成一件事" sources={distributedSystemSources} sections={distributedSections} hero={<DistributedHero />} intro={<>当任务跨过多个进程和机器，程序不再共享同一片内存、时钟和故障边界。<strong>分布式系统要用消息、版本和协议协调多个局部视角</strong>，所以“我先写了”不一定等于“大家都先看见了”。</>}>
    <ArticleSection id="distributed-definition-section" title="多台机器没有一只共同的钟"><p id="distributed-definition" className="vp-citation-target">分布式系统由通过通信协作的独立计算实体组成；每个节点只能从消息推断其他节点的状态。<Cite id="distributed-definition" sources={distributedSystemSources} />首图把 A、B 的本地时钟和版本分开摆出来。</p><p id="distributed-delay" className="vp-citation-target">Lamport 的逻辑时钟用因果关系描述事件先后，而不是假设所有机器拥有完美同步的物理时间。<Cite id="distributed-delay" sources={distributedSystemSources} />500ms 的消息抵达前，两个节点可能都已经写出自己的后继版本。</p><DistributedLesson /></ArticleSection>
    <ArticleSection id="distributed-delay-section" title="延迟让先后顺序变成问题"><p id="distributed-order" className="vp-citation-target">消息延迟、乱序和节点故障会让不同节点看到不同的事件前缀；系统需要版本向量、领导者、仲裁或其他协议来表达可接受的顺序。<Cite id="distributed-order" sources={distributedSystemSources} />没有协议的“最后写入获胜”只是一个隐藏选择。</p><ArticleAside title="先说冲突怎么收束"><p>写出两个节点各自做了什么，再说明谁有权裁决、是否允许合并、用户是否需要重新确认。只写“最终一致”不足以描述读者会看到的中间状态。</p></ArticleAside></ArticleSection>
    <ArticleSection id="distributed-boundary-section" title="一致性需要写出规则"><p>分布式系统的边界不是“用了云”或“有两台服务器”。关键是哪些状态被谁拥有、哪些消息可以延迟、出现分叉时怎样恢复；把规则写出来，系统才有可验证的行为。</p></ArticleSection>
  </Article>;
}

const eventSections: [string, string][] = [["event-definition-section", "事件描述已经发生的事实"], ["event-fanout-section", "一份事实可以扇出给多个消费者"], ["event-idempotency-section", "重放不是再做一次副作用"]];
export function EventDrivenArchitectureTermPage() {
  return <Article slug="event-driven-architecture" title="事件驱动架构" subtitle="Event-Driven Architecture · 让事实沿订阅关系扩散" sources={eventDrivenSources} sections={eventSections} hero={<EventHero />} intro={<>订单创建后，库存、邮件和分析都可能要行动。<strong>事件驱动架构先记录一个已经发生的事实，再让多个消费者按自己的节奏订阅</strong>，生产者不必把所有后续动作写成一条同步长链。</>}>
    <ArticleSection id="event-definition-section" title="事件描述已经发生的事实"><p id="event-definition" className="vp-citation-target">事件是对过去发生事情的记录，通常带有类型、时间、来源和唯一 id。<Cite id="event-definition" sources={eventDrivenSources} />`OrderCreated E7` 不是“请库存扣减”的命令，而是“订单已经创建”的事实。</p><p id="event-fanout" className="vp-citation-target">同一事件可以被库存和邮件消费者分别读取，各自完成自己的副作用。<Cite id="event-fanout" sources={eventDrivenSources} />首图的两条支路不是流程图的装饰，而是订阅关系。</p><EventDrivenLesson /></ArticleSection>
    <ArticleSection id="event-fanout-section" title="一份事实可以扇出给多个消费者"><p id="event-tradeoff" className="vp-citation-target">消费者解耦了生产者和后续能力，但也带来投递延迟、重复、乱序和观察困难。<Cite id="event-tradeoff" sources={eventDrivenSources} />如果用户必须立刻得到同步结果，就要明确哪一段仍需要请求—响应。</p><ArticleAside title="把命令和事件分开写"><p>命令是在请求别人做事，事件是在告诉别人事情已经发生。先看消息能否被重复消费、是否允许晚到，再选择命名和处理方式。</p></ArticleAside></ArticleSection>
    <ArticleSection id="event-idempotency-section" title="重放不是再做一次副作用"><p id="event-idempotency" className="vp-citation-target">消息系统可能投递同一事件多次；消费者应使用事件 id、业务唯一键或去重记录，让重放只恢复状态而不重复扣款或发信。<Cite id="event-idempotency" sources={eventDrivenSources} />演示第二次发布 E7 时，计数仍停在一次。</p></ArticleSection>
  </Article>;
}

const serverlessSections: [string, string][] = [["serverless-definition-section", "平台接管机器的准备和回收"], ["serverless-scale-section", "请求峰值会换来更多实例"], ["serverless-boundary-section", "无服务器不等于没有服务器"]];
export function ServerlessTermPage() {
  return <Article slug="serverless" title="无服务器计算" subtitle="Serverless · 按请求使用运行环境" sources={serverlessSources} sections={serverlessSections} hero={<ServerlessHero />} intro={<>“无服务器”不是代码漂浮在空中。<strong>它把实例准备、扩缩和部分运维交给平台，团队按请求触发函数或服务</strong>；冷启动、状态保存、权限和成本仍然要由设计者负责。</>}>
    <ArticleSection id="serverless-definition-section" title="平台接管机器的准备和回收"><p id="serverless-definition" className="vp-citation-target">Serverless 让团队不必为每个请求手工管理服务器容量，平台负责调度运行环境和按使用量计费。<Cite id="serverless-definition" sources={serverlessSources} />应用仍在真实机器上执行，只是基础设施控制面被移交了。</p><p id="serverless-cold" className="vp-citation-target">一段时间没有请求后，平台可能需要准备新的运行环境；这次冷启动会把初始化时间加到首个请求上。<Cite id="serverless-cold" sources={serverlessSources} />首图只给第一份实例标出 420ms，避免把每次调用都画成冷启动。</p><ServerlessLesson /></ArticleSection>
    <ArticleSection id="serverless-scale-section" title="请求峰值会换来更多实例"><p id="serverless-scale" className="vp-citation-target">事件触发和请求速率上升时，平台可以并行准备多个实例；实例之间不应默认共享内存或本地文件。<Cite id="serverless-scale" sources={serverlessSources} />流量拨盘改变的是并发运行环境数，不是业务状态的唯一来源。</p><ArticleAside title="把状态搬到正确的地方"><p>函数可以短暂读写本地临时目录，但跨请求需要数据库、对象存储或队列等明确的持久化边界；先写清谁拥有状态，再谈自动扩缩。</p></ArticleAside></ArticleSection>
    <ArticleSection id="serverless-boundary-section" title="无服务器不等于没有服务器"><p id="serverless-tradeoff" className="vp-citation-target">平台托管减少了容量管理，却不能消除冷启动、限额、权限、可观测性和成本波动。<Cite id="serverless-tradeoff" sources={serverlessSources} />“不用 SSH”只是操作方式变化，不是可靠性责任消失。</p></ArticleSection>
  </Article>;
}
