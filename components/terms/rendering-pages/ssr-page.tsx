import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ssrSources } from "@/lib/ssr-sources";
import { SsrHero } from "./ssr-hero";
import { SsrLesson } from "./ssr";

const sections: [string, string][] = [
  ["ssr-definition-section", "请求到了服务器，页面才开始生成"],
  ["ssr-stream-section", "慢数据决定完整 HTML 何时到达"],
  ["ssr-boundary-section", "先可见和可交互是两件事"],
];

export function SsrTermPage() {
  return <Article slug="ssr" title="服务端渲染" subtitle="Server-side rendering · 服务器先生成页面" sources={ssrSources} sections={sections} hero={<SsrHero />} intro={<>SSR 把页面生成放回每次请求的服务器上下文里。<strong>服务器先取数据并产出 HTML，浏览器先呈现内容，再由客户端代码完成水合</strong>；慢数据和脚本仍然会留下各自的等待。</>}>
    <ArticleSection id="ssr-definition-section" title="请求到了服务器，页面才开始生成">
      <p id="ssr-request" className="vp-citation-target">服务端渲染的页面通常在收到请求后，根据路径、会话和其他上下文读取数据，再生成 HTML。<Cite id="ssr-request" sources={ssrSources} />同一个 URL 对不同用户可能得到不同的首屏内容。</p>
      <p id="ssr-data" className="vp-citation-target">数据依赖是 SSR 的一部分：如果页面必须等账户或订单信息，服务器就要把这段等待算进响应路径。<Cite id="ssr-data" sources={ssrSources} />SSR 不会自动把数据库延迟变短，只是把生成动作放到了请求端。</p>
      <SsrLesson />
    </ArticleSection>
    <ArticleSection id="ssr-stream-section" title="慢数据决定完整 HTML 何时到达">
      <p id="ssr-stream" className="vp-citation-target">流式渲染允许服务器先发送已经准备好的外壳，再在数据到达后补充慢边界。<Cite id="ssr-stream" sources={ssrSources} />这会改变“用户先看到什么”，但不会让慢内容变成即时内容。</p>
      <p>演示里切换“打开流式边界”，你会看到外壳先进入浏览器；如果关闭它，整段 HTML 就会等所有依赖准备好后才一起出现。</p>
    </ArticleSection>
    <ArticleSection id="ssr-boundary-section" title="先可见和可交互是两件事">
      <p id="ssr-hydrate" className="vp-citation-target">浏览器先能显示服务器给的 HTML，并不代表按钮已经绑定事件。<Cite id="ssr-hydrate" sources={ssrSources} />客户端脚本仍要加载并完成水合，页面才进入完整交互状态。</p>
      <p>SSR 的取舍因此要同时看首字节、内容可见、脚本下载和交互接管。它可以改善首屏内容的到达，也可能增加服务器负担；没有上下文就说“SSR 更快”是不完整的判断。</p>
    </ArticleSection>
  </Article>;
}
