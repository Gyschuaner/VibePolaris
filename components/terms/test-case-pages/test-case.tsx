"use client";

import { useState } from "react";
import { CheckCircle, Database, EnvelopeSimple, Eye, Key, ListChecks, PaperPlaneTilt, ShieldWarning, Timer, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./TestCaseConcept.module.css";

const labels = ["读懂草稿", "固定前置", "写出动作", "列出预期", "重跑确认"];
type EvidenceMode = "all" | "http";
type FixtureMode = "fixed" | "loose";

export function TestCaseLesson() {
  const scene = useScene(labels.length);
  const [evidence, setEvidence] = useState<EvidenceMode>("all");
  const [fixture, setFixture] = useState<FixtureMode>("fixed");
  const final = scene.step === labels.length - 1;
  const complete = evidence === "all" && fixture === "fixed";
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const outcome = !final ? "未运行" : complete ? "PASS · 3/3" : evidence === "http" ? "WEAK · 1/3" : "FLAKY · 起点漂移";

  return <div ref={scene.ref} className={styles.caseLab} role="region" aria-label="测试用例从前置条件到可观察结果的编辑与执行工作台">
    <div className={styles.caseLabHeader}><span>把“失败”拆成执行者能核对的三张回执</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.caseLabControls} role="group" aria-label="选择测试用例证据与前置条件"><div><span>证据范围</span><button type="button" className={styles.caseLabButton} aria-pressed={evidence === "all"} onClick={() => reset(() => setEvidence("all"))}>HTTP + DB + Mail</button><button type="button" className={styles.caseLabButton} aria-pressed={evidence === "http"} onClick={() => reset(() => setEvidence("http"))}>只看 HTTP</button></div><div><span>执行起点</span><button type="button" className={styles.caseLabButton} aria-pressed={fixture === "fixed"} onClick={() => reset(() => setFixture("fixed"))}>固定过期令牌</button><button type="button" className={styles.caseLabButton} aria-pressed={fixture === "loose"} onClick={() => reset(() => setFixture("loose"))}>任意令牌</button></div></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.caseLabGrid}>
      <div className={styles.caseLabPanel} data-active={scene.step === 0} data-soft="true">
        <div className={styles.caseLabLabel}><ListChecks size={16} aria-hidden="true" /><span>Arrange · 前置</span></div>
        <h3>把起点钉住</h3>
        <div className={styles.caseLabValue}><span>账号</span><strong>u-42 · active</strong></div>
        <div className={styles.caseLabValue}><span>令牌</span><strong>{fixture === "fixed" ? "expired · -10m" : "? · 未固定"}</strong></div>
        <small>{fixture === "fixed" ? "每次执行都从同一个已知状态开始。" : "不同人可能拿到不同令牌，结果会漂。"}</small>
      </div>
      <div className={styles.caseLabPanel} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.caseLabLabel}><PaperPlaneTilt size={16} aria-hidden="true" /><span>Act · 操作</span></div>
        <h3>重置密码</h3>
        <code>POST /password/reset</code>
        <div className={styles.caseLabRequest}><span>次数</span><strong>{scene.step >= 2 ? "1" : "—"}</strong></div>
        <small>{scene.step < 2 ? "还没有真正发出请求。" : "动作、路径、输入和次数已经可以照着做。"}</small>
      </div>
      <div className={styles.caseLabPanel} data-active={scene.step === 3} data-danger={final && !complete}>
        <div className={styles.caseLabLabel}><Eye size={16} aria-hidden="true" /><span>Observe · 预期</span></div>
        <h3>{evidence === "all" ? "三处都要对上" : "只有一处回执"}</h3>
        <div className={styles.caseLabEvidence}><span><strong>HTTP</strong><code>{scene.step >= 3 ? "410" : "—"}</code></span><span><Database size={14} aria-hidden="true" /><strong>DB</strong><code>{evidence === "all" && scene.step >= 3 ? "未消费" : "—"}</code></span><span><EnvelopeSimple size={14} aria-hidden="true" /><strong>Mail</strong><code>{evidence === "all" && scene.step >= 3 ? "0 封" : "—"}</code></span></div>
        <small>{evidence === "all" ? "协议、持久化和副作用共同说明失败真的发生了。" : "只看状态码，页面之外的副作用仍可能悄悄错。"}</small>
      </div>
      <div className={styles.caseLabPanel} data-active={scene.step === 4} data-danger={final && !complete} data-green={final && complete}>
        <div className={styles.caseLabLabel}>{final && complete ? <CheckCircle size={16} aria-hidden="true" /> : final ? <WarningCircle size={16} aria-hidden="true" /> : <ShieldWarning size={16} aria-hidden="true" />}<span>判定 · Result</span></div>
        <h3>{outcome}</h3>
        <div className={styles.caseLabBig}>{final && complete ? "3 / 3" : final && evidence === "http" ? "1 / 3" : final ? "起点不稳" : "—"}</div>
        <small>{!final ? "先写完整，再执行；没有预期不能凭感觉打绿。" : complete ? "清理后重建同一前置，第二次仍得到同样结论。" : evidence === "http" ? "HTTP 410 不能替 DB 和 Mail 做证明。" : "token 没有固定，测试结果无法归因。"}</small>
      </div>
    </div>
    <div className={styles.caseLabMetrics}><div><span>前置</span><strong>{fixture === "fixed" ? "可复现" : "漂移"}</strong></div><div><span>证据</span><strong>{evidence === "all" ? "3 个观察点" : "1 个观察点"}</strong></div><div><span>结论</span><strong>{outcome}</strong></div></div>
    <p className={styles.caseLabNote} data-danger={final && !complete} role="status">{!final ? <><Key size={17} aria-hidden="true" /><span>每推进一步，下一步都会接住上一格留下的事实：先固定状态，再执行一次动作，最后把结果拆成可观察证据。</span></> : complete ? <><CheckCircle size={17} aria-hidden="true" /><span>用例现在能被另一个人重跑：相同起点、相同动作、相同三项预期。通过的是行为，不是某个实现细节。</span></> : evidence === "http" ? <><WarningCircle size={17} aria-hidden="true" /><span>只写 HTTP 410 会留下两个盲区：令牌是否被消费、邮件是否误发。把副作用也写进预期。</span></> : <><Timer size={17} aria-hidden="true" /><span>测试失败的原因不能归到代码，因为输入起点没有固定。先建立干净、可重复的前置状态。</span></>}</p>
  </div>;
}
