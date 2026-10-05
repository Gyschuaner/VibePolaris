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
    <div className={styles.focusStage} data-open={open}>
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
  return <div className={styles.lesson} role="region" aria-label="迭代增量与证据演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>转动证据盘，看下一轮为什么改变</strong></div><button className={styles.reset} type="button" onClick={() => setRound(0)} aria-label="重置迭代演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="迭代步骤"><button type="button" aria-pressed={round === 0} onClick={() => setRound(0)}>交付一块</button><button type="button" aria-pressed={round === 1} onClick={() => setRound(1)}>读使用证据</button><button type="button" aria-pressed={round === 2} onClick={() => setRound(2)}>决定下一轮</button><button type="button" aria-pressed={round === 3} onClick={() => setRound(3)}>稳定后扩展</button></div><div className={styles.iterationDialBoard} data-round={round}><div className={styles.iterationEvidenceDial}><i aria-hidden="true" /><span data-mark="ship">交付</span><span data-mark="observe">证据</span><span data-mark="adjust">下一轮</span></div><div className={styles.iterationDialReadout}><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p></div></div><div className={styles.iterationDecision} role="status"><strong>{round === 0 ? "先交付，再收集证据" : round === 1 ? "证据进入下一轮" : round === 2 ? "先修缺口，再决定是否扩展" : "稳定后才值得验证新需求"}</strong><br />{round === 0 ? "一轮要有可运行结果，不能只留下待办清单。" : round === 1 ? "把失败位置写成下一轮的范围，别把猜测当结论。" : round === 2 ? "先把字段问题解决，定时报表仍然只是待验证的假设。" : "迭代不是无限加功能；当目标已达成或证据不支持继续，就停下来。"}</div></div>;
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
  return <div className={styles.lesson} role="region" aria-label="漏斗步骤与流失演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>看同一批人在哪道筛网停下</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置漏斗演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="漏斗状态"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>封闭起点</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>看第一处流失</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>看第二处流失</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>开放漏斗</button><button type="button" aria-pressed={step === 4} onClick={() => setStep(4)}>十分钟窗口</button></div><div className={styles.funnelCohortBoard}><div className={styles.funnelCohortColumns}>{current.values.map((value, index) => <div className={styles.funnelCohortColumn} data-active={step === index + 1 || (step === 4 && index === 2)} key={labels[index]}><small>{labels[index]}</small><div className={styles.funnelDots}>{Array.from({ length: 15 }, (_, dot) => <i key={dot} data-kept={dot < Math.max(1, Math.round(value / 1000 * 15))} />)}</div><strong>{value}</strong></div>)}</div><div className={styles.funnelResult} role="status"><small>{current.label}</small><strong>{current.values[2]} 人完成</strong><span>{current.note}</span></div></div><div className={styles.funnelNote}><strong>漏斗回答“在哪一步掉下去”</strong><br />点阵显示留下的人数；原因仍要回到录屏、访谈、日志或实验。</div></div>;
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
  return <div className={styles.lesson} role="region" aria-label="可用性测试观察演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>看视线停在哪里，先别替用户操作</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置可用性测试演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="可用性测试步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>给出目标</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>独立寻找</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>最小提示</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>留下证据</button></div><div className={styles.usabilityObservationBoard} data-step={step}><div className={styles.usabilityTestScreen}><small>退回一件尺码不合适的商品</small><span data-hot={step === 0 ? "low" : "mid"}>订单列表</span><span data-hot={step > 0 ? "high" : "low"}>订单详情</span><span data-hot={step >= 2 ? "mid" : "low"}>售后入口</span><i className={styles.usabilityGaze} aria-hidden="true" /></div><div className={styles.usabilityObservation}><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p><span className={styles.usabilitySignal}><i aria-hidden="true" />主持人记录行为</span></div></div><div className={styles.usabilityNote} role="status"><strong>现在记录：{current[0]}</strong><br />{step < 2 ? "把用户当成正在完成真实任务的人，不把页面答案塞进任务描述。" : step === 2 ? "提示是研究协议的一部分；提示后仍要记录发生过提示。" : "一次成功不等于没有问题，提示、停顿和原话都属于结果。"}</div></div>;
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
  return <div className={styles.lesson} role="region" aria-label="线框、视觉稿和原型的交付边界演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>揭开一层，看这一稿到底能证明什么</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置视觉稿演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="视觉稿交付步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>确认结构</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>补视觉语言</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>查状态缺口</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>交给原型</button></div><div className={styles.mockupPeelBoard} data-step={step}><div className={styles.mockupPeelStack}><div className={styles.mockupPeelSheet} data-sheet="wireframe"><small>结构</small><strong>栏目 · 操作 · 顺序</strong><span>灰阶线框</span></div><div className={styles.mockupPeelSheet} data-sheet="visual"><small>外观</small><strong>字体 · 颜色 · 间距</strong><span>视觉稿</span></div><div className={styles.mockupPeelSheet} data-sheet="prototype"><small>行为</small><strong>点击 · 返回 · 失败</strong><span>交互原型</span></div></div><div className={styles.mockupPeelReadout} role="status"><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p><div className={styles.mockupPeelMarks}><i data-on={step >= 0}>结构</i><i data-on={step >= 1}>外观</i><i data-on={step >= 3}>行为</i></div></div></div><div className={styles.mockupNote} role="status"><strong>当前能确认：{step === 0 ? "结构" : step === 1 ? "视觉表现" : step === 2 ? "缺少状态" : "行为仍需验证"}</strong><br />静态画面越精致，越要把它还没有回答的问题标出来。</div></div>;
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
  return <div className={styles.lesson} role="region" aria-label="站点地图层级演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>让孤立页面自己找到任务归属</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置站点地图演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="站点地图步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>先看平铺</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>建立分组</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>接回孤立页</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>映射导航</button></div><div className={styles.sitemapConstellation} data-step={step}><div className={styles.sitemapConstellationRoot}><small>{step === 0 ? "页面清单" : "网站根节点"}</small><strong>{step === 0 ? "12 个页面" : "网站"}</strong></div><div className={styles.sitemapConstellationCluster} data-cluster="orders"><strong>订单</strong><span>列表 · 详情 · 退货{step >= 2 ? " · 优惠说明" : ""}</span></div><div className={styles.sitemapConstellationCluster} data-cluster="account"><strong>账户</strong><span>资料 · 地址 · 安全</span></div><div className={styles.sitemapFloatingPage} data-docked={step >= 2}>优惠说明<span>{step >= 2 ? "已归入订单" : "待归属"}</span></div><div className={styles.sitemapNavStrip} data-visible={step === 3}>主导航：订单 · 账户</div></div><div className={styles.sitemapDecision} data-active={step > 1}><small>结构结论</small><strong>{current[1]}</strong><p>{current[2]}</p></div><div className={styles.sitemapNote} role="status"><strong>现在能回答：{step === 0 ? "哪些页面没有归属" : step === 1 ? "页面按什么任务分组" : step === 2 ? "孤立页面接到哪里" : "哪些一级栏目进入主导航"}</strong><br />站点地图说明页面关系，用户完成任务时仍可能跨越多个栏目。</div></div>;
}

