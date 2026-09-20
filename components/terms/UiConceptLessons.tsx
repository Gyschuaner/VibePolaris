"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowUpLeft, Check, Code, FileText, HourglassMedium, PaperPlaneTilt, UserCircle, UserPlus, WarningCircle } from "@phosphor-icons/react";
import { Reveal, States } from "./ExtendedConceptLessons";
import styles from "./UiConcepts.module.css";

const members = [{ name: "阿青", role: "前端开发" }, { name: "林墨", role: "产品设计" }, { name: "陈屿", role: "后端开发" }];

function MemberCard({ name, role, showRole }: { name: string; role: string; showRole: boolean }) {
  const [following, setFollowing] = useState(false);
  return <article className={styles.member} aria-label={`${name}的卡片`}>
    <UserCircle size={38} weight="light" aria-hidden="true" />
    <div><h3>{name}</h3><Reveal open={showRole}><p>{role}</p></Reveal></div>
    <button aria-label={`${following ? "取消关注" : "关注"}${name}`} aria-pressed={following} onClick={() => setFollowing(value => !value)}><States index={Number(following)}>{[<span key="off"><UserPlus size={17} />关注</span>, <span key="on"><Check size={17} />已关注</span>]}</States></button>
  </article>;
}

export function ComponentLesson() {
  const [showRole, setShowRole] = useState(false);
  const [reset, setReset] = useState(0);
  return <div className={styles.lab} role="region" aria-label="组件定义与实例演示">
    <div className={styles.workshop}>
      <div className={styles.definition}><h3><Code size={21} />MemberCard</h3><pre><span>{'<article>'}</span><span>{'  <Avatar />'}</span><span>{'  <h3>{name}</h3>'}</span><span className={styles.codeAddition} data-open={showRole} aria-hidden={!showRole}>{'  <p>{role}</p>'}</span><span>{'  <FollowButton />'}</span><span>{'</article>'}</span></pre><button aria-pressed={showRole} onClick={() => setShowRole(value => !value)}>{showRole ? "移除公共角色行" : "加入公共角色行"}</button></div>
      <div className={styles.members} key={reset}>{members.map(person => <MemberCard key={person.name} {...person} showRole={showRole} />)}</div>
    </div>
    <div className={styles.actions}><button onClick={() => { setShowRole(false); setReset(value => value + 1); }}><ArrowCounterClockwise size={18} />重置组件演示</button></div>
  </div>;
}

function ActionButton({ label, tone, disabled, onAction }: { label: string; tone: string; disabled: boolean; onAction: () => void }) {
  return <button className={styles.previewButton} data-tone={tone} disabled={disabled} onClick={onAction}>{label}<PaperPlaneTilt size={20} aria-hidden="true" /></button>;
}

export function PropsLesson() {
  const [label, setLabel] = useState("保存草稿");
  const [tone, setTone] = useState("primary");
  const [disabled, setDisabled] = useState(false);
  const [clicks, setClicks] = useState(0);
  const shownLabel = label.trim() || "按钮";
  return <div className={`${styles.lab} ${styles.propsLab}`} role="region" aria-label="Props配置与回调演示">
    <div className={styles.config}><h3>父组件</h3>
      <label>按钮文字<input value={label} maxLength={18} onChange={event => { setLabel(event.target.value); setClicks(0); }} /></label>
      <label>样式<select value={tone} onChange={event => { setTone(event.target.value); setClicks(0); }}><option value="primary">主要 · primary</option><option value="quiet">轻量 · quiet</option></select></label>
      <label className={styles.checkLabel}><input type="checkbox" checked={disabled} onChange={event => { setDisabled(event.target.checked); setClicks(0); }} />禁用按钮</label>
      <div className={styles.callback} aria-live="polite"><ArrowUpLeft size={20} aria-hidden="true" /><span>收到点击 <strong>{clicks}</strong> 次</span></div>
    </div>
    <div className={styles.childPreview}><span>ActionButton</span><ActionButton label={shownLabel} tone={tone} disabled={disabled} onAction={() => setClicks(value => value + 1)} /><pre>{`<ActionButton\n  label=${JSON.stringify(shownLabel)}\n  tone="${tone}"\n  disabled={${disabled}}\n  onAction={handleAction}\n/>`}</pre></div>
    <div className={styles.actions}><button onClick={() => { setLabel("保存草稿"); setTone("primary"); setDisabled(false); setClicks(0); }}><ArrowCounterClockwise size={18} />重置参数</button></div>
  </div>;
}

type SaveStatus = "idle" | "pending" | "error" | "success";
export function StateLesson() {
  const [text, setText] = useState("明天讨论首页的导航。");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedText, setSavedText] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const pending = status === "pending";
  const canSave = text.trim().length > 0 && !pending && status !== "success";
  useEffect(() => { if (status === "error" || status === "success") input.current?.focus(); }, [status]);
  function receive(next: "error" | "success") {
    if (!pending) return;
    if (next === "success") setSavedText(text);
    setStatus(next);
  }
  return <div className={`${styles.lab} ${styles.stateLab}`} role="region" aria-label="草稿保存状态演示">
    <form className={styles.draft} onSubmit={event => { event.preventDefault(); if (canSave) setStatus("pending"); }}>
      <label htmlFor="state-draft"><FileText size={22} />会议笔记</label>
      <textarea id="state-draft" ref={input} value={text} maxLength={120} disabled={pending} onChange={event => { setText(event.target.value); setStatus("idle"); }} />
      <button type="submit" disabled={!canSave}>{pending ? "保存中" : status === "error" ? "重试保存" : status === "success" ? "已保存" : "保存草稿"}<PaperPlaneTilt size={18} /></button>
    </form>
    <div className={styles.saveResult}><code className={styles.statusCode}>status = &quot;{status}&quot;</code><div aria-live="polite"><States index={["idle", "pending", "error", "success"].indexOf(status)}>{[
      <div key="idle" className={styles.receipt}><FileText size={34} weight="light" /><h3>尚未保存</h3><p>编辑笔记，再保存草稿。</p></div>,
      <div key="pending" className={styles.receipt}><HourglassMedium size={34} weight="light" /><h3>等待响应</h3><div className={styles.responseControls}><button onClick={() => receive("success")}><Check size={17} />返回成功</button><button onClick={() => receive("error")}><WarningCircle size={17} />返回失败</button></div></div>,
      <div key="error" className={styles.receipt} data-error="true"><WarningCircle size={34} weight="light" /><h3>保存失败</h3><p>笔记还在，可以重试。</p></div>,
      <div key="success" className={styles.receipt}><Check size={34} weight="light" /><h3>草稿已保存</h3><p>{savedText}</p></div>,
    ]}</States></div></div>
    <div className={styles.actions}><button onClick={() => { setText("明天讨论首页的导航。"); setStatus("idle"); setSavedText(""); }}><ArrowCounterClockwise size={18} />重置保存演示</button></div>
  </div>;
}
