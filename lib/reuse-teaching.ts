export const bookTitles = ["山间来信", "山间来信 · 修订版"] as const;
export type CacheState = { source: 0 | 1; now: number; entry: { version: 0 | 1; expires: number } | null };
export const initialCache = (): CacheState => ({ source: 0, now: 0, entry: null });
export function readCache(state: CacheState) {
  const hit = state.entry !== null && state.entry.expires > state.now;
  const version = hit ? state.entry!.version : state.source;
  return { state: hit ? state : { ...state, entry: { version, expires: state.now + 2 } }, version, hit };
}
export function expireCache(state: CacheState): CacheState { return { ...state, now: state.now + 2, entry: null }; }
export const clientIds = ["A", "B", "C"] as const;
export type ClientId = typeof clientIds[number];
export type ClientState = "new" | "active" | "waiting" | "done" | "timedout";
export type PoolState = { slots: (ClientId | null)[]; clients: Record<ClientId, ClientState> };
export const initialPool = (): PoolState => ({ slots: [null, null], clients: { A: "new", B: "new", C: "new" } });
export function borrowConnection(state: PoolState, client: ClientId): PoolState {
  if (state.clients[client] !== "new") return state;
  const slot = state.slots.indexOf(null), slots = [...state.slots];
  if (slot >= 0) slots[slot] = client;
  return { slots, clients: { ...state.clients, [client]: slot >= 0 ? "active" : "waiting" } };
}
export function returnConnection(state: PoolState, slot: number): PoolState {
  const owner = state.slots[slot];
  if (!owner) return state;
  const next = clientIds.find(id => state.clients[id] === "waiting") ?? null;
  const slots = state.slots.map((id, i) => i === slot ? next : id);
  const clients = { ...state.clients, [owner]: "done" as const };
  if (next) clients[next] = "active";
  return { slots, clients };
}
export function timeoutWaiting(state: PoolState): PoolState {
  return { ...state, clients: Object.fromEntries(clientIds.map(id => [id, state.clients[id] === "waiting" ? "timedout" : state.clients[id]])) as PoolState["clients"] };
}
export type ReplicaState = { head: number; received: number; applied: number };
export const initialReplica = (): ReplicaState => ({ head: 0, received: 0, applied: 0 });
// ponytail: two ordered committed changes; a real WAL protocol remains outside this teaching model.
export function replicate(state: ReplicaState, action: "rename" | "delete" | "send" | "apply"): ReplicaState {
  if (action === "rename" && state.head === 0) return { ...state, head: 1 };
  if (action === "delete" && state.head === 1) return { ...state, head: 2 };
  if (action === "send" && state.received < state.head) return { ...state, received: state.received + 1 };
  if (action === "apply" && state.applied < state.received) return { ...state, applied: state.applied + 1 };
  return state;
}
