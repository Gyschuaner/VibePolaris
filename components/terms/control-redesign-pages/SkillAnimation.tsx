"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./SkillAnimation.module.css";

type Stage = "meta" | "body" | "resource";
const stageOrder: Stage[] = ["meta", "body", "resource"];

export function SkillHero() {
  return <ControlRedesignRuntime kind="skill" label="技能像一只工具箱：先露出 name 与 description，再打开 SKILL.md，最后只取当前任务需要的脚本结果">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.taskCard}><span>当前任务</span><strong>填 PDF 表单</strong><code>需要一套做法</code></div>
      <div className={styles.toolbox}>
        <div className={styles.toolboxLid}><b>SKILL</b><span>按需打开</span></div>
        <div className={`${styles.toolboxLayer} ${styles.metaLayer}`}><span>发现</span><code>name + description</code></div>
        <div className={`${styles.toolboxLayer} ${styles.bodyLayer}`}><span>展开</span><code>SKILL.md</code></div>
        <div className={`${styles.toolboxLayer} ${styles.resourceLayer}`}><span>取用</span><code>convert.py → 结果</code></div>
      </div>
    </div>
  </ControlRedesignRuntime>;
}

export function SkillLesson() {
  const [stage, setStage] = useState<Stage>("meta");
  const [revealed, setRevealed] = useState<Stage>("meta");
  const currentIndex = stageOrder.indexOf(stage);
  const material = {
    meta: ["name + description", "约 100 token", "只用于匹配"],
    body: ["SKILL.md · 说明与步骤", "完整做法", "按匹配结果展开"],
    resource: ["convert.py → 表单字段", "一次脚本结果", "只取当前需要"],
  } as const;
  const visible = (candidate: Stage) => stageOrder.indexOf(candidate) <= stageOrder.indexOf(revealed);
  const moveTo = (next: Stage) => { setStage(next); setRevealed(next); };
  const reset = () => { setStage("meta"); setRevealed("meta"); };

  return <section className={styles.lesson} aria-label="技能渐进式披露演示">
    <div className={styles.lessonHeader}><strong>打开工具箱的哪一层？</strong><span>任务：填 PDF 表单</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={stage === "meta"} onClick={() => moveTo("meta")}>先看元数据</button>
      <button type="button" aria-pressed={stage === "body"} onClick={() => moveTo("body")}>展开 SKILL.md</button>
      <button type="button" aria-pressed={stage === "resource"} onClick={() => moveTo("resource")}>取一个资源结果</button>
      <button type="button" className={styles.nextButton} onClick={() => moveTo(stageOrder[Math.min(currentIndex + 1, stageOrder.length - 1)])}>推进一层</button>
      <button type="button" onClick={reset}>重置</button>
    </div>
    <div className={styles.lessonScene} data-stage={stage}>
      <div className={styles.contextTray}>
        <span className={styles.trayLabel}>模型本轮看到的材料</span>
        {stageOrder.map(layer => <div key={layer} className={styles.contextLayer} data-visible={visible(layer)} data-active={layer === stage}><span>{layer === "meta" ? "线索" : layer === "body" ? "说明" : "资源"}</span><code>{material[layer][0]}</code><small>{material[layer][1]}</small></div>)}
      </div>
      <div className={styles.permissionShelf}><span>宿主权限</span><strong>文件 / 网络 / 执行</strong><small>技能只能提出建议，不能自行放行</small></div>
    </div>
    <div className={styles.result} role="status"><strong>{material[stage][0]}</strong><span>{material[stage][2]} · {stage === "meta" ? "还没有读取正文" : stage === "body" ? "脚本仍在工具箱里" : "只把结果带回上下文"}</span></div>
  </section>;
}
