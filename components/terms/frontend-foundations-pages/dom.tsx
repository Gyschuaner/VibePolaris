"use client";

import { BracketsCurly, CheckCircle, Code, FileText, MagnifyingGlass, PencilSimple, TreeStructure, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { domSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

function DomHero() {
  return <ConceptHero slug="dom" label="同一份 HTML 在浏览器里展开成节点树，当前被观察的文本节点留下亮点">
    <div className={styles.domHero}><div className={styles.domHeroBoard}>
      <div className={styles.domHeroHead}><TreeStructure size={19} /><span>DOCUMENT OBJECT MODEL</span><b>当前节点</b></div>
      <div className={styles.domHeroTree}><div className={styles.domHeroRoot}><span>document</span><small>当前文档对象</small></div><div className={styles.domHeroBranch}><div><span>main</span><small>区域</small></div><div data-active="true"><span>h1</span><strong>周末活动</strong></div><div><span>button</span><strong>报名</strong></div></div></div>
      <div className={styles.domHeroLens}><MagnifyingGlass size={16} /><span>脚本观察</span><strong>h1.textContent</strong><CheckCircle size={15} /></div>
    </div></div>
  </ConceptHero>;
}

type DomNodeKey = "heading" | "button" | "note";
const nodeLabels: Record<DomNodeKey, string> = { heading: "h1", button: "button", note: "p" };
const initialText: Record<DomNodeKey, string> = { heading: "周末活动", button: "报名", note: "周六 10:00" };

function DomLab() {
  const [selected, setSelected] = useState<DomNodeKey>("heading");
  const [texts, setTexts] = useState(initialText);
  const [draft, setDraft] = useState(initialText.heading);
  const [changed, setChanged] = useState(false);
  function selectNode(key: DomNodeKey) {
    setSelected(key);
    setDraft(texts[key]);
  }
  function applyText(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTexts(value => ({ ...value, [selected]: draft }));
    setChanged(true);
  }
  return <div className={styles.domLab} role="region" aria-label="DOM 节点选择与文本修改实验">
    <div className={styles.domLabHeader}><span>点树中的节点，再改它当前的文字</span><small>{changed ? "当前 DOM 已改，源 HTML 仍保留原文" : "还没有修改当前 DOM"}</small></div>
    <div className={styles.domLabBoard}>
      <div className={styles.domTreePanel}><div className={styles.domTreeRoot}><TreeStructure size={16} />document</div><div className={styles.domTreeGroup}><span>└ main</span>{(["heading", "button", "note"] as DomNodeKey[]).map(key => <button type="button" key={key} aria-pressed={selected === key} onClick={() => selectNode(key)}><span>└─ {nodeLabels[key]}</span><strong>{texts[key]}</strong></button>)}</div></div>
      <div className={styles.domEditPanel}><div className={styles.domEditTitle}><PencilSimple size={17} /><span>当前节点</span><code>{nodeLabels[selected]}</code></div><form onSubmit={applyText}><label>textContent<input value={draft} onChange={event => setDraft(event.target.value)} /></label><button type="submit">写入当前 DOM</button></form><p role="status">{changed ? <><CheckCircle size={15} />屏幕读数已更新</> : <><MagnifyingGlass size={15} />先选择一个节点</>}</p></div>
      <div className={styles.domSourcePanel}><div><FileText size={16} /><span>服务器 HTML 源片段</span></div><pre><code>{`<h1>周末活动</h1>\n<button>报名</button>\n<p>周六 10:00</p>`}</code></pre><small>这段源文本不会被上面的操作改写</small></div>
    </div>
  </div>;
}

export function DomTermPage(_props: BespokeTermPageProps) {
  return <Article slug="dom" title="DOM" subtitle="Document Object Model · 浏览器眼里的当前文档" sources={domSources} hero={<DomHero />} sections={[
    ["dom-definition-section", "HTML 到 DOM，中间多了一份对象"],
    ["dom-tree-section", "节点树保存的是关系"],
    ["dom-query-section", "先找到正确的节点"],
    ["dom-text-section", "改文本，不等于改源文件"],
    ["dom-boundary-section", "当前页面和服务器之间还有一层"],
  ]} intro={<>你在 Elements 面板里看到的页面，不完全等于服务器发来的 HTML。<strong>浏览器把文档解析成一棵当前可操作的节点树，脚本改的是这棵树。</strong></>}>
    <ArticleSection id="dom-definition-section" title="HTML 到 DOM，中间多了一份对象">
      <p>服务器返回一段 HTML 文本，浏览器读它、解析它，再在内存里建立文档对象。这个对象有节点、属性、父子关系和方法，脚本可以通过它观察和改变当前页面。</p>
      <p id="dom-definition" className="vp-citation-target"><strong>DOM 是表示文档结构和内容的对象模型。</strong>它定义了节点怎样组成文档树，以及程序如何访问这些节点。DOM 不是 JavaScript 语法，也不是服务器保存的 HTML 文件。<Cite id="dom-definition" sources={domSources} /></p>
      <p>这也是为什么开发者工具里“改了文字”之后，刷新页面又回去了：你改动的是这次加载产生的对象，刷新会重新取源内容并重新建立当前文档。</p>
    </ArticleSection>
    <ArticleSection id="dom-tree-section" title="节点树保存的是关系">
      <p id="dom-tree" className="vp-citation-target">DOM 节点不只是把文字列出来。一个 <code>button</code> 是 <code>main</code> 里的孩子，标题和说明与它处在同一份文档关系中；父节点、子节点和兄弟节点让脚本可以在局部范围内查找和修改。<Cite id="dom-tree" sources={domSources} /></p>
      <p>下面的树把元素名称和当前文字放在一起。选择 h1、button 或 p，你观察的是同一份文档里不同位置的对象；没有必要为了改一个标题重新生成整页 HTML。</p>
      <div className={styles.domOutline}><div><span>document</span><strong>当前页面</strong></div><div><span>└ main</span><strong>主要内容区域</strong></div><div className={styles.domOutlineActive}><span>　└ h1</span><strong>周末活动</strong></div><div><span>　└ button</span><strong>报名</strong></div></div>
    </ArticleSection>
    <ArticleSection id="dom-query-section" title="先找到正确的节点">
      <p id="dom-query" className="vp-citation-target">脚本通常先用 <code>querySelector</code> 或其他 DOM 方法定位节点，再读取或修改它。<code>querySelector</code> 返回第一个匹配选择器的元素；选择器写错、元素还没出现或页面里有多个相似元素，都可能让脚本拿到错误对象或得到 <code>null</code>。<Cite id="dom-query" sources={domSources} /></p>
      <p>排查时把“没改到”拆成两问：选择器有没有匹配到目标，匹配到的节点是不是你想要的那一个。开发者工具里临时执行 <code>document.querySelector(...)</code>，比继续猜 class 名更快。</p>
      <DomLab />
      <p>演示把节点选择做成可见按钮，是为了让你看清当前选择；真实脚本会使用选择器和引用。修改内容前先确认对象，能避免把同名按钮、隐藏模板或列表第一项误当成目标。</p>
    </ArticleSection>
    <ArticleSection id="dom-text-section" title="改文本，不等于改源文件">
      <p id="dom-text" className="vp-citation-target"><code>textContent</code> 读写节点包含的纯文本。把它设成新值后，浏览器会更新当前 DOM 的文本呈现；它不会自动把新值写回服务器文件，也不会替你发保存请求。<Cite id="dom-text" sources={domSources} /></p>
      <p id="dom-current" className="vp-citation-target">当前 DOM 是这次页面加载后的工作副本。浏览器重绘看到的是副本的最新状态，刷新或重新访问时，服务器返回什么仍由网络请求、缓存和服务端决定。<Cite id="dom-current" sources={domSources} /></p>
      <ArticleAside title="一条可观察的证据链"><p>节点引用 → <code>textContent</code> 新值 → Elements 面板变化，说明当前页面改动发生了；网络面板里出现保存请求、服务端返回成功，才说明持久化也发生了。不要把两段证据混成一句“页面改好了”。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="dom-boundary-section" title="当前页面和服务器之间还有一层">
      <p id="dom-boundary" className="vp-citation-target">DOM API 适合改当前页面的节点和属性，不是数据库接口。它也不会自动绕过权限、验证输入或持久化状态；这些事情需要网络请求和服务端的明确处理。<Cite id="dom-boundary" sources={domSources} /></p>
      <p>让 AI 改 DOM 交互时，说明目标选择器、修改的节点属性、没匹配到时的行为，以及是否需要把结果保存到后端。验收时分别看 Elements 面板、刷新后的结果和网络请求，才能区分临时呈现与真正保存。</p>
      <p>当页面越来越复杂，优先让组件或框架管理状态与渲染，少在各处直接寻找和改节点。直接 DOM 操作不是禁忌，但它应该有清楚的边界和可追踪的目标。</p>
    </ArticleSection>
  </Article>;
}
