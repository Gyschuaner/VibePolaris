"use client";

import { ArrowCounterClockwise, CheckCircle, Database, Eye, Lightning, Pause, Play, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { acidSources } from "@/lib/acid-sources";
import styles from "./AcidConceptPage.module.css";

type AcidPhase = "atomicity" | "consistency" | "isolation" | "durability";
const phases: Array<{ label: string; phase: AcidPhase }> = [
  { label: "A · 两笔一起成或一起退", phase: "atomicity" },
  { label: "C · 约束决定什么算合法", phase: "consistency" },
  { label: "I · 并发读取各有边界", phase: "isolation" },
  { label: "D · 提交之后还能找回", phase: "durability" },
];

function AcidHero() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const reducedMotion = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotion.current = media.matches; if (media.matches) setPlaying(false); };
    updateMotion(); media.addEventListener("change", updateMotion); return () => media.removeEventListener("change", updateMotion);
  }, []);
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility(); document.addEventListener("visibilitychange", updateVisibility); return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);
  useEffect(() => {
    if (!playing || reducedMotion.current || !inViewport || !documentVisible) return;
    const timer = window.setInterval(() => setPhaseIndex((current) => {
      if (current >= phases.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 1350);
    return () => window.clearInterval(timer);
  }, [documentVisible, inViewport, playing]);

  const phase = phases[phaseIndex].phase;
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="ACID 用四个封条检查转账在失败、约束、并发和重启后的状态">
    <div className={styles.heroTop}><span>ONE TRANSFER / FOUR SEALS</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.stage}>
      <div className={styles.transferCard} data-phase={phase}><div className={styles.transferHead}><span>转账单据 · tx_42</span><span>{phase === "durability" ? "COMMIT" : phase === "atomicity" ? "处理中" : "观察中"}</span></div><div className={styles.accounts}><div><small>账户 A</small><strong>{phase === "atomicity" ? "¥100 → ¥70" : "¥70"}</strong></div><Lightning size={17} aria-hidden="true" /><div><small>账户 B</small><strong>{phase === "atomicity" ? "¥80 → ¥110" : "¥110"}</strong></div></div><div className={styles.ticketNote}>{phase === "atomicity" ? "第二笔失败，整张单据一起退回" : phase === "consistency" ? "余额 ≥ 0 · 约束正在检查" : phase === "isolation" ? "B 仍看到上一次已提交快照" : "WAL #884 · 重启后可重放"}</div></div>
      <div className={styles.seals} aria-label="ACID 四项封条">{([{ key: "atomicity", label: "A", title: "原子性", Icon: Lightning }, { key: "consistency", label: "C", title: "一致性", Icon: ShieldCheck }, { key: "isolation", label: "I", title: "隔离性", Icon: Eye }, { key: "durability", label: "D", title: "持久性", Icon: Database }] as const).map((seal) => { const active = seal.key === phase; const Icon = seal.Icon; return <div className={styles.seal} data-active={active} data-key={seal.key} key={seal.key}><Icon size={14} aria-hidden="true" /><strong>{seal.label}</strong><small>{seal.title}</small></div>; })}</div>
      <div className={styles.proofCard} data-phase={phase}><div className={styles.proofHead}>{phase === "atomicity" ? <Lightning size={14} /> : phase === "consistency" ? <ShieldCheck size={14} /> : phase === "isolation" ? <Eye size={14} /> : <Database size={14} />}<span>看到的证据</span></div><strong>{phase === "atomicity" ? "ROLLBACK" : phase === "consistency" ? "CHECK / RULE" : phase === "isolation" ? "SNAPSHOT" : "WAL → RECOVER"}</strong><small>{phase === "atomicity" ? "没有半笔转账" : phase === "consistency" ? "业务规则仍需写下" : phase === "isolation" ? "未提交值不乱窜" : "提交记录可找回"}</small></div>
    </div>
    <div className={styles.controls} role="group" aria-label="ACID 首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{item.phase[0]}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>ACID 不是一枚万能勋章；四个封条各自挡住一种失败，必须分别验证。</figcaption>
  </figure>;
}

type Property = AcidPhase;
type IsolationMode = "committed" | "weak";
type Verdict = "idle" | "pass" | "block" | "warning";

function AcidLab() {
  const [property, setProperty] = useState<Property>("atomicity");
  const [atomicFailure, setAtomicFailure] = useState(true);
  const [constraint, setConstraint] = useState(true);
  const [isolation, setIsolation] = useState<IsolationMode>("committed");
  const [walSynced, setWalSynced] = useState(true);
  const [verdict, setVerdict] = useState<Verdict>("idle");
  function check() {
    if (property === "atomicity") setVerdict(atomicFailure ? "pass" : "warning");
    else if (property === "consistency") setVerdict(constraint ? "pass" : "warning");
    else if (property === "isolation") setVerdict(isolation === "committed" ? "pass" : "warning");
    else setVerdict(walSynced ? "pass" : "warning");
  }
  function choose(next: Property) { setProperty(next); setVerdict("idle"); }
  function reset() { setProperty("atomicity"); setAtomicFailure(true); setConstraint(true); setIsolation("committed"); setWalSynced(true); setVerdict("idle"); }
  const propertyLabel: Record<Property, string> = { atomicity: "原子性", consistency: "一致性", isolation: "隔离性", durability: "持久性" };
  return <div className={styles.lab} aria-label="ACID 四项属性实验">
    <div className={styles.labHeader}><span>TRY IT / FOUR FAILURE QUESTIONS</span><strong>只检查一枚封条，别把四项保证混成一句“安全”</strong></div>
    <div className={styles.propertyChoices} role="group" aria-label="选择要检查的属性">{(Object.keys(propertyLabel) as Property[]).map((item) => <button type="button" key={item} onClick={() => choose(item)} aria-pressed={property === item}>{item[0].toUpperCase()} · {propertyLabel[item]}</button>)}</div>
    {property === "atomicity" && <label className={styles.toggle}><input type="checkbox" checked={atomicFailure} onChange={(event) => { setAtomicFailure(event.target.checked); setVerdict("idle"); }} /><span>第二笔入账失败</span><small>{atomicFailure ? "应整体 ROLLBACK" : "两笔都可提交"}</small></label>}
    {property === "consistency" && <label className={styles.toggle}><input type="checkbox" checked={constraint} onChange={(event) => { setConstraint(event.target.checked); setVerdict("idle"); }} /><span>启用余额 ≥ 0 约束</span><small>{constraint ? "非法负余额会被挡下" : "事务可能原子地提交错误值"}</small></label>}
    {property === "isolation" && <div className={styles.modeChoices} role="group" aria-label="选择并发可见性"><button type="button" onClick={() => { setIsolation("committed"); setVerdict("idle"); }} aria-pressed={isolation === "committed"}>READ COMMITTED</button><button type="button" onClick={() => { setIsolation("weak"); setVerdict("idle"); }} aria-pressed={isolation === "weak"}>较弱隔离示意</button></div>}
    {property === "durability" && <label className={styles.toggle}><input type="checkbox" checked={walSynced} onChange={(event) => { setWalSynced(event.target.checked); setVerdict("idle"); }} /><span>COMMIT 前 WAL 已落盘</span><small>{walSynced ? "重启可重放" : "最后记录可能缺失"}</small></label>}
    <div className={styles.labBoard}><div className={styles.labTransaction}><span>tx_42 · 转账</span><strong>账户 A −¥130 · 账户 B +¥130</strong><small>{property === "isolation" ? "事务 A 未提交，事务 B 正在读取" : property === "durability" ? "提交后模拟一次重启" : "两笔写入属于同一事务"}</small></div><div className={styles.labProof} data-warning={verdict === "warning"} data-pass={verdict === "pass"}><span>{propertyLabel[property]} 的观察结果</span><strong>{property === "atomicity" ? (atomicFailure ? "ROLLBACK · A/B 都没变" : "COMMIT · 两笔一起变") : property === "consistency" ? (constraint ? "BLOCK · 余额规则不允许" : "COMMIT · A = −¥30") : property === "isolation" ? (isolation === "committed" ? "B 读到已提交值" : "B 可能读到未提交值") : (walSynced ? "RECOVER · WAL 找回提交" : "MISSING · 最后记录不在")}</strong><small>{property === "atomicity" ? "全成或全败" : property === "consistency" ? "约束要由系统明确写下" : property === "isolation" ? "可见性取决于隔离设置" : "持久性取决于提交与恢复配置"}</small></div></div>
    <div className={styles.labActions}><button type="button" onClick={check}><ShieldCheck size={13} />检查这枚封条</button><button type="button" onClick={reset}><ArrowCounterClockwise size={13} />重置</button></div>
    <div className={styles.labStatus} data-warning={verdict === "warning"} data-success={verdict === "pass"} role="status" aria-live="polite"><strong>{verdict === "pass" ? <><CheckCircle size={14} aria-hidden="true" />这项承诺在当前条件下成立。</> : verdict === "warning" ? <><WarningCircle size={14} aria-hidden="true" />观察到边界：这项属性没有替其他三项自动兜底。</> : "还没有检查：选择一枚封条，改变一个条件，再看它负责什么。"}</strong><span>{verdict === "idle" ? "演示只改变本地状态；没有连接真实数据库或执行转账。" : "示例用于区分属性，不代表任意数据库的默认配置。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["acid-definition-section", "四个字母其实是四个问题"], ["acid-atomicity-section", "原子性和一致性不是一回事"], ["acid-isolation-section", "隔离性决定并发时谁能看到什么"], ["acid-durability-section", "持久性要在提交和恢复之间兑现"], ["acid-boundary-section", "ACID 仍有清楚的边界"]];

export function AcidTermPage() {
  return <Article slug="acid" title="ACID" subtitle="ACID · 事务在失败、并发和重启中的四个承诺" sources={acidSources} sections={sections} hero={<AcidHero />} intro={<>“支持 ACID”听起来像一枚万能安全章，但它其实把四个不同问题放在一起。<strong>原子性、 一致性、隔离性和持久性分别回答：变化是否一起提交、结果是否满足约束、并发读取怎样互相看见、提交后故障恢复能否找回。</strong></>}>
    <ArticleSection id="acid-definition-section" title="四个字母其实是四个问题"><p id="acid-definition" className="vp-citation-target"><strong>ACID 是事务属性的缩写，不是一个可以单独打开的开关。</strong>PostgreSQL 的事务教程用 `BEGIN`、`COMMIT` 和 `ROLLBACK` 展示一组操作如何作为整体提交；IBM 的恢复论文则把事务恢复、原子性和持久性放进同一套故障问题里讨论。<Cite id="acid-definition" sources={acidSources} />四项属性互相配合，但每项都要有自己的证据。</p><p>拿转账做例子：扣款和入账要一起成功，是 A；提交后余额仍满足已写下的约束，是 C；另一个事务在中途能看到什么，是 I；数据库重启后能否找回已确认的变化，是 D。把四个问题分开，才知道某次失败到底是哪一枚封条没有兑现。</p></ArticleSection>
    <ArticleSection id="acid-atomicity-section" title="原子性和一致性不是一回事"><p id="acid-atomicity" className="vp-citation-target"><strong>原子性负责“全成还是全败”，不负责替你定义什么叫合理。</strong>如果第二笔入账失败，原子事务应把第一笔扣款一起回滚，避免留下半笔转账；但一个没有余额约束的事务，仍可能原子地提交 `A = -30`。PostgreSQL 的事务示例和恢复研究都支持把这两种问题分开。<Cite id="acid-atomicity" sources={acidSources} /></p><p id="acid-consistency" className="vp-citation-target">一致性来自约束、触发器、事务逻辑和业务规则的组合。<Cite id="acid-consistency" sources={acidSources} />数据库可以检查余额非负、外键存在或某个 `CHECK` 表达式，却不知道“这笔退款是否符合商户风控”这样的跨系统事实。动画里关掉余额约束后，事务仍能提交，只是提交了错误业务值。</p><AcidLab /></ArticleSection>
    <ArticleSection id="acid-isolation-section" title="隔离性决定并发时谁能看到什么"><p id="acid-isolation" className="vp-citation-target"><strong>隔离性管理的是并发事务之间的可见性与冲突，不是把数据库永远锁成单线程。</strong>SQL Server 的锁与行版本指南把锁定和 row versioning 作为不同的并发控制方式；事务隔离级别会影响一个读取能否看到另一个事务尚未提交的值。<Cite id="acid-isolation" sources={acidSources} />较强的隔离通常意味着更多等待或冲突处理，具体异常要结合数据库实现和级别验证。</p><p>实验里的“READ COMMITTED”只表示当前示例读取已提交值；“较弱隔离示意”用来让读者看到未提交值可能泄露的风险，不声称每个数据库都提供同样的名称或行为。</p></ArticleSection>
    <ArticleSection id="acid-durability-section" title="持久性要在提交和恢复之间兑现"><p id="acid-durability" className="vp-citation-target"><strong>持久性关注的是：系统已经确认提交后，故障恢复能不能找回这次变化。</strong>PostgreSQL 的 WAL 先记录足以恢复的变化，故障后再用日志重放；IBM 的恢复原则也把日志、检查点和恢复过程作为提交可靠性的基础。<Cite id="acid-durability" sources={acidSources} />“内存里刚改过”或“应用收到了响应”都不能单独证明这枚封条已经兑现。</p><p>同步提交、异步提交、复制和备份是不同层次的选择。它们会改变确认点、可接受的数据丢失窗口和恢复时间，不能看见一个叫 WAL 的文件就推断跨机器、跨区域都不会丢。</p></ArticleSection>
    <ArticleSection id="acid-boundary-section" title="ACID 仍有清楚的边界"><p id="acid-boundary" className="vp-citation-target">ACID 保护的是数据库事务范围内的变化；它不自动覆盖发邮件、扣第三方支付、写另一套数据库等外部副作用，也不替应用解决重试后的重复请求。并发控制指南、WAL 文档和事务恢复研究都要求把锁、提交、恢复和外部边界分别说明。<Cite id="acid-boundary" sources={acidSources} /></p><ArticleAside title="看到“支持 ACID”时继续追问"><p>范围是单库还是跨服务？哪些约束真的写下？提交响应在什么时刻发出？隔离级别是什么？故障恢复能回到哪个点？重试会不会重复外部动作？这些答案比一个四字母标签更能说明系统到底保证了什么。</p></ArticleAside></ArticleSection>
  </Article>;
}
