"use client";

import { ArrowCounterClockwise, ArrowRight, Check, CheckCircle, Brain, Circuitry, Clock, Database, FileCode, Keyboard, Lightning, Package, ShieldCheck, Stack, Timer, WarningCircle, Wrench } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./Vbp096ExpansionHeroes.module.css";

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

export function DebounceSignatureHero() {
  const scene = useScene(4);
  const [delay, setDelay] = useState<"short" | "long">("long");
  const events = delay === "long" ? ["你", "你想", "你想搜"] : ["你", "你想", "你想搜"];
  const sent = scene.step >= 3 ? 1 : scene.step >= 2 ? 0 : scene.step;
  return <figure ref={scene.ref} className={styles.frame} data-kind="debounce" data-step={scene.step} aria-label="防抖把连续输入合并成一次动作">
    <Header eyebrow="连续按键，不等于连续请求" meta={delay === "long" ? "300 ms quiet" : "50 ms quiet"} />
    <SceneControls scene={scene} labels={["收到输入", "重新计时", "等安静窗口", "只发一次"]} />
    <div className={styles.controls} role="group" aria-label="切换防抖等待窗口"><button type="button" aria-pressed={delay === "long"} onClick={() => { setDelay("long"); scene.seek(0); }}><Clock size={15} />等 300ms</button><button type="button" aria-pressed={delay === "short"} onClick={() => { setDelay("short"); scene.seek(0); }}><Lightning size={15} />等 50ms</button></div>
    <div className={styles.debounceBoard}><div className={styles.eventRail}><span>输入事件</span>{events.map((event, index) => <b key={event} data-active={scene.step >= index}>{event}<small>{index + 1}</small></b>)}</div><div className={styles.timerDial} data-active={scene.step >= 1}><Timer size={22} /><strong>{scene.step === 3 ? "0 ms" : scene.step >= 2 ? "300 ms" : "计时中"}</strong><small>{scene.step >= 2 ? "窗口没有被新输入打断" : "新输入会重置计时"}</small></div><div className={styles.debounceResult} data-good={scene.step === 3}><Keyboard size={18} /><span>发送给搜索</span><strong>{sent} 次</strong><small>{scene.step === 3 ? "只带着最后一个值" : "等待稳定"}</small></div></div>
    <div className={styles.status} role="status"><strong>{scene.step < 2 ? "每次输入都在重置窗口" : scene.step === 2 ? "安静窗口开始" : "一次请求代表最终输入"}</strong><span>{delay === "long" ? "适合搜索框这类连续输入。" : "窗口更短，响应更快，也更容易多发请求。"}</span></div>
    <figcaption>防抖不是节流：它等一段没有新事件的时间，只把最后一次变化交给后续动作。</figcaption>
  </figure>;
}


