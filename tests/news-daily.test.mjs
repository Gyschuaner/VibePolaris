import assert from "node:assert/strict";
import test from "node:test";
import { loadNewsContent } from "../scripts/news-contract.mjs";

test("News 阶段一按日记录覆盖七天并保留候选与空档字段", () => {
  const { dailyRuns } = loadNewsContent();
  const trialRuns = dailyRuns.filter(({ run }) => run.eventDate >= "2021-01-01" && run.eventDate <= "2021-01-07");
  const summary = {
    days: trialRuns.length,
    events: trialRuns.reduce((count, { run }) => count + run.selectedSlugs.length, 0),
    candidateCount: trialRuns.reduce((count, { run }) => count + run.candidates.length, 0),
    gapDays: trialRuns.filter(({ run }) => run.gap).map(({ run }) => run.eventDate),
    sourceTypes: Object.fromEntries(trialRuns.flatMap(({ run }) => run.candidates.filter(candidate => candidate.decision === "selected").map(candidate => candidate.sourceType)).reduce((counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1), new Map())),
  };
  assert.deepEqual(dailyRuns.filter(({ run }) => run.eventDate >= "2021-01-01" && run.eventDate <= "2021-01-07").map(({ run }) => run.eventDate), [
    "2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "2021-01-06", "2021-01-07",
  ]);
  assert.equal(summary.days, 7);
  assert.equal(summary.events, 7);
  assert.equal(summary.candidateCount, 8);
  assert.deepEqual(summary.gapDays, []);
  assert.deepEqual(summary.sourceTypes, { paper: 6, "official-announcement": 1 });
  assert.equal(dailyRuns.find(({ run }) => run.eventDate === "2021-01-05").run.candidates.length, 2);
  assert.ok(dailyRuns.every(({ run }) => run.candidates.every(candidate => candidate.evidence.length > 0)));
});
