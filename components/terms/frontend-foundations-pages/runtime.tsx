"use client";

import { useState } from "react";
import { Browser, CheckCircle, Code, Cube, File, Gear, Terminal, WarningCircle } from "@phosphor-icons/react";
import { runtimeSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

type RuntimeHost = "browser" | "node";
type RuntimeExpression = "language" | "dom" | "file";

const expressions: Record<RuntimeExpression, { label: string; code: string; language: boolean; browser: boolean; node: boolean; success: string; fail: string }> = {
  language: { label: "语言内置", code: "Math.max(1, 2)", language: true, browser: true, node: true, success: "返回 2；这段只用到 ECMAScript 能力。", fail: "" },
  dom: { label: "浏览器 DOM", code: "document.querySelector('#app')", language: false, browser: true, node: false, success: "找到当前页面的 #app 节点。", fail: "ReferenceError: document is not defined" },
  file: { label: "Node 文件系统", code: "fs.readFile('./data.json')", language: false, browser: false, node: true, success: "Node 宿主提供 fs，可读取文件。", fail: "ReferenceError: fs is not defined" },
};

function RuntimeHero() {
  return <ConceptHero slug="runtime" label="同一段代码插入浏览器或 Node.js 宿主，能接触到的能力插槽随环境改变">
    <div className={styles.runtimeHero}><div className={styles.runtimeCode}><Code size={19} /><span>同一段 JavaScript</span><strong>document.querySelector()</strong><small>语言引擎会执行，宿主决定接口</small></div><div className={styles.runtimeHosts}><div data-active="true"><Browser size={18} /><span>浏览器</span><b>DOM</b></div><div><Terminal size={18} /><span>Node.js</span><b>文件系统</b></div></div><div className={styles.runtimeHeroFoot}><Gear size={15} /><span>插槽不同，代码能调用的边界就不同</span></div></div>
  </ConceptHero>;
}

function RuntimeLab() {
  const [host, setHost] = useState<RuntimeHost>("browser");
  const [expression, setExpression] = useState<RuntimeExpression>("dom");
  const selected = expressions[expression];
  const works = host === "browser" ? selected.browser : selected.node;
  return <div className={styles.runtimeLab} role="region" aria-label="JavaScript 运行时宿主能力实验">
    <div className={styles.runtimeControls}><div className={styles.runtimeHostSwitch}><span>运行位置</span><button type="button" aria-pressed={host === "browser"} onClick={() => setHost("browser")}><Browser size={15} />浏览器</button><button type="button" aria-pressed={host === "node"} onClick={() => setHost("node")}><Terminal size={15} />Node.js</button></div><div className={styles.runtimeExpressionSwitch}><span>同一段代码换成</span>{(Object.keys(expressions) as RuntimeExpression[]).map(key => <button type="button" key={key} aria-pressed={expression === key} onClick={() => setExpression(key)}>{expressions[key].label}</button>)}</div></div>
    <div className={styles.runtimeBoard}><div className={styles.runtimeExpressionCard}><span>待执行表达式</span><code>{selected.code}</code><small>{selected.language ? "语言内置能力" : "需要宿主接口"}</small></div><div className={styles.runtimeHostCard} data-host={host}><div className={styles.runtimeHostHead}>{host === "browser" ? <Browser size={18} /> : <Terminal size={18} />}<strong>{host === "browser" ? "浏览器宿主" : "Node.js 宿主"}</strong><small>当前插槽</small></div><div className={styles.runtimeCapabilityGrid}><span className={selected.language ? "is-available" : "is-available"}><CheckCircle size={15} />JavaScript 核心</span><span className={host === "browser" && selected.browser ? "is-available" : "is-muted"}>{host === "browser" ? <><CheckCircle size={15} />document</> : <><WarningCircle size={15} />document 不存在</>}</span><span className={host === "node" && selected.node ? "is-available" : "is-muted"}>{host === "node" ? <><CheckCircle size={15} />fs.readFile</> : <><WarningCircle size={15} />fs 不在浏览器</>}</span></div></div><div className={styles.runtimeResult} role="status" data-success={works}><span>{host === "browser" ? "浏览器执行结果" : "Node.js 执行结果"}</span>{works ? <><CheckCircle size={28} /><strong>可执行</strong><small>{selected.success}</small></> : <><WarningCircle size={28} /><strong>接口缺失</strong><small>{selected.fail}</small></>}</div></div>
    <p className={styles.runtimeLabNote}>{selected.language ? "换宿主不会改变 Math.max 的语言语义。" : works ? "这次表达式找到目标宿主接口；换到另一边，结果会变成缺失。" : "语言引擎能读懂这行代码，不代表当前宿主有它要找的接口。"}</p>
  </div>;
}

export function RuntimeTermPage(_props: BespokeTermPageProps) {
  return <Article slug="runtime" title="运行时" subtitle="Runtime · 代码真正落地执行的环境" sources={runtimeSources} hero={<RuntimeHero />} sections={[
    ["runtime-definition-section", "运行时不是一门新的语言"],
    ["runtime-language-section", "先分出语言内置能力"],
    ["runtime-host-section", "宿主把插槽接到代码旁边"],
    ["runtime-browser-section", "浏览器的世界有 DOM"],
    ["runtime-node-section", "Node.js 的世界有文件系统"],
    ["runtime-version-section", "同名环境也要核对版本"],
    ["runtime-boundary-section", "把缺接口当成边界信号"],
  ]} intro={<>同一行 <code>document.querySelector</code> 放在浏览器里能找到页面，放到 Node.js 却报错。<strong>运行时把语言代码放进一个具体环境，并决定它能接触哪些宿主 API。</strong></>}>
    <ArticleSection id="runtime-definition-section" title="运行时不是一门新的语言">
      <p>写下 JavaScript 之后，代码还没有“自己跑起来”。需要一个能解析和执行语言的引擎，也需要一个把全局对象、任务调度和外部接口接在旁边的环境。浏览器和 Node.js 都能运行 JavaScript，但它们给代码准备的房间不一样。</p>
      <p id="runtime-definition" className="vp-citation-target"><strong>运行时（runtime）是程序实际执行时所在的语言实现与宿主环境。</strong>语言部分处理语义、值和函数；宿主部分提供当前环境可以使用的对象、调度和 I/O 接口。<Cite id="runtime-definition" sources={runtimeSources} /></p>
      <p>因此“这是 JavaScript”只说明语言，不足以回答“这行代码在哪里能跑”。继续问目标浏览器、Node.js、边缘运行时或其他宿主，才能得到可验证的答案。</p>
    </ArticleSection>
    <ArticleSection id="runtime-language-section" title="先分出语言内置能力">
      <p id="runtime-language" className="vp-citation-target">ECMAScript 规范定义对象、函数、表达式、控制结构等语言语义。像 <code>Math.max</code> 这样的内置能力属于语言与实现共同约定的范围，通常不会因为你从浏览器换到 Node.js 就变成另一个意思。<Cite id="runtime-language" sources={runtimeSources} /></p>
      <p>但“内置”也不是不需要核对：不同引擎和版本可能对新标准的支持时间不同。把代码分成语言语义和外部接口，能先缩小排查范围。</p>
      <RuntimeLab />
    </ArticleSection>
    <ArticleSection id="runtime-host-section" title="宿主把插槽接到代码旁边">
      <p id="runtime-host" className="vp-citation-target">宿主环境提供语言规范没有规定的能力，例如浏览器的 DOM 与网络接口、Node.js 的进程与文件系统接口。全局对象的名字和可用范围也属于宿主约定，不能从“都是 JavaScript”推断出来。<Cite id="runtime-host" sources={runtimeSources} /></p>
      <p>实验中先选代码，再换运行位置。代码卡片没有变，右侧能力插槽和结果变了：这就是运行时边界留下的证据。真正的项目还要把运行时版本、构建目标和部署平台写清楚。</p>
      <ArticleAside title="先问接口归谁"><p>看到 <code>document</code>、<code>window</code>、<code>process</code>、<code>fs</code>、<code>fetch</code> 时，先查它属于语言、浏览器、Node 还是第三方库。名字看起来像全局变量，也不代表每个宿主都有。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="runtime-browser-section" title="浏览器的世界有 DOM">
      <p id="runtime-browser" className="vp-citation-target">浏览器提供 <code>Document</code> 等 DOM 接口，让脚本访问当前页面的节点、属性和文档状态。<code>document.querySelector</code> 找到的是当前浏览器页面，不是服务器上的 HTML 文件，也不是任意机器上的文件。<Cite id="runtime-browser" sources={runtimeSources} /></p>
      <p>把依赖 DOM 的代码放到 Node.js 的构建脚本或服务端时，它可能在语言解析阶段没有问题，却在执行时找不到 <code>document</code>。此时应移动执行位置、注入明确的 DOM 环境，或改用不依赖页面的输入。</p>
    </ArticleSection>
    <ArticleSection id="runtime-node-section" title="Node.js 的世界有文件系统">
      <p id="runtime-node" className="vp-citation-target">Node.js 文档提供文件系统模块，代码可以通过 <code>fs</code> 读取和写入文件。文件系统是 Node 宿主能力，不是浏览器页面默认拥有的接口；服务端代码还要遵守权限、路径和并发边界。<Cite id="runtime-node" sources={runtimeSources} /></p>
      <p>同一份项目可能同时包含浏览器代码和 Node.js 构建脚本。不要因为它们都写在 <code>.js</code> 文件里，就把文件读取调用塞进会发给浏览器的模块；让构建工具和类型检查帮助你守住这道边界。</p>
    </ArticleSection>
    <ArticleSection id="runtime-version-section" title="同名环境也要核对版本">
      <p id="runtime-version" className="vp-citation-target">运行时名称相同，不表示版本和接口完全相同。ECMAScript 新能力、Node.js 全局对象和浏览器 Web API 都会随版本与实现逐步支持；部署前应按目标版本的文档核对。<Cite id="runtime-version" sources={runtimeSources} /></p>
      <p>“我本机能跑”只证明本机的引擎和宿主组合满足条件。把 Node 版本、浏览器支持范围、构建目标和 polyfill 策略写进项目约束，比上线后再猜谁缺了 API 更便宜。</p>
    </ArticleSection>
    <ArticleSection id="runtime-boundary-section" title="把缺接口当成边界信号">
      <p id="runtime-boundary" className="vp-citation-target">接口缺失通常是执行位置或环境假设错了，不一定是语法写错。排查时先确认表达式使用的能力归属，再核对实际运行时、版本、打包方式和权限；修复方案可能是换环境、加兼容层或改用另一种输入。<Cite id="runtime-boundary" sources={runtimeSources} /></p>
      <p>给 AI 的任务可以写成：“这段代码在浏览器执行，允许使用 DOM；构建脚本在 Node.js 执行，禁止引用 document；目标 Node 版本为 X；缺失接口要给出清楚错误。”验收时分别在目标宿主执行，而不是只在编辑器里看语法高亮。</p>
      <p>运行时的价值不是把环境神秘化，而是把“代码在哪儿执行、能看到什么、缺什么”变成一组可以检查的事实。把插槽画清楚，错误就有了落点。</p>
    </ArticleSection>
  </Article>;
}
