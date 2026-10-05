import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { deadLetterQueueSources } from "@/lib/ai-stack-concept-sources/dead-letter-queue";
import { DeadLetterQueueHero } from "../ai-stack-lessons/dead-letter-queue-hero";
import { DeadLetterQueueLesson } from "../ai-stack-lessons/dead-letter-queue";

const sections: [string, string][] = [
  ["dead-letter-arrive", "先把失败消息从主路径看清楚"],
  ["dead-letter-isolate", "重试有上限，隔离才不会拖住全队列"],
  ["dead-letter-inspect", "死信区留下什么证据"],
  ["dead-letter-boundary", "重放之前还要确认什么"],
];

export function DeadLetterQueueTermPage() {
  return <Article slug="dead-letter-queue" title="死信队列" subtitle="Dead-Letter Queue · 把反复失败的消息隔离出来，等待调查与重放" sources={deadLetterQueueSources} sections={sections} hero={<DeadLetterQueueHero />} intro={<>一条消息失败一次，可能只是网络抖了一下；同一条消息失败三次，可能已经是格式、权限或业务条件出了问题。死信队列把它从主队列移到一条可调查的支路，留下原消息和失败原因，让后面的正常消息继续走。</>}>
    <ArticleSection id="dead-letter-arrive" title="先把失败消息从主路径看清楚">
      <p>消费者从队列取出一条消息，通常要在处理成功后确认（ack）。如果处理失败或确认没有完成，消息可能再次投递；这让暂时的网络故障有机会恢复，也让一条“每次都会失败”的 poison message 有机会重复撞上同一个消费者。</p>
      <p id="dlq-purpose" className="vp-citation-target">Amazon SQS 把 dead-letter queue 定义为源队列处理失败消息的目标，并用 redrive policy 的 maxReceiveCount 决定尝试多少次后转移。DLQ 的作用是把未消费成功的消息隔离出来，方便查看异常和决定是否 redrive，不是把失败改写成成功。<Cite id="dlq-purpose" sources={deadLetterQueueSources} /></p>
      <DeadLetterQueueLesson />
      <p id="dlq-delivery" className="vp-citation-target">Google Pub/Sub 的 dead-letter topic 面向无法被订阅者确认的消息：系统把无法处理的消息转发到另一条主题，应用再决定怎样处理这条失败支路。它把“主订阅继续消费”和“失败消息等待调查”拆成了两个观察面。<Cite id="dlq-delivery" sources={deadLetterQueueSources} /></p>
    </ArticleSection>
    <ArticleSection id="dead-letter-isolate" title="重试有上限，隔离才不会拖住全队列">
      <p id="dlq-retry" className="vp-citation-target">重试不是越多越可靠。若错误来自坏 JSON、缺少必填字段或永久权限问题，同一消息每隔几秒回来一次，只会占用消费者、增加日志噪声并拖慢后面的消息。maxReceiveCount、退避和 dead-letter 条件要根据“暂时失败还是永久失败”来设，而不是随手填一个很大的数字。<Cite id="dlq-retry" sources={deadLetterQueueSources} /></p>
      <p id="dlq-subqueue" className="vp-citation-target">Azure Service Bus 把 DLQ 作为源队列或订阅的 secondary subqueue：消息只有通过 dead-letter 操作才能进入，消费者可以直接读取、查看和处理它。这个支路仍然是一个真实的队列，消息会留在那里，直到应用明确取走并完成处理，不会因为名字里有“dead”就自动清理。<Cite id="dlq-subqueue" sources={deadLetterQueueSources} /></p>
      <p>动画里的“bad-json”在第三次尝试后才离开主路径。此时后面的“next-order”可以继续处理，但这不等于系统已经解决了坏消息；它只是把一个局部故障的影响范围收窄了。</p>
    </ArticleSection>
    <ArticleSection id="dead-letter-inspect" title="死信区留下什么证据">
      <p id="dlq-reason" className="vp-citation-target">Azure 文档建议通过 dead-letter reason 和 description 追查消息为什么被移走，例如超过最大投递次数、锁失效或规则处理失败。一个只有“失败”两个字的 DLQ 很难运营；至少要能关联原消息、投递次数、时间、异常分类和最后一次处理节点。<Cite id="dlq-reason" sources={deadLetterQueueSources} /></p>
      <p id="dlq-retention" className="vp-citation-target">死信消息也有保留期限和清理责任。SQS 的文档说明，标准队列消息移入 DLQ 后仍受原始入队时间影响；如果 DLQ 保留期不够长，调查还没结束消息就可能过期。保留期、DLQ 深度和最老消息年龄应当进入监控与告警。<Cite id="dlq-retention" sources={deadLetterQueueSources} /></p>
      <p id="dlq-redrive" className="vp-citation-target">“重放”不是把消息从 DLQ 拖回去就结束：要先修复根因或补齐字段，再确认目标队列、权限、重复处理和顺序影响。SQS 将 redrive 作为把 DLQ 消息移出的显式动作；SNS 也把 DLQ 定位为后续分析或重新处理的地方。<Cite id="dlq-redrive" sources={deadLetterQueueSources} /></p>
    </ArticleSection>
    <ArticleSection id="dead-letter-boundary" title="重放之前还要确认什么">
      <p id="dlq-duplicates" className="vp-citation-target">Azure Service Bus 对接收模式的说明揭示了另一个边界：peek-lock 在处理完成并 settle 前保留消息，失败可能造成重复投递；receive-and-delete 则可能在处理前就丢消息。DLQ 不能替业务补上幂等性，重放前要知道同一消息是否已经产生过副作用。<Cite id="dlq-duplicates" sources={deadLetterQueueSources} /></p>
      <p id="dlq-order" className="vp-citation-target">SQS 还提醒，FIFO 队列使用 DLQ 可能破坏严格顺序；如果一条编辑指令依赖前一条指令的上下文，直接隔离中间消息会改变后续操作的含义。重放策略需要说明是否允许跳过、是否按原顺序回灌，以及谁批准这个动作。<Cite id="dlq-order" sources={deadLetterQueueSources} /></p>
      <p>所以工作台的“只调查”不会把消息标成已处理；“修复后重放”也只是重新进入主流程，仍要重新执行、确认和记录。如果修复没有触及根因，消息还会再次回到死信区，这个循环本身就是需要被看见的信号。</p>
      <p><strong>带走一个检查顺序：</strong>先问消息为什么失败、已经试了几次、是否产生过副作用；再问 DLQ 能保留多久、谁能读取和重放；最后才决定是修复、重放、人工改写还是永久放弃。死信队列隔离的是影响，不是责任。</p>
    </ArticleSection>
  </Article>;
}
