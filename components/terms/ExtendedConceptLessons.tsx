"use client";

import { useState, type ReactNode } from "react";
import { Archive, ArrowCounterClockwise, ArrowDown, ArrowRight, Check, FileText, Globe, LockSimple, PlugsConnected, Terminal, Trash, Play, Pause } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import styles from "./ExtendedConcepts.module.css";

export function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  return <div className={styles.reveal} data-open={open} aria-hidden={!open} inert={!open}><div>{children}</div></div>;
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
      <div className={styles.sessionPaper}><div className={styles.objectTitle}><FileText size={21} /><h3>会话 {session}</h3></div><p>继续修复服务</p><States index={session === 1 ? 0 : recalled ? 2 : 1}>{[<p key="current" className={styles.noteText}>{progressNote}</p>,<p key="empty" className={styles.empty}>这次还没有上次的进度。</p>,<p key="recall" className={styles.noteText}>{progressNote}</p>]}</States></div>
      <div className={styles.archiveShelf} data-saved={saved}><Archive size={32} weight="light" /><h3>外部记录</h3><div className={styles.storedNote} data-saved={saved} aria-hidden={!saved}><FileText size={21} /><strong>服务修复进度</strong><span>app.py · 待检查 /health</span></div><p className={styles.archiveEmpty} data-hidden={saved}>尚未保存</p></div>
    </div>
    <div className={styles.actions}>
      <button disabled={saved || session !== 1} onClick={() => setSaved(true)}><Archive size={18} />保存进度</button>
      <button onClick={() => { setSession(n => n + 1); setRecalled(false); }}>新会话<ArrowRight size={18} /></button>
      <button disabled={!saved || session === 1 || recalled} onClick={() => setRecalled(true)}><ArrowDown size={18} />取回进度</button>
      <button disabled={!saved} aria-label="删除保存的进度" onClick={() => { setSaved(false); setRecalled(false); }}><Trash size={18} /></button>
      <button aria-label="重置记忆演示" onClick={reset}><ArrowCounterClockwise size={18} /></button>
    </div>
    <p className={styles.status} role="status">{recalled ? "已把保存的进度加入这次输入。" : session > 1 ? saved ? "记录还在外部，新会话需要重新读取。" : "没有可取回的记录，可以重置后先保存。" : saved ? "进度已保存，试着开始一次新会话。" : "先保存这次进度，再切换会话。"}</p>
  </div>;
}

export function WindowLesson() {
  const [history, setHistory] = useState(40);
  const [output, setOutput] = useState(20);
  const [compressed, setCompressed] = useState(false);
  const usedHistory = compressed ? Math.ceil(history / 4) : history;
  const total = 20 + usedHistory + output;
  const segments = [{ name: "任务与工具", value: 20 }, { name: compressed ? "历史摘要" : "对话历史", value: usedHistory }, { name: "预留输出", value: output }];
  return <div className={`${styles.lab} ${styles.windowLab}`} aria-label="上下文容量演示">
    <div className={styles.budgetHeadline}><strong>{total}<span> / 100</span></strong><span role="status">{total > 100 ? `超出 ${total - 100} 格` : `剩余 ${100 - total} 格`}</span></div>
    <div className={styles.ruler} aria-label={`容量100格，已分配${total}格`}><div className={styles.capacityBoundary} /><div className={styles.capacityTrack}>{segments.map((part, i) => <div key={i} style={{ width: `${part.value / 1.3}%` }}><span>{part.value}</span></div>)}</div><span className={styles.limitMark}>100</span></div>
    <div className={styles.legend}>{segments.map((part, i) => <span key={i}><i data-color={i} />{part.name}</span>)}</div>
    <div className={styles.budgetControls}><label>对话历史 <output>{history} 格</output><input aria-label="对话历史容量" type="range" min="20" max="70" step="5" value={history} onChange={e => setHistory(Number(e.target.value))} /></label><label>预留输出 <output>{output} 格</output><input aria-label="预留输出容量" type="range" min="10" max="40" step="5" value={output} onChange={e => setOutput(Number(e.target.value))} /></label></div>
    <button className={styles.textButton} aria-pressed={compressed} onClick={() => setCompressed(!compressed)}><FileText size={18} />{compressed ? "恢复完整历史" : "把历史整理成摘要"}<ArrowRight size={18} /></button>
    <Reveal open={compressed}><p className={styles.compactNote}>保留：已补冒号、/health 返回 500、尚未验收。原始日志仍留在外部。</p></Reveal>
  </div>;
}

