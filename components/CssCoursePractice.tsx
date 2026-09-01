"use client";

import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

const selectorSteps = [
  {
    id: "card",
    label: "整张卡片",
    selector: ".course-card",
    code: ".course-card {\n  border-radius: 16px;\n}",
    computed: "border-radius: 16px",
  },
  {
    id: "title",
    label: "卡片标题",
    selector: ".course-card h3",
    code: ".course-card h3 {\n  color: #35502B;\n}",
    computed: "color: rgb(53, 80, 43)",
  },
  {
    id: "copy",
    label: "直接子段落",
    selector: ".course-card > p",
    code: ".course-card > p {\n  line-height: 1.75;\n}",
    computed: "line-height: 1.75",
  },
] as const;

export function CssSelectorLab() {
  const [activeId, setActiveId] = useState<(typeof selectorSteps)[number]["id"]>("title");
  const active = selectorSteps.find((step) => step.id === activeId) ?? selectorSteps[1];

  return (
    <div className="css-lab" aria-label="CSS 选择器练习">
      <div className="css-lab-tabs" role="group" aria-label="选择要匹配的页面区域">
        {selectorSteps.map((step) => (
          <button
            type="button"
            key={step.id}
            aria-pressed={activeId === step.id}
            className={activeId === step.id ? "is-active" : ""}
            onClick={() => setActiveId(step.id)}
          >
            <code>{step.selector}</code>
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      <div className="css-lab-stage">
        <div className="css-lab-code">
          <span>lesson.css</span>
          <pre><code>{active.code}</code></pre>
          <div><strong>Computed</strong><code>{active.computed}</code></div>
        </div>
        <div className="css-lab-preview" aria-hidden="true">
          <span className="css-lab-preview-label">页面预览</span>
          <div className={`css-lab-card is-target-${active.id}`}>
            <small>CSS COURSE</small>
            <h3>CSS 规则示例</h3>
            <p>选择器匹配元素，声明指定属性和值。</p>
            <span>查看规则</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const quizOptions = [
  { id: "media", label: "检查 Computed，并用媒体查询调整窄屏布局" },
  { id: "delete", label: "删掉一部分内容，避免它们挤在一起" },
  { id: "script", label: "用 JavaScript 逐个计算并移动元素" },
];

export function CssCourseQuiz() {
  const [answer, setAnswer] = useState<string | null>(null);
  const isCorrect = answer === "media";

  return (
    <div className="css-course-quiz">
      <fieldset>
        <legend>一个三列区域在 390px 下溢出，应该先检查什么？</legend>
        {quizOptions.map((option) => (
          <label key={option.id} className={answer === option.id ? "is-selected" : ""}>
            <input
              type="radio"
              name="css-course-quiz"
              value={option.id}
              checked={answer === option.id}
              onChange={() => setAnswer(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      {answer && (
        <p className={isCorrect ? "is-correct" : "is-wrong"} aria-live="polite">
          {isCorrect ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
          {isCorrect
            ? "检查当前值的来源后，可以在对应断点调整布局。"
            : "删除内容或增加脚本不能定位布局规则。应检查当前命中的 CSS。"}
        </p>
      )}
    </div>
  );
}
