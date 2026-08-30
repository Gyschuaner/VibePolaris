"use client";

import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

const htmlSteps = [
  {
    id: "header",
    label: "页首",
    tag: "<header>",
    code: "<header>\n  <h1>周末市集</h1>\n</header>",
    role: "banner",
    note: "告诉浏览器：这里是页面级页首。",
  },
  {
    id: "main",
    label: "主要内容",
    tag: "<main>",
    code: "<main>\n  <article>市集时间与摊位</article>\n</main>",
    role: "main",
    note: "一页通常只有一个主要内容区域。",
  },
  {
    id: "button",
    label: "操作按钮",
    tag: "<button>",
    code: "<button type=\"button\">\n  收藏市集\n</button>",
    role: "button",
    note: "它天然支持键盘聚焦和点击语义。",
  },
] as const;

export function HtmlStructureLab() {
  const [activeId, setActiveId] = useState<(typeof htmlSteps)[number]["id"]>("main");
  const active = htmlSteps.find((step) => step.id === activeId) ?? htmlSteps[1];

  return (
    <div className="css-lab foundation-lab" aria-label="HTML 语义结构练习">
      <div className="css-lab-tabs" role="group" aria-label="选择一个语义区域">
        {htmlSteps.map((step) => (
          <button
            type="button"
            key={step.id}
            aria-pressed={activeId === step.id}
            className={activeId === step.id ? "is-active" : ""}
            onClick={() => setActiveId(step.id)}
          >
            <code>{step.tag}</code>
            <span>{step.label}</span>
          </button>
        ))}
      </div>
      <div className="css-lab-stage">
        <div className="css-lab-code">
          <span>index.html</span>
          <pre><code>{active.code}</code></pre>
          <div><strong>语义角色</strong><code>{active.role}</code></div>
        </div>
        <div className="css-lab-preview foundation-html-preview" aria-live="polite">
          <span className="css-lab-preview-label">文档结构</span>
          <div className="foundation-dom-tree">
            <span>body</span>
            {htmlSteps.map((step) => (
              <div key={step.id} className={activeId === step.id ? "is-active" : ""}>
                <code>{step.tag}</code><small>{step.label}</small>
              </div>
            ))}
          </div>
          <p>{active.note}</p>
        </div>
      </div>
    </div>
  );
}

const javascriptSteps = [
  {
    id: "event",
    label: "接收事件",
    code: "button.addEventListener('click', () => {\n  // 用户刚刚点了一次\n});",
    count: 0,
    status: "等待用户点击",
  },
  {
    id: "state",
    label: "修改数据",
    code: "let count = 0;\ncount = count + 1;",
    count: 1,
    status: "count 已从 0 更新为 1",
  },
  {
    id: "render",
    label: "更新页面",
    code: "counter.textContent = count;\nstatus.textContent = '已收藏';",
    count: 1,
    status: "页面显示新的 count",
  },
] as const;

export function JavaScriptStateLab() {
  const [activeId, setActiveId] = useState<(typeof javascriptSteps)[number]["id"]>("event");
  const active = javascriptSteps.find((step) => step.id === activeId) ?? javascriptSteps[0];

  return (
    <div className="css-lab foundation-lab" aria-label="JavaScript 事件与状态练习">
      <div className="css-lab-tabs" role="group" aria-label="查看收藏操作的三个阶段">
        {javascriptSteps.map((step, index) => (
          <button
            type="button"
            key={step.id}
            aria-pressed={activeId === step.id}
            className={activeId === step.id ? "is-active" : ""}
            onClick={() => setActiveId(step.id)}
          >
            <code>{String(index + 1).padStart(2, "0")}</code>
            <span>{step.label}</span>
          </button>
        ))}
      </div>
      <div className="css-lab-stage">
        <div className="css-lab-code">
          <span>interaction.js</span>
          <pre><code>{active.code}</code></pre>
          <div><strong>当前步骤</strong><code>{active.label}</code></div>
        </div>
        <div className="css-lab-preview foundation-js-preview" aria-live="polite">
          <span className="css-lab-preview-label">界面状态</span>
          <div>
            <span>收藏次数</span>
            <strong>{active.count}</strong>
            <button type="button" tabIndex={-1}>收藏</button>
            <small>{active.status}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

type CourseQuizProps = {
  name: string;
  question: string;
  options: readonly { id: string; label: string }[];
  correctId: string;
  correctText: string;
  wrongText: string;
};

export function FoundationCourseQuiz({ name, question, options, correctId, correctText, wrongText }: CourseQuizProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const isCorrect = answer === correctId;

  return (
    <div className="css-course-quiz">
      <fieldset>
        <legend>{question}</legend>
        {options.map((option) => (
          <label key={option.id} className={answer === option.id ? "is-selected" : ""}>
            <input
              type="radio"
              name={name}
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
          {isCorrect ? correctText : wrongText}
        </p>
      )}
    </div>
  );
}
