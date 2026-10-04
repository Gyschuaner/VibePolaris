"use client";

import { ArrowRight, CheckCircle, Clock, FileCode, GitBranch, Key, LockSimple, ShieldCheck, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./LeastPrivilegeConcept.module.css";

const steps = [
  { label: "写下任务", title: "先问机器人要做什么", detail: "它要发布一个版本，不需要顺手拿走整间组织的钥匙。" },
  { label: "摊开权限", title: "管理员钥匙能打开太多门", detail: "读代码、写发布记录和管理组织被绑在一起，越界路径跟着变多。" },
  { label: "收窄动作", title: "留下完成任务的两把钥匙", detail: "只保留读取目标仓库和写入 release 的动作，管理员权限退出画面。" },
  { label: "锁定范围", title: "同一个动作还要限定在哪里", detail: "把资源锁到 Vibe 仓库，再给这次发布一个 30 分钟的窗口。" },
  { label: "试一次越界", title: "删除生产数据被门挡住", detail: "最小权限不是让任务失败，而是让无关动作没有机会发生。" },
  { label: "时间到期", title: "钥匙自己失效", detail: "发布任务完成，临时授权到点收回；下次任务重新申请自己的最小集合。" },
];

const grants = [
  { id: "repo-read", label: "读代码", scope: "repo / Vibe", icon: FileCode },
  { id: "release-write", label: "写 release", scope: "repo / Vibe", icon: GitBranch },
  { id: "org-admin", label: "管理组织", scope: "org / *", icon: Key },
];

function activeGrant(step: number, id: string) {
  if (step < 1) return false;
  if (id === "org-admin") return step === 1;
  return step >= 1;
}

function metric(step: number) {
  if (step === 0) return { count: "0 / 3", paths: "待拆任务", window: "—", result: "先写动作" };
  if (step === 1) return { count: "3 / 3", paths: "9 条", window: "永久", result: "太宽" };
  if (step === 2) return { count: "2 / 3", paths: "2 条", window: "永久", result: "可发布" };
  if (step === 3) return { count: "2 / 3", paths: "2 条", window: "30 分钟", result: "已收窄" };
  if (step === 4) return { count: "2 / 3", paths: "越界 0 条", window: "剩余 30 分钟", result: "已拦截" };
  return { count: "0 / 3", paths: "历史授权 0 条", window: "已过期", result: "自动收回" };
}

export function LeastPrivilegeHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const values = metric(scene.step);
  const complete = scene.step === steps.length - 1;
  const blocked = scene.step === 4;

  return <figure ref={scene.ref} className={styles.leastHero} data-step={scene.step} aria-label="最小权限怎样从任务拆出动作、资源范围和时间窗口">
    <div className={styles.leastHeroHeader}><span>给任务一把刚好够用的钥匙</span><strong>task → scope → expiry</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.leastCanvas}>
      <section className={`${styles.leastTask} ${scene.step === 0 || scene.step === 2 || scene.step === 3 ? styles.leastActive : ""}`}>
        <div className={styles.leastEyebrow}><UserCircle size={17} aria-hidden="true" /><span>主体 · deploy-bot</span></div>
        <h3>发布 Vibe v2.4</h3>
        <code>build → publish release</code>
        <div className={styles.leastTaskSteps}><span data-on={scene.step >= 1}>读取构建输入</span><span data-on={scene.step >= 2}>写入 release</span><span data-on={scene.step >= 4}>删除生产数据</span></div>
        <small>{scene.step >= 4 ? "最后一个动作与任务无关" : "先列动作，再给动作找资源"}</small>
      </section>
      <div className={styles.leastArrow} aria-hidden="true"><ArrowRight size={22} /></div>
      <section className={`${styles.leastGrant} ${scene.step === 1 || scene.step === 2 || scene.step === 3 ? styles.leastActive : ""}`}>
        <div className={styles.leastEyebrow}><Key size={17} aria-hidden="true" /><span>授权抽屉 · permissions</span></div>
        <div className={styles.leastGrantList}>{grants.map(({ id, label, scope, icon: Icon }) => <div key={id} data-granted={activeGrant(scene.step, id)} data-danger={id === "org-admin" && scene.step === 1}><Icon size={17} aria-hidden="true" /><span><strong>{label}</strong><small>{scope}</small></span><b>{activeGrant(scene.step, id) ? "allow" : "—"}</b></div>)}</div>
        <div className={styles.leastConditions}><span><GitBranch size={14} aria-hidden="true" />资源：{scene.step >= 3 ? "repo/Vibe" : "*"}</span><span><Clock size={14} aria-hidden="true" />时间：{scene.step >= 3 ? "30 min" : "永久"}</span></div>
      </section>
      <section className={`${styles.leastDecision} ${blocked ? styles.leastBlocked : ""} ${complete ? styles.leastComplete : ""}`}>
        <div className={styles.leastEyebrow}>{blocked ? <WarningCircle size={17} aria-hidden="true" /> : complete ? <CheckCircle size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}<span>门口 · policy check</span></div>
        <strong>{blocked ? "DENY" : complete ? "EXPIRED" : scene.step === 1 ? "ALLOW · too broad" : scene.step >= 2 ? "ALLOW · scoped" : "WAITING"}</strong>
        <code>{blocked ? "delete production" : complete ? "lease = 0" : scene.step >= 2 ? "write release" : "what is needed?"}</code>
        <small>{blocked ? "越界动作没有被授权" : complete ? "临时授权已收回" : scene.step === 1 ? "管理员钥匙也能打开这扇门" : "只让任务所需动作通过"}</small>
      </section>
    </div>
    <div className={styles.leastMetrics}><div><span>当前权限</span><strong>{values.count}</strong></div><div><span>可达路径</span><strong>{values.paths}</strong></div><div><span>有效窗口</span><strong>{values.window}</strong></div><div><span>任务结果</span><strong>{values.result}</strong></div></div>
    <div className={`${styles.leastStatus} ${blocked ? styles.leastDanger : complete ? styles.leastGood : ""}`} role="status"><span>{blocked ? <WarningCircle size={19} aria-hidden="true" /> : complete ? <CheckCircle size={19} aria-hidden="true" /> : <LockSimple size={19} aria-hidden="true" />}</span><strong>{current.title}</strong><span>· {current.detail}</span></div>
    <figcaption>最小权限把授权从“谁是什么角色”拉回“这次任务需要哪一个动作”。</figcaption>
  </figure>;
}
