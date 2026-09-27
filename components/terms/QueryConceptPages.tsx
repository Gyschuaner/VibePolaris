import { ArrowsLeftRight, Database, FileCode, Terminal } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { SqlLesson, MigrationLesson, OrmLesson } from "./QueryConceptLessons";
import { sqlSources, migrationSources, ormSources } from "@/lib/query-sources";
import base from "./EventConcepts.module.css";
import s from "./QueryConcepts.module.css";
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name=><span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>; }

export function SqlTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={sqlSources} />;
  return <ConceptArticle slug="sql" title="SQL" sources={sqlSources}
    sections={[["read","从书目中取出可借的书"],["write","读数据与改数据"],["scope","限定受影响的行"],["plan","语句与执行计划"]]}
    intro={<>馆员想看哪些书可以借出，也要记录借出、上架和移除。数据仍在同一张书目表里，操作目的不同，发给数据库的语句就不同。先分清返回了什么、原表改了什么，再讨论查询速度。</>}
    hero={<ConceptHero slug="sql" label="SELECT 从两条书目中筛选 available 为 true 的42号书，原表保留两行"><div className={s.sqlHero}><Terminal size={27} /><code>SELECT title<br />FROM books<br />WHERE available = true</code><div><span>#42 · true</span><span>#78 · false</span></div><strong>山间来信</strong></div></ConceptHero>}>
    <ArticleSection id="read" title="从书目中取出可借的书">
      <Legacy slug="sql" names={["question","definition"]} />
      <p><strong>SQL 是向关系数据库表达结构和数据操作的语言。</strong>数据库是保存并处理数据的系统，SQL 是你交给它的指令。PostgreSQL、MySQL、SQLite 都能执行 SQL，但具体语法和功能有差别；本文用 PostgreSQL 18 的基础语句讲解。</p>
      <p id="sql-select" className="vp-citation-target">这条 SELECT 从 books 取出编号与书名，用 WHERE 筛选 available 为 true 的记录，再按 book_id 排序。返回结果只包含选择的列与符合条件的行；普通的这类读取<strong>不会把不符合条件的书从原表删除</strong>。需要确定顺序时，写出 ORDER BY，不能依靠当前看到的偶然排列。<Cite id="sql-select" /></p>
      <pre className={base.code}>{'SELECT book_id, title\nFROM books\nWHERE available = true\nORDER BY book_id;'}</pre>
      <p>这里的一行代表一册书，book_id 是主键。#42《山间来信》可以借，#78《夜空地图》已经借出；查询应返回 #42，原表仍有两行。SQL 的用途不止查询，后面也会用它新增、更新和删除记录。</p>
    </ArticleSection>
    <ArticleSection id="write" title="读数据与改数据">
      <Legacy slug="sql" names={["scene-heading"]} />
      <p>在四条固定语句之间切换，执行后对照原表和反馈。取消 WHERE 可以观察影响范围；重复增加 #65 可以观察主键冲突。这是两三行书目的教学模型，没有连接真实数据库，也不接收任意 SQL；每次成功写操作在模型中立即生效，事务留到相应词条解释。</p>
      <SqlLesson />
      <p id="sql-insert" className="vp-citation-target">INSERT 新增记录。例子明确列出 book_id、title、available，再按同一顺序提供值。再次插入 #65 会遇到已有主键，不能把它当作修改原记录；PostgreSQL 的 ON CONFLICT 可以另行指定冲突处理，本例没有使用。<Cite id="sql-insert" /></p>
      <div className={base.contrast}><div><h3>返回结果</h3><p>SELECT 的结果供程序或人读取；选择的列、条件和排序决定它的内容。</p></div><div><h3>保存的记录</h3><p>INSERT、UPDATE、DELETE 会改变表中的数据。反馈行数与返回书名承担不同职责。</p></div></div>
    </ArticleSection>
    <ArticleSection id="scope" title="限定受影响的行">
      <Legacy slug="sql" names={["quiz-heading"]} />
      <p id="sql-update" className="vp-citation-target">UPDATE 的 SET 指定改哪些列，WHERE 指定改哪些行。<code>SET available = false WHERE book_id = 42</code>只针对 #42，其余列保留原值。去掉 WHERE，范围就覆盖全表。PostgreSQL 的 UPDATE 行数包含匹配但值没有变化的行，所以 #78 原本就是 false，也可以计入这次 UPDATE 2。<Cite id="sql-update" /></p>
      <p id="sql-delete" className="vp-citation-target">DELETE 删除符合条件的行，<strong>没有 WHERE 会删除表中所有行，表本身仍存在</strong>。重复删除已经不存在的 #42 得到 DELETE 0，不是语法错误，也不证明刚才删除过。实际操作前，要核对目标库、条件和预期行数；本例的“恢复”按钮只恢复教学输入。<Cite id="sql-delete" /></p>
      <p>应用还要处理权限、主键、外键等限制。SQL 能写出一条操作，不代表这次写入一定被数据库接受。把业务要求变成字段、条件和约束，才能检查模型给出的语句是否完成了你要做的事。</p>
    </ArticleSection>
    <ArticleSection id="plan" title="语句与执行计划" className={base.offset}>
      <Legacy slug="sql" names={["prompt-heading"]} />
      <p id="sql-plan" className="vp-citation-target">查询表达需要什么结果，数据库再选择扫描、连接和排序的物理计划。PostgreSQL 的 EXPLAIN 展示计划节点及估计；有索引也可能选择顺序扫描，尤其是表很小或读取大量行时。<strong>语句正确与执行高效需要分别核对。</strong>演示没有运行优化器，不能从两行数据推断生产耗时。<Cite id="sql-plan" /></p>
      <ArticleAside title="EXPLAIN ANALYZE 会执行语句">
        <p id="sql-analyze" className="vp-citation-target">加上 ANALYZE 后，PostgreSQL 会实际执行语句并记录运行信息。对 UPDATE、DELETE 使用它，也会发生相应数据修改；不能把它误认为只查看计划的开关。分析真实写操作时，应根据具体环境安排事务、回滚与风险评估。<Cite id="sql-analyze" /></p>
      </ArticleAside>
      <p>核对 SQL 时，先写清表结构、一行代表什么、包含缺失和重复情况的样例，以及预期结果或影响范围。复杂查询再检查 <ConceptTerm slug="join">JOIN</ConceptTerm>、<ConceptTerm slug="index">索引</ConceptTerm>与计划。先有正确的目标，再谈怎样更快得到它。</p>
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
