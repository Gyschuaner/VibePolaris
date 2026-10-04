"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Key, Pause, Play, ShieldCheck, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { cookieSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const cookieRows = [
  { id: "session", label: "session=R7", attrs: "Path=/account · Secure · HttpOnly · SameSite=Lax" },
  { id: "prefs", label: "prefs=dark", attrs: "Path=/ · Secure · SameSite=Lax" },
  { id: "legacy", label: "legacy=1", attrs: "Path=/legacy · Secure" },
];

const frames = [
  { label: "Set-Cookie 写入", context: "响应来自 app.example", selected: [], sent: "Cookie 罐新增 session=R7", script: "等待请求", note: "服务器只能通过 Set-Cookie 提交一条候选；浏览器先把属性和它一起存进 Cookie 罐。" },
  { label: "同站 HTTPS", context: "GET https://app.example/account", selected: ["session", "prefs"], sent: "session=R7; prefs=dark", script: "脚本看不到 session", note: "域名、Path、Secure 和 SameSite 都匹配，HttpOnly 的 session 仍会随网络请求发送。" },
  { label: "路径换了", context: "GET https://app.example/public", selected: ["prefs"], sent: "prefs=dark", script: "session 留在罐中", note: "session 的 Path=/account 不匹配；它不会被删掉，只是不进入这次请求头。" },
  { label: "跨站 POST", context: "POST https://app.example/account ← news.example", selected: [], sent: "没有会话 Cookie", script: "脚本仍不能读取 HttpOnly", note: "SameSite=Lax 会限制这类跨站请求携带会话 Cookie；它是发送条件，不是加密层。" },
  { label: "降到 HTTP", context: "GET http://app.example/account", selected: [], sent: "Secure Cookie 不发送", script: "脚本读取规则不变", note: "Secure 把发送条件绑到 HTTPS；改成 HTTP 后，Cookie 仍在罐中，但不能上这条线。" },
  { label: "脚本来读取", context: "document.cookie", selected: ["prefs"], sent: "网络请求仍可带 session", script: "prefs=dark · session 不可见", note: "HttpOnly 只收起脚本窗口，不会让符合条件的网络请求失去 session。" },
];

function CookieRows({ selected, hidden }: { selected: string[]; hidden?: string[] }) {
  return <div className={styles.cookieJar} aria-label="浏览器 Cookie 罐">{cookieRows.map((row) => <div key={row.id} className={styles.cookieRow} data-selected={selected.includes(row.id)} data-hidden={hidden?.includes(row.id) ?? false}><Key size={18} aria-hidden="true" /><div><strong>{row.label}</strong><small>{row.attrs}</small></div><span>{hidden?.includes(row.id) ? "脚本不可见" : selected.includes(row.id) ? "本次命中" : "留在罐中"}</span></div>)}</div>;
}

function CookieHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const scriptHidden = scene.step === 5 ? ["session"] : [];
  const selected = current.selected;
  return <figure ref={scene.ref} className={styles.cookieHero} data-step={scene.step} aria-label="Cookie 罐按请求域名路径和安全属性筛选发送">
    <div className={styles.cookieTop}><span>浏览器 Cookie 罐 · 候选不会自动全部出门</span><strong>{current.label}</strong></div>
    <div className={styles.cookieStage}>
      <div className={styles.cookieBrowser}><ShieldCheck size={25} aria-hidden="true" /><span>浏览器</span><strong>Cookie 罐</strong><small>{current.context}</small><CookieRows selected={selected} hidden={scriptHidden} /></div>
      <ArrowRight className={styles.cookieArrow} size={20} aria-hidden="true" />
      <div className={styles.cookieFilter}><Stack size={24} aria-hidden="true" /><span>逐项检查</span><strong>Domain · Path · Secure · SameSite</strong><small>{scene.step === 0 ? "保存属性" : scene.step === 5 ? "脚本读取权限" : "请求上下文"}</small></div>
      <ArrowRight className={styles.cookieArrow} size={20} aria-hidden="true" />
      <div className={styles.cookieRequest} data-empty={selected.length === 0}><Key size={25} aria-hidden="true" /><span>{scene.step === 5 ? "document.cookie" : "Cookie 请求头"}</span><strong>{current.sent}</strong><small>{current.script}</small></div>
    </div>
    <div className={styles.cookieEvidence} aria-live="polite"><Stack size={20} aria-hidden="true" /><p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.cookieTimeline} role="group" aria-label="Cookie 筛选步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.cookieControls} role="group" aria-label="控制 Cookie 演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type CookieMode = "account" | "public" | "cross" | "script";

