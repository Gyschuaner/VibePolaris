"use client";

import { ArrowCounterClockwise, Envelope, Keyboard, Star } from "@phosphor-icons/react";
import { useRef, useState, type CSSProperties } from "react";
import styles from "./FlowRedesignConcepts.module.css";

function LessonTop({ label, title, onReset, resetLabel }: { label: string; title: string; onReset: () => void; resetLabel: string }) {
  return <div className={styles.lessonTop}><div><span>{label}</span><strong>{title}</strong></div><button className={styles.reset} type="button" onClick={onReset} aria-label={resetLabel}><ArrowCounterClockwise size={16} /></button></div>;
}

function Controls({ labels, value, onChange, ariaLabel }: { labels: string[]; value: number; onChange: (value: number) => void; ariaLabel: string }) {
  return <div className={styles.lessonControls} role="group" aria-label={ariaLabel}>{labels.map((label, index) => <button key={label} type="button" aria-pressed={value === index} onClick={() => onChange(index)}>{label}</button>)}</div>;
}

export function LoadingStateLesson() {
  const [step, setStep] = useState(0);
  const states = [
    ["100ms · 直接完成", "不闪提示", "短请求直接把新内容换上。"],
    ["2s · 保留结构", "内容占位", "列表骨架守住原来的位置。"],
    ["8s · 可估计", "60% · 可取消", "知道完成量，才值得给进度。"],
    ["超时 · 停止等待", "重试出口", "错误不能继续伪装成加载中。"],
  ] as const;
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="加载状态等待预算演示"><LessonTop label="等待预算" title="把同一个请求拉长，看提示何时换挡" onReset={() => setStep(0)} resetLabel="重置加载状态演示" /><Controls labels={["100ms", "2s", "8s", "超时"]} value={step} onChange={setStep} ariaLabel="加载等待时间" /><div className={styles.loadingBoard} style={{ "--loading-position": `${[7, 35, 68, 94][step]}%` } as CSSProperties}><div className={styles.loadingRuler}><i aria-hidden="true" /></div><div className={styles.loadingLabels}><span>立即</span><span>短等待</span><span>长任务</span><span>上限</span></div><div className={styles.loadingCards}>{["直接替换", "结构占位", "确定进度", "失败重试"].map((label, index) => <div className={styles.loadingCard} data-active={step === index} key={label}><small>{["100ms", "2s", "8s", "timeout"][index]}</small><strong>{label}</strong><span>{["不打断", "不跳动", "有估计", "停止等待"][index]}</span></div>)}</div></div><div className={styles.lessonStatus} role="status"><strong>{current[0]} · {current[1]}</strong><span>{current[2]} 读者可以把等待长度和反馈形式对应起来，而不是把 spinner 当作默认答案。</span></div></div>;
}

export function MicrointeractionLesson() {
  const [state, setState] = useState<"pending" | "saved" | "undo" | "failed">("pending");
  const labels = ["按下响应", "成功确认", "再次点击撤销", "失败撤回"];
  const current = { pending: ["按下", "按钮先压缩，告诉用户请求已经发出。"], saved: ["确认", "图标填充、计数加一，状态留在按钮旁。"], undo: ["撤销", "再次点击进入取消请求，数量暂不擅自减一。"], failed: ["恢复", "服务端拒绝取消后回到可信状态，给出重试出口。"] }[state];
  const order = ["pending", "saved", "undo", "failed"] as const;
  function activate() { setState(state === "saved" ? "undo" : "pending"); }
  return <div className={styles.lesson} role="region" aria-label="微交互状态回弹演示"><LessonTop label="一个小任务" title="收藏按钮的变化必须有含义" onReset={() => setState("pending")} resetLabel="重置微交互演示" /><div className={styles.lessonControls} role="group" aria-label="收藏状态"><button type="button" onClick={() => setState("pending")}>按下收藏</button><button type="button" onClick={() => setState("saved")} aria-pressed={state === "saved"}>确认成功</button><button type="button" onClick={() => setState("undo")} aria-pressed={state === "undo"}>再次点击撤销</button><button type="button" onClick={() => setState("failed")} aria-pressed={state === "failed"}>模拟失败</button></div><div className={styles.microBoard}><div className={styles.microButtonStage}><button className={styles.favoriteButton} type="button" data-state={state} aria-pressed={state === "saved"} onClick={activate}><Star className={styles.favoriteGlyph} weight={state === "saved" ? "fill" : "regular"} aria-hidden="true" /><small>{state === "saved" ? "已收藏 · 25" : state === "failed" ? "取消失败 · 25" : state === "undo" ? "取消中 · 25" : "处理中 · 24"}</small></button></div><div className={styles.microReadout}><small>{current[0]}</small><strong>{current[1]}</strong><p>动效只解释局部状态，不替代结果文字。</p><div className={styles.microTrail}>{labels.map((label, index) => <i data-on={order.indexOf(state) >= index} key={label}>{label}</i>)}</div></div></div><div className={styles.lessonStatus} role="status"><strong>{state === "failed" ? "状态回到服务端确认值" : state === "saved" ? "反馈和数据同时落地" : state === "undo" ? "撤销也要等服务端确认" : "触发 → 规则 → 局部反馈 → 持续状态"}</strong><span>失败时不让按钮停在“已取消”的假状态；减少动态时，颜色、文字和计数仍然要能说明发生了什么。</span></div></div>;
}

