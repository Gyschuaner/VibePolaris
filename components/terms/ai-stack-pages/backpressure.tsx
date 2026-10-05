import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { backpressureSources } from "@/lib/ai-stack-concept-sources/backpressure";
import { BackpressureHero } from "../ai-stack-lessons/backpressure-hero";
import { BackpressureLesson } from "../ai-stack-lessons/backpressure";

const sections: [string, string][] = [
  ["backpressure-flow", "先看谁跟不上谁"],
  ["backpressure-signal", "压力怎样沿着数据流传回去"],
  ["backpressure-policy", "停、慢、丢不是同一个动作"],
  ["backpressure-boundary", "有界队列才有恢复的机会"],
];

export function BackpressureTermPage() {
  return <Article slug="backpressure" title="背压" subtitle="Backpressure · 让下游容量反过来约束上游生产速度" sources={backpressureSources} sections={sections} hero={<BackpressureHero />} intro={<>数据流最危险的时候，不是完全没有请求，而是上游一直很勤快，下游已经接不住了。背压把下游的容量变成一条回传信号：先把缓冲区控制在有界范围，再让生产者暂停、变慢或按明确策略处理超额工作。</>}>
    <ArticleSection id="backpressure-flow" title="先看谁跟不上谁">
      <p>把一条推理数据管线想成传送带：读取器每秒送来 6 个 chunk，模型后处理每秒只能接住 2 个。中间如果没有限制，暂存区会越堆越高，最后耗尽内存；如果暂存区有上限，系统就必须在“继续生产”之前回答一个更实际的问题：下游现在还能接几个？</p>
      <p id="backpressure-streams" className="vp-citation-target">Reactive Streams 把背压放在异步数据流的核心位置：快速的数据源不应该迫使接收方无限缓冲，队列应当保持有界，接收侧的能力要参与调节元素交换。它描述的是一套跨异步边界的协议语义，不是某个固定的队列产品。<Cite id="backpressure-streams" sources={backpressureSources} /></p>
      <BackpressureLesson />
      <p id="backpressure-ray" className="vp-citation-target">Ray Data 的流式执行把每个算子连接成上下游队列；当下游还没有准备好接收时，上游算子不会继续提交更多任务。这里的“压力”不是报错文本，而是调度器对待提交任务和缓冲数据的实际限制。<Cite id="backpressure-ray" sources={backpressureSources} /></p>
    </ArticleSection>
    <ArticleSection id="backpressure-signal" title="压力怎样沿着数据流传回去">
      <p id="backpressure-demand" className="vp-citation-target">在 Reactive Streams 的语义里，消费者可以用 demand 或 request 表达自己愿意接收的数量；生产者只有拿到可用的额度，才继续发送。这个额度不是“请尽快处理”的口头提醒，而是生产路径上的可检查条件，超出额度的元素不能被无边界地塞进下游。<Cite id="backpressure-demand" sources={backpressureSources} /></p>
      <p id="backpressure-buffer" className="vp-citation-target">Ray Data 的内部文档也把这件事落到资源上：当对象存储里已经缓冲了足够数据，系统会停止启动更多任务；如果产生速度仍高于消费速度，数据可能 spill 到磁盘，问题就从内存压力变成磁盘和吞吐压力。背压减少的是继续制造数据的速度，不会凭空增加下游算力。<Cite id="backpressure-buffer" sources={backpressureSources} /></p>
      <p id="backpressure-observe" className="vp-citation-target">因此监控不能只看“队列里还有多少条”。Ray 的监控页面把提交背压时间、输入输出队列、正在运行的任务和下游取走的输出分开记录；只有把生产、缓冲、消费三段放在同一条时间线上，才能看出压力是短暂的还是正在累积。<Cite id="backpressure-observe" sources={backpressureSources} /></p>
    </ArticleSection>
    <ArticleSection id="backpressure-policy" title="停、慢、丢不是同一个动作">
      <p id="backpressure-distinguish" className="vp-citation-target">背压通常保留数据、牺牲上游吞吐：没有容量就暂停提交，容量回来后再继续。限流则预先规定某个时间窗口允许多少请求；丢弃超额（load shedding）直接放弃一部分工作，保护服务但必须承认数据损失。三者都能让系统少受压，代价却完全不同。<Cite id="backpressure-distinguish" sources={backpressureSources} /></p>
      <p id="backpressure-graceful" className="vp-citation-target">Google Cloud 的 graceful degradation 建议在高负载时限流、尽早丢弃过量请求，并对部分错误和重试做明确处理。它强调的是服务如何继续提供可接受的功能；这和背压的“把容量信号传回生产者”有关联，却不是同一个机制。<Cite id="backpressure-graceful" sources={backpressureSources} /></p>
      <p>动画里切到“丢弃超额”后，生产者仍然会动，但被丢掉的 D、E 不会在下游恢复时自动回来。切回“传回压力”，生产者停在尚未获准的位置，数据保留下来，代价是用户要等待。这一刀必须由产品语义决定：日志可以丢，账单扣款通常不能悄悄丢。</p>
    </ArticleSection>
    <ArticleSection id="backpressure-boundary" title="有界队列才有恢复的机会">
      <p id="backpressure-overload" className="vp-citation-target">AWS 的分布式系统经验把控制交给更小、更容易被压垮的服务：由接收侧掌握交互速度，才能避免较大的上游持续把负载推过来。背压的价值也在这里——它把瓶颈的真实容量带回生产路径，而不是用一个更大的内存队列把故障延后。<Cite id="backpressure-overload" sources={backpressureSources} /></p>
      <p id="backpressure-ramp" className="vp-citation-target">Google Cloud Tasks 记录了另一种常见边界：队列或目标在流量突然增加时会出现更高延迟、错误和更低派发率，重新启用积压队列也可能瞬间冲垮下游。渐进增加派发速度、监控创建和消费速率，是让容量恢复而不是制造第二次尖峰的办法。<Cite id="backpressure-ramp" sources={backpressureSources} /></p>
      <p>背压也有自己的失败方式：如果生产者没有真的尊重暂停信号，缓冲仍会增长；如果消费者永远不恢复，背压只会让请求一直等待；如果重试把同一批工作反复注入，队列看起来“有界”，总工作量却在膨胀。检查时要同时记录队列上限、等待时间、拒绝或丢弃数量、重试次数和下游恢复条件。</p>
      <p><strong>带走一个问题：</strong>当下游变慢时，谁拥有让上游停下来的权力？答案如果不是一个可观测的容量信号，而是“先把队列加大再说”，那只是把背压推迟到了更危险的位置。</p>
    </ArticleSection>
  </Article>;
}
