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
  return <ConceptArticle slug="backup" title="备份" sources={backupSources} sections={[["history", "保留一个可以回去的状态"], ["restore", "选一份备份，恢复到独立检查库"], ["format", "备份内容与导入"], ["verify", "把恢复过程也验证一遍"]]}
    intro={<>书店把书目存在数据库里，一本书占一行。误删两本书以后，数据库还能照常查询：程序没坏，只是这两本书对应的行没了。备份把某个历史状态保留下来，让恢复有数据可用。这里的 v0、v1、v2 是书目的教学状态编号；备份按保存那一刻的编号命名，演示开始时还没有任何备份。首图上的两张备份卡片只是预告，这两份备份接下来会在演示里一份份保存出来。演示里要核对保存是否成功、保存的是哪个版本、恢复后能否得到需要的结果；真实系统还要另外核对备份文件是否生成。</>}
    hero={<ConceptHero slug="backup" label="原书名和修订版分别留在两个历史备份中"><div className={s.backupHero}><div><Archive size={23}/><span>备份 v0</span><strong>山间来信 · 2 行</strong></div><div><Archive size={23}/><span>备份 v1</span><strong>山间来信·修订版 · 2 行</strong></div></div></ConceptHero>}>
    <ArticleSection id="history" title="保留一个可以回去的状态"><Legacy slug="backup" names={["question", "definition"]}/>
      <p id="backup-snapshot" className="vp-citation-target"><strong>备份存在的意义，就是恢复那天有数据可用。</strong>快照就是把某一刻的数据定格下来：运行 pg_dump 导出命令的同时，其他人可以照常查询和修改数据库；导出拿到的内容仍停在开始那一刻。SQL dump 是把这个状态写成一条条可以重新执行的命令。写下来之后这份文件就不再变，数据库后来改名、删除，都动不到它。<Cite id="backup-snapshot"/></p>
      <p>备份和“<ConceptTerm slug="replication">复制</ConceptTerm>副本”是两回事：正在接收写入的主库改动时，复制副本也会跟着改；主库误删时副本上也可能跟着没了。备份停在保存的那一刻，删除追不上它，所以还能用它找回。每份备份留多久、旧备份什么时候允许被新备份顶掉，要在误删发生之前就定好。</p>
    </ArticleSection>
    <ArticleSection id="restore" title="选一份备份，恢复到独立检查库"><Legacy slug="backup" names={["scene-heading"]}/>
      <p>先保存当前备份，再改一本书的书名，接着再存一份，然后误删。选中一份备份，把它恢复到右边的独立检查库，核对书名与行数。也可以保存误删后的空书目：空备份也是备份，它证明备份只负责把当时的状态定格，恢复它只会得到 0 行。本例的 v0–v2 是固定教学版本，没有访问真实数据库，也没有验证真实磁盘、权限和备份文件。</p>
      <BackupLesson/>
      <p><strong>恢复只能使用备份中已有的内容。</strong>选原版会得到原书名；选修订版会得到新书名。右边恢复出来的数据只是放进检查用的独立库，左边被误删的当前库不会自动复原。要让恢复真正生效，还得把核对过的数据放回正在使用的数据库；这一步要先确认备份之后有没有新数据写入、正在连接这个数据库的程序要不要先断开。本演示到核对为止，不包含这一步。</p>
    </ArticleSection>
    <ArticleSection id="format" title="备份内容与导入"><Legacy slug="backup" names={["quiz-heading"]}/>
      <p id="backup-scope" className="vp-citation-target">PostgreSQL 的 pg_dump 导出单个数据库，角色与表空间这类全局对象需要另行处理。纯 SQL 文本用 psql 导入；自定义或目录格式的归档用 pg_restore。<strong>手里有一份 dump 文件，不等于拿到了整个数据库环境。</strong>官方文档也提醒，除简单场景外，pg_dump 通常不适合作为生产系统的常规备份方案；实际策略要结合规模、停机要求与恢复目标选择。<Cite id="backup-scope"/></p>
      <p>本节用教学里最常见的 pg_dump 演示备份的基本步骤。命令要在能连接数据库的终端上运行，先看懂流程即可，不必跟着敲。</p>
      <pre className={base.code}>{'pg_dump -Fc -f catalog.dump catalog\ncreatedb -T template0 catalog_check\npg_restore --single-transaction \\\n  --dbname=catalog_check catalog.dump'}</pre>
      <p><code>-Fc</code> 让 pg_dump 输出 pg_restore 能读取的自定义格式归档；<code>createdb -T template0 catalog_check</code> 基于干净、未被改动过的模板库 template0，新建一个全新的检查库。</p>
      <p id="backup-restore" className="vp-citation-target">这组命令展示自定义格式归档导入一个新建检查库的路径，假定连接配置、权限和必要角色已经准备好。pg_restore 默认会在 SQL 出错后继续执行，并在结束时报告错误数量；--single-transaction 让导入命令全部成功或不应用任何变化，并隐含遇错退出。它不能和并行恢复（同时开多个恢复任务）一起用，不是所有恢复都照抄这一条。<Cite id="backup-restore"/></p>
    </ArticleSection>
    <ArticleSection id="verify" title="把恢复过程也验证一遍" className={base.offset}><Legacy slug="backup" names={["prompt-heading"]}/>
      <p>能列出备份文件，只证明文件在那里。需要在隔离环境实际恢复一遍：核对重要记录、表之间的关联和权限，再拿应用真正会发出的查询跑一遍，记下花了多久、结果如何。上面的演示只核对两条书目，不能据此宣布一个生产系统已经具备完整灾难恢复能力。</p>
      <ArticleAside title="需要恢复到两次备份之间的时间点"><p id="backup-pitr" className="vp-citation-target">数据库每做一次修改，都会先记进一本叫 WAL 的流水账。时间点恢复就是拿一份适用的基础备份，把 WAL 一笔一笔重放，在指定的时间点停下来。它和上面用 pg_dump 导出 SQL 文件的做法是两条不同的路，随便拿一份 pg_dump，再配上几段来路不明的 WAL，拼不出一个能用的时间点恢复方案。还要确认 WAL 归档中间没有断档，并且你要回到的时间点落在留下来的记录范围内。<Cite id="backup-pitr"/></p></ArticleAside>
      <p>备份方案要写清楚：备哪些数据、数据库什么版本、用什么形式备份、文件存在哪里、留多久。再定两条线：最多允许丢多少数据，最长能接受多久的恢复时间。判断一个备份方案是否可靠，看的是最近一次实际恢复的记录：用的哪份备份、恢复到了哪里、怎么核对的。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function ShardingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={shardingSources}/>;
  return <ConceptArticle slug="sharding" title="分片" sources={shardingSources} sections={[["subset", "不同片负责不同数据"], ["route", "按范围查询与迁移"], ["key", "分片键与数据分布"], ["boundary", "分片与分区的边界"]]}
    intro={<>两台数据库都保存完整书目，是复制。把一部分书目放在 A、另一部分放在 B，则要知道一条记录归哪个片，以及查询该发往哪里。分片把数据分开存到不同片上；采用分片通常还想分散容量和请求，但它不会自动保证每个片一样忙，路由、迁移和跨片查询的处理也要一并跟上。</>}
    hero={<ConceptHero slug="sharding" label="编号42和78落入不同的键范围，分别存放在A和B"><div className={s.shardHero}><div className={s.heroRanges}><span>[0, 50)</span><span>[50, 100)</span></div><div className={s.heroBins}><div><code>#42</code><Database size={27}/><span>片 A</span></div><div><code>#78</code><Database size={27}/><span>片 B</span></div></div></div></ConceptHero>}>
    <ArticleSection id="subset" title="不同片负责不同数据"><Legacy slug="sharding" names={["question", "definition"]}/>
      <p id="shard-distribution" className="vp-citation-target"><strong>分片把数据分布到多个节点，让不同片负责不同的数据子集。</strong>MongoDB 的分片集群使用 mongos 路由请求；它是接收查询、读取配置服务器提供的范围地图并转发请求的路由程序，不是某个片本身。配置服务器保存“哪个范围归哪个片”这类元数据，演示上方的范围地图就是这份元数据的简化画面。每个片本身又可以是副本集，也就是片内几台成员各自保留同一份该片数据。这里说的复制，是把同一片的数据保留多份；副本集是 MongoDB 组织这些片内成员的机制。分片与复制可以同时存在：前者决定每条数据归哪个片，后者在片内部保留副本。<Cite id="shard-distribution"/></p>
      <p id="shard-routing" className="vp-citation-target">分片键是决定记录归哪个片的字段，本演示使用书目编号作为分片键。MongoDB 能用分片键条件定位一个片或一组片；在初始范围下，查编号 10–60 会同时命中 A、B 两段，但仍是按范围定向到这两个片；迁移后则按当时的归属地图判断。缺少这类条件的查询通常需要广播到各片，再合并结果。<strong>数据已经分散，不表示每次查询只访问一台机器。</strong>跨片请求的数量、返回数据量与合并工作仍会影响成本。<Cite id="shard-routing"/></p>
    </ArticleSection>
    <ArticleSection id="route" title="按范围查询与迁移"><Legacy slug="sharding" names={["scene-heading"]}/>
      <p>本演示把书目编号当作分片键，编号范围取 [0, 100)，按它分成两段；方括号表示包含边界，圆括号表示不包含边界。左边包含下界（这里是 0），不包含右边的上界（这里是 50），这样两段不会重叠，编号 50 只会落进后一段。查询 #42、#78 或不存在的 #99，再试一次不含分片键的查询。对 #99 来说，它会按编号范围路由，只是返回 0 行；迁移前请求 B，归属更新后请求 A。接着发起一次指定范围的迁移：把 50–100 迁往 A。复制、改归属、清理，每步之后都重新查询 #78。</p>
      <ShardingLesson/>
      <p>演示里的“更新范围归属为 A”，就是把范围地图里的归属改成 A，也对应真实迁移中的位置元数据更新。</p>
      <p id="shard-moving" className="vp-citation-target">MongoDB 的范围迁移中，源片在复制期间继续负责该范围；目标片取得数据并同步变更，随后更新位置元数据，源片的旧数据再按迁移状态和一致性条件清理。<strong>持有迁移副本，不等于已经取得范围归属。</strong>这里的演示结果只统计当前归属的一份；下文解释迁移步骤，不模拟真实请求在迁移过程中的细节。MongoDB 也有后台 balancer 负责按集群分布安排范围迁移；这里的按钮只是把一个指定范围的步骤逐步摊开。<Cite id="shard-moving"/></p>
      <p>运维可能因为容量、热点或节点维护安排迁移一个范围；本例把它直接搬到 A，反而让 #42 和 #78 都在 A，所以负载没有因此更均匀。即使查询带分片键而能定向，如果热点值集中在一个片，仍可能都打到同一片；后台 balancer 可以搬动范围，却不会替你改掉分片键。真实 MongoDB 的迁移还要处理并发写入、游标（分批读取结果时保存的读取进度）和确认，过程中可能出现短暂停顿；这些演示都没有模拟，也没有真实的查询性能测量。</p>
    </ArticleSection>
    <ArticleSection id="key" title="分片键与数据分布"><Legacy slug="sharding" names={["quiz-heading"]}/>
      <p id="shard-key" className="vp-citation-target">MongoDB 的分片键可以由一个或多个建立索引的字段组成；索引是按字段建立的查找结构，帮助数据库更快定位候选记录，本页不展开索引本身。范围分片按键值分段，哈希分片先根据键算出哈希值，再按结果分配。可以把哈希理解成按固定规则把键值换成另一个数字，相近的原值不一定得到相近的结果，所以原本连续的一段值会被打散。<Cite id="shard-hash"/>哈希方式通常能把连续增长的键值分散到更多片，但范围查询更可能广播；等值查询，也就是查“编号等于 42”这类确定值，仍可以定向。选择键时，需要一起看数据分布与常见查询方式。<strong>某个键能帮查询定位，也可能让数据或高频请求集中到少数片。</strong>增加节点不会自动修正一个不合适的分布方式。本演示只画范围分片，不展开哈希值怎样计算。<Cite id="shard-key"/></p>
      <div className={base.contrast}><div><h3>查询经常带什么条件</h3><p>按租户读书目，还是按标题搜索全站？实际条件决定哪些请求容易定向，哪些仍要跨片。</p></div><div><h3>数据和访问集中在哪里</h3><p>一个大租户、连续新增编号或热门书目，都可能让“片数够多”与“负载均匀”成为两件事。</p></div></div>
    </ArticleSection>
    <ArticleSection id="boundary" title="分片与分区的边界" className={base.offset}><Legacy slug="sharding" names={["prompt-heading"]}/>
      <ArticleAside title="表分区是否就等于分布式分片"><p id="shard-partition" className="vp-citation-target">PostgreSQL 表分区把一张逻辑表拆成多个物理部分；声明式分区就是先声明分区规则，再由数据库按规则决定新记录写进哪个分区。它可以让查询只扫描命中的分区，也方便按分区批量清理旧数据，这些收益发生在数据库自己的存储里。普通分区表本身还不是 MongoDB 那样的分布式分片集群；外部表看起来像表，但数据由 PostgreSQL 之外的数据源提供，作为分区时是否跨机器还要看具体数据源和部署方式。别只看到“拆成几份”，就推断已经跨机器扩容。<Cite id="shard-partition"/></p></ArticleAside>
      <p>分片能把数据分到多台机器上，也带来跨片事务、路由与迁移的维护成本。先弄清单机瓶颈在哪里、查询长什么样，再比较索引、读副本、分区和分片各自适合解决什么问题。</p>
      <p>评估分片时，核对数据库版本、候选分片键、真实分布、热点查询、事务范围，以及副本集成员故障切换（某个片当前负责写入的成员出问题时由其他成员接替）的准备情况。方案要指出哪些查询能定向、哪些需要广播，迁移途中由哪一侧返回数据。</p>
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
      <ArticleAside title="发布确认与消费确认的边界"><p id="queue-publisher" className="vp-citation-target">Publisher confirms 关注发布者与代理之间的接收；consumer acknowledgements 关注代理与消费者之间的交付。两者相互独立。发布者收到确认，不能证明消费者已完成业务。<Cite id="queue-publisher"/></p><p id="queue-durable" className="vp-citation-target">队列元数据是否持久，以及消息是否持久，是需要分别配置的条件。RabbitMQ 的持久队列能在重启后恢复元数据，相应消息也需要使用持久方式发送；这仍不等于每个外部业务副作用恰好发生一次。<Cite id="queue-durable"/></p></ArticleAside>
      <p>队列排查应对照产品与协议版本、发布确认、消费确认时机、并发与 prefetch、积压、失败重投及幂等记录。先定位卡在发布、领取、业务处理还是确认，再调整对应环节。</p>
    </ArticleSection>
  </ConceptArticle>;
}
