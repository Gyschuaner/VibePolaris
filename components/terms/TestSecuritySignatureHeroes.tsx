"use client";

import { useState, type ReactNode } from "react";
import { ArrowCounterClockwise, ArrowRight, ArrowsClockwise, Bug, ChartLineUp, Check, CheckCircle, ClipboardText, Clock, Code, Database, Eye, Gear, GitCommit, GitBranch, Globe, Graph, GridFour, Handshake, ListMagnifyingGlass, MagnifyingGlass, PaperPlaneTilt, Robot, Scales, ShieldCheck, ShieldWarning, TestTube, Timer, UserCircle, WarningCircle } from "@phosphor-icons/react";
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

const assertionSteps = ["只做一次动作", "对准观察点", "等它变真", "留下差异"];

export function AssertionSignatureHero() {
  const scene = useScene(assertionSteps.length);
  const [target, setTarget] = useState<"visible" | "text">("visible");
  const done = scene.step >= 2;
  const match = done && target === "visible";
  const failed = scene.step === 3 && !match;
  const choose = (next: "visible" | "text") => { setTarget(next); scene.seek(0); };
  const status = failed
    ? { icon: WarningCircle, title: "观察点不成立", detail: "Expected：按钮可见；Received：仍隐藏，超时后停止", danger: true }
    : scene.step === 3
      ? { icon: CheckCircle, title: "断言贴住了事实", detail: target === "visible" ? "Expected 与 Received 在可见性上对齐" : "文本内容有了，但这次要保护的是按钮是否出现" }
      : { icon: scene.step === 0 ? ArrowCounterClockwise : scene.step === 1 ? MagnifyingGlass : Timer, title: assertionSteps[scene.step], detail: scene.step === 0 ? "点击保存只发生一次，不能靠重试动作掩盖副作用" : scene.step === 1 ? "镜头只盯一个能回答问题的观察点" : "等待条件，不猜一段固定睡眠时间" };
  return <SignatureFrame scene={scene} label="断言只执行一次动作，再在有限时间内观察真正的完成条件" eyebrow="先改变一次，再反复观察结果" meta="act once · observe until true" steps={assertionSteps} status={status} caption="好的断言把动作和观察分开：动作不重复，查询可以在时限内重试，失败时能说清期待、实际和等待边界。" controls={<div className={styles.choiceRow} role="group" aria-label="选择断言观察点"><button type="button" aria-pressed={target === "visible"} onClick={() => choose("visible")}>按钮可见</button><button type="button" aria-pressed={target === "text"} onClick={() => choose("text")}>只看文本</button></div>}>
    <div className={styles.assertionBoard} data-target={target} data-failed={failed}>
      <div className={styles.actionDial} data-active={scene.step === 0} data-done={scene.step > 0}><span className={styles.label}><ArrowCounterClockwise size={16} aria-hidden="true" />动作</span><strong>保存设置</strong><div className={styles.tapMark}><i />1 次</div><small>动作不重试，避免重复写入。</small></div>
      <div className={styles.assertionLens} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.lensRing}><MagnifyingGlass size={22} aria-hidden="true" /><span>{scene.step < 1 ? "等待聚焦" : target === "visible" ? "toBeVisible" : "toHaveText"}</span></div>
        <div className={styles.timeTicks}><i data-on={scene.step >= 1} /><i data-on={scene.step >= 2} /><i data-on={scene.step >= 3} /></div>
        <small>{scene.step < 2 ? "目标尚未稳定" : "每次重新取得目标"}</small>
      </div>
      <div className={styles.assertionTarget} data-active={done} data-danger={failed}>
        <span className={styles.label}><Scales size={16} aria-hidden="true" />观察结果</span>
        <div className={styles.targetButton} data-visible={done}><span>保存完成</span>{done && <Check size={17} aria-hidden="true" />}</div>
        <div className={styles.expectedRows}><div><span>Expected</span><code>{target === "visible" ? "visible" : 'text="保存完成"'}</code></div><div><span>Received</span><code>{done ? target === "visible" ? "visible" : 'text="保存完成"' : "hidden"}</code></div></div>
        <div className={styles.timeoutTag}><Clock size={14} aria-hidden="true" />{failed ? "5s · timeout" : scene.step >= 2 ? "条件已满足" : "5s 上限"}</div>
      </div>
    </div>
  </SignatureFrame>;
}

