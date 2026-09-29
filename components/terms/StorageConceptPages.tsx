import { BookOpen, Check, Database, Files, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleAside, ArticleCitation, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { DatabaseLesson, IndexLesson, TransactionLesson } from "./StorageConceptLessons";
import { databaseSources, indexSources, transactionSources } from "@/lib/storage-sources";
import s from "./StorageConcepts.module.css";
import base from "./EventConcepts.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>;
}

export function DatabaseTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={databaseSources} />;
  return <ConceptArticle slug="database" title="数据库" sources={databaseSources}
    sections={[["records", "界面背后的记录"], ["catalogue", "保存一次，再查一次"], ["rules", "数据也有规则"], ["where", "数据放在哪里"]]}
    intro={<>在下面的图书室演示里，把 #42 的草稿改成“已借出”但不保存，重开编辑界面时，草稿又会变回“可借”。点“保存修改”后，书目里的记录才改成“已借出”；另一位读者若通过同一个图书室服务访问这份书目，重新查询也能看到新状态。数据库负责组织、保存和取回记录，页面只是入口。实际网站若会自动保存，草稿的表现可能不同。</>}
    hero={<ConceptHero slug="database" label="编辑页将42号书改为已借出并保存；编辑页关闭后，书目记录保留，重新打开或另一位读者查询都能读到已借出状态"><div className={s.databaseHero}>
      <div className={s.heroEditor}>
        <div className={s.heroDraft}><span>编辑 #42</span><strong>已借出</strong></div>
        <div className={s.heroReopen}><span>重新打开</span><strong>#42　已借出</strong></div>
      </div>
      <span className={s.heroSave}>保存</span>
      <div className={s.heroTable}><div><Database size={21} /><span>书目</span></div><p>#42 <span className={s.heroOld}>可借</span><strong className={s.heroNew}>已借出</strong></p><p>#78 <span>可借</span></p></div>
      <div className={s.heroQuery}><MagnifyingGlass size={18} /><span>另一位读者查 #42</span><strong>已借出</strong></div>
    </div></ConceptHero>}>
    <ArticleSection id="records" title="界面背后的记录">
      <Legacy slug="database" names={["question", "definition"]} />
      <p id="database-relations" className="vp-citation-target"><strong>数据库是按一定结构组织的数据集合；管理这些数据的软件叫数据库管理系统，简称 DBMS。</strong>日常说“用 PostgreSQL 做数据库”，往往把两者放在一起说。本文以关系型数据库为例，这里的“关系”可以先理解为表：书目是一张表，一行是一条记录，编号、书名、可借状态是列。<Cite id="database-relations" /></p>
      <p id="database-query" className="vp-citation-target">查询是向数据库提出条件，取回符合条件的记录。比如“只看可借”，#42 已借出后就不会出现在新结果里，但记录并没有被删掉；查全部书目时仍能找到它。<Cite id="database-query" /></p>
      <p>本演示已经显示的上次查询结果不会自动改写，需要再查一次。真实应用若想让结果随记录变化，还得另外实现自动更新。</p>
      <p id="database-service" className="vp-citation-target">在 PostgreSQL 的客户端与服务端结构中，数据库服务管理数据文件，处理多个客户端的请求。网页通常先把操作交给网站自己的服务程序（也叫后端），再由它访问数据库。这个图书室例子假定两位读者都通过同一服务读写同一份书目，所以一人保存成功，另一人重新查询就能看到新状态；如果各自打开的是本机的一份书目副本，就不能这样共享。<Cite id="database-service" /></p>
      <p>不用数据库，也能把书目写进普通文件，离开页面后再打开；只是应用得自己处理记录的组织、查找和修改。数据库把这些常见工作做成可复用的能力，还能按事先定义的规则检查写入。它不是“数据能留下”的唯一办法。</p>
    </ArticleSection>
    <ArticleSection id="catalogue" title="保存一次，再查一次">
      <Legacy slug="database" names={["scene-heading"]} />
      <p>下面从 #42“可借”开始。先取消草稿里的“可借”勾选，再查一次可借书目：#42 仍在结果里，因为还没保存。点“保存修改”，已保存书目中的 #42 才变为“已借出”；刚才那份查询结果仍是旧的。再次查询，#42 才从可借结果里消失。点“重开编辑界面”，草稿会从已保存记录重新填入“已借出”，上次查询结果仍留在原处。</p>
      <DatabaseLesson />
      <p><strong>草稿、已保存记录、上次查询结果，是三份不同的信息。</strong>修改草稿不会改变书目；保存才更新记录；查询把当次结果带回页面。这个演示只在当前浏览器页面内保存状态：“重开编辑界面”不会丢掉已经保存的修改，整页刷新却会把演示数据恢复原样。它不连接真实数据库；真实应用重启后能否恢复，还取决于存储方式和配置。</p>
    </ArticleSection>
    <ArticleSection id="rules" title="数据也有规则" className={base.offset}>
      <Legacy slug="database" names={["quiz-heading"]} />
      <p id="database-rules" className="vp-citation-target">数据库可以用约束拒绝不符合规则的写入：把编号设为主键，就不能有两条记录使用同一个编号；再定义检查约束，还能拒绝负数。<strong>这些规则需要开发者定义，数据库不会自动猜出业务含义。</strong>上面的演示只有“可借／已借出”两个状态；如果实际书目还保存可借本数，才需要数量规则。<Cite id="database-rules" /></p>
      <div className={s.ruleList}><div><strong>编号不能重复</strong><code>book_id = 42</code><p>把 book_id 设为主键后，另一条记录就不能也用 42；书名变了，仍是这条记录。</p></div><div><strong>还剩几本</strong><code>copies_available &gt;= 0</code><p>为另设的可借本数字段定义规则，拒绝负数。</p></div></div>
      <p>如果一次借书要同时减少可借数量、增加借阅记录，就需要继续考虑 <ConceptTerm slug="transaction">事务</ConceptTerm>：怎样让两次修改一起成功或一起撤销。书目很多、查询变慢时，则要看 <ConceptTerm slug="index">索引</ConceptTerm>：怎样少翻无关记录，尽快找到目标。</p>
    </ArticleSection>
    <ArticleSection id="where" title="数据放在哪里">
      <Legacy slug="database" names={["prompt-heading"]} />
      <p id="database-embedded" className="vp-citation-target">数据库不一定是一台远程服务器。SQLite 可以嵌入应用，管理设备上的数据库文件；PostgreSQL 这类服务常用于多个客户端访问同一份数据。比如离线记事应用可以把笔记存在本机数据库里；换台设备能否看到笔记，还要看应用有没有设计同步或共同访问的服务。光是把笔记存进 SQLite，不会自动同步到平板。<Cite id="database-embedded" /></p>
      <ArticleAside title="数据设计前的必要信息">
        <p>本演示把 #42 当作一本可借的实物。真实图书室可能有好几本《山间来信》：书名相同，每本实物却各有编号，还可能单独记录这个书名剩下几本可借。设计数据时要说明哪些编号必须唯一、哪些记录要关联、哪几次写入必须一起成功。把这些问题说清，再讨论表结构与查询。</p>
      </ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function IndexTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={indexSources} />;
  return <ConceptArticle slug="index" title="索引" sources={indexSources}
    sections={[["lookup", "给记录多一条查找路径"], ["search", "先定位，再读记录"], ["tradeoff", "读得更快，也要多维护"], ["plan", "用执行计划核对路径"]]}
    intro={<>按编号找一本书，可以逐条检查书目，也可以先查一份按编号排列的目录。目录告诉我们书目中的位置，再去那里读书名。两种方法找到的是同一本书，区别在于中途翻查了多少无关内容。</>}
    hero={<ConceptHero slug="index" label="查找64号书：先比较目录中间的42，排除左半；再找到64号对应的原书目位置5，读取设计札记"><div className={s.indexHero}><div className={s.indexTarget}><MagnifyingGlass size={21} />找 #64</div><div className={s.indexDirectory}>{[8, 12, 29, 37, 42, 51, 64, 78, 90].map(id => <span key={id}>{id}</span>)}</div><div className={s.indexRecord}><BookOpen size={23} /><span>原书目位置 5</span><strong>#64 · 设计札记</strong></div></div></ConceptHero>}>
    <ArticleSection id="lookup" title="给记录多一条查找路径">
      <Legacy slug="index" names={["question", "definition"]} />
      <p id="index-purpose" className="vp-citation-target"><strong>索引是数据库额外维护的查找结构，用来更快地定位特定查询需要的数据。</strong>没有合适的索引时，数据库可能逐行扫描；有索引时，可以沿着另一条路径找到候选记录。是否走索引，要看查询条件和预计花费的工作量，并非建了就一定用。<Cite id="index-purpose" /></p>
      <p id="index-directory" className="vp-citation-target">这份演示目录按编号排列，只记编号和原书目位置：#64 对应位置 5。先在目录中定位 #64，再去书目的第 5 条读“设计札记”。SQLite 官方文档里的普通索引查找也分两步：先按查询值取得指向原记录的标识，再据此读取表中的其他字段；这里的标识不是演示中的“第 5 条”序号。<strong>只有索引本身有序，原表不会因为建了索引就跟着重排。</strong>演示里的目录不记书名，所以定位之后还要回原书目读；如果某个索引连书名也存了，而查询只需要编号和书名，就可能直接从索引取结果。这种情况叫覆盖索引。<Cite id="index-directory" /></p>
      <p id="index-order" className="vp-citation-target">同一份书目、同一个查询条件下，走哪条路都该找到同一批记录；但目录有序，不代表查询结果自动按编号显示。要指定返回顺序，查询还需要写明排序条件。<Cite id="index-order" /></p>
    </ArticleSection>
    <ArticleSection id="search" title="先定位，再读记录">
      <Legacy slug="index" names={["scene-heading"]} />
      <p>这九本书各有唯一编号，查找期间书目不变，找到一本便可以停。先查 #64，再查不存在的 #65；也试试书目第一条 #42。目录从小到大排列，拿中间的 #42 与目标 #64 比：42 更小，它和左边的编号便都不可能是 64；剩下只需查右边。每次按大小缩小候选范围，这里叫二分查找。演示把索引简化成有序数组，比较次数只针对这个小模型，不是真实的 B-tree 索引或性能测试。</p>
      <IndexLesson />
      <p>查 #64 时，顺序扫描要检查到第 5 条；目录先比较 #42，再比较 #64，随后按原书目位置读取书名。换成 #42，顺序扫描第一条就能找到。<strong>少量样本不能证明某种方案永远更快。</strong>查 #65 时，两种路径都必须在范围耗尽后明确返回“未找到”。</p>
      <p id="index-types" className="vp-citation-target">真实索引有不同结构。PostgreSQL 默认的 B-tree 是多层树状结构，不是演示里平铺的九个数；它可帮助查“编号等于 64”，也可帮助查“编号在 60 到 80 之间”。Hash 索引只支持前一种等值比较。演示里的逐次排除只是解释有序查找，不能当成所有索引的工作方式。<Cite id="index-types" /></p>
    </ArticleSection>
    <ArticleSection id="tradeoff" title="读得更快，也要多维护" className={base.offset}>
      <Legacy slug="index" names={["quiz-heading"]} />
      <p id="index-cost" className="vp-citation-target">开发者按查询需要选择列、建立索引；建好后，数据库会随表的修改更新它，不用每次手工改目录。索引占用额外空间，数据插入、修改或删除时，相关索引也得跟着更新。给很少查询的列加索引，可能付出了写入成本却没得到读性能收益。优先围绕实际频繁、昂贵的查询设计，再核对收益。<Cite id="index-cost" /></p>
      <div className={s.tradeoff}><div><MagnifyingGlass size={28} weight="light" /><h3>一次查询</h3><p>希望少读无关记录。</p></div><div><Files size={28} weight="light" /><h3>一次修改</h3><p>可能同时维护表与索引。</p></div></div>
    </ArticleSection>
    <ArticleSection id="plan" title="用执行计划核对路径">
      <Legacy slug="index" names={["prompt-heading"]} />
      <p id="index-plan" className="vp-citation-target">在 PostgreSQL 中，可以用 <code>EXPLAIN</code> 查看数据库打算怎样查。数据库参考表的行数和取值的大致分布，估计每条查找路线的成本。表很小时，直接读完可能省事；如果查询要取回大部分记录，沿索引找到许多位置再逐条回表，也可能不如顺着表读。拿接近实际的数据量和分布去试，不要一看计划没走索引就认定出错。<Cite id="index-plan" /></p>
      <ArticleAside title="一个检查入口">
        <pre className={base.code}>{'EXPLAIN\nSELECT title FROM books WHERE book_id = 64;'}</pre>
        <p>先看它打算走哪条路径、预计返回多少行，再决定是否调整索引。这里没有运行这条 SQL，也没有提供虚构的毫秒数。实际测量还会受到缓存、存储和并发负载影响。</p>
      </ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function TransactionTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={transactionSources} />;
  return <ConceptArticle slug="transaction" title="事务" sources={transactionSources}
    sections={[["unit", "一次借书，两处修改"], ["borrow", "一起提交，或者撤回"], ["visibility", "并发事务的可见性"], ["recovery", "提交之后与事务之外"]]}
    intro={<>借出一本书，要减少可借数量，还要新增借阅记录。如果第一步成功，第二步失败，就会出现“书少了一本，却找不到谁借走”的情况。这两次写入需要共同的完成边界。</>}
    hero={<ConceptHero slug="transaction" label="减少一本可借数量与新增借阅记录合成同一个提交包"><div className={s.transactionHero}><div><span><BookOpen size={23} />可借 −1</span><span><Files size={23} />借阅 +1</span></div><p><Check size={24} />一起提交</p></div></ConceptHero>}>
    <ArticleSection id="unit" title="一次借书，两处修改">
      <Legacy slug="transaction" names={["question", "definition"]} />
      <p id="transaction-unit" className="vp-citation-target"><strong>事务把一组数据库操作放在同一个工作单元中：提交使整组改动生效，回滚撤销这组尚未提交的改动。</strong>这体现了原子性。对于这里的借书业务，只成功减少数量还不算完成，借阅记录也必须写入。<Cite id="transaction-unit" /></p>
      <p>事务范围要由应用划定。它不会自动识别“这两条 SQL 属于同一次借书”，也不会修正写错的条件。开始事务之后，应用仍需检查每一步的结果，再决定提交还是回滚。</p>
    </ArticleSection>
    <ArticleSection id="borrow" title="一起提交，或者撤回">
      <Legacy slug="transaction" names={["scene-heading"]} />
      <p>样例从可借 2 本、借阅 0 条开始。先走通一次借书，再让第二步失败；最后取消“一起提交”，比较第一步是否已经对外生效。模型只演示这两项状态，时间由操作推进，不执行真实 SQL。</p>
      <TransactionLesson />
      <p>同一事务里，减少数量只是中间状态。写入借阅记录成功后，提交才把“可借 1 本、借阅 1 条”一起留下；失败后回滚，则仍是“2 本、0 条”。分开提交时，第一步已经留下“1 本、0 条”，不能用后来失败的事务把它顺带撤回。</p>
      <p id="transaction-autocommit" className="vp-citation-target">“分开提交”并不是完全没有事务。PostgreSQL 在显式事务块之外，会把单条语句作为一个隐式事务处理；客户端库也可能替你开启事务。这里比较的是<strong>两步共用一个事务，还是各自提交</strong>。排查真实代码时，要核对连接与客户端的自动提交行为。<Cite id="transaction-autocommit" /></p>
    </ArticleSection>
    <ArticleSection id="visibility" title="并发事务的可见性" className={base.offset}>
      <Legacy slug="transaction" names={["quiz-heading"]} />
      <p id="transaction-visible" className="vp-citation-target">演示的下层表示“此时另一个客户端发起新查询能看到什么”。以 PostgreSQL 默认的 Read Committed 为例，一次普通查询读取开始时已经提交的数据，不读取其他事务尚未提交的修改；事务内部可以读到自己的修改。更强的隔离级别可能继续使用较早的快照，因此不能说所有读者会在提交瞬间自动看到新值。<Cite id="transaction-visible" /></p>
      <p>原子性回答“一组改动是否整体生效”，隔离性回答“并发操作怎样相互影响”。两个人同时借最后一本书，还要用合适的更新条件、约束与并发控制来处理；单纯包上 BEGIN 和 COMMIT 并不能证明业务正确。</p>
      <p id="transaction-engines" className="vp-citation-target">具体行为还取决于数据库。SQLite 允许多个读事务，但同时只允许一个写事务；写入或提交可能遇到忙碌错误。错误是否自动回滚也有条件。应用需要根据驱动返回的真实结果结束或重试事务，不能把“执行过提交语句”当作“提交已成功”。<Cite id="transaction-engines" /></p>
    </ArticleSection>
    <ArticleSection id="recovery" title="提交之后与事务之外">
      <Legacy slug="transaction" names={["prompt-heading"]} />
      <p id="transaction-recovery" className="vp-citation-target">已提交数据的故障恢复需要存储机制支持。PostgreSQL 使用预写日志 WAL：描述改动的日志先写入持久存储，数据页可以稍后写入；崩溃恢复时，再按日志重放必要改动。因此提交不等于每个数据页都已经逐一写回，持久性也不能脱离具体配置与存储条件来谈。<Cite id="transaction-recovery" /></p>
      <p id="transaction-boundary" className="vp-citation-target">回滚也不是“撤销程序刚才做过的一切”。例如 PostgreSQL 的序列编号增长不会随事务中止而回退。已经发出的邮件、另一个系统完成的操作，更不在这组普通数据库写入的回滚范围内。<Cite id="transaction-boundary" /></p>
      <p>一次借书提交后，如果客户端没有等到响应又重发请求，还需要 <ConceptTerm slug="idempotency">幂等性</ConceptTerm>避免重复借出。事务处理一次执行内部的整体性，幂等处理同一意图重复到达时的效果；一个请求可能同时需要两者。</p>
    </ArticleSection>
  </ConceptArticle>;
}
