export const catalog = [{ id: 42, title: '山间来信' }, { id: 78, title: '夜空地图' }];
export function snapshot(revision: number) {
  return revision === 2 ? [] : catalog.map(row => ({ ...row, title: row.id === 42 && revision === 1 ? '山间来信·修订版' : row.title }));
}
export type BackupState = { current: number; saved: number[]; selected: number | null; restored: number | null };
export const initialBackup = (): BackupState => ({ current: 0, saved: [], selected: null, restored: null });
export function saveBackup(state: BackupState): BackupState {
  return state.saved.includes(state.current) ? state : { ...state, saved: [...state.saved, state.current], selected: state.current };
}
export function restoreBackup(state: BackupState): BackupState {
  return state.selected === null || !state.saved.includes(state.selected) ? state : { ...state, restored: state.selected };
}
export type Shard = 'A' | 'B';
export function rangeOwner(stage: number, id: number): Shard { return id < 50 || stage >= 2 ? 'A' : 'B'; }
export function queryShards(stage: number, key: number | null) {
  const targets: Shard[] = key === null ? ['A', 'B'] : [rangeOwner(stage, key)];
  return { targets, rows: catalog.filter(row => (key === null || row.id === key) && targets.includes(rangeOwner(stage, row.id))) };
}
export type QueueState = { published: boolean; ready: number[]; flight: { id: number; processed: boolean; reused: boolean } | null; covers: number[]; acked: number[] };
export const initialQueue = (): QueueState => ({ published: false, ready: [], flight: null, covers: [], acked: [] });
export function queueAction(state: QueueState, action: 'publish' | 'receive' | 'process' | 'ack' | 'disconnect'): QueueState {
  if (action === 'publish') return state.published ? state : { ...state, published: true, ready: [42, 78] };
  if (action === 'receive') return state.flight || !state.ready.length ? state : { ...state, ready: state.ready.slice(1), flight: { id: state.ready[0], processed: false, reused: false } };
  if (!state.flight) return state;
  const { id, processed } = state.flight;
  if (action === 'process') return processed ? state : { ...state, covers: state.covers.includes(id) ? state.covers : [...state.covers, id], flight: { id, processed: true, reused: state.covers.includes(id) } };
  if (action === 'ack') return !processed ? state : { ...state, flight: null, acked: [...state.acked, id] };
  return { ...state, ready: [id, ...state.ready], flight: null };
}