export function ReducedMotionLesson() {
  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);
  const state = ["起点已记录", "偏好已切换", "标题原位淡入", "结果已定位"][step];
  return <div className={styles.lesson} role="region" aria-label="减少动态效果对照演示"><LessonTop label="同一个任务" title="只换运动预算，结果仍要一致" onReset={() => { setReduced(false); setStep(0); }} resetLabel="重置减少动态演示" /><div className={styles.motionBoard}><div className={styles.motionToggle}><span>用户偏好：<strong>{reduced ? "减少动态" : "完整动效"}</strong></span><button type="button" aria-pressed={reduced} onClick={() => setReduced(!reduced)}>切换偏好</button></div><Controls labels={["完整动效", "偏好切换", "短淡入", "结果"]} value={step} onChange={setStep} ariaLabel="页面切换阶段" /><div className={styles.motionLanes}><div className={styles.motionLane} data-active={!reduced} data-mode="full"><small>完整动效</small><div className={styles.motionTrack}><i className={styles.motionOrb} aria-hidden="true" /></div><p>保留短距离移动和轻微缩放，帮助建立空间连续性。</p></div><div className={styles.motionLane} data-active={reduced} data-mode="reduced"><small>减少动态</small><div className={styles.motionTrack}><i className={styles.motionOrb} aria-hidden="true" /></div><p>取消跨屏位移，改成原位淡入；标题、URL、焦点不变。</p></div></div><div className={styles.motionResult}><i aria-hidden="true" />最终状态：{state} · /terms/css · focus=标题</div></div><div className={styles.lessonStatus} role="status"><strong>{reduced ? "减少大幅移动，保留状态证据" : "用有限移动表达页面关系"}</strong><span>prefers-reduced-motion 是用户偏好，不是“把所有 duration 设为 0”；必要反馈、焦点和完成状态仍然存在。</span></div></div>;
}

