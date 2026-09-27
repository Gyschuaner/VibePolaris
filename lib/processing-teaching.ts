export const borrowRows = [42, 42, 78, 42, 78, 78];
export type BatchState = { size: number; sealed: boolean; done: number[]; failed: number | null; published: boolean };
export const initialBatch = (size = 4): BatchState => ({ size, sealed: false, done: [], failed: null, published: false });
export function batchChunk(state: BatchState, fail: boolean): BatchState {
  if (!state.sealed || state.published) return state;
  const chunk = Array.from({ length: state.size / 2 }, (_, i) => i).find(i => !state.done.includes(i));
  return chunk === undefined ? state : fail ? { ...state, failed: chunk } : { ...state, done: [...state.done, chunk], failed: null };
}
export function batchCounts(state: BatchState) { return [42, 78].map(id => state.done.flatMap(i => borrowRows.slice(i * 2, i * 2 + 2)).filter(book => book === id).length); }
export function publishBatch(state: BatchState): BatchState { return state.sealed && state.done.length === state.size / 2 ? { ...state, published: true } : state; }
export const streamEvents = [{ id: 'e1', time: 2, book: 42 }, { id: 'e2', time: 12, book: 78 }, { id: 'e3', time: 4, book: 42 }];
export type StreamState = { received: string[]; accepted: string[]; late: string[]; watermark: number };
export const initialStream = (): StreamState => ({ received: [], accepted: [], late: [], watermark: 0 });
export function receiveStream(state: StreamState, id: string): StreamState {
  const event = streamEvents.find(e => e.id === id);
  if (!event || state.received.includes(id)) return state;
  const expired = (Math.floor(event.time / 10) + 1) * 10 <= state.watermark;
  return { ...state, received: [...state.received, id], accepted: expired ? state.accepted : [...state.accepted, id], late: expired ? [...state.late, id] : state.late };
}
export function advanceWatermark(state: StreamState, value: number): StreamState { return { ...state, watermark: Math.max(state.watermark, value) }; }
export function windowEvents(state: StreamState, start: number) { return streamEvents.filter(e => state.accepted.includes(e.id) && e.time >= start && e.time < start + 10); }
export type Target = 'shelf' | 'stats';
export type DeliveryState = 'pending' | 'failed' | 'done' | 'duplicate';
export type EventState = { recorded: boolean; published: boolean; deliveries: Record<Target, DeliveryState>; processed: Target[] };
export const initialEvent = (): EventState => ({ recorded: false, published: false, deliveries: { shelf: 'pending', stats: 'pending' }, processed: [] });
export function deliverEvent(state: EventState, target: Target, reject = false): EventState {
  if (!state.published) return state;
  const duplicate = state.processed.includes(target);
  return { ...state, deliveries: { ...state.deliveries, [target]: duplicate ? 'duplicate' : reject ? 'failed' : 'done' }, processed: duplicate || reject ? state.processed : [...state.processed, target] };
}
