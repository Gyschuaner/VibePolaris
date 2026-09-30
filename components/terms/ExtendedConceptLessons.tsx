"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Archive, ArrowCounterClockwise, ArrowDown, ArrowRight, Check, FileText, Globe, LockSimple, LockSimpleOpen, Terminal, Trash } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import styles from "./ExtendedConcepts.module.css";

export function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  const lastVisible = useRef(children);
  useLayoutEffect(() => {
    if (open) lastVisible.current = children;
  }, [open, children]);
  return <div className={styles.reveal} data-open={open} aria-hidden={!open} inert={!open}><div>{open ? children : lastVisible.current}</div></div>;
}
export function States({ index, children }: { index: number; children: ReactNode[] }) {
  return <div className={styles.states}>{children.map((child, i) => <div key={i} data-current={i === index} aria-hidden={i !== index} inert={i !== index}>{child}</div>)}</div>;
}
const progressNote = "已补上 app.py 的冒号。/health 仍返回 500，下一步检查返回值。";

export function MemoryLesson() {
  const [saved, setSaved] = useState(false);
  const [session, setSession] = useState(1);
  const [recalled, setRecalled] = useState(false);
  const reset = () => { setSaved(false); setSession(1); setRecalled(false); };
  return <div className={`${styles.lab} ${styles.memoryLab}`} aria-label="记忆存取演示">
    <div className={styles.memoryDesk}>
      <div className={styles.sessionPaper} data-recalled={recalled}><div className={styles.objectTitle}><FileText size={21} /><h3>会话 {session}</h3></div><p>继续修复服务</p><States index={session === 1 ? 0 : recalled ? 2 : 1}>{[<p key="current" className={styles.noteText}>{progressNote}</p>,<p key="empty" className={styles.empty}>这次还没有上次的进度。</p>,<p key="recall" className={styles.noteText}>{progressNote}</p>]}</States></div>
      <div className={styles.archiveShelf}>
        <div className={styles.archiveHeading}><Archive size={25} weight="light" /><h3>项目记录</h3></div>
        <div className={styles.archiveOther}><span>首页配色</span><strong>淡紫</strong></div>
        <div className={styles.archiveSlot}>
          <p className={styles.archiveEmpty} data-hidden={saved} aria-hidden={saved}>服务修复 · 尚未保存</p>
          <div className={styles.storedNote} data-saved={saved} data-selected={recalled} aria-hidden={!saved} inert={!saved}><strong>服务修复</strong><span>冒号已补 · /health 仍返回 500</span></div>
        </div>
      </div>
    </div>
    <div className={styles.actions}>
      <button disabled={saved || session !== 1} onClick={() => setSaved(true)}><Archive size={18} />保存进度</button>
      <button onClick={() => { setSession(n => n + 1); setRecalled(false); }}>新会话<ArrowRight size={18} /></button>
      <button disabled={!saved || session === 1 || recalled} onClick={() => setRecalled(true)}><ArrowDown size={18} />让应用取回</button>
      <button disabled={!saved} aria-label="删除保存的进度" onClick={() => { setSaved(false); setRecalled(false); }}><Trash size={18} /></button>
      <button aria-label="重置记忆演示" onClick={reset}><ArrowCounterClockwise size={18} /></button>
    </div>
    <p className={styles.status} role="status">{recalled ? "应用选出服务修复记录，加入本轮输入。" : session > 1 ? saved ? "记录仍在外部，本轮尚未读取。" : "本任务没有保存的记录。" : saved ? "已保存本任务进度，当前会话的内容仍在。" : "保存本任务进度，再切换会话。"}</p>
  </div>;
}

