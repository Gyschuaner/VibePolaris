"use client";

import { Archive, CheckCircle, ClipboardText, FileText, Funnel, LockSimple, MagnifyingGlass, Tag, Warning, WarningCircle, Wrench, X } from "@phosphor-icons/react";
import { useEffect } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

function AutoScene({ length }: { length: number }) {
  const scene = useScene(length);
  useEffect(() => { scene.toggle(); }, []);
  return scene;
}

export function ChunkingBoundaryHero() {
  const scene = AutoScene({ length: 4 });
  const cut = scene.step >= 1;
  const overlap = scene.step >= 2;
  const traced = scene.step >= 3;
  return <div ref={scene.ref} className={styles.chunkingHero} data-step={scene.step} role="img" aria-label="政策纸带沿标题和例外条件切开，边界保留重叠并带回页码元数据">
    <div className={styles.signatureTop}><span>DOCUMENT STRIP / CHUNK BOUNDARY</span><strong>{traced ? "TRACEABLE" : overlap ? "OVERLAP" : cut ? "CUT" : "WHOLE"}</strong></div>
    <SceneControls scene={scene} labels={["展开原文", "沿结构切开", "留下边界重叠", "带回页码"]} compact />
    <div className={styles.chunkingPaper}>
      <div className={styles.chunkingMargin}><span>§2</span><span>§3</span><span>§4</span></div>
      <div className={styles.chunkingText}><span className={styles.chunkingTitle}>退款政策 / 适用范围</span><div className={styles.chunkingLines}><i>退款申请应在课程开始前提交。</i><i data-muted={!cut}>企业版订单适用另一条时限。</i><i data-muted={!overlap}>例外：已开具发票的订单需先联系财务。</i></div><div className={styles.chunkingCuts} data-visible={cut}><b /><b /></div><div className={styles.chunkingOverlap} data-visible={overlap}>+100 字邻接</div></div>
    </div>
    <div className={styles.chunkingMeta} data-visible={traced}><Tag size={14}/><span>父标题：退款政策</span><code>p.04 · v3</code></div>
    <div className={styles.signatureProof}>{traced ? <><CheckCircle size={14}/> 命中片段能回到原文位置</> : overlap ? <><Archive size={14}/> 先把边界条件留在纸带上</> : <><Wrench size={14}/> 先观察内容，不急着平均切段</>}</div>
  </div>;
}

export function RetrievalEvidenceHero() {
  const scene = AutoScene({ length: 6 });
  const opened = scene.step >= 1;
  const ranked = scene.step >= 2;
  const expanded = scene.step >= 3;
  const removed = scene.step >= 4;
  const cited = scene.step >= 5;
  return <div ref={scene.ref} className={styles.retrievalHero} data-step={scene.step} role="img" aria-label="检索把查询磁石放到证据架上，候选先排序并扩大 top-k，再抽走缺少来源的卡片，最后只夹住可引用证据">
    <div className={styles.signatureTop}><span>EVIDENCE SHELF / RETRIEVAL</span><strong>{cited ? "CITED" : removed ? "GAP" : expanded ? "TOP-K 5" : ranked ? "RANKED" : opened ? "OPEN" : "QUERY"}</strong></div>
    <SceneControls scene={scene} labels={["写下查询", "打开证据架", "调语义滑轨", "扩大 top-k", "抽走无来源", "关上引用闸"]} compact />
    <div className={styles.retrievalShelf}>
      <div className={styles.queryCard}><MagnifyingGlass size={17}/><strong>退款多久到账？</strong><small>{expanded ? "top-k 3 → 5" : "top-k 3"}</small></div>
      <div className={styles.evidenceCards} data-open={opened} data-ranked={ranked}>
        <div className={styles.evidenceCard} data-rank="1"><span>01</span><strong>退款政策 §2</strong><small>0.88 · p.04</small></div>
        <div className={styles.evidenceCard} data-rank="2"><span>02</span><strong>账户结算说明</strong><small>0.57 · v2</small></div>
        <div className={styles.evidenceCard} data-rank="3" data-removed={removed}><span>03</span><strong>无来源摘录</strong><small>{removed ? "抽走" : "0.94 · ?"}</small></div>
      </div>
      <div className={styles.retrievalClip} data-visible={cited}><ClipboardText size={15}/><span>{cited ? "夹住有出处的 §2" : "等待可引用证据"}</span></div>
    </div>
    <div className={styles.signatureProof}>{removed ? <><X size={14}/> 高分但无来源，留下证据缺口</> : ranked ? <><Funnel size={14}/> 排序改变位置，不改变事实</> : <><Archive size={14}/> 抽屉先收材料，再决定是否回答</>}</div>
  </div>;
}

