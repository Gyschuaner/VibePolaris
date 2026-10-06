"use client";

import { useState, type ReactNode } from "react";
import { Archive, ArrowDown, ArrowRight, ArrowsClockwise, CheckCircle, Cube, CurrencyCircleDollar, Database, FileText, Funnel, GitBranch, MapPin, Scales, ShieldCheck, TreeStructure, WarningCircle } from "@phosphor-icons/react";
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
