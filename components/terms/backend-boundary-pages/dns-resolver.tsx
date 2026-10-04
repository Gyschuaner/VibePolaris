"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, Funnel, Globe, HardDrives, MagnifyingGlass, Network, Pause, Play, Radio, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { dnsResolverSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const traceNodes = ["stub", "recursive", "root", ".com", "authoritative"];

const frames = [
  {
    label: "先把问题交给 resolver",
    result: "cache MISS · RD=1",
    query: "api.example.com. · A",
    mode: "stub → recursive",
    cache: "MISS",
    path: "还没问上游",
    answer: "尚未回答",
    ttl: "—",
    active: [0, 1],
    done: [0],
    note: "本机的 stub resolver 通常只知道该问谁；它把 QNAME、QTYPE 和递归请求交给能继续查询的 resolver。",
  },
  {
    label: "递归器沿委派走",
    result: "root → .com → example",
    query: "api.example.com. · A",
    mode: "recursive · upstream referrals",
    cache: "收集 NS 线索",
    path: "root → .com → example",
    answer: "203.0.113.10",
    ttl: "300s",
    active: [1, 2, 3, 4],
    done: [0, 2, 3],
    note: "缓存没有可用答案时，递归器先问根和顶级域，再找到负责 example.com 的权威服务器；每次回应都缩小下一跳。",
  },
  {
    label: "答案写回，下一次短路",
    result: "cache HIT · upstream 0",
    query: "api.example.com. · A",
    mode: "recursive → stub",
    cache: "A · .10 · TTL 247",
    path: "命中后停止",
    answer: "203.0.113.10",
    ttl: "247s",
    active: [0, 1],
    done: [0, 1],
    note: "递归器把可复用的答案和剩余 TTL 留在缓存里；下一次相同的名字和类型可以直接返回，不必再碰根或权威服务器。",
  },
  {
    label: "不存在也会留下结论",
    result: "NXDOMAIN · negative cache",
    query: "missing.example.com. · A",
    mode: "recursive → authority",
    cache: "SOA · negative TTL 60",
    path: "无上游重查",
    answer: "名称不存在",
    ttl: "60s",
    active: [0, 1],
    done: [0, 1],
    note: "NXDOMAIN 不是‘没查到所以再问一次’；权威回答里的 SOA 给出负缓存时长，TTL 内再次查询可以直接得到不存在。",
  },
];

const scenarios = [
  {
    label: "冷缓存 · 正答案",
    query: "api.example.com. A",
    cache: "MISS",
    resolver: "RD=1 · 继续解析",
    trace: "root → .com → authoritative",
    evidence: "Answer: A 203.0.113.10 · TTL 300",
    result: "返回地址",
    status: "ok",
    note: "第一次查询要付出上游往返；递归器拿到答案后，才有东西可供后续命中。",
  },
  {
    label: "热缓存 · 直接命中",
    query: "api.example.com. A",
    cache: "HIT · TTL 247",
    resolver: "本地答案够用",
    trace: "不访问上游",
    evidence: "Answer: A .10 · upstream queries 0",
    result: "短路返回",
    status: "ok",
    note: "相同 QNAME、QTYPE 和 class 命中仍有效的 RR，递归器可以直接回答；缓存不是永久数据库，TTL 仍在走。",
  },
  {
    label: "NXDOMAIN · 负缓存",
    query: "missing.example.com. A",
    cache: "negative SOA · TTL 60",
    resolver: "缓存‘不存在’",
    trace: "不访问上游",
    evidence: "RCODE NXDOMAIN · authority: SOA",
    result: "有依据的否定",
    status: "negative",
    note: "名称不存在和类型没有数据不是一回事，但两者都可能由 SOA 携带负 TTL；看到空答案要继续看 RCODE 和 authority 区。",
  },
  {
    label: "上游无回应 · SERVFAIL",
    query: "slow.example.com. A",
    cache: "failure cache · 短暂",
    resolver: "有限重试后停止",
    trace: "authoritative timeout",
    evidence: "RCODE SERVFAIL · no useful answer",
    result: "解析失败",
    status: "failure",
    note: "SERVFAIL 说明这次解析没有拿到可用数据；它和 NXDOMAIN 不同，不能据此断言名字不存在。",
  },
];

function DnsResolverHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.dnsResolverHero} data-step={scene.step} aria-label="DNS resolver 从缓存检查到递归查询和负缓存的过程">
    <div className={styles.dnsResolverHeroTop}><span>一个问题 · resolver 决定问谁</span><strong>{current.result}</strong></div>
    <div className={styles.dnsResolverHeroStage}>
      <div className={styles.dnsResolverQuestionCard} data-active={current.active.includes(0)}>
        <div className={styles.dnsResolverCardHeading}><Radio size={21} aria-hidden="true" /><span>客户端问题</span></div>
        <code>{current.query}</code>
        <small>QNAME + QTYPE</small>
      </div>
      <ArrowRight className={styles.dnsResolverArrow} size={22} aria-hidden="true" />
      <div className={styles.dnsResolverEngineCard} data-active={current.active.includes(1)}>
        <div className={styles.dnsResolverCardHeading}><Network size={21} aria-hidden="true" /><span>递归 resolver</span></div>
        <strong>{current.mode}</strong>
        <div className={styles.dnsResolverEngineLine}><small>路径</small><code>{current.path}</code></div>
      </div>
      <ArrowRight className={styles.dnsResolverArrow} size={22} aria-hidden="true" />
      <div className={styles.dnsResolverCacheCard} data-active={current.active.includes(1)}>
        <div className={styles.dnsResolverCardHeading}><Funnel size={21} aria-hidden="true" /><span>缓存抽屉</span></div>
        <code>{current.cache}</code>
        <strong>{current.answer}</strong>
        <small>剩余 TTL · {current.ttl}</small>
      </div>
    </div>
    <div className={styles.dnsResolverTrace} aria-label="递归查询路径">{traceNodes.map((node, index) => <span key={node} data-active={current.active.includes(index)} data-done={current.done.includes(index)}>{node}</span>)}</div>
    <div className={styles.dnsResolverEvidence}><Globe size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.dnsResolverTimeline} role="group" aria-label="DNS resolver 首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.dnsResolverControls} role="group" aria-label="控制 DNS resolver 原理演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停 DNS resolver 原理演示" : "播放 DNS resolver 原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function DnsResolverLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  const Icon = current.status === "ok" ? CheckCircle : XCircle;
  return <div className={styles.dnsResolverLab} role="region" aria-label="DNS resolver 命中、负缓存和失败实验">
    <div className={styles.dnsResolverLabHeader}><div><span>别把所有“没拿到地址”都叫 DNS 挂了</span><strong>先看 resolver 留下的证据</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.dnsResolverLabPath}>
      <div className={styles.dnsResolverLabNode}><MagnifyingGlass size={19} aria-hidden="true" /><span>查询</span><code>{current.query}</code><code>{current.cache}</code></div><ArrowRight className={styles.dnsResolverArrow} size={18} aria-hidden="true" />
      <div className={styles.dnsResolverLabNode}><HardDrives size={19} aria-hidden="true" /><span>resolver 决定</span><strong>{current.resolver}</strong><code>{current.trace}</code></div><ArrowRight className={styles.dnsResolverArrow} size={18} aria-hidden="true" />
      <div className={styles.dnsResolverLabNode} data-status={current.status}><span>可观察结果</span><strong>{current.result}</strong><code>{current.evidence}</code></div>
    </div>
    <div className={styles.dnsResolverLabEvidence} data-status={current.status}><Icon size={20} aria-hidden="true" /><p><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.dnsResolverLabControls} role="group" aria-label="选择 DNS resolver 样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function DnsResolverTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={dnsResolverSources} />;
  return <ConceptArticle slug="dns-resolver" title="DNS 解析器" subtitle="DNS Resolver · 替客户端把名字问到有答案的地方" sources={dnsResolverSources} sections={[["resolver-roles-section", "先分清谁在问、谁在回答"], ["resolver-cache-section", "缓存命中会把路剪短"], ["resolver-walk-section", "没命中时沿着委派继续问"], ["resolver-result-section", "有答案、没数据和没回信不是一回事"]]} hero={<DnsResolverHero />} intro={<>你在地址栏里输入一个名字，通常不是电脑直接跑到 DNS 根服务器门口。<strong>本机的 stub 把问题交给 resolver，resolver 再决定查缓存、追委派，还是把失败暂时记住。</strong><Cite id="resolver-roles" /></>}>
    <ArticleSection id="resolver-roles-section" title="先分清谁在问、谁在回答">
      <p id="resolver-roles" className="vp-citation-target">DNS 里常被叫作“服务器”的东西，职责并不相同。stub resolver 只负责把本机应用的问题交出去；recursive resolver 代表它继续查；authoritative server 保存某个 zone 的正式数据。把三者都叫 DNS 服务器，排查时就会不知道是哪一层在说话。<Cite id="resolver-roles" /></p>
      <p id="resolver-query" className="vp-citation-target">一次查询至少带着 QNAME、QTYPE 和 class。客户端把请求里的 RD（Recursion Desired）置上，表示希望对方替自己追下去；返回里的 RA 只能说明这个服务器提供递归能力，不能证明答案一定来自权威区。<Cite id="resolver-query" /></p>
      <DnsResolverLab />
    </ArticleSection>
    <ArticleSection id="resolver-cache-section" title="缓存命中会把路剪短">
      <p id="resolver-cache" className="vp-citation-target">resolver 会把收到的 RR 和剩余 TTL 放进缓存。下一次相同名字、类型和 class 的问题到来时，仍未过期的答案可以直接返回；过期记录会被丢掉或重新查询。缓存的价值是减少延迟和权威服务器的压力，不是把全网 DNS 复制到本地。<Cite id="resolver-cache" /></p>
      <p>同一个 resolver 还可能同时处理许多人的问题。缓存里有 <code>api.example.com A</code>，不代表 <code>api.example.com MX</code> 也已经有答案；查询的名字和类型要一起看。实验里把 QTYPE 换掉，所谓“命中”就可能重新变成一次上游查询。</p>
    </ArticleSection>
    <ArticleSection id="resolver-walk-section" title="没命中时沿着委派继续问">
      <p id="resolver-walk" className="vp-citation-target">缓存没有答案时，递归 resolver 会利用已知的 NS 和地址线索，从根、顶级域到目标 zone 逐步缩小范围。上游返回 referral 时，递归器换一个更接近目标的服务器继续问；这和 stub 只发出一次递归查询，是两种不同的视角。<Cite id="resolver-walk" /></p>
      <p id="resolver-response" className="vp-citation-target">递归模式下，客户端通常拿到最终答案或错误，而不是一串让它自己继续追的 referral；迭代模式则由发起者收到 referral 后自己选择下一跳。看到响应里的 answer、authority 和 additional 区，才能知道这次是结果、指路，还是附带了下一跳地址。<Cite id="resolver-response" /></p>
    </ArticleSection>
    <ArticleSection id="resolver-result-section" title="有答案、没数据和没回信不是一回事">
      <p id="resolver-negative" className="vp-citation-target"><code>NXDOMAIN</code> 表示名字不存在；<code>NOERROR</code> 加上空的相关 answer 则可能是 NODATA，表示名字存在但没有被问的类型。权威响应可以在 authority 区带 SOA，resolver 按负 TTL 暂存这个结论。<Cite id="resolver-negative" /></p>
      <p id="resolver-failure" className="vp-citation-target"><code>SERVFAIL</code>、超时或上游不可达说明这次没有拿到可用数据，不能当成“名字不存在”。解析失败会进入短时 failure cache；实现可以按失败类型设置期限，RFC 9520 要求至少缓存 1 秒、最长不超过 5 分钟。这样能限制重复重试，缓解上游故障带来的查询风暴，却不会把错误变成正确答案。<Cite id="resolver-failure" /></p>
      <p id="resolver-diagnosis" className="vp-citation-target">排查 DNS 时，把 QNAME、QTYPE、RD/RA、RCODE、AA、answer/authority/additional、每条 RR 的 TTL、实际问过的上游和重试结果放在一起。只看到应用报“找不到主机”，无法区分缓存命中、NXDOMAIN、NODATA、SERVFAIL 和等待超时。<Cite id="resolver-diagnosis" /></p>
    </ArticleSection>
  </ConceptArticle>;
}
