"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Funnel, ListNumbers, Network, Pause, PlugsConnected, Play, Radio, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { networkPortSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "TCP 53 建立连接",
    probe: "TCP 203.0.113.7:53",
    listener: "TCP 53 · DNS over TCP",
    result: "SYN-ACK",
    note: "有进程监听，防火墙也让这条 TCP 路径到达了端点。",
  },
  {
    label: "UDP 53 没有监听者",
    probe: "UDP 203.0.113.7:53",
    listener: "UDP 53 · no listener",
    result: "timeout",
    note: "数字仍是 53，但 UDP 有自己的端点；它不会继承 TCP 53 的监听状态。",
  },
  {
    label: "443 换协议",
    probe: "TCP 443 / UDP 443",
    listener: "TCP TLS · UDP 被过滤",
    result: "TCP ServerHello · UDP timeout",
    note: "同一主机、同一个数字，协议和网络过滤不同，客户端看到的结果也不同。",
  },
];

const probes = [
  { label: "TCP 53", request: "TCP 203.0.113.7:53", listener: "DNS over TCP · listening", filter: "allow", result: "SYN-ACK", good: true, detail: "端口、协议、监听和过滤四项都对上了。" },
  { label: "UDP 53", request: "UDP 203.0.113.7:53", listener: "no listener", filter: "allow", result: "timeout", good: false, detail: "放行只说明包能到这一关，主机上还要有 UDP 接收者。" },
  { label: "TCP 443", request: "TCP 203.0.113.7:443", listener: "TLS service · listening", filter: "allow", result: "ServerHello", good: true, detail: "端口可达后，应用协议才开始回应。" },
  { label: "UDP 443", request: "UDP 203.0.113.7:443", listener: "潜在服务未被看见", filter: "DROP", result: "timeout", good: false, detail: "防火墙先丢掉数据报，进程有没有监听已不是客户端能观察到的第一原因。" },
];

function NetworkPortHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.portHero} data-step={scene.step} aria-label="协议和端口一起把流量分发到服务端点">
    <div className={styles.portHeroTop}><span>同一台主机 · 203.0.113.7</span><strong>{current.result}</strong></div>
    <div className={styles.portHeroStage}>
      <div className={styles.portProbe}><Radio size={23} aria-hidden="true" /><span>探测器</span><strong>{current.probe}</strong><small>发出一次探测</small></div>
      <ArrowRight className={styles.portArrow} size={21} aria-hidden="true" />
      <div className={styles.portBoard}>
        <div className={styles.portBoardTitle}><Network size={22} aria-hidden="true" /><span>传输层分发板</span><ListNumbers size={18} aria-hidden="true" /></div>
        {["TCP 53", "UDP 53", "TCP / UDP 443"].map(label => <div key={label} className={styles.portBoardRow} data-active={(scene.step === 0 && label === "TCP 53") || (scene.step === 1 && label === "UDP 53") || (scene.step === 2 && label === "TCP / UDP 443")}><code>{label}</code><span>{label === current.listener.split(" · ")[0] ? "匹配" : label === "TCP / UDP 443" && scene.step === 2 ? "分别判断" : "等待"}</span></div>)}
      </div>
      <ArrowRight className={styles.portArrow} size={21} aria-hidden="true" />
      <div className={styles.portOutcome}><PlugsConnected size={23} aria-hidden="true" /><span>端点观察</span><strong>{current.listener}</strong><code>{current.result}</code></div>
    </div>
    <div className={styles.portEvidence}><Funnel size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.portTimeline} role="group" aria-label="网络端口首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.portControls} role="group" aria-label="控制网络端口演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停网络端口原理演示" : "播放网络端口原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function PortMatrixLab() {
  const [selected, setSelected] = useState(0);
  const current = probes[selected];
  return <div className={styles.portLab} role="region" aria-label="网络端口四格排查演示">
    <div className={styles.portLabHeader}><div><span>探测结果不是端口号自己说的</span><strong>把四个条件逐格对上</strong></div><span>{selected + 1} / {probes.length}</span></div>
    <div className={styles.portLabPath}>
      <div className={styles.portLabNode}><Radio size={19} aria-hidden="true" /><span>请求</span><strong>{current.request}</strong></div><ArrowRight className={styles.portArrow} size={18} aria-hidden="true" />
      <div className={styles.portLabNode} data-warning={!current.good}><Funnel size={19} aria-hidden="true" /><span>网络过滤</span><strong>{current.filter}</strong></div><ArrowRight className={styles.portArrow} size={18} aria-hidden="true" />
      <div className={styles.portLabNode}><PlugsConnected size={19} aria-hidden="true" /><span>监听状态</span><strong>{current.listener}</strong></div><ArrowRight className={styles.portArrow} size={18} aria-hidden="true" />
      <div className={styles.portLabNode} data-good={current.good}><span>客户端看到</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.portLabEvidence} data-warning={!current.good}>{current.good ? <CheckCircle size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}<p><strong>{current.label}</strong>{current.detail}</p></div>
    <div className={styles.portLabControls} role="group" aria-label="选择端口排查样本">{probes.map((probe, index) => <button type="button" key={probe.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{probe.label}</button>)}</div>
  </div>;
}

