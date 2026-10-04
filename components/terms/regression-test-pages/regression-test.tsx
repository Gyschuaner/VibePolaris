"use client";

import { useState } from "react";
import { CheckCircle, Code, Database, GitBranch, GitCommit, ListChecks, ShieldWarning, TestTube, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RegressionTestConcept.module.css";

const labels = ["摆出差异", "追共享依赖", "补历史风险", "合并候选", "判定倒退"];
type Scope = "impact" | "risk" | "full";

const scopes: Record<Scope, { title: string; count: string; summary: string }> = {
  impact: { title: "影响关系集", count: "11 / 32", summary: "直接与跨模块引用" },
  risk: { title: "影响 + 风险集", count: "14 / 32", summary: "再加 3 个历史越权用例" },
  full: { title: "全量对照集", count: "32 / 32", summary: "周期性校准基准" },
};

const lanes = [
  { id: "direct", label: "直接测试", count: 4, Icon: Code, detail: "middleware 规则与返回码" },
  { id: "integration", label: "跨模块测试", count: 7, Icon: Database, detail: "订单、会话、API 客户端" },
  { id: "security", label: "历史风险", count: 3, Icon: ShieldWarning, detail: "越权缺陷曾经在这里出现" },
];

export function RegressionTestLesson() {
  const scene = useScene(labels.length);
  const [scope, setScope] = useState<Scope>("risk");
  const selected = scopes[scope];
  const failureVisible = scene.step >= 4 && scope !== "impact";
  const riskIncluded = scene.step >= 2 && scope !== "impact";
  const selectedVisible = scene.step >= 3;
  const resetScope = (next: Scope) => { setScope(next); scene.seek(0); };

  return <div ref={scene.ref} className={styles.regLab} role="region" aria-label="回归测试从影响分析到历史风险选择的工作台">
    <div className={styles.regLabHeader}><span>改动越小，影响判断越要具体</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.regLabControls} role="group" aria-label="选择回归策略"><button type="button" className={styles.regLabButton} aria-pressed={scope === "impact"} onClick={() => resetScope("impact")}>只沿影响关系</button><button type="button" className={styles.regLabButton} aria-pressed={scope === "risk"} onClick={() => resetScope("risk")}>补历史风险</button><button type="button" className={styles.regLabButton} aria-pressed={scope === "full"} onClick={() => resetScope("full")}>跑全量对照</button></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.regLabStage}>
      <div className={styles.regLabDiff} data-active={scene.step === 0} data-done={scene.step > 0}>
        <div className={styles.regLabLabel}><GitCommit size={16} aria-hidden="true" /><span>本次提交</span></div>
        <h3>auth middleware</h3>
        <code>policy.check(role)</code>
        <div className={styles.regLabDiffLines}><span>登录 · 继续通过</span><span>后台编辑器 · 应为 403</span></div>
        <small>{scene.step === 0 ? "先看改了什么" : "差异已经成为分析起点"}</small>
      </div>
      <div className={styles.regLabGraph} data-active={scene.step === 1 || scene.step === 2} data-risk={riskIncluded}>
        <div className={styles.regLabGraphHead}><GitBranch size={16} aria-hidden="true" /><span>调用与风险地图</span><code>{riskIncluded ? "impact + risk" : "impact only"}</code></div>
        <div className={styles.regLabGraphCanvas} aria-label="认证中间件关联登录、订单、后台权限和历史缺陷">
          <span className={styles.regLabRoot}>auth</span>
          <i className={styles.regLink} data-on={scene.step >= 1} />
          <span className={styles.regGraphNode} data-on={scene.step >= 1}>login</span>
          <span className={styles.regGraphNode} data-on={scene.step >= 1}>session</span>
          <span className={styles.regGraphNode} data-on={scene.step >= 1}>order</span>
          <span className={styles.regGraphNode} data-risk={riskIncluded} data-on={riskIncluded}>403→200</span>
        </div>
        <small>{riskIncluded ? "调用关系之外，历史失败也成为证据" : "直接与共享依赖先进入候选"}</small>
      </div>
      <div className={styles.regLabDeck} data-active={selectedVisible} data-danger={failureVisible} data-incomplete={scene.step >= 4 && scope === "impact"}>
        <div className={styles.regLabLabel}><ListChecks size={16} aria-hidden="true" /><span>测试抽屉</span></div>
        <h3>{selected.title}</h3>
        <strong>{selectedVisible ? selected.count : "— / 32"}</strong>
        <code>{selectedVisible ? selected.summary : "等待合并"}</code>
        <div className={styles.regLabDeckRows}><span data-on={selectedVisible}>直接 4</span><span data-on={selectedVisible}>集成 7</span><span data-on={riskIncluded}>安全 3</span></div>
        <div className={styles.regLabOutcome}>{scene.step < 4 ? "尚未判定" : scope === "impact" ? "INCOMPLETE · 盲区" : "FAIL · 403→200"}</div>
      </div>
    </div>
    <div className={styles.regLabLanes}>{lanes.map(({ id, label, count, Icon, detail }) => <div key={id} className={styles.regLabLane} data-on={scene.step >= 1 && (id !== "security" || riskIncluded)} data-muted={id === "security" && !riskIncluded} data-danger={failureVisible && id === "security"}><Icon size={18} aria-hidden="true" /><div><strong>{label}</strong><small>{detail}</small></div><code>{scene.step >= 3 && (id !== "security" || riskIncluded) ? `${count} 入选` : "等待"}</code></div>)}</div>
    <div className={styles.regLabMetrics}><div><span>选择依据</span><strong>{scope === "full" ? "定期基准" : scope === "risk" ? "影响 + 风险" : "影响关系"}</strong></div><div><span>入选范围</span><strong>{selectedVisible ? selected.count : "尚未合并"}</strong></div><div><span>测试结论</span><strong>{scene.step < 4 ? "未判定" : scope === "impact" ? "补风险" : failureVisible ? "阻塞修复" : "通过"}</strong></div></div>
    <p className={styles.regLabNote} data-danger={failureVisible} data-incomplete={scene.step >= 4 && scope === "impact"} role="status">{scene.step < 2 ? <><GitBranch size={17} aria-hidden="true" /><span>回归范围不是凭感觉点名几个页面；先从变更走到共享依赖，再问哪些业务风险值得补测。</span></> : scene.step === 2 && scope === "impact" ? <><ShieldWarning size={17} aria-hidden="true" /><span>只看调用图会漏掉历史越权用例。换成“补历史风险”，再继续下一步。</span></> : scene.step < 4 ? <><TestTube size={17} aria-hidden="true" /><span>把重叠的候选合并后再执行。通过的不是数字，而是这组测试对变更范围有可解释的来路。</span></> : scope === "impact" ? <><WarningCircle size={17} aria-hidden="true" /><span>11 个影响测试跑完仍不能宣称安全：历史缺陷没有被重新验证。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>回归测试抓到了旧行为倒退：编辑器不该拿到 200。先修复实现，再保留这个用例防止它回来。</span></>}</p>
  </div>;
}
