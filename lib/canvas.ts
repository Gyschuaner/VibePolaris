import { z } from "zod";
import { noteSchema } from "./reading-notes.ts";

const point = { x: z.number(), y: z.number() };
const articleSchema = z.object({ markdown: z.string(), sourceHash: z.string(), generatedAt: z.iso.datetime({ offset: true }), complete: z.boolean() });
const provenanceSchema = z.object({ sourceId: z.string(), sourceVariant: z.enum(["draft", "article"]), generatedAt: z.iso.datetime({ offset: true }), status: z.enum(["pending", "accepted"]) });
const nodeMetadata = z.object({
  kind: z.enum(["note", "link", "image", "todo"]).optional(),
  title: z.string().max(140).optional(), summary: z.string().max(600).optional(),
  ai: provenanceSchema.optional(),
});
const nodeSchema = z.object({
  id: z.string().min(1), markdown: z.string(), fileName: z.string(), ...point,
  ...nodeMetadata.shape,
  article: articleSchema.optional(), articleProposal: articleSchema.optional(),
  annotations: z.object({ draft: z.array(noteSchema).max(1000).optional(), article: z.array(noteSchema).max(1000).optional() }).optional(),
  createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }),
});
export const canvasPorts = ["top", "right", "bottom", "left"] as const;
const edgeSchema = z.object({
  id: z.string().min(1), from: z.string(), to: z.string(),
  fromPort: z.enum(canvasPorts).optional(), toPort: z.enum(canvasPorts).optional(),
  direction: z.enum(["none", "start", "end", "both"]).optional(), dashed: z.boolean().optional(),
});
// Older clients must reject this version rather than discard reading annotations.
const canvasSchema = z.object({
  version: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).transform(() => 5 as const), revision: z.number().int().nonnegative(),
  nodes: z.array(nodeSchema), edges: z.array(edgeSchema),
  view: z.object({ ...point, scale: z.number().min(.3).max(2) }),
}).refine(value => {
  const ids = new Set(value.nodes.map(node => node.id));
  const pairs = value.edges.map(edge => [edge.from, edge.to].sort().join("\0"));
  return ids.size === value.nodes.length && new Set(value.edges.map(edge => edge.id)).size === value.edges.length
    && new Set(pairs).size === pairs.length
    && value.edges.every(edge => edge.from !== edge.to && ids.has(edge.from) && ids.has(edge.to));
});

export type CanvasNode = z.infer<typeof nodeSchema>;
export type NodeKind = NonNullable<CanvasNode["kind"]>;
export const nodeKinds = { note: "笔记", link: "链接", image: "图片", todo: "待办" } as const;
export type CanvasEdge = z.infer<typeof edgeSchema>;
export type CanvasPort = typeof canvasPorts[number];
export type CanvasData = z.infer<typeof canvasSchema>;
export type CanvasView = CanvasData["view"];

export const emptyCanvas = (): CanvasData => ({ version: 5, revision: 0, nodes: [], edges: [], view: { x: 0, y: 0, scale: 1 } });
export const parseCanvas = (value: unknown): CanvasData => canvasSchema.parse(value);

