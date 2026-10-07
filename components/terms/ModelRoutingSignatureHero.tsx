"use client";

import { Brain, CheckCircle, FileText } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function ModelRoutingSignatureHero() {
  const scene = useScene(6);
  const labels = ["拆开工单", "拨到门槛", "钉住 A", "转向 B", "遇到图片", "没有可接候选"];
  const selected = scene.step === 2 ? "A" : scene.step === 3 || scene.step === 4 ? "B" : "";
  const noCandidate = scene.step === 5;
  const brief = scene.step === 0 ? "文字字段" : scene.step === 1 ? "质量门槛 90 / 100" : scene.step === 2 ? "A 达标 · 96 / 100 · 1 单位" : scene.step === 3 ? "复杂条款 → B · 92 / 100" : scene.step === 4 ? "截图 → B · A 不读图" : "门槛 98 / 100 · 无候选";
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="模型路由用质量与费用的二维选择板展示候选模型如何被筛选" caption={noCandidate ? "门槛高于两者分数时，路由停在调用前；它不能为了发出请求偷偷放宽条件。" : scene.step >= 3 ? "任务条件改变，承接者也改变：复杂条款和图片能力让 B 留下，选择仍发生在调用前。" : "候选模型放在质量—费用坐标里；路由先说明门槛，再谈选择。"}>
    <div className={styles.routingBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="ROUTING DESK / QUALITY × COST" title="这张截图交给谁" status={selected ? "MODEL B" : "COMPARE"} />
      <div className={styles.routingDesk}>
        <div className={styles.frontier}><span className={styles.frontierY}>质量 ↑</span><span className={styles.frontierX}>费用 →</span><div className={styles.frontierRule} data-visible={scene.step >= 1}>质量门槛 {scene.step === 5 ? "98" : "90"}</div><div className={styles.modelPoint} data-model="A" data-visible={scene.step >= 1} data-selected={selected === "A"}><Brain size={16} /><b>A</b><small>{scene.step === 4 ? "不支持图片" : "96 / 100 · 1 单位"}</small></div><div className={styles.modelPoint} data-model="B" data-visible={scene.step >= 1} data-selected={selected === "B"}><Brain size={16} /><b>B</b><small>{scene.step === 3 ? "92 / 100 · 3 单位" : scene.step === 4 ? "读图 · 94 / 100" : "97 / 100 · 3 单位"}</small></div></div>
        <div className={styles.routeBrief}><FileText size={20} /><span>请求特征</span><strong>{scene.step >= 4 ? "文字 + 截图" : "提取订单金额"}</strong><small>{brief}</small></div>
        <div className={styles.routeReceipt} data-visible={scene.step >= 2}><CheckCircle size={21} /><span>{noCandidate ? "调用前停止" : "选择理由"}</span><strong>{noCandidate ? "没有可接候选" : `${selected || "待选"} 被留下`}</strong><small>{noCandidate ? "98 门槛高于可用分数" : "预测不等于真实质量，仍需评测"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
