"use client";

import { FileText, Eye, ShieldWarning } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function GuardrailSignatureHero() {
  const scene = useScene(5);
  const labels = ["数据待导出", "规则命中", "选择处置", "脱敏放行", "命中即阻断"];
  const masked = scene.step === 3;
  const blocked = scene.step === 4;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="安全护栏把请求放进政策检查台，展示脱敏放行与命中阻断两种处置" caption={blocked ? "命中政策后，系统留下拒绝理由并关闭出口；护栏是执行前的门槛。" : masked ? "同一个命中结果也可以走脱敏放行，输出条数不变但完整号码不会离开边界。" : scene.step === 2 ? "扫描器只负责发现命中，真正的处置由政策开关选择。" : "输入、风险信号和政策开关分开摆放，方便看见护栏到底改变了什么。"}>
    <div className={styles.guardBoard} data-stage={scene.step} data-blocked={blocked} data-masked={masked}>
      <BoardHeader eyebrow="POLICY DESK / GUARDRAIL" title="把客户资料导出到公开链接" status={blocked ? "BLOCKED" : masked ? "MASKED" : scene.step === 2 ? "DECIDE" : "CHECKING"} />
      <div className={styles.guardDesk}>
        <div className={styles.payloadCard}><FileText size={20} /><span>请求载荷</span><strong>customer.csv</strong><code>{masked ? "email · phone **** · order_id" : "email · phone · order_id"}</code><div className={styles.redactLine} data-visible={scene.step >= 1}><i /> <i /> <i /></div></div>
        <div className={styles.scanCard} data-active={scene.step >= 1}><Eye size={22} /><span>风险扫描</span><strong>{scene.step >= 1 ? "PII detected" : "等待输入"}</strong><small>{scene.step >= 2 ? "email / phone" : "先识别再裁决"}</small></div>
        <div className={styles.policyCard} data-active={scene.step >= 2} data-blocked={blocked} data-masked={masked}><ShieldWarning size={23} /><span>政策开关</span><strong>{blocked ? "公开分享：禁止" : masked ? "脱敏后放行" : scene.step >= 2 ? "选择处置" : "未检查"}</strong><small>{blocked ? "12 条未交付 · 理由已记录" : masked ? "12 条 · 完整号码 0" : scene.step >= 2 ? "脱敏 / 阻断" : "先扫描字段"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
