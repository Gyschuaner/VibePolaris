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
    intro={<>图书室已经存下两条书目，现在要记录每册书能否借出。加一个字段并不难，难的是旧记录该填什么，以及什么时候才能要求它们都有值。这些问题都与数据库的结构有关。</>}
    hero={<ConceptHero slug="database-schema" label="书目结构增加布尔列，原有两条记录的新值仍是NULL"><div className={s.schemaHero}><Blueprint size={28} /><div><code>books</code><span>book_id · integer</span><span>title · text</span><span>available · boolean</span></div><div><span>#42 → NULL</span><span>#78 → NULL</span></div></div></ConceptHero>}>
    <ArticleSection id="structure" title="结构与书目分开看">
      <Legacy slug="database-schema" names={["question", "definition"]} />
      <p id="schema-definition" className="vp-citation-target"><strong>数据库模式描述数据的结构：有哪些表、列、类型、键和约束。</strong>本例的书目表有整数编号和文本书名；#42 的书名则是这一结构下的一份具体数据。即使删掉所有书目，列定义也仍然存在。PostgreSQL 建表语句明确列名与类型，插入记录是后续操作。<Cite id="schema-definition" /></p>
      <div className={s.definitionPair}><div><Blueprint size={25} /><h3>结构定义</h3><code>book_id integer<br />title text</code></div><div><TableIcon size={25} /><h3>具体记录</h3><code>42 · 山间来信<br />78 · 夜空地图</code></div></div>
      <p>讨论“修改数据库”时，先说清是修改结构还是修改数据。把《山间来信》改名，只改变一行的值；增加 <code>available</code>列，会改变所有书目共同采用的定义。两种操作也可能需要配合执行。</p>
    </ArticleSection>
    <ArticleSection id="change" title="给已有记录增加一列">
      <Legacy slug="database-schema" names={["scene-heading"]} />
      <p id="schema-new-column" className="vp-citation-target">以 PostgreSQL 为例，添加一个没有默认值的可空列后，旧记录的新列先是 NULL。这里表示尚未记录可借状态，不能直接当成“可借”或“不可借”。数据库知道列是布尔类型，但不知道馆员实际检查了哪一本书。<Cite id="schema-new-column" /></p>
      <p>先增加列，再分别补上 #42 和 #78 的状态。可以在只补好一条时尝试设为非空，观察拒绝的原因。演示是有限的结构变更模型，不连接数据库。</p>
      <SchemaLesson />
      <p id="schema-validation" className="vp-citation-target"><strong>设为 NOT NULL 前，现有记录也必须符合要求。</strong>本例尚有 NULL 时，变更被拒绝，结构仍允许空值；补齐两条记录后再提交，才会变成必填。新增列、填充旧数据、收紧约束，是这次变更中不同的动作。<Cite id="schema-validation" /></p>
      <ArticleAside title="把变更交给下一位开发者">
        <p>迁移脚本应交代起点、结构操作与数据处理方法。本例不能简单用“全部填 true”代替馆员检查。还要考虑新旧程序如何读写这列、操作失败后停在哪一步，以及生产数据量和锁的影响。教学中的两行即时变更不代表真实系统都能即时完成。</p>
      </ArticleAside>
    </ArticleSection>
    <ArticleSection id="contract" title="结构里也有数据规则" className={base.offset}>
      <Legacy slug="database-schema" names={["quiz-heading", "prompt-heading"]} />
      <p id="schema-contract" className="vp-citation-target">类型只是结构的一部分。<ConceptTerm slug="primary-key">主键</ConceptTerm>限制记录标识唯一且非空，<ConceptTerm slug="foreign-key">外键</ConceptTerm>限制引用关系，<ConceptTerm slug="unique-constraint">唯一约束</ConceptTerm>限制某列或列组合重复。它们共同决定哪些写入有效；列名叫 <code>book_id</code>，并不会自动获得这些规则。<Cite id="schema-contract" /></p>
      <pre className={base.code}>{'CREATE TABLE books (\n  book_id integer PRIMARY KEY,\n  title text NOT NULL,\n  available boolean NOT NULL\n);'}</pre>
      <p>这是一份完成变更后的目标定义。它告诉数据库如何接受数据，不能证明每条数据都符合现实：把一册已经借出的书填成 true，类型和非空检查仍可能通过。结构约束与业务核验要各自做好。</p>
    </ArticleSection>
    <ArticleSection id="namespace" title="schema 的另一种用法">
      <p id="schema-namespace" className="vp-citation-target">在 PostgreSQL 的具体语法中，schema 还指<strong>数据库内部的命名空间</strong>。例如 <code>sales.orders</code>和 <code>archive.orders</code>可以是不同的表。省略前缀时，<code>search_path</code>影响名称解析；因此看到 CREATE SCHEMA 或 schema 前缀，要先判断文档正在谈结构定义，还是对象的归属与名称。<Cite id="schema-namespace" /></p>
      <p><ConceptTerm slug="json-schema">JSON Schema</ConceptTerm>也使用 schema 这个词，但描述的是 JSON 数据的验证规则。它不会替你在关系数据库中建表。说明数据库、表、字段与所需规则，比只说“加一个 schema”清楚。</p>
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
