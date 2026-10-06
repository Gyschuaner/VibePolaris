import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { cascadeSources } from "@/lib/cascade-sources";
import { CascadeSignatureHero } from "../PlatformCssSignatureHeroes";
import { CascadeLesson } from "./cascade";

const sections: [string, string][] = [
  ["cascade-definition-section", "先问：这条声明从哪里来"],
  ["cascade-layer-section", "同一来源里，层先于优先级"],
  ["cascade-importance-section", "重要声明会把牌桌翻过来"],
  ["cascade-boundary-section", "层叠不是一条‘后写覆盖前写’"],
];

export function CascadeTermPage() {
  return <Article
    slug="cascade"
    title="层叠"
    subtitle="CSS Cascade · 规则冲突时，浏览器怎样留下一个值"
    sources={cascadeSources}
    sections={sections}
    hero={<CascadeSignatureHero />}
    intro={<>同一个按钮可能同时收到浏览器默认样式、组件样式、主题层和行内声明。<strong>层叠不是挑“看起来更具体”的那一条，而是按来源与重要性、层、优先级、作用域距离和出现顺序逐关筛选。</strong>每一关只让仍在竞争的声明继续向前。</>}
  >
    <ArticleSection id="cascade-definition-section" title="先问：这条声明从哪里来">
      <p id="cascade-definition" className="vp-citation-target">把 CSS 想成寄给同一个元素的几张便签：它们都说“文字用什么颜色”，但便签可能来自浏览器、用户自定义样式或作者写的样式表。层叠算法的任务，是为每个属性从这些候选中选出一个最终值；没有候选时，属性才继续走继承或初始值。<Cite id="cascade-definition" sources={cascadeSources} /></p>
      <p id="cascade-sources" className="vp-citation-target">第一关不是数选择器里有几个类，而是看来源和重要性。普通作者样式通常胜过浏览器的默认样式；用户为了放大文字写下的用户样式，也有自己的位置。一个低优先级来源里的长选择器，不能跳过这道门。<Cite id="cascade-sources" sources={cascadeSources} /></p>
      <p id="cascade-order" className="vp-citation-target">W3C 把层叠排序写成一条有先后的链：来源与重要性、封装上下文、层、优先级、作用域距离，最后才是文档中的出现顺序。只要某一关已经只剩一个候选，后面的比较就不再发生。<Cite id="cascade-order" sources={cascadeSources} /></p>
      <p>下面这块小实验只处理一个目标按钮的 <code>color</code>。每次只放进一张便签，旁边的淘汰说明会告诉你它是在第几关出局；这比把最终颜色直接写在答案卡里更能看出浏览器做了什么。</p>
      <CascadeLesson />
    </ArticleSection>

    <ArticleSection id="cascade-layer-section" title="同一来源里，层先于优先级">
      <p id="cascade-layer" className="vp-citation-target"><code>@layer</code> 给同一来源的规则排出一组可读的优先层。普通声明里，后创建的层优先于先创建的层；没有写进任何命名层的普通作者样式，会落在隐式的最后一层。它让团队可以先把第三方 CSS 放进低层，而不必用一串更长的选择器硬压过去。<Cite id="cascade-layer" sources={cascadeSources} /></p>
      <p id="cascade-layer-normal" className="vp-citation-target">这意味着 <code>@layer theme</code> 里的一个简单类选择器，可能先胜过 <code>@layer base</code> 里带 ID 的规则：层已经把 base 淘汰，specificity 根本没有机会出场。只有留在同一层的候选，才需要继续比较选择器。<Cite id="cascade-layer-normal" sources={cascadeSources} /></p>
      <p id="cascade-unlayered" className="vp-citation-target">未分层的普通样式不是“没有层”，而是被放进这个来源的隐式最终层。把一条规则从 <code>@layer theme</code> 移到普通样式表末尾，可能让它突然赢过所有命名层；排查覆盖问题时，要先找出它到底属于哪一层。<Cite id="cascade-unlayered" sources={cascadeSources} /></p>
      <p>团队约定层名时，可以把“reset、组件、主题、工具”写在文件开头，先锁住层的创建顺序。层解决的是组织和边界，不是让每条规则都变得更重要；如果一个组件仍然需要四个 ID 才能改色，应该回头检查它的层归属。</p>
    </ArticleSection>

    <ArticleSection id="cascade-importance-section" title="重要声明会把牌桌翻过来">
      <p id="cascade-importance" className="vp-citation-target"><code>!important</code> 不会给选择器增加优先级数字，它把声明放进重要声明的比较区。普通声明里层的先后是后来者更强；重要声明则反过来，较早的层优先，未分层的重要声明反而排在分层的重要声明之后。<Cite id="cascade-importance" sources={cascadeSources} /></p>
      <p id="cascade-layer-important" className="vp-citation-target">这条反转是为了让低层的保护性规则能压住高层的普通覆盖，但也让重要声明更难维护。把一条“临时修复”塞进 <code>!important</code>，只会改变它参加哪一场比赛，并不会告诉未来的维护者为什么它必须赢。<Cite id="cascade-layer-important" sources={cascadeSources} /></p>
      <p id="cascade-inline" className="vp-citation-target">行内普通样式在作者普通样式表之后；行内重要样式也只是在作者重要声明中占更高位置，用户或浏览器为可访问性写下的重要样式仍可能胜过它。浏览器开发者工具把声明划掉时，先看来源和重要性，再看层与选择器，通常能更快找到真正的冲突。<Cite id="cascade-inline" sources={cascadeSources} /></p>
      <p id="cascade-user" className="vp-citation-target">用户重要样式高于作者重要样式，是 CSS 为用户控制体验留下的出口，例如用户样式表把字号放大。站点不能靠一串作者 <code>!important</code> 把这些可访问性选择封死；层叠的“谁能覆盖谁”本来就包含用户和浏览器的边界。<Cite id="cascade-user" sources={cascadeSources} /></p>
      <ArticleAside title="什么时候应该停下，不再加 !important"><p>如果冲突来自第三方组件，优先考虑把它导入一个明确的低层，再用自己的普通层覆盖；如果来自自己代码，先降低选择器重量、调整层顺序或删掉重复声明。只有明确的用户偏好、状态保护或外部不可改的规则，才值得留下带注释的 <code>!important</code>。</p></ArticleAside>
    </ArticleSection>

    <ArticleSection id="cascade-boundary-section" title="层叠不是一条‘后写覆盖前写’">
      <p id="cascade-specificity" className="vp-citation-target">优先级只在来源、重要性和层都相同的候选之间比较。它按 ID、类/属性/伪类、类型/伪元素三列从左到右比较；不是把选择器的字符数相加，也不是选择器越长就必胜。<Cite id="cascade-specificity" sources={cascadeSources} /></p>
      <p id="cascade-equal" className="vp-citation-target">如果两条规则的优先级也相同，浏览器再看作用域距离；作用域相同或没有作用域时，才由最后出现的声明胜出。于是“把同一行 CSS 挪到文件底部”只在前面的条件都相等时才是可靠解释。<Cite id="cascade-equal" sources={cascadeSources} /></p>
      <p id="cascade-scope" className="vp-citation-target"><code>@scope</code> 让规则带着一个范围进入比较。离目标元素更近的作用域可以胜过更远的作用域，即使选择器优先级没有更高；这和 DOM 里“父元素离得近”不是一回事，而是比较作用域根到目标的跳数。<Cite id="cascade-scope" sources={cascadeSources} /></p>
      <p>遇到“为什么这条 CSS 没生效”，可以按这个顺序问：它匹配目标了吗？来自哪个来源、是否重要、在哪个层？留下来的规则谁优先级更高，作用域谁更近？都一样时谁最后出现？把问题拆成这些小账，通常比继续堆 <code>!important</code> 更快，也更容易留下下一位读者看得懂的修复。</p>
    </ArticleSection>
  </Article>;
}
