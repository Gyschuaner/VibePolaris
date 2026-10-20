import assert from "node:assert/strict";
import test from "node:test";
import { describePage } from "../lib/xiaobei/page-context.ts";

const catalog = {
  terms: [{ slug: "harness", zh: "运行框架", definition: "调度模型与工具。" }, { slug: "css", zh: "CSS", definition: "页面样式。" }],
  news: [{ slug: "published-news", title: "已发布进展", summary: "公开摘要。" }],
  categories: [{ slug: "ai-agent", name: "AI·Agent" }],
};

test("星图保留页面身份，公开概念选择、搜索与领域随本轮URL解析", () => {
  const page = describePage("/?term=harness&cat=ai-agent&q=tools&secret=private#private", catalog);
  assert.equal(page.kind, "graph"); assert.equal(page.path, "/");
  assert.equal(page.selectedTerm.url, "/terms/harness");
  assert.equal(page.searchQuery, "tools"); assert.equal(page.category, "AI·Agent");
  assert.ok(!JSON.stringify(page).includes("private"));
  const next = describePage("/?q=css&cat=invalid&term=unpublished", catalog);
  assert.equal(next.selectedTerm, undefined); assert.equal(next.category, undefined); assert.equal(next.searchQuery, "css");
  assert.equal(describePage("/?q=" + "a".repeat(300), catalog).searchQuery.length, 200);
});

test("画布视图和设置具有对应操作说明，不传文档ID或推测私人内容", () => {
  assert.equal(describePage("/canvas?edit=1", catalog).view, "画布总览");
  for (const [query, view] of [["?note=private-id", "文档阅读"], ["?note=private-id&edit=1", "文档编辑"]]) {
    const page = describePage("/canvas" + query + "&canvas=private-canvas&token=private-token", catalog);
    assert.equal(page.kind, "canvas"); assert.equal(page.view, view); assert.equal(page.path, "/canvas");
    assert.equal(page.title, `画布${view}`); assert.match(page.summary, new RegExp(view + "页"));
    assert.match(page.features.join(" "), /Markdown/);
    assert.ok(!JSON.stringify(page).includes("private"));
  }
  const settings = describePage("/settings?term=harness", catalog);
  assert.equal(settings.kind, "settings"); assert.match(settings.features.join(" "), /头像/);
  assert.equal(settings.selectedTerm, undefined);
});

test("只识别真实公开文章和已登记页面；失效、越级或外站地址不冒充首页", () => {
  assert.equal(describePage("/terms/harness/", catalog).subject.slug, "harness");
  assert.equal(describePage("/news/published-news", catalog).kind, "news-article");
  assert.equal(describePage("/guides/css", catalog).subject.slug, "css");
  assert.equal(describePage("/guides/html", catalog).kind, "course");
  assert.equal(describePage("/guides/javascript", catalog).kind, "course");
  for (const path of ["/news", "/about", "/xiaobei/activate"]) assert.notEqual(describePage(path, catalog).kind, "unknown");
  for (const path of ["/missing", "/terms/unpublished", "/terms/harness/extra", "/news/published-news/extra", "/news/draft", "/guides/unknown", "/guides/constructor", "//external.example/canvas", "https://external.example/", "/\\external.example/canvas", "/\ncanvas", "/[?bad"]) {
    assert.equal(describePage(path, catalog).kind, "unknown", path);
  }
});