const promptClauses = [
  { name: "提供材料", text: "启动日志：app.py 第 1 行，SyntaxError: expected ':'。" },
  { name: "说明结果", text: "请按「位置、修改、验证」三项回答。" },
  { name: "限定范围", text: "只分析日志；缺少代码时说明需要补充什么，不声称已经修复。" },
];
export function PromptLesson() {
  const [clauses, setClauses] = useState([false, false, false]);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(0);
  const [answerScoped, setAnswerScoped] = useState(false);
  const run = () => { setAnswer((clauses[0] ? 1 : 0) + (clauses[1] ? 2 : 0)); setAnswerScoped(clauses[2]); setOpen(true); };
  const replies = ["还缺少启动日志或错误信息，暂时无法定位原因。请提供这次运行的报错。", "日志指向 app.py 第 1 行缺少冒号。需要查看对应代码，再修改并重新运行检查；这里尚未实际修复。", "位置：信息不足。\n修改：请先提供启动日志。\n验证：拿到错误信息后再确定检查方法。", "位置：app.py 第 1 行，日志提示缺少冒号。\n修改：查看该行代码，确认并补上缺少的冒号。\n验证：重新启动，再检查 /health；目前尚未执行。"];
  return <div className={`${styles.lab} ${styles.promptLab}`} aria-label="提示词改写演示">
    <div className={styles.promptDraft}><span className={styles.draftLabel}>任务稿</span><p className={styles.requestTitle}>帮我分析服务为什么启动失败。</p>{promptClauses.map((clause, i) => <Reveal key={clause.name} open={clauses[i]}><p className={styles.clause}>{clause.text}</p></Reveal>)}</div>
    <div className={styles.promptEdits}>{promptClauses.map((clause, i) => <button key={clause.name} aria-pressed={clauses[i]} onClick={() => { setClauses(values => values.map((value, j) => i === j ? !value : value)); setOpen(false); }}><span>{clauses[i] ? <Check size={16} /> : `0${i + 1}`}</span>{clause.name}</button>)}<button className={styles.runPrompt} disabled={open} onClick={run}>查看回答样例<ArrowRight size={20} /></button></div>
    <div className={styles.promptReply}><Reveal open={open}><div role="status"><span>回答样例</span><p>{replies[answer]}{answerScoped ? answer % 2 === 1 ? "\n依据仅为这段日志，下一步需要报错行附近的代码。" : "\n目前没有提供日志，不能声称已经定位或修复。" : ""}</p></div></Reveal></div>
  </div>;
}

const mcpLabels = ["连接日志服务器", "发现工具", "调用 read_log", "接收工具结果", "重新开始"];
export function McpLesson() {
  const scene = useScene(5);
  return <div ref={scene.ref} className={`${styles.lab} ${styles.mcpLab}`} aria-label="MCP 连接演示">
    <div className={styles.connectionBoard} data-connected={scene.step > 0}><div className={styles.host}><Terminal size={29} weight="light" /><h3>AI 应用</h3><span>MCP 客户端</span></div><div className={styles.socket}><PlugsConnected size={34} weight="light" /><i /></div><div className={styles.server}><Archive size={29} weight="light" /><h3>日志服务器</h3><span>提供 read_log</span></div></div>
    <div className={styles.protocolDesk}><div className={styles.toolRegistry}><span>应用已发现的工具</span><Reveal open={scene.step >= 2}><div className={styles.discoveredTool}><FileText size={20} /><code>read_log(path)</code></div></Reveal><Reveal open={scene.step < 2}><p>还没有工具定义</p></Reveal></div><div className={styles.protocolMessage} aria-live="polite"><States index={scene.step}>{[<p key="0">等待连接</p>,<p key="1">连接可用。下一步向服务器查询工具。</p>,<div key="2"><code>tools/list</code><p>收到 read_log 的用途与参数定义。</p></div>,<div key="3"><code>tools/call</code><pre>{'{ name: "read_log",\n  arguments: { path: "server.log" } }'}</pre><p>请求已发送，等待结果。</p></div>,<div key="4"><code>工具返回</code><pre>app.py:1 — SyntaxError: expected &apos;:&apos;</pre></div>]}</States></div></div>
    <div className={styles.actions}><button onClick={() => scene.seek((scene.step + 1) % 5)}>{mcpLabels[scene.step]}<ArrowRight size={18} /></button><button aria-label={scene.playing ? "暂停 MCP 演示" : "自动播放 MCP 演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={19} /> : <Play size={19} />}</button><button disabled={scene.step === 0} onClick={() => scene.seek(0)}>断开</button></div>
  </div>;
}

const operations = [
  { name: "修改工作区文件", target: "/workspace/app.py", icon: FileText, result: "允许写入工作区，文件修改完成。" },
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
  return <div ref={scene.ref} className={`${styles.lab} ${styles.sandboxLab}`} aria-label="沙箱边界演示">
    <div className={styles.operationChoices}>{operations.map((op, i) => <button key={op.name} aria-pressed={operation === i} onClick={() => { setOperation(i); scene.seek(0); }}>{op.name}</button>)}</div>
    <div className={styles.sandboxStage} data-step={scene.step} data-allowed={allowed} data-internal={operation === 0}>
      <div className={styles.workspace}><Terminal size={28} weight="light" /><strong>执行沙箱</strong><span>/workspace 可读写</span></div>
      <div className={styles.gate}><LockSimple size={24} /><span>访问边界</span></div>
      <div className={styles.operationObject}><Icon size={25} /><code>{current.target}</code></div>
      <span className={styles.hostLabel}>外部环境</span>
    </div>
    <label className={styles.networkSwitch}><input type="checkbox" checked={network} onChange={e => { setNetwork(e.target.checked); scene.seek(0); }} />允许访问 docs.example.com</label>
    <div className={styles.actions}><button onClick={() => scene.seek((scene.step + 1) % 3)}>{["执行这次操作", "查看执行结果", "重置操作"][scene.step]}<ArrowRight size={18} /></button></div>
    <div className={styles.sandboxResult} aria-live="polite"><States index={scene.step}>{[<p key="0">选择操作，看看它会在哪一侧执行。</p>,<p key="1">{allowed ? "请求在许可范围内，正在执行。" : "请求到达边界，正在检查访问范围。"}</p>,<p key="2"><strong>{allowed ? "已执行" : "已阻止"}</strong>{operation === 2 && !network ? "网络未开放，没有发出这次请求。" : current.result}</p>]}</States></div>
  </div>;
}
