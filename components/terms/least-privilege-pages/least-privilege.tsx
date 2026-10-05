"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, CheckCircle, Clock, FileCode, GitBranch, Key, ShieldWarning, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./LeastPrivilegeConcept.module.css";

const labels = ["列任务", "列动作", "收窄资源", "加上时限", "试一次越界", "定下规则"];
type Lens = "task" | "role";

const stages = [
  { task: "发布 Vibe v2.4", grants: "还没列", scope: "—", expiry: "—", decision: "待拆分" },
  { task: "发布 Vibe v2.4", grants: "read + write + admin", scope: "org/*", expiry: "永久", decision: "太宽" },
  { task: "发布 Vibe v2.4", grants: "read + write", scope: "repo/Vibe", expiry: "永久", decision: "可完成" },
  { task: "发布 Vibe v2.4", grants: "read + write", scope: "repo/Vibe", expiry: "30 min", decision: "更小" },
  { task: "尝试 delete production", grants: "read + write", scope: "repo/Vibe", expiry: "30 min", decision: "DENY" },
  { task: "下一次任务重新申请", grants: "0 active grants", scope: "—", expiry: "expired", decision: "收回" },
] as const;

export function LeastPrivilegeLesson() {
  const scene = useScene(labels.length);
  const [lens, setLens] = useState<Lens>("task");
  const final = scene.step === labels.length - 1;
  const pass = final && lens === "task";
  const weak = final && lens === "role";
  const current = stages[scene.step];
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const actionMeter = scene.step >= 1 ? 100 : 0;
  const scopeMeter = scene.step >= 2 ? 100 : 0;
  const timeMeter = scene.step >= 3 ? 100 : 0;

  return <div ref={scene.ref} className={styles.leastLab} role="region" aria-label="最小权限授权工作台：切换任务视角和角色视角，查看范围、动作和时限的区别">
    <div className={styles.leastLabHeader}><span>把权限从角色名拆回任务条件</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.leastControls}><span>用哪副眼镜看授权</span><button type="button" aria-pressed={lens === "task"} onClick={() => reset(() => setLens("task"))}>任务视角</button><button type="button" aria-pressed={lens === "role"} onClick={() => reset(() => setLens("role"))}>角色视角</button></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.leastLabGrid}>
      <section className={`${styles.leastLabPanel} ${scene.step >= 0 ? styles.leastActive : ""}`}>
        <div className={styles.leastEyebrow}><FileCode size={16} aria-hidden="true" /><span>任务</span></div>
        <h3>{current.task}</h3>
        <div className={styles.leastLabMeter}><span>动作</span><i style={{ "--meter": `${actionMeter}%` } as CSSProperties} /><b>{scene.step >= 1 ? "已列" : "待列"}</b></div>
        <small>先描述要完成的动作，角色名称放到后面核对。</small>
      </section>
      <section className={`${styles.leastLabPanel} ${scene.step >= 2 ? styles.leastActive : ""}`}>
        <div className={styles.leastEyebrow}><Key size={16} aria-hidden="true" /><span>授权范围</span></div>
        <h3>{current.grants}</h3>
        <div className={styles.leastLabMeter}><span>资源</span><i style={{ "--meter": `${scopeMeter}%` } as CSSProperties} /><b>{current.scope}</b></div>
        <div className={styles.leastLabMeter}><span>时限</span><i style={{ "--meter": `${timeMeter}%` } as CSSProperties} /><b>{current.expiry}</b></div>
        <small>同一个 write 动作，写哪个仓库、能用多久，都会改变实际风险。</small>
      </section>
      <section className={`${styles.leastLabPanel} ${scene.step >= 4 ? styles.leastActive : ""} ${weak ? styles.leastDanger : pass ? styles.leastGood : ""}`}>
        <div className={styles.leastEyebrow}><ShieldWarning size={16} aria-hidden="true" /><span>检查</span></div>
        <h3>{current.decision}</h3>
        <div className={styles.leastCheckRows}><div><GitBranch size={15} aria-hidden="true" /><span>写 release</span><b>{scene.step >= 2 && scene.step < 5 ? "allow" : "—"}</b></div><div><WarningCircle size={15} aria-hidden="true" /><span>删 production</span><b>{scene.step >= 4 ? "deny" : "未测"}</b></div><div><Clock size={15} aria-hidden="true" /><span>到期</span><b>{scene.step >= 5 ? "revoke" : "未到"}</b></div></div>
        <div className={styles.leastLabVerdict}>{!final ? "等待判断" : weak ? "WEAK · 角色太宽" : "PASS · 最小集合"}</div>
        <small>{!final ? "先让测试走完一条有边界的任务路径。" : weak ? "整套角色名掩盖了资源、动作和时间范围。" : "任务能完成，越界动作被挡住，授权也会到期。"}</small>
      </section>
    </div>
    <div className={styles.leastLabRail}><div data-on={scene.step >= 0}><UserCircle size={15} aria-hidden="true" /><span>定主体</span></div><div data-on={scene.step >= 1}><FileCode size={15} aria-hidden="true" /><span>列动作</span></div><div data-on={scene.step >= 2}><GitBranch size={15} aria-hidden="true" /><span>锁资源</span></div><div data-on={scene.step >= 3}><Clock size={15} aria-hidden="true" /><span>设时限</span></div><div data-on={scene.step >= 4}><ShieldWarning size={15} aria-hidden="true" /><span>测越界</span></div><div data-on={scene.step >= 5} data-danger={weak}><CheckCircle size={15} aria-hidden="true" /><span>收授权</span></div></div>
    <p className={`${styles.leastLabNote} ${weak ? styles.leastDanger : ""}`} role="status">{!final ? <><ArrowCounterClockwise size={17} aria-hidden="true" /><span>权限的大小由资源、动作、条件和时间共同决定，角色名只是一个方便的入口。</span></> : weak ? <><WarningCircle size={17} aria-hidden="true" /><span>任务做完了不等于授权合理：角色太宽，下一次误用仍能触达生产。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>让任务通过，让无关动作拒绝，再在窗口结束时收回钥匙。</span></>}</p>
  </div>;
}
