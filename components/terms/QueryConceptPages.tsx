import { ArrowsLeftRight, Database, FileCode, Terminal } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { SqlLesson, SqlPlanLesson, MigrationLesson, OrmLesson } from "./QueryConceptLessons";
import { sqlSources, migrationSources, ormSources } from "@/lib/query-sources";
import base from "./EventConcepts.module.css";
import s from "./QueryConcepts.module.css";
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name=><span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>; }

export function SqlTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={sqlSources} />;
  return <ConceptArticle slug="sql" title="SQL" sources={sqlSources}
    sections={[["read","从书目中取出可借的书"],["write","读数据与改数据"],["scope","限定受影响的行"],["plan","语句与执行计划"]]}
    intro={<>图书馆既要让人查到哪些书还能借，也要把借出、上架和移除记录下来。数据都在同一张表里，但目的不同，发给数据库的语句就不同。写 SQL，就是先说明你想要什么结果、想改哪些行，数据库再决定怎么执行。这一页先分清两件事：语句返回了什么、原表被改成了什么；查询速度留到最后再谈。</>}
    hero={<ConceptHero slug="sql" label="SELECT 从两条书目中筛选 available 为 true 的42号书，原表保留两行"><div className={s.sqlHero}><Terminal size={27} /><code>SELECT title<br />FROM books<br />WHERE available = true</code><div><span>#42 · true</span><span>#78 · false</span></div><strong>山间来信</strong></div></ConceptHero>}>
    <ArticleSection id="read" title="从书目中取出可借的书">
      <Legacy slug="sql" names={["question","definition"]} />
      <p><strong>数据库是保存并处理数据的系统，SQL 是你交给它的指令。</strong>SQL 可以定义表和列这样的结构，也可以读写表中的数据；本页只讲查、增、改、删四种（SELECT、INSERT、UPDATE、DELETE），不展开建表。PostgreSQL、MySQL、SQLite 都能执行 SQL，但具体语法和功能有差别；本页用 PostgreSQL 18 的基础语句讲解。</p>
      <p id="sql-select" className="vp-citation-target">这条 SELECT 从 books 取出编号与书名，用 WHERE 筛选 available 为 true（可借）的行，再按 book_id 排序。返回结果只包含选择的列与符合条件的行；<strong>执行这条 SELECT 不会把不符合条件的书从原表删除</strong>。需要固定顺序时，要写出 ORDER BY；不写时，这次看到的行序，下次不一定还是这样。排序是你对结果的要求，至于数据库怎么找到这些行，交给它自己决定。<Cite id="sql-select" /></p>
      <pre className={base.code}>{'SELECT book_id, title\nFROM books\nWHERE available = true\nORDER BY book_id;'}</pre>
      <p>books 表里每一行代表一册书，book_id 是主键：它在这张表里不能重复，也不能缺失，所以一个编号只对应一册书。编号 #42 的《山间来信》可以借，编号 #78 的《夜空地图》已经借出；查询应返回 #42，原表仍有两行。查询只是读数据；接下来的新增、更新和删除是写，会改动这张教学表里的行。</p>
    </ArticleSection>
    <ArticleSection id="write" title="读数据与改数据">
      <Legacy slug="sql" names={["scene-heading"]} />
      <p>SQL 能做的事不止这四个。把“SQL 指令”切到“增 INSERT”“改 UPDATE”“删 DELETE”，逐条执行，看原表变成什么样、反馈说什么。换成“改”或“删”时，界面上会出现“保留 WHERE book_id = 42”复选框；取消勾选再执行，看看影响范围有什么不同。反馈只显示最近一次执行的结果；切换指令或条件会清除它，直到重新执行。这是只有两三行数据的教学模型，没有连接真实数据库，也不会写入真实数据；每次成功的写操作都会立即生效，但只在这个页面的模型内生效。事务是一组要么一起生效（提交）、要么一起撤销（回滚）的改动；真实数据库里是否立即提交，取决于事务设置，具体机制留到相应词条解释。“恢复两条书目”只把教学模型重置到初始两行，不是上面说的事务回滚；真实数据库没有这个恢复按钮。</p>
      <SqlLesson />
      <p id="sql-insert" className="vp-citation-target">INSERT 新增行。页面上的 INSERT 语句先列出 book_id、title、available，再按同一顺序给出对应的值。同一条 INSERT 再执行一次，就会撞上已存在的主键：数据库不会自动把这次插入当成对原行的修改；PostgreSQL 提供 ON CONFLICT 写法，需要你明确写出遇到冲突时怎么办；本例没有用它。反馈里的 <code>INSERT 0 1</code> 是 PostgreSQL 的命令标签：最后的 1 表示插入一行，开头的 0 只是早期版本遗留的占位，如今已没有实际含义；这个 0 不是序号，也不表示第几次插入。<Cite id="sql-insert" /></p>
      <div className={base.contrast}><div><h3>返回结果</h3><p>SELECT 的结果供人或程序读取；你选了哪些列、设了什么条件、怎么排序，决定了结果的内容。</p></div><div><h3>保存的行</h3><p>INSERT、UPDATE、DELETE 会改变表中的数据。反馈里的行数告诉你语句处理了几行，改动后的表让你核对是哪几本被改了；UPDATE 的行数还包括匹配到但值没有变化的行。</p></div></div>
    </ArticleSection>
    <ArticleSection id="scope" title="限定受影响的行">
      <Legacy slug="sql" names={["quiz-heading"]} />
      <p id="sql-update" className="vp-citation-target">UPDATE 的 SET 指定改哪些列，WHERE 指定改哪些行。<code>SET available = false</code> 配合 <code>WHERE book_id = 42</code>，就只改 #42，其余列保留原值。以初始两行为例，取消勾选“保留 WHERE”后，影响范围就是整张表。PostgreSQL 会把匹配到但值没有变化的行也计入行数，所以原本就是 false 的 #78 也算在内，整表更新后反馈会显示 <code>UPDATE 2</code>；如果先插入了 #65，表里有三行，同样的整表 UPDATE 反馈就会变成 <code>UPDATE 3</code>。<Cite id="sql-update" /></p>
      <p id="sql-delete" className="vp-citation-target">DELETE 删除符合条件的行；不写 WHERE，就会删掉表中所有行，不过表的结构仍然保留。把已经不存在的 #42 再删一次，反馈会是 <code>DELETE 0</code>。这不是语法错误，只说明这一次没有匹配到任何行。在真实数据库上操作前，先确认自己连的是你要改的数据库，核对 WHERE 条件，估计会影响多少行；如果让 AI 代执行，也要让它返回命令反馈和受影响行数。演示中删错了，可以按“恢复两条书目”回到初始两行，这只是重置教学模型。<Cite id="sql-delete" /></p>
      <p>真实的应用里，还要处理权限、主键、外键（指向另一张表主键的约束）这些限制。SQL 语句格式再正确，数据库也不一定接受这次写入。把你想要的结果写清楚，才有依据判断 AI 给的语句对不对。</p>
    </ArticleSection>
    <ArticleSection id="plan" title="语句与执行计划" className={base.offset}>
      <Legacy slug="sql" names={["prompt-heading"]} />
      <p id="sql-plan" className="vp-citation-target">SQL 先表达目标；在真实数据库里，再由优化器（负责选计划的模块）决定用哪个执行计划，依据是统计信息、索引和数据库估算的代价。你写的 SQL 通常不会指定必须用哪一种计划。计划里的<strong>扫描</strong>负责在表里找出候选行：顺序扫描逐行检查；索引是按列的值组织起来的查找结构，索引扫描先从索引定位候选行，再回到表中取完整数据。计划由一个个步骤（节点）组成，连接（JOIN）和排序也是其中的节点。PostgreSQL 的 EXPLAIN 会展示计划节点和各项估计，比如预计会返回多少行；它还给出估算代价，也就是数据库用来比较不同方案的成本数字。即使有索引，数据库也可能选择顺序扫描，尤其是表很小，或一次要读取大量行的时候。<strong>语句写得对不对、执行跑得快不快，要分开检查。</strong>演示没有运行优化器，不能从演示数据推断真实生产环境里的耗时。<Cite id="sql-plan" /></p>
      <p>界面上的 Seq Scan 就是顺序扫描，Index Scan 就是索引扫描。下面的按钮只是让你在同一条查询的两种找法之间切换对照，不是在替真实数据库选计划；换完之后，返回的书仍是同一本。</p>
      <SqlPlanLesson />
      <ArticleAside title="EXPLAIN ANALYZE 会执行语句">
        <p id="sql-analyze" className="vp-citation-target">普通 <code>EXPLAIN</code> 只展示计划和估计，不执行这条语句；加上 <code>ANALYZE</code> 后，PostgreSQL 会实际执行并记录真实行数与运行信息。用 <code>EXPLAIN ANALYZE</code> 分析一条 UPDATE 或 DELETE，数据修改也会真的发生；不要以为它只是用来看计划的。要在真实数据库上分析写操作，得先结合自己的环境评估风险，安排好出问题能整体撤销的后路，比如放进事务里、准备好回滚，再动手执行。<Cite id="sql-analyze" /></p>
      </ArticleAside>
      <p>核对 SQL 时，先写清表结构、一行代表什么、预期结果或影响范围，再准备一份样例数据，里面要包含缺失值和重复值。拿到 AI 给出的 UPDATE 或 DELETE，可以先把相同 WHERE 条件放进 SELECT，数一数会匹配哪些行，再决定是否执行写操作。如果涉及复杂查询，再检查 <ConceptTerm slug="join">JOIN</ConceptTerm>（多张表怎么连起来）、<ConceptTerm slug="index">索引</ConceptTerm>与计划。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function MigrationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={migrationSources} />;
  return <ConceptArticle slug="database-migration" title="数据库迁移" sources={migrationSources}
    sections={[["files","把结构变更留在代码里"],["history","文件到了，数据库还没变"],["compatible","新旧程序共用一段结构"],["recovery","迁移失败与恢复"]]}
    intro={<>把书名列从 title 改成 name，不能只在开发库里手动改一下。其他环境需要知道怎样从旧结构走到新结构，正在运行的旧程序也可能还在读 title。一次结构调整，牵动的是迁移文件、数据和应用版本。</>}
    hero={<ConceptHero slug="database-migration" label="002和003迁移文件依次到达目标数据库，版本从001到003"><div className={s.migrationHero}><div><FileCode size={27} /><span>002 · 增加 name</span></div><div><FileCode size={27} /><span>003 · 回填书名</span></div><div><Database size={30} /><strong>目标库 003</strong><code>name: 山间来信</code></div></div></ConceptHero>}>
    <ArticleSection id="files" title="把结构变更留在代码里">
      <Legacy slug="database-migration" names={["question","definition"]} />
      <p id="migration-files" className="vp-citation-target"><strong>数据库迁移把结构与必要的数据变化记录为可追踪的步骤，再将这些步骤应用到具体数据库。</strong>Django 的 makemigrations 生成迁移文件，migrate 执行它们；文件与代码一起分发。同一份文件放进仓库，不代表每个环境已经执行。<Cite id="migration-files" /></p>
      <p><ConceptTerm slug="database-schema">数据库模式</ConceptTerm>描述某个时刻的结构，迁移交代如何从此前的结构到达它。备份则保存可用于恢复的数据或状态。写一份“目标表定义”，还没有说明旧数据怎样处理、应用怎样过渡。</p>
      <p id="migration-review" className="vp-citation-target">工具可以帮忙生成变更，但候选文件需要审查。Alembic 明确要求检查自动生成结果；列名改变等情况可能被识别成删除旧列、增加新列，不能据此假定数据会自动搬过去。审查时要同时看操作、依赖和数据处理方法。<Cite id="migration-review" /></p>
    </ArticleSection>
    <ArticleSection id="history" title="文件到了，数据库还没变">
      <Legacy slug="database-migration" names={["scene-heading"]} />
      <p id="migration-history" className="vp-citation-target">迁移工具会读取数据库的执行记录，决定还要走哪些步骤。Alembic 的教程用 alembic_version 记录当前修订，并沿依赖路径执行 upgrade。开发库已到 003，目标库还在 001，并不矛盾：它们收到同样的代码，却处在不同的执行进度。<Cite id="migration-history" /></p>
      <p>下面用一条书目演示 title → name。先尝试执行 004，再按 002、003 的顺序推进；观察目标库、书名和已执行记录是否一起变化。“旧程序仍在运行”属于本站设置的发布检查，不是迁移工具自带的检测能力。演示期间不接受新写入。</p>
      <MigrationLesson />
      <p id="migration-dependencies" className="vp-citation-target">003 依赖新增列的 002，004 又依赖已回填的 003。<strong>依赖说明前置条件，文件编号只帮助人阅读。</strong>Django 的迁移可以跨应用形成依赖，真实项目不必是简单的一条直线。已经执行过的步骤不会因为再次请求升级就重新做一遍。<Cite id="migration-dependencies" /></p>
    </ArticleSection>
    <ArticleSection id="compatible" title="新旧程序共用一段结构">
      <Legacy slug="database-migration" names={["quiz-heading"]} />
      <p id="migration-compatible" className="vp-citation-target">Prisma 的扩展与收缩示例先保留旧列、增加新列并搬数据，调整应用读写后再移除旧列。本例经过 003 后，两列都有书名，新旧程序都能读；只有旧程序退役后，发布检查才允许 004 删除 title。<strong>完成数据回填，不等于可以立刻删掉旧接口。</strong><Cite id="migration-compatible" /></p>
      <div className={s.compatibility}><div><strong>002</strong><p>title 有值<br />name 还是 NULL</p></div><div><strong>003</strong><p>两列都有书名<br />为读切换留出时间</p></div><div><strong>004</strong><p>只剩 name<br />旧程序不能再读 title</p></div></div>
      <p>现实中迁移期间可能继续写书名，需要安排双写或其他同步方式，并核对回填完成到停止旧写之间的新增与更新。本例冻结写入，因此只演示读兼容。批量处理、锁、耗时和切换验证仍需用实际数据与部署方式评估。</p>
    </ArticleSection>
    <ArticleSection id="recovery" title="迁移失败与恢复" className={base.offset}>
      <Legacy slug="database-migration" names={["prompt-heading"]} />
      <p id="migration-backends" className="vp-citation-target">失败能否整体回滚，取决于数据库和操作。Django 文档区分支持 DDL 事务的后端与不支持这种回滚的后端，例如 MySQL 的某些结构变更失败后，需要检查已经发生的变化并人工处理。演示的失败发生在执行前，结构与记录均不变，不能据此推断所有迁移失败都如此。<Cite id="migration-backends" /></p>
      <p id="migration-reverse" className="vp-citation-target">“有反向操作”也不保证找回原数据。Django 的 RunPython 需要提供 reverse_code 才能反向执行；删掉一列再加回来，已经丢掉的值不会凭空恢复。迁移前要明确数据恢复来源、不可逆步骤和失败后如何继续。<Cite id="migration-reverse" /></p>
      <ArticleAside title="迁移审查所需材料">
        <p>提供数据库与版本、当前和目标结构、迁移依赖、数据量、持续读写情况，以及新旧程序读写哪些列。要求它说明执行顺序、验证依据、可能持锁的步骤和恢复方法，再核对生成的具体 SQL 或脚本。不要只让它“生成 migration”。</p>
      </ArticleAside>
      <p>上线前至少对上三件事：文件记录的步骤、数据库的实际结构与数据、仍在运行的应用版本。迁移执行成功只是其中一项，业务读取和写入仍需验证。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function OrmTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={ormSources} />;
  return <ConceptArticle slug="orm" title="ORM" sources={ormSources}
    sections={[["mapping","对象属性对应表里的列"],["write","对象修改到数据库写入"],["session","Session 管理的状态"],["loading","访问属性也可能查询"]]}
    intro={<>在 Python 里拿到一册 Book 并修改 book.title，只能看到对象属性变了。还要弄清数据库何时收到 UPDATE、修改何时提交，以及能否撤回。ORM 让调用更接近程序中的对象，写入过程仍需核对。</>}
    hero={<ConceptHero slug="orm" label="Book类的id与title分别对应books表的book_id与title，值从行映射到对象"><div className={s.ormHero}><div><strong>Book</strong><code>id = 42</code><code>title = 山间来信</code></div><ArrowsLeftRight size={28} /><div><Database size={25} /><strong>books</strong><code>book_id: 42</code><code>title: 山间来信</code></div></div></ConceptHero>}>
    <ArticleSection id="mapping" title="对象属性对应表里的列">
      <Legacy slug="orm" names={["question","definition"]} />
      <p id="orm-mapping" className="vp-citation-target"><strong>ORM 建立程序中的类、对象与关系数据之间的映射，并为相应操作生成和执行 SQL。</strong>SQLAlchemy 可以把 Book 类映射到 books 表，再为实例配置与关系操作有关的行为。ORM 也能映射已有结构，使用它不代表必须重建数据库。<Cite id="orm-mapping" /></p>
      <p id="orm-field" className="vp-citation-target">对象属性名不必等于数据库列名。SQLAlchemy 的 mapped_column 可以显式指定列名，下面把 <code>Book.id</code>对应到 <code>books.book_id</code>；程序写 id，生成的 SQL 使用 book_id。<Cite id="orm-field" /></p>
      <pre className={base.code}>{'class Book(Base):\n    __tablename__ = "books"\n\n    id: Mapped[int] = mapped_column(\n        "book_id", primary_key=True\n    )\n    title: Mapped[str]'}</pre>
      <p>这是 SQLAlchemy 2.0 的映射片段，假定已定义 DeclarativeBase 的子类 Base，并导入 Mapped、mapped_column。字段定义交代对象如何对应数据；数据库结构的实际变更另由建表或迁移操作执行。</p>
      <p id="orm-query" className="vp-citation-target">查询 ORM 实体时，可以使用 <code>session.scalars(select(Book)).all()</code>取得 Book 实例。普通 SQL 查询返回的行与程序里的实例不是同一种接口；选择普通列、实体或不同结果方法，会影响返回形式，不能把所有 ORM 查询都当成“直接返回对象列表”。<Cite id="orm-query" /></p>
    </ArticleSection>
    <ArticleSection id="write" title="对象修改到数据库写入">
      <Legacy slug="orm" names={["scene-heading"]} />
      <p id="orm-flush" className="vp-citation-target">SQLAlchemy 的 Session 跟踪对象变化，flush 把待处理变化转换为本事务中的数据库操作。<strong>flush 已经发出 SQL，但还没有完成事务提交。</strong>默认配置还可能在查询前自动 flush。演示把这一步单独交给按钮，便于比较；不同 ORM 的自动保存与事务行为需要查各自文档。<Cite id="orm-flush" /></p>
      <p>对象已从 #42 加载，先改书名，再选择 flush 后回滚，或直接 commit。对照对象、本事务的写入和已提交的值，查看下方 SQL 记录。本例是一条记录、一次有限修改的状态模型，不运行 Python 或真实数据库，也不模拟其他连接的隔离级别。</p>
      <OrmLesson />
      <p id="orm-commit" className="vp-citation-target">SQLAlchemy 的 commit 会先 flush 剩余变化，再提交事务。因此可以修改对象后直接 commit，不必手工先调用一次 flush；这时也应在记录中看到 UPDATE 出现在 COMMIT 之前。<strong>赋值、发出更新、提交完成是不同的时刻。</strong><Cite id="orm-commit" /></p>
      <p id="orm-rollback" className="vp-citation-target">默认 Session 在 commit 后会让对象属性过期，rollback 也会使保留下来的对象过期；后续访问需要重新读取。本例回滚后显示“属性已过期”，重新读取才看见原书名。若 flush 本身失败，还要调用 rollback 才能继续使用该 Session；不能吞掉异常后假装提交成功。<Cite id="orm-rollback" /></p>
    </ArticleSection>
    <ArticleSection id="session" title="Session 管理的状态">
      <Legacy slug="orm" names={["quiz-heading"]} />
      <p id="orm-identity" className="vp-citation-target">Session 的身份映射按主键维护已加载对象。SQLAlchemy 的 <code>Session.get()</code>会先检查当前身份映射，再根据需要查询数据库。这有助于同一会话中的对象一致性，<strong>不是整个系统的共享缓存</strong>，也不保证所有查询都能免发 SQL。<Cite id="orm-identity" /></p>
      <div className={base.contrast}><div><h3>ORM 的映射</h3><p>把对象属性、查询表达式和数据库列对应起来，组织对象的读写。</p></div><div><h3>数据库的规则</h3><p>继续执行主键、外键、唯一性与事务约束。对象写起来方便，不会让这些要求消失。</p></div></div>
      <p>Session 应围绕一项明确的数据库工作建立提交或回滚边界，结束后释放资源。它不是浏览器的登录会话。检查代码时，要问谁拥有这次数据库操作、在哪里提交、遇到异常在哪里回滚，而不只看有没有调用 save 之类的方法。</p>
    </ArticleSection>
    <ArticleSection id="loading" title="访问属性也可能查询" className={base.offset}>
      <Legacy slug="orm" names={["prompt-heading"]} />
      <p id="orm-loading" className="vp-citation-target">访问尚未加载的关系，可能触发新 SELECT。若先查 N 位作者，再逐个读取每人的书籍集合，在相应懒加载场景里可能出现 1 + N 次查询。SQLAlchemy 提供预加载策略，减少逐个读取；查询次数仍取决于具体关系、策略与已加载状态，不能说“任何属性访问都查数据库”。<Cite id="orm-loading" /></p>
      <ArticleAside title="一段循环可能藏着多次查询">
        <pre className={base.code}>{'authors = session.scalars(select(Author)).all()\nfor author in authors:\n    print(author.books)'}</pre>
        <p>这里假定 Author.books 是尚未加载的关系集合。这不是上面 Book 映射片段已定义的功能。检查实际 SQL 日志，再决定是否预加载、用连接或分批查询；不要只凭代码行数估计数据库工作量。</p>
      </ArticleAside>
      <p>检查 ORM 调用时，需要框架版本、映射关系、返回形式、实际 SQL 与事务范围。ORM 减少重复调用代码，但 <ConceptTerm slug="sql">SQL</ConceptTerm>、<ConceptTerm slug="index">索引</ConceptTerm>和 <ConceptTerm slug="transaction">事务</ConceptTerm>仍决定正确性与性能。</p>
    </ArticleSection>
  </ConceptArticle>;
}
