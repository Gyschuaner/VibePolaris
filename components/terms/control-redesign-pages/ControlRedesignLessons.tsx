"use client";

import { useState, type ReactNode } from "react";
import styles from "./ControlRedesignConcepts.module.css";

function LessonShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className={styles.toolLesson} aria-label={title}><div className={styles.lessonHeader}><small>{eyebrow}</small><strong>{title}</strong></div>{children}</section>;
}

export function BranchLesson() {
  const [score, setScore] = useState(59);
  const passed = score >= 60;
  return <LessonShell eyebrow="改一个输入，观察令牌换道" title="阈值闸门"><div className={styles.lessonControls}><label htmlFor="branch-score">score {score}</label><input id="branch-score" aria-label="score" type="range" min="0" max="100" value={score} onChange={event => setScore(Number(event.target.value))}/><button type="button" onClick={() => setScore(59)}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>条件</span><code>score &gt;= 60</code><em>{passed ? "true" : "false"}</em></div><div className={styles.labRow}><span>选中路径</span><code>{passed ? "通过" : "未通过"}</code><em>另一条未执行</em></div></div><p className={styles.labWarning}><strong>{passed ? "60 是包含在内的边界。" : "59 还没过闸门。"}</strong> 分支先求值，再让令牌只进入一条路径。</p></LessonShell>;
}

export function LoopLesson() {
  const [step, setStep] = useState(0);
  const [freeze, setFreeze] = useState(false);
  const values = [2, 4, 6];
  const index = Math.min(step, values.length);
  const sum = values.slice(0, index).reduce((total, value) => total + value, 0);
  return <LessonShell eyebrow="每一步都必须让状态向出口靠近" title="传送带上的循环"><div className={styles.lessonControls}><button type="button" onClick={() => setStep(current => freeze ? current : Math.min(current + 1, values.length))}>{step >= values.length ? "已停止" : "单步执行"}</button><button type="button" aria-pressed={freeze} onClick={() => setFreeze(current => !current)}>{freeze ? "解除卡住" : "冻结索引"}</button><button type="button" onClick={() => { setStep(0); setFreeze(false); }}>重置</button></div><div className={styles.loopLessonCells}>{values.map((value, itemIndex) => <div className={styles.lessonCell} data-active={itemIndex === index} key={value}>{value}</div>)}</div><div className={styles.labStatus}><span>索引 {index} / length 3</span><strong>累计 {sum}</strong><span>{freeze ? "警告：索引没有推进" : step >= values.length ? "停止条件成立" : "还有下一项"}</span></div></LessonShell>;
}

export function ObjectLesson() {
  const [record, setRecord] = useState<Record<string, string>>({ name: "林", age: "20" });
  const [flash, setFlash] = useState("age");
  const update = (next: Record<string, string>, key: string) => { setRecord(next); setFlash(key); };
  return <LessonShell eyebrow="键是入口，值是当前状态" title="键值抽屉"><div className={styles.lessonControls}><button type="button" onClick={() => update({ ...record, city: "杭州" }, "city")}>新增 city</button><button type="button" onClick={() => update({ ...record, age: "21" }, "age")}>修改 age</button><button type="button" onClick={() => { const next = { ...record }; delete next.city; update(next, "city"); }}>删除 city</button><button type="button" onClick={() => { setRecord({ name: "林", age: "20" }); setFlash("age"); }}>重置</button></div><div className={styles.objectTable}>{Object.entries(record).map(([key, value]) => <div className={styles.labRow} data-hot={flash === key} key={key}><span>{key}</span><code>{value}</code><em>属性</em></div>)}</div><p className={styles.labWarning}><strong>对象当前有 {Object.keys(record).length} 个具名属性。</strong> 它可以装运行时状态和方法，不等于一段 JSON 文本。</p></LessonShell>;
}

