"use client";

import { BracketsCurly, CheckCircle, PaintBrush, SquaresFour, TextAa, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { cssSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

type CssProperty = "layout" | "tone" | "space";

function CssHero() {
  return <ConceptHero slug="css" label="同一张海报保持文字不变，CSS 规则改变它的排列、颜色和留白">
    <div className={styles.cssHero}><div className={styles.cssHeroPoster}>
      <div className={styles.cssHeroHeader}><BracketsCurly size={19} /><span>.event-card</span><b>规则已命中</b></div>
      <div className={styles.cssHeroGrid}><span><TextAa size={22} /><strong>市集</strong></span><span><SquaresFour size={22} /><strong>放映</strong></span><span><PaintBrush size={22} /><strong>旧书</strong></span></div>
      <div className={styles.cssHeroRule}><code>display: grid;</code><code>gap: 12px;</code></div>
    </div></div>
  </ConceptHero>;
}

function CssLab() {
  const [target, setTarget] = useState<"cards" | "title">("cards");
  const [property, setProperty] = useState<CssProperty>("layout");
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    const update = () => setIsNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const active = target === "cards" && property === "layout";
  const propertyOptions: ReadonlyArray<readonly [CssProperty, string]> = target === "cards" ? [["layout", "排成卡片"], ["space", "拉开间距"]] : [["tone", "换颜色"]];
  const targetLabel = target === "cards" ? ".event-cards" : ".event-title";
  const declaration = property === "layout" ? "display: grid" : property === "tone" ? "color: var(--accent-text)" : "gap: 18px";
  function chooseTarget(nextTarget: "cards" | "title") {
    setTarget(nextTarget);
    setProperty(nextTarget === "cards" ? "layout" : "tone");
  }
  return <div className={styles.cssLab} role="region" aria-label="CSS 规则命中与计算值实验">
    <div className={styles.cssLabControls}>
      <fieldset><legend>选择器</legend><button type="button" aria-pressed={target === "cards"} onClick={() => chooseTarget("cards")}>.event-cards</button><button type="button" aria-pressed={target === "title"} onClick={() => chooseTarget("title")}>.event-title</button></fieldset>
      <fieldset><legend>声明</legend>{propertyOptions.map(([key, label]) => <button type="button" key={key} aria-pressed={property === key} onClick={() => setProperty(key)}>{label}</button>)}</fieldset>
    </div>
    <div className={styles.cssBoard} data-layout={active ? "grid" : "stack"} data-tone={target === "title" && property === "tone"} data-space={target === "cards" && property === "space"}>
      <div className={styles.cssRuleCard}><span>匹配的规则</span><code>{targetLabel} &#123;<br />&nbsp;&nbsp;{declaration};<br />&#125;</code><small>{target === "cards" ? "找到了容器" : "只找到了标题"}</small></div>
      <div className={styles.cssPoster}><div className={styles.cssPosterTitle}>周末活动</div><div className={styles.cssCards}>{["河边市集", "露天放映", "旧书交换"].map(item => <span className={styles.cssCard} key={item}><strong>{item}</strong><small>周末 · 14:00</small></span>)}</div><p className={styles.cssProof}><CheckCircle size={16} /> HTML 文字没有改，当前计算值：<b>{active ? `display: grid · ${isNarrow ? "1 列（窄屏媒体规则）" : "3 列"}` : target === "title" ? "color = accent" : "gap = 18px"}</b></p></div>
    </div>
    <p className={styles.cssLabNote} role="status">{active ? (isNarrow ? "容器规则命中；窄屏媒体规则把三张卡片排成一列。" : "容器规则命中，布局把三张卡片放到同一行。") : target === "cards" ? "同一个容器仍然被命中；这次只把卡片之间的 gap 拉开。" : "标题规则命中，只有标题换色，容器仍按原来的方式排列。"}</p>
  </div>;
}

export function CssTermPage(_props: BespokeTermPageProps) {
  return <Article slug="css" title="CSS" subtitle="Cascading Style Sheets · 让规则决定页面长什么样" sources={cssSources} hero={<CssHero />} sections={[
    ["css-definition-section", "CSS 先找到谁，再决定怎么画"],
    ["css-cascade-section", "同一属性有几条声明，谁赢"],
    ["css-layout-section", "计算值交给盒模型和布局"],
    ["css-boundary-section", "CSS 的手伸不到哪里"],
    ["css-check-section", "让 AI 改样式以后，怎么验收"],
  ]} intro={<>你只改了一条样式，列表就从一列变成了卡片。<strong>CSS 不是给 HTML 涂颜色的贴纸，而是一组会被浏览器匹配、比较、计算的呈现规则。</strong></>}>
    <ArticleSection id="css-definition-section" title="CSS 先找到谁，再决定怎么画">
      <p>把网页想成一张活动海报：HTML 写下“市集、放映、旧书交换”这些内容，CSS 决定海报上的字多大、卡片排在哪、空隙留多少。同一份文字，规则换了，画面会换样子。</p>
      <p id="css-definition" className="vp-citation-target"><strong>一条 CSS 声明由属性和值组成，例如 <code>display: grid</code>。</strong>选择器告诉浏览器要找哪些元素；浏览器只把匹配到的规则拿来比较，然后把最终得到的值交给盒模型与布局系统。颜色、字体、边框、间距和排列都属于呈现层。<Cite id="css-definition" sources={cssSources} /></p>
      <p>“匹配”是第一道门。写了 <code>.event-cards</code>，页面里却没有这个 class，后面的 <code>display: grid</code> 就没有对象。选中了对象，也不代表这一条声明就会生效，因为同一个属性可能还有另一条规则在竞争。</p>
      <p>这解释了一个常见误会：CSS 改坏时，不要先盯着某个数字。先问“这条规则找到了谁”，再问“找到的几条规则怎样决定胜者”。</p>
    </ArticleSection>
    <ArticleSection id="css-cascade-section" title="同一属性有几条声明，谁赢">
      <p>下面的实验把两部分分开：左边是规则纸条，右边是海报。先选择目标，再选择声明。只有选中容器并要求它变成网格，三张卡片才会一起改变；选中标题换色，容器布局不会跟着变。</p>
      <CssLab />
      <p id="css-cascade" className="vp-citation-target">当多条规则都匹配同一个属性时，浏览器会按级联规则处理来源、重要性、层叠层、选择器优先级和源码顺序。选择器“更具体”只是其中一环，不能把它当作永远压过其他因素的万能钥匙。<Cite id="css-cascade" sources={cssSources} /></p>
      <p id="css-specificity" className="vp-citation-target">如果开发者工具显示一条声明被划掉，那通常表示它参与了竞争却没有成为当前胜者。把鼠标移到元素上，查看匹配规则和计算后的值，比盲目加 <code>!important</code> 更能找到原因。层叠层还可以让团队明确哪一层规则有权覆盖哪一层。<Cite id="css-specificity" sources={cssSources} /></p>
      <ArticleAside title="为什么 !important 不是修复按钮"><p>它会改变优先级，可能暂时压住问题，却把下次修改推向更难预测的竞争。先找出错误选择器、错误层级或错误加载顺序；只有清楚知道自己在跨过哪一道约束时，才讨论是否需要它。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="css-layout-section" title="计算值交给盒模型和布局">
      <p>浏览器选出声明以后，还不会马上把最终像素画出来。值可能需要继承、换算或与环境结合，得到计算值；布局系统再根据这个结果安排盒子。比如 <code>display: grid</code> 让容器进入 Grid 布局，<code>gap: 18px</code> 才有明确的网格间距含义。</p>
      <p id="css-computed" className="vp-citation-target">这也是“写了规则但没看到变化”的另一类原因：规则可能匹配了，但被另一个声明覆盖；也可能值生效了，最终尺寸又被父容器、最小宽度或内容撑开。检查计算后的属性和元素的盒子边界，才能判断变化停在哪一层。<Cite id="css-computed" sources={cssSources} /></p>
      <p id="css-layout" className="vp-citation-target">Grid 和 Flexbox 都是布局模型。它们不负责决定文章内容，也不负责保存数据；它们根据可用空间和布局声明，把子元素放进盒子里。选择 Grid 还是 Flexbox，要看你是在描述行列关系，还是在安排一条轴上的空间。<Cite id="css-layout" sources={cssSources} /></p>
      <pre className={styles.cssCode}><code>{`.event-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 640px) {
  .event-cards { grid-template-columns: 1fr; }
}`}</code></pre>
      <p>上面最后一条规则改变的是小屏时的列数；它没有改 HTML，也没有把卡片复制成另一套内容。真正的结果还要在实际窗口、长标题和更大字号下检查。</p>
    </ArticleSection>
    <ArticleSection id="css-boundary-section" title="CSS 的手伸不到哪里">
      <p id="css-responsibility" className="vp-citation-target">CSS 可以控制可见呈现与布局。<Cite id="css-responsibility" sources={cssSources} /></p>
      <p id="css-boundary" className="vp-citation-target">它不能替 HTML 赋予正确的内容语义，也不能替 JavaScript 保存购物车数量或响应点击，更不能替服务端验证“这个人有没有权限”。把按钮画得像按钮，不会自动得到按钮的键盘行为。<Cite id="css-boundary" sources={cssSources} /></p>
      <p id="css-box" className="vp-citation-target">盒模型描述内容、内边距、边框和外边距怎样组成一个元素的尺寸。一个卡片“看起来超出容器”，可能是宽度、padding、border 或 box-sizing 的组合结果，不是单纯把字体调小就能修。<Cite id="css-box" sources={cssSources} /></p>
      <p>如果你的问题是“点击后数字要加一”，去看 JavaScript 和 DOM；如果问题是“标题在窄屏要换行”，再回到 CSS 与响应式。把职责放对地方，改动会小很多。</p>
    </ArticleSection>
    <ArticleSection id="css-check-section" title="让 AI 改样式以后，怎么验收">
      <p>给 AI 的任务要同时说清当前画面、允许改的范围、不能动的东西和验收方法。例如：“只把活动列表改成三列卡片；不改 HTML 文字和链接；640px 以下单列；检查计算后的列数、盒子宽度、长标题和横向滚动。”</p>
      <p>改完先在开发者工具看匹配规则和计算值，再在桌面、窄屏和键盘操作中看真实结果。若它用一条更强的规则盖掉旧问题，你还应该知道为什么这条规则有权生效。CSS 的正确，不是截图一刻刚好对齐，而是规则在下一个内容和尺寸到来时仍说得通。</p>
      <div className={styles.cssBoundary}><WarningCircle size={20} /><span>看到声明被划掉时，先查“谁赢了”；看到盒子溢出时，再查“它实际占了多大”。</span></div>
    </ArticleSection>
  </Article>;
}
