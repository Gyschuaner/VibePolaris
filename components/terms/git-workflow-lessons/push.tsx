"use client";

import { ArrowRight, GitBranch, GitCommit, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function PushLesson() {
  const scene = useScene(3);
  const [outcome, setOutcome] = useState<"pending" | "accepted" | "blocked">("pending");
  const sent = scene.step >= 1;
  const accepted = scene.step === 2 && outcome === "accepted";
  const blocked = scene.step === 2 && outcome === "blocked";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git push 远程接受与拒绝演示">
    <Caption scene={scene} labels={["本地先有提交", "发送可达对象", "远程闸门给出结果"]} titles={["工作区和本地历史不是一回事", "只发送远程缺少的提交对象", accepted ? "远程引用快进" : blocked ? "远程规则拒绝" : "检查目标引用"]} copy={["工作区还有一行未提交修改；本地 feature 已从 B 提交到 C，origin/feature 仍在 B。", "push 传输 C 需要的对象并请求更新 origin/feature；未提交的那一行不会沿网络移动。", accepted ? "远程引用从 B 前进到 C；这仍只是推送，尚未合并到 main。" : blocked ? "远程引用保持 B；下一步应根据拒绝原因更新历史、开拉取请求或取得权限。" : "接收端检查快进关系、权限和分支保护，然后再决定是否写入引用。"]} />
    <div className={styles.pushBoard} aria-live="polite">
      <div data-active={!sent}><GitCommit size={22} aria-hidden="true" /><strong>本地 feature</strong><code>C</code><span>{sent ? "C 已发送" : "B → C · 另有未提交修改"}</span></div>
      <ArrowRight size={18} aria-hidden="true" />
      <div data-active={sent && !accepted && !blocked}><GitBranch size={22} aria-hidden="true" /><strong>远程闸门</strong><code>{blocked ? "保护规则" : accepted ? "快进检查" : "等待 push"}</code><span>{blocked ? "目标分支受保护" : accepted ? "B 是 C 的祖先" : "检查 refspec 与权限"}</span></div>
      <ArrowRight size={18} aria-hidden="true" />
      <div data-active={accepted} data-blocked={blocked}><>{blocked ? <WarningCircle size={22} aria-hidden="true" /> : <ShieldCheck size={22} aria-hidden="true" />}</><strong>origin/feature</strong><code>{accepted ? "C" : "B"}</code><span>{accepted ? "远程引用已前进" : blocked ? "指针保持 B" : "尚未接受"}</span></div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进 push 流程"><button type="button" onClick={() => { setOutcome("pending"); scene.seek(1); }} aria-pressed={sent && !accepted && !blocked}>发送对象</button><button type="button" onClick={() => { setOutcome("accepted"); scene.seek(2); }} aria-pressed={accepted}>接受快进</button><button type="button" onClick={() => { setOutcome("blocked"); scene.seek(2); }} aria-pressed={blocked}>模拟目标分支受保护</button></div>
  </div>;
}
