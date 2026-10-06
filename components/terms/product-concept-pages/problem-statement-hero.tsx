"use client";

import { ChartLineUp, CheckCircle, FileText, GitBranch, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["方案口号", "看见现场", "串起影响", "保留选择"];
const captions = [
  "‘做一个智能搜索’已经偷偷选了答案；把它放回桌面，先不要排期。",
  "镜头对准客服查单的现场：她在多个系统间来回翻找，事实比口号更硬。",
  "把场景、阻碍和影响连起来：确认状态变慢，客户等待和转人工一起上升。",
  "问题边界固定下来，搜索、流程调整和内容改版都可以作为候选答案比较。",
];

export function ProblemStatementHero() {
  const scene = useScene(labels.length);
  const step = scene.step;
  const observed = step >= 1;
  const connected = step >= 2;
  const open = step >= 3;
  return <MechanismFrame scene={scene} title="问题陈述怎样把口号变成可比较的现场" labels={labels} caption={captions[step]}>
    <div className={styles.problemScene}>
      <div className={styles.problemBoard}>
        <div className={styles.problemBoardHead}><FileText size={16} /><span>DISCOVERY BOARD</span><strong>{open ? "问题已定界" : observed ? "正在取证" : "待验证"}</strong></div>
        <div className={styles.problemLens} data-active={observed}><MagnifyingGlass size={20} /><div><small>{observed ? "观察到的事实" : "先放下方案"}</small><strong>{observed ? "客服在订单、物流、退款三处来回查找" : "我们需要做一个智能搜索"}</strong></div></div>
        <div className={styles.problemEvidence} data-active={connected}><div className={styles.problemEvidenceCell}><small>想完成</small><strong>尽快确认状态</strong></div><GitBranch size={17} /><div className={styles.problemEvidenceCell}><small>付出的成本</small><strong>{connected ? "等待变长 · 转人工" : "还没有串起来"}</strong></div></div>
      </div>
      <div className={styles.problemOptions} data-open={open}>
        <div className={styles.problemOptionsHead}><ChartLineUp size={16} /><span>候选答案</span></div>
        <div className={styles.problemOption} data-picked={open}>智能搜索 <small>{open ? "可比较" : "先别定"}</small></div>
        <div className={styles.problemOption} data-picked={false}>统一订单入口 <small>另一种答案</small></div>
        <div className={styles.problemProof} role="status">{open ? <CheckCircle size={16} /> : <WarningCircle size={16} />}<span>{open ? "问题先成立，方案才有比较的起点" : "没有证据，影响只能算假设"}</span></div>
      </div>
    </div>
  </MechanismFrame>;
}
