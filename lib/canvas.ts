import { z } from "zod";

const point = { x: z.number(), y: z.number() };
const nodeSchema = z.object({
  id: z.string().min(1), markdown: z.string(), fileName: z.string(), ...point,
  createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }),
});
const edgeSchema = z.object({ id: z.string().min(1), from: z.string(), to: z.string() });
const canvasSchema = z.object({
  version: z.literal(1), revision: z.number().int().nonnegative(),
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
export type CanvasEdge = z.infer<typeof edgeSchema>;
export type CanvasData = z.infer<typeof canvasSchema>;
export type CanvasView = CanvasData["view"];

export const emptyCanvas = (): CanvasData => ({ version: 1, revision: 0, nodes: [], edges: [], view: { x: 0, y: 0, scale: 1 } });
export const parseCanvas = (value: unknown): CanvasData => canvasSchema.parse(value);

function plain(text: string) {
  return text.replace(/!?(?:\[([^\]]*)\])\([^)]*\)/g, "$1").replace(/<[^>]*>/g, "")
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s*|[-*+]\s+|\d+[.)]\s+|\[[ xX]\]\s*)/gm, "")
    .replace(/([*_~`])\1*([^\n]*?)\1+/g, "$2").replace(/\s+/g, " ").trim();
}

export function nodePreview(node: Pick<CanvasNode, "markdown" | "fileName">) {
  const text = node.markdown.replace(/^\uFEFF/, "").replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
    .replace(/^[ \t]*(```|~~~)[\s\S]*?(?:\1|$)/gm, "");
  const heading = text.match(/^[ \t]{0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  const first = lines.find(line => !/^\s*(?:---+|===+)\s*$/.test(line)) || "";
  const title = plain(heading?.[1] || node.fileName.replace(/\.(?:md|markdown)$/i, "") || first) || "未命名笔记";
  const body = text.split(/\r?\n[ \t]*\r?\n/).map(block => block.split(/\r?\n/)
    .filter(line => !/^[ \t]{0,3}#{1,6}[ \t]+/.test(line) && !/^\s*(?:---+|===+)\s*$/.test(line)).map(plain).filter(Boolean).join(" "))
    .find(block => block && block !== title) || "";
  return { title: Array.from(title).slice(0, 70).join(""), summary: Array.from(body === title ? "" : body).slice(0, 180).join("") };
}

export function availablePosition(nodes: Pick<CanvasNode, "x" | "y">[], start: { x: number; y: number }, columns = 3) {
  for (let index = 0; ; index++) {
    const point = { x: start.x + (index % columns) * 330, y: start.y + Math.floor(index / columns) * 170 };
    if (!nodes.some(node => point.x < node.x + 320 && point.x + 320 > node.x && point.y < node.y + 150 && point.y + 150 > node.y)) return point;
  }
}

export function markdownFileName(node: Pick<CanvasNode, "markdown" | "fileName">) {
  const name = nodePreview(node).title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/, "");
  return `${Array.from(name || "未命名笔记").slice(0, 100).join("")}.md`;
}

export function connectNodes(data: CanvasData, from: string, to: string): CanvasData {
  if (from === to || !data.nodes.some(node => node.id === from) || !data.nodes.some(node => node.id === to)
    || data.edges.some(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from))) return data;
  return { ...data, edges: [...data.edges, { id: crypto.randomUUID(), from, to }] };
}

export function moveView(view: CanvasView, scale: number, x: number, y: number): CanvasView {
  const next = Math.min(2, Math.max(.3, scale));
  return { x: x - (x - view.x) * next / view.scale, y: y - (y - view.y) * next / view.scale, scale: next };
}

export function curve(from: { x: number; y: number }, to: { x: number; y: number }) {
  const bend = Math.max(50, Math.abs(to.x - from.x) * .45) * (to.x >= from.x ? 1 : -1);
  return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`;
}
