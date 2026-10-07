"use client";

import { ArrowCounterClockwise, Browser, CheckCircle, Cloud, Eye, HardDrives, LockKey, Network, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { encryptionTransitSources } from "@/lib/encryption-transit-sources";
import styles from "./EncryptionTransitConceptPage.module.css";

type SealState = "idle" | "checking" | "sealed" | "open" | "blocked";

const hops = [
  { label: "浏览器 → CDN", host: "orders.example", Icon: Browser },
  { label: "CDN → 负载均衡", host: "lb.internal", Icon: Cloud },
  { label: "负载均衡 → 应用", host: "orders-api", Icon: HardDrives },
];

const frames: Array<{
  label: string;
  phase: string;
  seals: SealState[];
  packet: string;
  note: string;
  status: string;
  danger?: boolean;
}> = [
  { label: "先封住第一段", phase: "SEAL A", seals: ["sealed", "idle", "idle"], packet: "TLS record · 0x7a…", note: "抓包只看见密文", status: "浏览器把订单交给第一个 TLS 端点。" },
  { label: "对端身份待核对", phase: "CHECK", seals: ["sealed", "checking", "idle"], packet: "ClientHello → ServerHello", note: "版本 / key share / 证书", status: "先确认规则和服务身份，应用数据还不能抢跑。" },
  { label: "代理打开这一段", phase: "OPEN", seals: ["sealed", "open", "idle"], packet: "Authorization: Bearer …", note: "CDN → LB 暂时可见", status: "外层 TLS 在 CDN 终止，下一跳没有自动继承那把锁。", danger: true },
  { label: "重新盖上下一枚封条", phase: "RESEAL", seals: ["sealed", "sealed", "sealed"], packet: "TLS record · 0x7a…", note: "三段抓包都是密文", status: "每一对端点各自握手、验身份，再让请求继续。" },
  { label: "身份不对就停下", phase: "STOP", seals: ["sealed", "blocked", "idle"], packet: "请求未发送", note: "SAN ≠ lb.internal · 0 B", status: "证书链可信也不够；目标身份不匹配，订单停在握手边界。", danger: true },
];

function SealIcon({ state }: { state: SealState }) {
  if (state === "sealed") return <CheckCircle size={14} aria-hidden="true" />;
  if (state === "blocked") return <XCircle size={14} aria-hidden="true" />;
  if (state === "open") return <Eye size={14} aria-hidden="true" />;
  return <LockKey size={14} aria-hidden="true" />;
}

function EncryptionTransitHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const locked = current.seals.filter((state) => state === "sealed").length;
  return <figure ref={scene.ref} className={styles.hero} aria-label="一份订单经过每一跳的 TLS 封条检查">
    <div className={styles.heroTop}><span>TRANSIT SEALS / 3 HOPS</span><strong>{current.phase} · {locked}/3</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.sealBoard} data-phase={current.phase}>
      <div className={styles.parcel} data-danger={current.danger === true}>
        {current.danger ? <WarningCircle size={20} aria-hidden="true" /> : <ShieldCheck size={20} aria-hidden="true" />}
        <div className={styles.parcelText}><span>同一份订单包裹</span><code>{current.packet}</code><small>{current.note}</small></div>
        <span className={styles.parcelMark}>{current.danger ? "STOP" : "SEALED"}</span>
      </div>
      <div className={styles.sealStrip} aria-label="三段 TLS 封条">
        {hops.map(({ label, host, Icon }, index) => <div className={styles.seal} data-state={current.seals[index]} key={label}>
          <span className={styles.sealIcon}><SealIcon state={current.seals[index]} /></span><strong><Icon size={12} aria-hidden="true" /> {label}</strong><small>{current.seals[index] === "sealed" ? `TLS · ${host}` : current.seals[index] === "checking" ? "证书与身份检查中" : current.seals[index] === "open" ? "应用字段可见" : current.seals[index] === "blocked" ? "SAN mismatch" : "等待上一段"}</small>
        </div>)}
      </div>
    </div>
    <div className={styles.heroNote} data-danger={current.danger === true} role="status" aria-live="polite">{current.danger ? <WarningCircle size={16} aria-hidden="true" /> : <LockKey size={16} aria-hidden="true" />}<span><strong>{current.label}</strong> · {current.status}</span></div>
    <figcaption>这里追踪的是“包裹在每一跳有没有重新盖封条”，不是一条把浏览器和应用画成同一个端点的箭头。</figcaption>
  </figure>;
}

