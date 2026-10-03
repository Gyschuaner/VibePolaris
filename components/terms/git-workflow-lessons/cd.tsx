"use client";

import { ArrowRight, CheckCircle, FileText, GitCommit, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function CdLesson() {
  const scene = useScene(3);
  const promoted = scene.step >= 1;
  const approved = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="持续交付从构建制品到生产审批演示">
    <Caption
      scene={scene}
      labels={["构建一次", "经过 staging", "批准生产"]}
      titles={["先固定将要验证的制品", "同一份文件进入测试环境", "生产闸门放行已验证版本"]}
      copy={[
        "提交 F5 只构建一次，生成 artifact #42；它有自己的摘要，后续步骤都引用这份文件。",
        "artifact #42 从 build 提升到 staging，集成检查通过；流程没有在环境之间重新打包。",
        "production job 停在 Waiting，批准后仍部署 artifact #42；如果重新构建，必须把它当成新版本重新验证。",
      ]}
    />
    <div className={styles.cdBoard} aria-live="polite">
      <div data-active={!promoted}>
        <GitCommit size={23} aria-hidden="true" />
        <strong>构建 F5</strong>
        <code>artifact #42 · sha256:a9…</code>
        <span>{promoted ? "制品已固定" : "只构建一次"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div className={styles.cdEnvStack} data-active={promoted}>
        <div className={styles.cdEnv} data-active={promoted}><FileText size={19} aria-hidden="true" /><strong>staging</strong><code>{promoted ? "#42 · checks pass" : "等待制品"}</code></div>
        <div className={styles.cdEnvNote}><span>{promoted ? "同一 artifact，没有重新构建" : "先等待 build"}</span></div>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={approved} data-blocked={promoted && !approved}>
        {approved ? <CheckCircle size={23} aria-hidden="true" /> : <ShieldCheck size={23} aria-hidden="true" />}
        <strong>{approved ? "production · deployed" : "production · waiting"}</strong>
        <code>{approved ? "artifact #42 · same digest" : "required reviewer"}</code>
        <span>{approved ? "审批后继续，版本身份没有改变" : "没有审批不能通过生产闸门"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进持续交付流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>部署 staging</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={approved}>批准生产</button>
    </div>
  </div>;
}
