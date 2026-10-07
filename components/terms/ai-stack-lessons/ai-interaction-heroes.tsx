"use client";

import { Archive, ArrowRight, Check, CheckCircle, ClipboardText, FileText, Funnel, Hand, LockSimple, MagnifyingGlass, ShieldCheck, User, Warning, WarningCircle, X } from "@phosphor-icons/react";
import { useEffect } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

function AutoScene({ length }: { length: number }) {
  const scene = useScene(length);
  useEffect(() => { scene.toggle(); }, []);
  return scene;
}

export function PlanBlueprintHero() {
  const scene = AutoScene({ length: 5 });
  const tiles = ["构建", "测试", "部署", "修复", "复测"];
  const inserted = scene.step >= 4;
  return <div ref={scene.ref} className={styles.blueprintHero} data-step={scene.step} role="img" aria-label="蓝图上的构建、测试和部署被测试失败锁住，修复与复测步骤插入后才恢复">
    <div className={styles.blueprintTop}><span>RELEASE BLUEPRINT / 04</span><strong>{inserted ? "REPLAN" : scene.step >= 3 ? "BLOCKED" : "DRAFT"}</strong></div>
    <SceneControls scene={scene} labels={["列依赖", "构建盖章", "测试回执", "锁住部署", "插入修复"]} compact />
    <div className={styles.blueprintMap}><span className={styles.blueprintGrid} aria-hidden="true" />{tiles.map((tile, index) => { const active = scene.step === index; const failed = tile === "测试" && scene.step >= 3 && !inserted; const done = index === 0 ? scene.step >= 1 : index === 1 ? scene.step >= 2 && !failed : index === 4 ? inserted : false; const locked = tile === "部署" && scene.step >= 3 && !inserted; const hidden = tile === "修复" && !inserted; const icon = failed ? <WarningCircle size={16}/> : tile === "构建" ? <FileText size={16}/> : tile === "测试" || tile === "复测" ? <MagnifyingGlass size={16}/> : tile === "部署" ? <LockSimple size={16}/> : <Warning size={16}/>; return <div key={tile} className={styles.blueprintTile} data-active={active} data-done={done} data-failed={failed} data-locked={locked} data-hidden={hidden}><span>{String(index + 1).padStart(2, "0")}</span>{icon}<strong>{tile}</strong><small>{failed ? "11/12 · 失败" : locked ? "锁定" : done ? "有证据" : hidden ? "待插入" : "待执行"}</small></div>; })}</div>
    <div className={styles.blueprintNote}>{scene.step >= 3 && !inserted ? <><WarningCircle size={14}/> 11/12 失败，后继步骤停在图纸上</> : inserted ? <><CheckCircle size={14}/> 修复 → 复测，部署重新获得入口</> : <><ClipboardText size={14}/> 每一块都等上一块回执</>}</div>
  </div>;
}

export function HandoffBadgeHero() {
  const scene = AutoScene({ length: 4 });
  const received = scene.step >= 1;
  const handed = scene.step >= 2;
  const returned = scene.step === 3;
  return <div ref={scene.ref} className={styles.handoffHero} data-step={scene.step} role="img" aria-label="客服把订单事实装进交接信封，回复权随信封转到退款智能体">
    <div className={styles.handoffTop}><span>OWNERSHIP TAG / A102</span><strong>{returned ? "RETURNED" : handed ? "REFUND DESK" : "SUPPORT DESK"}</strong></div>
    <SceneControls scene={scene} labels={["客服接单", "装入事实", "交出回复权", "缺失时退回"]} compact />
    <div className={styles.handoffBench}><div className={styles.handoffAgent} data-active={!handed || returned}><User size={18}/><strong>客服</strong><small>{returned ? "补订单号" : !handed ? "当前回复者" : "已交接"}</small></div><div className={styles.handoffEnvelope} data-open={received}><FileText size={19}/><strong>交接包</strong><code>{received ? "A102 · 退款 · 待确认" : "空白事实"}</code><span>{received ? "只带继续任务所需的事实" : "还没整理"}</span></div><div className={styles.handoffAgent} data-active={handed && !returned}><Hand size={18}/><strong>退款智能体</strong><small>{returned ? "等待补充" : handed ? "当前回复者" : "等接手"}</small></div></div>
    <div className={styles.handoffProof}>{returned ? <><WarningCircle size={14}/> 订单号缺失，包裹退回客服</> : handed ? <><CheckCircle size={14}/> 回复权随包裹移动，退款仍未执行</> : <><ArrowRight size={14}/> 包裹装好后才移动所有权</>}</div>
  </div>;
}

