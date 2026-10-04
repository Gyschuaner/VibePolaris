"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, GitBranch, Key, LockSimple, Pause, Play, ShieldCheck, Stack, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { rbacSources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "没有角色", subject: "阿青", roles: ["∅"], permission: "invoice.read", object: "invoice:7", decision: "403 · no role", note: "登录只说明调用者是谁；没有角色关系，读取权限集合仍为空。" },
  { label: "分配 viewer", subject: "阿青", roles: ["viewer"], permission: "invoice.read", object: "invoice:7", decision: "role match", note: "viewer 把 invoice.read 带给阿青，角色关系改变了有效权限集合。" },
  { label: "角色门通过", subject: "阿青", roles: ["viewer"], permission: "invoice.read", object: "invoice:7", decision: "继续查对象", note: "角色只回答“能不能读发票这类资源”，还没有回答“能不能读这一张”。" },
  { label: "对象不属于我", subject: "阿青", roles: ["viewer"], permission: "invoice.read", object: "owner=小林", decision: "403 · object scope", note: "角色权限匹配，发票归属不匹配；把角色检查当成最终结论会留下越权口子。" },
  { label: "加入 finance", subject: "阿青", roles: ["viewer", "finance"], permission: "invoice.approve", object: "dept=财务", decision: "200 · allowed", note: "finance 叠加审批权限；有效权限是当前角色关系带来的集合，不是代码里写死的 admin 开关。" },
  { label: "撤掉 viewer", subject: "阿青", roles: ["finance"], permission: "invoice.read", object: "invoice:7", decision: "403 · permission gone", note: "角色移除会让对应权限消失；授权关系有来源，撤销也应能追溯。" },
];

function RbacHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const failed = current.decision.startsWith("403");
  return <figure ref={scene.ref} className={styles.rbacHero} data-step={scene.step} aria-label="RBAC 从用户到角色、权限再到对象范围的授权演示">
    <div className={styles.rbacTop}><span>用户 → 角色 → 权限 → 对象条件</span><strong>{current.label}</strong></div>
    <div className={styles.rbacStage}>
      <div className={styles.rbacSubject}><UserCircle size={26} aria-hidden="true" /><span>主体</span><strong>{current.subject}</strong></div>
      <div className={styles.rbacConnector}><ArrowRight size={19} aria-hidden="true" /><small>拥有</small></div>
      <div className={styles.rbacRoles}><GitBranch size={25} aria-hidden="true" /><span>角色关系</span><div>{current.roles.map(role => <b key={role}>{role}</b>)}</div></div>
      <div className={styles.rbacConnector}><ArrowRight size={19} aria-hidden="true" /><small>带来</small></div>
      <div className={styles.rbacPermission}><Key size={25} aria-hidden="true" /><span>动作权限</span><strong>{current.permission}</strong></div>
      <div className={styles.rbacConnector}><ArrowRight size={19} aria-hidden="true" /><small>再查</small></div>
      <div className={styles.rbacDecision} data-failed={failed}><ShieldCheck size={25} aria-hidden="true" /><span>{current.object}</span><strong>{current.decision}</strong></div>
    </div>
    <div className={styles.rbacEvidence} aria-live="polite"><Stack size={20} aria-hidden="true" /><p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.rbacTimeline} role="group" aria-label="RBAC 授权步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.rbacControls} role="group" aria-label="控制 RBAC 演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type RbacMode = "viewer" | "finance" | "object" | "revoked";

function RbacLab() {
  const [mode, setMode] = useState<RbacMode>("viewer");
  const cases = {
    viewer: { label: "viewer + 自己的发票", subject: "阿青", role: "viewer", action: "invoice.read", object: "owner=阿青", result: "200 · allow", note: "角色给出读取权限，对象归属也通过。" },
    finance: { label: "finance + 部门审批", subject: "阿青", role: "viewer + finance", action: "invoice.approve", object: "dept=财务", result: "200 · allow", note: "finance 增加审批权限，授权来源仍能从角色关系追溯。" },
    object: { label: "viewer + 别人的发票", subject: "阿青", role: "viewer", action: "invoice.read", object: "owner=小林", result: "403 · object scope", note: "角色检查通过不等于对象检查通过；同一权限不能自动覆盖所有记录。" },
    revoked: { label: "viewer 已撤销", subject: "阿青", role: "finance", action: "invoice.read", object: "invoice:7", result: "403 · no permission", note: "移除 viewer 后，finance 没有读取权限，旧的允许结果不能继续沿用。" },
  } satisfies Record<RbacMode, { label: string; subject: string; role: string; action: string; object: string; result: string; note: string }>;
  const current = cases[mode];
  const failed = current.result.startsWith("403");
  return <div className={styles.rbacLab} role="region" aria-label="RBAC 角色、权限和对象范围演示">
    <div className={styles.rbacLabHead}><div><span>只改变角色关系或对象条件</span><strong>哪一道检查让请求通过</strong></div><span>{current.label}</span></div>
    <div className={styles.rbacLabBoard}>
      <div className={styles.rbacLabNode}><UserCircle size={21} aria-hidden="true" /><span>主体</span><strong>{current.subject}</strong></div>
      <div className={styles.rbacLabArrow}><ArrowRight size={18} aria-hidden="true" /><small>角色</small></div>
      <div className={styles.rbacLabNode}><GitBranch size={21} aria-hidden="true" /><span>有效角色</span><code>{current.role}</code></div>
      <div className={styles.rbacLabArrow}><ArrowRight size={18} aria-hidden="true" /><small>权限</small></div>
      <div className={styles.rbacLabNode}><Key size={21} aria-hidden="true" /><span>请求</span><code>{current.action}</code></div>
      <div className={styles.rbacLabArrow}><ArrowRight size={18} aria-hidden="true" /><small>对象</small></div>
      <div className={styles.rbacLabNode} data-failed={failed}><LockSimple size={21} aria-hidden="true" /><span>{current.object}</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.rbacLabResult} data-failed={failed}><p><strong>检查结果</strong>{current.note}</p></div>
    <div className={styles.rbacLabControls} role="group" aria-label="选择 RBAC 案例">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as RbacMode)}>{item.label}</button>)}</div>
  </div>;
}

