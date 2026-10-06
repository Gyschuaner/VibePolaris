"use client";

import { ArrowRight, CheckCircle, ClipboardText, Clock, FileText, GitBranch, LockSimple, MagnifyingGlass, Scales, Target, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const useCaseLabels = ["前置条件", "主流程", "过期分支", "外部失败"];
const useCaseCaptions = [
  "先确认订单已支付 36 小时，仍在 48 小时退款窗口里；这是用例的起点。",
  "购买者提交申请，服务请求支付方；订单从 paid 变成 refund_pending。",
  "如果窗口已经过去，流程在资格检查处结束，订单仍留在 paid。",
  "支付方超时也不是一句失败：订单不乱改，结果进入可重试的分支。",
];

export function UseCaseHero() {
  const scene = useScene(useCaseLabels.length);
  const step = scene.step;
  const branch = step === 1 ? "success" : step === 2 ? "expired" : step === 3 ? "timeout" : "idle";
  return <MechanismFrame scene={scene} title="一次退款怎样在条件和分支间落地" labels={useCaseLabels} caption={useCaseCaptions[step]}>
    <div className={styles.useCaseScene}>
      <div className={styles.useCaseActors}>
        <div className={styles.useCaseHead}><UserCircle size={16} /><span>ACTOR + SYSTEM</span><strong>{step === 0 ? "等待触发" : "交互中"}</strong></div>
        <div className={styles.useCaseChain}><div data-active={step >= 1}><UserCircle size={18} /><strong>购买者</strong><small>{step >= 1 ? "提交退款" : "发起目标"}</small></div><ArrowRight size={15} /><div data-active={step >= 1}><GitBranch size={18} /><strong>退款服务</strong><small>{step >= 1 ? "检查并请求" : "等待条件"}</small></div><ArrowRight size={15} /><div data-active={step === 1}><FileText size={18} /><strong>支付方</strong><small>{step === 1 ? "受理" : "外部边界"}</small></div></div>
        <div className={styles.useCasePrecondition}><Clock size={15} /><span>订单已支付 · 36h / 48h</span>{step === 0 ? <WarningCircle size={15} /> : <CheckCircle size={15} />}</div>
      </div>
      <div className={styles.useCaseOutcomes}>
        <div className={styles.useCaseHead}><Target size={16} /><span>OBSERVABLE OUTCOME</span></div>
        <div className={styles.useCaseOutcome} data-active={branch === "success"} data-fail={false}><CheckCircle size={16} /><div><strong>refund_pending</strong><small>支付方已受理 · 订单改变</small></div></div>
        <div className={styles.useCaseOutcome} data-active={branch === "expired"} data-fail={branch === "expired"}><Clock size={16} /><div><strong>期限已过</strong><small>提前拒绝 · paid 不变</small></div></div>
        <div className={styles.useCaseOutcome} data-active={branch === "timeout"} data-fail={branch === "timeout"}><WarningCircle size={16} /><div><strong>外部超时</strong><small>可重试 · paid 不变</small></div></div>
      </div>
    </div>
  </MechanismFrame>;
}

const acceptanceLabels = ["模糊要求", "给定状态", "动作与结果", "错误边界"];
const acceptanceCaptions = [
  "“登录做好了”没有起点，也没有一个人能复核的完成结果。",
  "把未登录访问 /settings 作为 Given，先固定谁在什么状态里。",
  "When 提交正确凭据，Then 回到原目标并看到设置内容；结果落在用户能看见的地方。",
  "密码错误、超时和无权限各有结果；失败不能污染下一次尝试。",
];

export function AcceptanceCriteriaHero() {
  const scene = useScene(acceptanceLabels.length);
  const step = scene.step;
  const complete = step >= 2;
  return <MechanismFrame scene={scene} title="验收句怎样把登录完成变成可观察结果" labels={acceptanceLabels} caption={acceptanceCaptions[step]}>
    <div className={styles.acceptanceScene}>
      <div className={styles.acceptanceContract} data-complete={complete}>
        <div className={styles.acceptanceHead}><ClipboardText size={16} /><span>ACCEPTANCE CONTRACT</span><strong>{complete ? "可执行" : "草稿"}</strong></div>
        <div className={styles.acceptanceRow} data-on={step >= 1}><span>GIVEN</span><strong>{step >= 1 ? "未登录 · 目标 /settings" : "什么起点？"}</strong></div>
        <div className={styles.acceptanceRow} data-on={step >= 2}><span>WHEN</span><strong>{step >= 2 ? "提交正确凭据" : "做什么？"}</strong></div>
        <div className={styles.acceptanceRow} data-on={step >= 2}><span>THEN</span><strong>{step >= 2 ? "回到原目标并看到设置" : "看见什么？"}</strong></div>
      </div>
      <div className={styles.acceptanceBoundary}><div className={styles.acceptanceHead}><Scales size={16} /><span>BOUNDARY</span></div><div className={styles.acceptanceResult} data-fail={step === 3}><WarningCircle size={15} /><span>{step === 3 ? "密码错误：留在登录页，可重试" : "错误、权限、回归也要有结果"}</span></div><div className={styles.acceptanceResult} data-on={step >= 3}><LockSimple size={15} /><span>{step >= 3 ? "无权限：拒绝且不泄露内容" : "内部字段不是用户结果"}</span></div><small>{step >= 3 ? "状态可恢复，下一次尝试从干净起点开始" : "把实现证据翻译成可见行为"}</small></div>
    </div>
  </MechanismFrame>;
}

const scopeLabels = ["写出目标", "圈住本期", "放下相邻项", "评估变更"];
const scopeCaptions = [
  "目标先落在一个任务：导出当前筛选结果为 CSV，而不是做完整报表平台。",
  "把生成 CSV、沿用筛选和手动下载圈进本期，边界开始可复述。",
  "自定义图表与定时报表放到圈外；它们有价值，但服务的是另一项任务。",
  "新想法进来先看让谁让位、增加什么依赖和验收，再决定改不改承诺。",
];

export function ScopeHero() {
  const scene = useScene(scopeLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="一个导出目标怎样画出本期边界" labels={scopeLabels} caption={scopeCaptions[step]}>
    <div className={styles.scopeScene}>
      <div className={styles.scopeFrame} data-tight={step >= 1} data-change={step === 3}>
        <div className={styles.scopeFrameHead}><Target size={16} /><span>THIS RELEASE</span><strong>{step === 3 ? "重新评估" : step >= 1 ? "已圈定" : "空白"}</strong></div>
        <div className={styles.scopeGoal}><strong>导出当前筛选结果</strong><small>用户：运营人员 · 交给财务核对</small></div>
        <div className={styles.scopeIncluded} data-on={step >= 1}><CheckCircle size={15} /><span>{step >= 1 ? "筛选条件 · CSV · 手动下载" : "等待确认包含项"}</span></div>
        <div className={styles.scopeDependency}><GitBranch size={15} /><span>{step === 0 ? "依赖尚未核对" : step === 3 ? "接口字段权限需重新确认" : "接口提供当前筛选结果"}</span></div>
      </div>
      <div className={styles.scopeOutside}><div className={styles.scopeOutsideHead}><WarningCircle size={16} /><span>OUTSIDE / LATER</span></div><div data-muted={step < 2}>自定义图表</div><div data-muted={step < 2}>定时报表</div><div data-muted={step < 2}>大文件异步导出</div><small>{step >= 2 ? "记录候选，不偷偷扩大承诺" : "相邻想法还在边界外"}</small></div>
    </div>
  </MechanismFrame>;
}

const roadmapLabels = ["共同方向", "近期阶段", "依赖显影", "证据复盘"];
const roadmapCaptions = [
  "路线图先回答要为用户改变什么：降低首次配置失败率，而不是列一串季度功能。",
  "近期做诊断，下一阶段再优化引导；每一段都有自己的结果和观察方式。",
  "权限接口和研究证据成为阶段旁的依赖，远期方案保留为假设而非日期承诺。",
  "复盘结果决定保留、重排或停止下一阶段；路线图跟着证据走。",
];

export function RoadmapHero() {
  const scene = useScene(roadmapLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="路线图怎样把用户价值放在日期前面" labels={roadmapLabels} caption={roadmapCaptions[step]}>
    <div className={styles.roadmapScene}>
      <div className={styles.roadmapNorth}><div className={styles.roadmapNorthHead}><Target size={16} /><span>NORTH STAR</span></div><strong>降低首次配置失败率</strong><small>用户结果 · 可观察方向</small></div>
      <div className={styles.roadmapTrack}><div className={styles.roadmapLine} /><div className={styles.roadmapStage} data-active={step >= 1}><span>NOW</span><strong>诊断卡点</strong><small>{step >= 1 ? "完成率 · 失败位置" : "近期结果"}</small></div><div className={styles.roadmapStage} data-active={step >= 2}><span>NEXT</span><strong>优化引导</strong><small>{step >= 2 ? "等待证据" : "阶段假设"}</small></div><div className={styles.roadmapStage} data-active={step >= 3}><span>LATER</span><strong>自动修复</strong><small>{step >= 3 ? "重排或停止" : "远期未知"}</small></div></div>
      <div className={styles.roadmapProof} role="status"><GitBranch size={15} /><span>{step === 2 ? "依赖：权限接口 + 研究样本" : step === 3 ? "复盘：阶段是否带来价值？" : "路线图不是任务清单"}</span></div>
    </div>
  </MechanismFrame>;
}

const priorityLabels = ["共同目标", "摆上因素", "形成顺序", "证据重排"];
const priorityCaptions = [
  "先固定目标：降低首次配置失败率；没有共同目标，‘最重要’无法比较。",
  "把影响、时限、风险、依赖和成本一起摆上桌，单一分数不再遮住取舍。",
  "诊断阻塞排在微调前面，因为它更直接影响用户完成配置。顺序要能解释。",
  "新故障或容量变化出现后重新排序；P0/P1 是当前判断，不是永久身份。",
];

export function PriorityHero() {
  const scene = useScene(priorityLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="优先级怎样把‘都重要’变成可解释顺序" labels={priorityLabels} caption={priorityCaptions[step]}>
    <div className={styles.priorityScene}>
      <div className={styles.priorityGoal}><div className={styles.priorityHead}><Target size={16} /><span>SHARED GOAL</span></div><strong>降低首次配置失败率</strong><small>所有候选都回到这个结果</small></div>
      <div className={styles.priorityCards}><div className={styles.priorityCard} data-rank={step >= 2 ? "1" : "3"}><div><strong>诊断卡点</strong><small>影响高 · 依赖中</small></div><b>{step >= 2 ? "先做" : "候选"}</b></div><div className={styles.priorityCard} data-rank={step >= 2 ? "2" : "1"}><div><strong>修复登录阻塞</strong><small>风险高 · 需接口</small></div><b>{step >= 2 ? "随后" : "候选"}</b></div><div className={styles.priorityCard} data-rank={step >= 3 ? "3" : "2"}><div><strong>界面微调</strong><small>收益小 · 成本低</small></div><b>{step >= 3 ? "暂缓" : "候选"}</b></div></div>
      <div className={styles.priorityEvidence} role="status"><Scales size={15} /><span>{step === 3 ? "新证据：诊断已完成，顺序重新计算" : step >= 1 ? "影响 · 时限 · 风险 · 依赖 · 成本" : "先别把声音大小当排序依据"}</span></div>
    </div>
  </MechanismFrame>;
}
