"use client";

import { UserCircle, Stack, Handshake } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function HandoffSignatureHero() {
  const scene = useScene(5);
  const labels = ["客服持有回复权", "整理交接包", "交接包抵达退款智能体", "回复权移动", "从下一步接手"];
  const handed = scene.step >= 3;
  const packetReady = scene.step >= 2;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="智能体交接用责任护照保存上下文和权限边界" caption={scene.step === 4 ? "退款智能体从确认金额这一步接手；交接改变责任归属，不代表退款动作已经执行。" : scene.step === 3 ? "回复权随凭证移动，原智能体不再同时替接手者回答。" : scene.step === 2 ? "完整交接包已经抵达，接手者拿到订单号、申请类型和已核对事实。" : "先把任务、证据和权限边界钉在护照上，再谈谁接手。"}>
    <div className={styles.handoffBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="OWNERSHIP PASSPORT / HANDOFF" title="把退款调查交给下一位" status={handed ? "B OWNS IT" : "A OWNS IT"} />
      <div className={styles.passportDesk}>
        <div className={styles.ownerCard} data-active={!handed}><UserCircle size={24} /><span>当前负责人</span><strong>{handed ? "Agent B" : "Agent A"}</strong><small>{handed ? "接收调查" : "正在整理证据"}</small></div>
        <div className={styles.passportCard} data-sealed={scene.step >= 1}><Stack size={22} /><span>责任护照</span><div><b>任务</b><strong>{packetReady ? "退款是否已重复" : "待整理"}</strong></div><div><b>带入</b><strong>{scene.step >= 1 ? "订单号 + 申请类型" : "待整理"}</strong></div><div><b>预算</b><strong>{scene.step >= 2 ? "剩 2 次" : "5 次"}</strong></div><div><b>权限</b><strong>只读</strong></div></div>
        <div className={styles.handoffSeal} data-visible={scene.step >= 2}><Handshake size={24} /><span>交接凭证</span><strong>{handed ? "SIGNED · A → B" : "PACKET READY"}</strong><small>{handed ? "范围随护照转移" : "等待回复权移动"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
