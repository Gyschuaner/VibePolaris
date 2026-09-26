// Fixed teaching records; no files, databases or lineage services are accessed.
export const datasetRows = [
  { id: 'A', date: '2026-09-01', book: 42 },
  { id: 'B', date: '2026-09-02', book: 78 },
  { id: 'C', date: '2026-09-02', book: 42 },
  { id: 'E', date: '2026-08-31', book: 78 },
  { id: 'D', date: '2026-09-03', book: 42 },
];
export function datasetDraft(arrived: boolean, extended: boolean) {
  const source = datasetRows.slice(0, arrived ? 5 : 4);
  const end = extended ? '2026-09-03' : '2026-09-02';
  return { source: arrived ? 's2' : 's1', start: '2026-09-01', end, rows: source.filter(row => row.date >= '2026-09-01' && row.date <= end) };
}
export function datasetSnapshot(arrived: boolean, extended: boolean, version: number) {
  const draft = datasetDraft(arrived, extended);
  return { ...draft, version, rows: draft.rows.map(row => ({ ...row })) };
}

export type QualityUse = 'monthly' | 'live';
export function qualityRecords(extraMissing: boolean) {
  return Array.from({ length: 10 }, (_, index) => ({
    id: `e${Math.min(index + 1, 9)}`,
    book: index === 6 || (extraMissing && index === 5) ? null : index % 2 ? 78 : 42,
  }));
}
export function qualityReport(use: QualityUse, fresh: boolean, extraMissing: boolean) {
  const rows = qualityRecords(extraMissing);
  const filled = rows.filter(row => row.book !== null).length;
  const distinct = new Set(rows.map(row => row.id)).size;
  const ageSeconds = fresh ? 12 : 10800;
  const limitSeconds = use === 'monthly' ? 86400 : 30;
  const checks = [filled / rows.length >= .9, distinct / rows.length >= .9, ageSeconds <= limitSeconds];
  return { use, fresh, extraMissing, rows, filled, distinct, ageSeconds, limitSeconds, checks, passed: checks.every(Boolean) };
}
export const qualityCases = (['monthly', 'live'] as const).flatMap(use => [false, true].flatMap(fresh => [false, true].map(extraMissing => qualityReport(use, fresh, extraMissing))));

export const feeRows = [{ id: 'A', amount: 1200, discount: 200 }, { id: 'B', amount: 800, discount: 0 }];
export const lineageRuns = ([1, 2] as const).map(version => ({
  version, run: version === 1 ? 'run-42' : 'run-43', source: 's1',
  expression: version === 1 ? 'sum(amount)' : 'sum(amount − discount)',
  fields: version === 1 ? ['amount'] : ['amount', 'discount'],
  total: feeRows.reduce((sum, row) => sum + row.amount - (version === 2 ? row.discount : 0), 0),
}));
export function lineageImpact(version: 1 | 2, field: 'amount' | 'discount') {
  return lineageRuns[version - 1].fields.includes(field) ? ['daily.total', 'monthly.total'] : [];
}
