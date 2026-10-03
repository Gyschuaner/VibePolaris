"use client";

import { ArrowRight, GitBranch, GitCommit, Pencil, Stack } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

function RepoCommitLesson() {
  const scene = useScene(3);
  const labels = ["看见差异", "挑进暂存区", "写入本地历史"];
  const staged = scene.step >= 1;
  const committed = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工作区到提交历史演示">
    <Caption scene={scene} labels={labels} titles={["先确认要提交什么", "只把修复放进候选", "提交写入本地历史"]} copy={["工作区有一个修复和一行格式调整；远程还看不到它们。", "暂存区只接收修复 hunk，格式调整留在工作区。", "HEAD 指向新的提交快照；远程分支仍停在旧提交，推送是另一件事。"]} />
    <div className={styles.gitBoard}><div className={styles.contract}><div><Pencil size={25} /><h3>工作区</h3><p>{committed ? "修复已提交；格式调整仍未暂存" : "修复 + 格式调整"}</p></div><div><Stack size={25} /><h3>暂存区</h3><p>{staged ? "只含修复 hunk" : "尚未选择"}</p></div><div><GitCommit size={25} /><h3>HEAD</h3><p>{committed ? "c2 · 修复按钮" : "c1 · 旧快照"}</p></div></div><div className={styles.resultFlow}><ArrowRight size={18} />{committed ? "本地提交已创建，origin/main 未改变" : staged ? "git commit 将只读取暂存内容" : "先用 diff 确认范围"}</div></div>
    <div className={styles.choices} role="group" aria-label="推进提交流程"><button type="button" onClick={() => scene.seek(1)} aria-pressed={staged}>暂存修复</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={committed}>创建提交</button></div>
  </div>;
}

function BranchLesson() {
  const scene = useScene(3);
  const labels = ["共同起点", "创建指针", "两条线各自前进"];
  const split = scene.step >= 1;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git 分支指针演示">
    <Caption scene={scene} labels={labels} titles={["main 先指向共同提交", "创建分支只增加一个指针", "提交让当前分支移动"]} copy={["当前只有 main 指向 A；还没有创建 feature，也没有复制第二套文件。", "feature 指向同一个 A；切到 feature 后 HEAD 才会在它上面提交。", "feature 前进到 B，main 仍在 A；主线后来前进到 C，合并前要比较两条历史。"]} />
    <div className={styles.gitGraph} aria-label="分支提交图"><div className={styles.gitGraphRow}><span className={styles.gitNode}>A</span><span>main</span>{split && <><span className={styles.gitLine} /><span className={styles.gitNode} data-active="true">{scene.step === 2 ? "B" : "A"}</span><span>feature</span></>}</div><div className={styles.gitGraphRow}><GitBranch size={20} /><span>{split ? `HEAD → feature；两个分支共享 A${scene.step === 2 ? "，feature 已前进到 B" : "，还没有分叉"}` : "HEAD → main；当前只有一条分支"}</span></div></div>
    <div className={styles.choices} role="group" aria-label="推进分支流程"><button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>创建 feature</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={scene.step === 2}>在 feature 提交</button></div>
  </div>;
}

function WorkingTreeLesson() {
  const scene = useScene(3);
  const labels = ["三层对齐", "编辑工作树", "加入暂存区"];
  const edited = scene.step >= 1;
  const staged = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="HEAD 索引与工作树演示">
    <Caption scene={scene} labels={labels} titles={["刚检出时三层一致", "保存只改变工作树", "git add 复制当前内容到索引"]} copy={["HEAD、index 和工作树都显示 settings.ts 的旧版本。", "把 timeout 改为 30 后，只有工作树出现新行。", "执行 git add 后，index 也记录 30；HEAD 仍是旧提交。"]} />
    <div className={styles.gitLayers} aria-label="Git 三层快照"><div data-active={false}><GitCommit size={22} /><strong>HEAD</strong><code>timeout = 10</code></div><ArrowRight size={18} /><div data-active={staged}><Stack size={22} /><strong>index</strong><code>{staged ? "timeout = 30" : "timeout = 10"}</code></div><ArrowRight size={18} /><div data-active={edited}><Pencil size={22} /><strong>工作树</strong><code>{edited ? "timeout = 30" : "timeout = 10"}</code></div></div>
    <div className={styles.choices} role="group" aria-label="改变 Git 层"><button type="button" onClick={() => scene.seek(1)} aria-pressed={edited}>编辑文件</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={staged}>git add</button></div>
  </div>;
}

function StagingAreaLesson() {
  const scene = useScene(3);
  const labels = ["两个 hunk 都在工作区", "只暂存修复", "提交后留下另一块"];
  const staged = scene.step >= 1;
  const committed = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="暂存区选择 hunk 演示">
    <Caption scene={scene} labels={labels} titles={["同一文件里有两类改动", "index 只收下修复 hunk", "提交修复，格式改动仍在工作区"]} copy={["login.ts 同时修复空值和调整缩进；两块都还未暂存。", "git add -p 只选择空值修复，staged diff 因此缩小。", "提交后修复进入历史，格式调整仍显示为未暂存，下一次可独立处理。"]} />
    <div className={styles.gitHunks} aria-label="文件的两个变更块"><div data-state={committed ? "committed" : staged ? "staged" : "work"}><strong>修复空值</strong><code>+ if (!user) return;</code><span>{committed ? "已提交" : staged ? "已暂存" : "工作区"}</span></div><div data-state="work"><strong>格式调整</strong><code>+ const label = …</code><span>未暂存</span></div></div>
    <div className={styles.choices} role="group" aria-label="选择暂存动作"><button type="button" onClick={() => scene.seek(1)} aria-pressed={staged}>只暂存修复</button><button type="button" onClick={() => scene.seek(2)} aria-pressed={committed}>提交修复</button></div>
  </div>;
}

function DiffLesson() {
  const scene = useScene(3);
  const labels = ["工作树对 index", "index 对 HEAD", "比较两个分支"];
  const views = [{ left: "工作树", right: "index", line: "- timeout = 10  + timeout = 30" }, { left: "index", right: "HEAD", line: "- enabled = false  + enabled = true" }, { left: "feature", right: "main", line: "- 按钮无响应  + 按钮有反馈" }];
  const view = views[scene.step];
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="Git diff 端点比较演示">
    <Caption scene={scene} labels={labels} titles={["未暂存的变化", "下一次提交的变化", "两个分支之间的变化"]} copy={["git diff 默认比较工作树与 index。", "git diff --staged 比较 index 与 HEAD，正是提交候选。", "给出两个分支后，diff 只说明内容差别，还要结合测试判断意图。"]} />
    <div className={styles.gitDiff} aria-live="polite"><div><span>{view.left}</span><ArrowRight size={18} /><span>{view.right}</span></div><code>{view.line}</code><small>同一行的颜色只说明端点不同，不说明哪一边正确。</small></div>
  </div>;
}

export function GitWorkflowLesson({ slug }: { slug: string }) {
  if (slug === "repo-commit") return <RepoCommitLesson />;
  if (slug === "branch") return <BranchLesson />;
  if (slug === "working-tree") return <WorkingTreeLesson />;
  if (slug === "staging-area") return <StagingAreaLesson />;
  if (slug === "diff") return <DiffLesson />;
  return null;
}
