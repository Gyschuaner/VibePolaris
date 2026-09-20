"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, ArrowsClockwise, CalendarBlank, Check, EnvelopeSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { Reveal, States } from "./ExtendedConceptLessons";
import styles from "./FoundationConcepts.module.css";

// A deliberately small, authored vocabulary. These are not model probabilities.
const continuations = [
  { text: "", choices: [{ text: " blue", probability: 65, next: 1 }, { text: " gray", probability: 35, next: 2 }] },
  { text: " blue", choices: [{ text: ".", probability: 80, next: 5 }, { text: " today", probability: 20, next: 3 }] },
  { text: " gray", choices: [{ text: ".", probability: 60, next: 6 }, { text: " today", probability: 40, next: 4 }] },
  { text: " blue today", choices: [{ text: ".", probability: 100, next: 7 }] },
  { text: " gray today", choices: [{ text: ".", probability: 100, next: 8 }] },
  { text: " blue.", choices: [] }, { text: " gray.", choices: [] },
  { text: " blue today.", choices: [] }, { text: " gray today.", choices: [] },
];

export function LlmLesson() {
  const [history, setHistory] = useState([0]);
  const current = history[history.length - 1];
  return <div className={`${styles.lab} ${styles.generation}`} role="region" aria-label="候选续写演示">
    <div className={styles.sentence} aria-live="polite"><States index={current}>{continuations.map((node, i) => <p key={i}>The sky is<strong>{node.text}</strong><span className={styles.caret} aria-hidden="true" /></p>)}</States></div>
    <div className={styles.candidateDesk}>
      <span className={styles.deskLabel}>{current < 5 ? "选择接下来的片段" : "这个样例在句号处停止"}</span>
      <States index={current}>{continuations.map((node, i) => <div className={styles.candidates} key={i}>{node.choices.length ? node.choices.map(choice => <button key={choice.text} onClick={() => setHistory(value => [...value, choice.next])} aria-label={`选择 ${choice.text.trim()}，示例概率 ${choice.probability}%`}><i style={{ width: `${choice.probability}%` }} /><code>{choice.text.trim()}</code><span>{choice.probability}%</span><ArrowRight size={17} /></button>) : <p className={styles.finished}><Check size={23} />生成的片段已成为前文的一部分。</p>}</div>)}</States>
    </div>
    <div className={styles.actions}><button disabled={history.length === 1} onClick={() => setHistory(value => value.slice(0, -1))}><ArrowLeft size={18} />撤回一步</button><button disabled={history.length === 1} onClick={() => setHistory([0])}><ArrowCounterClockwise size={18} />重新选择</button></div>
  </div>;
}

const sampleWords = ["lower", "lowest"];
const characterVocabulary = ["l", "o", "w", "e", "r", "s", "t"];
const subwordVocabulary = ["low", "er", "est"];

export function TokenLesson() {
  const [sample, setSample] = useState(0);
  const [subwords, setSubwords] = useState(true);
  const [ids, setIds] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const word = sampleWords[sample];
  const vocabulary = subwords ? subwordVocabulary : characterVocabulary;
  const tokens = subwords ? ["low", sample === 0 ? "er" : "est"] : [...word];
  const numbers = tokens.map(token => vocabulary.indexOf(token) + 1);
  const resetResult = () => { setIds(false); setDecoded(false); };
  return <div className={`${styles.lab} ${styles.typeDesk}`} role="region" aria-label="文本与编号演示">
    <div className={styles.sampleControls}><div className={styles.choices} aria-label="示例单词">{sampleWords.map((text, i) => <button key={text} aria-pressed={sample === i} onClick={() => { setSample(i); resetResult(); }}>{text}</button>)}</div><div className={styles.choices} aria-label="教学词表"><button aria-pressed={!subwords} onClick={() => { setSubwords(false); resetResult(); }}>按字符</button><button aria-pressed={subwords} onClick={() => { setSubwords(true); resetResult(); }}>按子词</button></div></div>
    <div className={styles.tokenRows} data-ids={ids}>
      <States index={sample * 2 + Number(subwords)}>{sampleWords.flatMap((text, s) => [false, true].map(useSubwords => {
        const dict = useSubwords ? subwordVocabulary : characterVocabulary;
        const pieces = useSubwords ? ["low", s === 0 ? "er" : "est"] : [...text];
        return <div className={styles.tokenStrip} key={`${s}-${useSubwords}`}>{pieces.map((piece, i) => <div className={styles.tokenTile} key={i}><span aria-hidden={ids}>{piece}</span><code aria-hidden={!ids}>{dict.indexOf(piece) + 1}</code></div>)}</div>;
      }))}</States>
    </div>
    <div className={styles.tokenMeta}><strong>{tokens.length}<span> 个 Token</span></strong><button onClick={() => { setIds(value => !value); setDecoded(false); }}><ArrowsClockwise size={18} />{ids ? "查看片段" : "查看编号"}</button></div>
    <dl className={styles.vocabulary} aria-label="当前教学词表">{vocabulary.map((text, i) => <div key={text}><dt>{text}</dt><dd>{i + 1}</dd></div>)}</dl>
    <div className={styles.actions}><button onClick={() => { setIds(true); setDecoded(value => !value); }} aria-expanded={decoded} aria-controls="token-decoded">{decoded ? "收起还原结果" : "按编号还原"}<ArrowRight size={18} /></button></div>
    <Reveal open={decoded}><p id="token-decoded" className={styles.decoded}><code>[{numbers.join(", ")}]</code><ArrowRight size={22} /><strong>{numbers.map(id => vocabulary[id - 1]).join("")}</strong></p></Reveal>
  </div>;
}