export function OptimisticUpdateSignatureHero() {
  const scene = useScene(4);
  const [outcome, setOutcome] = useState<"pass" | "fail">("pass");
  const failed = outcome === "fail";
  return <figure ref={scene.ref} className={styles.frame} data-kind="optimistic" data-step={scene.step} aria-label="乐观更新先改变本地界面，再等待服务器确认或回滚">
    <Header eyebrow="先让手感跟上，再等服务器回话" meta={failed ? "rollback path" : "confirmed path"} />
    <SceneControls scene={scene} labels={["点击操作", "本地先变", "请求在路上", "确认或回滚"]} />
    <div className={styles.controls} role="group" aria-label="切换服务器结果"><button type="button" aria-pressed={!failed} onClick={() => { setOutcome("pass"); scene.seek(0); }}><CheckCircle size={15} />服务器成功</button><button type="button" aria-pressed={failed} onClick={() => { setOutcome("fail"); scene.seek(0); }}><WarningCircle size={15} />服务器失败</button></div>
    <div className={styles.optimisticBoard}><div className={styles.localCard} data-active={scene.step >= 1}><span>本地界面</span><strong>{scene.step >= 1 ? "★ 已收藏" : "☆ 收藏"}</strong><small>{scene.step >= 1 ? "先更新，用户立刻看到" : "等待点击"}</small></div><ArrowRight size={20} className={styles.boardArrow} /><div className={styles.serverCard} data-active={scene.step >= 2} data-danger={failed && scene.step === 3}><span>服务器</span><strong>{scene.step < 2 ? "未确认" : scene.step === 3 && failed ? "拒绝" : "保存中"}</strong><small>{scene.step === 3 ? failed ? "权限不足" : "200 OK" : "POST /favorite"}</small></div><div className={styles.optimisticOutcome} data-danger={failed && scene.step === 3}>{failed && scene.step === 3 ? <ArrowCounterClockwise size={19} /> : <Check size={19} />}<span>{scene.step === 3 ? failed ? "恢复 ☆，并解释原因" : "保持 ★，状态已确认" : "等待最终结果"}</span></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "动作还没有发生" : scene.step === 1 ? "局部状态先变" : scene.step === 2 ? "网络请求不能被假装完成" : failed ? "回滚是显式的失败路径" : "确认后才成为服务端事实"}</strong><span>{failed ? "乐观更新必须保存旧值和失败后的恢复动作。" : "速度变快不等于服务器已接受，更不等于没有冲突。"}</span></div>
    <figcaption>乐观更新把“用户先看到什么”和“服务器最终确认什么”分成两条时间线，失败时要能回到可解释的旧状态。</figcaption>
  </figure>;
}

export function CircuitBreakerSignatureHero() {
  const scene = useScene(4);
  const [failure, setFailure] = useState<"healthy" | "down">("down");
  const down = failure === "down";
  const state = !down ? "CLOSED" : scene.step < 1 ? "CLOSED" : scene.step < 3 ? "OPEN" : "HALF-OPEN";
  return <figure ref={scene.ref} className={styles.frame} data-kind="breaker" data-step={scene.step} aria-label="熔断器在连续失败后打开，冷却后用探针恢复">
    <Header eyebrow="失败太密时，先别把请求继续砸过去" meta={state} />
    <SceneControls scene={scene} labels={["正常通过", "连续失败", "打开冷却", "探针恢复"]} />
    <div className={styles.controls} role="group" aria-label="切换下游服务状态"><button type="button" aria-pressed={!down} onClick={() => { setFailure("healthy"); scene.seek(0); }}><CheckCircle size={15} />下游正常</button><button type="button" aria-pressed={down} onClick={() => { setFailure("down"); scene.seek(0); }}><WarningCircle size={15} />下游故障</button></div>
    <div className={styles.breakerBoard}><div className={styles.breakerRequests}><span>请求</span>{["A", "B", "C", "D"].map((item, index) => <b key={item} data-muted={down && scene.step >= 2} data-active={scene.step === 0 || scene.step === 3 && index === 0}>{item}<small>{down && scene.step >= 1 ? index < 2 ? "失败" : "拒绝" : "通过"}</small></b>)}</div><div className={styles.breakerSwitch} data-state={state}><Circuitry size={24} /><strong>{state}</strong><small>{state === "CLOSED" ? "请求可以到达下游" : state === "OPEN" ? "快速失败，保护下游" : "只放一个探针"}</small></div><div className={styles.downstream} data-danger={down}><Database size={21} /><span>支付服务</span><strong>{down ? "503" : "200"}</strong><small>{down ? "连接失败" : "可响应"}</small></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "正常路径" : scene.step === 1 ? "失败计数开始累积" : scene.step === 2 ? "熔断器把失败变成快速拒绝" : down ? "探针成功才允许半开回收" : "服务健康，保持闭合"}</strong><span>{down ? "熔断器保护的是依赖和调用方的恢复空间，不会修好下游。" : "恢复后仍需用探针确认，而不是靠时间猜测。"}</span></div>
    <figcaption>熔断器把反复失败后的等待、拒绝和探测分开，避免每个调用方各自重试把故障放大。</figcaption>
  </figure>;
}