function plain(text: string) {
  return text.replace(/!?(?:\[([^\]]*)\])\([^)]*\)/g, "$1").replace(/<[^>]*>/g, "")
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s*|[-*+]\s+|\d+[.)]\s+|\[[ xX]\]\s*)/gm, "")
    .replace(/==([^\n]+?)==/g, "$1")
    .replace(/([*_~`])\1*([^\n]*?)\1+/g, "$2").replace(/\s+/g, " ").trim();
}

export function nodePreview(node: Pick<CanvasNode, "markdown" | "fileName" | "kind" | "title" | "summary">) {
  if (node.title?.trim() && node.summary !== undefined) return { title: Array.from(node.title.trim()).slice(0, 70).join(""), summary: node.summary };
  const text = node.markdown.replace(/^\uFEFF/, "").replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
    .replace(/^[ \t]*(```|~~~)[\s\S]*?(?:\1|$)/gm, "");
  const heading = text.match(/^[ \t]{0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  const first = lines.find(line => !/^\s*(?:---+|===+)\s*$/.test(line)) || "";
  const title = node.title?.trim() || plain(heading?.[1] || node.fileName.replace(/\.(?:md|markdown)$/i, "") || (node.kind && node.kind !== "note" ? "" : first)) || `未命名${nodeKinds[node.kind ?? "note"]}`;
  const body = text.split(/\r?\n[ \t]*\r?\n/).map(block => block.split(/\r?\n/)
    .filter(line => !/^[ \t]{0,3}#{1,6}[ \t]+/.test(line) && !/^\s*(?:---+|===+)\s*$/.test(line)).map(plain).filter(Boolean).join(" "))
    .find(block => block && block !== title) || "";
  return { title: Array.from(title).slice(0, 70).join(""), summary: node.summary ?? (node.kind && node.kind !== "note" ? "" : Array.from(body === title ? "" : body).slice(0, 180).join("")) };
}

export function exportNodeMarkdown(node: CanvasNode) {
  const { kind, title, summary, ai } = node;
  if (!kind && title === undefined && summary === undefined && !ai) return node.markdown;
  const metadata = JSON.stringify({ kind, title, summary, ai: ai && { ...ai, status: "accepted" } }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return `<!-- vibepolaris-node ${metadata} -->\n${node.markdown}`;
}

export function importNodeMarkdown(markdown: string): Pick<CanvasNode, "markdown" | "kind" | "title" | "summary"> {
  const header = markdown.match(/^<!-- vibepolaris-node (.+) -->\r?\n/);
  if (header) {
    try { return { ...nodeMetadata.parse(JSON.parse(header[1])), markdown: markdown.slice(header[0].length) }; }
    catch { throw new Error("节点元数据无法读取，原有画布未改动。请检查文件开头的 vibepolaris-node 信息。"); }
  }
  return { markdown };
}

export function nodeResource(node: Pick<CanvasNode, "kind" | "markdown">) {
  const line = node.markdown.split(/\r?\n/, 1)[0];
  return node.kind === "image" ? line.match(/^!\[[^\]]*\]\(<(.*)>\)$/)?.[1] ?? line.match(/^!\[[^\]]*\]\((.*)\)$/)?.[1] ?? "" : line;
}

export function withNodeResource(node: Pick<CanvasNode, "kind" | "markdown">, url: string) {
  const lines = node.markdown.split(/\r?\n/);
  if (node.kind !== "image" || /^!\[/.test(lines[0])) lines.shift();
  return [node.kind === "image" ? `![图片](<${url.replace(/[<>\r\n]/g, "")}>)` : url, ...lines].join("\n");
}

export function safeNodeUrl(value: string, image = false): string | undefined {
  if (/\s/.test(value) || !value) return;
  if (image && /^data:image\/(?:png|jpeg|gif|webp|avif);base64,[A-Za-z0-9+/]+=*$/.test(value)) return value;
  if (/^\/(?!\/)/.test(value)) return value;
  try { const url = new URL(value); if (url.protocol === "https:" || url.protocol === "http:") return url.href; } catch { /* A partially typed address stays editable. */ }
}

export function nodeTasks(markdown: string) {
  let fence = "";
  return markdown.split(/\r?\n/).flatMap((line, index) => {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (delimiter) { if (!fence) fence = delimiter[1]; else if (delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length) fence = ""; return []; }
    if (fence) return [];
    const task = line.match(/^\s*[-*+] \[([ xX])\] ?(.*)$/);
    return task ? [{ line: index, checked: task[1].toLowerCase() === "x", text: task[2] }] : [];
  });
}

export function editNodeTask(markdown: string, line: number, checked: boolean | null) {
  return markdown.split(/\r?\n/).flatMap((text, index) => index !== line ? [text] : checked === null ? [] : [text.replace(/^(\s*[-*+] \[)[ xX](\])/, `$1${checked ? "x" : " "}$2`)]).join("\n");
}

export function availablePosition(nodes: Pick<CanvasNode, "x" | "y" | "kind">[], start: { x: number; y: number }, columns = 3, height = 150) {
  for (let index = 0; ; index++) {
    const point = { x: start.x + (index % columns) * 330, y: start.y + Math.floor(index / columns) * (height + 20) };
    if (!nodes.some(node => point.x < node.x + 320 && point.x + 320 > node.x && point.y < node.y + (node.kind === "image" ? 260 : 150) && point.y + height > node.y)) return point;
  }
}

export function markdownFileName(node: Pick<CanvasNode, "markdown" | "fileName">) {
  const name = nodePreview(node).title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/, "");
  return `${Array.from(name || "未命名笔记").slice(0, 100).join("")}.md`;
}

export function connectNodes(data: CanvasData, from: string, to: string, ports: Pick<CanvasEdge, "fromPort" | "toPort"> = {}): CanvasData {
  if (from === to || !data.nodes.some(node => node.id === from) || !data.nodes.some(node => node.id === to)) return data;
  const existing = data.edges.find(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from));
  if (existing) {
    const patch = Object.fromEntries(Object.entries(existing.from === from ? ports : { fromPort: ports.toPort, toPort: ports.fromPort }).filter(([, value]) => value !== undefined));
    if (Object.entries(patch).every(([key, value]) => existing[key as "fromPort" | "toPort"] === value)) return data;
    return { ...data, edges: data.edges.map(edge => edge.id === existing.id ? { ...edge, ...patch } : edge) };
  }
  return { ...data, edges: [...data.edges, { id: crypto.randomUUID(), from, to, ...ports }] };
}

export function moveView(view: CanvasView, scale: number, x: number, y: number): CanvasView {
  const next = Math.min(2, Math.max(.3, scale));
  return { x: x - (x - view.x) * next / view.scale, y: y - (y - view.y) * next / view.scale, scale: next };
}
