"use client";

import { UserCircle, Stack, Handshake } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function HandoffSignatureHero() {
  const scene = useScene(4);
  const labels = ["任务在 A 手里", "封存上下文", "交接凭证盖章", "B 接管责任"];
  const handed = scene.step >= 3;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="智能体交接用责任护照保存上下文和权限边界" caption={handed ? "B 拿到的是一份有范围的责任护照，不是把 A 的全部记忆和权限无条件复制过去。" : scene.step === 2 ? "交接凭证记录谁交给谁、带了什么和还剩多少预算；这一步仍未让 B 执行。" : "先把任务、证据和权限边界钉在护照上，再谈谁接手。"}>
    <div className={styles.handoffBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="OWNERSHIP PASSPORT / HANDOFF" title="把退款调查交给下一位" status={handed ? "B OWNS IT" : "A OWNS IT"} />
      <div className={styles.passportDesk}>
        <div className={styles.ownerCard} data-active={!handed}><UserCircle size={24} /><span>当前负责人</span><strong>{handed ? "Agent B" : "Agent A"}</strong><small>{handed ? "接收调查" : "正在整理证据"}</small></div>
        <div className={styles.passportCard} data-sealed={scene.step >= 1}><Stack size={22} /><span>责任护照</span><div><b>任务</b><strong>退款是否已重复</strong></div><div><b>带入</b><strong>{scene.step >= 1 ? "3 条证据" : "待整理"}</strong></div><div><b>预算</b><strong>{scene.step >= 2 ? "剩 2 次" : "5 次"}</strong></div><div><b>权限</b><strong>只读</strong></div></div>
        <div className={styles.handoffSeal} data-visible={scene.step >= 2}><Handshake size={24} /><span>交接凭证</span><strong>{handed ? "SIGNED · A → B" : "WAITING"}</strong><small>{handed ? "范围随护照转移" : "先封存上下文"}</small></div>
      </div>
    </div>
  </SignatureFrame>;
}
