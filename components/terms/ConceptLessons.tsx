"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, Brain, Check, CheckCircle, Circuitry, FileText, LockSimple, Plus, Terminal } from "@phosphor-icons/react";
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
  const station = scene.step < 2 || scene.step === 5 ? 0 : scene.step === 3 && !denied ? 2 : 1;
  const captions = ["帮我看看服务为什么启动失败。", "模型写出名称与参数，文件还没有被打开。", denied ? "读取没有获得授权。" : "工具和参数有效，允许读取。", denied ? "请求被拦截，文件工具未执行。" : "文件工具正在打开 server.log。", "把实际结果加入下一次模型调用。", result.answer];
  return <div className={`${styles.lab} ${styles.toolLab}`} ref={scene.ref} role="region" aria-label="读取日志的工具调用演示">
    <div className={styles.choices} role="group" aria-label="选择读取结果">{Object.entries(toolResults).map(([key, value]) => <button type="button" key={key} aria-pressed={scenario === key} onClick={() => { setScenario(key as keyof typeof toolResults); scene.seek(0); }}>{value.label}</button>)}</div>
    <div className={styles.dispatchStage}>
      <div className={styles.stations}>
        {[[Brain, "模型"], [Circuitry, "Harness"], [FileText, "文件工具"]].map(([Component, name], index) => {
          const Icon = Component as typeof Brain;
          return <div key={String(name)} data-active={station === index}><Icon size={32} weight="light" aria-hidden="true" /><strong>{String(name)}</strong></div>;
        })}
      </div>
      <div className={styles.transitLane}>
        <div className={styles.envelope} style={{ "--station": station } as CSSProperties} data-returning={scene.step >= 4} data-blocked={denied && scene.step === 3}>
          <Layers current={scene.step === 0 ? 0 : scene.step < 4 ? 1 : 2}>{[
            <div key="task"><Brain size={18} /><span>收到任务</span><p>排查启动失败</p></div>,
            <div key="request"><ArrowRight size={18} /><span>读取请求</span><code>read_file</code><p>path: server.log</p></div>,
            <div key="result"><FileText size={18} /><span>实际返回</span><pre>{result.result}</pre></div>,
          ]}</Layers>
          <span className={styles.seal} data-visible={scene.step === 2 || (denied && scene.step === 3)} aria-hidden="true">{denied ? <LockSimple size={19} /> : <Check size={19} />}</span>
        </div>
      </div>
    </div>
    <Layers current={scene.step}>{captions.map((caption, index) => <div key={index} className={styles.dispatchCaption}><span>{labels[index]}</span><p>{caption}</p></div>)}</Layers>
    <div className={styles.controlsWrap}><SceneControls scene={scene} labels={labels} /></div>
  </div>;
}

const materials = [
  { id: "log", label: "本次启动日志", text: "app.py 第 1 行缺少冒号。", Icon: FileText },
  { id: "rule", label: "任务要求", text: "修改后检查 /health 是否返回 200。", Icon: CheckCircle },
  { id: "history", label: "上周的记录", text: "上周端口 8000 被占用。", Icon: Circuitry },
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
    <div className={styles.materialBoard}>
      <span className={styles.shelfTitle}>待选资料</span>
      <div className={styles.inputTray}><div><Brain size={22} weight="light" /><h3>本轮输入</h3></div><p>服务启动失败，帮我排查。</p></div>
      {materials.map(({ id, label, text, Icon }, index) => <button key={id} type="button" className={styles.materialCard} style={{ "--index": index, "--tilt": `${[-3, 2, -1][index]}deg` } as CSSProperties} aria-pressed={selected.includes(id)} onClick={() => toggle(id)}>
        <Icon size={23} weight="light" aria-hidden="true" /><strong>{label}</strong><span>{text}</span><span className={styles.materialAction}>{selected.includes(id) ? <><Check size={14} />已加入</> : <><Plus size={14} />加入</>}</span>
      </button>)}
    </div>
    <button className={styles.answerButton} type="button" onClick={respond}>用这些资料回答<ArrowRight size={18} /></button>
    <div className={styles.answerReveal} data-open={answered} inert={!answered} aria-hidden={!answered}><div><div className={styles.contextReply} role="status"><Brain size={26} weight="light" /><p>{answer}</p></div></div></div>
  </div>;
}

const repairRounds = [
  { decision: "先读启动日志", action: 'read_file("server.log")', result: "SyntaxError: expected ':'", fact: "SyntaxError" },
  { decision: "补上冒号，再检查服务", action: "edit_file → run_checks", result: "GET /health → 500\nNameError: name 'status' is not defined", fact: "HTTP 500" },
  { decision: "修正返回值，再检查", action: "edit_file → run_checks", result: 'GET /health → 200\n{ "status": "ok" }', fact: "HTTP 200" },
];

