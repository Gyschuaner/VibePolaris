"use client";

import { ArrowsClockwise, CheckCircle, ClipboardText, Cursor, FileText, Funnel, MagnifyingGlass, Target, TestTube } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const iterationLabels = ["交付一块", "观察任务", "带回证据", "决定下一轮"];
const iterationCaptions = [
  "先交付一个能运行的小范围结果，别把全部风险藏到最后。",
  "让真实任务经过这块结果，停顿、失败和遗漏才会出现。",
  "把观察到的证据带回工作台：保留有效部分，标出真正卡住的字段。",
  "下一轮收窄到这个缺口；如果目标已达成或继续没有新证据，也可以停止。",
];

export function IterationHero() {
  const scene = useScene(iterationLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="一轮结果怎样拨动下一轮" labels={iterationLabels} caption={iterationCaptions[step]}>
    <div className={styles.iterationScene}>
      <div className={styles.iterationLoop}><div className={styles.iterationNode} data-active={step >= 0}><span>交付</span><strong>CSV 导出</strong></div><div className={styles.iterationArc} data-on={step >= 1} /><div className={styles.iterationNode} data-active={step >= 1}><span>观察</span><strong>用户任务</strong></div><div className={styles.iterationArc} data-on={step >= 2} /><div className={styles.iterationNode} data-active={step >= 2}><span>调整</span><strong>{step >= 3 ? "字段提示" : "证据"}</strong></div></div>
      <div className={styles.iterationEvidence} data-ready={step >= 2}><div className={styles.iterationEvidenceHead}><MagnifyingGlass size={15} /><span>OBSERVATION</span></div><strong>{step >= 2 ? "用户在空状态停住" : "还没有跑过真实任务"}</strong><small>{step >= 2 ? "下一轮：补空状态提示，而不是重做整页" : "交付后才知道哪里需要收窄"}</small></div>
      <div className={styles.iterationProof} role="status"><ArrowsClockwise size={15} /><span>{step === 3 ? "完成条件或新证据决定是否继续" : "每一轮带着证据回来"}</span></div>
    </div>
  </MechanismFrame>;
}

const conversionLabels = ["固定起点", "记录完成", "换分子", "固定窗口"];
const conversionCaptions = [
  "先圈出进入注册页的独立用户；分母一变，后面的百分比就不再可比。",
  "验证邮箱是完成事件，120 个完成者落在 1000 个起点用户里。",
  "如果把提交表单当完成事件，分子变成 180，指标会变成 18%。",
  "再写清去重方式和等待窗口，12% 才有可以复查的口径。",
];

export function ConversionRateHero() {
  const scene = useScene(conversionLabels.length);
  const step = scene.step;
  const submitted = step === 2;
  const numerator = submitted ? 180 : 120;
  const percent = submitted ? 18 : 12;
  return <MechanismFrame scene={scene} title="转化率怎样让分母、事件和窗口现形" labels={conversionLabels} caption={conversionCaptions[step]}>
    <div className={styles.conversionScene}>
      <div className={styles.conversionRingsLarge} data-submitted={submitted}><i /><i /><strong>{numerator}</strong><small>/ 1000 · {percent}%</small></div>
      <div className={styles.conversionLedger}><div className={styles.conversionLedgerHead}><ClipboardText size={15} /><span>MEASUREMENT LEDGER</span></div><div><small>起点</small><strong>首次到达注册页</strong></div><div><small>完成</small><strong>{submitted ? "提交表单" : "验证邮箱"}</strong></div><div><small>窗口 / 单位</small><strong>{step >= 3 ? "24h · 独立用户" : "待固定"}</strong></div></div>
      <div className={styles.conversionProof} role="status"><Target size={15} /><span>{step === 2 ? "换完成事件，内圈就变大" : step >= 3 ? "口径固定后才可比较版本" : "百分比先别脱离上下文"}</span></div>
    </div>
  </MechanismFrame>;
}

const funnelLabels = ["写出路径", "经过第一关", "找到掉落", "补证据"];
const funnelCaptions = [
  "漏斗先写一条已知路径：到达注册页、填写表单、验证邮箱。",
  "同一批 1000 个起点用户进入第一道筛网，只有完成事件的人继续留下。",
  "420 人停在填写后只能定位位置；人数本身不能解释为什么离开。",
  "再用日志、访谈或实验查原因，不要直接把掉落归因给某个颜色。",
];

export function FunnelHero() {
  const scene = useScene(funnelLabels.length);
  const step = scene.step;
  const counts = [1000, step >= 1 ? 420 : 0, step >= 2 ? 180 : 0];
  return <MechanismFrame scene={scene} title="漏斗怎样只定位流失位置" labels={funnelLabels} caption={funnelCaptions[step]}>
    <div className={styles.funnelScene}>
      <div className={styles.funnelGates}><div className={styles.funnelGate} data-active={step >= 0}><span>到达注册页</span><strong>{counts[0]}</strong><small>起点</small></div><div className={styles.funnelGate} data-active={step >= 1}><span>填写表单</span><strong>{counts[1] || "—"}</strong><small>{step >= 2 ? "掉落 580" : "下一步"}</small></div><div className={styles.funnelGate} data-active={step >= 2}><span>验证邮箱</span><strong>{counts[2] || "—"}</strong><small>{step >= 3 ? "等待原因" : "完成"}</small></div></div>
      <div className={styles.funnelParticles} aria-hidden="true">{Array.from({length: 12}, (_, i) => <i key={i} data-on={step >= (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2)} />)}</div>
      <div className={styles.funnelProof} role="status"><Funnel size={15} /><span>{step >= 3 ? "位置已知，原因还要补证据" : "漏斗回答哪一关，不替你解释原因"}</span></div>
    </div>
  </MechanismFrame>;
}

const usabilityLabels = ["给任务", "看停顿", "少提示", "归纳证据"];
const usabilityCaptions = [
  "任务只说目标：退回一件尺码不合适的商品，不告诉参与者按钮在哪。",
  "参与者在‘退货’入口停住；主持人记录动作和停顿，不急着替他点。",
  "只在安全边界内给最少提示，观察提示是否改变了任务结果。",
  "把多轮观察归纳成模式，说明问题出现在哪里，但不把一人结论当全体比例。",
];

export function UsabilityTestingHero() {
  const scene = useScene(usabilityLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="可用性测试怎样让停顿变成证据" labels={usabilityLabels} caption={usabilityCaptions[step]}>
    <div className={styles.usabilityScene}>
      <div className={styles.usabilityTask}><div className={styles.usabilityTaskHead}><ClipboardText size={15} /><span>TASK CARD</span></div><strong>退回一件尺码不合适的商品</strong><small>{step >= 1 ? "不透露入口和按钮名" : "只给目标，不给答案"}</small></div>
      <div className={styles.usabilityViewport}><div className={styles.usabilityHeader}>订单详情 <span>⋯</span></div><div className={styles.usabilityRows}><span>商品 A · 已送达</span><span data-hot={step >= 1}>售后入口</span><span>配送记录</span></div><Cursor className={styles.usabilityCursor} style={{ transform: `translate(${step * 34}px, ${step >= 1 ? 17 : 55}px)` }} /><div className={styles.usabilityTrace} data-on={step >= 1} /></div>
      <div className={styles.usabilityNotes}><div className={styles.usabilityTaskHead}><TestTube size={15} /><span>OBSERVER NOTES</span></div><p data-on={step >= 1}>{step >= 1 ? "12s 停顿 · 视线回到菜单" : "等待真实动作"}</p><p data-on={step >= 3}>{step >= 3 ? "模式：入口命名不符合任务语言" : "不要把意见当完成率"}</p><small>{step >= 3 ? "结果：下一轮改入口文案" : "记录事实、提示和上下文"}</small></div>
    </div>
  </MechanismFrame>;
}

const mockupLabels = ["线框", "补层级", "做状态", "试交互"];
const mockupCaptions = [
  "先用低保真的框表达结构和任务，不把视觉细节假装成已经决定。",
  "补进字号、间距和视觉层级，让团队讨论信息关系而不是空白框。",
  "把加载、错误和空状态一起放进稿子，静态截图不能代表完整体验。",
  "加上最小可点击路径，让真实任务验证入口、顺序和反馈；稿子仍不是生产代码。",
];

export function MockupHero() {
  const scene = useScene(mockupLabels.length);
  const step = scene.step;
  const [clicked, setClicked] = useState(false);
  return <MechanismFrame scene={scene} title="视觉稿怎样从结构长到可试的状态" labels={mockupLabels} caption={mockupCaptions[step]} onReplay={() => setClicked(false)}>
    <div className={styles.mockupScene}>
      <div className={styles.mockupCanvas} data-level={step}><div className={styles.mockupTop}><span /><span /><span /></div><div className={styles.mockupHeroBlock}><div /><div /><div /></div><div className={styles.mockupForm}><span /><span /><button type="button" onClick={() => { setClicked(true); scene.seek(3); }} data-clicked={clicked}>{clicked ? "已提交" : "继续"}</button></div><div className={styles.mockupState} data-state={step >= 2 ? (clicked ? "success" : "error") : "loading"}>{step >= 2 ? clicked ? "成功：结果可见" : "错误：可恢复" : "状态：加载中"}</div></div>
      <div className={styles.mockupNotes}><div className={styles.mockupNoteHead}><FileText size={15} /><span>DISCUSSION</span></div><div data-on={step >= 0}>结构</div><div data-on={step >= 1}>层级</div><div data-on={step >= 2}>状态</div><div data-on={step >= 3}>路径</div><small>{step >= 3 ? "可点击路径只验证关键任务" : "每一层都回答一个设计问题"}</small></div>
    </div>
  </MechanismFrame>;
}
