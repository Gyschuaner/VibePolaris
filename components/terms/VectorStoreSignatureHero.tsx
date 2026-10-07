"use client";

import { Database, MagnifyingGlass, MapPin, Target } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function VectorStoreSignatureHero() {
  const scene = useScene(4);
  const labels = ["索引已建立", "查询沿图搜索", "元数据收窄", "返回前五"];
  const query = scene.step >= 2;
  const [filterOn, setFilterOn] = useState(true);
  const ids = ["A", "B", "C", "D", "E", "F"];
  const filteredCandidates = filterOn ? "20 → 7" : "20 → 20";
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="向量存储用二维投影、版本过滤和邻域卡展示相似查询如何圈出候选" caption={scene.step === 3 ? "最后留下的是带来源 ID 的五段候选；过滤、权限和正文核对仍在检索之后。" : scene.step === 2 ? "版本开关把 20 个近邻收窄到 7 个，距离相似和业务可用是两道不同筛选。" : query ? "查询卡落在局部邻域，距离近的向量被高亮，元数据仍独立显示。" : "一万段内容先成为可导航的近邻空间，元数据标签没有被距离吞掉。"}>
    <div className={styles.vectorBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="VECTOR LEDGER / NEIGHBORHOOD" title="找与‘退款超时’相近的资料" status={scene.step === 3 ? "3 CANDIDATES" : "INDEX READY"} />
      <div className={styles.vectorDesk}>
        <div className={styles.vectorMap}>
          <span className={styles.mapAxisX} /><span className={styles.mapAxisY} /><span className={styles.mapLabel}>语义空间 · 仅作可视化投影</span>
          {ids.map((id, index) => <i key={id} className={styles.vectorDot} data-id={id} data-near={query && ["B", "C", "E"].includes(id)} style={{ left: `${18 + (index * 13) % 65}%`, top: `${25 + (index * 17) % 52}%` }}>{id}</i>)}
          <div className={styles.queryPin} data-visible={query}><MagnifyingGlass size={17} /><span>退款超时</span></div>
        </div>
        <div className={styles.vectorMeta}><div><Database size={19} /><span>索引记录</span><b>{scene.step === 0 ? "10,000 段" : scene.step === 1 ? "访问约 180 · 候选 20" : "10,000 段已索引"}</b></div><div><MapPin size={18} /><span>元数据过滤</span><b>{scene.step >= 2 ? filteredCandidates : "2026 版待筛"}</b><button type="button" className={styles.vectorFilterToggle} aria-pressed={filterOn} onClick={() => setFilterOn(value => !value)}>2026 版过滤 · {filterOn ? "开" : "关"}</button></div><div><Target size={18} /><span>邻居</span><b>{scene.step === 3 ? "top 5 · B / C / E" : scene.step === 2 ? "7 条候选" : "等待查询"}</b></div></div>
      </div>
    </div>
  </SignatureFrame>;
}