type Scenario = "full" | "clear" | "identity";
const scenarios: Record<Scenario, { label: string; states: SealState[]; payload: string; verdict: string; detail: string; danger: boolean }> = {
  full: { label: "每一跳重新加密", states: ["sealed", "sealed", "sealed"], payload: "TLS record · ciphertext", verdict: "PASS · 3 / 3 封条有效", detail: "Authorization 只在端点短暂出现，链路抓包看不到正文。", danger: false },
  clear: { label: "CDN 后回退 HTTP", states: ["sealed", "open", "sealed"], payload: "Authorization: Bearer …", verdict: "LEAK · CDN → LB 明文", detail: "外层锁仍然亮着，但中间这一段的敏感字段已经能被读到。", danger: true },
  identity: { label: "内部证书身份错误", states: ["sealed", "blocked", "idle"], payload: "0 B · 未发送", verdict: "BLOCKED · SAN ≠ lb.internal", detail: "证书签名可信不等于它属于目标服务；修好身份后才能重建下一跳。", danger: true },
};

function EncryptionTransitLab() {
  const [scenario, setScenario] = useState<Scenario>("full");
  const [checked, setChecked] = useState(false);
  const current = scenarios[scenario];
  return <div className={styles.lab} aria-label="传输中加密封条审查实验">
    <div className={styles.labTop}><span>LOCAL AUDIT / NO NETWORK</span><strong>逐段验收</strong></div>
    <div className={styles.modeButtons} role="group" aria-label="选择链路情景">{Object.entries(scenarios).map(([key, value]) => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key as Scenario); setChecked(false); }}>{value.label}</button>)}</div>
    <div className={styles.labLedger} aria-label="三段封条状态">{hops.map(({ label }, index) => <div className={styles.ledgerRow} data-state={current.states[index]} key={label}><span>{label}</span><strong>{current.states[index] === "sealed" ? "TLS · 已封" : current.states[index] === "open" ? "HTTP · 可见" : current.states[index] === "blocked" ? "握手 · 拒绝" : "尚未建立"}</strong><code>{index === 1 && scenario === "identity" ? "SAN ≠ lb.internal" : index === 1 && scenario === "clear" ? "Authorization visible" : current.states[index] === "sealed" ? "ciphertext" : "—"}</code></div>)}</div>
    <div className={styles.labActions}><button type="button" onClick={() => setChecked(true)}><LockKey size={13} aria-hidden="true" />检查封条</button><button type="button" onClick={() => { setScenario("full"); setChecked(false); }}><ArrowCounterClockwise size={13} aria-hidden="true" />重置</button></div>
    <div className={styles.labVerdict} data-danger={checked && current.danger} role="status" aria-live="polite">{checked && current.danger ? <WarningCircle size={16} aria-hidden="true" /> : checked ? <CheckCircle size={16} aria-hidden="true" /> : <Network size={16} aria-hidden="true" />}<span><strong>{checked ? current.verdict : "还没有验收"}</strong> · {checked ? current.detail : `请求载荷：${current.payload}。先选择一条链路，再检查每一跳。`}</span></div>
  </div>;
}

const sections: [string, string][] = [
  ["encryption-transit-definition-section", "一把锁只护住一段通道"],
  ["encryption-transit-handshake-section", "先认对端，再让应用数据上路"],
  ["encryption-transit-hop-section", "代理打开后，下一跳要重新盖封条"],
  ["encryption-transit-failure-section", "身份和协议不对，就停在边界"],
  ["encryption-transit-boundary-section", "TLS 之外还有授权与重放边界"],
];

