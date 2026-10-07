"use client";

import { Database, MagnifyingGlass, MapPin, Target } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function VectorStoreSignatureHero() {
  const scene = useScene(4);
  const labels = ["放入向量卡片", "贴上元数据", "提出相似问题", "圈出候选邻居"];
  const query = scene.step >= 2;
  const ids = ["A", "B", "C", "D", "E", "F"];
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="向量存储用二维投影和元数据标签展示相似查询如何圈出候选" caption={scene.step === 3 ? "圈出的只是相似候选；过滤、权限和最终回答仍要在检索之后继续检查。" : query ? "查询卡落在局部邻域，距离近的向量被高亮，元数据仍独立显示。" : "向量卡片先各自留在空间里，元数据标签没有被距离吞掉。"}>
    <div className={styles.vectorBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="VECTOR LEDGER / NEIGHBORHOOD" title="找与‘退款超时’相近的资料" status={scene.step === 3 ? "3 CANDIDATES" : "INDEX READY"} />
      <div className={styles.vectorDesk}>
        <div className={styles.vectorMap}>
          <span className={styles.mapAxisX} /><span className={styles.mapAxisY} /><span className={styles.mapLabel}>语义空间 · 仅作可视化投影</span>
          {ids.map((id, index) => <i key={id} className={styles.vectorDot} data-id={id} data-near={query && ["B", "C", "E"].includes(id)} style={{ left: `${18 + (index * 13) % 65}%`, top: `${25 + (index * 17) % 52}%` }}>{id}</i>)}
          <div className={styles.queryPin} data-visible={query}><MagnifyingGlass size={17} /><span>退款超时</span></div>
        </div>
        <div className={styles.vectorMeta}><div><Database size={19} /><span>索引记录</span><b>6 cards</b></div><div><MapPin size={18} /><span>元数据过滤</span><b>product = pay</b></div><div><Target size={18} /><span>邻居</span><b>{scene.step === 3 ? "B · C · E" : "等待查询"}</b></div></div>
      </div>
    </div>
  </SignatureFrame>;
}
