"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, BracketsCurly, Check, FileCode, X } from "@phosphor-icons/react";
import { reservationSchema, validateReservation } from "@/lib/reservation-example";
import { Reveal, States } from "./ExtendedConceptLessons";
import base from "./EventConcepts.module.css";
import styles from "./AsyncConcepts.module.css";

const jsonExamples = [
  { name: "书目对象", text: '{\n  "title": "小岛上的灯塔",\n  "copies": 2,\n  "available": true\n}' },
  { name: "数量加上引号", text: '{"title":"小岛上的灯塔","copies":"2"}' },
  { name: "多一个尾逗号", text: '{"title":"小岛上的灯塔",}' },
  { name: "单独一个 null", text: 'null' },
];
function ValueTree({ value, name = "$", depth = 0 }: { value: unknown; name?: string; depth?: number }) {
  const type = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  const isContainer = value !== null && typeof value === "object";
  const entries = isContainer ? Object.entries(value) : [];
  return <div className={styles.treeNode}>
    <div className={styles.treeValue}><code>{name}</code><span>{type}</span>{!isContainer && <strong>{(typeof value === "number" ? String(value) : String(JSON.stringify(value))).slice(0,160)}</strong>}</div>
    {isContainer && (depth < 4 ? <div className={styles.treeChildren}>{entries.slice(0,12).map(([key, child]) => <ValueTree key={key} name={key} value={child} depth={depth + 1} />)}{entries.length > 12 && <p>还有 {entries.length - 12} 项，预览已省略</p>}{entries.length === 0 && <p>{type === "array" ? "空数组" : "空对象"}</p>}</div> : <p>更深层内容已省略</p>)}
  </div>;
}
export function JsonLesson() {
  const [text, setText] = useState(jsonExamples[0].text);
  const [phase, setPhase] = useState<"idle" | "parsed" | "error">("idle");
  const [value, setValue] = useState<unknown>(null);
  const [error, setError] = useState("");
  const edit = (next: string) => { setText(next); setPhase("idle"); };
  const parse = () => {
    try { setValue(JSON.parse(text)); setPhase("parsed"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "无效 JSON"); setPhase("error"); }
  };
  return <div className={`${base.lab} ${styles.jsonLab}`} aria-label="JSON 文本解析实验">
    <div className={styles.examples} role="group" aria-label="载入 JSON 示例">{jsonExamples.map(example => <button key={example.name} onClick={() => edit(example.text)}>{example.name}</button>)}</div>
    <div className={styles.parseDesk}>
      <div><label className={styles.fieldTitle} htmlFor="json-input"><FileCode size={22} />收到的文本</label><textarea id="json-input" spellCheck={false} maxLength={4000} value={text} onChange={e => edit(e.target.value)} /><button onClick={parse}>解析文本<ArrowRight size={18} /></button></div>
      <div className={styles.parsedValue} aria-live="polite"><h3><BracketsCurly size={22} />程序中的值</h3><States index={phase === "parsed" ? 1 : phase === "error" ? 2 : 0}>{[
        <p key="idle" className={styles.empty}>等待解析当前文本</p>,
        <ValueTree key="value" value={value} />,
        <div key="error" className={styles.failure}><p>语法未通过</p><code>{error}</code></div>,
      ]}</States></div>
    </div>
  </div>;
}

export function SchemaLesson() {
  const [status, setStatus] = useState("done");
  const [count, setCount] = useState("-1");
  const [asString, setAsString] = useState(false);
  const [missing, setMissing] = useState(false);
  const [extra, setExtra] = useState(false);
  const [checked, setChecked] = useState(false);
  const [issues, setIssues] = useState<ReturnType<typeof validateReservation>>([]);
  const [showSchema, setShowSchema] = useState(false);
  const candidate = { status, ...(!missing ? { count: asString ? count : count.trim() === "" ? null : Number(count) } : {}), ...(extra ? { debug: true } : {}) };
  const check = () => { setIssues(validateReservation(candidate)); setChecked(true); };
  return <div className={`${base.lab} ${styles.schemaLab}`} aria-label="JSON Schema 字段校验实验">
    <div className={styles.schemaWorkbench}>
      <div className={styles.ruleSheet}><h3>这份数据的约定</h3><dl><div><dt>status</dt><dd>pending / success</dd></div><div><dt>count</dt><dd>不小于 0 的整数</dd></div><div><dt>字段</dt><dd>两项都必填，不接收额外项</dd></div></dl><button className={base.reset} aria-expanded={showSchema} aria-controls="schema-source" onClick={() => setShowSchema(!showSchema)}>查看 Schema <ArrowDown className={styles.disclosure} data-open={showSchema} size={16} /></button><div id="schema-source"><Reveal open={showSchema}><pre className={base.code}>{JSON.stringify(reservationSchema, null, 2)}</pre></Reveal></div></div>
      <div className={styles.candidate}><h3>待检查的数据</h3><label>status<select value={status} onChange={e => { setStatus(e.target.value); setChecked(false); }}><option value="done">done</option><option value="pending">pending</option><option value="success">success</option></select></label><label>count<input type="number" min="-10" max="100" step="0.5" value={count} disabled={missing} onChange={e => { setCount(e.target.value); setChecked(false); }} /></label><label className={base.option}><input type="checkbox" checked={asString} onChange={e => { setAsString(e.target.checked); setChecked(false); }} />把数量写成字符串</label><label className={base.option}><input type="checkbox" checked={missing} onChange={e => { setMissing(e.target.checked); setChecked(false); }} />去掉 count 字段</label><label className={base.option}><input type="checkbox" checked={extra} onChange={e => { setExtra(e.target.checked); setChecked(false); }} />多带一个 debug 字段</label><pre className={styles.candidateJson}>{JSON.stringify(candidate, null, 2)}</pre></div>
    </div>
    <button onClick={check}>校验当前数据 <ArrowRight size={18} /></button>
    <div className={styles.validationResult} aria-live="polite"><States index={!checked ? 0 : issues.length ? 1 : 2}>{[
      <p key="waiting" className={styles.empty}>当前数据尚未校验</p>,
      <ul key="errors" className={styles.issueList}>{issues.map(issue => <li key={`${issue.field}-${issue.rule}`}><X size={18} /><div><strong>/{issue.field}</strong><code>{issue.rule}</code><p>{issue.message}</p></div></li>)}</ul>,
      <div key="passed" className={styles.validStamp}><Check size={25} /><strong>符合这份 Schema</strong></div>,
    ]}</States></div>
  </div>;
}
