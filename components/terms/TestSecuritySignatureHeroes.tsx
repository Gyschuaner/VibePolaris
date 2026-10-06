"use client";

import { useState, type ReactNode } from "react";
import { ArrowCounterClockwise, ArrowRight, Check, CheckCircle, ClipboardText, Code, Database, Eye, Gear, GitCommit, GitBranch, Graph, Handshake, ListMagnifyingGlass, PaperPlaneTilt, Robot, ShieldWarning, TestTube, UserCircle, WarningCircle } from "@phosphor-icons/react";
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

const caseSteps = ["留下模糊句", "固定起点", "写出动作", "对齐证据", "清理重跑"];

export function TestCaseSignatureHero() {
  const scene = useScene(caseSteps.length);
  const [precise, setPrecise] = useState(true);
  const runnable = precise && scene.step >= 3;
  const failed = !precise && scene.step === caseSteps.length - 1;
  const choose = (next: boolean) => { setPrecise(next); scene.seek(0); };
  const status = failed
    ? { icon: WarningCircle, title: "无法判定", detail: "只写“应该失败”，执行者没有可比较的预期", danger: true }
    : scene.step === 4
      ? { icon: CheckCircle, title: "同一条判断可重跑", detail: "HTTP 410、令牌未消费、邮件 0 封，两次都对上" }
    : { icon: scene.step < 2 ? ClipboardText : scene.step === 2 ? PaperPlaneTilt : Eye, title: caseSteps[scene.step], detail: scene.step === 0 ? "标题只指出风险，还不能直接执行" : "每一格都在把现场变成可观察事实" };
  return <SignatureFrame scene={scene} label="测试用例从模糊要求长出固定起点、动作和可观察证据" eyebrow="一张执行单，要让别人接得住" meta="arrange → act → observe → repeat" steps={caseSteps} status={status} caption="测试用例不是把风险写得更像一句口号，而是把起点、动作、预期和清理写到下一次仍能复原。" controls={<div className={styles.choiceRow} role="group" aria-label="选择用例写法"><button type="button" aria-pressed={precise} onClick={() => choose(true)}>补齐可判定预期</button><button type="button" aria-pressed={!precise} onClick={() => choose(false)}>只写“应该失败”</button></div>}>
    <div className={styles.caseBoard} data-precise={precise} data-runnable={runnable} data-failed={failed}>
      <div className={styles.caseSheet} data-active={scene.step === 0} data-done={scene.step > 0}>
        <span className={styles.label}><ClipboardText size={16} aria-hidden="true" />草稿</span>
        <strong>密码重置</strong>
        <code>{precise ? "expired token → reject" : "password reset should fail"}</code>
        <span className={styles.paperLine} /><span className={styles.paperLine} /><small>{scene.step === 0 ? "风险句还没有起跑线" : "标题留下，细节继续补"}</small>
      </div>
      <div className={styles.caseColumn}>
        <div className={styles.caseCell} data-active={scene.step === 1} data-done={scene.step > 1}><span className={styles.label}><UserCircle size={15} aria-hidden="true" />起点</span><strong>u-42 · active</strong><code>{scene.step >= 1 ? "token=expired · -10m" : "token=？"}</code></div>
        <div className={styles.caseCell} data-active={scene.step === 2} data-done={scene.step > 2}><span className={styles.label}><PaperPlaneTilt size={15} aria-hidden="true" />动作</span><strong>POST /password/reset</strong><code>{scene.step >= 2 ? "只发送 1 次" : "等待请求"}</code></div>
      </div>
      <div className={styles.caseEvidence} data-active={scene.step >= 3} data-danger={failed}>
        <span className={styles.label}>{failed ? <WarningCircle size={16} aria-hidden="true" /> : runnable ? <CheckCircle size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}证据</span>
        <div className={styles.assertionList}><span>HTTP <strong>{runnable ? "410" : "—"}</strong></span><span>token <strong>{runnable ? "未消费" : "—"}</strong></span><span>邮件 <strong>{runnable ? "0 封" : "—"}</strong></span></div>
        <div className={styles.evidenceSeal} data-danger={failed}>{failed ? "NOT RUNNABLE" : scene.step === 4 && precise ? "PASS ×2" : "尚未判定"}</div>
        <small>{failed ? "预期缺口挡在执行前" : scene.step === 4 && precise ? "清理后仍能得到同一结论" : "结果要落在系统真的会留下的事实"}</small>
      </div>
    </div>
  </SignatureFrame>;
}

const mockSteps = ["接上支付", "控制回执", "记下调用", "替换实现"];

