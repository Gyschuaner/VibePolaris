import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { codeCoverageSources } from "@/lib/code-coverage-sources";
import { CodeCoverageHero } from "./code-coverage-hero";
import { CodeCoverageLesson } from "./code-coverage";

const sections: [string, string][] = [
  ["code-coverage-definition-section", "100% 到底点亮了什么"],
  ["code-coverage-dimensions-section", "把一行条件拆成四格"],
  ["code-coverage-report-section", "报告的空白是下一道题"],
  ["code-coverage-behavior-section", "从百分比回到行为"],
];

export function CodeCoverageTermPage() {
  return <Article slug="code-coverage" title="测试覆盖率" subtitle="Code Coverage · 看测试走过哪里，再决定还要证明什么" sources={codeCoverageSources} sections={sections} hero={<CodeCoverageHero />} intro={<>测试报告上的 100% 很容易让人松一口气。可如果那一行 <code>if</code> 里藏着两个开关，一次成功输入就足以点亮整行，没走过的路仍然在黑暗里。<strong>代码覆盖率记录测试执行触达了哪些结构；行为是否正确，仍要靠断言和风险判断。</strong></>}>
    <ArticleSection id="code-coverage-definition-section" title="100% 到底点亮了什么">
      <p id="coverage-definition" className="vp-citation-target">代码覆盖率可以先看成测试运行留下的一张地图。Istanbul 会给 JavaScript 加上行计数器，测试执行到哪一行，计数器就留下记录；报告再把这些记录整理成开发者能读的覆盖结果。<Cite id="coverage-definition" sources={codeCoverageSources} /></p>
      <p id="coverage-counters" className="vp-citation-target">这张地图回答的是“测试走到过哪里”，不是“走到那里后做得对不对”。一个函数可能被调用过，里面的断言却只检查了一个无关字段；所以覆盖率是找测试空白的工具，不能替行为契约签字。<Cite id="coverage-counters" sources={codeCoverageSources} /></p>
      <p id="coverage-collection" className="vp-citation-target">Jest 的 <code>collectCoverage</code> 在测试执行时收集覆盖数据；<code>collectCoverageFrom</code> 还可以把没有被任何测试导入的文件纳入报告。后一个选项很有用，因为“文件从未进入测试”本身就是一块空白，但它仍然只是提醒，不是缺陷判决。<Cite id="coverage-collection" sources={codeCoverageSources} /></p>
      <p id="coverage-scope" className="vp-citation-target">不同工具的统计边界也不完全相同。Vitest 可以选择 V8 或 Istanbul 等覆盖提供者，并用 include、exclude 规定哪些文件进入报告；读数字之前，先确认这份报告到底统计了哪一批代码。<Cite id="coverage-scope" sources={codeCoverageSources} /></p>
    </ArticleSection>
    <ArticleSection id="code-coverage-dimensions-section" title="把一行条件拆成四格">
      <p id="coverage-dimensions" className="vp-citation-target">在首图里，<code>age &gt;= 18 &amp;&amp; verified</code> 是一行代码，却有两个条件和四种组合。JaCoCo 把指令、行、分支和复杂度分开统计：每个指标都在问不同的问题，不能把一个百分比当成所有答案。<Cite id="coverage-dimensions" sources={codeCoverageSources} /></p>
      <p id="coverage-lines" className="vp-citation-target">先跑“20 岁、已验证”，执行计数会把这一行点亮，于是行覆盖可以到 100%。这不奇怪，因为行覆盖只关心这行是否执行过；它不会记录 <code>verified=false</code> 的组合，也不会替你确认拒绝结果。JaCoCo 还提醒，某一行包含多个指令时，部分执行可能只得到部分覆盖。<Cite id="coverage-lines" sources={codeCoverageSources} /></p>
      <p id="coverage-branches" className="vp-citation-target">分支覆盖继续问：判断的两侧是否都走过？更细的条件组合或 MC/DC 追踪，则继续问每个布尔条件怎样影响整体决定；不同工具是否提供这类指标，要看它自己的收集实现。首图补到 TF 时，隐藏的“未验证成人被放行”才露出来；覆盖率把路径带到灯下，真正把它判错的仍然是 <code>expect(canEnter(20, false)).toBe(false)</code> 这样的行为断言。<Cite id="coverage-branches" sources={codeCoverageSources} /></p>
      <p id="coverage-mcdc" className="vp-citation-target">在安全性更高的场景，LLVM 的 source-based coverage 还支持 MC/DC：测试向量要能说明某个条件单独改变时，整体决定也随之改变。它比“这一行执行过”要求更多证据，但仍然不能替代对输出和副作用的检查。<Cite id="coverage-mcdc" sources={codeCoverageSources} /></p>
    </ArticleSection>
    <ArticleSection id="code-coverage-report-section" title="报告的空白是下一道题">
      <p id="coverage-provider" className="vp-citation-target">V8、Istanbul、JaCoCo 这些名字描述的是收集和计算覆盖数据的方式，不是业务质量等级。Vitest 的 V8 provider 直接利用运行时能力，Istanbul provider 则通过插桩记录；换 provider 可能改变报告细节，却不会凭空增加测试路径。<Cite id="coverage-provider" sources={codeCoverageSources} /></p>
      <p id="coverage-report" className="vp-citation-target">因此看到一块红色空白时，先问三句：是没有运行到这段代码，还是文件根本被排除在报告外？是缺一条分支，还是缺一组输入组合？这条路径对应什么用户风险？把空白翻译成问题，覆盖率才开始有用。<Cite id="coverage-report" sources={codeCoverageSources} /></p>
      <CodeCoverageLesson />
      <p id="coverage-threshold" className="vp-citation-target">Jest 的 <code>coverageThreshold</code> 可以让行、函数、分支或语句低于门槛时让检查失败，也支持用负数限制未覆盖数量。门槛适合守住底线，不能替你决定该补哪一个测试；把门槛当终点，团队很快会开始追数字而不是追风险。<Cite id="coverage-threshold" sources={codeCoverageSources} /></p>
    </ArticleSection>
    <ArticleSection id="code-coverage-behavior-section" title="从百分比回到行为">
      <p id="coverage-workflow" className="vp-citation-target">LLVM 给出的工作流很朴素：编译时插桩，运行带插桩的程序，再生成报告。它把“代码执行过”与“测试准备了什么输入”连接起来，也提醒我们覆盖率来自一次具体的运行，不是源代码静态看一眼就能推出来的结论。<Cite id="coverage-workflow" sources={codeCoverageSources} /></p>
      <p id="coverage-limitation" className="vp-citation-target">覆盖率还有明确的盲区：它通常看得到控制流，却看不到需求有没有写错、并发时序是否安全、第三方服务是否遵守协议，也看不到断言是不是空泛。Istanbul 自己把结果描述成“测试锻炼了代码多少”，不是“软件没有缺陷”；这条边界值得一直留在报告旁边。<Cite id="coverage-limitation" sources={codeCoverageSources} /></p>
      <p>所以补测试时，不要从“再让一个百分比上涨”开始。先看空白所在的业务路径，再写输入、动作和可观察结果：未验证成人应被拒绝，过期凭证不能继续，重复请求不能多写一行。覆盖率负责告诉你还没走到哪里，断言负责说明走到那里以后什么才算对。</p>
      <p><strong>读覆盖率报告可以按这个顺序：</strong>确认统计范围，分别看行、分支和条件，找出与业务风险相连的空白，为那条路径补有意义的断言，最后再用报告确认测试确实走到了它。数字回到证据链里，才不会把 100% 误读成“没有缺陷”。</p>
    </ArticleSection>
  </Article>;
}
