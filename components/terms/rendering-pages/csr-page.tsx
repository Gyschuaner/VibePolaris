import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { csrSources } from "@/lib/csr-sources";
import { CsrSignatureHero as CsrHero } from "../RenderingLayoutSignatureHeroes";

const sections: [string, string][] = [
  ["csr-definition-section", "先收到的是壳，不是内容"],
  ["csr-chain-section", "浏览器要走完下载、执行和取数"],
  ["csr-boundary-section", "服务器仍在链条里"],
];

export function CsrTermPage() {
  return <Article slug="csr" title="客户端渲染" subtitle="Client-side rendering · 页面主要在浏览器里长出来" sources={csrSources} sections={sections} hero={<CsrHero />} intro={<>CSR 把主要的首屏生成交给浏览器。<strong>服务器先交付壳和脚本，浏览器再下载、执行、取数并写入 DOM</strong>；空白持续多久，取决于这条链每一段的速度。</>}>
    <ArticleSection id="csr-definition-section" title="先收到的是壳，不是内容">
      <p id="csr-shell" className="vp-citation-target">客户端渲染常从一份很薄的 HTML 开始：里面有应用挂载点和脚本地址，真正的界面由 JavaScript 在浏览器中创建。<Cite id="csr-shell" sources={csrSources} />因此“HTML 已返回”不等于主要内容已经可见。</p>
      <p id="csr-runtime" className="vp-citation-target">脚本下载后还要解析、执行并建立应用运行时。<Cite id="csr-runtime" sources={csrSources} />设备性能和脚本体积会改变这段等待，页面壳可能已经出现，按钮却还没有内容或事件。</p>
    </ArticleSection>
    <ArticleSection id="csr-chain-section" title="浏览器要走完下载、执行和取数">
      <p id="csr-data" className="vp-citation-target">如果内容依赖接口，应用代码还要发请求，等数据回来后才能生成列表或详情。<Cite id="csr-data" sources={csrSources} />把“脚本执行”和“数据返回”合成一个模糊的加载状态，会让真正的瓶颈消失。</p>
      <p id="csr-interactive" className="vp-citation-target">createRoot 负责把 React 树挂到浏览器容器；内容出现后，事件和后续客户端导航也在这条运行时里继续工作。<Cite id="csr-interactive" sources={csrSources} />可见、可交互和数据就绪最好分别测量。</p>
    </ArticleSection>
    <ArticleSection id="csr-boundary-section" title="服务器仍在链条里">
      <p>CSR 不意味着“没有服务器”。服务器仍要提供 HTML 壳、JavaScript 静态资源和 API；它只是没有在初始请求里把主要页面内容先生成出来。对于首屏内容、搜索可见性和弱网体验，要把这段浏览器等待当成产品决策。</p>
      <p>当用户已经进入应用后，客户端路由可以复用运行时，后续页面不必每次整页刷新。这个优势和首屏的等待同时存在，不能只用“SPA”三个字替代请求链分析。</p>
    </ArticleSection>
  </Article>;
}
