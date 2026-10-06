import type { ReactNode } from "react";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import {
  containerImageSources,
  containerSources,
  dependencyScanningSources,
  evaluationDatasetSources,
  observabilitySources,
  sastSources,
  secretScanningSources,
  serviceDiscoverySources,
  threatModelingSources,
  toolApprovalSources,
} from "@/lib/infrastructure-redesign-sources";
import {
  ApprovalLesson,
  ContainerLesson,
  DatasetLesson,
  DependencyLesson,
  DiscoveryLesson,
  ImageLesson,
  ObservabilityLesson,
  SastLesson,
  SecretLesson,
  ThreatLesson,
} from "./InfrastructureLessons";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./ControlRedesignConcepts.module.css";

function HeroShell({ kind, label, children }: { kind: Parameters<typeof ControlRedesignRuntime>[0]["kind"]; label: string; children: ReactNode }) {
  return <ControlRedesignRuntime kind={kind} label={label}>{children}</ControlRedesignRuntime>;
}

function ContainerHero() {
  return <HeroShell kind="container" label="两个容器看到不同文件视图，却共享同一个宿主机内核"><div className={styles.containerHero}><div className={styles.kernelBand}><span>宿主机</span><strong>kernel · shared</strong><span>CPU 70 / 30</span></div><div className={styles.containerWindows}><div className={styles.containerWindow}><small>container A</small><strong>/app · /config</strong><span className={styles.containerDenied}>/host/secrets → denied</span></div><div className={styles.containerWindow}><small>container B</small><strong>/app · /data</strong><span className={styles.containerDenied}>自己的文件视图</span></div></div></div></HeroShell>;
}

function ImageHero() {
  return <HeroShell kind="image" label="镜像层保持只读，只有容器 B 的可写层记录临时变化"><div className={styles.imageHero}><div className={styles.imageStack}><div className={styles.imageLayer}>base · 80 MB</div><div className={styles.imageLayer}>app · 12 MB</div><div className={styles.imageDigest}>image@sha256:demo… · 92 MB</div></div><div className={styles.imageInstances}><div className={styles.imageInstance}>A · read-only</div><div className={styles.imageInstance} data-hot="true">B · +2 MB</div><div className={styles.imageInstance}>C · read-only</div></div></div></HeroShell>;
}

function DiscoveryHero() {
  return <HeroShell kind="discovery" label="注册表记录 orders 的当前端点，B 心跳超时后先进入 TTL 过渡"><div className={styles.discoveryHero}><div className={styles.registryRing}>orders<br />registry</div><div className={styles.endpointList}><div className={styles.endpointRow}><span>10.0.0.2</span><strong>healthy</strong></div><div className={styles.endpointRow} data-stale="true"><span>10.0.0.3</span><strong>TTL</strong></div><div className={styles.endpointRow}><span>10.0.0.4</span><strong>new</strong></div><div className={styles.discoveryCache}>调用方缓存：<strong>等待刷新</strong></div></div></div></HeroShell>;
}

function ObservabilityHero() {
  return <HeroShell kind="observability" label="指标、追踪和日志沿同一 trace-7 汇合，把慢请求缩小到 payment 跨度"><div className={styles.observabilityHero}><div className={styles.signalBraid}><div className={styles.signalStrip}><span>metrics</span><strong>p95 2.4s</strong><em>范围</em></div><div className={styles.signalStrip}><span>trace</span><strong>payment 1.8s</strong><em>跨度</em></div><div className={styles.signalStrip}><span>logs</span><strong>index=missing</strong><em>原因</em></div></div><div className={styles.traceTarget}><small>trace</small><strong>7</strong><small>linked</small></div></div></HeroShell>;
}

function SastHero() {
  return <HeroShell kind="sast" label="不可信查询参数沿代码数据流抵达 db.query，参数化后这条静态路径被切断"><div className={styles.sastHero}><div className={styles.codePath}><div className={styles.codeLine} data-hot="true">source · request.query</div><div className={styles.codeLine}>parse → buildQuery</div><div className={styles.codeLine} data-hot="true">sink · db.query</div></div><div className={styles.sastFinding}><span>line 42</span><strong>HIGH</strong><small>tainted path</small></div></div></HeroShell>;
}