export function ArrayLesson() {
  const [position, setPosition] = useState(1);
  const [items, setItems] = useState(["A", "B", "C"]);
  const insert = () => setItems(current => current.includes("X") ? current : [...current.slice(0, position), "X", ...current.slice(position)]);
  return <LessonShell eyebrow="插入一个格子，后面的索引一起改写" title="数组插入位"><div className={styles.lessonControls}><label htmlFor="array-position">插入索引</label><select id="array-position" aria-label="插入索引" value={position} onChange={event => setPosition(Number(event.target.value))}><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select><button type="button" onClick={insert}>插入 X</button><button type="button" onClick={() => setItems(["A", "B", "C"])}>重置</button></div><div className={styles.arrayLessonCells}>{items.map((item, index) => <div className={styles.lessonCell} data-insert={item === "X"} key={`${item}-${index}`}>{item}<small>{index}</small></div>)}</div><div className={styles.labStatus}><span>长度 {items.length}</span><strong>{items.join(" · ")}</strong><span>{items.length === 4 ? `原来的 B 从 1 移到 ${items.indexOf("B")}` : "等待插入"}</span></div></LessonShell>;
}

export function ClientServerLesson() {
  const [status, setStatus] = useState("200");
  const stages = ["封装请求", "服务器拆封", "封回响应", "客户端呈现"];
  return <LessonShell eyebrow="同一个信封，状态码可以改变结局" title="请求信封翻面"><div className={styles.lessonControls}><label htmlFor="client-status-control">响应状态</label><select id="client-status-control" aria-label="响应状态" value={status} onChange={event => setStatus(event.target.value)}><option value="200">200 · 成功</option><option value="404">404 · 找不到</option><option value="500">500 · 服务器错误</option></select><button type="button" onClick={() => setStatus("200")}>重置</button></div><div className={styles.clientStages}>{stages.map((stage, index) => <div className={styles.clientStage} data-active="true" key={stage}>{index + 1} · {stage}</div>)}</div><div className={styles.labStatus}><span>客户端收到</span><strong>{status}</strong><span>{status === "200" ? "呈现资源" : status === "404" ? "显示未找到" : "保留错误并可重试"}</span></div></LessonShell>;
}

export function MonolithLesson() {
  const [module, setModule] = useState("支付");
  const [rebuilt, setRebuilt] = useState(false);
  return <LessonShell eyebrow="内部可以分模块，发布边界仍是一整包" title="整包发布闸门"><div className={styles.moduleChoices}>{["用户", "订单", "支付"].map(item => <button type="button" aria-pressed={module === item} onClick={() => { setModule(item); setRebuilt(false); }} key={item}>{item}</button>)}</div><div className={styles.labGrid}><div className={styles.labRow}><span>改动</span><code>{module} 模块</code><em>局部编辑</em></div><div className={styles.labRow}><span>发布</span><code>{rebuilt ? "整包 v2 已发布" : "等待整包重建"}</code><em>{rebuilt ? "所有模块一起换上" : "不能只换一格"}</em></div></div><div className={styles.lessonControls}><button type="button" onClick={() => setRebuilt(true)}>重建并测试整包</button><button type="button" onClick={() => { setModule("支付"); setRebuilt(false); }}>重置</button></div></LessonShell>;
}

export function MicroservicesLesson() {
  const [failure, setFailure] = useState(false);
  const [stage, setStage] = useState(0);
  const stages = ["各自就绪", "订单发请求", "等待库存", "保存处理中"];
  const services: Array<[string, boolean]> = [["订单", false], ["库存", failure], ["支付", false]];
  return <LessonShell eyebrow="独立发布换来独立故障边界" title="服务舱的等待"><div className={styles.lessonControls}><button type="button" aria-pressed={failure} onClick={() => { setFailure(current => !current); setStage(0); }}>{failure ? "恢复库存" : "让库存超时"}</button><button type="button" onClick={() => setStage(current => Math.min(current + 1, stages.length - 1))}>{stage >= stages.length - 1 ? "已落盘" : "推进一步"}</button><button type="button" onClick={() => { setFailure(false); setStage(0); }}>重置</button></div><div className={styles.serviceGrid}>{services.map(([name, down]) => <div className={styles.serviceCard} data-down={down} key={name}><strong>{name}</strong><span>{down ? "2 秒无回应" : "独立 v1.4"}</span></div>)}</div><div className={styles.labStatus}><span>当前阶段</span><strong>{stages[stage]}</strong><span>{failure && stage >= 2 ? "订单只能保留处理中" : "网络仍然是协作成本"}</span></div></LessonShell>;
}

