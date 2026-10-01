import { z } from "zod";

const slug = z.string().max(150).regex(/^[a-z0-9-]+$/);
const slugs = z.array(slug).max(8).refine(values => new Set(values).size === values.length, "关联 slug 不能重复");
const sourceHash = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const httpsUrl = z.url().refine(value => value.startsWith("https://"), "真实新闻来源必须使用 HTTPS");
const siteUrl = z.string().regex(/^\/(?!\/)/);
const assetUrl = z.union([httpsUrl, siteUrl]);
const evidenceSchema = z.object({
  url: httpsUrl,
  claim: z.string().trim().min(1).max(500),
  excerpt: z.string().trim().min(1).max(2_000),
}).strict();
const heroSchema = z.object({
  url: assetUrl,
  alt: z.string().trim().min(1).max(300),
  sourceUrl: assetUrl,
  license: z.string().trim().min(1).max(300),
  credit: z.string().trim().min(1).max(200).optional(),
}).strict();
const sectionSchema = z.object({
  id: slug,
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(30_000),
  kind: z.enum(["narrative", "technical", "example", "comparison", "boundary", "aside"]).default("narrative"),
}).strict();
const sectionsSchema = z.array(sectionSchema).min(2).max(12);
const explainerStepSchema = z.object({
  label: z.string().trim().min(1).max(100),
  detail: z.string().trim().min(1).max(1_000),
  evidence: z.string().trim().min(1).max(300).optional(),
}).strict();
const explainerSchema = z.object({
  variant: z.enum(["benchmark", "secure-memory", "agent-workflow"]),
  title: z.string().trim().min(1).max(200),
  question: z.string().trim().min(1).max(500),
  steps: z.array(explainerStepSchema).min(2).max(8),
}).strict();
const modelReviewSchema = z.object({
  decision: z.enum(["publish", "hold"]),
  checkedAt: z.iso.datetime(),
  notes: z.string().trim().max(2_000).optional(),
}).strict();
const verificationSchema = z.object({
  status: z.enum(["verified", "needs-review", "unverified"]),
  checkedAt: z.iso.datetime(),
  method: z.enum(["dots", "source", "manual"]),
  notes: z.string().trim().max(2_000).optional(),
}).strict();

export const newsArticleSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().min(1).max(2000),
  body: z.string().trim().min(1).max(100_000),
  publishedAt: z.iso.date(),
  eventDate: z.iso.date(),
  isExample: z.boolean(),
  hero: heroSchema.optional(),
  sections: sectionsSchema.optional(),
  explainer: explainerSchema.optional(),
  source: z.object({ name: z.string().trim().min(1).max(200), url: z.union([httpsUrl, siteUrl]) }).strict(),
  relatedSlugs: slugs.refine(values => values.length > 0, "发布时至少确认一个关联词条"),
  relatedArticleSlugs: slugs.default([]),
  sources: z.array(evidenceSchema).max(20).default([]),
  canonicalUrl: httpsUrl.optional(),
  sourceHash: sourceHash.optional(),
}).strict().superRefine((article, context) => {
  if (article.isExample) return;
  if (!article.source.url.startsWith("https://")) context.addIssue({ code: "custom", path: ["source", "url"], message: "真实新闻需要 HTTPS 来源" });
  if (!article.canonicalUrl) context.addIssue({ code: "custom", path: ["canonicalUrl"], message: "真实新闻必须记录 canonicalUrl" });
  if (!article.sourceHash) context.addIssue({ code: "custom", path: ["sourceHash"], message: "真实新闻必须记录 sourceHash" });
  if (!article.hero) context.addIssue({ code: "custom", path: ["hero"], message: "真实新闻必须记录头图来源与许可" });
  if (!article.sections) context.addIssue({ code: "custom", path: ["sections"], message: "真实新闻必须包含可自由编排的详细段落" });
  if (!article.explainer) context.addIssue({ code: "custom", path: ["explainer"], message: "真实新闻必须提供便于理解的交互讲解" });
  if (!article.sources.length) context.addIssue({ code: "custom", path: ["sources"], message: "真实新闻至少需要一条来源引用" });
});

export const newsDraftSchema = newsArticleSchema.safeExtend({
  hero: heroSchema,
  sections: sectionsSchema,
  explainer: explainerSchema,
  sources: z.array(evidenceSchema).min(1).max(20),
  relatedSlugs: slugs,
  canonicalUrl: httpsUrl,
  sourceHash,
  status: z.enum(["discovered", "draft", "ready", "needs-review", "published", "rejected", "archived"]),
  discoveredAt: z.iso.datetime(),
  relationSuggestions: z.array(z.object({
    kind: z.enum(["term", "article"]),
    slug,
    score: z.number().min(0).max(1),
    evidence: z.array(z.string().trim().min(1)).min(1).max(20),
    method: z.enum(["lexical", "embedding", "model", "manual"]),
    status: z.enum(["suggested", "confirmed", "rejected"]),
  }).strict()).max(100),
  evidence: z.array(evidenceSchema).max(20).default([]),
  verification: verificationSchema.optional(),
  riskLevel: z.enum(["routine", "major", "uncertain"]).default("uncertain"),
  publishDecision: z.enum(["auto", "review", "rejected"]).default("review"),
  modelReview: modelReviewSchema,
  mechanicalErrors: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  runId: z.string().trim().min(1).max(200).optional(),
  fingerprint: z.string().trim().min(1).max(200).optional(),
  lastSeenAt: z.iso.datetime().optional(),
  promotedAt: z.iso.datetime().optional(),
});

export const newsIngestRecordSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().min(1).max(2_000),
  body: z.string().trim().min(1).max(100_000),
  publishedAt: z.iso.date(),
  eventDate: z.iso.date(),
  hero: heroSchema,
  sections: sectionsSchema,
  explainer: explainerSchema,
  source: z.object({ name: z.string().trim().min(1).max(200), url: httpsUrl }).strict(),
  canonicalUrl: httpsUrl.optional(),
  sourceHash: sourceHash.optional(),
  relatedSlugs: slugs.default([]),
  relatedArticleSlugs: slugs.default([]),
  relationSuggestions: newsDraftSchema.shape.relationSuggestions.default([]),
  evidence: z.array(evidenceSchema).max(20).default([]),
  modelReview: modelReviewSchema.optional(),
  verification: verificationSchema.optional(),
  riskLevel: z.enum(["routine", "major", "uncertain"]).default("uncertain"),
  isExample: z.literal(false).default(false),
}).strict();

export const newsIngestBatchSchema = z.object({
  version: z.literal(1).default(1),
  runId: z.string().trim().min(1).max(200),
  generatedAt: z.iso.datetime(),
  articles: z.array(newsIngestRecordSchema).max(100),
}).strict();

export type NewsArticle = z.infer<typeof newsArticleSchema>;
export type NewsDraft = z.infer<typeof newsDraftSchema>;

export function canonicalNewsUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_/i.test(key) || /^(fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.pathname = url.pathname.replace(/\/$/, "") || "/";
  return url.toString();
}

export function newsRelationErrors(article: Pick<NewsArticle, "slug" | "relatedSlugs" | "relatedArticleSlugs">, terms: Set<string>, articles: Set<string>) {
  const errors: string[] = [];
  for (const related of article.relatedSlugs) if (!terms.has(related)) errors.push(`关联了未公开词条：${related}`);
  for (const related of article.relatedArticleSlugs) {
    if (related === article.slug) errors.push("不能关联自己");
    else if (!articles.has(related)) errors.push(`关联了未发布文章：${related}`);
  }
  return errors;
}
