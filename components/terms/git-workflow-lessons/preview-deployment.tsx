"use client";

import { ArrowRight, CloudArrowUp, GitBranch, GitCommit, GitPullRequest, Globe, ShieldCheck, Trash } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function PreviewDeploymentLesson() {
  const scene = useScene(3);
  const currentCommit = scene.step >= 2 ? "F5" : "F4";
  const ready = scene.step === 1;
  const closed = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="拉取请求预览部署的生命周期演示">
    <Caption
      scene={scene}
      labels={["PR 推进 F4", "预览可访问", "推送 F5 后关闭 PR"]}
      titles={["先把当前提交放进预览队列", "评审者看到的是临时环境", "先追踪新提交，再回收临时环境"]}
      copy={[
        "PR #18 指向提交 F4；流水线开始构建，production 仍由 main 上的 M9 提供服务。",
        "构建完成后，PR 状态回写成功并给出预览地址；页面使用沙箱数据，不共享生产写入。",
        "新提交 F5 让分支地址指向 F5；随后关闭 PR，预览地址失效，F4 的提交固定链接仍保留追溯记录。production 仍停在 M9。",
      ]}
    />
    <div className={styles.previewBoard} aria-live="polite">
      <div className={styles.previewLane} data-active={!closed}>
        <GitPullRequest size={23} aria-hidden="true" />
        <strong>PR #18</strong>
        <code>{closed ? "closed" : `${currentCommit} · ${scene.step === 0 ? "queued" : "pushed"}`}</code>
        <span>{closed ? "feature/checkout 已停止" : "source branch · 最新提交"}</span>
      </div>
      <ArrowRight className={styles.previewArrow} size={19} aria-hidden="true" />
      <div className={styles.previewLane} data-active={ready} data-removed={closed}>
        {closed ? <Trash size={23} aria-hidden="true" /> : ready ? <Globe size={23} aria-hidden="true" /> : <CloudArrowUp size={23} aria-hidden="true" />}
        <strong>{closed ? "preview · removed" : "preview-18.example.dev"}</strong>
        <code>{closed ? "404 · reclaimed" : ready ? `${currentCommit} · sandbox` : "waiting for build"}</code>
        <span>{closed ? "关闭 PR 后自动清理 · F4 permalink 可追溯" : ready ? "branch URL · PR status: pass" : "独立构建 · 尚无结果"}</span>
      </div>
      <ArrowRight className={styles.previewArrow} size={19} aria-hidden="true" />
      <div className={styles.previewLane} data-protected="true">
        <GitBranch size={23} aria-hidden="true" />
        <strong>production · main</strong>
        <code>M9 · unchanged</code>
        <span>预览部署不改变生产流量</span>
      </div>
      <div className={styles.previewProof} data-ready={ready} data-closed={closed}>
        {closed ? <ShieldCheck size={21} aria-hidden="true" /> : <GitCommit size={21} aria-hidden="true" />}
        <p>{closed ? "预览已回收；记录仍保留 branch F5 与 F4 固定链接，production M9 不变。" : ready ? "预览状态只证明当前提交在临时环境可访问。" : "等待构建完成，不能把排队当成预览通过。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进预览部署流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>生成预览</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={closed}>推送 F5 后关闭 PR</button>
    </div>
  </div>;
}
