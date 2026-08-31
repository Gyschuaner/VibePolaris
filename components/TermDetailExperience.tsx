"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  ClipboardText,
  Pause,
  Play,
  SpeakerHigh,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Term } from "@/lib/content";
import {
  getFoundationTerm,
  type FoundationDemoStep,
  type FoundationScenario,
  type FoundationTerm,
  type PlainHit,
} from "@/lib/foundation-terms";

type TermDetailExperienceProps = {
  term: Term;
  previous: Term;
  next: Term;
  related: Term[];
};

const foundationTermConfig = {
  html: {
    question: "页面看起来没问题，为什么读屏和搜索引擎却不知道哪块是正文？",
    definition: "HTML 用语义元素组织内容，使浏览器和辅助技术能够识别页面结构。",
    boundary: "它负责内容和结构；视觉样式属于 CSS，点击后的状态变化属于 JavaScript。",
    prerequisite: "前置概念：网页文档 ↗",
    explainerTitle: "元素语义与浏览器识别结果",
    steps: [
      { label: "只有容器", code: "<div>周末市集</div>", result: "普通容器", note: "视觉上有一块内容，但没有说明它是什么。" },
      { label: "标题层级", code: "<h1>周末市集</h1>", result: "一级标题", note: "浏览器和读屏软件会把它识别为页面主题。" },
      { label: "操作语义", code: "<button>收藏市集</button>", result: "可操作按钮", note: "键盘、鼠标和辅助技术都能触发同一个动作。" },
    ],
    quizQuestion: "一段文字点击后要提交表单，应该使用什么元素？",
    quizOptions: [
      ["html", "使用 button，并明确它的提交类型"],
      ["css", "使用 div，再把它画得像按钮"],
      ["database", "使用 h3，因为标题更醒目"],
    ],
    correct: "html",
    correctText: "button 自带提交语义、键盘支持和表单行为，外观可由 CSS 调整。",
    wrongText: "可操作内容需要使用原生交互元素，外观不应决定元素语义。",
    promptEyebrow: "可直接复制 · 结构检查",
    promptTitle: "检查 HTML 结构与语义",
    prompt: "请检查当前页面的 HTML 结构，重点找出标题层级跳跃、可点击 div、缺少 label 的输入框，以及可由 header、main、nav、article 或 button 替代的无语义容器。保留现有视觉样式和业务逻辑，只做必要的标签与关联属性调整；完成后说明每处语义变化，并用键盘走完关键操作。",
    path: [
      { href: "/terms/css", title: "CSS", note: "为文档结构添加视觉层级" },
      { href: "/terms/a11y", title: "无障碍", note: "支持键盘和辅助技术" },
    ],
    relatedExcludes: ["css", "a11y"],
    courseHref: "/guides/html",
    courseTitle: "HTML 深度教程",
    courseMeta: "6 章 · 约 32 分钟",
    external: [
      ["https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", "MDN · Structuring content", "系统学习 HTML"],
      ["https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements", "MDN · HTML elements", "查元素与语义"],
      ["https://html.spec.whatwg.org/", "WHATWG · HTML", "HTML 标准"],
    ],
  },
  javascript: {
    question: "按钮明明被点了，为什么数字、提示和页面状态都没有变化？",
    definition: "JavaScript 接收事件、更新数据，并把新的状态写入页面。",
    boundary: "它负责行为和数据变化；内容结构属于 HTML，视觉呈现属于 CSS。",
    prerequisite: "前置概念：HTML 与 CSS ↗",
    explainerTitle: "点击事件、数据变化与页面更新",
    steps: [
      { label: "接收事件", code: "button.addEventListener('click', save)", result: "收到 click", note: "事件处理程序收到一次点击。" },
      { label: "修改数据", code: "count = count + 1", result: "count = 1", note: "count 从 0 更新为 1。" },
      { label: "更新页面", code: "counter.textContent = count", result: "页面显示 1", note: "计数区域显示更新后的值。" },
    ],
    quizQuestion: "点击收藏后数字不变，应该先检查什么？",
    quizOptions: [
      ["javascript", "确认点击事件是否触发，再观察状态是否更新"],
      ["css", "给数字加一个更明显的颜色"],
      ["database", "每次点击都刷新整个页面"],
    ],
    correct: "javascript",
    correctText: "检查事件是否触发和状态是否更新，可以定位异常所在的阶段。",
    wrongText: "改变颜色或刷新页面不能定位原因，需要检查事件和状态变化。",
    promptEyebrow: "可直接复制 · 交互排查",
    promptTitle: "检查交互的执行过程",
    prompt: "请复现当前页面的交互问题，并按事件触发、输入数据、状态更新、界面渲染四个阶段检查。标出最先出现异常的阶段，只对该阶段做最小修正，避免用延时或重写组件掩盖问题。完成后说明根因，并验证正常、空值、重复点击和请求失败四种情况。",
    path: [
      { href: "/terms/dom", title: "DOM", note: "理解脚本如何读取与更新页面" },
      { href: "/terms/state", title: "状态", note: "记录界面变化所依赖的数据" },
    ],
    relatedExcludes: ["dom", "state"],
    courseHref: "/guides/javascript",
    courseTitle: "JavaScript 深度教程",
    courseMeta: "6 章 · 约 38 分钟",
    external: [
      ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "MDN · JavaScript Guide", "系统学习语言基础"],
      ["https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting", "MDN · Dynamic scripting", "从页面交互入门"],
      ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference", "MDN · JavaScript Reference", "查语法与内置对象"],
    ],
  },
} as const;