export function WindowLesson() {
  const [history, setHistory] = useState(40);
  const [output, setOutput] = useState(20);
  const [compressed, setCompressed] = useState(false);
  const [sampled, setSampled] = useState(false);
  const usedHistory = compressed ? Math.ceil(history / 4) : history;
  const total = 20 + usedHistory + output;
  const over = Math.max(0, total - 100);
  const sampleOutput = Math.min(12, output);
  const segments = [{ name: "任务与工具", value: 20 }, { name: compressed ? "历史摘要" : "对话历史", value: usedHistory }, { name: "预留输出", value: output }];
  return <div className={`${styles.lab} ${styles.windowLab}`} aria-label="上下文容量演示">
    <div className={styles.budgetHeadline}><strong>{total}<span> / 100</span></strong><span role="status">{over ? sampled ? `超出 ${over} 格，样例占用未显示` : `超出 ${over} 格，先调低历史或输出预留` : sampled ? sampleOutput < 12 ? `样例需 12 格，只预留了 ${output} 格` : `样例用了 12 格，预留仍有 ${output - 12} 格未用` : `剩余 ${100 - total} 格`}</span></div>
    <div className={styles.ruler} aria-label={`容量100格，已安排${total}格${over ? `，超出${over}格` : ""}`}><div className={styles.capacityBoundary} /><div className={styles.capacityTrack}>{segments.map((part, i) => <div key={i} style={{ width: `${part.value / 1.3}%` }}>{i === 2 && <i className={styles.outputFill} style={{ width: sampled && !over ? `${sampleOutput / output * 100}%` : "0%" }} aria-hidden="true" />}<span>{part.value}</span></div>)}</div><div className={styles.capacityOverrun} data-visible={over > 0} style={{ width: `${over / 1.3}%` }} /><span className={styles.limitMark}>100</span></div>
    <div className={styles.legend}>{segments.map((part, i) => <span key={i}><i data-color={i} />{part.name}</span>)}</div>
    <div className={styles.budgetControls}><label>对话历史 <output>{history} 格</output><input aria-label="对话历史容量" type="range" min="20" max="70" step="5" value={history} onChange={e => { setHistory(Number(e.target.value)); setSampled(false); }} /></label><label>预留输出 <output>{output} 格</output><input aria-label="预留输出容量" type="range" min="10" max="40" step="5" value={output} onChange={e => { setOutput(Number(e.target.value)); setSampled(false); }} /></label></div>
    <div className={styles.windowActions}><button className={styles.textButton} aria-pressed={compressed} onClick={() => { setCompressed(!compressed); setSampled(false); }}><FileText size={18} />{compressed ? "恢复完整历史" : "把历史整理成摘要"}<ArrowRight size={18} /></button><button className={styles.textButton} onClick={() => setSampled(true)}>查看样例占用<ArrowRight size={18} /></button></div>
    <Reveal open={compressed}><p className={styles.compactNote}>摘要只留下：已补冒号，服务能启动。/health 仍返回 500；下一步检查返回值。原始日志的细节不在这轮摘要里，仍可从外部查回。</p></Reveal>
  </div>;
}