export function DesignTokenLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["组件引用语义名", "color.action", "按钮和链接都读取同一个语义令牌，不直接写色值。"],
    ["浅色主题映射基础值", "light · moss-900", "只改映射，两个组件一起得到深色前景。"],
    ["深色主题只改映射", "dark · lime-500", "主题切换后语义令牌换值，组件不用逐个搜索颜色。"],
    ["局部硬编码暴露", "link · hard-coded", "按钮继续更新，链接脱离映射，对比度检查失败。"],
  ] as const;
  const current = states[step];
  const dark = step >= 2;
  const broken = step === 3;
  const mapped = step === 0 ? "未映射" : dark ? "lime-500" : "moss-900";
  return <div className={styles.lesson} role="region" aria-label="设计令牌主题映射演示"><div className={styles.lessonTop}><div><span>读者任务</span><strong>只改语义映射，不逐个改组件</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置设计令牌演示"><ArrowCounterClockwise size={16} /></button></div><div className={styles.lessonControls} role="group" aria-label="设计令牌步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>看引用</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>浅色主题</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>深色主题</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>暴露硬编码</button></div><div className={styles.tokenRippleBoard} data-theme={dark ? "dark" : "light"} data-broken={broken}><div className={styles.tokenRippleCanvas}><div className={styles.tokenRippleCenter}><small>语义用途</small><strong>color.action</strong><span>{step === 0 ? "尚未映射" : mapped}</span></div><div className={styles.tokenRippleConsumer} data-role="button"><strong>按钮</strong><span>跟随映射</span></div><div className={styles.tokenRippleConsumer} data-role="link" data-hardcoded={broken}><strong>链接</strong><span>{broken ? "#B7D524 · 旧值" : "跟随映射"}</span></div><i className={styles.tokenRippleWave} aria-hidden="true" /></div>{broken && <div className={styles.tokenWarning}>链接没有跟随主题映射，先回到语义令牌再做对比度检查。</div>}<div className={styles.tokenDecision} data-theme={dark ? "dark" : "light"}><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p></div></div><div className={styles.tokenNote} role="status"><strong>现在观察：{broken ? "一个组件脱离映射" : dark ? "映射改变，组件同步" : "组件引用的是用途，不是外观"}</strong><br />令牌的价值在连接关系里；只把颜色值改名，不能自动得到可维护的主题。</div></div>;
}

