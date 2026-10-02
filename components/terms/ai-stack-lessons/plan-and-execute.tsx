"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function PlanAndExecuteLesson() {
  const scene = useScene(5);
  const [failed, setFailed] = useState(false);
  const [repaired, setRepaired] = useState(false);
  useResetOnSceneStart(scene, () => { setFailed(false); setRepaired(false); });
  const blocked = failed && !repaired;
  const testResult = scene.step < 2 ? "等待测试" : blocked ? "11/12 · 失败" : repaired ? "12/12 · 通过（修复后）" : "12/12 · 通过";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="规划与执行演示">
    <Caption scene={scene} labels={["生成计划", "构建完成", "测试返回", "阻塞部署", "插入修复"]} titles={["先列可检查步骤", "前置步骤完成", "失败结果改变计划", "未通过不能部署", "修复后重新验收"]} copy={["发布任务拆为构建、测试、部署。", "构建通过只解锁测试，不代表发布完成。", blocked ? "12 项测试中 1 项失败，结果返回计划器。" : repaired ? "修复后复测返回 12/12，通过条件重新满足。" : "测试结果返回，部署条件可以继续检查。", blocked ? "部署保持锁定，不能把待执行写成已发布。" : "部署节点获得执行资格，但仍要记录结果。", repaired ? "修复步骤已插入，复测证据为 12/12。" : "失败时在此插入修复并重新测试。"]} />
    <button type="button" className={styles.next} onClick={() => { setFailed(true); setRepaired(false); scene.seek(2); }}>模拟测试失败</button>
    {blocked && scene.step >= 3 && <button type="button" className={styles.next} onClick={() => { setRepaired(true); scene.seek(4); }}>插入修复并重测</button>}
    <div className={styles.contract}>{["构建", "测试", "部署"].map((label, index) => <div key={label}><h3>{label}</h3><p>{index === 0 ? scene.step < 1 ? "待执行" : "通过" : index === 1 ? testResult : scene.step < 3 ? "等待测试" : blocked ? "锁定" : "可执行"}</p></div>)}</div>
    <div className={styles.contract}><div>{blocked ? <Warning size={25} /> : <CheckCircle size={25} />}<h3>部署</h3><p>{scene.step < 3 ? "等待测试" : blocked ? "锁定，等待修复" : "获得执行资格"}</p></div><ArrowRight size={20} /><div><FileText size={25} /><h3>计划更新</h3><p>{blocked ? "加入修复→重测" : repaired ? "复测通过，恢复部署" : "保持原计划"}</p></div></div>
  </div>;
}
