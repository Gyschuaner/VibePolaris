import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { AsyncLegacyAnchors } from "./AsyncConceptPages";
import { JsonLesson, SchemaLesson } from "./DataConceptLessons";
import { jsonSources, schemaSources } from "@/lib/async-concept-sources";
import base from "./EventConcepts.module.css";
import styles from "./AsyncConcepts.module.css";

export function JsonTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={jsonSources} />;
  return <ConceptArticle slug="json" title="JSON" subtitle="用文本传递结构化数据" sources={jsonSources}
    intro={<>书目服务要把书名、数量和是否可借交给网页，可以先把这些信息写成 JSON 文本。网页按它的规则读出每一项，再用来显示书单。JSON 约定的是数据的写法，数据具体表示什么，仍要由发送方和接收方商量好。</>}
    sections={[["text", "文本和对象"], ["parse", "把文本读成值"], ["types", "引号改变了类型"], ["exchange", "交换数据的约定"]]}
    hero={<ConceptHero slug="json" label="同一段 JSON 文本经解析展开为对象，其中 title 是字符串、copies 是数字；原文本仍留在上方"><div className={styles.jsonHero}>
      <div className={styles.jsonRibbon}><code>{'{"title":"灯塔","copies":2}'}</code></div>
      <div className={styles.jsonFold}><span>JSON.parse()</span><div className={styles.jsonObject}>
        <small>{'{}'} object</small>
        <div className={styles.jsonField}><code>title</code><strong className={styles.jsonString}>“灯塔”</strong><small>string</small></div>
        <div className={styles.jsonField}><code>copies</code><strong className={styles.jsonNumber}>2</strong><small>number</small></div>
      </div></div>
    </div></ConceptHero>}>
    <ArticleSection id="text" title="文本和对象">
      <AsyncLegacyAnchors slug="json" names={["question", "definition"]} />
      <p id="json-purpose" className="vp-citation-target">JSON 是一种用文本交换数据的格式，不限于 JavaScript 程序使用。也可以直接发送“《小岛上的灯塔》有 2 本，可借”这句话，但接收程序得另外约定怎样从句子里取出书名和数量。JSON 给这些内容固定的结构：字段名指出这项内容叫什么，值给出它的具体内容。<Cite id="json-purpose" /></p>
      <p id="json-values" className="vp-citation-target">JSON 能表达六类值：字符串是双引号中的文字，数字直接写成数，布尔值只有 <code>true</code> 和 <code>false</code>（真和假），<code>null</code> 表示一个明确写出的空值。对象把字段名和对应的值放在大括号里，数组则用方括号把值按顺序排成一列。整段 JSON 不必总是一个对象：<code>42</code>、<code>true</code>、<code>null</code> 单独出现，也都是合法 JSON 文本。<Cite id="json-values" /></p>
      <div className={styles.types} aria-label="JSON 的六类值"><code>"灯塔"</code><code>2</code><code>true</code><code>null</code><code>[…]</code><code>{'{…}'}</code></div>
      <p>本例把书名叫作 <code>title</code>，数量叫作 <code>copies</code>，是否可借叫作 <code>available</code>。这些是书目服务和网页约定的字段名，并非 JSON 自带的书目规则。对象适合把一本书的几项内容放在一起；多本书可以再按顺序放进数组。</p>
      <p>本例传来的是 JSON 文本，程序要用的是解析后的值。两者长得很像，容易混在一起：一段字符串看上去写着 title，不代表程序已经能按 title 取出书名。接收方先按 JSON 语法解析，得到可操作的值；原来的文本不会因此被改写。</p>
      <p id="json-stringify" className="vp-citation-target">在 JavaScript 中，<code>JSON.stringify(value)</code> 把能用 JSON 表示的值写成文本，这个过程叫序列化，适合在发送或保存数据前使用。它只准备文本，真正发送还需要别的操作。反过来，<code>JSON.parse(text)</code> 把文本读成 JavaScript 中的值。<Cite id="json-stringify" /></p>
      <pre className={base.code}>{'const book = { title: "小岛上的灯塔", copies: 2 };\nconst text = JSON.stringify(book);\n// text 是字符串：\n// {"title":"小岛上的灯塔","copies":2}'}</pre>
    </ArticleSection>
    <ArticleSection id="parse" title="把文本读成值">
      <AsyncLegacyAnchors slug="json" names={["scene-heading"]} />
      <p>修改文本，再解析。右侧显示浏览器实际读到的类型和值。可以先给 copies 的数字加上引号，再试试多写一个尾逗号；两次改动看起来都很小，但结果不同。</p>
      <JsonLesson />
      <p id="json-parse" className="vp-citation-target">JSON.parse 按 JSON 语法读出 JavaScript 值。如果文本无效，它会报告名为 SyntaxError 的语法错误，程序需要处理这个错误，不能继续使用一次并未成功的解析结果。本页演示在解析失败后显示错误，修改文本后回到等待解析的状态，避免让旧结果看起来像新文本的结果。<Cite id="json-parse" /></p>
    </ArticleSection>
    <ArticleSection id="types" title="引号改变了类型" className={base.offset}>
      <p><code>2</code> 与 <code>"2"</code> 都能通过语法检查，前者是数字，后者是字符串。书目服务和网页约定数量必须是数字时，字符串形式仍不符合约定。<strong>解析成功，只说明文本能够读成值。</strong>至于数量是否合理，还需要检查字段是否齐全、类型是否正确，以及实际库存等业务规则。</p>
      <p id="json-grammar" className="vp-citation-target">JSON 的字段名和字符串使用双引号，不接受单引号、注释或尾逗号，也没有 undefined、函数、NaN 这样的值。它的写法来自 JavaScript，却不等于任意 JavaScript 对象代码。<Cite id="json-grammar" /></p>
      <div className={styles.comparison}><div><h3>字段不存在</h3><pre className={base.code}>{'{ "title": "灯塔" }'}</pre><p>这个对象里没有 copies。接收方需要决定它是可省略字段，还是漏掉了必要信息。</p></div><div><h3>字段值是 null</h3><pre className={base.code}>{'{ "title": "灯塔", "copies": null }'}</pre><p>copies 在对象里，值明确写为 null。它不是数字 0；是否表示“未知”，要由发送方和接收方约定。</p></div></div>
    </ArticleSection>
    <ArticleSection id="exchange" title="交换数据的约定">
      <AsyncLegacyAnchors slug="json" names={["quiz-heading", "prompt-heading"]} />
      <p id="json-contract" className="vp-citation-target">字段叫 title 还是 name，copies 是否必填、必须是什么类型，这些可检查的规则能写成 <ConceptTerm slug="json-schema">JSON Schema</ConceptTerm>，交给校验工具反复检查。但空数组究竟代表没有书还是尚未查询，仍需要约定含义，并由实际业务流程保证；只看一对空方括号，校验工具无法知道书店发生了什么。<Cite id="json-contract" /></p>
      <p id="json-precision" className="vp-citation-target">JSON 文本能写出很长的数字，但接收方未必能原样读回。JSON 标准 RFC 8259 提醒了这种精度差异：例如在 JavaScript 中，<code>9007199254740993</code> 解析成普通数字后会变成 <code>9007199254740992</code>。很长的编号可以约定用字符串传递。编号 <code>"00123"</code> 也适合保留为字符串：不带引号的 <code>00123</code> 不符合 JSON 数字语法，写成数字 <code>123</code> 又没有开头的两个 0。编号用来辨认记录，不必当成数量计算。<Cite id="json-precision" /></p>
      <p>日期同样需要约定格式与时区。默认 JSON.parse 读到日期字符串，仍只会交回字符串，不会自动变成 JavaScript 专门处理日期的 Date 对象。先明确要传的是哪一天、哪个时刻，再约定怎样写、怎样读。</p>
      <ArticleAside title="序列化不保证保存所有 JavaScript 值"><p id="json-loss" className="vp-citation-target">JavaScript 用 undefined 表示未定义的值。默认 JSON.stringify 会省略对象里值为 undefined 的字段；数组里同样的值则会变成 null。对象如果绕一圈又指回自身（循环引用），序列化会报错；BigInt 是 JavaScript 的大整数类型，没有另外定义转换方式时也会报错。所以先 stringify 再 parse，不能保证任意对象都完整保留下来。<Cite id="json-loss" /></p><pre className={base.code}>{'JSON.stringify({ note: undefined }); // "{}"\nJSON.stringify([undefined]);         // "[null]"'}</pre></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function JsonSchemaTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={schemaSources} />;
  return <ConceptArticle slug="json-schema" title="JSON Schema" subtitle="把数据约定写成可检查的规则" sources={schemaSources}
    intro={<>一段 JSON 没有语法错误，仍可能漏了数量、写错状态，或者把数字放进引号。JSON Schema 描述哪些结构和取值可以接受，校验时再把实际数据与这些规则对照。</>}
    sections={[["contract", "数据之外的那份约定"], ["validate", "找出不合约定的字段"], ["keywords", "规则的不同职责"], ["boundary", "通过校验之后"]]}
    hero={<ConceptHero slug="json-schema" label="左侧规则与右侧数据逐字段对照：done 不在 status 的候选值中，count 的 -1 低于下限；两份数据都没有被自动改写"><div className={styles.schemaHero}>
      <div className={styles.schemaHeroSheet}><span>规则</span><div className={styles.schemaHeroField}><code>status</code><strong>pending / success</strong></div><div className={styles.schemaHeroField}><code>count</code><strong>整数 ≥ 0</strong></div></div>
      <div className={styles.schemaHeroBridge}><div><i /><b>×</b><i /></div><div><i /><b>×</b><i /></div></div>
      <div className={styles.schemaHeroInstance}><span>数据</span><div className={styles.schemaHeroField}><code>status</code><strong>done</strong><small>不在候选</small></div><div className={styles.schemaHeroField}><code>count</code><strong>-1</strong><small>低于 0</small></div></div>
    </div></ConceptHero>}
    relatedIntro={<>在 <ConceptTerm slug="structured-output">结构化输出</ConceptTerm> 中，Schema 帮助约束结果的形状；回到 <ConceptTerm slug="tools">工具调用</ConceptTerm>，同样要区分“参数符合约定”和“操作已经成功”。</>}>
    <ArticleSection id="contract" title="数据之外的那份约定">
      <AsyncLegacyAnchors slug="json-schema" names={["question", "definition"]} />
      <p id="schema-definition" className="vp-citation-target"><strong>Schema 写规则，实例装数据，校验器比较二者。</strong>JSON Schema 用关键字描述实例应满足的约束；所有适用约束都满足，才能说这份实例对这份 Schema 有效。换一份规则，同一份数据可能得到不同结论。<Cite id="schema-definition" /></p>
      <p>假设书店用 status 表示一次书目整理的状态，允许 pending 或 success；count 表示已经整理的数量，必须是非负整数。这些含义由书店自己约定，JSON Schema 把其中可检查的部分写下来。</p>
      <blockquote className={styles.leadQuote}>“这是合法 JSON”与<br />“这符合我们的数据约定”，是两次检查。</blockquote>
    </ArticleSection>
    <ArticleSection id="validate" title="找出不合约定的字段">
      <AsyncLegacyAnchors slug="json-schema" names={["scene-heading"]} />
      <p>左侧约定固定，右侧是准备提交的对象。先校验原始数据，再逐项修改。这里专门检查这一份示例规则；展开 Schema 可以看到对应关键字，不会自动修正你的输入。</p>
      <SchemaLesson />
      <p>把 done 改成 success，只修正了 status；count 为 −1 仍然失败。把数量改成 0 后可以通过，但勾选“写成字符串”，同样的字符又不符合整数要求。错误位置告诉你改哪个字段，规则名称解释为什么需要改。</p>
    </ArticleSection>
    <ArticleSection id="keywords" title="规则的不同职责">
      <p id="schema-required" className="vp-citation-target"><code>properties</code> 描述字段出现时应满足的规则，<strong>不会自动把它变成必填项</strong>。必须出现的字段另写进 required。字段缺失和字段存在但为 null 也不同：前者涉及是否出现，后者还要看允许的类型。<Cite id="schema-required" /></p>
      <div className={styles.comparison}><div><h3>限定候选值</h3><p id="schema-enum" className="vp-citation-target">enum 列出允许的取值。本例只接受 pending、success，所以 done 即使能表达相似意思，也不在这份约定里。<Cite id="schema-enum" /></p></div><div><h3>限定数值</h3><p id="schema-numeric" className="vp-citation-target">integer 要求整数，minimum: 0 允许 0 及更大的值；字符串 "2" 不会自动变成整数。数值 2.0 仍是整数，小数 2.5 则不是。<Cite id="schema-numeric" /></p></div></div>
      <p id="schema-extra" className="vp-citation-target">默认可以带额外字段。本例明确写了 <code>additionalProperties: false</code>，因此 debug 会被拒绝。是否封闭字段，应由接口约定决定；列出 properties 本身不会禁止其他字段。<Cite id="schema-extra" /></p>
    </ArticleSection>
    <ArticleSection id="boundary" title="通过校验之后" className={base.offset}>
      <AsyncLegacyAnchors slug="json-schema" names={["quiz-heading", "prompt-heading"]} />
      <p id="schema-boundary" className="vp-citation-target">校验结论针对的是 Schema 声明的结构与取值约束。它能检查 count 是不是非负整数；<strong>不能仅凭这份规则证明书店真的整理了这么多本书。</strong>后者需要业务记录或实际检查来提供证据。<Cite id="schema-boundary" /></p>
      <p>同样，一份工具参数可以格式正确，却没有执行权限；模型生成的摘要可以符合字段结构，却写错事实。通过 Schema 校验只是流程中的一步，后面仍要判断权限、执行结果和内容依据。</p>
      <p id="schema-dialect" className="vp-citation-target">Schema 也有方言和版本。<code>$schema</code> 声明这份规则采用哪种方言，帮助工具正确解释关键字。本例采用 Draft 2020-12；接入其他工具时，应核对它支持的版本与关键字范围。<Cite id="schema-dialect" /></p>
      <ArticleAside title="修改规则，也是在修改接口约定"><p>如果过去允许省略 count，后来将它加入 required，旧客户端仍可能发出不带 count 的数据。规则更严格不一定自动让系统更好；发布新规则前，要确认已有数据和调用方能否满足它，再安排迁移。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
