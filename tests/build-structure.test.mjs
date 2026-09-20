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
  assert.match(read("app/page.tsx"), /ConceptGraph/);
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
    "app/terms/[slug]/page.tsx",
    "app/guides/page.tsx",
    "app/tools/page.tsx",
    "app/about/page.tsx",
  ];
  const source = files.map(read).join("\n");
  assert.doesNotMatch(source, /openai|anthropic|generateText|chat\.completions/i);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test("词条保留流星跳转与减少动态支持", () => {
  assert.match(read("app/layout.tsx"), /RouteMeteorProvider/);
  const routeMotion = read("components/RouteMeteorProvider.tsx");
  assert.match(routeMotion, /router\.prefetch/);
  assert.match(routeMotion, /prefers-reduced-motion: reduce/);
  assert.match(read("components/TermDetailExperience.tsx"), /data-route-star-target/);
});
