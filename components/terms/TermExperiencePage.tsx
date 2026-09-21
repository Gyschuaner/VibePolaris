"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Browser,
  ChartLine,
  ChatCircle,
  Clock,
  Cloud,
  Code,
  Cube,
  Database,
  FileText,
  Gear,
  GitBranch,
  HardDrives,
  Key,
  Layout,
  ListNumbers,
  MagnifyingGlass,
  Package,
  Pause,
  Play,
  Robot,
  ShareNetwork,
  ShieldCheck,
  Sparkle,
  SpeakerHigh,
  Stack,
  User,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { Term } from "@/lib/content";
import type { TermActorIcon, TermExperience, TermSceneKind } from "@/lib/term-experiences";

type TermExperiencePageProps = {
  term: Term;
  experience: TermExperience;
  previous: Term;
  next: Term;
  related: Term[];
};

const actorIcons = {
  browser: Browser,
  server: HardDrives,
  database: Database,
  file: FileText,
  code: Code,
  user: User,
  robot: Robot,
  brain: Brain,
  gear: Gear,
  package: Package,
  git: GitBranch,
  shield: ShieldCheck,
  key: Key,
  cloud: Cloud,
  clock: Clock,
  queue: ListNumbers,
  search: MagnifyingGlass,
  chart: ChartLine,
  layout: Layout,
  component: Cube,
  message: ChatCircle,
  network: ShareNetwork,
  memory: Stack,
  spark: Sparkle,
} satisfies Record<TermActorIcon, typeof Browser>;

const sceneCopy = {
  route: { heading: "看清它走哪条路", insight: "路径结论" },
  pipeline: { heading: "跟着它走完处理过程", insight: "过程结论" },
  transform: { heading: "对照变化前后", insight: "变化结论" },
  compare: { heading: "把两种结果放在一起", insight: "比较结论" },
  layers: { heading: "一层层拆开看", insight: "分层结论" },
  tree: { heading: "顺着分支找到关系", insight: "结构结论" },
  network: { heading: "看节点怎样互相影响", insight: "关系结论" },
  timeline: { heading: "沿时间看状态变化", insight: "时序结论" },
  queue: { heading: "观察队列如何消化任务", insight: "队列结论" },
  "state-machine": { heading: "推动一次状态转换", insight: "状态结论" },
  memory: { heading: "看信息怎样写入和取回", insight: "记忆结论" },
  contract: { heading: "逐项核对约定", insight: "契约结论" },
  branch: { heading: "改变条件，看它走哪边", insight: "分支结论" },
  loop: { heading: "跑完一次循环", insight: "循环结论" },
  matrix: { heading: "交叉检查每种组合", insight: "组合结论" },
  spectrum: { heading: "拖动尺度，观察差异", insight: "尺度结论" },
  assembly: { heading: "把各部分装到一起", insight: "组合结论" },
  terminal: { heading: "逐条执行并看输出", insight: "执行结论" },
} satisfies Record<TermSceneKind, { heading: string; insight: string }>;

type SceneControlKind = "range" | "select" | "step";

function inferSceneControl(actionLabel: string): SceneControlKind {
  if (/拖动|调整|改变|修改|移动|缩窄|收窄|调高|扩大|增删|回溯/.test(actionLabel)) return "range";
  if (/选择|切换|更换|开关|启停|筛选|勾选|比较|查看|探测|决定/.test(actionLabel)) return "select";
  return "step";
}

function SceneTopology({ experience, activeFrame }: { experience: TermExperience; activeFrame: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<Array<{ id: string; d: string; active: boolean }>>([]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const canvas = svg?.parentElement;
    if (!svg || !canvas || experience.edges.length === 0) return;

    let animationFrame = 0;
    const draw = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const canvasBox = canvas.getBoundingClientRect();
        const activeEdges = new Set(experience.frames[activeFrame].activeEdgeIds);
        const nextPaths = experience.edges.flatMap((edge) => {
          const from = canvas.querySelector<HTMLElement>(`[data-actor-id="${edge.from}"]`);
          const to = canvas.querySelector<HTMLElement>(`[data-actor-id="${edge.to}"]`);
          if (!from || !to) return [];
          const fromBox = from.getBoundingClientRect();
          const toBox = to.getBoundingClientRect();
          const x1 = fromBox.left - canvasBox.left + fromBox.width / 2;
          const y1 = fromBox.top - canvasBox.top + fromBox.height / 2;
          const x2 = toBox.left - canvasBox.left + toBox.width / 2;
          const y2 = toBox.top - canvasBox.top + toBox.height / 2;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const d = Math.abs(dx) >= Math.abs(dy)
            ? `M ${x1} ${y1} C ${x1 + dx * .42} ${y1}, ${x2 - dx * .42} ${y2}, ${x2} ${y2}`
            : `M ${x1} ${y1} C ${x1} ${y1 + dy * .42}, ${x2} ${y2 - dy * .42}, ${x2} ${y2}`;
          return [{ id: edge.id, d, active: activeEdges.has(edge.id) }];
        });
        setPaths(nextPaths);
      });
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    canvas.querySelectorAll<HTMLElement>("[data-actor-id]").forEach((actor) => observer.observe(actor));
    draw();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [activeFrame, experience]);

  if (experience.edges.length === 0) return null;
  return (
    <svg className="term-scene-topology" ref={svgRef} aria-hidden="true">
      {paths.map((path) => <path className={path.active ? "is-active" : ""} d={path.d} key={path.id} />)}
    </svg>
  );
}

