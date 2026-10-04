"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Globe, LockSimple, MapPinLine, Network, Pause, Play, Radio, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { hostnameSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "名字交给解析器",
    result: "A / AAA 答案回来",
    name: "api.example.com",
    answer: "203.0.113.10 · 203.0.113.11",
    connection: "还没有连接",
    identity: "等 DNS 结果",
    host: "还没有 Host",
    note: "主机名是给人和协议看的名字；解析器先把它换成可用于连接的地址，服务是否真的在那边还没被证明。",
  },
  {
    label: "挑一条地址建立连接",
    result: "203.0.113.10:443",
    name: "api.example.com",
    answer: "203.0.113.10 · 203.0.113.11",
    connection: "203.0.113.10:443",
    identity: "TLS 等待验证",
    host: "保留 api.example.com",
    note: "一个名字可以得到多条地址；客户端选定其中一条建立 TCP 连接，但原来的名字仍要带进后续身份和应用路由。",
  },
  {
    label: "名字在两层继续出现",
    result: "API 返回 200",
    name: "api.example.com",
    answer: "203.0.113.10",
    connection: "203.0.113.10:443",
    identity: "DNS-ID api.example.com ✓",
    host: "Host: api.example.com",
    note: "TLS 用名字核对证书，HTTP 用 Host 选择虚拟主机；IP 负责把包送到机器，名字负责告诉服务‘你要的是哪一个服务’。",
  },
];

const scenarios = [
  {
    label: "名字全程一致",
    name: "api.example.com",
    dns: "203.0.113.10",
    connection: "203.0.113.10:443",
    identity: "SNI + DNS-ID api.example.com",
    host: "Host: api.example.com",
    result: "200 · API JSON",
    good: true,
    note: "解析结果、TLS 名称和 HTTP Host 指向同一个服务身份，连接地址只是这次选择的入口。",
  },
  {
    label: "只换 Host",
    name: "api.example.com",
    dns: "203.0.113.10",
    connection: "203.0.113.10:443",
    identity: "SNI + DNS-ID api.example.com",
    host: "Host: admin.example.com",
    result: "另一个虚拟主机",
    good: false,
    note: "TCP 和证书都可能已经通过，但同一 IP 上的 HTTP 路由被 Host 改到了另一个名称；看到 404 或另一站点时要查这一层。",
  },
  {
    label: "只换 TLS 名称",
    name: "api.example.com",
    dns: "203.0.113.10",
    connection: "203.0.113.10:443",
    identity: "SNI admin.example.com · cert api.example.com",
    host: "请求尚未发送",
    result: "TLS 证书不匹配",
    good: false,
    note: "IP 能连通不等于 HTTPS 身份正确；证书中的 DNS-ID 必须能证明目标名称，握手会在 HTTP 之前停下。",
  },
  {
    label: "缓存还留着旧地址",
    name: "api.example.com",
    dns: "203.0.113.9 · cached",
    connection: "203.0.113.9:443",
    identity: "证书来自旧边缘",
    host: "Host: api.example.com",
    result: "旧版本 / 连接失败",
    good: false,
    note: "名字没有变，解析结果却可能来自缓存；排查时要把回答来源和 TTL 一起记下，不能只看地址栏。",
  },
];

function HostnameHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hostnameHero} data-step={scene.step} aria-label="主机名从 DNS 解析到 TLS 和 HTTP 服务身份的过程">
    <div className={styles.hostnameHeroTop}><span>同一个名字 · 经过三层边界</span><strong>{current.result}</strong></div>
    <div className={styles.hostnameHeroStage}>
      <div className={styles.hostnameNameCard} data-active={scene.step === 0}>
        <div className={styles.hostnameCardHeading}><Globe size={22} aria-hidden="true" /><span>名字</span></div>
        <code>{current.name}</code>
        <small>人和协议记住的目标</small>
      </div>
      <ArrowRight className={styles.hostnameArrow} size={21} aria-hidden="true" />
      <div className={styles.hostnameRouteCard} data-active={scene.step === 1}>
        <div className={styles.hostnameCardHeading}><Network size={22} aria-hidden="true" /><span>解析与连接</span></div>
        <div className={styles.hostnameValue}><small>DNS answer</small><code>{current.answer}</code></div>
        <div className={styles.hostnameValue}><small>TCP target</small><code>{current.connection}</code></div>
      </div>
      <ArrowRight className={styles.hostnameArrow} size={21} aria-hidden="true" />
      <div className={styles.hostnameServiceCard} data-active={scene.step === 2}>
        <div className={styles.hostnameCardHeading}><LockSimple size={22} aria-hidden="true" /><span>服务身份</span></div>
        <div className={styles.hostnameValue}><small>TLS</small><code>{current.identity}</code></div>
        <div className={styles.hostnameValue}><small>HTTP</small><code>{current.host}</code></div>
      </div>
    </div>
    <div className={styles.hostnameEvidence}><MapPinLine size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.hostnameTimeline} role="group" aria-label="主机名首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.hostnameControls} role="group" aria-label="控制主机名原理演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停主机名原理演示" : "播放主机名原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function HostnameLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  return <div className={styles.hostnameLab} role="region" aria-label="主机名跨层排查实验">
    <div className={styles.hostnameLabHeader}><div><span>不要只问“这个 IP 通不通”</span><strong>把名字、地址和身份逐层对上</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.hostnameLabPath}>
      <div className={styles.hostnameLabNode}><Radio size={19} aria-hidden="true" /><span>输入名字</span><code>{current.name}</code></div><ArrowRight className={styles.hostnameArrow} size={18} aria-hidden="true" />
      <div className={styles.hostnameLabNode}><Network size={19} aria-hidden="true" /><span>DNS / TCP</span><code>{current.dns}</code><code>{current.connection}</code></div><ArrowRight className={styles.hostnameArrow} size={18} aria-hidden="true" />
      <div className={styles.hostnameLabNode}><LockSimple size={19} aria-hidden="true" /><span>TLS / HTTP</span><code>{current.identity}</code><code>{current.host}</code></div><ArrowRight className={styles.hostnameArrow} size={18} aria-hidden="true" />
      <div className={styles.hostnameLabNode} data-good={current.good}><span>最后看到</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.hostnameLabEvidence} data-warning={!current.good}>{current.good ? <CheckCircle size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}<p><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.hostnameLabControls} role="group" aria-label="选择主机名排查样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function HostnameTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={hostnameSources} />;
  return <ConceptArticle slug="hostname" title="主机名" subtitle="Hostname · 给网络服务使用的可读名字" sources={hostnameSources} sections={[["hostname-shape", "名字不是地址"], ["hostname-resolution", "解析会给你一组可能的地址"], ["hostname-identity", "TLS 和 HTTP 还会继续使用名字"], ["hostname-debug", "排查时把三层证据放在一起"]]} hero={<HostnameHero />} intro={<>你记住的是 <code>api.example.com</code>，网络先把它换成地址，再用原来的名字核对证书和服务。<strong>主机名是一条跨层传递的线索，不是某台机器的永久身份证。</strong><Cite id="hostname-definition" /></>}>
    <ArticleSection id="hostname-shape" title="名字不是地址">
      <p id="hostname-definition" className="vp-citation-target">主机名通常是由点分开的标签，例如 <code>api.example.com</code>。DNS 把这些名字放进树状命名空间；名字可以指向一个节点、一个别名或一组资源记录，所以它描述的是“怎样称呼目标”，不是一张固定网卡。<Cite id="hostname-definition" /></p>
      <p id="hostname-syntax" className="vp-citation-target">“hostname”这个词在不同系统里用得并不总是一样：有人指完整的 FQDN，有人只指第一段 <code>api</code>。常见主机名标签允许字母、数字和连字符，大小写比较通常不区分；写下完整名称和末尾点的语境，才能避免把相对名当成完整地址。<Cite id="hostname-syntax" /></p>
      <HostnameLab />
    </ArticleSection>
    <ArticleSection id="hostname-resolution" title="解析会给你一组可能的地址">
      <p id="hostname-resolution-detail" className="vp-citation-target">应用把主机名交给 resolver，resolver 从缓存或 DNS name server 得到与该名称关联的记录，再返回一个或多个 IP 地址。解析器把分布在不同服务器上的 DNS 数据藏在一个查询接口后面，回答本身并不等于目标应用已经健康。<Cite id="hostname-resolution" /></p>
      <p id="hostname-multihomed" className="vp-citation-target">同一个名字有多个地址时，客户端可能按偏好选择其中一条，失败后再尝试另一条；不同地址意味着不同路径、边缘节点或故障域。排查时把回答里的全部地址、顺序和 TTL 留下来，才能解释“有时能开、有时超时”。<Cite id="hostname-multihomed" /></p>
    </ArticleSection>
    <ArticleSection id="hostname-identity" title="TLS 和 HTTP 还会继续使用名字">
      <p id="hostname-tls" className="vp-citation-target">HTTPS 不把 DNS 返回的 IP 直接当作服务身份。TLS 客户端要用目标主机名去核对证书里的 DNS-ID；证书证明的是“这个名称的服务”，不是“这次恰好连到的数字地址”。因此 IP 可达、TCP 成功，仍可能在握手时因名称不匹配停下。<Cite id="hostname-tls" /></p>
      <p id="hostname-host" className="vp-citation-target">握手完成后，HTTP 还会把目标的 host 和 port 放进 Host（HTTP/2、HTTP/3 对应 <code>:authority</code>）。同一个 IP 上有多个虚拟主机时，服务器靠这个字段把请求分给正确站点；只改 Host，可能得到另一站点或被当成误定向请求。<Cite id="hostname-host" /></p>
    </ArticleSection>
    <ArticleSection id="hostname-debug" title="排查时把三层证据放在一起">
      <p id="hostname-diagnostic" className="vp-citation-target">一次完整记录至少要有：用户输入的主机名、DNS 回答及来源、实际选择的 IP 和端口、TLS 使用的名称与证书标识、HTTP Host，以及最终响应。每一层都通过后，才可以说“这个名字指向的服务完成了请求”。<Cite id="hostname-diagnostic" /></p>
      <p>所以“ping 通了”只能说明某个地址对 ICMP 或探测作出回应；它回答不了证书是否匹配，也回答不了 Host 会把请求送到哪一个虚拟主机。把上面实验里的一个条件单独替换，失败就会停在不同的层，诊断才不会变成猜谜。</p>
    </ArticleSection>
  </ConceptArticle>;
}
