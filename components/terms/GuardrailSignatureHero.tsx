"use client";

import { FileText, Eye, ShieldWarning } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function GuardrailSignatureHero() {
  const scene = useScene(4);
  const labels = ["收到请求", "标出敏感字段", "按政策裁决", "留下可读结果"];
  const blocked = scene.step === 3;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="安全护栏把请求放进政策检查台，遮蔽敏感字段并阻止不允许的动作" caption={blocked ? "命中政策后，系统留下拒绝理由；护栏是执行前的门槛，不是事后贴在结果上的徽章。" : scene.step === 2 ? "政策检查台看到敏感字段，先把动作停在裁决处。" : "输入、风险信号和政策开关分开摆放，方便看见护栏到底改变了什么。"}>
    <div className={styles.guardBoard} data-stage={scene.step} data-blocked={blocked}>
      <BoardHeader eyebrow="POLICY DESK / GUARDRAIL" title="把客户资料导出到公开链接" status={blocked ? "BLOCKED" : "CHECKING"} />
      <div className={styles.guardDesk}>
        <div className={styles.payloadCard}><FileText size={20} /><span>请求载荷</span><strong>customer.csv</strong><code>email · phone · order_id</code><div className={styles.redactLine} data-visible={scene.step >= 1}><i /> <i /> <i /></div></div>
        <div className={styles.scanCard} data-active={scene.step >= 1}><Eye size={22} /><span>风险扫描</span><strong>{scene.step >= 1 ? "PII detected" : "等待输入"}</strong><small>{scene.step >= 2 ? "email / phone" : "先识别再裁决"}</small></div>
        <div className={styles.policyCard} data-active={scene.step >= 2} data-blocked={blocked}><ShieldWarning size={23} /><span>政策开关</span><strong>{blocked ? "公开分享：禁止" : scene.step >= 2 ? "公开分享：待裁决" : "未检查"}</strong><small>{blocked ? "理由已记录" : "只读策略，不自动放行"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
