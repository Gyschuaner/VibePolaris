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