export function RbacRoleTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={rbacSources} />;
  return <ConceptArticle slug="rbac" title="基于角色的访问控制" subtitle="RBAC · 让权限跟着角色走，再把对象边界补回来" sources={rbacSources} sections={[["rbac-model-section", "权限为什么先放进角色"], ["rbac-decision-section", "角色通过以后还要查什么"], ["rbac-boundary-section", "哪些条件不该硬塞进角色"], ["rbac-revoke-section", "角色变化怎样影响结果"]]} hero={<RbacHero />} intro={<>RBAC 把“谁能做什么”拆成两段关系：权限先归到角色，用户再获得角色。请求到来时，系统算出当前角色带来的权限，再检查资源本身的范围；这样一条允许或拒绝，才有可追溯的来路。</>}>
    <ArticleSection id="rbac-model-section" title="权限为什么先放进角色">
      <p id="rbac-model" className="vp-citation-target">RBAC 的基本关系是用户、角色和权限：权限描述动作，角色把一组动作收成一份职责，用户通过角色获得这些权限。相同岗位的授权可以复用，人员调整时也只需改变角色关系。<Cite id="rbac-model" /></p>
      <p id="rbac-role" className="vp-citation-target">例如 viewer 可以 invoice.read，finance 可以 invoice.approve；阿青同时持有两个角色时，有效权限是两组关系带来的结果。角色层级还能表达继承，但每一项权限都应能追溯到具体角色关系。<Cite id="rbac-role" /></p>
      <RbacLab />
    </ArticleSection>
    <ArticleSection id="rbac-decision-section" title="角色通过以后还要查什么">
      <p id="rbac-hierarchy" className="vp-citation-target">角色层级适合表达稳定的继承关系：上层角色可以得到下层角色包含的权限。层级越深，越需要能查清楚权限从哪一层继承而来，否则一次 403 或越权很难排查。<Cite id="rbac-hierarchy" /></p>
      <p id="rbac-scope" className="vp-citation-target">角色权限还要落到资源范围。云平台常把访问范围分成订阅、资源组或单个资源；同一个动作放在不同范围，能触及的对象并不一样。<Cite id="rbac-scope" /></p>
      <p id="rbac-object" className="vp-citation-target">“阿青能读取自己的发票”比“阿青有 invoice.read”多了一层对象判断。服务端应在敏感操作执行前检查主体、动作、对象和租户范围，不能把隐藏按钮或不可猜的 ID 当成授权。<Cite id="rbac-object" /></p>
    </ArticleSection>
    <ArticleSection id="rbac-boundary-section" title="哪些条件不该硬塞进角色">
      <p id="rbac-boundary" className="vp-citation-target">如果规则依赖部门、时间、设备风险或资源属性，角色本身通常表达不完整。可以把角色当作一层基础授权，再用属性策略补充上下文；这类条件正是 ABAC 等模型要处理的部分。<Cite id="rbac-boundary" /></p>
      <p id="rbac-attributes" className="vp-citation-target">例如“工作日白天且设备合规才能导出”同时看主体属性、环境和动作。把它硬编码成几十个临时角色，会让角色数量膨胀，撤销和审计都变得困难。<Cite id="rbac-attributes" /></p>
    </ArticleSection>
    <ArticleSection id="rbac-revoke-section" title="角色变化怎样影响结果">
      <p id="rbac-deny" className="vp-citation-target">默认拒绝是稳妥的起点：没有匹配角色、动作不在角色权限里，或对象范围不符，都应在服务端拒绝，并留下主体、动作、对象和策略结果等审计信息。<Cite id="rbac-deny" /></p>
      <p id="rbac-least" className="vp-citation-target">角色应只带完成工作所需的权限。把所有人放进一个超级角色，短期看起来省配置，长期会让一次账号泄露触及更多资源，也让撤销变得粗糙。<Cite id="rbac-least" /></p>
      <p>排查权限问题时，顺着用户 → 角色 → 权限 → 对象范围逐层检查。先确认角色关系有没有变，再看权限是否覆盖动作，最后看资源是否落在这项授权的范围内。</p>
    </ArticleSection>
  </ConceptArticle>;
}