function CopyAction({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return <button className="term-experience-copy" type="button" onClick={copy}>{copied ? "已复制" : label}</button>;
}

function TermScene({ experience }: { experience: TermExperience }) {
  const controlKind = inferSceneControl(experience.actionLabel);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(controlKind === "step");
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = experience.frames[activeFrame];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !isPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && timer === undefined) {
        timer = window.setInterval(() => {
          setActiveFrame((current) => {
            if (current >= experience.frames.length - 1) {
              stop();
              setIsPlaying(false);
              return current;
            }
            return current + 1;
          });
        }, 3000);
      } else {
        stop();
      }
    }, { threshold: 0.35 });

    observer.observe(stage);
    return () => {
      stop();
      observer.disconnect();
    };
  }, [experience.frames.length, isPlaying]);

  function selectFrame(index: number) {
    setActiveFrame(index);
    setIsPlaying(false);
  }

  function advance() {
    setActiveFrame((current) => current >= experience.frames.length - 1 ? 0 : current + 1);
    setIsPlaying(false);
  }

  function reset() {
    setActiveFrame(0);
    setIsPlaying(controlKind === "step");
  }

  return (
    <div
      className={`term-scene term-scene-${experience.sceneKind}`}
      data-frame={activeFrame}
      ref={stageRef}
      style={{ "--frame-index": activeFrame, "--frame-count": experience.frames.length } as React.CSSProperties}
    >
      <div className="term-scene-toolbar">
        <div><span>互动演示</span><strong>{experience.sceneTitle}</strong></div>
        <div>
          <button type="button" onClick={() => setIsPlaying((value) => !value)} aria-label={isPlaying ? "暂停演示" : "播放演示"} title={isPlaying ? "暂停" : "播放"}>
            {isPlaying ? <Pause size={17} weight="fill" /> : <Play size={17} weight="fill" />}
          </button>
          <button type="button" onClick={reset} aria-label="重新播放演示" title="重新播放">
            <ArrowCounterClockwise size={18} />
          </button>
        </div>
      </div>

      <div className="term-scene-canvas" data-scene-kind={experience.sceneKind} aria-label={`${experience.sceneTitle}，当前：${frame.label}`}>
        <SceneTopology experience={experience} activeFrame={activeFrame} />
        <div className="term-scene-actors">
          {experience.actors.map((actor, index) => {
            const Icon = actorIcons[actor.icon];
            const isActive = frame.activeIds.includes(actor.id);
            const isDone = frame.doneIds.includes(actor.id);
            const isMuted = frame.mutedIds.includes(actor.id);
            return (
              <article
                className={`term-scene-actor${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}${isMuted ? " is-muted" : ""}`}
                data-group={actor.group}
                data-actor-id={actor.id}
                data-state={isActive ? "active" : isDone ? "done" : isMuted ? "muted" : "idle"}
                style={{ "--actor-index": index, "--actor-count": experience.actors.length } as React.CSSProperties}
                key={actor.id}
              >
                <span className="term-scene-actor-icon"><Icon size={22} weight={isActive ? "fill" : "regular"} /></span>
                <div><strong>{actor.label}</strong><small>{frame.values[actor.id] ?? actor.detail}</small></div>
                <i aria-hidden="true" />
              </article>
            );
          })}
        </div>

        {experience.edges.length > 0 ? (
          <div className="term-scene-edges" aria-hidden="true">
            {experience.edges.map((edge, index) => (
              <span className={frame.activeEdgeIds.includes(edge.id) ? "is-active" : ""} style={{ "--edge-index": index } as React.CSSProperties} key={edge.id}>
                {edge.label}<ArrowRight size={15} />
              </span>
            ))}
          </div>
        ) : null}

        {frame.metric ? <div className="term-scene-metric"><span>{frame.metric.label}</span><strong>{frame.metric.value}</strong></div> : null}
      </div>

      <div className="term-scene-caption" aria-live="polite" key={`${experience.slug}-${activeFrame}`}>
        <span>{String(activeFrame + 1).padStart(2, "0")}</span>
        <div><strong>{frame.label}</strong><p>{frame.note}</p></div>
        {controlKind === "range" ? (
          <label className="term-scene-range">
            <span>{experience.actionLabel}</span>
            <input
              type="range"
              min={0}
              max={experience.frames.length - 1}
              step={1}
              value={activeFrame}
              onChange={(event) => selectFrame(Number(event.currentTarget.value))}
            />
            <output>{activeFrame + 1}/{experience.frames.length}</output>
          </label>
        ) : controlKind === "select" ? (
          <label className="term-scene-select">
            <span>{experience.actionLabel}</span>
            <select value={activeFrame} onChange={(event) => selectFrame(Number(event.currentTarget.value))}>
              {experience.frames.map((item, index) => <option value={index} key={item.label}>{item.label}</option>)}
            </select>
          </label>
        ) : (
          <button type="button" onClick={advance}>{activeFrame === experience.frames.length - 1 ? "重新开始" : experience.actionLabel}<ArrowRight size={17} /></button>
        )}
      </div>

      <div className="term-scene-frames" role="group" aria-label="切换演示阶段">
        {experience.frames.map((item, index) => (
          <button type="button" className={index === activeFrame ? "is-active" : ""} aria-pressed={index === activeFrame} onClick={() => selectFrame(index)} key={`${item.label}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TermExperiencePage({ term, experience, previous, next, related }: TermExperiencePageProps) {
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const selectedOption = quizAnswer === null ? null : experience.quiz.options[quizAnswer];
  const copy = sceneCopy[experience.sceneKind];
  const markdown = useMemo(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    experience.definition,
    "",
    experience.boundary,
    "",
    `关键结论：${experience.insight}`,
  ].join("\n"), [experience, term.en, term.zh]);

  function pronounce() {
    if (!term.en || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="term-story-page term-experience-page">
      <Link className="term-page-step term-page-step-prev" href={`/terms/${previous.slug}`} aria-label={`上一个术语：${previous.zh}`} title={`上一个：${previous.zh}`}><ArrowLeft size={24} /></Link>
      <Link className="term-page-step term-page-step-next" href={`/terms/${next.slug}`} aria-label={`下一个术语：${next.zh}`} title={`下一个：${next.zh}`}><ArrowRight size={24} /></Link>

      <div className="term-story-shell">
        <div className="term-story-tools">
          <Link href="/">星图</Link><span aria-hidden="true">/</span><Link href={`/?cat=${encodeURIComponent(term.cat)}`}>{term.cat}</Link><span aria-hidden="true">/</span><span>{term.zh}</span>
          <CopyAction text={markdown} label="复制为 Markdown" />
        </div>

        <header className="term-story-header">
          <span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" />
          <h1>{term.zh}</h1>
          {term.en ? <span className="term-story-en">{term.en}</span> : null}
          {term.en ? <button className="term-speak" type="button" onClick={pronounce} aria-label={`朗读 ${term.en}`} title="朗读术语"><SpeakerHigh size={22} /></button> : null}
        </header>

        <section className="term-question" aria-labelledby={`${term.slug}-question`}><span>常见问题</span><p id={`${term.slug}-question`}>{experience.lead}</p></section>

        <section className="term-story-intro" aria-labelledby={`${term.slug}-definition`}>
          <h2 id={`${term.slug}-definition`}>{experience.definition}</h2>
          <p>{experience.boundary}</p>
        </section>

        <section className="term-explainer term-experience-explainer" aria-labelledby={`${term.slug}-scene-heading`}>
          <div className="term-section-heading"><span>01</span><h2 id={`${term.slug}-scene-heading`}>{copy.heading}</h2></div>
          <TermScene experience={experience} />
          <p className="term-experience-insight"><span>{copy.insight}</span>{experience.insight}</p>
        </section>

        <section className="term-quiz term-experience-quiz" aria-labelledby={`${term.slug}-quiz-heading`}>
          <div className="term-section-heading"><span>02</span><h2 id={`${term.slug}-quiz-heading`}>判断边界</h2></div>
          <fieldset>
            <legend>{experience.quiz.question}</legend>
            {experience.quiz.options.map((option, index) => (
              <label className={quizAnswer === index ? "is-selected" : ""} key={option.label}>
                <input type="radio" name={`${term.slug}-quiz`} checked={quizAnswer === index} onChange={() => setQuizAnswer(index)} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {selectedOption ? <p className={`term-quiz-result${selectedOption.correct ? " is-correct" : ""}`} aria-live="polite">{selectedOption.correct ? experience.quiz.success : experience.quiz.retry}</p> : null}
        </section>

        <section className="term-prompt-card" aria-labelledby={`${term.slug}-prompt-heading`}>
          <div><span>可直接复制</span><h2 id={`${term.slug}-prompt-heading`}>{experience.prompt.title}</h2></div>
          <p>{experience.prompt.text}</p>
          <CopyAction text={experience.prompt.text} label="复制提示词" />
        </section>

        <section className="term-learning-path term-experience-learning" aria-labelledby={`${term.slug}-learning-heading`}>
          <div className="term-section-heading"><span>03</span><h2 id={`${term.slug}-learning-heading`}>继续理解</h2></div>
          <div className="term-related-orbit term-related-orbit-wide"><span>相关概念</span><div>{related.slice(0, 4).map((item) => <Link key={item.slug} href={`/terms/${item.slug}`}><span className="brand-star-only term-related-star" aria-hidden="true" />{item.zh}{item.en ? <small>{item.en}</small> : null}</Link>)}</div></div>
          <div className="term-external-learning"><span>核对来源</span><div>{experience.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.label}</strong><small>{source.note}</small></span><ArrowUpRight size={16} /></a>)}</div></div>
        </section>
      </div>
    </main>
  );
}
