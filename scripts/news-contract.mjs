import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalNewsUrl, newsArticleSchema, newsDailyRunSchema, newsDraftSchema, newsRelationErrors } from "../lib/news-schema.ts";

export const root = resolve(import.meta.dirname, "..");
const activeStatuses = new Set(["discovered", "draft", "ready", "needs-review"]);

export function contentPaths(repository = root) {
  return {
    repository,
    drafts: resolve(repository, "content/zh/news-drafts"),
    daily: resolve(repository, "content/zh/news-daily"),
    published: resolve(repository, "content/zh/news.json"),
    terms: resolve(repository, "content/zh/published-terms.json"),
  };
}

function dailyRunFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`按天记录目录不接受符号链接：${path}`);
      return entry.isFile() && entry.name.endsWith(".json") ? [path] : [];
    }).sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
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
  const { slug, title, summary, body, eventDate, publishedAt, isExample, hero, sections, explainer, source, relatedSlugs, relatedArticleSlugs, sources, canonicalUrl, sourceHash } = draft;
  return newsArticleSchema.parse({ slug, title, summary, body, eventDate, publishedAt, isExample, hero, sections, explainer, source, relatedSlugs, relatedArticleSlugs, sources, canonicalUrl, sourceHash });
}

export function newsMechanicalErrors(article) {
  const errors = [];
  if (!article.body?.trim()) errors.push("正文不能为空");
  if (!article.canonicalUrl) errors.push("缺少 canonicalUrl");
  if (!article.sourceHash) errors.push("缺少 sourceHash");
  if (!article.hero?.url || !article.hero?.sourceUrl || !article.hero?.license) errors.push("头图缺少图片来源或许可字段");
  if (!Array.isArray(article.sections) || article.sections.length < 2 || article.sections.some(section => !section?.id?.trim() || !section?.title?.trim() || !section?.body?.trim())) errors.push("文章详细段落不能为空");
  if (!article.explainer || article.explainer.steps.length < 2 || article.explainer.steps.some(step => !step?.label?.trim() || !step?.detail?.trim())) errors.push("文章讲解动画内容不能为空");
  if (!article.sources?.length) errors.push("缺少来源引用");
  if (!article.relatedSlugs?.length) errors.push("缺少站内词条关联");
  for (const [label, value] of [
    ["source.url", article.source?.url],
    ["canonicalUrl", article.canonicalUrl],
    ["hero.url", article.hero?.url],
    ["hero.sourceUrl", article.hero?.sourceUrl],
    ...((article.sources ?? []).map((source, index) => [`sources[${index}].url`, source.url])),
  ]) {
    if (!value) continue;
    try {
      if (value.startsWith("/")) continue;
      const url = new URL(value);
      if (url.protocol !== "https:") errors.push(`${label} 必须使用 HTTPS 或站内路径`);
    } catch {
      errors.push(`${label} 不是可用链接`);
    }
  }
  return errors;
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

export function dailyRunErrors(runs, { articles = [], terms = new Set() } = {}) {
  const errors = [];
  const articleBySlug = new Map(articles.map(article => [article.slug, article]));
  for (const { path, run } of runs) {
    const name = basename(path);
    if (name !== `${run.eventDate}.json`) errors.push(`${name}：文件名应与 eventDate 一致`);
    if (run.search.candidateCount !== run.candidates.length) errors.push(`${name}：candidateCount 与候选数量不一致`);
    const primaryCount = run.candidates.filter(candidate => run.search.sourcePolicy.includes(candidate.sourceType)).length;
    if (run.search.primaryCandidateCount !== primaryCount) errors.push(`${name}：primaryCandidateCount 与来源政策不一致`);
    const duplicateCount = run.candidates.filter(candidate => candidate.decision === "duplicate").length;
    if (run.search.deduplicatedCount !== duplicateCount) errors.push(`${name}：deduplicatedCount 与 duplicate 候选数量不一致`);
    const selected = run.candidates.filter(candidate => candidate.decision === "selected").map(candidate => candidate.slug).sort();
    if (JSON.stringify(selected) !== JSON.stringify([...run.selectedSlugs].sort())) errors.push(`${name}：selectedSlugs 与候选决策不一致`);
    if (run.gap === null && !selected.length) errors.push(`${name}：没有选中事件时必须记录空档日原因`);
    if (run.gap && selected.length) errors.push(`${name}：有选中事件时不能标记为空档日`);
    const candidateSlugs = new Set();
    for (const candidate of run.candidates) {
      if (candidateSlugs.has(candidate.slug)) errors.push(`${name}：候选 slug 重复：${candidate.slug}`);
      candidateSlugs.add(candidate.slug);
      for (const related of candidate.relatedSlugs) if (!terms.has(related)) errors.push(`${name}：候选关联了未公开词条：${related}`);
      const article = articleBySlug.get(candidate.slug);
      if (article && (article.eventDate !== candidate.eventDate || article.publishedAt !== candidate.publishedAt)) {
        errors.push(`${name}：${candidate.slug} 的候选日期与文章日期不一致`);
      }
    }
  }
  const seen = new Map();
  for (const { path, run } of runs) {
    for (const candidate of run.candidates) {
      const keys = [`url:${canonicalNewsUrl(candidate.canonicalUrl)}`, `hash:${candidate.sourceHash}`];
      for (const key of keys) {
        const previous = seen.get(key);
        if (previous && candidate.decision !== "duplicate") errors.push(`${basename(path)} 与 ${previous} 重复：${key}`);
        else if (!previous) seen.set(key, `${basename(path)}:${candidate.slug}`);
      }
    }
  }
  return errors;
}

export function loadNewsContent(repository = root) {
  const paths = contentPaths(repository);
  const articles = z.array(newsArticleSchema).min(1).parse(readJson(paths.published));
  const terms = new Set(z.array(z.string()).parse(readJson(paths.terms)));
  const drafts = draftFiles(paths.drafts).map(path => ({ path, draft: newsDraftSchema.parse(readJson(path)) }));
  const dailyRuns = dailyRunFiles(paths.daily).map(path => ({ path, run: newsDailyRunSchema.parse(readJson(path)) }));
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
  errors.push(...dailyRunErrors(dailyRuns, { articles, terms }));
  if (errors.length) throw new Error(errors.join("\n"));
  return { paths, articles, terms, drafts, dailyRuns };
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
    if (!["ready", "needs-review", "published"].includes(entry.draft.status)) throw new Error(`${entry.draft.slug}：只有 ready 或 needs-review 草稿可以提升为已发布内容`);
    return entry;
  });
  if (!selected.length) throw new Error("请提供至少一个草稿 JSON 路径");
  if (new Set(selected.map(entry => entry.draft.slug)).size !== selected.length) throw new Error("同一个草稿不能选择两次");
  const articles = [...content.articles];
  for (const { draft } of selected) {
    const article = publishedNewsFromDraft(draft);
    const mechanicalErrors = newsMechanicalErrors(article);
    if (mechanicalErrors.length) throw new Error(`${article.slug}：${mechanicalErrors.join("；")}`);
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