function SecretHero() {
  return <HeroShell kind="secret" label="扫描器在当前树和提交历史中找到同一枚密钥，状态必须从 active 变成 revoked"><div className={styles.secretHero}><div className={styles.commitRail}><div className={styles.commitNode}>HEAD · config.ts <strong>hit</strong></div><div className={styles.commitNode} data-hit="true">a17 · .env.example <strong>hit</strong></div><div className={styles.commitNode}>8c2 · deploy.sh <strong>history</strong></div></div><div className={styles.secretState}><small>credential</small><strong>active → revoked</strong><span>rotate + audit</span></div></div></HeroShell>;
}

function DependencyHero() {
  return <HeroShell kind="dependency" label="锁文件沿 app 到 A 再到 B@2.1.0 的路径命中公告，升级后红点消失但仍要回归"><div className={styles.dependencyHero}><div className={styles.dependencyTree}><div className={styles.dependencyNode}>app → A</div><div className={styles.dependencyNode} data-alert="true">└ B@2.1.0</div><div className={styles.dependencyNode}>  └ advisory · B &lt; 2.3.0</div></div><div className={styles.dependencyResult}><span>scan</span><strong>1 alert</strong><small>upgrade → 2.3.2</small></div></div></HeroShell>;
}

function ThreatHero() {
  return <HeroShell kind="threat" label="短信供应商越过内部信任边界后，数据流和威胁清单都需要重新计算"><div className={styles.threatHero}><div className={styles.threatMap}><div className={styles.threatNode}>浏览器</div><div className={styles.threatNode}>登录 API</div><div className={styles.threatNode}>用户库</div><div className={styles.threatNode} data-external="true">短信服务</div><div className={styles.threatFence} aria-hidden="true" /></div><div className={styles.threatRisk}><span>新增攻击面</span><strong>3 → 5</strong><small>签名校验后<br />高风险 2 → 1</small></div></div></HeroShell>;
}

function ApprovalHero() {
  return <HeroShell kind="approval" label="删除 A、B、C 的调用先停在审批卡，执行器只收到授权的 A 和 B"><div className={styles.approvalHero}><div className={styles.approvalRows}><div className={styles.approvalRow}><span>日志 A · 可恢复</span><strong>批准</strong></div><div className={styles.approvalRow}><span>缓存 B · 可恢复</span><strong>批准</strong></div><div className={styles.approvalRow} data-rejected="true"><span>报告 C · 不可恢复</span><strong>拒绝</strong></div></div><div className={styles.approvalGate}><small>HITL</small><strong>2 / 3</strong><small>执行</small></div></div></HeroShell>;
}

function DatasetHero() {
  return <HeroShell kind="dataset" label="按工单整组切分能挡住同一背景泄漏，但仍要检查留出区覆盖了哪些失败类型"><div className={styles.datasetHero}><div className={styles.datasetBuckets}><div className={styles.datasetBucket}><span>开发</span><strong>A · B</strong><small>20 条</small></div><div className={styles.datasetBucket}><span>留出</span><strong>C 整组</strong><small>2 条</small></div><div className={styles.datasetBucket}><span>版本</span><strong>v2</strong><small>27 条</small></div></div><div className={styles.datasetWarning}><small>overlap</small><strong>0</strong><small>group split</small></div></div></HeroShell>;
}

