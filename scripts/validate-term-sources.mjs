import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const experienceDir = resolve(root, "content/zh/term-experiences");
const reportPath = resolve(root, "docs/research/audits/term-sources-2026-08-31.json");
const experiences = readdirSync(experienceDir)
  .filter((name) => name.endsWith(".json"))
  .flatMap((name) => JSON.parse(readFileSync(resolve(experienceDir, name), "utf8")));

const sourcesByUrl = new Map();
for (const experience of experiences) {
  for (const source of experience.sources) {
    const previous = sourcesByUrl.get(source.url) ?? [];
    previous.push(experience.slug);
    sourcesByUrl.set(source.url, previous);
  }
}

async function check(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 VibePolaris source validator" },
    });
    await response.body?.cancel();
    return { url, status: response.status, finalUrl: response.url, durationMs: Date.now() - started, error: null };
  } catch (error) {
    return { url, status: null, finalUrl: null, durationMs: Date.now() - started, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

const urls = [...sourcesByUrl.keys()];
const results = [];
let cursor = 0;
const workers = Array.from({ length: 16 }, async () => {
  while (cursor < urls.length) {
    const index = cursor;
    cursor += 1;
    results[index] = await check(urls[index]);
  }
});
await Promise.all(workers);

const dead = results.filter((item) => item.status === 404 || item.status === 410);
const unverified = results.filter((item) => item.status === null || item.status >= 500);
const verified = results.filter((item) => !dead.includes(item) && !unverified.includes(item));
const report = {
  checkedAt: new Date().toISOString(),
  sourceReferences: experiences.flatMap((item) => item.sources).length,
  uniqueUrls: urls.length,
  verifiedOrAccessControlled: verified.length,
  unverified: unverified.map((item) => ({ ...item, slugs: sourcesByUrl.get(item.url) })),
  dead: dead.map((item) => ({ ...item, slugs: sourcesByUrl.get(item.url) })),
  results,
};

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ uniqueUrls: report.uniqueUrls, verifiedOrAccessControlled: report.verifiedOrAccessControlled, unverified: report.unverified.length, dead: report.dead.length }, null, 2)}\n`);
if (dead.length) process.exitCode = 1;
