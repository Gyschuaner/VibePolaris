// Small fixed teaching objects; no pandas, tokenizer, embedding model or database is run.
export const frameRows = [
  { label: 'A', book: 42, days: 0, branch: '北馆' },
  { label: 'B', book: 78, days: 3, branch: '南馆' },
  { label: 'C', book: 42, days: 0, branch: '南馆' },
  { label: 'D', book: 91, days: 7, branch: '北馆' },
];
export function frameSelection(minDays: number, includeBook: boolean) {
  const columns = includeBook ? ['book', 'days', 'branch'] as const : ['days', 'branch'] as const;
  const rows = frameRows.filter(row => row.days >= minDays).map(row => ({ label: row.label, values: columns.map(column => row[column]) }));
  return { minDays, includeBook, columns, rows, shape: [rows.length, columns.length] };
}
export const textDocuments = [
  { id: 'A', terms: ['借阅', '续借', '规则'] },
  { id: 'B', terms: ['借阅', '到期', '提醒'] },
  { id: 'C', terms: ['续借', '操作', '指南'] },
  { id: 'D', terms: ['打印', '操作', '指南'] },
  { id: 'E', terms: ['续借', '借阅', '说明'] },
];
export const postings = [...new Set(textDocuments.flatMap(doc => doc.terms))].map(term => ({ term, entries: textDocuments.flatMap(doc => doc.terms.flatMap((word, i) => word === term ? [{ id: doc.id, position: i + 1 }] : [])) }));
export type TextMode = 'and' | 'or' | 'phrase';
export function textSearch(query: string, mode: TextMode) {
  // ponytail: whitespace-only tokens for the visible pre-segmented example; a language analyzer is needed for natural text.
  const terms = query.trim().split(/\s+/).filter(Boolean);
  const lists = terms.map(term => postings.find(item => item.term === term)?.entries ?? []);
  const ids = !terms.length ? [] : textDocuments.filter(doc => mode === 'or'
    ? lists.some(entries => entries.some(entry => entry.id === doc.id))
    : mode === 'and' ? lists.every(entries => entries.some(entry => entry.id === doc.id))
    : lists[0].some(first => first.id === doc.id && lists.every((entries, i) => entries.some(entry => entry.id === doc.id && entry.position === first.position + i)))
  ).map(doc => doc.id);
  return { query, mode, terms, ids, lists };
}
export type VectorScope = 'all' | 'public' | 'archived';
export const queryVectors = [[2, 2], [8, 7]] as const;
export function vectorPoints(updated: boolean) {
  return [
    { id: 'A', x: updated ? 9 : 3, y: updated ? 8 : 2, scope: 'public', title: '续借规则' },
    { id: 'B', x: 2.2, y: 2.2, scope: 'internal', title: '值班说明' },
    { id: 'C', x: 4, y: 4, scope: 'public', title: '借阅指南' },
    { id: 'D', x: 6, y: 2, scope: 'public', title: '读者服务' },
    { id: 'E', x: 8, y: 7, scope: 'public', title: '打印指南' },
    { id: 'F', x: 7, y: 8, scope: 'internal', title: '设备记录' },
  ];
}
export function vectorSearch(query: 0 | 1, scope: VectorScope, updated: boolean) {
  const q = queryVectors[query];
  const candidates = vectorPoints(updated).filter(point => scope === 'all' || point.scope === scope)
    .map(point => ({ ...point, distance: Math.hypot(point.x - q[0], point.y - q[1]) }))
    .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id));
  return { query, scope, updated, q, candidates, hits: candidates.slice(0, 2) };
}
