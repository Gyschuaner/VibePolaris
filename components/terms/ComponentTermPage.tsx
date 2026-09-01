"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ClipboardText,
  Pause,
  Play,
  SpeakerHigh,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Term } from "@/lib/content";

type ComponentTermPageProps = {
  term: Term;
  previous: Term;
  next: Term;
  related: Term[];
};

const componentPhases = [
  {
    label: "定义一次",
    summary: "先写清 UserCard 的结构，以及它接受哪些输入。",
  },
  {
    label: "传入三组数据",
    summary: "三次调用使用同一份定义，只替换姓名、角色和在线状态。",
  },
  {
    label: "生成三个实例",
    summary: "页面得到三张结构一致、内容不同的用户卡片。",
  },
  {
    label: "修改一处",
    summary: "在组件定义里加上操作按钮，三个实例会一起获得这项变化。",
  },
] as const;

const people = [
  { initials: "AQ", name: "阿青", role: "前端", status: "在线", tone: "lime" },
  { initials: "LM", name: "林墨", role: "设计", status: "忙碌", tone: "moss" },
  { initials: "CY", name: "陈屿", role: "后端", status: "离线", tone: "sand" },
] as const;

function CopyAction({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = text;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button className="term-copy-action" type="button" onClick={handleCopy}>
      {copied ? <CheckCircle size={18} weight="fill" /> : <ClipboardText size={18} />}
      <span>{copied ? "已复制" : label}</span>
    </button>
  );
}

