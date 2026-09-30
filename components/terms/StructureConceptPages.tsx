import { Blueprint, EnvelopeSimple, Intersect, Table as TableIcon, XCircle } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleAside, ArticleCitation, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { SchemaLesson, JoinLesson, UniqueLesson } from "./StructureConceptLessons";
import { schemaSources, joinSources, uniqueSources } from "@/lib/structure-sources";
import s from "./StructureConcepts.module.css";
import base from "./EventConcepts.module.css";

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>;
}

export function DatabaseSchemaTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={schemaSources} />;
  return <ConceptArticle slug="database-schema" title="数据库模式" sources={schemaSources}
    sections={[["structure", "结构与书目分开看"], ["change", "给已有记录增加一列"], ["contract", "结构里也有数据规则"], ["namespace", "schema 的另一种用法"]]}
    intro={<>图书室已经存下两册书的编号和书名，现在想让程序显示每册书能否借出。AI 建议“给数据库 schema 加一个可借状态字段”。这句话涉及两件事：给所有书目增加一种共同的记录项，再把每册书的实际状态填进去。数据库模式就是这些记录项及其规则的定义。</>}
    hero={<ConceptHero slug="database-schema" label="书目结构增加布尔列，原有两条记录的新值仍是NULL"><div className={s.schemaHero}><Blueprint size={28} /><div><code>books</code><span>book_id · integer</span><span>title · text</span><span>available · boolean</span></div><div><span>#42 → NULL</span><span>#78 → NULL</span></div></div></ConceptHero>}>
    <ArticleSection id="structure" title="结构与书目分开看">
      <Legacy slug="database-schema" names={["question", "definition"]} />
      <p id="schema-definition" className="vp-citation-target"><strong>数据库模式描述数据的结构：保存哪些记录项，各项能放什么值，以及数据库要检查哪些规则。</strong>这里的“模式”是 schema 的译名，指结构定义。我们用一张名叫 <code>books</code> 的表存书目，每一行代表一册书，每一列是这些书共同拥有的记录项。编号列叫 <code>book_id</code>，书名列叫 <code>title</code>；“给表加一个字段”在这个例子中就是增加一列。<Cite id="schema-definition" /></p>
      <p id="schema-types" className="vp-citation-target">列的类型规定能存哪一类值：<code>integer</code> 是整数，用来存 42、78 这样的编号；<code>text</code> 是文本，用来存书名。下面左边是两列的定义，右边是按这个定义保存的两条记录。给另一册书增加一行记录，用的仍是同一套列；即使把书目记录全部删除，只要没有删除表，列定义仍然存在。<Cite id="schema-types" /></p>
      <div className={s.definitionPair}><div><Blueprint size={25} /><h3>结构定义</h3><code>book_id integer<br />title text</code></div><div><TableIcon size={25} /><h3>具体记录</h3><code>42 · 山间来信<br />78 · 夜空地图</code></div></div>
      <p>把《山间来信》改名，只改变 #42 这一行的书名，这是改数据。增加 <code>available</code> 列，让所有书目都能记录可借状态，这是改结构。已经有两列、存了两行的表，也可以继续修改结构；不需要为了多记一项信息，就把原来的书目删掉重建。</p>
    </ArticleSection>
    <ArticleSection id="change" title="给已有记录增加一列">
      <Legacy slug="database-schema" names={["scene-heading"]} />
      <p id="schema-boolean" className="vp-citation-target">我们把可借状态列命名为 <code>available</code>，类型设为 <code>boolean</code>，也就是布尔类型。它的两个明确取值是 <code>true</code> 和 <code>false</code>，本例分别用来表示“可借”和“不可借”。允许缺值时，还可以是 <code>NULL</code>：这一项没有值。在这里，它表示尚未记录可借状态，不能当成“不可借”，也不能当成“可借”。<Cite id="schema-boolean" /></p>
      <p id="schema-new-column" className="vp-citation-target">以 PostgreSQL 为例，添加一个<strong>没有默认值、允许 NULL</strong> 的列后，两条旧记录的新列先都是 NULL。增加列告诉数据库“今后可以记这一项”，没有告诉它每册书实际能否借出。馆员检查后，才能把 #42 填成 true、#78 填成 false。<Cite id="schema-new-column" /></p>
      <p><code>NOT NULL</code> 是“这一列不允许 NULL”的规则。图中原有编号的 <code>PRIMARY KEY</code> 是主键规则，要求编号唯一且非空；本次要修改的是 available 列。下面先增加列，再给书目填值；只补好一条时就尝试设为 NOT NULL，看定义是否会改变。两条的填充值是固定示例，你也可以先填 #78。演示只在页面内模拟这次变更，不连接真实数据库；“恢复初始结构”会重置这个示例。</p>
      <SchemaLesson />
      <p id="schema-validation" className="vp-citation-target"><strong>设为 NOT NULL 前，现有记录也必须符合要求。</strong>只填好 #42，#78 仍是 NULL，数据库就会拒绝这次规则变更；已填的 #42 仍是 true，列定义也仍允许 NULL。两条都补齐后再提交，才能增加非空规则。以后写入或修改记录时，这一列也不能是 NULL。增加列、修改列的规则，改的是表定义；给一行填值，改的是这一行的数据。<Cite id="schema-validation" /></p>
      <p id="schema-default" className="vp-citation-target">旧记录的新列并非总是 NULL。如果增加列时指定默认值 true，旧记录就会得到这个默认值；这只说明程序规定了一个填充值，并不说明馆员检查过它们。而在列已经增加之后，单独给它设置默认值，会影响以后省略这项值的新增记录，不会替你补齐现有的 NULL。<Cite id="schema-default" /></p>
      <ArticleAside title="把变更交给下一位开发者">
        <p>开发者通常会把这些变更写成可以按顺序执行的命令，称为迁移脚本，交代原来的结构、怎样增加列、怎样补旧数据。本例不能简单用“全部填 true”代替馆员检查。如果旧程序仍不填写 available，就需要安排新程序和非空规则何时启用。</p>
        <p id="schema-migration-lock" className="vp-citation-target">教学里两行数据的变更很快，不代表真实系统也能那么快完成。以 PostgreSQL 为例，修改表结构时可能需要锁住表，让其他操作暂时等待。<Cite id="schema-migration-lock" />失败后会保留哪些修改，取决于数据库、事务和脚本怎样执行。页面的重置按钮不是数据库自动回退的承诺。需要实施时，再按具体数据库规划迁移和恢复方法。</p>
      </ArticleAside>
    </ArticleSection>
    <ArticleSection id="contract" title="结构里也有数据规则" className={base.offset}>
      <Legacy slug="database-schema" names={["quiz-heading", "prompt-heading"]} />
      <p id="schema-contract" className="vp-citation-target">类型只是结构的一部分，数据库检查的规则叫<strong>约束</strong>。比如把 <code>book_id</code> 声明为<ConceptTerm slug="primary-key">主键</ConceptTerm>，就要求每册书的编号唯一且非空；<ConceptTerm slug="foreign-key">外键</ConceptTerm>可以要求借阅中的书号对应已有书目；<ConceptTerm slug="unique-constraint">唯一约束</ConceptTerm>可以要求某一列或几列合起来的值不重复。这些规则需要明确声明，列名叫 book_id 并不会自动让它成为主键。<Cite id="schema-contract" /></p>
      <p>程序界面也能提醒“请填写可借状态”，但如果数据库没有相应规则，另一个写入入口仍可能把这一项留成 NULL。把 NOT NULL 写进表的定义后，数据库本身就会检查。下面的 SQL 命令用 <code>CREATE TABLE</code> 表示“创建表”：括号里逐列写出列名、类型和约束，<code>PRIMARY KEY</code> 声明主键。</p>
      <pre className={base.code}>{'CREATE TABLE books (\n  book_id integer PRIMARY KEY,\n  title text NOT NULL,\n  available boolean NOT NULL\n);'}</pre>
      <p>这是我们想要的表定义，用来创建一张新表；修改已经存在的 books 表，要用修改表结构的命令，而不是重新执行这段建表语句。这里的 available 没有默认值，新增记录时就需要提供 true 或 false。它告诉数据库怎样接受数据，不能证明数据符合现实：把一册已经借出的书填成 true，类型和非空检查仍会通过。是否真的可借，还要检查实际借阅情况。</p>
    </ArticleSection>
    <ArticleSection id="namespace" title="schema 的另一种用法">
      <p id="schema-namespace" className="vp-citation-target">在 PostgreSQL 里，schema 还指<strong>数据库内部给表等对象分组、区分名称的空间</strong>，也叫命名空间。一个数据库可以有 <code>library.books</code> 和 <code>archive.books</code> 两张不同的表：点号前是组名，点号后是表名，分别是图书室组和归档组中的 books。<code>CREATE SCHEMA archive</code> 创建的是名叫 archive 的组，没有替你定义 books 的列。<Cite id="schema-namespace" /></p>
      <p id="schema-search-path" className="vp-citation-target">如果只写 <code>books</code>，不写组名前缀，PostgreSQL 会按 <code>search_path</code> 指定的顺序寻找表。这个名字指的是“去哪些组里找、先找哪一组”的名单；找到的第一张同名表就是本次使用的表。因此，问 AI “修改数据库 schema”时，需要说清是修改书目的列和规则，还是创建或调整表所在的组。<Cite id="schema-search-path" /></p>
      <p><ConceptTerm slug="json-schema">JSON Schema</ConceptTerm>也使用 schema 这个词，描述的是 JSON 数据的验证规则，不会替你在关系数据库中建表。回到图书室的需求，可以具体说“给 books 表增加可借状态列，先补齐旧书目，再要求这一列非空”。接下来需要安排这些命令怎样在已有系统中执行，就会遇到<ConceptTerm slug="database-migration">数据库迁移</ConceptTerm>。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function JoinTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={joinSources} />;
  return <ConceptArticle slug="join" title="连接查询" sources={joinSources}
    sections={[["match", "把书名和借阅放在一起"], ["pairs", "一条书目可能配出多行"], ["missing", "没有配上的记录怎么办"], ["filter", "连接之后还可以筛选"]]}
    intro={<>借阅表只记书的编号，页面却要显示书名。需要把借阅与书目按编号对上，再取出两边的信息。同一本书被借过两次时，结果应该保留两次借阅，不能只看见一个书名就合成一行。</>}
    hero={<ConceptHero slug="join" label="42号书目与两次借阅配对，得到两条查询结果"><div className={s.joinHero}><div><span>书目 #42</span><span>借阅 1 · #42</span><span>借阅 2 · #42</span></div><Intersect size={30} /><div><span>山间来信 · 林舟</span><span>山间来信 · 陈禾</span></div></div></ConceptHero>}>
    <ArticleSection id="match" title="把书名和借阅放在一起">
      <Legacy slug="join" names={["question", "definition"]} />
      <p id="join-definition" className="vp-citation-target"><strong>JOIN 按指定条件组合不同表中的行，形成本次查询的结果。</strong>这里比较 <code>books.book_id</code>和 <code>loans.book_id</code>，匹配后取书名与读者。查询中用 <code>b</code>和 <code>l</code>作为两个表的别名，让同名字段的来源明确。它不会把两张原表永久合成一张。<Cite id="join-definition" /></p>
      <p>JOIN 的条件可以比较没有外键声明的字段。<ConceptTerm slug="foreign-key">外键</ConceptTerm>负责约束写入时的引用，JOIN 负责查询怎样配对。下面特意保留一条找不到 #65 书目的旧借阅，用来观察未匹配情况；如果已经正确执行相应外键检查，这样的新增记录应被拒绝。</p>
    </ArticleSection>
    <ArticleSection id="pairs" title="一条书目可能配出多行">
      <Legacy slug="join" names={["scene-heading"]} />
      <p id="join-multiplicity" className="vp-citation-target">INNER JOIN 为每一对符合条件的行生成结果。#42 对上借阅 1，也对上借阅 2，所以有两行；书名相同不代表这两次借阅相同。CROSS JOIN 则保留所有组合：两条书目与三条借阅得到六对，不检查编号相等。<Cite id="join-multiplicity" /></p>
      <p>矩阵展示候选配对，选择一种查询看结果如何变化。补出的 NULL 行放在结果中，原始书目和借阅始终保留。这个模型用于理解结果语义，不代表数据库实际必须逐格执行。</p>
      <JoinLesson />
      <p>看到“重复书名”时，先确认一行结果代表什么。这里一行代表一对书目与借阅，不该为了看起来整齐就随手去重。真要统计每本书被借过几次，需要另外做聚合；真要显示每本书一次，则要先明确选择或汇总借阅的规则。</p>
    </ArticleSection>
    <ArticleSection id="missing" title="没有配上的记录怎么办">
      <Legacy slug="join" names={["quiz-heading"]} />
      <p id="join-outer" className="vp-citation-target"><strong>LEFT JOIN 保留左侧没有匹配对象的行，并用 NULL 补齐另一侧的列。</strong>书目放左侧时，#78 没有借阅也会出现；借阅放左侧时，借阅 3 的 #65 仍会出现，但书名是 NULL。所谓“左侧”是当前 SQL 中的顺序，不是表永远具有的属性。<Cite id="join-outer" /></p>
      <p id="join-missing" className="vp-citation-target">可以利用这一规则查缺失对象。MySQL 文档给出 LEFT JOIN 后检查右侧键是否为 NULL 的写法。本例查询 <code>WHERE b.book_id IS NULL</code>，得到借阅 3；它在书目侧找不到匹配。这里检查的是非空主键，因此能区分“未匹配”与“匹配行某个普通字段恰好为空”。<Cite id="join-missing" /></p>
      <pre className={base.code}>{'SELECT l.loan_id, l.book_id\nFROM loans l LEFT JOIN books b\n  ON b.book_id = l.book_id\nWHERE b.book_id IS NULL;\n\n-- 3 | 65'}</pre>
    </ArticleSection>
    <ArticleSection id="filter" title="连接之后还可以筛选" className={base.offset}>
      <Legacy slug="join" names={["prompt-heading"]} />
      <p id="join-where" className="vp-citation-target">外连接中，ON 决定配对，WHERE 再筛结果。若在书目 LEFT JOIN 借阅之后加 <code>WHERE l.reader = '林舟'</code>，#78 补出的 NULL 不满足条件，就会消失。SQLite 文档明确说明补行发生在 ON 之后、WHERE 之前；把条件挪到 ON 中，结果可能不同。<Cite id="join-where" /></p>
      <ArticleAside title="连接查询的核对材料">
        <p>说明每张表的一行代表什么、匹配用哪些列、每边可能匹配几行、是否要保留没有对象的记录，再给一组包含缺失和多次引用的样例。要求它列出预期结果，而不只是写出一段能运行的 SQL。</p>
      </ArticleAside>
      <p>排查 JOIN 时，从配对条件、两侧数量和未匹配行开始。单独检查列名、索引或语法，无法替代这些语义判断。确认结果正确后，再讨论数据库怎样更快执行。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function UniqueConstraintTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={uniqueSources} />;
  return <ConceptArticle slug="unique-constraint" title="唯一约束" sources={uniqueSources}
    sections={[["rule", "邮箱只能属于一条注册记录"], ["race", "预查通过，写入仍可能冲突"], ["scope", "明确唯一性的范围"], ["null", "空值的唯一性规则"]]}
    intro={<>两个注册请求使用同一个邮箱，编号却各不相同。它们都先查了一遍，都发现邮箱还没被使用。若数据库允许两次写入，页面再严谨的检查也挡不住这次冲突。</>}
    hero={<ConceptHero slug="unique-constraint" label="两个相同邮箱的请求进入注册表，第二次写入被唯一约束挡住"><div className={s.uniqueHero}><div><EnvelopeSimple size={24} /><span>lin@example.com</span></div><div><XCircle size={24} /><span>lin@example.com · 冲突</span></div><div><strong>UNIQUE</strong><span>101 · lin@example.com</span></div></div></ConceptHero>}>
    <ArticleSection id="rule" title="邮箱只能属于一条注册记录">
      <Legacy slug="unique-constraint" names={["question", "definition"]} />
      <p id="unique-definition" className="vp-citation-target"><strong>唯一约束要求一列或一组列的值不能在表中重复。</strong>这里用不同的 user_id 标识记录，再对 email 单独声明 UNIQUE。两条记录即使主键不同，同一邮箱仍会冲突。一张表可以有多个唯一约束；它们不必都成为主键。<Cite id="unique-definition" /></p>
      <pre className={base.code}>{'CREATE TABLE registrations (\n  user_id integer PRIMARY KEY,\n  email text UNIQUE\n);'}</pre>
      <p>唯一性要与业务范围一致。本例选择“同一邮箱只对应一条注册记录”，并假定输入已经按产品规则处理。约束不自动替应用决定怎样规范大小写、空格或邮箱别名；具体哪些值视为相同，也要核对数据库的类型和比较规则。</p>
    </ArticleSection>
    <ArticleSection id="race" title="预查通过，写入仍可能冲突">
      <Legacy slug="unique-constraint" names={["scene-heading"]} />
      <p>先让 A、B 分别检查空表，再任选一个先写入。另一份预查结果还写着“未占用”，但写入时表已经变了。关闭约束或切换输入会恢复空表，便于比较；这里用手动先后操作解释竞争，不是真正启动两个数据库事务。</p>
      <UniqueLesson />
      <p id="unique-race" className="vp-citation-target"><strong>预查是过去某一时刻的观察，唯一性必须在写入时守住。</strong>PostgreSQL 把冲突检查纳入唯一索引的插入过程。遇到其他事务尚未提交的冲突行时，可能先等待其结束，再检查是否冲突；不能简单把“先查、后写”两步当成不可分割的一步。<Cite id="unique-race" /></p>
      <p>预查仍有用，可以提前提示用户。但应用也要处理最后的写入冲突，让用户换邮箱或确认已有账户；拒绝第二次新增不会自动修改第一条注册记录。模型把每次成功写入视为已经提交，省略真实数据库的等待与回滚过程。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="明确唯一性的范围">
      <Legacy slug="unique-constraint" names={["quiz-heading"]} />
      <p id="unique-composite" className="vp-citation-target">如果一个邮箱可以分别加入不同组织，可以考虑 <code>UNIQUE (organization_id, email)</code>。检查的是整个组合：同一组织内不能重复，不同组织可以使用相同邮箱。它不要求每列单独唯一；约束的范围要对应你想阻止的那一种重复。<Cite id="unique-composite" /></p>
      <p id="unique-index" className="vp-citation-target">在 PostgreSQL 中，声明唯一约束会自动建立相应的唯一 B-tree 索引。约束表达有效数据的规则，索引是执行它的一种机制；已有约束时，不需要为了同一项检查再手工创建一份相同的唯一索引。<Cite id="unique-index" /></p>
      <ArticleAside title="只要求部分记录唯一">
        <p id="unique-partial" className="vp-citation-target">若保留注销账户的历史记录，却只要求有效账户邮箱唯一，PostgreSQL 可以用带条件的唯一部分索引来限定参与检查的行。它不是普通 UNIQUE 约束中的一个开关；条件要与业务定义一致，重新激活账户时也可能触发冲突。<Cite id="unique-partial" /></p>
        <pre className={base.code}>{'CREATE UNIQUE INDEX active_email_unique\nON registrations (email)\nWHERE active = true;'}</pre>
        <p>这段写法是扩展示例，假定表已有 active 列；上面的注册模型没有实现账户停用功能。</p>
      </ArticleAside>
    </ArticleSection>
    <ArticleSection id="null" title="空值的唯一性规则" className={base.offset}>
      <Legacy slug="unique-constraint" names={["prompt-heading"]} />
      <p id="unique-null" className="vp-citation-target">PostgreSQL 的普通 UNIQUE 默认允许多个 NULL；加 <code>NULLS NOT DISTINCT</code>可以把 NULL 也按相同值检查。需要邮箱必填，还应声明 NOT NULL。<strong>不重复与不能为空是两项要求。</strong>NULL 也不是空字符串。其他数据库的 NULL 唯一性规则可能不同，不能把这个默认行为当成所有实现的统一规则。<Cite id="unique-null" /></p>
      <p>可以回到演示切换 NULL，比较默认规则与 NULLS NOT DISTINCT。同一对请求只改这一项规则，便能看到第二次写入的结果改变；两个不同的记录编号始终没有冲突。</p>
      <p>定义唯一性时，要确定单列还是列组合、适用范围、空值和比较规则。数据库仍需处理最后的写入冲突；单靠注册前预查无法守住这个约束。</p>
    </ArticleSection>
  </ConceptArticle>;
}
