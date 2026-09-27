import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datasetDraft, datasetSnapshot, qualityReport, lineageRuns, lineageImpact, feeRows } from '../lib/provenance-teaching.ts';

test('快照不随来源改变；质量对应用途；字段血缘对应实际规则', () => {
  const old = datasetSnapshot(false, false, 1);
  assert.deepEqual(old.rows.map(row => row.id), ['A', 'B', 'C']);
  assert.equal(datasetDraft(true, false).rows.length, 3);
  const latest = datasetSnapshot(true, true, 2);
  assert.deepEqual(latest.rows.map(row => row.id), ['A', 'B', 'C', 'D']);
  latest.rows[0].book = 999;
  assert.equal(old.rows[0].book, 42);
  assert.equal(old.source, 's1');
  assert.equal(old.end, '2026-09-02');
  assert.equal(qualityReport('monthly', false, false).passed, true);
  assert.equal(qualityReport('live', false, false).passed, false);
  assert.equal(qualityReport('live', true, false).passed, true);
  const missing = qualityReport('live', true, true);
  assert.equal(missing.passed, false);
  assert.equal(missing.filled, 8);
  assert.equal(missing.distinct, 9);
  assert.equal(missing.ageSeconds, 12);
  assert.deepEqual(lineageRuns.map(run => run.total), [2000, 1800]);
  assert.deepEqual(lineageImpact(1, 'discount'), []);
  assert.equal(lineageImpact(2, 'discount').length, 2);
  assert.equal(lineageImpact(1, 'amount').length, 2);
  assert.equal(feeRows[0].discount, 200);
});