const containerSections: [string, string][] = [["container-definition-section", "容器先是一个隔离进程"], ["container-view-section", "隔离的是视图，不是另一套内核"], ["container-boundary-section", "权限和数据要另行设计"]];
export function ContainerTermPage() {
  return <Article slug="container" title="容器" subtitle="Container · 把应用放进隔离的运行视图" sources={containerSources} sections={containerSections} hero={<ContainerHero />} intro={<>“在我电脑上能跑”经常不是代码本身的问题，而是程序看到的文件、网络和资源不同。<strong>容器把一个进程放进自己的视图</strong>，让它携带需要的文件运行；它通常仍和宿主机共享内核。</>}>
    <ArticleSection id="container-definition-section" title="容器先是一个隔离进程"><p id="container-definition" className="vp-citation-target">容器运行的是普通应用进程，只是运行时为它准备了隔离的文件系统、网络命名空间和资源视图。<Cite id="container-definition" sources={containerSources} />首图把两个进程放在同一条内核带上，是为了分开“应用视图”和“操作系统内核”。</p><p id="container-view" className="vp-citation-target">A 能读到自己的 `/app`，并不表示它能读宿主机所有路径；挂载什么、能访问什么，由启动参数和权限决定。<Cite id="container-view" sources={containerSources} />把路径写出来，比说“它被隔离了”更能解释实际结果。</p><ContainerLesson /></ArticleSection>
    <ArticleSection id="container-view-section" title="隔离的是视图，不是另一套内核"><p id="container-kernel" className="vp-citation-target">容器通常共享宿主机内核，虚拟机则启动自己的完整操作系统和内核。<Cite id="container-kernel" sources={containerSources} />所以容器启动快、占用小，但隔离强度不能凭“容器”这个词自动推断。</p><p id="container-resource" className="vp-citation-target">CPU、内存、网络和文件挂载都可以成为容器的边界；不设限制时，一个进程可能抢占过多资源。<Cite id="container-resource" sources={containerSources} />实验里把 CPU 写成 70/30，只是让资源边界可见。</p><ArticleAside title="先问运行时给了什么"><p>读 Docker 或编排配置时，把镜像、挂载、用户身份、能力和资源配额分开看。它们共同决定进程实际能做什么。</p></ArticleAside></ArticleSection>
    <ArticleSection id="container-boundary-section" title="权限和数据要另行设计"><p id="container-privilege" className="vp-citation-target">容器删除后，容器临时层里的文件会消失；卷或外部存储里的数据可以继续保留。提高权限或挂载宿主机目录，则会改变原来的隔离边界。<Cite id="container-privilege" sources={containerSources} />“删掉容器”不是备份策略，“容器化”也不是安全保证。</p><p id="container-boundary" className="vp-citation-target">NIST 的容器安全指南把镜像、注册表、编排和运行时一起纳入防护范围。<Cite id="container-boundary" sources={containerSources} />当读者能指出共享的内核、独立的视图和持久化数据分别在哪里，才真正理解了容器。</p></ArticleSection>
  </Article>;
}

const imageSections: [string, string][] = [["image-definition-section", "镜像是一份可校验的模板"], ["image-layer-section", "层共享，写入才分叉"], ["image-boundary-section", "把运行秘密留在镜像外"]];
export function InfrastructureContainerImageTermPage() {
  return <Article slug="container-image" title="容器镜像" subtitle="Container Image · 创建运行实例的只读模板" sources={containerImageSources} sections={imageSections} hero={<ImageHero />} intro={<>删掉容器以后，能不能按同一版本重新启动？答案藏在镜像里。<strong>镜像固定应用文件、依赖和配置，容器只在它上面留下当前实例的可写变化</strong>。</>}>
    <ArticleSection id="image-definition-section" title="镜像是一份可校验的模板"><p id="image-definition" className="vp-citation-target">OCI 镜像由配置和文件系统层组成，内容摘要随内容改变；把部署指向摘要，才能知道启动的确实是哪一份产物。<Cite id="image-definition" sources={containerImageSources} />标签可以移动，摘要不会替你悄悄改写。</p><p id="image-digest" className="vp-citation-target">镜像本身不等于运行中的容器。<Cite id="image-digest" sources={containerImageSources} />首图左边的层固定不动，右边的 A、B、C 才是引用模板的实例。</p><ImageLesson /></ArticleSection>
    <ArticleSection id="image-layer-section" title="层共享，写入才分叉"><p id="image-layers" className="vp-citation-target">基础层、运行时层和应用层可以被多个容器共享；容器修改文件时，存储驱动在实例层记录变化，而不是回写镜像。<Cite id="image-layers" sources={containerImageSources} /></p><p id="image-copy" className="vp-citation-target">这就是 copy-on-write：没改的内容继续共享，改过的文件才复制到当前实例的可写层。<Cite id="image-copy" sources={containerImageSources} />B 写入 2 MB，不会让 A 和 C 的模板也变成 94 MB。</p><ArticleAside title="重启和重建要分开"><p>restart 保留原实例层；删除后按摘要创建新实例，才会丢掉临时写入。发布配置应回到构建文件和流水线，不要把线上手改当版本。</p></ArticleAside></ArticleSection>
    <ArticleSection id="image-boundary-section" title="把运行秘密留在镜像外"><p id="image-writable" className="vp-citation-target">需要跨重启保存的数据应进入卷或外部存储，不应依赖容器可写层。<Cite id="image-writable" sources={containerImageSources} />生产密钥也不该被烘进每一份镜像。</p><p id="image-volume" className="vp-citation-target">可复现只说明产物固定，并不说明产物没有漏洞、权限足够收窄或依赖可信。<Cite id="image-volume" sources={containerImageSources} />部署审计还要记录平台架构、扫描结果和运行时注入的配置。</p></ArticleSection>
  </Article>;
}

