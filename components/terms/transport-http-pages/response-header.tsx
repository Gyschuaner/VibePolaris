"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, FileText, Pause, Play, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { responseHeaderSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "原地交付", status: "200 OK", field: "—", body: "order.json", effect: "交给调用方", note: "没有控制字段时，客户端按普通响应读取 body；字段牌还没有改变下一步。" },
  { label: "Location", status: "302 Found", field: "Location: /login", body: "短提示", effect: "改走 /login", note: "Location 把后续目标交给重定向处理；body 仍然是这次响应自己的载荷。" },
  { label: "Retry-After", status: "429 Too Many Requests", field: "Retry-After: 30", body: "错误说明", effect: "等待 30 秒", note: "Retry-After 给重试策略一个等待窗口，不是让客户端立即再撞一次。" },
  { label: "Vary", status: "200 OK", field: "Vary: Accept-Language", body: "中文版本", effect: "缓存键分叉", note: "Vary 告诉缓存：同一个 URL 还要按请求字段区分表示，不能把中文副本发给英文请求。" },
  { label: "Vary: *", status: "200 OK", field: "Vary: *", body: "个性化内容", effect: "不复用副本", note: "Vary: * 表示当前响应不能被缓存用来满足后续请求；这是一条缓存边界，不是 body 损坏。" },
  { label: "Cache-Control", status: "200 OK", field: "Cache-Control: max-age=60", body: "app.js", effect: "60 秒内复用", note: "Cache-Control 把新鲜窗口写给缓存；命中与否由缓存按规则决定，不是响应体自己决定。" },
];

function ResponseHeaderHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const warning = scene.step === 2 || scene.step === 4;
  return <figure ref={scene.ref} className={styles.headerHero} data-step={scene.step} aria-label="HTTP 响应头字段改变客户端导航、等待和缓存行为">
    <div className={styles.headerTop}><span>同一类响应 · 只换一张字段牌</span><strong>{current.label}</strong></div>
    <div className={styles.headerStage}>
      <div className={styles.headerReply}><FileText size={25} aria-hidden="true" /><span>响应</span><strong>{current.status}</strong><code>{current.body}</code></div>
      <ArrowRight className={styles.headerArrow} size={20} aria-hidden="true" />
      <div className={styles.headerField}><Stack size={24} aria-hidden="true" /><span>响应头字段</span><strong>{current.field}</strong><small>元信息 · 控制信号</small></div>
      <ArrowRight className={styles.headerArrow} size={20} aria-hidden="true" />
      <div className={styles.headerEffect} data-warning={warning}><>{warning ? <WarningCircle size={25} aria-hidden="true" /> : <CheckCircle size={25} aria-hidden="true" />}</><span>下一步</span><strong>{current.effect}</strong></div>
    </div>
    <div className={styles.headerEvidence} aria-live="polite"><Stack size={20} aria-hidden="true" /><p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.headerTimeline} role="group" aria-label="响应头字段步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.headerControls} role="group" aria-label="控制响应头演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type HeaderMode = "location" | "retry" | "vary" | "cache";

function ResponseHeaderLab() {
  const [mode, setMode] = useState<HeaderMode>("location");
  const cases = {
    location: { label: "Location", status: "302 Found", field: "Location: /login", action: "导航到 /login", note: "控制字段改变下一次请求目标，body 仍可只是简短提示。" },
    retry: { label: "Retry-After", status: "429 Too Many Requests", field: "Retry-After: 30", action: "至少等待 30 秒", note: "客户端把等待交给重试策略，而不是看到 429 就无限连发。" },
    vary: { label: "Vary", status: "200 OK", field: "Vary: Accept-Language", action: "缓存分成 zh / en", note: "同一 URL 的表示随请求字段变化，缓存键也要跟着变化。" },
    cache: { label: "Cache-Control", status: "200 OK", field: "Cache-Control: max-age=60", action: "60 秒内可复用", note: "新鲜窗口由字段声明；过期后还要按缓存验证规则处理。" },
  } satisfies Record<HeaderMode, { label: string; status: string; field: string; action: string; note: string }>;
  const current = cases[mode];
  return <div className={styles.headerLab} role="region" aria-label="响应头控制信号演示">
    <div className={styles.headerLabHead}><div><span>body 保持不变，只换响应头</span><strong>同一份内容为什么触发不同下一步</strong></div><span>{current.label}</span></div>
    <div className={styles.headerLabBoard}><div className={styles.headerLabNode}><FileText size={21} aria-hidden="true" /><span>响应</span><code>{current.status}</code><small>body: same payload</small></div><ArrowRight className={styles.headerArrow} size={19} aria-hidden="true" /><div className={styles.headerLabNode}><Stack size={21} aria-hidden="true" /><span>字段牌</span><strong>{current.field}</strong></div><ArrowRight className={styles.headerArrow} size={19} aria-hidden="true" /><div className={styles.headerLabNode}><CheckCircle size={21} aria-hidden="true" /><span>客户端动作</span><strong>{current.action}</strong></div></div>
    <div className={styles.headerLabResult}><p><strong>字段的作用</strong>{current.note}</p></div>
    <div className={styles.headerLabControls} role="group" aria-label="选择响应头字段">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as HeaderMode)}>{item.label}</button>)}</div>
  </div>;
}

