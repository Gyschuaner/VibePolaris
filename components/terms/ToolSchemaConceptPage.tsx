"use client";

import { ArrowCounterClockwise, CheckCircle, Code, LockKey, Pause, Play, ShieldCheck, WarningCircle, Wrench, XCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { toolSchemaSources } from "@/lib/tool-schema-sources";
import styles from "./ToolSchemaConceptPage.module.css";

type HeroPhase = "draft" | "shape" | "blocked" | "passed";

const phases: Array<{ label: string; phase: HeroPhase }> = [
  { label: "模型提出调用", phase: "draft" },
  { label: "参数对准形状", phase: "shape" },
  { label: "错误在锁前回执", phase: "blocked" },
  { label: "通过后才执行", phase: "passed" },
];

function ToolSchemaHero() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const reducedMotion = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotion.current = media.matches; if (media.matches) setPlaying(false); };
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
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
  const blocked = phase === "blocked";
  const passed = phase === "passed";
  const payload = blocked ? "{ }" : passed ? '{ city: "上海" }' : '{ city: ? }';
  return <figure ref={heroRef} className={styles.hero} data-phase={phase} aria-label="工具 Schema 用形状锁检查参数，错误在工具执行前留下回执">
    <div className={styles.heroTop}><span>TOOL CALL / SHAPE LOCK</span><strong>{phases[phaseIndex].label}</strong></div>
    <div className={styles.stage}>
      <div className={styles.requestCard} data-invalid={blocked} data-passed={passed}>
        <div className={styles.cardLabel}><Code size={14} aria-hidden="true" /><span>模型提议</span></div>
        <code>get_weather</code>
        <strong>{payload}</strong>
        <small>{blocked ? "缺少 required: city" : passed ? "city · string" : "等待校验"}</small>
      </div>
      <div className={styles.lockAssembly} data-invalid={blocked} data-passed={passed}>
        <div className={styles.lockHalo} aria-hidden="true" />
        <div className={styles.lockBody}><LockKey size={21} aria-hidden="true" /><span>SCHEMA LOCK</span><strong>city: string</strong><small>required · enum 可选</small></div>
        <div className={styles.lockSlot} aria-hidden="true"><span className={styles.payloadChip}>{blocked ? "city?" : passed ? "上海" : "参数"}</span></div>
        <div className={styles.lockVerdict}>{blocked ? <><XCircle size={14} aria-hidden="true" />BLOCK</> : passed ? <><CheckCircle size={14} aria-hidden="true" />PASS</> : <><ShieldCheck size={14} aria-hidden="true" />CHECK</>}</div>
      </div>
      <div className={styles.toolCard} data-disabled={!passed} data-passed={passed}>
        <div className={styles.cardLabel}><Wrench size={14} aria-hidden="true" /><span>天气工具</span></div>
        <strong>{passed ? "24°C · 晴" : "等待可执行输入"}</strong>
        <small>{blocked ? "没有触发外部调用" : passed ? "tool_result · call_17" : "副作用在锁之后"}</small>
      </div>
    </div>
    <div className={styles.receipt} data-visible={blocked || passed} data-error={blocked}><span>{blocked ? "错误回执" : "调用回执"}</span><code>{blocked ? "invalid_arguments · city is required" : passed ? "call_17 → 24°C" : "先判断参数形状"}</code></div>
    <div className={styles.controls} role="group" aria-label="工具 Schema 首图控制"><button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{playing ? "暂停" : "播放"}</button>{phases.map((item, index) => <button type="button" key={item.phase} onClick={() => { setPhaseIndex(index); setPlaying(false); }} aria-pressed={phaseIndex === index}>{index + 1}</button>)}<button type="button" onClick={() => { setPhaseIndex(0); setPlaying(true); }}><ArrowCounterClockwise size={12} aria-hidden="true" />重播</button></div>
    <figcaption className={styles.caption}>Schema 是门锁的形状，不是万能通行证：它先挡住坏参数，再把合格请求交给授权和工具。</figcaption>
  </figure>;
}

type Scenario = "valid" | "missing" | "wrong-type";
type Decision = "idle" | "schema-block" | "auth-block" | "executed";

const scenarioLabels: Record<Scenario, string> = { valid: "city: \"上海\"", missing: "{} · 缺 city", "wrong-type": "city: 24 · number" };

