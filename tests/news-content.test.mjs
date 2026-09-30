import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const articles = JSON.parse(read("content/zh/news.json"));

test("新闻内容使用稳定的结构化字段", () => {
  assert.ok(articles.length >= 1);
  assert.equal(new Set(articles.map((article) => article.slug)).size, articles.length);
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9-]+$/);
    assert.ok(article.title && article.summary && article.category && article.author && article.readTime);
    assert.match(article.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Array.isArray(article.sections) && article.sections.length > 0);
    for (const section of article.sections) {
      assert.ok(section.heading);
      assert.ok(Array.isArray(section.paragraphs) && section.paragraphs.length > 0);
      assert.ok(section.paragraphs.every((paragraph) => paragraph.trim().length > 0));
    }
  }
});

test("新闻列表、详情和站点导航已接入", () => {
  assert.match(read("app/news/page.tsx"), /newsArticles/);
  assert.match(read("app/news/[slug]/page.tsx"), /generateStaticParams/);
  assert.match(read("components/SiteHeader.tsx"), /href="\/news"/);
  assert.match(read("app/sitemap.ts"), /newsArticles/);
});

test("示例新闻明确标记为示例内容", () => {
  const examples = articles.filter((article) => article.isExample);
  assert.ok(examples.length > 0);
  assert.match(read("app/news/page.tsx"), /示例文章/);
  assert.match(read("app/news/[slug]/page.tsx"), /不代表真实热点/);
});
