import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ssgSources } from "@/lib/ssg-sources";
import { SsgHero } from "./ssg-hero";
import { SsgLesson } from "./ssg";

const sections: [string, string][] = [
  ["ssg-definition-section", "生成发生在访问之前"],
  ["ssg-publish-section", "改源文件不等于改线上文件"],
  ["ssg-boundary-section", "静态的边界是新鲜度和数据范围"],
];

export function SsgTermPage() {
  return <Article slug="ssg" title="静态生成" subtitle="Static site generation · 构建时先把页面做好" sources={ssgSources} sections={sections} hero={<SsgHero />} intro={<>SSG 把页面生成提前到构建阶段。<strong>访问请求只需拿已经生成的 HTML 和资源</strong>；内容什么时候更新，取决于下一次构建、再生成和发布，而不是这一次刷新。</>}>
    <ArticleSection id="ssg-definition-section" title="生成发生在访问之前">
      <p id="ssg-build" className="vp-citation-target">静态生成会在构建阶段读取内容和路径，产出可以直接部署的 HTML。<Cite id="ssg-build" sources={ssgSources} />用户访问时不需要服务器为每个请求重新执行同一遍页面生成。</p>
      <p id="ssg-static" className="vp-citation-target">部署后的服务器或 CDN 直接返回既有文件，缓存和分发因此更容易复用。<Cite id="ssg-static" sources={ssgSources} />这也是文档、营销页和内容更新节奏稳定的页面常用它的原因。</p>
      <SsgLesson />
    </ArticleSection>
    <ArticleSection id="ssg-publish-section" title="改源文件不等于改线上文件">
      <p id="ssg-update" className="vp-citation-target">源文件变成 v2 后，旧的静态产物仍然可能是 v1；需要重新构建或使用增量再生成，新的文件才会被替换。<Cite id="ssg-update" sources={ssgSources} />演示把“构建”和“发布”拆成两个按钮，就是为了让这个时间差可见。</p>
      <p>如果只在本地改了 Markdown，却没有把新产物部署到 CDN，访问者当然还会看到旧页。缓存命中也不会替你重新读取源文件。</p>
    </ArticleSection>
    <ArticleSection id="ssg-boundary-section" title="静态的边界是新鲜度和数据范围">
      <p id="ssg-boundary" className="vp-citation-target">SSG 适合构建时就知道、且不需要每个用户单独计算的数据。<Cite id="ssg-boundary" sources={ssgSources} />依赖当前账户、实时库存或每秒变化的内容，就要考虑 SSR、客户端取数或再生成策略。</p>
      <p>“静态”描述的是生成时机，不是页面永远没有 JavaScript。静态 HTML 仍可以在浏览器加载脚本后变成可交互页面；需要把静态首屏和客户端行为分开讨论。</p>
    </ArticleSection>
  </Article>;
}
