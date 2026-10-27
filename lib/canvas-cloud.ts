import type { CanvasData } from "./canvas";
import type { CloudCanvas } from "./account/canvas-store";
import { canvasTexts, canvasTransferHeader, decodeCanvas, encodeCanvas } from "./canvas-transfer";

export const cloudPollInterval = 30 * 60 * 1000;

export async function cloudRequest(owner: string, options: { id?: string; method?: "POST" | "PUT"; body?: unknown; base?: CanvasData } = {}): Promise<CloudCanvas | null> {
  const texts = await canvasTexts(options.base), body = options.body as { data?: CanvasData } | undefined;
  const sent = body?.data;
  const payload = sent && options.base ? { ...body, data: await encodeCanvas(sent, new Set(texts.keys())) } : options.body;
  const response = await fetch(`/api/account/canvases${options.id ? `?id=${encodeURIComponent(options.id)}` : ""}`, {
    method: options.method || "GET", cache: "no-store", signal: AbortSignal.timeout(30_000),
    headers: { "X-VP-Account": owner, [canvasTransferHeader]: [...texts.keys()].slice(0, 64).join(","), ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.base ? { "If-None-Match": `"${options.base.revision}"` } : {}) },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (response.status === 304) return null;
  const value = await response.json();
  if (!response.ok) throw Object.assign(new Error(value.error || "云端同步失败，本地内容已保留。"), { status: response.status });
  if (response.headers.has(canvasTransferHeader)) value.data = decodeCanvas(value.data, sent ? await canvasTexts(sent) : texts);
  return value;
}
