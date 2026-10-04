"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, GitBranch, GitCommit, Globe, LockSimple, Package, ShieldCheck, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./SmokeTestConcept.module.css";

const steps = [
  { label: "部署候选", title: "先把刚部署的构建放到闸门前", detail: "commit 9f31 已部署，完整回归先保持等待。", Icon: GitCommit },
  { label: "健康检查", title: "确认服务至少能呼吸", detail: "GET /healthz = 200，进程和基础依赖有响应。", Icon: Globe },
  { label: "关键入口", title: "只走三条最值钱的路", detail: "登录、创建订单和最小支付路径依次通过。", Icon: UserCircle },
  { label: "注入故障", title: "支付 502 时马上停闸", detail: "冒烟失败不是继续跑大套件的信号，而是修复候选构建的信号。", Icon: WarningCircle },
  { label: "决定去向", title: "通过才放行完整回归", detail: "四盏灯都亮，才把 120 个后续检查从队列里解锁。", Icon: ShieldCheck },
];

type Failure = "all" | "health" | "login" | "payment";
const failAt: Record<Exclude<Failure, "all">, number> = { health: 1, login: 2, payment: 3 };

export function SmokeTestHero() {
  const scene = useScene(steps.length);
  const [failure, setFailure] = useState<Failure>("payment");
  const current = steps[scene.step];
  const failureStep = failure === "all" ? Infinity : failAt[failure];
  const halted = scene.step >= failureStep;
  const passed = scene.step === steps.length - 1 && !halted;
  const failLabel = failure === "health" ? "health=503" : failure === "login" ? "login=401" : "payment=502";
  const currentDetail = halted ? `在 ${failLabel} 停闸；完整回归保持未启动。` : current.detail;
  const setScenario = (next: Failure) => { setFailure(next); scene.seek(0); };

  const checkState = (kind: "health" | "login" | "order" | "payment") => {
    const index = kind === "health" ? 1 : kind === "payment" ? 3 : 2;
    const failed = failure !== "all" && failure === kind;
    const earlier = failure !== "all" && failureStep < index;
    return { active: scene.step === index && !earlier, danger: failed && scene.step >= index, muted: scene.step < index || earlier, done: scene.step > index && !failed && !earlier };
  };

  return <figure ref={scene.ref} className={styles.smokeHero} data-step={scene.step} aria-label="冒烟测试如何在部署后用少量关键检查决定是否继续回归">
    <div className={styles.smokeHeroHeader}><span>部署后的四盏灯，决定大套件要不要启动</span><strong>deploy → smoke gate → regression</strong></div>
    <div className={styles.smokeHeroChoices} role="group" aria-label="选择冒烟结果"><button type="button" className={styles.smokeChoice} aria-pressed={failure === "all"} onClick={() => setScenario("all")}>全部通过</button><button type="button" className={styles.smokeChoice} aria-pressed={failure === "payment"} onClick={() => setScenario("payment")}>支付 502</button><button type="button" className={styles.smokeChoice} aria-pressed={failure === "login"} onClick={() => setScenario("login")}>登录 401</button><button type="button" className={styles.smokeChoice} aria-pressed={failure === "health"} onClick={() => setScenario("health")}>健康 503</button></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.smokeHeroPipeline}>
      <div className={styles.smokeHeroNode} data-active={scene.step === 0} data-muted={scene.step > 0}>
        <div className={styles.smokeLabel}><GitCommit size={17} aria-hidden="true" /><span>候选构建</span></div>
        <h3>commit 9f31</h3>
        <code>{scene.step === 0 ? "deployed · waiting" : "deployed · under test"}</code>
        <p>先部署到待验证环境，别让完整回归替它遮住基本故障。</p>
        <div className={styles.smokeHeroMeta}><span>后续套件</span><strong>{passed ? "unlocked" : "locked"}</strong></div>
      </div>
      <div className={styles.smokeHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.smokeHeroNode} data-active={scene.step >= 1 && scene.step <= 3} data-danger={halted}>
        <div className={styles.smokeLabel}>{halted ? <WarningCircle size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}<span>冒烟闸门</span></div>
        <h3>{halted ? `在 ${failLabel} 停止` : passed ? "四项关键检查通过" : "少量高价值检查"}</h3>
        <div className={styles.smokeChecks}>
          {(["health", "login", "order", "payment"] as const).map(kind => { const state = checkState(kind); const label = kind === "health" ? "Health" : kind === "login" ? "Login" : kind === "order" ? "Order" : "Payment"; const value = kind === "health" ? (state.danger ? "503" : scene.step >= 1 && !state.muted ? "200" : "—") : kind === "login" ? (state.danger ? "401" : scene.step >= 2 && !state.muted ? "pass" : "—") : kind === "order" ? (scene.step >= 2 && !state.muted ? "201" : "—") : (state.danger ? "502" : scene.step >= 3 && !state.muted ? "pass" : "—"); return <div key={kind} className={styles.smokeCheck} data-active={state.active} data-danger={state.danger} data-muted={state.muted}><CheckCircle size={15} aria-hidden="true" /><strong>{label}</strong><code>{value}</code><small>{state.danger ? "阻塞" : state.done ? "通过" : state.muted ? "等待" : "检查中"}</small></div>; })}
        </div>
        <div className={styles.smokeHeroGate} data-danger={halted}><span>{halted ? "闸门关闭" : passed ? "闸门打开" : "等检查结果"}</span><code>{halted ? "STOP" : passed ? "PROCEED" : "WAIT"}</code></div>
      </div>
      <div className={styles.smokeHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.smokeHeroNode} data-active={scene.step === 4} data-danger={halted} data-muted={!passed && !halted}>
        <div className={styles.smokeLabel}>{halted ? <WarningCircle size={17} aria-hidden="true" /> : passed ? <CheckCircle size={17} aria-hidden="true" /> : <LockSimple size={17} aria-hidden="true" />}<span>完整回归</span></div>
        <h3>{halted ? "保持未启动" : passed ? "可以开始" : "120 tests"}</h3>
        <code>{halted ? "not started" : passed ? "queued · 120" : "locked · 120"}</code>
        <p>{halted ? "先修复候选构建，再把更大的测试预算花出去。" : passed ? "基础路径可用，继续测试才有意义。" : "冒烟还没给出放行信号。"}</p>
        <div className={styles.smokeHeroMeta}><span>决定</span><strong>{halted ? "rejected" : passed ? "accepted" : "pending"}</strong></div>
      </div>
    </div>
    <div className={styles.smokeHeroMetrics}><div><span>检查数量</span><strong>4 paths</strong></div><div><span>反馈目标</span><strong>分钟级</strong></div><div><span>结论</span><strong>{halted ? `STOP · ${failLabel}` : passed ? "PASS · release gate" : "进行中"}</strong></div></div>
    <div className={styles.smokeHeroStatus} data-danger={halted} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {currentDetail}</span></div>
    <figcaption>冒烟测试像新设备通电时先看有没有冒烟：只挑足以判断“值得继续”的关键检查，快速拦住明显坏掉的构建，再把时间留给完整测试。</figcaption>
  </figure>;
}
