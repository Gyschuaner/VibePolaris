export const ingestionEvents = [
  { offset: 1, id: 'loan-1', book: 42 },
  { offset: 2, id: 'loan-2', book: 78 },
  { offset: 3, id: 'loan-3', book: 42 },
] as const;
export type IngestionState = { cursor: number; batch: number[]; saved: number[]; written: boolean; notice: 'idle' | 'read' | 'failed' | 'written' | 'committed' | 'restarted' };
export const initialIngestion = (): IngestionState => ({ cursor: 0, batch: [], saved: [], written: false, notice: 'idle' });
export function runIngestion(state: IngestionState, action: 'read' | 'write' | 'fail' | 'commit' | 'restart'): IngestionState {
  if (action === 'restart') return { ...state, batch: [], written: false, notice: 'restarted' };
  if (action === 'read' && !state.batch.length && state.cursor < 3) return { ...state, batch: ingestionEvents.filter(e => e.offset > state.cursor).slice(0, 2).map(e => e.offset), written: false, notice: 'read' };
  if (action === 'fail' && state.batch.length && !state.written) return { ...state, notice: 'failed' };
  if (action === 'write' && state.batch.length && !state.written) return { ...state, saved: [...new Set([...state.saved, ...state.batch])], written: true, notice: 'written' };
  if (action === 'commit' && state.written && state.batch.length) return { ...state, cursor: Math.max(...state.batch), batch: [], written: false, notice: 'committed' };
  return state;
}

export type MoneyUnit = 'unknown' | 'yuan' | 'fen';
export type Conversion = { cents: number; reason: null } | { cents: null; reason: string };
// Parse decimal digits before arithmetic; the teaching policy rejects, rather than rounds, excess precision.
export function toCents(value: string, unit: MoneyUnit): Conversion {
  if (unit === 'unknown') return { cents: null, reason: '单位未确认' };
  if (!(unit === 'fen' ? /^\d+$/ : /^\d+(?:\.\d{1,2})?$/).test(value)) return { cents: null, reason: unit === 'fen' ? '分必须是整数' : '元最多两位小数' };
  const [whole, fraction = ''] = value.split('.');
  const cents = unit === 'fen' ? Number(whole) : Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? { cents, reason: null } : { cents: null, reason: '超出本例整数范围' };
}
export function transformRows(unit: MoneyUnit, excessPrecision = false) {
  return [
    { id: 'A', raw: excessPrecision ? '¥12.345' : '¥12.30', result: toCents(excessPrecision ? '12.345' : '12.30', 'yuan') },
    { id: 'B', raw: 'CNY 12.30', result: toCents('12.30', 'yuan') },
    { id: 'C', raw: '1230 分', result: toCents('1230', 'fen') },
    { id: 'D', raw: '1230', result: toCents('1230', unit) },
  ];
}
export const conversionCases = [false, true].flatMap(excess => (['unknown', 'fen', 'yuan'] as const).map(unit => ({ unit, excess, rows: transformRows(unit, excess) })));

export const validationRecords = [
  { id: 'A', age: 24, city: 'SH' },
  { id: 'B', age: -2, city: 'SH' },
  { id: 'C', age: 37, city: '??' },
  { id: 'D', age: '24', city: 'BJ' },
] as const;
export type ValidationRules = { range: boolean; city: boolean };
export function validateRecords(rules: ValidationRules) {
  return validationRecords.map(record => {
    const integer = typeof record.age === 'number' && Number.isInteger(record.age);
    const range = !rules.range ? '未启用' : !integer ? '不适用' : record.age >= 0 && record.age <= 120 ? '通过' : '失败';
    const cityCheck = !rules.city ? '未启用' : ['SH', 'BJ'].includes(record.city) ? '通过' : '失败';
    const errors = [!integer ? 'age 应为整数，未自动转型' : '', range === '失败' ? 'age 不在 0–120' : '', cityCheck === '失败' ? 'city 不在 SH / BJ' : ''].filter(Boolean);
    return { ...record, integer, range, cityCheck, errors, valid: errors.length === 0 };
  });
}
export const validationCases = [
  { range: true, city: true }, { range: false, city: true },
  { range: true, city: false }, { range: false, city: false },
].map(rules => ({ rules, rows: validateRecords(rules) }));