export function DataContractSignatureHero() {
  const scene = useScene(4);
  const [change, setChange] = useState<"add" | "rename">("add");
  const breaking = change === "rename";
  return <figure ref={scene.ref} className={styles.frame} data-kind="contract" data-step={scene.step} aria-label="数据契约检查生产者和消费者之间的字段兼容性">
    <Header eyebrow="字段改变前，先问谁在依赖它" meta={breaking ? "breaking change" : "compatible add"} />
    <SceneControls scene={scene} labels={["发布 v1", "消费者读取", "提出 v2", "契约裁决"]} />
    <div className={styles.controls} role="group" aria-label="切换字段变化"><button type="button" aria-pressed={!breaking} onClick={() => { setChange("add"); scene.seek(0); }}><Check size={15} />新增可选字段</button><button type="button" aria-pressed={breaking} onClick={() => { setChange("rename"); scene.seek(0); }}><WarningCircle size={15} />直接改名</button></div>
    <div className={styles.contractBoard}><div className={styles.schemaCard}><FileCode size={20} /><span>生产者 · v{scene.step >= 2 ? "2" : "1"}</span><strong>{scene.step >= 2 ? breaking ? "user_id" : "email + locale" : "email"}</strong><small>{scene.step >= 2 ? breaking ? "email 被移除" : "旧字段仍保留" : "契约已发布"}</small></div><ArrowRight size={20} className={styles.boardArrow} /><div className={styles.consumerCard}><Package size={20} /><span>消费者</span><strong>{scene.step >= 1 ? "读取 email" : "等待数据"}</strong><small>{scene.step >= 3 && breaking ? "读取失败" : "字段仍可用"}</small></div><div className={styles.contractGate} data-danger={breaking && scene.step === 3}>{breaking && scene.step === 3 ? <WarningCircle size={20} /> : <ShieldCheck size={20} />}<strong>{scene.step < 3 ? "检查中" : breaking ? "BLOCK" : "PASS"}</strong><small>{scene.step === 3 ? breaking ? "必须迁移或双写" : "允许兼容发布" : "对照生产契约"}</small></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "先冻结双方共同语言" : scene.step === 1 ? "消费者依赖旧字段" : scene.step === 2 ? "新版本正在提出变化" : breaking ? "改名不是无害重构" : "新增可选字段可向后兼容"}</strong><span>{breaking ? "契约让破坏性变化在发布前暴露。" : "兼容性来自保留旧语义和明确默认值。"}</span></div>
    <figcaption>数据契约把“生产者能发什么”和“消费者能读什么”写成可检查的约定，变化先经过兼容性闸门。</figcaption>
  </figure>;
}

