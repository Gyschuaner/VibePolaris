import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { lazyLoadingSources } from "@/lib/lazy-loading-sources";
import { LazyLoadingSignatureHero as LazyLoadingHero } from "../RenderingLayoutSignatureHeroes";

const sections: [string, string][] = [
  ["lazy-loading-definition-section", "先保住位置，再推迟资源"],
  ["lazy-loading-trigger-section", "可见性是门，资源状态是路"],
  ["lazy-loading-stability-section", "等待不能把页面撑跳"],
  ["lazy-loading-boundary-section", "什么时候不该懒加载"],
];

export function LazyLoadingTermPage() {
  return <Article slug="lazy-loading" title="懒加载" subtitle="Lazy Loading · 让资源等到值得出现的时候" sources={lazyLoadingSources} sections={sections} hero={<LazyLoadingHero />} intro={<>一张图片、一个视频或一块重型组件，可能在用户滑到之前很久都用不上。<strong>懒加载把请求推迟到资源接近使用时机，同时保留它应该占据的位置。</strong>它解决的是“何时取”，也要一起照顾占位、解码、失败、重试和可访问的替代内容。</>}>
    <ArticleSection id="lazy-loading-definition-section" title="先保住位置，再推迟资源">
      <p id="lazy-strategy" className="vp-citation-target">懒加载是一种延迟获取资源的策略：初始页面先加载必要内容，低优先级或暂时不可见的资源等到接近使用时再取。它可以作用于图片、视频、脚本、组件或路由，但每一种资源的触发和失败成本都不同。<Cite id="lazy-strategy" sources={lazyLoadingSources} /></p>
      <p id="lazy-resource" className="vp-citation-target">懒加载不是把 <code>loading</code> 文字塞进页面就结束。资源需要一个稳定的盒子、明确的 loading、成功替换和失败回退；否则延迟会变成空白、布局跳动或用户不知道该等什么。<Cite id="lazy-resource" sources={lazyLoadingSources} /></p>
      <p id="lazy-component" className="vp-citation-target">组件级懒加载通常借助动态导入和 loading UI 把重型功能推迟，但页面仍要定义客户端/服务端边界、错误状态和可重试入口。延迟的是功能代码，不能延迟用户对当前任务的反馈。<Cite id="lazy-component" sources={lazyLoadingSources} /></p>
    </ArticleSection>

    <ArticleSection id="lazy-loading-trigger-section" title="可见性是门，资源状态是路">
      <p id="lazy-intersection" className="vp-citation-target">Intersection Observer 可以观察目标和根区域的相交变化，把“快要出现”变成一个异步信号。它比每次 scroll 都手动计算位置更适合做可见性触发，但它只告诉你条件变化，不会替你处理下载和解码。<Cite id="lazy-intersection" sources={lazyLoadingSources} /></p>
      <p id="lazy-root-margin" className="vp-citation-target"><code>rootMargin</code> 可以让触发点提前或延后：网络慢时提前一些，资源才有机会在用户看到之前准备好。这个距离是体验策略，要用真实网络和资源大小校准，不能把一个数字当成所有页面的答案。<Cite id="lazy-root-margin" sources={lazyLoadingSources} /></p>
      <p id="lazy-image" className="vp-citation-target">浏览器原生的 <code>loading="lazy"</code> 让图片和 iframe 可以把加载交给用户代理判断；它适合低优先级的非首屏内容。首屏主视觉如果被懒加载，反而可能延迟用户最先要看的东西。<Cite id="lazy-image" sources={lazyLoadingSources} /></p>
    </ArticleSection>

    <ArticleSection id="lazy-loading-stability-section" title="等待不能把页面撑跳">
      <p id="lazy-loading-attribute" className="vp-citation-target">HTML 的 lazy-loading 属性描述的是获取时机，不是尺寸。图片仍应提供可推导的宽高或比例，让浏览器在资源到达前就能安排布局，避免内容加载后把下面的文字推走。<Cite id="lazy-loading-attribute" sources={lazyLoadingSources} /></p>
      <p id="lazy-fetch" className="vp-citation-target">用户代理可能根据连接、数据节省偏好和资源距离调整真正的抓取时间；因此代码不能把“设置了 lazy”理解成精确的请求时刻。重要内容要留出不依赖偶然时序的可见反馈。<Cite id="lazy-fetch" sources={lazyLoadingSources} /></p>
      <p><strong>可以这样验收等待：</strong>把目标放在视口外、接近边缘、刚好相交和已经可见四个位置，记录请求、loading、成功和失败；检查占位尺寸、读屏文本和键盘路径都连贯，再在慢网络下确认用户知道下一步会发生什么。</p>
    </ArticleSection>

    <ArticleSection id="lazy-loading-boundary-section" title="什么时候不该懒加载">
      <p id="lazy-priority" className="vp-citation-target">首屏标题、主要操作和用户马上要读的内容通常不适合懒加载。把它们延后会让性能指标看起来更轻，却把等待直接交给用户；懒加载应服务于优先级，而不是把所有请求都推迟。<Cite id="lazy-priority" sources={lazyLoadingSources} /></p>
      <p>还要把懒加载和代码分割分开：前者多由可见性或使用时机触发资源获取，后者由模块边界决定代码 chunk；一个组件可以同时拥有两层延迟，但每一层都要有自己的状态和回退。</p>
      <p><strong>最后删掉懒加载试一次：</strong>如果资源很小、几乎总会被看到，或者失败回退比提前加载更复杂，就让它正常到达。延迟的每一毫秒都应该能说明是在保护哪一段真实体验。</p>
    </ArticleSection>
  </Article>;
}
