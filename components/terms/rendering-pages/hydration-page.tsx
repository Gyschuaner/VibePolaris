import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { hydrationSources } from "@/lib/hydration-sources";
import { HydrationHero } from "./hydration-hero";
import { HydrationLesson } from "./hydration";

const sections: [string, string][] = [
  ["hydration-definition-section", "先有 HTML，不代表已经能点"],
  ["hydration-match-section", "水合先匹配已有节点"],
  ["hydration-mismatch-section", "首轮不一致会把接管变成警报"],
];

export function HydrationTermPage() {
  return <Article slug="hydration" title="水合" subtitle="Hydration · 把已有 HTML 接成可交互页面" sources={hydrationSources} sections={sections} hero={<HydrationHero />} intro={<>服务器可以先把页面画出来，但<strong>按钮什么时候真正接上事件，取决于客户端水合是否完成</strong>。把“看得见”“匹配上”和“能交互”分开，才能读懂首屏的等待。</>}>
    <ArticleSection id="hydration-definition-section" title="先有 HTML，不代表已经能点">
      <p id="hydration-server" className="vp-citation-target">服务端先输出 HTML，浏览器可以马上把标题、列表或按钮画出来。<Cite id="hydration-server" sources={hydrationSources} />这一步只说明内容已经到达，不说明客户端组件的状态和事件已经恢复。</p>
      <p id="hydration-events" className="vp-citation-target">客户端脚本到达后，框架会在现有 DOM 上恢复组件关系并注册事件。<Cite id="hydration-events" sources={hydrationSources} />所以一个按钮可能已经可见，却要再等一段时间才会响应点击。</p>
      <HydrationLesson />
    </ArticleSection>
    <ArticleSection id="hydration-match-section" title="水合先匹配已有节点">
      <p id="hydration-match" className="vp-citation-target">水合的核心是把客户端组件和服务器已经输出的节点对应起来，尽量复用现有 DOM，而不是把页面当成空白画布从头创建。<Cite id="hydration-match" sources={hydrationSources} />演示里“结构一致”只是匹配通过，接下来仍要完成事件连接。</p>
      <p id="hydration-stream" className="vp-citation-target">如果服务器使用流式输出，HTML 可以分段抵达；客户端仍要等待对应代码和边界准备好，才能把那一段接入交互。<Cite id="hydration-stream" sources={hydrationSources} />可见时间和可交互时间因此可能分开。</p>
    </ArticleSection>
    <ArticleSection id="hydration-mismatch-section" title="首轮不一致会把接管变成警报">
      <p id="hydration-mismatch" className="vp-citation-target">服务器和客户端第一次渲染如果使用了不同的时间、随机数或环境条件，框架会发现 hydration mismatch。<Cite id="hydration-mismatch" sources={hydrationSources} />不要用“加载后再改一下”掩盖它；先让首轮输入可重复，再把真正依赖浏览器的内容放到接管之后。</p>
      <p>水合解决的是“已有页面如何交给客户端继续做事”，不是一种单独的渲染方式。它可以接在 SSR 或静态 HTML 后面，也可以因为首轮不一致而失败；排查时先问页面何时可见，再问代码何时接管。</p>
    </ArticleSection>
  </Article>;
}
