import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { z } from "zod";

const slug = z.string().trim().min(1).max(150).regex(/^[a-z0-9-]+$/);
const uniqueSlugs = z.array(slug).max(8).refine((values) => new Set(values).size === values.length, "关联 slug 不能重复");
const httpsUrl = z.string().url().refine((value) => value.startsWith("https://"), "链接必须使用 HTTPS");
const sourceHash = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const evidence = z.object({
  url: httpsUrl,
  claim: z.string().trim().min(1).max(500),
  excerpt: z.string().trim().min(1).max(2_000),
}).strict();
const hero = z.object({
  url: z.union([httpsUrl, z.string().regex(/^\\/(?!\\/)/)]),
  alt: z.string().trim().min(1).max(300),
  sourceUrl: z.union([httpsUrl, z.string().regex(/^\\/(?!\\/)/)]),
  license: z.string().trim().min(1).max(300),
  credit: z.string().trim().min(1).max(200).optional(),
}).strict();
const section = z.object({
  id: slug,
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(30_000),
  kind: z.enum(["narrative", "technical", "example", "comparison", "boundary", "aside"]).default("narrative"),
}).strict();
const explainer = z.object({
  variant: z.enum(["benchmark", "secure-memory", "agent-workflow"]),
  title: z.string().trim().min(1).max(200),
  question: z.string().trim().min(1).max(500),
  steps: z.array(z.object({
    label: z.string().trim().min(1).max(100),
    detail: z.string().trim().min(1).max(1_000),
    evidence: z.string().trim().min(1).max(300).optional(),
  }).strict()).min(2).max(8),
}).strict();
const modelReview = z.object({
  decision: z.enum(["publish", "hold"]),
  checkedAt: z.iso.datetime(),
  notes: z.string().trim().max(2_000).optional(),
}).strict();
const verification = z.object({
  status: z.enum(["verified", "needs-review", "unverified"]),
  checkedAt: z.iso.datetime(),
  method: z.enum(["dots", "source", "manual"]),
  notes: z.string().trim().max(2_000).optional(),
}).strict();

const articleBase = z.object({
  slug,
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().min(1).max(2_000),
  body: z.string().trim().min(1).max(100_000),
  eventDate: z.iso.date(),
  publishedAt: z.iso.date(),
  source: z.object({
    name: z.string().trim().min(1).max(200),
    url: httpsUrl,
  }).strict(),
  canonicalUrl: httpsUrl,
  sourceHash: sourceHash.optional(),
  relatedSlugs: uniqueSlugs.default([]),
  relatedArticleSlugs: uniqueSlugs.default([]),
  evidence: z.array(evidence).min(1).max(20),
  hero: hero.optional(),
  sections: z.array(section).min(2).max(12).optional(),
  explainer: explainer.optional(),
  relationSuggestions: z.array(z.object({
    kind: z.enum(["term", "article"]),
    slug,
    score: z.number().min(0).max(1),
    evidence: z.array(z.string().trim().min(1)).min(1).max(20),
    method: z.enum(["lexical", "embedding", "model", "manual"]),
    status: z.enum(["suggested", "confirmed", "rejected"]),
  }).strict()).max(100).default([]),
  modelReview: modelReview.optional(),
  verification: verification.optional(),
  riskLevel: z.enum(["routine", "major", "uncertain"]).default("uncertain"),
}).strict().superRefine((article, context) => {
  if (article.eventDate > article.publishedAt) {
    context.addIssue({ code: "custom", path: ["publishedAt"], message: "publishedAt 不能早于 eventDate" });
  }
  if (article.relatedArticleSlugs.includes(article.slug)) {
    context.addIssue({ code: "custom", path: ["relatedArticleSlugs"], message: "不能关联自己" });
  }
  if (article.hero && !article.hero.sourceUrl.startsWith("https://")) {
    context.addIssue({ code: "custom", path: ["hero", "sourceUrl"], message: "头图来源必须使用 HTTPS 或站内路径" });
  }
});

