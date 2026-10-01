import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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
    eventDate: "2026-09-29",
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
    eventDate: "2026-09-30",
    publishedAt: "2026-09-30",
    isExample: false,
    hero: { url: "/images/news/test.svg", alt: "测试头图", sourceUrl: "/images/news/test.svg", license: "VibePolaris 自制插图" },
    sections: [{ id: "happened", title: "发生了什么", body: "事件正文" }, { id: "read", title: "怎样理解", body: "解释正文", kind: "aside" }],
    explainer: { variant: "secure-memory", title: "怎样读", question: "先看流程。", steps: [{ label: "设备", detail: "设备持钥。" }, { label: "云端", detail: "云端处理。" }] },
    source: { name: "Example Source", url: "https://example.com/article" },
    canonicalUrl: "https://example.com/article?utm_source=test",
    sourceHash: `sha256:${"a".repeat(64)}`,
    status: "needs-review",
    discoveredAt: "2026-09-30T12:00:00Z",
    relatedSlugs: ["grounding"],
    relationSuggestions: [{ kind: "term", slug: "grounding", score: 0.9, evidence: ["标题命中"], method: "lexical", status: "confirmed" }],
    relatedArticleSlugs: [],
    sources: [{ url: "https://example.com/article", claim: "可核验事实", excerpt: "来源摘录" }],
    modelReview: { decision: "publish", checkedAt: "2026-09-30T12:00:00Z" },
    mechanicalErrors: [],
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
    assert.equal(JSON.parse(readFileSync(join(repository, "content/zh/news.json"), "utf8")).length, 1);
    assert.equal(JSON.parse(readFileSync(draftPath, "utf8")).status, "needs-review");
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});

test("重复 canonical URL 会阻止草稿进入发布候选", () => {
  const { repository, draftPath } = fixture();
  try {
    const secondPath = join(repository, "content/zh/news-drafts/2026-09-30/another-update.json");
    const draft = JSON.parse(readFileSync(draftPath, "utf8"));
    draft.slug = "another-update";
    draft.canonicalUrl = "https://example.com/article/#references";
    draft.sourceHash = `sha256:${"b".repeat(64)}`;
    writeFileSync(secondPath, JSON.stringify(draft));
    assert.throws(() => loadNewsContent(repository), /重复/);
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});

test("显式提升拒绝 main、可以重试且不会覆盖已发布文章", () => {
  const { repository, draftPath } = fixture();
  try {
    const publishedPath = join(repository, "content/zh/news.json");
    const file = relative(repository, draftPath);
    execFileSync("git", ["init", "--quiet", "--initial-branch=main"], { cwd: repository });
    const original = readFileSync(publishedPath, "utf8");
    assert.throws(() => publishNewsDrafts([file], { approve: true, repository }), /main、dev/);
    assert.equal(readFileSync(publishedPath, "utf8"), original);

    execFileSync("git", ["symbolic-ref", "HEAD", "refs/heads/feat/VBP-049-news-test"], { cwd: repository });
    publishNewsDrafts([file], { approve: true, repository });
    const published = readFileSync(publishedPath, "utf8");
    const record = JSON.parse(readFileSync(draftPath, "utf8"));
    assert.equal(JSON.parse(published).length, 2);
    assert.equal(record.status, "published");
    assert.ok(record.promotedAt);
    assert.ok(!("status" in JSON.parse(published)[0]));
    assert.ok(!("relationSuggestions" in JSON.parse(published)[0]));
    publishNewsDrafts([file], { approve: true, repository });
    assert.equal(readFileSync(publishedPath, "utf8"), published);

    writeFileSync(draftPath, JSON.stringify({ ...record, status: "needs-review", body: "未经审核的新正文" }));
    assert.throws(() => publishNewsDrafts([file], { approve: true, repository }), /不会覆盖旧文章/);
    assert.equal(readFileSync(publishedPath, "utf8"), published);
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});
