"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Clock, Globe, Pause, Play, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { websocketSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "HTTP Upgrade", state: "CONNECTING", left: "GET /chat", wire: "Upgrade: websocket", right: "101 Switching Protocols", messages: "还不能发业务消息", note: "WebSocket 先借 HTTP 完成握手；服务器确认升级后，连接才进入可以交换帧的状态。" },
  { label: "通道开放", state: "OPEN", left: "client", wire: "双向连接", right: "server", messages: "等待第一帧", note: "OPEN 不是‘请求已完成’的瞬间，而是一条双方都能主动发帧的持续通道。" },
  { label: "帧双向流动", state: "OPEN", left: "send: hi", wire: "frame #18", right: "send: ack", messages: "#18 已重组", note: "帧是传输单位，消息可能跨多个分片帧；浏览器重组后交付 message，业务确认和顺序语义仍要由应用定义。" },
  { label: "连接关闭", state: "CLOSED", left: "网络断开", wire: "Close / error", right: "#19 #20 未到", messages: "列表停在 #18", note: "连接关闭后，通道本身不会替应用补回遗漏消息，也不会自动重新连接。" },
  { label: "应用退避", state: "CONNECTING", left: "lastEventId=18", wire: "1s → 2s → 4s", right: "等待重连", messages: "补偿策略启动", note: "退避计时、重连次数和恢复游标都属于客户端协议，不是 WebSocket 帧自动附带的保证。" },
  { label: "恢复缺口", state: "OPEN", left: "resume after 18", wire: "frame #19 · #20", right: "server replay", messages: "#18 · #19 · #20", note: "服务器愿意保存并补发消息时，应用才能把断线期间的缺口接回来；这是业务协议的约定。" },
];

function WebSocketHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const failed = scene.step === 3;
  return <figure ref={scene.ref} className={styles.wsHero} data-step={scene.step} aria-label="WebSocket 从 HTTP Upgrade 到开放帧通道、断线和应用恢复">
    <div className={styles.wsTop}><span>浏览器 ↔ 消息服务器 · 一条持久双向通道</span><strong>{current.label}</strong></div>
    <div className={styles.wsStage}>
      <div className={styles.wsEndpoint}><Globe size={25} aria-hidden="true" /><span>客户端</span><strong>{current.left}</strong><small>WebSocket</small></div>
      <div className={styles.wsWire}><div className={styles.wsState} data-failed={failed}><span>连接状态</span><strong>{current.state}</strong></div><div className={styles.wsFrame}><Stack size={22} aria-hidden="true" /><code>{current.wire}</code></div><small>{current.messages}</small></div>
      <div className={styles.wsEndpoint}><Globe size={25} aria-hidden="true" /><span>服务器</span><strong>{current.right}</strong><small>{scene.step === 3 ? "等待恢复" : "消息源"}</small></div>
    </div>
    <div className={styles.wsEvidence} aria-live="polite">{failed ? <WarningCircle size={20} aria-hidden="true" /> : <CheckCircle size={20} aria-hidden="true" />}<p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.wsTimeline} role="group" aria-label="WebSocket 生命周期步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.wsControls} role="group" aria-label="控制 WebSocket 演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type WsMode = "open" | "closed" | "resume";

function WebSocketRecoveryLab() {
  const [mode, setMode] = useState<WsMode>("open");
  const cases = {
    open: { label: "连接开放", state: "OPEN", wire: "frame #18", result: "列表追加 #18", note: "通道只负责把帧送到对端；消息是否算业务成功，要看应用确认。" },
    closed: { label: "连接关闭", state: "CLOSED", wire: "#19 · #20 missed", result: "列表停住", note: "断线期间的消息不会因为 WebSocket 曾经 OPEN 就自动补回来。" },
    resume: { label: "应用恢复", state: "OPEN", wire: "resume after 18", result: "补回 #19 · #20", note: "客户端带游标重连，服务器按约定重放，才能恢复顺序和缺口。" },
  } satisfies Record<WsMode, { label: string; state: string; wire: string; result: string; note: string }>;
  const current = cases[mode];
  return <div className={styles.wsLab} role="region" aria-label="WebSocket 断线恢复演示">
    <div className={styles.wsLabHead}><div><span>只改变连接状态和应用协议</span><strong>断线后谁负责把消息找回来</strong></div><span>{current.label}</span></div>
    <div className={styles.wsLabBoard}><div className={styles.wsLabNode}><Globe size={21} aria-hidden="true" /><span>连接</span><code>{current.state}</code></div><ArrowRight className={styles.wsArrow} size={19} aria-hidden="true" /><div className={styles.wsLabNode}><Stack size={21} aria-hidden="true" /><span>帧 / 游标</span><strong>{current.wire}</strong></div><ArrowRight className={styles.wsArrow} size={19} aria-hidden="true" /><div className={styles.wsLabNode}>{mode === "closed" ? <WarningCircle size={21} aria-hidden="true" /> : <CheckCircle size={21} aria-hidden="true" />}<span>消息列表</span><strong>{current.result}</strong></div></div>
    <div className={styles.wsLabResult} data-failed={mode === "closed"}><p><strong>应用边界</strong>{current.note}</p></div>
    <div className={styles.wsLabControls} role="group" aria-label="选择 WebSocket 恢复案例">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as WsMode)}>{item.label}</button>)}</div>
  </div>;
}