function CookieLab() {
  const [mode, setMode] = useState<CookieMode>("account");
  const cases = {
    account: { label: "同站 HTTPS /account", context: "GET https://app.example/account", selected: ["session", "prefs"], result: "session=R7; prefs=dark", note: "Path、Secure 和 SameSite 都满足；HttpOnly 只影响脚本窗口。" },
    public: { label: "同站 HTTPS /public", context: "GET https://app.example/public", selected: ["prefs"], result: "prefs=dark", note: "session 留在浏览器，但 Path=/account 把它挡在这次请求外。" },
    cross: { label: "跨站 POST", context: "POST ← news.example", selected: [], result: "没有会话 Cookie", note: "SameSite=Lax 限制跨站 POST 的携带；要设计跨站流程，还要单独考虑 CSRF 防护。" },
    script: { label: "脚本读取", context: "document.cookie", selected: ["prefs"], result: "prefs=dark", note: "session 的 HttpOnly 属性让它不出现在 document.cookie，但网络请求仍可携带。" },
  } satisfies Record<CookieMode, { label: string; context: string; selected: string[]; result: string; note: string }>;
  const current = cases[mode];
  return <div className={styles.cookieLab} role="region" aria-label="Cookie 属性筛选演示">
    <div className={styles.cookieLabHead}><div><span>只改变请求上下文</span><strong>看看哪一行 Cookie 会跟着走</strong></div><span>{current.label}</span></div>
    <div className={styles.cookieLabBoard}><div className={styles.cookieLabNode}><Key size={21} aria-hidden="true" /><span>Cookie 罐</span><code>session · prefs · legacy</code></div><ArrowRight className={styles.cookieArrow} size={19} aria-hidden="true" /><div className={styles.cookieLabNode}><Stack size={21} aria-hidden="true" /><span>当前条件</span><strong>{current.context}</strong></div><ArrowRight className={styles.cookieArrow} size={19} aria-hidden="true" /><div className={styles.cookieLabNode}>{current.selected.length ? <CheckCircle size={21} aria-hidden="true" /> : <WarningCircle size={21} aria-hidden="true" />}<span>结果</span><strong>{current.result}</strong></div></div>
    <div className={styles.cookieLabRows}><CookieRows selected={current.selected} hidden={mode === "script" ? ["session"] : []} /></div>
    <div className={styles.cookieLabResult} data-empty={!current.selected.length}><p><strong>筛选结果</strong>{current.note}</p></div>
    <div className={styles.cookieLabControls} role="group" aria-label="选择 Cookie 请求条件">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as CookieMode)}>{item.label}</button>)}</div>
  </div>;
}

