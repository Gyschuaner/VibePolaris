"use client";

import { Brain, CheckCircle, FileText } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function ModelRoutingSignatureHero() {
  const scene = useScene(4);
  const labels = ["读懂请求", "摆出候选", "抬高质量门槛", "留下选择理由"];
  const selected = scene.step >= 2 ? "B" : "";
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="模型路由用质量与费用的二维选择板展示候选模型如何被筛选" caption={scene.step >= 2 ? "B 不是因为名字更大而被选中，而是当前门槛、输入能力和费用一起留下了它。" : "候选模型放在质量—费用坐标里；路由先说明门槛，再谈选择。"}>
    <div className={styles.routingBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="ROUTING DESK / QUALITY × COST" title="这张截图交给谁" status={selected ? "MODEL B" : "COMPARE"} />
      <div className={styles.routingDesk}>
        <div className={styles.frontier}><span className={styles.frontierY}>质量 ↑</span><span className={styles.frontierX}>费用 →</span><div className={styles.frontierRule} data-visible={scene.step >= 2}>最低质量门槛</div><div className={styles.modelPoint} data-model="A" data-visible={scene.step >= 1}><Brain size={16} /><b>A</b><small>便宜 · 不读图</small></div><div className={styles.modelPoint} data-model="B" data-visible={scene.step >= 1} data-selected={selected === "B"}><Brain size={16} /><b>B</b><small>读图 · 较贵</small></div></div>
        <div className={styles.routeBrief}><FileText size={20} /><span>请求特征</span><strong>文字 + 截图</strong><small>{scene.step < 1 ? "等待分析" : scene.step < 2 ? "需要视觉能力" : "质量 ≥ 95"}</small></div>
        <div className={styles.routeReceipt} data-visible={scene.step >= 3}><CheckCircle size={21} /><span>选择理由</span><strong>能力满足 · 仍在预算</strong><small>预测不等于真实质量，仍需评测</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
