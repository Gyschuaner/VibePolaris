// Local, sequential teaching models; no requests or real elapsed-time timers.
export function timeoutState(time: number, limit: number) {
  return {
    committed: time >= 3,
    client: time >= 4 && limit > 4 ? "received" : time >= limit ? "timeout" : "waiting",
    clientTime: Math.min(time, limit, 4),
    serverTime: Math.min(time, 3),
  } as const;
}

export type RetryScenario = "temporary" | "persistent" | "invalid";
export function retryAttempt(scenario: RetryScenario, attempt: number) {
  const status = scenario === "invalid" ? 400 : scenario === "temporary" && attempt === 3 ? 200 : 503;
  const stop = status === 200 ? "success" : status === 400 ? "invalid" : attempt >= 3 ? "exhausted" : null;
  return { status, stop, wait: stop ? 0 : 2 ** (attempt - 1) };
}

export type ReservationEntry = { key: string; slot: string; id: number };
export function reserveOnce(entries: ReservationEntry[], key: string, slot: string) {
  const previous = entries.find(entry => entry.key === key);
  if (previous) return { entries, kind: previous.slot === slot ? "replayed" as const : "conflict" as const, entry: previous };
  const entry = { key, slot, id: entries.length + 42 };
  return { entries: [...entries, entry], kind: "created" as const, entry };
}
