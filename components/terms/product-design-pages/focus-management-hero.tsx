"use client";

import { ArrowUUpLeft, CursorText, DoorOpen, Keyboard, X } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["打开前", "进入对话框", "Tab 继续", "关闭返回"];
const captions = [
  "焦点在触发按钮上，背景页面是当前任务。",
  "打开对话框后，焦点随任务一起进入里面的第一个控件。",
  "Tab 只在对话框控件之间移动，背景按钮暂时不插队。",
  "关闭后把焦点送回触发点，用户能接着原来的操作。",
];

export function FocusManagementHero() {
  const scene = useScene(labels.length);
  const [open, setOpen] = useState(false);
  const step = scene.step;
  const dialogActive = open || step >= 1;
  const active = step === 0 ? "trigger" : step === 1 ? "field" : step === 2 ? "save" : "trigger";
  return <MechanismFrame scene={scene} title="焦点这束光，打开后落在哪里" labels={labels} caption={captions[step]}>
    <div className={styles.focusScene}>
      <div className={styles.focusRail}><div className={styles.focusRailHead}><Keyboard size={15} />BACKGROUND</div><button className={styles.focusControl} data-active={active === "trigger"} type="button" onClick={() => { setOpen(true); scene.seek(1); }}><DoorOpen size={14} />打开设置<small>trigger</small></button><button className={styles.focusControl} data-active={false} type="button" tabIndex={dialogActive ? -1 : 0}>删除账户<small>background</small></button></div>
      <div className={styles.focusDialog}><div className={styles.focusDialogHead}><CursorText size={15} />CURRENT TASK · {dialogActive ? "DIALOG OPEN" : "CLOSED"}</div>{dialogActive ? <div className={styles.focusDialogCard} role="dialog" aria-modal="true" aria-label="设置对话框"><strong>设置</strong><small>焦点应在这个任务里连续移动。</small><button className={styles.focusControl} data-active={active === "field"} type="button" onClick={() => scene.seek(2)}>字体大小<small>Tab 1</small></button><div className={styles.focusDialogActions}><button className={styles.focusControl} data-active={active === "save"} type="button" onClick={() => scene.seek(2)}>保存<small>Tab 2</small></button><button className={styles.focusControl} type="button" onClick={() => { setOpen(false); scene.seek(3); }}><X size={14} />关闭</button></div></div> : <div className={styles.focusDialogCard}><strong>等待打开</strong><small>还没有需要接管的焦点。</small></div>}</div>
      <div className={styles.focusProof} role="status"><ArrowUUpLeft size={16} /><strong>{step === 3 ? "activeElement → 打开设置" : dialogActive ? `activeElement → ${active === "field" ? "字体大小" : "保存"}` : "activeElement → 打开设置"}</strong><span>{step === 2 ? "Tab 在当前任务内走" : step === 3 ? "回到触发点" : "焦点跟着任务状态"}</span></div>
    </div>
  </MechanismFrame>;
}
