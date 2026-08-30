import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("HTML 与 JavaScript 从研究候选进入正式词条和站点地图", async () => {
  const [terms, sitemap] = await Promise.all([
    read("content/zh/terms.json"),
    read("app/sitemap.ts"),
  ]);

  assert.match(terms, /"slug": "html"/);
  assert.match(terms, /"slug": "javascript"/);
  assert.match(sitemap, /"\/guides\/html"/);
  assert.match(sitemap, /"\/guides\/javascript"/);
});

test("HTML 与 JavaScript 词条使用专属内容、互动状态和系统教程入口", async () => {
  const source = await read("components/TermDetailExperience.tsx");

  assert.match(source, /页面看起来没问题，为什么读屏和搜索引擎/);
  assert.match(source, /按钮明明被点了，为什么数字、提示和页面状态/);
  assert.match(source, /function FoundationTermMap/);
  assert.match(source, /aria-pressed=\{activeStep === index\}/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /courseHref: "\/guides\/html"/);
  assert.match(source, /courseHref: "\/guides\/javascript"/);
});

test("两门深度教程均包含六章、互动练习、自测和权威资料", async () => {
  const [htmlPage, javascriptPage, practice] = await Promise.all([
    read("app/guides/html/page.tsx"),
    read("app/guides/javascript/page.tsx"),
    read("components/FoundationCoursePractice.tsx"),
  ]);

  for (const heading of ["页面骨架", "语义结构", "文本与链接", "表单与交互", "无障碍检查", "自测与下一步"]) {
    assert.match(htmlPage, new RegExp(heading));
  }
  for (const heading of ["值与变量", "条件与函数", "事件与状态", "异步与请求", "错误与调试", "自测与下一步"]) {
    assert.match(javascriptPage, new RegExp(heading));
  }
  assert.match(htmlPage, /<HtmlStructureLab \/>/);
  assert.match(javascriptPage, /<JavaScriptStateLab \/>/);
  assert.match(htmlPage, /<FoundationCourseQuiz/);
  assert.match(javascriptPage, /<FoundationCourseQuiz/);
  assert.match(practice, /aria-pressed/);
  assert.match(practice, /type="radio"/);
  assert.match(practice, /aria-live="polite"/);
  assert.match(htmlPage, /html\.spec\.whatwg\.org/);
  assert.match(javascriptPage, /developer\.mozilla\.org/);
});

test("章节编号建立更清楚的视觉层级且不放大代码行号", async () => {
  const styles = await read("app/globals.css");

  assert.match(styles, /\.term-section-heading > span[\s\S]*?20px/);
  assert.match(styles, /\.term-path-list > a > span[\s\S]*?16px/);
  assert.match(styles, /\.css-course-section-head > span[\s\S]*?20px/);
  assert.match(styles, /\.css-course-outcome p strong[\s\S]*?16px/);
  assert.match(styles, /\.term-code-number[\s\S]*?10px/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("JavaScript 教程使用直接、可核验的技术表达", async () => {
  const [page, practice, footer] = await Promise.all([
    read("app/guides/javascript/page.tsx"),
    read("components/FoundationCoursePractice.tsx"),
    read("components/SiteFooter.tsx"),
  ]);

  for (const phrase of ["保持可预测", "你不必背完", "让证据把路径照亮", "可靠的数据路径收束", "从这里继续"]) {
    assert.doesNotMatch(page, new RegExp(phrase));
  }
  assert.match(page, /网页交互的/);
  assert.match(page, /用浏览器调试 JavaScript/);
  assert.match(practice, /接收事件/);
  assert.match(practice, /修改数据/);
  assert.match(practice, /更新页面/);
  assert.match(footer, /静态内容，不在浏览器调用模型/);
});
