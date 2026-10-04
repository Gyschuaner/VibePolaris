"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Globe, Pause, Play, ShieldCheck, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { corsSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "同源直读", request: "GET /orders", gate: "same-origin", response: "200 · script readable", note: "页面和接口处在同一个 origin，浏览器不需要 CORS 许可头来开放脚本读取。" },
  { label: "跨源发起", request: "GET https://api.example/orders", gate: "Origin: app.example", response: "等待检查", note: "跨源的关键不是域名长得像不像，而是 scheme、host、port 的 origin 是否不同。" },
  { label: "OPTIONS 预检", request: "OPTIONS · PATCH · X-Trace", gate: "Access-Control-Request-*", response: "等待许可", note: "非简单请求先询问服务器允许的方法和请求头，正式 PATCH 还没有出发。" },
  { label: "许可通过", request: "PATCH /orders/7", gate: "ACAO + ACAM + ACAH", response: "200 · script readable", note: "预检和正式响应都满足规则，浏览器才把响应交给页面脚本。" },
  { label: "响应到达但不可读", request: "GET /orders", gate: "缺 Access-Control-Allow-Origin", response: "200 · script blocked", note: "服务器可能已经返回 200，浏览器仍会把脚本读取挡住；网络到达和脚本可见是两件事。" },
  { label: "凭据配置冲突", request: "credentials: include", gate: "ACAO: *", response: "CORS error", note: "带凭据时不能用通配来源代替明确授权；浏览器会在读取闸门处拒绝这份响应。" },
];

function CorsHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const failed = scene.step === 4 || scene.step === 5;
  return <figure ref={scene.ref} className={styles.corsHero} data-step={scene.step} aria-label="CORS 跨源请求经过浏览器预检和响应读取闸门">
    <div className={styles.corsTop}><span>页面 origin → API origin · 浏览器是执行闸门</span><strong>{current.label}</strong></div>
    <div className={styles.corsStage}>
      <div className={styles.corsOrigin}><Globe size={25} aria-hidden="true" /><span>页面脚本</span><strong>app.example</strong><small>{current.request}</small></div>
      <ArrowRight className={styles.corsArrow} size={20} aria-hidden="true" />
      <div className={styles.corsBrowser}><ShieldCheck size={25} aria-hidden="true" /><span>浏览器 CORS</span><strong>{current.gate}</strong><small>{scene.step === 2 ? "OPTIONS" : "检查响应"}</small></div>
      <ArrowRight className={styles.corsArrow} size={20} aria-hidden="true" />
      <div className={styles.corsResult} data-failed={failed}><>{failed ? <WarningCircle size={25} aria-hidden="true" /> : <CheckCircle size={25} aria-hidden="true" />}</><span>脚本看到</span><strong>{current.response}</strong></div>
    </div>
    <div className={styles.corsEvidence} aria-live="polite"><Stack size={20} aria-hidden="true" /><p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.corsTimeline} role="group" aria-label="CORS 请求步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.corsControls} role="group" aria-label="控制 CORS 演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type CorsMode = "simple" | "preflight" | "missing" | "credentials";

function CorsLab() {
  const [mode, setMode] = useState<CorsMode>("simple");
  const cases = {
    simple: { label: "简单 GET", request: "GET · no custom header", steps: "正式请求 → 响应", result: "脚本可读", note: "跨源仍要看响应许可头，但这类请求不先发 CORS 预检。" },
    preflight: { label: "PATCH + X-Trace", request: "OPTIONS → PATCH", steps: "预检通过 → 正式请求", result: "脚本可读", note: "服务器要同时允许来源、方法和请求头，浏览器才放行正式请求。" },
    missing: { label: "缺 ACAO", request: "GET · server returns 200", steps: "响应到达浏览器", result: "脚本不可读", note: "CORS 主要限制浏览器脚本读取；命令行客户端没有这道浏览器闸门。" },
    credentials: { label: "凭据 + *", request: "credentials: include", steps: "ACAO: *", result: "配置错误", note: "带凭据时要给明确来源，通配符不能替代这项许可。" },
  } satisfies Record<CorsMode, { label: string; request: string; steps: string; result: string; note: string }>;
  const current = cases[mode];
  return <div className={styles.corsLab} role="region" aria-label="CORS 请求与响应读取演示">
    <div className={styles.corsLabHead}><div><span>只切换请求条件和响应许可</span><strong>网络到达后，脚本能不能读到</strong></div><span>{current.label}</span></div>
    <div className={styles.corsLabBoard}><div className={styles.corsLabNode}><Globe size={21} aria-hidden="true" /><span>请求</span><code>{current.request}</code></div><ArrowRight className={styles.corsArrow} size={19} aria-hidden="true" /><div className={styles.corsLabNode}><ShieldCheck size={21} aria-hidden="true" /><span>浏览器步骤</span><strong>{current.steps}</strong></div><ArrowRight className={styles.corsArrow} size={19} aria-hidden="true" /><div className={styles.corsLabNode}>{mode === "missing" || mode === "credentials" ? <WarningCircle size={21} aria-hidden="true" /> : <CheckCircle size={21} aria-hidden="true" />}<span>脚本</span><strong>{current.result}</strong></div></div>
    <div className={styles.corsLabResult} data-failed={mode === "missing" || mode === "credentials"}><p><strong>读取结果</strong>{current.note}</p></div>
    <div className={styles.corsLabControls} role="group" aria-label="选择 CORS 案例">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as CorsMode)}>{item.label}</button>)}</div>
  </div>;
}

