import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalNewsUrl, newsArticleSchema, newsDraftSchema, newsRelationErrors } from "../lib/news-schema.ts";

export const root = resolve(import.meta.dirname, "..");
const activeStatuses = new Set(["discovered", "draft", "needs-review"]);

export function contentPaths(repository = root) {
  return {
    repository,
    drafts: resolve(repository, "content/zh/news-drafts"),
    published: resolve(repository, "content/zh/news.json"),
    terms: resolve(repository, "content/zh/published-terms.json"),
  };
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function draftFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`草稿目录不接受符号链接：${path}`);
      if (entry.isDirectory()) return draftFiles(path);
      return entry.isFile() && entry.name.endsWith(".json") ? [path] : [];
    }).sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export function publishedNewsFromDraft(draft) {
  const { slug, title, summary, body, publishedAt, isExample, source, relatedSlugs, relatedArticleSlugs, canonicalUrl, sourceHash } = draft;
  return newsArticleSchema.parse({ slug, title, summary, body, publishedAt, isExample, source, relatedSlugs, relatedArticleSlugs, canonicalUrl, sourceHash });
}

export function publishedNewsErrors(articles, terms) {
  const errors = [];
  const slugs = new Set(articles.map(article => article.slug));
  const seen = new Map();
  for (const article of articles) {
    errors.push(...newsRelationErrors(article, terms, slugs).map(message => `${article.slug}：${message}`));
    const keys = [`slug:${article.slug}`];
    if (!article.isExample) {
      keys.push(`url:${canonicalNewsUrl(article.canonicalUrl ?? article.source.url)}`);
      if (article.sourceHash) keys.push(`hash:${article.sourceHash}`);
    }
    for (const key of keys) {
      if (seen.has(key)) errors.push(`${article.slug} 与 ${seen.get(key)} 重复：${key}`);
      else seen.set(key, article.slug);
    }
  }
  return errors;
}

export function loadNewsContent(repository = root) {
  const paths = contentPaths(repository);
  const articles = z.array(newsArticleSchema).min(1).parse(readJson(paths.published));
  const terms = new Set(z.array(z.string()).parse(readJson(paths.terms)));
  const drafts = draftFiles(paths.drafts).map(path => ({ path, draft: newsDraftSchema.parse(readJson(path)) }));
  const errors = publishedNewsErrors(articles, terms);
  const articleSlugs = new Set([...articles.map(article => article.slug), ...drafts.filter(({ draft }) => activeStatuses.has(draft.status)).map(({ draft }) => draft.slug)]);
  const seen = new Map(articles.filter(article => !article.isExample).flatMap(article => [
    [`url:${canonicalNewsUrl(article.canonicalUrl ?? article.source.url)}`, article.slug],
    ...(article.sourceHash ? [[`hash:${article.sourceHash}`, article.slug]] : []),
  ]));
  const draftSlugs = new Set();

  for (const { path, draft } of drafts) {
    const name = relative(paths.drafts, path);
    const expected = join(draft.discoveredAt.slice(0, 10), `${draft.slug}.json`);
    if (name !== expected) errors.push(`${name}：路径应为 ${expected}`);
    if (draftSlugs.has(draft.slug)) errors.push(`${name}：草稿 slug 重复`);
    draftSlugs.add(draft.slug);
    if (draft.status === "published") {
      const previous = articles.find(article => article.slug === draft.slug);
      // Review metadata lives only in the retained draft, never in the public article.
      if (!previous || !isDeepStrictEqual(previous, publishedNewsFromDraft(draft))) errors.push(`${name}：published 草稿与已发布文章不一致`);
    }
    if (!activeStatuses.has(draft.status)) continue;
    errors.push(...newsRelationErrors(draft, terms, articleSlugs).map(message => `${name}：${message}`));
    for (const suggestion of draft.relationSuggestions) {
      const allowed = suggestion.kind === "term" ? terms : articleSlugs;
      if (!allowed.has(suggestion.slug)) errors.push(`${name}：建议关系目标不存在：${suggestion.slug}`);
      if (suggestion.kind === "article" && suggestion.slug === draft.slug) errors.push(`${name}：不能建议关联自己`);
      const confirmed = (suggestion.kind === "term" ? draft.relatedSlugs : draft.relatedArticleSlugs).includes(suggestion.slug);
      if ((suggestion.status === "confirmed" && !confirmed) || (suggestion.status !== "confirmed" && confirmed)) errors.push(`${name}：关系建议状态与已确认关系不一致：${suggestion.slug}`);
    }
    if (draft.isExample) continue;
    for (const key of [`url:${canonicalNewsUrl(draft.canonicalUrl)}`, `hash:${draft.sourceHash}`]) {
      const previous = seen.get(key);
      if (previous && previous !== draft.slug) errors.push(`${name} 与 ${previous} 重复：${key}`);
      else seen.set(key, draft.slug);
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return { paths, articles, terms, drafts };
}

function atomicJson(path, value) {
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
    renameSync(temporary, path);
  } finally {
    try { unlinkSync(temporary); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
}

export function publishNewsDrafts(files, { approve = false, repository = root } = {}) {
  const content = loadNewsContent(repository);
  const selected = files.map(file => {
    const path = realpathSync(resolve(repository, file));
    const local = relative(realpathSync(content.paths.drafts), path);
    if (local.startsWith(`..${sep}`) || local === ".." || isAbsolute(local)) throw new Error("发布入口只接受 news-drafts 目录中的文件");
    const entry = content.drafts.find(item => realpathSync(item.path) === path);
    if (!entry) throw new Error(`找不到已校验的 JSON 草稿：${basename(path)}`);
    if (!["needs-review", "published"].includes(entry.draft.status)) throw new Error(`${entry.draft.slug}：只有 needs-review 草稿可以提升为已发布内容`);
    return entry;
  });
  if (!selected.length) throw new Error("请提供至少一个草稿 JSON 路径");
  if (new Set(selected.map(entry => entry.draft.slug)).size !== selected.length) throw new Error("同一个草稿不能选择两次");
  const articles = [...content.articles];
  for (const { draft } of selected) {
    const article = publishedNewsFromDraft(draft);
    const previous = articles.find(item => item.slug === article.slug);
    if (previous && !isDeepStrictEqual(previous, article)) throw new Error(`${article.slug} 已发布且内容不同；请另行审核修订，发布入口不会覆盖旧文章`);
    if (draft.status === "published" && !previous) throw new Error(`${article.slug}：published 草稿缺少已发布记录`);
    if (!previous) articles.push(article);
  }
  const errors = publishedNewsErrors(articles, content.terms);
  if (errors.length) throw new Error(errors.join("\n"));
  const output = { mode: approve ? "approved" : "dry-run", slugs: selected.map(entry => entry.draft.slug), publishedCount: articles.length };
  if (!approve) return output;
  const branch = execFileSync("git", ["branch", "--show-current"], { cwd: repository, encoding: "utf8" }).trim();
  if (!branch || branch === "main" || branch === "dev") throw new Error("请在 feature 分支提升草稿，不能在 main、dev 或 detached HEAD 中写入");
  if (articles.length !== content.articles.length) atomicJson(content.paths.published, articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug)));
  for (const { path, draft } of selected) {
    if (draft.status !== "published") atomicJson(path, { ...draft, status: "published", promotedAt: new Date().toISOString() });
  }
  return output;
}
