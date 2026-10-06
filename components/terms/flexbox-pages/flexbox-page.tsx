import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { flexboxSources } from "@/lib/flexbox-sources";
import { FlexboxSignatureHero as FlexboxHero } from "../RenderingLayoutSignatureHeroes";

const sections: [string, string][] = [
  ["flexbox-definition-section", "先把一维说清楚"],
  ["flexbox-space-section", "浏览器先算空间，再分给项目"],
  ["flexbox-wrap-section", "挤压、换行和对齐不是一回事"],
  ["flexbox-boundary-section", "什么时候该停下，换用 Grid"],
];

export function FlexboxTermPage() {
  return <Article slug="flexbox" title="弹性布局" subtitle="Flexbox · 让同一条主轴自己分配空间" sources={flexboxSources} sections={sections} hero={<FlexboxHero />} intro={<>一排按钮、头像和操作项，宽度总在变：桌面上想留出呼吸感，手机上又不能把字挤成一条缝。<strong>Flexbox 先沿一条主轴算出项目的基准尺寸和剩余空间，再按 grow、shrink、对齐和换行规则重新安排它们。</strong>它解决的是“一维的一组东西怎样相处”，不是把所有页面都变成可伸缩的魔法盒。</>}>
    <ArticleSection id="flexbox-definition-section" title="先把一维说清楚">
      <p id="flex-definition" className="vp-citation-target">Flexbox 是 CSS 的一维布局模型。这里的“一维”不是说页面只能有一行，而是一次只沿一个方向结算：可以是一条横向主轴，也可以是一条纵向主轴；另一条方向叫交叉轴，用来做对齐。<Cite id="flex-definition" sources={flexboxSources} /></p>
      <p id="flex-axes" className="vp-citation-target">容器的 <code>flex-direction</code> 决定主轴。设成 <code>row</code>，项目沿行方向排；设成 <code>column</code>，同一套“放进去、算空间、再分配”的逻辑会转到列方向。于是 <code>justify-content</code> 不是永远等于“水平对齐”，它只负责主轴；交叉轴通常看 <code>align-items</code>。<Cite id="flex-axes" sources={flexboxSources} /></p>
      <p id="flex-container" className="vp-citation-target">把父元素设为 <code>display: flex</code> 后，直接子元素才成为 flex items。默认方向是 row，默认不换行，项目可以 shrink 但不会因为有空白就自动 grow；它们在交叉轴上默认 stretch。这些默认值就是很多“为什么按钮挤在一起”的起点。<Cite id="flex-container" sources={flexboxSources} /></p>
      <p id="flex-writing-mode" className="vp-citation-target">主轴还会尊重文字的书写方向。把它想成“左到右”只是中文和英文页面里的方便说法；在从右到左或竖排文字里，start 和 end 会跟着 writing mode 变化。写布局时用主轴、交叉轴和 start/end，比把坐标锁死在 left/right 更不容易在换语言后失效。<Cite id="flex-writing-mode" sources={flexboxSources} /></p>
      <p>首图里三个项目没有被画成三张固定宽度的海报，而是放在一条会伸缩的尺子上。尺子的长度一变，先变的是“还有多少空间可以处理”，然后才是 A、B、C 的宽度；读者看到的是一个结算过程，而不是一组看似整齐、却无法解释的卡片。</p>
    </ArticleSection>

    <ArticleSection id="flexbox-space-section" title="浏览器先算空间，再分给项目">
      <p id="flex-basis" className="vp-citation-target">每个项目先有一个 <code>flex-basis</code>：它是参与分配前的起始尺寸。<code>auto</code> 会参考项目在主轴上的 width/height，没写尺寸时还会受内容的自然大小影响；<code>0</code> 则把基准压到零，让后面的 grow 比例分走几乎全部可用空间。<Cite id="flex-basis" sources={flexboxSources} /></p>
      <p id="flex-free-space" className="vp-citation-target">把项目的基准尺寸加起来，再和容器主轴比较，就得到自由空间：容器更宽是正空间，项目总和更宽是负空间。三个 120px 项目放进 480px 容器，会留下 120px；放进 300px 容器，则欠 60px。先把这笔账算出来，才能知道接下来是 grow 还是 shrink。<Cite id="flex-free-space" sources={flexboxSources} /></p>
      <p id="flex-grow-ratio" className="vp-citation-target">正空间由 <code>flex-grow</code> 参与分配。A、B、C 写成 1:2:1，不是说 B 固定宽 2px，而是把 120px 的余量切成四份：A 得一份、B 得两份、C 得一份。首图第二、三帧把“比例写在桌面上”和“余量真正落到项目上”分开，避免把 grow 看成一个神奇的宽度按钮。<Cite id="flex-grow-ratio" sources={flexboxSources} /> <Cite id="flex-grow-algorithm" sources={flexboxSources} /></p>
      <p id="flex-shrink-ratio" className="vp-citation-target">负空间则交给 <code>flex-shrink</code>。它会根据项目的 shrink factor 和基准尺寸参与收缩，目标是让项目尽量留在容器里；但 min-content、长单词、最小宽度等限制仍可能让项目溢出。所谓“Flex 会自动变小”是有条件的，不能替代对内容最小尺寸的检查。<Cite id="flex-shrink-ratio" sources={flexboxSources} /> <Cite id="flex-shrink-algorithm" sources={flexboxSources} /></p>
      <p id="flex-algorithm" className="vp-citation-target">常见的 <code>flex: 1</code> 实际上是一个 shorthand：grow、shrink 和 basis 一起改变了起算方式；<code>flex: initial</code>、<code>auto</code>、<code>none</code> 也分别代表不同的可伸缩程度。真正排查时，先把 shorthand 展开，再问“基准是多少、余量是什么、谁可以吃掉它”。<Cite id="flex-algorithm" sources={flexboxSources} /> <Cite id="flex-initial" sources={flexboxSources} /> <Cite id="flex-auto" sources={flexboxSources} /> <Cite id="flex-none" sources={flexboxSources} /></p>
    </ArticleSection>

    <ArticleSection id="flexbox-wrap-section" title="挤压、换行和对齐不是一回事">
      <p id="flex-wrap" className="vp-citation-target">Flex 容器默认是 <code>nowrap</code>。空间不足时，项目会先按 shrink 尝试变小，到了不能再缩的程度才溢出；打开 <code>flex-wrap: wrap</code> 后，项目才会进入多条 flex line。换行是另一次分组，不是把所有行拼成一个二维表。<Cite id="flex-wrap" sources={flexboxSources} /></p>
      <p id="flex-wrap-boundary" className="vp-citation-target">每条 flex line 都沿自己的主轴处理项目，所以第一行的列宽不会自动和第二行对齐。要让多行多列共享明确轨道、让一块卡片跨列，CSS Grid 的二维模型更合适；Flexbox 更像一队人排队，Grid 才像有行号列号的座位表。<Cite id="flex-wrap-boundary" sources={flexboxSources} /></p>
      <p id="flex-alignment" className="vp-citation-target"><code>justify-content</code> 分配主轴空白，<code>align-items</code> 对齐交叉轴上的项目，<code>align-content</code> 处理多条 flex line 之间的空间。它们都需要先知道当前主轴是什么；把三个属性都改成 center 却不知道方向，通常只会得到“看起来偶尔居中”的布局。<Cite id="flex-alignment" sources={flexboxSources} /></p>
      <p>实际写按钮组时，可以先决定：空间不足时是让按钮变窄、换行，还是改成纵向列表。如果这三个动作没有产品顺序，Flexbox 不会替你做决定；它只会忠实执行你写下的 shrink、wrap 和方向。</p>
    </ArticleSection>

    <ArticleSection id="flexbox-boundary-section" title="什么时候该停下，换用 Grid">
      <p id="flex-grid-boundary" className="vp-citation-target">Flexbox 和 Grid 都能做响应式界面，但职责不同。Flexbox 适合组件内部的一排按钮、导航项、头像和状态标签；当你需要同时控制行和列、让不同卡片沿同一组轨道对齐，Grid 更直接。把 Grid 当成“更强的 Flex”会让隐式轨道和自动放置变成新的困惑。<Cite id="flex-grid-boundary" sources={flexboxSources} /></p>
      <p id="flex-order-accessibility" className="vp-citation-target">还要小心 <code>order</code>、<code>row-reverse</code> 这类视觉排序。它们可以改变屏幕上的顺序，却不会自动改变 DOM 和键盘、读屏的逻辑顺序；如果只是为了修视觉上的先后，可能会把操作路径弄断。先把 HTML 的阅读顺序写对，再用布局属性做视觉调整。<Cite id="flex-order-accessibility" sources={flexboxSources} /></p>
      <p id="flex-shorthand" className="vp-citation-target">向 AI 描述 Flexbox 问题时，别只说“让它自适应”。交代容器的主轴、项目的基准尺寸、允许 grow 还是 shrink、空间不足时是否换行、视觉顺序能否改变，以及多行是否需要轨道对齐，AI 才有机会给出可解释的 CSS，而不是塞一串碰巧能跑的数字。<Cite id="flex-shorthand" sources={flexboxSources} /></p>
      <p><strong>可以这样验收一组弹性布局：</strong>把容器放宽，确认正空间按预期分配；把它缩窄，确认负空间、最小内容和溢出都有明确结果；再用键盘走一遍顺序，最后问一句“这还是一维关系吗”。如果答案变成“我要固定的行、列和跨格”，就让 Grid 接手，而不是继续给 Flexbox 加补丁。</p>
    </ArticleSection>
  </Article>;
}
