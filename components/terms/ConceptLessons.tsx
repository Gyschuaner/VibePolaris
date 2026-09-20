"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Brain, Check, CheckCircle, Circuitry, FileText, LockSimple, Plus, WarningCircle, Wrench } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ConceptArticle.module.css";

function Layers({ current, children }: { current: number; children: ReactNode[] }) {
  return <div className={styles.layers} aria-live="polite">{children.map((child, index) => <div key={index} className={styles.layer} data-current={current === index} inert={current !== index} aria-hidden={current !== index}>{child}</div>)}</div>;
}

const toolResults = {
  success: { label: "读取成功", result: "app.py:1\nSyntaxError: expected ':'", answer: "日志指向 app.py 第一行：函数定义缺少冒号。接下来应查看这行代码。" },
  missing: { label: "文件不存在", result: "FileNotFound: server.log", answer: "没有读到日志。需要先确认文件路径，不能据此判断服务为什么失败。" },
  denied: { label: "未获授权", result: "PermissionDenied: read_file", answer: "读取没有获得授权，文件未被打开。请提供允许读取的日志内容。" },
};

export function ToolCallingLesson() {
  const [scenario, setScenario] = useState<keyof typeof toolResults>("success");
  const scene = useScene(6);
  const result = toolResults[scenario];
  const denied = scenario === "denied";
  const labels = ["收到任务", "生成工具请求", "校验与授权", denied ? "拦截请求" : "执行读取", "带回结果", "依据结果回复"];
  const active = scene.step === 0 || scene.step === 1 || scene.step === 5 ? 0 : scene.step === 3 && !denied ? 2 : 1;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="读取日志的工具调用演示">
    <div className={styles.choices} role="group" aria-label="选择读取结果">{Object.entries(toolResults).map(([key, value]) => <button type="button" key={key} aria-pressed={scenario === key} onClick={() => { setScenario(key as keyof typeof toolResults); scene.seek(0); }}>{value.label}</button>)}</div>
    <div className={styles.controlsWrap}><SceneControls scene={scene} labels={labels} /></div>
    <div className={styles.toolFlow} data-returning={scene.step >= 4}>
      {[[Brain, "模型", "提出请求"], [Circuitry, "Harness", "校验与调度"], [denied ? LockSimple : FileText, "文件工具", denied ? "未执行" : "读取文件"]].map(([Component, name, label], index) => {
        const Icon = Component as typeof Brain;
        return <div key={String(name)} className={styles.toolActor} data-active={active === index} data-blocked={denied && scene.step >= 3 && index === 2}><Icon size={38} weight="light" aria-hidden="true" /><strong>{String(name)}</strong><span>{String(label)}</span></div>;
      })}
      <span className={styles.flowLink} data-lit={scene.step > 0} aria-hidden="true" /><span className={styles.flowLink} data-lit={scene.step >= 3 && !denied} aria-hidden="true" />
    </div>
    <Layers current={scene.step}>{[
      <div key="task" className={styles.sceneText}><span className={styles.role}>用户</span><h3>帮我看看服务为什么启动失败。</h3><p>先找到错误信息，模型还没有读到文件。</p></div>,
      <div key="request" className={styles.sceneText}><span className={styles.role}>模型 → Harness</span><h3>请求读取日志</h3><pre>{'{ "name": "read_file",\n  "input": { "path": "server.log" } }'}</pre></div>,
      <div key="validate" className={styles.sceneText}><span className={styles.role}>Harness</span><h3>{denied ? "这次读取没有获得授权" : "工具和参数有效，允许读取"}</h3><p>read_file 已注册 · path 是文件路径{denied ? " · 读取被拒绝" : " · 读取已允许"}</p></div>,
      <div key="execute" className={styles.sceneText}><span className={styles.role}>{denied ? "Harness" : "文件工具"}</span><h3>{denied ? "请求停在执行之前" : "现在才打开 server.log"}</h3><pre>{denied ? "read_file 未执行" : 'read_file("server.log")'}</pre></div>,
      <div key="result" className={styles.sceneText}><span className={styles.role}>工具结果 → 下一轮输入</span><h3>{scenario === "success" ? "读到了实际报错" : "返回明确的失败原因"}</h3><pre>{result.result}</pre></div>,
      <div key="answer" className={styles.sceneText}><span className={styles.role}>模型</span><h3>{scenario === "success" ? "根据日志继续排查" : "说明缺口，等待补充"}</h3><p>{result.answer}</p></div>,
    ]}</Layers>
  </div>;
}

