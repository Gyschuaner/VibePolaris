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

type TermDetailExperienceProps = {
  term: Term;
  previous: Term;
  next: Term;
  related: Term[];
};

const cssResponsiveSteps: Array<{
  selector: string;
  property: string;
  value: string;
  innerSelector?: string;
  label: string;
  source: string;
  note: string;
  computed: string;
  layout: "desktop" | "squeezed" | "stacked";
}> = [
  {
    selector: ".concept-orbit",
    property: "grid-template-columns",
    value: "repeat(3, 1fr)",
    label: "桌面展开",
    source: ".concept-orbit",
    note: "桌面宽度足够，三颗概念星自然展开",
    computed: "repeat(3, 1fr)",
    layout: "desktop",
  },
  {
    selector: "@media (max-width: 640px)",
    property: "/* 缺少布局规则 */",
    value: "",
    label: "问题出现",
    source: ".concept-orbit（桌面规则）",
    note: "390px 仍沿用三列，星点和标签互相挤压",
    computed: "repeat(3, 1fr)",
    layout: "squeezed",
  },
  {
    selector: "@media (max-width: 640px)",
    innerSelector: ".concept-orbit",
    property: "grid-template-columns",
    value: "1fr",
    label: "响应式修正",
    source: "@media (max-width: 640px)",
    note: "手机上改成一列，星点和标签回到清晰轨道",
    computed: "1fr",
    layout: "stacked",
  },
];

