"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Clock, Key, Pause, Play, ShieldCheck, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { apiKeySources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "签发限制", key: "K1", placement: "server vault", action: "weather.read", result: "project-7 · active", note: "先把 key 绑定到调用项目和最小用途；它是凭证，不是把最终用户身份凭空变出来。" },
  { label: "受控请求头", key: "K1", placement: "X-API-Key", action: "GET /weather", result: "200 · quota -1", note: "受控服务把 key 放进请求头，API 识别项目并计量用量；日志不应记录完整秘密。" },
  { label: "塞进 URL", key: "K1", placement: "?key=K1", action: "GET /weather", result: "日志 / URL 泄露", note: "查询参数可能进入访问日志、历史记录或 Referer；同一个 key 的泄露面立刻变大。" },
  { label: "编进前端", key: "K1", placement: "bundle.js", action: "任何人可下载", result: "长期秘密公开", note: "公开浏览器由用户控制，源码里的长期 key 不能对用户保密。" },
  { label: "轮换新值", key: "K2", placement: "server vault", action: "K1 → K2", result: "新请求继续 200", note: "轮换不是改一个字符串就结束：新旧重叠窗口、撤销时点和失败回滚都要有记录。" },
  { label: "旧值撤销", key: "K1", placement: "revoked", action: "GET /weather", result: "401 · invalid key", note: "服务端撤销旧值后，泄露的 key 才真正失去继续调用的能力。" },
];

function ApiKeyHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const failed = scene.step === 2 || scene.step === 3 || scene.step === 5;
  return <figure ref={scene.ref} className={styles.keyHero} data-step={scene.step} aria-label="API 密钥从签发、受控传递到泄露和轮换撤销">
    <div className={styles.keyTop}><span>一个 key · 放在哪里，谁能拿到，能否撤回</span><strong>{current.label}</strong></div>
    <div className={styles.keyStage}>
      <div className={styles.keyVault}><ShieldCheck size={25} aria-hidden="true" /><span>服务端凭证</span><strong>{current.key}</strong><small>{current.placement}</small></div>
      <ArrowRight className={styles.keyArrow} size={20} aria-hidden="true" />
      <div className={styles.keyRequest}><Key size={25} aria-hidden="true" /><span>提交方式</span><strong>{current.action}</strong><small>{current.placement}</small></div>
      <ArrowRight className={styles.keyArrow} size={20} aria-hidden="true" />
      <div className={styles.keyResult} data-failed={failed}>{failed ? <WarningCircle size={25} aria-hidden="true" /> : <CheckCircle size={25} aria-hidden="true" />}<span>服务结果</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.keyEvidence} aria-live="polite"><Stack size={20} aria-hidden="true" /><p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.keyTimeline} role="group" aria-label="API 密钥生命周期步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.keyControls} role="group" aria-label="控制 API 密钥演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type KeyMode = "header" | "query" | "bundle" | "rotate";

function ApiKeyLab() {
  const [mode, setMode] = useState<KeyMode>("header");
  const cases = {
    header: { label: "受控请求头", place: "X-API-Key: K1", exposure: "日志只留 present", result: "200 · quota -1", note: "服务端代理保存长期 key，调用方只把它放进受控请求头。" },
    query: { label: "查询参数", place: "?key=K1", exposure: "URL / logs / history", result: "风险升高", note: "URL 会被更多组件记录；即使服务接受，也不适合作为长期秘密的默认位置。" },
    bundle: { label: "前端 bundle", place: "bundle.js → K1", exposure: "浏览器用户可取", result: "公开 bearer", note: "任何能下载网页的人都能复制这串值，限制范围和配额也不能让它重新变成秘密。" },
    rotate: { label: "轮换撤销", place: "K1 revoked · K2 active", exposure: "旧值失效", result: "K1=401 · K2=200", note: "轮换要包含撤销和验证；只生成新 key 而不让旧值失效，泄露窗口还在。" },
  } satisfies Record<KeyMode, { label: string; place: string; exposure: string; result: string; note: string }>;
  const current = cases[mode];
  return <div className={styles.keyLab} role="region" aria-label="API 密钥放置与轮换演示">
    <div className={styles.keyLabHead}><div><span>只改变密钥放置和生命周期</span><strong>谁能拿到，旧值还能不能用</strong></div><span>{current.label}</span></div>
    <div className={styles.keyLabBoard}><div className={styles.keyLabNode}><Key size={21} aria-hidden="true" /><span>key</span><code>{current.place}</code></div><ArrowRight className={styles.keyArrow} size={19} aria-hidden="true" /><div className={styles.keyLabNode}><Clock size={21} aria-hidden="true" /><span>暴露面</span><strong>{current.exposure}</strong></div><ArrowRight className={styles.keyArrow} size={19} aria-hidden="true" /><div className={styles.keyLabNode}>{mode === "query" || mode === "bundle" ? <WarningCircle size={21} aria-hidden="true" /> : <CheckCircle size={21} aria-hidden="true" />}<span>验证结果</span><strong>{current.result}</strong></div></div>
    <div className={styles.keyLabResult} data-failed={mode === "query" || mode === "bundle"}><p><strong>凭证边界</strong>{current.note}</p></div>
    <div className={styles.keyLabControls} role="group" aria-label="选择 API 密钥案例">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as KeyMode)}>{item.label}</button>)}</div>
  </div>;
}