export function WebSocketTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={websocketSources} />;
  return <ConceptArticle slug="websocket" title="WebSocket" subtitle="WebSocket · HTTP 升级后，双方共享一条持续帧通道" sources={websocketSources} sections={[["ws-upgrade-section", "先把 HTTP 升级成什么"], ["ws-frame-section", "开放后流动的是一帧帧消息"], ["ws-recovery-section", "断线以后谁来补缺口"], ["ws-boundary-section", "长连接不是业务保证"]]} hero={<WebSocketHero />} intro={<>WebSocket 解决的是“双方都能主动说话”的连接问题。客户端先用 HTTP Upgrade 建立通道，连接进入 OPEN 后，服务器可以主动推送，客户端也能发送；断线、重连、确认和补消息仍要写进应用协议。</>}>
    <ArticleSection id="ws-upgrade-section" title="先把 HTTP 升级成什么">
      <p id="ws-upgrade" className="vp-citation-target">客户端先发送带 Upgrade: websocket 的 HTTP 握手，服务器以 101 Switching Protocols 接受后，连接才离开普通 HTTP 请求响应的节奏。握手失败时，应用不应假装已经有一条实时通道。<Cite id="ws-upgrade" /></p>
      <p id="ws-open" className="vp-citation-target">浏览器 API 会把连接从 CONNECTING 推到 OPEN；只有 OPEN 状态才适合发送业务消息。CLOSING 和 CLOSED 表示通道正在收尾或已经不可用，调用方要据此更新界面和发送策略。<Cite id="ws-open" /><Cite id="ws-state" /></p>
    </ArticleSection>
    <ArticleSection id="ws-frame-section" title="开放后流动的是一帧帧消息">
      <p id="ws-frames" className="vp-citation-target">WebSocket 帧是连接上的传输单位，一条消息可以由一个或多个分片帧组成，浏览器 API 会在重组后交付 message。客户端和服务器仍能在同一连接上交错发送文本或二进制数据；通道持续不代表业务消息已经被确认。<Cite id="ws-frames" /></p>
      <p id="ws-message" className="vp-citation-target">ping/pong 可以帮助检测连接是否仍在响应，close 帧则协商关闭原因。消息去重、顺序、权限和业务确认不由这些控制帧自动完成。<Cite id="ws-ping" /><Cite id="ws-message" /></p>
    </ArticleSection>
    <ArticleSection id="ws-recovery-section" title="断线以后谁来补缺口">
      <p id="ws-close" className="vp-citation-target">网络断开或任一端关闭后，WebSocket 不会自动重连，也不会知道断线期间服务器产生了哪些事件。客户端需要自己管理重连、退避、关闭时机和失败提示。<Cite id="ws-close" /><Cite id="ws-error" /></p>
      <WebSocketRecoveryLab />
      <p id="ws-buffer" className="vp-citation-target">要恢复遗漏消息，应用通常保存事件序号或游标，并让服务器按游标重放；这需要服务端保留窗口、客户端去重以及明确的确认语义。浏览器的 bufferedAmount 只能说明尚未发出的字节量，不是服务器已经处理的证明。<Cite id="ws-buffer" /></p>
    </ArticleSection>
    <ArticleSection id="ws-boundary-section" title="长连接不是业务保证">
      <p id="ws-http2" className="vp-citation-target">在 HTTP/2 场景，RFC 8441 定义了用 extended CONNECT 建立 WebSocket 的方式；这改变的是建连承载方式，不会自动增加重连、补偿或业务授权。<Cite id="ws-http2" /></p>
      <p>排查实时消息问题时，分开记录连接状态、握手响应、帧方向、关闭原因、发送缓冲、重连次数和业务游标。这样才能知道问题是“没连上”“帧没发出”“服务器没确认”还是“客户端没有补回缺口”。</p>
    </ArticleSection>
  </ConceptArticle>;
}
