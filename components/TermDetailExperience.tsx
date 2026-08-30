"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClipboardText,
  Pause,
  Play,
  SpeakerHigh,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Term } from "@/lib/content";

type PreviewMode = "plain" | "styled" | "responsive";
type CodeTarget = "canvas" | "title" | "links" | "spacing";

type TermDetailExperienceProps = {
  term: Term;
  previous: Term;
  next: Term;
  related: Term[];
};

const previewModes: Array<{ id: PreviewMode; label: string }> = [
  { id: "plain", label: "没有 CSS" },
  { id: "styled", label: "基础样式" },
  { id: "responsive", label: "响应式布局" },
];

const cssCodeSteps: Array<{
  selector: string;
  property: string;
  value: string;
  target: CodeTarget;
  label: string;
}> = [
  { selector: "body", property: "background", value: "#F2EEDC", target: "canvas", label: "页面背景" },
  { selector: "h1", property: "color", value: "#35502B", target: "title", label: "标题颜色" },
  { selector: ".nav", property: "display", value: "flex", target: "links", label: "导航排列" },
  { selector: ".hero", property: "padding", value: "40px", target: "spacing", label: "内容留白" },
];

function CopyAction({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
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

function MiniPage({
  enhanced,
  compact = false,
  codeStep,
  highlightTarget,
}: {
  enhanced?: boolean;
  compact?: boolean;
  codeStep?: number;
  highlightTarget?: CodeTarget;
}) {
  const codeDemo = codeStep !== undefined;
  const showSprig = enhanced || (codeDemo && codeStep >= 3);

  return (
    <div
      className={`mini-page${enhanced ? " is-enhanced" : ""}${compact ? " is-compact" : ""}${codeDemo ? ` is-code-demo code-step-${codeStep}` : ""}${highlightTarget ? ` is-highlight-${highlightTarget}` : ""}`}
      aria-hidden="true"
    >
      <div className="mini-page-browser">
        <span /><span /><span />
      </div>
      <div className="mini-page-content">
        {showSprig && (
          <Image
            className="mini-page-sprig"
            src="/css-preview-sprig.png"
            alt=""
            width={180}
            height={180}
          />
        )}
        <small>MY FIRST PAGE</small>
        <h3>我的小站</h3>
        <p>欢迎来到我的小站<br />这里记录一些想法与分享。</p>
        <div className="mini-page-links"><span>文章</span><span>关于</span><span>联系</span></div>
      </div>
    </div>
  );
}

function CssCodeMap() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const activeCode = cssCodeSteps[activeStep];

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
          setActiveStep((current) => (current + 1) % cssCodeSteps.length);
        }, 1500);
      } else if (!entry.isIntersecting) {
        stopTimer();
      }
    }, { threshold: .35 });

    observer.observe(element);
    return () => {
      stopTimer();
      observer.disconnect();
    };
  }, [isPlaying]);

  function selectStep(index: number) {
    setActiveStep(index);
    setIsPlaying(false);
  }

  return (
    <div className="term-code-map" ref={mapRef} aria-label="CSS 代码与页面变化映射">
      <div className="term-code-editor">
        <div className="term-code-editor-head">
          <span>styles.css</span>
          <div className="term-code-map-controls">
            <button
              type="button"
              onClick={() => setIsPlaying((current) => !current)}
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
          {cssCodeSteps.map((step, index) => (
            <li key={`${step.selector}-${step.property}`}>
              <button
                type="button"
                className={activeStep === index ? "is-active" : ""}
                aria-pressed={activeStep === index}
                onClick={() => selectStep(index)}
              >
                <span className="term-code-number">{String(index + 1).padStart(2, "0")}</span>
                <code>
                  <span className="term-code-selector">{step.selector}</span>
                  {" { "}
                  <span className="term-code-property">{step.property}</span>
                  {": "}
                  <span className="term-code-value">{step.value}</span>
                  {"; }"}
                </code>
                <span className="term-code-line-label">{step.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="term-code-preview">
        <MiniPage codeStep={activeStep} highlightTarget={activeCode.target} />
        <div className="term-code-status">
          <span>正在修改</span>
          <strong>{activeCode.label}</strong>
          <small>{activeCode.selector} → {activeCode.property}</small>
        </div>
      </div>
    </div>
  );
}

function CssPreview({ mode }: { mode: PreviewMode }) {
  if (mode === "responsive") {
    return (
      <div className="term-preview-pair is-responsive">
        <div className="term-preview-cell">
          <div className="term-preview-label"><span>桌面</span><strong>留白舒展</strong></div>
          <MiniPage enhanced />
        </div>
        <div className="term-preview-cell term-preview-mobile">
          <div className="term-preview-label"><span>手机</span><strong>内容重排</strong></div>
          <MiniPage enhanced compact />
        </div>
      </div>
    );
  }

  return (
    <div className="term-preview-pair">
      <div className="term-preview-cell">
        <div className="term-preview-label"><span>之前</span><strong>只有结构</strong></div>
        <MiniPage />
      </div>
      <div className="term-preview-cell">
        <div className="term-preview-label"><span>{mode === "plain" ? "仍然" : "之后"}</span><strong>{mode === "plain" ? "没有样式" : "有了 CSS"}</strong></div>
        <MiniPage enhanced={mode === "styled"} />
      </div>
    </div>
  );
}

export function TermDetailExperience({ term, previous, next, related }: TermDetailExperienceProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("styled");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const isCss = term.slug === "css";

  const markdown = useMemo(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    `> ${term.say}`,
    "",
    `分类：${term.cat}`,
    `别名：${term.aliases.join("、")}`,
  ].join("\n"), [term]);

  const prompt = isCss
    ? "请只调整页面的 CSS：统一颜色、字体、间距与响应式布局，不改动 HTML 结构和现有功能。完成后列出改动范围，并分别检查桌面和手机尺寸。"
    : `请围绕“${term.zh}”完成这次调整：${term.say} 请保留项目现有结构，完成后说明改动范围和验证方式。`;

  function pronounce() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en || term.zh);
    utterance.lang = term.en ? "en-US" : "zh-CN";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  const answerIsCorrect = quizAnswer === "css";

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
          <p id="term-question-heading">{isCss ? "AI 改了颜色和间距，这些变化到底写在哪里？" : `“${term.zh}”到底解决了什么问题？`}</p>
        </section>

        <section className="term-story-intro" aria-labelledby="term-definition-heading">
          <h2 id="term-definition-heading">
            {isCss
              ? "CSS 是用规则描述网页外观、布局和不同空间下变化方式的样式语言。"
              : term.say}
          </h2>
          <p>{isCss
            ? "它决定页面如何被看见，但不负责页面里有什么。"
            : "先判断它负责什么、又不负责什么，再决定是否需要把它放进当前项目。"}</p>
          <div className="term-prerequisites">
            <span>{isCss ? "先知道 HTML ↗" : `所属领域 ${term.cat}`}</span>
            <div>
              {isCss && <em>也常被叫作</em>}
              {(isCss ? ["层叠样式表", "Cascading Style Sheets"] : term.aliases).map((alias) => <span key={alias}>{alias}</span>)}
            </div>
          </div>
        </section>

        {isCss ? (
          <section className="term-explainer" aria-labelledby="term-explainer-heading">
            <div className="term-section-heading">
              <span>01</span>
              <h2 id="term-explainer-heading">CSS 怎样改变同一份页面</h2>
            </div>
            <div className="term-preview-tabs" role="group" aria-label="切换 CSS 演示状态">
              {previewModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={previewMode === mode.id ? "is-active" : ""}
                  aria-pressed={previewMode === mode.id}
                  onClick={() => setPreviewMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <div className={`term-preview-stage${previewMode === "styled" ? " has-code-map" : ""}`}>
              {previewMode === "styled" ? <CssCodeMap /> : <CssPreview mode={previewMode} />}
            </div>
            {previewMode !== "styled" && (
              <p className="term-preview-caption">
                {previewMode === "plain" && "结构没有变化，所以两边看起来一样。"}
                {previewMode === "responsive" && "CSS 还能根据屏幕宽度重排内容，不需要准备两套页面。"}
              </p>
            )}
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
            <legend>{isCss ? "如果只想改颜色和间距，应该动哪里？" : `下面哪一句更适合描述“${term.zh}”？`}</legend>
            {(isCss ? [
              ["css", "用 CSS 调整视觉样式"],
              ["html", "修改 HTML 内容结构"],
              ["database", "修改 JavaScript 业务逻辑"],
            ] : [
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
              {answerIsCorrect ? "对。职责对上了，改动才不会越界。" : "再想一下：内容结构、视觉样式和数据分别由不同部分负责。"}
            </p>
          )}
        </section>

        <section className="term-prompt-card" aria-labelledby="term-prompt-heading">
          <div>
            <span>向 AI 这样说</span>
            <h2 id="term-prompt-heading">把目标和边界一起说清楚</h2>
          </div>
          <p>{prompt}</p>
          <CopyAction text={prompt} label="复制提示词" />
        </section>

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
      </div>
    </main>
  );
}
