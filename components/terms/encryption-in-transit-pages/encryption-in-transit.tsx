"use client";

import { CheckCircle, Eye, LockKey, Network, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./EncryptionInTransitConcept.module.css";

type Scenario = "all-secure" | "plain-internal" | "identity-fail";

const scenarios: { id: Scenario; label: string }[] = [
  { id: "all-secure", label: "每一跳都用 TLS" },
  { id: "plain-internal", label: "内部链路改 HTTP" },
  { id: "identity-fail", label: "内部证书不匹配" },
];

const stages = ["标出跳点", "验证身份", "保护记录", "观察抓包", "做出判断"];
const names = ["浏览器 → CDN", "CDN → LB", "LB → 应用"];

function stateFor(scenario: Scenario, step: number, index: number) {
  if (step === 0) return "route";
  if (scenario === "plain-internal" && index === 1 && step >= 2) return "clear";
  if (scenario === "identity-fail" && index === 1 && step >= 1) return "blocked";
  if (scenario === "identity-fail" && index > 1 && step >= 1) return "pending";
  return step >= 2 ? "secure" : index === 0 ? "handshake" : "pending";
}

export function EncryptionInTransitLesson() {
  const [scenario, setScenario] = useState<Scenario>("all-secure");
  const scene = useScene(stages.length);
  const final = scene.step === stages.length - 1;
  const internalClear = scenario === "plain-internal" && scene.step >= 2;
  const identityFail = scenario === "identity-fail" && scene.step >= 1;
  const passed = final && scenario === "all-secure";
  const secureCount = names.filter((_, index) => stateFor(scenario, scene.step, index) === "secure").length;
  const result = !final ? "等待判断" : passed ? "PASS · 3 / 3 TLS" : internalClear ? "RISK · Authorization 可见" : "BLOCK · SAN mismatch";

  return <div ref={scene.ref} className={styles.eitLesson} role="region" aria-label="传输中加密逐段审查工作台：切换全程 TLS、内部明文或证书不匹配">
    <div className={styles.eitLessonHeader}><span>逐段审查：这把锁在哪一跳结束？</span><strong>{scene.step + 1} / {stages.length}</strong></div>
    <div className={styles.eitScenarioControls}><span>选择配置</span>{scenarios.map((item) => <button key={item.id} type="button" aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); scene.seek(0); }}>{item.label}</button>)}</div>
    <SceneControls scene={scene} labels={stages} />
    <div className={styles.eitLessonBoard}>
      <section className={styles.eitAuditPath}>
        {names.map((name, index) => { const state = stateFor(scenario, scene.step, index); const rowDanger = state === "clear" || state === "blocked"; return <div className={styles.eitAuditRow} data-active={scene.step >= 1 && (index === scene.step - 1 || rowDanger)} data-danger={rowDanger} key={name}><span>{name}</span><strong>{state === "secure" ? "TLS 1.3 · record" : state === "clear" ? "HTTP · clear" : state === "blocked" ? "TLS · stopped" : state === "handshake" ? "ClientHello" : state === "route" ? "待检查" : "等待"}</strong><code>{state === "secure" ? "ciphertext" : state === "clear" ? "Authorization: Bearer …" : state === "blocked" ? "SAN ≠ lb.internal" : "—"}</code>{rowDanger ? <WarningCircle size={17} aria-hidden="true" /> : state === "secure" ? <CheckCircle size={17} aria-hidden="true" /> : <Network size={17} aria-hidden="true" />}</div>; })}
        <div className={styles.eitPathNote}>{identityFail ? <WarningCircle size={16} aria-hidden="true" /> : <LockKey size={16} aria-hidden="true" />}<span>{scene.step === 0 ? "先把每个代理后的下一跳单独列出来。" : identityFail ? "证书链可能可信，SAN 不属于 lb.internal 仍不能继续发送订单。" : internalClear ? "TLS 在 CDN 结束后没有重新建立，内部抓包能看到敏感字段。" : "每个跳点都建立并验证自己的 TLS，抓包者只拿到记录层密文。"}</span></div>
      </section>
      <section className={styles.eitVerdict} data-danger={final && !passed} data-good={passed}>
        <div className={styles.eitVerdictEyebrow}>{final && !passed ? <WarningCircle size={17} aria-hidden="true" /> : passed ? <CheckCircle size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}<span>观察结果</span></div>
        <h3>{result}</h3>
        <code className={styles.eitVerdictCode}>{scene.step < 2 ? "尚未发送应用记录" : identityFail ? "GET /orders · 0 B" : internalClear ? "Authorization: Bearer …" : "GET /orders · ciphertext"}</code>
        <dl><dt>安全跳点</dt><dd>{secureCount} / 3</dd><dt>端点看到</dt><dd>{scene.step < 2 ? "—" : identityFail ? "none" : "HTTP"}</dd><dt>下一步</dt><dd>{final ? passed ? "可交付" : "修复配置" : "继续推进"}</dd></dl>
        <small>{final ? passed ? "TLS 保护内容、完整性和服务器身份；每段链路都留下了可复核证据。" : internalClear ? "外部地址栏有锁不能替内部链路背书，先补下一跳 TLS。" : "握手必须在身份匹配后才让应用数据上路。" : "结果要等到相应的握手或抓包动作发生，不能提前显示为成功。"}</small>
      </section>
    </div>
    <div className={styles.eitLessonRail}>{stages.map((label, index) => <div key={label} data-on={scene.step >= index} data-danger={final && index === stages.length - 1 && !passed}><span>{index + 1}</span>{label}</div>)}</div>
    <p className={styles.eitLessonNote} data-danger={final && !passed} role="status">{final && !passed ? <><WarningCircle size={17} aria-hidden="true" /><span>找到故障所在的跳点后再修：明文链路要改回 TLS，证书身份不匹配要先停下。</span></> : final ? <><CheckCircle size={17} aria-hidden="true" /><span>传输加密的完成条件不是“浏览器有锁”，而是每段链路都有正确的端点、证书和记录保护。</span></> : <><ShieldCheck size={17} aria-hidden="true" /><span>把握手、身份、记录和终止点分开看，才知道这一跳到底保护了什么。</span></>}</p>
  </div>;
}
