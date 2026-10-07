import { ArticleSection, ConceptTerm } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { xssSources } from "@/lib/ai-stack-concept-sources/xss";
import styles from "../ConceptArticle.module.css";
import { XssLesson } from "../ai-stack-lessons/xss";

const xssSections: [string, string][] = [["xss-need", "不可信数据进入了什么上下文"], ["xss-parse", "浏览器何时把字符串当标记"], ["xss-defense", "按输出上下文选择安全 API"], ["xss-boundary", "纵深防御和失败分支"]];
export function XssTermPage() {
  const sources = xssSources;
  const Lesson = XssLesson;
  return <Article slug="xss" title="跨站脚本" subtitle="XSS · 不可信数据进入可执行网页上下文" sources={sources} sections={xssSections} hero={<Hero variant="compare" trigger="同一条评论，用 innerHTML 和 textContent 为什么结果不同？" change="字符串被解析为 HTML，或保留为文字" proof="可执行节点从 1 个变成 0 个，原字符仍然显示" />} intro={<>XSS（Cross-Site Scripting）发生在不可信数据进入浏览器会解释或执行的网页上下文时。危险不只来自 <code>&lt;script&gt;</code>，事件属性、URL、JavaScript 和不同 HTML 位置都需要对应的编码或安全 API。</>}>
    <ArticleSection id="xss-need" title="不可信数据进入了什么上下文"><p>用户在评论框输入一段看似普通的 HTML。服务器把它原样存下来了，页面再决定如何渲染。真正的问题不是“字符串里有没有某个标签”，而是浏览器最后把它当文字、标记、属性还是脚本的一部分。</p><p id="xss-attack" className="vp-citation-target">OWASP 把 XSS 描述为不可信输入进入动态输出后，被浏览器以站点上下文解释；反射型、存储型和 DOM 型只是数据到达页面的不同路径。<Cite id="xss-attack" sources={sources} /></p><p id="xss-context" className="vp-citation-target">防护要按输出上下文选择规则：HTML、属性、URL、JavaScript 和 CSS 的危险位置不同，不能用一个“过滤字符”解决全部情况。<Cite id="xss-context" sources={sources} /></p><Lesson /></ArticleSection>
    <ArticleSection id="xss-parse" title="浏览器何时把字符串当标记" className={styles.splitSection}><p id="xss-inner" className="vp-citation-target">把不可信字符串赋给 <code>innerHTML</code> 会触发 HTML 解析；MDN 明确提醒这种写法可能产生 XSS，纯文本应优先使用 <code>textContent</code>。<Cite id="xss-inner" sources={sources} /></p><p id="xss-text" className="vp-citation-target"><code>textContent</code> 把同一串字符作为文本节点写入，浏览器不会把其中的标签当作 DOM 标记；这不是“自动清理 HTML”，而是选择了不同的输出语义。<Cite id="xss-text" sources={sources} /></p><p>本页使用本地、无外连的示例，只比较 DOM 节点数量和显示内容，不执行或发送真实攻击载荷。对照的证据是 1 个可执行节点变为 0 个。</p></ArticleSection>
    <ArticleSection id="xss-defense" title="按输出上下文选择安全 API"><p id="xss-defense-api" className="vp-citation-target">OWASP 建议使用框架默认转义、安全 sink 和按上下文的编码；需要允许富文本时，应先净化，再把结果交给受控 API。<Cite id="xss-defense-api" sources={sources} /></p><p id="xss-trusted" className="vp-citation-target">Trusted Types 可以限制危险 DOM sink 接受的输入类型，作为纵深防御的一部分；它不能替代正确的业务授权和上下文建模。<Cite id="xss-trusted" sources={sources} /></p><p>React 等框架默认把插值当文字，但显式的危险 HTML API 会绕过这层保护。看到一个“允许渲染 HTML”的需求时，先问内容来源、允许标签和输出位置。</p></ArticleSection>
    <ArticleSection id="xss-boundary" title="纵深防御和失败分支"><p>输入校验可以减少意外格式，但不能替代输出编码；长度限制不能证明内容安全；CSP 可以减轻影响，也不能作为唯一修复。存储型 XSS 还会影响之后访问同一页面的其他用户。</p><p>XSS 与 <ConceptTerm slug="sast">SAST</ConceptTerm> 的关系是：SAST 可能在源码中发现危险 sink，XSS 页面则解释浏览器运行时为什么会把某个输入当成代码。一个静态告警不等于已经触发，一次安全渲染也不等于全站没有其他上下文。</p><p><strong>停止条件</strong>：你能指出数据进入的输出上下文，选择对应安全 API 或净化策略，并能说出该分支还需要什么测试和纵深控制。</p></ArticleSection>
  </Article>;
}
