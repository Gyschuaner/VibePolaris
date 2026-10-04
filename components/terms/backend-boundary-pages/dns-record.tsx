"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Funnel, Globe, ListNumbers, Network, Pause, Play, Radio, Stack, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { dnsRecordSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "先读懂一行记录",
    result: "owner · type · TTL · RDATA",
    owner: "api.example.com.",
    type: "A",
    ttl: "60s",
    data: "203.0.113.10",
    source: "权威区文件",
    cache: "尚未缓存",
    note: "一条 DNS 记录不只是‘域名等于 IP’：owner、type、class、TTL 和 RDATA 一起描述这条信息是谁、是什么、能用多久。",
  },
  {
    label: "同名同类型组成 RRSet",
    result: "2 条 A 记录 · 同一个集合",
    owner: "api.example.com.",
    type: "A",
    ttl: "60s",
    data: "203.0.113.10 · 203.0.113.11",
    source: "权威 RRSet",
    cache: "一起倒计时",
    note: "同一个 owner、class、type 可以有多个不同 RDATA；它们组成 RRSet，TTL 要保持一致，查询时作为一组返回。",
  },
  {
    label: "权威改了，缓存还在走",
    result: "权威 .20 · 缓存 .10",
    owner: "api.example.com.",
    type: "A",
    ttl: "42s remaining",
    data: "authoritative 203.0.113.20",
    source: "权威区已更新",
    cache: "resolver: 203.0.113.10",
    note: "权威数据变更不会瞬间抹掉所有缓存；TTL 归零前，解析器仍可能把旧 RRSet 返回给用户。",
  },
];

const scenarios = [
  {
    label: "A · 地址集合",
    query: "api.example.com. A",
    answer: "203.0.113.10 · 203.0.113.11",
    meaning: "主机地址",
    evidence: "2 条 RR · TTL 60s",
    good: true,
    note: "A 记录的 RDATA 是 IPv4 地址；两条同名同类型记录属于同一个 RRSet，不是两次不同查询。",
  },
  {
    label: "CNAME · 别名",
    query: "www.example.com. CNAME",
    answer: "edge.example.net.",
    meaning: "canonical name",
    evidence: "别名 → 规范名",
    good: true,
    note: "CNAME 是 DNS 里的别名关系，不是浏览器收到的 HTTP 302；后续还要解析规范名的地址记录。",
  },
  {
    label: "MX · 邮件路由",
    query: "example.com. MX",
    answer: "10 mail.example.com.",
    meaning: "mail exchange",
    evidence: "优先级 10",
    good: true,
    note: "MX 的 RDATA 是邮件交换主机和优先级，不能把看到 MX 就当作网站入口或 A 记录。",
  },
  {
    label: "NXDOMAIN · 负缓存",
    query: "missing.example.com. A",
    answer: "NXDOMAIN · SOA",
    meaning: "名称不存在",
    evidence: "negative TTL 300s",
    good: false,
    note: "权威服务器用 SOA 携带负缓存时长；TTL 归零前，resolver 可以继续回答‘不存在’，即使管理员刚刚补了记录。",
  },
];

function DnsRecordHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.dnsRecordHero} data-step={scene.step} aria-label="DNS 记录从单行字段到 RRSet 和缓存的过程">
    <div className={styles.dnsRecordHeroTop}><span>一条名字 · 经过权威与缓存</span><strong>{current.result}</strong></div>
    <div className={styles.dnsRecordHeroStage}>
      <div className={styles.dnsRecordRowCard} data-active={scene.step === 0}>
        <div className={styles.dnsRecordCardHeading}><Radio size={21} aria-hidden="true" /><span>记录行</span></div>
        <code>{current.owner}</code>
        <div className={styles.dnsRecordFields}><span><small>TYPE</small><strong>{current.type}</strong></span><span><small>TTL</small><strong>{current.ttl}</strong></span><span><small>RDATA</small><strong>{current.data}</strong></span></div>
      </div>
      <ArrowRight className={styles.dnsRecordArrow} size={22} aria-hidden="true" />
      <div className={styles.dnsRecordSetCard} data-active={scene.step === 1}>
        <div className={styles.dnsRecordCardHeading}><Stack size={21} aria-hidden="true" /><span>回答集合</span></div>
        <strong>{current.source}</strong>
        <code>{current.data}</code>
        <small>{current.cache}</small>
      </div>
      <ArrowRight className={styles.dnsRecordArrow} size={22} aria-hidden="true" />
      <div className={styles.dnsRecordCacheCard} data-active={scene.step === 2}>
        <div className={styles.dnsRecordCardHeading}><Funnel size={21} aria-hidden="true" /><span>resolver 看到的</span></div>
        <code>{current.cache}</code>
        <strong>{current.ttl}</strong>
        <small>TTL 走完才重新问来源</small>
      </div>
    </div>
    <div className={styles.dnsRecordEvidence}><Globe size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.dnsRecordTimeline} role="group" aria-label="DNS 记录首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.dnsRecordControls} role="group" aria-label="控制 DNS 记录原理演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停 DNS 记录原理演示" : "播放 DNS 记录原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function DnsRecordLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  return <div className={styles.dnsRecordLab} role="region" aria-label="DNS 记录类型与缓存实验">
    <div className={styles.dnsRecordLabHeader}><div><span>别把每种记录都翻译成“指向 IP”</span><strong>看查询类型怎样改变回答语义</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.dnsRecordLabPath}>
      <div className={styles.dnsRecordLabNode}><ListNumbers size={19} aria-hidden="true" /><span>查询</span><code>{current.query}</code></div><ArrowRight className={styles.dnsRecordArrow} size={18} aria-hidden="true" />
      <div className={styles.dnsRecordLabNode}><Network size={19} aria-hidden="true" /><span>RDATA / 状态</span><code>{current.answer}</code><code>{current.evidence}</code></div><ArrowRight className={styles.dnsRecordArrow} size={18} aria-hidden="true" />
      <div className={styles.dnsRecordLabNode} data-good={current.good}><span>这条记录在说什么</span><strong>{current.meaning}</strong></div>
    </div>
    <div className={styles.dnsRecordLabEvidence} data-warning={!current.good}>{current.good ? <CheckCircle size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}<p><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.dnsRecordLabControls} role="group" aria-label="选择 DNS 记录样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function DnsRecordTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={dnsRecordSources} />;
  return <ConceptArticle slug="dns-record" title="DNS 记录" subtitle="DNS Record · 把名称、类型和数据放在一起的条目" sources={dnsRecordSources} sections={[["dns-record-shape", "一行记录其实有五个边界"], ["dns-record-set", "同名记录会组成集合"], ["dns-record-types", "类型决定 RDATA 在说什么"], ["dns-record-cache", "权威改动不会瞬间穿透缓存"]]} hero={<DnsRecordHero />} intro={<>DNS 不是一张“域名 → IP”的字典，而是一组带类型、TTL 和数据格式的资源记录。<strong>先读清记录，再判断它能不能回答你的问题。</strong><Cite id="dns-record-shape-detail" /></>}>
    <ArticleSection id="dns-record-shape" title="一行记录其实有五个边界">
      <p id="dns-record-shape-detail" className="vp-citation-target">一条 DNS Resource Record 至少要看 owner name、type、class、TTL 和 RDATA。owner 说这条信息挂在哪个名字下，type 决定如何解释数据，TTL 说缓存多久，RDATA 才是具体地址、别名、优先级或文本。<Cite id="dns-record-shape-detail" /></p>
      <p id="dns-record-authority" className="vp-citation-target">同一个名字可能存在于不同 zone；只有负责该 zone 的权威服务器，才是这组数据的正式来源。resolver 返回的回答可能来自缓存，看到“有一条记录”不等于已经确认它来自权威区。<Cite id="dns-record-authority" /></p>
      <DnsRecordLab />
    </ArticleSection>
    <ArticleSection id="dns-record-set" title="同名记录会组成集合">
      <p id="dns-record-set-detail" className="vp-citation-target">当多条记录拥有相同的 label、class 和 type、但 RDATA 不同，它们组成一个 RRSet。查询这个名字和类型时，回答的是这个集合；同一 RRSet 的 TTL 应保持一致，否则缓存可能只剩下半组地址。<Cite id="dns-record-set" /></p>
      <p id="dns-record-cname" className="vp-citation-target">CNAME 是一个特殊边界：一个 alias 只能有一个 canonical name，而且 alias 不能再同时放普通数据记录。把 CNAME 的 owner 叫“规范名”会把方向说反，规范名在它的 RDATA 里。<Cite id="dns-record-cname" /></p>
    </ArticleSection>
    <ArticleSection id="dns-record-types" title="类型决定 RDATA 在说什么">
      <p id="dns-record-type" className="vp-citation-target">A 的 RDATA 是 IPv4 地址，CNAME 的 RDATA 是另一个域名，MX 的 RDATA 是优先级和邮件交换主机，TXT 则承载文本。它们都叫 DNS 记录，却不能用同一个“指向服务器”的解释替代。<Cite id="dns-record-type" /></p>
      <p>因此查网站要问 A/AAAA，查别名要问 CNAME，查邮件要问 MX，查验证文本要问 TXT。记录类型本身不是应用层动作：CNAME 不会让浏览器收到 HTTP 重定向，MX 也不会决定网页请求走哪条路径。<Cite id="dns-record-type" /></p>
    </ArticleSection>
    <ArticleSection id="dns-record-cache" title="权威改动不会瞬间穿透缓存">
      <p id="dns-record-cache-detail" className="vp-citation-target">TTL 是 resolver 可以继续复用这条 RR 的时间窗口；权威区把 A 从 .10 改成 .20 后，旧回答仍可能在 TTL 归零前被返回。排查变更时要同时查权威服务器、递归缓存、回答里的 TTL 和查询时间。<Cite id="dns-record-cache" /></p>
      <p id="dns-record-negative" className="vp-citation-target">不存在也能被缓存。NXDOMAIN 表示名字不存在，NODATA 表示名字存在但没有被查询的类型；权威响应会带 SOA，让 resolver 按负 TTL 暂存这个“没有记录”的结论。<Cite id="dns-record-negative" /></p>
      <p id="dns-record-diagnostic" className="vp-citation-target">一条可复现的 DNS 记录证据应写下 QNAME、QTYPE、回答区、权威标记、authority/additional 区和每条 RR 的 TTL。只截一行 IP，无法区分权威更新未传播、缓存未过期、CNAME 链，还是根本查错了类型。<Cite id="dns-record-diagnostic" /></p>
    </ArticleSection>
  </ConceptArticle>;
}
