"use client";

import { ArrowCounterClockwise, CheckCircle, GitBranch, Play, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";

import { BespokeTermPageProps, TermLabHeader, TermLabLearning } from "@/components/terms/BespokeTermScaffold";

const featureCommits = [
  { id: "F2", hash: "91bd0e", title: "补充空状态", files: 2, additions: 34 },
  { id: "F1", hash: "4ca72b", title: "新增结果筛选", files: 4, additions: 87 },
] as const;

const phaseCopy = [
  { eyebrow: "变基前", title: "feature 从 D1 分叉，dev 已经前进到 D3", result: "两条历史仍然分叉", detail: "F1、F2 的父链还停在旧的 D1 上。" },
  { eyebrow: "步骤 1 / 3", title: "摘下 F1、F2，变成等待重放的补丁", result: "提交已经临时摘下", detail: "工作内容保留，原来的提交节点暂时离开历史。" },
  { eyebrow: "步骤 2 / 3", title: "先在 D3 后重放 F1，生成 F1′", result: "F1′ 已经接到 D3", detail: "内容相同，但父提交和提交哈希已经改变。" },
  { eyebrow: "步骤 3 / 3", title: "继续重放 F2，生成一条线性的历史", result: "历史已经排成直线", detail: "feature/search 现在从 dev 最新提交继续向前。" },
] as const;

type RebasePhase = 0 | 1 | 2 | 3;

export function RebaseTermPage({ term, related }: BespokeTermPageProps) {
  const [phase, setPhase] = useState<RebasePhase>(0);
  const [selected, setSelected] = useState<(typeof featureCommits)[number]["id"]>("F2");
  const current = featureCommits.find((commit) => commit.id === selected)!;
  const replayed = selected === "F1" ? phase >= 2 : phase >= 3;
  const detached = phase === 1 || (phase === 2 && selected === "F2");
  const copy = phaseCopy[phase];
  function advanceRebase() {
    setPhase((currentPhase) => currentPhase === 3 ? 0 : (currentPhase + 1) as RebasePhase);
  }

  function resetRebase() {
    setPhase(0);
  }

  return (
    <main className="bespoke-term-page rebase-term-page">
      <div className="bespoke-term-shell">
        <TermLabHeader term={term} eyebrow="版本历史实验" summary="把自己的提交临时拿下来，让 dev 先走过，再把提交依次接回去。" />

        <section className="rebase-workbench" aria-labelledby="rebase-workbench-title">
          <div className="rebase-commandbar">
            <div><GitBranch size={18} /><span>当前分支</span><strong>feature/search</strong></div>
            <code>$ git rebase dev</code>
            <button type="button" className="lab-primary" onClick={advanceRebase}><Play size={16} weight="fill" />{phase === 0 ? "开始 Rebase" : phase === 3 ? "重新开始" : "下一步"}</button>
            <button type="button" className="lab-icon-button" onClick={resetRebase} aria-label="重置 Rebase 实验" title="重置"><ArrowCounterClockwise size={18} /></button>
          </div>

          <div className="rebase-workbench-body">
            <div className="rebase-canvas">
              <div className="rebase-canvas-heading" aria-live="polite"><span>{copy.eyebrow}</span><strong id="rebase-workbench-title">{copy.title}</strong></div>
              <div className={`commit-graph phase-${phase}`}>
                <div className="graph-main-line" aria-hidden="true" />
                <div className="graph-fork-line" aria-hidden="true" />
                <div className="graph-feature-line" aria-hidden="true" />
                <span className="graph-branch-label graph-dev-label">dev</span>
                <span className="graph-branch-label graph-feature-label">feature/search</span>
                <span className="graph-holding-label">待重放补丁</span>
                {(["D1", "D2", "D3"] as const).map((commit) => <span className={`graph-commit graph-${commit.toLowerCase()}`} key={commit}>{commit}</span>)}
                <button type="button" className={`graph-commit graph-feature-commit graph-f1${selected === "F1" ? " is-selected" : ""}`} onClick={() => setSelected("F1")} aria-pressed={selected === "F1"}>{phase >= 2 ? "F1′" : "F1"}</button>
                <button type="button" className={`graph-commit graph-feature-commit graph-f2${selected === "F2" ? " is-selected" : ""}`} onClick={() => setSelected("F2")} aria-pressed={selected === "F2"}>{phase >= 3 ? "F2′" : "F2"}</button>
              </div>
              <div className="rebase-explanation" role="group" aria-label="逐步查看 Rebase 过程">
                <button type="button" className={phase === 1 ? "is-current" : phase > 1 ? "is-done" : ""} onClick={() => setPhase(1)} aria-pressed={phase === 1}><b>1</b><span>临时摘下 F1、F2</span></button>
                <button type="button" className={phase === 2 ? "is-current" : phase > 2 ? "is-done" : ""} onClick={() => setPhase(2)} aria-pressed={phase === 2}><b>2</b><span>在 D3 后生成 F1′</span></button>
                <button type="button" className={phase === 3 ? "is-current" : ""} onClick={() => setPhase(3)} aria-pressed={phase === 3}><b>3</b><span>在 F1′ 后生成 F2′</span></button>
              </div>
            </div>

            <aside className="commit-inspector">
              <span>当前选中</span><div className="commit-inspector-title"><i>{detached ? `${current.id} ↟` : replayed ? `${current.id}′` : current.id}</i><div><strong>{current.title}</strong><code>{detached ? "patch ready" : replayed ? `b7${current.hash.slice(2, 6)}` : current.hash}</code></div></div>
              <dl><div><dt>父提交</dt><dd>{detached ? "等待重放" : replayed ? (current.id === "F1" ? "D3" : "F1′") : (current.id === "F1" ? "D1" : "F1")}</dd></div><div><dt>影响文件</dt><dd>{current.files}</dd></div><div><dt>新增行</dt><dd>+{current.additions}</dd></div></dl>
              <div className="rebase-result"><CheckCircle size={18} weight={phase === 3 ? "fill" : "regular"} /><p><strong>{copy.result}</strong><span>{copy.detail}</span></p></div>
            </aside>
          </div>
          <div className="rebase-safety"><ShieldCheck size={19} /><p><strong>安全边界</strong><span>只整理尚未共享的本地提交。已经推送并被别人使用的历史，不要随意 Rebase。</span></p></div>
        </section>

        <TermLabLearning related={related} sources={[
          { label: "Git · Rebase", note: "官方命令与冲突处理", url: "https://git-scm.com/docs/git-rebase" },
          { label: "Pro Git · Rebasing", note: "理解变基与历史重写", url: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing" },
        ]} />
      </div>
    </main>
  );
}
