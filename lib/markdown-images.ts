import type { MarkdownEdit } from "./markdown-editing";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Nodes } from "mdast";
import { safeNodeUrl } from "./canvas.ts";

export const MARKDOWN_IMAGE_ACCEPT = "image/png,image/jpeg,image/gif,image/webp,image/avif";
const DOCUMENT_LIMIT = 10 * 1024 * 1024;
type MarkdownImage = { name: string; source: string };
export type MarkdownImageRange = { from: number; to: number; source: string; alt: string };

export function markdownImageRanges(markdown: string): MarkdownImageRange[] {
  const tree = fromMarkdown(markdown), definitions = new Map<string, string>(), images: MarkdownImageRange[] = [];
  function collect(node: Nodes) {
    if (node.type === "definition") definitions.set(node.identifier.toUpperCase(), node.url);
    if ("children" in node) node.children.forEach(collect);
  }
  function visit(node: Nodes) {
    if (node.type === "image" || node.type === "imageReference") {
      const source = safeNodeUrl(node.type === "image" ? node.url : definitions.get(node.identifier.toUpperCase()) ?? "", true);
      if (source && node.position?.start.offset !== undefined && node.position.end.offset !== undefined) images.push({ from: node.position.start.offset, to: node.position.end.offset, source, alt: node.alt || "图片" });
    }
    if ("children" in node) node.children.forEach(visit);
  }
  collect(tree); visit(tree); return images;
}

export async function readMarkdownImages(files: File[]): Promise<MarkdownImage[]> {
  if (files.some(file => !MARKDOWN_IMAGE_ACCEPT.split(",").includes(file.type) || file.size > 5 * 1024 * 1024)) {
    throw new Error("请选择 5 MB 以内的 PNG、JPEG、GIF、WebP 或 AVIF 图片。");
  }
  if (files.reduce((bytes, file) => bytes + Math.ceil(file.size / 3) * 4, 0) > DOCUMENT_LIMIT) {
    throw new Error("插入图片后的 Markdown 不能超过 10 MB，请减少图片或缩小后再试。");
  }
  return Promise.all(files.map(async file => {
    const source = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reader.onabort = () => reject(new Error("图片读取失败，请重试。"));
      reader.readAsDataURL(file);
    });
    const image = new Image(); image.src = source;
    try { await image.decode(); } catch { throw new Error("图片无法读取，请换一张有效图片。"); }
    return { name: file.name, source };
  }));
}

export function insertMarkdownImages(value: string, at: number, images: MarkdownImage[]): MarkdownEdit {
  const body = images.map(image => {
    const label = (image.name.replace(/\.[^.]+$/, "").replace(/[\r\n]/g, " ").slice(0, 120) || "图片").replace(/[\\[\]]/g, "\\$&");
    return `![${label}](<${image.source}>)`;
  }).join("\n\n");
  const before = at === 0 || value.slice(0, at).endsWith("\n\n") ? "" : value[at - 1] === "\n" ? "\n" : "\n\n";
  const after = value.slice(at).startsWith("\n\n") ? "" : value[at] === "\n" ? "\n" : "\n\n";
  const text = before + body + after;
  if (new TextEncoder().encode(value).length + new TextEncoder().encode(text).length > DOCUMENT_LIMIT) {
    throw new Error("插入图片后的 Markdown 不能超过 10 MB，请减少图片或缩小后再试。");
  }
  return { from: at, to: at, text, start: at + text.length, end: at + text.length };
}
