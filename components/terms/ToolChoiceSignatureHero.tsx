"use client";

import { FileText, Gauge, Handshake } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function ToolChoiceSignatureHero() {
  const scene = useScene(4);
  const labels = ["放下任务票", "摊开候选", "调高风险刻度", "停在审批台"];
  const candidates = ["calendar_read", "calendar_update", "web_search"];
  const chosen = scene.step >= 2 ? "calendar_update" : "";
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="工具选择把候选工具、风险刻度和待审批动作放在一张选择台上" caption={scene.step === 3 ? "选择已经完成，写操作仍停在审批台；决定调用谁和真的执行，是两件事。" : scene.step === 2 ? "风险刻度拨高后，写操作被挑出来，但还只是待批准的票。" : "候选工具先摊开，任务票还没有让任何工具真正动起来。"}>
    <div className={styles.choiceBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="TOOL TRAY / POLICY DIAL" title="把会议改到周五" status={scene.step === 3 ? "NEEDS APPROVAL" : "CHOOSING"} />
      <div className={styles.choiceDesk}>
        <div className={styles.taskCard}><FileText size={19} /><span>任务票</span><strong>把会议改到周五</strong><small>写入动作 · 需要人工确认</small></div>
        <div className={styles.toolTray}><span className={styles.boardLabel}>候选工具</span>{candidates.map((item, index) => <div key={item} className={styles.toolChip} data-visible={scene.step >= 1} data-selected={chosen === item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><small>{index === 0 ? "读取" : index === 1 ? "写入" : "搜索"}</small></div>)}</div>
        <div className={styles.policyDial} data-high={scene.step >= 2}><Gauge size={23} /><span>风险刻度</span><strong>{scene.step >= 2 ? "HIGH" : "LOW"}</strong><div className={styles.dialTicks}><i /><i /><i /><i /><i /></div><small>写操作先停，不自动改日历</small></div>
        <div className={styles.approvalCard} data-visible={scene.step >= 2}><Handshake size={21} /><span>待审批动作</span><strong>{chosen || "还未选择"}</strong><small>{scene.step === 3 ? "NEEDS APPROVAL" : "PROPOSED · 未执行"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
