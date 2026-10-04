"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Gauge, Globe, MapPinLine, Package, Pause, Play, Stack, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { packetSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "先装上 IP 头",
    version: "IPv4",
    payload: "4000 B 应用数据",
    header: "src 10.0.0.7 · dst 198.51.100.8 · TTL 3",
    pieces: ["1 个 datagram"],
    route: ["源端", "链路 MTU 1500", "目的端"],
    result: "1 个 IP 包",
    note: "应用数据先成为一个带地址和控制字段的 IP 数据报；这时还不知道后面的链路会不会更窄。",
  },
  {
    label: "IPv4 在窄链路分片",
    version: "IPv4",
    payload: "4000 B 应用数据",
    header: "ID 42 · DF=0 · TTL 3",
    pieces: ["P1 · 1500 B", "P2 · 1500 B", "P3 · 1040 B"],
    route: ["源端", "路由器分片", "接收端重组"],
    result: "3 个分片",
    note: "下一跳装不下整包时，IPv4 路由器可以按标识、偏移和 More Fragments 拆开；终点再拼回原数据报。",
  },
  {
    label: "IPv6 让发送端缩小",
    version: "IPv6",
    payload: "4000 B 应用数据",
    header: "Hop Limit 3 · PMTU 1280",
    pieces: ["Packet Too Big", "源端 → 4 × ≤1280 B"],
    route: ["源端", "MTU 1280", "源端重发"],
    result: "源端调整大小",
    note: "IPv6 路由器不替发送端分片；它丢弃过大的包并回报 Packet Too Big，发送端据此减小后续包。",
  },
];

const scenarios = [
  {
    label: "IPv4 · DF=0",
    payload: "4000 B",
    path: ["源端", "MTU 1500", "MTU 1280", "接收端"],
    header: "ID 42 · 3 fragments",
    result: "3 个分片 → 终点重组",
    good: true,
    note: "IPv4 允许中间路由器分片；接收端要等齐同一组标识和偏移，才能交给上层。",
  },
  {
    label: "IPv4 · DF=1",
    payload: "4000 B",
    path: ["源端", "MTU 1280", "停止"],
    header: "DF=1 · 不允许分片",
    result: "ICMP Fragmentation Needed",
    good: false,
    note: "不允许分片又过不了下一跳时，路由器丢弃数据报并回报需要分片；发送端要降低包大小。",
  },
  {
    label: "IPv6 · PTB",
    payload: "4000 B",
    path: ["源端", "MTU 1280", "停止"],
    header: "Hop Limit 3 · PMTU 1280",
    result: "ICMPv6 Packet Too Big",
    good: false,
    note: "IPv6 的路径 MTU 反馈来自 ICMPv6；如果这条反馈被过滤，连接可能握手成功却在传数据时卡住。",
  },
  {
    label: "环路 · Hop Limit=3",
    payload: "1200 B",
    path: ["源端", "跳 1: 2", "跳 2: 1", "跳 3: 0"],
    header: "Hop Limit 3 → 0",
    result: "ICMP Time Exceeded",
    good: false,
    note: "每次转发都会递减 Hop Limit；归零时包被丢弃，ICMP Time Exceeded 把停止位置带回发送端。",
  },
];

function PacketHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.packetHero} data-step={scene.step} aria-label="IP 数据包如何封装、分片并依据路径 MTU 调整">
    <div className={styles.packetHeroTop}><span>应用层交来的 {current.payload}</span><strong>{current.result}</strong></div>
    <div className={styles.packetHeroStage}>
      <div className={styles.packetPayload}><Package size={25} aria-hidden="true" /><span>应用数据</span><strong>{current.payload}</strong><small>先交给 IP 层</small></div>
      <div className={styles.packetEnvelope}>
        <div className={styles.packetEnvelopeHeader}><div><span>IP {current.version}</span><strong>{current.header}</strong></div><MapPinLine size={20} aria-hidden="true" /></div>
        <div className={styles.packetPieces}>{current.pieces.map(piece => <div key={piece} className={styles.packetPiece} data-warning={piece.includes("Too Big")}><Stack size={16} aria-hidden="true" /><code>{piece}</code></div>)}</div>
      </div>
      <div className={styles.packetRoute}><div className={styles.packetRouteTitle}><Globe size={20} aria-hidden="true" /><span>逐跳路径</span></div>{current.route.map((hop, index) => <div key={hop} className={styles.packetHop} data-active={index === Math.min(scene.step + 1, current.route.length - 1)}><span>{index + 1}</span><strong>{hop}</strong></div>)}</div>
    </div>
    <div className={styles.packetEvidence}><Gauge size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.packetTimeline} role="group" aria-label="数据包首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.packetControls} role="group" aria-label="控制数据包演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停数据包原理演示" : "播放数据包原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function PacketLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  return <div className={styles.packetLab} role="region" aria-label="数据包路径与 MTU 排查演示">
    <div className={styles.packetLabHeader}><div><span>只看“发出去了”还不够</span><strong>把每一跳的容量和停止证据展开</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.packetLabMeta}><span><Package size={17} aria-hidden="true" />负载 <strong>{current.payload}</strong></span><span><MapPinLine size={17} aria-hidden="true" />首部 <code>{current.header}</code></span></div>
    <div className={styles.packetLabPath}>{current.path.map((hop, index) => <span key={hop} className={styles.packetLabHop} data-active={index === current.path.length - 1} data-stop={!current.good && index === current.path.length - 1}><strong>{index + 1}</strong>{hop}{index < current.path.length - 1 && <ArrowRight size={16} aria-hidden="true" />}</span>)}</div>
    <div className={styles.packetLabEvidence} data-warning={!current.good}>{current.good ? <CheckCircle size={20} aria-hidden="true" /> : <WarningCircle size={20} aria-hidden="true" />}<p><strong>{current.result}</strong>{current.note}</p></div>
    <div className={styles.packetLabControls} role="group" aria-label="选择数据包路径样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function PacketTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={packetSources} />;
  return <ConceptArticle slug="packet" title="数据包" subtitle="Packet · 网络层一次次搬运的独立小件" sources={packetSources} sections={[["packet-shape", "一个包裹着什么"], ["packet-path", "路由器只看这一跳"], ["packet-mtu", "链路太窄时发生什么"], ["packet-reassemble", "重组和报错都留下证据"]]} hero={<PacketHero />} intro={<>浏览器传出的不是一整块“网页数据”，而是一件件带着首部的网络层数据报。<strong>数据包负责把这一件送过路径：</strong>它不替应用保证顺序，也不携带完整的端到端路线。<Cite id="packet-definition" /></>}>
    <ArticleSection id="packet-shape" title="一个包裹着什么">
      <p id="packet-definition" className="vp-citation-target">IP 数据包由首部和负载组成。首部带着源地址、目的地址、上层协议和控制字段；负载可以是 TCP 段、UDP 数据报或别的上层内容。IP 层把它们当成独立数据报处理，不因为属于同一次网页请求就自动建立一条“包的队列”。<Cite id="packet-definition" /></p>
      <p id="packet-layer" className="vp-citation-target">所以“一个请求”与“一个包”不是同一件事：应用数据可能先被传输层分成几段，再被 IP 层分别封装。抓包时看到的每个包，先回答的是“这一跳要把什么送到哪里”，不是“业务已经完成了什么”。<Cite id="packet-layer" /></p>
      <PacketLab />
    </ArticleSection>
    <ArticleSection id="packet-path" title="路由器只看这一跳">
      <p id="packet-route" className="vp-citation-target">路由器读取目的地址，选择下一跳，把数据包交给下一条链路。它不需要知道应用的完整对话，也不会替你保存“这条请求已经走过哪些节点”的业务上下文；路径上的每个网络模块只处理当前看到的包。<Cite id="packet-route" /></p>
      <p id="packet-hop" className="vp-citation-target">IPv4 用 TTL，IPv6 用 Hop Limit。每个转发节点都要把这个数减一，归零时丢弃数据包；这给环路设置了上限，并可能用 ICMP Time Exceeded 把停止位置告诉发送端。<Cite id="packet-hop" /></p>
    </ArticleSection>
    <ArticleSection id="packet-mtu" title="链路太窄时发生什么">
      <p id="packet-path-mtu" className="vp-citation-target">路径 MTU 是这条路径上各条链路 MTU 的最小值。发送端如果一直按更大的尺寸发，某一跳就必须拆分、拒绝，或回报“请把包变小”；因此 PMTU 是一条随路径和路由变化的事实，不是网卡上的一个永久数字。<Cite id="packet-path-mtu" /></p>
      <p id="packet-ipv4-fragment" className="vp-citation-target">IPv4 在允许分片时可以由路由器拆包，片段靠 Identification、Fragment Offset 和 More Fragments 重新拼回。若设置了 DF（Don't Fragment），下一跳装不下时会丢弃并回 ICMP Fragmentation Needed。<Cite id="packet-ipv4-fragment" /></p>
      <p id="packet-ipv6-fragment" className="vp-citation-target">IPv6 路由器不会沿途替源端分片；过大的包会触发 ICMPv6 Packet Too Big，源端据此降低 PMTU 或调整上层的分段大小。过滤 ICMPv6 可能让握手成功的连接在真正传数据时变成“黑洞”。<Cite id="packet-ipv6-fragment" /></p>
    </ArticleSection>
    <ArticleSection id="packet-reassemble" title="重组和报错都留下证据">
      <p id="packet-reassembly" className="vp-citation-target">分片不是“多发几份副本”。接收端要用同一组源地址、目的地址、协议和标识，把各片按偏移放回原位置；缺片时，原始数据报就无法交给上层。<Cite id="packet-reassembly" /></p>
      <p id="packet-diagnostic" className="vp-citation-target">排查大包问题时，记录应用负载大小、传输层分段、IP 版本、每一跳 MTU、DF 或 Packet Too Big、TTL/Hop Limit 和最终重组结果。只有看到具体的丢弃或 ICMP 证据，才知道包是在路径哪一关停止。<Cite id="packet-diagnostic" /></p>
      <p>这也是为什么抓包不能只盯着“有没有请求”：请求可能已经发出，但包在某一跳被拆开、被丢弃，或等不到同组的最后一片。把首部字段和路径状态放在一起，才看得见这次传输到底走到了哪里。</p>
    </ArticleSection>
  </ConceptArticle>;
}
