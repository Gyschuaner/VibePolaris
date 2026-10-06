"use client";

import { Calculator, CheckCircle, Columns, Database, Lightning, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./Vbp096DatabaseHeroes.module.css";

const columnSteps = ["类型写进列", "比较发生", "计算发生", "错误被挡住"];
const columnValues = ["2", "10", "9.5", "abc"];

export function ColumnMechanismHero() {
  const scene = useScene(columnSteps.length);
  const [type, setType] = useState<"text" | "numeric">("numeric");
  const numeric = type === "numeric";
  const final = scene.step === columnSteps.length - 1;
  const sorted = numeric ? ["2", "9.5", "10"] : ["10", "2", "9.5"];
  return <figure ref={scene.ref} className={styles.frame} data-kind="column" data-step={scene.step} aria-label="数据库列类型改变比较、求和和错误输入的结果">
    <div className={styles.header}><span>同一批值，列类型让它们走不同的路</span><strong>{numeric ? "NUMERIC" : "TEXT"}</strong></div>
    <SceneControls scene={scene} labels={columnSteps} />
    <div className={styles.controls} role="group" aria-label="切换列类型">
      <button type="button" aria-pressed={numeric} onClick={() => { setType("numeric"); scene.seek(0); }}><Calculator size={15} />amount NUMERIC</button>
      <button type="button" aria-pressed={!numeric} onClick={() => { setType("text"); scene.seek(0); }}><Columns size={15} />amount TEXT</button>
    </div>
    <div className={styles.columnBoard}>
      <div className={styles.inputStrip}><span>输入值</span>{columnValues.map((value) => <b key={value} data-invalid={value === "abc" && numeric}>{value}</b>)}</div>
      <div className={styles.typeCard} data-active={scene.step >= 0}><Database size={19} /><span>列定义</span><strong>amount {numeric ? "NUMERIC" : "TEXT"}</strong><small>{numeric ? "数字可比较、可求和" : "字符逐个比较"}</small></div>
      <div className={styles.resultGrid}>
        <div data-active={scene.step >= 1}><span>ORDER BY amount</span><strong>{scene.step >= 1 ? sorted.join(" → ") : "等待比较"}</strong><small>{numeric ? "数值序" : "字典序"}</small></div>
        <div data-active={scene.step >= 2}><span>SUM(amount)</span><strong>{scene.step >= 2 && numeric ? "21.5" : scene.step >= 2 ? "不可直接求和" : "等待运算"}</strong><small>{numeric ? "聚合有数值语义" : "字符串不是金额"}</small></div>
      </div>
      <div className={styles.guard} data-danger={final && numeric === false} data-active={scene.step >= 3}>
        {final && numeric ? <CheckCircle size={18} /> : final ? <WarningCircle size={18} /> : <ShieldCheck size={18} />}
        <span>{final ? numeric ? "abc 在写入边界被拒" : "abc 也被接收，错误留到更晚" : "类型检查尚未运行"}</span>
      </div>
    </div>
    <div className={styles.status} role="status"><strong>{scene.step === 0 ? "先定义属性" : scene.step === 1 ? "比较依赖类型" : scene.step === 2 ? "计算依赖类型" : "错误暴露的位置也不同"}</strong><span>{numeric ? "NUMERIC 把金额当数量处理。" : "TEXT 只保存字符，不替你赋予金额语义。"}</span></div>
    <figcaption>列不是表头装饰：它把名称、类型和约束放进写入边界，决定后面的比较、计算与失败位置。</figcaption>
  </figure>;
}

