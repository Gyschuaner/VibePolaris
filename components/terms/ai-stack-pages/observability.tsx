import { ArticleSection, ConceptTerm } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { observabilitySources } from "@/lib/ai-stack-concept-sources/observability";
import styles from "../ConceptArticle.module.css";
import { ObservabilityLesson } from "../ai-stack-lessons/observability";

const observeSections: [string, string][] = [["observe-need", "先确认哪里变慢"], ["observe-trace", "一条请求拆成跨度"], ["observe-correlate", "把日志和追踪连起来"], ["observe-boundary", "信号多不等于能解释"]];
export function ObservabilityTermPage() {
  const sources = observabilitySources;
  const Lesson = ObservabilityLesson;
  return <Article slug="observability" title="可观测性" subtitle="Observability · 从外部信号推断内部状态" sources={sources} sections={observeSections} hero={<Hero variant="lens" trigger="结账接口变慢，问题在网关、订单还是支付？" change="指标 → trace → 关联日志" proof="payment 跨度占大头，同一 trace_id 的日志解释原因" />} intro={<>可观测性让你通过系统对外发出的信号，推断系统内部发生了什么。日志、指标和追踪是不同角度的证据；关键不是收集最多数据，而是能把它们关联起来回答“哪里变了、为什么变、下一步查什么”。</>}>
    <ArticleSection id="observe-need" title="先确认哪里变慢"><p>“接口变慢了”只是一个症状。先看 checkout 的 p95（95% 请求的耗时都不超过它）从 200 ms 升到 2.4 s，可以确认时间范围和影响程度，却还不知道慢在网关、订单服务还是支付服务。</p><p id="observe-signals" className="vp-citation-target">OpenTelemetry 把 traces、metrics、logs 作为不同信号：指标是运行时的测量，日志是事件记录，追踪是请求经过组件的路径。它们描述的是同一系统的不同切面。<Cite id="observe-signals" sources={sources} /></p><p>因此可观测性不是“把日志开到 debug”。每个信号都要带上足够的时间、服务和上下文，才能让下一次问题调查沿着证据收敛。</p><Lesson /></ArticleSection>
    <ArticleSection id="observe-trace" title="一条请求拆成跨度" className={styles.splitSection}><p id="observe-trace-definition" className="vp-citation-target">一条分布式 trace 由多个 span 组成，每个 span 描述一个操作及其耗时；瀑布关系让你看到父请求和子操作如何嵌套。<Cite id="observe-trace-definition" sources={sources} /></p><p>本页的 trace-7 包含 frontend 0.2 s、order 0.4 s 和 payment 1.8 s。payment 占约四分之三，所以“支付慢”是比“系统慢”更可行动的下一步。</p><p id="observe-kubernetes" className="vp-citation-target">在 Kubernetes 等分布式环境里，日志、指标和追踪还要说明来自哪个容器、Pod 或部署；否则同名服务的信号会混在一起。<Cite id="observe-kubernetes" sources={sources} /></p><div className={styles.contract}><div><span>指标</span><h3>异常范围</h3><p>p95、错误率和请求量先回答影响面。</p></div><div><span>追踪</span><h3>异常跨度</h3><p>payment 1.8 s 把排查范围缩小到一段操作。</p></div></div></ArticleSection>
    <ArticleSection id="observe-correlate" title="把日志和追踪连起来"><p id="observe-correlation" className="vp-citation-target">OpenTelemetry 的日志规范建议把 trace ID 和 span ID 放入日志记录。trace ID 是一次请求的编号，span ID 是其中一个操作的编号；有了它们，来自不同组件的事件可以按执行上下文互相跳转，而不是只能靠相近时间猜测。<Cite id="observe-correlation" sources={sources} /></p><p id="observe-context" className="vp-citation-target">上下文传播就是把这些标识沿跨服务请求继续传下去；如果中间服务没有继续传播，后端日志就无法被归到同一次请求。<Cite id="observe-context" sources={sources} /></p><p>演示中的三条日志都带 trace-7，其中一条显示 retry=1，另一条显示 index=missing。日志给出了原因线索，但它仍然是线索：要改变系统，需回到支付查询和索引配置验证。</p></ArticleSection>
    <ArticleSection id="observe-boundary" title="信号多不等于能解释"><p>采样（只保留部分请求的追踪）会让追踪不完整，时钟不同步会让瀑布顺序看起来错误，脱敏不当会把密钥和个人数据写进日志。每个选择都改变你能观察到的范围。</p><p>可观测性回答运行时“发生了什么”，不替代 <ConceptTerm slug="sast">SAST</ConceptTerm> 对源码的检查，也不替代功能测试和安全评审。用错信号会把排查问题变成堆数据。</p><p><strong>停止条件</strong>：你能从一个指标异常走到一条 trace，再用同一上下文筛选日志，并指出哪一环证据缺失会让结论失效。</p></ArticleSection>
  </Article>;
}
