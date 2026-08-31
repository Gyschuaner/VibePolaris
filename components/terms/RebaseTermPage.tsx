"use client";

import { ArrowCounterClockwise, CheckCircle, GitBranch, Play, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";

import { BespokeTermPageProps, TermLabHeader, TermLabLearning } from "@/components/terms/BespokeTermScaffold";

const featureCommits = [
  { id: "F2", hash: "91bd0e", title: "补充空状态", files: 2, additions: 34 },
  { id: "F1", hash: "4ca72b", title: "新增结果筛选", files: 4, additions: 87 },
] as const;

export function RebaseTermPage({ term, related }: BespokeTermPageProps) {
  const [rebased, setRebased] = useState(false);
  const [selected, setSelected] = useState<(typeof featureCommits)[number]["id"]>("F2");
  const current = featureCommits.find((commit) => commit.id === selected)!;

  return (
    <main className="bespoke-term-page rebase-term-page">
      <div className="bespoke-term-shell">
        <TermLabHeader term={term} eyebrow="版本历史实验" summary="把自己的提交临时拿下来，让 dev 先走过，再把提交依次接回去。" />

        <section className="rebase-workbench" aria-labelledby="rebase-workbench-title">
          <div className="rebase-commandbar">
            <div><GitBranch size={18} /><span>当前分支</span><strong>feature/search</strong></div>
            <code>$ git rebase dev</code>
            <button type="button" className="lab-primary" onClick={() => setRebased(true)} disabled={rebased}><Play size={16} weight="fill" />{rebased ? "已完成" : "执行 Rebase"}</button>
            <button type="button" className="lab-icon-button" onClick={() => setRebased(false)} aria-label="重置 Rebase 实验" title="重置"><ArrowCounterClockwise size={18} /></button>
          </div>

          <div className="rebase-workbench-body">
            <div className="rebase-canvas">
              <div className="rebase-canvas-heading"><div><span>操作前</span><strong id="rebase-workbench-title">两条分支从旧节点分叉</strong></div><div><span>操作后</span><strong>Feature 接到 dev 最新提交之后</strong></div></div>
              <div className={`commit-graph${rebased ? " is-rebased" : ""}`} aria-live="polite">
                <div className="graph-lane graph-lane-dev"><span>dev</span><i /><i /><i className="graph-head" /><b>D3</b></div>
                <div className="graph-lane graph-lane-feature"><span>feature/search</span><i /><i /><button type="button" className={selected === "F1" ? "is-selected" : ""} onClick={() => setSelected("F1")} aria-pressed={selected === "F1"}>F1</button><button type="button" className={selected === "F2" ? "is-selected" : ""} onClick={() => setSelected("F2")} aria-pressed={selected === "F2"}>F2</button></div>
                <div className="graph-junction" aria-hidden="true" />
              </div>
              <div className="rebase-explanation">
                <span className={rebased ? "is-done" : "is-current"}><b>1</b>临时摘下 F1、F2</span>
                <span className={rebased ? "is-done" : ""}><b>2</b>让 dev 的 D2、D3 先进入历史</span>
                <span className={rebased ? "is-current" : ""}><b>3</b>重新生成 F1′、F2′</span>
              </div>
            </div>

            <aside className="commit-inspector">
              <span>当前选中</span><div className="commit-inspector-title"><i>{rebased ? `${current.id}′` : current.id}</i><div><strong>{current.title}</strong><code>{rebased ? `b7${current.hash.slice(2, 6)}` : current.hash}</code></div></div>
              <dl><div><dt>父提交</dt><dd>{rebased ? (current.id === "F1" ? "D3" : "F1′") : (current.id === "F1" ? "D1" : "F1")}</dd></div><div><dt>影响文件</dt><dd>{current.files}</dd></div><div><dt>新增行</dt><dd>+{current.additions}</dd></div></dl>
              <div className="rebase-result"><CheckCircle size={18} weight={rebased ? "fill" : "regular"} /><p><strong>{rebased ? "历史已经排成直线" : "提交仍从旧节点分叉"}</strong><span>{rebased ? "内容没变，但提交哈希已经重写。" : "执行后会生成新的 F1′ 与 F2′。"}</span></p></div>
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
