"use client";

import { CheckCircle, Keyboard, Mouse, Tag, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { htmlSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import styles from "./FrontendFoundations.module.css";

function HtmlHero() {
  return <ConceptHero slug="html" label="同样一块可点击区域，原生 button 会带来可见的键盘与语义能力">
    <div className={styles.htmlHero}><div className={styles.htmlHeroBoard}>
      <div className={styles.htmlHeroTop}><Tag size={18} /><span>同一份内容 · 两种元素</span><b>语义轮廓</b></div>
      <div className={styles.htmlHeroColumns}>
        <div className={styles.htmlHeroItem}><code>&lt;div&gt;</code><span>看起来可点</span><small>浏览器不会自动把它当按钮</small><WarningCircle size={17} /></div>
        <div className={styles.htmlHeroItem} data-good="true"><code>&lt;button&gt;</code><span>可点，也可用键盘</span><small>原生角色与操作方式都在</small><CheckCircle size={17} /></div>
      </div>
      <div className={styles.htmlHeroOutline}><span>文档轮廓</span><strong>标题 · 区域 · 操作</strong><Keyboard size={16} /></div>
    </div></div>
  </ConceptHero>;
}

function HtmlLab() {
  const [semantic, setSemantic] = useState(true);
  const [activations, setActivations] = useState(0);
  const [lastInput, setLastInput] = useState("还没有操作");
  function activate(input: string) {
    setActivations(value => value + 1);
    setLastInput(input);
  }
  return <div className={styles.htmlLab} role="region" aria-label="HTML 原生元素与普通容器对照实验">
    <div className={styles.htmlLabControls}><span>让同一块内容换一种 HTML 元素</span><button type="button" aria-pressed={semantic} onClick={() => { setSemantic(value => !value); setLastInput("切换元素"); }}>{semantic ? "当前是 button" : "当前是 div"}</button></div>
    <div className={styles.htmlLabBoard} data-semantic={semantic}>
      <div className={styles.htmlLabMarkup}><span>实际标签</span><code>{semantic ? "&lt;button&gt;" : "&lt;div&gt;"}</code><small>{semantic ? "浏览器知道它是操作控件" : "只是一块普通容器"}</small></div>
      <div className={styles.htmlLabAction}>
        {semantic ? <button type="button" onClick={() => activate("鼠标或键盘")}>更新读数</button> : <div onClick={() => activate("鼠标")}>更新读数</div>}
        <span className={styles.htmlLabHint}><Mouse size={15} />{semantic ? "Tab 后可按 Enter / Space" : "鼠标能点，Tab 不会自动停在这里"}</span>
      </div>
      <div className={styles.htmlLabReadout} role="status"><strong>{activations}</strong><span>次激活</span><small>最近输入：{lastInput}</small></div>
    </div>
    <p className={styles.htmlLabNote}>{semantic ? "原生 button 既有可识别的角色，也有浏览器约定的键盘操作；样式可以继续自定义。" : "div 仍然能被脚本监听鼠标点击，但只换外观没有补上按钮的语义和键盘路径。"}</p>
  </div>;
}

export function HtmlTermPage() {
  return <Article slug="html" title="HTML" subtitle="HyperText Markup Language · 给内容安排关系" sources={htmlSources} hero={<HtmlHero />} sections={[
    ["html-definition-section", "HTML 不负责把页面画漂亮"],
    ["html-structure-section", "先把文档的关系写出来"],
    ["html-semantics-section", "语义会改变机器读到的东西"],
    ["html-native-section", "原生元素自带一小套能力"],
    ["html-boundary-section", "CSS 和 JavaScript 接手什么"],
  ]} intro={<>网页不是一张没有结构的海报。<strong>HTML 把内容之间的关系写成浏览器能理解的文档，标题、区域和操作控件因此有了自己的位置。</strong></>}>
    <ArticleSection id="html-definition-section" title="HTML 不负责把页面画漂亮">
      <p>你可以把网页想成一篇带目录、段落和按钮的文章。HTML 先写下“这是什么”和“它跟谁在一起”，浏览器再据此建立一份当前文档。颜色、圆角和两栏布局是后来的呈现问题，不能反过来决定内容是什么。</p>
      <p id="html-definition" className="vp-citation-target"><strong>HTML 是描述网页文档结构和内容的标记语言。</strong>元素用标签表示，属性补充名称、状态或行为所需的信息；浏览器读取这些标记后，才能建立文档结构和后续的 DOM。<Cite id="html-definition" sources={htmlSources} /></p>
      <p>所以“把所有东西先写成 div，最后再调样式”会把重要线索丢在一开始。页面看起来可能一样，目录、读屏和键盘使用者得到的却是一份更模糊的文档。</p>
    </ArticleSection>
    <ArticleSection id="html-structure-section" title="先把文档的关系写出来">
      <p id="html-structure" className="vp-citation-target">标题、段落、列表、导航、主要内容和页脚并不是一堆并排的盒子。HTML 的元素嵌套关系记录了哪些内容属于哪一块，浏览器和工具可以沿着这份关系理解页面。<Cite id="html-structure" sources={htmlSources} /></p>
      <p>比如一页活动详情可以有一个主标题，下面分出“时间”和“地点”两个小标题，再放一组报名操作。即使你还没有写任何 CSS，这个顺序也已经是页面的骨架。样式只是让骨架更容易读，不是另造一份骨架。</p>
      <div className={styles.htmlOutline}><div><span>h1</span><strong>周末活动</strong></div><div><span>section</span><strong>时间 · 地点</strong></div><div><span>button</span><strong>报名</strong></div></div>
      <p>检查结构时，先关掉 CSS 或打开开发者工具的 Elements 面板，看元素是否按内容关系嵌套。看到一长串没有含义的 div，不要急着加更多 class，先问这里到底是标题、区域、列表还是操作。</p>
    </ArticleSection>
    <ArticleSection id="html-semantics-section" title="语义会改变机器读到的东西">
      <p id="html-semantics" className="vp-citation-target">语义元素把“这段文字是标题”“这里是导航”“这个控件会提交”写进文档。W3C 的信息与关系准则要求，这些关系不能只靠视觉差异表达；辅助技术和其他程序也需要从结构中得到它们。<Cite id="html-semantics" sources={htmlSources} /></p>
      <p>打开下面实验，切换同一块“更新读数”的标签。两种状态都能显示一块按钮样子的东西，但只有原生 button 会自动进入 Tab 顺序，并响应浏览器约定的 Enter 或 Space。div 不是坏元素，它只是没有承诺“这是一个操作控件”。</p>
      <HtmlLab />
      <p>如果产品设计要求一个自定义控件，补齐角色、焦点、键盘和状态更新是另一项工作。能用原生元素时，先让浏览器替你承担这份基础行为，维护成本会低许多。</p>
    </ArticleSection>
    <ArticleSection id="html-native-section" title="原生元素自带一小套能力">
      <p id="html-elements" className="vp-citation-target">HTML 元素不是标签名字的装饰。button、a、input、details 等原生元素各有自己的属性、默认交互和可访问性映射；属性再补充链接地址、输入类型、展开状态等信息。<Cite id="html-elements" sources={htmlSources} /></p>
      <p id="html-native" className="vp-citation-target">原生能力也有边界：button 不会替你保存数据，a 不会替你授权用户，input 不会替你校验所有业务规则。它们先把浏览器能确定的角色和操作说明白，其他工作交给 CSS、JavaScript 或服务端。<Cite id="html-native" sources={htmlSources} /></p>
      <ArticleAside title="给 AI 的一句约束"><p>“请先用适合内容的原生 HTML 元素，再用 CSS 保持当前视觉；如果必须自定义交互，列出焦点、键盘、读屏名称和禁用状态的验收。”这比“把 div 做得像按钮”更容易得到完整结果。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="html-boundary-section" title="CSS 和 JavaScript 接手什么">
      <p id="html-boundary" className="vp-citation-target">HTML 负责文档的结构与语义，CSS 负责呈现和布局，JavaScript 可以在页面加载后读取或修改当前 DOM。把职责混在一起，会出现“样式看着像按钮却不能键盘操作”或“脚本改了页面却没有保存到服务器”的错觉。<Cite id="html-boundary" sources={htmlSources} /></p>
      <p>让 AI 改 HTML 时，先说清内容关系和不应改变的文字，再说明需要保留的原生行为。验收时用标题导航、键盘 Tab、读屏名称和窄屏阅读各走一遍；看到视觉正确，不代表结构已经正确。</p>
      <p>HTML 的价值在于它让页面被更多工具可靠地读取。搜索引擎只是其中一个读者，浏览器、辅助技术、测试脚本和未来接手代码的人也都在依赖这份结构。</p>
    </ArticleSection>
  </Article>;
}
