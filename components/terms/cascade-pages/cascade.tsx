"use client";

import { ArrowCounterClockwise, CheckCircle, Flag, Info, LockKey, Stack, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import styles from "./CascadeConcept.module.css";

type LayerMode = "normal" | "important";
type Candidate = { id: string; label: string; code: string; color: string; origin: string; layer: string; specificity: string; reason: string; icon: typeof Flag };

const candidates: Candidate[] = [
  { id: "ua", label: "浏览器默认", code: "button { color: black }", color: "black", origin: "UA normal", layer: "默认层", specificity: "0-0-1", reason: "作者普通样式出现后，默认声明先退出。", icon: Flag },
  { id: "base", label: "组件基础层", code: "@layer base { .button { color: seagreen } }", color: "seagreen", origin: "author normal", layer: "base", specificity: "0-1-0", reason: "它来自作者，但后来的主题层还可以在层这一关胜过它。", icon: Stack },
  { id: "theme", label: "主题层", code: "@layer theme { #app .button { color: olive } }", color: "olive", origin: "author normal", layer: "theme", specificity: "1-1-0", reason: "theme 层后来创建，base 已被淘汰；这里不需要拿 ID 来救场。", icon: Stack },
  { id: "plain", label: "未分层修复", code: ".button { color: tomato }", color: "tomato", origin: "author normal", layer: "隐式最终层", specificity: "0-1-0", reason: "普通未分层声明在命名层之后，成为作者普通样式的最后一层。", icon: Info },
  { id: "inline", label: "行内样式", code: "style=\"color: plum\"", color: "plum", origin: "author inline", layer: "行内", specificity: "—", reason: "行内普通声明排在作者样式表之后。", icon: Flag },
  { id: "important", label: "保护性重要声明", code: "@layer base { .button { color: navy !important } }", color: "navy", origin: "author important", layer: "base（重要顺序）", specificity: "0-1-0", reason: "重要声明和普通声明分开比较；它先胜过普通行内值。", icon: LockKey },
];

function decisionFor(candidate: Candidate, mode: LayerMode, index: number, visibleLength: number) {
  if (mode === "important" && candidate.id === "important") {
    return visibleLength === 6
      ? { state: "winner", label: "重要区胜出", note: candidate.reason }
      : { state: "waiting", label: "还未加入", note: "重要声明会在普通候选走完后进入另一场比较。" };
  }
  if (candidate.id === "important") return { state: "waiting", label: "点击“重要声明”", note: "它还没有进入普通声明的比较区。" };
  if (mode === "normal" && index === 0 && visibleLength > 1) return { state: "out", label: "来源更低", note: candidate.reason };
  if (mode === "important" && visibleLength === 6) return { state: "out", label: "普通区让位", note: "重要声明进入独立比较区，普通声明不再和它直接竞争。" };
  const winner = index === visibleLength - 1;
  return { state: winner ? "winner" : "out", label: winner ? "当前胜者" : "被后来的条件淘汰", note: winner ? "先留下，再等待后续条件；继续点下一张便签观察它是否仍在场。" : candidate.reason };
}

export function CascadeLesson() {
  const [mode, setMode] = useState<LayerMode>("normal");
  const [revealed, setRevealed] = useState(0);
  const visible = useMemo(() => candidates.slice(0, Math.min(6, revealed + 1)), [revealed]);
  const winner = mode === "important" && revealed >= 5 ? candidates[5] : candidates[Math.min(4, revealed)];
  function reset() { setMode("normal"); setRevealed(0); }
  function advance() { setRevealed(value => value >= (mode === "important" ? 5 : 4) ? 0 : value + 1); }
  return <div className={styles.lab} role="region" aria-label="层叠候选声明筛选演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>找出按钮最终的 color，并说清淘汰发生在哪一关</strong></div><button type="button" onClick={reset} aria-label="重置层叠演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.labControls} role="group" aria-label="选择声明类型"><button type="button" aria-pressed={mode === "normal"} onClick={() => { setMode("normal"); setRevealed(0); }}>普通声明</button><button type="button" aria-pressed={mode === "important"} onClick={() => { setMode("important"); setRevealed(0); }}>加入 !important</button><button type="button" onClick={advance}>{revealed >= (mode === "important" ? 5 : 4) ? "重新看筛选" : "放入下一张便签"}</button></div>
    <div className={styles.labStage}>
      <div className={styles.labTarget}><span>目标元素</span><button style={{ color: winner.color }} type="button" aria-label={`按钮文字颜色为 ${winner.color}`}>保存草稿</button><code>{winner.code}</code></div>
      <div className={styles.labList}>{visible.map((candidate, index) => { const result = decisionFor(candidate, mode, index, visible.length); const Icon = result.state === "winner" ? CheckCircle : result.state === "out" ? WarningCircle : candidate.icon; return <div className={styles.labRow} data-state={result.state} key={candidate.id}><Icon size={19} aria-hidden="true" /><div><strong>{candidate.label}</strong><code>{candidate.code}</code><small>{candidate.origin} · {candidate.layer} · 优先级 {candidate.specificity}</small></div><span>{result.label}</span><p>{result.note}</p></div>; })}</div>
    </div>
    <div className={styles.labSummary} aria-live="polite"><span>当前账本</span><strong>{mode === "important" && visible.length === 6 ? "普通区暂停，重要区接手" : `${Math.min(visible.length, 5)} / 5 张普通便签已放入`}</strong><p>{mode === "important" && visible.length === 6 ? "!important 改变的是比较区和层顺序，不是给选择器加分。" : mode === "important" ? "先把普通候选走完，再放入重要声明，看它怎样切换比较区。" : visible.length === 5 ? "普通区最后留下行内值；接下来可以切换重要声明，观察比较如何重新开始。" : "先放入一张，再问它在哪一关退出；不要一开始就跳到最终颜色。"}</p></div>
  </div>;
}
