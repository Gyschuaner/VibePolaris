"use client";

import { useState, type ReactNode } from "react";
import { Archive, ArrowDown, ArrowRight, ArrowsClockwise, Broadcast, CheckCircle, Clock, Code, Cube, CurrencyCircleDollar, Database, FileText, FlowArrow, Flask, Funnel, GitBranch, ListChecks, LockSimple, MagnifyingGlass, MapPin, Pulse, Scales, ShieldCheck, TreeStructure, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./DataTestSignatureHeroes.module.css";

type Scene = ReturnType<typeof useScene>;
type Icon = typeof CheckCircle;

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

function Result({ icon: IconComponent, title, detail, danger = false }: { icon: Icon; title: string; detail: string; danger?: boolean }) {
  return <div className={styles.result} data-danger={danger} role="status"><IconComponent size={19} aria-hidden="true" /><span><strong>{title}</strong> · {detail}</span></div>;
}

function Frame({ label, eyebrow, meta, scene, steps, children, result, caption, controls }: { label: string; eyebrow: string; meta: string; scene: Scene; steps: string[]; children: ReactNode; result: { icon: Icon; title: string; detail: string; danger?: boolean }; caption: string; controls?: ReactNode }) {
  return <figure ref={scene.ref} className={styles.frame} data-step={scene.step} aria-label={label}>
    <Header eyebrow={eyebrow} meta={meta} />
    {controls}
    <SceneControls scene={scene} labels={steps} />
    {children}
    <Result {...result} />
    <figcaption>{caption}</figcaption>
  </figure>;
}

const ingestionSteps = ["读到来源", "放进暂存", "写入原始层", "确认位置"];

export function DataIngestionSignatureHero() {
  const scene = useScene(ingestionSteps.length);
  const [replayed, setReplayed] = useState(false);
  const step = replayed ? 3 : scene.step;
  const result = replayed
    ? { icon: ArrowsClockwise, title: "从旧位置重读", detail: "loan-1 / loan-2 已去重，坏记录仍在隔离区", danger: false }
    : [
      { icon: FileText, title: "来源还没被确认", detail: "读到记录不等于它已经可靠写入" },
      { icon: ArrowDown, title: "先放进暂存篮", detail: "写入失败时 checkpoint 不前移" },
      { icon: Archive, title: "原始层留下记录", detail: "确认位置仍等待保存" },
      { icon: CheckCircle, title: "确认后才可跳过", detail: "checkpoint=2，下一次从第 3 条继续" },
    ][scene.step];
  return <Frame label="数据接入先写入原始层，再保存确认位置；重启会从旧位置重读并去重" eyebrow="先保存事实，再移动读取位置" meta="source → raw → checkpoint" scene={scene} steps={ingestionSteps} result={result} caption="数据接入的进度有两根线：记录是否已可靠落地，来源位置是否已经确认。把确认位置提前会漏数据，落地后暂不确认则会重放，所以稳定 ID 和去重是恢复的一部分。" controls={<div className={styles.inlineControls} role="group" aria-label="数据接入恢复操作"><button type="button" aria-pressed={replayed} onClick={() => { setReplayed(value => !value); scene.seek(3); }}><ArrowsClockwise size={15} />{replayed ? "回到首次接入" : "断开并恢复"}</button></div>}>
    <div className={styles.ingestionBoard} data-replayed={replayed}>
      <div className={styles.ingestionSource}><span>来源日志</span>{["loan-1", "loan-2", "loan-3"].map((item, index) => <div key={item} data-active={step === 0 && index < 2 || step >= 1 && index < (replayed ? 2 : step >= 3 ? 2 : 2)} data-duplicate={replayed && index < 2}><FileText size={16} /><code>{item}</code><small>{replayed && index < 2 ? "重读" : `pos ${index + 1}`}</small></div>)}</div>
      <div className={styles.ingestionArrow} aria-hidden="true"><span /><ArrowDown size={21} /></div>
      <div className={styles.ingestionRaw}><span>原始层</span><div className={styles.rawRows}><b data-visible={step >= 2}>loan-1</b><b data-visible={step >= 2}>loan-2</b><b data-visible={step >= 3}>loan-3</b></div><small>{replayed ? "重复 ID 被挡住" : step >= 2 ? "原值保留" : "等待写入"}</small></div>
      <div className={styles.ingestionCheckpoint}><div><GitBranch size={18} /><span>checkpoint</span></div><strong>{replayed ? "2 · 重放" : step >= 3 ? "2 · 已确认" : step >= 2 ? "0 · 未保存" : "—"}</strong><small>{replayed ? "从位置 2 继续读" : step >= 3 ? "下一批从 3 开始" : "写入还没获得确认"}</small></div>
    </div>
  </Frame>;
}

const pipelineSteps = ["锁定快照", "并行前置", "下游被挡", "只重跑受影响"];

export function DataPipelineSignatureHero() {
  const scene = useScene(pipelineSteps.length);
  const [quarantine, setQuarantine] = useState(false);
  const step = scene.step;
  const validated = step >= 3 || (quarantine && step >= 2);
  const archived = step >= 1;
  const aggregated = validated && step >= 3;
  const published = aggregated && step >= 3;
  const result = step === 0
    ? { icon: MapPin, title: "先钉住输入", detail: "run-42 只读取快照 s1，不追着最新数据跑" }
    : step === 1
      ? { icon: TreeStructure, title: "两条前置各走各的", detail: "校验失败不会抹掉原始归档" }
      : !quarantine
        ? { icon: WarningCircle, title: "q1 把下游挡住", detail: "汇总与发布都没有拿到可用前置", danger: true }
        : { icon: CheckCircle, title: "q2 隔离后再发布", detail: "3 条参与汇总，1 条带着原因留在隔离区" };
  return <Frame label="数据管道把同一批输入分给独立前置，失败只阻断依赖它的下游" eyebrow="一批输入，多个依赖，单次发布" meta="snapshot → DAG → publish" scene={scene} steps={pipelineSteps} result={result} caption="这张图关注的是依赖关系：归档只要读到快照就能完成，汇总必须等校验通过，发布还要等汇总和归档同时完成。换规则重跑时，输入快照仍是 s1。" controls={<div className={styles.inlineControls} role="group" aria-label="数据管道校验策略"><button type="button" aria-pressed={quarantine} onClick={() => { setQuarantine(value => !value); scene.seek(2); }}><ShieldCheck size={15} />{quarantine ? "切回严格 q1" : "允许隔离 q2"}</button></div>}>
    <div className={styles.pipelineBoard} data-quarantine={quarantine} data-step={step}>
      <div className={styles.pipelineSnapshot}><MapPin size={17} /><span>输入快照</span><strong>s1 · 4 条</strong><small>run-42 固定读取</small></div>
      <div className={styles.pipelineBranches}>
        <div className={styles.pipelineBranch} data-done={archived}><Archive size={17} /><span>原始归档</span><small>{archived ? "4 条已留存" : "等待读取"}</small></div>
        <div className={styles.pipelineBranch} data-done={validated} data-danger={step === 2 && !quarantine}><Funnel size={17} /><span>校验 q{quarantine ? "2" : "1"}</span><small>{step === 2 && !quarantine ? "r2 缺书目编号" : validated ? "3 条通过 · 1 条隔离" : "等待规则"}</small></div>
      </div>
      <div className={styles.pipelineDownstream}><div data-done={aggregated} data-muted={!validated}><Database size={17} /><span>汇总</span><small>{aggregated ? "42 = 3" : "被校验挡住"}</small></div><div data-done={published} data-muted={!aggregated}><CheckCircle size={17} /><span>发布报表</span><small>{published ? "run-42 · s1 / q2" : "保持 v0"}</small></div></div>
    </div>
  </Frame>;
}

const transformationSteps = ["读原值", "辨单位", "统一表示", "挡住未知"];

export function DataTransformationSignatureHero() {
  const scene = useScene(transformationSteps.length);
  const [resolveUnknown, setResolveUnknown] = useState(false);
  const step = scene.step;
  const known = resolveUnknown || step < 3;
  const converted = step >= 2;
  const result = step === 0
    ? { icon: CurrencyCircleDollar, title: "先把原值摊开", detail: "符号、单位和小数位都还是来源事实" }
    : step === 1
      ? { icon: Scales, title: "单位先说清楚", detail: "A/B 是 CNY 元，C 是 CNY 分，D 仍未知" }
      : step === 2
        ? { icon: CheckCircle, title: "输出同一种表示", detail: "已知金额转成 CNY 整数分，原值仍保留" }
        : known
          ? { icon: CheckCircle, title: "单位补齐后才入账", detail: "D 的 1230 现在按 CNY 分进入合计" }
          : { icon: WarningCircle, title: "未知单位停在待处理", detail: "D 不会被悄悄当成元或分", danger: true };
  return <Frame label="数据转换先识别单位和精度，再把金额统一成整数分；未知单位停在待处理" eyebrow="换表示，不偷换含义" meta="raw → rule v2 → cents" scene={scene} steps={transformationSteps} result={result} caption="转换改变的是表示：A、B、C 可以得到同一种 CNY 整数分，D 没有单位就不能凭空确定。原始值和规则版本一起留下，下一次才能解释这个数字怎样来的。" controls={<div className={styles.inlineControls} role="group" aria-label="数据转换未知单位策略"><button type="button" aria-pressed={resolveUnknown} onClick={() => { setResolveUnknown(value => !value); scene.seek(3); }}><Cube size={15} />{resolveUnknown ? "撤回 D 的单位" : "确认 D = CNY 分"}</button></div>}>
    <div className={styles.transformBoard} data-converted={converted} data-resolved={resolveUnknown}>
      <div className={styles.transformInputs}><span>来源原值</span>{[{ id: "A", raw: "¥12.30", unit: "CNY 元" }, { id: "B", raw: "CNY 12.30", unit: "CNY 元" }, { id: "C", raw: "1230", unit: "CNY 分" }, { id: "D", raw: "1230", unit: resolveUnknown ? "CNY 分" : "未知单位" }].map(row => <div key={row.id} data-unknown={row.id === "D" && !resolveUnknown}><code>{row.id}</code><strong>{row.raw}</strong><small>{step >= 1 ? row.unit : "待识别"}</small></div>)}</div>
      <div className={styles.transformRule}><div><Scales size={18} /><span>规则 v2</span></div><strong>元 × 100 → 分</strong><small>{step >= 2 ? "保留 2 位小数" : "等待单位"}</small></div>
      <div className={styles.transformOutputs}><span>统一输出</span><div className={styles.transformTotal}><strong>{converted ? resolveUnknown ? "4920" : "3690" : "—"}</strong><small>CNY cents</small></div><div className={styles.transformProof}><span>A/B/C</span><code>{converted ? "1230 + 1230 + 1230" : "未计算"}</code></div><div className={styles.transformProof} data-unknown={!resolveUnknown}><span>D</span><code>{resolveUnknown ? "1230 · 已确认" : "? · 暂不合计"}</code></div></div>
    </div>
  </Frame>;
}

const validationSteps = ["看字段类型", "卡住范围", "对照字段关系", "查重复身份"];
const validationRows = [
  { id: "r1", value: "age 24 · city 杭州", failures: [] },
  { id: "r2", value: "age −2 · city 杭州", failures: ["范围"] },
  { id: "r3", value: 'age "24" · city 杭州', failures: ["类型"] },
  { id: "r4", value: "age 31 · loan-07 ×2", failures: ["唯一"] },
] as const;

export function DataValidationSignatureHero() {
  const scene = useScene(validationSteps.length);
  const step = scene.step;
  const checks = ["类型", "范围", "关系", "唯一"];
  const visibleFailures = validationRows.filter(row => row.failures.some(failure => checks.indexOf(failure) <= step));
  const result = step === 0
    ? { icon: ListChecks, title: "先辨认数据长什么样", detail: "字符串 24 不能冒充整数 24" }
    : step === 1
      ? { icon: WarningCircle, title: "范围规则留下 r2", detail: "age=-2 说明字段合法不等于值合理", danger: true }
      : step === 2
        ? { icon: WarningCircle, title: "关系规则继续筛", detail: "跨字段条件和单字段类型各自留下原因", danger: true }
        : { icon: CheckCircle, title: "报告每条失败的原因", detail: `${visibleFailures.length} 条待处理，r1 通过` };
  return <Frame label="数据验证让记录逐层经过类型、范围、跨字段和唯一性检查，并保留具体失败原因" eyebrow="通过哪一关，失败在哪一关" meta="schema → range → relation → unique" scene={scene} steps={validationSteps} result={result} caption="验证结果不是一盏模糊的红灯。每条记录要知道在哪条规则上停下，修复者才知道该改数据、改规则，还是补齐去重身份。" >
    <div className={styles.validationBoard} data-step={step}>
      <div className={styles.validationRecords}><span>待检查记录</span>{validationRows.map(row => { const failed = row.failures.some(failure => checks.indexOf(failure) <= step); return <div key={row.id} data-failed={failed} data-passed={step === 3 && !failed}><code>{row.id}</code><strong>{row.value}</strong><small>{failed ? row.failures.join(" · ") : step === 3 ? "通过" : "等待"}</small></div>; })}</div>
      <div className={styles.validationSieve}>{checks.map((label, index) => <div key={label} data-active={step === index} data-done={step > index}><span>{index + 1}</span><strong>{label}</strong><small>{step > index ? "已检查" : step === index ? "当前规则" : "排队"}</small></div>)}</div>
      <div className={styles.validationReport}><div><Funnel size={17} /><span>报告</span></div><strong>{step === 3 ? "1 pass · 3 hold" : `${Math.max(0, 4 - visibleFailures.length)} 条暂通过`}</strong><div className={styles.validationReasons}>{visibleFailures.length ? visibleFailures.map(row => <code key={row.id}>{row.id}: {row.failures.join(" + ")}</code>) : <code>尚无失败原因</code>}</div></div>
    </div>
  </Frame>;
}

const lineageSteps = ["点开报表格", "找到运行", "展开输入列", "看下游影响"];

export function DataLineageSignatureHero() {
  const scene = useScene(lineageSteps.length);
  const [impact, setImpact] = useState(false);
  const step = scene.step;
  const showColumns = step >= 2;
  const showImpact = impact && step >= 3;
  const result = step === 0
    ? { icon: MagnifyingGlass, title: "先从一个结果问起", detail: "1800 分不是凭空出现的数字" }
    : step === 1
      ? { icon: GitBranch, title: "找到生成它的运行", detail: "run-43 使用规则 v2 处理快照 s1" }
      : step === 2
        ? { icon: Database, title: "展开到实际输入列", detail: "amount 与 discount 都参与 sum(amount − discount)" }
        : { icon: FlowArrow, title: "沿登记关系找影响", detail: showImpact ? "daily.total → monthly.total，共 2 个下游输出" : "打开影响分析，看看谁需要复查" };
  return <Frame label="数据血缘从报表单元展开到实际运行、规则和输入列，再沿关系查看下游影响" eyebrow="从一个数字，沿着关系回到现场" meta="output → run → columns → impact" scene={scene} steps={lineageSteps} result={result} caption="血缘是一条可追溯的关系链：结果对应哪次运行、用了哪个规则、读了哪些列，以及字段变化会波及哪些输出。图上没有一条线，只能说明当前登记范围之外没有证据。" controls={<div className={styles.inlineControls} role="group" aria-label="数据血缘观察模式"><button type="button" aria-pressed={impact} onClick={() => { setImpact(value => !value); scene.seek(3); }}><FlowArrow size={15} />{impact ? "收起影响分析" : "查看下游影响"}</button></div>}>
    <div className={styles.lineageBoard} data-columns={showColumns} data-impact={showImpact}>
      <div className={styles.lineageSource}><span>来源快照 s1</span><div data-active={showColumns}><code>amount</code><strong>1200 · 800</strong></div><div data-active={showColumns}><code>discount</code><strong>200 · 0</strong></div><small>{showColumns ? "两列进入规则 v2" : "点击结果展开"}</small></div>
      <div className={styles.lineageMiddle}><div className={styles.lineageResult}><span>daily.total</span><strong>1800</strong><small>CNY cents · v2</small></div><div className={styles.lineageRun}><GitBranch size={15} /><code>run-43</code><span>sum(amount − discount)</span></div></div>
      <div className={styles.lineageImpact}>{showImpact ? <><span>下游影响</span><div><FlowArrow size={16} /><code>monthly.total</code><small>需要复查</small></div><div><FlowArrow size={16} /><code>finance.dashboard</code><small>依赖日合计</small></div></> : <><span>关系待展开</span><div className={styles.lineageHint}><MapPin size={16} /><small>{step >= 3 ? "点击‘查看下游影响’" : "先走到字段层"}</small></div></>}</div>
    </div>
  </Frame>;
}

const streamSteps = ["收到 t2", "水位到 10", "晚到 t4", "决定结果"];

export function StreamProcessingSignatureHero() {
  const scene = useScene(streamSteps.length);
  const [latePolicy, setLatePolicy] = useState<"side" | "revise">("side");
  const step = scene.step;
  const t4Arrived = step >= 2;
  const watermark = step === 0 ? "—" : step < 3 ? "10" : "20";
  const revised = latePolicy === "revise" && step >= 3;
  const result = step === 0
    ? { icon: Broadcast, title: "先按事件时间记账", detail: "t2 进入 [0,10)，不是按收到顺序猜窗口" }
    : step === 1
      ? { icon: Clock, title: "水位推进，窗口准备关门", detail: "[0,10) 可以先输出 1 次，t4 还没出现" }
      : step === 2
        ? { icon: WarningCircle, title: "t4 到得太晚", detail: latePolicy === "side" ? "送进旁路，已发布窗口不被悄悄改写" : "保留窗口状态，等待修订", danger: true }
        : { icon: revised ? CheckCircle : Pulse, title: revised ? "窗口发布修订版" : "旁路留下待复核事件", detail: revised ? "[0,10) 从 1 次更新到 2 次" : "[0,10)=1 · late side=t4" };
  return <Frame label="流处理用事件时间和水位决定窗口何时输出，晚到事件按策略旁路或修订" eyebrow="记录带着发生时间到来" meta="event time → watermark → window" scene={scene} steps={streamSteps} result={result} caption="水位是在事件时间尺子上向前推进的信号，不是把机器时钟拨快。它决定窗口何时可以给出结果；晚到数据是否旁路、补写还是触发修订，必须由业务策略明确。" controls={<div className={styles.inlineControls} role="group" aria-label="晚到事件处理策略"><button type="button" aria-pressed={latePolicy === "revise"} onClick={() => { setLatePolicy(policy => policy === "side" ? "revise" : "side"); scene.seek(2); }}><Pulse size={15} />{latePolicy === "side" ? "改为窗口修订" : "改为晚到旁路"}</button></div>}>
    <div className={styles.streamBoard} data-policy={latePolicy} data-step={step}>
      <div className={styles.streamArrivals}><div className={styles.streamArrivalHeader}><Broadcast size={17} /><span>到达顺序</span></div>{[{ id: "t2", time: 2 }, { id: "t12", time: 12 }, { id: "t4", time: 4 }].map((event, index) => <div key={event.id} data-arrived={index === 0 ? step >= 0 : index === 1 ? step >= 1 : t4Arrived} data-late={event.id === "t4" && t4Arrived}><code>{event.id}</code><span>发生时刻 {event.time}</span><small>{event.id === "t4" && t4Arrived ? "晚到" : index === 1 && step < 1 ? "等待" : "已到"}</small></div>)}</div>
      <div className={styles.streamMeter}><span>watermark</span><strong>{watermark}</strong><div className={styles.streamTicks}><i data-on={step >= 1} /><i data-on={step >= 3} /></div><small>{step >= 1 ? "第一窗口可结算" : "还在等事件"}</small></div>
      <div className={styles.streamWindows}><div data-closed={step >= 1}><span>[0, 10)</span><strong>{revised ? "2 次" : step >= 1 ? "1 次" : "—"}</strong><small>{revised ? "修订版" : step >= 1 ? "已输出" : "开放"}</small></div><div data-closed={step >= 3}><span>[10, 20)</span><strong>{step >= 3 ? "1 次" : "—"}</strong><small>{step >= 3 ? "已输出" : "等待水位"}</small></div><div className={styles.streamLate} data-visible={t4Arrived}><WarningCircle size={15} /><span>{latePolicy === "side" ? "late side · t4" : "reopen · t4"}</span></div></div>
    </div>
  </Frame>;
}

const unitSteps = ["摆边界样本", "锁住时钟", "穿过规则", "核对契约"];
const unitCases = [
  { input: "−1", output: "RangeError" },
  { input: "0", output: "0" },
  { input: "100", output: "90" },
  { input: "101", output: "90.9" },
];

export function UnitTestSignatureHero() {
  const scene = useScene(unitSteps.length);
  const [fixedClock, setFixedClock] = useState(false);
  const step = scene.step;
  const ran = step >= 2;
  const asserted = step >= 3;
  const result = step === 0
    ? { icon: Flask, title: "把边界样本摆上实验台", detail: "−1、0、100、101 各自有可观察预期" }
    : step === 1
      ? { icon: fixedClock ? LockSimple : Clock, title: fixedClock ? "依赖被锁住" : "时钟还会漂移", detail: fixedClock ? "clock=2026-08-31，结果不跟今天走" : "同一用例可能在不同日期得到不同结果", danger: !fixedClock }
      : !fixedClock
        ? { icon: WarningCircle, title: "规则跑了，但环境不稳定", detail: "断言还不能说明行为可重复", danger: true }
        : asserted
          ? { icon: CheckCircle, title: "契约可以被重复核对", detail: "3 个数值结果通过，1 个预期错误通过" }
          : { icon: Code, title: "只让这一小段规则接受调用", detail: "不把数据库、网络和别的模块拉进来" };
  return <Frame label="单元测试在隔离实验台上固定样本和依赖，只核对一小段代码的可观察行为" eyebrow="小单元，短反馈，固定实验条件" meta="arrange → act → assert" scene={scene} steps={unitSteps} result={result} caption="单元测试的边界来自可控性：样本、时钟和依赖先摆平，再让一段规则运行，最后只断言外部能观察到的结果。内部怎么改，只要契约没变，实验仍应成立。" controls={<div className={styles.inlineControls} role="group" aria-label="单元测试时钟依赖"><button type="button" aria-pressed={fixedClock} onClick={() => { setFixedClock(value => !value); scene.seek(1); }}><LockSimple size={15} />{fixedClock ? "解锁系统时钟" : "固定测试时钟"}</button></div>}>
    <div className={styles.unitBoard} data-fixed={fixedClock} data-step={step}>
      <div className={styles.unitSpecimen}><div><Flask size={17} /><span>测试样本</span></div><strong>priceAfterDiscount()</strong>{unitCases.map((item, index) => <div key={item.input} data-active={step === 0 && index === 2} data-done={asserted}><code>{item.input}</code><small>{ran ? item.output : "预期：" + item.output}</small></div>)}</div>
      <div className={styles.unitPrism}><div><Code size={17} /><span>被测规则</span></div><strong>{ran ? "输入 → 规则 → 返回" : "等待调用"}</strong><pre>{"if price < 0\n  throw RangeError\nelse\n  return price × .9"}</pre><div className={styles.unitClock}><Clock size={14} /><span>{fixedClock ? "clock = 2026-08-31" : "clock = system today"}</span></div></div>
      <div className={styles.unitOracle}><div><CheckCircle size={17} /><span>断言账本</span></div><strong>{asserted ? "3 pass · 1 expected error" : "尚无结果"}</strong><div className={styles.unitAssertions}><span data-ok={asserted}>return value</span><span data-ok={asserted}>error type</span><span data-ok={step >= 3}>boundary −1</span></div><small>{asserted ? "只看行为，不窥探私有实现" : "运行后才填写"}</small></div>
    </div>
  </Frame>;
}