export function ClientServerLesson() {
  const [phase, setPhase] = useState(0);
  const [status, setStatus] = useState("200");
  const response = status === "200" ? "商品 7 · JSON" : status === "404" ? "找不到商品 7" : "服务处理出错";
  return <div className={styles.lesson} role="region" aria-label="客户端服务器信封往返演示"><LessonTop label="一只封好的信" title="看消息怎样出去、被处理，再原路带回状态" onReset={() => { setPhase(0); setStatus("200"); }} resetLabel="重置客户端服务器演示" /><Controls labels={["封装请求", "服务器拆封", "封回响应", "客户端呈现"]} value={phase} onChange={setPhase} ariaLabel="请求往返阶段" /><div className={styles.clientBoard}><div className={styles.clientPanel} data-active={phase === 0 || phase === 3}><small>CLIENT · 浏览器</small><strong>商品页</strong><code>GET /products/7</code><span>{phase === 3 ? response : "等待响应"}</span></div><div className={styles.clientSeal} data-active={phase === 1 || phase === 2}><div className={styles.clientEnvelope}><Envelope size={27} aria-hidden="true" /><span>{phase < 2 ? "请求信封" : "响应信封"}</span></div><div className={styles.clientStatus}>{["200", "404", "500"].map(item => <button key={item} type="button" aria-pressed={status === item} onClick={() => setStatus(item)}>{item}</button>)}</div></div><div className={styles.clientPanel} data-active={phase === 1 || phase === 2}><small>SERVER · 商品服务</small><strong>{phase < 2 ? "查询资源" : "返回结果"}</strong><code>{phase === 1 ? "lookup(product:7)" : `${status} · ${response}`}</code><span>{phase === 1 ? "正在处理" : "状态码随响应回去"}</span></div></div><div className={styles.lessonStatus} role="status"><strong>{phase === 0 ? "客户端先把方法、路径和请求封进消息" : phase === 1 ? "服务器处理请求，不等于一定返回成功" : phase === 2 ? `响应带着 ${status} 和内容回到客户端` : `客户端根据 ${status} 呈现“${response}”`}</strong><span>客户端和服务器是这次交互里的角色；同一个程序在另一趟请求里可以换角色。</span></div></div>;
}

export function DeployLesson() {
  const [step, setStep] = useState(0);
  const [traffic, setTraffic] = useState(5);
  const labels = ["锁定版本", "构建制品", "写入环境", "实际验证", "切换流量", "准备回滚"];
  const current = ["a31f2c · 发布来源", "artifact #42 · 不再重打包", "v1.8.0 · migration ok", "HTTP 200 · login ok", `${traffic}% → 100% · 观察指标`, "v1.7.2 · 回滚目标保留"][step];
  const stages = [["commit", "提交", "a31f2c"], ["build", "构建", step >= 1 ? "checks" : "等待"], ["artifact", "制品", step >= 1 ? "#42" : "等待"], ["environment", "环境", step >= 2 ? "v1.8.0" : "等待"], ["health", "验证", step >= 3 ? "HTTP 200" : "待运行"], ["traffic", "流量", step >= 5 ? "回拨就绪" : step >= 4 ? `${traffic}%` : "旧版仍在"]];
  return <div className={styles.lesson} role="region" aria-label="部署制品车道演示"><LessonTop label="一份制品" title="让制品沿车道前进，流量才逐步换手" onReset={() => { setStep(0); setTraffic(5); }} resetLabel="重置部署演示" /><Controls labels={labels} value={step} onChange={setStep} ariaLabel="部署阶段" /><div className={styles.deployBoard}>{stages.map(([id, name, value], index) => <div className={styles.deployLane} data-active={step === index} key={id}><small>{id}</small><div className={styles.deployArtifact}><i aria-hidden="true" /><span>{name}</span></div><strong>{value}</strong></div>)}<label className={styles.deployTraffic}><span>流量拨盘</span><input type="range" min="5" max="100" step="5" value={traffic} onChange={event => setTraffic(Number(event.target.value))} aria-label="生产流量百分比" /><code>{traffic}%</code></label></div><div className={styles.lessonStatus} role="status"><strong>{current}</strong><span>{traffic < 100 ? "健康检查或指标不稳时，回拨仍指向上一份已验证制品。" : "全量前仍要保留版本、配置和回滚证据；命令成功不等于真实服务可用。"}</span></div></div>;
}

