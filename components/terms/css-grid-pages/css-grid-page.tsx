import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { cssGridSources } from "@/lib/css-grid-sources";
import { CssGridHero } from "./css-grid-hero";
import { CssGridLesson } from "./css-grid";

const sections: [string, string][] = [
  ["css-grid-definition-section", "先把两条轴同时放进视野"],
  ["css-grid-placement-section", "项目怎样找到自己的格子"],
  ["css-grid-track-section", "轨道不够时，网格会悄悄长出来"],
  ["css-grid-boundary-section", "什么时候 Grid 比 Flexbox 更诚实"],
];

export function CssGridTermPage() {
  return <Article slug="css-grid" title="网格布局" subtitle="CSS Grid · 让行、列和跨度一起结算" sources={cssGridSources} sections={sections} hero={<CssGridHero />} intro={<>做一面卡片墙时，真正麻烦的不是“把东西摆成几列”，而是卡片有的要跨两列、有的内容更长，手机上还要少一列。<strong>CSS Grid 先建立行和列的轨道，再按项目的放置方式、跨度和轨道尺寸把二维空间结算出来。</strong>它让你能看见一张座位表，而不是继续给 Flexbox 添更多补丁。</>}> 
    <ArticleSection id="css-grid-definition-section" title="先把两条轴同时放进视野">
      <p id="grid-two-dimensional" className="vp-citation-target">CSS Grid 是二维布局模型：列负责 inline 方向，行负责 block 方向，项目最终占据的是一个由两条轴共同确定的 grid area。Flexbox 更像沿一条主轴排队，Grid 则先把座位表画出来，再决定谁坐哪一格。<Cite id="grid-two-dimensional" sources={cssGridSources} /></p>
      <p id="grid-container" className="vp-citation-target">给父元素写 <code>display: grid</code> 后，它的直接子元素才成为 grid items。嵌套得很深的孙元素不会自动跨过父元素参与这张网格；如果要共享轨道，需要显式结构或 subgrid，而不是以为所有后代都能“看见线”。<Cite id="grid-container" sources={cssGridSources} /></p>
      <p id="grid-tracks" className="vp-citation-target"><code>grid-template-columns</code> 和 <code>grid-template-rows</code> 定义显式轨道。轨道之间的线有编号，也可以用命名区域表达；项目不是飘在画布上的绝对定位，而是从一条线放到另一条线，形成自己的矩形区域。<Cite id="grid-tracks" sources={cssGridSources} /></p>
      <p id="grid-lines" className="vp-citation-target">首图第一帧只画出 3 列 2 行，是故意把“空间先存在”单独拿出来。列宽由轨道尺寸共同决定，剩余空间再由 <code>fr</code> 或对齐规则分配；如果还没决定轨道，就急着给卡片写宽度，后面每一张卡片都会变成补丁。<Cite id="grid-lines" sources={cssGridSources} /></p>
    </ArticleSection>

    <ArticleSection id="css-grid-placement-section" title="项目怎样找到自己的格子">
      <p id="grid-span" className="vp-citation-target">项目可以从一条网格线放到另一条网格线，也可以写 <code>span 2</code> 占两条轨道。跨列不是把卡片拉长后盖住旁边内容，而是让它真正占据两个 track，后面的自动放置必须绕开它。<Cite id="grid-span" sources={cssGridSources} /></p>
      <p id="grid-auto-placement" className="vp-citation-target">没有指定位置的项目会进入 auto-placement。默认的 row 算法沿着行向前找下一个能放下的位置；当一个项目跨列，后面的项目可能跳到下一行，空格因此出现。浏览器不是在猜设计，而是在遵守你给的轨道和项目顺序。<Cite id="grid-auto-placement" sources={cssGridSources} /></p>
      <p id="grid-sparse" className="vp-citation-target">普通放置使用 sparse 思路：一旦向前走，就不会回头填之前留下的洞。这样视觉顺序通常和文档顺序更接近，但卡片墙可能出现一个看起来“明明能放却没放”的空格。<Cite id="grid-sparse" sources={cssGridSources} /></p>
      <p id="grid-dense" className="vp-citation-target">把 <code>grid-auto-flow</code> 改为 <code>dense</code> 后，后出现的小项目可以回头填洞。首图第四帧让空格真正消失，同时保留一条提醒：视觉位置变了，DOM 和读屏顺序没有跟着重排；它适合相册、商品墙一类可交换顺序的内容，不适合依赖阅读顺序的导航。<Cite id="grid-dense" sources={cssGridSources} /></p>
      <p id="grid-document-order" className="vp-citation-target">因此，写 Grid 时先把 HTML 顺序当成真实阅读顺序，再考虑 dense 或视觉跨度。CSS 可以重排画面，却不会替你修复键盘焦点、读屏朗读和内容语义。<Cite id="grid-document-order" sources={cssGridSources} /></p>
      <CssGridLesson />
    </ArticleSection>

    <ArticleSection id="css-grid-track-section" title="轨道不够时，网格会悄悄长出来">
      <p id="grid-implicit-track" className="vp-citation-target">你写下的列和行属于 explicit grid；如果自动放置的项目超出它们，浏览器会创建 implicit grid tracks。首图第五帧把第五张卡片放进第三行，提醒你：没有写 <code>grid-template-rows</code> 不代表不会有行，只是那一行由 <code>grid-auto-rows</code> 的规则决定。<Cite id="grid-implicit-track" sources={cssGridSources} /></p>
      <p id="grid-auto-rows" className="vp-citation-target"><code>grid-auto-rows: minmax(100px, auto)</code> 可以给自动生成的行一个最低高度，同时允许内容把它撑高。它解决的是“内容变长时不要把行压扁”，不是一个让所有卡片高度永远相同的魔法。<Cite id="grid-auto-rows" sources={cssGridSources} /></p>
      <p id="grid-minmax" className="vp-citation-target"><code>minmax()</code> 让轨道同时表达下限和上限，例如 <code>minmax(120px, 1fr)</code>：每列至少留出一张卡片能读的宽度，剩余空间再按 fr 分享。下限比“屏幕窄了就继续缩”更接近真实产品约束，因为内容有不可压缩的部分。<Cite id="grid-minmax" sources={cssGridSources} /></p>
      <p id="grid-track-algorithm" className="vp-citation-target">Grid 的结算顺序可以概括成三步：先解决项目放在哪里，再计算容器和轨道尺寸，最后把项目放进自己的区域。调试时如果只盯着某张卡片的 width，很容易错过真正改变结果的是轨道、跨度或隐式行。<Cite id="grid-track-algorithm" sources={cssGridSources} /></p>
    </ArticleSection>

    <ArticleSection id="css-grid-boundary-section" title="什么时候 Grid 比 Flexbox 更诚实">
      <p id="grid-auto-fit" className="vp-citation-target">响应式卡片墙常用 <code>repeat(auto-fit, minmax(...))</code>：容器变窄时，能放下的轨道数减少，项目自然进入下一行；<code>auto-fill</code> 会保留空轨道，<code>auto-fit</code> 会让空轨道折叠。二者差别在空轨道是否还占空间，不是两个“移动端模式”。<Cite id="grid-auto-fit" sources={cssGridSources} /></p>
      <p id="grid-shorthand" className="vp-citation-target"><code>grid</code> shorthand 可以同时写行、列和自动流，但排错时先展开它，分别确认显式轨道、隐式轨道和 placement。把一长串 shorthand 丢给 AI，往往只会得到一段“能跑但无法解释”的 CSS。<Cite id="grid-shorthand" sources={cssGridSources} /> <Cite id="grid-auto-flow" sources={cssGridSources} /></p>
      <p>如果组件只有一排操作按钮，Flexbox 的主轴结算更直观；如果你需要卡片跨列、行列共同对齐、或希望每张卡片都落在一张座位表里，Grid 会把关系写得更清楚。选 Grid 不是因为它“更强”，而是因为问题本身已经变成二维。</p>
      <p><strong>可以这样验收一张 Grid 卡片墙：</strong>先确认每张卡片的 HTML 顺序，再检查跨列项目留下的空格是否符合预期；切换 dense 时走一遍键盘，缩窄容器时观察 minmax 和隐式轨道，最后问“这张卡片是在轨道里，还是只是盖在别的东西上”。如果答案是后者，就回到轨道和 placement，而不是继续加 z-index。</p>
    </ArticleSection>
  </Article>;
}
