import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { routingSources } from "@/lib/routing-sources";
import { RoutingHero } from "./routing-hero";

const sections: [string, string][] = [
  ["routing-definition-section", "先把地址拆成可匹配的输入"],
  ["routing-branch-section", "匹配成功后还要走访问分支"],
  ["routing-history-section", "客户端导航改变地址但不必整页刷新"],
];

export function RoutingTermPage() {
  return <Article slug="routing" title="路由" subtitle="Routing · 地址怎样找到页面" sources={routingSources} sections={sections} hero={<RoutingHero />} intro={<>路由器把 URL 交给规则表，决定要打开哪个页面或处理器。<strong>路径参数、查询参数、鉴权和 404 都是路由路径上的不同分支</strong>；导航菜单只是其中一种触发方式。</>}>
    <ArticleSection id="routing-definition-section" title="先把地址拆成可匹配的输入">
      <p id="route-url" className="vp-citation-target">URL 由协议、主机、路径和查询等部分组成；路由通常重点处理路径段和查询参数。<Cite id="route-url" sources={routingSources} />例如 <code>/products/42?tab=stock</code> 里，42 是动态路径参数，stock 是查询值。</p>
      <p id="route-match" className="vp-citation-target">路由规则把这些输入匹配到页面、布局或处理器。<Cite id="route-match" sources={routingSources} />匹配结果应该留下可读的参数，而不是让页面再从一串字符串里猜一次。</p>
    </ArticleSection>
    <ArticleSection id="routing-branch-section" title="匹配成功后还要走访问分支">
      <p id="route-auth" className="vp-citation-target">路由命中只说明“有一条规则”，不说明当前用户拥有权限。鉴权需要单独判断；未登录时可以保存原地址，登录后再返回。<Cite id="route-auth" sources={routingSources} /></p>
      <p id="route-404" className="vp-citation-target">未知路径要走明确的 404 或回退页面，告诉用户发生了什么并给出下一步。<Cite id="route-404" sources={routingSources} />把“没有匹配”吞掉，会让分享出去的错误链接变成无声失败。</p>
    </ArticleSection>
    <ArticleSection id="routing-history-section" title="客户端导航改变地址但不必整页刷新">
      <p id="route-history" className="vp-citation-target">客户端路由可以通过 History API 更新地址和历史记录，再由应用替换局部界面。<Cite id="route-history" sources={routingSources} />这减少了整页刷新，但并没有取消数据加载、权限检查或错误处理。</p>
      <p>上面的车厢演示把路径匹配、授权和 404 分成三条轨道。链接、浏览器后退、深链接和程序跳转都可以触发路由；每次到达新地址仍要重新匹配并取数。</p>
    </ArticleSection>
  </Article>;
}
