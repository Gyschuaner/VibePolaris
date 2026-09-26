import { Archive, Database, EnvelopeSimple, Gear } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { BackupLesson, ShardingLesson, QueueLesson } from './DistributionConceptLessons';
import { backupSources, shardingSources, queueSources } from '@/lib/distribution-sources';
import base from './EventConcepts.module.css';
import s from './DistributionConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }
export function BackupTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={backupSources}/>;
  return <ConceptArticle slug="backup" title="备份" sources={backupSources} sections={[["history", "保留一个可以回去的状态"], ["restore", "从恢复点导入独立库"], ["format", "备份里有什么，怎样导入"], ["verify", "把恢复过程也验证一遍"]]}
    intro={<>书目误删以后，当前数据库可以继续正常运行，只是需要的两行已经没了。备份把某个历史状态保留下来，让恢复有数据可用。文件是否生成、保存的是哪个版本、能否导入并得到需要的结果，都要分别核对。</>}
    hero={<ConceptHero slug="backup" label="原书名和修订版分别留在两个历史备份中"><div className={s.backupHero}><div><Archive size={23}/><span>备份 v0</span><strong>山间来信</strong></div><div><Archive size={23}/><span>备份 v1</span><strong>山间来信·修订版</strong></div></div></ConceptHero>}>
    <ArticleSection id="history" title="保留一个可以回去的状态"><Legacy slug="backup" names={["question", "definition"]}/>
      <p id="backup-snapshot" className="vp-citation-target"><strong>备份保留数据的历史状态，为以后恢复提供输入。</strong>一种方法是逻辑导出：PostgreSQL 的 SQL dump 将数据库状态写成可重新执行的命令，pg_dump 可以在其他读写继续进行时取得一致的快照。它描述的是导出开始时的状态，不会随着之后的改名和删除自动变成新版本。<Cite id="backup-snapshot"/></p>
      <p>本文从两条书目开始，保存原版与修订版，再误删当前书目。一个不断跟随变更的 <ConceptTerm slug="replication">复制</ConceptTerm>副本也可能接收删除；保留下来的旧备份则仍能提供删除之前的数据。需要保留多久、哪些版本可以被覆盖，应当在误删发生之前就决定。</p>
    </ArticleSection>
    <ArticleSection id="restore" title="从恢复点导入独立库"><Legacy slug="backup" names={["scene-heading"]}/>
      <p>先保存当前备份，再改名、保存修订版，然后误删。选中一个恢复点，将它导入右边的独立库，核对书名与行数。也可以保存误删后的空书目：恢复它只会得到 0 行。本例的 v0–v2 是固定教学版本，没有访问真实数据库，也没有验证真实磁盘、权限和备份文件。</p>
      <BackupLesson/>
      <p><strong>恢复只能使用备份中已有的内容。</strong>选原版会得到原书名；选修订版会得到新书名。右边的恢复成功，不会让左边被误删的当前库自动改变。是否将恢复结果切回业务，需要另行核对数据、写入进度与应用连接。</p>
    </ArticleSection>
    <ArticleSection id="format" title="备份里有什么，怎样导入"><Legacy slug="backup" names={["quiz-heading"]}/>
      <p id="backup-scope" className="vp-citation-target">PostgreSQL 的 pg_dump 导出单个数据库，角色与表空间这类全局对象需要另行处理。纯 SQL 文本用 psql 导入；自定义或目录格式的归档用 pg_restore。<strong>看见一个文件名，不能推断它包含整个运行环境。</strong>官方文档也提醒，除简单场景外，pg_dump 通常不适合作为生产系统的常规备份方案；实际策略要结合规模、停机要求与恢复目标选择。<Cite id="backup-scope"/></p>
      <pre className={base.code}>{'pg_dump -Fc -f catalog.dump catalog\ncreatedb -T template0 catalog_check\npg_restore --single-transaction \\\n  --dbname=catalog_check catalog.dump'}</pre>
      <p id="backup-restore" className="vp-citation-target">这组命令展示自定义格式归档导入一个新建检查库的路径，假定连接配置、权限和必要角色已经准备好。pg_restore 默认会在 SQL 出错后继续执行，最后报告错误数量；--single-transaction 让导入命令全部成功或不应用任何变化，并隐含遇错退出。它也有资源与并行方式限制，不是所有恢复都该照抄的固定配置。<Cite id="backup-restore"/></p>
    </ArticleSection>
    <ArticleSection id="verify" title="把恢复过程也验证一遍" className={base.offset}><Legacy slug="backup" names={["prompt-heading"]}/>
      <p>能列出备份文件，只证明文件在那里。需要在隔离环境实际恢复，核对重要记录、关联、权限以及应用查询，再记录耗时与结果。上面的演示只核对两条书目，不能据此宣布一个生产系统已经具备完整灾难恢复能力。</p>
      <ArticleAside title="需要恢复到两次备份之间的时间点"><p id="backup-pitr" className="vp-citation-target">PostgreSQL 的时间点恢复使用适用的基础备份和持续归档的 WAL，在重放时选择目标点停止。它与上面的逻辑导出是不同的备份路径，不能把一份 pg_dump 文件加上随意取得的 WAL，就当作可用的时间点恢复。归档是否连续、恢复目标是否覆盖在保留范围内，也要验证。<Cite id="backup-pitr"/></p></ArticleAside>
      <p>请 AI 帮忙制定备份方案时，提供数据范围、数据库版本、备份形式、保存位置与保留期、允许丢失的数据时长、恢复时间要求以及最近一次实际恢复记录。让方案回答“用哪份数据，恢复到哪里，怎么核对”，而不只是“每天保存一次”。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function ShardingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={shardingSources}/>;
  return <ConceptArticle slug="sharding" title="分片" sources={shardingSources} sections={[["subset", "不同片负责不同数据"], ["route", "按范围查询与迁移"], ["key", "分片键决定数据怎样分布"], ["boundary", "分片与分区的边界"]]}
    intro={<>两台数据库都保存完整书目，是复制。把一部分书目放在 A、另一部分放在 B，则要知道一条记录归哪个片，以及查询该发往哪里。分片分配数据与负载，也让路由、迁移和跨片查询成为需要维护的事情。</>}
    hero={<ConceptHero slug="sharding" label="编号42和78落入不同的键范围，分别存放在A和B"><div className={s.shardHero}><div className={s.heroRanges}><span>[0, 50)</span><span>[50, 100)</span></div><div className={s.heroBins}><div><code>#42</code><Database size={27}/><span>片 A</span></div><div><code>#78</code><Database size={27}/><span>片 B</span></div></div></div></ConceptHero>}>
    <ArticleSection id="subset" title="不同片负责不同数据"><Legacy slug="sharding" names={["question", "definition"]}/>
      <p id="shard-distribution" className="vp-citation-target"><strong>分片把数据分布到多个节点，让不同片负责不同的数据子集。</strong>MongoDB 的分片集群使用 mongos 路由请求，配置服务器保存相关元数据；每个片本身又是副本集。分片与复制可以同时存在：前者划分数据职责，后者在片内部保留副本。<Cite id="shard-distribution"/></p>
      <p id="shard-routing" className="vp-citation-target">MongoDB 能用分片键条件定位一个片或一组片；缺少这类条件的查询通常需要广播到各片，再合并结果。<strong>数据已经分散，不表示每次查询只访问一台机器。</strong>跨片请求的数量、返回数据量与合并工作仍会影响成本。<Cite id="shard-routing"/></p>
    </ArticleSection>
    <ArticleSection id="route" title="按范围查询与迁移"><Legacy slug="sharding" names={["scene-heading"]}/>
      <p>教学范围是 [0, 100)，按书目编号分成两段；左边包含下界，不包含上界。查询 #42、#78 或不存在的 #99，再试一次不含分片键的查询。接着把 50–100 范围指定迁往 A：复制、改归属、清理，每一步都重新查询 #78。</p>
      <ShardingLesson/>
      <p id="shard-moving" className="vp-citation-target">MongoDB 的范围迁移中，源片在复制期间继续负责该范围；目标片取得数据并同步变更，随后更新位置元数据，源片的旧数据再按条件清理。<strong>持有迁移副本，不等于已经取得范围归属。</strong>演示在合并结果时只返回归属数据，避免把待清理副本算成第二条书目。<Cite id="shard-moving"/></p>
      <p>这里是指定范围迁移，不是自动均衡建议；迁往 A 后两行都在 A，负载并没有因此更均匀。真实 MongoDB 还要处理并发写入、游标、确认和短暂停顿等条件。本例没有这些协议，也没有真实查询性能测量。</p>
    </ArticleSection>
    <ArticleSection id="key" title="分片键决定数据怎样分布"><Legacy slug="sharding" names={["quiz-heading"]}/>
      <p id="shard-key" className="vp-citation-target">MongoDB 的分片键可以由一个或多个建立索引的字段组成；范围分片按键值分段，哈希分片则按哈希后的值分段。选择键时，需要一起看数据分布与常见查询方式。<strong>某个键能帮查询定位，也可能让数据或高频请求集中到少数片。</strong>增加节点不会自动修正一个不合适的分布方式。<Cite id="shard-key"/></p>
      <div className={base.contrast}><div><h3>查询经常带什么条件</h3><p>按租户读书目，还是按标题搜索全站？实际条件决定哪些请求容易定向，哪些仍要跨片。</p></div><div><h3>数据和访问集中在哪里</h3><p>一个大租户、连续新增编号或热门书目，都可能让“片数够多”与“负载均匀”成为两件事。</p></div></div>
    </ArticleSection>
    <ArticleSection id="boundary" title="分片与分区的边界" className={base.offset}><Legacy slug="sharding" names={["prompt-heading"]}/>
      <ArticleAside title="表分区是否就等于分布式分片"><p id="shard-partition" className="vp-citation-target">PostgreSQL 表分区把一张逻辑表拆成多个物理部分，声明式分区按边界路由插入记录。普通分区表本身并不会自动构成 MongoDB 这样的分布式分片集群；分区也可以使用外部表，具体部署能力仍要另外设计。别只看到“拆成几份”，就推断已经跨机器扩容。<Cite id="shard-partition"/></p></ArticleAside>
      <p>分片带来数据分配能力，也增加跨片事务、路由与迁移的维护成本。先明确单机瓶颈和查询形态，再比较索引、读副本、分区与分片的适用范围。</p>
      <p>请 AI 评估方案时，提供数据库版本、候选分片键、真实数据分布、热点与查询条件、事务范围、迁移与故障安排。要求它指出哪些查询能定向，哪些需要广播，迁移途中谁负责返回数据。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function QueueTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={queueSources}/>;
  return <ConceptArticle slug="queue" title="队列" sources={queueSources} sections={[["jobs", "把任务留给工作进程"], ["delivery", "领取、处理与确认"], ["duplicate", "重投时保护已经发生的工作"], ["limits", "顺序与可靠性的条件"]]}
    intro={<>用户上传了书封面，缩略图可以交给后台工作进程生成。消息队列先保留任务，工作进程再领取。任务被取走以后是否还算完成，连接断开后要不要再次交付，决定了失败时会丢工作还是重复做工作。</>}
    hero={<ConceptHero slug="queue" label="一条待处理消息交给工作进程，处理后再发送确认"><div className={s.queueHero}><div><EnvelopeSimple size={23}/><EnvelopeSimple size={23}/><span>待领取</span></div><div><Gear size={30}/><span>工作进程</span></div><code>m42</code><span>ack ✓</span></div></ConceptHero>}>
    <ArticleSection id="jobs" title="把任务留给工作进程"><Legacy slug="queue" names={["question", "definition"]}/>
      <p id="queue-work" className="vp-citation-target"><strong>消息队列在发布者与消费者之间保留待交付消息，让工作可以分开执行。</strong>RabbitMQ 的工作队列教程用后台任务说明这一用途：发布者发送任务，多个工作进程可以分担处理。提交任务的请求不必一直等待后台工作，但“已提交”还不是“缩略图已经生成”。<Cite id="queue-work"/></p>
      <p>队列可以缓冲一阵突增的任务，不能凭空增加处理能力。长期入队速度大于处理速度，积压仍会增长。本文使用 RabbitMQ AMQP 0-9-1 手动确认的语境，不能把这里的交付规则套给所有名为 queue 的内存集合或产品。</p>
    </ArticleSection>
    <ArticleSection id="delivery" title="领取、处理与确认"><Legacy slug="queue" names={["scene-heading"]}/>
      <p>发布两条固定书目任务，领取一条，生成缩略图，再确认完成。另走一遍，在生成前或生成后模拟连接断开。消息回到队列，业务结果可能已经留下。本例的按钮推进交付阶段，没有真实消息代理、网络连接或图片处理。</p>
      <QueueLesson/>
      <p id="queue-ack" className="vp-citation-target">RabbitMQ 的消费者确认让代理知道交付是否可以结束，并让消息可被删除。手动确认模式下，<strong>领取消息不会自动确认，业务处理完成也不会自动发出 ack。</strong>本例的应用选择在缩略图处理完成后确认；这是处理策略，协议本身不会判断图片是否正确。<Cite id="queue-ack"/></p>
      <p id="queue-prefetch" className="vp-citation-target">本例让一个工作进程最多持有一条未确认消息。RabbitMQ 教程用 prefetch 限制交给消费者但尚未确认的消息数量；确认之前，工作槽不能继续无限领取。真实消费者的并发与确认方式需要一起配置。<Cite id="queue-prefetch"/></p>
    </ArticleSection>
    <ArticleSection id="duplicate" title="重投时保护已经发生的工作"><Legacy slug="queue" names={["quiz-heading"]}/>
      <p id="queue-duplicate" className="vp-citation-target">RabbitMQ 在消费者连接或通道关闭时，会重新排队未确认的交付。网络失败下，消费者可能再次看到已经接收过的消息，官方可靠性指南建议将消费处理设计为幂等。<strong>工作已完成、确认未到达，是重复执行的一个来源。</strong>本例按固定任务键记录已生成的缩略图，重投同一任务时复用结果。<Cite id="queue-duplicate"/></p>
      <p>保护业务结果的是应用里的 <ConceptTerm slug="idempotency">幂等</ConceptTerm>处理，不是消息队列自动去重。这里的两个任务键保存在浏览器内存，便于观察；真实系统要处理并发、记录持久化以及业务写入与防重记录之间的原子性。进程重启后丢掉一张内存表，不能仍然宣称防重有效。</p>
      <p id="queue-failure" className="vp-citation-target">无法处理的消息也不能永远重投。RabbitMQ 支持拒绝或否定确认，并选择重新排队；配置了死信机制时，也可将相应消息转到其他去向。需要区分暂时失败与永久失败，安排重试上限、错误记录和人工处理。<Cite id="queue-failure"/></p>
    </ArticleSection>
    <ArticleSection id="limits" title="顺序与可靠性的条件" className={base.offset}><Legacy slug="queue" names={["prompt-heading"]}/>
      <p id="queue-order" className="vp-citation-target">RabbitMQ 队列的基础模型是 FIFO，但多个发布连接、优先级、多消费者及重投等情况会影响观察到的处理顺序。<strong>先进入队列，不能无条件推导出先完成业务。</strong>本文单个工作进程顺序处理两条任务，只展示一种简化场景。<Cite id="queue-order"/></p>
      <ArticleAside title="发布确认与消费者确认各证明什么"><p id="queue-publisher" className="vp-citation-target">Publisher confirms 关注发布者与代理之间的接收；consumer acknowledgements 关注代理与消费者之间的交付。两者相互独立。发布者收到确认，不能证明消费者已完成业务。<Cite id="queue-publisher"/></p><p id="queue-durable" className="vp-citation-target">队列元数据是否持久，以及消息是否持久，是需要分别配置的条件。RabbitMQ 的持久队列能在重启后恢复元数据，相应消息也需要使用持久方式发送；这仍不等于每个外部业务副作用恰好发生一次。<Cite id="queue-durable"/></p></ArticleAside>
      <p>请 AI 排查队列时，提供产品与协议版本、发布确认、消费者确认时机、并发与 prefetch、积压数量、失败重投和幂等记录。先定位卡在发布、领取、业务处理还是确认，再判断要调哪一层。</p>
    </ArticleSection>
  </ConceptArticle>;
}
