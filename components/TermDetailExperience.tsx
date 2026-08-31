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
    note: "桌面宽度下，三个概念按三列排列",
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
    note: "手机宽度下改成一列，避免星点和标签重叠",
    computed: "1fr",
    layout: "stacked",
  },
];

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

  if (!isCss && !foundationConfig) {
    throw new Error(`TermDetailExperience 仅用于 CSS、HTML 和 JavaScript，收到：${term.slug}`);
  }
  const foundation = foundationConfig ?? foundationTermConfig.html;

  const markdown = useMemo(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    `> ${term.say}`,
    "",
    `分类：${term.cat}`,
    `别名：${term.aliases.join("、")}`,
  ].join("\n"), [term]);

  const prompt = isCss
    ? "帮我排查这个响应式布局问题：桌面显示正常，但在 390px 宽度下，.concept-orbit 仍然保持三列，导致节点和标签拥挤。请先检查容器宽度、computed grid-template-columns 和实际命中的媒体查询，说明根因后再修改。约束：保留现有 HTML 和交互，不删内容，不用 JavaScript 监听宽度，只改必要的 CSS。完成后分别在 1280px 和 390px 验证没有重叠与横向溢出，并列出改动前后命中的规则。"
    : foundation.prompt;

  const correctQuizValue = isCss ? "css" : foundation.correct;
  const quizOptions = orderQuizOptions(
    isCss
      ? [
          ["css", "确认当前布局规则，再用媒体查询调整列数"],
          ["html", "删掉一部分概念，让标签少一点"],
          ["database", "用 JavaScript 监听宽度并逐个搬动标签"],
        ]
      : foundation.quizOptions.map(([value, label]) => [value, label]),
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
          <p id="term-question-heading">{isCss ? "技术星图在桌面正常，为什么到了手机上标签全挤在一起？" : foundation.question}</p>
        </section>

        <section className="term-story-intro" aria-labelledby="term-definition-heading">
          <h2 id="term-definition-heading">
            {isCss
              ? "CSS 使用选择器匹配元素，并通过层叠规则确定最终呈现结果。"
              : foundation.definition}
          </h2>
          <p>{isCss
            ? "它负责外观、布局和响应式；内容结构属于 HTML，点击后的业务逻辑属于 JavaScript。"
            : foundation.boundary}</p>
          <div className="term-prerequisites">
            <span>{isCss ? "前置概念：HTML ↗" : foundation.prerequisite}</span>
            <div>
              <em>常见名称</em>
              {(isCss ? ["层叠样式表", "Cascading Style Sheets"] : term.aliases).map((alias) => <span key={alias}>{alias}</span>)}
            </div>
          </div>
        </section>

        {isCss ? (
          <section className="term-explainer" aria-labelledby="term-explainer-heading">
            <div className="term-section-heading">
              <span>01</span>
              <h2 id="term-explainer-heading">不同屏幕下的布局规则</h2>
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
                <span>规则变化</span>
                <p><strong>视口变窄</strong><ArrowRight size={16} /><strong>媒体查询命中</strong><ArrowRight size={16} /><strong>星图重排</strong></p>
              </div>
              <div>
                <span>职责区分</span>
                <p><strong>CSS</strong> 管呈现；<strong>HTML</strong> 管结构；<strong>JavaScript</strong> 管行为。</p>
              </div>
            </div>
          </section>
        ) : (
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
        )}

        {!isCss && (
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
        )}

        {isCss ? (
          <section className="term-ai-guide" aria-labelledby="term-prompt-heading">
            <div className="term-section-heading"><span>02</span><h2 id="term-prompt-heading">怎么向 AI 描述这个问题</h2></div>
            <p className="term-ai-guide-intro">先给出现象、检查线索和修改边界，比只说“手机上坏了，帮我修一下”更容易得到可验证的结果。</p>
            <div className="term-ai-brief">
              <div><span>现象</span><p>桌面正常，390px 下仍是三列，节点与标签发生拥挤。</p></div>
              <div><span>先检查</span><p>容器宽度、computed 列数，以及真正命中的媒体查询。</p></div>
              <div><span>修改边界</span><p>保留 HTML 和交互，不删内容，不用脚本搬动布局。</p></div>
              <div><span>验收</span><p>同时检查 1280px 与 390px，无重叠、无横向溢出。</p></div>
            </div>
            <div className="term-ai-prompt">
              <span>组合后的提示词</span>
              <p>{prompt}</p>
              <CopyAction text={prompt} label="复制完整提示词" />
            </div>
          </section>
        ) : (
          <section className="term-prompt-card" aria-labelledby="term-prompt-heading">
            <div><span>{foundation.promptEyebrow}</span><h2 id="term-prompt-heading">{foundation.promptTitle}</h2></div>
            <p>{prompt}</p>
            <CopyAction text={prompt} label="复制提示词" />
          </section>
        )}

        {isCss ? (
          <section className="term-learning-path" aria-labelledby="term-learning-path-heading">
            <div className="term-section-heading"><span>03</span><h2 id="term-learning-path-heading">继续学习</h2></div>
            <div className="term-learning-unified">
              <Link href="/terms/html"><span><small>基础</small>01</span><strong>HTML <small>区分文档结构与视觉样式</small></strong><ArrowRight size={20} /></Link>
              <Link href="/terms/responsive"><span><small>实践</small>02</span><strong>响应式布局 <small>看规则如何随空间变化</small></strong><ArrowRight size={20} /></Link>
              {related.filter((item) => !["html", "responsive"].includes(item.slug)).slice(0, 4).map((item, index) => (
                <Link key={item.slug} href={`/terms/${item.slug}`}>
                  <span><small>相关</small>{String(index + 3).padStart(2, "0")}</span>
                  <strong>{item.zh}{item.en ? <small>{item.en}</small> : null}</strong>
                  <ArrowRight size={20} />
                </Link>
              ))}
            </div>
            <div className="term-course-entry">
              <Link href="/guides/css">
                <span className="brand-star-only term-course-star" aria-hidden="true" />
                <span>
                  <small>VibePolaris 教程</small>
                  <strong>CSS 深度教程</strong>
                  <em>6 章 · 约 35 分钟</em>
                </span>
                <ArrowRight size={22} />
              </Link>
            </div>
            <div className="term-external-learning">
              <span>参考资料</span>
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
        ) : (
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
        )}
      </div>
    </main>
  );
}
