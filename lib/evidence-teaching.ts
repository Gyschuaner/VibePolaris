export const hybridDocuments = [
  { id: 'A', title: 'MX-42 使用手册' }, { id: 'B', title: 'MX-42 断线重连' },
  { id: 'C', title: 'MX-40 网络设置' }, { id: 'D', title: '连接中断排查' },
];
export const hybridLanes = [['A', 'B', 'C'], ['B', 'D', 'A']];
export function fuseRanks(lexical: boolean, semantic: boolean, window: number) {
  const rows = hybridDocuments.map(doc => {
    const ranks = hybridLanes.map((lane, i) => (i === 0 ? lexical : semantic) && lane.indexOf(doc.id) >= 0 && lane.indexOf(doc.id) < window ? lane.indexOf(doc.id) + 1 : 0);
    return { ...doc, ranks, parts: ranks.map(rank => rank ? 1 / (60 + rank) : 0), score: ranks.reduce((sum, rank) => sum + (rank ? 1 / (60 + rank) : 0), 0) };
  });
  return rows.filter(row => row.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
export type StoreRecord = { id: string; version: number; vector: number[]; text: string };
export function refundRecord(version: number): StoreRecord {
  return { id: 'A', version, vector: version === 1 ? [1, 0] : [.96, .28], text: `线上退款审核通过后，通常${version === 1 ? '三个' : '七个'}工作日内原路退回。` };
}
export const printingRecord: StoreRecord = { id: 'B', version: 1, vector: [0, 1], text: '打印服务可以从订单详情打开。' };
export function upsertRecord(records: StoreRecord[], record: StoreRecord) { return [...records.filter(item => item.id !== record.id), record].sort((a, b) => a.id.localeCompare(b.id)); }
export function queryStore(records: StoreRecord[], current: number, onlyCurrent: boolean) {
  return records.filter(row => !onlyCurrent || row.id !== 'A' || row.version === current).map(row => ({ ...row, score: row.vector[0] / Math.hypot(...row.vector), stale: row.id === 'A' && row.version !== current })).filter(row => row.score > .2).sort((a, b) => b.score - a.score).slice(0, 1);
}
export const citationClaims = ['线上退款审核通过后，通常三个工作日内原路退回。', '所有退款都保证三个工作日内到账。', '退款完全免费。'];
export const citationPassages = [
  { title: '线上退款规则 · 第 2 段', text: '线上退款审核通过后，通常三个工作日内原路退回。' },
  { title: '门店退款规则 · 第 3 段', text: '门店退款审核通过后，通常七个工作日内原路退回。' },
  { title: '申请入口 · 第 1 段', text: '线上退款可从订单详情提交申请。' },
];
// ponytail: fixed teaching evidence, no automatic entailment model or source verification.
export function checkCitation(claim: number, passage: number) {
  if (passage === 0 && claim === 0) return { kind: 'full', text: '这段原文支持渠道、审核条件、通常时效与退回方式。' };
  if (passage === 0 && claim === 1) return { kind: 'partial', text: '部分相关，但原文只说线上、审核通过后、通常；没有支持“所有”和“保证”。' };
  return { kind: 'none', text: '这段原文不能支持这句话。需要另找相应依据，或修改结论。' };
}
