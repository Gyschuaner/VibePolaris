"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, ArrowRight, Brain, Check, CheckCircle, Circuitry, FileText, LockSimple, Pause, Play, WarningCircle } from "@phosphor-icons/react";
import styles from "./HarnessStory.module.css";

// One short, finite sequence at a time; never hold the reader's scroll position.
export function useScene(length: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const pause = () => { if (document.hidden) setPlaying(false); };
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
      if (!entry.isIntersecting) setPlaying(false);
    }, { rootMargin: "-110px 0px -40px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", pause);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => { if (motion.matches) setPlaying(false); };
    motion.addEventListener("change", onMotion);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); motion.removeEventListener("change", onMotion); };
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= length - 1) setPlaying(false);
      else setStep(step + 1);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [playing, step, length]);
  function seek(next: number) { setPlaying(false); setStep(next); }
  function toggle() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { seek(length - 1); return; }
    if (step === length - 1) setStep(0);
    setPlaying(!playing);
  }
  return { ref, step, playing, seek, toggle };
}

const requestSteps = [
  { title: "模型提出请求", caption: "我先读一下 server.log。", active: "model", path: "", code: 'read_file("server.log")' },
  { title: "请求交给 Harness", caption: "这是一份读取请求，文件还没有打开。", active: "harness", path: "M 170 95 Q 260 190 480 200", code: 'read_file("server.log")' },
  { title: "检查工具与权限", caption: "工具存在，路径有效，本次读取已获允许。", active: "harness", path: "", code: "read_file  ·  server.log  ·  允许读取" },
  { title: "工具读取文件", caption: "Harness 调用文件工具，日志现在才被读出。", active: "tool", path: "M 480 200 Q 680 210 825 80", code: "正在读取 server.log…" },
  { title: "结果返回 Harness", caption: "工具带回报错，Harness 保存这次结果。", active: "harness", path: "M 825 80 Q 670 28 480 200", code: "app.py:1  ·  SyntaxError: expected ':'" },
  { title: "模型根据日志继续判断", caption: "模型看到日志，决定接着查看 app.py。", active: "model", path: "M 480 200 Q 235 260 170 95", code: 'read_file("app.py")' },
];

export function SceneControls({ scene, labels, compact = false }: { scene: ReturnType<typeof useScene>; labels: string[]; compact?: boolean }) {
  return <div className={`${styles.sceneControls} ${compact ? styles.sceneControlsCompact : ""}`}>
    <button type="button" className={styles.play} aria-pressed={scene.playing} onClick={scene.toggle} aria-label={scene.playing ? "暂停原理演示" : scene.step === labels.length - 1 ? "重播原理演示" : "播放原理演示"}>
      {scene.playing ? <Pause size={17} weight="fill" /> : scene.step === labels.length - 1 ? <ArrowCounterClockwise size={17} /> : <Play size={17} weight="fill" />}
      {scene.playing ? "暂停" : scene.step === labels.length - 1 ? "再看一次" : "看它运转"}
    </button>
    <div className={styles.steps} aria-label="演示步骤">{labels.map((label, index) => <button key={label} type="button" title={label} aria-label={label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}><span /></button>)}</div>
    <button type="button" className={styles.next} onClick={() => scene.seek((scene.step + 1) % labels.length)} aria-label="原理演示下一步"><ArrowRight size={20} /></button>
  </div>;
}

export function HarnessRequestFlow() {
  const scene = useScene(requestSteps.length);
  const current = requestSteps[scene.step];
  return <div className={styles.requestScene} ref={scene.ref} role="region" aria-label="一次工具请求的旅程">
    <SceneControls scene={scene} labels={requestSteps.map(step => step.title)} />
    <div className={styles.constellation}>
      <svg className={styles.orbits} viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
        {current.path && <g key={scene.step}><path d={current.path} className={styles.trail} /><circle r="5" className={styles.packet} style={{ offsetPath: `path('${current.path}')` } as CSSProperties} /></g>}
      </svg>
      <div className={styles.actorModel} data-active={current.active === "model"}><Brain className={styles.actorIcon} aria-hidden="true" /><strong>Model</strong><span>提出下一步</span></div>
      <div className={styles.actorHarness} data-active={current.active === "harness"}><Circuitry className={styles.actorIcon} aria-hidden="true" /><strong>Harness</strong><span>{scene.step === 2 ? <><Check size={15} /> 读取已允许</> : "检查 · 调度 · 保存"}</span></div>
      <div className={styles.actorTool} data-active={current.active === "tool"}><FileText className={styles.actorIcon} aria-hidden="true" /><strong>Tool</strong><span>读取文件</span></div>
    </div>
    <div className={styles.sceneCaption} aria-live="polite"><div key={scene.step} className={styles.reveal}><h3>{current.title}</h3><code>{current.code}</code><p>{current.caption}</p></div></div>
  </div>;
}

