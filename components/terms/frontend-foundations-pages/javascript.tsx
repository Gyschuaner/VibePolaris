"use client";

import { Browser, CheckCircle, Code, Cursor, Database, PlayCircle, Terminal, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { javascriptSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

function JavascriptHero() {
  return <ConceptHero slug="javascript" label="指针点击加一按钮，脚本中的 count 从 2 变为 3，写回 DOM 后页面读数也变为 3">
    <svg className={styles.javascriptCounterHero} viewBox="0 0 350 225" fill="none">
      <rect className={styles.javascriptCounterMemory} x="8" y="77" width="131" height="91" rx="9" />
      <text className={styles.javascriptCounterLabel} x="22" y="101">脚本里的值</text>
      <g className={styles.javascriptCounterBefore}><text className={styles.javascriptCounterCode} x="22" y="134">count = 2</text></g>
      <g className={styles.javascriptCounterAfter}><text className={styles.javascriptCounterCode} x="22" y="134">count = 3</text></g>
      <rect className={styles.javascriptCounterWindow} x="150" y="16" width="189" height="187" rx="11" />
      <path className={styles.javascriptCounterLine} d="M150 45H339" />
      <circle className={styles.javascriptCounterDot} cx="164" cy="31" r="3" /><circle className={styles.javascriptCounterDot} cx="175" cy="31" r="3" /><circle className={styles.javascriptCounterDot} cx="186" cy="31" r="3" />
      <text className={styles.javascriptCounterLabel} x="244" y="70" textAnchor="middle">页面上的读数</text>
      <g className={styles.javascriptCounterBefore}><text className={styles.javascriptCounterDigit} x="244" y="128" textAnchor="middle">2</text></g>
      <g className={styles.javascriptCounterAfter}><text className={styles.javascriptCounterDigit} x="244" y="128" textAnchor="middle">3</text></g>
      <rect className={styles.javascriptCounterButton} x="209" y="146" width="70" height="33" rx="7" />
      <text className={styles.javascriptCounterButtonLabel} x="244" y="168" textAnchor="middle">+1</text>
      <circle className={styles.javascriptCounterPulse} cx="251" cy="163" r="17" />
      <path className={styles.javascriptCounterCursor} d="M264 164V191L271 183L276 195L281 192L276 180H287Z" />
    </svg>
  </ConceptHero>;
}

type Host = "browser" | "node";

function JavascriptLab() {
  const [count, setCount] = useState(2);
  const [domCount, setDomCount] = useState(2);
  const [domLinked, setDomLinked] = useState(true);
  const [host, setHost] = useState<Host>("browser");
  const [lastEvent, setLastEvent] = useState("还没有 click");
  function runClick() {
    setCount(value => {
      const next = value + 1;
      if (domLinked) setDomCount(next);
      return next;
    });
    setLastEvent("click 回调已执行");
  }
  function toggleDom(next: boolean) {
    setDomLinked(next);
    if (next) setDomCount(count);
  }
  const browserApi = host === "browser";
  return <div className={styles.javascriptLab} role="region" aria-label="JavaScript 状态与 DOM 读数实验">
    <div className={styles.javascriptControls}>
      <button type="button" onClick={runClick}><PlayCircle size={17} />触发 click</button>
      <label><input type="checkbox" checked={domLinked} onChange={event => toggleDom(event.target.checked)} />把状态写回 DOM</label>
      <div className={styles.javascriptHostChoice}><span>宿主</span><button type="button" aria-pressed={host === "browser"} onClick={() => setHost("browser")}><Browser size={15} />浏览器</button><button type="button" aria-pressed={host === "node"} onClick={() => setHost("node")}><Terminal size={15} />Node.js</button></div>
    </div>
    <div className={styles.javascriptBoard}>
      <div className={styles.javascriptStateCard}><span>JavaScript 变量</span><strong>{count}</strong><code>let count = {count}</code><small>{lastEvent}</small></div>
      <div className={styles.javascriptDomCard} data-linked={domLinked}><span>页面上的 DOM 文本</span><strong>{domCount}</strong><small>{domLinked ? "状态改变后同步读数" : "暂停写回，画面保留旧值"}</small></div>
      <div className={styles.javascriptHostCard}><span>{host === "browser" ? "浏览器接口" : "Node.js 接口"}</span><div><b>{browserApi ? <CheckCircle size={15} /> : <WarningCircle size={15} />}{"document.querySelector"}</b><small>{browserApi ? "当前宿主提供" : "当前宿主不提供"}</small></div><div><b>{browserApi ? <WarningCircle size={15} /> : <CheckCircle size={15} />}{browserApi ? "fs.readFile" : "fs.readFile"}</b><small>{browserApi ? "切到 Node.js 才能找" : "当前宿主提供"}</small></div></div>
    </div>
    <p className={styles.javascriptLabNote} role="status">{domLinked ? "事件回调改了状态，演示把新值同步写进 DOM。" : <>状态已经是 <strong>{count}</strong>，但 DOM 仍显示 <strong>{domCount}</strong>；脚本有值不代表屏幕自动更新。</>}</p>
  </div>;
}

export function JavascriptTermPage(_props: BespokeTermPageProps) {
  return <Article slug="javascript" title="JavaScript" subtitle="Language · 让页面对事件和数据作出回应" sources={javascriptSources} hero={<JavascriptHero />} sections={[
    ["javascript-definition-section", "JavaScript 不等于浏览器"],
    ["javascript-events-section", "事件只是一次通知"],
    ["javascript-state-section", "变量改变，页面不一定跟着变"],
    ["javascript-dom-section", "DOM 是浏览器给你的对象"],
    ["javascript-host-section", "换一个宿主，接口就换一套"],
    ["javascript-boundary-section", "把语言、页面和服务端分开"],
  ]} intro={<>点击按钮以后，页面为什么会换字？<strong>JavaScript 负责计算和决定，浏览器提供事件与 DOM 等接口；两者合在一起，才形成你看到的网页互动。</strong></>}>
    <ArticleSection id="javascript-definition-section" title="JavaScript 不等于浏览器">
      <p>JavaScript 语言本身会处理值、表达式、函数、条件和循环。它不知道什么是网页按钮，也不知道电脑上哪一个像素属于标题；这些是宿主环境另外提供的对象和方法。</p>
      <p id="javascript-definition" className="vp-citation-target"><strong>JavaScript 是 ECMAScript 语言及其实现，不等于某一个浏览器 API。</strong>引擎负责解析和执行语言代码，宿主再把事件、文档、网络或文件等能力接到代码可以调用的位置。<Cite id="javascript-definition" sources={javascriptSources} /></p>
      <p>因此同一段计算代码可以在浏览器和 Node.js 里运行，但读取当前页面要找浏览器的 <code>document</code>，读取本地文件则要找 Node.js 的接口。看到“JavaScript 能不能做”时，先问“在哪个宿主、哪个版本里做”。</p>
    </ArticleSection>
    <ArticleSection id="javascript-events-section" title="事件只是一次通知">
      <p id="javascript-events" className="vp-citation-target">事件告诉脚本“某件事发生了”，例如用户点击、输入、按键或页面完成加载。监听器登记一个函数；事件发生时，浏览器调用它，并把这次事件的相关信息传进去。<Cite id="javascript-events" sources={javascriptSources} /></p>
      <p>监听器不是业务结果。点击只说明一件事发生，接下来是否校验输入、更新状态、发请求或显示错误，要由回调里的代码决定。把“收到了 click”和“保存成功”写成同一个状态，排查问题时就会混在一起。</p>
      <div className={styles.javascriptEventCard}><div><Cursor size={19} /><span>事件对象</span><code>type: &quot;click&quot;</code></div><div><Code size={19} /><span>回调函数</span><code>检查 → 计算 → 决定</code></div><div><Database size={19} /><span>业务结果</span><code>另一个需要验证的事实</code></div></div>
    </ArticleSection>
    <ArticleSection id="javascript-state-section" title="变量改变，页面不一定跟着变">
      <p id="javascript-state" className="vp-citation-target">变量只是程序当前保存的值。脚本把 <code>count</code> 从 2 改成 3，只能证明内存里的值变了；页面是否显示 3，要看代码有没有把这个值写回 DOM 或交给框架的渲染机制。<Cite id="javascript-state" sources={javascriptSources} /></p>
      <p>点下面的“触发 click”，再暂时关掉“把状态写回 DOM”。你会看到左边的 JavaScript 变量继续增加，右边屏幕读数停在旧值。这个小差异就是很多“代码明明执行了，页面却不动”的根源。</p>
      <JavascriptLab />
      <p>真实应用还要处理异步回调、重复点击和错误恢复。不要把一个显示数字同时当成服务器是否保存成功的证据；界面读数、请求状态和服务端结果应该各有来源。</p>
    </ArticleSection>
    <ArticleSection id="javascript-dom-section" title="DOM 是浏览器给你的对象">
      <p id="javascript-dom" className="vp-citation-target"><ConceptTerm slug="dom">DOM</ConceptTerm> 是浏览器根据 HTML 文档建立的对象树。JavaScript 可以用浏览器提供的方法找到节点、读取属性或修改文本；这些改变先发生在当前页面的 DOM，不会自动写回服务器上的 HTML 源文件。<Cite id="javascript-dom" sources={javascriptSources} /></p>
      <p>把 DOM 当成一块可观察的当前画布会更准确：你可以改变它，浏览器会重新呈现；刷新或重新打开页面时，服务器和缓存仍可能返回原来的源内容。要保存变化，需要另外发请求并由服务端处理。</p>
      <ArticleAside title="一条排查线索"><p>先在控制台打印变量，再检查 DOM 节点的文本和属性，最后看网络请求有没有发出、服务端有没有返回成功。每一层都留下证据，别用“页面没变”反推脚本一定没运行。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="javascript-host-section" title="换一个宿主，接口就换一套">
      <p id="javascript-host" className="vp-citation-target">浏览器向脚本提供 DOM、事件、存储和 Fetch 等 Web API；Node.js 提供进程、文件系统等服务器环境能力。它们都能运行 JavaScript，却不是同一个全局环境。<Cite id="javascript-host" sources={javascriptSources} /></p>
      <p>实验右侧的宿主切换只改变能力清单，不会改变语言里的 <code>const</code> 或函数写法。浏览器里可以找到 <code>document.querySelector</code>，Node.js 里可以找到 <code>fs.readFile</code>；把前者放进 Node.js，语法可能没问题，运行时却会因为接口不存在而失败。</p>
    </ArticleSection>
    <ArticleSection id="javascript-boundary-section" title="把语言、页面和服务端分开">
      <p id="javascript-boundary" className="vp-citation-target">ECMAScript 规范描述语言的语义；DOM、事件和文件系统属于宿主提供的接口；服务器是否接受数据又是另一道网络和业务边界。把这些层写成一个“JavaScript 魔法”，会让错误位置无法判断。<Cite id="javascript-boundary" sources={javascriptSources} /></p>
      <p>让 AI 改交互时，可以明确写出“哪个事件触发、哪个变量改变、哪个 DOM 节点应更新、请求成功和失败各显示什么，以及目标运行时提供哪些 API”。验收时分别看控制台、DOM、网络和服务端记录，才能知道到底是哪一层没接上。</p>
      <p>JavaScript 的力量不是让所有事情都发生在一行代码里，而是把事件、状态、呈现和外部能力接成可检查的几层。分层以后，页面会更容易改，也更容易告诉别人哪里出了问题。</p>
    </ArticleSection>
  </Article>;
}