export function ContextCompactionSignatureHero() {
  const scene = useScene(4);
  const compacted = scene.step >= 3;
  return <figure ref={scene.ref} className={styles.frame} data-kind="compaction" data-step={scene.step} aria-label="上下文压缩保留目标和未完成动作，释放有限容量">
    <Header eyebrow="上下文满了，先决定什么不能丢" meta={compacted ? "11k / 24k" : scene.step >= 1 ? "26k / 24k" : "8k / 24k"} />
    <SceneControls scene={scene} labels={["装入对话", "顶到容量线", "标记关键事实", "压缩再核对"]} />
    <div className={styles.contextBoard}><div className={styles.contextTray}><span>有限托盘</span><div className={styles.contextPieces}>{["系统目标", "旧对话", "工具回执", "未完成动作"].map((item, index) => <b key={item} data-kept={index === 0 || index === 3 || (compacted && index === 2)} data-muted={compacted && index === 1}>{compacted && index === 1 ? "旧对话摘要" : item}</b>)}</div><div className={styles.capacity}><i><b data-fill={scene.step >= 1 ? "full" : compacted ? "half" : "low"} /></i><strong>{compacted ? "11k" : scene.step >= 1 ? "26k" : "8k"} / 24k</strong></div></div><div className={styles.contextAction} data-danger={scene.step === 2}><Stack size={23} /><strong>{scene.step < 2 ? "继续装入" : scene.step === 2 ? "先标记不能丢的东西" : "压缩旧对话"}</strong><small>{scene.step === 2 ? "目标 · 证据 · 未完成动作" : compacted ? "摘要留下可继续执行的状态" : "输出位置也要留空间"}</small></div><div className={styles.contextResult} data-good={compacted}><CheckCircle size={19} /><span>{compacted ? "任务边界仍然可见" : "还没有重新核对"}</span></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "每一段材料都占容量" : scene.step === 1 ? "溢出不是模型突然失忆" : scene.step === 2 ? "压缩前先标记保留物" : "释放空间后重新核对"}</strong><span>{compacted ? "摘要只能保留被明确选中的目标、证据和动作。" : "不要把所有历史都当成同等重要。"}</span></div>
    <figcaption>上下文压缩不是随便删文字，而是先划出任务边界，再缩短旧材料并检查关键状态有没有留下。</figcaption>
  </figure>;
}

export function ToolSchemaSignatureHero() {
  const scene = useScene(4);
  const [invalid, setInvalid] = useState(false);
  return <figure ref={scene.ref} className={styles.frame} data-kind="tool-schema" data-step={scene.step} aria-label="工具 schema 让模型请求先经过参数校验再执行">
    <Header eyebrow="模型可以提议动作，参数要先过契约" meta={invalid ? "invalid args" : "schema v1"} />
    <SceneControls scene={scene} labels={["提出调用", "对照 schema", "校验参数", "执行或拒绝"]} />
    <div className={styles.controls} role="group" aria-label="切换工具参数状态"><button type="button" aria-pressed={!invalid} onClick={() => { setInvalid(false); scene.seek(0); }}><Check size={15} />参数有效</button><button type="button" aria-pressed={invalid} onClick={() => { setInvalid(true); scene.seek(0); }}><WarningCircle size={15} />缺少必填项</button></div>
    <div className={styles.toolBoard}><div className={styles.toolCall}><Brain size={21} /><span>模型提议</span><code>get_weather(city: {invalid ? "?" : '"上海"'})</code><small>{scene.step >= 1 ? "结构化参数" : "草稿"}</small></div><ArrowRight size={20} className={styles.boardArrow} /><div className={styles.validator} data-active={scene.step >= 1} data-danger={invalid && scene.step >= 2}><ShieldCheck size={21} /><span>schema validator</span><strong>{scene.step < 2 ? "等待检查" : invalid ? "缺少 city" : "通过"}</strong><small>{scene.step >= 1 ? "type=string · required" : "先读契约"}</small></div><ArrowRight size={20} className={styles.boardArrow} /><div className={styles.toolExecution} data-good={scene.step === 3 && !invalid} data-danger={scene.step === 3 && invalid}><Wrench size={21} /><span>工具</span><strong>{scene.step < 3 ? "未执行" : invalid ? "拒绝调用" : "返回 24°C"}</strong><small>{scene.step === 3 && invalid ? "不会把猜测传给外部系统" : "副作用在闸门之后"}</small></div></div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "请求还只是提议" : scene.step === 1 ? "schema 说明形状" : scene.step === 2 ? invalid ? "校验发现缺少参数" : "参数满足契约" : invalid ? "拒绝比错误执行更安全" : "工具得到可执行输入"}</strong><span>{invalid ? "schema 不能证明业务授权，但能先挡住结构错误。" : "结构校验通过后仍要检查权限、超时和外部结果。"}</span></div>
    <figcaption>工具 schema 把模型输出变成可检查的调用请求；它约束参数形状，不代替授权和业务判断。</figcaption>
  </figure>;
}
