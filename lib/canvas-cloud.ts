import type { CanvasData } from "./canvas";
import type { CloudCanvas } from "./account/canvas-store";

export async function cloudRequest(owner: string, options: { id?: string; method?: "POST" | "PUT"; body?: unknown; base?: CanvasData } = {}): Promise<CloudCanvas | null> {
  const response = await fetch(`/api/account/canvases${options.id ? `?id=${encodeURIComponent(options.id)}` : ""}`, {
    method: options.method || "GET", cache: "no-store", signal: AbortSignal.timeout(30_000),
    headers: { "X-VP-Account": owner, ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.base ? { "If-None-Match": `"${options.base.revision}"` } : {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (response.status === 304) return null;
  const value = await response.json();
  if (!response.ok) throw Object.assign(new Error(value.error || "云端同步失败，本地内容已保留。"), { status: response.status });
  return value;
}
