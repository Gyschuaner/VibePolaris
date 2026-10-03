import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { newsIngestBatchSchema, canonicalNewsUrl } from "../lib/news-schema.ts";
import { contentPaths, loadNewsContent } from "./news-contract.mjs";

const repository = process.env.NEWS_REPOSITORY
  ? resolve(process.env.NEWS_REPOSITORY)
  : resolve(import.meta.dirname, "..");

function readPayload(path) {
  const text = path === "-" ? readFileSync(0, "utf8") : readFileSync(resolve(path), "utf8");
  return newsIngestBatchSchema.parse(JSON.parse(text));
}

function sourceDigest(body) {
  const normalized = body.trim().replace(/\r\n?/g, "\n");
  return `sha256:${createHash("sha256").update(normalized, "utf8").digest("hex")}`;
}

function reviewReasons(article) {
  const reasons = [];
  if (!article.verification || article.verification.status !== "verified") reasons.push("证据核对未完成");
  if (!article.evidence.length) reasons.push("缺少可复核证据");
  if (article.riskLevel !== "routine") reasons.push(article.riskLevel === "major" ? "重大消息必须人工确认" : "风险等级不确定");
  if (!article.relatedSlugs.length) reasons.push("尚未确认关联词条");
  if (article.relationSuggestions.some(suggestion => suggestion.status !== "confirmed")) reasons.push("存在未确认的关系建议");
  return reasons;
}

function draftRecord(article, batch, decision, reasons) {
  const discoveredAt = batch.generatedAt;
  const canonicalUrl = canonicalNewsUrl(article.canonicalUrl ?? article.source.url);
  return {
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    body: article.body,
    publishedAt: article.publishedAt,
    isExample: false,
    source: article.source,
    canonicalUrl,
    sourceHash: article.sourceHash ?? sourceDigest(article.body),
    status: "needs-review",
    discoveredAt,
    relatedSlugs: article.relatedSlugs,
    relationSuggestions: article.relationSuggestions,
    relatedArticleSlugs: article.relatedArticleSlugs,
    evidence: article.evidence,
    verification: article.verification,
    riskLevel: article.riskLevel,
    publishDecision: decision,
    runId: batch.runId,
    reviewReasons: reasons,
  };
}

export function ingestNewsBatch(payload, { repository: targetRepository = repository } = {}) {
  const batch = newsIngestBatchSchema.parse(payload);
  const content = loadNewsContent(targetRepository);
  const paths = contentPaths(targetRepository);
  const existing = new Map();
  for (const article of content.articles) {
    if (!article.isExample) {
      existing.set(`url:${canonicalNewsUrl(article.canonicalUrl ?? article.source.url)}`, article.slug);
      if (article.sourceHash) existing.set(`hash:${article.sourceHash}`, article.slug);
    }
  }
  for (const { draft } of content.drafts) {
    existing.set(`url:${canonicalNewsUrl(draft.canonicalUrl)}`, draft.slug);
    existing.set(`hash:${draft.sourceHash}`, draft.slug);
  }

  const result = { runId: batch.runId, written: [], duplicates: [], review: [], rejected: [] };
  const batchKeys = new Set();
  for (const article of batch.articles) {
    const canonicalUrl = canonicalNewsUrl(article.canonicalUrl ?? article.source.url);
    const hash = article.sourceHash ?? sourceDigest(article.body);
    const duplicate = existing.get(`url:${canonicalUrl}`) ?? existing.get(`hash:${hash}`);
    if (duplicate) {
      result.duplicates.push({ slug: article.slug, existingSlug: duplicate });
      continue;
    }
    if (batchKeys.has(canonicalUrl) || batchKeys.has(hash)) {
      result.duplicates.push({ slug: article.slug, existingSlug: "同批次" });
      continue;
    }
    batchKeys.add(canonicalUrl); batchKeys.add(hash);
    const reasons = reviewReasons(article);
    const decision = reasons.length ? "review" : "auto";
    const draft = draftRecord(article, batch, decision, reasons);
    const path = join(paths.drafts, discoveredDate(batch.generatedAt), `${draft.slug}.json`);
    if (existsSync(path)) {
      result.duplicates.push({ slug: article.slug, existingSlug: article.slug });
      continue;
    }
    mkdirSync(join(paths.drafts, discoveredDate(batch.generatedAt)), { recursive: true });
    writeFileSync(path, `${JSON.stringify(draft, null, 2)}\n`, { flag: "wx" });
    result.written.push({ slug: draft.slug, status: draft.status, publishDecision: decision, path });
    if (reasons.length) result.review.push({ slug: draft.slug, reasons });
  }
  return result;
}

function discoveredDate(value) {
  return value.slice(0, 10);
}

try {
  const path = process.argv[2];
  if (!path || process.argv.length > 3) throw new Error("用法：node scripts/news-ingest.mjs <Dots JSON 路径|->");
  const result = ingestNewsBatch(readPayload(path));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`News 交接失败：${error.message}\n`);
  process.exitCode = 1;
}
