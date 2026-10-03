"use client";

import { ArrowCounterClockwise, ArrowRight, ChartLineUp, CheckCircle, Database, GitCommit, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function RollbackLesson() {
  const scene = useScene(3);
  const switched = scene.step >= 1;
  const verified = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="生产故障回滚到稳定制品并验证恢复演示">
    <Caption
      scene={scene}
      labels={["确认故障", "切回稳定制品", "验证与补偿"]}
      titles={["先确认当前版本和故障证据", "只切换生产指针，不在故障现场重建", "恢复服务后单独处理数据和外部副作用"]}
      copy={[
        "production 正在服务 v42，错误率从 0.4% 升到 8.7%；先记录影响范围，并确认保留的 v41 可直接使用。",
        "把流量指针从 v42 切回已保留的 v41；回滚动作缩短恢复时间，但不会撤销 v42 已写入的订单或消息。",
        "健康检查和关键冒烟恢复；数据库保持兼容读取，无法兼容的写入进入补偿分支。v42 留作调查，修复完成后再重新发布。",
      ]}
    />
    <div className={styles.rollbackBoard} aria-live="polite">
      <div data-active={!switched} data-failed={!verified}>
        {verified ? <GitCommit size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>production · v42</strong>
        <code>{verified ? "retained · investigate" : "error rate 8.7%"}</code>
        <span>{verified ? "坏版本仍可用于排查" : "当前流量正在命中故障版本"}</span>
      </div>
      <ArrowRight className={styles.rollbackArrow} size={19} aria-hidden="true" />
      <div data-active={switched}>
        <ArrowCounterClockwise size={23} aria-hidden="true" />
        <strong>{switched ? "route → v41" : "rollback target · v41"}</strong>
        <code>{switched ? "existing artifact · no rebuild" : "known good · eligible"}</code>
        <span>{switched ? "流量指针已切回稳定制品" : "先从部署历史确认版本"}</span>
      </div>
      <ArrowRight className={styles.rollbackArrow} size={19} aria-hidden="true" />
      <div data-active={verified} data-blocked={switched && !verified}>
        {verified ? <CheckCircle size={23} aria-hidden="true" /> : <ChartLineUp size={23} aria-hidden="true" />}
        <strong>{verified ? "health + smoke · pass" : "恢复检查"}</strong>
        <code>{verified ? "5xx ↓ · core flow OK" : switched ? "等待指标与冒烟" : "尚未切流"}</code>
        <span>{verified ? "服务恢复，继续调查 v42" : "没有证据就不能宣布回滚成功"}</span>
      </div>
      <div className={styles.rollbackProof} data-active={verified}>
        <Database size={21} aria-hidden="true" />
        <p><strong>数据边界</strong>{verified ? " 生产回滚切的是运行版本，不是 git revert/reset；兼容读取转绿，不兼容写入和外部消息要走补偿。" : " 回滚代码不等于撤销数据库写入。"}</p>
        <ShieldCheck size={21} aria-hidden="true" />
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进回滚流程">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>切回 v41</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={verified}>验证并处理副作用</button>
    </div>
  </div>;
}
