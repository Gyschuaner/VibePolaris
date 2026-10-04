"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Clock, Code, Funnel, Globe, HardDrives, Pause, Play, Radio, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { cacheControlSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "响应先过存储闸门",
    result: "STORE · max-age=60",
    request: "GET /app.js",
    policy: "Cache-Control: max-age=60",
    cache: "空 → 写入 v1",
    age: "0s",
    origin: "200 · ETag \"v1\"",
    note: "Cache-Control 先告诉缓存能不能留下这份响应；写入发生在响应回来之后，尚未有命中可谈。",
    active: [0, 1],
  },
  {
    label: "新鲜时直接复用",
    result: "HIT · fresh",
    request: "GET /app.js",
    policy: "max-age=60",
    cache: "返回 v1",
    age: "25s / 60s",
    origin: "不回源",
    note: "Age 还没超过 freshness lifetime，缓存可以直接把 v1 交给客户端；源站这一轮完全没有被问到。",
    active: [1, 2],
  },
  {
    label: "过期后只验证一遍",
    result: "304 · reuse body",
    request: "GET /app.js",
    policy: "Age 61s · If-None-Match: \"v1\"",
    cache: "保留 body · age 0s",
    age: "stale",
    origin: "304 Not Modified",
    note: "过期不等于必须重传整份内容；缓存带着验证器询问，源站说没变，就能更新元数据后继续用原 body。",
    active: [0, 1, 2],
  },
  {
    label: "用户资料挡住共享缓存",
    result: "PRIVATE · no-store",
    request: "GET /me",
    policy: "Cache-Control: private, no-store",
    cache: "shared cache · BLOCKED",
    age: "—",
    origin: "200 · user=7",
    note: "用户资料可以被当前浏览器处理，但 no-store 要求不要留下存储副本；shared cache 不能把 user=7 给下一个人。",
    active: [0, 2],
  },
];

const scenarios = [
  {
    label: "max-age · 新鲜命中",
    request: "GET /app.js",
    header: "max-age=60",
    cache: "age 25 · fresh",
    origin: "不访问源站",
    result: "直接返回 v1",
    status: "ok",
    note: "新鲜度窗口内，缓存可以复用之前的响应。max-age 管的是响应的新鲜时间，不是请求超时。",
  },
  {
    label: "no-cache · 仍然会存",
    request: "GET /profile",
    header: "no-cache, ETag=\"p7\"",
    cache: "有副本 · 每次验证",
    origin: "304 Not Modified",
    result: "复用旧 body",
    status: "ok",
    note: "no-cache 允许保存，但每次使用前要验证；304 没有新的 body，缓存更新 Age 等元数据后继续交付。",
  },
  {
    label: "no-store · 不留下副本",
    request: "GET /account",
    header: "private, no-store",
    cache: "shared cache · empty",
    origin: "200 · user=7",
    result: "只给这次请求",
    status: "blocked",
    note: "no-store 是存储闸门，不是‘把内容加密’；响应回来仍要能用，只是缓存不能把它保存下来。",
  },
  {
    label: "stale-while-revalidate",
    request: "GET /news",
    header: "max-age=60, stale-while-revalidate=30",
    cache: "age 70 · stale",
    origin: "后台验证 v2",
    result: "先给 v1，再更新",
    status: "stale",
    note: "在额外 30 秒窗口内，缓存可以先交付旧响应，同时在后台验证；这不是把 stale 永久当 fresh。",
  },
  {
    label: "stale-if-error",
    request: "GET /status",
    header: "max-age=60, stale-if-error=120",
    cache: "age 90 · origin 503",
    origin: "503 · error",
    result: "回退到旧 200",
    status: "fallback",
    note: "只有遇到允许的错误并且仍在窗口内，缓存才可以用旧成功响应顶住故障；Age 仍应暴露它已经 stale。",
  },
];

function CacheControlHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.cacheControlHero} data-step={scene.step} aria-label="Cache-Control 从存储、命中到重新验证的过程">
    <div className={styles.cacheControlHeroTop}><span>一份响应 · 穿过存储闸门和时间窗</span><strong>{current.result}</strong></div>
    <div className={styles.cacheControlHeroStage}>
      <div className={styles.cacheControlResponseCard} data-active={current.active.includes(0)}>
        <div className={styles.cacheControlCardHeading}><Radio size={21} aria-hidden="true" /><span>响应从源站回来</span></div>
        <code>{current.request}</code>
        <code>{current.policy}</code>
        <small>{current.origin}</small>
      </div>
      <ArrowRight className={styles.cacheControlArrow} size={22} aria-hidden="true" />
      <div className={styles.cacheControlGateCard} data-active={current.active.includes(1)}>
        <div className={styles.cacheControlCardHeading}><Funnel size={21} aria-hidden="true" /><span>缓存闸门</span></div>
        <strong>{current.cache}</strong>
        <div className={styles.cacheControlClock}><Clock size={17} aria-hidden="true" /><span>Age</span><code>{current.age}</code></div>
      </div>
      <ArrowRight className={styles.cacheControlArrow} size={22} aria-hidden="true" />
      <div className={styles.cacheControlResultCard} data-active={current.active.includes(2)}>
        <div className={styles.cacheControlCardHeading}><HardDrives size={21} aria-hidden="true" /><span>客户端看到</span></div>
        <strong>{current.result}</strong>
        <small>{current.origin}</small>
      </div>
    </div>
    <div className={styles.cacheControlEvidence}><Globe size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.cacheControlTimeline} role="group" aria-label="Cache-Control 首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.cacheControlControls} role="group" aria-label="控制 Cache-Control 原理演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停 Cache-Control 原理演示" : "播放 Cache-Control 原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function CacheControlLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  const Icon = current.status === "ok" ? CheckCircle : current.status === "blocked" ? XCircle : current.status === "fallback" ? WarningCircle : ShieldCheck;
  return <div className={styles.cacheControlLab} role="region" aria-label="Cache-Control 指令实验">
    <div className={styles.cacheControlLabHeader}><div><span>同一个“缓存了”其实有几种结果</span><strong>把指令、年龄和回源证据放在一起</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.cacheControlLabPath}>
      <div className={styles.cacheControlLabNode}><Code size={19} aria-hidden="true" /><span>响应指令</span><code>{current.request}</code><code>{current.header}</code></div><ArrowRight className={styles.cacheControlArrow} size={18} aria-hidden="true" />
      <div className={styles.cacheControlLabNode}><Clock size={19} aria-hidden="true" /><span>缓存状态</span><code>{current.cache}</code><code>{current.origin}</code></div><ArrowRight className={styles.cacheControlArrow} size={18} aria-hidden="true" />
      <div className={styles.cacheControlLabNode} data-status={current.status}><span>可观察结果</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.cacheControlLabEvidence} data-status={current.status}><Icon size={20} aria-hidden="true" /><p><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.cacheControlLabControls} role="group" aria-label="选择 Cache-Control 样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function CacheControlTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={cacheControlSources} />;
  return <ConceptArticle slug="cache-control" title="缓存控制" subtitle="Cache-Control · 写给缓存看的行为指令" sources={cacheControlSources} sections={[["cache-control-directives", "指令管的是缓存行为"], ["cache-control-freshness", "新鲜度是一扇时间门"], ["cache-control-validation", "过期后可以只验证"], ["cache-control-shared", "个人缓存和共享缓存分开"], ["cache-control-stale", "过期容错是额外授权"]]} hero={<CacheControlHero />} intro={<>响应头里写着 <code>Cache-Control</code>，它不是内容说明，而是沿请求链传给缓存的行为指令。<strong>同一份响应，能不能存、什么时候直接复用、何时必须回源，都由这些指令和缓存状态一起决定。</strong><Cite id="cache-control-store" /></>}>
    <ArticleSection id="cache-control-directives" title="指令管的是缓存行为">
      <p id="cache-control-store" className="vp-citation-target"><code>Cache-Control</code> 列出缓存可以理解的 directives，例如 <code>max-age</code>、<code>no-cache</code>、<code>no-store</code>、<code>private</code> 和 <code>s-maxage</code>。它管的是存储和复用条件，不能把一张用户资料变成公开内容，也不能替源站决定业务权限。<Cite id="cache-control-store" /></p>
      <p id="cache-control-method" className="vp-citation-target">缓存先要看请求方法和目标 URI。GET 响应通常可以被缓存，POST 则要遵守资源自己的语义；即使 URL 一样，方法、请求字段或响应里的 <code>Vary</code> 也可能让两个请求不能共用同一份副本。<Cite id="cache-control-method" /></p>
      <CacheControlLab />
    </ArticleSection>
    <ArticleSection id="cache-control-freshness" title="新鲜度是一扇时间门">
      <p id="cache-control-fresh" className="vp-citation-target"><code>max-age=60</code> 表示响应的 freshness lifetime 可以是 60 秒。缓存用响应年龄 <code>Age</code> 和这段时间比较：还新鲜就能直接答，过期后要验证或重新取回。它控制缓存的时间窗口，不是让服务器 60 秒后关闭。<Cite id="cache-control-fresh" /></p>
      <p id="cache-control-key" className="vp-citation-target">缓存键至少要考虑请求方法和目标 URI；响应写了 <code>Vary: Accept-Language</code> 时，还要把被点名的请求字段纳入匹配。只看到“命中”两个字，无法证明这份响应适合当前用户和当前请求。<Cite id="cache-control-key" /></p>
    </ArticleSection>
    <ArticleSection id="cache-control-validation" title="过期后可以只验证">
      <p id="cache-control-validate" className="vp-citation-target"><code>no-cache</code> 不是 <code>no-store</code>。前者允许缓存保存副本，但复用前必须向源站验证；缓存可以带着 <code>If-None-Match</code> 发送验证，源站返回 <code>304 Not Modified</code> 时，旧 body 仍能留下，只更新响应元数据。<Cite id="cache-control-validate" /></p>
      <p id="cache-control-vary" className="vp-citation-target">验证解决的是“这份副本还代表当前资源吗”，不负责重新判断用户权限。<code>ETag</code> 是表示的验证器，<code>Vary</code> 是选择缓存副本的条件；二者都不能替代应用层的身份和授权检查。<Cite id="cache-control-vary" /></p>
    </ArticleSection>
    <ArticleSection id="cache-control-shared" title="个人缓存和共享缓存分开">
      <p id="cache-control-shared-detail" className="vp-citation-target">浏览器常有 private cache，CDN 或代理常是 shared cache。<code>private</code> 可以阻止共享缓存保存响应，<code>s-maxage</code> 则只给共享缓存另设新鲜时间；带 <code>Authorization</code> 的请求也有额外的共享复用限制。<Cite id="cache-control-shared-detail" /></p>
      <p id="cache-control-immutable" className="vp-citation-target">带内容哈希的静态文件常见 <code>immutable</code>：在 freshness lifetime 内，客户端不必因为普通刷新再发条件请求。它只在新鲜期间生效，过期后仍要按普通规则验证，不能被理解成“永远不更新”。<Cite id="cache-control-immutable" /></p>
    </ArticleSection>
    <ArticleSection id="cache-control-stale" title="过期容错是额外授权">
      <p id="cache-control-stale-detail" className="vp-citation-target"><code>stale-while-revalidate=30</code> 允许缓存进入过期后的短窗口：先把旧响应交给客户端，同时在后台验证。窗口结束后，下一次请求仍要按正常流程处理；旧内容只是被明确授权多留一会儿。<Cite id="cache-control-stale" /></p>
      <p id="cache-control-error" className="vp-citation-target"><code>stale-if-error=120</code> 针对的是回源遇到错误的情况，允许在额外窗口里返回旧成功响应。它改善的是故障时的可用性，也把旧内容继续暴露的风险交给了发布者；不要把它当成“缓存永远优先”。<Cite id="cache-control-error" /></p>
    </ArticleSection>
  </ConceptArticle>;
}