const discoverySections: [string, string][] = [["discovery-definition-section", "调用方先问名字"], ["discovery-health-section", "地址表会随心跳变化"], ["discovery-boundary-section", "找到谁不等于决定打谁"]];
export function InfrastructureServiceDiscoveryTermPage() {
  return <Article slug="service-discovery" title="服务发现" subtitle="Service Discovery · 用服务名找到当前可用端点" sources={serviceDiscoverySources} sections={discoverySections} hero={<DiscoveryHero />} intro={<>订单服务扩容、缩容、重启都很平常，把 `10.0.0.2` 写死在调用方却会让每次变化都变成一次发布。<strong>服务发现维护服务名和当前端点的关系</strong>，让调用方在运行时查询位置。</>}>
    <ArticleSection id="discovery-definition-section" title="调用方先问名字"><p id="discovery-name" className="vp-citation-target">调用方请求的是 `orders` 这个服务名，发现系统再返回一个或多个当前端点。Kubernetes 的 Service 和 DNS 让这个名字脱离具体 Pod 地址。<Cite id="discovery-name" sources={serviceDiscoverySources} /></p><p id="discovery-endpoints" className="vp-citation-target">端点列表是运行时状态，不是业务数据。<Cite id="discovery-endpoints" sources={serviceDiscoverySources} />首图的注册表只回答“现在可以去哪”，不负责保存订单本身。</p><DiscoveryLesson /></ArticleSection>
    <ArticleSection id="discovery-health-section" title="地址表会随心跳变化"><p id="discovery-health" className="vp-citation-target">实例上线时注册地址，健康检查失败或心跳超时后应从可用端点中移除；EndpointSlice 等机制把这类变化传给查询方。<Cite id="discovery-health" sources={serviceDiscoverySources} /></p><p id="discovery-cache" className="vp-citation-target">缓存会让旧地址在短时间内仍可见，所以 TTL、刷新和失败重试必须写进调用策略。<Cite id="discovery-cache" sources={serviceDiscoverySources} />“注册表已更新”不等于每个调用方立刻看到了更新。</p><ArticleAside title="给地址加上时间"><p>看到一个端点时同时记录它何时注册、多久没心跳、谁缓存了它。没有时间信息，故障排查很容易把旧地址当成当前事实。</p></ArticleAside></ArticleSection>
    <ArticleSection id="discovery-boundary-section" title="找到谁不等于决定打谁"><p id="discovery-boundary" className="vp-citation-target">服务发现负责定位，负载均衡负责选择，熔断和重试负责失败处理；这些职责可能由同一平台组合提供，但概念上要分开。<Cite id="discovery-boundary" sources={serviceDiscoverySources} />把“发现”当成“已经安全调用”会漏掉认证、超时和流量策略。</p></ArticleSection>
  </Article>;
}

