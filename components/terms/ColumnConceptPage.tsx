"use client";

import { ArrowCounterClockwise, CheckCircle, Columns, Pause, Play, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { columnSources } from "@/lib/column-sources";
import styles from "./ColumnConceptPage.module.css";

type ColumnPhase = "table" | "text" | "numeric" | "rejected";
const phases: Array<{ label: string; phase: ColumnPhase }> = [
  { label: "同一列 · 先看原值", phase: "table" },
  { label: "TEXT 镜片 · 按字符比较", phase: "text" },
  { label: "NUMERIC 镜片 · 按数值运算", phase: "numeric" },
  { label: "abc · 在写入边界被挡下", phase: "rejected" },
];

const values = ["2", "10", "9.5", "abc"];

function ColumnHero() {
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
  const textMode = phase === "text";
  const numericMode = phase === "numeric" || phase === "rejected";
  const invalidNumeric = (phase === "numeric" || phase === "rejected") ? "abc" : "";
  const visibleValues = values;
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="列类型像一枚镜片，改变同一组值的比较、运算和写入边界">
    <div className={styles.heroTop}><span>ONE COLUMN / DIFFERENT SEMANTICS</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.stage}>
      <div className={styles.tableCard}><div className={styles.tableHead}><span>orders</span><strong>amount</strong></div><div className={styles.tableRows}>{visibleValues.map((value, index) => <div className={styles.tableRow} data-rejected={value === invalidNumeric} key={value}><span>#{index + 1}</span><code>{value}</code>{value === invalidNumeric ? <XCircle size={13} aria-hidden="true" /> : <i aria-hidden="true" />}</div>)}</div></div>
      <div className={styles.lens} data-mode={phase}><div className={styles.lensRing} aria-hidden="true" /><div className={styles.lensBody}><Columns size={20} aria-hidden="true" /><span>{textMode ? "TEXT" : numericMode ? "NUMERIC" : "TYPE?"}</span><small>{textMode ? "字符序" : numericMode ? "数值序" : "等待定义"}</small></div><div className={styles.lensCaption}>{phase === "rejected" ? <><WarningCircle size={13} aria-hidden="true" />abc 不可转换</> : textMode ? "每行都当作字符" : numericMode ? "先校验，再计算" : "列类型是解释器"}</div></div>
      <div className={styles.resultCard} data-mode={phase}><div className={styles.resultHead}><span>{textMode ? "ORDER BY amount" : numericMode ? "SUM + ORDER BY" : "读这一列"}</span><ShieldCheck size={13} aria-hidden="true" /></div><strong>{phase === "rejected" ? "abc → invalid numeric" : textMode ? "10 · 2 · 9.5 · abc" : numericMode ? "2 · 9.5 · 10" : "2 · 10 · 9.5 · abc"}</strong><small>{textMode ? "字典序 · 不能直接按金额求和" : phase === "rejected" ? "写入被挡下 · 不参与求和" : numericMode ? "SUM = 21.5 · abc 待拒绝" : "先决定类型，结果才有含义"}</small></div>
    </div>
    <div className={styles.controls} role="group" aria-label="列类型首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>列不是表头贴纸；类型像一枚镜片，决定值怎样比较、能做什么运算、错误在哪一刻露出来。</figcaption>
  </figure>;
}

type Mode = "text" | "numeric";
type Verdict = "idle" | "text-result" | "numeric-result" | "numeric-block";

function ColumnLab() {
  const [mode, setMode] = useState<Mode>("text");
  const [value, setValue] = useState("abc");
  const [verdict, setVerdict] = useState<Verdict>("idle");
  function inspect() { setVerdict(mode === "text" ? "text-result" : value === "abc" ? "numeric-block" : "numeric-result"); }
  function chooseMode(next: Mode) { setMode(next); setVerdict("idle"); }
  function reset() { setMode("text"); setValue("abc"); setVerdict("idle"); }
  const inputValues = value === "abc" ? ["2", "10", "9.5", "abc"] : ["2", "10", "9.5", value];
  const numericValues = inputValues.filter((item) => item !== "abc");
  const textSortedValues = inputValues.slice().sort((a, b) => a.localeCompare(b));
  const numericSum = numericValues.reduce((sum, item) => sum + Number(item), 0);
  const outputText = mode === "text" ? textSortedValues.join(" · ") : verdict === "numeric-result" ? numericValues.slice().sort((a, b) => Number(a) - Number(b)).join(" · ") + " · SUM=" + numericSum : "等待检查";
  return <div className={styles.lab} aria-label="数据库列类型实验">
    <div className={styles.labHeader}><span>TRY IT / TYPE LENS</span><strong>换一枚列类型镜片，再看排序和写入</strong></div>
    <div className={styles.labChoices} role="group" aria-label="选择列类型"><button type="button" onClick={() => chooseMode("text")} aria-pressed={mode === "text"}>amount TEXT</button><button type="button" onClick={() => chooseMode("numeric")} aria-pressed={mode === "numeric"}>amount NUMERIC</button></div>
    <div className={styles.inputLine}><label htmlFor="column-value">准备写入 amount 的值</label><select id="column-value" value={value} onChange={(event) => { setValue(event.target.value); setVerdict("idle"); }}><option value="abc">abc</option><option value="12.5">12.5</option><option value="0">0</option></select><small>{mode === "text" ? "TEXT 会把它当作字符" : "NUMERIC 要求可转换为数字"}</small></div>
    <div className={styles.labBoard}><div className={styles.labColumn}><span>列定义</span><code>amount {mode.toUpperCase()}</code><small>{mode === "text" ? "字符比较" : "数值比较 + SUM"}</small></div><div className={styles.labOutput} data-error={verdict === "numeric-block"}><span>{verdict === "numeric-block" ? "写入回执" : "查询结果"}</span><strong>{outputText}</strong><small>{verdict === "numeric-block" ? "invalid input · numeric" : mode === "text" ? "字典序；金额语义没有自动出现" : "NUMERIC 结果"}</small></div></div>
    <div className={styles.labActions}><button type="button" onClick={inspect}><CheckCircle size={13} />检查这次写入</button><button type="button" onClick={reset}><ArrowCounterClockwise size={13} />重置</button></div>
    <div className={styles.labStatus} data-error={verdict === "numeric-block"} data-success={verdict === "numeric-result"} role="status" aria-live="polite"><strong>{verdict === "text-result" ? "TEXT · 写入能过，但排序仍是字符顺序，不能直接当金额计算。" : verdict === "numeric-result" ? "NUMERIC · 值能转换，排序和求和都有数值语义。" : verdict === "numeric-block" ? "BLOCK · NUMERIC 列拒绝 abc，错误在写入边界被看见。" : "还没有检查：选择列类型和待写入的值，再观察结果。"}</strong><span>{verdict === "idle" ? "实验用本地数据模拟 PostgreSQL 风格的类型约束，不连接数据库。" : "真实系统还要确认精度、空值、范围和迁移规则。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["column-definition-section", "列是每行都要遵守的定义"], ["column-type-section", "类型会改变比较和运算"], ["column-write-section", "错误应该在写入边界出现"], ["column-expression-section", "查询结果列不等于存储列"], ["column-boundary-section", "同名列在不同数据库里也可能有不同边界"]];

export function ColumnTermPage() {
  return <Article slug="column" title="列" subtitle="Column · 给每一格规定它是什么" sources={columnSources} sections={sections} hero={<ColumnHero />} intro={<>表格里那一列不是排版用的竖线。<strong>列为每一行的同一类值规定名字、类型、默认值和约束；一旦类型选错，排序、计算和错误暴露的时刻都会跟着变。</strong></>}>
    <ArticleSection id="column-definition-section" title="列是每行都要遵守的定义"><p id="column-definition" className="vp-citation-target"><strong>列是表结构里一个具名属性的定义，不是某一行当前填进去的值。</strong>PostgreSQL 的表定义会为列指定数据类型，也可以附加默认值和约束；类型决定数据库接受怎样的输入以及能对它做哪些操作。<Cite id="column-definition" sources={columnSources} />因此 `amount` 这列至少要回答：它是金额、文本还是别的值？能不能为空？不写时用什么默认值？</p><p>同一张订单表里，`amount`、`paid_at` 和 `status` 的职责不同。把它们都叫“字段”并没有错，但把列只当作 UI 表头会漏掉真正会执行的规则：数据库在写入、比较和查询时都会拿定义来判断。</p></ArticleSection>
    <ArticleSection id="column-type-section" title="类型会改变比较和运算"><p id="column-type" className="vp-citation-target"><strong>类型不是显示标签，它会改变值的意义。</strong>如果 `amount` 是 PostgreSQL 的 `TEXT`，`10` 和 `2` 参与排序时按字符序比较，`10` 会排在 `2` 前面；如果是 `NUMERIC`，数据库才有按数值比较和精确计算的基础。PostgreSQL 的数据类型文档把类型和可用操作、转换规则放在一起；SQLite 则采用类型亲和性，列声明不一定阻止某种存储类进入。<Cite id="column-type" sources={columnSources} />所以“看起来都是数字”不等于“数据库把它们当数字”。</p><ColumnLab /><p>实验把同一组输入放进两枚镜片里：TEXT 能保存字符，但不会凭空获得金额语义；NUMERIC 能参与数值排序和 `SUM`，遇到无法转换的 `abc` 则在写入边界拒绝。页面只模拟 PostgreSQL 风格的严格路径，SQLite 的亲和性差异会在边界段单独说明。</p></ArticleSection>
    <ArticleSection id="column-write-section" title="错误应该在写入边界出现"><p id="column-write" className="vp-citation-target"><strong>越早发现类型错误，越不需要在报表和业务代码里补救。</strong>PostgreSQL 的列类型、`NOT NULL`、`CHECK` 等定义可以把不符合规则的值挡在写入处；默认值只在调用方没有提供值时补上，并不会替错误的显式值洗白。<Cite id="column-write" sources={columnSources} />这也是“`abc` 被拒绝”比“先存下来，之后每个查询都尝试转换”更容易维护的原因。</p><p>当然，数据库能检查的只是它知道的规则。金额不能为负、币种必须和账户匹配、退款不能超过已付金额，可能需要更高层的业务约束；列定义应把可局部判断的部分先固定下来，再把跨行、跨表的规则交给合适的事务或服务。</p></ArticleSection>
    <ArticleSection id="column-expression-section" title="查询结果列不等于存储列"><p id="column-expression" className="vp-citation-target"><strong>SQL 查询里也会出现“列”，但它可能只是这次查询算出来的结果。</strong>PostgreSQL 的 select list 可以输出存储列、表达式和函数结果，例如 `amount * 1.2 AS gross_amount`；这个结果列有名字和类型，却不等于表里新增了一列。<Cite id="column-expression" sources={columnSources} />分清两者，才不会把报表里的计算结果误当成可以直接写回的结构。</p><p>存储列负责长期保存和约束；表达式列负责当前查询的展示或计算。需要持久化、索引或复用时，再考虑生成列、视图或写回流程，并明确谁是事实来源。</p></ArticleSection>
    <ArticleSection id="column-boundary-section" title="同名列在不同数据库里也可能有不同边界"><p id="column-boundary" className="vp-citation-target">“声明了 NUMERIC 就一定挡住所有非数字”也不能脱离数据库实现来讲。PostgreSQL 的类型系统更严格，而 SQLite 使用存储类和类型亲和性，声明类型会影响推荐转换，却不等同于强制每个值都来自同一类型。<Cite id="column-boundary" sources={columnSources} />迁移数据库、导入 CSV 或接收 JSON 时，必须在目标数据库上重新验证。</p><ArticleAside title="设计一列前先写五个答案"><p>它代表什么？合法值是什么？比较和聚合怎么做？缺失时怎么办？坏值应该拒绝、转成空值，还是进入隔离区？把这些答案写进类型、约束和导入校验，列才真正成为数据契约。</p></ArticleAside></ArticleSection>
  </Article>;
}
