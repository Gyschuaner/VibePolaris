"use client";

import { useState, type ReactNode } from "react";
import { ArrowCounterClockwise, ArrowRight, Check, CheckCircle, GitCommit, GitBranch, Graph, ShieldWarning, TestTube, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./TestSecuritySignatureHeroes.module.css";

type Scene = ReturnType<typeof useScene>;
type Icon = typeof CheckCircle;

function SignatureFrame({ scene, label, eyebrow, meta, steps, children, status, caption, controls }: {
  scene: Scene;
  label: string;
  eyebrow: string;
  meta: string;
  steps: string[];
  children: ReactNode;
  status: { icon: Icon; title: string; detail: string; danger?: boolean };
  caption: string;
  controls?: ReactNode;
}) {
  const StatusIcon = status.icon;
  return <figure ref={scene.ref} className={styles.frame} data-step={scene.step} aria-label={label}>
    <div className={styles.topline}><span>{eyebrow}</span><code>{meta}</code></div>
    {controls}
    <SceneControls scene={scene} labels={steps} />
    {children}
    <div className={styles.status} data-danger={status.danger} role="status"><StatusIcon size={18} aria-hidden="true" /><span><strong>{status.title}</strong> · {status.detail}</span></div>
    <figcaption>{caption}</figcaption>
  </figure>;
}

const regressionSteps = ["挂起差异", "展开旧行为", "叠加风险", "钉住倒退"];

export function RegressionTestSignatureHero() {
  const scene = useScene(regressionSteps.length);
  const [includeHistory, setIncludeHistory] = useState(true);
  const failed = scene.step === 3 && includeHistory;
  const choose = (next: boolean) => { setIncludeHistory(next); scene.seek(0); };
  const status = failed
    ? { icon: WarningCircle, title: "旧承诺被拉坏", detail: "admin-list-as-editor 期待 403，实际得到 200", danger: true }
    : scene.step === 3
      ? { icon: ShieldWarning, title: "证据还不完整", detail: "只看影响关系，历史越权风险仍未入选" }
      : { icon: scene.step === 0 ? GitCommit : Graph, title: regressionSteps[scene.step], detail: scene.step === 0 ? "先找到真正改变行为的那根绳结" : "先保留证据，结论要等选集跑完" };
  return <SignatureFrame scene={scene} label="回归测试把一次鉴权改动拉到旧行为和历史风险上" eyebrow="旧行为是一根会被改动牵动的标尺" meta="change → behavior → evidence" steps={regressionSteps} status={status} caption="回归测试守的是已经存在的行为承诺。范围可以很小，但必须能解释为什么这几条旧路径被重新检查。" controls={<div className={styles.choiceRow} role="group" aria-label="是否纳入历史风险"><button type="button" aria-pressed={!includeHistory} onClick={() => choose(false)}>只看直接影响</button><button type="button" aria-pressed={includeHistory} onClick={() => choose(true)}>补入历史风险</button></div>}>
    <div className={styles.regressionBoard} data-history={includeHistory} data-failed={failed}>
      <div className={styles.regressionCommit} data-active={scene.step === 0} data-done={scene.step > 0}>
        <span className={styles.label}><GitCommit size={16} aria-hidden="true" />变更</span>
        <strong>auth middleware</strong>
        <code>- role=user<br />+ policy.check()</code>
        <small>一处改动，先从这里开始追。</small>
      </div>
      <ArrowRight className={styles.boardArrow} size={19} aria-hidden="true" />
      <div className={styles.regressionRope}>
        <div className={styles.ropeHeader}><span><Graph size={16} aria-hidden="true" />旧行为</span><code>{includeHistory ? "4 条可见 · 1 条历史" : "4 条可见"}</code></div>
        <div className={styles.behaviorLine}>
          {[
            ["登录", "继续通过", "direct"],
            ["订单", "仍能下单", "shared"],
            ["后台", "应为 403", "history"],
          ].map(([name, result, kind], index) => <div key={name} className={styles.behaviorPin} data-active={scene.step >= 1 && (index < 2 || includeHistory)} data-danger={index === 2 && failed}><i /><strong>{name}</strong><span>{result}</span><code>{kind}</code></div>)}
        </div>
        <small className={styles.ropeNote}>{scene.step < 1 ? "改动还没有拉动任何旧路径" : scene.step === 1 ? "共享鉴权规则的旧行为被唤醒" : includeHistory ? "历史越权也被补进同一条证据线" : "影响图外的历史风险仍留在阴影里"}</small>
      </div>
      <ArrowRight className={styles.boardArrow} size={19} aria-hidden="true" />
      <div className={styles.regressionResult} data-active={scene.step >= 2} data-danger={failed}>
        <span className={styles.label}><TestTube size={16} aria-hidden="true" />回归证据</span>
        <strong>{scene.step < 2 ? "等待运行" : failed ? "403 → 200" : includeHistory ? "14 / 32" : "11 / 32"}</strong>
        <code>{scene.step < 2 ? "PENDING" : failed ? "STOP · 修权限" : includeHistory ? "impact + history" : "impact only"}</code>
        <small>{scene.step < 2 ? "选集还没有跑" : failed ? "绿色不能盖住这处倒退" : "范围仍可追溯"}</small>
      </div>
    </div>
  </SignatureFrame>;
}
