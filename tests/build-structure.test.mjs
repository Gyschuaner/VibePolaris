import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Next.js 构建脚本与 App Router 已启用", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.scripts.dev, "next dev");
  assert.equal(pkg.scripts.build, "next build");
  assert.equal(pkg.scripts.start, "next start");
  assert.match(read("app/layout.tsx"), /RootLayout/);
  assert.match(read("app/page.tsx"), /HomeDomains/);
});

test("结构化内容不少于首发 20 条且包含首页可直达术语", () => {
  const terms = JSON.parse(read("content/zh/terms.json"));
  assert.ok(terms.length >= 20);
  assert.ok(terms.some((term) => term.slug === "css"));
  for (const term of terms) {
    assert.ok(term.slug);
    assert.ok(term.cat);
    assert.ok(Array.isArray(term.aliases));
    assert.equal("stage" in term, false);
    assert.equal("level" in term, false);
  }
});

test("产品页面没有运行时 AI SDK 或模型请求", () => {
  const files = [
    "app/page.tsx",
    "app/terms/page.tsx",
    "app/terms/[slug]/page.tsx",
    "app/guides/page.tsx",
    "app/tools/page.tsx",
    "app/about/page.tsx",
  ];
  const source = files.map(read).join("\n");
  assert.doesNotMatch(source, /openai|anthropic|generateText|chat\.completions/i);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test("首页使用可切换的极简技术星图", () => {
  const home = read("components/HomeDomains.tsx");
  const page = read("app/page.tsx");
  const css = read("app/globals.css");

  assert.match(home, /className="domain-rail"/);
  assert.match(home, /className=\{`constellation-map is-\$\{motionPhase\}\$\{focusedConcept \? ` has-concept-focus is-focus-\$\{focusPhase\}`/);
  assert.match(home, /setActiveSlug/);
  assert.match(home, /setFocusId/);
  assert.match(home, /has-concept-focus/);
  assert.match(home, /concept-focus-detail/);
  assert.match(home, /type FocusPhase = "idle" \| "primed" \| "anchoring" \| "revealed"/);
  assert.match(home, /setFocusPhase\("primed"\)/);
  assert.match(home, /setFocusPhase\("anchoring"\), 120/);
  assert.match(home, /setFocusPhase\("revealed"\), 520/);
  assert.match(home, /它解决什么/);
  assert.match(home, /怎么工作/);
  assert.match(home, /相关概念/);
  assert.match(home, /focusId === concept\.id/);
  assert.doesNotMatch(home, /href: "\/terms\?q=/);
  assert.match(home, /beginRouteFlight/);
  assert.match(read("app/layout.tsx"), /RouteMeteorProvider/);
  const routeMotion = read("components/RouteMeteorProvider.tsx");
  assert.match(routeMotion, /route-meteor/);
  assert.match(routeMotion, /router\.prefetch/);
  assert.match(routeMotion, /offsetPath: motionPath/);
  assert.match(routeMotion, /controlsForFlight/);
  assert.match(routeMotion, /const size = mobile \? 44 : 52/);
  assert.match(routeMotion, /const detailWidth = Math\.min\(940, viewportWidth - pagePadding \* 2\)/);
  assert.doesNotMatch(routeMotion, /viaA|viaB|measuredTarget/);
  assert.match(routeMotion, /prefers-reduced-motion: reduce/);
  assert.match(read("components/TermDetailExperience.tsx"), /data-route-star-target/);
  assert.match(home, /MotionPhase/);
  assert.match(home, /aria-live="polite"/);
  assert.match(css, /is-collapsing[\s\S]*--active-enter-x/);
  assert.match(css, /is-focus-primed[\s\S]*is-focus-anchoring[\s\S]*is-focus-revealed/);
  assert.match(css, /--active-focus-x/);
  assert.match(css, /is-focus-anchoring[\s\S]*\.concept-star\.is-focused[\s\S]*left: 23\.5%/);
  assert.match(css, /concept-focus-line-in/);
  assert.match(css, /concept-focus-detail/);
  assert.doesNotMatch(css, /constellation-flight-to-center/);
  assert.doesNotMatch(css, /constellation-flight-to-orbit/);
  assert.match(css, /constellation-idle-glint/);
  assert.match(css, /route-meteor-flight/);
  assert.match(css, /offset-distance: 0%[\s\S]*offset-distance: 100%/);
  assert.doesNotMatch(css, /--route-via-|--route-angle-/);
  assert.match(css, /meteor-trail-frames\.png/);
  assert.match(css, /transform-origin: 81\.4% 16\.35%/);
  assert.match(css, /translate\(-81\.4%, -16\.35%\) rotate\(45deg\)/);
  assert.match(css, /has-route-flight/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.constellation-center/);
  assert.doesNotMatch(page, /brand-stage|domain-toolbar|recent-strip/);
  assert.doesNotMatch(home, /domain-copy|context-flow|domain-summary/);
  assert.match(home, /beginRouteFlight\(concept\.href, source\)/);
});
