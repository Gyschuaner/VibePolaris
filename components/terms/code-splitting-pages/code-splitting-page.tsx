import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { codeSplittingSources } from "@/lib/code-splitting-sources";
import { CodeSplittingSignatureHero as CodeSplittingHero } from "../RenderingLayoutSignatureHeroes";

const sections: [string, string][] = [
  ["code-splitting-definition-section", "先画功能边界，再谈包大小"],
  ["code-splitting-request-section", "用户走到那里，chunk 才出发"],
  ["code-splitting-granularity-section", "拆得太碎也会制造等待"],
  ["code-splitting-boundary-section", "代码分割解决的是时机"],
];

export function CodeSplittingTermPage() {
  return <Article slug="code-splitting" title="代码分割" subtitle="Code Splitting · 把下载时机推到真正的功能边界" sources={codeSplittingSources} sections={sections} hero={<CodeSplittingHero />} intro={<>首页和编辑器住在同一个仓库里，却不代表用户第一次打开首页就该把两者一起背走。<strong>代码分割把代码按入口或功能切成 chunk，让浏览器在用户真的走到边界时才下载和执行那部分。</strong>它改变的是到达时机，仍然要对加载、失败、缓存和过度拆分负责。</>}>
    <ArticleSection id="code-splitting-definition-section" title="先画功能边界，再谈包大小">
      <p id="split-boundary" className="vp-citation-target">代码分割是构建器把一个大入口拆成多个 chunk 的过程。边界可以来自路由、动态 import 或异步功能；关键不是把文件平均切开，而是把“用户何时需要它”写进依赖图。<Cite id="split-boundary" sources={codeSplittingSources} /></p>
      <p id="split-dynamic-import" className="vp-citation-target">动态 <code>import()</code> 返回 Promise，构建器可以据此留下异步边界。用户触发边界后，运行时请求对应模块，加载完成才有机会执行并渲染功能。<Cite id="split-dynamic-import" sources={codeSplittingSources} /></p>
      <p id="split-next" className="vp-citation-target">框架的 lazy loading API 往往把动态导入、loading UI 和客户端/服务端边界放在一起处理。它帮你描述加载时机，却不会自动知道编辑器是否值得延后；边界仍要从真实用户路径推出来。<Cite id="split-next" sources={codeSplittingSources} /></p>
    </ArticleSection>

    <ArticleSection id="code-splitting-request-section" title="用户走到那里，chunk 才出发">
      <p id="split-import" className="vp-citation-target">静态 import 通常在入口建立时就进入依赖图；动态 import 则把请求推迟到表达式执行之后。这个区别让“首页先可用、编辑器后到达”成为可观测的网络顺序。<Cite id="split-import" sources={codeSplittingSources} /></p>
      <p id="split-payload" className="vp-citation-target">延后下载能减少当前页面的 JavaScript payload，但不会让代码凭空消失。浏览器仍要请求、解析和执行用户最终打开的 chunk，所以 loading、错误重试和超时反馈都属于功能本身。<Cite id="split-payload" sources={codeSplittingSources} /></p>
      <p id="split-loading-ui" className="vp-citation-target">加载状态应该占住真实的功能位置：编辑器还没到时显示局部占位或明确的等待，而不是让按钮失去反应。加载完成后，焦点、错误和可重试路径要回到同一个入口。<Cite id="split-loading-ui" sources={codeSplittingSources} /></p>
    </ArticleSection>

    <ArticleSection id="code-splitting-granularity-section" title="拆得太碎也会制造等待">
      <p id="split-granularity" className="vp-citation-target">分割粒度要和用户路径、缓存复用和请求成本一起看。一个几乎总是一起使用的编辑器被切成二十个小包，首包也许更轻，但点击后要等待更多调度和往返。<Cite id="split-granularity" sources={codeSplittingSources} /></p>
      <p id="split-parse-execute" className="vp-citation-target">JavaScript 的成本不止网络传输，还包括解析、编译和执行。把功能推迟到用户需要时能降低初始主线程压力，但如果把最常用的路径拆到太远，用户会在第一次交互时支付这笔账。<Cite id="split-parse-execute" sources={codeSplittingSources} /></p>
      <p><strong>可以这样找粒度：</strong>画出用户从首页到功能的最短路径，标出哪些模块总是一起到达，哪些模块只在少数入口出现；再对照首包、点击等待和缓存命中。不要为了让数字好看，把一次功能拆成一串彼此不能独立工作的碎片。</p>
    </ArticleSection>

    <ArticleSection id="code-splitting-boundary-section" title="代码分割解决的是时机">
      <p id="split-route" className="vp-citation-target">按路由分割适合边界清楚、页面之间复用少的功能；按组件或交互分割适合重量大、使用频率低的局部能力。边界应随产品路径变化，而不是永远绑定某个文件夹名字。<Cite id="split-route" sources={codeSplittingSources} /></p>
      <p id="split-promise" className="vp-citation-target">动态导入的 Promise 可能成功，也可能因为网络、版本或缓存问题失败。把错误边界、重新尝试和旧 chunk 清理纳入设计，才能让代码分割成为可靠的加载策略。<Cite id="split-promise" sources={codeSplittingSources} /></p>
      <p><strong>验收一处分割边界：</strong>第一次打开入口时确认没有提前请求；走到功能后确认出现明确的 loading、成功和失败状态；再次打开确认缓存路径；最后把边界合并回去做一次对照，看看首屏和交互等待到底改变了什么。</p>
    </ArticleSection>
  </Article>;
}
