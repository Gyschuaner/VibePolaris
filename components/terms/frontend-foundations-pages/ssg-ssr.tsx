"use client";

import { useState } from "react";
import { Clock, Copy, Printer, Receipt, WarningCircle } from "@phosphor-icons/react";
import { ssgSsrSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

function SsgSsrHero() {
  return <ConceptHero slug="ssg-ssr" label="左边预先印好的静态票价停在 80 元；右边收到请求后印出票价 100 元的新页面">
    <svg className={styles.renderHero} viewBox="0 0 350 205" fill="none">
      <text x="82" y="22" textAnchor="middle" className={styles.renderHeroLabel}>SSG · 预先生成</text>
      <text x="266" y="22" textAnchor="middle" className={styles.renderHeroLabel}>SSR · 请求时生成</text>
      <g className={styles.renderStaticPile}>
        <rect x="19" y="54" width="125" height="125" rx="8" transform="rotate(-5 19 54)" />
        <rect x="25" y="48" width="125" height="125" rx="8" transform="rotate(3 25 48)" />
        <rect x="20" y="45" width="125" height="125" rx="8" />
        <text x="37" y="70" className={styles.renderHeroSmall}>09:00 的快照</text>
        <text x="37" y="116" className={styles.renderHeroPrice}>¥80</text>
        <path d="M37 131H125M37 140H101M37 149H119" />
      </g>
      <g className={styles.renderFreshTicket}>
        <rect x="203" y="45" width="125" height="125" rx="8" />
        <text x="220" y="70" className={styles.renderHeroSmall}>10:00 的请求</text>
        <text x="220" y="116" className={styles.renderHeroPrice}>¥100</text>
        <path d="M220 131H308M220 140H284M220 149H302" />
      </g>
      <path className={styles.renderPrintHead} d="M195 45H335" />
      <text x="82" y="196" textAnchor="middle" className={styles.renderHeroSmall}>同一份 HTML 可复用</text>
      <text x="266" y="196" textAnchor="middle" className={styles.renderHeroSmall}>按这次请求重新生成</text>
    </svg>
  </ConceptHero>;
}

type RequestResult = { price: number; request: number } | "error";

function GenerationLab() {
  const [price, setPrice] = useState(80);
  const [snapshot, setSnapshot] = useState(80);
  const [available, setAvailable] = useState(true);
  const [request, setRequest] = useState(1);
  const [staticResult, setStaticResult] = useState<RequestResult>({ price: 80, request: 1 });
  const [serverResult, setServerResult] = useState<RequestResult>({ price: 80, request: 1 });
  const [regenerationFailed, setRegenerationFailed] = useState(false);

  function visit() {
    const nextRequest = request + 1;
    setRequest(nextRequest);
    setStaticResult({ price: snapshot, request: nextRequest });
    setServerResult(available ? { price, request: nextRequest } : "error");
  }
  function regenerate() {
    setRegenerationFailed(!available);
    if (available) setSnapshot(price);
  }
  return <div className={styles.renderLab} role="region" aria-label="同一票价在静态生成和请求时生成中的快照实验">
    <div className={styles.renderControls}>
      <label>数据源票价 <input type="number" aria-label="数据源票价" min="0" max="9999" value={price} onChange={event => setPrice(Math.max(0, Math.min(9999, Number(event.target.value))))} />元</label>
      <label><input type="checkbox" checked={available} onChange={event => setAvailable(event.target.checked)} />数据源可用</label>
      <button type="button" onClick={visit}><Receipt size={16} />再次访问</button>
    </div>
    <div className={styles.renderComparison}>
      <div className={styles.renderStaticPanel}>
        <div className={styles.renderPanelTitle}><Copy size={18} /><strong>SSG</strong><span>预先生成的副本</span></div>
        <div className={styles.renderStored}><span>可复用 HTML</span><b>¥{snapshot}</b><button type="button" onClick={regenerate}><Printer size={14} />重新生成</button></div>
        <div className={styles.renderTicket} key={`static-${request}`} aria-live="polite"><span>第 {staticResult !== "error" ? staticResult.request : request} 次访问得到</span><strong>¥{staticResult !== "error" ? staticResult.price : "—"}</strong><small>{regenerationFailed ? "再生成失败，保留旧副本" : "访问复用生成好的 HTML"}</small></div>
      </div>
      <div className={styles.renderServerPanel}>
        <div className={styles.renderPanelTitle}><Clock size={18} /><strong>SSR</strong><span>请求到达时生成</span></div>
        <div className={styles.renderRequestSlot}><Receipt size={24} /><span>每次访问读取数据源</span></div>
        <div className={styles.renderTicket} data-error={serverResult === "error"} key={`server-${request}`} aria-live="polite"><span>第 {serverResult !== "error" ? serverResult.request : request} 次访问得到</span>{serverResult === "error" ? <><WarningCircle size={28} /><strong>未生成新页面</strong><small>数据源不可用</small></> : <><strong>¥{serverResult.price}</strong><small>这次读取的票价写进 HTML</small></>}</div>
      </div>
    </div>
  </div>;
}

export function SsgSsrTermPage(_props: BespokeTermPageProps) {
  return <Article slug="ssg-ssr" title="静态生成与服务端渲染" subtitle="SSG / SSR · 页面是在什么时候做好的？" sources={ssgSsrSources} hero={<SsgSsrHero />} sections={[
    ["ssg-ssr-definition-section", "先把一张网页想成一份做好的 HTML"],
    ["ssg-ssr-time-section", "同一张票，两个生成时机"],
    ["ssg-ssr-update-section", "静态页怎样更新，失败时留下什么"],
    ["ssg-ssr-hydration-section", "能看见页面，为什么还点不动"],
    ["ssg-ssr-choice-section", "选时机之前，先分清内容给谁看"],
  ]} intro={<>活动介绍几天才改一次，账户余额却要看“这次是谁来访问”。它们都能由服务器做成网页，<strong>区别在于：先做好一份供大家复用，还是等这次请求来了再做。</strong></>}>
    <ArticleSection id="ssg-ssr-definition-section" title="先把一张网页想成一份做好的 HTML">
      <p>假设你在做一个活动网站，页面需要写出名称、日期和票价。数据库里只有数据，浏览器要收到一份带这些内容的 HTML，才能显示标题、段落和按钮。“生成页面”就是把数据填进页面结构，得到这份可交付的内容。</p>
      <p id="ssg-ssr-definition" className="vp-citation-target"><strong>SSG 是 Static Site Generation，静态站点生成；SSR 是 Server-side Rendering，服务端渲染。</strong>这里比较的是 HTML 的生成时机：SSG 先生成并保留可复用的结果，典型时机是构建发布；SSR 在请求到达后生成结果。两者的初始 HTML 都可由服务器交给浏览器。<Cite id="ssg-ssr-definition" sources={ssgSsrSources} /></p>
      <p>“静态”说的是已经生成的那份结果可以原样交付，不是页面不能有按钮；“服务端”说的是生成发生在服务器，不是所有按钮点击也必须在那里执行。</p>
    </ArticleSection>
    <ArticleSection id="ssg-ssr-time-section" title="同一张票，两个生成时机">
      <p id="ssg-ssr-static" className="vp-citation-target">早上 9 点构建时，票价是 80 元。SSG 把“票价 80 元”写进 HTML 并存下来。10 点有人来访问，服务可以直接交付这份副本，不必为了这个访客再把模板与数据拼一遍。公开说明、文章、帮助页常适合这种共享结果。<Cite id="ssg-ssr-static" sources={ssgSsrSources} /></p>
      <p id="ssg-ssr-request" className="vp-citation-target">SSR 把生成时机放到请求到达之后。若 10 点数据源的票价已改为 100 元，这次生成的 HTML 可以写入 100 元。需要登录身份、请求参数或实时查询结果的页面，也可以在这个阶段读取相应信息。这里假定数据读取成功且没有额外缓存，不能把 SSR 理解成“永远保证最新”。<Cite id="ssg-ssr-request" sources={ssgSsrSources} /></p>
      <p>把数据源票价改成 100，再点“再次访问”。看两张收据：SSG 仍交付旧副本，SSR 才重新读取。然后“重新生成”静态副本，再访问一次。这个教学实验把生成压成即时操作，保留的是生成时机与结果复用的差别。</p>
      <GenerationLab />
      <p>注意，“数据变了”“HTML 副本更新了”“访客拿到新 HTML 了”是三件事。改数据库并不会自动改写已生成文件；生成了新副本，也要到下一次交付时才会进入访客手里。</p>
    </ArticleSection>
    <ArticleSection id="ssg-ssr-update-section" title="静态页怎样更新，失败时留下什么">
      <p id="ssg-ssr-update" className="vp-citation-target">最直接的办法是重新构建发布。某些框架也允许只更新部分静态页，例如 Next.js 的增量静态再生成（ISR）：按时间或事件触发重新生成，让后续请求使用新结果。具体触发与生效时机取决于实现；定时到期不等于所有人立刻拿到新页面。<Cite id="ssg-ssr-update" sources={ssgSsrSources} /></p>
      <p id="ssg-ssr-failure" className="vp-citation-target">如果读取数据失败，新结果还不存在。在 Next.js 所描述的后台再生成机制中，失败时可继续保留上次成功生成的页面，并在后续请求重试。对请求时生成的页面，应用也要决定显示错误、降级内容还是重试。演示里关闭数据源，旧静态副本还在，SSR 这次不会凭空产生新票价。<Cite id="ssg-ssr-failure" sources={ssgSsrSources} /></p>
      <ArticleAside title="“有旧副本”也是一种取舍"><p>活动介绍晚一点更新，也许还能接受；售罄状态、付款金额或账户余额却不能随意拿旧值代替。旧页面保证可读，与交易是否允许继续，是两项不同的业务判断。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="ssg-ssr-hydration-section" title="能看见页面，为什么还点不动">
      <p id="ssg-ssr-hydration" className="vp-citation-target">一份 HTML 可以先显示内容。如果页面使用 React 等客户端框架，浏览器还需要下载并运行脚本，把组件逻辑接到已有 HTML 上，这常叫“水合”。所以“初始内容已经出现”和“交互已经就绪”有不同的时刻。客户端最初的结果应与服务端 HTML 对得上，否则可能出现水合错误。<Cite id="ssg-ssr-hydration" sources={ssgSsrSources} /></p>
      <p>SSG 或 SSR 都可以带客户端交互，也都可以只交付普通文档。不要把“预先生成”“请求时生成”“浏览器接上交互”捆成一个选择题：它们分别回答什么时候做内容、哪里做内容、谁处理之后的操作。</p>
    </ArticleSection>
    <ArticleSection id="ssg-ssr-choice-section" title="选时机之前，先分清内容给谁看">
      <p id="ssg-ssr-cache" className="vp-citation-target">缓存是另一个维度：保存一份响应，之后按规则复用。请求时生成的结果也可能被缓存；预先生成的结果也要定义何时过期。尤其是个人内容，不能因为用了 SSR 就假定不会被共享。缓存键、共享范围和响应头需要一起设计，避免把一个人的页面交给另一个人。<Cite id="ssg-ssr-cache" sources={ssgSsrSources} /></p>
      <p id="ssg-ssr-choice" className="vp-citation-target">为活动介绍选方案时，先问三件具体事：不同访客能否看同一份内容？允许旧多久？更新失败时能否保留上一版？账户余额则还需要身份与权限判断，不能共享一份写有个人数据的 HTML。一个网站可以混合使用这些策略，不必给所有页面贴同一个标签。<Cite id="ssg-ssr-choice" sources={ssgSsrSources} /></p>
      <p>让 AI 做这类页面，可以把要求写成：“活动说明可共享，修改后十分钟内更新；账户页按当前登录用户查询，不能进入公共缓存；数据源失败时明确提示。”这比一句“给我用 SSR”更能规定读者最终看到什么。</p>
    </ArticleSection>
  </Article>;
}