export function UserFlowLesson() {
  const [step, setStep] = useState(0);
  const nodes = [["入口", "邮件链接"], ["检查", "校验 token"], ["过期", "链接已过期"], ["填写", "重新发送"], ["修正", "一致性检查"], ["完成", "回到原任务"]];
  const messages = ["入口不是首页，用户从一封邮件开始。", "先检查链接，系统要把可用性说清楚。", "分支把失败说出来：过期链接不能假装没发生。", "恢复动作把人带回任务，不让用户重新摸索。", "输入不一致时指出问题，别把人送回起点。", "完成状态要接住原目标，而不是只显示“成功”。"];
  return <div className={styles.lesson} role="region" aria-label="用户流程恢复地图演示"><LessonTop label="一条会迷路的路径" title="把失败出口画进任务地图" onReset={() => setStep(0)} resetLabel="重置用户流程演示" /><Controls labels={["从邮件进入", "检查链接", "发现过期", "填写新密码", "修正不一致", "完成返回"]} value={step} onChange={setStep} ariaLabel="用户流程阶段" /><div className={styles.flowBoard}><div className={styles.flowMap} data-step={step}>{nodes.map(([title, detail], index) => <div className={styles.flowNode} data-active={step === index} key={title}><small>{title}</small><strong>{detail}</strong></div>)}<div className={styles.flowDetour} data-active={step >= 2} aria-hidden="true" /></div><div className={styles.flowReadout} role="status"><small>当前证据</small><strong>{nodes[step][0]} · {nodes[step][1]}</strong><span>{messages[step]}</span></div></div><div className={styles.lessonStatus} role="status"><strong>{step === 2 ? "看见分支，比多画一条成功箭头更重要" : step >= 3 && step < 5 ? "恢复是流程的一部分" : "流程描述的是人的目标，不是页面清单"}</strong><span>入口、动作、系统反馈和回退路径要能连回同一个任务；取消、返回和过期都要有落点。</span></div></div>;
}

export function WireframeLesson() {
  const [step, setStep] = useState(0);
  const states = [["列出内容", "先看有哪些信息", "只画标题、金额和操作，不评价视觉。"], ["建立分组", "让相关内容靠近", "把说明和字段放进同一任务区域。"], ["确定层级", "决定先看什么", "层级让读者预测阅读顺序。"], ["放置操作", "把动作放到判断之后", "主操作和返回、取消都要有位置。"], ["形成线框", "形成可讨论的骨架", "真实文案和窄屏仍要另行验证。"]];
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="线框结构剥离演示"><LessonTop label="一层一层揭开" title="线框先回答页面怎么站稳" onReset={() => setStep(0)} resetLabel="重置线框演示" /><Controls labels={["列出内容", "分组", "层级", "操作", "形成线框"]} value={step} onChange={setStep} ariaLabel="线框结构阶段" /><div className={styles.wireBoard} data-step={step}><div className={styles.wireStack}>{[["content", "内容清单", "标题 · 金额 · 条件"], ["group", "任务分组", "费用明细 / 付款方式"], ["action", "操作位置", "保存 · 返回 · 取消"]].map(([layer, title, value]) => <div className={styles.wireSheet} data-layer={layer} key={layer}><small>{title}</small><strong>{value}</strong><span>低保真结构</span></div>)}</div><div className={styles.wireReadout} role="status"><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p><div className={styles.wireMarks}><i data-on={step >= 0}>内容</i><i data-on={step >= 1}>分组</i><i data-on={step >= 2}>层级</i><i data-on={step >= 3}>操作</i><i data-on={step >= 4}>线框</i></div></div></div><div className={styles.lessonStatus} role="status"><strong>当前能讨论：{step >= 4 ? "结构与主要操作" : current[0]}</strong><span>线框不会自动证明真实文案长度、数据密度、动效或技术可行性；它先把结构从视觉里剥出来。</span></div></div>;
}

