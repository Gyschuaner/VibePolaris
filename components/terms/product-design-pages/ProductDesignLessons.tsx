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

export function FunnelLesson() {
  const [step, setStep] = useState(0);
  const states = [
    { label: "封闭 · 30 分钟", note: "先到注册页才算进入；跳过第一步的人不会被补进来。", values: [1000, 420, 120] },
    { label: "看到第一处流失", note: "1000 人到 420 人，第一步流失 58%；这告诉你位置，不告诉你原因。", values: [1000, 420, 120] },
    { label: "看到第二处流失", note: "420 人到 120 人，表单到验证的流失约 71%；继续查验证码或邮件证据。", values: [1000, 420, 120] },
    { label: "开放漏斗", note: "允许从表单直接进入，第二步多出 30 人；规则变了，不能和封闭结果直接混比。", values: [1000, 450, 120] },
    { label: "缩短到 10 分钟", note: "等待时间变短，验证只剩 80 人；这是窗口变化，不等于页面突然退化。", values: [1000, 420, 80] },
  ] as const;
  const current = states[step];
  const labels = ["到达注册页", "填写表单", "验证邮箱"];
  return <div className={styles.lesson} role="region" aria-label="漏斗步骤与流失演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>只改一条规则，看谁被留下</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置漏斗演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="漏斗状态"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>封闭起点</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>看第一处流失</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>看第二处流失</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>开放漏斗</button><button type="button" aria-pressed={step === 4} onClick={() => setStep(4)}>十分钟窗口</button></div><div className={styles.funnelBoard}><div className={styles.funnelSteps}>{current.values.map((value, index) => <div className={styles.funnelRow} data-active={step === index + 1 || (step === 4 && index === 2)} key={labels[index]}><span>{labels[index]}</span><div className={styles.funnelTrack}><div className={styles.funnelBar} style={{ width: `${(value / 1000) * 100}%` }} /></div><strong>{value}</strong></div>)}</div><div className={styles.funnelResult} role="status"><small>{current.label}</small><strong>{current.values[2]} 人完成</strong><span>{current.note}</span></div></div><div className={styles.funnelNote}><strong>漏斗回答“在哪一步掉下去”</strong><br />原因仍要回到录屏、访谈、日志或实验；人数变化本身不是诊断结论。</div></div>;
}

export function UsabilityTestingLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["给出目标", "退回一件尺码不合适的商品", "只说要完成什么，不说按钮在哪里。"],
    ["独立操作", "入口未被发现 · 回看 2 次", "主持人先停下来观察，把停顿和回看记下来。"],
    ["按规则提示", "提示级别 1", "到达预设时间，只提示“可以查看订单详情”，不直接指路。"],
    ["记录完成", "完成 · 需要 1 次提示", "成功和困难一起留下，下一轮才知道要改什么。"],
  ] as const;
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="可用性测试观察演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>别急着教，先把行为留下</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置可用性测试演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="可用性测试步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>给出目标</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>独立寻找</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>最小提示</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>留下证据</button></div><div className={styles.usabilityBoard}><div className={styles.usabilityTaskCard} data-active={step === 0}><small>任务卡 · 目标式描述</small><strong>退回一件尺码不合适的商品</strong><p>让参与者自己决定从哪里开始、怎样完成。</p></div><div className={styles.usabilityObservation} data-active={step > 0}><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p><span className={styles.usabilitySignal}><i aria-hidden="true" />主持人记录行为</span></div></div><div className={styles.usabilityNote} role="status"><strong>现在记录：{current[0]}</strong><br />{step < 2 ? "把用户当成正在完成真实任务的人，不把页面答案塞进任务描述。" : step === 2 ? "提示是研究协议的一部分；提示后仍要记录发生过提示。" : "一次成功不等于没有问题，提示、停顿和原话都属于结果。"}</div></div>;
}