const coverageSteps = ["铺开条件", "跑一条成功路", "看见亮行", "补上盲分支"];

export function CodeCoverageSignatureHero() {
  const scene = useScene(coverageSteps.length);
  const [coverBranch, setCoverBranch] = useState(true);
  const branchFound = scene.step >= 3 && coverBranch;
  const failed = scene.step === 3 && !coverBranch;
  const choose = (next: boolean) => { setCoverBranch(next); scene.seek(0); };
  const cells = [["T", "T", "20 岁 · 已验证"], ["T", "F", "20 岁 · 未验证"], ["F", "T", "17 岁 · 已验证"], ["F", "F", "17 岁 · 未验证"]];
  const status = failed
    ? { icon: Bug, title: "盲分支放行了风险", detail: "行已经亮着，但 verified=false 没有被行为断言拦住", danger: true }
    : scene.step === 3
      ? { icon: CheckCircle, title: "覆盖地图补齐", detail: "TF 路径被执行，接下来仍要检查拒绝结果" }
      : { icon: scene.step < 2 ? GridFour : scene.step === 2 ? Check : Bug, title: coverageSteps[scene.step], detail: scene.step === 0 ? "一行判断拆成四种输入组合" : scene.step === 1 ? "一次成功输入只点亮一格" : "执行过不等于行为正确" };
  return <SignatureFrame scene={scene} label="代码覆盖率把一个复合条件拆成可见输入组合和行为盲区" eyebrow="地图告诉你走过哪里，不替你判定对错" meta="line ≠ branch ≠ behavior" steps={coverageSteps} status={status} caption="覆盖率是测试执行留下的地图。它能指出没走过的路径，真正的业务结论仍要由断言和风险来决定。" controls={<div className={styles.choiceRow} role="group" aria-label="选择是否补上未验证分支"><button type="button" aria-pressed={coverBranch} onClick={() => choose(true)}>补 TF 分支</button><button type="button" aria-pressed={!coverBranch} onClick={() => choose(false)}>只跑 TT</button></div>}>
    <div className={styles.coverageBoard} data-branch={coverBranch} data-failed={failed}>
      <div className={styles.coverageCode} data-active={scene.step === 0} data-done={scene.step > 0}><span className={styles.label}><Code size={16} aria-hidden="true" />一行判断</span><code><b>if</b> (age &gt;= 18<br />&nbsp;&nbsp;&amp;&amp; verified)</code><small>行覆盖只问：这行有没有被执行。</small></div>
      <div className={styles.coverageGridWrap}>
        <div className={styles.coverageGridTitle}><span><GridFour size={16} aria-hidden="true" />条件棋盘</span><code>{scene.step < 1 ? "0 / 4" : branchFound ? "2 / 4" : "1 / 4"}</code></div>
        <div className={styles.coverageGrid}>{cells.map(([age, verified, label], index) => { const on = scene.step >= 1 && (index === 0 || (index === 1 && branchFound)); return <div key={label} className={styles.coverageCell} data-on={on} data-hole={index === 1 && failed}><span>{age}{verified}</span><small>{label}</small>{on ? <Check size={14} aria-hidden="true" /> : index === 1 && failed ? <Bug size={14} aria-hidden="true" /> : null}</div>; })}</div>
        <small className={styles.gridNote}>{scene.step < 1 ? "先看见隐藏的组合" : branchFound ? "行亮了，TF 也被走到" : "行亮了，TF 仍是空白"}</small>
      </div>
      <div className={styles.coverageReport} data-danger={failed}>
        <span className={styles.label}><ChartLineUp size={16} aria-hidden="true" />报告</span><div className={styles.coverageMetric}><span>行</span><strong>{scene.step >= 1 ? "100%" : "—"}</strong></div><div className={styles.coverageMetric}><span>分支</span><strong>{scene.step < 1 ? "—" : branchFound ? "100%" : "50%"}</strong></div><div className={styles.coverageProof}>{failed ? "行为断言：应拒绝，却被放行" : branchFound ? "下一步：断言结果和副作用" : "空白本身就是下一道题"}</div></div>
    </div>
  </SignatureFrame>;
}