export function PrototypeLesson() {
  const [step, setStep] = useState(0);
  const states = [["限定假设", "用户知道邀请码在哪里", "先把要验证的判断写成一句话。"], ["模拟关键状态", "入口 + 输入 + 错误 + 成功", "只做与本轮任务有关的关键状态。"], ["给出真实任务", "加入朋友的空间", "不提示按钮名称，交给用户自己找入口。"], ["观察行为", "3/3 停在首页", "真实任务里的停顿比设计师的猜测更有用。"], ["修改原型", "把入口改成“用邀请码加入”", "证据改变下一轮原型，而不是直接宣布产品完成。"], ["形成决定", "保留明确入口，进入下一轮", "本轮观察形成下一步，仍不等于生产就绪。"]];
  const current = states[step];
  return <div className={styles.lesson} role="region" aria-label="原型假设回放演示"><LessonTop label="一轮小实验" title="原型换回证据，不是提前冒充成品" onReset={() => setStep(0)} resetLabel="重置原型演示" /><Controls labels={["限定假设", "模拟状态", "给出任务", "观察行为", "修改原型", "形成决定"]} value={step} onChange={setStep} ariaLabel="原型实验阶段" /><div className={styles.prototypeBoard}><div className={styles.prototypeTable}>{states.map(([, title, note], index) => <div className={styles.prototypeCard} data-active={step === index} key={title}><b>0{index + 1}</b><strong>{title}</strong><span>{step >= index ? note : "等待这一轮"}</span></div>)}</div><div className={styles.prototypeReadout} role="status"><small>{current[0]}</small><strong>{current[1]}</strong><p>{current[2]}</p><span className={styles.prototypeStamp}><i aria-hidden="true" /> {step >= 3 ? "行为证据" : "工作假设"}</span></div></div><div className={styles.lessonStatus} role="status"><strong>{step < 3 ? "把要验证的部分做出来" : "观察结果进入下一轮"}</strong><span>可点击不等于真实支付、性能、安全和数据一致性已经成立；原型的价值是缩短假设到证据的距离。</span></div></div>;
}

export function IaLesson() {
  const [step, setStep] = useState(0);
  const zones = [["账户与安全", "登录 · 密钥 · 权限"], ["开发工具", "API · SDK · 文档"], ["任务入口", "按用户说法找到它"]];
  const labels = ["盘点内容", "建立分类", "放置任务内容", "补搜索语言", "建立交叉入口"];
  const title = ["API 密钥暂时没有归属", "先进入领域分区", "用户说“连接服务”也能找到", "把“退订”映射到同一篇内容", "正文保留一份，入口可以有多个"][step];
  return <div className={styles.lesson} role="region" aria-label="信息架构空间分区演示"><LessonTop label="把内容放回空间" title="分类不是把卡片塞进菜单，而是让任务有位置" onReset={() => setStep(0)} resetLabel="重置信息架构演示" /><Controls labels={labels} value={step} onChange={setStep} ariaLabel="信息架构分区阶段" /><div className={styles.iaBoard} data-step={step}><div className={styles.iaZones}>{zones.map(([name, detail], index) => <div className={styles.iaZone} data-active={step === index + 1 || (step >= 3 && index === 2)} key={name}><small>ZONE 0{index + 1}</small><strong>{name}</strong><p>{detail}</p>{index === 0 && <div className={styles.iaCard}>API 密钥</div>}</div>)}</div><div className={styles.iaReadout} role="status"><strong>{title}</strong><span>当前变化：{step === 0 ? "先承认孤立" : step === 1 ? "按内容职责分区" : step === 2 ? "按真实任务补入口" : step === 3 ? "把用户用词接到正文" : "同一正文从多个入口被找到"}</span></div></div><div className={styles.lessonStatus} role="status"><strong>信息架构改变的是“去哪里找”的预测</strong><span>标题、标签、搜索词、交叉链接和站点地图共同构成架构；不要用内部团队分工替代用户任务。</span></div></div>;
}