export function AgentLoopLesson() {
  const [scenario, setScenario] = useState("repair");
  const [limit, setLimit] = useState(3);
  const length = limit * 3 + 1;
  const scene = useScene(length);
  const round = scene.step === 0 ? 0 : Math.floor((scene.step - 1) / 3) + 1;
  const repeating = scenario === "repeat";
  const ended = scene.step === length - 1;
  const completed = ended && limit === 3 && !repeating;
  const status = completed ? "检查通过，任务完成" : ended ? limit < 3 ? "达到轮数上限，任务未完成" : "连续没有进展，暂停排查" : "目标：/health 返回 200";
  const labels = ["任务与停止条件", ...Array.from({ length: limit }, (_, index) => ["判断", "执行", "观察"].map(label => `第 ${index + 1} 轮：${label}`)).flat()];
  const rounds = Array.from({ length: limit }, (_, index) => repeating ? { ...repairRounds[0], decision: index === 0 ? "读取启动日志" : "再次读取同一份日志" } : repairRounds[index]);
  const revision = repeating || scene.step < 5 ? 0 : scene.step < 8 ? 1 : 2;
  return <div className={`${styles.lab} ${styles.loopLab}`} ref={scene.ref} role="region" aria-label="反馈驱动的智能体循环演示">
    <div className={styles.loopOptions}><div className={styles.choices} role="group" aria-label="选择循环场景"><button aria-pressed={!repeating} type="button" onClick={() => { setScenario("repair"); scene.seek(0); }}>逐轮修正</button><button aria-pressed={repeating} type="button" onClick={() => { setScenario("repeat"); scene.seek(0); }}>重复同一操作</button></div><label>最多进行<select value={limit} onChange={event => { setLimit(Number(event.target.value)); scene.seek(0); }} aria-label="循环轮数上限"><option value={1}>1 轮</option><option value={2}>2 轮</option><option value={3}>3 轮</option></select></label></div>
    <div className={styles.repairWorkspace}>
      <div className={styles.roundRail} aria-label="选择修复轮次">{rounds.map((item, index) => <button type="button" key={index} aria-pressed={round === index + 1} onClick={() => scene.seek(index * 3 + 1)} aria-label={`查看第 ${index + 1} 轮`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{repeating ? "读日志" : ["读日志", "补冒号", "改返回值"][index]}</strong><span className={styles.roundFact} data-seen={scene.step >= (index + 1) * 3}>{scene.step >= (index + 1) * 3 ? item.fact : "待检查"}</span></button>)}</div>
      <div className={styles.editor}>
        <div className={styles.fileName}><FileText size={17} /><span>app.py</span></div>
        <Layers current={revision}>{[0, 1, 2].map(version => <pre key={version} className={styles.sourceCode}><span><i>1</i>def health_check(){version > 0 && <mark>:</mark>}</span><span><i>2</i>{'    return {"status": '}{version > 1 ? <mark>{'"ok"'}</mark> : "status"}{'}'}</span></pre>)}</Layers>
        <div className={styles.terminal}><div><Terminal size={17} /><span>执行与检查</span></div><Layers current={scene.step}>{[<pre key="initial">尚未执行</pre>, ...rounds.flatMap((item, index) => [
          <pre key={`${index}-ready`}>{index === 0 ? "等待读取日志" : `上次结果：${rounds[index - 1].fact}`}</pre>,
          <pre key={`${index}-running`}>{item.action}{'\n'}正在执行…</pre>,
          <pre key={`${index}-result`}>{item.result}</pre>,
        ])]}</Layers></div>
      </div>
    </div>
    <Layers current={scene.step}>{[<div key="initial" className={styles.loopCaption}><strong>先取得错误，再动手修改。</strong><p>最多进行 {limit} 轮，每次检查的结果决定后续操作。</p></div>, ...rounds.flatMap((item, index) => [
      <div key={`${index}-decide`} className={styles.loopCaption}><strong>{item.decision}</strong><p>{index === 0 ? "目前只有失败描述，先取得实际错误。" : repeating ? "仍然选择相同操作，没有带来新的证据。" : `根据上一轮的 ${repairRounds[index - 1].fact} 继续修正。`}</p></div>,
      <div key={`${index}-act`} className={styles.loopCaption}><strong>{repeating || index === 0 ? "读取 server.log" : "保存修改，运行检查"}</strong><p>操作正在执行，还不能报告成功。</p></div>,
      <div key={`${index}-observe`} className={styles.loopCaption}><strong>{index === limit - 1 ? status : item.fact}</strong><p>{index === limit - 1 ? completed ? "启动与健康检查都通过，返回结果。" : "保留当前错误，下次从未完成的事项继续。" : repeating ? "还是同一个错误，需要调整做法。" : index === 0 ? "错误落在函数定义，下一轮补上冒号。" : "服务能启动了，返回值还需要修正。"}</p></div>,
    ])]}</Layers>
    <div className={styles.controlsWrap}><SceneControls scene={scene} labels={labels} /></div>
  </div>;
}
