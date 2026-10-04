"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Code, GitBranch, GitCommit, Graph, ShieldWarning, TestTube, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RegressionTestConcept.module.css";

const steps = [
  { label: "看差异", title: "先圈出真正改动的地方", detail: "这次只改了 auth middleware；回归问题从这条差异开始追。", Icon: GitCommit },
  { label: "展开引用", title: "沿调用关系找会被碰到的旧行为", detail: "登录、会话、订单和后台权限都读这块中间件。", Icon: Graph },
  { label: "叠加风险", title: "把历史越权缺陷补进候选", detail: "有些高风险用例不在直接调用图上，也不能因为看不见就删掉。", Icon: ShieldWarning },
  { label: "合并去重", title: "把候选收成一组可执行的回归集", detail: "4 个直接测试、7 个集成测试和 3 个安全用例合并为 14 个。", Icon: TestTube },
  { label: "抓住倒退", title: "旧行为真的变坏时，测试要把它指出来", detail: "admin-list-as-editor 期待 403，却得到 200；先停下来修权限。", Icon: WarningCircle },
];

type Scope = "impact" | "risk" | "full";
const scopeData: Record<Scope, { label: string; count: string; detail: string; conclusion: string }> = {
  impact: { label: "只看影响关系", count: "11 / 32", detail: "4 direct · 7 integration", conclusion: "INCOMPLETE · 风险盲区" },
  risk: { label: "影响 + 历史风险", count: "14 / 32", detail: "4 direct · 7 integration · 3 security", conclusion: "FAIL · 403 → 200" },
  full: { label: "全量校准", count: "32 / 32", detail: "周期性基准跑全量", conclusion: "FAIL · 403 → 200" },
};

const nodes = [
  { id: "login", label: "登录", value: "direct · 4", group: "直接" },
  { id: "session", label: "会话", value: "shared", group: "影响" },
  { id: "order", label: "订单", value: "integration · 7", group: "跨模块" },
  { id: "admin", label: "后台权限", value: "history · 3", group: "风险" },
];

export function RegressionTestHero() {
  const scene = useScene(steps.length);
  const [scope, setScope] = useState<Scope>("risk");
  const current = steps[scene.step];
  const selected = scopeData[scope];
  const riskVisible = scene.step >= 2 && scope !== "impact";
  const selectedVisible = scene.step >= 3;
  const failed = scene.step === 4 && scope !== "impact";
  const chooseScope = (next: Scope) => { setScope(next); scene.seek(0); };

  return <figure ref={scene.ref} className={styles.regHero} data-step={scene.step} data-scope={scope} aria-label="回归测试如何从一次代码改动展开影响关系并选择测试范围">
    <div className={styles.regHeroHeader}><span>一处鉴权改动，怎样找回不该被改变的旧行为</span><strong>diff → impact → risk → regression</strong></div>
    <div className={styles.regHeroChoices} role="group" aria-label="选择回归范围"><button type="button" className={styles.regChoice} aria-pressed={scope === "impact"} onClick={() => chooseScope("impact")}>只看影响关系</button><button type="button" className={styles.regChoice} aria-pressed={scope === "risk"} onClick={() => chooseScope("risk")}>影响 + 历史风险</button><button type="button" className={styles.regChoice} aria-pressed={scope === "full"} onClick={() => chooseScope("full")}>全量校准</button></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.regHeroBoard}>
      <div className={styles.regHeroChange} data-active={scene.step === 0} data-done={scene.step > 0}>
        <div className={styles.regLabel}><GitCommit size={17} aria-hidden="true" /><span>变更</span></div>
        <h3>auth middleware</h3>
        <code>commit 8c42 · changed</code>
        <div className={styles.regDiff}><span>- role = user</span><strong>+ policy.check()</strong></div>
        <small>从差异开始，而不是从“所有测试”开始。</small>
      </div>
      <div className={styles.regHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.regHeroImpact} data-active={scene.step >= 1 && scene.step <= 2} data-done={scene.step > 2}>
        <div className={styles.regLabel}><Graph size={17} aria-hidden="true" /><span>影响关系</span></div>
        <h3>谁共享这条规则？</h3>
        <div className={styles.regNodeGrid}>{nodes.map(node => <div key={node.id} className={styles.regNode} data-risk={node.id === "admin"} data-visible={scene.step >= 1 && (node.id !== "admin" || riskVisible)} data-active={scene.step === 1 || (scene.step === 2 && (node.id === "admin" || node.id === "order"))} data-done={scene.step >= 3}><strong>{node.label}</strong><code>{node.value}</code><small>{node.id === "admin" && !riskVisible ? "尚未纳入" : node.group}</small></div>)}</div>
        <p>{riskVisible ? "调用图之外的历史风险也进入候选。" : scene.step >= 1 ? "直接与跨模块引用先亮出来。" : "等待展开引用关系。"}</p>
      </div>
      <div className={styles.regHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.regHeroResult} data-active={selectedVisible} data-danger={failed} data-incomplete={scene.step === 4 && scope === "impact"}>
        <div className={styles.regLabel}>{failed ? <WarningCircle size={17} aria-hidden="true" /> : <TestTube size={17} aria-hidden="true" />}<span>回归集</span></div>
        <h3>{!selectedVisible ? "等待选集" : selected.label}</h3>
        <strong className={styles.regCount}>{selectedVisible ? selected.count : "— / 32"}</strong>
        <code>{selectedVisible ? selected.detail : "尚未分析"}</code>
        <p>{failed ? "旧权限行为倒退，测试把第一处不一致留在这里。" : scene.step === 4 && scope === "impact" ? "只沿调用图不够，历史缺陷仍在盲区。" : scene.step >= 3 ? "范围可解释，下一步才是执行。" : "候选集还没有合并。"}</p>
        <div className={styles.regResultSeal} data-danger={failed} data-incomplete={scene.step === 4 && scope === "impact"}>{scene.step < 4 ? "PENDING" : selected.conclusion}</div>
      </div>
    </div>
    <div className={styles.regHeroMetrics}><div><span>候选总数</span><strong>{selectedVisible ? selected.count : "32 tests"}</strong></div><div><span>历史缺陷</span><strong>{riskVisible ? "已纳入" : "待补"}</strong></div><div><span>结论</span><strong>{scene.step === 4 ? selected.conclusion : "分析中"}</strong></div></div>
    <div className={styles.regHeroStatus} data-danger={failed} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>回归测试不是把旧测试全倒进流水线，而是从变更出发，沿影响关系和风险历史挑出一组能回答“原来好的行为还好吗”的检查。</figcaption>
  </figure>;
}
