"use client";

import { useState } from "react";
import { Check, Play, Warning } from "@phosphor-icons/react";
import { ConceptHero } from "../ConceptHero";
import styles from "./TypeScriptConcept.module.css";

export function TypeScriptHero() {
  return <ConceptHero slug="typescript" label="类型检查标出字符串与数字的错配；类型标注擦除后，JavaScript 仍会把字符串 2 和数字 3 拼成 23">
    <div className={styles.miniEditor}>
      <div className={styles.miniLabel}><span>类型检查</span><span>运行 JavaScript</span></div>
      <code className={styles.miniCode}>function add(<br />&nbsp; a<span className={styles.miniType}>: number</span>,<br />&nbsp; b<span className={styles.miniType}>: number</span><br />) &#123; return a + b; &#125;</code>
      <code className={styles.miniCall}>add(<span>"2"</span>, 3)</code>
      <div className={styles.miniNotice}><span>string ≠ number</span><strong>"23"</strong></div>
    </div>
  </ConceptHero>;
}

export function TypeAnnotationLab() {
  const [isText, setIsText] = useState(true);
  const [showTypes, setShowTypes] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  function run() {
    const value = isText ? "2" : 2;
    // Only this displayed expression runs; the example never evaluates user code.
    setResult(JSON.stringify(typeof value === "string" ? value + 3 : value + 3));
  }
  return <figure className={styles.lab} aria-label="类型标注与 JavaScript 执行对照实验">
    <div className={styles.controls} role="group" aria-label="选择第一个参数">
      <span>第一个参数</span>
      <button type="button" aria-pressed={!isText} onClick={() => { setIsText(false); setResult(null); }}>数字 2</button>
      <button type="button" aria-pressed={isText} onClick={() => { setIsText(true); setResult(null); }}>文字 "2"</button>
    </div>
    <div className={styles.editor} data-types={showTypes}>
      <div className={styles.editorHead}><span>{showTypes ? "add.ts · 类型检查" : "add.js · 擦除类型标注"}</span><button type="button" onClick={() => setShowTypes(value => !value)}>{showTypes ? "看 JavaScript" : "看 TypeScript"}</button></div>
      <pre><code><span className={styles.keyword}>function</span> add(a{showTypes && <span className={styles.typeAnnotation}>: number</span>}, b{showTypes && <span className={styles.typeAnnotation}>: number</span>}) &#123;{"\n"}  <span className={styles.keyword}>return</span> a + b;{"\n"}&#125;{"\n\n"}add(<span key={String(isText)} className={styles.argument} data-error={showTypes && isText}>{isText ? '"2"' : "2"}</span>, 3);</code></pre>
      {showTypes && <div className={styles.diagnostic} role="status" data-error={isText}>{isText ? <><Warning size={18} /><span>第一个参数要求 number，这里传入了 string。</span></> : <><Check size={18} /><span>两个参数都是 number，类型检查通过。</span></>}</div>}
    </div>
    <div className={styles.runStrip}><button type="button" onClick={run}><Play size={16} weight="fill" />运行这段 JavaScript</button><output aria-live="polite"><span>返回值</span><strong key={`${isText}-${result}`}>{result ?? "—"}</strong></output></div>
    <figcaption>这是限定示例的类型检查演示。运行按钮执行对应的 JavaScript 加法；它不会把文字自动改成数字。</figcaption>
  </figure>;
}

export function RuntimeValidationLab() {
  const [isText, setIsText] = useState(true);
  const [checksValue, setChecksValue] = useState(false);
  const [outcome, setOutcome] = useState<{ rejected: boolean; result: string } | null>(null);
  const json = isText ? '"2"' : "2";
  function run() {
    const quantity: unknown = JSON.parse(json);
    if (checksValue) {
      if (typeof quantity !== "number") {
        setOutcome({ rejected: true, result: "拒绝：收到的是 string" });
        return;
      }
      setOutcome({ rejected: false, result: JSON.stringify(quantity + 3) });
    } else {
      const count = quantity as number;
      setOutcome({ rejected: false, result: JSON.stringify(count + 3) });
    }
  }
  return <figure className={styles.lab} aria-label="类型断言与运行时校验实验">
    <div className={styles.controls} role="group" aria-label="选择接口返回的 JSON 值"><span>接口返回</span><button type="button" aria-pressed={!isText} onClick={() => { setIsText(false); setOutcome(null); }}>2</button><button type="button" aria-pressed={isText} onClick={() => { setIsText(true); setOutcome(null); }}>"2"</button></div>
    <div className={styles.boundaryBoard}>
      <div className={styles.specimen}><span>当前值</span><code key={json}>{json}</code><span>实际类型：<b>{isText ? "string" : "number"}</b></span><div className={styles.typeSticker} data-check={checksValue}>{checksValue ? "检查 typeof" : "贴上 as number"}</div></div>
      <div className={styles.boundaryCode}><div className={styles.controls} role="group" aria-label="选择数据处理方式"><button type="button" aria-pressed={!checksValue} onClick={() => { setChecksValue(false); setOutcome(null); }}>只做类型断言</button><button type="button" aria-pressed={checksValue} onClick={() => { setChecksValue(true); setOutcome(null); }}>真正检查值</button></div><pre><code>{checksValue ? 'if (typeof quantity !== "number") {\n  throw new Error("需要数字");\n}\nquantity + 3;' : 'const count = quantity as number;\ncount + 3;'}</code></pre></div>
    </div>
    <div className={styles.runStrip}><button type="button" onClick={run}><Play size={16} weight="fill" />处理当前数据</button><output aria-live="polite" data-rejected={outcome?.rejected}><span>{outcome?.rejected ? "校验结果" : "计算结果"}</span><strong key={`${json}-${checksValue}-${outcome?.result}`}>{outcome?.result ?? "—"}</strong></output></div>
    <figcaption><code>as number</code> 不改变值。商品数量是否为正整数，还需要单独检查。</figcaption>
  </figure>;
}
