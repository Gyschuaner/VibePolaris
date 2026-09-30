import { Database, Lightning, ArrowDownLeft } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { CacheLesson, PoolLesson, ReplicationLesson } from "./ReuseConceptLessons";
import { cacheSources, poolSources, replicationSources } from "@/lib/reuse-sources";
import base from "./EventConcepts.module.css";
import s from "./ReuseConcepts.module.css";
function Legacy({slug,names}:{slug:string;names:string[]}) {return <>{names.map(name=><span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>;}
export function CacheTermPage() {
  const Cite=({id}:{id:string})=><ArticleCitation id={id} sources={cacheSources}/>;
  return <ConceptArticle slug="cache" title="缓存" sources={cacheSources} sections={[["copy","为重复读取留一份副本"],["read","命中与回源"],["fresh","副本与原数据一起变化吗"],["capacity","过期与容量淘汰"]]}
    intro={<>每次打开书目详情页，页面都要显示编号为 #42 的书名。负责页面逻辑的应用可以先保留一次读取的结果，下一次按同一个键取回。少访问一次数据库，这是眼前的好处。但要是数据库里改了书名，这份旧副本还能接着用多久，就得另外拿主意。</>}
    hero={<ConceptHero slug="cache" label="数据库书名先被读取，再保存为book:42:title的缓存副本"><div className={s.cacheHero}><div><Database size={24}/><span>数据库 · #42</span><strong>山间来信</strong></div><div><Lightning size={24}/><code>book:42:title</code><strong>山间来信</strong></div></div></ConceptHero>}>
    <ArticleSection id="copy" title="为重复读取留一份副本"><Legacy slug="cache" names={["question","definition"]}/>
      <p id="cache-mechanism" className="vp-citation-target"><strong>缓存保留可重复使用的数据或计算结果，让后续访问有机会复用它。</strong>这里采用由应用自己维护副本的 Cache-Aside：先查缓存，找不到就读数据库，把结果放入缓存并返回。Microsoft 的模式文档说明，这种按需加载需要应用维护副本；缓存产品本身不会自动知道数据库里的书名变了。<Cite id="cache-mechanism"/></p>
      <p>缓存可以放在应用进程自己的内存里，也可以由独立缓存服务保存，让多个应用实例共享同一份副本。本文只跟着书名这一项数据走。浏览器的 HTTP 缓存、数据库内部的缓存、AI 提示缓存各有各的规则，这里不把它们混在一起讲。<ConceptTerm slug="cache-control">Cache-Control</ConceptTerm>负责浏览器或代理如何缓存 HTTP 响应，是另一层机制。</p>
      <p id="cache-key" className="vp-citation-target">Redis 是一种常见的独立缓存服务；这里用它的命令举例，不是说缓存只能用 Redis。应用用 <code>book:42:title</code>标识这项副本。Redis 的 GET 按键读取字符串，键不存在时返回空值；它不会顺便查询你的业务数据库。<strong>命中表示找到了这个键的值，不表示这个值一定最新。</strong>键还需包含实际会影响结果的输入：例如中文标题和英文标题不能共用同一个键，不同权限看到的结果也不能混用。<Cite id="cache-key"/></p>
    </ArticleSection>
    <ArticleSection id="read" title="命中与回源"><Legacy slug="cache" names={["scene-heading"]}/>
      <p>从空缓存开始读一次，再读一次；接着只修改数据库书名，观察缓存读取。之后再使副本失效，或者等它到期，下一次读取就会重新回源（重新读取数据库）并填入新值。本例只模拟一个键与两个书名；t 是手动推进的逻辑时间，每次回填有效 2 格，命中不会重新计时，方便观察这次副本何时到期。没有真实 Redis、数据库或耗时测量。</p>
      <CacheLesson/>
      <p>第一次未命中，原数据被读出并留下副本；第二次命中，直接返回副本。数据库变成“修订版”后，缓存仍可返回原名。页面并排展示两处数据供你比较；真实应用单凭一次命中，不能推断副本和原数据相等。</p>
    </ArticleSection>
    <ArticleSection id="fresh" title="副本与原数据一起变化吗"><Legacy slug="cache" names={["quiz-heading"]}/>
      <p id="cache-invalidating" className="vp-citation-target">Cache-Aside 的一种写入策略是<strong>先更新数据存储，再使对应缓存失效</strong>，下一次读取重新加载。Microsoft 提醒，若先删缓存再写数据库，在删完缓存到写完数据库之间，如果有另一个请求来读，它会拿到旧值，并把旧值重新填回缓存。顺序重要，但这两步终究是分开的动作，不会拼成一个原子事务。这里的“原子事务”是指外部看不到中间状态、两步像一个整体完成；本例没有把更新和失效包成这样的整体。<Cite id="cache-invalidating"/></p>
      <p id="cache-consistency" className="vp-citation-target">外部程序修改数据库，或多个应用各有本地副本时，更新不会自动同步到所有缓存。Cache-Aside 不保证数据存储与缓存始终一致；需要根据可接受的新鲜度安排失效、到期或其他更新机制。本文按一次一个动作演示，没有解决并发读写中的所有竞争情况。<Cite id="cache-consistency"/></p>
      <div className={base.contrast}><div><h3>能接受短暂旧值</h3><p>书目说明这类数据，可以先确定可接受的延迟，再选择副本期限与更新办法。</p></div><div><h3>需要当前事实</h3><p>是否还有库存、是否允许借阅，需要结合实际一致性要求判断，不能只凭缓存里的书名或数量作决定。</p></div></div>
    </ArticleSection>
    <ArticleSection id="capacity" title="过期与容量淘汰" className={base.offset}><Legacy slug="cache" names={["prompt-heading"]}/>
      <p id="cache-expiry" className="vp-citation-target">Redis 的 EXPIRE 为键设置存活时间，期限到达后键会被删除。<strong>到期移除副本，不是自动把副本改成数据库的新值。</strong>本例到期后要再读取，应用才回源并回填。期限长短需要结合变化频率与读取成本决定，不能从“设置了 TTL”推断每次读取都最新。<Cite id="cache-expiry"/></p>
      <ArticleAside title="容量不足也会让副本消失"><p id="cache-eviction" className="vp-citation-target">即使还没到期，缓存也可能因容量策略淘汰键。Redis 的 maxmemory-policy 可以选择 LRU、LFU 等策略；选择 noeviction 时不淘汰已有键，缓存到上限后，应用尝试把新键放进缓存的命令会返回错误。Redis 的 LRU 会用近似的最近使用情况选键，不保证每次都按完整的精确顺序淘汰。过期、主动失效与容量淘汰触发条件不同，应用都应能处理下一次未命中。<Cite id="cache-eviction"/></p></ArticleAside>
      <p>缓存是否值得保留，要看键怎么拼、数据变得勤不勤、旧值可以旧多久、用什么方式失效、能占多少容量，以及没命中时怎么办。再核对实际命中率、回源压力和错误；本页没有给出固定的提速倍数。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function PoolTermPage() {
  const Cite=({id}:{id:string})=><ArticleCitation id={id} sources={poolSources}/>;
  return <ConceptArticle slug="connection-pool" title="连接池" sources={poolSources} sections={[["reuse","请求结束，连接可以留下"],["lease","两条连接，三个请求"],["return","结束事务，再归还连接"],["limit","池大小与数据库容量"]]}
    intro={<>这里的“连接”是一条应用与数据库服务器之间已经建立并完成认证的通信通道。每次查书目都重新建立它，等于每次都要重走连接和认证。应用可以借用已有连接，用完交还。多个请求同时到来时，问题又变成：谁正在占用连接，后来者等在哪里，等多久。首图里的两个 C 标的是同一个请求的两个阶段：前半段它在排队等待，请求 A 归还连接后，它才借到连接 1。</>}
    hero={<ConceptHero slug="connection-pool" label="两条既有连接分别被A和B借用，C先等待，A归还后C借用同一连接"><div className={s.poolHero}><div><span>连接 1</span><strong>A</strong><em>C</em></div><div><span>连接 2</span><strong>B</strong></div><span>C</span><ArrowDownLeft size={25}/></div></ConceptHero>}>
    <ArticleSection id="reuse" title="请求结束，连接可以留下"><Legacy slug="connection-pool" names={["question","definition"]}/>
      <p id="pool-mechanism" className="vp-citation-target"><strong>连接池维护一组可借出、可归还的连接，供请求复用，并控制同时占用连接的请求数。</strong>Psycopg 是 Python 程序连接 PostgreSQL 的库；需要访问数据库时向池要连接，池里有空闲连接就直接给，用完再还回来。池保存的是连接资源，不是上一条 SQL 的查询结果。<Cite id="pool-mechanism"/></p>
      <p id="pool-lazy" className="vp-citation-target">“有一个池”也不一定代表启动时已创建全部连接。SQLAlchemy 是 Python 的数据库工具；它的 QueuePool 要到第一次用到时才建立连接。<code>pool_size</code>表示常驻连接数，<code>max_overflow</code>表示临时允许多开的连接数，等待上限表示没有连接时最多等多久。Psycopg 创建连接的时机不同，不能把一个实现的默认值套给所有应用。<Cite id="pool-lazy"/></p>
      <p>每条连接上有一个数据库会话，操作都通过它执行。这里的数据库会话是服务器为这条连接保留的状态，例如当前事务；<ConceptTerm slug="orm">ORM</ConceptTerm> 的 Session 是应用里管理对象和事务的程序对象，HTTP 请求则是一次网页或 API 调用。这三者是不同的东西。这里的模型是：一次借用期间，连接由一个请求独占。协议级流水线和同一连接的并发复用不在讨论范围。</p>
    </ArticleSection>
    <ArticleSection id="lease" title="两条连接，三个请求"><Legacy slug="connection-pool" names={["scene-heading"]}/>
      <p>池里已有两条健康连接，不允许临时扩容。让 A、B、C 依次借用；第三个请求只能等待。有请求完成操作并归还连接后，等待中的请求就能拿到它。换一条路径：让等待达到上限，C 会以“等待超时 · 未获连接”结束。之后再归还 A 的连接，也不会把连接发给这次已经超时的等待。要重新演示借还，点“重新分配两条连接”即可把教学模型恢复到初始状态。</p>
      <PoolLesson/>
      <p id="pool-waiting" className="vp-citation-target">Psycopg 的池在没有可用连接时把调用放入等待队列，并支持用 <code>timeout</code> 限制等待时长。<strong>等待连接超时与 SQL 执行超时发生在不同阶段。</strong>等待超时的请求还没拿到连接，查询也还没有执行。演示里点按钮就能让等待到达上限；这个演示只展示容量与借还关系，没有运行 SQL，也没有真实计时。<Cite id="pool-waiting"/></p>
      <p>归还之后，连接仍在池里，可以给另一个请求。演示里只有一个等待者，按到达顺序交接即可；实际的池可能有不同的排队、选连接与扩容策略。</p>
    </ArticleSection>
    <ArticleSection id="return" title="结束事务，再归还连接"><Legacy slug="connection-pool" names={["quiz-heading"]}/>
      <p id="pool-release" className="vp-citation-target">node-postgres 是 Node.js 连接 PostgreSQL 的客户端库。成功借到连接后，查询失败也要按驱动约定归还。它的文档提醒，不释放 client 会泄漏资源，最终耗尽池。<code>try</code>里执行查询，<code>finally</code>里的归还动作无论查询成功还是抛错都会执行；下面假定已创建 <code>pool</code>，只展示执行一条参数化查询时的借还写法。<Cite id="pool-release"/></p>
      <pre className={base.code}>{'const client = await pool.connect();\ntry {\n  await client.query(\n    "SELECT title FROM books WHERE book_id = $1",\n    [42]\n  );\n} finally {\n  client.release();\n}'}</pre>
      <p id="pool-reset" className="vp-citation-target">事务是一组要一起提交或回滚的数据库操作；锁是数据库为避免并发修改冲突而暂时占住的记录或表资源。归还也要处理连接上的事务状态。SQLAlchemy 默认的 reset-on-return 会清理未提交事务状态，包括相关锁；Connection 与 Pool 会配合完成这个清理。<strong>归还连接不代表事务已经提交成功。</strong>需要提交的数据仍要有明确的 <ConceptTerm slug="transaction">事务</ConceptTerm>边界，临时表或其他会话状态还可能需要额外清理。<Cite id="pool-reset"/></p>
      <ArticleAside title="空闲连接也可能已经断开"><p id="pool-disconnect" className="vp-citation-target">SQLAlchemy 的 pre_ping 可以在借出时检查连接并处理失效连接，但它不能挽救执行中途断开的事务。一次操作中途丢失连接，应用仍需处理失败并判断是否重做整个事务，不能指望健康检查在出问题时自动恢复一切。<Cite id="pool-disconnect"/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="limit" title="池大小与数据库容量" className={base.offset}><Legacy slug="connection-pool" names={["prompt-heading"]}/>
      <p id="pool-capacity" className="vp-citation-target">PostgreSQL 的 <code>max_connections</code> 限制服务器同时接受的连接数量；把它的值调大，服务器也要为这些连接预留更多资源。这个数值不保证数据库每秒能处理多少查询。一个服务部署多个实例时，要把各实例的连接池、临时扩容和其他客户端一起算进预算。<strong>扩大某一个池，不能凭空增加数据库处理能力。</strong><Cite id="pool-capacity"/></p>
      <div className={base.contrast}><div><h3>先看借用</h3><p>请求是否及时归还、有没有在持有连接期间调用慢的外部服务、有没有长事务。</p></div><div><h3>再看容量</h3><p>等待人数、借用时长、超时、数据库负载和实例数量，要一起看才能确定调整方向。</p></div></div>
      <p>排查连接池问题时，先记录驱动版本、池大小、等待上限、实例数量、连接生命周期和真实异常。拿不到连接、建连失败、查询缓慢与连接断开对应不同环节，需要分别定位。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function ReplicationTermPage() {
  const Cite=({id}:{id:string})=><ArticleCitation id={id} sources={replicationSources}/>;
  return <ConceptArticle slug="replication" title="复制" sources={replicationSources} sections={[["changes","把变更持续传到另一台库"],["apply","收到变更与查到新值"],["choices","复制范围与确认条件"],["recovery","副本会接收正确操作，也会接收误删"]]}
    intro={<>为什么要维护两份数据库？常见答案是让副本承接一部分读取，或在主库故障时接管；代价是两边在一段时间内可能不一样。书名在主库里已经改好，请求落到副本上，查到的却还是原名。理解复制，需要把主库提交、变更传过去、副本应用、这次查询读到什么分开看。开场图展示的是复制追平之后的样子；这篇要看的，是追平之前的那段路。</>}
    hero={<ConceptHero slug="replication" label="主库已提交新书名，变更记录向副本移动，副本应用后才出现新书名"><div className={s.replicationHero}><div><Database size={24}/><span>主库 · 已提交</span><strong>山间来信 · 修订版</strong></div><code>变更</code><div><Database size={24}/><span>副本 · 已应用</span><strong>山间来信 · 修订版</strong></div></div></ConceptHero>}>
    <ArticleSection id="changes" title="把变更持续传到另一台库"><Legacy slug="replication" names={["question","definition"]}/>
      <p id="replica-stream" className="vp-citation-target"><strong>数据库复制将主库的数据变更传播到另一台机器，让副本跟随变化。</strong>PostgreSQL 会把变更先写进 WAL（预写日志），物理流复制把这些记录传给备库，也就是这里说的副本；副本再按顺序把这些记录重新执行一遍，也就是重放。下文演示里的“应用下一条变更”按钮，做的就是这个重放。这里的“提交”是指变更在主库正式落定，之后不会再撤销。默认的流复制是异步的：主库提交完就返回，不等副本确认。所以从主库提交到变更在副本上可见，中间可以有延迟；复制不是每次查询时再去主库取一次结果。<Cite id="replica-stream"/></p>
      <p>副本常见两种用法：承接能接受稍旧数据的读取（比如刷列表），以及在主库故障后顶替它。应用程序自己决定哪些请求发给副本、要求数据新到什么程度；故障后由哪台机器接管、客户端怎么转过去，都不随复制自动发生，要另行安排。本文只解释传播与读取。</p>
    </ArticleSection>
    <ArticleSection id="apply" title="收到变更与查到新值"><Legacy slug="replication" names={["scene-heading"]}/>
      <p>两库从同一本书开始，它的编号是 #42；这里的“行”就是表里代表一条书目记录的那一行。“提交改名”表示主库已经正式接受这次变更。已提交的变更会按顺序排队，每点一次“发送下一条变更”，就传走队首的一条；先提交改名，再查询副本；发送下一条变更，再查询；最后应用，再查询。改名应用后，主库的提交按钮会切换成“主库提交删除 #42”。随后提交删除，重复发送与应用。v1、v2 标记这个演示里两次已提交变更的先后，v0 是起点；它们只是演示给变更贴的标签，不是数据库自己给每条变更记的位置。查询会按当前已应用值取一个新快照，可以把它理解成“在这一刻给副本数据拍一张照片”。
      </p>
      <p>真实数据库里，发送和应用会持续自动发生；这里把它们拆成按钮，让你分别停在“主库已提交”“变更已到达副本”“副本已应用”和“这次查询可见”四个阶段。</p>
      <ReplicationLesson/>
      <p>应用后，右侧副本面板立刻显示已应用的新值；查询结果是每次查询取到的快照，所以要重新点“查询副本 #42”才会跟上。</p>
      <p id="replica-visible" className="vp-citation-target">备库可以作为热备运行：一边跟随主库更新，一边允许只读查询；变更到达副本后仍要重放才生效。事务（一组改动绑在一起，要么全生效要么全不算）的提交记录被重放之后，新开始的查询会取一份新快照，这才看得到这个事务的变化。事务究竟在什么时刻取这张“数据照片”，还受隔离级别（数据库规定查询在并发变更下能看到什么数据的规则）影响；这会在“事务”词条里展开。<strong>已收到记录、已应用记录、某次查询可见，是不同的观察点。</strong><Cite id="replica-visible"/></p>
      <p>演示故意让你手动发送和应用，便于观察差别。这里没有网络断开、磁盘写入确认、长期事务或节点切换，不能凭“发送”和“应用”这两个按钮，推断真实复制要花多久、有多可靠。</p>
    </ArticleSection>
    <ArticleSection id="choices" title="复制范围与确认条件"><Legacy slug="replication" names={["quiz-heading"]}/>
      <p id="replica-granularity" className="vp-citation-target">PostgreSQL 的物理复制按数据库文件里的数据块和字节传播变化，不按表和行挑选内容；逻辑复制按表和行传播变化，可以选择只复制哪些表。为了知道一条变更对应哪张表的哪一行，被复制的表需要一个能唯一确定行的复制标识（通常用主键，也就是每行独有的编号；演示里的 #42 就是这样的书目编号）。两者都叫复制，配置、边界和用途却不同；演示里“提交 → 传过去 → 应用”这个先后顺序，只用来表达传播过程，不是 WAL 真实的传输方式和逻辑复制的真实细节。<Cite id="replica-granularity"/></p>
      <p id="replica-sync" className="vp-citation-target">还要问主库提交时等不等副本的回音，这就是同步方式：异步不等，提交完直接返回；同步要等，等到哪一步可以配置。PostgreSQL 的 <code>remote_apply</code> 是等得更深的一档：等当前同步备库报告已重放该事务、数据在那台备库上可见，主库才返回“已提交”；其他确认方式会停在收到或写入等更早阶段，不等于已经重放、对查询可见。需要结合同步备库配置和具体提交设置，才知道它到底保证了什么；不能把“开了复制”直接解释成任意副本马上读到最新值。<Cite id="replica-sync"/></p>
      <div className={base.contrast}><div><h3>读扩展</h3><p>把能接受一些延迟的读取分配到副本，并检查实际应用进度。</p></div><div><h3>故障恢复</h3><p>选择可接管节点，核对可能丢失的提交，处理旧主节点和客户端切换。</p></div></div>
    </ArticleSection>
    <ArticleSection id="recovery" title="副本会接收正确操作，也会接收误删" className={base.offset}><Legacy slug="replication" names={["prompt-heading"]}/>
      <p>在主库删除 #42，副本最初还留着旧记录；等删除应用完，两边都是 0 行。副本跟随数据变化，不负责判断这一次删除是否符合业务意图；旧值只在传播追上来之前短暂存在，不能把它当成一个恢复方案。演示里的“回到初始状态”只是演示重置，真实副本一旦应用了变更，自己退不回过去的值。</p>
      <p id="replica-recovery" className="vp-citation-target"><strong>复制与备份解决的故障范围不同。</strong>PostgreSQL 的时间点恢复需要一份更早的完整数据备份（基础备份），以及一路保留下来的 WAL；恢复时可选择在某个目标点停止重放。保留历史与验证恢复过程，才有机会找回误删之前的状态；一个持续跟随最新变更的副本不能代替这套安排。<Cite id="replica-recovery"/></p>
      <ArticleAside title="评估复制需要的事实"><p>评估一套复制配置，要先把这些问清楚：数据库版本、物理或逻辑复制方式、复制范围、确认条件、主库和副本进度、允许丢失或延迟的范围、实际故障与切换办法。让它区分延迟读取、复制中断和应用冲突（变更到了副本却没能按预期应用），不要只回答“加一台副本”。</p></ArticleAside>
      <p>接着可读 <ConceptTerm slug="backup">备份</ConceptTerm>与 <ConceptTerm slug="transaction">事务</ConceptTerm>。复制让几份数据跟上最新变更，备份让你能回到更早的状态；这是两个目标，需要分别设计和验证。</p>
    </ArticleSection>
  </ConceptArticle>;
}
