"use client";

import { ArrowRight, Brain, CheckCircle, FileText, Lightning, ListChecks, Scales, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { reasoningModelConceptSources } from "@/lib/reasoning-model-sources";
import styles from "./ReasoningModelConceptPage.module.css";

const frames = [
  { label: "直觉落下", phase: "GUESS", verdict: "可以退款", checks: ["未发货", "30天内", "包装完整"], checked: [], note: "一个顺手的结论先落下来，但它还没有逐项对过条件。" },
  { label: "条件摊开", phase: "OPEN", verdict: "等待核对", checks: ["未发货", "30天内", "包装完整"], checked: [], note: "把一句“可以”拆成三张小卡，遗漏的条件终于有了位置。" },
  { label: "逐项配对", phase: "CHECK", verdict: "还不能盖章", checks: ["未发货", "12天", "包装完整 …"], checked: [0, 1], note: "可复算的记录只公开条件状态；最后一项没有证据，就继续停在这里。" },
  { label: "结论带条件", phase: "SEAL", verdict: "可以退款 · 仅限未发货", checks: ["未发货", "12天", "包装完整"], checked: [0, 1, 2], note: "所有条件都落到已知输入后，结论才带着范围一起交付。" },
  { label: "预算耗尽", phase: "STOP", verdict: "未完成 · 不能盖章", checks: ["未发货", "12天", "包装完整 …"], checked: [0, 1], note: "额外计算也有上限；停在中间时，应该保留未完成，而不是补一个完整答案。" },
] as const;

function ConditionLedger({ frame }: { frame: typeof frames[number] }) {
  const checked = frame.checked as readonly number[];
  return <div className={styles.ledger} aria-label="退款条件记录">
    <div className={styles.ledgerHead}><ListChecks size={18} aria-hidden="true" /><span>公开检查记录</span><code>{frame.phase}</code></div>
    <div className={styles.conditionList}>{frame.checks.map((check, index) => <div key={check} className={styles.condition} data-checked={checked.includes(index)} data-pending={check.endsWith("?") || check.endsWith("…")}><span className={styles.conditionMark}>{checked.includes(index) ? <CheckCircle size={16} weight="fill" aria-hidden="true" /> : check.endsWith("…") ? <WarningCircle size={16} aria-hidden="true" /> : <span aria-hidden="true" />}</span><strong>{check}</strong></div>)}</div>
  </div>;
}

function BalanceGlyph({ frame }: { frame: typeof frames[number] }) {
  const complete = frame.phase === "SEAL";
  const stopped = frame.phase === "STOP";
  return <div className={styles.balance} data-complete={complete} data-stopped={stopped} aria-label={complete ? "条件已平衡" : stopped ? "预算停止，条件未平衡" : "条件仍在平衡"}>
    <div className={styles.balanceTop}><span className={styles.balancePivot} /><span className={styles.balanceBeam} /><span className={styles.balancePin} /></div>
    <div className={styles.balancePans}><div className={styles.balancePan}><span>结论</span><strong>{complete ? "可交付" : "先别盖章"}</strong></div><div className={styles.balancePan}><span>证据</span><strong>{complete ? "3 / 3" : `${frame.checked.length} / 3`}</strong></div></div>
    <div className={styles.balanceLabel}>{stopped ? "预算到边" : complete ? "条件平衡" : "还在核对"}</div>
  </div>;
}

function ReasoningHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const inputSummary = current.phase === "SEAL" ? "订单 · 12天 · 条件已核对" : current.phase === "CHECK" || current.phase === "STOP" ? "订单 · 12天 · 2项已核对" : current.phase === "OPEN" ? "订单 · 12天 · 条件待核对" : "订单 · 12天 · 状态未知";
  return <figure ref={scene.ref} className={styles.hero} aria-label="推理模型如何把退款判断拆成条件并受预算约束的演示">
    <div className={styles.heroTop}><span>CONSTRAINT BALANCE / REASONING</span><strong>{current.phase} · {scene.step + 1}/5</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.balanceBoard} data-phase={current.phase}>
      <div className={styles.promptCard}><Brain size={19} aria-hidden="true" /><span>同一个问题</span><strong>这件商品能退款吗？</strong><code>{inputSummary}</code></div>
      <div className={styles.balanceColumn}><BalanceGlyph frame={current} /><div className={styles.balanceArrow}><ArrowRight size={17} aria-hidden="true" /><span>逐项对条件</span></div></div>
      <ConditionLedger frame={current} />
      <div className={styles.verdictCard} data-danger={current.phase === "STOP"} data-soft={current.phase === "GUESS"}><div>{current.phase === "STOP" ? <XCircle size={19} aria-hidden="true" /> : current.phase === "SEAL" ? <CheckCircle size={19} aria-hidden="true" /> : <Scales size={19} aria-hidden="true" />}<span>对外结论</span></div><strong>{current.verdict}</strong><code>{current.phase === "SEAL" ? "条件完整 · 可复核" : current.phase === "STOP" ? "推理预算已用尽" : "范围尚未封口"}</code></div>
    </div>
    <div className={styles.heroNote} data-danger={current.phase === "STOP"} role="status" aria-live="polite"><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>把“更会想”画成一杆会停下来的天平：结论的重量，必须由已核对的条件托住。</figcaption>
  </figure>;
}

