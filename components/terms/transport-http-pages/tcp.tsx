"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Pause, Play, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { tcpSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "三段出发", sent: ["ABCDEF", "GHIJ", "KL"], lost: -1, received: "等待字节", ack: "ACK 1 · 等待接收", note: "发送方把连续字节切成几个 segment（传输层传输块）；切段只是传输安排，应用看到的仍是一条流。" },
  { label: "中间段丢了", sent: ["ABCDEF", "GHIJ", "KL"], lost: 1, received: "ABCDEF · KL", ack: "ACK 7 · 缺 GHIJ", note: "后面的 KL 已经到了，接收方重复确认下一个期望序号 7；缺口仍在，不能把跳过的字节交给应用。" },
  { label: "后段先到", sent: ["ABCDEF", "GHIJ", "KL"], lost: 1, received: "ABCDEF | KL", ack: "重复 ACK 7", note: "接收缓冲区可以暂存后段，但连续可交付范围仍停在 ABCDEF，确认号不会跳过缺口。" },
  { label: "补发缺口", sent: ["ABCDEF", "GHIJ", "KL"], lost: -1, received: "ABCDEF · GHIJ · KL", ack: "ACK 13 · 已连续", retransmit: 1, note: "发送方按确认和重传策略补回缺口，接收端才拥有从 1 到 12 的连续范围。" },
  { label: "交给应用", sent: ["ABCDEF", "GHIJ", "KL"], lost: -1, received: "ABCDEFGHIJKL", ack: "ACK 13 · 已连续", delivered: true, note: "TCP 交付有序字节；至于这一串字节怎样分成消息，要由应用协议定义。" },
];

function TcpHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.tcpHero} data-step={scene.step} aria-label="TCP 通过序号、确认和重传填补字节流缺口">
    <div className={styles.tcpTop}><span>一条下载连接 · 接收缓冲区</span><strong>{current.label}</strong></div>
    <div className={styles.tcpTrack}>
      <div className={styles.tcpEndpoint}><Stack size={25} aria-hidden="true" /><span>发送方</span><strong>连续字节</strong><small>ABCDEF GHIJ KL</small></div>
      <ArrowRight className={styles.tcpArrow} size={21} aria-hidden="true" />
      <div className={styles.tcpWire}>{current.sent.map((segment, index) => <div className={styles.tcpSegment} data-lost={current.lost === index} data-retransmit={current.retransmit === index} key={segment}><span>seq {index * 6 + 1}</span><code>{segment}</code><small>{current.lost === index ? "缺口" : current.retransmit === index ? "重传" : "segment"}</small></div>)}</div>
      <ArrowRight className={styles.tcpArrow} size={21} aria-hidden="true" />
      <div className={styles.tcpReceiver}><CheckCircle size={25} aria-hidden="true" /><span>接收缓冲区</span><strong>{current.received}</strong><small>{current.ack}</small></div>
    </div>
    <div className={styles.tcpEvidence} aria-live="polite">{current.delivered ? <CheckCircle size={20} aria-hidden="true" /> : <WarningCircle size={20} aria-hidden="true" />}<p key={scene.step}><strong>{current.delivered ? "交付边界" : "当前证据"}</strong>{current.note}</p></div>
    <div className={styles.tcpTimeline} role="group" aria-label="TCP 字节流步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.tcpControls} role="group" aria-label="控制 TCP 演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function TcpBoundaryLab() {
  const [mode, setMode] = useState<"stream" | "message">("stream");
  const isMessage = mode === "message";
  return <div className={styles.tcpLab} role="region" aria-label="TCP 字节流与消息边界演示">
    <div className={styles.tcpLabHead}><div><span>同一条 TCP 读取，应用能得到什么</span><strong>切换“读取方式”，看边界是谁定义的</strong></div><span>{isMessage ? "应用协议已加帧" : "只有 TCP 字节流"}</span></div>
    <div className={styles.tcpLabBoard}>
      <div className={styles.tcpLabNode}><Stack size={21} aria-hidden="true" /><span>发送两次</span><code>send("A") · send("B")</code></div><ArrowRight className={styles.tcpArrow} size={19} aria-hidden="true" />
      <div className={styles.tcpLabNode}><span>TCP 接收缓冲区</span><strong>{isMessage ? "01|A · 01|B" : "AB"}</strong><code>{isMessage ? "长度前缀" : "连续字节"}</code></div><ArrowRight className={styles.tcpArrow} size={19} aria-hidden="true" />
      <div className={styles.tcpLabNode}><CheckCircle size={21} aria-hidden="true" /><span>一次 read()</span><strong>{isMessage ? "消息 A + 消息 B" : "可能只读到 AB"}</strong></div>
    </div>
    <div className={styles.tcpLabResult} data-warning={!isMessage}>{isMessage ? <CheckCircle size={20} aria-hidden="true" /> : <WarningCircle size={20} aria-hidden="true" />}<p><strong>{isMessage ? "消息边界来自应用" : "没有消息边界"}</strong>{isMessage ? "长度前缀让应用知道下一条消息在哪里结束；TCP 只负责把这些字节按序送到。" : "一次 send 不保证对应一次 receive。应用若需要消息，就要规定长度、分隔符或帧格式。"}</p></div>
    <div className={styles.tcpLabControls} role="group" aria-label="选择 TCP 读取模型"><button type="button" aria-pressed={!isMessage} onClick={() => setMode("stream")}>只看字节流</button><button type="button" aria-pressed={isMessage} onClick={() => setMode("message")}>加上应用帧</button></div>
  </div>;
}

