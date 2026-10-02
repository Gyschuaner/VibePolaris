import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  ingestNewsBatch,
  newsIngestBatchSchema,
  validateNewsStore,
} from "../lib/news-ingest.ts";

function payload(articles = [article("demo")]) {
  return {
    version: 1,
    runId: "test-run",
    generatedAt: "2026-10-02T02:00:00.000Z",
    articles,
  };
}

function article(slug, canonicalUrl = "https://example.com/news?id=1&utm_source=test") {
  return {
    slug,
    title: "Example",
    summary: "Summary",
    body: "Body",
    eventDate: "2026-10-01",
    publishedAt: "2026-10-02",
    source: { name: "Example", url: "https://example.com/news?id=1" },
    canonicalUrl,
    relatedSlugs: [],
    relatedArticleSlugs: [],
    evidence: [{
      url: "https://example.com/news?id=1",
      claim: "Claim",
      excerpt: "Excerpt",
    }],
  };
}

test("schema rejects unknown keys, non-HTTPS sources, and invalid slugs", () => {
  assert.throws(() => newsIngestBatchSchema.parse(payload([{
    ...article("Bad_Slug"),
    unexpected: true,
  }])));
  assert.throws(() => newsIngestBatchSchema.parse(payload([{
    ...article("bad-slug"),
    source: { name: "Example", url: "http://example.com/news" },
  }])));
});

test("producer handoff is idempotent and writes a dated draft", () => {
  const rootDir = mkdtempSync(join(tmpdir(), "vibepolaris-news-"));
  const first = ingestNewsBatch(payload(), { rootDir });
  assert.equal(first.written.length, 1);
  assert.equal(first.duplicates.length, 0);

  const second = ingestNewsBatch(payload(), { rootDir });
  assert.equal(second.written.length, 0);
  assert.equal(second.duplicates.length, 1);

  const draftPath = join(rootDir, "content", "zh", "news-drafts", "2026-10-01", "demo.json");
  const draft = JSON.parse(readFileSync(draftPath, "utf8"));
  assert.equal(draft.status, "needs-review");
  assert.equal(draft.runId, "test-run");
  assert.deepEqual(validateNewsStore(rootDir), { published: 0, drafts: 1, errors: [] });
});

test("canonical URL normalization deduplicates a batch", () => {
  const rootDir = mkdtempSync(join(tmpdir(), "vibepolaris-news-"));
  const result = ingestNewsBatch(payload([
    article("first"),
    article("second", "https://example.com/news?id=1&utm_medium=mail"),
  ]), { rootDir });
  assert.equal(result.written.length, 1);
  assert.equal(result.duplicates.length, 1);
});
