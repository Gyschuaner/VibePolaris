export type PipelineState = { read: boolean; quality: 'waiting' | 'failed' | 'passed'; archived: boolean; aggregated: boolean; published: boolean };
export const pipelineRows = [{ id: 'r1', book: 42 }, { id: 'r2', book: null }, { id: 'r3', book: 42 }, { id: 'r4', book: 78 }];
export const initialPipeline = (): PipelineState => ({ read: false, quality: 'waiting', archived: false, aggregated: false, published: false });
export function runPipeline(state: PipelineState, action: 'read' | 'validate' | 'isolate' | 'archive' | 'aggregate' | 'publish'): PipelineState {
  if (action === 'read') return { ...state, read: true };
  if (!state.read) return state;
  if (action === 'validate' && state.quality === 'waiting') return { ...state, quality: 'failed' };
  if (action === 'isolate' && state.quality === 'failed') return { ...state, quality: 'passed' };
  if (action === 'archive') return { ...state, archived: true };
  if (action === 'aggregate' && state.quality === 'passed') return { ...state, aggregated: true };
  if (action === 'publish' && state.aggregated && state.archived) return { ...state, published: true };
  return state;
}
export type WebhookState = { delivery: 'none' | 'valid' | 'tampered'; verified: boolean; receipt: 'waiting' | 'rejected' | 'accepted' | 'duplicate'; stored: boolean; processed: boolean; response: 'none' | 'rejected' | 'sent' | 'lost' };
export const initialWebhook = (): WebhookState => ({ delivery: 'none', verified: false, receipt: 'waiting', stored: false, processed: false, response: 'none' });
export function deliverWebhook(state: WebhookState, delivery: 'valid' | 'tampered'): WebhookState { return { ...state, delivery, verified: false, receipt: 'waiting', response: 'none' }; }
export function verifyWebhook(state: WebhookState): WebhookState {
  if (state.delivery === 'none' || state.receipt !== 'waiting') return state;
  return state.delivery === 'valid' ? { ...state, verified: true } : { ...state, receipt: 'rejected', response: 'rejected' };
}
export function acceptWebhook(state: WebhookState, loseResponse = false): WebhookState {
  if (!state.verified || state.receipt !== 'waiting') return state;
  return { ...state, stored: true, receipt: state.stored ? 'duplicate' : 'accepted', response: loseResponse ? 'lost' : 'sent' };
}
export function processWebhook(state: WebhookState): WebhookState { return state.stored ? { ...state, processed: true } : state; }
export type LossMode = 'request-lost' | 'response-lost';
export type DistributedState = { mode: LossMode; sent: boolean; remoteDone: boolean; caller: 'idle' | 'waiting' | 'unknown' | 'confirmed' | 'not-found'; retried: boolean };
export const initialDistributed = (mode: LossMode = 'response-lost'): DistributedState => ({ mode, sent: false, remoteDone: false, caller: 'idle', retried: false });
export function runDistributed(state: DistributedState, action: 'send' | 'process' | 'timeout' | 'query' | 'retry'): DistributedState {
  if (action === 'send' && !state.sent) return { ...state, sent: true, caller: 'waiting' };
  if (!state.sent) return state;
  if (action === 'process' && state.mode === 'response-lost') return { ...state, remoteDone: true };
  if (action === 'timeout' && state.caller === 'waiting' && (state.mode === 'request-lost' || state.remoteDone)) return { ...state, caller: 'unknown' };
  if (action === 'query' && state.caller === 'unknown') return { ...state, caller: state.remoteDone ? 'confirmed' : 'not-found' };
  if (action === 'retry' && !['idle', 'waiting'].includes(state.caller)) return { ...state, remoteDone: true, caller: 'confirmed', retried: true };
  return state;
}
