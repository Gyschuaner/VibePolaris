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

test("结构化内容有 20 条术语且不含阶段字段", () => {
  const terms = JSON.parse(read("content/zh/terms.json"));
  assert.equal(terms.length, 20);
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
  assert.match(home, /className=\{`constellation-map is-\$\{motionPhase\}`\}/);
  assert.match(home, /setActiveSlug/);
  assert.match(home, /setFocusId/);
  assert.match(home, /SwapFlight/);
  assert.match(home, /beginFocusSwap/);
  assert.match(home, /MotionPhase/);
  assert.match(home, /aria-live="polite"/);
  assert.match(css, /is-collapsing[\s\S]*--active-enter-x/);
  assert.match(css, /constellation-flight-to-center/);
  assert.match(css, /constellation-flight-to-orbit/);
  assert.match(css, /constellation-idle-glint/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.constellation-center/);
  assert.doesNotMatch(page, /brand-stage|domain-toolbar|recent-strip/);
  assert.doesNotMatch(home, /domain-copy|context-flow|domain-summary/);
});
