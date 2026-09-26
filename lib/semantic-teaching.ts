export type Triple = readonly [number, number, number];
export const embeddingTexts = ['想晚几天还书', '我想延长借书期限', '在哪里打印文件'];
const representations: readonly (readonly Triple[])[] = [
  [[.8, .6, 0], [.6, .8, 0], [0, .2, .98]],
  [[.6, -.8, 0], [.8, -.6, 0], [.2, 0, .98]],
];
export const embeddingVector = (text: number, space: number): Triple => representations[space][text];
export function cosine(a: Triple, b: Triple) {
  const denominator = Math.hypot(...a) * Math.hypot(...b);
  return denominator ? a.reduce((sum, value, i) => sum + value * b[i], 0) / denominator : null;
}
export function compareEmbedding(text: number, space: number) {
  return space === 0 ? cosine(embeddingVector(0, 0), embeddingVector(text, space)) : null;
}
export const semanticQueries = ['想晚几天还书', '在哪里打印文件', '健身房什么时候开门'];
export const searchDocuments = [
  { id: 'A', title: '续借规则', version: '现行', vector: [.9, .1, 0] as Triple },
  { id: 'B', title: '延长借阅期限', version: '旧版', vector: [.98, .02, 0] as Triple },
  { id: 'C', title: '打印指南', version: '现行', vector: [.1, .9, 0] as Triple },
  { id: 'D', title: '续借系统维护', version: '现行', vector: [.75, .4, 0] as Triple },
];
const queryRepresentations: Triple[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
export const relevantIds = [['A'], ['C'], []];
export function semanticSearch(query: number, currentOnly: boolean, k: number, threshold: number) {
  const ranked = searchDocuments.filter(d => !currentOnly || d.version === '现行')
    .map(d => ({ ...d, score: cosine(queryRepresentations[query], d.vector)! }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const hits = ranked.filter(d => d.score >= threshold).slice(0, k);
  const correct = hits.filter(d => relevantIds[query].includes(d.id)).length;
  return { query, currentOnly, k, threshold, ranked, hits, correct,
    precision: hits.length ? correct / hits.length : null,
    recall: relevantIds[query].length ? correct / relevantIds[query].length : null };
}
export const ragDocuments = [
  { id: 'A', title: '本馆续借规则', text: '只有未被预约的书才可续借，每次延长 14 天。' },
  { id: 'B', title: '书目 #42 · 当前状态', text: '此书已有其他读者预约。' },
  { id: 'C', title: '另一份同范围规则', text: '每次续借 30 天，无需检查预约。' },
];
export const ragCases = ['完整资料', '缺少规则', '资料冲突'];
export const ragPacket = (scenario: number) => scenario === 0 ? ['A', 'B'] : scenario === 1 ? ['B'] : ['A', 'B', 'C'];
export function ragAnswer(ids: string[]) {
  const claims = [];
  if (ids.includes('B')) claims.push({ text: '这本书已有其他读者预约。', sources: ['B'] });
  const conflict = ids.includes('A') && ids.includes('C');
  if (conflict) return { claims, conclusion: '两份规则对预约条件与天数有冲突。先确认有效规则，暂不能给出能否续借或具体天数。' };
  if (ids.includes('A') && ids.includes('B')) {
    claims.push({ text: '按本馆规则，当前不能续借。', sources: ['A', 'B'] });
    claims.push({ text: '符合未被预约条件时，每次可延长 14 天。', sources: ['A'] });
    return { claims, conclusion: '预约状态与续借条件一起决定结论；14 天是符合条件后的期限。' };
  }
  return { claims, conclusion: '缺少可用的续借规则，无法判断能否续借或延长几天。' };
}
