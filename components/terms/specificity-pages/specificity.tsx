"use client";

import { ArrowCounterClockwise, CheckCircle, Code, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./SpecificityConcept.module.css";

const choices = [
  { id: "class", label: ".card", score: "0-1-0", color: "seagreen", reason: "只有一个 class 列。" },
  { id: "id", label: "#settings .card", score: "1-1-0", color: "tomato", reason: "ID 列先于所有 class 列。" },
  { id: "where", label: ":where(#settings) .card", score: "0-1-0", color: "olive", reason: ":where() 的参数不增加优先级。" },
  { id: "is", label: ":is(#settings, .panel) .card", score: "1-1-0", color: "plum", reason: ":is() 取参数中的最高一列。" },
];

export function SpecificityLesson() {
  const [selected, setSelected] = useState("class");
  const [showTie, setShowTie] = useState(false);
  const scene = useScene(3);
  const current = choices.find(choice => choice.id === selected) ?? choices[0];
  const columns = current.score.split("-");
  return <div ref={scene.ref} className={styles.lab} role="region" aria-label="选择器优先级三列比较演示">
    <div className={styles.labHeader}><div><span>读者任务</span><strong>选一条规则，找出它在哪一列赢</strong></div><button type="button" onClick={() => { setSelected("class"); setShowTie(false); scene.seek(0); }} aria-label="重置选择器优先级演示"><ArrowCounterClockwise size={17} /></button></div>
    <div className={styles.choices} role="group" aria-label="选择候选选择器">{choices.map(choice => <button key={choice.id} type="button" aria-pressed={selected === choice.id} onClick={() => { setSelected(choice.id); setShowTie(false); }}>{choice.label}</button>)}</div>
    <div className={styles.labBoard}>
      <div className={styles.labTarget}><span>目标元素</span><button type="button" style={{ color: current.color }}>保存</button><code>class=&quot;card&quot;</code></div>
      <div className={styles.labLedger}><div className={styles.ledgerHeading}><Code size={16} aria-hidden="true" /><strong>{current.label}</strong><span>{current.score}</span></div><div className={styles.ledgerColumns}>{columns.map((value, index) => <div key={`${value}-${index}`} data-active={index === 0 || (index === 1 && columns[0] === "0") || (index === 2 && columns[0] === "0" && columns[1] === "0")}><b>{value}</b><small>{["ID 列", "类列", "元素列"][index]}</small></div>)}</div><p>{current.reason}</p></div>
    </div>
    <div className={styles.labActions}><button type="button" onClick={() => { setSelected("class"); setShowTie(value => !value); }} aria-pressed={showTie}>{showTie ? "收起相同分数" : "看相同分数"}</button><button type="button" onClick={() => scene.seek((scene.step + 1) % 3)} aria-label="查看优先级下一种情况">下一种情况</button></div>
    <div className={styles.labStatus} role="status">{showTie ? <><WarningCircle size={17} aria-hidden="true" /><span><strong>0-1-0 和 0-1-0 相同。</strong>前三列都相同，才轮到作用域和出现顺序。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span><strong>{current.score}。</strong>{current.reason} 这一步没有把字符长度算进去。</span></>}</div>
  </div>;
}
