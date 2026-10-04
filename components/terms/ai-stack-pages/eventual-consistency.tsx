import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { eventualConsistencySources } from "@/lib/ai-stack-concept-sources/eventual-consistency";
import { EventualConsistencyHero } from "../ai-stack-lessons/eventual-consistency-hero";
import { EventualConsistencyLesson } from "../ai-stack-lessons/eventual-consistency";

const sections: [string, string][] = [
  ["eventual-write", "先把“写入成功”和“读到最新”分开"],
  ["eventual-window", "副本之间的时间差会落到用户身上"],
  ["eventual-conflict", "并发写入需要一条可解释的裁决线"],
  ["eventual-boundary", "一致性选择最后是产品约束"],
];

export function EventualConsistencyTermPage() {
  return <Article slug="eventual-consistency" title="最终一致性" subtitle="Eventual Consistency · 允许副本暂时不同，但在没有新写入后逐步收敛" sources={eventualConsistencySources} sections={sections} hero={<EventualConsistencyHero />} intro={<>点下“保存”时，最先知道这件事的往往只有一个副本。其他副本还在路上，下一次读取可能撞上旧值；如果两个地方同时写入，还要有人说明哪个结果留下来。最终一致性把这段时间差和裁决责任摊到系统、产品与用户面前。</>}>
    <ArticleSection id="eventual-write" title="先把“写入成功”和“读到最新”分开">
      <p>想象一个跨地区的订单：region A 收到“已付款”，先把它写进自己的副本并返回成功；region B 还没有收到这次复制。此刻“写入已提交”和“每个读取点都返回 paid”是两句话，前者成立并不自动推出后者。</p>
      <p id="eventual-definition" className="vp-citation-target">Google Cloud 对最终一致性的描述抓住了关键条件：如果之后没有新的更新，系统最终会让读取结果看到最后一次写入。它描述的是“会收敛”的保证，不是“现在立刻一样”的保证。<Cite id="eventual-definition" sources={eventualConsistencySources} /></p>
      <p id="eventual-dynamodb" className="vp-citation-target">DynamoDB 的默认读取是最终一致的：刚完成的写入可能还没有反映在读取结果里，重复读取通常会在复制完成后看到更新。需要更强读取保证时，必须明确选择服务支持的 strongly consistent read，而不是把所有读取都想成同一种。<Cite id="eventual-dynamodb" sources={eventualConsistencySources} /></p>
      <EventualConsistencyLesson />
    </ArticleSection>
    <ArticleSection id="eventual-window" title="副本之间的时间差会落到用户身上">
      <p id="eventual-replication" className="vp-citation-target">AWS Global Tables 把数据复制到多个区域；跨区域副本之间是最终一致的，更新通常在几秒内传播，但这个传播过程仍然是异步的。用户在不同区域读取时，可能短暂看到不同版本。<Cite id="eventual-replication" sources={eventualConsistencySources} /></p>
      <p id="eventual-stale-window" className="vp-citation-target">Azure Cosmos DB 也把旧读解释为读取请求落到了尚未追上的副本；在 eventual consistency 下，文档不承诺一个固定的收敛时间。于是“最多旧 2 秒”不能凭感觉写进产品提示，除非你真的测量并承诺了那条边界。<Cite id="eventual-stale-window" sources={eventualConsistencySources} /></p>
      <p id="eventual-read-choice" className="vp-citation-target">读取路径本身就是设计选择：可以接受旧值的列表页、计数器和推荐流，往往更在意低延迟；付款结果、权限变更或刚刚提交的表单，则需要 read-your-writes、同区强读或其他明确策略。DynamoDB 的 strong read 也有适用范围，不能把它误当成跨区域的万能开关。<Cite id="eventual-read-choice" sources={eventualConsistencySources} /></p>
      <p>工作台里切换“读任一副本”和“同区强读”，再把步骤走到“立即读取”，你会看到差异不是文案颜色：一个允许读到 pending，一个要求这条读取路径确认最新提交值。产品要把这种差异翻译成用户能理解的体验，例如显示“正在同步”、保留刚提交的本地状态，或直接阻止关键动作继续。</p>
    </ArticleSection>
    <ArticleSection id="eventual-conflict" title="并发写入需要一条可解释的裁决线">
      <p id="eventual-conflict" className="vp-citation-target">最终一致性只说明副本会靠拢，不会替业务决定“paid”和“cancelled”谁更有资格留下。AWS Global Tables 使用 last-writer-wins 处理并发更新，并明确提醒这是一个尽力而为的时间顺序裁决；如果业务需要“已发货不能被取消”这种规则，就不能只依赖默认合并。<Cite id="eventual-conflict" sources={eventualConsistencySources} /></p>
      <p id="eventual-coordination" className="vp-citation-target">Azure 的分布式系统设计指南建议减少不必要的协调，把能异步完成的工作拆开，并在无法原子完成时使用补偿动作。换句话说，系统可以先接受各地写入，再用版本、事件、人工审核或补偿交易把业务规则补回来；但这条补救路径必须被设计、记录和监控。<Cite id="eventual-coordination" sources={eventualConsistencySources} /></p>
      <p>动画里的 last writer wins 只是一个故意简单的示例：它能让两个副本最终变成同一个值，却不代表它理解订单生命周期。真正的冲突规则可能是版本号更高者胜出、库存只能递减、取消必须经过审核，或者干脆把冲突送给人工处理。没有规则的“最终相同”，只是把问题藏到更晚。</p>
    </ArticleSection>
    <ArticleSection id="eventual-boundary" title="一致性选择最后是产品约束">
      <p id="eventual-query-shape" className="vp-citation-target">一致性不只由数据库名字决定，也跟查询形状有关。Google Cloud Datastore 把 key lookup、ancestor query 与全局 query 区分开来：同一个系统里，不同读取方式就可能拥有不同的强弱保证。设计接口时要把“哪类读允许旧、哪类读必须新”写进契约。<Cite id="eventual-query-shape" sources={eventualConsistencySources} /></p>
      <p id="eventual-boundary" className="vp-citation-target">Cosmos DB 把 eventual consistency 适合的场景举成计数、点赞和社交动态等：短暂旧值通常比每次读取都等待最强保证更划算。反过来，余额、权限、订单状态等关键事实需要更严格的读取、事务或应用层保护。选择不是“哪个一致性最好”，而是“哪种旧读和冲突后果能被这个产品承担”。<Cite id="eventual-boundary" sources={eventualConsistencySources} /></p>
      <p><strong>带走三句检查：</strong>写入成功后，用户下一次读到的保证是什么；副本落后时，界面怎样解释而不是制造“保存失败”的错觉；两个地方同时写入时，谁有权裁决、怎么留下证据。最终一致性不是把错误藏起来的借口，而是把等待、冲突和成本摊开后，换取更低延迟与更高可用的一种工程选择。</p>
    </ArticleSection>
  </Article>;
}