export const newsIngestRecordSchema = articleBase;
export const newsDraftSchema = articleBase.safeExtend({
  status: z.enum(["needs-review", "ready", "published", "rejected"]),
  runId: z.string().trim().min(1).max(200),
  receivedAt: z.iso.datetime(),
});
export const newsIngestBatchSchema = z.object({
  version: z.literal(1).default(1),
  runId: z.string().trim().min(1).max(200),
  generatedAt: z.iso.datetime(),
  articles: z.array(newsIngestRecordSchema).max(100),
}).strict();

export type NewsIngestBatch = z.infer<typeof newsIngestBatchSchema>;
export type NewsIngestRecord = z.infer<typeof newsIngestRecordSchema>;
export type NewsDraft = z.infer<typeof newsDraftSchema>;

export function canonicalNewsUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_/i.test(key) || /^(fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.pathname = url.pathname.replace(/\\/$/, "") || "/";
  return url.toString();
}

function digest(body: string) {
  return "sha256:" + createHash("sha256").update(body.trim().replace(/\\r\\n?/g, "\\n"), "utf8").digest("hex");
}

function normalizeBatch(payload: unknown): NewsIngestBatch {
  const parsed = newsIngestBatchSchema.parse(payload);
  return {
    ...parsed,
    articles: parsed.articles.map((article) => ({
      ...article,
      canonicalUrl: canonicalNewsUrl(article.canonicalUrl),
      sourceHash: article.sourceHash ?? digest(article.body),
    })),
  };
}

function jsonFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error("草稿目录不接受符号链接：" + path);
    if (entry.isDirectory()) return jsonFiles(path);
    return entry.isFile() && entry.name.endsWith(".json") ? [path] : [];
  }).sort();
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function contentPaths(rootDir = process.cwd()) {
  const root = resolve(rootDir);
  return {
    root,
    drafts: join(root, "content", "zh", "news-drafts"),
    published: join(root, "content", "zh", "news.json"),
  };
}

export function readNewsStore(rootDir = process.cwd()) {
  const paths = contentPaths(rootDir);
  const published = existsSync(paths.published) ? z.array(articleBase).parse(readJson(paths.published)) : [];
  const drafts = jsonFiles(paths.drafts).map((path) => ({ path, draft: newsDraftSchema.parse(readJson(path)) }));
  return { paths, published, drafts };
}

function existingKeys(store: ReturnType<typeof readNewsStore>) {
  const keys = new Map<string, string>();
  for (const article of store.published) {
    keys.set("slug:" + article.slug, article.slug);
    keys.set("url:" + canonicalNewsUrl(article.canonicalUrl), article.slug);
    if (article.sourceHash) keys.set("hash:" + article.sourceHash, article.slug);
  }
  for (const { draft } of store.drafts) {
    keys.set("slug:" + draft.slug, draft.slug);
    keys.set("url:" + canonicalNewsUrl(draft.canonicalUrl), draft.slug);
    if (draft.sourceHash) keys.set("hash:" + draft.sourceHash, draft.slug);
  }
  return keys;
}

function atomicJson(path: string, value: unknown) {
  const temporary = path + "." + process.pid + ".tmp";
  try {
    writeFileSync(temporary, JSON.stringify(value, null, 2) + "\\n", { flag: "wx" });
    renameSync(temporary, path);
  } finally {
    try { unlinkSync(temporary); } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") throw error;
    }
  }
}

