import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { mediaQuerySources } from "@/lib/media-query-sources";
import { MediaQuerySignatureHero as MediaQueryHero } from "../RenderingLayoutSignatureHeroes";

const sections: [string, string][] = [
  ["media-query-definition-section", "它先问环境，再决定规则"],
  ["media-query-feature-section", "宽度只是其中一个输入"],
  ["media-query-combine-section", "多个条件各自开关，结果可以叠加"],
  ["media-query-boundary-section", "媒体查询不替你完成布局"],
];

export function MediaQueryTermPage() {
  return <Article slug="media-query" title="媒体查询" subtitle="Media Query · 让 CSS 先听见环境" sources={mediaQuerySources} sections={sections} hero={<MediaQueryHero />} intro={<>页面面对的不是一块永远不变的画布：窗口会收窄，指针可能不支持悬停，用户也可能要求少一点运动。<strong>媒体查询把这些环境信号写成条件，让对应的 CSS 声明加入或退出计算。</strong>它像一组开关，决定规则何时参与，真正的布局仍由 Grid、Flexbox 和普通 CSS 完成。</>}>
    <ArticleSection id="media-query-definition-section" title="它先问环境，再决定规则">
      <p id="mq-condition" className="vp-citation-target">媒体查询由媒体类型、媒体特征和逻辑条件组成。浏览器持续判断条件是否成立，成立时把块里的声明应用到当前文档；条件变成 false，声明就不再命中。<Cite id="mq-condition" sources={mediaQuerySources} /></p>
      <p id="mq-at-rule" className="vp-citation-target"><code>@media</code> 是写这组条件的 at-rule。它不创建新的组件，也不把页面复制成“桌面版”和“手机版”；它只给已有选择器加一层运行时门槛。<Cite id="mq-at-rule" sources={mediaQuerySources} /></p>
      <p id="mq-fallback" className="vp-citation-target">更稳的写法是先写能工作的基础样式，再让媒体查询改动少数真正需要变化的属性。这样条件不成立时仍有可读的默认结果，条件切换也不会让内容突然消失。<Cite id="mq-fallback" sources={mediaQuerySources} /></p>
    </ArticleSection>

    <ArticleSection id="media-query-feature-section" title="宽度只是其中一个输入">
      <p id="mq-feature" className="vp-citation-target">媒体特征可以描述 viewport 宽度、方向、分辨率、输入指针和 hover 能力，也可以描述用户的显示偏好。把媒体查询缩写成“屏幕小于 768px”会把这些不同问题揉成一把尺子。<Cite id="mq-feature" sources={mediaQuerySources} /></p>
      <p id="mq-width" className="vp-citation-target">宽度查询适合回答“这一组内容还放得下吗”，例如 <code>(width &lt; 640px)</code>。它回答的是当前 viewport 的条件，不等于某个手机型号；组件如果要看自己的容器，应另看 container query。<Cite id="mq-width" sources={mediaQuerySources} /></p>
      <p id="mq-hover" className="vp-citation-target"><code>hover</code> 和 <code>pointer</code> 描述的是输入能力。没有 hover 的设备仍然可以点击；因此 tooltip 里唯一的关键信息不能只在鼠标经过时出现。<Cite id="mq-hover" sources={mediaQuerySources} /></p>
    </ArticleSection>

    <ArticleSection id="media-query-combine-section" title="多个条件各自开关，结果可以叠加">
      <p id="mq-logical" className="vp-citation-target"><code>and</code> 要求两边同时成立，逗号可以表达多个可接受分支，<code>not</code> 则把一个条件反过来。逻辑词连接的是条件，不是把几套 HTML 拼在一起。<Cite id="mq-logical" sources={mediaQuerySources} /></p>
      <p id="mq-combine" className="vp-citation-target">一条规则可以只管列数，另一条只管提示方式，第三条只管动画。width 变窄时第一条命中；hover 能力变化时第二条命中；用户打开 reduced motion 时第三条命中，它们可以在同一份内容上叠加。<Cite id="mq-combine" sources={mediaQuerySources} /> <Cite id="mq-combine-web" sources={mediaQuerySources} /></p>
      <p id="mq-motion" className="vp-citation-target"><code>prefers-reduced-motion: reduce</code> 是用户偏好，不是浏览器发现“动画太多”后的自动优化。它应该收住非必要的位移、循环和闪烁，同时保留状态变化和操作反馈。<Cite id="mq-motion" sources={mediaQuerySources} /></p>
    </ArticleSection>

    <ArticleSection id="media-query-boundary-section" title="媒体查询不替你完成布局">
      <p id="mq-range" className="vp-citation-target">范围语法让比较关系读起来像一句话：<code>(400px &lt; width &lt; 900px)</code>。它让条件本身更清楚，但列怎么排、按钮怎么换行，仍要由 Grid、Flexbox、clamp 或其他声明完成。<Cite id="mq-range" sources={mediaQuerySources} /></p>
      <p id="mq-order" className="vp-citation-target">多个查询同时命中时，层叠顺序和选择器优先级仍然有效。不要靠“最后一条看起来赢了”排查问题：先列出每条条件是否命中，再看声明、来源顺序和 specificity。<Cite id="mq-order" sources={mediaQuerySources} /></p>
      <p><strong>可以这样验收一组媒体规则：</strong>先在没有任何条件的基础样式下完成任务，再逐一改变宽度、指针能力和动效偏好；确认每次只改变它负责的属性，键盘顺序、内容语义和可操作反馈仍然连贯。最后把几个条件一起打开，看看它们是叠加，还是互相覆盖。</p>
    </ArticleSection>
  </Article>;
}
