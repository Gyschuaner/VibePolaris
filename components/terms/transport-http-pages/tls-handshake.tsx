"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Key, LockKey, Pause, Play, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { tlsHandshakeSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "ClientHello", packet: "TLS 1.3 · key_share C", note: "客户端先报出支持的版本、算法和临时密钥材料；这一步还没有证明服务器身份。" },
  { label: "ServerHello", packet: "TLS_AES_128_GCM_SHA256", note: "双方选定本次连接的参数，开始导出握手所需的密钥材料。" },
  { label: "Certificate", packet: "SAN = api.example", note: "证书把公钥与服务身份关联起来，客户端还要检查信任链、有效期和主机名。" },
  { label: "Finished", packet: "handshake verified", note: "常规完整握手路径在这里确认记录没有被改动；TLS 1.3 的 0-RTT 是另一条带重放边界的路径。" },
  { label: "Encrypted record", packet: "GET /orders · ciphertext", note: "HTTP 请求进入加密记录，旁观者可以看到流量存在，却读不到明文内容。" },
];

function TlsHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.tlsHero} data-step={scene.step} aria-label="TLS 1.3 从协商参数、验证证书到发送加密应用数据">
    <div className={styles.tlsTop}><span>浏览器 → api.example · 一次 TLS 1.3 连接</span><strong>{current.label}</strong></div>
    <div className={styles.tlsStage}>
      <div className={styles.tlsEndpoint}><ShieldCheck size={25} aria-hidden="true" /><span>客户端要访问</span><strong>api.example</strong><small>{scene.step < 4 ? "等待握手完成" : "已进入安全通道"}</small></div>
      <div className={styles.tlsSequence}>{frames.map((frame, index) => <div key={frame.label} className={styles.tlsPacket} data-active={index === scene.step} data-muted={index > scene.step}><Key size={18} aria-hidden="true" /><code>{frame.packet}</code><small>{index < scene.step ? "已完成" : index === scene.step ? "当前" : "等待"}</small></div>)}</div>
      <div className={styles.tlsRecord}><LockKey size={25} aria-hidden="true" /><span>应用记录</span><strong>{scene.step === 4 ? "可发送" : "尚未发送"}</strong><small>{scene.step === 4 ? "ciphertext" : "握手边界"}</small></div>
    </div>
    <div className={styles.tlsEvidence} aria-live="polite">{scene.step === 4 ? <CheckCircle size={20} aria-hidden="true" /> : <WarningCircle size={20} aria-hidden="true" />}<p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.tlsTimeline} role="group" aria-label="TLS 握手步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.tlsControls} role="group" aria-label="控制 TLS 握手演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function TlsIdentityLab() {
  const [certificate, setCertificate] = useState<"match" | "mismatch">("match");
  const valid = certificate === "match";
  return <div className={styles.tlsLab} role="region" aria-label="TLS 证书主机名验证演示">
    <div className={styles.tlsLabHead}><div><span>证书链有效，还要问它属于谁</span><strong>只替换 SAN，观察 GET 是否能出发</strong></div><span>{valid ? "身份通过" : "身份不匹配"}</span></div>
    <div className={styles.tlsLabBoard}>
      <div className={styles.tlsLabNode}><ShieldCheck size={21} aria-hidden="true" /><span>客户端要访问</span><code>api.example</code></div><ArrowRight size={19} aria-hidden="true" />
      <div className={styles.tlsLabNode}><Key size={21} aria-hidden="true" /><span>证书身份</span><strong>{valid ? "SAN=api.example" : "SAN=other.example"}</strong><code>chain=trusted</code></div><ArrowRight size={19} aria-hidden="true" />
      <div className={styles.tlsLabNode}>{valid ? <CheckCircle size={21} aria-hidden="true" /> : <WarningCircle size={21} aria-hidden="true" />}<span>应用数据</span><strong>{valid ? "加密 GET /orders" : "未发送"}</strong></div>
    </div>
    <div className={styles.tlsLabResult} data-failed={!valid}>{valid ? <CheckCircle size={20} aria-hidden="true" /> : <WarningCircle size={20} aria-hidden="true" />}<p><strong>{valid ? "身份验证通过" : "握手终止"}</strong>{valid ? "信任链和主机名都匹配，Finished 通过后才把 HTTP 放进加密记录。" : "证书链即使有效，SAN 不是 api.example 也不能证明连接到了目标服务；客户端不应带着未知身份继续。"}</p></div>
    <div className={styles.tlsLabControls} role="group" aria-label="切换 TLS 证书主机名"><button type="button" aria-pressed={valid} onClick={() => setCertificate("match")}>SAN = api.example</button><button type="button" aria-pressed={!valid} onClick={() => setCertificate("mismatch")}>SAN = other.example</button></div>
  </div>;
}

