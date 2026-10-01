import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import test from "node:test";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = new URL("../", import.meta.url).pathname;

function fixture() {
  const repository = mkdtempSync(join(tmpdir(), "vbp-news-ingest-"));
  mkdirSync(join(repository, "content/zh/news-drafts"), { recursive: true });
  execFileSync("git", ["init", "--quiet", "--initial-branch=feat/news-ingest"], { cwd: repository });
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
  return repository;
}

function run(script, args, repository) {
  return execFileSync(process.execPath, ["--experimental-strip-types", join(root, script), ...args], {
    cwd: repository,
    env: { ...process.env, NEWS_REPOSITORY: repository },
    encoding: "utf8",
  });
}

test("模型首轮自判后按机械契约直发，幂等去重并保留模型暂缓项", () => {
  const repository = fixture();
  try {
    const payloadPath = join(repository, "batch.json");
    writeFileSync(payloadPath, JSON.stringify({
      version: 1,
      runId: "dots-test-run",
      generatedAt: "2026-10-01T12:00:00Z",
      articles: [
        {
          slug: "verified-update",
          title: "已核对的更新",
          summary: "事实核对后的摘要",
          body: "事实核对后的正文",
          publishedAt: "2026-10-01",
          hero: { url: "/images/news/test.svg", alt: "测试头图", sourceUrl: "/images/news/test.svg", license: "VibePolaris 自制插图" },
          sections: [{ id: "happened", title: "发生了什么", body: "事件正文" }, { id: "read", title: "怎样理解", body: "解释正文", kind: "aside" }],
          explainer: { variant: "benchmark", title: "怎样看这条消息", question: "把数字放回任务里。", steps: [{ label: "任务", detail: "先固定任务。" }, { label: "结果", detail: "再看结果。" }] },
          source: { name: "Example Source", url: "https://example.com/verified" },
          canonicalUrl: "https://example.com/verified?utm_source=test",
          relatedSlugs: ["grounding"],
          relationSuggestions: [],
          evidence: [{ url: "https://example.com/verified", claim: "可核验事实", excerpt: "来源摘录" }],
          verification: { status: "verified", checkedAt: "2026-10-01T12:00:00Z", method: "dots" },
          riskLevel: "routine",
          modelReview: { decision: "publish", checkedAt: "2026-10-01T12:00:00Z", notes: "模型首轮自判" },
        },
        {
          slug: "major-update",
          title: "重大消息候选",
          summary: "需要人工复核",
          body: "不能自动发布",
          publishedAt: "2026-10-01",
          hero: { url: "/images/news/test.svg", alt: "测试头图", sourceUrl: "/images/news/test.svg", license: "VibePolaris 自制插图" },
          sections: [{ id: "happened", title: "发生了什么", body: "事件正文" }, { id: "boundary", title: "边界在哪里", body: "边界正文", kind: "boundary" }],
          explainer: { variant: "agent-workflow", title: "怎样读", question: "先看流程。", steps: [{ label: "目标", detail: "先给目标。" }, { label: "动作", detail: "再看动作。" }] },
          source: { name: "Example Source", url: "https://example.com/major" },
          relatedSlugs: ["grounding"],
          relationSuggestions: [],
          evidence: [{ url: "https://example.com/major", claim: "待核实事实", excerpt: "来源摘录" }],
          verification: { status: "verified", checkedAt: "2026-10-01T12:00:00Z", method: "dots" },
          riskLevel: "major",
          modelReview: { decision: "hold", checkedAt: "2026-10-01T12:00:00Z", notes: "模型首轮自判暂缓" },
        },
      ],
    }));

    const ingest = JSON.parse(run("scripts/news-ingest.mjs", [payloadPath], repository));
    assert.equal(ingest.written.length, 2);
    assert.deepEqual(ingest.held.map(item => item.slug), ["major-update"]);

    const draftDirectory = join(repository, "content/zh/news-drafts/2026-10-01");
    const verified = JSON.parse(readFileSync(join(draftDirectory, "verified-update.json"), "utf8"));
    const major = JSON.parse(readFileSync(join(draftDirectory, "major-update.json"), "utf8"));
    assert.equal(verified.publishDecision, "auto");
    assert.equal(verified.status, "ready");
    assert.deepEqual(verified.mechanicalErrors, []);
    assert.equal(major.publishDecision, "review");
    assert.equal(major.modelReview.decision, "hold");
    assert.deepEqual(major.mechanicalErrors, []);

    run("scripts/news-auto-publish.mjs", ["--approve"], repository);
    const published = JSON.parse(readFileSync(join(repository, "content/zh/news.json"), "utf8"));
    assert.ok(published.some(article => article.slug === "verified-update"));
    assert.ok(!published.some(article => article.slug === "major-update"));
    assert.equal(JSON.parse(readFileSync(join(draftDirectory, "verified-update.json"), "utf8")).status, "published");
    assert.equal(JSON.parse(readFileSync(join(draftDirectory, "major-update.json"), "utf8")).status, "needs-review");

    const duplicateRun = JSON.parse(run("scripts/news-ingest.mjs", [payloadPath], repository));
    assert.equal(duplicateRun.written.length, 0);
    assert.equal(duplicateRun.duplicates.length, 2);
    assert.deepEqual(readdirSync(draftDirectory).sort(), ["major-update.json", "verified-update.json"]);
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});