const observabilitySections: [string, string][] = [["observability-definition-section", "先把症状变成范围"], ["observability-trace-section", "再沿 trace 缩小到一个跨度"], ["observability-boundary-section", "信号多不等于结论成立"]];
export function InfrastructureObservabilityTermPage() {
  return <Article slug="observability" title="可观测性" subtitle="Observability · 从运行信号推断系统内部状态" sources={observabilitySources} sections={observabilitySections} hero={<ObservabilityHero />} intro={<>“接口变慢了”只是一个症状。<strong>可观测性把指标、追踪和日志扣在同一条请求上下文上</strong>，让排查从一大片系统缩小到一个可验证的跨度。</>}>
    <ArticleSection id="observability-definition-section" title="先把症状变成范围"><p id="observability-definition" className="vp-citation-target">指标告诉你影响范围，追踪告诉你请求经过哪里，日志记录某个时刻发生的事件。OpenTelemetry 把它们视作不同信号，不要求用一种数据替代全部问题。<Cite id="observability-definition" sources={observabilitySources} /></p><p id="observability-signals" className="vp-citation-target">如果 checkout 的 p95 从 200 ms 升到 2.4 s，先能确认异常范围；还需要 trace 才知道 payment 是否占掉大部分时间。<Cite id="observability-signals" sources={observabilitySources} /></p><ObservabilityLesson /></ArticleSection>
    <ArticleSection id="observability-trace-section" title="再沿 trace 缩小到一个跨度"><p id="observability-trace" className="vp-citation-target">trace 由多个 span 组成，每个 span 有自己的开始时间、耗时和父子关系。<Cite id="observability-trace" sources={observabilitySources} />本页把 frontend、order、payment 三段并排，是为了让“慢”变成一段可行动的证据。</p><p id="observability-context" className="vp-citation-target">上下文传播把 trace ID 和 span ID 沿跨服务请求传下去；中途丢失时，后端日志就无法可靠归到同一个请求。<Cite id="observability-context" sources={observabilitySources} /></p><ArticleAside title="每条信号都要回答一个问题"><p>指标回答影响面，追踪回答路径，日志回答细节。先写你要回答的问题，再决定采样、字段和保留时间。</p></ArticleAside></ArticleSection>
    <ArticleSection id="observability-boundary-section" title="信号多不等于结论成立"><p id="observability-logs" className="vp-citation-target">日志需要结构化字段，并且要注意采样、时钟差异、脱敏和个人数据。<Cite id="observability-logs" sources={observabilitySources} />同一个 trace ID 能把证据连起来，却不会自动证明根因。</p><p id="observability-correlation" className="vp-citation-target">可观测性解释运行时发生了什么，不替代源码安全分析或功能测试。<Cite id="observability-correlation" sources={observabilitySources} />调查结束前仍要回到支付查询和索引配置验证修复。</p></ArticleSection>
  </Article>;
}

const sastSections: [string, string][] = [["sast-definition-section", "不运行程序也能追数据流"], ["sast-review-section", "告警需要人来判断"], ["sast-boundary-section", "静态结果不是运行时证明"]];
export function InfrastructureSastTermPage() {
  return <Article slug="sast" title="静态应用安全测试" subtitle="SAST · 在代码运行前检查潜在安全路径" sources={sastSources} sections={sastSections} hero={<SastHero />} intro={<>代码还没部署，能不能先发现明显的注入路径？<strong>SAST 读取源码或编译产物，沿语法和数据流寻找不可信输入是否抵达危险操作</strong>，不需要先启动真实用户会话。</>}>
    <ArticleSection id="sast-definition-section" title="不运行程序也能追数据流"><p id="sast-definition" className="vp-citation-target">静态分析工具会把输入来源、函数调用和危险汇点连成路径。<Cite id="sast-definition" sources={sastSources} />首图从 `request.query` 走到 `db.query`，把告警的“为什么”画出来，而不是只贴一个高风险标签。</p><p id="sast-dataflow" className="vp-citation-target">如果路径中存在参数化查询或其他净化节点，工具可能不再报告同一条污点路径。<Cite id="sast-dataflow" sources={sastSources} />这改变的是可分析的代码结构，不代表所有输入都已安全。</p><SastLesson /></ArticleSection>
    <ArticleSection id="sast-review-section" title="告警需要人来判断"><p id="sast-review" className="vp-citation-target">安全规则、代码上下文和业务约束共同决定告警是否可利用；审查时要看来源、汇点、边界检查和实际部署配置。<Cite id="sast-review" sources={sastSources} />自动报告可以排优先级，不能替代修复评审。</p><ArticleAside title="问四个具体问题"><p>输入是谁控制的？数据经过了哪几个函数？危险操作有没有参数化？运行路径是否真的能到达这里？逐个回答，误报和漏报才有机会被发现。</p></ArticleAside></ArticleSection>
    <ArticleSection id="sast-boundary-section" title="静态结果不是运行时证明"><p id="sast-limit" className="vp-citation-target">SAST 看不到所有运行时配置、依赖加载方式和真实流量；OWASP 也把代码审查、依赖管理和测试视作互补环节。<Cite id="sast-limit" sources={sastSources} />“扫描通过”只能说明这组规则没有报出问题。</p></ArticleSection>
  </Article>;
}