export function CookieTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={cookieSources} />;
  return <ConceptArticle slug="cookie" title="Cookie" subtitle="HTTP Cookie · 浏览器替请求筛选并携带的小片状态" sources={cookieSources} sections={[["cookie-store-section", "Cookie 怎样住进浏览器"], ["cookie-scope-section", "哪一条请求能带上它"], ["cookie-script-section", "网络会带，脚本未必看得见"], ["cookie-defense-section", "会话状态的边界"]]} hero={<CookieHero />} intro={<>Cookie 像浏览器里一只带标签的小罐子。服务器用 Set-Cookie 放进去，浏览器每次遇到请求都拿域名、路径、HTTPS 和跨站上下文逐项筛选；符合条件的值才会进入 Cookie 请求头。它不是页面私藏，也不是自动安全。</>}>
    <ArticleSection id="cookie-store-section" title="Cookie 怎样住进浏览器">
      <p id="cookie-store" className="vp-citation-target">服务器在响应里发送 Set-Cookie，浏览器按名称、值和属性保存一条 Cookie。后续请求里的 Cookie 头只带名称和值，属性留在浏览器的筛选规则里；它们不是服务器每次重新发明的一段页面数据。<Cite id="cookie-store" /><Cite id="cookie-header" /></p>
      <p id="cookie-session" className="vp-citation-target">会话系统通常把不可预测的标识放进 Cookie，真正的登录状态留在服务器或受控的会话存储里。Cookie 变大就会随匹配请求反复传输，既占带宽，也扩大泄露面。<Cite id="cookie-session" /></p>
      <CookieLab />
    </ArticleSection>
    <ArticleSection id="cookie-scope-section" title="哪一条请求能带上它">
      <p id="cookie-match" className="vp-citation-target">浏览器会把请求的域名和路径与 Cookie 的 Domain、Path 比对。Path=/account 的 session 不会因为同一个站点就自动进入 /public；匹配失败时它仍留在 Cookie 罐里。<Cite id="cookie-match" /><Cite id="cookie-scope" /></p>
      <p id="cookie-secure" className="vp-citation-target">Secure 把发送条件绑到 HTTPS。它减少了明文线路上的暴露，但不会替你验证服务器业务，也不会让 Cookie 在浏览器或服务器端永远不可见。<Cite id="cookie-secure" /></p>
      <p id="cookie-samesite" className="vp-citation-target">SameSite 让浏览器根据站点上下文限制跨站携带。SameSite=None 需要同时设置 Secure；它能缩小一部分跨站请求面，却不能替代完整的 CSRF 防护设计。<Cite id="cookie-samesite" /><Cite id="cookie-csrf" /></p>
    </ArticleSection>
    <ArticleSection id="cookie-script-section" title="网络会带，脚本未必看得见">
      <p id="cookie-httponly" className="vp-citation-target">HttpOnly 的作用很窄：它不让页面脚本通过 document.cookie 读取这条 Cookie。只要请求上下文仍匹配，浏览器可以照常把它放进网络请求；所以“脚本读不到”不等于“请求绝对不会带”。<Cite id="cookie-httponly" /></p>
      <p id="cookie-attributes" className="vp-citation-target">Cookie 头是一串名称和值，属性不会原样跟着每次请求发送。排查问题要回到 Set-Cookie 的原始属性和实际请求上下文，不要只看 DevTools 里最后出现的那一行文字。<Cite id="cookie-attributes" /><Cite id="cookie-header" /></p>
    </ArticleSection>
    <ArticleSection id="cookie-defense-section" title="会话状态的边界">
      <p id="cookie-expiry" className="vp-citation-target">Expires、Max-Age 和服务器端会话过期共同决定状态能留多久。登录、登出和权限变化时还应轮换或撤销会话标识，不能只把过期时间写得更长。<Cite id="cookie-expiry" /><Cite id="cookie-session" /></p>
      <p id="cookie-defense" className="vp-citation-target">Cookie 属性能减少误带和脚本暴露，却不能替代输入校验、授权、CSRF 防护和 XSS 修复。把会话 Cookie 当成 bearer 凭据来保护；一旦值被窃取，拿到它的人可能直接冒充浏览器。<Cite id="cookie-defense" /></p>
      <p>排查“登录忽然失效”时，按顺序检查 Set-Cookie 是否被接受、Domain/Path 是否匹配、Secure/SameSite 是否挡住、请求头是否实际带出，以及服务器端会话是否仍有效。每一步都可能单独把状态截住。</p>
    </ArticleSection>
  </ConceptArticle>;
}
