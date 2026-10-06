"use client";

import { ArrowRight, Cloud, GitPullRequest, Hammer, LinkSimple, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["PR 排队", "预览可访问", "推送 F5", "关闭并回收"];
const captions = [
  "PR #18 指向 F4，构建排队；生产码头仍停在 main 的 M9。",
  "F4 构建完成，预览 URL 与提交绑定，评审者现在看到的是这一份。",
  "推送 F5 后，预览码头换成 F5；F4 固定链接仍可以作为旧证据。",
  "关闭 PR 回收临时环境，生产 M9 没有被预览动作改写。",
];

export function PreviewDeploymentHero() {
  const scene = useScene(labels.length);
  const [closed, setClosed] = useState(false);
  const [commit, setCommit] = useState("F4");
  const step = scene.step;
  const previewGone = closed || step === 3;
  const previewCommit = commit === "F5" || step >= 2 ? "F5" : "F4";
  return <MechanismFrame scene={scene} title="一次提交怎样停靠在预览码头" labels={labels} caption={captions[step]}>
    <div className={styles.previewScene}>
      <div className={styles.previewTrack}>
        <div className={styles.previewDock} data-active={step === 0} data-prod={false}><div className={styles.previewDockHead}><GitPullRequest size={15} />PR #18</div><div className={styles.previewToken}><span>{commit}</span><ArrowRight size={13} /></div><small>分支事件触发构建</small></div>
        <div className={styles.previewDock} data-active={step >= 1 && !previewGone} data-prod={false}><div className={styles.previewDockHead}><LinkSimple size={15} />PREVIEW</div><div className={styles.previewToken} data-gone={previewGone}><span>{previewGone ? "URL removed" : `preview-18 · ${previewCommit}`}</span><Cloud size={13} /></div><small>{previewGone ? "PR 关闭后回收" : "sandbox · commit-bound"}</small></div>
        <div className={styles.previewDock} data-active={false} data-prod="true"><div className={styles.previewDockHead}><Hammer size={15} />PRODUCTION</div><div className={styles.previewToken}><span>M9</span><Cloud size={13} /></div><small>预览通过不会改变生产</small></div>
      </div>
      <div className={styles.previewActions}><button type="button" onClick={() => { setCommit("F5"); scene.seek(2); }}><GitPullRequest size={13} />推送 F5</button><button type="button" onClick={() => { setClosed(true); scene.seek(3); }}><Trash size={13} />关闭 PR</button></div>
      <div className={styles.previewProof} role="status"><LinkSimple size={16} /><strong>{previewGone ? "preview 已回收" : `当前预览 · ${previewCommit}`}</strong><span>{previewGone ? "production · M9 仍在" : "固定提交链接可复现"}</span></div>
    </div>
  </MechanismFrame>;
}