export function FeedbackLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["可以提交", "保存", "表单里还有未保存的邮箱修改。"],
    ["系统已接收", "保存中…", "按钮暂时锁住，输入仍留在原位。"],
    ["结果已落地", "已保存 · 14:32", "状态贴在编辑区旁边，用户不必寻找一条消失的提示。"],
    ["这次没有保存", "保存失败", "内容仍在，错误说明下一步可以重试。"],
    ["恢复入口出现", "重试保存", "同一份输入再次提交，失败不会把用户送回起点。"],
  ] as const;
  const current = states[step];
  const saving = step === 1;
  const success = step === 2;
  const failed = step >= 3;
  return <div className={styles.lesson} role="region" aria-label="反馈状态演示">
    <div className={styles.lessonTop}><div><span>读者任务</span><strong>看同一份输入怎样告诉你发生了什么</strong></div><button className={styles.reset} type="button" onClick={() => setStep(0)} aria-label="重置反馈演示"><ArrowCounterClockwise size={16} /></button></div>
    <div className={styles.lessonControls} role="group" aria-label="反馈步骤"><button type="button" aria-pressed={step === 0} onClick={() => setStep(0)}>待提交</button><button type="button" aria-pressed={step === 1} onClick={() => setStep(1)}>处理中</button><button type="button" aria-pressed={step === 2} onClick={() => setStep(2)}>成功</button><button type="button" aria-pressed={step === 3} onClick={() => setStep(3)}>失败</button><button type="button" aria-pressed={step === 4} onClick={() => setStep(4)}>重试</button></div>
    <div className={styles.feedbackBoard} data-state={failed ? "failed" : success ? "success" : saving ? "saving" : "idle"}>
      <div className={styles.feedbackForm}><div className={styles.feedbackField}><small>邮箱</small><strong>hello@example.com</strong><span data-dirty={!success}>未保存的修改</span></div><div className={styles.feedbackActions}><button type="button" disabled={saving} onClick={() => setStep(step === 3 ? 4 : 1)}>{current[1]}</button>{failed && step === 3 && <button type="button" className={styles.feedbackRetry} onClick={() => setStep(1)}>再次尝试</button>}</div></div>
      <div className={styles.feedbackStatus} role="status" aria-live="polite"><i aria-hidden="true" /> <div><small>{current[0]}</small><strong>{success ? "资料已更新" : failed ? "服务器没有接住这次保存" : saving ? "正在把修改送出" : "还有一处修改等着保存"}</strong><p>{current[2]}</p></div></div>
    </div>
    <div className={styles.feedbackNote}><strong>现在观察：{success ? "结果回到原位置" : failed ? "失败保留输入和下一步" : saving ? "接收和完成是两个状态" : "没有变化就没有证据"}</strong><br />反馈应该让用户知道系统处在哪一段，并决定下一步，而不是把每次点击都变成会消失的 Toast。</div>
  </div>;
}