export function ResponseHeaderTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={responseHeaderSources} />;
  return <ConceptArticle slug="response-header" title="响应头" subtitle="Response Headers · 一张字段牌，改变下一步处理" sources={responseHeaderSources} sections={[["header-metadata-section", "字段牌在说什么"], ["header-control-section", "Location 和 Retry-After 会推动什么动作"], ["header-cache-section", "Vary 与 Cache-Control 怎样管住缓存"], ["header-boundary-section", "元信息不能替 body 负责"]]} hero={<ResponseHeaderHero />} intro={<>响应头不是响应体旁边的注释。它们把内容格式、跳转位置、等待窗口和缓存条件写在 body 之外；同一份 body 换一张字段牌，浏览器、客户端库或中间缓存就可能走向完全不同的下一步。</>}>
    <ArticleSection id="header-metadata-section" title="字段牌在说什么">
      <p id="header-metadata" className="vp-citation-target">响应字段是跟着状态一起返回的元信息，用来说明这次表示怎样处理、来自哪里、能不能缓存或下一步应该做什么。字段的值不是业务 body 的替身，而是接收方执行协议规则时用的输入。<Cite id="header-metadata" /></p>
      <p id="header-fields" className="vp-citation-target">字段名不等于任意字符串：标准字段有明确语义，扩展字段也应保持稳定、必要并避免冲突。排查时同时记录字段名、值、来源和接收方，否则“服务器发了什么”与“客户端据此做了什么”很容易混在一起。<Cite id="header-fields" /></p>
      <ResponseHeaderLab />
    </ArticleSection>
    <ArticleSection id="header-control-section" title="Location 和 Retry-After 会推动什么动作">
      <p id="header-location" className="vp-citation-target">Location 在重定向等响应里给出后续目标。客户端是否自动跟随、是否保留方法和凭据，还要看状态码与客户端策略；字段提供位置，不等于所有客户端都会无条件跳转。<Cite id="header-location" /></p>
      <p id="header-retry" className="vp-citation-target">Retry-After 可以用秒数或日期告诉客户端何时再试。它是节流和维护窗口里的协议提示，调用方仍要结合幂等性、退避和截止时间决定是否重试，不能把它当成“保证成功”的承诺。<Cite id="header-retry" /></p>
    </ArticleSection>
    <ArticleSection id="header-cache-section" title="Vary 与 Cache-Control 怎样管住缓存">
      <p id="header-vary" className="vp-citation-target">Vary 把影响表示选择的请求字段写进缓存键。例如 Vary: Accept-Language 要让中文和英文副本分开；Vary: * 则表示这次响应不能拿来满足后续请求。<Cite id="header-vary" /><Cite id="header-no-reuse" /></p>
      <p id="header-cache" className="vp-citation-target">Cache-Control 描述存储、新鲜度与验证条件。max-age=60 让缓存拥有一段可直接复用的时间，过期后是否回源、是否带验证器，要由缓存规则继续判断。<Cite id="header-cache" /></p>
    </ArticleSection>
    <ArticleSection id="header-boundary-section" title="元信息不能替 body 负责">
      <p>响应头可以改变导航、等待和缓存，却不会自动把业务数据补进响应体，也不会替服务端完成权限判断。即使字段看起来正确，调用方仍要检查状态、body 格式、授权结果和实际业务约束。</p>
      <p>排查时把响应拆成三栏：状态决定大方向，字段说明协议动作，body 承载具体表示。这样能区分“跳错地址”“缓存了错误变体”和“业务内容本身不对”这三类问题。</p>
    </ArticleSection>
  </ConceptArticle>;
}