const apiSteps = ["印下请求", "核对回执", "重试同意图", "换身份"];

export function ApiTestingSignatureHero() {
  const scene = useScene(apiSteps.length);
  const [sameKey, setSameKey] = useState(true);
  const duplicate = scene.step >= 2 && !sameKey;
  const forbidden = scene.step === 3;
  const choose = (next: boolean) => { setSameKey(next); scene.seek(0); };
  const status = forbidden
    ? { icon: ShieldWarning, title: "对象权限被挡住", detail: "用户 B 读不到用户 A 的 order-42，状态仍没有被改写" }
    : duplicate
      ? { icon: WarningCircle, title: "意图换了，订单变两行", detail: "新幂等键创建了 order-43；这不是一次安全重试", danger: true }
      : scene.step === 2
        ? { icon: CheckCircle, title: "同一个意图回到原订单", detail: "200 + order-42，服务端仍然只有一行" }
        : { icon: scene.step === 0 ? Globe : scene.step === 1 ? Check : ArrowsClockwise, title: apiSteps[scene.step], detail: scene.step === 0 ? "方法、身份、body 和幂等键先留下" : "响应和后置状态要说同一件事" };
  return <SignatureFrame scene={scene} label="API 测试同时检查 HTTP 回执、服务端状态、幂等重试和对象授权" eyebrow="回执是第一本账，状态才是第二本账" meta="request · response · state" steps={apiSteps} status={status} caption="API 测试直接撞协议边界，也要把服务器真正留下的资源、事件或拒绝结果放进同一条证据链。" controls={<div className={styles.choiceRow} role="group" aria-label="选择重试的幂等键"><button type="button" aria-pressed={sameKey} onClick={() => choose(true)}>同键重试</button><button type="button" aria-pressed={!sameKey} onClick={() => choose(false)}>换新键再发</button></div>}>
    <div className={styles.apiBoard} data-duplicate={duplicate} data-forbidden={forbidden}>
      <div className={styles.apiRequest} data-active={scene.step === 0} data-done={scene.step > 0}><span className={styles.label}><Globe size={16} aria-hidden="true" />请求印模</span><strong>POST /orders</strong><code>user=A<br />key={sameKey ? "intent-7" : "intent-8"}</code><small>{scene.step >= 3 ? "token=B · 同一对象" : "token=A"}</small></div>
      <div className={styles.apiLedger} data-active={scene.step >= 1}><div className={styles.ledgerHeader}><span className={styles.label}><Check size={16} aria-hidden="true" />响应账</span><code>{scene.step < 1 ? "—" : forbidden ? "403" : duplicate ? "201" : scene.step >= 2 ? "200" : "201"}</code></div><div className={styles.apiResponseRows}><span>status <b>{scene.step < 1 ? "等待" : forbidden ? "403" : duplicate ? "Created" : "Created / Replayed"}</b></span><span>orderId <b>{scene.step < 1 ? "—" : forbidden ? "hidden" : duplicate ? "order-43" : "order-42"}</b></span></div></div>
      <div className={styles.apiLedger} data-active={scene.step >= 1} data-danger={duplicate}><div className={styles.ledgerHeader}><span className={styles.label}><Database size={16} aria-hidden="true" />状态账</span><code>{forbidden ? "unchanged" : duplicate ? "2 rows" : scene.step >= 1 ? "1 row" : "—"}</code></div><div className={styles.apiRows}>{["order-42", "order-43"].map((id, index) => <span key={id} data-hidden={index === 1 && !duplicate}>{id}<b>{index === 0 ? "A · paid" : "A · paid"}</b></span>)}</div><small>{forbidden ? "越权读取没有改变订单" : duplicate ? "第二次写入暴露新意图" : "后置条件跟着响应核对"}</small></div>
      <div className={styles.apiIdentity} data-active={forbidden} data-danger={forbidden}><span className={styles.label}>{forbidden ? <ShieldWarning size={16} aria-hidden="true" /> : <ShieldCheck size={16} aria-hidden="true" />}身份</span><strong>{forbidden ? "B → A · 403" : "A → 自己的订单"}</strong><small>{forbidden ? "合法订单号不等于有权读取" : "换身份才知道门有没有锁"}</small></div>
    </div>
  </SignatureFrame>;
}

