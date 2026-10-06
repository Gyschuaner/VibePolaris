"use client";

import { ArrowDown, CheckCircle, ClipboardText, Target, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["空白卡片", "认出角色", "说出任务", "验收结果"];
const captions = [
  "先把“做个按钮”放在桌边；没有用户和目标，卡片还不能进入排期。",
  "角色回答谁在做这件事：月度对账的财务人员，而不是一个模糊的‘用户’。",
  "任务写成可观察的工作：选择月份、导出账单；方案细节先不抢位置。",
  "结果落成检查点：文件能下载、没有账单时也知道下一步，故事才有完成边界。",
];

export function UserStoryHero() {
  const scene = useScene(labels.length);
  const step = scene.step;
  const roleReady = step >= 1;
  const taskReady = step >= 2;
  const resultReady = step >= 3;
  return <MechanismFrame scene={scene} title="一张故事卡怎样长出可验收的目标" labels={labels} caption={captions[step]}>
    <div className={styles.userStoryScene}>
      <div className={styles.storyCard} data-ready={resultReady}>
        <div className={styles.storyCardHead}><ClipboardText size={16} /><span>BACKLOG · STORY</span><strong>{resultReady ? "可检查" : "草稿"}</strong></div>
        <div className={styles.storyField} data-ready={roleReady}><UserCircle size={17} /><div><small>作为</small><strong>{roleReady ? "财务人员" : "谁？"}</strong></div>{roleReady && <CheckCircle size={15} />}</div>
        <div className={styles.storyField} data-ready={taskReady}><Target size={17} /><div><small>我想要</small><strong>{taskReady ? "选择月份并导出账单" : "完成什么？"}</strong></div>{taskReady && <CheckCircle size={15} />}</div>
        <div className={styles.storyField} data-ready={resultReady}><ArrowDown size={17} /><div><small>以便</small><strong>{resultReady ? "交给会计核对" : "得到什么？"}</strong></div>{resultReady && <CheckCircle size={15} />}</div>
      </div>
      <div className={styles.storyChecklist} data-ready={resultReady}>
        <div className={styles.storyChecklistHead}><span>验收结果</span>{resultReady ? <CheckCircle size={16} /> : <WarningCircle size={16} />}</div>
        <p data-on={resultReady}>能选择月份并下载账单</p>
        <p data-on={resultReady}>没有账单时说明下一步</p>
        <small>{resultReady ? "结果可以被人和测试共同检查" : "故事还没有说清怎样算完成"}</small>
      </div>
    </div>
  </MechanismFrame>;
}
