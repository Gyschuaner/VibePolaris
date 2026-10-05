"use client";

import { useState } from "react";
import { ArrowCounterClockwise, CheckCircle, Code, Eye, GitDiff, Hourglass, MagnifyingGlass, Timer, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./AssertionConcept.module.css";

const labels = ["写下条件", "点击动作", "等待变化", "读差异", "迁移断言"];
type Oracle = "visible" | "internal";
type WaitMode = "condition" | "sleep";

export function AssertionLesson() {
  const scene = useScene(labels.length);
  const [oracle, setOracle] = useState<Oracle>("visible");
  const [waitMode, setWaitMode] = useState<WaitMode>("condition");
  const [delay, setDelay] = useState<1500 | 4000>(1500);
  const final = scene.step === labels.length - 1;
  const delayed = waitMode === "sleep" && delay > 1000;
  const weak = final && oracle === "internal";
  const failed = final && delayed && oracle === "visible";
  const outcome = !final ? "未判定" : failed ? "FAIL · 1s 太早" : weak ? "WEAK · internal" : "PASS · visible";
  const reset = (next: () => void) => { next(); scene.seek(0); };

  return <div ref={scene.ref} className={styles.assertLab} role="region" aria-label="断言工作台：选择观察对象和等待方式，查看失败差异">
    <div className={styles.assertLabHeader}><span>把“保存成功”写成别人能复现的证据</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.assertLabControls} role="group" aria-label="选择断言观察对象与等待方式"><div><span>断言保护什么</span><button type="button" className={styles.assertLabButton} aria-pressed={oracle === "visible"} onClick={() => reset(() => setOracle("visible"))}>用户看到的 visible</button><button type="button" className={styles.assertLabButton} aria-pressed={oracle === "internal"} onClick={() => reset(() => setOracle("internal"))}>内部 saving=false</button></div><div><span>等待怎么结束</span><button type="button" className={styles.assertLabButton} aria-pressed={waitMode === "condition"} onClick={() => reset(() => setWaitMode("condition"))}>等条件</button><button type="button" className={styles.assertLabButton} aria-pressed={waitMode === "sleep"} onClick={() => reset(() => setWaitMode("sleep"))}>sleep(1000)</button></div></div>
    <div className={styles.assertLabControls} role="group" aria-label="调整工作台响应延迟"><div><span>服务响应</span><button type="button" className={styles.assertLabButton} aria-pressed={delay === 1500} onClick={() => reset(() => setDelay(1500))}>1.5 s</button><button type="button" className={styles.assertLabButton} aria-pressed={delay === 4000} onClick={() => reset(() => setDelay(4000))}>4 s</button></div><div><span>这一步的提示</span><span className={styles.assertRange}><Hourglass size={15} aria-hidden="true" />{delayLabel(delay)} 后 DOM 才改变</span></div></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.assertLabGrid}>
      <div className={styles.assertPanel} data-active={scene.step === 0}>
        <div className={styles.assertPanelLabel}><Code size={16} aria-hidden="true" /><span>Expected · 期待</span></div>
        <h3>{oracle === "visible" ? "用户能看到完成" : "内部 saving=false"}</h3>
        <code>{oracle === "visible" ? "expect(button).toBeVisible()" : "expect(state.saving).toBe(false)"}</code>
        <small>{oracle === "visible" ? "把断言贴在读者真正关心的结果上。" : "实现细节可以变化，页面仍可能没有完成。"}</small>
      </div>
      <div className={styles.assertPanel} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.assertPanelLabel}><Timer size={16} aria-hidden="true" /><span>Wait · 等待</span></div>
        <h3>{waitMode === "condition" ? "读取目标直到成立" : "到点只看一次"}</h3>
        <div className={styles.assertPanelValue}><span>deadline</span><strong>{waitMode === "condition" ? "5s" : "1s"}</strong></div>
        <small>{waitMode === "condition" ? "条件断言会在期限内重新取值。" : "固定睡眠没有看见状态是否已经到达。"}</small>
      </div>
      <div className={styles.assertPanel} data-active={scene.step === 3} data-danger={failed} data-weak={weak}>
        <div className={styles.assertPanelLabel}>{failed || weak ? <WarningCircle size={16} aria-hidden="true" /> : <MagnifyingGlass size={16} aria-hidden="true" />}<span>Actual · 实际</span></div>
        <h3>{scene.step < 3 ? "还没取到新状态" : delay <= 1000 ? "按钮已 visible" : "按钮在 " + delayLabel(delay) + " 后出现"}</h3>
        <div className={styles.assertPanelValue}><span>DOM</span><strong>{scene.step >= 3 ? "visible" : "hidden"}</strong></div>
        <small>{scene.step < 3 ? "动作已发生，但证据尚未产生。" : "把实际值和期待值放在同一张差异里。"}</small>
      </div>
      <div className={styles.assertPanel} data-active={scene.step === 4} data-danger={failed} data-weak={weak} data-good={final && !failed && !weak}>
        <div className={styles.assertPanelLabel}>{failed || weak ? <WarningCircle size={16} aria-hidden="true" /> : final ? <CheckCircle size={16} aria-hidden="true" /> : <GitDiff size={16} aria-hidden="true" />}<span>Verdict · 结论</span></div>
        <h3>{outcome}</h3>
        <div className={styles.assertPanelBig}>{final ? (failed ? "1s ≠ visible" : weak ? "实现 ≠ 行为" : "visible = true") : "—"}</div>
        <small>{!final ? "先让事实抵达，再比较。" : failed ? "不是把 sleep 调成 2 秒就完事；应该等待状态，或承认这条检查的期限。" : weak ? "内部变量绿了，用户界面仍可能坏；换成可观察结果才有业务证据。" : "断言现在绑定了状态，而不是猜响应会在第几毫秒完成。"}</small>
      </div>
    </div>
    <div className={styles.assertTimeline}><div data-on={scene.step >= 0}><Code size={15} aria-hidden="true" /><span>写条件</span></div><div data-on={scene.step >= 1}><ArrowCounterClockwise size={15} aria-hidden="true" /><span>发动作</span></div><div data-on={scene.step >= 2}><Hourglass size={15} aria-hidden="true" /><span>等状态</span></div><div data-on={scene.step >= 4} data-danger={failed}><Eye size={15} aria-hidden="true" /><span>解释差异</span></div></div>
    <div className={styles.assertLabMetrics}><div><span>观察对象</span><strong>{oracle === "visible" ? "用户状态" : "内部变量"}</strong></div><div><span>同步点</span><strong>{waitMode === "condition" ? "条件成立" : "固定 1s"}</strong></div><div><span>结论</span><strong>{outcome}</strong></div></div>
    <p className={styles.assertLabNote} data-danger={failed} data-weak={weak} role="status">{!final ? <><Hourglass size={17} aria-hidden="true" /><span>断言要等真正的观察点出现；在它出现以前，测试只有过程，没有结论。</span></> : failed ? <><WarningCircle size={17} aria-hidden="true" /><span>固定等待把时间当成事实。把 <code>sleep(1000)</code> 换成条件断言，让失败说明“状态没到”，而不是说明“这一秒没到”。</span></> : weak ? <><WarningCircle size={17} aria-hidden="true" /><span>内部变量是线索，不一定是用户契约。断言应尽量靠近可见状态、响应或持久化结果。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>一条好断言同时说清期待、实际、等待上限和失败差异；它让下一步排查有方向。</span></>}</p>
  </div>;
}

function delayLabel(value: number) { return value < 1000 ? value + " ms" : (value / 1000).toFixed(1) + " s"; }
