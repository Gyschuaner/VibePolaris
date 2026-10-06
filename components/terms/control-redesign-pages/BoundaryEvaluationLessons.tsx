"use client";

import { useRef, useState, type AnimationEvent, type ReactNode } from "react";
import styles from "./ControlRedesignConcepts.module.css";

function LessonShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className={styles.toolLesson} aria-label={title}><div className={styles.lessonHeader}><small>{eyebrow}</small><strong>{title}</strong></div>{children}</section>;
}

export function BoundaryLesson() {
  type Target = "sales" | "salary";
  type Outcome = "allowed" | "denied";
  type AuditEntry = { target: Target; outcome: Outcome; scope: string };
  const [target, setTarget] = useState<Target>("sales");
  const [salaryGranted, setSalaryGranted] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [activeTarget, setActiveTarget] = useState<Target | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const runRef = useRef(0);
  const scope = salaryGranted ? "read:sales + read:salary" : "read:sales";
  const running = activeTarget !== null && outcome === null;

  const startRequest = () => {
    runRef.current += 1;
    setOutcome(null);
    setActiveTarget(target);
    setRunKey(runRef.current);
  };
  const finishRequest = (event: AnimationEvent<HTMLSpanElement>) => {
    if (!activeTarget) return;
    const decision: Outcome = activeTarget === "sales" || salaryGranted ? "allowed" : "denied";
    if (event.currentTarget.dataset.running !== "true") return;
    setOutcome(decision);
    setAudit(entries => [{ target: activeTarget, outcome: decision, scope }, ...entries].slice(0, 4));
    setActiveTarget(null);
  };
  const reset = () => {
    runRef.current += 1;
    setTarget("sales");
    setSalaryGranted(false);
    setActiveTarget(null);
    setOutcome(null);
    setAudit([]);
  };

  return <LessonShell eyebrow="提示词可以解释边界，授权层才执行边界" title="资源访问闸门">
    <div className={styles.lessonControls}>
      <button type="button" aria-pressed={target === "sales"} disabled={running} onClick={() => { setTarget("sales"); setOutcome(null); }}>读取销售表</button>
      <button type="button" aria-pressed={target === "salary"} disabled={running} onClick={() => { setTarget("salary"); setOutcome(null); }}>读取工资表</button>
      <label className={styles.boundaryPermissionToggle}><input type="checkbox" checked={salaryGranted} disabled={running} onChange={event => { setSalaryGranted(event.target.checked); setOutcome(null); }} />授予 <code>read:salary</code></label>
      <button type="button" onClick={startRequest} disabled={running}>发起读取</button>
      <button type="button" onClick={reset}>重置</button>
    </div>
    <div className={styles.boundaryLessonTrack} aria-live="polite">
      {(["sales", "salary"] as Target[]).map(lane => {
        const isActive = activeTarget === lane;
        const laneOutcome = isActive ? null : target === lane ? outcome : null;
        const allowed = lane === "sales" || salaryGranted;
        return <div className={styles.boundaryLessonLane} key={lane}>
          <span>{lane === "sales" ? "销售表" : "工资表"}</span>
          <div className={styles.boundaryLessonRail}>
            <span key={isActive ? runKey : `${lane}-${outcome ?? "idle"}`} className={styles.boundaryLessonToken} data-target={lane} data-running={isActive} data-result={allowed ? "allowed" : "denied"} onAnimationEnd={isActive ? finishRequest : undefined}>{lane === "sales" ? "sales" : "salary"}</span>
            <b className={styles.boundaryLessonGate} data-locked={!allowed}>{allowed ? "✓" : "×"}</b>
          </div>
          <span className={styles.boundaryLessonResult} data-kind={laneOutcome ?? undefined}>{laneOutcome === "allowed" ? "已读入结果" : laneOutcome === "denied" ? "拒绝，未读数据" : lane === target ? "等待发起" : "未选择"}</span>
        </div>;
      })}
    </div>
    <div className={styles.labGrid}>
      <div className={styles.labRow}><span>令牌范围</span><code>{scope}</code><em>{salaryGranted ? "重新授权" : "最小权限"}</em></div>
      <div className={styles.labRow}><span>当前请求</span><code>{target === "sales" ? "sales.csv" : "salary.csv"}</code><em>{running ? "闸门检查中" : outcome === "allowed" ? "读取完成" : outcome === "denied" ? "越界被挡" : "尚未执行"}</em></div>
    </div>
    {audit.length > 0 && <div className={styles.boundaryAudit} aria-label="最近审计记录"><span>审计记录（重置前保留）</span>{audit.map((entry, index) => <div key={`${entry.target}-${index}`}><code>{entry.target}.csv · {entry.scope}</code><strong data-kind={entry.outcome}>{entry.outcome === "allowed" ? "allow" : "deny"}</strong></div>)}</div>}
  </LessonShell>;
}
