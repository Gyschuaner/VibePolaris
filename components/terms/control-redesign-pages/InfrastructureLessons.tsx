"use client";

import { useState, type ReactNode } from "react";
import styles from "./ControlRedesignConcepts.module.css";

function LessonShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className={styles.toolLesson} aria-label={title}><div className={styles.lessonHeader}><small>{eyebrow}</small><strong>{title}</strong></div>{children}</section>;
}

export function ContainerLesson() {
  const [privileged, setPrivileged] = useState(false);
  const [volume, setVolume] = useState(false);
  return <LessonShell eyebrow="隔离视图要和宿主内核分开看" title="容器边界实验"><div className={styles.lessonControls}><button type="button" aria-pressed={privileged} onClick={() => setPrivileged(value => !value)}>{privileged ? "撤回额外权限" : "给容器额外权限"}</button><button type="button" aria-pressed={volume} onClick={() => setVolume(value => !value)}>{volume ? "卸载数据卷" : "挂载数据卷"}</button><button type="button" onClick={() => { setPrivileged(false); setVolume(false); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>文件视图</span><code>app / config{volume ? " / data" : ""}</code><em>{volume ? "卷中保留" : "容器临时层"}</em></div><div className={styles.labRow}><span>内核</span><code>host-kernel · shared</code><em>不是完整虚拟机</em></div><div className={styles.labRow}><span>越界读取</span><code>{privileged ? "权限扩大，需重新评估" : "未挂载路径 · denied"}</code><em>{privileged ? "风险上升" : "被隔离"}</em></div></div></LessonShell>;
}

export function ImageLesson() {
  const [written, setWritten] = useState(false);
  const [recreated, setRecreated] = useState(false);
  return <LessonShell eyebrow="模板保持不动，变化落在实例层" title="镜像层与可写层"><div className={styles.lessonControls}><button type="button" aria-pressed={written} onClick={() => { setWritten(true); setRecreated(false); }}>{written ? "B 已写入" : "让 B 写入 /tmp/note"}</button><button type="button" onClick={() => { setRecreated(true); setWritten(false); }}>删除 B，按摘要重建</button><button type="button" onClick={() => { setWritten(false); setRecreated(false); }}>重置</button></div><div className={styles.serviceGrid}><div className={styles.serviceCard}><strong>image@sha256</strong><span>92 MB · 只读</span></div><div className={styles.serviceCard} data-down={written}><strong>实例 B</strong><span>{recreated ? "B2 · +0 MB" : written ? "+2 MB 可写层" : "未修改"}</span></div><div className={styles.serviceCard}><strong>A / C</strong><span>仍引用 92 MB</span></div></div><div className={styles.labStatus}><span>摘要</span><strong>保持不变</strong><span>{recreated ? "B2 从同一模板启动" : written ? "只有 B 改变" : "等待实例动作"}</span></div></LessonShell>;
}

export function DiscoveryLesson() {
  const [online, setOnline] = useState(false);
  const [expired, setExpired] = useState(false);
  const [ttlExpired, setTtlExpired] = useState(false);
  const registry = ttlExpired ? "orders → .3 · .4" : online ? "orders → .2 · .3 · .4" : "orders → .2 · .3";
  return <LessonShell eyebrow="服务名不等于一台固定机器" title="注册表与 TTL"><div className={styles.lessonControls}><button type="button" onClick={() => setOnline(true)}>上线 C</button><button type="button" onClick={() => setExpired(true)}>B 心跳超时</button><button type="button" onClick={() => { setOnline(false); setExpired(false); setTtlExpired(false); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>注册表</span><code>{registry}</code><em>{ttlExpired ? "B 已从缓存清除" : expired ? "B 已移除" : "B 仍在 TTL"}</em></div><div className={styles.labRow}><span>调用方缓存</span><code>{ttlExpired ? "只返回 .3 · .4" : expired ? "等待 TTL 到期" : "可能仍有 .2"}</code><em>{ttlExpired ? "缓存已收敛" : expired ? "旧地址短暂可见" : "缓存未刷新"}</em></div></div><div className={styles.lessonControls}><button type="button" onClick={() => setTtlExpired(true)} disabled={!expired || ttlExpired}>TTL 到期</button></div><p className={styles.labWarning}><strong>{ttlExpired ? "旧地址已清除。" : expired ? "缓存还没自动消失。" : "先改变注册状态。"}</strong> 服务发现找到地址，健康与流量分配仍是另外的责任。</p></LessonShell>;
}

export function ObservabilityLesson() {
  const [signal, setSignal] = useState("指标");
  const detail = signal === "指标" ? "checkout p95 · 2.4s" : signal === "追踪" ? "payment span · 1.8s" : "trace-7 · index=missing";
  return <LessonShell eyebrow="把三个信号扣在同一个请求上下文上" title="慢请求取证台"><div className={styles.lessonControls}>{["指标", "追踪", "日志"].map(item => <button type="button" aria-pressed={signal === item} onClick={() => setSignal(item)} key={item}>{item}</button>)}<button type="button" onClick={() => setSignal("指标")}>重置</button></div><div className={styles.signalBraid}><div className={styles.signalStrip}><span>指标</span><code>p95 200 → 2400ms</code><strong>范围</strong></div><div className={styles.signalStrip}><span>trace</span><code>payment · 1.8s</code><strong>跨度</strong></div><div className={styles.signalStrip}><span>日志</span><code>trace-7 · index=missing</code><strong>原因</strong></div></div><div className={styles.labStatus}><span>当前证据</span><strong>{signal}</strong><span>{detail}</span></div></LessonShell>;
}

export function SastLesson() {
  const [sanitized, setSanitized] = useState(false);
  return <LessonShell eyebrow="沿数据流找 source 和 sink" title="静态污点路径"><div className={styles.lessonControls}><button type="button" aria-pressed={sanitized} onClick={() => setSanitized(value => !value)}>{sanitized ? "移除参数化查询" : "加入参数化查询"}</button><button type="button" onClick={() => setSanitized(false)}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>来源</span><code>request.query</code><em>不可信</em></div><div className={styles.labRow}><span>路径</span><code>parse → buildQuery → db.query</code><em>{sanitized ? "有净化节点" : "无净化节点"}</em></div><div className={styles.labRow}><span>报告</span><code>{sanitized ? "未发现这条注入路径" : "line 42 · potential SQL injection"}</code><em>{sanitized ? "需再做动态验证" : "高风险"}</em></div></div></LessonShell>;
}

export function SecretLesson() {
  const [history, setHistory] = useState(false);
  const [revoked, setRevoked] = useState(false);
  return <LessonShell eyebrow="删掉文本不能让已经泄露的凭据失效" title="提交历史扫描"><div className={styles.lessonControls}><button type="button" aria-pressed={history} onClick={() => setHistory(value => !value)}>{history ? "只看当前树" : "扫描当前 + 历史"}</button><button type="button" aria-pressed={revoked} onClick={() => setRevoked(value => !value)}>{revoked ? "恢复 active（演示）" : "撤销并轮换"}</button><button type="button" onClick={() => { setHistory(false); setRevoked(false); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>命中</span><code>{history ? "当前 1 · 历史 2" : "当前 1"}</code><em>不回显完整值</em></div><div className={styles.labRow}><span>状态</span><code>{revoked ? "revoked → new secret" : "active"}</code><em>{revoked ? "轮换记录" : "仍可用"}</em></div></div><p className={styles.labWarning}><strong>{revoked ? "凭据已失效，历史仍需清理。" : "扫描只告诉你命中了哪里。"}</strong> 处置顺序是撤销、轮换、清理和防止再次提交。</p></LessonShell>;
}

export function DependencyLesson() {
  const [version, setVersion] = useState("2.1.0");
  const fixed = version === "2.3.2";
  return <LessonShell eyebrow="漏洞匹配依赖实际解析版本" title="锁文件依赖树"><div className={styles.lessonControls}><label htmlFor="dependency-version">B 版本</label><select id="dependency-version" aria-label="B 版本" value={version} onChange={event => setVersion(event.target.value)}><option value="2.1.0">2.1.0</option><option value="2.3.2">2.3.2</option></select><button type="button" onClick={() => setVersion("2.1.0")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>路径</span><code>app → A → B@{version}</code><em>传递依赖</em></div><div className={styles.labRow}><span>公告</span><code>B &lt; 2.3.0</code><em>{fixed ? "不命中范围" : "命中"}</em></div><div className={styles.labRow}><span>结果</span><code>{fixed ? "已修复，进入回归" : "1 条高风险路径"}</code><em>{fixed ? "仍需验证" : "待升级"}</em></div></div></LessonShell>;
}

export function ThreatLesson() {
  const [external, setExternal] = useState(false);
  const [signed, setSigned] = useState(false);
  const risk = external ? signed ? "高风险 1" : "高风险 2" : "高风险 1";
  return <LessonShell eyebrow="设计多一个外部节点，攻击面就多一块" title="信任边界重画"><div className={styles.lessonControls}><button type="button" aria-pressed={external} onClick={() => { setExternal(value => !value); setSigned(false); }}>{external ? "移除短信供应商" : "加入短信供应商"}</button><button type="button" aria-pressed={signed} onClick={() => setSigned(value => !value)} disabled={!external}>{signed ? "取消回执签名校验" : "加入回执签名校验"}</button><button type="button" onClick={() => { setExternal(false); setSigned(false); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>跨界流</span><code>{external ? "API ↔ SMS · +2" : "API ↔ DB · 1 条"}</code><em>{external ? "需要重审" : "内部"}</em></div><div className={styles.labRow}><span>威胁</span><code>{external ? "供应商泄露 + 伪造回执" : "凭据滥用"}</code><em>{signed ? "回执风险下降" : "待缓解"}</em></div><div className={styles.labRow}><span>剩余风险</span><code>{risk}</code><em>必须指派负责人</em></div></div></LessonShell>;
}

export function ApprovalLesson() {
  const [selected, setSelected] = useState([true, true, false]);
  const [executed, setExecuted] = useState(false);
  const names = ["日志 A", "缓存 B", "报告 C"];
  return <LessonShell eyebrow="授权范围必须绑定这一次参数" title="逐项审批卡"><div className={styles.lessonControls}><button type="button" onClick={() => setExecuted(true)} disabled={executed || !selected.some(Boolean)}>提交执行</button><button type="button" onClick={() => { setSelected([true, true, false]); setExecuted(false); }}>重置</button></div><div className={styles.labGrid}>{names.map((name, index) => <label className={styles.labRow} key={name}><span>{name}</span><code>{index === 2 ? "不可恢复" : "可恢复"}</code><input aria-label={`审批 ${name}`} type="checkbox" checked={selected[index]} disabled={executed} onChange={event => setSelected(current => current.map((value, item) => item === index ? event.target.checked : value))}/></label>)}</div><div className={styles.labStatus}><span>执行器收到</span><strong>{executed ? `${selected.filter(Boolean).length} 项` : "0 项"}</strong><span>{executed ? "报告 C 保持未变" : "仍在审批暂停"}</span></div></LessonShell>;
}

export function DatasetLesson() {
  const [grouped, setGrouped] = useState(true);
  const [holdout, setHoldout] = useState("C");
  return <LessonShell eyebrow="切分方式会改变泄漏风险和覆盖范围" title="评测集分组切分"><div className={styles.lessonControls}><button type="button" aria-pressed={grouped} onClick={() => setGrouped(value => !value)}>{grouped ? "改成逐行切分" : "按工单整组切分"}</button><select aria-label="留出工单" value={holdout} onChange={event => setHoldout(event.target.value)}><option value="A">留出 A</option><option value="B">留出 B</option><option value="C">留出 C</option></select><button type="button" onClick={() => { setGrouped(true); setHoldout("C"); }}>重置</button></div><div className={styles.serviceGrid}><div className={styles.serviceCard}><strong>开发区</strong><span>{grouped ? `A、B · 留出 ${holdout}` : "A1、B1、C1"}</span></div><div className={styles.serviceCard} data-down={!grouped}><strong>留出区</strong><span>{grouped ? `${holdout} 整组 · 2 条` : "A2、B2、C2"}</span></div><div className={styles.serviceCard}><strong>检查</strong><span>{grouped ? "无同工单重叠" : "同背景泄漏"}</span></div></div><p className={styles.labWarning}><strong>{grouped ? "整组切分保护独立性。" : "逐行切分让同一工单两边出现。"}</strong> 还要检查留出区是否覆盖真正的高风险类别。</p></LessonShell>;
}
