"use client";

import { BracketsCurly, Browser, CheckCircle, Gear, GitBranch, Package, SquaresFour, Wrench } from "@phosphor-icons/react";
import { useState } from "react";
import { frameworkSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

function FrameworkHero() {
  return <ConceptHero slug="framework" label="应用骨架留下路由、页面和数据插槽；框架把约定好的位置接起来">
    <div className={styles.frameworkHero}><div className={styles.frameworkHeroBoard}>
      <div className={styles.frameworkHeroHead}><SquaresFour size={19} /><span>APP SKELETON</span><b>约定的插槽</b></div>
      <div className={styles.frameworkHeroSlots}><div><GitBranch size={17} /><span>route</span><strong>/dashboard</strong></div><div data-active="true"><Browser size={17} /><span>page</span><strong>Dashboard</strong></div><div><Gear size={17} /><span>runtime</span><strong>server + client</strong></div></div>
      <div className={styles.frameworkHeroFoot}><span>框架维护骨架</span><i /><span>应用填入业务</span><CheckCircle size={15} /></div>
    </div></div>
  </ConceptHero>;
}

type FrameworkMode = "framework" | "library";

function FrameworkLab() {
  const [mode, setMode] = useState<FrameworkMode>("framework");
  const [route, setRoute] = useState("dashboard");
  const [page, setPage] = useState("dashboard");
  const [called, setCalled] = useState(false);
  const pageTitle = route === "dashboard" ? "数据总览" : "账户设置";
  function changeRoute(nextRoute: string) {
    setRoute(nextRoute);
    setCalled(false);
    if (mode === "framework") setPage(nextRoute);
  }
  function changeMode(nextMode: FrameworkMode) {
    setMode(nextMode);
    setCalled(false);
    if (nextMode === "framework") setPage(route);
  }
  const visibleTitle = page === "dashboard" ? "数据总览" : "账户设置";
  return <div className={styles.frameworkLab} role="region" aria-label="框架约定与库主动调用对照实验">
    <div className={styles.frameworkLabControls}><div className={styles.frameworkMode}><span>谁负责接线</span><button type="button" aria-pressed={mode === "framework"} onClick={() => changeMode("framework")}><SquaresFour size={15} />框架</button><button type="button" aria-pressed={mode === "library"} onClick={() => changeMode("library")}><Package size={15} />库</button></div><label>选择路径<select value={route} onChange={event => changeRoute(event.target.value)}><option value="dashboard">/dashboard</option><option value="settings">/settings</option></select></label></div>
    <div className={styles.frameworkBoard}><div className={styles.frameworkSlotsCard}><span>应用插槽</span><div><code>route</code><strong>/{route}</strong></div><div><code>page</code><strong>{visibleTitle}</strong></div><div><code>data</code><small>{mode === "framework" ? "由约定读取" : "等待应用调用"}</small></div></div><div className={styles.frameworkScreen}><div className={styles.frameworkScreenBar}><Browser size={15} />app.example <small>{mode === "framework" ? "framework" : "library"}</small></div><div className={styles.frameworkScreenBody}><h3>{visibleTitle}</h3><p>{mode === "framework" ? "路由改变，框架把页面插槽换好了。" : called ? "应用主动调用库，页面才换成当前路径。" : "路径已经改变，页面还在旧位置。"}</p><button type="button" onClick={() => { setPage(route); setCalled(true); }} disabled={mode === "framework"}>调用 render()</button></div></div><div className={styles.frameworkEvidence} role="status">{mode === "framework" ? <><CheckCircle size={17} /><strong>约定接管</strong><span>切换路径后页面自动换位</span></> : <><Wrench size={17} /><strong>{called ? "主动调用完成" : "等待应用调用"}</strong><span>库提供能力，不接管入口</span></>}</div></div>
  </div>;
}

export function FrameworkTermPage(_props: BespokeTermPageProps) {
  return <Article slug="framework" title="框架" subtitle="Framework · 约定应用怎样被组织和运行" sources={frameworkSources} hero={<FrameworkHero />} sections={[
    ["framework-definition-section", "框架先规定一副骨架"],
    ["framework-convention-section", "约定会替你放置一些东西"],
    ["framework-library-section", "框架和库，控制权方向不同"],
    ["framework-runtime-section", "构建与运行仍是两件事"],
    ["framework-boundary-section", "框架不会替你决定业务"],
  ]} intro={<>你拿到一个空项目，为什么只要把文件放进指定位置，页面就能被路由和构建工具找到？<strong>框架提供应用骨架与运行约定，让你的业务代码进入一套已经接好的入口。</strong></>}>
    <ArticleSection id="framework-definition-section" title="框架先规定一副骨架">
      <p>库像工具箱，应用代码需要时拿起一件工具；框架更像一副已经搭好的工作台，入口、文件位置、路由和渲染阶段都有约定。你仍然写业务，但不必每次从零决定启动顺序和胶水代码。</p>
      <p id="framework-definition" className="vp-citation-target"><strong>框架是一组组织应用结构、生命周期和运行方式的约定与工具。</strong>它通常规定项目目录、入口、路由或构建方式，并在合适的阶段调用你的代码。具体控制范围随框架而变，不能只凭“依赖很多”判断。<Cite id="framework-definition" sources={frameworkSources} /></p>
      <p>“框架替我做了什么”要落到具体约定上：它是否负责发现页面文件、把 URL 接到页面、决定服务器和浏览器分别执行哪段代码，还是只提供几个可以主动调用的函数。</p>
    </ArticleSection>
    <ArticleSection id="framework-convention-section" title="约定会替你放置一些东西">
      <p id="framework-convention" className="vp-citation-target">以文件型路由为例，框架可以把目录和文件名解释成 URL，把特定文件名解释成布局、加载状态或错误边界。约定减少了配置，但也意味着文件移动、导出方式和运行位置会影响结果。<Cite id="framework-convention" sources={frameworkSources} /></p>
      <p>切换下面的路径。演示把两种控制权压缩成一个小实验：框架模式里，选择路径后页面插槽自动换内容，代表框架约定替应用接好入口；库模式里，路径已经改变，页面要等应用代码主动调用 <code>render()</code>。真实框架的接线由它自己的路由和生命周期实现，这个控件只呈现结果差异。</p>
      <FrameworkLab />
      <p>约定的好处是团队有共同地图，代价是你要读懂这张地图。遇到“文件明明存在却没有页面”时，先查框架要求的目录、导出和运行环境，不要只在组件里加更多代码。</p>
    </ArticleSection>
    <ArticleSection id="framework-library-section" title="框架和库，控制权方向不同">
      <p id="framework-library" className="vp-citation-target">库通常由应用代码主动导入和调用；框架则常在自己的生命周期里调用应用提供的入口。React 更常被描述为用于构建 UI 的库，Next.js、Angular 等则在路由、构建或应用结构上提供更大范围的约定。边界不是永远绝对，但“谁掌握主循环”是有用的判断线索。<Cite id="framework-library" sources={frameworkSources} /></p>
      <p>这不是给工具分高低。小页面可能只需要一个库，完整应用可能需要框架统一路由、数据边界和构建产物。选型前先说清楚你要解决的是一件局部能力，还是整套应用组织问题。</p>
      <ArticleAside title="问自己三个问题"><p>入口由谁决定？路由由谁接线？我需要主动调用一个能力，还是需要一套约定来安排整个应用？回答这三问，比背“框架和库的定义”更能帮你做判断。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="framework-runtime-section" title="构建与运行仍是两件事">
      <p id="framework-runtime" className="vp-citation-target">现代框架往往把代码分到构建阶段、服务器运行时和浏览器客户端。构建工具可能预先生成文件，服务器可能处理请求，浏览器再接上交互；同一个组件文件不代表每一段都在同一个地方执行。<Cite id="framework-runtime" sources={frameworkSources} /></p>
      <p>遇到一个 API “在本地能用、部署后不能用”，先问它属于哪个运行阶段。框架的约定可以帮你把代码放到正确位置，却不会把浏览器接口凭空变成服务器接口。</p>
    </ArticleSection>
    <ArticleSection id="framework-boundary-section" title="框架不会替你决定业务">
      <p id="framework-boundary" className="vp-citation-target">框架能安排入口、渲染和构建，却不知道你的订单是否允许取消、用户是否有权限、错误是否需要重试。业务规则、数据校验、安全边界和产品取舍仍由应用负责。<Cite id="framework-boundary" sources={frameworkSources} /></p>
      <p>让 AI 改框架项目时，要同时说明目录约定、运行位置、数据来源和不能改变的边界。验收不只看页面能否打开，还要看直接访问 URL、刷新、错误状态、权限和生产构建是否仍符合业务。</p>
      <p>框架的价值是把重复的应用组织工作变成可读的约定。读懂约定以后，你才知道哪些文件是入口，哪些是业务，哪些问题应该交给库、运行时或服务端。</p>
    </ArticleSection>
  </Article>;
}