const meetingSlots = ["09:00", "09:30", "10:00", "10:30"];
const busyA = [true, false, false, true];
const busyB = [false, true, false, false];

export function AgentLesson() {
  const [conflict, setConflict] = useState(false);
  const [step, setStep] = useState(0);
  const labels = ["读取两人的日历", "根据空档决定下一步", conflict ? "询问其他时间" : "准备邀请草稿", "演示已停止"];
  return <div className={`${styles.lab} ${styles.agenda}`} role="region" aria-label="智能体安排会议演示">
    <div className={styles.goal}><CalendarBlank size={27} weight="light" /><p>找 30 分钟共同空档，<strong>只准备邀请。</strong></p></div>
    <div className={styles.choices}><button aria-pressed={!conflict} onClick={() => { setConflict(false); setStep(0); }}>有共同空档</button><button aria-pressed={conflict} onClick={() => { setConflict(true); setStep(0); }}>没有共同空档</button></div>
    <div className={styles.calendar} data-read={step > 0}>
      <div className={styles.hours} aria-hidden="true"><span />{meetingSlots.map(slot => <span key={slot}>{slot}</span>)}</div>
      {[busyA, busyB].map((busy, person) => <div className={styles.calendarRow} key={person}><strong>{person === 0 ? "小林" : "小周"}</strong>{busy.map((occupied, i) => {
        const taken = occupied || (person === 1 && conflict && i === 2);
        return <div key={i} role="img" data-busy={taken} data-selected={step >= 2 && !conflict && i === 2} aria-label={`${person === 0 ? "小林" : "小周"} ${meetingSlots[i]}：${step === 0 ? "尚未读取" : taken ? "忙碌" : "空闲"}`}><span className={styles.unknown} aria-hidden="true">?</span><span className={styles.availability} aria-hidden="true">{taken ? "忙碌" : "空闲"}</span></div>;
      })}</div>)}
    </div>
    <div className={styles.decision} aria-live="polite"><States index={step}>{[
      <p key="0"><MagnifyingGlass size={21} />还没有日历结果。</p>,
      <p key="1"><Check size={21} />已读回两人的日历，可以核对共同空档。</p>,
      <p key="2">{conflict ? "没有共同空档，下一步需要用户提供其他时间。" : "10:00–10:30 两人都空闲，可以准备草稿。"}</p>,
      <div key="3" className={styles.invitation} data-blocked={conflict}><EnvelopeSimple size={27} /><div><h3>{conflict ? "等待补充" : "邀请草稿"}</h3><p>{conflict ? "这段时间没有共同空档，可以换到下午吗？" : "小林、小周 · 项目讨论 · 10:00–10:30"}</p><strong>{conflict ? "任务未完成 · 已停止" : "草稿已准备 · 未发送"}</strong></div></div>,
    ]}</States></div>
    <div className={styles.actions}><button disabled={step === 3} onClick={() => setStep(value => Math.min(3, value + 1))}>{labels[step]}<ArrowRight size={18} /></button><button disabled={step === 0} onClick={() => setStep(0)} aria-label="重置会议演示"><ArrowCounterClockwise size={18} /></button></div>
  </div>;
}

export function ProbabilityHeroArt() {
  return <div className={styles.probabilityHero}><p>The sky is <strong>blue.</strong></p>{[["blue", 65], ["gray", 35]].map(([word, probability]) => <div key={word} style={{ "--probability": `${probability}%` } as CSSProperties}><span>{word}</span><i /><code>{probability}%</code></div>)}</div>;
}
