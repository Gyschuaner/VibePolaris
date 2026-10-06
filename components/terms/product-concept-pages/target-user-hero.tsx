"use client";

import { CheckCircle, CirclesThree, FileText, Funnel, Target, UsersThree } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["散开的访客", "按任务聚类", "补上限制", "圈定本期"];
const captions = [
  "‘所有用户’是一片散点；它还没有告诉团队先研究谁。",
  "把相似任务放到同一托盘：每月批量导出的财务人员成为一组。",
  "补上频率、权限和环境，组才真正能指导默认值、入口与支持方式。",
  "画出本期范围：先服务这组人的导出任务，同时把其他组留在下一轮研究。",
];

export function TargetUserHero() {
  const scene = useScene(labels.length);
  const step = scene.step;
  const clustered = step >= 1;
  const scoped = step >= 3;
  return <MechanismFrame scene={scene} title="目标用户怎样从散点收成一块服务范围" labels={labels} caption={captions[step]}>
    <div className={styles.targetScene}>
      <div className={styles.targetConstellation} data-clustered={clustered} data-scoped={scoped}>
        <div className={styles.targetConstellationHead}><CirclesThree size={16} /><span>RESEARCH SIGNALS</span><strong>{clustered ? "按任务聚类" : "所有用户"}</strong></div>
        <div className={styles.targetDots} aria-label="不同使用任务的研究信号"><i data-group="finance" /><i data-group="finance" /><i data-group="support" /><i data-group="casual" /><i data-group="finance" /><i data-group="support" /><i data-group="casual" /><i data-group="finance" /></div>
        <div className={styles.targetLegend}><span><i data-group="finance" />批量导出</span><span><i data-group="support" />临时查账</span><span><i data-group="casual" />偶尔查看</span></div>
      </div>
      <div className={styles.targetScope} data-scoped={scoped}>
        <div className={styles.targetScopeHead}><UsersThree size={16} /><span>优先托盘</span></div>
        <div className={styles.targetTray}><div className={styles.targetTrayTitle}><Target size={15} /><strong>{clustered ? "财务人员" : "待命名"}</strong></div><p>{clustered ? "每月批量导出 · 需核对字段" : "共同任务还没出现"}</p><small>{scoped ? "本期先服务" : "还要补频率和权限"}</small></div>
        <div className={styles.targetBoundary}><Funnel size={14} /><span>{scoped ? "范围：导出账单" : "范围尚未收窄"}</span>{scoped && <CheckCircle size={15} />}</div>
        <div className={styles.targetProof} role="status">{scoped ? "未覆盖组：进入下一轮研究" : "人口标签不能替代任务证据"}</div>
      </div>
      <div className={styles.targetFooter}><FileText size={15} /><span>{scoped ? "目标用户是可修正的研究结论" : "把行为和限制先摆上桌"}</span></div>
    </div>
  </MechanismFrame>;
}
