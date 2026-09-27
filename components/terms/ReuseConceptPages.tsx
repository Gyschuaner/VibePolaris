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
    intro={<>读者打开书目详情，每次都需要 #42 的书名。应用可以先保留一次读取的结果，下一次按同一个键取回。少访问一次数据库是收益；数据库改名以后，副本还能用多久，是另一件需要决定的事。</>}
    hero={<ConceptHero slug="cache" label="数据库书名先被读取，再保存为book:42:title的缓存副本"><div className={s.cacheHero}><div><Database size={24}/><span>数据库 · #42</span><strong>山间来信</strong></div><div><Lightning size={24}/><code>book:42:title</code><strong>山间来信</strong></div></div></ConceptHero>}>
    <ArticleSection id="copy" title="为重复读取留一份副本"><Legacy slug="cache" names={["question","definition"]}/>
      <p id="cache-mechanism" className="vp-citation-target"><strong>缓存保留可重复使用的数据或计算结果，让后续访问有机会复用它。</strong>这里采用应用负责的 Cache-Aside：先查缓存，找不到就读数据库，把结果放入缓存并返回。Microsoft 的模式文档说明，这种按需加载需要应用维护副本；缓存产品本身不会自动知道数据库里的书名变了。<Cite id="cache-mechanism"/></p>
      <p>缓存可以在进程内，也可以由独立服务共享。本文观察一项书名数据，不把浏览器的 HTTP 缓存规则、数据库内部缓存、AI 提示缓存混为一种接口。<ConceptTerm slug="cache-control">Cache-Control</ConceptTerm>负责 HTTP 响应的缓存约定，是另一层机制。</p>
      <p id="cache-key" className="vp-citation-target">应用用 <code>book:42:title</code>标识这项副本。Redis 的 GET 按键读取字符串，键不存在时返回空值；它不会顺便查询你的业务数据库。<strong>命中表示找到了这个键的值，不表示这个值一定最新。</strong>键还需区分实际会影响结果的输入，避免把不同用户、语言或权限下的结果混用。<Cite id="cache-key"/></p>
    </ArticleSection>
    <ArticleSection id="read" title="命中与回源"><Legacy slug="cache" names={["scene-heading"]}/>
      <p>从空缓存开始读一次，再读一次；接着只修改数据库书名，观察缓存读取。使副本失效或推进到期，再读会重新回源并填入新值。本例只模拟一个键与两个书名；t 是手动推进的逻辑时间，每次回填有效 2 格，没有真实 Redis、数据库或耗时测量。</p>
      <CacheLesson/>
      <p>第一次未命中，原数据被读出并留下副本；第二次命中，直接返回副本。数据库变成“修订版”后，缓存仍可返回原名。页面并排展示两处数据供你比较；真实应用单凭一次命中，不能推断副本和原数据相等。</p>
    </ArticleSection>
    <ArticleSection id="fresh" title="副本与原数据一起变化吗"><Legacy slug="cache" names={["quiz-heading"]}/>
      <p id="cache-invalidating" className="vp-citation-target">Cache-Aside 的一种写入策略是<strong>先更新数据存储，再使对应缓存失效</strong>，下一次读取重新加载。Microsoft 提醒，若先删缓存再写数据库，中间的读取可能把旧值重新填回。操作顺序重要，但这两个独立动作也不因此变成一个原子事务。<Cite id="cache-invalidating"/></p>
      <p id="cache-consistency" className="vp-citation-target">外部程序修改数据库，或多个应用各有本地副本时，更新不会自动同步到所有缓存。Cache-Aside 不保证数据存储与缓存始终一致；需要根据可接受的新鲜度安排失效、到期或其他更新机制。本文按一次一个动作演示，没有解决并发读写中的所有竞争情况。<Cite id="cache-consistency"/></p>
      <div className={base.contrast}><div><h3>能接受短暂旧值</h3><p>书目说明这类数据，可以先确定可接受的延迟，再选择副本期限与更新办法。</p></div><div><h3>需要当前事实</h3><p>是否还有库存、是否允许借阅，需要结合实际一致性要求判断，不能只凭缓存里的书名或数量作决定。</p></div></div>
    </ArticleSection>
    <ArticleSection id="capacity" title="过期与容量淘汰" className={base.offset}><Legacy slug="cache" names={["prompt-heading"]}/>
      <p id="cache-expiry" className="vp-citation-target">Redis 的 EXPIRE 为键设置存活时间，期限到达后键会被删除。<strong>到期移除副本，不是自动把副本改成数据库的新值。</strong>本例到期后要再读取，应用才回源并回填。期限长短需要结合变化频率与读取成本决定，不能从“设置了 TTL”推断每次读取都最新。<Cite id="cache-expiry"/></p>
      <ArticleAside title="容量不足也会让副本消失"><p id="cache-eviction" className="vp-citation-target">即使还没到期，缓存也可能因容量策略淘汰键。Redis 的 maxmemory-policy 可以选择 LRU、LFU 等策略；noeviction 不淘汰键，而可能拒绝新增数据的命令。Redis 的 LRU 是近似算法。过期、主动失效与容量淘汰触发条件不同，应用应能处理下一次未命中。<Cite id="cache-eviction"/></p></ArticleAside>
      <p>缓存是否值得保留，要看键的组成、数据变化、可接受的旧值时长、失效方式、容量与未命中路径。再核对实际命中率、回源压力和错误；本页没有给出固定的提速倍数。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function PoolTermPage() {
  const Cite=({id}:{id:string})=><ArticleCitation id={id} sources={poolSources}/>;
  return <ConceptArticle slug="connection-pool" title="连接池" sources={poolSources} sections={[["reuse","请求结束，连接可以留下"],["lease","两条连接，三个请求"],["return","结束事务，再归还连接"],["limit","池大小与数据库容量"]]}
    intro={<>每次查书目都重新建立数据库连接，会重复连接与认证的工作。应用可以借用已有连接，用完交还。多个请求同时到来时，问题又变成：谁正在占用连接，后来者等在哪里，等多久。</>}
    hero={<ConceptHero slug="connection-pool" label="两条既有连接分别被A和B借用，C先等待，A归还后C借用同一连接"><div className={s.poolHero}><div><span>连接 1</span><strong>A</strong><em>C</em></div><div><span>连接 2</span><strong>B</strong></div><span>C</span><ArrowDownLeft size={25}/></div></ConceptHero>}>
    <ArticleSection id="reuse" title="请求结束，连接可以留下"><Legacy slug="connection-pool" names={["question","definition"]}/>
      <p id="pool-mechanism" className="vp-citation-target"><strong>连接池维护可借用、可归还的一组连接，复用连接并管理并发使用量。</strong>Psycopg 的池向需要数据库操作的调用提供连接；已有空闲连接可以直接交给调用者，用完再返回。池保存的是连接资源，不是上一条 SQL 的查询结果。<Cite id="pool-mechanism"/></p>
      <p id="pool-lazy" className="vp-citation-target">“有一个池”也不一定代表启动时已创建全部连接。SQLAlchemy 的池按首次使用建立连接，QueuePool 可以设置 pool_size、max_overflow 与等待上限；Psycopg 的启动准备方式不同。配置要看所用驱动和池，不能把一个实现的默认值套给所有应用。<Cite id="pool-lazy"/></p>
      <p>一条连接承载数据库会话与操作，它与程序里的 <ConceptTerm slug="orm">ORM</ConceptTerm> Session、HTTP 请求不是同一个对象。这里用一次借用期间由一个请求持有的模型，不讨论协议级流水线或同一连接的并发复用。</p>
    </ArticleSection>
    <ArticleSection id="lease" title="两条连接，三个请求"><Legacy slug="connection-pool" names={["scene-heading"]}/>
      <p>池里已有两条健康连接，不允许临时扩容。让 A、B、C 依次借用；第三个请求只能等待。完成并归还一条连接后，等待者接手同一资源。另一条路径中，让等待达到上限，再归还连接，观察超时请求会不会被重新发放资源。</p>
      <PoolLesson/>
      <p id="pool-waiting" className="vp-citation-target">Psycopg 的池在没有可用连接时把调用放入等待队列，并支持 timeout 等限制。<strong>等待连接超时与 SQL 执行超时发生在不同阶段。</strong>尚未获得连接的请求没有因此完成查询。演示由按钮推进等待上限，只表示容量与借还关系，没有运行 SQL 或真实计时。<Cite id="pool-waiting"/></p>
      <p>归还之后，连接仍在池里，可以给另一个请求。这里按到达顺序交接只有一个等待者的队列；实际池可能有不同的排队、连接选择与扩容策略。</p>
    </ArticleSection>
    <ArticleSection id="return" title="结束事务，再归还连接"><Legacy slug="connection-pool" names={["quiz-heading"]}/>
      <p id="pool-release" className="vp-citation-target">成功借到连接后，查询失败也要按驱动约定归还。node-postgres 文档提醒，不释放 client 会泄漏资源，最终耗尽池。可用 try / finally 保护归还动作；下面假定已创建 pool，只展示一条参数化查询的借还范围。<Cite id="pool-release"/></p>
      <pre className={base.code}>{'const client = await pool.connect();\ntry {\n  await client.query(\n    "SELECT title FROM books WHERE book_id = $1",\n    [42]\n  );\n} finally {\n  client.release();\n}'}</pre>
      <p id="pool-reset" className="vp-citation-target">归还也要处理连接上的事务状态。SQLAlchemy 默认的 reset-on-return 会清理未提交事务状态，包括相关锁；现代 Connection 与 Pool 会协调这个动作。<strong>归还连接不是提交成功的凭据。</strong>需要提交的数据仍要有明确的 <ConceptTerm slug="transaction">事务</ConceptTerm>边界，临时表或其他会话状态还可能需要额外清理。<Cite id="pool-reset"/></p>
      <ArticleAside title="空闲连接也可能已经断开"><p id="pool-disconnect" className="vp-citation-target">SQLAlchemy 的 pre_ping 可以在借出时检查连接并处理失效连接，但它不能挽救正在执行中断开的事务。一次操作中途丢失连接，应用仍需处理失败并判断是否重做整个事务，不能把健康检查当成自动恢复所有查询。<Cite id="pool-disconnect"/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="limit" title="池大小与数据库容量" className={base.offset}><Legacy slug="connection-pool" names={["prompt-heading"]}/>
      <p id="pool-capacity" className="vp-citation-target">PostgreSQL 的 max_connections 限制同时连接数量，增大配置也会增加相应资源分配。一个服务部署多个实例时，要把各实例的连接池、临时扩容和其他客户端一起算进预算。<strong>扩大某一个池，不能凭空增加数据库处理能力。</strong><Cite id="pool-capacity"/></p>
      <div className={base.contrast}><div><h3>先看借用</h3><p>请求是否及时归还、是否把慢外部调用放在持有连接的期间、有没有长事务。</p></div><div><h3>再看容量</h3><p>等待人数、借用时长、超时、数据库负载和实例数量一起决定调整方向。</p></div></div>
      <p>连接池排查先记录驱动版本、池大小、借用等待上限、实例数量、连接生命周期和真实异常。拿不到连接、建连失败、查询缓慢与连接断开对应不同环节，需要分别定位。</p>
    </ArticleSection>
  </ConceptArticle>;
}
export function ReplicationTermPage() {
  const Cite=({id}:{id:string})=><ArticleCitation id={id} sources={replicationSources}/>;
  return <ConceptArticle slug="replication" title="复制" sources={replicationSources} sections={[["changes","把变更持续传到另一台库"],["apply","收到变更与查到新值"],["choices","复制范围与确认条件"],["recovery","副本会接收正确操作，也会接收误删"]]}
    intro={<>书名在主库里已经改好，读者从副本查询却还看到原名。两边的 SQL 都可以执行成功，结果仍有差别。理解复制，需要把提交、传播和应用变更分开，再问这一次查询读到了哪个进度。</>}
    hero={<ConceptHero slug="replication" label="主库已提交新书名，变更记录向副本移动，副本应用后才出现新书名"><div className={s.replicationHero}><div><Database size={24}/><span>主库 · 已提交</span><strong>山间来信 · 修订版</strong></div><code>变更</code><div><Database size={24}/><span>副本 · 已应用</span><strong>山间来信 · 修订版</strong></div></div></ConceptHero>}>
    <ArticleSection id="changes" title="把变更持续传到另一台库"><Legacy slug="replication" names={["question","definition"]}/>
      <p id="replica-stream" className="vp-citation-target"><strong>数据库复制将源节点的数据变更传播到其他节点，让副本跟随变化。</strong>PostgreSQL 的物理流复制向备库传送 WAL 记录，备库重放这些记录。默认异步流复制下，主库提交到副本可见之间可以有延迟；复制不是每次查询时再去主库取一次结果。<Cite id="replica-stream"/></p>
      <p>副本可以用于适当的读取或故障恢复，但应用还要选择读取节点、决定新鲜度要求，并安排故障切换。本文只解释传播与读取，一次主库提交不会自动把客户端地址切换到另一个数据库。</p>
    </ArticleSection>
    <ArticleSection id="apply" title="收到变更与查到新值"><Legacy slug="replication" names={["scene-heading"]}/>
      <p>两库从同一个 #42 书目开始。提交改名，查询副本；发送下一条变更，再查询；最后应用，再查询。随后提交删除，重复发送与应用。v0、v1、v2 仅是本站两条已提交变更的顺序，不是 PostgreSQL 的实际 WAL 位置；每次查询按当前已应用值取一个新快照。</p>
      <ReplicationLesson/>
      <p id="replica-visible" className="vp-citation-target">PostgreSQL 热备接收只读查询。变更到达仍需要重放；事务提交记录被重放后，后续新快照才看得到该事务的变化。查询或事务何时取得快照，还受隔离级别影响。<strong>已收到记录、已应用记录、某次查询可见，是不同的观察点。</strong><Cite id="replica-visible"/></p>
      <p>演示故意让你手动发送和应用，便于观察差别；实际复制会持续工作。这里没有网络断开、磁盘写入确认、长期事务或节点切换，不能从两步按钮推断真实复制耗时与可靠性。</p>
    </ArticleSection>
    <ArticleSection id="choices" title="复制范围与确认条件"><Legacy slug="replication" names={["quiz-heading"]}/>
      <p id="replica-granularity" className="vp-citation-target">PostgreSQL 的物理复制以数据块与字节级变化为基础；逻辑复制依据数据对象及其复制标识传播变化，可以更细地控制复制内容。两者都叫复制，配置、边界和用途却不同；本文的顺序模型只表达传播过程，不伪装成真实 WAL 或逻辑订阅协议。<Cite id="replica-granularity"/></p>
      <p id="replica-sync" className="vp-citation-target">同步方式还要问“提交在等哪个确认”。PostgreSQL 的 remote_apply 会等待当前同步备库报告已重放事务，使之可见；其他确认方式不都等同于这一步。需要结合同步备库配置和具体提交设置理解保证，不能把“开了复制”直接解释成任意副本马上读到最新值。<Cite id="replica-sync"/></p>
      <div className={base.contrast}><div><h3>读扩展</h3><p>把能接受相应新鲜度的读取分配到副本，并检查实际应用进度。</p></div><div><h3>故障恢复</h3><p>选择可接管节点，核对可能丢失的提交，处理旧主节点和客户端切换。</p></div></div>
    </ArticleSection>
    <ArticleSection id="recovery" title="副本会接收正确操作，也会接收误删" className={base.offset}><Legacy slug="replication" names={["prompt-heading"]}/>
      <p>在主库删除 #42，副本最初还留着旧记录；等删除也应用完，两边都成为 0 行。副本跟随数据变化，不负责判断这一次删除是否符合业务意图。延迟期间碰巧还有一份旧值，不能当成已经安排好的恢复方案。</p>
      <p id="replica-recovery" className="vp-citation-target"><strong>复制与备份解决的故障范围不同。</strong>PostgreSQL 的时间点恢复需要适用的基础备份与保留的 WAL，恢复时可选择在某个目标点停止重放。保留历史与验证恢复过程，才有机会找回误删之前的状态；一个持续跟随最新变更的副本不能代替这套安排。<Cite id="replica-recovery"/></p>
      <ArticleAside title="评估复制需要的事实"><p>提供数据库版本、物理或逻辑复制方式、复制范围、确认条件、主库和副本进度、允许丢失或延迟的范围、实际故障与切换办法。让它区分延迟读取、复制中断和应用冲突，不要只回答“加一台从库”。</p></ArticleAside>
      <p>接着可读 <ConceptTerm slug="backup">备份</ConceptTerm>与 <ConceptTerm slug="transaction">事务</ConceptTerm>。复制保留多处数据；这些节点之间如何传播，历史状态怎样恢复，是两项分别需要设计和验收的能力。</p>
    </ArticleSection>
  </ConceptArticle>;
}