type Budget = "enough" | "tight";
type LabMode = "refund" | "delivery";

function ReasoningBudgetLab() {
  const scene = useScene(3);
  const [budget, setBudget] = useState<Budget>("enough");
  const [mode, setMode] = useState<LabMode>("refund");
  const stopped = budget === "tight" && scene.step >= 2;
  const checks = mode === "refund" ? ["未发货", "30天内", "包装完整"] : ["地址完整", "库存足够", "承诺时效"];
  const doneCount = stopped ? 2 : scene.step === 0 ? 0 : scene.step === 1 ? 2 : 3;
  const verdict = stopped ? "未完成 · 等待补算" : doneCount === 3 ? mode === "refund" ? "可以退款 · 带条件" : "可以发货 · 带时效" : "先核对条件";
  return <div ref={scene.ref} className={styles.lab} role="region" aria-label="推理预算与条件核对实验">
    <div className={styles.labTop}><span>LOCAL CHECK LEDGER / NO MODEL CALL</span><strong>只模拟预算边界</strong></div>
    <SceneControls scene={scene} labels={["拿到问题", "核对两项", "盖章或停下"]} />
    <div className={styles.labControls} role="group" aria-label="改变推理条件"><button type="button" aria-pressed={budget === "enough"} onClick={() => { setBudget("enough"); scene.seek(2); }}>预算充足</button><button type="button" aria-pressed={budget === "tight"} onClick={() => { setBudget("tight"); scene.seek(2); }}>预算紧张</button><button type="button" aria-pressed={mode === "refund"} onClick={() => { setMode("refund"); scene.seek(0); }}>换成退款</button><button type="button" aria-pressed={mode === "delivery"} onClick={() => { setMode("delivery"); scene.seek(0); }}>换成发货</button></div>
    <div className={styles.labBoard} data-stopped={stopped}>
      <div className={styles.labQuestion}><FileText size={20} aria-hidden="true" /><span>这次判断</span><strong>{mode === "refund" ? "商品能退款吗？" : "今天能发货吗？"}</strong><code>条件 {checks.length} 项</code></div>
      <div className={styles.labLedger}><div className={styles.labLedgerHead}><span>已落账</span><strong>{doneCount} / 3</strong></div>{checks.map((check, index) => <div className={styles.labCheck} key={check} data-done={index < doneCount} data-paused={stopped && index === 2}><span>{index < doneCount ? <CheckCircle size={15} weight="fill" aria-hidden="true" /> : stopped && index === 2 ? <WarningCircle size={15} aria-hidden="true" /> : <span aria-hidden="true" />}</span><strong>{check}</strong><small>{index < doneCount ? "已核对" : stopped && index === 2 ? "还没算完" : "等待"}</small></div>)}</div>
      <div className={styles.labSeal} data-stopped={stopped} data-complete={doneCount === 3}><Scales size={22} aria-hidden="true" /><span>结论</span><strong>{verdict}</strong><small>{stopped ? "不要把半截过程写成已验证" : doneCount === 3 ? "每一项都能回到输入" : "继续留下公开记录"}</small></div>
    </div>
    <div className={styles.labStatus} data-danger={stopped} role="status" aria-live="polite">{stopped ? <WarningCircle size={16} aria-hidden="true" /> : <Lightning size={16} aria-hidden="true" />}<span><strong>{stopped ? "预算先到边界" : budget === "enough" ? "预算允许完成核对" : "当前步骤还没触发停止"}</strong> · {stopped ? "应用应该返回未完成或请求补算；它不应替模型盖章。" : "增加计算只改变核对机会，外部事实仍要回到订单、库存或规则来源。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["reasoning-definition", "它多做了哪一步"], ["reasoning-search", "候选路径怎样被比较"], ["reasoning-boundary", "预算和事实边界在哪里"]];

export function ReasoningModelConceptTermPage() {
  return <Article slug="reasoning-model" title="推理模型" subtitle="Reasoning Model · 让条件逐项落账，再决定结论" sources={reasoningModelConceptSources} sections={sections} hero={<ReasoningHero />} intro={<>推理模型会把一部分计算留给多步骤任务。<strong>它多争取的是检查条件、比较路径的机会，不是自动获得事实，也不是把更长的过程变成正确证明。</strong></>}>
    <ArticleSection id="reasoning-definition" title="它多做了哪一步"><p id="reasoning-effort" className="vp-citation-target">直接回答像从问题跳到结论；推理模型会在两者之间保留更多计算。OpenAI 文档把 reasoning tokens 计入输入输出上下文和费用，并说明 effort 会影响推理用量、延迟与完成质量；应用要给最终回答预留空间。<Cite id="reasoning-effort" sources={reasoningModelConceptSources} /></p><p id="reasoning-budget" className="vp-citation-target">这部分过程不等于一份自动生成的审计报告。推理 token 对 API 使用者通常不可见，却会占用上下文和输出预算；预算到头时，模型可能还没来得及返回完整的可见答案。<Cite id="reasoning-budget" sources={reasoningModelConceptSources} /></p><ReasoningBudgetLab /></ArticleSection>
    <ArticleSection id="reasoning-search" title="候选路径怎样被比较"><p id="reasoning-chain" className="vp-citation-target">Chain-of-Thought 研究观察到，给出一串中间步骤可以改善一些算术、常识和符号任务。这里的关键是让中间计算有机会发生；它本身没有把外部世界的事实塞进模型。<Cite id="reasoning-chain" sources={reasoningModelConceptSources} /></p><p id="reasoning-tree" className="vp-citation-target">Tree of Thoughts 把多个“思路单元”保留下来，允许模型评估、回看或换路。对读者来说，最有用的公开记录不是一段私有心路，而是哪些候选被保留、哪些条件已核对、最后结论覆盖多大范围。<Cite id="reasoning-tree" sources={reasoningModelConceptSources} /></p><p>退款例子里，天平不展示模型的隐藏思考；它只把可以复算的条件做成账本。这样“答得慢”才有具体含义：多了一次条件核对，而不是多了一层神秘光环。</p></ArticleSection>
    <ArticleSection id="reasoning-boundary" title="预算和事实边界在哪里"><p id="reasoning-training" className="vp-citation-target">DeepSeek-R1 论文展示了用强化学习训练出自我反思、验证和动态调整等推理模式的路线。这是一个模型家族的训练结果，不是所有推理模型都用同一种训练方法。<Cite id="reasoning-training" sources={reasoningModelConceptSources} /></p><p id="reasoning-boundary" className="vp-citation-target">OpenAI 的推理最佳实践建议用清楚的约束组织请求，而不要要求模型暴露私有思维链；NIST 则要求用已知事实、人工监督或自动评估去检查生成结果的准确性和可靠性。推理越长，越应该把输入、预算状态和外部校验写清楚。<Cite id="reasoning-boundary" sources={reasoningModelConceptSources} /></p><p><strong>读者判断</strong>：先问“它检查了哪些条件”，再问“预算是否完整”，最后把需要负责的结论交回订单、工具、原文或人工。推理过程可以帮你走远一点，但事实仍要有落脚处。</p><ArticleAside title="为什么演示不画私有思维链"><p>模型内部的推理 token 不是给读者逐字审计的公开日志。词条把它改写成条件账本：每一项都能回到输入，每一步都能说清是否完成，停在边界时也不会伪装成答案。这个公开层足够解释机制，也避免把一段看似连贯的文字误当成事实证明。</p></ArticleAside></ArticleSection>
  </Article>;
}
