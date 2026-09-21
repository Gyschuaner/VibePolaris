import { Check } from "@phosphor-icons/react/dist/ssr";
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
    intro={<>接口返回的一串大括号，需要先读成程序里的数据，才能拿出书名、数量和是否可借。JSON 规定这段文本怎么写，让不同程序可以交换相同结构的信息。</>}
    sections={[["text", "文本和对象"], ["parse", "把文本读成值"], ["types", "引号改变了类型"], ["exchange", "交换时还要约定什么"]]}
    hero={<ConceptHero slug="json" label="JSON文本拆成字符串、数字和布尔值"><div className={styles.jsonHero}><code>{'["灯塔",2,true]'}</code><div className={styles.heroValues}><div><strong>灯塔</strong><span>string</span></div><div><strong>2</strong><span>number</span></div><div><strong>true</strong><span>boolean</span></div></div></div></ConceptHero>}>
    <ArticleSection id="text" title="文本和对象">
      <AsyncLegacyAnchors slug="json" names={["question", "definition"]} />
      <p id="json-values" className="vp-citation-target">JSON 是一种文本数据格式，能表达字符串、数字、布尔值、null、数组和对象。对象把字段名映射到值，数组按顺序容纳多项值。最外层不必总是大括号：<code>42</code>、<code>true</code>、<code>null</code> 本身也能构成合法 JSON 文本。<Cite id="json-values" /></p>
      <div className={styles.types} aria-label="JSON 的六类值"><code>"灯塔"</code><code>2</code><code>true</code><code>null</code><code>[…]</code><code>{'{…}'}</code></div>
      <p>网络上传的是文本，程序操作的是解析后的值。相似的外观很容易让人把两者混在一起：一段字符串看上去写着 title，不代表能直接访问它的 title 字段。接收方要先按 JSON 语法解析，再操作结果。</p>
      <p id="json-stringify" className="vp-citation-target">在 JavaScript 中，<code>JSON.stringify(value)</code> 把可表示的值转成 JSON 文本；反方向由 JSON.parse 完成。序列化适合准备要发送或保存的数据，并不是发送请求本身。<Cite id="json-stringify" /></p>
      <pre className={base.code}>{'const book = { title: "小岛上的灯塔", copies: 2 };\nconst text = JSON.stringify(book);\n// text 是字符串：\n// {"title":"小岛上的灯塔","copies":2}'}</pre>
    </ArticleSection>
    <ArticleSection id="parse" title="把文本读成值">
      <AsyncLegacyAnchors slug="json" names={["scene-heading"]} />
      <p>修改文本，再解析。右侧显示浏览器实际读到的类型和值。可以先给 copies 的数字加上引号，再试试多写一个尾逗号；两次改动看起来都很小，但结果不同。</p>
      <JsonLesson />
      <p id="json-parse" className="vp-citation-target">JSON.parse 按 JSON 语法构造 JavaScript 值。如果文本无效，它抛出 SyntaxError，而不是返回一个“差不多正确”的对象。本例因此会清除旧结果的有效状态，等你修改后重新解析。<Cite id="json-parse" /></p>
    </ArticleSection>
    <ArticleSection id="types" title="引号改变了类型" className={base.offset}>
      <p><code>2</code> 与 <code>"2"</code> 都能通过语法检查，前者是数字，后者是字符串。接口约定数量为数字时，字符串版本仍不符合约定。<strong>解析成功，只说明文本能够读成值。</strong>至于数量是否合理，还需要检查字段和业务规则。</p>
      <p id="json-grammar" className="vp-citation-target">JSON 的字段名和字符串使用双引号，不接受单引号、注释或尾逗号，也没有 undefined、函数、NaN 这样的值。它的写法来自 JavaScript，却不等于任意 JavaScript 对象代码。<Cite id="json-grammar" /></p>
      <div className={styles.comparison}><div><h3>字段不存在</h3><pre className={base.code}>{'{ "title": "灯塔" }'}</pre><p>这份对象没有 copies。接收方需要决定它是可省略字段，还是遗漏了必须的信息。</p></div><div><h3>字段值是 null</h3><pre className={base.code}>{'{ "title": "灯塔", "copies": null }'}</pre><p>copies 在对象里，值明确写为 null。它不是数字 0；是否表示“未知”，要由双方约定。</p></div></div>
    </ArticleSection>
    <ArticleSection id="exchange" title="交换时还要约定什么">
      <AsyncLegacyAnchors slug="json" names={["quiz-heading", "prompt-heading"]} />
      <p>对书单来说，双方还要约定字段叫 title 还是 name，copies 可不可以省略，以及空数组代表没有书还是尚未查询。把这些约定写成 <ConceptTerm slug="json-schema">JSON Schema</ConceptTerm>，接收方就能重复检查，而不用每次靠人读字符串。</p>
      <p id="json-precision" className="vp-citation-target">JSON 文本能写出很长的数字，但接收程序未必能精确表示它。RFC 8259 特别提醒了数字范围和精度的互操作问题。对于很长的编号，可以明确约定用字符串传递，避免它在 JavaScript 数字中被舍入。<Cite id="json-precision" /></p>
      <p>日期也要约定格式与时区。一个写着日期的字符串，不会因为内容像日期就自动成为 Date 对象。先明确传递的意义，再选表示方式；不要把接收语言的自动转换当作两端共同的契约。</p>
      <ArticleAside title="序列化不保证保存所有 JavaScript 值"><p id="json-loss" className="vp-citation-target">默认 JSON.stringify 会省略对象里的 undefined 属性；数组里同样的值会变成 null。循环引用会抛错，BigInt 没有另行定义转换时也会抛错。因此，先 stringify 再 parse 并不是适用于任意对象的无损复制。<Cite id="json-loss" /></p><pre className={base.code}>{'JSON.stringify({ note: undefined }); // "{}"\nJSON.stringify([undefined]);         // "[null]"'}</pre></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function JsonSchemaTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={schemaSources} />;
  return <ConceptArticle slug="json-schema" title="JSON Schema" subtitle="把数据约定写成可检查的规则" sources={schemaSources}
    intro={<>一段 JSON 没有语法错误，仍可能漏了数量、写错状态，或者把数字放进引号。JSON Schema 描述哪些结构和取值可以接受，校验时再把实际数据与这些规则对照。</>}
    sections={[["contract", "数据之外的那份约定"], ["validate", "找出不合约定的字段"], ["keywords", "规则分别管什么"], ["boundary", "通过校验之后"]]}
    hero={<ConceptHero slug="json-schema" label="status和count分别对齐枚举与整数约束，显示通过"><div className={styles.schemaHero}><div><code>pending</code><span>enum</span><Check size={20} /></div><div><code>2</code><span>integer ≥ 0</span><Check size={20} /></div></div></ConceptHero>}
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
    <ArticleSection id="keywords" title="规则分别管什么">
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
