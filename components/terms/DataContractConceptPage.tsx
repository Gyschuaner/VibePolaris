"use client";

import { ArrowCounterClockwise, CheckCircle, Pause, Play, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { dataContractSources } from "@/lib/data-contract-sources";
import styles from "./DataContractConceptPage.module.css";

type ContractPhase = "baseline" | "additive" | "breaking" | "migration";
const phases: Array<{ label: string; phase: ContractPhase }> = [
  { label: "v1 · 依赖已锁定", phase: "baseline" },
  { label: "新增可选字段", phase: "additive" },
  { label: "直接改名 · 被拦截", phase: "breaking" },
  { label: "并行迁移 · 双写", phase: "migration" },
];

function DataContractHero() {
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
  const breaking = phase === "breaking";
  const migration = phase === "migration";
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="数据契约把消费者依赖的字段固定下来，变化先经过兼容性判断">
    <div className={styles.heroTop}><span>CONSUMER DEPENDENCY / CONTRACT</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.stage}>
      <div className={styles.consumer}><span>消费者</span><strong>读取 email</strong><small>string · required<br />这是正在使用的依赖</small></div>
      <div className={styles.contractBoard} data-phase={phase}>
        <span>契约 v1 → v2</span>
        <div className={styles.fieldRows}>
          {breaking ? <div className={styles.field} data-legacy="true"><code>email</code><small>removed · old dependency</small></div> : <div className={styles.field} data-legacy={migration}><code>email</code><small>string · required</small></div>}
          {phase === "additive" && <div className={styles.field} data-optional="true"><code>locale?</code><small>string · optional</small></div>}
          {breaking && <div className={styles.field} data-optional="false"><code>user_id</code><small>string · required</small></div>}
          {migration && <div className={styles.field} data-optional="true"><code>user_id</code><small>string · 双写</small></div>}
        </div>
      </div>
      <div className={styles.change} data-phase={phase}><span>这次变化</span><strong>{phase === "baseline" ? "email:string" : phase === "additive" ? "+ locale?" : phase === "breaking" ? "email → user_id" : "email + user_id"}</strong><small>{phase === "baseline" ? "基线" : phase === "additive" ? "保留旧字段" : phase === "breaking" ? "旧依赖消失" : "等消费者迁完再删"}</small><em className={styles.verdict}>{phase === "baseline" ? "LOCKED" : phase === "additive" ? "PASS · additive" : phase === "breaking" ? "BLOCK · breaking" : "PASS · migrate"}</em></div>
    </div>
    <div className={styles.controls} role="group" aria-label="数据契约首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>契约不是把变化冻住，而是让“谁依赖什么、怎么迁移”在发布前变得可见。</figcaption>
  </figure>;
}

type Scenario = "optional" | "rename" | "type";
const scenarioLabels: Record<Scenario, string> = { optional: "新增 locale?", rename: "email 改名 user_id", type: "email 改成 number" };

