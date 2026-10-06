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

export function CostEvaluationLesson() {
  const [variant, setVariant] = useState<"a" | "b" | "cache">("a");
  const values = { a: ["17 / 20", "¥0.42", "预算内"], b: ["18 / 20", "¥1.16", "超预算"], cache: ["18 / 20", "¥0.82", "条件不同"] } as const;
  return <LessonShell eyebrow="单价要放回一次完整任务的质量和消耗" title="成本与质量同屏"><div className={styles.lessonControls}><button type="button" aria-pressed={variant === "a"} onClick={() => setVariant("a")}>方案 A</button><button type="button" aria-pressed={variant === "b"} onClick={() => setVariant("b")}>方案 B · 冷缓存</button><button type="button" aria-pressed={variant === "cache"} onClick={() => setVariant("cache")}>方案 B · 命中缓存</button><button type="button" onClick={() => setVariant("a")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>质量</span><code>{values[variant][0]}</code><em>20 条固定题</em></div><div className={styles.labRow}><span>成本</span><code>{values[variant][1]}</code><em>{variant === "b" ? "含重试" : variant === "cache" ? "缓存命中" : "一次工具调用"}</em></div><div className={styles.labRow}><span>结论</span><code>{values[variant][2]}</code><em>{variant === "cache" ? "先统一条件" : "预算 ¥1.00"}</em></div></div></LessonShell>;
}

export function LatencyEvaluationLesson() {
  const [state, setState] = useState<"normal" | "tail" | "timeout">("normal");
  const values = { normal: ["420ms", "1.8s", "3.4s", "p95 3.8s"], tail: ["420ms", "1.8s", "3.4s", "p95 4.8s"], timeout: ["420ms", "5.0s 超时", "未完成", "不纳入完成分布"] } as const;
  return <LessonShell eyebrow="用户先看到首字，系统后来才完成任务" title="等待时间拆解"><div className={styles.lessonControls}><button type="button" aria-pressed={state === "normal"} onClick={() => setState("normal")}>正常完成</button><button type="button" aria-pressed={state === "tail"} onClick={() => setState("tail")}>放大长尾</button><button type="button" aria-pressed={state === "timeout"} onClick={() => setState("timeout")}>工具超时</button><button type="button" onClick={() => setState("normal")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>首字</span><code>{values[state][0]}</code><em>开始反馈</em></div><div className={styles.labRow}><span>工具</span><code>{values[state][1]}</code><em>{state === "timeout" ? "等待失败" : "返回"}</em></div><div className={styles.labRow}><span>完成</span><code>{values[state][2]}</code><em>{values[state][3]}</em></div></div></LessonShell>;
}

export function PassFailLesson() {
  const [result, setResult] = useState<"pass" | "fail" | "unscored">("pass");
  const values = { pass: ["answer.json + amount=120", "pass", "允许进入门槛"], fail: ["answer.json + amount=90", "fail", "进入修复"], unscored: ["环境不可读", "unscored", "暂停并重跑"] } as const;
  return <LessonShell eyebrow="先写成功证据，再把缺证据和失败分开" title="三态判定器"><div className={styles.lessonControls}><button type="button" aria-pressed={result === "pass"} onClick={() => setResult("pass")}>证据正确</button><button type="button" aria-pressed={result === "fail"} onClick={() => setResult("fail")}>字段错误</button><button type="button" aria-pressed={result === "unscored"} onClick={() => setResult("unscored")}>环境不可读</button><button type="button" onClick={() => setResult("pass")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>检查</span><code>{values[result][0]}</code><em>可观察证据</em></div><div className={styles.labRow}><span>结果</span><code>{values[result][1]}</code><em>{result === "unscored" ? "暂时无结论" : "判据有结论"}</em></div><div className={styles.labRow}><span>门槛</span><code>{values[result][2]}</code><em>动作已写明</em></div></div></LessonShell>;
}

export function RubricLesson() {
  const [sample, setSample] = useState<"complete" | "missing" | "overclaim">("complete");
  const values = { complete: ["事实 ✓ · 条件 ✓ · 风险 ✓", "3 / 3", "可复核"], missing: ["事实 ✓ · 条件 ✕ · 风险 ✓", "2 / 3", "回到缺失条件"], overclaim: ["事实 ? · 条件 ✕ · 风险 ✕", "0 / 3", "没有支持证据"] } as const;
  return <LessonShell eyebrow="量表把一句印象拆成逐项证据" title="评分规则试算"><div className={styles.lessonControls}><button type="button" aria-pressed={sample === "complete"} onClick={() => setSample("complete")}>保留条件</button><button type="button" aria-pressed={sample === "missing"} onClick={() => setSample("missing")}>漏掉条件</button><button type="button" aria-pressed={sample === "overclaim"} onClick={() => setSample("overclaim")}>越界承诺</button><button type="button" onClick={() => setSample("complete")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>回答</span><code>{sample === "complete" ? "审核后，三个工作日到账" : sample === "missing" ? "三个工作日到账" : "马上到账且一定免费"}</code><em>同一题</em></div><div className={styles.labRow}><span>逐项</span><code>{values[sample][0]}</code><em>维度不合并</em></div><div className={styles.labRow}><span>总分</span><code>{values[sample][1]}</code><em>{values[sample][2]}</em></div></div></LessonShell>;
}

export function HumanGraderLesson() {
  const [caseType, setCaseType] = useState<"agree" | "split" | "missing">("agree");
  const values = { agree: ["甲 4/5 · 乙 4/5", "一致", "保留共同理由"], split: ["甲 4/5 · 乙 2/5", "第三人 3/5", "写回校准样例"], missing: ["甲 unscored · 乙 unscored", "等待证据", "不塞进通过率"] } as const;
  return <LessonShell eyebrow="人工的价值不是永远一致，而是把分歧留下来" title="双人评审校准"><div className={styles.lessonControls}><button type="button" aria-pressed={caseType === "agree"} onClick={() => setCaseType("agree")}>评分一致</button><button type="button" aria-pressed={caseType === "split"} onClick={() => setCaseType("split")}>出现分歧</button><button type="button" aria-pressed={caseType === "missing"} onClick={() => setCaseType("missing")}>证据不足</button><button type="button" onClick={() => setCaseType("agree")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>独立分数</span><code>{values[caseType][0]}</code><em>先遮住彼此结果</em></div><div className={styles.labRow}><span>校准</span><code>{values[caseType][1]}</code><em>{caseType === "split" ? "回到规则" : "记录状态"}</em></div><div className={styles.labRow}><span>留下</span><code>{values[caseType][2]}</code><em>可供下轮复查</em></div></div></LessonShell>;
}
