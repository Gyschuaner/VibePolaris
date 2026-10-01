import { loadNewsContent } from "./news-contract.mjs";

function parseDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) throw new Error(`${label} 必须是 YYYY-MM-DD`);
  return value;
}

function dateRange(from, to) {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (start > end) throw new Error("--from 不能晚于 --to");
  const days = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) days.push(cursor.toISOString().slice(0, 10));
  return days;
}

export function summarizeDailyRuns(runs, { from, to } = {}) {
  const filtered = runs.filter(({ run }) => (!from || run.eventDate >= from) && (!to || run.eventDate <= to));
  const sourceTypes = Object.fromEntries(filtered.flatMap(({ run }) => run.candidates.filter(candidate => candidate.decision === "selected").map(candidate => candidate.sourceType)).reduce((counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1), new Map()));
  return {
    from: from ?? filtered[0]?.run.eventDate ?? null,
    to: to ?? filtered.at(-1)?.run.eventDate ?? null,
    days: filtered.length,
    events: filtered.reduce((count, { run }) => count + run.selectedSlugs.length, 0),
    candidateCount: filtered.reduce((count, { run }) => count + run.candidates.length, 0),
    deduplicatedCount: filtered.reduce((count, { run }) => count + run.search.deduplicatedCount, 0),
    gapDays: filtered.filter(({ run }) => run.gap).map(({ run }) => run.eventDate),
    sourceTypes,
    records: filtered.map(({ run }) => ({ eventDate: run.eventDate, events: run.selectedSlugs.length, candidates: run.candidates.length, gap: Boolean(run.gap) })),
  };
}

try {
  const args = process.argv.slice(2);
  const value = flag => args[args.indexOf(flag) + 1];
  if (args.some(arg => arg.startsWith("--") && !["--from", "--to"].includes(arg))) throw new Error("仅支持 --from 和 --to");
  const from = value("--from") ? parseDate(value("--from"), "--from") : undefined;
  const to = value("--to") ? parseDate(value("--to"), "--to") : undefined;
  const requested = from && to ? dateRange(from, to) : null;
  const content = loadNewsContent();
  const summary = summarizeDailyRuns(content.dailyRuns, { from, to });
  if (requested) {
    const present = new Set(content.dailyRuns.map(({ run }) => run.eventDate));
    summary.missingDays = requested.filter(day => !present.has(day));
  }
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`按天产出校验失败：${error.message}\n`);
  process.exitCode = 1;
}
