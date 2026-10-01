import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("新闻内容模型与最小栏目路由保持可追踪", async () => {
  const [raw, listPage, detailPage, sitemap, atlas, styles] = await Promise.all([
    read("content/zh/news.json"),
    read("app/news/page.tsx"),
    read("app/news/[slug]/page.tsx"),
    read("app/sitemap.ts"),
    read("components/NewsAtlas.tsx"),
    read("app/globals.css"),
  ]);
  const articles = JSON.parse(raw);
  assert.ok(articles.length >= 2);
  assert.equal(new Set(articles.map((article) => article.slug)).size, articles.length);
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9-]+$/);
    assert.match(article.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.title && article.summary && article.body);
    assert.ok(article.source?.name && article.source?.url);
    assert.ok(Array.isArray(article.relatedSlugs) && article.relatedSlugs.length > 0);
    assert.ok(Array.isArray(article.relatedArticleSlugs));
    if (article.isExample) assert.match(article.body, /不对应任何真实新闻事件/);
  }
  assert.match(listPage, /newsArticles/);
  assert.match(detailPage, /generateStaticParams/);
  assert.match(detailPage, /getPublishedTerm/);
  assert.match(sitemap, /newsArticles/);
  assert.match(atlas, /data-news-node/);
  assert.match(atlas, /setDetailOpen\(true\)/);
  assert.match(atlas, /aria-expanded=\{node\.slug === selectedNodeSlug && detailOpen\}/);
  assert.match(atlas, /CaretRight/);
  assert.match(atlas, /aria-label=\{detailOpen \? "收起新闻详情" : "展开新闻详情"\}/);
  assert.match(atlas, /if \(!visible \|\| !from \|\| !to\) return null/);
  assert.match(atlas, /selectedSlug === slug && detailOpen/);
  assert.match(atlas, /selectionGuard/);
  assert.match(styles, /\.news-atlas-detail\.is-open/);
  assert.match(styles, /ease-in-out/);
  assert.match(styles, /\.news-atlas-detail-toggle/);
  assert.match(styles, /\.news-atlas-specks \{ z-index: 1; pointer-events: none; \}/);
  assert.match(styles, /\.news-atlas-world \{ position: absolute; z-index: 3;/);
  assert.match(atlas, /Boolean\(selectedNodeSlug\) && showLines && connected/);
  assert.match(styles, /\.news-atlas-article-node \.news-atlas-node-copy \{ position: absolute;/);
});