export function DistributedLesson() {
  const [delay, setDelay] = useState(500);
  const [conflict, setConflict] = useState(false);
  const [merged, setMerged] = useState(false);
  return <LessonShell eyebrow="两只时钟都走，却没有同一瞬间" title="延迟造成的分叉"><div className={styles.lessonControls}><label htmlFor="distributed-delay-control">网络延迟 {delay}ms</label><input id="distributed-delay-control" aria-label="网络延迟" type="range" min="0" max="1000" step="100" value={delay} onChange={event => setDelay(Number(event.target.value))}/><button type="button" onClick={() => { setConflict(true); setMerged(false); }}>同时写入</button><button type="button" onClick={() => setMerged(true)} disabled={!conflict}>按规则合并</button><button type="button" onClick={() => { setDelay(500); setConflict(false); setMerged(false); }}>重置</button></div><div className={styles.clockGrid}><div className={styles.clockCard}>A · {conflict ? "v2a · 7" : "v1 · 10"}</div><div className={styles.clockCard}>B · {conflict ? "v2b · 6" : "v1 · 10"}</div></div><div className={styles.labStatus}><span>消息延迟</span><strong>{delay} ms</strong><span>{merged ? "冲突按显式规则收束" : conflict ? "同一版本出现两个后继" : "共享起点"}</span></div></LessonShell>;
}

export function EventDrivenLesson() {
  const [published, setPublished] = useState(false);
  const [replayed, setReplayed] = useState(false);
  return <LessonShell eyebrow="同一事实扇出，副作用各自去重" title="事件重放闸门"><div className={styles.lessonControls}><button type="button" onClick={() => setPublished(true)}>发布 OrderCreated E7</button><button type="button" onClick={() => setReplayed(true)} disabled={!published}>重放 E7</button><button type="button" onClick={() => { setPublished(false); setReplayed(false); }}>重置</button></div><div className={styles.eventCounts}><div className={styles.eventCount}>库存消费者<strong>{published ? "扣减 1 次" : "—"}</strong></div><div className={styles.eventCount}>邮件消费者<strong>{replayed ? "仍为 1 次" : published ? "发送 1 次" : "—"}</strong></div></div><div className={styles.labStatus}><span>事件 id</span><strong>E7</strong><span>{replayed ? "幂等记录命中，重复副作用被挡住" : published ? "一份事实，两份订阅" : "尚未发布"}</span></div></LessonShell>;
}

export function ServerlessLesson() {
  const [rate, setRate] = useState(0);
  const instances = Math.min(6, Math.ceil(rate / 20));
  const cold = rate > 0;
  return <LessonShell eyebrow="平台按请求峰谷准备和回收运行环境" title="弹性实例架"><div className={styles.lessonControls}><label htmlFor="serverless-rate">请求速率 {rate} / 分钟</label><input id="serverless-rate" aria-label="请求速率" type="range" min="0" max="120" step="10" value={rate} onChange={event => setRate(Number(event.target.value))}/><button type="button" onClick={() => setRate(0)}>重置</button></div><div className={styles.instanceRow}>{Array.from({ length: instances }, (_, index) => <div className={styles.instancePill} key={index}>f{index + 1}</div>)}{instances === 0 && <span className={styles.labWarning}>空闲，没有运行中的函数</span>}</div><div className={styles.rateReadout}><span>首次准备环境</span><strong>{cold ? "示例 +420ms" : "未发生"}</strong><span>{instances} 份运行环境</span></div><p className={styles.labWarning}><strong>服务器仍然存在。</strong> 平台接管的是准备、扩缩和回收；代码、配置、状态和计费边界仍要由团队负责。</p></LessonShell>;
}