export function HarnessContextFlow() {
  const scene = useScene(3);
  const labels = ["这次输入里有什么", "加入工具返回的日志", "模型做出新的判断"];
  return <div className={styles.contextScene} ref={scene.ref} role="region" aria-label="结果如何进入下一轮上下文">
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.contextComposition}>
      <div className={styles.contextPages}>
        <span className={styles.paperBack} aria-hidden="true" />
        <div className={styles.contextPaper}>
          <span className={styles.paperTitle}>交给模型的输入</span>
          <p>帮我修好这个服务。</p>
          <p>允许读文件，修改后必须测试。</p>
          <p><code>read_file · edit_file · run_checks</code></p>
          {scene.step > 0 && <div className={styles.insertedLog}><FileText size={18} /><div><strong>server.log</strong><code>app.py 第一行缺少冒号</code></div><Check size={16} /></div>}
        </div>
      </div>
      <div className={styles.contextAnswer}>
        <Brain className={styles.actorIcon} aria-hidden="true" />
        <strong>Model</strong>
        <p key={scene.step} className={styles.reveal}>{scene.step === 2 ? "我看到了报错。\n接下来，打开 app.py。" : scene.step === 1 ? "新的日志，\n进入下一轮输入。" : "还没有读到日志，\n先提出读取请求。"}</p>
      </div>
    </div>
  </div>;
}

const outcomes = {
  success: { label: "检查通过", stages: ["提出修改", "写入后检查", "验证完成"], title: "本次检查通过，结束修复", response: "200 OK" },
  retry: { label: "检查失败", stages: ["提出修改", "写入后检查", "继续修正"], title: "检查仍有错误，交回模型继续修正", response: "500 · NameError" },
  denied: { label: "权限不足", stages: ["提出修改", "检查权限", "工具未执行"], title: "写入被拦下，等待所需授权", response: "未运行" },
};

export function HarnessOutcomeFlow() {
  const [scenario, setScenario] = useState<keyof typeof outcomes>("success");
  const scene = useScene(3);
  const current = outcomes[scenario];
  const saved = scenario !== "denied" && scene.step > 0;
  const finished = scene.step === 2;
  const ResultIcon = scenario === "success" ? CheckCircle : scenario === "retry" ? WarningCircle : LockSimple;
  return <div className={styles.outcomeScene} ref={scene.ref} role="region" aria-label="完成、重试与权限边界">
    <div className={styles.outcomeTabs} role="group" aria-label="选择执行结果">{Object.entries(outcomes).map(([key, value]) => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key as keyof typeof outcomes); scene.seek(0); }}>{value.label}</button>)}</div>
    <SceneControls scene={scene} labels={current.stages} />
    <div className={styles.proofWorkbench} data-saved={saved} data-finished={finished}>
      <div className={styles.proofFile}>
        <div className={styles.proofHeading}><FileText size={24} aria-hidden="true" /><strong>app.py</strong><span>{saved ? "已保存修改" : "尚未修改"}</span></div>
        <pre><code>def health()<span className={styles.proofColon} data-visible={saved} aria-hidden={!saved}>:</span>{"\n"}    return <span>{saved && scenario === "success" ? '"ok"' : "health_status"}</span></code></pre>
        <div className={styles.proofSeal} aria-hidden="true"><Check size={30} /></div>
      </div>
      <div className={styles.proofService}>
        <span>服务检查</span>
        <code>GET /health</code>
        <div className={styles.proofWindow} data-waiting={scene.step === 1 && scenario !== "denied"}>
          <strong>{finished ? current.response : scene.step === 1 && scenario !== "denied" ? "检查中…" : "尚无结果"}</strong>
        </div>
      </div>
    </div>
    <div className={styles.proofResult} data-finished={finished} aria-live="polite"><ResultIcon size={23} aria-hidden="true" /><p>{finished ? current.title : scene.step === 0 ? "模型提出修改请求，文件还没有变化。" : scenario === "denied" ? "正在检查写入权限，尚未修改文件。" : "文件已修改，等待服务检查返回结果。"}</p></div>
  </div>;
}