function DataContractLab() {
  const [scenario, setScenario] = useState<Scenario>("optional");
  const [keepOld, setKeepOld] = useState(false);
  const [decision, setDecision] = useState<"idle" | "pass" | "block" | "migration">("idle");
  function inspect() {
    if (scenario === "optional") setDecision("pass");
    else if (scenario === "rename" && keepOld) setDecision("migration");
    else setDecision("block");
  }
  function choose(next: Scenario) { setScenario(next); setDecision("idle"); }
  const isBlocked = decision === "block";
  return <div className={styles.lab} aria-label="数据契约兼容性实验">
    <div className={styles.labHeader}><span>TRY IT / COMPATIBILITY CHECK</span><strong>先看消费者依赖，再看改动能不能放行</strong></div>
    <div className={styles.scenario} role="group" aria-label="选择字段变化"><button type="button" onClick={() => choose("optional")} aria-pressed={scenario === "optional"}>新增 locale?</button><button type="button" onClick={() => choose("rename")} aria-pressed={scenario === "rename"}>改名 user_id</button><button type="button" onClick={() => choose("type")} aria-pressed={scenario === "type"}>改成 number</button></div>
    <label className={styles.migrationToggle}><input type="checkbox" checked={keepOld} onChange={(event) => { setKeepOld(event.target.checked); setDecision("idle"); }} />保留旧字段，给消费者留迁移窗口</label>
    <div className={styles.contractRows}><div className={styles.contractRow}><span>当前契约</span><code>email: string · required</code><em>consumer reads it</em></div><div className={styles.contractRow} data-proposed="true" data-breaking={isBlocked}><span>提出变化</span><code>{scenarioLabels[scenario]}</code><em>{keepOld && scenario === "rename" ? "email 仍在" : "等待检查"}</em></div></div>
    <div className={styles.labActions}><button type="button" onClick={inspect}><ShieldCheck size={13} />检查兼容性</button></div>
    <div className={styles.labStatus} data-blocked={isBlocked} data-migration={decision === "migration"} role="status" aria-live="polite"><strong>{decision === "pass" ? "PASS · 新字段是可选的，旧消费者仍能读取 email。" : decision === "migration" ? "PASS · 旧字段还在，消费者可以逐步迁移到 user_id。" : decision === "block" ? "BLOCK · 这会改变现有依赖；先迁移、双写或发布新版本。" : "还没有裁决：选择一次变化，按下检查。"}</strong><span>{decision === "idle" ? "演示只检查本地字段规则，不连接真实 schema registry。" : "类型相同也不代表语义相同；兼容性要对着真正的消费者依赖判断。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["data-contract-definition-section", "契约不只是字段清单"], ["data-contract-consumer-section", "先写消费者真正依赖的字段"], ["data-contract-additive-section", "新增可选字段和改名不是一回事"], ["data-contract-breaking-section", "兼容性检查要对着基线"], ["data-contract-boundary-section", "契约也有边界"]];

export function DataContractTermPage() {
  return <Article slug="data-contract" title="数据契约" subtitle="Data Contract · 让字段变化先被看见" sources={dataContractSources} sections={sections} hero={<DataContractHero />} intro={<>上游改字段时，真正先受影响的往往不是生产者，而是那些没人再想得起来的下游读取。<strong>数据契约把形状、语义和兼容规则写成双方都能检查的约定，让一次改名在发布前就露出破坏性。</strong></>}>
    <ArticleSection id="data-contract-definition-section" title="契约不只是字段清单"><p id="data-contract-definition" className="vp-citation-target"><strong>数据契约回答的是“谁提供什么、谁依赖什么、变化怎么判断”，不只是列出几个字段名。</strong>OpenAPI 把接口描述定义成语言无关的能力说明，让人和工具在没有读源码的情况下理解请求与响应；JSON Schema 则用 `properties`、类型和 `required` 等规则检查对象是否符合形状。<Cite id="data-contract-definition" sources={dataContractSources} />把这两层放在一起，消费者才知道字段长什么样，也知道哪些字段不能随便消失。</p><p>现实里的契约还要写清语义、所有者、版本、质量和迁移窗口。`email` 是联系地址还是登录标识？允许为空吗？数据多久更新一次？这些问题不写出来，字段类型即使没变，双方仍可能读出完全不同的意思。</p></ArticleSection>
    <ArticleSection id="data-contract-consumer-section" title="先写消费者真正依赖的字段"><p id="data-contract-consumer" className="vp-citation-target"><strong>契约的边界应该从消费者的真实使用开始。</strong>Pact 把消费者对请求和响应的期待写成可执行的交互，再交给提供者验证；它强调只测试消费者实际用到的部分，而不是替提供者列出所有可能的行为。<Cite id="data-contract-consumer" sources={dataContractSources} />这和一份“看上去很完整”的全量 schema 不同：前者能告诉你这次改动会不会伤到已存在的依赖。</p><DataContractLab /><p id="data-contract-migration" className="vp-citation-target">实验里保留 `email` 再增加 `user_id`，不是永远保留两个名字，而是给消费者一个可观察的过渡期。Pact Broker 记录契约版本、验证结果和哪些消费者/提供者版本能安全组合；迁移完成后，团队才有证据删除旧字段。<Cite id="data-contract-migration" sources={dataContractSources} /></p></ArticleSection>
    <ArticleSection id="data-contract-additive-section" title="新增可选字段和改名不是一回事"><p id="data-contract-additive" className="vp-citation-target">在 JSON Schema 的默认示例里，`properties` 描述已知字段，但遗漏字段默认仍然有效，额外字段默认也不会因此失败；把一个新字段标成可选，通常不会影响只读取旧字段的消费者。<Cite id="data-contract-additive" sources={dataContractSources} />这只是 schema 规则下的兼容性判断，业务是否要求“必须有 locale”仍要另写约束。</p><p>直接把 `email` 改名成 `user_id` 就不同了：旧消费者还在找 `email`，生产者却不再提供它。即使两个字段都是字符串，名字背后的语义和已有读取代码也没有自动迁移；先保留旧字段、双写一段时间，或者提升版本让消费者一起切换，才是可追踪的变化。</p></ArticleSection>
    <ArticleSection id="data-contract-breaking-section" title="兼容性检查要对着基线"><p id="data-contract-breaking" className="vp-citation-target"><strong>“兼容”不是新 schema 自己说了算，而是拿它和消费者正在使用的基线比较。</strong>Buf 的 `breaking` 命令把当前 Protobuf schema 与旧版本对照，能发现改字段类型、删除定义等会破坏生成代码或线上的序列化数据的变化；它还把 FILE、PACKAGE、WIRE_JSON、WIRE 区分成不同兼容层级。<Cite id="data-contract-breaking" sources={dataContractSources} />因此团队先要决定保护的是生成代码、JSON 还是二进制 wire，再选择对应检查规则。</p><p>对普通 JSON 接口也一样：发布检查应带上真实消费者、旧版本样本和迁移策略，不能只跑一次“字段能否解析”。检查通过表示某一层依赖没有被这次变化打破，不表示业务含义、数据新鲜度或隐私要求都已经正确。</p></ArticleSection>
    <ArticleSection id="data-contract-boundary-section" title="契约也有边界"><p id="data-contract-boundary" className="vp-citation-target">OpenAPI 和 JSON Schema 擅长描述和验证结构，Pact 擅长验证一组消费者实际发出的交互；它们都不能单独证明“邮箱一定属于这个人”或“订单金额一定正确”。<Cite id="data-contract-boundary" sources={dataContractSources} />业务校验、质量监控、权限和数据治理仍然要有自己的规则与负责人。</p><ArticleAside title="发布前问四个具体问题"><p>谁是生产者和消费者？旧字段还被谁读取？这次变化是在增加、弃用、改名还是改语义？如果必须破坏兼容，迁移窗口、双写方式、回滚点和删除旧字段的证据在哪里？把答案写进契约，评审才是在看一件可以执行的事。</p></ArticleAside></ArticleSection>
  </Article>;
}