export function ApiKeyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={apiKeySources} />;
  return <ConceptArticle slug="api-key" title="API 密钥" subtitle="API Key · 识别调用方、计量用量，但不是最终用户授权" sources={apiKeySources} sections={[["key-role-section", "一串 key 先证明了什么"], ["key-storage-section", "为什么要把它藏在服务端"], ["key-restriction-section", "限制范围和计量能解决什么"], ["key-lifecycle-section", "轮换以后旧值去哪了"]]} hero={<ApiKeyHero />} intro={<>API 密钥是一串会随请求提交的凭证。服务可以用它识别项目、计量调用或套用配额，但拿到 key 的人通常就能以这个调用方继续请求；它和“当前到底是哪位用户”是两件事。</>}>
    <ArticleSection id="key-role-section" title="一串 key 先证明了什么">
      <p id="key-role" className="vp-citation-target">API key 常用于识别项目、应用或调用方，让服务做计量、配额和基础访问判断。它通常是 bearer 凭证，能拿到值的人可能直接复用；服务不能只凭 key 推断最终用户的对象权限。<Cite id="key-role" /></p>
      <p id="key-bearer" className="vp-citation-target">把 key 放进受控请求头，比把它拼进 URL 更容易控制日志和转发范围。无论位置如何，key 都要按秘密或敏感凭证管理，避免在错误、调试输出和示例代码里原样出现。<Cite id="key-bearer" /></p>
      <ApiKeyLab />
    </ArticleSection>
    <ArticleSection id="key-storage-section" title="为什么要把它藏在服务端">
      <p id="key-storage" className="vp-citation-target">公开前端 bundle、移动端包和 URL 都在调用方控制范围内，不能替长期 key 保密。更稳妥的路径是由服务端保存 key，浏览器只拿自己的会话或短期受限凭证，再由服务端代理第三方调用。<Cite id="key-storage" /></p>
      <p id="key-query" className="vp-citation-target">查询参数容易进入访问日志、浏览器历史、监控和 Referer，除非供应商明确要求，否则不应把长期 API key 放进 URL。请求头也要配合日志脱敏和最小权限，不能因为不在地址栏就当成绝对安全。<Cite id="key-query" /></p>
    </ArticleSection>
    <ArticleSection id="key-restriction-section" title="限制范围和计量能解决什么">
      <p id="key-restrict" className="vp-citation-target">给 key 绑定 API、来源、项目或环境限制，可以缩小误用范围；限制越贴近实际调用，泄露后的影响面越小。限制不能把公开 key 变回秘密，也不能替代用户级授权。<Cite id="key-restrict" /></p>
      <p id="key-meter" className="vp-citation-target">使用计划可以把 key 与配额、速率或用量统计关联起来。计量帮助发现异常和控制成本，却不等于判断某个用户能否读取某条订单。<Cite id="key-meter" /><Cite id="key-quota" /></p>
      <p id="key-boundary" className="vp-citation-target">API key 解决的是调用方凭证和服务入口问题；对象级授权还要结合登录身份、资源归属和操作权限。把一个高权限 key 放进前端，只会让所有浏览器用户共享同一把万能钥匙。<Cite id="key-boundary" /></p>
    </ArticleSection>
    <ArticleSection id="key-lifecycle-section" title="轮换以后旧值去哪了">
      <p id="key-rotate" className="vp-citation-target">轮换应先准备新 key，再更新使用方，确认新值工作后撤销旧值，并记录生效时间。旧值如果仍可用，所谓轮换只是多发了一把钥匙，泄露窗口并没有缩短。<Cite id="key-rotate" /></p>
      <p id="key-expiry" className="vp-citation-target">短期有效期和明确撤销点能缩小 bearer 凭证的暴露时间。撤销后服务应返回可识别的认证失败，监控再把旧值调用与正常业务错误分开。<Cite id="key-expiry" /><Cite id="key-revoke" /></p>
      <p>排查“第三方接口突然 401”时，先确认调用方取到的是哪一代 key，再看 key 的限制、到期和撤销记录，最后才检查网络和业务参数。把凭证问题和接口参数问题分开，恢复会快很多。</p>
    </ArticleSection>
  </ConceptArticle>;
}
