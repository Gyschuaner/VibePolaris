import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import test from "node:test";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { loadNewsContent, publishNewsDrafts } from "../scripts/news-contract.mjs";

function fixture() {
  const repository = mkdtempSync(join(tmpdir(), "vbp-news-pipeline-"));
  const draftDirectory = join(repository, "content/zh/news-drafts/2026-09-30");
  mkdirSync(draftDirectory, { recursive: true });
  mkdirSync(join(repository, "content/zh"), { recursive: true });
  writeFileSync(join(repository, "content/zh/published-terms.json"), JSON.stringify(["grounding"]));
  writeFileSync(join(repository, "content/zh/news.json"), JSON.stringify([{
    slug: "existing-example",
    title: "示例",
    summary: "示例摘要",
    body: "示例正文",
    publishedAt: "2026-09-29",
    isExample: true,
    source: { name: "VibePolaris", url: "/about" },
    relatedSlugs: ["grounding"],
  }]));
  const draftPath = join(draftDirectory, "verified-update.json");
  writeFileSync(draftPath, JSON.stringify({
    slug: "verified-update",
    title: "已核对的更新",
    summary: "事实核对后的摘要",
    body: "事实核对后的正文",
    publishedAt: "2026-09-30",
    isExample: false,
    source: { name: "Example Source", url: "https://example.com/article" },
    canonicalUrl: "https://example.com/article?utm_source=test",
    sourceHash: `sha256:${"a".repeat(64)}`,
    status: "needs-review",
    discoveredAt: "2026-09-30T12:00:00Z",
    relatedSlugs: ["grounding"],
    relationSuggestions: [{ kind: "term", slug: "grounding", score: 0.9, evidence: ["标题命中"], method: "lexical", status: "confirmed" }],
    relatedArticleSlugs: [],
  }));
  return { repository, draftPath };
}

test("新闻草稿契约校验日期路径、来源指纹和确认关系", () => {
  const { repository, draftPath } = fixture();
  try {
    const content = loadNewsContent(repository);
    assert.equal(content.drafts.length, 1);
    assert.equal(content.drafts[0].draft.slug, "verified-update");
    assert.deepEqual(publishNewsDrafts([relative(repository, draftPath)], { repository }), {
      mode: "dry-run",
      slugs: ["verified-update"],
      publishedCount: 2,
    });
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});

test("重复 canonical URL 会阻止草稿进入发布候选", () => {
  const { repository, draftPath } = fixture();
  try {
    const secondPath = join(repository, "content/zh/news-drafts/2026-09-30/another.json");
    const draft = JSON.parse(readFileSync(draftPath, "utf8"));
    draft.slug = "another-update";
    writeFileSync(secondPath, JSON.stringify(draft));
    assert.throws(() => loadNewsContent(repository), /重复/);
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});
