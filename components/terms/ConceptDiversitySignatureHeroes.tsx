"use client";

import { Brain, CheckCircle, FileText, Sparkle, Tag, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function SignatureFrame({
  scene,
  ariaLabel,
  labels,
  children,
  caption,
}: {
  scene: ReturnType<typeof useScene>;
  ariaLabel: string;
  labels: string[];
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure ref={scene.ref} className={styles.hero} role="region" aria-label={ariaLabel} data-step={scene.step}>
      <SceneControls scene={scene} labels={labels} compact />
      <div className={styles.canvas}>{children}</div>
      <figcaption className={styles.caption}>
        <span>{String(scene.step + 1).padStart(2, "0")}</span>
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}

export function FewShotPromptingSignatureHero() {
  const scene = useScene(4);
  const conflict = scene.step === 3;
  const labels = ["摆上新工单", "放入两张校样", "显出标签版式", "加入相反校样"];
  return (
    <SignatureFrame
      scene={scene}
      labels={labels}
      ariaLabel="少样本提示用几张输入输出校样给新工单提供局部标签版式"
      caption={scene.step < 2 ? "示例不是给模型换一套参数，而是把这次请求要参照的版式摆到桌面上。" : conflict ? "相反校样让标签和格式互相打架；先修示例的覆盖与一致性，再期待稳定结果。" : "新工单沿用的是本轮上下文里的局部模式，离开这组校样后并没有永久学会。"}
    >
      <div className={styles.exampleBoard} data-conflict={conflict}>
        <div className={styles.exampleHeader}>
          <div><span>校样台</span><strong>客服工单 · 本轮上下文</strong></div>
          <div className={styles.parameterSeal}><Brain size={16} /><span>参数</span><b>unchanged</b></div>
        </div>
        <div className={styles.exampleWorkbench}>
          <div className={styles.ticketShelf}>
            <span className={styles.eyebrow}>输入 → 输出校样</span>
            <div className={styles.ticketCard} data-visible={scene.step >= 1}>
              <FileText size={17} /><div><strong>登录页空白</strong><small>→ 前端</small></div><Tag size={16} />
            </div>
            <div className={styles.ticketCard} data-visible={scene.step >= 1}>
              <FileText size={17} /><div><strong>付款一直转圈</strong><small>→ 网络</small></div><Tag size={16} />
            </div>
            {conflict ? <div className={styles.ticketCard} data-conflict="true"><WarningCircle size={17} /><div><strong>登录页空白</strong><small>→ 网络</small></div><Tag size={16} /></div> : null}
          </div>
          <div className={styles.labelLens} data-visible={scene.step >= 2}>
            <Sparkle size={20} />
            <span>标签与版式</span>
            <div><b>前端</b><b>后端</b><b>网络</b></div>
            <small>{scene.step >= 2 ? "单行 · 一个标签" : "等待校样"}</small>
          </div>
          <div className={styles.newTicket} data-ready={scene.step >= 2} data-conflict={conflict}>
            <span className={styles.eyebrow}>新工单</span>
            <strong>导出按钮没反应</strong>
            <div className={styles.stamp}>
              {scene.step < 2 ? <span>待套用</span> : conflict ? <><WarningCircle size={17} />先修校样</> : <><CheckCircle size={17} />前端</>}
            </div>
          </div>
        </div>
      </div>
    </SignatureFrame>
  );
}

export function BoardHeader({ eyebrow, title, status }: { eyebrow: string; title: string; status: string }) {
  return <div className={styles.boardHeader}><div><span>{eyebrow}</span><strong>{title}</strong></div><b>{status}</b></div>;
}
