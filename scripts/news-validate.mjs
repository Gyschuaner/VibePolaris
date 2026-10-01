import { loadNewsContent } from "./news-contract.mjs";

try {
  const { articles, drafts, dailyRuns } = loadNewsContent();
  const sourceTypes = Object.fromEntries(dailyRuns.flatMap(({ run }) => run.candidates.filter(candidate => candidate.decision === "selected").map(candidate => candidate.sourceType)).reduce((counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1), new Map()));
  process.stdout.write(`${JSON.stringify({
    published: articles.length,
    drafts: drafts.length,
    pending: drafts.filter(({ draft }) => ["discovered", "draft", "ready", "needs-review"].includes(draft.status)).length,
    dailyRuns: dailyRuns.length,
    dailyEvents: dailyRuns.reduce((count, { run }) => count + run.selectedSlugs.length, 0),
    gapDays: dailyRuns.filter(({ run }) => run.gap).map(({ run }) => run.eventDate),
    sourceTypes,
  })}\n`);
} catch (error) {
  process.stderr.write(`News 校验失败：${error.message}\n`);
  process.exitCode = 1;
}
