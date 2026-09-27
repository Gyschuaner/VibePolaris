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
    intro={<>图书室把一本书标成“已借出”，关掉页面再打开，状态还应该在。另一个人查询书目，也应该能读到这次修改。页面只是查看和编辑的入口，记录需要有自己的存放与管理方式。</>}
    hero={<ConceptHero slug="database" label="书目数据保留在表中，可借查询只返回符合条件的记录"><div className={s.databaseHero}><div className={s.heroTable}><Database size={24} /><span>书目</span><p>42　可借</p><p>12　已借出</p><p>78　可借</p></div><div className={s.heroQuery}><MagnifyingGlass size={20} /><span>可借</span><strong>42　78</strong></div></div></ConceptHero>}>
    <ArticleSection id="records" title="界面背后的记录">
      <Legacy slug="database" names={["question", "definition"]} />
      <p id="database-relations" className="vp-citation-target"><strong>数据库是按一定结构组织的数据集合；管理这些数据的软件叫数据库管理系统，简称 DBMS。</strong>日常说“用 PostgreSQL 做数据库”，往往把两者放在一起说。本文以关系型数据库为例：书目是一张表，一行是一条记录，编号、书名、可借状态是列。其他数据库也可能按文档、键值等方式组织数据。<Cite id="database-relations" /></p>
      <p>查询得到的是符合条件的结果。把“全部书目”切成“仅看可借”，只会改变取出的记录，不会删掉已借出的书。界面中的一份查询结果，也不会因为别处刚保存了修改就自动变成最新内容；应用需要重新查询或订阅变化。</p>
      <p id="database-service" className="vp-citation-target">在 PostgreSQL 的客户端与服务端结构中，数据库服务管理数据文件，接受多个客户端的操作。网页通常先把请求交给应用后端，再由后端访问数据库。关闭网页不会要求数据库服务删除书目；这种职责分离，让不同界面能够使用同一份记录。<Cite id="database-service" /></p>
    </ArticleSection>
    <ArticleSection id="catalogue" title="保存一次，再查一次">
      <Legacy slug="database" names={["scene-heading"]} />
      <p>先修改 #42 的可借状态，不急着保存；查询一次，再保存并重新查询，比较结果。还可以重开编辑界面，看看草稿和已保存记录各自留下了什么。下面是浏览器内的教学模型，整页刷新会重置，不连接真实数据库。</p>
      <DatabaseLesson />
      <p><strong>草稿、已保存记录、上次查询结果，是三份不同的信息。</strong>修改草稿还没有发出写入；保存成功才改变记录；查询把当时的数据带回界面。演示中“重开界面”只重建客户端状态，因此保存的记录仍在。真实应用能否在进程重启后恢复数据，还要看存储方式和持久化配置。</p>
    </ArticleSection>
    <ArticleSection id="rules" title="数据也有规则" className={base.offset}>
      <Legacy slug="database" names={["quiz-heading"]} />
      <p id="database-rules" className="vp-citation-target">保存不只是把内容放进去。数据库可以用约束拒绝不符合规则的写入：主键标识唯一且非空的记录，检查约束可以限制可借数量不为负，外键可以要求借阅记录引用的书确实存在。<strong>这些规则需要开发者定义，数据库不会自动猜出业务含义。</strong><Cite id="database-rules" /></p>
      <div className={s.ruleList}><div><strong>哪本书</strong><code>book_id = 42</code><p>用稳定编号引用，书名修改后仍是同一条记录。</p></div><div><strong>借出了几本</strong><code>available &gt;= 0</code><p>让数据库拒绝负数；应用同时检查操作结果。</p></div></div>
      <p>如果一次借书要同时减少可借数量、增加借阅记录，就需要继续考虑 <ConceptTerm slug="transaction">事务</ConceptTerm>。如果书目很多、查询变慢，则要看 <ConceptTerm slug="index">索引</ConceptTerm>。它们分别处理一组操作的边界与查找路径。</p>
    </ArticleSection>
    <ArticleSection id="where" title="数据放在哪里">
      <Legacy slug="database" names={["prompt-heading"]} />
      <p id="database-embedded" className="vp-citation-target">数据库不一定是一台远程服务器。SQLite 可以嵌入应用，管理本机的数据库文件；PostgreSQL 这类服务则常用于多个客户端共享数据。前者适合许多本地应用，后者便于集中管理与并发访问。要根据谁读写、从哪里访问、怎样运维来选择，而不是把“数据库”一概理解成云服务。<Cite id="database-embedded" /></p>
      <ArticleAside title="数据设计前的必要信息">
        <p>说明要保存哪些对象、哪些编号必须唯一、对象怎样关联，以及哪几次写入必须一起成功。图书室还需要区分“书的品种”与“可借出的具体一本”。先把这些关系说清，再讨论表结构和查询，不要只发一句“加个数据库”。</p>
      </ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function IndexTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={indexSources} />;
  return <ConceptArticle slug="index" title="索引" sources={indexSources}
    sections={[["lookup", "给记录多一条查找路径"], ["search", "先定位，再读记录"], ["tradeoff", "读得更快，也要多维护"], ["plan", "用执行计划核对路径"]]}
    intro={<>按编号找一本书，可以逐条检查书目，也可以先查一份有序目录。两种方法应该找到同一本书，差别在于为了找到它，要检查多少不相关的内容。</>}
    hero={<ConceptHero slug="index" label="有序目录缩小候选范围，定位编号64的记录"><div className={s.indexHero}><MagnifyingGlass size={28} /><div>{[8, 12, 29, 37, 42, 51, 64, 78, 90].map((id, i) => <span key={id} data-order={i}>{id}</span>)}</div><p><BookOpen size={24} />64 · 设计札记</p></div></ConceptHero>}>
    <ArticleSection id="lookup" title="给记录多一条查找路径">
      <Legacy slug="index" names={["question", "definition"]} />
      <p id="index-purpose" className="vp-citation-target"><strong>索引是数据库额外维护的查找结构，用来更快地定位特定查询需要的数据。</strong>没有合适的索引时，数据库可能逐行扫描；有索引时，可以沿着另一条路径找到候选记录。索引是否被采用，由查询条件和执行成本等因素共同决定。<Cite id="index-purpose" /></p>
      <p id="index-directory" className="vp-citation-target">以 SQLite 官方文档中的普通索引查询为例，先按索引里的键找到条目，取得记录标识，再读取原表的其他字段。有序的是这份查找结构，并不意味着所有原始记录都被按同样顺序重新摆放。<strong>索引改变寻找答案的过程，不能改变查询应得到的答案。</strong><Cite id="index-directory" /></p>
    </ArticleSection>
    <ArticleSection id="search" title="先定位，再读记录">
      <Legacy slug="index" names={["scene-heading"]} />
      <p>同一组九条书目，试着查 #64，再查不存在的 #65。这里把索引简化为有序数组，用二分比较展示范围怎样缩小；它不是 B-tree 存储引擎，也不是性能测试。图中的次数只计算本模型的比较操作。</p>
      <IndexLesson />
      <p>查 #64 时，顺序扫描要检查到第 5 条；目录先比较 #42，再比较 #64，随后按记录位置读取书名。换成 #42，顺序扫描第一条就能找到。<strong>少量样本不能证明某种方案永远更快。</strong>查 #65 时，两种路径都必须在范围耗尽后明确返回“未找到”。</p>
      <p id="index-types" className="vp-citation-target">真实索引有不同结构。PostgreSQL 默认的 B-tree 支持等值和范围查询，Hash 索引只支持简单等值比较。演示里的“每次排除一半”是在解释有序查找，不能套到所有索引上。一个索引能帮助哪些查询，要看它的类型、列和运算方式。<Cite id="index-types" /></p>
    </ArticleSection>
    <ArticleSection id="tradeoff" title="读得更快，也要多维护" className={base.offset}>
      <Legacy slug="index" names={["quiz-heading"]} />
      <p id="index-cost" className="vp-citation-target">索引占用额外空间，相关数据插入、修改或删除时，也需要维护对应结构。给很少查询的列加索引，可能付出了写入成本却没得到读性能收益。优先围绕实际频繁、昂贵的查询设计，再核对收益。<Cite id="index-cost" /></p>
      <div className={s.tradeoff}><div><MagnifyingGlass size={28} weight="light" /><h3>一次查询</h3><p>希望少读无关记录。</p></div><div><Files size={28} weight="light" /><h3>一次修改</h3><p>可能同时维护表与索引。</p></div></div>
    </ArticleSection>
    <ArticleSection id="plan" title="用执行计划核对路径">
      <Legacy slug="index" names={["prompt-heading"]} />
      <p id="index-plan" className="vp-citation-target">在 PostgreSQL 中，可以用 <code>EXPLAIN</code> 查看执行计划。统计信息会影响估算；表很小，或查询需要取回很多行时，顺序扫描可能更合适。应使用接近真实的数据分布检查，而不是看见计划没有索引就认定出错。<Cite id="index-plan" /></p>
      <ArticleAside title="一个检查入口">
        <pre className={base.code}>{'EXPLAIN\nSELECT title FROM books WHERE book_id = 64;'}</pre>
        <p>先看走了哪条路径、预计返回多少行，再决定是否调整索引。这里没有运行这条 SQL，也没有提供虚构的毫秒数。实际测量还会受到缓存、存储和并发负载影响。</p>
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
