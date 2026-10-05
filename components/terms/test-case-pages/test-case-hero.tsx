"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, ClipboardText, Eye, Key, PaperPlaneTilt, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./TestCaseConcept.module.css";

const steps = [
  { label: "看见模糊句", title: "“应该失败”还不是判定", detail: "没有状态码、令牌状态和副作用，任何人都能用自己的方式解释它。", Icon: ClipboardText },
  { label: "固定起点", title: "让每次执行从同一扇门开始", detail: "账号是 active，令牌已经过期 10 分钟；前置状态不再靠记忆。", Icon: UserCircle },
  { label: "写出动作", title: "把描述落到一次真实请求", detail: "POST /password/reset，带上过期 token，只发送一次。", Icon: PaperPlaneTilt },
  { label: "拆出证据", title: "把“失败”拆成三个可观察事实", detail: "HTTP 410、令牌未消费、邮件没有发出。", Icon: Eye },
  { label: "重复执行", title: "清理后重跑，结论仍然相同", detail: "3/3 观察点匹配，两次都 PASS；这才是一条别人接得住的用例。", Icon: CheckCircle },
];

type CaseMode = "complete" | "vague";

export function TestCaseHero() {
  const scene = useScene(steps.length);
  const [mode, setMode] = useState<CaseMode>("complete");
  const current = steps[scene.step];
  const complete = mode === "complete";
  const resultReady = scene.step >= 3 && complete;
  const final = scene.step === steps.length - 1;
  const failed = final && !complete;
  const setCaseMode = (next: CaseMode) => { setMode(next); scene.seek(0); };

  return <figure ref={scene.ref} className={styles.caseHero} data-step={scene.step} data-mode={mode} aria-label="测试用例如何从密码重置的模糊要求变成可重复判定的检查">
    <div className={styles.caseHeroHeader}><span>一条“应失败”怎样长出自己的证据</span><strong>arrange → act → observe</strong></div>
    <div className={styles.caseHeroChoices} role="group" aria-label="选择用例写法"><button type="button" className={styles.caseChoice} aria-pressed={complete} onClick={() => setCaseMode("complete")}>补齐可判定预期</button><button type="button" className={styles.caseChoice} aria-pressed={!complete} onClick={() => setCaseMode("vague")}>只写“应该失败”</button></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.caseHeroRail} aria-label="测试用例组成步骤">{steps.map((step, index) => <div key={step.label} className={styles.caseHeroStop} data-active={scene.step === index} data-done={scene.step > index}><span><step.Icon aria-hidden="true" /></span><strong>{step.label}</strong></div>)}</div>
    <div className={styles.caseHeroBoard}>
      <div className={styles.caseHeroCard} data-active={scene.step === 0} data-done={scene.step > 0}>
        <div className={styles.caseHeroLabel}><ClipboardText size={17} aria-hidden="true" /><span>草稿</span></div>
        <h3>密码重置</h3>
        <code>{complete ? "expired token should be rejected" : "password reset should fail"}</code>
        <p>{scene.step === 0 ? "标题先把风险叫出来，但还不能执行。" : "风险句保留，细节开始补上。"}</p>
      </div>
      <div className={styles.caseHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.caseHeroCard} data-active={scene.step === 1} data-done={scene.step > 1}>
        <div className={styles.caseHeroLabel}><UserCircle size={17} aria-hidden="true" /><span>起点 · Arrange</span></div>
        <h3>同一个现场</h3>
        <div className={styles.caseHeroFacts}><span><strong>user</strong><code>u-42 · active</code></span><span><strong>token</strong><code>{scene.step >= 1 ? "expired · -10m" : "未设置"}</code></span></div>
        <p>{scene.step < 1 ? "还不知道谁在执行。" : "账号和输入状态已经固定。"}</p>
      </div>
      <div className={styles.caseHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.caseHeroCard} data-active={scene.step === 2} data-done={scene.step > 2}>
        <div className={styles.caseHeroLabel}><PaperPlaneTilt size={17} aria-hidden="true" /><span>动作 · Act</span></div>
        <h3>只发一次请求</h3>
        <code>{scene.step >= 2 ? "POST /password/reset" : "等待操作"}</code>
        <p>{scene.step < 2 ? "输入和动作还没有落地。" : "请求路径、输入和次数都写进用例。"}</p>
      </div>
      <div className={styles.caseHeroArrow} aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className={styles.caseHeroCard} data-active={scene.step >= 3} data-danger={failed}>
        <div className={styles.caseHeroLabel}>{failed ? <WarningCircle size={17} aria-hidden="true" /> : resultReady ? <CheckCircle size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}<span>证据 · Observe</span></div>
        <h3>{failed ? "不可判定" : final ? "两次结果相同" : "等待观察点"}</h3>
        <div className={styles.caseHeroAssertions}><span>HTTP <strong>{scene.step >= 3 && complete ? "410" : "—"}</strong></span><span>token <strong>{scene.step >= 3 && complete ? "未消费" : "—"}</strong></span><span>邮件 <strong>{scene.step >= 3 && complete ? "0 封" : "—"}</strong></span></div>
        <div className={styles.caseHeroSeal} data-danger={failed}>{failed ? "NOT RUNNABLE · expected missing" : final ? "PASS ×2 · 3/3 matched" : "尚未运行"}</div>
        <p>{failed ? "只写“失败”无法告诉执行者该看哪里。" : final ? "清理后重跑，结论仍可复现。" : "把结果拆成能被观察的事实。"}</p>
      </div>
    </div>
    <div className={styles.caseHeroMetrics}><div><span>前置条件</span><strong>{scene.step >= 1 && complete ? "2 项已固定" : "未完整"}</strong></div><div><span>可观察断言</span><strong>{scene.step >= 3 && complete ? "3 项" : "—"}</strong></div><div><span>结论</span><strong>{failed ? "无法判定" : final ? "PASS ×2" : "编写中"}</strong></div></div>
    <div className={styles.caseHeroStatus} data-danger={failed} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {failed ? "没有预期结果，测试还不能运行。" : current.detail}</span></div>
    <figcaption>测试用例不是一句“测一下”，而是一条从已知起点出发、执行明确动作、最后能用观察事实判定的短路径。</figcaption>
  </figure>;
}