const leastSteps = ["发出任务票", "完成发布", "撞到越界", "租约到期"];

export function LeastPrivilegeSignatureHero() {
  const scene = useScene(leastSteps.length);
  const [scope, setScope] = useState<"narrow" | "admin">("narrow");
  const overreach = scene.step >= 2 && scope === "admin";
  const denied = scene.step >= 2 && scope === "narrow";
  const expired = scene.step === 3;
  const choose = (next: "narrow" | "admin") => { setScope(next); scene.seek(0); };
  const status = expired
    ? { icon: Clock, title: "租约已到期", detail: "上一轮钥匙不能继续借用，必须重新申请" }
    : overreach
      ? { icon: WarningCircle, title: "范围过宽", detail: "组织管理员可以删 production，但这不是发布任务所需", danger: true }
      : denied
        ? { icon: ShieldCheck, title: "越界被拒", detail: "发布仍可完成，delete production 没有匹配的允许规则" }
        : { icon: scene.step === 0 ? Key : scene.step === 1 ? CheckCircle : ShieldCheck, title: leastSteps[scene.step], detail: scene.step === 0 ? "先写任务，再把钥匙剪到最小" : "动作、资源和时间一起构成边界" };
  return <SignatureFrame scene={scene} label="最小权限把发布任务收进动作、资源和时间窗口" eyebrow="一把钥匙只开这次要开的门" meta="action · resource · time" steps={leastSteps} status={status} caption="最小权限不是让任务无法完成，而是把完成任务需要的动作、资源范围和有效时间写清楚，并在越界时默认拒绝。" controls={<div className={styles.choiceRow} role="group" aria-label="选择授权范围"><button type="button" aria-pressed={scope === "narrow"} onClick={() => choose("narrow")}>repo/Vibe · 发布票</button><button type="button" aria-pressed={scope === "admin"} onClick={() => choose("admin")}>组织管理员</button></div>}>
    <div className={styles.privilegeBoard} data-scope={scope} data-denied={denied} data-overreach={overreach} data-expired={expired}>
      <div className={styles.permissionTicket} data-active={scene.step === 0} data-done={scene.step > 0}><span className={styles.label}><Key size={16} aria-hidden="true" />授权票</span><strong>{scope === "narrow" ? "release-bot" : "org-admin"}</strong><div className={styles.ticketRows}><span>动作 <b>{scope === "narrow" ? "read + write" : "*"}</b></span><span>资源 <b>{scope === "narrow" ? "repo/Vibe" : "组织全部"}</b></span><span>期限 <b>30 min</b></span></div></div>
      <div className={styles.permissionDoor} data-active={scene.step === 1} data-done={scene.step > 1}><span className={styles.label}><GitBranch size={16} aria-hidden="true" />发布门</span><strong>release/v1.4</strong><code>{scene.step >= 1 ? "write · allowed" : "waiting"}</code><small>完成发布确实需要写入这一条分支。</small></div>
      <div className={styles.permissionWall} data-active={scene.step >= 2} data-danger={overreach} data-blocked={denied}><span className={styles.label}>{denied ? <ShieldCheck size={16} aria-hidden="true" /> : <WarningCircle size={16} aria-hidden="true" />}越界门</span><strong>delete production</strong><div className={styles.wallResult}>{scene.step < 2 ? "尚未尝试" : overreach ? "ALLOWED · too wide" : "DENIED · default"}</div><small>{scene.step < 2 ? "发布成功也不会自动打开这里" : overreach ? "能做不等于任务需要" : "没有规则就不放行"}</small></div>
      <div className={styles.leaseMeter} data-active={expired}><span className={styles.label}><Clock size={16} aria-hidden="true" />租约</span><div className={styles.leaseBar}><i data-on={scene.step < 3} /><i data-on={scene.step < 3} /><i data-on={scene.step < 3} /><i data-on={scene.step < 3} /></div><strong>{expired ? "expired" : scene.step >= 1 ? "18 min left" : "30 min"}</strong><small>{expired ? "重新申请，不继承旧钥匙" : "时间也是权限的一部分"}</small></div>
    </div>
  </SignatureFrame>;
}
