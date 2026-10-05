"use client";

import { useState } from "react";
import { CheckCircle, GitCommit, Globe, LockSimple, Package, ShieldCheck, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./SmokeTestConcept.module.css";

const labels = ["部署候选", "检查健康", "走关键路", "决定放行"];
type Incident = "none" | "health" | "login" | "payment";
const incidentStep: Record<Exclude<Incident, "none">, number> = { health: 1, login: 2, payment: 2 };

export function SmokeTestLesson() {
  const scene = useScene(labels.length);
  const [incident, setIncident] = useState<Incident>("payment");
  const failStep = incident === "none" ? Infinity : incidentStep[incident];
  const blocked = scene.step >= failStep;
  const final = scene.step === labels.length - 1;
  const passed = final && !blocked;
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const incidentLabel = incident === "health" ? "health=503" : incident === "login" ? "login=401" : "payment=502";
  const checks = [
    { key: "health", label: "Health", icon: Globe, value: incident === "health" && scene.step >= 1 ? "503" : scene.step >= 1 ? "200" : "—", fail: incident === "health" && scene.step >= 1 },
    { key: "login", label: "Login", icon: UserCircle, value: incident === "login" && scene.step >= 2 ? "401" : scene.step >= 2 ? "pass" : "—", fail: incident === "login" && scene.step >= 2 },
    { key: "order", label: "Create order", icon: Package, value: scene.step >= 2 && incident !== "health" && incident !== "login" ? "201" : "—", fail: false },
    { key: "payment", label: "Payment", icon: ShieldCheck, value: incident === "payment" && scene.step >= 2 ? "502" : scene.step >= 2 && !blocked ? "pass" : "—", fail: incident === "payment" && scene.step >= 2 },
  ];

  return <div ref={scene.ref} className={styles.smokeLab} role="region" aria-label="冒烟测试选择关键检查并决定是否继续回归的工作台">
    <div className={styles.smokeLabHeader}><span>把一个部署故障放进闸门，看为什么要尽早停止</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.smokeLabControls} role="group" aria-label="选择冒烟测试结果"><button type="button" className={styles.smokeLabButton} aria-pressed={incident === "none"} onClick={() => reset(() => setIncident("none"))}>全部通过</button><button type="button" className={styles.smokeLabButton} aria-pressed={incident === "health"} onClick={() => reset(() => setIncident("health"))}>健康 503</button><button type="button" className={styles.smokeLabButton} aria-pressed={incident === "login"} onClick={() => reset(() => setIncident("login"))}>登录 401</button><button type="button" className={styles.smokeLabButton} aria-pressed={incident === "payment"} onClick={() => reset(() => setIncident("payment"))}>支付 502</button></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.smokeLabGrid}>
      <div className={styles.smokeLabPanel} data-active={scene.step === 0}>
        <div className={styles.smokeLabel}><GitCommit size={16} aria-hidden="true" /><span>候选构建</span></div>
        <h3>9f31 · staging</h3>
        <div className={styles.smokeLabList}><div className={styles.smokeLabRow}><GitCommit size={15} aria-hidden="true" /><strong>已部署</strong><code>ready</code></div><div className={styles.smokeLabRow}><LockSimple size={15} aria-hidden="true" /><strong>完整回归</strong><code>{passed ? "queued" : "locked"}</code></div></div>
        <small>冒烟的第一问是“这个环境值得继续测吗”，不是“所有功能都证明了吗”。</small>
      </div>
      <div className={styles.smokeLabPanel} data-active={scene.step === 1 || scene.step === 2} data-danger={blocked}>
        <div className={styles.smokeLabel}>{blocked ? <WarningCircle size={16} aria-hidden="true" /> : <ShieldCheck size={16} aria-hidden="true" />}<span>关键检查</span></div>
        <h3>{blocked ? `首个失败：${incidentLabel}` : scene.step < 1 ? "等待启动" : "一盏一盏点亮"}</h3>
        <div className={styles.smokeLabList}>{checks.map(check => <div key={check.key} className={styles.smokeLabRow} data-danger={check.fail}><check.icon size={15} aria-hidden="true" /><strong>{check.label}</strong><code>{check.value}</code></div>)}</div>
        <small>{blocked ? "失败已经回答了是否继续的问题；后续大套件不应掩盖这个阻塞。" : "选最能代表进程、身份和核心业务的少量路径。"}</small>
      </div>
      <div className={styles.smokeLabPanel} data-active={final} data-danger={final && !passed} data-green={passed}>
        <div className={styles.smokeLabel}>{passed ? <CheckCircle size={16} aria-hidden="true" /> : final ? <WarningCircle size={16} aria-hidden="true" /> : <LockSimple size={16} aria-hidden="true" />}<span>放行决定</span></div>
        <h3>{!final ? "等闸门结论" : passed ? "可以继续" : "停止并修复"}</h3>
        <div className={styles.smokeLabGate} data-danger={final && !passed}><strong>{!final ? "pending" : passed ? "PROCEED" : "STOP"}</strong><code>{!final ? "regression locked" : passed ? "120 tests queued" : "regression not started"}</code><span>{!final ? "还没有足够证据" : passed ? "基础路径通过，完整回归现在才有价值。" : `先修复 ${incidentLabel}，再重新部署。`}</span></div>
        <small>冒烟是发布闸门的一小段事实，不是全套质量报告。</small>
      </div>
    </div>
    <div className={styles.smokeLabMetrics}><div><span>当前检查</span><strong>{scene.step < 2 ? "1 / 4" : blocked ? "stopped" : scene.step === 2 ? "4 / 4" : "ready"}</strong></div><div><span>后续套件</span><strong>{passed ? "120 queued" : "not started"}</strong></div><div><span>测试结论</span><strong>{!final ? "未完成" : passed ? "可继续" : "需修复"}</strong></div></div>
    <p className={styles.smokeLabNote} data-danger={final && !passed} role="status">{!final ? <><ShieldCheck size={17} aria-hidden="true" /><span>冒烟测试用最小成本回答“环境是否值得继续测”。灯还没点完，不能把绿色片段拼成放行结论。</span></> : passed ? <><CheckCircle size={17} aria-hidden="true" /><span>所有关键入口都通过，完整回归才从 locked 变成 queued；这就是 fail fast 为测试预算争取的时间。</span></> : <><WarningCircle size={17} aria-hidden="true" /><span>{incidentLabel} 已经是可行动的阻塞点。继续跑 120 个用例不会让这个候选构建变得更健康。</span></>}</p>
  </div>;
}
