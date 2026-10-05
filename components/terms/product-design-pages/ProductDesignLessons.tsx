"use client";

import { ArrowRight, ArrowCounterClockwise, Cursor } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import styles from "./ProductDesignConcepts.module.css";

type FocusStep = "closed" | "open" | "tabbed";
type FocusTarget = "trigger" | "title" | "save" | "close";

export function FocusManagementLesson() {
  const [step, setStep] = useState<FocusStep>("closed");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mountedRef = useRef(false);
  const [focused, setFocused] = useState<FocusTarget>("trigger");
  const open = step !== "closed";
  const focusLabel = { trigger: "打开设置", title: "对话框标题", save: "保存", close: "关闭" }[focused];
  const status = !open
    ? "焦点在触发按钮；对话框尚未接管键盘。"
    : focused === "title"
      ? "焦点已进入对话框，背景控件暂时不参与 Tab 顺序。"
      : "Tab 继续留在对话框内；关闭后应回到打开设置。";

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    (step === "closed" ? triggerRef : step === "open" ? titleRef : saveRef).current?.focus();
  }, [step]);

  function move(next: FocusStep) { setStep(next); }

  function trapDialogKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); move("closed"); return; }
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === titleRef.current) { event.preventDefault(); closeRef.current?.focus(); }
    if (!event.shiftKey && document.activeElement === closeRef.current) { event.preventDefault(); titleRef.current?.focus(); }
  }

  return <div className={styles.lesson} role="region" aria-label="焦点管理演示">
    <div className={styles.lessonTop} data-inert={open}><div><span>读者任务</span><strong>让焦点跟着当前任务走</strong></div><button className={styles.reset} type="button" tabIndex={open ? -1 : 0} onClick={() => move("closed")} aria-label="重置焦点管理演示"><ArrowCounterClockwise size={16} /></button></div>
    <div className={styles.lessonControls} data-inert={open} role="group" aria-label="焦点操作"><button type="button" tabIndex={open ? -1 : 0} aria-pressed={step === "closed"} onClick={() => move("closed")}>打开前</button><button type="button" tabIndex={open ? -1 : 0} aria-pressed={open} onClick={() => move("open")}>打开对话框</button><button type="button" tabIndex={open ? -1 : 0} aria-pressed={step === "tabbed"} onClick={() => move("tabbed")}>按 Tab</button><button type="button" tabIndex={open ? -1 : 0} onClick={() => move("closed")}>按 Esc 关闭</button></div>
    <div className={styles.focusStage}>
      <div className={styles.focusBackground} data-inert={open} aria-hidden={open}><small>背景页面</small><button ref={triggerRef} type="button" tabIndex={open ? -1 : 0} data-focused={focused === "trigger"} onFocus={() => setFocused("trigger")} onClick={() => move("open")}>打开设置</button><span className={styles.focusFakeButton}>账户通知</span></div>
      <div className={styles.focusArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.focusDialog} role="dialog" aria-modal={open} aria-labelledby="focus-demo-title" aria-hidden={!open} onKeyDown={trapDialogKey}><small id="focus-demo-title">设置对话框</small><button ref={titleRef} type="button" tabIndex={open ? 0 : -1} data-focused={focused === "title"} onFocus={() => setFocused("title")}>标题与说明</button><button ref={saveRef} type="button" tabIndex={open ? 0 : -1} data-focused={focused === "save"} onFocus={() => setFocused("save")}>保存</button><button ref={closeRef} type="button" tabIndex={open ? 0 : -1} data-focused={focused === "close"} onFocus={() => setFocused("close")} onClick={() => move("closed")}>关闭</button></div>
    </div>
    <div className={styles.focusState} role="status"><Cursor size={16} aria-hidden="true" /><span><strong>当前焦点：{focusLabel}</strong><br />{status}</span></div>
  </div>;
}

export function IterationLesson() {
  const [round, setRound] = useState(0);
  const cards = [
    ["本轮增量", "手动 CSV", "先验证筛选和失败提示。"],
    ["使用证据", "字段缺失 2 / 5", "真实任务暴露了下一处缺口。"],
    ["下一轮决定", "补字段，暂缓定时", "先解决证据指出的问题。"],
    ["稳定后扩展", "验证定时报表", "基础导出稳定后再验证新需求。"],
  ];
  const current = cards[round];
  return <div className={styles.lesson} role="region" aria-label="迭代增量与证据演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>看一轮结果怎样改变下一轮</strong></div><button className={styles.reset} type="button" onClick={() => setRound(0)} aria-label="重置迭代演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="迭代步骤"><button type="button" aria-pressed={round === 0} onClick={() => setRound(0)}>交付一块</button><button type="button" aria-pressed={round === 1} onClick={() => setRound(1)}>读使用证据</button><button type="button" aria-pressed={round === 2} onClick={() => setRound(2)}>决定下一轮</button><button type="button" aria-pressed={round === 3} onClick={() => setRound(3)}>稳定后扩展</button></div><div className={styles.iterationBoard}><div className={styles.iterationCard} data-active={round === 0}><small>ROUND 01</small><strong>手动 CSV</strong><p>固定字段和失败提示，交给真实任务试用。</p></div><div className={styles.iterationArrow} aria-hidden="true"><ArrowRight size={18} /></div><div className={styles.iterationCard} data-active={round > 0}><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p></div></div><div className={styles.iterationDecision} role="status"><strong>{round === 0 ? "先交付，再收集证据" : round === 1 ? "证据进入下一轮" : round === 2 ? "先修缺口，再决定是否扩展" : "稳定后才值得验证新需求"}</strong><br />{round === 0 ? "一轮要有可运行结果，不能只留下待办清单。" : round === 1 ? "把失败位置写成下一轮的范围，别把猜测当结论。" : round === 2 ? "先把字段问题解决，定时报表仍然只是待验证的假设。" : "迭代不是无限加功能；当目标已达成或证据不支持继续，就停下来。"}</div></div>;
}

export function ConversionRateLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["起点先固定", "1000 users", "24 小时窗口，重复访问只计一次。", "—"],
    ["提交表单", "18%", "180 / 1000；完成事件是提交。", "180"],
    ["验证邮箱", "12%", "120 / 1000；完成事件更严格。", "120"],
    ["缩短窗口", "9%", "90 / 1000；只统计一小时内验证。", "90"],
  ] as const;
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="转化率口径演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>只改一个口径，看数字怎样变</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置转化率演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="转化率步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>固定起点</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>提交</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>验证</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>一小时窗口</button></div><div className={styles.conversionBoard}><div className={styles.conversionInputs}><div className={styles.conversionChoice} data-active={step === 0}><span>分母 · 独立用户</span><strong>1000</strong></div><div className={styles.conversionChoice} data-active={step === 1}><span>提交表单</span><strong>180</strong></div><div className={styles.conversionChoice} data-active={step >= 2}><span>验证邮箱</span><strong>{step === 3 ? "90" : "120"}</strong></div></div><div className={styles.conversionResult} role="status"><small>{current[0]}</small><strong>{current[1]}</strong><span>{current[2]}</span></div></div><div className={styles.conversionNote}><strong>公式：{current[3] !== "—" ? `${current[3]} ÷ 1000` : "完成用户 ÷ 起点用户"}</strong><br />同一批用户、同一时间范围和同一完成事件，才可以直接比较两个百分比。</div></div>;
}