export function VectorStoreLedgerHero() {
  const scene = AutoScene({ length: 4 });
  const indexed = scene.step >= 0;
  const queried = scene.step >= 1;
  const filtered = scene.step >= 2;
  const returned = scene.step >= 3;
  return <div ref={scene.ref} className={styles.vectorLedgerHero} data-step={scene.step} role="img" aria-label="向量存储先建立近邻索引，再查询候选、套元数据过滤，最后返回带来源的前五条记录">
    <div className={styles.signatureTop}><span>VECTOR LEDGER / VERSIONED STORE</span><strong>{returned ? "TOP 5" : filtered ? "FILTERED" : queried ? "NEIGHBORS" : "INDEXED"}</strong></div>
    <SceneControls scene={scene} labels={["建立索引", "查询近邻", "套元数据过滤", "返回前五"]} compact />
    <div className={styles.vectorLedger}>
      <div className={styles.vectorSource}><FileText size={16}/><strong>退款政策</strong><small>原文 / p.04 · v3</small></div>
      <div className={styles.vectorDots} data-visible={indexed}><i/><i/><i/><i/><i/><small>embedding · HNSW</small></div>
      <div className={styles.vectorRows}>
        <div data-active={queried}><MagnifyingGlass size={13}/><span>{queried ? "近邻候选" : "向量索引"}</span><code>{queried ? "20 段" : "10k 段"}</code></div>
        <div data-active={filtered}><Funnel size={13}/><span>{filtered ? "产品 = 支付" : "元数据过滤"}</span><code>{filtered ? "20 → 7" : "待用"}</code></div>
        <div data-active={returned}><CheckCircle size={13}/><span>{returned ? "返回前五" : "结果等待"}</span><code>{returned ? "5 cards" : "top-k"}</code></div>
      </div>
    </div>
    <div className={styles.signatureProof}>{returned ? <><CheckCircle size={14}/> 前五条连同来源和元数据一起返回</> : filtered ? <><Funnel size={14}/> 过滤缩小候选范围，不会改写原文</> : queried ? <><MagnifyingGlass size={14}/> 先找近邻，再套业务条件</> : <><LockSimple size={14}/> 索引把原文位置挂在向量旁</>}</div>
  </div>;
}

export function SubagentContractHero() {
  const scene = AutoScene({ length: 4 });
  const drafted = scene.step >= 1;
  const returned = scene.step >= 2;
  const accepted = scene.step >= 3;
  return <div ref={scene.ref} className={styles.subagentHero} data-step={scene.step} role="img" aria-label="子智能体从主线收到一张价格核对契约，返回带来源和缺口的结果卡">
    <div className={styles.signatureTop}><span>SUBTASK CONTRACT / PRICE CHECK</span><strong>{accepted ? "ACCEPTED" : returned ? "RETURNED" : drafted ? "ASSIGNED" : "DRAFT"}</strong></div>
    <SceneControls scene={scene} labels={["写下主任务", "封好契约", "返回结果卡", "主线验收"]} compact />
    <div className={styles.subagentBench}>
      <div className={styles.subagentMain}><ClipboardText size={16}/><strong>主报告</strong><small>{accepted ? "收下 2 个价格" : "还缺价格核对"}</small></div>
      <div className={styles.subagentContract} data-open={drafted}><span>支线契约</span><code>{drafted ? "3 URLs · currency · tax" : "空白"}</code><small>{drafted ? "只允许查价，不改报告" : "等待字段"}</small></div>
      <div className={styles.subagentResults} data-visible={returned}><div><Tag size={13}/><span>¥420 · 有来源</span></div><div><Tag size={13}/><span>¥580 · 有来源</span></div><div data-gap={!accepted}><Warning size={13}/><span>{accepted ? "1 个缺失已保留" : "1 个无来源"}</span></div></div>
    </div>
    <div className={styles.signatureProof}>{accepted ? <><CheckCircle size={14}/> 主线验收通过，缺口没有被补写</> : returned ? <><WarningCircle size={14}/> 返回文字不等于通过验收</> : <><Wrench size={14}/> 子智能体只拿到一块可验收的工作</>}</div>
  </div>;
}

export function PlanDependencyHero() {
  const scene = AutoScene({ length: 5 });
  const built = scene.step >= 1;
  const tested = scene.step >= 2;
  const blocked = scene.step >= 3 && scene.step < 4;
  const repaired = scene.step >= 4;
  return <div ref={scene.ref} className={styles.planDependencyHero} data-step={scene.step} role="img" aria-label="规划与执行把构建测试部署摆成依赖节点，测试失败时插入修复节点并重新获得部署入口">
    <div className={styles.signatureTop}><span>DEPENDENCY CONSTELLATION / RELEASE</span><strong>{repaired ? "REPLANNED" : blocked ? "BLOCKED" : tested ? "TESTED" : built ? "BUILT" : "DRAFT"}</strong></div>
    <SceneControls scene={scene} labels={["摆出依赖", "留下构建回执", "收到测试结果", "锁住部署", "插入修复"]} compact />
    <div className={styles.planConstellation}>
      <span className={`${styles.planLink} ${styles.planLinkOne}`} data-active={built}/><span className={`${styles.planLink} ${styles.planLinkTwo}`} data-active={tested}/><span className={`${styles.planLink} ${styles.planLinkThree}`} data-active={repaired}/>
      <div className={styles.planNode} data-state={built ? "done" : "open"}><FileText size={16}/><strong>构建</strong><small>{built ? "产物留存" : "等待"}</small></div>
      <div className={styles.planNode} data-state={blocked ? "failed" : tested ? "done" : "open"}><MagnifyingGlass size={16}/><strong>{repaired ? "复测" : "测试"}</strong><small>{blocked ? "11/12" : tested ? "12/12" : "等待"}</small></div>
      <div className={styles.planNode} data-state={blocked ? "locked" : repaired ? "ready" : "open"}><LockSimple size={16}/><strong>部署</strong><small>{blocked ? "锁住" : repaired ? "可执行" : "等回执"}</small></div>
      <div className={styles.planRepair} data-visible={repaired}><Wrench size={14}/><span>修复节点</span></div>
    </div>
    <div className={styles.signatureProof}>{blocked ? <><WarningCircle size={14}/> 失败改变的是依赖图，不是被抹掉的文字</> : repaired ? <><CheckCircle size={14}/> 修复和复测有自己的回执</> : <><Archive size={14}/> 先看依赖，再决定下一步</>}</div>
  </div>;
}
