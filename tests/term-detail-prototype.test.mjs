import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("词条详情使用单栏故事式阅读结构", () => {
  const page = read("app/terms/[slug]/page.tsx");
  const experience = read("components/TermDetailExperience.tsx");

  assert.match(page, /TermDetailExperience/);
  assert.match(experience, /term-story-shell/);
  assert.match(experience, /你可能会说/);
  assert.match(experience, /CSS 怎样改变同一份页面/);
  assert.match(experience, /一分钟判断/);
  assert.match(experience, /向 AI 这样说/);
  assert.match(experience, /继续探索/);
  assert.doesNotMatch(page, /term-detail wrap/);
});

test("CSS 解释器提供三种可操作状态和真实反馈", () => {
  const source = read("components/TermDetailExperience.tsx");

  assert.match(source, /没有 CSS/);
  assert.match(source, /基础样式/);
  assert.match(source, /响应式布局/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /type="radio"/);
  assert.match(source, /navigator\.clipboard\.writeText/);
  assert.match(source, /speechSynthesis/);
  assert.match(source, /@phosphor-icons\/react/);
  assert.match(source, /CSS 代码与页面变化映射/);
  assert.match(source, /background.*#F2EEDC/);
  assert.match(source, /h1.*color.*#35502B/);
  assert.match(source, /\.nav.*display.*flex/);
  assert.match(source, /\.hero.*padding.*40px/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /1500/);
  assert.match(source, /暂停代码演示/);
  assert.match(source, /重新播放代码演示/);
});

test("词条原型覆盖移动端与减少动效偏好", () => {
  const css = read("app/globals.css");

  assert.match(css, /\.term-story-page/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.term-preview-pair/);
  assert.match(css, /@media \(max-width: 460px\)[\s\S]*\.term-story-related/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.term-preview-pair/);
  assert.match(css, /term-code-target-pulse/);
  assert.match(css, /term-code-spacing-pulse/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.term-code-map-controls \{ display: none; \}/);
});
