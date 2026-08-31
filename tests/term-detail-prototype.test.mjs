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
  assert.match(experience, /\{!isCss && \([\s\S]*className="term-quiz"/);
  assert.match(experience, /怎么向 AI 描述这个问题/);
  assert.match(experience, /term-ai-brief/);
  assert.match(experience, /继续学习/);
  assert.match(experience, /term-learning-unified/);
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
  assert.match(source, /不需要先知道选择器或属性名/);
  assert.match(source, /这个页面在电脑上看着正常，但到了手机上/);
  assert.match(source, /用大白话组合后的提示词/);
  assert.match(source, /复制完整提示词/);
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

test("正式路由不再回退到批量三步模板", () => {
  const route = read("app/terms/[slug]/page.tsx");
  const foundation = read("components/TermDetailExperience.tsx");
  const experience = read("components/terms/TermExperiencePage.tsx");
  const css = read("app/globals.css");

  assert.match(route, /dedicatedTermPages/);
  assert.match(route, /TermExperiencePage/);
  assert.doesNotMatch(route, /experience \? \(/);
  assert.doesNotMatch(foundation, /TermConceptDemo/);
  assert.doesNotMatch(foundation, /getExpandedTermContent/);
  assert.match(experience, /IntersectionObserver/);
  assert.match(experience, /SceneTopology/);
  assert.match(experience, /edge\.from/);
  assert.match(experience, /edge\.to/);
  assert.match(experience, /type="range"/);
  assert.match(experience, /<select/);
  assert.doesNotMatch(experience, /\(current \+ 1\) % experience\.frames\.length/);
  assert.match(experience, /暂停演示/);
  assert.match(experience, /重新播放演示/);
  assert.match(experience, /aria-pressed/);
  assert.match(experience, /aria-live="polite"/);
  assert.match(css, /\.term-scene-state-machine/);
  assert.match(css, /\.term-scene-network/);
  assert.match(css, /\.term-scene-terminal/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.term-scene-actor/);
});

test("组件词条使用独立研究卡与四段专属分镜", () => {
  const route = read("app/terms/[slug]/page.tsx");
  const page = read("components/terms/ComponentTermPage.tsx");
  const research = JSON.parse(read("content/zh/term-research/base.json"));
  const component = research.find((item) => item.slug === "component");

  assert.match(route, /component: ComponentTermPage/);
  assert.match(route, /ComponentTermPage/);
  assert.match(page, /一份定义，三次调用/);
  assert.match(page, /判断组件边界/);
  assert.match(page, /1 个改动 → 3 个实例更新/);
  assert.match(page, /componentPhases\.length/);
  assert.match(page, /暂停组件演示/);
  assert.match(page, /切换组件演示阶段/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.equal(component.demoSignature, "component-definition-to-three-instances: 4 frames; scene objects are one UserCard source definition, three prop calls, three rendered user-card instances, and one new action line; user can scrub phases; observable result is one definition change adding the same action to all three instances.");
  assert.equal(component.sourceUrls.length, 3);
});

test("Rebase、RAG 与缓存分别使用独立交互模型", () => {
  const route = read("app/terms/[slug]/page.tsx");
  const rebase = read("components/terms/RebaseTermPage.tsx");
  const rag = read("components/terms/RagTermPage.tsx");
  const cache = read("components/terms/CacheTermPage.tsx");
  const css = read("app/globals.css");

  assert.match(route, /rebase: RebaseTermPage/);
  assert.match(route, /rag: RagTermPage/);
  assert.match(route, /cache: CacheTermPage/);
  assert.match(rebase, /git rebase dev/);
  assert.match(rebase, /同事更新了 dev，你的功能分支落后了/);
  assert.match(rebase, /Git 在 D3 后重新应用 F1 的内容/);
  assert.match(rebase, /这就是 Rebase/);
  assert.match(rebase, /先认图/);
  assert.match(rebase, /本步大白话/);
  assert.match(rebase, /看图时注意/);
  assert.match(rebase, /为什么 F1 会变成 F1′/);
  assert.match(rebase, /Rebase 和 Merge 怎么选/);
  assert.match(rebase, /什么时候适合用，什么时候先别用/);
  assert.match(rebase, /让 AI 先判断，再指导 Rebase/);
  assert.match(rebase, /逐步查看 Rebase 过程/);
  assert.match(rebase, /开始：收起改动/);
  assert.match(rebase, /下一步：接回 F1/);
  assert.match(rebase, /下一步：接回 F2/);
  assert.match(rebase, /aria-pressed/);
  assert.match(rag, /检索并核对引用/);
  assert.match(rag, /证据覆盖/);
  assert.match(rag, /缺少直接证据/);
  assert.match(cache, /缓存中有副本/);
  assert.match(cache, /数据库真实价格/);
  assert.match(cache, /发送请求/);
  assert.match(css, /\.rebase-workbench/);
  assert.match(css, /\.rag-workbench/);
  assert.match(css, /\.cache-lab/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*\.rag-workbench, \.cache-lab \{ grid-template-columns: 1fr/);
});
