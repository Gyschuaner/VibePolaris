"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, DeviceMobile, DeviceTablet, Globe, Laptop, MapPinLine, Network, Pause, Play, WarningCircle } from "@phosphor-icons/react";

import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { ipAddressSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "手机先出门",
    device: "手机",
    source: "192.168.1.11:51001",
    publicPort: "62001",
    remote: "src 203.0.113.7:62001",
    note: "出口把私网地址换成公网地址，并记下这次端口对应关系。",
    deviceIndexes: [0],
  },
  {
    label: "电脑和平板加入",
    device: "电脑 + 平板",
    source: "192.168.1.12:51002 · 192.168.1.13:51003",
    publicPort: "62002 · 62003",
    remote: "src 203.0.113.7:62002 · :62003",
    note: "远端看到的 IP 仍没变，两个端口让返回包分别回到电脑和平板。",
    deviceIndexes: [1, 2],
  },
  {
    label: "日志只剩一个 IP",
    device: "三台设备",
    source: "3 条私网映射",
    publicPort: "62001 · 62002 · 62003",
    remote: "unique IP count = 1",
    note: "按 IP 聚合会把三台设备合成一个来源；要继续区分，还得看端口或应用会话。",
    deviceIndexes: [0, 1, 2],
  },
];

const devices = [
  { label: "手机", address: "192.168.1.11:51001", Icon: DeviceMobile },
  { label: "电脑", address: "192.168.1.12:51002", Icon: Laptop },
  { label: "平板", address: "192.168.1.13:51003", Icon: DeviceTablet },
];

function IpAddressHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.ipHero} data-step={scene.step} aria-label="三台私网设备经过 NAT 后共享一个公网 IP">
    <div className={styles.ipHeroTop}><span>远端 API 的访问日志</span><strong>{current.remote}</strong></div>
    <div className={styles.ipHeroStage}>
      <div className={styles.ipDeviceStack} aria-label="局域网设备">
        {devices.map(({ label, address, Icon }, index) => <div key={label} className={styles.ipDevice} data-active={current.deviceIndexes.includes(index)}>
          <Icon size={20} aria-hidden="true" /><span>{label}</span><code>{address}</code>
        </div>)}
      </div>
      <ArrowRight className={styles.ipArrow} size={21} aria-hidden="true" />
      <div className={styles.ipNat}>
        <Network size={25} aria-hidden="true" /><span>NAT 路由器</span><strong>203.0.113.7</strong>
        <small>改写来源并保存映射</small>
      </div>
      <ArrowRight className={styles.ipArrow} size={21} aria-hidden="true" />
      <div className={styles.ipRemote}>
        <Globe size={23} aria-hidden="true" /><span>远端 API</span><strong>{current.remote}</strong><small>服务器日志能看到的那一跳</small>
      </div>
    </div>
    <div className={styles.ipMapping}>
      <span><MapPinLine size={16} aria-hidden="true" />出口映射表</span>
      <code>{current.source} → 203.0.113.7:{current.publicPort}</code>
      <p key={scene.step}>{current.note}</p>
    </div>
    <div className={styles.ipTimeline} role="group" aria-label="IP 地址首图步骤">
      {frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}
    </div>
    <div className={styles.ipControls} role="group" aria-label="控制 IP 地址演示">
      <button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停 IP 地址原理演示" : "播放 IP 地址原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button>
      <button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button>
    </div>
  </figure>;
}

function IpAddressLab() {
  const [view, setView] = useState<"log" | "mapping">("log");
  const mappings = [
    ["手机", "192.168.1.11:51001", "203.0.113.7:62001"],
    ["电脑", "192.168.1.12:51002", "203.0.113.7:62002"],
    ["平板", "192.168.1.13:51003", "203.0.113.7:62003"],
  ];
  return <div className={styles.ipLab} role="region" aria-label="IP 地址日志与 NAT 映射演示">
    <div className={styles.ipLabHeader}><div><span>同一条日志，能说明多少？</span><strong>先看远端，再把出口表展开</strong></div><span>{view === "log" ? "远端视角" : "出口视角"}</span></div>
    {view === "log" ? <div className={styles.ipLog}>
      {mappings.map(([device, , publicAddress]) => <div key={device}><Globe size={17} aria-hidden="true" /><span>{device} 的请求</span><code>{publicAddress.split(":")[0]}</code></div>)}
      <div className={styles.ipLabEvidence} data-warning="true"><WarningCircle size={20} aria-hidden="true" /><p><strong>三个请求，日志里只有一个公网 IP。</strong> 这足够做粗粒度来源统计，却不能证明是同一台设备。</p></div>
    </div> : <div className={styles.ipMappingTable}>
      <div className={styles.ipTableHead}><span>设备</span><span>出站前</span><span>出站后</span></div>
      {mappings.map(([device, privateAddress, publicAddress]) => <div key={device} className={styles.ipTableRow}><span>{device}</span><code>{privateAddress}</code><code>{publicAddress}</code></div>)}
      <div className={styles.ipLabEvidence}><CheckCircle size={20} aria-hidden="true" /><p><strong>映射表补回了差异。</strong> 端口能帮助路由器把返回流量送回正确的连接，但它仍不是用户身份。</p></div>
    </div>}
    <div className={styles.ipLabControls} role="group" aria-label="切换 IP 地址观察视角">
      <button type="button" aria-pressed={view === "log"} onClick={() => setView("log")}>只看远端日志</button>
      <button type="button" aria-pressed={view === "mapping"} onClick={() => setView("mapping")}>展开 NAT 映射</button>
    </div>
  </div>;
}

