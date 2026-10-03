"use client";

import { ArrowRight, CheckCircle, ClipboardText, FileText, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function TargetUserLesson() {
  const scene = useScene(3);
  const groupsReady = scene.step >= 1;
  const scopeReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从人口标签划分到任务分组并确定目标用户演示">
    <Caption
      scene={scene}
      labels={["人口标签", "任务分组", "确定本期范围"]}
      titles={["先看见标签为什么不够", "把任务、频率和环境放到一起", "选择本期优先服务的用户"]}
      copy={[
        "“20–40 岁用户”把人按年龄放在一起，却没有说明他们要完成什么任务。",
        "财务专员每月批量导出并核对字段；普通员工偶尔下载自己的报销记录。两组人的频率、权限和成功标准不同。",
        "本期优先支持财务批量导出，普通员工自助下载留到下一阶段；范围决定字段、性能、入口和研究对象。",
      ]}
    />
    <div className={styles.targetUserBoard} aria-live="polite">
      <div className={styles.targetUserCard} data-active={!groupsReady} data-muted={groupsReady}>
        {groupsReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>人口标签</strong>
        <code>20–40 岁用户</code>
        <span>{groupsReady ? "先保留，不作为分组依据" : "任务差异看不见"}</span>
      </div>
      <ArrowRight className={styles.targetUserArrow} size={19} aria-hidden="true" />
      <div className={styles.targetUserCard} data-active={groupsReady} data-muted={!groupsReady}>
        <UserCircle size={23} aria-hidden="true" />
        <strong>{groupsReady ? "任务分组" : "需要补齐"}</strong>
        <code>{groupsReady ? "财务专员 · 每月批量导出" : "谁 · 做什么 · 多久一次"}</code>
        <span>{groupsReady ? "普通员工 · 偶尔下载报销记录" : "能力、权限和环境也要看"}</span>
      </div>
      <ArrowRight className={styles.targetUserArrow} size={19} aria-hidden="true" />
      <div className={styles.targetUserCard} data-active={scopeReady} data-muted={!scopeReady}>
        {scopeReady ? <CheckCircle size={23} aria-hidden="true" /> : <ClipboardText size={23} aria-hidden="true" />}
        <strong>{scopeReady ? "本期目标用户" : "范围决定"}</strong>
        <code>{scopeReady ? "财务批量导出 · 优先支持" : "谁先被服务"}</code>
        <span>{scopeReady ? "普通员工自助下载 · 下一阶段" : "还不能排功能优先级"}</span>
      </div>
      <div className={styles.targetUserProof} data-ready={scopeReady}>
        <ClipboardText size={21} aria-hidden="true" />
        <p><strong>{scopeReady ? "范围可被复述" : "目标用户还没站稳"}</strong>{scopeReady ? " 任务、频率、权限和环境都能解释本期取舍。" : " 不要用一个漂亮的人口标签替代真实任务。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进目标用户演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>按任务分组</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={scopeReady}>确定本期范围</button>
    </div>
  </div>;
}