function ComponentWorkshop() {
  const [activePhase, setActivePhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const workshopRef = useRef<HTMLDivElement>(null);
  const phase = componentPhases[activePhase];

  useEffect(() => {
    const workshop = workshopRef.current;
    if (!workshop || !isPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const schedule = () => {
      stop();
      timer = window.setTimeout(() => {
        setActivePhase((current) => (current + 1) % componentPhases.length);
      }, 2600);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) schedule();
      else stop();
    }, { threshold: 0.35 });

    observer.observe(workshop);
    return () => {
      stop();
      observer.disconnect();
    };
  }, [activePhase, isPlaying]);

  function selectPhase(index: number) {
    setActivePhase(index);
    setIsPlaying(false);
  }

  return (
    <div className="component-workshop" ref={workshopRef}>
      <div className="component-workshop-head">
        <div>
          <span>可视化实验</span>
          <strong>修改一份定义，三个实例如何变化</strong>
        </div>
        <div className="component-workshop-controls">
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? "暂停组件演示" : "播放组件演示"}
            title={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? <Pause size={17} weight="fill" /> : <Play size={17} weight="fill" />}
          </button>
          <button
            type="button"
            onClick={() => { setActivePhase(0); setIsPlaying(true); }}
            aria-label="重新播放组件演示"
            title="重新播放"
          >
            <ArrowCounterClockwise size={18} />
          </button>
        </div>
      </div>

      <div className={`component-workshop-stage phase-${activePhase}`} aria-hidden="true">
        <div className="component-blueprint">
          <div className="component-panel-label">
            <span>UserCard.tsx</span>
            <em>{activePhase === 3 ? "已修改" : "组件定义"}</em>
          </div>
          <div className="component-code-lines">
            <code><b>function</b> UserCard&#40;&#123; name, role, online &#125;&#41; &#123;</code>
            <code>&nbsp;&nbsp;<b>return</b> &lt;article className=&quot;user-card&quot;&gt;</code>
            <code>&nbsp;&nbsp;&nbsp;&nbsp;&lt;Avatar status=&#123;online&#125; /&gt;</code>
            <code>&nbsp;&nbsp;&nbsp;&nbsp;&lt;Identity name=&#123;name&#125; role=&#123;role&#125; /&gt;</code>
            <code className="component-code-change">&nbsp;&nbsp;&nbsp;&nbsp;&lt;button&gt;查看资料&lt;/button&gt;</code>
            <code>&nbsp;&nbsp;&lt;/article&gt;</code>
            <code>&#125;</code>
          </div>
          <div className="component-blueprint-foot">
            <span>结构</span><span>样式</span><span>交互</span>
          </div>
        </div>

        <div className="component-calls">
          <span className="component-stage-label">三次调用</span>
          {people.map((person, index) => (
            <div className={`component-call component-call-${index}`} key={person.name}>
              <i className="brand-star-only" />
              <code>&lt;UserCard</code>
              <span>name=&quot;{person.name}&quot;</span>
              <span>role=&quot;{person.role}&quot;</span>
              <code>/&gt;</code>
            </div>
          ))}
        </div>

        <div className="component-instances">
          <span className="component-stage-label">页面中的实例</span>
          {people.map((person, index) => (
            <article className={`component-user-card tone-${person.tone} component-user-card-${index}`} key={person.name}>
              <div className="component-avatar">
                <span>{person.initials}</span>
                <i className={person.status === "在线" ? "is-online" : person.status === "忙碌" ? "is-busy" : ""} />
              </div>
              <div>
                <strong>{person.name}</strong>
                <small>{person.role} · {person.status}</small>
              </div>
              <button type="button" tabIndex={-1}>查看资料</button>
            </article>
          ))}
        </div>
      </div>

      <div className="component-workshop-result" aria-live="polite">
        <span>{String(activePhase + 1).padStart(2, "0")}</span>
        <div>
          <strong>{phase.label}</strong>
          <p>{phase.summary}</p>
        </div>
        <em>{activePhase === 3 ? "1 个改动 → 3 个实例更新" : "同一定义，不同输入"}</em>
      </div>

      <div className="component-workshop-phases" role="group" aria-label="切换组件演示阶段">
        {componentPhases.map((item, index) => (
          <button
            type="button"
            className={activePhase === index ? "is-active" : ""}
            aria-pressed={activePhase === index}
            onClick={() => selectPhase(index)}
            key={item.label}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ComponentTermPage({ term, previous, next, related }: ComponentTermPageProps) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const prompt = "请检查当前页面，找出职责明确、输入可以列清、并且在两处以上遵循同一界面规则的部分。先为每个候选组件写出名称、props、内部状态和对外事件，再决定是否拆分；不要只按代码行数切组件。完成后说明哪些部分保留在页面里，以及为什么。";
  const markdown = useMemo(() => [
    `# ${term.zh} — ${term.en}`,
    "",
    "> 组件把一份界面规则变成可以重复调用的单元。",
    "",
    "同一份定义可以接收不同输入，生成多个独立实例；修改定义后，所有实例遵循同一套新规则。",
  ].join("\n"), [term.en, term.zh]);

  function pronounce() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  const componentRelated = [
    ...related.filter((item) => ["props", "state", "design-system", "responsive"].includes(item.slug)),
    ...related.filter((item) => !["props", "state", "design-system", "responsive"].includes(item.slug)),
  ].slice(0, 4);

  return (
    <main className="term-story-page component-term-page">
      <Link className="term-page-step term-page-step-prev" href={`/terms/${previous.slug}`} aria-label={`上一个术语：${previous.zh}`} title={`上一个：${previous.zh}`}>
        <ArrowLeft size={24} />
      </Link>
      <Link className="term-page-step term-page-step-next" href={`/terms/${next.slug}`} aria-label={`下一个术语：${next.zh}`} title={`下一个：${next.zh}`}>
        <ArrowRight size={24} />
      </Link>

      <div className="term-story-shell">
        <div className="term-story-tools">
          <Link href="/terms">术语词典</Link>
          <span aria-hidden="true">/</span>
          <Link href="/terms?cat=%E5%89%8D%E7%AB%AF">前端</Link>
          <span aria-hidden="true">/</span>
          <span>{term.zh}</span>
          <CopyAction text={markdown} label="复制为 Markdown" />
        </div>

        <header className="term-story-header">
          <span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" />
          <h1>{term.zh}</h1>
          <span className="term-story-en">{term.en}</span>
          <button className="term-speak" type="button" onClick={pronounce} aria-label={`朗读 ${term.en}`} title="朗读术语">
            <SpeakerHigh size={22} />
          </button>
        </header>

        <section className="term-question" aria-labelledby="component-question-heading">
          <span>常见问题</span>
          <p id="component-question-heading">成员卡片出现在三个页面里，新增“查看资料”时，需要分别修改三处吗？</p>
        </section>

        <section className="term-story-intro" aria-labelledby="component-definition-heading">
          <h2 id="component-definition-heading">组件把一份界面规则变成可重复调用的单元。每次调用传入不同数据，得到独立实例。</h2>
          <p>它不是“把代码切小”这么简单。能说清职责、输入和对外行为，才值得成为组件；只出现一次的零散片段，不必为了复用而硬拆。</p>
          <div className="term-prerequisites">
            <span>先理解：HTML 结构与 JavaScript 状态</span>
            <div><em>常见名称</em><span>界面组件</span><span>UI Component</span><span>可复用单元</span></div>
          </div>
        </section>

        <section className="term-explainer component-explainer" aria-labelledby="component-workshop-heading">
          <div className="term-section-heading component-section-heading">
            <span>01</span>
            <h2 id="component-workshop-heading">一份定义，三次调用</h2>
          </div>
          <ComponentWorkshop />
          <div className="component-boundaries" aria-label="组件的三个边界">
            <div><span>定义</span><strong>决定共同结构</strong></div>
            <div><span>Props</span><strong>决定本次输入</strong></div>
            <div><span>实例</span><strong>保留自己的状态</strong></div>
          </div>
        </section>

        <section className="term-quiz component-quiz" aria-labelledby="component-quiz-heading">
          <div className="term-section-heading component-section-heading">
            <span>02</span>
            <h2 id="component-quiz-heading">判断组件边界</h2>
          </div>
          <fieldset>
            <legend>下面哪个部分最值得先做成组件？</legend>
            {[
              ["correct", "在成员列表、评论区和搜索结果中重复出现，输入字段稳定的用户卡片"],
              ["once", "只出现一次，但已经写到 180 行的结算页面"],
              ["lines", "任何连续超过 20 行的 JSX"],
            ].map(([value, label]) => (
              <label key={value} className={quizAnswer === value ? "is-selected" : ""}>
                <input type="radio" name="component-quiz" value={value} checked={quizAnswer === value} onChange={() => setQuizAnswer(value)} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          {quizAnswer && (
            <p className={`term-quiz-result${quizAnswer === "correct" ? " is-correct" : ""}`} aria-live="polite">
              {quizAnswer === "correct"
                ? "这块界面有稳定职责、明确输入和多处一致性要求，抽成组件能减少重复规则。"
                : "行数和出现次数只是线索。先看它能否被清楚命名、输入是否稳定、边界是否能独立理解。"}
            </p>
          )}
        </section>

        <section className="term-prompt-card" aria-labelledby="component-prompt-heading">
          <div><span>可直接复制 · 组件边界检查</span><h2 id="component-prompt-heading">判断哪些界面适合组件化</h2></div>
          <p>{prompt}</p>
          <CopyAction text={prompt} label="复制提示词" />
        </section>

        <section className="term-learning-path component-learning" aria-labelledby="component-learning-heading">
          <div className="term-section-heading component-section-heading"><span>03</span><h2 id="component-learning-heading">相关概念与来源</h2></div>
          <div className="term-related-orbit term-related-orbit-wide">
            <span>相关概念</span>
            <div>
              {componentRelated.map((item) => (
                <Link key={item.slug} href={`/terms/${item.slug}`}>
                  <span className="brand-star-only term-related-star" aria-hidden="true" />
                  {item.zh}{item.en ? <small>{item.en}</small> : null}
                </Link>
              ))}
            </div>
          </div>
          <div className="term-external-learning">
            <span>核对来源</span>
            <div>
              <a href="https://react.dev/learn/passing-props-to-a-component" target="_blank" rel="noreferrer">
                <span><strong>React · Passing Props</strong><small>组件如何接收不同输入</small></span><ArrowUpRight size={16} />
              </a>
              <a href="https://react.dev/learn/keeping-components-pure" target="_blank" rel="noreferrer">
                <span><strong>React · Keeping Components Pure</strong><small>相同输入为什么应得到相同输出</small></span><ArrowUpRight size={16} />
              </a>
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" target="_blank" rel="noreferrer">
                <span><strong>MDN · Web Components</strong><small>浏览器原生的封装与复用机制</small></span><ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