const secretSections: [string, string][] = [["secret-definition-section", "扫描器先识别像凭据的东西"], ["secret-history-section", "历史里的密钥也算泄露"], ["secret-boundary-section", "撤销和轮换才让风险下降"]];
export function InfrastructureSecretScanningTermPage() {
  return <Article slug="secret-scanning" title="密钥扫描" subtitle="Secret Scanning · 在代码和历史里找出可能泄露的凭据" sources={secretScanningSources} sections={secretSections} hero={<SecretHero />} intro={<>一枚 API Key 被提交到仓库后，删掉当前文件并不能抹掉过去的提交。<strong>密钥扫描在当前树、提交历史和推送边界里寻找可能的凭据</strong>，把“看起来像秘密”的位置交给处置流程。</>}>
    <ArticleSection id="secret-definition-section" title="扫描器先识别像凭据的东西"><p id="secret-detection" className="vp-citation-target">扫描规则会结合已知前缀、关键词、随机度和提供商验证来标记候选凭据。<Cite id="secret-detection" sources={secretScanningSources} />报告应显示文件、提交和行号，不把完整密钥再回显给更多人。</p><p id="secret-block" className="vp-citation-target">推送保护可以在提交进入远端前暂停提交，让作者撤回或改用秘密存储。<Cite id="secret-block" sources={secretScanningSources} />它减少的是泄露窗口，不是对已经公开凭据的补救。</p><SecretLesson /></ArticleSection>
    <ArticleSection id="secret-history-section" title="历史里的密钥也算泄露"><p id="secret-history" className="vp-citation-target">同一个字符串如果曾经出现在旧提交、分支或构建产物里，扫描当前文件并不够。<Cite id="secret-history" sources={secretScanningSources} />首图让当前树和历史节点同时亮起，提醒读者泄露范围有时间维度。</p><ArticleAside title="不要复制真实值来处理告警"><p>记录命中位置、凭据所有者和影响系统，使用指纹或截断值沟通。完整秘密只在授权的秘密管理系统里流转。</p></ArticleAside></ArticleSection>
    <ArticleSection id="secret-boundary-section" title="撤销和轮换才让风险下降"><p id="secret-rotate" className="vp-citation-target">OWASP 和 NIST 都把密钥生命周期、撤销、轮换和访问审计放在秘密管理里。<Cite id="secret-rotate" sources={secretScanningSources} />把泄露行改成注释不会让 active 凭据失效。</p><p id="secret-audit" className="vp-citation-target">扫描记录是线索，最终处置要确认旧密钥已失效、新密钥只注入需要它的运行环境，并保留轮换证据。<Cite id="secret-audit" sources={secretScanningSources} /></p></ArticleSection>
  </Article>;
}

const dependencySections: [string, string][] = [["dependency-definition-section", "扫描的是解析后的版本"], ["dependency-path-section", "路径比包名更有用"], ["dependency-boundary-section", "升级后还要验证兼容性"]];
export function InfrastructureDependencyScanningTermPage() {
  return <Article slug="dependency-scanning" title="依赖扫描" subtitle="Dependency Scanning · 把锁文件版本和漏洞公告对上" sources={dependencyScanningSources} sections={dependencySections} hero={<DependencyHero />} intro={<>业务代码没改，旧依赖仍可能出现新的安全告警。<strong>依赖扫描读取清单和锁文件，沿实际版本路径匹配公开漏洞范围</strong>，再给出升级或缓解方向。</>}>
    <ArticleSection id="dependency-definition-section" title="扫描的是解析后的版本"><p id="dependency-definition" className="vp-citation-target">包名只能告诉你“用了谁”，锁文件才告诉你“实际解析到哪个版本”。<Cite id="dependency-definition" sources={dependencyScanningSources} />本页的 B@2.1.0 是扫描器需要拿去匹配公告的证据。</p><p id="dependency-match" className="vp-citation-target">公告写着 `B &lt; 2.3.0` 时，2.1.0 命中，2.3.2 不命中。<Cite id="dependency-match" sources={dependencyScanningSources} />版本范围是判断的一部分，不能只看最高风险标签。</p><DependencyLesson /></ArticleSection>
    <ArticleSection id="dependency-path-section" title="路径比包名更有用"><p id="dependency-path" className="vp-citation-target">传递依赖可能由 A 引入 B；报告应该给出从应用到漏洞包的路径，便于判断是否能升级顶层包或只替换一层。<Cite id="dependency-path" sources={dependencyScanningSources} /></p><ArticleAside title="先问漏洞怎样抵达你的代码"><p>核对受影响版本、调用路径、可利用条件和修复版本。出现同一个包名不代表每个项目都暴露在同一风险里。</p></ArticleAside></ArticleSection>
    <ArticleSection id="dependency-boundary-section" title="升级后还要验证兼容性"><p id="dependency-fix" className="vp-citation-target">安全升级可能改变 API、构建结果或运行时行为，Dependabot 等工具给出的是候选更新，不是自动通过的发布证明。<Cite id="dependency-fix" sources={dependencyScanningSources} /></p><p id="dependency-boundary" className="vp-citation-target">扫描只能识别已公开并可匹配的漏洞；SBOM、供应链控制和回归测试仍要补上未知风险与兼容性证据。<Cite id="dependency-boundary" sources={dependencyScanningSources} /></p></ArticleSection>
  </Article>;
}

