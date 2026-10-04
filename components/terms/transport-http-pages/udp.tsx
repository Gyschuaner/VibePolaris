"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Pause, Play, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { udpSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "四封出发", packets: ["1", "2", "3", "4"], lost: "", order: [], result: "接收队列为空", note: "UDP 把每次写入作为独立数据报交给网络；它没有先建立一条可靠字节流。" },
  { label: "路径抖动", packets: ["1", "2", "3", "4"], lost: "", order: ["1", "4", "3", "2"], result: "到达顺序改变", note: "每封数据报仍有边界，但网络延迟可以让 4 先于 2、3 到达。" },
  { label: "报 2 丢失", packets: ["1", "2", "3", "4"], lost: "2", order: ["1", "4", "3"], result: "缺一封，不会补发", note: "校验和能帮助发现错误，UDP 本身不会因为报 2 消失就请求重传。" },
  { label: "应用取舍", packets: ["1", "2", "3", "4"], lost: "2", order: ["1", "4", "3"], result: "保留最新帧", note: "实时画面可以丢弃过时帧；如果数据不能丢，应用必须另加序号、确认和重试。" },
];

function UdpHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.udpHero} data-step={scene.step} aria-label="UDP 独立数据报在乱序和丢包后交给应用决定">
    <div className={styles.udpTop}><span>实时画面 · 四封独立数据报</span><strong>{current.label}</strong></div>
    <div className={styles.udpStage}>
      <div className={styles.udpSender}><Stack size={25} aria-hidden="true" /><span>发送端</span><strong>报 1 · 2 · 3 · 4</strong><small>每封保留边界</small></div>
      <div className={styles.udpPackets}>{current.packets.map((packet) => <div key={packet} className={styles.udpPacket} data-lost={current.lost === packet} data-reordered={current.order.length > 0 && current.order.indexOf(packet) !== Number(packet) - 1}><Stack size={18} aria-hidden="true" /><code>datagram {packet}</code><small>{current.lost === packet ? "丢失" : current.order.includes(packet) ? `第 ${current.order.indexOf(packet) + 1} 个到达` : "等待"}</small></div>)}</div>
      <div className={styles.udpReceiver}><CheckCircle size={25} aria-hidden="true" /><span>应用队列</span><strong>{current.result}</strong><small>{current.order.length ? current.order.join(" → ") : "尚无"}</small></div>
    </div>
    <div className={styles.udpEvidence} aria-live="polite">{scene.step === 2 ? <WarningCircle size={20} aria-hidden="true" /> : <CheckCircle size={20} aria-hidden="true" />}<p key={scene.step}><strong>{scene.step === 2 ? "协议边界" : "当前证据"}</strong>{current.note}</p></div>
    <div className={styles.udpTimeline} role="group" aria-label="UDP 数据报步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.udpControls} role="group" aria-label="控制 UDP 演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function UdpPolicyLab() {
  const [policy, setPolicy] = useState<"live" | "reliable">("live");
  const live = policy === "live";
  return <div className={styles.udpLab} role="region" aria-label="UDP 应用策略演示">
    <div className={styles.udpLabHead}><div><span>网络给了三封：1、4、3</span><strong>应用要等旧帧，还是先画最新一帧</strong></div><span>{live ? "实时播放" : "可靠文件"}</span></div>
    <div className={styles.udpLabBoard}>
      <div className={styles.udpLabNode}><Stack size={21} aria-hidden="true" /><span>到达队列</span><code>1 → 4 → 3</code></div><ArrowRight className={styles.udpArrow} size={19} aria-hidden="true" />
      <div className={styles.udpLabNode}><span>应用策略</span><strong>{live ? "按时间戳丢弃旧帧" : "按序号等待 / 请求补发"}</strong><code>{live ? "latest wins" : "missing=2"}</code></div><ArrowRight className={styles.udpArrow} size={19} aria-hidden="true" />
      <div className={styles.udpLabNode}>{live ? <CheckCircle size={21} aria-hidden="true" /> : <WarningCircle size={21} aria-hidden="true" />}<span>可观察结果</span><strong>{live ? "画面停在第 4 帧" : "停在第 1 帧等第 2 帧"}</strong></div>
    </div>
    <div className={styles.udpLabResult} data-warning={!live}>{live ? <CheckCircle size={20} aria-hidden="true" /> : <WarningCircle size={20} aria-hidden="true" />}<p><strong>{live ? "旧帧可以让路" : "可靠性要自己补"}</strong>{live ? "语音、视频或位置更新可能宁可跳过过期数据，也不让画面被一封迟到的数据报拖住。" : "UDP 不会替文件补齐缺口；应用需要序号、确认、重传、超时和去重，或者选用已有可靠传输。"}</p></div>
    <div className={styles.udpLabControls} role="group" aria-label="选择 UDP 应用策略"><button type="button" aria-pressed={live} onClick={() => setPolicy("live")}>实时帧：最新优先</button><button type="button" aria-pressed={!live} onClick={() => setPolicy("reliable")}>文件：缺口优先</button></div>
  </div>;
}

