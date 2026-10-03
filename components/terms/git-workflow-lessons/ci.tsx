"use client";

import { ArrowRight, CheckCircle, FileText, GitCommit, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function CiLesson() {
  const scene = useScene(3);
  const running = scene.step >= 1;
  const finished = scene.step === 2;
  const status = finished ? "success" : running ? "failure" : "pending";
  const commit = finished ? "F5" : "F4";
  const run = finished ? "#43" : "#42";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="持续集成从提交触发到状态门禁演示">
    <Caption
      scene={scene}
      labels={["提交触发", "并行作业", "汇总门禁"]}
      titles={["先把这次提交登记为输入", "独立检查同时留下各自证据", "汇总状态只决定已配置的门禁"]}
      copy={[
        "提交 F4 推到 feature；工作流收到 push 事件并排队，当前还没有通过结论。",
        "lint、unit test 和 build 在各自作业里运行；unit test 的日志出现一个失败，其他结果不能把它覆盖。",
        "汇总状态读取本次提交的检查结果：失败会阻止受保护分支合并；修复后应对新的提交重新运行。",
      ]}
    />
    <div className={styles.ciBoard} aria-live="polite">
      <div data-active={!running}>
        <GitCommit size={23} aria-hidden="true" />
        <strong>提交 {commit}</strong>
        <code>{running ? `push → workflow run ${run}` : "push → 排队"}</code>
        <span>{running ? `当前检查绑定 ${commit}` : "还没有检查结论"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div className={styles.ciJobs} data-active={running}>
        <div className={styles.ciJob}><FileText size={19} aria-hidden="true" /><strong>lint</strong><code>{running ? "success" : "等待"}</code></div>
        <div className={styles.ciJob} data-failed={running && !finished}><WarningCircle size={19} aria-hidden="true" /><strong>unit test</strong><code>{running ? (finished ? "success after fix" : "failure · 1 case") : "等待"}</code></div>
        <div className={styles.ciJob}><FileText size={19} aria-hidden="true" /><strong>build</strong><code>{running ? "success" : "等待"}</code></div>
        <span className={styles.ciJobNote}>{running ? (finished ? "每个作业都有独立日志；修复后按新提交重跑" : "失败作业的日志保留触发位置和退出结果") : "没有声明的作业不会凭空出现"}</span>
      </div>
      <ArrowRight size={19} aria-hidden="true" />
      <div data-active={finished} data-blocked={running && !finished}>
        {finished ? <CheckCircle size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>status: {status}</strong>
        <code>{finished ? "required check 可继续" : running ? "required check 阻止合并" : "等待作业完成"}</code>
        <span>{finished ? "结论绑定修复后的新提交" : running ? "先看 unit test 日志并修复" : "事件已排队，尚未产生结果"}</span>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进持续集成流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>运行并行检查</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={finished}>修复后重跑</button>
    </div>
  </div>;
}