const threatSections: [string, string][] = [["threat-definition-section", "先画资产和数据流"], ["threat-path-section", "边界变化会改变攻击路径"], ["threat-control-section", "缓解之后仍要留下残余风险"]];
export function InfrastructureThreatModelingTermPage() {
  return <Article slug="threat-modeling" title="威胁建模" subtitle="Threat Modeling · 在设计阶段推演系统如何被滥用" sources={threatModelingSources} sections={threatSections} hero={<ThreatHero />} intro={<>登录系统接入短信供应商后，原来的数据流不再完整。<strong>威胁建模把资产、参与者、信任边界和攻击路径摆在同一张图上</strong>，在代码写完之前先问“谁能借哪条路造成什么后果”。</>}>
    <ArticleSection id="threat-definition-section" title="先画资产和数据流"><p id="threat-definition" className="vp-citation-target">NIST 把威胁建模描述为围绕系统、数据和潜在攻击者识别风险的过程；它从结构和数据流开始，不从随机选择的加密算法开始。<Cite id="threat-definition" sources={threatModelingSources} /></p><p id="threat-path" className="vp-citation-target">浏览器、登录 API 和用户库构成原系统；加入短信供应商后，多了跨越信任边界的请求和回执。<Cite id="threat-path" sources={threatModelingSources} /></p><ThreatLesson /></ArticleSection>
    <ArticleSection id="threat-path-section" title="边界变化会改变攻击路径"><p id="threat-boundary" className="vp-citation-target">外部节点不一定恶意，但它会让凭据、回执和供应商数据的信任假设发生变化。<Cite id="threat-boundary" sources={threatModelingSources} />图上的边界应该跟着设计变化移动，而不是上线前画一次就封存。</p><ArticleAside title="把威胁写成可追踪的句子"><p>谁可能利用哪条数据流，攻击什么资产，成功后造成什么后果，现有控制挡住了哪一步。句子越具体，负责人越知道要改哪里。</p></ArticleAside></ArticleSection>
    <ArticleSection id="threat-control-section" title="缓解之后仍要留下残余风险"><p id="threat-control" className="vp-citation-target">回执签名校验可以降低伪造风险，但它不会消除供应商泄露、短信劫持或服务不可用。<Cite id="threat-control" sources={threatModelingSources} />威胁模型的产物是控制措施和剩余风险，而不是“安全”勾选框。</p></ArticleSection>
  </Article>;
}

