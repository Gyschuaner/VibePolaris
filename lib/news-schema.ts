import { z } from "zod";

const slug = z.string().max(150).regex(/^[a-z0-9-]+$/);
const slugs = z.array(slug).max(8).refine(values => new Set(values).size === values.length, "关联 slug 不能重复");
const sourceHash = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const httpsUrl = z.url().refine(value => value.startsWith("https://"), "真实新闻来源必须使用 HTTPS");
const siteUrl = z.string().regex(/^\/(?!\/)/);

export const newsArticleSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().min(1).max(2000),
  body: z.string().trim().min(1).max(100_000),
  publishedAt: z.iso.date(),
  isExample: z.boolean(),
  source: z.object({ name: z.string().trim().min(1).max(200), url: z.union([httpsUrl, siteUrl]) }).strict(),
  relatedSlugs: slugs.refine(values => values.length > 0, "发布时至少确认一个关联词条"),
  relatedArticleSlugs: slugs.default([]),
  canonicalUrl: httpsUrl.optional(),
  sourceHash: sourceHash.optional(),
}).strict().refine(article => article.isExample || article.source.url.startsWith("https://"), "真实新闻需要 HTTPS 来源");

export const newsDraftSchema = newsArticleSchema.safeExtend({
  relatedSlugs: slugs,
  canonicalUrl: httpsUrl,
  sourceHash,
  status: z.enum(["discovered", "draft", "needs-review", "published", "rejected", "archived"]),
  discoveredAt: z.iso.datetime(),
  relationSuggestions: z.array(z.object({
    kind: z.enum(["term", "article"]),
    slug,
    score: z.number().min(0).max(1),
    evidence: z.array(z.string().trim().min(1)).min(1).max(20),
    method: z.enum(["lexical", "embedding", "model", "manual"]),
    status: z.enum(["suggested", "confirmed", "rejected"]),
  }).strict()).max(100),
  runId: z.string().trim().min(1).max(200).optional(),
  fingerprint: z.string().trim().min(1).max(200).optional(),
  lastSeenAt: z.iso.datetime().optional(),
  promotedAt: z.iso.datetime().optional(),
});

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
