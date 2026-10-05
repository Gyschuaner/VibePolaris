import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { cdnSources } from "@/lib/cdn-sources";
import { CdnHero } from "./cdn-hero";
import { CdnLesson } from "./cdn";

const sections: [string, string][] = [
  ["cdn-definition-section", "CDN 是一组离用户更近的缓存"],
  ["cdn-freshness-section", "新鲜度是缓存与源站的契约"],
  ["cdn-revalidate-section", "未命中、过期和验证不是一回事"],
  ["cdn-release-section", "发布时要改变缓存键或明确清理"],
];

export function CdnTermPage() {
  return <Article slug="cdn" title="内容分发网络" subtitle="CDN · 让内容在离用户更近的缓存里等待" sources={cdnSources} sections={sections} hero={<CdnHero />} intro={<>CDN（Content Delivery Network，内容分发网络）由分布在不同位置的缓存节点组成。请求先到更近的边缘，节点再根据缓存键和新鲜度决定直接返回、回源取内容，还是重新验证。<strong>“用了 CDN”只说明多了一层缓存，不说明每次请求都会命中。</strong></>}>
    <ArticleSection id="cdn-definition-section" title="CDN 是一组离用户更近的缓存">
      <p id="cdn-definition" className="vp-citation-target">CDN 把静态或可缓存的响应复制到靠近用户的边缘节点，让请求可以从更近的位置得到结果；节点仍然需要根据 URL、请求头和缓存规则判断副本是否适用。<Cite id="cdn-definition" sources={cdnSources} /></p>
      <p id="cdn-edge" className="vp-citation-target">边缘节点不是源站的永久替身。第一次请求可能回源，动态或带用户身份的内容也可能不适合共享缓存；设计缓存时要先划清哪些响应可以被不同用户复用。<Cite id="cdn-edge" sources={cdnSources} /></p>
      <p>首图把“请求到边缘”和“内容来自哪里”分成两条轨迹：同一个 URL 可以 HIT，也可以 MISS；区别不在页面标题，而在缓存键和这一次副本是否可用。</p>
      <CdnLesson />
    </ArticleSection>

    <ArticleSection id="cdn-freshness-section" title="新鲜度是缓存与源站的契约">
      <p id="cdn-freshness" className="vp-citation-target">响应的 Cache-Control、Expires、ETag 和 Last-Modified 等信息共同影响缓存何时可以直接复用，何时需要向源站验证。缓存时间不是“越长越快”的单一开关，还要看内容更新、错误代价和用户是否能接受旧版本。<Cite id="cdn-freshness" sources={cdnSources} /></p>
      <p id="cdn-cache-control" className="vp-citation-target">public、private、no-cache 和 no-store 表达的是不同的共享与验证约束；其中 no-cache 通常意味着使用前要验证，并不等于绝对不保存。<Cite id="cdn-cache-control" sources={cdnSources} /></p>
      <p><strong>把响应头当作合同读：</strong>谁可以存？存多久？过期如何验证？用户带着什么身份？每一问都比“给 CDN 开个缓存”更接近真正的交付边界。</p>
    </ArticleSection>

    <ArticleSection id="cdn-revalidate-section" title="未命中、过期和验证不是一回事">
      <p id="cdn-revalidate" className="vp-citation-target">未命中表示当前缓存键没有可用副本；过期表示已有副本不能直接作为新鲜响应；再验证则可能只得到 304 Not Modified，不必重新传输正文。三者都会让请求走到源站，但网络和结果不同。<Cite id="cdn-revalidate" sources={cdnSources} /></p>
      <p>调试时同时记录边缘状态、Age、缓存键、源站状态和响应头。只看浏览器“加载成功”会把 HIT、MISS、304 和完整 200 混在一起，难以解释一次发布为什么快或慢。</p>
      <p>带身份、购物车、权限或实时数据的响应要格外谨慎：边缘缓存的性能收益不能覆盖把一个用户的内容交给另一个用户的风险。</p>
    </ArticleSection>

    <ArticleSection id="cdn-release-section" title="发布时要改变缓存键或明确清理">
      <p id="cdn-purge" className="vp-citation-target">purge 会按 URL、标签或整个缓存范围清除副本，但清理范围越大，回源压力和瞬时冷缓存成本越高。发布时应根据资产依赖选择粒度，而不是把全站清空当作默认按钮。<Cite id="cdn-purge" sources={cdnSources} /></p>
      <p id="cdn-version" className="vp-citation-target">给静态文件名加入内容哈希可以让新版本使用新的缓存键：旧副本仍可自然过期，新 URL 在第一次访问时回源并建立新副本。HTML、清单和入口引用仍要一起规划，否则只换一个文件名也可能让页面引用旧资产。<Cite id="cdn-versioning" sources={cdnSources} /></p>
      <p><strong>最后做一次发布回放：</strong>用旧 URL 请求一次，发布带新哈希的资产，观察新 URL 的 MISS→HIT，再检查 HTML、错误页和回滚入口。缓存是系统的一部分，发布完成要以用户拿到哪个版本为准。</p>
    </ArticleSection>
  </Article>;
}
