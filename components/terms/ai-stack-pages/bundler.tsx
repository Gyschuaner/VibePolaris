import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { BundlerHero, BundlerLesson } from "../ai-stack-lessons/bundler";
import { bundlerSources } from "@/lib/ai-stack-concept-sources/bundler";

export function BundlerTermPage() {
  const sections: [string, string][] = [["bundle-start", "写了四个模块，浏览器要拿几个文件？"], ["bundle-entry", "从入口找齐这次需要的代码"], ["bundle-split", "图表晚点打开，代码也能晚点到"], ["bundle-assets", "样式和没用到的代码怎么处理"], ["bundle-delivery", "能打出来，还得能加载、能运行"]];
  return <Article slug="bundler" title="打包器" subtitle="Bundler · 把分散的模块整理成可加载的产物" sources={bundlerSources} sections={sections} hero={<BundlerHero />} intro={<>你把导航、工具函数和统计图表分开写，改某个功能时更容易找到代码。发布时，浏览器拿到的文件又可能变成一个主包、一个图表包和一份样式。打包器负责整理这些源码关系，并按配置生成输出。</>}>
    <ArticleSection id="bundle-start" title="写了四个模块，浏览器要拿几个文件？">
      <p>“模块”是一段有自己用途、可以导入其他代码的程序。例如导航模块提供页面导航，图表模块负责绘图。源码分开维护很方便，部署时怎样组织它们，则需要另一套安排。</p>
      <p id="bundler-definition-text" className="vp-citation-target"><strong>打包器（bundler）从入口分析模块依赖，把需要的代码组织成一个或多个输出文件。</strong>webpack 将这个核心工作描述为建立依赖图并生成 bundles。源码文件数和输出文件数没有固定的一对一关系。<Cite id="bundler-definition-text" sources={bundlerSources} /></p>
      <p>下面四块分别是入口 app.js、导航 Nav.js、工具函数 utils.js 和图表 chart.js。点击“打包本例并打开页面”，看同一批模块怎样聚合进输出；再取消图表拆包重新构建，图表那块会并入主包。</p>
      <BundlerLesson />
    </ArticleSection>
    <ArticleSection id="bundle-entry" title="从入口找齐这次需要的代码">
      <p id="bundler-entry" className="vp-citation-target">“入口”是这次整理的起点。本例从 app.js 开始，它导入导航，导航又导入工具函数。打包器需要沿着这些直接和间接关系找到依赖；只收入口本身，导航调用到的函数就可能缺失。实际项目也可以配置多个入口。<Cite id="bundler-entry" sources={bundlerSources} /></p>
      <p><code>import</code> 表示从另一个模块引入功能。图中 app.js 需要 Nav.js，Nav.js 与 chart.js 都会用 utils.js。这个共用模块在本例只放在主包里，图表包没有重复装一份；真实工具也可能把共用代码单独拆成一个文件。</p>
      <p id="bundler-deduplicate" className="vp-citation-target">webpack 的代码分割指南分别介绍入口配置、避免重复依赖和动态导入。分包方案要结合依赖关系决定：两个文件都用同一段代码时，简单分成两包可能仍然重复；共用代码放在哪里还受工具和配置影响。<Cite id="bundler-deduplicate" sources={bundlerSources} /></p>
    </ArticleSection>
    <ArticleSection id="bundle-split" title="图表晚点打开，代码也能晚点到">
      <p>打开统计页面时，用户先看到导航，未必马上展开图表。如果先把绘图代码全载入，暂时用不到的部分也会参与首屏加载。演示里的图表块比较大，正好用来观察这个取舍。</p>
      <p id="bundler-split-text" className="vp-citation-target"><code>import("./chart.js")</code> 是动态导入：调用发生在运行时，加载结果异步返回。打包器可以据此形成独立的代码块，让应用在需要时再加载。代码分割也能通过入口等方式安排，并非只有动态导入这一种做法。<Cite id="bundler-split-text" sources={bundlerSources} /></p>
      <p>本例开启拆包时，主包 4 KB 加样式 1 KB 先到，12 KB 的图表包等点击才到。取消拆包之后，图表并入 16 KB 主包；打开图表只需显示已经到达的代码。数字是教学设定，比较的是这一次如何安排代码，不代表真实项目压缩后的网络大小。</p>
      <p>分包不会把绘图代码凭空变少。全部功能都打开后，本例仍共用这些模块；它改变的是哪些先加载、哪些后加载。真实应用还可能预取后续文件，实际请求时机要在浏览器里观察。</p>
    </ArticleSection>
    <ArticleSection id="bundle-assets" title="样式和没用到的代码怎么处理">
      <p id="bundler-css" className="vp-citation-target">打包器常与其他构建能力一起处理样式、图片等资源，输出也可以保留独立文件。例如 Vite 能把异步模块用到的 CSS 提取成独立样式文件，在相关块加载时一并加载；配置也可以改变这种安排。演示将 theme.css 单独输出，提醒你检查整组产物。<Cite id="bundler-css" sources={bundlerSources} /></p>
      <ArticleAside title="依赖了一个大库，会把所有函数都装进去吗？"><p id="bundler-tree-shaking" className="vp-citation-target">Rollup 会静态分析导入和使用关系，移除能够判定没有用到的代码，这叫 tree shaking。分析条件、模块写法与副作用会影响结果；它也不同于压缩空格、缩短变量名。不能只看源码目录大小，就猜最终下载量。<Cite id="bundler-tree-shaking" sources={bundlerSources} /></p></ArticleAside>
      <p>打包、转译、压缩、资源处理可以由同一套构建工具协调。看到一个 <code>build</code> 命令，并不能直接知道每一步用了什么；查看构建配置和输出清单，比从“一个文件变成几个文件”猜工具行为可靠。</p>
    </ArticleSection>
    <ArticleSection id="bundle-delivery" title="能打出来，还得能加载、能运行">
      <p>开启拆包并重新构建，在第一次打开图表前勾选“模拟图表包 404”。主页面按钮可以继续加一，图表却加载失败：模块已经放进输出包，但这次请求没有拿到文件。关闭故障再重试，图表才出现。本例为图表失败提供了独立反馈，主页面因此保持可用；实际应用也需要这样的错误处理。</p>
      <p id="bundler-runtime" className="vp-citation-target">webpack 的 <code>ChunkLoadError</code> 说明建议核对块文件是否能访问、<code>publicPath</code> 是否正确，以及浏览器的网络与脚本错误。遇到“首屏正常、点击后失败”，先查这次请求的地址、响应和部署产物，才能分清文件未部署、路径错误与代码执行错误。<Cite id="bundler-runtime" sources={bundlerSources} /></p>
      <p id="bundler-typecheck" className="vp-citation-target">输出生成也不证明类型检查已经做过。例如 Vite 对 TypeScript 进行转译，但不在这一步做类型检查，建议另行运行检查。测试业务行为和确认接口可用，则又是各自的检查。<Cite id="bundler-typecheck" sources={bundlerSources} /></p>
      <p>给 AI 的要求可以写成：“列出入口和关键导入关系，指出导航与图表共享的模块；把图表按需拆包，列明 JS、CSS 等输出。验证首次加载、打开图表、块文件加载失败三种情况，并保留可用的主页面和明确的重试入口。”这样能检查代码怎样到达用户，而不只听到“已打包”。</p>
    </ArticleSection>
  </Article>;
}