type FoundationTermSlug = keyof typeof foundationTermConfig;

function orderQuizOptions(options: Array<[string, string]>, slug: string) {
  if (options.length < 2) return options;
  const offset = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0) % options.length;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

function FoundationTermMap({ config }: { config: (typeof foundationTermConfig)[FoundationTermSlug] }) {
  const [activeStep, setActiveStep] = useState(0);
  const active = config.steps[activeStep];

  return (
    <>
      <div className="term-preview-tabs" role="group" aria-label="切换概念演示状态">
        {config.steps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            className={activeStep === index ? "is-active" : ""}
            aria-pressed={activeStep === index}
            onClick={() => setActiveStep(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {step.label}
          </button>
        ))}
      </div>
      <div className="term-preview-stage foundation-term-stage">
        <div className="foundation-term-code">
          <span>代码</span>
          <code>{active.code}</code>
        </div>
        <ArrowRight size={22} aria-hidden="true" />
        <div className="foundation-term-result" aria-live="polite">
          <span>浏览器理解</span>
          <strong>{active.result}</strong>
          <p>{active.note}</p>
        </div>
      </div>
    </>
  );
}

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

const cardLabels = [
  { title: "周末市集", body: "三十家手作摊位" },
  { title: "夜间放映", body: "露天老电影场" },
  { title: "旧书交换", body: "带一本换一本" },
];

function FoundationDemoPreview({ step }: { step: FoundationDemoStep }) {
  return (
    <div className="term-code-preview">
      <div className={`responsive-preview is-${step.layout}`} aria-hidden="true">
        <div className="responsive-preview-browser">
          <span /><span /><span />
          <small>{step.widthLabel}</small>
        </div>
        <div className="responsive-preview-canvas">
          <span className="responsive-preview-kicker">内容卡片</span>
          <div className="responsive-preview-grid">
            {cardLabels.map((card) => (
              <span className="responsive-preview-node" key={card.title}>
                <i className="pcard-media" />
                <strong>{card.title}</strong>
                <em>{card.body}</em>
              </span>
            ))}
          </div>
          <small>{step.note}</small>
        </div>
      </div>
      <div className="term-computed" aria-live="polite">
        <span>Computed</span>
        <code>grid-template-columns: {step.computed}</code>
        <small>来自 {step.source}</small>
      </div>
    </div>
  );
}