export function MockupLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["线框确认结构", "灰阶页面", "先看栏目、操作位置和信息顺序，颜色暂时退到后面。"],
    ["视觉稿补上视觉语言", "字体 · 颜色 · 间距", "可以评审外观和层级，但画面仍然是静态的。"],
    ["状态清单暴露缺页", "缺 3 项", "加载、错误和窄屏没有画出来，不能假装它们已经解决。"],
    ["交互交给原型验证", "视觉稿通过 · 交互待测", "点击、返回和失败恢复要在原型或可运行界面里走一遍。"],
  ] as const;
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="线框、视觉稿和原型的交付边界演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>每种交付物只回答它擅长的问题</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置视觉稿演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="视觉稿交付步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>确认结构</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>补视觉语言</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>查状态缺口</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>交给原型</button></div><div className={styles.mockupBoard}><div className={styles.mockupArtifact} data-active={step === 0 || step === 1}><small>{current[0]}</small><strong>{current[1]}</strong>{step < 2 ? <><p>{step === 0 ? "信息结构和内容优先级" : "颜色、字体和间距"}</p><div className={styles.mockupSwatches} aria-label="视觉样式色板"><i /><i /><i /></div></> : <ul className={styles.mockupChecklist}><li data-done={step === 3}>加载</li><li data-done={step === 3}>空状态</li><li data-done={step === 3}>错误与窄屏</li></ul>}</div><div className={styles.mockupReview} data-active={step > 1}><small>评审结论</small><strong>{current[1]}</strong><p>{current[2]}</p></div></div><div className={styles.mockupNote} role="status"><strong>当前能确认：{step === 0 ? "结构" : step === 1 ? "视觉表现" : step === 2 ? "缺少状态" : "行为仍需验证"}</strong><br />静态画面越精致，越要把它还没有回答的问题标出来。</div></div>;
}

export function SitemapLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["页面先全部平铺", "12 个平级节点", "没有父子关系，优惠说明也找不到入口。"],
    ["按任务建立一级栏目", "订单 · 账户", "相关页面落到两个一级分组，层级先有了骨架。"],
    ["处理孤立页面", "订单 / 优惠说明", "把有任务归属的页面接回去，重复页才有删除依据。"],
    ["一级结构映射导航", "订单 · 账户", "主导航只显示一级栏目，详情页留在层级内。"],
  ] as const;
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="站点地图层级演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>把页面放回它所属的任务里</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置站点地图演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="站点地图步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>先看平铺</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>建立分组</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>接回孤立页</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>映射导航</button></div><div className={styles.sitemapBoard}><div className={styles.sitemapTree} data-active={step > 0}><small>{current[0]}</small>{step === 0 ? <><div className={styles.sitemapRoot}>12 个页面</div><div className={styles.sitemapOrphan}>优惠说明 · 无入口</div></> : <><div className={styles.sitemapRoot}>网站根节点</div><div className={styles.sitemapBranches}><div className={styles.sitemapBranch}><strong>订单</strong><span>列表 · 详情 · 退货{step >= 2 ? " · 优惠说明" : ""}</span></div><div className={styles.sitemapBranch}><strong>账户</strong><span>资料 · 地址 · 安全</span></div></div>{step === 1 && <div className={styles.sitemapOrphan}>优惠说明 · 待归属</div>}{step === 2 && <div className={styles.sitemapOrphan} data-moved={true}>优惠说明 · 已归入订单</div>}{step === 3 && <div className={styles.sitemapOrphan} data-moved={true}>主导航：订单 · 账户</div>}</>}</div><div className={styles.sitemapDecision} data-active={step > 1}><small>结构结论</small><strong>{current[1]}</strong><p>{current[2]}</p></div></div><div className={styles.sitemapNote} role="status"><strong>现在能回答：{step === 0 ? "哪些页面没有归属" : step === 1 ? "页面按什么任务分组" : step === 2 ? "孤立页面接到哪里" : "哪些一级栏目进入主导航"}</strong><br />站点地图说明页面关系，用户完成任务时仍可能跨越多个栏目。</div></div>;
}