export function UdpTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={udpSources} />;
  return <ConceptArticle slug="udp" title="UDP" subtitle="User Datagram Protocol · 把一封封独立数据报交给应用" sources={udpSources} sections={[["udp-datagram-section", "UDP 交付的是一封封数据报"], ["udp-guarantees-section", "少做保证，应用多做决定"], ["udp-path-section", "路径上的风险仍要有人负责"], ["udp-boundary-section", "什么时候不该只用 UDP"]]} hero={<UdpHero />} intro={<>实时语音里，一封迟到的数据报有时比一封丢失的数据报更碍事：它回来时，画面已经走远。UDP 选择保留每封数据报的边界，却不替应用保证到达、顺序或去重；这让应用可以按自己的场景决定哪些数据值得等待。</>}>
    <ArticleSection id="udp-datagram-section" title="UDP 交付的是一封封数据报">
      <p id="udp-datagram" className="vp-citation-target">UDP 的最小报文包含源端口、目标端口、长度和校验和。端口把数据报交给对应的应用端点，长度让接收方知道这一封在哪里结束；它不会像 TCP 那样把相邻写入拼成一条没有边界的字节流。端口号登记只是服务命名与分配参考，不会替协议补可靠性。<Cite id="udp-datagram" /><Cite id="udp-port" /></p>
      <div className={styles.udpHeaderStrip}><div><span>Source Port</span><code>51000</code></div><div><span>Destination Port</span><code>4000</code></div><div><span>Length</span><code>64 bytes</code></div><div><span>Checksum</span><code>检测部分错误</code></div></div>
      <p id="udp-fields" className="vp-citation-target">校验和的作用是发现传输中的部分错误，不是承诺修复错误。收到的每一封数据报仍是一个独立结果；如果校验失败、数据报被丢弃，UDP 没有内建的补发步骤。<Cite id="udp-fields" /><Cite id="udp-checksum" /></p>
    </ArticleSection>
    <ArticleSection id="udp-guarantees-section" title="少做保证，应用多做决定">
      <p id="udp-delivery" className="vp-citation-target">UDP 不保证数据报一定到达、按序到达或只到达一次。上图里 1、4、3 仍各自完整，但应用必须知道它们的编号和时间，才能判断 4 是最新画面还是一次乱序。<Cite id="udp-delivery" /></p>
      <p id="udp-tradeoff" className="vp-citation-target">它不需要 TCP 那样的连接建立和维护状态，适合服务发现、实时媒体、查询响应等已经知道怎样处理缺失或过期数据的场景。少做传输层保证不是“天然更快”；应用重试、等待和排序照样会占用时间。<Cite id="udp-tradeoff" /></p>
      <UdpPolicyLab />
    </ArticleSection>
    <ArticleSection id="udp-path-section" title="路径上的风险仍要有人负责">
      <p id="udp-congestion" className="vp-citation-target">UDP 本身没有通用的拥塞控制。应用若持续高速发送，不能因为协议没有重传就忽略共享网络的容量；RFC 8085 要求使用合适的速率控制、响应放大防护和拥塞处理。<Cite id="udp-congestion" /></p>
      <p id="udp-size" className="vp-citation-target">大数据报还会遇到路径 MTU 和分片问题。把一个很大的消息直接塞进 UDP，会增加丢失一小片却丢掉整封数据报的概率；应用应控制报文大小，或使用已经处理这些取舍的上层协议。<Cite id="udp-size" /></p>
    </ArticleSection>
    <ArticleSection id="udp-boundary-section" title="什么时候不该只用 UDP">
      <p id="udp-port" className="vp-citation-target">服务发现用 UDP，不表示发现结果永远可靠；应用通常要设计超时、重试或多播范围。需要文件完整、顺序一致或明确确认的场景，应使用可靠传输，或在 UDP 之上采用已经定义这些语义的协议。<Cite id="udp-boundary" /></p>
      <p>换成上传一份合同：把它拆成数据报后，接收端必须知道缺了哪一封、如何补回、重复内容如何去重、最终怎样确认文件校验值。若这些规则已经写满应用协议，先问一句是否应直接使用 TCP 或其他可靠传输；“UDP 更轻”只有在责任边界真的适合时才有意义。</p>
    </ArticleSection>
  </ConceptArticle>;
}