const promptClauses = [
  { name: "提供材料", text: "启动日志：app.py:1 · SyntaxError: expected ':'" },
  { name: "说明结果", text: "按「位置、修改、验证」三项回答。" },
  { name: "限定范围", text: "只分析日志；没读代码或运行检查就说明。" },
];
export function PromptLesson() {
  const [clauses, setClauses] = useState([false, false, false]);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(0);
  const [answerScoped, setAnswerScoped] = useState(false);
  const run = () => { setAnswer((clauses[0] ? 1 : 0) + (clauses[1] ? 2 : 0)); setAnswerScoped(clauses[2]); setOpen(true); };
  const hasMaterial = answer % 2 === 1;
  const hasFormat = answer >= 2;
  return <div className={`${styles.lab} ${styles.promptLab}`} aria-label="提示词改写演示">
    <div className={styles.promptDraft}><span className={styles.draftLabel}>任务稿</span><p className={styles.requestTitle}>帮我分析服务为什么启动失败。</p>{promptClauses.map((clause, i) => <Reveal key={clause.name} open={clauses[i]}><p className={styles.clause}>{clause.text}</p></Reveal>)}</div>
    <div className={styles.promptEdits}>{promptClauses.map((clause, i) => <button key={clause.name} aria-pressed={clauses[i]} onClick={() => { setClauses(values => values.map((value, j) => i === j ? !value : value)); setOpen(false); }}><span>{clauses[i] ? <Check size={16} /> : `0${i + 1}`}</span>{clause.name}</button>)}<button className={styles.runPrompt} disabled={open} onClick={run}>查看这版样例<ArrowRight size={20} /></button></div>
    <div className={styles.promptReply}><Reveal open={open}><div className={styles.promptSample} role="status"><span className={styles.draftLabel}>固定回答样例</span>{hasFormat ? <dl><div><dt>位置</dt><dd>{hasMaterial ? "日志指向 app.py 第 1 行，提示缺少冒号。" : "未提供启动日志，暂时无法定位。"}</dd></div><div><dt>修改</dt><dd>{hasMaterial ? "查看该行代码，核对并补上缺少的冒号。" : "请先提供这次运行的报错。"}</dd></div><div><dt>验证</dt><dd>{hasMaterial ? "修改后重新启动，再检查服务能否正常响应；目前尚未执行。" : "拿到日志后再确定检查方法。"}</dd></div></dl> : <p>{hasMaterial ? "启动日志指向 app.py 第 1 行缺少冒号。先查看对应代码，再修改并运行检查；目前尚未执行。" : "还缺少启动日志或错误信息，暂时无法定位原因。请提供这次运行的报错。"}</p>}{answerScoped && <p className={styles.promptScopeNote}>{hasMaterial ? "只依据这段日志分析；没有读取代码或运行检查。" : "没有提供日志，不能声称已经定位或修复。"}</p>}</div></Reveal></div>
  </div>;
}

const operations = [
  { name: "读取工作区文件", target: "/workspace/app.py", icon: FileText, result: "允许读取工作区文件，已取得 app.py 的内容。" },
  { name: "读取外部密钥", target: "~/.ssh/id_rsa", icon: LockSimple, result: "拒绝访问：此路径不在允许读取的范围。" },
  { name: "访问文档站点", target: "docs.example.com", icon: Globe, result: "允许访问指定站点，收到文档内容。" },
];
export function SandboxLesson() {
  const scene = useScene(3);
  const [operation, setOperation] = useState(0);
  const [network, setNetwork] = useState(false);
  const current = operations[operation];
  const allowed = operation === 0 || (operation === 2 && network);
  const Icon = current.icon;
  const GateIcon = operation === 2 && network ? LockSimpleOpen : LockSimple;
  return <div ref={scene.ref} className={`${styles.lab} ${styles.sandboxLab}`} aria-label="沙箱边界演示">
    <div className={styles.operationChoices}>{operations.map((op, i) => <button key={op.name} aria-pressed={operation === i} onClick={() => { setOperation(i); scene.seek(0); }}>{op.name}</button>)}</div>
    <div className={styles.sandboxStage} data-step={scene.step} data-allowed={allowed} data-internal={operation === 0}>
      <div className={styles.workspace}><Terminal size={28} weight="light" /><strong>执行沙箱</strong><span>/workspace 可读写</span></div>
      <div className={styles.gate}><GateIcon size={24} /><span>访问边界</span></div>
      <div className={styles.operationObject}><Icon size={25} /><code>{current.target}</code></div>
      <span className={styles.hostLabel}>外部环境</span>
    </div>
    <label className={styles.networkSwitch}><input type="checkbox" checked={network} onChange={e => { setNetwork(e.target.checked); scene.seek(0); }} />允许访问 docs.example.com</label>
    <div className={styles.actions}><button onClick={() => scene.seek((scene.step + 1) % 3)}>{["执行这次操作", "查看执行结果", "重置操作"][scene.step]}<ArrowRight size={18} /></button></div>
    <div className={styles.sandboxResult} aria-live="polite"><States index={scene.step}>{[<p key="0">选择操作，看看它会在哪一侧执行。</p>,<p key="1">{allowed ? "请求在许可范围内，正在执行。" : "请求到达边界，正在检查访问范围。"}</p>,<p key="2"><strong>{allowed ? "已执行" : "已阻止"}</strong>{operation === 2 && !network ? "网络未开放，没有发出这次请求。" : current.result}</p>]}</States></div>
  </div>;
}
