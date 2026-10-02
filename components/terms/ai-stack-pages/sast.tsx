import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { sastSources } from "@/lib/ai-stack-concept-sources/sast";
import styles from "../ConceptArticle.module.css";
import { SastLesson } from "../ai-stack-lessons/sast";

const sastSections: [string, string][] = [["sast-need", "程序没运行，也能先找线索"], ["sast-path", "从 source 走到危险 sink"], ["sast-report", "读懂告警的证据"], ["sast-boundary", "潜在问题不是已利用"]];
export function SastTermPage() {
  const sources = sastSources;
  const Lesson = SastLesson;
  return <Article slug="sast" title="静态应用安全测试" subtitle="SAST · 不运行程序分析安全数据流" sources={sources} sections={sastSections} hero={<Hero trigger="代码还没部署，能否发现输入直达 SQL 的风险？" change="源代码数据流被规则追踪" proof="source → sink 路径被修复，重扫告警归零" />} intro={<>SAST（Static Application Security Testing）在不运行应用的情况下分析源代码、字节码或构建产物，寻找可能的安全路径。它把不可信输入、危险操作、规则和代码位置放在一条证据链上，报告的是需要确认的潜在问题。</>}>
    <ArticleSection id="sast-need" title="程序没运行，也能先找线索"><p>你准备合并一个搜索接口，代码还没有部署，也没有真实请求可发。静态分析可以先从 <code>request.query</code> 这样的输入出发，检查它是否可能一路进入拼接 SQL 的操作。</p><p id="sast-static" className="vp-citation-target">OWASP 将 SAST 工具描述为分析源代码或编译版本、寻找安全缺陷的静态检查；它可以在开发和持续集成阶段反复运行。<Cite id="sast-static" sources={sources} /></p><p>这和普通 lint（检查语法和代码风格的工具）的重点不同：lint 可能关心变量命名或语法风格，SAST 关心的是一条由安全规则定义的数据流。两者都可能标出第 42 行，但证据和后续处理不一样。</p><Lesson /></ArticleSection>
    <ArticleSection id="sast-path" title="从 source 走到危险 sink" className={styles.splitSection}><p id="sast-dataflow" className="vp-citation-target">像 CodeQL 这样的分析器会先建立代码数据库，再运行查询并解释结果；数据流查询可以把 source（不可信数据进入程序的位置）、跨函数路径和 sink（把数据交给危险操作的位置）一起展示出来。<Cite id="sast-dataflow" sources={sources} /></p><p>本页路径是 <code>request.query → formatQuery → db.query</code>。如果中间没有参数化或净化节点，扫描器会把它标成潜在注入路径；点击“加入参数化查询”后，路径被切断，重扫结果变成 0。</p><p id="sast-fix" className="vp-citation-target">参数化查询是 SQL 注入防护中常见的修复方向，但具体代码还要根据驱动和查询方式复核；一个示例修复不能替代项目里的安全代码审查。<Cite id="sast-fix" sources={sources} /></p></ArticleSection>
    <ArticleSection id="sast-report" title="读懂告警的证据"><p>一条有用的告警至少应该说明规则、文件和行号、输入来源、危险汇点以及中间路径。没有路径的“高危”标签很难判断是不是误报，也不能指导修复。</p><p id="sast-review" className="vp-citation-target">OWASP 的代码审查资源强调，自动化工具是审查流程的一部分；开发者仍需要结合代码上下文、业务约束和真实配置确认结果。<Cite id="sast-review" sources={sources} /></p><p>修复后要重扫同一规则，再运行与改动相关的测试。告警消失说明这条静态路径不再满足规则，不等于所有安全问题都消失。</p></ArticleSection>
    <ArticleSection id="sast-boundary" title="潜在问题不是已利用"><p id="sast-process" className="vp-citation-target">NIST SSDF 把安全开发实践放进整个软件生命周期；SAST 可以成为门禁或反馈环节，但不代表它覆盖运行时权限、部署配置和所有业务逻辑。<Cite id="sast-process" sources={sources} /></p><p>动态语言、反射、生成代码、缺失框架模型都会造成漏报；规则过宽也会产生误报。把每个静态告警都当成已被攻击，或者把没有告警当成绝对安全，都是超出证据的结论。</p><p><strong>停止条件</strong>：你能从 source 追到 sink，读懂报告为什么指向某一行，并能说出修复后仍需哪种运行时或人工验证。</p></ArticleSection>
  </Article>;
}