const materials = [
  { id: "log", label: "本次启动日志", detail: "app.py 第 1 行缺少冒号", text: "server.log：SyntaxError，app.py 第 1 行缺少冒号。", Icon: FileText },
  { id: "rule", label: "任务要求", detail: "修改后检查 /health", text: "修改后必须启动服务，检查 /health 是否返回 200。", Icon: CheckCircle },
  { id: "history", label: "上周的排错记录", detail: "当时是端口占用", text: "上周服务曾因端口 8000 被占用而启动失败。", Icon: Circuitry },
];

export function ContextLesson() {
  const [selected, setSelected] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState("");
  function toggle(id: string) {
    setSelected(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
    setAnswered(false);
  }
  function respond() {
    const has = (id: string) => selected.includes(id);
    setAnswer(has("log")
      ? `这次日志显示 app.py 第一行缺少冒号，先查看并修正这一行。${has("rule") ? "修改后启动服务，再检查 /health 是否返回 200。" : "修正后还需要检查服务能否正常启动。"}${has("history") ? "上周的端口问题不能代替这次日志里的错误。" : ""}`
      : `${has("history") ? "上周曾有端口占用，但还没有本次启动日志，不能确定这次也是同一个原因。" : "目前只有启动失败的描述，还不能确定原因。请提供本次启动日志。"}${has("rule") ? "我会保留修改后检查 /health 的要求。" : ""}`);
    setAnswered(true);
  }
  return <div className={`${styles.lab} ${styles.contextLab}`} role="region" aria-label="选择本轮上下文的演示">
    <div className={styles.contextColumns}>
      <div className={styles.materials}><h3>可以提供的资料</h3>{materials.map(({ id, label, detail, Icon }) => <button key={id} type="button" aria-pressed={selected.includes(id)} onClick={() => toggle(id)}><Icon size={24} weight="light" aria-hidden="true" /><span><strong>{label}</strong><span>{detail}</span></span>{selected.includes(id) ? <Check size={18} /> : <Plus size={18} />}</button>)}</div>
      <div className={styles.inputSheet}><span className={styles.sheetBack} aria-hidden="true" /><div className={styles.sheetContent}><div className={styles.sheetHeading}><Brain size={22} weight="light" /><h3>本轮输入</h3></div><p className={styles.fixedInput}>服务启动失败，帮我排查。</p>{materials.map(({ id, label, text }) => <div className={styles.insert} data-open={selected.includes(id)} inert={!selected.includes(id)} aria-hidden={!selected.includes(id)} key={id}><div><p><strong>{label}</strong>{text}</p></div></div>)}<button className={styles.answerButton} type="button" onClick={respond}>用这些资料回答<ArrowRight size={18} /></button></div></div>
    </div>
    <div className={styles.answerReveal} data-open={answered} inert={!answered} aria-hidden={!answered}><div><div className={styles.contextReply} role="status"><Brain size={26} weight="light" /><p>{answer}</p></div></div></div>
  </div>;
}

const repairRounds = [
  { decision: "先读启动日志", action: 'read_file("server.log")', result: "第 1 行缺少冒号", fact: "SyntaxError", next: "有了报错位置，下一轮查看并修改代码。" },
  { decision: "补上冒号，再检查服务", action: "edit_file → run_checks", result: "/health 返回 500", fact: "HTTP 500", next: "服务能启动了，接口仍然失败。根据新错误继续修正。" },
  { decision: "修正返回值，再检查", action: "edit_file → run_checks", result: "/health 返回 200", fact: "HTTP 200", next: "启动与健康检查都通过，可以返回结果。" },
];

export function AgentLoopLesson() {
  const [scenario, setScenario] = useState("repair");
  const [limit, setLimit] = useState(3);
  const length = limit * 3 + 1;
  const scene = useScene(length);
  const round = scene.step === 0 ? 0 : Math.floor((scene.step - 1) / 3) + 1;
  const phase = scene.step === 0 ? -1 : (scene.step - 1) % 3;
  const repeating = scenario === "repeat";
  const current = repairRounds[Math.max(0, round - 1)];
  const ended = scene.step === length - 1;
  const completed = ended && limit === 3 && !repeating;
  const status = completed ? "检查通过" : ended ? limit < 3 ? "达到轮数上限" : "连续没有进展" : round === 0 ? "等待开始" : `第 ${round} 轮`;
  const labels = ["任务与停止条件", ...Array.from({ length: limit }, (_, index) => ["判断", "执行", "观察"].map(label => `第 ${index + 1} 轮：${label}`)).flat()];
  const rounds = Array.from({ length: limit }, (_, index) => repeating ? { ...repairRounds[0], decision: index === 0 ? "读取启动日志" : "再次读取同一份日志", next: "仍然是同一个错误，没有新的证据或修改。" } : repairRounds[index]);
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="反馈驱动的智能体循环演示">
    <div className={styles.loopOptions}><div className={styles.choices} role="group" aria-label="选择循环场景"><button aria-pressed={!repeating} type="button" onClick={() => { setScenario("repair"); scene.seek(0); }}>逐轮修正</button><button aria-pressed={repeating} type="button" onClick={() => { setScenario("repeat"); scene.seek(0); }}>重复同一操作</button></div><label>最多进行<select value={limit} onChange={event => { setLimit(Number(event.target.value)); scene.seek(0); }} aria-label="循环轮数上限"><option value={1}>1 轮</option><option value={2}>2 轮</option><option value={3}>3 轮</option></select></label></div>
    <div className={styles.controlsWrap}><SceneControls scene={scene} labels={labels} /></div>
    <div className={styles.loopComposition}>
      <div className={styles.loopOrbit} data-ended={ended}>
        <svg viewBox="0 0 360 310" aria-hidden="true"><path d="M180 42 C315 42 350 205 270 245 C210 292 99 287 65 236 C-5 155 58 42 180 42" /><path className={styles.orbitProgress} style={{ strokeDashoffset: 760 - (scene.step / (length - 1)) * 760 }} d="M180 42 C315 42 350 205 270 245 C210 292 99 287 65 236 C-5 155 58 42 180 42" /></svg>
        {[[Brain, "判断"], [Wrench, "执行"], [FileText, "观察"]].map(([Component, label], index) => { const Icon = Component as typeof Brain; return <div key={String(label)} className={styles.orbitNode} data-active={phase === index && !ended}><Icon size={30} weight="light" /><span>{String(label)}</span></div>; })}
        <div className={styles.orbitCenter}>{ended ? completed ? <CheckCircle size={36} weight="light" /> : <WarningCircle size={36} weight="light" /> : <span className={styles.roundNumber}>{String(round).padStart(2, "0")}</span>}<strong>{status}</strong></div>
      </div>
      <div className={styles.loopState}><span className={styles.role}>任务目标</span><h3>服务能启动，/health 返回 200</h3><ol>{rounds.map((item, index) => <li key={index} data-seen={scene.step >= (index + 1) * 3}><span>{index + 1}</span><div><strong>{scene.step >= (index + 1) * 3 ? item.result : "等待这一轮结果"}</strong><code>{scene.step >= (index + 1) * 3 ? item.fact : "—"}</code></div>{scene.step >= (index + 1) * 3 && <Check size={16} />}</li>)}</ol></div>
    </div>
    <Layers current={scene.step}>{[<div className={styles.sceneText} key="start"><h3>从已有信息开始</h3><p>任务是修好服务。这一次最多进行 {limit} 轮，每轮都把执行结果带回。</p></div>, ...rounds.flatMap((item, index) => [
      <div className={styles.sceneText} key={`${index}-decide`}><span className={styles.role}>模型 · 判断</span><h3>{item.decision}</h3><p>{index === 0 ? "目前只有失败描述，先取得实际错误。" : repeating ? "上一次没有取得进展，这次仍选择了同一操作。" : `上一轮返回：${repairRounds[index - 1].result}。`}</p></div>,
      <div className={styles.sceneText} key={`${index}-act`}><span className={styles.role}>Harness · 执行工具</span><h3>{repeating ? "读取同一份日志" : index === 0 ? "取回日志" : "保存修改并执行检查"}</h3><pre>{item.action}</pre></div>,
      <div className={styles.sceneText} key={`${index}-observe`}><span className={styles.role}>结果 · 更新状态</span><h3>{index === limit - 1 ? completed ? "任务完成，结束循环" : limit < 3 ? "到达上限，保留未完成事项" : "没有进展，暂停排查" : item.result}</h3><p>{index === limit - 1 && !completed ? `当前仍是 ${repeating ? "SyntaxError" : current.fact}。没有满足验收条件，不能报告修复成功。` : item.next}</p></div>,
    ])]}</Layers>
  </div>;
}