export function MockSignatureHero() {
  const scene = useScene(mockSteps.length);
  const [oracle, setOracle] = useState<"behavior" | "interaction">("behavior");
  const [double, setDouble] = useState<"mock" | "fake">("mock");
  const final = scene.step === mockSteps.length - 1;
  const stale = final && oracle === "interaction" && double === "mock";
  const unsupported = final && oracle === "interaction" && double === "fake";
  const choose = (next: () => void) => { next(); scene.seek(0); };
  const status = stale
    ? { icon: WarningCircle, title: "旧交互失配", detail: "Mock 还在等待 charge ×1，业务结果本身仍是 paid", danger: true }
    : unsupported
      ? { icon: Eye, title: "没有调用回执", detail: "Fake 跑过契约，但不能回答 charge 是否被调用" }
      : { icon: scene.step === 0 ? Handshake : scene.step === 1 ? Robot : scene.step === 2 ? ListMagnifyingGlass : CheckCircle, title: mockSteps[scene.step], detail: scene.step < 2 ? "隔离真实支付，把难触发结果先变得可控" : "把业务结果和协作细节分别放在证据里" };
  return <SignatureFrame scene={scene} label="Mock 通过可控替身隔离支付依赖并记录调用边界" eyebrow="替身是接缝，不是另一套真实支付" meta="isolate ≠ imitate" steps={mockSteps} status={status} caption="Mock 让测试稳定碰到拒绝、超时等分支；它留下的调用记录有用，但不自动等于业务契约。" controls={<div className={styles.choiceGrid} role="group" aria-label="选择测试观察方式和替身"><div><span>测试看什么</span><button type="button" aria-pressed={oracle === "behavior"} onClick={() => choose(() => setOracle("behavior"))}>订单结果</button><button type="button" aria-pressed={oracle === "interaction"} onClick={() => choose(() => setOracle("interaction"))}>调用细节</button></div><div><span>依赖替身</span><button type="button" aria-pressed={double === "mock"} onClick={() => choose(() => setDouble("mock"))}>Mock · 记调用</button><button type="button" aria-pressed={double === "fake"} onClick={() => choose(() => setDouble("fake"))}>Fake · 跑契约</button></div></div>}>
    <div className={styles.mockBoard} data-double={double} data-stale={stale} data-incomplete={unsupported}>
      <div className={styles.mockSocket} data-active={scene.step === 0} data-done={scene.step > 0}>
        <span className={styles.label}><Code size={16} aria-hidden="true" />被测对象</span><strong>Checkout</strong><code>pay(order, card)</code><small>{scene.step < 1 ? "PaymentGateway 还在边界外" : "只观察订单最终处于什么状态"}</small>
      </div>
      <div className={styles.plug} aria-hidden="true"><span /><ArrowRight size={18} /></div>
      <div className={styles.mockReplacement} data-active={scene.step >= 0 && scene.step <= 2}>
        <span className={styles.label}><Robot size={16} aria-hidden="true" />{double === "mock" ? "Mock" : "Fake"} · 替身</span><strong>{double === "mock" ? "Payment Mock" : "Payment Fake"}</strong>
        <div className={styles.mockReceipt}><span>回执</span><b>{scene.step >= 1 ? "declined → paid" : "等待"}</b></div><div className={styles.mockReceipt}><span>{double === "mock" ? "调用" : "契约"}</span><b>{scene.step >= 2 ? (double === "mock" ? "已记录" : "已执行") : "—"}</b></div>
      </div>
      <div className={styles.plug} aria-hidden="true"><span /><ArrowRight size={18} /></div>
      <div className={styles.mockImplementation} data-active={scene.step >= 2} data-done={scene.step > 2}>
        <span className={styles.label}><Gear size={16} aria-hidden="true" />内部实现</span><strong>{scene.step >= 3 ? "authorize → capture" : "charge()"}</strong><code>{scene.step >= 3 ? "2 calls · same outcome" : "1 call · old shape"}</code><small>{scene.step >= 3 ? "实现拆开，订单不变" : "旧期待可能锁住了形状"}</small>
      </div>
      <div className={styles.plug} aria-hidden="true"><span /><ArrowRight size={18} /></div>
      <div className={styles.mockVerdict} data-active={final} data-danger={stale} data-incomplete={unsupported}>
        <span className={styles.label}>{stale ? <WarningCircle size={16} aria-hidden="true" /> : unsupported ? <Eye size={16} aria-hidden="true" /> : <Database size={16} aria-hidden="true" />}测试信号</span><strong>{stale ? "FAIL · charge ×0" : unsupported ? "N/A · no log" : final ? "PASS · order=paid" : "等待"}</strong><small>{stale ? "旧调用名红了，不能直接推断业务坏了" : unsupported ? "Fake 没有 Mock 的调用期待" : final ? (double === "fake" ? "真实度回到更高一层" : "受控依赖让分支稳定" ) : "先让替身完成它的工作"}</small>
      </div>
    </div>
  </SignatureFrame>;
}
