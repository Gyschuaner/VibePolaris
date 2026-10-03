import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { ciSources } from "@/lib/git-concept-sources/ci";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["ci-trigger", "一次提交怎样变成一轮检查"],
  ["ci-evidence", "作业的日志和状态说明了什么"],
  ["ci-gate", "绿色结论能把范围保证到哪里"],
];

export function CiTermPage() {
  return <GitArticle
    slug="ci"
    title="持续集成"
    subtitle="Continuous Integration · 让每次代码变化都在一致环境里留下可检查的证据"
    sources={ciSources}
    sections={sections}
    hero={<GitHero contextLabel="先锁定输入" contextTitle="提交 F4" trigger="刚推送一个提交，怎样知道它在同一环境里通过了哪些检查？" change="提交事件 → 并行作业 → 日志 / 状态 → 合并门禁" proof="状态只覆盖已配置的检查；失败有日志，未配置场景仍需另行验证" />}
    intro={<>持续集成（CI）把代码变化接到一条可重复的检查流程：事件触发工作流，独立作业安装同一份依赖并运行构建、测试或静态检查，结果再回到提交或拉取请求。它缩短了发现集成问题的时间，但不会替你检查没有写进工作流的场景。</>}
  >
    <ArticleSection id="ci-trigger" title="一次提交怎样变成一轮检查">
      <p id="ci-workflow" className="vp-citation-target">在 GitHub Actions 里，工作流文件放在仓库的 <code>.github/workflows</code> 目录，用 YAML 声明触发事件和作业。Node.js 的 CI 示例可以由 <code>push</code> 触发，再执行安装依赖、构建和测试；触发事件只是排队开始，提交本身还没有因此变得“通过”。<Cite id="ci-workflow" sources={ciSources} /></p>
      <p id="ci-parallel" className="vp-citation-target">一个工作流由一个或多个 job 组成。没有依赖关系的 job 可以同时运行；只有用 <code>needs</code> 声明前置关系时，后续 job 才会等待前面的成功结果。这样可以把 lint、单元测试和构建分成互不遮挡的证据来源。<Cite id="ci-parallel" sources={ciSources} /></p>
      <GitWorkflowLesson slug="ci" />
    </ArticleSection>

    <ArticleSection id="ci-evidence" title="作业的日志和状态说明了什么">
      <p id="ci-jobs" className="vp-citation-target">每个 job 都在自己的 runner 或容器中执行步骤；同一个检查要先取得代码、准备运行时，再运行项目实际使用的命令。Node.js 指南用 <code>npm ci</code>、<code>npm run build</code> 和 <code>npm test</code> 说明了“本地怎么检查，CI 就执行同一套命令”的关系。<Cite id="ci-jobs" sources={ciSources} /><Cite id="ci-build" sources={ciSources} /></p>
      <p id="ci-logs" className="vp-citation-target">检查失败时，先读对应 job 的日志和退出位置：日志告诉你在哪一步失败、使用了哪些输入，状态告诉你这一项是否成功。日志是调查证据，不是“红了所以一定是代码”的结论；依赖安装、环境变量和服务也可能是失败原因。<Cite id="ci-logs" sources={ciSources} /></p>
      <p>如果把浏览器测试从工作流里删掉，lint、单元测试和构建仍可能全绿；这只说明剩下的三项通过，不能把缺失的交互覆盖当成通过。检查列表本身也应随需求变化维护。</p>
    </ArticleSection>

    <ArticleSection id="ci-gate" title="绿色结论能把范围保证到哪里">
      <p id="ci-status" className="vp-citation-target">状态检查用于告诉评审者某个提交是否满足仓库设定的条件。若受保护分支把某项检查设为 required，检查没有对最新提交成功时，拉取请求不能合并；失败、超时或需要处理的状态都要回到日志和修复步骤。<Cite id="ci-status" sources={ciSources} /></p>
      <p>因此，“CI 通过”应读成一句有边界的话：当前工作流列出的作业在这次提交上完成了约定命令。它不包含未配置的浏览器、真实设备、人工评审、生产数据或部署结果；这些证据需要由对应流程补上。</p>
      <p><strong>读者判断：</strong>看到绿色状态时，先问“哪些 job 实际运行了、它们针对哪个提交、有没有被跳过”，再决定它能否支持合并或下一步验证。</p>
    </ArticleSection>
  </GitArticle>;
}