function ToolSchemaLab() {
  const [scenario, setScenario] = useState<Scenario>("missing");
  const [authorized, setAuthorized] = useState(false);
  const [decision, setDecision] = useState<Decision>("idle");

  function inspect() {
    if (scenario !== "valid") setDecision("schema-block");
    else if (!authorized) setDecision("auth-block");
    else setDecision("executed");
  }
  function choose(next: Scenario) { setScenario(next); setDecision("idle"); }
  function reset() { setScenario("missing"); setAuthorized(false); setDecision("idle"); }
  const schemaBlocked = decision === "schema-block";
  return <div className={styles.lab} aria-label="工具 Schema 参数与授权实验">
    <div className={styles.labHeader}><span>TRY IT / BEFORE SIDE EFFECT</span><strong>先让一份调用过形状锁，再决定能不能动工具</strong></div>
    <div className={styles.scenario} role="group" aria-label="选择调用参数"><button type="button" onClick={() => choose("valid")} aria-pressed={scenario === "valid"}>city: "上海"</button><button type="button" onClick={() => choose("missing")} aria-pressed={scenario === "missing"}>缺少 city</button><button type="button" onClick={() => choose("wrong-type")} aria-pressed={scenario === "wrong-type"}>city 是数字</button></div>
    <label className={styles.authToggle}><input type="checkbox" checked={authorized} onChange={(event) => { setAuthorized(event.target.checked); setDecision("idle"); }} /><span>已获得调用天气工具的授权</span><small>{authorized ? "permission: granted" : "permission: missing"}</small></label>
    <div className={styles.labBoard}><div className={styles.labRequest}><span>提出的调用</span><code>get_weather({scenarioLabels[scenario]})</code><small>模型只能提议，执行器还没动手</small></div><div className={styles.labLock} data-blocked={schemaBlocked}><LockKey size={18} aria-hidden="true" /><strong>city: string · required</strong><small>只检查结构和值域</small></div><div className={styles.labTool} data-executed={decision === "executed"}><Wrench size={17} aria-hidden="true" /><span>{decision === "executed" ? "24°C · 晴" : "天气工具"}</span><small>{decision === "executed" ? "已收到合格请求" : "等待放行"}</small></div></div>
    <div className={styles.labActions}><button type="button" onClick={inspect}><ShieldCheck size={13} />检查并决定</button><button type="button" onClick={reset}><ArrowCounterClockwise size={13} />重置</button></div>
    <div className={styles.labStatus} data-error={schemaBlocked || decision === "auth-block"} data-success={decision === "executed"} role="status" aria-live="polite"><strong>{decision === "schema-block" ? "BLOCK · 参数形状不合格，工具没有被调用。" : decision === "auth-block" ? "BLOCK · 形状合格，但授权层没有放行。" : decision === "executed" ? "PASS · 先通过 Schema，再通过授权，工具才返回结果。" : "还没有裁决：换一份参数或勾上授权，再检查。"}</strong><span>{decision === "schema-block" ? "错误回执可以解释缺少字段或类型错误，不能靠猜测补齐。" : decision === "auth-block" ? "Schema 通过只说明‘长得对’，不说明‘可以做’。" : decision === "executed" ? "演示只改变本地状态；没有请求真实天气服务。" : "把结构校验、授权和执行结果分开看。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["tool-schema-definition-section", "Schema 先回答工具接受什么"], ["tool-schema-input-section", "类型、必填和值域要写成规则"], ["tool-schema-rejection-section", "坏参数应该停在副作用之前"], ["tool-schema-output-section", "返回值也要有归属和形状"], ["tool-schema-boundary-section", "形状合格仍然不能替你做决定"]];

export function ToolSchemaTermPage() {
  return <Article slug="tool-schema" title="工具 Schema" subtitle="Tool Schema · 先锁住输入，再允许动作" sources={toolSchemaSources} sections={sections} hero={<ToolSchemaHero />} intro={<>模型说“我来调用天气工具”时，真正要执行的程序还不能只看这句话。<strong>工具 Schema 把名称、输入字段和约束写成可检查的形状，让执行层先挡住坏参数，再把合格请求交给授权和外部工具。</strong></>}>
    <ArticleSection id="tool-schema-definition-section" title="Schema 先回答工具接受什么"><p id="tool-schema-definition" className="vp-citation-target"><strong>工具 Schema 是一份机器能检查的调用契约：工具叫什么、输入是什么形状、哪些字段必须出现、结果可能长什么样。</strong>OpenAI 的 function calling 用 JSON Schema 描述函数参数；MCP 的工具定义也包含名称、描述、输入 Schema 和可选的输出 Schema。<Cite id="tool-schema-definition" sources={toolSchemaSources} />模型负责提出一次 `get_weather` 调用，应用或客户端仍要决定是否真的执行。</p><p>不同平台把交互叫法写得不一样，但边界相同：Anthropic 的流程是模型返回 `tool_use`，应用执行工具，再把带有对应 id 的 `tool_result` 送回去。<Cite id="tool-schema-definition" sources={toolSchemaSources} />所以 Schema 不是“模型已经调用成功”的证明，它只把准备交接的那一份数据变得可读、可验。</p></ArticleSection>
    <ArticleSection id="tool-schema-input-section" title="类型、必填和值域要写成规则"><p id="tool-schema-input" className="vp-citation-target"><strong>`city` 是字符串和 `city` 必须存在，是两条不同的检查。</strong>JSON Schema 的 `type` 约束实例的基本类型，`required` 约束对象里必须出现哪些属性，`enum` 则把可接受的值列成集合。<Cite id="tool-schema-input" sources={toolSchemaSources} />这就是为什么 &#123; city: 24 &#125; 和 &#123;&#125; 都不能因为“看起来像一份参数”而直接进入天气服务。</p><p>规则还要写到执行器真正能执行的程度。OpenAI 的 strict 模式要求 Schema 使用受支持的约束，例如对象关闭额外属性、必填字段齐全；需要“可选”时，可以明确允许 `null`，而不是让缺失和空值悄悄混在一起。<Cite id="tool-schema-input" sources={toolSchemaSources} />这些限制是某种实现的使用条件，不是 JSON Schema 所有方言的统一默认值。</p></ArticleSection>
    <ArticleSection id="tool-schema-rejection-section" title="坏参数应该停在副作用之前"><p id="tool-schema-rejection" className="vp-citation-target"><strong>校验失败的调用应该留下错误回执，并在工具产生外部副作用前停止。</strong>MCP 把“未知工具、无效参数、服务器错误”区分为不同失败；它还要求服务器验证输入、做访问控制、限制速率并清理输出。<Cite id="tool-schema-rejection" sources={toolSchemaSources} />这比先调用天气服务、等服务自己报错更容易定位，也避免把猜测送进写入、付款或删除动作。</p><ToolSchemaLab /><p>实验里缺 `city` 或把它写成数字，锁会直接给出 `BLOCK`；即使 `city` 写对，未勾选授权也仍会被第二道门拦下。两次拦截看起来都像“没执行”，但前者是结构错误，后者是权限决策，错误回执应该把原因说清楚。</p></ArticleSection>
    <ArticleSection id="tool-schema-output-section" title="返回值也要有归属和形状"><p id="tool-schema-output" className="vp-citation-target"><strong>通过输入检查只代表请求可以交给工具，结果回来后仍要知道它属于哪一次调用、是否成功、是否符合预期形状。</strong>OpenAI 要求工具输出引用具体的 call id；Anthropic 也用 `tool_use_id` 把 `tool_result` 接回原来的请求。<Cite id="tool-schema-output" sources={toolSchemaSources} />没有这个归属，多个并发天气查询的结果可能被接错对象。</p><p>MCP 的工具结果可以带 `structuredContent` 和 `isError`，服务端要遵守输出 Schema，客户端也应验证结构。<Cite id="tool-schema-output" sources={toolSchemaSources} />因此“返回了 24°C”还不够：调用方要区分正常结果、工具内部错误和协议层错误，再决定是否重试、展示或让模型继续。</p></ArticleSection>
    <ArticleSection id="tool-schema-boundary-section" title="形状合格仍然不能替你做决定"><p id="tool-schema-boundary" className="vp-citation-target">Schema 能回答“这份数据像不像工具接受的输入”，不能单独回答“当前用户有没有权调用”“这个城市是不是用户真正想查的城市”“外部结果是否新鲜”，也不能替你设计超时、幂等、速率限制和敏感操作确认。MCP 把输入校验、访问控制、限流、输出清理和敏感操作确认都列为工具安全边界。<Cite id="tool-schema-boundary" sources={toolSchemaSources} /></p><ArticleAside title="把三道门分别写下来"><p>第一道门检查形状：名称、类型、必填和值域；第二道门检查权限和用户意图；第三道门才是执行、超时、重试和结果核验。三道门都通过，才适合把“工具已完成”告诉用户。</p></ArticleAside></ArticleSection>
  </Article>;
}
