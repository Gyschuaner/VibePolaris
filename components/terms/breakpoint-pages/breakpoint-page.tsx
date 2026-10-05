import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { breakpointSources } from "@/lib/breakpoint-sources";
import { BreakpointHero } from "./breakpoint-hero";
import { BreakpointLesson } from "./breakpoint";

const sections: [string, string][] = [
  ["breakpoint-definition-section", "断点不是设备标签"],
  ["breakpoint-failure-section", "先让内容自己暴露压力"],
  ["breakpoint-rule-section", "断点改变的是规则，不是内容"],
  ["breakpoint-boundary-section", "什么时候根本不需要断点"],
];

export function BreakpointTermPage() {
  return <Article slug="breakpoint" title="断点" subtitle="Breakpoint · 内容第一次失效的那条线" sources={breakpointSources} sections={sections} hero={<BreakpointHero />} intro={<>“移动端用 768px，平板用 1024px”听起来很熟，但页面真正坏掉的时刻，往往和设备名字没有关系。<strong>断点是内容第一次变得难读、难点按，或操作开始互相打架时，布局切换规则的位置。</strong>先观察同一组内容怎样承受宽度变化，再决定在哪条线上改变它。</>}>
    <ArticleSection id="breakpoint-definition-section" title="断点不是设备标签">
      <p id="breakpoint-definition" className="vp-citation-target">断点是一个媒体条件从不成立变成成立的边界，例如 <code>width &gt;= 680px</code>。它本身只是条件的临界值，真正要解释的是：条件成立后，哪一条 CSS 规则开始生效，界面为什么因此更适合当前空间。<Cite id="breakpoint-definition" sources={breakpointSources} /></p>
      <p id="breakpoint-media-feature" className="vp-citation-target">媒体查询可以测试 viewport 宽度，也可以测试方向、指针、hover、分辨率和用户的 reduced-motion 偏好。宽度只是其中一种 media feature；把“断点”缩写成几个屏幕尺寸，会漏掉真实的设备能力和使用环境。<Cite id="breakpoint-media-feature" sources={breakpointSources} /></p>
      <p id="breakpoint-range-syntax" className="vp-citation-target">范围语法把条件写成可读的比较式，例如 <code>@media (width &lt; 680px)</code> 或 <code>@media (680px &lt;= width)</code>。浏览器判断的是条件是否成立，不是把 680px 当成某个产品型号的身份证。<Cite id="breakpoint-range-syntax" sources={breakpointSources} /></p>
      <p id="breakpoint-viewport" className="vp-citation-target">默认的 width 查询看的是 viewport，而不是某个卡片组件实际拿到的宽度。页面里嵌套的组件如果要根据自己的容器变化，应该考虑 container query；否则一个全局断点可能在大屏侧栏里仍然做出错误决定。<Cite id="breakpoint-viewport" sources={breakpointSources} /></p>
    </ArticleSection>

    <ArticleSection id="breakpoint-failure-section" title="先让内容自己暴露压力">
      <p id="breakpoint-content" className="vp-citation-target">挑一组真实内容，从小屏开始往宽处放，或从宽处慢慢缩窄。web.dev 建议让内容决定断点：当导航、行长、按钮间距或侧栏第一次需要改变时，记录那个位置，而不是先抄一张设备宽度表。<Cite id="breakpoint-content" sources={breakpointSources} /></p>
      <p id="breakpoint-mobile-first" className="vp-citation-target">从小屏出发不是为了“移动端永远优先”，而是先把最少的空间分给必要内容，再随着空间增加逐步添加列、间距和辅助操作。这样每一个断点都有一件具体的事要做，断点数量也更容易保持少。<Cite id="breakpoint-mobile-first" sources={breakpointSources} /></p>
      <p id="breakpoint-failure" className="vp-citation-target">候选断点应该落在内容开始坏掉之前：文字行过长、侧栏被挤薄、按钮点击区互相靠太近，都是证据。MDN 的建议很朴素——把 viewport 拉窄，看到内容需要改善的地方，再在那里加媒体查询。<Cite id="breakpoint-failure" sources={breakpointSources} /></p>
      <BreakpointLesson />
    </ArticleSection>

    <ArticleSection id="breakpoint-rule-section" title="断点改变的是规则，不是内容">
      <p id="breakpoint-range" className="vp-citation-target">一个断点可以改变 grid 的列数、导航的显示方式或文章的列宽，但不应该复制一套“移动版 HTML”。同一份内容在条件成立时套用另一组 CSS，结构和阅读顺序仍然保持稳定。<Cite id="breakpoint-range" sources={breakpointSources} /></p>
      <p id="breakpoint-feature" className="vp-citation-target">如果问题来自 hover 或指针精度，就查询 <code>hover</code>、<code>pointer</code>；如果问题来自用户怕动画，就查询 <code>prefers-reduced-motion</code>。这些条件能解释“为什么要改变规则”，比把所有情况压进一个宽度断点更准确。<Cite id="breakpoint-feature" sources={breakpointSources} /></p>
      <p>首图把“内容失效”和“布局切换”分成两帧：640px 的导航已经挤在一起，但规则还没变；680px 处先切到紧凑布局，随后再缩窄，内容仍然有可操作的位置。断点不负责修复已经发生的拥挤，它负责在拥挤之前换一套更合适的规则。</p>
    </ArticleSection>

    <ArticleSection id="breakpoint-boundary-section" title="什么时候根本不需要断点">
      <p id="breakpoint-container" className="vp-citation-target">可复用组件经常不该监听整个 viewport。MDN 提到 container query 可以让组件根据自己所在容器的尺寸改变样式：同一张卡片放在主栏和侧栏时，不必因为页面整体宽度相同就被迫使用同一套布局。<Cite id="breakpoint-container" sources={breakpointSources} /></p>
      <p id="breakpoint-without-query" className="vp-citation-target">Flexbox、Grid、<code>minmax()</code> 和 <code>auto-fit</code> 已经能吸收很多连续变化。先问“流体布局能不能撑住”，再决定是否加断点；如果只需要列宽随容器变，额外的媒体查询反而会制造新的边界。<Cite id="breakpoint-without-query" sources={breakpointSources} /></p>
      <p><strong>可以这样验收一个断点：</strong>把同一段真实内容从最窄拖到最宽，记录第一次可见的失效；确认断点在它之前让规则改变；再用键盘和读屏顺序走一遍，检查你改的是布局而不是内容语义。最后删掉断点试试，如果流体规则已经能承受变化，就让它留下。</p>
    </ArticleSection>
  </Article>;
}