const approvalSections: [string, string][] = [["approval-definition-section", "调用提出后先停住"], ["approval-parameters-section", "授权必须看见范围"], ["approval-boundary-section", "一次批准不延伸到下一次"]];
export function InfrastructureToolApprovalTermPage() {
  return <Article slug="tool-approval" title="工具审批" subtitle="Tool Approval · 在高影响工具调用前把决定权交回人" sources={toolApprovalSources} sections={approvalSections} hero={<ApprovalHero />} intro={<>AI 说要删除三个文件时，真正的问题不是“要不要相信模型”，而是你能否看见具体路径和后果。<strong>工具审批把调用暂停在执行前，让授权人逐项批准、拒绝或修改范围</strong>。</>}>
    <ArticleSection id="approval-definition-section" title="调用提出后先停住"><p id="approval-definition" className="vp-citation-target">模型可以提出一个工具调用，但执行器应在高影响动作前进入等待状态；决定明确后，才把批准的调用交给工具。<Cite id="approval-definition" sources={toolApprovalSources} />首图里的 HITL 圆环是暂停点，不是执行结果。</p><p id="approval-parameters" className="vp-citation-target">审批卡应显示工具名称、完整参数、目标对象和可恢复性。<Cite id="approval-parameters" sources={toolApprovalSources} />只写“是否继续？”会把判断所需的信息藏起来。</p><ApprovalLesson /></ArticleSection>
    <ArticleSection id="approval-parameters-section" title="授权必须看见范围"><p id="approval-scope" className="vp-citation-target">删除 A、B、C 的调用可以被拆成三项决定；授权人批准 A、B，并不等于把 C 也交给执行器。<Cite id="approval-scope" sources={toolApprovalSources} />范围越具体，审计越容易复盘当时到底同意了什么。</p><ArticleAside title="拒绝也要有结果"><p>拒绝项应保持未执行并在日志中留下决定；不要把拒绝画成“稍后自动重试”，那会悄悄扩大授权范围。</p></ArticleAside></ArticleSection>
    <ArticleSection id="approval-boundary-section" title="一次批准不延伸到下一次"><p id="approval-execution" className="vp-citation-target">MCP 和 Agents SDK 都把工具参数作为调用的一部分传递；新的目标、参数或风险应重新经过授权。<Cite id="approval-execution" sources={toolApprovalSources} />批准“删除日志 A”不能自动批准下一轮删除报告 C。</p><p id="approval-audit" className="vp-citation-target">审批记录至少要能回看调用编号、批准人、批准项和执行结果。<Cite id="approval-audit" sources={toolApprovalSources} />这让“模型提出了什么”和“系统实际做了什么”保持两条可核对的线。</p></ArticleSection>
  </Article>;
}

const datasetSections: [string, string][] = [["dataset-definition-section", "数据集装的是样本和期望"], ["dataset-split-section", "切分方式决定能不能比较"], ["dataset-boundary-section", "稳定不等于没有偏差"]];
export function InfrastructureEvaluationDatasetTermPage() {
  return <Article slug="evaluation-dataset" title="评测数据集" subtitle="Evaluation Dataset · 用一批固定样本重复检查表现" sources={evaluationDatasetSources} sections={datasetSections} hero={<DatasetHero />} intro={<>模型版本更新后，怎样比较前后差异？先把样本、必要上下文和期望行为固定下来。<strong>评测数据集提供“拿什么问、什么算好”的共同条件</strong>，评分器和评测运行是后面的工作。</>}>
    <ArticleSection id="dataset-definition-section" title="数据集装的是样本和期望"><p id="dataset-definition" className="vp-citation-target">一条评测样本通常包含输入、必要上下文、期望要点或评分依据，以及来源和元数据。<Cite id="dataset-definition" sources={evaluationDatasetSources} />数据集不是分数，也不是一次运行的日志。</p><p id="dataset-coverage" className="vp-citation-target">正常任务、边界输入和已知失败都要有代表性覆盖；只收容易的问题，版本比较会看起来很好却回答不了真实风险。<Cite id="dataset-coverage" sources={evaluationDatasetSources} /></p><DatasetLesson /></ArticleSection>
    <ArticleSection id="dataset-split-section" title="切分方式决定能不能比较"><p id="dataset-split" className="vp-citation-target">同一工单的两条关联问题如果一条进开发、一条进留出，模型可能借到背景而让结果虚高。按工单整组切分能减少这种泄漏。<Cite id="dataset-split" sources={evaluationDatasetSources} /></p><p id="dataset-leakage" className="vp-citation-target">训练、调参和最终评测要保持边界；Google 和 scikit-learn 的数据切分说明都把独立留出视作比较泛化的基础。<Cite id="dataset-leakage" sources={evaluationDatasetSources} /></p><ArticleAside title="先检查组，再看比例"><p>样本数量接近不代表切分正确。先看同一用户、工单或文档是否跨区，再检查留出区是否覆盖高风险类别。</p></ArticleAside></ArticleSection>
    <ArticleSection id="dataset-boundary-section" title="稳定不等于没有偏差"><p id="dataset-version" className="vp-citation-target">去重、改标签或增加样本都应产生新版本并保留变更记录，否则不同模型的结果无法解释。<Cite id="dataset-version" sources={evaluationDatasetSources} />固定的是比较条件，不是把错误标注永远冻结。</p><p id="dataset-boundary" className="vp-citation-target">评测集仍可能有代表性不足、标注错误、时间漂移和训练污染；数据集稳定后，还要定期复核覆盖与来源。<Cite id="dataset-boundary" sources={evaluationDatasetSources} /></p></ArticleSection>
  </Article>;
}