export function A11yLesson() {
  const [focus, setFocus] = useState(0);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const targets = useRef<Array<HTMLElement | null>>([]);
  const stages = ["进入页面", "到达邮箱", "按顺序移动", "收到错误", "回到问题处", "完成登录"];
  const fields = ["跳到正文", "邮箱", "密码", "登录按钮", "结果"];
  const current = stages[step];
  function focusTarget(index: number) {
    setFocus(index);
    targets.current[index]?.focus();
  }
  function move(delta: number) {
    const next = Math.max(0, Math.min(fields.length - 1, focus + delta));
    focusTarget(next);
    if (next === 0) setStep(0);
    else if (next === 1) setStep(email ? 4 : 1);
    else if (next >= 2 && next < 4) setStep(2);
    else if (next === 4) setStep(5);
  }
  function submit() {
    if (!email) {
      setError(true);
      setSuccess(false);
      setStep(3);
      focusTarget(3);
      return;
    }
    setError(false);
    setSuccess(true);
    setStep(5);
    focusTarget(4);
  }
  function goStage(next: number) {
    setStep(next);
    if (next === 0) { setError(false); setSuccess(false); focusTarget(0); }
    if (next === 1) { setError(false); setSuccess(false); focusTarget(1); }
    if (next === 2) { setError(false); setSuccess(false); focusTarget(3); }
    if (next === 3) { setEmail(""); setError(true); setSuccess(false); focusTarget(3); }
    if (next === 4) { setEmail("name@example.com"); setError(false); setSuccess(false); focusTarget(1); }
    if (next === 5) { setEmail("name@example.com"); setError(false); setSuccess(true); focusTarget(4); }
  }
  return <div className={styles.lesson} role="region" aria-label="无障碍键盘焦点轨迹演示"><LessonTop label="不用鼠标" title="焦点要看得见，也要能回到问题处" onReset={() => { setFocus(0); setStep(0); setEmail(""); setError(false); setSuccess(false); }} resetLabel="重置无障碍演示" /><Controls labels={stages} value={step} onChange={goStage} ariaLabel="无障碍登录阶段" /><div className={styles.lessonControls} role="group" aria-label="键盘焦点操作"><button type="button" onClick={() => move(-1)}>Shift + Tab</button><button type="button" onClick={() => move(1)}>Tab</button><button type="button" onClick={() => { setEmail(""); setError(true); setSuccess(false); setStep(3); focusTarget(3); }}>提交空邮箱</button><button type="button" onClick={() => { setEmail("name@example.com"); setError(false); setSuccess(false); setStep(4); focusTarget(1); }}>修正邮箱</button><button type="button" onClick={submit}>再次登录</button></div><div className={styles.a11yBoard}><div className={styles.a11yForm}><div className={styles.a11yField} data-focus={focus === 0}><label>跳到正文</label><button ref={element => { targets.current[0] = element; }} className={styles.a11ySubmit} type="button" onClick={() => focusTarget(1)}>跳过导航</button></div><div className={styles.a11yField} data-focus={focus === 1} data-error={error}><label htmlFor="a11y-email">邮箱</label><input ref={element => { targets.current[1] = element; }} id="a11y-email" type="email" aria-label="邮箱" aria-invalid={error} value={email} onChange={event => { setEmail(event.target.value); setError(false); setSuccess(false); setStep(4); }} /></div><div className={styles.a11yField} data-focus={focus === 2}><label htmlFor="a11y-password">密码</label><input ref={element => { targets.current[2] = element; }} id="a11y-password" type="password" aria-label="密码" value="password" readOnly /></div><div className={styles.a11yField} data-focus={focus === 3}><label>登录按钮</label><button ref={element => { targets.current[3] = element; }} className={styles.a11ySubmit} type="button" onClick={submit}>登录</button></div>{error && <div className={styles.a11yError} role="alert">邮箱：请输入有效地址</div>}<div ref={element => { targets.current[4] = element; }} className={styles.a11yResult} data-focus={focus === 4} role="status" tabIndex={-1}>{success ? "已登录 · 前往账户" : "等待结果"}</div></div><div className={styles.a11yReadout} role="status"><small>FOCUS TRACE</small><strong>{current}</strong><p>{error ? "错误文字指出字段，修正后焦点回到邮箱。" : success ? "结果文字和焦点共同说明登录已完成。" : "当前焦点有可见环，Tab 顺序和视觉阅读顺序一致。"}</p><span className={styles.a11yKey}><Keyboard size={15} aria-hidden="true" /><kbd>{focus === 0 ? "Tab" : "Tab / Shift+Tab"}</kbd></span></div></div><div className={styles.lessonStatus} role="status"><strong>{error ? "恢复路径：错误 → 邮箱 → 再提交" : success ? "成功路径：提交 → 结果" : "焦点不是光标装饰，而是下一步的方向"}</strong><span>ARIA 角色不会自动补上焦点、Enter/Space 行为和状态；颜色也不能独自承担错误和成功的含义。</span></div></div>;
}