export function ingestNewsBatch(payload: unknown, { rootDir = process.cwd() } = {}) {
  const batch = normalizeBatch(payload);
  const store = readNewsStore(rootDir);
  const paths = store.paths;
  const keys = existingKeys(store);
  const batchKeys = new Map<string, string>();
  const result = {
    runId: batch.runId,
    written: [] as Array<{ slug: string; path: string; status: string }>,
    duplicates: [] as Array<{ slug: string; existingSlug: string; reason: string }>,
  };

  for (const article of batch.articles) {
    const articleKeys = [
      ["slug:" + article.slug, article.slug],
      ["url:" + canonicalNewsUrl(article.canonicalUrl), article.slug],
      ["hash:" + (article.sourceHash ?? digest(article.body)), article.slug],
    ] as const;
    const duplicate = articleKeys.map(([key]) => keys.get(key) ?? batchKeys.get(key)).find(Boolean);
    if (duplicate) {
      result.duplicates.push({
        slug: article.slug,
        existingSlug: duplicate,
        reason: duplicate === article.slug ? "slug" : "canonicalUrl_or_sourceHash",
      });
      continue;
    }

    const receivedAt = new Date().toISOString();
    const draft = {
      ...article,
      sourceHash: article.sourceHash ?? digest(article.body),
      status: "needs-review" as const,
      runId: batch.runId,
      receivedAt,
    };
    const directory = join(paths.drafts, article.eventDate);
    const path = join(directory, article.slug + ".json");
    mkdirSync(directory, { recursive: true });
    try {
      writeFileSync(path, JSON.stringify(draft, null, 2) + "\\n", { flag: "wx" });
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "EEXIST") {
        result.duplicates.push({ slug: article.slug, existingSlug: article.slug, reason: "draft_path" });
        continue;
      }
      throw error;
    }
    for (const [key] of articleKeys) batchKeys.set(key, article.slug);
    result.written.push({ slug: article.slug, path: relative(paths.root, path), status: draft.status });
  }
  return result;
}

export function validateNewsStore(rootDir = process.cwd()) {
  const store = readNewsStore(rootDir);
  const errors: string[] = [];
  const seen = new Map<string, string>();
  for (const article of store.published) {
    for (const key of ["slug:" + article.slug, "url:" + canonicalNewsUrl(article.canonicalUrl), ...(article.sourceHash ? ["hash:" + article.sourceHash] : [])]) {
      if (seen.has(key) && seen.get(key) !== article.slug) errors.push("公开文章重复：" + key);
      seen.set(key, article.slug);
    }
  }
  for (const { path, draft } of store.drafts) {
    const expected = join(draft.eventDate, draft.slug + ".json");
    if (relative(store.paths.drafts, path) !== expected) errors.push("草稿路径不匹配：" + relative(store.paths.drafts, path));
    if (draft.status !== "rejected") {
      for (const key of ["slug:" + draft.slug, "url:" + canonicalNewsUrl(draft.canonicalUrl), "hash:" + (draft.sourceHash ?? digest(draft.body))]) {
        if (seen.has(key) && seen.get(key) !== draft.slug) errors.push("新闻去重冲突：" + key);
        seen.set(key, draft.slug);
      }
    }
  }
  return { published: store.published.length, drafts: store.drafts.length, errors };
}

export function publishEligibleNews({ rootDir = process.cwd(), approve = false } = {}) {
  const store = readNewsStore(rootDir);
  const eligible = store.drafts.filter(({ draft }) =>
    ["needs-review", "ready"].includes(draft.status)
    && draft.riskLevel === "routine"
    && draft.verification?.status === "verified"
    && (draft.modelReview?.decision ?? "publish") === "publish",
  );
  const output = { mode: approve ? "approved" : "dry-run", slugs: eligible.map(({ draft }) => draft.slug), publishedCount: store.published.length };
  if (!approve || !eligible.length) return output;
  let branch = "";
  try { branch = execFileSync("git", ["branch", "--show-current"], { cwd: store.paths.root, encoding: "utf8" }).trim(); } catch {}
  if (!branch || branch === "main" || branch === "dev") throw new Error("请在 feature 或 news-auto 分支发布，不能在 main、dev 或 detached HEAD 写入");
  const published = [...store.published];
  const slugs = new Set(published.map((article) => article.slug));
  for (const { draft } of eligible) {
    if (!slugs.has(draft.slug)) {
      const { status, runId, receivedAt, ...article } = draft;
      published.push(article);
      slugs.add(draft.slug);
    }
  }
  mkdirSync(join(store.paths.root, "content", "zh"), { recursive: true });
  atomicJson(store.paths.published, published.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug)));
  for (const { path, draft } of eligible) atomicJson(path, { ...draft, status: "published" as const, promotedAt: new Date().toISOString() });
  return { ...output, publishedCount: published.length };
}