export function ApprovalSealHero() {
  const scene = AutoScene({ length: 4 });
  const decided = scene.step >= 2;
  const executed = scene.step === 3;
  return <div ref={scene.ref} className={styles.approvalHero} data-step={scene.step} role="img" aria-label="退款单在红色印章落下前停在人工审阅台，批准、修改或拒绝会改变结果">
    <div className={styles.approvalTop}><span>REFUND SLIP / REVIEW REQUIRED</span><strong>{executed ? "RECORDED" : decided ? "DECISION" : "PAUSED"}</strong></div>
    <SceneControls scene={scene} labels={["风险触发", "停在审阅台", "盖下决定", "执行结果"]} compact />
    <div className={styles.approvalDesk}><div className={styles.approvalSlip}><span>退款申请</span><strong>¥1,200</strong><code>自动上限 · ¥500</code><div className={styles.approvalRule}>需要人工决定</div></div><div className={styles.approvalSeal} data-visible={decided} data-executed={executed}><ShieldCheck size={22}/><strong>{executed ? "已记录" : decided ? "人工决定" : "暂停"}</strong><small>{executed ? "按决定执行" : "动作尚未发生"}</small></div></div>
    <div className={styles.approvalProof}>{executed ? <><CheckCircle size={14}/> 只有盖章后的金额进入执行</> : <><LockSimple size={14}/> 预览可以看见，副作用还没有发生</>}</div>
  </div>;
}

export function GuardrailGateHero() {
  const scene = AutoScene({ length: 5 });
  const scanned = scene.step >= 1;
  const masked = scene.step === 3;
  const blocked = scene.step === 4;
  return <div ref={scene.ref} className={styles.guardrailHero} data-step={scene.step} role="img" aria-label="带手机号的导出卡片经过扫描闸门，先演示脱敏放行，再演示命中即阻断">
    <div className={styles.guardrailTop}><span>EXPORT GATE / PII CHECK</span><strong>{blocked ? "BLOCK" : masked ? "MASK" : scanned ? "MATCH" : "READY"}</strong></div>
    <SceneControls scene={scene} labels={["送入闸口", "扫字段", "套规则", "脱敏放行", "命中阻断"]} compact />
    <div className={styles.guardrailLane}><div className={styles.guardrailCard}><FileText size={17}/><strong>客户表</strong><code>13800139021</code><small>12 条记录</small></div><div className={styles.guardrailScanner} data-scanned={scanned}><MagnifyingGlass size={18}/><strong>{scanned ? "命中手机号" : "扫描闸门"}</strong><span>{scanned ? "敏感字段" : "等待输入"}</span></div><div className={styles.guardrailOutput} data-blocked={blocked} data-ready={masked}><ShieldCheck size={18}/><strong>{blocked ? "出口关闭" : masked ? "138****9021" : "结果出口"}</strong><small>{blocked ? "完整号码未交付" : masked ? "脱敏放行" : "等规则"}</small></div></div>
    <div className={styles.guardrailProof}>{blocked ? <><X size={14}/> 阻断是处置结果，权限仍由另一层检查</> : masked ? <><CheckCircle size={14}/> 规则只改写这一处输出</> : <><ArrowRight size={14}/> 先把卡片送到规则边界</>}</div>
  </div>;
}

export function ModerationConveyorHero() {
  const scene = AutoScene({ length: 3 });
  const routed = scene.step >= 1;
  const threshold = scene.step === 2 ? 0.7 : 0.8;
  const scores = [0.03, 0.61, 0.94];
  return <div ref={scene.ref} className={styles.moderationHero} data-step={scene.step} role="img" aria-label="三条评论沿传送带经过风险分拣，阈值改变后复核与隐藏队列移动">
    <div className={styles.moderationTop}><span>CONTENT SORTER / POLICY 0.{threshold * 100}</span><strong>{routed ? "ROUTED" : "SCORING"}</strong></div>
    <SceneControls scene={scene} labels={["取得分数", "分到队列", "改变阈值"]} compact />
    <div className={styles.moderationRail}>{scores.map((score, index) => { const status = !routed ? "等待" : score >= threshold ? "隐藏" : score >= threshold - 0.15 ? "复核" : "展示"; return <div key={score} className={styles.moderationSlip} data-status={status}><span>{String.fromCharCode(65 + index)}</span><strong>{score.toFixed(2)}</strong><small>{status}</small></div>; })}</div>
    <div className={styles.moderationQueues}><span>展示</span><span>复核</span><span>隐藏</span></div><div className={styles.moderationProof}>{scene.step === 2 ? <><Funnel size={14}/> 阈值 0.70，队列重新分配</> : <><CheckCircle size={14}/> 分数是信号，去向由产品规则决定</>}</div>
  </div>;
}

