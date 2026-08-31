"use client";

import { ArrowCounterClockwise, CheckCircle, GitBranch, Play, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";

import { BespokeTermPageProps, TermLabHeader, TermLabLearning } from "@/components/terms/BespokeTermScaffold";

const featureCommits = [
  { id: "F2", hash: "91bd0e", title: "补充空状态", files: 2, additions: 34 },
  { id: "F1", hash: "4ca72b", title: "新增结果筛选", files: 4, additions: 87 },
] as const;

const phaseCopy = [
  {
    eyebrow: "开始前",
    title: "同事更新了 dev，你的功能分支落后了",
    plain: "你从 D1 开始写搜索功能，留下 F1、F2；与此同时，同事把 dev 更新到了 D3。",
    watch: "深绿色 D1–D3 是团队的 dev，黄绿色 F1–F2 是你的 feature/search。两条线从 D1 分开。",
    result: "我们要解决什么？",
    detail: "把你的 F1、F2 改接到最新的 D3 后面。",
  },
  {
    eyebrow: "步骤 1 / 3",
    title: "先把你的两次改动临时收起来",
    plain: "F1、F2 里的代码不会丢，只是先从旧位置拿开，等待重新应用。",
    watch: "两个空心节点代表“待重放的改动”，它们暂时不接在任何提交后面。",
    result: "代码还在",
    detail: "离开历史的是旧提交节点，不是你写的内容。",
  },
  {
    eyebrow: "步骤 2 / 3",
    title: "把第一份改动接到最新的 D3 后",
    plain: "Git 在 D3 后重新应用 F1 的内容，因此生成一个新提交 F1′。",
    watch: "F1′ 的内容与 F1 相同，但它现在接在 D3 后面，所以父提交和哈希都变了。",
    result: "第一份改动已接回",
    detail: "F1 变成 F1′，新的父提交是 D3。",
  },
  {
    eyebrow: "步骤 3 / 3",
    title: "再接回第二份改动，历史变成一条线",
    plain: "Git 把 F2 的内容重新应用到 F1′ 后面，生成新提交 F2′。",
    watch: "现在顺序是 D1 → D2 → D3 → F1′ → F2′，feature/search 已经跟上 dev。",
    result: "这就是 Rebase",
    detail: "把自己的改动逐个接到目标分支的最新位置。",
  },
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
        <TermLabHeader term={term} eyebrow="版本历史实验" summary="当团队分支更新了，把你自己的改动依次接到最新位置。" />

        <section className="rebase-workbench" aria-labelledby="rebase-workbench-title">
          <div className="rebase-commandbar">
            <div><GitBranch size={18} /><span>当前分支</span><strong>feature/search</strong></div>
            <code>$ git rebase dev</code>
            <button type="button" className="lab-primary" onClick={advanceRebase}><Play size={16} weight="fill" />{phase === 0 ? "开始：收起改动" : phase === 1 ? "下一步：接回 F1" : phase === 2 ? "下一步：接回 F2" : "重新看一遍"}</button>
            <button type="button" className="lab-icon-button" onClick={resetRebase} aria-label="重置 Rebase 实验" title="重置"><ArrowCounterClockwise size={18} /></button>
          </div>

          <div className="rebase-primer">
            <div><span>先认图</span><p><b>D</b> 是团队 dev 的提交　<b>F</b> 是你在功能分支上的提交　<b>′</b> 表示重新生成</p></div>
            <div><span>一句话目标</span><p>让你的 F1、F2 从最新的 D3 后面继续。</p></div>
          </div>

          <div className="rebase-workbench-body">
            <div className="rebase-canvas">
              <div className="rebase-canvas-heading" aria-live="polite"><span>{copy.eyebrow}</span><strong id="rebase-workbench-title">{copy.title}</strong><p>{copy.plain}</p></div>
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
                <button type="button" className={phase === 1 ? "is-current" : phase > 1 ? "is-done" : ""} onClick={() => setPhase(1)} aria-pressed={phase === 1}><b>1</b><span>先收起你的两次改动</span></button>
                <button type="button" className={phase === 2 ? "is-current" : phase > 2 ? "is-done" : ""} onClick={() => setPhase(2)} aria-pressed={phase === 2}><b>2</b><span>把 F1 接到 D3 后</span></button>
                <button type="button" className={phase === 3 ? "is-current" : ""} onClick={() => setPhase(3)} aria-pressed={phase === 3}><b>3</b><span>把 F2 接到 F1′ 后</span></button>
              </div>
            </div>

            <aside className="commit-inspector rebase-guide">
              <span>本步大白话</span>
              <div className="rebase-guide-copy"><i>{String(phase).padStart(2, "0")}<small>/03</small></i><strong>{copy.plain}</strong></div>
              <div className="rebase-watch"><span>看图时注意</span><p>{copy.watch}</p></div>
              <div className="rebase-node-detail">
                <span>当前节点 · 点 F1 / F2 可切换</span>
                <div><i>{detached ? `${current.id} ↟` : replayed ? `${current.id}′` : current.id}</i><p><strong>{current.title}</strong><code>{detached ? "等待接回" : replayed ? `新哈希 b7${current.hash.slice(2, 6)}` : `原哈希 ${current.hash}`}</code></p></div>
                <dl><div><dt>它接在谁后面</dt><dd>{detached ? "暂时没有" : replayed ? (current.id === "F1" ? "D3" : "F1′") : (current.id === "F1" ? "D1" : "F1")}</dd></div></dl>
              </div>
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
