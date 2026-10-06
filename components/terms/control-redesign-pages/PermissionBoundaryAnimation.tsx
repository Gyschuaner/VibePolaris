"use client";

import { useRef, useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./PermissionBoundaryAnimation.module.css";

type Resource = "sales" | "salary";
type Request = { id: number; resource: Resource; allowed: boolean; scope: string; finished: boolean };

function Key({ className, onArrival }: { className: string; onArrival?: () => void }) {
  return <span className={className} onAnimationEnd={onArrival} aria-hidden="true"><svg viewBox="0 0 40 24"><circle cx="10" cy="12" r="7" /><path d="M17 12h19m-7 0v6m5-6v4" /></svg></span>;
}

function Drawer({ resource, open, animated = false }: { resource: Resource; open: boolean; animated?: boolean }) {
  return <div className={styles.drawer} data-resource={resource} data-open={open} data-animated={animated}>
    <span className={styles.drawerLabel}>{resource === "sales" ? "销售表" : "工资表"}</span>
    <div className={styles.drawerInside}><i /><i /><i /></div>
    <div className={styles.drawerFront}><span className={styles.drawerHandle} /><svg className={styles.lock} viewBox="0 0 20 22" aria-hidden="true"><path d="M5 9V6a5 5 0 0 1 10 0v3" /><rect x="2" y="9" width="16" height="11" rx="3" /></svg></div>
    <b className={styles.drawerVerdict}>{open ? "已读入" : "未读取"}</b>
  </div>;
}

export function BoundaryHero() {
  return <ControlRedesignRuntime kind="boundary" label="同一个只可读取销售表的令牌：钥匙穿过权限边界打开销售抽屉，工资钥匙在锁前退回，工资表未被读取">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.scope}><span>令牌范围</span><code>read:sales</code></div>
      <div className={styles.caller}>报表助手<svg viewBox="0 0 42 42"><rect x="8" y="12" width="26" height="23" rx="7" /><path d="M21 5v7M15 24h1m10 0h1m-12 6h12" /><circle cx="21" cy="5" r="2" /></svg></div>
      <div className={styles.boundaryWall}><span>权限边界</span></div>
      <Key className={styles.salesKey} /><Key className={styles.salaryKey} />
      <Drawer resource="sales" open animated /><Drawer resource="salary" open={false} />
      <span className={styles.deniedMark}>×</span>
    </div>
  </ControlRedesignRuntime>;
}

export function BoundaryLesson() {
  const [resource, setResource] = useState<Resource>("sales");
  const [salaryGranted, setSalaryGranted] = useState(false);
  const [request, setRequest] = useState<Request | null>(null);
  const [history, setHistory] = useState<Request[]>([]);
  const sequence = useRef(0);
  const running = request !== null && !request.finished;
  const scope = salaryGranted ? "read:sales + read:salary" : "read:sales";

  function read() {
    setRequest({ id: ++sequence.current, resource, allowed: resource === "sales" || salaryGranted, scope, finished: false });
  }
  function finish(id: number) {
    if (!request || request.id !== id || request.finished) return;
    const finished = { ...request, finished: true };
    setRequest(finished);
    setHistory(entries => [...entries, finished]);
  }
  function changeResource(next: Resource) { setResource(next); setRequest(null); }
  function reset() {
    sequence.current += 1;
    setResource("sales"); setSalaryGranted(false); setRequest(null); setHistory([]);
  }

  return <section className={styles.lesson} aria-label="资源访问闸门">
    <div className={styles.lessonHeader}><strong>试着打开一只数据抽屉</strong><code>{scope}</code></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={resource === "sales"} disabled={running} onClick={() => changeResource("sales")}>销售表</button>
      <button type="button" aria-pressed={resource === "salary"} disabled={running} onClick={() => changeResource("salary")}>工资表</button>
      <label><input type="checkbox" checked={salaryGranted} disabled={running} onChange={event => { setSalaryGranted(event.target.checked); setRequest(null); }} />授予 <code>read:salary</code></label>
      <button type="button" className={styles.readButton} disabled={running} onClick={read}>发起读取</button>
      <button type="button" onClick={reset}>重置</button>
    </div>
    <div className={styles.lessonScene} data-resource={resource} data-allowed={request?.allowed} data-finished={request?.finished}>
      <div className={styles.caller}>报表助手<svg viewBox="0 0 42 42" aria-hidden="true"><rect x="8" y="12" width="26" height="23" rx="7" /><path d="M21 5v7M15 24h1m10 0h1m-12 6h12" /><circle cx="21" cy="5" r="2" /></svg></div>
      <div className={styles.boundaryWall}><span>权限检查</span></div>
      {request && <Key key={request.id} className={request.allowed ? styles.allowedKey : styles.blockedKey} onArrival={() => finish(request.id)} />}
      <Drawer resource={resource} open={Boolean(request?.finished && request.allowed)} />
      {request?.finished && !request.allowed && <span className={styles.deniedMark}>×</span>}
    </div>
    <div className={styles.result} role="status" data-denied={request?.finished && !request.allowed}>
      {running ? "正在检查这次请求的权限……" : request?.finished ? request.allowed ? `${resource === "sales" ? "销售" : "工资"}表已读入。此次读取记为 allow。` : "缺少 read:salary：请求被挡住，工资表未读取。" : "先选资源，再发起读取。"}
    </div>
    {history.length > 0 && <ol className={styles.audit} aria-label="审计记录">{history.map(entry => <li key={entry.id}><span>#{entry.id} · {entry.resource === "sales" ? "销售表" : "工资表"}</span><code>{entry.scope}</code><strong data-denied={!entry.allowed}>{entry.allowed ? "allow" : "deny"}</strong></li>)}</ol>}
  </section>;
}