export function FineTuningCurveHero() {
  const scene = AutoScene({ length: 3 });
  const overfit = scene.step === 2;
  return <div ref={scene.ref} className={styles.tuningHero} data-step={scene.step} role="img" aria-label="训练曲线继续下降时验证曲线先升后落，最佳检查点被单独标记">
    <div className={styles.tuningTop}><span>CHECKPOINT WALL / TICKET ROUTER</span><strong>{overfit ? "STOP" : scene.step === 1 ? "TRAINING" : "BASELINE"}</strong></div>
    <SceneControls scene={scene} labels={["保留基线", "更新参数", "看验证曲线"]} compact />
    <div className={styles.tuningChart}><div className={styles.tuningAxis}><span>1.0</span><span>0.5</span><span>0</span></div><div className={styles.tuningLines}><span className={styles.tuningGridLine}/><span className={styles.tuningGridLine}/><span className={styles.tuningGridLine}/><svg viewBox="0 0 260 100" preserveAspectRatio="none" aria-hidden="true"><path d="M4 18 C58 36, 90 56, 138 69 S215 82, 256 89" className={styles.tuningTrain}/><path d={overfit ? "M4 70 C55 58, 88 44, 136 32 S202 52, 256 64" : "M4 70 C55 58, 88 44, 136 32 S205 27, 256 28"} className={styles.tuningValidation}/></svg><span className={styles.tuningBest} data-visible={scene.step >= 2}>BEST · 83%</span></div></div>
    <div className={styles.tuningLegend}><span><i className={styles.tuningTrainDot}/>训练损失 ↓</span><span><i className={styles.tuningValidationDot}/>验证准确率 {overfit ? "回落" : "↑"}</span></div><div className={styles.tuningProof}>{overfit ? <><Warning size={14}/> 训练继续变好，泛化已经变差</> : <><CheckCircle size={14}/> 选择检查点要看未参与训练的数据</>}</div>
  </div>;
}

export function WorkingMemoryDeskHero() {
  const scene = AutoScene({ length: 4 });
  const cleared = scene.step === 3;
  const stock = scene.step >= 2;
  return <div ref={scene.ref} className={styles.memoryDeskHero} data-step={scene.step} role="img" aria-label="工作记忆桌面收纳预算、候选和库存回执，交付后只清空临时草稿">
    <div className={styles.memoryDeskTop}><span>TASK DESK / SCRATCH STATE</span><strong>{cleared ? "CLEARED" : stock ? "NARROWED" : "OPEN"}</strong></div><SceneControls scene={scene} labels={["写入快照", "筛预算", "收回执", "交付清理"]} compact />
    <div className={styles.memoryDesk}><div className={styles.memorySticky}><ClipboardText size={17}/><strong>预算 ≤ ¥500</strong><small>交付 2 项现货</small></div><div className={styles.memoryDrawer}><span>临时抽屉</span><div className={styles.memoryChips}><b data-out={scene.step >= 1}>A ¥420</b><b data-out={scene.step >= 1}>B ¥580</b><b data-out={scene.step >= 2}>C ¥399</b><b data-out={scene.step >= 2}>E 无货</b></div><small>{cleared ? "草稿已清空" : stock ? "A、C 留下" : "5 个候选"}</small></div><div className={styles.memoryLongTerm}><Archive size={18}/><strong>长期偏好</strong><small>这次任务不写入</small></div></div><div className={styles.memoryDeskProof}>{cleared ? <><CheckCircle size={14}/> 交付完成，临时抽屉收起</> : <><ArrowRight size={14}/> 回执回来才改写桌面</>}</div>
  </div>;
}
