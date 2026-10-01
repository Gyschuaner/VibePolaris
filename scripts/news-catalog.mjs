import { readdirSync } from "node:fs";
import { join } from "node:path";
import { loadNewsContent, readJson } from "./news-contract.mjs";

try {
  const { paths, terms, articles, drafts } = loadNewsContent();
  const batches = join(paths.repository, "content/zh/term-batches");
  const allTerms = [
    ...readJson(join(paths.repository, "content/zh/terms.json")),
    ...readdirSync(batches).filter(file => file.endsWith(".json")).sort().flatMap(file => readJson(join(batches, file))),
  ];
  const catalog = allTerms.filter(term => terms.has(term.slug)).map(({ slug, zh, en, aliases, definition }) => ({ slug, zh, en, aliases, definition }));
  if (new Set(catalog.map(term => term.slug)).size !== terms.size) throw new Error("公开词条目录与词条内容不一致");
  process.stdout.write(`${JSON.stringify({
    version: 1,
    terms: catalog,
    articles: articles.map(article => Object.fromEntries(Object.entries(article).filter(([key]) => key !== "body"))),
    drafts: drafts.map(({ draft: { slug, status, canonicalUrl, sourceHash, discoveredAt } }) => ({ slug, status, canonicalUrl, sourceHash, discoveredAt })),
  }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`News 目录导出失败：${error.message}\n`);
  process.exitCode = 1;
}