export function TlsHandshakeTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={tlsHandshakeSources} />;
  return <ConceptArticle slug="tls-handshake" title="TLS 握手" subtitle="TLS Handshake · 先确认身份和密钥，再让应用数据上路" sources={tlsHandshakeSources} sections={[["tls-flow-section", "握手先把哪些条件凑齐"], ["tls-identity-section", "证书回答的是‘连到了谁’"], ["tls-record-section", "握手完成后才保护应用记录"], ["tls-boundary-section", "失败时应该停在哪里"]]} hero={<TlsHero />} intro={<>浏览器看到 HTTPS 小锁之前，客户端和服务器已经交换了几轮信息。本页展示的是常规完整握手：TLS 1.3 协商参数、验证服务身份并导出本次连接的会话密钥，随后 HTTP 请求进入受保护的记录层。TLS 1.3 另有 0-RTT early data 路径，发送时点和重放边界要单独判断。</>}>
    <ArticleSection id="tls-flow-section" title="握手先把哪些条件凑齐">
      <p id="tls-flow" className="vp-citation-target">TLS 1.3 握手让双方选择版本、密码套件和扩展，并交换导出共享密钥所需的材料。ClientHello 和 ServerHello 解决“用哪套规则说话”，Certificate、CertificateVerify 和 Finished 则把身份和握手完整性接上。<Cite id="tls-flow" /></p>
      <p id="tls-keys" className="vp-citation-target">临时密钥份额用于密钥交换，双方据此导出本次连接的握手密钥和应用流量密钥。私钥不会作为一段 HTTP 内容发送给对方；证书也不是拿来逐字加密整段网页的长期密码。<Cite id="tls-keys" /></p>
    </ArticleSection>
    <ArticleSection id="tls-identity-section" title="证书回答的是‘连到了谁’">
      <p id="tls-identity" className="vp-citation-target">证书把公钥与一个或多个服务身份绑定。客户端需要检查签发链是否可信、证书是否仍在有效期内，以及当前访问的主机名是否出现在证书的身份字段中；“签名能验过”只是其中一关。<Cite id="tls-identity" /></p>
      <p id="tls-hostname" className="vp-citation-target">如果用户访问的是 api.example，而证书只写 other.example，客户端就不能把这把公钥当作 api.example 的身份。继续加密只能保护“某个对端”，没有解决“是不是我想找的对端”。<Cite id="tls-hostname" /></p>
      <p id="tls-sni" className="vp-citation-target">在共享地址上，客户端还可以用 SNI 等扩展告诉服务器希望访问哪个服务名，让服务器选择对应证书。SNI 帮助服务器选证书，并不代替客户端最终的主机名验证。<Cite id="tls-sni" /></p>
      <TlsIdentityLab />
    </ArticleSection>
    <ArticleSection id="tls-record-section" title="握手完成后才保护应用记录">
      <p id="tls-record" className="vp-citation-target">在本页展示的常规完整握手路径中，TLS record protocol 对后续应用数据提供机密性和完整性保护。TLS 1.3 也定义了 0-RTT early data，它可能早于 Finished 发出，因而要额外评估重放风险和服务端是否允许；抓包者仍能观察连接的时间、大小和方向，“加密”主要隐藏内容并检测篡改，不会把网络行为变成不可见。<Cite id="tls-record" /></p>
      <div className={styles.tlsKeyStrip}><div><span>握手阶段</span><code>协商 + 认证</code></div><div><span>密钥阶段</span><code>导出会话密钥</code></div><div><span>记录阶段</span><code>保护 HTTP bytes</code></div></div>
    </ArticleSection>
    <ArticleSection id="tls-boundary-section" title="失败时应该停在哪里">
      <p id="tls-failure" className="vp-citation-target">证书过期、信任链断裂、主机名不匹配、没有共同协议参数，都可能让常规握手终止。失败时客户端不应把“已经收到了 ServerHello”当成“可以安全发送订单请求”；若启用了 0-RTT，还要先确认这类 early data 是否可重放、是否适合当前操作。<Cite id="tls-failure" /></p>
      <p id="tls-boundary" className="vp-citation-target">TLS 保护的是端点之间的传输通道；数据在服务器终止 TLS 后会以明文进入应用、日志或下游服务。它不检查业务权限、返回内容是否正确，也不能替端点内部的存储和访问控制负责。<Cite id="tls-boundary" /></p>
      <p>排查 HTTPS 问题时，把目标主机名、SNI、证书链、有效期、协商出的版本和密码套件一起记录。这样可以区分“没有共同协议”“证书身份不对”和“握手成功后应用返回错误”这三种完全不同的故障。</p>
    </ArticleSection>
  </ConceptArticle>;
}