const foundationTermConfig = {
  html: {
    question: "页面看起来没问题，为什么读屏和搜索引擎却不知道哪块是正文？",
    definition: "HTML 用有含义的标签组织内容，让浏览器先理解页面是什么，再决定如何呈现。",
    boundary: "它负责内容和结构；视觉样式属于 CSS，点击后的状态变化属于 JavaScript。",
    prerequisite: "先知道网页由文档组成 ↗",
    explainerTitle: "同一份内容，标签如何改变浏览器的理解",
    steps: [
      { label: "只有容器", code: "<div>周末市集</div>", result: "普通容器", note: "视觉上有一块内容，但没有说明它是什么。" },
      { label: "标题层级", code: "<h1>周末市集</h1>", result: "一级标题", note: "浏览器和读屏知道：这是整页的主题。" },
      { label: "操作语义", code: "<button>收藏市集</button>", result: "可操作按钮", note: "键盘、鼠标和辅助技术都能触发同一个动作。" },
    ],
    quizQuestion: "一段文字点击后要提交表单，最合适的第一步是什么？",
    quizOptions: [
      ["html", "使用 button，并明确它的提交类型"],
      ["css", "使用 div，再把它画得像按钮"],
      ["database", "使用 h3，因为标题更醒目"],
    ],
    correct: "html",
    correctText: "对。先选择自带正确语义和键盘行为的元素，再用 CSS 调整外观。",
    wrongText: "外观不是结构。能操作的内容应先使用原生交互元素。",
    promptEyebrow: "可直接复制 · 结构检查",
    promptTitle: "让 AI 先检查语义，再改标签",
    prompt: "请检查当前页面的 HTML 结构，重点找出标题层级跳跃、可点击 div、缺少 label 的输入框，以及可由 header、main、nav、article 或 button 替代的无语义容器。保留现有视觉样式和业务逻辑，只做必要的标签与关联属性调整；完成后说明每处语义变化，并用键盘走完关键操作。",
    path: [
      { href: "/terms/css", title: "CSS", note: "让结构拥有清晰的视觉层级" },
      { href: "/terms/a11y", title: "无障碍", note: "让不同操作方式都能使用" },
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
    definition: "JavaScript 接收事件、更新数据，再把新的状态反馈到页面。",
    boundary: "它负责行为和数据变化；内容结构属于 HTML，视觉呈现属于 CSS。",
    prerequisite: "先知道 HTML 与 CSS ↗",
    explainerTitle: "一次点击，如何走到最后的界面反馈",
    steps: [
      { label: "事件进入", code: "button.addEventListener('click', save)", result: "收到 click", note: "先确认交互真的进入了程序。" },
      { label: "状态变化", code: "count = count + 1", result: "count = 1", note: "数据先变化，界面才有新的依据。" },
      { label: "界面反馈", code: "counter.textContent = count", result: "页面显示 1", note: "最后把新状态同步给用户。" },
    ],
    quizQuestion: "点击收藏后数字不变，最稳妥的第一步是什么？",
    quizOptions: [
      ["javascript", "确认点击事件是否触发，再观察状态是否更新"],
      ["css", "给数字加一个更明显的颜色"],
      ["database", "每次点击都刷新整个页面"],
    ],
    correct: "javascript",
    correctText: "对。沿着事件、状态、界面的顺序检查，能快速确定问题断在哪里。",
    wrongText: "视觉和刷新都可能掩盖问题；先拿到事件与状态变化的证据。",
    promptEyebrow: "可直接复制 · 交互排查",
    promptTitle: "让 AI 沿着状态路径定位问题",
    prompt: "请复现当前页面的交互问题，并按事件触发、输入数据、状态更新、界面渲染四个阶段逐步检查。不要先增加延时或重写组件；先标出断点发生在哪个阶段，再做最小修正。完成后说明根因，并验证正常、空值、重复点击和请求失败四种情况。",
    path: [
      { href: "/terms/dom", title: "DOM", note: "理解脚本如何读取与更新页面" },
      { href: "/terms/state", title: "状态", note: "让每次界面变化都有来源" },
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

function CssResponsiveMap({
  activeStep,
  isPlaying,
  setActiveStep,
  setIsPlaying,
}: {
  activeStep: number;
  isPlaying: boolean;
  setActiveStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const activeCode = cssResponsiveSteps[activeStep];

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
          setActiveStep((activeStep + 1) % cssResponsiveSteps.length);
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
  }, [activeStep, isPlaying, setActiveStep]);

  function selectStep(index: number) {
    setActiveStep(index);
    setIsPlaying(false);
  }

  return (
    <div className="term-code-map term-responsive-map" ref={mapRef} aria-label="CSS 响应式规则与技术星图布局">
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
          {cssResponsiveSteps.map((step, index) => {
            const isPast = index < activeStep;
            const isFuture = index > activeStep;
            return (
            <li key={`${step.selector}-${step.property}`}>
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
          )})}
        </ol>
      </div>

      <div className="term-code-preview">
        <div className={`responsive-preview is-${activeCode.layout}`} aria-hidden="true">
          <div className="responsive-preview-browser">
            <span /><span /><span />
            <small>{activeCode.layout === "desktop" ? "1280px" : "390px"}</small>
          </div>
          <div className="responsive-preview-canvas">
            <span className="responsive-preview-kicker">技术星图</span>
            <div className="responsive-preview-orbit">
              {["HTML", "CSS", "JavaScript"].map((concept) => (
                <span className="responsive-preview-node" key={concept}>
                  <i className="brand-star-only" />
                  <strong>{concept}</strong>
                </span>
              ))}
            </div>
            <small>{activeCode.note}</small>
          </div>
        </div>
        <div className="term-computed" aria-live="polite">
          <span>Computed</span>
          <code>grid-template-columns: {activeCode.computed}</code>
          <small>来自 {activeCode.source}</small>
        </div>
      </div>
    </div>
  );
}

export function TermDetailExperience({ term, previous, next, related }: TermDetailExperienceProps) {
  const [responsiveStep, setResponsiveStep] = useState(0);
  const [responsivePlaying, setResponsivePlaying] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const isCss = term.slug === "css";
  const foundationConfig = term.slug in foundationTermConfig
    ? foundationTermConfig[term.slug as FoundationTermSlug]
    : null;

  const markdown = useMemo(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    `> ${term.say}`,
    "",
    `分类：${term.cat}`,
    `别名：${term.aliases.join("、")}`,
  ].join("\n"), [term]);

  const prompt = isCss
    ? "请检查当前页面在桌面与手机宽度下的布局，找出重叠、溢出、过度拥挤或排列异常的元素。先通过 computed layout 和命中的 CSS 规则定位原因；保留 HTML 内容和交互逻辑，只修改必要的 CSS。完成后说明问题来源、改动的规则，并分别在 1280px 和 390px 宽度验收。"
    : foundationConfig?.prompt ?? `请围绕“${term.zh}”完成这次调整：${term.say} 请保留项目现有结构，完成后说明改动范围和验证方式。`;

  function pronounce() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en || term.zh);
    utterance.lang = term.en ? "en-US" : "zh-CN";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  const answerIsCorrect = quizAnswer === (isCss ? "css" : foundationConfig?.correct ?? "css");

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
          <span>你可能会说</span>
          <p id="term-question-heading">{isCss ? "技术星图在桌面正常，为什么到了手机上标签全挤在一起？" : foundationConfig?.question ?? `“${term.zh}”到底解决了什么问题？`}</p>
        </section>

        <section className="term-story-intro" aria-labelledby="term-definition-heading">
          <h2 id="term-definition-heading">
            {isCss
              ? "CSS 用选择器把样式规则交给页面，再通过层叠决定最终显示结果。"
              : foundationConfig?.definition ?? term.say}
          </h2>
          <p>{isCss
            ? "它负责外观、布局和响应式；内容结构属于 HTML，点击后的业务逻辑属于 JavaScript。"
            : foundationConfig?.boundary ?? "先判断它负责什么、又不负责什么，再决定是否需要把它放进当前项目。"}</p>
          <div className="term-prerequisites">
            <span>{isCss ? "先知道 HTML ↗" : foundationConfig?.prerequisite ?? `所属领域 ${term.cat}`}</span>
            <div>
              {(isCss || foundationConfig) && <em>也常被叫作</em>}
              {(isCss ? ["层叠样式表", "Cascading Style Sheets"] : term.aliases).map((alias) => <span key={alias}>{alias}</span>)}
            </div>
          </div>
        </section>

        {isCss ? (
          <section className="term-explainer" aria-labelledby="term-explainer-heading">
            <div className="term-section-heading">
              <span>01</span>
              <h2 id="term-explainer-heading">同一张技术星图，怎样适应不同屏幕</h2>
            </div>
            <div className="term-preview-tabs" role="group" aria-label="切换 CSS 演示状态">
              {cssResponsiveSteps.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  className={responsiveStep === index ? "is-active" : ""}
                  aria-pressed={responsiveStep === index}
                  onClick={() => { setResponsiveStep(index); setResponsivePlaying(false); }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step.label}
                </button>
              ))}
            </div>
            <div className="term-preview-stage has-code-map">
              <CssResponsiveMap
                activeStep={responsiveStep}
                isPlaying={responsivePlaying}
                setActiveStep={setResponsiveStep}
                setIsPlaying={setResponsivePlaying}
              />
            </div>
            <div className="term-responsive-notes">
              <div>
                <span>布局怎么变化</span>
                <p><strong>视口变窄</strong><ArrowRight size={16} /><strong>媒体查询命中</strong><ArrowRight size={16} /><strong>星图重排</strong></p>
              </div>
              <div>
                <span>别混淆</span>
                <p><strong>CSS</strong> 管呈现；<strong>HTML</strong> 管结构；<strong>JavaScript</strong> 管行为。</p>
              </div>
            </div>
          </section>
        ) : foundationConfig ? (
          <section className="term-explainer" aria-labelledby="term-explainer-heading">
            <div className="term-section-heading">
              <span>01</span>
              <h2 id="term-explainer-heading">{foundationConfig.explainerTitle}</h2>
            </div>
            <FoundationTermMap config={foundationConfig} />
            <div className="term-responsive-notes">
              <div>
                <span>职责怎么传递</span>
                <p><strong>输入</strong><ArrowRight size={16} /><strong>浏览器理解</strong><ArrowRight size={16} /><strong>用户结果</strong></p>
              </div>
              <div>
                <span>别混淆</span>
                <p><strong>HTML</strong> 管结构；<strong>CSS</strong> 管呈现；<strong>JavaScript</strong> 管行为。</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="term-explainer term-explainer-simple" aria-labelledby="term-explainer-heading">
            <div className="term-section-heading"><span>01</span><h2 id="term-explainer-heading">先抓住它的职责边界</h2></div>
            <p>{term.say}</p>
          </section>
        )}

        <section className="term-quiz" aria-labelledby="term-quiz-heading">
          <div className="term-section-heading"><span>02</span><h2 id="term-quiz-heading">一分钟判断</h2></div>
          <fieldset>
            <legend>{isCss ? "同一份星图在 390px 仍挤成三列，下一步最该做什么？" : foundationConfig?.quizQuestion ?? `下面哪一句更适合描述“${term.zh}”？`}</legend>
            {(isCss ? [
              ["css", "确认当前布局规则，再用媒体查询调整列数"],
              ["html", "删掉一部分概念，让标签少一点"],
              ["database", "用 JavaScript 监听宽度并逐个搬动标签"],
            ] : foundationConfig?.quizOptions ?? [
              ["html", "先不看职责，直接引入"],
              ["css", term.say],
              ["database", "它可以替代项目里的全部技术"],
            ]).map(([value, label]) => (
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
              {isCss
                ? answerIsCorrect
                  ? "对。先看当前列数来自哪条规则，再让媒体查询只在窄屏重排，桌面布局不会被破坏。"
                  : "内容和交互都没有错；先让 CSS 根据视口改变布局，不要删内容或增加多余脚本。"
                : foundationConfig
                  ? answerIsCorrect ? foundationConfig.correctText : foundationConfig.wrongText
                : answerIsCorrect
                  ? "对。职责对上了，改动才不会越界。"
                  : "再想一下：内容结构、视觉样式和数据分别由不同部分负责。"}
            </p>
          )}
        </section>

        <section className="term-prompt-card" aria-labelledby="term-prompt-heading">
          <div>
            <span>{isCss ? "可直接复制 · 响应式排查" : foundationConfig?.promptEyebrow ?? "向 AI 这样说"}</span>
            <h2 id="term-prompt-heading">{isCss ? "让 AI 自动定位布局问题" : foundationConfig?.promptTitle ?? "把目标和边界一起说清楚"}</h2>
          </div>
          <p>{prompt}</p>
          <CopyAction text={prompt} label="复制提示词" />
        </section>

        {isCss ? (
          <section className="term-learning-path" aria-labelledby="term-learning-path-heading">
            <div className="term-section-heading"><span>03</span><h2 id="term-learning-path-heading">接下来学什么</h2></div>
            <div className="term-path-list">
              <Link href="/terms/html">
                <span>01</span>
                <strong>HTML <small>先分清结构与样式</small></strong>
                <ArrowRight size={20} />
              </Link>
              <Link href="/terms/responsive">
                <span>02</span>
                <strong>响应式布局 <small>看规则如何随空间变化</small></strong>
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="term-related-orbit">
              <span>周边概念</span>
              <div>
                {related.filter((item) => !["html", "responsive"].includes(item.slug)).slice(0, 4).map((item) => (
                  <Link key={item.slug} href={`/terms/${item.slug}`}>
                    <span className="brand-star-only term-related-star" aria-hidden="true" />
                    {item.zh}{item.en ? <small>{item.en}</small> : null}
                  </Link>
                ))}
              </div>
            </div>
            <div className="term-course-entry">
              <Link href="/guides/css">
                <span className="brand-star-only term-course-star" aria-hidden="true" />
                <span>
                  <small>VibePolaris 系统教程</small>
                  <strong>CSS 深度教程</strong>
                  <em>6 章 · 约 35 分钟</em>
                </span>
                <ArrowRight size={22} />
              </Link>
            </div>
            <div className="term-external-learning">
              <span>外部学习</span>
              <div>
                <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics" target="_blank" rel="noreferrer">
                  <span><strong>MDN · CSS 基础</strong><small>结构化入门</small></span><ArrowUpRight size={16} />
                </a>
                <a href="https://web.dev/learn/css" target="_blank" rel="noreferrer">
                  <span><strong>web.dev · Learn CSS</strong><small>现代布局与实践</small></span><ArrowUpRight size={16} />
                </a>
                <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade" target="_blank" rel="noreferrer">
                  <span><strong>MDN · CSS 层叠</strong><small>理解最终样式</small></span><ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </section>
        ) : foundationConfig ? (
          <section className="term-learning-path" aria-labelledby="term-learning-path-heading">
            <div className="term-section-heading"><span>03</span><h2 id="term-learning-path-heading">接下来学什么</h2></div>
            <div className="term-path-list">
              {foundationConfig.path.map((item, index) => (
                <Link href={item.href} key={item.href}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title} <small>{item.note}</small></strong>
                  <ArrowRight size={20} />
                </Link>
              ))}
            </div>
            <div className="term-related-orbit">
              <span>周边概念</span>
              <div>
                {related.filter((item) => !foundationConfig.relatedExcludes.includes(item.slug as never)).slice(0, 4).map((item) => (
                  <Link key={item.slug} href={`/terms/${item.slug}`}>
                    <span className="brand-star-only term-related-star" aria-hidden="true" />
                    {item.zh}{item.en ? <small>{item.en}</small> : null}
                  </Link>
                ))}
              </div>
            </div>
            <div className="term-course-entry">
              <Link href={foundationConfig.courseHref}>
                <span className="brand-star-only term-course-star" aria-hidden="true" />
                <span>
                  <small>VibePolaris 系统教程</small>
                  <strong>{foundationConfig.courseTitle}</strong>
                  <em>{foundationConfig.courseMeta}</em>
                </span>
                <ArrowRight size={22} />
              </Link>
            </div>
            <div className="term-external-learning">
              <span>外部学习</span>
              <div>
                {foundationConfig.external.map(([href, title, note]) => (
                  <a href={href} target="_blank" rel="noreferrer" key={href}>
                    <span><strong>{title}</strong><small>{note}</small></span><ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <nav className="term-story-related" aria-label="相关术语">
            <span>继续探索</span>
            <div>
              {related.map((item) => (
                <Link key={item.slug} href={`/terms/${item.slug}`}>
                  <span className="brand-star-only term-related-star" aria-hidden="true" />
                  <span>{item.zh}{item.en ? <small>{item.en}</small> : null}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}
