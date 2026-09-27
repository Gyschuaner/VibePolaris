export const retrievalQueries = ['退款', '打印', '赛事'];
export const retrievalDocuments = [
  { id: 'A', title: '退款申请入口', access: '公开', keywords: ['退款', '申请'], text: '线上退款申请从订单详情提交。这份说明只介绍申请入口，不说明到账时间。' },
  { id: 'B', title: '退款到账时间', access: '公开', keywords: ['退款', '到账'], text: '线上退款审核通过后，通常在三个工作日内原路退回。审核未通过时不进入退款流程。' },
  { id: 'C', title: '打印指南', access: '公开', keywords: ['打印'], text: '打印文件需到服务台，与退款到账无关。' },
  { id: 'D', title: '商户退款记录', access: '运营', keywords: ['退款', '记录'], text: '这是一份虚构的内部退款记录。演示里只有运营身份可以把它选入候选。' },
];
export function retrieve(query: number, staff: boolean, limit: number) {
  return retrievalDocuments.filter(doc => (staff || doc.access === '公开') && doc.keywords.includes(retrievalQueries[query])).slice(0, limit);
}

export const refundCondition = '线上退款审核通过后，通常在三个工作日内原路退回。';
export const chunkDocument = `退款申请\n线上退款可从订单详情提交申请，提交后需等待审核。\n\n到账时间\n${refundCondition}审核未通过时不进入退款流程。\n\n打印服务\n打印文件需到服务台，与退款到账无关。`;
export type TextChunk = { id: number; start: number; end: number; text: string };
export function splitCharacters(text: string, size: number, overlap: number): TextChunk[] {
  if (!Number.isInteger(size) || !Number.isInteger(overlap) || size < 1 || overlap < 0 || overlap >= size) throw new RangeError('重叠必须小于正整数块长');
  const chars = Array.from(text), chunks: TextChunk[] = [];
  for (let start = 0; start < chars.length;) {
    const end = Math.min(start + size, chars.length);
    chunks.push({ id: chunks.length + 1, start, end, text: chars.slice(start, end).join('') });
    if (end === chars.length) break;
    start = end - overlap;
  }
  return chunks;
}
export function splitParagraphs(text: string): TextChunk[] {
  if (!text) return [];
  const chunks: TextChunk[] = [];
  let start = 0;
  // Keep paragraph separators with their preceding block so every character has provenance.
  const parts = text.match(/[^]*?(?:\n\n|$)/g)?.filter(Boolean) ?? [];
  for (const part of parts) {
    const end = start + Array.from(part).length;
    chunks.push({ id: chunks.length + 1, start, end, text: part });
    start = end;
  }
  return chunks;
}
export function chunkSummary(chunks: TextChunk[]) {
  const covered = new Set<number>();
  let copied = 0;
  for (const chunk of chunks) { copied += chunk.end - chunk.start; for (let i = chunk.start; i < chunk.end; i++) covered.add(i); }
  return { duplicated: copied - covered.size, completeCondition: chunks.filter(chunk => chunk.text.includes(refundCondition)).length };
}

export const rerankQueries = [
  { text: '线上退款审核通过后，多久到账？', needs: ['线上', '审核通过', '到账时间'] },
  { text: '如何提交线上退款申请？', needs: ['线上', '申请入口'] },
];
export const rerankDocuments = [
  { id: 'A', title: '退款申请入口', text: retrievalDocuments[0].text, facts: ['线上', '申请入口'] },
  { id: 'C', title: '柜台退款时效', text: '线下柜台退款审核通过后，通常在七个工作日内原路退回。这份说明不适用于线上退款。', facts: ['审核通过', '到账时间'] },
  { id: 'B', title: '线上退款时效', text: retrievalDocuments[1].text, facts: ['线上', '审核通过', '到账时间'] },
];
export function rerankCandidates(window: number) { return rerankDocuments.slice(0, window); }
export function assessCandidate(doc: typeof rerankDocuments[number], query: number) {
  const checks = rerankQueries[query].needs.map(need => ({ need, matches: doc.facts.includes(need) }));
  return { ...doc, checks, matched: checks.filter(check => check.matches).length };
}
export function rerank(window: number, query: number) {
  return rerankCandidates(window).map(doc => assessCandidate(doc, query)).sort((a, b) => b.matched - a.matched);
}