export function IpAddressTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={ipAddressSources} />;
  return <ConceptArticle slug="ip-address" title="IP 地址" subtitle="IP address · 网络接口在某一层的可达位置" sources={ipAddressSources} sections={[
    ["ip-location", "它标的是哪一个位置"],
    ["ip-translation", "地址为什么会在出口变掉"],
    ["ip-log", "日志里的一个地址能说明什么"],
    ["ip-version", "IPv4 和 IPv6 仍然在做同一件事"],
  ]} hero={<IpAddressHero />} intro={<>服务器日志里三个请求的源 IP 完全相同，不一定来自同一台设备。地址先服务于路由；经过 NAT 出口后，远端看到的可能只是“哪一个出口”而不是“哪一个人”。<Cite id="ip-observation" /></>}>
    <ArticleSection id="ip-location" title="它标的是哪一个位置">
      <p id="ip-definition" className="vp-citation-target">IP 地址放在网络层报文里，告诉当前这一跳要把数据送向哪个网络接口。IPv4 的地址是 32 位，IPv6 把地址扩展到 128 位；它们都参与转发，却不负责替应用确认用户是谁。<Cite id="ip-definition" /></p>
      <p id="ip-routing" className="vp-citation-target">路由器拿目的地址和自己的路由表比较，选出下一跳。这个过程只回答“往哪边送”，不会顺便回答“这个请求有没有权限”。一台主机也可能有多个接口，所以地址和设备不是一对一的固定标签。<Cite id="ip-routing" /></p>
      <IpAddressLab />
    </ArticleSection>
    <ArticleSection id="ip-translation" title="地址为什么会在出口变掉">
      <p id="ip-private" className="vp-citation-target">RFC 1918 为私有网络保留了 10/8、172.16/12 和 192.168/16 等地址段。它们可以在不同家庭、办公室里重复使用，因为这些地址不承担全球唯一的含义；私网主机要访问外部服务，通常需要经过网关。<Cite id="ip-private" /></p>
      <p id="ip-nat" className="vp-citation-target">传统 NAT 会在出口建立映射，把内部的地址和端口换成一个公网地址及新的端口，并在返回时按表改回去。上面的三台设备因此可以共享 203.0.113.7，但每条连接仍有自己的端口记录。<Cite id="ip-nat" /></p>
    </ArticleSection>
    <ArticleSection id="ip-log" title="日志里的一个地址能说明什么">
      <p id="ip-observation" className="vp-citation-target">远端服务记录到的源 IP 是它收到的那一跳。NAT 或企业出口可能让许多客户端共享一个地址。用 IP 做限流或排查线索可以，但把它直接当成用户身份会误伤共享网络中的其他人。<Cite id="ip-observation" /></p>
      <p>想继续区分请求，可以结合连接端口、登录会话或设备自己的标识。它们解决的是不同问题：IP 帮路由，端口帮复用连接，会话才可能把多次请求关联到一次登录。</p>
    </ArticleSection>
    <ArticleSection id="ip-version" title="IPv4 和 IPv6 仍然在做同一件事">
      <p id="ip-ipv6" className="vp-citation-target">IPv6 不是把“IP 地址”换成另一种用户编号。它把地址空间扩大，并调整了首部、扩展头和邻居发现等机制；它仍然负责把网络层报文送到接口，而不是替应用确认用户身份。<Cite id="ip-ipv6" /></p>
      <p>看到一个地址时，先问三个问题：这是哪一层看到的？它有没有经过 NAT？这次判断要解决路由、统计、限流还是身份？问题问对了，IP 才不会被迫承担它没有提供的答案。</p>
    </ArticleSection>
  </ConceptArticle>;
}
