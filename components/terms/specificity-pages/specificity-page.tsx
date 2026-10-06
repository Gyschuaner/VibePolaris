import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { specificitySources } from "@/lib/specificity-sources";
import { SpecificitySignatureHero } from "../PlatformCssSignatureHeroes";
import { SpecificityLesson } from "./specificity";

const sections: [string, string][] = [
  ["specificity-definition-section", "先把选择器拆成三列"],
  ["specificity-compare-section", "比较不是把字符数相加"],
  ["specificity-pseudo-section", "伪类会把权重带进来"],
  ["specificity-boundary-section", "优先级也有它的边界"],
];

export function SpecificityTermPage() {
  return <Article slug="specificity" title="CSS 优先级" subtitle="Specificity · 选择器冲突时先看哪一列" sources={specificitySources} sections={sections} hero={<SpecificitySignatureHero />} intro={<>两条 CSS 规则都命中了同一个按钮时，浏览器不会数谁写得长。<strong>它把选择器拆成 ID、类/属性/伪类、元素/伪元素三列，先比较左边，再决定右边是否还有机会。</strong>这让“为什么这条规则没生效”变成一笔能读懂的账。</>}>
    <ArticleSection id="specificity-definition-section" title="先把选择器拆成三列">
      <p id="specificity-definition" className="vp-citation-target">Specificity（优先级）是选择器在层叠比较中的三列分数：ID、类/属性/伪类、元素/伪元素。浏览器先确认候选来自相同的来源、重要性和层，再在这个阶段比较三列；优先级不会让一条根本没有命中的规则起死回生。<Cite id="specificity-definition" sources={specificitySources} /></p>
      <p id="specificity-columns" className="vp-citation-target">把 <code>#settings .card</code> 写成 <code>1-1-0</code>：第一个 1 是 ID，第二个 1 是 class，最后的 0 表示没有元素选择器。W3C 的选择器规范用这个分组比较复杂选择器，而不是把每个字符换成一个“分数”。<Cite id="specificity-columns" sources={specificitySources} /></p>
      <p>下面的小实验只换选择器，目标元素、颜色和作者层都不变。你可以先选一条，再问它是在哪一列赢；这样不会把来源、层和优先级混成一个“大而模糊的权重”。</p>
      <SpecificityLesson />
    </ArticleSection>
    <ArticleSection id="specificity-compare-section" title="比较不是把字符数相加">
      <p id="specificity-order" className="vp-citation-target">比较从 ID 列开始。如果一条是 <code>1-0-0</code>，另一条是 <code>0-99-99</code>，前者仍然先赢；只有 ID 列相同，浏览器才会看类列，类列也相同才继续到元素列。选择器的字符长度、嵌套深度和属性值长度都不在这张表里。<Cite id="specificity-order" sources={specificitySources} /></p>
      <p>这解释了一个常见的排查误区：给一个已经输在 ID 列的规则再加几个 class，只是在右边堆数字。更稳的修复通常是让两条规则处在同一层、减少不必要的 ID，或者把基础样式放进更合适的层。</p>
      <p id="specificity-reset" className="vp-citation-target">如果你在组件库里负责默认样式，可以用低优先级的选择器给使用者留下改动空间；需要精确覆盖时，再让调用方在同一层里明确提高一列。<Cite id="specificity-reset" sources={specificitySources} /></p>
    </ArticleSection>
    <ArticleSection id="specificity-pseudo-section" title="伪类会把权重带进来">
      <p id="specificity-where" className="vp-citation-target"><code>:where()</code> 的参数可以写得很具体，但整个 <code>:where()</code> 永远贡献 <code>0-0-0</code>。所以 <code>:where(#settings) .card</code> 的分数仍是 <code>0-1-0</code>，它适合写默认样式，让后续组件规则不必使用更长的选择器才能覆盖。<Cite id="specificity-where" sources={specificitySources} /></p>
      <p id="specificity-is" className="vp-citation-target"><code>:is()</code> 则会取参数列表中最具体的一项参与计算。例如 <code>:is(#settings, .panel) .card</code> 会带着 ID 列进入比较，不是把两个分支相加。把它理解成“按实际匹配分支取最高值”，比背一条神秘例外更可靠。<Cite id="specificity-is" sources={specificitySources} /></p>
      <p id="specificity-max" className="vp-citation-target">这也是为什么重构选择器时不能只看它读起来像不像同一个意思：把 <code>:where()</code> 换成 <code>:is()</code> 可能会悄悄提高默认样式的优先级。<Cite id="specificity-max" sources={specificitySources} /></p>
    </ArticleSection>
    <ArticleSection id="specificity-boundary-section" title="优先级也有它的边界">
      <p id="specificity-important" className="vp-citation-target">优先级只在更前面的条件相同时出场。来源、重要性、层或作用域已经分出胜负时，继续给选择器加 class 并不会改变结果；<code>!important</code> 也会把声明带进另一套比较顺序。<Cite id="specificity-important" sources={specificitySources} /></p>
      <p>遇到 DevTools 里被划掉的声明，可以依次问：规则是否命中？它来自哪个来源和层？是否进入重要区？确认这些都相同后，才读三列数字。若三列也相同，再看作用域距离，最后才看出现顺序。</p>
      <p>这个顺序的价值在于能指出修复位置：输了层就调整层，输了优先级就收窄或降低另一条选择器，只有确实需要时才使用更高优先级。每一次改动都应该让下一位维护者看得出自己是在解决哪一列的问题。</p>
    </ArticleSection>
  </Article>;
}