export function TcpTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={tcpSources} />;
  return <ConceptArticle slug="tcp" title="TCP" subtitle="Transmission Control Protocol · 把连续字节可靠地送到对端" sources={tcpSources} sections={[["tcp-stream-section", "TCP 交付的是字节流"], ["tcp-sequence-section", "缺口怎样被找回"], ["tcp-congestion-section", "发送速度也要看窗口"], ["tcp-boundary-section", "连接成功还差哪一步"]]} hero={<TcpHero />} intro={<>下载文件时，网络中的数据会被切成一段段 segment。中间丢掉一段，应用最后仍可能读到完整内容，因为 TCP 维护的是一条有序字节流：它记住缺口、确认已经收到的范围，并在需要时重传。这个保证停在传输层，消息边界和业务结果仍在上面。</>}>
    <ArticleSection id="tcp-stream-section" title="TCP 交付的是字节流">
      <p id="tcp-stream" className="vp-citation-target">TCP 在两个端点之间提供可靠、有序的字节流。发送方写入的内容会被协议拆成 segment，接收方按序号放回接收缓冲区；应用读取时看到的是连续字节，不会看到“这一段正好来自哪一次 send”。<Cite id="tcp-stream" /></p>
      <p id="tcp-port" className="vp-citation-target">端口让同一台主机上的多个 TCP 服务共享网络地址：连接由地址和端口等信息区分。端口只回答“交给哪个传输端点”，不回答“登录的是谁”，也不保证端口后面的 HTTP 或业务代码已经准备好。<Cite id="tcp-port" /></p>
      <TcpBoundaryLab />
    </ArticleSection>
    <ArticleSection id="tcp-sequence-section" title="缺口怎样被找回">
      <p id="tcp-sequence" className="vp-citation-target">TCP 给字节编号，确认号告诉发送方接收方已经连续收到哪里。确认出现缺口时，发送方可以等待重传计时器，也可以利用重复确认更快判断某段需要补发；接收方不会把缺口后面的字节伪装成连续内容交给应用。<Cite id="tcp-sequence" /></p>
      <p id="tcp-reliability" className="vp-citation-target">“可靠”说的是传输层的顺序、校验与重传路径。它不替你验证文件格式，也不替你保存数据库事务；连接断开时，应用仍要判断最后一次业务请求是否已经被服务器处理。<Cite id="tcp-reliability" /></p>
    </ArticleSection>
    <ArticleSection id="tcp-congestion-section" title="发送速度也要看窗口">
      <p id="tcp-window" className="vp-citation-target">发送方同时受到两个窗口约束：接收方公告的窗口避免缓冲区被压满，拥塞窗口则根据网络拥塞信号限制在途数据量。实际可发送范围取两者中更小的一项；所以“带宽很大”也不意味着某一刻可以无限加速。<Cite id="tcp-window" /></p>
      <p id="tcp-congestion" className="vp-citation-target">TCP 的慢启动、拥塞避免、快速重传和快速恢复让发送方逐步探测路径容量。它们影响的是传输节奏，不是应用层的重试语义。把 TCP 的重传次数当成业务请求已经重试了几次，会把两个计数器混在一起。<Cite id="tcp-congestion" /></p>
      <div className={styles.tcpBoundary}><div><h3>传输层负责</h3><p>序号、确认、校验、流量控制和拥塞控制，让字节按序抵达。</p></div><div><h3>应用层负责</h3><p>消息长度、请求幂等、业务确认和断线后的重新提交策略。</p></div></div>
    </ArticleSection>
    <ArticleSection id="tcp-boundary-section" title="连接成功还差哪一步">
      <p id="tcp-boundary" className="vp-citation-target">三次握手完成只说明双方建立了 TCP 状态。端口后面可能没有正确的协议、应用可能在读取请求后报错，或返回结果在业务上被拒绝；健康检查需要继续发一条符合协议的请求并观察结果。<Cite id="tcp-boundary" /></p>
      <p id="tcp-app-boundary" className="vp-citation-target">若创建订单的响应在断线时丢失，客户端不能只凭“没收到响应”断定服务器没有执行。它需要幂等键、查询接口或应用确认来消除重复提交的歧义。TCP 能把字节送到对端，却不知道那串字节代表的交易有没有落库。<Cite id="tcp-app-boundary" /></p>
      <p>换成上传照片：TCP 可以保证压缩文件的字节顺序，不能保证照片没有被错误的业务规则拒收。排查时把“连接是否建立”“字节是否完整”“服务是否接受内容”分成三次检查，日志才会指向真正的一层。</p>
    </ArticleSection>
  </ConceptArticle>;
}