export function VisualHierarchyLesson() {
  const [intensity, setIntensity] = useState(0);
  const [mobile, setMobile] = useState(false);
  const states = [
    ["五个竞争焦点", "标题、按钮、说明和装饰都在抢第一眼。"],
    ["三个焦点", "说明退到次要层，装饰只留下必要的一枚。"],
    ["标题先被看见", "标题定方向，金额帮用户判断，按钮接住动作。"],
    ["窄屏仍保持顺序", "列宽变窄，主要任务没有被辅助信息插队。"],
  ] as const;
  const step = mobile ? 3 : intensity;
  const current = states[step];
  const level = (kind: "title" | "primary" | "secondary" | "decoration") => {
    if (step === 0) return "same";
    if (kind === "secondary" || kind === "decoration") return "quiet";
    if (step === 1) return "strong";
    if (kind === "title") return "strong";
    return kind === "primary" ? "medium" : "quiet";
  };
  return <div className={styles.lesson} role="region" aria-label="视觉层级聚光镜演示">
    <div className={styles.lessonTop}><div><span>读者任务</span><strong>拉动聚光镜，看注意力是否收敛</strong></div><button className={styles.reset} type="button" onClick={() => { setIntensity(0); setMobile(false); }} aria-label="重置视觉层级演示"><ArrowCounterClockwise size={16} /></button></div>
    <div className={styles.hierarchyControls} role="group" aria-label="视觉层级调节"><label className={styles.hierarchyRange}>层级强度 <input type="range" min="0" max="2" step="1" value={intensity} onChange={event => { setIntensity(Number(event.target.value)); setMobile(false); }} aria-label="层级强度" /><span>{intensity === 0 ? "同权" : intensity === 1 ? "降噪" : "排序"}</span></label><button type="button" aria-pressed={mobile} onClick={() => setMobile(value => !value)}>{mobile ? "回到桌面" : "窄屏预览"}</button></div>
    <div className={styles.hierarchyBoard} data-mobile={mobile} data-scene={step}>
      <div className={styles.hierarchyCard}><div className={styles.hierarchyCardTop}><small>申请资料</small><span>同一份内容</span></div><div className={styles.hierarchyRows}>
        <div className={styles.hierarchyRow} data-level={level("title")}><small>标题</small><strong>提交报销申请</strong></div>
        <div className={styles.hierarchyRow} data-level={level("primary")}><small>内容</small><span>本月差旅 · ¥1,280</span></div>
        <div className={styles.hierarchyRow} data-level={level("secondary")}><small>说明</small><span>需在月底前上传发票</span></div>
        <div className={styles.hierarchyRow} data-level={level("decoration")}><small>标签</small><span>推荐 · 热门 · 新</span></div>
        <button className={styles.hierarchyAction} type="button" data-level={level("primary")}>提交申请</button>
        <i className={styles.hierarchyLens} aria-hidden="true" />
      </div></div>
      <div className={styles.hierarchyReadout} role="status"><small>注意力读数</small><strong>{current[0]}</strong><p>{current[1]}</p><ol className={styles.hierarchyOrder}><li data-level={level("title")}>标题</li><li data-level={level("primary")}>内容</li><li data-level={level("secondary")}>提交</li></ol></div>
    </div>
    <div className={styles.hierarchyNote}><strong>现在观察：{mobile ? "响应式改变位置，不改变优先级" : intensity === 0 ? "所有东西都在喊“先看我”" : intensity === 1 ? "辅助信息退后，主要任务露出来" : "顺序来自相对差异"}</strong><br />{mobile ? "把窗口拉窄只改变排布；如果按钮被说明文字挤到后面，说明层级和结构还没有对齐。" : "聚光镜只是把注意顺序显出来，真正的层级来自页面里稳定的相对差异。"}</div>
  </div>;
}
