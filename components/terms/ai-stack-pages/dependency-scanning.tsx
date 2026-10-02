import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { dependencyScanningSources } from "@/lib/ai-stack-concept-sources/dependency-scanning";
import styles from "../ConceptArticle.module.css";
import { DependencyScanningLesson } from "../ai-stack-lessons/dependency-scanning";

const dependencySections: [string, string][] = [["dependency-need", "业务代码没改，也会出现新告警"], ["dependency-parse", "锁文件告诉你实际用了谁"], ["dependency-fix", "按版本范围修复并重扫"], ["dependency-boundary", "已知漏洞不是全部风险"]];
export function DependencyScanningTermPage() {
  const sources = dependencyScanningSources;
  const Lesson = DependencyScanningLesson;
  return <Article slug="dependency-scanning" title="依赖扫描" subtitle="Dependency Scanning · 从实际版本匹配已知风险" sources={sources} sections={dependencySections} hero={<Hero trigger="业务代码没改，为什么旧依赖今天突然告警？" change="依赖图 + 确切版本 + 公告范围" proof="传递路径被定位，升级后重扫从 1 项变 0 项" />} intro={<>依赖扫描读取 manifest 和 lockfile，解析直接与传递依赖的确切版本，再与漏洞公告或策略库匹配。它回答“项目实际带进了哪个已知风险”，不是只看一个包名，也不是代替自写代码分析。</>}>
    <ArticleSection id="dependency-need" title="业务代码没改，也会出现新告警"><p>你的业务代码一周没动，但依赖包的新漏洞公告今天发布了。扫描器重新把项目依赖图与公告库匹配，就可能发现之前不知道的风险。依赖是别人维护、会被你的程序一起安装的代码包；直接依赖是项目明确声明的包，传递依赖则是它再带进来的包。</p><p id="dependency-inventory" className="vp-citation-target">OWASP 把依赖清单、锁定版本、软件物料清单和持续监控视为软件供应链的一部分；依赖不是安装完就结束的静态背景。<Cite id="dependency-inventory" sources={sources} /></p><p>本页用一条传递依赖路径贯穿解释：应用直接依赖 A，A 又带入 B@2.1.0，公告说明 B&lt;2.3.0 受影响。读者要看到的是路径和版本，而不是一个孤立红点。</p><Lesson /></ArticleSection>
    <ArticleSection id="dependency-parse" title="锁文件告诉你实际用了谁" className={styles.splitSection}><p id="dependency-graph" className="vp-citation-target">依赖图通常由 manifest 和 lockfile 构建。manifest 是项目声明的依赖范围，lockfile 则记录这次安装实际解析的版本、路径和有时的完整性信息；它们能展示直接依赖、传递依赖以及引入路径。<Cite id="dependency-graph" sources={sources} /></p><p id="dependency-advisory" className="vp-citation-target">OSV 的漏洞模式允许按版本或提交哈希表达受影响范围，扫描器因此可以把 B@2.1.0 与“低于 2.3.0”这样的公告条件比较。<Cite id="dependency-advisory" sources={sources} /></p><p>如果删掉 lockfile，扫描器可能失去最精确的解析证据；如果只按包名报警，又会把不受影响的版本和受影响版本混在一起。</p></ArticleSection>
    <ArticleSection id="dependency-fix" title="按版本范围修复并重扫"><p id="dependency-alert" className="vp-citation-target">Dependabot 告警通常包含受影响文件、严重性和可用修复版本；新公告或依赖图变化都可能触发重新评估。这里的“公告”是维护者或安全数据库发布的受影响条件记录，不是扫描器自己证明了漏洞一定可利用。<Cite id="dependency-alert" sources={sources} /></p><p id="dependency-upgrade" className="vp-citation-target">安全更新会尝试把解析版本提升到包含修复的版本，但升级仍需通过项目自己的兼容性测试。<Cite id="dependency-upgrade" sources={sources} /></p><p>演示把 B 升到 2.3.2：范围匹配消失，红点变为已修复，同时保留“需要回归测试”的结果。修复扫描告警和验证应用行为是两个连续步骤。</p></ArticleSection>
    <ArticleSection id="dependency-boundary" title="已知漏洞不是全部风险"><p>依赖扫描依赖公告库和识别证据，未公开漏洞、恶意的新包、错误的依赖识别和运行时配置问题可能不在结果里。告警也不自动证明当前代码一定可被利用。</p><p>它和 <ConceptTerm slug="sast">SAST</ConceptTerm>、密钥扫描、镜像扫描各自覆盖不同对象。把一张工具报告叫成“整个供应链安全”，会掩盖没有被扫描的边界。</p><p><strong>停止条件</strong>：你能说出实际解析版本、传递路径、公告影响范围和修复版本，并能说明重扫之后还要做什么回归。</p></ArticleSection>
  </Article>;
}
