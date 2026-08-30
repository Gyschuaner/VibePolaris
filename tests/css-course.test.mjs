import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("CSS 词条页连接站内深度教程与权威学习资源", async () => {
  const source = await read("components/TermDetailExperience.tsx");

  assert.match(source, /href="\/guides\/css"/);
  assert.match(source, /CSS 深度教程/);
  assert.match(source, /developer\.mozilla\.org\/en-US\/docs\/Learn_web_development\/Core\/Styling_basics/);
  assert.match(source, /web\.dev\/learn\/css/);
  assert.match(source, /developer\.mozilla\.org\/en-US\/docs\/Web\/CSS\/CSS_cascade/);
});

test("CSS 深度教程包含六章、互动练习、自测与继续学习", async () => {
  const [page, practice, toc] = await Promise.all([
    read("app/guides/css/page.tsx"),
    read("components/CssCoursePractice.tsx"),
    read("components/CssCourseToc.tsx"),
  ]);

  for (const heading of ["规则与选择器", "层叠与最终值", "Flex 与 Grid", "响应式", "浏览器调试", "自测与下一步"]) {
    assert.match(page, new RegExp(heading));
  }
  assert.match(page, /<CssSelectorLab \/>/);
  assert.match(page, /<CssCourseQuiz \/>/);
  assert.match(page, /<CssCourseToc chapters=\{chapters\} \/>/);
  assert.doesNotMatch(page, /不背属性表/);
  assert.doesNotMatch(page, /css-course-meta/);
  assert.match(practice, /aria-pressed/);
  assert.match(practice, /type="radio"/);
  assert.match(practice, /aria-live="polite"/);
  assert.match(page, /href="\/terms\/responsive"/);
  assert.match(page, /developer\.mozilla\.org/);
  assert.match(page, /web\.dev\/learn\/css/);
  assert.match(toc, /addEventListener\("scroll"/);
  assert.match(toc, /aria-current=\{isActive \? "location"/);
  assert.match(toc, /className=\{isActive \? "is-active"/);
});

test("CSS 教程进入站点地图并覆盖移动端与减少动效", async () => {
  const [sitemap, styles] = await Promise.all([
    read("app/sitemap.ts"),
    read("app/globals.css"),
  ]);

  assert.match(sitemap, /"\/guides\/css"/);
  assert.match(styles, /\.css-course-layout/);
  assert.match(styles, /@media \(max-width: 680px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.css-lab-stage/);
  assert.match(styles, /\.term-course-entry/);
  assert.match(styles, /\.css-course-toc a\.is-active/);
});
