"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, LockSimple, ShieldCheck, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ToolApprovalLesson() {
  const scene = useScene(4);
  const [selected, setSelected] = useState({ A: true, B: true, C: false });
  const [decided, setDecided] = useState(false);
  useEffect(() => {
    if (scene.step < 3) {
      setSelected({ A: true, B: true, C: false });
      setDecided(false);
    } else {
      setDecided(true);
    }
  }, [scene.step]);
  const toggle = (key: keyof typeof selected) => setSelected((current) => ({ ...current, [key]: !current[key] }));
  const approved = decided ? ["A", "B"].filter((key) => selected[key as keyof typeof selected]).length : 0;
  const stageTitle = decided ? "已执行批准项" : scene.step === 0 ? "调用请求" : scene.step === 1 ? "审批暂停" : "参数已展开";
  const stageCopy = decided ? `${approved} 项调用返回；C 保持不变` : scene.step === 0 ? "模型只提出 delete_file，执行尚未发生" : scene.step === 1 ? "执行器暂停，等待授权人查看范围" : "路径和可恢复性已显示，可逐项决定";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工具逐项审批演示">
    <Caption scene={scene} labels={["提出删除请求", "暂停等待审批", "逐项查看参数", "执行批准项"]} titles={["执行尚未发生", "审批卡显示完整范围", "C 是不可恢复操作", "只执行批准项"]} copy={["工具准备删除三个文件；此时磁盘没有变化。", "审批发生在执行前，授权人看得到完整路径、参数和影响。", "A、B 可恢复，C 标记为不可恢复；一次“确认”不能替代逐项判断。", decided ? `批准 ${approved} 项、拒绝 ${3 - approved} 项；C 保持不变并写入审计记录。` : "选定具体项后，提交一次有范围的审批决定。"]} />
    <div className={styles.choices} role="group" aria-label="选择要批准的文件">{scene.step < 2 ? <p className={styles.inputExample}><strong>{scene.step === 0 ? "待生成审批卡" : "暂停中"}</strong>{scene.step === 0 ? "执行器还没有收到调用。" : "展开参数后才能判断每个文件的影响。"}</p> : <>{(["A", "B", "C"] as const).map((key) => <label key={key}><input type="checkbox" checked={selected[key]} disabled={key === "C" || decided} onChange={() => toggle(key)} />{key === "C" ? "C · /prod.db（不可恢复）" : `${key} · /tmp/report-${key.toLowerCase()}.csv（可恢复）`}</label>)}<button type="button" onClick={() => { setDecided(true); scene.seek(3); }} aria-pressed={decided}>提交审批决定</button></>}</div>
    <div className={styles.contract}><div><LockSimple size={25} /><h3>{stageTitle}</h3><p>{stageCopy}</p></div><ArrowRight size={20} /><div>{decided ? <ShieldCheck size={25} /> : <Warning size={25} />}<h3>执行器</h3><p>{decided ? `已执行 ${approved} 项；C 未改变` : "等待决定，尚未执行"}</p></div><ArrowRight size={20} /><div><CheckCircle size={25} /><h3>副作用</h3><p>{decided ? "拒绝项没有文件变化" : "尚无文件变化"}</p></div></div>
    <p className={styles.inputExample}><strong>审批边界</strong>审批只回答这一次具体调用；工具能力和资源权限仍需在执行处持续校验。</p>
  </div>;
}