function FoundationCssDemo({ data }: { data: FoundationTerm }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const steps = data.demo.steps;
  const active = steps[activeStep];

  useEffect(() => {
    const element = mapRef.current;
    if (!element || !isPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | null = null;
    const stopTimer = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && timer === null) {
        timer = window.setInterval(() => {
          setActiveStep((current) => (current + 1) % steps.length);
        }, 2000);
      } else if (!entry.isIntersecting) {
        stopTimer();
      }
    }, { threshold: .35 });

    observer.observe(element);
    return () => {
      stopTimer();
      observer.disconnect();
    };
  }, [isPlaying, steps.length]);

  function selectStep(index: number) {
    setActiveStep(index);
    setIsPlaying(false);
  }

  return (
    <>
      <div className="term-preview-tabs" role="group" aria-label="切换布局演示状态">
        {steps.map((step, index) => (
          <button
            key={step.key}
            type="button"
            className={activeStep === index ? "is-active" : ""}
            aria-pressed={activeStep === index}
            onClick={() => selectStep(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {step.label}
          </button>
        ))}
      </div>
      <div className="term-preview-stage has-code-map">
      <div className="term-code-map term-responsive-map" ref={mapRef} aria-label={data.demo.ariaLabel}>
      <div className="term-code-editor">
        <div className="term-code-editor-head">
          <span>styles.css</span>
          <div className="term-code-map-controls">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "暂停代码演示" : "播放代码演示"}
              title={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
            </button>
            <button
              type="button"
              onClick={() => { setActiveStep(0); setIsPlaying(true); }}
              aria-label="重新播放代码演示"
              title="重新播放"
            >
              <ArrowCounterClockwise size={16} />
            </button>
          </div>
        </div>
        <ol className="term-code-lines">
          {steps.map((step, index) => {
            const isPast = index < activeStep;
            const isFuture = index > activeStep;
            return (
              <li key={step.key}>
                <button
                  type="button"
                  className={`${activeStep === index ? "is-active" : ""}${isPast ? " is-past" : ""}${isFuture ? " is-future" : ""}`}
                  aria-pressed={activeStep === index}
                  onClick={() => selectStep(index)}
                >
                  <span className="term-code-number">{String(index + 1).padStart(2, "0")}</span>
                  <code>
                    <span><span className="term-code-selector">{step.selector}</span>{" {"}</span>
                    {step.innerSelector && (
                      <span className="term-code-indent"><span className="term-code-selector">{step.innerSelector}</span>{" {"}</span>
                    )}
                    <span className={step.innerSelector ? "term-code-indent term-code-indent-deep" : "term-code-indent"}>
                      <span className="term-code-property">{step.property}</span>
                      {step.value && (
                        <>{": "}<span className="term-code-value">{step.value}</span>{";"}</>
                      )}
                    </span>
                    {step.innerSelector && <span className="term-code-indent">{"}"}</span>}
                    <span>{"}"}</span>
                  </code>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <FoundationDemoPreview step={active} />
      </div>
      </div>
    </>
  );
}

const slotCopy = [
  { key: "seen" as const, label: "我看到的" },
  { key: "want" as const, label: "我想要的" },
  { key: "avoid" as const, label: "不要改的" },
  { key: "verify" as const, label: "怎么确认" },
];

function FoundationAiGuide({ guide }: { guide: FoundationTerm["aiGuide"] }) {
  const [activeKey, setActiveKey] = useState(guide.scenarios[0].key);
  const active: FoundationScenario = guide.scenarios.find((scenario) => scenario.key === activeKey) ?? guide.scenarios[0];

  return (
    <>
      <p className="term-ai-guide-intro">{guide.intro}</p>
      <div className="term-scenario-tabs" role="group" aria-label="选择要解决的时机">
        {guide.scenarios.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            className={activeKey === scenario.key ? "is-active" : ""}
            aria-pressed={activeKey === scenario.key}
            onClick={() => setActiveKey(scenario.key)}
          >
            <strong>{scenario.label}</strong>
            <small>{scenario.tagline}</small>
          </button>
        ))}
      </div>
      <div className="term-ai-brief" aria-live="polite">
        {slotCopy.map((slot) => (
          <div key={slot.key}>
            <span>{slot.label}</span>
            <p>{active.slots[slot.key]}</p>
          </div>
        ))}
      </div>
      <div className="term-ai-prompt">
        <span>{guide.promptCaption}</span>
        <p>{active.prompt}</p>
        <CopyAction text={active.prompt} label={guide.copyLabel} />
      </div>
    </>
  );
}

function FoundationChecklist({ checklist }: { checklist: FoundationTerm["checklist"] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const doneCount = checklist.items.filter((_, index) => checked[index]).length;

  return (
    <ul className="term-checklist" aria-live="polite">
      {checklist.items.map((item, index) => (
        <li key={item}>
          <button
            type="button"
            className={checked[index] ? "is-checked" : ""}
            aria-pressed={Boolean(checked[index])}
            onClick={() => setChecked((current) => ({ ...current, [index]: !current[index] }))}
          >
            <span className="term-check-box" aria-hidden="true"><Check size={14} weight="bold" /></span>
            <span>{item}</span>
          </button>
        </li>
      ))}
      <li className="term-checklist-progress">{doneCount === checklist.items.length ? "全部确认，可以交付" : `已确认 ${doneCount} / ${checklist.items.length}`}</li>
    </ul>
  );
}

function PlainHits({ hits }: { hits: PlainHit[] }) {
  function jump(target: PlainHit["target"]) {
    const element = document.getElementById(target);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="term-plain-card" aria-labelledby="term-plain-heading">
      <span className="term-plain-kicker">你是不是想说的是</span>
      <div className="term-plain-hits">
        {hits.map((hit) => (
          <button type="button" key={hit.text} onClick={() => jump(hit.target)}>
            “{hit.text}”<ArrowRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function FoundationExperience({
  term,
  data,
  previous,
  next,
  related,
}: {
  term: Term;
  data: FoundationTerm;
  previous: Term;
  next: Term;
  related: Term[];
}) {
  const [markdown] = useState(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    `> ${data.intro.definition}`,
    "",
    `分类：${term.cat}`,
    `别名：${data.intro.aliases.join("、")}`,
  ].join("\n"));

  function pronounce() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en || term.zh);
    utterance.lang = term.en ? "en-US" : "zh-CN";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="term-story-page">
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
          <Link href={`/terms?cat=${encodeURIComponent(term.cat)}`}>{term.cat}</Link>
          <span aria-hidden="true">/</span>
          <span>{term.zh}</span>
          <CopyAction text={markdown} label="复制为 Markdown" />
        </div>

        <header className="term-story-header">
          <span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" />
          <h1>{term.zh}</h1>
          {term.en && <span className="term-story-en">{term.en}</span>}
          <button className="term-speak" type="button" onClick={pronounce} aria-label={`朗读 ${term.en || term.zh}`} title="朗读术语">
            <SpeakerHigh size={22} />
          </button>
        </header>

        <PlainHits hits={data.plainHits} />

        <section className="term-question" aria-labelledby="css-question-heading">
          <span>先说清楚这件事</span>
          <p id="css-question-heading">{data.intro.question}</p>
        </section>

        <section className="term-story-intro" aria-labelledby="css-definition-heading">
          <h2 id="css-definition-heading">{data.intro.definition}</h2>
          <p>{data.intro.boundary}</p>
          <div className="term-prerequisites">
            <span>{data.intro.prerequisite}</span>
            <div>
              <em>常见名称</em>
              {data.intro.aliases.map((alias) => <span key={alias}>{alias}</span>)}
            </div>
          </div>
        </section>

        <section className="term-explainer" id="demo" aria-labelledby="css-explainer-heading">
          <div className="term-section-heading">
            <span>{data.demo.eyebrow}</span>
            <h2 id="css-explainer-heading">{data.demo.title}</h2>
          </div>
          <FoundationCssDemo data={data} />
          <div className="term-responsive-notes">
            <div>
              <span>发生了什么</span>
              <p>
                {data.demo.chain.map((node, index) => (
                  <span key={node} className="term-chain-node">
                    {index > 0 && <ArrowRight size={16} aria-hidden="true" />}
                    <strong>{node}</strong>
                  </span>
                ))}
              </p>
            </div>
            <div>
              <span>职责区分</span>
              <p>{data.demo.responsibility}</p>
            </div>
          </div>
        </section>

        <section className="term-ai-guide" id="ai-guide" aria-labelledby="css-ai-heading">
          <div className="term-section-heading"><span>02</span><h2 id="css-ai-heading">{data.aiGuide.title}</h2></div>
          <FoundationAiGuide guide={data.aiGuide} />
        </section>

        <section className="term-checklist-block" id="checklist" aria-labelledby="css-checklist-heading">
          <div className="term-section-heading"><span>03</span><h2 id="css-checklist-heading">{data.checklist.title}</h2></div>
          <p className="term-checklist-note">{data.checklist.note}</p>
          <FoundationChecklist checklist={data.checklist} />
        </section>

        <section className="term-direction" id="direction" aria-labelledby="css-direction-heading">
          <div className="term-section-heading"><span>04</span><h2 id="css-direction-heading">{data.direction.title}</h2></div>
          <p className="term-direction-note">{data.direction.note}</p>
          <div className="term-direction-grid">
            {data.direction.options.map((option) => (
              <article key={option.name}>
                <strong>{option.name}</strong>
                <em>{option.verdict}</em>
                <p>{option.when}</p>
              </article>
            ))}
          </div>
          <Link className="term-direction-link" href={data.direction.link.href}>
            {data.direction.link.label}<ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>

        <section className="term-learning-path" aria-labelledby="css-learning-heading">
          <div className="term-section-heading"><span>05</span><h2 id="css-learning-heading">继续学习</h2></div>
          <div className="term-learning-unified">
            {data.learning.path.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span><small>{item.kind}</small>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}<small>{item.note}</small></strong>
                <ArrowRight size={20} />
              </Link>
            ))}
            {related.filter((item) => !data.learning.path.some((path) => path.href === `/terms/${item.slug}`)).slice(0, 4).map((item, index) => (
              <Link key={item.slug} href={`/terms/${item.slug}`}>
                <span><small>相关</small>{String(index + data.learning.path.length + 1).padStart(2, "0")}</span>
                <strong>{item.zh}{item.en ? <small>{item.en}</small> : null}</strong>
                <ArrowRight size={20} />
              </Link>
            ))}
          </div>
          <div className="term-course-entry">
            <Link href={data.learning.course.href}>
              <span className="brand-star-only term-course-star" aria-hidden="true" />
              <span>
                <small>{data.learning.course.label}</small>
                <strong>{data.learning.course.title}</strong>
                <em>{data.learning.course.meta}</em>
              </span>
              <ArrowRight size={22} />
            </Link>
          </div>
          <div className="term-external-learning">
            <span>参考资料</span>
            <div>
              {data.learning.references.map((reference) => (
                <a href={reference.href} target="_blank" rel="noreferrer" key={reference.href}>
                  <span><strong>{reference.label}</strong><small>{reference.note}</small></span><ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function TermDetailExperience({ term, previous, next, related }: TermDetailExperienceProps) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const isCss = term.slug === "css";
  const cssData = isCss ? getFoundationTerm("css") : undefined;
  const foundationConfig = term.slug in foundationTermConfig
    ? foundationTermConfig[term.slug as FoundationTermSlug]
    : null;

  const foundation = foundationConfig ?? foundationTermConfig.html;

  const markdown = useMemo(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    `> ${term.say}`,
    "",
    `分类：${term.cat}`,
    `别名：${term.aliases.join("、")}`,
  ].join("\n"), [term]);

  const prompt = foundation.prompt;

  const correctQuizValue = foundation.correct;
  const quizOptions = orderQuizOptions(
    foundation.quizOptions.map(([value, label]) => [value, label]),
    term.slug,
  );

  function pronounce() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en || term.zh);
    utterance.lang = term.en ? "en-US" : "zh-CN";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  const answerIsCorrect = quizAnswer === correctQuizValue;

  if (isCss && cssData) {
    return <FoundationExperience term={term} data={cssData} previous={previous} next={next} related={related} />;
  }

  return (
    <main className="term-story-page">
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
          <Link href={`/terms?cat=${encodeURIComponent(term.cat)}`}>{term.cat}</Link>
          <span aria-hidden="true">/</span>
          <span>{term.zh}</span>
          <CopyAction text={markdown} label="复制为 Markdown" />
        </div>

        <header className="term-story-header">
          <span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" />
          <h1>{term.zh}</h1>
          {term.en && <span className="term-story-en">{term.en}</span>}
          <button className="term-speak" type="button" onClick={pronounce} aria-label={`朗读 ${term.en || term.zh}`} title="朗读术语">
            <SpeakerHigh size={22} />
          </button>
        </header>

        <section className="term-question" aria-labelledby="term-question-heading">
          <span>常见问题</span>
          <p id="term-question-heading">{foundation.question}</p>
        </section>

        <section className="term-story-intro" aria-labelledby="term-definition-heading">
          <h2 id="term-definition-heading">{foundation.definition}</h2>
          <p>{foundation.boundary}</p>
          <div className="term-prerequisites">
            <span>{foundation.prerequisite}</span>
            <div>
              <em>常见名称</em>
              {term.aliases.map((alias) => <span key={alias}>{alias}</span>)}
            </div>
          </div>
        </section>

        <section className="term-explainer" aria-labelledby="term-explainer-heading">
          <div className="term-section-heading">
            <span>01</span>
            <h2 id="term-explainer-heading">{foundation.explainerTitle}</h2>
          </div>
          <FoundationTermMap config={foundation} />
          <div className="term-responsive-notes">
            <div>
              <span>执行过程</span>
              <p><strong>输入</strong><ArrowRight size={16} /><strong>浏览器理解</strong><ArrowRight size={16} /><strong>用户结果</strong></p>
            </div>
            <div>
              <span>职责区分</span>
              <p><strong>HTML</strong> 管结构；<strong>CSS</strong> 管呈现；<strong>JavaScript</strong> 管行为。</p>
            </div>
          </div>
        </section>

        <section className="term-quiz" aria-labelledby="term-quiz-heading">
          <div className="term-section-heading"><span>02</span><h2 id="term-quiz-heading">知识检查</h2></div>
          <fieldset>
            <legend>{foundation.quizQuestion}</legend>
            {quizOptions.map(([value, label]) => (
              <label key={value} className={quizAnswer === value ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="term-quiz"
                  value={value}
                  checked={quizAnswer === value}
                  onChange={() => setQuizAnswer(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          {quizAnswer && (
            <p className={`term-quiz-result${answerIsCorrect ? " is-correct" : ""}`} aria-live="polite">
              {answerIsCorrect ? foundation.correctText : foundation.wrongText}
            </p>
          )}
        </section>

        <section className="term-prompt-card" aria-labelledby="term-prompt-heading">
          <div><span>{foundation.promptEyebrow}</span><h2 id="term-prompt-heading">{foundation.promptTitle}</h2></div>
          <p>{prompt}</p>
          <CopyAction text={prompt} label="复制提示词" />
        </section>

        <section className="term-learning-path" aria-labelledby="term-learning-path-heading">
          <div className="term-section-heading"><span>03</span><h2 id="term-learning-path-heading">相关内容</h2></div>
          <div className="term-path-list">
            {foundation.path.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title} <small>{item.note}</small></strong>
                <ArrowRight size={20} />
              </Link>
            ))}
          </div>
          <div className="term-related-orbit">
            <span>相关概念</span>
            <div>
              {related.filter((item) => !foundation.relatedExcludes.includes(item.slug as never)).slice(0, 4).map((item) => (
                <Link key={item.slug} href={`/terms/${item.slug}`}>
                  <span className="brand-star-only term-related-star" aria-hidden="true" />
                  {item.zh}{item.en ? <small>{item.en}</small> : null}
                </Link>
              ))}
            </div>
          </div>
          <div className="term-course-entry">
            <Link href={foundation.courseHref}>
              <span className="brand-star-only term-course-star" aria-hidden="true" />
              <span>
                <small>VibePolaris 教程</small>
                <strong>{foundation.courseTitle}</strong>
                <em>{foundation.courseMeta}</em>
              </span>
              <ArrowRight size={22} />
            </Link>
          </div>
          <div className="term-external-learning">
            <span>参考资料</span>
            <div>
              {foundation.external.map(([href, title, note]) => (
                <a href={href} target="_blank" rel="noreferrer" key={href}>
                  <span><strong>{title}</strong><small>{note}</small></span><ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