export function NetworkPortTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={networkPortSources} />;
  return <ConceptArticle slug="network-port" title="网络端口" subtitle="Network port · 把传输层流量交给正确端点的数字条件" sources={networkPortSources} sections={[["port-basics", "端口不是物理插口"], ["port-demux-section", "协议和端口要一起看"], ["port-check", "可达、监听、响应是三关"], ["port-service-section", "数字有登记，也不替服务背书"]]} hero={<NetworkPortHero />} intro={<>同一个 IP 上可以同时跑网站、DNS 和别的服务，因为传输层还会看端口。<strong>端口只是分发条件的一部分：</strong>协议、端口、监听进程和网络过滤有一项不对，探测结果就会变。<Cite id="port-definition" /></>}>
    <ArticleSection id="port-basics" title="端口不是物理插口">
      <p id="port-definition" className="vp-citation-target">端口是传输层用来区分端点的一段数字。TCP 首部有源端口和目的端口；UDP 也有这两个字段，但 UDP 不会因为数字相同就共享 TCP 的连接状态。<Cite id="port-definition" /></p>
      <p id="port-range" className="vp-citation-target">端口号的范围属于协议空间，服务名和登记号只是帮助人和工具约定用途。IANA 把系统端口、用户端口和动态端口分开管理；登记一个数字不等于某个程序一定正在使用它。<Cite id="port-range" /></p>
      <PortMatrixLab />
    </ArticleSection>
    <ArticleSection id="port-demux-section" title="协议和端口要一起看">
      <p id="port-demux" className="vp-citation-target">到达同一 IP 的 TCP 53 和 UDP 53 是两个不同端点。操作系统先按 IP 层和传输协议把报文交给相应模块，再由端口和连接信息找到接收者；因此“53 能通”这句话少了协议就不完整。<Cite id="port-demux" /></p>
      <p id="port-tcp" className="vp-citation-target">TCP 端口参与连接的区分，源端口通常让返回流量找到发起方；UDP 的源端口则是可选字段，目的端口只在特定目的地址的上下文里有意义。端口数字相同，连接模型仍可能完全不同。<Cite id="port-tcp" /></p>
      <p id="port-udp" className="vp-citation-target">UDP 提供的是轻量数据报传送，不保证交付、顺序或去重。看到 UDP 超时，不能直接推断“端口没开”：可能没有监听者，也可能数据报被过滤，应用还可能故意不回应。<Cite id="port-udp" /></p>
    </ArticleSection>
    <ArticleSection id="port-check" title="可达、监听、响应是三关">
      <p id="port-failure" className="vp-citation-target">排查端口时按顺序问：包有没有到主机，目标协议的端口有没有进程监听，进程有没有按应用协议回应。主机可以记录被丢弃的报文；客户端只看到超时或拒绝时，不能把三关压缩成“端口坏了”。<Cite id="port-failure" /></p>
      <p>上面的四格把这三个问题拆开：TCP 53 走到监听者并得到 SYN-ACK，UDP 53 没有接收者，TCP 443 进入 TLS，UDP 443 则在网络过滤处停止。每次只换一个条件，结果才有办法解释。</p>
    </ArticleSection>
    <ArticleSection id="port-service-section" title="数字有登记，也不替服务背书">
      <p id="port-service" className="vp-citation-target">IANA 的登记表把服务名、传输协议和端口号放在一起管理，但它明确提醒：流量经过已登记端口，不代表一定是对应服务，更不代表流量是安全的。防火墙和系统管理员仍要按实际流量配置规则。<Cite id="port-service" /></p>
      <p id="port-filter" className="vp-citation-target">所以看到一个端口号时，先写完整：目标 IP、TCP 还是 UDP、端口、监听地址、进程、网络过滤和实际响应。这样一条日志才足够让别人复现这次判断。<Cite id="port-filter" /></p>
    </ArticleSection>
  </ConceptArticle>;
}
