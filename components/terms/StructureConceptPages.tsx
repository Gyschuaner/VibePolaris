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
    intro={<>借阅记录存了书号和读者，界面还想显示当前书名。AI 建议“用 JOIN 查出来”：拿借阅中的书号去找对应书目，再把书名和这次借阅放在同一行结果里。同一册书被借过两次时，会配出两行，分别属于两次借阅。</>}
    hero={<ConceptHero slug="join" label="42号书目与两次借阅配对，得到两条查询结果"><div className={s.joinHero}><div><span>书目 #42</span><span>借阅 1 · #42</span><span>借阅 2 · #42</span></div><Intersect size={30} /><div><span>山间来信 · 林舟</span><span>山间来信 · 陈禾</span></div></div></ConceptHero>}>
    <ArticleSection id="match" title="把书名和借阅放在一起">
      <Legacy slug="join" names={["question"]} />
      <p id="join-definition" className="vp-citation-target"><strong>JOIN 把表中的行按规则配在一起，生成本次查询的结果。</strong>这里的“连接”指记录配对。书目表叫 <code>books</code>，每一行是一册书，保存书号 <code>book_id</code> 和书名 <code>title</code>。借阅表叫 <code>loans</code>，每一行是一次借阅，保存这次借阅的编号 <code>loan_id</code>、所借书号 <code>book_id</code> 和读者 <code>reader</code>。借阅编号识别哪一次借阅，书号识别借的是哪册书。<Cite id="join-definition" /></p>
      <p>只看借阅表，可以知道林舟借了 #42，却看不到书名；只看书目表，可以知道 #42 叫《山间来信》，却不知道谁借过。让两边的 book_id 相等，就能配出“山间来信 · 林舟”。<code>books.book_id</code> 表示书目表的书号列，<code>loans.book_id</code> 表示借阅表的书号列；点号前面的名字说明这一列来自哪张表。</p>
      <p>程序也可以分开查询两张表，再逐条找书名。JOIN 把配对规则交给数据库，让一次查询返回两边需要的信息。查询结果会包含这些组合，原来的两张表仍然各自保存记录。这份查询结果不会合并两张原表，也不会改变原表中的记录。</p>
      <p id="join-alias" className="vp-citation-target">下面的 SQL 查询给 books 临时取了简称 <code>b</code>，给 loans 取了简称 <code>l</code>，这种简称叫<strong>别名</strong>。所以 <code>b.title</code> 是书名，<code>l.reader</code> 是读者。<code>FROM</code> 指定查询的表，<code>ON b.book_id = l.book_id</code> 写出两边书号必须相等的配对条件，<code>SELECT</code> 指定结果中要显示的列。<Cite id="join-alias" /></p>
      <pre className={base.code}>{'SELECT b.title, l.reader\nFROM books b INNER JOIN loans l\n  ON b.book_id = l.book_id;'}</pre>
      <p id="join-key" className="vp-citation-target">本例把书目中的 book_id 作为<strong>主键</strong>，要求每册书的编号唯一且不能缺值；借阅中的 book_id 可以重复，因为同一册书可以有多次借阅。<ConceptTerm slug="foreign-key">外键</ConceptTerm>则是数据库里的一种检查规则，例如要求借阅中的书号必须对应已有书目。JOIN 本身不要求先声明外键，它按查询中给出的条件配对。<Cite id="join-key" /></p>
      <p>为了观察找不到对应书目的情况，本页的固定样例特意放了一条书号 #65 的借阅，而书目中没有 #65。演示不运行外键检查；实际系统如果启用了相应检查，新增这条借阅应被拒绝。</p>
    </ArticleSection>
    <ArticleSection id="pairs" title="一条书目可能配出多行">
      <Legacy slug="join" names={["scene-heading"]} />
      <p id="join-multiplicity" className="vp-citation-target"><code>INNER JOIN</code> 叫内连接，只把符合条件的一对行放进结果。#42 对上借阅 1 的林舟，也对上借阅 2 的陈禾，所以《山间来信》出现两行：每行对应一次不同的借阅。#78 没有借阅，借阅 3 的 #65 没有对应书目，它们都不进入这个结果。<Cite id="join-multiplicity" /></p>
      <p id="join-cross" className="vp-citation-target"><code>CROSS JOIN</code> 叫交叉连接，把每条书目与每条借阅都组合一次，不要求编号相等。两条书目各配三条借阅，总共是 2 × 3 = 6 行。比如 #78 也会和“借了 #42 的林舟”放在一行；这个组合本身不能说明林舟借过 #78。选择哪种连接方式和配对规则，取决于你想查什么。<Cite id="join-cross" /></p>
      <p>下方矩阵的每格是一种候选组合，勾和叉只表示两边的书号是否相同；选中 CROSS 时，不同编号的组合也会进入结果。按钮决定本次采用哪一种连接，下面显示相应 SQL 和结果。SQL 中的 <code>AS loan_book_id</code> 把借阅侧的书号列在结果中叫作 loan_book_id，方便与书目侧的 book_id 区分，并没有给原表的列改名。</p>
      <p>另外两个 LEFT 按钮会保留一侧找不到配对的记录，用 <code>NULL</code> 填另一侧的结果列。NULL 表示这一项没有值，不是编号 0，也不是新增一条真实借阅。原表中的书目和借阅始终保留。这个有限模型展示配对与结果，不连接数据库，也不表示数据库实际必须逐格执行。</p>
      <JoinLesson />
      <p>这里一行结果代表一对书目与借阅。若只显示书名，不显示读者或借阅编号，两行可能看起来完全一样，但两次配对仍是不同的借阅。想统计每册书被借过几次，需要把同一册书的借阅分组后计数；这种按组汇总的操作叫聚合。想每册书只显示一行，则先说明要选哪一次借阅，或者怎样汇总，不能随手删去“重复书名”就当作结果正确。</p>
    </ArticleSection>
    <ArticleSection id="missing" title="没有配上的记录怎么办">
      <Legacy slug="join" names={["quiz-heading"]} />
      <p id="join-outer" className="vp-citation-target"><strong>LEFT JOIN 先保留匹配结果，再让左侧没有匹配对象的行也出现在结果中，另一侧的列用 NULL 补齐。</strong>左侧是 SQL 中写在 LEFT JOIN 前面的表。<code>books b LEFT JOIN loans l</code> 把书目放左侧；<code>loans l LEFT JOIN books b</code> 把借阅放左侧。同一张表可以在不同查询中放在不同侧。<Cite id="join-outer" /></p>
      <p>选“书目 LEFT”，#42 仍配出两次借阅，#78 多出一行，借阅编号、借阅书号和读者都是 NULL，总共三行。选“借阅 LEFT”，前两次借阅照常配上 #42；借阅 3 仍保留原书号 65 和读者唐宁，但书目侧的编号与书名是 NULL，也是三行。LEFT JOIN 不会把右侧单独剩下的行也保留下来：选“书目 LEFT”时，借阅 3 不在结果里。</p>
      <p id="join-missing" className="vp-citation-target">可以用“借阅 LEFT”的结果找出没有对应书目的借阅。<code>WHERE</code> 表示再筛选结果，<code>b.book_id IS NULL</code> 表示“书目侧的编号没有值”。本例书目表的主键不能是 NULL，因此只要这列在连接结果中是 NULL，就能判断书目侧没有匹配上；若改为检查某个允许缺值的普通列，已经配上的行也可能因那一列没填而被算进去。下面筛出借阅编号 3、它原来记录的书号 65。MySQL 的官方示例也用右侧编号为 NULL 查找没有配对的记录。<Cite id="join-missing" /></p>
      <pre className={base.code}>{'SELECT l.loan_id, l.book_id\nFROM loans l LEFT JOIN books b\n  ON b.book_id = l.book_id\nWHERE b.book_id IS NULL;\n\n-- 3 | 65'}</pre>
    </ArticleSection>
    <ArticleSection id="filter" title="连接之后还可以筛选" className={base.offset}>
      <Legacy slug="join" names={["prompt-heading"]} />
      <p id="join-where" className="vp-citation-target">LEFT JOIN 属于外连接，它把一侧没有配上的行也留了下来。但后面的筛选仍然可能去掉这些行。<code>ON</code> 决定哪些行能配对，给未匹配的行补 NULL 后，<code>WHERE</code> 再筛选，只留下条件成立的结果。这个顺序在 SQLite 的官方说明中有明确区分。<Cite id="join-where" /></p>
      <p>以“书目 LEFT”的三行结果为例，再加 <code>WHERE l.reader = '林舟'</code>，就是只要读者为林舟的行。#42 与林舟的配对留下；#42 与陈禾的配对被筛掉；#78 补出的 reader 是 NULL，也不满足“是林舟”，因此被筛掉。最后只剩一行，虽然前面的 LEFT JOIN 曾保留 #78。</p>
      <p id="join-on-filter" className="vp-citation-target">如果把“读者是林舟”写进配对条件，即 <code>ON b.book_id = l.book_id AND l.reader = '林舟'</code>，就要同时满足书号相等、读者是林舟，才算配上。#42 配上林舟，陈禾不参与这次匹配；#78 仍没有配对，但作为左侧书目会保留，借阅侧是 NULL。没有后面的 WHERE 筛选时，结果是两行。两种写法回答的问题不同：一种只留下林舟的借阅，一种保留所有书目，同时只配上林舟的借阅。<Cite id="join-on-filter" /></p>
      <ArticleAside title="连接查询的核对材料">
        <p>请 AI 写 JOIN 时，先说明每张表一行代表什么、用哪几列匹配、是否允许匹配出多行，以及要保留哪一侧没有对应记录的行。给它这类包含缺失与多次借阅的样例，再要求列出预期结果。只给表名，或者只要求生成能运行的 SQL，还不足以判断结果是否符合需要。</p>
        <p id="join-self" className="vp-citation-target">连接的两边也可以来自同一张表。比如员工表同时保存员工编号和经理编号，可以给它取“员工”和“经理”两个别名，用员工这一侧的经理编号找经理那一侧的员工编号。别名区分查询中的两个角色，不会复制或修改原表。<Cite id="join-self" /></p>
      </ArticleAside>
      <p>排查结果时，先检查配对条件：一行到底对应哪两条记录，某个编号能配上几行，没有配上的行被保留还是被筛掉。确认这些结果符合需要后，再结合数据库的执行计划判断它怎样查得更快；<ConceptTerm slug="index">索引</ConceptTerm>可能帮助查找，但不会替你决定应该保留哪一行。</p>
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
