import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { serviceDiscoverySources } from "@/lib/ai-stack-concept-sources/service-discovery";
import styles from "../ConceptArticle.module.css";
import { ServiceDiscoveryLesson } from "../ai-stack-lessons/service-discovery";

const discoverySections: [string, string][] = [["discovery-need", "调用方不再写死机器地址"], ["discovery-registry", "注册、健康与端点列表"], ["discovery-query", "名字、缓存和一次查询"], ["discovery-boundary", "发现不等于分配和授权"]];
export function ServiceDiscoveryTermPage() {
  const sources = serviceDiscoverySources;
  const Lesson = ServiceDiscoveryLesson;
  return <Article slug="service-discovery" title="服务发现" subtitle="Service Discovery · 从名字找到可用入口" sources={sources} sections={discoverySections} hero={<Hero trigger="订单服务换了 IP，调用方怎么继续找到它？" change="服务名 → 可用入口 / 候选端点" proof="注册表或 headless 列表更新后，查询结果随健康状态改变" />} intro={<>服务发现维护逻辑服务名与网络入口之间的映射。这个入口有时是普通 Service 的稳定虚拟地址，有时是注册表或 headless Service 提供的端点集合；本文演示后者，方便看见实例上线、失效和缓存刷新。它解决“去哪里找”，不自动解决每个请求“选谁”、能不能访问以及业务是否成功。</>}>
    <ArticleSection id="discovery-need" title="调用方不再写死机器地址"><p>订单服务从两台机器扩容到三台，之后又因为故障换了地址。如果前端或另一个服务把 <code>10.0.0.2</code> 写死，地址变化就会变成一次全链路修改。服务发现让调用方只依赖 <code>orders</code> 这个逻辑名字，把实例位置留给运行环境管理。</p><p id="discovery-name" className="vp-citation-target">Kubernetes 的 DNS 文档展示了两种入口：普通 Service 名可以解析到稳定的虚拟地址，再由服务代理选择后端；headless Service 则可以返回后端 Pod 地址集合。<Cite id="discovery-name" sources={sources} /></p><p>读者要记住的是“名字和位置分开”。名字描述你想找的服务，端点描述这一次可能连接的主机和端口；两者之间的映射会随扩缩容和健康状态改变。</p><p>本页的注册表演示属于 headless / 客户端发现这一侧：查询结果直接显示候选端点；若使用普通 Service，读者会先拿到一个虚拟入口，后端选择由代理或转发层完成。</p><Lesson /></ArticleSection>
    <ArticleSection id="discovery-registry" title="注册、健康与端点列表" className={styles.splitSection}><p id="discovery-service" className="vp-citation-target">Kubernetes Service 用选择器跟踪后端 Pod，并通过 EndpointSlice 表达当前端点；这让控制面可以在 Pod 地址变化时更新服务视图。<Cite id="discovery-service" sources={sources} /></p><p id="discovery-endpoints" className="vp-citation-target">EndpointSlice（把端点列表分片保存的 Kubernetes 对象）记录端点及其条件，调用方或代理可以据此得到更接近当前状态的候选集合。<Cite id="discovery-endpoints" sources={sources} /></p><p id="discovery-health" className="vp-citation-target">NIST 对微服务的讨论区分服务注册与发现，并强调注册表的可用性、完整性和健康判断会直接影响调用方得到的结果。<Cite id="discovery-health" sources={sources} /></p><div className={styles.contract}><div><span>注册表</span><h3>orders → .2 / .3</h3><p>实例上线、心跳和下线事件改变列表。</p></div><div><span>调用方</span><h3>query("orders")</h3><p>只获得候选地址，之后仍要连接和处理错误。</p></div></div></ArticleSection>
    <ArticleSection id="discovery-query" title="名字、缓存和一次查询"><p id="discovery-cache" className="vp-citation-target">客户端通常会缓存解析结果。TTL（缓存允许保留结果的时间）越长，查询越少，但实例失效后旧地址也可能在 TTL 到期前短暂出现。服务发现系统需要在健康更新、缓存时间和失败重试之间做取舍。<Cite id="discovery-cache" sources={sources} /></p><p>本页把 TTL 设成 30 秒：B 刚刚失效时，旧缓存还可能返回 B；缓存刷新后，结果只剩下 C 上线后的健康端点。这个短暂的 stale 不是“发现失效”，而是缓存的时间边界，调用方必须对连接失败保持可恢复。</p><p>一次成功的发现查询也不等于业务成功。连接可能超时、服务可能拒绝请求、返回的数据可能不符合契约；发现层提供位置，应用仍要验证响应。</p></ArticleSection>
    <ArticleSection id="discovery-boundary" title="发现不等于分配和授权"><p>服务发现把候选端点交给客户端、代理或服务网格（负责服务间通信的代理层）；负载均衡器可以在候选中选择一个，网关可以做路由，认证和授权则决定请求是否有资格继续。</p><p>把这些职责混成“DNS 会帮我安全地调用服务”，会掩盖失败路径：注册表可用不代表端点健康，端点可达不代表用户有权限。每一层都应该留下自己的证据和错误。</p><p><strong>停止条件</strong>：你能解释一个实例上线、失效和缓存到期后的结果，并能判断“找不到地址”“连接超时”“权限拒绝”分别属于哪一层。</p></ArticleSection>
  </Article>;
}
