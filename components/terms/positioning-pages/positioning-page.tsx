import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { positioningSources } from "@/lib/positioning-sources";
import { PositioningSignatureHero as PositioningHero } from "../RenderingLayoutSignatureHeroes";

const sections: [string, string][] = [
  ["positioning-definition-section", "先问：这个盒子相对谁"],
  ["positioning-containing-section", "absolute 要找包含块"],
  ["positioning-flow-section", "离开普通流会留下什么"],
  ["positioning-boundary-section", "fixed 和 sticky 都有边界"],
];

export function PositioningTermPage() {
  return <Article slug="positioning" title="定位" subtitle="CSS Positioning · 盒子移动前先找参照系" sources={positioningSources} sections={sections} hero={<PositioningHero />} intro={<>CSS 定位不是“把元素拖到某个坐标”。<strong>浏览器先决定元素相对谁计算偏移，以及它还不在普通流里占不占位置。</strong>同一个 <code>top: 16px</code>，放在 relative、absolute、fixed 或 sticky 上，可能是在移动不同的东西。</>}>
    <ArticleSection id="positioning-definition-section" title="先问：这个盒子相对谁">
      <p id="position-scheme" className="vp-citation-target"><code>position</code> 属性选择定位方案。<code>static</code> 是默认的普通流；<code>relative</code> 从自己的原位置偏移；<code>absolute</code> 脱离普通流并寻找包含块；<code>fixed</code> 通常相对视口；<code>sticky</code> 则在普通流和贴住边界之间切换。<Cite id="position-scheme" sources={positioningSources} /></p>
      <p id="position-flow" className="vp-citation-target">定位的两个问题要分开：坐标从哪里算，以及元素是否还为自己留下空间。relative 会保留占位，absolute 和 fixed 通常不再占普通流位置；因此只改 <code>top</code> 可能同时改变视觉位置和后面内容的排布。<Cite id="position-flow" sources={positioningSources} /></p>
      <p>首图演示固定一个容器和一张提醒卡，只切换定位方式。读者要观察的不是卡片“看起来顺眼不顺眼”，而是它的参照标签和占位状态怎样一起变化。</p>
    </ArticleSection>
    <ArticleSection id="positioning-containing-section" title="absolute 要找包含块">
      <p id="position-containing-block" className="vp-citation-target">绝对定位元素会寻找最近的、建立了定位上下文的祖先作为 containing block（包含块）。通常给卡片的父容器加 <code>position: relative</code>，再让卡片 <code>position: absolute</code>，卡片的 <code>top</code> 和 <code>right</code> 就会以这个容器为参照。<Cite id="position-containing-block" sources={positioningSources} /></p>
      <p id="position-absolute" className="vp-citation-target">如果一路向上都没有合适的祖先，absolute 可能以初始包含块为参照，视觉上像是“跑出组件”。这不是 top 数字突然失效，而是你没有把参照系留在组件边界里。<Cite id="position-absolute" sources={positioningSources} /></p>
      <p>排查时先给包含块画边框，再看卡片的偏移；不要先把 top 改成负数来“拉回来”。参照系明确后，数值通常会回到组件自己的坐标里。</p>
    </ArticleSection>
    <ArticleSection id="positioning-flow-section" title="离开普通流会留下什么">
      <p id="position-inset" className="vp-citation-target"><code>top</code>、<code>right</code>、<code>bottom</code>、<code>left</code> 和简写的 <code>inset</code> 描述偏移，不决定元素要不要占位。<code>relative</code> 的卡片仍占原来的空间，<code>absolute</code> 的卡片则由其他内容接替它的位置。<Cite id="position-inset" sources={positioningSources} /></p>
      <p>这就是“弹窗盖住正文”和“正文给弹窗让出一块空白”的分叉点：前者常用 absolute 或 fixed，后者更可能是普通流里的块或 grid/flex 项。定位不是布局系统的万能替代品。</p>
      <p>如果卡片移动后点击区域和视觉区域错开，先检查它是否被祖先的 overflow、transform 或 stacking context 影响；再确认它的定位方式是否真的适合这个任务。</p>
    </ArticleSection>
    <ArticleSection id="positioning-boundary-section" title="fixed 和 sticky 都有边界">
      <p id="position-fixed" className="vp-citation-target"><code>fixed</code> 通常把元素钉在视口上，适合悬浮按钮、全局工具条和不应随内容滚动的控件；但某些祖先建立的包含块会改变它的参照，不能只凭“fixed 就永远相对窗口”来排查。<Cite id="position-fixed" sources={positioningSources} /></p>
      <p id="position-sticky" className="vp-citation-target"><code>sticky</code> 先像普通流元素一样占位，滚动到 inset 阈值后才贴住最近的滚动容器；没有明确的滚动边界、阈值或足够的滚动空间时，它看起来就像没有生效。<Cite id="position-sticky" sources={positioningSources} /></p>
      <p id="position-boundary" className="vp-citation-target">定位的最后一道边界是容器本身：<code>inset</code> 的百分比、滚动容器和裁剪都会限制可见结果。先写出“相对谁、占不占位、何时贴住”三句，再决定具体的 CSS 数值，比盲调 z-index 和负边距更容易维护。<Cite id="position-boundary" sources={positioningSources} /></p>
    </ArticleSection>
  </Article>;
}