export function CorsTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={corsSources} />;
  return <ConceptArticle slug="cors" title="跨源资源共享" subtitle="CORS · 服务器许可，浏览器决定脚本能否读取" sources={corsSources} sections={[["cors-origin-section", "跨源到底差在哪里"], ["cors-preflight-section", "什么时候要先发 OPTIONS"], ["cors-exposure-section", "响应到了，脚本为什么还看不到"], ["cors-boundary-section", "CORS 管不到什么"]]} hero={<CorsHero />} intro={<>命令行能拿到接口响应，页面脚本却报 CORS 错误，这不是服务器把请求吞了。浏览器先判断 origin，再按请求类型决定是否预检，最后依据响应里的许可头决定要不要把结果交给脚本。</>}>
    <ArticleSection id="cors-origin-section" title="跨源到底差在哪里">
      <p id="cors-origin" className="vp-citation-target">origin 由 scheme、host 和 port 共同组成。页面从 app.example 访问 api.example，即使两个地址属于同一家公司，也已经是跨源请求，浏览器会把 Origin 交给 CORS 规则判断。<Cite id="cors-origin" /></p>
      <p id="cors-opt-in" className="vp-citation-target">CORS 是服务器通过响应头向浏览器表达的许可机制。它不会把两个 origin 变成同源，也不会让其他网络客户端自动获得同样的浏览器读取限制。<Cite id="cors-opt-in" /></p>
      <CorsLab />
    </ArticleSection>
    <ArticleSection id="cors-preflight-section" title="什么时候要先发 OPTIONS">
      <p id="cors-preflight" className="vp-citation-target">非简单请求，例如带自定义头的 PATCH，浏览器会先发 OPTIONS 预检，询问目标服务器允许哪些方法和请求头。预检通过后，正式请求才会出发；简单 GET 则不一定走这一步。<Cite id="cors-preflight" /><Cite id="cors-max-age" /></p>
      <p id="cors-credentials" className="vp-citation-target">带凭据时，服务器要返回明确的允许来源，并正确处理 Access-Control-Allow-Credentials；`Access-Control-Allow-Origin: *` 不能与凭据模式混用。<Cite id="cors-credentials" /></p>
    </ArticleSection>
    <ArticleSection id="cors-exposure-section" title="响应到了，脚本为什么还看不到">
      <p id="cors-response" className="vp-citation-target">正式请求的响应到达后，浏览器主要依据 Access-Control-Allow-Origin，以及需要时的 Access-Control-Expose-Headers，决定响应能否交给页面脚本。允许方法和请求头属于前一阶段的预检检查，已经在正式请求出发前完成；这里失败时服务器可能已经处理请求，脚本仍只能看到 CORS 错误。<Cite id="cors-response" /></p>
      <p id="cors-exposure" className="vp-citation-target">“网络面板里有 200”与“fetch 能读到 body”是两件事。CORS 解决的是浏览器脚本读取边界，不是身份认证、业务授权或服务器防火墙。<Cite id="cors-exposure" /></p>
    </ArticleSection>
    <ArticleSection id="cors-boundary-section" title="CORS 管不到什么">
      <p id="cors-failure" className="vp-citation-target">缺少匹配的 Access-Control-Allow-Origin 时，浏览器会把响应挡在脚本外；命令行、服务器到服务器的请求没有同一套脚本读取闸门。修复应从服务器许可头、请求模式和凭据设置入手，不要用关闭浏览器安全策略绕过。<Cite id="cors-failure" /></p>
      <p id="cors-vary" className="vp-citation-target">如果服务器按 Origin 返回不同内容，缓存还要正确处理 Vary: Origin，避免把一个来源的许可响应复用给另一个来源。<Cite id="cors-vary" /></p>
      <p>排查时记录页面 origin、目标 URL、请求方法、非简单请求头、是否带凭据、预检响应和正式响应的许可头。先判断请求有没有出发，再判断响应有没有对脚本开放。</p>
    </ArticleSection>
  </ConceptArticle>;
}
