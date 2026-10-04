"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Code, Globe, Hash, LinkSimple, MagnifyingGlass, MapPinLine, Pause, Play, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { urlSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const rawUrl = "https://user:secret@example.com:8443/a/../b?q=x%2Fy#part";

const tokens = [
  { key: "scheme", label: "scheme", value: "https://" },
  { key: "authority", label: "authority", value: "user:secret@example.com:8443" },
  { key: "path", label: "path", value: "/a/../b" },
  { key: "query", label: "query", value: "?q=x%2Fy" },
  { key: "fragment", label: "fragment", value: "#part" },
];

const frames = [
  {
    label: "先拆出地址骨架",
    result: "5 个组件各就各位",
    active: ["scheme", "authority", "path", "query", "fragment"],
    parsed: ["scheme = https", "host = example.com", "port = 8443", "path = /a/../b", "query = q=x%2Fy", "fragment = part"],
    target: "还没形成请求目标",
    note: "URL 先被读成一组有边界的字段；userinfo、主机和端口都在 authority 里，不能把整条地址当一串模糊文字。",
  },
  {
    label: "路径把 .. 折回去",
    result: "/a/../b → /b",
    active: ["path"],
    parsed: ["scheme = https", "host = example.com", "port = 8443", "path = /b", "query = q=x%2Fy", "fragment = part"],
    target: "归一后的路径：/b",
    note: "解析器按路径段处理点段；a/.. 抵消成 /b，查询里的 %2F 仍是查询值的一部分，不会被当成路径斜杠。",
  },
  {
    label: "请求线在 # 前停下",
    result: "GET /b?q=x%2Fy",
    active: ["query", "fragment"],
    parsed: ["scheme = https", "host = example.com", "port = 8443", "path = /b", "query = q=x%2Fy", "fragment = client only"],
    target: "GET /b?q=x%2Fy",
    note: "fragment 给浏览器做页内定位，不进入 HTTP 请求目标；服务器收到的是 Host 和路径、查询，不是 #part。",
  },
];

const scenarios = [
  {
    label: "拆组件",
    input: rawUrl,
    middle: ["scheme  https", "host    example.com", "port    8443", "path    /a/../b", "query   q=x%2Fy", "fragment part"],
    output: "字段边界清楚",
    good: true,
    note: "先知道每一段是谁，后面才谈连接主机、请求资源或页面内定位。",
  },
  {
    label: "归一路径",
    input: "https://example.com/a/../b",
    middle: ["base path  /a/../b", "点段      a/..", "保留      b"],
    output: "/b",
    good: true,
    note: "相对路径合并和点段移除是解析动作，不是把字符串里的字符随便删掉。",
  },
  {
    label: "发出请求",
    input: rawUrl,
    middle: ["Host: example.com:8443", "request-target", "GET /b?q=x%2Fy"],
    output: "服务器收到请求目标",
    good: true,
    note: "HTTP/1.1 的 origin-form 把路径和查询放进 request-target，Host 单独带上 authority；#part 不在其中。",
  },
  {
    label: "相对引用 ../c",
    input: "base: https://example.com/a/b/ + ../c",
    middle: ["取基准目录  /a/b/", "退一层    /a/", "接上      c"],
    output: "https://example.com/a/c",
    good: true,
    note: "相对引用必须有基准 URL；同一个 ../c 换一条基准，得到的绝对 URL 也会换。",
  },
];

function UrlHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.urlHero} data-step={scene.step} aria-label="URL 从组件解析到 HTTP 请求目标的过程">
    <div className={styles.urlHeroTop}><span>同一条地址 · 解析器逐步接手</span><strong>{current.result}</strong></div>
    <div className={styles.urlHeroStage}>
      <div className={styles.urlAddressCard}>
        <div className={styles.urlCardHeading}><LinkSimple size={21} aria-hidden="true" /><span>原始 URL</span></div>
        <code className={styles.urlRaw}>{tokens.map(token => <span key={token.key} data-active={current.active.includes(token.key)} data-token={token.key}>{token.value}</span>)}</code>
        <small>浏览器拿到的是一整条引用</small>
      </div>
      <ArrowRight className={styles.urlArrow} size={22} aria-hidden="true" />
      <div className={styles.urlParserCard}>
        <div className={styles.urlCardHeading}><MagnifyingGlass size={21} aria-hidden="true" /><span>URL 解析器</span></div>
        <div className={styles.urlFields}>{current.parsed.map(field => <code key={field} data-active={field.includes("path") && scene.step === 1 || field.includes("fragment") && scene.step === 2}>{field}</code>)}</div>
      </div>
      <ArrowRight className={styles.urlArrow} size={22} aria-hidden="true" />
      <div className={styles.urlTargetCard} data-ready={scene.step === 2}>
        <div className={styles.urlCardHeading}><Globe size={21} aria-hidden="true" /><span>实际请求</span></div>
        <code>{current.target}</code>
        <span className={styles.urlFragmentProof}><Hash size={16} aria-hidden="true" />#part <small>仅留在客户端</small></span>
      </div>
    </div>
    <div className={styles.urlEvidence}><MapPinLine size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.urlTimeline} role="group" aria-label="URL 首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.urlControls} role="group" aria-label="控制 URL 原理演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停 URL 原理演示" : "播放 URL 原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function UrlLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  return <div className={styles.urlLab} role="region" aria-label="URL 解析与请求目标实验">
    <div className={styles.urlLabHeader}><div><span>别猜服务器看到了什么</span><strong>把输入、解析和证据排成一条线</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.urlLabPath}>
      <div className={styles.urlLabNode}><Code size={19} aria-hidden="true" /><span>输入</span><code>{current.input}</code></div><ArrowRight className={styles.urlArrow} size={18} aria-hidden="true" />
      <div className={styles.urlLabNode}><MagnifyingGlass size={19} aria-hidden="true" /><span>解析动作</span><div>{current.middle.map(item => <code key={item}>{item}</code>)}</div></div><ArrowRight className={styles.urlArrow} size={18} aria-hidden="true" />
      <div className={styles.urlLabNode} data-good={current.good}><CheckCircle size={19} aria-hidden="true" /><span>可观察结果</span><strong>{current.output}</strong></div>
    </div>
    <div className={styles.urlLabEvidence}><WarningCircle size={19} aria-hidden="true" /><p><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.urlLabControls} role="group" aria-label="选择 URL 处理样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function UrlTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={urlSources} />;
  return <ConceptArticle slug="url" title="URL" subtitle="Uniform Resource Locator · 一条会被解析的资源引用" sources={urlSources} sections={[["url-shape", "一条地址先拆开"], ["url-normalize", "路径不是字符串拼接"], ["url-request", "发给服务器的目标更短"], ["url-base", "相对引用要有基准"]]} hero={<UrlHero />} intro={<>你在地址栏里看到的是一条文字，浏览器眼里却是一张有边界的地图。<strong>URL 先拆组件、再归一路径，最后才决定要发给服务器什么。</strong><Cite id="url-components" /></>}>
    <ArticleSection id="url-shape" title="一条地址先拆开">
      <p id="url-components" className="vp-citation-target">URL 的语法把引用拆成 scheme、authority、path、query 和 fragment。authority 还可以继续分出 userinfo、host 与 port；这些字段各自有边界，不能靠“看起来像域名”来猜。<Cite id="url-components" /></p>
      <p id="url-identity" className="vp-citation-target">URL 解决的是“怎样定位或访问这个资源”的表达问题，不是资源本身，也不是一次已经成功的请求。地址写得合法，只说明解析器能理解它；主机是否存在、服务是否响应，还要到后面的网络步骤才知道。<Cite id="url-identity" /></p>
      <UrlLab />
    </ArticleSection>
    <ArticleSection id="url-normalize" title="路径不是字符串拼接">
      <p id="url-percent" className="vp-citation-target">百分号编码让保留字符可以作为数据出现。示例里的 <code>%2F</code> 是 query 的值，不会突然变成 path 的斜杠；解析时要保留组件边界，再按该组件的规则解释内容。<Cite id="url-percent" /></p>
      <p id="url-relative" className="vp-citation-target">路径中的点段有明确的移除规则：<code>/a/../b</code> 先回退到 <code>/a/</code>，最后得到 <code>/b</code>。这一步是在做路径解析，不是对字符串做一次盲目替换；相对引用也会沿用同一套基准合并规则。<Cite id="url-relative" /></p>
    </ArticleSection>
    <ArticleSection id="url-request" title="发给服务器的目标更短">
      <p id="url-request-target" className="vp-citation-target">HTTP/1.1 的 origin-form 请求目标由绝对路径和可选 query 组成，Host 则单独携带 authority。对示例 URL 来说，服务器看到的是 <code>Host: example.com:8443</code> 与 <code>GET /b?q=x%2Fy</code>，不是整条浏览器地址。<Cite id="url-request-target" /></p>
      <p id="url-fragment" className="vp-citation-target">fragment 在解析和取得资源之后交给客户端处理，常用于页面内定位；HTTP 方案本身不把它定义成请求目标的一部分。因此日志里找不到 <code>#part</code>，并不表示浏览器丢了它，而是它根本没有沿 HTTP 请求线发出去。<Cite id="url-fragment" /></p>
    </ArticleSection>
    <ArticleSection id="url-base" title="相对引用要有基准">
      <p id="url-base-reference" className="vp-citation-target">像 <code>../c</code> 这样的相对引用没有自己的主机和 scheme，解析器必须拿当前文档或调用方给出的 base URL 来合并。base 是 <code>https://example.com/a/b/</code> 时，结果是 <code>https://example.com/a/c</code>；换一个 base，结果也会换。<Cite id="url-base" /></p>
      <p>排查 URL 时，把原始字符串、解析后的字段、归一后的路径和实际 request-target 放在同一张记录里。这样看到“页面定位失效”时，才分得清是 fragment 处理、相对路径基准，还是服务器根本没有收到你以为发送的那一段。</p>
    </ArticleSection>
  </ConceptArticle>;
}
