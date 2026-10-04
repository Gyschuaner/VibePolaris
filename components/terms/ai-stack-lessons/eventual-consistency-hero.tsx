"use client";

import { ArrowsClockwise, CheckCircle, Database, Eye, GitBranch, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./EventualConsistencyConcept.module.css";

const steps = [
  { label: "写入", title: "先在一个副本写下新值", detail: "写入成功不代表每个读副本已经同步。", Icon: Database },
  { label: "复制", title: "更新沿副本之间传播", detail: "复制有延迟，旧值会在窗口里继续存在。", Icon: ArrowsClockwise },
  { label: "读取", title: "一次读可能撞上旧副本", detail: "看到 pending 不一定说明刚才的写入失败。", Icon: Eye },
  { label: "冲突", title: "并发写入需要规则收敛", detail: "多地同时修改时，系统要说明怎样裁决。", Icon: GitBranch },
  { label: "收敛", title: "没有新写入后最终对齐", detail: "最终一致不承诺立刻，也不自动理解业务优先级。", Icon: CheckCircle },
];

export function EventualConsistencyHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const replicaA = scene.step >= 1 ? "paid" : "pending";
  const replicaB = scene.step >= 4 ? "paid" : "pending";
  const conflict = scene.step === 3;

  return <figure ref={scene.ref} className={styles.eventualHero} data-step={scene.step} aria-label="最终一致性如何在写入、复制延迟、旧读、冲突和收敛之间展开">
    <div className={styles.eventualHeroHeader}><span>一次“已保存”为什么还可能读到旧值</span><strong>write → replicate → read → converge</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.eventualHeroBoard}>
      <div className={styles.eventualHeroWrite} data-active={scene.step === 0 || scene.step === 3}>
        <div className={styles.eventualHeroLabel}><Database size={17} aria-hidden="true" /><span>写入副本 · region A</span></div>
        <h3>订单 A17</h3>
        <div className={styles.eventualHeroValue} data-new={scene.step >= 0}>paid</div>
        <small>{scene.step === 0 ? "主副本先返回成功" : scene.step === 3 ? "另一地同时写入 cancelled" : "写入已提交"}</small>
      </div>
      <div className={styles.eventualHeroArrow} aria-hidden="true"><span /><ArrowsClockwise size={21} /></div>
      <div className={styles.eventualHeroReplicas} data-active={scene.step === 1 || scene.step === 4} data-danger={conflict}>
        <div className={styles.eventualHeroLabel}><ArrowsClockwise size={17} aria-hidden="true" /><span>异步复制 · replicas</span></div>
        <div className={styles.eventualHeroReplicaRow}><span>A</span><strong data-new={replicaA === "paid"}>{replicaA}</strong><small>{replicaA === "paid" ? "已到达" : "待同步"}</small></div>
        <div className={styles.eventualHeroReplicaRow}><span>B</span><strong data-new={replicaB === "paid"}>{conflict ? "cancelled" : replicaB}</strong><small>{conflict ? "并发写入" : replicaB === "paid" ? "已收敛" : "有延迟"}</small></div>
        <div className={styles.eventualHeroReplicaNote}>{conflict ? <><WarningCircle size={15} aria-hidden="true" />需要冲突裁决</> : scene.step === 4 ? <><CheckCircle size={15} aria-hidden="true" />副本对齐</> : "复制不是瞬间完成"}</div>
      </div>
      <div className={styles.eventualHeroArrow} aria-hidden="true"><span /><Eye size={20} /></div>
      <div className={styles.eventualHeroRead} data-active={scene.step === 2 || scene.step === 4} data-danger={scene.step === 2}>
        <div className={styles.eventualHeroLabel}><Eye size={17} aria-hidden="true" /><span>一次读取 · client</span></div>
        <h3>{scene.step === 2 ? "读到 pending" : scene.step === 4 ? "读到 paid" : "等待读取"}</h3>
        <div className={styles.eventualHeroReadBox}><strong>{scene.step === 2 ? "旧值" : scene.step === 4 ? "新值" : "—"}</strong><small>{scene.step === 2 ? "不是写入失败，是副本尚未追上" : scene.step === 4 ? "所有副本已对齐" : "尚无请求"}</small></div>
      </div>
    </div>
    <div className={styles.eventualHeroSignal} data-active={scene.step === 3} data-danger={conflict}><GitBranch size={17} aria-hidden="true" /><span>{conflict ? "paid ↔ cancelled · 示例裁决：last writer wins" : scene.step === 4 ? "没有新写入后，副本最终收敛" : "复制延迟是一个需要被产品承受的窗口"}</span></div>
    <div className={styles.eventualHeroMetrics}>
      <div><span>写入结果</span><strong>已提交</strong></div>
      <div><span>当前读值</span><strong>{scene.step === 2 ? "可能旧" : scene.step === 4 ? "最新" : "等待"}</strong></div>
      <div><span>一致状态</span><strong>{scene.step === 4 ? "已收敛" : "窗口中"}</strong></div>
    </div>
    <div className={styles.eventualHeroResult} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>最终一致性承认副本之间会有时间差：读者要知道自己读的是哪种一致性、能接受多旧的值，以及并发写入由谁裁决。它不是“总会自动正确”，而是把协调成本换成可设计的延迟。</figcaption>
  </figure>;
}
