import { BookOpen, Key, LinkSimple, Table as TableIcon } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleAside, ArticleCitation, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { TableLesson, PrimaryKeyLesson, ForeignKeyLesson } from "./RelationalConceptLessons";
import { tableSources, primaryKeySources, foreignKeySources } from "@/lib/relational-sources";
import s from "./RelationalConcepts.module.css";
import base from "./EventConcepts.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>;
}

export function TableTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={tableSources} />;
  return <ConceptArticle slug="table" title="表" sources={tableSources}
    sections={[["shape", "一行书目，几列信息"], ["view", "只取需要的行与列"], ["order", "位置不代表身份"], ["design", "一行对应的业务对象"]]}
    intro={<>图书室要记录每一册可单独借出的书。本例每册占一行，写下编号、书名和可借状态；两册同名书也会占两行。以后既能查“哪些书可借”，也能让页面只列出编号和书名。</>}
    hero={<ConceptHero slug="table" label="同一套列定义下，三条书目逐行填入表格"><div className={s.tableHero}><TableIcon size={26} /><div><span>编号</span><span>书名</span><span>可借</span>{[[42,"山间来信","是"],[12,"河流手记","否"],[78,"夜空地图","是"]].map((row,i) => <div key={i} style={{ animationDelay: `${i * .6}s` }}>{row.map((value,j) => <span key={j}>{value}</span>)}</div>)}</div></div></ConceptHero>}>
    <ArticleSection id="shape" title="一行书目，几列信息">
      <Legacy slug="table" names={["question", "definition"]} />
      <p id="table-shape" className="vp-citation-target"><strong>表用命名的列组织数据，每一行按这套列定义保存一条记录。</strong>书目表中，编号是一列，书名是另一列；#42 的编号、书名与状态放在同一行。列规定每条书目有哪些信息，行则填入某一册书的具体值。即使还没录入书目，表也可以先有列定义。<Cite id="table-shape" /></p>
      <p id="table-types" className="vp-citation-target">以 PostgreSQL 为例，建表时要指定列名和类型：编号可以用整数，书名用文本，可借状态用布尔值。类型会限制允许的值，也决定怎样计算和比较；其他数据库的类型规则可能不同。一个文本类型不会自动理解“这是不是一本真实的书”，业务规则还需要另外定义。<Cite id="table-types" /></p>
      <pre className={base.code}>{'CREATE TABLE books (\n  book_id integer,\n  title text,\n  available boolean\n);'}</pre>
      <p>这里只定义结构，还没有插入书目，也没有声明编号唯一。样例中的三册书恰好用了不同编号；要让数据库阻止重号，还需添加 <ConceptTerm slug="primary-key">主键</ConceptTerm>或唯一约束。光把列命名为 <code>book_id</code>，数据库不会自动检查编号是否重复。</p>
    </ArticleSection>
    <ArticleSection id="view" title="只取需要的行与列">
      <Legacy slug="table" names={["scene-heading"]} />
      <p id="table-filter" className="vp-citation-target">查询可借书目时，<code>WHERE available = true</code>逐行判断条件，只有符合条件的行进入结果。没进入结果的行只是这次没被选中，原表里的已借出记录仍然保留。<strong>筛选只读取，不改动原表；删除才会修改原表。</strong><Cite id="table-filter" /></p>
      <p id="table-columns" className="vp-citation-target"><code>SELECT book_id, title</code>决定返回哪些列。这通常叫投影：从符合条件的记录里，取出需要的部分。查询还可以计算新的结果列，这也不会让原表真的多出列。下面的演示只做选列、筛选和排序，不执行真实 SQL。<Cite id="table-columns" /></p>
      <TableLesson />
      <p>上面的原始书目始终是三行。取消“可借状态”只会让结果少一列；查询 #65 得到零行，表示没有符合条件的书，不表示表不存在。修改查询条件后，需要重新查询，才能得到新条件下的结果。</p>
    </ArticleSection>
    <ArticleSection id="order" title="位置不代表身份" className={base.offset}>
      <Legacy slug="table" names={["quiz-heading"]} />
      <p id="table-order" className="vp-citation-target">查询没有写排序条件时，SQL 不保证返回行的先后顺序。想按编号排列，就写 <code>ORDER BY book_id</code>；如果用来排序的列可能出现相同的值，还需补足能确定先后的条件。不能靠“画面上的第几行”来确定拿到的是哪一册书。排序影响结果的位置，记录的编号仍是 #42、#12、#78。<Cite id="table-order" /></p>
      <p>演示为了方便对照，把未排序的结果按样例输入顺序显示。真实数据库可以采用其他顺序。修改书目时，要依据已设为主键的编号等记录标识，而不是依据当前屏幕上的位置。</p>
    </ArticleSection>
    <ArticleSection id="design" title="一行对应的业务对象">
      <Legacy slug="table" names={["prompt-heading"]} />
      <p>假如图书室有两册《山间来信》，每册都能单独借出，表里就会出现两行：书名相同，编号不同。如果只想统计这种书还剩几册，也可以用一行表示一种书，另设数量列。先定好一行代表什么，才能决定表该有哪些列，以及借阅记录该指向哪一行。</p>
      <ArticleAside title="表结构需要写清的关系">
        <p>可以这样说明：每册书有独立编号，书名可能重复；一位读者可以借多册书，每次借阅有自己的日期。请分别说明每张表的一行代表什么、需要哪些列、怎样标识，以及借阅记录该指向哪一行。</p>
      </ArticleAside>
      <p><ConceptTerm slug="database-schema">数据库结构</ConceptTerm>描述表、列与约束等安排；查询结果是依据这些结构得到的一份输出。把页面上显示的表格和数据库里的表分清，讨论新增列、筛选和修改时就更容易说准确。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PrimaryKeyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={primaryKeySources} />;
  return <ConceptArticle slug="primary-key" title="主键" sources={primaryKeySources}
    sections={[["identity", "同名的书，不同的记录"], ["write", "编号的唯一性检查"], ["combination", "一个主键，可以包含多列"], ["generation", "约束与生成编号分开看"]]}
    intro={<>图书室有两册《山间来信》，书目表里每册占一行。读者借走其中一册，光记书名分不清是哪册；给两册分别编号 #42、#78，借阅记录就可以记下“借走 #42”。以后书名修订了，仍能靠编号找到那一行。</>}
    hero={<ConceptHero slug="primary-key" label="两册同名书具有不同主键，42号书改名后编号不变"><div className={s.keyHero}>{[42,78].map(id => <div key={id}><BookOpen size={27} /><strong><Key size={16} />#{id}</strong><div>{id === 42 ? <><span>山间来信</span><span>山间来信 · 修订版</span></> : <span>山间来信</span>}</div></div>)}</div></ConceptHero>}>
    <ArticleSection id="identity" title="同名的书，不同的记录">
      <Legacy slug="primary-key" names={["question", "definition"]} />
      <p id="primary-key-identity" className="vp-citation-target"><strong>主键是表中用来唯一指认一条记录的一列或一组列。</strong>一册书的编号和书名放在同一行，这一行就是这册书的一条记录。按主键的标准规则，主键值不能重复，参与主键的每一列也都不能是 <code>NULL</code>，也就是缺少值。PostgreSQL 会检查这些条件，下面的写入演示也按它的规则检查。唯一的范围是这张表；另一张表可以有自己的 #42。<Cite id="primary-key-identity" /></p>
      <p>这里把编号列 <code>book_id</code>设为主键。你也可以自己约定每册都发不同编号，但只是约定，录入时仍可能重号。声明主键后，数据库会拒绝重复或空的编号。#42 改名只改变书名，#78 仍是另一册；这张表允许书名相同。</p>
      <p>选择不随书名修订而变化的编号，是本例的设计决定，主键规则并不禁止修改编号。假如把 #42 改成 #43，借阅记录里原来记着的 #42 就需要一并处理，否则会找不到那册书。这就是“已有引用”：另一条记录里存着这个编号，用它指向这条书目。</p>
    </ArticleSection>
    <ArticleSection id="write" title="编号的唯一性检查">
      <Legacy slug="primary-key" names={["scene-heading"]} />
      <p>先尝试新增一册同样使用 #42 的书，再提交空编号；最后改成未使用的 #65。新书名仍然可以叫《山间来信》。本例没有配置自动发号，选择 <code>NULL</code>就是提交一个空值。演示只在页面内模拟检查，不连接真实数据库。</p>
      <PrimaryKeyLesson />
      <p><strong>重复编号被拒绝，意味着本次新增没有发生。</strong>原来的 #42 不会被第二条记录覆盖。新编号 #65 可以通过，新增后书名仍与另外两册相同。改名按钮只修改 #42：对照编号，可以确认修改的是谁。</p>
      <p>下面的建表语句把 <code>book_id</code>定义为整数编号，并用 <code>PRIMARY KEY</code>声明主键。<code>title</code>是书名，<code>text</code>表示文本；它后面的 <code>NOT NULL</code>只要求有值，不检查是否重名。</p>
      <pre className={base.code}>{'CREATE TABLE books (\n  book_id integer PRIMARY KEY,\n  title text NOT NULL\n);'}</pre>
    </ArticleSection>
    <ArticleSection id="combination" title="一个主键，可以包含多列" className={base.offset}>
      <Legacy slug="primary-key" names={["quiz-heading"]} />
      <p id="primary-key-composite" className="vp-citation-target">一张表至多有一个主键，但这个主键可以包含多列。例如“读者收藏书目”表中，<code>reader_id</code>存读者编号，<code>book_id</code>存书的编号。声明 <code>PRIMARY KEY (reader_id, book_id)</code>后，同一读者可以收藏多本书，同一本书也可以被多人收藏；只有读者编号和书编号都相同的组合才算重复。这叫<strong>复合主键</strong>，参与的两列都要有值。<Cite id="primary-key-composite" /></p>
      <div className={s.pairs}><div><code>读者 #7 / 书 #42</code><span>一条收藏</span></div><div><code>读者 #7 / 书 #78</code><span>同一读者，另一本书</span></div><div><code>读者 #9 / 书 #42</code><span>同一本书，另一位读者</span></div></div>
      <p>是否选择这种组合，要看你希望什么东西只能出现一次。换到借阅历史：同一个读者可以多次借同一本书，“读者＋书”的组合就会重复，无法区分每一次借阅。可以为每次借阅另设一个不重复的借阅编号，让表里的一行对应某一次借阅。</p>
      <p id="primary-key-unique" className="vp-citation-target">其他列也需要防重复时，可以加<strong>唯一约束</strong>（<code>UNIQUE</code>）。它检查指定列或组合是否重复，不会把它们变成第二个主键。在 PostgreSQL 中，单独的 <code>UNIQUE</code>允许空值；如果还要求必须有值，就另外加 <code>NOT NULL</code>。上面的书目表只要求编号唯一，没有给书名加这种规则。<Cite id="primary-key-unique" /></p>
    </ArticleSection>
    <ArticleSection id="generation" title="约束与生成编号分开看">
      <Legacy slug="primary-key" names={["prompt-heading"]} />
      <p id="primary-key-generated" className="vp-citation-target">主键不要求编号自动增加，也不要求列名叫 <code>id</code>。PostgreSQL 可以用 identity 列自动发号：没有提供编号时，由数据库内置的序列生成下一个编号。但序列可以被重设，有些配置也允许手动写入编号，所以自动发号本身不保证唯一。仍需主键或唯一约束在写入时检查是否重复。<Cite id="primary-key-generated" /></p>
      <p id="primary-key-autoincrement" className="vp-citation-target">SQLite 普通表的 <code>INTEGER PRIMARY KEY</code>则有特殊行为：这列直接对应数据库内部的行编号 <code>rowid</code>，省略值或提交 <code>NULL</code>时都可以自动分配整数，数据库会用分配的编号代替这个空值。这与上面“没有自动发号，空值被拒绝”的演示不同。加上 <code>AUTOINCREMENT</code>会在自动分配时避免重用已删除记录的编号，并带来额外开销；没有它也可以自动发号。<Cite id="primary-key-autoincrement" /></p>
      <ArticleAside title="SQLite 中需要核对的兼容行为">
        <p id="primary-key-sqlite" className="vp-citation-target">SQL 的标准规则要求主键各列非空，但 SQLite 早期实现没有严格执行这项检查。为了兼容旧数据库，普通表的某些主键声明至今仍可能接受 <code>NULL</code>；这属于实现例外。声明为 <code>WITHOUT ROWID</code>的表不使用上面提到的内部行编号，会对主键每列执行非空要求。使用 SQLite 时，需要核对实际表定义，才能判断空值会被拒绝、被保留，还是触发自动发号。<Cite id="primary-key-sqlite" /></p>
      </ArticleAside>
      <p>回到最初的借书：书目表用主键保证 #42 只对应一册书，借阅表存下 #42，才能明确指向它。接着读 <ConceptTerm slug="foreign-key">外键</ConceptTerm>，可以了解数据库怎样检查这个编号确实存在，以及改号或删除书目时如何处理借阅记录。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function ForeignKeyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={foreignKeySources} />;
  return <ConceptArticle slug="foreign-key" title="外键" sources={foreignKeySources}
    sections={[["reference", "借阅记录指向哪本书"], ["change", "写入与删除都要守住关系"], ["scope", "存在不等于可以借"], ["check", "确认约束真的在执行"]]}
    intro={<>借阅表记下“林舟借了 #42”。书目表里必须能找到 #42，才能知道他借的是哪册书。如果有人录入 #65，而书目中根本没有这个编号，就会留下一条找不到对象的借阅记录。</>}
    hero={<ConceptHero slug="foreign-key" label="两条借阅引用同一本42号书，存在的书目让关联有效"><div className={s.foreignHero}><div><BookOpen size={28} /><strong>books · #42</strong></div><LinkSimple size={31} /><div><span>借阅 1 → #42</span><span>借阅 2 → #42</span></div></div></ConceptHero>}>
    <ArticleSection id="reference" title="借阅记录指向哪本书">
      <Legacy slug="foreign-key" names={["question", "definition"]} />
      <p id="foreign-key-reference" className="vp-citation-target"><strong>外键约束要求引用值能够匹配被引用表中的有效键，维护记录之间的引用关系。</strong>本例让 <code>loans.book_id</code>引用 <code>books.book_id</code>，目标是书目表的主键。借阅表是引用方，书目表是被引用方；也可以定义指向同一张表其他记录的自引用关系。<Cite id="foreign-key-reference" /></p>
      <p>同一本书可以在借阅历史中被多次引用。因此借阅表里的 <code>book_id</code>不必唯一，每次借阅仍有自己的 <code>loan_id</code>。外键的目标通常是主键或适合引用的唯一键；如果目标值对应多条不同记录，就无法据此明确指认对象。</p>
      <pre className={base.code}>{'CREATE TABLE loans (\n  loan_id integer PRIMARY KEY,\n  book_id integer NOT NULL\n    REFERENCES books(book_id) ON DELETE RESTRICT,\n  reader text NOT NULL\n);'}</pre>
    </ArticleSection>
    <ArticleSection id="change" title="写入与删除都要守住关系">
      <Legacy slug="foreign-key" names={["scene-heading"]} />
      <p>模型从两本书、一条引用 #42 的借阅开始。尝试插入指向 #65 与 #42 的新借阅，再删除被引用的 #42。切换删除策略会恢复样例数据，以便在相同起点比较；这里不访问真实数据库。</p>
      <ForeignKeyLesson />
      <p id="foreign-key-delete" className="vp-citation-target">本例显式选择 <code>RESTRICT</code>时，有借阅引用 #42，就拒绝删除它。改为 <code>CASCADE</code>后，删除 #42 会一并删除引用它的借阅行。删除策略是开发者的选择，不能把“有外键”理解成“一定级联删除”。PostgreSQL 默认使用 NO ACTION，允许延迟检查时，它与 RESTRICT 的时机还可能不同。<Cite id="foreign-key-delete" /></p>
      <p>图书室通常要保留借阅历史，直接级联删除可能不合适。可以禁止删除、把书标记为停用，或按明确的保留方案迁移数据。演示提供两种策略来比较结果，不是在建议历史记录都跟着书目删除。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="存在不等于可以借" className={base.offset}>
      <Legacy slug="foreign-key" names={["quiz-heading"]} />
      <p>外键能证明 #42 存在，不能单独证明它现在可借、读者有权限，或者借阅日期正确。这些条件还需要其他约束和业务检查。外键也不会自动把书名填进借阅查询；要合并两表内容，可以继续看 <ConceptTerm slug="join">JOIN</ConceptTerm>。</p>
      <p id="foreign-key-null" className="vp-citation-target">如果单列外键允许 NULL，空值通常可以表示“未引用对象”，不需要匹配一行目标。这里的借阅必须属于一本书，所以额外声明 <code>NOT NULL</code>。<strong>必须有值与值必须指向有效记录，是两个条件。</strong>多列外键的空值匹配还有自己的规则，需要按定义核对。<Cite id="foreign-key-null" /></p>
    </ArticleSection>
    <ArticleSection id="check" title="确认约束真的在执行">
      <Legacy slug="foreign-key" names={["prompt-heading"]} />
      <p id="foreign-key-enforcement" className="vp-citation-target">在支持外键的 SQLite 中，应用需要确认每个连接的检查配置；可以用 <code>PRAGMA foreign_keys = ON</code>启用，再查询状态。不应假定默认值一定符合要求。写了 REFERENCES，但当前连接没有执行外键检查，仍可能写出无效引用。<Cite id="foreign-key-enforcement" /></p>
      <p id="foreign-key-existing" className="vp-citation-target">给已有表补约束，也要检查旧数据。PostgreSQL 的常规 <code>ALTER TABLE … ADD FOREIGN KEY</code>会检查现有记录，违反约束时不能直接添加成功。先查清缺失目标的记录，再决定补对象、改引用或移除无效数据，不要把“加了一行定义”当作已经清理完成。<Cite id="foreign-key-existing" /></p>
      <ArticleAside title="约束与索引的实现差异">
        <p id="foreign-key-indexes" className="vp-citation-target">MySQL 8.4 要求外键引用列有可用索引，缺少时会自动创建。PostgreSQL 则不会因为声明外键就自动给引用方建立索引。约束决定哪些数据有效；索引决定如何更快查找。核对迁移脚本时，要分别检查两者的实际定义。<Cite id="foreign-key-indexes" /></p>
      </ArticleAside>
      <p>确认关系时，依次看引用哪列、是否可空、删除与更新策略、当前数据库是否执行检查。再把相关写入放进适当的 <ConceptTerm slug="transaction">事务</ConceptTerm>，保证一次业务操作的各部分按预期一起完成。</p>
    </ArticleSection>
  </ConceptArticle>;
}
