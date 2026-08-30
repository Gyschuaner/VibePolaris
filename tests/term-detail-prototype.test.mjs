import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("词条详情使用单栏故事式阅读结构", () => {
  const page = read("app/terms/[slug]/page.tsx");
  const experience = read("components/TermDetailExperience.tsx");

  assert.match(page, /TermDetailExperience/);
  assert.match(experience, /term-story-shell/);
  assert.match(experience, /常见问题/);
  assert.match(experience, /不同屏幕下的布局规则/);
  assert.match(experience, /知识检查/);
  assert.match(experience, /检查响应式布局/);
  assert.match(experience, /相关内容/);
  assert.doesNotMatch(page, /term-detail wrap/);
});

test("CSS 解释器用三阶段响应式故事同步代码、星图与最终值", () => {
  const source = read("components/TermDetailExperience.tsx");

  assert.match(source, /桌面展开/);
  assert.match(source, /问题出现/);
  assert.match(source, /响应式修正/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /type="radio"/);
  assert.match(source, /navigator\.clipboard\.writeText/);
  assert.match(source, /speechSynthesis/);
  assert.match(source, /@phosphor-icons\/react/);
  assert.match(source, /CSS 响应式规则与技术星图布局/);
  assert.match(source, /\.concept-orbit/);
  assert.match(source, /@media \(max-width: 640px\)/);
  assert.match(source, /grid-template-columns/);
  assert.match(source, /Computed/);
  assert.match(source, /term-code-indent-deep/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /2000/);
  assert.match(source, /暂停代码演示/);
  assert.match(source, /重新播放代码演示/);
  assert.match(source, /确认当前布局规则，再用媒体查询调整列数/);
  assert.match(source, /computed layout/);
  assert.match(source, /请检查当前页面在桌面与手机宽度下的布局/);
  assert.match(source, /检查响应式布局/);
  assert.doesNotMatch(source, /【目标元素】|【问题宽度】/);
  assert.match(source, /developer\.mozilla\.org\/en-US\/docs\/Web\/CSS\/CSS_cascade/);
});

test("词条原型覆盖移动端与减少动效偏好", () => {
  const css = read("app/globals.css");

  assert.match(css, /\.term-story-page/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.term-code-map \{ grid-template-columns: 1fr/);
  assert.match(css, /@media \(max-width: 460px\)[\s\S]*\.term-story-intro h2 \{ font-size: 23px/);
  assert.match(css, /\.term-copy-action[\s\S]*min-height: 44px/);
  assert.match(css, /\.term-code-map-controls button[\s\S]*width: 44px;[\s\S]*height: 44px/);
  assert.match(css, /\.term-code-lines button[\s\S]*min-height: 60px/);
  assert.doesNotMatch(css, /\.term-code-lines code[\s\S]{0,220}text-overflow: ellipsis/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.responsive-preview-node/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.term-code-map-controls \{ display: none; \}/);
});
