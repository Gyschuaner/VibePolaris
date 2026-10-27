import { parseCanvas, type CanvasData } from "./canvas.ts";

export const canvasTransferHeader = "X-VP-Canvas-Texts";
const reference = "$canvasText";
const pools = new WeakMap<CanvasData, Promise<Map<string, string>>>();

// Reuse large immutable strings (including embedded images), while positions and metadata stay ordinary JSON.
export function canvasTexts(data?: CanvasData): Promise<Map<string, string>> {
  if (!data) return Promise.resolve(new Map());
  const cached = pools.get(data);
  if (cached) return cached;
  const strings = new Set<string>();
  function collect(value: unknown) {
    if (typeof value === "string" && value.length >= 16_384) strings.add(value);
    else if (value && typeof value === "object") Object.values(value).forEach(collect);
  }
  collect(data);
  const pool = Promise.all([...strings].map(async text => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    return [hash, text] as const;
  })).then(entries => new Map(entries));
  pools.set(data, pool);
  return pool;
}

export async function encodeCanvas(data: CanvasData, known: Set<string>) {
  const texts = new Map([...(await canvasTexts(data))].filter(([hash]) => known.has(hash)).map(([hash, text]) => [text, hash]));
  return JSON.parse(JSON.stringify(data, (_key, value) => typeof value === "string" && texts.has(value) ? { [reference]: texts.get(value) } : value));
}

export function decodeCanvas(value: unknown, texts: Map<string, string>): CanvasData {
  return parseCanvas(JSON.parse(JSON.stringify(value), (_key, part) => {
    if (!part || typeof part !== "object" || !Object.hasOwn(part, reference)) return part;
    const text = texts.get(part[reference]);
    if (Object.keys(part).length !== 1 || text === undefined) throw new Error("同步引用的正文尚未缓存，当前本地内容已保留。请重试同步。");
    return text;
  }));
}

export function knownCanvasTexts(header: string | null): Set<string> {
  // Bound the opt-in header; omitted strings simply use the existing full-text transfer.
  return new Set((header ?? "").split(",").slice(0, 64).filter(hash => /^[a-f0-9]{64}$/.test(hash)));
}