export function EncryptionTransitTermPage() {
  return <Article slug="encryption-in-transit" title="传输中加密" subtitle="Encryption in Transit · 每一跳都要重新验锁" sources={encryptionTransitSources} sections={sections} hero={<EncryptionTransitHero />} intro={<>一笔订单从浏览器出发，可能先到 CDN，再到负载均衡器，最后才进入应用。<strong>地址栏的小锁只证明当前端点之间的 TLS 通道通过了检查；真正决定保护范围的，是每个代理在哪里拆包、下一跳有没有重新握手，以及证书究竟指向谁。</strong></>}>
    <ArticleSection id="encryption-transit-definition-section" title="一把锁只护住一段通道">
      <p id="transit-channel" className="vp-citation-target"><strong>传输中加密保护的是一对端点之间的通道。</strong>TLS 通过握手协商参数和密钥，再用记录层保护应用数据的机密性与完整性，并把服务身份带进验证过程。它不会让连接的时间、方向或大致流量大小消失；它回答的是“旁观者能不能直接读写这段内容”。<Cite id="transit-channel" sources={encryptionTransitSources} /></p>
      <p id="transit-endpoint" className="vp-citation-target">锁的边界在 TLS 终止的端点。服务器或反向代理解密后，请求会以应用能处理的形式出现，可能进入日志、缓存，或者被重新交给下游。保存中的数据库副本属于静态加密，服务之间的下一段属于另一条传输通道；把三者都叫“有 HTTPS”会遮住实际检查点。<Cite id="transit-endpoint" sources={encryptionTransitSources} /></p>
      <p>因此首图里那份包裹没有被一条长箭头直接送进应用：它在每一个跳点留下一个独立的封条。看见三枚封条都盖好，才有理由说这条链路的抓包结果仍是密文。</p>
    </ArticleSection>

    <ArticleSection id="encryption-transit-handshake-section" title="先认对端，再让应用数据上路">
      <p id="transit-handshake" className="vp-citation-target">TLS 1.3 的握手先协商版本、密码参数与密钥交换材料，随后才用导出的流量密钥保护应用记录。ClientHello 和 ServerHello 是在确定“按哪套规则说话”，不是一收到就代表订单已经安全到达；握手失败时，应用数据不应抢跑。<Cite id="transit-handshake" sources={encryptionTransitSources} /></p>
      <p id="transit-identity" className="vp-citation-target">客户端还要验证自己期待的 reference identity 与证书呈现的身份。证书链能验过，只说明签名关系可信；如果客户端要找 `orders.example`，证书却只写了另一个名字，连接仍然不能被当作目标服务。<Cite id="transit-identity" sources={encryptionTransitSources} /></p>
      <p id="transit-san" className="vp-citation-target">RFC 9525 把常见 DNS 服务身份放在 `subjectAltName` 的 `dNSName` 中，IP 地址也有对应的身份类型。主机名验证不是“字符串看起来像”就算通过，而是按身份类型与匹配规则检查；封条上盖的是别人的名字，就应该停在门口。<Cite id="transit-san" sources={encryptionTransitSources} /></p>
      <p id="transit-sni" className="vp-citation-target">共享地址上的 SNI 可以告诉服务器客户端想访问哪个服务名，帮助它挑选证书；它不会替客户端完成最终的主机名验证。选对证书和验证证书是两个相连但不同的动作，演示中的 `CHECK` 刻意把它们分开。<Cite id="transit-sni" sources={encryptionTransitSources} /></p>
    </ArticleSection>

    <ArticleSection id="encryption-transit-hop-section" title="代理打开后，下一跳要重新盖封条">
      <p id="transit-record" className="vp-citation-target">TLS record protocol 使用握手导出的流量密钥保护应用记录。CDN 解密一段请求，并不把这份保护“传递”给 CDN 到负载均衡器的连接；那一段必须拥有自己的握手、证书和记录密钥。<Cite id="transit-record" sources={encryptionTransitSources} /></p>
      <p id="transit-hop" className="vp-citation-target">OWASP 对反向代理或负载均衡器终止 TLS 后的后续链路给出同一个边界：后续段也需要自己的保护。下面的实验故意把 `Authorization` 放在包裹上，让你只改变中间这一枚封条，就能看到从 `ciphertext` 变成明文；这比把一条绿色箭头标成“安全”更接近真实排查。<Cite id="transit-hop" sources={encryptionTransitSources} /></p>
      <EncryptionTransitLab />
      <p id="transit-all-pages" className="vp-citation-target">保护范围还不能只覆盖登录页。OWASP 建议全站使用 TLS，API 在不能重定向时应直接拒绝明文 HTTP；否则攻击者可以从普通页面、回退入口或混合资源里重新找到会话材料。<Cite id="transit-all-pages" sources={encryptionTransitSources} /></p>
      <p id="transit-cookie" className="vp-citation-target">会话 Cookie 的 `Secure` 属性让浏览器不把它送进明文连接，是端点侧的补充护栏。它不能替服务器给每个下一跳建立 TLS，也不能让代理日志自动变成密文。<Cite id="transit-cookie" sources={encryptionTransitSources} /></p>
    </ArticleSection>

    <ArticleSection id="encryption-transit-failure-section" title="身份和协议不对，就停在边界">
      <p id="transit-config" className="vp-citation-target">TLS 的安全性还取决于实际配置：允许的协议版本、密码套件、证书、扩展和终止位置都要能被记录和复核。NIST SP 800-52 把实现选择与配置放在同一套指导里；排查时应记录协商出的版本和套件，而不是只写“HTTPS 已开启”。<Cite id="transit-config" sources={encryptionTransitSources} /></p>
      <p id="transit-version" className="vp-citation-target">兼容旧客户端也不等于可以无限放宽策略。NIST 的 TLS 指导要求把 TLS 1.2、TLS 1.3、证书和扩展作为一个配置问题审查，迁移时要知道每一段实际协商了什么，而不是在代理之间悄悄回退。<Cite id="transit-version" sources={encryptionTransitSources} /></p>
      <p id="transit-mixed" className="vp-citation-target">页面也要避免混入 HTTP 脚本、样式和图片；一个明文资源足以让攻击者修改界面或接触会话材料。失败动作应该是“停在具体的跳点”，而不是“先试 HTTP 看看”。<Cite id="transit-mixed" sources={encryptionTransitSources} /></p>
      <p>这也是为什么实验里的 `BLOCKED · SAN ≠ lb.internal` 显示 `0 B`：身份还没对上时，继续加密只是把内容交给一个未知对端。修证书、修目标配置，重新握手，再让请求继续。</p>
    </ArticleSection>

    <ArticleSection id="encryption-transit-boundary-section" title="TLS 之外还有授权与重放边界">
      <p id="transit-strong" className="vp-citation-target">选择标准 AEAD 套件、关闭已弃用的协议版本和不安全的回退，是 TLS 配置的一部分；它们不能代替应用做授权。一个服务即使正确验证了连接，也仍要判断请求者能不能读取这份订单。<Cite id="transit-strong" sources={encryptionTransitSources} /></p>
      <p id="transit-0rtt" className="vp-citation-target">TLS 1.3 的 0-RTT 可以更早发送部分应用数据，但它有独立的重放风险和适用边界。会创建订单、扣款或改变状态的接口，不能因为少一次往返就跳过幂等和重放判断。<Cite id="transit-0rtt" sources={encryptionTransitSources} /></p>
      <p>最后沿着链路留下五个可验收字段：端点是谁、证书身份是什么、TLS 在哪里终止、抓包能看见什么、失败时在哪一跳停止。传输中加密的价值不是给整张架构图盖一枚总章，而是让每一段都能回答这些问题。</p>
      <ArticleAside title="和静态加密、授权怎么分工"><p>静态加密保护保存中的副本；传输中加密保护端点之间的路；授权决定已连接的调用者能不能做这件事。三者可以同时需要，任何一把锁都不能替另外两把回答权限或保存范围。</p></ArticleAside>
    </ArticleSection>
  </Article>;
}
